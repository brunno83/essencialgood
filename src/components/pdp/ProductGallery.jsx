import React, { useState } from 'react';

export function ProductGallery({ gallery = [], accentColor }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!gallery.length) return null;
  const current = gallery[activeIdx] || gallery[0];

  return (
    <div className="pdp-gallery-container" style={{ width: '100%' }}>
      {/* Main Image Stage - Edge to Edge, Full Resolution */}
      <div 
        className="pdp-gallery-stage"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF',
          position: 'relative'
        }}
      >
        <img
          src={current.src}
          alt={current.caption || current.label || 'Product Image'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.25s ease'
          }}
        />
      </div>

      {/* Carousel Thumbnails */}
      <div 
        className="pdp-gallery-thumbs"
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '16px',
          overflowX: 'auto',
          paddingBottom: '6px'
        }}
      >
        {gallery.map((item, idx) => (
          <button
            key={item.id || idx}
            onClick={() => setActiveIdx(idx)}
            style={{
              flex: '0 0 76px',
              height: '76px',
              borderRadius: '12px',
              border: idx === activeIdx ? `3px solid ${accentColor || '#D96B32'}` : '1.5px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: '#FFFFFF',
              padding: 0,
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              opacity: idx === activeIdx ? 1 : 0.6,
              transform: idx === activeIdx ? 'scale(1.04)' : 'none',
              boxShadow: idx === activeIdx ? '0 4px 14px rgba(0,0,0,0.12)' : 'none'
            }}
          >
            <img 
              src={item.src} 
              alt={item.label} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
