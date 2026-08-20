import React from 'react';
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

export function App() {
  return (
    <div className="essencial-good-app" style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Fixed Luxury Navigation Bar */}
      <Header />

      {/* Main Page Layout */}
      <main>
        {/* 01 — HERO CINEMATOGRÁFICO */}
        <CinematicHero />

        {/* FAIXA COM CRONÔMETRO — LOGO ABAIXO DO HERO */}
        <CountdownBanner />

        {/* 02 — BRAND STATEMENT */}
        <BrandStatement />

        {/* 03 — WHO WE ARE */}
        <WhoWeAre />

        {/* 04 — MEET THE ESSENTIALS */}
        <EssentialsOverview />

        {/* 05 — PRODUCT HIGHLIGHTS */}
        <ProductHighlights />

        {/* 06 — FIND YOUR ESSENTIAL */}
        <FindYourEssential />

        {/* 07 — CUSTOMER STORIES */}
        <CustomerStories />

        {/* 08 — 90-DAY GUARANTEE */}
        <Guarantee90Day />

        {/* 09 — PHYSICAL STORE */}
        <PhysicalStore />

        {/* 10 — FINAL CTA (Coleção Completa & Chamada Final) */}
        <FinalCTA />

        {/* 11 — FAQ (Perguntas Frequentes antes do Footer) */}
        <FAQ />
      </main>

      {/* 12 — FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
