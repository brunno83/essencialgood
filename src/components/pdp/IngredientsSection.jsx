import React from 'react';

export function IngredientsSection({ ingredientsSection, accentColor }) {
  if (!ingredientsSection) return null;
  const { tag, title, subtitle, description, ingredients } = ingredientsSection;

  return (
    <section style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
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
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#141210', margin: '0 0 8px' }}>
          {title}
        </h2>
        {subtitle && (
          <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.1em', color: '#666', marginBottom: '12px' }}>
            {subtitle}
          </div>
        )}
        {description && (
          <p style={{ fontSize: '15.5px', color: '#555', maxWidth: '640px', margin: '0 auto', fontWeight: 500 }}>
            {description}
          </p>
        )}
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}
      >
        {ingredients.map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid rgba(0, 0, 0, 0.07)',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
              borderTop: `4px solid ${accentColor || '#D96B32'}`
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#141210', margin: '0 0 10px', letterSpacing: '0.04em' }}>
              {item.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: 1.55 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
