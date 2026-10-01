// src/components/substations/MasterSubstationJourney.tsx
// EPEDE D04 - Master Substation Electrical Journey (8 Synchronized Stages with Physical, SLD & Functional Views)

import React, { useState } from 'react';
import {
  Zap,
  ShieldAlert,
  Sliders,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Activity,
  Cpu,
  Building2,
  Radio,
  Lock,
  RotateCcw,
  FolderTree,
  Eye,
  GitBranch,
  Network
} from 'lucide-react';
import type { SubstationRepresentationView, SubstationVoltageContext } from './SubstationCommandHeader';

interface MasterSubstationJourneyProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
  activeView?: SubstationRepresentationView;
  selectedVoltage?: SubstationVoltageContext;
}

interface JourneyStage {
  id: number;
  code: string;
  title_fr: string;
  title_en: string;
  subtitle_fr: string;
  subtitle_en: string;
  voltage_level: string;
  current_level: string;
  main_apparatus: string[];
  protection_focus_fr: string;
  protection_focus_en: string;
  interlocking_notice_fr: string;
  interlocking_notice_en: string;
  description_fr: string;
  description_en: string;
  physical_specs: {
    clearancePhaseToEarth: string;
    clearancePhaseToPhase: string;
    gantryHeight: string;
    busbarConductorType: string;
  };
  sld_symbols: {
    ansiCodes: string[];
    switchStatus: string;
    busTieActive: boolean;
  };
  functional_sas: {
    iedModel: string;
    protocol: string;
    bcuInterlockLogic: string;
    goosePublisher: string;
  };
  diagnostic_metrics: {
    label_fr: string;
    label_en: string;
    value: string;
    status: 'NORMAL' | 'WARNING' | 'ALERT';
  }[];
}

export const MasterSubstationJourney: React.FC<MasterSubstationJourneyProps> = ({
  locale,
  onSelectEquipment,
  activeView = 'PHYSICAL',
  selectedVoltage = '225kV'
}) => {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [energizationState, setEnergizationState] = useState<'ENERGIZED' | 'DE_ENERGIZED' | 'FAULT_SIMULATED'>('ENERGIZED');

  const journeyStages: JourneyStage[] = [
    {
      id: 1,
      code: 'STAGE_01_GANTRY',
      title_fr: 'Étape 1 : Amarrage Ligne & Portique Entrée',
      title_en: 'Stage 1: Line Incomer & Strain Gantry',
      subtitle_fr: 'Transition mécanique ligne aérienne vers charpente poste',
      subtitle_en: 'Mechanical strain transition from overhead line to substation steelwork',
      voltage_level: `${selectedVoltage} Nominale`,
      current_level: '1078 A (Transit 420 MW)',
      main_apparatus: ['Portique treillis d\'amarrage', 'Chaînes d\'isolateurs en verre cap-and-pin', 'Anneaux pare-effluves corona', 'Boîte d\'épissure OPGW'],
      protection_focus_fr: 'Point d\'arrivée de la protection différentielle de ligne 87L et distance 21.',
      protection_focus_en: 'Line terminal for optical differential 87L and distance 21 zone 1.',
      interlocking_notice_fr: 'Vérification de la continuité du câble de garde et de la mise à la terre du portique.',
      interlocking_notice_en: 'Verification of shield wire continuity and strain gantry grounding earthing bond.',
      description_fr: 'Le portique d\'amarrage en acier galvanisé reprend l\'effort de traction mécanique des trois faisceaux de conducteurs de la ligne haute tension (portée de 400 m, traction de plus de 4 tonnes par phase). Des chaînes d\'isolateurs en verre trempé assurent l\'isolation diélectrique vis-à-vis de la charpente métallique mise à la terre.',
      description_en: 'The galvanized steel strain gantry absorbs the mechanical tension forces exerted by incoming line phase bundles (400 m span, > 4 metric tons pull per phase). Toughened glass cap-and-pin insulator strings provide dielectric insulation against the earthed structural steelwork.',
      physical_specs: {
        clearancePhaseToEarth: selectedVoltage === '400kV' ? '3.40 m' : selectedVoltage === '225kV' ? '2.20 m' : '1.10 m',
        clearancePhaseToPhase: selectedVoltage === '400kV' ? '4.20 m' : selectedVoltage === '225kV' ? '2.80 m' : '1.50 m',
        gantryHeight: selectedVoltage === '400kV' ? '28 m' : '22 m',
        busbarConductorType: 'Faisceau double Almelec Aster 570 mm²'
      },
      sld_symbols: {
        ansiCodes: ['87L', '21/21N', '50/51'],
        switchStatus: 'Ligne en service permanent',
        busTieActive: false
      },
      functional_sas: {
        iedModel: 'Line Differential IED (SEL-411L / GE D60)',
        protocol: 'IEC 61850-8-1 (MMS / GOOSE) + C37.94 Optique',
        bcuInterlockLogic: 'Line Energization Status OK (V > 0.85 Un)',
        goosePublisher: 'Bay_L1_Prot_Trip_Pub'
      },
      diagnostic_metrics: [
        { label_fr: 'Tension Ligne Phase-Terre', label_en: 'Line Phase-to-Earth Voltage', value: `${(parseFloat(selectedVoltage) / Math.sqrt(3)).toFixed(1)} kV`, status: 'NORMAL' },
        { label_fr: 'Courant de Ligne', label_en: 'Line Current', value: '1078 A (64% nominal)', status: 'NORMAL' },
        { label_fr: 'Effort Mécanique Portique', label_en: 'Gantry Strain Tension', value: '42.5 kN / phase', status: 'NORMAL' }
      ]
    },
    {
      id: 2,
      code: 'STAGE_02_SURGE_ARRESTER',
      title_fr: 'Étape 2 : Protection Surtensions (Parafoudre ZnO)',
      title_en: 'Stage 2: Overvoltage Protection (ZnO Surge Arrester)',
      subtitle_fr: 'Écrêtage des ondes de foudre et des surtensions de manœuvre',
      subtitle_en: 'Clamping atmospheric lightning strokes and switching surges',
      voltage_level: `${selectedVoltage} Nominale`,
      current_level: 'Courant de fuite permanent : < 1 mA',
      main_apparatus: ['Parafoudre à oxyde de zinc (ZnO) sans éclateur', 'Compteur de décharges de foudre', 'Milliampermètre de courant de fuite total/résistif', 'Isolateur socle et raccordement MALT'],
      protection_focus_fr: 'Écrêtage d\'onde de choc : tension résiduelle < 560 kV pour 10 kA (onde 8/20 µs).',
      protection_focus_en: 'Surge clipping: residual voltage < 560 kV @ 10 kA impulse (8/20 µs wave).',
      interlocking_notice_fr: 'Liaison directe ultra-courte (< 1 m) vers la ceinture de terre enterrée du poste.',
      interlocking_notice_en: 'Direct ultra-short low-inductance connection (< 1 m) to the buried ground mesh.',
      description_fr: 'Positionné en tête de travée immédiatement après le portique, le parafoudre ZnO protège l\'ensemble des équipements du poste contre les ondes de surtension foudre se propageant depuis la ligne. Sa résistance non-linéaire passe d\'un état quasi-isolant à un état hautement conducteur en quelques nanosecondes dès que la tension dépasse son seuil.',
      description_en: 'Installed directly at the bay head immediately after the strain gantry, the gapless metal-oxide surge arrester shields all substation equipment from incoming surges. Its non-linear varistor discs transition from insulator to conductor in nanoseconds whenever threshold is crossed.',
      physical_specs: {
        clearancePhaseToEarth: selectedVoltage === '400kV' ? '3.40 m' : '2.20 m',
        clearancePhaseToPhase: selectedVoltage === '400kV' ? '4.20 m' : '2.80 m',
        gantryHeight: 'Hauteur parafoudre : 2.90 m sur massif béton',
        busbarConductorType: 'Câble cuivre nu 95 mm² direct au puits de terre'
      },
      sld_symbols: {
        ansiCodes: ['ANSI 01 (Arrester)'],
        switchStatus: 'En veille permanente sans coupure',
        busTieActive: false
      },
      functional_sas: {
        iedModel: 'Arrester Condition Monitor (ABB EXCOUNT-II)',
        protocol: 'Wireless RF 868 MHz to SCADA Gateway',
        bcuInterlockLogic: 'Leakage Current Alarm Threshold: 250 µA',
        goosePublisher: 'Arrester_Health_GOOSE'
      },
      diagnostic_metrics: [
        { label_fr: 'Courant de Fuite Résistif', label_en: 'Resistive Leakage Current', value: '42 µA (Excellent)', status: 'NORMAL' },
        { label_fr: 'Compteur de Chocs Enregistrés', label_en: 'Lightning Impulse Counter', value: '14 décharges cumulées', status: 'NORMAL' },
        { label_fr: 'Tension Résiduelle Parafoudre', label_en: 'Arrester Residual Level', value: '542 kV @ 10 kA', status: 'NORMAL' }
      ]
    },
    {
      id: 3,
      code: 'STAGE_03_INSTRUMENT_XFMRS',
      title_fr: 'Étape 3 : Mesure & Comptage (TC & TT/CVT)',
      title_en: 'Stage 3: Measurement & Metering (CT & VT/CVT)',
      subtitle_fr: 'Conversion précise des grandeurs HTB vers les circuits 110 V / 1 A',
      subtitle_en: 'Accurate reduction of HV signals for 110 V and 1 A protection & metering',
      voltage_level: `${selectedVoltage} primaire → 100/√3 V secondaire`,
      current_level: 'Primaire 1200 A → Secondaires 1 A et 5 A',
      main_apparatus: ['Transformateur de courant (TC) multi-enroulements 5P20 / 0.2S', 'Transformateur de tension capacitif (CVT) avec filtre CPL', 'Boîte de jonction d\'extrémité de travée'],
      protection_focus_fr: 'Noyaux de protection 5P20 (pas de saturation jusqu\'à 20 × In) et comptage classe 0.2S.',
      protection_focus_en: 'Protection cores 5P20 (no saturation up to 20 × In) and revenue billing class 0.2S.',
      interlocking_notice_fr: 'Interdiction absolue d\'ouvrir le circuit secondaire d\'un TC sous tension (danger de mort arc HT).',
      interlocking_notice_en: 'Strict prohibition of open-circuiting secondary of energized CT (lethal arc voltage).',
      description_fr: 'Les réducteurs de mesure transforment les kilovolts et kiloampères en signaux normalisés manipulables en toute sécurité par les relais numériques IED et les compteurs d\'énergie de facturation. Les TC comportent des noyaux séparés pour la protection (tenue aux surintensités sans saturer) et la mesure.',
      description_en: 'Instrument transformers step down dangerous grid kilovolts and kiloamperes to standardized low-voltage signals safe for numerical IED relays and tariff billing meters. CTs feature separate cores dedicated to protection (anti-saturation) and metering.',
      physical_specs: {
        clearancePhaseToEarth: selectedVoltage === '400kV' ? '3.40 m' : '2.20 m',
        clearancePhaseToPhase: selectedVoltage === '400kV' ? '4.20 m' : '2.80 m',
        gantryHeight: 'Colonnes isolantes polymère H = 3.60 m',
        busbarConductorType: 'Tube rigide aluminium AlMgSi 120/110 mm'
      },
      sld_symbols: {
        ansiCodes: ['ANSI 50/51', 'ANSI 27/59', 'ANSI 87L'],
        switchStatus: 'Acquisition continue analogique',
        busTieActive: false
      },
      functional_sas: {
        iedModel: 'Merging Unit IEC 61865-9-2 (Process Bus Sampled Values)',
        protocol: 'IEC 61850-9-2LE SV (4000 Hz / 80 samples/cycle)',
        bcuInterlockLogic: 'CT Supervision 60CT + VT Supervision 60VT',
        goosePublisher: 'MU_L1_SampledValues_Pub'
      },
      diagnostic_metrics: [
        { label_fr: 'Rapport TC Sélectionné', label_en: 'Selected CT Ratio', value: '1200 / 1 / 1 / 1 A', status: 'NORMAL' },
        { label_fr: 'Tension Secondaire CVT', label_en: 'Secondary Voltage', value: '57.7 V (100/√3 V)', status: 'NORMAL' },
        { label_fr: 'Précision Comptage Facturation', label_en: 'Revenue Metering Class', value: 'Classe 0.2S (Erreur < 0.12%)', status: 'NORMAL' }
      ]
    },
    {
      id: 4,
      code: 'STAGE_04_SWITCHGEAR',
      title_fr: 'Étape 4 : Coupure & Sectionnement (Disjoncteur Q0 & Q9)',
      title_en: 'Stage 4: Switching & Isolation (Circuit Breaker Q0 & Q9)',
      subtitle_fr: 'Coupure sous SF6 de 40 kA et coupure visible pour consignation',
      subtitle_en: 'SF6 40 kA breaking capability and visible isolation for maintenance',
      voltage_level: `${selectedVoltage} Nominale`,
      current_level: 'Courant de coupure assigné : 40 kA en 50 ms',
      main_apparatus: ['Disjoncteur SF6 tripolaire à autosoufflage (Q0)', 'Sectionneur d\'isolement de ligne (Q9) à deux colonnes', 'Sectionneur de mise à la terre rapide (Q8)', 'Armoire de commande à ressort moteur'],
      protection_focus_fr: 'Ordre de déclenchement prioritaire des protections différentielles et de distance en < 2 cycles.',
      protection_focus_en: 'Primary high-speed tripping from 87L and 21 protection IEDs cleared in < 2 cycles.',
      interlocking_notice_fr: 'Verrouillage électrique strict : Q9 ne peut manœuvrer que si Q0 est ouvert (I = 0 A).',
      interlocking_notice_en: 'Strict interlock: Q9 line disconnector cannot operate unless Q0 breaker is OPEN.',
      description_fr: 'Le disjoncteur est l\'organe suprême de coupure du poste : il est capable d\'interrompre les courants de court-circuit phénoménaux de 40 000 A en moins de 50 ms grâce au gaz hexafluorure de soufre (SF6). Le sectionneur Q9 assure l\'intervalle d\'isolement visible obligatoire pour la sécurité des monteurs.',
      description_en: 'The circuit breaker is the ultimate switching apparatus, engineered to extinguish colossal 40,000 A short-circuit arcs within 50 ms using SF6 gas puffer chambers. The disconnect switch Q9 provides visible air-gap isolation required by electrical safety regulations.',
      physical_specs: {
        clearancePhaseToEarth: selectedVoltage === '400kV' ? '3.40 m' : '2.20 m',
        clearancePhaseToPhase: selectedVoltage === '400kV' ? '4.20 m' : '2.80 m',
        gantryHeight: 'Châssis disjoncteur H = 4.10 m',
        busbarConductorType: 'Conducteur Almelec Aster 570 mm²'
      },
      sld_symbols: {
        ansiCodes: ['ANSI 52 (CB)', 'ANSI 89 (Disconnector)', 'ANSI 50BF (Breaker Failure)'],
        switchStatus: 'Q0 FERMÉ / Q9 FERMÉ / Q8 OUVERT',
        busTieActive: false
      },
      functional_sas: {
        iedModel: 'Bay Controller Unit (ABB REC670 / Siemens 6MD85)',
        protocol: 'IEC 61850-8-1 GOOSE (< 3 ms Trip command)',
        bcuInterlockLogic: 'Interlock: Q0 OPEN before Q9 operation allowed',
        goosePublisher: 'BCU_Q0_Status_Pub'
      },
      diagnostic_metrics: [
        { label_fr: 'Pression Gaz SF6 (Q0)', label_en: 'SF6 Gas Pressure (Q0)', value: '0.62 MPa (Seuil alarme 0.58 MPa)', status: 'NORMAL' },
        { label_fr: 'Temps d\'Ouverture Disjoncteur', label_en: 'Breaker Opening Time', value: '38 ms (< 50 ms requis)', status: 'NORMAL' },
        { label_fr: 'Armement Ressort Moteur', label_en: 'Spring Motor Status', value: 'Armé (Prêt cycle O-0.3s-CO)', status: 'NORMAL' }
      ]
    },
    {
      id: 5,
      code: 'STAGE_05_BUSBAR_SYSTEM',
      title_fr: 'Étape 5 : Aiguillage & Double Jeu de Barres (Barre 1 & 2)',
      title_en: 'Stage 5: Bus Routing & Double Busbar System (Bus 1 & 2)',
      subtitle_fr: 'Flexibilité d\'exploitation sans coupure et travée de couplage',
      subtitle_en: 'Seamless operational flexibility and bus tie coupler switching',
      voltage_level: `${selectedVoltage} Nominale`,
      current_level: 'Courant nominal des barres : 3150 A continu',
      main_apparatus: ['Sectionneurs sélecteurs de barres Q1 et Q2', 'Tubes aluminium rigides AL6063 jeux de barres 1 & 2', 'Travée de couplage avec disjoncteur Q0-CPL', 'Sectionneurs de mise à la terre des barres Q51/Q52'],
      protection_focus_fr: 'Protection différentielle de barres 87B à haute ou basse impédance avec sélectivité zonale.',
      protection_focus_en: 'Busbar differential protection 87B with zone selection and CT circuit supervision.',
      interlocking_notice_fr: 'Le transfert de barres sous tension exige la fermeture préalable de la travée de couplage.',
      interlocking_notice_en: 'Live bus transfer requires the bus coupler breaker to be closed first.',
      description_fr: 'Le schéma à double jeu de barres permet de répartir les lignes et transformateurs sur deux barres distinctes pour optimiser les transits ou consigner une barre complète pour maintenance sans couper aucun client. La travée de couplage permet de transférer les charges d\'une barre à l\'autre sans micro-coupure.',
      description_en: 'The double busbar scheme allows splitting lines and transformers between two independent buses to balance power flow or de-energize an entire busbar for maintenance with zero customer interruption. The bus coupler bay enables on-load busbar transfers.',
      physical_specs: {
        clearancePhaseToEarth: selectedVoltage === '400kV' ? '3.40 m' : '2.20 m',
        clearancePhaseToPhase: selectedVoltage === '400kV' ? '4.20 m' : '2.80 m',
        gantryHeight: 'Hauteur niveau barres : 8.50 m (Niveau 1) et 14 m (Niveau 2)',
        busbarConductorType: 'Tube rigide aluminium &Oslash; 160 mm / ép. 10 mm'
      },
      sld_symbols: {
        ansiCodes: ['ANSI 87B', 'ANSI 89 (Selectors)', 'ANSI 25 (Synchrocheck)'],
        switchStatus: 'Q1 FERMÉ (sur Barre 1) / Q2 OUVERT',
        busTieActive: true
      },
      functional_sas: {
        iedModel: 'Busbar Differential Central Unit (Siemens 7SS85)',
        protocol: 'IEC 61850-8-1 GOOSE Zone Discrimination',
        bcuInterlockLogic: 'Transfer Interlock: Bus Coupler Closed before Dual Selection',
        goosePublisher: 'Busbar_Zone1_Trip_Pub'
      },
      diagnostic_metrics: [
        { label_fr: 'Tension Barre 1 (Exploitation)', label_en: 'Busbar 1 Voltage', value: `${(parseFloat(selectedVoltage) * 1.01).toFixed(1)} kV (Nominale)`, status: 'NORMAL' },
        { label_fr: 'Tension Barre 2 (Secours)', label_en: 'Busbar 2 Voltage', value: `${(parseFloat(selectedVoltage) * 1.01).toFixed(1)} kV (Synchronisée)`, status: 'NORMAL' },
        { label_fr: 'Écart de Phase Couplage Δφ', label_en: 'Coupler Phase Angle Δφ', value: '0.4° (Synchrocheck conforme)', status: 'NORMAL' }
      ]
    },
    {
      id: 6,
      code: 'STAGE_06_TRANSFORMER',
      title_fr: 'Étape 6 : Transformation de Puissance (225/90 kV 100 MVA)',
      title_en: 'Stage 6: Power Transformation (225/90 kV 100 MVA)',
      subtitle_fr: 'Abaissement de tension et régulation en charge (OLTC)',
      subtitle_en: 'Voltage step-down and dynamic on-load tap changer regulation',
      voltage_level: `${selectedVoltage} → 90 kV (Tertiaire 15 kV)`,
      current_level: '100 MVA Nominal (Primaire 256 A / Secondaire 641 A)',
      main_apparatus: ['Transformateur triphasé immergé dans l\'huile YNyd11', 'Régleur en charge (OLTC) 17 plots', 'Conservateur d\'huile avec dessiccateur', 'Aéroréfrigérants ONAF (ventilateurs et pompes)'],
      protection_focus_fr: 'Protection différentielle 87T, terre restreinte 87N, relais Buchholz cuve/régleur, sonde OTI/WTI.',
      protection_focus_en: 'Biased differential 87T, restricted earth fault 87N, Buchholz relay, PRD, winding hot-spot WTI.',
      interlocking_notice_fr: 'Déclenchement simultané obligatoire des disjoncteurs primaire et secondaire.',
      interlocking_notice_en: 'Simultaneous cross-tripping of primary and secondary circuit breakers on 87T trip.',
      description_fr: 'Le transformateur de puissance 100 MVA effectue l\'adaptation d\'énergie entre le réseau de grand transport et le réseau de sous-répartition. Le régleur en charge (OLTC) compense en permanence les chutes de tension en ajustant le rapport de spires en quelques secondes sans couper l\'alimentation.',
      description_en: 'The 100 MVA power transformer converts energy between the national transmission grid and the regional sub-transmission network. The on-load tap changer (OLTC) maintains tight secondary voltage regulation under varying load profiles.',
      physical_specs: {
        clearancePhaseToEarth: 'Traversées HTB : 2.20 m d\'isolement dans l\'air',
        clearancePhaseToPhase: 'Écartement des traversées : 2.80 m',
        gantryHeight: 'Hauteur cuve transfo : 5.40 m (Poids 115 tonnes avec huile)',
        busbarConductorType: 'Cuve étanche avec 35 000 L d\'huile minérale'
      },
      sld_symbols: {
        ansiCodes: ['ANSI 87T', 'ANSI 87N', 'ANSI 49 (Thermal)', 'ANSI 63 (Buchholz)'],
        switchStatus: 'En charge nominale 68.5 MVA',
        busTieActive: false
      },
      functional_sas: {
        iedModel: 'Transformer Protection IED (GE Multilin T60 / SEL-487E)',
        protocol: 'IEC 61850-8-1 MMS & GOOSE (Cross-Trip)',
        bcuInterlockLogic: 'Buchholz Trip blocks auto-reclosing lockout (86)',
        goosePublisher: 'Trafo_Trip_86_Pub'
      },
      diagnostic_metrics: [
        { label_fr: 'Position Régleur OLTC', label_en: 'OLTC Tap Position', value: 'Plot +4 / 17 (+5.0%)', status: 'NORMAL' },
        { label_fr: 'T° Point Chaud Enroulement', label_en: 'Winding Hot-Spot (WTI)', value: '68.4 °C (Max 98 °C)', status: 'NORMAL' },
        { label_fr: 'Tension Claquage Huile', label_en: 'Oil Dielectric Breakdown', value: '72 kV / 2.5 mm', status: 'NORMAL' }
      ]
    },
    {
      id: 7,
      code: 'STAGE_07_SECONDARY_BUS',
      title_fr: 'Étape 7 : Jeu de Barres Secondaire 90 kV',
      title_en: 'Stage 7: Secondary 90 kV Busbar',
      subtitle_fr: 'Collecte et répartition vers les départs régionaux',
      subtitle_en: 'Collection and dispatching toward regional sub-transmission radial lines',
      voltage_level: '90 kV Nominale (91.4 kV Réelle)',
      current_level: 'Courant total débité : 635 A',
      main_apparatus: ['Disjoncteur secondaire transformateur 90 kV', 'Jeu de barres 90 kV aluminium', 'Sectionneur de mise au neutre avec résistance RMN', 'Transformateurs de mesure 90 kV'],
      protection_focus_fr: 'Protection de barres 90 kV, protection homopolaire 51N, découplage de réseau.',
      protection_focus_en: '90 kV bus differential, directional earth fault 67N, islanding decoupling.',
      interlocking_notice_fr: 'La résistance de neutre (NGR) limite les courants de court-circuit monophasés à 600 A.',
      interlocking_notice_en: 'Neutral Grounding Resistor (NGR) restricts single-phase ground fault currents to 600 A.',
      description_fr: 'Le secondaire du transformateur alimente le jeu de barres 90 kV. Le neutre raccordé à la terre via une résistance limite la sévérité des défauts à la terre et évite les surtensions transitoires sur les phases saines.',
      description_en: 'The transformer secondary feeds the 90 kV sub-transmission busbars. The neutral grounded through an NGR limits fault current magnitudes, protecting transformer windings and cables.',
      physical_specs: {
        clearancePhaseToEarth: '1.10 m (Règle CEI 61936-1 pour 90 kV)',
        clearancePhaseToPhase: '1.50 m',
        gantryHeight: 'Charpente 90 kV H = 12.0 m',
        busbarConductorType: 'Tube aluminium &Oslash; 100/90 mm'
      },
      sld_symbols: {
        ansiCodes: ['ANSI 87B', 'ANSI 51N', 'ANSI 27/59'],
        switchStatus: 'Barres 90 kV sous tension nominale',
        busTieActive: false
      },
      functional_sas: {
        iedModel: 'Secondary Busbar Protection IED',
        protocol: 'IEC 61850-8-1 GOOSE Fast Bus Trip',
        bcuInterlockLogic: 'Underfrequency Load Shedding Stage 1: 49.0 Hz',
        goosePublisher: 'UFLS_Trip_Stage1_Pub'
      },
      diagnostic_metrics: [
        { label_fr: 'Tension Jeu de Barres 90 kV', label_en: '90 kV Busbar Voltage', value: '91.4 kV (1.015 pu)', status: 'NORMAL' },
        { label_fr: 'Déséquilibre Homopolaire V0', label_en: 'Zero-Sequence Voltage V0', value: '0.4% (Très faible)', status: 'NORMAL' },
        { label_fr: 'Courant Neutre Résiduel', label_en: 'Neutral Residual Current', value: '1.2 A', status: 'NORMAL' }
      ]
    },
    {
      id: 8,
      code: 'STAGE_08_OUTGOING',
      title_fr: 'Étape 8 : Travées Départs Sortants',
      title_en: 'Stage 8: Outgoing Feeders to Distribution',
      subtitle_fr: 'Alimentation des villes régionales et postes sources urbains',
      subtitle_en: 'Supplying regional city centers and primary distribution substations',
      voltage_level: '90 kV (ou 15/30 kV après abaissement final)',
      current_level: 'Départs radiaux : 150 à 400 A chacun',
      main_apparatus: ['Départs lignes 90 kV vers villes secondaires', 'Câbles souterrains XLPE 90 kV', 'Départs cellules MT 15 kV urbaines', 'Disjoncteurs départs avec réenclenchement rapide'],
      protection_focus_fr: 'Protection de surintensité directionnelle 67/67N, réenclencheur 79, délestage U/f 81U.',
      protection_focus_en: 'Directional overcurrent 67/67N, auto-recloser 79, underfrequency load shedding 81U.',
      interlocking_notice_fr: 'En cas de défaut sur un départ, seul le disjoncteur du départ déclenche (sélectivité ampèremétrique et chronométrique).',
      interlocking_notice_en: 'Fault on outgoing line trips only the designated feeder breaker (time-current selectivity).',
      description_fr: 'Depuis les travées de départ, l\'énergie quitte le poste de transport pour irriguer les villes et les zones industrielles. Les disjoncteurs équipés d\'automates de réenclenchement éliminent automatiquement 85% des défauts fugitifs sans intervention humaine.',
      description_en: 'From the outgoing feeder bays, electricity leaves the transmission node to supply municipal and industrial customers. Automatic reclosing relays clear over 85% of transient lightning faults without operator intervention.',
      physical_specs: {
        clearancePhaseToEarth: '1.10 m (Aérien) / Gaines béton étanches (Câbles)',
        clearancePhaseToPhase: '1.50 m',
        gantryHeight: 'Portique de départ 90 kV H = 14 m',
        busbarConductorType: 'Câbles isolés XLPE 630 mm² aluminium enterrés'
      },
      sld_symbols: {
        ansiCodes: ['ANSI 67/67N', 'ANSI 79 (Recloser)', 'ANSI 81U (Load Shedding)'],
        switchStatus: 'Départs 1 & 2 en service permanent',
        busTieActive: false
      },
      functional_sas: {
        iedModel: 'Feeder Protection & Recloser IED (Siemens 7SJ82)',
        protocol: 'IEC 61850-8-1 & DNP3 over TCP/IP to Dispatching',
        bcuInterlockLogic: 'Auto-Reclose Sequence: 0.3s dead time -> Close -> 15s reclaim',
        goosePublisher: 'Feeder_Trip_AutoReclose_Pub'
      },
      diagnostic_metrics: [
        { label_fr: 'Puissance Active Évacuée', label_en: 'Active Dispatched Power', value: '98.5 MW', status: 'NORMAL' },
        { label_fr: 'Facteur de Puissance cos φ', label_en: 'Power Factor cos φ', value: '0.94 inductif', status: 'NORMAL' },
        { label_fr: 'Taux Réenclenchement Réussi', label_en: 'Reclosing Success Rate', value: '92.4%', status: 'NORMAL' }
      ]
    }
  ];

  const currentStage = journeyStages.find((s) => s.id === activeStageId) || journeyStages[0];

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Header & View Context Indicator */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {locale === 'fr' ? 'Parcours Maître du Courant dans le Poste' : 'Master Electrical Substation Power Flow'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 text-[10px] font-bold border border-amber-700/50">
                  {activeView === 'PHYSICAL'
                    ? '1. VUE GÉOMÉTRIQUE & ENCOMBREMENT'
                    : activeView === 'ELECTRICAL_SLD'
                    ? '2. SCHÉMA UNIFILAIRE ÉLECTRIQUE'
                    : '3. VUE FONCTIONNELLE & AUTOMATES SAS'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Cheminement de l\'énergie en 8 étapes synchronisées : de l\'arrivée ligne 225 kV jusqu\'aux départs de distribution.'
                  : '8 synchronized stages of electrical power flow: from incoming 225 kV line to distribution feeders.'}
              </p>
            </div>
          </div>

          {/* Quick Simulation State Toggle */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 text-[10px] hidden sm:inline mr-1">Régime Réseau :</span>
            <button
              type="button"
              onClick={() => setEnergizationState('ENERGIZED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                energizationState === 'ENERGIZED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-[#070A10] text-slate-400 border-slate-800'
              }`}
            >
              Sous Tension (Nominal)
            </button>
            <button
              type="button"
              onClick={() => setEnergizationState('FAULT_SIMULATED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                energizationState === 'FAULT_SIMULATED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-[#070A10] text-slate-400 border-slate-800'
              }`}
            >
              Simulation Court-Circuit
            </button>
          </div>
        </div>

        {/* 8-Stage Interactive Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {journeyStages.map((stage) => {
            const isCurrent = stage.id === activeStageId;
            const isPassed = stage.id < activeStageId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between group ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-300'
                    : isPassed
                    ? 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/40'
                    : 'bg-[#070A10] text-slate-400 border-[#1B2330] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isCurrent ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    #{stage.id}
                  </span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />}
                </div>
                <div className={`text-[11px] font-bold leading-tight truncate ${
                  isCurrent ? 'text-slate-950' : 'text-white group-hover:text-amber-300'
                }`}>
                  {stage.title_fr.split(':')[1]?.trim() || stage.title_fr}
                </div>
                <div className={`text-[9px] mt-1 font-sans truncate ${
                  isCurrent ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {stage.voltage_level.split('(')[0]?.trim()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Stage Detail Inspector & Diagrammatic Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Comprehensive Technical Breakdown Adapted to Active View */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
          
          {/* Header of Active Stage */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222B38] pb-3">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-amber-400 font-bold">
                <span>{currentStage.code}</span>
                <span>•</span>
                <span>{currentStage.voltage_level}</span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{locale === 'fr' ? currentStage.title_fr : currentStage.title_en}</span>
              </h3>
              <p className="text-xs text-slate-300 font-sans font-normal mt-0.5">
                {locale === 'fr' ? currentStage.subtitle_fr : currentStage.subtitle_en}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Régime Électrique :</span>
              <span className="text-xs text-emerald-400 font-bold">{currentStage.current_level}</span>
            </div>
          </div>

          {/* DYNAMIC VIEW-SPECIFIC PANEL (Physical vs SLD vs Functional) */}
          {activeView === 'PHYSICAL' && (
            <div className="p-3.5 rounded-xl bg-[#070A10] border border-sky-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between text-sky-400 font-bold text-[11px] border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  VUE PHYSIQUE & DISTANCES D'ISOLEMENT DANS L'AIR (CEI 61936-1)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Palier : {selectedVoltage}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Phase-Terre :</span>
                  <span className="text-emerald-400 font-bold">{currentStage.physical_specs.clearancePhaseToEarth}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Phase-Phase :</span>
                  <span className="text-sky-400 font-bold">{currentStage.physical_specs.clearancePhaseToPhase}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Charpente :</span>
                  <span className="text-amber-400 font-bold">{currentStage.physical_specs.gantryHeight}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Conducteur :</span>
                  <span className="text-white font-bold truncate block">{currentStage.physical_specs.busbarConductorType.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          )}

          {activeView === 'ELECTRICAL_SLD' && (
            <div className="p-3.5 rounded-xl bg-[#070A10] border border-amber-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between text-amber-400 font-bold text-[11px] border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <GitBranch className="h-3.5 w-3.5" />
                  REPRÉSENTATION UNIFILAIRE & CODES ANSI ASSOCIÉS
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  État : {currentStage.sld_symbols.switchStatus}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] text-slate-400">Fonctions ANSI Actives :</span>
                {currentStage.sld_symbols.ansiCodes.map((ansi, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20 text-[10px]">
                    {ansi}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeView === 'FUNCTIONAL' && (
            <div className="p-3.5 rounded-xl bg-[#070A10] border border-emerald-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px] border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Network className="h-3.5 w-3.5" />
                  ARCHITECTURE AUTOMATES SAS & BUS DE PROCESS IEC 61850
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentStage.functional_sas.protocol}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Calculateur / Relais IED :</span>
                  <span className="text-white font-bold">{currentStage.functional_sas.iedModel}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Logique Automate BCU :</span>
                  <span className="text-emerald-400 font-bold truncate block">{currentStage.functional_sas.bcuInterlockLogic}</span>
                </div>
              </div>
            </div>
          )}

          {/* Narrative Technical Description */}
          <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1E2634] text-xs leading-relaxed text-slate-300 font-sans font-normal">
            {locale === 'fr' ? currentStage.description_fr : currentStage.description_en}
          </div>

          {/* Connected Primary Equipment in this Stage */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FolderTree className="h-3.5 w-3.5 text-sky-400" />
              <span>{locale === 'fr' ? 'Appareillages Primaires Associés :' : 'Associated Primary Apparatus:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentStage.main_apparatus.map((app, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#0E141F] border border-[#222B38] flex items-center justify-between text-xs text-slate-200"
                >
                  <span className="font-semibold">{app}</span>
                  <button
                    type="button"
                    onClick={() => onSelectEquipment && onSelectEquipment(app)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                    title={locale === 'fr' ? 'Voir fiche d\'objet 30 sections' : 'View 30-section object schema'}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Protection & Interlocking Critical Warnings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Couverture Protection :' : 'Protection Coverage:'}</span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans font-normal">
                {locale === 'fr' ? currentStage.protection_focus_fr : currentStage.protection_focus_en}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <Lock className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Consigne de Sécurité & Verrouillage :' : 'Interlocking & Safety Rule:'}</span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans font-normal">
                {locale === 'fr' ? currentStage.interlocking_notice_fr : currentStage.interlocking_notice_en}
              </p>
            </div>
          </div>

          {/* Navigation Controls Between Stages */}
          <div className="pt-2 flex items-center justify-between border-t border-[#222B38]">
            <button
              type="button"
              disabled={activeStageId === 1}
              onClick={() => setActiveStageId((prev) => Math.max(1, prev - 1))}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                activeStageId === 1
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                  : 'bg-[#070A10] text-slate-300 border-[#222B38] hover:text-white'
              }`}
            >
              ← {locale === 'fr' ? 'Étape Précédente' : 'Previous Stage'}
            </button>

            <span className="text-xs text-slate-500">
              {activeStageId} / {journeyStages.length}
            </span>

            <button
              type="button"
              disabled={activeStageId === journeyStages.length}
              onClick={() => setActiveStageId((prev) => Math.min(journeyStages.length, prev + 1))}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                activeStageId === journeyStages.length
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                  : 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
              }`}
            >
              {locale === 'fr' ? 'Étape Suivante' : 'Next Stage'} →
            </button>
          </div>

        </div>

        {/* Right 1 Col: Live Diagnostics & Synoptic Path */}
        <div className="space-y-3">
          
          {/* Diagnostic Vector Gauge Box */}
          <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>{locale === 'fr' ? 'Télémétrie de l\'Étape' : 'Stage Telemetry'}</span>
              <Activity className="h-3.5 w-3.5 text-amber-400" />
            </h4>

            <div className="space-y-2">
              {currentStage.diagnostic_metrics.map((metric, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#070A10] border border-[#1E2634]">
                  <span className="text-[10px] text-slate-500 block">
                    {locale === 'fr' ? metric.label_fr : metric.label_en}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">{metric.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Synoptic Micro Diagram */}
            <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] text-[11px] text-slate-400 space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Topologie de Transition :</span>
              <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-amber-300 border border-slate-800">
                {activeStageId === 1 && `[Ligne ${selectedVoltage}] ──► [Portique Amarrage] ──► [Conducteurs Aster]`}
                {activeStageId === 2 && `[Conducteurs] ──► [Parafoudre ZnO] ──► [Terre IEEE 80]`}
                {activeStageId === 3 && `[Ligne] ──► [CVT (100V)] + [TC Multi-enroulements (1A)]`}
                {activeStageId === 4 && `[Sectionneur Q9] ──► [Disjoncteur SF6 Q0] ──► [Sectionneur Q8 Terre]`}
                {activeStageId === 5 && `[Q1] ──► [Jeu de Barres 1] ═══ [Couplage Q0] ═══ [Barre 2] ◄── [Q2]`}
                {activeStageId === 6 && `[Barres ${selectedVoltage}] ──► [Transfo 100MVA YNyd11] ──► [Secondaire 90kV]`}
                {activeStageId === 7 && `[Secondaire 90kV] ──► [Barres 90kV] + [Résistance Neutre RMN]`}
                {activeStageId === 8 && `[Barres 90kV] ──► [Départ 1] / [Départ 2] ──► [Villes & Consommateurs]`}
              </div>
            </div>
          </div>

          {/* Quick Concept Explainer */}
          <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-sky-400 font-bold">
              <Info className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Concept Clé du Poste' : 'Key Substation Rule'}</span>
            </div>
            <p className="text-[11px] leading-relaxed font-sans font-normal text-slate-300">
              {locale === 'fr'
                ? 'Un poste électrique est un nœud de commutation et d\'équipotentialité. Chaque watt qui y entre doit en sortir instantanément (Kirchhoff ∑I = 0). Toute différence détectée entre courants entrants et sortants est interprétée comme un court-circuit interne par la protection différentielle 87.'
                : 'An electrical substation is an equipotential switching node. Power entering must instantly exit without accumulation (Kirchhoff current law ∑I = 0). Any current deviation between entry and exit points is instantly flagged as an internal fault by differential protection 87.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
