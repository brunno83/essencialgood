import React from 'react';

export function WhySlimSodaBlock({ accentColor }) {
  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      style={{ 
        backgroundColor: '#FAF7F2', 
        padding: '75px 20px',
        borderTop: '1px solid #EFEAE1',
        borderBottom: '1px solid #EFEAE1'
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Tag */}
        <span 
          style={{ 
            fontSize: '12px', 
            fontWeight: 900, 
            letterSpacing: '0.16em', 
            color: accentColor || '#D96B32',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '10px'
          }}
        >
          WHY SLIMSODA?
        </span>

        {/* Main Headline */}
        <h2 
          style={{ 
            fontSize: 'clamp(24px, 4vw, 38px)', 
            fontWeight: 900, 
            color: '#141210', 
            margin: '0 0 20px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          YOUR WELLNESS ROUTINE SHOULDN'T FEEL LIKE A FULL-TIME JOB.
        </h2>

        {/* Body Paragraphs Card */}
        <div 
          style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            marginBottom: '28px',
            textAlign: 'left'
          }}
        >
          <p style={{ fontSize: '16px', color: '#444', lineHeight: 1.65, fontWeight: 500, margin: '0 0 16px 0' }}>
            Healthy habits work best when they're simple enough to maintain.
          </p>

          <p style={{ fontSize: '15.5px', color: '#555', lineHeight: 1.65, fontWeight: 500, margin: '0 0 20px 0' }}>
            But wellness routines can quickly become complicated — multiple bottles, different schedules and too many steps to remember.
          </p>

          <div 
            style={{ 
              backgroundColor: '#FAF5EF', 
              borderLeft: `4px solid ${accentColor || '#D96B32'}`, 
              padding: '16px 20px', 
              borderRadius: '0 12px 12px 0',
              marginBottom: '20px'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, color: accentColor || '#D96B32', letterSpacing: '0.08em', marginBottom: '4px' }}>
              SLIMSODA WAS CREATED AROUND A SIMPLER IDEA:
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#141210', letterSpacing: '0.02em' }}>
              SELECTED INGREDIENTS. ONE POWDERED FORMULA. ONE EASY ROUTINE.
            </div>
          </div>

          <p style={{ fontSize: '15.5px', color: '#444', lineHeight: 1.65, fontWeight: 500, margin: 0 }}>
            Mix it with water. Make it part of your day. Keep focusing on the fundamentals that matter: balanced nutrition, hydration, movement and consistency.
          </p>
        </div>

        <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.08em', color: '#141210', marginBottom: '24px' }}>
          LESS COMPLEXITY. MORE CONSISTENCY.
        </div>

        <button
          onClick={scrollToBundles}
          style={{
            backgroundColor: accentColor || '#D96B32',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '16px 36px',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: `0 8px 24px ${accentColor}40`,
            transition: 'transform 0.2s ease'
          }}
        >
          TRY SLIMSODA →
        </button>

      </div>
    </section>
  );
}
