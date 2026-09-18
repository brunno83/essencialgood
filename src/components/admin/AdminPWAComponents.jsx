import React, { useState } from 'react';
import { WifiOff, RefreshCw, Smartphone, Share, PlusSquare, CheckCircle2, X } from 'lucide-react';

/**
 * Overlay Opaco de Segurança para Estado Offline.
 * Garantia de Segurança: Substitui e desmonta totalmente os componentes de dados (leads/conversas),
 * impedindo leitura visual, clique, tabulação ou exposição de PII enquanto o dispositivo estiver offline.
 */
export function AdminOfflineOverlay() {
  return (
    <div
      className="admin-offline-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Aviso de conexão offline"
    >
      <div className="admin-offline-card">
        <div className="admin-offline-icon-wrapper">
          <WifiOff size={32} />
        </div>
        <h2 className="admin-offline-title">Sem Conexão com a Internet</h2>
        <p className="admin-offline-message">
          Você está offline. Conecte-se à internet para acessar o painel administrativo e consultar registros em tempo real.
        </p>
        <button className="admin-btn-secondary" onClick={() => window.location.reload()}>
          <RefreshCw size={15} />
          <span>Tentar Reconectar</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Banner discreto exibido no topo do painel quando uma nova versão do SW for detectada.
 */
export function AdminUpdateBanner({ onApplyUpdate }) {
  return (
    <div className="admin-pwa-update-banner" role="alert">
      <div className="admin-pwa-update-info">
        <RefreshCw size={16} className="spin" />
        <span>Nova versão do aplicativo disponível.</span>
      </div>
      <button className="admin-btn-primary" onClick={onApplyUpdate}>
        Atualizar agora
      </button>
    </div>
  );
}

/**
 * Widget discreto de instalação do PWA para Android/Chrome e iPhone (Safari).
 */
export function AdminInstallWidget({ canInstall, isIOS, isStandalone, onInstall }) {
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Se o app já estiver rodando em modo standalone, oculta a opção de instalação
  if (isStandalone) {
    return (
      <div className="admin-pwa-installed-badge">
        <CheckCircle2 size={15} />
        <span>Aplicativo Instalado</span>
      </div>
    );
  }

  // Se não puder instalar nem for iOS, não exibe nada
  if (!canInstall && !isIOS) {
    return null;
  }

  return (
    <>
      {canInstall && (
        <button
          className="admin-pwa-install-btn"
          onClick={onInstall}
          title="Instalar aplicativo administrativo no dispositivo"
        >
          <Smartphone size={16} />
          <span>Instalar aplicativo</span>
        </button>
      )}

      {isIOS && !canInstall && (
        <button
          className="admin-pwa-install-btn"
          onClick={() => setShowIOSModal(true)}
          title="Instruções para adicionar à Tela de Início no iPhone"
        >
          <Smartphone size={16} />
          <span>Instalar no iPhone</span>
        </button>
      )}

      {/* Modal com instruções para iOS / Safari */}
      {showIOSModal && (
        <div className="admin-modal-overlay" onClick={() => setShowIOSModal(false)}>
          <div className="admin-modal-content ios-install-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Instalar no iPhone / iPad</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowIOSModal(false)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p className="ios-install-intro">
                Para instalar o <strong>Essencial Good Admin</strong> no seu iPhone ou iPad:
              </p>

              <ol className="ios-install-steps">
                <li>
                  <div className="step-icon">
                    <Share size={18} />
                  </div>
                  <span>1. Toque no botão <strong>Compartilhar</strong> na barra do Safari.</span>
                </li>

                <li>
                  <div className="step-icon">
                    <PlusSquare size={18} />
                  </div>
                  <span>2. Role as opções e escolha <strong>“Adicionar à Tela de Início”</strong>.</span>
                </li>

                <li>
                  <div className="step-icon">
                    <CheckCircle2 size={18} />
                  </div>
                  <span>3. Confirme clicando em <strong>“Adicionar”</strong> no canto superior direito.</span>
                </li>
              </ol>

              <p className="ios-install-note">
                O aplicativo será instalado como um app independente (standalone) com acesso rápido direto da sua Tela de Início.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setShowIOSModal(false)}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
