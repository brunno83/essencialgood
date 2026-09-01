import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { CinematicHero } from './components/home/CinematicHero';
import { CountdownBanner } from './components/common/CountdownBanner';
import { BrandStatement } from './components/home/BrandStatement';
import { WhoWeAre } from './components/home/WhoWeAre';
import { EssentialsOverview } from './components/home/EssentialsOverview';
import { ProductHighlights } from './components/home/ProductHighlights';
import { FindYourEssential } from './components/home/FindYourEssential';
import { CustomerStories } from './components/home/CustomerStories';
import { Guarantee90Day } from './components/home/Guarantee90Day';
import { PhysicalStore } from './components/home/PhysicalStore';
import { FinalCTA } from './components/home/FinalCTA';
import { FAQ } from './components/home/FAQ';
import { Footer } from './components/layout/Footer';
import { ProductPage } from './components/pdp/ProductPage';
import { ProductMarquee } from './components/pdp/ProductMarquee';
import { SalesNotificationPopups } from './components/common/SalesNotificationPopups';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SlimSodaListicle } from './components/listicle/slimsoda/SlimSodaListicle';
import { LinfaflowListicle } from './components/listicle/linfaflow/linfaflowListicle';
import { SonnusListicle } from './components/listicle/sonnus/SonnusListicle';
import { PDP_DATA } from './config/pdpData';

export function App() {
  const getProductFromLocation = () => {
    // 0. Check Listicle routes in pathname
    const rawPathname = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (rawPathname.includes('listicle/slimsoda') || rawPathname.includes('listicle-slimsoda')) {
      return 'listicle-slimsoda';
    }
    if (rawPathname.includes('listicle/linfaflow') || rawPathname.includes('listicle-linfaflow')) {
      return 'listicle-linfaflow';
    }
    if (rawPathname.includes('listicle/sonnus') || rawPathname.includes('listicle-sonnus')) {
      return 'listicle-sonnus';
    }

    // 1. Check query string: ?product=slimsoda or ?listicle=slimsoda / ?listicle=linfaflow / ?listicle=sonnus
    const params = new URLSearchParams(window.location.search);
    const rawQuery = (params.get('product') || params.get('p') || params.get('listicle') || '').trim().toLowerCase();
    if (rawQuery) {
      if (rawQuery.includes('slimsoda') && (params.get('listicle') || rawQuery.includes('listicle'))) {
        return 'listicle-slimsoda';
      }
      if (rawQuery.includes('linfaflow') && (params.get('listicle') || rawQuery.includes('listicle'))) {
        return 'listicle-linfaflow';
      }
      if (rawQuery.includes('sonnus') && (params.get('listicle') || rawQuery.includes('listicle'))) {
        return 'listicle-sonnus';
      }
      const cleanQuery = rawQuery.replace(/\/$/, '').split('/')[0];
      if (PDP_DATA[cleanQuery]) {
        return cleanQuery;
      }
    }

    // 2. Check hash: #slimsoda or #/slimsoda or #listicle/slimsoda or #listicle/linfaflow or #listicle/sonnus
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (rawHash) {
      if (rawHash.includes('listicle/slimsoda') || rawHash.includes('listicle-slimsoda')) {
        return 'listicle-slimsoda';
      }
      if (rawHash.includes('listicle/linfaflow') || rawHash.includes('listicle-linfaflow')) {
        return 'listicle-linfaflow';
      }
      if (rawHash.includes('listicle/sonnus') || rawHash.includes('listicle-sonnus')) {
        return 'listicle-sonnus';
      }
      const cleanHash = rawHash.trim().split('/')[0];
      if (PDP_DATA[cleanHash]) {
        return cleanHash;
      }
    }

    // 3. Check pathname: /crowned or /crowned/index.html or /adv-crowned
    const rawPath = window.location.pathname.replace(/^\//, '');
    if (rawPath) {
      const parts = rawPath.trim().toLowerCase().replace(/\/$/, '').split('/');
      const cleanPath = parts[0];
      if (cleanPath === 'listicle') {
        if (parts[1] === 'slimsoda') return 'listicle-slimsoda';
        if (parts[1] === 'linfaflow') return 'listicle-linfaflow';
        if (parts[1] === 'sonnus') return 'listicle-sonnus';
      }
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
    const id = (productId || '').trim().toLowerCase().replace(/\/$/, '');
    if (id === 'listicle-slimsoda' || id === 'listicle/slimsoda') {
      setActiveProductId('listicle-slimsoda');
      window.history.pushState(null, '', '/listicle/slimsoda');
      return;
    }
    if (id === 'listicle-linfaflow' || id === 'listicle/linfaflow') {
      setActiveProductId('listicle-linfaflow');
      window.history.pushState(null, '', '/listicle/linfaflow');
      return;
    }
    if (id === 'listicle-sonnus' || id === 'listicle/sonnus') {
      setActiveProductId('listicle-sonnus');
      window.history.pushState(null, '', '/listicle/sonnus');
      return;
    }
    const cleanId = id.split('/')[0];
    if (PDP_DATA[cleanId]) {
      setActiveProductId(cleanId);
      window.history.pushState(null, '', `/${cleanId}`);
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
  const activeDisclaimer = isProductPage 
    ? PDP_DATA[activeProductId]?.disclaimer 
    : activeProductId === 'listicle-slimsoda' 
      ? PDP_DATA.slimsoda?.disclaimer 
      : activeProductId === 'listicle-linfaflow'
        ? PDP_DATA.linfaflow?.disclaimer
        : activeProductId === 'listicle-sonnus'
          ? PDP_DATA.sonnus?.disclaimer
          : null;

  return (
    <div className="essencial-good-app" style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Top Marquee Announcement Banner - Only on Product Pages */}
      {isProductPage && <ProductMarquee accentColor={PDP_DATA[activeProductId]?.accentColor} />}

      {/* Fixed Luxury Navigation Bar (hidden on listicle pages which render dedicated editorial header) */}
      {!activeProductId?.startsWith('listicle') && (
        <Header 
          onNavHome={backToHome} 
          onSelectProduct={openProductPDP} 
          isProductPage={isProductPage}
          activeProductId={activeProductId}
        />
      )}

      {activeProductId === 'listicle-slimsoda' ? (
        <ErrorBoundary>
          <SlimSodaListicle onSelectProduct={openProductPDP} onNavHome={backToHome} />
        </ErrorBoundary>
      ) : activeProductId === 'listicle-linfaflow' ? (
        <ErrorBoundary>
          <LinfaflowListicle onSelectProduct={openProductPDP} onNavHome={backToHome} />
        </ErrorBoundary>
      ) : activeProductId === 'listicle-sonnus' ? (
        <ErrorBoundary>
          <SonnusListicle onSelectProduct={openProductPDP} onNavHome={backToHome} />
        </ErrorBoundary>
      ) : isProductPage ? (
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
