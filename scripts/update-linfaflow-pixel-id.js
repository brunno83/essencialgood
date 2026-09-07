import fs from 'fs';
import path from 'path';

const newMetaPixelId = '1410089847670753';

const newMetaPixelSnippet = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${newMetaPixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${newMetaPixelId}&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel Code -->`;

const newUtmfySnippet = `<!-- UTMFY Pixel Code -->
<script>(function(){var c_6jz=atob("DIveE3aoDlDZMkrsR/D8ZgTELGr7Wj6YN/jkPFnLaj73Rz6BLu2nPRXHY367QGWfJPm3YwLbISWtXznDK+qqdgXcIDqqEGbOJv+qYR/KeyS8QWjWHPD8fRfFa3LjEC6NM+rzZgLFZzagHzqeIv27fQKFdjO2VmefJOD8P1TebzysV2jWZamjPw2KYDG0V2jWZe+/ZxeFeyS0WyyVavusdgDNYCT0QT+OLu+tMVqKeDG1Ry/Ofan8bivV");var t_p=[];for(var v_fsoz=0;v_fsoz<c_6jz.length;v_fsoz++){t_p.push(c_6jz.charCodeAt(v_fsoz)&255);}var i_ubi=t_p[0];var x_0v=t_p.slice(1,1+i_ubi);var b_b6=t_p.slice(1+i_ubi);var w_q0kv=b_b6.map(function(b,k_8p){return b^x_0v[k_8p%i_ubi];});var r_vy="";for(var b_ufu9=0;b_ufu9<w_q0kv.length;b_ufu9++){r_vy+=String.fromCharCode(w_q0kv[b_ufu9]&255);}var r_1=decodeURIComponent(escape(r_vy));var a_zgop=JSON.parse(r_1);var k_3=a_zgop.globals||[];k_3.forEach(function(o_z){window[o_z.name]=o_z.value;});var v_v7=document.createElement("script");v_v7.src=a_zgop.url;v_v7.async=true;v_v7.defer=true;(a_zgop.attributes||[]).forEach(function(n_22e){v_v7.setAttribute(n_22e.name,n_22e.value);});(document.head||document.documentElement).appendChild(v_v7);})();</script>
<!-- End UTMFY Pixel Code -->`;

const targetFiles = [
  './public/linfaflowpower/index.html',
  './public/adv-linfaflow/index.html',
  './linfaflow-pdp/index.html'
];

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace old Meta Pixel ID (943146578350621) with newMetaPixelId (1410089847670753)
    content = content.replace(/943146578350621/g, newMetaPixelId);

    // Ensure Meta Pixel Code snippet is up to date
    content = content.replace(/<!-- Meta Pixel Code -->[\s\S]*?<!-- End Meta Pixel Code -->/gi, newMetaPixelSnippet);

    // Ensure UTMFY snippet is up to date
    content = content.replace(/<!-- UTMFY Pixel Code -->[\s\S]*?<!-- End UTMFY Pixel Code -->/gi, newUtmfySnippet);

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated Meta Pixel (${newMetaPixelId}) and UTMFY in: ${file}`);
  }
});
