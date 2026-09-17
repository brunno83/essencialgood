import React from 'react';
import { Search, MessageSquare, User, AlertCircle, RefreshCw } from 'lucide-react';
import { getConversationSourceType, formatProductDisplayName } from '../../lib/conversationSource';

export function ConversationList({
  conversations,
  loading,
  error,
  selectedId,
  onSelectConversation,
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onRetry,
}) {
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="conv-badge conv-badge-open">Aberta</span>;
      case 'pending':
        return <span className="conv-badge conv-badge-pending">Pendente</span>;
      case 'closed':
        return <span className="conv-badge conv-badge-closed">Encerrada</span>;
      default:
        return <span className="conv-badge">{status}</span>;
    }
  };

  return (
    <div className="conv-list-panel">
      {/* Busca e Filtros Header */}
      <div className="conv-list-header">
        <div className="conv-search-box">
          <Search size={16} className="conv-search-icon" />
          <input
            type="text"
            className="conv-search-input"
            placeholder="Buscar por nome ou e-mail..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Abas de Filtro */}
        <div className="conv-filter-tabs">
          <button
            className={`conv-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            Todas
          </button>
          <button
            className={`conv-tab ${filterStatus === 'open' ? 'active' : ''}`}
            onClick={() => onFilterChange('open')}
          >
            Abertas
          </button>
          <button
            className={`conv-tab ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => onFilterChange('pending')}
          >
            Pendentes
          </button>
          <button
            className={`conv-tab ${filterStatus === 'closed' ? 'active' : ''}`}
            onClick={() => onFilterChange('closed')}
          >
            Encerradas
          </button>
        </div>
      </div>

      {/* Mensagem de Erro com Tentar Novamente */}
      {error && (
        <div className="conv-list-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button className="conv-retry-btn" onClick={onRetry}>
            <RefreshCw size={14} /> Tentar Novamente
          </button>
        </div>
      )}

      {/* Lista de Conversas / Skeleton Loading */}
      <div className="conv-list-items">
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="conv-skeleton-item">
              <div className="conv-skeleton-avatar" />
              <div className="conv-skeleton-body">
                <div className="conv-skeleton-line short" />
                <div className="conv-skeleton-line long" />
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div className="conv-empty-list">
            <MessageSquare size={36} className="conv-empty-icon" />
            <h4 className="conv-empty-title">Nenhuma conversa encontrada</h4>
            <p className="conv-empty-text">
              {searchQuery || filterStatus !== 'all'
                ? 'Nenhum resultado corresponde aos filtros aplicados.'
                : 'Quando os visitantes enviarem mensagens pelo site público, as conversas aparecerão aqui.'}
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const visitorDisplayName =
              conv.visitor_name ||
              (conv.visitor_email ? conv.visitor_email.split('@')[0] : null) ||
              `Visitante #${conv.visitor_id ? conv.visitor_id.slice(0, 6) : 'anon'}`;

            const isSelected = selectedId === conv.id;
            const hasUnread = conv.unreadCount > 0;
            const sourceType = getConversationSourceType(conv);
            const productDisplayName = formatProductDisplayName(conv.source_product);

            return (
              <div
                key={conv.id}
                className={`conv-item ${isSelected ? 'selected' : ''} ${hasUnread ? 'unread' : ''}`}
                onClick={() => onSelectConversation(conv)}
              >
                <div className="conv-item-avatar">
                  <User size={20} />
                </div>

                <div className="conv-item-content">
                  <div className="conv-item-top">
                    <span className="conv-item-name">{visitorDisplayName}</span>
                    <span className="conv-item-time">{formatTime(conv.last_message_at)}</span>
                  </div>

                  <div className="conv-item-sub">
                    <span className="conv-item-email">
                      {conv.visitor_email || `ID: ${conv.visitor_id?.slice(0, 8)}...`}
                    </span>
                    {getStatusBadge(conv.status)}
                  </div>

                  {/* Linha de Origem e Produto */}
                  <div className="conv-badges-wrap" style={{ display: 'flex', gap: '4px', marginTop: '2px', flexWrap: 'wrap' }}>
                    <span className="conv-badge conv-badge-product">
                      {productDisplayName}
                    </span>
                    <span className="conv-badge conv-badge-source-type">
                      {sourceType}
                    </span>
                  </div>

                  {conv.lastMessage && (
                    <div className="conv-item-preview">
                      <span className="conv-preview-sender">
                        {conv.lastMessage.sender_type === 'visitor' ? 'Visitante:' : 'Equipe:'}
                      </span>{' '}
                      {conv.lastMessage.content}
                    </div>
                  )}
                </div>

                {hasUnread && (
                  <div className="conv-unread-badge" title={`${conv.unreadCount} mensagens não lidas`}>
                    {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConversationList;
