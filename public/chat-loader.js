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

    container.appendChild(iframe);

    // Redimensionamento dinâmico baseado em postMessage
    function setWidgetDimensions(isOpen) {
      var isMobile = window.innerWidth <= 640;

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
    }

    function sendInitPayload() {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: 'ESSENCIAL_CHAT_INIT',
            payload: getSanitizedHostMetadata(),
          },
          WIDGET_ORIGIN
        );
      }
    }

    iframe.onload = function () {
      sendInitPayload();
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

      switch (data.type) {
        case 'ESSENCIAL_CHAT_READY':
          sendInitPayload();
          break;

        case 'ESSENCIAL_CHAT_OPEN':
          setWidgetDimensions(true);
          break;

        case 'ESSENCIAL_CHAT_CLOSE':
          setWidgetDimensions(false);
          break;

        case 'ESSENCIAL_CHAT_UNREAD':
          // Notificação de não lidas recebida
          break;

        case 'ESSENCIAL_CHAT_ERROR':
          container.style.display = 'none';
          break;
      }
    }

    window.addEventListener('message', handleMessage);

    // Injeta no DOM quando a página estiver pronta
    if (document.body) {
      document.body.appendChild(container);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(container);
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
