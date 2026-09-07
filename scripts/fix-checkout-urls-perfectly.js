import fs from 'fs';
import path from 'path';

const targetCheckoutUrl = 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';

// 1. Update index.html
const htmlPath = path.resolve('./public/linfaflowpower/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace checkoutUrls in script #linfaflow-config-checkout-routing
html = html.replace(/var checkoutUrls = \{[\s\S]*?\};/, `var checkoutUrls = {
        '1': "${targetCheckoutUrl}",
        '3': "${targetCheckoutUrl}",
        '6': "${targetCheckoutUrl}"
      };`);

// Replace checkoutUrl() function in script #linfaflow-config-checkout-routing so it returns targetCheckoutUrl
html = html.replace(/function checkoutUrl\(\)\s*\{[\s\S]*?\n\s*\}/, `function checkoutUrl() {
        return "${targetCheckoutUrl}";
      }`);

// Replace all package checkout_urls in LINFAFLOW_CART_CONFIG
html = html.replace(/"checkout_url":"https:\/\/cc\.linfaflow\.com\/dtcnew\/checkout\.php[^"]*"/g, `"checkout_url":"${targetCheckoutUrl}"`);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated index.html checkout routing & LINFAFLOW_CART_CONFIG');

// 2. Update cart-details.js
const jsPath = path.resolve('./public/linfaflowpower/cart-details/cart-details.js');
if (fs.existsSync(jsPath)) {
  let js = fs.readFileSync(jsPath, 'utf8');
  
  // Replace getCheckoutUrl function to always return targetCheckoutUrl
  js = js.replace(/function getCheckoutUrl\(item\)\s*\{[\s\S]*?\}/, `function getCheckoutUrl(item) {
    return '${targetCheckoutUrl}';
  }`);

  fs.writeFileSync(jsPath, js, 'utf8');
  console.log('Successfully updated cart-details.js getCheckoutUrl function');
}
