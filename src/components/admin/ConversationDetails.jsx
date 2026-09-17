import React, { useState } from 'react';
import { User, Calendar, Clock, UserCheck, Shield, Globe, ExternalLink, ArrowLeft, Archive, RotateCcw, Trash2 } from 'lucide-react';
import {
  getConversationSourceType,
  formatProductDisplayName,
  isAllowedSourceUrl,
} from '../../lib/conversationSource';
import ArchiveConversationModal from './ArchiveConversationModal';
import DeleteConversationModal from './DeleteConversationModal';

export function ConversationDetails({
  conversation,
  adminProfile,
  adminProfilesMap,
  onUpdateStatus,
  onUpdateAssignment,
  onArchiveConversation,
  onRestoreConversation,
  onDeleteConversation,
  onBackToThread,
}) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  if (!conversation) return null;

  const isAdmin = adminProfile?.role === 'admin';
  const isArchived = Boolean(conversation.archived_at);

  const assignedProfile = conversation.assigned_admin_id
    ? adminProfilesMap[conversation.assigned_admin_id]
    : null;

  const archivedByProfile = conversation.archived_by
    ? adminProfilesMap[conversation.archived_by]
    : null;

  const isAssignedToMe = conversation.assigned_admin_id === adminProfile?.id;
  const sourceType = getConversationSourceType(conversation);
  const productDisplayName = formatProductDisplayName(conversation.source_product);
  const canOpenLink = isAllowedSourceUrl(conversation.source_url);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString([], {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus !== conversation.status) {
      onUpdateStatus(conversation.id, newStatus);
    }
  };

  const handleAssignToMe = () => {
    onUpdateAssignment(conversation.id, adminProfile?.id);
  };

  const handleUnassign = () => {
    onUpdateAssignment(conversation.id, null);
  };

  const handleConfirmArchive = async () => {
    setActionLoading(true);
    setActionError(null);
    const { error: err } = await onArchiveConversation(conversation.id);
    setActionLoading(false);
    if (err) {
      setActionError(err);
    } else {
      setShowArchiveModal(false);
    }
  };

  const handleConfirmRestore = async () => {
    setActionLoading(true);
    setActionError(null);
    const { error: err } = await onRestoreConversation(conversation.id);
    setActionLoading(false);
    if (err) {
      setActionError(err);
    }
  };

  const handleConfirmDelete = async () => {
    setActionLoading(true);
    setActionError(null);
    const { error: err } = await onDeleteConversation(conversation.id);
    setActionLoading(false);
    if (err) {
      setActionError(err);
    } else {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="conv-details-panel">
      <div className="conv-details-header">
        {onBackToThread && (
          <button
            className="conv-mobile-back-btn"
            onClick={onBackToThread}
            aria-label="Voltar para a conversa"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h4 className="conv-details-title">Detalhes do Atendimento</h4>
      </div>

      <div className="conv-details-body">
        {/* Seção 1: Visitante */}
        <div className="conv-details-section">
          <div className="conv-details-section-title">
            <User size={16} />
            <span>Visitante</span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Nome:</span>
            <span className="conv-details-value">
              {conversation.visitor_name || 'Visitante Anônimo'}
            </span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">E-mail:</span>
            <span className="conv-details-value">
              {conversation.visitor_email || 'Não informado'}
            </span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Telefone:</span>
            <span className="conv-details-value">
              {conversation.visitor_phone ? (
                <>
                  {conversation.visitor_phone}{' '}
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    ({conversation.visitor_country_code || 'US'})
                  </span>
                </>
              ) : (
                'Não informado'
              )}
            </span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">ID do Visitante:</span>
            <span className="conv-details-value code">
              {conversation.visitor_id ? conversation.visitor_id.slice(0, 13) + '...' : 'N/A'}
            </span>
          </div>
        </div>

        {/* Seção 2: Origem */}
        <div className="conv-details-section">
          <div className="conv-details-section-title">
            <Globe size={16} />
            <span>Origem do Atendimento</span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Produto:</span>
            <span className="conv-details-value highlight">
              {productDisplayName}
            </span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Tipo de Página:</span>
            <span className="conv-details-value">
              {sourceType}
            </span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Título da Página:</span>
            <span className="conv-details-value" style={{ wordBreak: 'break-word' }}>
              {conversation.source_title || 'Não identificado'}
            </span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Domínio / Host:</span>
            <span className="conv-details-value code">
              {conversation.source_host || 'Não identificado'}
            </span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Caminho / Rota:</span>
            <span className="conv-details-value code" style={{ wordBreak: 'break-all' }}>
              {conversation.source_path || 'Não identificado'}
            </span>
          </div>

          <div style={{ marginTop: '4px' }}>
            {canOpenLink ? (
              <a
                href={conversation.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="conv-btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <ExternalLink size={14} /> Abrir página de origem
              </a>
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--eg-text-muted)', fontStyle: 'italic' }}>
                {conversation.source_url
                  ? `URL externa/restrita: ${conversation.source_url}`
                  : 'Link de origem indisponível'}
              </span>
            )}
          </div>
        </div>

        {/* Seção 3: Atendimento e Status */}
        <div className="conv-details-section">
          <div className="conv-details-section-title">
            <Clock size={16} />
            <span>Atendimento</span>
          </div>

          <div className="conv-details-row">
            <label htmlFor="status-select" className="conv-details-label">Alterar Status:</label>
            <select
              id="status-select"
              className="conv-select"
              value={conversation.status}
              onChange={handleStatusChange}
              disabled={isArchived}
            >
              <option value="open">Aberta (Em Andamento)</option>
              <option value="pending">Pendente (Aguardando Resposta)</option>
              <option value="closed">Encerrada (Concluída)</option>
            </select>
          </div>

          <div className="conv-details-row" style={{ marginTop: '6px' }}>
            <span className="conv-details-label">Atribuído a:</span>
            <span className="conv-details-value highlight">
              {assignedProfile
                ? `${assignedProfile.full_name} (${assignedProfile.role})`
                : 'Nenhum atendente'}
            </span>
          </div>

          <div style={{ marginTop: '4px' }}>
            {!isAssignedToMe ? (
              <button className="conv-btn-secondary" onClick={handleAssignToMe} disabled={isArchived}>
                <Shield size={14} /> Atribuir a Mim
              </button>
            ) : (
              <button className="conv-btn-danger-outline" onClick={handleUnassign} disabled={isArchived}>
                Remover Minha Atribuição
              </button>
            )}
          </div>
        </div>

        {/* Seção 4: Histórico de Datas */}
        <div className="conv-details-section">
          <div className="conv-details-section-title">
            <Calendar size={16} />
            <span>Histórico de Datas</span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Início:</span>
            <span className="conv-details-value">{formatDate(conversation.created_at)}</span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Última Atividade:</span>
            <span className="conv-details-value">{formatDate(conversation.last_message_at)}</span>
          </div>

          {isArchived && (
            <>
              <div className="conv-details-row">
                <span className="conv-details-label">Arquivada em:</span>
                <span className="conv-details-value highlight">
                  {formatDate(conversation.archived_at)}
                </span>
              </div>
              <div className="conv-details-row">
                <span className="conv-details-label">Arquivada por:</span>
                <span className="conv-details-value">
                  {archivedByProfile ? archivedByProfile.full_name : 'Sistema/Equipe'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Seção 5: Ações da conversa (Sem Amarelo) */}
        <div className="conv-details-section">
          <div className="conv-details-section-title">
            <Archive size={16} />
            <span>Ações da conversa</span>
          </div>

          <div className="conv-actions-button-stack">
            {!isArchived ? (
              <button
                className="conv-action-btn archive-btn"
                onClick={() => setShowArchiveModal(true)}
                disabled={actionLoading}
              >
                <Archive size={15} /> Arquivar Conversa
              </button>
            ) : (
              <button
                className="conv-action-btn restore-btn"
                onClick={handleConfirmRestore}
                disabled={actionLoading}
              >
                <RotateCcw size={15} /> Restaurar Conversa
              </button>
            )}

            {/* Exclusão Permanente visível APENAS para Admin E quando a conversa já estiver arquivada */}
            {isAdmin && isArchived && (
              <button
                className="conv-action-btn delete-btn"
                onClick={() => setShowDeleteModal(true)}
                disabled={actionLoading}
              >
                <Trash2 size={15} /> Excluir Permanentemente
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      <ArchiveConversationModal
        isOpen={showArchiveModal}
        conversation={conversation}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleConfirmArchive}
        loading={actionLoading}
        error={actionError}
      />

      <DeleteConversationModal
        isOpen={showDeleteModal}
        conversation={conversation}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
        error={actionError}
      />
    </div>
  );
}

export default ConversationDetails;
