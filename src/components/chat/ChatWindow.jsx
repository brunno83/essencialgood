import React from 'react';
import { X, Loader2, MessageSquare } from 'lucide-react';
import { ChatWelcomeForm } from './ChatWelcomeForm';
import { ChatMessageList } from './ChatMessageList';
import { ChatComposer } from './ChatComposer';

export function ChatWindow({
  onClose,
  connecting,
  checkingAuth,
  conversation,
  messages,
  loadingMessages,
  error,
  sendError,
  sending,
  onStartConversation,
  onSendMessage,
  onRetryMessages,
  onStartNewConversation,
}) {
  const isClosed = conversation?.status === 'closed';
  const isBooting = connecting || checkingAuth;

  return (
    <div className="chat-window-container" role="dialog" aria-label="Janela de Atendimento Essencial Good">
      {/* CABEÇALHO */}
      <div className="chat-window-header">
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="chat-header-title">Essencial Good</h3>
            <span className="chat-header-status">
              <span className="chat-status-dot" /> Atendimento Ao Vivo
            </span>
          </div>
        </div>

        <button
          className="chat-close-btn"
          onClick={onClose}
          aria-label="Fechar janela de atendimento"
        >
          <X size={20} />
        </button>
      </div>

      {/* CORPO DA JANELA */}
      <div className="chat-window-body">
        {isBooting ? (
          <div className="chat-window-connecting">
            <Loader2 size={32} className="chat-spinner" />
            <p>Conectando ao atendimento...</p>
          </div>
        ) : !conversation ? (
          <ChatWelcomeForm
            onSubmit={onStartConversation}
            sending={sending}
            error={sendError || error}
          />
        ) : (
          <>
            <ChatMessageList
              messages={messages}
              loading={loadingMessages}
              error={error}
              conversationStatus={conversation.status}
              onRetry={onRetryMessages}
              onStartNewConversation={onStartNewConversation}
            />
            <ChatComposer
              onSendMessage={onSendMessage}
              sending={sending}
              disabled={isClosed}
              sendError={sendError}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
