import React from 'react';

export function ProductMarquee({ customText }) {
  const marqueeItems = [
    '⚡ FREE EXPEDITED U.S. SHIPPING ON ALL ORDERS TODAY',
    '🛡️ 90-DAY MONEY-BACK GUARANTEE',
    '🌿 100% PLANT-BASED & LAB-TESTED FORMULATION',
    '⭐ OVER 17,000+ VERIFIED 5-STAR REVIEWS',
    '🔒 100% SECURE CHECKOUT'
  ];

  const fullText = customText || marqueeItems.join('   •   ');

  return (
    <div 
      className="product-top-marquee"
      style={{
        backgroundColor: '#D96B32',
        color: '#141210',
        fontSize: '11.5px',
        fontWeight: 900,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 101,
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <div 
        className="marquee-track"
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          animation: 'marqueeLoop 30s linear infinite'
        }}
      >
        <span style={{ paddingRight: '40px' }}>{fullText}   •   {fullText}</span>
        <span style={{ paddingRight: '40px' }}>{fullText}   •   {fullText}</span>
      </div>

      <style>{`
        @keyframes marqueeLoop {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
