import React from 'react';

export function RealTransformations({ accentColor }) {
  const transformationImages = [
    { id: 1, src: '/assets/transformations/transformation-3.png', alt: 'Before and After Transformation', hasOverlayBadges: false },
    { id: 2, src: '/assets/transformations/transformation-4.png', alt: 'Before and After Transformation', hasOverlayBadges: false },
    { id: 3, src: '/assets/transformations/transformation-1.png', alt: 'Before and After Transformation', hasOverlayBadges: false },
    { id: 4, src: '/assets/transformations/transformation-5.jpg', alt: 'Before and After Transformation', hasOverlayBadges: true },
    { id: 5, src: '/assets/transformations/transformation-2.png', alt: 'Before and After Transformation', hasOverlayBadges: false }
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
            animation: 'infiniteScroll 28s linear infinite',
            willChange: 'transform'
          }}
        >
          {doubleList.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              style={{
                width: '320px',
                height: '320px',
                flexShrink: 0,
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FAF7F2',
                position: 'relative'
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
                      fontSize: '11px',
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}
                  >
                    BEFORE
                  </div>

                  {/* AFTER Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '52%',
                      backgroundColor: accentColor || '#D96B32',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}
                  >
                    AFTER
                  </div>
                </>
              )}
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
            width: 260px !important;
            height: 260px !important;
          }
        }
      `}</style>
    </section>
  );
}
