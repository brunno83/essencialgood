import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BRAND_CONTENT } from '../../config/content';
import { CTAButton } from '../common/CTAButton';
import { ChevronDown } from 'lucide-react';

export const CinematicHero = () => {
  const { hero } = BRAND_CONTENT;
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Framer Motion Scroll Progress across 300vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Stable Text Animation Transforms (Flicker-free, solid opacity during scroll)
  const textYTransform = useTransform(scrollYProgress, [0, 0.7], ['0%', '-30%']);
  const textOpacityTransform = useTransform(scrollYProgress, [0, 0.45, 0.75], [1, 1, 0]);
  const overlayOpacityTransform = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.4, 0.7]);

  // Apple-Style Image Sequence Scrubber (60FPS Ultra-Smooth Optimized Response)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const TOTAL_FRAMES = 40;
    const images = [];
    let lastDrawnIndex = -1;

    // Robust Mobile Detection
    const checkIsMobile = () => {
      const w = window.innerWidth || document.documentElement.clientWidth || screen.width;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return w <= 800 || isMobileUA;
    };

    const isMobile = checkIsMobile();
    const frameFolder = isMobile ? '/assets/hero/frames_mobile' : '/assets/hero/frames';
    const fallbackFolder = '/assets/hero/frames';

    // Canvas Resize Handler with Ultra-Fast Rendering
    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = isMobile ? 'medium' : 'high';
      }

      // Force redraw on resize
      lastDrawnIndex = -1;
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    // Preload & Pre-decode Frame Sequence asynchronously for 0-lag playback
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async'; // Non-blocking async decoding!
      const paddedIndex = String(i).padStart(3, '0');
      
      img.src = `${frameFolder}/frame-${paddedIndex}.jpg`;
      img.onerror = () => {
        img.src = `${fallbackFolder}/frame-${paddedIndex}.jpg`;
      };
      
      if (img.decode) {
        img.decode().catch(() => {});
      }
      
      images.push(img);
    }

    let animationFrameId = null;
    let currentFrameIndex = 0;

    const render = () => {
      if (container) {
        const rect = container.getBoundingClientRect();
        const totalScrollableHeight = rect.height - window.innerHeight;

        if (totalScrollableHeight > 0) {
          const progress = Math.max(0, Math.min(1, -rect.top / totalScrollableHeight));
          const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
          
          // LERP interpolação entre frames
          const lerpFactor = isMobile ? 0.35 : 0.15;
          currentFrameIndex += (targetIndex - currentFrameIndex) * lerpFactor;
        }
      }

      const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameIndex)));

      // CRITICAL LAG FIX: Only redraw GPU canvas if frame index changed!
      if (ctx && frameIdx !== lastDrawnIndex) {
        const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        const cWidth = window.innerWidth;
        const cHeight = window.innerHeight;
        const activeImg = images[frameIdx];

        if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = isMobile ? 'medium' : 'high';
          ctx.clearRect(0, 0, cWidth, cHeight);

          const iWidth = activeImg.naturalWidth;
          const iHeight = activeImg.naturalHeight;
          const iAspect = iWidth / iHeight;
          const cAspect = cWidth / cHeight;

          let drawW, drawH, offX, offY;
          // Cover Fit
          if (cAspect > iAspect) {
            drawW = cWidth;
            drawH = cWidth / iAspect;
            offX = 0;
            offY = (cHeight - drawH) / 2;
          } else {
            drawH = cHeight;
            drawW = cHeight * iAspect;
            offX = (cWidth - drawW) / 2;
            offY = 0;
          }

          ctx.drawImage(activeImg, offX, offY, drawW, drawH);
          ctx.restore();
          lastDrawnIndex = frameIdx;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        position: 'relative',
        height: '300vh',
        backgroundColor: '#050705',
      }}
    >
      {/* Sticky Viewport Container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Apple-Style GPU Canvas Render Surface */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.05) saturate(1.04) brightness(0.96)',
            zIndex: 1,
          }}
        />

        {/* Dynamic Dark Gradient Overlay */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(10,12,10,0.15) 0%, rgba(10,12,10,0.85) 100%)',
            opacity: overlayOpacityTransform,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Hero Central Content (Solid, Flicker-free Opacity) */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '860px',
            padding: '0 1.5rem',
            y: textYTransform,
            opacity: textOpacityTransform,
          }}
        >
          {/* Brand Eyebrow Tagline */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-eyebrow"
            style={{
              display: 'inline-block',
              marginBottom: '1.25rem',
              color: '#EEE9DE',
              letterSpacing: '0.3em',
            }}
          >
            {hero.title}
          </motion.span>

          {/* Main Cinematic Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            style={{
              fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '0.01em',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-brand-display)',
              color: '#FFFFFF',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            {hero.tagline}
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 300,
              maxWidth: '640px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
            }}
          >
            "{hero.subtitle}"
          </motion.p>

          {/* Hero CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <CTAButton href="#meet-essentials" size="large">
              {hero.cta}
            </CTAButton>
          </motion.div>
        </motion.div>

        {/* Bottom Scroll Indicator Microcopy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'rgba(255, 255, 255, 0.7)',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {hero.scrollNotice}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
