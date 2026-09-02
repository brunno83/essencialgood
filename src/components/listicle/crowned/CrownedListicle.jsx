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
  Sparkles,
  Layers,
  HeartPulse,
  Smile,
  PackageCheck,
  Feather,
  Crown
} from 'lucide-react';

const CHECKOUT_URL = "https://cc.usecrowned.com/dtcnew/checkout.php?tier=3&package=3bottles&hid=b2lkPW9mZl82Mjc2NzA0JmFpZD1hZmYxOTgyODE0JnVpZD1ibF85ODQyODU3&affid=aff1982814";

export function CrownedListicle({ onNavHome, onSelectProduct }) {
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
    <div className="listicle-crowned-wrapper" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--color-primary)', minHeight: '100vh' }}>
      
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
            • SPONSORED SCALP & HAIR FEATURE
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
            <span>FEATURED ARTICLE: CROWNED®</span>
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
            <span>SHOP CROWNED®</span>
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
            <span>SCALP & HAIR WELLNESS REPORT</span>
          </div>

          <h1 style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 'clamp(24px, 5vw, 42px)',
            lineHeight: '1.18',
            fontWeight: 800,
            color: 'var(--color-primary)',
            margin: '12px 0 16px',
            letterSpacing: '-0.5px'
          }}>
            7 Reasons More People Are Rethinking Their Hair Routine — And Turning to Scalp-First Peptide Care
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
            Crowned combines Copper Tripeptide-1 (GHK-Cu), Niacinamide, Panthenol, and Biotin into one lightweight daily scalp serum — creating a simpler way to care for hair where it actually starts.
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
              <BookOpen size={14} /> PEPTIDE SCALP CARE
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
            src="/assets/listicle/crowned/crowned_hero_routine.jpg" 
            alt="Crowned Scalp Serum Routine" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.src = "/adv-crowned/imagens/crowned-hero.webp";
            }}
          />
        </div>

        {/* 03 — OPENING ARTICLE CONTENT */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '26px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: 1.3
          }}>
            Why Most Hair Products Miss Where Hair Actually Starts
          </h2>

          <div style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '18px' }}>
              For decades, traditional hair care has followed the exact same routine: Heavy shampoos, thick conditioners, leave-in oils, and styling creams. Almost all of them focus exclusively on the visible hair strand.
            </p>
            <p style={{ marginBottom: '18px' }}>
              While conditioning the strands helps with temporary shine, there's a fundamental question more people are asking: <strong>SHOULDN'T SCALP CARE BE AT THE CORE OF EVERY HAIR ROUTINE?</strong>
            </p>
            <p style={{ marginBottom: '18px', paddingLeft: '16px', borderLeft: '3px solid #27AE60', fontStyle: 'italic' }}>
              Every single hair follicle sits in the scalp. Just like skin requires barrier support and proper nourishment to look healthy, the scalp environment directly influences how hair feels, looks, and performs day after day.
            </p>
            <p style={{ marginBottom: '18px' }}>
              That's where <strong>Crowned®</strong> takes a different approach. Instead of piling heavy greasy oils onto hair ends, Crowned delivers a targeted blend of <strong>Copper Tripeptide-1 (GHK-Cu), Niacinamide, Panthenol, and Biotin</strong> directly to the scalp in a ultra-lightweight leave-in serum.
            </p>
            <p style={{ marginBottom: '24px' }}>
              Four targeted ingredients. One daily dropper. Zero heavy residue.
            </p>

            <div style={{
              backgroundColor: '#1B2613',
              color: '#FFFFFF',
              padding: '20px 24px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '20px', color: '#27AE60', fontWeight: 800 }}>
                Apply. Massage. Go.
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
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '30px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Your Hair Strands Depend on the Environment They Grow From
          </h2>

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
              src="/assets/listicle/crowned/crowned_scalp_environment.jpg" 
              alt="Scalp Environment Care" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/pdp/crowned/crowned-sec-1.png";
              }}
            />
          </div>

          <div style={{ fontSize: '16.5px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              Treating hair without addressing the scalp is like watering leaves instead of plant roots. The scalp is specialized skin containing thousands of hair follicles, blood vessels, and sebaceous glands.
            </p>
            <p>
              When your scalp is well-conditioned, hydrated, and balanced, hair strands have the optimal foundation to look stronger, fuller, and more resilient.
            </p>
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
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '30px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Copper Tripeptide-1 (GHK-Cu) Brings Modern Peptide Technology to Scalp Care
          </h2>

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
              src="/assets/listicle/crowned/crowned_ghk_cu_formula.jpg" 
              alt="Copper Tripeptide GHK-Cu Ingredient" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/assets/pdp/crowned/crowned-sec-3.png";
              }}
            />
          </div>

          <div style={{ fontSize: '16.5px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              Copper Tripeptide-1 (GHK-Cu) is one of the most widely studied cosmetic peptides in modern skin and follicle research. Known for its role in cellular communication and skin renewal, GHK-Cu serves as the flagship ingredient in Crowned.
            </p>
            <p>
              By anchoring the serum with GHK-Cu, Crowned provides targeted peptide support directly to the scalp barrier where traditional products fail to reach.
            </p>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '48px 0' }} />

        {/* 06 — REASON #3 */}
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
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '30px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Niacinamide, Panthenol, and Biotin Work Together for Scalp and Strand Synergy
          </h2>

          <div style={{ fontSize: '16.5px', lineHeight: '1.7', color: 'var(--color-secondary)', marginBottom: '24px' }}>
            <p style={{ marginBottom: '16px' }}>
              A single ingredient is rarely enough for complete care. Crowned reinforces GHK-Cu with a triad of essential vitamins carefully chosen for scalp barrier function and strand conditioning:
            </p>
          </div>

          {/* 4 INGREDIENT CARDS WITH PHOTOS & DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            
            {/* INGREDIENT 1: COPPER TRIPEPTIDE-1 */}
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
                    src="/assets/listicle/crowned/ingredient_ghk_cu.jpg" 
                    alt="Copper Tripeptide-1 GHK-Cu" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/pdp/crowned/crowned-sec-3.png";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      HERO PEPTIDE
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      COPPER TRIPEPTIDE-1
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (GHK-Cu Peptide)
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
                    <Sparkles size={18} />
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '10px' }}>
                  Modern cosmetic peptide for targeted scalp care
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  A copper-binding cosmetic peptide widely studied in modern skin and follicle research to anchor Crowned's scalp-first approach.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To deliver targeted peptide support directly at the scalp level.*
              </div>
            </div>

            {/* INGREDIENT 2: NIACINAMIDE */}
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
                    src="/assets/listicle/crowned/ingredient_niacinamide.jpg" 
                    alt="Niacinamide Vitamin B3" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/pdp/crowned/crowned-sec-1.png";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      BARRIER VITAMIN
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      NIACINAMIDE
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Vitamin B3)
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
                  Proven skin barrier and scalp support
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  One of the most established cosmetic ingredients for supporting skin-barrier function and maintaining a well-conditioned scalp environment.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To reinforce scalp skin-barrier integrity and balance.*
              </div>
            </div>

            {/* INGREDIENT 3: PANTHENOL */}
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
                    src="/assets/listicle/crowned/ingredient_panthenol.jpg" 
                    alt="Panthenol Provitamin B5" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/pdp/crowned/crowned-gal-4.png";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      MOISTURE VITAMIN
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      PANTHENOL
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Provitamin B5)
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
                  Essential moisture & strand elasticity
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  Widely used in hair care for deep conditioning, moisture retention, and helping support softer, smoother, and more resilient strands.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To retain strand moisture and prevent fragile brittleness.*
              </div>
            </div>

            {/* INGREDIENT 4: BIOTIN */}
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
                    src="/assets/listicle/crowned/ingredient_biotin.jpg" 
                    alt="Biotin Vitamin B7" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.target.src = "/assets/pdp/crowned/crowned-gal-3.png";
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>
                      CONDITIONING VITAMIN
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      BIOTIN
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      (Vitamin B7)
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
                  Strand smoothness & overall appearance
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '16px' }}>
                  A trusted favorite in hair cosmetics recognized for enhancing strand smoothness, resilience, and overall healthy hair appearance.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--color-primary)'
              }}>
                <strong style={{ color: '#27AE60' }}>WHY IT'S HERE:</strong> To complement Crowned's overall hair-care profile.*
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
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '30px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            A Lightweight Leave-In Serum That Won't Leave Hair Greasy or Heavy
          </h2>

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
              src="/assets/listicle/crowned/crowned_application_lightweight.jpg" 
              alt="Crowned Application Lightweight Serum" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = "/adv-crowned/imagens/crowned-application.webp";
              }}
            />
          </div>

          <div style={{ fontSize: '16.5px', lineHeight: '1.7', color: 'var(--color-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              One of the main complaints about traditional hair oils is the greasy residue that weighs down roots and requires constant washing.
            </p>
            <p>
              Crowned was specifically formulated as a fast-absorbing, water-based liquid serum. It dries clean within seconds without leaving oily buildup, so you can apply it daily on dry or towel-dried hair without messing up your hairstyle.
            </p>
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
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '30px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            One Simple Dropper Daily Replaces Complicated 5-Step Hair Routines
          </h2>

          <div style={{ fontSize: '16.5px', lineHeight: '1.7', color: 'var(--color-secondary)', marginBottom: '24px' }}>
            <p style={{ marginBottom: '16px' }}>
              Consistency is what determines whether any routine yields results. When a hair-care system requires 5 different products, multi-step masks, and 30-minute rinse times, people inevitably skip days.
            </p>
            <p>
              Crowned takes 10 seconds: Fill 1 dropper, apply directly across your scalp, give a brief 5-second massage, and leave it in. Simple routines are easy to keep.
            </p>
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
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '30px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Direct Scalp Application Delivers Ingredients Exactly Where They Count
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
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
                <Droplets size={22} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#27AE60', marginBottom: '6px', letterSpacing: '0.5px' }}>
                  Targeted Scalp Dropper
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                  Precision pipette delivers active serum straight to the roots and skin barrier.
                </div>
              </div>
            </div>

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
                <Feather size={22} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#27AE60', marginBottom: '6px', letterSpacing: '0.5px' }}>
                  Non-Greasy & Fast-Drying
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                  Absorbs rapidly without sticky residue or changing hair texture.
                </div>
              </div>
            </div>

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
                  Daily Scalp Ritual
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--color-secondary)', lineHeight: '1.5' }}>
                  One quick application each morning or evening keeps the scalp consistently cared for.
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
            Great hair care doesn't require a 10-step routine. It just requires applying the right ingredients where they matter.
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
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '30px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            marginBottom: '28px',
            lineHeight: '1.2'
          }}>
            You Get 90 Days to Decide Whether It Earns a Permanent Place on Your Counter
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
                src="/assets/listicle/crowned/guarantee_badge.png"
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
                  e.target.src = "/assets/listicle/linfaflow/guarantee_badge.png";
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
                display: 'inline-block',
                marginBottom: '12px'
              }}>
                Risk-Free Guarantee
              </div>

              <h3 style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--color-primary)',
                marginBottom: '12px',
                lineHeight: '1.2'
              }}>
                90 Days to Decide
              </h3>

              <p style={{
                fontSize: '16px',
                lineHeight: '1.65',
                color: 'var(--color-secondary)',
                marginBottom: '20px'
              }}>
                Trying a new scalp care product always comes with uncertainty. That's why eligible Crowned® purchases are covered by a <strong>90-Day Money-Back Guarantee</strong>.
              </p>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: 'var(--color-secondary)',
                marginBottom: '24px'
              }}>
                Give consistent scalp care a fair opportunity. If it doesn't fit your daily routine, simply contact customer support within the guarantee period.
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
                  <span>TRY CROWNED® RISK-FREE</span>
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
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              Interactive Buyer's Checklist
            </span>
            <h2 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 'clamp(20px, 4vw, 30px)',
              color: '#141210',
              fontWeight: 800,
              margin: '4px 0 0',
              lineHeight: '1.25'
            }}>
              Before Buying Any Scalp Serum, Ask These 6 Questions:
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
              { num: '01', title: 'Peptide Focus' },
              { num: '02', title: 'Formula' },
              { num: '03', title: 'Routine' },
              { num: '04', title: 'Non-Greasy' },
              { num: '05', title: 'No Stack' },
              { num: '06', title: 'Guarantee' }
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
              { num: '01', title: 'Peptide Focus', q: '1. Does the formula feature modern GHK-Cu peptide technology?', a: 'Crowned features Copper Tripeptide-1 (GHK-Cu) as its flagship cosmetic peptide for targeted scalp care.' },
              { num: '02', title: 'Formula Completeness', q: '2. Are barrier-support and conditioning vitamins included?', a: 'Yes. Niacinamide (B3), Panthenol (B5), and Biotin (B7) complement GHK-Cu in one synergistic formula.' },
              { num: '03', title: 'Simple Routine', q: '3. Takes only seconds without changing your daily schedule?', a: 'One pipette directly to scalp daily. Massage gently for 5 seconds and leave in. No rinse needed.' },
              { num: '04', title: 'Non-Greasy Finish', q: '4. Is it a lightweight leave-in serum that won\'t weigh down hair?', a: '100% water-based liquid serum that dries clean without leaving heavy or sticky oil buildup.' },
              { num: '05', title: 'No Stack Clutter', q: '5. Does it eliminate the need for 5 different scalp products?', a: 'Crowned brings scalp-barrier care, peptide technology, and strand conditioning into 1 daily serum.' },
              { num: '06', title: 'Risk-Free Trial', q: '6. Do you get 90 full days to evaluate your experience?', a: 'Eligible Crowned purchases are backed by a 90-Day Money-Back Guarantee.' }
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
                    <strong style={{ color: '#27AE60', fontSize: '11px', letterSpacing: '0.8px' }}>
                      THE CROWNED® STANDARD
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
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>
            "Can't I Just Apply Traditional Hair Oils?"
          </h3>
          <p style={{ fontSize: '15.5px', color: 'var(--color-secondary)', maxWidth: '680px', margin: '0 auto 20px', lineHeight: '1.6', textAlign: 'left' }}>
            Traditional oils are designed primarily around coating hair fibers. But heavy oils on the scalp can clog pores and feel greasy. The real value of Crowned is <strong>TARGETED PEPTIDE CARE</strong>: Copper Tripeptide-1, Niacinamide, Panthenol, and Biotin combined into an ultra-lightweight leave-in scalp serum.
          </p>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '18px', fontWeight: 800, color: '#27AE60' }}>
            Targeted Scalp Care. Zero Greasy Residue.
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
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px', marginBottom: '6px' }}>
              The Peptide Scalp Serum
            </div>
            <h2 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '36px',
              fontWeight: 800,
              color: 'var(--color-primary)',
              marginBottom: '12px'
            }}>
              Meet Crowned®
            </h2>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-secondary)' }}>
              Four targeted ingredients. One daily dropper. Scalp-first care.
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
                src="/assets/listicle/crowned/gallery-1.png" 
                alt="Crowned Bottle" 
                style={{ width: '100%', height: 'auto', maxHeight: '380px', objectFit: 'contain', borderRadius: 'var(--radius-md)', display: 'block' }}
                onError={(e) => {
                  e.target.src = "/assets/pdp/crowned/crowned-gal-1.png";
                }}
              />
            </div>

            <div>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--color-secondary)', marginBottom: '20px' }}>
                Crowned® is a lightweight cosmetic scalp serum created for adults seeking a clean, effortless way to support scalp health and fuller-looking hair.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '28px' }}>
                {[
                  'Copper Tripeptide-1 (GHK-Cu) hero peptide',
                  'Niacinamide (B3) for scalp barrier care',
                  'Panthenol (B5) for strand moisture',
                  'Biotin (B7) for strand conditioning',
                  'Ultra-lightweight non-greasy leave-in formula',
                  'One 10-second daily application'
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
                  <span>DISCOVER CROWNED®</span>
                  <ArrowRight size={15} />
                </a>
              </div>
              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-muted)' }}>
                Covered by our 90-Day Money-Back Guarantee
              </div>
            </div>
          </div>
        </section>

        {/* 14 — WHAT CROWNED IS AND ISN'T */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '30px',
              fontWeight: 800,
              color: 'var(--color-primary)',
              marginBottom: '4px'
            }}>
              What Crowned® Is — and What It Isn't
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
                marginBottom: '16px'
              }}>
                What Crowned® Is
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'A targeted cosmetic scalp serum featuring Copper Tripeptide-1 (GHK-Cu)',
                  'A daily 10-second leave-in step created for scalp barrier and strand conditioning',
                  'Lightweight, non-greasy, and designed for daily leave-in convenience',
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
                marginBottom: '16px'
              }}>
                What Crowned® Is Not
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'A heavy oil that leaves greasy roots requiring immediate washing',
                  'A prescription medical treatment or drug for clinical alopecia',
                  'A miracle overnight solution promising magic hair growth',
                  'A complicated multi-product system that requires hours of application'
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
                src="/assets/listicle/crowned/crowned_ugc_collage.jpg" 
                alt="Real Crowned Customers"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '1 / 1',
                  display: 'block',
                  objectFit: 'cover',
                  borderRadius: '24px'
                }}
                onError={(e) => {
                  e.target.src = "/adv-crowned/imagens/crowned-before-after.webp";
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
                display: 'inline-block',
                marginBottom: '14px'
              }}>
                Real Routines. Real Reasons.
              </div>

              <h2 style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 'clamp(26px, 4vw, 38px)',
                fontWeight: 800,
                color: 'var(--color-primary)',
                marginBottom: '16px',
                lineHeight: '1.2'
              }}>
                Why People Choose Crowned®
              </h2>

              <p style={{
                fontSize: '15.5px',
                lineHeight: '1.65',
                color: 'var(--color-secondary)',
                marginBottom: '24px'
              }}>
                One full dropper of Crowned® each day — that is the entire protocol. No washing out greasy oils, no swallowing multiple pills, no complicated routine. People are discovering how easy consistency becomes when scalp care fits seamlessly into real life. Try it risk-free with our 90-Day Guarantee.
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
                  <span>SEE CROWNED BUNDLES</span>
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
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px' }}>
              Customer Reviews
            </span>
            <h2 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--color-primary)',
              margin: '4px 0 0'
            }}>
              What Real Customers Value
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                name: 'Sophia M.',
                stars: 5,
                title: '"No heavy oil format."',
                body: 'I wanted direct scalp care without weighing down my hair. Crowned absorbs fast and feels weightless.',
                photo: '/crowned/images/03-result-06.webp',
                fallback: '/assets/pdp/crowned/crowned-gal-2.png'
              },
              {
                name: 'Amanda K.',
                stars: 5,
                title: '"I love how light it feels."',
                body: 'I\'ve tried scalp oils before and hated how my roots felt afterward. Crowned is much easier to work into my daily routine.',
                photo: '/crowned/images/03-result-01.webp',
                fallback: '/assets/pdp/crowned/crowned-gal-3.png'
              },
              {
                name: 'Jessica W.',
                stars: 5,
                title: '"Finally, a scalp product I actually use."',
                body: 'One dropper, a quick massage and I\'m done. It doesn\'t complicate everything else I already do with my hair.',
                photo: '/crowned/images/03-result-02.webp',
                fallback: '/assets/pdp/crowned/crowned-gal-4.png'
              },
              {
                name: 'Rachel B.',
                stars: 5,
                title: '"The formula is what caught my attention."',
                body: 'I had seen copper peptides in skincare before, so I liked the idea of a scalp serum built around GHK-Cu.',
                photo: '/crowned/images/03-result-03.webp',
                fallback: '/assets/pdp/crowned/crowned-gal-5.png'
              },
              {
                name: 'Emily S.',
                stars: 5,
                title: '"Easy to use without changing my routine."',
                body: 'I still use my regular shampoo and styling products. Crowned is just one extra step, which makes it easy to stay consistent.',
                photo: '/crowned/images/03-result-04.webp',
                fallback: '/assets/pdp/crowned/crowned-gal-1.png'
              }
            ].map((rev, idx) => (
              <div key={idx} className="review-card-item">
                <div className="review-photo-wrapper">
                  <img 
                    src={rev.photo} 
                    alt={rev.name} 
                    className="review-photo-img" 
                    onError={(e) => {
                      e.target.src = rev.fallback;
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
              Today's Crowned® Offer
            </div>
            <h2 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--color-primary)',
              marginBottom: '8px'
            }}>
              Choose the Routine That Fits You
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
                    src="/assets/listicle/crowned/bundle-1.png"
                    alt="Crowned Starter Bundle"
                    style={{ maxHeight: '100%', maxWidth: '85%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                    onError={(e) => {
                      e.target.src = "/assets/pdp/crowned/crowned-bundle-1.png";
                    }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-muted)', letterSpacing: '1px', marginBottom: '4px' }}>STARTER</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>Buy 1 + Get 1 Free</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#27AE60', marginBottom: '8px' }}>$34.75 / bottle ($69.50 total)</div>
                <p style={{ fontSize: '13px', color: 'var(--color-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>Ideal for starting your scalp-care routine.</p>
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
                    src="/assets/listicle/crowned/bundle-2.png"
                    alt="Crowned 4-Bottle Bundle"
                    style={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                    onError={(e) => {
                      e.target.src = "/assets/pdp/crowned/crowned-bundle-2.png";
                    }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>4 BOTTLES TOTAL</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>Buy 2 + Get 2 Free</div>
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
                    src="/assets/listicle/crowned/bundle-3.png"
                    alt="Crowned 6-Bottle Bundle"
                    style={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
                    onError={(e) => {
                      e.target.src = "/assets/pdp/crowned/crowned-bundle-3.png";
                    }}
                  />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1px', marginBottom: '4px' }}>6 BOTTLES TOTAL</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>Buy 3 + Get 3 Free</div>
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
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#27AE60', letterSpacing: '1.5px' }}>
              Frequently Asked Questions
            </span>
            <h2 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--color-primary)',
              margin: '4px 0 0'
            }}>
              Questions About Crowned®?
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: 'What exactly is Crowned®?',
                a: 'Crowned is a lightweight leave-in cosmetic scalp serum formulated with Copper Tripeptide-1 (GHK-Cu), Niacinamide, Panthenol, Biotin and complementary ingredients. It is designed to support scalp condition and the appearance of stronger, fuller-looking hair.'
              },
              {
                q: 'How do I apply it?',
                a: 'Apply 1 full dropper daily directly to a dry or towel-dried scalp according to product directions. Massage gently for a few seconds. Leave it in. No rinse is required.'
              },
              {
                q: 'Will it make my hair greasy or oily?',
                a: 'Crowned is formulated as an ultra-lightweight, water-based liquid serum rather than a heavy oil. It absorbs quickly into the scalp without leaving sticky or greasy residue on roots.'
              },
              {
                q: 'Do I need to change my shampoo or hair routine?',
                a: 'No. Crowned is designed to slot into your existing daily routine without needing extra shampoos or complex multi-step systems.'
              },
              {
                q: 'Is Crowned® a hair-loss treatment or medicine?',
                a: 'No. Crowned is a cosmetic scalp-care product intended to support scalp condition and the appearance of healthy-looking hair. It is not a drug or prescription treatment for medical alopecia.'
              },
              {
                q: 'What if Crowned® isn\'t right for me?',
                a: 'All eligible purchases are protected by our 90-Day Money-Back Guarantee. If you\'re not satisfied, simply contact customer support within 90 days for a refund.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: 800,
                      color: 'var(--color-primary)'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} style={{ color: '#27AE60' }} /> : <ChevronDown size={18} style={{ color: 'var(--color-muted)' }} />}
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '0 20px 16px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: 'var(--color-secondary)',
                      borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                      paddingTop: '12px'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* FLOATING BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#27AE60',
            color: '#FFFFFF',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            zIndex: 99
          }}
        >
          ↑
        </button>
      )}

    </div>
  );
}

export default CrownedListicle;
