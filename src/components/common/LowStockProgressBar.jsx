import React, { useState, useEffect } from 'react';

export function LowStockProgressBar({ accentColor }) {
  // Calculate dynamic realistic percentage based on current date
  const getDynamicPercentage = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Range: 76% to 92%, changes dynamically each calendar day
    const base = 76;
    const dailyOffset = (dayOfYear * 3) % 17;
    return Math.min(92, base + dailyOffset);
  };

  const targetPercentage = getDynamicPercentage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar fill from 0% to the dynamic daily percentage
    const timer = setTimeout(() => {
      setProgress(targetPercentage);
    }, 250);

    return () => clearTimeout(timer);
  }, [targetPercentage]);

  return (
    <div 
      className="low-stock-progress-bar-widget"
      style={{
        backgroundColor: '#FFF8F4',
        border: `1.5px solid ${accentColor || '#D96B32'}30`,
        borderRadius: '12px',
        padding: '14px 16px',
        marginTop: '14px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Header with proper flex spacing */}
      <div 
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
          fontSize: '12px',
          fontWeight: 900,
          letterSpacing: '0.04em',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ color: '#D96B32', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ⚡ LOW STOCK WARNING
        </span>
        <span style={{ color: '#141210', fontWeight: 900, marginLeft: 'auto' }}>
          {progress}% Claimed
        </span>
      </div>

      {/* Progress Bar Track */}
      <div 
        style={{
          width: '100%',
          height: '9px',
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Animated Bar Fill */}
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${accentColor || '#D96B32'} 0%, #27AE60 100%)`,
            borderRadius: '10px',
            transition: 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      <div 
        style={{ 
          fontSize: '11.5px', 
          color: '#555', 
          fontWeight: 600, 
          marginTop: '8px',
          textAlign: 'center',
          lineHeight: 1.35
        }}
      >
        {targetPercentage}% of today's manufacturing batch is already claimed. Orders placed today ship within 24h.
      </div>
    </div>
  );
}
