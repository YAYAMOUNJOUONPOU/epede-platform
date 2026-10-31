// src/data/canonicalPowerChain.ts
// EPEDE Canonical Electrical Power Chain: Generation to Final Loads (Task T-104)

import type { StageId } from '../components/journey/types';

export interface CanonicalPowerStage {
  id: string;
  stageNumber: string;
  stageKey:
    | 'generation'
    | 'step-up'
    | 'transmission'
    | 'primary-substation'
    | 'mv-distribution'
    | 'secondary-substation'
    | 'tgbt-installations'
    | 'motor-control'
    | 'final-loads';
  journeyStageId: StageId;
  domainCode: string;
  voltage: string;
  title: { fr: string; en: string };
  shortTitle: { fr: string; en: string };
  physicalPrinciple: { fr: string; en: string };
  purpose: { fr: string; en: string };
  keyEquipment: string[];
  cameroonContext: { fr: string; en: string };
  imageUrl: string;
  upstreamStageId?: string;
  downstreamStageId?: string;
}

export const CANONICAL_POWER_STAGES: CanonicalPowerStage[] = [
  {
    id: 'stage-01',
    stageNumber: '01',
    stageKey: 'generation',
    journeyStageId: 'generation',
    domainCode: 'D01',
    voltage: '10.3 kV – 15.5 kV',
    title: { fr: 'Production d’Électricité', en: 'Power Generation' },
    shortTitle: { fr: 'Production', en: 'Generation' },
    physicalPrinciple: {
      fr: 'Conversion d’énergie primaire (chute d’eau, gaz, solaire, vent) en courant alternatif triphasé 50 Hz par induction électromagnétique dans les alternateurs synchrones.',
      en: 'Conversion of primary energy (falling water, natural gas, solar, wind) into three-phase 50 Hz alternating current via electromagnetic induction in synchronous alternators.',
    },
    purpose: {
      fr: 'Injecter en continu la puissance active (MW) et réactive (MVAR) nécessaire à la stabilité dynamique du réseau.',
      en: 'Continuously inject active power (MW) and reactive power (MVAR) required for real-time grid stability.',
    },
    keyEquipment: ['Francis Turbines', 'Synchronous Alternators', 'Static Exciters', 'AVR Regulators', 'Step-up Transformers'],
    cameroonContext: {
      fr: 'Song Loulou (384 MW, 8 groupes), Nachtigal (420 MW, 7 groupes), Edéa (276 MW), Memve’ele (211 MW), Lagdo (72 MW RIN), Kribi Gaz (216 MW).',
      en: 'Song Loulou (384 MW, 8 units), Nachtigal (420 MW, 7 units), Edéa (276 MW), Memve’ele (211 MW), Lagdo (72 MW RIN), Kribi Gas (216 MW).',
    },
    imageUrl: '/images/homepage_uploads/batch_01_image_005.jpg',
    downstreamStageId: 'stage-02',
  },
  {
    id: 'stage-02',
    stageNumber: '02',
    stageKey: 'step-up',
    journeyStageId: 'switchyard',
    domainCode: 'D04',
    voltage: '11 kV → 225 kV',
    title: { fr: 'Poste Élévateur de Centrale', en: 'Generator Step-Up Substation' },
    shortTitle: { fr: 'Élévation', en: 'Step-Up' },
    physicalPrinciple: {
      fr: 'Élévation de la tension pour diviser le courant d’un facteur ~15 à 20 (P = √3·U·I·cosφ). Les pertes par effet Joule (RI²) dans les lignes sont divisées par plus de 200.',
      en: 'Voltage step-up reduces current by a factor of ~15 to 20 (P = √3·U·I·cosφ), dividing line I²R heat losses by more than 200.',
    },
    purpose: {
      fr: 'Adapter la tension des alternateurs au réseau de grand transport sans échauffement prohibitif des conducteurs.',
      en: 'Adapt alternator voltage to bulk transmission corridors without excessive thermal conductor losses.',
    },
    keyEquipment: ['GSU Transformers (Dyn11 / YNd11)', 'SF6 Circuit Breakers', 'Surge Arresters', 'Disconnectors'],
    cameroonContext: {
      fr: 'Postes évacuateurs 225 kV de Nachtigal, Song Loulou, Edéa et Nyabizan (Memve’ele).',
      en: '225 kV generator step-up substations at Nachtigal, Song Loulou, Edéa, and Nyabizan (Memve’ele).',
    },
    imageUrl: '/images/homepage_uploads/batch_04_image_016.jpg',
    upstreamStageId: 'stage-01',
    downstreamStageId: 'stage-03',
  },
  {
    id: 'stage-03',
    stageNumber: '03',
    stageKey: 'transmission',
    journeyStageId: 'transmission',
    domainCode: 'D03',
    voltage: '225 kV / 90 kV',
    title: { fr: 'Réseau de Transport Haute Tension', en: 'High-Voltage Transmission Network' },
    shortTitle: { fr: 'Transport HT', en: 'HV Transmission' },
    physicalPrinciple: {
      fr: 'Acheminement de l’énergie sur des centaines de kilomètres via des faisceaux de conducteurs suspendus sur pylônes métalliques treillis avec câble de garde optique (OPGW).',
      en: 'Long-distance bulk energy transmission across hundreds of kilometers via bundled conductors suspended on steel lattice towers with OPGW shield wire.',
    },
    purpose: {
      fr: 'Relier les grands centres de production isolés aux métropoles de consommation avec un rendement supérieur à 97%.',
      en: 'Interconnect remote generation hubs with consumption metropolises at transmission efficiency exceeding 97%.',
    },
    keyEquipment: ['Steel Lattice Towers', 'ACSR / Aster Conductors', 'Composite Insulators', 'OPGW Cable', 'Corona Rings'],
    cameroonContext: {
      fr: 'Artères 225 kV SONATREL : Song Loulou – Bekoko (Douala), Song Loulou – Mangombe – Oyomabang (Yaoundé), et Nachtigal – Nyom II.',
      en: 'SONATREL 225 kV transmission corridors: Song Loulou – Bekoko (Douala), Song Loulou – Mangombe – Oyomabang (Yaoundé), Nachtigal – Nyom II.',
    },
    imageUrl: '/images/homepage_uploads/batch_02_image_008.jpg',
    upstreamStageId: 'stage-02',
    downstreamStageId: 'stage-04',
  },
  {
    id: 'stage-04',
    stageNumber: '04',
    stageKey: 'primary-substation',
    journeyStageId: 'substation',
    domainCode: 'D04',
    voltage: '225 kV → 30 kV / 15 kV',
    title: { fr: 'Poste Source d’Interconnexion', en: 'Primary Grid Substation' },
    shortTitle: { fr: 'Poste Source', en: 'Primary Substation' },
    physicalPrinciple: {
      fr: 'Abaisser la très haute tension du réseau de transport pour alimenter les réseaux de distribution urbains et industriels, avec sélection et coupure sécurisée.',
      en: 'Step down bulk transmission voltage to feed regional distribution rings, providing busbar sectioning and fault clearance.',
    },
    purpose: {
      fr: 'Fournir le point d’injection principal dans les réseaux de distribution ENEO sous protection différentielle et de distance.',
      en: 'Act as the primary bulk injection node into ENEO distribution networks under distance and differential relay protection.',
    },
    keyEquipment: ['Power Transformers (225/30 kV)', 'SF6 Breakers', 'Bus Couplers', 'Relay Panels (ANSI 21/87T)', '110V DC Batteries'],
    cameroonContext: {
      fr: 'Postes sources stratégiques : Bekoko, Logbaba, Koumassi (Douala) ; Oyomabang, Nyom II, Ahala, Kondengui (Yaoundé).',
      en: 'Key primary grid substations: Bekoko, Logbaba, Koumassi (Douala); Oyomabang, Nyom II, Ahala, Kondengui (Yaoundé).',
    },
    imageUrl: '/images/homepage_uploads/batch_02_image_010.jpg',
    upstreamStageId: 'stage-03',
    downstreamStageId: 'stage-05',
  },
  {
    id: 'stage-05',
    stageNumber: '05',
    stageKey: 'mv-distribution',
    journeyStageId: 'distribution',
    domainCode: 'D05',
    voltage: '30 kV / 15 kV (HTA)',
    title: { fr: 'Réseau de Distribution HTA', en: 'Medium-Voltage (MV) Distribution' },
    shortTitle: { fr: 'Distribution HTA', en: 'MV Distribution' },
    physicalPrinciple: {
      fr: 'Boucles souterraines urbaines en coupure d’artère et départs aériens radiaux ruraux avec cellules modulaires sous SF6 (RMU) et interrupteurs télécommandés.',
      en: 'Urban underground open-ring loops and rural radial overhead feeders utilizing SF6 Ring Main Units (RMU) and automated reclosers.',
    },
    purpose: {
      fr: 'Distribuer l’énergie dans chaque quartier et zone industrielle avec continuité de service par reconfiguration de boucle.',
      en: 'Route medium-voltage power to neighborhoods and industrial zones with ring reconfiguration for continuity of supply.',
    },
    keyEquipment: ['Ring Main Units (RMU - 24 kV/36 kV)', 'XLPE MV Cables', 'Overhead Disconnectors', 'Self-powered Protection Relays'],
    cameroonContext: {
      fr: 'Départs 30 kV et boucles 15 kV ENEO alimentant les agglomérations de Douala, Yaoundé, Bafoussam, Garoua.',
      en: 'ENEO 30 kV feeders and legacy 15 kV loops supplying metropolitan Douala, Yaoundé, Bafoussam, Garoua.',
    },
    imageUrl: '/images/homepage_uploads/batch_02_image_006.jpg',
    upstreamStageId: 'stage-04',
    downstreamStageId: 'stage-06',
  },
  {
    id: 'stage-06',
    stageNumber: '06',
    stageKey: 'secondary-substation',
    journeyStageId: 'distribution',
    domainCode: 'D05',
    voltage: '30 kV → 400 V / 230 V',
    title: { fr: 'Poste de Transformation HTA/BT', en: 'Secondary Substation & H61 Pole' },
    shortTitle: { fr: 'Poste HTA/BT', en: 'Secondary Substation' },
    physicalPrinciple: {
      fr: 'Transformation finale de la moyenne tension (30 kV) en basse tension triphasée (400 V entre phases / 230 V entre phase et neutre) via couplage Dyn11.',
      en: 'Final voltage step-down from MV (30 kV) to three-phase low voltage (400 V line-to-line / 230 V line-to-neutral) via Dyn11 vector group.',
    },
    purpose: {
      fr: 'Alimenter directement les usines, immeubles, ateliers et réseaux d’abonnés domestiques au niveau de tension d’utilisation.',
      en: 'Feed factories, commercial facilities, and residential consumers directly at standard utilization voltage.',
    },
    keyEquipment: ['H61 Pole Transformers (50-160 kVA)', 'Pad-mount Transformers (250-1600 kVA)', 'Drop-out Fuse Cutouts', 'LV Fuseboards'],
    cameroonContext: {
      fr: 'Poteaux béton/bois H61 de quartier et postes cabines maçonnés industriels implantés sur l’ensemble du territoire.',
      en: 'Neighborhood H61 pole-mounted transformers and industrial indoor secondary substations nationwide.',
    },
    imageUrl: '/images/homepage_uploads/batch_01_image_004.jpg',
    upstreamStageId: 'stage-05',
    downstreamStageId: 'stage-07',
  },
  {
    id: 'stage-07',
    stageNumber: '07',
    stageKey: 'tgbt-installations',
    journeyStageId: 'consumption',
    domainCode: 'D06',
    voltage: '400 V / 230 V',
    title: { fr: 'Tableau Général Basse Tension (TGBT)', en: 'Main Low-Voltage Switchboard (TGBT)' },
    shortTitle: { fr: 'TGBT & BT', en: 'Main LV Board' },
    physicalPrinciple: {
      fr: 'Distribution principale de l’énergie au sein des usines et bâtiments avec séparation interne (Formes 1 à 4b CEI 61439-2) et protection sélective par disjoncteurs ouverts (ACB) et boîtiers moulés (MCCB).',
      en: 'Main power distribution inside industrial facilities with internal separation (Forms 1 to 4b per IEC 61439-2) and selective air/molded-case circuit breakers.',
    },
    purpose: {
      fr: 'Sécuriser la distribution de puissance, commuter les sources secourues (groupe électrogène / inverseur ATS) et protéger les départs contre les courts-circuits.',
      en: 'Protect distribution feeders, switch backup generators via Automatic Transfer Switches (ATS), and clear short-circuits selectively.',
    },
    keyEquipment: ['Air Circuit Breakers (ACB)', 'Molded-Case Circuit Breakers (MCCB)', 'Automatic Transfer Switches (ATS)', 'Capacitor Banks'],
    cameroonContext: {
      fr: 'TGBT d’usines agroalimentaires, cimenteries (Dangote, Cimencam), brasseries (SABC) et hôpitaux régionaux.',
      en: 'Main LV switchboards at industrial food plants, cement factories (Cimencam, Dangote), breweries, and hospitals.',
    },
    imageUrl: '/images/homepage_uploads/batch_04_image_016.jpg',
    upstreamStageId: 'stage-06',
    downstreamStageId: 'stage-08',
  },
  {
    id: 'stage-08',
    stageNumber: '08',
    stageKey: 'motor-control',
    journeyStageId: 'consumption',
    domainCode: 'D07',
    voltage: '400 V Triphasé',
    title: { fr: 'Centres de Contrôle Moteur (MCC) & Variateurs', en: 'Motor Control Centers (MCC) & Drives' },
    shortTitle: { fr: 'Contrôle Moteur', en: 'Motor Control' },
    physicalPrinciple: {
      fr: 'Pilotage et démarrage des moteurs asynchrones triphasés par contacteurs, démarreurs progressifs ou variateurs de fréquence (VFD) avec modulation PWM et régulation vectorielle.',
      en: 'Control and starting of three-phase induction motors via contactors, soft starters, or Variable Frequency Drives (VFD) with PWM vector control.',
    },
    purpose: {
      fr: 'Limiter le courant d’appel au démarrage (6 à 8 In en direct contre 1.5 à 2 In avec variateur), réguler la vitesse et protéger thermiquement les bobinages (ANSI 49).',
      en: 'Limit starting current inrush (6-8 In DOL vs 1.5-2 In with VFD), adjust machine speed, and thermally protect motor windings.',
    },
    keyEquipment: ['Vacuum/Air Contactors', 'Thermal Overload Relays (95-96 / 97-98)', 'Variable Frequency Drives (VFD)', 'Harmonic Line Chokes'],
    cameroonContext: {
      fr: 'Pompes d’exhaure, concasseurs, ventilateurs de mines et lignes d’embouteillage industrielles.',
      en: 'Industrial water pumps, quarry crushers, mine ventilation fans, and automated bottling lines.',
    },
    imageUrl: '/images/homepage_uploads/batch_03_image_011.jpg',
    upstreamStageId: 'stage-07',
    downstreamStageId: 'stage-09',
  },
  {
    id: 'stage-09',
    stageNumber: '09',
    stageKey: 'final-loads',
    journeyStageId: 'consumption',
    domainCode: 'D06',
    voltage: '400 V / 230 V',
    title: { fr: 'Récepteurs Finaux & Systèmes Utilisateurs', en: 'Final Electrical Loads & End Use' },
    shortTitle: { fr: 'Récepteurs Finaux', en: 'Final Loads' },
    physicalPrinciple: {
      fr: 'Transformation finale de l’électricité en énergie mécanique (moteurs), thermique (fours, résistances), lumineuse (LED) ou électronique (informatique, redresseurs DC).',
      en: 'Final conversion of electricity into mechanical work (motors), thermal energy (heating), light (LEDs), or DC electronics.',
    },
    purpose: {
      fr: 'Accomplir le travail utile pour lequel l’ensemble du système électrique a été conçu, avec protection différentielle des personnes contre les contacts indirects (RCD 30 mA).',
      en: 'Perform useful industrial and domestic work while protecting personnel against indirect contact shock via 30 mA RCDs.',
    },
    keyEquipment: ['Induction Motors', 'Industrial Furnaces', 'HVAC Compressors', 'Data Center UPS Systems', 'Residual Current Devices (RCD)'],
    cameroonContext: {
      fr: 'Machines d’usines, systèmes d’irrigation agricole, climatisation de grands bâtiments et appareils électroménagers des ménages.',
      en: 'Factory production lines, agricultural irrigation pumps, commercial building HVAC, and residential household appliances.',
    },
    imageUrl: '/images/homepage_uploads/batch_03_image_014.jpg',
    upstreamStageId: 'stage-08',
  },
];
