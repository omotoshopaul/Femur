/**
 * FEMUR — Single Content & Configuration Store
 * All landing page copy, disclaimers, labels, and sample data live here.
 * Copy is original and kept separated from layout components.
 */

import { FacilitySampleData, AmbulanceProviderSampleData, FundingAssistanceSampleData } from '../types';

/** Emergency contact configuration - NOT hardcoded in prose */
export const EMERGENCY_CONFIG = {
  primaryNumber: '112',
  secondaryNumber: '767',
  country: 'Nigeria',
  authorityLabel: 'Local Emergency Services',
  fullNoticeText: (emergencyNumber: string) =>
    `In immediate danger? Contact your local emergency services (${emergencyNumber}) first. FEMUR supports, and does not replace, emergency care.`,
};

export const LANDING_CONTENT = {
  brand: {
    name: 'FEMUR',
    lowercaseName: 'femur',
    tagline: 'Emergency-care coordination for Nigeria.',
  },

  navigation: {
    links: [
      { label: 'Services', href: '#services' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'For hospitals', href: '#for-hospitals' },
      { label: 'For ambulance providers', href: '#for-providers' },
      { label: 'For partners', href: '#for-partners' },
    ],
    cta: 'Request pilot access',
  },

  hero: {
    headlineLine1: 'The right care,',
    headlineLine2: 'found in time.',
    subhead:
      'FEMUR helps patients and families find suitable hospitals, arrange an ambulance, and explore verified financial support, all in one place.',
    primaryCta: 'Find care now',
    secondaryCta: 'For hospitals and providers',
    previewCaption: 'Illustrative preview. Sample data.',
  },

  resources: {
    wordList: ['Oxygen', 'Blood', 'ICU beds', 'Antivenom', 'Dialysis'],
    eyebrow: 'Resources that matter',
    statement:
      'Emergency care depends on what a hospital has right now, not what a directory said last year.',
    // TODO: VERIFY BEFORE PRESENTING.
    stats: [
      {
        id: 'stat-substandard',
        numeral: '~1 in 10',
        caption:
          'medical products in low- and middle-income countries are substandard or falsified (WHO)',
      },
      {
        id: 'stat-maternal',
        numeral: '~28%',
        caption: 'of global maternal deaths occur in Nigeria (WHO, 2020)',
      },
    ],
  },

  services: {
    eyebrow: 'Why FEMUR',
    heading: 'Four services, working together.',
    items: [
      {
        id: 'locate',
        name: 'Locate',
        title: 'Find appropriate care.',
        description: 'Search facilities by location, required services, and equipment.',
        route: '#/locate',
      },
      {
        id: 'verify',
        name: 'Verify',
        title: "Confirm what's available.",
        description:
          'Hospitals maintain their own resource information. Every listing shows when it was last confirmed.',
        route: '#/verify',
      },
      {
        id: 'dispatch',
        name: 'Dispatch',
        title: 'Coordinate transport.',
        description:
          'Send requests to existing ambulance providers, matched by location, equipment, and availability. Providers accept before dispatch.',
        route: '#/dispatch',
      },
      {
        id: 'assist',
        name: 'Assist',
        title: 'Improve financial access.',
        description:
          'Connect eligible patients with hospital-verified fundraising, NGO support, sponsorship, and optional regulated financing.',
        route: '#/assist',
      },
    ],
  },

  howItWorks: {
    eyebrow: 'How it works',
    heading: 'From emergency to answer, in four steps.',
    steps: [
      {
        number: '1',
        title: 'Ask for help.',
        description: 'Describe the need, your location, and any relevant circumstances.',
      },
      {
        number: '2',
        title: 'See suitable options.',
        description: 'FEMUR checks available hospital, resource, location, and provider data.',
      },
      {
        number: '3',
        title: 'Arrange care and transport.',
        description: 'Confirm a facility and send a request to an ambulance provider.',
      },
      {
        number: '4',
        title: 'Explore support if needed.',
        description: 'Connect with verified funding or sponsorship options.',
      },
    ],
    stripNote: 'Urgent care never waits on a funding application. You can use any step on its own.',
  },

  trust: {
    eyebrow: 'Trust and transparency',
    heading: 'Confirmed information, clearly marked.',
    badgeStates: [
      {
        state: 'confirmed' as const,
        label: 'Confirmed 12 min ago',
        sublabel: 'Green badge with check icon',
      },
      {
        state: 'stale' as const,
        label: 'Last confirmed 2 days ago. May be outdated',
        sublabel: 'Amber badge with clock icon',
      },
      {
        state: 'unconfirmed' as const,
        label: 'Unconfirmed. Call to check',
        sublabel: 'Neutral badge with question icon',
      },
    ],
    statesCaption: 'Example states. Sample data.',
    checklist: [
      'Every listing shows when it was last confirmed.',
      'Confirmed availability is kept separate from unverified listings.',
      'Hospitals verify financial-assistance cases themselves.',
      'Ambulance providers accept a request before dispatch.',
      'Sensitive medical and financial data is protected and minimized.',
      'The AI Navigator never invents availability or diagnoses.',
    ],
  },

  audiences: {
    eyebrow: 'Built for everyone in the chain',
    heading: 'One platform for the people who make emergency care happen.',
    items: [
      {
        id: 'for-caregivers',
        title: 'Patients and caregivers',
        description: 'Find appropriate care, request transport, and explore financial assistance.',
        linkText: 'Learn more →',
        href: '#/locate',
      },
      {
        id: 'for-hospitals',
        title: 'Hospitals and clinics',
        description:
          'Maintain resource information, confirm availability, and coordinate referrals and transfers.',
        linkText: 'Learn more →',
        href: '#/hospitals',
      },
      {
        id: 'for-providers',
        title: 'Ambulance providers',
        description: 'Receive suitable requests, accept them, and share dispatch status.',
        linkText: 'Learn more →',
        href: '#/providers',
      },
      {
        id: 'for-partners',
        title: 'NGOs, sponsors, and funding partners',
        description: 'Support eligible patients through transparent, verified processes.',
        linkText: 'Learn more →',
        href: '#/partners',
      },
    ],
  },

  navigator: {
    eyebrow: 'Emergency Navigator',
    heading: 'Say what you need, in your own words.',
    description:
      'Describe the situation in plain language. The Navigator helps you understand your options and guides you to the next step, using current, verified data where available.',
    caption: 'Illustrative example',
    conversation: [
      {
        sender: 'user' as const,
        text: 'My father needs a hospital with oxygen support, and we need an ambulance.',
      },
      {
        sender: 'navigator' as const,
        text: "I'm sorry you're dealing with this. Share your location and I'll look for facilities with confirmed oxygen support and check ambulance providers nearby. I can't diagnose or promise availability. I'll show when each listing was last confirmed, and suggest you call to verify.",
      },
    ],
    guardrails: [
      'Does not diagnose',
      'Does not invent availability',
      "Points to emergency services when it's urgent",
    ],
  },

  designedToWorkWith: {
    eyebrow: 'Designed to work with',
    heading: 'The institutions already running emergency care in Nigeria.',
    // TODO: Only change this wording once a real agreement exists.
    institutions: [
      'Federal Ministry of Health and Social Welfare (FMoHSW)',
      'State Ministries of Health',
      'National Health Insurance Authority (NHIA)',
      'Lagos State Ambulance Service (LASAMBUS)',
      'Nigerian Red Cross Society',
      'NGOs and health foundations',
      'HMOs and insurers',
      'Licensed payment partners (Paystack, Flutterwave)',
      'Crowdfunding and sponsorship platforms',
    ],
    builtWith: {
      label: 'Built with',
      text: 'Google AI Studio · Firebase',
    },
    caption: 'Intended partners and integrations. No partnership, endorsement or backing is claimed.',
  },

  bentoFooter: {
    contactEmail: 'femur@gmail.com',
    headline: 'Bring the right care closer.',
    supportingText: 'Join the hospitals, ambulance providers, and partners building a clearer path to emergency care.',
    ctaButton: 'Request pilot access',
    columns: [
      {
        heading: 'Services',
        links: [
          { label: 'Locate', href: '#services' },
          { label: 'Verify', href: '#services' },
          { label: 'Dispatch', href: '#services' },
          { label: 'Assist', href: '#services' },
        ],
      },
      {
        heading: 'For',
        links: [
          { label: 'Patients', href: '#/locate' },
          { label: 'Hospitals', href: '#for-hospitals' },
          { label: 'Ambulance providers', href: '#for-providers' },
          { label: 'Sponsors', href: '#for-partners' },
        ],
      },
      {
        heading: 'FEMUR',
        links: [
          { label: 'About', href: '#how-it-works' },
          { label: 'How it works', href: '#how-it-works' },
          { label: 'Pilot program', href: '#/pilot' },
          { label: 'Contact', href: 'mailto:femur@gmail.com' },
        ],
      },
    ],
    prototypeNotice: 'FEMUR is a prototype. All data shown is sample data and not live availability.',
    legal: [
      { label: 'Privacy Policy', href: '#/privacy' },
      { label: 'Terms of Service', href: '#/terms' },
    ],
    copyright: '© 2026 FEMUR',
  },
};

/**
 * Hero connected preview sample data
 */
export const HERO_PREVIEW_DATA = {
  facility: {
    id: 'hero-fac-01',
    name: 'Sample General Hospital',
    facilityType: 'General Hospital' as const,
    location: {
      area: 'Central District',
      city: 'Lagos',
      state: 'Lagos State',
      distanceKm: 2.4,
    },
    verificationState: 'confirmed' as const,
    lastConfirmedTime: '12 min ago',
    lastConfirmedIso: '2026-10-16T11:44:00Z',
    traumaLevel: 'Emergency Department',
    bloodBankAvailable: true,
    oxygenAvailable: true,
    emergencyContact: '+234 (0) 1 000 0000',
    isSampleData: true as const,
    verifiedCapabilities: [
      { id: 'c1', name: 'Medical Oxygen', available: true },
      { id: 'c2', name: 'Emergency Surgery', available: true },
    ],
  },
  ambulance: {
    id: 'hero-amb-01',
    providerName: 'Sample Ambulance Co.',
    vehicleType: 'Basic Life Support (BLS)' as const,
    baseLocation: 'Central Dispatch Depot',
    coverageAreas: ['Central District', 'Victoria Island'],
    operationalStatus: 'Awaiting acceptance' as const,
    estimatedResponseTime: '~15 min',
    verificationState: 'confirmed' as const,
    lastConfirmedTime: '5 min ago',
    contactChannel: '+234 (0) 700 000 0000',
    providerNotice: 'Provider confirms route and availability before dispatch.',
    isSampleData: true as const,
  },
  assist: {
    id: 'hero-ast-01',
    caseRef: 'AST-SAMPLE-01',
    patientInitials: 'Patient Emergency Care Fund',
    verifiedHospitalName: 'Sample General Hospital',
    medicalProcedure: 'Emergency Surgical Treatment',
    verifiedBillAmountNgn: 450000,
    fundsRaisedNgn: 315000,
    assistanceType: 'Hospital-Verified Direct Grant' as const,
    verificationState: 'confirmed' as const,
    lastAuditTime: 'Verified by Sample General Hospital',
    statusText: 'Verified hospital bill with direct disbursement guarantee.',
    isSampleData: true as const,
  },
};
