import React from 'react';

export function RealTransformations({ productName = '', productId = '', accentColor }) {
  const pName = String(productName || '').toLowerCase();
  const pId = String(productId || '').toLowerCase();
  const href = typeof window !== 'undefined' ? window.location.href.toLowerCase() : '';

  const isLinfaFlow = pName.includes('linfa') || pId.includes('linfa') || href.includes('linfa');
  const isSlimSoda = pName.includes('slim') || pId.includes('slim') || href.includes('slim');
  const isCrowned = pName.includes('crown') || pId.includes('crown') || href.includes('crown');

  const isSonnus = pName.includes('sonn') || pId.includes('sonn') || href.includes('sonn') || (!isLinfaFlow && !isSlimSoda && !isCrowned);

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

  const sonnusVideos = [
    { 
      id: 1, 
      videoSrc: '/sonnus/videos-lp/ad01.mp4', 
      alt: 'Sonnus Video Testimonial 1',
      name: 'Elena M.',
      badgeText: 'Verified Buyer',
      headline: '“IT\'S BECOME MY SIGNAL TO START WINDING DOWN.”',
      feedback: 'The gummies are easy to take and I like having a consistent step that tells me it\'s time to start shutting things down for the night.'
    },
    { 
      id: 2, 
      videoSrc: '/sonnus/videos-lp/ad02.mp4', 
      alt: 'Sonnus Video Testimonial 2',
      name: 'David L.',
      badgeText: 'Verified Buyer',
      headline: '“I LOVE THAT IT\'S MORE THAN JUST MELATONIN.”',
      feedback: 'I was looking for something with a broader formula, and the ingredient blend is what made me choose Sonnus.'
    },
    { 
      id: 3, 
      videoSrc: '/sonnus/videos-lp/ad03.mp4', 
      alt: 'Sonnus Video Testimonial 3',
      name: 'Rachel B.',
      badgeText: 'Verified Buyer',
      headline: '“THE WILD BERRY GUMMIES MAKE IT EASY.”',
      feedback: 'No capsules or mixing anything. Two gummies before bed fits naturally into my evening routine.'
    },
    { 
      id: 4, 
      videoSrc: '/sonnus/videos-lp/ad05.mp4', 
      alt: 'Sonnus Video Testimonial 4',
      name: 'Marcus P.',
      badgeText: 'Verified Buyer',
      headline: '“SIMPLE ENOUGH TO STAY CONSISTENT.”',
      feedback: 'I\'ve tried more complicated nighttime routines before. This is much easier for me to stick with night after night.'
    }
  ];

  const transformationItems = isSlimSoda 
    ? slimSodaImages 
    : isLinfaFlow 
      ? linfaFlowImages 
      : sonnusVideos;

  // Quadruplicate list to guarantee a 100% gapless infinite marquee track on all screen sizes
  const repeatList = [
    ...transformationItems, 
    ...transformationItems, 
    ...transformationItems, 
    ...transformationItems
  ];

  const isVideoMode = !isSlimSoda && !isLinfaFlow;

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
            color: accentColor || '#3B4959',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}
        >
          {isVideoMode ? 'VIDEO REVIEWS & TESTIMONIALS' : 'REAL PEOPLE. REAL ROUTINES.'}
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
          {isVideoMode 
            ? 'Watch real customers share how Sonnus fits into their nightly wind-down ritual.' 
            : `See how customers are making ${productName || 'our products'} part of their everyday wellness routines.`}
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
            animation: 'infiniteScroll 52s linear infinite',
            willChange: 'transform'
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
        @keyframes infiniteScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .transformations-carousel-container:hover .transformations-track {
          animation-play-state: paused;
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

