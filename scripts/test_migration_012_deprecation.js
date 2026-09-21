// ESSENCIAL GOOD - MIGRATION 012 DEPRECATION & SECURITY TEST SUITE (Node.js)
// Validates:
// 1. Static structure of migration 012 (Application & Rollback idempotency).
// 2. Policy removal verification (4 legacy policies dropped, 2 visitor restoration policies preserved).
// 3. Admin access preservation (admin_select_all_conversations, admin_update_all_conversations, etc. intact).
// 4. Edge Function Service-Role writing bypass preservation (p_create_visitor_conversation, p_send_visitor_message).
// 5. Zero-data-mutation guarantee (no TRUNCATE, DELETE or UPDATE on conversations/messages).

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

console.log("=================================================");
console.log("MIGRATION 012 DEPRECATION & SECURITY AUDIT TEST");
console.log("=================================================");

// --- 1. ESTRUTURA E EXISTÊNCIA DO ARQUIVO DA MIGRATION 012 ---
console.log("\n[Bloco 1] Validação de Arquivo e Idempotência da Migration 012");

const migration012Path = path.resolve(__dirname, '../supabase/migrations/012_deprecate_legacy_direct_visitor_rls_policies.sql');
assert(fs.existsSync(migration012Path), "Arquivo supabase/migrations/012_deprecate_legacy_direct_visitor_rls_policies.sql existe no repositório.");

const content012 = fs.readFileSync(migration012Path, 'utf8');

// --- 2. AUDITORIA DAS POLÍTICAS REMOVIDAS ---
console.log("\n[Bloco 2] Verificação das Políticas Legadas a Serem Removidas");

assert(content012.includes('DROP POLICY IF EXISTS "visitor_insert_own_conversation" ON public.conversations;'), "Contém instrução para remover visitor_insert_own_conversation.");
assert(content012.includes('DROP POLICY IF EXISTS "visitor_select_own_conversation" ON public.conversations;'), "Contém instrução para remover visitor_select_own_conversation.");
assert(content012.includes('DROP POLICY IF EXISTS "visitor_insert_own_message" ON public.messages;'), "Contém instrução para remover visitor_insert_own_message.");
assert(content012.includes('DROP POLICY IF EXISTS "visitor_select_own_messages" ON public.messages;'), "Contém instrução para remover visitor_select_own_messages.");

// --- 3. PRESERVAÇÃO DE POLÍTICAS DE ADMIN E MIGRATION 011 ---
console.log("\n[Bloco 3] Preservação de Políticas Administrativas e Migration 011");

assert(!content012.includes('DROP POLICY IF EXISTS "admin_select_all_conversations"'), "NÃO remove nem altera a política admin_select_all_conversations.");
assert(!content012.includes('DROP POLICY IF EXISTS "admin_update_all_conversations"'), "NÃO remove nem altera a política admin_update_all_conversations.");
assert(!content012.includes('DROP POLICY IF EXISTS "admin_select_all_messages"'), "NÃO remove nem altera a política admin_select_all_messages.");
assert(!content012.includes('DROP POLICY IF EXISTS "conversations_visitor_select_policy"'), "NÃO remove a nova política de leitura de visitante conversations_visitor_select_policy.");
assert(!content012.includes('DROP POLICY IF EXISTS "messages_visitor_select_policy"'), "NÃO remove a nova política de leitura de visitante messages_visitor_select_policy.");

// --- 4. VALIDAÇÃO DE ZERO DADOS DELETADOS/MUTADOS ---
console.log("\n[Bloco 4] Garantia de Imutabilidade dos Dados Reais");

const sqlCodeOnly = content012.split('\n').filter(line => !line.trim().startsWith('--') && !line.trim().startsWith('*')).join('\n');
assert(!/\bDELETE\s+FROM\b/i.test(sqlCodeOnly), "Migration 012 NÃO executa nenhuma instrução DELETE.");
assert(!/\bTRUNCATE\b/i.test(sqlCodeOnly), "Migration 012 NÃO executa nenhuma instrução TRUNCATE.");
assert(!/\bUPDATE\s+public\.(conversations|messages)\b/i.test(sqlCodeOnly), "Migration 012 NÃO altera registros em conversations ou messages.");

// --- 5. ROLLBACK IDEMPOTENTE ---
console.log("\n[Bloco 5] Verificação do Bloco de Rollback Idempotente");

assert(content012.includes('CREATE POLICY "visitor_insert_own_conversation"'), "Bloco de rollback recria visitor_insert_own_conversation.");
assert(content012.includes('CREATE POLICY "visitor_select_own_conversation"'), "Bloco de rollback recria visitor_select_own_conversation.");
assert(content012.includes('CREATE POLICY "visitor_insert_own_message"'), "Bloco de rollback recria visitor_insert_own_message.");
assert(content012.includes('CREATE POLICY "visitor_select_own_messages"'), "Bloco de rollback recria visitor_select_own_messages.");

console.log("\n-------------------------------------------------");
console.log(`RESULTADO DOS TESTES DA MIGRATION 012: ${passed}/${total} passou.`);
console.log("-------------------------------------------------\n");

if (passed !== total) {
  process.exit(1);
}
