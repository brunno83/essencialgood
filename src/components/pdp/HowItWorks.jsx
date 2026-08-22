import React from 'react';

export function HowItWorks({ howItWorks, accentColor }) {
  if (!howItWorks) return null;
  const { tag, title, subtitle, steps, tagline, ctaText } = howItWorks;

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ backgroundColor: '#FAF7F2', padding: '60px 20px', borderTop: '1px solid #EFEAE1', borderBottom: '1px solid #EFEAE1' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
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
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#141210', margin: '0 0 10px' }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '16px', color: '#666', fontWeight: 500, margin: '0 0 44px' }}>
            {subtitle}
          </p>
        )}

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {steps.map((step, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '28px 20px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                textAlign: 'left'
              }}
            >
              <div 
                style={{ 
                  fontSize: '28px', 
                  fontWeight: 900, 
                  color: accentColor || '#D96B32', 
                  lineHeight: 1,
                  marginBottom: '12px' 
                }}
              >
                {step.step}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#141210', margin: '0 0 8px' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14.5px', color: '#555', margin: 0, lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {tagline && (
          <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.06em', color: '#141210', marginBottom: '24px' }}>
            {tagline}
          </div>
        )}

        {ctaText && (
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
              boxShadow: `0 6px 20px ${accentColor}35`,
              transition: 'transform 0.2s ease'
            }}
          >
            {ctaText}
          </button>
        )}
      </div>
    </section>
  );
}
