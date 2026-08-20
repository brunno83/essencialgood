import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Truck, RotateCcw, FileText, Lock } from 'lucide-react';

export const POLICIES_DATA = {
  privacy: {
    title: 'PRIVACY POLICY',
    icon: Lock,
    lastUpdated: 'August 19, 2026',
    content: (
      <>
        <p>
          At <strong>Essencial Good</strong>, protecting your personal privacy is a fundamental priority. This Privacy Policy outlines how your personal information is collected, used, and safeguarded when you visit or make a purchase from our store.
        </p>
        <h4>1. Information We Collect</h4>
        <p>
          When you place an order, create an account, or subscribe to our newsletter, we collect personal details including your full name, shipping address, billing address, email address, and phone number. Payment details are processed directly through PCI-DSS Level 1 compliant secure payment processors.
        </p>
        <h4>2. How We Use Your Information</h4>
        <p>
          We use your information exclusively to process and fulfill your orders, provide real-time shipping updates, send customer support communications, and improve your overall shopping experience. We never sell, rent, or trade your personal data to third parties.
        </p>
        <h4>3. Security & Data Protection</h4>
        <p>
          All data transmitted through our website is encrypted using 256-bit SSL (Secure Sockets Layer) protocols. We maintain administrative and technical safeguards to prevent unauthorized access to your information.
        </p>
      </>
    ),
  },
  terms: {
    title: 'TERMS OF USE',
    icon: FileText,
    lastUpdated: 'August 19, 2026',
    content: (
      <>
        <p>
          Welcome to <strong>Essencial Good</strong>. By accessing or using our website, services, and products, you agree to comply with and be bound by the following Terms of Use.
        </p>
        <h4>1. Intellectual Property</h4>
        <p>
          All content on this website, including text, graphics, logos, product names, images, and software, is the exclusive property of Essencial Good and protected by copyright and intellectual property laws.
        </p>
        <h4>2. Product Descriptions & Availability</h4>
        <p>
          We strive to provide accurate product descriptions, pricing, and availability details. We reserve the right to correct any errors or update product details at any time without prior notice.
        </p>
        <h4>3. Customer Conduct</h4>
        <p>
          You agree to use our website only for lawful purposes and in a manner that does not infringe upon the rights of or restrict the use of this site by any third party.
        </p>
      </>
    ),
  },
  shipping: {
    title: 'SHIPPING & DELIVERY POLICY',
    icon: Truck,
    lastUpdated: 'August 19, 2026',
    content: (
      <>
        <p>
          We know you are excited to receive your <strong>Essencial Good</strong> order. Here are the details of our shipping speeds and processing guidelines:
        </p>
        <h4>1. Fast Order Processing</h4>
        <p>
          All domestic orders placed before 2:00 PM EST are processed and dispatched within 24 business hours. Orders placed over the weekend or holidays are dispatched on the next business day.
        </p>
        <h4>2. US Domestic Delivery Speeds</h4>
        <p>
          Standard US domestic shipping takes between <strong>2 to 4 business days</strong>. Expedited 2-day delivery options are also available at checkout.
        </p>
        <h4>3. Real-Time Tracking</h4>
        <p>
          As soon as your package leaves our fulfillment center, you will receive an automated email with your official courier tracking number and real-time tracking portal link.
        </p>
      </>
    ),
  },
  returns: {
    title: 'REFUND & RETURN POLICY',
    icon: RotateCcw,
    lastUpdated: 'August 19, 2026',
    content: (
      <>
        <p>
          Your satisfaction is at the core of everything we build at <strong>Essencial Good</strong>. We want every customer experience to feel straightforward and risk-free.
        </p>
        <h4>1. 30-Day Standard Returns</h4>
        <p>
          If you need to return an unopened item or initiate an exchange, you may do so within 30 days of receiving your order.
        </p>
        <h4>2. Simple Return Process</h4>
        <p>
          To start a return, simply contact our Customer Care team with your order number. We will provide you with a pre-paid return shipping label and step-by-step instructions.
        </p>
        <h4>3. Refund Issuance</h4>
        <p>
          Once your return is received and inspected at our warehouse, your refund will be credited back to your original payment method within 3–5 business days.
        </p>
      </>
    ),
  },
  guarantee: {
    title: 'GUARANTEE POLICY',
    icon: ShieldCheck,
    lastUpdated: 'August 19, 2026',
    content: (
      <>
        <p>
          We stand behind the quality, purity, and intentional design of every formula we create. That is why we back your purchase with our official <strong>90-Day Money-Back Guarantee</strong>.
        </p>
        <h4>1. 90 Full Days to Evaluate</h4>
        <p>
          You have 90 full days from your delivery date to integrate Essencial Good into your daily routine and evaluate your personal experience.
        </p>
        <h4>2. Hassle-Free Commitment</h4>
        <p>
          If you feel that our products did not fit your daily routine or meet your expectations, simply reach out to our support team within 90 days.
        </p>
        <h4>3. 100% Risk-Free Guarantee</h4>
        <p>
          Our guarantee ensures that your investment in everyday wellness is completely protected and risk-free.
        </p>
      </>
    ),
  },
};

export const PolicyModal = ({ policyType, onClose }) => {
  if (!policyType || !POLICIES_DATA[policyType]) return null;

  const policy = POLICIES_DATA[policyType];
  const Icon = policy.icon;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backgroundColor: 'rgba(27, 38, 19, 0.75)',
          backdropFilter: 'blur(10px)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#F6FFFC',
            borderRadius: '24px',
            border: '1.5px solid rgba(75, 104, 51, 0.2)',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            color: 'var(--color-primary)',
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: '1.75rem 2rem',
              borderBottom: '1px solid rgba(75, 104, 51, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#EEE9DE',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(75, 104, 51, 0.12)',
                  color: 'var(--color-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--color-primary)',
                    margin: 0,
                  }}
                >
                  {policy.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                  Effective Date: {policy.lastUpdated}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Policy Modal"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(75, 104, 51, 0.2)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div
            style={{
              padding: '2rem',
              overflowY: 'auto',
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'var(--color-secondary)',
            }}
            className="policy-modal-body"
          >
            {policy.content}
          </div>

          {/* Modal Footer Button */}
          <div
            style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid rgba(75, 104, 51, 0.12)',
              backgroundColor: '#EEE9DE',
              textAlign: 'right',
            }}
          >
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'var(--color-sage)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.8125rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              CLOSE
            </button>
          </div>
        </motion.div>

        <style>{`
          .policy-modal-body h4 {
            font-family: var(--font-sans);
            font-size: 0.9375rem;
            font-weight: 700;
            color: var(--color-primary);
            margin: 1.5rem 0 0.5rem 0;
          }
          .policy-modal-body p {
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
};
