import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('./public/linfaflowpower/index.html', 'utf8');

const targetCheckoutUrl = 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';

const hrefRegex = /href=["']([^"']*)["']/gi;
let match;
let i = 0;

console.log('=== FULL LIST OF ALL HREFS IN INDEX.HTML ===\n');

while ((match = hrefRegex.exec(html)) !== null) {
  i++;
  const url = match[1];
  const tagStart = html.lastIndexOf('<', match.index);
  const tagEnd = html.indexOf('>', match.index);
  const fullTag = html.slice(tagStart, tagEnd + 1);
  console.log(`[#${i}] href="${url}"`);
  console.log(`     Tag: ${fullTag.replace(/\s+/g, ' ')}\n`);
}
