import React, { useEffect } from 'react';
import { ProductGallery } from './ProductGallery';
import { InlineBundleSelector } from './InlineBundleSelector';
import { BundleSelector } from './BundleSelector';
import { TrustStrip } from './TrustStrip';
import { WhySlimSodaBlock } from './slimsoda/WhySlimSodaBlock';
import { SlimSodaFourPillars } from './slimsoda/SlimSodaFourPillars';
import { SlimSodaTargetDeepDives } from './slimsoda/SlimSodaTargetDeepDives';
import { SlimSodaIngredients } from './slimsoda/SlimSodaIngredients';
import { SlimSodaRoutine } from './slimsoda/SlimSodaRoutine';
import { SlimSodaComparison } from './slimsoda/SlimSodaComparison';
import { SlimSodaIsAndIsnt } from './slimsoda/SlimSodaIsAndIsnt';
import { RealTransformations } from './RealTransformations';
import { VideoReviewsSection } from './VideoReviewsSection';
import { ProductBenefits } from './ProductBenefits';
import { IngredientsSection } from './IngredientsSection';
import { WhyPeopleChooseSection } from './WhyPeopleChooseSection';
import { HowItWorks } from './HowItWorks';
import { ComparisonTable } from './ComparisonTable';
import { GuaranteeSection } from './GuaranteeSection';
import { CustomerReviews } from './CustomerReviews';
import { ProductFAQ } from './ProductFAQ';
import { FinalCTABlock } from './FinalCTABlock';
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
    usps = [],
    gallery = [],
    bundlesSection,
    trustStrip,
    whyBlock,
    fourPillars,
    whyChoose,
    benefitsSection,
    howItWorks,
    ingredientsSection,
    comparisonSection,
    reviewsSection,
    guaranteeSection,
    faqSection,
    finalOffer
  } = productData || {};

  const isSlimSoda = String(productData?.id || '').toLowerCase() === 'slimsoda';

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

      {/* HERO SECTION & HERO BUNDLE SELECTOR */}
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
              {(usps || []).map((usp, idx) => (
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

      {/* TRUST / CREDIBILITY BAR */}
      <TrustStrip trustStrip={trustStrip} accentColor={accentColor} />

      {isSlimSoda ? (
        <>
          {/* 02 — WHAT DOES SLIMSODA ACTUALLY DO? */}
          <SlimSodaFourPillars data={fourPillars} accentColor={accentColor} />

          {/* 03-07 — TARGET DEEP DIVES (Fat Burning, Metabolism, Appetite, Digestion, Why 4 Targets) */}
          <SlimSodaTargetDeepDives accentColor={accentColor} />

          {/* 08 — WHAT'S INSIDE? (Detailed Ingredients) */}
          <SlimSodaIngredients accentColor={accentColor} />

          {/* 09 — HOW SLIMSODA FITS INTO YOUR DAY */}
          <SlimSodaRoutine accentColor={accentColor} />

          {/* 10 — SLIMSODA VS BASIC DIET-ONLY */}
          <SlimSodaComparison accentColor={accentColor} />

          {/* 11 — WHAT IT IS AND ISN'T */}
          <SlimSodaIsAndIsnt accentColor={accentColor} />

          {/* 01 — FIRST OFFER BUNDLE SELECTOR (PDF Page 25: "Este bloco da oferta pode manter ele aqui e depois continuamos com a lp 12 — REAL CUSTOMERS") */}
          <section 
            id="first-bundles-section" 
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

          {/* 12 — REAL CUSTOMERS */}
          <RealTransformations productName={brand} productId={productData?.id} accentColor={accentColor} />
          <CustomerReviews reviewsSection={reviewsSection} accentColor={accentColor} />

          {/* 13 — 90-DAY GUARANTEE */}
          <GuaranteeSection guaranteeSection={guaranteeSection} accentColor={accentColor} />

          {/* 14 — FAQ */}
          <ProductFAQ faqSection={faqSection} accentColor={accentColor} />

          {/* 15 — FINAL CLOSE & SECOND OFFER BUNDLE SELECTOR (PDF Page 30: "15 — FINAL CLOSE... repetir o bloco oferta novamente") */}
          <FinalCTABlock finalOffer={finalOffer} brand={brand} accentColor={accentColor} />
          <section 
            id="bundles-section" 
            style={{ 
              backgroundColor: '#1B2613', 
              padding: '0 20px 60px 20px', 
              borderTop: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <BundleSelector bundlesSection={bundlesSection} accentColor={accentColor} />
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Default layout for non-SlimSoda products */}
          <WhySlimSodaBlock whyBlock={whyBlock} accentColor={accentColor} />
          <RealTransformations productName={brand} productId={productData?.id} accentColor={accentColor} />
          <VideoReviewsSection productName={brand} accentColor={accentColor} />
          <ProductBenefits benefitsSection={benefitsSection} accentColor={accentColor} />
          <IngredientsSection ingredientsSection={ingredientsSection} accentColor={accentColor} />
          <WhyPeopleChooseSection whyChoose={whyChoose} accentColor={accentColor} />
          <HowItWorks howItWorks={howItWorks} accentColor={accentColor} />
          <ComparisonTable comparisonSection={comparisonSection} accentColor={accentColor} />
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
          <GuaranteeSection guaranteeSection={guaranteeSection} accentColor={accentColor} />
          <CustomerReviews reviewsSection={reviewsSection} accentColor={accentColor} />
          <ProductFAQ faqSection={faqSection} accentColor={accentColor} />
          <FinalCTABlock finalOffer={finalOffer} brand={brand} accentColor={accentColor} />
        </>
      )}
    </div>
  );
}
