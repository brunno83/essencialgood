/**
 * Diagnostic Instrumentation Helper for ChatWidget Standalone
 * Active ONLY when location.search or parent location.search contains ?chat_debug=1
 */

const globalInstanceCounter = {
  loaderMounts: 0,
  iframeCreates: 0,
  widgetFrameAppMounts: 0,
  widgetFrameChatInnerMounts: 0,
  chatWidgetMounts: 0,
  supabaseClientCreates: 0,
  initSentCount: 0,
  initReceivedCount: 0,
};

export function isChatDebug() {
  if (typeof window === 'undefined') return false;
  try {
    const search = window.location.search || '';
    let parentSearch = '';
    try {
      if (window.parent && window.parent !== window && window.parent.location) {
        parentSearch = window.parent.location.search || '';
      }
    } catch (e) {
      // Cross-origin restriction on window.parent.location is normal
    }
    return search.includes('chat_debug=1') || parentSearch.includes('chat_debug=1');
  } catch (e) {
    return false;
  }
}

export function debugLog(scope, action, details = {}) {
  if (!isChatDebug()) return;
  const time = typeof performance !== 'undefined' ? performance.now().toFixed(2) : '0';
  console.log(`[CHAT_DEBUG][${time}ms][${scope}] ${action}`, details);
}

export function incrementDebugCount(key) {
  if (key in globalInstanceCounter) {
    globalInstanceCounter[key]++;
  }
  return globalInstanceCounter[key] || 0;
}

export function getDebugCounts() {
  return { ...globalInstanceCounter };
}
