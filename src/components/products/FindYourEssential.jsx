import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../../config/products';
import { BRAND_CONTENT } from '../../config/content';
import { SectionHeading } from '../common/SectionHeading';
import { ProductPlaceholderVisual } from '../common/ProductPlaceholderVisual';
import { CTAButton } from '../common/CTAButton';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const FindYourEssential = () => {
  const { findYourEssential } = BRAND_CONTENT;
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);

  return (
    <section
      id="find-essential"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
      }}
    >
      <div className="container" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        <SectionHeading
          eyebrow="ROUTINE SELECTOR"
          title={findYourEssential.headline}
          subheadline={findYourEssential.subheadline}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            marginTop: '3.5rem',
          }}
          className="selector-grid-container"
        >
          {/* Left Column: Interactive Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {PRODUCTS.map((prod) => {
              const isActive = activeProduct.id === prod.id;

              return (
                <motion.div
                  key={prod.id}
                  onClick={() => setActiveProduct(prod)}
                  onMouseEnter={() => setActiveProduct(prod)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: isActive ? '#FFFFFF' : 'rgba(246, 255, 252, 0.5)',
                    border: isActive
                      ? `1.5px solid ${prod.accentColor}`
                      : '1px solid rgba(75, 104, 51, 0.14)',
                    borderLeft: isActive ? `5px solid ${prod.accentColor}` : '1px solid rgba(75, 104, 51, 0.14)',
                    boxShadow: isActive ? `0 15px 35px ${prod.accentColor}15` : 'none',
                    textDecoration: 'none',
                    color: 'var(--color-primary)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    maxWidth: '100%',
                  }}
                  className="selector-card-item"
                >
                  <div style={{ paddingRight: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.18em',
                          color: isActive ? prod.accentColor : 'var(--color-sage)',
                          textTransform: 'uppercase',
                        }}
                      >
                        FOR YOUR {prod.category}
                      </span>
                      {isActive && (
                        <span
                          style={{
                            fontSize: '0.575rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            backgroundColor: `${prod.accentColor}18`,
                            color: prod.accentColor,
                            padding: '0.12rem 0.45rem',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                        >
                          <Sparkles size={9} /> ACTIVE MATCH
                        </span>
                      )}
                    </div>

                    <h3
                      className="selector-card-title"
                      style={{
                        fontFamily: 'var(--font-brand-display)',
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        lineHeight: 1.15,
                        marginBottom: isActive ? '0.35rem' : '0',
                        color: 'var(--color-primary)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {prod.selectorLabel}
                    </h3>

                    {isActive && (
                      <p
                        className="text-body"
                        style={{
                          fontSize: '0.825rem',
                          color: 'var(--color-secondary)',
                          margin: 0,
                          lineHeight: '1.35',
                        }}
                      >
                        Match: <strong>{prod.name}</strong> — {prod.tagline}
                      </p>
                    )}
                  </div>

                  <a
                    href={prod.link}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? prod.accentColor : 'rgba(75, 104, 51, 0.1)',
                      color: isActive ? '#FFFFFF' : 'var(--color-sage)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.4s ease',
                      textDecoration: 'none',
                    }}
                    className="selector-arrow-btn"
                  >
                    <ArrowUpRight size={17} />
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: 100% Uncropped Square 1:1 Showcase Card Stage */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(27, 38, 19, 0.12)',
              border: `1.5px solid ${activeProduct.accentColor}35`,
              backgroundColor: '#FFFFFF',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* 100% Square 1:1 Photo Frame (Zero Crop, Zero Overlap!) */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '18px',
                overflow: 'hidden',
                backgroundColor: '#F6FFFC',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <ProductPlaceholderVisual
                    product={activeProduct}
                    size="hero"
                    useSelectorImage={true}
                    fullBleed={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Product Match Info Console (Pure White Panel Below Photo) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${activeProduct.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.22em',
                      color: activeProduct.accentColor,
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      display: 'block',
                      marginBottom: '0.35rem',
                    }}
                  >
                    RECOMMENDED ESSENTIAL FOR YOUR {activeProduct.category}
                  </span>
                  
                  <h4
                    style={{
                      fontFamily: 'var(--font-brand-display)',
                      fontSize: '2.1rem',
                      color: 'var(--color-primary)',
                      margin: '0 0 0.35rem 0',
                      lineHeight: 1.1,
                    }}
                  >
                    {activeProduct.name}
                  </h4>

                  <p
                    className="text-body"
                    style={{
                      fontSize: '0.925rem',
                      color: 'var(--color-secondary)',
                      margin: 0,
                      lineHeight: '1.5',
                    }}
                  >
                    {activeProduct.tagline}
                  </p>
                </div>

                <CTAButton
                  href={activeProduct.link}
                  size="medium"
                  style={{
                    width: '100%',
                    backgroundColor: activeProduct.accentColor,
                    borderColor: activeProduct.accentColor,
                    color: '#FFFFFF',
                  }}
                >
                  DISCOVER {activeProduct.name.toUpperCase()}
                </CTAButton>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .selector-card-item {
          padding: 1.35rem 1.5rem;
        }
        @media (max-width: 640px) {
          .selector-card-item {
            padding: 1rem 1.15rem !important;
          }
          .selector-card-title {
            font-size: 1.1rem !important;
          }
          .selector-arrow-btn {
            width: 34px !important;
            height: 34px !important;
          }
        }
      `}</style>
    </section>
  );
};
