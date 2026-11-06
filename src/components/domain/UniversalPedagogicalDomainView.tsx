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
import { CANONICAL_POWER_STAGES } from '../../data/canonicalPowerChain';
import { PowerChain } from '../common/PowerChain';
import { WORKED_EXAMPLES_REGISTRY } from '../../data/workedExamplesRegistry';
import { WorkedExampleViewer } from '../common/WorkedExampleViewer';

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

  const matchingStage =
    CANONICAL_POWER_STAGES.find((s) => s.domainCode === domainCode) ||
    CANONICAL_POWER_STAGES[0];
  const matchingStageId = matchingStage.id;
  const matchingWorkedExample = WORKED_EXAMPLES_REGISTRY.find(
    (we) => we.domainCode === domainCode
  );

  return (
    <div className="space-y-12">
      {/* ───────────────────────────────────────────────────────────────────────
          UNIVERSAL CANONICAL POWER CHAIN CONTEXT & UPSTREAM/DOWNSTREAM NAVIGATION
         ─────────────────────────────────────────────────────────────────────── */}
      <PowerChain
        locale={locale}
        currentStageId={matchingStageId}
        onSelectStage={(stage) => {
          if (stage.domainCode !== domainCode && onNavigateView) {
            onNavigateView('domain-detail', stage.domainCode);
          }
        }}
        showDetails={false}
        showNavigationButtons={true}
      />

      {/* ───────────────────────────────────────────────────────────────────────
          ANCHOR JUMP BAR & WORKBENCH SHORTCUT
         ─────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#EEF4F8] border border-[#D5E0E8] shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-[#5B6B7B] font-bold px-1 hidden sm:inline">
            {isFr ? 'Sections :' : 'Sections:'}
          </span>
          <a
            href="#section-a"
            className="px-2.5 py-1 rounded-lg bg-[#FBFCFD] text-[#0B1B2B] hover:text-[#1F5FAE] border border-[#D5E0E8] transition-colors"
          >
            A. {isFr ? 'Système' : 'System'}
          </a>
          <a
            href="#section-b"
            className="px-2.5 py-1 rounded-lg bg-[#FBFCFD] text-[#0B1B2B] hover:text-[#1F5FAE] border border-[#D5E0E8] transition-colors"
          >
            B. Architecture
          </a>
          <a
            href="#section-c"
            className="px-2.5 py-1 rounded-lg bg-[#FBFCFD] text-[#0B1B2B] hover:text-[#1F5FAE] border border-[#D5E0E8] transition-colors"
          >
            C. {isFr ? 'Matériels' : 'Equipment'}
          </a>
          <a
            href="#section-d"
            className="px-2.5 py-1 rounded-lg bg-[#FBFCFD] text-[#0B1B2B] hover:text-[#1F5FAE] border border-[#D5E0E8] transition-colors"
          >
            D. {isFr ? 'Cycle de Vie' : 'Lifecycle'}
          </a>
          <a
            href="#section-e"
            className="px-2.5 py-1 rounded-lg bg-[#FBFCFD] text-[#0B1B2B] hover:text-[#1F5FAE] border border-[#D5E0E8] transition-colors"
          >
            E. {isFr ? 'Calculs' : 'Calculations'}
          </a>
          <a
            href="#section-f"
            className="px-2.5 py-1 rounded-lg bg-[#FBFCFD] text-[#0B1B2B] hover:text-[#1F5FAE] border border-[#D5E0E8] transition-colors"
          >
            F. {isFr ? 'Normes' : 'Standards'}
          </a>
        </div>

        {onSwitchToAdvancedWorkbench && (
          <button
            type="button"
            onClick={onSwitchToAdvancedWorkbench}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0B1B2B] hover:bg-[#1F5FAE] text-[#F3F7FA] text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>{isFr ? 'Accéder au Banc d\'Ingénierie Avancé' : 'Switch to Advanced Workbench'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F2A541]" />
          </button>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL A : COMPRENDRE LE SYSTÈME (UNDERSTAND THE SYSTEM)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-a" className="rounded-xl border border-[#D5E0E8] bg-[#FBFCFD] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#D5E0E8]">
          <div className="p-2.5 rounded-lg bg-[#1F5FAE]/10 text-[#1F5FAE] font-mono font-bold text-sm">
            A
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] tracking-tight">
              {isFr ? 'Comprendre le Système · Rôle & Périmètre Fonctionnel' : 'Understand the System · Role & Functional Scope'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isFr ? sectionA.roleFr : sectionA.roleEn}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Entrées */}
          <div className="p-5 rounded-xl bg-[#EEF4F8] border border-[#D5E0E8] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1F5FAE] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#1F5FAE]" />
              <span>{isFr ? '1. Entrées (Sources & Flux)' : '1. Inputs (Sources & Inflows)'}</span>
            </div>
            <h3 className="font-bold text-sm text-[#0B1B2B]">
              {isFr ? sectionA.inputsFr.title : sectionA.inputsEn.title}
            </h3>
            <p className="text-xs text-[#3A4B5C] leading-relaxed">
              {isFr ? sectionA.inputsFr.desc : sectionA.inputsEn.desc}
            </p>
            <div className="text-[11px] font-mono text-[#5B6B7B] pt-2 border-t border-[#D5E0E8]">
              {isFr ? sectionA.inputsFr.voltage : sectionA.inputsEn.voltage}
            </div>
          </div>

          {/* Processus */}
          <div className="p-5 rounded-xl bg-[#EEF4F8] border border-[#D5E0E8] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F2A541] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#F2A541]" />
              <span>{isFr ? '2. Transformation & Traitement' : '2. Transformation & Processing'}</span>
            </div>
            <h3 className="font-bold text-sm text-[#0B1B2B]">
              {isFr ? sectionA.processFr.title : sectionA.processEn.title}
            </h3>
            <p className="text-xs text-[#3A4B5C] leading-relaxed">
              {isFr ? sectionA.processFr.desc : sectionA.processEn.desc}
            </p>
            <div className="text-[11px] font-mono text-[#5B6B7B] pt-2 border-t border-[#D5E0E8]">
              {isFr ? sectionA.processFr.note : sectionA.processEn.note}
            </div>
          </div>

          {/* Sorties */}
          <div className="p-5 rounded-xl bg-[#EEF4F8] border border-[#D5E0E8] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#15803D] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span>{isFr ? '3. Sorties & Interconnexion' : '3. Outputs & Interconnection'}</span>
            </div>
            <h3 className="font-bold text-sm text-[#0B1B2B]">
              {isFr ? sectionA.outputsFr.title : sectionA.outputsEn.title}
            </h3>
            <p className="text-xs text-[#3A4B5C] leading-relaxed">
              {isFr ? sectionA.outputsFr.desc : sectionA.outputsEn.desc}
            </p>
            <div className="text-[11px] font-mono text-[#5B6B7B] pt-2 border-t border-[#D5E0E8]">
              {isFr ? sectionA.outputsFr.earthing : sectionA.outputsEn.earthing}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL B : EXPLORER L'ARCHITECTURE (EXPLORE THE ARCHITECTURE)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-b" className="rounded-xl border border-[#D5E0E8] bg-[#FBFCFD] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#D5E0E8]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1F5FAE]/10 text-[#1F5FAE] font-mono font-bold text-sm">
              B
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] tracking-tight">
                {isFr ? 'Explorer l\'Architecture · Topologies & Schémas Types' : 'Explore Architecture · Topologies & System Layouts'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6B7B]">
                {isFr ? sectionB.summaryFr : sectionB.summaryEn}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => onNavigateView?.('diagrams')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF4F8] hover:bg-[#D5E0E8] text-xs font-mono font-bold text-[#0B1B2B] transition-colors cursor-pointer border border-[#D5E0E8]"
          >
            <span>{isFr ? 'Schémas Synoptiques' : 'Synoptic Diagrams'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#1F5FAE]" />
          </button>
        </div>

        {/* Architecture Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectionB.architectures.map((arch, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-[#D5E0E8] bg-[#EEF4F8] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#1F5FAE] uppercase">
                  {isFr ? arch.nameFr : arch.nameEn}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FBFCFD] text-[#5B6B7B] border border-[#D5E0E8]">
                  {arch.standard}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#0B1B2B]">
                {isFr ? arch.techFr : arch.techEn}
              </h3>
              <p className="text-xs text-[#3A4B5C] leading-relaxed">
                {isFr ? arch.descFr : arch.descEn}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-[#FBFCFD] text-[#1F5FAE] font-semibold border border-[#1F5FAE]/20">
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
      <section id="section-c" className="rounded-xl border border-[#D5E0E8] bg-[#FBFCFD] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#D5E0E8]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#15803D]/10 text-[#15803D] font-mono font-bold text-sm">
              C
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] tracking-tight">
                {isFr ? 'Reconnaître les Matériels · Équipements Clés & Clés Visuelles' : 'Recognize Equipment · Key Physical Assets & Visual Cues'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6B7B]">
                {isFr
                  ? 'Fiches concrètes avec photographies industrielles vérifiées, symboles normalisés et caractéristiques électriques assignées.'
                  : 'Practical asset cards with verified industrial photographs, standard schematic symbols, and rated parameters.'}
              </p>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803D]/10 border border-[#15803D]/30 text-[#15803D] text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED_TECHNICAL_PHOTO</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectionC.map((eq) => (
            <div
              key={eq.id}
              className="group rounded-xl border border-[#D5E0E8] bg-[#FBFCFD] hover:border-[#1F5FAE]/60 transition-all overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-44 bg-[#0B1B2B] overflow-hidden">
                  <img
                    src={eq.imgUrl}
                    alt={isFr ? eq.nameFr : eq.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0B1B2B]/80 backdrop-blur-sm text-[10px] font-mono text-[#F2A541] font-bold border border-[#F2A541]/30">
                    {eq.symbol}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-[#0B1B2B]/80 backdrop-blur-sm text-[10px] font-mono text-[#C3CFDA] flex items-center justify-between">
                    <span>{eq.standard}</span>
                    <span className="text-[#15803D]">PHOTO REPRÉSENTATIVE</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-mono text-[#1F5FAE] font-bold">
                    {eq.voltage}
                  </div>
                  <h3 className="font-bold text-sm text-[#0B1B2B] leading-snug">
                    {isFr ? eq.nameFr : eq.nameEn}
                  </h3>
                  <p className="text-xs text-[#3A4B5C] leading-relaxed line-clamp-3">
                    {isFr ? eq.roleFr : eq.roleEn}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectEquipment?.(eq.id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#FBFCFD] hover:bg-[#EEF4F8] text-xs font-mono font-bold text-[#0B1B2B] border border-[#D5E0E8] transition-colors cursor-pointer"
                >
                  <span>{isFr ? 'Fiche Matériel' : 'View Specs'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                {eq.calcTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateCalculator?.(eq.calcTab!)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-[#EEF4F8] hover:bg-[#1F5FAE] hover:text-white text-[11px] font-mono font-bold text-[#1F5FAE] border border-[#1F5FAE]/30 transition-colors cursor-pointer"
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
      <section id="section-d" className="rounded-xl border border-[#D5E0E8] bg-[#FBFCFD] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#D5E0E8]">
          <div className="p-2.5 rounded-lg bg-[#1F5FAE]/10 text-[#1F5FAE] font-mono font-bold text-sm">
            D
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] tracking-tight">
              {isFr ? 'Suivre le Parcours d\'Ingénierie · Du Bilan de Puissance à l\'Exploitation' : 'Follow the Engineering Journey · From Feasibility to O&M'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6B7B]">
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
              className="p-4 rounded-xl border border-[#D5E0E8] bg-[#EEF4F8] space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-[#1F5FAE]/30">
                  {st.phase}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#1F5FAE]" />
              </div>
              <h3 className="font-bold text-sm text-[#0B1B2B]">
                {isFr ? st.titleFr : st.titleEn}
              </h3>
              <p className="text-xs text-[#3A4B5C] leading-relaxed">
                {isFr ? st.descFr : st.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL E : APPROFONDIR L'ANALYSE TECHNIQUE (CALCULATIONS & ASSUMPTIONS)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-e" className="rounded-xl border border-[#D5E0E8] bg-[#FBFCFD] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#D5E0E8]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#F2A541]/15 text-[#F2A541] font-mono font-bold text-sm">
              E
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] tracking-tight">
                {isFr ? 'Approfondir l\'Analyse Technique · Équations Normatives Déterministes' : 'Deepen Technical Analysis · Deterministic Normative Equations'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6B7B]">
                {isFr
                  ? 'Formules rigoureuses avec définition explicite de chaque paramètre et domaine de validité.'
                  : 'Rigorous formulas with explicit parameter explanations and validity boundaries.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView?.('reference-hub')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1B2B] hover:bg-[#1F5FAE] text-white font-mono font-bold text-xs transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-[#F2A541]" />
            <span>{isFr ? 'Ouvrir Hub de Référence (19 Solveurs)' : 'Open Reference Hub (19 Solvers)'}</span>
          </button>
        </div>

        {/* Topic Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-[#D5E0E8] pb-2">
          {sectionE.map((topic, idx) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setActiveTopicIndex(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTopicIndex === idx
                  ? 'bg-[#0B1B2B] text-[#F3F7FA] shadow-xs'
                  : 'bg-[#EEF4F8] text-[#5B6B7B] hover:text-[#0B1B2B] border border-[#D5E0E8]'
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
            <div className="p-6 rounded-xl border border-[#D5E0E8] bg-[#EEF4F8] space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#0B1B2B]">
                  {isFr ? activeTopic.titleFr : activeTopic.titleEn}
                </h3>
                <p className="text-xs text-[#5B6B7B] mt-1">
                  {isFr ? activeTopic.descFr : activeTopic.descEn}
                </p>
              </div>

              {/* Equation Box */}
              <div className="p-4 rounded-xl bg-[#0B1B2B] text-[#F2A541] font-mono text-sm sm:text-base border border-[#1E3347] shadow-inner overflow-x-auto text-center font-bold">
                {activeTopic.formula}
              </div>

              <div className="text-xs text-[#3A4B5C] leading-relaxed font-sans">
                <span className="font-bold text-[#0B1B2B] font-mono">
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F5FAE] hover:bg-[#174A88] text-white font-mono font-bold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Calculer avec ce Solveur' : 'Compute with this Solver'}</span>
                  </button>
                )}
                {activeTopic.simTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateSimulation?.(activeTopic.simTab!)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FBFCFD] hover:bg-[#EEF4F8] text-[#0B1B2B] border border-[#D5E0E8] font-mono font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#1F5FAE]" />
                    <span>{isFr ? 'Lancer Simulateur' : 'Launch Simulation'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Explicit Validity Assumptions */}
            <div className="p-6 rounded-xl border border-[#D5E0E8] bg-[#EEF4F8] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F2A541] uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>{isFr ? 'Hypothèses & Limites de Validité Déterministe' : 'Assumptions & Validity Limits'}</span>
              </div>
              <p className="text-xs text-[#5B6B7B]">
                {isFr
                  ? 'Pour éviter les erreurs critiques de dimensionnement, vérifiez impérativement les hypothèses suivantes avant d\'appliquer ce calcul :'
                  : 'To avoid catastrophic sizing discrepancies, always verify these governing boundary assumptions:'}
              </p>
              <ul className="space-y-2.5">
                {(isFr ? activeTopic.assumptionsFr : activeTopic.assumptionsEn).map((hyp, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#3A4B5C]">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                    <span>{hyp}</span>
                  </li>
                ))}
              </ul>
              <div className="p-3 rounded-lg bg-[#FBFCFD] border border-[#F2A541]/40 text-[11px] text-[#0B1B2B] font-mono">
                {isFr
                  ? 'Note de rigueur : Outil d\'aide au dimensionnement et à la formation pédagogique. L\'approbation finale incombe à l\'ingénieur d\'affaires ou au bureau d\'études certifié.'
                  : 'Notice: Sizing assistance and educational training tool. Final sign-off requires approval by certified design engineer.'}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Normative Worked Example */}
        {matchingWorkedExample && (
          <div className="pt-4 border-t border-[#D5E0E8]">
            <WorkedExampleViewer
              example={matchingWorkedExample}
              locale={locale}
              onOpenCalculator={
                activeTopic?.calcTab
                  ? () => onNavigateCalculator?.(activeTopic.calcTab!)
                  : undefined
              }
            />
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          PANEL F : RÉFÉRENCES & CADRE NORMATIF (STANDARDS)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="section-f" className="rounded-xl border border-[#D5E0E8] bg-[#FBFCFD] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#D5E0E8]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1F5FAE]/10 text-[#1F5FAE] font-mono font-bold text-sm">
              F
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] tracking-tight">
                {isFr ? 'Références & Cadre Normatif · Normes Applicables' : 'References & Normative Framework · Applicable Standards'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6B7B]">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF4F8] hover:bg-[#D5E0E8] text-xs font-mono font-bold text-[#0B1B2B] transition-colors border border-[#D5E0E8] cursor-pointer"
          >
            <span>{isFr ? 'Bibliothèque Normative' : 'Standards Library'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#1F5FAE]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionF.map((norm, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#D5E0E8] bg-[#EEF4F8] space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-[#1F5FAE]">
                  {norm.code}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FBFCFD] text-[#5B6B7B] border border-[#D5E0E8]">
                  {norm.tag}
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#0B1B2B]">
                {isFr ? norm.titleFr : norm.titleEn}
              </h3>
              <p className="text-xs text-[#3A4B5C] leading-relaxed">
                {isFr ? norm.descFr : norm.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
