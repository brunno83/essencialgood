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
    heroImage: '/assets/products/slimsoda-gallery-1.png',
    
    usps: [
      'Metabolic wellness support',
      'Complements healthy appetite-management habits',
      'Easy-to-mix powdered formula',
      'Simple morning + evening routine',
      'No complicated preparation'
    ],

    gallery: [
      {
        id: 'gallery-1',
        label: 'PRODUCT HERO',
        caption: 'Clean premium packaging',
        subtitle: 'DAILY METABOLIC WELLNESS SUPPORT',
        src: '/assets/products/slimsoda-gallery-1.png'
      },
      {
        id: 'gallery-2',
        label: 'EXPERIENCE',
        caption: 'SlimSoda daily routine',
        subtitle: 'MIX. SIP. KEEP MOVING.',
        src: '/assets/products/slimsoda-gallery-2.png'
      },
      {
        id: 'gallery-3',
        label: 'BENEFITS',
        caption: 'Metabolic & appetite support',
        subtitle: 'EASY-TO-MIX DAILY ROUTINE',
        src: '/assets/products/slimsoda-gallery-3.png'
      },
      {
        id: 'gallery-4',
        label: 'INGREDIENTS',
        caption: 'Focused wellness formula',
        subtitle: 'GINGER, BERBERINE, BAKING SODA & NAD+',
        src: '/assets/products/slimsoda-gallery-4.png'
      },
      {
        id: 'gallery-5',
        label: 'TRUST & GUARANTEE',
        caption: 'Risk-free 90-day trial',
        subtitle: '90-DAY MONEY-BACK GUARANTEE',
        src: '/assets/products/slimsoda-gallery-5.png'
      },
      {
        id: 'gallery-6',
        label: 'QUALITY FORMULA',
        caption: 'Pure plant-based formula',
        subtitle: 'LAB TESTED & MADE IN USA',
        src: '/assets/products/slimsoda-gallery-6.png'
      }
    ],

    bundlesSection: {
      tag: 'CHOOSE YOUR BUNDLE',
      title: 'SAVE MORE WHEN YOU STOCK UP.',
      subtitle: 'Choose the option that works best for your routine.',
      finePrint: 'ONE-TIME PURCHASE • NO AUTO-SHIP • 🔒 SECURE CHECKOUT',
      bundles: [
        {
          id: 'starter',
          name: 'STARTER BUNDLE',
          badge: 'SAVE 50%',
          image: '/assets/products/slimsoda-1.png',
          isPopular: false,
          isBestValue: false,
          bottles: '2 BOTTLES TOTAL',
          deal: 'Buy 1, Get 1 FREE!',
          pricePerBottle: '$34.75',
          totalPrice: '$69.50',
          originalTotal: '$139.00',
          savings: 'Save $69.50',
          perks: ['FREE U.S. SHIPPING', '90-Day Guarantee', 'One-Time Purchase'],
          ctaText: 'CLAIM MY 2 BOTTLES →',
          checkoutUrl: 'https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814'
        },
        {
          id: 'most-popular',
          name: 'MOST POPULAR',
          badge: 'Most Popular Today',
          image: '/assets/products/slimsoda-2.png',
          isPopular: true,
          isBestValue: false,
          bottles: '4 BOTTLES TOTAL',
          deal: 'Buy 2, Get 2 FREE!',
          pricePerBottle: '$27.49',
          totalPrice: '$109.96',
          originalTotal: '$219.92',
          savings: 'Save $109.96',
          bonusText: '✓ Bonus Discount Applied + Priority Processing',
          perks: ['BETTER VALUE', 'FREE U.S. SHIPPING', '90-Day Guarantee', 'Priority Shipping'],
          ctaText: 'CLAIM MY 4 BOTTLES (70% OFF) →',
          checkoutUrl: 'https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814'
        },
        {
          id: 'best-value',
          name: 'BEST VALUE',
          badge: 'OUR BEST OFFER EVER',
          image: '/assets/products/slimsoda-3.png',
          isPopular: false,
          isBestValue: true,
          bottles: '6 BOTTLES TOTAL',
          deal: 'Buy 3, Get 3 FREE!',
          pricePerBottle: '$19.99',
          totalPrice: '$119.94',
          originalTotal: '$329.80',
          savings: 'Save $209.86',
          bonusText: '✓ Maximum Savings + Free Expedited Shipping & Insurance',
          perks: ['LOWEST PRICE PER BOTTLE', 'FREE U.S. SHIPPING', '90-Day Guarantee', 'Expedited Handling'],
          ctaText: 'GET THE BEST VALUE (6 BOTTLES) →',
          checkoutUrl: 'https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814'
        }
      ]
    },

    trustStrip: {
      tag: 'TRUST & QUALITY',
      title: 'CLEAN FORMULA. PROVEN QUALITY.',
      items: [
        {
          title: '100% NATURAL FORMULA',
          desc: 'Pure plant-derived ingredients with zero synthetic fillers or stimulants.'
        },
        {
          title: 'LAB-TESTED & U.S. MADE',
          desc: 'Manufactured in an FDA-registered facility & 3rd-party tested for purity.'
        },
        {
          title: 'FREE 24-HOUR SHIPPING',
          desc: 'Dispatched from U.S. warehouses with real-time tracking.'
        },
        {
          title: '90-DAY RISK-FREE TRIAL',
          desc: 'Try SlimSoda for 90 days with 100% money-back guarantee.'
        }
      ]
    },

    benefitsSection: {
      tag: 'BENEFITS',
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
      tag: 'HOW IT WORKS',
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
      tag: "WHAT'S INSIDE",
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
      tag: 'WHY SLIMSODA?',
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
      tag: 'CUSTOMER REVIEWS',
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
      tag: '90-DAY GUARANTEE',
      title: 'TRY SLIMSODA FOR 90 DAYS.',
      subtitle: 'YOUR ORDER IS PROTECTED.',
      lead: 'We want you to feel confident trying SlimSoda as part of your wellness routine.',
      body: 'Use SlimSoda according to the directions and decide whether it\'s right for you. If you\'re not satisfied, contact our customer support team within the guarantee period according to our refund policy.',
      highlight: '90 DAYS TO DECIDE.',
      ctaText: 'TRY SLIMSODA WITH CONFIDENCE →'
    },

    faqSection: {
      tag: 'FAQ',
      title: 'QUESTIONS? WE\'VE GOT ANSWERS.',
      faqs: [
        {
          q: 'WHAT IS SLIMSODA?',
          a: 'SlimSoda is a powdered dietary supplement featuring selected ingredients designed to complement metabolic and everyday wellness as part of a healthy lifestyle.'
        },
        {
          q: 'HOW DO I USE IT?',
          a: 'Simply follow the serving instructions provided on the product label and mix SlimSoda with water as directed.'
        },
        {
          q: 'DOES SLIMSODA REPLACE DIET AND EXERCISE?',
          a: 'No. SlimSoda is designed to complement — not replace — balanced nutrition, regular physical activity, hydration, adequate sleep and other healthy lifestyle habits.'
        },
        {
          q: 'HOW QUICKLY SHOULD I EXPECT RESULTS?',
          a: 'Individual experiences vary. SlimSoda should be viewed as part of a consistent wellness routine rather than a quick-fix solution. Nutrition, activity, sleep and other individual factors can influence your experience.'
        },
        {
          q: 'CAN I USE SLIMSODA WITH MEDICATION?',
          a: 'If you take prescription medication, have a medical condition, are pregnant or nursing, consult a qualified healthcare professional before adding any new dietary supplement to your routine.'
        },
        {
          q: 'WHAT IF SLIMSODA ISN\'T RIGHT FOR ME?',
          a: 'Eligible purchases are covered by our 90-Day Money-Back Guarantee, subject to the terms of our refund policy.'
        }
      ]
    },

    finalOffer: {
      tag: 'FINAL OFFER',
      title: 'READY TO MAKE YOUR ROUTINE SIMPLER?',
      subtitle: 'Choose the SlimSoda bundle that fits your lifestyle — and save more with larger bundles.'
    },

    disclaimer: `SlimSoda® is a dietary supplement. Individual experiences may vary. SlimSoda is intended to complement a balanced diet and healthy lifestyle and is not a substitute for professional medical advice, diagnosis or treatment. Consult a qualified healthcare professional before using dietary supplements if you are pregnant, nursing, have a medical condition or take prescription medication. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.`
  }
};
