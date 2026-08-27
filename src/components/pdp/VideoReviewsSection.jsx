import React from 'react';

export function VideoReviewsSection({ productName = 'SONNUS®', accentColor = '#3B4959' }) {
  const isSonnus = String(productName || '').toLowerCase().includes('sonnus');
  
  if (!isSonnus) return null;

  const videos = [
    { 
      id: 1, 
      videoSrc: '/sonnus/videos-lp/ad01.mp4', 
      name: 'Elena M.',
      badgeText: 'Verified Buyer',
      headline: '“IT\'S BECOME MY SIGNAL TO START WINDING DOWN.”',
      feedback: 'The gummies are easy to take and I like having a consistent step that tells me it\'s time to start shutting things down for the night.'
    },
    { 
      id: 2, 
      videoSrc: '/sonnus/videos-lp/ad02.mp4', 
      name: 'Melissa S.',
      badgeText: 'Verified Buyer',
      headline: '“I LOVE THAT IT\'S MORE THAN JUST MELATONIN.”',
      feedback: 'I was looking for something with a broader formula, and the 10-ingredient blend is what made me choose Sonnus.'
    },
    { 
      id: 3, 
      videoSrc: '/sonnus/videos-lp/ad03.mp4', 
      name: 'Rachel B.',
      badgeText: 'Verified Buyer',
      headline: '“THE WILD BERRY GUMMIES MAKE IT EASY.”',
      feedback: 'No capsules or mixing anything. Two gummies before bed fits naturally into my evening routine.'
    },
    { 
      id: 4, 
      videoSrc: '/sonnus/videos-lp/ad05.mp4', 
      name: 'Monica P.',
      badgeText: 'Verified Buyer',
      headline: '“SIMPLE ENOUGH TO STAY CONSISTENT.”',
      feedback: 'I\'ve tried more complicated nighttime routines before. This is much easier for me to stick with night after night.'
    }
  ];

  return (
    <section 
      id="video-reviews-section" 
      style={{ 
        backgroundColor: '#FAF7F2', 
        padding: '75px 20px', 
        borderTop: '1px solid #EFEAE1',
        borderBottom: '1px solid #EFEAE1'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 900, 
              letterSpacing: '0.14em', 
              color: accentColor,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            VIDEO REVIEWS & TESTIMONIALS
          </span>
          <h2 
            style={{ 
              fontSize: 'clamp(26px, 4vw, 36px)', 
              fontWeight: 900, 
              color: '#141210', 
              margin: '0 0 10px',
              letterSpacing: '-0.02em'
            }}
          >
            REAL NIGHTS. <span style={{ color: accentColor }}>REAL STORIES.</span>
          </h2>
          <p style={{ fontSize: '15.5px', color: '#666', fontWeight: 500, margin: 0, maxWidth: '640px', margin: '0 auto' }}>
            Watch real customers share how Sonnus fits into their nightly wind-down ritual.
          </p>
        </div>

        {/* 4 Video Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {videos.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: '#FFFFFF'
              }}
            >
              {/* Responsive Video Container */}
              <div 
                style={{ 
                  width: '100%', 
                  aspectRatio: '9/14',
                  maxHeight: '380px',
                  backgroundColor: '#000000',
                  position: 'relative',
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

              {/* Review Text Card */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#F5A623', fontSize: '14px', marginBottom: '8px' }}>
                    ★★★★★
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#141210', marginBottom: '8px', lineHeight: 1.3 }}>
                    {item.headline}
                  </div>
                  <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5, fontWeight: 400 }}>
                    {item.feedback}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F4F0EA', paddingTop: '12px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#141210' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#27AE60', backgroundColor: 'rgba(39, 174, 96, 0.08)', padding: '3px 10px', borderRadius: '10px' }}>
                    ✓ {item.badgeText}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
