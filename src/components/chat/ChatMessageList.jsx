import React, { useRef, useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, Lock } from 'lucide-react';

export function ChatMessageList({
  messages,
  loading,
  error,
  conversationStatus,
  onRetry,
  onStartNewConversation,
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const isClosed = conversationStatus === 'closed';

  const scrollToBottom = (force = false) => {
    if ((!userScrolledUp || force) && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
    setUserScrolledUp(!isNearBottom);
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-msg-list-container" ref={containerRef} onScroll={handleScroll}>
      {loading ? (
        <div className="chat-loading-state">
          <Loader2 size={24} className="chat-spinner" />
          <span>Carregando mensagens...</span>
        </div>
      ) : error ? (
        <div className="chat-error-state">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button className="chat-retry-btn" onClick={onRetry}>
            <RefreshCw size={14} /> Tentar novamente
          </button>
        </div>
      ) : messages.length === 0 ? (
        <div className="chat-empty-state">
          <p>Nenhuma mensagem trocada ainda.</p>
        </div>
      ) : (
        messages.map((msg) => {
          const isVisitor = msg.sender_type === 'visitor';

          return (
            <div
              key={msg.id || msg.created_at}
              className={`chat-msg-row ${isVisitor ? 'visitor' : 'team'}`}
            >
              <div className="chat-msg-bubble">
                {!isVisitor && (
                  <div className="chat-msg-sender-name">
                    Equipe Essencial Good
                  </div>
                )}

                {/* TEXTO PURO SEM DANGEROUSLYSETINNERHTML */}
                <div className="chat-msg-content">{msg.content}</div>

                <div className="chat-msg-time">{formatTime(msg.created_at)}</div>
              </div>
            </div>
          );
        })
      )}

      {/* BANNER SE A CONVERSA FOI ENCERRADA */}
      {isClosed && (
        <div className="chat-closed-notice">
          <Lock size={16} />
          <span>Esta conversa foi encerrada pelo atendimento.</span>
          <button className="chat-new-conv-btn" onClick={onStartNewConversation}>
            Iniciar nova conversa
          </button>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessageList;
