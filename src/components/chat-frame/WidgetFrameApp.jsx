import React, { useState, useEffect } from 'react';
import { getWidgetSupabaseClient } from './widgetSupabaseClient';
import { isAllowedParentOrigin, MSG_TYPES, postToParent } from './widgetMessaging';
import { useVisitorChat } from '../../hooks/useVisitorChat';
import { ChatWindow } from '../chat/ChatWindow';
import { MessageSquare, X } from 'lucide-react';
import '../chat/ChatStyles.css';
import './WidgetFrameStyles.css';

export function WidgetFrameApp() {
  const [initialized, setInitialized] = useState(false);
  const [parentOrigin, setParentOrigin] = useState(null);
  const [sourceMetadata, setSourceMetadata] = useState(null);
  const [supabaseClient, setSupabaseClient] = useState(null);

  // Aplica classe de isolamento de scroll apenas enquanto a rota /widget-frame estiver ativa
  useEffect(() => {
    document.body.classList.add('widget-frame-body');
    return () => {
      document.body.classList.remove('widget-frame-body');
    };
  }, []);

  // 1. Escuta a mensagem ESSENCIAL_CHAT_INIT e envia ESSENCIAL_CHAT_READY no mount
  useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) return;

    const handleMessage = (event) => {
      const origin = event.origin;
      if (!isAllowedParentOrigin(origin)) return;

      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === MSG_TYPES.INIT) {
        const payload = data.payload || {};
        const product = payload.sourceProduct || 'institucional';

        const client = getWidgetSupabaseClient(product);
        if (!client) {
          postToParent(MSG_TYPES.ERROR, { message: 'Erro ao inicializar Supabase no iframe' }, origin);
          return;
        }

        setParentOrigin(origin);
        setSourceMetadata({
          source_url: payload.sourceUrl || null,
          source_path: payload.sourcePath || null,
          source_host: payload.sourceHost || null,
          source_title: payload.sourceTitle || null,
          source_product: payload.sourceProduct || 'institucional',
        });
        setSupabaseClient(client);
        setInitialized(true);
      }
    };

    window.addEventListener('message', handleMessage);

    // Tenta enviar o evento READY para o pai
    let targetOrigin = null;
    try {
      if (document.referrer) {
        const refUrl = new URL(document.referrer);
        if (isAllowedParentOrigin(refUrl.origin)) {
          targetOrigin = refUrl.origin;
        }
      }
    } catch (e) {}

    if (!targetOrigin && import.meta.env.DEV) {
      targetOrigin = window.location.origin;
    }

    if (targetOrigin) {
      postToParent(MSG_TYPES.READY, {}, targetOrigin);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Sem handshake válido, não renderiza chat nem acessa o banco
  if (!initialized || !supabaseClient || !parentOrigin) {
    return <div className="widget-frame-container" style={{ background: 'transparent' }} />;
  }

  return (
    <WidgetFrameChatInner
      supabaseClient={supabaseClient}
      sourceMetadata={sourceMetadata}
      parentOrigin={parentOrigin}
    />
  );
}

function WidgetFrameChatInner({ supabaseClient, sourceMetadata, parentOrigin }) {
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
  } = useVisitorChat({
    client: supabaseClient,
    sourceOverride: sourceMetadata,
  });

  // Avisa a página hospedeira sobre abertura/fechamento do chat para redimensionar a caixa do Iframe
  useEffect(() => {
    if (isOpen) {
      postToParent(MSG_TYPES.OPEN, {}, parentOrigin);
    } else {
      postToParent(MSG_TYPES.CLOSE, {}, parentOrigin);
    }
  }, [isOpen, parentOrigin]);

  // Avisa a página hospedeira sobre o número de mensagens não lidas
  useEffect(() => {
    postToParent(MSG_TYPES.UNREAD, { count: unreadCount }, parentOrigin);
  }, [unreadCount, parentOrigin]);

  return (
    <div className="widget-frame-container">
      <div className="chat-widget-root">
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

        <button
          className={`chat-widget-button ${isOpen ? 'active' : ''}`}
          onClick={toggleOpen}
          aria-label={isOpen ? 'Fechar atendimento' : 'Abrir atendimento'}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          {!isOpen && unreadCount > 0 && (
            <span className="chat-widget-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default WidgetFrameApp;
