import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SalesNotificationPopups({ onSelectProduct }) {
  const notifications = [
    {
      id: 1,
      name: 'Sarah M.',
      city: 'Austin, TX',
      product: 'SlimSoda® 6-Bottle Bundle',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/products/slimsoda-3.png',
      timeAgo: '2 minutes ago',
      productId: 'slimsoda'
    },
    {
      id: 2,
      name: 'Michael K.',
      city: 'Miami, FL',
      product: 'SlimSoda® 4-Bottle Bundle',
      deal: 'Buy 2, Get 2 FREE (Most Popular)',
      image: '/assets/products/slimsoda-2.png',
      timeAgo: '4 minutes ago',
      productId: 'slimsoda'
    },
    {
      id: 3,
      name: 'Jennifer L.',
      city: 'Denver, CO',
      product: 'SlimSoda® 2-Bottle Starter Bundle',
      deal: 'Buy 1, Get 1 FREE',
      image: '/assets/products/slimsoda-1.png',
      timeAgo: '6 minutes ago',
      productId: 'slimsoda'
    },
    {
      id: 4,
      name: 'Amanda B.',
      city: 'Chicago, IL',
      product: 'SlimSoda® 6-Bottle Bundle',
      deal: 'Buy 3, Get 3 FREE (Best Value)',
      image: '/assets/products/slimsoda-3.png',
      timeAgo: '8 minutes ago',
      productId: 'slimsoda'
    },
    {
      id: 5,
      name: 'David R.',
      city: 'Seattle, WA',
      product: 'SlimSoda® 4-Bottle Bundle',
      deal: 'Buy 2, Get 2 FREE',
      image: '/assets/products/slimsoda-2.png',
      timeAgo: '11 minutes ago',
      productId: 'slimsoda'
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // First popup appears after 4 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    return () => clearTimeout(initialTimer);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed || !visible) return;

    // Show popup for 6 seconds, then hide for 9 seconds before showing next
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % notifications.length);
        if (!dismissed) setVisible(true);
      }, 9000);
    }, 6000);

    return () => clearTimeout(hideTimer);
  }, [visible, dismissed, notifications.length]);

  if (dismissed) return null;
  const current = notifications[currentIdx];

  const handleClick = () => {
    if (onSelectProduct) {
      onSelectProduct(current.productId);
      const el = document.getElementById('bundles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
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
            border: '1.5px solid rgba(217, 107, 50, 0.25)',
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
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#D96B32', marginTop: '1px' }}>
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
