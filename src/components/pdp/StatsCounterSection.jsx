import React, { useState, useEffect, useRef } from 'react';

function Counter({ end, duration = 2000, suffix = '%' }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime = null;
    const target = parseInt(end, 10);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [hasAnimated, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsCounterSection({ accentColor }) {
  const stats = [
    {
      value: 94,
      suffix: '%',
      title: 'Less Bloat & Heaviness',
      desc: 'Reported feeling lighter and less bloated within 14 days of daily morning use.'
    },
    {
      value: 91,
      suffix: '%',
      title: 'Appetite Control',
      desc: 'Noticed reduced snack cravings and better control over everyday nutrition.'
    },
    {
      value: 96,
      suffix: '%',
      title: 'Routine Consistency',
      desc: 'Preferred 1 simple powder scoop over swallowing multiple complicated pill bottles.'
    },
    {
      value: 17000,
      suffix: '+',
      title: 'Verified Reviews',
      desc: '5-star customer ratings from real people across the United States.'
    }
  ];

  return (
    <section 
      style={{ 
        backgroundColor: '#1B2613', 
        color: '#FFFFFF', 
        padding: '75px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Subtle Radial Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 107, 50, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '44px',
            alignItems: 'center' 
          }}
        >
          {/* Left Column: 1:1 Product Image on Stone Pedestal */}
          <div style={{ width: '100%', position: 'relative' }}>
            <div 
              style={{
                width: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: '#141210'
              }}
            >
              <img
                src="/assets/pdp/slimsoda/slimsoda-stone-pedestal.jpg"
                alt="SlimSoda tub on natural stone pedestal"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>

          {/* Right Column: Header & 2x2 Grid of Animated Counter Cards */}
          <div>
            <div style={{ marginBottom: '32px' }}>
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 900, 
                  letterSpacing: '0.16em', 
                  color: accentColor || '#D96B32',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                PROVEN BY ROUTINES • BACKED BY RESULTS
              </span>
              <h2 
                style={{ 
                  fontSize: 'clamp(24px, 3.8vw, 36px)', 
                  fontWeight: 900, 
                  color: '#FFFFFF', 
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                REAL RESULTS FROM <span style={{ color: accentColor || '#D96B32' }}>REAL CUSTOMERS</span>
              </h2>
              <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.75)', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
                Based on voluntary customer survey responses after 30 days of consistent daily SlimSoda® use.
              </p>
            </div>

            {/* 2x2 Counter Grid Cards */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px' 
              }}
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px 18px',
                    textAlign: 'left',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
                    transition: 'transform 0.3s ease, border-color 0.3s ease'
                  }}
                >
                  <div 
                    style={{ 
                      fontSize: 'clamp(32px, 4vw, 42px)', 
                      fontWeight: 900, 
                      color: accentColor || '#D96B32', 
                      lineHeight: 1, 
                      marginBottom: '8px',
                      letterSpacing: '-0.03em'
                    }}
                  >
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '0.01em' }}>
                    {stat.title}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
