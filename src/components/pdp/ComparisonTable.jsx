import React from 'react';

export function ComparisonTable({ comparisonSection, accentColor }) {
  if (!comparisonSection) return null;
  const { tag, title, tagline, headers, rows } = comparisonSection;

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ backgroundColor: '#FAF7F2', padding: '60px 20px', borderTop: '1px solid #EFEAE1', borderBottom: '1px solid #EFEAE1' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        {tag && (
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 800, 
              letterSpacing: '0.14em', 
              color: accentColor || '#D96B32',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            {tag}
          </span>
        )}
        <h2 style={{ fontSize: 'clamp(22px, 3.8vw, 32px)', fontWeight: 800, color: '#141210', margin: '0 0 32px' }}>
          {title}
        </h2>

        {/* Matrix Card */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
            overflow: 'hidden',
            marginBottom: '32px'
          }}
        >
          {/* Header Row */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1.8fr 1fr 1fr', 
              backgroundColor: '#141210', 
              color: '#FFFFFF',
              padding: '16px 20px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textAlign: 'center'
            }}
          >
            <div style={{ textAlign: 'left' }}>{headers[0]}</div>
            <div style={{ color: accentColor || '#D96B32' }}>{headers[1]}</div>
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
                fontSize: '14px'
              }}
            >
              <div style={{ textAlign: 'left', fontWeight: 600, color: '#222' }}>
                {row.feature}
              </div>
              <div style={{ textAlign: 'center', fontWeight: 800, color: '#27AE60', fontSize: '16px' }}>
                {row.product === true ? '✓' : row.product}
              </div>
              <div style={{ textAlign: 'center', fontWeight: 600, color: row.opponent === false ? '#E74C3C' : '#777' }}>
                {row.opponent === false ? '✕' : row.opponent}
              </div>
            </div>
          ))}
        </div>

        {tagline && (
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.08em', color: '#141210', marginBottom: '20px' }}>
            {tagline}
          </div>
        )}

        <button
          onClick={scrollToBundles}
          style={{
            backgroundColor: accentColor || '#D96B32',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '14px 28px',
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: `0 6px 20px ${accentColor}35`
          }}
        >
          CHOOSE MY BUNDLE →
        </button>
      </div>
    </section>
  );
}
