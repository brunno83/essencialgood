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
  Footprints,
  HeartPulse
} from 'lucide-react';

const CHECKOUT_URL = "https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814";

export function LinfaflowListicle({ onNavHome, onSelectProduct }) {
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
    <div className="listicle-linfaflow-wrapper" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--color-primary)', minHeight: '100vh' }}>
      
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
            <span>FEATURED ARTICLE: LINFAFLOW®</span>
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
            <span>SHOP LINFAFLOW®</span>
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
            <span>LYMPHATIC WELLNESS REPORT</span>
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
            7 Reasons More People Are Paying Attention to Lymphatic Wellness — And Why LinfaFlow® Is Making the Routine Surprisingly Simple
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
            Your body already has a natural system responsible for moving fluid through tissues and supporting everyday balance. LinfaFlow was created around one simple idea: support that natural flow without turning wellness into another complicated routine.
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
              <BookOpen size={14} /> BOTANICAL & LYMPHATIC WELLNESS
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
            src="/assets/listicle/linfaflow/linfaflow-sec-1-why.jpg" 
            alt="LinfaFlow Daily Lymphatic Wellness Routine" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.src = "/LISTICLE LINFAFLOW/Imagens/linfaflow-sec-1-why.jpg";
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
            THE SYSTEM WORKING QUIETLY IN THE BACKGROUND EVERY SINGLE DAY
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '18px' }}>
              Most people can name a few things they associate with everyday wellness: Hydration, Nutrition, Movement, Sleep, and maybe Gut Health.
            </p>
            <p style={{ marginBottom: '18px' }}>
              But there is another vital network working continuously in your body — <strong>YOUR LYMPHATIC SYSTEM</strong>.
            </p>
            <p style={{ marginBottom: '18px', paddingLeft: '16px', borderLeft: '3px solid #27AE60', fontStyle: 'italic' }}>
              It is part of an extensive system that helps move fluid through tissues, supporting normal fluid balance and immune function. And unlike the cardiovascular system, it doesn't have one central pump doing all the work.
            </p>
            <p style={{ marginBottom: '18px' }}>
              Movement, muscle activity, breathing and normal body processes all contribute to lymphatic movement. Which raises an interesting question: If movement and flow are such fundamental parts of everyday physiology... <em>why do so many wellness routines ignore them completely?</em>
            </p>
            <p style={{ marginBottom: '24px' }}>
              That's the idea behind <strong>LinfaFlow®</strong>. Not a harsh cleanse. Not a caffeine stimulant. Not a 12-step protocol. LinfaFlow is a concentrated liquid dietary supplement built around four traditional botanicals: <strong>Cleavers, Stillingia Root, Red Clover Blossom, and Prickly Ash Bark</strong>.
            </p>

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
            YOUR LYMPHATIC SYSTEM DOES MORE THAN MOST PEOPLE REALIZE
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
              src="/assets/listicle/linfaflow/linfaflow_sec1_product_hero.jpg" 
              alt="LinfaFlow Liquid Dropper Bottle Highlight" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/listicle/linfaflow/linfaflow_sec_2_dropper_action.jpg";
              }}
            />
          </div>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              Think of your cardiovascular system and most people immediately picture the heart pumping blood through vessels. The lymphatic system works differently: it consists of vessels, nodes and tissues that transport lymph fluid back toward circulation.
            </p>
            
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '10px' }}>
                KEY PHYSIOLOGICAL ROLES OF THE LYMPHATIC SYSTEM:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} style={{ color: '#27AE60' }} /> Normal fluid movement across body tissues
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} style={{ color: '#27AE60' }} /> Supporting natural immune function and filtration
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} style={{ color: '#27AE60' }} /> Return of fluid from tissues back into circulation
                </li>
              </ul>
            </div>

            <p style={{ marginBottom: '16px' }}>
              And there is one crucial difference: <strong>THERE IS NO SINGLE CENTRAL "LYMPHATIC PUMP."</strong>
            </p>
            <p style={{ marginBottom: '24px' }}>
              Normal lymphatic movement is assisted by everyday actions — walking, moving muscles, breathing, and physical activity. LinfaFlow does not replace movement; it was designed to complement a daily routine built around movement, hydration, and botanical wellness.
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
                SUPPORT THE FLOW YOUR BODY ALREADY KNOWS.
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
            LINFAFLOW DOESN'T TRY TO TURN WELLNESS INTO A 12-STEP PROJECT
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
              src="/assets/listicle/linfaflow/linfaflow_sec2_product_routine.jpg" 
              alt="LinfaFlow Daily Dropper Routine Highlight" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/listicle/linfaflow/02-hero-bottle.webp";
              }}
            />
          </div>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              There is an irony in modern wellness: products that are supposed to make people feel better often create routines that are almost impossible to maintain.
            </p>
            <p style={{ marginBottom: '16px' }}>
              One capsule before breakfast, two pills at lunch, a powder in the afternoon, another supplement before bed... Before long, <em>the routine itself becomes the problem.</em>
            </p>
            <p style={{ marginBottom: '24px' }}>
              LinfaFlow starts from the opposite philosophy: <strong>MAKE IT EASY ENOUGH TO ACTUALLY DO.</strong>
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
                ONE BOTTLE. ONE DROPPER. ABOUT 30 SECONDS.
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-secondary)', margin: 0 }}>
                No large pills. No powders to mix. No shaker bottle. No caffeine or stimulants.
              </p>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 06 — REASON #3 (4 BOTANICALS) */}
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
            IT USES A FOCUSED 4-BOTANICAL FORMULA INSTEAD OF AN OVERSTUFFED "DETOX" BLEND
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)', marginBottom: '28px' }}>
            <p style={{ marginBottom: '16px' }}>
              More ingredients can look impressive on a label, but more does not automatically mean better. Some formulas stuff 15 or 20 ingredients without a clear reason for each.
            </p>
            <p style={{ marginBottom: '16px' }}>
              LinfaFlow focuses on four principal, clearly identified Western botanicals:
            </p>
          </div>

          {/* 4 INGREDIENT CARDS WITH PHOTOS & DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            
            {/* INGREDIENT 1: CLEAVERS */}
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
                    src="/assets/listicle/linfaflow/gallery-botanicals.jpg" 
                    alt="Cleavers Botanical Extract" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/LISTICLE LINFAFLOW/Imagens/gallery-botanicals.jpg";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      KEY BOTANICAL
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      CLEAVERS
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Galium aparine)
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
                  The cornerstone botanical of lymphatic herbalism
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  A familiar plant in traditional Western herbalism and historically associated with normal fluid balance and lymphatic wellness.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To anchor LinfaFlow's traditional lymphatic-wellness positioning.*
              </div>
            </div>

            {/* INGREDIENT 2: STILLINGIA ROOT */}
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
                    src="/assets/listicle/linfaflow/linfaflow-sec-3-ingredients.jpg" 
                    alt="Stillingia Root Extract" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/LISTICLE LINFAFLOW/Imagens/linfaflow-sec-3-ingredients.jpg";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      HERBAL ROOT
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      STILLINGIA ROOT
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Stillingia sylvatica)
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
                  Also known as Queen's Root in traditional practice
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Has a documented history of use in traditional North American herbal practice for fluid balance and tissue support.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To complement the formula's traditional botanical profile.*
              </div>
            </div>

            {/* INGREDIENT 3: RED CLOVER BLOSSOM */}
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
                    src="/assets/listicle/linfaflow/gallery-lifestyle.jpg" 
                    alt="Red Clover Blossom" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/LISTICLE LINFAFLOW/Imagens/gallery-lifestyle.jpg";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      BOTANICAL FLOWER
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      RED CLOVER BLOSSOM
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Trifolium pratense)
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
                    <Droplets size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  Rich in naturally occurring plant compounds
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  One of the most recognizable plants in Western herbal traditions, valued for its plant compounds and general wellness profile.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To broaden the botanical profile with active plant compounds.*
              </div>
            </div>

            {/* INGREDIENT 4: PRICKLY ASH BARK */}
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
                    src="/assets/listicle/linfaflow/linfaflow-sec-2-benefits.jpg" 
                    alt="Prickly Ash Bark" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/LISTICLE LINFAFLOW/Imagens/linfaflow-sec-2-benefits.jpg";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      CIRCULATORY BARK
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      PRICKLY ASH BARK
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Zanthoxylum)
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
                    <Activity size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  Traditionally described as a warming botanical
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Traditionally described by herbalists as a "warming" botanical with a history of use in practices associated with healthy circulation.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To complement LinfaFlow's circulatory-wellness approach.*
              </div>
            </div>

          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 07 — REASON #4 (FLOW NOT HARSH FLUSH) */}
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
            IT'S DESIGNED AROUND FLOW — NOT A HARSH "FLUSH"
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
              src="/assets/listicle/linfaflow/linfaflow-sec-5-howitworks.jpg" 
              alt="LinfaFlow How It Works Routine" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/LISTICLE LINFAFLOW/Imagens/linfaflow-sec-5-howitworks.jpg";
              }}
            />
          </div>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              A lot of products in the wellness category use dramatic marketing: <em>"Flush everything out", "Detox overnight", "Cleanse in days"</em>.
            </p>
            <p style={{ marginBottom: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>
              Your body is not a dirty pipe that needs to be flushed.
            </p>
            <p style={{ marginBottom: '24px' }}>
              It already has sophisticated systems responsible for normal circulation, fluid movement and waste processing. LinfaFlow is designed to complement normal body processes, not pretend to replace them.
            </p>

            {/* 4-STEP RITUAL CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60', marginBottom: '4px' }}>01 — DROP</div>
                <div style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>Use LinfaFlow liquid drops according to product directions.</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60', marginBottom: '4px' }}>02 — HYDRATE</div>
                <div style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>Adequate hydration is vital for normal physiological fluid function.</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60', marginBottom: '4px' }}>03 — MOVE</div>
                <div style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>Regular walking and movement naturally encourage lymphatic flow.</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60', marginBottom: '4px' }}>04 — REPEAT</div>
                <div style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>Build a simple daily routine you can actually maintain.</div>
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 08 — REASON #5 (LIQUID FORMAT VS CABINET OF PILLS) */}
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
            THE LIQUID FORMAT MAKES IT DIFFERENT FROM ANOTHER CABINET FULL OF PILLS
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
              src="/assets/listicle/linfaflow/linfaflow-sec-4-whychoose.jpg" 
              alt="LinfaFlow Routine vs Complex Supplements" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/LISTICLE LINFAFLOW/Imagens/linfaflow-sec-4-whychoose.jpg";
              }}
            />
          </div>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              Buying a supplement and actually using it consistently are two very different things. Think about how many pill bottles end up sitting unfinished in kitchen cabinets.
            </p>
            <p style={{ marginBottom: '16px' }}>
              People rarely stop because they decided wellness no longer matters — they stop because the routine becomes annoying. Too many pills, too many instructions, too much friction.
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
                LINFAFLOW® REMOVES ROUTINE FRICTION:
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
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>NO LARGE PILLS</span>
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
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>NO POWDERS TO MIX</span>
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

        {/* 09 — REASON #6 (FITS STRATEGY THAT MAKES SENSE) */}
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
            IT FITS INTO A WELLNESS STRATEGY THAT ALREADY MAKES SENSE
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              One of the problems with many supplement pitches is that the product somehow becomes responsible for everything. LinfaFlow doesn't make that promise.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Instead, it makes sense as one focused component of a broader, sensible lifestyle foundation:
            </p>

            {/* 3 LIFESTYLE CARDS WITH LUCIDE ICONS (NO EMOJIS) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              
              {/* CARD 1: MOVEMENT */}
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
                  <Footprints size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#27AE60', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    MOVEMENT
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                    Walking and muscle contraction support circulatory and lymphatic movement.
                  </div>
                </div>
              </div>

              {/* CARD 2: HYDRATION */}
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
                  <GlassWater size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#27AE60', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    HYDRATION
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                    Adequate fluid intake is essential for tissue hydration and fluid transport.
                  </div>
                </div>
              </div>

              {/* CARD 3: NUTRITION & REST */}
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
                  <HeartPulse size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#27AE60', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    NUTRITION & REST
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                    Whole food nutrition and recovery remain foundational to overall wellness.
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
              IT DOESN'T ASK YOU TO REBUILD YOUR LIFE AROUND A BOTTLE. IT FITS INTO THE LIFE YOU ARE ALREADY LIVING.
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 10 — REASON #7 (90-DAY GUARANTEE) */}
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
            YOU GET 90 DAYS TO DECIDE WHETHER IT DESERVES A PLACE IN YOUR ROUTINE
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
                Supplements are personal. What fits one person's routine may not fit another's. That's why LinfaFlow® purchases are backed by a <strong>90-Day Money-Back Guarantee</strong>.
              </p>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: 'var(--color-secondary)',
                marginBottom: '24px'
              }}>
                Give the routine a fair opportunity. If it doesn't fit your daily lifestyle, simply contact us according to our refund policy.
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
                  <span>TRY LINFAFLOW® RISK-FREE</span>
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
              BEFORE BUYING ANY "LYMPHATIC" SUPPLEMENT, ASK THESE 6 QUESTIONS:
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
              { num: '01', title: 'INGREDIENTS' },
              { num: '02', title: 'FORMULA' },
              { num: '03', title: 'CLAIMS' },
              { num: '04', title: 'STIMULANTS' },
              { num: '05', title: 'ROUTINE' },
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
              { num: '01', title: 'INGREDIENTS', q: '1. Does it clearly tell you what\'s inside?', a: 'LinfaFlow does: Cleavers, Stillingia Root, Red Clover Blossom, and Prickly Ash Bark. 100% full ingredient disclosure.' },
              { num: '02', title: 'FORMULA PURPOSE', q: '2. Can you understand why those ingredients are there?', a: 'The formula is built around botanicals with histories of traditional Western herbal use for lymphatic/circulatory wellness.' },
              { num: '03', title: 'REALISTIC CLAIMS', q: '3. Is it promising a "miracle detox"?', a: 'LinfaFlow doesn\'t need to. It supports your body\'s natural physiological processes without false hype.' },
              { num: '04', title: 'STIMULANT-FREE', q: '4. Is it loaded with stimulants?', a: 'No caffeine. No harsh laxatives. No stimulant-heavy positioning.' },
              { num: '05', title: 'DAILY ROUTINE', q: '5. Is the routine realistic?', a: 'One simple liquid serving in water according to the label. No stack of 10 pills or powders to mix.' },
              { num: '06', title: 'GUARANTEE', q: '6. Is there a meaningful guarantee?', a: 'Eligible LinfaFlow purchases come with a 90-Day Money-Back Guarantee.' }
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
                      THE LINFAFLOW® STANDARD
                    </strong>
                  </div>
                  {activeItem.a}
                </div>

                {/* PREV / NEXT NAVIGATION CONTROLS — PERFECT MOBILE FLEX */}
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

        {/* 12 — CONVENIENCE VS BUYING HERBS SEPARATELY */}
        <section style={{ marginBottom: '56px', textAlign: 'center', backgroundColor: 'var(--bg-card)', padding: '32px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-brand-display)', fontSize: '24px', color: 'var(--color-primary)', marginBottom: '12px' }}>
            "CAN'T I JUST BUY THESE HERBS SEPARATELY?"
          </h3>
          <p style={{ fontSize: '15.5px', color: 'var(--color-secondary)', maxWidth: '680px', margin: '0 auto 20px', lineHeight: '1.6', textAlign: 'left' }}>
            Of course! That's why this isn't a story about "secret ingredients". Buying botanicals separately means four different bottles, four labels, four purchasing decisions, and multiple steps. The real value proposition is <strong>CONVENIENCE</strong>: Four traditional botanicals brought together into a single liquid dropper formula.
          </p>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#27AE60' }}>
            FOUR BOTANICALS. ONE DROPPER. DONE.
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
              THE BOTANICAL FORMULA
            </div>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '36px',
              color: 'var(--color-primary)',
              marginBottom: '12px'
            }}>
              MEET LINFAFLOW®
            </h2>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-secondary)' }}>
              Four traditional botanicals. One liquid dropper. One simple routine.
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
                src="/assets/listicle/linfaflow/02-hero-bottle.webp" 
                alt="LinfaFlow Bottle" 
                style={{ width: '100%', height: 'auto', maxHeight: '380px', objectFit: 'contain', borderRadius: 'var(--radius-md)', display: 'block' }}
                onError={(e) => {
                  e.target.src = "/LISTICLE LINFAFLOW/Imagens/02-hero-bottle.webp";
                }}
              />
            </div>

            <div>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '20px' }}>
                LinfaFlow is a concentrated liquid dietary supplement designed for adults looking for a practical, natural way to complement their daily fluid-balance and lymphatic wellness routine.*
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '28px' }}>
                {[
                  'Convenient liquid dropper format',
                  '4 traditional Western botanical extracts',
                  'Supports healthy lymphatic function*',
                  'Complements normal fluid balance*',
                  'Supports healthy circulation comfort*',
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
                  <span>DISCOVER LINFAFLOW®</span>
                  <ArrowRight size={15} />
                </a>
              </div>
              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-muted)' }}>
                Covered by our 90-Day Money-Back Guarantee
              </div>
            </div>
          </div>
        </section>

        {/* 14 — WHAT LINFAFLOW IS AND ISN'T */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '30px',
              color: 'var(--color-primary)',
              marginBottom: '4px'
            }}>
              WHAT LINFAFLOW IS — AND WHAT IT ISN'T
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
                WHAT LINFAFLOW IS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'A targeted botanical formula focused on traditional Western herbal use',
                  'A practical liquid dropper created for effortless daily consistency',
                  'Stimulant-free and designed around natural physiological flow',
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
                WHAT LINFAFLOW IS NOT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'A "miracle flush" promising overnight weight loss or instant fixes',
                  'A replacement for healthy lifestyle habits like hydration and walking',
                  'A harsh diuretic or stimulant-packed cleanser',
                  'A complicated stack requiring 10 different pills'
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

        {/* 15 — UGC SOCIAL PROOF BANNER (SLIMSODA MATCH: NO OUTER CARD & ENLARGED 1:1 IMAGE) */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Left Column: Customer Collage Graphic (1:1 ENLARGED IMAGE) */}
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
                src="/assets/listicle/linfaflow/rev-07.jpg" 
                alt="Real LinfaFlow Customers"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '1 / 1',
                  display: 'block',
                  objectFit: 'cover',
                  borderRadius: '24px'
                }}
                onError={(e) => {
                  e.target.src = "/assets/pdp/linfaflow/rev-07.jpg";
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
                WHY PEOPLE CHOOSE LINFAFLOW®
              </h2>

              <p style={{
                fontSize: '15.5px',
                lineHeight: '1.65',
                color: 'var(--color-secondary)',
                marginBottom: '24px'
              }}>
                One simple dropper of LinfaFlow® in water each day — that is the entire protocol. No swallowing multiple pills, no complicated schedules, no synthetic fillers. People are discovering how easy consistency becomes when wellness fits seamlessly into real life. Try it risk-free with our 90-Day Guarantee.
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
                  <span>SEE LINFAFLOW BUNDLES</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 16 — REAL CUSTOMER EXPERIENCES (DESKTOP LEFT IMAGE + STARS ABOVE TITLE / MOBILE UNTOUCHED) */}
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
              marginTop: '6px'
            }}>
              WHAT PEOPLE ARE SAYING
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                id: 1,
                author: 'Maria S.',
                initials: 'MS',
                stars: 5,
                title: 'SO EASY TO ADD TO MY MORNING',
                body: 'The liquid format makes this so much easier for me than remembering several different supplements.',
                verified: true,
                img: '/assets/listicle/linfaflow/rev-01.jpg'
              },
              {
                id: 2,
                author: 'Laura K.',
                initials: 'LK',
                stars: 5,
                title: 'I LIKE HOW STRAIGHTFORWARD IT IS',
                body: 'Four clearly listed botanicals and a dropper. I wanted something simple and this fits naturally into my routine.',
                verified: true,
                img: '/assets/listicle/linfaflow/rev-02.jpg'
              },
              {
                id: 3,
                author: 'Carla M.',
                initials: 'CM',
                stars: 5,
                title: 'NO MORE COMPLICATED SUPPLEMENT STACK',
                body: 'I already focus on walking and hydration, so adding LinfaFlow to my routine was easy.',
                verified: true,
                img: '/assets/listicle/linfaflow/rev-03.jpg'
              },
              {
                id: 4,
                author: 'Patricia D.',
                initials: 'PD',
                stars: 5,
                title: 'THE DROPPER FORMAT SOLD ME',
                body: 'I\'ve never been great at remembering pills. This takes seconds.',
                verified: true,
                img: '/assets/listicle/linfaflow/rev-04.jpg'
              }
            ].map((rev) => (
              <div key={rev.id} className="review-card-item">
                {/* PHOTO ON LEFT ON DESKTOP / BOTTOM ON MOBILE */}
                {rev.img && (
                  <div className="review-photo-wrapper">
                    <img
                      src={rev.img}
                      alt={`${rev.author} Routine Photo`}
                      className="review-photo-img"
                      onError={(e) => {
                        e.target.src = "/assets/pdp/linfaflow/rev-0" + rev.id + ".jpg";
                      }}
                    />
                  </div>
                )}

                {/* REVIEW TEXT CONTENT */}
                <div style={{ flex: 1, width: '100%', order: 1 }}>
                  {/* AUTHOR ROW */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(39, 174, 96, 0.12)',
                        color: '#27AE60',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 900,
                        flexShrink: 0
                      }}
                    >
                      {rev.initials}
                    </div>

                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#141210' }}>
                      {rev.author}
                    </span>

                    <span style={{ fontSize: '11px', color: '#27AE60', fontWeight: 700, backgroundColor: 'rgba(39, 174, 96, 0.08)', padding: '2px 8px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Verified Buyer
                    </span>
                  </div>

                  {/* 5 STARS (ABOVE TITLE) */}
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                    {[...Array(rev.stars)].map((_, s) => (
                      <Star key={s} size={15} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                    ))}
                  </div>

                  {/* TITLE */}
                  <h3 style={{ fontSize: '15.5px', fontWeight: 900, color: '#141210', margin: '0 0 6px', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                    "{rev.title}"
                  </h3>

                  {/* BODY */}
                  <p style={{ fontSize: '14.5px', color: '#444', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                    "{rev.body}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 17 — MID-FUNNEL DARK BANNER CTA */}
        <section style={{
          backgroundColor: '#1B2613',
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
            Discover the full LinfaFlow formula, botanical details and today's available bundles.
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
            <span>SEE LINFAFLOW OPTIONS</span>
            <ArrowRight size={15} />
          </a>

          <div style={{ fontSize: '13px', color: '#718096', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <span>90-Day Money-Back Guarantee</span>
            <span>•</span>
            <span>Secure Checkout</span>
          </div>
        </section>

        {/* 18 — OFFER PREVIEW */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px', marginBottom: '6px' }}>
              TODAY'S LINFAFLOW OFFER
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            
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
                    src="/assets/listicle/linfaflow/bundle-1.png"
                    alt="LinfaFlow Starter Bundle"
                    style={{ maxHeight: '100%', maxWidth: '85%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-muted)', letterSpacing: '1px', marginBottom: '4px' }}>STARTER</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>BUY 1 + GET 1 FREE</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#27AE60', marginBottom: '8px' }}>$34.75 / bottle ($69.50 total)</div>
                <p style={{ fontSize: '13px', color: 'var(--color-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>Ideal for starting your liquid routine.</p>
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
                    src="/assets/listicle/linfaflow/bundle-2.png"
                    alt="LinfaFlow 4-Bottle Bundle"
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
              border: '2px solid #27AE60',
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
                    src="/assets/listicle/linfaflow/bundle-3.png"
                    alt="LinfaFlow 6-Bottle Bundle"
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

        {/* 19 — FAQ ACCORDION SECTION */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-brand-display)',
              fontSize: '30px',
              color: 'var(--color-primary)',
              marginBottom: '8px'
            }}>
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)' }}>
              Everything you need to know about LinfaFlow®.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: 'WHAT EXACTLY IS LINFAFLOW®?',
                a: 'LinfaFlow is a liquid dietary supplement featuring four botanical extracts — Cleavers, Stillingia Root, Red Clover Blossom and Prickly Ash Bark — formulated around lymphatic wellness, normal fluid balance and healthy circulation as part of a balanced lifestyle.'
              },
              {
                q: 'HOW DO I USE LINFAFLOW®?',
                a: 'Use LinfaFlow according to the serving directions printed on the product label. The liquid dropper format is designed to make it simple to incorporate into an everyday routine.'
              },
              {
                q: 'WHY A LIQUID DROPPER?',
                a: 'Convenience! The format eliminates the need for large capsules, mixing powders, or maintaining a complicated supplement schedule.'
              },
              {
                q: 'IS LINFAFLOW A HARSH CLEANSE?',
                a: 'No. LinfaFlow is positioned as a daily botanical dietary supplement rather than a harsh cleanse or quick "flush."'
              },
              {
                q: 'IS LINFAFLOW A DIURETIC DRUG?',
                a: 'LinfaFlow is a dietary supplement and is not positioned as an OTC or prescription diuretic medication. Persistent or unexplained swelling should be evaluated by a qualified healthcare professional.'
              },
              {
                q: 'DOES LINFAFLOW CONTAIN CAFFEINE?',
                a: 'No. The current formula is 100% caffeine- and stimulant-free.'
              },
              {
                q: 'HOW DOES THE 90-DAY MONEY-BACK GUARANTEE WORK?',
                a: 'Eligible LinfaFlow purchases are protected by a 90-Day Money-Back Guarantee. Use it according to directions and if you decide it isn\'t right for you, contact support according to our refund policy.'
              }
            ].map((faq, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--color-primary)'
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp size={20} style={{ color: '#27AE60', flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={20} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div style={{
                    padding: '0 20px 20px',
                    fontSize: '14.5px',
                    lineHeight: '1.6',
                    color: 'var(--color-secondary)',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '16px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CALL TO ACTION FOOTER BANNER (NO CARD BOX) */}
        <div style={{
          textAlign: 'center',
          padding: '24px 0',
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-brand-display)',
            fontSize: '28px',
            color: 'var(--color-primary)',
            marginBottom: '12px',
            lineHeight: '1.2'
          }}>
            FOUR BOTANICALS. ONE DROPPER. ONE SIMPLE DAILY RITUAL.
          </h3>
          <p style={{ fontSize: '15.5px', color: 'var(--color-secondary)', marginBottom: '24px', maxWidth: '560px', marginInline: 'auto', lineHeight: '1.55' }}>
            Support lymphatic wellness, normal fluid balance and healthy circulation without adding another complicated routine.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '20px' }}>
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
                fontSize: '14.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 6px 20px rgba(39, 174, 96, 0.3)'
              }}
            >
              <span>CHOOSE MY LINFAFLOW® BUNDLE</span>
              <ArrowRight size={16} style={{ flexShrink: 0 }} />
            </a>
          </div>

          {/* TRUST BADGES PHRASE (EXACT USER SPECIFICATION) */}
          <div style={{
            fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: '#4B6833',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            maxWidth: '750px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            <span>✓ 90-Day Money-Back Guarantee</span>
            <span>✓ Free U.S. Shipping on Qualifying Bundles</span>
            <span>✓ Secure Checkout</span>
          </div>
        </div>

      </div>

      {/* SCROLL TO TOP FLOATING BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#1B2613',
            color: '#FFFFFF',
            border: '1px solid #27AE60',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            zIndex: 99
          }}
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}

    </div>
  );
}

export default LinfaflowListicle;
