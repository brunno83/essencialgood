import { createClient } from '@supabase/supabase-js';

const KNOWN_PRODUCTS = ['crowned', 'linfaflow', 'memoflow', 'slimsoda', 'sonnus'];
const clientInstances = new Map();

/**
 * Sanitiza o nome do produto para uso seguro como storageKey
 * @param {string} rawProduct
 * @returns {string}
 */
export function sanitizeProductKey(rawProduct) {
  if (!rawProduct || typeof rawProduct !== 'string') return 'institucional';
  const clean = rawProduct.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '').slice(0, 50);
  if (KNOWN_PRODUCTS.includes(clean)) return clean;
  return clean || 'institucional';
}

/**
 * Retorna uma instância singleton de cliente Supabase dedicada ao widget por produto
 * @param {string} productName
 * @returns {Object|null}
 */
export function getWidgetSupabaseClient(productName) {
  const productKey = sanitizeProductKey(productName);
  
  if (clientInstances.has(productKey)) {
    return clientInstances.get(productKey);
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.env.DEV) {
      console.error('[widgetSupabaseClient] Configuração do Supabase ausente.');
    }
    return null;
  }

  const storageKey = `essencialgood_chat_${productKey}`;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: storageKey,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  clientInstances.set(productKey, client);
  return client;
}
