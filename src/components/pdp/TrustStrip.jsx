import React from 'react';

export function TrustStrip({ trustStrip, accentColor }) {
  if (!trustStrip || !trustStrip.items) return null;

  return (
    <section 
      style={{ 
        backgroundColor: '#FAF7F2', 
        borderTop: '1px solid #EFEAE1',
        borderBottom: '1px solid #EFEAE1',
        padding: '36px 20px' 
      }}
    >
      <div 
        style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}
      >
        {trustStrip.items.map((item, idx) => (
          <div key={idx} style={{ padding: '8px' }}>
            <div 
              style={{ 
                fontSize: '13px', 
                fontWeight: 800, 
                letterSpacing: '0.08em', 
                color: accentColor || '#D96B32',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}
            >
              {item.title}
            </div>
            <div style={{ fontSize: '13.5px', color: '#555', fontWeight: 500, lineHeight: 1.4 }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
