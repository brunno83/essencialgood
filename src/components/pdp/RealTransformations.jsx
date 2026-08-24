import React from 'react';

export function RealTransformations({ accentColor }) {
  const transformationImages = [
    { 
      id: 1, 
      src: '/assets/transformations/transformation-4.png', 
      alt: 'Emily R. Daily Routine Transformation',
      name: 'Emily R.',
      badgeText: 'Verified Buyer',
      headline: '“It became one of the easiest parts of my morning routine.”',
      feedback: 'I love how simple it is to mix and how naturally it fits into my day.',
      hasOverlayBadges: false 
    },
    { 
      id: 2, 
      src: '/assets/transformations/transformation-5.jpg', 
      alt: 'Jessica T. Daily Routine Transformation',
      name: 'Jessica T.',
      badgeText: 'Verified Buyer',
      headline: '“Finally, something I can actually stay consistent with.”',
      feedback: 'I wanted a wellness routine that didn\'t involve several different bottles and schedules. SlimSoda makes it simple.',
      hasOverlayBadges: false 
    },
    { 
      id: 3, 
      src: '/assets/transformations/transformation-1.png', 
      alt: 'Karen M. Daily Routine Transformation',
      name: 'Karen M.',
      badgeText: 'Verified Buyer',
      headline: '“Simple, convenient and easy to remember.”',
      feedback: 'Two scoops with water and I\'m done. That\'s exactly what I wanted from a daily supplement.',
      hasOverlayBadges: false 
    },
    { 
      id: 4, 
      src: '/assets/transformations/transformation-3.png', 
      alt: 'Sarah H. Daily Routine Transformation',
      name: 'Sarah H.',
      badgeText: 'Verified Buyer',
      headline: '“It fits naturally into my routine.”',
      feedback: 'No complicated preparation. I mix it with water and get on with my day.',
      hasOverlayBadges: false 
    }
  ];

  // Duplicate list for infinite smooth marquee track
  const doubleList = [...transformationImages, ...transformationImages];

  return (
    <section 
      id="transformations-section" 
      style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '65px 0', 
        borderTop: '1px solid #EFEAE1',
        borderBottom: '1px solid #EFEAE1',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center', marginBottom: '36px' }}>
        <span 
          style={{ 
            fontSize: '12px', 
            fontWeight: 900, 
            letterSpacing: '0.14em', 
            color: accentColor || '#D96B32',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}
        >
          REAL PEOPLE. REAL ROUTINES.
        </span>
        <h2 
          style={{ 
            fontSize: 'clamp(24px, 4vw, 36px)', 
            fontWeight: 900, 
            color: '#141210', 
            margin: '0 0 8px',
            letterSpacing: '-0.02em'
          }}
        >
          MADE TO FIT <span style={{ color: accentColor || '#D96B32' }}>REAL LIFE.</span>
        </h2>
        <p style={{ fontSize: '15px', color: '#666', fontWeight: 500, margin: 0 }}>
          See how customers are making SlimSoda part of their everyday wellness routines.
        </p>
      </div>

      {/* Infinite Auto-Scrolling Track */}
      <div 
        className="transformations-carousel-container"
        style={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          padding: '10px 0'
        }}
      >
        <div 
          className="transformations-track"
          style={{
            display: 'flex',
            gap: '24px',
            width: 'max-content',
            animation: 'infiniteScroll 34s linear infinite',
            willChange: 'transform'
          }}
        >
          {doubleList.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              style={{
                width: '320px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF',
                flexShrink: 0
              }}
            >
              {/* Photo Box without any weight badges */}
              <div 
                style={{ 
                  width: '100%', 
                  height: '300px', 
                  position: 'relative',
                  backgroundColor: '#FAF7F2'
                }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>

              {/* Feedback & Customer Name Footer Box */}
              <div style={{ padding: '18px', backgroundColor: '#FFFFFF', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#141210', marginBottom: '6px', lineHeight: 1.3 }}>
                    {item.headline}
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#555', margin: '0 0 14px', lineHeight: 1.45, fontWeight: 400 }}>
                    {item.feedback}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F4F0EA', paddingTop: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#141210' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#27AE60', backgroundColor: 'rgba(39, 174, 96, 0.08)', padding: '2px 8px', borderRadius: '10px' }}>
                    ✓ {item.badgeText}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes infiniteScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .transformations-carousel-container:hover .transformations-track {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .transformations-track > div {
            width: 270px !important;
          }
        }
      `}</style>
    </section>
  );
}
