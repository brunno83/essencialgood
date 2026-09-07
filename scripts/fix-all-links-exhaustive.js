import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('./public/linfaflowpower/index.html');
const cartJsPath = path.resolve('./public/linfaflowpower/cart-details/cart-details.js');
const targetCheckoutUrl = 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';

// 1. Update index.html
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace any href="#" on <a> tags with targetCheckoutUrl
html = html.replace(/<a\s+([^>]*?)href=["']#["']([^>]*?)>/gi, (match, p1, p2) => {
  return `<a ${p1}href="${targetCheckoutUrl}"${p2}>`;
});

// Replace any href="#product-purchase" on <a> tags with targetCheckoutUrl
html = html.replace(/<a\s+([^>]*?)href=["']#product-purchase["']([^>]*?)>/gi, (match, p1, p2) => {
  return `<a ${p1}href="${targetCheckoutUrl}"${p2}>`;
});

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated all <a> tags with href="#" or href="#product-purchase" to target checkout URL in index.html');

// 2. Update cart-details.js to guarantee immediate checkout redirection on CTA click
if (fs.existsSync(cartJsPath)) {
  let js = fs.readFileSync(cartJsPath, 'utf8');
  
  // Replace fallback checkout.php
  js = js.replace(/:\s*['"]checkout\.php['"]/g, `: '${targetCheckoutUrl}'`);

  // Ensure getCheckoutUrl function is robust
  js = js.replace(/function getCheckoutUrl\(item\)\s*\{[\s\S]*?\}/, `function getCheckoutUrl(item) {
    if (item && item.checkout_url) {
      if (!item.checkout_url.includes('hid=')) {
        return item.checkout_url + '&hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';
      }
      return item.checkout_url;
    }
    var selected = getPackageByTier(selectedTier());
    if (selected && selected.checkout_url) {
      if (!selected.checkout_url.includes('hid=')) {
        return selected.checkout_url + '&hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';
      }
      return selected.checkout_url;
    }
    return '${targetCheckoutUrl}';
  }`);

  // Handle CTA button click to redirect directly to checkout URL
  const ctaHandlerCode = `
      var checkoutButton = e.target.closest('.custom_checkout_button, .custom_checkout_button_landing_page, .custom_lp_button, .add-to-cart-btn, .lf-spo__cta, .sticky-bar__button, .nutrition-popup__cta, .sticky-cta, .checkout_button');
      if (checkoutButton) {
        var item = replaceWithSelected();
        var destUrl = getCheckoutUrl(item);
        if (destUrl) {
          window.location.href = destUrl;
        }
      }
  `;

  if (js.includes('var checkoutButton = e.target.closest')) {
    js = js.replace(/var checkoutButton = e\.target\.closest[\s\S]*?if\s*\(checkoutButton\)\s*\{[\s\S]*?\}/, ctaHandlerCode.trim());
  }

  fs.writeFileSync(cartJsPath, js, 'utf8');
  console.log('Successfully updated cart-details.js click handlers');
}
