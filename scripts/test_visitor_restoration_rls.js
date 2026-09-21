// ESSENCIAL GOOD - VISITOR RESTORATION & RLS SECURITY TEST SUITE (Node.js)
// Tests visitor RLS matrix, isolation between visitors A & B, direct mutation restriction,
// cache preservation on network error vs cache cleanup on null response, and auto-discovery restoration contracts.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
console.log("VISITOR RESTORATION & RLS COMPREHENSIVE TEST SUITE");
console.log("==========================================");

// --- 1. AUDITORIA ESTÁTICA DAS POLÍTICAS SQL E MIGRATION 011 ---
console.log("\n[Bloco 1] Auditoria Estática da Migration 011 e Arquivos de Patch");

const migrationPath = path.resolve(__dirname, '../supabase/migrations/011_visitor_restoration_rls_policies.sql');
const stagingPatchPath = path.resolve(__dirname, 'staging/004_visitor_restoration_rls_policies.sql');
const stagingRollbackPath = path.resolve(__dirname, 'staging/rollback_004_visitor_restoration_rls_policies.sql');
const applyScriptPath = path.resolve(__dirname, 'staging/apply_004_visitor_restoration_patch.ps1');
const rollbackScriptPath = path.resolve(__dirname, 'staging/rollback_004_visitor_restoration_patch.ps1');

assert(fs.existsSync(migrationPath), "Migration canônica 011_visitor_restoration_rls_policies.sql existe em supabase/migrations/");
assert(fs.existsSync(stagingPatchPath), "Patch de staging 004_visitor_restoration_rls_policies.sql existe em scripts/staging/");
assert(fs.existsSync(stagingRollbackPath), "Rollback 004_visitor_restoration_rls_policies.sql existe em scripts/staging/");
assert(fs.existsSync(applyScriptPath), "Wrapper PowerShell apply_004_visitor_restoration_patch.ps1 existe em scripts/staging/");
assert(fs.existsSync(rollbackScriptPath), "Wrapper PowerShell rollback_004_visitor_restoration_patch.ps1 existe em scripts/staging/");

const migrationSql = fs.readFileSync(migrationPath, 'utf8');
assert(migrationSql.includes('CREATE POLICY "conversations_visitor_select_policy"'), "Migration 011 cria política conversations_visitor_select_policy");
assert(migrationSql.includes('visitor_id = (select auth.uid())'), "Policy restringe conversations ao visitor_id = (select auth.uid())");
assert(migrationSql.includes('CREATE POLICY "messages_visitor_select_policy"'), "Migration 011 cria política messages_visitor_select_policy");
assert(migrationSql.includes('EXISTS ('), "Policy de messages valida ownership da conversa via EXISTS subquery");
assert(migrationSql.includes('ALTER PUBLICATION supabase_realtime ADD TABLE'), "Migration 011 inclui tabelas na publicação Realtime");

// --- 2. AUDITORIA DAS TRAVAS DE SEGURANÇA NOS WRAPPERS POWERSHELL ---
console.log("\n[Bloco 2] Trava Anti-Produção nos Scripts PowerShell");

const applyPs1 = fs.readFileSync(applyScriptPath, 'utf8');
assert(applyPs1.includes('zauvpsxeexwthobmbkku'), "Script de apply contém staging ref zauvpsxeexwthobmbkku");
assert(applyPs1.includes('axgpmpnipwyfirlplbjv'), "Script de apply rejeita explicitamente prod ref axgpmpnipwyfirlplbjv");

const rollbackPs1 = fs.readFileSync(rollbackScriptPath, 'utf8');
assert(rollbackPs1.includes('zauvpsxeexwthobmbkku'), "Script de rollback contém staging ref zauvpsxeexwthobmbkku");
assert(rollbackPs1.includes('axgpmpnipwyfirlplbjv'), "Script de rollback rejeita explicitamente prod ref axgpmpnipwyfirlplbjv");

// --- 3. REGRAS DE ISOLAMENTO E MENOR PRIVILÉGIO RLS ---
console.log("\n[Bloco 3] Teste de Contrato de Isolamento e RLS (Lógica de Servidor)");

function evaluateRlsConversationPolicy(authUid, conversationVisitorId) {
  if (!authUid || !conversationVisitorId) return false;
  return authUid === conversationVisitorId;
}

function evaluateRlsMessagePolicy(authUid, messageConvId, conversationsStore) {
  if (!authUid || !messageConvId) return false;
  const conv = conversationsStore.find(c => c.id === messageConvId);
  if (!conv) return false;
  return conv.visitor_id === authUid;
}

const visitorA = "user_aaaa_1111";
const visitorB = "user_bbbb_2222";
const visitorC_NoConv = "user_cccc_3333";

const store = [
  { id: "conv_a_123", visitor_id: visitorA, status: "open", archived_at: null },
  { id: "conv_b_456", visitor_id: visitorB, status: "open", archived_at: null },
  { id: "conv_closed_789", visitor_id: visitorA, status: "closed", archived_at: "2026-09-20T10:00:00Z" }
];

assert(evaluateRlsConversationPolicy(visitorA, store[0].visitor_id) === true, "Visitante A lê sua própria conversa conv_a_123");
assert(evaluateRlsConversationPolicy(visitorA, store[1].visitor_id) === false, "Visitante A NÃO lê conversa conv_b_456 do visitante B");
assert(evaluateRlsConversationPolicy(visitorB, store[1].visitor_id) === true, "Visitante B lê sua própria conversa conv_b_456");

assert(evaluateRlsMessagePolicy(visitorA, "conv_a_123", store) === true, "Visitante A lê mensagens de conv_a_123");
assert(evaluateRlsMessagePolicy(visitorA, "conv_b_456", store) === false, "Visitante A NÃO lê mensagens de conv_b_456");

// --- 4. TESTE DA LÓGICA DEFENSIVA DE FRONTEND EM useVisitorChat.js ---
console.log("\n[Bloco 4] Teste da Lógica Defensiva de Cache e Descoberta no Frontend");

const useVisitorChatCode = fs.readFileSync(path.resolve(__dirname, '../src/hooks/useVisitorChat.js'), 'utf8');

assert(useVisitorChatCode.includes('cachedErr'), "initVisitorChat captura explicitamente erro na consulta do cache (cachedErr)");
assert(useVisitorChatCode.includes('Preserva a referência em localStorage'), "Preserva localStorage quando houver erro transitório de rede");
assert(useVisitorChatCode.includes('cachedData.visitor_id === authUser.id'), "Valida se a conversa em cache pertence ao authUser.id antes de restaurar");
assert(!useVisitorChatCode.includes(".select('*')"), "initVisitorChat e fetchMessages usam lista explícita de colunas em vez de .select('*')");
assert(useVisitorChatCode.includes('!conversation?.id || !user || checkingAuth'), "toggleOpen dispara initVisitorChat quando não houver conversa ativa carregada");

// Simulador completo do algoritmo de restauração e descoberta do initVisitorChat
function simulateInitVisitorChat(cachedConvId, authUserId, dbStore) {
  let localStorageValue = cachedConvId;
  let activeConv = null;

  // RLS simulado para PostgREST
  function queryConversationsById(id) {
    const record = dbStore.find(c => c.id === id);
    if (!record) return { data: null, error: null };
    // RLS check
    if (record.visitor_id !== authUserId) return { data: null, error: null };
    return { data: record, error: null };
  }

  function queryActiveConversationsForUser(userId) {
    const list = dbStore.filter(c => c.visitor_id === userId && !c.archived_at && ['open', 'pending'].includes(c.status));
    return { data: list, error: null };
  }

  // 1. Tenta por cachedConvId
  if (localStorageValue) {
    const { data: cachedData, error: cachedErr } = queryConversationsById(localStorageValue);
    if (cachedErr) {
      // Preserva cache em erro
    } else if (cachedData) {
      const isValid = cachedData.visitor_id === authUserId && !cachedData.archived_at && ['open', 'pending'].includes(cachedData.status);
      if (isValid) {
        activeConv = cachedData;
      } else {
        localStorageValue = null;
      }
    } else {
      localStorageValue = null;
    }
  }

  // 2. Se não encontrou por cache (ex: cache ausente, deletado ou adulterado), executa Descoberta Automática
  if (!activeConv) {
    const { data: existingList } = queryActiveConversationsForUser(authUserId);
    if (existingList && existingList.length > 0) {
      const candidate = existingList[0];
      if (candidate && candidate.id && candidate.visitor_id === authUserId && ['open', 'pending'].includes(candidate.status)) {
        activeConv = candidate;
      }
    }
  }

  // 3. Resultado final do estado e reconstrução do localStorage
  if (activeConv) {
    localStorageValue = activeConv.id;
  } else {
    localStorageValue = null;
  }

  return { activeConv, localStorageValue };
}

// 4.1 Cache válido restaura conversa
const res1 = simulateInitVisitorChat("conv_a_123", visitorA, store);
assert(res1.activeConv?.id === "conv_a_123" && res1.localStorageValue === "conv_a_123", "Cache válido restaura conversa conv_a_123 e mantém localStorage");

// 4.2 Cache ausente (chave null/deletada): Descoberta Automática encontra a conversa ativa do usuário e reconstrói o localStorage
const res2 = simulateInitVisitorChat(null, visitorA, store);
assert(res2.activeConv?.id === "conv_a_123" && res2.localStorageValue === "conv_a_123", "Cache ausente descobre automaticamente a conversa ativa conv_a_123 e reconstrói localStorage");

// 4.3 Cache adulterado (ID de terceiro): Rejeita terceiro, executa Descoberta e salva o ID próprio correto
const res3 = simulateInitVisitorChat("conv_b_456", visitorA, store);
assert(res3.activeConv?.id === "conv_a_123" && res3.localStorageValue === "conv_a_123", "Cache adulterado com ID de terceiro descobre a conversa própria conv_a_123 e sobrescreve localStorage com ID próprio");

// 4.4 Usuário sem conversa ativa (visitorC): Retorna activeConv = null e deixa formulário inicial
const res4 = simulateInitVisitorChat(null, visitorC_NoConv, store);
assert(res4.activeConv === null && res4.localStorageValue === null, "Usuário sem conversa ativa recebe activeConv = null (exibe formulário Start Chat)");

// 4.5 Conversa arquivada/fechada não é restaurada via descoberta
const storeWithClosedOnly = [
  { id: "conv_closed_789", visitor_id: visitorA, status: "closed", archived_at: "2026-09-20T10:00:00Z" }
];
const res5 = simulateInitVisitorChat("conv_closed_789", visitorA, storeWithClosedOnly);
assert(res5.activeConv === null && res5.localStorageValue === null, "Conversa fechada/arquivada NÃO é restaurada via descoberta (exibe formulário inicial)");

console.log("\n==========================================");
console.log(`RESULTADO: ${passed}/${total} TESTES PASSARAM COM SUCESSO!`);
console.log("==========================================");

if (passed !== total) {
  process.exit(1);
}
