import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../../config/products';
import { BRAND_CONTENT } from '../../config/content';
import { SectionHeading } from '../common/SectionHeading';
import { ProductPlaceholderVisual } from '../common/ProductPlaceholderVisual';
import { CTAButton } from '../common/CTAButton';

export const EssentialsOverview = () => {
  const { meetEssentials } = BRAND_CONTENT;
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section
      id="meet-essentials"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
      }}
    >
      <div className="container">
        <SectionHeading
          eyebrow="THE COLLECTION"
          title={meetEssentials.headline}
          subheadline={meetEssentials.subheadline}
        />

        {/* Luxury E-Commerce Responsive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.75rem',
            marginTop: '3.5rem',
          }}
        >
          {PRODUCTS.map((product, index) => {
            const isHovered = hoveredId === product.id;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: 'relative',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#F6FFFC',
                  border: isHovered
                    ? `1.5px solid ${product.accentColor}`
                    : '1px solid rgba(75, 104, 51, 0.16)',
                  boxShadow: isHovered
                    ? `0 20px 45px rgba(27, 38, 19, 0.12)`
                    : '0 8px 24px rgba(75, 104, 51, 0.04)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Top Card Bar: Number & Category Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--color-sage)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {product.number}
                    </span>

                    <span
                      style={{
                        fontSize: '0.675rem',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isHovered ? product.accentColor : 'rgba(75, 104, 51, 0.08)',
                        color: isHovered ? '#FFFFFF' : 'var(--color-sage)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {product.category}
                    </span>
                  </div>

                  {/* Product Image Stage (Seamless E-Commerce Stage with Multiply Blend) */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(75, 104, 51, 0.08)',
                      padding: '1rem 0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      marginBottom: '1.25rem',
                      overflow: 'hidden',
                      height: '210px',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <ProductPlaceholderVisual product={product} size="medium" />
                    </div>
                  </div>

                  {/* Product Title & Description */}
                  <div style={{ textAlign: 'left' }}>
                    <h3
                      style={{
                        fontSize: '1.45rem',
                        fontFamily: 'var(--font-brand-display)',
                        marginBottom: '0.5rem',
                        color: 'var(--color-primary)',
                        lineHeight: 1.2,
                      }}
                    >
                      {product.name}
                    </h3>

                    <p
                      className="text-body"
                      style={{
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        color: 'var(--color-secondary)',
                        minHeight: '2.6em',
                        marginBottom: '1.5rem',
                      }}
                    >
                      {product.tagline}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div>
                  <CTAButton
                    href={product.link}
                    variant={isHovered ? 'primary' : 'outline'}
                    size="small"
                    style={{
                      width: '100%',
                      borderColor: isHovered ? product.accentColor : 'rgba(75, 104, 51, 0.3)',
                      backgroundColor: isHovered ? product.accentColor : 'transparent',
                      color: isHovered ? '#FFFFFF' : 'var(--color-primary)',
                    }}
                  >
                    EXPLORE {product.name.toUpperCase()}
                  </CTAButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
