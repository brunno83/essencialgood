import React, { createContext, useState, useCallback, useEffect } from 'react';
import { PreCheckoutModal } from '../components/common/PreCheckoutModal';
import { isValidCheckoutUrl } from '../lib/checkoutAllowlist';

export const PreCheckoutContext = createContext({
  isOpen: false,
  targetCheckoutUrl: null,
  metadata: null,
  openPreCheckout: () => {},
  closePreCheckout: () => {},
});

export function PreCheckoutProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    targetCheckoutUrl: null,
    metadata: null,
  });

  const openPreCheckout = useCallback((url, metadata = {}) => {
    if (!isValidCheckoutUrl(url)) {
      console.warn('[PreCheckout] Rejected open attempt: URL is not on the checkout allowlist', url);
      return false;
    }

    setModalState({
      isOpen: true,
      targetCheckoutUrl: url,
      metadata: {
        product: metadata.product || 'slimsoda',
        pageType: metadata.pageType || 'pdp',
        offer: metadata.offer || null,
        pageTitle: metadata.pageTitle || document.title,
      },
    });
    return true;
  }, []);

  const closePreCheckout = useCallback(() => {
    setModalState({
      isOpen: false,
      targetCheckoutUrl: null,
      metadata: null,
    });
  }, []);

  useEffect(() => {
    const handleCaptureClick = (e) => {
      const target = e.target;
      const link = target?.closest ? target.closest('a') : null;
      if (!link) return;

      const rawHref = link.getAttribute('href') || link.href;
      if (isValidCheckoutUrl(rawHref)) {
        e.preventDefault();
        e.stopPropagation();

        const productAttr = link.dataset?.product || link.getAttribute('data-product');
        const pageTypeAttr = link.dataset?.pageType || link.getAttribute('data-page-type');
        const offerAttr = link.dataset?.offer || link.getAttribute('data-offer');

        const path = window.location.pathname.toLowerCase();
        let fallbackProduct = 'slimsoda';
        if (path.includes('sonnus')) fallbackProduct = 'sonnus';
        else if (path.includes('crowned')) fallbackProduct = 'crowned';
        else if (path.includes('linfaflow')) fallbackProduct = 'linfaflow';
        else if (path.includes('memoflow')) fallbackProduct = 'memoflow';

        let fallbackPageType = 'pdp';
        if (path.includes('listicle')) fallbackPageType = 'listicle';
        else if (path.includes('adv')) fallbackPageType = 'adv';
        else if (path.includes('power')) fallbackPageType = 'power';

        openPreCheckout(rawHref, {
          product: productAttr || fallbackProduct,
          pageType: pageTypeAttr || fallbackPageType,
          offer: offerAttr || null,
          pageTitle: document.title,
        });
      }
    };

    document.addEventListener('click', handleCaptureClick, true);
    return () => document.removeEventListener('click', handleCaptureClick, true);
  }, [openPreCheckout]);

  return (
    <PreCheckoutContext.Provider
      value={{
        isOpen: modalState.isOpen,
        targetCheckoutUrl: modalState.targetCheckoutUrl,
        metadata: modalState.metadata,
        openPreCheckout,
        closePreCheckout,
      }}
    >
      {children}
      <PreCheckoutModal
        isOpen={modalState.isOpen}
        targetCheckoutUrl={modalState.targetCheckoutUrl}
        metadata={modalState.metadata}
        onClose={closePreCheckout}
      />
    </PreCheckoutContext.Provider>
  );
}

export default PreCheckoutProvider;
