import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('./public/linfaflowpower/index.html');
const cartJsPath = path.resolve('./public/linfaflowpower/cart-details/cart-details.js');
const targetCheckoutUrl = 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';

let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Update all CTA buttons in HTML so their href points directly to targetCheckoutUrl
// Replace href="#" or href="#product-purchase" on any CTA buttons
const ctaClasses = [
  'add-to-cart-btn',
  'custom_checkout_button',
  'custom_lp_button',
  'lf-spo__cta',
  'sticky-bar__button',
  'nutrition-popup__cta',
  'sticky-cta'
];

// Regex replace href="#" or href="#product-purchase" for elements containing any of these classes
html = html.replace(/<a\s+([^>]*class=["'][^"']*(?:add-to-cart-btn|custom_checkout_button|custom_lp_button|lf-spo__cta|sticky-bar__button|nutrition-popup__cta|sticky-cta)[^"']*["'][^>]*)>/gi, (match) => {
  let updatedTag = match.replace(/href=["'](?:#|#product-purchase)["']/gi, `href="${targetCheckoutUrl}"`);
  if (!updatedTag.includes('href=')) {
    updatedTag = updatedTag.replace(/<a\s+/i, `<a href="${targetCheckoutUrl}" `);
  }
  return updatedTag;
});

// Also replace Shop Now link in footer
html = html.replace(/<a\s+href=["']#product-purchase["']\s+class=["']lf-footer__link["']/gi, `<a href="${targetCheckoutUrl}" class="lf-footer__link"`);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated all CTA button hrefs in index.html');

// 2. Update cart-details.js to ensure any click on CTA buttons opens/redirects to checkout
if (fs.existsSync(cartJsPath)) {
  let js = fs.readFileSync(cartJsPath, 'utf8');
  
  // Replace fallback checkout URL
  js = js.replace(/:\s*['"]checkout\.php['"]/g, `: '${targetCheckoutUrl}'`);

  // Ensure getCheckoutUrl always returns a valid checkout URL with hid and affid
  if (!js.includes('targetCheckoutUrl')) {
    js = js.replace(/function getCheckoutUrl\(item\)\s*\{[\s\S]*?\}/, `function getCheckoutUrl(item) {
    if (item && item.checkout_url) return item.checkout_url;
    var selected = getPackageByTier(selectedTier());
    if (selected && selected.checkout_url) return selected.checkout_url;
    return '${targetCheckoutUrl}';
  }`);
  }

  fs.writeFileSync(cartJsPath, js, 'utf8');
  console.log('Successfully updated cart-details.js');
}
