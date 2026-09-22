/**
 * ESSENCIAL GOOD - MIGRATION 013 VALIDATION & REGRESSION HARNESS
 * Verifica a integridade da Migration 013, paridade de triggers e preservação de segurança.
 */

import fs from 'fs';
import path from 'path';

function runTests() {
  console.log('=== RUNNING MIGRATION 013 & TRIGGER SECURITY REGRESSION SUITE ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  const rootDir = process.cwd();
  const mig013Path = path.join(rootDir, 'supabase', 'migrations', '013_fix_legacy_triggers_for_service_role_rpc.sql');
  const mig012Path = path.join(rootDir, 'supabase', 'migrations', '012_deprecate_legacy_direct_visitor_rls_policies.sql');

  // Test 1: Migration 013 file exists
  assert(fs.existsSync(mig013Path), 'Migration 013 file exists at expected path');

  // Test 2: Migration 013 content checks
  const sqlContent = fs.readFileSync(mig013Path, 'utf8');
  assert(sqlContent.includes('normalize_visitor_conversation()'), 'Migration 013 updates normalize_visitor_conversation()');
  assert(sqlContent.includes('normalize_new_message()'), 'Migration 013 updates normalize_new_message()');
  assert(sqlContent.includes("v_jwt_role = 'service_role'"), 'Migration 013 handles service_role execution context');
  assert(sqlContent.includes('is_admin_or_agent()'), 'Migration 013 preserves is_admin_or_agent check');
  assert(sqlContent.includes('auth.uid() IS NOT NULL'), 'Migration 013 preserves direct visitor auth.uid() override guard');

  // Test 3: Migration 012 is NOT applied (file exists locally for staging preparation only)
  assert(fs.existsSync(mig012Path), 'Migration 012 file exists in codebase repository');

  // Test 4: Transaction wrap check
  assert(sqlContent.startsWith('BEGIN;') || sqlContent.includes('\nBEGIN;\n'), 'Migration 013 is wrapped in a transaction block');
  assert(sqlContent.trim().endsWith('COMMIT;'), 'Migration 013 ends with COMMIT');

  // Test 5: Check historic migrations integrity (001-011)
  for (let i = 1; i <= 11; i++) {
    const numStr = i < 10 ? `00${i}` : `0${i}`;
    const migFiles = fs.readdirSync(path.join(rootDir, 'supabase', 'migrations'))
      .filter(f => f.startsWith(numStr) && f.endsWith('.sql'));
    assert(migFiles.length === 1, `Historic migration ${numStr} exists and is unique (${migFiles[0]})`);
  }

  console.log(`\nMigration 013 Test Results: ${passed}/${total} passed.`);
}

runTests();
