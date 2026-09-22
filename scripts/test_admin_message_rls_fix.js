/**
 * ESSENCIAL GOOD - ADMIN MESSAGE SENDING RLS FIX REGRESSION SUITE
 * Testes unitários e estáticos para validar a inserção de mensagens administrativas (casos A-G).
 */

import fs from 'fs';
import path from 'path';

function runTests() {
  console.log('=== RUNNING ADMIN MESSAGE SENDING RLS FIX REGRESSION SUITE ===\n');
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
  const hookPath = path.join(rootDir, 'src', 'hooks', 'useConversationMessages.js');

  assert(fs.existsSync(hookPath), 'useConversationMessages.js file exists');
  const hookContent = fs.readFileSync(hookPath, 'utf8');

  // Test Case A & B: Explicit sender_id and sender_type fields
  assert(hookContent.includes('sender_id: authUser.id'), 'Case A/B: Payload includes explicit sender_id from authenticated session user.id');
  assert(hookContent.includes('sender_type: adminProfile.role'), 'Case A/B: Payload includes explicit sender_type from validated admin_profiles role');

  // Test Case C & D & E: Session and Profile verification
  assert(hookContent.includes('supabase.auth.getSession()'), 'Case C/D/E: Obtains user.id directly from signed Auth session');
  assert(hookContent.includes(".from('admin_profiles')"), 'Case C/D/E: Queries admin_profiles table to validate real role');
  assert(hookContent.includes("['admin', 'agent'].includes(adminProfile.role)"), 'Case C/D/E: Validates role against allowlist [admin, agent]');

  // Test Case F: conversation_id and content
  assert(hookContent.includes('conversation_id: conversationId'), 'Case F: conversation_id is passed correctly');
  assert(hookContent.includes('content: cleanContent'), 'Case F: content is passed correctly');

  // Test Case G: Realtime channel preserved
  assert(hookContent.includes('postgres_changes'), 'Case G: Realtime postgres_changes listener preserved');

  console.log(`\nAdmin Message RLS Fix Test Results: ${passed}/${total} passed.`);
}

runTests();
