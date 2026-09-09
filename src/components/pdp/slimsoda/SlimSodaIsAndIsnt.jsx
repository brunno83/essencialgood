import React from 'react';

export function SlimSodaIsAndIsnt({ accentColor }) {
  const brandGreen = accentColor || '#27AE60';

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const whatItIs = [
    '🔥 Support for fat metabolism*',
    '⚡ Support for metabolic function*',
    '🍽 Support for reduced appetite and satiety*',
    '🌿 Support for digestion*',
    '🎯 A supplement specifically positioned to complement weight loss*'
  ];

  const whatItIsnt = [
    '✕ A miracle overnight solution',
    '✕ A replacement for nutrition',
    '✕ A prescription weight-loss drug',
    '✕ A reason to stop exercising',
    '✕ A guaranteed amount of weight loss'
  ];

  return (
    <section 
      style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '75px 20px',
        borderBottom: '1px solid #EFEAE1'
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.16em', color: brandGreen, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          11 — WHAT SLIMSODA IS — AND ISN'T
        </span>
        
        <h2 style={{ fontSize: 'clamp(24px, 3.8vw, 36px)', fontWeight: 900, color: '#141210', margin: '0 0 14px 0', letterSpacing: '-0.02em' }}>
          THIS IS WEIGHT-LOSS SUPPORT. NOT WEIGHT-LOSS MAGIC.*
        </h2>

        <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6, fontWeight: 500, maxWidth: '780px', margin: '0 auto 36px auto' }}>
          SlimSoda isn't designed to make you lose weight while eating anything you want. It doesn't replace a calorie deficit. And it doesn't replace physical activity.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '36px' }}>
          
          {/* WHAT IT IS */}
          <div 
            style={{ 
              backgroundColor: '#F6FCF8', 
              borderRadius: '20px', 
              padding: '30px 24px',
              border: `1px solid rgba(39, 174, 96, 0.2)`,
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 900, color: brandGreen, letterSpacing: '0.04em', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✓</span> WHAT IT IS:
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {whatItIs.map((item, idx) => (
                <li key={idx} style={{ fontSize: '14px', color: '#141210', fontWeight: 600 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* WHAT IT ISN'T */}
          <div 
            style={{ 
              backgroundColor: '#FDF7F7', 
              borderRadius: '20px', 
              padding: '30px 24px',
              border: '1px solid rgba(231, 76, 60, 0.2)',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#E74C3C', letterSpacing: '0.04em', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✕</span> WHAT IT ISN'T:
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {whatItIsnt.map((item, idx) => (
                <li key={idx} style={{ fontSize: '14px', color: '#555', fontWeight: 500 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.08em', color: '#141210', marginBottom: '20px' }}>
          A BETTER TOOL FOR A BETTER WEIGHT-LOSS ROUTINE.*
        </div>

        <button
          onClick={scrollToBundles}
          style={{
            backgroundColor: brandGreen,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50px',
            padding: '16px 36px',
            fontSize: '15px',
            fontWeight: 900,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(39, 174, 96, 0.3)'
          }}
        >
          TRY SLIMSODA →
        </button>
      </div>
    </section>
  );
}
