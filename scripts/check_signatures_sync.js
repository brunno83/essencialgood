/**
 * ESSENCIAL GOOD - VERIFICADOR AUTOMÁTICO DE DIVERGÊNCIA DE ASSINATURAS DE RPCS
 * Valida o alinhamento das assinaturas canônicas de RPC entre Migration 009, Teste Transacional, Frontend e Docs.
 */

import fs from 'fs';
import path from 'path';

console.log('=== VERIFICANDO SINCRONISMO DE ASSINATURAS DE RPCS ===\n');

let totalChecks = 0;
let passedChecks = 0;

function check(condition, message) {
  totalChecks++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedChecks++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

const rootDir = process.cwd();

const migrationPath = path.join(rootDir, 'supabase', 'migrations', '009_web_push_notifications.sql');
const testSqlPath = path.join(rootDir, 'scripts', 'test_migration_009_transactional.sql');
const hookPath = path.join(rootDir, 'src', 'hooks', 'useAdminPushNotifications.js');
const adminContainerPath = path.join(rootDir, 'src', 'components', 'admin', 'AdminContainer.jsx');
const docsPath = path.join(rootDir, 'docs', 'web-push-setup.md');

const migrationContent = fs.readFileSync(migrationPath, 'utf8');
const testSqlContent = fs.readFileSync(testSqlPath, 'utf8');
const hookContent = fs.readFileSync(hookPath, 'utf8');
const adminContainerContent = fs.readFileSync(adminContainerPath, 'utf8');
const docsContent = fs.readFileSync(docsPath, 'utf8');

// 1. Assinatura Canônica de register_push_subscription
check(migrationContent.includes('p_auth_key TEXT'), 'Migration 009 usa p_auth_key TEXT em register_push_subscription.');
check(testSqlContent.includes('p_auth_key TEXT'), 'Teste Transacional inclui DDL autocontida com p_auth_key TEXT.');
check(hookContent.includes('p_auth_key:'), 'Hook Frontend passa exatamente p_auth_key para supabase.rpc.');
check(testSqlContent.includes('p_auth_key :='), 'Teste SQL passa exatamente p_auth_key.');

// 2. Assinatura de unregister_push_subscription
check(migrationContent.includes('unregister_push_subscription(\n    p_subscription_id UUID DEFAULT NULL,\n    p_endpoint TEXT DEFAULT NULL\n)'), 'Migration 009 possui assinatura canônica de unregister_push_subscription.');
check(testSqlContent.includes('p_subscription_id UUID DEFAULT NULL'), 'Teste Transacional possui assinatura canônica de unregister_push_subscription.');
check(hookContent.includes('p_subscription_id:'), 'Hook Frontend utiliza p_subscription_id em unregister_push_subscription.');
check(adminContainerContent.includes('unregister_push_subscription'), 'AdminContainer.jsx utiliza unregister_push_subscription.');

// 3. Assinatura de update_push_preferences
check(migrationContent.includes('update_push_preferences(\n    p_subscription_id UUID,\n    p_notify_chats BOOLEAN,\n    p_notify_leads BOOLEAN\n)'), 'Migration 009 possui assinatura canônica de update_push_preferences.');
check(hookContent.includes('p_notify_chats:'), 'Hook Frontend utiliza p_notify_chats em update_push_preferences.');

// 4. Assinatura de get_my_push_notification_status
check(migrationContent.includes('get_my_push_notification_status(\n    p_endpoint TEXT DEFAULT NULL\n)'), 'Migration 009 possui assinatura canônica de get_my_push_notification_status.');
check(hookContent.includes('get_my_push_notification_status'), 'Hook Frontend utiliza get_my_push_notification_status.');

// 5. Estrutura Transacional do Teste SQL (BEGIN, ROLLBACK, SELECT DRY RUN)
const strippedSqlComments = testSqlContent.replace(/--.*$/gm, '').trim();
check(strippedSqlComments.startsWith('BEGIN;'), 'Teste Transacional SQL inicia com o comando BEGIN;');
check(testSqlContent.includes('ROLLBACK;'), 'Teste Transacional SQL possui encerramento com ROLLBACK;');
check(testSqlContent.includes("SELECT 'DRY RUN PASSED — ALL CHANGES ROLLED BACK' AS result;"), 'Teste Transacional exibe mensagem oficial DRY RUN PASSED na aba Results.');
check(testSqlContent.indexOf('ROLLBACK;') < testSqlContent.indexOf("SELECT 'DRY RUN PASSED — ALL CHANGES ROLLED BACK' AS result;"), 'ROLLBACK é executado ANTES do SELECT final.');

console.log(`\n=== RESUMO DAS CHECAGENS: ${passedChecks}/${totalChecks} PASSARAM ===\n`);
