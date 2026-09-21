import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, X, Loader2, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import PhoneInput, { formatToE164 } from '../chat/PhoneInput';
import { isValidCheckoutUrl, extractCheckoutParams } from '../../lib/checkoutAllowlist';
import { supabase } from '../../lib/supabaseClient';
import { brandSymbol, handleBrandImageError } from '../../assets/brandAssets';
import './PreCheckoutStyles.css';

export function PreCheckoutModal({ isOpen, targetCheckoutUrl, metadata, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneData, setPhoneData] = useState({
    rawPhone: '',
    countryCode: 'US',
    dialCode: '+1',
    e164: '',
  });
  const [consentGiven, setConsentGiven] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const previousFocusRef = useRef(null);
  const openTimeRef = useRef(0);
  const hasNavigatedRef = useRef(false);

  // Inicialização e gerenciamento de foco/acessibilidade ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      openTimeRef.current = Date.now();
      hasNavigatedRef.current = false;
      setSubmitting(false);
      setErrorMsg('');

      // Foco automático no primeiro campo após renderização
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 50);
    } else {
      // Devolve o foco ao elemento original que acionou o modal ao fechar
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  // Handler para tecla Escape (Acessibilidade)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !isValidCheckoutUrl(targetCheckoutUrl)) {
    return null;
  }

  const productName = (metadata?.product || 'slimsoda').toUpperCase();
  const avatarUrl = settingsAvatarForProduct(metadata?.product);

  // Função estritamente isolada de navegação única (Single Redirect Guard)
  const safeRedirect = (url) => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    try {
      if (typeof window !== 'undefined' && window.top) {
        window.top.location.assign(url);
      } else {
        window.location.href = url;
      }
    } catch (e) {
      window.location.href = url;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || hasNavigatedRef.current) return;

    setErrorMsg('');

    // 1. Validação do Campo Honeypot (Se preenchido por bot, redireciona direto sem salvar)
    if (honeypot.trim() !== '') {
      safeRedirect(targetCheckoutUrl);
      return;
    }

    // 2. Proteção de Tempo Mínimo (Se enviado em < 800ms da abertura, redireciona direto)
    const elapsed = Date.now() - openTimeRef.current;
    if (elapsed < 800) {
      safeRedirect(targetCheckoutUrl);
      return;
    }

    // 3. Validações de Formulário
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!phoneData.rawPhone.trim() || phoneData.e164.length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    if (!consentGiven) {
      setErrorMsg('You must agree to continue to checkout.');
      return;
    }

    setSubmitting(true);

    const formattedE164 = formatToE164(phoneData.dialCode, phoneData.rawPhone);
    const checkoutParams = extractCheckoutParams(targetCheckoutUrl);

    const leadPayload = {
      p_name: name.trim(),
      p_email: email.trim().toLowerCase(),
      p_phone: formattedE164,
      p_country_code: phoneData.countryCode,
      p_dial_code: phoneData.dialCode,
      p_product: metadata?.product || 'slimsoda',
      p_page_type: metadata?.pageType || 'pdp',
      p_consent_given: true,
      p_offer: metadata?.offer || null,
      p_page_title: document.title ? document.title.slice(0, 300) : null,
      p_source_url: window.location.href ? window.location.href.slice(0, 2048) : null,
      p_source_path: window.location.pathname ? window.location.pathname.slice(0, 1024) : null,
      p_checkout_url: targetCheckoutUrl,
      p_visitor_id: getVisitorId(),
      p_affid: checkoutParams.affid,
      p_hid: checkoutParams.hid,
      p_hcid: checkoutParams.hcid,
      p_subid: checkoutParams.subid,
      p_subid2: checkoutParams.subid2,
      p_subid3: checkoutParams.subid3,
      p_utm_source: checkoutParams.utm_source,
      p_utm_medium: checkoutParams.utm_medium,
      p_utm_campaign: checkoutParams.utm_campaign,
      p_utm_content: checkoutParams.utm_content,
      p_utm_term: checkoutParams.utm_term,
      p_referrer: document.referrer ? document.referrer.slice(0, 1024) : null,
    };

    // 4. Execução Resiliente com Temporizador de Fallback (2500ms)
    let fallbackTimer = setTimeout(() => {
      safeRedirect(targetCheckoutUrl);
    }, 2500);

    try {
      if (supabase && typeof supabase.rpc === 'function') {
        await supabase.rpc('save_checkout_lead', leadPayload);
      }
    } catch (err) {
      console.warn('[PreCheckout] RPC submission error - proceeding to checkout via fallback', err);
    } finally {
      clearTimeout(fallbackTimer);
      safeRedirect(targetCheckoutUrl);
    }
  };

  return (
    <div className="eg-precheckout-overlay" role="presentation" onClick={(e) => {
      if (e.target === e.currentTarget && !submitting) onClose();
    }}>
      <div
        ref={modalRef}
        className="eg-precheckout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="eg-precheckout-modal-title"
      >
        <div className="eg-precheckout-header">
          <div className="eg-precheckout-brand-row">
            <img
              src={avatarUrl}
              alt="Essencial Good"
              className="eg-precheckout-logo"
              onError={(e) => handleBrandImageError(e, brandSymbol)}
            />
            <div className="eg-precheckout-title-wrap">
              <h2 id="eg-precheckout-modal-title" className="eg-precheckout-title">
                Complete Your Details
              </h2>
              <p className="eg-precheckout-subtitle">
                Enter your details to proceed to secure checkout for {productName}.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="eg-precheckout-close-btn"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="eg-precheckout-form">
          {errorMsg && (
            <div className="eg-precheckout-error-banner">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Campo Honeypot Oculto (Anti-Spam) */}
          <input
            type="text"
            name="website_url_hp"
            className="eg-precheckout-hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="eg-precheckout-field">
            <label htmlFor="precheckout-name" className="eg-precheckout-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="precheckout-name"
              type="text"
              className="eg-precheckout-input"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="eg-precheckout-field">
            <label htmlFor="precheckout-email" className="eg-precheckout-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="precheckout-email"
              type="email"
              className="eg-precheckout-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="eg-precheckout-field">
            <label htmlFor="precheckout-phone" className="eg-precheckout-label">
              Phone Number <span className="required">*</span>
            </label>
            <PhoneInput
              value={phoneData}
              onChange={setPhoneData}
              disabled={submitting}
              required
            />
          </div>

          <label className="eg-precheckout-consent-wrap">
            <input
              type="checkbox"
              className="eg-precheckout-consent-checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              disabled={submitting}
              required
            />
            <span className="eg-precheckout-consent-text">
              I agree to receive order updates, support assistance and exclusive offers.
            </span>
          </label>

          <button
            type="submit"
            className="eg-precheckout-submit-btn"
            disabled={submitting || !name.trim() || !email.trim() || !phoneData.rawPhone.trim() || !consentGiven}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="eg-precheckout-spinner" />
                Connecting to Checkout...
              </>
            ) : (
              <>
                CONTINUE TO SECURE CHECKOUT
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="eg-precheckout-security-footer">
          <Lock size={13} />
          <span>256-Bit SSL Encryption • 100% Secure Transaction</span>
        </div>
      </div>
    </div>
  );
}

function settingsAvatarForProduct(product) {
  const p = (product || '').toLowerCase();
  if (p.includes('slimsoda')) return '/assets/pdp/slimsoda/slimsoda-gallery-1.png';
  if (p.includes('sonnus')) return brandSymbol;
  if (p.includes('crowned')) return brandSymbol;
  if (p.includes('linfaflow')) return '/linfaflow/images/gallery-hero-cover.jpg';
  return brandSymbol;
}

function getVisitorId() {
  try {
    if (typeof localStorage !== 'undefined') {
      let vid = localStorage.getItem('eg_visitor_id');
      if (!vid) {
        vid = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        localStorage.setItem('eg_visitor_id', vid);
      }
      return vid;
    }
  } catch (e) {}
  return null;
}

export default PreCheckoutModal;
