import React from 'react';

export function CustomerReviews({ reviewsSection, accentColor }) {
  if (!reviewsSection) return null;
  const { tag, title, ratingText, disclaimer, reviews } = reviewsSection;

  return (
    <section style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
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
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#141210', margin: '0 0 8px' }}>
          {title}
        </h2>
        {ratingText && (
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#F5A623', letterSpacing: '0.04em' }}>
            {ratingText}
          </div>
        )}
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        {reviews.map((review, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ color: '#F5A623', fontSize: '14px', marginBottom: '10px' }}>
                {'★'.repeat(review.stars || 5)}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#141210', margin: '0 0 10px' }}>
                {review.quote}
              </h3>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>
                {review.body}
              </p>
            </div>
            <div 
              style={{ 
                marginTop: '18px', 
                fontSize: '12.5px', 
                fontWeight: 700, 
                color: '#27AE60',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>✓</span> {review.author}
            </div>
          </div>
        ))}
      </div>

      {disclaimer && (
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
          {disclaimer}
        </div>
      )}
    </section>
  );
}
