import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut, Menu, X, Bell } from 'lucide-react';
import { AdminInstallWidget } from './AdminPWAComponents';
import { AdminPushSettings } from './AdminPushSettings';
import { useAdminPushNotifications } from '../../hooks/useAdminPushNotifications';
import { brandLogo, handleBrandImageError } from '../../assets/brandAssets';
import './AdminStyles.css';

export function AdminLayout({
  children,
  adminProfile,
  user,
  onSignOut,
  activeTab = 'dashboard',
  onSelectTab,
  unreadCount = 0,
  pwaProps,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const { status: pushStatus } = useAdminPushNotifications();

  const isPushActive = pushStatus === 'active_this_device';
  const userName = adminProfile?.full_name || user?.email?.split('@')[0] || 'Administrador';
  const userRole = adminProfile?.role === 'admin' ? 'Administrador' : 'Agente';

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleNavClick = (tab) => {
    if (typeof onSelectTab === 'function') {
      onSelectTab(tab);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="admin-root">
      {showPushModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11000, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <button
              type="button"
              onClick={() => setShowPushModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', zIndex: 1 }}
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>
            <div style={{ padding: '8px' }}>
              <AdminPushSettings />
            </div>
          </div>
        </div>
      )}

      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-brand">
            <div className="admin-brand-logo">
              <img
                src={brandLogo}
                alt="Essencial Good"
                className="admin-sidebar-logo-img"
                onError={(e) => handleBrandImageError(e, brandLogo)}
              />
            </div>
            <button
              className="admin-mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="Fechar menu"
              style={{ padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="admin-sidebar-nav">
            <button
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'conversations' ? 'active' : ''}`}
              onClick={() => handleNavClick('conversations')}
            >
              <MessageSquare size={18} />
              <span>Conversas</span>
              {unreadCount > 0 && (
                <span className="admin-nav-badge-unread">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
              onClick={() => handleNavClick('leads')}
            >
              <Users size={18} />
              <span>Leads</span>
            </button>

            {adminProfile?.role === 'admin' && (
              <button
                className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => handleNavClick('settings')}
              >
                <Settings size={18} />
                <span>Configurações</span>
              </button>
            )}
          </nav>

          {/* User Footer Profile */}
          <div className="admin-sidebar-user">
            <div className="admin-user-info">
              <span className="admin-user-name" title={userName}>{userName}</span>
              <span className="admin-user-role">{userRole}</span>
            </div>

            <div className="admin-sidebar-actions">
              {pwaProps && (
                <AdminInstallWidget
                  canInstall={pwaProps.canInstall}
                  isIOS={pwaProps.isIOS}
                  isStandalone={pwaProps.isStandalone}
                  onInstall={pwaProps.installPWA}
                />
              )}

              <button
                type="button"
                className="admin-sidebar-action-btn admin-btn-alerts"
                onClick={() => setShowPushModal(true)}
                title="Configurar Notificações Push"
                aria-label="Alertas Push"
              >
                <Bell size={18} />
                <span className="admin-action-label">Alertas</span>
                {isPushActive && (
                  <span className="admin-push-active-badge">
                    <span className="admin-push-active-dot" />
                    Ativos
                  </span>
                )}
              </button>

              <button
                type="button"
                className="admin-sidebar-action-btn admin-btn-logout"
                onClick={onSignOut}
                title="Encerrar sessão"
                aria-label="Sair do painel"
              >
                <LogOut size={18} />
                <span className="admin-action-label">Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="admin-main-wrapper">
          <header className="admin-header-bar">
            <button
              className="admin-mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="Abrir menu principal"
            >
              <Menu size={22} />
            </button>

            <h2 className="admin-header-title">
              {activeTab === 'dashboard'
                ? 'Visão Geral'
                : activeTab === 'conversations'
                ? 'Central de Atendimento'
                : activeTab === 'leads'
                ? 'Lista de Leads do Pré-checkout'
                : 'Configurações do Chat'}
            </h2>

            <div style={{ width: '24px' }} />
          </header>

          <main className="admin-content-padding">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
