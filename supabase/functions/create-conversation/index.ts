// Supabase Edge Function: create-conversation
// Finalidade: Criação segura e idempotente de conversas para visitantes autenticados.

import { createClient } from "npm:@supabase/supabase-js@2.48.1";
import { handleCorsPreflight } from "../_shared/cors.ts";
import { readJsonBody, PayloadTooLargeError, UnsupportedMediaTypeError, MethodNotAllowedError, InvalidJsonError } from "../_shared/body.ts";
import { jsonResponse, errorResponse, rateLimitErrorResponse } from "../_shared/response.ts";
import { extractUserFromRequest, UnauthorizedError } from "../_shared/auth.ts";
import { validateTurnstileToken } from "../_shared/turnstile.ts";
import { generateOpaqueBucketKey, extractClientIp } from "../_shared/crypto.ts";
import { evaluateDualWindowRateLimits } from "../_shared/rate_limit.ts";
import { logWarn } from "../_shared/logger.ts";

export interface CreateConversationBody {
  turnstileToken: string;
  productName?: string;
  sourceUrl?: string;
  pageTitle?: string;
  pageType?: string;
}

Deno.serve(async (req: Request) => {
  // 1. Preflight CORS
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  try {
    // 2. Extração do usuário autenticado a partir do JWT do visitante
    const user = extractUserFromRequest(req);

    // 3. Leitura do corpo com trava estrita de 16 KB
    const body = await readJsonBody<CreateConversationBody>(req, 16384);

    // 4. Validação do Cloudflare Turnstile (action = 'create_conversation')
    const turnstileResult = await validateTurnstileToken({
      token: body.turnstileToken || "",
      expectedAction: "create_conversation",
    });

    if (!turnstileResult.valid) {
      const code = turnstileResult.errorCode || "TURNSTILE_REJECTED";
      const httpStatus = code === "TURNSTILE_PROVIDER_ERROR" ? 502 : 400;
      if (turnstileResult.probeMeta) {
        logWarn(
          "CreateConversation",
          code,
          `probe: success=${turnstileResult.probeMeta.success}, host=${turnstileResult.probeMeta.hostname}, action=${turnstileResult.probeMeta.action}, errs=${turnstileResult.probeMeta.errorCodes.join(",")}`
        );
      } else {
        logWarn("CreateConversation", code);
      }
      return errorResponse(
        turnstileResult.errorMessage || "Security verification failed.",
        code,
        httpStatus,
        req
      );
    }

    // 5. Avaliação de Rate Limit (Chaves 100% Opacas)
    const clientIp = extractClientIp(req);
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const rpcCaller = async (fn: string, params: Record<string, unknown>) => {
      return await adminClient.rpc(fn, params);
    };

    const uidShortKey = await generateOpaqueBucketKey("cc_uid_30m", user.user_id);
    const uidDailyKey = await generateOpaqueBucketKey("cc_uid_24h", user.user_id);

    const uidResult = await evaluateDualWindowRateLimits(
      rpcCaller,
      { bucketKey: uidShortKey, scope: "cc_uid_30m", capacity: 3, windowSeconds: 1800 },
      { bucketKey: uidDailyKey, scope: "cc_uid_24h", capacity: 10, windowSeconds: 86400 }
    );

    if (!uidResult.allowed) {
      return rateLimitErrorResponse(uidResult.retryAfterSeconds, req);
    }

    const ipShortKey = await generateOpaqueBucketKey("cc_ip_30m", clientIp);
    const ipDailyKey = await generateOpaqueBucketKey("cc_ip_24h", clientIp);

    const ipResult = await evaluateDualWindowRateLimits(
      rpcCaller,
      { bucketKey: ipShortKey, scope: "cc_ip_30m", capacity: 30, windowSeconds: 1800 },
      { bucketKey: ipDailyKey, scope: "cc_ip_24h", capacity: 200, windowSeconds: 86400 }
    );

    if (!ipResult.allowed) {
      return rateLimitErrorResponse(ipResult.retryAfterSeconds, req);
    }

    // 6. Invocação da RPC protegida usando service_role passando EXCLUSIVAMENTE o UID extraído do JWT
    const { data: convData, error: convError } = await adminClient.rpc("p_create_visitor_conversation", {
      p_visitor_id: user.user_id,
    });

    if (convError) {
      logWarn("CreateConversation", "RPC_CREATE_ERROR", convError.message);
      return errorResponse("Failed to create conversation.", "CREATE_CONVERSATION_FAILED", 500, req);
    }

    return jsonResponse(convData, 200, req);
  } catch (err: unknown) {
    if (err instanceof UnauthorizedError) {
      return errorResponse(err.message, "UNAUTHORIZED", 401, req);
    }
    if (err instanceof MethodNotAllowedError) {
      return errorResponse(err.message, "METHOD_NOT_ALLOWED", 405, req);
    }
    if (err instanceof UnsupportedMediaTypeError) {
      return errorResponse(err.message, "UNSUPPORTED_MEDIA_TYPE", 415, req);
    }
    if (err instanceof PayloadTooLargeError) {
      return errorResponse(err.message, "PAYLOAD_TOO_LARGE", 413, req);
    }
    if (err instanceof InvalidJsonError) {
      return errorResponse(err.message, "INVALID_JSON", 400, req);
    }

    logWarn("CreateConversation", "UNHANDLED_EXCEPTION", String(err));
    return errorResponse("An unexpected error occurred.", "INTERNAL_SERVER_ERROR", 500, req);
  }
});
