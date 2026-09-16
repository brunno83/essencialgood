import React from 'react';
import { User, Mail, Calendar, Clock, UserCheck, Shield, ChevronRight } from 'lucide-react';

export function ConversationDetails({
  conversation,
  adminProfile,
  adminProfilesMap,
  onUpdateStatus,
  onUpdateAssignment,
}) {
  if (!conversation) return null;

  const assignedProfile = conversation.assigned_admin_id
    ? adminProfilesMap[conversation.assigned_admin_id]
    : null;

  const isAssignedToMe = conversation.assigned_admin_id === adminProfile?.id;

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

  return (
    <div className="conv-details-panel">
      <div className="conv-details-header">
        <h4 className="conv-details-title">Detalhes do Atendimento</h4>
      </div>

      <div className="conv-details-body">
        {/* Card do Visitante */}
        <div className="conv-details-card">
          <div className="conv-details-card-title">
            <User size={16} />
            <span>Informações do Visitante</span>
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
            <span className="conv-details-label">ID do Visitante:</span>
            <span className="conv-details-value code">
              {conversation.visitor_id ? conversation.visitor_id.slice(0, 13) + '...' : 'N/A'}
            </span>
          </div>
        </div>

        {/* Status Operacional */}
        <div className="conv-details-card">
          <div className="conv-details-card-title">
            <Clock size={16} />
            <span>Status da Conversa</span>
          </div>

          <div className="conv-details-group">
            <label htmlFor="status-select" className="conv-details-label">Alterar Status:</label>
            <select
              id="status-select"
              className="conv-select"
              value={conversation.status}
              onChange={handleStatusChange}
            >
              <option value="open">Aberta (Em Andamento)</option>
              <option value="pending">Pendente (Aguardando Resposta)</option>
              <option value="closed">Encerrada (Concluída)</option>
            </select>
          </div>
        </div>

        {/* Atribuição de Atendente */}
        <div className="conv-details-card">
          <div className="conv-details-card-title">
            <UserCheck size={16} />
            <span>Atendente Atribuído</span>
          </div>

          <div className="conv-details-row">
            <span className="conv-details-label">Atribuído a:</span>
            <span className="conv-details-value highlight">
              {assignedProfile
                ? `${assignedProfile.full_name} (${assignedProfile.role})`
                : 'Nenhum atendente'}
            </span>
          </div>

          <div className="conv-assign-actions">
            {!isAssignedToMe ? (
              <button className="conv-btn-secondary" onClick={handleAssignToMe}>
                <Shield size={14} /> Atribuir a Mim
              </button>
            ) : (
              <button className="conv-btn-danger-outline" onClick={handleUnassign}>
                Remover Minha Atribuição
              </button>
            )}
          </div>
        </div>

        {/* Datas e Registros */}
        <div className="conv-details-card">
          <div className="conv-details-card-title">
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
        </div>
      </div>
    </div>
  );
}

export default ConversationDetails;
