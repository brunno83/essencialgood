import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONTENT } from '../../config/content';

export const BrandStatement = () => {
  const { brandStatement } = BRAND_CONTENT;

  return (
    <section
      id="brand-statement"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '60vh',
      }}
    >
      <div className="container-narrow">
        {/* Subtle Botanical Sage Horizontal Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '1.5px',
            width: '120px',
            backgroundColor: 'var(--color-sage)',
            margin: '0 auto 3.5rem auto',
            transformOrigin: 'center',
          }}
        />

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
          style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: '2rem',
            fontFamily: 'var(--font-brand-display)',
            letterSpacing: '0.02em',
            color: 'var(--color-primary)',
          }}
        >
          {brandStatement.headline}
        </motion.h2>

        {/* Copy */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1.15rem, 2vw, 1.5rem)',
            color: 'var(--color-secondary)',
            fontWeight: 300,
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 3rem auto',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)',
          }}
        >
          "{brandStatement.copy}"
        </motion.p>

        {/* Signature Tagline */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-signature"
          style={{
            display: 'block',
            color: 'var(--color-sage)',
            fontWeight: 600,
          }}
        >
          {brandStatement.signature}
        </motion.span>

        {/* Bottom Horizontal Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '1px',
            width: '120px',
            backgroundColor: 'rgba(75, 104, 51, 0.2)',
            margin: '3.5rem auto 0 auto',
            transformOrigin: 'center',
          }}
        />
      </div>
    </section>
  );
};
