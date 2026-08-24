import React, { useEffect } from 'react';
import { ProductGallery } from './ProductGallery';
import { InlineBundleSelector } from './InlineBundleSelector';
import { BundleSelector } from './BundleSelector';
import { TrustStrip } from './TrustStrip';
import { RealTransformations } from './RealTransformations';
import { ProductBenefits } from './ProductBenefits';
import { HowItWorks } from './HowItWorks';
import { IngredientsSection } from './IngredientsSection';
import { StatsCounterSection } from './StatsCounterSection';
import { ComparisonTable } from './ComparisonTable';
import { CustomerReviews } from './CustomerReviews';
import { GuaranteeSection } from './GuaranteeSection';
import { ProductFAQ } from './ProductFAQ';
import { LiveViewerCounter } from '../common/LiveViewerCounter';

export function ProductPage({ productData, onBackToHome }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productData]);

  if (!productData) return null;

  const {
    brand,
    title,
    subtitle,
    rating,
    reviewCount,
    accentColor,
    usps,
    gallery,
    bundlesSection,
    trustStrip,
    benefitsSection,
    howItWorks,
    ingredientsSection,
    comparisonSection,
    reviewsSection,
    guaranteeSection,
    faqSection,
    disclaimer
  } = productData;

  return (
    <div className="product-page" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '125px' }}>
      {/* Breadcrumb / Back button */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 10px 20px' }}>
        <button
          onClick={onBackToHome}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: 0
          }}
        >
          ← Back to All Products
        </button>
      </div>

      {/* 01 — HERO SECTION & HERO BUNDLE SELECTOR */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 20px 60px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* Gallery Column */}
          <ProductGallery gallery={gallery} accentColor={accentColor} />

          {/* Product Summary Column + Radio Bundle Selector */}
          <div>
            <span 
              style={{ 
                fontSize: '12px', 
                fontWeight: 900, 
                letterSpacing: '0.14em', 
                color: accentColor || '#D96B32', 
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px'
              }}
            >
              {brand}
            </span>

            <h1 
              style={{ 
                fontSize: 'clamp(26px, 4vw, 36px)', 
                fontWeight: 900, 
                color: '#141210', 
                lineHeight: 1.15, 
                margin: '0 0 10px',
                letterSpacing: '-0.02em'
              }}
            >
              {title}
            </h1>

            <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.55, margin: '0 0 14px', fontWeight: 500 }}>
              {subtitle}
            </p>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ color: '#F5A623', fontSize: '15px' }}>★★★★★</span>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#141210' }}>{rating}/5</span>
              <span style={{ fontSize: '13.5px', color: '#777', fontWeight: 500 }}>({reviewCount} Customer Reviews)</span>
            </div>

            {/* Bullet USPs */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0' }}>
              {usps.map((usp, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#333', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ color: '#27AE60', fontWeight: 800 }}>✓</span> {usp}
                </li>
              ))}
            </ul>

            {/* Live Viewer Counter Widget */}
            <LiveViewerCounter accentColor={accentColor} />

            {/* Radio Bundle Selector right inside Hero */}
            <InlineBundleSelector bundles={bundlesSection.bundles} accentColor={accentColor} />
          </div>
        </div>
      </section>

      {/* 02 — TRUST & QUALITY STRIP */}
      <TrustStrip trustStrip={trustStrip} accentColor={accentColor} />

      {/* 03 — ANTES E DEPOIS (MANTIDO NO TOPO PARA IMPACTO VISUAL IMEDIATO) */}
      <RealTransformations accentColor={accentColor} />

      {/* 04 — BENEFÍCIOS PRINCIPAIS */}
      <ProductBenefits benefitsSection={benefitsSection} accentColor={accentColor} />

      {/* 05 — INGREDIENTES E FÓRMULA */}
      <IngredientsSection ingredientsSection={ingredientsSection} accentColor={accentColor} />

      {/* 06 — STATS COUNTER STRIP (PROVEN BY ROUTINES, BACKED BY RESULTS) */}
      <StatsCounterSection accentColor={accentColor} />

      {/* 07 — COMO FUNCIONA / MODO DE USO */}
      <HowItWorks howItWorks={howItWorks} accentColor={accentColor} />

      {/* 08 — TABELA COMPARATIVA (QUEBRA DE PADRÃO EM VERDE FLORESTA LUXO #1B2613) */}
      <ComparisonTable comparisonSection={comparisonSection} accentColor={accentColor} />

      {/* 09 — OS 3 BLOCOS DOS VALORES / KITS DE OFERTA (FUNDO VERDE FLORESTA LUXO #1B2613 SEM LINHA DIVISÓRIA) */}
      <section 
        id="bundles-section" 
        style={{ 
          backgroundColor: '#1B2613', 
          padding: '40px 20px 60px 20px', 
          borderTop: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <BundleSelector bundlesSection={bundlesSection} accentColor={accentColor} />
        </div>
      </section>

      {/* 10 — SELO & GARANTIA DE 90 DIAS (LOGO APÓS VER OS PREÇOS) */}
      <GuaranteeSection guaranteeSection={guaranteeSection} accentColor={accentColor} />

      {/* 11 — AVALIAÇÕES & DEPOIMENTOS DE CLIENTES */}
      <CustomerReviews reviewsSection={reviewsSection} accentColor={accentColor} />

      {/* 12 — FAQ (PERGUNTAS FREQUENTES ANTES DO RODAPÉ) */}
      <ProductFAQ faqSection={faqSection} accentColor={accentColor} />

      {/* 13 — DISCLAIMER */}
      {disclaimer && (
        <section style={{ backgroundColor: '#FAF7F2', padding: '30px 20px 60px 20px', borderTop: '1px solid #EFEAE1' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', fontSize: '11px', color: '#888', lineHeight: 1.6, textAlign: 'center' }}>
            {disclaimer}
          </div>
        </section>
      )}
    </div>
  );
}
