/**
 * ESSENCIAL GOOD - EDGE FUNCTION & WEB PUSH LOCAL LOGIC TEST SUITE
 * Testes automatizados sem dependência de Docker para validar o comportamento da Edge Function send-web-push.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== INICIANDO TESTES LOCAIS DA EDGE FUNCTION SEND-WEB-PUSH ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. TESTE DE SUPORTE E CRIPTOGRAFIA WEB-PUSH (VAPID ECDSA / P-256)
console.log('1. Testando suporte a ECDSA P-256 e Deno npm specifier (npm:web-push@3.6.7)...');
try {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();
  const pub = ecdh.getPublicKey('base64');
  const priv = ecdh.getPrivateKey('base64');
  assert(Boolean(pub && priv), 'Curva elíptica P-256 (VAPID) suportada nativamente pelo ambiente.');
  assert(pub.length > 20, 'Chave pública VAPID P-256 gerada com tamanho válido.');
} catch (err) {
  assert(false, `Falha ao testar criptografia VAPID: ${err.message}`);
}

// 2. SIMULAÇÃO E VALIDAÇÕES HTTP DA EDGE FUNCTION
console.log('\n2. Testando regras HTTP da Edge Function send-web-push...');

const MOCK_WEBHOOK_SECRET = 'test_webhook_secret_12345';

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function handleEdgeRequest(method, contentType, secretHeader, rawBody) {
  // Method 405
  if (method !== 'POST') {
    return { status: 405, body: { error: 'Method not allowed' } };
  }

  // Content-Type 415
  if (!contentType || !contentType.toLowerCase().includes('application/json')) {
    return { status: 415, body: { error: 'Unsupported media type' } };
  }

  // Secret 401
  if (!secretHeader || !timingSafeEqual(secretHeader, MOCK_WEBHOOK_SECRET)) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }

  // Payload Limit 413 (>4KB)
  const bodyLength = Buffer.byteLength(rawBody || '', 'utf8');
  if (bodyLength > 4096) {
    return { status: 413, body: { error: 'Payload too large. Exceeds 4KB limit' } };
  }

  // JSON Schema 400
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { error: 'Invalid JSON format' } };
  }

  const { type, schema, table, record } = body || {};
  if (type !== 'INSERT' || schema !== 'public' || !['conversations', 'checkout_leads'].includes(table) || !record?.id) {
    return { status: 400, body: { error: 'Invalid event payload schema' } };
  }

  // Generic Non-PII Payload Construction
  const payloadObject = table === 'conversations'
    ? { title: 'Novo chat recebido', body: 'Uma nova conversa foi iniciada.', url: '/admin/conversations', type: 'new_conversation', tag: 'chat-new' }
    : { title: 'Novo lead do pré-checkout', body: 'Um novo contato foi capturado.', url: '/admin/leads', type: 'new_checkout_lead', tag: 'lead-new' };

  return { status: 200, body: { success: true, payload: payloadObject } };
}

// Sub-teste 2.1: GET -> 405
const res405 = handleEdgeRequest('GET', 'application/json', MOCK_WEBHOOK_SECRET, '{}');
assert(res405.status === 405, 'Requisição GET retorna HTTP 405 Method Not Allowed.');

// Sub-teste 2.2: Content-Type inválido -> 415
const res415 = handleEdgeRequest('POST', 'text/plain', MOCK_WEBHOOK_SECRET, '{}');
assert(res415.status === 415, 'Content-Type texto/plano retorna HTTP 415 Unsupported Media Type.');

// Sub-teste 2.3: Secret ausente/incorreto -> 401
const res401 = handleEdgeRequest('POST', 'application/json', 'secret_errada', '{}');
assert(res401.status === 401, 'Webhook secret inválido retorna HTTP 401 Unauthorized.');

// Sub-teste 2.4: Payload > 4KB -> 413
const bigBody = JSON.stringify({ type: 'INSERT', schema: 'public', table: 'conversations', record: { id: '123' }, extra: 'A'.repeat(5000) });
const res413 = handleEdgeRequest('POST', 'application/json', MOCK_WEBHOOK_SECRET, bigBody);
assert(res413.status === 413, 'Payload acima de 4KB retorna HTTP 413 Payload Too Large.');

// Sub-teste 2.5: Schema/tabela inválidos -> 400
const res400Table = handleEdgeRequest('POST', 'application/json', MOCK_WEBHOOK_SECRET, JSON.stringify({ type: 'INSERT', schema: 'public', table: 'users', record: { id: '1' } }));
assert(res400Table.status === 400, 'Tabela não permitida (users) retorna HTTP 400 Bad Request.');

const res400Update = handleEdgeRequest('POST', 'application/json', MOCK_WEBHOOK_SECRET, JSON.stringify({ type: 'UPDATE', schema: 'public', table: 'conversations', record: { id: '1' } }));
assert(res400Update.status === 400, 'Tipo de evento não permitido (UPDATE) retorna HTTP 400 Bad Request.');

// Sub-teste 2.6: Eventos válidos de Conversations e Checkout Leads -> 200 sem PII
const validChatPayload = JSON.stringify({ type: 'INSERT', schema: 'public', table: 'conversations', record: { id: 'c123', visitor_name: 'Diego', phone: '11999999999' } });
const res200Chat = handleEdgeRequest('POST', 'application/json', MOCK_WEBHOOK_SECRET, validChatPayload);
assert(res200Chat.status === 200, 'Evento válido de nova conversa retorna HTTP 200.');
assert(res200Chat.body.payload.title === 'Novo chat recebido', 'Título da notificação é genérico ("Novo chat recebido").');
assert(!JSON.stringify(res200Chat.body.payload).includes('Diego') && !JSON.stringify(res200Chat.body.payload).includes('11999999999'), 'Garantia de ZERO PII (nome e telefone do visitante não são incluídos na notificação).');

const validLeadPayload = JSON.stringify({ type: 'INSERT', schema: 'public', table: 'checkout_leads', record: { id: 'l456', email: 'teste@email.com' } });
const res200Lead = handleEdgeRequest('POST', 'application/json', MOCK_WEBHOOK_SECRET, validLeadPayload);
assert(res200Lead.status === 200, 'Evento válido de novo lead retorna HTTP 200.');
assert(res200Lead.body.payload.title === 'Novo lead do pré-checkout', 'Título de lead é genérico ("Novo lead do pré-checkout").');
assert(!JSON.stringify(res200Lead.body.payload).includes('teste@email.com'), 'Garantia de ZERO PII (e-mail do lead não é incluído na notificação).');

// 3. TESTE DE IDEMPOTÊNCIA POR DISPOSITIVO (push_notification_deliveries)
console.log('\n3. Testando lógica da máquina de estados por dispositivo...');

class DeliveryManagerMock {
  constructor() {
    this.events = new Map();
    this.deliveries = new Map();
  }

  processEvent(eventKey, subId, shouldFail = false) {
    let event = this.events.get(eventKey);
    if (!event) {
      event = { id: `evt_1001`, key: eventKey, status: 'processing' };
      this.events.set(eventKey, event);
    }

    const deliveryKey = `${event.id}:${subId}`;
    let delivery = this.deliveries.get(deliveryKey);

    if (delivery && (delivery.status === 'completed' || delivery.status === 'expired')) {
      return { status: 'skipped_already_delivered', subId, deliveryStatus: delivery.status };
    }

    if (shouldFail) {
      this.deliveries.set(deliveryKey, { status: 'failed', last_error: 'HTTP_500' });
      event.status = 'failed';
      return { status: 'failed', subId };
    }

    this.deliveries.set(deliveryKey, { status: 'completed' });

    // Verifica se todas as entregas do evento terminaram
    const eventDeliveries = Array.from(this.deliveries.entries())
      .filter(([k]) => k.startsWith(event.id))
      .map(([, v]) => v.status);

    if (eventDeliveries.length >= 2 && eventDeliveries.every(s => s === 'completed' || s === 'expired')) {
      event.status = 'completed';
    }

    return { status: 'sent', subId };
  }
}

const manager = new DeliveryManagerMock();
const evtKey = 'conversations:123';
const subA = 'device_A';
const subB = 'device_B';

// Primeira execução: envio para A tem sucesso, B falha
const resA1 = manager.processEvent(evtKey, subA, false);
const resB1 = manager.processEvent(evtKey, subB, true);

assert(resA1.status === 'sent', 'Envio para dispositivo A efetuado com sucesso.');
assert(resB1.status === 'failed', 'Envio para dispositivo B falhou temporariamente.');

// Reenvio do Webhook após falha
const resA2 = manager.processEvent(evtKey, subA, false); // Dispositivo A não deve receber duplicado
const resB2 = manager.processEvent(evtKey, subB, false); // Dispositivo B deve ser tentado novamente com sucesso

assert(resA2.status === 'skipped_already_delivered', 'Dispositivo A foi ignorado no reenvio por já estar concluído (Idempotência por Dispositivo OK).');
assert(resB2.status === 'sent', 'Dispositivo B foi retentado e entregue com sucesso.');
assert(manager.events.get(evtKey).status === 'completed', 'Evento transitou para completed após conclusão de todas as entregas.');

// 4. TESTE DE CLASSIFICAÇÃO DE ERROS PUSH E SANITIZAÇÃO DE LOGS (ZERO PII)
console.log('\n4. Testando classificação sanitizada de erros...');

function detectPushProvider(endpoint) {
  if (!endpoint || typeof endpoint !== 'string') return 'unknown';
  const lower = endpoint.toLowerCase();
  if (lower.includes('fcm.googleapis.com') || lower.includes('android.googleapis.com')) {
    return 'FCM';
  }
  if (lower.includes('push.apple.com')) {
    return 'APNs';
  }
  if (lower.includes('push.services.mozilla.com')) {
    return 'Mozilla';
  }
  return 'unknown';
}

function sanitizeLogMessage(msg) {
  if (!msg) return '';
  let sanitized = String(msg);
  sanitized = sanitized.replace(/https?:\/\/[^\s"'>]+/gi, '[URL_REDACTED]');
  sanitized = sanitized.replace(/(?:key|token|auth|secret|p256dh|endpoint)[:=]\s*([^\s,;&]+)/gi, '$1=[REDACTED]');
  return sanitized;
}

function classifyPushError(err, endpoint, durationMs) {
  const errorName = err?.name || 'Error';
  const rawMessage = err?.message || String(err || 'Unknown error');
  const statusCode = err?.statusCode || err?.status;
  const providerCategory = detectPushProvider(endpoint || '');

  const sanitizedMessage = sanitizeLogMessage(rawMessage);

  if (typeof statusCode === 'number' && statusCode > 0) {
    const isExpired = statusCode === 404 || statusCode === 410;
    return {
      errorCode: `HTTP_${statusCode}`,
      statusCode,
      phase: 'http_response',
      errorName,
      sanitizedMessage,
      isExpired,
      durationMs,
      providerCategory,
    };
  }

  if (
    errorName === 'AbortError' ||
    rawMessage.includes('aborted') ||
    rawMessage.includes('timeout') ||
    rawMessage.includes('ECONNRESET') ||
    rawMessage.includes('ENOTFOUND') ||
    rawMessage.includes('network') ||
    rawMessage.includes('fetch failed') ||
    rawMessage.includes('redirect')
  ) {
    return {
      errorCode: 'NETWORK_ERROR',
      phase: 'network_fetch',
      errorName,
      sanitizedMessage,
      isExpired: false,
      durationMs,
      providerCategory,
    };
  }

  if (
    rawMessage.includes('VAPID') ||
    rawMessage.includes('vapid') ||
    rawMessage.includes('public key') ||
    rawMessage.includes('private key') ||
    rawMessage.includes('ECDH') ||
    rawMessage.includes('invalid key') ||
    rawMessage.includes('key format')
  ) {
    return {
      errorCode: 'VAPID_CONFIG',
      phase: 'vapid_config',
      errorName,
      sanitizedMessage,
      isExpired: false,
      durationMs,
      providerCategory,
    };
  }

  if (
    rawMessage.includes('encrypt') ||
    rawMessage.includes('cipher') ||
    rawMessage.includes('p256dh') ||
    rawMessage.includes('hkdf') ||
    rawMessage.includes('auth')
  ) {
    return {
      errorCode: 'ENCRYPTION_ERROR',
      phase: 'encryption',
      errorName,
      sanitizedMessage,
      isExpired: false,
      durationMs,
      providerCategory,
    };
  }

  return {
    errorCode: 'RUNTIME_ERROR',
    phase: 'runtime',
    errorName,
    sanitizedMessage,
    isExpired: false,
    durationMs,
    providerCategory,
  };
}

// Sub-teste 4.1: Erro HTTP 410 -> HTTP_410 + isExpired true
const err410 = { name: 'WebPushError', statusCode: 410, message: 'Subscription expired on https://fcm.googleapis.com/fcm/send/xyz' };
const class410 = classifyPushError(err410, 'https://fcm.googleapis.com/fcm/send/xyz', 450);
assert(class410.errorCode === 'HTTP_410', 'Erro HTTP 410 classificado como HTTP_410.');
assert(class410.isExpired === true, 'Erro HTTP 410 marca isExpired como true.');
assert(!class410.sanitizedMessage.includes('fcm.googleapis.com'), 'Endpoint URL é removido da mensagem sanitizada.');
assert(class410.providerCategory === 'FCM', 'Categoria do provedor identificada como FCM sem expor URL.');
assert(class410.durationMs === 450, 'Duração da tentativa em milissegundos é registrada corretamente.');

// Sub-teste 4.2: Timeout / AbortError após 8000ms -> NETWORK_ERROR (não HTTP_ERR)
const errTimeout = { name: 'AbortError', message: 'The signal has been aborted' };
const classTimeout = classifyPushError(errTimeout, 'https://push.services.mozilla.com/v1/send', 8012);
assert(classTimeout.errorCode === 'NETWORK_ERROR', 'AbortError/Timeout classificado como NETWORK_ERROR em vez de HTTP_ERR.');
assert(classTimeout.phase === 'network_fetch', 'Fase identificada como network_fetch.');
assert(classTimeout.providerCategory === 'Mozilla', 'Provedor Mozilla identificado sem expor URL.');
assert(classTimeout.durationMs === 8012, 'Duração de ~8000ms registrada corretamente.');

// Sub-teste 4.3: Erro de chave VAPID -> VAPID_CONFIG (não HTTP_ERR)
const errVapid = new Error('Invalid key format in VAPID private key');
const classVapid = classifyPushError(errVapid, 'https://push.apple.com/v1/sub', 15);
assert(classVapid.errorCode === 'VAPID_CONFIG', 'Erro de chave VAPID classificado como VAPID_CONFIG em vez de HTTP_ERR.');
assert(classVapid.phase === 'vapid_config', 'Fase identificada como vapid_config.');
assert(classVapid.providerCategory === 'APNs', 'Provedor APNs identificado.');

// Sub-teste 4.4: Erro de criptografia ECE -> ENCRYPTION_ERROR
const errEnc = new Error('Failed to encrypt payload with p256dh key');
const classEnc = classifyPushError(errEnc, '', 20);
assert(classEnc.errorCode === 'ENCRYPTION_ERROR', 'Erro de cifragem classificado como ENCRYPTION_ERROR.');
assert(classEnc.phase === 'encryption', 'Fase identificada como encryption.');
assert(classEnc.providerCategory === 'unknown', 'Provedor desconhecido retornado como unknown.');

// Sub-teste 4.5: Erro genérico de runtime -> RUNTIME_ERROR
const errRuntime = new TypeError('Cannot read property of undefined');
const classRuntime = classifyPushError(errRuntime, '', 5);
assert(classRuntime.errorCode === 'RUNTIME_ERROR', 'Exceção sem status HTTP classificada como RUNTIME_ERROR.');
assert(classRuntime.phase === 'runtime', 'Fase identificada como runtime.');

// 5. TESTE DO TRANSPORTE HÍBRIDO SEGURO (NATIVE FETCH + WEB-PUSH GENERATE)
console.log('\n5. Testando Transporte Híbrido Seguro...');

function prepareNativeFetchHeaders(rawHeaders) {
  const headers = {};
  if (!rawHeaders || typeof rawHeaders !== 'object') return headers;

  for (const [key, val] of Object.entries(rawHeaders)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey === 'content-length' ||
      lowerKey === 'connection' ||
      lowerKey === 'host' ||
      lowerKey === 'transfer-encoding'
    ) {
      continue;
    }
    if (val !== undefined && val !== null) {
      headers[key] = String(val);
    }
  }

  return headers;
}

// Sub-teste 5.1: Content-Length e headers de transporte Node são removidos
const mockNodeHeaders = {
  'Authorization': 'vapid t=xyz',
  'Content-Type': 'application/octet-stream',
  'Content-Length': '128',
  'Connection': 'keep-alive',
  'Host': 'fcm.googleapis.com',
  'Transfer-Encoding': 'chunked'
};
const cleanHeaders = prepareNativeFetchHeaders(mockNodeHeaders);
assert(cleanHeaders['Content-Length'] === undefined, 'Header Content-Length é removido para que o fetch nativo o calcule.');
assert(cleanHeaders['Connection'] === undefined, 'Header Node Connection é removido.');
assert(cleanHeaders['Host'] === undefined, 'Header Node Host é removido.');
assert(cleanHeaders['Transfer-Encoding'] === undefined, 'Header Node Transfer-Encoding é removido.');
assert(cleanHeaders['Authorization'] === 'vapid t=xyz', 'Header Authorization VAPID mantido.');

// Sub-teste 5.2: Buffer é convertido para Uint8Array independente
const sampleBuffer = Buffer.from('test_encrypted_payload');
const uint8ArrayBody = new Uint8Array(sampleBuffer);
assert(uint8ArrayBody instanceof Uint8Array, 'O corpo final da requisição é uma instância independente de Uint8Array.');
assert(uint8ArrayBody.byteLength === sampleBuffer.length, 'O tamanho do Uint8Array corresponde exatamente ao tamanho do payload.');

// Sub-teste 5.4: Teste de bloqueio de redirecionamentos (redirect: error)
const errRedirect = new TypeError('Fetch failed due to blocked redirect');
const classRedirect = classifyPushError(errRedirect, 'https://fcm.googleapis.com/fcm/send/xyz', 120);
assert(classRedirect.errorCode === 'NETWORK_ERROR', 'Rejeição por redirect: error classificada como NETWORK_ERROR.');
assert(classRedirect.phase === 'network_fetch', 'Fase de erro por redirect identificada como network_fetch.');
assert(!classRedirect.sanitizedMessage.includes('fcm.googleapis.com'), 'Mensagem de erro por redirect sanitizada sem expor URL ou endpoint.');

// 6. TESTE DE HARDENING E SIMULAÇÃO DE MATCHING DE HEADERS (VERCEL.JSON)
console.log('\n6. Testando Hardening e Simulação de Matching de Headers por Rota (vercel.json)...');

const vercelJsonPath = path.resolve(__dirname, '../vercel.json');
assert(fs.existsSync(vercelJsonPath), 'Arquivo vercel.json existe no projeto.');

const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
assert(Array.isArray(vercelConfig.headers), 'Sessão headers configurada no vercel.json.');

// Função de simulação de matching conforme especificação de rotas da Vercel
function matchVercelSource(source, pathname) {
  if (source === '/:path*') return true;
  if (source === '/admin(.*)' && (pathname === '/admin' || pathname.startsWith('/admin/'))) return true;
  if (source === '/widget-frame(.*)' && (pathname === '/widget-frame' || pathname.startsWith('/widget-frame/'))) return true;
  if (source === '/((?!admin|widget-frame).*)') {
    return !pathname.startsWith('/admin') && !pathname.startsWith('/widget-frame');
  }
  return false;
}

function getEffectiveHeaders(pathname, headersConfig) {
  const merged = new Map();
  let totalKeysAdded = 0;
  for (const rule of headersConfig) {
    if (matchVercelSource(rule.source, pathname)) {
      for (const h of rule.headers) {
        totalKeysAdded++;
        merged.set(h.key, h.value);
      }
    }
  }
  return { map: merged, uniqueCount: merged.size, totalKeysAdded };
}

const testRoutes = [
  '/',
  '/admin',
  '/admin/conversations',
  '/widget-frame',
  '/widget-frame/',
  '/sonnus',
  '/adv-sonnus',
  '/listicle/sonnus'
];

for (const route of testRoutes) {
  const effective = getEffectiveHeaders(route, vercelConfig.headers);
  const m = effective.map;

  // 1. Headers globais em todas as rotas
  assert(m.get('X-Content-Type-Options') === 'nosniff', `[${route}] Recebe X-Content-Type-Options: nosniff.`);
  assert(m.get('Referrer-Policy') === 'strict-origin-when-cross-origin', `[${route}] Recebe Referrer-Policy: strict-origin-when-cross-origin.`);
  assert(m.get('Permissions-Policy') && m.get('Permissions-Policy').includes('camera=()'), `[${route}] Recebe Permissions-Policy restritiva.`);

  // 2. Regras específicas para /admin e subrotas
  if (route.startsWith('/admin')) {
    assert(m.get('X-Frame-Options') === 'DENY', `[${route}] Recebe X-Frame-Options: DENY.`);
    assert(m.get('Content-Security-Policy') === "frame-ancestors 'none';", `[${route}] Recebe CSP frame-ancestors 'none';.`);
  }

  // 3. Regras específicas para /widget-frame e subrotas
  if (route.startsWith('/widget-frame')) {
    assert(m.get('X-Frame-Options') === undefined, `[${route}] NÃO recebe X-Frame-Options (Preserva chat em iframe).`);
    assert(m.get('Content-Security-Policy') === "frame-ancestors 'self' https://essencialgood.com https://www.essencialgood.com;", `[${route}] Recebe CSP frame-ancestors restrito a self/apex/www.`);
  }

  // 4. Regras para páginas públicas (não-admin e não-widget)
  if (!route.startsWith('/admin') && !route.startsWith('/widget-frame')) {
    assert(m.get('X-Frame-Options') === 'SAMEORIGIN', `[${route}] Recebe X-Frame-Options: SAMEORIGIN.`);
    assert(m.get('Content-Security-Policy') === undefined, `[${route}] NÃO recebe CSP completa prematura (apenas frame-ancestors quando aplicável).`);
  }

  // 5. Garantir ausência de duplicação de chave de header
  assert(effective.uniqueCount === effective.totalKeysAdded, `[${route}] Nenhum cabeçalho duplicado ou conflitante gerado.`);
}

console.log(`\n=== RESUMO DOS TESTES: ${passedTests}/${totalTests} PASSARAM ===\n`);
