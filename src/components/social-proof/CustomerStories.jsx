import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONTENT } from '../../config/content';
import { SectionHeading } from '../common/SectionHeading';
import { Star, CheckCircle2 } from 'lucide-react';

export const CustomerStories = () => {
  const { customerStories } = BRAND_CONTENT;
  const [isPausedRow1, setIsPausedRow1] = useState(false);
  const [isPausedRow2, setIsPausedRow2] = useState(false);

  // Split 10 testimonials into 2 groups of 5
  const row1Testimonials = customerStories.testimonials.slice(0, 5);
  const row2Testimonials = customerStories.testimonials.slice(5, 10);

  // Duplicate for seamless 100% infinite loop
  const doubleRow1 = [...row1Testimonials, ...row1Testimonials, ...row1Testimonials];
  const doubleRow2 = [...row2Testimonials, ...row2Testimonials, ...row2Testimonials];

  return (
    <section
      id="customer-stories"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <SectionHeading
          eyebrow="COMMUNITY & TESTIMONIALS"
          title={customerStories.headline}
          subheadline={customerStories.subheadline}
        />

        {/* Overall Rating & Verification Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginBottom: '3.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Star Rating Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="#4B6833" style={{ color: '#4B6833' }} />
            ))}
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--color-primary)',
                marginLeft: '0.35rem',
              }}
            >
              {customerStories.overallRating} / 5.0
            </span>
          </div>

          <span style={{ color: 'rgba(75, 104, 51, 0.3)' }}>|</span>

          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--color-secondary)',
            }}
          >
            OVER {customerStories.totalReviews} VERIFIED US REVIEWS
          </span>
        </div>
      </div>

      {/* Dual Bidirectional Infinite Marquee Container */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          padding: '1rem 0',
        }}
      >
        {/* Left & Right Edge Gradient Fading Masks */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '140px',
            background: 'linear-gradient(to right, #EEE9DE 0%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '140px',
            background: 'linear-gradient(to left, #EEE9DE 0%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />

        {/* ROW 1: Moving Right to Left (Direita para Esquerda) */}
        <div
          onMouseEnter={() => setIsPausedRow1(true)}
          onMouseLeave={() => setIsPausedRow1(false)}
          style={{ width: '100%', overflow: 'hidden', cursor: 'grab' }}
        >
          <motion.div
            animate={isPausedRow1 ? {} : { x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear',
            }}
            style={{
              display: 'flex',
              gap: '1.5rem',
              width: 'max-content',
            }}
          >
            {doubleRow1.map((t, index) => (
              <TestimonialCard key={`r1-${t.id}-${index}`} testimonial={t} />
            ))}
          </motion.div>
        </div>

        {/* ROW 2: Moving Left to Right (Esquerda para Direita - Sentido Oposto!) */}
        <div
          onMouseEnter={() => setIsPausedRow2(true)}
          onMouseLeave={() => setIsPausedRow2(false)}
          style={{ width: '100%', overflow: 'hidden', cursor: 'grab' }}
        >
          <motion.div
            animate={isPausedRow2 ? {} : { x: ['-50%', '0%'] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear',
            }}
            style={{
              display: 'flex',
              gap: '1.5rem',
              width: 'max-content',
            }}
          >
            {doubleRow2.map((t, index) => (
              <TestimonialCard key={`r2-${t.id}-${index}`} testimonial={t} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Micro Notice Below Carousel */}
      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <span
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            color: 'var(--color-sage)',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          HOVER OVER ANY REVIEW TO PAUSE & READ
        </span>
      </div>
    </section>
  );
};

/* Individual Luxury Testimonial Card Component */
const TestimonialCard = ({ testimonial: t }) => {
  return (
    <div
      style={{
        flex: '0 0 350px',
        backgroundColor: '#F6FFFC',
        border: '1px solid rgba(75, 104, 51, 0.16)',
        borderRadius: '20px',
        padding: '2rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 10px 30px rgba(75, 104, 51, 0.05)',
        minHeight: '250px',
        transition: 'all 0.3s ease',
      }}
    >
      <div>
        {/* Card Top: 5 Stars & Verified Stamp */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.15rem',
          }}
        >
          <div style={{ display: 'flex', gap: '3px' }}>
            {[...Array(t.rating)].map((_, i) => (
              <Star key={i} size={14} fill="#4B6833" style={{ color: '#4B6833' }} />
            ))}
          </div>

          {t.verified && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'var(--color-sage)',
                letterSpacing: '0.08em',
                backgroundColor: 'rgba(75, 104, 51, 0.08)',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
              }}
            >
              <CheckCircle2 size={12} /> VERIFIED
            </div>
          )}
        </div>

        {/* Review Quote Body */}
        <blockquote
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.15rem',
            lineHeight: 1.45,
            color: 'var(--color-primary)',
            fontStyle: 'italic',
            marginBottom: '1.5rem',
            margin: 0,
          }}
        >
          "{t.quote}"
        </blockquote>
      </div>

      {/* Author Info Footer */}
      <div
        style={{
          borderTop: '1px solid rgba(75, 104, 51, 0.1)',
          paddingTop: '1rem',
        }}
      >
        <h5
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            margin: 0,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          {t.author}
        </h5>

        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-secondary)',
            display: 'block',
            marginTop: '0.2rem',
            whiteSpace: 'nowrap',
          }}
        >
          {t.location} • {t.date}
        </span>
      </div>
    </div>
  );
};
