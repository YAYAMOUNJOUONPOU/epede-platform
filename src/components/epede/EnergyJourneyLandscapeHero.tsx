// src/components/epede/EnergyJourneyLandscapeHero.tsx
// Cinematic Interactive Landscape & Electrical Energy Flow System for EPEDE
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Gauge, 
  Radio, 
  Compass,
  ArrowRight,
  Sparkles,
  Info,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { engineeringAssets, getEngineeringImageUrl } from '../../services/engineeringAssets';

interface EnergyJourneyLandscapeHeroProps {
  locale: 'fr' | 'en';
  onScrollToScene: (sceneId: string, index: number) => void;
  onNavigateView: (view: string) => void;
}

export interface FlowStageNode {
  id: string;
  sceneId: string;
  sceneIndex: number;
  labelFr: string;
  labelEn: string;
  subtitleFr: string;
  subtitleEn: string;
  voltageClass: string;
  frequency: string;
  lossRatio: string;
  standardRef: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  questionFr: string;
  questionEn: string;
  answerFr: string;
  answerEn: string;
  equipment: { fr: string; en: string }[];
}

export const FLOW_STAGE_NODES: FlowStageNode[] = [
  {
    id: 'stage-gen',
    sceneId: 'scene-03',
    sceneIndex: 2,
    labelFr: '01. PRODUCTION & TURBINES',
    labelEn: '01. GENERATION & TURBINES',
    subtitleFr: 'Conversion électromécanique de l’énergie primaire',
    subtitleEn: 'Electromechanical conversion from water/steam head',
    voltageClass: '15.5 kV AC',
    frequency: '50.00 Hz',
    lossRatio: 'Rendement 94-96%',
    standardRef: 'IEC 60034 / CEI 60034-1',
    xPercent: 10,
    yPercent: 65,
    questionFr: 'D’où vient l’électricité ?',
    questionEn: 'Where does electricity come from?',
    answerFr: 'La chute d’eau ou la détente de vapeur fait tourner la turbine Francis. Le rotor synchrone aimanté induit des tensions sinusoïdales triphasées 15.5 kV dans le stator.',
    answerEn: 'Water kinetic head or steam expansion rotates the Francis turbine. The magnetized synchronous rotor induces balanced 15.5 kV sinusoidal voltages in the stator windings.',
    equipment: [
      { fr: 'Rotor synchrone à pôles saillants', en: 'Salient-pole synchronous rotor' },
      { fr: 'Turbine Francis à directrices orientables', en: 'Francis turbine with adjustable wicket gates' },
      { fr: 'Système d’excitation brushless statique', en: 'Static brushless excitation system' },
    ],
  },
  {
    id: 'stage-stepup',
    sceneId: 'scene-04',
    sceneIndex: 3,
    labelFr: '02. ÉLÉVATION DE TENSION (GSU)',
    labelEn: '02. STEP-UP TRANSFORMATION (GSU)',
    subtitleFr: 'Minimisation radicale des pertes Joule en ligne',
    subtitleEn: 'Radical minimization of line resistive losses',
    voltageClass: '15.5 kV → 225 kV',
    frequency: '50.00 Hz',
    lossRatio: 'Pertes Joule divisées par 210',
    standardRef: 'IEC 60076 / CIGRÉ TB 673',
    xPercent: 28,
    yPercent: 42,
    questionFr: 'Pourquoi transformer la tension ?',
    questionEn: 'Why is voltage stepped up?',
    answerFr: 'À puissance égale (P = √3·U·I·cosφ), élever la tension de 15.5 kV à 225 kV divise le courant par ~14.5. Les pertes par échauffement thermique (R·I²) sont ainsi divisées par plus de 210 !',
    answerEn: 'At constant power (P = √3·U·I·cosφ), stepping voltage from 15.5 kV to 225 kV reduces current by ~14.5×. Transmission heat losses (R·I²) are consequently divided by over 210!',
    equipment: [
      { fr: 'Transformateur de groupe GSU 70 MVA YNd11', en: '70 MVA YNd11 GSU power transformer' },
      { fr: 'Traversées capacitives isolées à l’huile', en: 'Oil-impregnated paper condenser bushings' },
      { fr: 'Relais Buchholz ANSI 63 & Parafoudres ZnO', en: 'ANSI 63 Buchholz gas relay & ZnO surge arresters' },
    ],
  },
  {
    id: 'stage-trans',
    sceneId: 'scene-05',
    sceneIndex: 4,
    labelFr: '03. TRANSPORT TRÈS HAUTE TENSION',
    labelEn: '03. HIGH-VOLTAGE TRANSMISSION',
    subtitleFr: 'Autoroutes électriques aériennes & câbles THT',
    subtitleEn: 'EHV bulk power corridors & overhead bundles',
    voltageClass: '225 kV / 400 kV THT',
    frequency: '50.00 Hz',
    lossRatio: 'Pertes globales < 2.5% sur 300 km',
    standardRef: 'IEC 60826 / IEEE 738',
    xPercent: 50,
    yPercent: 25,
    questionFr: 'Comment voyage l’énergie ?',
    questionEn: 'How does electricity travel over distance?',
    answerFr: 'L’électricité ne circule pas comme de l’eau dans un tuyau : l’énergie voyage sous forme d’onde électromagnétique (vecteur de Poynting S = E × H) guidée autour des conducteurs en faisceau à ~290 000 km/s.',
    answerEn: 'Power does not flow like fluid in a pipe: energy propagates as a guided electromagnetic Poynting wave (S = E × H) around bundle conductors at ~290,000 km/s.',
    equipment: [
      { fr: 'Pylônes métalliques en treillis d’acier galvanisé', en: 'Galvanized steel lattice towers' },
      { fr: 'Faisceaux de conducteurs alliage Almelec (Aster)', en: 'Twin Almelec bundle conductors' },
      { fr: 'Chaînes d’isolateurs composites en silicone & OPGW', en: 'Composite silicone insulator strings & OPGW' },
    ],
  },
  {
    id: 'stage-subs',
    sceneId: 'scene-06',
    sceneIndex: 5,
    labelFr: '04. POSTE SOURCE AIS/GIS & COUPURE',
    labelEn: '04. PRIMARY SUBSTATION AIS/GIS',
    subtitleFr: 'Nœud d’interconnexion, commutation & sécurité',
    subtitleEn: 'Grid interconnect, switching & fault clearance',
    voltageClass: '225 kV → 30 kV HTA',
    frequency: '50.00 Hz',
    lossRatio: 'Pouvoir de coupure 40 kA / < 60 ms',
    standardRef: 'IEC 62271-100 / IEC 61936',
    xPercent: 70,
    yPercent: 44,
    questionFr: 'Que se passe-t-il dans les postes électriques ?',
    questionEn: 'What happens inside substations?',
    answerFr: 'Le poste réoriente les flux d’énergie entre les lignes et abaisse la tension à 30 kV. Ses disjoncteurs SF6 sont capables d’éteindre en moins de 60 ms des arcs électriques intenses de 40 000 ampères.',
    answerEn: 'The substation routes power between circuits and steps down voltage to 30 kV. Its SF6 circuit breakers extinguish violent 40,000-ampere short-circuit plasma arcs in under 60 ms.',
    equipment: [
      { fr: 'Disjoncteur SF6 à autosoufflage 225 kV 40 kA', en: '225 kV 40 kA SF6 puffer circuit breaker' },
      { fr: 'Jeux de barres doubles avec travée de couplage', en: 'Double busbar scheme with bus coupler bay' },
      { fr: 'Relais numériques différentiels IED CEI 61850', en: 'IEC 61850 communicating numerical IEDs' },
    ],
  },
  {
    id: 'stage-distrib',
    sceneId: 'scene-07',
    sceneIndex: 6,
    labelFr: '05. DISTRIBUTION HTA & RÉSEAUX URBAINS',
    labelEn: '05. MEDIUM-VOLTAGE DISTRIBUTION',
    subtitleFr: 'Boucles ouvertes souterraines & artères rurales',
    subtitleEn: 'Subterranean open loops & rural feeders',
    voltageClass: '30 kV / 15 kV HTA',
    frequency: '50.00 Hz',
    lossRatio: 'Reconfiguration automatique < 1 s',
    standardRef: 'IEC 60502-2 / NF C 13-100',
    xPercent: 86,
    yPercent: 62,
    questionFr: 'Comment l’électricité irrigue les villes ?',
    questionEn: 'How does electricity irrigate cities and towns?',
    answerFr: 'En milieu urbain, des câbles souterrains isolés au PRC cheminent en boucle ouverte via des cellules Ring Main Units (RMU). En cas de défaut, le tronçon en panne est isolé sans coupure pour le reste de la ville.',
    answerEn: 'In cities, underground XLPE cables route in open loops through Ring Main Units (RMUs). Upon a feeder fault, automated sectionalizers isolate the faulty section in seconds.',
    equipment: [
      { fr: 'Cellules compactes RMU sous enveloppe métallique', en: 'Metal-enclosed compact Ring Main Units (RMUs)' },
      { fr: 'Câbles unipolaires HTA à écran cuivre & PRC', en: 'Single-core XLPE MV cables with copper shield' },
      { fr: 'Transformateur HTA/BT 630 kVA 30 kV/400 V', en: '630 kVA 30 kV/400 V distribution transformer' },
    ],
  },
  {
    id: 'stage-load',
    sceneId: 'scene-09',
    sceneIndex: 8,
    labelFr: '06. CHARGES UTILES, INDUSTRIE & VIE',
    labelEn: '06. USEFUL WORK, INDUSTRY & SOCIETY',
    subtitleFr: 'La destination finale de l’énergie électrique',
    subtitleEn: 'The ultimate destination of electrical power',
    voltageClass: '400 V Tri / 230 V Mono',
    frequency: '50.00 Hz',
    lossRatio: 'Protection différentielle DDR 30 mA',
    standardRef: 'IEC 60364 / NF C 15-100 / IEEE 519',
    xPercent: 96,
    yPercent: 82,
    questionFr: 'Où se termine le voyage de l’énergie ?',
    questionEn: 'Where does the energy journey conclude?',
    answerFr: 'Le voyage s’achève dans le travail utile : couple mécanique des moteurs industriels, lumière, calcul numérique dans les data centers, froid commercial et recharge rapide des véhicules électriques.',
    answerEn: 'The journey fulfills useful physical work: shaft torque in industrial motors, illumination, computing power in data centers, climate control, and ultra-fast EV charging.',
    equipment: [
      { fr: 'Tableau TGBT avec disjoncteur général ACB et tiroirs MCC', en: 'Main LV Switchboard (TGBT) with ACB and MCC' },
      { fr: 'Variateurs de vitesse VFD à filtres actifs d’harmoniques', en: 'Variable Frequency Drives (VFDs) with active filters' },
      { fr: 'Stations de recharge VE haute puissance 350 kW DC', en: 'High-power 350 kW DC EV charging plazas' },
    ],
  },
];

export const EnergyJourneyLandscapeHero: React.FC<EnergyJourneyLandscapeHeroProps> = ({
  locale,
  onScrollToScene,
  onNavigateView,
}) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const [isAutoTracing, setIsAutoTracing] = useState<boolean>(true);
  const [activePulsePos, setActivePulsePos] = useState<number>(0); // 0.0 - 1.0 progress
  const [activeTab, setActiveTab] = useState<'experience' | 'engineering' | 'physics'>('experience');

  const safeIndex = (typeof selectedNodeIndex === 'number' && selectedNodeIndex >= 0 && selectedNodeIndex < FLOW_STAGE_NODES.length)
    ? selectedNodeIndex
    : 0;
  const selectedNode = FLOW_STAGE_NODES[safeIndex] || FLOW_STAGE_NODES[0];

  // Continuous electrical energy pulse animation
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = Math.max(0, Math.min((currentTime - lastTime) / 1000, 0.1));
      lastTime = currentTime;

      setActivePulsePos((prev) => {
        const speed = isAutoTracing ? 0.08 : 0.04;
        const currentVal = typeof prev === 'number' && !isNaN(prev) ? prev : 0;
        const next = currentVal + delta * speed;
        return next > 1 ? 0 : next;
      });

      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isAutoTracing]);

  // Synchronize active node based on pulse position when auto-tracing is enabled
  useEffect(() => {
    if (!isAutoTracing) return;
    const stageCount = FLOW_STAGE_NODES.length;
    const pulse = typeof activePulsePos === 'number' && !isNaN(activePulsePos) ? Math.max(0, Math.min(activePulsePos, 0.9999)) : 0;
    const targetIdx = Math.max(0, Math.min(Math.floor(pulse * stageCount), stageCount - 1));
    if (targetIdx !== selectedNodeIndex) {
      setSelectedNodeIndex(targetIdx);
    }
  }, [activePulsePos, isAutoTracing, selectedNodeIndex]);

  const handleSelectNode = (idx: number) => {
    setSelectedNodeIndex(idx);
    setIsAutoTracing(false);
  };

  const handleToggleAutoTrace = () => {
    setIsAutoTracing((prev) => !prev);
  };

  const handleDeepDiveScene = () => {
    if (selectedNode) {
      onScrollToScene(selectedNode.sceneId, selectedNode.sceneIndex);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-[#080B11] shadow-2xl p-4 sm:p-8 lg:p-10 text-slate-100 font-sans space-y-8">
      
      {/* Background Cinematic Atmosphere & Grid Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        
        {/* Vector Grid Field */}
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1200 800">
          <defs>
            <pattern id="gridMatrix" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1" fill="#38BDF8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridMatrix)" />
        </svg>
      </div>

      {/* Hero Header & Cinematic Purpose Statement */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 font-mono text-xs shadow-lg">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold tracking-wider uppercase">
              {locale === 'fr' ? 'LE PARCOURS DE L’ÉLECTRICITÉ • 13 SCÈNES' : 'THE JOURNEY OF ELECTRICITY • 13 SCENES'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-mono text-[11px]">CEI 60034 → 60076 → 62271 → 60364</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans leading-tight">
            {locale === 'fr' ? (
              <>
                SUIVEZ LE VOYAGE DE L’ÉNERGIE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-300 to-emerald-400">À TRAVERS LE RÉSEAU</span>
              </>
            ) : (
              <>
                TRACE THE ENERGY FLOW <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-300 to-emerald-400">THROUGH THE POWER SYSTEM</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            {locale === 'fr'
              ? 'Une immersion interactive dans la physique et l’ingénierie du système électrique : de l’eau des barrages à l’alternateur synchrone, par les artères THT 225 kV et postes de coupure SF6, jusqu’aux moteurs industriels et charges citadines.'
              : 'An interactive exploration of power system physics and real-world infrastructure: from hydraulic penstocks and synchronous generators, across 225 kV EHV corridors and SF6 substations, down to industrial drives and urban loads.'}
          </p>
        </div>

        {/* Global Journey Interactive Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggleAutoTrace}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border shadow-lg ${
              isAutoTracing
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/30'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-white'
            }`}
          >
            {isAutoTracing ? <Pause className="h-4 w-4 text-cyan-400" /> : <Play className="h-4 w-4 text-amber-400" />}
            <span>
              {isAutoTracing
                ? (locale === 'fr' ? 'TRAÇAGE ACTIF' : 'TRACING ACTIVE')
                : (locale === 'fr' ? 'TRACER LE FLUX' : 'START TRACING')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onScrollToScene('scene-01', 0)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <span>{locale === 'fr' ? 'COMMENCER L’IMMERSION' : 'ENTER IMMERSION'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CINEMATIC INTERACTIVE ELECTRICAL LANDSCAPE STAGE (THE LIVING GRID) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full rounded-2xl bg-[#06090E] border border-[#1A2333] p-4 sm:p-6 overflow-hidden shadow-2xl">
        
        {/* Landscape Top Bar: Live Flow Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#141C2B] font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-bold text-emerald-400 uppercase tracking-wider">
              {locale === 'fr' ? 'Vecteur d’Onde Actif (Poynting S = E × H)' : 'Active Poynting Wave (S = E × H)'}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">v ≈ 290 000 km/s</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div>
              <span className="text-slate-500 uppercase mr-1.5">{locale === 'fr' ? 'Étape :' : 'Stage :'}</span>
              <span className="font-bold text-white">{(selectedNode?.labelFr || '01').split('.')[0]} / 06</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase mr-1.5">{locale === 'fr' ? 'Régime :' : 'Rating :'}</span>
              <span className="font-bold text-amber-400">{selectedNode?.voltageClass || '15.5 kV'}</span>
            </div>
          </div>
        </div>

        {/* The Visual Continuous Energy Flow Canvas (SVG Landscape) */}
        <div className="relative w-full h-[280px] sm:h-[340px] my-4 select-none">
          <svg viewBox="0 0 1000 360" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              {/* Glowing gradients for transmission conductors */}
              <linearGradient id="flowConductorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.8" />
                <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#0284C7" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#10B981" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
              </linearGradient>

              {/* Energy packet filter glow */}
              <filter id="energyGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ground & Terrain Horizon */}
            <path
              d="M 0 280 Q 200 240 400 270 T 800 250 L 1000 280 L 1000 360 L 0 360 Z"
              fill="#0A0E17"
              stroke="#1E293B"
              strokeWidth="1"
            />

            {/* 1. Generation Dam & Penstock (Left) */}
            <g opacity="0.85">
              <path d="M 0 160 L 90 200 L 90 300 L 0 300 Z" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
              {/* Penstock pipe */}
              <line x1="30" y1="180" x2="100" y2="245" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
              <line x1="30" y1="180" x2="100" y2="245" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
              {/* Powerhouse block */}
              <rect x="90" y="220" width="50" height="60" rx="3" fill="#162032" stroke="#38BDF8" strokeWidth="1" />
              <text x="115" y="255" fill="#38BDF8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">GEN 15 kV</text>
            </g>

            {/* 2. Step-Up Substation GSU */}
            <g opacity="0.9">
              <rect x="250" y="210" width="60" height="70" rx="4" fill="#141B2B" stroke="#F59E0B" strokeWidth="1.5" />
              {/* Transformer coils symbol */}
              <circle cx="270" cy="245" r="12" fill="none" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="290" cy="245" r="12" fill="none" stroke="#38BDF8" strokeWidth="2" />
              {/* Bushings */}
              <line x1="265" y1="210" x2="265" y2="190" stroke="#CBD5E1" strokeWidth="3" />
              <line x1="295" y1="210" x2="295" y2="175" stroke="#CBD5E1" strokeWidth="3" />
              <text x="280" y="295" fill="#F59E0B" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">GSU 225 kV</text>
            </g>

            {/* 3. High-Voltage Transmission Corridor (Lattice Towers) */}
            {[430, 570].map((xTower, idx) => (
              <g key={idx} opacity="0.85">
                {/* Lattice Legs */}
                <line x1={xTower - 20} y1="280" x2={xTower - 5} y2="110" stroke="#64748B" strokeWidth="2" />
                <line x1={xTower + 20} y1="280" x2={xTower + 5} y2="110" stroke="#64748B" strokeWidth="2" />
                {/* Crossarms */}
                <line x1={xTower - 45} y1="130" x2={xTower + 45} y2="130" stroke="#94A3B8" strokeWidth="2.5" />
                <line x1={xTower - 55} y1="160" x2={xTower + 55} y2="160" stroke="#94A3B8" strokeWidth="2.5" />
                {/* Lattice X braces */}
                <line x1={xTower - 15} y1="250" x2={xTower + 12} y2="210" stroke="#334155" strokeWidth="1" />
                <line x1={xTower + 15} y1="250" x2={xTower - 12} y2="210" stroke="#334155" strokeWidth="1" />
                <line x1={xTower - 10} y1="210" x2={xTower + 8} y2="160" stroke="#334155" strokeWidth="1" />
                <line x1={xTower + 10} y1="210" x2={xTower - 8} y2="160" stroke="#334155" strokeWidth="1" />
                {/* Insulators */}
                <line x1={xTower - 40} y1="130" x2={xTower - 40} y2="150" stroke="#38BDF8" strokeWidth="2.5" />
                <line x1={xTower + 40} y1="130" x2={xTower + 40} y2="150" stroke="#38BDF8" strokeWidth="2.5" />
              </g>
            ))}

            {/* 4. Primary Substation AIS/GIS */}
            <g opacity="0.9">
              <rect x="670" y="210" width="70" height="70" rx="4" fill="#0E1626" stroke="#0284C7" strokeWidth="1.5" />
              {/* Breaker symbol & busbars */}
              <line x1="680" y1="225" x2="730" y2="225" stroke="#38BDF8" strokeWidth="2.5" />
              <line x1="680" y1="235" x2="730" y2="235" stroke="#38BDF8" strokeWidth="2.5" />
              <circle cx="705" cy="255" r="8" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
              <text x="705" y="295" fill="#38BDF8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">POSTE 30 kV</text>
            </g>

            {/* 5. Distribution Poles & RMU */}
            <g opacity="0.85">
              <line x1="840" y1="280" x2="840" y2="180" stroke="#64748B" strokeWidth="3" />
              <line x1="825" y1="190" x2="855" y2="190" stroke="#94A3B8" strokeWidth="2" />
              {/* Transformer on pole (H61) */}
              <rect x="830" y="205" width="20" height="25" rx="2" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
              <text x="840" y="295" fill="#10B981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">HTA 30 kV</text>
            </g>

            {/* 6. Useful End Loads: Industry & Urban Buildings */}
            <g opacity="0.9">
              {/* Industrial plant */}
              <polygon points="920,280 920,230 940,245 940,230 960,245 960,280" fill="#161F30" stroke="#F59E0B" strokeWidth="1" />
              {/* Building */}
              <rect x="965" y="200" width="30" height="80" rx="1" fill="#111827" stroke="#38BDF8" strokeWidth="1" />
              {/* EV charger plug symbol */}
              <circle cx="980" cy="290" r="5" fill="#10B981" />
              <text x="960" y="315" fill="#F59E0B" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BT 400 V</text>
            </g>

            {/* Continuous Energy Flow Path Line (Catenary Curves) */}
            <path
              id="powerFlowBackbone"
              d="M 120 240 Q 185 225 265 190 Q 345 150 430 150 Q 500 170 570 150 Q 620 150 680 225 Q 755 240 840 190 Q 900 190 970 240"
              fill="none"
              stroke="url(#flowConductorGrad)"
              strokeWidth="3.5"
              strokeDasharray="6 3"
              className="opacity-90"
            />

            {/* Glowing Traveling Energy Pulse Packets */}
            {[0, 0.25, 0.5, 0.75].map((offset, i) => {
              const pos = (activePulsePos + offset) % 1;
              return (
                <circle
                  key={i}
                  r="6"
                  fill="#38BDF8"
                  filter="url(#energyGlow)"
                  className="transition-all"
                >
                  <animateMotion
                    path="M 120 240 Q 185 225 265 190 Q 345 150 430 150 Q 500 170 570 150 Q 620 150 680 225 Q 755 240 840 190 Q 900 190 970 240"
                    dur="5s"
                    repeatCount="indefinite"
                    begin={`${offset * 5}s`}
                  />
                </circle>
              );
            })}

            {/* Interactive Node Hotspots on SVG */}
            {FLOW_STAGE_NODES.map((node, idx) => {
              const isSelected = idx === selectedNodeIndex;
              // Map percent to SVG coordinates
              const cx = (node.xPercent / 100) * 1000;
              const cy = (node.yPercent / 100) * 360;

              return (
                <g 
                  key={node.id} 
                  className="cursor-pointer transition-transform hover:scale-110" 
                  onClick={() => handleSelectNode(idx)}
                >
                  {/* Outer pulse ring if selected */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="20"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin"
                    />
                  )}
                  {/* Node Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 14 : 10}
                    fill={isSelected ? '#0284C7' : '#0F172A'}
                    stroke={isSelected ? '#38BDF8' : '#64748B'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all shadow-lg"
                  />
                  {/* Center Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill={isSelected ? '#FFFFFF' : '#F59E0B'}
                  />
                  {/* Number label */}
                  <text
                    x={cx}
                    y={cy - 22}
                    textAnchor="middle"
                    fill={isSelected ? '#38BDF8' : '#94A3B8'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {(node?.labelFr || '01').split('.')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Carousel Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-[#141C2B]">
          {FLOW_STAGE_NODES.map((node, idx) => {
            const isSelected = idx === safeIndex;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => handleSelectNode(idx)}
                className={`p-2.5 rounded-xl text-left font-mono transition-all border ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                    : 'bg-[#0A0F17] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400">
                    {(node?.labelFr || '01').split('.')[0]}
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-sky-400 animate-pulse' : 'bg-slate-700'}`} />
                </div>
                <div className="text-[11px] font-bold text-white truncate mt-1">
                  {locale === 'fr' ? ((node?.labelFr || '').split('. ')[1] || node?.labelFr) : ((node?.labelEn || '').split('. ')[1] || node?.labelEn)}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {node.voltageClass}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MULTI-LAYER ENGINEERING INSPECTION CARD FOR ACTIVE STAGE */}
      {/* ========================================================================= */}
      <div className="relative z-10 rounded-2xl bg-[#0B0F18] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Stage Header & Level Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? (selectedNode?.labelFr || '') : (selectedNode?.labelEn || '')}</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">{selectedNode?.voltageClass || ''}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
              {locale === 'fr' ? (selectedNode?.subtitleFr || '') : (selectedNode?.subtitleEn || '')}
            </h3>
          </div>

          {/* 3 Information Levels per Section 21 */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'experience'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? '1. EXPÉRIENCE' : '1. EXPERIENCE'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('engineering')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'engineering'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? '2. ÉQUIPEMENTS' : '2. EQUIPMENT'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('physics')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'physics'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? '3. PHYSIQUE & NORMES' : '3. PHYSICS & NORMS'}
            </button>
          </div>
        </div>

        {/* Tab 1: Experience & Core Visual Question */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-2">
                <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  {locale === 'fr' ? selectedNode.questionFr : selectedNode.questionEn}
                </span>
                <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
                  {locale === 'fr' ? selectedNode.answerFr : selectedNode.answerEn}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">{locale === 'fr' ? 'Performance / Ratio' : 'Loss / Performance'}</span>
                  <span className="font-bold text-emerald-400">{selectedNode.lossRatio}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">{locale === 'fr' ? 'Référentiel Normatif' : 'Governing Standard'}</span>
                  <span className="font-bold text-sky-300 truncate block">{selectedNode.standardRef}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDeepDiveScene}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>{locale === 'fr' ? 'Aller à la Scène Détaillée' : 'Jump to In-Depth Scene'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right: Photographic Authentic Equipment Card */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl relative h-64">
              <img
                src={
                  selectedNode?.id === 'stage-gen'
                    ? getEngineeringImageUrl(engineeringAssets.generation.hydroRunner)
                    : selectedNode?.id === 'stage-stepup'
                    ? getEngineeringImageUrl(engineeringAssets.transformation.powerTransformer)
                    : selectedNode?.id === 'stage-trans'
                    ? getEngineeringImageUrl(engineeringAssets.transmission.corridor)
                    : selectedNode?.id === 'stage-subs'
                    ? getEngineeringImageUrl(engineeringAssets.substations.outdoorAis)
                    : selectedNode?.id === 'stage-distrib'
                    ? getEngineeringImageUrl(engineeringAssets.distribution.rmuSwitchgear)
                    : getEngineeringImageUrl(engineeringAssets.industry.industrialMcc)
                }
                alt={selectedNode?.labelFr || 'Stage Equipment'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 text-xs font-mono text-slate-300 bg-slate-950/85 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-amber-400 font-bold truncate">{selectedNode?.standardRef || ''}</span>
                <span className="text-slate-400 text-[10px] uppercase">{selectedNode?.voltageClass || ''}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Equipment & Systems Highlights */}
        {activeTab === 'engineering' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {selectedNode.equipment.map((eq, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold text-[10px] border border-sky-500/30">
                    COMPOSANT 0{i + 1}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white text-sm">
                  {locale === 'fr' ? eq.fr : eq.en}
                </h4>
                <p className="text-slate-400 text-[11px] font-sans">
                  {locale === 'fr'
                    ? 'Composant critique certifié pour assurer la continuité de service et la robustesse mécanique.'
                    : 'Critical component rated for extreme dielectric integrity and continuous operational uptime.'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Physics Formulas & Standards */}
        {activeTab === 'physics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                {locale === 'fr' ? 'Équation Physique Fondamentale :' : 'Governing Physical Law :'}
              </span>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-sky-300 font-bold text-sm">
                {selectedNode.id === 'stage-gen' && 'e(t) = -N · (dΦ/dt)  ⇒  E_eff = 4.44 · f · N · Φ_max'}
                {selectedNode.id === 'stage-stepup' && 'P_joule = 3 · R · I² = 3 · R · (S / (√3 · U))²'}
                {selectedNode.id === 'stage-trans' && 'P_sil = U² / Z_c  ≈ (225 kV)² / 370 Ω ≈ 136 MW'}
                {selectedNode.id === 'stage-subs' && 'I_cc = U / (√3 · Z_cc)  ⇒  I_p = κ · √2 · I_k"'}
                {selectedNode.id === 'stage-distrib' && 'ΔU = √3 · I · L · (R · cosφ + X · sinφ)'}
                {selectedNode.id === 'stage-load' && 'P = √3 · U · I · cosφ  ;  Q = √3 · U · I · sinφ'}
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                {locale === 'fr'
                  ? 'Gouverne le transfert d’énergie et les tolérances admissibles selon les normes CEI applicables.'
                  : 'Dictates power transfer boundaries and admissible deviations per governing IEC standards.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                {locale === 'fr' ? 'Conformité & Niveaux de Sécurité :' : 'Compliance & Safety Codes :'}
              </span>
              <div className="space-y-1.5 text-slate-300 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Norme CEI :</span>
                  <span className="font-bold text-white">{selectedNode.standardRef}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-500">Fréquence Système :</span>
                  <span className="font-bold text-emerald-400">{selectedNode.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stabilité :</span>
                  <span className="font-bold text-sky-400">Régulation primaire FCR &lt; 200 ms</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
