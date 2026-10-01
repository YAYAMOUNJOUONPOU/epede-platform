// src/components/epede/Epede13ScenesJourney.tsx
// Continuous 13-Scene Electrical Power Engineering Journey for EPEDE
// Preserves 100% of technical content, enriched with cinematic energy flow, multi-layer inspection & hotspots
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  Layers, 
  Building2, 
  Factory, 
  ShieldCheck, 
  Compass, 
  Cpu, 
  Sparkles, 
  BatteryCharging, 
  Car, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Eye,
  Sliders,
  Radio,
  ExternalLink,
  ChevronDown,
  Info,
  Maximize2,
  Gauge,
  HelpCircle
} from 'lucide-react';
import { engineeringAssets, getEngineeringImageUrl } from '../../services/engineeringAssets';
import { InteractiveCircuitBreaker } from './InteractiveCircuitBreaker';
import { EpedeEngineeringNetwork } from './EpedeEngineeringNetwork';
import { EpedeHierarchyDiagram } from './EpedeHierarchyDiagram';
import { EarthingSchemesDiagram } from './EarthingSchemesDiagram';
import { EnergyJourneyLandscapeHero } from './EnergyJourneyLandscapeHero';
import { SceneConduitConnector } from './SceneConduitConnector';
import { SceneHotspotInspector, type EquipmentHotspot } from './SceneHotspotInspector';

interface Epede13ScenesJourneyProps {
  locale: 'fr' | 'en';
  onNavigateView: (view: string) => void;
  onOpenSearch?: () => void;
}

export const Epede13ScenesJourney: React.FC<Epede13ScenesJourneyProps> = ({
  locale,
  onNavigateView,
  onOpenSearch,
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [activeSceneTab, setActiveSceneTab] = useState<Record<string, 'experience' | 'equipment' | 'physics'>>({});

  const getSceneTab = (sceneId: string): 'experience' | 'equipment' | 'physics' => {
    return activeSceneTab[sceneId] || 'experience';
  };

  const setSceneTab = (sceneId: string, tab: 'experience' | 'equipment' | 'physics') => {
    setActiveSceneTab((prev) => ({ ...prev, [sceneId]: tab }));
  };

  const scenes = [
    { id: 'scene-01', num: '01', titleFr: 'Éveil du Système Électrique', titleEn: 'System Awakening', tag: 'OVERVIEW' },
    { id: 'scene-02', num: '02', titleFr: 'Introduction à l’Écosystème EPEDE', titleEn: 'EPEDE 6 Pillars', tag: 'PILLARS' },
    { id: 'scene-03', num: '03', titleFr: 'Production Électrique & Turbines', titleEn: 'Generation & Turbines', tag: '15.5 kV' },
    { id: 'scene-04', num: '04', titleFr: 'Élévation de Tension & GSU', titleEn: 'Step-Up & GSU', tag: '225 kV' },
    { id: 'scene-05', num: '05', titleFr: 'Transport Très Haute Tension', titleEn: 'EHV Transmission', tag: 'THT' },
    { id: 'scene-06', num: '06', titleFr: 'Poste Électrique AIS/GIS & Coupure', titleEn: 'Substation & SF6', tag: 'SWITCHING' },
    { id: 'scene-07', num: '07', titleFr: 'Réseaux de Distribution HTA', titleEn: 'MV Distribution', tag: '30 kV' },
    { id: 'scene-08', num: '08', titleFr: 'Du Réseau à l’Usage Quotidien', titleEn: 'From Grid to Life', tag: '400 V' },
    { id: 'scene-09', num: '09', titleFr: 'Bâtiments, Industrie & Automatisme', titleEn: 'Industry & MCC', tag: 'LOADS' },
    { id: 'scene-10', num: '10', titleFr: 'Réseau Intelligent & Smart Grid', titleEn: 'Smart Grid & SCADA', tag: 'SCADA' },
    { id: 'scene-11', num: '11', titleFr: 'Stockage BESS, Renouvelables & EV', titleEn: 'BESS, RE & EV', tag: 'STORAGE' },
    { id: 'scene-12', num: '12', titleFr: 'Réseau Topologique 21 Domaines', titleEn: '21-Domain Ecosystem', tag: 'NETWORK' },
    { id: 'scene-13', num: '13', titleFr: 'Entrée dans l’Environnement de Savoir', titleEn: 'Knowledge Gateways', tag: 'PORTALS' },
  ];

  const scrollToScene = (id: string, index: number) => {
    setActiveSceneIndex(index);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hotspots definitions for scene photographs
  const generationHotspots: EquipmentHotspot[] = [
    {
      id: 'hs-gen-runner',
      xPercent: 50,
      yPercent: 60,
      labelFr: 'Roue de Turbine Francis',
      labelEn: 'Francis Turbine Runner',
      roleFr: 'Aubes hydrodynamiques forgées en acier inoxydable martensitique 13Cr4Ni.',
      roleEn: 'Martensitic 13Cr4Ni stainless steel hydrodynamic forged runner blades.',
      standardRef: 'IEC 60193 / IEC 60041',
    },
    {
      id: 'hs-gen-shaft',
      xPercent: 50,
      yPercent: 25,
      labelFr: 'Arbre Rotorique & Accouplement',
      labelEn: 'Rotor Shaft & Coupling',
      roleFr: 'Transmet le couple mécanique de 420 MW aux pôles saillants de l’alternateur à 150 tr/min.',
      roleEn: 'Transmits 420 MW mechanical torque to alternator salient poles at 150 rpm.',
      standardRef: 'IEC 60034-1',
    },
    {
      id: 'hs-gen-gate',
      xPercent: 20,
      yPercent: 45,
      labelFr: 'Directrices Orientables (Wicket Gates)',
      labelEn: 'Adjustable Wicket Gates',
      roleFr: 'Modulent le débit volumique Q (m³/s) pour régler la fréquence f(P) en < 200 ms.',
      roleEn: 'Modulates water flow rate Q (m³/s) for primary frequency response f(P).',
      standardRef: 'IEEE 125',
    },
  ];

  const transformerHotspots: EquipmentHotspot[] = [
    {
      id: 'hs-trafo-bushing',
      xPercent: 65,
      yPercent: 18,
      labelFr: 'Traversées Condensateur 225 kV',
      labelEn: '225 kV Condenser Bushings',
      roleFr: 'Isolation huile-papier RIP/OIP avec cône de répartition capacitive de champ électrique.',
      roleEn: 'Oil-impregnated paper capacitive grading for field stress control.',
      standardRef: 'IEC 60137',
    },
    {
      id: 'hs-trafo-buchholz',
      xPercent: 45,
      yPercent: 32,
      labelFr: 'Relais Buchholz ANSI 63',
      labelEn: 'ANSI 63 Buchholz Relay',
      roleFr: 'Détection précoce des dégazages d’arc interne et du flux d’huile vers le conservateur.',
      roleEn: 'Early gas accumulation and oil surge tripping protection.',
      standardRef: 'IEC 60255',
    },
    {
      id: 'hs-trafo-rad',
      xPercent: 20,
      yPercent: 65,
      labelFr: 'Batterie de Radiateurs ONAF',
      labelEn: 'ONAF Radiator Bank',
      roleFr: 'Circulation naturelle d’huile diélectrique et ventilation forcée pour dissiper les pertes.',
      roleEn: 'Mineral oil natural flow with forced air fans for loss dissipation.',
      standardRef: 'IEC 60076-2',
    },
  ];

  const transmissionHotspots: EquipmentHotspot[] = [
    {
      id: 'hs-trans-bundle',
      xPercent: 35,
      yPercent: 45,
      labelFr: 'Conducteurs en Faisceau Almelec',
      labelEn: 'Twin Almelec Bundle Conductors',
      roleFr: 'Augmente le diamètre équivalent pour abaisser le gradient superficiel en-dessous du seuil corona.',
      roleEn: 'Increases equivalent bundle diameter to maintain electric field below corona inception.',
      standardRef: 'IEC 61089',
    },
    {
      id: 'hs-trans-insulator',
      xPercent: 70,
      yPercent: 38,
      labelFr: 'Chaîne d’Isolateurs Composites',
      labelEn: 'Composite Insulator String',
      roleFr: 'Ame en fibre de verre et jupes en silicone résistant aux lignes de fuite et à la pollution.',
      roleEn: 'Fiberglass core with silicone rubber sheds resisting pollution flashover.',
      standardRef: 'IEC 61109',
    },
    {
      id: 'hs-trans-opgw',
      xPercent: 50,
      yPercent: 12,
      labelFr: 'Câble de Garde OPGW',
      labelEn: 'OPGW Shield Wire',
      roleFr: 'Protection foudre couplée à un faisceau de 48 fibres optiques pour téléconduite SCADA.',
      roleEn: 'Lightning shield carrying 48 optical fibers for SCADA teleprotection.',
      standardRef: 'IEEE 1138',
    },
  ];

  const rmuHotspots: EquipmentHotspot[] = [
    {
      id: 'hs-rmu-switch',
      xPercent: 40,
      yPercent: 35,
      labelFr: 'Interrupteur-Sectionneur 3 Positions',
      labelEn: '3-Position Switch-Disconnector',
      roleFr: 'Fonctions Fermé - Ouvert - Terre avec verrouillage mécanique de sécurité inviolable.',
      roleEn: 'Closed - Open - Earth states with mechanical safety interlocking.',
      standardRef: 'IEC 62271-102',
    },
    {
      id: 'hs-rmu-cable',
      xPercent: 50,
      yPercent: 80,
      labelFr: 'Raccordement Connecteurs Séparables',
      labelEn: 'Separable Cable Connectors',
      roleFr: 'Terminaisons embrochables blindées 630 A étanches et sans champ extérieur.',
      roleEn: 'Shielded touch-proof 630 A plug-in elbow terminations.',
      standardRef: 'IEC 60502-4',
    },
  ];

  const mccHotspots: EquipmentHotspot[] = [
    {
      id: 'hs-mcc-drawer',
      xPercent: 30,
      yPercent: 40,
      labelFr: 'Tiroir Débrochable Débit Moteur',
      labelEn: 'Withdrawable Motor Feeder Bucket',
      roleFr: 'Permet le remplacement ou la maintenance sous tension sans coupure du reste du TGBT.',
      roleEn: 'Allows maintenance or unit swapping without busbar shutdown.',
      standardRef: 'IEC 61439-2 Form 4b',
    },
    {
      id: 'hs-mcc-vfd',
      xPercent: 70,
      yPercent: 50,
      labelFr: 'Variateur de Fréquence VFD',
      labelEn: 'Variable Frequency Drive (VFD)',
      roleFr: 'Redresseur IGBT et modulation PWM pour asservir le couple et la vitesse des moteurs.',
      roleEn: 'IGBT active front end with PWM modulation for motor speed control.',
      standardRef: 'IEEE 519 / IEC 61800',
    },
  ];

  return (
    <div className="relative w-full text-slate-100 font-sans space-y-12 sm:space-y-16">
      
      {/* Sticky Journey Navigation Progress Bar */}
      <div className="sticky top-16 z-30 w-full bg-slate-950/95 backdrop-blur-md border-y border-slate-800/90 px-3 sm:px-4 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
              {locale === 'fr' ? 'Parcours Continu (13 Scènes)' : '13-Scene Power Journey'}
            </span>
          </div>

          {/* Quick Scene Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none font-mono text-[11px]">
            {scenes.map((sc, idx) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => scrollToScene(sc.id, idx)}
                className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeSceneIndex === idx
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={locale === 'fr' ? sc.titleFr : sc.titleEn}
              >
                <span>{sc.num}</span>
                <span className="hidden md:inline-block text-[9px] opacity-75 font-normal">
                  {sc.tag}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateView('sld')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 font-mono text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <span>{locale === 'fr' ? 'Schéma SLD' : 'SLD Schematic'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 0. CINEMATIC INTERACTIVE LANDSCAPE HERO (THE LIVING POWER SYSTEM) */}
      {/* ========================================================================= */}
      <EnergyJourneyLandscapeHero
        locale={locale}
        onScrollToScene={scrollToScene}
        onNavigateView={onNavigateView}
      />

      {/* ========================================================================= */}
      {/* SCENE 01: SYSTEM AWAKENING */}
      {/* ========================================================================= */}
      <section 
        id="scene-01" 
        className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 p-6 sm:p-12 lg:p-14 shadow-2xl min-h-[580px] flex flex-col justify-between"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={getEngineeringImageUrl(engineeringAssets.substations.outdoorAis)}
            alt="EPEDE Substation Awakening"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 brightness-75 filter contrast-125"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-radial-at-c from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Top telemetry tag */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 font-mono text-xs shadow-lg">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold tracking-wider">SCENE 01 // SYSTEM AWAKENING</span>
          </div>
          <div className="font-mono text-xs text-slate-400">
            CEI 60034 · CEI 60076 · CEI 62271
          </div>
        </div>

        {/* Central Cinematic Statement */}
        <div className="relative z-10 max-w-3xl my-8 space-y-4">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans leading-tight">
            {locale === 'fr' ? 'L’ÉNERGIE PREND VIE DANS LE RÉSEAU.' : 'THE SYSTEM COMES ALIVE.'}
          </h2>
          <p className="text-base sm:text-xl text-slate-300 font-sans leading-relaxed">
            {locale === 'fr'
              ? 'Des rotors massifs des alternateurs hydroélectriques aux micro-réseaux numériques, explorez l’infrastructure invisible qui alimente les sociétés modernes.'
              : 'From massive hydroelectric alternator rotors to digital microgrids, step inside the interconnected engineering fabric powering modern civilization.'}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToScene('scene-02', 1)}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer"
            >
              <span>{locale === 'fr' ? 'COMMENCER LE PARCOURS TECHNIQUE' : 'EXPLORE THE SYSTEM JOURNEY'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateView('journey')}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{locale === 'fr' ? 'VUE MATRICE PARCOURS' : 'JOURNEY MATRIX VIEW'}</span>
              <ExternalLink className="h-4 w-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Live Grid Physics Hud Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <span className="text-slate-400 block text-[10px] uppercase">{locale === 'fr' ? 'Fréquence Réseau' : 'Grid Frequency'}</span>
            <span className="font-bold text-amber-400 text-sm">50.00 Hz</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <span className="text-slate-400 block text-[10px] uppercase">{locale === 'fr' ? 'Tension THT' : 'EHV Voltage'}</span>
            <span className="font-bold text-white text-sm">225.4 kV</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <span className="text-slate-400 block text-[10px] uppercase">{locale === 'fr' ? 'Puissance Appelée' : 'Dispatched Load'}</span>
            <span className="font-bold text-emerald-400 text-sm">1,240 MW</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
            <span className="text-slate-400 block text-[10px] uppercase">{locale === 'fr' ? 'Statut Téléconduite' : 'SCADA Telemetry'}</span>
            <span className="font-bold text-sky-400 text-sm">CEI 60870-5-104 OK</span>
          </div>
        </div>
      </section>

      {/* Conduit connector 01 -> 02 */}
      <SceneConduitConnector upstreamVoltage="50.00 Hz" downstreamVoltage="6 PALIERS" />

      {/* ========================================================================= */}
      {/* SCENE 02: EPEDE INTRODUCTION (6-LEVEL HIERARCHY) */}
      {/* ========================================================================= */}
      <section 
        id="scene-02" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              SCENE 02 // GLOBAL DESIGN PRINCIPLE
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans">
              {locale === 'fr' ? 'LA PROGRESSION D’INGÉNIERIE EN 6 ÉCHELONS' : 'THE 6-LEVEL ENGINEERING HIERARCHY'}
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl font-mono">
              {locale === 'fr' 
                ? 'Chaque section d’EPEDE répond systématiquement aux 6 piliers fondamentaux de la physique et des normes :'
                : 'Every section of EPEDE systematically resolves the 6 core pillars of power physics and standards :'}
            </p>
          </div>
          <div className="font-mono text-xs text-slate-500">
            ENERGY → SYSTEM → EQUIPMENT → ENGINEERING → DIGITAL → KNOWLEDGE
          </div>
        </div>

        {/* 6 Pillars Flow Grid & Interactive Engineering Hierarchy Diagram */}
        <EpedeHierarchyDiagram locale={locale} />
      </section>

      {/* Conduit connector 02 -> 03 */}
      <SceneConduitConnector upstreamVoltage="ÉNERGIE PRIMAIRE" downstreamVoltage="15.5 kV AC" transformationLabel="CONVERSION" />

      {/* ========================================================================= */}
      {/* SCENE 03: GENERATION */}
      {/* ========================================================================= */}
      <section 
        id="scene-03" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
              SCENE 03 // GENERATION & CONVERSION
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans mt-2">
              {locale === 'fr' ? 'La Source : Conversion Électromécanique' : 'The Source : Electromechanical Conversion'}
            </h2>
          </div>

          {/* Level Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
            <button
              type="button"
              onClick={() => setSceneTab('scene-03', 'experience')}
              className={`px-3 py-1.5 rounded-lg transition-all ${getSceneTab('scene-03') === 'experience' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              {locale === 'fr' ? '1. Expérience' : '1. Experience'}
            </button>
            <button
              type="button"
              onClick={() => setSceneTab('scene-03', 'equipment')}
              className={`px-3 py-1.5 rounded-lg transition-all ${getSceneTab('scene-03') === 'equipment' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              {locale === 'fr' ? '2. Équipements' : '2. Equipment'}
            </button>
            <button
              type="button"
              onClick={() => setSceneTab('scene-03', 'physics')}
              className={`px-3 py-1.5 rounded-lg transition-all ${getSceneTab('scene-03') === 'physics' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              {locale === 'fr' ? '3. CEI 60034' : '3. IEC 60034'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              {locale === 'fr'
                ? 'L’énergie cinétique de l’eau ou de la vapeur entraîne la turbine, transmettant un couple mécanique à l’arbre de l’alternateur synchrone. L’excitation du rotor induit des tensions sinusoïdales triphasées 10.5 kV à 20 kV dans le bobinage statorique.'
                : 'Hydraulic head or thermal kinetic energy drives the turbine, imparting torque to the rotor shaft of the synchronous alternator. DC rotor field excitation induces balanced three-phase sinusoidal voltages (10.5 kV - 20 kV) in the stator windings.'}
            </p>

            <div className="space-y-2 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{locale === 'fr' ? 'Alternateur synchrone à pôles saillants (CEI 60034)' : 'Salient-pole synchronous generator (IEC 60034)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{locale === 'fr' ? 'Régulateur de vitesse hydro (Nachtigal 7x60 MW = 420 MW)' : 'Hydro speed governing (Nachtigal 7x60 MW = 420 MW)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{locale === 'fr' ? 'Inertie mécanique H [s] & réglage primaire f(P)' : 'Mechanical inertia constant H [s] & primary f(P) response'}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateView('hydropower')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>{locale === 'fr' ? 'Jumeau Numérique Hydro' : 'Hydro Digital Twin'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right: Interactive Photographic Equipment Hotspot Inspector */}
          <div className="lg:col-span-6">
            <SceneHotspotInspector
              locale={locale}
              imageUrl={getEngineeringImageUrl(engineeringAssets.generation.hydroRunner)}
              imageAlt="Hydroelectric Turbine Runner"
              captionFr="Turbine Francis Nachtigal (7x60 MW) — Roue & Directrices"
              captionEn="Nachtigal Francis Runner (7x60 MW) — Blades & Wicket Gates"
              hotspots={generationHotspots}
            />
          </div>
        </div>
      </section>

      {/* Conduit connector 03 -> 04 */}
      <SceneConduitConnector upstreamVoltage="15.5 kV" downstreamVoltage="225 kV" transformationLabel="GSU STEP-UP" isTransformationNode />

      {/* ========================================================================= */}
      {/* SCENE 04: VOLTAGE TRANSFORMATION */}
      {/* ========================================================================= */}
      <section 
        id="scene-04" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
              SCENE 04 // VOLTAGE STEP-UP (GSU)
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans mt-2">
              {locale === 'fr' ? 'Élévation : Diminuer les Pertes Joule' : 'Step-Up : Minimizing Joule Losses'}
            </h2>
          </div>

          <div className="font-mono text-xs text-amber-400 font-bold">
            P_joule = 3 · R · (S / (√3 · U))²
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Engineering Photograph with Hotspots */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <SceneHotspotInspector
              locale={locale}
              imageUrl={getEngineeringImageUrl(engineeringAssets.transformation.powerTransformer)}
              imageAlt="EHV Step-Up Transformer"
              captionFr="Transformateur Élévateur GSU 225 kV — YNd11 70 MVA"
              captionEn="225 kV GSU Step-Up Transformer — YNd11 70 MVA"
              hotspots={transformerHotspots}
            />
          </div>

          {/* Right: Engineering Content */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              {locale === 'fr'
                ? 'Pour transporter des centaines de mégawatts sur de longues distances sans chutes de tension prohibitives, la tension est élevée de 15 kV à 225 kV ou 400 kV via le transformateur élévateur GSU. À puissance égale (P = √3·U·I·cosφ), multiplier la tension par 15 divise le courant par 15 et les pertes Joule (R·I²) par 225.'
                : 'To transmit hundreds of megawatts over long corridors without severe voltage drop, power is stepped up from 15 kV to 225 kV or 400 kV via the GSU transformer. At equal power (P = √3·U·I·cosφ), raising voltage by 15 reduces line current by 15 and resistive heat losses (R·I²) by a factor of 225.'}
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-amber-400 font-bold">{locale === 'fr' ? 'Formule Fondamentale des Pertes :' : 'Core Physics Law :'}</div>
              <div className="text-sky-300 font-bold text-sm">P_joule = 3 · R_ligne · (S / (√3 · U_ligne))²</div>
              <div className="text-slate-400 text-[11px]">{locale === 'fr' ? 'Couplage YNd11, protection différentielle 87T et relais Buchholz 63.' : 'YNd11 vector group, 87T differential and ANSI 63 Buchholz gas surge protection.'}</div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateView('calculators')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>{locale === 'fr' ? 'Calculateur Transformateur' : 'Transformer Sizing Calculator'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Conduit connector 04 -> 05 */}
      <SceneConduitConnector upstreamVoltage="225 kV GSU" downstreamVoltage="225 kV LIGNE THT" transformationLabel="TRANSPORT AÉRIEN" />

      {/* ========================================================================= */}
      {/* SCENE 05: HIGH-VOLTAGE TRANSMISSION */}
      {/* ========================================================================= */}
      <section 
        id="scene-05" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
              SCENE 05 // HIGH-VOLTAGE TRANSMISSION
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans mt-2">
              {locale === 'fr' ? 'Les Artères de Transport 225 kV / 400 kV' : 'Transmission Corridors : The EHV Arteries'}
            </h2>
          </div>

          <div className="font-mono text-xs text-sky-400">
            P_sil = U² / Zc ≈ 140 MW
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              {locale === 'fr'
                ? 'Les corridors de transport aériens franchissent des centaines de kilomètres sur pylônes treillis métalliques. Les faisceaux de conducteurs en alliage d’aluminium (Almelec) réduisent le gradient de potentiel électrique à la surface, éliminant ainsi les pertes par effet couronne et les perturbations radioélectriques.'
                : 'Overhead corridors span hundreds of kilometers on lattice steel towers. Bundled conductors (Almelec / ACSR) lower the surface electric field gradient, preventing corona losses and radio frequency interference.'}
            </p>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Puissance Naturelle SIL</span>
                <span className="font-bold text-amber-400">P_sil = U² / Zc ≈ 140 MW</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Protection Ligne</span>
                <span className="font-bold text-slate-200">ANSI 21 (Distance) + 87L</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateView('domain:D03')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>{locale === 'fr' ? 'Explorer Domaine D03 (Lignes THT)' : 'Explore Domain D03 (EHV Lines)'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <SceneHotspotInspector
              locale={locale}
              imageUrl={getEngineeringImageUrl(engineeringAssets.transmission.corridor)}
              imageAlt="Overhead Transmission Lines"
              captionFr="Ligne 225 kV Bekoko - Mangombé (Pylônes Treillis & Faisceaux)"
              captionEn="225 kV Transmission Corridor Bekoko - Mangombe"
              hotspots={transmissionHotspots}
            />
          </div>
        </div>
      </section>

      {/* Conduit connector 05 -> 06 */}
      <SceneConduitConnector upstreamVoltage="225 kV LIGNE" downstreamVoltage="225 kV / 30 kV POSTE" transformationLabel="INTERCONNEXION & COUPURE" />

      {/* ========================================================================= */}
      {/* SCENE 06: SUBSTATION & INTERACTIVE BREAKER */}
      {/* ========================================================================= */}
      <section 
        id="scene-06" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
              SCENE 06 // SUBSTATIONS & SWITCHING
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans">
              {locale === 'fr' ? 'Le Poste Électrique : Nœud de Manœuvre & de Coupure' : 'The Substation : Switching & Fault Interruption'}
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl font-sans">
              {locale === 'fr'
                ? 'Le poste électrique interconnecte les lignes et assure la coupure des courants de court-circuit via les disjoncteurs SF6. Testez ci-dessous l’ouverture et la fermeture d’une travée pour observer l’interruption du flux de puissance.'
                : 'The substation coordinates busbar interconnects and safely interrupts intense short-circuit fault currents via SF6 puffer breakers. Test the interactive breaker below to observe direct power flow interruption.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateView('domain:D04')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 shrink-0"
            >
              <span>{locale === 'fr' ? 'Explorer Poste D04 →' : 'Explore Substation D04 →'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateView('diagrams')}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-xs font-mono text-amber-400 transition-all shrink-0 cursor-pointer"
            >
              {locale === 'fr' ? 'Schéma Poste Détaillé →' : 'Detailed Substation View →'}
            </button>
          </div>
        </div>

        {/* Embedded Interactive Circuit Breaker Module */}
        <InteractiveCircuitBreaker
          locale={locale}
          bayName="TR-225-BAY-01"
          voltageRating="225 kV"
          ratedBreakingCurrent="40 kA"
        />
      </section>

      {/* Conduit connector 06 -> 07 */}
      <SceneConduitConnector upstreamVoltage="225 kV POSTE" downstreamVoltage="30 kV HTA" transformationLabel="ABAISSEMENT RÉPARTITION" isTransformationNode />

      {/* ========================================================================= */}
      {/* SCENE 07: DISTRIBUTION */}
      {/* ========================================================================= */}
      <section 
        id="scene-07" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
              SCENE 07 // MEDIUM-VOLTAGE DISTRIBUTION
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans mt-2">
              {locale === 'fr' ? 'Distribution HTA : Le Réseau Urbain & Rural' : 'Medium-Voltage Distribution : Urban & Rural'}
            </h2>
          </div>
          <div className="font-mono text-xs text-emerald-400">
            NF C 13-100 / CEI 60502-2
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <SceneHotspotInspector
              locale={locale}
              imageUrl={getEngineeringImageUrl(engineeringAssets.distribution.rmuSwitchgear)}
              imageAlt="Distribution RMU Switchgear"
              captionFr="Cellules RMU Boucle Ouverte (30 kV / 630 A)"
              captionEn="30 kV Ring Main Unit (RMU) Open Loop"
              hotspots={rmuHotspots}
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              {locale === 'fr'
                ? 'La tension est abaissée à 30 kV ou 15 kV (HTA) pour irriguer les agglomérations et zones industrielles. Les réseaux urbains sont câblés en souterrain en boucle ouverte avec cellules Ring Main Units (RMU), tandis que les réseaux ruraux utilisent des lignes aériennes avec reclosers et transformateurs sur poteau H61.'
                : 'Substations step down voltage to 30 kV or 15 kV (MV) to irrigate metropolitan and rural zones. Urban grids run subterranean open loops with compact Ring Main Units (RMUs), while rural feeders employ overhead reclosers and pole-mounted H61 transformers.'}
            </p>

            <div className="space-y-2 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{locale === 'fr' ? 'Architecture Boucle Ouverte (Reconfiguration en < 1s)' : 'Open-loop topology with automatic sectionalizing'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{locale === 'fr' ? 'Régime de neutre compensé par bobine de Petersen' : 'Compensated earthing with Petersen tuned resonance coil'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateView('domain:D05')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>{locale === 'fr' ? 'Explorer Distribution D05' : 'Explore Distribution D05'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Conduit connector 07 -> 08 */}
      <SceneConduitConnector upstreamVoltage="30 kV HTA" downstreamVoltage="400 V / 230 V BT" transformationLabel="TRANSFO HTA/BT" isTransformationNode />

      {/* ========================================================================= */}
      {/* SCENE 08: FROM GRID TO LIFE */}
      {/* ========================================================================= */}
      <section 
        id="scene-08" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
            SCENE 08 // FROM GRID TO LIFE
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans">
            {locale === 'fr' ? 'L’Abaissement Final : 400 V Triphasé / 230 V Monophasé' : 'Final Step-Down : 400 V Three-Phase / 230 V Single-Phase'}
          </h2>
          <p className="text-slate-300 text-sm max-w-3xl font-sans leading-relaxed">
            {locale === 'fr'
              ? 'Le transformateur HTA/BT abaisse l’électricité au niveau consommateur. C’est ici que la protection des personnes entre en jeu avec les schémas de liaison à la terre (SLT : TT, TN-S, TN-C, IT) et les dispositifs différentiels résiduels (DDR 30 mA).'
              : 'The MV/LV distribution transformer delivers usable voltages to end consumers. Personnel protection becomes paramount through earthing schemes (TT, TN-S, TN-C, IT) and residual current devices (RCD 30 mA per IEC 60364).'}
          </p>
        </div>

        {/* Interactive Electrical Engineering Schematic of Earthing Systems (TT, TN-S, TN-C, IT) */}
        <EarthingSchemesDiagram locale={locale} />
      </section>

      {/* Conduit connector 08 -> 09 */}
      <SceneConduitConnector upstreamVoltage="400 V BT" downstreamVoltage="TGBT / MOTEURS MCC" transformationLabel="DISTRIBUTION TERMINALE" />

      {/* ========================================================================= */}
      {/* SCENE 09: BUILDINGS, INDUSTRY & AUTOMATION */}
      {/* ========================================================================= */}
      <section 
        id="scene-09" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
              SCENE 09 // INDUSTRY & MCC
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans mt-2">
              {locale === 'fr' ? 'Usines, Moteurs & Tableaux TGBT' : 'Industrial Loads, Motor Control & MCCs'}
            </h2>
          </div>
          <div className="font-mono text-xs text-amber-400">
            CEI 61439-2 Form 4b / IEEE 519
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              {locale === 'fr'
                ? 'Dans les usines et complexes tertiaires, les Tableaux Généraux Basse Tension (TGBT) et centres de commande de moteurs (MCC) alimentent des charges lourdes. Les variateurs de fréquence (VFD) modulent la vitesse des moteurs mais injectent des harmoniques qu’il convient de filtrer per IEEE 519.'
                : 'In manufacturing plants and large facilities, Low Voltage Main Switchboards (TGBT) and Motor Control Centers (MCC) feed critical rotating machinery. Variable Frequency Drives (VFDs) modulate motor torque while introducing harmonic currents mitigated via IEEE 519 active filters.'}
            </p>

            <button
              type="button"
              onClick={() => onNavigateView('installations')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>{locale === 'fr' ? 'Installations Industrielles' : 'Industrial Installations View'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="lg:col-span-6">
            <SceneHotspotInspector
              locale={locale}
              imageUrl={getEngineeringImageUrl(engineeringAssets.industry.industrialMcc)}
              imageAlt="Motor Control Center Panel"
              captionFr="Tableau TGBT & Tiroirs Débrochables MCC (Form 4b)"
              captionEn="LV Switchgear & Withdrawable MCC (Form 4b)"
              hotspots={mccHotspots}
            />
          </div>
        </div>
      </section>

      {/* Conduit connector 09 -> 10 */}
      <SceneConduitConnector upstreamVoltage="FLUX DE PUISSANCE" downstreamVoltage="SUPERVISION NUMÉRIQUE" transformationLabel="CEI 61850 FIBRE" />

      {/* ========================================================================= */}
      {/* SCENE 10: INTELLIGENT GRID & SCADA */}
      {/* ========================================================================= */}
      <section 
        id="scene-10" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
              SCENE 10 // INTELLIGENT GRID & IEC 61850
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans mt-2">
              {locale === 'fr' ? 'Le Cerveau Numérique : CEI 61850 & SCADA' : 'The Digital Brain : IEC 61850 & SCADA'}
            </h2>
          </div>
          <div className="font-mono text-xs text-sky-400">
            GOOSE &lt; 3 ms / IEEE 1588v2 PTP
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <SceneHotspotInspector
              locale={locale}
              imageUrl={getEngineeringImageUrl(engineeringAssets.automation.scadaControlRoom)}
              imageAlt="SCADA Control Room"
              captionFr="Centre de Conduite Réseau SCADA / EMS (Télémesures & Télécommandes)"
              captionEn="National Grid SCADA Dispatch Center (EMS / Telemetry)"
            />
          </div>

          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              {locale === 'fr'
                ? 'Fini le câblage filaire point à point. Les relais numériques de protection IED échangent des messages horizontaux rapides GOOSE (< 3 ms) et des valeurs échantillonnées (Sampled Values) sur fibre optique per CEI 61850. Le SCADA supervise l’état du réseau en temps réel avec horodatage nanoseconde IEEE 1588v2.'
                : 'Replacing dense copper control bundles, communicating digital IEDs exchange sub-3-millisecond GOOSE peer-to-peer messages and Process Bus Sampled Values over fiber. The EMS/SCADA architecture provides dynamic state estimation synchronized via IEEE 1588v2 Precision Time Protocol.'}
            </p>

            <button
              type="button"
              onClick={() => onNavigateView('cameroon-grid')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>{locale === 'fr' ? 'Réseau Électrique Camerounais' : 'Cameroon Grid Architecture'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Conduit connector 10 -> 11 */}
      <SceneConduitConnector upstreamVoltage="RÉSEAU SYNCHRONE" downstreamVoltage="STOCKAGE & INERTIE SYNTHÉTIQUE" transformationLabel="BESS 4Q" />

      {/* ========================================================================= */}
      {/* SCENE 11: STORAGE, RENEWABLES & EV */}
      {/* ========================================================================= */}
      <section 
        id="scene-11" 
        className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-12 shadow-xl space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
              SCENE 11 // STORAGE, RENEWABLES & EV
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-sans mt-2">
              {locale === 'fr' ? 'Stockage BESS, Énergies Vertes & Recharge EV' : 'Battery Storage, Renewables & High-Power EV'}
            </h2>
          </div>
          <div className="font-mono text-xs text-emerald-400">
            FCR &lt; 500 ms / 350 kW DC
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              {locale === 'fr'
                ? 'L’intermittence du solaire et de l’éolien est stabilisée par des parcs de batteries conteneurisées (BESS LFP). Leurs onduleurs 4 quadrants fournissent de l’inertie synthétique (Grid-Forming) et réagissent en moins de 200 ms aux variations de fréquence, tout en soutenant l’essor des stations de recharge ultra-rapide 350 kW.'
                : 'Intermittent PV and wind feeds are cushioned by containerized battery systems (BESS). Bi-directional grid-forming inverters provide synthetic inertia, restoring grid frequency in under 200 ms while supporting high-power 350 kW DC charging plazas.'}
            </p>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Régulation FCR</span>
                <span className="font-bold text-emerald-400">&lt; 500 ms réponse pleine</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Chargeurs EV HPC</span>
                <span className="font-bold text-amber-400">350 kW DC / 1000 V</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <SceneHotspotInspector
              locale={locale}
              imageUrl={getEngineeringImageUrl(engineeringAssets.storageAndEv.bessContainer)}
              imageAlt="BESS Battery Storage"
              captionFr="Stockage Batteries BESS Utility-Scale (Conteneurs LFP & Onduleurs 4Q)"
              captionEn="Utility-Scale BESS Installation (LFP Containers & Inverters)"
            />
          </div>
        </div>
      </section>

      {/* Conduit connector 11 -> 12 */}
      <SceneConduitConnector upstreamVoltage="SYSTÈME PHYSIQUE" downstreamVoltage="TOPOLOGIE GLOBALE 21 DOMAINES" transformationLabel="SYNTHÈSE" />

      {/* ========================================================================= */}
      {/* SCENE 12: COMPLETE EPEDE 21-DOMAIN ECOSYSTEM */}
      {/* ========================================================================= */}
      <section id="scene-12">
        <EpedeEngineeringNetwork 
          locale={locale} 
          onNavigateView={onNavigateView} 
        />
      </section>

      {/* Conduit connector 12 -> 13 */}
      <SceneConduitConnector upstreamVoltage="ARCHITECTURE RÉSEAU" downstreamVoltage="PORTAILS D'INGÉNIERIE" transformationLabel="SAVOIR & CAD" />

      {/* ========================================================================= */}
      {/* SCENE 13: ENTER THE KNOWLEDGE ENVIRONMENT */}
      {/* ========================================================================= */}
      <section 
        id="scene-13" 
        className="rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 p-8 sm:p-14 lg:p-16 shadow-2xl text-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>SCENE 13 // ENTER THE KNOWLEDGE ENVIRONMENT</span>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-sans tracking-tight">
            {locale === 'fr' ? 'ENTREZ DANS L’ENVIRONNEMENT DE SAVOIR' : 'ENTER THE KNOWLEDGE ENVIRONMENT'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-mono leading-relaxed">
            {locale === 'fr'
              ? 'Accédez directement aux calculateurs de dimensionnement CEI, à l’éditeur unifilaire SLD, au référentiel des 21 domaines et aux standards internationaux.'
              : 'Directly access engineering sizing engines, single-line SLD CAD diagrams, the 21 connected domains, and the global IEC/IEEE standards repository.'}
          </p>
        </div>

        {/* 4 Core Gateways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left font-mono">
          <button
            type="button"
            onClick={() => onNavigateView('calculators')}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500 transition-all group space-y-3 shadow-lg cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit group-hover:scale-110 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-white uppercase">{locale === 'fr' ? 'Calculateurs CEI' : 'IEC Calculators'}</h3>
            <p className="text-slate-400 text-xs font-sans">Icc CEI 60909, câbles, transformateurs, terre IEEE 80, chutes de tension.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateView('sld')}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500 transition-all group space-y-3 shadow-lg cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit group-hover:scale-110 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-white uppercase">{locale === 'fr' ? 'Schéma SLD CAD' : 'SLD Schematic'}</h3>
            <p className="text-slate-400 text-xs font-sans">Visualisation unifilaire interactive de la production au TGBT basse tension.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateView('domains')}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500 transition-all group space-y-3 shadow-lg cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-white uppercase">{locale === 'fr' ? '21 Domaines EPEDE' : '21 Domains'}</h3>
            <p className="text-slate-400 text-xs font-sans">Fiches approfondies, abaques, nomenclatures matériel et retours d'expérience.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateView('standards')}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500 transition-all group space-y-3 shadow-lg cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-white uppercase">{locale === 'fr' ? 'Normes CEI / IEEE' : 'IEC / IEEE Standards'}</h3>
            <p className="text-slate-400 text-xs font-sans">Base de données normative indexée par famille d'équipements et niveau de tension.</p>
          </button>
        </div>
      </section>

    </div>
  );
};
