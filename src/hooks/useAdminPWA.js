import { useState, useEffect, useCallback } from 'react';

export function useAdminPWA() {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // 1. Checagem estrita de ambiente administrativo (/admin)
    const pathname = window.location.pathname.toLowerCase();
    const isAdminRoute = pathname.startsWith('/admin');

    if (!isAdminRoute) {
      return;
    }

    // 2. Checagem do modo Standalone
    const standaloneMatch = window.matchMedia('(display-mode: standalone)').matches;
    const navigatorStandalone = window.navigator.standalone === true;
    const isInStandalone = standaloneMatch || navigatorStandalone;
    setIsStandalone(isInStandalone);

    // 3. Detecção de dispositivo iOS (Safari)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // 4. Listeners de Estado Online/Offline
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 5. Registro do Service Worker Administrativo com escopo estrito /admin/
    let swRegistration = null;
    let controllerChangeHandler = null;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw-admin.js', { scope: '/admin/' })
        .then((reg) => {
          swRegistration = reg;

          // Se já houver um worker aguardando ativamente
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setHasUpdate(true);
          }

          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(installingWorker);
                setHasUpdate(true);
              }
            };
          };
        })
        .catch((err) => {
          console.warn('[PWA Admin] Falha ao registrar Service Worker:', err);
        });

      // Recarrega apenas após o administrador clicar em "Atualizar agora" e a transição ocorrer
      let refreshing = false;
      controllerChangeHandler = () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      };

      navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);
    }

    // 6. Captura do Evento beforeinstallprompt e appinstalled (Android / Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      if (!isInStandalone) {
        setDeferredPrompt(e);
        setCanInstall(true);
      }
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 7. Cleanup rigoroso de todos os event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);

      if ('serviceWorker' in navigator && controllerChangeHandler) {
        navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
      }

      if (swRegistration) {
        swRegistration.onupdatefound = null;
      }
    };
  }, []);

  // Ação de disparo do prompt de instalação nativo (Android / Chrome)
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setCanInstall(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.warn('[PWA Admin] Erro ao disparar prompt de instalação:', err);
    }
  }, [deferredPrompt]);

  // Ação de aplicação manual de atualização ("Atualizar agora")
  const applyUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [waitingWorker]);

  return {
    canInstall,
    isIOS,
    isStandalone,
    hasUpdate,
    isOffline,
    installPWA,
    applyUpdate,
  };
}

export default useAdminPWA;
