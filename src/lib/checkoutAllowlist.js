/**
 * Utilitário de Validação de Allowlist Estrita para URLs de Checkout da Essencial Good
 */

export const PRODUCT_CHECKOUT_HOSTS = {
  slimsoda: ['cc.slimsodapowder.com'],
  sonnus: ['cc.sonnus.com', 'cc.usesonnus.com'],
  crowned: ['cc.crownedhair.com', 'cc.usecrowned.com'],
  linfaflow: ['cc.linfaflow.com'],
  memoflow: ['cc.memoflow.com', 'cc.usememoflow.com'],
};

export const ALLOWED_CHECKOUT_HOSTS = [
  'cc.slimsodapowder.com',
  'cc.sonnus.com',
  'cc.usesonnus.com',
  'cc.crownedhair.com',
  'cc.usecrowned.com',
  'cc.linfaflow.com',
  'cc.memoflow.com',
  'cc.usememoflow.com',
];

export const ALLOWED_COUNTRY_DIAL_PAIRS = {
  US: '+1',
  CA: '+1',
  GB: '+44',
  AU: '+61',
  NZ: '+64',
};

export function isValidCheckoutUrl(rawUrl, product = null, pageType = null) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;

  try {
    const trimmed = rawUrl.trim();
    const parsed = new URL(trimmed);

    // 1. Deve utilizar obrigatoriamente HTTPS
    if (parsed.protocol !== 'https:') return false;

    // 2. Rejeita userinfo (username/password na URL)
    if (parsed.username || parsed.password) return false;

    // 3. Hostname deve estar estritamente na allowlist autorizada
    const host = parsed.hostname.toLowerCase();
    if (!ALLOWED_CHECKOUT_HOSTS.includes(host)) return false;

    // 4. Se produto informado, valida matriz produto -> host
    if (product) {
      const cleanProd = product.trim().toLowerCase();
      const allowedHosts = PRODUCT_CHECKOUT_HOSTS[cleanProd];
      if (!allowedHosts || !allowedHosts.includes(host)) return false;
    }

    // 5. Se memoflow, permite apenas page_type adv e power
    if (product && product.trim().toLowerCase() === 'memoflow' && pageType) {
      const cleanPage = pageType.trim().toLowerCase();
      if (!['adv', 'power'].includes(cleanPage)) return false;
    }

    // 6. Pathname deve conter o script checkout.php
    const path = parsed.pathname.toLowerCase();
    if (!path.includes('checkout.php')) return false;

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Extrai os parâmetros comerciais (affid, hid, hcid, subids, UTMs) de uma URL de checkout válida
 */
export function extractCheckoutParams(rawUrl, product = null, pageType = null) {
  if (!isValidCheckoutUrl(rawUrl, product, pageType)) return {};

  try {
    const parsed = new URL(rawUrl.trim());
    const params = parsed.searchParams;

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
