// Supabase Edge Function: create-conversation
// Finalidade: Criação e atualização segura de conversas para visitantes autenticados.

import { createClient } from "npm:@supabase/supabase-js@2.48.1";
import { handleCorsPreflight } from "../_shared/cors.ts";
import { readJsonBody, PayloadTooLargeError, UnsupportedMediaTypeError, MethodNotAllowedError, InvalidJsonError } from "../_shared/body.ts";
import { jsonResponse, errorResponse, rateLimitErrorResponse } from "../_shared/response.ts";
import { extractUserFromRequest, UnauthorizedError } from "../_shared/auth.ts";
import { validateTurnstileToken } from "../_shared/turnstile.ts";
import { generateOpaqueBucketKey, extractClientIp } from "../_shared/crypto.ts";
import { evaluateDualWindowRateLimits } from "../_shared/rate_limit.ts";
import { logWarn } from "../_shared/logger.ts";

export const ALLOWED_CREATE_CONVERSATION_FIELDS = new Set([
  "turnstileToken",
  "visitor_name",
  "visitor_email",
  "visitor_phone",
  "visitor_country_code",
  "visitor_dial_code",
  "source_url",
  "source_path",
  "source_title",
  "source_product",
]);

export interface CreateConversationBody {
  turnstileToken?: string;
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string;
  visitor_country_code?: string;
  visitor_dial_code?: string;
  source_url?: string;
  source_path?: string;
  source_title?: string;
  source_product?: string;
  [key: string]: unknown;
}

export function validateAndDeriveSourceUrl(
  urlStr: unknown
): { safeSourceUrl: string | null; derivedSourceHost: string | null } {
  if (!urlStr || typeof urlStr !== "string" || urlStr.trim().length === 0) {
    return { safeSourceUrl: null, derivedSourceHost: null };
  }

  const trimmed = urlStr.trim();
  if (trimmed.length > 2048) {
    throw new Error("Field 'source_url' exceeds maximum length of 2048 characters.");
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("file:") || lower.startsWith("vbscript:")) {
    throw new Error("Unsafe protocol in field 'source_url'.");
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Malformed URL in field 'source_url'.");
  }

  if (parsed.username || parsed.password) {
    throw new Error("Credentials (userinfo) not allowed in field 'source_url'.");
  }

  const hostname = parsed.hostname.toLowerCase().trim();
  if (!hostname || hostname.length === 0) {
    throw new Error("Empty host in field 'source_url'.");
  }

  const environment = (Deno.env.get("DENO_ENV") || Deno.env.get("ENVIRONMENT") || "").toLowerCase().trim();
  const isProduction = environment === "production";
  const isStaging = environment === "staging";
  const isDev = environment === "development" || environment === "test";

  // Se o ambiente for ausente ou desconhecido, falha fechado
  if (!isProduction && !isStaging && !isDev) {
    throw new Error("Unauthorized environment for field 'source_url'.");
  }

  // Domínios de produção estritos
  const isOfficialDomain = hostname === "essencialgood.com" || hostname === "www.essencialgood.com";

  // Domínio de staging estrito
  const isStagingDomain = hostname === "staging.essencialgood.com";

  // Localhost estrito (apenas portas permitidas: 5173 e 4173)
  const isDevLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  const port = parsed.port;
  const isAllowedDevPort = !port || port === "5173" || port === "4173";

  // Validação cruzada estrita entre hostname/porta e ambiente
  if (isProduction && !isOfficialDomain) {
    throw new Error("Unauthorized hostname in field 'source_url'.");
  }

  if (isStaging && !isStagingDomain) {
    throw new Error("Unauthorized hostname in field 'source_url'.");
  }

  if (isDev && (!isDevLocalhost || !isAllowedDevPort)) {
    throw new Error("Unauthorized hostname or port in field 'source_url'.");
  }

  // Para domínios não-localhost, exige HTTPS estrito e sem porta explícita
  if (!isDevLocalhost) {
    if (parsed.protocol !== "https:") {
      throw new Error("Field 'source_url' must use HTTPS protocol.");
    }
    if (parsed.port) {
      throw new Error("Field 'source_url' cannot specify explicit port for production/staging.");
    }
  }

  // Para localhost em dev, exige HTTP ou HTTPS
  if (isDevLocalhost && parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Field 'source_url' must use HTTP or HTTPS protocol.");
  }

  return {
    safeSourceUrl: trimmed,
    derivedSourceHost: hostname,
  };
}

Deno.serve(async (req: Request) => {
  // 1. Preflight CORS
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  try {
    // 2. Extração do usuário autenticado a partir do JWT do visitante
    const user = extractUserFromRequest(req);

    // 3. Leitura do corpo com trava estrita de 16 KB
    const rawBody = await readJsonBody<CreateConversationBody>(req, 16384);

    // 4. Rejeição estrita de campos não permitidos (Allowlist)
    for (const key of Object.keys(rawBody)) {
      if (!ALLOWED_CREATE_CONVERSATION_FIELDS.has(key)) {
        return errorResponse(
          "Unknown field is not allowed in payload.",
          "UNKNOWN_PAYLOAD_FIELD",
          400,
          req
        );
      }
    }

    // 5. Validação do Cloudflare Turnstile (action = 'create_conversation')
    const turnstileToken = typeof rawBody.turnstileToken === "string" ? rawBody.turnstileToken : "";
    const turnstileResult = await validateTurnstileToken({
      token: turnstileToken,
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

    // 6. Validação dos Campos de Contato e Origem
    const nameStr = typeof rawBody.visitor_name === "string" ? rawBody.visitor_name.trim() : "";
    if (nameStr.length < 2 || nameStr.length > 120 || /[\x00-\x1F\x7F<>]/.test(nameStr)) {
      return errorResponse(
        "Field 'visitor_name' is required and must be 2-120 valid characters.",
        "INVALID_VISITOR_NAME",
        400,
        req
      );
    }

    let validEmail: string | null = null;
    if (typeof rawBody.visitor_email === "string" && rawBody.visitor_email.trim().length > 0) {
      const emailTrim = rawBody.visitor_email.trim().toLowerCase();
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (emailTrim.length > 150 || !emailRegex.test(emailTrim)) {
        return errorResponse("Field 'visitor_email' is invalid.", "INVALID_VISITOR_EMAIL", 400, req);
      }
      validEmail = emailTrim;
    }

    let validPhone: string | null = null;
    if (typeof rawBody.visitor_phone === "string" && rawBody.visitor_phone.trim().length > 0) {
      const phoneTrim = rawBody.visitor_phone.trim();
      const phoneRegex = /^\+[1-9]\d{7,14}$/;
      if (phoneTrim.length > 16 || !phoneRegex.test(phoneTrim)) {
        return errorResponse("Field 'visitor_phone' must be in E.164 format.", "INVALID_VISITOR_PHONE", 400, req);
      }
      validPhone = phoneTrim;
    }

    let validCountryCode: string | null = null;
    if (typeof rawBody.visitor_country_code === "string" && rawBody.visitor_country_code.trim().length > 0) {
      const countryTrim = rawBody.visitor_country_code.trim().toUpperCase();
      if (!/^[A-Z]{2}$/.test(countryTrim)) {
        return errorResponse("Field 'visitor_country_code' must be 2 uppercase ISO letters.", "INVALID_COUNTRY_CODE", 400, req);
      }
      validCountryCode = countryTrim;
    }

    let validDialCode: string | null = null;
    if (typeof rawBody.visitor_dial_code === "string" && rawBody.visitor_dial_code.trim().length > 0) {
      const dialTrim = rawBody.visitor_dial_code.trim();
      if (!/^\+\d{1,4}$/.test(dialTrim)) {
        return errorResponse("Field 'visitor_dial_code' is invalid.", "INVALID_DIAL_CODE", 400, req);
      }
      validDialCode = dialTrim;
    }

    let safeSourceTitle: string | null = null;
    if (typeof rawBody.source_title === "string" && rawBody.source_title.trim().length > 0) {
      const titleTrim = rawBody.source_title.trim();
      if (titleTrim.length > 200 || /[\x00-\x1F\x7F<>]/.test(titleTrim)) {
        return errorResponse("Field 'source_title' contains invalid characters or exceeds 200 characters.", "INVALID_SOURCE_TITLE", 400, req);
      }
      safeSourceTitle = titleTrim;
    }

    let safeSourceProduct: string | null = null;
    if (typeof rawBody.source_product === "string" && rawBody.source_product.trim().length > 0) {
      const prodTrim = rawBody.source_product.trim();
      if (prodTrim.length > 100 || /[\x00-\x1F\x7F<>]/.test(prodTrim)) {
        return errorResponse("Field 'source_product' contains invalid characters or exceeds 100 characters.", "INVALID_SOURCE_PRODUCT", 400, req);
      }
      safeSourceProduct = prodTrim;
    }

    let safeSourcePath: string | null = null;
    if (typeof rawBody.source_path === "string" && rawBody.source_path.trim().length > 0) {
      const pathTrim = rawBody.source_path.trim();
      if (pathTrim.length > 500 || !pathTrim.startsWith("/") || /[\x00-\x1F\x7F<>@]/.test(pathTrim) || pathTrim.includes("://")) {
        return errorResponse("Field 'source_path' must be a valid path starting with '/'.", "INVALID_SOURCE_PATH", 400, req);
      }
      safeSourcePath = pathTrim;
    }

    let safeSourceUrl: string | null = null;
    let derivedSourceHost: string | null = null;
    try {
      const derived = validateAndDeriveSourceUrl(rawBody.source_url);
      safeSourceUrl = derived.safeSourceUrl;
      derivedSourceHost = derived.derivedSourceHost;
    } catch (urlErr: unknown) {
      return errorResponse(
        urlErr instanceof Error ? urlErr.message : "Invalid URL in field 'source_url'.",
        "INVALID_SOURCE_URL",
        400,
        req
      );
    }

    // 7. Avaliação de Rate Limit (Chaves 100% Opacas)
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

    // 8. Invocação da RPC protegida usando service_role com UID derivado do JWT e campos validados
    const { data: convData, error: convError } = await adminClient.rpc("p_create_visitor_conversation", {
      p_visitor_id: user.user_id,
      p_visitor_name: nameStr,
      p_visitor_email: validEmail,
      p_visitor_phone: validPhone,
      p_visitor_country_code: validCountryCode,
      p_visitor_dial_code: validDialCode,
      p_source_url: safeSourceUrl,
      p_source_path: safeSourcePath,
      p_source_host: derivedSourceHost,
      p_source_title: safeSourceTitle,
      p_source_product: safeSourceProduct,
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
