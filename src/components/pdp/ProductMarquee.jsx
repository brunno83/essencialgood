import React from 'react';
import { Truck, ShieldCheck, Leaf, Star, Lock } from 'lucide-react';

export function ProductMarquee({ accentColor }) {
  const items = [
    { icon: Truck, text: 'FREE EXPEDITED U.S. SHIPPING ON ALL ORDERS TODAY' },
    { icon: ShieldCheck, text: '90-DAY MONEY-BACK GUARANTEE' },
    { icon: Leaf, text: '100% PLANT-BASED & LAB-TESTED FORMULATION' },
    { icon: Star, text: 'OVER 17,000+ VERIFIED 5-STAR REVIEWS' },
    { icon: Lock, text: '100% SECURE CHECKOUT' }
  ];

  const renderContent = () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '32px', paddingRight: '32px' }}>
      {items.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
            <IconComponent size={13} style={{ flexShrink: 0 }} />
            <span>{item.text}</span>
            <span style={{ opacity: 0.5, marginLeft: '24px' }}>•</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div 
      className="product-top-marquee"
      style={{
        backgroundColor: accentColor || '#D96B32',
        color: '#FFFFFF',
        fontSize: '11px',
        fontWeight: 900,
        letterSpacing: '0.08em',
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
          animation: 'marqueeLoop 32s linear infinite'
        }}
      >
        {renderContent()}
        {renderContent()}
        {renderContent()}
        {renderContent()}
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
