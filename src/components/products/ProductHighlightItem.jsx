import React from 'react';
import { motion } from 'framer-motion';
import { ProductPlaceholderVisual } from '../common/ProductPlaceholderVisual';
import { CTAButton } from '../common/CTAButton';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const ProductHighlightItem = ({ product, index }) => {
  const isEven = index % 2 === 0;

  const themeBgGradients = {
    slimsoda: 'linear-gradient(135deg, #FBF6EF 0%, #EEE9DE 100%)',
    linfaflow: 'linear-gradient(135deg, #F2F8F4 0%, #E3EDDC 100%)',
    sonnus: 'linear-gradient(135deg, #F0F3F9 0%, #E2E7F2 100%)',
    crowned: 'linear-gradient(135deg, #FAF4EF 0%, #EAE0D6 100%)',
  };

  const productHighlightsMap = {
    slimsoda: ['Metabolic Support', 'Convenient Daily Routine', 'Refreshingly Simple'],
    linfaflow: ['Natural Body Flow', 'Self-Care Essential', 'Thoughtful Balance'],
    sonnus: ['Nighttime Reset', 'Relaxation Support', 'Calming Evening Ritual'],
    crowned: ['Refined Hair Care', 'Daily Nourishment', 'Beauty Ritual'],
  };

  const highlights = productHighlightsMap[product.id] || ['Thoughtful Formula', 'Everyday Essential'];
  const bgStyle = themeBgGradients[product.id] || 'linear-gradient(135deg, #F6FFFC 0%, #EEE9DE 100%)';

  return (
    <div
      id={`highlight-${product.id}`}
      style={{
        minHeight: '65vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '5.5rem 0',
        background: bgStyle,
        borderBottom: '1px solid rgba(75, 104, 51, 0.12)',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow Shader */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: isEven ? '25%' : '75%',
          transform: 'translate(-50%, -50%)',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${product.accentColor}22 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4.5rem',
            alignItems: 'center',
          }}
        >
          {/* Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1 }}
            style={{
              order: isEven ? 1 : 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ProductPlaceholderVisual product={product} size="large" useHighlightImage={true} />
          </motion.div>

          {/* Copy Column */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              order: isEven ? 2 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  color: product.accentColor,
                  textTransform: 'uppercase',
                }}
              >
                {product.number} / {product.category}
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
                fontFamily: 'var(--font-brand-display)',
                lineHeight: 1.1,
                marginBottom: '1.25rem',
                color: 'var(--color-primary)',
              }}
            >
              {product.headline}
            </h2>

            <p
              className="text-body"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.6',
                color: 'var(--color-secondary)',
                marginBottom: '2rem',
                maxWidth: '520px',
              }}
            >
              {product.copy}
            </p>

            {/* Benefit Highlights Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '2.5rem' }}>
              {highlights.map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-primary)',
                    backgroundColor: 'rgba(246, 255, 252, 0.7)',
                    border: `1px solid ${product.accentColor}40`,
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Sparkles size={12} style={{ color: product.accentColor }} />
                  {item}
                </span>
              ))}
            </div>

            <CTAButton
              href={product.link}
              size="medium"
              style={{
                backgroundColor: product.accentColor,
                borderColor: product.accentColor,
                color: '#FFFFFF',
              }}
            >
              EXPLORE {product.name.toUpperCase()}
            </CTAButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
