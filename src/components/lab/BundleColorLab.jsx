import React, { useState } from 'react';
import { PDP_DATA } from '../../config/pdpData';

export function BundleColorLab({ onBackToSite, onApplyToSite }) {
  const defaultBundles = PDP_DATA.slimsoda.bundlesSection.bundles;

  // Preset Color Palettes
  const presets = [
    {
      id: 'current',
      name: '01 — Current Terracotta',
      cardBg: '#FFFFFF',
      featuredCardBg: '#FFFFFF',
      borderColor: '#D96B32',
      badgeBg: '#D96B32',
      bestValueBadgeBg: '#141210',
      ctaBg: '#D96B32',
      starterCtaBg: '#141210',
      savingsBg: 'rgba(39, 174, 96, 0.08)',
      savingsTextColor: '#27AE60'
    },
    {
      id: 'forest-gold',
      name: '02 — Brand Forest Green & Gold',
      cardBg: '#FFFFFF',
      featuredCardBg: '#F6FFFC',
      borderColor: '#4B6833',
      badgeBg: '#4B6833',
      bestValueBadgeBg: '#D4AF37',
      ctaBg: '#4B6833',
      starterCtaBg: '#141210',
      savingsBg: 'rgba(75, 104, 51, 0.12)',
      savingsTextColor: '#4B6833'
    },
    {
      id: 'midnight-gold',
      name: '03 — Midnight Dark Luxury',
      cardBg: '#141210',
      featuredCardBg: '#1B2613',
      borderColor: '#D4AF37',
      badgeBg: '#D96B32',
      bestValueBadgeBg: '#D4AF37',
      ctaBg: '#D96B32',
      starterCtaBg: '#D4AF37',
      savingsBg: 'rgba(212, 175, 55, 0.15)',
      savingsTextColor: '#D4AF37',
      isDark: true
    },
    {
      id: 'vibrant-emerald',
      name: '04 — Vibrant High-Vis Orange & Emerald',
      cardBg: '#FFFFFF',
      featuredCardBg: '#FFF8F4',
      borderColor: '#F36F21',
      badgeBg: '#F36F21',
      bestValueBadgeBg: '#27AE60',
      ctaBg: '#F36F21',
      starterCtaBg: '#141210',
      savingsBg: 'rgba(39, 174, 96, 0.12)',
      savingsTextColor: '#27AE60'
    },
    {
      id: 'soft-sage',
      name: '05 — Soft Sage & Warm Cream',
      cardBg: '#FAF7F2',
      featuredCardBg: '#FFFFFF',
      borderColor: '#3A5311',
      badgeBg: '#3A5311',
      bestValueBadgeBg: '#D96B32',
      ctaBg: '#3A5311',
      starterCtaBg: '#141210',
      savingsBg: 'rgba(58, 83, 17, 0.1)',
      savingsTextColor: '#3A5311'
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
    <div style={{ backgroundColor: customStyle.isDark ? '#0A0908' : '#FAF7F2', minHeight: '100vh', padding: '40px 20px 100px 20px' }}>
      
      {/* Top Control Header */}
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
              🔬 LOCALHOST COLOR LABORATORY
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#141210', margin: '4px 0 0 0' }}>
              Laboratório de Cores dos Tabela de Ofertas (3 Pacotes)
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
          ESCOLHA UM PRESET PRONTO OU PERSONALIZE ABAIXO:
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPreset(p)}
              style={{
                backgroundColor: activePreset.id === p.id ? '#141210' : '#F5F2EC',
                color: activePreset.id === p.id ? '#FFFFFF' : '#333',
                border: activePreset.id === p.id ? '2px solid #141210' : '1px solid #DDD',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Color Pickers Bar */}
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
              BORDA DESTACADA
            </label>
            <input 
              type="color" 
              value={customStyle.borderColor} 
              onChange={(e) => handleColorChange('borderColor', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
              BOTÃO DE COMPRA (PRINCIPAL)
            </label>
            <input 
              type="color" 
              value={customStyle.ctaBg} 
              onChange={(e) => handleColorChange('ctaBg', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
              BOTÃO DE COMPRA (STARTER)
            </label>
            <input 
              type="color" 
              value={customStyle.starterCtaBg} 
              onChange={(e) => handleColorChange('starterCtaBg', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
              BADGE POPULAR / MOST POPULAR
            </label>
            <input 
              type="color" 
              value={customStyle.badgeBg} 
              onChange={(e) => handleColorChange('badgeBg', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
              BADGE BEST VALUE
            </label>
            <input 
              type="color" 
              value={customStyle.bestValueBadgeBg} 
              onChange={(e) => handleColorChange('bestValueBadgeBg', e.target.value)} 
              style={{ width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Live Preview Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', color: customStyle.borderColor, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            CHOOSE YOUR BUNDLE
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: customStyle.isDark ? '#FFFFFF' : '#141210', margin: '0 0 8px' }}>
            SAVE MORE WHEN YOU STOCK UP.
          </h2>
          <p style={{ fontSize: '15px', color: customStyle.isDark ? 'rgba(255,255,255,0.7)' : '#666', fontWeight: 500 }}>
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
            const isFeatured = bundle.isPopular || bundle.isBestValue;
            const currentCardBg = isFeatured ? customStyle.featuredCardBg : customStyle.cardBg;
            const currentCtaBg = bundle.id === 'starter' ? customStyle.starterCtaBg : customStyle.ctaBg;
            const currentBadgeBg = bundle.isBestValue ? customStyle.bestValueBadgeBg : customStyle.badgeBg;

            return (
              <div
                key={bundle.id}
                style={{
                  backgroundColor: currentCardBg,
                  borderRadius: '16px',
                  border: isFeatured ? `2.5px solid ${customStyle.borderColor}` : '1px solid rgba(0, 0, 0, 0.12)',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: isFeatured ? `0 16px 40px ${customStyle.borderColor}30` : '0 4px 20px rgba(0, 0, 0, 0.04)',
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
                      backgroundColor: currentBadgeBg,
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
                    <span style={{ fontSize: '12px', fontWeight: 800, color: customStyle.isDark ? '#AAA' : '#888', letterSpacing: '0.1em' }}>
                      {bundle.name}
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: customStyle.isDark ? '#FFF' : '#141210', margin: '4px 0 2px' }}>
                      {bundle.deal}
                    </h3>
                    <span style={{ fontSize: '13px', color: customStyle.isDark ? '#BBB' : '#666', fontWeight: 600 }}>
                      {bundle.bottles}
                    </span>
                  </div>

                  <div 
                    style={{ 
                      textAlign: 'center', 
                      margin: '16px 0', 
                      padding: '14px 0', 
                      borderTop: customStyle.isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F0ECE6', 
                      borderBottom: customStyle.isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #F0ECE6' 
                    }}
                  >
                    <div style={{ fontSize: '32px', fontWeight: 900, color: customStyle.isDark ? '#FFF' : '#141210', lineHeight: 1 }}>
                      {bundle.pricePerBottle}
                      <span style={{ fontSize: '14px', fontWeight: 600, color: customStyle.isDark ? '#AAA' : '#666' }}> / bottle</span>
                    </div>
                    <div style={{ fontSize: '14px', color: customStyle.isDark ? '#AAA' : '#777', marginTop: '6px', fontWeight: 600 }}>
                      {bundle.totalPrice} total
                    </div>
                    {bundle.savings && (
                      <span 
                        style={{ 
                          display: 'inline-block', 
                          marginTop: '8px', 
                          fontSize: '12px', 
                          fontWeight: 700, 
                          color: customStyle.savingsTextColor, 
                          backgroundColor: customStyle.savingsBg,
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
                          color: customStyle.isDark ? '#DDD' : '#444', 
                          fontWeight: 600,
                          marginBottom: '8px'
                        }}
                      >
                        <span style={{ color: customStyle.savingsTextColor, fontWeight: 800 }}>✓</span>
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
                    backgroundColor: currentCtaBg,
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    padding: '16px',
                    borderRadius: '10px',
                    border: 'none',
                    textAlign: 'center',
                    boxShadow: `0 8px 24px ${currentCtaBg}40`,
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
