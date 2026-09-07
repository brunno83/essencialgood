import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('./public/linfaflowpower/index.html');
const cartJsPath = path.resolve('./public/linfaflowpower/cart-details/cart-details.js');
const targetCheckoutUrl = 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';

// 1. Update index.html
let html = fs.readFileSync(htmlPath, 'utf8');

// Insert <base href="/linfaflowpower/"> inside <head> if not present
if (!html.includes('<base href="/linfaflowpower/">')) {
  html = html.replace(/<head>/i, '<head>\n  <base href="/linfaflowpower/">');
  console.log('Added <base href="/linfaflowpower/"> to index.html');
}

// Update LINFAFLOW_CART_CONFIG checkout_urls
const hidParams = '&hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';

html = html.replace(/"checkout_url":"https:\/\/cc\.linfaflow\.com\/dtcnew\/checkout\.php([^"]*)"/g, (match, p1) => {
  if (p1.includes('hid=')) return match;
  return `"checkout_url":"https://cc.linfaflow.com/dtcnew/checkout.php${p1}${hidParams}"`;
});

// Update any plain checkout.php or href="#" buttons that are checkout buttons
html = html.replace(/href=["']https:\/\/cc\.linfaflow\.com\/dtcnew\/checkout\.php["']/g, `href="${targetCheckoutUrl}"`);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated public/linfaflowpower/index.html');

// 2. Update cart-details.js fallback checkout URL
if (fs.existsSync(cartJsPath)) {
  let js = fs.readFileSync(cartJsPath, 'utf8');
  js = js.replace(/:\s*['"]checkout\.php['"]/g, `: '${targetCheckoutUrl}'`);
  fs.writeFileSync(cartJsPath, js, 'utf8');
  console.log('Successfully updated public/linfaflowpower/cart-details/cart-details.js');
}
