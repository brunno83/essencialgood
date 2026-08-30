import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_CONTENT } from '../../config/content';
import { SectionHeading } from '../common/SectionHeading';
import { Plus, Minus } from 'lucide-react';

export const FAQ = () => {
  const { faq } = BRAND_CONTENT;
  const [openId, setOpenId] = useState('faq-1');

  const toggleAccordion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
      }}
    >
      <div className="container-narrow">
        <SectionHeading
          eyebrow="SUPPORT & CLARITY"
          title={faq.headline}
          subheadline="Everything you need to know about our products, routine philosophy, shipping and guarantees."
        />

        {/* Accordion Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '3.5rem',
          }}
        >
          {faq.items.map((item, index) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isOpen ? '#F6FFFC' : 'rgba(255, 255, 255, 0.4)',
                  border: isOpen
                    ? '1.5px solid var(--color-sage)'
                    : '1px solid rgba(75, 104, 51, 0.15)',
                  boxShadow: isOpen ? '0 10px 25px rgba(75, 104, 51, 0.06)' : 'none',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  style={{
                    width: '100%',
                    padding: '1.5rem 1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-brand-display)',
                    fontSize: '1.25rem',
                    fontWeight: 400,
                    cursor: 'pointer',
                  }}
                >
                  <span>{item.question}</span>

                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? 'var(--color-sage)' : 'rgba(75, 104, 51, 0.1)',
                      color: isOpen ? '#F6FFFC' : 'var(--color-sage)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div
                        style={{
                          padding: '0 1.75rem 1.75rem 1.75rem',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.975rem',
                          lineHeight: '1.65',
                          color: 'var(--color-secondary)',
                          borderTop: '1px solid rgba(75, 104, 51, 0.1)',
                          paddingTop: '1.25rem',
                        }}
                      >
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
