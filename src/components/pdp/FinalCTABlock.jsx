import React from 'react';

export function FinalCTABlock({ accentColor }) {
  const brandGreen = accentColor || '#27AE60';

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
          MAKE WELLNESS EASIER TO KEEP UP WITH.
        </h2>

        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: 500, margin: '0 0 20px 0', lineHeight: 1.5 }}>
          Selected ingredients. One powdered formula. One simple daily routine.
        </p>

        <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.14em', color: brandGreen, marginBottom: '24px' }}>
          MIX. SIP. KEEP MOVING.
        </div>

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
            boxShadow: '0 10px 28px rgba(39, 174, 96, 0.4)',
            transition: 'transform 0.2s ease',
            marginBottom: '16px'
          }}
        >
          CHOOSE MY SLIMSODA BUNDLE →
        </button>

        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 700, letterSpacing: '0.04em' }}>
          90-Day Money-Back Guarantee • Free U.S. Shipping • Secure Checkout
        </div>
      </div>
    </section>
  );
}
