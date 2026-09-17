/**
 * Utilitário de captura, sanitização e validação de origem de conversas
 * Projeto Essencial Good - Chat ao Vivo
 */

/**
 * Mapeia o produto com base na URL/caminho/hostname
 * @param {string} path - pathname da janela
 * @param {string} host - hostname da janela
 * @returns {string} - 'crowned' | 'linfaflow' | 'memoflow' | 'slimsoda' | 'sonnus' | 'institucional'
 */
export function inferSourceProduct(path = '', host = '') {
  const target = (path + ' ' + host).toLowerCase();

  if (target.includes('crowned')) return 'crowned';
  if (target.includes('linfaflow')) return 'linfaflow';
  if (target.includes('memoflow')) return 'memoflow';
  if (target.includes('slimsoda')) return 'slimsoda';
  if (target.includes('sonnus')) return 'sonnus';

  return 'institucional';
}

/**
 * Coleta informações sanitizadas da origem atual da conversa (sem PII / query string / hash)
 * @returns {Object} { source_url, source_path, source_host, source_title, source_product }
 */
export function getConversationSourceInfo() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      source_url: null,
      source_path: null,
      source_host: null,
      source_title: null,
      source_product: 'institucional',
    };
  }

  try {
    const loc = window.location;
    const protocol = (loc.protocol || '').toLowerCase();

    // Aceita apenas HTTP e HTTPS
    if (protocol !== 'http:' && protocol !== 'https:') {
      return {
        source_url: null,
        source_path: null,
        source_host: null,
        source_title: null,
        source_product: 'institucional',
      };
    }

    const host = (loc.hostname || '').toLowerCase().trim().slice(0, 253);
    let path = loc.pathname || '/';
    if (!path.startsWith('/')) path = '/' + path;
    path = path.slice(0, 1024);

    // URL sanitizada: protocolo + host + path (SEM query string ? e SEM hash #)
    const cleanUrl = `${loc.protocol}//${loc.host}${path}`.slice(0, 2048);

    let title = (document.title || '').trim().slice(0, 300);
    if (!title) title = null;

    const product = inferSourceProduct(path, host).slice(0, 100);

    return {
      source_url: cleanUrl,
      source_path: path,
      source_host: host || null,
      source_title: title,
      source_product: product,
    };
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[conversationSource] Erro ao extrair origem da conversa:', e);
    }
    return {
      source_url: null,
      source_path: null,
      source_host: null,
      source_title: null,
      source_product: 'institucional',
    };
  }
}

/**
 * Infere o tipo de página de origem para exibição amigável no admin
 * @param {Object} conv - Objeto da conversa contendo source_path, source_url, source_product, etc.
 * @returns {string} - Ex: 'Listicle', 'Advertorial', 'Power Page', 'Página de Produto', 'Institucional', 'Origem não identificada'
 */
export function getConversationSourceType(conv) {
  if (!conv || (!conv.source_path && !conv.source_url && !conv.source_host && !conv.source_product)) {
    return 'Origem não identificada';
  }

  const rawPath = (conv.source_path || '').toLowerCase().trim();
  const product = (conv.source_product || '').toLowerCase().trim();
  const cleanPath = rawPath.endsWith('/') && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;

  if (cleanPath.includes('/listicle/')) {
    return 'Listicle';
  }

  if (cleanPath.includes('/adv-') || cleanPath.startsWith('/adv-')) {
    return 'Advertorial';
  }

  if (cleanPath.includes('power')) {
    return 'Power Page';
  }

  const pdpPaths = ['/slimsoda', '/linfaflow', '/sonnus', '/crowned', '/memoflow'];
  if (pdpPaths.includes(cleanPath)) {
    return 'Página de Produto';
  }

  if (product === 'institucional' || cleanPath === '' || cleanPath === '/') {
    return 'Institucional';
  }

  return 'Página da Web';
}

/**
 * Valida rigorosamente se uma URL de origem é segura para renderizar como link no admin
 * @param {string} rawUrl - URL a ser verificada
 * @returns {boolean}
 */
export function isAllowedSourceUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;

  try {
    const parsed = new URL(rawUrl);
    const protocol = parsed.protocol.toLowerCase();
    if (protocol !== 'http:' && protocol !== 'https:') return false;

    const hostname = parsed.hostname.toLowerCase();

    // Permite localhost / 127.0.0.1 APENAS em ambiente de desenvolvimento local
    if (import.meta.env.DEV && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      return true;
    }

    // Permite estritamente essencialgood.com, www.essencialgood.com e subdomínios *.essencialgood.com
    return (
      hostname === 'essencialgood.com' ||
      hostname === 'www.essencialgood.com' ||
      hostname.endsWith('.essencialgood.com')
    );
  } catch {
    return false;
  }
}

/**
 * Formata o nome de exibição do produto para a interface do admin
 * @param {string} product
 * @returns {string}
 */
export function formatProductDisplayName(product) {
  if (!product) return 'Origem não identificada';
  const p = product.toLowerCase();
  switch (p) {
    case 'crowned':
      return 'Crowned';
    case 'linfaflow':
      return 'Linfaflow';
    case 'memoflow':
      return 'Memoflow';
    case 'slimsoda':
      return 'SlimSoda';
    case 'sonnus':
      return 'Sonnus';
    case 'institucional':
      return 'Institucional';
    default:
      return product.charAt(0).toUpperCase() + product.slice(1);
  }
}
