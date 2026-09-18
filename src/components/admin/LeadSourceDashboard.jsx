import React from 'react';
import {
  PieChart,
  Users,
  MessageSquare,
  FileText,
  GitMerge,
  RefreshCw,
  AlertCircle,
  Filter,
  Info,
  Calendar,
} from 'lucide-react';
import { useLeadSourceAnalytics } from '../../hooks/useLeadSourceAnalytics';

export function LeadSourceDashboard() {
  const {
    analytics,
    loading,
    error,
    refetch,
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
  } = useLeadSourceAnalytics();

  const handlePresetChange = (e) => {
    setPreset(e.target.value);
  };

  const handleProductChange = (e) => {
    setProduct(e.target.value);
  };

  const handlePageTypeChange = (e) => {
    setPageType(e.target.value);
  };

  const total = analytics.total_unique_leads || 0;

  return (
    <div className="lead-source-section">
      {/* Seção de Cabeçalho */}
      <div className="lead-source-header">
        <div className="lead-source-header-title">
          <div className="lead-source-icon-badge">
            <PieChart size={20} />
          </div>
          <div>
            <h2>Origem dos Leads</h2>
            <p className="lead-source-subtitle">
              Análise comparativa e deduplicação de captação entre Chat e Pré-checkout
            </p>
          </div>
        </div>

        <button
          onClick={refetch}
          disabled={loading}
          className="dash-retry-inline-btn lead-source-refresh-btn"
          title="Atualizar dados"
        >
          <RefreshCw size={14} className={loading ? 'chat-spinner' : ''} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="lead-source-filters-bar">
        <div className="lead-source-filter-group">
          <label htmlFor="lead-source-preset">
            <Calendar size={14} />
            <span>Período:</span>
          </label>
          <select
            id="lead-source-preset"
            value={preset}
            onChange={handlePresetChange}
            className="lead-source-select"
          >
            <option value="all">Todo o histórico</option>
            <option value="today">Hoje</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="custom">Personalizado...</option>
          </select>
        </div>

        {preset === 'custom' && (
          <div className="lead-source-custom-dates">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="lead-source-date-input"
              aria-label="Data inicial"
            />
            <span className="lead-source-date-sep">até</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="lead-source-date-input"
              aria-label="Data final"
            />
          </div>
        )}

        <div className="lead-source-filter-group">
          <label htmlFor="lead-source-product">
            <Filter size={14} />
            <span>Produto:</span>
          </label>
          <select
            id="lead-source-product"
            value={product}
            onChange={handleProductChange}
            className="lead-source-select"
          >
            <option value="all">Todos os produtos</option>
            <option value="slimsoda">SlimSoda</option>
            <option value="sonnus">Sonnus</option>
            <option value="crowned">Crowned</option>
            <option value="linfaflow">LinfaFlow</option>
            <option value="memoflow">MemoFlow</option>
          </select>
        </div>

        <div className="lead-source-filter-group">
          <label htmlFor="lead-source-pagetype">
            <Filter size={14} />
            <span>Tipo de Página:</span>
          </label>
          <select
            id="lead-source-pagetype"
            value={pageType}
            onChange={handlePageTypeChange}
            className="lead-source-select"
          >
            <option value="all">Todos os tipos</option>
            <option value="pdp">Página de Vendas (PDP)</option>
            <option value="listicle">Listicle</option>
            <option value="adv">Advertorial (ADV)</option>
            <option value="power">VSL Power</option>
          </select>
        </div>
      </div>

      {/* Exibição de Erro */}
      {error ? (
        <div className="admin-alert-error" style={{ margin: '16px 0' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={refetch} disabled={loading} className="dash-retry-inline-btn">
            <RefreshCw size={13} className={loading ? 'chat-spinner' : ''} />
            Tentar novamente
          </button>
        </div>
      ) : loading ? (
        /* State Carregando / Skeleton */
        <div className="lead-source-skeleton-container">
          <div className="lead-source-kpi-grid">
            <div className="dash-skeleton-card" />
            <div className="dash-skeleton-card" />
            <div className="dash-skeleton-card" />
            <div className="dash-skeleton-card" />
          </div>
          <div className="dash-skeleton-card lead-source-skeleton-bar-card" />
        </div>
      ) : total === 0 ? (
        /* State Sem Registros */
        <div className="lead-source-empty-state">
          <Users size={36} className="dash-empty-icon" />
          <h3>Nenhum lead encontrado</h3>
          <p>
            Não foram encontrados registros para o período e filtros selecionados. Tente alterar os
            filtros acima.
          </p>
        </div>
      ) : (
        /* Conteúdo Principal do Dashboard */
        <div className="lead-source-content">
          {/* Grid de 4 Cards KPI */}
          <div className="lead-source-kpi-grid">
            {/* Card 1: Total Único */}
            <div className="lead-source-kpi-card kpi-total">
              <div className="kpi-icon-wrap">
                <Users size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Leads Únicos</span>
                <strong className="kpi-value">{analytics.total_unique_leads}</strong>
                <span className="kpi-subtext">Pessoas consolidadas</span>
              </div>
            </div>

            {/* Card 2: Chat */}
            <div className="lead-source-kpi-card kpi-chat">
              <div className="kpi-icon-wrap">
                <MessageSquare size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Leads do Chat</span>
                <strong className="kpi-value">{analytics.total_chat_leads}</strong>
                <span className="kpi-subtext">
                  Alcance de {analytics.pct_chat_reach}% dos leads
                </span>
              </div>
            </div>

            {/* Card 3: Pré-checkout */}
            <div className="lead-source-kpi-card kpi-checkout">
              <div className="kpi-icon-wrap">
                <FileText size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Leads do Pré-checkout</span>
                <strong className="kpi-value">{analytics.total_checkout_leads}</strong>
                <span className="kpi-subtext">
                  Alcance de {analytics.pct_checkout_reach}% dos leads
                </span>
              </div>
            </div>

            {/* Card 4: Ambas as origens */}
            <div className="lead-source-kpi-card kpi-both">
              <div className="kpi-icon-wrap">
                <GitMerge size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Chat + Pré-checkout</span>
                <strong className="kpi-value">{analytics.both_sources_leads}</strong>
                <span className="kpi-subtext">
                  {analytics.pct_both_sources}% interagiu em ambos
                </span>
              </div>
            </div>
          </div>

          {/* Painel de Composição e Distribuição Visual */}
          <div className="lead-source-composition-panel">
            <div className="lead-source-panel-title">
              <h3>Composição da Origem dos Leads</h3>
              <span className="lead-source-total-badge">Total: {total} leads únicos</span>
            </div>

            {/* Barra Visual Segmentada */}
            <div
              className="lead-source-segmented-bar"
              aria-label="Gráfico de distribuição da origem dos leads"
            >
              {analytics.pct_chat_only > 0 && (
                <div
                  className="seg-item seg-chat-only"
                  style={{ width: `${analytics.pct_chat_only}%` }}
                  title={`Somente Chat: ${analytics.chat_only_leads} (${analytics.pct_chat_only}%)`}
                >
                  {analytics.pct_chat_only >= 8 && `${analytics.pct_chat_only}%`}
                </div>
              )}
              {analytics.pct_checkout_only > 0 && (
                <div
                  className="seg-item seg-checkout-only"
                  style={{ width: `${analytics.pct_checkout_only}%` }}
                  title={`Somente Formulário: ${analytics.checkout_only_leads} (${analytics.pct_checkout_only}%)`}
                >
                  {analytics.pct_checkout_only >= 8 && `${analytics.pct_checkout_only}%`}
                </div>
              )}
              {analytics.pct_both_sources > 0 && (
                <div
                  className="seg-item seg-both-sources"
                  style={{ width: `${analytics.pct_both_sources}%` }}
                  title={`Chat + Formulário: ${analytics.both_sources_leads} (${analytics.pct_both_sources}%)`}
                >
                  {analytics.pct_both_sources >= 8 && `${analytics.pct_both_sources}%`}
                </div>
              )}
            </div>

            {/* Legenda de Detalhamento da Composição */}
            <div className="lead-source-legend-grid">
              <div className="legend-card legend-chat-only">
                <div className="legend-indicator dot-chat-only" />
                <div className="legend-details">
                  <span className="legend-title">Somente Chat</span>
                  <div className="legend-metrics">
                    <strong className="legend-count">{analytics.chat_only_leads}</strong>
                    <span className="legend-pct">({analytics.pct_chat_only}%)</span>
                  </div>
                  <p className="legend-desc">Leads que conversaram via chat mas não usaram o formulário</p>
                </div>
              </div>

              <div className="legend-card legend-checkout-only">
                <div className="legend-indicator dot-checkout-only" />
                <div className="legend-details">
                  <span className="legend-title">Somente Pré-checkout</span>
                  <div className="legend-metrics">
                    <strong className="legend-count">{analytics.checkout_only_leads}</strong>
                    <span className="legend-pct">({analytics.pct_checkout_only}%)</span>
                  </div>
                  <p className="legend-desc">Leads que preencheram o formulário sem abrir o chat</p>
                </div>
              </div>

              <div className="legend-card legend-both">
                <div className="legend-indicator dot-both" />
                <div className="legend-details">
                  <span className="legend-title">Chat + Pré-checkout</span>
                  <div className="legend-metrics">
                    <strong className="legend-count">{analytics.both_sources_leads}</strong>
                    <span className="legend-pct">({analytics.pct_both_sources}%)</span>
                  </div>
                  <p className="legend-desc">Leads identificados em ambos os canais de contato</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nota Informativa sobre Deduplicação */}
          <div className="lead-source-info-note">
            <Info size={16} className="info-icon" />
            <div>
              <strong>Deduplicação Inteligente de Leads:</strong>
              <p>
                Os leads são consolidados via grafo de componentes conexos considerando Telefone
                E.164, E-mail normalizado e Visitor ID. Um mesmo cliente que inicia pelo Chat e
                depois preenche o Pré-checkout é contado como 1 único lead total, categorizado como
                &quot;Chat + Pré-checkout&quot;.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadSourceDashboard;
