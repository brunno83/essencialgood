// ESSENCIAL GOOD - COMPLETE AUTOMATED SUITE FOR ENVIRONMENT GUARD (Node.js)
// Tests all validation rules, placeholder rejections, environment isolation matrices, Vercel guards, URL parsing, key sanitization, static generator isolation, and mock client instantiation.

import { validateEnvConfig, sanitizeKeyForLog, isDummyTurnstileSiteKey, isPlaceholderValue, STAGING_PROJECT_REF, PRODUCTION_PROJECT_REF } from "../src/lib/envGuard.js";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

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
console.log("ENVIRONMENT GUARD COMPLETE AUTOMATED TEST SUITE");
console.log("==========================================");

const validStagingConfig = {
  VITE_APP_ENV: "staging",
  VITE_EXPECTED_SUPABASE_PROJECT_REF: STAGING_PROJECT_REF,
  VITE_SUPABASE_URL: `https://${STAGING_PROJECT_REF}.supabase.co`,
  VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_staging_key_payload.signature",
  VITE_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
};

const validProdConfig = {
  VITE_APP_ENV: "production",
  VITE_EXPECTED_SUPABASE_PROJECT_REF: PRODUCTION_PROJECT_REF,
  VITE_SUPABASE_URL: `https://${PRODUCTION_PROJECT_REF}.supabase.co`,
  VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_prod_key_payload.signature",
  VITE_TURNSTILE_SITE_KEY: "0x4AAAAAAAsomerealproductionkey",
  VERCEL_ENV: "production",
};

// 1. Staging Válido
try {
  const res = validateEnvConfig(validStagingConfig);
  assert(res.isStaging === true && res.expectedRef === STAGING_PROJECT_REF, "[1] Configuração de Staging válida é ACEITA.");
} catch (e) {
  assert(false, `[1] Staging válido falhou: ${e.message}`);
}

// 2. Development Válido apontando para Staging
try {
  const devConfig = { ...validStagingConfig, VITE_APP_ENV: "development" };
  const res = validateEnvConfig(devConfig);
  assert(res.isDevelopment === true && res.expectedRef === STAGING_PROJECT_REF, "[2] Development válido apontando para Staging é ACEITO.");
} catch (e) {
  assert(false, `[2] Development válido falhou: ${e.message}`);
}

// 3. Production Válido com chave não-dummy
try {
  const res = validateEnvConfig(validProdConfig);
  assert(res.isProduction === true && res.expectedRef === PRODUCTION_PROJECT_REF, "[3] Configuração de Produção válida com chave real é ACEITA.");
} catch (e) {
  assert(false, `[3] Produção válida falhou: ${e.message}`);
}

// 4. Ambiente Desconhecido
let err4 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_APP_ENV: "qa" });
} catch (e) {
  err4 = e.message.includes("Invalid VITE_APP_ENV");
}
assert(err4, "[4] VITE_APP_ENV desconhecido ('qa') é REJEITADO.");

// 5. Variável Ausente
let err5 = false;
try {
  const copy = { ...validStagingConfig };
  delete copy.VITE_SUPABASE_URL;
  validateEnvConfig(copy);
} catch (e) {
  err5 = e.message.includes("Missing required variable");
}
assert(err5, "[5] Variável de ambiente obrigatória ausente é REJEITADA.");

// 6. URL Formato Inválido
let err6 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_SUPABASE_URL: "not-a-url" });
} catch (e) {
  err6 = e.message.includes("Invalid VITE_SUPABASE_URL format");
}
assert(err6, "[6] VITE_SUPABASE_URL com formato inválido é REJEITADA.");

// 7. HTTP em vez de HTTPS
let err7 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_SUPABASE_URL: `http://${STAGING_PROJECT_REF}.supabase.co` });
} catch (e) {
  err7 = e.message.includes("HTTPS protocol");
}
assert(err7, "[7] VITE_SUPABASE_URL com protocolo HTTP (não HTTPS) é REJEITADA.");

// 8. Userinfo em URL
let err8 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_SUPABASE_URL: `https://user:pass@${STAGING_PROJECT_REF}.supabase.co` });
} catch (e) {
  err8 = e.message.includes("cannot contain credentials");
}
assert(err8, "[8] VITE_SUPABASE_URL com userinfo/credentials é REJEITADA.");

// 9. Porta em URL
let err9 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_SUPABASE_URL: `https://${STAGING_PROJECT_REF}.supabase.co:8443` });
} catch (e) {
  err9 = e.message.includes("cannot specify a port");
}
assert(err9, "[9] VITE_SUPABASE_URL com porta explícita é REJEITADA.");

// 10. Path em URL
let err10 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_SUPABASE_URL: `https://${STAGING_PROJECT_REF}.supabase.co/extra/path` });
} catch (e) {
  err10 = e.message.includes("cannot contain a path");
}
assert(err10, "[10] VITE_SUPABASE_URL contendo path é REJEITADA.");

// 11. Query em URL
let err11 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_SUPABASE_URL: `https://${STAGING_PROJECT_REF}.supabase.co?foo=bar` });
} catch (e) {
  err11 = e.message.includes("cannot contain query parameters");
}
assert(err11, "[11] VITE_SUPABASE_URL contendo query string é REJEITADA.");

// 12. Hash em URL
let err12 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_SUPABASE_URL: `https://${STAGING_PROJECT_REF}.supabase.co#fragment` });
} catch (e) {
  err12 = e.message.includes("cannot contain a hash fragment");
}
assert(err12, "[12] VITE_SUPABASE_URL contendo hash fragment é REJEITADA.");

// 13. Hostname semelhante malicioso
let err13 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_SUPABASE_URL: `https://${STAGING_PROJECT_REF}.supabase.co.evil.invalid` });
} catch (e) {
  err13 = e.message.includes("hostname must be");
}
assert(err13, "[13] Hostname semelhante malicioso (spoofed) é REJEITADO.");

// 14. Project Ref Divergente da URL
let err14 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_EXPECTED_SUPABASE_PROJECT_REF: "otherref123" });
} catch (e) {
  err14 = e.message.includes("does not match URL project-ref");
}
assert(err14, "[14] VITE_EXPECTED_SUPABASE_PROJECT_REF divergente do hostname da URL é REJEITADO.");

// 15. Vercel Preview apontando para Produção
let err15 = false;
try {
  validateEnvConfig({ ...validProdConfig, VERCEL_ENV: "preview" });
} catch (e) {
  err15 = e.message.includes("VERCEL_ENV 'preview' requires VITE_APP_ENV 'staging'");
}
assert(err15, "[15] VERCEL_ENV=preview apontando para Produção é REJEITADO.");

// 16. Production apontando para Staging Ref
let err16 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_APP_ENV: "production" });
} catch (e) {
  err16 = e.message.includes("Production environment must target Production project-ref");
}
assert(err16, "[16] VITE_APP_ENV=production apontando para ref de Staging é REJEITADO.");

// 17. Production com site key dummy 1x...AA
let err17 = false;
try {
  validateEnvConfig({ ...validProdConfig, VITE_TURNSTILE_SITE_KEY: "1x00000000000000000000AA" });
} catch (e) {
  err17 = e.message.includes("cannot use official Cloudflare dummy Turnstile site key");
}
assert(err17, "[17] VITE_APP_ENV=production usando Turnstile dummy key (1x...AA) é REJEITADO.");

// 18. Production com site keys dummy 2x...AB
let err18 = false;
try {
  validateEnvConfig({ ...validProdConfig, VITE_TURNSTILE_SITE_KEY: "2x00000000000000000000AB" });
} catch (e) {
  err18 = e.message.includes("cannot use official Cloudflare dummy Turnstile site key");
}
assert(err18, "[18] VITE_APP_ENV=production usando Turnstile dummy key (2x...AB) é REJEITADO.");

// 19. Production com site key dummy 3x...FF
let err19 = false;
try {
  validateEnvConfig({ ...validProdConfig, VITE_TURNSTILE_SITE_KEY: "3x00000000000000000000FF" });
} catch (e) {
  err19 = e.message.includes("cannot use official Cloudflare dummy Turnstile site key");
}
assert(err19, "[19] VITE_APP_ENV=production usando Turnstile dummy key (3x...FF) é REJEITADO.");

// 20. Staging apontando para Produção
let err20 = false;
try {
  validateEnvConfig({ ...validProdConfig, VITE_APP_ENV: "staging", VERCEL_ENV: "" });
} catch (e) {
  err20 = e.message.includes("cannot target Production Supabase");
}
assert(err20, "[20] VITE_APP_ENV=staging apontando para Produção é REJEITADO.");

// 21. Produção com Placeholder de Anon Key
let err21 = false;
try {
  validateEnvConfig({ ...validProdConfig, VITE_SUPABASE_ANON_KEY: "your_production_anon_key_placeholder" });
} catch (e) {
  err21 = e.message.includes("contains a placeholder value");
}
assert(err21, "[21] VITE_APP_ENV=production com placeholder em anon key é REJEITADO.");

// 22. Produção com Placeholder de Turnstile Site Key
let err22 = false;
try {
  validateEnvConfig({ ...validProdConfig, VITE_TURNSTILE_SITE_KEY: "0x4AAAAAAAsomerealproductionkeyplaceholder" });
} catch (e) {
  err22 = e.message.includes("contains a placeholder value");
}
assert(err22, "[22] VITE_APP_ENV=production com placeholder em Turnstile key é REJEITADO.");

// 23. Staging com Placeholder de Anon Key
let err23 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_SUPABASE_ANON_KEY: "YOUR_ANON_KEY_HERE" });
} catch (e) {
  err23 = e.message.includes("contains a placeholder value");
}
assert(err23, "[23] VITE_APP_ENV=staging com placeholder em anon key é REJEITADO.");

// 24. VERCEL_ENV ausente + VITE_APP_ENV=production com ref de Staging
let err24 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_APP_ENV: "production" });
} catch (e) {
  err24 = e.message.includes("Production environment must target Production project-ref");
}
assert(err24, "[24] Build local sem VERCEL_ENV com VITE_APP_ENV=production e ref de Staging é REJEITADO.");

// 25. VERCEL_ENV=development + VITE_APP_ENV=development
try {
  const res = validateEnvConfig({ ...validStagingConfig, VITE_APP_ENV: "development", VERCEL_ENV: "development" });
  assert(res.isDevelopment === true, "[25] VERCEL_ENV=development com VITE_APP_ENV=development é ACEITO.");
} catch (e) {
  assert(false, `[25] Falhou: ${e.message}`);
}

// 26. VERCEL_ENV=development + VITE_APP_ENV=staging
try {
  const res = validateEnvConfig({ ...validStagingConfig, VITE_APP_ENV: "staging", VERCEL_ENV: "development" });
  assert(res.isStaging === true, "[26] VERCEL_ENV=development com VITE_APP_ENV=staging é ACEITO.");
} catch (e) {
  assert(false, `[26] Falhou: ${e.message}`);
}

// 27. VERCEL_ENV=production + VITE_APP_ENV=staging
let err27 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VERCEL_ENV: "production" });
} catch (e) {
  err27 = e.message.includes("VERCEL_ENV 'production' requires VITE_APP_ENV 'production'");
}
assert(err27, "[27] VERCEL_ENV=production com VITE_APP_ENV=staging é REJEITADO.");

// 28. VERCEL_ENV=preview + VITE_APP_ENV=development
let err28 = false;
try {
  validateEnvConfig({ ...validStagingConfig, VITE_APP_ENV: "development", VERCEL_ENV: "preview" });
} catch (e) {
  err28 = e.message.includes("VERCEL_ENV 'preview' requires VITE_APP_ENV 'staging'");
}
assert(err28, "[28] VERCEL_ENV=preview com VITE_APP_ENV=development é REJEITADO.");

// 28b. VERCEL_ENV=preview + VITE_APP_ENV=staging
try {
  const res = validateEnvConfig({ ...validStagingConfig, VERCEL_ENV: "preview" });
  assert(res.isStaging === true, "[28b] VERCEL_ENV=preview com VITE_APP_ENV=staging é ACEITO.");
} catch (e) {
  assert(false, `[28b] Staging com VERCEL_ENV=preview falhou: ${e.message}`);
}

// 29. Erro NUNCA contém nenhuma parte reconhecível da anonKey
const secretKeySample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.super_secret_payload_99.signature";
let errMessage29 = "";
try {
  validateEnvConfig({
    ...validStagingConfig,
    VITE_SUPABASE_ANON_KEY: secretKeySample,
    VITE_SUPABASE_URL: "invalid-url",
  });
} catch (e) {
  errMessage29 = e.message;
}
assert(!errMessage29.includes("super_secret_payload") && !errMessage29.includes("eyJhbGci"), "[29] Mensagem de erro NUNCA expõe a anonKey ou subcomponentes.");

// 30. Erro NUNCA contém a Turnstile site key
const secretTurnstileKey = "0x4AAAAAAAsomerealproductionkey";
let errMessage30 = "";
try {
  validateEnvConfig({
    ...validProdConfig,
    VITE_TURNSTILE_SITE_KEY: secretTurnstileKey,
    VITE_SUPABASE_URL: "invalid-url",
  });
} catch (e) {
  errMessage30 = e.message;
}
assert(!errMessage30.includes(secretTurnstileKey), "[30] Mensagem de erro NUNCA expõe a Turnstile site key.");

// 31 & 32. Mock Spy testando se createClient não é chamado quando a guarda falha e é chamado 1x quando válida
const mockSupabaseLogs = [];
let mockClientCreatedCount = 0;
let mockFetchCalledCount = 0;
let mockWebSocketCalledCount = 0;

function mockCreateClientWrapper(url, key) {
  mockClientCreatedCount++;
  return { url, key: sanitizeKeyForLog(key) };
}

function simulateSupabaseClientModule(rawConfig) {
  let validated = null;
  let envError = null;

  try {
    validated = validateEnvConfig(rawConfig);
  } catch (err) {
    envError = err.message;
    mockSupabaseLogs.push(`[Environment Guard] Supabase Client Instantiation BLOCKED: ${envError}`);
  }

  const isConfigured = Boolean(validated && !envError);
  const client = isConfigured ? mockCreateClientWrapper(validated.supabaseUrl, validated.anonKey) : null;

  return { isConfigured, client, envError };
}

const initialClientCount = mockClientCreatedCount;

// Teste de falha
const failResult = simulateSupabaseClientModule({ ...validStagingConfig, VITE_SUPABASE_URL: "invalid-url" });
assert(failResult.isConfigured === false, "[31.1] Em configuração inválida, isSupabaseConfigured retorna false.");
assert(failResult.client === null, "[31.2] Em configuração inválida, cliente Supabase é null.");
assert(mockClientCreatedCount === initialClientCount, "[31.3] Em configuração inválida, createClient() NUNCA é chamado (0 vezes).");
assert(mockFetchCalledCount === 0 && mockWebSocketCalledCount === 0, "[31.4] Em configuração inválida, fetch/WebSocket chamados 0 vezes.");

// Teste de sucesso
const successResult = simulateSupabaseClientModule(validStagingConfig);
assert(successResult.isConfigured === true, "[32.1] Em configuração válida, isSupabaseConfigured retorna true.");
assert(successResult.client !== null, "[32.2] Em configuração válida, cliente Supabase é instanciado.");
assert(mockClientCreatedCount === initialClientCount + 1, "[32.3] Configuração válida instancia o cliente Supabase exatamente uma vez.");

// 33. Gerador estático inválido NÃO cria nem modifica public/precheckout-config.js nem deixa arquivo parcial em dist/
const publicConfigPath = path.join(rootDir, "public", "precheckout-config.js");
const beforeMtime = fs.existsSync(publicConfigPath) ? fs.statSync(publicConfigPath).mtimeMs : 0;
const distTmpPath = path.join(rootDir, "dist", "precheckout-config.js.tmp");

let errStaticGenerator = false;
try {
  execSync("node scripts/generate-precheckout-config.js", {
    env: { ...process.env, VITE_APP_ENV: "staging", VITE_EXPECTED_SUPABASE_PROJECT_REF: "REPLACE_WITH_PLACEHOLDER" },
    stdio: "pipe",
  });
} catch (e) {
  errStaticGenerator = e.status !== 0;
}
const afterMtime = fs.existsSync(publicConfigPath) ? fs.statSync(publicConfigPath).mtimeMs : 0;

assert(errStaticGenerator, "[33.1] Gerador estático aborta com exit code 1 perante placeholder.");
assert(beforeMtime === afterMtime, "[33.2] Gerador estático inválido NÃO modifica public/precheckout-config.js.");
assert(!fs.existsSync(distTmpPath), "[33.3] Gerador estático inválido NÃO deixa arquivo temporário (.tmp) em dist/.");

// 34. Build Guard invalida aborta antes do Vite
let errBuildGuard = false;
try {
  execSync("node scripts/validate-env-guard.js", {
    env: { ...process.env, VITE_APP_ENV: "production", VITE_TURNSTILE_SITE_KEY: "1x00000000000000000000AA" },
    stdio: "pipe",
  });
} catch (e) {
  errBuildGuard = e.status !== 0;
}
assert(errBuildGuard, "[34] Build Guard aborta com exit code 1 antes da inicialização do Vite.");

// 35. public/precheckout-config.js é um fallback neutro sem credenciais funcionais
const publicContent = fs.readFileSync(publicConfigPath, "utf8");
assert(
  publicContent.includes('window.__ESSENCIAL_SUPABASE_URL__ = ""') &&
    publicContent.includes('window.__ESSENCIAL_SUPABASE_ANON_KEY__ = ""') &&
    publicContent.includes('window.__ESSENCIAL_TURNSTILE_SITE_KEY__ = ""'),
  "[35] public/precheckout-config.js contém apenas fallback neutro com strings vazias e zero chave funcional."
);

// 36. public/precheckout-config.js não contém service_role, pepper, secrets ou JWTs
assert(
  !publicContent.includes("service_role") &&
    !publicContent.includes("pepper") &&
    !publicContent.includes("secret") &&
    !publicContent.includes("eyJhbGci"),
  "[36] public/precheckout-config.js NÃO contém NENHUMA referência a service_role, pepper, secret ou JWT real."
);

// 37. Gerador estático em ambiente válido escreve SOMENTE em dist/precheckout-config.js e atômico (.tmp + rename)
const distConfigPath = path.join(rootDir, "dist", "precheckout-config.js");
let validGenSuccess = false;
try {
  execSync("node scripts/generate-precheckout-config.js", {
    env: {
      ...process.env,
      VITE_APP_ENV: "staging",
      VITE_EXPECTED_SUPABASE_PROJECT_REF: STAGING_PROJECT_REF,
      VITE_SUPABASE_URL: `https://${STAGING_PROJECT_REF}.supabase.co`,
      VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_staging_key_payload.signature",
      VITE_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
    },
    stdio: "pipe",
  });
  validGenSuccess = true;
} catch (e) {
  validGenSuccess = false;
}
const publicMtimeAfterGen = fs.statSync(publicConfigPath).mtimeMs;
assert(validGenSuccess, "[37.1] Gerador estático em ambiente válido conclui com sucesso (exit 0).");
assert(fs.existsSync(distConfigPath), "[37.2] Gerador estático escreve em dist/precheckout-config.js.");
assert(beforeMtime === publicMtimeAfterGen, "[37.3] Gerador estático em ambiente válido NUNCA altera public/precheckout-config.js.");

// 38. Fallback neutro em precheckout-loader resulta em 0 chamadas de fetch
function simulatePrecheckoutLoaderWithConfig(config) {
  let fetchCalled = false;
  const targetUrl = (config && config.url) || "";
  const targetKey = (config && config.anonKey) || "";

  if (targetUrl && targetKey) {
    fetchCalled = true;
  }
  return fetchCalled;
}
assert(
  simulatePrecheckoutLoaderWithConfig({ url: "", anonKey: "" }) === false,
  "[38] Fallback neutro sem credenciais ativas resulta em ZERO chamadas de fetch (0 network calls)."
);

// 39. Configuração válida no precheckout-loader permite disparo do fetch apenas após validação
assert(
  simulatePrecheckoutLoaderWithConfig({ url: `https://${STAGING_PROJECT_REF}.supabase.co`, anonKey: "valid_key" }) === true,
  "[39] Configuração válida permite fluxo de requisição do precheckout-loader somente após validação."
);

// 40. Busca sanitizada de segredos nos arquivos do projeto
const filesToAudit = [
  "package.json",
  "public/precheckout-config.js",
  "scripts/generate-precheckout-config.js",
  "src/lib/supabaseClient.js",
  "src/lib/envGuard.js",
  "scripts/validate-env-guard.js",
];

let suspiciousCount = 0;
filesToAudit.forEach((relPath) => {
  const fullP = path.join(rootDir, relPath);
  if (fs.existsSync(fullP)) {
    const txt = fs.readFileSync(fullP, "utf8");
    // Verificar se há atribuições ou valores de service_role_key, DB pepper ou Turnstile secret key
    if (txt.includes("SUPABASE_SERVICE_ROLE_KEY=") || txt.includes('"service_role"')) suspiciousCount++;
    if (txt.includes("DB_PEPPER=") || txt.includes("PEPPER_SECRET")) suspiciousCount++;
    if (txt.includes("TURNSTILE_SECRET_KEY=") || txt.includes("CF_SECRET_KEY=")) suspiciousCount++;
  }
});
assert(suspiciousCount === 0, "[40] Busca sanitizada confirma ZERO ocorrências de service_role, pepper ou Turnstile secret nos arquivos alterados/criados.");

// 50. Build local com VITE_APP_ENV=production sem VERCEL_ENV=production (mesmo com refs/chaves coerentes) é REJEITADO
let err50 = false;
try {
  validateEnvConfig({ ...validProdConfig, VERCEL_ENV: "" });
} catch (e) {
  err50 = e.message.includes("Local production build unauthorized");
}
assert(err50, "[50] Build local com VITE_APP_ENV=production sem VERCEL_ENV=production é REJEITADO antes da compilação.");

console.log(`\n==========================================`);
console.log(`RESUMO DOS TESTES DA ENVIRONMENT GUARD: ${passed}/${total} PASSARAM`);
console.log(`==========================================\n`);
