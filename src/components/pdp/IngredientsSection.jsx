import React from 'react';

export function IngredientsSection({ ingredientsSection, accentColor }) {
  if (!ingredientsSection) return null;
  const { tag, title, subtitle, description, ingredients } = ingredientsSection;

  return (
    <section id="ingredients-section" style={{ padding: '70px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '44px',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Ingredients Flatlay Photo */}
        <div style={{ width: '100%' }}>
          <img
            src="/assets/products/slimsoda-section-ingredients.jpg"
            alt="SlimSoda Natural Ingredients Formula"
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

        {/* Right Column: Ingredients Details */}
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
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 6px' }}>
            {title}
          </h2>
          {subtitle && (
            <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.1em', color: '#666', marginBottom: '12px' }}>
              {subtitle}
            </div>
          )}
          {description && (
            <p style={{ fontSize: '15px', color: '#555', margin: '0 0 24px', fontWeight: 500, lineHeight: 1.55 }}>
              {description}
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {ingredients.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  padding: '20px 18px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
                  borderTop: `4px solid ${accentColor || '#D96B32'}`
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#141210', margin: '0 0 8px', letterSpacing: '0.03em' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
