import React from 'react';
import { Leaf, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export function TrustStrip({ trustStrip, accentColor }) {
  if (!trustStrip || !trustStrip.items) return null;

  const icons = [Leaf, ShieldCheck, Truck, RotateCcw];

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
        {trustStrip.items.map((item, idx) => {
          const IconComponent = icons[idx % icons.length];
          return (
            <div key={idx} style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  backgroundColor: `${accentColor || '#D96B32'}15`,
                  color: accentColor || '#D96B32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}
              >
                <IconComponent size={20} />
              </div>
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
          );
        })}
      </div>
    </section>
  );
}
