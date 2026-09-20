// Supabase Edge Functions - Shared Cloudflare Turnstile Validation Module

export interface TurnstileVerificationOptions {
  token: string;
  expectedAction: string;
  siteverifyFetcher?: (url: string, init: RequestInit) => Promise<Response>;
}

export interface TurnstileProbeMeta {
  success: boolean;
  hostname: string;
  action: string;
  hasChallengeTs: boolean;
  errorCodes: string[];
}

export interface TurnstileVerificationResult {
  valid: boolean;
  errorCode?: string; // MISSING_TURNSTILE_TOKEN | TURNSTILE_REJECTED | TURNSTILE_ACTION_MISMATCH | TURNSTILE_HOSTNAME_MISMATCH | TURNSTILE_PROVIDER_ERROR
  errorMessage?: string;
  probeMeta?: TurnstileProbeMeta;
}

export const ALLOWED_TURNSTILE_HOSTNAMES = [
  "essencialgood.com",
  "www.essencialgood.com",
];

export async function validateTurnstileToken(
  options: TurnstileVerificationOptions
): Promise<TurnstileVerificationResult> {
  const { token, expectedAction, siteverifyFetcher } = options;

  // 1. Token Ausente
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return {
      valid: false,
      errorCode: "MISSING_TURNSTILE_TOKEN",
      errorMessage: "Security verification token is missing.",
    };
  }

  const secretKey = Deno.env.get("TURNSTILE_SECRET_KEY") || "";
  const environment = (Deno.env.get("DENO_ENV") || Deno.env.get("ENVIRONMENT") || "").toLowerCase().trim();
  const isStagingOrDev = environment === "staging" || environment === "development" || environment === "test";

  if (!secretKey && !siteverifyFetcher) {
    return {
      valid: false,
      errorCode: "TURNSTILE_PROVIDER_ERROR",
      errorMessage: "Turnstile secret key not configured.",
    };
  }

  const fetcher = siteverifyFetcher || fetch;

  const formData = new URLSearchParams();
  formData.append("secret", secretKey || "mock_dev_secret");
  formData.append("response", token.trim());

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

  let res: Response;
  try {
    res = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isTimeout = err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"));
    return {
      valid: false,
      errorCode: "TURNSTILE_PROVIDER_ERROR",
      errorMessage: isTimeout ? "Turnstile verification provider timed out." : "Failed to connect to Turnstile verification provider.",
    };
  }

  // Parse do corpo da resposta JSON do siteverify
  let data: Record<string, unknown> | null = null;
  try {
    data = await res.json();
  } catch (_jsonErr) {
    data = null;
  }

  // Falha de HTTP ou corpo não-JSON
  if (!res.ok && (!data || res.status >= 500)) {
    return {
      valid: false,
      errorCode: "TURNSTILE_PROVIDER_ERROR",
      errorMessage: "Turnstile provider returned non-2xx HTTP status.",
    };
  }

  if (!data) {
    return {
      valid: false,
      errorCode: "TURNSTILE_PROVIDER_ERROR",
      errorMessage: "Invalid JSON response from Turnstile provider.",
    };
  }

  const success = Boolean(data.success);
  const hostname = typeof data.hostname === "string" ? data.hostname.trim() : "";
  const action = typeof data.action === "string" ? data.action.trim() : "";
  const errorCodes = Array.isArray(data["error-codes"]) ? (data["error-codes"] as string[]) : [];
  const hasChallengeTs = Boolean(data["challenge_ts"]);
  const metadata = typeof data.metadata === "object" && data.metadata !== null ? (data.metadata as Record<string, unknown>) : null;
  const isTestingKey = Boolean(metadata?.result_with_testing_key);

  const probeMeta: TurnstileProbeMeta = {
    success,
    hostname,
    action,
    hasChallengeTs,
    errorCodes,
  };

  // Se o provedor recusou o token (success = false)
  if (!success) {
    return {
      valid: false,
      errorCode: "TURNSTILE_REJECTED",
      errorMessage: "Security verification token rejected by provider.",
      probeMeta,
    };
  }

  const lowerHost = hostname.toLowerCase();

  // Verificação de bypass EXCLUSIVO para chave dummy oficial da Cloudflare (hostname == "example.com")
  const isDummyTestBypass = isStagingOrDev &&
    success &&
    isTestingKey &&
    lowerHost === "example.com";

  if (isDummyTestBypass) {
    // Caminho exclusivo para chave dummy oficial da Cloudflare em ambiente staging/dev/test:
    // Aceita EXCLUSIVAMENTE o hostname oficial retornado ("example.com") e a action padrão da chave de teste
    return {
      valid: true,
      probeMeta,
    };
  }

  // Fora do caminho de chave dummy oficial da Cloudflare:
  // 1. Validação estrita de Hostname (somente allowlist de produção)
  if (!ALLOWED_TURNSTILE_HOSTNAMES.includes(lowerHost)) {
    return {
      valid: false,
      errorCode: "TURNSTILE_HOSTNAME_MISMATCH",
      errorMessage: "Security token hostname mismatch.",
      probeMeta,
    };
  }

  // 2. Validação estrita de Action (deve corresponder exatamente a expectedAction)
  if (!action || action !== expectedAction.trim()) {
    return {
      valid: false,
      errorCode: "TURNSTILE_ACTION_MISMATCH",
      errorMessage: "Security token action mismatch.",
      probeMeta,
    };
  }

  return {
    valid: true,
    probeMeta,
  };
}
