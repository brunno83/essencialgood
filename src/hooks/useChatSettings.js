import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const DEFAULT_CHAT_SETTINGS = {
  header_title: 'Essencial Good',
  header_subtitle: 'Live Support',
  form_title: 'Chat with Essencial Good',
  form_subtitle: 'Fill in the details below to start your live chat with our team.',
  agent_name: 'Essencial Good Team',
  avatar_url: '/assets/Brand/essencial-good-symbol.png',
  welcome_message: 'Hello! How can we help you today?',
  is_enabled: true,
  phone_required: true,
  email_required: false,
};

export function useChatSettings() {
  const [settings, setSettings] = useState(DEFAULT_CHAT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      // 1. Tenta chamar RPC segura public.get_public_chat_settings()
      const { data: rpcData, error: rpcErr } = await supabase
        .rpc('get_public_chat_settings');

      if (!rpcErr && rpcData && rpcData.length > 0) {
        setSettings((prev) => ({
          ...prev,
          ...rpcData[0],
        }));
        setLoading(false);
        return;
      }

      // 2. Fallback caso RPC ainda não exista (migration recente): busca APENAS campos públicos permitidos (sem updated_by)
      const { data, error: err } = await supabase
        .from('chat_settings')
        .select('header_title, header_subtitle, form_title, form_subtitle, agent_name, avatar_url, welcome_message, is_enabled, phone_required, email_required')
        .eq('id', 'default')
        .maybeSingle();

      if (err) {
        console.warn('[useChatSettings] Warning fetching settings:', err.message);
        setError(err.message);
      } else if (data) {
        setSettings((prev) => ({
          ...prev,
          ...data,
        }));
      }
    } catch (e) {
      console.warn('[useChatSettings] Unexpected error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    if (!isSupabaseConfigured || !supabase) return;

    // Realtime subscription para atualizar apenas configurações visuais sem remontar o chat
    const channel = supabase
      .channel('chat_settings_public_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_settings', filter: 'id=eq.default' },
        (payload) => {
          if (payload.new) {
            const n = payload.new;
            setSettings((prev) => ({
              ...prev,
              header_title: n.header_title ?? prev.header_title,
              header_subtitle: n.header_subtitle ?? prev.header_subtitle,
              form_title: n.form_title ?? prev.form_title,
              form_subtitle: n.form_subtitle ?? prev.form_subtitle,
              agent_name: n.agent_name ?? prev.agent_name,
              avatar_url: n.avatar_url ?? prev.avatar_url,
              welcome_message: n.welcome_message ?? prev.welcome_message,
              is_enabled: n.is_enabled ?? prev.is_enabled,
              phone_required: n.phone_required ?? prev.phone_required,
              email_required: n.email_required ?? prev.email_required,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSettings]);

  const updateSettings = async (updates) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Supabase is not configured' };
    }

    // Regra: pelo menos um meio de contato obrigatório
    if (!updates.phone_required && !updates.email_required) {
      return { error: 'Selecione pelo menos um meio de contato obrigatório.' };
    }

    try {
      const payload = {
        header_title: updates.header_title,
        header_subtitle: updates.header_subtitle,
        form_title: updates.form_title,
        form_subtitle: updates.form_subtitle,
        agent_name: updates.agent_name,
        avatar_url: updates.avatar_url,
        welcome_message: updates.welcome_message,
        is_enabled: updates.is_enabled,
        phone_required: updates.phone_required,
        email_required: updates.email_required,
      };

      const { data, error: err } = await supabase
        .from('chat_settings')
        .update(payload)
        .eq('id', 'default')
        .select()
        .single();

      if (err) {
        return { error: err.message };
      }

      if (data) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
      return { data };
    } catch (e) {
      return { error: e.message || 'Error updating settings' };
    }
  };

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    updateSettings,
  };
}

export default useChatSettings;
