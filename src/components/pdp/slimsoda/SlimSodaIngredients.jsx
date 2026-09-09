import React from 'react';

export function SlimSodaIngredients({ accentColor }) {
  const brandGreen = accentColor || '#27AE60';

  const ingredients = [
    {
      name: 'BERBERINE',
      role: 'METABOLIC + FAT-METABOLISM SUPPORT*',
      tagline: 'THE METABOLIC CORE OF THE FORMULA.*',
      desc: 'Berberine is a bioactive plant compound that has been extensively studied in metabolic research. One of the reasons berberine has received so much attention is its relationship with AMPK, an important cellular energy-sensing pathway involved in energy metabolism.* In SlimSoda, berberine is included as a central part of the formula\'s metabolic approach.*',
      why: [
        'Supports metabolic function*',
        'Supports glucose and lipid metabolism within normal ranges*',
        'Supports cellular energy metabolism*',
        'Complements fat-metabolism support*'
      ],
      badgeBg: 'rgba(39, 174, 96, 0.08)',
      accent: '#27AE60'
    },
    {
      name: 'GINGER EXTRACT',
      role: 'DIGESTION + METABOLIC SUPPORT*',
      tagline: 'DIGESTIVE SUPPORT WITH A PURPOSE.*',
      desc: 'Ginger isn\'t included simply because it\'s a familiar botanical. Its bioactive compounds, including gingerols, have been widely investigated across digestive and metabolic research. Within SlimSoda, ginger extract supports the digestive side of the formula.*',
      why: [
        'Supports healthy digestion*',
        'Supports normal gastrointestinal function*',
        'Supports digestive comfort*',
        'Complements the formula\'s metabolic approach*'
      ],
      badgeBg: 'rgba(41, 128, 185, 0.08)',
      accent: '#2980B9'
    },
    {
      name: 'NAD+ SUPPORT',
      role: 'CELLULAR ENERGY SUPPORT*',
      tagline: 'SUPPORT WHERE ENERGY METABOLISM BEGINS.*',
      desc: 'NAD+ plays an essential role in cellular energy metabolism. Rather than presenting this as an abstract “anti-aging” ingredient, its relevance to SlimSoda is straightforward: metabolism ultimately happens at the cellular level.',
      why: [
        'Supports cellular energy processes*',
        'Complements energy metabolism*',
        'Supports the formula\'s broader metabolic approach*'
      ],
      badgeBg: 'rgba(142, 68, 173, 0.08)',
      accent: '#8E44AD'
    },
    {
      name: 'BAKING SODA',
      role: 'PART OF THE SLIMSODA DELIVERY FORMULA',
      tagline: 'EASY POWDERED MIXING FORMAT',
      desc: 'Included as part of SlimSoda\'s powdered formulation designed around a simple, mix-with-water format.',
      why: [
        'Supports smooth mixing in cold water',
        'Part of the convenient daily powdered delivery formula'
      ],
      badgeBg: 'rgba(243, 156, 18, 0.08)',
      accent: '#D68910'
    }
  ];

  return (
    <section 
      style={{ 
        backgroundColor: '#FAF7F2', 
        padding: '75px 20px',
        borderBottom: '1px solid #EFEAE1'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.16em', color: brandGreen, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            08 — WHAT'S INSIDE?
          </span>
          <h2 style={{ fontSize: 'clamp(24px, 3.8vw, 36px)', fontWeight: 900, color: '#141210', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            TARGETED INGREDIENTS. SPECIFIC PURPOSES.
          </h2>
          <p style={{ fontSize: '14.5px', color: '#666', fontWeight: 600, margin: 0 }}>
            PRODUCT → INGREDIENT → MECHANISM → BENEFIT
          </p>
        </div>

        {/* Section 08 Flat-lay Ingredients Visual */}
        <div style={{ maxWidth: '820px', margin: '0 auto 40px auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)', border: '1px solid #EFEAE1' }}>
          <img 
            src="/assets/pdp/slimsoda/slimsoda-section-8-ingredients.jpg" 
            alt="SlimSoda Ingredients Flat-lay" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Balanced Grid: 4 columns on large desktop, 2x2 on desktop/tablet, 1 column on mobile */}
        <div className="slimsoda-ingredients-grid">
          {ingredients.map((ing, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '28px 22px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <span 
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: 900, 
                    color: ing.accent, 
                    backgroundColor: ing.badgeBg,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    marginBottom: '12px'
                  }}
                >
                  {ing.role}
                </span>

                <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#141210', margin: '0 0 10px 0' }}>
                  {ing.name}
                </h3>

                <p style={{ fontSize: '13.5px', color: '#555', lineHeight: 1.55, fontWeight: 500, margin: '0 0 20px 0' }}>
                  {ing.desc}
                </p>

                <div style={{ borderTop: '1px solid #F4F0EA', paddingTop: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#888', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    WHY IT'S IN SLIMSODA:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ing.why.map((item, wIdx) => (
                      <li key={wIdx} style={{ fontSize: '13px', color: '#333', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ color: ing.accent, fontWeight: 900 }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ backgroundColor: ing.badgeBg, padding: '10px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 900, color: ing.accent, textAlign: 'center' }}>
                {ing.tagline}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .slimsoda-ingredients-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1080px) {
          .slimsoda-ingredients-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 640px) {
          .slimsoda-ingredients-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
}
