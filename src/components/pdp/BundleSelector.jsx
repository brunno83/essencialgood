import React, { useState } from 'react';
import { LowStockProgressBar } from '../common/LowStockProgressBar';

export function BundleSelector({ bundlesSection, accentColor, customPalette, onSelectBundle }) {
  const [activePalette] = useState(() => {
    if (customPalette) return customPalette;
    const saved = localStorage.getItem('slimsoda_applied_bundle_palette');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  if (!bundlesSection) return null;
  const { tag, title, subtitle, finePrint, bundles } = bundlesSection;

  const popularBorder = activePalette?.popularBorder || accentColor || '#D96B32';
  const popularCta = activePalette?.popularCta || accentColor || '#D96B32';
  const popularBadge = activePalette?.popularBadge || accentColor || '#D96B32';
  const popularCardBg = activePalette?.popularCardBg || '#FAF5EF';
  const popularTextWhite = Boolean(activePalette?.popularTextWhite);

  const bestValueBorder = activePalette?.bestValueBorder || '#4B6833';
  const bestValueCta = activePalette?.bestValueCta || '#4B6833';
  const bestValueBadge = activePalette?.bestValueBadge || '#4B6833';
  const bestValueCardBg = activePalette?.bestValueCardBg || '#FFFFFF';
  const bestValueTextWhite = Boolean(activePalette?.bestValueTextWhite);

  const starterCta = activePalette?.starterCta || '#4B6833';
  const starterBorder = activePalette?.starterBorder || 'rgba(0, 0, 0, 0.12)';

  const savingsTextColor = activePalette?.savingsTextColor || '#4B6833';
  const savingsBg = activePalette?.savingsBg || 'rgba(75, 104, 51, 0.1)';

  return (
    <section 
      id="bundles-section" 
      style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {tag && (
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 800, 
              letterSpacing: '0.14em', 
              color: popularBorder,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            {tag}
          </span>
        )}
        <h2 
          style={{ 
            fontSize: 'clamp(24px, 4vw, 36px)', 
            fontWeight: 800, 
            color: '#141210', 
            margin: '0 0 10px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '16px', color: '#666', margin: 0, fontWeight: 500 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}
      >
        {bundles.map((bundle) => {
          const isPopular = bundle.isPopular;
          const isBestValue = bundle.isBestValue;
          const isFeatured = isPopular || isBestValue;

          let cardBg = '#FFFFFF';
          let borderColor = starterBorder;
          let ctaBg = starterCta;
          let badgeBg = '#4B6833';
          let isWhiteText = false;

          if (isPopular) {
            cardBg = popularCardBg;
            borderColor = popularBorder;
            ctaBg = popularCta;
            badgeBg = popularBadge;
            isWhiteText = popularTextWhite;
          } else if (isBestValue) {
            cardBg = bestValueCardBg;
            borderColor = bestValueBorder;
            ctaBg = bestValueCta;
            badgeBg = bestValueBadge;
            isWhiteText = bestValueTextWhite;
          }

          return (
            <div
              key={bundle.id}
              style={{
                backgroundColor: cardBg,
                borderRadius: '16px',
                border: isFeatured ? `2.5px solid ${borderColor}` : `1.5px solid ${borderColor}`,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: isFeatured ? `0 16px 40px ${borderColor}25` : '0 4px 20px rgba(0, 0, 0, 0.04)',
                transform: isFeatured ? 'translateY(-6px)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Top Badge */}
              {bundle.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: badgeBg,
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {bundle.badge}
                </div>
              )}

              <div>
                {/* Bundle Bottle Image */}
                {bundle.image && (
                  <div
                    style={{
                      width: '100%',
                      height: '140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px',
                      marginTop: bundle.badge ? '8px' : '0'
                    }}
                  >
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '90%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))'
                      }}
                    />
                  </div>
                )}

                <div style={{ textAlign: 'center', marginTop: !bundle.image && bundle.badge ? '8px' : '0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: isWhiteText ? 'rgba(255,255,255,0.8)' : '#888', letterSpacing: '0.1em' }}>
                    {bundle.name}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: isWhiteText ? '#FFFFFF' : '#141210', margin: '4px 0 2px' }}>
                    {bundle.deal}
                  </h3>
                  <span style={{ fontSize: '13px', color: isWhiteText ? 'rgba(255,255,255,0.85)' : '#666', fontWeight: 600 }}>
                    {bundle.bottles}
                  </span>
                </div>

                <div 
                  style={{ 
                    textAlign: 'center', 
                    margin: '16px 0', 
                    padding: '14px 0', 
                    borderTop: isWhiteText ? '1px solid rgba(255,255,255,0.2)' : '1px solid #F0ECE6', 
                    borderBottom: isWhiteText ? '1px solid rgba(255,255,255,0.2)' : '1px solid #F0ECE6' 
                  }}
                >
                  <div style={{ fontSize: '32px', fontWeight: 900, color: isWhiteText ? '#FFFFFF' : '#141210', lineHeight: 1 }}>
                    {bundle.pricePerBottle}
                    <span style={{ fontSize: '14px', fontWeight: 600, color: isWhiteText ? 'rgba(255,255,255,0.8)' : '#666' }}> / bottle</span>
                  </div>
                  <div style={{ fontSize: '14px', color: isWhiteText ? 'rgba(255,255,255,0.85)' : '#777', marginTop: '6px', fontWeight: 600 }}>
                    {bundle.totalPrice} total
                  </div>
                  {bundle.savings && (
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        marginTop: '8px', 
                        fontSize: '12px', 
                        fontWeight: 700, 
                        color: isWhiteText ? savingsTextColor : savingsTextColor, 
                        backgroundColor: isWhiteText ? '#FFFFFF' : savingsBg,
                        padding: '4px 10px',
                        borderRadius: '12px'
                      }}
                    >
                      {bundle.savings}
                    </span>
                  )}
                </div>

                {/* Perks */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                  {bundle.perks.map((perk, idx) => (
                    <li 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontSize: '13.5px', 
                        color: isWhiteText ? '#FFFFFF' : '#444', 
                        fontWeight: 600,
                        marginBottom: '8px'
                      }}
                    >
                      <span style={{ color: isWhiteText ? '#FFFFFF' : savingsTextColor, fontWeight: 800 }}>✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkout Button */}
              <a
                href={bundle.checkoutUrl}
                target="_top"
                rel="noopener"
                onClick={() => onSelectBundle && onSelectBundle(bundle)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: ctaBg,
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  padding: '16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxShadow: `0 8px 24px ${ctaBg}40`,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {bundle.ctaText}
              </a>
            </div>
          );
        })}
      </div>

      {/* Low Stock Warning Bar Widget */}
      <div style={{ maxWidth: '600px', margin: '20px auto 0 auto' }}>
        <LowStockProgressBar percentage={88} accentColor={popularBorder} />
      </div>

      {finePrint && (
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', fontWeight: 700, color: '#888', letterSpacing: '0.06em' }}>
          {finePrint}
        </div>
      )}
    </section>
  );
}
