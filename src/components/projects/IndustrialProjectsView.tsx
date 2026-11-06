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

  const projectImages: Record<string, string> = {
    'PROJ-GEN-DOUALA': '/images/homepage_uploads/8.jpg',
    'PROJ-SUB-NORTH': '/images/homepage_uploads/4.jpeg',
    'PROJ-SCADA-YAOUNDE': '/images/homepage_uploads/9.jpg',
    'PROJ-UPS-HOSPITAL': '/images/homepage_uploads/6.jpg',
  };

  return (
    <div className="space-y-14 font-sans text-[#17282C] pb-20">
      {/* 1. Editorial Field/Project Lead Story */}
      <section className="border-t border-[#17282C] pt-8 sm:pt-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
          <div>
            <span className="epede-eyebrow block">
              {isFr ? 'Ingénierie Industrielle' : 'Industrial Engineering'}
            </span>
            <p className="mt-2 font-mono text-xs text-[#5C6C70]">
              {isFr ? 'Chantiers · Postes · FAT/SAT' : 'Field Projects · Substations · FAT/SAT'}
            </p>
          </div>

          <div className="space-y-6 max-w-4xl">
            <h1 className="epede-h1">
              {isFr ? (
                <>
                  Projets industriels, postes HT et{' '}
                  <em className="font-serif-editorial text-[#147C78]">
                    certitude électrotechnique sur site
                  </em>
                  .
                </>
              ) : (
                <>
                  Industrial projects, HV substations, and{' '}
                  <em className="font-serif-editorial text-[#147C78]">
                    field electrical certainty
                  </em>
                  .
                </>
              )}
            </h1>

            <p className="epede-lead">
              {isFr
                ? "De la centrale autonome 4×500 kVA synchronisée de Douala Bassa au poste source minier 33/11 kV du Nord, de la téléconduite SCADA d'eau potable à l'alimentation secourue IT médicale d'un hôpital régional : explorez les études de réalisation, l'échelle de tension et le cycle contractuel FAT/SAT."
                : 'From the 4×500 kVA synchronized powerhouse in Douala Bassa to a 33/11 kV northern mining substation, municipal water SCADA, and zero-downtime medical IT hospital power: inspect real project scopes, transmission loss physics, and the 5-stage FAT/SAT engineering lifecycle.'}
            </p>

            {/* Concise Editorial Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#DEDACF] font-mono">
              <div>
                <span className="text-[11px] text-[#5C6C70] uppercase block">
                  {isFr ? 'Plage de Tension' : 'Voltage Envelope'}
                </span>
                <div className="text-lg font-bold text-[#17282C] mt-0.5">400 V → 225 kV</div>
              </div>
              <div>
                <span className="text-[11px] text-[#5C6C70] uppercase block">
                  {isFr ? 'Archétypes Documentés' : 'Documented Scopes'}
                </span>
                <div className="text-lg font-bold text-[#147C78] mt-0.5">
                  {isFr ? '4 Dossiers Complets' : '4 Turnkey Dossiers'}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[#5C6C70] uppercase block">
                  {isFr ? 'Disponibilité Cible' : 'Critical Uptime'}
                </span>
                <div className="text-lg font-bold text-[#B8872D] mt-0.5">99.8% (N+1)</div>
              </div>
              <div>
                <span className="text-[11px] text-[#5C6C70] uppercase block">
                  {isFr ? 'Référentiel' : 'Governing Codes'}
                </span>
                <div className="text-lg font-bold text-[#17282C] mt-0.5">IEC · IEEE · NF C</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section Navigation Tabs */}
      <div
        role="tablist"
        aria-label={isFr ? 'Sections ingénierie industrielle' : 'Industrial engineering sections'}
        className="flex items-center gap-2 overflow-x-auto py-3 border-y border-[#17282C] bg-[#FFFDF9] px-4 font-mono text-xs"
      >
        {[
          {
            id: 'PROJECTS',
            icon: <Factory className="w-3.5 h-3.5" />,
            label: isFr ? '01 · Chantiers & Cas Réels (4)' : '01 · Field Project Dossiers (4)',
          },
          {
            id: 'POWER_FLOW',
            icon: <Zap className="w-3.5 h-3.5" />,
            label: isFr ? '02 · Échelle de Tension & Pertes Joule' : '02 · Voltage Ladder & Joule Losses',
          },
          {
            id: 'LIFECYCLE',
            icon: <Clock className="w-3.5 h-3.5" />,
            label: isFr ? '03 · Cycle de Projet (FAT / SAT)' : '03 · 5-Stage Lifecycle (FAT / SAT)',
          },
          {
            id: 'STANDARDS',
            icon: <BookOpen className="w-3.5 h-3.5" />,
            label: isFr ? '04 · Normes & Habilitations' : '04 · Standards & Arc-Flash Safety',
          },
          {
            id: 'ADVISOR',
            icon: <Sliders className="w-3.5 h-3.5" />,
            label: isFr ? '05 · Cadrage & Dimensionnement Site' : '05 · Facility Scope Advisor',
          },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                active
                  ? 'bg-[#147C78] text-[#FFFDF9]'
                  : 'text-[#5C6C70] hover:text-[#17282C] hover:bg-[#F6F4EE]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: THE 4 REAL INDUSTRIAL PROJECT CASE STUDIES (EDITORIAL ROWS)
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'PROJECTS' && (
        <div className="space-y-10">
          {/* Editorial Index Rows of the 4 Projects */}
          <div className="divide-y divide-[#DEDACF] border-y border-[#17282C] bg-[#FFFDF9]">
            {projects.map((proj, idx) => {
              const isSelected = proj.id === selectedProjectId;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`w-full p-5 sm:p-6 text-left transition-colors grid grid-cols-1 md:grid-cols-[56px_160px_1fr_auto] gap-5 items-center ${
                    isSelected
                      ? 'bg-[#E3EFEC]/70 border-l-4 border-l-[#147C78]'
                      : 'hover:bg-[#F6F4EE]'
                  }`}
                >
                  <span className="font-mono text-sm font-bold text-[#147C78]">
                    0{idx + 1}
                  </span>

                  <div className="h-24 w-full rounded-lg overflow-hidden border border-[#DEDACF] bg-[#10191D]">
                    <img
                      src={projectImages[proj.id] || '/images/homepage_uploads/8.jpg'}
                      alt={isFr ? proj.title_fr : proj.title_en}
                      className="w-full h-full object-cover epede-photo-grade"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span className="text-[#147C78] font-semibold uppercase">{proj.tag}</span>
                      <span className="text-[#5C6C70]">·</span>
                      <span className="text-[#B8872D] font-semibold">{proj.badge}</span>
                      <span className="text-[#5C6C70]">·</span>
                      <span className="text-[#5C6C70]">
                        {isFr ? proj.category_fr : proj.category_en}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#17282C] leading-snug">
                      {isFr ? proj.title_fr : proj.title_en}
                    </h3>
                    <p className="text-sm text-[#33474B] line-clamp-2 leading-relaxed">
                      {isFr ? proj.summary_fr : proj.summary_en}
                    </p>
                  </div>

                  <div className="font-mono text-xs font-semibold text-[#17282C] inline-flex items-center gap-1.5 shrink-0">
                    <span>{isSelected ? (isFr ? 'Dossier Actif' : 'Active Dossier') : (isFr ? 'Inspecter' : 'Inspect')}</span>
                    <ChevronRight className="w-4 h-4 text-[#147C78]" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Project Engineering Sheet */}
          <div className="rounded-[10px] bg-[#FFFDF9] border border-[#DEDACF] p-6 sm:p-10 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#DEDACF]">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-[#17282C] text-[#FFFDF9] font-semibold">
                    {activeProject.tag}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#F6F4EE] text-[#B8872D] border border-[#DEDACF] font-semibold">
                    {activeProject.badge}
                  </span>
                  <span className="text-[#5C6C70]">
                    {isFr ? activeProject.category_fr : activeProject.category_en}
                  </span>
                </div>
                <h2 className="epede-h2">
                  {isFr ? activeProject.title_fr : activeProject.title_en}
                </h2>
                <p className="text-base text-[#33474B] leading-relaxed">
                  {isFr ? activeProject.summary_fr : activeProject.summary_en}
                </p>
              </div>

              {/* Action Buttons linking to EPEDE Workbenches */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {onNavigateDiagram && (
                  <button
                    type="button"
                    onClick={() => onNavigateDiagram()}
                    className="epede-btn-primary text-xs px-5 min-h-[42px]"
                  >
                    <Activity className="w-4 h-4" />
                    <span>{isFr ? 'Ouvrir Schéma Unifilaire SLD' : 'Open Interactive SLD'}</span>
                  </button>
                )}
                {onNavigateCalculator && (
                  <button
                    type="button"
                    onClick={() => onNavigateCalculator()}
                    className="epede-btn-secondary text-xs min-h-[42px]"
                  >
                    <Sliders className="w-4 h-4 text-[#147C78]" />
                    <span>{isFr ? 'Solveurs CEI / IEEE' : 'IEC / IEEE Calculators'}</span>
                  </button>
                )}
                {onNavigateSimulation && (
                  <button
                    type="button"
                    onClick={() => onNavigateSimulation('motor-start')}
                    className="epede-btn-secondary text-xs min-h-[42px]"
                  >
                    <Zap className="w-4 h-4 text-[#B8872D]" />
                    <span>{isFr ? 'Banc Démarrage Moteur' : 'Motor Starter Lab'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {activeProject.kpis.map((kpi, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] font-mono"
                >
                  <span className="text-[11px] text-[#5C6C70] block mb-1">
                    {isFr ? kpi.label_fr : kpi.label_en}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-[#17282C] block">
                    {kpi.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Technical Specifications Table */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#147C78] flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>
                  {isFr
                    ? 'Spécifications Électromécaniques du Projet'
                    : 'Electromechanical Technical Specifications'}
                </span>
              </h3>
              <div className="rounded-lg border border-[#DEDACF] overflow-hidden text-xs divide-y divide-[#DEDACF] bg-[#FFFDF9]">
                {activeProject.techSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 hover:bg-[#F6F4EE] transition-colors"
                  >
                    <span className="font-mono text-[#17282C] font-semibold sm:col-span-1">
                      {isFr ? spec.key_fr : spec.key_en}
                    </span>
                    <span className="text-[#33474B] sm:col-span-2">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineering Challenge & Key Solution Note */}
            <div className="p-5 rounded-lg bg-[#E3EFEC]/60 border border-[#147C78]/35 text-xs space-y-1.5">
              <div className="font-mono text-[#147C78] font-semibold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isFr
                    ? 'Point Clé d’Ingénierie & Sélectivité Système'
                    : 'Engineering Highlight & Protection Coordination'}
                </span>
              </div>
              <p className="text-[#17282C] text-sm leading-relaxed">
                {activeProject.diagramHighlight}
              </p>
            </div>

            {/* Applied Norms Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#DEDACF] text-xs font-mono">
              <span className="text-[#5C6C70] font-semibold">
                {isFr ? 'Normes Appliquées :' : 'Applicable Standards:'}
              </span>
              {activeProject.standardsApplied.map((norm, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-[#F6F4EE] border border-[#DEDACF] text-[#17282C] font-medium"
                >
                  {norm}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 2: THE INTERACTIVE POWER FLOW & VOLTAGE LADDER (#10191D WORKBENCH)
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'POWER_FLOW' && (
        <div className="space-y-6">
          <div className="rounded-[12px] epede-workbench p-6 sm:p-8 space-y-6">
            <div className="max-w-3xl space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-[#6CC3BD] block">
                {isFr ? 'Banc de Simulation Physique' : 'Interactive Transmission Physics Workbench'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F4F1E8]">
                {isFr
                  ? 'Chaîne de Transport & Pourquoi Élever la Tension ?'
                  : 'The Power Flow Chain & Why High Voltage Slashes Losses'}
              </h2>
              <p className="text-sm text-[#B9C2C0] leading-relaxed">
                {isFr ? (
                  <>
                    La loi fondamentale des pertes par effet Joule est{' '}
                    <strong className="text-[#F4F1E8] font-mono">P = 3·R·I²</strong>. Lorsque la tension est multipliée par 12 (de 11 kV à 132 kV), le courant est divisé par 12 et les pertes résistives sont divisées par{' '}
                    <strong className="text-[#6CC3BD] font-mono">12² = 144</strong>.
                  </>
                ) : (
                  <>
                    The governing Joule loss equation is{' '}
                    <strong className="text-[#F4F1E8] font-mono">P = 3·R·I²</strong>. Stepping voltage up by a factor of 12 (11 kV to 132 kV) divides line current by 12 and reduces resistive line losses by{' '}
                    <strong className="text-[#6CC3BD] font-mono">12² = 144×</strong>.
                  </>
                )}
              </p>
            </div>

            {/* Interactive Physics Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-lg bg-[#162227] border border-[#2A383C] font-mono text-xs">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="flow-power-slider" className="text-[#B9C2C0]">
                    {isFr ? 'Puissance Transmise (MW)' : 'Transmitted Active Power (MW)'}
                  </label>
                  <span className="text-[#6CC3BD] font-bold">{flowPowerMW} MW</span>
                </div>
                <input
                  id="flow-power-slider"
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={flowPowerMW}
                  onChange={(e) => setFlowPowerMW(Number(e.target.value))}
                  className="w-full accent-[#147C78] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="flow-distance-slider" className="text-[#B9C2C0]">
                    {isFr ? 'Distance de Transport (km)' : 'Corridor Distance (km)'}
                  </label>
                  <span className="text-[#F4F1E8] font-bold">{flowLineDistanceKm} km</span>
                </div>
                <input
                  id="flow-distance-slider"
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={flowLineDistanceKm}
                  onChange={(e) => setFlowLineDistanceKm(Number(e.target.value))}
                  className="w-full accent-[#B8872D] cursor-pointer"
                />
              </div>
            </div>

            {/* Stage-by-Stage Visual Ladder */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              {[
                { stage: 0, title_fr: 'Centrale', title_en: 'Power Station', kv: '11 kV', current: `${currentAt11kV.toFixed(0)} A` },
                { stage: 1, title_fr: 'Transfo GSU', title_en: 'Step-Up Trafo', kv: '11→132 kV', current: '×12 U' },
                { stage: 2, title_fr: 'Ligne HTB', title_en: 'HV Corridor', kv: '132 kV', current: `${currentAt132kV.toFixed(0)} A` },
                { stage: 3, title_fr: 'Poste Source', title_en: 'Step-Down Sub', kv: '132→33 kV', current: 'OLTC' },
                { stage: 4, title_fr: 'Réseau HTA', title_en: 'MV Feeders', kv: '33 / 15 kV', current: 'RMU Loop' },
                { stage: 5, title_fr: 'Usine / TGBT', title_en: 'Facility LV', kv: '400 V', current: 'MCC / Loads' },
              ].map((stg) => (
                <button
                  key={stg.stage}
                  type="button"
                  onClick={() => setActiveFlowStage(stg.stage)}
                  className={`p-3.5 rounded-lg border font-mono text-left transition-colors ${
                    activeFlowStage === stg.stage
                      ? 'bg-[#162227] border-[#6CC3BD] text-[#F4F1E8]'
                      : 'bg-[#10191D] border-[#2A383C] text-[#B9C2C0] hover:border-[#4A5A5E]'
                  }`}
                >
                  <span className="text-[10px] text-[#8A9694] block uppercase">0{stg.stage + 1}</span>
                  <div className="font-bold text-xs text-[#F4F1E8] my-1">
                    {isFr ? stg.title_fr : stg.title_en}
                  </div>
                  <div className="text-xs font-bold text-[#6CC3BD]">{stg.kv}</div>
                  <div className="text-[11px] text-[#B9C2C0] mt-1">{stg.current}</div>
                </button>
              ))}
            </div>

            {/* Physics Comparison Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-4 rounded-lg bg-[#162227] border border-[#E07A5F]/50">
                <span className="text-[11px] text-[#F2A48F] block mb-1">
                  {isFr ? 'Sans élévation (11 kV direct)' : 'Without Step-Up (11 kV direct)'}
                </span>
                <div className="text-xl font-bold text-[#F2A48F]">
                  {losses11kVMW > 1000 ? '> 100 MW (Thermal collapse)' : `${losses11kVMW.toFixed(1)} MW`}
                </div>
                <p className="text-[11px] text-[#B9C2C0] mt-1 font-sans">
                  {isFr ? 'Chute de tension et échauffement rédhibitoires.' : 'Prohibitive voltage drop and conductor overheating.'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#162227] border border-[#6CC3BD]/50">
                <span className="text-[11px] text-[#6CC3BD] block mb-1">
                  {isFr ? 'Avec transport HTB (132 kV)' : 'With HV Transmission (132 kV)'}
                </span>
                <div className="text-xl font-bold text-[#6CC3BD]">
                  {losses132kVMW.toFixed(2)} MW
                </div>
                <p className="text-[11px] text-[#B9C2C0] mt-1 font-sans">
                  {isFr
                    ? `Seulement ${((losses132kVMW / flowPowerMW) * 100).toFixed(2)}% de pertes sur ${flowLineDistanceKm} km.`
                    : `Only ${((losses132kVMW / flowPowerMW) * 100).toFixed(2)}% line loss over ${flowLineDistanceKm} km.`}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#162227] border border-[#2A383C]">
                <span className="text-[11px] text-[#B9C2C0] block mb-1">
                  {isFr ? 'Réduction des Pertes Joule' : 'Joule Loss Reduction'}
                </span>
                <div className="text-xl font-bold text-[#F4F1E8]">
                  -{lossesReductionPercent}%
                </div>
                <p className="text-[11px] text-[#B9C2C0] mt-1 font-sans">
                  {isFr
                    ? 'Justification physique directe des postes élévateurs.'
                    : 'Direct physical rationale for step-up substations.'}
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
        <div className="space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="epede-eyebrow block">
              {isFr ? 'Méthodologie EPC & Essais' : 'EPC Delivery & Commissioning'}
            </span>
            <h2 className="epede-h2">
              {isFr
                ? 'Le cycle de réalisation en 5 étapes (Audit, Études, FAT, SAT, Exploitation)'
                : 'The 5-Stage Engineering Project Lifecycle (Survey, Design, FAT, SAT, O&M)'}
            </h2>
          </div>

          <div className="divide-y divide-[#DEDACF] border-y border-[#17282C] bg-[#FFFDF9]">
            {lifecycleSteps.map((stg) => (
              <div key={stg.step} className="p-6 sm:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DEDACF]">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-base font-bold text-[#147C78]">
                      {stg.step}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-[#17282C]">
                        {isFr ? stg.title_fr : stg.title_en}
                      </h3>
                      <p className="text-sm text-[#5C6C70]">
                        {isFr ? stg.lead_fr : stg.lead_en}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#F6F4EE] text-[#B8872D] text-xs font-mono font-semibold border border-[#DEDACF] self-start sm:self-auto">
                    {stg.deliverable_fr}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="md:col-span-2 space-y-2">
                    <span className="font-mono text-xs font-semibold text-[#147C78] uppercase block">
                      {isFr ? 'Opérations de Vérification' : 'Verification & Field Operations'}
                    </span>
                    <ul className="space-y-2 text-[#33474B]">
                      {(isFr ? stg.activities_fr : stg.activities_en).map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#147C78] mt-0.5 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F6F4EE] border border-[#DEDACF] space-y-2">
                    <span className="font-mono text-xs font-semibold text-[#5C6C70] uppercase block">
                      {isFr ? 'Instruments & Normes' : 'Instruments & Standards'}
                    </span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                      {stg.tools.map((t, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded bg-[#FFFDF9] text-[#17282C] border border-[#DEDACF]"
                        >
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
        <div className="space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="epede-eyebrow block">
              {isFr ? 'Conformité & Sécurité' : 'Compliance & Life Safety'}
            </span>
            <h2 className="epede-h2">
              {isFr
                ? 'Référentiel normatif, Arc-Flash et habilitations électriques'
                : 'Normative codes, Arc-Flash limits, and safety lockouts'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[10px] bg-[#FFFDF9] border border-[#DEDACF] space-y-3">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-[#B91C1C]" />
                <div>
                  <h3 className="text-lg font-bold text-[#17282C]">IEEE 1584 & NFPA 70E</h3>
                  <span className="font-mono text-xs text-[#B91C1C] font-semibold">
                    {isFr ? 'Risque d’Éclair d’Arc (Arc Flash)' : 'Arc-Flash Incident Energy'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#33474B] leading-relaxed">
                {isFr
                  ? "Calcul de l'énergie incidente (cal/cm²) et de la distance limite de protection d'arc (AFPB) pour prescrire la catégorie d'EPI ignifugé (Cat 1 à 4)."
                  : 'Determines incident energy (cal/cm²) and Arc-Flash Protection Boundaries (AFPB) to specify flame-resistant PPE categories (Cat 1–4).'}
              </p>
              <div className="p-3 rounded bg-[#F6F4EE] border border-[#DEDACF] font-mono text-xs text-[#5C6C70]">
                {isFr ? 'Seuil de brûlure du 2e degré : 1.2 cal/cm²' : 'Second-degree burn threshold: 1.2 cal/cm²'}
              </div>
            </div>

            <div className="p-6 rounded-[10px] bg-[#FFFDF9] border border-[#DEDACF] space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#147C78]" />
                <div>
                  <h3 className="text-lg font-bold text-[#17282C]">IEC 60076 & IEC 60255</h3>
                  <span className="font-mono text-xs text-[#147C78] font-semibold">
                    {isFr ? 'Transformateurs & Relais Numériques' : 'Power Transformers & Protection Relays'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#33474B] leading-relaxed">
                {isFr
                  ? "Échauffements admissibles (65 K huile), niveaux d'isolement au choc de foudre (BIL), pertes à vide/charge et courbes de déclenchement ANSI 50/51/87."
                  : 'Permissible winding temperature rise (65 K oil), Basic Impulse Insulation Levels (BIL), losses, and ANSI 50/51/87 protection relay curves.'}
              </p>
              <div className="p-3 rounded bg-[#F6F4EE] border border-[#DEDACF] font-mono text-xs text-[#5C6C70]">
                IEC 60076-5 · IEC 60255-151
              </div>
            </div>

            <div className="p-6 rounded-[10px] bg-[#FFFDF9] border border-[#DEDACF] space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#147C78]" />
                <div>
                  <h3 className="text-lg font-bold text-[#17282C]">NF C 15-100 & NF C 13-200</h3>
                  <span className="font-mono text-xs text-[#147C78] font-semibold">
                    {isFr ? 'Installations BT & Postes HTA' : 'LV Installations & MV Substations'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#33474B] leading-relaxed">
                {isFr
                  ? "Schémas des liaisons à la terre (TT, TN-S, IT), coupure automatique en cas de défaut d'isolement et dimensionnement des conducteurs de protection."
                  : 'Earthing arrangements (TT, TN-S, IT), automatic fault disconnection times, and protective earth conductor sizing.'}
              </p>
              <div className="p-3 rounded bg-[#F6F4EE] border border-[#DEDACF] font-mono text-xs text-[#5C6C70]">
                {isFr ? 'Temps de coupure max en schéma TN 230/400 V : 0.4 s' : 'Max disconnection time in 230/400 V TN system: 0.4 s'}
              </div>
            </div>

            <div className="p-6 rounded-[10px] bg-[#FFFDF9] border border-[#DEDACF] space-y-3">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[#B8872D]" />
                <div>
                  <h3 className="text-lg font-bold text-[#17282C]">NF C 18-510 · Consignation</h3>
                  <span className="font-mono text-xs text-[#B8872D] font-semibold">
                    B1V, B2V, BR, BC, H1V, H2V, HC
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#33474B] leading-relaxed">
                {isFr
                  ? "Procédure stricte de consignation en 5 étapes : Séparer, Condamner, Identifier, Vérifier l'Absence de Tension (VAT) et Mettre à la Terre et en Court-Circuit (MALT/CC)."
                  : 'Five-step lockout-tagout sequence: Disconnect, Lock, Identify, Verify Absence of Voltage (VAT), and Apply Earthing & Short-Circuit Clamps (MALT/CC).'}
              </p>
              <div className="p-3 rounded bg-[#F6F4EE] border border-[#DEDACF] font-mono text-xs text-[#5C6C70]">
                NF C 18-510 · LOTO / VAT / MALT
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 5: INTERACTIVE FACILITY SCOPE & SIZING ADVISOR
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'ADVISOR' && (
        <div className="rounded-[12px] epede-workbench p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-[#6CC3BD] block">
              {isFr ? 'Pré-Dimensionnement de Site' : 'Facility Scope & Sizing Workbench'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F1E8]">
              {isFr
                ? 'Dimensionnez l’équipement d’une nouvelle installation industrielle'
                : 'Configure primary sizing for an industrial facility'}
            </h2>
          </div>

          {/* Inputs Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div className="space-y-2">
              <label className="text-[#B9C2C0] font-semibold block">
                {isFr ? 'Typologie de Site' : 'Facility Typology'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'factory', label_fr: 'Usine / Cimenterie', label_en: 'Manufacturing' },
                  { id: 'mine', label_fr: 'Mine / Carrière', label_en: 'Mining / Quarry' },
                  { id: 'hospital', label_fr: 'Hôpital Régional', label_en: 'Hospital / ICU' },
                  { id: 'water', label_fr: 'Station d’Eau', label_en: 'Water Utility' },
                ].map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setAdvisorIndustry(ind.id as any)}
                    className={`p-2.5 rounded-lg border text-center transition-colors ${
                      advisorIndustry === ind.id
                        ? 'bg-[#147C78] border-[#6CC3BD] text-[#FFFDF9] font-semibold'
                        : 'bg-[#162227] border-[#2A383C] text-[#B9C2C0] hover:text-[#F4F1E8]'
                    }`}
                  >
                    {isFr ? ind.label_fr : ind.label_en}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="advisor-power-slider" className="text-[#B9C2C0] font-semibold block">
                {isFr ? 'Puissance Appelée :' : 'Apparent Demand:'}{' '}
                <span className="text-[#6CC3BD]">{advisorPowerKVA} kVA</span>
              </label>
              <input
                id="advisor-power-slider"
                type="range"
                min="250"
                max="5000"
                step="250"
                value={advisorPowerKVA}
                onChange={(e) => setAdvisorPowerKVA(Number(e.target.value))}
                className="w-full accent-[#147C78] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8A9694]">
                <span>250 kVA</span>
                <span>2 500 kVA</span>
                <span>5 000 kVA</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#B9C2C0] font-semibold block">
                {isFr ? 'Tension d’Arrivée HTA' : 'MV Utility Incomer'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 20, 33].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAdvisorGridVoltageKV(v)}
                    className={`p-2.5 rounded-lg border text-center transition-colors ${
                      advisorGridVoltageKV === v
                        ? 'bg-[#147C78] border-[#6CC3BD] text-[#FFFDF9] font-semibold'
                        : 'bg-[#162227] border-[#2A383C] text-[#B9C2C0] hover:text-[#F4F1E8]'
                    }`}
                  >
                    {v} kV
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#2A383C] font-mono">
            <div className="p-4 rounded-lg bg-[#162227] border border-[#2A383C]">
              <span className="text-[11px] text-[#B9C2C0] block mb-1">
                {isFr ? 'Transformateur HTA/BT Normalisé' : 'Standard Transformer Rating'}
              </span>
              <div className="text-xl font-bold text-[#6CC3BD]">
                {advisorComputed.standardTrafoKva} kVA
              </div>
              <p className="text-[11px] text-[#8A9694] mt-1">
                {advisorGridVoltageKV} kV / 400 V — Dyn11
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#162227] border border-[#2A383C]">
              <span className="text-[11px] text-[#B9C2C0] block mb-1">
                {isFr ? 'Groupe Électrogène Secours' : 'Emergency Gen-Set Rating'}
              </span>
              <div className="text-xl font-bold text-[#F4F1E8]">
                {advisorComputed.genRecommendedKva} kVA
              </div>
              <p className="text-[11px] text-[#8A9694] mt-1">
                {isFr ? 'Inverseur ATS < 15 s' : 'ATS Transfer < 15 s'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#162227] border border-[#2A383C]">
              <span className="text-[11px] text-[#B9C2C0] block mb-1">
                {isFr ? 'Onduleur Modulaire (UPS)' : 'Online Double-Conversion UPS'}
              </span>
              <div className="text-xl font-bold text-[#6CC3BD]">
                {advisorComputed.upsKva} kVA
              </div>
              <p className="text-[11px] text-[#8A9694] mt-1">
                0 ms · IEC 62040-3 VFI
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#162227] border border-[#2A383C]">
              <span className="text-[11px] text-[#B9C2C0] block mb-1">
                {isFr ? 'Courants Assignés HTA / BT' : 'Nominal Currents MV / LV'}
              </span>
              <div className="text-sm font-bold text-[#F4F1E8]">
                HTA: {advisorComputed.iprimaryA} A
              </div>
              <div className="text-sm font-bold text-[#6CC3BD]">
                BT: {advisorComputed.isecA} A
              </div>
            </div>
          </div>

          {/* Practical Advice Banner */}
          <div className="p-4 rounded-lg bg-[#162227] border border-[#2A383C] text-xs space-y-1">
            <div className="font-mono text-[#6CC3BD] font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>
                {isFr ? 'Prescription Technique Spécifique' : 'Typology Engineering Prescription'}
              </span>
            </div>
            <p className="text-[#B9C2C0] leading-relaxed">
              {advisorIndustry === 'hospital' &&
                (isFr
                  ? 'Hôpital : Schéma IT médicalisé obligatoire (NF C 15-211 / IEC 60364-7-710) pour les blocs opératoires avec transformateurs d’isolement 230/230 V et Contrôleur Permanent d’Isolement (CPI).'
                  : 'Healthcare: Mandatory medical IT earthing system (IEC 60364-7-710) for surgical theatres with 230/230 V isolating transformers and permanent insulation monitoring (IMD).')}
              {advisorIndustry === 'mine' &&
                (isFr
                  ? 'Mine : Démarreurs progressifs ou variateurs moyenne tension requis sur les concasseurs pour limiter les creux de tension sur l’artère 33 kV.'
                  : 'Mining: Soft starters or MV variable frequency drives required on primary crushers to limit voltage sags on the 33 kV feeder.')}
              {advisorIndustry === 'factory' &&
                (isFr
                  ? 'Usine : Batterie automatique de condensateurs avec selfs anti-harmoniques pour maintenir cos φ ≥ 0.93.'
                  : 'Manufacturing: Detuned automatic capacitor bank required to maintain power factor cos φ ≥ 0.93.')}
              {advisorIndustry === 'water' &&
                (isFr
                  ? 'Station de pompage : Filtres actifs d’harmoniques sur les variateurs VFD des pompes pour garantir THD-I < 5%.'
                  : 'Water pumping: Active harmonic filtering on high-power pump VFDs to guarantee input current distortion THD-I < 5%.')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
