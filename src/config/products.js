import { PRODUCT_LINKS } from './links';

export const PRODUCTS = [
  {
    id: 'slimsoda',
    number: '01',
    name: 'SlimSODA',
    category: 'BODY',
    tagline: 'Daily wellness designed to complement your metabolic routine.',
    headline: 'MAKE YOUR DAILY ROUTINE WORK FOR YOU.',
    copy: 'SlimSODA is designed to complement your everyday wellness routine with a convenient formula made for modern life.',
    accentColor: '#D96B32',
    bgGradient: 'linear-gradient(135deg, #FBF6EF 0%, #EEE9DE 100%)',
    cardBg: '#F6FFFC',
    accentLight: 'rgba(217, 107, 50, 0.15)',
    transitionTone: 'warm-orange',
    link: PRODUCT_LINKS.SlimSODA,
    // Asset file paths for all 3 section contexts
    imageBottle: '/assets/products/product_slimsoda_bottle.png',       // Seção 04 (Meet The Essentials - 3 Tubs)
    imageHighlight: '/assets/products/highlight_slimsoda.png',       // Seção 05 (Product Highlights - 3:4 photo)
    imageSelector: '/assets/products/selector_slimsoda.png',         // Seção 06 (Find Your Essential - Routine Selector)
    bottleStyle: {
      primaryColor: '#D96B32',
      secondaryColor: '#F5A623',
      capColor: '#E6E6E6',
      labelBg: '#141210',
      textColor: '#FFFFFF',
    },
    selectorLabel: 'SUPPORT MY METABOLIC ROUTINE',
  },
  {
    id: 'linfaflow',
    number: '02',
    name: 'LinfaFlow',
    category: 'BALANCE',
    tagline: 'A simple addition to your everyday wellness and self-care routine.',
    headline: 'FIND YOUR NATURAL FLOW.',
    copy: 'LinfaFlow brings a simple, thoughtful approach to your everyday wellness and self-care routine.',
    accentColor: '#4B6833',
    bgGradient: 'linear-gradient(135deg, #F2F8F4 0%, #E3EDDC 100%)',
    cardBg: '#F6FFFC',
    accentLight: 'rgba(75, 104, 51, 0.15)',
    transitionTone: 'muted-green',
    link: PRODUCT_LINKS.LinfaFlow,
    // Asset file paths for all 3 section contexts
    imageBottle: '/assets/products/linfaflow-bundle-3.png',            // Seção 04 (Meet The Essentials - 3 Bottles)
    imageHighlight: '/assets/products/highlight_linfaflow.png',       // Seção 05 (Product Highlights - 3:4 photo)
    imageSelector: '/linfaflow/images/gallery-lifestyle.jpg',         // Seção 06 (Find Your Essential - Routine Selector Lifestyle with Person)
    bottleStyle: {
      primaryColor: '#4B6833',
      secondaryColor: '#88B097',
      capColor: '#D8D4CA',
      labelBg: '#0C1410',
      textColor: '#FFFFFF',
    },
    selectorLabel: 'ADD MORE BALANCE TO MY DAY',
  },
  {
    id: 'sonnus',
    number: '03',
    name: 'Sonnus',
    category: 'REST',
    tagline: 'Designed to complement your nighttime wellness routine.',
    headline: 'MAKE SPACE FOR REST.',
    copy: 'Sonnus is designed to complement the moments that help you slow down, reset and prepare for the night.',
    accentColor: '#2C4375',
    bgGradient: 'linear-gradient(135deg, #F0F3F9 0%, #E2E7F2 100%)',
    cardBg: '#F6FFFC',
    accentLight: 'rgba(44, 67, 117, 0.18)',
    transitionTone: 'midnight-navy',
    link: PRODUCT_LINKS.Sonnus,
    // Asset file paths for all 3 section contexts
    imageBottle: '/assets/products/product_sonnus_bottle.png',       // Seção 04 (Meet The Essentials - 3 Bottles)
    imageHighlight: '/assets/products/highlight_sonnus.png',       // Seção 05 (Product Highlights - 3:4 photo)
    imageSelector: '/assets/products/selector_sonnus.png',         // Seção 06 (Find Your Essential - Routine Selector)
    bottleStyle: {
      primaryColor: '#2C4375',
      secondaryColor: '#6882C4',
      capColor: '#1A2338',
      labelBg: '#090E1A',
      textColor: '#FFFFFF',
    },
    selectorLabel: 'CREATE A BETTER NIGHTTIME ROUTINE',
  },
  {
    id: 'crowned',
    number: '04',
    name: 'Crowned',
    category: 'BEAUTY',
    tagline: 'A refined addition to your daily hair care ritual.',
    headline: 'YOUR ROUTINE. YOUR CROWN.',
    copy: 'Crowned brings a refined approach to your everyday hair care ritual.',
    accentColor: '#A05E28',
    bgGradient: 'linear-gradient(135deg, #FAF4EF 0%, #EAE0D6 100%)',
    cardBg: '#F6FFFC',
    accentLight: 'rgba(160, 94, 40, 0.18)',
    transitionTone: 'copper-brown',
    link: PRODUCT_LINKS.Crowned,
    // Asset file paths for all 3 section contexts
    imageBottle: '/assets/products/crowned-bundle-3.png',              // Seção 04 (Meet The Essentials - 3 Bottles)
    imageHighlight: '/assets/products/highlight_crowned.png',       // Seção 05 (Product Highlights - 3:4 photo)
    imageSelector: '/assets/products/selector_crowned.png',         // Seção 06 (Find Your Essential - Routine Selector)
    bottleStyle: {
      primaryColor: '#A05E28',
      secondaryColor: '#D49B6A',
      capColor: '#E5D6C5',
      labelBg: '#120E0C',
      textColor: '#FFFFFF',
    },
    selectorLabel: 'CARE FOR MY HAIR',
  },
];
