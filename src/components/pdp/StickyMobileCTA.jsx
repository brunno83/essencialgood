import React, { useState, useEffect } from 'react';

export function StickyMobileCTA({ product, accentColor }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling down 400px
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBundles = () => {
    const el = document.getElementById('bundles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!visible || !product) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 9999,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div>
        <div style={{ fontSize: '13px', fontWeight: 900, color: '#141210' }}>
          {product.brand}
        </div>
        <div style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>
          From {product.startingPrice}/bottle
        </div>
      </div>

      <button
        onClick={scrollToBundles}
        style={{
          backgroundColor: accentColor || '#D96B32',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 18px',
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '0.04em',
          cursor: 'pointer'
        }}
      >
        CHOOSE BUNDLE
      </button>
    </div>
  );
}
