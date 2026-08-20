import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONTENT } from '../../config/content';
import { CTAButton } from '../common/CTAButton';

export const WhoWeAre = () => {
  const { whoWeAre } = BRAND_CONTENT;
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80";
  const customImage = "/assets/brand/who_we_are_lifestyle.png";

  return (
    <section
      id="who-we-are"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderTop: '1px solid rgba(75, 104, 51, 0.12)',
        borderBottom: '1px solid rgba(75, 104, 51, 0.12)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Premium Editorial Image (Zero White Space Container) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(75, 104, 51, 0.1)',
              backgroundColor: '#F6FFFC',
              border: '1px solid rgba(75, 104, 51, 0.18)',
              display: 'flex',
            }}
          >
            <img
              src={imageError ? fallbackImage : customImage}
              alt="Essencial Good Wellness Lifestyle"
              onError={() => setImageError(true)}
              style={{
                width: '100%',
                height: '100%',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.95) contrast(1.02)',
              }}
            />

            {/* Subtle Overlay Badge — 100% Centered */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0.5rem 1.1rem',
                backgroundColor: 'rgba(246, 255, 252, 0.92)',
                backdropFilter: 'blur(12px)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(75, 104, 51, 0.2)',
                fontSize: '0.675rem',
                letterSpacing: '0.15em',
                color: 'var(--color-sage)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                zIndex: 2,
              }}
              className="who-we-are-badge"
            >
              ESSENCIAL GOOD — OUR PURPOSE
            </div>
          </motion.div>

          {/* Right Column: Narrative Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
              WHO WE ARE
            </span>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3.25rem)',
                marginBottom: '2rem',
                fontFamily: 'var(--font-brand-display)',
                lineHeight: 1.15,
                color: 'var(--color-primary)',
              }}
            >
              {whoWeAre.headline}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {whoWeAre.copyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-body"
                  style={{
                    fontSize: index === 0 ? '1.125rem' : '1rem',
                    color: index === 0 ? 'var(--color-primary)' : 'var(--color-secondary)',
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <CTAButton href="#our-story" variant="secondary">
              {whoWeAre.cta}
            </CTAButton>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .who-we-are-badge {
            bottom: 0.85rem !important;
            font-size: 0.6rem !important;
            padding: 0.35rem 0.75rem !important;
            letter-spacing: 0.1em !important;
          }
        }
      `}</style>
    </section>
  );
};
