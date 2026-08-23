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
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
              fontSize: 'clamp(24px, 4vw, 36px)', 
              fontWeight: 900, 
              color: '#FFFFFF', 
              margin: '0 0 10px',
              letterSpacing: '-0.02em'
            }}
          >
            REAL RESULTS FROM <span style={{ color: accentColor || '#D96B32' }}>REAL CUSTOMERS</span>
          </h2>
          <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.75)', fontWeight: 500, margin: 0, maxWidth: '600px', margin: '0 auto' }}>
            Based on voluntary customer survey responses after 30 days of consistent daily SlimSoda® use.
          </p>
        </div>

        {/* 4 Counter Grid Cards */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '24px' 
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '32px 24px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, border-color 0.3s ease'
              }}
            >
              <div 
                style={{ 
                  fontSize: 'clamp(36px, 5vw, 48px)', 
                  fontWeight: 900, 
                  color: accentColor || '#D96B32', 
                  lineHeight: 1, 
                  marginBottom: '12px',
                  letterSpacing: '-0.03em'
                }}
              >
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '0.02em' }}>
                {stat.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5, fontWeight: 400 }}>
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
