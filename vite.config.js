import { defineConfig } from 'vite'
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

export default defineConfig({
  server: {
    port: 5180
  },
  plugins: [
    react(),
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
  ],
})
