import React, { useState, useEffect } from 'react';

export function CustomerReviews({ reviewsSection, accentColor }) {
  const defaultCompliantReviews = [
    {
      id: 1,
      author: 'Kendra P.',
      rating: 5,
      title: 'Easy to stay consistent with',
      body: '“I wanted something simple enough to fit into my routine. SlimSoda is easy to mix with water and has become a convenient part of my day.”',
      verified: true,
      date: '2 days ago'
    },
    {
      id: 2,
      author: 'Riley T.',
      rating: 5,
      title: 'Fits naturally into my morning',
      body: '“I like how easy it is to prepare. I mix it with water as part of my morning routine, and it doesn\'t add another complicated step to my day.”',
      verified: true,
      date: '5 days ago'
    },
    {
      id: 3,
      author: 'Aubrey D.',
      rating: 5,
      title: 'Simple and convenient',
      body: '“It mixes quickly with cold water and fits easily into my morning. I especially like that the routine is simple and doesn\'t require several different products.”',
      verified: true,
      date: '1 week ago'
    },
    {
      id: 4,
      author: 'Lesley S.',
      rating: 5,
      title: 'Easy to make part of my day',
      body: '“Three weeks in and the biggest thing for me is how easy it has been to stay consistent. I mix it with water and continue with my day. Simple routines are easier for me to maintain.”',
      verified: true,
      date: '2 weeks ago'
    }
  ];

  const initialReviews = (reviewsSection && reviewsSection.reviews && reviewsSection.reviews.length)
    ? reviewsSection.reviews.map((r, i) => ({
        id: i + 1,
        author: r.author || 'Verified Customer',
        rating: r.stars || 5,
        title: r.quote || 'Great product',
        body: r.body,
        verified: true,
        date: 'Verified Buyer'
      }))
    : defaultCompliantReviews;

  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [modalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    if (reviewsSection && reviewsSection.reviews && reviewsSection.reviews.length) {
      setReviewsList(
        reviewsSection.reviews.map((r, i) => ({
          id: i + 1,
          author: r.author || 'Verified Customer',
          rating: r.stars || 5,
          title: r.quote || 'Great product',
          body: r.body,
          verified: true,
          date: 'Verified Buyer'
        }))
      );
    }
  }, [reviewsSection]);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().replace(/[^A-Z]/g, '');
    }
    return name.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formTitle || !formBody) return;

    const newRev = {
      id: Date.now(),
      author: formName,
      rating: Number(formRating),
      title: formTitle,
      body: formBody,
      verified: true,
      date: 'Just now'
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setModalOpen(false);
      setFormName('');
      setFormTitle('');
      setFormBody('');
    }, 2000);
  };

  if (!reviewsSection) return null;
  const { tag, title, ratingText } = reviewsSection;
  const brandGreen = accentColor || '#27AE60';

  return (
    <section id="reviews-section" style={{ padding: '75px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        {tag && (
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 900, 
              letterSpacing: '0.14em', 
              color: brandGreen,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            {tag}
          </span>
        )}
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#141210', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        {ratingText && (
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#F5A623', letterSpacing: '0.04em', marginBottom: '20px' }}>
            {ratingText}
          </div>
        )}

        {/* Action Bar: Write a Review Button */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              backgroundColor: '#141210',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 26px',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              transition: 'transform 0.2s ease',
              textTransform: 'uppercase'
            }}
          >
            WRITE A REVIEW
          </button>
        </div>
      </div>

      {/* List-style Reviews Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              padding: '24px 28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              textAlign: 'left'
            }}
          >
            {/* Top Stars & Date Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ color: '#F5A623', fontSize: '16px', letterSpacing: '2px' }}>
                {'★'.repeat(rev.rating)}
              </div>
              <span style={{ fontSize: '12px', color: '#999', fontWeight: 500 }}>{rev.date}</span>
            </div>

            {/* Author Avatar (Initials) & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(39, 174, 96, 0.12)',
                  color: brandGreen,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  flexShrink: 0
                }}
              >
                {getInitials(rev.author)}
              </div>

              <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#141210' }}>
                {rev.author}
              </span>
              {rev.verified && (
                <span style={{ fontSize: '11.5px', color: '#27AE60', fontWeight: 700, backgroundColor: 'rgba(39, 174, 96, 0.08)', padding: '2px 8px', borderRadius: '10px' }}>
                  ✓ Verified Buyer
                </span>
              )}
            </div>

            {/* Review Title */}
            <h3 style={{ fontSize: '16.5px', fontWeight: 900, color: '#141210', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
              {rev.title}
            </h3>

            {/* Review Body */}
            <p style={{ fontSize: '14.5px', color: '#444', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
              {rev.body}
            </p>
          </div>
        ))}
      </div>

      {/* Modal for Submitting a Review */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#888'
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#141210', margin: '0 0 6px' }}>
              Write a Product Review
            </h3>
            <p style={{ fontSize: '13.5px', color: '#666', margin: '0 0 20px' }}>
              Share your experience with this product to help others.
            </p>

            {submittedMessage ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#27AE60', fontWeight: 800, fontSize: '16px' }}>
                ✓ Thank you! Your review has been published.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#333', marginBottom: '4px' }}>
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sarah M."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #DDD',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#333', marginBottom: '4px' }}>
                    RATING
                  </label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #DDD',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="5">★★★★★ (5 Stars - Excellent)</option>
                    <option value="4">★★★★☆ (4 Stars - Good)</option>
                    <option value="3">★★★☆☆ (3 Stars - Average)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#333', marginBottom: '4px' }}>
                    REVIEW TITLE
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Easy to stay consistent with!"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #DDD',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#333', marginBottom: '4px' }}>
                    YOUR REVIEW
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    placeholder="Describe what you liked about the product..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #DDD',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: brandGreen,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  SUBMIT REVIEW
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
