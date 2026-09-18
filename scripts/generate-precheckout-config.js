import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

// Função auxiliar para carregar arquivos .env locais se não estiverem no process.env
function loadEnvFile(envFileName) {
  const envPath = path.join(rootDir, envFileName);
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
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

// Carregar variáveis locais na ordem de precedência
loadEnvFile('.env.local');
loadEnvFile('.env.production');
loadEnvFile('.env');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO CRÍTICO NO BUILD DE PRÉ-CHECKOUT: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY ausentes no ambiente!');
  process.exit(1);
}

// Garantir ausência total de service_role_key
if (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ AVISO SEGURANÇA: Chave service_role detectada no ambiente. Ela NÃO será gravada no arquivo estático.');
}

const configContent = `// ESSENCIAL GOOD - Configuração Pública do Pré-Checkout (Gerado Automaticamente)
window.__ESSENCIAL_SUPABASE_URL__ = ${JSON.stringify(supabaseUrl)};
window.__ESSENCIAL_SUPABASE_ANON_KEY__ = ${JSON.stringify(supabaseAnonKey)};
`;

// Criar diretório dist se não existir
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const distConfigPath = path.join(distDir, 'precheckout-config.js');
fs.writeFileSync(distConfigPath, configContent, 'utf8');

// Também salvar na pasta public para desenvolvimento local
if (fs.existsSync(publicDir)) {
  const publicConfigPath = path.join(publicDir, 'precheckout-config.js');
  fs.writeFileSync(publicConfigPath, configContent, 'utf8');
}

const maskedKey = supabaseAnonKey.length > 16 
  ? supabaseAnonKey.slice(0, 8) + '...' + supabaseAnonKey.slice(-6)
  : '***';

console.log(`✅ [PreCheckout Config] Criado com sucesso em dist/precheckout-config.js`);
console.log(`   URL: ${supabaseUrl}`);
console.log(`   ANON_KEY: ${maskedKey}`);
