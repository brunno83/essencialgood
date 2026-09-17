import React, { useState } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';

export function ChatComposer({ onSendMessage, sending, disabled, sendError }) {
  const [text, setText] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || disabled) return;

    const res = await onSendMessage(trimmed);
    if (!res?.error) {
      setText('');
    }
  };

  return (
    <div className="chat-composer-container">
      {sendError && (
        <div className="chat-composer-error">
          <AlertCircle size={14} />
          <span>{sendError}</span>
        </div>
      )}

      <div className="chat-composer-input-row">
        <textarea
          className="chat-composer-textarea"
          placeholder={disabled ? 'Chat closed...' : 'Type a message...'}
          rows={1}
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= 4000) {
              setText(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={sending || disabled}
        />

        <button
          className="chat-composer-send-btn"
          onClick={handleSend}
          disabled={sending || disabled || !text.trim()}
          title="Send message"
          aria-label="Send message"
        >
          {sending ? (
            <Loader2 size={18} className="chat-spinner" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      <div className="chat-composer-footer">
        <span className="chat-composer-hint">Enter to send • Shift + Enter for new line</span>
        <span className="chat-composer-count">{text.length}/4000</span>
      </div>
    </div>
  );
}

export default ChatComposer;
