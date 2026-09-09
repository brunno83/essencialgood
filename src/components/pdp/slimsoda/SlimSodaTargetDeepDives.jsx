import React from 'react';

export function SlimSodaTargetDeepDives({ accentColor }) {
  const brandGreen = accentColor || '#27AE60';

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      
      {/* 03 — FAT BURNING */}
      <section 
        style={{ 
          padding: '70px 20px', 
          borderBottom: '1px solid #EFEAE1',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            
            {/* Text Content */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.14em', color: '#E74C3C', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                03 — FAT BURNING
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 10px 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                HELP YOUR BODY BURN — NOT JUST STORE.*
              </h2>
              <p style={{ fontSize: '13px', fontWeight: 800, color: '#E74C3C', letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
                SUPPORT THE NATURAL PROCESSES INVOLVED IN FAT BURNING.*
              </p>
              <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6, fontWeight: 500, margin: '0 0 24px 0' }}>
                Your body is constantly deciding what to do with the energy it receives from food. Some is used immediately. Some can be stored. And stored fat can also be mobilized and utilized to meet the body's energy demands. That's where fat metabolism comes in. SlimSoda contains targeted ingredients selected to support the metabolic pathways involved in how your body processes and utilizes fats for energy.*
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #E74C3C' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>🔥 FAT METABOLISM*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Supports normal metabolic processes involved in breaking down and utilizing fats.*</div>
                </div>

                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #E74C3C' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>⚡ ENERGY UTILIZATION*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Supports the body's ability to process nutrients and convert them into usable energy.*</div>
                </div>

                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #E74C3C' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>🎯 WEIGHT-LOSS SUPPORT*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Designed to complement a calorie-controlled nutrition and activity plan aimed at reducing body weight.*</div>
                </div>
              </div>

              <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#141210', marginBottom: '16px', letterSpacing: '0.04em' }}>
                SUPPORT YOUR BODY'S NATURAL FAT-BURNING PROCESSES.*
              </div>

              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: '#E74C3C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '14px 28px',
                  fontSize: '14px',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(231, 76, 60, 0.25)'
                }}
              >
                START MY SLIMSODA ROUTINE →
              </button>
            </div>

            {/* Visual Card with Custom Uploaded Image */}
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)', border: '1px solid #EFEAE1', backgroundColor: '#FFFFFF' }}>
              <img 
                src="/assets/pdp/slimsoda/slimsoda-section-3-fatburn.jpg" 
                alt="Fat-Burning Support SlimSoda"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
              />
            </div>

          </div>
        </div>
      </section>

      {/* 04 — METABOLISM */}
      <section 
        style={{ 
          padding: '70px 20px', 
          borderBottom: '1px solid #EFEAE1',
          backgroundColor: '#FAF7F2'
        }}
      >
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            
            {/* Visual Card with Custom Uploaded Image */}
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)', border: '1px solid #EFEAE1', backgroundColor: '#FFFFFF' }}>
              <img 
                src="/assets/pdp/slimsoda/slimsoda-section-4-metabolism.jpg" 
                alt="Metabolism Support Berberine SlimSoda"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
              />
            </div>

            {/* Text Content */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.14em', color: '#D68910', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                04 — METABOLISM
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 16px 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                YOUR METABOLISM MATTERS WHEN WEIGHT LOSS IS THE GOAL.*
              </h2>
              <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6, fontWeight: 500, margin: '0 0 24px 0' }}>
                Metabolism is the collection of processes your body uses to convert food and stored nutrients into energy. And when you're trying to lose weight, metabolic function is part of the equation. SlimSoda combines ingredients selected for their role in metabolic health and energy metabolism — including berberine, one of the formula's key metabolic ingredients.*
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #D68910' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>⚡ SUPPORT METABOLIC ACTIVITY*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Supports normal metabolic processes involved in energy production and nutrient utilization.*</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #D68910' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>🔥 SUPPORT FAT METABOLISM*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Supports pathways involved in processing and utilizing fats.*</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #D68910' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>⚙ SUPPORT ENERGY METABOLISM*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Helps support the conversion of nutrients into usable cellular energy.*</div>
                </div>
              </div>

              <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#141210', marginBottom: '16px', letterSpacing: '0.04em' }}>
                DON'T JUST FOCUS ON EATING LESS. SUPPORT THE METABOLIC SIDE OF THE EQUATION, TOO.*
              </div>

              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: '#D68910',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '14px 28px',
                  fontSize: '14px',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(214, 137, 16, 0.25)'
                }}
              >
                CHOOSE MY BUNDLE →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 05 — APPETITE REDUCTION */}
      <section 
        style={{ 
          padding: '70px 20px', 
          borderBottom: '1px solid #EFEAE1',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            
            {/* Text Content */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.14em', color: brandGreen, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                05 — APPETITE REDUCTION
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 10px 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                EATING LESS IS EASIER WHEN YOU'RE LESS HUNGRY.*
              </h2>
              <p style={{ fontSize: '13px', fontWeight: 800, color: brandGreen, letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
                SLIMSODA IS DESIGNED TO HELP REDUCE APPETITE AND SUPPORT SATIETY.*
              </p>
              <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6, fontWeight: 500, margin: '0 0 24px 0' }}>
                Trying to maintain a calorie deficit while constantly feeling hungry can make consistency difficult. That's why appetite is one of the core areas addressed by SlimSoda.* The formula was designed to help reduce appetite and support feelings of fullness, making it easier to stay aligned with a calorie-controlled eating routine.*
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '14px 18px', borderLeft: `4px solid ${brandGreen}` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>🍽 HELPS REDUCE APPETITE*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Supports reduced appetite as part of a consistent weight-loss routine.*</div>
                </div>

                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '14px 18px', borderLeft: `4px solid ${brandGreen}` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>🥗 SUPPORTS SATIETY*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Helps support feelings of fullness and satisfaction after eating.*</div>
                </div>

                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '14px 18px', borderLeft: `4px solid ${brandGreen}` }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>🎯 HELPS YOU STAY ON PLAN*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>When appetite feels more manageable, maintaining appropriate portions and a structured nutrition plan can become easier.*</div>
                </div>
              </div>

              <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#141210', marginBottom: '16px', letterSpacing: '0.04em' }}>
                LESS HUNGER. GREATER SATIETY. BETTER CONSISTENCY.
              </div>

              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: brandGreen,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '14px 28px',
                  fontSize: '14px',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(39, 174, 96, 0.25)'
                }}
              >
                TRY SLIMSODA →
              </button>
            </div>

            {/* Visual Card with Custom Uploaded Image */}
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)', border: '1px solid #EFEAE1', backgroundColor: '#FFFFFF' }}>
              <img 
                src="/assets/pdp/slimsoda/slimsoda-section-5-appetite.jpg" 
                alt="Appetite & Satiety SlimSoda"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
              />
            </div>

          </div>
        </div>
      </section>

      {/* 06 — DIGESTION */}
      <section 
        style={{ 
          padding: '70px 20px', 
          borderBottom: '1px solid #EFEAE1',
          backgroundColor: '#FAF7F2'
        }}
      >
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            
            {/* Visual Card with Custom Uploaded Image */}
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)', border: '1px solid #EFEAE1', backgroundColor: '#FFFFFF' }}>
              <img 
                src="/assets/pdp/slimsoda/slimsoda-section-6-digestion.jpg" 
                alt="Digestive Wellness Ginger SlimSoda"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
              />
            </div>

            {/* Text Content */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.14em', color: '#2980B9', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                06 — DIGESTION
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 10px 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                WEIGHT LOSS DOESN'T STOP AT CALORIES.
              </h2>
              <p style={{ fontSize: '13px', fontWeight: 800, color: '#2980B9', letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
                YOUR DIGESTIVE SYSTEM IS PART OF THE PROCESS.*
              </p>
              <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6, fontWeight: 500, margin: '0 0 24px 0' }}>
                SlimSoda includes ginger extract as part of a formula designed to support healthy digestive function.* Ginger has been extensively used in food and supplements and studied in connection with gastrointestinal function.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #2980B9' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>🌿 SUPPORTS HEALTHY DIGESTION*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Helps support normal digestive function.*</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #2980B9' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>💧 SUPPORTS DIGESTIVE COMFORT*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Supports a more comfortable digestive experience as part of your daily routine.*</div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '14px 18px', borderLeft: '4px solid #2980B9' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '4px' }}>🍽 COMPLEMENTS YOUR NUTRITION ROUTINE*</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>Designed to be used alongside balanced, calorie-conscious nutrition.*</div>
                </div>
              </div>

              <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#141210', marginBottom: '16px', letterSpacing: '0.04em' }}>
                FAT BURNING. METABOLISM. APPETITE. DIGESTION.* THAT'S THE SLIMSODA APPROACH.*
              </div>

              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: '#2980B9',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '14px 28px',
                  fontSize: '14px',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(41, 128, 185, 0.25)'
                }}
              >
                START TODAY →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 07 — WHY FOUR DIFFERENT TARGETS? (Flow Chart) */}
      <section 
        style={{ 
          padding: '75px 20px', 
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EFEAE1',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.16em', color: brandGreen, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
            07 — WHY FOUR DIFFERENT TARGETS?
          </span>

          <h2 style={{ fontSize: 'clamp(24px, 3.8vw, 36px)', fontWeight: 900, color: '#141210', margin: '0 0 16px 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            BECAUSE WEIGHT LOSS ISN'T A ONE-STEP PROCESS.
          </h2>

          <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6, fontWeight: 500, maxWidth: '780px', margin: '0 auto 36px auto' }}>
            A product focused only on convenience isn't enough. SlimSoda was designed around multiple areas involved in a successful weight-loss routine.* You need to create an appropriate energy deficit. But maintaining that deficit can be difficult when appetite is high. Your body needs to process and utilize energy. That's where metabolic function and fat metabolism become relevant. And consistency matters. That's why SlimSoda brings these targets together:
          </p>

          {/* Flow Diagram */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
            
            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '22px 16px', border: '1px solid #EFEAE1' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#E74C3C', marginBottom: '4px' }}>FAT METABOLISM*</div>
              <div style={{ fontSize: '16px', color: '#999', margin: '4px 0' }}>↓</div>
              <div style={{ fontSize: '12.5px', color: '#555', fontWeight: 500 }}>Supports the processes involved in fat utilization.</div>
            </div>

            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '22px 16px', border: '1px solid #EFEAE1' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#D68910', marginBottom: '4px' }}>METABOLIC FUNCTION*</div>
              <div style={{ fontSize: '16px', color: '#999', margin: '4px 0' }}>↓</div>
              <div style={{ fontSize: '12.5px', color: '#555', fontWeight: 500 }}>Supports nutrient and energy metabolism.</div>
            </div>

            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '22px 16px', border: '1px solid #EFEAE1' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: brandGreen, marginBottom: '4px' }}>REDUCED APPETITE*</div>
              <div style={{ fontSize: '16px', color: '#999', margin: '4px 0' }}>↓</div>
              <div style={{ fontSize: '12.5px', color: '#555', fontWeight: 500 }}>Helps reduce appetite and support fullness.</div>
            </div>

            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '22px 16px', border: '1px solid #EFEAE1' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#2980B9', marginBottom: '4px' }}>DIGESTION*</div>
              <div style={{ fontSize: '16px', color: '#999', margin: '4px 0' }}>↓</div>
              <div style={{ fontSize: '12.5px', color: '#555', fontWeight: 500 }}>Supports normal digestive function.</div>
            </div>

          </div>

          <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.08em', color: '#141210', marginBottom: '20px' }}>
            ONE FORMULA. MULTIPLE WEIGHT-LOSS TARGETS.*
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
            CHOOSE MY SLIMSODA →
          </button>
        </div>
      </section>

    </div>
  );
}
