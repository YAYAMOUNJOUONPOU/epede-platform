// src/components/installations/FacilityArchetypesExplorer.tsx
// EPEDE D06 - Comprehensive Multi-Building Electrical Archetypes Explorer (8 Facility Modes)
// Demonstrates electrical infrastructure sizing, SLD concepts, emergency supplies, and earthing tailored to each building typology.

import React, { useState } from 'react';
import {
  Building2,
  Home,
  Factory,
  HeartPulse,
  Server,
  GraduationCap,
  Store,
  Layers,
  Zap,
  ShieldCheck,
  Activity,
  Sliders,
  AlertTriangle,
  Scale,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

export type BuildingArchetypeId =
  | 'RESIDENTIAL'
  | 'COMMERCIAL_RETAIL'
  | 'OFFICE_CORPORATE'
  | 'INDUSTRIAL'
  | 'HOSPITAL_HEALTHCARE'
  | 'DATA_CENTER'
  | 'EDUCATIONAL'
  | 'MIXED_USE';

export interface BuildingArchetypeSpec {
  id: BuildingArchetypeId;
  code: string;
  name: { fr: string; en: string };
  category: string;
  typicalCapacity: string;
  nominalVoltage: string;
  incomerConfiguration: { fr: string; en: string };
  emergencySources: { fr: string; en: string };
  recommendedEarthing: 'TT' | 'TN_S' | 'TN_C_S' | 'IT';
  tgbtForm: 'Form 1' | 'Form 2b' | 'Form 3b' | 'Form 4b';
  subDistributionBoards: { fr: string; en: string }[];
  criticalLoads: { fr: string; en: string }[];
  powerQualityChallenges: { fr: string; en: string };
  governingStandards: string[];
  description: { fr: string; en: string };
  icon: any;
  accentColor: string;
}

export const BUILDING_ARCHETYPES: BuildingArchetypeSpec[] = [
  {
    id: 'RESIDENTIAL',
    code: 'ARCH-01-RES',
    name: { fr: 'Bâtiment Résidentiel (Collectif & Individuel)', en: 'Residential Buildings (Multi & Single-Family)' },
    category: 'Habitation / Living Spaces',
    typicalCapacity: '36 kVA à 250 kVA (ou 6-12 kVA individuel)',
    nominalVoltage: '230 V Monophasé / 400 V Triphasé (50 Hz)',
    incomerConfiguration: {
      fr: 'Branchement à puissance limitée (Tarif Bleu / Jaune) avec Disjoncteur de Branchement 500 mA sélectif.',
      en: 'Utility service connection with main service circuit breaker (500 mA selective RCD incomer).'
    },
    emergencySources: {
      fr: 'Généralement sans groupe électrogène (sauf ascenseur et désenfumage en IGH / Immeuble Grande Hauteur).',
      en: 'No standby generator except for life-safety elevators and smoke extraction in high-rise buildings.'
    },
    recommendedEarthing: 'TT',
    tgbtForm: 'Form 1',
    subDistributionBoards: [
      { fr: 'Tableau de distribution services généraux (Éclairage cage, parkings, VMC)', en: 'Common services distribution board (Staircases, parking, ventilation)' },
      { fr: 'Tableaux divisionnaires privatifs par appartement (1 à 4 rangées DIN)', en: 'Individual apartment modular consumer units (1 to 4 DIN rails)' }
    ],
    criticalLoads: [
      { fr: 'Éclairage de sécurité / BAES', en: 'Emergency escape lighting BAES' },
      { fr: 'Centrale de désenfumage et surpression', en: 'Smoke extraction and pressurization fans' },
      { fr: 'Ascenseurs et portes automatiques', en: 'Elevators and automated fire doors' }
    ],
    powerQualityChallenges: {
      fr: 'Harmoniques de rang 3 générées par les alimentations à découpage (TV, ordinateurs, chargeurs) et déséquilibre des phases.',
      en: '3rd order harmonics from switched-mode power supplies (LED drivers, PCs) and phase unbalance across single-phase loads.'
    },
    governingStandards: ['IEC 60364-7-701', 'NF C 15-100 Titre 7-701', 'IEC 61008-1'],
    description: {
      fr: 'Priorité absolue à la protection des personnes contre les contacts directs et indirects via des différentiels 30 mA haute sensibilité (Type A et AC) et coupure d\'urgence accessible.',
      en: 'Paramount priority on personnel safety against direct/indirect electric shock via high-sensitivity 30 mA RCDs and readily accessible emergency isolation.'
    },
    icon: Home,
    accentColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30'
  },
  {
    id: 'COMMERCIAL_RETAIL',
    code: 'ARCH-02-RET',
    name: { fr: 'Centre Commercial & Grandes Surfaces (ERP)', en: 'Commercial Malls & Retail Superstores (ERP)' },
    category: 'Tertiaire / Établissement Recevant du Public (ERP)',
    typicalCapacity: '250 kVA à 1250 kVA (Poste MT/BT dédié)',
    nominalVoltage: '400 V Triphasé + Neutre',
    incomerConfiguration: {
      fr: 'Poste MT/BT privé 30 kV / 400 V avec transformateur 630-1000 kVA et TGBT en Forme 2b ou 3b.',
      en: 'Private MV/LV 30 kV / 400 V substation with 630-1000 kVA transformer and Form 2b/3b MDB.'
    },
    emergencySources: {
      fr: 'Groupe électrogène de secours diesel (ATS < 15 s) pour éclairage de sécurité, caisses et chambres froides.',
      en: 'Diesel standby generator (ATS < 15 s) for escape lighting, POS cash terminals, and refrigeration units.'
    },
    recommendedEarthing: 'TN_S',
    tgbtForm: 'Form 2b',
    subDistributionBoards: [
      { fr: 'Tableau Force Motrice CVC (Chillers & Centrales Traitement Air)', en: 'HVAC Mechanical Switchboard (Chillers & AHUs)' },
      { fr: 'Tableau Éclairage Commercial & Enseignes Lumineuses DALI', en: 'Commercial DALI Architectural & Display Lighting Board' },
      { fr: 'Tableau Froid Alimentaire & Chambres Positives/Négatives', en: 'Commercial Refrigeration & Cold Storage Board' },
      { fr: 'Tableau Bornes de Recharge Parking (IRVE 22 kW)', en: 'Parking Lot EV Charging Board (IRVE 22 kW)' }
    ],
    criticalLoads: [
      { fr: 'Chambres froides négatives (Continuité chaîne du froid)', en: 'Deep-freeze cold rooms (Cold-chain continuity)' },
      { fr: 'Système de Sécurité Incendie SSI (Sprinklers, Rideaux)', en: 'Fire Safety System (Sprinklers, Fire shutters)' },
      { fr: 'Escalators, travelators et monte-charges', en: 'Escalators, moving walkways, and goods lifts' }
    ],
    powerQualityChallenges: {
      fr: 'Fort appel de courant au démarrage des compresseurs frigorifiques et taux élevé de distorsion harmonique par les ballasts électroniques.',
      en: 'High inrush currents from refrigeration compressors and high THD from thousands of electronic LED drivers.'
    },
    governingStandards: ['IEC 60364-7-718', 'NF C 15-100 ERP', 'IEC 61439-2'],
    description: {
      fr: 'Environnement ERP soumis à des règles strictes de sécurité incendie, de désenfumage automatique et de continuité de la chaîne du froid commercial.',
      en: 'Public facility requiring rigorous compliance with fire safety codes, automated smoke dampers, and uninterrupted cold-chain operation.'
    },
    icon: Store,
    accentColor: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30'
  },
  {
    id: 'OFFICE_CORPORATE',
    code: 'ARCH-03-OFF',
    name: { fr: 'Immeuble de Bureaux & Siège Corporatif', en: 'Corporate Office Building & Headquarters' },
    category: 'Tertiaire Bureaux / High-Tech Workspace',
    typicalCapacity: '400 kVA à 1600 kVA',
    nominalVoltage: '400 V / 230 V (50 Hz)',
    incomerConfiguration: {
      fr: 'Arrivée transformateur MT/BT dédié avec TGBT modulaire Forme 3b et gaines montantes préfabriquées (Busway).',
      en: 'Dedicated MV/LV transformer incomer with Form 3b MDB and prefabricated vertical busway risers.'
    },
    emergencySources: {
      fr: 'Groupe électrogène de secours 400 kVA + Onduleur centralisé UPS 120 kVA pour les postes de travail et serveurs.',
      en: '400 kVA backup diesel genset + 120 kVA centralized online UPS for workstations and floor server hubs.'
    },
    recommendedEarthing: 'TN_S',
    tgbtForm: 'Form 3b',
    subDistributionBoards: [
      { fr: 'Tableaux divisionnaires d\'étage (1 par demi-plateau)', en: 'Floor sub-distribution boards (1 per floor zone)' },
      { fr: 'Tableaux ondulés UPS (Prises rouges informatiques)', en: 'Clean UPS power distribution boards (Red IT sockets)' },
      { fr: 'Tableau CVC Roof-Top & Pompes à chaleur VRV', en: 'Rooftop HVAC & VRV Heat Pump distribution board' }
    ],
    criticalLoads: [
      { fr: 'Local serveur et baie de brassage télécom (Data room)', en: 'Floor telecom patch rooms & localized server nodes' },
      { fr: 'Contrôle d\'accès, vidéosurveillance et GTB/GTC', en: 'Access control, CCTV security, and BMS controllers' },
      { fr: 'Climatisation de confort des plateaux paysagers', en: 'Open-space climate control and ventilation fans' }
    ],
    powerQualityChallenges: {
      fr: 'Courants de fuite cumulatifs sur le conducteur PE générés par les filtres CEM des centaines d\'ordinateurs ; nécessité de disjoncteurs différentiels Type F ou B.',
      en: 'Cumulative earth leakage on PE conductor from hundreds of PC EMC filters; requires Type F or Type B RCDs.'
    },
    governingStandards: ['IEC 60364-5-52', 'EN 50173', 'IEC 62040-3'],
    description: {
      fr: 'Conçu pour la flexibilité des plateaux tertiaires, la gestion centralisée par GTB/KNX et la protection des équipements numériques sensibles.',
      en: 'Designed for corporate workspace reconfigurability, BMS/KNX automation, and clean power for IT workstations.'
    },
    icon: Building2,
    accentColor: 'border-sky-500/50 text-sky-400 bg-sky-950/30'
  },
  {
    id: 'INDUSTRIAL',
    code: 'ARCH-04-IND',
    name: { fr: 'Usine de Fabrication & Site Industriel', en: 'Manufacturing Plant & Industrial Facility' },
    category: 'Industrie / Heavy Production',
    typicalCapacity: '1000 kVA à 3150 kVA (Transformateurs multiples)',
    nominalVoltage: '400 V / 690 V Triphasé',
    incomerConfiguration: {
      fr: 'Double arrivée MT 30 kV avec inverseur automatique de boucle et 2 transformateurs 1600 kVA en parallèle ou couplés.',
      en: 'Dual 30 kV MV incomers with auto-ring transfer and two 1600 kVA transformers with bus-tie coupler.'
    },
    emergencySources: {
      fr: 'Groupe électrogène de secours de forte puissance (800-1500 kVA) pour maintien des processus thermiques critiques.',
      en: 'Heavy-duty 800-1500 kVA diesel genset for critical thermal and chemical process preservation.'
    },
    recommendedEarthing: 'TN_S',
    tgbtForm: 'Form 4b',
    subDistributionBoards: [
      { fr: 'Tableaux Centres de Contrôle Moteurs (MCC) débrochables', en: 'Withdrawable Motor Control Center (MCC) panels' },
      { fr: 'Tableau Lignes d\'Assemblage & Robots Industriels', en: 'Automated Assembly Lines & Robotic Cell boards' },
      { fr: 'Tableau Fours, Traitement Thermique & Soudure', en: 'Furnaces, Thermal Treatment & Welding distribution' },
      { fr: 'Batterie de compensation automatique APFC 400 kvar', en: '400 kvar Automatic Power Factor Correction APFC rack' }
    ],
    criticalLoads: [
      { fr: 'Moteurs de broyeurs, compresseurs et convoyeurs lourds', en: 'Heavy crusher motors, screw compressors, conveyors' },
      { fr: 'Systèmes de refroidissement et pompes de recirculation', en: 'Cooling towers and industrial circulation pumps' },
      { fr: 'Automates programmables industriels (PLC Siemens/Schneider)', en: 'Industrial PLCs & SCADA telemetry nodes' }
    ],
    powerQualityChallenges: {
      fr: 'Chutes de tension importantes au démarrage direct des gros moteurs (5 à 7x In), harmoniques de rang 5, 7, 11 créées par les variateurs VFD, et micro-coupures.',
      en: 'Severe voltage sags during DOL motor starts (5-7x In), 5th/7th/11th harmonics from VFDs, and grid micro-interruptions.'
    },
    governingStandards: ['IEC 60204-1', 'IEC 61439-2', 'IEC 61800-3'],
    description: {
      fr: 'Robustesse électromécanique maximale, cloisonnement Forme 4b pour intervention sous tension, et compensation active de l\'énergie réactive.',
      en: 'Maximum electromechanical ruggedness, Form 4b segregation for hot-swap servicing, and dynamic reactive power compensation.'
    },
    icon: Factory,
    accentColor: 'border-amber-500/50 text-amber-400 bg-amber-950/30'
  },
  {
    id: 'HOSPITAL_HEALTHCARE',
    code: 'ARCH-05-HOS',
    name: { fr: 'Hôpital & Établissement de Santé (Groupe 2)', en: 'Hospital & Healthcare Critical Facility (Group 2)' },
    category: 'Santé / Vital Life-Safety Infrastructure',
    typicalCapacity: '1250 kVA à 2500 kVA (Architecture 2N)',
    nominalVoltage: '400 V / 230 V (et 230 V IT Médical isolé)',
    incomerConfiguration: {
      fr: 'Double arrivée MT indépendante (Réseau 1 + Réseau 2) avec 2 transformateurs MT/BT à 100% de secours mutuel.',
      en: 'Dual independent MV grid feeds (Feed A + Feed B) with 2x 100% redundant MV/LV transformers.'
    },
    emergencySources: {
      fr: '2 Groupes électrogènes diesel synchronisés en parallèle (démarrage < 10 s) + Onduleurs UPS médicaux (t = 0 s).',
      en: 'Dual synchronized backup diesel gensets (start < 10 s) + Medical-grade online UPS systems (t = 0 s).'
    },
    recommendedEarthing: 'IT',
    tgbtForm: 'Form 4b',
    subDistributionBoards: [
      { fr: 'Tableaux IT Médical Salles d\'Opération (Transfo d\'isolement 230/230 V)', en: 'Operating Theater Group 2 Isolated Medical IT Panels' },
      { fr: 'Tableau Réanimation & Soins Intensifs (USI/ICU)', en: 'Intensive Care Unit (ICU) & Resuscitation distribution' },
      { fr: 'Tableau Imagerie Médicale (IRM, Scanner CT, Radiologie)', en: 'Medical Imaging Board (MRI, CT Scanners, X-Ray)' },
      { fr: 'Tableau Services Généraux & Stérilisation', en: 'General Hospital Services & Sterilization Unit' }
    ],
    criticalLoads: [
      { fr: 'Respirateurs artificiels et tables d\'opération', en: 'Life-support ventilators, surgical tables, patient monitors' },
      { fr: 'Système d\'anesthésie et fluides médicaux', en: 'Anesthesia machines, oxygen & vacuum pumps' },
      { fr: 'Éclairage scialytique chirurgical sans coupure', en: 'Zero-break surgical shadowless theater lighting' }
    ],
    powerQualityChallenges: {
      fr: 'Courants de fuite impérativement limités à quelques microampères (µA) pour prévenir la micro-électrocution cardiaque des patients sous cathéter.',
      en: 'Micro-ampere (µA) leakage current limits to prevent cardiac micro-electrocution in catheterized patients.'
    },
    governingStandards: ['IEC 60364-7-710', 'NF C 15-211', 'NFPA 99'],
    description: {
      fr: 'Régime IT médical obligatoire en salles d\'opération avec transformateur d\'isolement médical et Contrôleur Permanent d\'Isolement (CPI) sans déclenchement au premier défaut.',
      en: 'Mandatory isolated IT earthing system in operating theaters with medical isolation transformers and continuous insulation monitors with zero trip on first fault.'
    },
    icon: HeartPulse,
    accentColor: 'border-rose-500/50 text-rose-400 bg-rose-950/30'
  },
  {
    id: 'DATA_CENTER',
    code: 'ARCH-06-DAT',
    name: { fr: 'Data Center & Centre de Données (Tier III / IV)', en: 'Tier III / IV Critical Data Center' },
    category: 'Haute Disponibilité / 99.999% Uptime',
    typicalCapacity: '2 MVA à 20 MVA (Haute densité énergétique)',
    nominalVoltage: '400 V Triphasé (Distribution PDU 230 V/400 V)',
    incomerConfiguration: {
      fr: 'Architecture 2N strictement redondante (Voie A et Voie B physiquement séparées de bout en bout).',
      en: 'Strict 2N concurrent maintainability architecture (Path A and Path B segregated end-to-end).'
    },
    emergencySources: {
      fr: 'Parc de groupes électrogènes diesel 2N N+1 avec réserve de fioul 72h + Batteries Lithium-ion UPS modulaires.',
      en: '2N N+1 diesel generator farm with 72h fuel autonomy + Modular Lithium-ion double-conversion UPS.'
    },
    recommendedEarthing: 'TN_S',
    tgbtForm: 'Form 4b',
    subDistributionBoards: [
      { fr: 'Unités de Distribution Électrique (PDU) en salle serveur', en: 'Power Distribution Units (PDU) inside server halls' },
      { fr: 'Commutateurs Statiques de Transfert (STS sub-4ms)', en: 'Static Transfer Switches (STS sub-4ms fast transfer)' },
      { fr: 'Gaines à barres préfabriquées sous faux-plancher (Busways)', en: 'Overhead / Underfloor Track Busways supplying server racks' },
      { fr: 'Tableau Refroidissement Haute Densité (CRAH & Chillers)', en: 'High-Density CRAH Fans & Chiller plant switchboards' }
    ],
    criticalLoads: [
      { fr: 'Baies serveurs informatiques à double alimentation (PSU A+B)', en: 'Dual-corded server racks (PSU A + PSU B)' },
      { fr: 'Armoires de climatisation de précision CRAH/CRAC', en: 'Precision CRAC / CRAH server room cooling units' },
      { fr: 'Réseaux télécom, routeurs de cœur et SAN stockage', en: 'Core fiber routers, SAN storage matrices, firewalls' }
    ],
    powerQualityChallenges: {
      fr: 'Facteur de puissance unitaire (cos φ ≈ 0.99) mais présence d\'harmoniques à haute fréquence des serveurs et risques de courants vagabonds dans les boucles de terre.',
      en: 'Leading/near-unity power factor (cos φ ≈ 0.99), high-frequency server switching harmonics, and ground-loop stray currents.'
    },
    governingStandards: ['TIA-942', 'EN 50600', 'IEEE 1100 (Emerald Book)', 'IEC 62040-3'],
    description: {
      fr: 'Disponibilité 99.995% (Tier IV), maintenance concurrente sans aucune coupure serveur, et PUE (Power Usage Effectiveness) optimisé.',
      en: '99.995% availability (Tier IV), concurrent maintainability without IT downtime, and optimized PUE energy metrics.'
    },
    icon: Server,
    accentColor: 'border-purple-500/50 text-purple-400 bg-purple-950/30'
  },
  {
    id: 'EDUCATIONAL',
    code: 'ARCH-07-EDU',
    name: { fr: 'Établissement Scolaire, Universitaire & Laboratoires', en: 'Educational Campus, Schools & Laboratories' },
    category: 'Enseignement / ERP Type R',
    typicalCapacity: '160 kVA à 630 kVA',
    nominalVoltage: '400 V / 230 V (50 Hz)',
    incomerConfiguration: {
      fr: 'Poste MT/BT compact ou branchement BT Tarif Jaune avec TGBT Forme 2b et comptage par bâtiment.',
      en: 'Compact MV/LV substation or LV commercial service with Form 2b MDB and sub-metering per faculty.'
    },
    emergencySources: {
      fr: 'Groupe électrogène de secours de moyenne puissance (100 kVA) pour éclairage de sécurité et chambres froides réfectoire.',
      en: 'Medium 100 kVA backup genset for escape lighting, IT core, and dining hall refrigeration.'
    },
    recommendedEarthing: 'TT',
    tgbtForm: 'Form 2b',
    subDistributionBoards: [
      { fr: 'Tableaux Ateliers & Laboratoires avec coupure d\'urgence coup-de-poing', en: 'Workshops & Labs board with master emergency stop pushbuttons' },
      { fr: 'Tableaux Salles de Classe & Amphithéâtres', en: 'Classrooms & Lecture Theaters distribution boards' },
      { fr: 'Tableau Cuisine Centrale & Restauration Universitaire', en: 'Central Campus Dining Kitchen switchboard' }
    ],
    criticalLoads: [
      { fr: 'Éclairage d\'évacuation des amphis et couloirs', en: 'Campus evacuation lighting and exit signboards' },
      { fr: 'Hottes aspirantes de laboratoire de chimie (Extraction solvants)', en: 'Chemistry laboratory fume hoods & exhaust blowers' },
      { fr: 'Serveurs pédagogiques et réseau Wi-Fi campus', en: 'Campus academic servers & Wi-Fi mesh network' }
    ],
    powerQualityChallenges: {
      fr: 'Surcharges ponctuelles lors des travaux pratiques en ateliers mécaniques et multiplicité des prises en accès libre par les étudiants.',
      en: 'Peak inrushes during workshop machine operations and high socket usage density from student laptops.'
    },
    governingStandards: ['IEC 60364-7-718', 'NF C 15-100 ERP Type R', 'EN 12464-1'],
    description: {
      fr: 'Coupures d\'urgence générales obligatoires dans chaque salle de TP/laboratoire avec réarmement par clé pour la sécurité des élèves.',
      en: 'Mandatory master emergency stop pushbuttons with keyed reset in all technical laboratories for student protection.'
    },
    icon: GraduationCap,
    accentColor: 'border-yellow-500/50 text-yellow-400 bg-yellow-950/30'
  },
  {
    id: 'MIXED_USE',
    code: 'ARCH-08-MIX',
    name: { fr: 'Complexe Mixte (Résidentiel + Commerces + Parking IRVE)', en: 'Mixed-Use Complex (Living + Retail + EV Parking)' },
    category: 'Mixte Urbain / Smart Multi-Zone Infrastructure',
    typicalCapacity: '800 kVA à 2500 kVA',
    nominalVoltage: '400 V / 230 V (50 Hz)',
    incomerConfiguration: {
      fr: 'Poste MT/BT avec transformateurs séparés (Transfo A dédié Commerces, Transfo B dédié Logements & IRVE).',
      en: 'Multi-transformer MV/LV substation (Trafo A dedicated to Retail, Trafo B for Residential & EV Charging).'
    },
    emergencySources: {
      fr: 'Groupe électrogène de secours mutualisé 400 kVA avec délesteur dynamique de charges non-prioritaires.',
      en: 'Shared 400 kVA backup diesel genset with dynamic smart load-shedding controller.'
    },
    recommendedEarthing: 'TN_S',
    tgbtForm: 'Form 3b',
    subDistributionBoards: [
      { fr: 'Tableau Général Services Communs & Sécurité Incendie', en: 'Main Common Services & Fire Life-Safety Board' },
      { fr: 'Tableau Infrastructure de Recharge Véhicules Électriques (IRVE)', en: 'Electric Vehicle Charging Infrastructure (EVSE) Board' },
      { fr: 'Tableaux divisionnaires des boutiques et restaurants', en: 'Retail tenant & Restaurant sub-distribution boards' },
      { fr: 'Colonnes montantes résidentielles pour appartements', en: 'Residential vertical risers feeding individual apartments' }
    ],
    criticalLoads: [
      { fr: 'Pompes de relevage des eaux pluviales en sous-sol parking', en: 'Basement stormwater sump pumps and flood prevention' },
      { fr: 'Ventilation & Extraction de monoxyde de carbone (CO) parking', en: 'Basement parking CO ventilation & jet-fans' },
      { fr: 'Bornes de recharge rapide pour véhicules électriques', en: 'Fast DC/AC Electric Vehicle supply equipment' }
    ],
    powerQualityChallenges: {
      fr: 'Forte puissance instantanée demandée par les bornes de recharge VE (grappes de 22 kW) nécessitant une gestion dynamique de l\'énergie (Smart Charging).',
      en: 'High simultaneous peak demands from EV fast chargers requiring dynamic load balancing (Smart Charging).'
    },
    governingStandards: ['IEC 61851-1', 'IEC 60364-7-722', 'NF C 15-100 Titre 7-722'],
    description: {
      fr: 'Intégration d\'un système de management dynamique de la charge (Smart Load Management) pour concilier la recharge des véhicules électriques et la continuité de service des commerces.',
      en: 'Features dynamic Smart Load Management to balance heavy EV charging loads while preserving reliable supply to tenants and retail stores.'
    },
    icon: Layers,
    accentColor: 'border-teal-500/50 text-teal-400 bg-teal-950/30'
  }
];

interface FacilityArchetypesExplorerProps {
  locale: 'fr' | 'en';
  onSelectArchetype?: (archId: BuildingArchetypeId) => void;
  selectedArchetypeId?: BuildingArchetypeId;
  className?: string;
}

export const FacilityArchetypesExplorer: React.FC<FacilityArchetypesExplorerProps> = ({
  locale,
  onSelectArchetype,
  selectedArchetypeId: propSelectedArchetypeId,
  className = ''
}) => {
  const [activeArchId, setActiveArchId] = useState<BuildingArchetypeId>(propSelectedArchetypeId || 'TERTIARY_COMMERCIAL' as any || 'OFFICE_CORPORATE');

  const activeArch = BUILDING_ARCHETYPES.find((a) => a.id === activeArchId) || BUILDING_ARCHETYPES[2];

  const handleSelect = (arch: BuildingArchetypeSpec) => {
    soundEffects.playSwitchClick();
    setActiveArchId(arch.id);
    if (onSelectArchetype) onSelectArchetype(arch.id);
  };

  return (
    <div className={`rounded-2xl bg-[#080C14] border border-[#1E293B] p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px] tracking-wider mb-1">
            <Building2 className="h-4 w-4" />
            <span>{locale === 'fr' ? 'CATALOGUE DES 8 ARCHETYPES D\'INFRASTRUCTURE ÉLECTRIQUE DU BÂTIMENT' : '8 BUILDING ELECTRICAL INFRASTRUCTURE ARCHETYPES'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Architectures de Distribution par Typologie' : 'Distribution Architectures by Facility Typology'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {locale === 'fr'
              ? 'Chaque typologie de bâtiment possède ses contraintes de puissance, de secours (GE/UPS), de régime de neutre et de continuité de service.'
              : 'Each building archetype demands specific electrical capacities, backup configurations (Genset/UPS), earthing schemes, and safety rules.'}
          </p>
        </div>

        <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" governingStandard="IEC 60364-7 / NF C 15-100" />
      </div>

      {/* 8 Archetypes Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {BUILDING_ARCHETYPES.map((arch) => {
          const IconC = arch.icon;
          const isSelected = arch.id === activeArchId;
          return (
            <button
              key={arch.id}
              type="button"
              onClick={() => handleSelect(arch)}
              className={`p-3 rounded-xl border flex flex-col items-start gap-2 text-left transition-all cursor-pointer group ${
                isSelected
                  ? `${arch.accentColor} ring-2 ring-amber-400/50 shadow-lg scale-102 font-bold`
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <IconC className={`h-5 w-5 ${isSelected ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="text-[9px] text-slate-500 font-mono">{arch.code.split('-')[1]}</span>
              </div>
              <div>
                <h4 className={`text-xs font-bold leading-tight font-mono ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {arch.name[locale].split('(')[0]}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-sans">{arch.typicalCapacity}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Archetype Deep Inspection Dossier */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-5">
        
        {/* Dossier Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                {activeArch.category}
              </span>
              <span className="text-xs text-slate-400 font-mono font-bold">{activeArch.code}</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase font-mono">
              {activeArch.name[locale]}
            </h3>
            <p className="text-xs text-slate-300 font-sans max-w-3xl leading-relaxed">
              {activeArch.description[locale]}
            </p>
          </div>

          {/* Quick Technical Badges */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-3 text-[11px] shrink-0 min-w-[260px]">
            <div>
              <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Régime Neutre :' : 'Earthing System:'}</span>
              <span className="text-amber-300 font-bold font-mono">Schéma {activeArch.recommendedEarthing}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Forme TGBT :' : 'TGBT Segregation:'}</span>
              <span className="text-cyan-300 font-bold font-mono">{activeArch.tgbtForm}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Puissance Typique :' : 'Typical Capacity:'}</span>
              <span className="text-emerald-300 font-bold text-[10px]">{activeArch.typicalCapacity}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Tension de Service :' : 'Service Voltage:'}</span>
              <span className="text-slate-200 text-[10px]">{activeArch.nominalVoltage.split('(')[0]}</span>
            </div>
          </div>
        </div>

        {/* 3-Column Electrical Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Column 1: Power Incomer & Emergency Sources */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-sky-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Alimentation & Secours' : 'Power Incomer & Backup'}</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Arrivée Principale :' : 'Main Incomer:'}</span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{activeArch.incomerConfiguration[locale]}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Sources de Secours (GE / UPS) :' : 'Standby Sources (Genset/UPS):'}</span>
                <p className="text-amber-300 text-[11px] leading-relaxed font-sans">{activeArch.emergencySources[locale]}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Sub-Distribution & Critical Loads */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-rose-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Tableaux & Charges Critiques' : 'Boards & Critical Loads'}</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">{locale === 'fr' ? 'Tableaux Divisionnaires :' : 'Sub-Distribution Boards:'}</span>
                <ul className="space-y-1">
                  {activeArch.subDistributionBoards.map((b, i) => (
                    <li key={i} className="text-slate-300 text-[10px] flex items-start gap-1">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{b[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-rose-400 block text-[10px] font-bold uppercase mb-1">{locale === 'fr' ? 'Charges Prioritaires :' : 'Critical Life-Safety Loads:'}</span>
                <ul className="space-y-1">
                  {activeArch.criticalLoads.map((c, i) => (
                    <li key={i} className="text-rose-200 text-[10px] flex items-start gap-1">
                      <span className="text-rose-400 font-bold">⚡</span>
                      <span>{c[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Column 3: Power Quality & Standards */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Qualité Énergie & Normes' : 'Power Quality & Standards'}</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Enjeux Qualité & Harmoniques :' : 'Power Quality Challenges:'}</span>
                <p className="text-slate-300 text-[10px] leading-relaxed font-sans">{activeArch.powerQualityChallenges[locale]}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-500 block text-[10px] font-bold mb-1.5">{locale === 'fr' ? 'Normes Réglementaires :' : 'Governing Norms:'}</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeArch.governingStandards.map((std, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                      {std}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
