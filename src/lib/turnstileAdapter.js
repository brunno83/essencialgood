// ESSENCIAL GOOD - CLOUDFLARE TURNSTILE ADAPTER MODULE
// Manages Cloudflare Turnstile script readiness, widget lifecycle, token acquisition, accessibility, and zero-leak cleanup.

import { validateEnvConfig, isPlaceholderValue, isDummyTurnstileSiteKey } from './envGuard.js';

export const MIN_TIMEOUT_MS = 1000;
export const MAX_TIMEOUT_MS = 120000;
export const DEFAULT_TIMEOUT_MS = 15000;
const ALLOWED_ACTIONS = ['create_conversation', 'submit_lead'];

let globalScriptPromise = null;

function validateTimeoutMs(timeoutMs) {
  if (typeof timeoutMs === 'undefined' || timeoutMs === null) {
    return DEFAULT_TIMEOUT_MS;
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < MIN_TIMEOUT_MS || timeoutMs > MAX_TIMEOUT_MS) {
    throw new Error(`INVALID_TURNSTILE_TIMEOUT: timeoutMs must be an integer between ${MIN_TIMEOUT_MS} and ${MAX_TIMEOUT_MS}`);
  }
  return timeoutMs;
}

function getValidatedSiteKey() {
  const envConfig = validateEnvConfig(import.meta.env || process.env);
  const siteKey = envConfig.turnstileSiteKey;

  if (!siteKey || isPlaceholderValue(siteKey)) {
    throw new Error('TURNSTILE_SITE_KEY_INVALID: Turnstile site key is missing or unconfigured');
  }

  if (envConfig.isProduction && isDummyTurnstileSiteKey(siteKey)) {
    throw new Error('TURNSTILE_PRODUCTION_DUMMY_KEY: Production environment cannot use dummy Turnstile site key');
  }

  return siteKey;
}

export function isActionAllowed(action) {
  return typeof action === 'string' && ALLOWED_ACTIONS.includes(action.trim());
}

export async function ensureTurnstileReady() {
  if (typeof window === 'undefined') {
    throw new Error('TURNSTILE_BROWSER_ONLY: Turnstile can only be initialized in browser environment');
  }

  if (window.turnstile && typeof window.turnstile.render === 'function') {
    return window.turnstile;
  }

  if (globalScriptPromise) {
    return globalScriptPromise;
  }

  globalScriptPromise = new Promise((resolve, reject) => {
    // 1. Tentar utilizar o carregador estático global se já injetado
    if (window.__ESSENCIAL_TURNSTILE__ && typeof window.__ESSENCIAL_TURNSTILE__.loadScript === 'function') {
      window.__ESSENCIAL_TURNSTILE__.loadScript()
        .then(resolve)
        .catch((err) => {
          globalScriptPromise = null;
          reject(err);
        });
      return;
    }

    // 2. Carregar public/turnstile-loader.js dinamicamente se ainda não estiver presente no DOM
    const loaderScript = document.createElement('script');
    loaderScript.src = '/turnstile-loader.js';
    loaderScript.async = true;

    const timeoutId = setTimeout(() => {
      if (loaderScript.parentNode) loaderScript.parentNode.removeChild(loaderScript);
      globalScriptPromise = null;
      reject(new Error('TURNSTILE_LOADER_TIMEOUT'));
    }, DEFAULT_TIMEOUT_MS);

    loaderScript.onload = () => {
      clearTimeout(timeoutId);
      if (window.__ESSENCIAL_TURNSTILE__ && typeof window.__ESSENCIAL_TURNSTILE__.loadScript === 'function') {
        window.__ESSENCIAL_TURNSTILE__.loadScript()
          .then(resolve)
          .catch((err) => {
            globalScriptPromise = null;
            reject(err);
          });
      } else if (window.turnstile && typeof window.turnstile.render === 'function') {
        resolve(window.turnstile);
      } else {
        globalScriptPromise = null;
        reject(new Error('TURNSTILE_LOADER_NOT_AVAILABLE'));
      }
    };

    loaderScript.onerror = () => {
      clearTimeout(timeoutId);
      if (loaderScript.parentNode) loaderScript.parentNode.removeChild(loaderScript);
      globalScriptPromise = null;
      reject(new Error('TURNSTILE_LOADER_FAILED'));
    };

    (document.head || document.documentElement).appendChild(loaderScript);
  });

  return globalScriptPromise;
}

export function requestTurnstileToken(action, options = {}) {
  const {
    container = null,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal = null,
    theme = 'auto',
    size = 'normal',
  } = options;

  if (!action || typeof action !== 'string' || action !== action.trim() || !isActionAllowed(action)) {
    return Promise.reject(
      new Error(`INVALID_TURNSTILE_ACTION: Action must be one of [${ALLOWED_ACTIONS.join(', ')}]`)
    );
  }

  let validTimeout;
  try {
    validTimeout = validateTimeoutMs(timeoutMs);
  } catch (err) {
    return Promise.reject(err);
  }

  let siteKey;
  try {
    siteKey = getValidatedSiteKey();
  } catch (err) {
    return Promise.reject(err);
  }

  const cleanAction = action.trim();

  return new Promise((resolve, reject) => {
    let activeTurnstile = null;
    let widgetId = null;
    let tempContainerCreated = false;
    let targetContainer = container;
    let isSettled = false;
    let isCleanedUp = false;
    let timeoutTimer = null;
    let onSignalAbort = null;

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;

      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
        timeoutTimer = null;
      }

      if (signal && onSignalAbort) {
        signal.removeEventListener('abort', onSignalAbort);
        onSignalAbort = null;
      }

      const turnstileImpl = activeTurnstile || (typeof window !== 'undefined' ? window.turnstile : null);
      if (widgetId !== null && turnstileImpl && typeof turnstileImpl.remove === 'function') {
        try {
          turnstileImpl.remove(widgetId);
        } catch (_) {}
        widgetId = null;
      }

      if (tempContainerCreated && targetContainer && targetContainer.parentNode) {
        try {
          targetContainer.parentNode.removeChild(targetContainer);
        } catch (_) {}
        targetContainer = null;
      }
    };

    const safeReject = (err) => {
      if (isSettled) return;
      isSettled = true;
      cleanup();
      reject(err);
    };

    const safeResolve = (token) => {
      if (isSettled) return;
      isSettled = true;
      cleanup();
      resolve(token);
    };

    if (signal) {
      if (signal.aborted) {
        safeReject(new Error('TURNSTILE_ABORTED'));
        return;
      }
      onSignalAbort = () => {
        safeReject(new Error('TURNSTILE_ABORTED'));
      };
      signal.addEventListener('abort', onSignalAbort, { once: true });
    }

    timeoutTimer = setTimeout(() => {
      safeReject(new Error('TURNSTILE_TIMEOUT'));
    }, validTimeout);

    ensureTurnstileReady()
      .then((turnstile) => {
        if (isSettled) return;
        activeTurnstile = turnstile;

        if (!targetContainer) {
          targetContainer = document.createElement('div');
          targetContainer.id = `eg-turnstile-temp-${Math.random().toString(36).slice(2, 9)}`;
          targetContainer.setAttribute('role', 'region');
          targetContainer.setAttribute('aria-label', 'Security Check');
          targetContainer.style.position = 'relative';
          targetContainer.style.zIndex = '9999';
          targetContainer.style.margin = '8px 0';
          (document.body || document.documentElement).appendChild(targetContainer);
          tempContainerCreated = true;
        }

        try {
          widgetId = turnstile.render(targetContainer, {
            sitekey: siteKey,
            action: cleanAction,
            theme,
            size,
            'response-field': false, // Impede a inserção de token em textarea oculto no DOM
            callback: (token) => {
              if (isSettled) return;
              if (!token || typeof token !== 'string' || token.trim().length === 0) {
                safeReject(new Error('TURNSTILE_EMPTY_TOKEN'));
              } else {
                safeResolve(token.trim());
              }
            },
            'error-callback': () => {
              if (isSettled) return;
              safeReject(new Error('TURNSTILE_VERIFICATION_FAILED'));
            },
            'expired-callback': () => {
              if (isSettled) return;
              safeReject(new Error('TURNSTILE_EXPIRED'));
            },
            'timeout-callback': () => {
              if (isSettled) return;
              safeReject(new Error('TURNSTILE_TIMEOUT'));
            },
          });
        } catch (_) {
          safeReject(new Error('TURNSTILE_RENDER_FAILED'));
        }
      })
      .catch((err) => {
        if (isSettled) return;
        safeReject(err);
      });
  });
}

/**
 * Remove a Turnstile widget instance from the active Turnstile runtime.
 * Note: This function removes only the widget lifecycle. Callers providing a custom DOM container element
 * are responsible for managing their own container's lifecycle.
 */
export function disposeTurnstile(widgetId) {
  if (widgetId !== null && widgetId !== undefined && typeof window !== 'undefined' && window.turnstile && typeof window.turnstile.remove === 'function') {
    try {
      window.turnstile.remove(widgetId);
    } catch (_) {}
  }
}
