import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function useAdminConversations(adminProfile) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'open', 'pending', 'closed', 'archived'
  const [searchQuery, setSearchQuery] = useState('');
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [adminProfilesMap, setAdminProfilesMap] = useState({});
  const [actionLoading, setActionLoading] = useState({}); // { [convId_action]: boolean }

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
      // 1. Seleciona conversas dependendo da aba (Arquivadas vs Ativas)
      let query = supabase.from('conversations').select('*');

      if (filterStatus === 'archived') {
        query = query.not('archived_at', 'is', null).order('archived_at', { ascending: false });
      } else {
        query = query.is('archived_at', null).order('last_message_at', { ascending: false });
      }

      const { data: convData, error: convErr } = await query.limit(100);

      if (convErr) throw convErr;

      // 2. Busca contagem de mensagens não lidas apenas em conversas ativas
      const { data: unreadData, error: unreadErr } = await supabase
        .from('messages')
        .select('conversation_id')
        .eq('sender_type', 'visitor')
        .is('read_at', null);

      if (unreadErr) console.warn('[useAdminConversations] Erro ao contar não lidas:', unreadErr.message);

      const unreadMap = {};
      let totalUnread = 0;

      if (unreadData) {
        unreadData.forEach(m => {
          unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
        });
      }

      // 3. Busca prévias das últimas mensagens
      const conversationIds = (convData || []).map(c => c.id);
      const lastMessageMap = {};

      if (conversationIds.length > 0) {
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

      // 4. Monta a lista enriquecida e calcula unread apenas para conversas ativas
      const enriched = (convData || []).map(conv => {
        const uCount = unreadMap[conv.id] || 0;
        if (!conv.archived_at) {
          totalUnread += uCount;
        }
        return {
          ...conv,
          unreadCount: uCount,
          lastMessage: lastMessageMap[conv.id] || null,
        };
      });

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
  }, [filterStatus]);

  // Inscrição em Tempo Real (Supabase Realtime)
  useEffect(() => {
    isMounted.current = true;
    fetchAdminProfiles();
    fetchConversations();

    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('admin-conversations-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          if (!isMounted.current) return;
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          if (!isMounted.current) return;
          fetchConversations();
        }
      )
      .subscribe();

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

      setConversations(prev =>
        prev.map(c => (c.id === conversationId ? { ...c, status: newStatus } : c))
      );
      return { error: null };
    } catch (err) {
      console.error('[useAdminConversations] Erro ao mudar status:', err);
      return { error: err };
    }
  };

  // Atribuir conversa
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

  // RPC: Arquivar Conversa
  const archiveConversation = async (conversationId) => {
    if (!supabase) return { error: new Error('Supabase não configurado') };
    const key = `${conversationId}_archive`;
    setActionLoading(prev => ({ ...prev, [key]: true }));

    try {
      const { data, error: err } = await supabase.rpc('archive_conversation', {
        p_conversation_id: conversationId,
      });

      if (err) throw err;

      // Remove incrementalmente da aba atual de ativas se não estiver na aba 'archived'
      if (filterStatus !== 'archived') {
        setConversations(prev => prev.filter(c => c.id !== conversationId));
      } else {
        await fetchConversations();
      }

      return { data, error: null };
    } catch (err) {
      console.error('[useAdminConversations] Erro ao arquivar conversa:', err);
      return { data: null, error: err?.message || 'Falha ao arquivar a conversa.' };
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // RPC: Restaurar Conversa Arquivada
  const restoreConversation = async (conversationId) => {
    if (!supabase) return { error: new Error('Supabase não configurado') };
    const key = `${conversationId}_restore`;
    setActionLoading(prev => ({ ...prev, [key]: true }));

    try {
      const { data, error: err } = await supabase.rpc('restore_conversation', {
        p_conversation_id: conversationId,
      });

      if (err) throw err;

      // Remove da lista da aba 'archived' se atualmente estiver vendo arquivadas
      if (filterStatus === 'archived') {
        setConversations(prev => prev.filter(c => c.id !== conversationId));
      } else {
        await fetchConversations();
      }

      return { data, error: null };
    } catch (err) {
      console.error('[useAdminConversations] Erro ao restaurar conversa:', err);
      return { data: null, error: err?.message || 'Falha ao restaurar a conversa.' };
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // RPC: Excluir Conversa Permanentemente (Admin)
  const deleteConversationPermanently = async (conversationId) => {
    if (!supabase) return { error: new Error('Supabase não configurado') };
    const key = `${conversationId}_delete`;
    setActionLoading(prev => ({ ...prev, [key]: true }));

    try {
      const { data, error: err } = await supabase.rpc('delete_conversation_permanently', {
        p_conversation_id: conversationId,
      });

      if (err) throw err;

      // Remove da lista em qualquer aba
      setConversations(prev => prev.filter(c => c.id !== conversationId));

      return { data, error: null };
    } catch (err) {
      console.error('[useAdminConversations] Erro ao excluir conversa:', err);
      return { data: null, error: err?.message || 'Falha ao excluir a conversa.' };
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Atualiza localmente a contagem de não lidas
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

  // Filtragem local
  const filteredConversations = conversations.filter(conv => {
    // 1. Filtro por status
    if (filterStatus === 'archived') {
      if (!conv.archived_at) return false;
    } else if (filterStatus !== 'all') {
      if (conv.status !== filterStatus || conv.archived_at) return false;
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
    actionLoading,
    fetchConversations,
    updateConversationStatus,
    updateConversationAssignment,
    archiveConversation,
    restoreConversation,
    deleteConversationPermanently,
    markLocalAsRead,
  };
}

export default useAdminConversations;
