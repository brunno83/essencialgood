import React from 'react';

export function ComparisonTable({ comparisonSection, accentColor }) {
  if (!comparisonSection) return null;
  const { tag, title, tagline, headers, rows } = comparisonSection;
  const brandGreen = accentColor || '#27AE60';

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      style={{ 
        backgroundColor: '#1B2613', 
        padding: '75px 20px 40px 20px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
        borderBottom: 'none',
        color: '#FFFFFF'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          {tag && (
            <span 
              style={{ 
                fontSize: '12px', 
                fontWeight: 900, 
                letterSpacing: '0.16em', 
                color: brandGreen,
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              {tag}
            </span>
          )}
          <h2 style={{ fontSize: 'clamp(22px, 3.8vw, 36px)', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            {title}
          </h2>
        </div>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '44px',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Side-by-side Comparison Image with Dark Border Glow */}
          <div style={{ width: '100%' }}>
            <img
              src={comparisonSection.image || "/assets/products/slimsoda-section-comparison.jpg"}
              alt={title || "Comparison"}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '20px',
                objectFit: 'cover',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'block'
              }}
            />
          </div>

          {/* Right Column: Matrix Table & CTA */}
          <div>
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                marginBottom: '24px'
              }}
            >
              {/* Header Row */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1.8fr 1fr 1fr', 
                  backgroundColor: '#141210', 
                  color: '#FFFFFF',
                  padding: '18px 20px',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textAlign: 'center'
                }}
              >
                <div style={{ textAlign: 'left' }}>{headers[0]}</div>
                <div style={{ color: brandGreen }}>{headers[1]}</div>
                <div style={{ color: '#AAA' }}>{headers[2]}</div>
              </div>

              {/* Rows */}
              {rows.map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.8fr 1fr 1fr',
                    padding: '16px 20px',
                    borderBottom: idx === rows.length - 1 ? 'none' : '1px solid #F0ECE6',
                    alignItems: 'center',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF9F6',
                    fontSize: '13.5px'
                  }}
                >
                  <div style={{ textAlign: 'left', fontWeight: 700, color: '#141210' }}>
                    {row.feature}
                  </div>
                  <div style={{ textAlign: 'center', fontWeight: 900, color: '#27AE60', fontSize: '17px' }}>
                    {row.product === true ? '✓' : row.product}
                  </div>
                  <div style={{ textAlign: 'center', fontWeight: 700, color: row.opponent === false ? '#E74C3C' : '#777' }}>
                    {row.opponent === false ? '✕' : row.opponent}
                  </div>
                </div>
              ))}
            </div>

            {tagline && (
              <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.08em', color: '#FFFFFF', marginBottom: '20px' }}>
                {tagline}
              </div>
            )}

            <button
              onClick={scrollToBundles}
              style={{
                backgroundColor: brandGreen,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 32px',
                fontSize: '14.5px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(39, 174, 96, 0.35)'
              }}
            >
              CHOOSE MY BUNDLE →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
