import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import './AdminStyles.css';

export function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Por favor, preencha todos os campos para continuar.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('O serviço do Supabase não está configurado. Verifique o arquivo .env.local.');
      return;
    }

    setLoading(true);

    try {
      // 1. Tenta autenticar via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        console.warn('[AdminLogin] Falha no login:', authError.message);
        if (authError.message.includes('Invalid login credentials')) {
          setErrorMessage('E-mail ou senha incorretos. Verifique suas credenciais.');
        } else {
          setErrorMessage('Não foi possível realizar o login: ' + authError.message);
        }
        setLoading(false);
        return;
      }

      const currentUser = authData?.user;
      if (!currentUser) {
        setErrorMessage('Falha ao obter os dados do usuário autenticado.');
        setLoading(false);
        return;
      }

      // 2. Consulta a tabela public.admin_profiles para validar a role
      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('[AdminLogin] Erro ao verificar perfil de admin:', profileError.message);
        await supabase.auth.signOut();
        setErrorMessage('Erro ao verificar permissões de acesso. Entre em contato com o suporte.');
        setLoading(false);
        return;
      }

      if (!profile || (profile.role !== 'admin' && profile.role !== 'agent')) {
        // Usuário sem permissão administrativa: força logout imediato
        await supabase.auth.signOut();
        setErrorMessage('Sua conta não possui permissão de acesso ao painel administrativo.');
        setLoading(false);
        return;
      }

      // Login autorizado com sucesso!
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess({ user: currentUser, profile });
      }
    } catch (err) {
      console.error('[AdminLogin] Exceção durante o login:', err);
      setErrorMessage('Ocorreu um erro inesperado ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-badge">
            <ShieldCheck size={14} />
            Área Restrita
          </div>
          <h1 className="admin-login-title">Painel Administrativo</h1>
          <p className="admin-login-subtitle">Acesse com suas credenciais de equipe Essencial Good</p>
        </div>

        {errorMessage && (
          <div className="admin-alert-error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} style={{ shrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-login-form" noValidate>
          <div className="admin-input-group">
            <label className="admin-input-label" htmlFor="admin-email">E-mail Corporativo</label>
            <div className="admin-input-wrapper">
              <Mail className="admin-input-icon" />
              <input
                id="admin-email"
                type="email"
                className="admin-input"
                placeholder="seu.email@essencialgood.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label" htmlFor="admin-password">Senha de Acesso</label>
            <div className="admin-input-wrapper">
              <Lock className="admin-input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="admin-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn-primary"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="admin-spinner" style={{ width: '18px', height: '18px' }} />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>Entrar no Painel</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
