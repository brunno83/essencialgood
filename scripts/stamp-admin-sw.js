import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distSwPath = path.resolve(__dirname, '../dist/sw-admin.js');
const PLACEHOLDER = '__EG_ADMIN_BUILD_VERSION__';

if (!fs.existsSync(distSwPath)) {
  console.error(`❌ [Admin PWA SW Stamp] Arquivo não encontrado: ${distSwPath}`);
  process.exit(1);
}

const vercelSha = process.env.VERCEL_GIT_COMMIT_SHA;
let version = '';

if (vercelSha && typeof vercelSha === 'string' && vercelSha.trim() !== '') {
  version = `v-${vercelSha.trim().slice(0, 12)}`;
} else {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  version = `local-${stamp}`;
}

let content = fs.readFileSync(distSwPath, 'utf8');

if (!content.includes(PLACEHOLDER)) {
  console.error(`❌ [Admin PWA SW Stamp] Placeholder "${PLACEHOLDER}" não encontrado em dist/sw-admin.js`);
  process.exit(1);
}

content = content.replace(new RegExp(PLACEHOLDER, 'g'), version);
fs.writeFileSync(distSwPath, content, 'utf8');

console.log(`✅ [Admin PWA SW Stamp] Versão de build estampada em dist/sw-admin.js: ${version}`);
