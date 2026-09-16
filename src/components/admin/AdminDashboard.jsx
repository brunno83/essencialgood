import React, { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { MessageSquare, Clock, Inbox, RefreshCw, AlertCircle } from 'lucide-react';
import './AdminStyles.css';

export function AdminDashboard({ adminProfile, user }) {
  const [metrics, setMetrics] = useState({
    openConversations: 0,
    pendingConversations: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Consulta conversas abertas ('open')
      const { count: openCount, error: openErr } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      if (openErr) throw openErr;

      // 2. Consulta conversas pendentes ('pending')
      const { count: pendingCount, error: pendingErr } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (pendingErr) throw pendingErr;

      // 3. Consulta mensagens não lidas enviadas por visitantes (sender_type = 'visitor' AND read_at IS NULL)
      const { count: unreadCount, error: unreadErr } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_type', 'visitor')
        .is('read_at', null);

      if (unreadErr) throw unreadErr;

      setMetrics({
        openConversations: openCount ?? 0,
        pendingConversations: pendingCount ?? 0,
        unreadMessages: unreadCount ?? 0,
      });
    } catch (err) {
      console.error('[AdminDashboard] Erro ao carregar métricas do banco:', err);
      setError('Falha ao atualizar métricas do banco de dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const userName = adminProfile?.full_name || user?.email?.split('@')[0] || 'Administrador';

  return (
    <div className="admin-dashboard-root">
      {/* Boas-Vindas */}
      <div className="admin-welcome-box">
        <h1 className="admin-greeting-text">Olá, {userName}!</h1>
        <p className="admin-subtitle-text">
          Acompanhe os indicadores em tempo real das conversas e atendimentos.
        </p>
      </div>

      {error && (
        <div className="admin-alert-error" style={{ marginBottom: '24px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            onClick={fetchMetrics}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
            }}
          >
            <RefreshCw size={14} /> Tentar Novamente
          </button>
        </div>
      )}

      {/* Grid de Métricas Reais */}
      <div className="admin-metrics-grid">
        {/* Card 1: Conversas Abertas */}
        <div className="admin-metric-card">
          <div className="admin-metric-data">
            <span className="admin-metric-value">
              {loading ? '...' : metrics.openConversations}
            </span>
            <span className="admin-metric-label">Conversas Abertas</span>
          </div>
          <div className="admin-metric-icon-box admin-metric-icon-open">
            <MessageSquare size={24} />
          </div>
        </div>

        {/* Card 2: Conversas Pendentes */}
        <div className="admin-metric-card">
          <div className="admin-metric-data">
            <span className="admin-metric-value">
              {loading ? '...' : metrics.pendingConversations}
            </span>
            <span className="admin-metric-label">Conversas Pendentes</span>
          </div>
          <div className="admin-metric-icon-box admin-metric-icon-pending">
            <Clock size={24} />
          </div>
        </div>

        {/* Card 3: Mensagens Não Lidas de Visitantes */}
        <div className="admin-metric-card">
          <div className="admin-metric-data">
            <span className="admin-metric-value">
              {loading ? '...' : metrics.unreadMessages}
            </span>
            <span className="admin-metric-label">Mensagens Não Lidas</span>
          </div>
          <div className="admin-metric-icon-box admin-metric-icon-unread">
            <Inbox size={24} />
          </div>
        </div>
      </div>

      {/* Estado Vazio ou Informativo */}
      {!loading && metrics.openConversations === 0 && metrics.pendingConversations === 0 && (
        <div className="admin-empty-section">
          <MessageSquare size={40} className="admin-empty-icon" />
          <h3 className="admin-empty-title">Nenhuma conversa ativa no momento</h3>
          <p className="admin-empty-desc">
            Quando os visitantes iniciarem um atendimento através do chat público, os dados aparecerão automaticamente aqui.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
