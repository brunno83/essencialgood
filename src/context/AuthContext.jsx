import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext({
  session: null,
  user: null,
  adminProfile: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
  refreshAdminProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Consulta rigorosamente a tabela admin_profiles para validar o perfil do usuário
  const checkAdminStatus = useCallback(async (currentUser) => {
    if (!currentUser || currentUser.is_anonymous || !supabase) {
      setAdminProfile(null);
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.warn('[AuthContext] Erro ao consultar admin_profiles:', error.message);
        setAdminProfile(null);
        setIsAdmin(false);
        return;
      }

      if (data && (data.role === 'admin' || data.role === 'agent')) {
        setAdminProfile(data);
        setIsAdmin(true);
      } else {
        setAdminProfile(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('[AuthContext] Falha ao verificar perfil de admin:', err);
      setAdminProfile(null);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // 1. Obtém a sessão inicial
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!isMounted) return;
      setSession(initialSession);
      const currentUser = initialSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        checkAdminStatus(currentUser).finally(() => {
          if (isMounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch(err => {
      console.error('[AuthContext] Erro ao carregar sessão inicial:', err);
      if (isMounted) setLoading(false);
    });

    // 2. Escuta eventos de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await checkAdminStatus(currentUser);
      } else {
        setAdminProfile(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    // Limpeza de listeners no unmount
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthContext] Erro no logout:', error.message);
      }
    } catch (err) {
      console.error('[AuthContext] Exceção no logout:', err);
    }
  }, []);

  const refreshAdminProfile = useCallback(async () => {
    if (user) {
      await checkAdminStatus(user);
    }
  }, [user, checkAdminStatus]);

  const value = {
    session,
    user,
    adminProfile,
    isAdmin,
    loading,
    signOut,
    refreshAdminProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um <AuthProvider>');
  }
  return context;
}

export default AuthContext;
