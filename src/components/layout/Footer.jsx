import React, { useState } from 'react';
import { PRODUCTS } from '../../config/products';
import { BRAND_CONTENT } from '../../config/content';
import { PolicyModal } from '../common/PolicyModal';

export const Footer = () => {
  const { footer } = BRAND_CONTENT;
  const [activePolicy, setActivePolicy] = useState(null);
  const [logoError, setLogoError] = useState(false);

  const logoWhitePath = '/assets/logo/logo_brand_white.png';
  const diegoLogoPath = '/assets/brand/diego_abrantes_logo.png';

  return (
    <footer
      style={{
        backgroundColor: '#1B2613',
        color: '#EEE9DE',
        borderTop: '1px solid rgba(246, 255, 252, 0.1)',
        paddingTop: '5rem',
        paddingBottom: '3rem',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Main 4-Column Side-by-Side Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
            alignItems: 'start',
          }}
          className="footer-main-grid"
        >
          {/* Column 1: Brand Logo (Clean, no text below) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ margin: 0, padding: 0 }}>
              {!logoError ? (
                <img
                  src={logoWhitePath}
                  alt="Essencial Good"
                  onError={() => setLogoError(true)}
                  style={{
                    height: '64px',
                    width: 'auto',
                    maxWidth: '260px',
                    objectFit: 'contain',
                    filter: 'brightness(1.1)',
                    display: 'block',
                    margin: 0,
                  }}
                />
              ) : (
                <h3
                  style={{
                    fontFamily: 'var(--font-brand-display)',
                    fontSize: '1.8rem',
                    letterSpacing: '0.1em',
                    color: '#F6FFFC',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  {footer.logo}
                </h3>
              )}
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div>
            <h4 className="footer-title">SHOP</h4>
            <ul className="footer-links-list">
              {PRODUCTS.map((prod) => (
                <li key={prod.id}>
                  <a href={prod.link} className="footer-link">
                    {prod.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div>
            <h4 className="footer-title">COMPANY</h4>
            <ul className="footer-links-list">
              <li><a href="#who-we-are" className="footer-link">About Us</a></li>
              <li><a href="#who-we-are" className="footer-link">Our Story</a></li>
              <li><a href="#contact" className="footer-link">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: POLICIES & LEGAL */}
          <div>
            <h4 className="footer-title">POLICIES & LEGAL</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => setActivePolicy('privacy')} className="footer-link-btn">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicy('terms')} className="footer-link-btn">
                  Terms of Use
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicy('shipping')} className="footer-link-btn">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicy('returns')} className="footer-link-btn">
                  Refund & Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicy('guarantee')} className="footer-link-btn">
                  Guarantee Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Signature Line */}
        <div
          style={{
            borderTop: '1px solid rgba(246, 255, 252, 0.12)',
            paddingTop: '2.25rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#B0A898',
            lineHeight: 1.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.4rem',
          }}
        >
          <span>Copyright ©️ 2026 Made by</span>

          {/* Diego Abrantes Logo with Website Link */}
          <a
            href="https://diegoabrantes.com.br"
            target="_blank"
            rel="noopener noreferrer"
            title="Diego Abrantes — Official Website"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              margin: '0 0.3rem',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              verticalAlign: 'middle',
            }}
            className="diego-logo-link"
          >
            <img
              src={diegoLogoPath}
              alt="Diego Abrantes"
              style={{
                height: '24px',
                width: 'auto',
                display: 'inline-block',
                filter: 'brightness(1.1)',
              }}
            />
          </a>

          <span>
            . CNPJ: 61.814.267/0001-07 & 💚 Grupo BUCA MARKETING PERFORMANCE LTDA. CNPJ: 51.479.162/0001-95
          </span>
        </div>
      </div>

      {/* Integrated Interactive Policy Modal */}
      <PolicyModal policyType={activePolicy} onClose={() => setActivePolicy(null)} />

      <style>{`
        .footer-title {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #F6FFFC;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
        }
        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-link {
          color: #EEE9DE;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }
        .footer-link:hover {
          color: #FFFFFF;
        }
        .footer-link-btn {
          background: none;
          border: none;
          padding: 0;
          color: #EEE9DE;
          font-size: 0.875rem;
          font-family: inherit;
          cursor: pointer;
          text-align: left;
          transition: color 0.3s ease;
        }
        .footer-link-btn:hover {
          color: #FFFFFF;
          text-decoration: underline;
        }
        .diego-logo-link:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }
      `}</style>
    </footer>
  );
};
