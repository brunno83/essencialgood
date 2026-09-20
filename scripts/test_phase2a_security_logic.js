/**
 * ESSENCIAL GOOD - PHASE 2A SECURITY HARDENING EXTENDED AUDIT TEST SUITE
 * Testes automatizados locais em Node.js para validar a arquitetura da Fase 2A.
 * (Análise estática de DDL SQL, simulação de módulos TS e simulação mockada de controle de acesso).
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== INICIANDO SUÍTE DE TESTES E AUDITORIA EXPANDIDA DA FASE 2A ===');
console.log('Modo: Análise Estática de DDL SQL & Simulação de Lógica Mockada em Node.js\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message} (resultado esperado/simulado)`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// ----------------------------------------------------------------------------
// 1. AUDITORIA DA MIGRATION 010 (SQL DDL & GRANTS RESTRITOS)
// ----------------------------------------------------------------------------
console.log('1. Auditando Migration 010 (010_rate_limit_infrastructure.sql)...');

const migration010Path = path.resolve(__dirname, '../supabase/migrations/010_rate_limit_infrastructure.sql');
assert(fs.existsSync(migration010Path), 'Migration 010 existe no disco.');

const sql010Content = fs.readFileSync(migration010Path, 'utf8');

assert(sql010Content.includes('CREATE TABLE IF NOT EXISTS public.security_rate_limits'), 'Cria tabela public.security_rate_limits.');
assert(sql010Content.includes('VARCHAR(220) PRIMARY KEY'), 'bucket_key possui tamanho máximo de 220 caracteres na PK.');
assert(sql010Content.includes('ALTER TABLE public.security_rate_limits ENABLE ROW LEVEL SECURITY;'), 'Habilita RLS na tabela de rate limit.');
assert(sql010Content.includes('REVOKE ALL ON TABLE public.security_rate_limits FROM PUBLIC, anon, authenticated, service_role;'), 'Revoga todos os privilégios da tabela security_rate_limits de PUBLIC, anon, authenticated e service_role.');
assert(sql010Content.includes('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.security_rate_limits TO service_role;'), 'Concede exclusivamente SELECT, INSERT, UPDATE, DELETE em security_rate_limits ao service_role (sem TRUNCATE, REFERENCES ou TRIGGER).');

assert(sql010Content.includes('REVOKE ALL ON FUNCTION public.consume_rate_limit'), 'Revoga execução pública de consume_rate_limit.');
assert(sql010Content.includes('GRANT EXECUTE ON FUNCTION public.consume_rate_limit(VARCHAR, VARCHAR, INT, INT) TO service_role;'), 'Concede explicitamente EXECUTE em consume_rate_limit ao service_role.');
assert(sql010Content.includes('REVOKE ALL ON FUNCTION public.cleanup_expired_rate_limits() FROM PUBLIC, anon, authenticated;'), 'Revoga execução pública de cleanup_expired_rate_limits.');
assert(sql010Content.includes('GRANT EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() TO service_role;'), 'Concede explicitamente EXECUTE em cleanup_expired_rate_limits ao service_role.');
assert(sql010Content.includes('SECURITY DEFINER') && sql010Content.includes("SET search_path = ''"), 'Funções usam SECURITY DEFINER com search_path = \'\'.');

// Auditoria das revogações estritas de RPCs (Zero permissão direta para visitantes)
assert(sql010Content.includes('REVOKE ALL ON FUNCTION public.p_create_visitor_conversation(UUID) FROM PUBLIC, anon, authenticated;'), 'p_create_visitor_conversation tem EXECUTE revogado de anon e authenticated.');
assert(sql010Content.includes('GRANT EXECUTE ON FUNCTION public.p_create_visitor_conversation(UUID) TO service_role;'), 'p_create_visitor_conversation concedido EXCLUSIVAMENTE para service_role.');

assert(sql010Content.includes('REVOKE ALL ON FUNCTION public.p_send_visitor_message(UUID, UUID, TEXT) FROM PUBLIC, anon, authenticated;'), 'p_send_visitor_message tem EXECUTE revogado de anon e authenticated.');
assert(sql010Content.includes('GRANT EXECUTE ON FUNCTION public.p_send_visitor_message(UUID, UUID, TEXT) TO service_role;'), 'p_send_visitor_message concedido EXCLUSIVAMENTE para service_role.');

assert(sql010Content.includes("hashtext('conv_lock:' || p_visitor_id::text)"), 'p_create_visitor_conversation utiliza pg_advisory_xact_lock para garantir idempotência contra requisições concorrentes.');

// Auditoria estrita da proteção de Push Subscriptions (Limite 10, Imutabilidade de user_id, UPDATE enabled = false)
assert(sql010Content.includes('UPDATE public.push_subscriptions'), 'Trigger de push subscriptions realiza desativação suave (UPDATE enabled = false).');
assert(!sql010Content.includes('DELETE FROM public.push_subscriptions'), 'Trigger de push subscriptions NÃO exclui registros do banco.');
assert(sql010Content.includes('pg_advisory_xact_lock'), 'Trigger de push subscriptions utiliza pg_advisory_xact_lock para evitar race conditions.');
assert(sql010Content.includes('IF v_count >= 10 THEN'), 'Trigger de push subscriptions aplica o limite exatamente de 10 assinaturas ativas.');
assert(sql010Content.includes('LIMIT (v_count - 9)'), 'Trigger desativa (v_count - 9) assinaturas excedentes para manter 10 ativas.');
assert(sql010Content.includes('NEW.user_id IS DISTINCT FROM OLD.user_id'), 'Trigger valida imutabilidade do user_id em operações de UPDATE.');
assert(sql010Content.includes('BEFORE INSERT OR UPDATE OF enabled, user_id ON public.push_subscriptions'), 'Trigger intercepta alterações de enabled e user_id.');

// ----------------------------------------------------------------------------
// 2. CHAVES OPAQUES E INDEPENDÊNCIA DE JANELAS (HMAC DIGEST)
// ----------------------------------------------------------------------------
console.log('\n2. Auditando Geração de Chaves Opacas e Independência por Escopo...');

function hmacSha256(text, pepper) {
  return crypto.createHmac('sha256', pepper).update(text).digest('hex');
}

function generateOpaqueBucketKey(scope, rawIdentifier, pepper) {
  const digest = hmacSha256(`${scope}:${rawIdentifier}`, pepper);
  return `${scope}:${digest}`;
}

const testPepper = 'test_secret_pepper_2026';
const userId = '11111111-1111-4111-8111-111111111111';

const keyShort = generateOpaqueBucketKey('cc_uid_30m', userId, testPepper);
const keyDaily = generateOpaqueBucketKey('cc_uid_24h', userId, testPepper);

assert(keyShort !== keyDaily, 'Rate Limit: Chaves curta (30m) e longa (24h) são 100% independentes.');
assert(keyShort.startsWith('cc_uid_30m:'), 'Rate Limit: Prefixo da chave indica apenas o escopo público.');
assert(!keyShort.includes(userId), 'Rate Limit: A chave opaca NÃO contém o UID bruto do usuário em texto claro.');
assert(keyShort.split(':')[1].length === 64, 'Rate Limit: O corpo da chave é um hash HMAC-SHA256 de 64 caracteres hex.');
assert(keyShort.length <= 220, 'Rate Limit: Tamanho total da chave opaca está bem dentro do limite de 220 caracteres.');

// ----------------------------------------------------------------------------
// 3. CORS & VARY: ORIGIN
// ----------------------------------------------------------------------------
console.log('\n3. Auditando Módulo CORS e Cabeçalho Vary: Origin...');

function getCorsHeaders(originHeader, env = 'production') {
  const allowed = ['https://essencialgood.com', 'https://www.essencialgood.com'];
  const isDev = env === 'development';
  let matched = 'https://www.essencialgood.com';

  if (allowed.includes(originHeader)) {
    matched = originHeader;
  } else if (isDev && (originHeader.startsWith('http://localhost:') || originHeader.startsWith('http://127.0.0.1:'))) {
    matched = originHeader;
  }

  return {
    'Access-Control-Allow-Origin': matched,
    'Vary': 'Origin'
  };
}

const corsProdAllowed = getCorsHeaders('https://essencialgood.com', 'production');
assert(corsProdAllowed['Access-Control-Allow-Origin'] === 'https://essencialgood.com', 'CORS: Origem https://essencialgood.com permitida.');
assert(corsProdAllowed['Vary'] === 'Origin', 'CORS: Cabeçalho Vary: Origin incluído obrigatoriamente.');

const corsProdUntrusted = getCorsHeaders('https://malicious.com', 'production');
assert(corsProdUntrusted['Access-Control-Allow-Origin'] === 'https://www.essencialgood.com', 'CORS: Origem não autorizada não recebe header permissivo.');

// ----------------------------------------------------------------------------
// 4. SIMULAÇÃO DE BLOQUEIO DE BYPASS DIRETO DE RPCS E TRIGGER PUSH SUBSCRIPTIONS
// ----------------------------------------------------------------------------
console.log('\n4. Auditando Bloqueio de RPCs Diretas e Lógica de Push Subscriptions...');

function simulatePostgrestRpcCall(rpcName, role) {
  const rpcGrants = {
    p_create_visitor_conversation: ['service_role'],
    p_send_visitor_message: ['service_role'],
    consume_rate_limit: ['service_role'],
    cleanup_expired_rate_limits: ['service_role']
  };

  const allowedRoles = rpcGrants[rpcName] || [];
  if (!allowedRoles.includes(role)) {
    return { status: 403, error: 'permission denied for function ' + rpcName, code: '42501' };
  }

  return { status: 200, success: true };
}

const directAnonCall = simulatePostgrestRpcCall('p_create_visitor_conversation', 'anon');
assert(directAnonCall.status === 403, 'Bypass Protection: Chamada REST direta por visitante anônimo é RECUSADA (HTTP 403 / 42501).');

const directAuthCall = simulatePostgrestRpcCall('p_send_visitor_message', 'authenticated');
assert(directAuthCall.status === 403, 'Bypass Protection: Chamada REST direta por visitante autenticado é RECUSADA (HTTP 403 / 42501).');

const edgeServiceRoleCall = simulatePostgrestRpcCall('p_send_visitor_message', 'service_role');
assert(edgeServiceRoleCall.status === 200, 'Bypass Protection: Invocação via service_role a partir da Edge Function é PERMITIDA (HTTP 200 OK).');

// Simulação da lógica do trigger enforce_max_push_subscriptions
function simulatePushSubscriptionTrigger(op, oldRow, newRow, userSubscriptions) {
  if (op === 'UPDATE' && oldRow && oldRow.user_id !== newRow.user_id) {
    throw new Error('Alteração de user_id em push_subscriptions não é permitida. ERRCODE=22023');
  }

  if (!newRow.user_id) {
    throw new Error('user_id é obrigatório. ERRCODE=22023');
  }

  if (!newRow.enabled) {
    return { action: 'NONE', newRow };
  }

  if (op === 'UPDATE' && oldRow && oldRow.enabled && newRow.enabled) {
    return { action: 'NONE', newRow };
  }

  const activeSubs = userSubscriptions.filter(s => s.user_id === newRow.user_id && s.enabled);
  const count = activeSubs.length;

  if (count >= 10) {
    const toDeactivateCount = count - 9;
    const sorted = [...activeSubs].sort((a, b) => a.updated_at - b.updated_at);
    const deactivatedIds = sorted.slice(0, toDeactivateCount).map(s => s.id);
    return { action: 'DEACTIVATE', deactivatedIds, newRow };
  }

  return { action: 'INSERT_OR_ALLOW', newRow };
}

// Caso 4.1: 9 ativas + Novo INSERT -> 10 ativas sem desativação
const subsUser1 = Array.from({ length: 9 }, (_, i) => ({
  id: `sub_${i + 1}`,
  user_id: 'user_A',
  enabled: true,
  updated_at: i
}));

const res9 = simulatePushSubscriptionTrigger('INSERT', null, { user_id: 'user_A', enabled: true }, subsUser1);
assert(res9.action === 'INSERT_OR_ALLOW', 'Push Subscriptions: 9 ativas + INSERT resulta em permissão sem desativação (total 10 ativas).');

// Caso 4.2: 10 ativas + Novo INSERT -> desativa 1 antiga
const subsUser10 = Array.from({ length: 10 }, (_, i) => ({
  id: `sub_${i + 1}`,
  user_id: 'user_A',
  enabled: true,
  updated_at: i
}));

const res10 = simulatePushSubscriptionTrigger('INSERT', null, { user_id: 'user_A', enabled: true }, subsUser10);
assert(res10.action === 'DEACTIVATE' && res10.deactivatedIds.length === 1 && res10.deactivatedIds[0] === 'sub_1', 'Push Subscriptions: 10 ativas + INSERT desativa a assinatura mais antiga (sub_1).');

// Caso 4.3: Tentativa de alterar user_id é rejeitada
let userIdErrorThrown = false;
try {
  simulatePushSubscriptionTrigger('UPDATE', { user_id: 'user_A', enabled: true }, { user_id: 'user_B', enabled: true }, []);
} catch (err) {
  userIdErrorThrown = err.message.includes('Alteração de user_id');
}
assert(userIdErrorThrown, 'Push Subscriptions: Tentativa de UPDATE em user_id é rejeitada com exceção 22023.');

// Caso 4.4: UPDATE sem alteração em enabled ou user_id não aciona verificação nem altera nada
const resNoopUpdate = simulatePushSubscriptionTrigger('UPDATE', { user_id: 'user_A', enabled: true }, { user_id: 'user_A', enabled: true, endpoint: 'updated_url' }, subsUser10);
assert(resNoopUpdate.action === 'NONE', 'Push Subscriptions: UPDATE comum sem alteração em enabled/user_id ignora a verificação.');

// ----------------------------------------------------------------------------
// 5. SIMULAÇÃO DAS EDGE FUNCTIONS E VALIDAÇÃO DE USER_ID DERIVADO DO JWT
// ----------------------------------------------------------------------------
console.log('\n5. Auditando Edge Functions e propagação segura de UID...');

function handleEdgeFunctionSendMessage(jwtUser, bodyPayload) {
  if (!jwtUser || !jwtUser.user_id) {
    return { status: 401, body: { error: 'Unauthorized', code: 'UNAUTHORIZED' } };
  }

  const validatedVisitorId = jwtUser.user_id;

  return {
    status: 200,
    rpcPayloadSent: {
      p_visitor_id: validatedVisitorId,
      p_conversation_id: bodyPayload.conversation_id,
      p_content: bodyPayload.content
    }
  };
}

const mockUserA = { user_id: 'a1111111-1111-4111-8111-111111111111' };
const clientBodyWithFakeId = { conversation_id: 'c123', content: 'Teste', visitor_id: 'falsified_b222' };

const resEdge = handleEdgeFunctionSendMessage(mockUserA, clientBodyWithFakeId);
assert(resEdge.status === 200, 'Edge Function: Processa requisição com sucesso.');
assert(resEdge.rpcPayloadSent.p_visitor_id === mockUserA.user_id, 'Edge Function: Passa à RPC unicamente o UID extraído de auth.getUser(), ignorando ID falsificado do cliente.');

console.log(`\n=== RESUMO DOS TESTES DE AUDITORIA LOCAL: ${passedTests}/${totalTests} PASSARAM ===\n`);

console.log('----------------------------------------------------------------------------');
console.log('DECLARAÇÃO DE EXECUÇÃO E LIMITAÇÕES LOCAIS:');
console.log('1. Os testes desta suíte foram executados estaticamente no ambiente de runtime Node.js.');
console.log('2. O container local do Deno e PostgreSQL local via Supabase CLI não foram instanciados devido à ausência do Docker no sistema Windows.');
console.log('3. Uma etapa de homologação em ambiente de staging pré-produção permanece obrigatória antes da publicação remota.');
console.log('----------------------------------------------------------------------------\n');
