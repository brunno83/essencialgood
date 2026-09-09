import React from 'react';

export function SlimSodaRoutine({ accentColor }) {
  const brandGreen = accentColor || '#27AE60';

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const steps = [
    {
      time: 'MORNING',
      icon: '🌅',
      desc: 'Mix SlimSoda with water according to the serving directions. Start your day with targeted support for metabolism, fat metabolism and appetite.*'
    },
    {
      time: 'THROUGHOUT THE DAY',
      icon: '☀️',
      desc: 'Maintain your nutrition plan, hydration and activity. SlimSoda\'s appetite-support approach is designed to complement a calorie-controlled eating routine.*'
    },
    {
      time: 'EVENING',
      icon: '🌙',
      desc: 'Follow the product directions for any additional serving. Continue supporting the metabolic, appetite and digestive components of your routine.*'
    },
    {
      time: 'REPEAT CONSISTENTLY',
      icon: '🔄',
      desc: 'No supplement replaces a calorie deficit. SlimSoda is designed to support the processes and behaviors that can make a structured weight-loss plan easier to maintain.*'
    }
  ];

  return (
    <section 
      style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '75px 20px',
        borderBottom: '1px solid #EFEAE1'
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.16em', color: brandGreen, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          09 — HOW SLIMSODA FITS INTO YOUR DAY
        </span>
        
        <h2 style={{ fontSize: 'clamp(24px, 3.8vw, 36px)', fontWeight: 900, color: '#141210', margin: '0 0 30px 0', letterSpacing: '-0.02em' }}>
          TWO MINUTES. ONE WEIGHT-LOSS ROUTINE.*
        </h2>

        {/* Section 09 Routine Infograph Visual */}
        <div style={{ maxWidth: '820px', margin: '0 auto 40px auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)', border: '1px solid #EFEAE1' }}>
          <img 
            src="/assets/pdp/slimsoda/slimsoda-section-9-routine.jpg" 
            alt="SlimSoda Daily Routine Infographic" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {steps.map((step, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#FAF7F2',
                borderRadius: '20px',
                padding: '28px 20px',
                border: '1px solid #EFEAE1',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{step.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: brandGreen, letterSpacing: '0.1em', marginBottom: '8px' }}>
                  {step.time}
                </div>
                <p style={{ fontSize: '13.5px', color: '#555', lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.08em', color: '#141210', marginBottom: '20px' }}>
          MIX. SIP. STAY ON TRACK.*
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
          GET SLIMSODA →
        </button>
      </div>
    </section>
  );
}
