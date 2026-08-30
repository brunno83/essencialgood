import React from 'react';

export function GuaranteeSection({ guaranteeSection, accentColor }) {
  if (!guaranteeSection) return null;
  const { tag, title, subtitle, lead, body, highlight, ctaText } = guaranteeSection;
  const brandGreen = accentColor || '#27AE60';

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ backgroundColor: '#FAF7F2', padding: '75px 20px', borderTop: '1px solid #EFEAE1', borderBottom: '1px solid #EFEAE1' }}>
      <div 
        style={{ 
          maxWidth: '900px', 
          margin: '0 auto', 
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '48px 36px',
          border: '1.5px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.04)',
          textAlign: 'center'
        }}
      >
        {tag && (
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 900, 
              letterSpacing: '0.14em', 
              color: brandGreen,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            {tag}
          </span>
        )}

        {/* Guarantee Badge Image from Brand Assets - Prominent & Enlarged */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <img
            src="/assets/home/brand/guarantee_badge.png"
            alt="EssencialGood 90-Day Guarantee Badge"
            style={{
              maxHeight: '280px',
              maxWidth: '280px',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.12))',
              transition: 'transform 0.3s ease'
            }}
          />
        </div>

        <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#141210', margin: '0 0 8px' }}>
          {title}
        </h2>
        {subtitle && (
          <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.1em', color: brandGreen, marginBottom: '20px' }}>
            {subtitle}
          </div>
        )}

        {lead && (
          <p style={{ fontSize: '16.5px', fontWeight: 600, color: '#222', marginBottom: '12px', lineHeight: 1.5 }}>
            {lead}
          </p>
        )}

        {body && (
          <p style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.6, marginBottom: '20px', maxWidth: '680px', margin: '0 auto 20px' }}>
            {body}
          </p>
        )}

        {highlight && (
          <div style={{ fontSize: '15.5px', fontWeight: 900, letterSpacing: '0.08em', color: '#141210', marginBottom: '28px' }}>
            {highlight}
          </div>
        )}

        {ctaText && (
          <button
            onClick={scrollToBundles}
            style={{
              backgroundColor: brandGreen,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 32px',
              fontSize: '14.5px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: 'none'
            }}
          >
            {ctaText}
          </button>
        )}
      </div>
    </section>
  );
}
