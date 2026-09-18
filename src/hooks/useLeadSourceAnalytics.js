import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const DEFAULT_METRICS = {
  total_unique_leads: 0,
  total_chat_leads: 0,
  total_checkout_leads: 0,
  chat_only_leads: 0,
  checkout_only_leads: 0,
  both_sources_leads: 0,
  pct_chat_only: 0,
  pct_checkout_only: 0,
  pct_both_sources: 0,
  pct_chat_reach: 0,
  pct_checkout_reach: 0,
};

export function useLeadSourceAnalytics() {
  const [preset, setPreset] = useState('30d'); // 'all', 'today', '7d', '30d', '90d', 'custom'
  const [startDate, setStartDate] = useState(''); // 'YYYY-MM-DD'
  const [endDate, setEndDate] = useState(''); // 'YYYY-MM-DD'
  const [product, setProduct] = useState('all');
  const [pageType, setPageType] = useState('all');

  const [analytics, setAnalytics] = useState(DEFAULT_METRICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getRpcDateRange = useCallback(() => {
    if (preset === 'all') {
      return { p_start_date: null, p_end_date: null };
    }

    if (preset === 'custom') {
      const p_start_date = startDate ? new Date(`${startDate}T00:00:00`).toISOString() : null;
      const p_end_date = endDate ? new Date(`${endDate}T23:59:59.999`).toISOString() : null;
      return { p_start_date, p_end_date };
    }

    const now = new Date();
    let start = new Date();

    if (preset === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (preset === '7d') {
      start.setDate(now.getDate() - 7);
    } else if (preset === '30d') {
      start.setDate(now.getDate() - 30);
    } else if (preset === '90d') {
      start.setDate(now.getDate() - 90);
    }

    return {
      p_start_date: start.toISOString(),
      p_end_date: now.toISOString(),
    };
  }, [preset, startDate, endDate]);

  const fetchAnalytics = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      if (isMounted.current) {
        setAnalytics(DEFAULT_METRICS);
        setLoading(false);
      }
      return;
    }

    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const { p_start_date, p_end_date } = getRpcDateRange();

      const { data, error: rpcErr } = await supabase.rpc('get_lead_source_analytics', {
        p_start_date,
        p_end_date,
        p_product: product,
        p_page_type: pageType,
      });

      if (rpcErr) {
        throw rpcErr;
      }

      if (isMounted.current) {
        setAnalytics(data || DEFAULT_METRICS);
      }
    } catch (err) {
      console.error('[useLeadSourceAnalytics] Erro ao buscar métricas de origem:', err);
      if (isMounted.current) {
        setError('Não foi possível carregar os dados de origem dos leads.');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [getRpcDateRange, product, pageType]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
    preset,
    setPreset,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    product,
    setProduct,
    pageType,
    setPageType,
  };
}

export default useLeadSourceAnalytics;
