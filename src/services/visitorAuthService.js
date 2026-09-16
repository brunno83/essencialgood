import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

let signInPromise = null;

/**
 * Serviço de Autenticação Anônima para Visitantes.
 * Garante sessão Supabase Anônima persistida via auth.uid().
 * NÃO cria sessão anônima na rota /admin ou se o usuário já estiver logado.
 *
 * @returns {Promise<{ user: import('@supabase/supabase-js').User|null, session: import('@supabase/supabase-js').Session|null, error: Error|null }>}
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

    if (sessionError) {
      console.warn('[VisitorAuth] Erro ao verificar sessão existente:', sessionError.message);
    }

    if (session?.user) {
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
          console.warn('[VisitorAuth] signInAnonymously não concluído:', error.message);
          return { user: null, session: null, error };
        }
        return { user: data.user, session: data.session, error: null };
      } catch (err) {
        console.error('[VisitorAuth] Exceção em signInAnonymously:', err);
        return { user: null, session: null, error: err };
      } finally {
        signInPromise = null;
      }
    })();

    return await signInPromise;
  } catch (err) {
    console.error('[VisitorAuth] Erro no visitorAuthService:', err);
    return { user: null, session: null, error: err };
  }
}

/**
 * Busca a conversa ativa do visitante ou cria uma nova de forma idempotente.
 * Impede a criação de múltiplas conversas abertas simultâneas.
 */
export async function getOrCreateVisitorConversation() {
  const { user, error: authError } = await getOrInitVisitorSession();
  if (authError || !user) {
    return { conversation: null, error: authError || new Error('Visitante não autenticado') };
  }

  try {
    // 1. Verifica se o visitante já tem uma conversa ativa ('open' ou 'pending')
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('visitor_id', user.id)
      .in('status', ['open', 'pending'])
      .maybeSingle();

    if (fetchError) {
      console.warn('[VisitorAuth] Erro ao consultar conversa ativa:', fetchError.message);
    }

    if (existing) {
      return { conversation: existing, error: null };
    }

    // 2. Cria nova conversa (o trigger BEFORE INSERT no Postgres garante visitor_id = auth.uid())
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert([{ visitor_id: user.id }])
      .select()
      .single();

    if (createError) {
      console.error('[VisitorAuth] Erro ao criar conversa:', createError.message);
      return { conversation: null, error: createError };
    }

    return { conversation: newConv, error: null };
  } catch (err) {
    console.error('[VisitorAuth] Exceção em getOrCreateVisitorConversation:', err);
    return { conversation: null, error: err };
  }
}

export default getOrInitVisitorSession;
