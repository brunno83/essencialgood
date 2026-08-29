import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found!');
  process.exit(1);
}

const htmlContent = fs.readFileSync(indexPath, 'utf8');
const routes = ['slimsoda', 'linfaflow', 'sonnus', 'crowned', 'listicle/slimsoda', 'listicle/linfaflow'];

routes.forEach(route => {
  const routeDir = path.join(distDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  const targetPath = path.join(routeDir, 'index.html');
  fs.writeFileSync(targetPath, htmlContent, 'utf8');
  console.log(`Generated physical static SPA page: dist/${route}/index.html`);
});

console.log('All PDP static routes successfully generated!');
