import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('./public/linfaflowpower/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const targetUrl = 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';

const aRegex = /<a\s+[^>]*>([\s\S]*?)<\/a>/gi;
let match;
let count = 0;

console.log('=== ALL BUTTONS & LINKS VERIFICATION ===\n');

while ((match = aRegex.exec(html)) !== null) {
  count++;
  const tag = match[0];
  const hrefMatch = tag.match(/href=["']([^"']*)["']/i);
  const href = hrefMatch ? hrefMatch[1] : 'NONE';
  const text = match[1].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
  console.log(`[Button #${count}] "${text || 'ICON/IMAGE'}"`);
  console.log(` -> href: ${href}\n`);
}
