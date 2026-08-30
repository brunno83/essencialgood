import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SalesNotificationPopups({ onSelectProduct }) {
  const notifications = [
    // --- SLIMSODA ---
    {
      id: 1,
      name: 'Sarah M.',
      city: 'Austin, TX',
      product: 'SlimSODA® 6-Tub Bundle',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/pdp/slimsoda/slimsoda-3.png',
      timeAgo: '2 minutes ago',
      productId: 'slimsoda'
    },
    {
      id: 2,
      name: 'Michael K.',
      city: 'Miami, FL',
      product: 'SlimSODA® 4-Tub Bundle',
      deal: 'Buy 2, Get 2 FREE',
      image: '/assets/pdp/slimsoda/slimsoda-2.png',
      timeAgo: '5 minutes ago',
      productId: 'slimsoda'
    },
    {
      id: 3,
      name: 'Jennifer L.',
      city: 'Denver, CO',
      product: 'SlimSODA® 2-Tub Starter',
      deal: 'Buy 1, Get 1 FREE',
      image: '/assets/pdp/slimsoda/slimsoda-1.png',
      timeAgo: '8 minutes ago',
      productId: 'slimsoda'
    },
    {
      id: 4,
      name: 'David R.',
      city: 'Seattle, WA',
      product: 'SlimSODA® 6-Tub Bundle',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/pdp/slimsoda/slimsoda-3.png',
      timeAgo: '12 minutes ago',
      productId: 'slimsoda'
    },

    // --- LINFAFLOW ---
    {
      id: 5,
      name: 'Amanda B.',
      city: 'Chicago, IL',
      product: 'LinfaFlow® 6-Bottle Kit',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/pdp/linfaflow/linfaflow-bundle-3.png',
      timeAgo: '3 minutes ago',
      productId: 'linfaflow'
    },
    {
      id: 6,
      name: 'Robert T.',
      city: 'Phoenix, AZ',
      product: 'LinfaFlow® 4-Bottle Kit',
      deal: 'Buy 2, Get 2 FREE',
      image: '/assets/pdp/linfaflow/bundle-2.png',
      timeAgo: '6 minutes ago',
      productId: 'linfaflow'
    },
    {
      id: 7,
      name: 'Jessica W.',
      city: 'Portland, OR',
      product: 'LinfaFlow® 2-Bottle Starter',
      deal: 'Buy 1, Get 1 FREE',
      image: '/assets/pdp/linfaflow/bundle-1.png',
      timeAgo: '9 minutes ago',
      productId: 'linfaflow'
    },
    {
      id: 8,
      name: 'Brian S.',
      city: 'Dallas, TX',
      product: 'LinfaFlow® 6-Bottle Kit',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/pdp/linfaflow/linfaflow-bundle-3.png',
      timeAgo: '14 minutes ago',
      productId: 'linfaflow'
    },

    // --- SONNUS ---
    {
      id: 9,
      name: 'Elena M.',
      city: 'San Diego, CA',
      product: 'Sonnus® 6-Bottle Rest Pack',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/pdp/sonnus/product_sonnus_bottle.png',
      timeAgo: '1 minute ago',
      productId: 'sonnus'
    },
    {
      id: 10,
      name: 'Daniel H.',
      city: 'Boston, MA',
      product: 'Sonnus® 4-Bottle Pack',
      deal: 'Buy 2, Get 2 FREE',
      image: '/assets/pdp/sonnus/product_sonnus_bottle.png',
      timeAgo: '4 minutes ago',
      productId: 'sonnus'
    },
    {
      id: 11,
      name: 'Rachel V.',
      city: 'Atlanta, GA',
      product: 'Sonnus® 2-Bottle Pack',
      deal: 'Buy 1, Get 1 FREE',
      image: '/assets/pdp/sonnus/product_sonnus_bottle.png',
      timeAgo: '7 minutes ago',
      productId: 'sonnus'
    },
    {
      id: 12,
      name: 'Christopher P.',
      city: 'Nashville, TN',
      product: 'Sonnus® 6-Bottle Rest Pack',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/pdp/sonnus/product_sonnus_bottle.png',
      timeAgo: '11 minutes ago',
      productId: 'sonnus'
    },

    // --- CROWNED ---
    {
      id: 13,
      name: 'Claire T.',
      city: 'Los Angeles, CA',
      product: 'Crowned® 6-Bottle Scalp Kit',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/pdp/crowned/crowned-bundle-3.png',
      timeAgo: '2 minutes ago',
      productId: 'crowned'
    },
    {
      id: 14,
      name: 'Sophia M.',
      city: 'New York, NY',
      product: 'Crowned® 4-Bottle Scalp Kit',
      deal: 'Buy 2, Get 2 FREE',
      image: '/assets/pdp/crowned/crowned-bundle-2.png',
      timeAgo: '5 minutes ago',
      productId: 'crowned'
    },
    {
      id: 15,
      name: 'Karen B.',
      city: 'Charlotte, NC',
      product: 'Crowned® 2-Bottle Scalp Kit',
      deal: 'Buy 1, Get 1 FREE',
      image: '/assets/pdp/crowned/crowned-bundle-1.png',
      timeAgo: '9 minutes ago',
      productId: 'crowned'
    },
    {
      id: 16,
      name: 'Hannah G.',
      city: 'Minneapolis, MN',
      product: 'Crowned® 6-Bottle Scalp Kit',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/pdp/crowned/crowned-bundle-3.png',
      timeAgo: '13 minutes ago',
      productId: 'crowned'
    }
  ];

  // Shuffle list order on initial render so it varies on every page visit
  const [queue] = useState(() => {
    const list = [...notifications];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // First popup appears after a natural delay (8 to 12 seconds)
    const randomInitialDelay = Math.floor(Math.random() * 4000) + 8000;
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, randomInitialDelay);

    return () => clearTimeout(initialTimer);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed || !visible) return;

    // Show popup for 5.5 seconds, then hide for 20 to 35 seconds before showing next
    const hideTimer = setTimeout(() => {
      setVisible(false);

      const randomPause = Math.floor(Math.random() * 15000) + 20000;
      setTimeout(() => {
        if (!dismissed) {
          setCurrentIdx((prev) => (prev + 1) % queue.length);
          setVisible(true);
        }
      }, randomPause);
    }, 5500);

    return () => clearTimeout(hideTimer);
  }, [visible, dismissed, queue.length]);

  if (dismissed || !queue || queue.length === 0) return null;
  const current = queue[currentIdx];

  const handleClick = () => {
    if (onSelectProduct && current.productId) {
      onSelectProduct(current.productId);
      const el = document.getElementById('bundles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && current && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleClick}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 9990,
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid rgba(39, 174, 96, 0.25)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            maxWidth: '350px',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
          className="sales-popup-toast"
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              color: '#AAA',
              cursor: 'pointer',
              padding: '4px'
            }}
            aria-label="Close notification"
          >
            ✕
          </button>

          {/* Product Thumbnail */}
          <div 
            style={{ 
              width: '54px', 
              height: '54px', 
              borderRadius: '10px', 
              backgroundColor: '#FAF7F2', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            <img
              src={current.image}
              alt={current.product}
              style={{
                maxHeight: '46px',
                maxWidth: '46px',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Notification Copy */}
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#27AE60', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#27AE60' }} />
              Verified Purchase
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#141210', lineHeight: 1.3 }}>
              {current.name} <span style={{ fontWeight: 500, color: '#666' }}>from {current.city}</span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#27AE60', marginTop: '1px' }}>
              Purchased {current.deal}
            </div>
            <div style={{ fontSize: '10.5px', color: '#999', marginTop: '2px' }}>
              {current.timeAgo} • <span style={{ textDecoration: 'underline', color: '#141210', fontWeight: 700 }}>Claim Offer →</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
