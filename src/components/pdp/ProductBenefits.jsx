import React from 'react';

export function ProductBenefits({ benefitsSection, accentColor }) {
  if (!benefitsSection) return null;
  const { tag, title, subtitle, benefits } = benefitsSection;

  return (
    <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
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
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#141210', margin: '0 0 12px', lineHeight: 1.2 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '16px', color: '#666', maxWidth: '720px', margin: '0 auto', fontWeight: 500, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}
      >
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid rgba(0, 0, 0, 0.07)',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}
          >
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: `${accentColor}15`,
                color: accentColor || '#D96B32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                marginBottom: '16px'
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#141210', margin: '0 0 8px', letterSpacing: '0.02em' }}>
              {benefit.title}
            </h3>
            <p style={{ fontSize: '14.5px', color: '#555', margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
              {benefit.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
