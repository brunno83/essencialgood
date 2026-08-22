import React, { useState } from 'react';

export function ProductFAQ({ faqSection, accentColor }) {
  const [openIdx, setOpenIdx] = useState(0);

  if (!faqSection || !faqSection.faqs) return null;
  const { tag, title, faqs } = faqSection;

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {tag && (
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 800, 
              letterSpacing: '0.14em', 
              color: accentColor || '#D96B32',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            {tag}
          </span>
        )}
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#141210', margin: 0 }}>
          {title}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
              }}
            >
              <button
                onClick={() => toggle(idx)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: isOpen ? (accentColor || '#D96B32') : '#141210',
                  gap: '12px'
                }}
              >
                <span>{faq.q}</span>
                <span style={{ fontSize: '18px', fontWeight: 400, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }}>
                  +
                </span>
              </button>
              {isOpen && (
                <div 
                  style={{ 
                    padding: '0 20px 20px 20px', 
                    fontSize: '14.5px', 
                    color: '#555', 
                    lineHeight: 1.6,
                    borderTop: '1px solid #FAF7F2'
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
