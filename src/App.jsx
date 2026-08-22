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
import { PDP_DATA } from './config/pdpData';

export function App() {
  const [activeProductId, setActiveProductId] = useState(() => {
    const path = window.location.pathname.toLowerCase().replace(/^\//, '');
    if (PDP_DATA[path]) return path;
    return null;
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/^\//, '');
      if (PDP_DATA[path]) {
        setActiveProductId(path);
      } else {
        setActiveProductId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openProductPDP = (productId) => {
    const id = productId.toLowerCase();
    if (PDP_DATA[id]) {
      setActiveProductId(id);
      window.history.pushState(null, '', `/${id}`);
    } else {
      // Fallback
      setActiveProductId('slimsoda');
      window.history.pushState(null, '', '/slimsoda');
    }
  };

  const backToHome = () => {
    setActiveProductId(null);
    window.history.pushState(null, '', '/');
  };

  return (
    <div className="essencial-good-app" style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Fixed Luxury Navigation Bar */}
      <Header onNavHome={backToHome} onSelectProduct={openProductPDP} />

      {activeProductId && PDP_DATA[activeProductId] ? (
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
    </div>
  );
}

export default App;
