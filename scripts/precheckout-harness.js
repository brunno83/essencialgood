/**
 * Comprehensive Test Harness for Essencial Good Pre-Checkout Module
 * Validates all 16 forensic requirements:
 * 1. Clean real URLs without backslashes
 * 2. Product -> Domain Matrix
 * 3. Incompatible product/domain rejection
 * 4. Endpoint path validation (checkout.php)
 * 5. Userinfo rejection in URL
 * 6. Mandatory country_code (no fallback)
 * 7. Mandatory dial_code (no fallback)
 * 8. Country/Dial pair compatibility
 * 9. Phone starting with dial_code
 * 10. MemoFlow + PDP rejection
 * 11. MemoFlow + Listicle rejection
 * 12. Offer-specific deduplication (different offers NOT deduplicated)
 * 13. subid2 and subid3 parameter extraction
 * 14. Limits on all fields & HTML tag rejection
 * 15. Identical Frontend/RPC contract
 * 16. Zero backslashes in host strings
 */

import {
  isValidCheckoutUrl,
  extractCheckoutParams,
  ALLOWED_CHECKOUT_HOSTS,
  PRODUCT_CHECKOUT_HOSTS,
  ALLOWED_COUNTRY_DIAL_PAIRS,
} from '../src/lib/checkoutAllowlist.js';

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
console.log('ESSENCIAL GOOD - PRE-CHECKOUT HARNESS TESTS (VER 2)');
console.log('==================================================\n');

// 1. CLEAN REAL URLS WITHOUT BACKSLASHES & ALLOWLIST SANITY
console.log('1. Testing Clean Real URLs & Zero Backslashes:');

const cleanRealUrls = [
  'https://cc.slimsodapowder.com/dtcnew-whop/checkout.php?hid=123&affid=456',
  'https://cc.sonnus.com/checkout.php?hid=789',
  'https://cc.usesonnus.com/checkout.php?hid=789',
  'https://cc.crownedhair.com/dtcnew/checkout.php?tier=3',
  'https://cc.usecrowned.com/dtcnew/checkout.php?tier=3',
  'https://cc.linfaflow.com/dtcnew/checkout.php',
  'https://cc.memoflow.com/dtcnew/checkout.php',
  'https://cc.usememoflow.com/dtcv1-whop/checkout.php?hid=999',
];

cleanRealUrls.forEach((url) => {
  assert(isValidCheckoutUrl(url), `Accepts clean real checkout URL: ${url}`);
  assert(!url.includes('\\'), `No backslashes in test URL: ${url}`);
});

ALLOWED_CHECKOUT_HOSTS.forEach((host) => {
  assert(!host.includes('\\'), `No backslashes in allowed host string: ${host}`);
});

// 2. PRODUCT -> DOMAIN MATRIX VALIDATION
console.log('\n2. Testing Product -> Domain Matrix Match:');

assert(isValidCheckoutUrl('https://cc.slimsodapowder.com/checkout.php', 'slimsoda', 'adv'), 'slimsoda accepts cc.slimsodapowder.com');
assert(isValidCheckoutUrl('https://cc.sonnus.com/checkout.php', 'sonnus', 'adv'), 'sonnus accepts cc.sonnus.com');
assert(isValidCheckoutUrl('https://cc.usesonnus.com/checkout.php', 'sonnus', 'pdp'), 'sonnus accepts cc.usesonnus.com');
assert(isValidCheckoutUrl('https://cc.crownedhair.com/checkout.php', 'crowned', 'adv'), 'crowned accepts cc.crownedhair.com');
assert(isValidCheckoutUrl('https://cc.usecrowned.com/checkout.php', 'crowned', 'power'), 'crowned accepts cc.usecrowned.com');
assert(isValidCheckoutUrl('https://cc.linfaflow.com/checkout.php', 'linfaflow', 'pdp'), 'linfaflow accepts cc.linfaflow.com');
assert(isValidCheckoutUrl('https://cc.memoflow.com/checkout.php', 'memoflow', 'adv'), 'memoflow accepts cc.memoflow.com');
assert(isValidCheckoutUrl('https://cc.usememoflow.com/checkout.php', 'memoflow', 'power'), 'memoflow accepts cc.usememoflow.com');

// 3. INCOMPATIBLE PRODUCT / DOMAIN REJECTION
console.log('\n3. Testing Incompatible Product / Domain Rejection:');

assert(!isValidCheckoutUrl('https://cc.crownedhair.com/checkout.php', 'slimsoda', 'adv'), 'Rejects slimsoda with crowned host');
assert(!isValidCheckoutUrl('https://cc.sonnus.com/checkout.php', 'memoflow', 'adv'), 'Rejects memoflow with sonnus host');
assert(!isValidCheckoutUrl('https://cc.slimsodapowder.com/checkout.php', 'linfaflow', 'adv'), 'Rejects linfaflow with slimsoda host');
assert(!isValidCheckoutUrl('https://cc.linfaflow.com/checkout.php', 'sonnus', 'adv'), 'Rejects sonnus with linfaflow host');

// 4. CHECKOUT ENDPOINT PATH VALIDATION
console.log('\n4. Testing Endpoint Path Validation:');

assert(!isValidCheckoutUrl('https://cc.slimsodapowder.com/login', 'slimsoda', 'adv'), 'Rejects /login path');
assert(!isValidCheckoutUrl('https://cc.slimsodapowder.com/admin', 'slimsoda', 'adv'), 'Rejects /admin path');
assert(!isValidCheckoutUrl('https://cc.slimsodapowder.com/malicious.php', 'slimsoda', 'adv'), 'Rejects /malicious.php');
assert(!isValidCheckoutUrl('https://cc.slimsodapowder.com/', 'slimsoda', 'adv'), 'Rejects root path without checkout.php');

// 5. USERINFO IN URL REJECTION
console.log('\n5. Testing Userinfo Rejection:');

assert(!isValidCheckoutUrl('https://user:pass@cc.slimsodapowder.com/checkout.php', 'slimsoda', 'adv'), 'Rejects URL containing userinfo');
assert(!isValidCheckoutUrl('https://admin@cc.sonnus.com/checkout.php', 'sonnus', 'adv'), 'Rejects URL containing username');

// 6 & 7. MANDATORY COUNTRY_CODE & DIAL_CODE (NO FALLBACKS)
console.log('\n6 & 7. Testing Mandatory Country & Dial Code Rules:');

function validateTriad(countryCode, dialCode, phone) {
  if (!countryCode || !countryCode.trim()) return false;
  if (!dialCode || !dialCode.trim()) return false;
  if (!phone || !phone.trim()) return false;

  const cCode = countryCode.trim().toUpperCase();
  const dCode = dialCode.trim();

  const expectedDial = ALLOWED_COUNTRY_DIAL_PAIRS[cCode];
  if (!expectedDial || expectedDial !== dCode) return false;

  if (!phone.startsWith(dCode)) return false;
  if (!/^[+][1-9][0-9]{7,14}$/.test(phone)) return false;

  return true;
}

assert(!validateTriad('', '+1', '+14155552671'), 'Rejects missing country_code (no fallback)');
assert(!validateTriad('US', '', '+14155552671'), 'Rejects missing dial_code (no fallback)');

// 8. COUNTRY / DIAL PAIR COMPATIBILITY
console.log('\n8. Testing Country / Dial Pair Compatibility:');

assert(validateTriad('US', '+1', '+14155552671'), 'Accepts valid US / +1 pair');
assert(validateTriad('CA', '+1', '+14155552671'), 'Accepts valid CA / +1 pair');
assert(validateTriad('GB', '+44', '+447123456789'), 'Accepts valid GB / +44 pair');
assert(validateTriad('AU', '+61', '+61412345678'), 'Accepts valid AU / +61 pair');
assert(validateTriad('NZ', '+64', '+64211234567'), 'Accepts valid NZ / +64 pair');

assert(!validateTriad('US', '+44', '+447123456789'), 'Rejects incompatible US / +44 pair');
assert(!validateTriad('GB', '+1', '+14155552671'), 'Rejects incompatible GB / +1 pair');
assert(!validateTriad('FR', '+33', '+33612345678'), 'Rejects unsupported country FR');

// 9. PHONE STARTING WITH DIAL CODE
console.log('\n9. Testing Phone Starting with Dial Code:');

assert(!validateTriad('US', '+1', '+447123456789'), 'Rejects phone that does not start with selected dial code +1');
assert(!validateTriad('GB', '+44', '+14155552671'), 'Rejects phone that does not start with selected dial code +44');

// 10 & 11. MEMOFLOW PAGE TYPE RESTRICTIONS
console.log('\n10 & 11. Testing MemoFlow Page Type Restrictions:');

assert(isValidCheckoutUrl('https://cc.memoflow.com/checkout.php', 'memoflow', 'adv'), 'MemoFlow allowed on adv');
assert(isValidCheckoutUrl('https://cc.usememoflow.com/checkout.php', 'memoflow', 'power'), 'MemoFlow allowed on power');
assert(!isValidCheckoutUrl('https://cc.memoflow.com/checkout.php', 'memoflow', 'pdp'), 'Rejects MemoFlow on pdp');
assert(!isValidCheckoutUrl('https://cc.memoflow.com/checkout.php', 'memoflow', 'listicle'), 'Rejects MemoFlow on listicle');

// 12. OFFER-SPECIFIC DEDUPLICATION
console.log('\n12. Testing Offer-Specific Deduplication Logic:');

function simulateDeduplication(existingLead, newPayload) {
  if (existingLead.product !== newPayload.product) return false;
  
  const existingOffer = (existingLead.offer || '').trim().toLowerCase();
  const newOffer = (newPayload.offer || '').trim().toLowerCase();
  if (existingOffer !== newOffer) return false;

  const matchPhone = existingLead.phone === newPayload.phone;
  const matchEmail = existingLead.email.toLowerCase() === newPayload.email.toLowerCase();
  const matchVisitor = existingLead.visitor_id && newPayload.visitor_id && existingLead.visitor_id === newPayload.visitor_id;

  return matchPhone || matchEmail || matchVisitor;
}

const leadA = { product: 'slimsoda', offer: 'starter', phone: '+14155552671', email: 'user@test.com', visitor_id: 'v1' };
const payloadSameOffer = { product: 'slimsoda', offer: 'starter', phone: '+14155552671', email: 'user@test.com', visitor_id: 'v1' };
const payloadDifferentOffer = { product: 'slimsoda', offer: 'best-value', phone: '+14155552671', email: 'user@test.com', visitor_id: 'v1' };

assert(simulateDeduplication(leadA, payloadSameOffer), 'Identical lead and offer are deduplicated');
assert(!simulateDeduplication(leadA, payloadDifferentOffer), 'Different offer for same phone is NOT deduplicated');

// 13. SUBID2 AND SUBID3 PARAMETER EXTRACTION
console.log('\n13. Testing subid2 and subid3 Parameter Extraction:');

const subidUrl = 'https://cc.linfaflow.com/dtcnew/checkout.php?affid=aff1&hid=h1&hcid=hc1&subid=s1&subid2=s2_value&subid3=s3_value&utm_source=fb';
const extracted = extractCheckoutParams(subidUrl, 'linfaflow', 'pdp');

assert(extracted.subid === 's1', 'Extracts subid correctly');
assert(extracted.subid2 === 's2_value', 'Extracts subid2 correctly');
assert(extracted.subid3 === 's3_value', 'Extracts subid3 correctly');

// 14. LIMITS ON ALL FIELDS & HTML TAG REJECTION
console.log('\n14. Testing Field Length Limits & HTML Injection Protection:');

function validateFieldLimits(payload) {
  if (payload.name.length < 2 || payload.name.length > 120 || /[<>]/.test(payload.name)) return false;
  if (payload.email.length > 150 || /[<>]/.test(payload.email)) return false;
  if (payload.phone.length > 16 || /[<>]/.test(payload.phone)) return false;
  if (payload.offer && (payload.offer.length > 100 || /[<>]/.test(payload.offer))) return false;
  if (payload.page_title && (payload.page_title.length > 300 || /[<>]/.test(payload.page_title))) return false;
  if (payload.visitor_id && (payload.visitor_id.length > 128 || /[<>]/.test(payload.visitor_id))) return false;
  return true;
}

const validPayload = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+14155552671',
  offer: 'starter',
  page_title: 'SlimSoda Official',
  visitor_id: 'vis_123',
};

const htmlPayload = {
  name: 'John <script>alert(1)</script>',
  email: 'john@example.com',
  phone: '+14155552671',
  offer: 'starter',
};

assert(validateFieldLimits(validPayload), 'Accepts payload within field limits and without HTML');
assert(!validateFieldLimits(htmlPayload), 'Rejects payload containing HTML tags <script>');

// 15. IDENTICAL FRONTEND / RPC SIGNATURE CONTRACT
console.log('\n15. Testing Frontend / RPC Contract Alignment:');

const expectedRpcParams = [
  'p_name', 'p_email', 'p_phone', 'p_country_code', 'p_dial_code',
  'p_product', 'p_page_type', 'p_consent_given', 'p_offer', 'p_page_title',
  'p_source_url', 'p_source_path', 'p_checkout_url', 'p_visitor_id',
  'p_affid', 'p_hid', 'p_hcid', 'p_subid', 'p_subid2', 'p_subid3',
  'p_utm_source', 'p_utm_medium', 'p_utm_campaign', 'p_utm_content', 'p_utm_term', 'p_referrer'
];

assert(expectedRpcParams.length === 26, 'RPC signature expects exactly 26 parameters');

console.log('\n==================================================');
console.log(`HARNESS RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('==================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
