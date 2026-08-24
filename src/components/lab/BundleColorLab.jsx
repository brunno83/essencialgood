import React, { useState } from 'react';
import { PDP_DATA } from '../../config/pdpData';

export function BundleColorLab({ onBackToSite, onApplyToSite }) {
  const defaultBundles = PDP_DATA.slimsoda.bundlesSection.bundles;

  // 100% Brand Palette Presets (Laranja #D96B32, Verde Floresta #4B6833, Sálvia #7A9A60, Bege #FAF5EF)
  const presets = [
    {
      id: 'brand-orange-green',
      name: '01 — Laranja no Most Popular + Verde no Best Value',
      cardBg: '#FFFFFF',
      popularCardBg: '#FAF5EF',
      popularBorder: '#D96B32',
      popularCta: '#D96B32',
      popularBadge: '#D96B32',
      bestValueCardBg: '#F6FFFC',
      bestValueBorder: '#4B6833',
      bestValueCta: '#4B6833',
      bestValueBadge: '#4B6833',
      starterBorder: 'rgba(0,0,0,0.12)',
      starterCta: '#4B6833',
      savingsTextColor: '#4B6833',
      savingsBg: 'rgba(75, 104, 51, 0.1)'
    },
    {
      id: 'brand-all-orange',
      name: '02 — Laranja Terracotta em Todos os Botões (Harmônico)',
      cardBg: '#FFFFFF',
      popularCardBg: '#FAF5EF',
      popularBorder: '#D96B32',
      popularCta: '#D96B32',
      popularBadge: '#D96B32',
      bestValueCardBg: '#FFFFFF',
      bestValueBorder: '#D96B32',
      bestValueCta: '#D96B32',
      bestValueBadge: '#4B6833',
      starterBorder: 'rgba(0,0,0,0.12)',
      starterCta: '#D96B32',
      savingsTextColor: '#27AE60',
      savingsBg: 'rgba(39, 174, 96, 0.08)'
    },
    {
      id: 'brand-solid-cards',
      name: '03 — Cards Sólidos (Card Laranja + Card Verde)',
      cardBg: '#FFFFFF',
      popularCardBg: '#D96B32',
      popularBorder: '#D96B32',
      popularCta: '#4B6833',
      popularBadge: '#4B6833',
      popularTextWhite: true,
      bestValueCardBg: '#4B6833',
      bestValueBorder: '#4B6833',
      bestValueCta: '#D96B32',
      bestValueBadge: '#D96B32',
      bestValueTextWhite: true,
      starterBorder: 'rgba(0,0,0,0.12)',
      starterCta: '#D96B32',
      savingsTextColor: '#D96B32',
      savingsBg: '#FFFFFF'
    },
    {
      id: 'brand-beige-cream',
      name: '04 — Fundo Bege Suave (#FAF5EF) + Botões Laranja e Verde',
      cardBg: '#FAF5EF',
      popularCardBg: '#FFFFFF',
      popularBorder: '#D96B32',
      popularCta: '#D96B32',
      popularBadge: '#D96B32',
      bestValueCardBg: '#FFFFFF',
      bestValueBorder: '#4B6833',
      bestValueCta: '#4B6833',
      bestValueBadge: '#4B6833',
      starterBorder: 'rgba(0,0,0,0.12)',
      starterCta: '#7A9A60',
      savingsTextColor: '#4B6833',
      savingsBg: 'rgba(75, 104, 51, 0.12)'
    },
    {
      id: 'brand-sage-luxury',
      name: '05 — Verde Sálvia (#7A9A60) & Laranja Terracotta',
      cardBg: '#FFFFFF',
      popularCardBg: '#FAF7F2',
      popularBorder: '#7A9A60',
      popularCta: '#7A9A60',
      popularBadge: '#7A9A60',
      bestValueCardBg: '#FFF8F4',
      bestValueBorder: '#D96B32',
      bestValueCta: '#D96B32',
      bestValueBadge: '#7A9A60',
      starterBorder: 'rgba(0,0,0,0.12)',
      starterCta: '#D96B32',
      savingsTextColor: '#7A9A60',
      savingsBg: 'rgba(122, 154, 96, 0.12)'
    }
  ];

  const [activePreset, setActivePreset] = useState(presets[0]);
  const [customStyle, setCustomStyle] = useState(presets[0]);

  const selectPreset = (preset) => {
    setActivePreset(preset);
    setCustomStyle(preset);
  };

  const handleColorChange = (key, value) => {
    setCustomStyle((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 20px 100px 20px' }}>
      
      {/* Control Panel Header */}
      <div 
        style={{ 
          maxWidth: '1200px', 
          margin: '0 auto 36px auto', 
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#D96B32', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              🔬 TESTES DE PALETA DA MARCA (SEM PRETO)
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#141210', margin: '4px 0 0 0' }}>
              Teste de Cores dos Cards: Laranja (#D96B32), Verde (#4B6833) e Bege (#FAF5EF)
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onBackToSite}
              style={{
                backgroundColor: '#F0ECE6',
                color: '#141210',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ← Voltar ao Site
            </button>

            <button
              onClick={() => onApplyToSite && onApplyToSite(customStyle)}
              style={{
                backgroundColor: '#27AE60',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 22px',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(39, 174, 96, 0.3)'
              }}
            >
              ✓ APLICAR ESTA COMBINAÇÃO NA PÁGINA
            </button>
          </div>
        </div>

        {/* Preset Selector Buttons */}
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#666', marginBottom: '10px' }}>
          CLIQUE NOS PRESETS DA MARCA PARA TESTAR CADA COMBINAÇÃO:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPreset(p)}
              style={{
                backgroundColor: activePreset.id === p.id ? '#D96B32' : '#F5F2EC',
                color: activePreset.id === p.id ? '#FFFFFF' : '#333',
                border: activePreset.id === p.id ? '2px solid #D96B32' : '1px solid #DDD',
                borderRadius: '12px',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: 800,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Custom Color Adjustment Row */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '14px', 
            backgroundColor: '#FAF7F2', 
            padding: '16px', 
            borderRadius: '14px',
            border: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
              BORDA MOST POPULAR
            </label>
            <input 
              type="color" 
              value={customStyle.popularBorder} 
              onChange={(e) => handleColorChange('popularBorder', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
              BOTÃO MOST POPULAR
            </label>
            <input 
              type="color" 
              value={customStyle.popularCta} 
              onChange={(e) => handleColorChange('popularCta', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
              BORDA BEST VALUE
            </label>
            <input 
              type="color" 
              value={customStyle.bestValueBorder} 
              onChange={(e) => handleColorChange('bestValueBorder', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
              BOTÃO BEST VALUE
            </label>
            <input 
              type="color" 
              value={customStyle.bestValueCta} 
              onChange={(e) => handleColorChange('bestValueCta', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
              BOTÃO STARTER
            </label>
            <input 
              type="color" 
              value={customStyle.starterCta} 
              onChange={(e) => handleColorChange('starterCta', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Live Preview Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', color: customStyle.popularBorder, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            CHOOSE YOUR BUNDLE
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#141210', margin: '0 0 8px' }}>
            SAVE MORE WHEN YOU STOCK UP.
          </h2>
          <p style={{ fontSize: '15px', color: '#666', fontWeight: 500 }}>
            Choose the option that works best for your routine.
          </p>
        </div>

        {/* 3 Bundle Cards Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {defaultBundles.map((bundle) => {
            const isPopular = bundle.isPopular;
            const isBestValue = bundle.isBestValue;
            const isFeatured = isPopular || isBestValue;

            let cardBg = customStyle.cardBg;
            let borderColor = customStyle.starterBorder || 'rgba(0,0,0,0.12)';
            let ctaBg = customStyle.starterCta;
            let badgeBg = '#4B6833';
            let isWhiteText = false;

            if (isPopular) {
              cardBg = customStyle.popularCardBg;
              borderColor = customStyle.popularBorder;
              ctaBg = customStyle.popularCta;
              badgeBg = customStyle.popularBadge;
              isWhiteText = Boolean(customStyle.popularTextWhite);
            } else if (isBestValue) {
              cardBg = customStyle.bestValueCardBg;
              borderColor = customStyle.bestValueBorder;
              ctaBg = customStyle.bestValueCta;
              badgeBg = customStyle.bestValueBadge;
              isWhiteText = Boolean(customStyle.bestValueTextWhite);
            }

            return (
              <div
                key={bundle.id}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: '16px',
                  border: isFeatured ? `2.5px solid ${borderColor}` : `1.5px solid ${borderColor}`,
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: isFeatured ? `0 16px 40px ${borderColor}25` : '0 4px 20px rgba(0, 0, 0, 0.04)',
                  transform: isFeatured ? 'translateY(-6px)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Top Badge */}
                {bundle.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: badgeBg,
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {bundle.badge}
                  </div>
                )}

                <div>
                  {/* Bottle Image */}
                  {bundle.image && (
                    <div
                      style={{
                        width: '100%',
                        height: '140px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                        marginTop: bundle.badge ? '8px' : '0'
                      }}
                    >
                      <img
                        src={bundle.image}
                        alt={bundle.name}
                        style={{
                          maxHeight: '100%',
                          maxWidth: '90%',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))'
                        }}
                      />
                    </div>
                  )}

                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: isWhiteText ? 'rgba(255,255,255,0.8)' : '#888', letterSpacing: '0.1em' }}>
                      {bundle.name}
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: isWhiteText ? '#FFFFFF' : '#141210', margin: '4px 0 2px' }}>
                      {bundle.deal}
                    </h3>
                    <span style={{ fontSize: '13px', color: isWhiteText ? 'rgba(255,255,255,0.85)' : '#666', fontWeight: 600 }}>
                      {bundle.bottles}
                    </span>
                  </div>

                  <div 
                    style={{ 
                      textAlign: 'center', 
                      margin: '16px 0', 
                      padding: '14px 0', 
                      borderTop: isWhiteText ? '1px solid rgba(255,255,255,0.2)' : '1px solid #F0ECE6', 
                      borderBottom: isWhiteText ? '1px solid rgba(255,255,255,0.2)' : '1px solid #F0ECE6' 
                    }}
                  >
                    <div style={{ fontSize: '32px', fontWeight: 900, color: isWhiteText ? '#FFFFFF' : '#141210', lineHeight: 1 }}>
                      {bundle.pricePerBottle}
                      <span style={{ fontSize: '14px', fontWeight: 600, color: isWhiteText ? 'rgba(255,255,255,0.8)' : '#666' }}> / bottle</span>
                    </div>
                    <div style={{ fontSize: '14px', color: isWhiteText ? 'rgba(255,255,255,0.85)' : '#777', marginTop: '6px', fontWeight: 600 }}>
                      {bundle.totalPrice} total
                    </div>
                    {bundle.savings && (
                      <span 
                        style={{ 
                          display: 'inline-block', 
                          marginTop: '8px', 
                          fontSize: '12px', 
                          fontWeight: 700, 
                          color: isWhiteText ? customStyle.savingsTextColor : customStyle.savingsTextColor, 
                          backgroundColor: isWhiteText ? '#FFFFFF' : customStyle.savingsBg,
                          padding: '4px 10px',
                          borderRadius: '12px'
                        }}
                      >
                        {bundle.savings}
                      </span>
                    )}
                  </div>

                  {/* Perks */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                    {bundle.perks.map((perk, idx) => (
                      <li 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          fontSize: '13.5px', 
                          color: isWhiteText ? '#FFFFFF' : '#444', 
                          fontWeight: 600,
                          marginBottom: '8px'
                        }}
                      >
                        <span style={{ color: isWhiteText ? '#FFFFFF' : customStyle.savingsTextColor, fontWeight: 800 }}>✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Checkout CTA */}
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    backgroundColor: ctaBg,
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    padding: '16px',
                    borderRadius: '10px',
                    border: 'none',
                    textAlign: 'center',
                    boxShadow: `0 8px 24px ${ctaBg}40`,
                    cursor: 'pointer'
                  }}
                >
                  {bundle.ctaText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
