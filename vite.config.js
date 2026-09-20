import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.html': 'text/html; charset=utf-8'
};

/**
 * Plugin de proteção contra indexação ativado via VITE_APP_ENV no momento do build.
 * - Em produção (VITE_APP_ENV === 'production'): gera meta 'index, follow' e robots.txt 'Allow: /'
 * - Em qualquer outro ambiente (staging, dev, test, ausente ou desconhecido): falha fechado gerando
 *   meta 'noindex, nofollow, noarchive, nosnippet' e robots.txt 'Disallow: /'
 */
function indexationProtectionPlugin(appEnv) {
  const isProduction = appEnv === 'production';
  const robotsMetaTag = isProduction
    ? '<meta name="robots" content="index, follow" />'
    : '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />';

  const robotsTxtContent = isProduction
    ? 'User-agent: *\nAllow: /\n'
    : 'User-agent: *\nDisallow: /\n';

  return {
    name: 'indexation-protection-plugin',
    transformIndexHtml(html) {
      // Remove todas as ocorrências pré-existentes de meta robots para evitar duplicidade
      const cleanHtml = html.replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, '');
      return cleanHtml.replace('</head>', `  ${robotsMetaTag}\n</head>`);
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxtContent
      });
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (fs.existsSync(distDir)) {
        const updateHtmlFiles = (dir) => {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              updateHtmlFiles(fullPath);
            } else if (file.endsWith('.html')) {
              let content = fs.readFileSync(fullPath, 'utf8');
              // Garante substituição limpa e remoção de duplicados em todos os HTMLs do bundle
              let cleanContent = content.replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, '');
              if (cleanContent.includes('</head>')) {
                cleanContent = cleanContent.replace('</head>', `  ${robotsMetaTag}\n</head>`);
              } else {
                cleanContent = `${robotsMetaTag}\n${cleanContent}`;
              }
              fs.writeFileSync(fullPath, cleanContent, 'utf8');
            }
          }
        };
        updateHtmlFiles(distDir);
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawAppEnv = env.VITE_APP_ENV || process.env.VITE_APP_ENV || '';
  const appEnv = (typeof rawAppEnv === 'string' ? rawAppEnv : '').toLowerCase().trim();

  return {
    server: {
      port: 5180
    },
    plugins: [
      react(),
      indexationProtectionPlugin(appEnv),
      {
        name: 'standalone-static-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const urlPath = req.url.split('?')[0];

            if (urlPath === '/slimsodapower' || urlPath === '/slimsodapower/') {
              const indexPath = path.resolve(__dirname, 'public/slimsodapower/index.html');
              if (fs.existsSync(indexPath)) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                return fs.createReadStream(indexPath).pipe(res);
              }
            }

            if (urlPath.startsWith('/slimsodapower/')) {
              const relativePath = urlPath.replace(/^\//, '');
              const filePath = path.resolve(__dirname, 'public', relativePath);
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath).toLowerCase();
                const contentType = mimeTypes[ext] || 'application/octet-stream';
                res.setHeader('Content-Type', contentType);
                return fs.createReadStream(filePath).pipe(res);
              }
            }

            if (urlPath === '/linfaflowpower' || urlPath === '/linfaflowpower/') {
              const indexPath = path.resolve(__dirname, 'public/linfaflowpower/index.html');
              if (fs.existsSync(indexPath)) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                return fs.createReadStream(indexPath).pipe(res);
              }
            }

            if (urlPath.startsWith('/linfaflowpower/')) {
              const relativePath = urlPath.replace(/^\//, '');
              const filePath = path.resolve(__dirname, 'public', relativePath);
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath).toLowerCase();
                const contentType = mimeTypes[ext] || 'application/octet-stream';
                res.setHeader('Content-Type', contentType);
                return fs.createReadStream(filePath).pipe(res);
              }
            }

            next();
          });
        }
      }
    ]
  };
});
