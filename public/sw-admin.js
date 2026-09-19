/* ============================================================================
   ESSENCIAL GOOD - SERVICE WORKER ADMINISTRATIVO RESTRITO (/admin/)
   ============================================================================ */

const BUILD_VERSION = '__EG_ADMIN_BUILD_VERSION__';
const CACHE_NAME = `eg-admin-${BUILD_VERSION}`;

// Ativos estáticos públicos e neutros da marca e app shell (SEM DADOS PRIVADOS/PII)
const PRECACHE_ASSETS = [
  '/manifest-admin.webmanifest',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/icon-512x512-maskable.png',
  '/assets/icons/apple-touch-icon-180x180.png',
  '/assets/icons/favicon-32x32.png',
  '/assets/Brand/essencial-good-logo.png',
  '/assets/Brand/essencial-good-symbol.png'
];

// Instalação: adiciona ativos estáticos neutros ao cache da versão atual
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Ativação: remoção rigorosa de caches de versões anteriores e requisição de controle dos clientes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('eg-admin-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Mensagem para transição de versão ("Atualizar agora") sem skipWaiting automático durante uso
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ============================================================================
   MANIPULADORES DE NOTIFICAÇÃO WEB PUSH E BADGES
   ============================================================================ */

// Evento Push: Recebe o payload genérico e exibe a notificação nativa
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const eventType = payload.type;

    // Permitir apenas tipos estritamente mapeados na arquitetura
    if (eventType !== 'new_conversation' && eventType !== 'new_checkout_lead') {
      console.warn('[SW Push] Tipo de evento não reconhecido:', eventType);
      return;
    }

    // Mapeamento interno estrito de rota (bloqueia URLs externas ou arbitrárias)
    const targetUrl = eventType === 'new_conversation'
      ? '/admin/conversations'
      : '/admin/leads';

    const title = payload.title || 'Essencial Admin';
    const options = {
      body: payload.body || 'Nova notificação do painel.',
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/favicon-32x32.png',
      tag: payload.tag || `eg-admin-${eventType}`,
      renotify: true,
      data: {
        url: targetUrl,
        type: eventType,
      },
    };

    // Badging API com fallback seguro
    if ('setAppBadge' in navigator && typeof navigator.setAppBadge === 'function') {
      navigator.setAppBadge(1).catch(() => {});
    }

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.warn('[SW Push] Erro ao processar payload do push:', err);
  }
});

// Evento NotificationClick: Foca janela existente ou abre nova rota administrativa
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Limpa o badge do ícone ao abrir a notificação
  if ('clearAppBadge' in navigator && typeof navigator.clearAppBadge === 'function') {
    navigator.clearAppBadge().catch(() => {});
  }

  const rawUrl = event.notification.data?.url || '/admin/';
  // Restrição rigorosa: aceita apenas rotas administrativas permitidas
  const allowedRoutes = ['/admin/conversations', '/admin/leads', '/admin/'];
  const targetUrl = allowedRoutes.includes(rawUrl) ? rawUrl : '/admin/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        if (clientUrl.pathname.startsWith('/admin') && 'focus' in client) {
          if ('navigate' in client && typeof client.navigate === 'function') {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Estratégia de Intercepção de Rede Segura e Estruturada
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. REGRAS ESTRITAS DE REJEIÇÃO / NETWORK-ONLY (SEM CACHE)
  // a) Supabase e APIs (REST, RPC, Auth, Realtime) -> NUNCA CACHEAR
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.includes('/rest/v1/') ||
    url.pathname.includes('/rpc/') ||
    url.pathname.includes('/auth/v1/')
  ) {
    return;
  }

  // b) Métodos diferentes de GET (POST, PUT, DELETE, PATCH) -> NUNCA CACHEAR
  if (req.method !== 'GET') {
    return;
  }

  // c) URLs contendo parâmetros sensíveis de autenticação ou tokens -> NUNCA CACHEAR
  if (
    url.searchParams.has('token') ||
    url.searchParams.has('access_token') ||
    url.searchParams.has('apikey') ||
    url.searchParams.has('auth')
  ) {
    return;
  }

  // d) URLs de checkout comercial, afiliados ou pixels -> NUNCA CACHEAR
  if (
    url.pathname.includes('checkout.php') ||
    url.hostname.includes('facebook') ||
    url.hostname.includes('utm')
  ) {
    return;
  }

  // e) Rotas fora do escopo /admin/ e /assets/ -> NUNCA CACHEAR (by-pass do SW)
  const isAdminPath = url.pathname.startsWith('/admin');
  const isAssetPath = url.pathname.startsWith('/assets/');
  const isManifest = url.pathname === '/manifest-admin.webmanifest';

  if (!isAdminPath && !isAssetPath && !isManifest) {
    return;
  }

  // 2. NAVEGAÇÃO DE PÁGINAS ADMINISTRATIVAS (/admin/...) -> ESTRATÉGIA NETWORK-FIRST
  // Garante que o index.html atualizado seja sempre buscado na rede primeiro.
  if (req.mode === 'navigate' && isAdminPath) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/admin/index.html', copy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Se a rede falhar (offline), serve exclusivamente o app shell neutro estático
          return caches.match('/admin/index.html').then((cachedShell) => {
            return (
              cachedShell ||
              caches.match('/index.html') ||
              new Response('Offline', { status: 503, statusText: 'Offline' })
            );
          });
        })
    );
    return;
  }

  // 3. RECURSOS JS / CSS COM HASH (/assets/*.js, /assets/*.css) -> ESTRATÉGIA CACHE-FIRST
  // Bundles com hash de build mudam de URL a cada compilação, sendo seguros para cache-first.
  if (isAssetPath && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))) {
    event.respondWith(
      caches.match(req).then((cachedFile) => {
        if (cachedFile) return cachedFile;

        return fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 4. ÍCONES E RECURSOS DA MARCA (STALE-WHILE-REVALIDATE)
  if (isAssetPath || isManifest) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 5. FONTES EXTERNAS (GOOGLE FONTS) -> STALE-WHILE-REVALIDATE SEGURO
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(req).then((cachedFont) => {
        const fetchFont = fetch(req)
          .then((networkFont) => {
            if (networkFont && networkFont.status === 200) {
              const copy = networkFont.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            }
            return networkFont;
          })
          .catch(() => cachedFont);

        return cachedFont || fetchFont;
      })
    );
  }
});
