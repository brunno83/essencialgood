// Supabase Edge Functions - Shared Crypto & Opaque Key Anonymization Module

export async function hmacSha256Hex(text: string, secretPepper: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretPepper || "default_local_fallback_pepper_2026");
  const messageData = encoder.encode(text);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function extractClientIp(req: Request): string {
  // 1. Prioriza header cf-connecting-ip injetado pela rede Cloudflare/Supabase
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim().length > 0) {
    return cfIp.trim();
  }

  // 2. Extrai o primeiro IP (hop inicial do cliente) de x-forwarded-for
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor && xForwardedFor.trim().length > 0) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    if (ips.length > 0 && ips[0].length > 0) {
      return ips[0];
    }
  }

  // 3. Fallback seguro para desenvolvimento local
  return "127.0.0.1";
}

/**
 * Gera um bucket_key 100% opaco no formato scope:HMAC-SHA256(pepper, scope:identifier)
 * Nenhum UID, Session UUID, Conversation ID ou IP bruto é gravado em texto claro.
 */
export async function generateOpaqueBucketKey(scope: string, rawIdentifier: string): Promise<string> {
  const pepper = Deno.env.get("RATE_LIMIT_PEPPER") || "default_local_fallback_pepper_2026";
  const rawTarget = `${scope}:${rawIdentifier}`;
  const digest = await hmacSha256Hex(rawTarget, pepper);
  return `${scope}:${digest}`;
}

export async function getAnonymizedIpHash(req: Request): Promise<string> {
  const rawIp = extractClientIp(req);
  const pepper = Deno.env.get("RATE_LIMIT_PEPPER") || "default_local_fallback_pepper_2026";
  return await hmacSha256Hex(rawIp, pepper);
}
