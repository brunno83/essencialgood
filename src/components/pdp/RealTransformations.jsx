import React from 'react';

export function RealTransformations({ accentColor }) {
  const transformationImages = [
    { 
      id: 1, 
      src: '/assets/transformations/transformation-3.png', 
      alt: 'Sarah H. Before and After Transformation',
      name: 'Sarah H.',
      badgeText: 'Verified Buyer',
      feedback: '“SlimSoda fits naturally into my morning routine. I feel so much lighter every day!”',
      hasOverlayBadges: false 
    },
    { 
      id: 2, 
      src: '/assets/transformations/transformation-4.png', 
      alt: 'Emily R. Before and After Transformation',
      name: 'Emily R.',
      badgeText: 'Verified Buyer',
      feedback: '“Zero prep, great taste. Stopped my late-night snacking cravings completely.”',
      hasOverlayBadges: false 
    },
    { 
      id: 3, 
      src: '/assets/transformations/transformation-1.png', 
      alt: 'Karen M. Before and After Transformation',
      name: 'Karen M.',
      badgeText: 'Verified Buyer',
      feedback: '“Having a simple daily habit made all the difference in my energy levels.”',
      hasOverlayBadges: false 
    },
    { 
      id: 4, 
      src: '/assets/transformations/transformation-5.jpg', 
      alt: 'Jessica T. Before and After Transformation',
      name: 'Jessica T.',
      badgeText: 'Verified Buyer',
      feedback: '“Simple two scoops with water. My daily digestion and routine feel amazing.”',
      hasOverlayBadges: true,
      beforeLabel: 'BEFORE',
      beforeWeight: '185 lbs',
      afterLabel: 'AFTER',
      afterWeight: '138 lbs'
    },
    { 
      id: 5, 
      src: '/assets/transformations/transformation-2.png', 
      alt: 'Lesley S. Before and After Transformation',
      name: 'Lesley S.',
      badgeText: 'Verified Buyer',
      feedback: '“I don\'t reach for junk food between meals anymore. Super convenient format.”',
      hasOverlayBadges: false 
    }
  ];

  // Duplicate list to achieve a seamless 100% infinite CSS marquee scroll
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
          REAL LIFE ROUTINES
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
          EVERYDAY <span style={{ color: accentColor || '#D96B32' }}>TRANSFORMATIONS</span>
        </h2>
        <p style={{ fontSize: '15px', color: '#666', fontWeight: 500, margin: 0 }}>
          Individual experiences as part of a consistent healthy routine.
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
              {/* Photo Box */}
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

                {/* Overlay Badges for images that don't have burned-in labels */}
                {item.hasOverlayBadges && (
                  <>
                    {/* BEFORE Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        backgroundColor: '#141210',
                        color: '#FFFFFF',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        textAlign: 'left',
                        lineHeight: 1.15
                      }}
                    >
                      <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.06em', opacity: 0.9 }}>
                        {item.beforeLabel}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '-0.01em' }}>
                        {item.beforeWeight}
                      </div>
                    </div>

                    {/* AFTER Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '52%',
                        backgroundColor: accentColor || '#D96B32',
                        color: '#FFFFFF',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        textAlign: 'left',
                        lineHeight: 1.15
                      }}
                    >
                      <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.06em', opacity: 0.9 }}>
                        {item.afterLabel}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '-0.01em' }}>
                        {item.afterWeight}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Feedback & Customer Name Footer Box */}
              <div style={{ padding: '16px 18px', backgroundColor: '#FFFFFF', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '13px', color: '#444', fontStyle: 'italic', margin: '0 0 12px', lineHeight: 1.45, fontWeight: 500 }}>
                  {item.feedback}
                </p>

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
