import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getOrInitVisitorSession, checkIsAdminProfile } from '../services/visitorAuthService';
import { getConversationSourceInfo } from '../lib/conversationSource';
import { debugLog, isChatDebug } from '../lib/chatDebug';

const CONV_STORAGE_KEY = 'essencialgood_visitor_active_conv_id';

export function useVisitorChat(options = {}) {
  const activeSupabase = options.client || supabase;
  const sourceOverride = options.sourceOverride || null;

  const [isOpen, setIsOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const realChannelRef = useRef(null);
  const convChannelRef = useRef(null);

  // Wrapper centralizado de alteração de estado isOpen para diagnóstico de transições
  const setChatOpen = useCallback((nextStateOrFn, reason) => {
    setIsOpen((prev) => {
      const nextState = typeof nextStateOrFn === 'function' ? nextStateOrFn(prev) : nextStateOrFn;
      debugLog('useVisitorChat', `TRANSITION isOpen: ${prev} -> ${nextState}`, {
        reason: reason || 'unspecified',
        stack: isChatDebug() ? new Error().stack : undefined,
      });
      return nextState;
    });
  }, []);

  // 1. Validação inicial e contínua de sessão para saber se o usuário é Admin/Agent
  useEffect(() => {
    let isMounted = true;
    if (!isSupabaseConfigured || !activeSupabase) {
      setCheckingAuth(false);
      return;
    }

    const verifySession = async () => {
      try {
        const { data: { session } } = await activeSupabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user && !session.user.is_anonymous) {
          const isAdmin = await checkIsAdminProfile(session.user, activeSupabase);
          if (!isMounted) return;

          if (isAdmin) {
            setIsAdminUser(true);
            setUser(null);
            setCheckingAuth(false);
            return;
          }
        }

        if (session?.user?.is_anonymous) {
          setUser(session.user);
        }

        setIsAdminUser(false);
      } catch (err) {
        if (typeof window !== 'undefined' && import.meta.env.DEV) {
          console.warn('[VisitorChat] Erro ao validar sessão inicial:', err);
        }
      } finally {
        if (isMounted) setCheckingAuth(false);
      }
    };

    verifySession();

    const { data: { subscription } } = activeSupabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      debugLog('useVisitorChat', 'onAuthStateChange event fired', { event, userId: currentSession?.user?.id, isAnonymous: currentSession?.user?.is_anonymous });

      if (currentSession?.user && !currentSession.user.is_anonymous) {
        const isAdmin = await checkIsAdminProfile(currentSession.user, activeSupabase);
        if (!isMounted) return;

        if (isAdmin) {
          setIsAdminUser(true);
          setUser(null);
          setChatOpen(false, 'auth_on_state_change_admin_detected');
          setCheckingAuth(false);
          return;
        }
      }

      if (currentSession?.user?.is_anonymous) {
        setUser(currentSession.user);
      } else if (!currentSession) {
        setUser(null);
      }

      setIsAdminUser(false);
      setCheckingAuth(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [activeSupabase, setChatOpen]);

  // 2. Marca mensagens como lidas
  const markAsRead = useCallback(async (convId) => {
    if (!convId || !activeSupabase) return;
    try {
      await activeSupabase.rpc('mark_messages_as_read', { p_conversation_id: convId });
      setUnreadCount(0);
    } catch (err) {
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.warn('[VisitorChat] Erro ao marcar mensagens como lidas:', err);
      }
    }
  }, [activeSupabase]);

  // 3. Busca histórico de mensagens
  const fetchMessages = useCallback(async (convId) => {
    if (!convId || !activeSupabase) return;
    setLoadingMessages(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await activeSupabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;

      setMessages(data || []);

      const unread = (data || []).filter(
        (m) => m.sender_type !== 'visitor' && !m.read_at
      ).length;

      setUnreadCount(unread);

      if (isOpen && unread > 0) {
        await markAsRead(convId);
      }
    } catch (err) {
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.error('[VisitorChat] Erro ao buscar mensagens:', err);
      }
      setError('Não foi possível carregar as mensagens. Tente novamente.');
    } finally {
      setLoadingMessages(false);
    }
  }, [activeSupabase, isOpen, markAsRead]);

  // 4. Gerencia inscrições de Tempo Real
  useEffect(() => {
    if (!conversation?.id || !activeSupabase) return;

    const convId = conversation.id;

    if (realChannelRef.current) {
      activeSupabase.removeChannel(realChannelRef.current);
      realChannelRef.current = null;
    }
    if (convChannelRef.current) {
      activeSupabase.removeChannel(convChannelRef.current);
      convChannelRef.current = null;
    }

    const msgChannel = activeSupabase
      .channel(`visitor-msgs:${convId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${convId}`,
        },
        async (payload) => {
          const newMsg = payload.new;
          if (!newMsg) return;

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          if (newMsg.sender_type !== 'visitor') {
            if (isOpen) {
              await markAsRead(convId);
            } else {
              setUnreadCount((prev) => prev + 1);
            }
          }
        }
      )
      .subscribe();

    realChannelRef.current = msgChannel;

    const convChannel = activeSupabase
      .channel(`visitor-conv:${convId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${convId}`,
        },
        (payload) => {
          const updatedConv = payload.new;
          if (updatedConv) {
            setConversation(updatedConv);
          }
        }
      )
      .subscribe();

    convChannelRef.current = convChannel;

    return () => {
      if (realChannelRef.current) {
        activeSupabase.removeChannel(realChannelRef.current);
        realChannelRef.current = null;
      }
      if (convChannelRef.current) {
        activeSupabase.removeChannel(convChannelRef.current);
        convChannelRef.current = null;
      }
    };
  }, [activeSupabase, conversation?.id, isOpen, markAsRead]);

  const initializingRef = useRef(false);

  // 5. Carrega sessão e conversa ativa ao abrir o widget
  const initVisitorChat = useCallback(async () => {
    if (!isSupabaseConfigured || !activeSupabase || isAdminUser) {
      setError(isAdminUser ? 'Atendimento desativado para perfil administrativo.' : 'Serviço temporariamente indisponível.');
      setConnecting(false);
      return;
    }

    if (initializingRef.current) return;
    initializingRef.current = true;

    setConnecting(true);
    setError(null);

    try {
      const { user: authUser, isAdmin, error: authErr } = await getOrInitVisitorSession(activeSupabase);

      if (isAdmin) {
        setIsAdminUser(true);
        setUser(null);
        setError('Atendimento desativado para perfil administrativo.');
        return;
      }

      if (authErr || !authUser) {
        throw authErr || new Error('Não foi possível iniciar sessão de visitante.');
      }

      setUser(authUser);

      const cachedConvId = localStorage.getItem(CONV_STORAGE_KEY);
      let activeConv = null;

      if (cachedConvId) {
        const { data: cachedData } = await activeSupabase
          .from('conversations')
          .select('*')
          .eq('id', cachedConvId)
          .maybeSingle();

        const cachedConversationIsValid =
          cachedData &&
          cachedData.visitor_id === authUser.id &&
          !cachedData.archived_at &&
          ['open', 'pending'].includes(cachedData.status);

        if (cachedConversationIsValid) {
          activeConv = cachedData;
        } else {
          localStorage.removeItem(CONV_STORAGE_KEY);
        }
      }

      if (!activeConv) {
        const { data: existing, error: fetchErr } = await activeSupabase
          .from('conversations')
          .select('*')
          .eq('visitor_id', authUser.id)
          .is('archived_at', null)
          .in('status', ['open', 'pending'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchErr && typeof window !== 'undefined' && import.meta.env.DEV) {
          console.warn('[VisitorChat] Erro ao buscar conversa ativa:', fetchErr.message);
        }

        if (existing) {
          activeConv = existing;
        }
      }

      if (activeConv) {
        setConversation(activeConv);
        localStorage.setItem(CONV_STORAGE_KEY, activeConv.id);
        await fetchMessages(activeConv.id);
      } else {
        setConversation(null);
      }
    } catch (err) {
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.error('[VisitorChat] Erro ao inicializar chat:', err);
      }
      setError('Erro de conexão ao carregar o chat.');
    } finally {
      initializingRef.current = false;
      setConnecting(false);
    }
  }, [activeSupabase, fetchMessages, isAdminUser]);

  const toggleOpen = useCallback((customReason) => {
    if (isAdminUser) {
      debugLog('useVisitorChat', 'toggleOpen rejected - user is admin');
      return;
    }
    const reason = typeof customReason === 'string' ? customReason : 'toggleOpen_user_click';
    setChatOpen((prev) => {
      const nextState = !prev;
      debugLog('useVisitorChat', `toggleOpen called: ${prev} -> ${nextState}`, { reason });
      if (nextState) {
        if (!user || checkingAuth) {
          setConnecting(true);
          initVisitorChat();
        } else if (conversation?.id) {
          markAsRead(conversation.id);
        }
      }
      return nextState;
    }, reason);
  }, [user, checkingAuth, conversation?.id, initVisitorChat, markAsRead, isAdminUser, setChatOpen]);

  // 6. Inicia uma nova conversa
  const startConversation = async ({ name, email, initialMessage }) => {
    if (isAdminUser) {
      return { error: 'O perfil administrativo não pode enviar mensagens como visitante.' };
    }
    if (!initialMessage || !initialMessage.trim()) {
      return { error: 'Mensagem inicial é obrigatória.' };
    }
    if (!name || !name.trim()) {
      return { error: 'Por favor, informe seu nome.' };
    }

    setSending(true);
    setSendError(null);

    try {
      let currentSessionUser = user;
      if (!currentSessionUser) {
        const { user: authUser, isAdmin, error: authErr } = await getOrInitVisitorSession(activeSupabase);
        if (isAdmin) {
          setIsAdminUser(true);
          return { error: 'O perfil administrativo não pode enviar mensagens como visitante.' };
        }
        if (authErr || !authUser) {
          throw authErr || new Error('Sessão não disponível.');
        }
        currentSessionUser = authUser;
        setUser(authUser);
      }

      let activeConv = conversation;

      if (!activeConv || activeConv.status === 'closed') {
        const sourceInfo = sourceOverride || getConversationSourceInfo();

        const { data: newConv, error: createConvErr } = await activeSupabase
          .from('conversations')
          .insert([
            {
              visitor_id: currentSessionUser.id,
              visitor_name: name.trim(),
              visitor_email: email && email.trim() ? email.trim() : null,
              status: 'open',
              source_url: sourceInfo.source_url,
              source_path: sourceInfo.source_path,
              source_host: sourceInfo.source_host,
              source_title: sourceInfo.source_title,
              source_product: sourceInfo.source_product,
            },
          ])
          .select()
          .single();

        if (createConvErr) {
          if (createConvErr.code === '23505') {
            const { data: existing } = await activeSupabase
              .from('conversations')
              .select('*')
              .eq('visitor_id', currentSessionUser.id)
              .in('status', ['open', 'pending'])
              .maybeSingle();

            if (existing) {
              activeConv = existing;
            } else {
              throw createConvErr;
            }
          } else {
            throw createConvErr;
          }
        } else {
          activeConv = newConv;
        }

        setConversation(activeConv);
        localStorage.setItem(CONV_STORAGE_KEY, activeConv.id);
      }

      const { data: newMsg, error: msgErr } = await activeSupabase
        .from('messages')
        .insert([
          {
            conversation_id: activeConv.id,
            content: initialMessage.trim(),
          },
        ])
        .select()
        .single();

      if (msgErr) throw msgErr;

      setMessages([newMsg]);
      return { conversation: activeConv, message: newMsg, error: null };
    } catch (err) {
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.error('[VisitorChat Technical Error Diagnosis]', {
          code: err?.code || err?.status || null,
          message: err?.message || String(err),
          details: err?.details || null,
          hint: err?.hint || null,
          name: err?.name || null,
        });
      }
      const errorMsg = 'Falha ao enviar a mensagem. Tente novamente.';
      setSendError(errorMsg);
      return { error: errorMsg };
    } finally {
      setSending(false);
    }
  };

  // 7. Envia mensagem subsequente
  const sendMessage = async (content) => {
    if (isAdminUser) return { error: 'Mensagem bloqueada para admin.' };
    if (!content || !content.trim()) return { error: 'Mensagem vazia.' };
    if (!conversation || conversation.status === 'closed') {
      return { error: 'Esta conversa foi encerrada.' };
    }

    const trimmed = content.trim();
    if (trimmed.length > 4000) {
      return { error: 'A mensagem excede o limite de 4000 caracteres.' };
    }

    setSending(true);
    setSendError(null);

    try {
      const { data: newMsg, error: msgErr } = await activeSupabase
        .from('messages')
        .insert([
          {
            conversation_id: conversation.id,
            content: trimmed,
          },
        ])
        .select()
        .single();

      if (msgErr) throw msgErr;

      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      return { message: newMsg, error: null };
    } catch (err) {
      const isArchivedError = (err?.message || '').toLowerCase().includes('arquivada');
      if (isArchivedError) {
        localStorage.removeItem(CONV_STORAGE_KEY);
        setConversation(null);
        const userFriendlyMsg = 'Este atendimento foi finalizado. Você pode iniciar uma nova conversa.';
        setSendError(userFriendlyMsg);
        return { error: userFriendlyMsg };
      }
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.error('[VisitorChat] Erro ao enviar mensagem:', err);
      }
      const errorMsg = 'Não foi possível enviar a mensagem. Verifique sua conexão e tente novamente.';
      setSendError(errorMsg);
      return { error: errorMsg };
    } finally {
      setSending(false);
    }
  };

  const resetForNewConversation = useCallback(() => {
    setConversation(null);
    setMessages([]);
    localStorage.removeItem(CONV_STORAGE_KEY);
  }, []);

  return {
    isOpen,
    toggleOpen,
    setChatOpen,
    connecting,
    user,
    isAdminUser,
    checkingAuth,
    conversation,
    messages,
    loadingMessages,
    error,
    sendError,
    sending,
    unreadCount,
    startConversation,
    sendMessage,
    resetForNewConversation,
    retryFetchMessages: () => conversation?.id && fetchMessages(conversation.id),
  };
}

export default useVisitorChat;
