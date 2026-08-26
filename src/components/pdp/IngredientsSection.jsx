import React, { useState } from 'react';
import { Leaf, FlaskConical, Droplets, Zap, ShieldCheck, Sparkles, HeartPulse, Moon } from 'lucide-react';

export function IngredientsSection({ ingredientsSection, accentColor }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!ingredientsSection) return null;
  const { tag, title, subtitle, ingredients = [], highlightText, ctaText } = ingredientsSection;

  const icons = [Leaf, FlaskConical, Droplets, Zap, ShieldCheck, Sparkles, HeartPulse, Moon];
  const brandAccent = accentColor || '#3B4959';

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeItem = ingredients[activeIdx] || ingredients[0] || {};
  const ActiveIcon = icons[activeIdx % icons.length] || Leaf;

  return (
    <section 
      id="ingredients-section" 
      style={{ 
        padding: '65px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        width: '100%' 
      }}
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Product Showcase Photo */}
        <div style={{ width: '100%', position: 'sticky', top: '100px' }}>
          <div
            style={{
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: '#FFFFFF'
            }}
          >
            <img
              src={ingredientsSection.image || "/sonnus/images/gallery-4.png"}
              alt={title || "Ingredients Formula"}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        </div>

        {/* Right Column: Interactive Tabbed Explorer */}
        <div>
          {tag && (
            <span 
              style={{ 
                fontSize: '12px', 
                fontWeight: 900, 
                letterSpacing: '0.14em', 
                color: brandAccent,
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              {tag}
            </span>
          )}
          <h2 style={{ fontSize: 'clamp(24px, 3.8vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#666', margin: '0 0 20px', lineHeight: 1.45 }}>
              {subtitle}
            </p>
          )}

          {/* Interactive Chips Grid (2 Columns, 4 Rows Compact) */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            {ingredients.map((item, idx) => {
              const IconComp = icons[idx % icons.length];
              const isActive = idx === activeIdx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isActive ? `2px solid ${brandAccent}` : '1px solid rgba(0, 0, 0, 0.08)',
                    backgroundColor: isActive ? `${brandAccent}12` : '#FFFFFF',
                    color: isActive ? brandAccent : '#222',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `0 6px 16px ${brandAccent}25` : '0 2px 6px rgba(0,0,0,0.02)',
                    transform: isActive ? 'translateY(-2px)' : 'none'
                  }}
                >
                  <div 
                    style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '8px', 
                      backgroundColor: isActive ? brandAccent : 'rgba(0, 0, 0, 0.05)',
                      color: isActive ? '#FFFFFF' : '#555',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconComp size={14} />
                  </div>
                  <span 
                    style={{ 
                      fontSize: '12.5px', 
                      fontWeight: isActive ? 900 : 700, 
                      lineHeight: 1.25,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.name.split(' ')[0]} {item.name.split(' ')[1] || ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Ingredient Spotlight Box */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: `2px solid ${brandAccent}30`,
              padding: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '10px', 
                    backgroundColor: `${brandAccent}18`,
                    color: brandAccent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ActiveIcon size={20} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#141210', margin: 0 }}>
                  {activeItem.name}
                </h3>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: brandAccent, backgroundColor: `${brandAccent}15`, padding: '3px 10px', borderRadius: '12px' }}>
                {activeIdx + 1} of {ingredients.length}
              </span>
            </div>

            <p style={{ fontSize: '13.5px', color: '#444', margin: '0 0 16px', lineHeight: 1.55, fontWeight: 500 }}>
              {activeItem.desc}
            </p>

            {activeItem.whyItsHere && (
              <div 
                style={{ 
                  backgroundColor: '#FAF7F2', 
                  borderRadius: '12px', 
                  padding: '12px 16px', 
                  borderLeft: `4px solid ${brandAccent}`
                }}
              >
                <div style={{ fontSize: '10.5px', fontWeight: 900, color: brandAccent, letterSpacing: '0.08em', marginBottom: '3px' }}>
                  WHY IT'S IN THE SONNUS® FORMULA:
                </div>
                <div style={{ fontSize: '12.5px', color: '#141210', fontWeight: 700 }}>
                  {activeItem.whyItsHere}
                </div>
              </div>
            )}
          </div>

          {highlightText && (
            <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #EFEAE1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.04em', color: '#141210', maxWidth: '320px' }}>
                {highlightText}
              </div>
              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: brandAccent,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px 26px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: `0 6px 20px ${brandAccent}40`
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

