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

  var loaderCounters = {
    creations: 0,
    appendChilds: 0,
    onloads: 0,
    srcChanges: 0,
    removalsOrReplaces: 0,
  };

  var chatIsOpen = false;

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

  // Detecção de viewport mobile exclusivamente baseada na janela hospedeira
  var mobileMedia = window.matchMedia('(max-width: 640px)');

  function isMobileViewport() {
    return mobileMedia.matches;
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
    
    // Estilização estrita do container (sem animação de dimensões para evitar ResizeObserver layout thrashing)
    container.style.position = 'fixed';
    container.style.bottom = '16px';
    container.style.right = '16px';
    container.style.width = '80px';
    container.style.height = '80px';
    container.style.zIndex = '999999';
    container.style.border = 'none';
    container.style.background = 'transparent';
    container.style.transition = 'none'; // REMOVIDO REDIMENSIONAMENTO ANIMADO EXTERNO
    container.style.pointerEvents = 'none';

    logLoader('Container created', { width: '80px', height: '80px' });

    var iframe = document.createElement('iframe');
    loaderCounters.creations++;

    // Identificador estável e marcadores para excluir de otimizadores e lazy loaders
    iframe.id = 'essencial-good-chat-frame';
    iframe.title = 'Suporte ao Vivo - Essencial Good';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    iframe.style.pointerEvents = 'auto';
    iframe.setAttribute('allowtransparency', 'true');

    // Atributos e classes explícitas para ignorar LiteSpeed, WP Rocket, Elementor e LazyLoad
    iframe.setAttribute('loading', 'eager');
    iframe.className = 'no-lazy skip-lazy litespeed-no-lazy no-lazyload';
    iframe.setAttribute('data-no-lazy', '1');
    iframe.setAttribute('data-skip-lazy', '1');
    iframe.setAttribute('data-litespeed-no-lazy', '1');
    iframe.setAttribute('data-no-optimize', '1');

    // Atribuição de src ÚNICA no carregamento inicial
    iframe.src = frameUrl;

    logLoader('Iframe element created', {
      id: iframe.id,
      src: frameUrl,
      creationsTotal: loaderCounters.creations,
    });

    container.appendChild(iframe);

    // Instrumentação de MutationObserver quando ?chat_debug=1 ativo
    if (isDebug && typeof MutationObserver !== 'undefined') {
      var attrObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.type === 'attributes') {
            if (m.attributeName === 'src') {
              loaderCounters.srcChanges++;
            }
            logLoader('MUTATION OBSERVED on iframe attribute', {
              attributeName: m.attributeName,
              oldValue: m.oldValue,
              newValue: iframe.getAttribute(m.attributeName),
              currentSrc: iframe.src,
              isConnected: iframe.isConnected,
              isSameElement: iframe === document.getElementById('essencial-good-chat-frame'),
              stack: new Error().stack,
            });
          }
        });
      });
      attrObserver.observe(iframe, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['src', 'data-src', 'loading', 'class', 'style'],
      });

      var childObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.type === 'childList') {
            m.removedNodes.forEach(function (node) {
              if (node === iframe || (node.id && node.id === 'essencial-good-chat-frame')) {
                loaderCounters.removalsOrReplaces++;
                logLoader('WARNING: iframe removed from DOM', {
                  removalsTotal: loaderCounters.removalsOrReplaces,
                  isConnected: iframe.isConnected,
                  stack: new Error().stack,
                });
              }
            });
          }
        });
      });
      childObserver.observe(container, { childList: true });
    }

    // Redimensionamento imediato sem transition CSS
    function setWidgetDimensions(isOpen) {
      var isMobile = isMobileViewport();
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

      logLoader('Container dimensions updated immediately (no animation)', {
        isOpen: isOpen,
        isMobileViewport: isMobile,
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

    function sendStateSync() {
      if (iframe.contentWindow) {
        logLoader('STATE sync sent to iframe', { isOpen: chatIsOpen });
        iframe.contentWindow.postMessage(
          {
            type: 'ESSENCIAL_CHAT_STATE',
            payload: { isOpen: chatIsOpen },
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
      loaderCounters.onloads++;
      logLoader('Iframe onload event fired', {
        onloadCount: loaderCounters.onloads,
        isConnected: iframe.isConnected,
        isSameElement: iframe === document.getElementById('essencial-good-chat-frame'),
        currentSrc: iframe.src,
      });
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
          sendStateSync();
          break;

        case 'ESSENCIAL_CHAT_ACK':
          logLoader('ACK received from iframe - stopping retries');
          stopInitLoop();
          sendStateSync();
          break;

        case 'ESSENCIAL_CHAT_OPEN':
          logLoader('OPEN received from iframe (user explicit action)');
          chatIsOpen = true;
          stopInitLoop();
          setWidgetDimensions(true);
          break;

        case 'ESSENCIAL_CHAT_CLOSE':
          logLoader('CLOSE received from iframe (user explicit action)');
          chatIsOpen = false;
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

    // Recalcula dimensões apenas quando o viewport da página hospedeira realmente mudar
    mobileMedia.addEventListener('change', function () {
      logLoader('Host viewport breakpoint change', { isMobile: isMobileViewport() });
      setWidgetDimensions(chatIsOpen);
    });

    if (isDebug) {
      window.addEventListener('resize', function () {
        logLoader('Host window resize event', { innerWidth: window.innerWidth, innerHeight: window.innerHeight });
      });
    }

    // Injeta no DOM quando a página estiver pronta
    if (document.body) {
      document.body.appendChild(container);
      loaderCounters.appendChilds++;
      logLoader('Container appended to body', { appendChildsTotal: loaderCounters.appendChilds });
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(container);
        loaderCounters.appendChilds++;
        logLoader('Container appended to body on DOMContentLoaded', { appendChildsTotal: loaderCounters.appendChilds });
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
