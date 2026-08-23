import React from 'react';

export function ProductBenefits({ benefitsSection, accentColor }) {
  if (!benefitsSection) return null;
  const { tag, title, subtitle, benefits } = benefitsSection;

  return (
    <section id="benefits-section" style={{ padding: '70px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '44px',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Lifestyle Image */}
        <div style={{ width: '100%' }}>
          <img
            src="/assets/products/slimsoda-section-benefits.jpg"
            alt="SlimSoda Daily Routine Benefits"
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

        {/* Right Column: Title & Benefits List */}
        <div>
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
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 12px', lineHeight: 1.2 }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '15.5px', color: '#666', margin: '0 0 28px', fontWeight: 500, lineHeight: 1.55 }}>
              {subtitle}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  padding: '18px 20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: `${accentColor || '#D96B32'}18`,
                    color: accentColor || '#D96B32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '14px',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  ✓
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#141210', margin: '0 0 4px', letterSpacing: '0.02em' }}>
                    {benefit.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#555', margin: 0, lineHeight: 1.5, fontWeight: 400 }}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
