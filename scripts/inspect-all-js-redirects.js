import fs from 'fs';
import path from 'path';

const files = [
  './public/linfaflowpower/assets/js/custom_header.js',
  './public/linfaflowpower/assets/js/lp_pdp.js',
  './public/linfaflowpower/assets/js/tracking.js',
  './public/linfaflowpower/cart-details/cart-details.js',
  './public/linfaflowpower/index.html'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    console.log(`\n========================================`);
    console.log(`FILE: ${f}`);
    console.log(`========================================`);
    const code = fs.readFileSync(f, 'utf8');
    const lines = code.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('checkout') || line.includes('location') || line.includes('popstate') || line.includes('pushState') || line.includes('href') && (line.includes('http') || line.includes('php'))) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
