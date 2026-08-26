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
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PDP_DATA } from './config/pdpData';

export function App() {
  const getProductFromLocation = () => {
    // 1. Check query string: ?product=slimsoda
    const params = new URLSearchParams(window.location.search);
    const rawQuery = params.get('product') || params.get('p');
    if (rawQuery) {
      const cleanQuery = rawQuery.trim().toLowerCase().replace(/\/$/, '').split('/')[0];
      if (PDP_DATA[cleanQuery]) {
        return cleanQuery;
      }
    }

    // 2. Check hash: #slimsoda or #/slimsoda
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    if (rawHash) {
      const cleanHash = rawHash.trim().toLowerCase().replace(/\/$/, '').split('/')[0];
      if (PDP_DATA[cleanHash]) {
        return cleanHash;
      }
    }

    // 3. Check pathname: /crowned or /crowned/index.html or /adv-crowned
    const rawPath = window.location.pathname.replace(/^\//, '');
    if (rawPath) {
      const parts = rawPath.trim().toLowerCase().replace(/\/$/, '').split('/');
      const cleanPath = parts[0];
      if (PDP_DATA[cleanPath]) {
        return cleanPath;
      }
      if (cleanPath === 'adv-crowned') {
        return 'crowned';
      }
    }

    return null;
  };

  const [activeProductId, setActiveProductId] = useState(getProductFromLocation);

  useEffect(() => {
    const handlePopState = () => {
      setActiveProductId(getProductFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openProductPDP = (productId) => {
    const id = (productId || '').trim().toLowerCase().replace(/\/$/, '').split('/')[0];
    if (PDP_DATA[id]) {
      setActiveProductId(id);
      window.history.pushState(null, '', `/${id}`);
    } else {
      setActiveProductId('slimsoda');
      window.history.pushState(null, '', '/slimsoda');
    }
  };

  const backToHome = () => {
    setActiveProductId(null);
    window.history.pushState(null, '', '/');
  };

  const isProductPage = Boolean(activeProductId && PDP_DATA[activeProductId]);
  const activeDisclaimer = isProductPage ? PDP_DATA[activeProductId]?.disclaimer : null;

  return (
    <div className="essencial-good-app" style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Top Marquee Announcement Banner - Only on Product Pages */}
      {isProductPage && <ProductMarquee accentColor={PDP_DATA[activeProductId]?.accentColor} />}

      {/* Fixed Luxury Navigation Bar */}
      <Header 
        onNavHome={backToHome} 
        onSelectProduct={openProductPDP} 
        isProductPage={isProductPage}
        activeProductId={activeProductId}
      />

      {isProductPage ? (
        <ErrorBoundary>
          <ProductPage productData={PDP_DATA[activeProductId]} onBackToHome={backToHome} />
        </ErrorBoundary>
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

      {/* 12 — FOOTER WITH ABSOLUTE BOTTOM DISCLAIMER */}
      <Footer onNavHome={backToHome} onSelectProduct={openProductPDP} disclaimer={activeDisclaimer} />

      {/* RECENT SALES POPUP TOASTS (WORKS ACROSS HOME AND PRODUCT PAGES) */}
      <SalesNotificationPopups onSelectProduct={openProductPDP} />
    </div>
  );
}

export default App;
