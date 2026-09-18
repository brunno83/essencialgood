import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function useAdminCheckoutLeads() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [period, setPeriod] = useState('30d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [product, setProduct] = useState('all');
  const [pageType, setPageType] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [leads, setLeads] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Debounce da busca por 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Função utilitária para calcular intervalo ISO de datas respeitando o fuso horário local do administrador
  const getPeriodDates = useCallback(() => {
    const now = new Date();
    if (period === '7d') {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { startIso: start.toISOString(), endIso: now.toISOString() };
    }
    if (period === '30d') {
      const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { startIso: start.toISOString(), endIso: now.toISOString() };
    }
    if (period === '90d') {
      const start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return { startIso: start.toISOString(), endIso: now.toISOString() };
    }
    if (period === 'custom' && customStartDate && customEndDate) {
      // Decomposição segura sem parsing ambíguo de string
      const [sYear, sMonth, sDay] = customStartDate.split('-').map(Number);
      const [eYear, eMonth, eDay] = customEndDate.split('-').map(Number);

      if (sYear && sMonth && sDay && eYear && eMonth && eDay) {
        // Início do dia local inicial às 00:00:00.000
        const startLocalDate = new Date(sYear, sMonth - 1, sDay, 0, 0, 0, 0);
        // Início do dia local SEGUINTE à data final às 00:00:00.000 (para limite exclusivo created_at < end)
        // O construtor do JS trata viradas de mês (ex: dia 31) e viradas de ano (ex: 31/12) automaticamente.
        const endLocalDate = new Date(eYear, eMonth - 1, eDay + 1, 0, 0, 0, 0);

        return {
          startIso: isNaN(startLocalDate.getTime()) ? null : startLocalDate.toISOString(),
          endIso: isNaN(endLocalDate.getTime()) ? null : endLocalDate.toISOString(),
        };
      }
    }
    return { startIso: null, endIso: null };
  }, [period, customStartDate, customEndDate]);

  // Carrega leads via RPC get_checkout_leads_admin
  const fetchLeads = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { startIso, endIso } = getPeriodDates();

    try {
      const { data, error: rpcError } = await supabase.rpc('get_checkout_leads_admin', {
        p_page: page,
        p_page_size: pageSize,
        p_start_date: startIso,
        p_end_date: endIso,
        p_product: product,
        p_page_type: pageType,
        p_search: debouncedSearch.trim() || null,
      });

      if (rpcError) {
        throw new Error(rpcError.message || 'Erro ao carregar lista de leads.');
      }

      if (data && data.items && data.pagination) {
        setLeads(data.items || []);
        setTotalItems(data.pagination.total_items || 0);
        setTotalPages(data.pagination.total_pages || 0);
      } else {
        setLeads([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (err) {
      setError(err.message || 'Erro ao buscar leads.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, product, pageType, debouncedSearch, getPeriodDates]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Limpa todos os filtros para os padrões
  const resetFilters = () => {
    setPeriod('30d');
    setCustomStartDate('');
    setCustomEndDate('');
    setProduct('all');
    setPageType('all');
    setSearch('');
    setPage(1);
  };

  // Exportação segura de CSV com proteção contra CSV Injection e UTF-8 BOM
  // Paginada em lote até o total de páginas (com teto de segurança de 5.000 registros)
  const exportCSV = async () => {
    if (!isSupabaseConfigured || !supabase || exporting) return;

    setExporting(true);
    try {
      const { startIso, endIso } = getPeriodDates();
      let allLeads = [];
      let currentPage = 1;
      let totalPagesToFetch = 1;
      const MAX_SAFETY_RECORDS = 5000;

      do {
        const { data, error: rpcError } = await supabase.rpc('get_checkout_leads_admin', {
          p_page: currentPage,
          p_page_size: 100,
          p_start_date: startIso,
          p_end_date: endIso,
          p_product: product,
          p_page_type: pageType,
          p_search: debouncedSearch.trim() || null,
        });

        if (rpcError) throw new Error(rpcError.message);

        if (data && data.items && data.pagination) {
          allLeads = [...allLeads, ...data.items];
          totalPagesToFetch = data.pagination.total_pages || 1;
        }

        if (allLeads.length >= MAX_SAFETY_RECORDS) {
          break;
        }

        currentPage++;
      } while (currentPage <= totalPagesToFetch);

      if (allLeads.length === 0) {
        alert('Nenhum lead encontrado para os filtros selecionados.');
        setExporting(false);
        return;
      }

      // Defesa contra CSV Injection
      const sanitizeValue = (val) => {
        if (val === null || val === undefined) return '""';
        let str = String(val).trim();
        // Prefixa com ' se começar com caracteres de comando do Excel
        if (/^[=+\-@\t\r]/.test(str)) {
          str = "'" + str;
        }
        return `"${str.replace(/"/g, '""')}"`;
      };

      // Cabeçalhos Operacionais (Sem Exposição de Parâmetros Técnicos nem checkout_url)
      const headers = [
        'Data/Hora (UTC)',
        'Nome',
        'Email',
        'Telefone',
        'Pais',
        'DDI',
        'Produto',
        'Tipo de Pagina',
        'Titulo da Pagina',
        'Caminho Origem',
        'Consentimento',
        'Data Consentimento',
      ];

      const rows = allLeads.map((item) => [
        sanitizeValue(item.created_at),
        sanitizeValue(item.name),
        sanitizeValue(item.email),
        sanitizeValue(item.phone),
        sanitizeValue(item.country_code),
        sanitizeValue(item.dial_code),
        sanitizeValue(item.product),
        sanitizeValue(item.page_type),
        sanitizeValue(item.page_title),
        sanitizeValue(item.source_path),
        sanitizeValue(item.consent_given ? 'Sim' : 'Nao'),
        sanitizeValue(item.consent_at),
      ]);

      const csvContent =
        '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const today = new Date().toISOString().split('T')[0];

      link.setAttribute('href', url);
      link.setAttribute('download', `leads_checkout_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Falha ao exportar CSV: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  // Exclusão individual de lead via RPC delete_checkout_lead_admin (exclusiva para perfil admin)
  const deleteLead = async (leadId) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase não está configurado.');
    }
    if (!leadId) {
      throw new Error('ID do lead é obrigatório.');
    }

    const { data, error: rpcError } = await supabase.rpc('delete_checkout_lead_admin', {
      p_lead_id: leadId,
    });

    if (rpcError) {
      throw new Error(rpcError.message || 'Erro ao excluir o lead.');
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Não foi possível excluir o lead.');
    }

    // Se era o único item de uma página que não é a primeira, recua para a página anterior
    if (leads.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
    } else {
      // Recarrega os registros da página atual e atualiza os totais
      await fetchLeads();
    }

    return data;
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    period,
    setPeriod,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    product,
    setProduct,
    pageType,
    setPageType,
    search,
    setSearch,
    leads,
    totalItems,
    totalPages,
    loading,
    error,
    exporting,
    refetch: fetchLeads,
    resetFilters,
    exportCSV,
    deleteLead,
  };
}

export default useAdminCheckoutLeads;
