import React, { useState } from 'react';

export function ProductGallery({ gallery = [], accentColor }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!gallery.length) return null;
  const current = gallery[activeIdx] || gallery[0];

  return (
    <div className="pdp-gallery-container" style={{ width: '100%' }}>
      {/* Main Image Stage */}
      <div 
        className="pdp-gallery-stage"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          maxHeight: '440px',
          backgroundColor: '#FAF7F2',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
        }}
      >
        <img
          src={current.src}
          alt={current.caption || current.label}
          style={{
            maxWidth: '85%',
            maxHeight: '75%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.12))',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <span 
            style={{ 
              fontSize: '11px', 
              letterSpacing: '0.12em', 
              fontWeight: 700, 
              color: accentColor || '#D96B32',
              textTransform: 'uppercase',
              display: 'block'
            }}
          >
            {current.label}
          </span>
          <span style={{ fontSize: '13px', color: '#666', fontWeight: 500, marginTop: '2px', display: 'block' }}>
            {current.subtitle}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div 
        className="pdp-gallery-thumbs"
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '14px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}
      >
        {gallery.map((item, idx) => (
          <button
            key={item.id || idx}
            onClick={() => setActiveIdx(idx)}
            style={{
              flex: '0 0 70px',
              height: '70px',
              borderRadius: '10px',
              border: idx === activeIdx ? `2px solid ${accentColor || '#D96B32'}` : '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: '#FFFFFF',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              opacity: idx === activeIdx ? 1 : 0.65,
              transform: idx === activeIdx ? 'scale(1.02)' : 'none'
            }}
          >
            <img 
              src={item.src} 
              alt={item.label} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
