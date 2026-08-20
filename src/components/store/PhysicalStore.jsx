import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONTENT } from '../../config/content';
import { CTAButton } from '../common/CTAButton';

export const PhysicalStore = () => {
  const { physicalStore } = BRAND_CONTENT;
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80";
  const customImage = "/assets/store/store_flagship_sanctuary.png";
  const customMobileImage = "/assets/store/store_flagship_sanctuary_mobile.png";

  return (
    <section
      id="physical-store"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        {/* Top Header & Copy Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'end',
            marginBottom: '4rem',
          }}
        >
          <div>
            <span className="text-eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
              PHYSICAL PRESENCE
            </span>

            <h2
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontFamily: 'var(--font-brand-display)',
                lineHeight: 1.1,
                color: 'var(--color-primary)',
                whiteSpace: 'normal',
                maxWidth: '650px',
              }}
            >
              GOODNESS, MADE REAL.
            </h2>
          </div>

          <div>
            <p
              className="text-body"
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-secondary)',
                marginBottom: '2rem',
                maxWidth: '540px',
              }}
            >
              {physicalStore.copy}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <CTAButton href="#physical-store" variant="primary">
                {physicalStore.cta}
              </CTAButton>
              <CTAButton href="#physical-store" variant="outline">
                {physicalStore.secondaryCta}
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Large Flagship Store Architectural Image with Responsive Picture */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            maxHeight: '620px',
            backgroundColor: '#F6FFFC',
            border: '1px solid rgba(75, 104, 51, 0.18)',
            boxShadow: '0 20px 40px rgba(75, 104, 51, 0.08)',
          }}
          className="store-image-stage"
        >
          {!imageError ? (
            <motion.picture
              initial={{ scale: 1.08, opacity: 0.9 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'block', width: '100%', height: '100%' }}
            >
              <source media="(max-width: 768px)" srcSet={customMobileImage} />
              <source media="(max-width: 768px)" srcSet="/assets/store/store_flagship_sanctuary_mobile.jpg" />
              <img
                src={customImage}
                alt="Essencial Good Flagship Store"
                onError={() => setImageError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.92) contrast(1.02)',
                }}
              />
            </motion.picture>
          ) : (
            <img
              src={fallbackImage}
              alt="Essencial Good Flagship Store"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          )}

          {/* Overlay Floating Location Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              backgroundColor: 'rgba(246, 255, 252, 0.92)',
              backdropFilter: 'blur(16px)',
              padding: '1.25rem 1.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(75, 104, 51, 0.2)',
              maxWidth: '360px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            }}
            className="store-location-badge"
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--color-sage)',
                display: 'block',
                marginBottom: '0.35rem',
                textTransform: 'uppercase',
              }}
            >
              FLAGSHIP DESTINATION
            </span>
            <p
              style={{
                fontFamily: 'var(--font-brand-display)',
                fontSize: '1.25rem',
                color: 'var(--color-primary)',
                margin: 0,
              }}
            >
              Essencial Good Flagship Store
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .store-image-stage {
            max-height: 380px !important;
          }
          .store-location-badge {
            left: 1rem !important;
            bottom: 1rem !important;
            right: 1rem !important;
            max-width: none !important;
            padding: 1rem 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
};
