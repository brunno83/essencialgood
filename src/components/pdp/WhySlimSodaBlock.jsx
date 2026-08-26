import React from 'react';

export function WhySlimSodaBlock({ whyBlock, accentColor }) {
  const brandGreen = accentColor || '#27AE60';

  const defaultWhy = {
    tag: 'WHY SLIMSODA?',
    title: "YOUR WELLNESS ROUTINE SHOULDN'T FEEL LIKE A FULL-TIME JOB.",
    lead: "Healthy habits work best when they're simple enough to maintain.",
    p1: "But wellness routines can quickly become complicated — multiple bottles, different schedules and too many steps to remember.",
    boxTag: 'SLIMSODA WAS CREATED AROUND A SIMPLER IDEA:',
    boxTitle: 'SELECTED INGREDIENTS. ONE POWDERED FORMULA. ONE EASY ROUTINE.',
    p2: 'Mix it with water. Make it part of your day. Keep focusing on the fundamentals that matter: balanced nutrition, hydration, movement and consistency.',
    tagline: 'LESS COMPLEXITY. MORE CONSISTENCY.',
    ctaText: 'TRY SLIMSODA →',
    image: '/assets/products/slimsoda-lifestyle-routine.jpg'
  };

  const data = whyBlock || defaultWhy;

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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
            gap: '44px',
            alignItems: 'center' 
          }}
        >
          {/* Left Column: 3:4 Lifestyle Routine Photo */}
          <div style={{ width: '100%' }}>
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
                src={data.image || "/assets/products/slimsoda-lifestyle-routine.jpg"}
                alt={data.tag}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '3 / 4',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>

          {/* Right Column: Editorial Copy Card & Headline */}
          <div>
            {/* Tag */}
            <span 
              style={{ 
                fontSize: '12px', 
                fontWeight: 900, 
                letterSpacing: '0.16em', 
                color: brandGreen,
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              {data.tag}
            </span>

            {/* Main Headline */}
            <h2 
              style={{ 
                fontSize: 'clamp(24px, 3.8vw, 36px)', 
                fontWeight: 900, 
                color: '#141210', 
                margin: '0 0 20px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              {data.title}
            </h2>

            {/* Body Paragraphs Card */}
            <div 
              style={{ 
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '30px 26px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                marginBottom: '24px',
                textAlign: 'left'
              }}
            >
              <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.6, fontWeight: 500, margin: '0 0 14px 0' }}>
                {data.lead}
              </p>

              <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6, fontWeight: 500, margin: '0 0 18px 0' }}>
                {data.p1}
              </p>

              <div 
                style={{ 
                  backgroundColor: '#F6FCF8', 
                  borderLeft: `4px solid ${brandGreen}`, 
                  padding: '14px 18px', 
                  borderRadius: '0 12px 12px 0',
                  marginBottom: '18px'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 900, color: brandGreen, letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {data.boxTag}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#141210', letterSpacing: '0.01em' }}>
                  {data.boxTitle}
                </div>
              </div>

              <p style={{ fontSize: '14.5px', color: '#444', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                {data.p2}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.06em', color: '#141210' }}>
                {data.tagline}
              </div>

              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: brandGreen,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '15px 32px',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: `0 8px 24px ${brandGreen}55`,
                  transition: 'transform 0.2s ease'
                }}
              >
                {data.ctaText}
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
