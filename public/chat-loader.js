/**
 * Essencial Good - ChatWidget Standalone Loader
 * Loader leve em JavaScript puro para incorporação em páginas estáticas (Advertoriais e Power Pages)
 */
(function () {
  'use strict';

  if (window.__ESSENCIAL_CHAT_LOADER_INITIALIZED__) {
    return;
  }
  window.__ESSENCIAL_CHAT_LOADER_INITIALIZED__ = true;

  var isDebug = (window.location.search || '').indexOf('chat_debug=1') !== -1;
  var loaderInstanceId = Math.random().toString(36).substring(2, 7);

  function logLoader(action, details) {
    if (!isDebug) return;
    var t = typeof performance !== 'undefined' ? performance.now().toFixed(2) : '0';
    console.log('[CHAT_DEBUG][' + t + 'ms][LOADER:' + loaderInstanceId + '] ' + action, details || {});
  }

  logLoader('Loader script executed');

  // Busca a tag do script atual para extrair data-product
  var scriptTag =
    document.currentScript ||
    document.querySelector('script[data-product]') ||
    document.querySelector('script[src*="chat-loader.js"]');

  var configuredProduct = scriptTag ? scriptTag.getAttribute('data-product') : null;

  // Determina a origem de produção vs desenvolvimento local
  var hostname = (window.location.hostname || '').toLowerCase().trim();
  var isDev = hostname === 'localhost' || hostname === '127.0.0.1';

  var WIDGET_ORIGIN = isDev
    ? window.location.origin
    : 'https://www.essencialgood.com';

  var frameUrl = WIDGET_ORIGIN + '/widget-frame';
  if (isDebug) {
    frameUrl += '?chat_debug=1';
  }

  // Sanitiza dados da página hospedeira (sem query params e sem PII)
  function getSanitizedHostMetadata() {
    var loc = window.location;
    var host = (loc.hostname || '').toLowerCase().trim();
    var path = loc.pathname || '/';
    if (!path.startsWith('/')) path = '/' + path;

    var cleanUrl = (loc.protocol + '//' + loc.host + path).slice(0, 2048);
    var title = (document.title || '').trim().slice(0, 300);

    // Inferência defensiva de produto se não configurado no data-product
    var product = (configuredProduct || '').toLowerCase().trim();
    if (!product) {
      var fullPath = (path + ' ' + host).toLowerCase();
      if (fullPath.includes('crowned')) product = 'crowned';
      else if (fullPath.includes('linfaflow')) product = 'linfaflow';
      else if (fullPath.includes('memoflow')) product = 'memoflow';
      else if (fullPath.includes('slimsoda')) product = 'slimsoda';
      else if (fullPath.includes('sonnus')) product = 'sonnus';
      else product = 'institucional';
    }

    return {
      sourceUrl: cleanUrl,
      sourcePath: path.slice(0, 1024),
      sourceHost: host.slice(0, 253),
      sourceTitle: title,
      sourceProduct: product.slice(0, 100),
    };
  }

  // Cria o elemento Iframe e o container flutuante
  function createWidgetIframe() {
    var container = document.createElement('div');
    container.id = 'essencial-chat-loader-container';
    
    // Estilização do container (botão colapsado por padrão)
    container.style.position = 'fixed';
    container.style.bottom = '16px';
    container.style.right = '16px';
    container.style.width = '80px';
    container.style.height = '80px';
    container.style.zIndex = '999999';
    container.style.border = 'none';
    container.style.background = 'transparent';
    container.style.transition = 'width 0.25s ease, height 0.25s ease, bottom 0.25s ease, right 0.25s ease';
    container.style.pointerEvents = 'none';

    logLoader('Container created', { width: '80px', height: '80px' });

    var iframe = document.createElement('iframe');
    iframe.id = 'essencial-chat-iframe';
    iframe.title = 'Suporte ao Vivo - Essencial Good';
    iframe.src = frameUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    iframe.style.pointerEvents = 'auto';
    iframe.setAttribute('allowtransparency', 'true');

    logLoader('Iframe created', { src: frameUrl });

    container.appendChild(iframe);

    // Redimensionamento dinâmico baseado em postMessage
    function setWidgetDimensions(isOpen) {
      var isMobile = window.innerWidth <= 640;
      var prevWidth = container.style.width;
      var prevHeight = container.style.height;

      if (!isOpen) {
        container.style.width = '80px';
        container.style.height = '80px';
        container.style.bottom = '16px';
        container.style.right = '16px';
      } else {
        if (isMobile) {
          container.style.width = '100vw';
          container.style.height = '100vh';
          container.style.bottom = '0px';
          container.style.right = '0px';
        } else {
          container.style.width = '400px';
          container.style.height = '640px';
          container.style.maxHeight = 'calc(100vh - 32px)';
          container.style.maxWidth = 'calc(100vw - 32px)';
          container.style.bottom = '16px';
          container.style.right = '16px';
        }
      }

      logLoader('Container dimensions updated', {
        isOpen: isOpen,
        isMobile: isMobile,
        prevWidth: prevWidth,
        prevHeight: prevHeight,
        newWidth: container.style.width,
        newHeight: container.style.height,
      });
    }

    var initAttempts = 0;
    var initInterval = null;

    function stopInitLoop() {
      if (initInterval) {
        logLoader('Retry loop stopped', { attemptsExecuted: initAttempts });
        clearInterval(initInterval);
        initInterval = null;
      }
    }

    function sendInitPayload() {
      if (iframe.contentWindow) {
        logLoader('INIT sent to iframe', { attempt: initAttempts + 1 });
        iframe.contentWindow.postMessage(
          {
            type: 'ESSENCIAL_CHAT_INIT',
            payload: getSanitizedHostMetadata(),
          },
          WIDGET_ORIGIN
        );
      }
    }

    function startInitLoop() {
      if (initInterval) {
        logLoader('startInitLoop called while loop already running - ignored');
        return;
      }
      logLoader('Retry loop started');
      sendInitPayload();
      initAttempts = 0;
      initInterval = setInterval(function () {
        initAttempts++;
        if (initAttempts >= 15) {
          logLoader('Retry loop reached maximum 15 attempts - stopping');
          stopInitLoop();
        } else {
          sendInitPayload();
        }
      }, 300);
    }

    iframe.onload = function () {
      logLoader('Iframe onload event fired');
      startInitLoop();
    };

    // Listener para Handshake postMessage
    function handleMessage(event) {
      // Valida origem da mensagem enviada pelo Iframe estritamente contra WIDGET_ORIGIN
      var origin = (event.origin || '').toLowerCase().trim();
      var expectedOrigin = WIDGET_ORIGIN.toLowerCase().trim();

      if (origin !== expectedOrigin) {
        return;
      }

      var data = event.data;
      if (!data || typeof data !== 'object') return;

      logLoader('Message received from iframe', { type: data.type });

      switch (data.type) {
        case 'ESSENCIAL_CHAT_READY':
          logLoader('READY received from iframe');
          sendInitPayload();
          break;

        case 'ESSENCIAL_CHAT_ACK':
          logLoader('ACK received from iframe - stopping retries');
          stopInitLoop();
          break;

        case 'ESSENCIAL_CHAT_OPEN':
          logLoader('OPEN received from iframe');
          stopInitLoop();
          setWidgetDimensions(true);
          break;

        case 'ESSENCIAL_CHAT_CLOSE':
          logLoader('CLOSE received from iframe');
          stopInitLoop();
          setWidgetDimensions(false);
          break;

        case 'ESSENCIAL_CHAT_UNREAD':
          logLoader('UNREAD received from iframe', { count: data.payload ? data.payload.count : 0 });
          stopInitLoop();
          break;

        case 'ESSENCIAL_CHAT_ERROR':
          logLoader('ERROR received from iframe');
          stopInitLoop();
          container.style.display = 'none';
          break;
      }
    }

    window.addEventListener('message', handleMessage);
    logLoader('Message listener added to window');

    if (isDebug) {
      window.addEventListener('resize', function () {
        logLoader('Host window resize event', { innerWidth: window.innerWidth, innerHeight: window.innerHeight });
      });
      document.addEventListener('pointerdown', function (e) {
        logLoader('Host document pointerdown event', {
          targetTagName: e.target ? e.target.tagName : null,
          targetId: e.target ? e.target.id : null,
        });
      });
    }

    // Injeta no DOM quando a página estiver pronta
    if (document.body) {
      document.body.appendChild(container);
      logLoader('Container appended to body');
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(container);
        logLoader('Container appended to body on DOMContentLoaded');
      });
    }
  }

  // Inicializa o loader de maneira resiliente
  try {
    createWidgetIframe();
  } catch (err) {
    // Falha silenciosa em produção para nunca quebrar a página de vendas
  }
})();
