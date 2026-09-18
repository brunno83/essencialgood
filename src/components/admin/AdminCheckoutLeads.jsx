import React, { useState } from 'react';
import {
  Search,
  Download,
  RefreshCw,
  FilterX,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Layers,
  X,
  AlertCircle,
  ShieldCheck,
  Link,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { useAdminCheckoutLeads } from '../../hooks/useAdminCheckoutLeads';
import { isValidCheckoutUrl } from '../../lib/checkoutAllowlist';
import './AdminStyles.css';

export function AdminCheckoutLeads() {
  const {
    page,
    setPage,
    pageSize,
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
    refetch,
    resetFilters,
    exportCSV,
  } = useAdminCheckoutLeads();

  const [copiedPhoneId, setCopiedPhoneId] = useState(null);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  const handleCopyPhone = (phoneStr, id) => {
    if (!phoneStr) return;
    navigator.clipboard.writeText(phoneStr);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const handleCopyRecoveryLink = (checkoutUrl, id, prod, pt) => {
    if (!isValidCheckoutUrl(checkoutUrl, prod, pt)) return;
    navigator.clipboard.writeText(checkoutUrl);
    setCopiedLinkId(id);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const getProductLabel = (prodKey) => {
    const map = {
      slimsoda: 'SlimSoda',
      sonnus: 'Sonnus',
      crowned: 'Crowned',
      linfaflow: 'LinfaFlow',
      memoflow: 'MemoFlow',
    };
    return map[prodKey] || prodKey || 'Geral';
  };

  const getPageTypeLabel = (ptKey) => {
    const map = {
      pdp: 'PDP',
      listicle: 'Listicle',
      adv: 'Advertorial',
      power: 'Power Page',
    };
    return map[ptKey] || ptKey || '-';
  };

  const hasActiveFilters =
    period !== '30d' ||
    product !== 'all' ||
    pageType !== 'all' ||
    search.trim() !== '' ||
    customStartDate !== '' ||
    customEndDate !== '';

  const startRecord = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalItems);

  return (
    <div className="admin-leads-container">
      {/* Cabeçalho Operacional Limpo */}
      <div className="admin-leads-header">
        <div>
          <h1 className="admin-leads-title">Leads do Pré-checkout</h1>
          <p className="admin-leads-subtitle">
            Consulte contatos capturados e utilize o link original de checkout para recuperação de vendas.
          </p>
        </div>

        <div className="admin-leads-actions">
          <button
            className="admin-btn-secondary"
            onClick={refetch}
            disabled={loading}
            title="Atualizar lista"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Atualizar</span>
          </button>

          <button
            className="admin-btn-primary"
            onClick={exportCSV}
            disabled={exporting || loading || totalItems === 0}
            title="Exportar registros filtrados em CSV"
          >
            <Download size={15} />
            <span>{exporting ? 'Gerando CSV...' : 'Exportar CSV'}</span>
          </button>
        </div>
      </div>

      {/* Card de Filtros */}
      <div className="admin-leads-filters-card">
        <div className="admin-leads-filters-grid">
          {/* Busca Textual */}
          <div className="admin-filter-group search-group">
            <label className="admin-filter-label">Buscar Contato</label>
            <div className="admin-search-input-wrapper">
              <Search size={16} className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Nome, e-mail ou telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="admin-search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Limpar busca"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Filtro de Período */}
          <div className="admin-filter-group">
            <label className="admin-filter-label">Período</label>
            <select
              className="admin-filter-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="all">Todo o período</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {/* Datas Personalizadas se 'custom' */}
          {period === 'custom' && (
            <>
              <div className="admin-filter-group">
                <label className="admin-filter-label">Data Inicial</label>
                <input
                  type="date"
                  className="admin-filter-input"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>

              <div className="admin-filter-group">
                <label className="admin-filter-label">Data Final</label>
                <input
                  type="date"
                  className="admin-filter-input"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Filtro de Produto */}
          <div className="admin-filter-group">
            <label className="admin-filter-label">Produto</label>
            <select
              className="admin-filter-select"
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Todos os Produtos</option>
              <option value="slimsoda">SlimSoda</option>
              <option value="sonnus">Sonnus</option>
              <option value="crowned">Crowned</option>
              <option value="linfaflow">LinfaFlow</option>
              <option value="memoflow">MemoFlow</option>
            </select>
          </div>

          {/* Filtro de Tipo de Página */}
          <div className="admin-filter-group">
            <label className="admin-filter-label">Tipo de Página</label>
            <select
              className="admin-filter-select"
              value={pageType}
              onChange={(e) => {
                setPageType(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Todas as Páginas</option>
              <option value="pdp">PDP</option>
              <option value="adv">Advertorial</option>
              <option value="listicle">Listicle</option>
              <option value="power">Power Page</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="admin-filters-footer">
            <button className="admin-btn-text" onClick={resetFilters}>
              <FilterX size={14} />
              <span>Limpar Filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo: Tabela Desktop e Cards Mobile */}
      <div className="admin-leads-content">
        {loading ? (
          <div className="admin-leads-loading">
            <div className="admin-spinner" />
            <span>Carregando leads do pré-checkout...</span>
          </div>
        ) : error ? (
          <div className="admin-leads-error">
            <AlertCircle size={24} />
            <div className="admin-error-text">{error}</div>
            <button className="admin-btn-secondary" onClick={refetch}>
              Tentar Novamente
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="admin-leads-empty">
            <Layers size={36} className="admin-empty-icon" />
            <h3>Nenhum lead encontrado</h3>
            <p>
              {hasActiveFilters
                ? 'Tente ajustar os filtros ou os termos de busca para visualizar os registros.'
                : 'Nenhum formulário pré-checkout foi preenchido no período selecionado.'}
            </p>
            {hasActiveFilters && (
              <button className="admin-btn-secondary" onClick={resetFilters}>
                Limpar Filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Tabela Desktop Operacional */}
            <div className="admin-table-responsive desktop-only">
              <table className="admin-leads-table">
                <thead>
                  <tr>
                    <th>Data / Hora</th>
                    <th>Nome</th>
                    <th>E-mail / Telefone</th>
                    <th>Produto</th>
                    <th>Tipo & Origem</th>
                    <th>Consentimento</th>
                    <th style={{ textAlign: 'right' }}>Recuperação de Vendas</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((item) => {
                    const isUrlValid = isValidCheckoutUrl(item.checkout_url, item.product, item.page_type);
                    return (
                      <tr key={item.id}>
                        <td className="col-date">
                          <span className="lead-date">{formatDate(item.created_at)}</span>
                        </td>

                        <td className="col-name">
                          <div className="lead-name">{item.name}</div>
                        </td>

                        <td className="col-contact">
                          <div className="lead-contact-line">
                            <Mail size={12} />
                            <a href={`mailto:${item.email}`} className="lead-link">
                              {item.email}
                            </a>
                          </div>
                          <div className="lead-contact-line">
                            <Phone size={12} />
                            <a href={`tel:${item.phone}`} className="lead-link">
                              {item.phone}
                            </a>
                            <button
                              className="btn-icon-copy"
                              onClick={() => handleCopyPhone(item.phone, item.id)}
                              title="Copiar telefone"
                            >
                              {copiedPhoneId === item.id ? (
                                <Check size={12} className="text-success" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="col-product">
                          <span className={`badge-product badge-${item.product}`}>
                            {getProductLabel(item.product)}
                          </span>
                        </td>

                        <td className="col-origin">
                          <span className="badge-pagetype">
                            {getPageTypeLabel(item.page_type)}
                          </span>
                          <div className="lead-path-text" title={item.source_path || item.page_title || '-'}>
                            {item.source_path || item.page_title || '-'}
                          </div>
                        </td>

                        <td className="col-consent">
                          <div className="lead-consent-box">
                            <ShieldCheck size={14} className="text-success" />
                            <span>Sim ({formatDate(item.consent_at)})</span>
                          </div>
                        </td>

                        <td className="col-recovery" style={{ textAlign: 'right' }}>
                          {isUrlValid ? (
                            <div className="lead-recovery-actions">
                              <button
                                className="admin-btn-action-copy"
                                onClick={() => handleCopyRecoveryLink(item.checkout_url, item.id, item.product, item.page_type)}
                                title="Copiar link original de checkout para recuperação"
                              >
                                {copiedLinkId === item.id ? (
                                  <>
                                    <Check size={13} className="text-success" />
                                    <span>Link Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Link size={13} />
                                    <span>Copiar Link</span>
                                  </>
                                )}
                              </button>

                              <a
                                href={item.checkout_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-btn-action-open"
                                title="Abrir checkout original em nova aba"
                              >
                                <ExternalLink size={13} />
                              </a>
                            </div>
                          ) : (
                            <span className="lead-url-unavailable" title="A URL gravada não passou na allowlist estrita do produto.">
                              <AlertTriangle size={12} /> Link de recuperação indisponível
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div className="mobile-only admin-leads-cards">
              {leads.map((item) => {
                const isUrlValid = isValidCheckoutUrl(item.checkout_url, item.product, item.page_type);
                return (
                  <div key={item.id} className="admin-lead-card">
                    <div className="lead-card-header">
                      <span className={`badge-product badge-${item.product}`}>
                        {getProductLabel(item.product)}
                      </span>
                      <span className="lead-date">{formatDate(item.created_at)}</span>
                    </div>

                    <div className="lead-card-body">
                      <div className="lead-name">{item.name}</div>

                      <div className="lead-card-field">
                        <Mail size={14} />
                        <a href={`mailto:${item.email}`} className="lead-link">
                          {item.email}
                        </a>
                      </div>

                      <div className="lead-card-field">
                        <Phone size={14} />
                        <a href={`tel:${item.phone}`} className="lead-link">
                          {item.phone}
                        </a>
                        <button
                          className="btn-icon-copy-mobile"
                          onClick={() => handleCopyPhone(item.phone, item.id)}
                          aria-label="Copiar telefone"
                        >
                          {copiedPhoneId === item.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>

                      <div className="lead-card-meta">
                        <span className="badge-pagetype">{getPageTypeLabel(item.page_type)}</span>
                        <span className="lead-path-tag">{item.source_path || '-'}</span>
                      </div>

                      <div className="lead-card-consent">
                        <ShieldCheck size={13} className="text-success" />
                        <span>Consentimento em {formatDate(item.consent_at)}</span>
                      </div>
                    </div>

                    <div className="lead-card-footer-actions">
                      {isUrlValid ? (
                        <>
                          <button
                            className="admin-btn-mobile-copy"
                            onClick={() => handleCopyRecoveryLink(item.checkout_url, item.id, item.product, item.page_type)}
                          >
                            {copiedLinkId === item.id ? <Check size={14} /> : <Link size={14} />}
                            <span>{copiedLinkId === item.id ? 'Link Copiado!' : 'Copiar Link de Recuperação'}</span>
                          </button>

                          <a
                            href={item.checkout_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn-mobile-open"
                            title="Abrir checkout em nova aba"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </>
                      ) : (
                        <span className="lead-url-unavailable" title="A URL gravada não passou na allowlist estrita do produto.">
                          <AlertTriangle size={13} /> Link de recuperação indisponível
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controles de Paginação */}
            <div className="admin-pagination-bar">
              <div className="admin-pagination-info">
                Exibindo <strong>{startRecord}</strong> a <strong>{endRecord}</strong> de{' '}
                <strong>{totalItems}</strong> leads
              </div>

              <div className="admin-pagination-controls">
                <button
                  className="admin-btn-page"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="admin-page-indicator">
                  Página {page} de {totalPages || 1}
                </span>

                <button
                  className="admin-btn-page"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                  aria-label="Próxima página"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminCheckoutLeads;
