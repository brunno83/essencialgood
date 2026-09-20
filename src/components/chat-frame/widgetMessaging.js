/**
 * Gerenciamento de Mensagens e Handshake postMessage para o Widget Iframe
 */

export const PRODUCTION_ALLOWED_PARENT_ORIGINS = [
  'https://essencialgood.com',
  'https://www.essencialgood.com',
];

export const STAGING_ALLOWED_PARENT_ORIGINS = [
  'https://staging.essencialgood.com',
];

export const DEV_ALLOWED_LOCAL_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://localhost:5173',
  'https://127.0.0.1:5173',
];

/**
 * Valida se a origem pai (parent window) é autorizada na allowlist estrita do ambiente ativo
 * @param {string} origin
 * @returns {boolean}
 */
export function isAllowedParentOrigin(origin) {
  if (!origin || typeof origin !== 'string') return false;
  const lower = origin.toLowerCase().trim();

  // Rejeita esquemas inseguros, caracteres nulos ou injeções
  if (lower === 'null' || lower.includes('\0') || lower.includes('javascript:') || lower.includes('data:')) {
    return false;
  }

  // Obtenção estrita do ambiente ativo a partir de import.meta.env ou process.env (VITE_APP_ENV)
  const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const appEnv = (metaEnv.VITE_APP_ENV || (typeof process !== 'undefined' && process.env && process.env.VITE_APP_ENV) || '').toLowerCase().trim();
  const isDevEnv = Boolean(metaEnv.DEV);

  const isProductionEnv = appEnv === 'production';
  const isStagingEnv = appEnv === 'staging';
  const isDevelopmentEnv = appEnv === 'development' || appEnv === 'test' || (isDevEnv && !appEnv);

  // Se o ambiente for ausente ou desconhecido, falha fechado (NÃO faz fallback para produção)
  if (!isProductionEnv && !isStagingEnv && !isDevelopmentEnv) {
    return false;
  }

  // 1. Em Produção: aceita EXCLUSIVAMENTE origens de produção oficiais
  if (isProductionEnv && !isDevEnv) {
    return PRODUCTION_ALLOWED_PARENT_ORIGINS.includes(lower);
  }

  // 2. Em Staging: aceita EXCLUSIVAMENTE o subdomínio dedicado de staging
  if (isStagingEnv && !isDevEnv) {
    return STAGING_ALLOWED_PARENT_ORIGINS.includes(lower);
  }

  // 3. Em Desenvolvimento/Testes: aceita EXCLUSIVAMENTE portas locais autorizadas (5173, 4173)
  if (isDevelopmentEnv) {
    return DEV_ALLOWED_LOCAL_ORIGINS.includes(lower);
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
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.warn('[widgetMessaging] targetOrigin inválido ou wildcard (*) rejeitado.');
    }
    return;
  }

  window.parent.postMessage({ type, payload }, targetOrigin);
}
