// src/components/energy/FollowTheEnergyView.tsx
// EPEDE - Follow the Energy (8 Sequential Stages & 4 Superimposable Flows)
// Implements Priority #2 of EPEDE Advanced Architecture
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Shield,
  Cpu,
  Radio,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronRight,
  Activity,
  Compass,
  AlertTriangle,
  Info,
  Maximize2,
  BookOpen,
  Globe,
  FileText
} from 'lucide-react';
import {
  FOLLOW_THE_ENERGY_STAGES,
  FLOW_CONFIG,
  type EnergyFlowType,
  type PipelineStage
} from '../../data/followTheEnergyData';
import type { AppViewType } from '../../services/routerService';

interface Props {
  locale: 'fr' | 'en';
  onNavigate: (view: AppViewType, context?: Record<string, string>) => void;
  onOpenKnowledgeGraphNode?: (entityId: string) => void;
}

export const FollowTheEnergyView: React.FC<Props> = ({
  locale,
  onNavigate,
  onOpenKnowledgeGraphNode
}) => {
  // Selected Stage (1 to 8)
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  // Active Flows (Superimposition: can activate 1, 2, 3, or all 4)
  const [activeFlows, setActiveFlows] = useState<Record<EnergyFlowType, boolean>>({
    POWER: true,
    PROTECTION: true,
    CONTROL: true,
    COMMUNICATION: true
  });

  // Automated Flow Tour (Animation Playback)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Active Tab in Deep Dive
  const [activeTab, setActiveTab] = useState<'flows' | 'ratings' | 'matrix'>('flows');

  const currentStage: PipelineStage = FOLLOW_THE_ENERGY_STAGES[selectedStageIndex];

  // Auto-advance stages when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSelectedStageIndex((prev) => (prev + 1) % FOLLOW_THE_ENERGY_STAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleFlow = (flow: EnergyFlowType) => {
    setActiveFlows((prev) => {
      const next = { ...prev, [flow]: !prev[flow] };
      // Ensure at least one flow stays active
      const hasAny = Object.values(next).some(Boolean);
      return hasAny ? next : prev;
    });
  };

  const setAllFlows = (enableAll: boolean) => {
    setActiveFlows({
      POWER: enableAll,
      PROTECTION: enableAll,
      CONTROL: enableAll,
      COMMUNICATION: enableAll
    });
  };

  const handleNextStage = () => {
    setSelectedStageIndex((prev) => Math.min(prev + 1, FOLLOW_THE_ENERGY_STAGES.length - 1));
  };

  const handlePrevStage = () => {
    setSelectedStageIndex((prev) => Math.max(prev - 1, 0));
  };

  const getFlowCount = () => Object.values(activeFlows).filter(Boolean).length;

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-16">
      {/* ── TOP HERO HEADER & FLOW SELECTOR ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-[#0B1528] to-[#040814] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{locale === 'fr' ? 'Architecture Système Intégrée' : 'Integrated Grid Architecture'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 font-bold">Priority #2</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{locale === 'fr' ? 'Follow the Energy' : 'Follow the Energy'}</span>
              <span className="text-slate-400 text-xl font-normal">—</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-purple-400 text-xl sm:text-2xl font-bold">
                {locale === 'fr' ? '8 Étapes & 4 Flux Cyber-Physiques' : '8 Stages & 4 Cyber-Physical Flows'}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {locale === 'fr'
                ? 'Suivez le cycle complet de l’électricité depuis le turbinage hydraulique de la Sanaga jusqu’au couple mécanique utile de la pompe industrielle. Superposez en temps réel les flux d’énergie, de protection, de commande et de télécommunication SCADA.'
                : 'Follow the complete electricity lifecycle from Sanaga hydro turbine shaft to industrial pump mechanical torque. Superimpose real-time power, protection, control, and SCADA communication flows across the grid.'}
            </p>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 rounded-xl p-1.5 px-3">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? (locale === 'fr' ? 'Pause Défilement' : 'Pause Flow') : (locale === 'fr' ? 'Lecture Auto' : 'Auto Play')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStageIndex(0)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title={locale === 'fr' ? 'Retour au début' : 'Restart at stage 1'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span>{locale === 'fr' ? 'Étape active :' : 'Active Stage:'}</span>
              <span className="text-white font-bold text-sm bg-white/10 px-2 py-0.5 rounded-md">
                {currentStage.stepNumber} / {FOLLOW_THE_ENERGY_STAGES.length}
              </span>
            </div>
          </div>
        </div>

        {/* ── 4 FLOWS SUPERIMPOSITION SWITCHER BAR ── */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Couches Cyber-Physiques Superposables :' : 'Superimposable Cyber-Physical Layers:'}</span>
              <span className="text-cyan-400">({getFlowCount()} / 4 actifs)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAllFlows(true)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                {locale === 'fr' ? 'Tout activer' : 'Enable all'}
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => {
                  setActiveFlows({
                    POWER: true,
                    PROTECTION: false,
                    CONTROL: false,
                    COMMUNICATION: false
                  });
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                {locale === 'fr' ? 'Puissance seule' : 'Power only'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Flow 1: POWER */}
            <button
              type="button"
              onClick={() => toggleFlow('POWER')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                activeFlows.POWER
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/40 border-white/5 text-slate-500 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeFlows.POWER ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{locale === 'fr' ? 'Flux de Puissance' : 'Power Flow'}</div>
                  <div className="text-[10px] text-amber-400/80 font-mono">MW • Mvar • kV • A</div>
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full border ${activeFlows.POWER ? 'bg-amber-400 border-amber-300' : 'border-slate-600'}`} />
            </button>

            {/* Flow 2: PROTECTION */}
            <button
              type="button"
              onClick={() => toggleFlow('PROTECTION')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                activeFlows.PROTECTION
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-900/40 border-white/5 text-slate-500 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeFlows.PROTECTION ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{locale === 'fr' ? 'Flux de Protection' : 'Protection Flow'}</div>
                  <div className="text-[10px] text-emerald-400/80 font-mono">TC/TP • ANSI • Trip</div>
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full border ${activeFlows.PROTECTION ? 'bg-emerald-400 border-emerald-300' : 'border-slate-600'}`} />
            </button>

            {/* Flow 3: CONTROL */}
            <button
              type="button"
              onClick={() => toggleFlow('CONTROL')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                activeFlows.CONTROL
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-white/5 text-slate-500 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeFlows.CONTROL ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{locale === 'fr' ? 'Flux de Commande' : 'Control Flow'}</div>
                  <div className="text-[10px] text-cyan-400/80 font-mono">ATS • AVR • Téléordres</div>
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full border ${activeFlows.CONTROL ? 'bg-cyan-400 border-cyan-300' : 'border-slate-600'}`} />
            </button>

            {/* Flow 4: COMMUNICATION */}
            <button
              type="button"
              onClick={() => toggleFlow('COMMUNICATION')}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                activeFlows.COMMUNICATION
                  ? 'bg-purple-500/15 border-purple-500/50 text-purple-300 shadow-md shadow-purple-500/10'
                  : 'bg-slate-900/40 border-white/5 text-slate-500 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeFlows.COMMUNICATION ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{locale === 'fr' ? 'Flux Communication' : 'Communication Flow'}</div>
                  <div className="text-[10px] text-purple-400/80 font-mono">SCADA • IEC 61850 • OPGW</div>
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full border ${activeFlows.COMMUNICATION ? 'bg-purple-400 border-purple-300' : 'border-slate-600'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 8-STAGE HORIZONTAL PIPELINE STEPPER ── */}
      <div className="relative bg-slate-950/80 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
              {locale === 'fr' ? 'Pipeline Séquentiel (8 Niveaux)' : 'Sequential Pipeline (8 Tiers)'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevStage}
              disabled={selectedStageIndex === 0}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title={locale === 'fr' ? 'Étape précédente' : 'Previous stage'}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextStage}
              disabled={selectedStageIndex === FOLLOW_THE_ENERGY_STAGES.length - 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title={locale === 'fr' ? 'Étape suivante' : 'Next stage'}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Rail */}
        <div className="relative overflow-x-auto no-scrollbar pb-3">
          <div className="flex items-stretch gap-3 min-w-[1080px]">
            {FOLLOW_THE_ENERGY_STAGES.map((stage, idx) => {
              const isSelected = selectedStageIndex === idx;

              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStageIndex(idx)}
                  role="button"
                  tabIndex={0}
                  className={`group relative flex-1 min-w-[130px] rounded-2xl p-3.5 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/70 via-slate-900/90 to-slate-950 border-cyan-400/80 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20 hover:bg-slate-900'
                  }`}
                >
                  {/* Top: Step Badge & Voltage */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {String(stage.stepNumber).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      {stage.voltageTier.split(' ')[0]}
                    </span>
                  </div>

                  {/* Title & Equipment */}
                  <div className="space-y-1 mb-3">
                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {locale === 'fr' ? stage.titleFr.replace(/^\d+\.\s*/, '') : stage.titleEn.replace(/^\d+\.\s*/, '')}
                    </h3>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                      {stage.primaryEquipment}
                    </p>
                  </div>

                  {/* Flow Pills (Micro-indicators for active flows) */}
                  <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                    {activeFlows.POWER && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Flux de Puissance" />
                    )}
                    {activeFlows.PROTECTION && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Flux de Protection" />
                    )}
                    {activeFlows.CONTROL && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Flux de Commande" />
                    )}
                    {activeFlows.COMMUNICATION && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Flux Communication" />
                    )}
                    <span className="text-[9px] font-mono text-slate-500 ml-auto">{stage.domainCode}</span>
                  </div>

                  {/* Active Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-stage-indicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-400 rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SELECTED STAGE DEEP-DIVE WORKBENCH ── */}
      <div className="space-y-6">
        {/* Stage Header Info Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-[#0B1528] to-slate-950 p-6 sm:p-7 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950">
                  {locale === 'fr' ? `ÉTAPE ${currentStage.stepNumber} SUR 8` : `STAGE ${currentStage.stepNumber} OF 8`}
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  {currentStage.voltageTier}
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-1 rounded-md bg-slate-800 text-slate-300">
                  {currentStage.domainCode}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white">
                {locale === 'fr' ? currentStage.titleFr : currentStage.titleEn}
              </h2>

              <p className="text-sm font-medium text-cyan-300">
                {locale === 'fr' ? currentStage.subtitleFr : currentStage.subtitleEn}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
                {locale === 'fr' ? currentStage.overviewFr : currentStage.overviewEn}
              </p>
            </div>

            {/* Cameroon Anchor Box */}
            <div className="lg:w-80 shrink-0 bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                <Compass className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'ANCRAGE RÉSEAU CAMEROUN' : 'CAMEROON GRID ANCHOR'}</span>
              </div>
              <div className="text-xs font-bold text-white">
                {currentStage.cameroonAnchor}
              </div>
              <div className="text-[11px] text-slate-400">
                {currentStage.primaryEquipment}
              </div>
              <button
                type="button"
                onClick={() => onNavigate('cameroon-grid')}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 pt-1"
              >
                <span>{locale === 'fr' ? 'Localiser sur le SIG' : 'View on GIS map'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Sub-Tabs: 4 Flows vs Ratings vs Synoptic Matrix */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('flows')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'flows'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? '4 Flux Superposés' : '4 Superimposed Flows'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ratings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ratings'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Caractéristiques & Grandeurs' : 'Ratings & Metrics'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'matrix'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Matrice Synoptique Globale' : 'Global Synoptic Matrix'}</span>
            </button>
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        {activeTab === 'flows' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. POWER FLOW CARD */}
            {activeFlows.POWER && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-950 to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                          {locale === 'fr' ? 'FLUX 1 : PUISSANCE ACTIVE / RÉACTIVE' : 'FLOW 1: ACTIVE / REACTIVE POWER'}
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {locale === 'fr' ? currentStage.flows.POWER.titleFr : currentStage.flows.POWER.titleEn}
                        </h3>
                      </div>
                    </div>

                    {currentStage.flows.POWER.statusBadge && (
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {currentStage.flows.POWER.statusBadge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {locale === 'fr' ? currentStage.flows.POWER.summaryFr : currentStage.flows.POWER.summaryEn}
                  </p>
                </div>

                {currentStage.flows.POWER.telemetryTag && (
                  <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{locale === 'fr' ? 'Télémétrie transit :' : 'Transit Telemetry:'}</span>
                    <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {currentStage.flows.POWER.telemetryTag}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. PROTECTION FLOW CARD */}
            {activeFlows.PROTECTION && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-950 to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                          {locale === 'fr' ? 'FLUX 2 : PROTECTION & SÉCURITÉ' : 'FLOW 2: PROTECTION & SAFETY'}
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {locale === 'fr' ? currentStage.flows.PROTECTION.titleFr : currentStage.flows.PROTECTION.titleEn}
                        </h3>
                      </div>
                    </div>

                    {currentStage.flows.PROTECTION.statusBadge && (
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {currentStage.flows.PROTECTION.statusBadge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {locale === 'fr' ? currentStage.flows.PROTECTION.summaryFr : currentStage.flows.PROTECTION.summaryEn}
                  </p>
                </div>

                {currentStage.flows.PROTECTION.telemetryTag && (
                  <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{locale === 'fr' ? 'Capteurs & Relais ANSI :' : 'Sensors & ANSI Relays:'}</span>
                    <span className="font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {currentStage.flows.PROTECTION.telemetryTag}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. CONTROL FLOW CARD */}
            {activeFlows.CONTROL && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                          {locale === 'fr' ? 'FLUX 3 : COMMANDE & AUTOMATISMES' : 'FLOW 3: CONTROL & AUTOMATION'}
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {locale === 'fr' ? currentStage.flows.CONTROL.titleFr : currentStage.flows.CONTROL.titleEn}
                        </h3>
                      </div>
                    </div>

                    {currentStage.flows.CONTROL.statusBadge && (
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {currentStage.flows.CONTROL.statusBadge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {locale === 'fr' ? currentStage.flows.CONTROL.summaryFr : currentStage.flows.CONTROL.summaryEn}
                  </p>
                </div>

                {currentStage.flows.CONTROL.telemetryTag && (
                  <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{locale === 'fr' ? 'Automatisme de quart :' : 'Switching Automation:'}</span>
                    <span className="font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {currentStage.flows.CONTROL.telemetryTag}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. COMMUNICATION FLOW CARD */}
            {activeFlows.COMMUNICATION && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-slate-950 to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                        <Radio className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                          {locale === 'fr' ? 'FLUX 4 : TÉLÉCOMMUNICATIONS & SCADA' : 'FLOW 4: SCADA & TELECOMS'}
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {locale === 'fr' ? currentStage.flows.COMMUNICATION.titleFr : currentStage.flows.COMMUNICATION.titleEn}
                        </h3>
                      </div>
                    </div>

                    {currentStage.flows.COMMUNICATION.statusBadge && (
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {currentStage.flows.COMMUNICATION.statusBadge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {locale === 'fr' ? currentStage.flows.COMMUNICATION.summaryFr : currentStage.flows.COMMUNICATION.summaryEn}
                  </p>
                </div>

                {currentStage.flows.COMMUNICATION.telemetryTag && (
                  <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{locale === 'fr' ? 'Protocole & Bus de Station :' : 'Protocol & Station Bus:'}</span>
                    <span className="font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                      {currentStage.flows.COMMUNICATION.telemetryTag}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* ── RATINGS & METRICS TAB ── */}
        {activeTab === 'ratings' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentStage.ratings.map((rate, rIdx) => (
              <div
                key={rIdx}
                className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 space-y-1 shadow-lg"
              >
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {rate.label}
                </div>
                <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
                  <span>{rate.value}</span>
                  {rate.unit && <span className="text-xs text-cyan-400 font-mono font-semibold">{rate.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SYNOPTIC MATRIX TAB ── */}
        {activeTab === 'matrix' && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 shadow-2xl">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-900/90 border-b border-white/10 text-slate-300 uppercase tracking-wider">
                  <th className="p-3">Étape</th>
                  <th className="p-3 text-amber-400">⚡ Puissance</th>
                  <th className="p-3 text-emerald-400">🛡️ Protection</th>
                  <th className="p-3 text-cyan-400">⚙️ Commande</th>
                  <th className="p-3 text-purple-400">📡 Communication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {FOLLOW_THE_ENERGY_STAGES.map((s, idx) => (
                  <tr
                    key={s.id}
                    onClick={() => {
                      setSelectedStageIndex(idx);
                      setActiveTab('flows');
                    }}
                    className={`cursor-pointer transition-colors ${
                      idx === selectedStageIndex ? 'bg-cyan-500/10 font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="p-3 text-white">
                      <div className="font-bold">{s.stepNumber}. {s.titleFr.replace(/^\d+\.\s*/, '')}</div>
                      <div className="text-[10px] text-slate-400">{s.voltageTier}</div>
                    </td>
                    <td className="p-3 text-amber-300/90 max-w-[200px] truncate">{s.flows.POWER.titleFr}</td>
                    <td className="p-3 text-emerald-300/90 max-w-[200px] truncate">{s.flows.PROTECTION.titleFr}</td>
                    <td className="p-3 text-cyan-300/90 max-w-[200px] truncate">{s.flows.CONTROL.titleFr}</td>
                    <td className="p-3 text-purple-300/90 max-w-[200px] truncate">{s.flows.COMMUNICATION.titleFr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── CROSS-NAVIGATION GATEWAYS ── */}
        <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Écosystème Connecté EPEDE :' : 'Connected EPEDE Ecosystem:'}
              </span>
              <span className="text-slate-400 hidden sm:inline">
                {locale === 'fr' ? 'Naviguez directement dans le moteur correspondant' : 'Navigate directly to linked engineering tools'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              {locale === 'fr' ? `Étape active : ${currentStage.titleFr}` : `Active Stage: ${currentStage.titleEn}`}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* 1. Parcours Guidés Thématiques */}
            <button
              type="button"
              onClick={() => onNavigate('thematic-journeys')}
              className="group flex flex-col items-start gap-1 p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-left transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <BookOpen className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                <ArrowRight className="w-3 h-3 text-indigo-400/50 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] font-bold text-white mt-1">
                {locale === 'fr' ? 'Parcours Guidés' : 'Guided Journeys'}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1">
                {locale === 'fr' ? 'Cursus & Quiz' : 'Curricula & Quizzes'}
              </div>
            </button>

            {/* 2. Scénarios Pédagogiques SCADA */}
            <button
              type="button"
              onClick={() => onNavigate('scenarios')}
              className="group flex flex-col items-start gap-1 p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-left transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <Activity className="w-4 h-4 text-rose-400 group-hover:text-rose-300" />
                <ArrowRight className="w-3 h-3 text-rose-400/50 group-hover:text-rose-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] font-bold text-white mt-1">
                {locale === 'fr' ? 'Incident Replay' : 'Incident Replay'}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1">
                {locale === 'fr' ? 'Chronologie 10ms' : '10ms SOE Timeline'}
              </div>
            </button>

            {/* 3. Knowledge Graph Explorer */}
            <button
              type="button"
              onClick={() => onNavigate('knowledge-graph', { entityId: currentStage.domainCode })}
              className="group flex flex-col items-start gap-1 p-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-left transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <Compass className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                <ArrowRight className="w-3 h-3 text-purple-400/50 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] font-bold text-white mt-1">
                {locale === 'fr' ? 'Knowledge Graph' : 'Knowledge Graph'}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1">
                {locale === 'fr' ? 'Relations & Normes' : 'Relations & Nodes'}
              </div>
            </button>

            {/* 4. Carte SIG Cameroun */}
            <button
              type="button"
              onClick={() => onNavigate('cameroon-grid')}
              className="group flex flex-col items-start gap-1 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-left transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <Globe className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                <ArrowRight className="w-3 h-3 text-emerald-400/50 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] font-bold text-white mt-1">
                {locale === 'fr' ? 'Réseau Cameroun' : 'Cameroon Grid'}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1">
                {locale === 'fr' ? 'Atlas SIG & SLD' : 'GIS Atlas & SLD'}
              </div>
            </button>

            {/* 5. Traçabilité & Données Fiables */}
            <button
              type="button"
              onClick={() => onNavigate('traceability')}
              className="group flex flex-col items-start gap-1 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-left transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <FileText className="w-4 h-4 text-sky-400 group-hover:text-sky-300" />
                <ArrowRight className="w-3 h-3 text-sky-400/50 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] font-bold text-white mt-1">
                {locale === 'fr' ? 'Traçabilité' : 'Provenance'}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1">
                {locale === 'fr' ? 'Preuves & Audits' : 'Evidence Registry'}
              </div>
            </button>

            {/* 6. Fiches Matériel Canoniques */}
            <button
              type="button"
              onClick={() => onNavigate('equipment-reference')}
              className="group flex flex-col items-start gap-1 p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-left transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <Zap className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                <ArrowRight className="w-3 h-3 text-amber-400/50 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] font-bold text-white mt-1">
                {locale === 'fr' ? 'Fiches Matériel' : 'Equipment Registry'}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1">
                {locale === 'fr' ? '12 Sections Canoniques' : '12 Universal Sections'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
