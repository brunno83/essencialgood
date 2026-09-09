import React, { useRef, useEffect, useState } from 'react';

export function RealTransformations({ productName = '', productId = '', accentColor }) {
  const pName = String(productName || '').toLowerCase();
  const pId = String(productId || '').toLowerCase();
  const href = typeof window !== 'undefined' ? window.location.href.toLowerCase() : '';

  const isLinfaFlow = pName.includes('linfa') || pId.includes('linfa') || href.includes('linfa');
  const isSlimSoda = pName.includes('slim') || pId.includes('slim') || href.includes('slim');
  const isCrowned = pName.includes('crown') || pId.includes('crown') || href.includes('crown');

  const slimSodaImages = [
    { 
      id: 1, 
      src: '/assets/transformations/transformation-4.png', 
      alt: `SlimSoda Daily Routine Transformation`,
      name: 'Emily R.',
      badgeText: 'Verified Buyer',
      headline: '“It became one of the easiest parts of my morning routine.”',
      feedback: 'I love how simple the daily routine is and how naturally it fits into my day.'
    },
    { 
      id: 2, 
      src: '/assets/transformations/transformation-5.jpg', 
      alt: `SlimSoda Daily Routine Transformation`,
      name: 'Jessica T.',
      badgeText: 'Verified Buyer',
      headline: '“Finally, something I can actually stay consistent with.”',
      feedback: `I wanted a wellness routine that didn't involve several different bottles and schedules. SlimSoda makes it simple.`
    },
    { 
      id: 3, 
      src: '/assets/transformations/transformation-1.png', 
      alt: `SlimSoda Daily Routine Transformation`,
      name: 'Karen M.',
      badgeText: 'Verified Buyer',
      headline: '“Simple, convenient and easy to remember.”',
      feedback: 'A quick daily routine and I\'m done. That\'s exactly what I wanted from a daily supplement.'
    },
    { 
      id: 4, 
      src: '/assets/transformations/transformation-3.png', 
      alt: `SlimSoda Daily Routine Transformation`,
      name: 'Sarah H.',
      badgeText: 'Verified Buyer',
      headline: '“It fits naturally into my routine.”',
      feedback: 'No complicated preparation. I take it and get on with my day.'
    }
  ];

  const linfaFlowImages = [
    { 
      id: 1, 
      src: '/linfaflow/images/ugc-01.png', 
      alt: 'LinfaFlow Daily Routine Transformation',
      name: 'Sarah M.',
      badgeText: 'Verified Customer',
      headline: '“IT\'S BECOME PART OF MY MORNING.”',
      feedback: 'The dropper format is what I like most. It takes almost no time and I don\'t have another handful of pills to remember.'
    },
    { 
      id: 2, 
      src: '/linfaflow/images/ugc-02.png', 
      alt: 'LinfaFlow Daily Routine Transformation',
      name: 'Marcus B.',
      badgeText: 'Verified Customer',
      headline: '“FINALLY, A FORMULA I CAN UNDERSTAND.”',
      feedback: 'I liked seeing four clearly named botanicals instead of a huge proprietary-looking ingredient list. It\'s straightforward and easy to use.'
    },
    { 
      id: 3, 
      src: '/linfaflow/images/ugc-03.png', 
      alt: 'LinfaFlow Daily Routine Transformation',
      name: 'Jessica R.',
      badgeText: 'Verified Customer',
      headline: '“IT FITS MY ROUTINE.”',
      feedback: 'I\'ve been paying more attention to hydration, walking and my overall wellness routine, and LinfaFlow is easy to incorporate alongside those habits.'
    },
    { 
      id: 4, 
      src: '/linfaflow/images/ugc-04.png', 
      alt: 'LinfaFlow Daily Routine Transformation',
      name: 'Patricia K.',
      badgeText: 'Verified Customer',
      headline: '“SIMPLE IS BETTER FOR ME.”',
      feedback: 'I\'ve tried routines with several bottles before and never stayed consistent. The liquid format makes this much easier.'
    }
  ];

  const sonnusCustomerPhotos = [
    { 
      id: 1, 
      src: '/sonnus/images/image-1.jpg', 
      alt: 'Sonnus Customer Routine 1',
      name: 'Elena M.',
      badgeText: 'Verified Customer',
      headline: '“IT\'S BECOME MY SIGNAL TO START WINDING DOWN.”',
      feedback: 'The gummies are easy to take and I like having a consistent step that tells me it\'s time to start shutting things down for the night.'
    },
    { 
      id: 2, 
      src: '/sonnus/images/imagem-2.jpg', 
      alt: 'Sonnus Customer Routine 2',
      name: 'Rachel B.',
      badgeText: 'Verified Customer',
      headline: '“I LOVE THAT IT\'S MORE THAN JUST MELATONIN.”',
      feedback: 'I was looking for something with a broader formula, and the ingredient blend is what made me choose Sonnus.'
    },
    { 
      id: 3, 
      src: '/sonnus/images/imagem-3.jpg', 
      alt: 'Sonnus Customer Routine 3',
      name: 'Chloe V.',
      badgeText: 'Verified Customer',
      headline: '“THE WILD BERRY GUMMIES MAKE IT EASY.”',
      feedback: 'No capsules or mixing anything. Two gummies before bed fits naturally into my evening routine.'
    },
    { 
      id: 4, 
      src: '/sonnus/images/imagem-4.jpg', 
      alt: 'Sonnus Customer Routine 4',
      name: 'Hannah W.',
      badgeText: 'Verified Customer',
      headline: '“SIMPLE ENOUGH TO STAY CONSISTENT.”',
      feedback: 'I\'ve tried more complicated nighttime routines before. This is much easier for me to stick with.'
    }
  ];

  const crownedImages = [
    { 
      id: 1, 
      src: '/crowned/images/03-result-01.webp', 
      alt: 'Crowned Daily Scalp Care Routine',
      name: 'Amanda K.',
      badgeText: 'Verified Buyer',
      headline: '“I LOVE HOW LIGHT IT FEELS.”',
      feedback: 'I\'ve tried scalp oils before and hated how my roots felt afterward. Crowned is much easier to work into my daily routine.'
    },
    { 
      id: 2, 
      src: '/crowned/images/03-result-02.webp', 
      alt: 'Crowned Daily Scalp Care Routine',
      name: 'Jessica W.',
      badgeText: 'Verified Buyer',
      headline: '“FINALLY, A SCALP PRODUCT I ACTUALLY USE.”',
      feedback: 'One dropper, a quick massage and I\'m done. It doesn\'t complicate everything else I already do with my hair.'
    },
    { 
      id: 3, 
      src: '/crowned/images/03-result-03.webp', 
      alt: 'Crowned Daily Scalp Care Routine',
      name: 'Rachel B.',
      badgeText: 'Verified Buyer',
      headline: '“THE FORMULA IS WHAT CAUGHT MY ATTENTION.”',
      feedback: 'I had seen copper peptides in skincare before, so I liked the idea of a scalp serum built around GHK-Cu.'
    },
    { 
      id: 4, 
      src: '/crowned/images/03-result-04.webp', 
      alt: 'Crowned Daily Scalp Care Routine',
      name: 'Emily S.',
      badgeText: 'Verified Buyer',
      headline: '“EASY TO USE WITHOUT CHANGING MY ROUTINE.”',
      feedback: 'I still use my regular shampoo and styling products. Crowned is just one extra step, which makes it easy to stay consistent.'
    }
  ];

  const transformationItems = isCrowned
    ? crownedImages
    : isLinfaFlow 
      ? linfaFlowImages 
      : isSlimSoda
        ? slimSodaImages
        : sonnusCustomerPhotos;

  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Quadruplicate list to guarantee a 100% gapless infinite marquee track on all screen sizes
  const repeatList = [
    ...transformationItems, 
    ...transformationItems, 
    ...transformationItems, 
    ...transformationItems,
    ...transformationItems, 
    ...transformationItems
  ];

  // Auto-scrolling marquee effect using requestAnimationFrame
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId;
    const speed = 0.8; // px per frame

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        // If scroll reaches half way, reset to start seamlessly
        if (el.scrollLeft >= (el.scrollWidth / 2)) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center', marginBottom: '28px' }}>
        <span 
          style={{ 
            fontSize: '12px', 
            fontWeight: 900, 
            letterSpacing: '0.14em', 
            color: accentColor || '#3B4959',
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
          MADE TO FIT <span style={{ color: accentColor || '#3B4959' }}>REAL LIFE.</span>
        </h2>
        <p style={{ fontSize: '15px', color: '#666', fontWeight: 500, margin: 0 }}>
          See how customers are making {productName || 'SLIMSODA®'} part of their everyday routines.
        </p>

        {/* Scroll Control Arrows */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={scrollLeft}
            aria-label="Previous transformation"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1px solid #EFEAE1',
              color: '#141210',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              transition: 'transform 0.2s ease, background-color 0.2s ease'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <button
            onClick={scrollRight}
            aria-label="Next transformation"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: '1px solid #EFEAE1',
              color: '#141210',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              transition: 'transform 0.2s ease, background-color 0.2s ease'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Auto-scrolling & Drag-scrollable container */}
      <div 
        ref={scrollRef}
        className="transformations-carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        style={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          padding: '10px 20px 20px 20px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}
      >
        <div 
          className="transformations-track"
          style={{
            display: 'flex',
            gap: '24px',
            width: 'max-content'
          }}
        >
          {repeatList.map((item, idx) => (
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
              {/* Media Box: Video or Photo */}
              {item.videoSrc ? (
                <div 
                  style={{ 
                    width: '100%', 
                    height: '310px', 
                    position: 'relative',
                    backgroundColor: '#000000',
                    overflow: 'hidden'
                  }}
                >
                  <video
                    src={item.videoSrc}
                    controls
                    playsInline
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              ) : (
                <div 
                  style={{ 
                    width: '100%', 
                    height: '255px', 
                    position: 'relative',
                    backgroundColor: '#FAF7F2',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{
                      width: '100%',
                      height: '118%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      display: 'block'
                    }}
                  />
                </div>
              )}

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
        .transformations-carousel-container::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 640px) {
          .transformations-track > div {
            width: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}
