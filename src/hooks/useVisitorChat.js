import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getOrInitVisitorSession, checkIsAdminProfile } from '../services/visitorAuthService.js';
import { getConversationSourceInfo } from '../lib/conversationSource.js';
import { debugLog, isChatDebug } from '../lib/chatDebug.js';
import { callEdgeFunction, EdgeFunctionError } from '../lib/edgeClient.js';
import { requestTurnstileToken } from '../lib/turnstileAdapter.js';
import {
  buildCreateConversationPayload,
  buildSendMessagePayload,
  validateCanonicalVisitorMessage,
  reconcileOptimisticMessage,
  getRateLimitRemainingSeconds,
  applyRateLimit,
  canStartVisitorOperation,
} from '../lib/visitorChatRuntime.js';

const CONV_STORAGE_KEY = 'essencialgood_visitor_active_conv_id';

export function mapVisitorErrorMessage(err) {
  if (!err) return 'Ocorreu um erro ao processar sua solicitação.';

  if (err instanceof EdgeFunctionError) {
    if (err.status === 429) {
      const waitSec = err.retryAfterSeconds || 60;
      return `Muitas tentativas em pouco tempo. Por favor, aguarde ${waitSec} segundos antes de tentar novamente.`;
    }
    if (err.status === 401) {
      return 'Sua sessão de visitante expirou. Clique em enviar para tentar novamente.';
    }
    if (err.status === 403) {
      return 'Acesso temporariamente restrito por motivos de segurança.';
    }
    if (err.status === 413) {
      return 'A mensagem ou o cadastro excede o tamanho máximo permitido.';
    }
    if (err.status === 502 || err.status === 503) {
      return 'Serviço de verificação temporariamente indisponível. Tente novamente em instantes.';
    }
    if (err.isTimeout) {
      return 'O tempo de resposta expirou. Verifique sua conexão e tente novamente.';
    }
    if (err.isAborted || err.name === 'AbortError') {
      return 'A operação foi cancelada.';
    }
    if (err.isNetwork) {
      return 'Falha de conexão com o servidor. Verifique sua internet e tente novamente.';
    }
    if (err.code === 'INVALID_VISITOR_NAME') {
      return 'Por favor, informe um nome válido entre 2 e 120 caracteres.';
    }
    if (err.code === 'INVALID_VISITOR_EMAIL') {
      return 'Por favor, informe um e-mail válido.';
    }
    if (err.code === 'INVALID_VISITOR_PHONE') {
      return 'Por favor, informe um telefone válido com código de área.';
    }
    if (err.code === 'MISSING_TURNSTILE_TOKEN' || err.code === 'TURNSTILE_REJECTED') {
      return 'A verificação de segurança não foi concluída. Tente novamente.';
    }
    if (err.code === 'INVALID_MESSAGE_RESPONSE') {
      return 'Não foi possível confirmar o envio da mensagem. Tente novamente.';
    }
  }

  const strErr = String(err?.message || err);
  if (strErr.includes('TURNSTILE_ABORTED')) {
    return 'A verificação de segurança foi cancelada.';
  }
  if (strErr.includes('TURNSTILE_TIMEOUT')) {
    return 'Tempo limite atingido na verificação de segurança. Tente novamente.';
  }
  if (strErr.includes('TURNSTILE_')) {
    return 'Falha na verificação de segurança. Por favor, tente novamente.';
  }
  if (strErr.includes('arquivada') || strErr.includes('encerrada')) {
    return 'Este atendimento foi finalizado. Você pode iniciar uma nova conversa.';
  }

  return 'Não foi possível completar a operação. Tente novamente em instantes.';
}

export async function getValidVisitorJwt(activeSupabase, options = {}) {
  const { mountedRef, setUser } = options;

  if (!activeSupabase || !activeSupabase.auth) {
    throw new EdgeFunctionError({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Cliente Supabase não configurado para sessão.',
    });
  }

  let session = null;
  try {
    const { data: sessionData, error: sessionError } = await activeSupabase.auth.getSession();
    if (sessionError) {
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.warn('[VisitorChat] getSession erro ao verificar sessão');
      }
    }
    session = sessionData?.session || null;
  } catch (_) {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      console.warn('[VisitorChat] getSession exceção tratada');
    }
  }

  if (session?.user && !session.user.is_anonymous) {
    const isAdmin = await checkIsAdminProfile(session.user, activeSupabase);
    if (isAdmin) {
      throw new EdgeFunctionError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Acesso bloqueado para perfil administrativo.',
      });
    }
  }

  if (!session || !session.user || !session.access_token) {
    const authRes = await getOrInitVisitorSession(activeSupabase);
    if (authRes.isAdmin) {
      throw new EdgeFunctionError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Acesso bloqueado para perfil administrativo.',
      });
    }
    if (authRes.error || !authRes.session || !authRes.session.access_token) {
      throw new EdgeFunctionError({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Sessão de visitante não disponível.',
      });
    }
    session = authRes.session;
  }

  const expiresAt = session.expires_at;
  const isExpiresAtInvalid = !expiresAt || typeof expiresAt !== 'number' || isNaN(expiresAt);
  const nowSec = Math.floor(Date.now() / 1000);
  const isNearExpiry = !isExpiresAtInvalid && (expiresAt - nowSec < 60);

  if (isExpiresAtInvalid || isNearExpiry) {
    try {
      const { data: refreshData, error: refreshError } = await activeSupabase.auth.refreshSession();
      if (refreshError || !refreshData?.session?.access_token) {
        throw new EdgeFunctionError({
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Falha ao renovar sessão de visitante.',
        });
      }
      session = refreshData.session;
    } catch (err) {
      if (err instanceof EdgeFunctionError) throw err;
      throw new EdgeFunctionError({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Erro ao renovar sessão de visitante.',
      });
    }
  }

  if (session?.user && !session.user.is_anonymous) {
    const isAdmin = await checkIsAdminProfile(session.user, activeSupabase);
    if (isAdmin) {
      throw new EdgeFunctionError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Acesso bloqueado para perfil administrativo.',
      });
    }
  }

  const token = session.access_token;
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    throw new EdgeFunctionError({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Token de visitante inválido ou vazio.',
    });
  }

  if (setUser && session.user && (!mountedRef || mountedRef.current)) {
    setUser(session.user);
  }

  return token;
}

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

  const mountedRef = useRef(true);
  const currentConversationIdRef = useRef(null);
  const realChannelRef = useRef(null);
  const convChannelRef = useRef(null);

  const createLockRef = useRef(false);
  const sendLockRef = useRef(false);
  const createAbortControllerRef = useRef(null);
  const sendAbortControllerRef = useRef(null);
  const rateLimitUntilRef = useRef({ create: 0, send: 0 });
  const initializingRef = useRef(false);

  useEffect(() => {
    currentConversationIdRef.current = conversation?.id || null;
  }, [conversation?.id]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (createAbortControllerRef.current) {
        createAbortControllerRef.current.abort();
      }
      if (sendAbortControllerRef.current) {
        sendAbortControllerRef.current.abort();
      }
    };
  }, []);

  const setChatOpen = useCallback((nextStateOrFn, reason) => {
    if (!mountedRef.current) return;
    setIsOpen((prev) => {
      const nextState = typeof nextStateOrFn === 'function' ? nextStateOrFn(prev) : nextStateOrFn;
      debugLog('useVisitorChat', `TRANSITION isOpen: ${prev} -> ${nextState}`, {
        reason: reason || 'unspecified',
        stack: isChatDebug() ? new Error().stack : undefined,
      });
      return nextState;
    });
  }, []);

  // 1. Validação inicial e contínua de sessão
  useEffect(() => {
    let isMounted = true;
    if (!isSupabaseConfigured || !activeSupabase) {
      if (mountedRef.current) setCheckingAuth(false);
      return;
    }

    const verifySession = async () => {
      try {
        const { data: { session } } = await activeSupabase.auth.getSession();
        if (!isMounted || !mountedRef.current) return;

        if (session?.user && !session.user.is_anonymous) {
          const isAdmin = await checkIsAdminProfile(session.user, activeSupabase);
          if (!isMounted || !mountedRef.current) return;

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
        if (isMounted && mountedRef.current) setCheckingAuth(false);
      }
    };

    verifySession();

    const { data: { subscription } } = activeSupabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted || !mountedRef.current) return;

      debugLog('useVisitorChat', 'onAuthStateChange event fired', { event, userId: currentSession?.user?.id, isAnonymous: currentSession?.user?.is_anonymous });

      if (currentSession?.user && !currentSession.user.is_anonymous) {
        const isAdmin = await checkIsAdminProfile(currentSession.user, activeSupabase);
        if (!isMounted || !mountedRef.current) return;

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
      if (mountedRef.current) setUnreadCount(0);
    } catch (err) {
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.warn('[VisitorChat] Erro ao marcar mensagens como lidas:', err);
      }
    }
  }, [activeSupabase]);

  // 3. Busca histórico de mensagens
  const fetchMessages = useCallback(async (convId) => {
    if (!convId || !activeSupabase) return;
    if (mountedRef.current) {
      setLoadingMessages(true);
      setError(null);
    }
    try {
      const { data, error: fetchErr } = await activeSupabase
        .from('messages')
        .select('id, conversation_id, sender_id, sender_type, content, read_at, created_at')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;

      if (!mountedRef.current || currentConversationIdRef.current !== convId) return;

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
      if (mountedRef.current) {
        setError('Não foi possível carregar as mensagens. Tente novamente.');
      }
    } finally {
      if (mountedRef.current) setLoadingMessages(false);
    }
  }, [activeSupabase, isOpen, markAsRead]);

  // 4. Inscrições de Tempo Real e deduplicação estrita por conversa
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
          const activeConvId = currentConversationIdRef.current;
          if (!newMsg || !mountedRef.current || !activeConvId) return;

          // Rejeita evento se a conversa no payload for diferente da conversa ativa no ref
          if (newMsg.conversation_id !== activeConvId || newMsg.conversation_id !== convId) {
            return;
          }

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;

            const tempMatch = prev.find(
              (m) => typeof m.id === 'string' &&
                     m.id.startsWith('temp_') &&
                     m.conversation_id === activeConvId &&
                     m.sender_type === newMsg.sender_type &&
                     m.content === newMsg.content
            );

            if (tempMatch) {
              return reconcileOptimisticMessage(prev, tempMatch.id, newMsg, activeConvId);
            }

            return [...prev, newMsg];
          });

          if (newMsg.sender_type !== 'visitor') {
            if (isOpen) {
              await markAsRead(convId);
            } else if (mountedRef.current) {
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
          if (updatedConv && mountedRef.current && currentConversationIdRef.current === convId) {
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

  // 5. Carrega sessão e conversa ativa ao abrir o widget
  const initVisitorChat = useCallback(async () => {
    if (!isSupabaseConfigured || !activeSupabase || isAdminUser) {
      if (mountedRef.current) {
        setError(isAdminUser ? 'Atendimento desativado para perfil administrativo.' : 'Serviço temporariamente indisponível.');
        setConnecting(false);
      }
      return;
    }

    if (initializingRef.current) return;
    initializingRef.current = true;

    if (mountedRef.current) {
      setConnecting(true);
      setError(null);
    }

    try {
      const { user: authUser, isAdmin, error: authErr } = await getOrInitVisitorSession(activeSupabase);

      if (!mountedRef.current) return;

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
        const { data: cachedData, error: cachedErr } = await activeSupabase
          .from('conversations')
          .select('id, visitor_id, status, last_message_at, created_at, updated_at, source_product, archived_at')
          .eq('id', cachedConvId)
          .maybeSingle();

        if (cachedErr) {
          if (typeof window !== 'undefined' && import.meta.env.DEV) {
            console.warn('[VisitorChat] Erro ao consultar conversa em cache:', cachedErr.message);
          }
          // Preserva a referência em localStorage caso haja erro transitório de rede
        } else if (cachedData) {
          const cachedConversationIsValid =
            cachedData.visitor_id === authUser.id &&
            !cachedData.archived_at &&
            ['open', 'pending'].includes(cachedData.status);

          if (cachedConversationIsValid) {
            activeConv = cachedData;
          } else {
            // Remove do cache apenas se a conversa for explicitamente inválida, arquivada ou de outro visitante
            localStorage.removeItem(CONV_STORAGE_KEY);
          }
        } else {
          // Consulta retornou nula sem erro (data === null, error === null): a conversa não existe no banco
          localStorage.removeItem(CONV_STORAGE_KEY);
        }
      }

      if (!activeConv) {
        const { data: existing, error: fetchErr } = await activeSupabase
          .from('conversations')
          .select('id, visitor_id, status, last_message_at, created_at, updated_at, source_product, archived_at')
          .eq('visitor_id', authUser.id)
          .is('archived_at', null)
          .in('status', ['open', 'pending'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchErr) {
          if (typeof window !== 'undefined' && import.meta.env.DEV) {
            console.warn('[VisitorChat] Erro ao buscar conversa ativa:', fetchErr.message);
          }
        } else if (existing) {
          if (existing.id && existing.visitor_id === authUser.id && ['open', 'pending'].includes(existing.status)) {
            activeConv = existing;
          }
        }
      }

      if (!mountedRef.current) return;

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
      if (mountedRef.current) {
        setError('Erro de conexão ao carregar o chat.');
      }
    } finally {
      initializingRef.current = false;
      if (mountedRef.current) setConnecting(false);
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
          if (mountedRef.current) setConnecting(true);
          initVisitorChat();
        } else if (conversation?.id) {
          markAsRead(conversation.id);
        }
      }
      return nextState;
    }, reason);
  }, [user, checkingAuth, conversation?.id, initVisitorChat, markAsRead, isAdminUser, setChatOpen]);

  // 6. Inicia uma nova conversa via Edge Function create-conversation com Turnstile e AbortController
  const startConversation = async ({ name, email, phone, countryCode, dialCode, initialMessage }) => {
    if (isAdminUser) {
      return { error: 'O perfil administrativo não pode enviar mensagens como visitante.' };
    }
    if (!initialMessage || !initialMessage.trim()) {
      return { error: 'Please type your message.' };
    }
    if (!name || !name.trim()) {
      return { error: 'Please enter your name to start.' };
    }

    const remainingSec = getRateLimitRemainingSeconds(rateLimitUntilRef.current, 'create');
    if (remainingSec > 0) {
      const friendly = `Muitas tentativas em pouco tempo. Por favor, aguarde ${remainingSec} segundos antes de tentar novamente.`;
      if (mountedRef.current) setSendError(friendly);
      return { error: friendly };
    }

    if (!canStartVisitorOperation({ createLock: createLockRef.current, sendLock: sendLockRef.current }, 'create')) {
      return { error: 'Uma operação já está em andamento. Aguarde...' };
    }
    createLockRef.current = true;

    if (createAbortControllerRef.current) {
      createAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    createAbortControllerRef.current = controller;
    const signal = controller.signal;

    if (mountedRef.current) {
      setSending(true);
      setSendError(null);
    }

    try {
      const turnstileToken = await requestTurnstileToken('create_conversation', { signal });
      if (signal.aborted || !mountedRef.current) {
        throw new EdgeFunctionError({ status: 499, code: 'CLIENT_CLOSED_REQUEST', message: 'Operação cancelada.' });
      }

      const jwt = await getValidVisitorJwt(activeSupabase, { mountedRef, setUser });
      if (signal.aborted || !mountedRef.current) {
        throw new EdgeFunctionError({ status: 499, code: 'CLIENT_CLOSED_REQUEST', message: 'Operação cancelada.' });
      }

      const sourceInfo = sourceOverride || getConversationSourceInfo();
      const payload = buildCreateConversationPayload(
        { name, email, phone, countryCode, dialCode },
        sourceInfo,
        turnstileToken
      );

      const convRes = await callEdgeFunction('create-conversation', payload, { jwt, signal });
      const convId = convRes?.conversation_id || convRes?.id;

      if (!convId || typeof convId !== 'string') {
        throw new Error('Retorno inválido ao criar conversa.');
      }

      if (signal.aborted || !mountedRef.current) {
        return { error: 'Operação cancelada.' };
      }

      const activeConv = {
        id: convId,
        visitor_name: name.trim(),
        visitor_email: email && email.trim() ? email.trim() : null,
        visitor_phone: phone && phone.trim() ? phone.trim() : null,
        visitor_country_code: countryCode && countryCode.trim() ? countryCode.trim() : null,
        visitor_dial_code: dialCode && dialCode.trim() ? dialCode.trim() : null,
        status: 'open',
        source_url: sourceInfo.source_url,
        source_path: sourceInfo.source_path,
        source_product: sourceInfo.source_product,
      };

      if (mountedRef.current) {
        setConversation(activeConv);
        setMessages([]);
        localStorage.setItem(CONV_STORAGE_KEY, convId);
      }

      const tempMsgId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const optimisticMsg = {
        id: tempMsgId,
        conversation_id: convId,
        sender_type: 'visitor',
        content: initialMessage.trim(),
        created_at: new Date().toISOString(),
      };

      if (mountedRef.current) {
        setMessages((prev) => [...prev, optimisticMsg]);
      }

      let msgRes;
      try {
        const sendPayload = buildSendMessagePayload(convId, initialMessage.trim());
        msgRes = await callEdgeFunction('send-message', sendPayload, { jwt, signal });
      } catch (sendErr) {
        if (mountedRef.current) {
          setMessages((prev) => prev.filter((m) => m.id !== tempMsgId));
        }
        if (sendErr instanceof EdgeFunctionError && sendErr.status === 429) {
          rateLimitUntilRef.current = applyRateLimit(rateLimitUntilRef.current, 'send', sendErr);
        }
        throw sendErr;
      }

      const canonicalMsg = validateCanonicalVisitorMessage(msgRes, convId, initialMessage.trim());
      if (!canonicalMsg) {
        if (mountedRef.current) {
          setMessages((prev) => prev.filter((m) => m.id !== tempMsgId));
        }
        throw new EdgeFunctionError({
          status: 500,
          code: 'INVALID_MESSAGE_RESPONSE',
          message: 'Formato de resposta inválido ao enviar mensagem.',
        });
      }

      if (mountedRef.current) {
        setMessages((prev) => reconcileOptimisticMessage(prev, tempMsgId, canonicalMsg, convId));
      }

      return { conversation: activeConv, message: canonicalMsg, error: null };
    } catch (err) {
      if (err instanceof EdgeFunctionError && err.status === 429) {
        rateLimitUntilRef.current = applyRateLimit(rateLimitUntilRef.current, 'create', err);
      }

      const friendlyMsg = mapVisitorErrorMessage(err);
      if (mountedRef.current) {
        setSendError(friendlyMsg);
      }
      return { error: friendlyMsg };
    } finally {
      createLockRef.current = false;
      if (createAbortControllerRef.current === controller) {
        createAbortControllerRef.current = null;
      }
      if (mountedRef.current) {
        setSending(false);
      }
    }
  };

  // 7. Envia mensagem subsequente via Edge Function send-message com AbortController
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

    const remainingSec = getRateLimitRemainingSeconds(rateLimitUntilRef.current, 'send');
    if (remainingSec > 0) {
      const friendly = `Muitas tentativas em pouco tempo. Por favor, aguarde ${remainingSec} segundos antes de tentar novamente.`;
      if (mountedRef.current) setSendError(friendly);
      return { error: friendly };
    }

    if (!canStartVisitorOperation({ createLock: createLockRef.current, sendLock: sendLockRef.current }, 'send')) {
      return { error: 'Envio em andamento. Por favor, aguarde...' };
    }
    sendLockRef.current = true;

    if (sendAbortControllerRef.current) {
      sendAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    sendAbortControllerRef.current = controller;
    const signal = controller.signal;

    if (mountedRef.current) {
      setSending(true);
      setSendError(null);
    }

    const tempMsgId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const optimisticMsg = {
      id: tempMsgId,
      conversation_id: conversation.id,
      sender_type: 'visitor',
      content: trimmed,
      created_at: new Date().toISOString(),
    };

    if (mountedRef.current) {
      setMessages((prev) => [...prev, optimisticMsg]);
    }

    try {
      const jwt = await getValidVisitorJwt(activeSupabase, { mountedRef, setUser });
      if (signal.aborted || !mountedRef.current) {
        throw new EdgeFunctionError({ status: 499, code: 'CLIENT_CLOSED_REQUEST', message: 'Operação cancelada.' });
      }

      const sendPayload = buildSendMessagePayload(conversation.id, trimmed);
      const msgRes = await callEdgeFunction('send-message', sendPayload, { jwt, signal });

      const canonicalMsg = validateCanonicalVisitorMessage(msgRes, conversation.id, trimmed);
      if (!canonicalMsg) {
        if (mountedRef.current) {
          setMessages((prev) => prev.filter((m) => m.id !== tempMsgId));
        }
        throw new EdgeFunctionError({
          status: 500,
          code: 'INVALID_MESSAGE_RESPONSE',
          message: 'Formato de resposta inválido ao enviar mensagem.',
        });
      }

      if (mountedRef.current) {
        setMessages((prev) => reconcileOptimisticMessage(prev, tempMsgId, canonicalMsg, conversation.id));
      }

      return { message: canonicalMsg, error: null };
    } catch (err) {
      if (mountedRef.current) {
        setMessages((prev) => prev.filter((m) => m.id !== tempMsgId));
      }

      if (err instanceof EdgeFunctionError && err.status === 429) {
        rateLimitUntilRef.current = applyRateLimit(rateLimitUntilRef.current, 'send', err);
      }

      const friendlyMsg = mapVisitorErrorMessage(err);
      if (mountedRef.current) {
        setSendError(friendlyMsg);
      }
      return { error: friendlyMsg };
    } finally {
      sendLockRef.current = false;
      if (sendAbortControllerRef.current === controller) {
        sendAbortControllerRef.current = null;
      }
      if (mountedRef.current) {
        setSending(false);
      }
    }
  };

  const resetForNewConversation = useCallback(() => {
    if (mountedRef.current) {
      setConversation(null);
      setMessages([]);
    }
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
