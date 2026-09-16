import React, { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminConversations } from './AdminConversations';
import './AdminStyles.css';

export function AdminContainer() {
  const [user, setUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    const p = window.location.pathname.toLowerCase();
    return p.includes('/admin/conversations') ? 'conversations' : 'dashboard';
  });
  const [globalUnreadCount, setGlobalUnreadCount] = useState(0);

  // Escuta popstate para suportar botões voltar/avançar do navegador
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('/admin/conversations')) {
        setActiveTab('conversations');
      } else {
        setActiveTab('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    const newPath = tab === 'conversations' ? '/admin/conversations' : '/admin';
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
        // Usuário autenticado no Auth mas sem perfil administrativo: desloga imediatamente
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

    // 1. Carrega sessão inicial sem acionar login anônimo
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

    // 2. Escuta mudanças na autenticação
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

  const handleSignOut = async () => {
    setLoading(true);
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setAdminProfile(null);
    setLoading(false);
  };

  const handleLoginSuccess = ({ user: loggedUser, profile }) => {
    setUser(loggedUser);
    setAdminProfile(profile);
  };

  // 1. Tela de Carregamento Inicial
  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner" />
        <div className="admin-loading-text">Verificando credenciais e permissões...</div>
      </div>
    );
  }

  // 2. Se não houver sessão autorizada ou perfil válido, exibe Login
  const isAuthenticatedAdmin = Boolean(user && !user.is_anonymous && adminProfile);

  if (!isAuthenticatedAdmin) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Se estiver autenticado e autorizado, exibe AdminLayout com o conteúdo da aba ativa
  return (
    <AdminLayout
      adminProfile={adminProfile}
      user={user}
      onSignOut={handleSignOut}
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      unreadCount={globalUnreadCount}
    >
      {activeTab === 'conversations' ? (
        <AdminConversations adminProfile={adminProfile} />
      ) : (
        <AdminDashboard adminProfile={adminProfile} user={user} />
      )}
    </AdminLayout>
  );
}

export default AdminContainer;
