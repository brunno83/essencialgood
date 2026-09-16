import React, { useState } from 'react';
import { useAdminConversations } from '../../hooks/useAdminConversations';
import { useConversationMessages } from '../../hooks/useConversationMessages';
import { ConversationList } from './ConversationList';
import { ConversationThread } from './ConversationThread';
import { ConversationDetails } from './ConversationDetails';
import { MessageSquare } from 'lucide-react';
import './AdminStyles.css';

export function AdminConversations({ adminProfile }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'thread'

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
    markLocalAsRead,
  } = useAdminConversations(adminProfile);

  const selectedId = selectedConversation?.id || null;

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

  const handleReopenConversation = async () => {
    if (!selectedConversation) return;
    const { error: err } = await updateConversationStatus(selectedConversation.id, 'open');
    if (!err) {
      setSelectedConversation(prev => (prev ? { ...prev, status: 'open' } : null));
    }
  };

  return (
    <div className="admin-conversations-root">
      <div className={`conv-layout-grid ${mobileView === 'thread' ? 'mobile-thread-active' : ''}`}>
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
            <div className="conv-main-flex">
              <ConversationThread
                conversation={selectedConversation}
                messages={messages}
                loading={loadingMsg}
                error={errorMsg}
                sending={sending}
                sendError={sendError}
                onSendMessage={sendMessage}
                onBackToList={handleBackToList}
                onReopenConversation={handleReopenConversation}
                adminProfilesMap={adminProfilesMap}
              />

              <ConversationDetails
                conversation={selectedConversation}
                adminProfile={adminProfile}
                adminProfilesMap={adminProfilesMap}
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
              />
            </div>
          ) : (
            <div className="conv-no-selection">
              <MessageSquare size={48} className="conv-no-selection-icon" />
              <h3>Selecione um atendimento</h3>
              <p>Escolha uma conversa na lista à esquerda para visualizar o histórico de mensagens e responder ao visitante.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConversations;
