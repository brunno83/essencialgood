/**
 * Gerenciamento de Mensagens e Handshake postMessage para o Widget Iframe
 */

const ALLOWED_ORIGIN_REGEX = /^https:\/\/[a-z0-9-]+\.essencialgood\.com$/i;

/**
 * Valida se a origem pai (parent window) é autorizada na allowlist
 * @param {string} origin
 * @returns {boolean}
 */
export function isAllowedParentOrigin(origin) {
  if (!origin || typeof origin !== 'string') return false;
  const lower = origin.toLowerCase().trim();

  // Origens exatas de produção
  if (lower === 'https://essencialgood.com' || lower === 'https://www.essencialgood.com') {
    return true;
  }

  // Subdomínios estritos *.essencialgood.com
  if (ALLOWED_ORIGIN_REGEX.test(lower)) {
    return true;
  }

  // Origens locais permitidas apenas em ambiente de desenvolvimento
  if (import.meta.env.DEV) {
    try {
      const url = new URL(lower);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return true;
      }
    } catch (e) {
      // ignore
    }
  }

  return false;
}

export const MSG_TYPES = {
  READY: 'ESSENCIAL_CHAT_READY',
  INIT: 'ESSENCIAL_CHAT_INIT',
  ACK: 'ESSENCIAL_CHAT_ACK',
  STATE: 'ESSENCIAL_CHAT_STATE',
  OPEN: 'ESSENCIAL_CHAT_OPEN',
  CLOSE: 'ESSENCIAL_CHAT_CLOSE',
  UNREAD: 'ESSENCIAL_CHAT_UNREAD',
  ERROR: 'ESSENCIAL_CHAT_ERROR',
};

/**
 * Envia uma mensagem estruturada via postMessage para a janela pai (host page)
 * @param {string} type
 * @param {Object} payload
 * @param {string} targetOrigin
 */
export function postToParent(type, payload = {}, targetOrigin) {
  if (typeof window === 'undefined' || window.parent === window) return;
  if (!targetOrigin || targetOrigin === '*') {
    if (import.meta.env.DEV) {
      console.warn('[widgetMessaging] targetOrigin inválido ou wildcard (*) rejeitado.');
    }
    return;
  }

  window.parent.postMessage({ type, payload }, targetOrigin);
}
