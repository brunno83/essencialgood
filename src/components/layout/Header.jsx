import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { CTAButton } from '../common/CTAButton';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoSrc = scrolled ? "/assets/logo/logo_brand_dark.png" : "/assets/logo/logo_brand_white.png";

  const navLinks = [
    { label: 'Collection', href: '#meet-essentials' },
    { label: 'Highlights', href: '#product-highlights' },
    { label: 'Routine Selector', href: '#find-essential' },
    { label: 'Reviews', href: '#customer-stories' },
    { label: 'Guarantee', href: '#guarantee' },
    { label: 'Sanctuary Store', href: '#physical-store' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.4s ease',
        backgroundColor: scrolled ? 'rgba(238, 233, 222, 0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(75, 104, 51, 0.15)' : '1px solid transparent',
        padding: scrolled ? '0.75rem 0' : '1.25rem 0',
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.06)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo Image with Text Fallback */}
        <a
          href="#"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {!logoError ? (
            <img
              src={logoSrc}
              alt="Essencial Good Logo"
              onError={() => setLogoError(true)}
              style={{
                height: scrolled ? '46px' : '56px',
                width: 'auto',
                transition: 'height 0.3s ease',
                display: 'block',
              }}
            />
          ) : (
            <span
              style={{
                color: scrolled ? 'var(--color-primary)' : '#FFFFFF',
                fontFamily: 'var(--font-brand-display)',
                fontSize: '1.4rem',
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
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`nav-link ${scrolled ? 'nav-link-scrolled' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Header Action Button */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CTAButton
            href="#meet-essentials"
            size="small"
            style={{
              backgroundColor: scrolled ? 'var(--color-primary)' : '#F6FFFC',
              color: scrolled ? '#FFFFFF' : 'var(--color-primary)',
              borderColor: scrolled ? 'var(--color-primary)' : '#F6FFFC',
              fontWeight: 700,
              letterSpacing: '0.08em',
              boxShadow: scrolled ? '0 6px 20px rgba(27, 38, 19, 0.15)' : '0 6px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            SHOP ESSENTIALS
          </CTAButton>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          style={{
            background: 'none',
            border: 'none',
            color: scrolled ? 'var(--color-primary)' : '#FFFFFF',
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
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontSize: '1.05rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {link.label}
            </a>
          ))}

          <div style={{ paddingTop: '1rem' }}>
            <CTAButton href="#meet-essentials" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>
              SHOP ESSENTIALS
            </CTAButton>
          </div>
        </div>
      )}

      {/* Embedded Navigation Styles */}
      <style>{`
        .nav-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-size: 0.775rem;
          font-weight: 600;
          letter-spacing: 0.12em;
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
