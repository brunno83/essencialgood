/**
 * Essencial Good - PreCheckout Standalone Loader (Vanilla JS)
 * Carregador desacoplado em JS puro para captura de CTAs de checkout em páginas estáticas (ADV e Power Pages).
 * Encapsulado e independente do chat.
 */
(function () {
  'use strict';

  if (window.__ESSENCIAL_PRECHECKOUT_LOADER_INITIALIZED__) {
    return;
  }
  window.__ESSENCIAL_PRECHECKOUT_LOADER_INITIALIZED__ = true;

  var PRODUCT_CHECKOUT_HOSTS = {
    slimsoda: ['cc.slimsodapowder.com'],
    sonnus: ['cc.sonnus.com', 'cc.usesonnus.com'],
    crowned: ['cc.crownedhair.com', 'cc.usecrowned.com'],
    linfaflow: ['cc.linfaflow.com'],
    memoflow: ['cc.memoflow.com', 'cc.usememoflow.com'],
  };

  var ALLOWED_HOSTS = [
    'cc.slimsodapowder.com',
    'cc.sonnus.com',
    'cc.usesonnus.com',
    'cc.crownedhair.com',
    'cc.usecrowned.com',
    'cc.linfaflow.com',
    'cc.memoflow.com',
    'cc.usememoflow.com',
  ];

  var ALLOWED_COUNTRY_DIAL = {
    US: '+1',
    CA: '+1',
    GB: '+44',
    AU: '+61',
    NZ: '+64',
  };

  // Tag do script atual para extrair data-product e data-page-type
  var scriptTag =
    document.currentScript ||
    document.querySelector('script[data-product]') ||
    document.querySelector('script[src*="precheckout-loader.js"]');

  var configuredProduct = scriptTag ? scriptTag.getAttribute('data-product') : null;
  var configuredPageType = scriptTag ? scriptTag.getAttribute('data-page-type') : null;

  function inferProduct() {
    if (configuredProduct) return configuredProduct.toLowerCase().trim();
    var path = (window.location.pathname || '').toLowerCase();
    if (path.indexOf('slimsoda') !== -1) return 'slimsoda';
    if (path.indexOf('linfaflow') !== -1) return 'linfaflow';
    if (path.indexOf('sonnus') !== -1) return 'sonnus';
    if (path.indexOf('crowned') !== -1) return 'crowned';
    if (path.indexOf('memoflow') !== -1) return 'memoflow';
    return 'slimsoda';
  }

  function inferPageType() {
    if (configuredPageType) return configuredPageType.toLowerCase().trim();
    var path = (window.location.pathname || '').toLowerCase();
    if (path.indexOf('power') !== -1) return 'power';
    if (path.indexOf('adv') !== -1) return 'adv';
    if (path.indexOf('listicle') !== -1) return 'listicle';
    return 'adv';
  }

  function isValidCheckoutUrl(rawUrl, product, pageType) {
    if (!rawUrl || typeof rawUrl !== 'string') return false;
    try {
      var parsed = new URL(rawUrl.trim(), window.location.href);
      if (parsed.protocol !== 'https:') return false;
      if (parsed.username || parsed.password) return false;

      var host = parsed.hostname.toLowerCase();
      if (ALLOWED_HOSTS.indexOf(host) === -1) return false;

      var prod = (product || inferProduct()).toLowerCase().trim();
      var allowedHosts = PRODUCT_CHECKOUT_HOSTS[prod];
      if (!allowedHosts || allowedHosts.indexOf(host) === -1) return false;

      var page = (pageType || inferPageType()).toLowerCase().trim();
      if (prod === 'memoflow' && ['adv', 'power'].indexOf(page) === -1) return false;

      if (parsed.pathname.toLowerCase().indexOf('checkout.php') === -1) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  function extractCheckoutParams(rawUrl) {
    if (!isValidCheckoutUrl(rawUrl)) return {};
    try {
      var parsed = new URL(rawUrl.trim(), window.location.href);
      var params = parsed.searchParams;
      return {
        affid: params.get('affid') || null,
        hid: params.get('hid') || null,
        hcid: params.get('hcid') || null,
        subid: params.get('subid') || null,
        subid2: params.get('subid2') || null,
        subid3: params.get('subid3') || null,
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
        utm_content: params.get('utm_content') || null,
        utm_term: params.get('utm_term') || null,
      };
    } catch (e) {
      return {};
    }
  }

  // Configuração do Supabase via VITE vars se disponíveis ou globais da página
  var SUPABASE_URL = window.__ESSENCIAL_SUPABASE_URL__ || 'https://esyrslhvxvwjkylljfxv.supabase.co';
  var SUPABASE_ANON_KEY = window.__ESSENCIAL_SUPABASE_ANON_KEY__ || '';

  // Infraestrutura de UI do Modal Injetado no DOM
  var currentModalState = {
    isOpen: false,
    targetCheckoutUrl: null,
    metadata: null,
  };

  var modalContainerEl = null;
  var openTime = 0;
  var hasNavigated = false;

  function safeRedirect(targetUrl) {
    if (hasNavigated) return;
    hasNavigated = true;
    try {
      if (window.top) {
        window.top.location.assign(targetUrl);
      } else {
        window.location.href = targetUrl;
      }
    } catch (e) {
      window.location.href = targetUrl;
    }
  }

  function injectModalStyles() {
    if (document.getElementById('eg-precheckout-loader-css')) return;
    var style = document.createElement('style');
    style.id = 'eg-precheckout-loader-css';
    style.textContent = `
      .eg-precheckout-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        width: 100vw; height: 100dvh; background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999999 !important; padding: 16px; box-sizing: border-box;
      }
      .eg-precheckout-modal {
        background: #FFFFFF; width: 100%; max-width: 440px; border-radius: 20px;
        border: 2px solid #4B6833; padding: 24px; box-shadow: 0 24px 48px rgba(0,0,0,0.25);
        display: flex; flex-direction: column; gap: 16px; max-height: calc(100dvh - 32px);
        overflow-y: auto; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .eg-precheckout-header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 14px; }
      .eg-precheckout-title { margin: 0; font-size: 18px; font-weight: 800; color: #1E293B; }
      .eg-precheckout-subtitle { margin: 4px 0 0 0; font-size: 13px; color: #64748B; }
      .eg-precheckout-close-btn { background: transparent; border: none; color: #64748B; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: bold; }
      .eg-precheckout-close-btn:hover { background: #F1F5F9; color: #0F172A; }
      .eg-precheckout-form { display: flex; flex-direction: column; gap: 14px; }
      .eg-precheckout-field { display: flex; flex-direction: column; gap: 6px; }
      .eg-precheckout-label { font-size: 13px; font-weight: 700; color: #334155; }
      .eg-precheckout-input { width: 100%; padding: 11px 13px; background: #FFF; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px; color: #1E293B; box-sizing: border-box; }
      .eg-precheckout-input:focus { border-color: #4B6833; outline: none; box-shadow: 0 0 0 3px rgba(75,104,51,0.2); }
      .eg-precheckout-phone-row { display: flex; gap: 8px; }
      .eg-precheckout-country-select { width: 96px; flex-shrink: 0; padding: 11px 8px; background: #FFF; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 13px; color: #1E293B; cursor: pointer; }
      .eg-precheckout-hp { display: none !important; visibility: hidden !important; }
      .eg-precheckout-consent { display: flex; align-items: flex-start; gap: 10px; background: #F8FAFC; padding: 12px; border-radius: 8px; border: 1px solid #E2E8F0; font-size: 12px; color: #475569; }
      .eg-precheckout-consent input { width: 18px; height: 18px; accent-color: #4B6833; flex-shrink: 0; cursor: pointer; }
      .eg-precheckout-submit-btn { width: 100%; padding: 14px; background: #4B6833; color: #FFF; border: none; border-radius: 10px; font-size: 15px; font-weight: 800; cursor: pointer; }
      .eg-precheckout-submit-btn:hover:not(:disabled) { background: #3B5228; }
      .eg-precheckout-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
      .eg-precheckout-error { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 10px 14px; color: #991B1B; font-size: 12.5px; }
    `;
    document.head.appendChild(style);
  }

  function closeModal() {
    currentModalState.isOpen = false;
    currentModalState.targetCheckoutUrl = null;
    currentModalState.metadata = null;
    if (modalContainerEl && modalContainerEl.parentNode) {
      modalContainerEl.parentNode.removeChild(modalContainerEl);
      modalContainerEl = null;
    }
  }

  function openModal(rawUrl, metadata) {
    if (window.parent && window.parent !== window && window.parent.EssencialPreCheckout && typeof window.parent.EssencialPreCheckout.open === 'function') {
      return window.parent.EssencialPreCheckout.open(rawUrl, metadata);
    }

    var meta = metadata || {};
    var product = meta.product || inferProduct();
    var pageType = meta.pageType || inferPageType();

    if (!isValidCheckoutUrl(rawUrl, product, pageType)) {
      console.warn('[PreCheckoutLoader] Rejected open attempt: URL or product matrix is invalid', rawUrl, product, pageType);
      return false;
    }

    injectModalStyles();
    closeModal();

    currentModalState.isOpen = true;
    currentModalState.targetCheckoutUrl = rawUrl;
    currentModalState.metadata = { product: product, pageType: pageType, offer: meta.offer };
    openTime = Date.now();
    hasNavigated = false;

    var displayProduct = product.toUpperCase();

    modalContainerEl = document.createElement('div');
    modalContainerEl.id = 'eg-precheckout-standalone-root';
    modalContainerEl.innerHTML = `
      <div class="eg-precheckout-overlay" id="eg-precheckout-overlay-bg">
        <div class="eg-precheckout-modal" role="dialog" aria-modal="true">
          <div class="eg-precheckout-header">
            <div>
              <h2 class="eg-precheckout-title">Complete Your Details</h2>
              <p class="eg-precheckout-subtitle">Enter your details to proceed to secure checkout for ${displayProduct}.</p>
            </div>
            <button type="button" class="eg-precheckout-close-btn" id="eg-precheckout-close-btn" aria-label="Close">✕</button>
          </div>

          <form class="eg-precheckout-form" id="eg-precheckout-form-el">
            <div class="eg-precheckout-error" id="eg-precheckout-error-banner" style="display:none;"></div>
            
            <input type="text" name="website_url_hp" class="eg-precheckout-hp" id="eg-precheckout-hp-input" />

            <div class="eg-precheckout-field">
              <label class="eg-precheckout-label" for="eg-input-name">Full Name *</label>
              <input type="text" id="eg-input-name" class="eg-precheckout-input" placeholder="Your full name" required />
            </div>

            <div class="eg-precheckout-field">
              <label class="eg-precheckout-label" for="eg-input-email">Email Address *</label>
              <input type="email" id="eg-input-email" class="eg-precheckout-input" placeholder="you@example.com" required />
            </div>

            <div class="eg-precheckout-field">
              <label class="eg-precheckout-label" for="eg-input-phone">Phone Number *</label>
              <div class="eg-precheckout-phone-row">
                <select id="eg-input-country" class="eg-precheckout-country-select">
                  <option value="US" data-dial="+1">🇺🇸 +1</option>
                  <option value="CA" data-dial="+1">🇨🇦 +1</option>
                  <option value="GB" data-dial="+44">🇬🇧 +44</option>
                  <option value="AU" data-dial="+61">🇦🇺 +61</option>
                  <option value="NZ" data-dial="+64">🇳🇿 +64</option>
                </select>
                <input type="tel" id="eg-input-phone" class="eg-precheckout-input" placeholder="4155552671" required style="flex:1;" />
              </div>
            </div>

            <label class="eg-precheckout-consent">
              <input type="checkbox" id="eg-input-consent" checked required />
              <span>I agree to receive order updates, support assistance and exclusive offers.</span>
            </label>

            <button type="submit" class="eg-precheckout-submit-btn" id="eg-precheckout-submit-btn">
              CONTINUE TO SECURE CHECKOUT →
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainerEl);

    var closeBtn = document.getElementById('eg-precheckout-close-btn');
    var overlayBg = document.getElementById('eg-precheckout-overlay-bg');
    var formEl = document.getElementById('eg-precheckout-form-el');
    var nameInput = document.getElementById('eg-input-name');

    if (nameInput) nameInput.focus();

    if (closeBtn) {
      closeBtn.onclick = function () { closeModal(); };
    }
    if (overlayBg) {
      overlayBg.onclick = function (e) {
        if (e.target === overlayBg) closeModal();
      };
    }

    if (formEl) {
      formEl.onsubmit = function (e) {
        e.preventDefault();
        var submitBtn = document.getElementById('eg-precheckout-submit-btn');
        var errBanner = document.getElementById('eg-precheckout-error-banner');
        var hpInput = document.getElementById('eg-precheckout-hp-input');
        var nameVal = document.getElementById('eg-input-name').value.trim();
        var emailVal = document.getElementById('eg-input-email').value.trim();
        var rawPhoneVal = document.getElementById('eg-input-phone').value.trim();
        var countrySelect = document.getElementById('eg-input-country');
        var consentVal = document.getElementById('eg-input-consent').checked;

        if (hpInput && hpInput.value.trim() !== '') {
          safeRedirect(currentModalState.targetCheckoutUrl);
          return;
        }

        if (Date.now() - openTime < 800) {
          safeRedirect(currentModalState.targetCheckoutUrl);
          return;
        }

        var countryCode = countrySelect ? countrySelect.value : 'US';
        var dialCode = ALLOWED_COUNTRY_DIAL[countryCode] || '+1';

        var phoneDigits = rawPhoneVal.replace(/\D/g, '');
        var cleanDial = dialCode.replace(/\D/g, '');
        if (phoneDigits.indexOf(cleanDial) === 0) {
          phoneDigits = phoneDigits.slice(cleanDial.length);
        }
        if (phoneDigits.indexOf('0') === 0) {
          phoneDigits = phoneDigits.slice(1);
        }
        var formattedE164 = dialCode + phoneDigits;

        if (!nameVal || nameVal.length < 2 || nameVal.length > 120 || /[<>]/.test(nameVal)) {
          if (errBanner) {
            errBanner.style.display = 'block';
            errBanner.textContent = 'Please enter a valid name (2-120 characters, no HTML).';
          }
          return;
        }

        if (!emailVal || emailVal.length > 150 || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(emailVal)) {
          if (errBanner) {
            errBanner.style.display = 'block';
            errBanner.textContent = 'Please enter a valid email address.';
          }
          return;
        }

        if (!rawPhoneVal || !/^[+][1-9][0-9]{7,14}$/.test(formattedE164)) {
          if (errBanner) {
            errBanner.style.display = 'block';
            errBanner.textContent = 'Please enter a valid phone number.';
          }
          return;
        }

        if (!consentVal) {
          if (errBanner) {
            errBanner.style.display = 'block';
            errBanner.textContent = 'You must agree to continue to checkout.';
          }
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Connecting to Checkout...';
        }

        var params = extractCheckoutParams(currentModalState.targetCheckoutUrl);
        var payload = {
          p_name: nameVal,
          p_email: emailVal.toLowerCase(),
          p_phone: formattedE164,
          p_country_code: countryCode,
          p_dial_code: dialCode,
          p_product: currentModalState.metadata.product || inferProduct(),
          p_page_type: currentModalState.metadata.pageType || inferPageType(),
          p_consent_given: true,
          p_offer: currentModalState.metadata.offer || null,
          p_page_title: document.title ? document.title.slice(0, 300) : null,
          p_source_url: window.location.href ? window.location.href.slice(0, 2048) : null,
          p_source_path: window.location.pathname ? window.location.pathname.slice(0, 1024) : null,
          p_checkout_url: currentModalState.targetCheckoutUrl,
          p_affid: params.affid,
          p_hid: params.hid,
          p_hcid: params.hcid,
          p_subid: params.subid,
          p_subid2: params.subid2,
          p_subid3: params.subid3,
          p_utm_source: params.utm_source,
          p_utm_medium: params.utm_medium,
          p_utm_campaign: params.utm_campaign,
          p_utm_content: params.utm_content,
          p_utm_term: params.utm_term,
          p_referrer: document.referrer ? document.referrer.slice(0, 1024) : null,
        };

        var fallbackTimer = setTimeout(function () {
          safeRedirect(currentModalState.targetCheckoutUrl);
        }, 2500);

        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
          fetch(SUPABASE_URL + '/rest/v1/rpc/save_checkout_lead', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
            },
            body: JSON.stringify(payload),
          })
            .then(function () {
              clearTimeout(fallbackTimer);
              safeRedirect(currentModalState.targetCheckoutUrl);
            })
            .catch(function () {
              clearTimeout(fallbackTimer);
              safeRedirect(currentModalState.targetCheckoutUrl);
            });
        } else {
          clearTimeout(fallbackTimer);
          safeRedirect(currentModalState.targetCheckoutUrl);
        }
      };
    }
  }

  // API Global Controlada
  window.EssencialPreCheckout = {
    open: function (rawUrl, metadata) {
      return openModal(rawUrl, metadata);
    },
    close: function () {
      closeModal();
    },
  };

  // Delegador de Cliques na Fase de Captura (Capture Phase)
  document.addEventListener(
    'click',
    function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      var link = e.target.closest ? e.target.closest('a[href]') : null;
      if (!link) return;

      var rawHref = link.href;
      var prod = inferProduct();
      var page = inferPageType();
      if (isValidCheckoutUrl(rawHref, prod, page)) {
        e.preventDefault();
        e.stopPropagation();

        var offer = link.getAttribute('data-offer') || link.getAttribute('data-bundle') || null;
        openModal(rawHref, {
          product: prod,
          pageType: page,
          offer: offer,
        });
      }
    },
    true
  );
})();
