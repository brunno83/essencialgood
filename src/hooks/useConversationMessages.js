import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function useConversationMessages(conversationId, onMarkedRead) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const isMounted = useRef(true);

  // Executa RPC para marcar mensagens como lidas pelo atendente
  const markAsReadRPC = useCallback(async (id) => {
    if (!id || !supabase || !isSupabaseConfigured) return;
    try {
      const { error: rpcErr } = await supabase.rpc('mark_messages_as_read', {
        p_conversation_id: id,
      });

      if (rpcErr) {
        console.warn('[useConversationMessages] Falha na RPC mark_messages_as_read:', rpcErr.message);
      } else if (typeof onMarkedRead === 'function') {
        onMarkedRead(id);
      }
    } catch (e) {
      console.error('[useConversationMessages] Exceção na RPC mark_messages_as_read:', e);
    }
  }, [onMarkedRead]);

  // Busca as mensagens da conversa selecionada
  const fetchMessages = useCallback(async () => {
    if (!conversationId || !isSupabaseConfigured || !supabase) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: err } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (err) throw err;

      if (isMounted.current) {
        setMessages(data || []);
      }

      // Executa RPC para marcar como lidas as mensagens do visitante
      markAsReadRPC(conversationId);
    } catch (err) {
      console.error('[useConversationMessages] Erro ao buscar mensagens:', err);
      if (isMounted.current) setError('Falha ao carregar as mensagens da conversa.');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [conversationId, markAsReadRPC]);

  // Escuta novas mensagens em tempo real para a conversa selecionada
  useEffect(() => {
    isMounted.current = true;
    fetchMessages();

    if (!conversationId || !isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel(`conversation-thread-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (!isMounted.current) return;
          const newMsg = payload.new;
          console.log('[Realtime Message Thread New]:', newMsg);

          setMessages(prev => {
            // Evita mensagens duplicadas no estado local
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Se for mensagem de visitante, chama RPC para marcar como lida
          if (newMsg.sender_type === 'visitor') {
            markAsReadRPC(conversationId);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted.current = false;
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId, fetchMessages, markAsReadRPC]);

  // Enviar mensagem de resposta
  const sendMessage = async (content) => {
    const cleanContent = (content || '').trim();
    if (!cleanContent) {
      setSendError('O conteúdo da mensagem não pode ser vazio.');
      return { error: new Error('Mensagem vazia') };
    }

    if (cleanContent.length > 4000) {
      setSendError('A mensagem excede o limite máximo de 4000 caracteres.');
      return { error: new Error('Limite de tamanho excedido') };
    }

    if (!conversationId || !supabase) {
      setSendError('Nenhuma conversa selecionada ou Supabase offline.');
      return { error: new Error('Conversa inválida') };
    }

    setSending(true);
    setSendError(null);

    try {
      // Inserção estrita: envia APENAS conversation_id e content.
      // O trigger normalize_new_message do PostgreSQL define sender_id, sender_type, created_at e read_at.
      const { data, error: insertErr } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            content: cleanContent,
          },
        ])
        .select()
        .single();

      if (insertErr) throw insertErr;

      // Adiciona mensagem ao estado local imediatamente se retornado pelo banco
      if (data && isMounted.current) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
      }

      return { data, error: null };
    } catch (err) {
      console.error('[useConversationMessages] Erro ao enviar resposta:', err);
      const errMsg = err?.message || 'Falha ao enviar mensagem. Tente novamente.';
      if (isMounted.current) setSendError(errMsg);
      return { error: err };
    } finally {
      if (isMounted.current) setSending(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sending,
    sendError,
    setSendError,
    fetchMessages,
    sendMessage,
    markAsReadRPC,
  };
}

export default useConversationMessages;
