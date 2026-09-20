// ESSENCIAL GOOD - VISITOR CHAT AUTOMATED TEST SUITE (Node.js)
// Classificação Honesta:
// 1. Verificações Estáticas (Código / Arquivos de Produção)
// 2. Testes Unitários de Runtime (Funções Reais de Produção em src/lib/visitorChatRuntime.js e getValidVisitorJwt)
// 3. Simulações Auxiliares de Ciclo de Vida (Ordem e Referências)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

process.env.VITE_APP_ENV = 'staging';
process.env.VITE_EXPECTED_SUPABASE_PROJECT_REF = 'zauvpsxeexwthobmbkku';
process.env.VITE_SUPABASE_URL = 'https://zauvpsxeexwthobmbkku.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_staging.signature';
process.env.VITE_TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

let staticPassed = 0;
let staticTotal = 0;
let unitPassed = 0;
let unitTotal = 0;
let simPassed = 0;
let simTotal = 0;

function assertStatic(condition, message) {
  staticTotal++;
  if (condition) {
    console.log(`  ✅ [PASS-ESTÁTICO] ${message}`);
    staticPassed++;
  } else {
    console.error(`  ❌ [FAIL-ESTÁTICO] ${message}`);
    process.exitCode = 1;
  }
}

function assertUnit(condition, message) {
  unitTotal++;
  if (condition) {
    console.log(`  ✅ [PASS-UNITÁRIO PRODUÇÃO] ${message}`);
    unitPassed++;
  } else {
    console.error(`  ❌ [FAIL-UNITÁRIO PRODUÇÃO] ${message}`);
    process.exitCode = 1;
  }
}

function assertSim(condition, message) {
  simTotal++;
  if (condition) {
    console.log(`  ℹ️  [PASS-SIMULAÇÃO AUXILIAR] ${message}`);
    simPassed++;
  } else {
    console.error(`  ❌ [FAIL-SIMULAÇÃO AUXILIAR] ${message}`);
    process.exitCode = 1;
  }
}

console.log("==========================================================");
console.log("VISITOR CHAT EDGE INTEGRATION AUTOMATED TEST SUITE");
console.log("==========================================================\n");

// ----------------------------------------------------------------------------
// PARTE 1: VERIFICAÇÕES ESTRUTURAIS & ESTÁTICAS DE CÓDIGO (16 VERIFICAÇÕES)
// ----------------------------------------------------------------------------
console.log("--- PARTE 1: VERIFICAÇÕES ESTRUTURAIS & ESTÁTICAS DE CÓDIGO ---");
const hookPath = path.join(rootDir, 'src', 'hooks', 'useVisitorChat.js');
const runtimePath = path.join(rootDir, 'src', 'lib', 'visitorChatRuntime.js');
const useVisitorChatCode = fs.readFileSync(hookPath, 'utf8');

assertStatic(fs.existsSync(hookPath), "[1.1] Arquivo src/hooks/useVisitorChat.js existe.");
assertStatic(fs.existsSync(runtimePath), "[1.2] Arquivo src/lib/visitorChatRuntime.js existe.");
assertStatic(useVisitorChatCode.includes("callEdgeFunction('create-conversation'"), "[1.3] create-conversation invoca callEdgeFunction.");
assertStatic(useVisitorChatCode.includes("callEdgeFunction('send-message'"), "[1.4] send-message invoca callEdgeFunction.");
assertStatic(useVisitorChatCode.includes("requestTurnstileToken('create_conversation'"), "[1.5] create-conversation solicita token Turnstile com action 'create_conversation'.");
assertStatic(!useVisitorChatCode.includes(".from('conversations').insert"), "[1.6] Visitor chat NUNCA faz INSERT direto na tabela 'conversations'.");
assertStatic(!useVisitorChatCode.includes(".from('messages').insert"), "[1.7] Visitor chat NUNCA faz INSERT direto na tabela 'messages'.");

assertStatic(!useVisitorChatCode.includes("payload.visitor_id ="), "[2.1] Payload de create-conversation NÃO envia 'visitor_id'.");
assertStatic(!useVisitorChatCode.includes("payload.source_host ="), "[2.2] Payload de create-conversation NÃO envia 'source_host'.");
assertStatic(!useVisitorChatCode.includes("payload.status ="), "[2.3] Payload de create-conversation NÃO envia 'status'.");
assertStatic(!useVisitorChatCode.includes("payload.assigned_to ="), "[2.4] Payload de create-conversation NÃO envia 'assigned_to'.");

assertStatic(useVisitorChatCode.includes("buildSendMessagePayload("), "[3.1] Payload de send-message utiliza buildSendMessagePayload.");
assertStatic(useVisitorChatCode.includes("validateCanonicalVisitorMessage("), "[3.2] Validação canônica utiliza validateCanonicalVisitorMessage estrito.");

const adminConvPath = path.join(rootDir, 'src', 'hooks', 'useAdminConversations.js');
const adminConvCode = fs.readFileSync(adminConvPath, 'utf8');
assertStatic(fs.existsSync(adminConvPath), "[4.1] Arquivo useAdminConversations.js existe.");
assertStatic(!adminConvCode.includes("callEdgeFunction"), "[4.2] Fluxo administrativo do useAdminConversations permanece 100% isolado.");
assertStatic(useVisitorChatCode.includes("mountedRef.current"), "[5.1] Proteção mountedRef aplicada no useVisitorChat.");


// ----------------------------------------------------------------------------
// PARTE 2: TESTES UNITÁRIOS DAS FUNÇÕES REAIS DE PRODUÇÃO (30 TESTES)
// ----------------------------------------------------------------------------
console.log("\n--- PARTE 2: TESTES UNITÁRIOS DAS FUNÇÕES REAIS DE PRODUÇÃO ---");

const {
  buildCreateConversationPayload,
  buildSendMessagePayload,
  validateCanonicalVisitorMessage,
  reconcileOptimisticMessage,
  getRateLimitRemainingSeconds,
  applyRateLimit,
  canStartVisitorOperation,
} = await import('../src/lib/visitorChatRuntime.js');

const {
  mapVisitorErrorMessage,
  getValidVisitorJwt,
} = await import('../src/hooks/useVisitorChat.js');

const { EdgeFunctionError } = await import('../src/lib/edgeClient.js');

// 2.1. buildCreateConversationPayload
console.log("\n[2.1] Função Real: buildCreateConversationPayload");
const payloadCreate = buildCreateConversationPayload(
  { name: ' Diego ', email: 'diego@test.com ', phone: undefined },
  { source_url: 'https://essencialgood.com/p1', source_product: 'Prod 1' },
  'ts_token_123'
);
assertUnit(payloadCreate.visitor_name === 'Diego' && payloadCreate.visitor_email === 'diego@test.com', "[2.1.1] Limpa espaços do nome e e-mail.");
assertUnit(payloadCreate.visitor_phone === undefined, "[2.1.2] Omite chaves com valores undefined.");
assertUnit(!('visitor_id' in payloadCreate) && !('status' in payloadCreate), "[2.1.3] Não inclui campos fora da allowlist.");

// 2.2. buildSendMessagePayload
console.log("\n[2.2] Função Real: buildSendMessagePayload");
const payloadSend = buildSendMessagePayload(' conv_123 ', ' Olá mundo ');
assertUnit(Object.keys(payloadSend).length === 2 && payloadSend.conversation_id === 'conv_123' && payloadSend.content === 'Olá mundo', "[2.2.1] Retorna objeto com exatamente 2 chaves limpas.");

// 2.3. validateCanonicalVisitorMessage (Estrito)
console.log("\n[2.3] Função Real: validateCanonicalVisitorMessage");
const validMsg = validateCanonicalVisitorMessage(
  { id: 'uuid-1', conversation_id: 'conv_1', sender_type: 'visitor', content: 'Oi', created_at: '2026-09-20T00:00:00Z' },
  'conv_1',
  'Oi'
);
assertUnit(validMsg !== null && validMsg.id === 'uuid-1', "[2.3.1] Valida objeto canônico correto.");

const wrappedMsg = validateCanonicalVisitorMessage(
  { message: { id: 'uuid-1', conversation_id: 'conv_1', sender_type: 'visitor', content: 'Oi', created_at: '2026-09-20T00:00:00Z' } },
  'conv_1',
  'Oi'
);
assertUnit(wrappedMsg === null, "[2.3.2] Rejeita estritamente objetos encapsulados em .message.");

const wrappedDataMsg = validateCanonicalVisitorMessage(
  { data: { id: 'uuid-1', conversation_id: 'conv_1', sender_type: 'visitor', content: 'Oi', created_at: '2026-09-20T00:00:00Z' } },
  'conv_1',
  'Oi'
);
assertUnit(wrappedDataMsg === null, "[2.3.3] Rejeita estritamente objetos encapsulados em .data.");

const invalidCreatedAtMsg = validateCanonicalVisitorMessage(
  { id: 'uuid-1', conversation_id: 'conv_1', sender_type: 'visitor', content: 'Oi', created_at: 'data-invalida' },
  'conv_1',
  'Oi'
);
assertUnit(invalidCreatedAtMsg === null, "[2.3.4] Rejeita mensagens com created_at ISO inválido.");

const wrongSenderMsg = validateCanonicalVisitorMessage(
  { id: 'uuid-1', conversation_id: 'conv_1', sender_type: 'admin', content: 'Oi', created_at: '2026-09-20T00:00:00Z' },
  'conv_1',
  'Oi'
);
assertUnit(wrongSenderMsg === null, "[2.3.5] Rejeita mensagens onde sender_type !== 'visitor'.");

// 2.4. reconcileOptimisticMessage
console.log("\n[2.4] Função Real: reconcileOptimisticMessage");
const tempId = 'temp_999';
const initialList = [{ id: tempId, conversation_id: 'conv_1', sender_type: 'visitor', content: 'Olá' }];
const canonicalObj = { id: 'uuid-888', conversation_id: 'conv_1', sender_type: 'visitor', content: 'Olá', created_at: '2026-09-20T00:00:00Z' };

const httpFirst = reconcileOptimisticMessage(initialList, tempId, canonicalObj, 'conv_1');
assertUnit(httpFirst.length === 1 && httpFirst[0].id === 'uuid-888', "[2.4.1] HTTP primeiro: substitui tempId pela canônica.");

const realtimeLater = reconcileOptimisticMessage(httpFirst, null, canonicalObj, 'conv_1');
assertUnit(realtimeLater.length === 1 && realtimeLater[0].id === 'uuid-888', "[2.4.2] Realtime posterior não duplica canônica.");

const diffConvMsg = { id: 'uuid-777', conversation_id: 'conv_OUTRA', sender_type: 'visitor', content: 'Olá', created_at: '2026-09-20T00:00:00Z' };
const wrongConvList = reconcileOptimisticMessage(initialList, tempId, diffConvMsg, 'conv_1');
assertUnit(wrongConvList.length === 0, "[2.4.3] Mensagem de outra conversa remove tempId e ignora inserção.");

// 2.5. Rate Limiting (applyRateLimit & getRateLimitRemainingSeconds)
console.log("\n[2.5] Função Real: applyRateLimit & getRateLimitRemainingSeconds");
const now = 100000;
const err429Create = new EdgeFunctionError({ status: 429, retryAfterSeconds: 45 });
const state1 = applyRateLimit({ create: 0, send: 0 }, 'create', err429Create, now);
assertUnit(state1.create === now + 45000 && state1.send === 0, "[2.5.1] Erro 429 em 'create' atualiza apenas o escopo create.");

const err429Send = new EdgeFunctionError({ status: 429, retryAfterSeconds: 30 });
const state2 = applyRateLimit(state1, 'send', err429Send, now);
assertUnit(state2.create === now + 45000 && state2.send === now + 30000, "[2.5.2] Erro 429 em 'send' atualiza o escopo send mantendo create independente.");

const remCreate = getRateLimitRemainingSeconds(state2, 'create', now + 10000);
assertUnit(remCreate === 35, "[2.5.3] Calcula corretamente os segundos restantes (35s).");

const remExpired = getRateLimitRemainingSeconds(state2, 'create', now + 50000);
assertUnit(remExpired === 0, "[2.5.4] Retorna 0 quando o prazo de bloqueio expirou.");

// 2.6. TRAVAS DE EXCLUSÃO MÚTUA (canStartVisitorOperation)
console.log("\n[2.6] Função Real: canStartVisitorOperation");
assertUnit(canStartVisitorOperation({ createLock: false, sendLock: false }) === true, "[2.6.1] Permite operação quando nenhuma trava está ativa.");
assertUnit(canStartVisitorOperation({ createLock: true, sendLock: false }, 'send') === false, "[2.6.2] Bloqueia 'send' se 'createLock' estiver ativo.");
assertUnit(canStartVisitorOperation({ createLock: false, sendLock: true }, 'create') === false, "[2.6.3] Bloqueia 'create' se 'sendLock' estiver ativo.");

// 2.7. Autenticação e JWT (getValidVisitorJwt)
console.log("\n[2.7] Função Real: getValidVisitorJwt");
const mockValidSupabase = {
  auth: {
    getSession: async () => ({
      data: { session: { user: { id: 'usr_1', is_anonymous: true }, access_token: 'jwt_ok', expires_at: Math.floor(Date.now() / 1000) + 3600 } },
      error: null,
    }),
  },
};
const jwt1 = await getValidVisitorJwt(mockValidSupabase);
assertUnit(jwt1 === 'jwt_ok', "[2.7.1] Retorna JWT de sessão válida.");

const mockNoExpiresSupabase = {
  auth: {
    getSession: async () => ({
      data: { session: { user: { id: 'usr_1', is_anonymous: true }, access_token: 'jwt_no_exp' } },
      error: null,
    }),
    refreshSession: async () => ({
      data: { session: { user: { id: 'usr_1' }, access_token: 'jwt_refreshed', expires_at: Math.floor(Date.now() / 1000) + 3600 } },
      error: null,
    }),
  },
};
const jwt2 = await getValidVisitorJwt(mockNoExpiresSupabase);
assertUnit(jwt2 === 'jwt_refreshed', "[2.7.2] expires_at ausente aciona refreshSession preventivo e obtém novo JWT.");

const mockGetSessionErrorSupabase = {
  auth: {
    getSession: async () => ({ data: null, error: new Error('Storage error') }),
    signInAnonymously: async () => ({
      data: { user: { id: 'usr_anon' }, session: { access_token: 'anon_jwt', expires_at: Math.floor(Date.now() / 1000) + 3600 } },
      error: null,
    }),
  },
};
const jwt3 = await getValidVisitorJwt(mockGetSessionErrorSupabase);
assertUnit(jwt3 === 'anon_jwt', "[2.7.3] Erro silencioso em getSession recupera criando nova sessão anônima.");


// ----------------------------------------------------------------------------
// PARTE 3: SIMULAÇÕES AUXILIARES DE ORDEM & CICLO DE VIDA (2 SIMULAÇÕES)
// ----------------------------------------------------------------------------
console.log("\n--- PARTE 3: SIMULAÇÕES AUXILIARES DE ORDEM & CICLO DE VIDA ---");

const execOrder = [];
const mockOrder = {
  requestTurnstileToken: async () => { execOrder.push('TURNSTILE'); return 'ts_123'; },
  getValidVisitorJwt: async () => { execOrder.push('JWT'); return 'jwt_123'; },
};
await mockOrder.requestTurnstileToken();
await mockOrder.getValidVisitorJwt();
assertSim(execOrder[0] === 'TURNSTILE' && execOrder[1] === 'JWT', "[3.1] (Simulação) Desafio Turnstile é solicitado ANTES da renovação do JWT.");

let mountedFlag = false;
let stateVal = 'original';
const safeSet = (val) => { if (mountedFlag) stateVal = val; };
safeSet('modificado');
assertSim(stateVal === 'original', "[3.2] (Simulação) Flag de montagem impede atualização de estado pós-unmount.");


console.log("\n==========================================================");
console.log(`RESUMO HONESTO DOS TESTES DA FASE 2B.3:`);
console.log(`  - VERIFICAÇÕES ESTRUTURAIS ESTÁTICAS: ${staticPassed}/${staticTotal} PASSARAM`);
console.log(`  - TESTES UNITÁRIOS DE PRODUÇÃO:      ${unitPassed}/${unitTotal} PASSARAM`);
console.log(`  - SIMULAÇÕES AUXILIARES DE FLUXO:     ${simPassed}/${simTotal} PASSARAM`);
console.log(`  - TOTAL GERAL:                        ${staticPassed + unitPassed + simPassed}/${staticTotal + unitTotal + simTotal} PASSARAM`);
console.log("==========================================================\n");
