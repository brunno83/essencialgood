// Supabase Edge Function: send-message
// Finalidade: Envio seguro de mensagens pelo visitante autenticado.

import { createClient } from "npm:@supabase/supabase-js@2.48.1";
import { handleCorsPreflight } from "../_shared/cors.ts";
import { readJsonBody, PayloadTooLargeError, UnsupportedMediaTypeError, MethodNotAllowedError, InvalidJsonError } from "../_shared/body.ts";
import { jsonResponse, errorResponse, rateLimitErrorResponse } from "../_shared/response.ts";
import { extractUserFromRequest, UnauthorizedError } from "../_shared/auth.ts";
import { generateOpaqueBucketKey } from "../_shared/crypto.ts";
import { evaluateDualWindowRateLimits } from "../_shared/rate_limit.ts";
import { logWarn } from "../_shared/logger.ts";

export interface SendMessageBody {
  conversation_id: string;
  content: string;
  [key: string]: unknown;
}

export const FORBIDDEN_FIELDS = ["sender_type", "sender_id", "is_read", "role", "created_at", "read_at"];

Deno.serve(async (req: Request) => {
  // 1. Preflight CORS
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  try {
    // 2. Extração do usuário autenticado a partir do JWT do visitante
    const user = extractUserFromRequest(req);

    // 3. Leitura do corpo com limite de 16 KB
    const rawBody = await readJsonBody<SendMessageBody>(req, 16384);

    // 4. Rejeição estrita de campos administrativos injetados pelo cliente
    for (const forbiddenKey of FORBIDDEN_FIELDS) {
      if (forbiddenKey in rawBody) {
        return errorResponse(
          `Forbidden field '${forbiddenKey}' is not allowed in payload.`,
          "FORBIDDEN_PAYLOAD_FIELD",
          400,
          req
        );
      }
    }

    const { conversation_id, content } = rawBody;

    if (!conversation_id || typeof conversation_id !== "string" || conversation_id.trim().length === 0) {
      return errorResponse("Parameter 'conversation_id' is required.", "MISSING_CONVERSATION_ID", 400, req);
    }

    const trimmedContent = (content || "").trim();
    if (trimmedContent.length === 0 || trimmedContent.length > 4000) {
      return errorResponse(
        "Message content must be between 1 and 4000 characters.",
        "INVALID_CONTENT_LENGTH",
        400,
        req
      );
    }

    // 5. Avaliação de Rate Limit por UID + ConversationID (Chaves Opacas Digest)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const rpcCaller = async (fn: string, params: Record<string, unknown>) => {
      return await adminClient.rpc(fn, params);
    };

    const targetIdentifier = `${user.user_id}:${conversation_id.trim()}`;
    const shortKey = await generateOpaqueBucketKey("sm_1m", targetIdentifier);
    const hourlyKey = await generateOpaqueBucketKey("sm_1h", targetIdentifier);

    const rateLimitResult = await evaluateDualWindowRateLimits(
      rpcCaller,
      { bucketKey: shortKey, scope: "sm_1m", capacity: 20, windowSeconds: 60 },
      { bucketKey: hourlyKey, scope: "sm_1h", capacity: 200, windowSeconds: 3600 }
    );

    if (!rateLimitResult.allowed) {
      return rateLimitErrorResponse(rateLimitResult.retryAfterSeconds, req);
    }

    // 6. Invocação da RPC protegida via service_role informando o visitor_id EXTRAÍDO DO JWT
    const { data: msgData, error: msgError } = await adminClient.rpc("p_send_visitor_message", {
      p_visitor_id: user.user_id,
      p_conversation_id: conversation_id.trim(),
      p_content: trimmedContent,
    });

    if (msgError) {
      const isForbidden = msgError.code === "42501" || msgError.message.includes("Acesso negado");
      const isNotFound = msgError.code === "P0002" || msgError.message.includes("não encontrada");
      const isClosed = msgError.message.includes("encerrada");

      if (isForbidden) {
        return errorResponse("Access denied. Conversation belongs to another user.", "FORBIDDEN", 403, req);
      }
      if (isNotFound) {
        return errorResponse("Conversation not found.", "NOT_FOUND", 404, req);
      }
      if (isClosed) {
        return errorResponse("Conversation is closed.", "CONVERSATION_CLOSED", 400, req);
      }

      logWarn("SendMessage", "RPC_MSG_ERROR", msgError.message);
      return errorResponse("Failed to send message.", "SEND_MESSAGE_FAILED", 500, req);
    }

    return jsonResponse(msgData, 200, req);
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

    logWarn("SendMessage", "UNHANDLED_EXCEPTION", String(err));
    return errorResponse("An unexpected error occurred.", "INTERNAL_SERVER_ERROR", 500, req);
  }
});
