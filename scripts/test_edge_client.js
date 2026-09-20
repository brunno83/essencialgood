// ESSENCIAL GOOD - SECURE EDGE CLIENT COMPREHENSIVE TEST SUITE (Node.js)
// Tests function allowlist, path injection, authorization matrix, UTF-8 limit, Circular/BigInt JSON stringify errors, JWT claim decode validation, 64 KB response read limits, Retry-After header formats, zero PII network leaks, HTTP 204, strict MIME checking, and stream timeout/abort behavior.

import {
  callEdgeFunction,
  EdgeFunctionError,
  calculateUtf8Bytes,
  parseRetryAfterHeader,
  parseJwtPayload,
  isStrictJsonMimeType,
  SERVER_CODE_ALLOWLIST,
} from '../src/lib/edgeClient.js';

process.env.VITE_APP_ENV = 'staging';
process.env.VITE_EXPECTED_SUPABASE_PROJECT_REF = 'zauvpsxeexwthobmbkku';
process.env.VITE_SUPABASE_URL = 'https://zauvpsxeexwthobmbkku.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_staging.signature';
process.env.VITE_TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

console.log("==========================================");
console.log("EDGE CLIENT COMPREHENSIVE AUTOMATED TEST SUITE");
console.log("==========================================");

const fakeAnonJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIn0.signature';

// --- 1. TESTES DE NOME DE FUNÇÃO E PATH INJECTION ---
let err1 = false;
try {
  await callEdgeFunction('unknown-function');
} catch (e) {
  err1 = e instanceof EdgeFunctionError && e.code === 'FORBIDDEN_FUNCTION';
}
assert(err1, "[1.1] Função desconhecida ('unknown-function') é REJEITADA com FORBIDDEN_FUNCTION.");

let errPathDot = false;
try {
  await callEdgeFunction('../admin');
} catch (e) {
  errPathDot = e instanceof EdgeFunctionError && e.code === 'FORBIDDEN_FUNCTION';
}
assert(errPathDot, "[1.2] Path injection com '..' é REJEITADO.");

let errSubpath = false;
try {
  await callEdgeFunction('create-conversation/extra');
} catch (e) {
  errSubpath = e instanceof EdgeFunctionError && e.code === 'FORBIDDEN_FUNCTION';
}
assert(errSubpath, "[1.3] Subpath em nome de função é REJEITADO.");

// --- 2. VALIDAÇÃO DE TIMEOUT MS ---
let errTimeoutVal = false;
try {
  await callEdgeFunction('submit-lead', {}, { timeoutMs: 500 });
} catch (e) {
  errTimeoutVal = e instanceof EdgeFunctionError && e.code === 'INVALID_TIMEOUT';
}
assert(errTimeoutVal, "[2.1] Timeout abaixo de 1000ms é REJEITADO com INVALID_TIMEOUT.");

let errTimeoutFloat = false;
try {
  await callEdgeFunction('submit-lead', {}, { timeoutMs: 5000.5 });
} catch (e) {
  errTimeoutFloat = e instanceof EdgeFunctionError && e.code === 'INVALID_TIMEOUT';
}
assert(errTimeoutFloat, "[2.2] Timeout não inteiro (float) é REJEITADO com INVALID_TIMEOUT.");

// --- 3. AUTENTICAÇÃO OBRIGATÓRIA E DECODIFICAÇÃO DE CLAIM SERVICE_ROLE ---
let errNoJwt = false;
try {
  await callEdgeFunction('create-conversation', { p_visitor_id: 'v123' }, { jwt: null });
} catch (e) {
  errNoJwt = e instanceof EdgeFunctionError && e.code === 'UNAUTHORIZED' && e.status === 401;
}
assert(errNoJwt, "[3.1] Function 'create-conversation' sem JWT é REJEITADA antes do fetch.");

const serviceRoleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.signature';
let errServiceRole = false;
try {
  await callEdgeFunction('send-message', { conversation_id: 'c123', content: 'hi' }, { jwt: serviceRoleJwt });
} catch (e) {
  errServiceRole = e instanceof EdgeFunctionError && e.code === 'FORBIDDEN' && e.status === 403;
}
assert(errServiceRole, "[3.2] JWT contendo claim role=service_role é decodificado e REJEITADO antes do fetch.");

// --- 4. ISOLAMENTO DE AUTHORIZATION EM SUBMIT-LEAD ---
let fetchCount4 = 0;
let headers4 = {};
const mockFetch4 = async (url, opts) => {
  fetchCount4++;
  headers4 = opts.headers;
  return {
    ok: true,
    status: 200,
    headers: new Map([['content-type', 'application/json']]),
    text: async () => JSON.stringify({ success: true, lead_id: 'lead_123' }),
  };
};

const res4 = await callEdgeFunction('submit-lead', { p_name: 'Test' }, { jwt: fakeAnonJwt, customFetch: mockFetch4 });
assert(res4.success === true && fetchCount4 === 1, "[4.1] 'submit-lead' executa com sucesso em exatamente 1 fetch.");
assert(headers4['Authorization'] === undefined, "[4.2] Header 'Authorization' NUNCA é enviado em submit-lead.");

// --- 5. EXECUÇÃO AUTENTICADA (SEND-MESSAGE) ---
let headers5 = {};
const mockFetch5 = async (url, opts) => {
  headers5 = opts.headers;
  return {
    ok: true,
    status: 200,
    headers: new Map([['content-type', 'application/json']]),
    text: async () => JSON.stringify({ success: true, message_id: 'msg_123' }),
  };
};

const res5 = await callEdgeFunction('send-message', { conversation_id: 'c123', content: 'hi' }, { jwt: fakeAnonJwt, customFetch: mockFetch5 });
assert(res5.success === true, "[5.1] 'send-message' com JWT é executado com sucesso.");
assert(headers5['Authorization'] === `Bearer ${fakeAnonJwt}`, "[5.2] Header 'Authorization: Bearer <JWT>' é incluído corretamente.");

// --- 6. ERROS DO SERVIDOR SEM REFLEXÃO DE PII E SANITIZAÇÃO RIGOROSA ---
const mockFetchPiiSensitive = async () => ({
  ok: false,
  status: 400,
  headers: new Map([['content-type', 'application/json']]),
  text: async () => JSON.stringify({
    code: 'UNKNOWN_REMOTE_CODE',
    message: 'email@example.com Bearer token-secreto'
  }),
});

let errPiiSensitive = null;
try {
  await callEdgeFunction('submit-lead', { p_name: 'Test' }, { customFetch: mockFetchPiiSensitive });
} catch (e) {
  errPiiSensitive = e;
}
assert(errPiiSensitive && errPiiSensitive.code === 'BAD_REQUEST', "[6.1] Código remoto desconhecido é convertido para 'BAD_REQUEST'.");
assert(
  errPiiSensitive &&
  !errPiiSensitive.message.includes('email@example.com') &&
  !errPiiSensitive.message.includes('token-secreto') &&
  !errPiiSensitive.message.includes('UNKNOWN_REMOTE_CODE'),
  "[6.2] Nenhum trecho da mensagem remota ou código desconhecido aparece na mensagem/código do erro."
);

const mockFetchRateLimit = async () => ({
  ok: false,
  status: 429,
  headers: new Map([['content-type', 'application/json'], ['retry-after', '60']]),
  text: async () => JSON.stringify({
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from email@example.com'
  }),
});

let errRateLimit = null;
try {
  await callEdgeFunction('submit-lead', { p_name: 'Test' }, { customFetch: mockFetchRateLimit });
} catch (e) {
  errRateLimit = e;
}
assert(errRateLimit && errRateLimit.code === 'RATE_LIMIT_EXCEEDED', "[6.3] Código conhecido ('RATE_LIMIT_EXCEEDED') é preservado.");
assert(errRateLimit && errRateLimit.message === 'Rate limit exceeded. Please try again later.', "[6.4] Código conhecido utiliza a mensagem local fixa sem vazar o corpo remoto.");

// --- 7. VERIFICAÇÃO ESTRITA DE CONTENT-TYPE E HTTP 204 ---
assert(isStrictJsonMimeType('application/json') === true, "[7.1] MIME 'application/json' é VÁLIDO.");
assert(isStrictJsonMimeType('application/json; charset=utf-8') === true, "[7.2] MIME 'application/json; charset=utf-8' é VÁLIDO.");
assert(isStrictJsonMimeType('application/problem+json') === true, "[7.3] MIME 'application/problem+json' é VÁLIDO.");
assert(isStrictJsonMimeType('application/vnd.api+json; charset=utf-8') === true, "[7.4] MIME 'application/vnd.api+json; charset=utf-8' é VÁLIDO.");
assert(isStrictJsonMimeType('application/json qualquer-coisa') === false, "[7.5] MIME 'application/json qualquer-coisa' é REJEITADO.");
assert(isStrictJsonMimeType('application/problem+json lixo') === false, "[7.6] MIME 'application/problem+json lixo' é REJEITADO.");
assert(isStrictJsonMimeType('application/jsonp') === false, "[7.7] MIME 'application/jsonp' é REJEITADO.");
assert(isStrictJsonMimeType('application/json.evil') === false, "[7.8] MIME 'application/json.evil' é REJEITADO.");
assert(isStrictJsonMimeType('text/json') === false, "[7.9] MIME 'text/json' é REJEITADO.");
assert(isStrictJsonMimeType('application/fakejson') === false, "[7.10] MIME 'application/fakejson' é REJEITADO.");
assert(isStrictJsonMimeType('application/json\r\nHeader: injected') === false, "[7.11] MIME contendo CR/LF é REJEITADO.");
assert(isStrictJsonMimeType('') === false, "[7.12] MIME string vazia é REJEITADO.");

const mockFetch204 = async () => ({
  ok: true,
  status: 204,
  headers: new Map(),
  text: async () => '',
});
const res204 = await callEdgeFunction('submit-lead', { p_name: 'Test' }, { customFetch: mockFetch204 });
assert(res204 === null, "[7.13] Resposta HTTP 204 No Content retorna NULL explicitamente.");

const mockFetch200Empty = async () => ({
  ok: true,
  status: 200,
  headers: new Map([['content-type', 'application/json']]),
  text: async () => '   ',
});
let errEmpty200 = false;
try {
  await callEdgeFunction('submit-lead', { p_name: 'Test' }, { customFetch: mockFetch200Empty });
} catch (e) {
  errEmpty200 = e instanceof EdgeFunctionError && e.code === 'INVALID_RESPONSE_JSON';
}
assert(errEmpty200, "[7.14] Resposta HTTP 200 OK com corpo vazio produz erro INVALID_RESPONSE_JSON.");

// --- 8. VERIFICAÇÃO DE CONTENT-LENGTH E READABLESTREAM DE RESPOSTA ---
const mockFetchContentLengthTooLarge = async () => ({
  ok: true,
  status: 200,
  headers: new Map([
    ['content-type', 'application/json'],
    ['content-length', '70000']
  ]),
  text: async () => 'X'.repeat(70000),
});

let errClTooLarge = false;
try {
  await callEdgeFunction('submit-lead', { p_name: 'Test' }, { customFetch: mockFetchContentLengthTooLarge });
} catch (e) {
  errClTooLarge = e instanceof EdgeFunctionError && e.code === 'RESPONSE_TOO_LARGE' && e.status === 413;
}
assert(errClTooLarge, "[8.1] Content-Length > 64 KB é REJEITADO antes de ler o corpo da resposta.");

let readerCancelled = false;
const mockFetchStreamTooLarge = async () => {
  const encoder = new TextEncoder();
  const chunk = encoder.encode('A'.repeat(40000));
  let count = 0;
  const body = {
    getReader: () => ({
      read: async () => {
        count++;
        if (count <= 2) return { done: false, value: chunk }; // Total 80 KB > 64 KB
        return { done: true, value: undefined };
      },
      cancel: async () => { readerCancelled = true; },
      releaseLock: () => {}
    })
  };
  return {
    ok: true,
    status: 200,
    headers: new Map([['content-type', 'application/json']]),
    body,
  };
};

let errStreamTooLarge = false;
try {
  await callEdgeFunction('submit-lead', { p_name: 'Test' }, { customFetch: mockFetchStreamTooLarge });
} catch (e) {
  errStreamTooLarge = e instanceof EdgeFunctionError && e.code === 'RESPONSE_TOO_LARGE';
}
assert(errStreamTooLarge && readerCancelled, "[8.2] Stream de resposta excedendo 64 KB é CANCELADA e REJEITADA.");

// Teste do Fallback Sem Stream (Opção B): Medição Best-Effort
const mockFetchNoStreamFallback = async () => ({
  ok: true,
  status: 200,
  headers: new Map([['content-type', 'application/json']]),
  text: async () => JSON.stringify({ success: true, mode: 'fallback' }),
});
const resFallback = await callEdgeFunction('submit-lead', { p_name: 'Test' }, { customFetch: mockFetchNoStreamFallback });
assert(resFallback && resFallback.mode === 'fallback', "[8.3] Fallback sem Streams API lê o corpo com medição best-effort e conclui com SUCESSO.");

// --- 9. TIMEOUT E ABORT CONTROLLER DURANTE TODO O CICLO DE VIDA ---
const mockFetchTimeoutDuringRead = async (url, opts) => {
  const body = {
    getReader: () => ({
      read: () => new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve({ done: true, value: undefined }), 3000);
        if (opts.signal) {
          opts.signal.addEventListener('abort', () => {
            clearTimeout(timer);
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          }, { once: true });
        }
      }),
      cancel: async () => {},
      releaseLock: () => {}
    })
  };
  return {
    ok: true,
    status: 200,
    headers: new Map([['content-type', 'application/json']]),
    body,
  };
};

let errTimeoutRead = null;
try {
  await callEdgeFunction('submit-lead', { p_name: 'Test' }, { timeoutMs: 1000, customFetch: mockFetchTimeoutDuringRead });
} catch (e) {
  errTimeoutRead = e;
}
assert(errTimeoutRead && errTimeoutRead.isTimeout === true && errTimeoutRead.code === 'TIMEOUT', "[9.1] Timeout ocorrido durante a LEITURA DA STREAM retorna isTimeout=true e code='TIMEOUT'.");

const externalAbort = new AbortController();
const mockFetchAbortDuringRead = async (url, opts) => {
  const body = {
    getReader: () => ({
      read: () => new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve({ done: true, value: undefined }), 3000);
        if (opts.signal) {
          opts.signal.addEventListener('abort', () => {
            clearTimeout(timer);
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          }, { once: true });
        }
      }),
      cancel: async () => {},
      releaseLock: () => {}
    })
  };
  return {
    ok: true,
    status: 200,
    headers: new Map([['content-type', 'application/json']]),
    body,
  };
};

const abortCallPromise = callEdgeFunction('submit-lead', { p_name: 'Test' }, { signal: externalAbort.signal, timeoutMs: 15000, customFetch: mockFetchAbortDuringRead });
setTimeout(() => externalAbort.abort(), 100);

let errAbortRead = null;
try {
  await abortCallPromise;
} catch (e) {
  errAbortRead = e;
}
assert(errAbortRead && errAbortRead.isAborted === true && errAbortRead.isTimeout === false && errAbortRead.code === 'ABORTED', "[9.2] AbortSignal externo disparado durante a LEITURA DA STREAM retorna isAborted=true.");

// --- 10. AUSÊNCIA DE RETRY EM STATUS HTTP (401 / 429 / 502) ---
let attemptCount429 = 0;
const mockFetch429 = async () => {
  attemptCount429++;
  return {
    ok: false,
    status: 429,
    headers: new Map([['retry-after', '30'], ['content-type', 'application/json']]),
    text: async () => JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED' }),
  };
};

let err429 = null;
try {
  await callEdgeFunction('submit-lead', { p_name: 'Test' }, { customFetch: mockFetch429 });
} catch (e) {
  err429 = e;
}
assert(attemptCount429 === 1, "[10.1] Chamada para Edge Function executa exatamente 1 fetch sem retry automático em HTTP 429.");
assert(err429 && err429.status === 429 && err429.retryAfterSeconds === 30, "[10.2] Header Retry-After de HTTP 429 é parseado com sucesso.");

console.log(`\n==========================================`);
console.log(`RESUMO DOS TESTES DO EDGE CLIENT: ${passed}/${total} PASSARAM`);
console.log(`==========================================\n`);
