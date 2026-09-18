import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browserPath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sourceImgPath = path.resolve(__dirname, '../public/assets/Brand/essencial-good-symbol.png');
const outDir = path.resolve(__dirname, '../public/assets/icons');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function generate() {
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const imgBase64 = fs.readFileSync(sourceImgPath).toString('base64');
  const dataUrl = 'data:image/png;base64,' + imgBase64;

  const renderIcon = async (width, height, isMaskable, filename) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
          canvas { display: block; }
        </style>
      </head>
      <body>
        <canvas id="c" width="${width}" height="${height}"></canvas>
        <script>
          const img = new Image();
          img.onload = () => {
            const canvas = document.getElementById('c');
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            if (${isMaskable}) {
              // Fundo bege/off-white com margem de área segura (15% padding)
              ctx.fillStyle = '#FAF8F5';
              ctx.fillRect(0, 0, ${width}, ${height});
              const margin = Math.round(${width} * 0.15);
              const drawW = ${width} - (margin * 2);
              const drawH = ${height} - (margin * 2);
              ctx.drawImage(img, margin, margin, drawW, drawH);
            } else {
              ctx.clearRect(0, 0, ${width}, ${height});
              ctx.drawImage(img, 0, 0, ${width}, ${height});
            }
            window.done = true;
          };
          img.src = '${dataUrl}';
        </script>
      </body>
      </html>
    `;

    await page.setContent(html);
    await page.waitForFunction(() => window.done === true);
    const canvasElem = await page.$('#c');
    await canvasElem.screenshot({ path: path.join(outDir, filename), omitBackground: !isMaskable });
    console.log(`Gerado com sucesso: ${filename} (${width}x${height})`);
  };

  await renderIcon(192, 192, false, 'icon-192x192.png');
  await renderIcon(512, 512, false, 'icon-512x512.png');
  await renderIcon(512, 512, true, 'icon-512x512-maskable.png');
  await renderIcon(180, 180, false, 'apple-touch-icon-180x180.png');
  await renderIcon(32, 32, false, 'favicon-32x32.png');

  await browser.close();
  console.log('✨ Todos os ícones do PWA foram gerados!');
}

generate().catch((err) => {
  console.error('Erro ao gerar ícones PWA:', err);
  process.exit(1);
});
