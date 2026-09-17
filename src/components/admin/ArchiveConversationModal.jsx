import React, { useEffect, useRef } from 'react';
import { Archive, AlertCircle, Loader2, X } from 'lucide-react';

export function ArchiveConversationModal({
  isOpen,
  conversation,
  onClose,
  onConfirm,
  loading = false,
  error = null,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !conversation) return null;

  const visitorDisplayName =
    conversation.visitor_name ||
    (conversation.visitor_email ? conversation.visitor_email.split('@')[0] : null) ||
    `Visitante #${conversation.visitor_id ? conversation.visitor_id.slice(0, 6) : 'anon'}`;

  return (
    <div className="conv-modal-overlay" onClick={() => !loading && onClose()}>
      <div
        className="conv-modal-container"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-modal-title"
      >
        <div className="conv-modal-header">
          <div className="conv-modal-title-wrap">
            <Archive size={20} className="conv-icon-archive" />
            <h3 id="archive-modal-title">Arquivar Atendimento</h3>
          </div>
          <button
            className="conv-modal-close-btn"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="conv-modal-body">
          <p className="conv-modal-desc">
            Tem certeza que deseja arquivar a conversa com <strong>{visitorDisplayName}</strong>?
          </p>

          <div className="conv-modal-info-box">
            <span>• O atendimento será movido para a aba <strong>Arquivadas</strong>.</span>
            <span>• Novas mensagens de visitantes ou da equipe serão <strong>bloqueadas</strong> até a restauração.</span>
            <span>• O histórico de mensagens será 100% preservado e poderá ser consultado a qualquer momento.</span>
          </div>

          {error && (
            <div className="conv-modal-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="conv-modal-footer">
          <button
            className="conv-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="conv-btn-archive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="admin-spinner" /> Arquivando...
              </>
            ) : (
              'Arquivar Conversa'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArchiveConversationModal;
