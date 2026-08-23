import React, { useState, useEffect } from 'react';

export function LiveViewerCounter({ accentColor }) {
  const [count, setCount] = useState(134);

  useEffect(() => {
    const interval = setInterval(() => {
      // Small realistic fluctuation between 118 and 162
      const delta = Math.floor(Math.random() * 7) - 3;
      setCount((prev) => {
        const next = prev + delta;
        if (next < 118) return 124;
        if (next > 165) return 152;
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#FFF8F4',
        border: `1px solid ${accentColor || '#D96B32'}25`,
        borderRadius: '8px',
        padding: '6px 12px',
        marginBottom: '16px'
      }}
    >
      {/* LIVE Badge */}
      <span 
        style={{ 
          backgroundColor: '#E74C3C', 
          color: '#FFFFFF', 
          fontSize: '10px', 
          fontWeight: 900, 
          letterSpacing: '0.08em',
          padding: '2px 7px',
          borderRadius: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <span 
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'inline-block',
            animation: 'pulseLiveDot 1.5s infinite'
          }}
        />
        LIVE
      </span>

      <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#141210', letterSpacing: '0.01em' }}>
        <span style={{ color: accentColor || '#D96B32' }}>{count} people</span> are viewing this offer right now
      </span>

      <style>{`
        @keyframes pulseLiveDot {
          0% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 0.3; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
