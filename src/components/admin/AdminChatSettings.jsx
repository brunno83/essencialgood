import React, { useState, useEffect, useRef } from 'react';
import { useChatSettings } from '../../hooks/useChatSettings';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { Save, Loader2, CheckCircle2, AlertCircle, Upload, Trash2, ShieldAlert } from 'lucide-react';
import PhoneInput from '../chat/PhoneInput';

export function AdminChatSettings({ adminProfile }) {
  const isAdmin = adminProfile?.role === 'admin';

  const { settings, loading, error: fetchError, updateSettings } = useChatSettings();

  const DEFAULT_AVATAR = '/assets/Brand/essencial-good-symbol.png';

  const [formState, setFormState] = useState({
    header_title: '',
    header_subtitle: '',
    form_title: '',
    form_subtitle: '',
    agent_name: '',
    avatar_url: '',
    welcome_message: '',
    is_enabled: true,
    phone_required: true,
    email_required: false,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setFormState({
        header_title: settings.header_title || 'Essencial Good',
        header_subtitle: settings.header_subtitle || 'Live Support',
        form_title: settings.form_title || 'Chat with Essencial Good',
        form_subtitle: settings.form_subtitle || 'Fill in the details below to start your live chat with our team.',
        agent_name: settings.agent_name || 'Essencial Good Team',
        avatar_url: settings.avatar_url || DEFAULT_AVATAR,
        welcome_message: settings.welcome_message || 'Hello! How can we help you today?',
        is_enabled: settings.is_enabled ?? true,
        phone_required: settings.phone_required ?? true,
        email_required: settings.email_required ?? false,
      });
    }
  }, [settings]);

  // Se o usuário logado for 'agent', bloqueia o acesso à tela
  if (!isAdmin) {
    return (
      <div className="admin-access-denied" style={{ padding: '40px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '24px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="#DC2626" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', margin: '0 0 8px' }}>
          Acesso Restrito
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto' }}>
          Apenas usuários com perfil de Administrador podem visualizar e alterar as configurações públicas do chat. Seus privilégios atuais são de Agente.
        </p>
      </div>
    );
  }

  const handleChange = (field, value) => {
    if (field === 'phone_required' && value === false && formState.email_required === false) {
      setSaveError('Selecione pelo menos um meio de contato obrigatório.');
      return;
    }
    if (field === 'email_required' && value === false && formState.phone_required === false) {
      setSaveError('Selecione pelo menos um meio de contato obrigatório.');
      return;
    }

    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  /**
   * Extrai o caminho relativo dentro do bucket se o avatar for uma imagem armazenada em chat-assets/avatars/
   */
  const getStorageAvatarPath = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.includes('/chat-assets/avatars/')) {
      const fileName = url.split('/chat-assets/avatars/').pop();
      return fileName ? `avatars/${fileName}` : null;
    }
    return null;
  };

  // Upload seguro com rollback caso a persistência no banco falhe
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setSaveError(null);

    // 1. Validação de tamanho (máximo 2 MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('O arquivo excede o limite de 2 MB.');
      return;
    }

    // 2. Validação de MIME Type e Extensão
    const validMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const validExtensions = ['png', 'jpg', 'jpeg', 'webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!validMimeTypes.includes(file.type) || !validExtensions.includes(ext)) {
      setUploadError('Formato inválido. Envie apenas imagens PNG, JPG, JPEG ou WebP.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setUploadError('Supabase não está configurado.');
      return;
    }

    setUploading(true);
    let newStoragePath = null;

    try {
      // 3. Nome seguro utilizando crypto.randomUUID()
      const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      newStoragePath = `avatars/chat-avatar-${uuid}.${ext}`;

      // 4. Upload para o bucket chat-assets
      const { error: uploadErr } = await supabase.storage
        .from('chat-assets')
        .upload(newStoragePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadErr) throw uploadErr;

      // 5. Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from('chat-assets')
        .getPublicUrl(newStoragePath);

      const newPublicUrl = publicUrlData?.publicUrl || `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/chat-assets/${newStoragePath}`;

      // 6. Atualizar a configuração no banco de dados primeiro
      const oldAvatarUrl = formState.avatar_url;
      const updatedForm = { ...formState, avatar_url: newPublicUrl };
      
      const updateRes = await updateSettings(updatedForm);

      if (updateRes?.error) {
        // ROLLBACK: Se o update no banco falhar, exclui o arquivo enviado do Storage e preserva o avatar anterior
        await supabase.storage.from('chat-assets').remove([newStoragePath]);
        throw new Error(`Falha ao salvar configuração: ${updateRes.error}`);
      }

      // 7. Se o update no banco teve sucesso, exclui a imagem antiga do Storage (somente se estava em chat-assets/avatars/)
      const oldStoragePath = getStorageAvatarPath(oldAvatarUrl);
      if (oldStoragePath) {
        await supabase.storage.from('chat-assets').remove([oldStoragePath]);
      }

      setFormState(updatedForm);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('[AdminChatSettings] Upload error:', err);
      setUploadError(err.message || 'Falha ao processar o upload do avatar.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Restauração do avatar padrão
  const handleRestoreDefaultAvatar = async () => {
    const oldAvatarUrl = formState.avatar_url;
    if (oldAvatarUrl === DEFAULT_AVATAR) return;

    setSaving(true);
    setSaveError(null);

    const updatedForm = { ...formState, avatar_url: DEFAULT_AVATAR };
    const res = await updateSettings(updatedForm);

    setSaving(false);

    if (res?.error) {
      setSaveError(res.error);
    } else {
      // Exclui a imagem antiga do Storage se estivesse em chat-assets/avatars/
      const oldStoragePath = getStorageAvatarPath(oldAvatarUrl);
      if (oldStoragePath && supabase) {
        try {
          await supabase.storage.from('chat-assets').remove([oldStoragePath]);
        } catch (e) {
          console.warn('[AdminChatSettings] Warning cleaning up old avatar:', e);
        }
      }
      setFormState(updatedForm);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    // Validações de preenchimento e trim
    const trimmedState = {
      header_title: formState.header_title.trim(),
      header_subtitle: formState.header_subtitle.trim(),
      form_title: formState.form_title.trim(),
      form_subtitle: formState.form_subtitle.trim(),
      agent_name: formState.agent_name.trim(),
      avatar_url: formState.avatar_url.trim(),
      welcome_message: formState.welcome_message ? formState.welcome_message.trim() : 'Hello! How can we help you today?',
      is_enabled: formState.is_enabled,
      phone_required: formState.phone_required,
      email_required: formState.email_required,
    };

    if (!trimmedState.header_title) {
      setSaveError('O título do cabeçalho não pode ficar em branco.');
      setSaving(false);
      return;
    }
    if (!trimmedState.form_title) {
      setSaveError('O título do formulário não pode ficar em branco.');
      setSaving(false);
      return;
    }
    if (!trimmedState.phone_required && !trimmedState.email_required) {
      setSaveError('Selecione pelo menos um meio de contato obrigatório.');
      setSaving(false);
      return;
    }

    const res = await updateSettings(trimmedState);

    setSaving(false);
    if (res?.error) {
      setSaveError(res.error);
    } else {
      setFormState(trimmedState);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-container" style={{ padding: '40px', textAlign: 'center' }}>
        <Loader2 size={32} className="admin-spinner" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '12px', color: '#64748B' }}>Carregando configurações do chat...</p>
      </div>
    );
  }

  return (
    <div className="admin-settings-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="admin-settings-header">
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 }}>
          Configurações do Chat Público
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
          Gerencie a identidade, os textos em inglês e as regras de contato do atendimento ao vivo.
        </p>
      </div>

      {fetchError && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '8px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>Aviso: Usando padrões EN-US em memória ({fetchError})</span>
        </div>
      )}

      {saveSuccess && (
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '12px 16px', borderRadius: '8px', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>Configurações salvas com sucesso! O chat público foi atualizado.</span>
        </div>
      )}

      {saveError && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '8px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{saveError}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px', alignItems: 'start' }}>
        {/* FORMULÁRIO DE CONFIGURAÇÕES (PT-BR) */}
        <form onSubmit={handleSave} className="admin-settings-card" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', margin: 0 }}>
            Textos e Identidade Visual (EN-US)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Título do Cabeçalho (Header Title)
              </label>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{formState.header_title.length}/80</span>
            </div>
            <input
              type="text"
              className="admin-input"
              value={formState.header_title}
              onChange={(e) => handleChange('header_title', e.target.value)}
              placeholder="Essencial Good"
              maxLength={80}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Subtítulo do Cabeçalho (Header Subtitle)
              </label>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{formState.header_subtitle.length}/120</span>
            </div>
            <input
              type="text"
              className="admin-input"
              value={formState.header_subtitle}
              onChange={(e) => handleChange('header_subtitle', e.target.value)}
              placeholder="Live Support"
              maxLength={120}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Título do Formulário Inicial (Welcome Title)
              </label>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{formState.form_title.length}/120</span>
            </div>
            <input
              type="text"
              className="admin-input"
              value={formState.form_title}
              onChange={(e) => handleChange('form_title', e.target.value)}
              placeholder="Chat with Essencial Good"
              maxLength={120}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Subtítulo do Formulário (Welcome Subtitle)
              </label>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{formState.form_subtitle.length}/300</span>
            </div>
            <textarea
              className="admin-textarea"
              rows={2}
              value={formState.form_subtitle}
              onChange={(e) => handleChange('form_subtitle', e.target.value)}
              placeholder="Fill in the details below to start your live chat with our team."
              maxLength={300}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Nome de Exibição da Equipe (Agent Name)
              </label>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{formState.agent_name.length}/80</span>
            </div>
            <input
              type="text"
              className="admin-input"
              value={formState.agent_name}
              onChange={(e) => handleChange('agent_name', e.target.value)}
              placeholder="Essencial Good Team"
              maxLength={80}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>

          {/* UPLOAD REAL DE IMAGEM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
              Avatar do Atendimento (Símbolo / Logo)
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#4B6833', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={formState.avatar_url || DEFAULT_AVATAR}
                  alt="Avatar Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || saving}
                    style={{ background: '#334155', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {uploading ? (
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Upload size={14} />
                    )}
                    {uploading ? 'Enviando...' : 'Enviar Nova Imagem'}
                  </button>

                  {formState.avatar_url !== DEFAULT_AVATAR && (
                    <button
                      type="button"
                      onClick={handleRestoreDefaultAvatar}
                      disabled={uploading || saving}
                      style={{ background: 'transparent', color: '#DC2626', border: '1px solid #FECACA', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={14} /> Restaurar Padrão
                    </button>
                  )}
                </div>

                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  PNG, JPG, WebP. Tamanho máximo: 2 MB. Armazenado em `chat-assets/avatars/`.
                </span>
              </div>
            </div>

            {uploadError && (
              <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '2px' }}>{uploadError}</span>
            )}
          </div>

          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginTop: '12px', marginBottom: 0 }}>
            Regras de Contato e Disponibilidade
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formState.is_enabled}
                onChange={(e) => handleChange('is_enabled', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#4B6833' }}
              />
              <span style={{ fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>
                Ativar Chat Público em todas as páginas
              </span>
            </label>

            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Regra de Contato Obrigatório (Pelo menos um)
              </span>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formState.phone_required}
                  onChange={(e) => handleChange('phone_required', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#4B6833' }}
                />
                <span style={{ fontSize: '14px', color: '#1E293B' }}>
                  Exigir Telefone obrigatoriamente (*)
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formState.email_required}
                  onChange={(e) => handleChange('email_required', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#4B6833' }}
                />
                <span style={{ fontSize: '14px', color: '#1E293B' }}>
                  Exigir E-mail obrigatoriamente (*)
                </span>
              </label>
            </div>
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving || uploading}
              style={{
                background: '#4B6833',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>

        {/* PRÉ-VISUALIZAÇÃO AO VIVO 100% VISUAL (SEM EFEITOS COLATERAIS) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pré-visualização Ao Vivo (Visual Preview)
            </h3>
            <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '2px 8px', borderRadius: '12px', color: '#475569', fontWeight: '600' }}>
              EN-US
            </span>
          </div>

          <div style={{ background: '#EAE6DF', padding: '16px', borderRadius: '16px', border: '1px solid #CBD5E1', minHeight: '580px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '380px' }}>
              <PureVisualChatWindowPreview settings={formState} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de Pré-Visualização 100% Apresentacional
 * Garante ZERO chamadas ao Supabase Auth, ZERO inserção de conversa, ZERO inscrição em canais realtime e ZERO eventos postMessage.
 */
function PureVisualChatWindowPreview({ settings }) {
  const headerTitle = settings?.header_title || 'Essencial Good';
  const headerSubtitle = settings?.header_subtitle || 'Live Support';
  const avatarUrl = settings?.avatar_url || '/assets/Brand/essencial-good-symbol.png';
  const formTitle = settings?.form_title || 'Chat with Essencial Good';
  const formSubtitle = settings?.form_subtitle || 'Fill in the details below to start your live chat with our team.';
  const isEmailReq = settings?.email_required ?? false;
  const isPhoneReq = settings?.phone_required ?? true;

  return (
    <div className="chat-window-container" role="dialog" aria-label="Essencial Good Live Support Preview">
      <div className="chat-window-header">
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            <img
              src={avatarUrl}
              alt={headerTitle}
              className="chat-header-symbol-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/Brand/essencial-good-symbol.png';
              }}
            />
          </div>
          <div>
            <h3 className="chat-header-title">{headerTitle}</h3>
            <span className="chat-header-status">
              <span className="chat-status-dot" /> {headerSubtitle}
            </span>
          </div>
        </div>
        <button className="chat-close-btn" onClick={(e) => e.preventDefault()} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="chat-window-body">
        <div className="chat-welcome-form-container">
          <div className="chat-welcome-header">
            <h3 className="chat-welcome-title">{formTitle}</h3>
            <p className="chat-welcome-subtitle">{formSubtitle}</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="chat-welcome-form">
            <div className="chat-field">
              <label className="chat-label">Your Name <span className="required">*</span></label>
              <input type="text" className="chat-input" placeholder="How would you like to be called?" disabled />
            </div>

            <div className="chat-field">
              <label className="chat-label">
                Email {isEmailReq ? <span className="required">*</span> : <span className="optional">(optional)</span>}
              </label>
              <input type="email" className="chat-input" placeholder="To receive a reply if you leave" disabled />
            </div>

            <div className="chat-field">
              <label className="chat-label">
                Phone Number {isPhoneReq ? <span className="required">*</span> : <span className="optional">(optional)</span>}
              </label>
              <PhoneInput disabled />
            </div>

            <div className="chat-field">
              <label className="chat-label">Your Message <span className="required">*</span></label>
              <textarea className="chat-textarea" placeholder="How can we help you today?" rows={2} disabled />
            </div>

            <button type="button" className="chat-submit-btn" disabled>
              Start Chat
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminChatSettings;
