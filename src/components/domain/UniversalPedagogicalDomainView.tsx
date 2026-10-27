// src/components/domain/UniversalPedagogicalDomainView.tsx
// Universal 6-Part Pedagogical Architecture View (Sections A to F) for EPEDE Domains
import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Eye, 
  GitBranch, 
  Calculator, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Cpu, 
  AlertTriangle,
  ChevronRight,
  BookOpen,
  MapPin,
  Flame,
  Info
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import { DOMAIN_PEDAGOGICAL_FRAMEWORK_REGISTRY } from './domainPedagogicalContentRegistry';

interface UniversalPedagogicalDomainViewProps {
  domainCode: DomainCode;
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
  onNavigateView?: (view: string, param?: string) => void;
  onNavigateCalculator?: (tab: CalculatorTabType, context?: any) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onSwitchToAdvancedWorkbench?: () => void;
}

export const UniversalPedagogicalDomainView: React.FC<UniversalPedagogicalDomainViewProps> = ({
  domainCode,
  locale,
  onSelectEquipment,
  onNavigateView,
  onNavigateCalculator,
  onNavigateSimulation,
  onSwitchToAdvancedWorkbench,
}) => {
  const isFr = locale === 'fr';
  const data = DOMAIN_PEDAGOGICAL_FRAMEWORK_REGISTRY[domainCode];

  // Active topic for Section E formulas
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);

  if (!data) {
    return (
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {isFr ? 'Parcours Pédagogique en cours de finalisation' : 'Pedagogical Framework under completion'}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {isFr 
            ? `Le cadre pédagogique pour le domaine ${domainCode} est en cours de structuration. Vous pouvez accéder directement au banc d'ingénierie avancé.`
            : `The pedagogical framework for domain ${domainCode} is being finalized. You can access the advanced workbench directly.`}
        </p>
        {onSwitchToAdvancedWorkbench && (
          <button
            type="button"
            onClick={onSwitchToAdvancedWorkbench}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors"
          >
            {isFr ? 'Ouvrir le Banc d\'Ingénierie Avancé' : 'Open Advanced Engineering Workbench'}
          </button>
        )}
      </div>
    );
  }

  const { sectionA, sectionB, sectionC, sectionD, sectionE, sectionF } = data;
  const activeTopic = sectionE[activeTopicIndex] || sectionE[0];

  return (
    <div className="space-y-12">
      {/* ───────────────────────────────────────────────────────────────────────
          ANCHOR JUMP BAR & WORKBENCH SHORTCUT
         ─────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400 font-bold px-1 hidden sm:inline">
            {isFr ? 'Sections :' : 'Sections:'}
          </span>
          <a
            href="#section-a"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700/80 transition-colors"
          >
            A. {isFr ? 'Système' : 'System'}
          </a>
          <a
            href="#section-b"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700/80 transition-colors"
          >
            B. Architecture
          </a>
          <a
            href="#section-c"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700/80 transition-colors"
          >
            C. {isFr ? 'Matériels' : 'Equipment'}
          </a>
          <a
            href="#section-d"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 border border-slate-200 dark:border-slate-700/80 transition-colors"
          >
            D. {isFr ? 'Cycle de Vie' : 'Lifecycle'}
          </a>
          <a
            href="#section-e"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700/80 transition-colors"
          >
            E. {isFr ? 'Calculs' : 'Calculations'}
          </a>
          <a
            href="#section-f"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700/80 transition-colors"
          >
            F. {isFr ? 'Normes' : 'Standards'}
          </a>
        </div>

        {onSwitchToAdvancedWorkbench && (
          <button
            type="button"
            onClick={onSwitchToAdvancedWorkbench}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all shadow-sm"
          >
            <span>{isFr ? 'Accéder au Banc d\'Ingénierie Avancé' : 'Switch to Advanced Workbench'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL A : COMPRENDRE LE SYSTÈME (UNDERSTAND THE SYSTEM)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-a" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-black text-sm">
            A
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFr ? 'Comprendre le Système · Rôle & Périmètre Fonctionnel' : 'Understand the System · Role & Functional Scope'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isFr ? sectionA.roleFr : sectionA.roleEn}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Entrées */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>{isFr ? '1. Entrées (Sources & Flux)' : '1. Inputs (Sources & Inflows)'}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? sectionA.inputsFr.title : sectionA.inputsEn.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr ? sectionA.inputsFr.desc : sectionA.inputsEn.desc}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {isFr ? sectionA.inputsFr.voltage : sectionA.inputsEn.voltage}
            </div>
          </div>

          {/* Processus */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{isFr ? '2. Transformation & Traitement' : '2. Transformation & Processing'}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? sectionA.processFr.title : sectionA.processEn.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr ? sectionA.processFr.desc : sectionA.processEn.desc}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {isFr ? sectionA.processFr.note : sectionA.processEn.note}
            </div>
          </div>

          {/* Sorties */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isFr ? '3. Sorties & Interconnexion' : '3. Outputs & Interconnection'}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isFr ? sectionA.outputsFr.title : sectionA.outputsEn.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFr ? sectionA.outputsFr.desc : sectionA.outputsEn.desc}
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {isFr ? sectionA.outputsFr.earthing : sectionA.outputsEn.earthing}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL B : EXPLORER L'ARCHITECTURE (EXPLORE THE ARCHITECTURE)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-b" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-black text-sm">
              B
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Explorer l\'Architecture · Topologies & Schémas Types' : 'Explore Architecture · Topologies & System Layouts'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr ? sectionB.summaryFr : sectionB.summaryEn}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onNavigateView?.('diagrams')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>{isFr ? 'Schémas Synoptiques' : 'Synoptic Diagrams'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Architecture Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectionB.architectures.map((arch, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">
                  {isFr ? arch.nameFr : arch.nameEn}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {arch.standard}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isFr ? arch.techFr : arch.techEn}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isFr ? arch.descFr : arch.descEn}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold">
                  {isFr ? arch.metricFr : arch.metricEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL C : RECONNAÎTRE LES MATÉRIELS (RECOGNIZE EQUIPMENT)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-c" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">
              C
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Reconnaître les Matériels · Équipements Clés & Clés Visuelles' : 'Recognize Equipment · Key Physical Assets & Visual Cues'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr
                  ? 'Fiches concrètes avec photographies industrielles vérifiées, symboles normalisés et caractéristiques électriques assignées.'
                  : 'Practical asset cards with verified industrial photographs, standard schematic symbols, and rated parameters.'}
              </p>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED_TECHNICAL_PHOTO</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectionC.map((eq) => (
            <div
              key={eq.id}
              className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-emerald-500/50 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={eq.imgUrl}
                    alt={isFr ? eq.nameFr : eq.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                    {eq.symbol}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-sm text-[10px] font-mono text-slate-300 flex items-center justify-between">
                    <span>{eq.standard}</span>
                    <span className="text-emerald-400">PHOTO REPRÉSENTATIVE</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {eq.voltage}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {isFr ? eq.nameFr : eq.nameEn}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {isFr ? eq.roleFr : eq.roleEn}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectEquipment?.(eq.id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <span>{isFr ? 'Fiche Matériel' : 'View Specs'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                {eq.calcTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateCalculator?.(eq.calcTab!)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    <Calculator className="w-3 h-3" />
                    <span>{isFr ? 'Calculateur Associé' : 'Linked Sizing Tool'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL D : SUIVRE LE PARCOURS D'INGÉNIERIE (ENGINEERING JOURNEY)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-d" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono font-black text-sm">
            D
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isFr ? 'Suivre le Parcours d\'Ingénierie · Du Bilan de Puissance à l\'Exploitation' : 'Follow the Engineering Journey · From Feasibility to O&M'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isFr
                ? 'Les 5 étapes chronologiques indispensables que tout ingénieur ou technicien électricien doit maîtriser.'
                : 'The 5 essential chronological milestones every electrical engineer and technician must execute.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {sectionD.map((st) => (
            <div
              key={st.phase}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-violet-500/40">
                  {st.phase}
                </span>
                <span className="w-2 h-2 rounded-full bg-violet-500" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isFr ? st.titleFr : st.titleEn}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isFr ? st.descFr : st.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL E : APPROFONDIR L'ANALYSE TECHNIQUE (CALCULATIONS & ASSUMPTIONS)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-e" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-black text-sm">
              E
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Approfondir l\'Analyse Technique · Équations Normatives Déterministes' : 'Deepen Technical Analysis · Deterministic Normative Equations'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr
                  ? 'Formules rigoureuses avec définition explicite de chaque paramètre et domaine de validité.'
                  : 'Rigorous formulas with explicit parameter explanations and validity boundaries.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView?.('reference-hub')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{isFr ? 'Ouvrir Hub de Référence (19 Solveurs)' : 'Open Reference Hub (19 Solvers)'}</span>
          </button>
        </div>

        {/* Topic Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {sectionE.map((topic, idx) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setActiveTopicIndex(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTopicIndex === idx
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isFr ? topic.tabLabelFr : topic.tabLabelEn}
            </button>
          ))}
        </div>

        {/* Topic Content Panel */}
        {activeTopic && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Formula & Meaning */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isFr ? activeTopic.titleFr : activeTopic.titleEn}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isFr ? activeTopic.descFr : activeTopic.descEn}
                </p>
              </div>

              {/* Equation Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-amber-300 font-mono text-sm sm:text-base border border-slate-800 shadow-inner overflow-x-auto text-center font-bold">
                {activeTopic.formula}
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                <span className="font-bold text-slate-900 dark:text-slate-200 font-mono">
                  {isFr ? 'Explication des variables :' : 'Variable definitions:'}
                </span>{' '}
                {isFr ? activeTopic.formulaDescFr : activeTopic.formulaDescEn}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {activeTopic.calcTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateCalculator?.(activeTopic.calcTab!)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-colors shadow-sm"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Calculer avec ce Solveur' : 'Compute with this Solver'}</span>
                  </button>
                )}
                {activeTopic.simTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateSimulation?.(activeTopic.simTab!)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5 text-sky-500" />
                    <span>{isFr ? 'Lancer Simulateur' : 'Launch Simulation'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Explicit Validity Assumptions */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>{isFr ? 'Hypothèses & Limites de Validité Déterministe' : 'Assumptions & Validity Limits'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isFr
                  ? 'Pour éviter les erreurs critiques de dimensionnement, vérifiez impérativement les hypothèses suivantes avant d\'appliquer ce calcul :'
                  : 'To avoid catastrophic sizing discrepancies, always verify these governing boundary assumptions:'}
              </p>
              <ul className="space-y-2.5">
                {(isFr ? activeTopic.assumptionsFr : activeTopic.assumptionsEn).map((hyp, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{hyp}</span>
                  </li>
                ))}
              </ul>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 font-mono">
                {isFr
                  ? 'Note de rigueur : Outil d\'aide au dimensionnement et à la formation pédagogique. L\'approbation finale incombe à l\'ingénieur d\'affaires ou au bureau d\'études certifié.'
                  : 'Notice: Sizing assistance and educational training tool. Final sign-off requires approval by certified design engineer.'}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL F : RÉFÉRENCES & CADRE NORMATIF (STANDARDS)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-f" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-black text-sm">
              F
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isFr ? 'Références & Cadre Normatif · Normes Applicables' : 'References & Normative Framework · Applicable Standards'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {isFr
                  ? 'Standards internationaux CEI, européens CENELEC, français NF C et réglementations ARSEL Cameroun.'
                  : 'International IEC standards, European CENELEC, French NF C, and Cameroon ARSEL grid codes.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onNavigateView) onNavigateView('standards');
              else window.location.hash = '#/standards';
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>{isFr ? 'Bibliothèque Normative' : 'Standards Library'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionF.map((norm, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
                  {norm.code}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {norm.tag}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isFr ? norm.titleFr : norm.titleEn}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isFr ? norm.descFr : norm.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
