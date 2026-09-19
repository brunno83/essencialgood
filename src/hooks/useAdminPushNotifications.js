import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Converte chave pública VAPID em formato URL-safe Base64 para Uint8Array exigida pela Push API
 */
export function urlBase64ToUint8Array(base64String) {
  if (!base64String || typeof base64String !== 'string') {
    throw new Error('Chave VAPID pública inválida ou não fornecida.');
  }
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Converte ArrayBuffer (chaves p256dh / auth do PushSubscription) para string Base64 URL-safe
 */
export function arrayBufferToBase64(buffer) {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function useAdminPushNotifications() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'unsupported' | 'available' | 'permission_denied' | 'active_this_device' | 'disabled' | 'error'
  const [notifyChats, setNotifyChats] = useState(true);
  const [notifyLeads, setNotifyLeads] = useState(true);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isIOSNotStandalone, setIsIOSNotStandalone] = useState(false);

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  const isVapidConfigured = Boolean(vapidPublicKey && vapidPublicKey.trim() !== '' && !vapidPublicKey.includes('your-vapid'));

  // 1. Verificação de compatibilidade e estado inicial
  const checkStatus = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);

    // Detecção de recursos (Feature Detection)
    const hasSW = 'serviceWorker' in navigator;
    const hasPush = 'PushManager' in window;
    const hasNotification = 'Notification' in window;

    if (!hasSW || !hasPush || !hasNotification) {
      setStatus('unsupported');
      return;
    }

    // Detecção de iOS fora do modo standalone (PWA não instalado)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    if (isIOSDevice && !isStandaloneMatch) {
      setIsIOSNotStandalone(true);
      setStatus('unsupported');
      return;
    } else {
      setIsIOSNotStandalone(false);
    }

    // Checagem de permissão do navegador
    if (Notification.permission === 'denied') {
      setStatus('permission_denied');
      return;
    }

    if (!isVapidConfigured) {
      setStatus('available');
      return;
    }

    try {
      // Obter Service Worker e Subscription ativa
      const registration = await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();

      if (existingSub && isSupabaseConfigured && supabase) {
        // Consultar o status no Supabase via RPC
        const { data: dbStatus, error: rpcErr } = await supabase.rpc('get_my_push_notification_status', {
          p_endpoint: existingSub.endpoint,
        });

        if (!rpcErr && dbStatus?.subscribed && dbStatus?.enabled) {
          setStatus('active_this_device');
          setNotifyChats(dbStatus.notify_chats ?? true);
          setNotifyLeads(dbStatus.notify_leads ?? true);
          setSubscriptionId(dbStatus.subscription_id);
          return;
        }
      }

      if (existingSub) {
        setStatus('active_this_device');
      } else {
        setStatus('available');
      }
    } catch (err) {
      console.warn('[Push Hook] Erro ao consultar estado do push:', err);
      setStatus('available');
    }
  }, [isVapidConfigured]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // 2. Ação de Ativação (Disparada exclusivamente após o clique do usuário)
  const enablePush = useCallback(async () => {
    setErrorMessage(null);
    setStatus('loading');

    if (!isVapidConfigured) {
      setErrorMessage('Chave VAPID pública não configurada no ambiente (VITE_VAPID_PUBLIC_KEY).');
      setStatus('available');
      return false;
    }

    try {
      // Pedir permissão explicitamente se necessário
      let perm = Notification.permission;
      if (perm === 'default') {
        perm = await Notification.requestPermission();
      }

      if (perm !== 'granted') {
        setStatus('permission_denied');
        setErrorMessage('Permissão para notificações foi negada no navegador.');
        return false;
      }

      // Aguardar Service Worker pronto
      const registration = await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();
      let endpoint = subscription?.endpoint;

      // Se existir uma subscription antiga no navegador, testar registro ou renovação
      if (subscription && endpoint) {
        const p256dhKey = subscription.getKey ? subscription.getKey('p256dh') : null;
        const authKey = subscription.getKey ? subscription.getKey('auth') : null;
        const p256dh = arrayBufferToBase64(p256dhKey);
        const auth_key = arrayBufferToBase64(authKey);

        const { data: rpcRes, error: rpcErr } = await supabase.rpc('register_push_subscription', {
          p_endpoint: endpoint,
          p_p256dh: p256dh,
          p_auth_key: auth_key,
          p_notify_chats: notifyChats,
          p_notify_leads: notifyLeads,
        });

        if (rpcErr && (rpcErr.code === '23505' || rpcErr.message?.includes('outro usuário'))) {
          // Endpoint pertencia a outro usuário logado anteriormente neste aparelho. Unsubscribe local para permitir novo registro!
          console.warn('[Push Hook] Endpoint pertencia a outra conta. Desativando localmente para registrar nova chave...');
          await subscription.unsubscribe().catch(() => {});
          subscription = null;
        } else if (rpcErr) {
          throw new Error(rpcErr.message);
        } else if (rpcRes?.success) {
          setStatus('active_this_device');
          setSubscriptionId(rpcRes.subscription_id);
          return true;
        }
      }

      // Se não havia subscription ou se a subscription antiga pertencia a outro usuário e foi limpa localmente:
      if (!subscription) {
        const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        endpoint = subscription.endpoint;
        const p256dhKey = subscription.getKey ? subscription.getKey('p256dh') : null;
        const authKey = subscription.getKey ? subscription.getKey('auth') : null;
        const p256dh = arrayBufferToBase64(p256dhKey);
        const auth_key = arrayBufferToBase64(authKey);

        if (!endpoint || !p256dh || !auth_key) {
          throw new Error('Falha ao extrair chaves da inscrição do navegador.');
        }

        if (!isSupabaseConfigured || !supabase) {
          throw new Error('Supabase não configurado.');
        }

        const { data: rpcRes, error: rpcErr } = await supabase.rpc('register_push_subscription', {
          p_endpoint: endpoint,
          p_p256dh: p256dh,
          p_auth_key: auth_key,
          p_notify_chats: notifyChats,
          p_notify_leads: notifyLeads,
        });

        if (rpcErr) throw new Error(rpcErr.message);

        if (rpcRes?.success) {
          setStatus('active_this_device');
          setSubscriptionId(rpcRes.subscription_id);
          return true;
        } else {
          throw new Error('Resposta inválida do servidor ao registrar inscrição.');
        }
      }
    } catch (err) {
      console.error('[Push Hook] Erro ao ativar notificações:', err);
      setErrorMessage(err.message || 'Falha ao ativar notificações neste dispositivo.');
      setStatus('available');
      return false;
    }
  }, [isVapidConfigured, vapidPublicKey, notifyChats, notifyLeads]);

  // 3. Ação de Desativação no dispositivo
  const disablePush = useCallback(async () => {
    setErrorMessage(null);
    setStatus('loading');

    try {
      let endpointToRemove = null;

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          endpointToRemove = subscription.endpoint;
          await subscription.unsubscribe();
        }
      }

      // Limpa a inscrição no banco de dados via RPC
      if (isSupabaseConfigured && supabase) {
        await supabase.rpc('unregister_push_subscription', {
          p_subscription_id: subscriptionId,
          p_endpoint: endpointToRemove,
        });
      }

      // Limpa badges
      if ('clearAppBadge' in navigator && typeof navigator.clearAppBadge === 'function') {
        navigator.clearAppBadge().catch(() => {});
      }

      setStatus('disabled');
      setSubscriptionId(null);
      return true;
    } catch (err) {
      console.error('[Push Hook] Erro ao desativar notificações:', err);
      setErrorMessage(err.message || 'Falha ao desativar notificações.');
      setStatus('active_this_device');
      return false;
    }
  }, [subscriptionId]);

  // 4. Atualização de preferências (Novos chats / Novos leads)
  const updatePreferences = useCallback(async (newChats, newLeads) => {
    setNotifyChats(newChats);
    setNotifyLeads(newLeads);

    if (subscriptionId && isSupabaseConfigured && supabase) {
      try {
        await supabase.rpc('update_push_preferences', {
          p_subscription_id: subscriptionId,
          p_notify_chats: newChats,
          p_notify_leads: newLeads,
        });
      } catch (err) {
        console.warn('[Push Hook] Erro ao atualizar preferências:', err);
      }
    }
  }, [subscriptionId]);

  return {
    status,
    notifyChats,
    notifyLeads,
    subscriptionId,
    errorMessage,
    isIOSNotStandalone,
    isVapidConfigured,
    enablePush,
    disablePush,
    updatePreferences,
    checkStatus,
  };
}

export default useAdminPushNotifications;
