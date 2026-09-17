import React from 'react';
import { X } from 'lucide-react';
import { useVisitorChat } from '../../hooks/useVisitorChat';
import { ChatWindow } from './ChatWindow';
import './ChatStyles.css';

export function ChatWidget() {
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

  // 2. Não renderizar em qualquer rota /admin ou /admin/*
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
        />
      )}

      {/* BOTÃO FLUTUANTE DO WIDGET COM SÍMBOLO OFICIAL */}
      <button
        className={`chat-widget-button ${isOpen ? 'active' : ''}`}
        onClick={toggleOpen}
        aria-label={isOpen ? 'Fechar janela de atendimento' : 'Abrir atendimento ao vivo'}
        title={isOpen ? 'Fechar atendimento' : 'Fale com a Essencial Good'}
      >
        {isOpen ? (
          <X size={24} className="chat-button-icon" />
        ) : (
          <img
            src="/assets/brand/essencial-good-symbol.png"
            alt="Essencial Good"
            className="chat-button-symbol"
          />
        )}

        {/* BADGE DE NÃO LIDAS */}
        {!isOpen && unreadCount > 0 && (
          <span className="chat-widget-badge" aria-label={`${unreadCount} novas mensagens`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default ChatWidget;
