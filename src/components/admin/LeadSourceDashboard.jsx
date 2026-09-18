import React from 'react';
import { RefreshCw, Users, AlertCircle } from 'lucide-react';
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
      {/* Cabeçalho Limpo */}
      <div className="lead-source-header">
        <div className="lead-source-header-title">
          <h2>Origem dos Leads</h2>
          <p className="lead-source-subtitle">
            Acompanhe como os leads chegam e identifique contatos presentes nos dois canais.
          </p>
        </div>

        <button
          onClick={refetch}
          disabled={loading}
          className="dash-retry-inline-btn lead-source-refresh-btn"
          title="Atualizar dados"
        >
          <RefreshCw size={13} className={loading ? 'chat-spinner' : ''} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Área de Filtros Limpa */}
      <div className="lead-source-filters-grid">
        <div className="lead-source-filter-item">
          <label htmlFor="lead-source-preset">Período</label>
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
        </div>

        <div className="lead-source-filter-item">
          <label htmlFor="lead-source-product">Produto</label>
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

        <div className="lead-source-filter-item">
          <label htmlFor="lead-source-pagetype">Tipo de Página</label>
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
          <AlertCircle size={16} />
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
          <Users size={32} className="dash-empty-icon" />
          <h3>Nenhum lead encontrado</h3>
          <p>
            Não foram encontrados registros para o período e filtros selecionados. Tente alterar os
            filtros acima.
          </p>
        </div>
      ) : (
        /* Conteúdo Principal do Dashboard */
        <div className="lead-source-content">
          {/* Grid de 4 Cards KPI Sóbrios */}
          <div className="lead-source-kpi-grid">
            {/* Card 1: Total Único */}
            <div className="lead-source-kpi-card">
              <span className="kpi-label">Leads únicos</span>
              <strong className="kpi-value">{analytics.total_unique_leads}</strong>
              <span className="kpi-subtext">Contatos consolidados</span>
            </div>

            {/* Card 2: Chat */}
            <div className="lead-source-kpi-card">
              <span className="kpi-label">Chat</span>
              <strong className="kpi-value">{analytics.total_chat_leads}</strong>
              <span className="kpi-subtext">
                Contatos que iniciaram conversa ({analytics.pct_chat_reach}%)
              </span>
            </div>

            {/* Card 3: Pré-checkout */}
            <div className="lead-source-kpi-card">
              <span className="kpi-label">Pré-checkout</span>
              <strong className="kpi-value">{analytics.total_checkout_leads}</strong>
              <span className="kpi-subtext">
                Contatos que preencheram formulário ({analytics.pct_checkout_reach}%)
              </span>
            </div>

            {/* Card 4: Ambos os canais */}
            <div className="lead-source-kpi-card">
              <span className="kpi-label">Ambos os canais</span>
              <strong className="kpi-value">{analytics.both_sources_leads}</strong>
              <span className="kpi-subtext">
                Contatos presentes nas duas origens ({analytics.pct_both_sources}%)
              </span>
            </div>
          </div>

          {/* Painel Único de Distribuição por Origem */}
          <div className="lead-source-composition-panel">
            <div className="lead-source-panel-title">
              <h3>Distribuição por origem</h3>
              <span className="lead-source-total-text">Total: {total} leads únicos</span>
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
                />
              )}
              {analytics.pct_checkout_only > 0 && (
                <div
                  className="seg-item seg-checkout-only"
                  style={{ width: `${analytics.pct_checkout_only}%` }}
                  title={`Somente Pré-checkout: ${analytics.checkout_only_leads} (${analytics.pct_checkout_only}%)`}
                />
              )}
              {analytics.pct_both_sources > 0 && (
                <div
                  className="seg-item seg-both-sources"
                  style={{ width: `${analytics.pct_both_sources}%` }}
                  title={`Chat + Pré-checkout: ${analytics.both_sources_leads} (${analytics.pct_both_sources}%)`}
                />
              )}
            </div>

            {/* Legenda Compacta de 3 Colunas */}
            <div className="lead-source-legend-compact">
              <div className="legend-item">
                <div className="legend-dot dot-chat-only" />
                <div className="legend-info">
                  <span className="legend-name">Somente Chat</span>
                  <div className="legend-value-line">
                    <strong className="legend-num">{analytics.chat_only_leads}</strong>
                    <span className="legend-percent">({analytics.pct_chat_only}%)</span>
                  </div>
                </div>
              </div>

              <div className="legend-item">
                <div className="legend-dot dot-checkout-only" />
                <div className="legend-info">
                  <span className="legend-name">Somente Pré-checkout</span>
                  <div className="legend-value-line">
                    <strong className="legend-num">{analytics.checkout_only_leads}</strong>
                    <span className="legend-percent">({analytics.pct_checkout_only}%)</span>
                  </div>
                </div>
              </div>

              <div className="legend-item">
                <div className="legend-dot dot-both" />
                <div className="legend-info">
                  <span className="legend-name">Chat + Pré-checkout</span>
                  <div className="legend-value-line">
                    <strong className="legend-num">{analytics.both_sources_leads}</strong>
                    <span className="legend-percent">({analytics.pct_both_sources}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nota Neutra sobre Deduplicação */}
          <p className="lead-source-footnote">
            Contatos com o mesmo telefone, e-mail ou identificação são contabilizados uma única vez.
          </p>
        </div>
      )}
    </div>
  );
}

export default LeadSourceDashboard;
