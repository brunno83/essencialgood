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
  Zap,
  HelpCircle,
  ShieldCheck,
  Moon,
  Sparkles,
  Layers,
  Brain,
  HeartPulse,
  Smile,
  PackageCheck
} from 'lucide-react';

const CHECKOUT_URL = "https://cc.usesonnus.com/checkout.php?hid=b2lkPW9mZl80MjQwNDIwJmFpZD1hZmYxOTgyODE0JnVpZD1ibF85MDY6ODgw&affid=aff1982814";

export function SonnusListicle({ onNavHome, onSelectProduct }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeBuyerTab, setActiveBuyerTab] = useState(0);

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
    <div className="listicle-sonnus-wrapper" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--color-primary)', minHeight: '100vh' }}>
      
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
            <span style={{ color: '#27AE60', fontWeight: 800 }}>ESSENTIAL GOOD</span>
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
            <span>FEATURED ARTICLE: SONNUS®</span>
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
              justifyContent: 'center',
              gap: '6px',
              letterSpacing: '0.3px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              boxSizing: 'border-box',
              flexShrink: 0
            }}
          >
            <span>SHOP SONNUS®</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </header>

      {/* ARTICLE CONTAINER */}
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '30px 16px 20px' }}>
        
        {/* 02 — HERO SECTION */}
        <header style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(39, 174, 96, 0.12)',
            color: '#27AE60',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            <span>NIGHTTIME WELLNESS REPORT</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: 'clamp(24px, 5vw, 42px)',
            lineHeight: '1.18',
            fontWeight: 700,
            color: 'var(--color-primary)',
            margin: '12px 0 16px',
            letterSpacing: '-0.5px'
          }}>
            7 Reasons More People Are Rethinking Their Nighttime Routine — And Looking Beyond “Just More Melatonin”
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
            Sonnus combines 10 nighttime-support ingredients with just 0.9 mg of melatonin in two Wild Berry gummies — creating a simpler way to make winding down part of the night.
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
              <Clock size={14} /> 4 MIN READ
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <BookOpen size={14} /> BOTANICAL & NIGHTTIME WELLNESS
            </span>
          </div>
        </header>

        {/* HERO IMAGE */}
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
            src="/assets/listicle/sonnus/sonnus_hero_routine.jpg" 
            alt="Sonnus Nighttime Gummies Routine" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.src = "/assets/listicle/sonnus/gallery-1.png";
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
            SHOULD AN ENTIRE NIGHTTIME ROUTINE REALLY REVOLVE AROUND ONE INGREDIENT?
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '18px' }}>
              For years, the sleep-support aisle has followed a surprisingly simple formula: Put melatonin in a bottle. Increase the number on the front (3 mg... 5 mg... 10 mg...). Call it a nighttime solution.
            </p>
            <p style={{ marginBottom: '18px' }}>
              And while melatonin plays an important role in normal sleep-wake timing, there's an obvious question more people are starting to ask: <strong>IS MORE MELATONIN TRULY THE BETTER WAY?</strong>
            </p>
            <p style={{ marginBottom: '18px', paddingLeft: '16px', borderLeft: '3px solid #27AE60', fontStyle: 'italic' }}>
              Because the transition from a busy day into rest involves more than simply looking at the clock. There's the mental pace of the evening, screen exposure, late work, stress, caffeine, environment, and routine.
            </p>
            <p style={{ marginBottom: '18px' }}>
              That's where <strong>Sonnus®</strong> takes a different approach. Instead of building the entire formula around melatonin alone, Sonnus combines <strong>10 nighttime-support ingredients</strong> into two convenient Wild Berry gummies.
            </p>
            <p style={{ marginBottom: '24px' }}>
              Ten ingredients. Two gummies. One easy nightly ritual.
            </p>

            <div style={{
              backgroundColor: '#1B2613',
              color: '#FFFFFF',
              padding: '20px 24px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontFamily: 'var(--font-brand-display)', fontSize: '20px', color: '#27AE60', fontWeight: 700 }}>
                CHEW. UNWIND. REST.
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <button 
                onClick={() => scrollToSection('reason-1')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#27AE60',
                  border: '1.5px solid #27AE60',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                READ THE 7 REASONS BELOW ↓
              </button>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 04 — REASON #1 */}
        <section id="reason-1" style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(39, 174, 96, 0.12)',
            color: '#27AE60',
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
            fontSize: '30px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            YOUR NIGHT STARTS BEFORE YOUR HEAD HITS THE PILLOW
          </h2>

          {/* PRODUCT HIGHLIGHT IMAGE FOR REASON #1 */}
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
              src="/assets/listicle/sonnus/sonnus_evening_winddown.jpg" 
              alt="Sonnus Bedtime Routine Highlight" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/listicle/sonnus/gallery-2.png";
              }}
            />
          </div>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              One of the biggest mistakes people make with nighttime routines is thinking sleep begins the moment they get into bed. It doesn't. The transition starts earlier — as your environment changes, activity slows down, and stimulation drops.
            </p>
            
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '10px' }}>
                CREATING A CLEAR EVENING TRANSITION:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} style={{ color: '#27AE60' }} /> ON → OFF: Dimming lights and closing laptop work
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} style={{ color: '#27AE60' }} /> BUSY → QUIET: Reducing screen stimulation and late messages
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} style={{ color: '#27AE60' }} /> DAY → NIGHT: Giving your body a clear bedtime signal
                </li>
              </ul>
            </div>

            <p style={{ marginBottom: '24px' }}>
              Sonnus was built around that transition. Two gummies become a simple ritual you can pair with the habits that already support a better nighttime environment.
            </p>

            <div style={{
              backgroundColor: '#1B2613',
              color: '#FFFFFF',
              padding: '20px 24px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontFamily: 'var(--font-brand-display)', fontSize: '20px', color: '#27AE60', fontWeight: 700 }}>
                GIVE YOUR NIGHT A CLEAR BEGINNING.
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 05 — REASON #2 */}
        <section id="reason-2" style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(39, 174, 96, 0.12)',
            color: '#27AE60',
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
            fontSize: '30px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            SONNUS DOESN'T BUILD THE ENTIRE FORMULA AROUND MELATONIN
          </h2>

          {/* PRODUCT HIGHLIGHT IMAGE FOR REASON #2 */}
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
              src="/assets/listicle/sonnus/onnus_gummy_close-up.jpg" 
              alt="Sonnus 0.9mg Melatonin Formula" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/listicle/sonnus/gallery-4.png";
              }}
            />
          </div>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              Melatonin matters. It is a hormone naturally produced by the body and involved in normal sleep-wake timing. But Sonnus uses a different formula philosophy:
            </p>
            <p style={{ marginBottom: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>
              MELATONIN IS PART OF THE NIGHTTIME STORY — NOT THE ENTIRE STORY.
            </p>
            <p style={{ marginBottom: '24px' }}>
              Sonnus contains just <strong>0.9 mg of melatonin per serving</strong> as part of a broader 10-ingredient blend. Instead of relying on a single high-dose ingredient, the formula includes nutrients, amino acids and botanical compounds selected around nighttime wellness.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>
                MORE INGREDIENT STRATEGY. LESS DEPENDENCE ON ONE NUMBER.
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-secondary)', margin: 0 }}>
                0.9 mg Melatonin + Magnesium + L-Theanine + GABA + 5-HTP + Apigenin + Lemon Balm + B Vitamins.
              </p>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 06 — REASON #3 (10 INGREDIENTS GRID) */}
        <section id="reason-3" style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(39, 174, 96, 0.12)',
            color: '#27AE60',
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
            fontSize: '30px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            TEN NIGHTTIME-SUPPORT INGREDIENTS. NOT TEN SEPARATE BOTTLES.
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)', marginBottom: '28px' }}>
            <p style={{ marginBottom: '16px' }}>
              Imagine trying to build the Sonnus formula one product at a time: a bottle of magnesium, another of L-Theanine, GABA, 5-HTP, Apigenin, Lemon Balm, B vitamins, and Melatonin. Suddenly your "simple bedtime routine" has become another supplement stack.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Sonnus removes that friction by bringing together key complementary components:
            </p>
          </div>

          {/* 4 INGREDIENT CARDS WITH PHOTOS & DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            
            {/* INGREDIENT 1: MAGNESIUM */}
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
                    src="/assets/listicle/sonnus/ingredient_magnesium.jpg" 
                    alt="Magnesium Mineral Foundation" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/listicle/sonnus/section-ingredients.png";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      MINERAL FOUNDATION
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      MAGNESIUM
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Essential Mineral)
                    </div>
                  </div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(39, 174, 96, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#27AE60',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  Involved in normal nervous system and muscle function
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Essential mineral used widely in modern nighttime-wellness formulations to form part of a broader relaxation profile.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To form part of Sonnus' broader relaxation foundation.*
              </div>
            </div>

            {/* INGREDIENT 2: L-THEANINE */}
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
                    src="/assets/listicle/sonnus/ingredient_ltheanine.jpg" 
                    alt="L-Theanine Amino Acid" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/listicle/sonnus/section-benefits.png";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      TEA LEAF AMINO ACID
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      L-THEANINE
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Camellia sinensis extract)
                    </div>
                  </div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(39, 174, 96, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#27AE60',
                    flexShrink: 0
                  }}>
                    <Sprout size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  Well-studied amino acid associated with relaxation
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Occurs naturally in tea leaves and has attracted considerable research around relaxation and stress-response support.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To complement Sonnus' nighttime-calming approach.*
              </div>
            </div>

            {/* INGREDIENT 3: GABA & 5-HTP */}
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
                    src="/assets/listicle/sonnus/ingredient_gaba_5htp.jpg" 
                    alt="GABA and 5-HTP Precursors" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/listicle/sonnus/section-how-it-works.png";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      NEUROTRANSMITTER PATHWAYS
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      GABA & 5-HTP
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Inhibitory & Serotonin Co-factors)
                    </div>
                  </div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(39, 174, 96, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#27AE60',
                    flexShrink: 0
                  }}>
                    <Brain size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  Key components involved in body's natural signaling
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Naturally occurring amino acid compounds involved in normal neurotransmitter signaling throughout the nervous system.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To support multi-pathway relaxation.*
              </div>
            </div>

            {/* INGREDIENT 4: APIGENIN & LEMON BALM */}
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
                    src="/assets/listicle/sonnus/ingredient_apigenin_lemonbalm.jpg" 
                    alt="Apigenin and Lemon Balm Botanicals" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/listicle/sonnus/section-why-choose.png";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      EVENING BOTANICALS
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      APIGENIN & LEMON BALM
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Chamomile & Melissa officinalis)
                    </div>
                  </div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(39, 174, 96, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#27AE60',
                    flexShrink: 0
                  }}>
                    <Leaf size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  Classic evening plant compounds with traditional history
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Apigenin (found naturally in chamomile) and Lemon Balm have long histories of use in traditional evening preparations.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To add a botanical dimension to evening wellness.*
              </div>
            </div>

          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 07 — REASON #4 */}
        <section id="reason-4" style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(39, 174, 96, 0.12)',
            color: '#27AE60',
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
            fontSize: '30px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            THE FORMULA IS BUILT AROUND MULTIPLE PARTS OF NIGHTTIME WELLNESS
          </h2>

          {/* IMAGE FOR REASON #4 */}
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
              src="/assets/listicle/sonnus/sonnus_bedtime_ritual.jpg" 
              alt="Sonnus How It Works Routine" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/listicle/sonnus/section-how-it-works.png";
              }}
            />
          </div>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              Sonnus isn't trying to convince you that one ingredient is magic. Its story is the <strong>COMBINATION</strong>.
            </p>
            <p style={{ marginBottom: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>
              A good nighttime routine should help you slow down — not give you more things to think about.
            </p>
            <p style={{ marginBottom: '24px' }}>
              Think about how backwards some wellness routines have become: people reach bedtime exhausted, then open six supplement bottles, check three apps, review a sleep score, and set five alarms. Sonnus is intentionally simpler:
            </p>

            {/* 4-STEP RITUAL CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60', marginBottom: '4px' }}>01 — CHEW</div>
                <div style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>Take two Wild Berry gummies approx. 30 minutes before bedtime.</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60', marginBottom: '4px' }}>02 — UNWIND</div>
                <div style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>Dim the lights, lower stimulation, and put work away.</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60', marginBottom: '4px' }}>03 — REST</div>
                <div style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>Let your body transition naturally into a calmer evening environment.</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60', marginBottom: '4px' }}>04 — REPEAT</div>
                <div style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>Build a consistent nightly signal you can actually stick with.</div>
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 08 — REASON #5 */}
        <section id="reason-5" style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(39, 174, 96, 0.12)',
            color: '#27AE60',
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
            fontSize: '30px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            IT CHALLENGES THE "MORE MELATONIN MUST BE BETTER" MINDSET
          </h2>

          {/* IMAGE FOR REASON #5 */}
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
              src="/assets/listicle/sonnus/sonnus_routine_vs_stack.jpg" 
              alt="Sonnus Melatonin Philosophy Comparison" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/listicle/sonnus/section-comparison.png";
              }}
            />
          </div>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              Spend five minutes shopping for sleep gummies and you'll notice a trend: a lot of products compete using one number — Melatonin MG. Higher. Higher. Higher.
            </p>
            <p style={{ marginBottom: '16px' }}>
              But dose size isn't the same thing as product completeness. Instead of asking "How much melatonin can we fit into this gummy?", Sonnus asks: <em>"How can we create a broader nighttime ritual using multiple complementary ingredients?"</em>
            </p>

            {/* PERFECT RESPONSIVE GRID FOR 4 FRICTION CHIPS */}
            <div style={{
              backgroundColor: 'rgba(39, 174, 96, 0.06)',
              border: '1.5px solid #27AE60',
              borderRadius: '16px',
              padding: '20px 14px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 900,
                color: 'var(--color-primary)',
                letterSpacing: '0.5px',
                marginBottom: '14px',
                textAlign: 'center',
                textTransform: 'uppercase'
              }}>
                SONNUS® REMOVES ROUTINE FRICTION:
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
                gap: '8px'
              }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(39, 174, 96, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  <CheckCircle2 size={15} style={{ color: '#27AE60', flexShrink: 0 }} />
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>0.9 MG MELATONIN</span>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(39, 174, 96, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  <CheckCircle2 size={15} style={{ color: '#27AE60', flexShrink: 0 }} />
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>NO HARSH POWDERS</span>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(39, 174, 96, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  <CheckCircle2 size={15} style={{ color: '#27AE60', flexShrink: 0 }} />
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>NO CAFFEINE</span>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(39, 174, 96, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  <CheckCircle2 size={15} style={{ color: '#27AE60', flexShrink: 0 }} />
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>NO STIMULANTS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 09 — REASON #6 */}
        <section id="reason-6" style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(39, 174, 96, 0.12)',
            color: '#27AE60',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            marginBottom: '14px'
          }}>
            REASON #6
          </div>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '30px',
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            TWO GUMMIES MAKE THE ROUTINE ALMOST IMPOSSIBLE TO OVERCOMPLICATE
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              People love looking for one secret or sleep hack, but real life is less dramatic. A better nighttime environment is created by repeated signals:
            </p>

            {/* 3 LIFESTYLE CARDS WITH LUCIDE ICONS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              
              {/* CARD 1: CONSISTENT SCHEDULE */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(39, 174, 96, 0.12)',
                  color: '#27AE60',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#27AE60', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    CONSISTENT SCHEDULE
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                    Going to bed around the same time signals your body to wind down naturally.
                  </div>
                </div>
              </div>

              {/* CARD 2: DARKER ROOM */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(39, 174, 96, 0.12)',
                  color: '#27AE60',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Moon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#27AE60', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    DARKER & COOLER ROOM
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                    Lower light and comfortable room temperatures encourage restful surroundings.
                  </div>
                </div>
              </div>

              {/* CARD 3: CHEW & REST */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(39, 174, 96, 0.12)',
                  color: '#27AE60',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#27AE60', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    NIGHTLY GUMMY RITUAL
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                    Two Wild Berry gummies provide 30 seconds of delicious wind-down routine.
                  </div>
                </div>
              </div>

            </div>

            <div style={{
              backgroundColor: '#1B2613',
              color: '#FFFFFF',
              borderRadius: '14px',
              padding: '18px 24px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '0.3px',
              lineHeight: '1.4'
            }}>
              IT DOESN'T NEED TO BECOME THE ENTIRE NIGHT. IT JUST NEEDS TO BECOME ONE CONSISTENT PART OF IT.
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 10 — REASON #7 */}
        <section id="reason-7" style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(39, 174, 96, 0.12)',
            color: '#27AE60',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            marginBottom: '14px'
          }}>
            REASON #7
          </div>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '30px',
            color: 'var(--color-primary)',
            marginBottom: '28px',
            lineHeight: '1.2'
          }}>
            YOU GET 90 DAYS TO DECIDE WHETHER IT DESERVES A PLACE ON YOUR NIGHTSTAND
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
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
                src="/assets/listicle/linfaflow/guarantee_badge.png"
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
                onError={(e) => {
                  e.target.src = "/assets/home/brand/guarantee_badge.png";
                }}
              />
            </div>

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
                Trying a nighttime supplement always comes with uncertainty. That's why eligible Sonnus® purchases are covered by a <strong>90-Day Money-Back Guarantee</strong>.
              </p>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: 'var(--color-secondary)',
                marginBottom: '24px'
              }}>
                Give the routine a fair opportunity. If it doesn't fit your nighttime lifestyle, simply contact customer support within the guarantee period.
              </p>

              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
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
                  <span>TRY SONNUS® RISK-FREE</span>
                  <ArrowRight size={15} />
                </a>
              </div>

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

        {/* 11 — INTERACTIVE TABBED BUYER'S GUIDE SECTION */}
        <section style={{
          backgroundColor: '#F8FAF6',
          border: '2px solid #27AE60',
          borderRadius: '24px',
          padding: '24px 16px',
          marginBottom: '56px',
          boxShadow: '0 12px 40px rgba(39, 174, 96, 0.1)',
          boxSizing: 'border-box'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 900,
              color: '#FFFFFF',
              backgroundColor: '#27AE60',
              padding: '4px 14px',
              borderRadius: '999px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              INTERACTIVE BUYER'S CHECKLIST
            </span>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: 'clamp(20px, 4vw, 30px)',
              color: '#141210',
              fontWeight: 800,
              margin: '4px 0 0',
              lineHeight: '1.25'
            }}>
              BEFORE BUYING ANY NIGHTTIME GUMMY, ASK THESE 6 QUESTIONS:
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '6px' }}>
              Click through the tabs below to inspect our standards step-by-step:
            </p>
          </div>

          <style>{`
            .buyer-tab-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
              gap: 8px;
              margin-bottom: 20px;
              width: 100%;
              box-sizing: border-box;
            }
            @media (min-width: 641px) {
              .buyer-tab-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 12px !important;
              }
            }
          `}</style>

          {/* TAB SELECTOR STRIP — EXACT 3X2 GRID ON DESKTOP */}
          <div className="buyer-tab-grid">
            {[
              { num: '01', title: 'MELATONIN' },
              { num: '02', title: 'FORMULA' },
              { num: '03', title: 'ROUTINE' },
              { num: '04', title: 'STIMULANTS' },
              { num: '05', title: 'STACK' },
              { num: '06', title: 'GUARANTEE' }
            ].map((item, idx) => {
              const isActive = activeBuyerTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveBuyerTab(idx)}
                  style={{
                    backgroundColor: isActive ? '#27AE60' : 'rgba(255, 255, 255, 0.9)',
                    color: isActive ? '#FFFFFF' : '#27AE60',
                    border: isActive ? '1.5px solid #27AE60' : '1.5px solid rgba(39, 174, 96, 0.3)',
                    padding: '9px 12px',
                    borderRadius: '12px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 3px 10px rgba(39, 174, 96, 0.25)' : 'none',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    boxSizing: 'border-box',
                    minWidth: 0
                  }}
                >
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(39, 174, 96, 0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 900,
                    flexShrink: 0
                  }}>
                    {item.num}
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE FEATURED SPOTLIGHT CARD */}
          {(() => {
            const list = [
              { num: '01', title: 'MELATONIN DOSE', q: '1. Is the entire product built around high-dose melatonin alone?', a: 'Sonnus isn\'t. Melatonin (0.9 mg) is just one component of a 10-ingredient nighttime formula.' },
              { num: '02', title: 'FORMULA COMPLETENESS', q: '2. Does it include complementary nighttime ingredients?', a: 'Yes. Magnesium, L-Theanine, GABA, 5-HTP, Apigenin, Lemon Balm, B6, and B2 work together.' },
              { num: '03', title: 'EASY ROUTINE', q: '3. Is the routine simple and easy to stick with?', a: 'Two Wild Berry gummies approximately 30 minutes before bedtime. Chew, unwind, and rest.' },
              { num: '04', title: 'STIMULANT-FREE', q: '4. Is it completely free of caffeine and stimulants?', a: '100% caffeine-free and free of harsh stimulants or habit-forming sedatives.' },
              { num: '05', title: 'REDUCES FRICTION', q: '5. Does it eliminate the need for 5 separate bottles?', a: 'Sonnus replaces supplement stack clutter with 1 simple 2-gummy nightly ritual.' },
              { num: '06', title: 'RISK-FREE TRIAL', q: '6. Do you have time to decide if you like it?', a: 'Eligible Sonnus purchases include a 90-Day Money-Back Guarantee.' }
            ];
            const activeItem = list[activeBuyerTab];
            return (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 16px',
                border: '1.5px solid rgba(39, 174, 96, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxSizing: 'border-box',
                width: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  paddingBottom: '12px'
                }}>
                  <div>
                    <span style={{
                      backgroundColor: '#27AE60',
                      color: '#FFFFFF',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 900,
                      letterSpacing: '0.6px',
                      display: 'inline-block'
                    }}>
                      CHECKPOINT {activeItem.num} OF 06
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#27AE60' }}>
                      • {activeItem.title}
                    </span>
                    <CheckCircle2 size={16} style={{ color: '#27AE60', flexShrink: 0 }} />
                  </div>
                </div>

                <div style={{ fontSize: '17px', fontWeight: 800, color: '#141210', lineHeight: '1.35' }}>
                  {activeItem.q}
                </div>

                <div style={{
                  backgroundColor: 'rgba(39, 174, 96, 0.08)',
                  borderLeft: '4px solid #27AE60',
                  borderRadius: '0 12px 12px 0',
                  padding: '14px 14px',
                  fontSize: '14px',
                  color: 'var(--color-secondary)',
                  lineHeight: '1.55'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <ShieldCheck size={16} style={{ color: '#27AE60', flexShrink: 0 }} />
                    <strong style={{ color: '#27AE60', fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                      THE SONNUS® STANDARD
                    </strong>
                  </div>
                  {activeItem.a}
                </div>

                {/* PREV / NEXT NAVIGATION CONTROLS */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(0,0,0,0.06)'
                }}>
                  <button
                    disabled={activeBuyerTab === 0}
                    onClick={() => setActiveBuyerTab(prev => Math.max(0, prev - 1))}
                    style={{
                      backgroundColor: activeBuyerTab === 0 ? 'transparent' : 'rgba(39, 174, 96, 0.08)',
                      color: activeBuyerTab === 0 ? '#CBD5E0' : '#27AE60',
                      border: activeBuyerTab === 0 ? '1px solid #E2E8F0' : '1px solid rgba(39, 174, 96, 0.3)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: activeBuyerTab === 0 ? 'default' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ← Prev
                  </button>

                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                    {activeBuyerTab + 1} / 6
                  </div>

                  <button
                    disabled={activeBuyerTab === list.length - 1}
                    onClick={() => setActiveBuyerTab(prev => Math.min(list.length - 1, prev + 1))}
                    style={{
                      backgroundColor: activeBuyerTab === list.length - 1 ? 'transparent' : '#27AE60',
                      color: activeBuyerTab === list.length - 1 ? '#CBD5E0' : '#FFFFFF',
                      border: activeBuyerTab === list.length - 1 ? '1px solid #E2E8F0' : 'none',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: activeBuyerTab === list.length - 1 ? 'default' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                      boxShadow: activeBuyerTab === list.length - 1 ? 'none' : '0 3px 10px rgba(39, 174, 96, 0.25)'
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            );
          })()}
        </section>

        {/* 12 — CONVENIENCE VS BUYING INGREDIENTS SEPARATELY */}
        <section style={{ marginBottom: '56px', textAlign: 'center', backgroundColor: 'var(--bg-card)', padding: '32px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-brand-display)', fontSize: '24px', color: 'var(--color-primary)', marginBottom: '12px' }}>
            "CAN'T I JUST BUY THESE INGREDIENTS SEPARATELY?"
          </h3>
          <p style={{ fontSize: '15.5px', color: 'var(--color-secondary)', maxWidth: '680px', margin: '0 auto 20px', lineHeight: '1.6', textAlign: 'left' }}>
            Of course! But then you've recreated the exact problem Sonnus was designed to solve: buying 10 separate bottles, managing multiple labels, and cluttering your nightstand. The real value proposition is <strong>CONVENIENCE</strong>: Ten nighttime-support ingredients brought together into a single 2-gummy nightly ritual.
          </p>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60' }}>
            TEN INGREDIENTS. TWO GUMMIES. DONE.
          </div>
        </section>

        {/* 13 — PRODUCT REVEAL */}
        <section style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 28px',
          marginBottom: '56px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.05)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
              THE NIGHTTIME FORMULA
            </div>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '36px',
              color: 'var(--color-primary)',
              marginBottom: '12px'
            }}>
              MEET SONNUS®
            </h2>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-secondary)' }}>
              Ten nighttime ingredients. Two Wild Berry gummies. One simple routine.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}>
              <img 
                src="/assets/listicle/sonnus/gallery-1.png" 
                alt="Sonnus Bottle" 
                style={{ width: '100%', height: 'auto', maxHeight: '380px', objectFit: 'contain', borderRadius: 'var(--radius-md)', display: 'block' }}
                onError={(e) => {
                  e.target.src = "/public/sonnus/images/gallery-1.png";
                }}
              />
            </div>

            <div>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '20px' }}>
                Sonnus® is a concentrated nighttime dietary supplement designed for adults looking for a practical, enjoyable way to complement their evening wind-down routine.*
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '28px' }}>
                {[
                  'Delicious Wild Berry gummy format',
                  '10 complementary nighttime ingredients',
                  'Balanced 0.9 mg of melatonin per serving',
                  'Magnesium, L-Theanine, GABA & 5-HTP',
                  'Apigenin, Lemon Balm & B-Vitamins',
                  'No caffeine or harsh stimulants'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
                    <CheckCircle2 size={16} style={{ color: '#27AE60', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                  <span>DISCOVER SONNUS®</span>
                  <ArrowRight size={15} />
                </a>
              </div>
              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-muted)' }}>
                Covered by our 90-Day Money-Back Guarantee
              </div>
            </div>
          </div>
        </section>

        {/* 14 — WHAT SONNUS IS AND ISN'T */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '30px',
              color: 'var(--color-primary)',
              marginBottom: '4px'
            }}>
              WHAT SONNUS IS — AND WHAT IT ISN'T
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
              Transparency is our core standard.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            {/* IS */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #27AE60',
              borderRadius: '16px',
              padding: '32px 28px',
              boxShadow: '0 8px 24px rgba(39, 174, 96, 0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: '#27AE60',
                borderRadius: '16px 16px 0 0'
              }} />
              <div style={{
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '1.5px',
                color: '#27AE60',
                marginBottom: '16px',
                textTransform: 'uppercase'
              }}>
                WHAT SONNUS IS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'A multi-ingredient nighttime formula combining 10 complementary nutrients',
                  'A practical 2-gummy daily ritual created for effortless evening consistency',
                  'Stimulant-free and designed around natural evening relaxation',
                  'Backed by a 90-Day Money-Back Guarantee'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                    <CheckCircle2 size={18} style={{ color: '#27AE60', flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ISN'T */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '32px 28px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '1.5px',
                color: 'var(--color-muted)',
                marginBottom: '16px',
                textTransform: 'uppercase'
              }}>
                WHAT SONNUS IS NOT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'A heavy prescription sedative designed to "knock you out"',
                  'A high-dose single-melatonin mega-dose supplement',
                  'A harsh pharmaceutical treatment for insomnia',
                  'A complicated stack requiring 10 different supplement bottles'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                    <span style={{ color: '#E53E3E', fontWeight: 900, fontSize: '16px', lineHeight: '1', flexShrink: 0, marginTop: '2px' }}>✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 15 — UGC SOCIAL PROOF BANNER */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Left Column: 1:1 ENLARGED IMAGE */}
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '520px',
              justifySelf: 'center',
              boxSizing: 'border-box'
            }}>
              <img 
                src="/assets/listicle/sonnus/sonnus_ugc_collage.jpg" 
                alt="Real Sonnus Customers"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '1 / 1',
                  display: 'block',
                  objectFit: 'cover',
                  borderRadius: '24px'
                }}
                onError={(e) => {
                  e.target.src = "/assets/listicle/sonnus/gallery-3.png";
                }}
              />
            </div>

            {/* Right Column: Headline, Paragraph & Centered CTA */}
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '1.5px',
                color: '#27AE60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                padding: '5px 14px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '14px'
              }}>
                REAL ROUTINES. REAL REASONS.
              </div>

              <h2 style={{
                fontFamily: 'var(--font-brand-display)',
                fontSize: 'clamp(26px, 4vw, 38px)',
                fontWeight: 900,
                color: 'var(--color-primary)',
                marginBottom: '16px',
                lineHeight: '1.2'
              }}>
                WHY PEOPLE CHOOSE SONNUS®
              </h2>

              <p style={{
                fontSize: '15.5px',
                lineHeight: '1.65',
                color: 'var(--color-secondary)',
                marginBottom: '24px'
              }}>
                Two delicious Wild Berry gummies of Sonnus® each evening — that is the entire protocol. No swallowing multiple pills, no complicated stacks, no caffeine. People are discovering how easy consistency becomes when wellness fits seamlessly into real life. Try it risk-free with our 90-Day Guarantee.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <a 
                  href={CHECKOUT_URL}
                  onClick={handleGoToCheckout}
                  style={{
                    backgroundColor: '#27AE60',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 6px 20px rgba(39, 174, 96, 0.25)',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <span>SEE SONNUS BUNDLES</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 16 — REAL CUSTOMER EXPERIENCES */}
        <section id="reviews-section" style={{ marginBottom: '56px' }}>
          <style>{`
            .review-card-item {
              background-color: #FFFFFF;
              border-radius: 16px;
              border: 1px solid rgba(0, 0, 0, 0.08);
              padding: 24px 28px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
              display: flex;
              flex-direction: row;
              gap: 24px;
              align-items: flex-start;
              margin-bottom: 20px;
            }
            .review-photo-wrapper {
              width: 140px;
              height: 140px;
              border-radius: 14px;
              overflow: hidden;
              flex-shrink: 0;
              background-color: #FAF7F2;
              border: 1px solid rgba(0,0,0,0.08);
              box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            }
            .review-photo-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center 20%;
              display: block;
            }
            @media (max-width: 640px) {
              .review-card-item {
                flex-direction: column !important;
                padding: 20px 18px !important;
                gap: 14px !important;
              }
              .review-photo-wrapper {
                order: 3 !important;
                width: 100% !important;
                height: 190px !important;
                max-height: 190px !important;
                margin-top: 4px !important;
              }
              .review-photo-img {
                height: 190px !important;
              }
            }
          `}</style>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              CUSTOMER REVIEWS
            </span>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '32px',
              color: 'var(--color-primary)',
              margin: '4px 0 0'
            }}>
              WHAT REAL CUSTOMERS VALUE
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                name: 'Sarah M.',
                stars: 5,
                title: '"IT\'S BECOME MY SIGNAL TO START WINDING DOWN."',
                body: 'The gummies are simple to take and I\'ve made them part of the point in my evening when I stop working and start getting ready for bed.',
                photo: '/assets/listicle/sonnus/imagem-2.jpg'
              },
              {
                name: 'David R.',
                stars: 5,
                title: '"I WANTED MORE THAN JUST MELATONIN."',
                body: 'The ingredient list is what caught my attention. I like having a broader nighttime formula in one product rather than taking multiple supplements.',
                photo: '/assets/listicle/sonnus/imagem-3.jpg'
              },
              {
                name: 'Elena K.',
                stars: 5,
                title: '"TWO GUMMIES AND DONE."',
                body: 'No powders, no handful of capsules. It\'s exactly the kind of routine I can actually keep up with night after night.',
                photo: '/assets/listicle/sonnus/imagem-5.jpg'
              },
              {
                name: 'Marcus P.',
                stars: 5,
                title: '"THE FLAVOR MAKES IT EASY."',
                body: 'The Wild Berry gummies taste great and fit naturally into my evening routine right after brushing my teeth.',
                photo: '/assets/listicle/sonnus/imagem-7.jpg'
              }
            ].map((rev, idx) => (
              <div key={idx} className="review-card-item">
                <div className="review-photo-wrapper">
                  <img 
                    src={rev.photo} 
                    alt={rev.name} 
                    className="review-photo-img" 
                    onError={(e) => {
                      e.target.src = "/assets/listicle/sonnus/gallery-2.png";
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', color: '#F59E0B', gap: '2px', marginBottom: '6px' }}>
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" />
                    ))}
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '6px' }}>
                    {rev.title}
                  </div>
                  <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '12px' }}>
                    {rev.body}
                  </p>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} style={{ color: '#27AE60' }} /> Verified Buyer — {rev.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 17 — OFFER PREVIEW */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px', marginBottom: '6px' }}>
              TODAY'S SONNUS OFFER
            </div>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '32px',
              color: 'var(--color-primary)',
              marginBottom: '8px'
            }}>
              CHOOSE THE ROUTINE THAT FITS YOU
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)' }}>
              The larger the bundle, the lower the cost per bottle.
            </p>
          </div>

          <style>{`
            .bundles-grid-container {
              display: grid;
              grid-template-columns: 1fr;
              gap: 16px;
              align-items: stretch;
              width: 100%;
              box-sizing: border-box;
            }
            @media (min-width: 641px) {
              .bundles-grid-container {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 12px !important;
              }
            }
          `}</style>

          <div className="bundles-grid-container">
            
            {/* STARTER (2 BOTTLES - BUY 1 GET 1) */}
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
                <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <img
                    src="/assets/listicle/sonnus/bundle-1.png"
                    alt="Sonnus Starter Bundle"
                    style={{ maxHeight: '100%', maxWidth: '85%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-muted)', letterSpacing: '1px', marginBottom: '4px' }}>STARTER</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>BUY 1 + GET 1 FREE</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#27AE60', marginBottom: '8px' }}>$34.75 / bottle ($69.50 total)</div>
                <p style={{ fontSize: '13px', color: 'var(--color-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>Ideal for starting your nighttime routine.</p>
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
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(39, 174, 96, 0.25)'
                }}
              >
                GET MY 2 BOTTLES →
              </a>
            </div>

            {/* MOST POPULAR (4 BOTTLES - BUY 2 GET 2) */}
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
                <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', marginTop: '6px' }}>
                  <img
                    src="/assets/listicle/sonnus/bundle-2.png"
                    alt="Sonnus 4-Bottle Bundle"
                    style={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>4 BOTTLES TOTAL</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>BUY 2 + GET 2 FREE</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#27AE60', marginBottom: '8px' }}>$27.49 / bottle ($109.96 total)</div>
                <p style={{ fontSize: '13px', color: 'var(--color-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>Best balance for long-term consistency.</p>
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
                  whiteSpace: 'nowrap',
                  boxShadow: '0 6px 16px rgba(39, 174, 96, 0.35)'
                }}
              >
                GET MY 4 BOTTLES →
              </a>
            </div>

            {/* BEST VALUE (6 BOTTLES - BUY 3 GET 3) */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2.5px solid #27AE60',
              borderRadius: '18px',
              padding: '28px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(39, 174, 96, 0.08)'
            }}>
              <div>
                <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <img
                    src="/assets/listicle/sonnus/bundle-3.png"
                    alt="Sonnus 6-Bottle Bundle"
                    style={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>6 BOTTLES TOTAL</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>BUY 3 + GET 3 FREE</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#27AE60', marginBottom: '8px' }}>ONLY $19.99 / BOTTLE ($119.94 total)</div>
                <p style={{ fontSize: '13px', color: 'var(--color-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>Lowest price per bottle + max long-term value.</p>
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
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(39, 174, 96, 0.25)'
                }}
              >
                GET THE BEST VALUE →
              </a>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 18 — FAQ ACCORDION SECTION */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '32px',
              color: 'var(--color-primary)',
              margin: '4px 0 0'
            }}>
              QUESTIONS ABOUT SONNUS®?
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: 'WHAT EXACTLY IS SONNUS®?',
                a: 'Sonnus is a nighttime dietary supplement in Wild Berry gummy form featuring 10 ingredients selected around relaxation, nighttime wellness and healthy sleep support.'
              },
              {
                q: 'HOW DO I TAKE IT?',
                a: 'Take 2 gummies approximately 30 minutes before bedtime, according to the current product directions.'
              },
              {
                q: 'DOES SONNUS CONTAIN MELATONIN?',
                a: 'Yes. Sonnus contains 0.9 mg of melatonin per serving as part of its broader multi-ingredient formula.'
              },
              {
                q: 'WHY DOES SONNUS CONTAIN ONLY 0.9 MG OF MELATONIN?',
                a: 'Because the formula is not built around melatonin alone. Melatonin is one component of a 10-ingredient nighttime formula designed to support a balanced evening routine.'
              },
              {
                q: 'IS SONNUS A SLEEPING PILL?',
                a: 'No. Sonnus is a dietary supplement. It is not a prescription sleeping medication, nor an OTC drug, and is not intended to treat insomnia or any medical condition.'
              },
              {
                q: 'WILL IT KNOCK ME OUT OR MAKE ME GROGGY?',
                a: 'Sonnus is not designed as a heavy sedative. It is formulated to support a calm transition into rest as part of a consistent nighttime routine.'
              },
              {
                q: 'WHAT IF SONNUS ISN\'T RIGHT FOR ME?',
                a: 'Eligible purchases are protected by our 90-Day Money-Back Guarantee according to our refund-policy terms.'
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 800,
                    fontSize: '15px',
                    color: 'var(--color-primary)'
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaqIndex === idx && (
                  <div style={{
                    padding: '0 20px 16px 20px',
                    fontSize: '14px',
                    color: 'var(--color-secondary)',
                    lineHeight: 1.6,
                    borderTop: '1px solid #F1F5F9'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 19 — FINAL CTA FOOTER (NO HEAVY BACKGROUND BOX, EXACT TRUST SEALS STYLING) */}
        <section style={{
          padding: '36px 16px 20px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 800,
            color: 'var(--color-primary)',
            margin: '0 0 12px 0'
          }}>
            YOUR NIGHT DESERVES MORE THAN JUST MORE MELATONIN.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-secondary)', maxWidth: '600px', margin: '0 auto 24px', fontWeight: 500 }}>
            Give it a better routine with 10 nighttime-support ingredients in two delicious Wild Berry gummies.
          </p>

          {/* Centered CTA Button */}
          <div style={{ marginBottom: '24px' }}>
            <a
              href={CHECKOUT_URL}
              onClick={handleGoToCheckout}
              style={{
                backgroundColor: '#27AE60',
                color: '#FFFFFF',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(39, 174, 96, 0.3)',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              <span>CHOOSE MY SONNUS® BUNDLE</span>
              <ArrowRight size={18} />
            </a>
          </div>

          {/* EXACT TRUST SEALS FORMATTING AS INSTRUCTED */}
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: '#4B6833',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            display: 'flex',
            alignItems: 'center',
            lineHeight: 1.5
          }}>
            <span>✓ 90-Day Money-Back Guarantee</span>
            <span>✓ Free U.S. Shipping on Qualifying Bundles</span>
            <span>✓ Secure Checkout</span>
          </div>
        </section>

      </div>
    </div>
  );
}

export default SonnusListicle;
