// src/components/home/HomeView.tsx
// EPEDE 2.0 — Visual & Interactive Electrical Engineering Learning Environment Homepage
// Implements the 8-Section Simplified & Immersive Homepage Architecture

import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Layers,
  ShieldCheck,
  Compass,
  Cpu,
  Activity,
  Factory,
  Wrench,
  Zap,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
  Play,
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { StageId } from '../journey/types';
import { CinematicVernovaHero } from './CinematicVernovaHero';
import { RealCameroonGeographicMap } from '../grid/RealCameroonGeographicMap';
import { DynamicSectionBackground } from '../ui/DynamicSectionBackground';
import { HOMEPAGE_IMAGE_LIBRARY } from '../../data/homepageImageLibrary';

export interface HomeViewProps {
  locale: 'fr' | 'en';
  onSelectDomain: (code: DomainCode) => void;
  onSelectEquipment: (id: string) => void;
  onNavigateView: (view: string) => void;
  onOpenSearch: (query?: string) => void;
  onOpenAssistant: () => void;
  onLocaleChange?: (locale: 'fr' | 'en') => void;
  onNavigateJourney?: (stageId?: StageId) => void;
  onNavigateStandard?: (ref: string) => void;
  onNavigateRole?: (slug: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigateDiagram?: () => void;
}

interface LearningPathwayCard {
  id: string;
  num: string;
  level: 'beginner' | 'technician' | 'engineer';
  levelBadgeEn: string;
  levelBadgeFr: string;
  titleEn: string;
  titleFr: string;
  summaryEn: string;
  summaryFr: string;
  topicsEn: string[];
  topicsFr: string[];
  imageUrl: string;
  targetDomain: DomainCode;
}

interface NineStageItem {
  num: string;
  id: string;
  journeyStage: StageId;
  domainCode: DomainCode;
  titleEn: string;
  titleFr: string;
  voltage: string;
  imageUrl: string;
  explanationEn: string;
  explanationFr: string;
  purposeEn: string;
  purposeFr: string;
  principleEn: string;
  principleFr: string;
  equipmentEn: string[];
  equipmentFr: string[];
  cameroonContextEn: string;
  cameroonContextFr: string;
}

interface FeaturedEquipmentItem {
  id: string;
  nameEn: string;
  nameFr: string;
  voltageBadge: string;
  iecSymbolLabel: string;
  roleEn: string;
  roleFr: string;
  insideAnatomyEn: string;
  insideAnatomyFr: string;
  imageUrl: string;
}

interface MotorStarterElement {
  code: string;
  nameEn: string;
  nameFr: string;
  symbolText: string;
  roleEn: string;
  roleFr: string;
  principleEn: string;
  principleFr: string;
  terminals: string;
  equipmentId: string;
}

const LEARNING_PATHWAYS: LearningPathwayCard[] = [
  {
    id: 'pathway-01-fundamentals',
    num: '01',
    level: 'beginner',
    levelBadgeEn: 'Beginner & Foundation',
    levelBadgeFr: 'Débutant & Bases',
    titleEn: 'Electrical Fundamentals',
    titleFr: 'Fondamentaux de l’Électricité',
    summaryEn:
      'Understand the physical phenomena behind every circuit before touching a formula: charge, voltage, current, resistance, power vs. energy, AC/DC, and single-phase vs. three-phase.',
    summaryFr:
      'Comprendre concrètement les phénomènes physiques avant les formules : charge, tension, courant, résistance, puissance vs énergie, AC/DC, monophasé et triphasé.',
    topicsEn: [
      'Voltage (V), Current (A) & Resistance (Ω)',
      'Ohm’s Law & Electrical Circuits',
      'Power (W / kVA) vs. Energy (kWh)',
      'AC vs. DC & 50 Hz Frequency',
      'Single-Phase (230 V) vs. Three-Phase (400 V)',
      'Power Factor (cos φ) & Active/Reactive Power',
    ],
    topicsFr: [
      'Tension (V), Courant (A) et Résistance (Ω)',
      'Loi d’Ohm et fonctionnement d’un circuit',
      'Puissance (W / kVA) vs Énergie (kWh)',
      'Courant continu (DC) vs alternatif (AC 50 Hz)',
      'Monophasé (230 V) vs Triphasé (400 V)',
      'Facteur de puissance (cos φ)',
    ],
    imageUrl: '/images/homepage_uploads/batch_04_image_019.jpg',
    targetDomain: 'D01',
  },
  {
    id: 'pathway-02-components',
    num: '02',
    level: 'beginner',
    levelBadgeEn: 'Core Equipment',
    levelBadgeFr: 'Équipements Clés',
    titleEn: 'Electrical Components & Equipment',
    titleFr: 'Composants & Équipements Électriques',
    summaryEn:
      'Look inside real electrical hardware: see the photograph, internal anatomy, operating mechanism, electrical symbol, and real installation of every major component.',
    summaryFr:
      'Observer l’intérieur du matériel réel : photographie, anatomie interne, principe de fonctionnement, symbole électrique et installation sur le terrain.',
    topicsEn: [
      'Circuit Breakers & Fuses',
      'Contactors & Thermal Overload Relays',
      'Power & Distribution Transformers',
      'Electric Motors & Synchronous Generators',
      'Current (CT) & Voltage Transformers (VT)',
      'Switchgear & Electrical Cables',
    ],
    topicsFr: [
      'Disjoncteurs et Fusibles',
      'Contacteurs et Relais Thermiques',
      'Transformateurs de puissance et distribution',
      'Moteurs électriques et Alternateurs',
      'Transformateurs de courant (TC) et tension (TT)',
      'Cellules HTA/BT et Câbles électriques',
    ],
    imageUrl: '/images/homepage_uploads/batch_02_image_009.jpg',
    targetDomain: 'D04',
  },
  {
    id: 'pathway-03-installations',
    num: '03',
    level: 'technician',
    levelBadgeEn: 'Field Technician',
    levelBadgeFr: 'Pratique Terrain',
    titleEn: 'Electrical Installations',
    titleFr: 'Installations Électriques (Bâtiment & Tertiaire)',
    summaryEn:
      'Master how residential, commercial, and industrial installations are structured, wired, earthed, and protected against electric shock and overcurrent.',
    summaryFr:
      'Maîtriser la réalisation des installations domestiques, tertiaires et industrielles : éclairage, prises, tableaux, mise à la terre et protections.',
    topicsEn: [
      'Residential & Commercial Installations',
      'Lighting Circuits & Socket Outlets',
      'Distribution Boards & Main Switchboards (TGBT)',
      'Earthing Systems (TT, TN-S, IT)',
      'Residual Current Devices (RCD 30 mA) & Breakers',
      'Cable Routing & Conductor Sizing',
    ],
    topicsFr: [
      'Installations résidentielles et tertiaires',
      'Circuits d’éclairage et prises de courant',
      'Tableaux de répartition et TGBT',
      'Prises de terre et régimes de neutre (TT, TN, IT)',
      'Dispositifs différentiels (DDR 30 mA) et disjoncteurs',
      'Cheminement et dimensionnement des câbles',
    ],
    imageUrl: '/images/homepage_uploads/batch_03_image_014.jpg',
    targetDomain: 'D06',
  },
  {
    id: 'pathway-04-generation',
    num: '04',
    level: 'engineer',
    levelBadgeEn: 'Power Systems',
    levelBadgeFr: 'Production',
    titleEn: 'Power Generation',
    titleFr: 'Production d’Énergie Électrique',
    summaryEn:
      'Discover how hydroelectric dams, thermal gas plants, solar PV farms, and wind turbines generate electricity, regulate voltage (AVR), and synchronize to the grid.',
    summaryFr:
      'Découvrir comment les centrales hydroélectriques, thermiques, solaires et éoliennes produisent l’électricité, règlent la tension (AVR) et se couplent au réseau.',
    topicsEn: [
      'Hydroelectric Power Plants (Song Loulou, Nachtigal)',
      'Thermal & Gas Power Plants (Kribi, Logbaba)',
      'Solar Photovoltaic & Wind Power Plants',
      'Synchronous Generators & Alternators',
      'Excitation Systems (AVR) & Frequency Control',
      'Grid Synchronization (ANSI 25)',
    ],
    topicsFr: [
      'Centrales hydroélectriques (Song Loulou, Nachtigal)',
      'Centrales thermiques et à gaz (Kribi, Logbaba)',
      'Centrales solaires PV et éoliennes',
      'Alternateurs synchrones (rotor / stator)',
      'Systèmes d’excitation (AVR) et réglage 50 Hz',
      'Couplage et synchronisation au réseau (ANSI 25)',
    ],
    imageUrl: '/images/homepage_uploads/batch_06_image_030.jpg',
    targetDomain: 'D01',
  },
  {
    id: 'pathway-05-transmission',
    num: '05',
    level: 'engineer',
    levelBadgeEn: 'HV Grid',
    levelBadgeFr: 'Transport HTB',
    titleEn: 'Power Transmission & Substations',
    titleFr: 'Transport Haute Tension & Postes HTB',
    summaryEn:
      'Explore 90 kV to 225 kV transmission corridors, steel towers, insulator strings, substations, power transformers, and high-voltage switching bays.',
    summaryFr:
      'Explorer les lignes haute tension (90 kV / 225 kV), pylônes, isolateurs, postes de transformation, transformateurs de puissance et travées HTB.',
    topicsEn: [
      'High-Voltage Networks (90 kV, 110 kV, 225 kV)',
      'Transmission Towers, ACSR Conductors & Insulators',
      'Air-Insulated (AIS) & Gas-Insulated (GIS) Substations',
      'Step-Up & Step-Down Power Transformers',
      'HV Circuit Breakers, Disconnectors & Earthing Switches',
      'Distance (21) & Differential (87) Protection',
    ],
    topicsFr: [
      'Réseaux haute tension (90 kV, 110 kV, 225 kV)',
      'Pylônes, conducteurs Almelec/ACSR et isolateurs',
      'Postes HTB ouverts (AIS) et blindés (GIS)',
      'Transformateurs de puissance et autotransformateurs',
      'Disjoncteurs SF6, sectionneurs et verrouillages',
      'Protections de distance (21) et différentielle (87)',
    ],
    imageUrl: '/images/homepage_uploads/batch_02_image_007.jpg',
    targetDomain: 'D03',
  },
  {
    id: 'pathway-06-distribution',
    num: '06',
    level: 'technician',
    levelBadgeEn: 'MV / LV Grid',
    levelBadgeFr: 'Distribution MT / BT',
    titleEn: 'Power Distribution (MV & LV Networks)',
    titleFr: 'Distribution Électrique (Réseaux HTA & BT)',
    summaryEn:
      'Follow electricity from 15 kV / 30 kV medium-voltage networks through Ring Main Units (RMUs) and pole-mounted H61 transformers down to 400 V / 230 V consumer connections.',
    summaryFr:
      'Suivre l’électricité depuis les réseaux HTA (15 kV / 30 kV), les cellules RMU et les postes sur poteau H61 jusqu’aux branchements basse tension 400 V / 230 V.',
    topicsEn: [
      'Medium-Voltage Networks (15 kV, 20 kV, 30 kV)',
      'Ring Main Units (RMUs) & MV Switchgear',
      'Pole-Mounted (H61) & Cabin Distribution Transformers',
      'Low-Voltage Overhead & Underground Networks',
      'LV Switchgear, Feeder Pillars & Metering',
      'Consumer Service Connections',
    ],
    topicsFr: [
      'Réseaux moyenne tension HTA (15 kV, 20 kV, 30 kV)',
      'Cellules RMU et tableaux HTA en boucle',
      'Transformateurs MT/BT sur poteau (H61) et en cabine',
      'Réseaux basse tension aériens torsadés et souterrains',
      'Tableaux BT, coffrets de coupure et comptage',
      'Branchements des abonnés',
    ],
    imageUrl: '/images/homepage_uploads/batch_03_image_011.jpg',
    targetDomain: 'D05',
  },
  {
    id: 'pathway-07-industrial',
    num: '07',
    level: 'technician',
    levelBadgeEn: 'Industrial Practice',
    levelBadgeFr: 'Électricité Industrielle',
    titleEn: 'Industrial Electrical Engineering',
    titleFr: 'Génie Électrique Industriel & Automatisme',
    summaryEn:
      'Move from individual components to complete industrial systems: three-phase motors, DOL/Star-Delta starters, VFDs, PLCs, industrial sensors, and SCADA control.',
    summaryFr:
      'Passer des composants isolés aux systèmes industriels complets : moteurs triphasés, démarreurs, variateurs VFD, automates PLC, capteurs et SCADA.',
    topicsEn: [
      'Three-Phase Induction Motors & Nameplates',
      'Direct-On-Line (DOL) & Star-Delta Motor Starters',
      'Variable Frequency Drives (VFDs) & Soft Starters',
      'PLC Automation Systems & Control Circuits (24 V DC)',
      'Industrial Sensors, Actuators & Instrumentation',
      'SCADA Supervision & Industrial Maintenance',
    ],
    topicsFr: [
      'Moteurs asynchrones triphasés et couplages Étoile/Triangle',
      'Démarreurs directs et Étoile-Triangle (Puissance + Commande)',
      'Variateurs de vitesse (VFD) et démarreurs progressifs',
      'Automates programmables (API / PLC) et commande 24 V DC',
      'Capteurs industriels, instrumentation et actionneurs',
      'Supervision SCADA et maintenance industrielle',
    ],
    imageUrl: '/images/homepage_uploads/batch_05_image_024.jpg',
    targetDomain: 'D07',
  },
  {
    id: 'pathway-08-drawings-safety',
    num: '08',
    level: 'beginner',
    levelBadgeEn: 'Essential Skills',
    levelBadgeFr: 'Schémas & Sécurité',
    titleEn: 'Electrical Drawings, Standards & Safety',
    titleFr: 'Schémas Électriques, Normes & Sécurité',
    summaryEn:
      'Learn to read and interpret Single-Line Diagrams, power vs. control schematics, IEC 60617 symbols, terminal markings, LOTO consignation, and life-saving protections.',
    summaryFr:
      'Apprendre à lire un schéma unifilaire, un schéma de puissance et de commande, les symboles CEI 60617, les borniers, la consignation LOTO et la sécurité.',
    topicsEn: [
      'Normalized Electrical Symbols (IEC 60617)',
      'Single-Line (SLD) vs. Multi-Line Diagrams',
      'Power Schematics vs. Control Schematics',
      'Terminal Blocks, Wire Markings & Layout Plans',
      'Direct/Indirect Contact Protection & Earthing',
      'Lockout / Tagout (LOTO), PPE & Arc Flash Safety',
    ],
    topicsFr: [
      'Symboles électriques normalisés (CEI 60617)',
      'Schémas unifilaires vs schémas multifilaires',
      'Schémas de puissance vs schémas de commande',
      'Repérage des conducteurs, borniers et implantation',
      'Protection contre les contacts directs et indirects',
      'Consignation (LOTO), EPI et risque d’arc électrique',
    ],
    imageUrl: '/images/homepage_uploads/batch_03_image_015.jpg',
    targetDomain: 'D08',
  },
];

// 9-Stage Visual Power System Explorer Data (Section 10 of EPEDE 2.0 Brief)
const NINE_POWER_STAGES: NineStageItem[] = [
  {
    num: '01',
    id: 'stage-generation',
    journeyStage: 'generation',
    domainCode: 'D01',
    titleEn: 'Power Generation',
    titleFr: 'Production d’Électricité',
    voltage: '10.3 kV – 15.5 kV',
    imageUrl: '/images/homepage_uploads/batch_01_image_005.jpg',
    explanationEn:
      'Generating stations convert primary energy (falling water, natural gas, solar radiation, or wind) into three-phase alternating current at 50 Hz.',
    explanationFr:
      'Les centrales convertissent une énergie primaire (chute d’eau, gaz naturel, rayonnement solaire ou vent) en courant alternatif triphasé à 50 Hz.',
    purposeEn: 'Supply the electrical power required by the entire interconnected grid in real time.',
    purposeFr: 'Fournir en temps réel la puissance active (MW) et réactive (MVAR) appelée par le réseau.',
    principleEn:
      'Faraday’s Law of Electromagnetic Induction: a rotating magnetic field (rotor) induces a sinusoidal three-phase voltage in the stationary copper windings (stator).',
    principleFr:
      'Loi de Faraday : la roue polaire en rotation (rotor) crée un champ magnétique tournant qui induit une tension triphasée à 50 Hz dans les enroulements du stator.',
    equipmentEn: ['Hydraulic / Gas Turbine', 'Synchronous Alternator', 'Excitation System (AVR)', 'Speed Governor'],
    equipmentFr: ['Turbine hydraulique / gaz', 'Alternateur synchrone', 'Régulateur de tension (AVR)', 'Régulateur de vitesse'],
    cameroonContextEn: 'Song Loulou (384 MW), Nachtigal (420 MW), Edéa (276 MW), Memve’ele (211 MW), Kribi Gas (216 MW), Lagdo (72 MW).',
    cameroonContextFr: 'Song Loulou (384 MW), Nachtigal (420 MW), Édéa (276 MW), Memve’ele (211 MW), Kribi Gaz (216 MW), Lagdo (72 MW).',
  },
  {
    num: '02',
    id: 'stage-step-up',
    journeyStage: 'switchyard',
    domainCode: 'D04',
    titleEn: 'Step-Up Transformer',
    titleFr: 'Transformateur Élévateur',
    voltage: '10.5/15 kV → 225 kV',
    imageUrl: '/images/homepage_uploads/batch_04_image_016.jpg',
    explanationEn:
      'Installed right outside the powerhouse, the Generator Step-Up (GSU) transformer raises voltage from generator level (10–15 kV) to transmission level (90–225 kV).',
    explanationFr:
      'Installé à la sortie de la centrale, le transformateur élévateur (GSU) porte la tension de l’alternateur (10–15 kV) à la haute tension de transport (90–225 kV).',
    purposeEn:
      'By multiplying voltage by ~15×, the current is divided by ~15× for the same power, reducing line heating losses (R·I²) by more than 200 times.',
    purposeFr:
      'En multipliant la tension par ~15, le courant est divisé par ~15 à puissance égale, ce qui divise par plus de 200 les pertes thermiques (R·I²) sur les lignes.',
    principleEn:
      'Magnetic flux coupling inside a laminated silicon-steel core transfers power from the low-voltage primary winding to the high-voltage secondary winding.',
    principleFr:
      'Le flux magnétique canalisé par le noyau en tôles d’acier au silicium transfère la puissance de l’enroulement basse tension vers l’enroulement haute tension.',
    equipmentEn: ['GSU Power Transformer', '225 kV RIP Bushings', 'ONAF Cooling Radiators', 'Buchholz Relay & Surge Arresters'],
    equipmentFr: ['Transformateur élévateur GSU', 'Traversées isolantes 225 kV', 'Aéroréfrigérants ONAF', 'Relais Buchholz et Parafoudres'],
    cameroonContextEn: '10.3/225 kV and 15/225 kV step-up transformer bays at Song Loulou, Nachtigal, and Memve’ele switchyards.',
    cameroonContextFr: 'Travées transformateurs élévateurs 10,3/225 kV et 15/225 kV des postes de Song Loulou, Nachtigal et Memve’ele.',
  },
  {
    num: '03',
    id: 'stage-hv-transmission',
    journeyStage: 'transmission',
    domainCode: 'D03',
    titleEn: 'High-Voltage Transmission',
    titleFr: 'Transport Haute Tension (HTB)',
    voltage: '90 kV / 110 kV / 225 kV',
    imageUrl: '/images/homepage_uploads/batch_02_image_008.jpg',
    explanationEn:
      'Overhead transmission corridors carry bulk power from remote hydro and thermal plants to major urban and industrial regions.',
    explanationFr:
      'Les lignes aériennes haute tension transportent de grandes quantités d’énergie depuis les centrales éloignées vers les métropoles et zones industrielles.',
    purposeEn: 'Interconnect power stations and load centers over 50 km to 400+ km with high reliability.',
    purposeFr: 'Relier les centres de production aux centres de consommation sur des centaines de kilomètres.',
    principleEn:
      'Bare aluminum-alloy conductors (ACSR / Almelec) are suspended from steel lattice towers by glass or composite insulator strings, shielded at the top by an optical ground wire (OPGW).',
    principleFr:
      'Des conducteurs nus en alliage d’aluminium (Almelec / ACSR) sont suspendus aux pylônes par des chaînes d’isolateurs, sous la protection d’un câble de garde (OPGW) contre la foudre.',
    equipmentEn: ['Steel Lattice Towers', 'ACSR / Almelec Conductors', 'Glass Insulator Strings', 'OPGW Earth Wire'],
    equipmentFr: ['Pylônes treillis acier', 'Conducteurs Almelec / ACSR', 'Chaînes d’isolateurs en verre', 'Câble de garde fibre optique OPGW'],
    cameroonContextEn: 'SONATREL 225 kV & 90 kV corridors (RIS in the South, 110/90 kV RIN in the North).',
    cameroonContextFr: 'Lignes 225 kV et 90 kV gérées par la SONATREL (Réseau Interconnecté Sud RIS et Nord RIN).',
  },
  {
    num: '04',
    id: 'stage-transmission-substation',
    journeyStage: 'substation',
    domainCode: 'D04',
    titleEn: 'Transmission Substation',
    titleFr: 'Poste d’Interconnexion HTB',
    voltage: '225 kV / 90 kV',
    imageUrl: '/images/homepage_uploads/batch_02_image_010.jpg',
    explanationEn:
      'High-voltage substations are the nodes of the power grid where transmission lines meet, switch configurations, and isolate faults.',
    explanationFr:
      'Les postes HTB constituent les nœuds d’aiguillage et de protection où convergent les lignes de transport haute tension.',
    purposeEn: 'Route power flows, isolate short-circuits in less than 100 milliseconds, and ensure safe maintenance isolation.',
    purposeFr: 'Aiguiller les flux d’énergie, éliminer les courts-circuits en moins de 100 ms et consigner les ouvrages en sécurité.',
    principleEn:
      'Protective relays (IEDs) monitor current and voltage via CTs and VTs; if a fault occurs, they trip SF6 circuit breakers while disconnectors provide visible isolation.',
    principleFr:
      'Les relais numériques (IED) surveillent courants et tensions via les TC et TT ; en cas de défaut, ils commandent l’ouverture du disjoncteur SF6.',
    equipmentEn: ['225 kV / 90 kV Busbars', 'SF6 Circuit Breakers', 'Motorized Disconnectors', 'CTs, VTs & Protection Relays'],
    equipmentFr: ['Jeux de barres 225/90 kV', 'Disjoncteurs SF6', 'Sectionneurs motorisés', 'TC, TT et Relais de protection'],
    cameroonContextEn: 'Major SONATREL substations: Oyomabang, Nyom II, Ahala, Mangombé, Bekoko, Logbaba, Koumassi.',
    cameroonContextFr: 'Grands postes SONATREL : Oyomabang, Nyom II, Ahala, Mangombé, Bekoko, Logbaba, Koumassi.',
  },
  {
    num: '05',
    id: 'stage-step-down',
    journeyStage: 'substation',
    domainCode: 'D04',
    titleEn: 'Step-Down Transformation',
    titleFr: 'Transformation Abaisseuse HTB/HTA',
    voltage: '225/90 kV → 30/15 kV',
    imageUrl: '/images/homepage_uploads/batch_02_image_006.jpg',
    explanationEn:
      'Primary substation transformers step high transmission voltage (225 kV or 90 kV) down to medium distribution voltage (30 kV or 15 kV).',
    explanationFr:
      'Dans les postes sources HTB/HTA, les transformateurs abaissent la haute tension (90 kV ou 225 kV) vers la moyenne tension (15 kV ou 30 kV).',
    purposeEn: 'Reduce voltage to a level suitable for routing across urban underground cables and regional overhead feeders.',
    purposeFr: 'Adapter la tension pour alimenter les départs moyenne tension urbains et ruraux en toute sécurité.',
    principleEn:
      'Equipped with an On-Load Tap Changer (OLTC), the step-down transformer keeps the 15 kV / 30 kV busbar voltage stable even when city load fluctuates.',
    principleFr:
      'Doté d’un régleur en charge (REG / OLTC), le transformateur maintient constante la tension 15 kV / 30 kV malgré les variations de consommation.',
    equipmentEn: ['90/30 kV or 90/15 kV Transformer', 'On-Load Tap Changer (OLTC)', 'Neutral Earthing Resistor', 'Primary MV Switchboard'],
    equipmentFr: ['Transformateur 90/30 kV ou 90/15 kV', 'Régleur en charge (OLTC)', 'Résistance de mise à la terre du neutre', 'Rame HTA primaire'],
    cameroonContextEn: 'SONATREL / Eneo interface bays at Ngousso, Kondengui, Bassa, Bonabéri, andBafoussam.',
    cameroonContextFr: 'Travées de transformation HTB/HTA aux postes de Ngousso, Kondengui, Bassa, Bonabéri et Bafoussam.',
  },
  {
    num: '06',
    id: 'stage-mv-distribution',
    journeyStage: 'distribution',
    domainCode: 'D05',
    titleEn: 'Medium-Voltage Distribution',
    titleFr: 'Distribution Moyenne Tension (HTA)',
    voltage: '15 kV / 20 kV / 30 kV',
    imageUrl: '/images/homepage_uploads/batch_01_image_004.jpg',
    explanationEn:
      'Medium-voltage feeders distribute power through city districts via underground XLPE cable rings and across rural areas via overhead lines.',
    explanationFr:
      'Les réseaux HTA (15 kV ou 30 kV) maillent les quartiers urbains en câbles souterrains et desservent les zones périurbaines et industrielles.',
    purposeEn: 'Deliver power to neighborhood distribution substations and medium-voltage industrial customers.',
    purposeFr: 'Alimenter les postes de quartier MT/BT ainsi que les clients industriels raccordés directement en moyenne tension.',
    principleEn:
      'Urban MV networks are built as open rings using Ring Main Units (RMUs): if one cable section fails, technicians isolate it and restore power from the other side.',
    principleFr:
      'En ville, le réseau HTA est exploité en boucle ouverte grâce aux cellules RMU : en cas de défaut sur un câble, on isole le tronçon et on réalimente par l’autre côté.',
    equipmentEn: ['Ring Main Units (RMU)', 'MV XLPE Underground Cables', 'Pole-Mounted Auto-Reclosers', 'MV Load-Break Switches'],
    equipmentFr: ['Cellules HTA RMU', 'Câbles souterrains HTA PRC/XLPE', 'Disjoncteurs réenclencheurs en tête de ligne', 'Interrupteurs aériens (IACM)'],
    cameroonContextEn: 'Eneo 15 kV urban networks (Douala & Yaoundé) and 30 kV regional distribution lines.',
    cameroonContextFr: 'Réseaux Eneo 15 kV (Douala et Yaoundé) et lignes régionales 30 kV.',
  },
  {
    num: '07',
    id: 'stage-dist-transformer',
    journeyStage: 'distribution',
    domainCode: 'D05',
    titleEn: 'Distribution Transformer',
    titleFr: 'Transformateur de Distribution MT/BT',
    voltage: '15/30 kV → 400 V / 230 V',
    imageUrl: '/images/homepage_uploads/batch_04_image_016.jpg',
    explanationEn:
      'Located on neighborhood poles (H61) or inside masonry cabins, the distribution transformer performs the final voltage step-down to 400 V / 230 V.',
    explanationFr:
      'Installé en haut de poteau (H61) ou en cabine maçonnée de quartier, il abaisse la moyenne tension (15/30 kV) en basse tension (400 V / 230 V).',
    purposeEn: 'Provide safe, usable low-voltage three-phase (400 V) and single-phase (230 V) electricity to consumers.',
    purposeFr: 'Délivrer la basse tension utilisable (400 V entre phases, 230 V entre phase et neutre) avec création du conducteur Neutre.',
    principleEn:
      'Delta-Star (Dyn11) winding connection: the secondary star point is grounded to create the Neutral conductor (N) alongside phases L1, L2, L3.',
    principleFr:
      'Couplage Triangle-Étoile (Dyn11) : le point neutre du secondaire étoile est relié à la terre pour distribuer les 3 phases (L1, L2, L3) et le Neutre (N).',
    equipmentEn: ['Dyn11 Distribution Transformer (50–630 kVA)', 'MV ZnO Surge Arresters', 'MV HRC Protection Fuses', 'LV Feeder Pillar / Disjoncteur Haut de Poteau'],
    equipmentFr: ['Transformateur Dyn11 (50–630 kVA)', 'Parafoudres HTA ZnO', 'Fusibles HTA HPC', 'Coffret disjoncteur BT / Tableau TUR'],
    cameroonContextEn: 'Ubiquitous Eneo H61 pole-mounted transformers (50, 100, 160 kVA) and cabin substations (250, 400, 630 kVA).',
    cameroonContextFr: 'Postes sur poteau H61 Eneo (50, 100, 160 kVA) et postes cabines de quartier (250, 400, 630 kVA).',
  },
  {
    num: '08',
    id: 'stage-lv-network',
    journeyStage: 'consumption',
    domainCode: 'D06',
    titleEn: 'Low-Voltage Network',
    titleFr: 'Réseau Basse Tension (BT)',
    voltage: '400 V 3Φ / 230 V 1Φ',
    imageUrl: '/images/homepage_uploads/batch_03_image_011.jpg',
    explanationEn:
      'Low-voltage lines run along streets to building service drops, utility meters, and main distribution boards.',
    explanationFr:
      'Les lignes basse tension parcourent les rues jusqu’aux branchements, compteurs et tableaux électriques des abonnés.',
    purposeEn: 'Distribute 230 V single-phase power to homes and 400 V three-phase power to workshops, offices, and buildings.',
    purposeFr: 'Alimenter les habitations en monophasé 230 V (Phase + Neutre) et les ateliers ou immeubles en triphasé 400 V.',
    principleEn:
      'Insulated twisted aerial bundled conductors (ABC) or underground cables carry L1, L2, L3, and Neutral, protected against overload and short-circuit.',
    principleFr:
      'Des faisceaux aériens torsadés isolés ou des câbles souterrains distribuent L1, L2, L3 et Neutre jusqu’au disjoncteur de branchement.',
    equipmentEn: ['Twisted ABC Aerial Cables', 'Energy Meters (Prepaid / Smart)', 'Main Breaker & RCD', 'Earthing Electrode (TT / TN)'],
    equipmentFr: ['Câbles aériens torsadés BT', 'Compteurs d’énergie', 'Disjoncteur de branchement différentiel', 'Prise de terre locale (TT / TN)'],
    cameroonContextEn: 'Public LV distribution at 230/400 V 50 Hz (TT earthing scheme per NF C 15-100 / IEC 60364).',
    cameroonContextFr: 'Distribution publique BT 230/400 V 50 Hz en schéma TT selon NF C 15-100 / CEI 60364.',
  },
  {
    num: '09',
    id: 'stage-final-consumer',
    journeyStage: 'consumption',
    domainCode: 'D07',
    titleEn: 'Final Consumer & Industry',
    titleFr: 'Consommateur Final & Industrie',
    voltage: '230 V / 400 V / 690 V',
    imageUrl: '/images/homepage_uploads/batch_03_image_014.jpg',
    explanationEn:
      'Inside homes, hospitals, commercial buildings, and factories, electricity is finally converted into light, cooling, motion, and industrial production.',
    explanationFr:
      'Dans les maisons, hôpitaux, immeubles et usines, l’électricité est convertie en éclairage, froid, mouvement mécanique et pilotage.',
    purposeEn: 'Safely power lighting, socket circuits, three-phase industrial motors, pumps, compressors, and automation.',
    purposeFr: 'Alimenter en toute sécurité les circuits terminaux, les moteurs triphasés, les pompes et les lignes automatisées.',
    principleEn:
      'Each final circuit is protected by a dedicated circuit breaker and RCD, while industrial motors use coordinated starter assemblies (Breaker + Contactor + Thermal Relay or VFD).',
    principleFr:
      'Chaque circuit est protégé par un disjoncteur divisionnaire et un différentiel, tandis que les moteurs sont pilotés par des départs moteurs coordonnés.',
    equipmentEn: ['Final Distribution Boards', '3Φ Induction Motors & Starters', 'Variable Frequency Drives (VFD)', 'PLC & Standby Generator / UPS'],
    equipmentFr: ['Tableaux divisionnaires et TGBT', 'Moteurs asynchrones triphasés', 'Variateurs de vitesse (VFD)', 'Automates PLC et Groupes de secours'],
    cameroonContextEn: 'Residential, commercial, and industrial installations across Douala, Yaoundé, Kribi, Bafoussam, and Garoua.',
    cameroonContextFr: 'Installations domestiques, tertiaires et industrielles à Douala, Yaoundé, Kribi, Bafoussam et Garoua.',
  },
];

// 6 Featured Equipment Cards (Section 5 of EPEDE 2.0 Homepage)
const FEATURED_EQUIPMENT: FeaturedEquipmentItem[] = [
  {
    id: 'eq-cb-sf6-01',
    nameEn: 'Circuit Breaker (LV / MV / HV)',
    nameFr: 'Disjoncteur Électrique (BT / HTA / HTB)',
    voltageBadge: '230 V – 225 kV',
    iecSymbolLabel: 'IEC Symbol: Q / CB (× interrupt contact)',
    roleEn: 'Automatically interrupts overload and short-circuit fault currents to protect cables, equipment, and human life.',
    roleFr: 'Coupe automatiquement le courant en cas de surcharge ou de court-circuit pour protéger les câbles et les personnes.',
    insideAnatomyEn: 'Thermal bimetal strip (overload), magnetic coil (short-circuit), main contacts, and arc-extinguishing chamber.',
    insideAnatomyFr: 'Bilame thermique (surcharge), bobine magnétique (court-circuit), contacts de puissance et chambre de coupure d’arc.',
    imageUrl: '/images/homepage_uploads/batch_06_image_029.jpg',
  },
  {
    id: 'eq-trafo-hta-01',
    nameEn: 'Power & Distribution Transformer',
    nameFr: 'Transformateur de Puissance & Distribution',
    voltageBadge: '15/30 kV ↔ 400 V / 225 kV',
    iecSymbolLabel: 'IEC Symbol: T (Two coupled windings)',
    roleEn: 'Transfers electrical energy between two voltage levels via electromagnetic induction without changing the 50 Hz frequency.',
    roleFr: 'Élève ou abaisse la tension par induction électromagnétique tout en conservant la fréquence de 50 Hz.',
    insideAnatomyEn: 'Laminated magnetic core, primary HV winding, secondary LV winding, insulating oil, bushings, and cooling fins.',
    insideAnatomyFr: 'Circuit magnétique feuilleté, enroulements primaire et secondaire, huile isolante, traversées et radiateurs.',
    imageUrl: '/images/homepage_uploads/batch_02_image_006.jpg',
  },
  {
    id: 'eq-lv-acb-01',
    nameEn: 'Contactor & Thermal Overload Relay',
    nameFr: 'Contacteur & Relais Thermique',
    voltageBadge: '400 V Power / 24–230 V Coil',
    iecSymbolLabel: 'IEC Symbol: KM (Contactor) + F (Thermal)',
    roleEn: 'The contactor switches motors on/off remotely via an electromagnetic coil; the thermal relay protects the motor if it draws excessive current.',
    roleFr: 'Le contacteur commande à distance le moteur via sa bobine A1-A2 ; le relais thermique protège le moteur contre les surcharges.',
    insideAnatomyEn: 'Electromagnetic coil (A1–A2), movable iron core, 3 main power poles (1–2, 3–4, 5–6), auxiliary contact (13–14), and 3 bimetallic strips.',
    insideAnatomyFr: 'Bobine électromagnétique (A1–A2), circuit magnétique mobile, 3 pôles de puissance (1–2, 3–4, 5–6), contact auxiliaire (13–14) et bilames.',
    imageUrl: '/images/homepage_uploads/batch_03_image_013.jpg',
  },
  {
    id: 'eq-ind-motor-01',
    nameEn: 'Three-Phase Induction Motor',
    nameFr: 'Moteur Asynchrone Triphasé',
    voltageBadge: '400 V / 690 V · 3Φ',
    iecSymbolLabel: 'IEC Symbol: M 3~',
    roleEn: 'The workhorse of industry: converts three-phase electrical power into mechanical shaft rotation for pumps, fans, conveyors, and crushers.',
    roleFr: 'Le cœur de l’industrie : convertit l’énergie électrique triphasée en couple mécanique pour entraîner pompes, ventilateurs et convoyeurs.',
    insideAnatomyEn: 'Three-phase stator windings (creating a rotating magnetic field), squirrel-cage rotor, bearings, cooling fan, and Star/Delta terminal box.',
    insideAnatomyFr: 'Stator triphasé (champ magnétique tournant), rotor à cage d’écureuil, roulements, ventilateur et plaque à bornes (U1-V1-W1 / W2-U2-V2).',
    imageUrl: '/images/homepage_uploads/batch_05_image_025.jpg',
  },
  {
    id: 'eq-rmu-hta-01',
    nameEn: 'MV Ring Main Unit (RMU) & Switchgear',
    nameFr: 'Cellule Moyenne Tension (RMU / HTA)',
    voltageBadge: '15 kV / 20 kV / 30 kV',
    iecSymbolLabel: 'IEC Symbol: Load-Break Switch + Fuse/CB',
    roleEn: 'Connects, loops, and protects medium-voltage underground cables and distribution transformers inside compact metal-enclosed cubicles.',
    roleFr: 'Assure le bouclage des câbles souterrains HTA et la protection du transformateur MT/BT dans un tableau compact.',
    insideAnatomyEn: 'SF6 or vacuum switching chamber, three-position disconnector/earthing switch, busbars, voltage presence lamps (VPIS), and mechanical interlocks.',
    insideAnatomyFr: 'Enceinte de coupure SF6 ou vide, sectionneur 3 positions (Fermé / Ouvert / Terre), diviseurs capacitifs (VPIS) et verrouillages.',
    imageUrl: '/images/homepage_uploads/batch_02_image_009.jpg',
  },
  {
    id: 'eq-hydro-gen-01',
    nameEn: 'Synchronous Generator (Alternator)',
    nameFr: 'Alternateur Synchrone de Centrale',
    voltageBadge: '10.3 kV – 15.5 kV · 50 Hz',
    iecSymbolLabel: 'IEC Symbol: G 3~',
    roleEn: 'Converts mechanical torque from a hydraulic, gas, or steam turbine into synchronized three-phase AC electrical power.',
    roleFr: 'Convertit l’énergie mécanique de rotation de la turbine en énergie électrique alternative triphasée à 50 Hz.',
    insideAnatomyEn: 'Salient-pole or cylindrical rotor fed with DC excitation current, Roebel-bar stator windings, air/water coolers, and neutral grounding transformer.',
    insideAnatomyFr: 'Rotor inducteur alimenté en courant continu (excitation), stator induit à barres Roebel, refroidisseurs air/eau et mise à la terre du neutre.',
    imageUrl: '/images/homepage_uploads/batch_06_image_030.jpg',
  },
];

// Complete System Assembly: 3-Phase Motor Starter (Addressing Challenge F of the Brief)
const MOTOR_STARTER_CHAIN: MotorStarterElement[] = [
  {
    code: 'L1-L2-L3',
    nameEn: '1. Three-Phase Power Supply (400 V AC)',
    nameFr: '1. Alimentation Triphasée (400 V AC + PE)',
    symbolText: '3~ 400 V 50 Hz + PE',
    roleEn: 'Supplies three sinusoidal voltages shifted by 120° plus the protective earth (PE) conductor from the main switchboard.',
    roleFr: 'Fournit les trois phases décalées de 120° (400 V entre phases) ainsi que le conducteur de protection (Terre PE) depuis le TGBT.',
    principleEn: 'Three-phase power creates a naturally rotating magnetic field inside the motor without needing a starting capacitor.',
    principleFr: 'Le système triphasé permet de créer directement un champ magnétique tournant dans le moteur avec un couple constant.',
    terminals: 'L1, L2, L3, PE',
    equipmentId: 'eq-lv-acb-01',
  },
  {
    code: 'Q1',
    nameEn: '2. Magnetic Circuit Breaker / Isolator (Q1)',
    nameFr: '2. Sectionneur / Disjoncteur Magnétique (Q1)',
    symbolText: 'Q1 (I>> Short-Circuit Protection)',
    roleEn: 'Provides manual isolation for safe maintenance and instantaneous magnetic tripping if a short-circuit occurs in the cable or motor.',
    roleFr: 'Permet d’isoler le départ à l’arrêt (sectionnement) et coupe instantanément en cas de court-circuit franc (protection magnétique).',
    principleEn: 'If current spikes to 10× rated current (short-circuit), the magnetic solenoid strikes the latch open in milliseconds.',
    principleFr: 'Si le courant dépasse ~10× In (court-circuit entre phases), l’électroaimant ouvre mécaniquement les pôles en quelques millisecondes.',
    terminals: 'In: 1-3-5 / Out: 2-4-6',
    equipmentId: 'eq-cb-sf6-01',
  },
  {
    code: 'KM1',
    nameEn: '3. Power Contactor (KM1)',
    nameFr: '3. Contacteur de Puissance (KM1)',
    symbolText: 'KM1 (Remote Electromagnetic Switch)',
    roleEn: 'Closes or opens the three power phases frequently whenever the operator presses START/STOP or when a PLC sends a 24 V / 230 V command.',
    roleFr: 'Établit ou interrompt l’alimentation du moteur à distance lorsque sa bobine (A1–A2) est alimentée par le circuit de commande.',
    principleEn: 'When control voltage energizes coil A1–A2, the electromagnet pulls the main contacts (1-2, 3-4, 5-6) closed and latches auxiliary contact (13-14).',
    principleFr: 'Quand la bobine A1–A2 reçoit la tension de commande, l’armature mobile ferme les 3 pôles de puissance et le contact d’auto-maintien (13–14).',
    terminals: 'Power: 1-2, 3-4, 5-6 · Coil: A1-A2 · Aux NO: 13-14',
    equipmentId: 'eq-lv-acb-01',
  },
  {
    code: 'F1',
    nameEn: '4. Thermal Overload Relay (F1)',
    nameFr: '4. Relais Thermique de Surcharge (F1)',
    symbolText: 'F1 (Thermal Overload Protection)',
    roleEn: 'Monitors the actual current drawn by the motor; if the motor is mechanically overloaded or loses a phase, F1 opens the control circuit to stop KM1.',
    roleFr: 'Surveille l’échauffement lié au courant du moteur ; en cas de surcharge mécanique ou de coupure d’une phase, il ouvre son contact 95–96 pour couper KM1.',
    principleEn: 'Note: F1 does not break the power circuit directly! Its bimetallic strips bend with heat and open auxiliary contact 95–96 in series with coil A1–A2.',
    principleFr: 'Point clé : le relais thermique ne coupe pas la puissance lui-même ! Ses bilames ouvrent le contact auxiliaire NC (95–96) qui coupe la bobine de KM1.',
    terminals: 'Power: 2-4-6 · Control NC: 95-96 · Alarm NO: 97-98',
    equipmentId: 'eq-lv-acb-01',
  },
  {
    code: 'M1',
    nameEn: '5. Three-Phase Induction Motor (M1)',
    nameFr: '5. Moteur Asynchrone Triphasé (M1)',
    symbolText: 'M1 (3~ Squirrel-Cage Motor)',
    roleEn: 'Converts the three-phase electrical energy into mechanical rotation on the shaft to drive the industrial machine.',
    roleFr: 'Transforme l’énergie électrique triphasée en mouvement mécanique de rotation sur l’arbre pour entraîner la machine.',
    principleEn: 'Stator windings (coupled in Star or Delta inside the terminal box) create a 50 Hz rotating magnetic field that induces current and torque in the rotor.',
    principleFr: 'Les 3 enroulements du stator (couplés en Étoile ou en Triangle sur la plaque à bornes) créent un champ tournant qui entraîne le rotor en cage d’écureuil.',
    terminals: 'U1, V1, W1 + PE (Chassis Earth)',
    equipmentId: 'eq-ind-motor-01',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  locale,
  onSelectDomain,
  onSelectEquipment,
  onNavigateView,
  onNavigateJourney,
}) => {
  const isFr = locale === 'fr';
  const [pathwayFilter, setPathwayFilter] = useState<'all' | 'beginner' | 'technician' | 'engineer'>('all');
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [selectedStarterIdx, setSelectedStarterIdx] = useState<number>(2); // Default highlight: KM1 Contactor

  const filteredPathways = LEARNING_PATHWAYS.filter(
    (p) => pathwayFilter === 'all' || p.level === pathwayFilter
  );

  const activeStage = NINE_POWER_STAGES[selectedStageIdx] || NINE_POWER_STAGES[0];
  const activeStarterItem = MOTOR_STARTER_CHAIN[selectedStarterIdx] || MOTOR_STARTER_CHAIN[0];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#07131F] via-[#0E2034] to-[#07131F] text-[#F7F8F5] space-y-16 pb-20">
      {/* Ambient Subtle Technical Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#2878A5_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* =====================================================================
          SECTION 1: CINEMATIC FULL-SCREEN HERO EXPERIENCE (GE VERNOVA COMPOSITION)
          ===================================================================== */}
      <CinematicVernovaHero
        locale={locale}
        onNavigateView={(view) => {
          if (view === 'power-chain') {
            onNavigateView('journey');
          } else if (view === 'learn') {
            onNavigateView('thematic-journeys');
          } else {
            onNavigateView(view);
          }
        }}
      />

      {/* Container wrapper for structured below-the-fold content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* =====================================================================
            SECTION 2: WHAT IS EPEDE? (THE 4-STEP LEARNING PHILOSOPHY)
            ===================================================================== */}
        <section className="relative rounded-3xl border border-white/10 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <DynamicSectionBackground
            photos={HOMEPAGE_IMAGE_LIBRARY.generation}
            overlayOpacityClass="bg-[#102A43]/65"
            locale={locale}
            showCaptionBadge={true}
            className="p-6 sm:p-10 space-y-8"
          >
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-[#B8F000]/40 text-[#B8F000] text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-sm">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isFr ? 'QU’EST-CE QU’EPEDE ?' : 'WHAT IS EPEDE?'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
                {isFr
                  ? 'Un environnement visuel pour comprendre réellement comment fonctionne l’électricité'
                  : 'A Visual Learning Environment Built to Bridge Theory and Real Electrical Systems'}
              </h2>

              <p className="text-sm sm:text-base text-[#A9ADA5] leading-relaxed">
                {isFr
                  ? 'Vous n’avez pas besoin d’être déjà ingénieur pour utiliser EPEDE. Que vous soyez étudiant, électricien de chantier, technicien de maintenance ou jeune ingénieur, la plateforme vous fait passer progressivement du principe physique à l’équipement réel, puis au schéma et à l’installation complète.'
                  : 'You do not need prior mastery of electrical engineering to use EPEDE. Whether you are a student, a field electrician, an industrial maintenance technician, or an early-career engineer, EPEDE guides you step by step from physical intuition to real hardware, schematics, and complete installations.'}
              </p>
            </div>

            {/* 4-Step Core Philosophy Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  titleEn: 'LEARN THE PRINCIPLE',
                  titleFr: 'COMPRENDRE LE PRINCIPE',
                  descEn:
                    'Grasp what voltage, current, power, magnetic induction, and three-phase systems physically do before memorizing equations.',
                  descFr:
                    'Comprendre physiquement ce que font la tension, le courant, l’induction magnétique et le triphasé avant de réciter des formules.',
                  icon: Zap,
                },
                {
                  step: '02',
                  titleEn: 'UNDERSTAND THE EQUIPMENT',
                  titleFr: 'OBSERVER L’ÉQUIPEMENT',
                  descEn:
                    'Inspect real photographs, internal cutaways, windings, contacts, arc chutes, and IEC symbols of every component.',
                  descFr:
                    'Observer de vraies photographies, l’architecture interne en coupe, les bornes et le symbole normalisé de chaque appareil.',
                  icon: Eye,
                },
                {
                  step: '03',
                  titleEn: 'VISUALIZE THE SYSTEM',
                  titleFr: 'VISUALISER LE SYSTÈME',
                  descEn:
                    'See how individual devices (breakers, contactors, relays, transformers, motors) connect and work together on schematics.',
                  descFr:
                    'Comprendre comment les appareils (disjoncteur, contacteur, relais thermique, transformateur, moteur) interagissent ensemble.',
                  icon: Layers,
                },
                {
                  step: '04',
                  titleEn: 'DISCOVER REAL APPLICATIONS',
                  titleFr: 'DÉCOUVRIR LE TERRAIN RÉEL',
                  descEn:
                    'Connect every concept to real installations in Cameroon and internationally: power plants, 225 kV substations, H61 poles, and factories.',
                  descFr:
                    'Relier chaque notion aux installations réelles au Cameroun et dans le monde : centrales, postes 225 kV, poteaux H61 et usines.',
                  icon: MapPin,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md p-5 space-y-3 hover:border-[#B8F000]/50 hover:bg-white/[0.07] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[#B8F000] bg-white/[0.06] px-2.5 py-1 rounded-md border border-[#B8F000]/30">
                        STEP {item.step}
                      </span>
                      <Icon className="w-5 h-5 text-[#B8F000]" />
                    </div>
                    <h3 className="text-sm font-black text-[#F4F1E8] tracking-wide uppercase">
                      {isFr ? item.titleFr : item.titleEn}
                    </h3>
                    <p className="text-xs text-[#A9ADA5] leading-relaxed">
                      {isFr ? item.descFr : item.descEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </DynamicSectionBackground>
        </section>

        {/* =====================================================================
            SECTION 3: INTERACTIVE CAMEROON ELECTRICAL POWER NETWORK MAP
            (Verified SONATREL & Eneo Generation & Transmission Infrastructure)
            ===================================================================== */}
        <section className="relative rounded-3xl border border-white/10 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <DynamicSectionBackground
            photos={HOMEPAGE_IMAGE_LIBRARY.transmission}
            overlayOpacityClass="bg-[#07131F]/80"
            locale={locale}
            showCaptionBadge={true}
            className="p-6 sm:p-10 space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-[#2878A5]/40 text-[#2878A5] text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#B8F000]" />
                  <span>{isFr ? 'CARTOGRAPHIE GÉOGRAPHIQUE OFFICIELLE' : 'OFFICIAL GEOGRAPHIC INFRASTRUCTURE MAP'}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
                  {isFr
                    ? 'Réseau Électrique Interconnecté du Cameroun (RIS & RIN)'
                    : 'Interconnected Power Grid of Cameroon (Southern RIS & Northern RIN)'}
                </h2>

                <p className="text-sm text-[#A9ADA5] max-w-3xl leading-relaxed">
                  {isFr
                    ? 'Explorez la géographie réelle des grands ouvrages hydroélectriques (Nachtigal 420 MW, Song Loulou 384 MW, Edéa 276 MW, Memve\'ele 211 MW), des centrales thermiques, des fermes solaires PV et des artères de transport THT 225 kV et 110 kV opérées par la SONATREL.'
                    : 'Explore verified generation facilities (Nachtigal 420 MW, Song Loulou 384 MW, Edéa 276 MW, Memve\'ele 211 MW), gas thermal plants, solar farms, and 225 kV / 110 kV transmission corridors operated by SONATREL.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateView('cameroon-grid')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-[#102A43] text-white border border-white/20 hover:border-[#B8F000] text-xs font-mono font-bold transition-all shrink-0 cursor-pointer backdrop-blur-md"
              >
                <span>{isFr ? 'Plein Écran & Données Réseau' : 'Full Screen Grid Explorer'}</span>
                <ArrowRight className="w-4 h-4 text-[#B8F000]" />
              </button>
            </div>

            {/* Embedded Real Cameroon Geographic Map */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#07131F]/90 backdrop-blur-md shadow-2xl">
              <RealCameroonGeographicMap
                locale={locale}
                onNavigateEquipment={onSelectEquipment}
                onNavigateDiagram={(topo) => onNavigateDiagram && onNavigateDiagram()}
              />
            </div>
          </DynamicSectionBackground>
        </section>

      {/* =====================================================================
          SECTION 3: EXPLORE THE 8 PROGRESSIVE LEARNING PATHWAYS
          ===================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#B8F000] uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#B8F000]" />
              <span>{isFr ? 'PAR OÙ COMMENCER ?' : 'WHERE SHOULD I BEGIN?'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
              {isFr
                ? '8 Parcours d’Apprentissage Progressifs'
                : '8 Progressive Learning Pathways'}
            </h2>
            <p className="text-sm text-[#A9ADA5] max-w-2xl">
              {isFr
                ? 'Choisissez votre point de départ selon votre niveau : des bases de l’électricité (Parcours 01) jusqu’aux réseaux haute tension, moteurs industriels et lecture de schémas.'
                : 'Choose your starting point by experience level: from foundational electricity (Pathway 01) to high-voltage grids, industrial motor control, and schematic reading.'}
            </p>
          </div>

          {/* Level Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', labelEn: 'All 8 Pathways', labelFr: 'Les 8 Parcours' },
              { id: 'beginner', labelEn: 'Beginner & Student', labelFr: 'Débutant & Étudiant' },
              { id: 'technician', labelEn: 'Field Technician', labelFr: 'Technicien & Chantier' },
              { id: 'engineer', labelEn: 'Power Systems', labelFr: 'Réseaux & Centrales' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPathwayFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  pathwayFilter === tab.id
                    ? 'bg-[#B8F000] text-[#102A43] border-[#B8F000] font-black'
                    : 'bg-white/[0.04] text-[#A9ADA5] hover:text-[#F4F1E8] border-white/10'
                }`}
              >
                {isFr ? tab.labelFr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPathways.map((pathway) => (
            <div
              key={pathway.id}
              onClick={() => onNavigateView('thematic-journeys')}
              className="group rounded-2xl bg-[#102A43]/40 border border-white/10 hover:border-[#B8F000]/50 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div>
                {/* Top Photo Header */}
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#102A43]/70 to-[#0B192C]/90 flex items-center justify-center">
                  {pathway.imageUrl ? (
                    <img
                      src={pathway.imageUrl}
                      alt={isFr ? pathway.titleFr : pathway.titleEn}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 border-b border-white/10 select-none">
                      <Zap className="w-6 h-6 text-[#B8F000]/40 mb-1.5" />
                      <span className="text-[10px] font-mono text-white/35 tracking-widest uppercase">
                        {isFr ? 'Photographie en attente' : 'Image pending'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-[#D7A64A]/40 font-mono text-xs font-black text-[#D7A64A] backdrop-blur-sm">
                      {isFr ? `PARCOURS ${pathway.num}` : `PATHWAY ${pathway.num}`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-black/40 border border-white/20 font-mono text-[10px] font-bold text-[#F4F1E8] backdrop-blur-sm">
                      {isFr ? pathway.levelBadgeFr : pathway.levelBadgeEn}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-black text-[#F4F1E8] group-hover:text-[#B8F000] transition-colors">
                    {isFr ? pathway.titleFr : pathway.titleEn}
                  </h3>
                  <p className="text-xs text-[#A9ADA5] leading-relaxed">
                    {isFr ? pathway.summaryFr : pathway.summaryEn}
                  </p>

                  <ul className="space-y-1.5 pt-2 border-t border-white/10">
                    {(isFr ? pathway.topicsFr : pathway.topicsEn).map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-xs text-[#F4F1E8]/90">
                        <span className="text-[#B8F000] font-bold">▪</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Action */}
              <div className="px-5 py-3.5 bg-white/[0.03] border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-[#B8F000] group-hover:text-white transition-colors">
                <span>{isFr ? 'Ouvrir ce parcours' : 'Start this pathway'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: VISUAL EXPLORER OF THE ELECTRICAL POWER SYSTEM (9 STAGES)
          ===================================================================== */}
      <section className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <DynamicSectionBackground
          photos={HOMEPAGE_IMAGE_LIBRARY.substations}
          overlayOpacityClass="bg-[#102A43]/70"
          locale={locale}
          showCaptionBadge={true}
          className="p-6 sm:p-10 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#B8F000] uppercase tracking-wider">
              <Activity className="w-4 h-4 text-[#B8F000]" />
              <span>{isFr ? 'EXPLORATEUR VISUEL DU SYSTÈME ÉLECTRIQUE' : 'VISUAL ELECTRICAL POWER SYSTEM EXPLORER'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
              {isFr
                ? 'Les 9 Étapes de la Chaîne Électrique : de la Centrale à la Prise'
                : 'Follow Electricity Across All 9 Stages of the Power System'}
            </h2>
            <p className="text-sm text-[#A9ADA5] max-w-3xl">
              {isFr
                ? 'Cliquez sur n’importe quelle étape ci-dessous pour observer sa photographie réelle, son rôle, son principe de fonctionnement, ses équipements principaux et son application au Cameroun.'
                : 'Click any stage below to inspect its real-world photograph, purpose, operating principle, main equipment, and application in Cameroon.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView('journey')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#102A43] text-white font-mono text-xs font-bold border border-white/20 hover:border-[#B8F000] transition-colors shrink-0 cursor-pointer backdrop-blur-md"
          >
            <span>{isFr ? 'Ouvrir l’Explorateur Plein Écran' : 'Open Full System Explorer'}</span>
            <ArrowRight className="w-4 h-4 text-[#B8F000]" />
          </button>
        </div>

        {/* Connected 9-Stage Horizontal Flowchart */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {NINE_POWER_STAGES.map((stage, idx) => {
            const isSelected = idx === selectedStageIdx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageIdx(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#B8F000] text-[#102A43] border-[#B8F000] shadow-[0_0_15px_rgba(184,240,0,0.35)] font-black'
                    : 'bg-white/[0.04] text-[#F7F8F5] border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className={`font-mono text-[10px] font-black px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-[#102A43] text-[#B8F000]' : 'bg-white/[0.06] text-[#B8F000]'
                    }`}
                  >
                    {stage.num}
                  </span>
                  {idx < NINE_POWER_STAGES.length - 1 && (
                    <span className={`font-mono text-xs ${isSelected ? 'text-[#102A43]' : 'text-[#A9ADA5]'}`}>
                      →
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold leading-snug line-clamp-2">
                  {isFr ? stage.titleFr : stage.titleEn}
                </div>
                <div
                  className={`text-[10px] font-mono mt-1.5 truncate ${
                    isSelected ? 'text-[#102A43]/80 font-bold' : 'text-[#A9ADA5]'
                  }`}
                >
                  {stage.voltage}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detailed Visual Inspection Panel */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Real Photograph */}
          <div className="lg:col-span-5 relative min-h-[280px] sm:min-h-[340px] bg-gradient-to-br from-[#0B192C] to-[#102A43] flex items-center justify-center">
            {activeStage.imageUrl ? (
              <img
                src={activeStage.imageUrl}
                alt={isFr ? activeStage.titleFr : activeStage.titleEn}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center p-8 text-center select-none">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Zap className="w-7 h-7 text-[#B8F000]/60" />
                </div>
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                  {isFr ? 'Photographie Haute Définition en attente' : 'High-definition photo pending'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <span className="inline-block px-2.5 py-1 rounded-md bg-black/50 border border-[#B8F000]/40 font-mono text-xs font-bold text-[#B8F000] backdrop-blur-sm">
                {isFr ? `ÉTAPE ${activeStage.num} · ${activeStage.voltage}` : `STAGE ${activeStage.num} · ${activeStage.voltage}`}
              </span>
              <h3 className="text-xl font-black text-[#F4F1E8]">
                {isFr ? activeStage.titleFr : activeStage.titleEn}
              </h3>
            </div>
          </div>

          {/* Right Explanation, Purpose, Equipment & Cameroon Context */}
          <div className="lg:col-span-7 p-6 sm:p-7 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-[#F4F1E8] leading-relaxed font-medium">
                {isFr ? activeStage.explanationFr : activeStage.explanationEn}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <div className="text-[11px] font-mono font-bold text-[#B8F000] uppercase tracking-wider">
                    {isFr ? 'POURQUOI CETTE ÉTAPE EXISTE (RÔLE)' : 'PURPOSE IN THE POWER SYSTEM'}
                  </div>
                  <p className="text-xs text-[#A9ADA5] leading-relaxed">
                    {isFr ? activeStage.purposeFr : activeStage.purposeEn}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <div className="text-[11px] font-mono font-bold text-[#B8F000] uppercase tracking-wider">
                    {isFr ? 'PRINCIPE PHYSIQUE' : 'OPERATING PRINCIPLE'}
                  </div>
                  <p className="text-xs text-[#A9ADA5] leading-relaxed">
                    {isFr ? activeStage.principleFr : activeStage.principleEn}
                  </p>
                </div>
              </div>

              {/* Main Equipment Chips */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-[#A9ADA5] uppercase tracking-wider">
                  {isFr ? 'ÉQUIPEMENTS PRINCIPAUX DE CETTE ÉTAPE :' : 'MAIN EQUIPMENT AT THIS STAGE:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(isFr ? activeStage.equipmentFr : activeStage.equipmentEn).map((eq) => (
                    <span
                      key={eq}
                      className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-[#F4F1E8]"
                    >
                      ⚡ {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cameroon Real-World Example */}
              <div className="p-3.5 rounded-xl bg-[#102A43]/60 border border-[#B8F000]/30 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B8F000] shrink-0 mt-0.5" />
                <div className="text-xs text-[#F4F1E8] leading-relaxed">
                  <strong className="text-[#B8F000] font-mono uppercase mr-1.5">
                    {isFr ? 'Exemple au Cameroun :' : 'Cameroon Application:'}
                  </strong>
                  {isFr ? activeStage.cameroonContextFr : activeStage.cameroonContextEn}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onSelectDomain(activeStage.domainCode)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B8F000] hover:bg-[#c9f826] text-[#102A43] font-black text-xs uppercase tracking-wider transition-all shadow-[0_8px_20px_rgba(184,240,0,0.3)] cursor-pointer"
              >
                <span>
                  {isFr
                    ? `Étudier le Domaine ${activeStage.domainCode} en détail`
                    : `Explore Domain ${activeStage.domainCode} Lesson`}
                </span>
                <ArrowRight className="w-4 h-4 text-[#102A43]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onNavigateJourney) onNavigateJourney(activeStage.journeyStage);
                  else onNavigateView('journey');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#B8F000] hover:text-white transition-colors cursor-pointer"
              >
                <span>{isFr ? 'Voir sur le schéma interactif' : 'Inspect on Interactive SLD'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        </DynamicSectionBackground>
      </section>

      {/* =====================================================================
          SECTION 5: DISCOVER ELECTRICAL EQUIPMENT (VISUAL CATALOGUE PREVIEW)
          ===================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#D7A64A] uppercase tracking-wider">
              <Wrench className="w-4 h-4" />
              <span>{isFr ? 'DE LA THÉORIE AU MATÉRIEL RÉEL' : 'FROM THEORY TO PHYSICAL HARDWARE'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
              {isFr
                ? 'Découvrir les Équipements Électriques (Photo, Anatomie & Symbole)'
                : 'Discover Electrical Equipment: Photo, Internal Anatomy & Symbol'}
            </h2>
            <p className="text-sm text-[#A9ADA5] max-w-3xl">
              {isFr
                ? 'Chaque équipement possède une fiche visuelle complète expliquant son rôle, son principe de fonctionnement, ses composants internes, son symbole électrique et son installation réelle.'
                : 'Every piece of electrical equipment has a dedicated visual learning page explaining its role, operating principle, internal construction, electrical symbol, and real installation.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView('equipment-list')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#102A43] text-white font-mono text-xs font-bold border border-white/20 hover:border-[#B8F000] transition-colors shrink-0 cursor-pointer backdrop-blur-md"
          >
            <span>{isFr ? 'Voir tout le Catalogue d’Équipements' : 'Browse Full Equipment Catalogue'}</span>
            <ArrowRight className="w-4 h-4 text-[#B8F000]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_EQUIPMENT.map((eq) => (
            <div
              key={eq.id}
              onClick={() => onSelectEquipment(eq.id)}
              className="group rounded-2xl bg-[#102A43]/40 border border-white/10 hover:border-[#B8F000]/50 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#102A43]/70 to-[#0B192C]/90 flex items-center justify-center">
                  {eq.imageUrl ? (
                    <img
                      src={eq.imageUrl}
                      alt={isFr ? eq.nameFr : eq.nameEn}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 border-b border-white/10 select-none">
                      <Cpu className="w-8 h-8 text-[#B8F000]/40 mb-2" />
                      <span className="text-[10px] font-mono text-white/35 tracking-widest uppercase">
                        {isFr ? 'Photographie Équipement en attente' : 'Equipment photo pending'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-black/40 border border-[#D7A64A]/40 font-mono text-[11px] font-bold text-[#D7A64A] backdrop-blur-sm">
                      {eq.voltageBadge}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-black/40 border border-white/20 font-mono text-[10px] font-bold text-[#F4F1E8] backdrop-blur-sm">
                      {eq.iecSymbolLabel}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-black text-[#F4F1E8] group-hover:text-[#B8F000] transition-colors">
                    {isFr ? eq.nameFr : eq.nameEn}
                  </h3>

                  <p className="text-xs text-[#F4F1E8]/90 leading-relaxed">
                    {isFr ? eq.roleFr : eq.roleEn}
                  </p>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                    <div className="text-[10px] font-mono font-bold text-[#B8F000] uppercase tracking-wider">
                      {isFr ? 'CE QUE VOUS VERREZ À L’INTÉRIEUR :' : 'INTERNAL CONSTRUCTION & ANATOMY:'}
                    </div>
                    <p className="text-xs text-[#A9ADA5] leading-snug">
                      {isFr ? eq.insideAnatomyFr : eq.insideAnatomyEn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-white/[0.03] border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-[#B8F000] group-hover:text-white transition-colors">
                <span>{isFr ? 'Ouvrir la leçon visuelle (10 sections)' : 'Open Visual Equipment Lesson'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: ENGINEERING CONCEPTS & COMPLETE SYSTEMS IN PRACTICE
          ("HOW DIFFERENT COMPONENTS WORK TOGETHER: 3-PHASE MOTOR STARTER")
          ===================================================================== */}
      <section className="relative rounded-3xl border border-white/10 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
        <DynamicSectionBackground
          photos={HOMEPAGE_IMAGE_LIBRARY.installations}
          overlayOpacityClass="bg-[#102A43]/65"
          locale={locale}
          showCaptionBadge={true}
          className="p-6 sm:p-10 space-y-6"
        >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#B8F000] uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-[#B8F000]" />
              <span>{isFr ? 'COMPRENDRE LES SYSTÈMES COMPLETS' : 'FROM ISOLATED PARTS TO COMPLETE SYSTEMS'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
              {isFr
                ? 'Comment les Équipements Travaillent Ensemble : Démarrage d’un Moteur Triphasé'
                : 'How Equipment Works Together: Complete 3-Phase Motor Starter System'}
            </h2>
            <p className="text-sm text-[#A9ADA5] max-w-3xl">
              {isFr
                ? 'Connaître séparément un disjoncteur, un contacteur et un relais thermique ne suffit pas. Cliquez sur chaque appareil de la chaîne ci-dessous pour comprendre comment le circuit de puissance (400 V) et le circuit de commande (24 V / 230 V) coopèrent.'
                : 'Knowing a circuit breaker, a contactor, and a thermal relay separately is not enough. Click each device in the chain below to understand how the 400 V power circuit and the control circuit work together as one complete installation.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView('industrial-projects')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#102A43] text-white font-mono text-xs font-bold border border-white/20 hover:border-[#B8F000] transition-colors shrink-0 cursor-pointer backdrop-blur-md"
          >
            <span>{isFr ? 'Explorer le Génie Industriel' : 'Explore Industrial Engineering'}</span>
            <ArrowRight className="w-4 h-4 text-[#B8F000]" />
          </button>
        </div>

        {/* Interactive 5-Element Complete Motor Starter Chain */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {MOTOR_STARTER_CHAIN.map((item, idx) => {
            const isSelected = idx === selectedStarterIdx;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setSelectedStarterIdx(idx)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#B8F000] text-[#102A43] border-[#B8F000] shadow-[0_0_15px_rgba(184,240,0,0.35)] font-black'
                    : 'bg-white/[0.04] text-[#F7F8F5] border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#102A43] text-[#B8F000]' : 'bg-white/[0.06] text-[#B8F000]'
                    }`}
                  >
                    {item.code}
                  </span>
                  {idx < MOTOR_STARTER_CHAIN.length - 1 && (
                    <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#102A43]' : 'text-[#B8F000]'}`}>
                      ──►
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold leading-snug">
                  {isFr ? item.nameFr : item.nameEn}
                </div>
                <div
                  className={`text-[10px] font-mono mt-2 pt-2 border-t ${
                    isSelected
                      ? 'border-[#102A43]/20 text-[#102A43]/90 font-bold'
                      : 'border-white/10 text-[#A9ADA5]'
                  }`}
                >
                  {item.terminals}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Explanation of the Selected Element in the Motor Starter System */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-[#B8F000]/40 font-mono text-xs font-black text-[#B8F000] backdrop-blur-sm">
                {activeStarterItem.symbolText}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/15 font-mono text-xs text-[#F4F1E8]">
                {isFr ? 'Bornes :' : 'Terminals:'} {activeStarterItem.terminals}
              </span>
            </div>

            <h3 className="text-xl font-black text-[#F4F1E8]">
              {isFr ? activeStarterItem.nameFr : activeStarterItem.nameEn}
            </h3>

            <p className="text-sm text-[#F4F1E8]/90 leading-relaxed">
              {isFr ? activeStarterItem.roleFr : activeStarterItem.roleEn}
            </p>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="text-[11px] font-mono font-bold text-[#B8F000] uppercase tracking-wider">
                {isFr ? 'INTERACTION PUISSANCE / COMMANDE' : 'HOW IT INTERACTS WITH THE REST OF THE CIRCUIT'}
              </div>
              <p className="text-xs text-[#A9ADA5] leading-relaxed">
                {isFr ? activeStarterItem.principleFr : activeStarterItem.principleEn}
              </p>
            </div>
          </div>

          {/* Right Schematic Diagram Box */}
          <div className="lg:col-span-5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-5 space-y-3 font-mono text-xs">
            <div className="text-[11px] font-bold text-[#B8F000] uppercase tracking-wider border-b border-white/10 pb-2">
              {isFr ? 'ARCHITECTURE DU DÉPART MOTEUR (CEI 60947-4-1)' : 'MOTOR STARTER COORDINATION (IEC 60947-4-1)'}
            </div>
            <div className="space-y-2 text-[#F4F1E8]">
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/10">
                <span className="text-[#A9ADA5]">{isFr ? '1. Circuit de Puissance :' : '1. Power Circuit:'}</span>
                <span className="font-bold text-[#B8F000]">L1/L2/L3 → Q1 → KM1 → F1 → M1</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/10">
                <span className="text-[#A9ADA5]">{isFr ? '2. Circuit de Commande :' : '2. Control Circuit:'}</span>
                <span className="font-bold text-[#F4F1E8]">F1(95-96) → Stop(S0) → Start(S1//13-14) → A1-A2</span>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onSelectEquipment(activeStarterItem.equipmentId)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8F000] hover:text-white transition-colors cursor-pointer"
              >
                <span>{isFr ? 'Voir la fiche de cet appareil' : 'Inspect this component'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateView('simulation')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#B8F000] transition-colors cursor-pointer"
              >
                <span>{isFr ? 'Simuler le démarrage moteur' : 'Simulate Motor Start'}</span>
                <Play className="w-3.5 h-3.5 text-[#B8F000]" />
              </button>
            </div>
          </div>
        </div>
        </DynamicSectionBackground>
      </section>

      {/* =====================================================================
          SECTION 7: REAL-WORLD CAMEROONIAN & INDUSTRIAL APPLICATIONS
          ===================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#B8F000] uppercase tracking-wider">
              <Factory className="w-4 h-4 text-[#B8F000]" />
              <span>{isFr ? 'L’INGÉNIERIE EN PRATIQUE AU CAMEROUN' : 'REAL-WORLD ENGINEERING IN CAMEROON & AFRICA'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
              {isFr
                ? 'Relier les Concepts aux Infrastructures Réelles du Cameroun'
                : 'Connecting Engineering Principles to Real Cameroonian Infrastructure'}
            </h2>
            <p className="text-sm text-[#A9ADA5] max-w-3xl">
              {isFr
                ? 'EPEDE ancre chaque domaine technique dans le contexte réel des réseaux SONATREL, Eneo, EDC et des installations industrielles camerounaises.'
                : 'EPEDE grounds every technical concept in the real operational environment of Cameroon’s hydro plants, SONATREL transmission substations, Eneo distribution networks, and industrial facilities.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView('cameroon-grid')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#102A43] text-white font-mono text-xs font-bold border border-white/20 hover:border-[#B8F000] transition-colors shrink-0 cursor-pointer backdrop-blur-md"
          >
            <span>{isFr ? 'Explorer le Réseau Cameroun (RIS / RIN)' : 'Explore Cameroon Power Network'}</span>
            <ArrowRight className="w-4 h-4 text-[#B8F000]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              tag: 'HYDRO & THERMAL GENERATION',
              titleEn: 'Sanaga Hydro Cascade & Gas Plants',
              titleFr: 'Cascade de la Sanaga & Centrales Gaz',
              descEn:
                'Study how Song Loulou (384 MW), Nachtigal (420 MW), Edéa (276 MW), Memve’ele (211 MW), Lagdo (72 MW), and Kribi (216 MW) generate Cameroon’s electricity.',
              descFr:
                'Comprendre comment Song Loulou (384 MW), Nachtigal (420 MW), Édéa (276 MW), Memve’ele (211 MW), Lagdo (72 MW) et Kribi (216 MW) alimentent le pays.',
              imageUrl: '/images/homepage_uploads/batch_06_image_030.jpg',
              action: () => onNavigateView('cameroon-grid'),
            },
            {
              tag: 'SONATREL 225 kV / 90 kV GRID',
              titleEn: 'Interconnected Transmission Substations',
              titleFr: 'Postes d’Interconnexion SONATREL',
              descEn:
                'Inspect the 225 kV and 90 kV transmission corridors and substations supplying Yaoundé (Oyomabang, Nyom II, Ahala) and Douala (Bekoko, Logbaba, Koumassi).',
              descFr:
                'Explorer les corridors 225 kV / 90 kV et les postes sources alimentant Yaoundé (Oyomabang, Nyom II, Ahala) et Douala (Bekoko, Logbaba, Koumassi).',
              imageUrl: '/images/homepage_uploads/batch_02_image_008.jpg',
              action: () => onNavigateView('cameroon-grid'),
            },
            {
              tag: 'ENEO 15 kV / 30 kV / 400 V',
              titleEn: 'Urban RMUs & H61 Pole Transformers',
              titleFr: 'Réseaux HTA/BT, RMU & Poteaux H61',
              descEn:
                'Understand how 15 kV and 30 kV feeders, Ring Main Units, and pole-mounted H61 transformers step power down to 400 V / 230 V in neighborhoods.',
              descFr:
                'Découvrir le fonctionnement des boucles HTA 15 kV / 30 kV, des cellules RMU et des transformateurs sur poteau H61 jusque chez l’abonné.',
              imageUrl: '/images/homepage_uploads/batch_02_image_010.jpg',
              action: () => onSelectDomain('D05'),
            },
            {
              tag: 'INDUSTRIAL INSTALLATIONS',
              titleEn: 'Factories, TGBT Panels & Standby Gensets',
              titleFr: 'Usines, TGBT & Groupes de Secours',
              descEn:
                'Explore real industrial architectures: main LV switchboards (TGBT), motor control centers, automatic transfer switches (ATS), and synchronized diesel gensets.',
              descFr:
                'Étudier les installations industrielles réelles : TGBT, armoires moteurs, inverseurs normal/secours (ATS) et centrales électrogènes de secours.',
              imageUrl: '/images/homepage_uploads/batch_05_image_024.jpg',
              action: () => onNavigateView('industrial-projects'),
            },
          ].map((card) => (
            <div
              key={card.tag}
              onClick={card.action}
              className="group rounded-2xl bg-[#102A43]/40 border border-white/10 hover:border-[#B8F000]/50 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div>
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#102A43]/70 to-[#0B192C]/90 flex items-center justify-center">
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={isFr ? card.titleFr : card.titleEn}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 border-b border-white/10 select-none">
                      <Layers className="w-6 h-6 text-[#B8F000]/40 mb-1.5" />
                      <span className="text-[10px] font-mono text-white/35 tracking-widest uppercase">
                        {isFr ? 'Photographie Réseau en attente' : 'Grid photo pending'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/50 border border-[#B8F000]/40 font-mono text-[10px] font-bold text-[#B8F000] backdrop-blur-sm">
                    {card.tag}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-black text-[#F4F1E8] group-hover:text-[#B8F000] transition-colors">
                    {isFr ? card.titleFr : card.titleEn}
                  </h3>
                  <p className="text-xs text-[#A9ADA5] leading-relaxed">
                    {isFr ? card.descFr : card.descEn}
                  </p>
                </div>
              </div>
              <div className="px-5 py-3 bg-white/[0.03] border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-[#B8F000] group-hover:text-white transition-colors">
                <span>{isFr ? 'Explorer sur le terrain' : 'Explore Field Context'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 8: FINAL CALL TO ACTION — START EXPLORING
          ===================================================================== */}
      <section className="relative rounded-3xl border border-[#B8F000]/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <DynamicSectionBackground
          photos={HOMEPAGE_IMAGE_LIBRARY.automationScada}
          overlayOpacityClass="bg-[#102A43]/70"
          locale={locale}
          showCaptionBadge={true}
          className="p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono font-bold text-[#B8F000] uppercase tracking-widest">
              {isFr ? 'PRÊT À COMMENCER ?' : 'READY TO BEGIN YOUR JOURNEY?'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F1E8] tracking-tight">
              {isFr
                ? 'Apprenez le principe. Observez l’équipement. Visualisez le système.'
                : 'Learn the Principle. Understand the Equipment. Visualize the System.'}
            </h2>
            <p className="text-sm text-[#A9ADA5] leading-relaxed">
              {isFr
                ? 'Démarrez par le Parcours 01 (Fondamentaux de l’Électricité), explorez la chaîne électrique complète ou ouvrez le catalogue visuel des équipements.'
                : 'Start with Pathway 01 (Electrical Fundamentals), trace the 9-Stage Electrical Power System, or inspect real hardware in the Equipment Catalogue.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateView('thematic-journeys')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#B8F000] hover:bg-[#c9f826] text-[#102A43] font-black text-sm uppercase tracking-wider transition-all shadow-[0_10px_25px_rgba(184,240,0,0.35)] cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isFr ? 'Commencer à Apprendre' : 'Start Learning Pathways'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateView('journey')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#F7F8F5] font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#B8F000]" />
              <span>{isFr ? 'Explorer la Chaîne Électrique' : 'Explore Electrical Systems'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateView('equipment-list')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#F7F8F5] font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-[#B8F000]" />
              <span>{isFr ? 'Catalogue Équipements' : 'Browse Equipment'}</span>
            </button>
          </div>
        </DynamicSectionBackground>
      </section>
      </div>
    </div>
  );
};
