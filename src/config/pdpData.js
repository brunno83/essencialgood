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
    accentColor: '#27AE60',
    accentLight: 'rgba(39, 174, 96, 0.12)',
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

    whyBlock: {
      tag: 'WHY SLIMSODA?',
      title: "YOUR WELLNESS ROUTINE SHOULDN'T FEEL LIKE A FULL-TIME JOB.",
      lead: "Healthy habits work best when they're simple enough to maintain.",
      p1: "But wellness routines can quickly become complicated — multiple bottles, different schedules and too many steps to remember.",
      boxTag: 'SLIMSODA WAS CREATED AROUND A SIMPLER IDEA:',
      boxTitle: 'SELECTED INGREDIENTS. ONE POWDERED FORMULA. ONE EASY ROUTINE.',
      p2: 'Mix it with water. Make it part of your day. Keep focusing on the fundamentals that matter: balanced nutrition, hydration, movement and consistency.',
      tagline: 'LESS COMPLEXITY. MORE CONSISTENCY.',
      ctaText: 'TRY SLIMSODA →',
      image: '/assets/products/slimsoda-lifestyle-routine.jpg'
    },

    whyChoose: {
      tag: 'WHY PEOPLE CHOOSE SLIMSODA',
      title: 'BUILT AROUND WHAT MAKES A ROUTINE',
      titleHighlight: 'EASIER TO KEEP.',
      subtitle: 'Instead of adding more complexity to your day, SlimSoda brings selected ingredients together in one convenient powdered format.',
      tagline: 'SIMPLE TO START. EASY TO KEEP GOING.',
      ctaText: 'CHOOSE MY BUNDLE →',
      image: '/assets/products/slimsoda-stone-pedestal.jpg',
      features: [
        {
          icon: 'Droplets',
          title: 'EASY TO MIX',
          desc: 'Simply add SlimSoda to water according to product directions.'
        },
        {
          icon: 'Leaf',
          title: 'ONE POWDERED FORMULA',
          desc: 'A convenient alternative to managing multiple supplement bottles.'
        },
        {
          icon: 'Sun',
          title: 'EASY TO BUILD INTO YOUR DAY',
          desc: 'Designed to fit naturally into a morning and evening routine.'
        },
        {
          icon: 'ShieldCheck',
          title: '90-DAY GUARANTEE',
          desc: 'Plenty of time to decide whether SlimSoda is right for your routine.'
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
          quote: '“EASY TO STAY CONSISTENT WITH”',
          body: '“I wanted something simple enough to fit into my routine. SlimSoda is easy to mix with water and has become a convenient part of my day.”',
          author: 'Kendra P. — Verified Buyer',
          stars: 5
        },
        {
          quote: '“FITS NATURALLY INTO MY MORNING”',
          body: '“I like how easy it is to prepare. I mix it with water as part of my morning routine, and it doesn\'t add another complicated step to my day.”',
          author: 'Riley T. — Verified Buyer',
          stars: 5
        },
        {
          quote: '“SIMPLE AND CONVENIENT”',
          body: '“It mixes quickly with cold water and fits easily into my morning. I especially like that the routine is simple and doesn\'t require several different products.”',
          author: 'Aubrey D. — Verified Buyer',
          stars: 5
        },
        {
          quote: '“EASY TO MAKE PART OF MY DAY”',
          body: '“Three weeks in and the biggest thing for me is how easy it has been to stay consistent. I mix it with water and continue with my day. Simple routines are easier for me to maintain.”',
          author: 'Lesley S. — Verified Buyer',
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
  },

  linfaflow: {
    id: 'linfaflow',
    brand: 'LINFAFLOW®',
    title: 'SUPPORT THE FLOW YOUR BODY ALREADY KNOWS.',
    subtitle: 'A concentrated liquid botanical formula built around lymphatic wellness, normal fluid balance and healthy circulation — with four traditional botanicals in one simple daily dropper.',
    rating: 4.8,
    reviewCount: '14,890+',
    startingPrice: '$19.99',
    accentColor: '#27AE60',
    accentLight: 'rgba(39, 174, 96, 0.12)',
    heroImage: '/linfaflow/images/gallery-hero-cover.jpg',
    
    usps: [
      'Supports healthy lymphatic function',
      'Complements the body\'s normal fluid-balance processes',
      'Supports healthy circulation',
      '4 traditional botanical extracts',
      'No caffeine or stimulants',
      'Convenient liquid dropper format'
    ],

    gallery: [
      {
        id: 'gallery-1',
        label: 'PRODUCT HERO',
        caption: 'Support your daily flow with LinfaFlow',
        subtitle: 'A SIMPLE LIQUID BOTANICAL ADDITION TO YOUR ROUTINE',
        src: '/linfaflow/images/gallery-hero-cover.jpg'
      },
      {
        id: 'gallery-2',
        label: 'DAILY FLOW',
        caption: 'Support your daily flow',
        subtitle: 'A SIMPLE LIQUID ADDITION TO YOUR ROUTINE',
        src: '/linfaflow/images/gallery-hero.jpg'
      },
      {
        id: 'gallery-3',
        label: 'SIMPLE ROUTINE',
        caption: 'One dropper. One simple routine.',
        subtitle: 'SIMPLE DAILY WELLNESS, MADE EASY',
        src: '/linfaflow/images/gallery-routine.jpg'
      },
      {
        id: 'gallery-4',
        label: 'LIFESTYLE',
        caption: 'LinfaFlow at-home wellness routine',
        subtitle: 'DROP. HYDRATE. MOVE. REPEAT.',
        src: '/linfaflow/images/gallery-lifestyle.jpg'
      },
      {
        id: 'gallery-5',
        label: 'FORMULA',
        caption: 'Four botanicals. One daily formula.',
        subtitle: 'CLEAVERS, NETTLE, DANDELION & BURDOCK',
        src: '/linfaflow/images/gallery-botanicals.jpg'
      }
    ],

    bundlesSection: {
      tag: 'READY TO MAKE IT SIMPLE?',
      title: 'THE LONGER YOUR ROUTINE, THE BETTER YOUR VALUE.',
      subtitle: 'LinfaFlow is designed for consistent daily use. Choose the bundle that gives you the right amount of time — while saving more per bottle.',
      finePrint: 'ONE-TIME PURCHASE • NO AUTO-SHIP • 🔒 SECURE CHECKOUT',
      bundles: [
        {
          id: 'starter',
          name: 'STARTER ROUTINE',
          badge: 'SAVE 50%',
          image: '/linfaflow/images/bundle-1.png',
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
          checkoutUrl: 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814'
        },
        {
          id: 'most-popular',
          name: 'MOST POPULAR',
          badge: 'MOST POPULAR',
          image: '/linfaflow/images/bundle-2.png',
          isPopular: true,
          isBestValue: false,
          bottles: '4 BOTTLES TOTAL',
          deal: 'BUY 2, GET 2 FREE',
          pricePerBottle: '$27.49',
          totalPrice: '$109.96',
          originalTotal: '$219.92',
          savings: 'Save $109.96',
          bonusText: '✓ Better Price Per Bottle + Priority Processing',
          perks: ['Better Price Per Bottle', 'Free U.S. Shipping', '90-Day Guarantee', 'Priority Processing'],
          ctaText: 'GET MY 4 BOTTLES →',
          checkoutUrl: 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814'
        },
        {
          id: 'best-value',
          name: 'BEST VALUE',
          badge: 'BEST VALUE',
          image: '/linfaflow/images/bundle-3.png',
          isPopular: false,
          isBestValue: true,
          bottles: '6 BOTTLES TOTAL',
          deal: 'BUY 3, GET 3 FREE',
          pricePerBottle: '$19.99',
          totalPrice: '$119.94',
          originalTotal: '$329.80',
          savings: 'Save $209.86',
          bonusText: '✓ Lowest Price Per Bottle + Best Long-Term Value',
          perks: ['Lowest Price Per Bottle', 'Free U.S. Shipping', '90-Day Guarantee', 'Best Long-Term Value'],
          ctaText: 'GET THE BEST VALUE →',
          checkoutUrl: 'https://cc.linfaflow.com/dtcnew/checkout.php?hid=b2lkPW9mZl8wMDQyMzQ2JmFpZD1hZmYxOTgyODE0JnVpZD1ibF82NjY4MTEx&affid=aff1982814'
        }
      ]
    },

    trustStrip: {
      tag: 'TRUST & QUALITY',
      title: 'FOUR BOTANICALS. PROVEN QUALITY.',
      items: [
        {
          title: '4 TRADITIONAL BOTANICALS',
          desc: 'Cleavers, Stillingia Root, Red Clover Blossom & Prickly Ash Bark.'
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
          desc: 'Try LinfaFlow for 90 days and decide if it fits your routine.'
        }
      ]
    },

    whyBlock: {
      tag: 'WHY LINFAFLOW?',
      title: 'YOUR BODY ALREADY HAS A FLOW SYSTEM.',
      subtitle: 'LINFAFLOW WAS DESIGNED TO SUPPORT IT — NOT OVERRIDE IT.',
      lead: 'The lymphatic system is part of the body\'s natural network for moving fluid through tissues and back toward circulation.',
      p1: 'Unlike your cardiovascular system, it does not rely on one central pump. Normal lymphatic movement is influenced by everyday factors such as physical movement, muscle contraction and breathing.',
      boxTag: 'LINFAFLOW WAS CREATED AROUND A SIMPLER IDEA:',
      boxTitle: 'FOUR TRADITIONAL BOTANICALS. ONE LIQUID DROPPER. ONE EASY ROUTINE.',
      p2: 'Instead of a harsh "flush" or dramatic overnight cleanse, LinfaFlow combines four traditional botanicals into a simple liquid formula designed to complement healthy everyday habits.',
      tagline: 'SUPPORT THE PROCESS. KEEP THE ROUTINE SIMPLE.',
      ctaText: 'MAKE LINFAFLOW PART OF MY DAY →',
      image: '/linfaflow/images/why-linfaflow.jpg'
    },

    whyChoose: {
      tag: 'WHY PEOPLE CHOOSE LINFAFLOW',
      title: 'BUILT AROUND WHAT MAKES A ROUTINE',
      titleHighlight: 'EASIER TO KEEP.',
      subtitle: 'Instead of adding more complexity to your day, LinfaFlow brings four traditional botanicals together in one convenient liquid dropper format.',
      tagline: 'SIMPLE TO START. EASY TO KEEP GOING.',
      ctaText: 'CHOOSE MY BUNDLE →',
      image: '/linfaflow/images/why-choose-linfaflow.jpg',
      features: [
        {
          icon: 'Droplets',
          title: 'EASY LIQUID DROPPER',
          desc: 'Simply add LinfaFlow drops according to product directions.'
        },
        {
          icon: 'Leaf',
          title: '4 TRADITIONAL BOTANICALS',
          desc: 'A focused alternative to managing multiple supplement bottles.'
        },
        {
          icon: 'Sun',
          title: 'EASY TO BUILD INTO YOUR DAY',
          desc: 'Designed to fit naturally alongside daily hydration and movement.'
        },
        {
          icon: 'ShieldCheck',
          title: '90-DAY GUARANTEE',
          desc: 'Plenty of time to decide whether LinfaFlow is right for your routine.'
        }
      ]
    },

    benefitsSection: {
      tag: 'BENEFITS',
      title: 'DAILY WELLNESS SUPPORT BUILT AROUND FLOW.',
      subtitle: 'LinfaFlow brings together four traditional botanicals in one convenient formula designed around three complementary wellness goals.',
      highlightText: 'FOUR BOTANICALS. THREE COMPLEMENTARY WELLNESS GOALS. ONE SIMPLE ROUTINE.',
      ctaText: 'TRY LINFAFLOW →',
      image: '/linfaflow/images/03-reason-2.jpg',
      benefits: [
        {
          title: 'LYMPHATIC WELLNESS',
          desc: 'A botanical formula designed to support healthy lymphatic function as part of an active, balanced lifestyle.'
        },
        {
          title: 'NORMAL FLUID BALANCE',
          desc: 'Designed to complement the body\'s natural processes involved in maintaining normal fluid balance.'
        },
        {
          title: 'HEALTHY CIRCULATION',
          desc: 'Features botanicals with a history of traditional use in formulations associated with circulatory wellness.'
        },
        {
          title: 'BOTANICAL SUPPORT',
          desc: 'Four plant extracts selected around one focused wellness concept instead of an unnecessarily complicated ingredient stack.'
        },
        {
          title: 'EASY DAILY CONSISTENCY',
          desc: 'A convenient liquid dropper that takes seconds to incorporate into your routine.'
        }
      ]
    },

    howItWorks: {
      tag: 'HOW IT WORKS',
      title: 'THIRTY SECONDS CAN BE ENOUGH TO START A BETTER ROUTINE.',
      subtitle: 'The best wellness routine is usually the one you can actually maintain.',
      image: '/linfaflow/images/03-reason-4.jpg',
      steps: [
        {
          step: '01',
          title: 'DROP',
          desc: 'Take LinfaFlow according to the serving directions on the product label.'
        },
        {
          step: '02',
          title: 'HYDRATE',
          desc: 'Make adequate hydration part of your everyday wellness routine.'
        },
        {
          step: '03',
          title: 'MOVE',
          desc: 'Walking and regular movement naturally support circulation and normal lymphatic movement.'
        },
        {
          step: '04',
          title: 'REPEAT',
          desc: 'Consistency matters more than creating an elaborate routine you will eventually abandon.'
        }
      ],
      tagline: 'DROP. HYDRATE. MOVE. REPEAT.',
      ctaText: 'START MY LINFAFLOW ROUTINE →'
    },

    ingredientsSection: {
      tag: "WHAT'S INSIDE",
      title: 'FOUR TRADITIONAL BOTANICALS. EACH WITH A REASON TO BE HERE.',
      subtitle: 'LinfaFlow combines four botanicals with a long history of use in traditional Western herbal practices.',
      description: 'LinfaFlow brings selected traditional plant extracts together in one concentrated liquid formula.',
      highlightText: 'FOUR NAMED BOTANICALS. NOTHING MYSTERIOUS.',
      ctaText: 'VIEW SUPPLEMENT FACTS →',
      image: '/linfaflow/images/03-reason-3.jpg',
      ingredients: [
        {
          name: 'CLEAVERS (Galium aparine)',
          desc: 'Perhaps the botanical most closely associated with traditional lymphatic wellness in this formula. Cleavers has appeared for generations in Western herbal preparations and has traditionally been used in formulations centered around normal fluid movement.',
          whyItsHere: 'To anchor LinfaFlow\'s lymphatic-wellness approach.'
        },
        {
          name: 'STILLINGIA ROOT (Stillingia sylvatica)',
          desc: 'Also known as Queen\'s Root, Stillingia has a documented history in traditional North American botanical practice, historically included in formulas built around fluid-balance and lymphatic wellness.',
          whyItsHere: 'To complement the formula\'s traditional botanical profile.'
        },
        {
          name: 'RED CLOVER BLOSSOM (Trifolium pratense)',
          desc: 'One of the more familiar botanicals in Western herbal traditions. Its blossom contains naturally occurring plant compounds and has historically been included in general-wellness preparations.',
          whyItsHere: 'To broaden the botanical profile of the formula while complementing its overall wellness focus.'
        },
        {
          name: 'PRICKLY ASH BARK (Zanthoxylum)',
          desc: 'A North American botanical traditionally described by herbalists as "warming", with a history of use in botanical practices associated with circulation and internal movement.',
          whyItsHere: 'To complement LinfaFlow\'s healthy-circulation positioning.'
        }
      ]
    },

    comparisonSection: {
      tag: 'WHY KEEP IT SIMPLE?',
      title: 'ONE FOCUSED ROUTINE VS. ANOTHER CABINET FULL OF PRODUCTS.',
      tagline: 'FEWER STEPS. MORE CONSISTENCY.',
      image: '/linfaflow/images/pb-flow-compare.webp',
      headers: ['FEATURES', 'LINFAFLOW®', 'COMPLEX ROUTINES'],
      rows: [
        { feature: 'Four named botanicals', product: true, opponent: 'Varies' },
        { feature: 'One liquid formula', product: true, opponent: 'Varies' },
        { feature: 'No large pills', product: true, opponent: false },
        { feature: 'No caffeine', product: true, opponent: 'Varies' },
        { feature: 'No stimulants', product: true, opponent: 'Varies' },
        { feature: 'Takes seconds to use', product: true, opponent: 'Varies' },
        { feature: 'Easy to understand', product: true, opponent: 'Varies' },
        { feature: '90-Day Guarantee', product: true, opponent: 'Varies' }
      ]
    },

    reviewsSection: {
      tag: 'CUSTOMER REVIEWS',
      title: 'SIMPLE ENOUGH TO ACTUALLY USE.',
      ratingText: '★★★★★ 4.8/5 Customer Rating',
      headline: 'WHAT CUSTOMERS ARE SAYING',
      disclaimer: 'Based on authentic verified customer feedback. Individual experiences may vary.',
      reviews: [
        {
          quote: '“IT\'S BECOME PART OF MY MORNING.”',
          body: '“The dropper format is what I like most. It takes almost no time and I don\'t have another handful of pills to remember.”',
          author: 'Vanessa C. — Verified Customer',
          stars: 5
        },
        {
          quote: '“FINALLY, A FORMULA I CAN UNDERSTAND.”',
          body: '“I liked seeing four clearly named botanicals instead of a huge proprietary-looking ingredient list. It\'s straightforward and easy to use.”',
          author: 'Derek N. — Verified Customer',
          stars: 5
        },
        {
          quote: '“IT FITS MY ROUTINE.”',
          body: '“I\'ve been paying more attention to hydration, walking and my overall wellness routine, and LinfaFlow is easy to incorporate alongside those habits.”',
          author: 'Megan F. — Verified Customer',
          stars: 5
        },
        {
          quote: '“SIMPLE IS BETTER FOR ME.”',
          body: '“I\'ve tried routines with several bottles before and never stayed consistent. The liquid format makes this much easier.”',
          author: 'Brooke H. — Verified Customer',
          stars: 5
        }
      ]
    },

    guaranteeSection: {
      tag: '90-DAY MONEY-BACK GUARANTEE',
      title: 'GIVE THE ROUTINE TIME.',
      subtitle: 'KEEP THE DECISION IN YOUR HANDS.',
      lead: 'Trying a new botanical supplement should not feel like a gamble.',
      body: 'Use LinfaFlow according to the product directions. Make it part of your routine. Then decide whether it\'s right for you. If you\'re not satisfied, contact our customer support team within the guarantee period according to the terms of the refund policy.',
      highlight: '90 DAYS TO DECIDE.',
      ctaText: 'TRY LINFAFLOW WITH CONFIDENCE →',
      microcopy: '90-Day Guarantee • Free U.S. Shipping • One-Time Purchase'
    },

    faqSection: {
      tag: 'FAQ',
      title: 'QUESTIONS? WE\'VE GOT ANSWERS.',
      faqs: [
        {
          q: 'WHAT EXACTLY IS LINFAFLOW?',
          a: 'LinfaFlow is a liquid dietary supplement containing four botanical extracts — Cleavers, Stillingia Root, Red Clover Blossom and Prickly Ash Bark — formulated to complement lymphatic wellness, normal fluid balance and healthy circulation as part of a balanced lifestyle.'
        },
        {
          q: 'WHAT MAKES LINFAFLOW DIFFERENT?',
          a: 'Simplicity. Instead of building an oversized botanical stack, LinfaFlow focuses on four clearly identified plant extracts in one convenient liquid formula. No caffeine, no stimulants, no giant handful of capsules.'
        },
        {
          q: 'IS LINFAFLOW A CLEANSE?',
          a: 'No. LinfaFlow is positioned as a daily botanical wellness supplement, not as a harsh cleanse or quick "flush".'
        },
        {
          q: 'IS LINFAFLOW A DIURETIC?',
          a: 'LinfaFlow is a dietary supplement, not a prescription or OTC diuretic drug. Persistent, sudden, unexplained or one-sided swelling can have medical causes and should be evaluated by a qualified healthcare professional.'
        },
        {
          q: 'HOW DO I USE LINFAFLOW?',
          a: 'Follow the serving directions printed on your LinfaFlow label. Its liquid dropper format is designed to make daily use simple and convenient.'
        },
        {
          q: 'DO I NEED TO CHANGE MY ENTIRE ROUTINE?',
          a: 'No. LinfaFlow is designed to complement basic healthy habits such as hydration, regular movement, balanced nutrition and adequate rest.'
        },
        {
          q: 'HOW QUICKLY SHOULD I EXPECT TO NOTICE SOMETHING?',
          a: 'Individual experiences vary. LinfaFlow is designed as a consistent botanical wellness routine rather than a quick-fix product.'
        },
        {
          q: 'CAN I USE LINFAFLOW WITH MEDICATION?',
          a: 'If you take prescription medications, have a medical condition, are pregnant or nursing, consult a qualified healthcare professional before using LinfaFlow.'
        },
        {
          q: 'IS IT CAFFEINE-FREE?',
          a: 'Yes. LinfaFlow contains no caffeine or stimulant-based ingredients.'
        },
        {
          q: 'WHAT IF LINFAFLOW ISN\'T RIGHT FOR ME?',
          a: 'Eligible purchases are protected by our 90-Day Money-Back Guarantee, subject to our refund policy terms.'
        }
      ]
    },

    finalOffer: {
      tag: 'READY TO MAKE IT SIMPLE?',
      title: 'SUPPORT YOUR NATURAL FLOW.',
      subtitle: 'WITHOUT OVERCOMPLICATING YOUR ROUTINE.',
      ctaText: 'CHOOSE MY LINFAFLOW BUNDLE →'
    },

    disclaimer: `LinfaFlow® is a dietary supplement intended to complement a balanced lifestyle. Individual experiences may vary. Persistent, sudden, unexplained or one-sided swelling or fluid retention may have medical causes and should be evaluated by a qualified healthcare professional. Consult a healthcare professional before using dietary supplements if you are pregnant, nursing, taking medication or have a medical condition. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.`
  },

  sonnus: {
    id: 'sonnus',
    brand: 'SONNUS®',
    title: 'YOUR NIGHT DESERVES MORE THAN JUST MORE MELATONIN.',
    subtitle: 'A complete 10-ingredient nighttime gummy built around relaxation, healthy sleep support and a calmer transition into bedtime — with just 0.9 mg of melatonin as one part of the formula.',
    rating: 4.8,
    reviewCount: '9,480+',
    startingPrice: '$19.99',
    accentColor: '#27AE60',
    accentLight: 'rgba(39, 174, 96, 0.12)',
    heroImage: '/sonnus/images/gallery-1.png',
    
    usps: [
      'Supports nighttime relaxation',
      'Helps support restful sleep',
      'Supports a calm transition into bedtime',
      '10 sleep-support ingredients',
      'Only 0.9 mg of melatonin',
      'Wild Berry gummy format',
      'No caffeine or stimulants'
    ],

    gallery: [
      { id: 'g1', label: 'PRODUCT HERO', src: '/sonnus/images/gallery-1.png' },
      { id: 'g2', label: 'RITUAL', src: '/sonnus/images/gallery-2.png' },
      { id: 'g3', label: 'BENEFITS', src: '/sonnus/images/gallery-3.png' },
      { id: 'g4', label: 'FORMULA', src: '/sonnus/images/gallery-4.png' },
      { id: 'g5', label: 'GUARANTEE', src: '/sonnus/images/gallery-5.png' }
    ],

    bundlesSection: {
      tag: 'CHOOSE YOUR NIGHTLY ROUTINE',
      title: 'SAVE MORE WHEN YOU STOCK UP ON SONNUS®',
      subtitle: 'Sonnus is designed for consistent nightly use. Choose the bundle that gives you more nights — at a lower cost per bottle.',
      finePrint: 'ONE-TIME PURCHASE • NO AUTO-SHIP • 🔒 SECURE CHECKOUT',
      bundles: [
        {
          id: 'starter',
          name: 'STARTER ROUTINE',
          badge: 'SAVE 50%',
          image: '/sonnus/images/bundle-1.png',
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
          checkoutUrl: 'https://cc.usesonnus.com/checkout.php?hid=b2lkPW9mZl80MjQwNDIwJmFpZD1hZmYxOTgyODE0JnVpZD1ibF85MDY2ODgw&affid=aff1982814'
        },
        {
          id: 'most-popular',
          name: 'MOST POPULAR',
          badge: 'MOST POPULAR',
          image: '/sonnus/images/bundle-2.png',
          isPopular: true,
          isBestValue: false,
          bottles: '4 BOTTLES TOTAL',
          deal: 'BUY 2, GET 2 FREE',
          pricePerBottle: '$27.49',
          totalPrice: '$109.96',
          originalTotal: '$219.92',
          savings: 'Save $109.96',
          bonusText: '✓ Better Price Per Bottle + Priority Processing',
          perks: ['Better Price Per Bottle', 'Free U.S. Shipping', '90-Day Guarantee', 'Priority Processing'],
          ctaText: 'GET MY 4 BOTTLES →',
          checkoutUrl: 'https://cc.usesonnus.com/checkout.php?hid=b2lkPW9mZl80MjQwNDIwJmFpZD1hZmYxOTgyODE0JnVpZD1ibF85MDY2ODgw&affid=aff1982814'
        },
        {
          id: 'best-value',
          name: 'BEST VALUE',
          badge: 'BEST VALUE',
          image: '/sonnus/images/bundle-3.png',
          isPopular: false,
          isBestValue: true,
          bottles: '6 BOTTLES TOTAL',
          deal: 'BUY 3, GET 3 FREE',
          pricePerBottle: '$19.99',
          totalPrice: '$119.94',
          originalTotal: '$329.80',
          savings: 'Save $209.86',
          bonusText: '✓ Lowest Price Per Bottle + Best Long-Term Value',
          perks: ['Lowest Price Per Bottle', 'Free U.S. Shipping', '90-Day Guarantee', 'Best Long-Term Value'],
          ctaText: 'GET THE BEST VALUE →',
          checkoutUrl: 'https://cc.usesonnus.com/checkout.php?hid=b2lkPW9mZl80MjQwNDIwJmFpZD1hZmYxOTgyODE0JnVpZD1ibF85MDY2ODgw&affid=aff1982814'
        }
      ]
    },

    trustStrip: {
      tag: 'TRUST & QUALITY',
      title: 'RESTFUL WELLNESS SUPPORT',
      items: [
        { title: '10-INGREDIENT BLEND', desc: 'Combines magnesium, L-Theanine, GABA, apigenin, B vitamins and 0.9 mg melatonin.' },
        { title: 'THIRD-PARTY TESTED', desc: 'Quality tested by an independent third-party laboratory.' },
        { title: 'U.S. MADE', desc: 'Manufactured in the United States in a registered facility.' },
        { title: 'FREE U.S. SHIPPING', desc: 'Fast shipping directly from our U.S. fulfillment centers.' },
        { title: '90-DAY GUARANTEE', desc: 'Try Sonnus risk-free for 90 days.' }
      ]
    },

    whyBlock: {
      tag: 'THE DIFFERENCE',
      title: 'SLEEP SUPPORT SHOULDN\'T BEGIN AND END WITH ONE INGREDIENT.',
      lead: 'Many nighttime supplements are built around a simple idea: MORE MELATONIN = BETTER.',
      p1: 'Sonnus takes a different approach. Melatonin plays an important role in normal sleep-wake timing. But nighttime wellness involves more than one pathway — and that\'s why Sonnus doesn\'t build the entire formula around melatonin alone.',
      boxTag: 'THE SONNUS NIGHTTIME FORMULA:',
      boxTitle: '10 INGREDIENTS. 2 GUMMIES. ONE SIMPLE NIGHTLY RITUAL.',
      p2: 'Instead of relying on melatonin as the entire nighttime strategy, Sonnus combines Magnesium, L-Theanine, GABA, 5-HTP, Apigenin, Lemon Balm, Vitamins B2 + B6 with just 0.9 mg of melatonin per serving.',
      tagline: 'MELATONIN IS PART OF THE FORMULA. NOT THE ENTIRE FORMULA.',
      ctaText: 'SEE THE FULL SONNUS FORMULA →',
      image: '/sonnus/images/gallery-1.png'
    },

    whyChoose: {
      tag: 'WHY PEOPLE CHOOSE SONNUS',
      title: 'A BETTER NIGHT STARTS BEFORE YOU FALL ASLEEP.',
      titleHighlight: 'THE TRANSITION MATTERS.',
      subtitle: 'Your day doesn\'t always stop when your head reaches the pillow. Emails, screens, deadlines and mental stimulation follow you straight into bed.',
      tagline: 'CHEW. UNWIND. REST.',
      ctaText: 'CHOOSE MY BUNDLE →',
      image: '/sonnus/images/section-why-choose.png',
      features: [
        { icon: 'Droplets', title: '2 WILD BERRY GUMMIES', desc: 'Convenient gummy format. No powder, no shaker, no mixing required.' },
        { icon: 'Leaf', title: '10 SLEEP-SUPPORT INGREDIENTS', desc: 'Formulated with botanicals, amino acids, minerals and vitamins.' },
        { icon: 'Sun', title: 'CALMER BEDTIME TRANSITION', desc: 'Designed to signal to your mind and body that the day is done.' },
        { icon: 'ShieldCheck', title: '90-DAY RISK-FREE GUARANTEE', desc: 'Plenty of time to evaluate your new evening ritual.' }
      ]
    },

    benefitsSection: {
      tag: 'NIGHTTIME SUPPORT',
      title: 'BUILT FOR THE MOMENT YOUR DAY NEEDS TO SLOW DOWN.',
      subtitle: 'Sonnus complements your evening routine to foster calm, relaxation and restful sleep.',
      highlightText: 'TEN INGREDIENTS. TWO GUMMIES. ONE EASY NIGHTLY RITUAL.',
      ctaText: 'TRY SONNUS TODAY →',
      image: '/sonnus/images/section-benefits.png',
      benefits: [
        { title: 'NIGHTTIME RELAXATION', desc: 'Ingredients such as L-Theanine, GABA, magnesium and apigenin are included as part of a formula designed around nighttime calm and relaxation.' },
        { title: 'RESTFUL SLEEP SUPPORT', desc: 'A multi-ingredient formula designed to complement healthy sleep habits and support restful sleep.' },
        { title: 'CALMER BEDTIME ROUTINE', desc: 'Designed to fit into the transition from a busy day into a more intentional nighttime environment.' },
        { title: 'HEALTHY SLEEP-WAKE TIMING', desc: 'Contains 0.9 mg of melatonin, a hormone naturally involved in normal sleep-wake timing.' },
        { title: 'EASY NIGHTLY CONSISTENCY', desc: 'Two Wild Berry gummies. No powder. No shaker. No complicated protocol.' }
      ]
    },

    howItWorks: {
      tag: 'HOW TO USE',
      title: 'GIVE YOUR DAY A CLEAR ENDING.',
      subtitle: 'Sonnus takes seconds to use. The rest of the routine is about giving your body and mind a consistent environment for sleep.',
      image: '/sonnus/images/section-how-it-works.png',
      steps: [
        { step: '01', title: 'CHEW', desc: 'Take 2 gummies approximately 30 minutes before bedtime.' },
        { step: '02', title: 'DIM', desc: 'Lower the lights and begin reducing unnecessary stimulation.' },
        { step: '03', title: 'DISCONNECT', desc: 'Give yourself a little distance from work, notifications and screens.' },
        { step: '04', title: 'REST', desc: 'Allow Sonnus to complement the nighttime habits that support healthy sleep.' }
      ],
      tagline: 'CHEW. DIM. DISCONNECT. REST.',
      ctaText: 'START MY NIGHTLY ROUTINE →'
    },

    ingredientsSection: {
      tag: 'WHAT\'S INSIDE',
      title: 'A NIGHTTIME STACK — WITHOUT THE NIGHTTIME STACK.',
      subtitle: 'Instead of asking you to buy several separate supplements, Sonnus combines 10 sleep-support ingredients into one convenient gummy formula.',
      description: 'Sonnus features clean botanical extracts, calming amino acids, essential minerals, and vitamins.',
      highlightText: 'NOT A MELATONIN-ONLY PRODUCT. A MULTI-INGREDIENT NIGHTTIME FORMULA.',
      ctaText: 'VIEW SUPPLEMENT FACTS →',
      image: '/sonnus/images/section-ingredients.png',
      ingredients: [
        { name: 'MAGNESIUM BISGLYCINATE + GLYCINATE', desc: 'Magnesium is an essential mineral involved in hundreds of physiological processes, including normal nervous-system and muscle function.', whyItsHere: 'To form part of Sonnus\' broader relaxation and nighttime-wellness approach.' },
        { name: 'L-THEANINE', desc: 'An amino acid found naturally in tea and frequently studied in relation to relaxation and stress response.', whyItsHere: 'To complement Sonnus\' nighttime-calming profile.' },
        { name: 'GABA', desc: 'A naturally occurring neurotransmitter involved in inhibitory signaling in the nervous system.', whyItsHere: 'As part of the formula\'s broader relaxation approach.' },
        { name: '5-HTP', desc: 'A precursor involved in the body\'s normal serotonin pathway.', whyItsHere: 'To complement the multi-pathway nighttime formula.' },
        { name: 'APIGENIN', desc: 'A naturally occurring flavonoid found in several plants, including chamomile.', whyItsHere: 'To complement Sonnus\' nighttime botanical profile.' },
        { name: 'LEMON BALM', desc: 'Lemon balm has a long history of traditional use in calming and evening botanical preparations.', whyItsHere: 'To complement the formula\'s relaxation-focused ingredients.' },
        { name: 'VITAMINS B6 & B2', desc: 'Vitamin B6 serves as a cofactor in multiple biochemical pathways, while B2 plays a recognized role in normal cellular energy metabolism.', whyItsHere: 'To support the nutritional architecture of Sonnus\' nighttime formula.' },
        { name: 'MELATONIN — 0.9 MG', desc: 'Melatonin is naturally produced by the body and plays an important role in normal sleep-wake timing.', whyItsHere: 'Sonnus uses 0.9 mg per serving as one part of a broader 10-ingredient formula.' }
      ]
    },

    comparisonSection: {
      tag: 'WHY SONNUS?',
      title: 'MELATONIN-ONLY VS. A MORE COMPLETE NIGHTTIME FORMULA.',
      tagline: 'TEN INGREDIENTS. TWO GUMMIES. ONE NIGHTLY HABIT.',
      image: '/sonnus/images/section-comparison.png',
      headers: ['FEATURES', 'SONNUS®', 'BASIC MELATONIN-ONLY PRODUCTS'],
      rows: [
        { feature: 'Multi-ingredient approach', product: true, opponent: false },
        { feature: 'Magnesium', product: true, opponent: 'Varies' },
        { feature: 'L-Theanine', product: true, opponent: 'Varies' },
        { feature: 'GABA', product: true, opponent: 'Varies' },
        { feature: 'Apigenin', product: true, opponent: 'Varies' },
        { feature: 'Lemon Balm', product: true, opponent: 'Varies' },
        { feature: '5-HTP', product: true, opponent: 'Varies' },
        { feature: 'Melatonin (0.9 mg)', product: '0.9 mg', opponent: 'Varies' },
        { feature: 'Wild Berry gummy format', product: true, opponent: 'Varies' },
        { feature: '90-Day Guarantee', product: true, opponent: 'Varies' }
      ]
    },

    reviewsSection: {
      tag: 'CUSTOMER REVIEWS',
      title: 'REAL NIGHTS. REAL ROUTINES.',
      ratingText: '★★★★★ 4.8/5 Customer Rating',
      headline: 'MADE TO FIT INTO BEDTIME — NOT TAKE IT OVER.',
      disclaimer: 'Based on authentic verified customer feedback. Individual experiences may vary.',
      reviews: [
        { quote: '“IT\'S BECOME MY SIGNAL TO START WINDING DOWN.”', body: '“The gummies are easy to take and I like having a consistent step that tells me it\'s time to start shutting things down for the night.”', author: 'Olivia G. — Verified Buyer', stars: 5 },
        { quote: '“I LOVE THAT IT\'S MORE THAN JUST MELATONIN.”', body: '“I was looking for something with a broader formula, and the ingredient blend is what made me choose Sonnus.”', author: 'Taylor B. — Verified Buyer', stars: 5 },
        { quote: '“THE WILD BERRY GUMMIES MAKE IT EASY.”', body: '“No capsules or mixing anything. Two gummies before bed fits naturally into my routine.”', author: 'Morgan E. — Verified Buyer', stars: 5 },
        { quote: '“SIMPLE ENOUGH TO STAY CONSISTENT.”', body: '“I\'ve tried more complicated nighttime routines before. This is much easier for me to stick with.”', author: 'Samantha D. — Verified Buyer', stars: 5 }
      ]
    },

    guaranteeSection: {
      tag: '90-DAY MONEY-BACK GUARANTEE',
      title: 'GIVE YOUR NIGHTTIME ROUTINE A FAIR SHOT.',
      subtitle: 'KEEP THE DECISION IN YOUR HANDS.',
      lead: 'Sleep habits are personal. And trying a new nighttime routine shouldn\'t feel like a gamble.',
      body: 'Use Sonnus according to the directions. Make it part of a consistent nighttime routine. Then decide whether it\'s right for you. If you\'re not satisfied, contact our customer support team during the guarantee period according to the terms of the refund policy.',
      highlight: '90 DAYS. YOUR DECISION.',
      ctaText: 'TRY SONNUS WITH CONFIDENCE →',
      microcopy: 'Free U.S. Shipping • Secure Checkout • One-Time Purchase'
    },

    faqSection: {
      tag: 'FAQ',
      title: 'QUESTIONS? WE\'VE GOT ANSWERS.',
      faqs: [
        { q: 'WHAT EXACTLY IS SONNUS?', a: 'Sonnus is a nighttime dietary supplement in Wild Berry gummy form featuring 10 ingredients selected around relaxation, nighttime wellness and healthy sleep support.' },
        { q: 'HOW MANY GUMMIES DO I TAKE?', a: 'Take 2 gummies approximately 30 minutes before bedtime, according to the current product directions.' },
        { q: 'DOES SONNUS CONTAIN MELATONIN?', a: 'Yes. Sonnus contains 0.9 mg of melatonin per serving as part of its broader 10-ingredient formula.' },
        { q: 'WHY DOES SONNUS USE A MULTI-INGREDIENT FORMULA?', a: 'Because Sonnus is designed around a broader nighttime-wellness approach rather than relying entirely on one ingredient. Its formula includes magnesium, L-Theanine, GABA, 5-HTP, apigenin, lemon balm, B vitamins and melatonin among its components.' },
        { q: 'IS SONNUS A SLEEPING PILL?', a: 'No. Sonnus is a dietary supplement and should not be positioned as a prescription or OTC sleep medication.' },
        { q: 'WILL IT "KNOCK ME OUT"?', a: 'That isn\'t how Sonnus should be positioned. Sonnus is designed to support relaxation and healthy sleep as part of a consistent bedtime routine rather than to act as a sedative medication.' },
        { q: 'HOW QUICKLY SHOULD I EXPECT RESULTS?', a: 'Individual experiences vary. Sleep can be influenced by stress, caffeine, alcohol, medications, screen exposure, work schedules, sleep environment and underlying health factors. Sonnus should be viewed as part of a consistent nighttime routine rather than as a guaranteed immediate solution.' },
        { q: 'CAN I TAKE SONNUS EVERY NIGHT?', a: 'Use Sonnus according to the current label directions. If you have questions about regular melatonin or supplement use based on your health history, speak with a qualified healthcare professional.' },
        { q: 'CAN I COMBINE SONNUS WITH SLEEP MEDICATION?', a: 'Do not combine sleep-support products casually. If you use prescription sleep aids, sedatives, antidepressants, other melatonin products or medications that may interact with the formula, speak with a qualified healthcare professional before using Sonnus.' },
        { q: 'WHAT IF SONNUS ISN\'T RIGHT FOR ME?', a: 'Eligible purchases are protected by our 90-Day Money-Back Guarantee, subject to the current refund-policy terms.' }
      ]
    },

    finalOffer: {
      tag: 'READY TO GIVE YOUR NIGHT A BETTER ROUTINE?',
      title: 'MORE THAN MELATONIN.',
      subtitle: 'WITHOUT MAKING BEDTIME MORE COMPLICATED.',
      ctaText: 'CHOOSE MY SONNUS BUNDLE →'
    },

    disclaimer: 'Sonnus® is a dietary supplement intended to complement healthy sleep habits and a balanced lifestyle. Individual experiences may vary. Sleep difficulties may have multiple causes. Persistent or significant sleep problems should be discussed with a qualified healthcare professional. Consult a healthcare professional before using dietary supplements if you are pregnant, nursing, have a medical condition or take prescription medication. Use additional caution if you take sleep aids, sedatives, antidepressants, other products containing melatonin or medications that may interact with the formula. Do not drive or operate machinery if you experience drowsiness after using the product. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.'
  },

  crowned: {
    id: 'crowned',
    brand: 'CROWNED®',
    title: 'FULLER-LOOKING HAIR STARTS WHERE YOUR HAIR STARTS.',
    subtitle: 'A lightweight daily scalp serum featuring Copper Tripeptide-1 (GHK-Cu), Niacinamide, Panthenol and Biotin — created to support a healthier-looking scalp environment and stronger, fuller-looking hair.',
    rating: 4.8,
    reviewCount: '12,340+',
    startingPrice: '$19.99',
    accentColor: '#27AE60',
    accentLight: 'rgba(39, 174, 96, 0.12)',
    heroImage: '/assets/products/crowned-gal-1.png',
    
    usps: [
      'Supports fuller-looking hair',
      'Helps strengthen and condition fragile strands',
      'Supports a healthier-looking scalp',
      'Helps reduce the appearance of breakage',
      'Featuring Copper Tripeptide-1 (GHK-Cu)',
      'Lightweight, non-greasy leave-in serum',
      'One simple daily application'
    ],

    gallery: [
      { id: 'cg1', label: 'HERO', src: '/assets/products/crowned-gal-1.png' },
      { id: 'cg2', label: 'APPLICATION', src: '/assets/products/crowned-gal-2.png' },
      { id: 'cg3', label: 'BENEFITS', src: '/assets/products/crowned-gal-3.png' },
      { id: 'cg4', label: 'FORMULA', src: '/assets/products/crowned-gal-4.png' },
      { id: 'cg5', label: 'RESULT', src: '/assets/products/crowned-gal-5.png' },
      { id: 'cg6', label: 'TRUST', src: '/assets/products/crowned-gal-6.png' }
    ],

    bundlesSection: {
      tag: 'CHOOSE YOUR CROWNED ROUTINE',
      title: 'SAVE MORE WHEN YOU STAY CONSISTENT.',
      subtitle: 'Hair and scalp care is a routine — not a one-day event. Choose the bundle that gives you more time to stay consistent while lowering your cost per bottle.',
      finePrint: 'ONE-TIME PURCHASE • NO AUTO-SHIP • 🔒 SECURE CHECKOUT',
      bundles: [
        {
          id: 'starter',
          name: 'STARTER ROUTINE',
          badge: 'BUY 1, GET 1 FREE',
          image: '/assets/products/crowned-bundle-1.png',
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
          checkoutUrl: 'https://cc.usecrowned.com/dtcnew/checkout.php?tier=3&package=3bottles&hid=b2lkPW9mZl82Mjc2NzA0JmFpZD1hZmYxOTgyODE0JnVpZD1ibF85ODQyODU3&affid=aff1982814'
        },
        {
          id: 'most-popular',
          name: 'MOST POPULAR',
          badge: 'MOST POPULAR',
          image: '/assets/products/crowned-bundle-2.png',
          isPopular: true,
          isBestValue: false,
          bottles: '4 BOTTLES TOTAL',
          deal: 'BUY 2, GET 2 FREE',
          pricePerBottle: '$27.49',
          totalPrice: '$109.96',
          originalTotal: '$219.92',
          savings: 'Save $109.96',
          bonusText: '✓ Better Price Per Bottle + Priority Processing',
          perks: ['Better Price Per Bottle', 'Free U.S. Shipping', '90-Day Guarantee', 'Priority Processing'],
          ctaText: 'GET MY 4 BOTTLES →',
          checkoutUrl: 'https://cc.usecrowned.com/dtcnew/checkout.php?tier=3&package=3bottles&hid=b2lkPW9mZl82Mjc2NzA0JmFpZD1hZmYxOTgyODE0JnVpZD1ibF85ODQyODU3&affid=aff1982814'
        },
        {
          id: 'best-value',
          name: 'BEST VALUE',
          badge: 'BEST VALUE',
          image: '/assets/products/crowned-bundle-3.png',
          isPopular: false,
          isBestValue: true,
          bottles: '6 BOTTLES TOTAL',
          deal: 'BUY 3, GET 3 FREE',
          pricePerBottle: '$19.99',
          totalPrice: '$119.94',
          originalTotal: '$329.80',
          savings: 'Save $209.86',
          bonusText: '✓ Lowest Price Per Bottle + Best Long-Term Value',
          perks: ['Lowest Price Per Bottle', 'Free U.S. Shipping', '90-Day Guarantee', 'Best Long-Term Value'],
          ctaText: 'GET THE BEST VALUE →',
          checkoutUrl: 'https://cc.usecrowned.com/dtcnew/checkout.php?tier=3&package=3bottles&hid=b2lkPW9mZl82Mjc2NzA0JmFpZD1hZmYxOTgyODE0JnVpZD1ibF85ODQyODU3&affid=aff1982814'
        }
      ]
    },

    trustStrip: {
      tag: 'TRUST & QUALITY',
      title: 'PEPTIDE SCALP CARE. ONCE A DAY.',
      items: [
        { title: 'COPPER TRIPEPTIDE-1', desc: 'Hero copper-binding peptide (GHK-Cu) for targeted scalp care.' },
        { title: 'LIGHTWEIGHT SERUM', desc: 'Non-greasy, leave-in formula that won\'t weigh down hair.' },
        { title: 'THIRD-PARTY TESTED', desc: 'Quality tested by an independent laboratory.' },
        { title: 'FREE U.S. SHIPPING', desc: 'Fast shipping directly to your doorstep.' },
        { title: '90-DAY GUARANTEE', desc: 'Try Crowned risk-free for 90 days.' }
      ]
    },

    whyBlock: {
      tag: 'WHY CROWNED?',
      title: 'MOST HAIR ROUTINES START TOO FAR FROM THE SOURCE.',
      lead: 'Shampoo. Conditioner. Masks. Oils. Styling creams. Most traditional hair care focuses almost entirely on the visible hair fiber. But every strand begins at the scalp.',
      p1: 'And that makes scalp care one of the most logical places to build a more complete hair routine.',
      boxTag: 'CROWNED WAS CREATED AROUND A SIMPLE IDEA:',
      boxTitle: 'DON\'T JUST STYLE THE HAIR. CARE FOR THE ENVIRONMENT IT GROWS FROM.',
      p2: 'That is why Crowned is applied directly to the scalp. Not just to the ends. Not just to the surface of the hair. A focused serum designed to complement the rest of your routine from the foundation up.',
      tagline: 'SCALP FIRST. STRANDS SECOND. ROUTINE SIMPLE.',
      ctaText: 'START MY CROWNED ROUTINE →',
      image: '/assets/products/crowned-sec-1.png',
      aspectRatio: '1 / 1'
    },

    whyChoose: {
      tag: 'WHY A SCALP SERUM?',
      title: 'BECAUSE HAIR OIL AND SCALP CARE',
      titleHighlight: 'ARE NOT THE SAME THING.',
      subtitle: 'Traditional oils are often designed around coating or conditioning the hair fiber. Crowned is designed as a lightweight leave-in serum applied directly to the scalp.',
      tagline: 'CARE WHERE IT COUNTS. WITHOUT THE HEAVY FEEL.',
      ctaText: 'CHOOSE MY BUNDLE →',
      image: '/assets/products/crowned-sec-4.png',
      features: [
        { icon: 'Droplets', title: 'LIGHTWEIGHT & LEAVE-IN', desc: 'Applied directly to dry or towel-dried scalp with no heavy oil residue.' },
        { icon: 'Leaf', title: 'PEPTIDE + VITAMIN FORMULA', desc: 'Copper Tripeptide-1 (GHK-Cu), Niacinamide, Panthenol, and Biotin.' },
        { icon: 'Sun', title: 'TEN SECONDS A DAY', desc: 'One dropper, quick massage, and you\'re done. Fits existing routine.' },
        { icon: 'ShieldCheck', title: '90-DAY RISK FREE GUARANTEE', desc: 'Give consistent scalp care a fair shot for 90 full days.' }
      ]
    },

    benefitsSection: {
      tag: 'WHAT CROWNED SUPPORTS',
      title: 'BETTER-LOOKING HAIR ISN\'T JUST ABOUT SHINE.',
      subtitle: 'Crowned combines scalp conditioning and strand care in one lightweight daily formula.',
      highlightText: 'SCALP CARE. STRAND CARE. ONE DAILY SERUM.',
      ctaText: 'TRY CROWNED →',
      image: '/assets/products/crowned-sec-2.png',
      benefits: [
        { title: 'FULLER-LOOKING HAIR', desc: 'Designed to support the appearance of greater body, density and fullness as part of a consistent scalp-care routine.' },
        { title: 'STRONGER-LOOKING STRANDS', desc: 'Conditioning ingredients help support hair resilience and improve the appearance and feel of fragile strands.' },
        { title: 'HEALTHIER-LOOKING SCALP', desc: 'A scalp-focused formula designed to help maintain a well-conditioned, balanced-looking scalp environment.' },
        { title: 'LESS VISIBLE BREAKAGE', desc: 'Helps condition the hair and support strands that look smoother, stronger and better cared for.' },
        { title: 'SIMPLE DAILY CARE', desc: 'One lightweight leave-in application. No rinse, no heavy residue, no complicated new routine.' }
      ]
    },

    howItWorks: {
      tag: 'HOW TO USE',
      title: 'TEN SECONDS. ONE TARGETED STEP.',
      subtitle: 'You do not need an entirely new hair-care system. Crowned is designed to slot into the one you already have.',
      image: '/assets/products/crowned-sec-5.png',
      steps: [
        { step: '01', title: 'APPLY', desc: 'Apply 1 full dropper daily directly to the dry or towel-dried scalp.' },
        { step: '02', title: 'TARGET', desc: 'Focus the application on scalp areas where you want to be most consistent.' },
        { step: '03', title: 'MASSAGE', desc: 'Gently massage the serum into the scalp.' },
        { step: '04', title: 'LEAVE IT IN', desc: 'No rinse required. Continue with your regular styling routine.' }
      ],
      tagline: 'APPLY. MASSAGE. GO.',
      ctaText: 'START MY DAILY ROUTINE →'
    },

    ingredientsSection: {
      tag: 'WHAT\'S INSIDE',
      title: 'FOUR FOCUSED INGREDIENTS. FOUR DIFFERENT ROLES.',
      subtitle: 'Crowned combines peptide technology, scalp-barrier care and strand conditioning in one lightweight serum.',
      description: 'Instead of relying only on traditional oils or basic conditioning ingredients, Crowned puts a modern cosmetic peptide at the center of the formula.',
      highlightText: 'PEPTIDE. BARRIER CARE. CONDITIONING. ONE FORMULA.',
      ctaText: 'VIEW FULL INGREDIENT LIST →',
      image: '/assets/products/crowned-sec-3.png',
      ingredients: [
        { name: 'COPPER TRIPEPTIDE-1 — GHK-Cu', desc: 'A copper-binding cosmetic peptide studied in skin and hair-related biological research to anchor Crowned\'s advanced scalp-care approach.', whyItsHere: 'Peptide Scalp Care' },
        { name: 'NIACINAMIDE — VITAMIN B3', desc: 'One of the most established cosmetic ingredients for supporting skin-barrier function and maintaining a well-conditioned scalp environment.', whyItsHere: 'Scalp Barrier Care' },
        { name: 'PANTHENOL — PROVITAMIN B5', desc: 'Widely used in hair-care formulations for conditioning, moisture, and helping support softer, smoother and more resilient-looking strands.', whyItsHere: 'Moisture + Strand Conditioning' },
        { name: 'BIOTIN — VITAMIN B7', desc: 'Widely recognized in hair-care for conditioning and appearance, complementing Crowned\'s overall hair-care profile.', whyItsHere: 'Familiar Hair-Care Ingredient' }
      ]
    },

    comparisonSection: {
      tag: 'WHY CROWNED?',
      title: 'A FOCUSED SCALP SERUM VS. ANOTHER COMPLICATED HAIR STACK.',
      tagline: 'SCALP FIRST. ROUTINE SIMPLE.',
      image: '/crowned/images/02-gal-d.webp',
      headers: ['FEATURES', 'CROWNED®', 'COMPLEX HAIR ROUTINES'],
      rows: [
        { feature: 'Direct scalp application', product: true, opponent: 'Varies' },
        { feature: 'Copper Tripeptide-1 (GHK-Cu)', product: true, opponent: 'Varies' },
        { feature: 'Niacinamide + Panthenol', product: true, opponent: 'Varies' },
        { feature: 'Lightweight leave-in serum', product: true, opponent: 'Varies' },
        { feature: 'Once-daily use', product: true, opponent: 'Varies' },
        { feature: 'No rinse required', product: true, opponent: 'Varies' },
        { feature: 'No heavy oil format', product: true, opponent: 'Varies' },
        { feature: 'Fits existing routine', product: true, opponent: 'Varies' },
        { feature: '90-Day Guarantee', product: true, opponent: 'Varies' }
      ]
    },

    reviewsSection: {
      tag: 'CUSTOMER REVIEWS',
      title: 'REAL ROUTINES FROM REAL BUYERS.',
      ratingText: '★★★★★ 4.8/5 Customer Rating',
      headline: 'BUILT FOR PEOPLE WHO DON\'T WANT ANOTHER GREASY HAIR PRODUCT.',
      disclaimer: 'Based on authentic verified customer feedback. Individual experiences may vary.',
      reviews: [
        { quote: '“I LOVE HOW LIGHT IT FEELS.”', body: '“I\'ve tried scalp oils before and hated how my roots felt afterward. Crowned is much easier to work into my daily routine.”', author: 'Lauren V. — Verified Buyer', stars: 5 },
        { quote: '“FINALLY, A SCALP PRODUCT I ACTUALLY USE.”', body: '“One dropper, a quick massage and I\'m done. It doesn\'t complicate everything else I already do with my hair.”', author: 'Nicole R. — Verified Buyer', stars: 5 },
        { quote: '“THE FORMULA IS WHAT CAUGHT MY ATTENTION.”', body: '“I had seen copper peptides in skincare before, so I liked the idea of a scalp serum built around GHK-Cu.”', author: 'Isabella C. — Verified Buyer', stars: 5 },
        { quote: '“EASY TO USE WITHOUT CHANGING MY ROUTINE.”', body: '“I still use my regular shampoo and styling products. Crowned is just one extra step, which makes it easy to stay consistent.”', author: 'Brittany M. — Verified Buyer', stars: 5 }
      ]
    },

    guaranteeSection: {
      tag: '90-DAY MONEY-BACK GUARANTEE',
      title: 'GIVE CONSISTENT CARE A FAIR SHOT.',
      subtitle: 'THEN DECIDE FOR YOURSELF.',
      lead: 'Hair and scalp routines take consistency. Trying Crowned shouldn\'t feel like a gamble.',
      body: 'Apply Crowned according to product directions. Make it part of your daily scalp-care routine. Then decide whether it earns a permanent place in your bathroom. If you\'re not satisfied, contact customer support within 90 days according to our refund-policy terms.',
      highlight: '90 DAYS. YOUR DECISION.',
      ctaText: 'TRY CROWNED WITH CONFIDENCE →',
      microcopy: 'Free U.S. Shipping • Secure Checkout • One-Time Purchase',
      image: '/crowned/images/15-seal-90.webp'
    },

    faqSection: {
      tag: 'FAQ',
      title: 'QUESTIONS? WE\'VE GOT ANSWERS.',
      faqs: [
        { q: 'WHAT EXACTLY IS CROWNED?', a: 'Crowned is a lightweight leave-in cosmetic scalp serum formulated with Copper Tripeptide-1 (GHK-Cu), Niacinamide, Panthenol, Biotin and complementary ingredients. It is designed to support scalp condition and the appearance of stronger, fuller-looking hair.' },
        { q: 'WHAT MAKES CROWNED DIFFERENT?', a: 'Its scalp-first approach. Instead of functioning primarily as a styling product or heavy hair oil, Crowned is designed for direct once-daily scalp application and features Copper Tripeptide-1 as its hero cosmetic ingredient.' },
        { q: 'WHAT IS GHK-Cu?', a: 'GHK-Cu is a copper-binding tripeptide studied in cosmetic and biological research involving skin remodeling and hair-follicle biology. Crowned should not be interpreted as clinically proven to regrow hair simply because its formula contains GHK-Cu.' },
        { q: 'DOES NIACINAMIDE GROW HAIR?', a: 'That is not how Crowned positions niacinamide. Niacinamide has strong relevance to cosmetic skin-barrier care, while existing evidence does not establish topical niacinamide itself as a hair-growth stimulant. In Crowned, its role is centered on scalp conditioning and barrier support.' },
        { q: 'HOW DO I USE CROWNED?', a: 'Apply 1 full dropper daily directly to a dry or towel-dried scalp according to product directions. Massage gently. Leave it in. No rinse is required.' },
        { q: 'WILL IT MAKE MY HAIR GREASY?', a: 'Crowned is designed as a lightweight serum rather than a heavy traditional hair oil. Individual hair type, scalp type and amount applied may affect how the product feels.' },
        { q: 'DO I NEED TO CHANGE MY SHAMPOO?', a: 'No. Crowned is designed to complement your existing hair-care routine.' },
        { q: 'IS CROWNED A HAIR-LOSS TREATMENT?', a: 'No. Crowned is a cosmetic scalp-care product and is not intended to diagnose, treat, cure or prevent a medical cause of hair loss.' },
        { q: 'WHEN SHOULD I EXPECT TO NOTICE A DIFFERENCE?', a: 'Hair and scalp appearance changes gradually, and individual experiences vary. Consistency matters, while age, genetics, styling practices, nutrition, hormonal factors and underlying health conditions may also influence hair appearance. Crowned does not promise a specific result within a specific number of days.' },
        { q: 'WHAT IF CROWNED ISN\'T RIGHT FOR ME?', a: 'Eligible purchases are protected by our 90-Day Money-Back Guarantee according to the current refund-policy terms.' }
      ]
    },

    finalOffer: {
      tag: 'READY TO UPGRADE THE FOUNDATION OF YOUR HAIR ROUTINE?',
      title: 'START WITH THE SCALP.',
      subtitle: 'KEEP THE ROUTINE SIMPLE.',
      ctaText: 'CHOOSE MY CROWNED BUNDLE →'
    },

    disclaimer: 'Crowned® is a cosmetic scalp-care product intended to support scalp condition and the appearance of healthier, stronger, fuller-looking hair. Individual experiences may vary. Crowned is not intended to diagnose, treat, cure or prevent androgenetic alopecia, alopecia areata or any other medical cause of hair loss. Sudden, persistent, patchy or unexplained hair loss may have underlying medical causes and should be evaluated by a qualified healthcare professional. For external use only. Avoid contact with eyes. Discontinue use if significant irritation occurs.'
  }
};

