// src/data/cinematicSlidesData.ts
// EPEDE 2.0 — Verified Authentic Electrical Infrastructure Slide Data for Hero Section
// Visually inspected and verified authentic electrical power engineering photographs.

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
  // SLIDE 01: POWER GENERATION (Hydro Dams, Spillways, Solar, Wind)
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
        id: 'gen-dam-spillway-active',
        url: 'https://images.unsplash.com/photo-1761925556918-98d1d1adba03?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Barrage Hydroélectrique & Évacuateur de Crues',
        titleEn: 'Hydroelectric Dam & Active Spillway',
        captionFr: 'Évacuateur de crues déversant la puissance hydraulique du fleuve vers la centrale.',
        captionEn: 'Concrete spillway releasing high-velocity river head to drive hydraulic turbine generators.',
        focalPosition: 'center center',
      },
      {
        id: 'gen-dam-aerial-reservoir',
        url: 'https://images.unsplash.com/photo-1560279966-2d681f3d4dfc?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Vue Aérienne du Barrage-Poids & Retenue',
        titleEn: 'Gravity Dam & Water Reservoir Aerial',
        captionFr: 'Retenue d’eau et usine hydroélectrique en pied de barrage assurant le réglage primaire de fréquence.',
        captionEn: 'Aerial reservoir view and base powerhouse providing primary grid frequency regulation.',
        focalPosition: 'center center',
      },
      {
        id: 'gen-dam-stepup-switchyard',
        url: 'https://images.unsplash.com/photo-1774184972465-d0646b5af437?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Aménagement Hydroélectrique & Poste Élévateur',
        titleEn: 'Hydro Facility & Step-Up Switchyard',
        captionFr: 'Centrale hydroélectrique de grande échelle avec poste élévateur HTA/HTB.',
        captionEn: 'Large-scale hydro plant coupled to generation step-up transformers and outgoing lines.',
        focalPosition: 'center center',
      },
      {
        id: 'gen-solar-pv-utility',
        url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Centrale Solaire Photovoltaïque Utility-Scale',
        titleEn: 'Utility-Scale Solar PV Array',
        captionFr: 'Parc photovoltaïque 1500 V DC avec onduleurs centraux et poste élévateur HTA.',
        captionEn: '1500 V DC solar PV array with central inverters feeding high-voltage collector lines.',
        focalPosition: 'center bottom',
      },
      {
        id: 'gen-wind-turbines-sunset',
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Parc Éolien Raccordé au Réseau',
        titleEn: 'Grid-Connected Wind Turbine Farm',
        captionFr: 'Aérogénérateurs avec génératrices asynchrones à double alimentation (DFIG) en 33 kV.',
        captionEn: 'Utility wind turbine farm feeding synchronized power through 33 kV collector networks.',
        focalPosition: 'center center',
      },
    ],
  },

  // SLIDE 02: POWER TRANSMISSION (225 kV & 400 kV Steel Lattice Pylons)
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
        id: 'trans-lattice-tower-blue',
        url: 'https://images.unsplash.com/photo-1779636870368-43cbc556ef14?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Pylône Treillis 225/400 kV & Faisceaux',
        titleEn: 'Double-Circuit EHV Lattice Transmission Tower',
        captionFr: 'Pylône acier double terne avec faisceaux de 2 conducteurs par phase et chaînes d’isolateurs.',
        captionEn: 'Double-circuit steel lattice tower with bundle conductors and suspension insulator strings.',
        focalPosition: 'center center',
      },
      {
        id: 'trans-corridor-sunset',
        url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Corridor Haute Tension au Coucher du Soleil',
        titleEn: 'Transmission Line Corridor at Sunset',
        captionFr: 'Alignement de pylônes haute tension assurant le transit massif d’énergie entre régions.',
        captionEn: 'High-voltage line corridor transmitting bulk power across regional interconnectors.',
        focalPosition: 'center center',
      },
      {
        id: 'trans-guyed-v-field',
        url: 'https://images.unsplash.com/photo-1783786988313-488082b84000?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Pylône Haubané & Conducteurs Aériens',
        titleEn: 'Guyed-V High-Voltage Transmission Tower',
        captionFr: 'Structure de pilonnage optimisée pour les grandes portées à travers plaines et savanes.',
        captionEn: 'Guyed-V tower carrying high-voltage conductors over long spans across open terrain.',
        focalPosition: 'center center',
      },
      {
        id: 'trans-pylon-overlook',
        url: 'https://images.unsplash.com/photo-1592152287815-1e3d73630734?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Pylône Haute Tension en Surplomb de Vallée',
        titleEn: 'High-Voltage Lattice Pylon Overlooking Valley',
        captionFr: 'Ouvrage de transport haute tension franchissant des zones géographiques accidentées.',
        captionEn: 'High-voltage pylon crossing rugged mountainous terrain with high clearance.',
        focalPosition: 'center center',
      },
    ],
  },

  // SLIDE 03: SUBSTATIONS & DISTRIBUTION (AIS Switchyard, SF6 Breakers, Transformers)
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
        id: 'sub-sf6-dead-tank-breakers',
        url: 'https://images.unsplash.com/photo-1780396140802-52309c205050?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Poste Ouvert AIS & Disjoncteurs SF6',
        titleEn: 'Air-Insulated Substation & SF6 Circuit Breakers',
        captionFr: 'Disjoncteurs haute tension SF6 dead-tank avec traversées et transformateurs de puissance.',
        captionEn: 'High-voltage SF6 dead-tank circuit breakers with heavy porcelain bushings and transformers.',
        focalPosition: 'center center',
      },
      {
        id: 'sub-power-transformer-heavy',
        url: 'https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Transformateur de Puissance & Radiateurs',
        titleEn: 'Step-Down Power Transformer Unit',
        captionFr: 'Transformateur triphasé HTB/HTA avec conservateur d’huile, régleur en charge et parafoudres.',
        captionEn: 'Three-phase step-down power transformer unit with radiator banks, oil conservator and surge arresters.',
        focalPosition: 'center center',
      },
      {
        id: 'sub-distribution-gantry',
        url: 'https://images.unsplash.com/photo-1693013112835-5f3128bb555f?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Portique & Travées de Poste de Répartition',
        titleEn: 'Substation Gantry & Distribution Bays',
        captionFr: 'Portique d’arrivée haute tension, sectionneurs d’aiguillage et départs moyenne tension.',
        captionEn: 'High-voltage arrival gantry, busbar disconnectors, and medium-voltage distribution feeders.',
        focalPosition: 'center center',
      },
    ],
  },

  // SLIDE 04: INDUSTRIAL ELECTRICAL ENGINEERING & DISTRIBUTION PANELS (TGBT, Breakers, Automation)
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
        id: 'ind-panel-abb-breakers',
        url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Tableau Basse Tension & Disjoncteurs Modulaires ABB',
        titleEn: 'Industrial Low-Voltage Panel & ABB Breakers',
        captionFr: 'Armoire électrique industrielle équipée de disjoncteurs magnétothermiques modulaires et borniers.',
        captionEn: 'Industrial distribution panel with DIN-rail miniature circuit breakers and color-coded control wiring.',
        focalPosition: 'center center',
      },
      {
        id: 'ind-distribution-board-mcb',
        url: 'https://images.unsplash.com/photo-1576446470246-499c738d1c8e?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Coffret Électrique & Peignes de Raccordement',
        titleEn: 'Modular Distribution Board with MCBs',
        captionFr: 'Armoire de distribution terminale conforme CEI 61439 avec disjoncteurs divisionnaires.',
        captionEn: 'Terminal distribution board compliant with IEC 61439 with miniature circuit breakers and neutral busbar.',
        focalPosition: 'center center',
      },
      {
        id: 'ind-automation-plc-rack',
        url: 'https://images.unsplash.com/photo-1783419752280-46a2073ef7dc?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Baie d’Automatisme PLC & Relais de Protection',
        titleEn: 'Industrial Automation PLC & Relay Rack',
        captionFr: 'Châssis d’automatisme industriel assurant le contrôle-commande, le verrouillage et la télégestion.',
        captionEn: 'Industrial automation rack managing interlocking logic, protection signaling, and remote SCADA telemetry.',
        focalPosition: 'center center',
      },
      {
        id: 'ind-electrician-commissioning',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=2000&q=85',
        titleFr: 'Essais de Mise en Service & Qualification Électrique',
        titleEn: 'Electrical Testing & Switchgear Commissioning',
        captionFr: 'Ingénieur électrotechnicien en équipement de sécurité effectuant les essais de déclenchement.',
        captionEn: 'Electrical technician in safety helmet and gloves verifying trip settings on switchgear equipment.',
        focalPosition: 'center center',
      },
    ],
  },
];

