import React from 'react';
import { useVisitorChat } from '../../hooks/useVisitorChat';
import { useChatSettings } from '../../hooks/useChatSettings';
import { ChatWindow } from './ChatWindow';
import './ChatStyles.css';

export function ChatWidget() {
  const { settings } = useChatSettings();
  const {
    isOpen,
    toggleOpen,
    connecting,
    conversation,
    messages,
    loadingMessages,
    error,
    sendError,
    sending,
    unreadCount,
    startConversation,
    sendMessage,
    retryFetchMessages,
    resetForNewConversation,
    isAdminUser,
    checkingAuth,
  } = useVisitorChat();

  // 1. Não renderizar enquanto valida autenticação inicial ou se for perfil administrativo
  if (checkingAuth || isAdminUser) {
    return null;
  }

  // 2. Não renderizar se a configuração is_enabled for falsa (desativada via Admin)
  if (settings && settings.is_enabled === false) {
    return null;
  }

  // 3. Não renderizar em qualquer rota /admin ou /admin/*
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return null;
    }
  }

  return (
    <div className="chat-widget-root">
      {/* JANELA DO CHAT */}
      {isOpen && (
        <ChatWindow
          onClose={toggleOpen}
          connecting={connecting}
          conversation={conversation}
          messages={messages}
          loadingMessages={loadingMessages}
          error={error}
          sendError={sendError}
          sending={sending}
          onStartConversation={startConversation}
          onSendMessage={sendMessage}
          onRetryMessages={retryFetchMessages}
          onStartNewConversation={resetForNewConversation}
          settings={settings}
        />
      )}

      {/* BOTÃO FLUTUANTE DO WIDGET (OCULTO QUANDO ABERTO) */}
      {!isOpen && (
        <button
          className="chat-widget-button"
          onClick={toggleOpen}
          aria-label="Open live support"
          title={settings?.header_title || 'Chat with Essencial Good'}
        >
          <div className="chat-button-symbol-wrapper">
            <img
              src={settings?.avatar_url || '/assets/Brand/essencial-good-symbol.png'}
              alt={settings?.header_title || 'Essencial Good'}
              className="chat-button-symbol"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/Brand/essencial-good-symbol.png';
              }}
            />
          </div>

          {/* BADGE DE NÃO LIDAS */}
          {unreadCount > 0 && (
            <span className="chat-widget-badge" aria-label={`${unreadCount} new messages`}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default ChatWidget;
