// ESSENCIAL GOOD - PURE SHARED ENVIRONMENT GUARD MODULE
// Validates environment configuration and prevents environment mix-ups between Dev, Staging & Production.

export const STAGING_PROJECT_REF = "zauvpsxeexwthobmbkku";
export const PRODUCTION_PROJECT_REF = "axgpmpnipwyfirlplbjv";

export const STAGING_SUPABASE_URL = `https://${STAGING_PROJECT_REF}.supabase.co`;
export const PRODUCTION_SUPABASE_URL = `https://${PRODUCTION_PROJECT_REF}.supabase.co`;

export const OFFICIAL_DUMMY_TURNSTILE_SITE_KEYS = [
  "1x00000000000000000000AA", // Always passes
  "2x00000000000000000000AB", // Always blocks
  "3x00000000000000000000FF", // Forces challenge
  "1x00000000000000000000BB",
  "2x00000000000000000000BB",
  "3x00000000000000000000BB",
];

export function isDummyTurnstileSiteKey(key) {
  if (!key || typeof key !== "string") return false;
  const trimmed = key.trim();
  if (OFFICIAL_DUMMY_TURNSTILE_SITE_KEYS.includes(trimmed)) return true;
  if (/^[123]x00000000/.test(trimmed)) return true;
  return false;
}

export function isPlaceholderValue(val) {
  if (!val || typeof val !== "string") return true;
  const upper = val.trim().toUpperCase();
  if (upper.length === 0) return true;

  if (
    upper.includes("REPLACE_WITH") ||
    upper.includes("YOUR_") ||
    upper.includes("CHANGE_ME") ||
    upper.includes("TODO") ||
    upper.includes("PLACEHOLDER") ||
    upper.includes("KEY_PLACEHOLDER") ||
    upper.includes("ANON_KEY_PLACEHOLDER") ||
    upper.includes("PRODUCTIONKEYPLACEHOLDER") ||
    upper.includes("STAGINGKEYPLACEHOLDER") ||
    (upper.startsWith("<") && upper.endsWith(">"))
  ) {
    return true;
  }
  return false;
}

export function sanitizeKeyForLog(key) {
  if (!key || typeof key !== "string" || key.trim().length === 0 || isPlaceholderValue(key)) {
    return "[missing]";
  }
  return "[configured]";
}

export function validateEnvConfig(rawConfig = {}) {
  const appEnv = (rawConfig.VITE_APP_ENV || rawConfig.appEnv || "").trim();
  const expectedRef = (rawConfig.VITE_EXPECTED_SUPABASE_PROJECT_REF || rawConfig.expectedRef || "").trim();
  const supabaseUrl = (rawConfig.VITE_SUPABASE_URL || rawConfig.supabaseUrl || "").trim();
  const anonKey = (rawConfig.VITE_SUPABASE_ANON_KEY || rawConfig.anonKey || "").trim();
  const turnstileSiteKey = (rawConfig.VITE_TURNSTILE_SITE_KEY || rawConfig.turnstileSiteKey || "").trim();
  const vercelEnv = (rawConfig.VERCEL_ENV || rawConfig.vercelEnv || "").trim();

  // 1. Campos Obrigatórios
  const missing = [];
  if (!appEnv) missing.push("VITE_APP_ENV");
  if (!expectedRef) missing.push("VITE_EXPECTED_SUPABASE_PROJECT_REF");
  if (!supabaseUrl) missing.push("VITE_SUPABASE_URL");
  if (!anonKey) missing.push("VITE_SUPABASE_ANON_KEY");
  if (!turnstileSiteKey) missing.push("VITE_TURNSTILE_SITE_KEY");

  if (missing.length > 0) {
    throw new Error(`Environment configuration error: Missing required variable(s): ${missing.join(", ")}.`);
  }

  // 2. Rejeitar Placeholders Conhecidos
  if (isPlaceholderValue(appEnv)) {
    throw new Error("Environment configuration error: Variable VITE_APP_ENV contains a placeholder value.");
  }
  if (isPlaceholderValue(expectedRef)) {
    throw new Error("Environment configuration error: Variable VITE_EXPECTED_SUPABASE_PROJECT_REF contains a placeholder value.");
  }
  if (isPlaceholderValue(supabaseUrl)) {
    throw new Error("Environment configuration error: Variable VITE_SUPABASE_URL contains a placeholder value.");
  }
  if (isPlaceholderValue(anonKey)) {
    throw new Error("Environment configuration error: Variable VITE_SUPABASE_ANON_KEY contains a placeholder value.");
  }
  if (isPlaceholderValue(turnstileSiteKey)) {
    throw new Error("Environment configuration error: Variable VITE_TURNSTILE_SITE_KEY contains a placeholder value.");
  }

  // 3. Ambientes Conhecidos
  const allowedEnvs = ["development", "staging", "production"];
  if (!allowedEnvs.includes(appEnv)) {
    throw new Error("Environment configuration error: Invalid VITE_APP_ENV value. Must be 'development', 'staging', or 'production'.");
  }

  // 4. Regras de VERCEL_ENV (Se presente)
  if (vercelEnv) {
    if (vercelEnv === "production" && appEnv !== "production") {
      throw new Error("Environment configuration mismatch: VERCEL_ENV 'production' requires VITE_APP_ENV 'production'.");
    }
    if (vercelEnv === "preview" && appEnv !== "staging") {
      throw new Error("Environment configuration mismatch: VERCEL_ENV 'preview' requires VITE_APP_ENV 'staging'.");
    }
    if (vercelEnv === "development" && appEnv === "production") {
      throw new Error("Environment configuration mismatch: VERCEL_ENV 'development' cannot target VITE_APP_ENV 'production'.");
    }
  }

  // 5. Análise Estrita da URL do Supabase
  let parsed;
  try {
    parsed = new URL(supabaseUrl);
  } catch {
    throw new Error("Environment configuration error: Invalid VITE_SUPABASE_URL format.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("Environment configuration error: VITE_SUPABASE_URL must use HTTPS protocol.");
  }

  if (parsed.port) {
    throw new Error("Environment configuration error: VITE_SUPABASE_URL cannot specify a port.");
  }

  if (parsed.pathname !== "/" && parsed.pathname !== "") {
    throw new Error("Environment configuration error: VITE_SUPABASE_URL cannot contain a path.");
  }

  if (parsed.search) {
    throw new Error("Environment configuration error: VITE_SUPABASE_URL cannot contain query parameters.");
  }

  if (parsed.hash) {
    throw new Error("Environment configuration error: VITE_SUPABASE_URL cannot contain a hash fragment.");
  }

  if (parsed.username || parsed.password) {
    throw new Error("Environment configuration error: VITE_SUPABASE_URL cannot contain credentials.");
  }

  const hostname = parsed.hostname.toLowerCase().trim();
  const parts = hostname.split(".");
  const derivedRef = parts[0];

  if (parts.length < 3 || hostname !== `${derivedRef}.supabase.co`) {
    throw new Error("Environment configuration error: VITE_SUPABASE_URL hostname must be '<project-ref>.supabase.co'.");
  }

  if (derivedRef !== expectedRef) {
    throw new Error("Environment configuration error: VITE_EXPECTED_SUPABASE_PROJECT_REF does not match URL project-ref.");
  }

  // 6. Matriz de Isolamento por Ambiente
  if (appEnv === "production") {
    if (expectedRef !== PRODUCTION_PROJECT_REF) {
      throw new Error("Environment configuration error: Production environment must target Production project-ref.");
    }
    if (isDummyTurnstileSiteKey(turnstileSiteKey)) {
      throw new Error("Environment configuration error: Production environment cannot use official Cloudflare dummy Turnstile site key.");
    }
    if (vercelEnv !== "production") {
      throw new Error("Environment configuration mismatch: Local production build unauthorized. Production builds require VERCEL_ENV='production'.");
    }
  } else {
    // staging ou development
    if (expectedRef === PRODUCTION_PROJECT_REF) {
      throw new Error("Environment configuration error: Staging/Development environment cannot target Production Supabase.");
    }
    if (expectedRef !== STAGING_PROJECT_REF) {
      throw new Error("Environment configuration error: Staging/Development environment must target Staging project-ref.");
    }
  }

  return Object.freeze({
    appEnv,
    expectedRef,
    supabaseUrl,
    anonKey,
    turnstileSiteKey,
    isProduction: appEnv === "production",
    isStaging: appEnv === "staging",
    isDevelopment: appEnv === "development",
  });
}
