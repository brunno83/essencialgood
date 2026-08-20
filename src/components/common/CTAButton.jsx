import React from 'react';

/**
 * ESSENCIAL GOOD — Brand Luxury Button Component
 * Adapted from Uiverse.io (Root-acess) design with official brand palette (#4B6833, #1B2613, #EEE9DE, #F6FFFC).
 * Enforces 100% single-line non-wrapping text on all screen sizes!
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

  const py = size === 'large' ? '14px' : size === 'small' ? '8px' : '11px';
  const px = size === 'large' ? '32px' : size === 'small' ? '18px' : '26px';
  const fontSize = size === 'large' ? '0.95rem' : size === 'small' ? '0.775rem' : '0.85rem';

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
        fontWeight: '600',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        textAlign: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        borderRadius: '9999px',
        border: isSecondary ? '2px solid var(--color-sage)' : '2px solid rgba(142, 154, 133, 0.4)',
        backgroundColor: isSecondary ? 'transparent' : 'var(--color-sage)',
        color: isSecondary ? 'var(--color-primary)' : '#F6FFFC',
        boxShadow: '0 4px 15px rgba(75, 104, 51, 0.18)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {/* Dynamic Scale Expanding Hover Background Layer */}
      <span className="brand-hover-bg" />

      {/* Button Content Text & Chevron Icon */}
      <span className="brand-button-text">
        <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
        {icon && (
          <span className="brand-button-arrow">
            →
          </span>
        )}
      </span>

      <style>{`
        .brand-luxury-button {
          outline: none;
          white-space: nowrap !important;
        }

        /* --- PRIMARY VARIANT HOVER --- */
        .brand-luxury-primary:hover {
          border-color: #F6FFFC !important;
          box-shadow: 0 10px 30px rgba(27, 38, 19, 0.35) !important;
          transform: scale(1.04);
          color: #FFFFFF !important;
        }
        .brand-luxury-primary .brand-hover-bg {
          background: linear-gradient(to right, #3B5427, #1B2613);
        }

        /* --- SECONDARY VARIANT HOVER --- */
        .brand-luxury-secondary:hover {
          border-color: #4B6833 !important;
          box-shadow: 0 10px 25px rgba(75, 104, 51, 0.22) !important;
          transform: scale(1.04);
          color: #F6FFFC !important;
        }
        .brand-luxury-secondary .brand-hover-bg {
          background: linear-gradient(to right, #4B6833, #1B2613);
        }

        /* EXPANDING HOVER LAYER */
        .brand-hover-bg {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          transform: scale(0);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
          pointer-events: none;
        }

        .brand-luxury-button:hover .brand-hover-bg {
          transform: scale(1);
        }

        /* TEXT AND ARROW WRAPPER */
        .brand-button-text {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          white-space: nowrap !important;
        }

        .brand-button-arrow {
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .brand-luxury-button:hover .brand-button-arrow {
          transform: translateX(4px);
        }

        .brand-luxury-button:active {
          transform: scale(0.97) !important;
        }

        @media (max-width: 640px) {
          .brand-luxury-button {
            font-size: 0.775rem !important;
            padding: 10px 20px !important;
            letter-spacing: 0.08em !important;
          }
        }
      `}</style>
    </Component>
  );
};
