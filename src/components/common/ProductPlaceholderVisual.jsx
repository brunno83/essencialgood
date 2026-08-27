import React, { useState } from 'react';
import { PRODUCTS } from '../../config/products';

/**
 * ESSENCIAL GOOD — Unified Product Visual Component
 * Renders real high-res PNG/WEBP product imagery with responsive object-fit framing.
 * Features centered luxury badge overlays with 100% single-line non-wrapping text!
 */
export const ProductPlaceholderVisual = ({
  product = PRODUCTS[0],
  size = 'medium',
  className = '',
  useSelectorImage = false,
  fullBleed = false,
  useHighlightImage = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const {
    name,
    category,
    accentColor,
    imageBottle,
    imageHighlight,
    imageSelector,
    image,
    selectorImage,
    highlightImage,
  } = product;

  // Height mappings based on size variant
  const heights = {
    small: '140px',
    medium: '220px',
    large: '340px',
    hero: '440px',
  };

  const currentHeight = heights[size] || heights.medium;

  // Primary color for fallback SVG
  const primary = accentColor || 'var(--color-sage)';
  const capColor = '#2D3B22';

  // Determine target image source from products.js properties
  const targetImage = useHighlightImage
    ? (imageHighlight || highlightImage)
    : useSelectorImage
    ? (imageSelector || selectorImage)
    : (imageBottle || image);

  // Render Real Image if available and not errored
  if (targetImage && !imageError) {
    if (fullBleed) {
      return (
        <div
          className={`product-visual-wrapper ${className}`}
          style={{
            position: 'relative',
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
            }}
          />
        </div>
      );
    }

    if (useHighlightImage) {
      return (
        <div
          className={`product-visual-wrapper ${className}`}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3 / 4',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(27, 38, 19, 0.12)',
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

            {/* 100% Centered Non-Wrapping Badge Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '0.85rem',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0.35rem 0.75rem',
                backgroundColor: 'rgba(246, 255, 252, 0.92)',
                backdropFilter: 'blur(12px)',
                borderRadius: '9999px',
                border: '1px solid rgba(75, 104, 51, 0.2)',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap',
                maxWidth: '92%',
                textAlign: 'center',
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
            height: '15%',
            bottom: '5%',
            borderRadius: '50%',
            backgroundColor: 'rgba(27, 38, 19, 0.12)',
            filter: 'blur(12px)',
            transform: 'scaleY(0.4)',
            zIndex: 1,
          }}
        />

        <img
          src={targetImage}
          alt={`Essencial Good — ${name}`}
          onError={() => setImageError(true)}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            filter: 'contrast(1.02) brightness(1.0)',
            position: 'relative',
            zIndex: 2,
            transition: 'transform 0.4s ease',
          }}
        />
      </div>
    );
  }

  // Fallback High-Fidelity SVG Render
  return (
    <div 
      className={`product-visual-wrapper fallback ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: currentHeight,
        width: '100%',
        padding: '0.5rem',
      }}
    >
      <svg
        viewBox="0 0 240 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          height: '100%',
          width: 'auto',
          maxHeight: '100%',
          filter: 'drop-shadow(0 15px 25px rgba(27, 38, 19, 0.12))',
        }}
      >
        <defs>
          <linearGradient id={`bg-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B2613" />
            <stop offset="50%" stopColor="#25351A" />
            <stop offset="100%" stopColor="#11180C" />
          </linearGradient>

          <linearGradient id={`cap-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4B6833" />
            <stop offset="50%" stopColor="#8E9A85" />
            <stop offset="100%" stopColor="#2B3E1C" />
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

        <circle cx="120" cy="302" r="10" fill={primary} fillOpacity="0.15" />
        <circle cx="120" cy="302" r="4" fill={primary} />
      </svg>
    </div>
  );
};
