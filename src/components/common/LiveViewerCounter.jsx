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
        padding: '7px 12px',
        marginBottom: '16px'
      }}
    >
      <span 
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#E74C3C',
          display: 'inline-block',
          boxShadow: '0 0 0 0 rgba(231, 76, 60, 0.7)',
          animation: 'pulseDot 1.8s infinite'
        }}
      />
      <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#141210', letterSpacing: '0.01em' }}>
        🔥 <span style={{ color: accentColor || '#D96B32' }}>{count} people</span> are viewing this offer right now
      </span>

      <style>{`
        @keyframes pulseDot {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(231, 76, 60, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
          }
        }
      `}</style>
    </div>
  );
}
