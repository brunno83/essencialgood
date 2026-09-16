import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, LogOut, Menu, X, Shield, Users } from 'lucide-react';
import './AdminStyles.css';

export function AdminLayout({ adminProfile, user, onSignOut, children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = adminProfile?.full_name || user?.email || 'Administrador';
  const userRole = adminProfile?.role === 'admin' ? 'Administrador' : 'Agente';

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="admin-root">
      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-brand">
            <div className="admin-brand-logo">
              <Shield size={24} style={{ color: '#10b981' }} />
              <div>
                <div className="admin-brand-title">Essencial Good</div>
                <div className="admin-brand-subtitle">Painel de Atendimento</div>
              </div>
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
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              className="admin-nav-item disabled"
              title="Módulo de conversas em tempo real (Próxima etapa)"
              disabled
            >
              <MessageSquare size={18} />
              <span>Conversas</span>
              <span className="admin-nav-badge-soon">Etapa 2B</span>
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

            <h2 className="admin-header-title">
              {activeTab === 'dashboard' ? 'Visão Geral' : 'Conversas'}
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
