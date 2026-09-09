import React from 'react';

export function SlimSodaFourPillars({ data, accentColor }) {
  const brandGreen = accentColor || '#27AE60';

  if (!data) return null;

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const pillars = [
    {
      icon: '🔥',
      title: 'FAT BURNING',
      desc: 'Supports the metabolic processes your body uses to break down and utilize fat for energy.*',
      badgeColor: '#E74C3C',
      badgeBg: 'rgba(231, 76, 60, 0.08)'
    },
    {
      icon: '⚡',
      title: 'METABOLISM',
      desc: 'Supports metabolic activity and the processes responsible for converting nutrients into usable energy.*',
      badgeColor: '#F39C12',
      badgeBg: 'rgba(243, 156, 18, 0.08)'
    },
    {
      icon: '🍽',
      title: 'APPETITE REDUCTION',
      desc: 'Helps reduce appetite and supports satiety, making it easier to consume less food as part of a calorie-controlled diet.*',
      badgeColor: '#27AE60',
      badgeBg: 'rgba(39, 174, 96, 0.08)'
    },
    {
      icon: '🌿',
      title: 'DIGESTION',
      desc: 'Supports healthy digestion and digestive comfort while you stay consistent with your nutrition routine.*',
      badgeColor: '#2980B9',
      badgeBg: 'rgba(41, 128, 185, 0.08)'
    }
  ];

  return (
    <section 
      style={{ 
        backgroundColor: '#FAF7F2', 
        padding: '75px 20px',
        borderTop: '1px solid #EFEAE1',
        borderBottom: '1px solid #EFEAE1'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <span 
          style={{ 
            fontSize: '12px', 
            fontWeight: 900, 
            letterSpacing: '0.16em', 
            color: brandGreen,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '10px'
          }}
        >
          {data.tag || '02 — WHAT DOES SLIMSODA ACTUALLY DO?'}
        </span>

        <h2 
          style={{ 
            fontSize: 'clamp(24px, 3.8vw, 36px)', 
            fontWeight: 900, 
            color: '#141210', 
            margin: '0 0 16px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          {data.title} <span style={{ color: brandGreen }}>{data.titleHighlight}</span>
        </h2>

        <p 
          style={{ 
            fontSize: '15.5px', 
            color: '#555', 
            lineHeight: 1.6, 
            fontWeight: 500, 
            maxWidth: '820px', 
            margin: '0 auto 30px auto' 
          }}
        >
          {data.lead}
        </p>

        {/* Section 02 Visual Banner */}
        <div style={{ maxWidth: '780px', margin: '0 auto 40px auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)', border: '1px solid #EFEAE1' }}>
          <img 
            src="/assets/pdp/slimsoda/slimsoda-section-2-pillars.jpg" 
            alt="SlimSoda 4-Way Support Routine" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* 4 Pillars Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '24px',
            marginBottom: '40px'
          }}
        >
          {pillars.map((item, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '28px 22px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div>
                <div 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    backgroundColor: item.badgeBg,
                    marginBottom: '16px'
                  }}
                >
                  {item.icon}
                </div>

                <h3 
                  style={{ 
                    fontSize: '17px', 
                    fontWeight: 900, 
                    color: '#141210', 
                    margin: '0 0 10px 0',
                    letterSpacing: '0.01em'
                  }}
                >
                  {item.title}
                </h3>

                <p style={{ fontSize: '13.5px', color: '#555', lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Tagline + CTA */}
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '16px' 
          }}
        >
          <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.08em', color: '#141210' }}>
            {data.tagline || 'FOUR TARGETS. ONE DAILY FORMULA.'}
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
              boxShadow: '0 8px 24px rgba(39, 174, 96, 0.3)',
              transition: 'transform 0.2s ease'
            }}
          >
            {data.ctaText || 'TRY SLIMSODA →'}
          </button>
        </div>
      </div>
    </section>
  );
}
