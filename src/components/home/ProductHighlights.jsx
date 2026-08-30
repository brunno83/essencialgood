import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { PRODUCTS } from '../../config/products';
import { ProductPlaceholderVisual } from '../common/ProductPlaceholderVisual';
import { CTAButton } from '../common/CTAButton';

export const ProductHighlights = ({ onSelectProduct }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Framer Motion Scroll Progress across the 400vh track (100vh per product)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Background gradient map for smooth ambient shifts
  const bgGradientMap = {
    slimsoda: 'linear-gradient(135deg, #FBF6EF 0%, #EEE9DE 100%)',
    linfaflow: 'linear-gradient(135deg, #F2F8F4 0%, #E3EDDC 100%)',
    sonnus: 'linear-gradient(135deg, #F0F3F9 0%, #E2E7F2 100%)',
    crowned: 'linear-gradient(135deg, #FAF4EF 0%, #EAE0D6 100%)',
  };

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Divide 0.0 - 1.0 into 4 distinct active zones
      const index = Math.min(3, Math.floor(latest * 4));
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const activeProduct = PRODUCTS[activeIndex] || PRODUCTS[0];
  const currentBg = bgGradientMap[activeProduct.id] || bgGradientMap.slimsoda;

  return (
    <section
      ref={containerRef}
      id="product-highlights"
      style={{
        position: 'relative',
        height: '400vh', // 400vh scroll track: 100vh for each of the 4 products
        backgroundColor: 'var(--bg-page)',
      }}
    >
      {/* Sticky Viewport Container — Pinned in Screen View */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: currentBg,
          transition: 'background 0.8s ease',
          borderBottom: '1px solid rgba(75, 104, 51, 0.12)',
        }}
        className="highlights-sticky-stage"
      >
        {/* Dynamic Background Ambient Shader Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${activeProduct.accentColor}25 0%, transparent 70%)`,
            filter: 'blur(70px)',
            transition: 'background 0.8s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Big Numeral Watermark in Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`watermark-${activeProduct.id}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.06, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              right: '8%',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-brand-display)',
              fontSize: 'clamp(18rem, 35vw, 32rem)',
              color: activeProduct.accentColor,
              fontWeight: 400,
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 1,
              lineHeight: 1,
            }}
          >
            {activeProduct.number}
          </motion.div>
        </AnimatePresence>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
            className="highlights-grid-container"
          >
            {/* Left Column: Fixed Center Bottle Visual Stage */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, scale: 0.85, y: 40, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -40, rotate: 3 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ProductPlaceholderVisual product={activeProduct} size="large" useHighlightImage={true} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Dynamic Narrative Storytelling */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${activeProduct.id}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Category Pill Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }} className="highlight-tag-box">
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.25em',
                        color: activeProduct.accentColor,
                        textTransform: 'uppercase',
                        backgroundColor: `${activeProduct.accentColor}15`,
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        border: `1px solid ${activeProduct.accentColor}30`,
                      }}
                    >
                      {activeProduct.number} / {activeProduct.category}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2
                    className="highlight-headline"
                    style={{
                      fontSize: 'clamp(1.75rem, 4vw, 3.75rem)',
                      fontFamily: 'var(--font-brand-display)',
                      lineHeight: 1.08,
                      marginBottom: '1rem',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {activeProduct.headline}
                  </h2>

                  {/* Description Copy */}
                  <p
                    className="text-body highlight-copy"
                    style={{
                      fontSize: '1.05rem',
                      lineHeight: '1.55',
                      color: 'var(--color-secondary)',
                      marginBottom: '1.75rem',
                      maxWidth: '520px',
                    }}
                  >
                    {activeProduct.copy}
                  </p>

                  {/* CTA Button */}
                  <CTAButton
                    onClick={(e) => {
                      if (e) e.preventDefault();
                      if (onSelectProduct) {
                        onSelectProduct(activeProduct.id);
                      }
                    }}
                    href={activeProduct.link}
                    size="large"
                    style={{
                      backgroundColor: activeProduct.accentColor,
                      borderColor: activeProduct.accentColor,
                      color: '#FFFFFF',
                    }}
                  >
                    EXPLORE {activeProduct.name.toUpperCase()}
                  </CTAButton>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Scroll Progress Step Indicator Bar at Bottom of Section */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 20,
          }}
        >
          {PRODUCTS.map((p, i) => (
            <div
              key={p.id}
              style={{
                width: activeIndex === i ? '32px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeIndex === i ? p.accentColor : 'rgba(75, 104, 51, 0.2)',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .highlights-sticky-stage {
            padding: 1.5rem 0 !important;
          }
          .highlights-grid-container {
            gap: 1rem !important;
          }
          .highlights-grid-container .product-visual-wrapper {
            max-width: 210px !important;
            height: 280px !important;
          }
          .highlight-headline {
            font-size: 1.65rem !important;
            margin-bottom: 0.5rem !important;
            line-height: 1.15 !important;
          }
          .highlight-copy {
            font-size: 0.925rem !important;
            line-height: 1.4 !important;
            margin-bottom: 1.15rem !important;
          }
          .highlight-tag-box {
            margin-bottom: 0.4rem !important;
          }
        }
      `}</style>
    </section>
  );
};
