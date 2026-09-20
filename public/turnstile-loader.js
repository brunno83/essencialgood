/**
 * ESSENCIAL GOOD - Turnstile Script Loader (Vanilla JS)
 * Carregador estático desacoplado da API JS do Cloudflare Turnstile.
 * Carrega a biblioteca de forma assíncrona, segura e sem exposição global de tokens.
 */
(function () {
  'use strict';

  if (window.__ESSENCIAL_TURNSTILE__) {
    return;
  }

  var OFFICIAL_TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  var OFFICIAL_HOSTNAME = 'challenges.cloudflare.com';
  var OFFICIAL_PATHNAME = '/turnstile/v0/api.js';
  var OFFICIAL_SEARCH = '?render=explicit';
  var ALLOWED_ACTIONS = ['create_conversation', 'submit_lead'];

  var loadPromise = null;

  function isValidTurnstileUrl(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') return false;
    try {
      var parsed = new URL(urlStr, window.location.href);
      return (
        parsed.protocol === 'https:' &&
        parsed.hostname.toLowerCase() === OFFICIAL_HOSTNAME &&
        parsed.pathname === OFFICIAL_PATHNAME &&
        parsed.search === OFFICIAL_SEARCH &&
        parsed.username === '' &&
        parsed.password === '' &&
        parsed.port === '' &&
        parsed.hash === ''
      );
    } catch (e) {
      return false;
    }
  }

  function isTurnstileScriptCandidate(scriptEl) {
    if (!scriptEl) return false;
    var src = scriptEl.getAttribute('src') || scriptEl.src || '';
    if (!src) return false;
    var lower = src.toLowerCase();
    return lower.indexOf('challenges.cloudflare.com') !== -1 || lower.indexOf('/turnstile/') !== -1;
  }

  function findExistingOfficialScript() {
    var scripts = document.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      if (isTurnstileScriptCandidate(s)) {
        var src = s.getAttribute('src') || s.src || '';
        if (!isValidTurnstileUrl(src)) {
          throw new Error('INVALID_TURNSTILE_SCRIPT_DOMAIN: Detected script with untrusted origin');
        }
        if (s.getAttribute('data-failed') === 'true') {
          if (s.parentNode) {
            s.parentNode.removeChild(s);
          }
          continue;
        }
        return s;
      }
    }
    return null;
  }

  function loadScript() {
    if (loadPromise) {
      return loadPromise;
    }

    if (window.turnstile && typeof window.turnstile.render === 'function') {
      loadPromise = Promise.resolve(window.turnstile);
      return loadPromise;
    }

    var existingScript = null;
    try {
      existingScript = findExistingOfficialScript();
    } catch (err) {
      return Promise.reject(err);
    }

    loadPromise = new Promise(function (resolve, reject) {
      var script = existingScript || document.createElement('script');
      var isNewlyCreated = !existingScript;

      if (isNewlyCreated) {
        script.src = OFFICIAL_TURNSTILE_URL;
        script.async = true;
        script.defer = true;
      }

      var cleanup = function () {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        script.onload = null;
        script.onerror = null;
      };

      var timeoutId = setTimeout(function () {
        cleanup();
        script.setAttribute('data-failed', 'true');
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        loadPromise = null;
        reject(new Error('TURNSTILE_LOAD_TIMEOUT'));
      }, 10000);

      var handleSuccess = function () {
        cleanup();
        if (window.turnstile && typeof window.turnstile.render === 'function') {
          resolve(window.turnstile);
        } else {
          var checkCount = 0;
          var interval = setInterval(function () {
            checkCount++;
            if (window.turnstile && typeof window.turnstile.render === 'function') {
              clearInterval(interval);
              resolve(window.turnstile);
            } else if (checkCount > 50) {
              clearInterval(interval);
              script.setAttribute('data-failed', 'true');
              loadPromise = null;
              reject(new Error('TURNSTILE_NOT_AVAILABLE'));
            }
          }, 100);
        }
      };

      var handleError = function () {
        cleanup();
        script.setAttribute('data-failed', 'true');
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        loadPromise = null;
        reject(new Error('TURNSTILE_LOAD_FAILED'));
      };

      script.onload = handleSuccess;
      script.onerror = handleError;

      if (isNewlyCreated) {
        (document.head || document.documentElement).appendChild(script);
      }
    });

    return loadPromise;
  }

  function isActionAllowed(action) {
    return typeof action === 'string' && ALLOWED_ACTIONS.indexOf(action.trim()) !== -1;
  }

  window.__ESSENCIAL_TURNSTILE__ = Object.freeze({
    loadScript: loadScript,
    isValidTurnstileUrl: isValidTurnstileUrl,
    isActionAllowed: isActionAllowed,
    ALLOWED_ACTIONS: ALLOWED_ACTIONS.slice()
  });
})();
