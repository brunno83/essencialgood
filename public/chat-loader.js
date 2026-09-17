/**
 * Essencial Good - ChatWidget Standalone Loader
 * Loader leve em JavaScript puro para incorporação em páginas estáticas (Advertoriais e Power Pages)
 * Encapsulado em Closed Shadow DOM para isolamento total contra scripts externos (UTMify, LiteSpeed, Elementor)
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
    hostCreatedCount: 0,
    shadowRootCreatedCount: 0,
    iframeCreatedCount: 0,
    iframeAppendCount: 0,
    iframeOnloadCount: 0,
    srcChangesCount: 0,
    removalsOrReplacesCount: 0,
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

  // URL exata do iframe limpa (sem UTMs para evitar re-execução de scripts externos)
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

  // Cria a infraestrutura do Shadow DOM e Iframe
  function createWidgetIframe() {
    // 1. Elemento Host no document.body
    var host = document.createElement('div');
    host.id = 'essencial-good-chat-host';
    loaderCounters.hostCreatedCount++;

    host.style.position = 'fixed';
    host.style.bottom = '16px';
    host.style.right = '16px';
    host.style.width = '80px';
    host.style.height = '80px';
    host.style.zIndex = '999999';
    host.style.border = 'none';
    host.style.background = 'transparent';
    host.style.transition = 'none'; // Sem animações de dimensões no outer container
    host.style.pointerEvents = 'none';

    // Marcadores para exclusão de UTMify e otimizadores externos
    host.setAttribute('data-no-utm', '1');
    host.setAttribute('data-utmify-ignore', '1');
    host.setAttribute('data-skip-utm', '1');
    host.setAttribute('data-no-lazy', '1');

    logLoader('Host element created in document.body', {
      hostId: host.id,
      hostCreatedCount: loaderCounters.hostCreatedCount,
    });

    // 2. Attach Closed Shadow DOM para isolamento de document.querySelectorAll('iframe')
    var shadowRoot = host.attachShadow({ mode: 'closed' });
    loaderCounters.shadowRootCreatedCount++;

    logLoader('Closed Shadow DOM attached to host', {
      shadowRootCreatedCount: loaderCounters.shadowRootCreatedCount,
    });

    // 3. Container interno dentro do Shadow DOM
    var frameContainer = document.createElement('div');
    frameContainer.id = 'essencial-chat-loader-container';
    frameContainer.style.width = '100%';
    frameContainer.style.height = '100%';
    frameContainer.style.position = 'relative';
    frameContainer.style.border = 'none';
    frameContainer.style.background = 'transparent';
    frameContainer.style.pointerEvents = 'none';

    // 4. Elemento Iframe criado dentro do Shadow DOM
    var iframe = document.createElement('iframe');
    loaderCounters.iframeCreatedCount++;

    iframe.id = 'essencial-good-chat-frame';
    iframe.title = 'Suporte ao Vivo - Essencial Good';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    iframe.style.pointerEvents = 'auto';
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('loading', 'eager');
    iframe.className = 'no-lazy skip-lazy litespeed-no-lazy no-lazyload no-utmify';
    iframe.setAttribute('data-no-lazy', '1');
    iframe.setAttribute('data-skip-lazy', '1');
    iframe.setAttribute('data-litespeed-no-lazy', '1');
    iframe.setAttribute('data-no-optimize', '1');
    iframe.setAttribute('data-no-utm', '1');
    iframe.setAttribute('data-utmify-ignore', '1');

    // Atribuição da URL exata uma única vez
    iframe.src = frameUrl;

    logLoader('Iframe created inside Closed Shadow DOM', {
      iframeId: iframe.id,
      initialSrc: frameUrl,
      iframeCreatedCount: loaderCounters.iframeCreatedCount,
    });

    frameContainer.appendChild(iframe);
    shadowRoot.appendChild(frameContainer);
    loaderCounters.iframeAppendCount++;

    // Instrumentação de MutationObserver (apenas se ?chat_debug=1 ativo)
    if (isDebug && typeof MutationObserver !== 'undefined') {
      var attrObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.type === 'attributes') {
            if (m.attributeName === 'src') {
              loaderCounters.srcChangesCount++;
            }
            logLoader('MUTATION OBSERVED on iframe attribute', {
              attributeName: String(m.attributeName),
              oldValue: String(m.oldValue || ''),
              newValue: String(iframe.getAttribute(m.attributeName) || ''),
              currentSrc: String(iframe.src || ''),
              isConnected: iframe.isConnected,
              srcChangesCount: loaderCounters.srcChangesCount,
              stack: new Error().stack ? String(new Error().stack) : 'N/A',
            });
          }
        });
      });
      attrObserver.observe(iframe, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['src', 'data-src', 'loading', 'class', 'style'],
      });
    }

    // Redimensionamento imediato do host externo (sem animação CSS no container)
    function setWidgetDimensions(isOpen) {
      var isMobile = isMobileViewport();
      var prevWidth = host.style.width;
      var prevHeight = host.style.height;

      if (!isOpen) {
        host.style.width = '80px';
        host.style.height = '80px';
        host.style.bottom = '16px';
        host.style.right = '16px';
      } else {
        if (isMobile) {
          host.style.width = '100vw';
          host.style.height = '100vh';
          host.style.bottom = '0px';
          host.style.right = '0px';
        } else {
          host.style.width = '424px';
          host.style.height = '664px';
          host.style.maxHeight = 'calc(100vh - 24px)';
          host.style.maxWidth = 'calc(100vw - 24px)';
          host.style.bottom = '12px';
          host.style.right = '12px';
        }
      }

      logLoader('Host dimensions updated immediately (no animation)', {
        isOpen: isOpen,
        isMobileViewport: isMobile,
        prevWidth: prevWidth,
        prevHeight: prevHeight,
        newWidth: host.style.width,
        newHeight: host.style.height,
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
      loaderCounters.iframeOnloadCount++;
      logLoader('Iframe onload event fired', {
        iframeOnloadCount: loaderCounters.iframeOnloadCount,
        isConnected: iframe.isConnected,
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
          host.style.display = 'none';
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

    // Injeta o host no document.body quando a página estiver pronta
    if (document.body) {
      document.body.appendChild(host);
      logLoader('Host element appended to document.body');
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(host);
        logLoader('Host element appended to document.body on DOMContentLoaded');
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
