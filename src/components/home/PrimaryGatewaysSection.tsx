// src/components/home/PrimaryGatewaysSection.tsx
import React, { useState } from 'react';
import { 
  Zap, 
  Box, 
  Building2, 
  Radio, 
  GitBranch, 
  Building, 
  Calculator, 
  FileText, 
  ArrowRight,
  Shield,
  ShieldCheck,
  Layers,
  Compass,
  Activity,
  Network,
  Cpu,
  CheckCircle2,
  Sparkles,
  MapPin,
  Sliders,
  ExternalLink,
  Clock
} from 'lucide-react';

interface PrimaryGatewaysSectionProps {
  locale: 'fr' | 'en';
  onNavigateView: (view: string) => void;
  onSelectDomain: (code: string) => void;
}

interface SpecializedWorkbench {
  id: string;
  view: string;
  tag: string;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  descFr: string;
  descEn: string;
  standardsBadge: string;
  featuresFr: string[];
  featuresEn: string[];
  ctaFr: string;
  ctaEn: string;
  badgeColor: string;
  borderHoverColor: string;
  accentBg: string;
  icon: React.ReactNode;
}

interface GatewayItem {
  id: string;
  category: 'workbenches' | 'power-chain' | 'reference';
  icon: React.ReactNode;
  tag: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  standardsBadge?: string;
  ctaFr: string;
  ctaEn: string;
  color: string;
  action: () => void;
}

export const PrimaryGatewaysSection: React.FC<PrimaryGatewaysSectionProps> = ({
  locale,
  onNavigateView,
  onSelectDomain,
}) => {
  const isFr = locale === 'fr';
  const [activeTab, setActiveTab] = useState<'all' | 'workbenches' | 'power-chain' | 'reference'>('all');

  // 5 Featured Specialized Professional Workbenches (Highlighted Top Shelf)
  const SPECIALIZED_WORKBENCHES: SpecializedWorkbench[] = [
    {
      id: 'sw-knowledge-graph',
      view: 'knowledge-graph',
      tag: isFr ? 'STUDIO SPÉCIALISÉ 01' : 'SPECIALIZED STUDIO 01',
      titleFr: 'Knowledge Graph Explorer',
      titleEn: 'Knowledge Graph Explorer',
      subtitleFr: 'Relations, Protections, SCADA & Causalité',
      subtitleEn: 'Relations, Protections, SCADA & Causality',
      descFr: 'Exploration relationnelle multi-niveaux : connexions amont/aval, protections 87/21/50, défauts FMEA, signaux SCADA, normes et cas réels du réseau camerounais.',
      descEn: 'Multi-tiered graph exploration: upstream/downstream power flow, 87/21/50 protection relays, FMEA failure modes, SCADA points, and Cameroon grid assets.',
      standardsBadge: 'CEI 61850 · CEI 60076 · CEI 62271',
      featuresFr: ['Chaînes causales multi-sauts', 'Filtre 6 types de relations', '3 Niveaux d’usage'],
      featuresEn: ['Multi-Hop Causal Chains', '6 Relation Type Filters', '3 Usage Levels'],
      ctaFr: 'Explorer le Knowledge Graph',
      ctaEn: 'Explore Knowledge Graph',
      badgeColor: 'text-cyan-400 bg-cyan-950/70 border-cyan-500/40',
      borderHoverColor: 'hover:border-cyan-500/60 hover:shadow-cyan-950/30',
      accentBg: 'from-cyan-950/20 to-transparent',
      icon: <Compass className="w-6 h-6 text-cyan-400" />
    },
    {
      id: 'sw-protection',
      view: 'protection',
      tag: isFr ? 'STUDIO SPÉCIALISÉ 02' : 'SPECIALIZED STUDIO 02',
      titleFr: 'Protection Coordination Studio',
      titleEn: 'Protection Coordination Studio',
      subtitleFr: 'Sélectivité & Calculs de Relais ANSI / CEI',
      subtitleEn: 'ANSI / IEC Relay Selectivity & Coordination',
      descFr: 'Tracé interactif des courbes TCC (CEI 60255-151), saturation des TC (ANSI C37.110), plan R-X Distance 21 et différentielle 87 bi-pente.',
      descEn: 'Interactive TCC curves (IEC 60255-151), CT saturation calculator (ANSI C37.110), Distance 21 R-X plane, and 87 differential dual-slope.',
      standardsBadge: 'CEI 60255 · ANSI C37.110',
      featuresFr: ['Courbes TCC normalisées', 'Saturation TC ANSI C37.110', 'Distance 21 & Différentielle 87'],
      featuresEn: ['IEC TCC Curve Generator', 'CT Saturation Analyzer', 'Distance 21 & 87 Differential'],
      ctaFr: 'Lancer le Studio Protection',
      ctaEn: 'Launch Protection Studio',
      badgeColor: 'text-amber-400 bg-amber-950/70 border-amber-500/40',
      borderHoverColor: 'hover:border-amber-500/60 hover:shadow-amber-950/30',
      accentBg: 'from-amber-950/20 to-transparent',
      icon: <Shield className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'sw-commissioning',
      view: 'commissioning',
      tag: isFr ? 'STUDIO SPÉCIALISÉ 03' : 'SPECIALIZED STUDIO 03',
      titleFr: 'Atelier Contrôle FAT / SAT & Réception',
      titleEn: 'FAT / SAT Commissioning Studio',
      subtitleFr: 'Essais Constructeur & Mise en Service',
      subtitleEn: 'Factory & Site Acceptance Testing',
      descFr: 'Protocoles de réception en usine (FAT selon CEI 61439-1) et sur site (SAT selon NF C 15-100 / CEI 60364-6) avec fiches d’essais diélectriques.',
      descEn: 'Factory acceptance testing (FAT per IEC 61439-1) and site acceptance inspection (SAT per IEC 60364-6 / NF C 15-100) with dielectric checklists.',
      standardsBadge: 'CEI 61439-1 · NF C 15-100',
      featuresFr: ['Checklists FAT & SAT normées', 'Registres de serrage & isolement', 'Génération PV de réception'],
      featuresEn: ['Standardized FAT/SAT Checklists', 'Torque & Insulation Registers', 'Formal Handover Certificate'],
      ctaFr: 'Ouvrir l’Atelier FAT / SAT',
      ctaEn: 'Open FAT / SAT Studio',
      badgeColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/40',
      borderHoverColor: 'hover:border-emerald-500/60 hover:shadow-emerald-950/30',
      accentBg: 'from-emerald-950/20 to-transparent',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />
    },
    {
      id: 'sw-context-stack',
      view: 'context-stack',
      tag: isFr ? 'GRAPHE CAUSAL 04' : 'CAUSAL GRAPH 04',
      titleFr: 'Graphe Causal & Context Stack',
      titleEn: 'Causal Graph & Context Stack',
      subtitleFr: 'Topologie Amont / Aval & Traçabilité Multi-Niveaux',
      subtitleEn: 'Upstream / Downstream Causal Topology',
      descFr: 'Moteur de graphe interconnecté traçant les dépendances de puissance, d’automatisme, de protection et de mesure à travers l’écosystème.',
      descEn: 'Graph engine mapping electrical power dependencies, automation interlocks, protection zones, and instrumentation links across the ecosystem.',
      standardsBadge: 'IEC CIM 61970 · Topology Engine',
      featuresFr: ['Relations amont / aval directes', 'Traçabilité des preuves d’ingénierie', 'Historique de navigation persistant'],
      featuresEn: ['Direct Upstream / Downstream Links', 'Engineering Evidence Trail', 'Session Graph Memory'],
      ctaFr: 'Explorer le Graphe Causal',
      ctaEn: 'Explore Causal Graph',
      badgeColor: 'text-cyan-400 bg-cyan-950/70 border-cyan-500/40',
      borderHoverColor: 'hover:border-cyan-500/60 hover:shadow-cyan-950/30',
      accentBg: 'from-cyan-950/20 to-transparent',
      icon: <Network className="w-6 h-6 text-cyan-400" />
    },
    {
      id: 'sw-simulation',
      view: 'simulation',
      tag: isFr ? 'LABORATOIRE NUMÉRIQUE 05' : 'DIGITAL LAB 05',
      titleFr: 'Laboratoire de Simulation & Oscilloscope',
      titleEn: 'Simulation Lab & Live Oscilloscope',
      subtitleFr: 'Transitoires CEI 60909 & Dynamique Réseau',
      subtitleEn: 'IEC 60909 Transients & System Dynamics',
      descFr: '20 bancs de simulation virtuels incluant un oscilloscope DSO 4 voies temps réel, l’analyse harmonique FFT, le démarrage moteur et la stabilité transitoire.',
      descEn: '20 interactive virtual labs featuring real-time 4-channel digital storage oscilloscope, FFT harmonic analysis, motor starting, and stability.',
      standardsBadge: 'CEI 60909 · IEEE 519 · DSO 4-CH',
      featuresFr: ['Oscilloscope DSO 4 canaux temps réel', 'Courants de court-circuit apériodiques', 'Export CSV & rapport de test'],
      featuresEn: ['4-Channel Live Digital Storage Scope', 'DC Decaying Transient Component', 'CSV & Report Export'],
      ctaFr: 'Accéder aux Simulations',
      ctaEn: 'Access Simulation Lab',
      badgeColor: 'text-purple-400 bg-purple-950/70 border-purple-500/40',
      borderHoverColor: 'hover:border-purple-500/60 hover:shadow-purple-950/30',
      accentBg: 'from-purple-950/20 to-transparent',
      icon: <Activity className="w-6 h-6 text-purple-400" />
    }
  ];

  // Full Catalog of Categorized Gateway Cards
  const GATEWAYS: GatewayItem[] = [
    {
      id: 'gw-follow-the-energy',
      category: 'power-chain',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      tag: '00 · PIPELINE INTÉGRÉ',
      titleFr: 'Follow the Energy (8 Étapes / 4 Flux)',
      titleEn: 'Follow the Energy (8 Stages / 4 Flows)',
      descFr: 'Parcourez le réseau de bout en bout en superposant simultanément la Puissance, la Protection, la Commande et les Télécoms SCADA.',
      descEn: 'Traverse the entire grid end-to-end superimposing Power, Protection, Control, and SCADA Telecommunications simultaneously.',
      standardsBadge: '8 Paliers · 4 Flux Cyber-Physiques',
      ctaFr: 'Suivre l’Énergie',
      ctaEn: 'Follow the Energy',
      color: 'amber',
      action: () => onNavigateView('follow-the-energy'),
    },
    {
      id: 'gw-scenarios',
      category: 'workbenches',
      icon: <Clock className="w-6 h-6 text-red-400" />,
      tag: '00 · INCIDENT REPLAY',
      titleFr: 'Scénarios & Incident Replay SCADA',
      titleEn: 'Scenarios & SCADA Incident Replay',
      descFr: '10 incidents physiques rejoués au milliseconde près : court-circuit 225 kV, inrush, saturation TC, îlotage et journal SOE.',
      descEn: '10 physical disturbance scenarios replayed with millisecond accuracy: 225 kV faults, inrush, CT saturation, islanding & SOE log.',
      standardsBadge: '10 Scénarios · SOE 10 ms · COMTRADE',
      ctaFr: 'Rejouer les Incidents',
      ctaEn: 'Replay Incidents',
      color: 'rose',
      action: () => onNavigateView('scenarios'),
    },
    {
      id: 'gw-knowledge-graph',
      category: 'workbenches',
      icon: <Compass className="w-6 h-6 text-cyan-400" />,
      tag: 'KNOWLEDGE GRAPH',
      titleFr: 'Knowledge Graph Explorer',
      titleEn: 'Knowledge Graph Explorer',
      descFr: 'Exploration relationnelle par équipement : amont/aval, protections 87/21, défauts, SCADA, normes et cas camerounais.',
      descEn: 'Relational gear exploration: upstream/downstream flow, 87/21 protection, faults, SCADA, norms and Cameroon grid.',
      standardsBadge: 'CEI 61850 · CEI 60076',
      ctaFr: 'Lancer l’Explorateur',
      ctaEn: 'Launch Explorer',
      color: 'cyan',
      action: () => onNavigateView('knowledge-graph'),
    },
    {
      id: 'gw-journey',
      category: 'power-chain',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      tag: '01 · VALUE CHAIN',
      titleFr: 'Parcours du Système Électrique',
      titleEn: 'Power-System Journey',
      descFr: 'Suivez le voyage continu de l\'électricité de la turbine hydroélectrique au récepteur industriel.',
      descEn: 'Follow the continuous electricity journey from hydro turbines to industrial consumer loads.',
      standardsBadge: 'CEI 60034 · CEI 60076',
      ctaFr: 'Explorer le Parcours',
      ctaEn: 'Explore Journey',
      color: 'amber',
      action: () => onNavigateView('journey'),
    },
    {
      id: 'gw-equipment',
      category: 'reference',
      icon: <Box className="w-6 h-6 text-cyan-400" />,
      tag: '02 · HARDWARE',
      titleFr: 'Référentiel Matériel Électrique',
      titleEn: 'Electrical Equipment Explorer',
      descFr: 'Fiches techniques d\'appareillages HTB/HTA/BT avec photos réelles, plaques signalétiques et vues écorchées.',
      descEn: 'High, medium, and low-voltage apparatus cutaways, nameplates, and verified technical specifications.',
      standardsBadge: '37 Dimensions · 6 Tranches',
      ctaFr: 'Explorer les Équipements',
      ctaEn: 'Explore Equipment',
      color: 'cyan',
      action: () => onNavigateView('equipment-list'),
    },
    {
      id: 'gw-substations',
      category: 'power-chain',
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      tag: '03 · DOMAIN D04',
      titleFr: 'Postes Électriques & Nœuds',
      titleEn: 'Substations & Grid Nodes',
      descFr: 'Postes ouverts AIS et blindés GIS 225/90/30 kV, transformateurs de puissance et jeux de barres.',
      descEn: 'Air-insulated and SF6 gas-insulated substations, power transformers, and busbar topologies.',
      standardsBadge: 'CEI 62271-203 · AIS/GIS',
      ctaFr: 'Explorer les Postes',
      ctaEn: 'Explore Substations',
      color: 'purple',
      action: () => onSelectDomain('D04'),
    },
    {
      id: 'gw-transmission',
      category: 'power-chain',
      icon: <Radio className="w-6 h-6 text-indigo-400" />,
      tag: '04 · DOMAIN D03',
      titleFr: 'Réseaux de Transport HT',
      titleEn: 'Transmission Networks',
      descFr: 'Lignes aériennes 400/225/90 kV, faisceaux de conducteurs, câbles de garde OPGW et pylônes.',
      descEn: 'Overhead 400/225/90 kV transmission lines, conductor bundles, OPGW shield wires, and towers.',
      standardsBadge: 'CEI 60826 · Matrice ABCD',
      ctaFr: 'Explorer le Transport',
      ctaEn: 'Explore Transmission',
      color: 'indigo',
      action: () => onSelectDomain('D03'),
    },
    {
      id: 'gw-distribution',
      category: 'power-chain',
      icon: <GitBranch className="w-6 h-6 text-emerald-400" />,
      tag: '05 · DOMAIN D05',
      titleFr: 'Réseaux de Distribution MT',
      titleEn: 'Distribution Networks',
      descFr: 'Réseaux HTA 30 kV et 15 kV, postes de coupure, cellules RMU et distribution urbaine/rurale.',
      descEn: 'Medium-voltage 30 kV & 15 kV distribution feeders, RMU ring main units, and rural grids.',
      standardsBadge: 'CEI 62271-200 · RMU',
      ctaFr: 'Explorer la Distribution',
      ctaEn: 'Explore Distribution',
      color: 'emerald',
      action: () => onSelectDomain('D05'),
    },
    {
      id: 'gw-installations',
      category: 'power-chain',
      icon: <Building className="w-6 h-6 text-blue-400" />,
      tag: '06 · DOMAIN D06',
      titleFr: 'Installations & Usages Basse Tension',
      titleEn: 'Electrical Installations & LV',
      descFr: 'Tableaux TGBT, régimes de neutre (TT, TN, IT), protections modulaires et charges utiles.',
      descEn: 'LV main switchboards (TGBT), earthing schemes (TT, TN, IT), circuit breakers, and end-uses.',
      standardsBadge: 'CEI 60364 · CEI 61439',
      ctaFr: 'Explorer les Installations',
      ctaEn: 'Explore Installations',
      color: 'blue',
      action: () => onSelectDomain('D06'),
    },
    {
      id: 'gw-calculators',
      category: 'reference',
      icon: <Calculator className="w-6 h-6 text-rose-400" />,
      tag: '07 · TOOLS & SOLVERS',
      titleFr: 'Outils & Calculatrices d\'Ingénierie',
      titleEn: 'Engineering Tools & Solvers',
      descFr: '17 calculatrices conformes CEI/IEEE : Court-circuit 60909, Arc Flash 1584, Câbles, MALT 80.',
      descEn: '17 standard calculation suites: IEC 60909 fault levels, IEEE 1584 arc flash, cable ampacity.',
      standardsBadge: '17 Suites Conformes',
      ctaFr: 'Ouvrir les Calculatrices',
      ctaEn: 'Open Solvers',
      color: 'rose',
      action: () => onNavigateView('calculators'),
    },
    {
      id: 'gw-standards-roles',
      category: 'reference',
      icon: <FileText className="w-6 h-6 text-amber-300" />,
      tag: '08 · GOVERNANCE',
      titleFr: 'Normes & Métiers d\'Ingénierie',
      titleEn: 'Standards & Engineering Roles',
      descFr: 'Référentiel CEI/IEEE, exigences normatives, 35+ fiches métiers et cycle de vie de projet.',
      descEn: 'International IEC/IEEE standards, compliance checklists, 35+ career profiles, and EPC lifecycle.',
      standardsBadge: '35+ Fiches Métiers',
      ctaFr: 'Consulter les Normes',
      ctaEn: 'Explore Standards',
      color: 'amber',
      action: () => onNavigateView('standards'),
    },
    {
      id: 'gw-cameroon-grid',
      category: 'power-chain',
      icon: <MapPin className="w-6 h-6 text-teal-400" />,
      tag: '09 · NATIONAL INFRASTRUCTURE',
      titleFr: 'Réseau Électrique du Cameroun',
      titleEn: 'Cameroon National Grid',
      descFr: 'Cartographie des réseaux interconnectés RIS / RIN, hydroélectricité (Songloulou, Nachtigal) et corridors 225 kV.',
      descEn: 'Mapping of interconnected southern and northern grids (RIS/RIN), hydro plants, and 225 kV corridors.',
      standardsBadge: 'RIS · RIN · SONATREL',
      ctaFr: 'Explorer le Réseau Cameroun',
      ctaEn: 'Explore Cameroon Grid',
      color: 'teal',
      action: () => onNavigateView('cameroon-grid'),
    },
    {
      id: 'gw-sld-diagrams',
      category: 'workbenches',
      icon: <Sliders className="w-6 h-6 text-sky-400" />,
      tag: '10 · CAD SCHEMATICS',
      titleFr: 'Schémas Unifilaires Interactifs (SLD)',
      titleEn: 'Interactive Single Line Diagrams',
      descFr: 'Schémas unifilaires dynamiques avec ruban d’appareillage de poste, états d’organes et repérage ANSI.',
      descEn: 'Dynamic single-line diagrams with substation apparatus ribbon, operating states, and ANSI tagging.',
      standardsBadge: 'AIS / GIS Topologies',
      ctaFr: 'Ouvrir les Schémas SLD',
      ctaEn: 'Open Interactive SLDs',
      color: 'sky',
      action: () => onNavigateView('diagrams'),
    },
    {
      id: 'gw-thematic-journeys',
      category: 'workbenches',
      icon: <Compass className="w-6 h-6 text-indigo-400" />,
      tag: '11 · GUIDED MASTERCLASSES',
      titleFr: 'Parcours Guidés Thématiques',
      titleEn: 'Thematic Guided Journeys',
      descFr: '7 cursus complets avec étapes interactives, quiz de validation, formulations et liens directs vers les outils.',
      descEn: '7 guided curriculums featuring step-by-step progressions, quizzes, formulas, and direct tooling links.',
      standardsBadge: '7 Cursus Pédagogiques',
      ctaFr: 'Choisir un Parcours',
      ctaEn: 'Choose a Journey',
      color: 'indigo',
      action: () => onNavigateView('thematic-journeys'),
    },
    {
      id: 'gw-traceability',
      category: 'reference',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      tag: '12 · DATA PROVENANCE',
      titleFr: 'Données Fiables & Traçabilité',
      titleEn: 'Trust & Provenance Layer',
      descFr: 'Architecture rigoureuse de la preuve : sources réelles SONATREL, formules normées CEI/IEEE et indice de confiance.',
      descEn: 'Rigorous engineering evidence: SONATREL field logs, certified IEC/IEEE formulations, and confidence scores.',
      standardsBadge: 'Preuve & Zéro Boîte Noire',
      ctaFr: 'Auditer les Données',
      ctaEn: 'Audit Data Sources',
      color: 'emerald',
      action: () => onNavigateView('traceability'),
    },
  ];

  const filteredGateways = activeTab === 'all' 
    ? GATEWAYS 
    : GATEWAYS.filter(gw => gw.category === activeTab);

  return (
    <section 
      id="primary-entry-points"
      aria-label="EPEDE Primary Exploration Gateways"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
    >
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
            {isFr ? 'PORTAILS D\'EXPLORATION & BANCS SPÉCIALISÉS' : 'PRIMARY EXPLORATION GATEWAYS & WORKBENCHES'}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight">
          {isFr ? 'Où Souhaitez-vous Commencer ?' : 'Where Would You Like to Begin?'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl font-sans">
          {isFr
            ? 'Accédez directement aux ateliers spécialisés de protection et de contrôle FAT/SAT, au graphe causal amont/aval, aux domaines de puissance et aux référentiels certifiés.'
            : 'Navigate directly to specialized protection and FAT/SAT testing workbenches, upstream/downstream causal topology, power engineering domains, and certified standards.'}
        </p>
      </div>

      {/* 🌟 FEATURED SPECIALIZED WORKBENCHES SHELF (Highlighted) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">
              {isFr ? 'Ateliers & Bancs d\'Ingénierie Avancés' : 'Featured Specialized Engineering Workbenches'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline-block">
            {isFr ? 'Accès direct 1-clic · Outils de calcul & contrôle' : '1-Click Direct Access · Studies & Inspection'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPECIALIZED_WORKBENCHES.map((wb) => (
            <div
              key={wb.id}
              className={`relative rounded-2xl bg-gradient-to-br bg-[#070D18] border border-slate-800/90 ${wb.borderHoverColor} p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl group overflow-hidden`}
            >
              {/* Subtle Ambient Glow */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${wb.accentBg} rounded-full blur-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />

              <div className="space-y-4 relative z-10">
                {/* Header row: Icon, tag, standard badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 group-hover:scale-105 transition-transform shadow-inner">
                      {wb.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider block">
                        {wb.tag}
                      </span>
                      <span className={`inline-block mt-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${wb.badgeColor}`}>
                        {wb.standardsBadge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                    {isFr ? wb.titleFr : wb.titleEn}
                  </h4>
                  <p className="text-xs font-mono text-slate-400 mt-0.5 font-medium">
                    {isFr ? wb.subtitleFr : wb.subtitleEn}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                    {isFr ? wb.descFr : wb.descEn}
                  </p>
                </div>

                {/* Key features pill list */}
                <div className="space-y-1.5 pt-1">
                  {(isFr ? wb.featuresFr : wb.featuresEn).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onNavigateView(wb.view)}
                className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer w-full text-left relative z-10"
              >
                <span className="flex items-center gap-2">
                  <span>{isFr ? wb.ctaFr : wb.ctaEn}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform text-amber-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🧭 CATEGORIZED CATALOG OF PRIMARY GATEWAYS */}
      <div className="space-y-4 pt-4 border-t border-slate-800/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">
              {isFr ? 'Catalogue des Portails de la Plateforme' : 'Platform Exploration Directory'}
            </h3>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFr ? 'Tous (10)' : 'All (10)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('workbenches')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'workbenches'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFr ? 'Ateliers & SLD' : 'Studios & SLD'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('power-chain')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'power-chain'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFr ? 'Chaîne de Puissance' : 'Power Chain'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reference')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'reference'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFr ? 'Calculs & Référentiels' : 'Solvers & Standards'}
            </button>
          </div>
        </div>

        {/* Gateways Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredGateways.map((gw) => (
            <div
              key={gw.id}
              className="group relative rounded-2xl bg-[#090E17] border border-slate-800/90 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-cyan-950/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
                    {gw.icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 tracking-wider">
                    {gw.tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                    {isFr ? gw.titleFr : gw.titleEn}
                  </h4>
                  {gw.standardsBadge && (
                    <span className="inline-block mt-1 text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/50">
                      {gw.standardsBadge}
                    </span>
                  )}
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                    {isFr ? gw.descFr : gw.descEn}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={gw.action}
                className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-slate-300 group-hover:text-amber-400 transition-colors cursor-pointer w-full text-left"
              >
                <span>{isFr ? gw.ctaFr : gw.ctaEn}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
