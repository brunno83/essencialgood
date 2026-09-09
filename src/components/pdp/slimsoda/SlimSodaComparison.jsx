import React from 'react';

export function SlimSodaComparison({ accentColor }) {
  const brandGreen = accentColor || '#27AE60';

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const rows = [
    { feature: 'Weight-loss focused*', product: true, opponent: true },
    { feature: 'Fat-metabolism support*', product: true, opponent: false },
    { feature: 'Metabolic support*', product: true, opponent: false },
    { feature: 'Appetite-reduction support*', product: true, opponent: false },
    { feature: 'Digestive support*', product: true, opponent: false },
    { feature: 'Easy daily powdered formula', product: true, opponent: false },
    { feature: 'No stimulants†', product: true, opponent: 'Varies' },
    { feature: 'No prescription', product: true, opponent: true },
    { feature: '90-Day Guarantee', product: true, opponent: false }
  ];

  return (
    <section 
      style={{ 
        backgroundColor: '#FAF7F2', 
        padding: '75px 20px',
        borderBottom: '1px solid #EFEAE1'
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.16em', color: brandGreen, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          10 — COMPARISON
        </span>
        
        <h2 style={{ fontSize: 'clamp(24px, 3.8vw, 36px)', fontWeight: 900, color: '#141210', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          SLIMSODA® VS BASIC DIET-ONLY APPROACH
        </h2>

        <p style={{ fontSize: '14.5px', color: '#666', fontWeight: 600, margin: '0 0 36px 0' }}>
          YOUR DIET CREATES THE PLAN. SLIMSODA HELPS SUPPORT THE PROCESS.*
        </p>

        {/* Table Container */}
        <div 
          style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: '20px', 
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            marginBottom: '24px'
          }}
        >
          {/* Header Row */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr', 
              padding: '18px 20px', 
              backgroundColor: '#141210', 
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '13px',
              letterSpacing: '0.04em',
              textAlign: 'center'
            }}
          >
            <div style={{ textAlign: 'left' }}>FEATURES</div>
            <div style={{ color: brandGreen }}>SLIMSODA®</div>
            <div style={{ color: '#AAA' }}>BASIC DIET-ONLY</div>
          </div>

          {/* Rows */}
          {rows.map((row, idx) => (
            <div 
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                padding: '16px 20px',
                borderBottom: idx === rows.length - 1 ? 'none' : '1px solid #F4F0EA',
                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF7F2',
                alignItems: 'center',
                fontSize: '13.5px',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              <div style={{ textAlign: 'left', color: '#333' }}>{row.feature}</div>

              <div>
                {row.product === true ? (
                  <span style={{ color: brandGreen, fontWeight: 900, fontSize: '18px' }}>✓</span>
                ) : (
                  <span style={{ color: '#999' }}>—</span>
                )}
              </div>

              <div>
                {row.opponent === true ? (
                  <span style={{ color: '#27AE60', fontWeight: 900, fontSize: '18px' }}>✓</span>
                ) : row.opponent === false ? (
                  <span style={{ color: '#CCC', fontWeight: 900, fontSize: '16px' }}>—</span>
                ) : (
                  <span style={{ fontSize: '12px', color: '#777', fontWeight: 700 }}>{row.opponent}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', marginBottom: '28px' }}>
          †Only use if confirmed by the final Supplement Facts.
        </p>

        <button
          onClick={scrollToBundles}
          style={{
            backgroundColor: brandGreen,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50px',
            padding: '16px 36px',
            fontSize: '15px',
            fontWeight: 900,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(39, 174, 96, 0.3)'
          }}
        >
          CHOOSE MY BUNDLE →
        </button>
      </div>
    </section>
  );
}
