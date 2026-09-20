// Supabase Edge Function: submit-lead
// Finalidade: Captura segura e sanitizada de leads do pré-checkout com validação Turnstile.

import { createClient } from "npm:@supabase/supabase-js@2.48.1";
import { handleCorsPreflight } from "../_shared/cors.ts";
import { readJsonBody, PayloadTooLargeError, UnsupportedMediaTypeError, MethodNotAllowedError, InvalidJsonError } from "../_shared/body.ts";
import { jsonResponse, errorResponse, rateLimitErrorResponse } from "../_shared/response.ts";
import { validateTurnstileToken } from "../_shared/turnstile.ts";
import { generateOpaqueBucketKey, extractClientIp } from "../_shared/crypto.ts";
import { evaluateDualWindowRateLimits } from "../_shared/rate_limit.ts";
import { logWarn } from "../_shared/logger.ts";

export const ALLOWED_LEAD_FIELDS = new Set([
  "turnstileToken",
  "session_id",
  "p_name",
  "p_email",
  "p_phone",
  "p_country_code",
  "p_dial_code",
  "p_product",
  "p_page_type",
  "p_consent_given",
  "p_offer",
  "p_page_title",
  "p_source_url",
  "p_source_path",
  "p_checkout_url",
  "p_visitor_id",
  "p_affid",
  "p_hid",
  "p_hcid",
  "p_subid",
  "p_subid2",
  "p_subid3",
  "p_utm_source",
  "p_utm_medium",
  "p_utm_campaign",
  "p_utm_content",
  "p_utm_term",
  "p_referrer",
]);

export function validateSafeUrl(urlStr: string | null | undefined, fieldName: string, maxLength = 2048): string | null {
  if (!urlStr || typeof urlStr !== "string" || urlStr.trim().length === 0) {
    return null;
  }

  const trimmed = urlStr.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`URL in field '${fieldName}' exceeds maximum length of ${maxLength} characters.`);
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    throw new Error(`Unsafe protocol in field '${fieldName}'.`);
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error(`Invalid protocol in field '${fieldName}'. Only HTTP and HTTPS are allowed.`);
    }

    if (parsed.username || parsed.password) {
      throw new Error(`Credentials (userinfo) not allowed in URL field '${fieldName}'.`);
    }

    return trimmed;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("field")) throw err;
    throw new Error(`Malformed URL in field '${fieldName}'.`);
  }
}

Deno.serve(async (req: Request) => {
  // 1. Tratamento de Preflight CORS
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  try {
    // 2. Leitura do corpo com limite de 16 KB
    const rawBody = await readJsonBody<Record<string, unknown>>(req, 16384);

    // 3. Rejeição estrita de campos desconhecidos (Allowlist)
    for (const key of Object.keys(rawBody)) {
      if (!ALLOWED_LEAD_FIELDS.has(key)) {
        return errorResponse(
          `Unknown field '${key}' is not allowed in lead payload.`,
          "UNKNOWN_PAYLOAD_FIELD",
          400,
          req
        );
      }
    }

    const {
      turnstileToken,
      session_id,
      p_name,
      p_email,
      p_phone,
      p_country_code,
      p_dial_code,
      p_product,
      p_page_type,
      p_consent_given,
      p_offer,
      p_page_title,
      p_source_url,
      p_source_path,
      p_checkout_url,
      p_visitor_id,
      p_affid,
      p_hid,
      p_hcid,
      p_subid,
      p_subid2,
      p_subid3,
      p_utm_source,
      p_utm_medium,
      p_utm_campaign,
      p_utm_content,
      p_utm_term,
      p_referrer,
    } = rawBody;

    // 4. Validação de Session UUID (sem fingerprint invasivo)
    const sessionIdStr = typeof session_id === "string" ? session_id.trim() : "";
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionIdStr)) {
      return errorResponse("Field 'session_id' must be a valid UUID v4.", "INVALID_SESSION_UUID", 400, req);
    }

    // 5. Validação do Turnstile (action = 'submit_lead')
    const turnstileResult = await validateTurnstileToken({
      token: typeof turnstileToken === "string" ? turnstileToken : "",
      expectedAction: "submit_lead",
    });

    if (!turnstileResult.valid) {
      const code = turnstileResult.errorCode || "TURNSTILE_REJECTED";
      const httpStatus = code === "TURNSTILE_PROVIDER_ERROR" ? 502 : 400;
      if (turnstileResult.probeMeta) {
        logWarn(
          "SubmitLead",
          code,
          `probe: success=${turnstileResult.probeMeta.success}, host=${turnstileResult.probeMeta.hostname}, action=${turnstileResult.probeMeta.action}, errs=${turnstileResult.probeMeta.errorCodes.join(",")}`
        );
      } else {
        logWarn("SubmitLead", code);
      }
      return errorResponse(
        turnstileResult.errorMessage || "Security verification failed.",
        code,
        httpStatus,
        req
      );
    }

    // 6. Validação dos Campos de Negócio
    const nameStr = typeof p_name === "string" ? p_name.trim() : "";
    if (nameStr.length < 2 || nameStr.length > 120 || /[<>]/.test(nameStr)) {
      return errorResponse("Field 'p_name' must be between 2 and 120 characters without HTML tags.", "INVALID_NAME", 400, req);
    }

    const emailStr = typeof p_email === "string" ? p_email.trim().toLowerCase() : "";
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailStr || emailStr.length > 150 || !emailRegex.test(emailStr)) {
      return errorResponse("Field 'p_email' must be a valid email address.", "INVALID_EMAIL", 400, req);
    }

    const phoneStr = typeof p_phone === "string" ? p_phone.trim() : "";
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    if (!phoneStr || !phoneRegex.test(phoneStr)) {
      return errorResponse("Field 'p_phone' must be in E.164 format (e.g. +14155552671).", "INVALID_PHONE", 400, req);
    }

    if (p_consent_given !== true) {
      return errorResponse("Consent is required to submit lead.", "CONSENT_REQUIRED", 400, req);
    }

    // 7. Validação de URLs seguras
    let safeCheckoutUrl: string | null = null;
    let safeSourceUrl: string | null = null;
    try {
      safeCheckoutUrl = validateSafeUrl(typeof p_checkout_url === "string" ? p_checkout_url : null, "p_checkout_url");
      safeSourceUrl = validateSafeUrl(typeof p_source_url === "string" ? p_source_url : null, "p_source_url");
    } catch (urlErr: unknown) {
      return errorResponse(
        urlErr instanceof Error ? urlErr.message : "Invalid URL provided.",
        "INVALID_URL",
        400,
        req
      );
    }

    if (!safeCheckoutUrl) {
      return errorResponse("Field 'p_checkout_url' is required.", "MISSING_CHECKOUT_URL", 400, req);
    }

    // 8. Avaliação de Rate Limit (Session UUID + IP-HMAC) com Chaves Opacas Digest
    const clientIp = extractClientIp(req);
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const rpcCaller = async (fn: string, params: Record<string, unknown>) => {
      return await adminClient.rpc(fn, params);
    };

    // Limites de Sessão: 3 em 10 min / 10 em 24h
    const sessShortKey = await generateOpaqueBucketKey("sl_session_10m", sessionIdStr);
    const sessDailyKey = await generateOpaqueBucketKey("sl_session_24h", sessionIdStr);

    const sessionResult = await evaluateDualWindowRateLimits(
      rpcCaller,
      { bucketKey: sessShortKey, scope: "sl_session_10m", capacity: 3, windowSeconds: 600 },
      { bucketKey: sessDailyKey, scope: "sl_session_24h", capacity: 10, windowSeconds: 86400 }
    );

    if (!sessionResult.allowed) {
      return rateLimitErrorResponse(sessionResult.retryAfterSeconds, req);
    }

    // Teto de Segurança por IP: 30 em 10 min / 200 em 24h
    const ipShortKey = await generateOpaqueBucketKey("sl_ip_10m", clientIp);
    const ipDailyKey = await generateOpaqueBucketKey("sl_ip_24h", clientIp);

    const ipResult = await evaluateDualWindowRateLimits(
      rpcCaller,
      { bucketKey: ipShortKey, scope: "sl_ip_10m", capacity: 30, windowSeconds: 600 },
      { bucketKey: ipDailyKey, scope: "sl_ip_24h", capacity: 200, windowSeconds: 86400 }
    );

    if (!ipResult.allowed) {
      return rateLimitErrorResponse(ipResult.retryAfterSeconds, req);
    }

    // 9. Gravação via Service Role (apenas após aprovação do Turnstile e Rate Limit)
    const leadPayload = {
      p_name: nameStr,
      p_email: emailStr,
      p_phone: phoneStr,
      p_country_code: typeof p_country_code === "string" ? p_country_code.trim() : null,
      p_dial_code: typeof p_dial_code === "string" ? p_dial_code.trim() : null,
      p_product: typeof p_product === "string" ? p_product.trim() : "slimsoda",
      p_page_type: typeof p_page_type === "string" ? p_page_type.trim() : "pdp",
      p_consent_given: true,
      p_offer: typeof p_offer === "string" ? p_offer.trim() : null,
      p_page_title: typeof p_page_title === "string" ? p_page_title.slice(0, 300) : null,
      p_source_url: safeSourceUrl,
      p_source_path: typeof p_source_path === "string" ? p_source_path.slice(0, 1024) : null,
      p_checkout_url: safeCheckoutUrl,
      p_visitor_id: typeof p_visitor_id === "string" ? p_visitor_id.trim() : null,
      p_affid: typeof p_affid === "string" ? p_affid.trim() : null,
      p_hid: typeof p_hid === "string" ? p_hid.trim() : null,
      p_hcid: typeof p_hcid === "string" ? p_hcid.trim() : null,
      p_subid: typeof p_subid === "string" ? p_subid.trim() : null,
      p_subid2: typeof p_subid2 === "string" ? p_subid2.trim() : null,
      p_subid3: typeof p_subid3 === "string" ? p_subid3.trim() : null,
      p_utm_source: typeof p_utm_source === "string" ? p_utm_source.trim() : null,
      p_utm_medium: typeof p_utm_medium === "string" ? p_utm_medium.trim() : null,
      p_utm_campaign: typeof p_utm_campaign === "string" ? p_utm_campaign.trim() : null,
      p_utm_content: typeof p_utm_content === "string" ? p_utm_content.trim() : null,
      p_utm_term: typeof p_utm_term === "string" ? p_utm_term.trim() : null,
      p_referrer: typeof p_referrer === "string" ? p_referrer.slice(0, 1024) : null,
    };

    const { data: leadData, error: leadError } = await adminClient.rpc("save_checkout_lead", leadPayload);

    if (leadError) {
      logWarn("SubmitLead", "RPC_SAVE_LEAD_ERROR", leadError.message);
      return errorResponse("Failed to submit lead.", "SUBMIT_LEAD_FAILED", 500, req);
    }

    return jsonResponse(leadData, 200, req);
  } catch (err: unknown) {
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

    logWarn("SubmitLead", "UNHANDLED_EXCEPTION", String(err));
    return errorResponse("An unexpected error occurred.", "INTERNAL_SERVER_ERROR", 500, req);
  }
});
