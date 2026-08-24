// src/config/pdpData.js
// Centralized configuration for Product Detail Pages (PDP)

export const PDP_DATA = {
  slimsoda: {
    id: 'slimsoda',
    brand: 'SLIMSODA®',
    title: 'A SIMPLE DAILY RITUAL FOR METABOLIC WELLNESS.',
    subtitle: 'SlimSoda is an easy-to-mix powdered supplement made with carefully selected ingredients to support metabolic wellness, appetite-management habits and digestive wellness — all in one simple daily routine.',
    rating: 4.7,
    reviewCount: '17,012+',
    startingPrice: '$19.99',
    accentColor: '#D96B32',
    accentLight: 'rgba(217, 107, 50, 0.12)',
    heroImage: '/assets/products/slimsoda-gallery-1.png',
    
    usps: [
      'Supports metabolic wellness',
      'Complements healthy appetite-management habits',
      'Supports digestive wellness',
      'Easy-to-mix powdered formula',
      'Simple morning + evening routine'
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
      tag: 'READY TO GET STARTED?',
      title: 'SAVE MORE WHEN YOU STOCK UP.',
      subtitle: 'Choose the SlimSoda bundle that works best for your routine.',
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
          deal: 'BUY 1, GET 1 FREE',
          pricePerBottle: '$34.75',
          totalPrice: '$69.50',
          originalTotal: '$139.00',
          savings: 'Save $69.50',
          perks: ['Free U.S. Shipping', '90-Day Guarantee', 'One-Time Purchase'],
          ctaText: 'GET MY 2 BOTTLES →',
          checkoutUrl: 'https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814'
        },
        {
          id: 'most-popular',
          name: 'MOST POPULAR',
          badge: 'MOST POPULAR',
          image: '/assets/products/slimsoda-2.png',
          isPopular: true,
          isBestValue: false,
          bottles: '4 BOTTLES TOTAL',
          deal: 'BUY 2, GET 2 FREE',
          pricePerBottle: '$27.49',
          totalPrice: '$109.96',
          originalTotal: '$219.92',
          savings: 'Save $109.96',
          bonusText: '✓ Better Value + Priority Processing',
          perks: ['Better Value', 'Free U.S. Shipping', '90-Day Guarantee', 'Priority Processing'],
          ctaText: 'GET MY 4 BOTTLES →',
          checkoutUrl: 'https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814'
        },
        {
          id: 'best-value',
          name: 'BEST VALUE',
          badge: 'BEST VALUE',
          image: '/assets/products/slimsoda-3.png',
          isPopular: false,
          isBestValue: true,
          bottles: '6 BOTTLES TOTAL',
          deal: 'BUY 3, GET 3 FREE',
          pricePerBottle: '$19.99',
          totalPrice: '$119.94',
          originalTotal: '$329.80',
          savings: 'Save $209.86',
          bonusText: '✓ Lowest Price Per Bottle + Expedited Handling',
          perks: ['Lowest Price Per Bottle', 'Free U.S. Shipping', '90-Day Guarantee', 'Expedited Handling'],
          ctaText: 'GET THE BEST VALUE →',
          checkoutUrl: 'https://cc.slimsodapowder.com/v2/checkout.php?&hid=b2lkPW9mZl81MDU4NzI1JmFpZD1hZmYxOTgyODE0JnVpZD1ibF8zOTkwNjcy&affid=aff1982814'
        }
      ]
    },

    trustStrip: {
      tag: 'TRUST & QUALITY',
      title: 'CLEAN FORMULA. PROVEN QUALITY.',
      items: [
        {
          title: 'THOUGHTFULLY FORMULATED',
          desc: 'Carefully selected ingredients combined in one convenient powdered formula.'
        },
        {
          title: 'THIRD-PARTY TESTED',
          desc: 'Quality tested by an independent third-party laboratory.'
        },
        {
          title: 'U.S. MADE',
          desc: 'Manufactured in the United States in a registered facility.'
        },
        {
          title: 'FREE U.S. SHIPPING',
          desc: 'Fast shipping from our U.S. fulfillment network.'
        },
        {
          title: '90-DAY GUARANTEE',
          desc: 'Try SlimSoda for 90 days and decide if it fits your routine.'
        }
      ]
    },

    benefitsSection: {
      tag: 'BENEFITS',
      title: 'SIMPLE SUPPORT FOR THE HEALTHY HABITS THAT MATTER.',
      subtitle: 'SlimSoda brings selected wellness ingredients together in one convenient powdered formula designed to complement a balanced lifestyle.',
      highlightText: 'ONE FORMULA. MULTIPLE WELLNESS GOALS. ONE SIMPLE ROUTINE.',
      ctaText: 'MAKE SLIMSODA PART OF MY DAY →',
      benefits: [
        {
          title: 'METABOLIC WELLNESS',
          desc: 'Selected ingredients designed to support everyday metabolic wellness as part of a balanced lifestyle.'
        },
        {
          title: 'APPETITE-MANAGEMENT SUPPORT',
          desc: 'Designed to complement mindful eating and healthy nutrition habits.'
        },
        {
          title: 'DIGESTIVE WELLNESS',
          desc: 'Features selected ingredients commonly used as part of digestive and nutritional wellness routines.'
        },
        {
          title: 'SIMPLE DAILY CONSISTENCY',
          desc: 'An easy-to-mix powdered format designed to make daily supplementation simpler.'
        },
        {
          title: 'ACTIVE LIFESTYLE SUPPORT',
          desc: 'Made to work alongside the fundamentals that matter: balanced nutrition, hydration, movement and rest.'
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
          desc: 'Keep focusing on balanced nutrition, hydration, movement, rest and healthy everyday habits.'
        }
      ],
      tagline: 'MIX. SIP. KEEP MOVING.',
      ctaText: 'TRY SLIMSODA →'
    },

    ingredientsSection: {
      tag: "WHAT'S INSIDE",
      title: 'A FOCUSED FORMULA. NO COMPLICATED ROUTINE.',
      subtitle: 'SlimSoda brings selected ingredients together in one convenient powdered formula.',
      description: 'SlimSoda brings selected ingredients together in one convenient powdered formula.',
      highlightText: 'SELECTED INGREDIENTS. PURPOSEFUL FORMULATION. SIMPLE DAILY USE.',
      ctaText: 'TRY SLIMSODA →',
      ingredients: [
        {
          name: 'GINGER EXTRACT',
          desc: 'A familiar botanical traditionally used in food and wellness routines and commonly included in digestive-support formulations.',
          whyItsHere: 'To complement SlimSoda\'s digestive wellness approach.'
        },
        {
          name: 'BERBERINE',
          desc: 'A plant-derived compound that has been widely studied in nutritional and metabolic wellness research.',
          whyItsHere: 'Included as part of SlimSoda\'s broader metabolic wellness formulation.'
        },
        {
          name: 'BAKING SODA',
          desc: 'A familiar compound included as part of SlimSoda\'s powdered formulation.',
          whyItsHere: 'Part of the formula designed around a simple, mix-with-water format.'
        },
        {
          name: 'NAD+ SUPPORT',
          desc: 'Included as part of SlimSoda\'s broader approach to cellular and metabolic wellness.',
          whyItsHere: 'To complement the formula\'s overall wellness positioning.'
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
        { feature: 'No multiple supplement bottles', product: true, opponent: 'Varies' },
        { feature: 'Easy to incorporate into your day', product: true, opponent: 'Varies' },
        { feature: '90-Day Guarantee', product: true, opponent: 'Varies' }
      ]
    },

    reviewsSection: {
      tag: 'CUSTOMER REVIEWS',
      title: 'MADE FOR REAL-LIFE ROUTINES.',
      ratingText: '★★★★★ 4.7/5 Customer Rating',
      headline: 'WHAT CUSTOMERS ARE SAYING',
      disclaimer: 'Prioritize authentic reviews around ease of use, taste, convenience, mixing, daily routine, consistency and overall product experience.',
      reviews: [
        {
          quote: '“IT BECOME ONE OF THE EASIEST PARTS OF MY MORNING.”',
          body: '“I love how simple it is to mix and how naturally it fits into my day.”',
          author: 'Emily R. — Verified Buyer',
          stars: 5
        },
        {
          quote: '“FINALLY, SOMETHING I CAN STAY CONSISTENT WITH.”',
          body: '“I wanted a wellness routine that didn\'t involve several different bottles and schedules. SlimSoda makes it simple.”',
          author: 'Jessica T. — Verified Buyer',
          stars: 5
        },
        {
          quote: '“SIMPLE, CONVENIENT AND EASY TO REMEMBER.”',
          body: '“Two scoops with water and I\'m done. That\'s exactly what I wanted from a daily supplement.”',
          author: 'Karen M. — Verified Buyer',
          stars: 5
        },
        {
          quote: '“IT FITS NATURALLY INTO MY ROUTINE.”',
          body: '“No complicated preparation. I mix it with water and get on with my day.”',
          author: 'Sarah H. — Verified Buyer',
          stars: 5
        }
      ]
    },

    guaranteeSection: {
      tag: '90-DAY MONEY-BACK GUARANTEE',
      title: 'TRY SLIMSODA FOR 90 DAYS.',
      subtitle: 'YOUR ORDER IS PROTECTED.',
      lead: 'Trying a new wellness routine shouldn\'t feel like a big commitment.',
      body: 'Use SlimSoda according to the directions and give yourself time to decide whether it fits your routine. If you\'re not satisfied, contact our customer support team within the guarantee period according to our refund policy.',
      highlight: '90 DAYS TO DECIDE.',
      ctaText: 'TRY SLIMSODA WITH CONFIDENCE →',
      microcopy: '90-Day Guarantee • Secure Checkout • Free U.S. Shipping'
    },

    faqSection: {
      tag: 'FAQ',
      title: 'QUESTIONS? WE\'VE GOT ANSWERS.',
      faqs: [
        {
          q: 'WHAT IS SLIMSODA?',
          a: 'SlimSoda is an easy-to-mix powdered dietary supplement featuring selected ingredients designed to complement metabolic, digestive and everyday wellness as part of a healthy lifestyle.'
        },
        {
          q: 'HOW DO I USE SLIMSODA?',
          a: 'Mix SlimSoda with water according to the directions on the product label. It\'s designed to fit easily into your daily routine without complicated preparation.'
        },
        {
          q: 'WHAT MAKES SLIMSODA DIFFERENT?',
          a: 'SlimSoda was created around simplicity. Instead of building another complicated supplement routine, it brings selected ingredients together in one convenient powdered format that\'s easy to incorporate into your day.'
        },
        {
          q: 'DOES SLIMSODA REPLACE DIET AND EXERCISE?',
          a: 'No. SlimSoda is designed to complement — not replace — healthy lifestyle fundamentals such as balanced nutrition, hydration, regular movement and adequate rest.'
        },
        {
          q: 'HOW QUICKLY SHOULD I EXPECT RESULTS?',
          a: 'Individual experiences vary. SlimSoda is designed for consistent use as part of an overall healthy lifestyle rather than as a quick-fix solution.'
        },
        {
          q: 'CAN I USE SLIMSODA WITH MEDICATION?',
          a: 'If you take prescription medication, have a medical condition, are pregnant or nursing, consult a qualified healthcare professional before using SlimSoda or any dietary supplement.'
        },
        {
          q: 'WHAT IF SLIMSODA ISN\'T RIGHT FOR ME?',
          a: 'Your purchase is protected by our 90-Day Money-Back Guarantee. If you\'re not satisfied, contact our customer support team within the guarantee period according to our refund policy.'
        }
      ]
    },

    finalOffer: {
      tag: 'READY TO GET STARTED?',
      title: 'SAVE MORE WHEN YOU STOCK UP.',
      subtitle: 'Choose the SlimSoda bundle that works best for your routine.'
    },

    disclaimer: `SlimSoda® is a dietary supplement intended to complement a balanced diet and healthy lifestyle. Individual experiences may vary. Consult a qualified healthcare professional before using dietary supplements if you are pregnant, nursing, taking medication or have a medical condition. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.`
  }
};
