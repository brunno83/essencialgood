import React, { useState } from 'react';
import { Send, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export function ChatWelcomeForm({ onSubmit, sending, error }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Por favor, informe seu nome para iniciar.');
      return;
    }

    if (!initialMessage.trim()) {
      setValidationError('Por favor, digite sua mensagem.');
      return;
    }

    const res = await onSubmit({
      name: name.trim(),
      email: email.trim(),
      initialMessage: initialMessage.trim(),
    });

    if (res?.error) {
      setValidationError(res.error);
    }
  };

  return (
    <div className="chat-welcome-form-container">
      <div className="chat-welcome-header">
        <div className="chat-welcome-icon">
          <img
            src="/assets/Brand/essencial-good-symbol.png"
            alt="Essencial Good"
            className="chat-welcome-symbol-img"
          />
        </div>
        <h3 className="chat-welcome-title">Fale com a Essencial Good</h3>
        <p className="chat-welcome-subtitle">
          Preencha os campos abaixo para iniciar seu atendimento ao vivo com nossa equipe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="chat-welcome-form">
        {(validationError || error) && (
          <div className="chat-welcome-error">
            <AlertCircle size={16} />
            <span>{validationError || error}</span>
          </div>
        )}

        <div className="chat-field">
          <label htmlFor="visitor-name" className="chat-label">
            Seu Nome <span className="required">*</span>
          </label>
          <input
            id="visitor-name"
            type="text"
            className="chat-input"
            placeholder="Como gostaria de ser chamado(a)?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={sending}
            required
          />
        </div>

        <div className="chat-field">
          <label htmlFor="visitor-email" className="chat-label">
            E-mail <span className="optional">(opcional)</span>
          </label>
          <input
            id="visitor-email"
            type="email"
            className="chat-input"
            placeholder="para receber a resposta caso saia do site"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
          />
        </div>

        <div className="chat-field">
          <label htmlFor="visitor-msg" className="chat-label">
            Sua Mensagem <span className="required">*</span>
          </label>
          <textarea
            id="visitor-msg"
            className="chat-textarea"
            placeholder="Digite como podemos te ajudar..."
            rows={3}
            value={initialMessage}
            onChange={(e) => {
              if (e.target.value.length <= 4000) {
                setInitialMessage(e.target.value);
              }
            }}
            disabled={sending}
            required
          />
          <span className="chat-char-count">{initialMessage.length}/4000</span>
        </div>

        <div className="chat-privacy-notice">
          <ShieldCheck size={14} />
          <span>Ao iniciar a conversa, seus dados serão utilizados apenas para atendimento.</span>
        </div>

        <button
          type="submit"
          className="chat-submit-btn"
          disabled={sending || !name.trim() || !initialMessage.trim()}
        >
          {sending ? (
            <>
              <Loader2 size={18} className="chat-spinner" />
              Conectando...
            </>
          ) : (
            <>
              Iniciar Conversa
              <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChatWelcomeForm;
