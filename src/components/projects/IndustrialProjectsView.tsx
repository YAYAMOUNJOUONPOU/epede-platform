// src/components/projects/IndustrialProjectsView.tsx
import React, { useState, useId } from 'react';
import {
  Factory,
  Zap,
  Cpu,
  ShieldCheck,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  ChevronRight,
  TrendingUp,
  Flame,
  Award,
  BookOpen,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Clock,
  Settings,
  HelpCircle
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
  onBackToHome?: () => void;
  onNavigateCalculator?: (tab?: any) => void;
  onNavigateSimulation?: (tab?: any) => void;
  onNavigateDiagram?: () => void;
}

export const IndustrialProjectsView: React.FC<Props> = ({
  locale,
  onBackToHome,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateDiagram,
}) => {
  const isFr = locale === 'fr';

  // Navigation tab inside the page
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'POWER_FLOW' | 'LIFECYCLE' | 'STANDARDS' | 'ADVISOR'>('PROJECTS');

  // Selected project in case studies
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PROJ-GEN-DOUALA');

  // Interactive Voltage Flow Simulator State
  const [flowPowerMW, setFlowPowerMW] = useState<number>(20);
  const [flowLineDistanceKm, setFlowLineDistanceKm] = useState<number>(85);
  const [activeFlowStage, setActiveFlowStage] = useState<number>(2); // 0=Gen, 1=StepUp, 2=HV Line, 3=StepDown, 4=Distribution, 5=Facility

  // Interactive Scope Advisor State
  const [advisorIndustry, setAdvisorIndustry] = useState<'factory' | 'mine' | 'hospital' | 'water'>('factory');
  const [advisorPowerKVA, setAdvisorPowerKVA] = useState<number>(2000);
  const [advisorGridVoltageKV, setAdvisorGridVoltageKV] = useState<number>(33);

  // Math for Power Flow physics
  // P = sqrt(3) * U * I * cos(phi) => I = P / (sqrt(3) * U * cos(phi)) with cos(phi) = 0.85
  const cosPhi = 0.88;
  const currentAt11kV = (flowPowerMW * 1e6) / (Math.sqrt(3) * 11000 * cosPhi);
  const currentAt132kV = (flowPowerMW * 1e6) / (Math.sqrt(3) * 132000 * cosPhi);
  const currentAt225kV = (flowPowerMW * 1e6) / (Math.sqrt(3) * 225000 * cosPhi);

  // Line resistance: assume ACSR 240 mm² ~ 0.12 ohm/km
  const lineResistance = 0.12 * flowLineDistanceKm;
  const losses11kVMW = (3 * lineResistance * Math.pow(currentAt11kV, 2)) / 1e6;
  const losses132kVMW = (3 * lineResistance * Math.pow(currentAt132kV, 2)) / 1e6;
  const lossesReductionPercent = (((losses11kVMW - losses132kVMW) / losses11kVMW) * 100).toFixed(1);

  // Project Archetypes Data
  const projects = [
    {
      id: 'PROJ-GEN-DOUALA',
      tag: isFr ? 'Production Autonome · 2024' : 'Independent Generation · 2024',
      badge: '2.0 MW / 2.5 MVA',
      title_fr: 'Centrale Autonome 4×500 kVA Synchronisée — Zone Industrielle Douala Bassa',
      title_en: '4×500kVA Synchronised Generator Power Plant — Douala Industrial Zone',
      category_fr: 'Usine Cimentière & Matériaux de Construction',
      category_en: 'Cement & Building Materials Manufacturing',
      summary_fr: 'Centrale électrique de secours et écrêtage de pointe pour un complexe industriel continu. 4 groupes électrogènes diesel 500 kVA couplés en parallèle avec partage de charge isochrone, automatisme inverseur de source (ATS) motorisé et supervision SCADA.',
      summary_en: 'Critical backup and peak-lopping powerhouse for a continuous manufacturing facility. 4×500kVA diesel gen-sets paralleled with isochronous load sharing, motorized ATS, and remote SCADA telemetry.',
      kpis: [
        { label_fr: 'Puissance Installée', label_en: 'Installed Capacity', val: '2.0 MW (2500 kVA)' },
        { label_fr: 'Disponibilité Réalisée', label_en: 'System Uptime', val: '99.8%' },
        { label_fr: 'Temps de Prise de Charge', label_en: 'Load Takeover', val: '< 15 s' },
        { label_fr: 'Autonomie Carburant', label_en: 'Fuel Autonomy', val: '72 h continu (40 m³)' }
      ],
      techSpecs: [
        { key_fr: 'Groupes Électrogènes', key_en: 'Gen-Sets', val: '4 × Cummins / Stamford 500 kVA, 400 V / 50 Hz, cos φ 0.8' },
        { key_fr: 'Synchronisation & Couplage', key_en: 'Paralleling & Sync', val: 'Contrôleurs Deif AGC-4 avec régulation automatique de tension (AVR) & fréquence' },
        { key_fr: 'Tableau Basse Tension TGBT', key_en: 'Main LV Switchboard', val: 'Forme 4b cloisonnée, disjoncteurs ouverts débrochables 4000 A Icu = 85 kA' },
        { key_fr: 'Inverseur de Source (ATS)', key_en: 'Transfer Switching (ATS)', val: 'Automate Schneider avec verrouillage mécanique et électrique triple' },
        { key_fr: 'Émission Sonore', key_en: 'Acoustic Attenuation', val: 'Capot insonorisé 75 dBA @ 1 m avec silencieux d\'échappement résidentiel' }
      ],
      diagramHighlight: isFr 
        ? 'Architecture en boucle avec bus de synchronisation 400 V et gradateurs de délestage pour éviter le calage des moteurs au démarrage des broyeurs.' 
        : 'Paralleling ring architecture with load-shedding priority steps preventing engine stall on raw-mill direct-on-line start.',
      standardsApplied: ['IEC 60947-6-1 (ATS)', 'ISO 8528 (Gen-sets)', 'NF C 15-100 §551']
    },
    {
      id: 'PROJ-SUB-NORTH',
      tag: isFr ? 'Poste HTB/HTA · 2023' : 'HV/MV Substation · 2023',
      badge: '33 kV / 11 kV — 5 MVA',
      title_fr: 'Poste Source Minier HTA/HTB 33/11 kV — Région Nord (Extraction & Concassage)',
      title_en: '33kV/11kV Primary Industrial Substation — Northern Mining Operations',
      category_fr: 'Exploitation Minière & Carrière',
      category_en: 'Heavy Mining & Mineral Processing',
      summary_fr: 'Conception clés en main d\'un poste d\'évacuation et de distribution moyenne tension en plein air (AIS). Transformateur 5 MVA ONAN immergé dans l\'huile, disjoncteurs SF6 33 kV, batterie de condensateurs HTA et protection différentielle numérique.',
      summary_en: 'Turnkey delivery of a primary outdoor air-insulated substation (AIS). 5 MVA ONAN oil-immersed power transformer, 33kV SF6 circuit breakers, MV capacitor bank, and digital differential protection.',
      kpis: [
        { label_fr: 'Puissance Transformateur', label_en: 'Transformer Rating', val: '5.0 MVA ONAN' },
        { label_fr: 'Tension Primaire / Secondaire', label_en: 'Voltage Ratio', val: '33 000 V / 11 000 V' },
        { label_fr: 'Courant de Court-Circuit Icc', label_en: 'Rated Short-Circuit', val: '25 kA / 1 s (33 kV)' },
        { label_fr: 'Facteur de Puissance cos φ', label_en: 'Compensated Power Factor', val: '0.96 (batterie 1.2 Mvar)' }
      ],
      techSpecs: [
        { key_fr: 'Transformateur de Puissance', key_en: 'Power Transformer', val: 'IEC 60076, Dyn11, régleur en charge (OLTC) ±9 × 1.25%, bac de rétention avec extincteur naturel' },
        { key_fr: 'Disjoncteurs 33 kV', key_en: '33kV Switchgear', val: 'Appareillage extérieur AIS à coupure dans le gaz SF6, réenclencheur automatique' },
        { key_fr: 'Relais de Protection Numérique', key_en: 'Protection Relays', val: 'SEL-787 (87T Différentielle transfo), SEL-751 (50/51 surintensité max de courant et terre)' },
        { key_fr: 'Protection Contre la Foudre', key_en: 'Surge Protection', val: 'Parafoudres à oxyde de zinc (ZnO) Classe 1 selon IEC 60099-4' },
        { key_fr: 'Réseau de Terre', key_en: 'Earthing Grid', val: 'Ceinture équipotentielle cuivre nu 95 mm² maillée, résistance globale < 1.0 Ω' }
      ],
      diagramHighlight: isFr 
        ? 'Relais Buchholz et soupape de surpression asservis au déclenchement instantané du disjoncteur 33 kV amont en moins de 45 ms.' 
        : 'Buchholz relay and pressure relief valve hardwired to instant trip 33kV upstream vacuum breaker in under 45 ms.',
      standardsApplied: ['IEC 60076 (Transfos)', 'IEC 60255 (Protections)', 'IEEE 80 (Terre de poste)']
    },
    {
      id: 'PROJ-SCADA-YAOUNDE',
      tag: isFr ? 'Automatisme & SCADA · 2024' : 'Automation & SCADA · 2024',
      badge: '48 E/S TOR & Analogiques',
      title_fr: 'Téléconduite & SCADA de la Station de Traitement d\'Eau — Agglomération Yaoundé',
      title_en: 'SCADA Integration & Telecontrol — Yaoundé Water Pumping Station',
      category_fr: 'Services Publics & Traitement des Eaux',
      category_en: 'Municipal Water Utilities & Pumping',
      summary_fr: 'Automatisation complète de la station de pompage d\'eau brute et des filtres de clarification. Automates redondants en réseau fibre optique, télémesures de débit et pression, et historisation sécurisée des grandeurs électriques et de consommation.',
      summary_en: 'Complete automation of raw water pumping station and clarification filters. Redundant PLCs on optical fiber ring, flow/pressure telemetry, and secured historical trending of electrical consumption.',
      kpis: [
        { label_fr: 'Points de Contrôle E/S', label_en: 'I/O Control Points', val: '48 TOR & 24 Analogiques' },
        { label_fr: 'Temps de Réponse IHM', label_en: 'HMI Refresh Latency', val: '< 250 ms' },
        { label_fr: 'Économie Énergie Réalisée', label_en: 'Energy Savings', val: '-18.5% (variateurs VFD)' },
        { label_fr: 'Redondance Réseau', label_en: 'Network Topology', val: 'Anneau optique MRP ring' }
      ],
      techSpecs: [
        { key_fr: 'Automates Programmables (PLC)', key_en: 'Programmable Controllers', val: 'Siemens S7-1500R redondants avec basculement sans à-coup (bump-less)' },
        { key_fr: 'Supervision (SCADA)', key_en: 'SCADA Software', val: 'Plateforme client-serveur WinCC / Wonderware avec télésurveillance web sécurisée' },
        { key_fr: 'Protocoles Industriels', key_en: 'Industrial Protocols', val: 'Modbus TCP, IEC 60870-5-104 pour téléconduite centrale, Profinet I/O' },
        { key_fr: 'Variateurs de Vitesse (VFD)', key_en: 'Variable Speed Drives', val: 'Schneider ATV630 faible niveau d\'harmoniques (THD-I < 5%)' },
        { key_fr: 'Alimentation de Contrôle', key_en: 'Control Auxiliary Power', val: 'Onduleur 24 Vdc redondant avec batteries étanches AGM 48 V' }
      ],
      diagramHighlight: isFr 
        ? 'Asservissement automatique de la vitesse des pompes à la pression aval pour éliminer les coups de bélier et lisser les appels de courant au démarrage.' 
        : 'Closed-loop pump speed regulation against discharge pressure eliminates water hammer and suppresses starting inrush peaks.',
      standardsApplied: ['IEC 61131-3 (Automates)', 'IEC 62443 (Cybersécurité industrielle)', 'IEC 61850 / 60870-5']
    },
    {
      id: 'PROJ-UPS-HOSPITAL',
      tag: isFr ? 'Énergie Critique · 2023' : 'Critical Power · 2023',
      badge: '800 kVA N+1 / 4h Autonomie',
      title_fr: 'Alimentation Secourue Sans Interruption Hôpital Régional (Blocs & Réanimation)',
      title_en: '800kVA Modular UPS Critical Power System — Regional Hospital Complex',
      category_fr: 'Infrastructures Hospitalières & Santé',
      category_en: 'Healthcare & Life-Safety Facilities',
      summary_fr: 'Architecture de sécurité électrique maximale pour blocs opératoires, réanimation, imagerie médicale (IRM) et respirateurs artificiels. Onduleurs modulaires à commutation sans coupure (temps de transfert 0 ms), régime IT médicalisé et redondance N+1.',
      summary_en: 'Zero-downtime mission-critical power architecture for surgical theatres, intensive care, MRI imaging, and life support. Modular hot-swappable UPS with 0ms transfer time, medical isolated power (IT-M), and N+1 redundancy.',
      kpis: [
        { label_fr: 'Puissance Totale UPS', label_en: 'UPS Capacity', val: '800 kVA (2 × 400 kVA N+1)' },
        { label_fr: 'Temps de Commutation', label_en: 'Transfer Time', val: '0 ms (Double Conversion)' },
        { label_fr: 'Autonomie Batterie', label_en: 'Battery Autonomy', val: '4 heures à 80% de charge' },
        { label_fr: 'Régime de Neutre Médical', label_en: 'Earthing System', val: 'IT Médicalisé (CPI localisé)' }
      ],
      techSpecs: [
        { key_fr: 'Technologie d\'Onduleur', key_en: 'UPS Technology', val: 'En ligne double conversion VFI-SS-111 (IEC 62040-3) avec IGBT triphasé sans transformateur' },
        { key_fr: 'Bancs de Batteries', key_en: 'Battery Banks', val: 'Batteries VRLA étanches sans entretien au plomb pur avec surveillance individuelle d\'élément' },
        { key_fr: 'Tableaux Blocs Opératoires', key_en: 'Surgical Theatres Panels', val: 'Transformateurs d\'isolement 230/230 V 5 kVA avec Contrôleur Permanent d\'Isolement (CPI)' },
        { key_fr: 'Commutateur Statique (STS)', key_en: 'Static Transfer Switch', val: 'Double voie d\'alimentation secourue A/B avec synchronisme automatique' },
        { key_fr: 'Rendement Global', key_en: 'Overall Efficiency', val: '96.5% en mode double conversion, 99% en mode ECO intelligent' }
      ],
      diagramHighlight: isFr 
        ? 'Régime IT médical selon NF C 15-211 : le premier défaut d\'isolement ne déclenche pas l\'alimentation des appareils de survie et signale une alarme visuelle/sonore.' 
        : 'Medical IT scheme per IEC 60364-7-710: first insulation fault triggers non-disruptive audible/visual alert without cutting life-support power.',
      standardsApplied: ['IEC 62040 (Onduleurs)', 'NF C 15-211 / IEC 60364-7-710 (Locaux médicaux)', 'ISO 9001:2015']
    }
  ];

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // 5-Stage Engineering Lifecycle steps
  const lifecycleSteps = [
    {
      step: '01',
      title_fr: 'Audit Énergétique & Relevé de Charge',
      title_en: 'Site Assessment & Load Survey',
      lead_fr: 'Collecte des courbes de consommation, bilan de puissance et mesure de la qualité réseau.',
      lead_en: 'Power logging, load curves collection, power factor measurement, and preliminary network survey.',
      activities_fr: [
        'Analyseur de réseau triphasé pour mesure des harmoniques THD-I, THD-V et cos φ.',
        'Calcul du courant de court-circuit présumé amont (Icc) au point de raccordement réseau.',
        'Évaluation des risques foudre (NF C 17-102) et nature géologique du sol (résistivité wenner).'
      ],
      activities_en: [
        '3-phase power quality logging for harmonic spectrum (THD-I/V) and power factor.',
        'Upstream prospective short-circuit current (Isc) calculation at grid point of common coupling.',
        'Lightning risk assessment and soil resistivity measurements via Wenner 4-pin method.'
      ],
      tools: ['Fluke 435 Series II', 'Chauvin Arnoux C.A 6549', 'IEEE 1459'],
      deliverable_fr: 'Rapport d\'audit technique et bilan de puissance dimensionnant'
    },
    {
      step: '02',
      title_fr: 'Conception & Notes de Calcul (Ingénierie)',
      title_en: 'Detailed Engineering & Schematics',
      lead_fr: 'Élaboration des schémas unifilaires (SLD), dimensionnement des câbles et coordination sélective.',
      lead_en: 'Single-line diagrams (SLD), cable thermal sizing, voltage drop validation, and protective selectivity.',
      activities_fr: [
        'Tracé des schémas de principe unifilaires et plans de disposition des cellules HTA / armoires TGBT.',
        'Calcul de section des conducteurs avec vérification de la chute de tension (ΔU < 3% ou 5%).',
        'Étude de coordination des relais de protection (courbes temps-courant I-t) et calcul d\'énergie incidente Arc Flash (IEEE 1584).'
      ],
      activities_en: [
        'Single-line diagrams drafting and layout plans for MV cubicles and LV switchboards.',
        'Conductor cross-section sizing complying with ampacity and permissible voltage drop limits.',
        'Protection coordination study (time-current curves) and IEEE 1584 Arc Flash hazard calculation.'
      ],
      tools: ['Caneco BT / HT', 'ETAP', 'AutoCAD Electrical', 'NF C 15-100 / IEC 60364'],
      deliverable_fr: 'Dossier de Consultation des Entreprises (DCE), plans d\'exécution et notes de calcul certifiées'
    },
    {
      step: '03',
      title_fr: 'Fabrication & Essais Usine (FAT)',
      title_en: 'Manufacturing & Factory Acceptance Testing (FAT)',
      lead_fr: 'Construction des tableaux, contrôles qualité et essais en plateforme chez le constructeur.',
      lead_en: 'Panel fabrication, wiring verification, quality control, and rigorous factory test bench validations.',
      activities_fr: [
        'Contrôle visuel de conformité aux plans, vérification des distances d\'isolement dans l\'air et lignes de fuite.',
        'Essais diélectriques de tenue à fréquence industrielle (ex: 2.5 kV / 1 min pour BT, 70 kV pour HTA).',
        'Test d\'injection secondaire des déclencheurs et simulation logique des automatismes inverseurs (ATS).'
      ],
      activities_en: [
        'Visual compliance check against drawings, clearance in air, and creepage distance measurements.',
        'Power-frequency dielectric withstand testing (e.g. 2.5kV/1min for LV, 70kV for MV switchgear).',
        'Secondary injection verification of electronic trips and ATS interlocking logic simulation.'
      ],
      tools: ['Omicron CMC 356', 'Mégohmmètre 5 kV', 'IEC 61439-1/-2'],
      deliverable_fr: 'Procès-Verbal d\'Essais Usine (FAT Report) signé avec réserve zéro'
    },
    {
      step: '04',
      title_fr: 'Installation & Mise en Service sur Site (SAT)',
      title_en: 'Installation & Site Acceptance Testing (SAT)',
      lead_fr: 'Montage, raccordements, essais fonctionnels sous charge et mise sous tension sous protocole.',
      lead_en: 'Site erection, cable laying, primary injection tests, load tests, and formal energization protocol.',
      activities_fr: [
        'Mesure de continuité équipotentielle et vérification de la résistance de prise de terre (< 1 à 5 Ω).',
        'Essais d\'injection primaire (TC + relais + disjoncteur) pour valider la chaîne de déclenchement complète.',
        'Vérification de la rotation des phases (sens cyclique L1-L2-L3) et essai de charge réelle avec banc de charge résistif.'
      ],
      activities_en: [
        'Continuity and bonding verification; grounding resistance measurements (< 1 to 5 Ω target).',
        'Primary injection testing verifying current transformer ratio, protection relay, and breaker trip loop.',
        'Phase rotation validation (L1-L2-L3 sequence) and real on-load testing with resistive load bank.'
      ],
      tools: ['Banc de charge 500 kW', 'Testeur d\'ordre de phases', 'Consignation électrique'],
      deliverable_fr: 'Certificat de Conformité et Procès-Verbal de Mise en Service Commerciale (SAT)'
    },
    {
      step: '05',
      title_fr: 'Exploitation, Maintenance & Qualité Réseau',
      title_en: 'Operation, Maintenance & Power Quality',
      lead_fr: 'Supervision continue, thermographie infrarouge préventive et interventions de maintenance.',
      lead_en: 'Preventive thermal imaging, periodic dielectric checks, dissolved gas analysis (DGA), and 24/7 callout.',
      activities_fr: [
        'Audit thermographique infrarouge annuel des connexions et jeux de barres pour détecter les points chauds.',
        'Analyse physico-chimique de l\'huile diélectrique des transformateurs (gaz dissous DGA selon IEC 60599).',
        'Contrat de maintenance préventive avec astreinte technique 24/7 et pièces de rechange critiques sous consignation.'
      ],
      activities_en: [
        'Annual infrared thermographic survey of all bolted busbar joints to detect thermal hotspots.',
        'Transformer dielectric oil physico-chemical testing and Dissolved Gas Analysis (DGA per IEC 60599).',
        'Preventive maintenance contracts with 24/7 emergency dispatch and consigned strategic spares.'
      ],
      tools: ['Caméra Thermique FLIR E8-XT', 'Testeur de rigidité diélectrique d\'huile', 'GMAO'],
      deliverable_fr: 'Livret d\'entretien réglementaire et carnet de maintenance prédictive'
    }
  ];

  // Dynamic calculation for Advisor
  const advisorComputed = (() => {
    const kva = advisorPowerKVA;
    const kv = advisorGridVoltageKV;
    // Current at primary HV
    const iprimaryA = (kva / (Math.sqrt(3) * kv)).toFixed(1);
    // Current at secondary 400V
    const isecA = (kva / (Math.sqrt(3) * 0.4)).toFixed(0);
    // Recommended transformer standard rating
    const standardTrafoKva = [250, 400, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000].find(r => r >= kva) || 5000;
    // Generator sizing recommendation
    const genRecommendedKva = advisorIndustry === 'hospital' 
      ? standardTrafoKva // 100% emergency backup
      : Math.round(standardTrafoKva * 0.7); // 70% essential load backup
    // UPS sizing
    const upsKva = advisorIndustry === 'hospital'
      ? Math.round(standardTrafoKva * 0.4)
      : advisorIndustry === 'water'
      ? 60
      : Math.round(standardTrafoKva * 0.15);

    return {
      iprimaryA,
      isecA,
      standardTrafoKva,
      genRecommendedKva,
      upsKva
    };
  })();

  return (
    <div className="space-y-8 font-sans text-slate-100 pb-20">
      
      {/* 1. Header Banner & Context */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/40 border border-slate-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5 text-sky-400" />
              <span>{isFr ? 'INGÉNIERIE & PROJETS INDUSTRIELS' : 'INDUSTRIAL ENGINEERING & FIELD PROJECTS'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFr ? 'NORMES CEI / IEEE / NF C' : 'IEC / IEEE / NF C STANDARDS'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFr ? '30 ANS D\'EXPERTISE DE TERRAIN' : '30 YEARS FIELD EXCELLENCE'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono leading-tight">
            {isFr ? (
              <>Projets Industriels, Postes HT & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">Certainté Électrotechnique</span></>
            ) : (
              <>Industrial Projects, HV Substations & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">Electrical Certainty</span></>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            {isFr ? (
              <>
                De la centrale autonome à l'usine de concassage minier, de la station de pompage d'eau à l'hôpital régional : explorez les cas réels d'ingénierie, les calculs physiques de ligne, le cycle de vie contractuel (FAT/SAT) et dimensionnez vos propres infrastructures électriques.
              </>
            ) : (
              <>
                From autonomous generation to northern mining crushers, municipal water SCADA to regional hospital power: explore real-world engineering project archetypes, transmission physics, project commissioning lifecycles (FAT/SAT), and configure your own facility scopes.
              </>
            )}
          </p>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">{isFr ? 'Puissance Raccordée' : 'Commissioned Power'}</span>
              <div className="text-lg sm:text-xl font-bold text-sky-400">2 400 MW+</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">{isFr ? 'Chantiers Livrés' : 'Projects Completed'}</span>
              <div className="text-lg sm:text-xl font-bold text-amber-400">340+ Usines</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">{isFr ? 'Disponibilité Critique' : 'Critical Uptime'}</span>
              <div className="text-lg sm:text-xl font-bold text-emerald-400">99.8%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">{isFr ? 'Réseau Couvert' : 'Voltage Scope'}</span>
              <div className="text-lg sm:text-xl font-bold text-purple-400">400V → 225kV</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('PROJECTS')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'PROJECTS'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>{isFr ? '1. Cas Réels & Chantiers (4)' : '1. Real Field Projects (4)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('POWER_FLOW')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'POWER_FLOW'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{isFr ? '2. Échelle de Tension & Pertes Joule' : '2. Voltage Ladder & Losses'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('LIFECYCLE')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'LIFECYCLE'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{isFr ? '3. Cycle de Vie Projet (FAT / SAT)' : '3. 5-Stage Project Lifecycle'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('STANDARDS')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'STANDARDS'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isFr ? '4. Référentiel & Normes (IEEE/CEI)' : '4. Normative Framework'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ADVISOR')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ADVISOR'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>{isFr ? '5. Simulateur de Cadrage d\'Usine' : '5. Facility Scope Advisor'}</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: THE 4 REAL INDUSTRIAL PROJECT CASE STUDIES
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'PROJECTS' && (
        <div className="space-y-6">
          {/* Project Archetype Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {projects.map((proj) => {
              const isSelected = proj.id === selectedProjectId;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`p-4 rounded-xl text-left transition-all border font-mono ${
                    isSelected
                      ? 'bg-slate-900 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">{proj.tag}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                      {proj.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2">
                    {isFr ? proj.title_fr : proj.title_en}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">
                    {isFr ? proj.category_fr : proj.category_en}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Project Sheet */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 text-xs font-mono font-bold">
                    {activeProject.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {isFr ? activeProject.category_fr : activeProject.category_en}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {isFr ? activeProject.title_fr : activeProject.title_en}
                </h2>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {isFr ? activeProject.summary_fr : activeProject.summary_en}
                </p>
              </div>

              {/* Action Buttons linking to EPEDE tools */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {onNavigateDiagram && (
                  <button
                    type="button"
                    onClick={() => onNavigateDiagram()}
                    className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-slate-950 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Voir Schéma SLD' : 'View SLD CAD'}</span>
                  </button>
                )}
                {onNavigateCalculator && (
                  <button
                    type="button"
                    onClick={() => onNavigateCalculator()}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors border border-slate-700 flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isFr ? 'Calculer Court-Circuit' : 'Calculate Short-Circuit'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeProject.kpis.map((kpi, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono">
                  <span className="text-[11px] text-slate-400 block mb-1">
                    {isFr ? kpi.label_fr : kpi.label_en}
                  </span>
                  <span className="text-base sm:text-lg font-black text-amber-300 block">
                    {kpi.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Technical Specifications Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>{isFr ? 'Spécifications Électromécaniques du Projet' : 'Electromechanical Technical Specifications'}</span>
              </h3>
              <div className="rounded-xl border border-slate-800 overflow-hidden font-mono text-xs divide-y divide-slate-800/70 bg-slate-950">
                {activeProject.techSpecs.map((spec, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-2 hover:bg-slate-900/50 transition-colors">
                    <span className="text-slate-400 font-semibold sm:col-span-1">
                      {isFr ? spec.key_fr : spec.key_en}
                    </span>
                    <span className="text-slate-200 sm:col-span-2">
                      {spec.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineering Challenge & Key Solution Note */}
            <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-800/40 text-xs font-mono space-y-1.5">
              <div className="text-sky-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>{isFr ? 'Point Clé d\'Ingénierie & Sécurité Système' : 'Engineering Highlight & System Safety'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {activeProject.diagramHighlight}
              </p>
            </div>

            {/* Applied Norms Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-500 font-bold">{isFr ? 'Normes Appliquées :' : 'Applicable Standards:'}</span>
              {activeProject.standardsApplied.map((norm, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-300">
                  {norm}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 2: THE INTERACTIVE POWER FLOW & VOLTAGE LADDER
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'POWER_FLOW' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6">
            <div className="max-w-3xl space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
                {isFr ? 'Chaîne de Transport & Pourquoi Élever la Tension ?' : 'The Power Flow Chain & Why High Voltage Reduces Losses'}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isFr ? (
                  <>
                    La formule fondamentale des pertes par effet Joule est <strong className="text-amber-400">P = 3·R·I²</strong>. Lorsque la tension est multipliée par 12 (de 11 kV à 132 kV), le courant est divisé par 12, et les pertes calorifiques sont réduites par un facteur <strong className="text-sky-400">12² = 144</strong> (soit plus de 99% d'énergie économisée) !
                  </>
                ) : (
                  <>
                    The fundamental Joule loss formula is <strong className="text-amber-400">P = 3·R·I²</strong>. When voltage is stepped up by a factor of 12 (from 11kV to 132kV), line current drops by 12, and resistive heat losses are reduced by <strong className="text-sky-400">12² = 144 times</strong> (&gt;99% loss reduction)!
                  </>
                )}
              </p>
            </div>

            {/* Interactive Physics Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="flow-power-slider" className="text-slate-400">{isFr ? 'Puissance Transmise (MW) :' : 'Transmitted Power (MW):'}</label>
                  <span className="text-sky-400 font-bold">{flowPowerMW} MW</span>
                </div>
                <input
                  id="flow-power-slider"
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={flowPowerMW}
                  onChange={(e) => setFlowPowerMW(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="flow-distance-slider" className="text-slate-400">{isFr ? 'Distance de Transport (km) :' : 'Transmission Distance (km):'}</label>
                  <span className="text-amber-400 font-bold">{flowLineDistanceKm} km</span>
                </div>
                <input
                  id="flow-distance-slider"
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={flowLineDistanceKm}
                  onChange={(e) => setFlowLineDistanceKm(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Stage-by-Stage Visual Ladder */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
              {[
                { stage: 0, title_fr: 'Centrale', title_en: 'Power Station', kv: '11 kV', current: `${currentAt11kV.toFixed(0)} A`, color: 'border-emerald-500/50 text-emerald-400' },
                { stage: 1, title_fr: 'Transfo Élévateur', title_en: 'Step-Up Trafo', kv: '11kV → 132kV', current: 'Élévation ×12', color: 'border-sky-500/50 text-sky-400' },
                { stage: 2, title_fr: 'Ligne HTB Ligne', title_en: 'HV Lines', kv: '132 kV', current: `${currentAt132kV.toFixed(0)} A`, color: 'border-amber-500/50 text-amber-400' },
                { stage: 3, title_fr: 'Poste Source', title_en: 'Step-Down Sub', kv: '132kV → 33kV', current: 'Distribution', color: 'border-sky-500/50 text-sky-400' },
                { stage: 4, title_fr: 'Réseau HTA', title_en: 'Medium Voltage', kv: '33 kV / 15 kV', current: 'Foyers & Zones', color: 'border-purple-500/50 text-purple-400' },
                { stage: 5, title_fr: 'Usine / TGBT', title_en: 'Facility / LV', kv: '400 V / 230 V', current: 'Utilisation', color: 'border-emerald-500/50 text-emerald-400' },
              ].map((stg) => (
                <div
                  key={stg.stage}
                  onClick={() => setActiveFlowStage(stg.stage)}
                  className={`p-3 rounded-xl border font-mono text-center cursor-pointer transition-all ${
                    activeFlowStage === stg.stage
                      ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 block uppercase">Étape {stg.stage + 1}</span>
                  <div className="font-bold text-xs text-white my-1">{isFr ? stg.title_fr : stg.title_en}</div>
                  <div className={`text-xs font-bold ${stg.color}`}>{stg.kv}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{stg.current}</div>
                </div>
              ))}
            </div>

            {/* Physics Comparison Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/40">
                <span className="text-[11px] text-red-400 block mb-1">
                  {isFr ? 'Si transporté en 11 kV (Sans Élévation) :' : 'If transmitted at 11kV (Direct):'}
                </span>
                <div className="text-xl font-black text-red-300">
                  {losses11kVMW > 1000 ? '> 100 MW (Impossible)' : `${losses11kVMW.toFixed(1)} MW`}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isFr ? 'Pertes Joule monstrueuses, échauffement et destruction des câbles.' : 'Extreme Joule losses, catastrophic conductor melting.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                <span className="text-[11px] text-emerald-400 block mb-1">
                  {isFr ? 'Transporté en Haute Tension 132 kV :' : 'Transmitted at High Voltage 132kV:'}
                </span>
                <div className="text-xl font-black text-emerald-300">
                  {losses132kVMW.toFixed(2)} MW
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isFr ? `Seulement ${((losses132kVMW / flowPowerMW) * 100).toFixed(2)}% de pertes sur ${flowLineDistanceKm} km.` : `Only ${((losses132kVMW / flowPowerMW) * 100).toFixed(2)}% loss over ${flowLineDistanceKm} km.`}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-800/40">
                <span className="text-[11px] text-sky-400 block mb-1">
                  {isFr ? 'Économie Réalisée par l\'Élévation :' : 'Joule Loss Reduction Factor:'}
                </span>
                <div className="text-xl font-black text-sky-300">
                  -{lossesReductionPercent}%
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isFr ? 'Justifie l\'investissement dans les postes et transformateurs HT.' : 'Empirical economic rationale for grid substations.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 3: THE 5-STAGE ENGINEERING PROJECT LIFECYCLE
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'LIFECYCLE' && (
        <div className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
              {isFr ? 'Le Cycle de Vie d\'un Projet Électrique Industriel' : 'The 5-Stage Engineering Project Delivery Lifecycle'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isFr ? (
                <>
                  Du premier relevé de charge sur site jusqu'à la mise sous tension commerciale et la maintenance prédictive : découvrez le processus rigoureux exigé par les donneurs d'ordre et les normes internationales.
                </>
              ) : (
                <>
                  From the initial site power survey through factory acceptance tests (FAT), site acceptance tests (SAT), and predictive maintenance: understand the rigorous engineering lifecycle required on industrial sites.
                </>
              )}
            </p>
          </div>

          <div className="space-y-4">
            {lifecycleSteps.map((stg) => (
              <div
                key={stg.step}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 font-mono font-black text-sky-400 flex items-center justify-center text-base shrink-0">
                      {stg.step}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                        {isFr ? stg.title_fr : stg.title_en}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isFr ? stg.lead_fr : stg.lead_en}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 text-[11px] font-mono font-bold border border-amber-500/20 shrink-0 self-start sm:self-auto">
                    {stg.deliverable_fr}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                      {isFr ? 'Opérations Clés Réalisées :' : 'Key Field Activities:'}
                    </span>
                    <ul className="space-y-1.5 text-slate-300">
                      {(isFr ? stg.activities_fr : stg.activities_en).map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isFr ? 'Instruments & Outils Référents :' : 'Tools & Benchmark Standards:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stg.tools.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 4: NORMATIVE & COMPLIANCE FRAMEWORK
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'STANDARDS' && (
        <div className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
              {isFr ? 'Référentiel Normatif & Sécurité des Personnes' : 'Engineering Norms & Arc-Flash Safety Standards'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isFr ? (
                <>
                  Une installation industrielle ne se conçoit pas uniquement sur des calculs de courant : elle doit garantir la protection des intervenants contre l'éclair d'arc électrique (<strong className="text-amber-400">IEEE 1584</strong>), la fiabilité des transformateurs (<strong className="text-sky-400">IEC 60076</strong>) et la sécurité d'exploitation selon les habilitations électriques.
                </>
              ) : (
                <>
                  Industrial power systems must strictly protect personnel from arc-flash blast injuries (<strong className="text-amber-400">IEEE 1584</strong>), ensure transformer dielectric durability (<strong className="text-sky-400">IEC 60076</strong>), and enforce electrical safety qualifications.
                </>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">IEEE 1584 & NFPA 70E</h3>
                  <span className="text-xs text-amber-400 font-bold">{isFr ? 'Risque d\'Éclair d\'Arc (Arc Flash)' : 'Arc Flash Hazard Calculation'}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr ? (
                  <>
                    Définit les formules de calcul de l'énergie incidente (en <strong className="text-amber-400">cal/cm²</strong>) et la distance de sécurité (Arc Flash Boundary). Permet de prescrire les Équipements de Protection Individuelle (EPI) obligatoires (combinaisons ignifugées Catégorie 1 à 4, écrans faciaux avec protection mentonnière).
                  </>
                ) : (
                  <>
                    Formulates incident energy calculations (<strong className="text-amber-400">cal/cm²</strong>) and Arc Flash Protection Boundaries. Mandates required Personal Protective Equipment (PPE Categories 1 through 4, arc-rated suits, face shields with chin cups).
                  </>
                )}
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                {isFr ? 'Seuil critique sans brûlure au 2e degré : 1.2 cal/cm²' : 'Threshold for second-degree curable burn: 1.2 cal/cm²'}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">IEC 60076 & IEC 60255</h3>
                  <span className="text-xs text-sky-400 font-bold">{isFr ? 'Transformateurs & Relais de Protection' : 'Power Transformers & Measuring Relays'}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr ? (
                  <>
                    Régit les échauffements limites des enroulements (65K pour huile minérale), les niveaux d'isolement aux ondes de foudre (BIL), les pertes à vide (P₀) et en charge (P_k), ainsi que les caractéristiques de déclenchement des relais numériques ANSI 50/51/87.
                  </>
                ) : (
                  <>
                    Defines permissible winding temperature rise limits (65K for mineral oil), Basic Impulse Insulation Levels (BIL), no-load losses (P₀) and load losses (P_k), as well as trip characteristics for ANSI 50/51/87 numerical relays.
                  </>
                )}
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                {isFr ? 'Essais de type : Tenue aux courts-circuits dynamiques (IEC 60076-5)' : 'Type testing: Short-circuit dynamic withstand (IEC 60076-5)'}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">NF C 15-100 & NF C 13-200</h3>
                  <span className="text-xs text-emerald-400 font-bold">{isFr ? 'Installations Basse & Haute Tension' : 'LV and HV Installation Safety Codes'}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr ? (
                  <>
                    Normes d'application obligatoire pour les réseaux industriels : choix des régimes de neutre (TT, TN, IT), coupure automatique de l'alimentation en cas de défaut d'isolement, protection différentielle et sections minimales des conducteurs de protection (PE).
                  </>
                ) : (
                  <>
                    Mandatory standards for industrial grids: earthing arrangements (TT, TN, IT schemes), automatic disconnection of supply upon earth fault, residual current devices (RCD), and protective earth (PE) cross-section sizing.
                  </>
                )}
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                {isFr ? 'Temps de coupure maximal en 230/400V : 0.4 seconde en schéma TN' : 'Max disconnection time at 230/400V: 0.4 seconds in TN system'}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Habilitations & Sécurité</h3>
                  <span className="text-xs text-purple-400 font-bold">{isFr ? 'Habilitations B1V, B2V, BR, BC, H1V, H2V, HC' : 'Worker Electrical Certifications'}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isFr ? (
                  <>
                    Cadre réglementaire de consignation et d'intervention : vérification d'absence de tension (VAT), mise à la terre et en court-circuit (MALT/CC), balisage des zones de voisinage et délimitation stricte des accès en poste HTA/HTB.
                  </>
                ) : (
                  <>
                    Safety lockout-tagout (LOTO) protocols: live-line voltage detector verification (VAT), portable grounding and short-circuiting clamps, safety zone delimitation, and restricted switchgear access.
                  </>
                )}
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                {isFr ? 'Règle d\'or : Séparer, Condamner, Identifier, Vérifier (VAT), Mettre à la terre' : 'Golden rules: Disconnect, Lock, Tag, Verify zero voltage, Ground'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 5: INTERACTIVE FACILITY SCOPE & SIZING ADVISOR
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'ADVISOR' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>{isFr ? 'Aide au Dimensionnement & Cadrage Technique' : 'Engineering Sizing & Scope Advisor'}</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
                {isFr ? 'Dimensionnez l\'Équipement d\'un Nouveau Site' : 'Instant Sizing for a New Industrial Facility'}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isFr ? (
                  <>
                    Sélectionnez la typologie de votre site et sa puissance prévisionnelle pour obtenir immédiatement les calibres recommandés de transformateurs, groupes électrogènes, onduleurs et courants de service.
                  </>
                ) : (
                  <>
                    Select your facility typology and expected load demand to instantly determine recommended transformer kVA, backup generator ratings, UPS capacity, and nominal operating currents.
                  </>
                )}
              </p>
            </div>

            {/* Inputs Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-slate-400 font-bold block">{isFr ? 'Typologie d\'Activité :' : 'Facility Typology:'}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'factory', label_fr: 'Usine / Cimenterie', label_en: 'Manufacturing' },
                    { id: 'mine', label_fr: 'Mine / Carrière', label_en: 'Mining / Quarry' },
                    { id: 'hospital', label_fr: 'Hôpital Régional', label_en: 'Hospital / ICU' },
                    { id: 'water', label_fr: 'Station d\'Eau', label_en: 'Water Utility' }
                  ].map((ind) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setAdvisorIndustry(ind.id as any)}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        advisorIndustry === ind.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isFr ? ind.label_fr : ind.label_en}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="advisor-power-slider" className="text-slate-400 font-bold block">
                  {isFr ? 'Puissance Appelée Prévue :' : 'Expected Apparent Power:'} <span className="text-sky-400">{advisorPowerKVA} kVA</span>
                </label>
                <input
                  id="advisor-power-slider"
                  type="range"
                  min="250"
                  max="5000"
                  step="250"
                  value={advisorPowerKVA}
                  onChange={(e) => setAdvisorPowerKVA(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>250 kVA</span>
                  <span>2 500 kVA</span>
                  <span>5 000 kVA</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 font-bold block">
                  {isFr ? 'Tension Réseau HTA Disponible :' : 'Grid MV Incomer Voltage:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 20, 33].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAdvisorGridVoltageKV(v)}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        advisorGridVoltageKV === v
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v} kV
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800 font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Transformateur HTA/BT Recommandé' : 'Recommended Transformer Rating'}
                </span>
                <div className="text-xl font-black text-sky-400">
                  {advisorComputed.standardTrafoKva} kVA
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {advisorGridVoltageKV} kV / 400 V — Dyn11
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Secours Groupe Électrogène' : 'Emergency Gen-Set Capacity'}
                </span>
                <div className="text-xl font-black text-amber-400">
                  {advisorComputed.genRecommendedKva} kVA
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isFr ? 'Démarrage automatique ATS < 15s' : 'Automatic ATS start in < 15s'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Onduleur Sans Coupure (UPS)' : 'Online Modular UPS System'}
                </span>
                <div className="text-xl font-black text-purple-400">
                  {advisorComputed.upsKva} kVA
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isFr ? '0 ms / VFI double conversion' : '0 ms / VFI double conversion'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">
                  {isFr ? 'Courants Nominaux HTA / BT' : 'Rated Currents MV / LV'}
                </span>
                <div className="text-sm font-bold text-emerald-400">
                  HTA: {advisorComputed.iprimaryA} A
                </div>
                <div className="text-sm font-bold text-emerald-300">
                  BT: {advisorComputed.isecA} A
                </div>
              </div>
            </div>

            {/* Practical Advice Banner */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs font-mono space-y-1">
              <div className="text-amber-300 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{isFr ? 'Recommandation Spécifique pour cette Typologie' : 'Typology Engineering Recommendation'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {advisorIndustry === 'hospital' && (isFr 
                  ? 'Pour un hôpital : Obligation de schéma IT médicalisé (NF C 15-211) pour les blocs opératoires et salles de réveil avec transformateurs de séparation 230/230V et CPI dédié.' 
                  : 'For healthcare facilities: Mandatory medical IT system (IEC 60364-7-710) for surgical rooms with medical isolating transformers and local insulation fault monitoring.')}
                {advisorIndustry === 'mine' && (isFr 
                  ? 'Pour une mine : Prévoyez des démarreurs progressifs ou variateurs moyenne tension pour les concasseurs afin d\'éviter les chutes de tension brutales sur le réseau 33 kV.' 
                  : 'For mining sites: Install soft starters or medium-voltage VFDs on raw crushers to eliminate extreme voltage dips across the 33kV utility feeder.')}
                {advisorIndustry === 'factory' && (isFr 
                  ? 'Pour une usine : Batterie de condensateurs à gradins automatiques recommandée pour maintenir cos φ > 0.93 et éviter les pénalités pour consommation d\'énergie réactive.' 
                  : 'For manufacturing: Automatic stepped capacitor banks recommended to sustain power factor > 0.93 and avoid utility reactive energy surcharges.')}
                {advisorIndustry === 'water' && (isFr 
                  ? 'Pour une station d\'eau : Filtres anti-harmoniques actifs requis sur les variateurs de fréquence des pompes de refoulement pour garantir THD-I < 5%.' 
                  : 'For water utilities: Active harmonic filters required on high-power pump VFDs to guarantee input current total harmonic distortion THD-I < 5%.')}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
