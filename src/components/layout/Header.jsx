import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { CTAButton } from '../common/CTAButton';
import { PRODUCTS } from '../../config/products';
import { PDP_DATA } from '../../config/pdpData';

export const Header = ({ onNavHome, onSelectProduct, isProductPage, activeProductId }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolidHeader = isProductPage || scrolled;
  const logoSrc = isSolidHeader ? "/assets/logo/logo_brand_dark.png" : "/assets/logo/logo_brand_white.png";
  
  // Dynamic header accent color matching active product or brand green (#4B6833)
  const activeAccentColor = (isProductPage && PDP_DATA[activeProductId]?.accentColor)
    ? PDP_DATA[activeProductId].accentColor
    : '#4B6833';

  const handleHomeClick = (e) => {
    if (e) e.preventDefault();
    setProductsDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onNavHome) {
      onNavHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleProductSelect = (id, e) => {
    if (e) e.preventDefault();
    setProductsDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onSelectProduct) {
      onSelectProduct(id);
    }
  };

  const scrollToBundles = (e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById('bundles-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onSelectProduct) {
      onSelectProduct(activeProductId || 'linfaflow');
    }
  };

  const pdpNavLinks = [
    { label: 'PRICING', href: '#bundles-section' },
    { label: 'BENEFITS', href: '#benefits-section' },
    { label: 'INGREDIENTS', href: '#ingredients-section' },
    { label: 'REVIEWS', href: '#reviews-section' },
    { label: 'FAQ', href: '#faq-section' }
  ];

  const homeNavLinks = [
    { label: 'COLLECTION', href: '#meet-essentials' },
    { label: 'HIGHLIGHTS', href: '#product-highlights' },
    { label: 'SELECTOR', href: '#find-essential' },
    { label: 'REVIEWS', href: '#customer-stories' },
    { label: 'GUARANTEE', href: '#guarantee' },
    { label: 'FAQ', href: '#faq' },
  ];

  const currentNavLinks = isProductPage ? pdpNavLinks : homeNavLinks;

  return (
    <header
      style={{
        position: 'fixed',
        top: isProductPage ? '34px' : 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.4s ease',
        backgroundColor: isSolidHeader ? 'rgba(238, 233, 222, 0.96)' : 'transparent',
        backdropFilter: isSolidHeader ? 'blur(20px)' : 'none',
        borderBottom: isSolidHeader ? '1px solid rgba(75, 104, 51, 0.15)' : '1px solid transparent',
        padding: isSolidHeader ? '0.6rem 0' : '1.1rem 0',
        boxShadow: isSolidHeader ? '0 10px 30px rgba(0, 0, 0, 0.06)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo Image Only */}
        <a
          href="/"
          onClick={handleHomeClick}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {!logoError ? (
            <img
              src={logoSrc}
              alt="Essencial Good Logo"
              onError={() => setLogoError(true)}
              style={{
                height: isSolidHeader ? '42px' : '50px',
                width: 'auto',
                transition: 'height 0.3s ease',
                display: 'block',
              }}
            />
          ) : (
            <span
              style={{
                color: isSolidHeader ? 'var(--color-primary)' : '#FFFFFF',
                fontFamily: 'var(--font-brand-display)',
                fontSize: '1.3rem',
                fontWeight: 400,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transition: 'color 0.4s ease',
              }}
            >
              ESSENCIAL GOOD
            </span>
          )}
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
          }}
          className="desktop-nav"
        >
          {/* OUR ESSENTIALS Dropdown Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
              className={`nav-link ${isSolidHeader ? 'nav-link-scrolled' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 0',
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                fontWeight: 700
              }}
            >
              OUR ESSENTIALS <ChevronDown size={13} />
            </button>

            {productsDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                  padding: '8px',
                  minWidth: '210px',
                  zIndex: 200
                }}
              >
                <a
                  href="/"
                  onClick={handleHomeClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#4B6833',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    marginBottom: '4px',
                    backgroundColor: 'rgba(75, 104, 51, 0.06)'
                  }}
                >
                  🏠 HOME PAGE
                </a>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '4px 0 8px 0' }} />
                {PRODUCTS.map((p) => (
                  <a
                    key={p.id}
                    href={`/${p.id}`}
                    onClick={(e) => handleProductSelect(p.id, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: activeProductId === p.id ? p.accentColor : '#141210',
                      fontWeight: activeProductId === p.id ? 800 : 600,
                      fontSize: '12.5px',
                      backgroundColor: activeProductId === p.id ? `${p.accentColor}12` : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <span 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: p.accentColor 
                      }} 
                    />
                    {p.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Clean Section Navigation Links */}
          {currentNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`nav-link ${isSolidHeader ? 'nav-link-scrolled' : ''}`}
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                fontWeight: 700
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Header Action Button - Standardized Brand Button */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isProductPage ? (
            <CTAButton
              onClick={scrollToBundles}
              size="small"
              style={{
                backgroundColor: activeAccentColor,
                color: '#FFFFFF',
                borderColor: activeAccentColor,
                boxShadow: `0 6px 20px ${activeAccentColor}35`,
                borderRadius: '10px'
              }}
            >
              CHOOSE BUNDLE
            </CTAButton>
          ) : (
            <CTAButton
              href="#meet-essentials"
              size="small"
              style={{
                backgroundColor: activeAccentColor,
                color: '#FFFFFF',
                borderColor: activeAccentColor,
                boxShadow: `0 6px 20px ${activeAccentColor}35`,
                borderRadius: '10px'
              }}
            >
              SHOP ESSENTIALS
            </CTAButton>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          style={{
            background: 'none',
            border: 'none',
            color: isSolidHeader ? 'var(--color-primary)' : '#FFFFFF',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'none',
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#EEE9DE',
            borderBottom: '1px solid var(--color-border)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}
        >
          <a
            href="/"
            onClick={handleHomeClick}
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            🏠 HOME PAGE
          </a>

          <div style={{ fontSize: '11px', fontWeight: 800, color: '#888', letterSpacing: '0.1em', marginTop: '4px' }}>
            ALL PRODUCTS
          </div>

          {PRODUCTS.map((p) => (
            <a
              key={p.id}
              href={`/${p.id}`}
              onClick={(e) => handleProductSelect(p.id, e)}
              style={{
                color: p.accentColor,
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ● {p.name}
            </a>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', margin: '8px 0' }} />

          {currentNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {link.label}
            </a>
          ))}

          <div style={{ paddingTop: '0.5rem' }}>
            <CTAButton
              onClick={scrollToBundles}
              style={{
                width: '100%',
                backgroundColor: activeAccentColor,
                color: '#FFFFFF',
                borderColor: activeAccentColor
              }}
            >
              CHOOSE BUNDLE
            </CTAButton>
          </div>
        </div>
      )}

      {/* Embedded Navigation Styles */}
      <style>{`
        .nav-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.3s ease, opacity 0.3s ease;
          position: relative;
        }
        .nav-link:hover {
          color: #FFFFFF;
          opacity: 1;
        }
        .nav-link-scrolled {
          color: var(--color-secondary) !important;
        }
        .nav-link-scrolled:hover {
          color: var(--color-primary) !important;
        }
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
