import React, { useState, useEffect, useRef } from 'react';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';

export function DeleteConversationModal({
  isOpen,
  conversation,
  onClose,
  onConfirm,
  loading = false,
  error = null,
}) {
  const [confirmText, setConfirmText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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

  const isConfirmed = confirmText.trim() === 'EXCLUIR';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isConfirmed && !loading) {
      onConfirm();
    }
  };

  return (
    <div className="conv-modal-overlay danger" onClick={() => !loading && onClose()}>
      <div
        className="conv-modal-container danger"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="conv-modal-header danger">
          <div className="conv-modal-title-wrap danger">
            <AlertTriangle size={22} className="conv-icon-danger" />
            <h3 id="delete-modal-title">Exclusão Permanente de Conversa</h3>
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

        <form onSubmit={handleSubmit} className="conv-modal-body">
          <div className="conv-modal-warning-banner">
            <strong>AVISO DE EXCLUSÃO DEFINITIVA:</strong>
            <p>
              Esta ação apaga permanentemente a conversa e todas as mensagens vinculadas do banco de dados. <strong>Esta operação não pode ser desfeita.</strong>
            </p>
          </div>

          <div className="conv-modal-details-grid">
            <div className="conv-modal-detail-row">
              <span>Visitante:</span>
              <strong>{visitorDisplayName}</strong>
            </div>
            <div className="conv-modal-detail-row">
              <span>E-mail:</span>
              <strong>{conversation.visitor_email || 'Não informado'}</strong>
            </div>
            <div className="conv-modal-detail-row">
              <span>Status Atual:</span>
              <strong style={{ color: '#ef4444' }}>Arquivada (Pronta para exclusão)</strong>
            </div>
          </div>

          <div className="conv-modal-confirm-input-wrap">
            <label htmlFor="delete-confirm-input" className="conv-modal-label">
              Digite a palavra <strong>EXCLUIR</strong> para confirmar:
            </label>
            <input
              id="delete-confirm-input"
              ref={inputRef}
              type="text"
              className="conv-modal-input danger"
              placeholder="Digite EXCLUIR em maiúsculas"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="conv-modal-error">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="conv-modal-footer">
            <button
              type="button"
              className="conv-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="conv-btn-delete-permanent"
              disabled={!isConfirmed || loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="admin-spinner" /> Excluindo...
                </>
              ) : (
                <>
                  <Trash2 size={16} /> Excluir Permanentemente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteConversationModal;
