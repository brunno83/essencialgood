import React from 'react';
import { Droplets, Leaf, Sun, ShieldCheck } from 'lucide-react';

export function WhyPeopleChooseSection({ accentColor }) {
  const features = [
    {
      icon: Droplets,
      title: 'EASY TO MIX',
      desc: 'Simply add SlimSoda to water according to the product directions.'
    },
    {
      icon: Leaf,
      title: 'ONE POWDERED FORMULA',
      desc: 'A convenient alternative to managing multiple supplement bottles.'
    },
    {
      icon: Sun,
      title: 'EASY TO BUILD INTO YOUR DAY',
      desc: 'Designed to fit naturally into a morning and evening routine.'
    },
    {
      icon: ShieldCheck,
      title: '90-DAY GUARANTEE',
      desc: 'Plenty of time to decide whether SlimSoda is right for your routine.'
    }
  ];

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      style={{ 
        backgroundColor: '#1B2613', 
        color: '#FFFFFF', 
        padding: '75px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient Radial Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 107, 50, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '44px',
            alignItems: 'center' 
          }}
        >
          {/* Left Column: 1:1 Image on Stone Pedestal */}
          <div style={{ width: '100%' }}>
            <div 
              style={{
                width: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: '#141210'
              }}
            >
              <img
                src="/assets/products/slimsoda-stone-pedestal.jpg"
                alt="SlimSoda tub on natural stone pedestal"
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

          {/* Right Column: Header & 4 Landing Page Feature Cards */}
          <div>
            <div style={{ marginBottom: '28px' }}>
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 900, 
                  letterSpacing: '0.16em', 
                  color: accentColor || '#D96B32',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                WHY PEOPLE CHOOSE SLIMSODA
              </span>
              <h2 
                style={{ 
                  fontSize: 'clamp(24px, 3.8vw, 36px)', 
                  fontWeight: 900, 
                  color: '#FFFFFF', 
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                BUILT AROUND WHAT MAKES A ROUTINE <span style={{ color: accentColor || '#D96B32' }}>EASIER TO KEEP.</span>
              </h2>
              <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.75)', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
                Instead of adding more complexity to your day, SlimSoda brings selected ingredients together in one convenient powdered format.
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px',
                marginBottom: '24px'
              }}
            >
              {features.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.07)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '16px',
                      padding: '20px 18px',
                      textAlign: 'left',
                      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)'
                    }}
                  >
                    <div 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '10px', 
                        backgroundColor: `${accentColor || '#D96B32'}25`, 
                        border: `1px solid ${accentColor || '#D96B32'}50`,
                        color: accentColor || '#D96B32',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px'
                      }}
                    >
                      <IconComponent size={18} />
                    </div>
                    <h3 style={{ fontSize: '13.5px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '0.04em' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.08em', color: '#FFFFFF' }}>
                SIMPLE TO START. EASY TO KEEP GOING.
              </div>

              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: accentColor || '#D96B32',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 28px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: `0 8px 24px ${accentColor}45`
                }}
              >
                CHOOSE MY BUNDLE →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
