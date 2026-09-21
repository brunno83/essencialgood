import React, { useState, useEffect } from 'react';
import { useAdminConversations } from '../../hooks/useAdminConversations';
import { useConversationMessages } from '../../hooks/useConversationMessages';
import { ConversationList } from './ConversationList';
import { ConversationThread } from './ConversationThread';
import { ConversationDetails } from './ConversationDetails';
import { brandSymbol, handleBrandImageError } from '../../assets/brandAssets';
import './AdminStyles.css';

export function AdminConversations({ adminProfile }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'thread' | 'details'

  const {
    conversations,
    loading: loadingConv,
    error: errorConv,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    adminProfilesMap,
    fetchConversations,
    updateConversationStatus,
    updateConversationAssignment,
    archiveConversation,
    restoreConversation,
    deleteConversationPermanently,
    markLocalAsRead,
  } = useAdminConversations(adminProfile);

  const selectedId = selectedConversation?.id || null;

  // Sincroniza estado de conversa selecionada caso ela tenha sido modificada, arquivada ou deletada por outro operador
  useEffect(() => {
    if (!selectedId) return;

    const updatedInList = conversations.find(c => c.id === selectedId);

    if (!updatedInList) {
      // Se a conversa não está mais na lista atual (ex: foi deletada ou movida de aba pelo filtro ativo)
      // Mantém a conversa em memória mas atualiza se necessário
    } else {
      setSelectedConversation(prev => {
        if (!prev) return updatedInList;
        // Atualiza campos como status, archived_at, assigned_admin_id se mudaram
        if (
          prev.status !== updatedInList.status ||
          prev.archived_at !== updatedInList.archived_at ||
          prev.assigned_admin_id !== updatedInList.assigned_admin_id
        ) {
          return { ...prev, ...updatedInList };
        }
        return prev;
      });
    }
  }, [conversations, selectedId]);

  const {
    messages,
    loading: loadingMsg,
    error: errorMsg,
    sending,
    sendError,
    sendMessage,
  } = useConversationMessages(selectedId, markLocalAsRead);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setMobileView('thread');
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  const handleShowDetails = () => {
    setMobileView('details');
  };

  const handleBackToThread = () => {
    setMobileView('thread');
  };

  const handleReopenConversation = async () => {
    if (!selectedConversation) return;
    const { error: err } = await updateConversationStatus(selectedConversation.id, 'open');
    if (!err) {
      setSelectedConversation(prev => (prev ? { ...prev, status: 'open' } : null));
    }
  };

  const handleArchiveConversation = async (id) => {
    const res = await archiveConversation(id);
    if (!res.error) {
      // Se estamos na aba normal (não arquivadas), limpa a seleção e volta para a lista
      if (filterStatus !== 'archived') {
        setSelectedConversation(null);
        setMobileView('list');
      } else {
        setSelectedConversation(prev => (prev && prev.id === id ? { ...prev, archived_at: new Date().toISOString(), status: 'closed' } : prev));
      }
    }
    return res;
  };

  const handleRestoreConversation = async (id) => {
    const res = await restoreConversation(id);
    if (!res.error) {
      if (filterStatus === 'archived') {
        setSelectedConversation(null);
        setMobileView('list');
      } else {
        setSelectedConversation(prev => (prev && prev.id === id ? { ...prev, archived_at: null, archived_by: null } : prev));
      }
    }
    return res;
  };

  const handleDeleteConversation = async (id) => {
    const res = await deleteConversationPermanently(id);
    if (!res.error) {
      setSelectedConversation(null);
      setMobileView('list');
    }
    return res;
  };

  return (
    <div className="admin-conversations-root">
      <div className={`conv-layout-grid mobile-view-${mobileView}`}>
        {/* Painel da Esquerda: Lista de Conversas */}
        <div className="conv-col-list">
          <ConversationList
            conversations={conversations}
            loading={loadingConv}
            error={errorConv}
            selectedId={selectedId}
            onSelectConversation={handleSelectConversation}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRetry={fetchConversations}
          />
        </div>

        {/* Painel Central e Direito: Thread + Detalhes */}
        <div className="conv-col-main">
          {selectedConversation ? (
            <div className={`conv-main-flex mobile-subview-${mobileView}`}>
              <ConversationThread
                conversation={selectedConversation}
                messages={messages}
                loading={loadingMsg}
                error={errorMsg}
                sending={sending}
                sendError={sendError}
                onSendMessage={sendMessage}
                onBackToList={handleBackToList}
                onShowDetails={handleShowDetails}
                onReopenConversation={handleReopenConversation}
                onRestoreConversation={handleRestoreConversation}
                adminProfilesMap={adminProfilesMap}
              />

              <ConversationDetails
                conversation={selectedConversation}
                adminProfile={adminProfile}
                adminProfilesMap={adminProfilesMap}
                onBackToThread={handleBackToThread}
                onUpdateStatus={async (id, newStatus) => {
                  const { error: err } = await updateConversationStatus(id, newStatus);
                  if (!err) {
                    setSelectedConversation(prev => (prev ? { ...prev, status: newStatus } : null));
                  }
                }}
                onUpdateAssignment={async (id, adminId) => {
                  const { error: err } = await updateConversationAssignment(id, adminId);
                  if (!err) {
                    setSelectedConversation(prev => (prev ? { ...prev, assigned_admin_id: adminId } : null));
                  }
                }}
                onArchiveConversation={handleArchiveConversation}
                onRestoreConversation={handleRestoreConversation}
                onDeleteConversation={handleDeleteConversation}
              />
            </div>
          ) : (
            <div className="conv-no-selection">
              <img
                src={brandSymbol}
                alt="Essencial Good"
                className="conv-no-selection-symbol"
                onError={(e) => handleBrandImageError(e, brandSymbol)}
              />
              <h3 className="conv-no-selection-title">Selecione uma conversa</h3>
              <p className="conv-no-selection-desc">Escolha um atendimento na lista ao lado para visualizar o histórico de mensagens e responder ao visitante.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConversations;
