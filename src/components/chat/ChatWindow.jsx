import React from 'react';
import { X, Loader2 } from 'lucide-react';
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
  settings,
}) {
  const isClosed = conversation?.status === 'closed';
  const isBooting = connecting || checkingAuth;

  const headerTitle = settings?.header_title || 'Essencial Good';
  const headerSubtitle = settings?.header_subtitle || 'Live Support';
  const avatarUrl = settings?.avatar_url || '/assets/Brand/essencial-good-symbol.png';

  return (
    <div className="chat-window-container" role="dialog" aria-label="Essencial Good Live Support Window">
      {/* CABEÇALHO */}
      <div className="chat-window-header">
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            <img
              src={avatarUrl}
              alt={headerTitle}
              className="chat-header-symbol-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/Brand/essencial-good-symbol.png';
              }}
            />
          </div>
          <div>
            <h3 className="chat-header-title">{headerTitle}</h3>
            <span className="chat-header-status">
              <span className="chat-status-dot" /> {headerSubtitle}
            </span>
          </div>
        </div>

        <button
          className="chat-close-btn"
          onClick={onClose}
          aria-label="Close live support window"
        >
          <X size={20} />
        </button>
      </div>

      {/* CORPO DA JANELA */}
      <div className="chat-window-body">
        {isBooting ? (
          <div className="chat-window-connecting">
            <Loader2 size={32} className="chat-spinner" />
            <p>Connecting to support...</p>
          </div>
        ) : !conversation ? (
          <ChatWelcomeForm
            onSubmit={onStartConversation}
            sending={sending}
            error={sendError || error}
            settings={settings}
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
              agentName={settings?.agent_name}
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
