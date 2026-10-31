// src/data/cinematicSlidesData.ts
// EPEDE 2.0 — Verified Authentic Electrical Infrastructure Slide Data for Hero Section
// Integrated with 100% authentic user-uploaded photographs.

export interface HeroPhotoItem {
  id: string;
  url: string;
  titleFr: string;
  titleEn: string;
  captionFr: string;
  captionEn: string;
  focalPosition?: string;
}

export interface CinematicSlide {
  id: string;
  orderNumber: string;
  tabLabel: { fr: string; en: string };
  headline: { fr: string; en: string };
  supportingText: { fr: string; en: string };
  primaryCtaLabel: { fr: string; en: string };
  secondaryCtaLabel: { fr: string; en: string };
  targetView: 'power-chain' | 'learn' | 'equipment' | 'cameroon-grid';
  targetSectionId: string;
  gridFact: { fr: string; en: string };
  photos: HeroPhotoItem[];
}

export const CINEMATIC_SLIDES: CinematicSlide[] = [
  // SLIDE 01: POWER GENERATION (Hydro Dams, Turbines, Gas Engines, Solar/Wind)
  {
    id: 'slide-generation',
    orderNumber: '01',
    tabLabel: { fr: 'Production Électrique', en: 'Power Generation' },
    headline: {
      fr: 'LÀ OÙ NAÎT L’ÉNERGIE.',
      en: 'WHERE POWER BEGINS.',
    },
    supportingText: {
      fr: 'Découvrez comment l’électricité est produite à travers les barrages hydrauliques, centrales thermiques et parcs renouvelables qui alimentent les réseaux.',
      en: 'Discover how electricity is generated through the hydroelectric dams, thermal plants, and renewable technologies that power modern civilization.',
    },
    primaryCtaLabel: {
      fr: 'EXPLORER LA PRODUCTION',
      en: 'EXPLORE POWER GENERATION',
    },
    secondaryCtaLabel: {
      fr: 'COMMENCER À APPRENDRE',
      en: 'START LEARNING',
    },
    targetView: 'power-chain',
    targetSectionId: 'section-power-chain',
    gridFact: {
      fr: 'Nachtigal (420 MW) & Song Loulou (384 MW) convertissent la puissance hydraulique de la Sanaga en 50 Hz synchronisé.',
      en: 'Nachtigal (420 MW) & Song Loulou (384 MW) convert the hydraulic head of the Sanaga river into synchronized 50 Hz power.',
    },
    photos: [
      {
        id: 'gen-hydro-dam-spillway',
        url: '/images/homepage_uploads/batch_01_image_005.jpg',
        titleFr: 'Barrage Hydroélectrique & Évacuateur de Crues',
        titleEn: 'High-Head Hydroelectric Dam & Active Spillway',
        captionFr: 'Barrage réservoir et évacuateur de crues alimentant les turbines hydrauliques sous haute pression.',
        captionEn: 'Concrete gravity dam and spillway discharging high-velocity head to hydraulic turbines.',
        focalPosition: 'center 40%',
      },
      {
        id: 'gen-hydro-turbines-machine-hall',
        url: '/images/homepage_uploads/batch_06_image_030.jpg',
        titleFr: 'Salle des Machines & Turbines Hydrauliques',
        titleEn: 'Powerhouse Machine Hall & Hydraulic Turbines',
        captionFr: 'Ligne de turbines hydrauliques avec volutes d’admission spiralées accouplées aux alternateurs.',
        captionEn: 'Hydraulic turbines with spiral scroll cases coupled directly to synchronous generators.',
        focalPosition: 'center center',
      },
      {
        id: 'gen-thermal-gas-engines',
        url: '/images/homepage_uploads/batch_05_image_025.jpg',
        titleFr: 'Centrale Thermique & Alternateurs AvK',
        titleEn: 'Thermal Gas/Diesel Powerhouse & Alternators',
        captionFr: 'Rangée de moteurs industriels en V entraînant des alternateurs de puissance pour production de base.',
        captionEn: 'Lineup of multi-cylinder industrial engines coupled to AvK alternators for baseload power.',
        focalPosition: 'center center',
      },
      {
        id: 'gen-solar-wind-hybrid',
        url: '/images/homepage_uploads/batch_01_image_001.jpg',
        titleFr: 'Parc Solaire Photovoltaïque & Éolien',
        titleEn: 'Utility-Scale Solar PV & Wind Generation',
        captionFr: 'Champs photovoltaïques avec onduleurs et aérogénérateurs raccordés au réseau moyenne tension.',
        captionEn: 'Solar photovoltaic arrays and wind turbines injecting power through collector networks.',
        focalPosition: 'center center',
      },
    ],
  },

  // SLIDE 02: POWER TRANSMISSION (High Voltage Towers & Corridor)
  {
    id: 'slide-transmission',
    orderNumber: '02',
    tabLabel: { fr: 'Transport Électrique', en: 'Power Transmission' },
    headline: {
      fr: 'TRANSPORTER SANS PERDRE.',
      en: 'BRIDGING DISTANCE WITH POWER.',
    },
    supportingText: {
      fr: 'Explorez la physique du transport très haute tension (225 kV / 400 kV), les faisceaux de conducteurs et les équilibres de charge à l’échelle nationale.',
      en: 'Explore the physics of extra-high voltage transmission (225 kV / 400 kV), bundled conductors, and the national grid backbone that slashes line losses.',
    },
    primaryCtaLabel: {
      fr: 'EXPLORER LE TRANSPORT',
      en: 'EXPLORE TRANSMISSION',
    },
    secondaryCtaLabel: {
      fr: 'LIGNES & PYLÔNES 225 kV',
      en: '225 kV LINES & TOWERS',
    },
    targetView: 'power-chain',
    targetSectionId: 'section-power-chain',
    gridFact: {
      fr: 'La dorsale 225 kV SONATREL relie Mangombé (Edéa) à Yaoundé et Douala avec des pertes réduites de plus de 450 fois par rapport à une basse tension.',
      en: 'SONATREL 225 kV transmission backbone links Mangombé (Edéa) to Yaoundé and Douala, slashing line losses by over 450 times compared to low voltage.',
    },
    photos: [
      {
        id: 'trans-lattice-tower-field',
        url: '/images/homepage_uploads/batch_02_image_007.jpg',
        titleFr: 'Pylône Treillis Acier Double Terne 225 kV',
        titleEn: 'Double-Circuit EHV Steel Lattice Tower',
        captionFr: 'Pylône métallique d’alignement avec chaînes d’isolateurs en suspension et câbles de garde.',
        captionEn: 'Steel lattice transmission tower supporting multi-bundle conductors and suspension insulators.',
        focalPosition: 'center 45%',
      },
      {
        id: 'trans-corridor-sky',
        url: '/images/homepage_uploads/batch_02_image_008.jpg',
        titleFr: 'Corridor d’Interconnexion Haute Tension',
        titleEn: 'High-Voltage Transmission Line Corridor',
        captionFr: 'Artère d’évacuation de puissance interrégionale reliant les centrales aux métropoles.',
        captionEn: 'Regional high-voltage transmission corridor routing bulk power across long distances.',
        focalPosition: 'center center',
      },
      {
        id: 'trans-substation-night',
        url: '/images/homepage_uploads/batch_06_image_028.jpg',
        titleFr: 'Poste HTB & Portiques d’Arrivée de Nuit',
        titleEn: 'High-Voltage Switchyard & Gantries at Night',
        captionFr: 'Poste de transformation sous éclairage de sécurité avec transformateurs et jeux de barres.',
        captionEn: 'Outdoor transmission switchyard illuminated by floodlights showing transformers and busbars.',
        focalPosition: 'center center',
      },
    ],
  },

  // SLIDE 03: SUBSTATIONS & DISTRIBUTION (Step-Down Transformers, AIS Switchyard)
  {
    id: 'slide-substations',
    orderNumber: '03',
    tabLabel: { fr: 'Postes & Distribution', en: 'Substations & Distribution' },
    headline: {
      fr: 'ÉNERGISER CHAQUE CONNEXION.',
      en: 'POWERING EVERY CONNECTION.',
    },
    supportingText: {
      fr: 'Comprenez comment l’électricité est abaissée, aiguillée, protégée par disjoncteurs SF6 et transformateurs de puissance jusqu’aux réseaux de distribution.',
      en: 'Understand how electricity is stepped down, routed, protected by fast SF6 circuit breakers, and distributed reliably to consumers.',
    },
    primaryCtaLabel: {
      fr: 'EXPLORER LES POSTES HTB/HTA',
      en: 'EXPLORE SUBSTATIONS',
    },
    secondaryCtaLabel: {
      fr: 'TRANSFORMATEURS & APPAREILLAGE',
      en: 'TRANSFORMERS & SWITCHGEAR',
    },
    targetView: 'equipment',
    targetSectionId: 'section-equipment',
    gridFact: {
      fr: 'Les postes sources 225/90/30 kV d’Oyomabang et Bekoko utilisent des disjoncteurs SF6 et des transformateurs régleurs en charge OLTC.',
      en: 'Primary 225/90/30 kV grid substations at Oyomabang and Bekoko utilize dead-tank SF6 circuit breakers and on-load tap changer transformers.',
    },
    photos: [
      {
        id: 'sub-stepdown-transformer',
        url: '/images/homepage_uploads/batch_02_image_006.jpg',
        titleFr: 'Transformateur de Puissance & Radiateurs',
        titleEn: 'Step-Down Power Transformer Unit',
        captionFr: 'Transformateur triphasé HTB/HTA avec conservateur d’huile, régleur en charge et traversées.',
        captionEn: 'Three-phase power transformer with cooling radiators, oil conservator, and HV bushings.',
        focalPosition: 'center center',
      },
      {
        id: 'sub-ais-panoramic',
        url: '/images/homepage_uploads/batch_02_image_010.jpg',
        titleFr: 'Poste Ouvert AIS & Portiques Haute Tension',
        titleEn: 'Air-Insulated Substation (AIS) & Gantries',
        captionFr: 'Vue aérienne de travées de poste, sectionneurs et arrivées de lignes haute tension.',
        captionEn: 'Panoramic view of air-insulated substation bays, disconnectors, and gantry arrivals.',
        focalPosition: 'center center',
      },
      {
        id: 'sub-transformer-cubicles',
        url: '/images/homepage_uploads/batch_04_image_016.jpg',
        titleFr: 'Transformateur Immergé & Armoires de Contrôle',
        titleEn: 'Oil-Immersed Transformer & Control Cubicles',
        captionFr: 'Poste de transformation avec radiateurs ondulés et armoires d’automatisme de travée.',
        captionEn: 'Substation transformer equipped with corrugated cooling fins and bay control cubicles.',
        focalPosition: 'center center',
      },
    ],
  },

  // SLIDE 04: INDUSTRIAL ELECTRICAL ENGINEERING & SCADA
  {
    id: 'slide-industrial',
    orderNumber: '04',
    tabLabel: { fr: 'Génie Électrique Industriel', en: 'Industrial Engineering' },
    headline: {
      fr: 'L’INGÉNIERIE QUI FAIT TOURNER LE MONDE.',
      en: 'ENGINEERING THAT POWERS INDUSTRY.',
    },
    supportingText: {
      fr: 'Du Tableau Général Basse Tension (TGBT) aux centres de commande moteurs (MCC) et relais numériques de protection, maîtrisez les installations industrielles.',
      en: 'From Main Low-Voltage Switchboards (TGBT) to Motor Control Centers (MCC) and digital protection relays, master real-world industrial installations.',
    },
    primaryCtaLabel: {
      fr: 'EXPLORER LES INSTALLATIONS',
      en: 'EXPLORE INSTALLATIONS',
    },
    secondaryCtaLabel: {
      fr: 'GUIDES & SCHÉMATHÈQUE',
      en: 'SCHEMATICS & GUIDES',
    },
    targetView: 'equipment',
    targetSectionId: 'section-equipment',
    gridFact: {
      fr: 'Les TGBT industriels Forme 4b séparent physiquement jeux de barres, unités fonctionnelles et bornes pour une sécurité maximale en exploitation.',
      en: 'Form 4b industrial switchboards physically segregate busbars, functional units, and terminals for zero-downtime maintenance safety.',
    },
    photos: [
      {
        id: 'ind-switchgear-lineup',
        url: '/images/homepage_uploads/batch_05_image_024.jpg',
        titleFr: 'Rame de Cellules TGBT & Chemins de Câbles',
        titleEn: 'Industrial Switchgear Lineup & Cable Ladders',
        captionFr: 'Cellules de distribution Forme 4b avec disjoncteurs débrochables et relais numériques.',
        captionEn: 'Form-4b switchboard cubicles with withdrawable circuit breakers and digital relays.',
        focalPosition: 'center 40%',
      },
      {
        id: 'ind-scada-dispatch-wall',
        url: '/images/homepage_uploads/batch_06_image_026.jpg',
        titleFr: 'Mur d’Écrans SCADA & Téléconduite Réseau',
        titleEn: 'SCADA Dispatch Video Wall & Network Telemetry',
        captionFr: 'Supervision temps réel du réseau électrique avec synoptiques unifilaires et dispatching.',
        captionEn: 'Real-time grid supervision center with single-line telemetry and automated dispatch.',
        focalPosition: 'center center',
      },
      {
        id: 'ind-tgbt-panel-mccb',
        url: '/images/homepage_uploads/batch_03_image_014.jpg',
        titleFr: 'Tableau Général Basse Tension (TGBT) & Disjoncteurs',
        titleEn: 'Main LV Switchboard (TGBT) & Breakers',
        captionFr: 'Disjoncteur général boîtier moulé (DPX/MCCB), peignes et disjoncteurs modulaires divisionnaires.',
        captionEn: 'Molded-case circuit breaker, busbar combs, and modular miniature circuit breakers.',
        focalPosition: 'center center',
      },
    ],
  },
];
