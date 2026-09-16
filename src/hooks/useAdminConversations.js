import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function useAdminConversations(adminProfile) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'open', 'pending', 'closed'
  const [searchQuery, setSearchQuery] = useState('');
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [adminProfilesMap, setAdminProfilesMap] = useState({});

  const isMounted = useRef(true);

  // Busca os perfis de equipe para exibir nomes de atendentes atribuídos
  const fetchAdminProfiles = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error: err } = await supabase
        .from('admin_profiles')
        .select('id, full_name, role');
      if (!err && data) {
        const map = {};
        data.forEach(p => {
          map[p.id] = p;
        });
        if (isMounted.current) setAdminProfilesMap(map);
      }
    } catch (e) {
      console.warn('[useAdminConversations] Erro ao carregar admin_profiles:', e);
    }
  }, []);

  // Busca a lista de conversas e calcula as mensagens não lidas
  const fetchConversations = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Busca conversas ordenadas por atividade mais recente
      const { data: convData, error: convErr } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false })
        .limit(50);

      if (convErr) throw convErr;

      // 2. Busca contagem de mensagens não lidas enviadas por visitantes
      const { data: unreadData, error: unreadErr } = await supabase
        .from('messages')
        .select('conversation_id')
        .eq('sender_type', 'visitor')
        .is('read_at', null);

      if (unreadErr) console.warn('[useAdminConversations] Erro ao contar não lidas:', unreadErr.message);

      // Agrupa contagem por conversa
      const unreadMap = {};
      let totalUnread = 0;

      if (unreadData) {
        unreadData.forEach(m => {
          unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
          totalUnread += 1;
        });
      }

      // 3. Busca a prévia da última mensagem para cada conversa
      const conversationIds = (convData || []).map(c => c.id);
      const lastMessageMap = {};

      if (conversationIds.length > 0) {
        // Busca a última mensagem enviada em cada conversa
        const { data: msgData } = await supabase
          .from('messages')
          .select('conversation_id, content, sender_type, created_at')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: false });

        if (msgData) {
          msgData.forEach(msg => {
            if (!lastMessageMap[msg.conversation_id]) {
              lastMessageMap[msg.conversation_id] = msg;
            }
          });
        }
      }

      // 4. Monta a lista enriquecida de conversas
      const enriched = (convData || []).map(conv => ({
        ...conv,
        unreadCount: unreadMap[conv.id] || 0,
        lastMessage: lastMessageMap[conv.id] || null,
      }));

      if (isMounted.current) {
        setConversations(enriched);
        setTotalUnreadCount(totalUnread);
      }
    } catch (err) {
      console.error('[useAdminConversations] Erro ao carregar conversas:', err);
      if (isMounted.current) setError('Falha ao carregar a lista de conversas.');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  // Inscrição em Tempo Real (Supabase Realtime)
  useEffect(() => {
    isMounted.current = true;
    fetchAdminProfiles();
    fetchConversations();

    if (!isSupabaseConfigured || !supabase) return;

    // Canal Realtime para escutar mudanças na tabela conversations e messages
    const channel = supabase
      .channel('admin-conversations-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          if (!isMounted.current) return;
          console.log('[Realtime Conversations Payload]:', payload);
          // Recarrega conversas para garantir sincronização do status e last_message_at
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (!isMounted.current) return;
          console.log('[Realtime Message Insert Payload]:', payload);
          // Atualiza prévias e contadores de não lidas
          fetchConversations();
        }
      )
      .subscribe((status) => {
        console.log('[Realtime Subscription Status]:', status);
      });

    return () => {
      isMounted.current = false;
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchConversations, fetchAdminProfiles]);

  // Atualizar status de uma conversa
  const updateConversationStatus = async (conversationId, newStatus) => {
    if (!supabase) return { error: new Error('Supabase não configurado') };
    try {
      const { error: err } = await supabase
        .from('conversations')
        .update({ status: newStatus })
        .eq('id', conversationId);

      if (err) throw err;

      // Atualiza estado local imediatamente
      setConversations(prev =>
        prev.map(c => (c.id === conversationId ? { ...c, status: newStatus } : c))
      );
      return { error: null };
    } catch (err) {
      console.error('[useAdminConversations] Erro ao mudar status:', err);
      return { error: err };
    }
  };

  // Atribuir ou remover atribuição de conversa
  const updateConversationAssignment = async (conversationId, adminId) => {
    if (!supabase) return { error: new Error('Supabase não configurado') };
    try {
      const { error: err } = await supabase
        .from('conversations')
        .update({ assigned_admin_id: adminId })
        .eq('id', conversationId);

      if (err) throw err;

      setConversations(prev =>
        prev.map(c => (c.id === conversationId ? { ...c, assigned_admin_id: adminId } : c))
      );
      return { error: null };
    } catch (err) {
      console.error('[useAdminConversations] Erro ao mudar atribuição:', err);
      return { error: err };
    }
  };

  // Atualiza localmente a contagem de não lidas para 0 após RPC mark_messages_as_read
  const markLocalAsRead = useCallback((conversationId) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const removedUnread = c.unreadCount || 0;
          setTotalUnreadCount(current => Math.max(0, current - removedUnread));
          return { ...c, unreadCount: 0 };
        }
        return c;
      })
    );
  }, []);

  // Filtragem local por status e por busca textual (nome/email)
  const filteredConversations = conversations.filter(conv => {
    // 1. Filtro por status
    if (filterStatus !== 'all' && conv.status !== filterStatus) {
      return false;
    }
    // 2. Filtro por texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = (conv.visitor_name || '').toLowerCase().includes(q);
      const emailMatch = (conv.visitor_email || '').toLowerCase().includes(q);
      const idMatch = (conv.id || '').toLowerCase().includes(q);
      const visitorFallbackMatch = (`visitante #${conv.visitor_id?.slice(0, 6)}`).toLowerCase().includes(q);
      return nameMatch || emailMatch || idMatch || visitorFallbackMatch;
    }
    return true;
  });

  return {
    conversations: filteredConversations,
    rawConversations: conversations,
    loading,
    error,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    totalUnreadCount,
    adminProfilesMap,
    fetchConversations,
    updateConversationStatus,
    updateConversationAssignment,
    markLocalAsRead,
  };
}

export default useAdminConversations;
