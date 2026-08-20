import React, { useState } from 'react';

/**
 * Product Visual Component: Renders PNG/JPG images with luxury editorial framing, or fallback 3D Rendered SVG.
 * Supports fullBleed mode for Section 06 glassmorphic background card stage.
 */
export const ProductPlaceholderVisual = ({
  product,
  className = '',
  size = 'medium',
  useHighlightImage = false,
  useSelectorImage = false,
  fullBleed = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const { name, category, accentColor, bottleStyle, imageBottle, imageHighlight, imageSelector } = product;

  // Determine target image based on context flags
  let targetImage = imageBottle;
  if (useHighlightImage && imageHighlight) {
    targetImage = imageHighlight;
  } else if (useSelectorImage && (imageSelector || imageBottle)) {
    targetImage = imageSelector || imageBottle;
  }

  const primary = bottleStyle?.primaryColor || accentColor || '#4B6833';
  const capColor = bottleStyle?.capColor || '#E6E6E6';
  
  const heightMap = {
    small: '140px',
    medium: '220px',
    large: '500px',
    hero: '540px',
  };

  const currentHeight = heightMap[size] || heightMap.medium;

  // If custom campaign photo exists
  if (targetImage && !imageError) {
    if (fullBleed) {
      // Full-bleed edge-to-edge image filling the entire parent card stage
      return (
        <div 
          className={`product-visual-wrapper ${className}`} 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={targetImage}
            alt={`Essencial Good — ${name}`}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              filter: 'contrast(1.03) brightness(1.01)',
            }}
          />
        </div>
      );
    }

    if (useHighlightImage) {
      // Luxury Editorial Full-Bleed 3:4 Campaign Frame (Section 05) with Zero-Crop Mobile Responsive Framing
      return (
        <div 
          className={`product-visual-wrapper ${className}`} 
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: currentHeight,
            width: '100%',
            maxWidth: '380px',
            margin: '0 auto',
            aspectRatio: '3 / 4',
          }}
        >
          <div 
            style={{
              position: 'absolute',
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primary}35 0%, transparent 70%)`,
              filter: 'blur(40px)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 55px rgba(27, 38, 19, 0.18), 0 10px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              backgroundColor: '#F6FFFC',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
            }}
          >
            <img
              src={targetImage}
              alt={`Essencial Good — ${name}`}
              onError={() => setImageError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
                filter: 'contrast(1.03) brightness(1.01)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                padding: '0.4rem 0.85rem',
                backgroundColor: 'rgba(246, 255, 252, 0.88)',
                backdropFilter: 'blur(12px)',
                borderRadius: '9999px',
                border: '1px solid rgba(75, 104, 51, 0.2)',
                fontSize: '0.675rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              }}
            >
              ESSENCIAL GOOD — {category}
            </div>
          </div>
        </div>
      );
    }

    // Default PNG Bottle (E-commerce Section 04 with Multiply Blend)
    return (
      <div 
        className={`product-visual-wrapper ${className}`} 
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: useSelectorImage ? '320px' : currentHeight,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primary}25 0%, transparent 70%)`,
            filter: 'blur(25px)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <img
          src={targetImage}
          alt={`Essencial Good — ${name}`}
          onError={() => setImageError(true)}
          style={{
            maxHeight: '92%',
            maxWidth: '92%',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 2,
            mixBlendMode: 'multiply',
            filter: 'contrast(1.05) brightness(1.02)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    );
  }

  // Fallback 3D Rendered Vector Bottle Component
  return (
    <div 
      className={`product-visual-wrapper ${className}`} 
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: currentHeight,
        width: '100%',
        perspective: '1000px',
      }}
    >
      <div 
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primary}35 0%, transparent 70%)`,
          filter: 'blur(35px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 240 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          height: '90%',
          width: 'auto',
          filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.12))',
          zIndex: 2,
          transition: 'transform 0.5s ease',
        }}
      >
        <defs>
          <linearGradient id={`bg-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E221E" />
            <stop offset="40%" stopColor="#121512" />
            <stop offset="100%" stopColor="#080A08" />
          </linearGradient>

          <linearGradient id={`cap-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={capColor} />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={capColor} stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id={`highlight-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="95" y="30" width="50" height="24" rx="4" fill={`url(#cap-grad-${product.id})`} />
        <rect x="105" y="14" width="30" height="18" rx="6" fill={capColor} opacity="0.9" />
        <rect x="100" y="54" width="40" height="12" fill="#181818" />

        <path d="M96 66 H144 L152 90 H88 L96 66 Z" fill={`url(#bg-grad-${product.id})`} stroke="rgba(255,255,255,0.08)" />
        <rect x="52" y="90" width="136" height="280" rx="20" fill={`url(#bg-grad-${product.id})`} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <rect x="62" y="354" width="116" height="10" rx="5" fill={primary} opacity="0.3" />
        <rect x="54" y="92" width="16" height="276" rx="8" fill={`url(#highlight-grad-${product.id})`} />
        <rect x="52" y="116" width="136" height="6" fill={primary} />

        <rect x="66" y="140" width="108" height="190" rx="6" fill="#0D0F0D" stroke={primary} strokeWidth="0.75" strokeOpacity="0.4" />
        <text x="120" y="165" textAnchor="middle" fill="#A8AAA4" fontSize="8" letterSpacing="2.5" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">
          ESSENCIAL GOOD
        </text>
        <line x1="82" y1="176" x2="158" y2="158" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        <text x="120" y="210" textAnchor="middle" fill="#FFFFFF" fontSize="16" letterSpacing="0.5" fontFamily="'Cormorant Garamond', serif" fontWeight="600">
          {name}
        </text>

        <rect x="90" y="225" width="60" height="16" rx="8" fill={primary} fillOpacity="0.2" stroke={primary} strokeWidth="0.5" />
        <text x="120" y="236" textAnchor="middle" fill={primary} fontSize="7" letterSpacing="1.8" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">
          {category}
        </text>

        <text x="120" y="270" textAnchor="middle" fill="#757873" fontSize="6.5" letterSpacing="0.8" fontFamily="'Plus Jakarta Sans', sans-serif">
          EVERYDAY ESSENTIAL
        </text>
        <text x="120" y="282" textAnchor="middle" fill="#A8AAA4" fontSize="6" letterSpacing="0.5" fontFamily="'Plus Jakarta Sans', sans-serif">
          THOUGHTFUL FORMULA
        </text>

        <rect x="66" y="322" width="108" height="8" rx="0 0 6 6" fill={primary} />
      </svg>
    </div>
  );
};
