import React, { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminConversations } from './AdminConversations';
import { AdminCheckoutLeads } from './AdminCheckoutLeads';
import { AdminChatSettings } from './AdminChatSettings';
import { useAdminPWA } from '../../hooks/useAdminPWA';
import { AdminOfflineOverlay, AdminUpdateBanner } from './AdminPWAComponents';
import './AdminStyles.css';

export function AdminContainer() {
  const [user, setUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hook PWA Exclusivo para a rota /admin
  const {
    canInstall,
    isIOS,
    isStandalone,
    hasUpdate,
    isOffline,
    installPWA,
    applyUpdate,
  } = useAdminPWA();

  const [activeTab, setActiveTab] = useState(() => {
    const p = window.location.pathname.toLowerCase();
    if (p.includes('/admin/conversations')) return 'conversations';
    if (p.includes('/admin/leads')) return 'leads';
    if (p.includes('/admin/settings')) return 'settings';
    return 'dashboard';
  });
  const [globalUnreadCount, setGlobalUnreadCount] = useState(0);

  // Injeção de metadados PWA na <head> exclusivamente ao acessar o painel administrativo (/admin)
  useEffect(() => {
    const isAdminRoute = window.location.pathname.toLowerCase().startsWith('/admin');
    if (!isAdminRoute) return;

    document.body.classList.add('admin-active-body');

    const linksToCleanup = [];

    const ensureHeadLink = (rel, href, attributes = {}) => {
      let link = document.querySelector(`link[rel="${rel}"][sizes="${attributes.sizes || ''}"]`) ||
                 document.querySelector(`link[rel="${rel}"][href="${href}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        Object.entries(attributes).forEach(([k, v]) => link.setAttribute(k, v));
        document.head.appendChild(link);
        linksToCleanup.push(link);
      }
    };

    const ensureMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
        linksToCleanup.push(meta);
      }
    };

    const ADMIN_VERSION_TAG = 'eg-admin-v1.0.1';

    ensureHeadLink('manifest', '/manifest-admin.webmanifest');
    ensureHeadLink('apple-touch-icon', `/assets/icons/apple-touch-icon-180x180.png?v=${ADMIN_VERSION_TAG}`, { sizes: '180x180' });
    ensureMetaTag('apple-mobile-web-app-capable', 'yes');
    ensureMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    ensureMetaTag('apple-mobile-web-app-title', 'Essencial Admin');
    ensureMetaTag('mobile-web-app-capable', 'yes');
    ensureMetaTag('theme-color', '#2E4829');

    return () => {
      document.body.classList.remove('admin-active-body');
      linksToCleanup.forEach((elem) => {
        if (elem && elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
      });
    };
  }, []);

  // Escuta popstate para suportar botões voltar/avançar do navegador
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('/admin/conversations')) {
        setActiveTab('conversations');
      } else if (p.includes('/admin/leads')) {
        setActiveTab('leads');
      } else if (p.includes('/admin/settings')) {
        setActiveTab('settings');
      } else {
        setActiveTab('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    const newPath =
      tab === 'conversations'
        ? '/admin/conversations'
        : tab === 'leads'
        ? '/admin/leads'
        : tab === 'settings'
        ? '/admin/settings'
        : '/admin';
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  // Busca mensagens não lidas enviadas por visitantes para o badge da sidebar
  const fetchGlobalUnreadCount = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_type', 'visitor')
        .is('read_at', null);

      if (!error && count !== null) {
        setGlobalUnreadCount(count);
      }
    } catch (e) {
      console.warn('[AdminContainer] Erro ao buscar contagem global de não lidas:', e);
    }
  }, []);

  // Escuta mensagens novas em tempo real para atualizar o badge da sidebar
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    fetchGlobalUnreadCount();

    const channel = supabase
      .channel('admin-global-badge')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          fetchGlobalUnreadCount();
        }
      )
      .subscribe();

    return () => {
      if (supabase) supabase.removeChannel(channel);
    };
  }, [fetchGlobalUnreadCount]);

  // Consulta tabela admin_profiles para verificar se o usuário é admin ou agent
  const validateAdminProfile = useCallback(async (currentUser) => {
    if (!currentUser || currentUser.is_anonymous || !supabase) {
      setAdminProfile(null);
      return null;
    }

    try {
      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.warn('[AdminContainer] Erro ao consultar admin_profiles:', error.message);
        setAdminProfile(null);
        return null;
      }

      if (profile && (profile.role === 'admin' || profile.role === 'agent')) {
        setAdminProfile(profile);
        return profile;
      } else {
        console.warn('[AdminContainer] Usuário sem perfil de admin/agent. Deslogando...');
        await supabase.auth.signOut();
        setAdminProfile(null);
        return null;
      }
    } catch (err) {
      console.error('[AdminContainer] Exceção ao validar perfil:', err);
      setAdminProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!isMounted) return;

      const currentUser = initialSession?.user ?? null;
      setUser(currentUser);

      if (currentUser && !currentUser.is_anonymous) {
        await validateAdminProfile(currentUser);
      } else if (currentUser?.is_anonymous) {
        setAdminProfile(null);
      }

      if (isMounted) setLoading(false);
    }).catch(err => {
      console.error('[AdminContainer] Erro ao carregar sessão inicial:', err);
      if (isMounted) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;

      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser && !currentUser.is_anonymous) {
        await validateAdminProfile(currentUser);
      } else {
        setAdminProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [validateAdminProfile]);

  const [signOutError, setSignOutError] = useState(null);
  const [pendingForceSignOut, setPendingForceSignOut] = useState(false);

  const handleSignOut = async (force = false) => {
    setLoading(true);
    setSignOutError(null);

    // 1. Tentar desativar inscrição de Web Push no dispositivo e no servidor antes do logout
    if ('serviceWorker' in navigator && isSupabaseConfigured && supabase) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const pushSub = await registration.pushManager.getSubscription();

        if (pushSub) {
          const endpoint = pushSub.endpoint;
          // Tenta remover via RPC no banco de dados primeiro
          const { error: rpcErr } = await supabase.rpc('unregister_push_subscription', {
            p_endpoint: endpoint,
          });

          if (rpcErr && !force) {
            console.warn('[AdminSignOut] Falha na RPC ao desativar push:', rpcErr.message);
            setSignOutError(`Não foi possível desativar as notificações no servidor (${rpcErr.message}).`);
            setPendingForceSignOut(true);
            setLoading(false);
            return;
          }

          // Desativa inscrição no Service Worker do navegador
          await pushSub.unsubscribe().catch((e) => console.warn('[AdminSignOut] Erro ao desativar localmente:', e));
        }
      } catch (err) {
        console.warn('[AdminSignOut] Exceção ao processar desativação de push:', err);
        if (!force) {
          setSignOutError('Ocorreu um erro ao desativar as notificações push neste dispositivo.');
          setPendingForceSignOut(true);
          setLoading(false);
          return;
        }
      }
    }

    // Limpa Badging API
    if ('clearAppBadge' in navigator && typeof navigator.clearAppBadge === 'function') {
      navigator.clearAppBadge().catch(() => {});
    }

    // 2. Efetuar encerramento da sessão Supabase Auth
    if (supabase) {
      await supabase.auth.signOut().catch((e) => console.error('[AdminSignOut] Erro no signOut:', e));
    }

    setUser(null);
    setAdminProfile(null);
    setPendingForceSignOut(false);
    setSignOutError(null);
    setLoading(false);
  };

  const handleLoginSuccess = ({ user: loggedUser, profile }) => {
    setUser(loggedUser);
    setAdminProfile(profile);
  };

  if (isOffline) {
    return <AdminOfflineOverlay />;
  }

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-card">
          <img
            src="/assets/Brand/essencial-good-symbol.png"
            alt="Essencial Good Logo"
            className="admin-loading-logo"
          />
          <h2 className="admin-loading-title">Essencial Good Admin</h2>
          <div className="admin-spinner" />
          <div className="admin-loading-text">Verificando credenciais e permissões...</div>
        </div>
      </div>
    );
  }

  const isAuthenticatedAdmin = Boolean(user && !user.is_anonymous && adminProfile);

  if (!isAuthenticatedAdmin) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="admin-layout-wrapper">
      {pendingForceSignOut && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11000, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', maxWidth: '420px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#991B1B', margin: '0 0 8px' }}>
              Falha ao Desativar Notificações
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 16px', lineHeight: '1.5' }}>
              {signOutError || 'Não foi possível desativar as notificações no servidor.'}
            </p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 20px', background: '#FEF2F2', padding: '8px 12px', borderRadius: '6px' }}>
              Aviso: Se você sair sem desativar, este dispositivo poderá continuar recebendo alertas até o encerramento remoto.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => handleSignOut(false)}
                style={{ background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                Tentar novamente
              </button>
              <button
                type="button"
                onClick={() => handleSignOut(true)}
                style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                Sair mesmo assim
              </button>
            </div>
          </div>
        </div>
      )}
      {hasUpdate && <AdminUpdateBanner onApplyUpdate={applyUpdate} />}
      <AdminLayout
        adminProfile={adminProfile}
        user={user}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        unreadCount={globalUnreadCount}
        pwaProps={{ canInstall, isIOS, isStandalone, installPWA }}
      >
        {activeTab === 'conversations' ? (
          <AdminConversations adminProfile={adminProfile} />
        ) : activeTab === 'leads' ? (
          <AdminCheckoutLeads adminProfile={adminProfile} />
        ) : activeTab === 'settings' ? (
          <AdminChatSettings
            adminProfile={adminProfile}
            pwaProps={{ canInstall, isIOS, isStandalone, installPWA }}
          />
        ) : (
          <AdminDashboard adminProfile={adminProfile} user={user} onSelectTab={handleSelectTab} />
        )}
      </AdminLayout>
    </div>
  );
}

export default AdminContainer;
