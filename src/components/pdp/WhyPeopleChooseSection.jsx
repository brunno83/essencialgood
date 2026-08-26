import React from 'react';
import { Droplets, Leaf, Sun, ShieldCheck } from 'lucide-react';

export function WhyPeopleChooseSection({ whyChoose, accentColor }) {
  const iconMap = {
    Droplets,
    Leaf,
    Sun,
    ShieldCheck
  };

  const defaultData = {
    tag: 'WHY PEOPLE CHOOSE SLIMSODA',
    title: 'BUILT AROUND WHAT MAKES A ROUTINE',
    titleHighlight: 'EASIER TO KEEP.',
    subtitle: 'Instead of adding more complexity to your day, SlimSoda brings selected ingredients together in one convenient powdered format.',
    tagline: 'SIMPLE TO START. EASY TO KEEP GOING.',
    ctaText: 'CHOOSE MY BUNDLE →',
    image: '/assets/products/slimsoda-stone-pedestal.jpg',
    features: [
      {
        icon: 'Droplets',
        title: 'EASY TO MIX',
        desc: 'Simply add SlimSoda to water according to the product directions.'
      },
      {
        icon: 'Leaf',
        title: 'ONE POWDERED FORMULA',
        desc: 'A convenient alternative to managing multiple supplement bottles.'
      },
      {
        icon: 'Sun',
        title: 'EASY TO BUILD INTO YOUR DAY',
        desc: 'Designed to fit naturally into a morning and evening routine.'
      },
      {
        icon: 'ShieldCheck',
        title: '90-DAY GUARANTEE',
        desc: 'Plenty of time to decide whether SlimSoda is right for your routine.'
      }
    ]
  };

  const data = whyChoose || defaultData;
  const brandAccent = accentColor || '#D96B32';

  // Helper to ensure high contrast on dark section backgrounds (#1B2613)
  const isDarkAccent = brandAccent.toLowerCase() === '#3b4959' || brandAccent.toLowerCase().includes('3b4959');
  const displayAccent = isDarkAccent ? '#A4B8CC' : brandAccent; 
  const iconColor = isDarkAccent ? '#C5D8EA' : brandAccent;
  const iconBg = isDarkAccent ? 'rgba(197, 216, 234, 0.18)' : `${brandAccent}25`;
  const iconBorder = isDarkAccent ? 'rgba(197, 216, 234, 0.45)' : `${brandAccent}50`;
  const buttonBg = isDarkAccent ? '#485869' : brandAccent;

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
      {/* Ambient Radial Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${displayAccent}25 0%, transparent 70%)`,
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
          {/* Left Column: 1:1 Image on Stone Pedestal */}
          <div style={{ width: '100%' }}>
            <div 
              style={{
                width: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backgroundColor: '#141210'
              }}
            >
              <img
                src={data.image || "/assets/products/slimsoda-stone-pedestal.jpg"}
                alt={data.tag}
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

          {/* Right Column: Header & 4 Landing Page Feature Cards */}
          <div>
            <div style={{ marginBottom: '28px' }}>
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 900, 
                  letterSpacing: '0.16em', 
                  color: displayAccent,
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                {data.tag}
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
                {data.title} <span style={{ color: displayAccent }}>{data.titleHighlight}</span>
              </h2>
              <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
                {data.subtitle}
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px',
                marginBottom: '24px'
              }}
            >
              {data.features.map((item, idx) => {
                const IconComponent = typeof item.icon === 'string' ? (iconMap[item.icon] || Leaf) : item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: '16px',
                      padding: '20px 18px',
                      textAlign: 'left',
                      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div 
                      style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '10px', 
                        backgroundColor: iconBg, 
                        border: `1px solid ${iconBorder}`,
                        color: iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px'
                      }}
                    >
                      <IconComponent size={20} />
                    </div>
                    <h3 style={{ fontSize: '13.5px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '0.04em' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.45, fontWeight: 500 }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.08em', color: '#FFFFFF' }}>
                {data.tagline}
              </div>

              <button
                onClick={scrollToBundles}
                style={{
                  backgroundColor: buttonBg,
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  padding: '14px 28px',
                  fontSize: '13.5px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: `0 8px 24px ${buttonBg}60`
                }}
              >
                {data.ctaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
