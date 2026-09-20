// Supabase Edge Functions - Shared Zero-PII Log Sanitizer Module

export function sanitizeLogMessage(message: string): string {
  if (!message || typeof message !== "string") return "";

  let sanitized = message;

  // 1. Oculta URLs completas com parâmetros ou credenciais
  sanitized = sanitized.replace(/https?:\/\/[^\s"'>]+/gi, "[URL_REDACTED]");

  // 2. Oculta tokens, chaves, VAPID, Turnstile tokens e segredos
  sanitized = sanitized.replace(
    /(?:key|token|auth|secret|p256dh|pepper|bearer|turnstile|response|jwt)\s*[:=]\s*[^\s,;&]+/gi,
    "[REDACTED]"
  );

  // 3. Oculta e-mails potenciais
  sanitized = sanitized.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/gi, "[EMAIL_REDACTED]");

  // 4. Oculta endereços IP IPv4 e IPv6
  sanitized = sanitized.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[IP_REDACTED]");
  sanitized = sanitized.replace(/(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}/g, "[IP_REDACTED]");

  return sanitized;
}

export function logInfo(scope: string, eventCode: string, extra = ""): void {
  const safeScope = sanitizeLogMessage(scope);
  const safeCode = sanitizeLogMessage(eventCode);
  const safeExtra = sanitizeLogMessage(extra);
  console.log(`[INFO] [Scope: ${safeScope}] [Code: ${safeCode}] ${safeExtra}`.trim());
}

export function logWarn(scope: string, eventCode: string, extra = ""): void {
  const safeScope = sanitizeLogMessage(scope);
  const safeCode = sanitizeLogMessage(eventCode);
  const safeExtra = sanitizeLogMessage(extra);
  console.warn(`[WARN] [Scope: ${safeScope}] [Code: ${safeCode}] ${safeExtra}`.trim());
}

export function logError(scope: string, eventCode: string, extra = ""): void {
  const safeScope = sanitizeLogMessage(scope);
  const safeCode = sanitizeLogMessage(eventCode);
  const safeExtra = sanitizeLogMessage(extra);
  console.error(`[ERROR] [Scope: ${safeScope}] [Code: ${safeCode}] ${safeExtra}`.trim());
}
