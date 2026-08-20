import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X, Check, Sparkles, Eye } from 'lucide-react';
import { CTAButton } from '../common/CTAButton';

export const BUTTON_STYLES = [
  {
    id: 'liquid-fill',
    name: '01 — Liquid Fill',
    subtitle: 'Quiet Luxury',
    description: 'Efeito de onda fluida que sobe do fundo no hover, alternando a cor do texto e fazendo a seta deslizar suavemente.',
    vibe: 'Ideal para marcas de alto padrão como Aesop, Le Labo e spas de luxo.',
  },
  {
    id: 'magnetic-shimmer',
    name: '02 — Magnetic Shimmer',
    subtitle: 'Contemporary Luxury',
    description: 'Efeito de vidro fosco com moldura botânica de brilho giratório e elevação magnética 3D ao passar o mouse.',
    vibe: 'Visual moderno e arquitetônico, estilo Apple, Dyson e Oura Ring.',
  },
  {
    id: 'editorial-line',
    name: '03 — Editorial Line',
    subtitle: 'High-Fashion Minimal',
    description: 'Estilo tipográfico limpo com linha botânica que se expande do centro e anel de seta magnético.',
    vibe: 'Inspirado em capas de revista de luxo (Vogue, Kinfolk).',
  },
  {
    id: 'radiant-pill',
    name: '04 — Radiant Pill',
    subtitle: 'Clean Wellness',
    description: 'Botão pílula no tom verde botânico (#4B6833) que emite uma aura de luz radiante e rotaciona a seta em 45°.',
    vibe: 'Visual contemporâneo de marcas premium americanas de wellness.',
  },
];

export const DesignLab = ({ activeStyle, onSelectStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewBg, setPreviewBg] = useState('sand'); // 'sand' | 'dark'

  return (
    <>
      {/* Floating Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 999,
          backgroundColor: '#1B2613',
          color: '#F6FFFC',
          border: '1px solid rgba(246, 255, 252, 0.2)',
          borderRadius: 'var(--radius-full)',
          padding: '0.85rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        <FlaskConical size={18} style={{ color: '#4B6833' }} />
        <span>Laboratório de Design</span>
        <span
          style={{
            fontSize: '0.65rem',
            backgroundColor: '#4B6833',
            color: '#F6FFFC',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-full)',
          }}
        >
          LIVE
        </span>
      </motion.button>

      {/* Full Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              backgroundColor: 'rgba(10, 12, 10, 0.85)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              style={{
                backgroundColor: '#EEE9DE',
                color: '#1B2613',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(75, 104, 51, 0.2)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
                width: '100%',
                maxWidth: '960px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.5rem',
                position: 'relative',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '2rem',
                  borderBottom: '1px solid rgba(75, 104, 51, 0.15)',
                  paddingBottom: '1.5rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Sparkles size={20} style={{ color: '#4B6833' }} />
                    <span className="text-eyebrow" style={{ color: '#4B6833' }}>LABORATÓRIO DE BOTÕES & EFEITOS</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-brand-display)', fontSize: '2.25rem', color: '#1B2613' }}>
                    Escolha o Estilo Perfeito
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: '#3D4F31', marginTop: '0.25rem' }}>
                    Passe o mouse sobre os botões abaixo para testar a sensação ao vivo. Clique em "Aplicar no Site" para atualizar a Landing Page instantaneamente!
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1B2613',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(75, 104, 51, 0.1)',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Background Toggle Switch */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem',
                  backgroundColor: 'rgba(75, 104, 51, 0.08)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Eye size={16} style={{ color: '#4B6833' }} />
                  <span>Modo de Fundo para Testes:</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setPreviewBg('sand')}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      backgroundColor: previewBg === 'sand' ? '#4B6833' : 'transparent',
                      color: previewBg === 'sand' ? '#F6FFFC' : '#1B2613',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Fundo Claro (#EEE9DE)
                  </button>

                  <button
                    onClick={() => setPreviewBg('dark')}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      backgroundColor: previewBg === 'dark' ? '#1B2613' : 'transparent',
                      color: previewBg === 'dark' ? '#F6FFFC' : '#1B2613',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Fundo Escuro (#0A0C0A)
                  </button>
                </div>
              </div>

              {/* Options Showcase Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {BUTTON_STYLES.map((style) => {
                  const isSelected = activeStyle === style.id;

                  return (
                    <div
                      key={style.id}
                      style={{
                        backgroundColor: '#F6FFFC',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid #4B6833' : '1px solid rgba(75, 104, 51, 0.15)',
                        padding: '1.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isSelected ? '0 10px 30px rgba(75, 104, 51, 0.15)' : '0 4px 15px rgba(0,0,0,0.03)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#4B6833', textTransform: 'uppercase' }}>
                            {style.subtitle}
                          </span>
                          {isSelected && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#4B6833', fontWeight: 700 }}>
                              <Check size={14} /> ATIVO NO SITE
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-brand-display)', fontSize: '1.5rem', marginBottom: '0.75rem', color: '#1B2613' }}>
                          {style.name}
                        </h3>

                        <p style={{ fontSize: '0.875rem', color: '#3D4F31', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                          {style.description}
                        </p>

                        <span style={{ fontSize: '0.75rem', color: '#6B7A60', fontStyle: 'italic', display: 'block', marginBottom: '1.5rem' }}>
                          {style.vibe}
                        </span>

                        {/* Interactive Sandbox Test Stage */}
                        <div
                          style={{
                            padding: '2rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: previewBg === 'sand' ? '#EEE9DE' : '#0A0C0A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            border: '1px stroke rgba(0,0,0,0.05)',
                            transition: 'background 0.3s ease',
                          }}
                        >
                          <CTAButton variant="primary" size="medium" forceStyle={style.id}>
                            EXPLORE ESSENTIALS
                          </CTAButton>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectStyle(style.id);
                          setIsOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-full)',
                          border: isSelected ? '1.5px solid #4B6833' : '1px solid rgba(75, 104, 51, 0.2)',
                          backgroundColor: isSelected ? '#4B6833' : 'transparent',
                          color: isSelected ? '#F6FFFC' : '#1B2613',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isSelected ? '✓ Estilo Ativo' : 'Aplicar Este Estilo no Site'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
