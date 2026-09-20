// ESSENCIAL GOOD - VISITOR CHAT RUNTIME HELPERS (Pure Functions)
// Pure helper functions for payload building, canonical message validation,
// optimistic message reconciliation, rate limit calculation, and operation lock checking.

export function buildCreateConversationPayload(input = {}, sourceInfo = {}, turnstileToken = '') {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
  const countryCode = typeof input.countryCode === 'string' ? input.countryCode.trim() : '';
  const dialCode = typeof input.dialCode === 'string' ? input.dialCode.trim() : '';

  const payload = {
    turnstileToken: turnstileToken || '',
    visitor_name: name,
    source_url: sourceInfo?.source_url || null,
    source_path: sourceInfo?.source_path || null,
    source_title: sourceInfo?.source_title || null,
    source_product: sourceInfo?.source_product || null,
  };

  if (email) payload.visitor_email = email;
  if (phone) payload.visitor_phone = phone;
  if (countryCode) payload.visitor_country_code = countryCode;
  if (dialCode) payload.visitor_dial_code = dialCode;

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
}

export function buildSendMessagePayload(conversationId, content) {
  const cleanId = typeof conversationId === 'string' ? conversationId.trim() : '';
  const cleanContent = typeof content === 'string' ? content.trim() : '';

  return {
    conversation_id: cleanId,
    content: cleanContent,
  };
}

export function validateCanonicalVisitorMessage(msgRes, expectedConvId, expectedContent) {
  if (!msgRes || typeof msgRes !== 'object' || Array.isArray(msgRes)) {
    return null;
  }

  // Resposta deve ser objeto direto sem wrapper inventado (.message ou .data)
  if ('message' in msgRes || 'data' in msgRes) {
    return null;
  }

  const id = msgRes.id;
  const conversation_id = msgRes.conversation_id;
  const sender_type = msgRes.sender_type;
  const content = msgRes.content;
  const created_at = msgRes.created_at;

  if (typeof id !== 'string' || id.trim().length === 0) {
    return null;
  }

  if (!expectedConvId || typeof expectedConvId !== 'string' || conversation_id !== expectedConvId.trim()) {
    return null;
  }

  if (sender_type !== 'visitor') {
    return null;
  }

  if (expectedContent !== undefined && content !== expectedContent.trim()) {
    return null;
  }

  if (typeof created_at !== 'string' || created_at.trim().length === 0 || isNaN(Date.parse(created_at))) {
    return null;
  }

  return {
    id: id.trim(),
    conversation_id: conversation_id.trim(),
    sender_type: 'visitor',
    content: content.trim(),
    created_at: created_at.trim(),
  };
}

export function reconcileOptimisticMessage(messages, tempId, canonicalMsg, activeConvId) {
  if (!Array.isArray(messages)) return [];

  const baseMessages = activeConvId
    ? messages.filter((m) => !m.conversation_id || m.conversation_id === activeConvId)
    : messages;

  if (!canonicalMsg || !canonicalMsg.id) {
    return tempId ? baseMessages.filter((m) => m.id !== tempId) : baseMessages;
  }

  if (activeConvId && canonicalMsg.conversation_id !== activeConvId) {
    return tempId ? baseMessages.filter((m) => m.id !== tempId) : baseMessages;
  }

  const hasCanonical = baseMessages.some((m) => m.id === canonicalMsg.id);
  const hasTemp = tempId ? baseMessages.some((m) => m.id === tempId) : false;

  if (hasCanonical) {
    return tempId ? baseMessages.filter((m) => m.id !== tempId) : baseMessages;
  }

  if (hasTemp) {
    return baseMessages.map((m) => (m.id === tempId ? canonicalMsg : m));
  }

  return [...baseMessages, canonicalMsg];
}

export function getRateLimitRemainingSeconds(rateLimitUntil = {}, scope = 'create', now = Date.now()) {
  const until = rateLimitUntil[scope] || 0;
  const diff = until - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / 1000);
}

export function applyRateLimit(rateLimitUntil = {}, scope = 'create', error = null, now = Date.now()) {
  if (!rateLimitUntil || typeof rateLimitUntil !== 'object') return { create: 0, send: 0 };
  const updated = { ...rateLimitUntil };

  if (error && error.status === 429) {
    const waitSec = Number.isInteger(error.retryAfterSeconds) && error.retryAfterSeconds > 0
      ? error.retryAfterSeconds
      : 60;
    updated[scope] = now + waitSec * 1000;
  }

  return updated;
}

export function canStartVisitorOperation(locks = {}, targetScope = 'create') {
  if (locks.createLock || locks.sendLock) {
    return false;
  }
  return true;
}
