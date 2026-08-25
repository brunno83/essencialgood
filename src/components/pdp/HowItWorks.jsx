import React from 'react';

export function HowItWorks({ howItWorks, accentColor }) {
  if (!howItWorks) return null;
  const { tag, title, subtitle, steps, tagline, ctaText } = howItWorks;
  const brandGreen = accentColor || '#27AE60';

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ backgroundColor: '#FAF7F2', padding: '70px 20px', borderTop: '1px solid #EFEAE1', borderBottom: '1px solid #EFEAE1' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '44px',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Steps & Text */}
          <div>
            {tag && (
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 800, 
                  letterSpacing: '0.14em', 
                  color: brandGreen,
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                {tag}
              </span>
            )}
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 10px' }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: '15.5px', color: '#666', fontWeight: 500, margin: '0 0 32px' }}>
                {subtitle}
              </p>
            )}

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '20px 22px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px'
                  }}
                >
                  <div 
                    style={{ 
                      fontSize: '24px', 
                      fontWeight: 900, 
                      color: brandGreen, 
                      lineHeight: 1,
                      backgroundColor: `${brandGreen}15`,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      flexShrink: 0
                    }}
                  >
                    {step.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#141210', margin: '0 0 4px' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.5 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {tagline && (
              <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '0.06em', color: '#141210', marginBottom: '24px' }}>
                {tagline}
              </div>
            )}

            {ctaText && (
              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: brandGreen,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 28px',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(39, 174, 96, 0.35)',
                  transition: 'transform 0.2s ease'
                }}
              >
                {ctaText}
              </button>
            )}
          </div>

          {/* Right Column: Close-up Pouring Photo */}
          <div style={{ width: '100%' }}>
            <img
              src="/assets/products/slimsoda-section-howitworks.jpg"
              alt="Pouring SlimSoda into water"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '20px',
                objectFit: 'cover',
                boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.06)',
                display: 'block'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
