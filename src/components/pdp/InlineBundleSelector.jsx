import React, { useState } from 'react';
import { LowStockProgressBar } from '../common/LowStockProgressBar';

export function InlineBundleSelector({ bundles = [], accentColor }) {
  const brandGreen = accentColor || '#27AE60';
  
  // Default selected bundle: most-popular (index 1) or first
  const [selectedId, setSelectedId] = useState(() => {
    const list = Array.isArray(bundles) ? bundles : [];
    const popular = list.find(b => b?.isPopular);
    return popular ? popular.id : (list[0]?.id || 'most-popular');
  });

  if (!bundles || !Array.isArray(bundles) || bundles.length === 0) return null;

  const selectedBundle = bundles.find(b => b.id === selectedId) || bundles[0];

  return (
    <div className="inline-bundle-selector" style={{ marginTop: '20px', width: '100%' }}>
      <div style={{ fontSize: '13px', fontWeight: 800, color: '#141210', letterSpacing: '0.04em', marginBottom: '12px' }}>
        SELECT YOUR BUNDLE:
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {bundles.map((bundle) => {
          const isSelected = bundle.id === selectedId;

          return (
            <div
              key={bundle.id}
              onClick={() => setSelectedId(bundle.id)}
              style={{
                position: 'relative',
                backgroundColor: isSelected ? 'rgba(39, 174, 96, 0.04)' : '#FFFFFF',
                border: isSelected ? `2.5px solid ${brandGreen}` : '1.5px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '14px',
                padding: '16px 18px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 6px 20px rgba(39, 174, 96, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              {/* Badge Top Right */}
              {bundle.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-11px',
                    right: '18px',
                    backgroundColor: isSelected ? brandGreen : '#141210',
                    color: '#FFFFFF',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    padding: '3px 12px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  {bundle.badge}
                </div>
              )}

              {/* Radio + Info + Bottle Image Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Radio Custom Circle */}
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? brandGreen : '#AAA'}`,
                    backgroundColor: isSelected ? brandGreen : '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSelected && (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                  )}
                </div>

                {/* Bottle Thumbnail Image */}
                {bundle.image && (
                  <img
                    src={bundle.image}
                    alt={bundle.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      objectFit: 'contain',
                      flexShrink: 0,
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                    }}
                  />
                )}

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ fontSize: '15.5px', fontWeight: 900, color: '#141210' }}>
                      {bundle.deal}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '17px', fontWeight: 900, color: '#141210' }}>
                        {bundle.pricePerBottle}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#666', fontWeight: 600 }}>/bot.</span>
                      {bundle.originalTotal && (
                        <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through', marginLeft: '5px' }}>
                          {bundle.originalTotal}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#555', fontWeight: 600, marginTop: '2px' }}>
                    {bundle.bottles} • <strong style={{ color: '#141210' }}>{bundle.totalPrice} total</strong>
                  </div>

                  {/* Extra bonuses when selected */}
                  {isSelected && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(39, 174, 96, 0.15)' }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#27AE60', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ✓ {bundle.savings} Applied
                      </div>
                      {bundle.bonusText && (
                        <div style={{ fontSize: '11px', color: '#444', fontWeight: 600, marginTop: '2px' }}>
                          {bundle.bonusText}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Hero CTA Button */}
      <a
        href={selectedBundle.checkoutUrl}
        target="_top"
        rel="noopener"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: brandGreen,
          color: '#FFFFFF',
          fontSize: '15px',
          fontWeight: 900,
          letterSpacing: '0.04em',
          padding: '18px',
          borderRadius: '12px',
          textDecoration: 'none',
          textAlign: 'center',
          marginTop: '16px',
          boxShadow: '0 10px 25px rgba(39, 174, 96, 0.35)',
          transition: 'transform 0.2s ease',
          cursor: 'pointer'
        }}
      >
        {selectedBundle.ctaText || 'CLAIM MY BUNDLE (90-DAY RISK FREE) →'}
      </a>

      {/* Low Stock Warning Progress Bar Widget right below CTA button */}
      <LowStockProgressBar percentage={88} accentColor={brandGreen} />

      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11.5px', color: '#777', fontWeight: 700, letterSpacing: '0.04em' }}>
        🔒 SECURE CHECKOUT • FREE U.S. SHIPPING • 90-DAY GUARANTEE
      </div>
    </div>
  );
}
