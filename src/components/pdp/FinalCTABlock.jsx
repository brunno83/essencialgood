import React from 'react';

export function FinalCTABlock({ finalOffer, brand = 'SLIMSODA', accentColor }) {
  const brandGreen = accentColor || '#27AE60';

  const defaultOffer = {
    tag: 'READY TO GET STARTED?',
    title: 'MAKE WELLNESS EASIER TO KEEP UP WITH.',
    subtitle: 'Selected ingredients. One formula. One simple daily routine.',
    ctaText: `CHOOSE MY ${brand.toUpperCase()} BUNDLE →`
  };

  const data = finalOffer || defaultOffer;

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      style={{ 
        backgroundColor: '#1B2613', 
        color: '#FFFFFF', 
        padding: '70px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <span 
          style={{ 
            fontSize: '12px', 
            fontWeight: 900, 
            letterSpacing: '0.16em', 
            color: brandGreen,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '10px'
          }}
        >
          {data.tag}
        </span>

        <h2 
          style={{ 
            fontSize: 'clamp(24px, 4vw, 36px)', 
            fontWeight: 900, 
            color: '#FFFFFF', 
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          {data.title}
        </h2>

        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: 500, margin: '0 0 24px 0', lineHeight: 1.5 }}>
          {data.subtitle}
        </p>

        <button
          onClick={scrollToBundles}
          style={{
            backgroundColor: brandGreen,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '18px 40px',
            fontSize: '15px',
            fontWeight: 900,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: `0 10px 28px ${brandGreen}66`,
            transition: 'transform 0.2s ease',
            marginBottom: '16px'
          }}
        >
          {data.ctaText || `CHOOSE MY ${brand.toUpperCase()} BUNDLE →`}
        </button>

        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 700, letterSpacing: '0.04em' }}>
          90-Day Money-Back Guarantee • Free U.S. Shipping • Secure Checkout
        </div>
      </div>
    </section>
  );
}
