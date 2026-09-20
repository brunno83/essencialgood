// ESSENCIAL GOOD - GENERATE PRECHECKOUT STATIC CONFIG WITH ENVIRONMENT GUARD
// Generates dist/precheckout-config.js for vanilla static pages & widgets after validating environment configuration.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateEnvConfig, sanitizeKeyForLog } from "../src/lib/envGuard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");

// Carregar variáveis locais se necessário
function loadEnvFile(envFileName) {
  const envPath = path.join(rootDir, envFileName);
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

loadEnvFile(".env.local");
loadEnvFile(".env.staging");
loadEnvFile(".env.production");
loadEnvFile(".env");

let validated;
try {
  validated = validateEnvConfig(process.env);
} catch (err) {
  console.error("❌ CRITICAL ERROR IN PRECHECKOUT CONFIG GENERATION:");
  console.error(`   ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

// Garantir ausência total de service_role ou secrets
const configContent = `// ESSENCIAL GOOD - Configuração Pública do Pré-Checkout (Gerado de Forma Segura)
window.__ESSENCIAL_APP_ENV__ = ${JSON.stringify(validated.appEnv)};
window.__ESSENCIAL_PROJECT_REF__ = ${JSON.stringify(validated.expectedRef)};
window.__ESSENCIAL_SUPABASE_URL__ = ${JSON.stringify(validated.supabaseUrl)};
window.__ESSENCIAL_SUPABASE_ANON_KEY__ = ${JSON.stringify(validated.anonKey)};
window.__ESSENCIAL_TURNSTILE_SITE_KEY__ = ${JSON.stringify(validated.turnstileSiteKey)};
`;

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const distConfigPath = path.join(distDir, "precheckout-config.js");
const distTmpPath = path.join(distDir, "precheckout-config.js.tmp");

try {
  fs.writeFileSync(distTmpPath, configContent, "utf8");
  fs.renameSync(distTmpPath, distConfigPath);
} catch (err) {
  if (fs.existsSync(distTmpPath)) {
    try {
      fs.unlinkSync(distTmpPath);
    } catch (_) {}
  }
  console.error("❌ Failed to atomically write dist/precheckout-config.js");
  process.exit(1);
}

console.log(`✅ [PreCheckout Config] Criado com sucesso em dist/precheckout-config.js`);
console.log(`   Env: ${validated.appEnv}`);
console.log(`   Ref: ${validated.expectedRef}`);
console.log(`   URL: ${validated.supabaseUrl}`);
console.log(`   ANON_KEY: ${sanitizeKeyForLog(validated.anonKey)}`);
