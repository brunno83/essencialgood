// Native Hybrid Web Push Helper for Supabase Edge Functions / Deno
import webPush from "npm:web-push@3.6.7";

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionTarget {
  endpoint: string;
  keys: PushSubscriptionKeys;
}

export interface VapidDetails {
  subject: string;
  publicKey: string;
  privateKey: string;
}

export interface SendPushOptions {
  subscription: PushSubscriptionTarget;
  payload: string;
  vapidDetails: VapidDetails;
  ttl?: number;
  timeoutMs?: number;
}

export type ErrorPhase = "vapid_config" | "encryption" | "request_creation" | "network_fetch" | "http_response" | "runtime";
export type ProviderCategory = "FCM" | "APNs" | "Mozilla" | "unknown";

export interface ClassifiedPushError {
  errorCode: string; // e.g. "HTTP_401", "HTTP_403", "HTTP_410", "VAPID_CONFIG", "ENCRYPTION_ERROR", "NETWORK_ERROR", "RUNTIME_ERROR"
  statusCode?: number;
  phase: ErrorPhase;
  errorName: string;
  sanitizedMessage: string;
  isExpired: boolean;
  durationMs?: number;
  providerCategory?: ProviderCategory;
}

/**
 * Identifica a categoria do provedor push sem expor a URL do endpoint ou PII
 */
export function detectPushProvider(endpoint: string): ProviderCategory {
  if (!endpoint || typeof endpoint !== "string") return "unknown";
  const lower = endpoint.toLowerCase();
  if (lower.includes("fcm.googleapis.com") || lower.includes("android.googleapis.com")) {
    return "FCM";
  }
  if (lower.includes("push.apple.com")) {
    return "APNs";
  }
  if (lower.includes("push.services.mozilla.com")) {
    return "Mozilla";
  }
  return "unknown";
}

/**
 * Sanitiza mensagens de log removendo endpoints, URLs, chaves, tokens e PII.
 */
export function sanitizeLogMessage(msg: string): string {
  if (!msg) return "";
  let sanitized = String(msg);
  sanitized = sanitized.replace(/https?:\/\/[^\s"'>]+/gi, "[URL_REDACTED]");
  sanitized = sanitized.replace(/(?:key|token|auth|secret|p256dh|endpoint)[:=]\s*([^\s,;&]+)/gi, "$1=[REDACTED]");
  return sanitized;
}

/**
 * Classifica a exceção de envio Web Push em um código interno útil e seguro.
 */
export function classifyPushError(err: any, endpoint?: string, durationMs?: number): ClassifiedPushError {
  const errorName = err?.name || "Error";
  const rawMessage = err?.message || String(err || "Unknown error");
  const statusCode = err?.statusCode || err?.status;
  const providerCategory = detectPushProvider(endpoint || "");

  const sanitizedMessage = sanitizeLogMessage(rawMessage);

  if (typeof statusCode === "number" && statusCode > 0) {
    const isExpired = statusCode === 404 || statusCode === 410;
    return {
      errorCode: `HTTP_${statusCode}`,
      statusCode,
      phase: "http_response",
      errorName,
      sanitizedMessage,
      isExpired,
      durationMs,
      providerCategory,
    };
  }

  if (
    errorName === "AbortError" ||
    rawMessage.includes("aborted") ||
    rawMessage.includes("timeout") ||
    rawMessage.includes("ECONNRESET") ||
    rawMessage.includes("ENOTFOUND") ||
    rawMessage.includes("network") ||
    rawMessage.includes("fetch failed")
  ) {
    return {
      errorCode: "NETWORK_ERROR",
      phase: "network_fetch",
      errorName,
      sanitizedMessage,
      isExpired: false,
      durationMs,
      providerCategory,
    };
  }

  if (
    rawMessage.includes("VAPID") ||
    rawMessage.includes("vapid") ||
    rawMessage.includes("public key") ||
    rawMessage.includes("private key") ||
    rawMessage.includes("ECDH") ||
    rawMessage.includes("invalid key") ||
    rawMessage.includes("key format")
  ) {
    return {
      errorCode: "VAPID_CONFIG",
      phase: "vapid_config",
      errorName,
      sanitizedMessage,
      isExpired: false,
      durationMs,
      providerCategory,
    };
  }

  if (
    rawMessage.includes("encrypt") ||
    rawMessage.includes("cipher") ||
    rawMessage.includes("p256dh") ||
    rawMessage.includes("hkdf") ||
    rawMessage.includes("auth")
  ) {
    return {
      errorCode: "ENCRYPTION_ERROR",
      phase: "encryption",
      errorName,
      sanitizedMessage,
      isExpired: false,
      durationMs,
      providerCategory,
    };
  }

  return {
    errorCode: "RUNTIME_ERROR",
    phase: "runtime",
    errorName,
    sanitizedMessage,
    isExpired: false,
    durationMs,
    providerCategory,
  };
}

export interface SendPushResult {
  success: boolean;
  durationMs?: number;
  providerCategory?: ProviderCategory;
  classifiedError?: ClassifiedPushError;
}

/**
 * Prepara headers limpos para o fetch nativo removendo headers de transporte Node (Content-Length, Connection, Host, Transfer-Encoding)
 */
export function prepareNativeFetchHeaders(rawHeaders: Record<string, any>): Record<string, string> {
  const headers: Record<string, string> = {};
  if (!rawHeaders || typeof rawHeaders !== "object") return headers;

  for (const [key, val] of Object.entries(rawHeaders)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey === "content-length" ||
      lowerKey === "connection" ||
      lowerKey === "host" ||
      lowerKey === "transfer-encoding"
    ) {
      continue;
    }
    if (val !== undefined && val !== null) {
      headers[key] = String(val);
    }
  }

  return headers;
}

/**
 * Envia uma notificação Web Push usando transporte Híbrido Seguro:
 * - `npm:web-push` valida subscription, gera assinatura VAPID, criptografa payload e produz `generateRequestDetails()`
 * - O corpo e os headers são sanitizados (Uint8Array + remoção de Content-Length/headers Node)
 * - Deno `fetch()` nativo envia a requisição HTTP em ~100-300ms
 * - Timeout estrito de 8.000ms (8s)
 */
export async function sendWebPushNotification(options: SendPushOptions): Promise<SendPushResult> {
  const { subscription, payload, vapidDetails, ttl = 86400, timeoutMs = 8000 } = options;
  const startTime = Date.now();
  const providerCategory = detectPushProvider(subscription.endpoint);

  let requestDetails: any;

  // 1. Gerar detalhes da requisição usando web-push (VAPID + Cifragem ECE RFC 8291)
  try {
    webPush.setVapidDetails(
      vapidDetails.subject,
      vapidDetails.publicKey,
      vapidDetails.privateKey
    );

    const pushSub = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };

    requestDetails = webPush.generateRequestDetails(pushSub, payload, { TTL: ttl });
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    const classified = classifyPushError(err, subscription.endpoint, durationMs);
    return {
      success: false,
      durationMs,
      providerCategory,
      classifiedError: classified,
    };
  }

  // 2. Converter body Buffer para Uint8Array independente
  let body: Uint8Array;
  if (requestDetails.body) {
    if (requestDetails.body instanceof Uint8Array) {
      body = new Uint8Array(requestDetails.body);
    } else if (typeof requestDetails.body === "string") {
      body = new TextEncoder().encode(requestDetails.body);
    } else {
      body = new Uint8Array(requestDetails.body);
    }
  } else {
    body = new Uint8Array(0);
  }

  // 3. Preparar headers sanitizados para fetch nativo (remove Content-Length e headers Node)
  const headers = prepareNativeFetchHeaders(requestDetails.headers);

  // 4. Executar fetch nativo do Deno com AbortController (timeout 8000ms)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(requestDetails.endpoint, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;

    if (response.ok || response.status === 201 || response.status === 202) {
      return { success: true, durationMs, providerCategory };
    } else {
      const errorText = await response.text().catch(() => "");
      const err = {
        name: "WebPushHTTPError",
        statusCode: response.status,
        status: response.status,
        message: errorText || `Push service returned HTTP ${response.status}`,
      };
      const classified = classifyPushError(err, subscription.endpoint, durationMs);
      return {
        success: false,
        durationMs,
        providerCategory,
        classifiedError: classified,
      };
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;
    const classified = classifyPushError(err, subscription.endpoint, durationMs);
    return {
      success: false,
      durationMs,
      providerCategory,
      classifiedError: classified,
    };
  }
}
