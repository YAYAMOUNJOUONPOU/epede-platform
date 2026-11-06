// src/components/home/HomeView.tsx
// EPEDE Master v2 Exact Match Homepage
// Implements design-reference/EPEDE Master v2.dc.html & HOMEPAGE-EXACT-MATCH.md

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { StageId } from '../journey/types';

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
  onNavigateCalculator?: (tab?: CalculatorTabType) => void;
  onNavigateSimulation?: (tab?: SimulationTabType) => void;
  onNavigateDiagram?: () => void;
}

// ---------------------------------------------------------------------------
// DATA DEFINITIONS (From design-reference/EPEDE Master v2.dc.html)
// ---------------------------------------------------------------------------

interface HeroSlide {
  f: string;
  tag: string;
  tagFR: string;
  cap: string;
  capFR: string;
  cr: string;
}

const HERO: HeroSlide[] = [
  { f: '/assets/production/hydro.jpg', tag: 'GENERATION', tagFR: 'PRODUCTION', cap: 'Hydroelectric dam & powerhouse', capFR: 'Barrage et centrale hydroélectrique', cr: 'Jeff Hitchcock · CC BY 2.0' },
  { f: '/assets/transmission/ehv.jpg', tag: 'TRANSMISSION · 380 kV', tagFR: 'TRANSPORT · 380 kV', cap: 'Line crossing, Ems', capFR: 'Croisement de lignes, Ems', cr: 'Smial · FAL' },
  { f: '/assets/substation/hv-outdoor.jpg', tag: 'SUBSTATION', tagFR: 'POSTE', cap: 'Outdoor switchyard · busbars & filters', capFR: 'Poste extérieur · jeux de barres et filtres', cr: 'Greg Goebel · CC BY-SA 2.0' },
  { f: '/assets/substation/gis.jpg', tag: 'SUBSTATION · GIS', tagFR: 'POSTE · PSEM', cap: 'Gas-insulated switchgear hall', capFR: 'Salle de poste sous enveloppe métallique', cr: 'Сайга · CC BY-SA 4.0' },
  { f: '/assets/distribution/pole-transformer.jpg', tag: 'DISTRIBUTION · 11 kV / 440 V', tagFR: 'DISTRIBUTION · 11 kV / 440 V', cap: 'Pole-mounted transformer', capFR: 'Transformateur sur poteau', cr: 'T. A. Gonsalves · CC BY-SA 4.0' },
  { f: '/assets/industrial/mcc-technician.jpg', tag: 'INSTALLATIONS · MCC', tagFR: 'INSTALLATIONS · CCM', cap: 'Wiring a motor control centre', capFR: 'Câblage d’un centre de commande moteurs', cr: 'MTA Capital Construction · CC BY 2.0' },
  { f: '/assets/automation/scada.jpg', tag: 'AUTOMATION · SCADA', tagFR: 'AUTOMATISME · SCADA', cap: 'SCADA control room', capFR: 'Salle de supervision SCADA', cr: 'Z22 · CC BY-SA 4.0' }
];

interface JourneyStageDef {
  num: string;
  shortEN: string;
  shortFR: string;
  titleEN: string;
  titleFR: string;
  volt: string;
  domain: DomainCode;
  linkTextEN: string;
  linkTextFR: string;
  img: string;
  cap: string;
  purposeEN: string;
  purposeFR: string;
  appEN: string[];
  appFR: string[];
}

const STAGES: JourneyStageDef[] = [
  {
    num: '01',
    shortEN: 'Generation', shortFR: 'Production',
    titleEN: 'Generation', titleFR: 'Production',
    volt: '15 kV', domain: 'D01',
    linkTextEN: 'Generation', linkTextFR: 'Production',
    img: '/assets/production/hydro-grand-coulee.jpg',
    cap: 'Dam spillway, Grand Coulee · David Brodbeck · CC BY 2.0',
    purposeEN: 'Hydro, thermal and solar plants convert primary energy into electrical energy at generator voltage, held steady by governor and excitation control.',
    purposeFR: 'Les centrales hydroélectriques, thermiques et solaires convertissent l’énergie primaire en énergie électrique à la tension de l’alternateur, sous le contrôle du régulateur et de l’excitation.',
    appEN: ['Turbine / prime mover', 'Synchronous generator', 'Excitation system', 'Generator circuit breaker'],
    appFR: ['Turbine / moteur primaire', 'Alternateur synchrone', 'Système d’excitation', 'Disjoncteur de groupe']
  },
  {
    num: '02',
    shortEN: 'Step-up', shortFR: 'Élévation',
    titleEN: 'Step-up transformation', titleFR: 'Transformation élévatrice',
    volt: '15 → 225 kV', domain: 'D02',
    linkTextEN: 'Transformation', linkTextFR: 'Transformation',
    img: '/assets/substation/equipment.jpg',
    cap: 'CTs, VTs & breakers, Kimanis · CEphoto, Uwe Aranas · CC BY-SA 3.0',
    purposeEN: 'Step-up transformers raise the voltage so the same power travels with far less current — and far lower line losses.',
    purposeFR: 'Les transformateurs élévateurs augmentent la tension pour que la même puissance circule avec un courant bien plus faible et moins de pertes en ligne.',
    appEN: ['Step-up transformer', 'Surge arresters', 'HV circuit breaker', 'Bushings & CTs'],
    appFR: ['Transformateur élévateur', 'Parafoudres', 'Disjoncteur HT', 'Traversées & TC']
  },
  {
    num: '03',
    shortEN: 'Transmission', shortFR: 'Transport HT',
    titleEN: 'High-voltage transmission', titleFR: 'Transport haute tension',
    volt: '225 kV', domain: 'D03',
    linkTextEN: 'Transmission', linkTextFR: 'Transport',
    img: '/assets/transmission/hv-line.jpg',
    cap: '750 kV anchor pylon · Novoklimov · CC0',
    purposeEN: 'Bulk power crosses long corridors on overhead lines. Line protection, reactive compensation and right-of-way define what a corridor can carry.',
    purposeFR: 'La puissance en vrac traverse de longs corridors sur lignes aériennes. Protections de ligne, compensation réactive et emprise définissent sa capacité.',
    appEN: ['Overhead conductors', 'Lattice towers & insulators', 'Distance protection', 'Shunt reactors'],
    appFR: ['Conducteurs aériens', 'Pylônes treillis & isolateurs', 'Protection de distance', 'Réactances shunt']
  },
  {
    num: '04',
    shortEN: 'Substation', shortFR: 'Poste',
    titleEN: 'Transmission substation', titleFR: 'Poste de transport',
    volt: '225 / 90 kV', domain: 'D04',
    linkTextEN: 'Substations', linkTextFR: 'Postes',
    img: '/assets/substation/hv-outdoor.jpg',
    cap: 'Outdoor switchyard, Denver · Greg Goebel · CC BY-SA 2.0',
    purposeEN: 'Grid nodes switch, transform, measure and protect. Every bay pairs primary equipment with protection and control.',
    purposeFR: 'Les nœuds du réseau commutent, transforment, mesurent et protègent. Chaque travée associe appareillage primaire et contrôle-commande.',
    appEN: ['Busbars & disconnectors', 'Power transformers', 'CTs / VTs', 'Protection relays'],
    appFR: ['Jeux de barres & sectionneurs', 'Transformateurs de puissance', 'TC / TT', 'Relais de protection']
  },
  {
    num: '05',
    shortEN: 'Sub-transmission', shortFR: 'Répartition',
    titleEN: 'Sub-transmission network', titleFR: 'Réseau de répartition',
    volt: '90 kV', domain: 'D05',
    linkTextEN: 'Sub-transmission', linkTextFR: 'Répartition',
    img: '/assets/transmission/to-substation.jpg',
    cap: 'Lines entering a substation, Mabelvale · Nickthestick26 · CC BY-SA 3.0',
    purposeEN: 'Regional networks carry power from the main grid to load centres, balancing capacity, losses and security of supply.',
    purposeFR: 'Les réseaux régionaux acheminent l’énergie du réseau principal vers les centres de consommation, en équilibrant capacité, pertes et sécurité d’alimentation.',
    appEN: ['90 kV lines', 'Regional substations', 'On-load tap changers', 'Telecontrol RTUs'],
    appFR: ['Lignes 90 kV', 'Postes régionaux', 'Régleurs en charge', 'RTU de téléconduite']
  },
  {
    num: '06',
    shortEN: 'MV distribution', shortFR: 'Distribution HTA',
    titleEN: 'Medium-voltage distribution', titleFR: 'Distribution moyenne tension',
    volt: '30 kV', domain: 'D06',
    linkTextEN: 'MV distribution', linkTextFR: 'Distribution HTA',
    img: '/assets/substation/indoor.jpg',
    cap: '20 kV indoor switchgear · Izma94 · CC BY-SA 4.0',
    purposeEN: 'Feeders leave primary substations and loop through ring main units towards towns, districts and industrial sites.',
    purposeFR: 'Les départs quittent les postes sources et bouclent par des postes en coupure d’artère vers villes, quartiers et sites industriels.',
    appEN: ['MV feeders', 'Ring main units', 'Reclosers', 'MV switchgear'],
    appFR: ['Départs HTA', 'Cellules RMU', 'Disjoncteurs-réenclencheurs', 'Cellules HTA']
  },
  {
    num: '07',
    shortEN: 'LV distribution', shortFR: 'Distribution BT',
    titleEN: 'Low-voltage distribution', titleFR: 'Distribution basse tension',
    volt: '400 V', domain: 'D07',
    linkTextEN: 'LV distribution', linkTextFR: 'Distribution BT',
    img: '/assets/distribution/pole-transformer.jpg',
    cap: 'Pole-mounted transformer, Coorg · T. A. Gonsalves · CC BY-SA 4.0',
    purposeEN: 'Distribution transformers step down to low voltage, and LV boards share the supply out to the final user.',
    purposeFR: 'Les transformateurs de distribution abaissent en basse tension et les tableaux BT répartissent l’alimentation vers l’usager final.',
    appEN: ['Distribution transformer', 'LV board', 'Service cables', 'Metering'],
    appFR: ['Transformateur de distribution', 'Tableau BT', 'Câbles de branchement', 'Comptage']
  },
  {
    num: '08',
    shortEN: 'Installations', shortFR: 'Installations',
    titleEN: 'Electrical installations', titleFR: 'Installations électriques',
    volt: '400 / 230 V', domain: 'D08',
    linkTextEN: 'Installations', linkTextFR: 'Installations',
    img: '/assets/industrial/mcc.jpg',
    cap: '480 V motor control centre · Wtshymanski · CC BY-SA 3.0',
    purposeEN: 'Inside buildings and plants, switchboards, protective devices and earthing make energy safe at the point of use.',
    purposeFR: 'Dans les bâtiments et usines, tableaux, dispositifs de protection et mise à la terre rendent l’énergie sûre au point d’utilisation.',
    appEN: ['Main LV switchboard', 'Breakers & RCDs', 'Motor starters', 'Earthing'],
    appFR: ['TGBT', 'Disjoncteurs & DDR', 'Démarreurs moteurs', 'Mise à la terre']
  },
  {
    num: '09',
    shortEN: 'Automation', shortFR: 'Automatisme',
    titleEN: 'Automation & control', titleFR: 'Automatisme & contrôle-commande',
    volt: '24 V DC', domain: 'D09',
    linkTextEN: 'Automation', linkTextFR: 'Automatisme',
    img: '/assets/automation/scada.jpg',
    cap: 'SCADA control room, NEWater · Z22 · CC BY-SA 4.0',
    purposeEN: 'PLCs, drives and SCADA supervise the whole chain — keeping control signals and process values separate from the power path.',
    purposeFR: 'Automates, variateurs et SCADA supervisent toute la chaîne — en séparant signaux de commande et valeurs process du chemin de puissance.',
    appEN: ['PLC / DCS', 'Variable-speed drives', 'SCADA HMI', 'Field instrumentation'],
    appFR: ['API / SNCC', 'Variateurs de fréquence', 'IHM SCADA', 'Instrumentation terrain']
  }
];

interface PathwayDef {
  img: string;
  cr: string;
  tagEN: string;
  tagFR: string;
  titleEN: string;
  titleFR: string;
  descEN: string;
  descFR: string;
  topicsEN: string[];
  topicsFR: string[];
  audience: string[];
}

const PATHWAYS: PathwayDef[] = [
  {
    img: '/assets/installations/lighting-routing.jpg',
    cr: 'KVDP · Public domain',
    tagEN: 'Foundations', tagFR: 'Débutant & Bases',
    titleEN: 'Electrical fundamentals', titleFR: 'Fondamentaux de l’électricité',
    descEN: 'Understand the physics before the formulas: charge, voltage, current, resistance, power vs energy, AC/DC, single- and three-phase.',
    descFR: 'Comprendre concrètement les phénomènes physiques avant les formules : charge, tension, courant, résistance, puissance vs énergie, AC/DC, monophasé et triphasé.',
    topicsEN: ['Voltage (V), current (A) and resistance (Ω)', 'Ohm’s law and how a circuit works', 'Power (W / kVA) vs energy (kWh)', 'Direct (DC) vs alternating current (AC 50 Hz)', 'Single-phase (230 V) vs three-phase (400 V)', 'Power factor (cos φ)'],
    topicsFR: ['Tension (V), courant (A) et résistance (Ω)', 'Loi d’Ohm et fonctionnement d’un circuit', 'Puissance (W / kVA) vs énergie (kWh)', 'Courant continu (DC) vs alternatif (AC 50 Hz)', 'Monophasé (230 V) vs triphasé (400 V)', 'Facteur de puissance (cos φ)'],
    audience: ['Students', 'All']
  },
  {
    img: '/assets/substation/breakers.jpg',
    cr: 'KaiBorgeest · CC BY-SA 4.0',
    tagEN: 'Key equipment', tagFR: 'Équipements clés',
    titleEN: 'Electrical components & equipment', titleFR: 'Composants & équipements électriques',
    descEN: 'Look inside real equipment: photographs, internal anatomy, operating principle, electrical symbol and field installation.',
    descFR: 'Observer l’intérieur du matériel réel : photographie, anatomie interne, principe de fonctionnement, symbole électrique et installation sur le terrain.',
    topicsEN: ['Circuit breakers and fuses', 'Contactors and thermal overload relays', 'Power and distribution transformers', 'Electric motors and alternators', 'Current (CT) and voltage (VT) transformers', 'MV/LV switchgear and power cables'],
    topicsFR: ['Disjoncteurs et fusibles', 'Contacteurs et relais thermiques', 'Transformateurs de puissance et de distribution', 'Moteurs électriques et alternateurs', 'Transformateurs de courant (TC) et de tension (TT)', 'Cellules HTA/BT et câbles électriques'],
    audience: ['Technicians', 'Engineers', 'All']
  },
  {
    img: '/assets/installations/cable-tray.jpg',
    cr: 'Santeri Viinamäki · CC BY-SA 4.0',
    tagEN: 'Field practice', tagFR: 'Pratique terrain',
    titleEN: 'Electrical installations (residential & commercial)', titleFR: 'Installations électriques (bâtiment & tertiaire)',
    descEN: 'Master domestic, commercial and industrial installation work: lighting, sockets, switchboards, earthing and protection.',
    descFR: 'Maîtriser la réalisation des installations domestiques, tertiaires et industrielles : éclairage, prises, tableaux, mise à la terre et protections.',
    topicsEN: ['Residential and commercial installations', 'Lighting and socket-outlet circuits', 'Distribution boards and main LV switchboard', 'Earth electrodes and earthing systems (TT, TN, IT)', 'RCDs (30 mA) and circuit breakers', 'Cable routing and sizing'],
    topicsFR: ['Installations résidentielles et tertiaires', 'Circuits d’éclairage et prises de courant', 'Tableaux de répartition et TGBT', 'Prises de terre et régimes de neutre (TT, TN, IT)', 'Dispositifs différentiels (DDR 30 mA) et disjoncteurs', 'Cheminement et dimensionnement des câbles'],
    audience: ['Students', 'Technicians', 'All']
  },
  {
    img: '/assets/production/wind.jpg',
    cr: 'Kim Hansen · CC BY-SA 3.0',
    tagEN: 'Generation', tagFR: 'Production',
    titleEN: 'Electrical power generation', titleFR: 'Production d’énergie électrique',
    descEN: 'See how hydro, thermal, solar and wind plants produce electricity, regulate voltage (AVR) and synchronise to the grid.',
    descFR: 'Découvrir comment les centrales hydroélectriques, thermiques, solaires et éoliennes produisent l’électricité, règlent la tension (AVR) et se couplent au réseau.',
    topicsEN: ['Hydroelectric plants (Song Loulou, Nachtigal)', 'Thermal and gas plants (Kribi, Logbaba)', 'Solar PV and wind plants', 'Synchronous generators (rotor / stator)', 'Excitation systems (AVR) and 50 Hz control', 'Grid synchronisation (ANSI 25)'],
    topicsFR: ['Centrales hydroélectriques (Song Loulou, Nachtigal)', 'Centrales thermiques et à gaz (Kribi, Logbaba)', 'Centrales solaires PV et éoliennes', 'Alternateurs synchrones (rotor / stator)', 'Systèmes d’excitation (AVR) et réglage 50 Hz', 'Couplage et synchronisation au réseau (ANSI 25)'],
    audience: ['Students', 'Engineers', 'All']
  },
  {
    img: '/assets/transmission/oregon.jpg',
    cr: 'Flickr contributor · CC BY 2.0',
    tagEN: 'HV transmission', tagFR: 'Transport HTB',
    titleEN: 'High-voltage transmission & substations', titleFR: 'Transport haute tension & postes HTB',
    descEN: 'Explore 90 kV / 225 kV lines, towers, insulators, transformer substations, power transformers and HV bays.',
    descFR: 'Explorer les lignes haute tension (90 kV / 225 kV), pylônes, isolateurs, postes de transformation, transformateurs de puissance et travées HTB.',
    topicsEN: ['HV networks (90 kV, 110 kV, 225 kV)', 'Towers, AAAC/ACSR conductors and insulators', 'Air-insulated (AIS) and gas-insulated (GIS) substations', 'Power transformers and autotransformers', 'SF6 breakers, disconnectors and interlocking', 'Distance (21) and differential (87) protection'],
    topicsFR: ['Réseaux haute tension (90 kV, 110 kV, 225 kV)', 'Pylônes, conducteurs Almelec/ACSR et isolateurs', 'Postes HTB ouverts (AIS) et blindés (GIS)', 'Transformateurs de puissance et autotransformateurs', 'Disjoncteurs SF6, sectionneurs et verrouillages', 'Protections de distance (21) et différentielle (87)'],
    audience: ['Students', 'Technicians', 'Engineers', 'All']
  },
  {
    img: '/assets/distribution/transformer.jpg',
    cr: 'Sukkoria · CC BY-SA 4.0',
    tagEN: 'MV / LV distribution', tagFR: 'Distribution MT / BT',
    titleEN: 'Electrical distribution (MV & LV networks)', titleFR: 'Distribution électrique (réseaux HTA & BT)',
    descEN: 'Follow electricity from 15 kV / 30 kV MV networks, ring main units and pole-mounted H61 substations to 400 V / 230 V service connections.',
    descFR: 'Suivre l’électricité depuis les réseaux HTA (15 kV / 30 kV), les cellules RMU et les postes sur poteau H61 jusqu’aux branchements basse tension 400 V / 230 V.',
    topicsEN: ['MV networks (15 kV, 20 kV, 30 kV)', 'Ring main units and looped MV switchboards', 'Pole-mounted (H61) and kiosk MV/LV transformers', 'Overhead bundled and underground LV networks', 'LV boards, cut-out boxes and metering', 'Customer service connections'],
    topicsFR: ['Réseaux moyenne tension HTA (15 kV, 20 kV, 30 kV)', 'Cellules RMU et tableaux HTA en boucle', 'Transformateurs MT/BT sur poteau (H61) et en cabine', 'Réseaux basse tension aériens torsadés et souterrains', 'Tableaux BT, coffrets de coupure et comptage', 'Branchements des abonnés'],
    audience: ['Technicians', 'Engineers', 'All']
  },
  {
    img: '/assets/industrial/control-panel.jpg',
    cr: 'Bridgeland · CC BY-SA 3.0',
    tagEN: 'Industrial electrical', tagFR: 'Électricité industrielle',
    titleEN: 'Industrial electrical engineering & automation', titleFR: 'Génie électrique industriel & automatisme',
    descEN: 'Move from single components to complete industrial systems: three-phase motors, starters, VFDs, PLCs, sensors and SCADA.',
    descFR: 'Passer des composants isolés aux systèmes industriels complets : moteurs triphasés, démarreurs, variateurs VFD, automates PLC, capteurs et SCADA.',
    topicsEN: ['Three-phase induction motors and star/delta connection', 'Direct-on-line and star-delta starters (power + control)', 'Variable-frequency drives (VFD) and soft starters', 'Programmable logic controllers (PLC) and 24 V DC control', 'Industrial sensors, instrumentation and actuators', 'SCADA supervision and industrial maintenance'],
    topicsFR: ['Moteurs asynchrones triphasés et couplages étoile/triangle', 'Démarreurs directs et étoile-triangle (puissance + commande)', 'Variateurs de vitesse (VFD) et démarreurs progressifs', 'Automates programmables (API / PLC) et commande 24 V DC', 'Capteurs industriels, instrumentation et actionneurs', 'Supervision SCADA et maintenance industrielle'],
    audience: ['Technicians', 'Engineers', 'All']
  },
  {
    img: '/assets/installations/electrician.jpg',
    cr: 'MTA Capital Construction · CC BY 2.0',
    tagEN: 'Diagrams & safety', tagFR: 'Schémas & sécurité',
    titleEN: 'Electrical diagrams, standards & safety', titleFR: 'Schémas électriques, normes & sécurité',
    descEN: 'Learn to read single-line, power and control diagrams, IEC 60617 symbols, terminal strips, LOTO isolation and safety.',
    descFR: 'Apprendre à lire un schéma unifilaire, un schéma de puissance et de commande, les symboles CEI 60617, les borniers, la consignation LOTO et la sécurité.',
    topicsEN: ['Standard electrical symbols (IEC 60617)', 'Single-line vs multi-line diagrams', 'Power vs control diagrams', 'Conductor marking, terminals and layout', 'Protection against direct and indirect contact', 'Lockout (LOTO), PPE and arc-flash risk'],
    topicsFR: ['Symboles électriques normalisés (CEI 60617)', 'Schémas unifilaires vs schémas multifilaires', 'Schémas de puissance vs schémas de commande', 'Repérage des conducteurs, borniers et implantation', 'Protection contre les contacts directs et indirects', 'Consignation (LOTO), EPI et risque d’arc électrique'],
    audience: ['Students', 'Technicians', 'Engineers', 'All']
  }
];

interface ProjectCard {
  slot: string;
  img: string;
  metaEN: string;
  metaFR: string;
  titleEN: string;
  titleFR: string;
  descEN: string;
  descFR: string;
  ctaEN: string;
  ctaFR: string;
  domain: DomainCode;
}

const PROJECTS: ProjectCard[] = [
  {
    slot: 'proj-nachtigal',
    img: '/assets/production/hydro.jpg',
    metaEN: 'GENERATION · SANAGA · 420 MW', metaFR: 'PRODUCTION · SANAGA · 420 MW',
    titleEN: 'Nachtigal hydroelectric scheme', titleFR: 'Aménagement hydroélectrique de Nachtigal',
    descEN: 'A run-of-river plant tied to the Southern grid by a 2 × 225 kV line to Nyom II — a case study in integrating large units and evacuation lines.',
    descFR: 'Une centrale au fil de l’eau reliée au réseau Sud par une ligne 2 × 225 kV vers Nyom II — un cas d’étude d’intégration de grands groupes et de lignes d’évacuation.',
    ctaEN: 'Study in D01 Generation', ctaFR: 'Étudier dans D01 Production',
    domain: 'D01'
  },
  {
    slot: 'proj-memveele',
    img: '/assets/substation/equipment.jpg',
    metaEN: 'GENERATION · NTEM · ~211 MW', metaFR: 'PRODUCTION · NTEM · ~211 MW',
    titleEN: 'Memve’ele hydroelectric scheme', titleFR: 'Aménagement hydroélectrique de Memve’ele',
    descEN: 'A southern plant whose value depends on its transmission link — read it alongside the HV corridor and substation stages.',
    descFR: 'Une centrale du Sud dont la valeur dépend de sa liaison de transport — à lire avec les étapes corridor HT et poste.',
    ctaEN: 'Study in D03 Transmission', ctaFR: 'Étudier dans D03 Transport',
    domain: 'D03'
  },
  {
    slot: 'proj-lompangar',
    img: '/assets/production/hydro-grand-coulee.jpg',
    metaEN: 'STORAGE & REGULATION · EAST REGION', metaFR: 'STOCKAGE & RÉGULATION · RÉGION DE L’EST',
    titleEN: 'Lom Pangar reservoir dam', titleFR: 'Barrage-réservoir de Lom Pangar',
    descEN: 'A reservoir that regulates Sanaga flows for downstream plants, with a foot-of-dam plant supplying the East.',
    descFR: 'Un réservoir qui régule les débits de la Sanaga pour les centrales aval, avec une usine de pied alimentant l’Est.',
    ctaEN: 'Study in D01 Generation', ctaFR: 'Étudier dans D01 Production',
    domain: 'D01'
  }
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export const HomeView: React.FC<HomeViewProps> = ({
  locale,
  onSelectDomain,
  onSelectEquipment,
  onNavigateView,
  onOpenSearch,
  onOpenAssistant,
  onLocaleChange,
  onNavigateJourney,
  onNavigateSimulation,
  onNavigateCalculator,
}) => {
  const isFR = locale === 'fr';

  // 1. Reduced Motion Detection
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  // 2. Window Width & Responsive State
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const isWide = windowWidth >= 1100;
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Scroll Progress & Active Stage Tracker
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const y = window.scrollY;
          setScrollProgress(max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0);
          setIsScrolled(y > 40);

          // Find closest stage
          const mid = window.innerHeight * 0.45;
          let bestIdx = 0;
          let bestDist = 1e9;
          stageRefs.current.forEach((el, i) => {
            if (el) {
              const r = el.getBoundingClientRect();
              const dist = Math.abs(r.top + Math.min(r.height, window.innerHeight) * 0.4 - mid);
              if (dist < bestDist) {
                bestDist = dist;
                bestIdx = i;
              }
            }
          });
          setActiveStageIndex(bestIdx);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Hero Slideshow State
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    if (isHeroPaused || reducedMotion) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isHeroPaused, reducedMotion]);

  // 5. Cameroon Grid Big Number Count-Up
  const [gridCapacity, setGridCapacity] = useState(2033);
  const countUpRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const el = countUpRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          setGridCapacity(0);
          const startTime = performance.now();
          const duration = 1600;
          const animate = (now: number) => {
            const elapsed = Math.min(1, (now - startTime) / duration);
            const ease = 1 - Math.pow(1 - elapsed, 3);
            setGridCapacity(Math.round(2033 * ease));
            if (elapsed < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // 6. Map Iframe Height & Language Sync
  const [mapHeight, setMapHeight] = useState(820);
  const mapIframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const data = e.data || {};
      if (data.epedeMapReady && mapIframeRef.current?.contentWindow) {
        mapIframeRef.current.contentWindow.postMessage({ epedeLang: locale.toUpperCase() }, '*');
      }
      if (data.epedeMapHeight && Math.abs(data.epedeMapHeight - mapHeight) > 2) {
        setMapHeight(data.epedeMapHeight);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [locale, mapHeight]);

  useEffect(() => {
    if (mapIframeRef.current?.contentWindow) {
      mapIframeRef.current.contentWindow.postMessage({ epedeLang: locale.toUpperCase() }, '*');
    }
  }, [locale]);

  // 7. DOL Starter Workbench State Machine
  type FeederState = 'stopped' | 'running' | 'over' | 'tripped' | 'fault';
  const [wbState, setWbState] = useState<FeederState>('stopped');
  const [eventLog, setEventLog] = useState<{ key: string; t: string; ink: string }[]>([
    { key: 'ready', t: '00:00', ink: '#F3F7FA' }
  ]);
  const startTimeRef = useRef(Date.now());
  const overloadTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getTimestamp = () => {
    const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
    return String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(secs % 60).padStart(2, '0');
  };

  const pushLog = (key: string, ink = '#F3F7FA') => {
    setEventLog((prev) => [{ key, t: getTimestamp(), ink }, ...prev].slice(0, 4));
  };

  const handleStartMotor = () => {
    if (wbState !== 'stopped') return;
    setWbState('running');
    pushLog('start', '#F3F7FA');
  };

  const handleStopMotor = () => {
    if (wbState !== 'running' && wbState !== 'over') return;
    if (overloadTimerRef.current) clearTimeout(overloadTimerRef.current);
    setWbState('stopped');
    pushLog('stop', '#F3F7FA');
  };

  const handleSimulateOverload = () => {
    if (wbState !== 'running') return;
    setWbState('over');
    pushLog('over', '#FFC277');
    overloadTimerRef.current = setTimeout(() => {
      setWbState((curr) => {
        if (curr === 'over') {
          pushLog('trip', '#FF8A8D');
          return 'tripped';
        }
        return curr;
      });
    }, 1600);
  };

  const handleShortCircuit = () => {
    if (overloadTimerRef.current) clearTimeout(overloadTimerRef.current);
    setWbState('fault');
    pushLog('sc', '#FF8A8D');
  };

  const handleResetFeeder = () => {
    if (wbState !== 'tripped' && wbState !== 'fault') return;
    if (overloadTimerRef.current) clearTimeout(overloadTimerRef.current);
    setWbState('stopped');
    pushLog('reset', '#F3F7FA');
  };

  // 8. Pathways State
  const [activePathwayIndex, setActivePathwayIndex] = useState(0);
  const [pathwayImgIndex, setPathwayImgIndex] = useState(0);
  const [pathwayTransition, setPathwayTransition] = useState(false);

  const handlePickPathway = (idx: number) => {
    if (idx === activePathwayIndex) return;
    if (reducedMotion) {
      setActivePathwayIndex(idx);
      setPathwayImgIndex(idx);
      return;
    }
    setPathwayImgIndex(idx);
    setPathwayTransition(true);
    setTimeout(() => {
      setActivePathwayIndex(idx);
      setPathwayTransition(false);
    }, 200);
  };

  // 9. Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 10. Smooth Scroll to Stage Helper
  const scrollToStage = (i: number) => {
    const el = stageRefs.current[i];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - (windowWidth < 1100 ? 150 : 110);
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  // Log descriptions lookup
  const LOG_TEXTS: Record<string, [string, string]> = {
    start: ['KM1 closes — motor accelerates to 1,460 rpm', 'KM1 se ferme — le moteur accélère à 1 460 tr/min'],
    stop: ['KM1 opens — motor coasts to rest', 'KM1 s’ouvre — le moteur s’arrête en roue libre'],
    over: ['Mechanical overload — current rises to 41 A (1.4 × In)', 'Surcharge mécanique — le courant monte à 41 A (1,4 × In)'],
    trip: ['F1 trips on overload, KM1 drops out', 'F1 déclenche sur surcharge, KM1 retombe'],
    sc: ['Short-circuit at motor terminals — Q1 opens instantly', 'Court-circuit aux bornes — Q1 s’ouvre instantanément'],
    reset: ['Fault reset — feeder ready', 'Défaut acquitté — départ prêt'],
    ready: ['Feeder energised to KM1 — ready to start', 'Départ sous tension jusqu’à KM1 — prêt à démarrer']
  };

  // Workbench SVG circuit derived coordinates
  const q1Open = wbState === 'fault';
  const kmClosed = wbState === 'running' || wbState === 'over';
  const downEnergized = kmClosed;
  const liveColor = '#D9821C';
  const deadColor = '#3A536B';
  const faultRed = '#E5484D';

  const currentHero = HERO[heroIndex];

  return (
    <div style={{ background: '#FBFCFD', color: '#0B1B2B', fontFamily: "'Space Grotesk', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      
      {/* ========================================================================= */}
      {/* 00 FIXED EDITORIAL HEADER                                                 */}
      {/* ========================================================================= */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          background: isScrolled ? 'rgba(251, 252, 253, 0.92)' : 'rgba(251, 252, 253, 0)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${isScrolled ? '#D5E0E8' : 'transparent'}`,
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }}
      >
        <div style={{ maxWidth: 1360, margin: '0 auto', height: 68, padding: '0 clamp(20px, 4vw, 48px)', display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'baseline', gap: 12, color: '#0B1B2B', textDecoration: 'none' }}>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>EPEDE</span>
            {isWide && (
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.1em', color: '#5B6B7B' }}>
                {isFR ? 'ÉNERGIE · AUTOMATISME · INSTALLATIONS' : 'POWER · AUTOMATION · INSTALLATIONS'}
              </span>
            )}
          </a>

          {isWide && (
            <nav aria-label="Primary" style={{ display: 'flex', gap: 26, marginLeft: 'auto', fontSize: 14, fontWeight: 500 }}>
              <a href="#journey" style={{ color: '#0B1B2B', textDecoration: 'none' }} className="hover:text-[#1F5FAE] transition-colors">{isFR ? 'Parcours' : 'Journey'}</a>
              <a href="#grid" style={{ color: '#0B1B2B', textDecoration: 'none' }} className="hover:text-[#1F5FAE] transition-colors">{isFR ? 'Réseau du Cameroun' : 'Cameroon grid'}</a>
              <a href="#workbench" style={{ color: '#0B1B2B', textDecoration: 'none' }} className="hover:text-[#1F5FAE] transition-colors">{isFR ? 'Atelier' : 'Workbench'}</a>
              <a href="#case" style={{ color: '#0B1B2B', textDecoration: 'none' }} className="hover:text-[#1F5FAE] transition-colors">{isFR ? 'Étude de cas' : 'Case study'}</a>
              <a href="#pathways" style={{ color: '#0B1B2B', textDecoration: 'none' }} className="hover:text-[#1F5FAE] transition-colors">{isFR ? 'Formations' : 'Pathways'}</a>
            </nav>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: isWide ? undefined : 'auto' }}>
            <button
              onClick={() => onOpenSearch?.()}
              style={{ height: 44, padding: '0 12px', border: 0, background: 'transparent', color: '#0B1B2B', fontSize: 14, fontWeight: 500 }}
              className="hover:text-[#1F5FAE] transition-colors"
            >
              {isFR ? 'Rechercher' : 'Search'}
            </button>
            <button
              onClick={() => onLocaleChange?.(isFR ? 'en' : 'fr')}
              aria-label="Switch language"
              style={{ whiteSpace: 'nowrap', height: 44, padding: '0 12px', border: 0, background: 'transparent', color: '#5B6B7B', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
            >
              <span style={{ color: !isFR ? '#1F5FAE' : '#5B6B7B', fontWeight: !isFR ? 700 : 400 }}>EN</span>
              {' / '}
              <span style={{ color: isFR ? '#1F5FAE' : '#5B6B7B', fontWeight: isFR ? 700 : 400 }}>FR</span>
            </button>
            {isWide ? (
              <a
                href="#pathways"
                style={{ height: 40, marginLeft: 8, padding: '0 18px', borderRadius: 999, background: '#0B1B2B', color: '#FFFFFF', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                className="hover:bg-[#1F5FAE] transition-colors"
              >
                {isFR ? 'Commencer' : 'Start learning'}
              </a>
            ) : (
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                style={{ height: 44, padding: '0 14px', border: '1px solid #B9C7D2', borderRadius: 999, background: 'transparent', color: '#0B1B2B', fontSize: 14 }}
              >
                {mobileMenuOpen ? 'Fermer' : 'Menu'}
              </button>
            )}
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div style={{ position: 'absolute', left: 0, bottom: -1, height: 2, width: `${scrollProgress}%`, background: '#F2A541', transition: 'width 0.1s linear' }} />
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && !isWide && (
        <div style={{ position: 'fixed', inset: '68px 0 0 0', zIndex: 55, background: '#FBFCFD', padding: '28px clamp(20px, 4vw, 48px)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { href: '#journey', label: isFR ? 'Parcours' : 'Journey' },
            { href: '#grid', label: isFR ? 'Réseau du Cameroun' : 'Cameroon grid' },
            { href: '#workbench', label: isFR ? 'Atelier' : 'Workbench' },
            { href: '#case', label: isFR ? 'Étude de cas' : 'Case study' },
            { href: '#pathways', label: isFR ? 'Formations' : 'Pathways' }
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '16px 0', borderBottom: '1px solid #D5E0E8', color: '#0B1B2B', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', textDecoration: 'none' }}
            >
              {item.label}
            </a>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => { onNavigateJourney?.(); setMobileMenuOpen(false); }}
              style={{ height: 48, borderRadius: 999, background: '#0B1B2B', color: '#FFFFFF', fontWeight: 600, fontSize: 15 }}
            >
              {isFR ? 'Explorer la chaîne complète' : 'Explore Full Energy Chain'}
            </button>
          </div>
        </div>
      )}

      <main id="top">
        {/* ========================================================================= */}
        {/* 01 HERO SECTION                                                           */}
        {/* ========================================================================= */}
        <section data-screen-label="01 Hero" style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', background: '#FBFCFD' }}>
          {/* Background Slideshow Layer */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: '-6% 0 -14% 0', willChange: 'transform' }}>
            {HERO.map((slide, i) => (
              <div
                key={slide.f}
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  opacity: i === heroIndex ? 1 : 0,
                  transition: 'opacity 1.8s ease'
                }}
              >
                <img
                  src={slide.f}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(1) contrast(.85) brightness(1.12)',
                    transform: i === heroIndex && !reducedMotion ? 'scale(1.1)' : 'scale(1.02)',
                    transition: 'transform 9s linear'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Color Tint & Atmospheric Gradients */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#7D93A8', mixBlendMode: 'color', opacity: 0.35 }} />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(251, 252, 253, 0.7) 0%, rgba(251, 252, 253, 0.15) 35%, rgba(251, 252, 253, 0.55) 62%, #FBFCFD 100%), linear-gradient(90deg, rgba(251, 252, 253, 0.96) 0%, rgba(251, 252, 253, 0.88) 40%, rgba(251, 252, 253, 0.35) 62%, rgba(251, 252, 253, 0) 80%)'
            }}
          />

          {/* Hero Typography & Primary CTA */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 1360, margin: '0 auto', padding: '150px clamp(20px, 4vw, 48px) 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.12em', color: '#5B6B7B' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F2A541', boxShadow: '0 0 12px #F2A541' }} />
              <span>{isFR ? 'ENVIRONNEMENT NUMÉRIQUE D’INGÉNIERIE ÉLECTRIQUE' : 'ELECTRICAL POWER ENGINEERING DIGITAL ENVIRONMENT'}</span>
            </div>

            <h1 style={{ margin: '28px 0 0', fontSize: 'clamp(2.4rem, 5.6vw, 5.4rem)', lineHeight: 0.96, letterSpacing: '-0.05em', fontWeight: 700, maxWidth: 1100 }}>
              <span style={{ display: 'block' }}>{isFR ? 'Suivez le courant' : 'Follow the current'}</span>
              <span style={{ display: 'block', color: '#1F5FAE' }}>{isFR ? 'de la turbine au moteur.' : 'from turbine to motor.'}</span>
            </h1>

            <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 28 }}>
              <p style={{ margin: 0, maxWidth: 560, fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)', lineHeight: 1.55, color: '#3A4B5C' }}>
                {isFR
                  ? 'Un environnement connecté pour les réseaux électriques, les installations industrielles et l’automatisme — chaque étape expliquée, calculée et simulée, en français et en anglais.'
                  : 'One connected environment for power systems, industrial installations and automation — every stage explained, calculated and simulated, in English and French.'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <a
                  href="#journey"
                  style={{ height: 56, padding: '0 26px', borderRadius: 999, background: '#0B1B2B', color: '#FFFFFF', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
                  className="hover:bg-[#1F5FAE] transition-colors"
                >
                  <span>{isFR ? 'Commencer le parcours' : 'Start the journey'}</span>
                  <span>↓</span>
                </a>
                <a
                  href="#grid"
                  style={{ height: 56, padding: '0 26px', borderRadius: 999, border: '1px solid #A9BAC6', color: '#0B1B2B', fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', textDecoration: 'none' }}
                  className="hover:border-[#0B1B2B] transition-colors"
                >
                  {isFR ? 'Explorer le réseau du Cameroun' : 'Explore the Cameroon grid'}
                </a>
              </div>
            </div>
          </div>

          {/* Live One-Line Diagram (SLD) from Source to Load */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 1360, margin: 'clamp(48px, 7vw, 88px) auto 0', padding: '0 clamp(20px, 4vw, 48px) 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', paddingBottom: 14, borderBottom: '1px solid #D5E0E8' }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: '#5B6B7B' }}>
                {isFR ? 'UNIFILAIRE ANIMÉ · SOURCE → CHARGE' : 'LIVE ONE-LINE · SOURCE → LOAD'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#5B6B7B' }}>
                <span>
                  <span style={{ color: '#0B1B2B', fontWeight: 600 }}>{isFR ? currentHero.tagFR : currentHero.tag}</span> · {isFR ? currentHero.capFR : currentHero.cap} · {currentHero.cr}
                </span>
                <button
                  onClick={() => setIsHeroPaused((p) => !p)}
                  aria-label={isHeroPaused ? (isFR ? 'Reprendre le diaporama' : 'Resume slideshow') : (isFR ? 'Mettre en pause' : 'Pause slideshow')}
                  style={{ height: 32, padding: '0 12px', border: '1px solid #B9C7D2', borderRadius: 999, background: 'transparent', color: '#0B1B2B', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}
                  className="hover:border-[#0B1B2B] transition-colors"
                >
                  {isHeroPaused ? (isFR ? '▶ Lecture' : '▶ Play') : (isFR ? '❚❚ Pause' : '❚❚ Pause')}
                </button>
              </div>
            </div>

            {/* SVG Interactive SLD with moving 7-second pulse */}
            <div style={{ overflowX: 'auto', scrollbarWidth: 'none', paddingTop: 10 }}>
              <svg
                viewBox="0 0 1200 124"
                width="100%"
                role="img"
                aria-label={isFR ? 'Schéma unifilaire de la source à la charge' : 'One-line diagram from source to load'}
                style={{ display: 'block', minWidth: 860 }}
              >
                {/* Background track */}
                <line x1="40" y1="62" x2="1160" y2="62" stroke="#D5E0E8" strokeWidth="2" />
                
                {/* Animated active energy trail */}
                {!reducedMotion && (
                  <line x1="40" y1="62" x2="40" y2="62" stroke="#D9821C" strokeWidth="2">
                    <animate attributeName="x2" values="40;1160;1160" keyTimes="0;0.92;1" dur="7s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.6;0" keyTimes="0;0.9;1" dur="7s" repeatCount="indefinite" />
                  </line>
                )}

                {/* 7 Canonical Nodes */}
                {[
                  { x: 80, volt: '15 kV', en: 'Generation', fr: 'Production', glyph: 'G' },
                  { x: 260, volt: '225 kV', en: 'Step-up', fr: 'Élévation', glyph: 'trafo' },
                  { x: 440, volt: '225 kV', en: 'Transmission', fr: 'Transport', glyph: 'tower' },
                  { x: 620, volt: '225/90 kV', en: 'Substation', fr: 'Poste', glyph: 'substation' },
                  { x: 800, volt: '30 kV', en: 'MV feeder', fr: 'Départ HTA', glyph: 'rmu' },
                  { x: 980, volt: '400 V', en: 'LV board', fr: 'Tableau BT', glyph: 'tgbt' },
                  { x: 1140, volt: '400 V', en: 'Motor', fr: 'Moteur', glyph: 'M' }
                ].map((node, i) => {
                  const t = (node.x - 40) / 1120 * 0.92;
                  const a = Math.max(0.001, t - 0.012);
                  const c = Math.min(0.999, t + 0.16);
                  return (
                    <g key={i}>
                      {/* Node Glyph Group with animated stroke lighting */}
                      <g stroke={reducedMotion ? '#D9821C' : '#A9BAC6'} strokeWidth="2">
                        {!reducedMotion && (
                          <animate
                            attributeName="stroke"
                            values="#A9BAC6;#A9BAC6;#D9821C;#A9BAC6;#A9BAC6"
                            keyTimes={`0;${a.toFixed(3)};${t.toFixed(3)};${c.toFixed(3)};1`}
                            dur="7s"
                            repeatCount="indefinite"
                          />
                        )}
                        {/* Glyphs */}
                        {node.glyph === 'G' && (
                          <>
                            <circle cx={node.x} cy="62" r="18" fill="#FBFCFD" />
                            <text x={node.x} y="67" textAnchor="middle" fill="#0B1B2B" stroke="none" fontSize="15" fontWeight="700" fontFamily="Space Grotesk">G</text>
                          </>
                        )}
                        {node.glyph === 'trafo' && (
                          <>
                            <circle cx={node.x - 8} cy="62" r="13" fill="#FBFCFD" />
                            <circle cx={node.x + 8} cy="62" r="13" fill="none" />
                          </>
                        )}
                        {node.glyph === 'tower' && (
                          <path d={`M${node.x - 14} 84 L${node.x} 38 L${node.x + 14} 84 M${node.x - 20} 52 L${node.x + 20} 52 M${node.x - 9} 68 L${node.x + 9} 68`} fill="none" />
                        )}
                        {node.glyph === 'substation' && (
                          <>
                            <rect x={node.x - 4} y="38" width="8" height="48" fill="#FBFCFD" />
                            <rect x={node.x - 24} y="55" width="14" height="14" fill="#FBFCFD" />
                            <rect x={node.x + 10} y="55" width="14" height="14" fill="#FBFCFD" />
                          </>
                        )}
                        {node.glyph === 'rmu' && (
                          <>
                            <rect x={node.x - 11} y="51" width="22" height="22" fill="#FBFCFD" />
                            <line x1={node.x - 11} y1="73" x2={node.x + 11} y2="51" />
                          </>
                        )}
                        {node.glyph === 'tgbt' && (
                          <>
                            <rect x={node.x - 15} y="42" width="30" height="40" fill="#FBFCFD" />
                            <line x1={node.x - 8} y1="54" x2={node.x + 8} y2="54" />
                            <line x1={node.x - 8} y1="66" x2={node.x + 8} y2="66" />
                          </>
                        )}
                        {node.glyph === 'M' && (
                          <>
                            <circle cx={node.x} cy="62" r="18" fill="#FBFCFD" />
                            <text x={node.x} y="67" textAnchor="middle" fill="#0B1B2B" stroke="none" fontSize="15" fontWeight="700" fontFamily="Space Grotesk">M</text>
                          </>
                        )}
                      </g>

                      {/* Voltage tag above */}
                      <text x={node.x} y="18" textAnchor="middle" fill="#5B6B7B" fontSize="12" fontFamily="IBM Plex Mono">
                        {node.volt}
                      </text>
                      {/* Name below */}
                      <text x={node.x} y="112" textAnchor="middle" fill="#0B1B2B" fontSize="15" fontWeight="600" fontFamily="Space Grotesk">
                        {isFR ? node.fr : node.en}
                      </text>
                    </g>
                  );
                })}

                {/* Animated traveling energy pulse packet */}
                {!reducedMotion && (
                  <circle cx="40" cy="62" r="6" fill="#D9821C" style={{ filter: 'drop-shadow(0 0 8px #F2A541)' }}>
                    <animate attributeName="cx" values="40;1160;1160" keyTimes="0;0.92;1" dur="7s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.92;1" dur="7s" repeatCount="indefinite" />
                  </circle>
                )}
              </svg>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 02 TRUST STRIP                                                            */}
        {/* ========================================================================= */}
        <section data-screen-label="02 Trust" style={{ background: '#EEF4F8', color: '#0B1B2B' }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', padding: 'clamp(40px, 5vw, 64px) clamp(20px, 4vw, 48px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '28px 40px' }}>
              <div style={{ borderTop: '2px solid #0B1B2B', paddingTop: 16 }}>
                <div style={{ fontSize: 'clamp(2.6rem, 4.4vw, 3.8rem)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>16</div>
                <div style={{ marginTop: 8, fontSize: 15, color: '#5B6B7B' }}>{isFR ? 'domaines d’ingénierie' : 'engineering domains'}</div>
              </div>
              <div style={{ borderTop: '2px solid #0B1B2B', paddingTop: 16 }}>
                <div style={{ fontSize: 'clamp(2.6rem, 4.4vw, 3.8rem)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>9</div>
                <div style={{ marginTop: 8, fontSize: 15, color: '#5B6B7B' }}>{isFR ? 'étapes du système' : 'system stages'}</div>
              </div>
              <div style={{ borderTop: '2px solid #0B1B2B', paddingTop: 16 }}>
                <div style={{ fontSize: 'clamp(2.6rem, 4.4vw, 3.8rem)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>8</div>
                <div style={{ marginTop: 8, fontSize: 15, color: '#5B6B7B' }}>{isFR ? 'parcours d’apprentissage' : 'learning pathways'}</div>
              </div>
              <div style={{ borderTop: '2px solid #0B1B2B', paddingTop: 16 }}>
                <div style={{ fontSize: 'clamp(2.6rem, 4.4vw, 3.8rem)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>EN · FR</div>
                <div style={{ marginTop: 8, fontSize: 15, color: '#5B6B7B' }}>{isFR ? 'entièrement bilingue' : 'fully bilingual'}</div>
              </div>
            </div>

            <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 28px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#0B1B2B' }}>
              <span style={{ color: '#5B6B7B', letterSpacing: '0.1em', fontSize: 11 }}>{isFR ? 'RÉFÉRENCÉ À' : 'REFERENCED TO'}</span>
              <span>IEC 60364</span>
              <span>NF C 15-100</span>
              <span>NF C 13-100</span>
              <span>IEC 61850</span>
              <span>IEC 60909</span>
              <span>{isFR ? 'Données ARSEL (2026)' : 'ARSEL data (2026)'}</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 02b VOLTAGE BAND (PARALLAX MARQUEE)                                       */}
        {/* ========================================================================= */}
        <section aria-hidden="true" data-screen-label="02b Voltage band" style={{ background: '#FBFCFD', overflow: 'hidden', padding: 'clamp(56px, 7vw, 96px) 0 0' }}>
          <div
            style={{
              whiteSpace: 'nowrap',
              fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: 'transparent',
              WebkitTextStroke: '1.5px #A9BAC6',
              willChange: 'transform'
            }}
          >
            15 kV · 225 kV · 90 kV · 30 kV · 400 V · 230 V · 24 V DC · 15 kV · 225 kV · 90 kV
          </div>
          <div
            style={{
              marginLeft: '-40vw',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: '#1F5FAE',
              willChange: 'transform'
            }}
          >
            {isFR
              ? 'PRODUIRE · TRANSFORMER · TRANSPORTER · DISTRIBUER · PROTÉGER · COMMANDER · PRODUIRE · TRANSFORMER'
              : 'GENERATE · TRANSFORM · TRANSMIT · DISTRIBUTE · PROTECT · CONTROL · GENERATE · TRANSFORM'}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 03 JOURNEY (9 STAGES)                                                     */}
        {/* ========================================================================= */}
        <section id="journey" data-screen-label="03 Journey" style={{ background: '#FBFCFD', padding: 'clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 120px)', scrollMarginTop: 68 }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: '24px 64px', alignItems: 'end' }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.12em', color: '#1F5FAE' }}>
                  {isFR ? 'LE PARCOURS DU SYSTÈME · 9 ÉTAPES' : 'THE SYSTEM JOURNEY · 9 STAGES'}
                </div>
                <h2 style={{ margin: '18px 0 0', fontSize: 'clamp(2.4rem, 5vw, 4.6rem)', lineHeight: 0.98, letterSpacing: '-0.045em', fontWeight: 700 }}>
                  <span style={{ display: 'block' }}>{isFR ? 'Neuf étapes.' : 'Nine stages.'}</span>
                  <span style={{ display: 'block', color: '#5B6B7B' }}>{isFR ? 'Un seul chemin continu.' : 'One continuous path.'}</span>
                </h2>
              </div>
              <p style={{ margin: 0, maxWidth: 520, fontSize: '1.15rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                {isFR
                  ? 'Faites défiler la chaîne. Chaque étape montre l’équipement tel qu’il est sur le terrain, sa tension de service et où l’étudier ensuite.'
                  : 'Scroll the chain. Each stage shows the equipment as it stands in the field, the voltage it runs at, and where to study it next.'}
              </p>
            </div>

            {/* Mobile Sticky Horizontal Bar */}
            {!isWide && (
              <div style={{ position: 'sticky', top: 68, zIndex: 20, margin: '40px calc(-1 * clamp(20px, 4vw, 48px)) 0', padding: '12px clamp(20px, 4vw, 48px)', background: 'rgba(251, 252, 253, 0.94)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #D5E0E8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
                  <span style={{ color: '#0B1B2B' }}>
                    {STAGES[activeStageIndex].num} · {isFR ? STAGES[activeStageIndex].shortFR : STAGES[activeStageIndex].shortEN}
                  </span>
                  <span style={{ color: '#1F5FAE' }}>{STAGES[activeStageIndex].volt}</span>
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 4 }}>
                  {STAGES.map((s, idx) => (
                    <button
                      key={s.num}
                      onClick={() => scrollToStage(idx)}
                      aria-label={isFR ? s.shortFR : s.shortEN}
                      style={{ flex: 1, height: 20, border: 0, padding: '8px 0', background: 'transparent' }}
                    >
                      <span
                        style={{
                          display: 'block',
                          height: 4,
                          borderRadius: 2,
                          background: idx <= activeStageIndex ? '#D9821C' : '#D5E0E8',
                          transition: 'background 0.3s ease'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stage Layout with Sticky Navigation Rail */}
            <div style={{ marginTop: 'clamp(40px, 6vw, 80px)', display: 'grid', gridTemplateColumns: isWide ? '240px minmax(0, 1fr)' : 'minmax(0, 1fr)', gap: 56, alignItems: 'start' }}>
              {isWide && (
                <nav aria-label="Journey stages" style={{ position: 'sticky', top: 110 }}>
                  <div style={{ position: 'relative', paddingLeft: 28 }}>
                    {/* Track Background Line */}
                    <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 2, background: '#D5E0E8' }} />
                    {/* Active Height Fill Line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 6,
                        top: 8,
                        width: 2,
                        height: `${(activeStageIndex / (STAGES.length - 1)) * 100}%`,
                        maxHeight: 'calc(100% - 16px)',
                        background: '#F2A541',
                        transition: 'height 0.5s cubic-bezier(.2,.8,.2,1)'
                      }}
                    />
                    {STAGES.map((stage, idx) => {
                      const isActive = idx === activeStageIndex;
                      const isPast = idx < activeStageIndex;
                      return (
                        <button
                          key={stage.num}
                          onClick={() => scrollToStage(idx)}
                          style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 2,
                            width: '100%',
                            minHeight: 52,
                            padding: '6px 0',
                            border: 0,
                            background: 'transparent',
                            textAlign: 'left'
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: -28,
                              top: 10,
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              background: isActive || isPast ? '#D9821C' : '#FBFCFD',
                              border: `2px solid ${isActive || isPast ? '#D9821C' : '#A9BAC6'}`,
                              boxShadow: isActive ? '0 0 0 6px rgba(242,165,65,.18)' : 'none',
                              transition: 'all 0.3s ease'
                            }}
                          />
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: isActive ? '#1F5FAE' : '#5B6B7B' }}>
                            {stage.num} · {stage.volt}
                          </span>
                          <span style={{ fontSize: 16, fontWeight: isActive ? 700 : 500, color: isActive ? '#0B1B2B' : '#5B6B7B', transition: 'color 0.3s ease' }}>
                            {isFR ? stage.shortFR : stage.shortEN}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </nav>
              )}

              {/* Stage Cards Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(72px, 10vw, 140px)' }}>
                {STAGES.map((stage, idx) => {
                  const isActive = idx === activeStageIndex;
                  return (
                    <article
                      key={stage.num}
                      ref={(el) => { stageRefs.current[idx] = el; }}
                      data-stage={idx}
                      style={{
                        opacity: isActive || !isWide ? 1 : 0.38,
                        transition: 'opacity 0.6s ease'
                      }}
                    >
                      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 4, background: '#E3ECF2' }}>
                        <img
                          src={stage.img}
                          alt={stage.cap}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: isActive ? 'grayscale(0.1) contrast(1.05)' : 'grayscale(1) brightness(1.05) opacity(0.8)',
                            transform: isActive ? 'scale(1.04)' : 'scale(1)',
                            transition: 'filter 1s ease, transform 6s ease'
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 'auto 0 0 0',
                            padding: '40px 20px 14px',
                            background: 'linear-gradient(180deg, rgba(251, 252, 253, 0), rgba(251, 252, 253, 0.85))',
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 16,
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 11,
                            color: '#3A4B5C'
                          }}
                        >
                          <span>{stage.cap}</span>
                          <span style={{ color: '#1F5FAE' }}>{stage.num} / 09</span>
                        </div>
                      </div>

                      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '28px 48px' }}>
                        <div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', fontWeight: 500, color: '#1F5FAE', letterSpacing: '-0.02em' }}>
                            {stage.volt}
                          </div>
                          <h3 style={{ margin: '10px 0 0', fontSize: 'clamp(1.9rem, 3.2vw, 3rem)', lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 700 }}>
                            {isFR ? stage.titleFR : stage.titleEN}
                          </h3>
                          <p style={{ margin: '18px 0 0', fontSize: '1.08rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                            {isFR ? stage.purposeFR : stage.purposeEN}
                          </p>
                          <button
                            onClick={() => onSelectDomain(stage.domain)}
                            style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 44, fontWeight: 600, fontSize: 15, background: 'transparent', border: 0, padding: 0, color: '#1F5FAE', cursor: 'pointer' }}
                            className="hover:underline"
                          >
                            <span>
                              {isFR ? `Ouvrir ${stage.domain} — ${stage.linkTextFR}` : `Open ${stage.domain} — ${stage.linkTextEN}`}
                            </span>
                            <span>→</span>
                          </button>
                        </div>

                        <div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: '#5B6B7B' }}>
                            {isFR ? 'ÉQUIPEMENTS CLÉS' : 'KEY APPARATUS'}
                          </div>
                          <ol style={{ margin: '10px 0 0', padding: 0, listStyle: 'none' }}>
                            {(isFR ? stage.appFR : stage.appEN).map((appItem, appIdx) => (
                              <li
                                key={appIdx}
                                style={{
                                  display: 'flex',
                                  gap: 16,
                                  alignItems: 'baseline',
                                  padding: '13px 0',
                                  borderBottom: '1px solid #D5E0E8',
                                  fontSize: 16
                                }}
                              >
                                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1F5FAE' }}>
                                  {String(appIdx + 1).padStart(2, '0')}
                                </span>
                                <span>{appItem}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 04 CAMEROON GRID                                                          */}
        {/* ========================================================================= */}
        <section id="grid" data-screen-label="04 Cameroon grid" style={{ background: '#EEF4F8', color: '#0B1B2B', padding: 'clamp(80px, 10vw, 140px) 0', scrollMarginTop: 68 }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.12em', color: '#1F5FAE' }}>
              {isFR ? 'RÉSEAU DU CAMEROUN' : 'CAMEROON GRID'}
            </div>

            {/* Big Capacity Number */}
            <div ref={countUpRef} style={{ marginTop: 14, willChange: 'transform', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0 18px' }}>
              <span style={{ fontSize: 'clamp(3.6rem, 10vw, 8.5rem)', fontWeight: 700, letterSpacing: '-0.06em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>
                {gridCapacity.toLocaleString(isFR ? 'fr-FR' : 'en-US')}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 'clamp(1.2rem, 2.2vw, 2rem)', fontWeight: 500, color: '#1F5FAE' }}>
                MW
              </span>
            </div>

            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: '24px 64px', alignItems: 'start' }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)', lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 700 }}>
                {isFR ? 'installés sur deux réseaux séparés.' : 'installed on two separate grids.'}
              </h2>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                {isFR
                  ? 'Le réseau Sud (RIS) et le réseau Nord (RIN) ne sont pas reliés entre eux. Chaque site ci-dessous provient d’une fiche datée et sourcée ; les positions et tracés approximatifs sont signalés comme tels.'
                  : 'The Southern (RIS) and Northern (RIN) grids are not interconnected. Every site below comes from a dated record with its source; approximate positions and routes are marked as such.'}
              </p>
            </div>

            <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', columnGap: 40, borderTop: '1px solid #0B1B2B' }}>
              <div style={{ padding: '20px 0', borderBottom: '1px solid #D5E0E8' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: '2.6rem', fontWeight: 700, letterSpacing: '-0.04em' }}>3,233.9</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: '#1F5FAE' }}>km</span>
                </div>
                <div style={{ marginTop: 4, fontWeight: 600 }}>{isFR ? 'Lignes haute tension (2023)' : 'High-voltage lines (2023)'}</div>
              </div>

              <div style={{ padding: '20px 0', borderBottom: '1px solid #D5E0E8' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: '2.6rem', fontWeight: 700, letterSpacing: '-0.04em' }}>2</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: '#1F5FAE' }}>{isFR ? 'réseaux' : 'grids'}</span>
                </div>
                <div style={{ marginTop: 4, fontWeight: 600 }}>{isFR ? 'Non reliés entre eux (2025)' : 'Not interconnected (2025)'}</div>
              </div>

              <div style={{ padding: '20px 0', borderBottom: '1px solid #D5E0E8', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, lineHeight: 1.6, color: '#5B6B7B', display: 'flex', alignItems: 'center' }}>
                {isFR ? 'Sources : ARSEL (2026) · Gouvernement du Cameroun / Banque mondiale (2025)' : 'Sources: ARSEL (2026) · Government of Cameroon / World Bank (2025)'}
              </div>
            </div>

            {/* Embedded Cameroon Grid Map */}
            <div style={{ marginTop: 40, border: '1px solid #D5E0E8', borderRadius: 6, overflow: 'hidden', background: '#FFFFFF' }}>
              <iframe
                ref={mapIframeRef}
                src="/Cameroon Grid Map.html?v2"
                title="Interactive map of Cameroon's electricity grid"
                scrolling="no"
                style={{ display: 'block', width: '100%', height: `${mapHeight}px`, border: 0, transition: 'height 0.3s ease' }}
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 05 WORKBENCH (DOL STARTER)                                                */}
        {/* ========================================================================= */}
        <section id="workbench" data-screen-label="05 Workbench" style={{ background: '#0B1B2B', color: '#F3F7FA', padding: 'clamp(80px, 10vw, 140px) 0', scrollMarginTop: 68 }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: '24px 64px', alignItems: 'end' }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.12em', color: '#F2A541' }}>
                  {isFR ? 'ATELIER · DÉMARREUR DIRECT' : 'WORKBENCH · DIRECT-ON-LINE STARTER'}
                </div>
                <h2 style={{ margin: '18px 0 0', fontSize: 'clamp(2.4rem, 5vw, 4.6rem)', lineHeight: 0.98, letterSpacing: '-0.045em', fontWeight: 700 }}>
                  <span style={{ display: 'block', color: '#F3F7FA' }}>{isFR ? 'La logique de protection,' : 'Protection logic,'}</span>
                  <span style={{ display: 'block', color: '#93A4B4' }}>{isFR ? 'rendue visible.' : 'made visible.'}</span>
                </h2>
              </div>
              <p style={{ margin: 0, maxWidth: 520, fontSize: '1.15rem', lineHeight: 1.6, color: '#C3CFDA' }}>
                {isFR
                  ? 'Démarrez, arrêtez et mettez en défaut un départ moteur de 15 kW. Suivez l’énergie à travers le disjoncteur, le contacteur et le relais thermique — et voyez quel appareil élimine quel défaut.'
                  : 'Start, stop and fault a 15 kW motor feeder. Watch energy move through the breaker, contactor and thermal relay — and see which device clears which fault.'}
              </p>
            </div>

            <div style={{ marginTop: 'clamp(40px, 6vw, 72px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', border: '1px solid #1E3347', borderRadius: 6, overflow: 'hidden' }}>
              {/* Left Schematic Pane */}
              <div style={{ background: '#10263A', padding: 'clamp(20px, 3vw, 40px)', display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 340 440" width="100%" style={{ maxWidth: 380, display: 'block' }} role="img" aria-label="Motor feeder one-line diagram">
                  {/* Busbar */}
                  <line x1="40" y1="34" x2="300" y2="34" stroke={liveColor} strokeWidth="4" />
                  <text x="40" y="20" fill="#93A4B4" fontFamily="IBM Plex Mono" fontSize="12">400 V · 3~ · 50 Hz</text>

                  {/* Conductor A: Bus to Q1 */}
                  <line x1="170" y1="34" x2="170" y2="80" stroke={liveColor} strokeWidth="3" />
                  <circle cx="170" cy="80" r="4" fill={liveColor} />

                  {/* Q1 Circuit Breaker */}
                  <line
                    x1="170" y1="80"
                    x2={q1Open ? 194 : 170} y2={q1Open ? 108 : 120}
                    stroke={q1Open ? faultRed : liveColor}
                    strokeWidth="3"
                    style={{ transition: 'all .2s ease' }}
                  />
                  <text x="198" y="104" fill="#F3F7FA" fontFamily="Space Grotesk" fontSize="14" fontWeight="600">
                    {isFR ? 'Q1 · disjoncteur' : 'Q1 · circuit breaker'}
                  </text>

                  {/* Conductor B: Q1 to KM1 */}
                  <line x1="170" y1="120" x2="170" y2="170" stroke={q1Open ? deadColor : liveColor} strokeWidth="3" />
                  <circle cx="170" cy="170" r="4" fill={q1Open ? deadColor : liveColor} />

                  {/* KM1 Contactor */}
                  <line
                    x1="170" y1="170"
                    x2={kmClosed ? 170 : 194} y2={kmClosed ? 210 : 198}
                    stroke={kmClosed ? liveColor : (q1Open ? deadColor : liveColor)}
                    strokeWidth="3"
                    style={{ transition: 'all .2s ease' }}
                  />
                  <text x="198" y="194" fill="#F3F7FA" fontFamily="Space Grotesk" fontSize="14" fontWeight="600">
                    {isFR ? 'KM1 · contacteur' : 'KM1 · contactor'}
                  </text>

                  {/* Conductor C: KM1 to F1 */}
                  <line x1="170" y1="210" x2="170" y2="254" stroke={downEnergized ? liveColor : deadColor} strokeWidth="3" />

                  {/* F1 Thermal Relay */}
                  <rect
                    x="150" y="254" width="40" height="40" rx="2"
                    fill="#10263A"
                    stroke={wbState === 'tripped' ? faultRed : (wbState === 'over' ? '#B86A0A' : (downEnergized ? liveColor : deadColor))}
                    strokeWidth="3"
                  />
                  <path
                    d="M158 274 L164 264 L170 284 L176 264 L182 274"
                    fill="none"
                    stroke={wbState === 'tripped' ? faultRed : (wbState === 'over' ? '#B86A0A' : (downEnergized ? liveColor : deadColor))}
                    strokeWidth="2"
                  />
                  <text x="198" y="272" fill="#F3F7FA" fontFamily="Space Grotesk" fontSize="14" fontWeight="600">
                    {isFR ? 'F1 · relais thermique' : 'F1 · thermal relay'}
                  </text>
                  <text
                    x="198" y="290"
                    fill={wbState === 'tripped' ? faultRed : '#FFC277'}
                    fontFamily="IBM Plex Mono" fontSize="11"
                  >
                    {wbState === 'tripped' ? (isFR ? 'DÉCLENCHÉ' : 'TRIPPED') : (wbState === 'over' ? (isFR ? 'ÉCHAUFFEMENT' : 'HEATING') : '')}
                  </text>

                  {/* Conductor D: F1 to Motor */}
                  <line x1="170" y1="294" x2="170" y2="350" stroke={downEnergized ? liveColor : deadColor} strokeWidth="3" />

                  {/* Animated Dashed Flow Line */}
                  {downEnergized && !reducedMotion && (
                    <line x1="170" y1="34" x2="170" y2="350" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6 18" opacity="0.9">
                      <animate attributeName="stroke-dashoffset" values="24;0" dur="0.6s" repeatCount="indefinite" />
                    </line>
                  )}

                  {/* M1 Motor Circle */}
                  <circle cx="170" cy="384" r="34" fill="#10263A" stroke={downEnergized ? liveColor : deadColor} strokeWidth="3" />
                  <text x="170" y="384" textAnchor="middle" fill="#F3F7FA" fontFamily="Space Grotesk" fontSize="18" fontWeight="700">M</text>
                  <text x="170" y="402" textAnchor="middle" fill="#93A4B4" fontFamily="IBM Plex Mono" fontSize="11">3~</text>
                  <text x="214" y="390" fill="#F3F7FA" fontFamily="Space Grotesk" fontSize="14" fontWeight="600">M1 · 15 kW</text>
                </svg>
              </div>

              {/* Right Control Dashboard */}
              <div style={{ padding: 'clamp(24px, 3vw, 40px)', display: 'flex', flexDirection: 'column', gap: 28, borderLeft: '1px solid #1E3347' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderBottom: '1px solid #1E3347', paddingBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: '#93A4B4' }}>
                      {isFR ? 'ÉTAT DU MOTEUR' : 'MOTOR STATE'}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        color: wbState === 'running' ? '#F2A541' : (wbState === 'tripped' || wbState === 'fault' ? '#FF8A8D' : (wbState === 'over' ? '#FFC277' : '#F3F7FA'))
                      }}
                    >
                      {wbState === 'stopped' && (isFR ? 'Arrêté' : 'Stopped')}
                      {wbState === 'running' && (isFR ? 'En marche' : 'Running')}
                      {wbState === 'over' && (isFR ? 'En surcharge' : 'Overloaded')}
                      {wbState === 'tripped' && (isFR ? 'Déclenché — surcharge' : 'Tripped — overload')}
                      {wbState === 'fault' && (isFR ? 'Défaut éliminé par Q1' : 'Fault cleared by Q1')}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: '#93A4B4' }}>
                      {isFR ? 'COURANT DE LIGNE' : 'LINE CURRENT'}
                    </div>
                    <div style={{ marginTop: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 'clamp(1.5rem, 2.4vw, 2rem)', fontWeight: 500, color: '#F3F7FA' }}>
                      {wbState === 'running' ? '29 A' : (wbState === 'over' ? '41 A' : '0 A')}
                    </div>
                  </div>
                </div>

                {/* Control Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button
                    onClick={handleStartMotor}
                    disabled={wbState !== 'stopped'}
                    style={{ height: 48, padding: '0 22px', borderRadius: 999, border: 0, background: '#F2A541', color: '#0B1B2B', fontSize: 15, fontWeight: 600, opacity: wbState === 'stopped' ? 1 : 0.35, cursor: wbState === 'stopped' ? 'pointer' : 'not-allowed' }}
                  >
                    {isFR ? 'Marche' : 'Start'}
                  </button>
                  <button
                    onClick={handleStopMotor}
                    disabled={!kmClosed}
                    style={{ height: 48, padding: '0 22px', borderRadius: 999, border: '1px solid #3A536B', background: 'transparent', color: '#F3F7FA', fontSize: 15, opacity: kmClosed ? 1 : 0.35, cursor: kmClosed ? 'pointer' : 'not-allowed' }}
                  >
                    {isFR ? 'Arrêt' : 'Stop'}
                  </button>
                  <button
                    onClick={handleSimulateOverload}
                    disabled={wbState !== 'running'}
                    style={{ height: 48, padding: '0 22px', borderRadius: 999, border: '1px solid #3A536B', background: 'transparent', color: '#F3F7FA', fontSize: 15, opacity: wbState === 'running' ? 1 : 0.35, cursor: wbState === 'running' ? 'pointer' : 'not-allowed' }}
                  >
                    {isFR ? 'Simuler une surcharge' : 'Simulate overload'}
                  </button>
                  <button
                    onClick={handleShortCircuit}
                    disabled={wbState !== 'running'}
                    style={{ height: 48, padding: '0 22px', borderRadius: 999, border: '1px solid #3A536B', background: 'transparent', color: '#F3F7FA', fontSize: 15, opacity: wbState === 'running' ? 1 : 0.35, cursor: wbState === 'running' ? 'pointer' : 'not-allowed' }}
                  >
                    {isFR ? 'Court-circuit au moteur' : 'Short-circuit at motor'}
                  </button>
                  <button
                    onClick={handleResetFeeder}
                    disabled={wbState !== 'tripped' && wbState !== 'fault'}
                    style={{ height: 48, padding: '0 22px', borderRadius: 999, border: '1px solid #E5484D', background: 'transparent', color: '#FF8A8D', fontSize: 15, opacity: wbState === 'tripped' || wbState === 'fault' ? 1 : 0.35, cursor: wbState === 'tripped' || wbState === 'fault' ? 'pointer' : 'not-allowed' }}
                  >
                    {isFR ? 'Réarmer' : 'Reset'}
                  </button>
                </div>

                {/* Event Log Stream */}
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: '#93A4B4' }}>
                    {isFR ? 'JOURNAL' : 'EVENT LOG'}
                  </div>
                  <div aria-live="polite" style={{ marginTop: 10, display: 'flex', flexDirection: 'column' }}>
                    {eventLog.map((ev, i) => (
                      <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid #1E3347', fontSize: 14, color: ev.ink }}>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#93A4B4', minWidth: 64 }}>
                          {ev.t}
                        </span>
                        <span>{LOG_TEXTS[ev.key] ? (isFR ? LOG_TEXTS[ev.key][1] : LOG_TEXTS[ev.key][0]) : ev.key}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p style={{ margin: 'auto 0 0', fontSize: 13, lineHeight: 1.55, color: '#93A4B4' }}>
                  {isFR
                    ? 'Sélectivité : F1 (thermique) élimine la surcharge, Q1 (magnétique) élimine le court-circuit. Simulation pédagogique — pas de données réelles d’équipement.'
                    : 'Selectivity: F1 (thermal) clears overload, Q1 (magnetic) clears short-circuit. Teaching simulation — not live equipment data.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 06 CASE STUDY (NACHTIGAL HYDRO)                                           */}
        {/* ========================================================================= */}
        <section id="case" data-screen-label="06 Case study" style={{ background: '#EEF4F8', color: '#0B1B2B', padding: 'clamp(80px, 10vw, 140px) 0', scrollMarginTop: 68 }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: '24px 64px', alignItems: 'end' }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.12em', color: '#1F5FAE' }}>
                  {isFR ? 'ÉTUDE DE CAS · NACHTIGAL, SANAGA' : 'CASE STUDY · NACHTIGAL HYDRO, SANAGA'}
                </div>
                <h2 style={{ margin: '18px 0 0', fontSize: 'clamp(2.4rem, 5vw, 4.6rem)', lineHeight: 0.98, letterSpacing: '-0.045em', fontWeight: 700 }}>
                  {isFR ? 'Quatre gestes, sur une seule centrale.' : 'Four moves, shown on one plant.'}
                </h2>
              </div>
              <p style={{ margin: 0, maxWidth: 520, fontSize: '1.15rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                {isFR
                  ? 'C’est ainsi que fonctionne chaque leçon EPEDE : voir l’équipement, comprendre l’unifilaire, calculer avec des hypothèses explicites, puis appliquer en simulation.'
                  : 'This is how every EPEDE lesson works: see the equipment, understand the one-line, calculate with stated assumptions, then apply it in simulation.'}
              </p>
            </div>

            <div style={{ marginTop: 'clamp(48px, 6vw, 80px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: 0, borderTop: '2px solid #0B1B2B' }}>
              {/* Step 1: SEE */}
              <div style={{ padding: '28px 28px 28px 0', borderBottom: '1px solid #D5E0E8', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#1F5FAE' }}>{isFR ? '01 · VOIR' : '01 · SEE'}</div>
                <div style={{ aspectRatio: '4/3', borderRadius: 4, overflow: 'hidden', background: '#E3ECF2' }}>
                  <img src="/assets/production/hydro.jpg" alt="Nachtigal hydro powerhouse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                  {isFR
                    ? 'Une centrale au fil de l’eau sur la Sanaga : sept groupes Francis d’environ 60 MW — 420 MW à pleine puissance.'
                    : 'A run-of-river plant on the Sanaga: seven Francis units of about 60 MW — 420 MW at full output.'}
                </p>
              </div>

              {/* Step 2: UNDERSTAND */}
              <div style={{ padding: '28px 28px 28px 0', borderBottom: '1px solid #D5E0E8', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#1F5FAE' }}>{isFR ? '02 · COMPRENDRE' : '02 · UNDERSTAND'}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    { t: isFR ? '7 groupes Francis' : '7 Francis units', v: '7 × ~60 MW', fill: '#F2A541' },
                    { t: isFR ? 'Transformateurs élévateurs' : 'Step-up transformers', v: '→ 225 kV', fill: '#F2F0EA' },
                    { t: isFR ? 'Ligne d’évacuation 2 × 225 kV' : '2 × 225 kV evacuation line', v: '~50 km', fill: '#F2F0EA' },
                    { t: isFR ? 'Poste de Nyom II, Yaoundé' : 'Nyom II substation, Yaoundé', v: '225 kV', fill: '#F2F0EA' },
                    { t: isFR ? 'Réseau interconnecté Sud' : 'Southern interconnected grid', v: 'RIS', fill: '#F2A541' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0 12px 22px', borderBottom: '1px solid #D5E0E8' }}>
                      <span style={{ position: 'absolute', left: 4, top: 18, width: 9, height: 9, borderRadius: '50%', background: item.fill, border: '2px solid #0B1B2B' }} />
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{item.t}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1F5FAE', whiteSpace: 'nowrap' }}>{item.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: CALCULATE */}
              <div style={{ padding: '28px 28px 28px 0', borderBottom: '1px solid #D5E0E8', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#1F5FAE' }}>{isFR ? '03 · CALCULER' : '03 · CALCULATE'}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, lineHeight: 1.9, color: '#0B1B2B' }}>
                  I = P / (√3 · U · cos φ)<br />= 420 MW / (√3 × 225 kV × 0.95)
                </div>
                <div style={{ fontSize: 'clamp(3rem, 5vw, 4.4rem)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>
                  ≈ 1,134 A
                </div>
                <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                  {isFR ? 'Courant total d’évacuation — environ 567 A par terne sur la ligne 2 × 225 kV.' : 'Total evacuation current — about 567 A per circuit on the 2 × 225 kV line.'}
                </p>
                <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, lineHeight: 1.6, color: '#5B6B7B' }}>
                  {isFR ? 'Hypothèses : cos φ = 0,95, pleine puissance, pertes négligées. Chiffres publics indicatifs — à vérifier auprès de la source citée.' : 'Assumptions: cos φ = 0.95, full output, losses neglected. Indicative public figures — confirm against the cited source.'}
                </p>
              </div>

              {/* Step 4: APPLY */}
              <div style={{ padding: '28px 0', borderBottom: '1px solid #D5E0E8', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#1F5FAE' }}>{isFR ? '04 · APPLIQUER' : '04 · APPLY'}</div>
                <p style={{ margin: 0, fontSize: '1.25rem', lineHeight: 1.45, fontWeight: 500, letterSpacing: '-0.01em' }}>
                  {isFR
                    ? 'Chargez la ligne d’évacuation dans le laboratoire de simulation, déclenchez un terne et vérifiez si l’autre peut transiter toute la puissance.'
                    : 'Load the evacuation line in the simulation lab, trip one circuit and check whether the other can carry the full output.'}
                </p>
                <button
                  onClick={() => onNavigateSimulation?.()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 48, width: 'max-content', padding: '0 22px', borderRadius: 999, background: '#0B1B2B', color: '#FFFFFF', fontWeight: 600, border: 0, cursor: 'pointer' }}
                  className="hover:bg-[#1F5FAE] transition-colors"
                >
                  {isFR ? 'Ouvrir la simulation →' : 'Open the simulation →'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 07 PROJECTS (CAMEROON IN CONTEXT)                                         */}
        {/* ========================================================================= */}
        <section data-screen-label="07 Projects" style={{ background: '#FBFCFD', padding: 'clamp(80px, 10vw, 140px) 0' }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.12em', color: '#1F5FAE' }}>
              {isFR ? 'LE CAMEROUN EN CONTEXTE' : 'CAMEROON IN CONTEXT'}
            </div>
            <h2 style={{ margin: '18px 0 0', fontSize: 'clamp(2.4rem, 5vw, 4.6rem)', lineHeight: 0.98, letterSpacing: '-0.045em', fontWeight: 700 }}>
              <span style={{ display: 'block' }}>{isFR ? 'Des infrastructures réelles,' : 'Real infrastructure,'}</span>
              <span style={{ display: 'block', color: '#5B6B7B' }}>{isFR ? 'lues en ingénieur.' : 'read as engineering.'}</span>
            </h2>

            <div style={{ marginTop: 'clamp(48px, 6vw, 80px)', display: 'flex', flexDirection: 'column' }}>
              {PROJECTS.map((proj) => (
                <article
                  key={proj.slot}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
                    gap: '28px 56px',
                    padding: '36px 0',
                    borderTop: '1px solid #D5E0E8',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ aspectRatio: '16/10', borderRadius: 4, overflow: 'hidden', background: '#E3ECF2' }}>
                    <img src={proj.img} alt={isFR ? proj.titleFR : proj.titleEN} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.08em', color: '#1F5FAE' }}>
                      {isFR ? proj.metaFR : proj.metaEN}
                    </div>
                    <h3 style={{ margin: '12px 0 0', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', lineHeight: 1.02, letterSpacing: '-0.04em', fontWeight: 700 }}>
                      {isFR ? proj.titleFR : proj.titleEN}
                    </h3>
                    <p style={{ margin: '16px 0 0', maxWidth: 520, fontSize: '1.05rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                      {isFR ? proj.descFR : proj.descEN}
                    </p>
                    <button
                      onClick={() => onSelectDomain(proj.domain)}
                      style={{ marginTop: 18, display: 'inline-flex', gap: 10, minHeight: 44, alignItems: 'center', fontWeight: 600, background: 'transparent', border: 0, padding: 0, color: '#1F5FAE', cursor: 'pointer' }}
                      className="hover:underline"
                    >
                      <span>{isFR ? proj.ctaFR : proj.ctaEN}</span>
                      <span>→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <p style={{ margin: '24px 0 0', fontSize: 13, color: '#5B6B7B' }}>
              {isFR ? 'Les puissances sont des chiffres publics indicatifs ; vérifiez-les auprès de la source citée sur chaque page projet.' : 'Capacities are indicative public figures; confirm against the cited source in each project page.'}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 08 PATHWAYS (8 PARCOURS)                                                  */}
        {/* ========================================================================= */}
        <section id="pathways" data-screen-label="08 Pathways" style={{ background: '#EEF4F8', color: '#0B1B2B', padding: 'clamp(80px, 10vw, 140px) 0', scrollMarginTop: 68 }}>
          <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: '24px 64px', alignItems: 'end' }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.12em', color: '#1F5FAE' }}>
                  {isFR ? 'PARCOURS D’APPRENTISSAGE' : 'LEARNING PATHWAYS'}
                </div>
                <h2 style={{ margin: '18px 0 0', fontSize: 'clamp(2.4rem, 5vw, 4.6rem)', lineHeight: 0.98, letterSpacing: '-0.045em', fontWeight: 700 }}>
                  <span style={{ display: 'block' }}>{isFR ? 'Huit parcours.' : 'Eight pathways.'}</span>
                  <span style={{ display: 'block', color: '#6A7A8A' }}>{isFR ? 'Une pratique connectée.' : 'One connected practice.'}</span>
                </h2>
              </div>
              <p style={{ margin: 0, maxWidth: 520, fontSize: '1.15rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                {isFR
                  ? 'Du premier volt à la salle de commande : huit parcours structurés, chacun fondé sur du matériel réel, des normes et les infrastructures camerounaises.'
                  : 'From the first volt to the control room: eight structured pathways, each built on real equipment, standards and Cameroonian infrastructure.'}
              </p>
            </div>

            <div style={{ marginTop: 'clamp(48px, 6vw, 80px)', display: 'grid', gridTemplateColumns: isWide ? 'minmax(0, 5fr) minmax(0, 7fr)' : 'minmax(0, 1fr)', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'start' }}>
              {/* Pathways Tab List (Left) */}
              <div role="tablist" aria-label="Learning pathways" style={{ borderTop: '2px solid #0B1B2B' }}>
                {PATHWAYS.map((p, idx) => {
                  const isSelected = idx === activePathwayIndex;
                  return (
                    <div key={idx} style={{ borderBottom: '1px solid #D5E0E8' }}>
                      <button
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => handlePickPathway(idx)}
                        onMouseEnter={() => { if (isWide) handlePickPathway(idx); }}
                        style={{
                          position: 'relative',
                          width: '100%',
                          display: 'grid',
                          gridTemplateColumns: '52px minmax(0, 1fr) auto',
                          gap: 16,
                          alignItems: 'center',
                          padding: '22px 0',
                          border: 0,
                          background: 'transparent',
                          textAlign: 'left',
                          color: '#0B1B2B',
                          cursor: 'pointer'
                        }}
                      >
                        {/* Amber selection bar */}
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: -1,
                            height: 2,
                            width: isSelected ? '100%' : '0%',
                            background: '#F2A541',
                            transition: 'width .6s cubic-bezier(.16,1,.3,1)'
                          }}
                        />
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: isSelected ? '#1F5FAE' : '#5B6B7B', transition: 'color .3s ease' }}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span
                          style={{
                            fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)',
                            lineHeight: 1.25,
                            fontWeight: isSelected ? 700 : 500,
                            letterSpacing: '-0.02em',
                            color: isSelected ? '#0B1B2B' : '#3A4B5C',
                            transform: isSelected && isWide ? 'translateX(6px)' : 'none',
                            transition: 'color .3s ease, transform .4s cubic-bezier(.16,1,.3,1)'
                          }}
                        >
                          {isFR ? p.titleFR : p.titleEN}
                        </span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.04em', color: '#5B6B7B', whiteSpace: 'nowrap', textAlign: 'right' }}>
                          {isFR ? p.tagFR : p.tagEN}
                        </span>
                      </button>

                      {/* Mobile Accordion Inline View */}
                      {!isWide && isSelected && (
                        <div style={{ padding: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ aspectRatio: '16/10', borderRadius: 4, overflow: 'hidden', background: '#E3ECF2' }}>
                            <img src={p.img} alt={isFR ? p.titleFR : p.titleEN} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                            {isFR ? p.descFR : p.descEN}
                          </p>
                          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                            {(isFR ? p.topicsFR : p.topicsEN).map((topic, tIdx) => (
                              <li key={tIdx} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: '1px solid #D5E0E8', fontSize: 15, lineHeight: 1.45 }}>
                                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#1F5FAE', paddingTop: 3 }}>
                                  {String(tIdx + 1).padStart(2, '0')}
                                </span>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => onNavigateView('thematic-journeys')}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 48, width: 'max-content', padding: '0 22px', borderRadius: 999, background: '#0B1B2B', color: '#FFFFFF', fontWeight: 600, border: 0, cursor: 'pointer' }}
                            className="hover:bg-[#1F5FAE] transition-colors"
                          >
                            <span>{isFR ? 'Ouvrir ce parcours' : 'Open this pathway'}</span>
                            <span>→</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop Sticky Detail Panel (Right) */}
              {isWide && (
                <div style={{ position: 'sticky', top: 100 }}>
                  <div style={{ position: 'relative', aspectRatio: '16/10', borderRadius: 6, overflow: 'hidden', background: '#E3ECF2' }}>
                    {PATHWAYS.map((p, idx) => (
                      <img
                        key={idx}
                        src={p.img}
                        alt=""
                        loading="lazy"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: idx === pathwayImgIndex ? 1 : 0,
                          transform: idx === pathwayImgIndex && !reducedMotion ? 'scale(1.06)' : 'scale(1)',
                          transition: 'opacity .9s ease, transform 6s ease'
                        }}
                      />
                    ))}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 'auto 0 0 0',
                        padding: '48px 20px 14px',
                        background: 'linear-gradient(180deg, rgba(14,26,28,0), rgba(14,26,28,.6))',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 16,
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        color: '#F2F0EA'
                      }}
                    >
                      <span>{PATHWAYS[activePathwayIndex].cr}</span>
                      <span>{String(activePathwayIndex + 1).padStart(2, '0')} / 08</span>
                    </div>
                    <div style={{ position: 'absolute', left: 16, top: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ height: 30, padding: '0 12px', borderRadius: 999, background: '#0B1B2B', color: '#FFFFFF', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', display: 'flex', alignItems: 'center' }}>
                        {isFR ? 'PARCOURS' : 'PATHWAY'} {String(activePathwayIndex + 1).padStart(2, '0')}
                      </span>
                      <span style={{ height: 30, padding: '0 12px', borderRadius: 999, background: 'rgba(242,240,234,.92)', color: '#0B1B2B', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, display: 'flex', alignItems: 'center' }}>
                        {isFR ? PATHWAYS[activePathwayIndex].tagFR : PATHWAYS[activePathwayIndex].tagEN}
                      </span>
                    </div>
                  </div>

                  <div style={{ opacity: pathwayTransition ? 0 : 1, transform: pathwayTransition ? 'translateY(10px)' : 'none', transition: 'opacity .35s ease, transform .5s cubic-bezier(.16,1,.3,1)' }}>
                    <h3 style={{ margin: '28px 0 0', fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)', lineHeight: 1.04, letterSpacing: '-0.04em', fontWeight: 700 }}>
                      {isFR ? PATHWAYS[activePathwayIndex].titleFR : PATHWAYS[activePathwayIndex].titleEN}
                    </h3>
                    <p style={{ margin: '14px 0 0', maxWidth: 640, fontSize: '1.08rem', lineHeight: 1.6, color: '#3A4B5C' }}>
                      {isFR ? PATHWAYS[activePathwayIndex].descFR : PATHWAYS[activePathwayIndex].descEN}
                    </p>
                    <div style={{ marginTop: 24, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: '#5B6B7B' }}>
                      {isFR ? 'AU PROGRAMME' : 'WHAT YOU WILL COVER'}
                    </div>
                    <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', columnGap: 32 }}>
                      {(isFR ? PATHWAYS[activePathwayIndex].topicsFR : PATHWAYS[activePathwayIndex].topicsEN).map((topic, tIdx) => (
                        <li key={tIdx} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid #D5E0E8', fontSize: 15, lineHeight: 1.45 }}>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#1F5FAE', paddingTop: 3 }}>
                            {String(tIdx + 1).padStart(2, '0')}
                          </span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => onNavigateView('thematic-journeys')}
                      style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 52, padding: '0 26px', borderRadius: 999, background: '#0B1B2B', color: '#FFFFFF', fontWeight: 600, border: 0, cursor: 'pointer' }}
                      className="hover:bg-[#1F5FAE] transition-colors"
                    >
                      <span>{isFR ? 'Ouvrir ce parcours' : 'Open this pathway'}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 09 FINAL CALL TO ACTION                                                   */}
        {/* ========================================================================= */}
        <section data-screen-label="09 CTA" style={{ position: 'relative', background: '#0B1B2B', color: '#F3F7FA', padding: 'clamp(100px, 14vw, 200px) 0', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 80% at 80% 100%, rgba(242, 165, 65, 0.16), rgba(242, 165, 65, 0) 70%)' }} />
          <div style={{ position: 'relative', maxWidth: 1360, margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>
            <h2 style={{ margin: 0, willChange: 'transform', fontSize: 'clamp(3rem, 8vw, 8rem)', lineHeight: 0.92, letterSpacing: '-0.06em', fontWeight: 700 }}>
              <span style={{ display: 'block', color: '#F3F7FA' }}>{isFR ? 'Voir chaque connexion.' : 'See every connection.'}</span>
              <span style={{ display: 'block', color: '#F2A541' }}>{isFR ? 'Maîtriser le système.' : 'Master the system.'}</span>
            </h2>
            <div style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button
                onClick={() => onNavigateJourney?.()}
                style={{ height: 56, padding: '0 26px', borderRadius: 999, background: '#F2A541', color: '#0B1B2B', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', border: 0, cursor: 'pointer' }}
                className="hover:bg-[#FFC277] transition-colors"
              >
                {isFR ? 'Explorer le parcours de l’énergie →' : 'Explore the power journey →'}
              </button>
              <a
                href="#pathways"
                style={{ height: 56, padding: '0 26px', borderRadius: 999, border: '1px solid #3A536B', color: '#F3F7FA', fontSize: 16, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                className="hover:border-[#F3F7FA] transition-colors"
              >
                {isFR ? 'Parcourir les formations' : 'Browse learning paths'}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
