// src/config/pdpData.js
// Centralized configuration for Product Detail Pages (PDP)

export const PDP_DATA = {
  slimsoda: {
    id: 'slimsoda',
    brand: 'SLIMSODA®',
    title: 'MAKE WELLNESS A SIMPLE PART OF YOUR DAY.',
    subtitle: 'A convenient powdered wellness formula with carefully selected ingredients designed to complement your metabolic wellness and everyday healthy habits.',
    rating: 4.7,
    reviewCount: '17,012+',
    startingPrice: '$19.99',
    accentColor: '#D96B32',
    accentLight: 'rgba(217, 107, 50, 0.12)',
    heroImage: '/assets/products/product_slimsoda_bottle.png',
    
    usps: [
      'Metabolic wellness support',
      'Complements healthy appetite-management habits',
      'Easy-to-mix powdered formula',
      'Simple morning + evening routine',
      'No complicated preparation'
    ],

    gallery: [
      {
        id: 'hero',
        label: 'PRODUCT HERO',
        caption: 'Clean premium packaging',
        subtitle: 'DAILY METABOLIC WELLNESS SUPPORT',
        src: '/assets/products/product_slimsoda_bottle.png'
      },
      {
        id: 'experience',
        label: 'EXPERIENCE',
        caption: 'SlimSoda being mixed with water',
        subtitle: 'MIX. SIP. KEEP MOVING.',
        src: '/assets/products/highlight_slimsoda.png'
      },
      {
        id: 'benefits',
        label: 'BENEFITS',
        caption: 'Metabolic & appetite support',
        subtitle: 'EASY-TO-MIX DAILY ROUTINE',
        src: '/assets/products/selector_slimsoda.png'
      },
      {
        id: 'ingredients',
        label: 'INGREDIENTS',
        caption: 'Focused wellness formula',
        subtitle: 'GINGER, BERBERINE, BAKING SODA & NAD+',
        src: '/assets/products/product_slimsoda_bottle.png'
      },
      {
        id: 'trust',
        label: 'TRUST',
        caption: 'Risk-free guarantee',
        subtitle: '90-DAY MONEY-BACK GUARANTEE',
        src: '/assets/products/highlight_slimsoda.png'
      }
    ],

    bundlesSection: {
      tag: '01 — CHOOSE YOUR BUNDLE',
      title: 'SAVE MORE WHEN YOU STOCK UP.',
      subtitle: 'Choose the option that works best for your routine.',
      finePrint: 'ONE-TIME PURCHASE • NO AUTO-SHIP • 🔒 SECURE CHECKOUT',
      bundles: [
        {
          id: 'starter',
          name: 'STARTER',
          badge: null,
          isPopular: false,
          isBestValue: false,
          bottles: '2 BOTTLES TOTAL',
          deal: 'BUY 1 + GET 1 FREE',
          pricePerBottle: '$34.75',
          totalPrice: '$69.50',
          savings: 'Save $69.50',
          perks: ['FREE U.S. SHIPPING', '90-Day Money-Back Guarantee'],
          ctaText: 'START MY ROUTINE →',
          checkoutUrl: 'https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814'
        },
        {
          id: 'most-popular',
          name: 'MOST POPULAR',
          badge: '⭐ MOST POPULAR',
          isPopular: true,
          isBestValue: false,
          bottles: '4 BOTTLES TOTAL',
          deal: 'BUY 2 + GET 2 FREE',
          pricePerBottle: '$27.49',
          totalPrice: '$109.96',
          savings: 'Save $168.04',
          perks: ['BETTER VALUE', 'FREE U.S. SHIPPING', '90-Day Money-Back Guarantee'],
          ctaText: 'CHOOSE MOST POPULAR →',
          checkoutUrl: 'https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814'
        },
        {
          id: 'best-value',
          name: 'BEST VALUE',
          badge: '★ BEST VALUE',
          isPopular: false,
          isBestValue: true,
          bottles: '6 BOTTLES TOTAL',
          deal: 'BUY 3 + GET 3 FREE',
          pricePerBottle: '$19.99',
          totalPrice: '$119.94',
          savings: 'Save $296.06',
          perks: ['LOWEST PRICE PER BOTTLE', 'FREE U.S. SHIPPING', '90-Day Money-Back Guarantee'],
          ctaText: 'GET THE BEST VALUE →',
          checkoutUrl: 'https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814'
        }
      ]
    },

    trustStrip: {
      tag: '02 — TRUST STRIP',
      title: 'SIMPLE WELLNESS. BUILT FOR REAL LIFE.',
      items: [
        {
          title: 'EASY DAILY ROUTINE',
          desc: 'Designed to fit naturally into your day.'
        },
        {
          title: 'SELECTED INGREDIENTS',
          desc: 'A focused wellness formula.'
        },
        {
          title: 'FREE U.S. SHIPPING',
          desc: 'Included with every bundle.'
        },
        {
          title: '90-DAY GUARANTEE',
          desc: 'Try SlimSoda with confidence.'
        }
      ]
    },

    benefitsSection: {
      tag: '03 — BENEFITS',
      title: 'SIMPLE SUPPORT FOR YOUR EVERYDAY WELLNESS ROUTINE.',
      subtitle: 'SlimSoda was designed for people who want to support healthier habits without adding another complicated protocol to their day.',
      benefits: [
        {
          title: 'METABOLIC WELLNESS',
          desc: 'Selected ingredients designed to complement everyday metabolic health as part of a balanced lifestyle.'
        },
        {
          title: 'APPETITE-MANAGEMENT SUPPORT',
          desc: 'Designed to complement mindful eating and healthy nutrition habits.'
        },
        {
          title: 'DIGESTIVE WELLNESS',
          desc: 'Features ingredients commonly associated with digestive and nutritional wellness.'
        },
        {
          title: 'EASY DAILY CONSISTENCY',
          desc: 'A convenient powdered format that is simple to incorporate into your routine.'
        },
        {
          title: 'ACTIVE LIFESTYLE SUPPORT',
          desc: 'Designed to work alongside the fundamentals that matter: balanced nutrition, hydration, movement and rest.'
        }
      ]
    },

    howItWorks: {
      tag: '04 — HOW IT WORKS',
      title: 'ONE SIMPLE ADDITION TO YOUR DAY.',
      subtitle: 'No complicated preparation. No elaborate wellness ritual.',
      steps: [
        {
          step: '01',
          title: 'MIX',
          desc: 'Add SlimSoda to water according to the product directions.'
        },
        {
          step: '02',
          title: 'SIP',
          desc: 'Make it part of your daily wellness routine.'
        },
        {
          step: '03',
          title: 'KEEP MOVING',
          desc: 'Continue focusing on balanced nutrition, hydration, movement and healthy everyday habits.'
        }
      ],
      tagline: 'MIX. SIP. KEEP MOVING.',
      ctaText: 'TRY SLIMSODA →'
    },

    ingredientsSection: {
      tag: "05 — WHAT'S INSIDE",
      title: 'A FOCUSED FORMULA.',
      subtitle: 'SELECTED INGREDIENTS. SIMPLE ROUTINE.',
      description: 'SlimSoda combines selected ingredients in one convenient powdered formula.',
      ingredients: [
        {
          name: 'GINGER EXTRACT',
          desc: 'A familiar botanical with a long history of culinary and traditional wellness use, commonly found in digestive-wellness formulas.'
        },
        {
          name: 'BERBERINE',
          desc: 'A plant-derived compound widely researched in the field of metabolic wellness and commonly included in nutritional supplements.'
        },
        {
          name: 'BAKING SODA',
          desc: "A familiar compound included as part of SlimSoda's powdered formulation."
        },
        {
          name: 'NAD+ SUPPORT',
          desc: "Included as part of the formula's broader approach to cellular and metabolic wellness."
        }
      ]
    },

    comparisonSection: {
      tag: '06 — WHY SLIMSODA?',
      title: 'WELLNESS DOESN\'T NEED TO BE COMPLICATED.',
      tagline: 'LESS COMPLEXITY. MORE CONSISTENCY.',
      headers: ['FEATURES', 'SLIMSODA®', 'COMPLEX ROUTINES'],
      rows: [
        { feature: 'Easy-to-mix format', product: true, opponent: 'Varies' },
        { feature: 'Selected wellness ingredients', product: true, opponent: 'Varies' },
        { feature: 'Simple daily use', product: true, opponent: false },
        { feature: 'No elaborate preparation', product: true, opponent: false },
        { feature: 'Easy to incorporate into your day', product: true, opponent: 'Varies' },
        { feature: '90-Day Guarantee', product: true, opponent: 'Varies' }
      ]
    },

    reviewsSection: {
      tag: '07 — CUSTOMER REVIEWS',
      title: 'MADE FOR REAL-LIFE ROUTINES.',
      ratingText: '★★★★★ 4.7/5 CUSTOMER RATING',
      disclaimer: 'Individual experiences may vary.',
      reviews: [
        {
          quote: '“IT ACTUALLY FITS INTO MY DAY.”',
          body: '“I wanted something simple that wouldn\'t turn my routine upside down. I like that I can mix it quickly and move on with my morning.”',
          author: 'Verified Customer',
          stars: 5
        },
        {
          quote: '“SIMPLE AND CONVENIENT.”',
          body: '“I\'ve been focusing more on my nutrition and daily habits, and SlimSoda fits naturally into that routine.”',
          author: 'Verified Customer',
          stars: 5
        },
        {
          quote: '“EASY TO STAY CONSISTENT WITH.”',
          body: '“The biggest thing for me is convenience. It doesn\'t feel like another complicated program I have to follow.”',
          author: 'Verified Customer',
          stars: 5
        }
      ]
    },

    guaranteeSection: {
      tag: '08 — 90-DAY GUARANTEE',
      title: 'TRY SLIMSODA FOR 90 DAYS.',
      subtitle: 'YOUR ORDER IS PROTECTED.',
      lead: 'We want you to feel confident trying SlimSoda as part of your wellness routine.',
      body: 'Use SlimSoda according to the directions and decide whether it\'s right for you. If you\'re not satisfied, contact our customer support team within the guarantee period according to our refund policy.',
      highlight: '90 DAYS TO DECIDE.',
      ctaText: 'TRY SLIMSODA WITH CONFIDENCE →'
    },

    faqSection: {
      tag: '09 — FAQ',
      title: 'QUESTIONS? WE\'VE GOT ANSWERS.',
      faqs: [
        {
          q: '01. WHAT IS SLIMSODA?',
          a: 'SlimSoda is a powdered dietary supplement featuring selected ingredients designed to complement metabolic and everyday wellness as part of a healthy lifestyle.'
        },
        {
          q: '02. HOW DO I USE IT?',
          a: 'Simply follow the serving instructions provided on the product label and mix SlimSoda with water as directed.'
        },
        {
          q: '03. DOES SLIMSODA REPLACE DIET AND EXERCISE?',
          a: 'No. SlimSoda is designed to complement — not replace — balanced nutrition, regular physical activity, hydration, adequate sleep and other healthy lifestyle habits.'
        },
        {
          q: '04. HOW QUICKLY SHOULD I EXPECT RESULTS?',
          a: 'Individual experiences vary. SlimSoda should be viewed as part of a consistent wellness routine rather than a quick-fix solution. Nutrition, activity, sleep and other individual factors can influence your experience.'
        },
        {
          q: '05. CAN I USE SLIMSODA WITH MEDICATION?',
          a: 'If you take prescription medication, have a medical condition, are pregnant or nursing, consult a qualified healthcare professional before adding any new dietary supplement to your routine.'
        },
        {
          q: '06. WHAT IF SLIMSODA ISN\'T RIGHT FOR ME?',
          a: 'Eligible purchases are covered by our 90-Day Money-Back Guarantee, subject to the terms of our refund policy.'
        }
      ]
    },

    finalOffer: {
      tag: '10 — FINAL OFFER',
      title: 'READY TO MAKE YOUR ROUTINE SIMPLER?',
      subtitle: 'Choose the SlimSoda bundle that fits your lifestyle — and save more with larger bundles.'
    },

    disclaimer: `SlimSoda® is a dietary supplement. Individual experiences may vary. SlimSoda is intended to complement a balanced diet and healthy lifestyle and is not a substitute for professional medical advice, diagnosis or treatment. Consult a qualified healthcare professional before using dietary supplements if you are pregnant, nursing, have a medical condition or take prescription medication. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.`
  }
};
