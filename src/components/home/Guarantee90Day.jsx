import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONTENT } from '../../config/content';
import { CTAButton } from '../common/CTAButton';
import { ShieldCheck, RotateCcw, Clock } from 'lucide-react';

export const Guarantee90Day = () => {
  const { guarantee } = BRAND_CONTENT;
  const [badgeError, setBadgeError] = useState(false);

  const badgePath = '/assets/home/brand/guarantee_badge.png';

  const guaranteePillars = [
    { icon: Clock, title: '90 Full Days to Test', desc: 'Experience the results in your everyday routine without rush.' },
    { icon: ShieldCheck, title: '100% Risk-Free Commitment', desc: 'We stand behind the quality and purity of every formula.' },
    { icon: RotateCcw, title: 'Hassle-Free Returns', desc: 'If it doesn’t fit your routine, our care team makes returns simple.' },
  ];

  return (
    <section
      id="guarantee"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        {/* 2-Column Luxury Guarantee Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: '#F6FFFC',
            border: '1.5px solid rgba(75, 104, 51, 0.2)',
            borderRadius: '28px',
            boxShadow: '0 25px 60px rgba(75, 104, 51, 0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="guarantee-card-box"
        >
          {/* Ambient Background Radial Glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '25%',
              transform: 'translate(-50%, -50%)',
              width: '520px',
              height: '520px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(75, 104, 51, 0.16) 0%, transparent 70%)',
              filter: 'blur(55px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Left Column: Extra Large Guarantee Badge Showcase */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1.5 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '480px',
                  height: 'auto',
                  aspectRatio: '1 / 1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="guarantee-badge-container"
              >
                {!badgeError ? (
                  <img
                    src={badgePath}
                    alt="Essencial Good — 90 Day Guarantee Badge"
                    onError={() => setBadgeError(true)}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 25px 50px rgba(27, 38, 19, 0.2))',
                    }}
                  />
                ) : (
                  /* Fallback Badge */
                  <div
                    style={{
                      width: '280px',
                      height: '280px',
                      borderRadius: '50%',
                      border: '3px solid var(--color-sage)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-brand-display)', fontSize: '6rem', color: 'var(--color-primary)' }}>
                      90
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-sage)' }}>
                      DAY GUARANTEE
                    </span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column: Copy, Value Pillars & Action Button */}
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  color: 'var(--color-sage)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '1rem',
                }}
              >
                OUR PROMISE TO YOU
              </span>

              <h2
                style={{
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.85rem)',
                  fontFamily: 'var(--font-brand-display)',
                  lineHeight: 1.08,
                  marginBottom: '1.25rem',
                  color: 'var(--color-primary)',
                }}
              >
                {guarantee.headline}
              </h2>

              <p
                className="text-body"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  color: 'var(--color-secondary)',
                  marginBottom: '2rem',
                }}
              >
                "{guarantee.copy}"
              </p>

              {/* 3 Value Pillars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {guaranteePillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(75, 104, 51, 0.12)',
                          color: 'var(--color-sage)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '0.15rem',
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                            margin: '0 0 0.2rem 0',
                          }}
                        >
                          {pillar.title}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary)', margin: 0, lineHeight: 1.45 }}>
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Action Button */}
              <div>
                <CTAButton href="#guarantee-terms" size="large">
                  LEARN ABOUT OUR GUARANTEE
                </CTAButton>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  {guarantee.disclaimer}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .guarantee-card-box {
          padding: 4.5rem 4rem;
        }
        @media (max-width: 768px) {
          .guarantee-card-box {
            padding: 2.5rem 1.5rem !important;
          }
          .guarantee-badge-container {
            max-width: 280px !important;
            height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
};
