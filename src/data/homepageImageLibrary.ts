// src/data/homepageImageLibrary.ts
// EPEDE 2.0 Centralized Electrical Engineering Photograph Library
// Integrated with 100% authentic user-uploaded photographs.

export interface EngineeringPhoto {
  id: string;
  url: string;
  altFr: string;
  altEn: string;
  captionFr: string;
  captionEn: string;
  domainCode: string;
  domainName: string;
  infrastructureType: string;
}

export const HOMEPAGE_IMAGE_LIBRARY: Record<string, EngineeringPhoto[]> = {
  // 1. POWER GENERATION (Centrales thermiques, parcs éoliens, barrages)
  generation: [
    {
      id: 'gen-thermal-complex',
      url: '/images/homepage_uploads/batch_04_image_017.jpg',
      altFr: 'Centrale thermique de production d’électricité avec tours de refroidissement et cheminée',
      altEn: 'Thermal power generation plant with natural-draft cooling towers and smokestack',
      captionFr: 'Centrale thermique convertissant l’énergie de vapeur en puissance électrique 50 Hz.',
      captionEn: 'Thermal power station generating synchronized 50 Hz power via high-pressure steam turbines.',
      domainCode: 'D01',
      domainName: 'Power Generation',
      infrastructureType: 'Thermal Power Plant',
    },
    {
      id: 'gen-wind-farm-aerial',
      url: '/images/homepage_uploads/batch_06_image_027.jpg',
      altFr: 'Vue aérienne zénithale d’un vaste parc éolien connecté au réseau électrique',
      altEn: 'Expansive aerial landscape of utility wind turbine farm connected to electrical grid',
      captionFr: 'Aérogénérateurs de grande puissance convertissant l’énergie cinétique du vent.',
      captionEn: 'Utility-scale wind turbines generating renewable power through 33 kV collector networks.',
      domainCode: 'D01',
      domainName: 'Power Generation',
      infrastructureType: 'Wind Turbine Power Farm',
    },
  ],

  // 2. POWER TRANSMISSION & OVERHEAD LINES (Lignes 225 kV / 400 kV, Pylônes treillis)
  transmission: [
    {
      id: 'trans-corridor-pylons',
      url: '/images/homepage_uploads/batch_02_image_008.jpg',
      altFr: 'Corridor de transport très haute tension avec pylônes treillis métalliques sous ciel bleu',
      altEn: 'High-voltage overhead transmission corridor with steel lattice towers against blue sky',
      captionFr: 'Lignes de transport très haute tension assurant l’évacuation massive d’énergie sur de longues distances.',
      captionEn: 'Extra-high voltage overhead lines transmitting bulk gigawatts across regional interconnectors.',
      domainCode: 'D03',
      domainName: 'Power Transmission',
      infrastructureType: 'EHV Transmission Line Corridor',
    },
  ],

  // 3. SUBSTATIONS & DISTRIBUTION (Postes HTB/HTA, Transformateurs, Travées AIS)
  substations: [
    {
      id: 'sub-ais-panoramic',
      url: '/images/homepage_uploads/batch_02_image_010.jpg',
      altFr: 'Poste électrique ouvert AIS avec portiques d’arrivée de lignes et travées de transformation',
      altEn: 'Outdoor air-insulated substation (AIS) with gantry arrival bays and transformers',
      captionFr: 'Poste source d’interconnexion assurant l’abaissement de tension et l’aiguillage du réseau.',
      captionEn: 'Interconnected substation routing high-voltage power toward regional distribution networks.',
      domainCode: 'D04',
      domainName: 'Substations & Equipment',
      infrastructureType: 'AIS Substation Switchyard',
    },
    {
      id: 'sub-night-floodlight',
      url: '/images/homepage_uploads/batch_06_image_028.jpg',
      altFr: 'Poste de transformation haute tension éclairé de nuit avec transformateurs de puissance',
      altEn: 'High-voltage transformer switchyard at night illuminated by security floodlights',
      captionFr: 'Travées de transformation HTB/HTA avec disjoncteurs et transformateurs sous surveillance continue.',
      captionEn: 'Substation power transformer bays and disconnectors under 24/7 continuous operation.',
      domainCode: 'D04',
      domainName: 'Substations & Equipment',
      infrastructureType: 'Substation at Night',
    },
  ],

  // 4. INDUSTRIAL ELECTRICAL INSTALLATIONS (TGBT, Armoires d'Automatisme, Cellules)
  industrial: [
    {
      id: 'ind-switchgear-lineup',
      url: '/images/homepage_uploads/batch_05_image_024.jpg',
      altFr: 'Rame de cellules de distribution électrique industrielle avec relais de protection numériques',
      altEn: 'Modern industrial switchgear cubicle lineup with digital relays and overhead cable trays',
      captionFr: 'Tableau Général Basse Tension (TGBT) Forme 4b assurant l’alimentation sécurisée des usines.',
      captionEn: 'Form-4b low-voltage industrial switchboard protecting factory circuits and motor loads.',
      domainCode: 'D06',
      domainName: 'Industrial Installations',
      infrastructureType: 'Industrial Switchgear & TGBT',
    },
    {
      id: 'ind-workshop-cabinet',
      url: '/images/homepage_uploads/batch_03_image_013.jpg',
      altFr: 'Armoire électrique d’automatisme avec automate Siemens LOGO, disjoncteurs et borniers',
      altEn: 'Industrial control cabinet with Siemens LOGO! PLC, modular breakers and terminal blocks',
      captionFr: 'Platine de contrôle et relayage avec automate programmable et goulottes de câblage.',
      captionEn: 'Industrial automation control panel integrating programmable logic and safety circuits.',
      domainCode: 'D06',
      domainName: 'Industrial Installations',
      infrastructureType: 'Automation & PLC Cabinet',
    },
  ],

  // 5. SCADA & AUTOMATION DISPATCHING
  automationScada: [
    {
      id: 'scada-control-console',
      url: '/images/homepage_uploads/batch_05_image_021.jpg',
      altFr: 'Poste opérateur SCADA avec double écran de supervision et synoptique de réseau en arrière-plan',
      altEn: 'SCADA operator dispatching workstation with dual monitors and grid mimic wall',
      captionFr: 'Supervision temps réel des paramètres de tension, fréquence et déclenchements de disjoncteurs.',
      captionEn: 'Real-time telemetry workstation monitoring grid frequency, bus voltage, and breaker trips.',
      domainCode: 'D07',
      domainName: 'Industrial Engineering',
      infrastructureType: 'SCADA Control Room',
    },
    {
      id: 'scada-dispatch-video-wall',
      url: '/images/homepage_uploads/batch_06_image_026.jpg',
      altFr: 'Centre de téléconduite et dispatching avec mur d’écrans haute résolution affichant les unifilaires',
      altEn: 'National dispatching center featuring vertical LCD video wall displaying single-line telemetry',
      captionFr: 'Centre de conduite du réseau national surveillant l’équilibre production-consommation.',
      captionEn: 'National grid dispatching center balancing generation and transmission in real time.',
      domainCode: 'D07',
      domainName: 'Industrial Engineering',
      infrastructureType: 'SCADA Dispatch Video Wall',
    },
  ],
};

// Aliases for comprehensive domain compatibility across all sections
HOMEPAGE_IMAGE_LIBRARY.installations = HOMEPAGE_IMAGE_LIBRARY.industrial;
HOMEPAGE_IMAGE_LIBRARY.distribution = HOMEPAGE_IMAGE_LIBRARY.substations;
HOMEPAGE_IMAGE_LIBRARY.transformers = HOMEPAGE_IMAGE_LIBRARY.substations;
HOMEPAGE_IMAGE_LIBRARY.protection = HOMEPAGE_IMAGE_LIBRARY.industrial;

// Reusable helper to get photos for a given domain
export const getPhotosForDomain = (domain: string): EngineeringPhoto[] => {
  return HOMEPAGE_IMAGE_LIBRARY[domain] || HOMEPAGE_IMAGE_LIBRARY.generation;
};

// Flattened list of all verified photographs
export const ALL_VERIFIED_ELECTRICAL_PHOTOS: EngineeringPhoto[] = [
  ...HOMEPAGE_IMAGE_LIBRARY.generation,
  ...HOMEPAGE_IMAGE_LIBRARY.transmission,
  ...HOMEPAGE_IMAGE_LIBRARY.substations,
  ...HOMEPAGE_IMAGE_LIBRARY.industrial,
  ...HOMEPAGE_IMAGE_LIBRARY.automationScada,
];
