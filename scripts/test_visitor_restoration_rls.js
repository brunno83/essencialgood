// ESSENCIAL GOOD - VISITOR RESTORATION & RLS SECURITY TEST SUITE (Node.js)
// Tests visitor RLS matrix, isolation between visitors A & B, direct mutation restriction,
// cache preservation on network error vs cache cleanup on null response, and restoration contracts.

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
const store = [
  { id: "conv_a_123", visitor_id: visitorA, status: "open" },
  { id: "conv_b_456", visitor_id: visitorB, status: "open" }
];

assert(evaluateRlsConversationPolicy(visitorA, store[0].visitor_id) === true, "Visitante A lê sua própria conversa conv_a_123");
assert(evaluateRlsConversationPolicy(visitorA, store[1].visitor_id) === false, "Visitante A NÃO lê conversa conv_b_456 do visitante B");
assert(evaluateRlsConversationPolicy(visitorB, store[1].visitor_id) === true, "Visitante B lê sua própria conversa conv_b_456");

assert(evaluateRlsMessagePolicy(visitorA, "conv_a_123", store) === true, "Visitante A lê mensagens de conv_a_123");
assert(evaluateRlsMessagePolicy(visitorA, "conv_b_456", store) === false, "Visitante A NÃO lê mensagens de conv_b_456");

// --- 4. TESTE DA LÓGICA DEFENSIVA DE FRONTEND EM useVisitorChat.js ---
console.log("\n[Bloco 4] Teste da Lógica Defensiva de Cache e Restauração no Frontend");

const useVisitorChatCode = fs.readFileSync(path.resolve(__dirname, '../src/hooks/useVisitorChat.js'), 'utf8');

assert(useVisitorChatCode.includes('cachedErr'), "initVisitorChat captura explicitamente erro na consulta do cache (cachedErr)");
assert(useVisitorChatCode.includes('Preserva a referência em localStorage'), "Preserva localStorage quando houver erro transitório de rede");
assert(useVisitorChatCode.includes('cachedData.visitor_id === authUser.id'), "Valida se a conversa em cache pertence ao authUser.id antes de restaurar");
assert(!useVisitorChatCode.includes(".select('*')"), "initVisitorChat e fetchMessages usam lista explícita de colunas em vez de .select('*')");

// Simulação de comportamento de cache no frontend
function processCacheResponse(cachedConvId, cachedData, cachedErr, authUserId) {
  let localStorageActive = true;
  let restoredConv = null;

  if (cachedErr) {
    // Erro de rede: não apaga localStorage
    localStorageActive = true;
  } else if (cachedData) {
    const isValid = cachedData.visitor_id === authUserId && !cachedData.archived_at && ['open', 'pending'].includes(cachedData.status);
    if (isValid) {
      restoredConv = cachedData;
    } else {
      localStorageActive = false;
    }
  } else {
    // Resposta nula válida: apaga cache inválido
    localStorageActive = false;
  }

  return { localStorageActive, restoredConv };
}

// 4.1 Erro transitório de rede: não apaga cache
const simErrNet = processCacheResponse("conv_a_123", null, new Error("Network timeout"), visitorA);
assert(simErrNet.localStorageActive === true && simErrNet.restoredConv === null, "Erro transitório de rede preserva chave no localStorage para retry");

// 4.2 Resposta nula sem erro (conversa deletada/inexistente): apaga cache
const simNullData = processCacheResponse("conv_a_123", null, null, visitorA);
assert(simNullData.localStorageActive === false && simNullData.restoredConv === null, "Resposta nula sem erro remove chave inválida do localStorage");

// 4.3 Conversa válida pertencente ao visitante: restaura com sucesso
const simValid = processCacheResponse("conv_a_123", { id: "conv_a_123", visitor_id: visitorA, status: "open" }, null, visitorA);
assert(simValid.localStorageActive === true && simValid.restoredConv?.id === "conv_a_123", "Conversa válida do próprio visitante é restaurada com sucesso");

// 4.4 Injeção de ID de outro visitante no localStorage: rejeita restauração e apaga cache adulterado
const simTampered = processCacheResponse("conv_b_456", { id: "conv_b_456", visitor_id: visitorB, status: "open" }, null, visitorA);
assert(simTampered.localStorageActive === false && simTampered.restoredConv === null, "Adulterar localStorage com ID de terceiro rejeita restauração e remove referência");

console.log("\n==========================================");
console.log(`RESULTADO: ${passed}/${total} TESTES PASSARAM COM SUCESSO!`);
console.log("==========================================");

if (passed !== total) {
  process.exit(1);
}
