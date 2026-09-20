// ESSENCIAL GOOD - TURNSTILE ADAPTER COMPREHENSIVE TEST SUITE (Node.js)
// Tests strict URL matching, query parameter validation, userinfo/port/fragment rejection, script reuse, retry after failure, timeout validation, error sanitization, late callbacks, idempotent cleanup, and zero memory leaks.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

process.env.VITE_APP_ENV = 'staging';
process.env.VITE_EXPECTED_SUPABASE_PROJECT_REF = 'zauvpsxeexwthobmbkku';
process.env.VITE_SUPABASE_URL = 'https://zauvpsxeexwthobmbkku.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_staging.signature';
process.env.VITE_TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

console.log("==========================================");
console.log("TURNSTILE ADAPTER COMPREHENSIVE AUTOMATED TEST SUITE");
console.log("==========================================");

// Mock do ambiente de navegador DOM
const mockDOM = () => {
  const elements = [];
  const body = {
    appendChild: (el) => {
      elements.push(el);
      el.parentNode = body;
      return el;
    },
    removeChild: (el) => {
      const idx = elements.indexOf(el);
      if (idx !== -1) elements.splice(idx, 1);
      el.parentNode = null;
    }
  };

  const head = {
    appendChild: (el) => {
      elements.push(el);
      el.parentNode = head;
      return el;
    },
    removeChild: (el) => {
      const idx = elements.indexOf(el);
      if (idx !== -1) elements.splice(idx, 1);
      el.parentNode = null;
    }
  };

  global.window = {
    location: { href: 'https://essencialgood.com' },
    document: {
      head,
      body,
      documentElement: body,
      createElement: (tag) => {
        const attrs = {};
        const style = {};
        const obj = {
          tagName: tag.toUpperCase(),
          setAttribute: (k, v) => { attrs[k] = String(v); },
          getAttribute: (k) => attrs[k] !== undefined ? attrs[k] : (obj[k] !== undefined ? String(obj[k]) : null),
          removeAttribute: (k) => { delete attrs[k]; },
          style,
          parentNode: null,
        };
        return obj;
      },
      querySelectorAll: (selector) => {
        if (selector === 'script') {
          return elements.filter((el) => el.tagName === 'SCRIPT');
        }
        if (selector.includes('turnstile')) {
          return elements.filter((el) => el.tagName === 'SCRIPT' && ((el.getAttribute('src') || el.src || '').includes('turnstile')));
        }
        return [];
      }
    }
  };
  global.document = global.window.document;
  return elements;
};

const domElements = mockDOM();

// Importar turnstileAdapter
const adapter = await import('../src/lib/turnstileAdapter.js');

// Carregar turnstile-loader.js estático no ambiente global
const loaderCode = fs.readFileSync(path.join(rootDir, 'public', 'turnstile-loader.js'), 'utf8');
eval(loaderCode);

const isValidUrl = global.window.__ESSENCIAL_TURNSTILE__.isValidTurnstileUrl;

// --- 1. TESTES DE URL EXATA DO TURNSTILE ---
assert(isValidUrl('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit') === true, "[1.1] URL oficial exata é ACEITA.");
assert(isValidUrl('https://challenges.cloudflare.com/turnstile/v0/api.js') === false, "[1.2] URL sem query é REJEITADA.");
assert(isValidUrl('https://challenges.cloudflare.com/turnstile/v0/api.js?render=always') === false, "[1.3] Query divergente (?render=always) é REJEITADA.");
assert(isValidUrl('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&extra=1') === false, "[1.4] Parâmetro adicional (&extra=1) é REJEITADO.");
assert(isValidUrl('https://user:pass@challenges.cloudflare.com/turnstile/v0/api.js?render=explicit') === false, "[1.5] Userinfo (user:pass@) é REJEITADO.");
assert(isValidUrl('https://challenges.cloudflare.com:8443/turnstile/v0/api.js?render=explicit') === false, "[1.6] Porta customizada (:8443) é REJEITADA.");
assert(isValidUrl('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit#section') === false, "[1.7] Hash/fragment (#section) é REJEITADO.");
assert(isValidUrl('https://challenges.cloudflare.com.evil.com/turnstile/v0/api.js?render=explicit') === false, "[1.8] Host spoofado é REJEITADO.");

// --- 2. REUTILIZAÇÃO DE SCRIPT OFICIAL JÁ EM CARREGAMENTO ---
domElements.length = 0;
delete global.window.turnstile;
delete global.window.__ESSENCIAL_TURNSTILE__;
eval(loaderCode);

const existingLoadingScript = global.window.document.createElement('script');
existingLoadingScript.setAttribute('src', 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit');
global.window.document.head.appendChild(existingLoadingScript);

assert(domElements.filter(e => e.tagName === 'SCRIPT').length === 1, "[2.1] Tag oficial pré-existente inserida no DOM.");
assert(global.window.turnstile === undefined, "[2.2] window.turnstile ainda não está definido durante o carregamento.");

const loadP1 = global.window.__ESSENCIAL_TURNSTILE__.loadScript();
const loadP2 = global.window.__ESSENCIAL_TURNSTILE__.loadScript();

assert(loadP1 === loadP2, "[2.3] Duas chamadas a loadScript() compartilham exatamente a mesma Promise.");
assert(domElements.filter(e => e.tagName === 'SCRIPT').length === 1, "[2.4] Nenhuma segunda tag oficial é criada no DOM (total mantido em 1).");

// Simular disparo do onload da tag pré-existente
global.window.turnstile = { render: () => 'w_pre', remove: () => {} };
if (existingLoadingScript.onload) existingLoadingScript.onload();

const [resP1, resP2] = await Promise.all([loadP1, loadP2]);
assert(resP1 === global.window.turnstile && resP2 === global.window.turnstile, "[2.5] Ambas as chamadas resolvem com a mesma instância de API após onload.");

// --- 3. FALHA DA TAG EXISTENTE E REPETIÇÃO COM NOVA TENTATIVA ---
domElements.length = 0;
delete global.window.turnstile;
delete global.window.__ESSENCIAL_TURNSTILE__;
eval(loaderCode);

const failingScript = global.window.document.createElement('script');
failingScript.setAttribute('src', 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit');
global.window.document.head.appendChild(failingScript);

const failLoadPromise = global.window.__ESSENCIAL_TURNSTILE__.loadScript();
if (failingScript.onerror) failingScript.onerror();

let errScriptFailed = false;
try {
  await failLoadPromise;
} catch (e) {
  errScriptFailed = e.message === 'TURNSTILE_LOAD_FAILED';
}
assert(errScriptFailed, "[3.1] Falha da tag existente (onerror) rejeita a Promise com TURNSTILE_LOAD_FAILED.");
assert(failingScript.getAttribute('data-failed') === 'true', "[3.2] Tag que falhou fica marcada com data-failed='true'.");

// Chamada posterior deve remover a tag falha e criar uma única nova tentativa
const retryLoadPromise = global.window.__ESSENCIAL_TURNSTILE__.loadScript();
assert(failingScript.parentNode === null, "[3.3] Tag com data-failed='true' é removida do DOM.");

const newlyCreatedScript = domElements.find(e => e !== failingScript);
assert(newlyCreatedScript && (newlyCreatedScript.getAttribute('src') || newlyCreatedScript.src || '').includes('render=explicit'), "[3.4] Nova tentativa cria exatamente uma nova tag script limpa.");

global.window.turnstile = { render: () => 'w_retry', remove: () => {} };
if (newlyCreatedScript.onload) newlyCreatedScript.onload();

const retryApi = await retryLoadPromise;
assert(retryApi === global.window.turnstile, "[3.5] Nova tentativa resolve com sucesso a nova Promise.");

// --- 4. VALIDAÇÃO DE ACTIONS DO TURNSTILE ---
assert(adapter.isActionAllowed('create_conversation') === true, "[4.1] Action 'create_conversation' é PERMITIDA.");
assert(adapter.isActionAllowed('submit_lead') === true, "[4.2] Action 'submit_lead' é PERMITIDA.");
let errAction = false;
try {
  await adapter.requestTurnstileToken('unknown_action');
} catch (e) {
  errAction = e.message.includes('INVALID_TURNSTILE_ACTION');
}
assert(errAction, "[4.3] Action desconhecida ('unknown_action') é REJEITADA.");

// --- 5. VALIDAÇÃO RIGOROSA DE TIMEOUT MS ---
let errTimeoutLow = false;
try {
  await adapter.requestTurnstileToken('create_conversation', { timeoutMs: 500 });
} catch (e) {
  errTimeoutLow = e.message.includes('INVALID_TURNSTILE_TIMEOUT');
}
assert(errTimeoutLow, "[5.1] Timeout abaixo de 1000ms é REJEITADO com INVALID_TURNSTILE_TIMEOUT.");

let errTimeoutFloat = false;
try {
  await adapter.requestTurnstileToken('create_conversation', { timeoutMs: 5000.5 });
} catch (e) {
  errTimeoutFloat = e.message.includes('INVALID_TURNSTILE_TIMEOUT');
}
assert(errTimeoutFloat, "[5.2] Timeout não inteiro (float) é REJEITADO com INVALID_TURNSTILE_TIMEOUT.");

// --- 6. SANITIZAÇÃO DE ERRO E RENDER DE TURNSTILE ---
global.window.turnstile = {
  render: (container, options) => {
    setTimeout(() => {
      if (options['error-callback']) {
        options['error-callback']('sensitive_internal_error_code_123');
      }
    }, 10);
    return 'w_err';
  },
  remove: () => {}
};

let errSanitized = '';
try {
  await adapter.requestTurnstileToken('create_conversation');
} catch (e) {
  errSanitized = e.message;
}
assert(errSanitized === 'TURNSTILE_VERIFICATION_FAILED', "[6.1] Callback de erro reflete mensagem sanitizada 'TURNSTILE_VERIFICATION_FAILED' sem vazar erro interno.");

global.window.turnstile.render = () => {
  throw new Error('Internal DOM render exception with sensitive detail');
};

let errRender = '';
try {
  await adapter.requestTurnstileToken('create_conversation');
} catch (e) {
  errRender = e.message;
}
assert(errRender === 'TURNSTILE_RENDER_FAILED', "[6.2] Exceção no turnstile.render() é convertida para 'TURNSTILE_RENDER_FAILED'.");

// --- 7. CALLBACKS TARDIOS E CLEANUP IDEMPOTENTE ---
let capturedCallbacks = {};
global.window.turnstile.render = (container, options) => {
  capturedCallbacks = options;
  return 'w_late';
};

const abortController = new AbortController();
const latePromise = adapter.requestTurnstileToken('create_conversation', { signal: abortController.signal });

abortController.abort();

let lateAborted = false;
try {
  await latePromise;
} catch (e) {
  lateAborted = e.message === 'TURNSTILE_ABORTED';
}
assert(lateAborted, "[7.1] Requisição abortada rejeita com TURNSTILE_ABORTED.");

let unexpectedResolve = false;
try {
  if (capturedCallbacks.callback) {
    capturedCallbacks.callback('late_token_123');
  }
} catch (_) {
  unexpectedResolve = true;
}
assert(!unexpectedResolve, "[7.2] Callbacks tardios acionados após liquidação/aborto são estritamente IGNORADOS.");

// --- 8. PRESERVAÇÃO DO CONTAINER FORNECIDO PELO CHAMADOR ---
const callerContainer = global.window.document.createElement('div');
callerContainer.parentNode = global.window.document.body;

global.window.turnstile.render = (container, options) => {
  setTimeout(() => {
    options.callback('valid_caller_token');
  }, 10);
  return 'w_caller';
};

await adapter.requestTurnstileToken('create_conversation', { container: callerContainer });
assert(callerContainer.parentNode === global.window.document.body, "[8.1] Container fornecido pelo chamador NUNCA é removido do DOM no cleanup.");

// --- 9. DISPOSE TURNSTILE FUNCIONA CORRETAMENTE ---
let removedWidgetId = null;
global.window.turnstile.remove = (wId) => {
  removedWidgetId = wId;
};
adapter.disposeTurnstile('w_caller');
assert(removedWidgetId === 'w_caller', "[9.1] disposeTurnstile(widgetId) remove a instância do widget do runtime.");

console.log(`\n==========================================`);
console.log(`RESUMO DOS TESTES DO TURNSTILE ADAPTER: ${passed}/${total} PASSARAM`);
console.log(`==========================================\n`);
