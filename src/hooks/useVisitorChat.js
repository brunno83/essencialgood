import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getOrInitVisitorSession } from '../services/visitorAuthService';

const CONV_STORAGE_KEY = 'essencialgood_visitor_active_conv_id';

export function useVisitorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const realChannelRef = useRef(null);
  const convChannelRef = useRef(null);

  // 1. Marca mensagens como lidas
  const markAsRead = useCallback(async (convId) => {
    if (!convId || !supabase) return;
    try {
      await supabase.rpc('mark_messages_as_read', { p_conversation_id: convId });
      setUnreadCount(0);
    } catch (err) {
      console.warn('[VisitorChat] Erro ao marcar mensagens como lidas:', err);
    }
  }, []);

  // 2. Busca histórico de mensagens
  const fetchMessages = useCallback(async (convId) => {
    if (!convId || !supabase) return;
    setLoadingMessages(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;

      setMessages(data || []);

      // Contar não lidas enviadas pela equipe
      const unread = (data || []).filter(
        (m) => m.sender_type !== 'visitor' && !m.read_at
      ).length;

      setUnreadCount(unread);

      // Se o chat estiver aberto, marcar como lidas imediatamente
      if (isOpen && unread > 0) {
        await markAsRead(convId);
      }
    } catch (err) {
      console.error('[VisitorChat] Erro ao buscar mensagens:', err);
      setError('Não foi possível carregar as mensagens. Tente novamente.');
    } finally {
      setLoadingMessages(false);
    }
  }, [isOpen, markAsRead]);

  // 3. Gerencia inscrições de Tempo Real para a conversa
  useEffect(() => {
    if (!conversation?.id || !supabase) return;

    const convId = conversation.id;

    // Remover canais anteriores se existirem
    if (realChannelRef.current) {
      supabase.removeChannel(realChannelRef.current);
      realChannelRef.current = null;
    }
    if (convChannelRef.current) {
      supabase.removeChannel(convChannelRef.current);
      convChannelRef.current = null;
    }

    // Inscrever em novas mensagens da conversa
    const msgChannel = supabase
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

          // Se a mensagem for da equipe
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

    // Inscrever em alterações da própria conversa (ex: status mudando para closed)
    const convChannel = supabase
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
        supabase.removeChannel(realChannelRef.current);
        realChannelRef.current = null;
      }
      if (convChannelRef.current) {
        supabase.removeChannel(convChannelRef.current);
        convChannelRef.current = null;
      }
    };
  }, [conversation?.id, isOpen, markAsRead]);

  // 4. Carrega sessão e conversa ativa ao abrir o widget
  const initVisitorChat = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Serviço de chat temporariamente indisponível.');
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      const { user: authUser, error: authErr } = await getOrInitVisitorSession();
      if (authErr || !authUser) {
        throw authErr || new Error('Não foi possível iniciar sessão de visitante.');
      }

      setUser(authUser);

      // Verificar conversa salva em cache ou consultar no Supabase
      const cachedConvId = localStorage.getItem(CONV_STORAGE_KEY);
      let activeConv = null;

      if (cachedConvId) {
        const { data: cachedData } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', cachedConvId)
          .maybeSingle();

        if (cachedData && cachedData.visitor_id === authUser.id) {
          activeConv = cachedData;
        }
      }

      if (!activeConv) {
        const { data: existing, error: fetchErr } = await supabase
          .from('conversations')
          .select('*')
          .eq('visitor_id', authUser.id)
          .in('status', ['open', 'pending'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchErr) {
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
      console.error('[VisitorChat] Erro ao inicializar chat:', err);
      setError('Erro de conexão ao carregar o chat.');
    } finally {
      setConnecting(false);
    }
  }, [fetchMessages]);

  // Alterna visibilidade do widget
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState && !user) {
        initVisitorChat();
      } else if (nextState && conversation?.id) {
        markAsRead(conversation.id);
      }
      return nextState;
    });
  }, [user, conversation?.id, initVisitorChat, markAsRead]);

  // 5. Inicia uma nova conversa (envia nome, e-mail e primeira mensagem)
  const startConversation = async ({ name, email, initialMessage }) => {
    if (!initialMessage || !initialMessage.trim()) {
      return { error: 'Mensagem inicial é obrigatória.' };
    }
    if (!name || !name.trim()) {
      return { error: 'Por favor, informe seu nome.' };
    }

    setSending(true);
    setSendError(null);

    try {
      // Garante sessão anônima
      let currentSessionUser = user;
      if (!currentSessionUser) {
        const { user: authUser, error: authErr } = await getOrInitVisitorSession();
        if (authErr || !authUser) {
          throw authErr || new Error('Sessão não disponível.');
        }
        currentSessionUser = authUser;
        setUser(authUser);
      }

      let activeConv = conversation;

      // Se ainda não tiver conversa ativa criada
      if (!activeConv || activeConv.status === 'closed') {
        const { data: newConv, error: createConvErr } = await supabase
          .from('conversations')
          .insert([
            {
              visitor_id: currentSessionUser.id,
              visitor_name: name.trim(),
              visitor_email: email && email.trim() ? email.trim() : null,
              status: 'open',
            },
          ])
          .select()
          .single();

        if (createConvErr) {
          // Trata eventual concorrência caso já exista conversa aberta
          if (createConvErr.code === '23505') {
            const { data: existing } = await supabase
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

      // Envia a primeira mensagem
      const { data: newMsg, error: msgErr } = await supabase
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
      console.error('[VisitorChat] Erro ao iniciar conversa:', err);
      const errorMsg = 'Falha ao enviar a mensagem. Tente novamente.';
      setSendError(errorMsg);
      return { error: errorMsg };
    } finally {
      setSending(false);
    }
  };

  // 6. Envia mensagem subsequente
  const sendMessage = async (content) => {
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
      const { data: newMsg, error: msgErr } = await supabase
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
      console.error('[VisitorChat] Erro ao enviar mensagem:', err);
      const errorMsg = 'Não foi possível enviar a mensagem. Verifique sua conexão e tente novamente.';
      setSendError(errorMsg);
      return { error: errorMsg };
    } finally {
      setSending(false);
    }
  };

  // 7. Reseta conversa ativa local para permitir iniciar nova conversa
  const resetForNewConversation = useCallback(() => {
    setConversation(null);
    setMessages([]);
    localStorage.removeItem(CONV_STORAGE_KEY);
  }, []);

  return {
    isOpen,
    toggleOpen,
    connecting,
    user,
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
