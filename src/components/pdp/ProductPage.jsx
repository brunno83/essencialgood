import React, { useEffect } from 'react';
import { ProductGallery } from './ProductGallery';
import { InlineBundleSelector } from './InlineBundleSelector';
import { BundleSelector } from './BundleSelector';
import { TrustStrip } from './TrustStrip';
import { RealTransformations } from './RealTransformations';
import { ProductBenefits } from './ProductBenefits';
import { HowItWorks } from './HowItWorks';
import { IngredientsSection } from './IngredientsSection';
import { ComparisonTable } from './ComparisonTable';
import { CustomerReviews } from './CustomerReviews';
import { GuaranteeSection } from './GuaranteeSection';
import { ProductFAQ } from './ProductFAQ';
import { StickyMobileCTA } from './StickyMobileCTA';

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
    finalOffer,
    disclaimer
  } = productData;

  return (
    <div className="product-page" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Breadcrumb / Back button */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 0 20px' }}>
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

      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 20px 60px 20px' }}>
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
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
              {usps.map((usp, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#333', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ color: '#27AE60', fontWeight: 800 }}>✓</span> {usp}
                </li>
              ))}
            </ul>

            {/* Radio Bundle Selector right inside Hero */}
            <InlineBundleSelector bundles={bundlesSection.bundles} accentColor={accentColor} />
          </div>
        </div>
      </section>

      {/* Trust & Quality Strip */}
      <TrustStrip trustStrip={trustStrip} accentColor={accentColor} />

      {/* REAL TRANSFORMATIONS CAROUSEL (BEFORE & AFTER) */}
      <RealTransformations accentColor={accentColor} />

      {/* Benefits */}
      <ProductBenefits benefitsSection={benefitsSection} accentColor={accentColor} />

      {/* How It Works */}
      <HowItWorks howItWorks={howItWorks} accentColor={accentColor} />

      {/* Ingredients */}
      <IngredientsSection ingredientsSection={ingredientsSection} accentColor={accentColor} />

      {/* Comparison Table */}
      <ComparisonTable comparisonSection={comparisonSection} accentColor={accentColor} />

      {/* Reviews */}
      <CustomerReviews reviewsSection={reviewsSection} accentColor={accentColor} />

      {/* 90-Day Guarantee */}
      <GuaranteeSection guaranteeSection={guaranteeSection} accentColor={accentColor} />

      {/* FAQ */}
      <ProductFAQ faqSection={faqSection} accentColor={accentColor} />

      {/* Final Offer (Re-render Bundles Grid) */}
      <section style={{ backgroundColor: '#FAF7F2', padding: '60px 20px 40px 20px', borderTop: '1px solid #EFEAE1' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '24px' }}>
          {finalOffer && (
            <>
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', color: accentColor || '#D96B32', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                {finalOffer.tag}
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#141210', margin: '0 0 8px' }}>
                {finalOffer.title}
              </h2>
              <p style={{ fontSize: '15px', color: '#666', fontWeight: 500 }}>
                {finalOffer.subtitle}
              </p>
            </>
          )}
        </div>
        <BundleSelector bundlesSection={bundlesSection} accentColor={accentColor} />
      </section>

      {/* Disclaimer */}
      {disclaimer && (
        <section style={{ backgroundColor: '#FAF7F2', padding: '0 20px 60px 20px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', fontSize: '11px', color: '#888', lineHeight: 1.6, textAlign: 'center' }}>
            {disclaimer}
          </div>
        </section>
      )}

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA product={productData} accentColor={accentColor} />
    </div>
  );
}
