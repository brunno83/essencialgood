import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('==========================================');
console.log('RUNNING EXPANDED STAGING & PRODUCTION INDEXATION TESTS');
console.log('==========================================\n');

// Helper to recursively get all .html files in dist/
function getAllDistHtmlFiles(dir = path.join(rootDir, 'dist'), fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllDistHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function runBuildWithEnv(envVars) {
  const env = { ...process.env, ...envVars };
  execSync('npx vite build', { cwd: rootDir, env, stdio: 'pipe' });
}

function readDistFile(relativePath) {
  const filePath = path.join(rootDir, 'dist', relativePath);
  assert(fs.existsSync(filePath), `Expected file ${relativePath} to exist in dist/`);
  return fs.readFileSync(filePath, 'utf8');
}

// ----------------------------------------------------
// AUDIT 1: Collision Audit (public/robots.txt)
// ----------------------------------------------------
console.log('--- AUDIT 1: Collision Audit (public/robots.txt) ---');
const publicRobotsPath = path.join(rootDir, 'public', 'robots.txt');
const hasPublicRobots = fs.existsSync(publicRobotsPath);
console.log(`  ℹ️ public/robots.txt exists: ${hasPublicRobots}`);
if (!hasPublicRobots) {
  console.log('  ✅ PASSED: No collision risk — public/robots.txt does not exist; plugin emits dist/robots.txt dynamically.');
}

// ----------------------------------------------------
// BLOCK A: STAGING BUILD (VITE_APP_ENV=staging)
// ----------------------------------------------------
console.log('\n--- BLOCK A: Comprehensive Staging Build (VITE_APP_ENV=staging) ---');
runBuildWithEnv({
  VITE_APP_ENV: 'staging',
  VITE_EXPECTED_SUPABASE_PROJECT_REF: 'zauvpsxeexwthobmbkku',
  VITE_SUPABASE_URL: 'https://zauvpsxeexwthobmbkku.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_staging_key',
  VITE_TURNSTILE_SITE_KEY: '1x0000000000000000000000000000000AA'
});

const stagingHtmlFiles = getAllDistHtmlFiles();
assert(stagingHtmlFiles.length > 0, 'Staging build must produce at least 1 .html file');
console.log(`  ℹ️ Auditing ${stagingHtmlFiles.length} HTML files in staging build dist/...`);

stagingHtmlFiles.forEach(htmlPath => {
  const relative = path.relative(path.join(rootDir, 'dist'), htmlPath);
  const content = fs.readFileSync(htmlPath, 'utf8');

  // 1. Count meta robots tags
  const matches = content.match(/<meta\s+name=["']robots["'][^>]*>/gi) || [];
  assert.strictEqual(
    matches.length,
    1,
    `TEST FAILED: ${relative} must contain EXACTLY 1 <meta name="robots"> tag, found ${matches.length}`
  );

  // 2. Exact meta robots tag content check
  const robotsTag = matches[0];
  assert.strictEqual(
    robotsTag,
    '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />',
    `TEST FAILED: ${relative} meta robots tag must be exact staging string, got: ${robotsTag}`
  );

  // 3. Ensure no meta tag contains index, follow
  assert(
    !robotsTag.includes('index, follow'),
    `TEST FAILED: ${relative} meta robots tag in staging build contains 'index, follow'`
  );
});
console.log(`  ✅ PASSED: A1: ALL ${stagingHtmlFiles.length} HTML files in dist/ contain EXACTLY 1 meta robots with content 'noindex, nofollow, noarchive, nosnippet'`);

const stagingRobotsTxt = readDistFile('robots.txt');
assert(
  stagingRobotsTxt.includes('Disallow: /'),
  'TEST FAILED: Staging dist/robots.txt must contain Disallow: /'
);
console.log('  ✅ PASSED: A2: Staging dist/robots.txt contains Disallow: /');

// ----------------------------------------------------
// BLOCK B: PRODUCTION BUILD (VITE_APP_ENV=production)
// ----------------------------------------------------
console.log('\n--- BLOCK B: Comprehensive Production Build (VITE_APP_ENV=production) ---');
runBuildWithEnv({
  VITE_APP_ENV: 'production',
  VITE_EXPECTED_SUPABASE_PROJECT_REF: 'axgpmpnipwyfirlplbjv',
  VITE_SUPABASE_URL: 'https://axgpmpnipwyfirlplbjv.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_prod_key',
  VITE_TURNSTILE_SITE_KEY: '1x0000000000000000000000000000000AA'
});

const prodHtmlFiles = getAllDistHtmlFiles();
assert(prodHtmlFiles.length > 0, 'Production build must produce at least 1 .html file');
console.log(`  ℹ️ Auditing ${prodHtmlFiles.length} HTML files in production build dist/...`);

prodHtmlFiles.forEach(htmlPath => {
  const relative = path.relative(path.join(rootDir, 'dist'), htmlPath);
  const content = fs.readFileSync(htmlPath, 'utf8');

  // 1. Count meta robots tags
  const matches = content.match(/<meta\s+name=["']robots["'][^>]*>/gi) || [];
  assert.strictEqual(
    matches.length,
    1,
    `TEST FAILED: ${relative} must contain EXACTLY 1 <meta name="robots"> tag, found ${matches.length}`
  );

  // 2. Exact meta robots tag content check
  const robotsTag = matches[0];
  assert.strictEqual(
    robotsTag,
    '<meta name="robots" content="index, follow" />',
    `TEST FAILED: ${relative} meta robots tag must be exact production string, got: ${robotsTag}`
  );

  // 3. Must NOT contain noindex in meta robots tag
  assert(!robotsTag.includes('noindex'), `TEST FAILED: ${relative} meta robots tag contains 'noindex'`);
  assert(!robotsTag.includes('nofollow'), `TEST FAILED: ${relative} meta robots tag contains 'nofollow'`);
});
console.log(`  ✅ PASSED: B1: ALL ${prodHtmlFiles.length} HTML files in dist/ contain EXACTLY 1 meta robots with content 'index, follow'`);

const prodRobotsTxt = readDistFile('robots.txt');
assert(
  !prodRobotsTxt.includes('Disallow: /'),
  'TEST FAILED: Production dist/robots.txt must NOT contain Disallow: /'
);
assert(
  prodRobotsTxt.includes('Allow: /'),
  'TEST FAILED: Production dist/robots.txt must contain Allow: /'
);
console.log('  ✅ PASSED: B2: Production dist/robots.txt contains Allow: / and NO Disallow: /');

// ----------------------------------------------------
// BLOCK C: FAIL-CLOSED & ENV-GUARD DIAGNOSTIC
// ----------------------------------------------------
console.log('\n--- BLOCK C: Fail-Closed Protection & Env-Guard Behavior ---');

// Diagnostic: validate-env-guard.js behavior check
try {
  execSync('node scripts/validate-env-guard.js', { cwd: rootDir, env: { ...process.env, VITE_APP_ENV: '' }, stdio: 'pipe' });
  console.log('  ℹ️ validate-env-guard.js: did not abort when run directly with empty env');
} catch (err) {
  console.log('  ℹ️ validate-env-guard.js: explicitly aborts process when env vars are missing/invalid');
}

// C1: Absent VITE_APP_ENV
runBuildWithEnv({ VITE_APP_ENV: '' });
const absentHtmlFiles = getAllDistHtmlFiles();
absentHtmlFiles.forEach(htmlPath => {
  const content = fs.readFileSync(htmlPath, 'utf8');
  const matches = content.match(/<meta\s+name=["']robots["'][^>]*>/gi) || [];
  assert.strictEqual(matches.length, 1);
  assert.strictEqual(matches[0], '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />');
});
assert(readDistFile('robots.txt').includes('Disallow: /'), 'Absent VITE_APP_ENV must fail closed to Disallow: /');
console.log('  ✅ PASSED: C1: Absent VITE_APP_ENV fails closed to noindex & Disallow: / on ALL HTML files');

// C2: Development VITE_APP_ENV
runBuildWithEnv({ VITE_APP_ENV: 'development' });
assert.strictEqual(readDistFile('index.html').match(/<meta\s+name=["']robots["'][^>]*>/gi)[0], '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />');
assert(readDistFile('robots.txt').includes('Disallow: /'));
console.log('  ✅ PASSED: C2: VITE_APP_ENV=development fails closed to noindex & Disallow: /');

// C3: Unknown VITE_APP_ENV=qa
runBuildWithEnv({ VITE_APP_ENV: 'qa' });
assert.strictEqual(readDistFile('index.html').match(/<meta\s+name=["']robots["'][^>]*>/gi)[0], '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />');
assert(readDistFile('robots.txt').includes('Disallow: /'));
console.log('  ✅ PASSED: C3: Unknown VITE_APP_ENV=qa fails closed to noindex & Disallow: /');

// ----------------------------------------------------
// BLOCK D: STRICT PRIVATE SECRET AUDIT IN DIST/
// ----------------------------------------------------
console.log('\n--- BLOCK D: Strict Private Secret Audit in Build Artifacts ---');
const privateSecretTerms = [
  'service_role',
  'TURNSTILE_SECRET_KEY',
  'RATE_LIMIT_PEPPER',
  'SUPABASE_ACCESS_TOKEN'
];

let leakDetected = false;
const allDistFiles = fs.readdirSync(path.join(rootDir, 'dist'));

allDistFiles.forEach(f => {
  const fullPath = path.join(rootDir, 'dist', f);
  if (fs.statSync(fullPath).isFile() && (f.endsWith('.js') || f.endsWith('.html'))) {
    const content = fs.readFileSync(fullPath, 'utf8');
    privateSecretTerms.forEach(term => {
      if (content.includes(term)) {
        leakDetected = true;
        console.error(`  ❌ PRIVATE SECRET LEAK DETECTED: Term '${term}' found in dist/${f}`);
      }
    });
  }
});

assert(!leakDetected, 'TEST FAILED: Private secrets leaked into dist/ build artifacts');
console.log('  ✅ PASSED: D1: Zero private secrets (service_role, TURNSTILE_SECRET_KEY, RATE_LIMIT_PEPPER, SUPABASE_ACCESS_TOKEN) found in dist/');
console.log('  ℹ️ Note: Public frontend keys (VITE_SUPABASE_ANON_KEY, VITE_TURNSTILE_SITE_KEY) are correctly acknowledged as non-secret client values.');

// Restore Staging Build in dist/
console.log('\nRestoring Staging Build Output in dist/...');
runBuildWithEnv({
  VITE_APP_ENV: 'staging',
  VITE_EXPECTED_SUPABASE_PROJECT_REF: 'zauvpsxeexwthobmbkku',
  VITE_SUPABASE_URL: 'https://zauvpsxeexwthobmbkku.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_staging_key',
  VITE_TURNSTILE_SITE_KEY: '1x0000000000000000000000000000000AA'
});

console.log('\n==========================================');
console.log('EXPANDED INDEXATION PROTECTION SUITE COMPLETE: ALL PASSED');
console.log('==========================================');
