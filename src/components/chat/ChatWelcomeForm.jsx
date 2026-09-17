import React, { useState } from 'react';
import { Send, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import PhoneInput, { formatToE164 } from './PhoneInput';

export function ChatWelcomeForm({ onSubmit, sending, error, settings }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneData, setPhoneData] = useState({
    rawPhone: '',
    countryCode: 'US',
    dialCode: '+1',
    e164: '',
  });
  const [initialMessage, setInitialMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const formTitle = settings?.form_title || 'Chat with Essencial Good';
  const formSubtitle =
    settings?.form_subtitle ||
    'Fill in the details below to start your live chat with our team.';
  const isEmailRequired = settings?.email_required ?? false;
  const isPhoneRequired = settings?.phone_required ?? true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your name to start.');
      return;
    }

    if (isEmailRequired && !email.trim()) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (isPhoneRequired && (!phoneData.rawPhone.trim() || phoneData.e164.length < 8)) {
      setValidationError('Please enter a valid phone number.');
      return;
    }

    if (!initialMessage.trim()) {
      setValidationError('Please type your message.');
      return;
    }

    const formattedE164 = phoneData.rawPhone.trim()
      ? formatToE164(phoneData.dialCode, phoneData.rawPhone)
      : '';

    const res = await onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: formattedE164,
      countryCode: formattedE164 ? phoneData.countryCode : null,
      dialCode: formattedE164 ? phoneData.dialCode : null,
      initialMessage: initialMessage.trim(),
    });

    if (res?.error) {
      setValidationError(res.error);
    }
  };

  return (
    <div className="chat-welcome-form-container">
      <div className="chat-welcome-header">
        <h3 className="chat-welcome-title">{formTitle}</h3>
        <p className="chat-welcome-subtitle">{formSubtitle}</p>
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
            Your Name <span className="required">*</span>
          </label>
          <input
            id="visitor-name"
            type="text"
            className="chat-input"
            placeholder="How would you like to be called?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={sending}
            required
          />
        </div>

        <div className="chat-field">
          <label htmlFor="visitor-email" className="chat-label">
            Email {isEmailRequired ? <span className="required">*</span> : <span className="optional">(optional)</span>}
          </label>
          <input
            id="visitor-email"
            type="email"
            className="chat-input"
            placeholder="To receive a reply if you leave"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
            required={isEmailRequired}
          />
        </div>

        <div className="chat-field">
          <label htmlFor="visitor-phone" className="chat-label">
            Phone Number {isPhoneRequired ? <span className="required">*</span> : <span className="optional">(optional)</span>}
          </label>
          <PhoneInput
            value={phoneData}
            onChange={setPhoneData}
            disabled={sending}
            required={isPhoneRequired}
          />
        </div>

        <div className="chat-field">
          <label htmlFor="visitor-msg" className="chat-label">
            Your Message <span className="required">*</span>
          </label>
          <textarea
            id="visitor-msg"
            className="chat-textarea"
            placeholder="How can we help you today?"
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
          <span>By starting a chat, your details will only be used for support.</span>
        </div>

        <button
          type="submit"
          className="chat-submit-btn"
          disabled={
            sending ||
            !name.trim() ||
            !initialMessage.trim() ||
            (isEmailRequired && !email.trim()) ||
            (isPhoneRequired && !phoneData.rawPhone.trim())
          }
        >
          {sending ? (
            <>
              <Loader2 size={18} className="chat-spinner" />
              Connecting...
            </>
          ) : (
            <>
              Start Chat
              <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChatWelcomeForm;
