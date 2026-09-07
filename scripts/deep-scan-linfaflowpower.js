import fs from 'fs';
import path from 'path';

const basePath = path.resolve('./public/linfaflowpower');
const targetCheckoutUrl = 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';
const requiredHid = 'hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx';
const requiredAffid = 'affid=aff1982814';

console.log('==================================================');
console.log('      DEEP AUDIT FOR LINFAFLOWPOWER LINKS        ');
console.log('==================================================\n');

// 1. Audit index.html
const htmlPath = path.join(basePath, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('--- 1. AUDITING INDEX.HTML ---');

// Search for all href attributes
const hrefRegex = /href=["']([^"']*)["']/gi;
let match;
let count = 0;
const hrefs = [];

while ((match = hrefRegex.exec(html)) !== null) {
  count++;
  hrefs.push({ index: count, url: match[1], fullMatch: match[0] });
}

console.log(`Found ${hrefs.length} total 'href' attributes in index.html:\n`);

hrefs.forEach(item => {
  const u = item.url;
  const isCheckout = u.includes('checkout.php') || u.includes('linfaflow.com/dtcnew');
  const isExternal = u.startsWith('http');
  const isHash = u.startsWith('#');
  
  if (isCheckout) {
    const hasHid = u.includes(requiredHid);
    const hasAffid = u.includes(requiredAffid);
    const status = (hasHid && hasAffid) ? '✅ OK (Has hid & affid)' : '❌ MISSING hid or affid!';
    console.log(`[#${item.index}] CHECKOUT LINK: ${u}\n    Status: ${status}`);
  } else if (isHash) {
    console.log(`[#${item.index}] HASH/ANCHOR LINK: ${u}`);
  } else if (isExternal) {
    console.log(`[#${item.index}] EXTERNAL LINK: ${u}`);
  } else {
    console.log(`[#${item.index}] RELATIVE/OTHER LINK: ${u}`);
  }
});

// Search for inline onclick attributes or data-url in HTML
console.log('\n--- 2. AUDITING ONCLICK / DATA-HREF / DATA-URL IN INDEX.HTML ---');
const inlineEventRegex = /(?:onclick|data-href|data-url|data-checkout)=["']([^"']*)["']/gi;
let eventMatch;
let eventCount = 0;
while ((eventMatch = inlineEventRegex.exec(html)) !== null) {
  eventCount++;
  console.log(`[Event #${eventCount}] ${eventMatch[0]}`);
}
if (eventCount === 0) {
  console.log('No inline onclick/data-checkout attributes found.');
}

// Search for JS script blocks in HTML referencing checkout or location
console.log('\n--- 3. AUDITING SCRIPT BLOCKS IN INDEX.HTML ---');
const scriptRegex = /<script[\s\S]*?<\/script>/gi;
let scriptMatch;
let scriptCount = 0;
while ((scriptMatch = scriptRegex.exec(html)) !== null) {
  scriptCount++;
  const scriptContent = scriptMatch[0];
  if (scriptContent.includes('checkout') || scriptContent.includes('location') || scriptContent.includes('cart')) {
    console.log(`[Script #${scriptCount}] References checkout/cart/location!`);
    // Print snippet
    const lines = scriptContent.split('\n').filter(l => l.includes('checkout') || l.includes('location') || l.includes('LINFAFLOW_CART_CONFIG'));
    lines.forEach(l => console.log('    ->', l.trim()));
  }
}

// 2. Audit JS Files
console.log('\n--- 4. AUDITING JS FILES IN PUBLIC/LINFAFLOWPOWER/ ---');

function scanJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanJsFiles(full);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const code = fs.readFileSync(full, 'utf8');
      if (code.includes('checkout') || code.includes('location.href') || code.includes('window.open')) {
        console.log(`\nJS File: ${path.relative(basePath, full)}`);
        const lines = code.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('checkout') || line.includes('location.href') || line.includes('window.open')) {
            console.log(` Line ${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

scanJsFiles(basePath);

console.log('\n==================================================');
console.log('              AUDIT COMPLETED                    ');
console.log('==================================================');
