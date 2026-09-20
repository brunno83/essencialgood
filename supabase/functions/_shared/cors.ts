// Supabase Edge Functions - Shared CORS Module

export const ALLOWED_ORIGINS = [
  "https://essencialgood.com",
  "https://www.essencialgood.com",
];

export function getCorsHeaders(req?: Request): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };

  if (!req) {
    return headers;
  }

  const origin = req.headers.get("origin");
  if (!origin) {
    return headers;
  }

  const environment = (Deno.env.get("DENO_ENV") || Deno.env.get("ENVIRONMENT") || "").toLowerCase().trim();
  const isDev = environment === "development" || environment === "test";

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else if (isDev && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  // Se a origem estiver presente mas NÃO for autorizada, o cabeçalho Access-Control-Allow-Origin NÃO é incluído.
  return headers;
}

export function handleCorsPreflight(req: Request): Response | null {
  const origin = req.headers.get("origin");
  const environment = (Deno.env.get("DENO_ENV") || Deno.env.get("ENVIRONMENT") || "").toLowerCase().trim();
  const isDev = environment === "development" || environment === "test";

  // Se a origem estiver presente no cabeçalho, verifica se está na lista permitida
  if (origin) {
    const isAllowed = ALLOWED_ORIGINS.includes(origin) ||
      (isDev && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")));

    if (!isAllowed) {
      // Origem não autorizada: HTTP 403 imediato sem Access-Control-Allow-Origin, com Vary: Origin
      return new Response(
        JSON.stringify({ error: "Origin forbidden by CORS policy.", code: "CORS_ORIGIN_FORBIDDEN" }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Vary": "Origin",
          },
        }
      );
    }
  }

  // Preflight OPTIONS para origem permitida ou ausente
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(req),
    });
  }

  return null;
}
