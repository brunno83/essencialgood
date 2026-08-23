import React from 'react';
import { Leaf, FlaskConical, Droplets, Zap } from 'lucide-react';

export function IngredientsSection({ ingredientsSection, accentColor }) {
  if (!ingredientsSection) return null;
  const { tag, title, subtitle, description, ingredients } = ingredientsSection;

  const icons = [Leaf, FlaskConical, Droplets, Zap];

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
            {ingredients.map((item, idx) => {
              const IconComponent = icons[idx % icons.length];
              return (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div 
                      style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '6px', 
                        backgroundColor: `${accentColor || '#D96B32'}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: accentColor || '#D96B32',
                        flexShrink: 0
                      }}
                    >
                      <IconComponent size={16} />
                    </div>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#141210', margin: 0, letterSpacing: '0.02em' }}>
                      {item.name}
                    </h3>
                  </div>
                  <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
