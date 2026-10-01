// src/components/common/MasterInstallationChainExplorer.tsx
// EPEDE - Master End-to-End Electrical Delivery Chain Explorer
// Connects the complete 11-stage path from the High/Medium Voltage Distribution Grid down to the terminal load and useful work.

import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  Shield,
  Layers,
  Building2,
  Box,
  Sliders,
  Cpu,
  Flame,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
  ExternalLink,
  Activity
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

export type DeliveryStageId =
  | 'MV_SUBSTATION'
  | 'MV_FEEDER'
  | 'RMU_SWITCHGEAR'
  | 'MV_LV_TRANSFORMER'
  | 'LV_SERVICE_ENTRY'
  | 'TGBT_SWITCHBOARD'
  | 'SUB_DISTRIBUTION'
  | 'MODULAR_PANEL'
  | 'FINAL_CIRCUITS'
  | 'TERMINAL_LOADS'
  | 'USEFUL_WORK';

export interface DeliveryStageInfo {
  id: DeliveryStageId;
  stepNumber: number;
  code: string;
  name: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  voltageLevel: string;
  nominalCurrent: string;
  keyEquipment: { fr: string; en: string }[];
  governingStandards: string[];
  protectionApparatus: { fr: string; en: string };
  earthingContext: { fr: string; en: string };
  description: { fr: string; en: string };
  icon: any;
  color: string;
  targetDomainCode?: string;
  targetPillar?: string;
}

export const DELIVERY_STAGES: DeliveryStageInfo[] = [
  {
    id: 'MV_SUBSTATION',
    stepNumber: 1,
    code: 'D04 / D05',
    name: { fr: '1. Poste Source HTB / HTA', en: '1. Primary HV/MV Substation' },
    subtitle: { fr: 'Transformation 225 kV ou 90 kV vers 30 kV ou 15 kV', en: '225 kV or 90 kV stepping down to 30 kV or 15 kV' },
    voltageLevel: '225 kV / 30 kV (HTB / HTA)',
    nominalCurrent: '1250 A - 2500 A',
    keyEquipment: [
      { fr: 'Transfo de Puissance 63 MVA YNd11', en: '63 MVA YNd11 Power Transformer' },
      { fr: 'Jeu de Barres 30 kV Metal-Clad', en: '30 kV Metal-Clad Busbar System' },
      { fr: 'Disjoncteur de Tête 30 kV SF6 / Vide', en: '30 kV SF6 / Vacuum Incomer Breaker' }
    ],
    governingStandards: ['IEC 61936-1', 'IEC 62271-200', 'IEC 60076'],
    protectionApparatus: { fr: 'Relais Différentiel 87T + Maximum de courant 50/51/67N', en: '87T Differential Relay + 50/51/67N Overcurrent' },
    earthingContext: { fr: 'Neutre HTA mis à la terre par RPN (Résistance 40 A, 1000 Ω)', en: 'MV neutral grounded via 40 A Neutral Grounding Resistor' },
    description: {
      fr: 'Point d\'injection primaire alimenté par le réseau de transport de l\'opérateur (SONATREL). Le transformateur abaisse la tension pour alimenter le jeu de barres de distribution.',
      en: 'Primary grid injection point supplied by the transmission system operator. The transformer steps down the high voltage to supply the distribution switchgear.'
    },
    icon: Building2,
    color: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30'
  },
  {
    id: 'MV_FEEDER',
    stepNumber: 2,
    code: 'D05.1',
    name: { fr: '2. Artère de Distribution HTA', en: '2. MV Distribution Feeder' },
    subtitle: { fr: 'Ligne aérienne Almelec ou Câble souterrain PRC 30 kV', en: '30 kV Overhead Almelec Line or Underground XLPE Cable' },
    voltageLevel: '30 kV (ou 15 kV legacy)',
    nominalCurrent: '200 A - 630 A',
    keyEquipment: [
      { fr: 'Câble Souterrain 3x240 mm² Al PRC', en: '3x240 mm² Al XLPE Underground Cable' },
      { fr: 'Conducteurs Aériens Aster 148 mm²', en: 'Aster 148 mm² Overhead Conductors' },
      { fr: 'Pylônes et Poteaux Béton / Bois', en: 'Concrete / Wood Poles and Insulators' }
    ],
    governingStandards: ['IEC 60502-2', 'IEC 60826', 'NF C 33-226'],
    protectionApparatus: { fr: 'Protection de Départ 50/51/67N avec Réenclencheur 79', en: 'Feeder Protection 50/51/67N with 79 Auto-Recloser' },
    earthingContext: { fr: 'Écrans métalliques des câbles mis à la terre aux deux extrémités', en: 'Metallic cable screens grounded at both terminations' },
    description: {
      fr: 'Vecteur de transport de l\'énergie à moyenne distance vers les quartiers urbains et zones industrielles. Boucle ouverte (ring) ou antenne radiale.',
      en: 'Medium-distance electrical conduit conveying bulk power to urban boroughs and industrial parks in open-ring or radial topologies.'
    },
    icon: Zap,
    color: 'border-sky-500/50 text-sky-400 bg-sky-950/30'
  },
  {
    id: 'RMU_SWITCHGEAR',
    stepNumber: 3,
    code: 'D05.5',
    name: { fr: '3. Appareillage MT / RMU', en: '3. Ring Main Unit & Switchgear' },
    subtitle: { fr: 'Tableau compact urbain 2L+1T et Organes de coupure', en: 'Compact 3-Way Urban RMU (2L+1T) and Sectionalizers' },
    voltageLevel: '30 kV / 36 kV assignée',
    nominalCurrent: '630 A (Ligne) / 200 A (Transfo)',
    keyEquipment: [
      { fr: 'Tableau RMU 3 Voies étanche SF6', en: '3-Way Sealed SF6 Ring Main Unit' },
      { fr: 'Interrupteurs-Sectionneurs de Ligne', en: 'Load-Break Disconnectors' },
      { fr: 'Combiné Interrupteur-Fusibles HRC', en: 'HRC Fuse-Switch Combination' }
    ],
    governingStandards: ['IEC 62271-200', 'IEC 62271-102', 'IEC 60282-1'],
    protectionApparatus: { fr: 'Fusibles HRC Solefuse ou Relais auto-alimenté VIP', en: 'HRC Solefuse or VIP Self-Powered Protection Relay' },
    earthingContext: { fr: 'Sectionneurs de mise à la terre cadenassables avec voyant VPIS', en: 'Lockable earth switches with VPIS live voltage indicators' },
    description: {
      fr: 'Point de sectionnement et de dérivation sur la boucle MT permettant d\'isoler un tronçon en défaut et de protéger l\'alimentation du transformateur client.',
      en: 'Sectionalizing and tap-off point along the MV ring feeder to isolate cable faults while securing supply to consumer transformers.'
    },
    icon: Sliders,
    color: 'border-blue-500/50 text-blue-400 bg-blue-950/30'
  },
  {
    id: 'MV_LV_TRANSFORMER',
    stepNumber: 4,
    code: 'D05.3',
    name: { fr: '4. Transformateur MT / BT', en: '4. MV / LV Distribution Transformer' },
    subtitle: { fr: 'Abaisseur de tension 30 kV vers 400 V / 230 V Dyn11', en: '30 kV to 400 V / 230 V Dyn11 Step-Down Transformer' },
    voltageLevel: '30 kV → 400 V / 230 V',
    nominalCurrent: '100 kVA à 2500 kVA (144 A à 3600 A BT)',
    keyEquipment: [
      { fr: 'Transfo immergé dans l\'huile minérale ONAN', en: 'Mineral Oil Immersed ONAN Transformer' },
      { fr: 'Transfo sec enrobé résine époxy AN', en: 'Dry-Type Cast Resin Transformer' },
      { fr: 'Relais DGPT2 / DMCR (Pression/Température)', en: 'DGPT2 / DMCR Protection Relay' }
    ],
    governingStandards: ['IEC 60076-1', 'IEC 60076-11', 'EN 50588-1 EcoDesign'],
    protectionApparatus: { fr: 'DGPT2 (Gaz/Pression/T°) + Fusibles amont + Disjoncteur aval', en: 'DGPT2 (Gas/Pressure/Temp) + Upstream Fuses + Downstream ACB' },
    earthingContext: { fr: 'Neutre BT relié directement à la terre (Schéma TT ou TN-S)', en: 'LV neutral grounded directly to local substation earth (TT / TN-S)' },
    description: {
      fr: 'Cœur de la transformation d\'usage : transforme la moyenne tension en basse tension triphasée 400 V (entre phases) et 230 V (phase-neutre).',
      en: 'Core voltage conversion node: steps down medium voltage to standard three-phase 400 V (line-to-line) and 230 V (line-to-neutral).'
    },
    icon: Layers,
    color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30'
  },
  {
    id: 'LV_SERVICE_ENTRY',
    stepNumber: 5,
    code: 'D06.1',
    name: { fr: '5. Arrivée Basse Tension & Comptage', en: '5. LV Main Service Entry & Metering' },
    subtitle: { fr: 'Liaison transformateur-TGBT, comptage tarifaire et parafoudre Type 1', en: 'Trafo-TGBT Busway link, utility tariff metering & Type 1 SPD' },
    voltageLevel: '400 V Triphasé + Neutre',
    nominalCurrent: '400 A - 4000 A',
    keyEquipment: [
      { fr: 'Gaine à Barres Canalis 2500 A Cuivre', en: '2500 A Copper Busbar Trunking' },
      { fr: 'Transformateurs de Courant de Comptage Classe 0.2S', en: 'Class 0.2S Tariff Metering CTs' },
      { fr: 'Parafoudre Tête de Réseau Type 1 (10/350 µs)', en: 'Main Incomer Type 1 SPD (10/350 µs)' }
    ],
    governingStandards: ['IEC 60364-1', 'IEC 61643-11', 'NF C 14-100'],
    protectionApparatus: { fr: 'Parafoudre Type 1+2 Iimp 25 kA + Détection présence tension', en: 'Type 1+2 SPD (Iimp 25 kA) + Phase sequence relay' },
    earthingContext: { fr: 'Barre d\'équipotentialité principale (BEP) reliée à la boucle de fond de fouille', en: 'Main Equipotential Earth Bar bonded to foundation loop' },
    description: {
      fr: 'Interface de livraison entre le distributeur d\'énergie et l\'installation privée du bâtiment, intégrant le comptage transactionnel et l\'écrêtage des surtensions foudre.',
      en: 'Delivery interface between the grid utility and building infrastructure, integrating revenue metering and primary lightning surge suppression.'
    },
    icon: Shield,
    color: 'border-teal-500/50 text-teal-400 bg-teal-950/30'
  },
  {
    id: 'TGBT_SWITCHBOARD',
    stepNumber: 6,
    code: 'D06.2',
    name: { fr: '6. TGBT / Tableau Général Basse Tension', en: '6. Main LV Switchboard (TGBT/MDB)' },
    subtitle: { fr: 'Cœur de distribution forte puissance, Forme 4b et secours GE/UPS', en: 'High-Power Distribution Core, Form 4b Segregation & Genset/UPS' },
    voltageLevel: '400 Vca / 230 Vca',
    nominalCurrent: '800 A - 6300 A (Icw = 50 kA / 1s)',
    keyEquipment: [
      { fr: 'Disjoncteurs Ouverts Débrochables ACB (Masterpact)', en: 'Withdrawable Air Circuit Breakers ACB' },
      { fr: 'Jeu de Barres Principal Cuivre E-Cu Forme 4b', en: 'Form 4b Solid Copper Busbar System' },
      { fr: 'Inverseur de Source Normal / Secours (ATS)', en: 'Automatic Transfer Switch (ATS Normal/Standby)' },
      { fr: 'Batterie de Condensateurs APFC avec Selfs 189 Hz', en: 'APFC Capacitor Bank with 189 Hz Reactors' }
    ],
    governingStandards: ['IEC 61439-1', 'IEC 61439-2', 'IEC 60947-2'],
    protectionApparatus: { fr: 'Déclencheurs Électroniques LSI / LSIG avec sélectivité logique ZSI', en: 'Electronic Trip Units (LSI/LSIG) with ZSI Zone Selectivity' },
    earthingContext: { fr: 'Barre de Terre PE cuivre 50x10 mm + Contrôleur Permanent d\'Isolement CPI (si IT)', en: 'Main PE Earth Bar + Insulation Monitoring Device (if IT)' },
    description: {
      fr: 'Névralgie électrique du bâtiment : distribue l\'énergie vers tous les tableaux divisionnaires, gère le secours groupe électrogène et compense l\'énergie réactive.',
      en: 'Electrical powerhouse of the facility: directs bulk power to sub-distribution boards, arbitrates emergency backup generator feeds, and manages power factor.'
    },
    icon: Box,
    color: 'border-amber-500/50 text-amber-400 bg-amber-950/30'
  },
  {
    id: 'SUB_DISTRIBUTION',
    stepNumber: 7,
    code: 'D06.3',
    name: { fr: '7. Tableaux Secondaires & Colonnes Montantes', en: '7. Sub-Distribution Boards & Rising Mains' },
    subtitle: { fr: 'Tableaux divisionnaires d\'étage, CVC, force motrice et sécurité', en: 'Floor Distribution Boards, HVAC Switchboards, Motor Control (MCC)' },
    voltageLevel: '400 V / 230 V',
    nominalCurrent: '100 A - 630 A',
    keyEquipment: [
      { fr: 'Disjoncteurs Boîtier Moulé MCCB (Compact NSX)', en: 'Molded Case Circuit Breakers MCCB' },
      { fr: 'Gaines Montantes Canalis d\'Étage 400 A', en: '400 A Rising Main Busways' },
      { fr: 'Centrale de Mesure Énergétique PM5000 Modbus', en: 'Modbus Energy Power Meters' }
    ],
    governingStandards: ['IEC 61439-2', 'IEC 60947-2', 'NF C 15-100'],
    protectionApparatus: { fr: 'Disjoncteurs MCCB magnéto-thermiques / électroniques + Blocs Vigi', en: 'Thermal-Magnetic & Electronic MCCB + Vigi Earth Leakage Modules' },
    earthingContext: { fr: 'Liaisons équipotentielles secondaires et conducteurs de protection PE', en: 'Secondary equipotential bonding and PE circuit conductors' },
    description: {
      fr: 'Répartit l\'énergie par zone fonctionnelle (Étage 1, Étage 2, Local Technique, Chaufferie, TGBT Secouru) pour assurer la continuité de service locale.',
      en: 'Partitions power by functional zoning (Floors, Mechanical Rooms, Data Hubs, Essential Emergency Bus) ensuring localized continuity of service.'
    },
    icon: Sliders,
    color: 'border-indigo-500/50 text-indigo-400 bg-indigo-950/30'
  },
  {
    id: 'MODULAR_PANEL',
    stepNumber: 8,
    code: 'D06.4',
    name: { fr: '8. Tableaux Modulaires Terminaux', en: '8. Modular DIN-Rail Distribution Panels' },
    subtitle: { fr: 'Coffrets 18 à 72 modules sur rail DIN (Disjoncteurs MCB, Différentiels)', en: '18 to 72-Module DIN-Rail Consumer Units (MCB, RCD, RCBO, SPD)' },
    voltageLevel: '230 V Monophasé / 400 V Triphasé',
    nominalCurrent: '10 A - 63 A',
    keyEquipment: [
      { fr: 'Disjoncteurs Modulaires MCB (Courbes B, C, D)', en: 'Miniature Circuit Breakers MCB (Curves B, C, D)' },
      { fr: 'Interrupteurs Différentiels RCD 30 mA (Types AC, A, F, B)', en: 'Residual Current Devices RCD 30 mA (Types AC, A, F, B)' },
      { fr: 'Disjoncteurs Différentiels RCBO Monobloc', en: 'Combined RCBO Breakers' },
      { fr: 'Parafoudre Modulaire Type 2 débrochable', en: 'Modular Pluggable Type 2 SPD' },
      { fr: 'Contacteurs Heures Creuses & Télérupteurs', en: 'Day/Night Tariff Contactors & Impulse Relays' }
    ],
    governingStandards: ['IEC 60898-1', 'IEC 61008-1', 'IEC 61009-1', 'IEC 61439-3'],
    protectionApparatus: { fr: 'Disjoncteurs magnéto-thermiques (surcharges/courts-circuits) + Différentiels 30 mA', en: 'Thermal-magnetic MCBs (Overload/Short-circuit) + 30 mA RCDs' },
    earthingContext: { fr: 'Bornier de terre PE cuivre avec raccordement individuel de chaque circuit', en: 'Copper PE earth terminal bar with dedicated lead per circuit' },
    description: {
      fr: 'Dernier niveau de commande et de protection modulaire accessible aux usagers et techniciens. Sécurise les personnes contre les chocs électriques (30 mA).',
      en: 'Final modular protection and switching hub accessible to operators. Guarantees human protection against electric shock via 30 mA RCD sensitivity.'
    },
    icon: Box,
    color: 'border-violet-500/50 text-violet-400 bg-violet-950/30'
  },
  {
    id: 'FINAL_CIRCUITS',
    stepNumber: 9,
    code: 'D06.5',
    name: { fr: '9. Circuits Terminaux & Canalisation', en: '9. Final Branch Circuits & Conduits' },
    subtitle: { fr: 'Câbles R2V / H07V-U sous gaine ICTA, chemins de câbles et goulottes', en: 'R2V / H07V-U Cables in Conduits, Cable Trays and Dado Trunking' },
    voltageLevel: '230 V Monophasé / 400 V Triphasé',
    nominalCurrent: '10 A, 16 A, 20 A, 32 A',
    keyEquipment: [
      { fr: 'Câble 3G1.5 mm² Cuivre (Éclairage max 10 A)', en: '3G1.5 mm² Copper Cable (Lighting max 10 A)' },
      { fr: 'Câble 3G2.5 mm² Cuivre (Prises max 20 A)', en: '3G2.5 mm² Copper Cable (Socket Outlets max 20 A)' },
      { fr: 'Câble 3G6 mm² Cuivre (Plaque cuisson / Borne VE 32 A)', en: '3G6 mm² Copper Cable (Cooker / 32 A EVSE)' },
      { fr: 'Chemin de Câbles Métallique Perforé & Goulotte PVC', en: 'Perforated Metal Cable Tray & PVC Trunking' }
    ],
    governingStandards: ['IEC 60364-5-52', 'NF C 15-100 Titre 5', 'IEC 60228'],
    protectionApparatus: { fr: 'Calibrage strict section/protection contre les échauffements (Ib ≤ In ≤ Iz)', en: 'Strict cable/breaker sizing against thermal damage (Ib ≤ In ≤ Iz)' },
    earthingContext: { fr: 'Conducteur Vert/Jaune (PE) continu accompagnant obligatoirement chaque phase', en: 'Continuous Green/Yellow protective earth (PE) running along every phase' },
    description: {
      fr: 'Réseau capillaire de distribution transportant le courant vers chaque prise, luminaire ou machine, dimensionné pour limiter la chute de tension (ΔU ≤ 3% ou 5%).',
      en: 'Capillary branch wiring conveying current to each socket, luminaire, or appliance, sized to guarantee voltage drop within limits (ΔU ≤ 3% or 5%).'
    },
    icon: Activity,
    color: 'border-fuchsia-500/50 text-fuchsia-400 bg-fuchsia-950/30'
  },
  {
    id: 'TERMINAL_LOADS',
    stepNumber: 10,
    code: 'D06.6',
    name: { fr: '10. Récepteurs & Appareils Terminaux', en: '10. Terminal Electrical Loads' },
    subtitle: { fr: 'Moteurs industriels, Luminaires LED, Pompes, Climatisation CVC, Racks IT', en: 'Induction Motors, LED Fixtures, HVAC Compressors, Server Racks, EVSE' },
    voltageLevel: '230 V / 400 V (50 Hz)',
    nominalCurrent: '0.1 A à 500 A selon charge',
    keyEquipment: [
      { fr: 'Moteurs Asynchrones Triphasés IE3 / IE4 (Pompes/Ventilateurs)', en: 'IE3 / IE4 Induction Motors (Pumps/Fans)' },
      { fr: 'Groupes de Froid CVC / Chiller à vitesse variable', en: 'HVAC Chillers & Variable-Speed Heat Pumps' },
      { fr: 'Baies Informatiques Serveurs IT (Ondulées UPS)', en: 'IT Server Racks (UPS conditioned)' },
      { fr: 'Bornes de Recharge Véhicule Électrique (IRVE 7.4-22 kW)', en: 'EV Charging Stations (EVSE 7.4-22 kW)' }
    ],
    governingStandards: ['IEC 60034-30-1', 'IEC 60598-1', 'IEC 61851-1'],
    protectionApparatus: { fr: 'Disjoncteur Moteur Magnétique 50 + Relais Thermique 49 ou Variateur VFD', en: 'Motor Protection Breaker 50 + Thermal Relay 49 or VFD Inverter' },
    earthingContext: { fr: 'Masses métalliques raccordées à la terre (Protection contre contacts indirects)', en: 'Exposed conductive frames grounded (Protection against indirect contact)' },
    description: {
      fr: 'Consommateurs finaux qui transforment l\'énergie électrique selon leur facteur de puissance (cos φ) et leur rendement énergétique (η).',
      en: 'Final energy consumers converting electrical power according to their specific power factor (cos φ) and operating efficiency (η).'
    },
    icon: Cpu,
    color: 'border-rose-500/50 text-rose-400 bg-rose-950/30'
  },
  {
    id: 'USEFUL_WORK',
    stepNumber: 11,
    code: 'D06.7',
    name: { fr: '11. Énergie Utile & Travail Final', en: '11. Useful Work & Converted Energy' },
    subtitle: { fr: 'Couples mécaniques, lumens d\'éclairage, frigories/calories, data processing', en: 'Mechanical Torque, Luminous Flux, Thermal Conditioning, Data Compute' },
    voltageLevel: 'Non-électrique (Forme convertie)',
    nominalCurrent: 'Mesure en Joules, kWh, Lumens, Watts mécaniques',
    keyEquipment: [
      { fr: 'Flux Lumineux (Lumens, Éclairement Lux per NF EN 12464-1)', en: 'Luminous Flux (Lumens, Lux illuminance per EN 12464-1)' },
      { fr: 'Puissance Mécanique sur Arbre (kW, N.m, tr/min)', en: 'Shaft Mechanical Power (kW, N.m torque, rpm)' },
      { fr: 'Énergie Thermique CVC (kW thermique, Frigories)', en: 'Thermal HVAC Energy (kW thermal, BTU/h)' },
      { fr: 'Puissance Informatique Calcul & Stockage (TFLOPS / IOPS)', en: 'Compute & Storage Processing Work (TFLOPS / IOPS)' }
    ],
    governingStandards: ['ISO 50001', 'NF EN 12464-1', 'ASHRAE 90.1'],
    protectionApparatus: { fr: 'Surveillance d\'efficacité énergétique et plan de comptage ISO 50001', en: 'Energy Efficiency Monitoring & ISO 50001 Metering Plan' },
    earthingContext: { fr: 'Continuité de service et sécurité des opérateurs industriels', en: 'Continuous operational safety for human operators' },
    description: {
      fr: 'Finalité suprême de toute l\'ingénierie électrique : transformer les électrons en travail mécanique, confort thermique, lumière ou traitement de données.',
      en: 'The ultimate purpose of all electrical power engineering: transforming raw electrons into useful torque, climate comfort, illumination, and data processing.'
    },
    icon: Flame,
    color: 'border-amber-400/60 text-amber-300 bg-amber-950/40'
  }
];

interface MasterInstallationChainExplorerProps {
  locale: 'fr' | 'en';
  onNavigateToStage?: (stageId: DeliveryStageId) => void;
  onNavigateDomain?: (domainCode: string) => void;
  onSelectEquipment?: (equipmentId: string) => void;
  selectedStageId?: DeliveryStageId;
  className?: string;
}

export const MasterInstallationChainExplorer: React.FC<MasterInstallationChainExplorerProps> = ({
  locale,
  onNavigateToStage,
  onNavigateDomain,
  onSelectEquipment,
  selectedStageId: propSelectedStageId,
  className = ''
}) => {
  const [activeStageId, setActiveStageId] = useState<DeliveryStageId>(propSelectedStageId || 'TGBT_SWITCHBOARD');

  const activeStage = DELIVERY_STAGES.find((s) => s.id === activeStageId) || DELIVERY_STAGES[5];

  const handleStageSelect = (stage: DeliveryStageInfo) => {
    soundEffects.playSwitchClick();
    setActiveStageId(stage.id);
    if (onNavigateToStage) onNavigateToStage(stage.id);
  };

  return (
    <div className={`rounded-2xl bg-[#080C14] border border-[#1E293B] p-4 sm:p-6 space-y-6 font-mono text-xs shadow-2xl ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px] tracking-wider mb-1">
            <Zap className="h-4 w-4" />
            <span>{locale === 'fr' ? 'ÉPINE DORSALE UNIFIÉE · CHAÎNE DE DISTRIBUTION ÉLECTRIQUE DU RÉSEAU À L\'USAGE' : 'UNIFIED ELECTRICAL DELIVERY SPINE · GRID TO FINAL USAGE CHAIN'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Parcours Continu en 11 Niveaux d\'Ingénierie' : 'Continuous 11-Stage Power Delivery Spine'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {locale === 'fr'
              ? 'Cliquez sur n\'importe quel palier pour explorer ses paramètres électrotechniques, appareillages, normes et modes de protection.'
              : 'Click on any stage to inspect electrical ratings, switchgear, governing standards, and protection architectures.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <EvidenceTrustBadge type="VERIFIED_STANDARD" locale={locale} size="sm" governingStandard="IEC 60364 / IEC 61439" />
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
            11/11 {locale === 'fr' ? 'Paliers Connectés' : 'Stages Linked'}
          </span>
        </div>
      </div>

      {/* Horizontal Interactive Flow Ribbon */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500/30">
        <div className="flex items-center gap-2 min-w-[1100px] p-1">
          {DELIVERY_STAGES.map((stg, idx) => {
            const IconComp = stg.icon;
            const isSelected = stg.id === activeStageId;
            return (
              <React.Fragment key={stg.id}>
                <button
                  type="button"
                  onClick={() => handleStageSelect(stg)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center min-w-[95px] max-w-[110px] group ${
                    isSelected
                      ? `${stg.color} ring-2 ring-amber-400/50 shadow-lg scale-105 z-10 font-bold`
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                  title={stg.subtitle[locale]}
                >
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    #{stg.stepNumber}
                  </span>
                  <IconComp className={`h-5 w-5 transition-transform group-hover:scale-110 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span className="text-[10px] leading-tight line-clamp-2 uppercase font-bold">
                    {stg.name[locale].replace(/^\d+\.\s*/, '')}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono font-normal truncate max-w-full">
                    {stg.voltageLevel.split(' ')[0]}
                  </span>
                </button>

                {idx < DELIVERY_STAGES.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Stage Deep Inspection Panel */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 sm:p-6 space-y-5">
        
        {/* Stage Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                PALIER #{activeStage.stepNumber}
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase">{activeStage.code}</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase font-mono">
              {activeStage.name[locale]}
            </h3>
            <p className="text-xs text-slate-300 font-sans max-w-2xl leading-relaxed">
              {activeStage.description[locale]}
            </p>
          </div>

          {/* Quick Electrical Specs Card */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-3 text-[11px] shrink-0 min-w-[240px]">
            <div>
              <span className="text-slate-500 block font-bold text-[10px]">{locale === 'fr' ? 'Niveau de Tension :' : 'Voltage Rating:'}</span>
              <span className="text-cyan-300 font-bold">{activeStage.voltageLevel}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold text-[10px]">{locale === 'fr' ? 'Courant Assigné :' : 'Rated Current:'}</span>
              <span className="text-amber-300 font-bold">{activeStage.nominalCurrent}</span>
            </div>
          </div>
        </div>

        {/* 3-Column Engineering Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Column 1: Key Equipment */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-sky-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <Box className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Appareillages Clés' : 'Key Apparatus'}</span>
            </div>
            <ul className="space-y-1.5 text-[11px]">
              {activeStage.keyEquipment.map((eq, i) => (
                <li key={i} className="flex items-start gap-1.5 text-slate-200">
                  <span className="text-sky-400 font-bold">•</span>
                  <span>{eq[locale]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Protection & Earthing */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-rose-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <Shield className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Protection & SLT / Terre' : 'Protection & Earthing'}</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Appareil de Protection :' : 'Protection System:'}</span>
                <span className="text-slate-200 font-medium">{activeStage.protectionApparatus[locale]}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{locale === 'fr' ? 'Régime de Neutre / SLT :' : 'Earthing / Grounding:'}</span>
                <span className="text-amber-300 font-medium">{activeStage.earthingContext[locale]}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Governing Standards */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Normes Applicables' : 'Governing Standards'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeStage.governingStandards.map((std, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  {std}
                </span>
              ))}
            </div>
            <div className="pt-2 text-[10px] text-slate-400">
              {locale === 'fr' ? 'Conception et calculs conformes aux directives CEI/IEEE/NF C.' : 'Designed per applicable IEC/IEEE/NF C normative clauses.'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
