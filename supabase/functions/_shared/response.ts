// Supabase Edge Functions - Shared Standardized Responses

import { getCorsHeaders } from "./cors.ts";

export function jsonResponse(
  data: unknown,
  status = 200,
  req?: Request,
  extraHeaders: Record<string, string> = {}
): Response {
  const cors = getCorsHeaders(req);
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...cors,
      ...extraHeaders,
    },
  });
}

export function errorResponse(
  message: string,
  code: string,
  status = 400,
  req?: Request,
  retryAfterSeconds?: number,
  extraHeaders: Record<string, string> = {}
): Response {
  const cors = getCorsHeaders(req);
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    ...cors,
    ...extraHeaders,
  };

  if (typeof retryAfterSeconds === "number" && retryAfterSeconds > 0) {
    headers["Retry-After"] = String(Math.ceil(retryAfterSeconds));
  }

  const payload: Record<string, unknown> = {
    error: message,
    code,
  };

  return new Response(JSON.stringify(payload), {
    status,
    headers,
  });
}

export function rateLimitErrorResponse(
  retryAfterSeconds: number,
  req?: Request
): Response {
  return errorResponse(
    "Too many requests. Please try again later.",
    "RATE_LIMIT_EXCEEDED",
    429,
    req,
    retryAfterSeconds
  );
}
