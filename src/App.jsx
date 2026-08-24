import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { CinematicHero } from './components/hero/CinematicHero';
import { CountdownBanner } from './components/common/CountdownBanner';
import { BrandStatement } from './components/brand/BrandStatement';
import { WhoWeAre } from './components/brand/WhoWeAre';
import { EssentialsOverview } from './components/products/EssentialsOverview';
import { ProductHighlights } from './components/products/ProductHighlights';
import { FindYourEssential } from './components/products/FindYourEssential';
import { CustomerStories } from './components/social-proof/CustomerStories';
import { Guarantee90Day } from './components/trust/Guarantee90Day';
import { PhysicalStore } from './components/store/PhysicalStore';
import { FinalCTA } from './components/cta/FinalCTA';
import { FAQ } from './components/faq/FAQ';
import { Footer } from './components/layout/Footer';
import { ProductPage } from './components/pdp/ProductPage';
import { ProductMarquee } from './components/pdp/ProductMarquee';
import { SalesNotificationPopups } from './components/common/SalesNotificationPopups';
import { BundleColorLab } from './components/lab/BundleColorLab';
import { PDP_DATA } from './config/pdpData';

export function App() {
  const getProductFromLocation = () => {
    // 1. Check query string: ?product=slimsoda
    const params = new URLSearchParams(window.location.search);
    const queryProduct = params.get('product') || params.get('p');
    if (queryProduct && PDP_DATA[queryProduct.toLowerCase()]) {
      return queryProduct.toLowerCase();
    }

    // 2. Check hash: #slimsoda or #/slimsoda
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash && PDP_DATA[hash]) {
      return hash;
    }

    // 3. Check pathname: /slimsoda
    const path = window.location.pathname.toLowerCase().replace(/^\//, '').replace(/\/$/, '');
    if (PDP_DATA[path]) {
      return path;
    }

    return null;
  };

  const isLabFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('lab') === 'true' || window.location.hash === '#lab';
  };

  const [activeProductId, setActiveProductId] = useState(getProductFromLocation);
  const [isLabOpen, setIsLabOpen] = useState(isLabFromUrl);

  useEffect(() => {
    const handlePopState = () => {
      setActiveProductId(getProductFromLocation());
      setIsLabOpen(isLabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openProductPDP = (productId) => {
    setIsLabOpen(false);
    const id = productId.toLowerCase();
    if (PDP_DATA[id]) {
      setActiveProductId(id);
      window.history.pushState(null, '', `/${id}`);
    } else {
      setActiveProductId('slimsoda');
      window.history.pushState(null, '', '/slimsoda');
    }
  };

  const backToHome = () => {
    setIsLabOpen(false);
    setActiveProductId(null);
    window.history.pushState(null, '', '/');
  };

  const handleApplyPalette = (palette) => {
    localStorage.setItem('slimsoda_applied_bundle_palette', JSON.stringify(palette));
    setIsLabOpen(false);
    openProductPDP('slimsoda');
    setTimeout(() => {
      const el = document.getElementById('bundles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  const isProductPage = Boolean(activeProductId && PDP_DATA[activeProductId]);

  return (
    <div className="essencial-good-app" style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      
      {/* Quick Lab Floating Button on Localhost */}
      <button
        onClick={() => setIsLabOpen(true)}
        style={{
          position: 'fixed',
          top: '80px',
          right: '16px',
          zIndex: 99999,
          backgroundColor: '#141210',
          color: '#FFFFFF',
          border: '1.5px solid #D96B32',
          borderRadius: '30px',
          padding: '8px 16px',
          fontSize: '11px',
          fontWeight: 900,
          letterSpacing: '0.08em',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          display: isLabOpen ? 'none' : 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        🔬 LAB DE CORES (KITS)
      </button>

      {/* Render Laboratório de Cores */}
      {isLabOpen ? (
        <BundleColorLab onBackToSite={() => setIsLabOpen(false)} onApplyToSite={handleApplyPalette} />
      ) : (
        <>
          {/* Top Marquee Announcement Banner - Only on Product Pages */}
          {isProductPage && <ProductMarquee />}

          {/* Fixed Luxury Navigation Bar */}
          <Header 
            onNavHome={backToHome} 
            onSelectProduct={openProductPDP} 
            isProductPage={isProductPage}
            activeProductId={activeProductId}
          />

          {isProductPage ? (
            <ProductPage productData={PDP_DATA[activeProductId]} onBackToHome={backToHome} />
          ) : (
            /* Main Home Page Layout */
            <main>
              {/* 01 — HERO CINEMATOGRÁFICO */}
              <CinematicHero onExplore={() => openProductPDP('slimsoda')} />

              {/* FAIXA COM CRONÔMETRO */}
              <CountdownBanner />

              {/* 02 — BRAND STATEMENT */}
              <BrandStatement />

              {/* 03 — WHO WE ARE */}
              <WhoWeAre />

              {/* 04 — MEET THE ESSENTIALS */}
              <EssentialsOverview onSelectProduct={openProductPDP} />

              {/* 05 — PRODUCT HIGHLIGHTS */}
              <ProductHighlights onSelectProduct={openProductPDP} />

              {/* 06 — FIND YOUR ESSENTIAL */}
              <FindYourEssential onSelectProduct={openProductPDP} />

              {/* 07 — CUSTOMER STORIES */}
              <CustomerStories />

              {/* 08 — 90-DAY GUARANTEE */}
              <Guarantee90Day />

              {/* 09 — PHYSICAL STORE */}
              <PhysicalStore />

              {/* 10 — FINAL CTA */}
              <FinalCTA onSelectProduct={openProductPDP} />

              {/* 11 — FAQ */}
              <FAQ />
            </main>
          )}

          {/* 12 — FOOTER */}
          <Footer onNavHome={backToHome} onSelectProduct={openProductPDP} />

          {/* RECENT SALES POPUP TOASTS (WORKS ACROSS HOME AND PRODUCT PAGES) */}
          <SalesNotificationPopups onSelectProduct={openProductPDP} />
        </>
      )}
    </div>
  );
}

export default App;
