import React, { useState, useEffect, useRef } from 'react';
import { getWidgetSupabaseClient, sanitizeProductKey } from './widgetSupabaseClient';
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

  const initializedRef = useRef(false);
  const clientRef = useRef(null);
  const fingerprintRef = useRef(null);
  const sourceMetadataRef = useRef(null);
  const parentOriginRef = useRef(null);

  // Aplica classe de isolamento de scroll e transparência enquanto a rota /widget-frame estiver ativa
  useEffect(() => {
    document.documentElement.classList.add('widget-frame-html');
    document.body.classList.add('widget-frame-body');
    return () => {
      document.documentElement.classList.remove('widget-frame-html');
      document.body.classList.remove('widget-frame-body');
    };
  }, []);

  // Handshake estrito & idempotente: inicializa cliente Supabase UMA ÚNICA VEZ ao receber o primeiro INIT válido
  useEffect(() => {
    // Se não estiver rodando dentro de um iframe (ex: abertura direta de /widget-frame), não faz nada
    if (typeof window === 'undefined' || window.parent === window) return;

    let mounted = true;

    const handleMessage = (event) => {
      const origin = event.origin;
      if (!isAllowedParentOrigin(origin)) return;

      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === MSG_TYPES.INIT) {
        const payload = data.payload || {};
        const rawProduct = payload.sourceProduct || 'institucional';
        const cleanProduct = sanitizeProductKey(rawProduct);
        const fingerprint = `${origin}:${cleanProduct}:${payload.sourceUrl || ''}`;

        if (import.meta.env.DEV) {
          console.log('[WidgetHandshake] INIT received:', { origin, product: cleanProduct, fingerprint });
        }

        // 1. Caso 1: Já inicializado com o mesmo fingerprint (INIT duplicado)
        if (initializedRef.current && fingerprintRef.current === fingerprint) {
          if (import.meta.env.DEV) {
            console.log('[WidgetHandshake] Duplicate INIT received, sending ACK and returning without state update.');
          }
          // Apenas re-envia ACK e não altera nenhum estado React para não causar re-render ou reset de chat
          postToParent(MSG_TYPES.ACK, { acknowledged: true, product: cleanProduct }, origin);
          return;
        }

        // 2. Caso 2: Já inicializado com fingerprint diferente (mudança indevida de origem/produto no meio da sessão)
        if (initializedRef.current && fingerprintRef.current !== fingerprint) {
          if (import.meta.env.DEV) {
            console.warn('[WidgetHandshake] Conflict: Received INIT with different fingerprint after initialization. Ignoring.', {
              existing: fingerprintRef.current,
              new: fingerprint,
            });
          }
          return;
        }

        // 3. Caso 3: Primeira inicialização válida
        const client = getWidgetSupabaseClient(cleanProduct);
        if (!client) {
          postToParent(MSG_TYPES.ERROR, { message: 'Erro ao inicializar Supabase no iframe' }, origin);
          return;
        }

        if (import.meta.env.DEV) {
          console.log('[WidgetHandshake] First valid INIT accepted, creating client & marking initialized.');
        }

        initializedRef.current = true;
        fingerprintRef.current = fingerprint;
        clientRef.current = client;

        const metadata = {
          source_url: payload.sourceUrl || null,
          source_path: payload.sourcePath || null,
          source_host: payload.sourceHost || null,
          source_title: payload.sourceTitle || null,
          source_product: cleanProduct,
        };
        sourceMetadataRef.current = metadata;
        parentOriginRef.current = origin;

        if (mounted) {
          setParentOrigin(origin);
          setSourceMetadata(metadata);
          setSupabaseClient(client);
          setInitialized(true);
        }

        // Envia ACK explícito informando à página pai que a inicialização foi concluída com sucesso
        if (import.meta.env.DEV) {
          console.log('[WidgetHandshake] ACK sent to origin:', origin);
        }
        postToParent(MSG_TYPES.ACK, { acknowledged: true, product: cleanProduct }, origin);
      }
    };

    window.addEventListener('message', handleMessage);

    // Envia o sinal READY inicial exclusivamente para a janela pai em origens validadas
    const sendReadySignal = () => {
      const candidateOrigins = new Set();
      try {
        if (document.referrer) {
          const refUrl = new URL(document.referrer);
          if (isAllowedParentOrigin(refUrl.origin)) {
            candidateOrigins.add(refUrl.origin);
          }
        }
      } catch (e) {}

      if (isAllowedParentOrigin(window.location.origin)) {
        candidateOrigins.add(window.location.origin);
      }
      if (isAllowedParentOrigin('https://www.essencialgood.com')) {
        candidateOrigins.add('https://www.essencialgood.com');
      }

      candidateOrigins.forEach((org) => {
        if (import.meta.env.DEV) {
          console.log('[WidgetHandshake] READY sent to target origin:', org);
        }
        postToParent(MSG_TYPES.READY, {}, org);
      });
    };

    sendReadySignal();

    return () => {
      mounted = false;
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Sem handshake INIT válido recebido, não inicializa cliente, nem sessão, nem renderiza o chat
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
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[WidgetHandshake] WidgetFrameChatInner mounted');
    }
    return () => {
      if (import.meta.env.DEV) {
        console.log('[WidgetHandshake] WidgetFrameChatInner unmounted');
      }
    };
  }, []);

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
      if (import.meta.env.DEV) {
        console.log('[WidgetHandshake] OPEN sent to parent:', parentOrigin);
      }
      postToParent(MSG_TYPES.OPEN, {}, parentOrigin);
    } else {
      if (import.meta.env.DEV) {
        console.log('[WidgetHandshake] CLOSE sent to parent:', parentOrigin);
      }
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
