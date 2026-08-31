import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  Award, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  Star, 
  Clock,
  BookOpen,
  XCircle,
  Leaf,
  Sprout,
  Droplets,
  Activity,
  GlassWater,
  RefreshCw,
  Zap
} from 'lucide-react';

const CHECKOUT_URL = "https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814";

export function SlimSodaListicle({ onNavHome }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewFormName, setReviewFormName] = useState('');
  const [reviewFormTitle, setReviewFormTitle] = useState('');
  const [reviewFormBody, setReviewFormBody] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleGoToCheckout = (e) => {
    if (e) e.preventDefault();
    window.location.href = CHECKOUT_URL;
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="listicle-slimsoda-wrapper" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--color-primary)', minHeight: '100vh' }}>
      
      {/* 01 — STICKY EDITORIAL & BRAND HEADER BAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#1B2613',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Top Editorial Strip */}
        <div style={{
          backgroundColor: '#0D1508',
          color: '#E2E8F0',
          padding: '6px 16px',
          fontSize: '10.5px',
          fontWeight: 600,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--color-slimsoda, #D96B32)', fontWeight: 800 }}>ESSENTIAL GOOD</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>WELLNESS EDIT</span>
          </div>
          <div className="desktop-only" style={{ opacity: 0.7, fontSize: '10px', letterSpacing: '0.8px' }}>
            • SPONSORED WELLNESS FEATURE
          </div>
        </div>

        {/* Main Listicle Brand Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          {/* Logo Button */}
          <button 
            onClick={onNavHome}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: 0,
              flexShrink: 0
            }}
          >
            <img 
              src="/assets/home/logo/logo_brand_white.png" 
              alt="Essential Good" 
              style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'block';
                }
              }}
            />
            <span style={{
              display: 'none',
              fontFamily: 'var(--font-brand-display)',
              fontSize: '20px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '1px'
            }}>
              ESSENTIAL GOOD
            </span>
          </button>

          {/* Center Badge (Desktop Only) */}
          <div className="desktop-only" style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '0.5px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#27AE60' }}></span>
            <span>FEATURED ARTICLE: SLIMSODA®</span>
          </div>

          {/* Action CTA -> Checkout */}
          <a
            href={CHECKOUT_URL}
            onClick={handleGoToCheckout}
            style={{
              backgroundColor: '#27AE60',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.3px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <span>SHOP SLIMSODA®</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </header>

      {/* ARTICLE CONTAINER */}
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '30px 16px 20px' }}>
        
        {/* 02 — HERO SECTION */}
        <header style={{ marginBottom: '32px', textAlign: 'center' }}>
          {/* CLEAN PILL BADGE WITHOUT ICON/SPARKLES */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(217, 107, 50, 0.1)',
            color: 'var(--color-slimsoda, #D96B32)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            <span>THE SIMPLER WELLNESS MOVEMENT</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: 'clamp(24px, 5vw, 44px)',
            lineHeight: '1.18',
            fontWeight: 600,
            color: 'var(--color-primary)',
            margin: '12px 0 16px',
            letterSpacing: '-0.5px'
          }}>
            5 Reasons Simple Powdered Wellness Routines Are Getting So Much Attention
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16.5px',
            lineHeight: '1.6',
            color: 'var(--color-secondary)',
            marginBottom: '20px',
            maxWidth: '760px',
            marginInline: 'auto'
          }}>
            From overflowing supplement cabinets to elaborate morning protocols, wellness has become increasingly complicated. Here's why a simpler approach — built around consistency, convenience and thoughtfully selected ingredients — is gaining traction.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--color-muted)',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            padding: '10px 0',
            fontWeight: 500
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} /> 3 MIN READ
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <BookOpen size={14} /> WELLNESS & NUTRITION
            </span>
          </div>
        </header>

        {/* HERO IMAGE 01: slimsoda_hero_morning.jpg (FLUID 16:9 ASPECT RATIO) */}
        <div style={{
          backgroundColor: 'var(--bg-card-alt)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          width: '100%',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          marginBottom: '40px',
          position: 'relative',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/assets/listicle/slimsoda/slimsoda_hero_morning.jpg" 
            alt="SlimSoda Morning Routine" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.src = "/assets/listicle/slimsoda/slimsoda_hero_morning.jpg";
            }}
          />
        </div>

        {/* 03 — OPENING ARTICLE CONTENT */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '26px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: 1.3
          }}>
            THE PROBLEM ISN'T YOUR BODY. IT'S THE COMPLEXITY.
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '18px' }}>
              Open almost any social media app and wellness can start to look like a full-time job.
            </p>
            <p style={{ marginBottom: '12px', paddingLeft: '16px', borderLeft: '3px solid var(--color-slimsoda)' }}>
              One capsule before breakfast.<br />
              Another after lunch.<br />
              A powder before training.<br />
              Something else before bed.
            </p>
            <p style={{ marginBottom: '18px' }}>
              Then there's the meal plan, the hydration tracker, the step goal and whatever new “must-have” ingredient appeared online this week.
            </p>
            <p style={{ marginBottom: '18px' }}>
              At some point, a routine designed to make life healthier can become surprisingly difficult to maintain.
            </p>
            <p style={{ marginBottom: '24px', fontWeight: 600, color: 'var(--color-primary)', fontSize: '18px' }}>
              And that's leading to a much simpler question: What if a better wellness routine isn't about adding more — but making the basics easier to stick with?
            </p>
            <p style={{ marginBottom: '24px' }}>
              That's part of the reason simple powdered formulas have started attracting attention. One of them is <strong>SlimSoda®</strong>, a powdered dietary supplement designed around a straightforward philosophy: selected ingredients + simple preparation + everyday consistency. No miracle language required.
            </p>

            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <button 
                onClick={() => scrollToSection('reason-1')}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-slimsoda)',
                  border: '1.5px solid var(--color-slimsoda)',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s ease'
                }}
              >
                SEE WHY THE FORMULA IS DIFFERENT ↓
              </button>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 04 — REASON #1 */}
        <section id="reason-1" style={{ marginBottom: '56px' }}>
          {/* PROMINENT REASON BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(217, 107, 50, 0.12)',
            color: 'var(--color-slimsoda, #D96B32)',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            marginBottom: '14px'
          }}>
            REASON #1
          </div>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '32px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            IT TURNS SUPPLEMENTATION INTO ONE SIMPLE ACTION
          </h2>

          {/* IMAGE 02: slimsoda_scoop_action.jpg (FLUID 16:9 ASPECT RATIO) */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/assets/listicle/slimsoda/slimsoda_scoop_action.jpg" 
              alt="SlimSoda Scoop Action" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/listicle/slimsoda/slimsoda_scoop_action.jpg";
              }}
            />
          </div>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              Most wellness routines don't fail because people don't care. They become difficult when there are too many steps.
            </p>
            <p style={{ marginBottom: '16px' }}>
              SlimSoda was built around an intentionally uncomplicated format: <strong>Mix it with water according to the directions. That's it.</strong>
            </p>
            <p style={{ marginBottom: '16px' }}>
              No multiple bottles spread across the counter. No complicated preparation. No trying to remember which capsule belongs to which time of day.
            </p>
            <p style={{ marginBottom: '24px' }}>
              The value of that simplicity is easy to underestimate. Because when a habit is easier to perform, it becomes easier to repeat. And when it comes to lifestyle routines, consistency usually matters more than novelty.
            </p>
          </div>

          {/* HIGHLIGHT BADGE */}
          <div style={{
            backgroundColor: 'var(--bg-footer)',
            color: '#FFFFFF',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            margin: '28px 0'
          }}>
            <div style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '24px',
              letterSpacing: '2px',
              color: 'var(--color-slimsoda)',
              marginBottom: '8px'
            }}>
              MIX. SIP. KEEP MOVING.
            </div>
            <div style={{ fontSize: '14px', color: '#A0AEC0' }}>
              One small routine designed for everyday consistency.
            </div>
          </div>

          {/* MINI-BLOCK WHY IT MATTERS */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderLeft: '4px solid var(--color-sage)',
            padding: '20px',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1px', color: 'var(--color-sage)', marginBottom: '6px' }}>
              WHY IT MATTERS
            </h4>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--color-primary)' }}>
              SlimSoda was designed to complement — not replace — balanced nutrition, hydration, movement, sleep and other healthy habits.
            </p>
          </div>

          <a 
            href={CHECKOUT_URL}
            onClick={handleGoToCheckout}
            style={{
              backgroundColor: '#27AE60',
              color: '#FFF',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <span>EXPLORE SLIMSODA®</span>
            <ArrowRight size={15} />
          </a>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 05 — REASON #2 INGREDIENTS */}
        <section style={{ marginBottom: '56px' }}>
          {/* PROMINENT REASON BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(217, 107, 50, 0.12)',
            color: 'var(--color-slimsoda, #D96B32)',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            marginBottom: '14px'
          }}>
            REASON #2
          </div>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '32px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            THE FORMULA STARTS WITH INGREDIENTS PEOPLE ARE ALREADY TALKING ABOUT
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)', marginBottom: '32px' }}>
            <p style={{ marginBottom: '16px' }}>
              SlimSoda doesn't rely on one mysterious proprietary story. Its formula brings together ingredients that already have a place in today's wellness conversation.
            </p>
            <p style={{ marginBottom: '16px' }}>
              That includes <strong>berberine, ginger extract, sodium bicarbonate and NAD+ support</strong>.
            </p>
            <p style={{ marginBottom: '16px' }}>
              But there's an important distinction: <em>An interesting ingredient isn't the same thing as a miracle result.</em> The science around these compounds varies significantly — which is why responsible formulation and realistic expectations matter.
            </p>
          </div>

          {/* 4 INGREDIENT CARDS WITH PHOTOS & DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            
            {/* INGREDIENT 1: BERBERINE */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <div>
                {/* Ingredient Image */}
                <div style={{
                  width: '100%',
                  height: '150px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid var(--color-border)'
                }}>
                  <img 
                    src="/assets/listicle/slimsoda/ingredient_berberine.jpg" 
                    alt="Berberine Botanical Extract" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/listicle/slimsoda/ingredient_berberine.jpg";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-slimsoda)', letterSpacing: '1px', marginBottom: '4px' }}>
                      KEY BOTANICAL
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      BERBERINE
                    </h3>
                  </div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(217,107,50,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-slimsoda)',
                    flexShrink: 0
                  }}>
                    <Leaf size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  One of the most researched ingredients in the formula
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Berberine is a plant-derived compound that has attracted substantial scientific attention in metabolic-health research. It has been evaluated in human studies involving metabolic markers, although researchers continue to call for higher-quality trials.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(217,107,50,0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: 'var(--color-slimsoda)' }}>WHY IT'S INCLUDED:</strong> To complement SlimSoda's broader metabolic-wellness formulation.*
              </div>
            </div>

            {/* INGREDIENT 2: GINGER EXTRACT */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <div>
                {/* Ingredient Image */}
                <div style={{
                  width: '100%',
                  height: '150px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid var(--color-border)'
                }}>
                  <img 
                    src="/assets/listicle/slimsoda/ingredient_ginger.jpg" 
                    alt="Ginger Extract" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/listicle/slimsoda/ingredient_ginger.jpg";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-sage)', letterSpacing: '1px', marginBottom: '4px' }}>
                      HERBAL EXTRACT
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      GINGER EXTRACT
                    </h3>
                  </div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(75,104,51,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-sage)',
                    flexShrink: 0
                  }}>
                    <Sprout size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  A familiar botanical with a long history of use
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Ginger has been used for centuries in food and traditional wellness practices. Modern clinical research has examined ginger in several areas of gastrointestinal function and digestive comfort.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(75,104,51,0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: 'var(--color-sage)' }}>WHY IT'S INCLUDED:</strong> As part of SlimSoda's digestive-wellness approach.*
              </div>
            </div>

            {/* INGREDIENT 3: SODIUM BICARBONATE */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <div>
                {/* Ingredient Image */}
                <div style={{
                  width: '100%',
                  height: '150px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid var(--color-border)'
                }}>
                  <img 
                    src="/assets/listicle/slimsoda/ingredient_bicarbonate.jpg" 
                    alt="Sodium Bicarbonate Mineral" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/listicle/slimsoda/ingredient_bicarbonate.jpg";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-slimsoda)', letterSpacing: '1px', marginBottom: '4px' }}>
                      EFFERVESCENT BASE
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      SODIUM BICARBONATE
                    </h3>
                  </div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(217,107,50,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-slimsoda)',
                    flexShrink: 0
                  }}>
                    <Droplets size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  Familiar doesn't mean uninteresting
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Sodium bicarbonate is one of the most recognizable compounds in the formula. In SlimSoda, it's simply one component of the powdered blend — not a standalone “weight-loss hack.”
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(217,107,50,0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: 'var(--color-slimsoda)' }}>WHY IT'S INCLUDED:</strong> As part of SlimSoda's distinctive powdered formulation.
              </div>
            </div>

            {/* INGREDIENT 4: NAD+ SUPPORT */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <div>
                {/* Ingredient Image */}
                <div style={{
                  width: '100%',
                  height: '150px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid var(--color-border)'
                }}>
                  <img 
                    src="/assets/listicle/slimsoda/ingredient_nad.jpg" 
                    alt="NAD+ Cellular Energy Support" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/listicle/slimsoda/ingredient_nad.jpg";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-sage)', letterSpacing: '1px', marginBottom: '4px' }}>
                      CELLULAR COFACTOR
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      NAD+ SUPPORT
                    </h3>
                  </div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(75,104,51,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-sage)',
                    flexShrink: 0
                  }}>
                    <Activity size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  Part of a broader wellness formulation
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  NAD+ is involved in fundamental cellular processes, including energy metabolism. Research into NAD+-related supplementation is active and evolving.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(75,104,51,0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: 'var(--color-sage)' }}>WHY IT'S INCLUDED:</strong> To complement the formula's overall wellness positioning.*
              </div>
            </div>

          </div>

          <div style={{
            backgroundColor: 'var(--bg-card-alt)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 24px',
            textAlign: 'center',
            fontSize: '15px',
            lineHeight: '1.6',
            color: 'var(--color-primary)'
          }}>
            <strong>No single ingredient does all the work. And that's precisely the point.</strong><br />
            SlimSoda isn't positioned around one “magic” compound. It's a convenient way to bring selected wellness ingredients into one repeatable routine.
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 06 — REASON #3 METABOLIC WELLNESS */}
        <section style={{ marginBottom: '56px' }}>
          {/* PROMINENT REASON BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(217, 107, 50, 0.12)',
            color: 'var(--color-slimsoda, #D96B32)',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            marginBottom: '14px'
          }}>
            REASON #3
          </div>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '32px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            IT'S BUILT AROUND METABOLIC WELLNESS — NOT MIRACLE PROMISES
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              For years, weight-management marketing followed a predictable formula: <em>Promise more. Promise faster. Promise easier.</em>
            </p>
            <p style={{ marginBottom: '16px' }}>
              But sustainable wellness is more complicated than one ingredient, one food or one supplement.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Nutrition matters. Movement matters. Sleep matters. Hydration matters. Appetite and eating behavior matter. And metabolic health is influenced by many interconnected factors.
            </p>
            <p style={{ marginBottom: '24px' }}>
              SlimSoda was designed to complement those fundamentals, not pretend they don't exist.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-footer)',
              color: '#FFFFFF',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: '28px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-slimsoda)', letterSpacing: '0.5px', marginBottom: '4px' }}>
                NOT A REPLACEMENT FOR HEALTHY HABITS.
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF' }}>
                DESIGNED TO FIT ALONGSIDE THEM.
              </div>
            </div>

            <p style={{ marginBottom: '16px' }}>
              That's also why the language around SlimSoda focuses on:
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
              {[
                'Metabolic wellness support*',
                'Healthy appetite-management habits*',
                'Digestive wellness*',
                'Daily consistency'
              ].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-slimsoda)', flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p style={{ marginBottom: '24px' }}>
              rather than promising a specific number on the scale.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              marginBottom: '28px'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--color-slimsoda)' }}>And surprisingly, that may be one of SlimSoda's biggest advantages:</span> It's designed to make the routine easier — not more extreme.
            </div>

            <a 
              href={CHECKOUT_URL}
              onClick={handleGoToCheckout}
              style={{
                backgroundColor: 'transparent',
                color: '#27AE60',
                border: '1.5px solid #27AE60',
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              SEE THE COMPLETE FORMULA →
            </a>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 07 — REASON #4 FITS REAL LIFE */}
        <section style={{ marginBottom: '56px' }}>
          {/* PROMINENT REASON BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(217, 107, 50, 0.12)',
            color: 'var(--color-slimsoda, #D96B32)',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            marginBottom: '14px'
          }}>
            REASON #4
          </div>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '32px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            IT FITS INTO REAL LIFE
          </h2>

          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '24px' }}>
            A wellness product only matters if people actually use it.
          </p>

          {/* IMAGE 04: slimsoda_routine_comparison.jpg (FLUID 16:9 ASPECT RATIO) */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/assets/listicle/slimsoda/slimsoda_routine_comparison.jpg" 
              alt="SlimSoda Routine Comparison" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/listicle/slimsoda/slimsoda_routine_comparison.jpg";
              }}
            />
          </div>

          {/* CONTRAST ROUTINES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '24px'
            }}>
              <div style={{ color: '#DC2626', fontWeight: 700, fontSize: '13px', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <XCircle size={16} /> ROUTINE 1 — COMPLEX
              </div>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--color-secondary)' }}>
                Six different bottles, complicated dosage instructions, multiple alarms throughout the day, and a kitchen counter that looks like a pharmacy cabinet.
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(75, 104, 51, 0.08)',
              border: '1px solid var(--color-sage)',
              borderRadius: 'var(--radius-md)',
              padding: '24px'
            }}>
              <div style={{ color: 'var(--color-sage)', fontWeight: 700, fontSize: '13px', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> ROUTINE 2 — SLIMSODA
              </div>
              <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)', margin: '8px 0' }}>
                Scoop. Water. Mix.
              </p>
              <p style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>
                Which one sounds easier to repeat day after day?
              </p>
            </div>
          </div>

          {/* 3 STEPS CARDS FIXED WITHOUT TITLE WRAPPING */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {/* STEP 1 */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(217,107,50,0.12)',
                color: 'var(--color-slimsoda)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <RefreshCw size={22} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-slimsoda)', marginBottom: '8px', whiteSpace: 'nowrap' }}>
                01 — MIX
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--color-secondary)' }}>
                Add SlimSoda to water according to the product directions.
              </p>
            </div>

            {/* STEP 2 */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(217,107,50,0.12)',
                color: 'var(--color-slimsoda)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <GlassWater size={22} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-slimsoda)', marginBottom: '8px', whiteSpace: 'nowrap' }}>
                02 — SIP
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--color-secondary)' }}>
                Make it part of your daily wellness routine.
              </p>
            </div>

            {/* STEP 3 */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(217,107,50,0.12)',
                color: 'var(--color-slimsoda)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Zap size={22} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-slimsoda)', marginBottom: '8px', whiteSpace: 'nowrap' }}>
                03 — KEEP MOVING
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--color-secondary)' }}>
                Continue focusing on nutrition, hydration, movement and sleep.
              </p>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            fontFamily: 'var(--font-brand-display)',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            marginBottom: '16px'
          }}>
            ONE SMALL ROUTINE. LESS DAILY COMPLEXITY.
          </div>

          <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--color-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            There are no points for making wellness harder than it needs to be. The goal is not to build the most impressive routine — the goal is to build one you can maintain.
          </p>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 08 — REASON #5 90-DAY GUARANTEE */}
        <section style={{ marginBottom: '56px' }}>
          {/* PROMINENT REASON BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(217, 107, 50, 0.12)',
            color: 'var(--color-slimsoda, #D96B32)',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            marginBottom: '14px'
          }}>
            REASON #5
          </div>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '32px',
            color: 'var(--color-primary)',
            marginBottom: '28px',
            lineHeight: '1.2'
          }}>
            YOU DON'T HAVE TO COMMIT FOREVER TO FIND OUT IF IT FITS YOUR ROUTINE
          </h2>

          {/* 2-COLUMN GUARANTEE LAYOUT (NO WHITE BOX BACKGROUND) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* LEFT COLUMN: ENLARGED GUARANTEE SEAL BADGE */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                background: 'radial-gradient(circle, rgba(39, 174, 96, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
                borderRadius: '50%'
              }} />
              <img
                src="/assets/home/brand/guarantee_badge.png"
                alt="EssencialGood 90-Day Guarantee Badge"
                style={{
                  maxHeight: '320px',
                  maxWidth: '320px',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.12))',
                  position: 'relative',
                  zIndex: 2
                }}
              />
            </div>

            {/* RIGHT COLUMN: TEXT CONTENT + CTA + TRUST BADGES */}
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '1.5px',
                color: '#27AE60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                padding: '6px 16px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '12px'
              }}>
                RISK-FREE GUARANTEE
              </div>

              <h3 style={{
                fontFamily: 'var(--font-brand-display)',
                fontSize: '32px',
                fontWeight: 900,
                color: 'var(--color-primary)',
                marginBottom: '12px',
                lineHeight: '1.2'
              }}>
                90 DAYS TO DECIDE
              </h3>

              <p style={{
                fontSize: '16px',
                lineHeight: '1.65',
                color: 'var(--color-secondary)',
                marginBottom: '20px'
              }}>
                Supplements are personal. What fits one person's routine may not fit another's. That's why SlimSoda® purchases are backed by a <strong>90-Day Money-Back Guarantee</strong>.
              </p>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: 'var(--color-secondary)',
                marginBottom: '24px'
              }}>
                Give the routine a fair opportunity. If it doesn't fit your daily routine, simply contact us according to our refund policy.
              </p>

              {/* CTA BUTTON */}
              <div style={{ marginBottom: '24px' }}>
                <a
                  href={CHECKOUT_URL}
                  onClick={handleGoToCheckout}
                  style={{
                    backgroundColor: '#27AE60',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    boxShadow: '0 6px 20px rgba(39, 174, 96, 0.3)'
                  }}
                >
                  <span>TRY SLIMSODA® RISK-FREE</span>
                  <ArrowRight size={15} />
                </a>
              </div>

              {/* TRUST INDICATORS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(39, 174, 96, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Award size={16} style={{ color: '#27AE60', flexShrink: 0 }} /> Third-Party Tested
                </div>

                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(39, 174, 96, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={16} style={{ color: '#27AE60', flexShrink: 0 }} /> U.S. Made
                </div>

                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(39, 174, 96, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Lock size={16} style={{ color: '#27AE60', flexShrink: 0 }} /> Secure Checkout
                </div>

                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(39, 174, 96, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Truck size={16} style={{ color: '#27AE60', flexShrink: 0 }} /> Free U.S. Shipping*
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 09 — PRODUCT REVEAL */}
        <section style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 28px',
          marginBottom: '56px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.05)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-slimsoda)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
              THE FORMULA BEHIND THE ROUTINE
            </div>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '36px',
              color: 'var(--color-primary)',
              marginBottom: '12px'
            }}>
              MEET SLIMSODA®
            </h2>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-secondary)' }}>
              Selected ingredients. One powdered formula. One simple routine.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
            {/* PRODUCT IMAGE 03: slimsoda_product_tub.jpg (1:1 SQUARE ASPECT RATIO) */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}>
              <img 
                src="/assets/listicle/slimsoda/slimsoda_product_tub.jpg" 
                alt="SlimSoda Product Tub" 
                style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 'var(--radius-md)', display: 'block' }}
                onError={(e) => {
                  e.target.src = "/assets/listicle/slimsoda/slimsoda_product_tub.jpg";
                }}
              />
            </div>

            {/* DETAILS */}
            <div>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '20px' }}>
                SlimSoda is an easy-to-mix dietary supplement designed for adults looking for a straightforward way to complement an existing wellness routine.*
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '28px' }}>
                {[
                  'Easy-to-mix powdered format',
                  'Selected wellness ingredients',
                  'Supports metabolic wellness*',
                  'Complements healthy appetite-management habits*',
                  'Supports digestive wellness*',
                  'Designed for consistent daily use'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--color-slimsoda)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <a 
                href={CHECKOUT_URL}
                onClick={handleGoToCheckout}
                style={{
                  backgroundColor: '#27AE60',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>DISCOVER SLIMSODA®</span>
                <ArrowRight size={15} />
              </a>
              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-muted)' }}>
                View ingredients, directions, bundles & guarantee
              </div>
            </div>
          </div>
        </section>

        {/* 10 — WHAT SLIMSODA IS AND ISN'T */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '30px',
              color: 'var(--color-primary)',
              marginBottom: '4px'
            }}>
              WHAT SLIMSODA IS — AND WHAT IT ISN'T
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
              Transparency is our core standard.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            {/* IS */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--color-sage)',
              borderRadius: '16px',
              padding: '32px 28px',
              boxShadow: '0 8px 24px rgba(75, 104, 51, 0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: 'var(--color-sage)',
                borderRadius: '16px 16px 0 0'
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(75, 104, 51, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-sage)' }} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-sage)', letterSpacing: '1px', margin: 0 }}>
                  SLIMSODA IS:
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'A powdered dietary supplement.',
                  'A convenient wellness routine.',
                  'A blend of selected ingredients.',
                  'Designed to complement healthy habits.*'
                ].map((item, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '14px',
                    fontSize: '15px',
                    color: 'var(--color-primary)',
                    fontWeight: 500,
                    lineHeight: '1.4'
                  }}>
                    <CheckCircle2 size={17} style={{ color: 'var(--color-sage)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ISN'T */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid rgba(220, 38, 38, 0.25)',
              borderRadius: '16px',
              padding: '32px 28px',
              boxShadow: '0 8px 24px rgba(220, 38, 38, 0.06)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: '#DC2626',
                borderRadius: '16px 16px 0 0'
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <XCircle size={18} style={{ color: '#DC2626' }} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#DC2626', letterSpacing: '1px', margin: 0 }}>
                  SLIMSODA ISN'T:
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'A prescription medication.',
                  'A substitute for professional medical care.',
                  'A replacement for nutrition or physical activity.',
                  'A guaranteed overnight transformation.'
                ].map((item, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '14px',
                    fontSize: '15px',
                    color: 'var(--color-primary)',
                    fontWeight: 500,
                    lineHeight: '1.4'
                  }}>
                    <XCircle size={17} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            fontStyle: 'italic'
          }}>
            No magic required. Just a simpler approach to consistency.
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 10.5 — UGC SOCIAL PROOF SECTION (PERFECTLY CENTERED ON DESKTOP & MOBILE) */}
        <section className="ugc-banner-section">
          <div className="ugc-banner-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            alignItems: 'center',
            width: '100%'
          }}>
            {/* Left Column: Customer Graphic Card (ENLARGED 520px 1:1 IMAGE) */}
            <div className="ugc-banner-img-container" style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '520px',
              justifySelf: 'center'
            }}>
              <img 
                src="/assets/listicle/slimsoda/slimsoda_ugc_card.jpg" 
                alt="SlimSoda Real Customer Reviews Collage" 
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '1 / 1',
                  display: 'block',
                  objectFit: 'cover',
                  borderRadius: '24px'
                }}
                onError={(e) => {
                  e.target.src = "/assets/listicle/slimsoda/slimsoda_ugc_card.jpg";
                }}
              />
            </div>

            {/* Right Column: Clean Fluid Headline, Paragraph & CTA */}
            <div>
              <div style={{
                fontSize: '12.5px',
                fontWeight: 800,
                letterSpacing: '1.8px',
                color: '#27AE60',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                THE SIMPLER ROUTINE MOVEMENT
              </div>

              <h2 className="ugc-banner-headline" style={{
                fontFamily: 'var(--font-brand-display)',
                fontSize: 'clamp(28px, 4vw, 40px)',
                lineHeight: '1.2',
                fontWeight: 800,
                color: 'var(--color-primary)',
                margin: '0 0 18px',
                letterSpacing: '-0.5px'
              }}>
                Simplify Your Morning. Support Your Daily Wellness.
              </h2>

              <p className="ugc-banner-text" style={{
                fontSize: '16.5px',
                lineHeight: '1.65',
                color: 'var(--color-secondary)',
                marginBottom: '28px',
                fontWeight: 400
              }}>
                One simple scoop of SlimSoda® mixed into water each morning — that is the entire protocol. No multiple pill bottles, no complicated schedules, no synthetic fillers. Real people are discovering how easy consistency becomes when wellness fits seamlessly into real life. Try it risk-free with our 90-Day Guarantee.
              </p>

              <div>
                <a 
                  href={CHECKOUT_URL}
                  onClick={handleGoToCheckout}
                  style={{
                    backgroundColor: '#27AE60',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '16px 36px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '15.5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    boxShadow: '0 6px 20px rgba(39, 174, 96, 0.25)'
                  }}
                >
                  <span>SEE SLIMSODA BUNDLES</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 11 — SOCIAL PROOF — CUSTOMER REVIEWS (LIST STYLE WITH PHOTOS) */}
        <section id="reviews-section" style={{ marginBottom: '64px' }}>
          {/* Header matching reference image */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '0.14em',
              color: 'var(--color-sage, #27AE60)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}>
              CUSTOMER REVIEWS
            </span>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 900,
              color: '#141210',
              margin: '0 0 10px',
              letterSpacing: '-0.02em'
            }}>
              MADE FOR REAL-LIFE ROUTINES.
            </h2>
            <div style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#F5A623',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={18} fill="#F5A623" style={{ color: '#F5A623' }} />
                ))}
              </div>
              <span style={{ color: '#F5A623' }}>4.7/5 Customer Rating</span>
            </div>
          </div>

          {/* List-style Reviews Layout (Full Width Cards with Photos & Avatars) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                id: 1,
                author: 'Emily R.',
                initials: 'ER',
                stars: 5,
                title: 'EASY TO STAY CONSISTENT WITH',
                body: 'I wanted something simple enough to fit into my routine. SlimSoda is easy to mix with water and has become one of the easiest parts of my morning routine.',
                verified: true,
                img: '/assets/home/transformations/transformation-4.png'
              },
              {
                id: 2,
                author: 'Jessica T.',
                initials: 'JT',
                stars: 5,
                title: 'FITS NATURALLY INTO MY MORNING',
                body: 'I wanted a wellness routine that didn\'t involve several different bottles and schedules. SlimSoda makes it simple to stay consistent.',
                verified: true,
                img: '/assets/home/transformations/transformation-5.jpg'
              },
              {
                id: 3,
                author: 'Karen M.',
                initials: 'KM',
                stars: 5,
                title: 'SIMPLE AND CONVENIENT',
                body: 'A quick daily routine and I\'m done. Mixes quickly with cold water and fits easily into my day without hassle.',
                verified: true,
                img: '/assets/home/transformations/transformation-1.png'
              },
              {
                id: 4,
                author: 'Sarah H.',
                initials: 'SH',
                stars: 5,
                title: 'EASY TO MAKE PART OF MY DAY',
                body: 'No complicated preparation. I take it every morning and get on with my day. Highly recommend for anyone looking for simplicity.',
                verified: true,
                img: '/assets/home/transformations/transformation-3.png'
              }
            ].map((rev) => (
              <div
                key={rev.id}
                className="review-card-container"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* Customer Photo (LEFT on Desktop, BOTTOM on Mobile) */}
                {rev.img && (
                  <div className="review-card-img-wrapper" style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    position: 'relative'
                  }}>
                    <img
                      src={rev.img}
                      alt={`${rev.author} Routine Photo`}
                      style={{
                        width: '100%',
                        height: '118%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.src = "/LISTICLE SLIMSODA/Imagens/slimsoda_lifestyle_user.jpg";
                      }}
                    />
                  </div>
                )}

                {/* Text Content (RIGHT on Desktop, TOP on Mobile) */}
                <div className="review-card-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* 1. TOP ROW: Initials Badge + Name + Verified Buyer Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(39, 174, 96, 0.12)',
                        color: 'var(--color-sage, #27AE60)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                        flexShrink: 0
                      }}
                    >
                      {rev.initials}
                    </div>

                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#141210' }}>
                      {rev.author}
                    </span>

                    <span style={{
                      fontSize: '11.5px',
                      color: '#27AE60',
                      fontWeight: 700,
                      backgroundColor: 'rgba(39, 174, 96, 0.08)',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={12} /> Verified Buyer
                    </span>
                  </div>

                  {/* 2. SECOND ROW: 5 Gold Stars */}
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(rev.stars)].map((_, s) => (
                      <Star key={s} size={17} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                    ))}
                  </div>

                  {/* 3. THIRD ROW: Bold Serif Headline */}
                  <h3 style={{
                    fontFamily: 'var(--font-brand-display)',
                    fontSize: '17px',
                    fontWeight: 900,
                    color: '#141210',
                    margin: 0,
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase'
                  }}>
                    "{rev.title}"
                  </h3>

                  {/* 4. FOURTH ROW: Review Body Paragraph */}
                  <p style={{
                    fontSize: '15px',
                    color: '#333333',
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 400
                  }}>
                    "{rev.body}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 12 — MID-FUNNEL DARK BANNER CTA */}
        <section style={{
          backgroundColor: 'var(--bg-footer)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 28px',
          textAlign: 'center',
          marginBottom: '56px'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '30px',
            color: '#FFFFFF',
            marginBottom: '12px'
          }}>
            A SIMPLER ROUTINE STARTS WITH ONE SMALL STEP.
          </h2>
          <p style={{ fontSize: '16px', color: '#A0AEC0', maxWidth: '560px', margin: '0 auto 28px' }}>
            Discover the full SlimSoda formula, directions and today's available bundles.
          </p>

          <a 
            href={CHECKOUT_URL}
            onClick={handleGoToCheckout}
            style={{
              backgroundColor: '#27AE60',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '16px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <span>SEE SLIMSODA OPTIONS</span>
            <ArrowRight size={15} />
          </a>

          <div style={{ fontSize: '13px', color: '#718096', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <span>90-Day Money-Back Guarantee</span>
            <span>•</span>
            <span>Secure Checkout</span>
          </div>
        </section>

        {/* 13 — OFFER PREVIEW */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px', marginBottom: '6px' }}>
              OFFER PREVIEW
            </div>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '32px',
              color: 'var(--color-primary)',
              marginBottom: '8px'
            }}>
              SAVE MORE WHEN YOU STOCK UP
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)' }}>
              Multi-bottle bundles are available for customers who prefer to keep their routine consistent.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            
            {/* STARTER (1 BOTTLE) */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '18px',
              padding: '28px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
            }}>
              <div>
                {/* Bottle Product Visual */}
                <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <img
                    src="/assets/listicle/slimsoda/slimsoda-1.png"
                    alt="SlimSoda Starter Bottle"
                    style={{ maxHeight: '100%', maxWidth: '85%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-muted)', letterSpacing: '1px', marginBottom: '4px' }}>STARTER</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>Buy 1, Get 1 Free</div>
                <p style={{ fontSize: '13px', color: 'var(--color-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>Ideal for first-time daily consistency.</p>
              </div>
              <a 
                href={CHECKOUT_URL}
                onClick={handleGoToCheckout}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#27AE60',
                  color: '#FFF',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(39, 174, 96, 0.25)'
                }}
              >
                SELECT BUNDLE →
              </a>
            </div>

            {/* MOST POPULAR (4 BOTTLES) */}
            <div style={{
              backgroundColor: '#F6FCF8',
              border: '2.5px solid #27AE60',
              borderRadius: '18px',
              padding: '32px 20px 28px',
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 32px rgba(39, 174, 96, 0.18)',
              transform: 'scale(1.02)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#27AE60',
                color: '#FFF',
                padding: '4px 16px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '1px'
              }}>
                MOST POPULAR
              </div>
              <div>
                {/* Bottle Product Visual */}
                <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', marginTop: '6px' }}>
                  <img
                    src="/assets/listicle/slimsoda/slimsoda-2.png"
                    alt="SlimSoda 4-Bottle Bundle"
                    style={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>4-BOTTLE BUNDLE</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>Buy 2, Get 2 Free</div>
                <p style={{ fontSize: '13px', color: 'var(--color-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>Best balance for long-term routine.</p>
              </div>
              <a 
                href={CHECKOUT_URL}
                onClick={handleGoToCheckout}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#27AE60',
                  color: '#FFF',
                  padding: '13px 22px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 6px 16px rgba(39, 174, 96, 0.35)'
                }}
              >
                SELECT BUNDLE →
              </a>
            </div>

            {/* BEST VALUE (6 BOTTLES) */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--color-sage)',
              borderRadius: '18px',
              padding: '28px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(75, 104, 51, 0.08)'
            }}>
              <div>
                {/* Bottle Product Visual */}
                <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <img
                    src="/assets/listicle/slimsoda/slimsoda-3.png"
                    alt="SlimSoda Best Value Bundle"
                    style={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-sage)', letterSpacing: '1px', marginBottom: '4px' }}>BEST VALUE</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>Buy 3, Get 3 Free</div>
                <p style={{ fontSize: '13px', color: 'var(--color-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>Maximum savings & free shipping.</p>
              </div>
              <a 
                href={CHECKOUT_URL}
                onClick={handleGoToCheckout}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#27AE60',
                  color: '#FFF',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(39, 174, 96, 0.25)'
                }}
              >
                SELECT BUNDLE →
              </a>
            </div>

          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 14 — FAQ EDITORIAL */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '30px',
              color: 'var(--color-primary)'
            }}>
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: 'Is SlimSoda a weight-loss medication?',
                a: 'No. SlimSoda is a dietary supplement. It is not a prescription drug and should not be presented or used as a substitute for medical care or prescription medication.'
              },
              {
                q: 'Does SlimSoda replace diet and exercise?',
                a: 'No. SlimSoda is designed to complement a balanced lifestyle that includes appropriate nutrition, movement, hydration and other healthy habits.*'
              },
              {
                q: 'What makes the format different?',
                a: 'SlimSoda brings selected ingredients together in one powdered formula that is easy to mix with water and incorporate into a routine.'
              },
              {
                q: 'How quickly does it work?',
                a: 'Individual experiences vary, and no specific outcome or timeframe can be guaranteed.'
              },
              {
                q: 'Can I use it with medications?',
                a: 'Anyone taking medication, managing a medical condition, pregnant or nursing should consult a qualified healthcare professional before using a dietary supplement.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '16px',
                      color: 'var(--color-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', fontSize: '15px', lineHeight: '1.6', color: 'var(--color-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 15 — FINAL CLOSE */}
        <section style={{
          padding: '24px 0',
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px', marginBottom: '8px' }}>
            READY TO SIMPLIFY YOUR ROUTINE?
          </div>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '32px',
            color: 'var(--color-primary)',
            marginBottom: '16px'
          }}>
            WELLNESS DOESN'T HAVE TO FEEL LIKE A FULL-TIME JOB.
          </h2>

          <p style={{ fontSize: '16px', color: 'var(--color-secondary)', maxWidth: '580px', margin: '0 auto 20px' }}>
            SlimSoda brings selected ingredients together in one convenient powdered formula designed for everyday wellness.*
          </p>

          <div style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#27AE60',
            letterSpacing: '1px',
            marginBottom: '24px'
          }}>
            MIX. SIP. KEEP MOVING.
          </div>

          <a 
            href={CHECKOUT_URL}
            onClick={handleGoToCheckout}
            style={{
              backgroundColor: '#27AE60',
              color: '#FFF',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '20px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 6px 20px rgba(39, 174, 96, 0.3)'
            }}
          >
            <span>EXPLORE SLIMSODA®</span>
            <ArrowRight size={15} />
          </a>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600 }}>
            <span>✓ 90-Day Money-Back Guarantee</span>
            <span>✓ Free U.S. Shipping on Qualifying Bundles</span>
            <span>✓ Secure Checkout</span>
          </div>
        </section>

      </div>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#27AE60',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 6px 20px rgba(39, 174, 96, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 24px rgba(39, 174, 96, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(39, 174, 96, 0.4)';
          }}
        >
          <ChevronUp size={24} strokeWidth={2.5} />
        </button>
      )}

      {/* WRITE A REVIEW MODAL */}
      {reviewModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <button
              onClick={() => setReviewModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#888'
              }}
            >
              ×
            </button>

            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#141210', marginBottom: '8px' }}>
              Write a Review
            </h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Share your experience with SlimSoda®
            </p>

            {reviewSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#27AE60', fontWeight: 800, fontSize: '16px' }}>
                ✓ Thank you for your review! It will be verified shortly.
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                setReviewSubmitted(true);
                setTimeout(() => {
                  setReviewSubmitted(false);
                  setReviewModalOpen(false);
                  setReviewFormName('');
                  setReviewFormTitle('');
                  setReviewFormBody('');
                }, 2000);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: '#333' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewFormName}
                    onChange={(e) => setReviewFormName(e.target.value)}
                    placeholder="e.g. Sarah M."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: '#333' }}>
                    Review Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewFormTitle}
                    onChange={(e) => setReviewFormTitle(e.target.value)}
                    placeholder="e.g. Easy to make part of my morning"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: '#333' }}>
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewFormBody}
                    onChange={(e) => setReviewFormBody(e.target.value)}
                    placeholder="Tell us how SlimSoda fits into your routine..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--color-slimsoda, #D96B32)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SlimSodaListicle;
