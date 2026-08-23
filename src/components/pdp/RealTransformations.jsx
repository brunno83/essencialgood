import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RealTransformations({ accentColor }) {
  const transformations = [
    {
      id: 1,
      image: '/assets/transformations/transformation-3.png',
      name: 'Sarah H.',
      age: '34',
      lbsLost: '61 lbs',
      beforeWeight: '197 lbs',
      afterWeight: '136 lbs',
      timeframe: 'In 12 Weeks',
      quote: '“SlimSoda made consistent daily habits so easy. I stopped fighting my cravings and started feeling light and energized every morning.”',
      verified: 'Verified Customer'
    },
    {
      id: 2,
      image: '/assets/transformations/transformation-4.png',
      name: 'Emily R.',
      age: '29',
      lbsLost: '90 lbs',
      beforeWeight: '210 lbs',
      afterWeight: '120 lbs',
      timeframe: 'In 16 Weeks',
      quote: '“The food noise went quiet in my first week. Dissolves in seconds and fits naturally into my morning routine!”',
      verified: 'Verified Customer'
    },
    {
      id: 3,
      image: '/assets/transformations/transformation-1.png',
      name: 'Karen M.',
      age: '63',
      lbsLost: '45 lbs',
      beforeWeight: '215 lbs',
      afterWeight: '170 lbs',
      timeframe: 'In 10 Weeks',
      quote: '“At 63, I never thought my metabolism could feel this active again. I feel lighter, happier, and doing more than ever!”',
      verified: 'Verified Customer'
    },
    {
      id: 4,
      image: '/assets/transformations/transformation-5.jpg',
      name: 'Jessica T.',
      age: '31',
      lbsLost: 'Tonus & Definition',
      beforeWeight: 'Routine Reset',
      afterWeight: 'Active Routine',
      timeframe: 'In 8 Weeks',
      quote: '“I love how simple it is. No needles, no complicated programs. Just two scoops a day with water and real consistency!”',
      verified: 'Verified Customer'
    },
    {
      id: 5,
      image: '/assets/transformations/transformation-2.png',
      name: 'Lesley S.',
      age: '52',
      lbsLost: '17 lbs',
      beforeWeight: '213 lbs',
      afterWeight: '196 lbs',
      timeframe: 'In 4 Weeks',
      quote: '“I don\'t reach for snacks between meals anymore. It gave me back control over my everyday routine.”',
      verified: 'Verified Customer'
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % transformations.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, transformations.length]);

  const current = transformations[activeIdx];

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="transformations-section" 
      style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '75px 20px', 
        borderTop: '1px solid #EFEAE1',
        borderBottom: '1px solid #EFEAE1',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
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
            REAL ROUTINES • REAL RESULTS
          </span>
          <h2 
            style={{ 
              fontSize: 'clamp(24px, 4vw, 36px)', 
              fontWeight: 900, 
              color: '#141210', 
              margin: '0 0 10px',
              letterSpacing: '-0.02em'
            }}
          >
            REAL LIFE <span style={{ color: accentColor || '#D96B32' }}>TRANSFORMATIONS</span>
          </h2>
          <p style={{ fontSize: '15.5px', color: '#666', fontWeight: 500, margin: 0 }}>
            See how real women made SlimSoda® part of their daily wellness routine.
          </p>
        </div>

        {/* Interactive Motion Stage */}
        <div 
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            backgroundColor: '#FAF7F2',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Left Column: Animated Image Card */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxHeight: '460px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.96, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.96, x: 20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  position: 'relative'
                }}
              >
                <img
                  src={current.image}
                  alt={`${current.name} Before & After Transformation`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Badge Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(20, 18, 16, 0.88)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '30px',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ color: '#27AE60' }}>✓</span> {current.verified}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Animated Quote & Details */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                {/* Rating Stars */}
                <div style={{ color: '#F5A623', fontSize: '18px', marginBottom: '12px' }}>
                  ★★★★★
                </div>

                {/* Main Quote */}
                <h3 
                  style={{ 
                    fontSize: 'clamp(18px, 2.5vw, 24px)', 
                    fontWeight: 800, 
                    color: '#141210', 
                    lineHeight: 1.35, 
                    margin: '0 0 18px',
                    fontStyle: 'italic'
                  }}
                >
                  {current.quote}
                </h3>

                {/* Customer Details Pill Grid */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                  <div 
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '8px 14px', 
                      borderRadius: '20px', 
                      fontSize: '13px', 
                      fontWeight: 800, 
                      color: '#141210',
                      border: '1px solid rgba(0,0,0,0.08)' 
                    }}
                  >
                    👤 {current.name}, {current.age}
                  </div>

                  <div 
                    style={{ 
                      backgroundColor: `${accentColor || '#D96B32'}18`, 
                      padding: '8px 14px', 
                      borderRadius: '20px', 
                      fontSize: '13px', 
                      fontWeight: 900, 
                      color: accentColor || '#D96B32',
                      border: `1px solid ${accentColor || '#D96B32'}30` 
                    }}
                  >
                    🔥 {current.lbsLost}
                  </div>

                  <div 
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '8px 14px', 
                      borderRadius: '20px', 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      color: '#555',
                      border: '1px solid rgba(0,0,0,0.08)' 
                    }}
                  >
                    ⏱️ {current.timeframe}
                  </div>
                </div>

                {/* Progress Selector Dots & Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                  {transformations.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveIdx(idx)}
                      style={{
                        width: idx === activeIdx ? '32px' : '10px',
                        height: '10px',
                        borderRadius: '10px',
                        backgroundColor: idx === activeIdx ? (accentColor || '#D96B32') : '#DDD',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: 0
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                  <span style={{ fontSize: '12px', color: '#888', fontWeight: 600, marginLeft: '6px' }}>
                    {activeIdx + 1} of {transformations.length}
                  </span>
                </div>

                <button
                  onClick={scrollToBundles}
                  style={{
                    backgroundColor: accentColor || '#D96B32',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '14px 28px',
                    fontSize: '14px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: `0 6px 20px ${accentColor}35`,
                    transition: 'transform 0.2s ease'
                  }}
                >
                  START YOUR ROUTINE TODAY →
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
