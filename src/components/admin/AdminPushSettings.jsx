import React from 'react';
import { useAdminPushNotifications } from '../../hooks/useAdminPushNotifications';
import { Bell, BellOff, BellRing, CheckCircle2, AlertTriangle, Smartphone, Loader2, ShieldAlert } from 'lucide-react';

export function AdminPushSettings() {
  const {
    status,
    notifyChats,
    notifyLeads,
    errorMessage,
    isIOSNotStandalone,
    isVapidConfigured,
    enablePush,
    disablePush,
    updatePreferences,
  } = useAdminPushNotifications();

  return (
    <div className="admin-push-settings-card" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F4F8F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E4829' }}>
            <BellRing size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', margin: 0 }}>
              Notificações Web Push
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>
              Receba alertas nativos instantâneos na tela do celular ou computador quando chegarem novos chats ou leads.
            </p>
          </div>
        </div>

        {/* Badge de Estado */}
        {status === 'active_this_device' && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E8F5E9', color: '#2D6A4F', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
            <CheckCircle2 size={14} /> Ativadas neste dispositivo
          </span>
        )}
        {status === 'permission_denied' && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF5F5', color: '#C53030', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
            <ShieldAlert size={14} /> Bloqueadas no navegador
          </span>
        )}
        {status === 'loading' && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', color: '#64748B', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Verificando...
          </span>
        )}
      </div>

      {/* AVISOS DE ERRO E CONFIGURAÇÃO DE AMBIENTE */}
      {!isVapidConfigured && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px 16px', borderRadius: '8px', color: '#92400E', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Chave VAPID pública pendente:</strong> A variável <code>VITE_VAPID_PUBLIC_KEY</code> não foi encontrada nas variáveis de ambiente. Defina a chave no Vercel / <code>.env.local</code> para habilitar o registro.
          </span>
        </div>
      )}

      {isIOSNotStandalone && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 16px', borderRadius: '8px', color: '#1E40AF', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Smartphone size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Instalação PWA necessária no iPhone:</strong> O iOS exige que o painel seja adicionado à Tela de Início (Safari → Compartilhar → <em>Adicionar à Tela de Início</em>) para permitir notificações push.
          </span>
        </div>
      )}

      {status === 'permission_denied' && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '8px', color: '#991B1B', fontSize: '13px' }}>
          As notificações foram bloqueadas nas permissões do seu navegador. Clique no ícone de cadeado/configurações da barra de endereço para permitir as notificações e recarregue a página.
        </div>
      )}

      {errorMessage && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '8px', color: '#991B1B', fontSize: '13px' }}>
          {errorMessage}
        </div>
      )}

      {/* CONTROLES E PREFERÊNCIAS QUANDO ATIVADO */}
      {status === 'active_this_device' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
            Preferências de Alerta para este dispositivo:
          </span>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notifyChats}
              onChange={(e) => updatePreferences(e.target.checked, notifyLeads)}
              style={{ width: '18px', height: '18px', accentColor: '#2E4829' }}
            />
            <span style={{ fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>
              Novos chats recebidos (Visitante inicia conversa no chat público)
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notifyLeads}
              onChange={(e) => updatePreferences(notifyChats, e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#2E4829' }}
            />
            <span style={{ fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>
              Novos leads do pré-checkout (Contato capturado no formulário)
            </span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="button"
              onClick={disablePush}
              style={{ background: 'transparent', color: '#DC2626', border: '1px solid #FECACA', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <BellOff size={15} /> Desativar neste dispositivo
            </button>
          </div>
        </div>
      )}

      {/* BOTÃO DE ATIVAÇÃO INICIAL */}
      {(status === 'available' || status === 'disabled') && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F7F7F3', padding: '14px 16px', borderRadius: '8px' }}>
          <span style={{ fontSize: '13px', color: '#475569' }}>
            Notificações desativadas para este dispositivo.
          </span>
          <button
            type="button"
            onClick={enablePush}
            disabled={!isVapidConfigured || isIOSNotStandalone}
            style={{
              background: (!isVapidConfigured || isIOSNotStandalone) ? '#94A3B8' : '#2E4829',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: (!isVapidConfigured || isIOSNotStandalone) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Bell size={16} /> Ativar Notificações
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPushSettings;
