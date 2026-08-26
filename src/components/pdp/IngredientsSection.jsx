import React from 'react';
import { Leaf, FlaskConical, Droplets, Zap } from 'lucide-react';

export function IngredientsSection({ ingredientsSection, accentColor }) {
  if (!ingredientsSection) return null;
  const { tag, title, subtitle, description, ingredients, highlightText, ctaText } = ingredientsSection;

  const icons = [Leaf, FlaskConical, Droplets, Zap];

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
            src={ingredientsSection.image || "/assets/products/slimsoda-section-ingredients.jpg"}
            alt={title || "Ingredients Formula"}
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
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          {subtitle && (
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#555', marginBottom: '20px' }}>
              {subtitle}
            </div>
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
                    padding: '18px 16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
                    borderTop: `4px solid ${accentColor || '#D96B32'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
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
                    <p style={{ fontSize: '12.5px', color: '#555', margin: '0 0 10px', lineHeight: 1.45 }}>
                      {item.desc}
                    </p>
                  </div>

                  {item.whyItsHere && (
                    <div style={{ backgroundColor: '#FAF5EF', borderRadius: '8px', padding: '8px 10px', marginTop: '6px', borderLeft: `3px solid ${accentColor || '#D96B32'}` }}>
                      <div style={{ fontSize: '9.5px', fontWeight: 900, color: accentColor || '#D96B32', letterSpacing: '0.06em' }}>
                        WHY IT'S HERE:
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#333', fontWeight: 600, marginTop: '2px' }}>
                        {item.whyItsHere}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {highlightText && (
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #EFEAE1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.06em', color: '#141210', maxWidth: '340px' }}>
                {highlightText}
              </div>
              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: accentColor || '#D96B32',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {ctaText || 'VIEW SUPPLEMENT FACTS →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
