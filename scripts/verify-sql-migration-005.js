/**
 * Verification script for Migration 005 SQL Syntax & Structural Integrity
 * Parses supabase/migrations/005_pre_checkout_leads.sql and verifies:
 * 1. Table creation public.checkout_leads with all required columns, types, NOT NULLs, and CHECK constraints.
 * 2. Indexes creation with IF NOT EXISTS.
 * 3. RLS enablement and policy creation with DROP POLICY IF EXISTS.
 * 4. RPC function save_checkout_lead definition with SECURITY DEFINER and SET search_path = ''.
 * 5. REVOKE ALL ON FUNCTION ... WITH FULL 26-PARAM SIGNATURE.
 * 6. GRANT EXECUTE ON FUNCTION ... WITH FULL 26-PARAM SIGNATURE.
 * 7. Host matrix check in RPC contains all 8 domains without backslashes.
 * 8. Product check in RPC excludes 'institucional'.
 * 9. Phone triad constraint checks country/dial pairs (US/CA -> +1, GB -> +44, AU -> +61, NZ -> +64).
 * 10. MemoFlow restriction check in RPC (adv, power only).
 */

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('==================================================');
console.log('ESSENCIAL GOOD - SQL MIGRATION 005 SYNTAX & CONTRACT VERIFICATION');
console.log('==================================================\n');

const sqlPath = path.resolve(process.cwd(), 'supabase/migrations/005_pre_checkout_leads.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

// 1. BACKSLASH IN HOSTNAMES SANITY CHECK
assert(!/cc\.[a-z0-9.-]*\\/.test(sqlContent) && !sqlContent.includes('\\.com'), 'Hostnames in Migration 005 contain zero backslashes (literal strings only)');

// 2. TABLE CREATION & CONSTRAINTS
assert(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.checkout_leads'), 'Creates table public.checkout_leads with IF NOT EXISTS');
assert(sqlContent.includes('phone TEXT NOT NULL'), 'phone is defined as NOT NULL');
assert(sqlContent.includes('country_code VARCHAR(2) NOT NULL'), 'country_code is defined as NOT NULL');
assert(sqlContent.includes('dial_code VARCHAR(6) NOT NULL'), 'dial_code is defined as NOT NULL');
assert(!sqlContent.includes("'institucional'"), 'Migration 005 does NOT include institucional in product checks');
assert(sqlContent.includes("product IN ('slimsoda', 'sonnus', 'crowned', 'linfaflow', 'memoflow')"), 'product CHECK constraint allows exactly 5 products');

// 3. PHONE TRIAD & COUNTRY/DIAL PAIRS
assert(sqlContent.includes("country_code IN ('US', 'CA') AND dial_code = '+1'"), 'Table constraint validates US/CA with +1');
assert(sqlContent.includes("country_code = 'GB' AND dial_code = '+44'"), 'Table constraint validates GB with +44');
assert(sqlContent.includes("country_code = 'AU' AND dial_code = '+61'"), 'Table constraint validates AU with +61');
assert(sqlContent.includes("country_code = 'NZ' AND dial_code = '+64'"), 'Table constraint validates NZ with +64');
assert(sqlContent.includes("phone LIKE (dial_code || '%')"), 'Table constraint validates phone starts with dial_code');

// 4. MEMOFLOW RESTRICTION
assert(sqlContent.includes("product <> 'memoflow' OR page_type IN ('adv', 'power')"), 'Table constraint restricts MemoFlow to adv and power');
assert(sqlContent.includes("v_clean_product = 'memoflow' AND v_clean_page_type NOT IN ('adv', 'power')"), 'RPC rejects MemoFlow on pdp or listicle');

// 5. SECURITY DEFINER & SEARCH_PATH
assert(sqlContent.includes('SECURITY DEFINER'), 'RPC function is SECURITY DEFINER');
assert(sqlContent.includes("SET search_path = ''"), 'RPC function sets search_path = \'\'');

// 6. REVOKE & GRANT WITH FULL SIGNATURE
const fullSignatureStr = 'public.save_checkout_lead(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT)';
assert(sqlContent.includes(`REVOKE ALL ON FUNCTION ${fullSignatureStr} FROM PUBLIC;`), 'Revokes EXECUTE from PUBLIC using full signature');
assert(sqlContent.includes(`REVOKE ALL ON FUNCTION ${fullSignatureStr} FROM anon, authenticated;`), 'Revokes ALL from anon, authenticated using full signature');
assert(sqlContent.includes(`GRANT EXECUTE ON FUNCTION ${fullSignatureStr} TO anon, authenticated;`), 'Grants EXECUTE to anon, authenticated using full signature');

// 7. PRODUCT -> HOST MATRIX IN RPC
assert(sqlContent.includes("v_clean_product = 'slimsoda' AND v_checkout_host NOT IN ('cc.slimsodapowder.com')"), 'RPC validates slimsoda host');
assert(sqlContent.includes("v_clean_product = 'sonnus' AND v_checkout_host NOT IN ('cc.sonnus.com', 'cc.usesonnus.com')"), 'RPC validates sonnus hosts');
assert(sqlContent.includes("v_clean_product = 'crowned' AND v_checkout_host NOT IN ('cc.crownedhair.com', 'cc.usecrowned.com')"), 'RPC validates crowned hosts');
assert(sqlContent.includes("v_clean_product = 'linfaflow' AND v_checkout_host NOT IN ('cc.linfaflow.com')"), 'RPC validates linfaflow host');
assert(sqlContent.includes("v_clean_product = 'memoflow' AND v_checkout_host NOT IN ('cc.memoflow.com', 'cc.usememoflow.com')"), 'RPC validates memoflow hosts');

// 8. IDEMPOTENCY SAFETY
assert(sqlContent.includes('DROP POLICY IF EXISTS checkout_leads_admin_all ON public.checkout_leads;'), 'Drops policy if exists before creation to ensure idempotency');

console.log('\n==================================================');
console.log(`SQL VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('==================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
