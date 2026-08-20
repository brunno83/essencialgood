import React, { useState, useEffect } from 'react';
import { CTAButton } from './CTAButton';

/**
 * Countdown Promo Banner Component
 * Placed directly below the Hero section.
 * Configured with live ticking timer, 100% centered layout, and clean editorial luxury styling.
 */
export const CountdownBanner = ({
  initialHours = 12,
  initialMinutes = 45,
  initialSeconds = 0,
  headline = 'SPECIAL LAUNCH OFFER — LIMITED ESSENTIAL ALLOCATION',
  ctaText = 'EXPLORE OFFER',
  ctaLink = '#meet-essentials',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }; // Reset loop for demo
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div
      id="countdown-banner"
      style={{
        backgroundColor: '#1B2613',
        color: '#F6FFFC',
        padding: '1.5rem 1rem',
        borderTop: '1px solid rgba(246, 255, 252, 0.15)',
        borderBottom: '1px solid rgba(75, 104, 51, 0.3)',
        position: 'relative',
        zIndex: 20,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          gap: '1.25rem',
        }}
      >
        {/* Headline Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.675rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: '#8E9A85',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.35rem',
            }}
          >
            LIMITED TIME OFFER
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)',
              color: '#F6FFFC',
              margin: 0,
              fontWeight: 400,
              letterSpacing: '0.02em',
              lineHeight: 1.3,
            }}
          >
            {headline}
          </h3>
        </div>

        {/* Ticking Countdown Clock Display & CTA Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          {/* Digits Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            {/* Hours Block */}
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(246, 255, 252, 0.08)',
                  border: '1px solid rgba(142, 154, 133, 0.3)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  color: '#F6FFFC',
                  letterSpacing: '0.05em',
                  minWidth: '44px',
                  display: 'inline-block',
                }}
              >
                {formatNumber(timeLeft.hours)}
              </span>
              <span style={{ fontSize: '0.575rem', color: '#8E9A85', display: 'block', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>HRS</span>
            </div>

            <span style={{ color: '#8E9A85', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.8rem' }}>:</span>

            {/* Minutes Block */}
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(246, 255, 252, 0.08)',
                  border: '1px solid rgba(142, 154, 133, 0.3)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  color: '#F6FFFC',
                  letterSpacing: '0.05em',
                  minWidth: '44px',
                  display: 'inline-block',
                }}
              >
                {formatNumber(timeLeft.minutes)}
              </span>
              <span style={{ fontSize: '0.575rem', color: '#8E9A85', display: 'block', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>MIN</span>
            </div>

            <span style={{ color: '#8E9A85', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.8rem' }}>:</span>

            {/* Seconds Block */}
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(75, 104, 51, 0.4)',
                  border: '1px solid #4B6833',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  color: '#F6FFFC',
                  letterSpacing: '0.05em',
                  minWidth: '44px',
                  display: 'inline-block',
                }}
              >
                {formatNumber(timeLeft.seconds)}
              </span>
              <span style={{ fontSize: '0.575rem', color: '#8E9A85', display: 'block', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SEC</span>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <CTAButton href={ctaLink} size="small" style={{ backgroundColor: '#4B6833', color: '#F6FFFC' }}>
              {ctaText}
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};
