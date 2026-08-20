import React from 'react';

/**
 * Editorial Section Heading Component
 */
export const SectionHeading = ({
  eyebrow,
  title,
  subheadline,
  align = 'center',
  className = '',
}) => {
  const isLeft = align === 'left';

  return (
    <div
      className={`section-heading ${className}`}
      style={{
        textAlign: align,
        maxWidth: isLeft ? '640px' : '720px',
        margin: isLeft ? '0' : '0 auto 3.5rem auto',
        marginBottom: '3.5rem',
      }}
    >
      {eyebrow && (
        <span
          className="text-eyebrow"
          style={{
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          {eyebrow}
        </span>
      )}

      {title && (
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            lineHeight: 1.15,
            marginBottom: subheadline ? '1.25rem' : '0',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {title}
        </h2>
      )}

      {subheadline && (
        <p
          className="text-lead"
          style={{
            color: 'var(--color-secondary)',
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            fontWeight: 300,
          }}
        >
          {subheadline}
        </p>
      )}
    </div>
  );
};
