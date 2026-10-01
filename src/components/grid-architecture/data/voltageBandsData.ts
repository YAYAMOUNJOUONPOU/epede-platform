// src/components/grid-architecture/data/voltageBandsData.ts
// EPEDE - Voltage Bands Definition and Transformation Physics

import { VoltageBandInfo } from '../types';

export const VOLTAGE_BANDS_DATA: VoltageBandInfo[] = [
  {
    band: 'EHV',
    name: { fr: 'Très Haute Tension (THT / EHV)', en: 'Extra-High Voltage (EHV / HTB-2)' },
    nominalRange: '225 kV à 400 kV (jusqu\'à 765 kV / 1100 kV)',
    representativeLevels: ['225 kV', '330 kV', '400 kV', '500 kV', '765 kV'],
    cameroonGridLevels: ['225 kV (Réseau Interconnecté Sud - RIS & Dorsale Nachtigal)'],
    purpose: {
      fr: 'Évacuation des grands barrages hydroélectriques et transport d\'énergie en vrac interrégional et transfrontalier.',
      en: 'Bulk power evacuation from mega hydroelectric dams and long-distance interregional/transboundary power wheeling.'
    },
    whyUsed: {
      fr: 'En multipliant la tension par 20.45 (de 11 kV à 225 kV), le courant est divisé par 20.45. Les pertes Joule (3·R·I²) sont divisées par le carré de ce ratio, soit un facteur 418 ! Cela permet d\'utiliser des conducteurs de section raisonnable.',
      en: 'Stepping up voltage by 20.45 (from 11 kV to 225 kV) reduces current by 20.45. Joule line losses (3·R·I²) are reduced by the square of this ratio—a factor of 418! This allows economical conductor sizes.'
    },
    insulationDistanceAir: 'Phase-Phase : 2200 mm | Phase-Masse : 1900 mm (Tenue aux chocs de foudre BIL = 1050 kV)',
    typicalEarthing: {
      fr: 'Neutre directement mis à la terre (Solidly Earthed) pour limiter les surtensions temporaires à fréquence industrielle.',
      en: 'Solidly grounded neutral to clamp temporary power-frequency overvoltages during line-to-earth faults.'
    },
    advantages: {
      fr: [
        'Pertes de transport minimes (< 2.5% sur 300 km)',
        'Forte capacité de transit unitaire (250 à 600 MW par terne)',
        'Possibilité de franchir de très grandes distances (200 à 800 km)'
      ],
      en: [
        'Minimal transmission losses (< 2.5% over 300 km)',
        'Massive per-circuit transfer capability (250 to 600 MW)',
        'Ability to span long continental distances (200 to 800 km)'
      ]
    },
    limitations: {
      fr: [
        'Coût d\'investissement en matériel et pylônes très élevé',
        'Emprise au sol importante (bande de servitude de 40 m à 60 m)',
        'Sensibilité à la foudre et besoin d\'un câble de garde OPGW'
      ],
      en: [
        'High capital cost for switchgear, transformers, and lattice towers',
        'Large right-of-way corridor requirement (40 to 60 meters)',
        'Vulnerability to lightning requiring continuous OPGW shielding'
      ]
    },
    protectionPhilosophy: {
      fr: 'Double protection différentielle de ligne 87L ultra-rapide (< 20 ms) sur fibre optique avec protection de secours de distance 21/21N.',
      en: 'Dual redundant optical 87L line current differential (< 20 ms) with quadrilateral distance 21/21N backup.'
    },
    keyEquipment: [
      'Disjoncteur 225 kV SF6',
      'Pylônes métalliques treillis',
      'Câble de garde OPGW',
      'Transformateur GSU 11/225 kV'
    ],
    upstreamRelationship: {
      fr: 'Alimenté par les alternateurs des grandes centrales via les transformateurs élévateurs GSU.',
      en: 'Fed directly from central generation plants via Generator Step-Up transformers.'
    },
    downstreamRelationship: {
      fr: 'Alimente les postes de transport et transformateurs réducteurs 225/90 kV et 225/30 kV.',
      en: 'Feeds transmission bulk substations and 225/90 kV and 225/30 kV step-down autotransformers.'
    }
  },
  {
    id: 'HV',
    band: 'HV',
    name: { fr: 'Haute Tension (HT / HV / HTB-1)', en: 'High Voltage (HV / Sub-Transmission)' },
    nominalRange: '60 kV à 150 kV',
    representativeLevels: ['60 kV', '66 kV', '90 kV', '110 kV', '132 kV'],
    cameroonGridLevels: ['90 kV (Sous-réseau de répartition du RIS : Édéa-Douala, Yaoundé-Mbalmayo, et réseau du Nord - RIN)'],
    purpose: {
      fr: 'Sous-transport régional, répartition vers les ceintures urbaines et alimentation des très gros clients industriels (ex: cimenteries, aciéries).',
      en: 'Regional sub-transmission, metropolitan perimeter loops, and direct supply to heavy industrial consumers.'
    },
    whyUsed: {
      fr: 'Offre un compromis optimal coût/puissance pour alimenter des agglomérations distantes de 30 à 100 km sans le coût disproportionné des postes 225 kV.',
      en: 'Provides the optimal balance of power capacity and infrastructure cost for regional transmission (30 to 100 km spans).'
    },
    insulationDistanceAir: 'Phase-Phase : 1100 mm | Phase-Masse : 900 mm (BIL = 450 kV à 90 kV)',
    typicalEarthing: {
      fr: 'Neutre directement mis à la terre ou mis à la terre par impédance limitatrice.',
      en: 'Solidly grounded or low-impedance grounded neutral.'
    },
    advantages: {
      fr: [
        'Coût d\'équipement plus abordable que le 225 kV',
        'Pylônes et supports plus légers, emprise réduite (25 m)',
        'Facilité d\'insertion dans les zones périurbaines'
      ],
      en: [
        'Substantially lower equipment cost than 225 kV',
        'Lighter steel towers/monopoles, narrower 25 m corridor',
        'Flexible integration around rapidly growing urban perimeters'
      ]
    },
    limitations: {
      fr: [
        'Capacité de transit unitaire limitée à 60 - 120 MW',
        'Pertes Joule plus élevées qu\'à 225 kV sur longues distances'
      ],
      en: [
        'Power carrying capacity capped at 60 - 120 MW per circuit',
        'Higher line losses if operated over distances exceeding 100 km'
      ]
    },
    protectionPhilosophy: {
      fr: 'Protection de distance numérique 21 à 4 zones avec téléaction et protection terre résistante 67N.',
      en: 'Numerical 4-zone distance protection 21 with teleprotection signaling and directional earth-fault 67N.'
    },
    keyEquipment: [
      'Disjoncteur 90 kV SF6',
      'Pylônes monopôles ou treillis',
      'Transformateur abaisseur 90/15 kV ou 90/30 kV',
      'Sectionneurs rotatifs 90 kV'
    ],
    upstreamRelationship: {
      fr: 'Alimenté par le réseau 225 kV via autotransformateurs ou centrales thermiques/hydro de taille moyenne.',
      en: 'Stepped down from 225 kV grid via autotransformers, or fed directly by mid-sized hydro/thermal plants.'
    },
    downstreamRelationship: {
      fr: 'Alimente les postes de répartition urbains abaisseurs 90 kV / 15 kV ou 30 kV.',
      en: 'Steps down to 15 kV or 30 kV at primary distribution source substations.'
    }
  },
  {
    id: 'MV',
    band: 'MV',
    name: { fr: 'Moyenne Tension (MT / MV / HTA)', en: 'Medium Voltage (MV / Primary Distribution)' },
    nominalRange: '1 kV à 36 kV (standard CEI > 1 kV et ≤ 35 kV)',
    representativeLevels: ['11 kV', '15 kV', '20 kV', '22 kV', '30 kV', '33 kV'],
    cameroonGridLevels: ['30 kV (Standard national de distribution Eneo) · 15 kV (Anciens réseaux urbains en cours de standardisation)'],
    purpose: {
      fr: 'Distribution primaire d\'électricité alimentant les quartiers, les hôpitaux, les campus et les postes MT/BT de distribution.',
      en: 'Primary distribution conveying power into municipal neighborhoods, university campuses, and localized distribution kiosks.'
    },
    whyUsed: {
      fr: 'Permet de transporter des puissances de 5 à 20 MW sur des rayons de 10 à 30 km tout en restant manipulable dans des cellules modulaires intérieures compactes.',
      en: 'Carries 5 to 20 MW over 10 to 30 km radii while fitting safely within compact indoor modular switchgear.'
    },
    insulationDistanceAir: 'Phase-Phase : 280 mm | Phase-Masse : 220 mm à 30 kV (Assignée 36 kV, BIL = 170 kV)',
    typicalEarthing: {
      fr: 'Neutre mis à la terre par résistance limitatrice (R_N limitant le courant de défaut de terre à 300 A ou 1000 A) ou bobine de Petersen.',
      en: 'Resistance grounded neutral (limiting single phase-to-ground fault current to 300 A - 1000 A) or resonant Petersen coil.'
    },
    advantages: {
      fr: [
        'Équipements compacts sous enveloppe métallique blindée (AIS/GIS)',
        'Excellente tenue en milieu urbain sous forme de câbles souterrains',
        'Standardisation industrielle des cellules et transformateurs'
      ],
      en: [
        'Compact modular metal-enclosed cubicles',
        'Ideal for underground cable networks in dense urban sectors',
        'High industrial standardisation of equipment (RMU, transformers)'
      ]
    },
    limitations: {
      fr: [
        'Portée limitée à quelques dizaines de kilomètres en raison de la chute de tension',
        'Nécessite des milliers de postes réducteurs MT/BT'
      ],
      en: [
        'Transmission reach capped at tens of kilometers by voltage drop',
        'Requires thousands of localized step-down transformer units'
      ]
    },
    protectionPhilosophy: {
      fr: 'Protection à maximum de courant de phase 50/51 à temps inverse et terre 50N/51N avec coordination sélective ampèremétrique et chronométrique.',
      en: 'Time-overcurrent 50/51 and earth-fault 50N/51N with strict current and time grading coordination.'
    },
    keyEquipment: [
      'Cellules modulaires MT 30 kV',
      'Tableaux compacts Ring Main Unit (RMU)',
      'Transformateurs MT/BT 630 kVA',
      'Câbles unipolaires XLPE 30 kV'
    ],
    upstreamRelationship: {
      fr: 'Alimenté par les postes sources de transport (225/30 kV ou 90/30 kV).',
      en: 'Supplied by bulk transmission substations (225/30 kV or 90/30 kV).'
    },
    downstreamRelationship: {
      fr: 'Alimente les transformateurs de distribution MT/BT (30 kV / 400 V).',
      en: 'Supplies thousands of local distribution transformers (30 kV / 400 V).'
    }
  },
  {
    id: 'LV',
    band: 'LV',
    name: { fr: 'Basse Tension (BT / LV / BTA)', en: 'Low Voltage (LV / Utilization)' },
    nominalRange: '50 V à 1000 V AC (standard CEI)',
    representativeLevels: ['120 V / 208 V (Amérique du Nord)', '230 V / 400 V (Europe, Afrique, Asie)', '690 V (Moteurs industriels lourds)'],
    cameroonGridLevels: ['400 V triphasé entre phases · 230 V monophasé entre phase et neutre · Fréquence 50 Hz'],
    purpose: {
      fr: 'Distribution terminale et utilisation finale sécurisée par les usagers industriels, tertiaires et résidentiels.',
      en: 'Final terminal distribution and safe direct consumption by homes, commercial offices, and factories.'
    },
    whyUsed: {
      fr: 'Niveau de tension choisi pour des impératifs absolus de sécurité des personnes (tension de contact) et compatibilité avec les moteurs, appareils et électroniques.',
      en: 'Calibrated specifically for life-safety constraints (touch voltage limits) and direct consumer appliance compatibility.'
    },
    insulationDistanceAir: 'Phase-Phase : 14 mm | Phase-Masse : 10 mm (Tenue aux chocs 4 kV)',
    typicalEarthing: {
      fr: 'Régimes de neutre selon CEI 60364 / NF C 15-100 : TT (majoritaire résidentiel), TN-S / TN-C (industrie/tertiaire), IT (hôpitaux, industries à continuité critique).',
      en: 'Earthing regimes per IEC 60364: TT (predominant residential), TN-S / TN-C (commercial/industrial), IT (hospitals, continuous processes).'
    },
    advantages: {
      fr: [
        'Sécurité accrue pour les usagers finaux',
        'Appareillage de coupure modulaire miniature accessible (disjoncteurs magnéto-thermiques)',
        'Alimentation directe des équipements sans transformateur dédié'
      ],
      en: [
        'Enhanced life-safety for everyday human interaction',
        'Economical miniature modular circuit breakers (MCBs/RCDs)',
        'Direct connection to standard electrical consumer goods'
      ]
    },
    limitations: {
      fr: [
        'Pertes Joule très élevées si les longueurs dépassent 300 à 500 m',
        'Chute de tension rapide nécessitant de fortes sections de câbles cuivre ou alu'
      ],
      en: [
        'Severe Joule losses if feeder lengths exceed 300 to 500 meters',
        'Rapid voltage drop dictating large conductor cross-sections'
      ]
    },
    protectionPhilosophy: {
      fr: 'Disjoncteurs magnéto-thermiques modulaires (courbes B, C, D) et dispositifs différentiels à courant résiduel (DDR 30 mA) pour protection contre les chocs électriques.',
      en: 'Thermal-magnetic miniature circuit breakers and 30 mA residual current devices (RCDs) for indirect touch protection.'
    },
    keyEquipment: [
      'Tableau Général Basse Tension (TGBT)',
      'Disjoncteur général de branchement',
      'Compteur d\'énergie communicant',
      'Disjoncteurs divisionnaires et DDR 30 mA'
    ],
    upstreamRelationship: {
      fr: 'Alimenté par les transformateurs de distribution MT/BT de quartier.',
      en: 'Supplied by localized MV/LV distribution transformers.'
    },
    downstreamRelationship: {
      fr: 'Alimente les appareils terminaux (moteurs, climatiseurs, luminaires, ordinateurs).',
      en: 'Powers end-use appliances (motors, lighting, heaters, electronics).'
    }
  }
];
