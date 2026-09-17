import React, { useState, useEffect, useRef } from 'react';
import { getWidgetSupabaseClient, sanitizeProductKey } from './widgetSupabaseClient';
import { isAllowedParentOrigin, MSG_TYPES, postToParent } from './widgetMessaging';
import { useVisitorChat } from '../../hooks/useVisitorChat';
import { ChatWindow } from '../chat/ChatWindow';
import { MessageSquare, X } from 'lucide-react';
import { debugLog, incrementDebugCount, isChatDebug } from '../../lib/chatDebug';
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

  useEffect(() => {
    const mountCount = incrementDebugCount('widgetFrameAppMounts');
    debugLog('WidgetFrameApp', 'Mount', { mountCount });

    document.documentElement.classList.add('widget-frame-html');
    document.body.classList.add('widget-frame-body');

    if (isChatDebug()) {
      const handleResize = () => {
        debugLog('WidgetFrameApp', 'Window resize inside iframe', {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
        });
      };
      const handleBlur = () => debugLog('WidgetFrameApp', 'Window blur inside iframe');
      const handleFocus = () => debugLog('WidgetFrameApp', 'Window focus inside iframe');

      window.addEventListener('resize', handleResize);
      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);

      return () => {
        debugLog('WidgetFrameApp', 'Unmount');
        document.documentElement.classList.remove('widget-frame-html');
        document.body.classList.remove('widget-frame-body');
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
      };
    }

    return () => {
      debugLog('WidgetFrameApp', 'Unmount');
      document.documentElement.classList.remove('widget-frame-html');
      document.body.classList.remove('widget-frame-body');
    };
  }, []);

  // Handshake estrito & idempotente: inicializa cliente Supabase UMA ÚNICA VEZ ao receber o primeiro INIT válido
  useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) {
      debugLog('WidgetFrameApp', 'Opened directly or outside iframe - Handshake disabled');
      return;
    }

    let mounted = true;

    const handleMessage = (event) => {
      const origin = event.origin;
      if (!isAllowedParentOrigin(origin)) {
        debugLog('WidgetFrameApp', 'Message rejected - origin not allowed', { origin });
        return;
      }

      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === MSG_TYPES.INIT) {
        const payload = data.payload || {};
        const rawProduct = payload.sourceProduct || 'institucional';
        const cleanProduct = sanitizeProductKey(rawProduct);
        const fingerprint = `${origin}:${cleanProduct}:${payload.sourceUrl || ''}`;

        debugLog('WidgetFrameApp', 'INIT received', { origin, product: cleanProduct, fingerprint });

        // 1. Caso 1: Já inicializado com o mesmo fingerprint (INIT duplicado)
        if (initializedRef.current && fingerprintRef.current === fingerprint) {
          debugLog('WidgetFrameApp', 'Duplicate INIT received - sending ACK and returning without state update');
          postToParent(MSG_TYPES.ACK, { acknowledged: true, product: cleanProduct }, origin);
          return;
        }

        // 2. Caso 2: Conflito de inicialização (fingerprint diferente)
        if (initializedRef.current && fingerprintRef.current !== fingerprint) {
          debugLog('WidgetFrameApp', 'Conflict: Received INIT with different fingerprint - ignored', {
            existing: fingerprintRef.current,
            new: fingerprint,
          });
          return;
        }

        // 3. Caso 3: Primeira inicialização válida
        const clientCount = incrementDebugCount('supabaseClientCreates');
        const client = getWidgetSupabaseClient(cleanProduct);
        if (!client) {
          debugLog('WidgetFrameApp', 'ERROR: Failed to create Supabase client');
          postToParent(MSG_TYPES.ERROR, { message: 'Erro ao inicializar Supabase no iframe' }, origin);
          return;
        }

        debugLog('WidgetFrameApp', 'First valid INIT accepted - creating client', { clientCount, product: cleanProduct });

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

        debugLog('WidgetFrameApp', 'ACK sent to parent', { origin, product: cleanProduct });
        postToParent(MSG_TYPES.ACK, { acknowledged: true, product: cleanProduct }, origin);
      }
    };

    window.addEventListener('message', handleMessage);

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
        debugLog('WidgetFrameApp', 'READY sent to parent candidate origin', { targetOrigin: org });
        postToParent(MSG_TYPES.READY, {}, org);
      });
    };

    sendReadySignal();

    return () => {
      mounted = false;
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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
    const innerMountCount = incrementDebugCount('widgetFrameChatInnerMounts');
    debugLog('WidgetFrameChatInner', 'Mount', { innerMountCount });
    return () => {
      debugLog('WidgetFrameChatInner', 'Unmount');
    };
  }, []);

  const {
    isOpen,
    toggleOpen,
    setChatOpen,
    connecting,
    checkingAuth,
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

  const isInitialMountRef = useRef(true);

  // Listener para estado de inicialização vindo do loader (ESSENCIAL_CHAT_STATE)
  useEffect(() => {
    const handleStateMessage = (event) => {
      if (!isAllowedParentOrigin(event.origin)) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === MSG_TYPES.STATE && data.payload) {
        const loaderIsOpen = Boolean(data.payload.isOpen);
        debugLog('WidgetFrameChatInner', 'STATE message received from parent loader', { loaderIsOpen, currentIsOpen: isOpen });
        if (loaderIsOpen !== isOpen) {
          setChatOpen(loaderIsOpen, 'loader_state_sync');
        }
      }
    };

    window.addEventListener('message', handleStateMessage);
    return () => window.removeEventListener('message', handleStateMessage);
  }, [isOpen, setChatOpen]);

  // Comunicação de OPEN/CLOSE para o loader
  // Regra: NÃO enviar CLOSE na montagem inicial quando isOpen é false por padrão.
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (isOpen) {
        debugLog('WidgetFrameChatInner', 'OPEN sent to parent (initial mount open)', { parentOrigin });
        postToParent(MSG_TYPES.OPEN, {}, parentOrigin);
      }
      return;
    }

    if (isOpen) {
      debugLog('WidgetFrameChatInner', 'OPEN sent to parent (explicit state change)', { parentOrigin });
      postToParent(MSG_TYPES.OPEN, {}, parentOrigin);
    } else {
      debugLog('WidgetFrameChatInner', 'CLOSE sent to parent (explicit state change)', { parentOrigin });
      postToParent(MSG_TYPES.CLOSE, {}, parentOrigin);
    }
  }, [isOpen, parentOrigin]);

  useEffect(() => {
    postToParent(MSG_TYPES.UNREAD, { count: unreadCount }, parentOrigin);
  }, [unreadCount, parentOrigin]);

  return (
    <div className="widget-frame-container">
      <div className="chat-widget-root">
        {isOpen && (
          <ChatWindow
            onClose={() => toggleOpen('header_close_button_click')}
            connecting={connecting}
            checkingAuth={checkingAuth}
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
          onClick={() => toggleOpen('floating_widget_button_click')}
          aria-label={isOpen ? 'Fechar atendimento' : 'Abrir atendimento'}
        >
          {isOpen ? (
            <X size={24} className="chat-button-icon" />
          ) : (
            <img
              src="/assets/Brand/essencial-good-symbol.png"
              alt="Essencial Good"
              className="chat-button-symbol"
            />
          )}
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
