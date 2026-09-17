import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

let signInPromise = null;

/**
 * Verifica se um usuário possui perfil de admin ou agent cadastrado em admin_profiles.
 *
 * @param {import('@supabase/supabase-js').User} user
 * @returns {Promise<boolean>}
 */
export async function checkIsAdminProfile(user) {
  if (!user || user.is_anonymous || !supabase || !isSupabaseConfigured) {
    return false;
  }
  try {
    const { data: profile, error } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.warn('[VisitorAuth] Erro ao consultar admin_profiles:', error.message);
      }
      return false;
    }

    return Boolean(profile && (profile.role === 'admin' || profile.role === 'agent'));
  } catch (err) {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      console.warn('[VisitorAuth] Exceção ao validar perfil administrativo:', err);
    }
    return false;
  }
}

/**
 * Serviço de Autenticação Anônima para Visitantes.
 * Garante sessão Supabase Anônima persistida via auth.uid().
 * NÃO cria nem substitui sessão anônima se o usuário for um Administrador ou Agente.
 *
 * @returns {Promise<{ user: import('@supabase/supabase-js').User|null, session: import('@supabase/supabase-js').Session|null, isAdmin?: boolean, error: Error|null }>}
 */
export async function getOrInitVisitorSession() {
  if (!isSupabaseConfigured || !supabase) {
    return { user: null, session: null, error: new Error('Supabase não configurado') };
  }

  // Evita criar sessão anônima se a rota atual for do painel administrativo
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.startsWith('/admin')) {
    const { data: { session } } = await supabase.auth.getSession();
    return { user: session?.user ?? null, session: session ?? null, error: null };
  }

  try {
    // 1. Verifica se já existe uma sessão ativa (seja anônima ou autenticada)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError && typeof window !== 'undefined' && import.meta.env.DEV) {
      console.warn('[VisitorAuth] Erro ao verificar sessão existente:', sessionError.message);
    }

    if (session?.user) {
      // Se for um usuário comum/admin (não anônimo), verifica se possui perfil de equipe
      if (!session.user.is_anonymous) {
        const isAdmin = await checkIsAdminProfile(session.user);
        if (isAdmin) {
          // NUNCA encerra nem substitui a sessão admin! Retorna indicando que é perfil admin.
          return {
            user: null,
            session: null,
            isAdmin: true,
            error: new Error('Sessão administrativa ativa. O ChatWidget do visitante está desativado para administradores.'),
          };
        }
      }
      return { user: session.user, session, error: null };
    }

    // 2. Se houver requisição de login anônimo em andamento, aguarda sua conclusão (singleton promise)
    if (signInPromise) {
      return await signInPromise;
    }

    // 3. Executa login anônimo para visitante público
    signInPromise = (async () => {
      try {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          if (typeof window !== 'undefined' && import.meta.env.DEV) {
            console.warn('[VisitorAuth] signInAnonymously não concluído:', error.message);
          }
          return { user: null, session: null, error };
        }
        return { user: data.user, session: data.session, error: null };
      } catch (err) {
        if (typeof window !== 'undefined' && import.meta.env.DEV) {
          console.error('[VisitorAuth] Exceção em signInAnonymously:', err);
        }
        return { user: null, session: null, error: err };
      } finally {
        signInPromise = null;
      }
    })();

    return await signInPromise;
  } catch (err) {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      console.error('[VisitorAuth] Erro no visitorAuthService:', err);
    }
    return { user: null, session: null, error: err };
  }
}

/**
 * Busca a conversa ativa do visitante ou cria uma nova de forma idempotente.
 */
export async function getOrCreateVisitorConversation() {
  const { user, isAdmin, error: authError } = await getOrInitVisitorSession();

  if (isAdmin) {
    return { conversation: null, error: new Error('Atendimento bloqueado para perfil administrativo.') };
  }

  if (authError || !user) {
    return { conversation: null, error: authError || new Error('Visitante não autenticado') };
  }

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('visitor_id', user.id)
      .in('status', ['open', 'pending'])
      .maybeSingle();

    if (fetchError && typeof window !== 'undefined' && import.meta.env.DEV) {
      console.warn('[VisitorAuth] Erro ao consultar conversa ativa:', fetchError.message);
    }

    if (existing) {
      return { conversation: existing, error: null };
    }

    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert([{ visitor_id: user.id }])
      .select()
      .single();

    if (createError) {
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.error('[VisitorAuth] Erro ao criar conversa:', createError.message);
      }
      return { conversation: null, error: createError };
    }

    return { conversation: newConv, error: null };
  } catch (err) {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      console.error('[VisitorAuth] Exceção em getOrCreateVisitorConversation:', err);
    }
    return { conversation: null, error: err };
  }
}

export default getOrInitVisitorSession;
