import React, { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import {
  MessageSquare,
  Clock,
  Inbox,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Layers,
  User,
} from 'lucide-react';
import { LeadSourceDashboard } from './LeadSourceDashboard';
import './AdminStyles.css';

const isDebugMode = typeof window !== 'undefined' && window.location.search.includes('admin_debug=1');

function logDebug(queryName, details) {
  if (isDebugMode) {
    console.log(`[ADMIN_DEBUG][${queryName}]`, details);
  }
}

export function AdminDashboard({ adminProfile, user, onSelectTab }) {
  const [metrics, setMetrics] = useState({
    openConversations: 0,
    pendingConversations: 0,
    unreadMessages: 0,
  });
  const [recentConversations, setRecentConversations] = useState([]);
  const [productStats, setProductStats] = useState([]);
  const [total30DaysCount, setTotal30DaysCount] = useState(0);

  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [errorMetrics, setErrorMetrics] = useState(null);
  const [errorRecent, setErrorRecent] = useState(null);
  const [errorProducts, setErrorProducts] = useState(null);

  // 1. Busca Métricas Gerais (Conversas em andamento, Pendentes, Não Lidas)
  const fetchMetrics = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoadingMetrics(false);
      return;
    }

    setLoadingMetrics(true);
    setErrorMetrics(null);

    try {
      const [openRes, pendingRes, unreadRes] = await Promise.all([
        supabase
          .from('conversations')
          .select('id', { count: 'exact', head: true })
          .in('status', ['open', 'pending'])
          .is('archived_at', null),
        supabase
          .from('conversations')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending')
          .is('archived_at', null),
        supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('sender_type', 'visitor')
          .is('read_at', null),
      ]);

      logDebug('openRes', { status: openRes.status, count: openRes.count, error: openRes.error });
      logDebug('pendingRes', { status: pendingRes.status, count: pendingRes.count, error: pendingRes.error });
      logDebug('unreadRes', { status: unreadRes.status, count: unreadRes.count, error: unreadRes.error });

      if (openRes.error) throw openRes.error;
      if (pendingRes.error) throw pendingRes.error;
      if (unreadRes.error) throw unreadRes.error;

      setMetrics({
        openConversations: openRes.count ?? 0,
        pendingConversations: pendingRes.count ?? 0,
        unreadMessages: unreadRes.count ?? 0,
      });
    } catch (err) {
      console.error('[AdminDashboard] Erro ao carregar métricas:', err);
      setErrorMetrics('Não foi possível carregar as estatísticas gerais.');
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  // 2. Busca Atendimentos Recentes (Top 5)
  const fetchRecent = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoadingRecent(false);
      return;
    }

    setLoadingRecent(true);
    setErrorRecent(null);

    try {
      const { data, error, status } = await supabase
        .from('conversations')
        .select('id, visitor_name, status, source_product, source_path, last_message_at')
        .is('archived_at', null)
        .order('last_message_at', { ascending: false })
        .limit(5);

      logDebug('recentConversations', { status, count: data?.length, error });

      if (error) throw error;
      setRecentConversations(data || []);
    } catch (err) {
      console.error('[AdminDashboard] Erro ao carregar conversas recentes:', err);
      setErrorRecent('Falha ao obter lista de conversas recentes.');
    } finally {
      setLoadingRecent(false);
    }
  }, []);

  // 3. Busca Atendimentos por Produto (Últimos 30 Dias)
  const fetchProducts = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoadingProducts(false);
      return;
    }

    setLoadingProducts(true);
    setErrorProducts(null);

    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const productKeys = [
        { key: 'slimsoda', label: 'SlimSoda' },
        { key: 'sonnus', label: 'Sonnus' },
        { key: 'crowned', label: 'Crowned' },
        { key: 'linfaflow', label: 'Linfaflow' },
        { key: 'memoflow', label: 'Memoflow' },
        { key: 'institucional', label: 'Institucional' },
      ];

      const queries = productKeys.map((p) =>
        supabase
          .from('conversations')
          .select('id', { count: 'exact', head: true })
          .is('archived_at', null)
          .gte('created_at', thirtyDaysAgo)
          .eq('source_product', p.key)
      );

      const results = await Promise.allSettled(queries);

      let totalCount = 0;
      const statsList = [];

      results.forEach((res, index) => {
        const prod = productKeys[index];
        if (res.status === 'fulfilled' && !res.value.error) {
          const count = res.value.count ?? 0;
          totalCount += count;
          statsList.push({
            key: prod.key,
            label: prod.label,
            count,
          });
          logDebug(`product_${prod.key}`, { count });
        } else {
          logDebug(`product_${prod.key}_error`, { error: res.reason || res.value?.error });
        }
      });

      const statsWithPerc = statsList
        .map((item) => ({
          ...item,
          percentage: totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      setTotal30DaysCount(totalCount);
      setProductStats(statsWithPerc);
    } catch (err) {
      console.error('[AdminDashboard] Erro ao carregar estatísticas por produto:', err);
      setErrorProducts('Falha ao carregar distribuição por produto.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    fetchRecent();
    fetchProducts();
  }, [fetchMetrics, fetchRecent, fetchProducts]);

  const handleNavigateToConversations = () => {
    if (typeof onSelectTab === 'function') {
      onSelectTab('conversations');
    } else {
      window.location.href = '/admin/conversations';
    }
  };

  const userName = adminProfile?.full_name || user?.email?.split('@')[0] || 'Administrador';

  const formatHeaderDate = () => {
    const d = new Date();
    const formatted = d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffMinutes < 1) return 'Agora';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const getProductBadgeClass = (prodKey) => {
    const key = (prodKey || '').toLowerCase();
    if (key.includes('slimsoda')) return 'badge-slimsoda';
    if (key.includes('sonnus')) return 'badge-sonnus';
    if (key.includes('crowned')) return 'badge-crowned';
    if (key.includes('linfaflow')) return 'badge-linfaflow';
    if (key.includes('memoflow')) return 'badge-memoflow';
    return 'badge-institucional';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open':
        return 'badge-status-open';
      case 'pending':
        return 'badge-status-pending';
      case 'closed':
        return 'badge-status-closed';
      default:
        return 'badge-status-default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open':
        return 'Aberta';
      case 'pending':
        return 'Pendente';
      case 'closed':
        return 'Encerrada';
      default:
        return status || 'Desconhecido';
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-container">
        {/* Cabeçalho do Dashboard */}
        <header className="dash-header">
          <div className="dash-header-title-box">
            <h1 className="dash-greeting">Olá, {userName}</h1>
            <p className="dash-header-meta">
              Visão geral dos atendimentos — {formatHeaderDate()}
            </p>
          </div>
        </header>

        {/* Erro nas Métricas se houver */}
        {errorMetrics && (
          <div className="admin-alert-error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} />
            <span>{errorMetrics}</span>
            <button
              onClick={fetchMetrics}
              disabled={loadingMetrics}
              className="dash-retry-inline-btn"
            >
              <RefreshCw size={14} className={loadingMetrics ? 'chat-spinner' : ''} />
              Tentar novamente
            </button>
          </div>
        )}

        {/* Composição Assimétrica Principal */}
        <section className="dash-hero-section">
          {/* Card Principal Verde Institucional */}
          <div className="dash-hero-card">
            <div className="dash-hero-content">
              <span className="dash-hero-badge">Central Ativa</span>
              <div className="dash-hero-number">
                {loadingMetrics ? '...' : metrics.openConversations}
              </div>
              <h3 className="dash-hero-title">Conversas em andamento</h3>
              <p className="dash-hero-desc">
                Atendimentos ativos que necessitam de acompanhamento da equipe.
              </p>

              <button
                className="dash-hero-cta"
                onClick={handleNavigateToConversations}
              >
                <span>Abrir Central de Atendimento</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="dash-hero-symbol-bg">
              <img
                src="/assets/Brand/essencial-good-symbol.png"
                alt=""
                aria-hidden="true"
                className="dash-hero-symbol-img"
              />
            </div>
          </div>

          {/* Coluna com Indicadores Secundários */}
          <div className="dash-secondary-col">
            {/* Card 1: Pendentes */}
            <div className="dash-sec-card">
              <div className="dash-sec-card-header">
                <span className="dash-sec-title">Pendentes</span>
                <div className="dash-sec-icon-box">
                  <Clock size={18} />
                </div>
              </div>
              <div className="dash-sec-value">
                {loadingMetrics ? '...' : metrics.pendingConversations}
              </div>
              <span className="dash-sec-sub">Aguardando resposta inicial</span>
            </div>

            {/* Card 2: Mensagens Não Lidas */}
            <div className="dash-sec-card">
              <div className="dash-sec-card-header">
                <span className="dash-sec-title">Mensagens não lidas</span>
                <div className="dash-sec-icon-box">
                  <Inbox size={18} />
                </div>
              </div>
              <div className="dash-sec-value">
                {loadingMetrics ? '...' : metrics.unreadMessages}
              </div>
              <span className="dash-sec-sub">Enviadas por visitantes</span>
            </div>
          </div>
        </section>

        {/* Grid de Conteúdo Secundário: Atendimentos Recentes & Por Produto */}
        <section className="dash-bottom-grid">
          {/* Bloco 1: Atendimentos Recentes (2/3 da largura em desktop) */}
          <div className="dash-panel-card dash-recent-panel">
            <div className="dash-panel-header">
              <div className="dash-panel-header-title">
                <MessageSquare size={18} className="dash-panel-icon" />
                <h2>Atendimentos recentes</h2>
              </div>
              <button
                className="dash-link-action"
                onClick={handleNavigateToConversations}
              >
                <span>Ver todas</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {errorRecent ? (
              <div className="admin-alert-error" style={{ margin: '16px 0' }}>
                <AlertCircle size={16} />
                <span>{errorRecent}</span>
                <button
                  onClick={fetchRecent}
                  disabled={loadingRecent}
                  className="dash-retry-inline-btn"
                >
                  <RefreshCw size={13} className={loadingRecent ? 'chat-spinner' : ''} />
                  Recarregar
                </button>
              </div>
            ) : loadingRecent ? (
              <div className="dash-skeleton-list">
                <div className="dash-skeleton-item" />
                <div className="dash-skeleton-item" />
                <div className="dash-skeleton-item" />
              </div>
            ) : recentConversations.length === 0 ? (
              <div className="dash-empty-state">
                <MessageSquare size={32} className="dash-empty-icon" />
                <p className="dash-empty-text">Nenhuma conversa registrada ainda.</p>
              </div>
            ) : (
              <div className="dash-recent-list">
                {recentConversations.map((item) => (
                  <div
                    key={item.id}
                    className="dash-recent-item"
                    onClick={handleNavigateToConversations}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleNavigateToConversations();
                    }}
                  >
                    <div className="dash-item-avatar">
                      <User size={16} />
                    </div>

                    <div className="dash-item-main">
                      <div className="dash-item-top">
                        <span className="dash-item-name">
                          {item.visitor_name || 'Visitante'}
                        </span>
                        <span className="dash-item-time">
                          {formatTimeAgo(item.last_message_at)}
                        </span>
                      </div>

                      <div className="dash-item-bottom">
                        <span className={`dash-badge ${getProductBadgeClass(item.source_product)}`}>
                          {item.source_product || 'institucional'}
                        </span>
                        <span className={`dash-badge ${getStatusBadgeClass(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={16} className="dash-item-arrow" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bloco 2: Atendimentos por Produto (1/3 da largura em desktop) */}
          <div className="dash-panel-card dash-products-panel">
            <div className="dash-panel-header">
              <div className="dash-panel-header-title">
                <Layers size={18} className="dash-panel-icon" />
                <h2>Atendimentos por produto</h2>
              </div>
              <span className="dash-period-tag">Últimos 30 dias</span>
            </div>

            {errorProducts ? (
              <div className="admin-alert-error" style={{ margin: '16px 0' }}>
                <AlertCircle size={16} />
                <span>{errorProducts}</span>
                <button
                  onClick={fetchProducts}
                  disabled={loadingProducts}
                  className="dash-retry-inline-btn"
                >
                  <RefreshCw size={13} className={loadingProducts ? 'chat-spinner' : ''} />
                  Recarregar
                </button>
              </div>
            ) : loadingProducts ? (
              <div className="dash-skeleton-list">
                <div className="dash-skeleton-bar" />
                <div className="dash-skeleton-bar" />
                <div className="dash-skeleton-bar" />
              </div>
            ) : productStats.length === 0 ? (
              <div className="dash-empty-state">
                <Layers size={32} className="dash-empty-icon" />
                <p className="dash-empty-text">Nenhum atendimento nos últimos 30 dias.</p>
              </div>
            ) : (
              <div className="dash-products-list">
                <div className="dash-products-summary-meta">
                  <span>Total no período:</span>
                  <strong>{total30DaysCount} atendimento(s)</strong>
                </div>

                {productStats.map((stat) => (
                  <div key={stat.key} className="dash-prod-row">
                    <div className="dash-prod-label-line">
                      <span className="dash-prod-name">{stat.label}</span>
                      <span className="dash-prod-count">
                        {stat.count} ({stat.percentage}%)
                      </span>
                    </div>

                    <div className="dash-prod-track">
                      <div
                        className="dash-prod-fill"
                        style={{ width: `${Math.max(stat.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bloco Origem dos Leads */}
        <LeadSourceDashboard />
      </div>
    </div>
  );
}

export default AdminDashboard;
