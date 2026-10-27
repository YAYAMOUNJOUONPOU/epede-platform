// src/components/home/HomeView.tsx
/**
 * EPEDE Homepage — Streamlined 5-Section Architecture
 * Conforms to the 2026 Audit Directives:
 * - Single promise above the fold
 * - Author attribution: Mounjouonpou Yaya, Electrical and Power Systems Engineer
 * - Three primary entry doors: Apprendre (Learn), Calculer (Calculate), Consulter (Look up)
 * - Sourced & unified figures (2,050 MW Cameroon capacity, 39 equipment sheets, 17 calculation engines)
 * - Generous vertical rhythm, no toolbars crowding the viewport, accessible touch targets (>=44px)
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Calculator, 
  Box, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Activity, 
  Zap, 
  MapPin, 
  Sliders, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { StageId } from '../journey/types';
import { EPEDE_AUTHOR, EPEDE_CANONICAL_METRICS } from '../../data/canonicalEngineeringMetrics';
import { AboutAuthorSection } from './AboutAuthorSection';
import { CAMEROON_GRID_SUMMARY, CAMEROON_POWER_PLANTS } from '../../data/cameroonGridData';

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

export const HomeView: React.FC<HomeViewProps> = ({
  locale,
  onSelectDomain,
  onSelectEquipment,
  onNavigateView,
  onOpenSearch,
  onOpenAssistant,
  onNavigateJourney,
  onNavigateStandard,
  onNavigateRole,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateDiagram,
}) => {
  const isFr = locale === 'fr';
  const [activeChainStep, setActiveChainStep] = useState<number>(0);

  const handleOpenJourney = (stageId?: StageId) => {
    if (onNavigateJourney) onNavigateJourney(stageId);
    else onNavigateView('journey');
  };

  const handleOpenCalculator = (tab?: CalculatorTabType) => {
    if (onNavigateCalculator && tab) onNavigateCalculator(tab);
    else onNavigateView('calculators');
  };

  // 5 Canonical Power Chain Steps
  const chainSteps = [
    {
      id: 'generation',
      stageId: 'generation' as StageId,
      stepNumber: '01',
      title: isFr ? 'Production Hydroélectrique' : 'Hydroelectric Generation',
      voltage: '10.5 kV → 225 kV',
      role: isFr 
        ? "Conversion de l'énergie cinétique de l'eau en énergie électrique via hydro-alternateurs à pôles saillants et élévation de tension GSU."
        : "Hydraulic kinetic conversion via salient-pole hydro-generators stepped up via main GSU transformer.",
      keyEquipment: 'Aménagement de Nachtigal / Songloulou (420 MW & 384 MW)',
      domainCode: 'D01' as DomainCode,
      calculatorTab: 'transformer' as CalculatorTabType
    },
    {
      id: 'transmission',
      stageId: 'transmission' as StageId,
      stepNumber: '02',
      title: isFr ? 'Transport & Postes THT' : 'Bulk Transmission & EHV Grid',
      voltage: '225 kV & 90 kV',
      role: isFr 
        ? "Évacuation massive de la puissance électrique sur le Réseau Interconnecté Sud (RIS), jeux de barres, pylônes et disjoncteurs SF6."
        : "Bulk power evacuation across the Southern Interconnected Grid (RIS), SF6 circuit breakers, and 225 kV lines.",
      keyEquipment: 'Postes d’interconnexion Nyom II, Mangombé & Bekoko',
      domainCode: 'D03' as DomainCode,
      calculatorTab: 'sil' as CalculatorTabType
    },
    {
      id: 'transformation',
      stageId: 'substations' as StageId,
      stepNumber: '03',
      title: isFr ? 'Postes Sources de Transformation' : 'Primary Step-Down Substations',
      voltage: '225 kV / 30 kV (HTA)',
      role: isFr 
        ? "Abaissement de la tension de transport national vers l'armature de distribution urbaine avec régleurs en charge (OLTC)."
        : "Step-down from bulk transmission voltage to 30 kV medium-voltage urban distribution with on-load tap changers.",
      keyEquipment: 'Poste Ahala 225/30 kV · Transfo 40/63 MVA',
      domainCode: 'D04' as DomainCode,
      calculatorTab: 'transformer' as CalculatorTabType
    },
    {
      id: 'distribution',
      stageId: 'distribution' as StageId,
      stepNumber: '04',
      title: isFr ? 'Distribution Moyenne Tension (HTA)' : 'Medium-Voltage (MV) Distribution',
      voltage: '30 kV & 15 kV',
      role: isFr 
        ? "Réseaux bouclés ou en antenne, cellules compactes RMU SF6, protection différentielle 87T et postes kiosques 30 kV / 400 V."
        : "Radial and ring distribution networks, SF6 ring main units (RMU), pad-mounted distribution kiosks 30 kV / 400 V.",
      keyEquipment: 'Tableaux RMU 30 kV, Postes Kiosques 630 kVA',
      domainCode: 'D08' as DomainCode,
      calculatorTab: 'voltage-drop' as CalculatorTabType
    },
    {
      id: 'utilization',
      stageId: 'utilization' as StageId,
      stepNumber: '05',
      title: isFr ? 'Distribution Basse Tension & Récepteurs' : 'Low-Voltage & Consumer Loads',
      voltage: '400 V / 230 V (BT)',
      role: isFr 
        ? "Tableaux généraux basse tension (TGBT Forme 4), compensation réactive, démarrage moteur et protection des personnes NF C 15-100."
        : "Main LV switchboards (TGBT), power factor correction capacitors, motor drives, and consumer electrical protection.",
      keyEquipment: 'TGBT 2500 A Forme 4b, Moteurs Asynchrones 250 kW',
      domainCode: 'D09' as DomainCode,
      calculatorTab: 'power' as CalculatorTabType
    }
  ];

  // Selected High-Impact Calculators Showcase
  const featuredCalculators = [
    {
      tab: 'power' as CalculatorTabType,
      title: isFr ? 'Bilan de Puissance & Cos φ' : 'Three-Phase Power & PF',
      standard: 'CEI 60034 / NF C 15-105',
      desc: isFr ? 'Puissances active (P), réactive (Q), apparente (S) et courant assigné sous 400 V ou HT.' : 'Active (P), reactive (Q), apparent power (S), and rated line current under 400 V or MV.'
    },
    {
      tab: 'voltage-drop' as CalculatorTabType,
      title: isFr ? 'Chute de Tension en Ligne' : 'Voltage Drop Calculation',
      standard: 'NF C 15-105 §525',
      desc: isFr ? 'Calcul précis en régime triphasé ou monophasé, vérification du seuil critique de 3% ou 5%.' : 'Three-phase and single-phase calculations, verifying 3% or 5% maximum permissible drop.'
    },
    {
      tab: 'transformer' as CalculatorTabType,
      title: isFr ? 'Court-Circuit & Transfo' : 'Short-Circuit & Trafo Sizing',
      standard: 'CEI 60909-0 §4.3',
      desc: isFr ? 'Calcul des courants de court-circuit symétriques Ik3, impédance de boucle et pouvoir de coupure Icu.' : 'Symmetrical short-circuit Ik3, loop impedance, and required breaker breaking capacity.'
    },
    {
      tab: 'cable-ampacity' as CalculatorTabType,
      title: isFr ? 'Dimensionnement des Câbles' : 'Cable Ampacity Sizing',
      standard: 'CEI 60287 / NF C 15-100',
      desc: isFr ? 'Courant admissible Iz, facteurs de correction de pose, température ambiante et groupement.' : 'Permissible continuous ampacity Iz, derating factors for grouping, ambient temperature, and installation.'
    },
    {
      tab: 'ct-sizing' as CalculatorTabType,
      title: isFr ? 'Dimensionnement des TC' : 'Current Transformer Sizing',
      standard: 'CEI 61869-2 / ANSI C37.110',
      desc: isFr ? 'Vérification de la tension de coude (Vk), résistance de boucle secondaire et risque de saturation.' : 'Knee-point voltage (Vk) verification, secondary loop burden, and transient saturation prevention.'
    },
    {
      tab: 'pfc' as CalculatorTabType,
      title: isFr ? 'Compensation d’Énergie Réactive' : 'Power Factor Correction',
      standard: 'CEI 60831 / Arrêté ARSEL',
      desc: isFr ? 'Dimensionnement de la batterie de condensateurs (kvar) pour relever le cos φ de 0.75 à 0.95+.' : 'Capacitor bank rating (kvar) to elevate operating power factor from 0.75 to target 0.95+.'
    }
  ];

  return (
    <div id="epede-home-root" className="space-y-12 sm:space-y-16 pb-20 font-sans text-slate-100">

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 1 — HERO: ONE PROMISE, THREE DOORS, AUTHOR CREDIT
          ────────────────────────────────────────────────────────────────── */}
      <section 
        aria-label={isFr ? "Accueil et présentation d'EPEDE" : "EPEDE Home & Overview"}
        className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-6 sm:p-12 shadow-2xl overflow-hidden"
      >
        {/* Subtle grid background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          
          {/* Author & Mission Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-slate-200 text-xs font-mono shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-cyan-300">{EPEDE_AUTHOR.name}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 font-medium">{isFr ? EPEDE_AUTHOR.titleFr : EPEDE_AUTHOR.titleEn}</span>
          </div>

          {/* Primary Clear Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {isFr ? (
              <>
                Comprenez et maîtrisez l'ingénierie électrique, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
                  des barrages du Cameroun jusqu'à la prise.
                </span>
              </>
            ) : (
              <>
                Understand and master electrical power engineering, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
                  from Cameroon's dams to the socket.
                </span>
              </>
            )}
          </h1>

          {/* Single Value Proposition */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isFr ? (
              <>
                Une plateforme d'ingénierie rigoureuse articulée autour de <strong>matériels réels</strong>, 
                des <strong>normes CEI/NF/ARSEL</strong> et de <strong>17 calculateurs métier déterministes</strong> vérifiés.
              </>
            ) : (
              <>
                A rigorous power engineering platform built on <strong>real equipment</strong>, 
                recognized <strong>IEC/NF/ARSEL standards</strong>, and <strong>17 deterministic calculation engines</strong>.
              </>
            )}
          </p>

          {/* Search Bar Gateway */}
          <div className="pt-2 max-w-xl mx-auto">
            <div 
              onClick={() => onOpenSearch()}
              className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-slate-400 cursor-pointer shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-mono text-slate-300">
                  {isFr ? 'Rechercher un matériel, une formule, une norme CEI...' : 'Search equipment, formula, IEC standard...'}
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                Ctrl+K
              </kbd>
            </div>
          </div>

          {/* THE THREE DOORS (Apprendre, Calculer, Consulter) */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            
            {/* DOOR 1: APPRENDRE */}
            <a
              href="#/journey"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  handleOpenJourney();
                }
              }}
              className="p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group shadow-lg flex flex-col justify-between select-none"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {isFr ? 'Porte 01 · Parcours Guidé' : 'Door 01 · Guided Journey'}
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {isFr ? 'Apprendre la Chaîne' : 'Learn the Power Chain'}
                  </h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr
                    ? "Suivez le flux de l'énergie de la centrale de Nachtigal ou Songloulou jusqu'au tableau BT du consommateur."
                    : "Follow the complete flow of electrical energy from the hydro plant right down to consumer low-voltage switchgear."}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                <span>{isFr ? 'Démarrer le parcours' : 'Start journey'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </a>

            {/* DOOR 2: CALCULER */}
            <a
              href="#/calculators"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  handleOpenCalculator();
                }
              }}
              className="p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer group shadow-lg flex flex-col justify-between select-none"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {isFr ? 'Porte 02 · 17 Outils Métier' : 'Door 02 · 17 Engineering Tools'}
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {isFr ? 'Calculer & Dimensionner' : 'Calculate & Size'}
                  </h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr
                    ? "Court-circuit CEI 60909, chute de tension, TC, câbles, bilan de puissance et compensation cos φ en un clic."
                    : "IEC 60909 short-circuit, voltage drop, CT saturation, cable ampacity, and power factor correction in one click."}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                <span>{isFr ? 'Ouvrir les solveurs' : 'Open calculation engines'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </a>

            {/* DOOR 3: CONSULTER */}
            <a
              href="#/equipment"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigateView('equipment-list');
                }
              }}
              className="p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer group shadow-lg flex flex-col justify-between select-none"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Box className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                    {isFr ? 'Porte 03 · Référentiel Industriel' : 'Door 03 · Industrial Reference'}
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {isFr ? 'Consulter le Matériel' : 'Look Up Equipment'}
                  </h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr
                    ? "39 fiches techniques certifiées : transformateurs, disjoncteurs SF6, cellules HTA RMU, relais 87T et TGBT."
                    : "39 certified apparatus sheets: power transformers, SF6 circuit breakers, MV RMUs, 87T relays, and switchboards."}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                <span>{isFr ? 'Parcourir le catalogue' : 'Browse apparatus'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </a>

          </div>

          {/* Unified Platform Metrics Strip */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div>
              <div className="text-xl sm:text-2xl font-black text-cyan-400">
                {EPEDE_CANONICAL_METRICS.calculators.totalEngines}
              </div>
              <div className="text-[11px] text-slate-400">
                {isFr ? 'Calculateurs Déterministes' : 'Calculation Engines'}
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {EPEDE_CANONICAL_METRICS.equipment.verifiedCount}
              </div>
              <div className="text-[11px] text-slate-400">
                {isFr ? 'Fiches Matériels Vérifiées' : 'Verified Equipment Sheets'}
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {EPEDE_CANONICAL_METRICS.cameroonGrid.nationalInstalledCapacityMw} MW
              </div>
              <div className="text-[11px] text-slate-400">
                {isFr ? 'Capacité Réseau Cameroun' : 'Cameroon Grid Capacity'}
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-purple-400">
                100% CEI / NF
              </div>
              <div className="text-[11px] text-slate-400">
                {isFr ? 'Normes Référencées' : 'Standards Grounded'}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 2 — THE CANONICAL POWER CHAIN (LA CHAÎNE DE L'ÉNERGIE)
          ────────────────────────────────────────────────────────────────── */}
      <section 
        aria-label={isFr ? "La chaîne complète de l'énergie électrique" : "The Complete Electrical Power Chain"}
        className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              <Zap className="h-4 w-4" />
              <span>{isFr ? 'CHAÎNE ÉLECTROTECHNIQUE CANONIQUE' : 'CANONICAL POWER CHAIN'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isFr ? "De la centrale au récepteur final" : "From Generation to End-Use Load"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFr 
                ? "L'énergie ne s'improvise pas : chaque maillon de tension obéit à des contraintes physiques et normatives strictes."
                : "Each voltage stage conforms to strict physics and international standards, from generation to consumer utilization."}
            </p>
          </div>

          <a
            href="#/journey"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                handleOpenJourney();
              }
            }}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all select-none"
          >
            <span>{isFr ? 'Explorer le schéma interactif' : 'Explore full SLD journey'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Step Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {chainSteps.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveChainStep(idx)}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                activeChainStep === idx
                  ? 'bg-slate-850 border-cyan-400 shadow-md shadow-cyan-950/40 text-white'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="font-mono text-[10px] font-bold text-cyan-400 mb-1">
                ÉTAPE {step.stepNumber}
              </div>
              <div className="font-bold text-xs leading-snug line-clamp-2">
                {step.title}
              </div>
              <div className="font-mono text-[10px] text-slate-400 mt-1">
                {step.voltage}
              </div>
            </button>
          ))}
        </div>

        {/* Active Step Deep-Dive Card */}
        {chainSteps[activeChainStep] && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 md:w-3/4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-xs font-bold">
                  {chainSteps[activeChainStep].voltage}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {chainSteps[activeChainStep].keyEquipment}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {chainSteps[activeChainStep].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {chainSteps[activeChainStep].role}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <a
                href={`#/journey/${chainSteps[activeChainStep].stageId}`}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    handleOpenJourney(chainSteps[activeChainStep].stageId);
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors select-none"
              >
                <span>{isFr ? 'Visualiser cette étape' : 'Explore this stage'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={`#/calculators/${chainSteps[activeChainStep].calculatorTab}`}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    handleOpenCalculator(chainSteps[activeChainStep].calculatorTab);
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-mono text-xs transition-colors select-none"
              >
                <Calculator className="h-3.5 w-3.5 text-cyan-400" />
                <span>{isFr ? 'Calculateur associé' : 'Related calculator'}</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 3 — 17 CORE CALCULATION ENGINES (SOLVEURS DÉTERMINISTES)
          ────────────────────────────────────────────────────────────────── */}
      <section 
        aria-label={isFr ? "Calculateurs d'ingénierie électrotechnique" : "Engineering Calculation Engines"}
        className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              <Calculator className="h-4 w-4" />
              <span>{isFr ? 'SOLVEURS DÉTERMINISTES VÉRIFIÉS' : 'DETERMINISTIC SOLVERS'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isFr ? '17 Calculateurs Dédiés à l’Ingénierie Réseau' : '17 Dedicated Power System Calculators'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFr 
                ? "Formules analytiques exactes selon les normes CEI 60909-0, NF C 15-105 et IEEE. Pas d'estimations opaques : les équations et hypothèses sont transparentes."
                : "Exact analytical equations based on IEC 60909-0, NF C 15-105, and IEEE. Transparent derivations and validated boundaries."}
            </p>
          </div>

          <a
            href="#/calculators"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                handleOpenCalculator();
              }
            }}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all select-none"
          >
            <span>{isFr ? 'Voir les 17 calculateurs' : 'View all 17 engines'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Featured Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCalculators.map((calc) => (
            <a
              key={calc.tab}
              href={`#/calculators/${calc.tab}`}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  handleOpenCalculator(calc.tab);
                }
              }}
              className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between select-none"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">{calc.standard}</span>
                  <Sliders className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {calc.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300 group-hover:text-cyan-400">
                <span>{isFr ? 'Lancer le calcul' : 'Launch engine'}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 4 — CAMEROON POWER GRID OBSERVATORY (CAS RÉEL SOURCÉ)
          ────────────────────────────────────────────────────────────────── */}
      <section 
        aria-label={isFr ? "Observatoire du Réseau Électrique Camerounais" : "Cameroon Power Grid Observatory"}
        className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              <MapPin className="h-4 w-4" />
              <span>{isFr ? 'ÉTUDE DE CAS RÉEL & OBSERVATOIRE' : 'NATIONAL GRID CASE STUDY'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isFr ? 'Le Réseau Interconnecté du Cameroun' : 'The Cameroon Interconnected Power Grid'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFr 
                ? `Données vérifiées et sourcées selon les rapports d'activité SONATREL / ARSEL (${EPEDE_CANONICAL_METRICS.cameroonGrid.sourceDate}).`
                : `Verified national telemetry and topology sourced from official SONATREL / ARSEL records (${EPEDE_CANONICAL_METRICS.cameroonGrid.sourceDate}).`}
            </p>
          </div>

          <a
            href="#/cameroon-grid"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                onNavigateView('cameroon-grid');
              }
            }}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all select-none"
          >
            <span>{isFr ? 'Ouvrir l’Observatoire Réseau' : 'Open Grid Observatory'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Grid Key Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">
              {isFr ? 'Puissance Installée' : 'Installed Capacity'}
            </div>
            <div className="text-2xl font-black text-amber-400">
              {EPEDE_CANONICAL_METRICS.cameroonGrid.nationalInstalledCapacityMw} MW
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {isFr ? 'Hydro + Gaz + Solaire' : 'Hydro + Gas + Solar'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">
              {isFr ? 'Part Hydroélectrique' : 'Hydro Share'}
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {EPEDE_CANONICAL_METRICS.cameroonGrid.hydroSharePercent}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Sanaga (Lom Pangar, Nachtigal)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">
              {isFr ? 'Pointe Maximale' : 'Peak Demand'}
            </div>
            <div className="text-2xl font-black text-cyan-400">
              {EPEDE_CANONICAL_METRICS.cameroonGrid.peakDemandMw} MW
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {isFr ? 'Réseau Interconnecté Sud (RIS)' : 'Southern Grid (RIS)'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">
              {isFr ? 'Lignes de Transport' : 'Transmission Lines'}
            </div>
            <div className="text-2xl font-black text-purple-400">
              {EPEDE_CANONICAL_METRICS.cameroonGrid.transmissionLineKm225kv} km
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Lignes 225 kV SONATREL
            </div>
          </div>
        </div>

        {/* 4 Flagship Hydro Power Plants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EPEDE_CANONICAL_METRICS.cameroonGrid.mainHydroPlants.map((plant) => (
            <div 
              key={plant.name}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">{plant.capacityMw} MW</span>
                <span className="text-slate-400">{plant.voltageKv} kV</span>
              </div>
              <h4 className="font-bold text-white text-sm">
                {plant.name}
              </h4>
              <p className="text-xs text-slate-400 leading-snug">
                {plant.units}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 5 — ABOUT THE AUTHOR, METHODOLOGY & CREDIBILITY
          ────────────────────────────────────────────────────────────────── */}
      <AboutAuthorSection locale={locale} />

    </div>
  );
};
