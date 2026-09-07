import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('./public/linfaflowpower/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const mobileStyleFix = `
<style id="lf-mobile-cta-centering-fix">
  /* Global Centering & Mobile Responsive Fix for CTA Buttons */
  .custom_lp_button,
  .add-to-cart-btn,
  .custom_checkout_button,
  .lf-spo__cta,
  .nutrition-popup__cta,
  .sticky-bar__button,
  .sticky-cta,
  .checkout_button {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    word-break: normal !important;
    line-height: 1.25 !important;
  }

  @media (max-width: 768px) {
    .custom_lp_button,
    .add-to-cart-btn,
    .custom_checkout_button,
    .lf-spo__cta,
    .nutrition-popup__cta,
    .sticky-bar__button,
    .sticky-cta,
    .checkout_button {
      font-size: 15px !important;
      padding: 14px 18px !important;
      text-align: center !important;
      justify-content: center !important;
      align-items: center !important;
      line-height: 1.25 !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
  }
</style>
`;

// Remove previous fix if present
html = html.replace(/<style id="lf-mobile-cta-centering-fix">[\s\S]*?<\/style>/gi, '');

// Insert right before </head>
html = html.replace('</head>', mobileStyleFix.trim() + '\n</head>');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully added mobile CTA button centering & style fix to index.html');
