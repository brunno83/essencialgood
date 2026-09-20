// ESSENCIAL GOOD - SECURE EDGE FUNCTIONS CLIENT MODULE
// Provides typed, validated, zero-leak access to Edge Functions (create-conversation, send-message, submit-lead).

import { validateEnvConfig } from './envGuard.js';

export const ALLOWED_FUNCTIONS = ['create-conversation', 'send-message', 'submit-lead'];
export const MIN_TIMEOUT_MS = 1000;
export const MAX_TIMEOUT_MS = 120000;
export const DEFAULT_TIMEOUT_MS = 15000;
export const MAX_PAYLOAD_BYTES = 16384; // 16 KB UTF-8 request payload limit
export const MAX_RESPONSE_BYTES = 65536; // 64 KB response read limit

export const SERVER_CODE_ALLOWLIST = new Set([
  'RATE_LIMIT_EXCEEDED',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'PAYLOAD_TOO_LARGE',
  'INVALID_JSON',
  'INVALID_SOURCE_URL',
  'INVALID_VISITOR_NAME',
  'INVALID_VISITOR_EMAIL',
  'INVALID_VISITOR_PHONE',
  'INVALID_COUNTRY_CODE',
  'INVALID_DIAL_CODE',
  'INVALID_SOURCE_TITLE',
  'INVALID_SOURCE_PRODUCT',
  'INVALID_SOURCE_PATH',
  'UNKNOWN_PAYLOAD_FIELD',
  'FORBIDDEN_PAYLOAD_FIELD',
  'MISSING_TURNSTILE_TOKEN',
  'TURNSTILE_REJECTED',
  'TURNSTILE_HOSTNAME_MISMATCH',
  'TURNSTILE_ACTION_MISMATCH',
  'TURNSTILE_PROVIDER_ERROR',
  'METHOD_NOT_ALLOWED',
  'CREATE_CONVERSATION_FAILED',
]);

const SANITIZED_CODE_MESSAGES = {
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  UNAUTHORIZED: 'Authentication required.',
  FORBIDDEN: 'Access forbidden.',
  PAYLOAD_TOO_LARGE: 'Request payload is too large.',
  INVALID_JSON: 'Invalid JSON request format.',
  INVALID_SOURCE_URL: 'Invalid source URL parameter.',
  INVALID_VISITOR_NAME: 'Invalid visitor name parameter.',
  INVALID_VISITOR_EMAIL: 'Invalid visitor email parameter.',
  INVALID_VISITOR_PHONE: 'Invalid visitor phone parameter.',
  INVALID_COUNTRY_CODE: 'Invalid country code parameter.',
  INVALID_DIAL_CODE: 'Invalid dial code parameter.',
  INVALID_SOURCE_TITLE: 'Invalid source title parameter.',
  INVALID_SOURCE_PRODUCT: 'Invalid source product parameter.',
  INVALID_SOURCE_PATH: 'Invalid source path parameter.',
  UNKNOWN_PAYLOAD_FIELD: 'Payload contains unknown fields.',
  FORBIDDEN_PAYLOAD_FIELD: 'Payload contains forbidden fields.',
  MISSING_TURNSTILE_TOKEN: 'Security token is missing.',
  TURNSTILE_REJECTED: 'Security verification failed.',
  TURNSTILE_HOSTNAME_MISMATCH: 'Security verification origin mismatch.',
  TURNSTILE_ACTION_MISMATCH: 'Security verification action mismatch.',
  TURNSTILE_PROVIDER_ERROR: 'Security verification provider error.',
  METHOD_NOT_ALLOWED: 'HTTP method not allowed.',
  CREATE_CONVERSATION_FAILED: 'Failed to initialize conversation.',
  BAD_REQUEST: 'Bad request.',
  NOT_FOUND: 'Requested resource not found.',
  UNSUPPORTED_MEDIA_TYPE: 'Unsupported media type.',
  TOO_MANY_REQUESTS: 'Too many requests.',
  INTERNAL_SERVER_ERROR: 'Internal server error.',
  BAD_GATEWAY: 'Bad gateway response.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable.',
  HTTP_ERROR: 'HTTP request failed.',
};

export class EdgeFunctionError extends Error {
  constructor({
    status = 0,
    code = 'UNKNOWN_ERROR',
    message = 'An error occurred',
    retryAfterSeconds = null,
    isTimeout = false,
    isNetwork = false,
    isAborted = false,
  }) {
    super(message);
    this.name = 'EdgeFunctionError';
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
    this.isTimeout = isTimeout;
    this.isNetwork = isNetwork;
    this.isAborted = isAborted;
  }
}

function validateTimeoutMs(timeoutMs) {
  if (typeof timeoutMs === 'undefined' || timeoutMs === null) {
    return DEFAULT_TIMEOUT_MS;
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < MIN_TIMEOUT_MS || timeoutMs > MAX_TIMEOUT_MS) {
    throw new EdgeFunctionError({
      status: 400,
      code: 'INVALID_TIMEOUT',
      message: `Timeout must be an integer between ${MIN_TIMEOUT_MS} and ${MAX_TIMEOUT_MS} ms`,
    });
  }
  return timeoutMs;
}

export function calculateUtf8Bytes(str) {
  if (typeof str !== 'string') return 0;
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.byteLength(str, 'utf8');
  }
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 0x7f) bytes += 1;
    else if (code <= 0x7ff) bytes += 2;
    else if (code >= 0xd800 && code <= 0xdbff) {
      bytes += 4;
      i++; // Surrogate pair
    } else bytes += 3;
  }
  return bytes;
}

/**
 * Decodes JWT payload claims on client-side for defense-in-depth role checks.
 * NOTE: This client-side check is defense-in-depth only and DOES NOT replace cryptographic signature verification.
 */
export function parseJwtPayload(jwt) {
  if (!jwt || typeof jwt !== 'string') return null;
  const parts = jwt.trim().split('.');
  if (parts.length !== 3) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload;
    if (typeof atob === 'function') {
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } else if (typeof Buffer !== 'undefined') {
      jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    } else {
      return null;
    }
    return JSON.parse(jsonPayload);
  } catch (_) {
    return null;
  }
}

export function parseRetryAfterHeader(headerValue) {
  if (!headerValue) return null;
  const str = String(headerValue).trim();
  if (str.length === 0) return null;

  if (/^\d+$/.test(str)) {
    const seconds = parseInt(str, 10);
    if (isNaN(seconds) || seconds <= 0) return null;
    return Math.min(seconds, 86400); // Clamp 24h
  }

  const dateMs = Date.parse(str);
  if (!isNaN(dateMs)) {
    const diffSec = Math.ceil((dateMs - Date.now()) / 1000);
    if (diffSec <= 0) return null;
    return Math.min(diffSec, 86400);
  }

  return null;
}

export function mapStatusToCode(status) {
  switch (status) {
    case 400: return 'BAD_REQUEST';
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 405: return 'METHOD_NOT_ALLOWED';
    case 413: return 'PAYLOAD_TOO_LARGE';
    case 415: return 'UNSUPPORTED_MEDIA_TYPE';
    case 429: return 'TOO_MANY_REQUESTS';
    case 502: return 'BAD_GATEWAY';
    case 503: return 'SERVICE_UNAVAILABLE';
    default:
      if (status >= 500) return 'INTERNAL_SERVER_ERROR';
      return 'HTTP_ERROR';
  }
}

export function isStrictJsonMimeType(contentType) {
  if (!contentType || typeof contentType !== 'string') return false;
  if (/[\r\n]/.test(contentType)) return false;

  const [mimeType] = contentType.split(';', 1);
  const normalizedMime = mimeType.trim().toLowerCase();

  return /^application\/(?:[a-zA-Z0-9!#$%&*+^_`{|}~.-]+\+)?json$/i.test(normalizedMime);
}

/**
 * Reads response body enforcing a strict byte limit of MAX_RESPONSE_BYTES (64 KB).
 * Uses ReadableStream API (response.body.getReader()) when available in modern browser environments.
 * Decision (Option B): When ReadableStream API is unavailable (e.g. legacy test mocks), Content-Length header is checked first if present.
 * Fallback to response.text() is maintained as a best-effort fallback, and memory limit cannot be strictly guaranteed before text reading in this fallback path.
 */
export async function readResponseTextWithLimit(response, maxBytes = MAX_RESPONSE_BYTES, signalOptions = {}) {
  if (!response) {
    throw new EdgeFunctionError({
      status: 0,
      code: 'INVALID_RESPONSE',
      message: 'Response object is missing',
    });
  }

  const { controller = null } = signalOptions;

  // Check Content-Length header first if available
  const clHeader = response.headers ? (response.headers.get('Content-Length') || response.headers.get('content-length')) : null;
  if (clHeader && /^\d+$/.test(clHeader.trim())) {
    const contentLength = parseInt(clHeader.trim(), 10);
    if (contentLength > maxBytes) {
      if (controller) controller.abort();
      throw new EdgeFunctionError({
        status: 413,
        code: 'RESPONSE_TOO_LARGE',
        message: 'Response payload size exceeds maximum allowed limit',
      });
    }
  }

  // 1. Prefer ReadableStream API
  if (response.body && typeof response.body.getReader === 'function') {
    const reader = response.body.getReader();
    let totalBytes = 0;
    const chunks = [];

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          const chunkSize = value.byteLength || value.length || 0;
          totalBytes += chunkSize;
          if (totalBytes > maxBytes) {
            try { await reader.cancel('RESPONSE_TOO_LARGE'); } catch (_) {}
            if (controller) controller.abort();
            throw new EdgeFunctionError({
              status: 413,
              code: 'RESPONSE_TOO_LARGE',
              message: 'Response payload size exceeds maximum allowed limit',
            });
          }
          chunks.push(value);
        }
      }
    } catch (streamErr) {
      if (streamErr instanceof EdgeFunctionError) throw streamErr;
      throw streamErr;
    } finally {
      try { reader.releaseLock(); } catch (_) {}
    }

    if (typeof TextDecoder !== 'undefined') {
      const combined = new Uint8Array(totalBytes);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      return new TextDecoder().decode(combined);
    }
  }

  // 2. Best-effort fallback (Option B) when ReadableStream API is unavailable
  let text = '';
  try {
    text = await response.text();
  } catch (textErr) {
    throw textErr;
  }

  const byteLength = calculateUtf8Bytes(text);
  if (byteLength > maxBytes) {
    if (controller) controller.abort();
    throw new EdgeFunctionError({
      status: 413,
      code: 'RESPONSE_TOO_LARGE',
      message: 'Response payload size exceeds maximum allowed limit',
    });
  }

  return text;
}

export async function callEdgeFunction(functionName, payload = {}, options = {}) {
  const {
    jwt = null,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal = null,
    customFetch = null,
  } = options;

  // 1. Validar Timeout
  const validTimeout = validateTimeoutMs(timeoutMs);

  // 2. Validar Nome da Função & Prevenir Path Injection
  if (!functionName || typeof functionName !== 'string') {
    throw new EdgeFunctionError({
      status: 400,
      code: 'INVALID_FUNCTION',
      message: 'Edge function name is required',
    });
  }

  const cleanName = functionName.trim();
  if (
    !ALLOWED_FUNCTIONS.includes(cleanName) ||
    cleanName !== functionName ||
    cleanName.includes('/') ||
    cleanName.includes('\\') ||
    cleanName.includes('..') ||
    cleanName.includes('%')
  ) {
    throw new EdgeFunctionError({
      status: 400,
      code: 'FORBIDDEN_FUNCTION',
      message: 'Invalid or unauthorized edge function name',
    });
  }

  // 3. Validar Requisito de Autenticação JWT por Matriz Estrita
  const isAuthRequired = cleanName === 'create-conversation' || cleanName === 'send-message';
  if (isAuthRequired) {
    if (!jwt || typeof jwt !== 'string' || jwt.trim().length === 0) {
      throw new EdgeFunctionError({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Authentication JWT is required',
      });
    }

    const jwtParts = jwt.trim().split('.');
    if (jwtParts.length !== 3) {
      throw new EdgeFunctionError({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Malformed JWT format',
      });
    }

    const jwtPayload = parseJwtPayload(jwt);
    if (jwtPayload && jwtPayload.role === 'service_role') {
      throw new EdgeFunctionError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Usage of service_role credentials is prohibited on frontend client',
      });
    }
  }

  // 4. Proibir Expressamente service_role em String JWT ou Credenciais
  if (jwt && typeof jwt === 'string' && jwt.toLowerCase().includes('service_role')) {
    throw new EdgeFunctionError({
      status: 403,
      code: 'FORBIDDEN',
      message: 'Usage of service_role credentials is prohibited on frontend client',
    });
  }

  // 5. Obter Configuração Validada do Ambiente (A chave anon vem EXCLUSIVAMENTE do envGuard)
  const envConfig = validateEnvConfig(import.meta.env || process.env);
  if (envConfig.anonKey && envConfig.anonKey.toLowerCase().includes('service_role')) {
    throw new EdgeFunctionError({
      status: 403,
      code: 'FORBIDDEN',
      message: 'Service role key detected in environment config',
    });
  }

  const targetUrl = `${envConfig.supabaseUrl}/functions/v1/${cleanName}`;

  // 6. Serializar Payload e Validar Estrutura JSON e Tamanho UTF-8 (<= 16 KB)
  let jsonString;
  try {
    jsonString = JSON.stringify(payload || {});
  } catch (_) {
    throw new EdgeFunctionError({
      status: 400,
      code: 'INVALID_JSON',
      message: 'Payload cannot be serialized to JSON',
    });
  }

  const byteLength = calculateUtf8Bytes(jsonString);
  if (byteLength > MAX_PAYLOAD_BYTES) {
    throw new EdgeFunctionError({
      status: 413,
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Payload size exceeds maximum allowed limit',
    });
  }

  // 7. Montar Headers Estritos (Authorization enviado APENAS para funções autenticadas)
  const headers = {
    'Content-Type': 'application/json',
    'apikey': envConfig.anonKey,
  };

  if (isAuthRequired && jwt && typeof jwt === 'string' && jwt.trim().length > 0) {
    headers['Authorization'] = `Bearer ${jwt.trim()}`;
  }

  // 8. Configurar AbortController e Timeout Único que cobre TODO o ciclo de vida
  const controller = new AbortController();
  let timedOut = false;
  let externallyAborted = false;

  const timeoutTimer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, validTimeout);

  let onExternalAbort = null;
  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutTimer);
      throw new EdgeFunctionError({
        status: 0,
        code: 'ABORTED',
        message: 'Request was aborted before execution',
        isAborted: true,
      });
    }
    onExternalAbort = () => {
      externallyAborted = true;
      controller.abort();
    };
    signal.addEventListener('abort', onExternalAbort, { once: true });
  }

  const fetchImpl = customFetch || (typeof fetch !== 'undefined' ? fetch : null);
  if (!fetchImpl) {
    clearTimeout(timeoutTimer);
    if (signal && onExternalAbort) signal.removeEventListener('abort', onExternalAbort);
    throw new EdgeFunctionError({
      status: 0,
      code: 'FETCH_UNAVAILABLE',
      message: 'Global fetch API is unavailable',
    });
  }

  try {
    // 9. Executar Fetch
    let response;
    try {
      response = await fetchImpl(targetUrl, {
        method: 'POST',
        headers,
        body: jsonString,
        redirect: 'error',
        signal: controller.signal,
      });
    } catch (netErr) {
      if (timedOut) {
        throw new EdgeFunctionError({
          status: 0,
          code: 'TIMEOUT',
          message: 'Request timed out',
          isTimeout: true,
        });
      }
      if (externallyAborted || (netErr && netErr.name === 'AbortError')) {
        throw new EdgeFunctionError({
          status: 0,
          code: 'ABORTED',
          message: 'Request was aborted',
          isAborted: true,
        });
      }
      throw new EdgeFunctionError({
        status: 0,
        code: 'NETWORK_ERROR',
        message: 'Network request failed',
        isNetwork: true,
      });
    }

    const status = response.status;

    // 10. Tratar HTTP 204 No Content (Retorna null explicitamente)
    if (status === 204) {
      return null;
    }

    // 11. Validar Content-Type
    const contentType = response.headers ? (response.headers.get('Content-Type') || response.headers.get('content-type') || '') : '';
    const hasContentType = Boolean(contentType && contentType.trim().length > 0);

    if (hasContentType && !isStrictJsonMimeType(contentType)) {
      throw new EdgeFunctionError({
        status,
        code: 'UNSUPPORTED_MEDIA_TYPE',
        message: 'Edge Function response Content-Type is not JSON compatible',
      });
    }

    if (!hasContentType && response.status !== 204) {
      throw new EdgeFunctionError({
        status,
        code: 'UNSUPPORTED_MEDIA_TYPE',
        message: 'Edge Function response missing Content-Type header',
      });
    }

    // 12. Parsear Retry-After SOMENTE em HTTP 429
    const retryAfter = status === 429 ? parseRetryAfterHeader(response.headers ? (response.headers.get('Retry-After') || response.headers.get('retry-after')) : null) : null;

    // 13. Ler corpo da resposta sob timeout e sinal ativos
    let responseText = '';
    try {
      responseText = await readResponseTextWithLimit(response, MAX_RESPONSE_BYTES, { controller });
    } catch (readErr) {
      if (timedOut) {
        throw new EdgeFunctionError({
          status: 0,
          code: 'TIMEOUT',
          message: 'Request timed out during response reading',
          isTimeout: true,
        });
      }
      if (externallyAborted || (readErr && readErr.name === 'AbortError')) {
        throw new EdgeFunctionError({
          status: 0,
          code: 'ABORTED',
          message: 'Request was aborted during response reading',
          isAborted: true,
        });
      }
      if (readErr instanceof EdgeFunctionError) throw readErr;
      throw new EdgeFunctionError({
        status: 0,
        code: 'RESPONSE_READ_ERROR',
        message: 'Failed to read response content',
      });
    }

    if (timedOut) {
      throw new EdgeFunctionError({
        status: 0,
        code: 'TIMEOUT',
        message: 'Request timed out during response reading',
        isTimeout: true,
      });
    }

    if (externallyAborted) {
      throw new EdgeFunctionError({
        status: 0,
        code: 'ABORTED',
        message: 'Request was aborted during response reading',
        isAborted: true,
      });
    }

    // 14. Tratar Respostas Não-OK (HTTP >= 400) com mensagens Sanitizadas sem PII
    if (!response.ok) {
      let errBody = null;
      if (responseText && responseText.trim().length > 0) {
        try { errBody = JSON.parse(responseText); } catch (_) {}
      }

      let sanitizedCode;
      if (errBody && typeof errBody.code === 'string' && SERVER_CODE_ALLOWLIST.has(errBody.code.trim())) {
        sanitizedCode = errBody.code.trim();
      } else {
        sanitizedCode = mapStatusToCode(status);
      }

      const sanitizedMsg = SANITIZED_CODE_MESSAGES[sanitizedCode] || `Request failed with status ${status}`;

      throw new EdgeFunctionError({
        status,
        code: sanitizedCode,
        message: sanitizedMsg,
        retryAfterSeconds: retryAfter,
      });
    }

    // 15. Resposta OK (200/201): Corpo vazio é erro
    if (!responseText || responseText.trim().length === 0) {
      throw new EdgeFunctionError({
        status,
        code: 'INVALID_RESPONSE_JSON',
        message: 'Empty JSON response body',
      });
    }

    // 16. Parsear JSON com tratamento de erro
    try {
      return JSON.parse(responseText);
    } catch (_) {
      throw new EdgeFunctionError({
        status,
        code: 'INVALID_RESPONSE_JSON',
        message: 'Edge Function returned invalid JSON response',
      });
    }
  } finally {
    // 17. Cleanup Único de Timer e Listener no final de TODO o fluxo
    clearTimeout(timeoutTimer);
    if (signal && onExternalAbort) {
      signal.removeEventListener('abort', onExternalAbort);
    }
  }
}
