// Supabase Edge Functions - Shared Safe Body Parser Module

export class PayloadTooLargeError extends Error {
  constructor(message = "Payload too large. Exceeds 16 KB limit.") {
    super(message);
    this.name = "PayloadTooLargeError";
  }
}

export class UnsupportedMediaTypeError extends Error {
  constructor(message = "Unsupported Media Type. Content-Type must be application/json.") {
    super(message);
    this.name = "UnsupportedMediaTypeError";
  }
}

export class MethodNotAllowedError extends Error {
  constructor(message = "Method Not Allowed. Only POST is allowed.") {
    super(message);
    this.name = "MethodNotAllowedError";
  }
}

export class InvalidJsonError extends Error {
  constructor(message = "Invalid JSON body payload.") {
    super(message);
    this.name = "InvalidJsonError";
  }
}

export const MAX_BODY_BYTES = 16384; // 16 KB Hard Limit

export async function readJsonBody<T = Record<string, unknown>>(
  req: Request,
  maxBytes = MAX_BODY_BYTES
): Promise<T> {
  if (req.method !== "POST") {
    throw new MethodNotAllowedError();
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new UnsupportedMediaTypeError();
  }

  const contentLengthHeader = req.headers.get("content-length");
  if (contentLengthHeader) {
    const parsedLength = parseInt(contentLengthHeader, 10);
    if (!isNaN(parsedLength) && parsedLength > maxBytes) {
      throw new PayloadTooLargeError();
    }
  }

  if (!req.body) {
    throw new InvalidJsonError("Empty request body.");
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel("Payload exceeded 16 KB limit.");
          throw new PayloadTooLargeError();
        }
        chunks.push(value);
      }
    }
  } catch (err) {
    if (err instanceof PayloadTooLargeError) throw err;
    throw new InvalidJsonError("Failed to read body stream.");
  }

  const concatenated = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    concatenated.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const textDecoder = new TextDecoder("utf-8");
  const bodyText = textDecoder.decode(concatenated).trim();

  if (!bodyText) {
    throw new InvalidJsonError("Request body is empty.");
  }

  try {
    return JSON.parse(bodyText) as T;
  } catch {
    throw new InvalidJsonError();
  }
}
