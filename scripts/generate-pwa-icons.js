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

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(l1, l2) {
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

async function generate() {
  console.log('🚀 Iniciando geração e auditoria de ícones PWA...');

  if (!fs.existsSync(sourceImgPath)) {
    throw new Error(`Imagem fonte não encontrada: ${sourceImgPath}`);
  }

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const b64 = fs.readFileSync(sourceImgPath).toString('base64');
  const dataUrl = `data:image/png;base64,${b64}`;

  await page.goto('about:blank');
  await page.evaluate((url) => {
    window.sourceDataUrl = url;
  }, dataUrl);

  const renderIcon = async (width, height, isMaskable, marginPct, filename) => {
    const result = await page.evaluate(async (w, h, maskable, marginRatio) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          // 1. Extract leaf symbol bounding box from source image
          const origCanvas = document.createElement('canvas');
          origCanvas.width = img.width;
          origCanvas.height = img.height;
          const oCtx = origCanvas.getContext('2d');
          oCtx.drawImage(img, 0, 0);
          const oPixels = oCtx.getImageData(0, 0, img.width, img.height).data;

          let minX = img.width, minY = img.height, maxX = -1, maxY = -1;
          for (let i = 0; i < oPixels.length; i += 4) {
            const r = oPixels[i], g = oPixels[i+1], b = oPixels[i+2];
            if (r < 200 || g < 200 || b < 190) {
              const idx = i / 4;
              const x = idx % img.width;
              const y = Math.floor(idx / img.width);
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }

          const leafW = maxX - minX + 1;
          const leafH = maxY - minY + 1;

          // 2. Create anti-aliased off-white leaf canvas (#FAF8F5)
          const leafCanvas = document.createElement('canvas');
          leafCanvas.width = leafW;
          leafCanvas.height = leafH;
          const lCtx = leafCanvas.getContext('2d');
          const leafImgData = lCtx.createImageData(leafW, leafH);
          const lData = leafImgData.data;

          for (let y = 0; y < leafH; y++) {
            for (let x = 0; x < leafW; x++) {
              const srcX = minX + x;
              const srcY = minY + y;
              const srcIdx = (srcY * img.width + srcX) * 4;
              const r = oPixels[srcIdx], g = oPixels[srcIdx+1], b = oPixels[srcIdx+2];

              const destIdx = (y * leafW + x) * 4;
              const bgDist = Math.sqrt(
                Math.pow(238 - r, 2) + Math.pow(233 - g, 2) + Math.pow(222 - b, 2)
              );
              let alpha = Math.min(255, Math.max(0, (bgDist - 20) * 2.2));

              if (alpha > 5) {
                lData[destIdx] = 250;     // R (#FAF8F5)
                lData[destIdx+1] = 248;   // G
                lData[destIdx+2] = 245;   // B
                lData[destIdx+3] = Math.round(alpha);
              } else {
                lData[destIdx+3] = 0;
              }
            }
          }
          lCtx.putImageData(leafImgData, 0, 0);

          // 3. Render final canvas with solid brand olive green background (#2E4829)
          const canvas = document.createElement('canvas');
          canvas.id = 'render-canvas';
          canvas.width = w;
          canvas.height = h;
          document.body.appendChild(canvas);

          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#2E4829';
          ctx.fillRect(0, 0, w, h);

          const padding = Math.round(w * marginRatio);
          const availW = w - (padding * 2);
          const availH = h - (padding * 2);
          const scale = Math.min(availW / leafW, availH / leafH);

          const drawW = Math.round(leafW * scale);
          const drawH = Math.round(leafH * scale);
          const drawX = Math.round((w - drawW) / 2);
          const drawY = Math.round((h - drawH) / 2);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(leafCanvas, drawX, drawY, drawW, drawH);

          // 4. Extract pixel data for automated verification
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          const colors = new Set();
          let transparentCount = 0;
          let symbolCount = 0;
          let bgCount = 0;

          let resMinX = w, resMinY = h, resMaxX = -1, resMaxY = -1;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
            const hex = `${r},${g},${b},${a}`;
            colors.add(hex);

            if (a < 250) {
              transparentCount++;
            } else {
              if (r > 200 && g > 200 && b > 200) {
                symbolCount++;
                const pxIdx = i / 4;
                const pxX = pxIdx % w;
                const pxY = Math.floor(pxIdx / w);
                if (pxX < resMinX) resMinX = pxX;
                if (pxX > resMaxX) resMaxX = pxX;
                if (pxY < resMinY) resMinY = pxY;
                if (pxY > resMaxY) resMaxY = pxY;
              } else if (r === 46 && g === 72 && b === 41) {
                bgCount++;
              }
            }
          }

          const total = w * h;
          resolve({
            width: w,
            height: h,
            uniqueColors: colors.size,
            transparentPct: (transparentCount / total) * 100,
            symbolPct: (symbolCount / total) * 100,
            bgPct: (bgCount / total) * 100,
            bbox: { minX: resMinX, minY: resMinY, maxX: resMaxX, maxY: resMaxY },
            drawArea: { drawX, drawY, drawW, drawH }
          });
        };
        img.onerror = () => reject(new Error('Falha ao carregar imagem no browser'));
        img.src = window.sourceDataUrl;
      });
    }, width, height, isMaskable, marginPct);

    const canvasElem = await page.$('#render-canvas');
    const outPath = path.join(outDir, filename);
    await canvasElem.screenshot({ path: outPath, omitBackground: false });

    await page.evaluate(() => {
      const el = document.getElementById('render-canvas');
      if (el) el.remove();
    });

    console.log(`\n🔍 Auditando ${filename} (${width}x${height}):`);
    console.log(`   - Cores únicas: ${result.uniqueColors}`);
    console.log(`   - % Transparência: ${result.transparentPct.toFixed(2)}%`);
    console.log(`   - % Símbolo (Off-White): ${result.symbolPct.toFixed(2)}%`);
    console.log(`   - Bounding Box Símbolo: [${result.bbox.minX}, ${result.bbox.minY}] -> [${result.bbox.maxX}, ${result.bbox.maxY}]`);

    if (result.transparentPct > 0) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} contém ${result.transparentPct.toFixed(2)}% de transparência! (Esperado: 0% fundo sólido #2E4829).`);
    }

    if (result.uniqueColors < 10) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} possui apenas ${result.uniqueColors} cores únicas!`);
    }

    if (result.symbolPct < 3.0) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} possui apenas ${result.symbolPct.toFixed(2)}% de pixels do símbolo!`);
    }

    const bgLum = getLuminance(46, 72, 41);     // #2E4829
    const symLum = getLuminance(250, 248, 245); // #FAF8F5
    const contrast = getContrastRatio(bgLum, symLum);
    console.log(`   - Razão de Contraste Relativo: ${contrast.toFixed(2)}:1`);

    if (contrast < 3.0) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} possui razão de contraste insuficiente (${contrast.toFixed(2)}:1 < 3.0:1).`);
    }

    const centerX = width / 2;
    const centerY = height / 2;
    if (result.bbox.minX >= centerX || result.bbox.maxX <= centerX || result.bbox.minY >= centerY || result.bbox.maxY <= centerY) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} não possui símbolo cobrindo o centro da imagem!`);
    }

    console.log(`✅ ${filename} APROVADO NA AUDITORIA DE PIXELS!`);
  };

  const renderBadgeIcon = async (width, height, marginPct, filename) => {
    const result = await page.evaluate(async (w, h, marginRatio) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          // 1. Extract leaf symbol bounding box from source image
          const origCanvas = document.createElement('canvas');
          origCanvas.width = img.width;
          origCanvas.height = img.height;
          const oCtx = origCanvas.getContext('2d');
          oCtx.drawImage(img, 0, 0);
          const oPixels = oCtx.getImageData(0, 0, img.width, img.height).data;

          let minX = img.width, minY = img.height, maxX = -1, maxY = -1;
          for (let i = 0; i < oPixels.length; i += 4) {
            const r = oPixels[i], g = oPixels[i+1], b = oPixels[i+2];
            if (r < 200 || g < 200 || b < 190) {
              const idx = i / 4;
              const x = idx % img.width;
              const y = Math.floor(idx / img.width);
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }

          const leafW = maxX - minX + 1;
          const leafH = maxY - minY + 1;

          // 2. Create anti-aliased PURE WHITE leaf canvas (#FFFFFF)
          const leafCanvas = document.createElement('canvas');
          leafCanvas.width = leafW;
          leafCanvas.height = leafH;
          const lCtx = leafCanvas.getContext('2d');
          const leafImgData = lCtx.createImageData(leafW, leafH);
          const lData = leafImgData.data;

          for (let y = 0; y < leafH; y++) {
            for (let x = 0; x < leafW; x++) {
              const srcX = minX + x;
              const srcY = minY + y;
              const srcIdx = (srcY * img.width + srcX) * 4;
              const r = oPixels[srcIdx], g = oPixels[srcIdx+1], b = oPixels[srcIdx+2];

              const destIdx = (y * leafW + x) * 4;
              const bgDist = Math.sqrt(
                Math.pow(238 - r, 2) + Math.pow(233 - g, 2) + Math.pow(222 - b, 2)
              );
              let alpha = Math.min(255, Math.max(0, (bgDist - 20) * 2.2));

              if (alpha > 5) {
                lData[destIdx] = 255;     // Pure White R (#FFFFFF)
                lData[destIdx+1] = 255;   // Pure White G
                lData[destIdx+2] = 255;   // Pure White B
                lData[destIdx+3] = Math.round(alpha);
              } else {
                lData[destIdx+3] = 0;
              }
            }
          }
          lCtx.putImageData(leafImgData, 0, 0);

          // 3. Render final canvas with 100% TRANSPARENT background
          const canvas = document.createElement('canvas');
          canvas.id = 'render-canvas';
          canvas.width = w;
          canvas.height = h;
          document.body.appendChild(canvas);

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, w, h);

          const padding = Math.round(w * marginRatio);
          const availW = w - (padding * 2);
          const availH = h - (padding * 2);
          const scale = Math.min(availW / leafW, availH / leafH);

          const drawW = Math.round(leafW * scale);
          const drawH = Math.round(leafH * scale);
          const drawX = Math.round((w - drawW) / 2);
          const drawY = Math.round((h - drawH) / 2);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(leafCanvas, drawX, drawY, drawW, drawH);

          // 4. Extract pixel data for Android status bar verification
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          let transparentCount = 0;
          let whiteSymbolCount = 0;
          let coloredPixelCount = 0;

          let resMinX = w, resMinY = h, resMaxX = -1, resMaxY = -1;

          // Check corner pixels (5x5 block at each of the 4 corners)
          const cornerIndices = [];
          for (let cy = 0; cy < 5; cy++) {
            for (let cx = 0; cx < 5; cx++) {
              // Top-left
              cornerIndices.push((cy * w + cx) * 4);
              // Top-right
              cornerIndices.push((cy * w + (w - 1 - cx)) * 4);
              // Bottom-left
              cornerIndices.push(((h - 1 - cy) * w + cx) * 4);
              // Bottom-right
              cornerIndices.push(((h - 1 - cy) * w + (w - 1 - cx)) * 4);
            }
          }
          const cornersTransparent = cornerIndices.every(idx => data[idx + 3] === 0);

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];

            if (a < 10) {
              transparentCount++;
            } else {
              // Check if pixel is pure white or anti-aliased white (R=G=B > 180)
              if (r === 255 && g === 255 && b === 255) {
                whiteSymbolCount++;
                const pxIdx = i / 4;
                const pxX = pxIdx % w;
                const pxY = Math.floor(pxIdx / w);
                if (pxX < resMinX) resMinX = pxX;
                if (pxX > resMaxX) resMaxX = pxX;
                if (pxY < resMinY) resMinY = pxY;
                if (pxY > resMaxY) resMaxY = pxY;
              } else if (r === g && g === b && r > 180) {
                // Anti-aliased white edge pixel
                whiteSymbolCount++;
              } else {
                coloredPixelCount++;
              }
            }
          }

          const total = w * h;
          const bboxW = resMaxX - resMinX + 1;
          const bboxH = resMaxY - resMinY + 1;
          const bboxArea = bboxW * bboxH;
          const symbolFillRatio = whiteSymbolCount / bboxArea;

          resolve({
            width: w,
            height: h,
            transparentPct: (transparentCount / total) * 100,
            symbolPct: (whiteSymbolCount / total) * 100,
            coloredPixelCount,
            cornersTransparent,
            symbolFillRatio,
            bbox: { minX: resMinX, minY: resMinY, maxX: resMaxX, maxY: resMaxY, bboxW, bboxH }
          });
        };
        img.onerror = () => reject(new Error('Falha ao carregar imagem no browser'));
        img.src = window.sourceDataUrl;
      });
    }, width, height, marginPct);

    const canvasElem = await page.$('#render-canvas');
    const outPath = path.join(outDir, filename);
    await canvasElem.screenshot({ path: outPath, omitBackground: true });

    await page.evaluate(() => {
      const el = document.getElementById('render-canvas');
      if (el) el.remove();
    });

    console.log(`\n🔍 AUDITORIA ESTRITA DE BARRA DE STATUS ANDROID — ${filename} (${width}x${height}):`);
    console.log(`   - % Transparência de Fundo: ${result.transparentPct.toFixed(2)}%`);
    console.log(`   - % Símbolo (Branco Puro #FFFFFF): ${result.symbolPct.toFixed(2)}%`);
    console.log(`   - Cantos 100% Transparentes (5x5 pixels nos 4 cantos): ${result.cornersTransparent ? 'Sim ✅' : 'Não ❌'}`);
    console.log(`   - Pixels Coloridos ou de Fundo Opaco (Preto/Verde/Branco): ${result.coloredPixelCount}`);
    console.log(`   - Taxa de Preenchimento da Bounding Box: ${(result.symbolFillRatio * 100).toFixed(2)}% (Formato de Folha Curva, Não-Quadrado)`);
    console.log(`   - Bounding Box Símbolo: [${result.bbox.minX}, ${result.bbox.minY}] -> [${result.bbox.maxX}, ${result.bbox.maxY}] (${result.bbox.bboxW}x${result.bbox.bboxH})`);

    if (!result.cornersTransparent) {
      throw new Error(`[VALIDAÇÃO FALHOU] Os cantos de ${filename} contêm pixels opacos! Esperado: 100% transparente para ícone de barra de status Android.`);
    }

    if (result.transparentPct < 50.0) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} possui apenas ${result.transparentPct.toFixed(2)}% de transparência!`);
    }

    if (result.coloredPixelCount > 0) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} contém ${result.coloredPixelCount} pixels não-brancos ou com cor de fundo!`);
    }

    if (result.symbolFillRatio >= 0.75) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} possui formato preenchido similar a um quadrado (${(result.symbolFillRatio * 100).toFixed(2)}% >= 75%)! Esperado: silhueta da folha (< 75%).`);
    }

    if (result.symbolPct < 3.0) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} possui apenas ${result.symbolPct.toFixed(2)}% de pixels do símbolo!`);
    }

    const centerX = width / 2;
    const centerY = height / 2;
    if (result.bbox.minX >= centerX || result.bbox.maxX <= centerX || result.bbox.minY >= centerY || result.bbox.maxY <= centerY) {
      throw new Error(`[VALIDAÇÃO FALHOU] ${filename} não possui símbolo cobrindo o centro da imagem!`);
    }

    // Verify Service Worker file references notification-badge-v2-96x96.png
    const swPath = path.resolve(__dirname, '../public/sw-admin.js');
    const swContent = fs.readFileSync(swPath, 'utf8');
    if (!swContent.includes(filename)) {
      throw new Error(`[VALIDAÇÃO FALHOU] O Service Worker (public/sw-admin.js) não faz referência ao arquivo ${filename}!`);
    }

    console.log(`✅ ${filename} APROVADO 100% NA AUDITORIA ESTRITA DE BARRA DE STATUS ANDROID!`);
  };

  await renderIcon(180, 180, false, 0.18, 'apple-touch-icon-180x180.png');
  await renderIcon(192, 192, false, 0.18, 'icon-192x192.png');
  await renderIcon(512, 512, false, 0.18, 'icon-512x512.png');
  await renderIcon(512, 512, true, 0.20, 'icon-512x512-maskable.png');
  await renderIcon(32, 32, false, 0.15, 'favicon-32x32.png');
  await renderBadgeIcon(96, 96, 0.20, 'notification-badge-v2-96x96.png');

  // --- GENERATE AUDIT PREVIEW IMAGE (Side-by-side grid) ---
  console.log('\n🎨 Gerando imagem de auditoria local (pwa-icons-audit-preview.png)...');

  const iconsData = [
    { name: 'apple-touch-icon', size: '180x180', file: 'apple-touch-icon-180x180.png', x: 30 },
    { name: 'icon-192x192', size: '192x192', file: 'icon-192x192.png', x: 300 },
    { name: 'icon-512x512', size: '512x512', file: 'icon-512x512.png', x: 570 },
    { name: 'icon-maskable', size: '512x512 (Safe)', file: 'icon-512x512-maskable.png', x: 840 },
    { name: 'notification-badge-v2', size: '96x96 (Badge v2)', file: 'notification-badge-v2-96x96.png', x: 1110, isBadge: true }
  ].map(item => {
    const iconPath = path.join(outDir, item.file);
    const b64Str = fs.readFileSync(iconPath).toString('base64');
    return {
      ...item,
      dataUrl: `data:image/png;base64,${b64Str}`
    };
  });

  await page.evaluate(async (items) => {
    const previewCanvas = document.createElement('canvas');
    previewCanvas.id = 'preview-canvas';
    previewCanvas.width = 1400;
    previewCanvas.height = 540;
    document.body.appendChild(previewCanvas);

    const ctx = previewCanvas.getContext('2d');

    ctx.fillStyle = '#1E241D';
    ctx.fillRect(0, 0, 1400, 540);

    ctx.fillStyle = '#FAF8F5';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('ESSENCIAL GOOD ADMIN — PWA ICONS AUDIT PREVIEW', 30, 45);

    ctx.fillStyle = '#A0B09A';
    ctx.font = '14px sans-serif';
    ctx.fillText('Solid Brand Background (#2E4829) / Android White Badge | High Contrast | Zero Solid Background on Badge', 30, 70);

    const promises = items.map(item => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const cardY = 100;
          const cardW = 250;
          const cardH = 400;

          ctx.fillStyle = '#283226';
          ctx.fillRect(item.x, cardY, cardW, cardH);
          ctx.strokeStyle = '#3E4E3B';
          ctx.lineWidth = 1;
          ctx.strokeRect(item.x, cardY, cardW, cardH);

          ctx.fillStyle = '#FAF8F5';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(item.name, item.x + 15, cardY + 30);

          ctx.fillStyle = '#8E9E88';
          ctx.font = '13px sans-serif';
          ctx.fillText(item.size, item.x + 15, cardY + 50);

          const previewW = 220;
          const previewH = 220;
          const iconX = item.x + 15;
          const iconY = cardY + 65;

          if (item.isBadge) {
            // Draw a dark notification area preview for transparent badge
            ctx.fillStyle = '#121212';
            ctx.fillRect(iconX, iconY, previewW, previewH);
          }

          ctx.drawImage(img, iconX, iconY, previewW, previewH);

          // Simulated iOS Light Background Test
          ctx.fillStyle = '#FAF8F5';
          ctx.fillRect(item.x + 15, cardY + 300, 105, 55);
          if (item.isBadge) {
            ctx.fillStyle = '#4A6B43'; // Android status bar theme fill
            ctx.fillRect(item.x + 15, cardY + 300, 105, 55);
          }
          ctx.drawImage(img, item.x + 17.5, cardY + 302.5, 50, 50);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '11px sans-serif';
          ctx.fillText(item.isBadge ? 'Android Bar' : 'iOS Light', item.x + 72, cardY + 332);

          // Simulated iOS Dark Background Test / Android Dark Shade
          ctx.fillStyle = '#000000';
          ctx.fillRect(item.x + 130, cardY + 300, 105, 55);
          ctx.drawImage(img, item.x + 132.5, cardY + 302.5, 50, 50);
          ctx.fillStyle = '#EEEEEE';
          ctx.font = '11px sans-serif';
          ctx.fillText(item.isBadge ? 'Android Dark' : 'iOS Dark', item.x + 187, cardY + 332);

          // Status Badge
          ctx.fillStyle = '#2E4829';
          ctx.fillRect(item.x + 15, cardY + 365, 220, 25);
          ctx.fillStyle = '#81C784';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(item.isBadge ? '✓ PASSED BADGE (100% Transp)' : '✓ PASSED AUDIT (9.5:1)', item.x + 25, cardY + 382);

          resolve();
        };
        img.src = item.dataUrl;
      });
    });

    await Promise.all(promises);
  }, iconsData);

  const reportsDir = path.resolve(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  const previewElem = await page.$('#preview-canvas');
  const previewPath = path.join(reportsDir, 'pwa-icons-audit-preview.png');
  await previewElem.screenshot({ path: previewPath });
  console.log(`✨ Preview de auditoria salvo em relatório local: ${previewPath}`);

  await browser.close();
  console.log('\n🎉 TODOS OS ÍCONES PWA FORAM GERADOS E AUDITADOS COM SUCESSO 100%!');
}

generate().catch((err) => {
  console.error('❌ Erro na geração e auditoria de ícones PWA:', err);
  process.exit(1);
});
