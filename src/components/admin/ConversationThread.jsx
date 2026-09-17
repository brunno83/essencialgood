import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Check, CheckCheck, Lock, AlertCircle, Loader2, User, Shield, Info } from 'lucide-react';

export function ConversationThread({
  conversation,
  messages,
  loading,
  error,
  sending,
  sendError,
  onSendMessage,
  onBackToList,
  onShowDetails,
  onReopenConversation,
  adminProfilesMap,
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const threadContainerRef = useRef(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const isClosed = conversation?.status === 'closed';

  // Rola para o final da lista de mensagens isoladamente sem mover a página pai
  const scrollToBottom = (force = false) => {
    if ((!userScrolledUp || force) && threadContainerRef.current) {
      threadContainerRef.current.scrollTo({
        top: threadContainerRef.current.scrollHeight,
        behavior: force ? 'auto' : 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Monitora o scroll para evitar forçar a rolagem quando o atendente está lendo o histórico
  const handleScroll = () => {
    if (!threadContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = threadContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setUserScrolledUp(!isNearBottom);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending || isClosed) return;

    const { error: err } = await onSendMessage(text);
    if (!err) {
      setInputText('');
      setUserScrolledUp(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  const formatMessageTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const visitorDisplayName =
    conversation?.visitor_name ||
    (conversation?.visitor_email ? conversation.visitor_email.split('@')[0] : null) ||
    `Visitante #${conversation?.visitor_id ? conversation.visitor_id.slice(0, 6) : 'anon'}`;

  return (
    <div className="conv-thread-panel">
      {/* Header do Chat (Mobile + Desktop) */}
      <div className="conv-thread-header">
        <button
          className="conv-mobile-back-btn"
          onClick={onBackToList}
          aria-label="Voltar para a lista de conversas"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="conv-thread-header-info">
          <div className="conv-header-avatar">
            <User size={20} />
          </div>
          <div>
            <h3 className="conv-header-title">{visitorDisplayName}</h3>
            <span className="conv-header-sub">
              {conversation?.visitor_email || `ID: ${conversation?.visitor_id}`}
            </span>
          </div>
        </div>

        {onShowDetails && (
          <button
            className="conv-mobile-info-btn"
            onClick={onShowDetails}
            aria-label="Ver detalhes da conversa"
            title="Detalhes do Atendimento"
          >
            <Info size={20} />
          </button>
        )}
      </div>

      {/* Mensagem de Erro de Carregamento */}
      {error && (
        <div className="conv-thread-alert error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* ÁREA DE MENSAGENS */}
      <div
        className="conv-thread-messages"
        ref={threadContainerRef}
        onScroll={handleScroll}
      >
        {loading ? (
          <div className="conv-thread-loading">
            <Loader2 className="admin-spinner" size={28} />
            <span>Carregando histórico...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="conv-thread-empty">
            <Shield size={32} style={{ color: '#4b5563' }} />
            <p>Nenhuma mensagem trocada nesta conversa ainda.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isVisitor = msg.sender_type === 'visitor';
            const senderProfile = adminProfilesMap?.[msg.sender_id];
            const senderName = senderProfile
              ? senderProfile.full_name
              : msg.sender_type === 'admin'
              ? 'Administrador'
              : msg.sender_type === 'agent'
              ? 'Agente'
              : 'Visitante';

            return (
              <div
                key={msg.id}
                className={`conv-msg-row ${isVisitor ? 'visitor' : 'team'}`}
              >
                <div className="conv-msg-bubble">
                  {!isVisitor && (
                    <div className="conv-msg-sender">
                      {senderName} • <span className="conv-sender-role">{msg.sender_type}</span>
                    </div>
                  )}

                  {/* RENDERIZAÇÃO DE TEXTO PURO (SEM DANGEROUSLYSETINNERHTML) */}
                  <div className="conv-msg-text">{msg.content}</div>

                  <div className="conv-msg-meta">
                    <span className="conv-msg-time">{formatMessageTime(msg.created_at)}</span>
                    {!isVisitor && (
                      <span className="conv-msg-status" title={msg.read_at ? 'Lida pelo visitante' : 'Enviada'}>
                        {msg.read_at ? (
                          <CheckCheck size={14} className="conv-icon-read" />
                        ) : (
                          <Check size={14} className="conv-icon-sent" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ALERTA SE A CONVERSA ESTIVER ENCERRADA */}
      {isClosed ? (
        <div className="conv-closed-banner">
          <Lock size={18} />
          <span>Esta conversa está encerrada. Reabra a conversa para enviar novas mensagens.</span>
          <button className="conv-btn-reopen" onClick={onReopenConversation}>
            Reabrir Conversa
          </button>
        </div>
      ) : (
        /* ÁREA DE DIGITAÇÃO E ENVIO */
        <div className="conv-thread-input-area">
          {sendError && (
            <div className="conv-send-error">
              <AlertCircle size={14} />
              <span>{sendError}</span>
            </div>
          )}

          <div className="conv-input-row">
            <textarea
              className="conv-textarea"
              placeholder="Digite sua resposta... (Enter envia, Shift+Enter pula linha)"
              value={inputText}
              onChange={(e) => {
                if (e.target.value.length <= 4000) {
                  setInputText(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              disabled={sending}
              rows={2}
            />

            <button
              className="conv-btn-send"
              onClick={handleSend}
              disabled={sending || !inputText.trim()}
              title="Enviar resposta"
              aria-label="Enviar resposta"
            >
              {sending ? <Loader2 size={18} className="admin-spinner" /> : <Send size={18} />}
            </button>
          </div>

          <div className="conv-char-counter">
            {inputText.length} / 4000 caracteres
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversationThread;
