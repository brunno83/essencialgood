import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../../config/products';
import { BRAND_CONTENT } from '../../config/content';
import { CTAButton } from '../common/CTAButton';

export const FinalCTA = () => {
  const { finalCta } = BRAND_CONTENT;
  const [imageError, setImageError] = useState(false);

  const desktopImagePath = '/assets/brand/collection_full_lineup.png';
  const mobileImagePath = '/assets/brand/collection_full_lineup_mobile.png';

  return (
    <section
      id="final-cta"
      className="section-spacing"
      style={{
        backgroundColor: '#EEE9DE',
        color: 'var(--color-primary)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(75, 104, 51, 0.15)',
        textAlign: 'center',
        padding: '6rem 0',
      }}
    >
      {/* Giant Watermark Typography in Background (Estilo Revista de Luxo) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-brand-display)',
          fontSize: 'clamp(8rem, 20vw, 22rem)',
          color: 'var(--color-primary)',
          opacity: 0.045,
          fontWeight: 400,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 1,
        }}
      >
        ESSENCIAL GOOD
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        {/* Unified Studio Product Lineup Stage (Seamless Desktop / Mobile Responsive Picture) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: '920px',
            margin: '0 auto 3.5rem auto',
            position: 'relative',
          }}
        >
          {!imageError ? (
            /* Responsive Picture Element (Mobile vs Desktop image switching) */
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(27, 38, 19, 0.12)',
                border: '1px solid rgba(75, 104, 51, 0.18)',
                backgroundColor: '#F6FFFC',
              }}
            >
              <picture>
                <source media="(max-width: 768px)" srcSet={mobileImagePath} />
                <source media="(max-width: 768px)" srcSet="/assets/brand/collection_lineup_mobile.png" />
                <source media="(max-width: 768px)" srcSet="/assets/brand/collection_full_lineup_mobile.jpg" />
                <img
                  src={desktopImagePath}
                  alt="Essencial Good — Complete Wellness Collection Lineup"
                  onError={() => setImageError(true)}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '440px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </picture>
            </div>
          ) : (
            /* Seamless Multi-Product Studio Lineup Stage (Fallback) */
            <div
              style={{
                position: 'relative',
                padding: '3rem 2rem',
                borderRadius: '28px',
                backgroundColor: 'rgba(246, 255, 252, 0.65)',
                border: '1.5px solid rgba(75, 104, 51, 0.16)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 20px 45px rgba(27, 38, 19, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2.5rem',
                flexWrap: 'wrap',
                minHeight: '260px',
              }}
            >
              {/* Background Ambient Radial Glow */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at center, rgba(75, 104, 51, 0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              {PRODUCTS.map((product, idx) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.08, y: -10 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    position: 'relative',
                    zIndex: 2,
                    transform: idx % 2 === 0 ? 'translateY(-12px)' : 'translateY(12px)',
                  }}
                >
                  {/* Seamless Product Bottle with Multiply Blend */}
                  <div
                    style={{
                      height: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={product.imageBottle}
                      alt={product.name}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '150px',
                        objectFit: 'contain',
                        mixBlendMode: 'multiply',
                        filter: 'drop-shadow(0 15px 25px rgba(27, 38, 19, 0.15))',
                      }}
                    />
                  </div>

                  {/* Product Mini Name Badge */}
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      color: product.accentColor,
                      textTransform: 'uppercase',
                      backgroundColor: '#FFFFFF',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      border: `1px solid ${product.accentColor}30`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    {product.name}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Copy & CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ maxWidth: '680px', margin: '0 auto' }}
        >
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
            THE ESSENTIAL COLLECTION
          </span>

          <h2
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontFamily: 'var(--font-brand-display)',
              lineHeight: 1.08,
              marginBottom: '1.25rem',
              color: 'var(--color-primary)',
            }}
          >
            {finalCta.headline}
          </h2>

          <p
            className="text-lead"
            style={{
              color: 'var(--color-secondary)',
              marginBottom: '2.5rem',
              fontSize: '1.2rem',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
            }}
          >
            "{finalCta.copy}"
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <CTAButton
              href="#meet-essentials"
              size="large"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                borderColor: 'var(--color-primary)',
              }}
            >
              {finalCta.primaryCta}
            </CTAButton>

            <CTAButton
              href="#who-we-are"
              variant="outline"
              size="large"
              style={{
                color: 'var(--color-primary)',
                borderColor: 'rgba(27, 38, 19, 0.3)',
              }}
            >
              {finalCta.secondaryCta}
            </CTAButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
