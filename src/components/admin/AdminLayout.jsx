import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, LogOut, Menu, X, Users } from 'lucide-react';
import './AdminStyles.css';

export function AdminLayout({
  adminProfile,
  user,
  onSignOut,
  activeTab = 'dashboard',
  onSelectTab,
  unreadCount = 0,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = adminProfile?.full_name || user?.email || 'Administrador';
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
      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-brand">
            <div className="admin-brand-logo">
              <img
                src="/assets/brand/essencial-good-logo.png"
                alt="Essencial Good"
                className="admin-sidebar-logo-img"
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
          </nav>

          {/* User Footer Profile */}
          <div className="admin-sidebar-user">
            <div className="admin-user-info">
              <span className="admin-user-name" title={userName}>{userName}</span>
              <span className="admin-user-role">
                <Users size={12} /> {userRole}
              </span>
            </div>

            <button
              className="admin-btn-logout"
              onClick={onSignOut}
              title="Encerrar sessão"
              aria-label="Sair do painel"
            >
              <LogOut size={16} />
            </button>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/assets/brand/essencial-good-symbol.png"
                alt="Essencial Good"
                className="admin-sidebar-symbol-img"
                style={{ display: mobileMenuOpen ? 'none' : 'block' }}
              />
              <h2 className="admin-header-title">
                {activeTab === 'dashboard' ? 'Visão Geral' : 'Central de Atendimento'}
              </h2>
            </div>

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
