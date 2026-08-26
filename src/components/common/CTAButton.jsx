import React from 'react';

/**
 * ESSENCIAL GOOD — Brand Luxury Button Component
 * Standardized across all Home and PDP sections.
 * Guarantees single arrow, clean border radius, and unified typography.
 */
export const CTAButton = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'medium',
  className = '',
  icon = true,
  style = {},
  ...props
}) => {
  const Component = href ? 'a' : 'button';
  const isSecondary = variant === 'secondary' || variant === 'outline';

  const py = size === 'large' ? '16px' : size === 'small' ? '10px' : '14px';
  const px = size === 'large' ? '36px' : size === 'small' ? '20px' : '28px';
  const fontSize = size === 'large' ? '15.5px' : size === 'small' ? '12.5px' : '14px';

  // Prevent double arrow if text already contains '→' or '->'
  const childString = typeof children === 'string' ? children : '';
  const hasArrowInText = childString.includes('→') || childString.includes('->');
  const showIcon = icon && !hasArrowInText;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`brand-luxury-button ${isSecondary ? 'brand-luxury-secondary' : 'brand-luxury-primary'} ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${py} ${px}`,
        fontSize: fontSize,
        fontFamily: 'var(--font-sans)',
        fontWeight: '800',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        textAlign: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        borderRadius: '12px',
        border: isSecondary ? '2px solid #4B6833' : 'none',
        backgroundColor: isSecondary ? 'transparent' : '#4B6833',
        color: isSecondary ? '#4B6833' : '#FFFFFF',
        boxShadow: isSecondary ? 'none' : '0 8px 24px rgba(75, 104, 51, 0.25)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      <span className="brand-button-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
        <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
        {showIcon && (
          <span style={{ fontSize: '1.1em', transition: 'transform 0.2s ease' }} className="brand-button-arrow">
            →
          </span>
        )}
      </span>

      <style>{`
        .brand-luxury-button {
          outline: none;
          white-space: nowrap !important;
        }
        .brand-luxury-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2) !important;
        }
        .brand-luxury-button:hover .brand-button-arrow {
          transform: translateX(3px);
        }
      `}</style>
    </Component>
  );
};
