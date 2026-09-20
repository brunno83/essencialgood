// Supabase Edge Functions - Shared CORS Module

export const PRODUCTION_ALLOWED_ORIGINS = [
  "https://essencialgood.com",
  "https://www.essencialgood.com",
];

export const STAGING_ALLOWED_ORIGINS = [
  "https://staging.essencialgood.com",
];

export const DEV_ALLOWED_LOCAL_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "https://localhost:5173",
  "https://127.0.0.1:5173",
  "https://localhost:4173",
  "https://127.0.0.1:4173",
];

export function isAllowedCorsOrigin(origin: string, envString: string): boolean {
  if (!origin || typeof origin !== "string") return false;
  const lowerOrigin = origin.toLowerCase().trim();
  const environment = envString.toLowerCase().trim();

  // Rejeita origens nulas, malformadas ou com caracteres perigosos
  if (lowerOrigin === "null" || lowerOrigin.includes("\0") || lowerOrigin.includes("\r") || lowerOrigin.includes("\n")) {
    return false;
  }

  const isProduction = environment === "production";
  const isStaging = environment === "staging";
  const isDev = environment === "development" || environment === "test";

  // Se o ambiente for ausente ou desconhecido, falha fechado (NÃO faz fallback para produção)
  if (!isProduction && !isStaging && !isDev) {
    return false;
  }

  // 1. Em Produção: aceita EXCLUSIVAMENTE domínios de produção
  if (isProduction) {
    return PRODUCTION_ALLOWED_ORIGINS.includes(lowerOrigin);
  }

  // 2. Em Staging: aceita EXCLUSIVAMENTE o subdomínio dedicado de staging
  if (isStaging) {
    return STAGING_ALLOWED_ORIGINS.includes(lowerOrigin);
  }

  // 3. Em Dev/Test: aceita EXCLUSIVAMENTE portas locais autorizadas (5173, 4173)
  if (isDev) {
    return DEV_ALLOWED_LOCAL_ORIGINS.includes(lowerOrigin);
  }

  return false;
}

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

  if (isAllowedCorsOrigin(origin, environment)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  // Se a origem estiver presente mas NÃO for autorizada, o cabeçalho Access-Control-Allow-Origin NÃO é incluído.
  return headers;
}

export function handleCorsPreflight(req: Request): Response | null {
  const origin = req.headers.get("origin");
  const environment = (Deno.env.get("DENO_ENV") || Deno.env.get("ENVIRONMENT") || "").toLowerCase().trim();

  // Se a origem estiver presente no cabeçalho, verifica se está na lista permitida
  if (origin) {
    if (!isAllowedCorsOrigin(origin, environment)) {
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
