// ESSENCIAL GOOD - BUILD ENVIRONMENT GUARD SCRIPT
// Executed before `vite build` to block invalid environment configurations prior to asset compilation.

import { validateEnvConfig, sanitizeKeyForLog } from "../src/lib/envGuard.js";

console.log("==========================================");
console.log("VALIDATING BUILD ENVIRONMENT GUARD");
console.log("==========================================");

try {
  const envConfig = {
    VITE_APP_ENV: process.env.VITE_APP_ENV,
    VITE_EXPECTED_SUPABASE_PROJECT_REF: process.env.VITE_EXPECTED_SUPABASE_PROJECT_REF,
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    VITE_TURNSTILE_SITE_KEY: process.env.VITE_TURNSTILE_SITE_KEY,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  const validated = validateEnvConfig(envConfig);

  console.log(`✅ Build Environment Validated:`);
  console.log(`   - Environment: ${validated.appEnv}`);
  console.log(`   - Project Ref: ${validated.expectedRef}`);
  console.log(`   - Supabase URL: ${validated.supabaseUrl}`);
  console.log(`   - Anon Key: ${sanitizeKeyForLog(validated.anonKey)}`);
  console.log(`   - Turnstile Key: ${sanitizeKeyForLog(validated.turnstileSiteKey)}`);
  console.log("==========================================\n");
} catch (err) {
  console.error("\n❌ BUILD GUARD BLOCKED EXECUTION:");
  console.error(`   ${err instanceof Error ? err.message : String(err)}`);
  console.error("   Aborting build process before Vite initialization.\n");
  process.exit(1);
}
