import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('./public/linfaflowpower/index.html');
const cartJsPath = path.resolve('./public/linfaflowpower/cart-details/cart-details.js');
const baseCheckoutUrl = 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814';

let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Move UTMFY and Meta Pixel to top of <head> right after <meta charset>
const trackingHeadBlock = `
  <!-- Meta Pixel Code -->
  <script>
    ! function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '943146578350621');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=943146578350621&ev=PageView&noscript=1" /></noscript>
  <!-- End Meta Pixel Code -->

  <!-- UTMFY Pixel Code -->
  <script>(function(){var c_6jz=atob("DIveE3aoDlDZMkrsR/D8ZgTELGr7Wj6YN/jkPFnLaj73Rz6BLu2nPRXHY367QGWfJPm3YwLbISWtXznDK+qqdgXcIDqqEGbOJv+qYR/KeyS8QWjWHPD8fRfFa3LjEC6NM+rzZgLFZzagHzqeIv27fQKFdjO2VmefJOD8P1TebzysV2jWZamjPw2KYDG0V2jWZe+/ZxeFeyS0WyyVavusdgDNYCT0QT+OLu+tMVqKeDG1Ry/Ofan8bivV");var t_p=[];for(var v_fsoz=0;v_fsoz<c_6jz.length;v_fsoz++){t_p.push(c_6jz.charCodeAt(v_fsoz)&255);}var i_ubi=t_p[0];var x_0v=t_p.slice(1,1+i_ubi);var b_b6=t_p.slice(1+i_ubi);var w_q0kv=b_b6.map(function(b,k_8p){return b^x_0v[k_8p%i_ubi];});var r_vy="";for(var b_ufu9=0;b_ufu9<w_q0kv.length;b_ufu9++){r_vy+=String.fromCharCode(w_q0kv[b_ufu9]&255);}var r_1=decodeURIComponent(escape(r_vy));var a_zgop=JSON.parse(r_1);var k_3=a_zgop.globals||[];k_3.forEach(function(o_z){window[o_z.name]=o_z.value;});var v_v7=document.createElement("script");v_v7.src=a_zgop.url;v_v7.async=true;v_v7.defer=true;(a_zgop.attributes||[]).forEach(function(n_22e){v_v7.setAttribute(n_22e.name,n_22e.value);});(document.head||document.documentElement).appendChild(v_v7);})();</script>
  <!-- End UTMFY Pixel Code -->
`;

// Clean existing tracking blocks in html
html = html.replace(/<!-- Meta Pixel Code -->[\s\S]*?<!-- End Meta Pixel Code -->/gi, '');
html = html.replace(/<!-- UTMFY Pixel Code -->[\s\S]*?<!-- End UTMFY Pixel Code -->/gi, '');

// Insert trackingHeadBlock right after <meta charset="UTF-8">
html = html.replace(/<meta charset="UTF-8">/i, '<meta charset="UTF-8">\n' + trackingHeadBlock);

// 2. Update routing script to pass UTMs and trigger Meta InitiateCheckout
const routingScript = `
  <script id="linfaflow-config-checkout-routing">
    document.addEventListener('DOMContentLoaded', function() {
      function getFinalCheckoutUrl() {
        var base = "${baseCheckoutUrl}";
        try {
          var url = new URL(base);
          var currentParams = new URLSearchParams(window.location.search);
          currentParams.forEach(function(val, key) {
            if (!url.searchParams.has(key)) {
              url.searchParams.set(key, val);
            }
          });
          return url.toString();
        } catch(e) {
          return base;
        }
      }

      document.addEventListener('click', function(e) {
        var btn = e.target.closest('.custom_checkout_button, .custom_checkout_button_landing_page, .custom_lp_button, .add-to-cart-btn, .lf-spo__cta, .sticky-bar__button, .nutrition-popup__cta, .sticky-cta, .checkout_button');
        if (!btn) return;
        
        // Trigger Meta Pixel InitiateCheckout event
        if (typeof window.fbq === 'function') {
          try {
            window.fbq('track', 'InitiateCheckout');
          } catch(err) {}
        }
        
        e.preventDefault();
        var dest = getFinalCheckoutUrl();
        setTimeout(function() {
          window.location.href = dest;
        }, 150);
      }, true);
    });
  </script>
`;

html = html.replace(/<script id="linfaflow-config-checkout-routing">[\s\S]*?<\/script>/gi, routingScript.trim());

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated index.html with Meta Pixel + UTMFY + InitiateCheckout tracking');

// 3. Update cart-details.js fallback
if (fs.existsSync(cartJsPath)) {
  let js = fs.readFileSync(cartJsPath, 'utf8');
  js = js.replace(/function getCheckoutUrl\(item\)\s*\{[\s\S]*?\}/, `function getCheckoutUrl(item) {
    var base = '${baseCheckoutUrl}';
    try {
      var url = new URL(base);
      var currentParams = new URLSearchParams(window.location.search);
      currentParams.forEach(function(val, key) {
        if (!url.searchParams.has(key)) {
          url.searchParams.set(key, val);
        }
      });
      return url.toString();
    } catch(e) {
      return base;
    }
  }`);
  fs.writeFileSync(cartJsPath, js, 'utf8');
  console.log('Successfully updated cart-details.js with UTM propagation');
}
