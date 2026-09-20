// Supabase Edge Functions - Shared Rate Limit Evaluator Module

import { logWarn } from "./logger.ts";

export interface RateLimitCheckRequest {
  bucketKey: string;
  scope: string;
  capacity: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  mode: "monitor" | "enforce";
}

export type RpcCaller = (
  functionName: string,
  params: Record<string, unknown>
) => Promise<{ data: unknown; error: unknown }>;

export function getRateLimitMode(): "monitor" | "enforce" {
  const rawMode = (Deno.env.get("RATE_LIMIT_MODE") || "").toLowerCase().trim();

  if (rawMode === "monitor") {
    return "monitor";
  }

  if (rawMode === "enforce") {
    return "enforce";
  }

  // Comportamento seguro: se a variável estiver ausente ou com valor inválido,
  // assume 'enforce' em produção para evitar bypass permissivo não intencional.
  if (rawMode.length > 0 && rawMode !== "enforce") {
    logWarn("RateLimitMode", "INVALID_MODE_FALLBACK_ENFORCE", `Raw mode: ${rawMode}`);
  }

  return "enforce";
}

export async function evaluateRateLimit(
  rpcCaller: RpcCaller,
  check: RateLimitCheckRequest
): Promise<RateLimitResult> {
  const mode = getRateLimitMode();

  try {
    const { data, error } = await rpcCaller("consume_rate_limit", {
      p_bucket_key: check.bucketKey,
      p_scope: check.scope,
      p_capacity: check.capacity,
      p_window_seconds: check.windowSeconds,
    });

    if (error || !data) {
      logWarn("RateLimit", "RPC_CHECK_FAILED", `Scope: ${check.scope}`);
      // Se houver falha no banco de rate limit, no modo enforce bloqueia preventivamente, no monitor libera
      return {
        allowed: mode === "monitor",
        retryAfterSeconds: mode === "enforce" ? 60 : 0,
        mode,
      };
    }

    const rows = Array.isArray(data) ? data : [data];
    const result = rows[0] as { allowed?: boolean; retry_after_seconds?: number } | undefined;

    const isAllowed = Boolean(result?.allowed);
    const retryAfter = typeof result?.retry_after_seconds === "number" ? result.retry_after_seconds : 0;

    if (!isAllowed) {
      logWarn("RateLimit", "LIMIT_EXCEEDED", `Scope: ${check.scope} | Mode: ${mode}`);

      if (mode === "monitor") {
        // No modo monitor, calcula e registra o evento, mas LIBERA a execução legítima
        return {
          allowed: true,
          retryAfterSeconds: 0,
          mode: "monitor",
        };
      }
    }

    return {
      allowed: isAllowed,
      retryAfterSeconds: retryAfter,
      mode,
    };
  } catch (err) {
    logWarn("RateLimit", "EXCEPTIONAL_CHECK_ERROR", String(err));
    return {
      allowed: mode === "monitor",
      retryAfterSeconds: mode === "enforce" ? 60 : 0,
      mode,
    };
  }
}

export async function evaluateDualWindowRateLimits(
  rpcCaller: RpcCaller,
  shortCheck: RateLimitCheckRequest,
  dailyCheck: RateLimitCheckRequest
): Promise<RateLimitResult> {
  const mode = getRateLimitMode();

  // Avalia primeira janela (curta)
  const shortResult = await evaluateRateLimit(rpcCaller, shortCheck);
  if (!shortResult.allowed && mode === "enforce") {
    return shortResult;
  }

  // Avalia segunda janela (diária)
  const dailyResult = await evaluateRateLimit(rpcCaller, dailyCheck);
  if (!dailyResult.allowed && mode === "enforce") {
    return dailyResult;
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    mode,
  };
}
