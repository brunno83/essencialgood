// ESSENCIAL GOOD - PHASE 2B.4B STRICT ENVIRONMENT ISOLATION & EXPLICIT PORTS TEST SUITE
// Tests CORS, source_url, Turnstile hostnames, widgetMessaging, and chat-loader resolution

import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isAllowedCorsOrigin, PRODUCTION_ALLOWED_ORIGINS, STAGING_ALLOWED_ORIGINS, DEV_ALLOWED_LOCAL_ORIGINS } from "../supabase/functions/_shared/cors.ts";
import { isAllowedTurnstileHostname, PRODUCTION_TURNSTILE_HOSTNAMES, STAGING_TURNSTILE_HOSTNAMES } from "../supabase/functions/_shared/turnstile.ts";
import { isAllowedParentOrigin } from "../src/components/chat-frame/widgetMessaging.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Extrair e instanciar validateAndDeriveSourceUrl de create-conversation/index.ts para execução pura no Node
const createConvCode = fs.readFileSync(path.join(rootDir, "supabase/functions/create-conversation/index.ts"), "utf8");
const fnMatch = createConvCode.match(/export function validateAndDeriveSourceUrl[\s\S]*?^\}/m);
if (!fnMatch) {
  throw new Error("Could not extract validateAndDeriveSourceUrl from create-conversation/index.ts");
}

let rawFnBody = fnMatch[0]
  .replace("export function validateAndDeriveSourceUrl", "function validateAndDeriveSourceUrl")
  .replace(": unknown", "")
  .replace(": boolean", "")
  .replace(": URL", "")
  .replace(/\(urlStr[\s\S]*?\)\s*:\s*\{[\s\S]*?\}\s*\{/, "(urlStr) {")
  .replace(/:\s*\{\s*safeSourceUrl[\s\S]*?\}/, "");

const evalFn = new Function("Deno", `${rawFnBody}; return validateAndDeriveSourceUrl;`);

function runValidateAndDeriveSourceUrl(urlStr, mockDenoEnv = {}) {
  const mockDeno = {
    env: {
      get: (key) => mockDenoEnv[key] || process.env[key] || "",
    },
  };
  const fn = evalFn(mockDeno);
  return fn(urlStr);
}

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ PASSED: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAILED: ${name}`);
    console.error(`     ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}

console.log("==========================================");
console.log("RUNNING PHASE 2B.4B STRICT ISOLATION & EXPLICIT PORTS TESTS");
console.log("==========================================\n");

// ----------------------------------------------------
// BLOCK A: Edge Functions CORS Strict Isolation Matrix (`cors.ts`)
// ----------------------------------------------------
console.log("--- BLOCK A: CORS Matrix (`cors.ts`) ---");

test("A1: Production Environment accepts ONLY official production domains", () => {
  assert.strictEqual(isAllowedCorsOrigin("https://essencialgood.com", "production"), true);
  assert.strictEqual(isAllowedCorsOrigin("https://www.essencialgood.com", "production"), true);
  // Rejeita staging, dev, vercel, spoofing
  assert.strictEqual(isAllowedCorsOrigin("https://staging.essencialgood.com", "production"), false);
  assert.strictEqual(isAllowedCorsOrigin("http://localhost:5173", "production"), false);
  assert.strictEqual(isAllowedCorsOrigin("http://127.0.0.1:5173", "production"), false);
  assert.strictEqual(isAllowedCorsOrigin("https://preview.vercel.app", "production"), false);
});

test("A2: Staging Environment accepts ONLY staging domain (rejection of prod & dev)", () => {
  assert.strictEqual(isAllowedCorsOrigin("https://staging.essencialgood.com", "staging"), true);
  // Rejeita produção, localhost, vercel
  assert.strictEqual(isAllowedCorsOrigin("https://essencialgood.com", "staging"), false);
  assert.strictEqual(isAllowedCorsOrigin("https://www.essencialgood.com", "staging"), false);
  assert.strictEqual(isAllowedCorsOrigin("http://localhost:5173", "staging"), false);
  assert.strictEqual(isAllowedCorsOrigin("http://127.0.0.1:5173", "staging"), false);
});

test("A3: Development Environment accepts ONLY explicit local ports (5173, 4173)", () => {
  assert.strictEqual(isAllowedCorsOrigin("http://localhost:5173", "development"), true);
  assert.strictEqual(isAllowedCorsOrigin("http://127.0.0.1:5173", "development"), true);
  assert.strictEqual(isAllowedCorsOrigin("http://localhost:4173", "development"), true);
  assert.strictEqual(isAllowedCorsOrigin("http://127.0.0.1:4173", "development"), true);

  // Rejeita portas não-autorizadas (ex: 8080, 3000) e origens de prod/staging em dev
  assert.strictEqual(isAllowedCorsOrigin("http://localhost:8080", "development"), false);
  assert.strictEqual(isAllowedCorsOrigin("http://127.0.0.1:3000", "development"), false);
  assert.strictEqual(isAllowedCorsOrigin("https://essencialgood.com", "development"), false);
  assert.strictEqual(isAllowedCorsOrigin("https://staging.essencialgood.com", "development"), false);
});

test("A4: Absent or unknown environment FAILS CLOSED (rejects all)", () => {
  assert.strictEqual(isAllowedCorsOrigin("https://www.essencialgood.com", ""), false);
  assert.strictEqual(isAllowedCorsOrigin("https://staging.essencialgood.com", ""), false);
  assert.strictEqual(isAllowedCorsOrigin("http://localhost:5173", ""), false);
  assert.strictEqual(isAllowedCorsOrigin("https://www.essencialgood.com", "unknown_env"), false);
});

test("A5: Origin 'null', CR/LF, null-byte & spoofed domains are rejected", () => {
  assert.strictEqual(isAllowedCorsOrigin("null", "production"), false);
  assert.strictEqual(isAllowedCorsOrigin("https://essencialgood.com\r\nHeader: 1", "production"), false);
  assert.strictEqual(isAllowedCorsOrigin("https://essencialgood.com\0.evil.com", "production"), false);
  assert.strictEqual(isAllowedCorsOrigin("https://staging.essencialgood.com.evil", "staging"), false);
});


// ----------------------------------------------------
// BLOCK B: Edge Functions `source_url` Matrix (`create-conversation`)
// ----------------------------------------------------
console.log("\n--- BLOCK B: `source_url` Matrix (`create-conversation`) ---");

test("B1: Production source_url accepts official domains only", () => {
  const res = runValidateAndDeriveSourceUrl("https://www.essencialgood.com/produto", { ENVIRONMENT: "production" });
  assert.strictEqual(res.derivedSourceHost, "www.essencialgood.com");
  assert.throws(() => runValidateAndDeriveSourceUrl("https://staging.essencialgood.com/produto", { ENVIRONMENT: "production" }), /Unauthorized hostname/);
  assert.throws(() => runValidateAndDeriveSourceUrl("http://localhost:5173/produto", { ENVIRONMENT: "production" }), /Unauthorized hostname/);
});

test("B2: Staging source_url accepts staging domain only", () => {
  const res = runValidateAndDeriveSourceUrl("https://staging.essencialgood.com/produto", { ENVIRONMENT: "staging" });
  assert.strictEqual(res.derivedSourceHost, "staging.essencialgood.com");
  assert.throws(() => runValidateAndDeriveSourceUrl("https://www.essencialgood.com/produto", { ENVIRONMENT: "staging" }), /Unauthorized hostname/);
  assert.throws(() => runValidateAndDeriveSourceUrl("http://localhost:5173/produto", { ENVIRONMENT: "staging" }), /Unauthorized hostname/);
});

test("B3: Development source_url accepts localhost HTTP/HTTPS on explicit ports (5173, 4173) only", () => {
  const res1 = runValidateAndDeriveSourceUrl("http://localhost:5173/produto", { ENVIRONMENT: "development" });
  assert.strictEqual(res1.derivedSourceHost, "localhost");

  const res2 = runValidateAndDeriveSourceUrl("http://127.0.0.1:4173/produto", { ENVIRONMENT: "test" });
  assert.strictEqual(res2.derivedSourceHost, "127.0.0.1");

  // Rejeita portas não-autorizadas em dev
  assert.throws(() => runValidateAndDeriveSourceUrl("http://localhost:8080/produto", { ENVIRONMENT: "development" }), /Unauthorized hostname or port/);
  assert.throws(() => runValidateAndDeriveSourceUrl("https://staging.essencialgood.com/produto", { ENVIRONMENT: "development" }), /Unauthorized hostname/);
  assert.throws(() => runValidateAndDeriveSourceUrl("https://www.essencialgood.com/produto", { ENVIRONMENT: "development" }), /Unauthorized hostname/);
});

test("B4: Absent environment FAILS CLOSED", () => {
  assert.throws(() => runValidateAndDeriveSourceUrl("https://www.essencialgood.com/produto", { ENVIRONMENT: "" }), /Unauthorized environment/);
});

test("B5: Precedence of DENO_ENV over ENVIRONMENT", () => {
  // DENO_ENV=production, ENVIRONMENT=development -> DENO_ENV must take precedence (production rules apply)
  assert.throws(
    () => runValidateAndDeriveSourceUrl("http://localhost:5173/produto", { DENO_ENV: "production", ENVIRONMENT: "development" }),
    /Unauthorized hostname/
  );
});

test("B6: Userinfo, unexpected ports, HTTP outside dev & spoofing rejected", () => {
  assert.throws(() => runValidateAndDeriveSourceUrl("https://user:pass@staging.essencialgood.com/produto", { ENVIRONMENT: "staging" }), /Credentials/);
  assert.throws(() => runValidateAndDeriveSourceUrl("http://staging.essencialgood.com/produto", { ENVIRONMENT: "staging" }), /must use HTTPS/);
  assert.throws(() => runValidateAndDeriveSourceUrl("https://staging-essencialgood.com.evil/produto", { ENVIRONMENT: "staging" }), /Unauthorized hostname/);
});


// ----------------------------------------------------
// BLOCK C: Turnstile Hostnames Matrix (`turnstile.ts`)
// ----------------------------------------------------
console.log("\n--- BLOCK C: Turnstile Hostnames Matrix (`turnstile.ts`) ---");

test("C1: Production Turnstile accepts official hostnames only", () => {
  assert.strictEqual(isAllowedTurnstileHostname("essencialgood.com", "production"), true);
  assert.strictEqual(isAllowedTurnstileHostname("www.essencialgood.com", "production"), true);
  assert.strictEqual(isAllowedTurnstileHostname("staging.essencialgood.com", "production"), false);
  assert.strictEqual(isAllowedTurnstileHostname("localhost", "production"), false);
});

test("C2: Staging Turnstile accepts staging.essencialgood.com only", () => {
  assert.strictEqual(isAllowedTurnstileHostname("staging.essencialgood.com", "staging"), true);
  assert.strictEqual(isAllowedTurnstileHostname("www.essencialgood.com", "staging"), false);
  assert.strictEqual(isAllowedTurnstileHostname("localhost", "staging"), false);
});

test("C3: Dev Turnstile accepts localhost / 127.0.0.1", () => {
  assert.strictEqual(isAllowedTurnstileHostname("localhost", "development"), true);
  assert.strictEqual(isAllowedTurnstileHostname("127.0.0.1", "test"), true);
  assert.strictEqual(isAllowedTurnstileHostname("staging.essencialgood.com", "development"), false);
});

test("C4: Absent environment FAILS CLOSED", () => {
  assert.strictEqual(isAllowedTurnstileHostname("www.essencialgood.com", ""), false);
  assert.strictEqual(isAllowedTurnstileHostname("staging.essencialgood.com", ""), false);
});


// ----------------------------------------------------
// BLOCK D: Widget Messaging Parent Origin Matrix (`widgetMessaging.js`)
// ----------------------------------------------------
console.log("\n--- BLOCK D: Widget Messaging Parent Origin Matrix (`widgetMessaging.js`) ---");

test("D1: Production Parent Origin accepts official origins only", () => {
  process.env.VITE_APP_ENV = "production";
  assert.strictEqual(isAllowedParentOrigin("https://essencialgood.com"), true);
  assert.strictEqual(isAllowedParentOrigin("https://www.essencialgood.com"), true);
  assert.strictEqual(isAllowedParentOrigin("https://staging.essencialgood.com"), false);
  assert.strictEqual(isAllowedParentOrigin("http://localhost:5173"), false);
});

test("D2: Staging Parent Origin accepts staging origin only", () => {
  process.env.VITE_APP_ENV = "staging";
  assert.strictEqual(isAllowedParentOrigin("https://staging.essencialgood.com"), true);
  assert.strictEqual(isAllowedParentOrigin("https://www.essencialgood.com"), false);
  assert.strictEqual(isAllowedParentOrigin("http://localhost:5173"), false);
});

test("D3: Dev Parent Origin accepts explicit local ports only (5173, 4173)", () => {
  process.env.VITE_APP_ENV = "development";
  assert.strictEqual(isAllowedParentOrigin("http://localhost:5173"), true);
  assert.strictEqual(isAllowedParentOrigin("http://127.0.0.1:4173"), true);
  assert.strictEqual(isAllowedParentOrigin("http://localhost:8080"), false); // Porta não-autorizada
});

test("D4: Absent VITE_APP_ENV FAILS CLOSED (rejects all)", () => {
  delete process.env.VITE_APP_ENV;
  assert.strictEqual(isAllowedParentOrigin("https://www.essencialgood.com"), false);
  assert.strictEqual(isAllowedParentOrigin("https://staging.essencialgood.com"), false);
  assert.strictEqual(isAllowedParentOrigin("http://localhost:5173"), false);
});

test("D5: Rejects null, spoofed, unknown, null-char and invalid schemes", () => {
  process.env.VITE_APP_ENV = "production";
  assert.strictEqual(isAllowedParentOrigin("null"), false);
  assert.strictEqual(isAllowedParentOrigin("https://staging.essencialgood.com.evil"), false);
  assert.strictEqual(isAllowedParentOrigin("https://unknown.essencialgood.com"), false);
  assert.strictEqual(isAllowedParentOrigin("javascript:alert(1)"), false);
  assert.strictEqual(isAllowedParentOrigin("https://essencialgood.com\0.evil.com"), false);
});


// ----------------------------------------------------
// BLOCK E: Chat Loader Resolution Matrix (`chat-loader.js`)
// ----------------------------------------------------
console.log("\n--- BLOCK E: Chat Loader Resolution Matrix (`chat-loader.js`) ---");

const chatLoaderCode = fs.readFileSync(path.join(rootDir, "public/chat-loader.js"), "utf8");

test("E1: Explicit port resolution and fail-closed logic in chat-loader.js", () => {
  assert.strictEqual(chatLoaderCode.includes("port === '5173' || port === '4173'"), true);
  assert.strictEqual(chatLoaderCode.includes("hostname === 'staging.essencialgood.com' && protocol === 'https:' && !port"), true);
  assert.strictEqual(chatLoaderCode.includes("logLoader('Aborting chat loader: Unknown or unauthorized host'"), true);
  assert.strictEqual(chatLoaderCode.includes("logLoader('Aborting chat loader: Unauthorized local port'"), true);
});


// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log("\n==========================================");
console.log(`TEST SUITE COMPLETE: ${passedTests}/${totalTests} Passed.`);
console.log("==========================================\n");

if (passedTests !== totalTests) {
  process.exit(1);
}
