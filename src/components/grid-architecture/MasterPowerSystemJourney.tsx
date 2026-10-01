// src/components/grid-architecture/MasterPowerSystemJourney.tsx
// EPEDE - Master Power-System Journey Component
// 15-Stage Interactive Synchronized Architecture (Physical, Electrical, Functional)

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Info, 
  CheckCircle2, 
  Maximize2,
  BookOpen,
  Cpu,
  ChevronRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { MASTER_JOURNEY_STAGES } from './data/masterJourneyData';
import { MasterJourneyStage, RepresentationView, JourneyDirection } from './types';

interface MasterPowerSystemJourneyProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const MasterPowerSystemJourney: React.FC<MasterPowerSystemJourneyProps> = ({
  locale,
  onSelectEquipment,
  onNavigateDomain
}) => {
  const [activeStageId, setActiveStageId] = useState<string>('stage-06-transmission');
  const [representationView, setRepresentationView] = useState<RepresentationView>('electrical');
  const [direction, setDirection] = useState<JourneyDirection>('forward');
  const [selectedEquipmentDossier, setSelectedEquipmentDossier] = useState<MasterJourneyStage | null>(null);

  const activeStage = MASTER_JOURNEY_STAGES.find(s => s.id === activeStageId) || MASTER_JOURNEY_STAGES[5];
  const currentIndex = MASTER_JOURNEY_STAGES.findIndex(s => s.id === activeStageId);

  const handleNext = () => {
    if (direction === 'forward' && currentIndex < MASTER_JOURNEY_STAGES.length - 1) {
      setActiveStageId(MASTER_JOURNEY_STAGES[currentIndex + 1].id);
    } else if (direction === 'reverse' && currentIndex > 0) {
      setActiveStageId(MASTER_JOURNEY_STAGES[currentIndex - 1].id);
    }
  };

  const handlePrev = () => {
    if (direction === 'forward' && currentIndex > 0) {
      setActiveStageId(MASTER_JOURNEY_STAGES[currentIndex - 1].id);
    } else if (direction === 'reverse' && currentIndex < MASTER_JOURNEY_STAGES.length - 1) {
      setActiveStageId(MASTER_JOURNEY_STAGES[currentIndex + 1].id);
    }
  };

  const getCategoryColor = (cat: MasterJourneyStage['category']) => {
    switch (cat) {
      case 'generation': return 'border-amber-400 bg-amber-50/50 text-amber-900';
      case 'transmission': return 'border-sky-500 bg-sky-50/50 text-sky-900';
      case 'substation': return 'border-indigo-500 bg-indigo-50/50 text-indigo-900';
      case 'distribution': return 'border-emerald-500 bg-emerald-50/50 text-emerald-900';
      case 'utilization': return 'border-purple-500 bg-purple-50/50 text-purple-900';
      default: return 'border-slate-300 bg-slate-50 text-slate-800';
    }
  };

  const getCategoryBadge = (cat: MasterJourneyStage['category']) => {
    switch (cat) {
      case 'generation': return { label: locale === 'fr' ? 'Production' : 'Generation', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'transmission': return { label: locale === 'fr' ? 'Transport HTB' : 'Transmission', bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30' };
      case 'substation': return { label: locale === 'fr' ? 'Transformation' : 'Substation', bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      case 'distribution': return { label: locale === 'fr' ? 'Distribution MT/BT' : 'Distribution', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'utilization': return { label: locale === 'fr' ? 'Consommation' : 'Utilization', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Controls */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                ARCHITECTURE MAÎTRESSE · 15 ÉTAPES
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {locale === 'fr' ? 'Parcours Continu Énergie Source → Charges' : 'Continuous Source-to-Load Grid Spine'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {locale === 'fr' 
                ? 'Système Électrique Intégré : Du Barrage au Récepteur Final' 
                : 'Integrated Power System: From Generation Dam to Final Consumer'}
            </h2>
          </div>

          {/* Perspective Selector & Traversal Direction */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* 3 Synchronized Perspectives */}
            <div className="inline-flex rounded-xl border border-[#252E38] bg-[#161B22] p-1">
              <button
                type="button"
                onClick={() => setRepresentationView('physical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  representationView === 'physical'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Vue Physique' : 'Physical'}</span>
              </button>

              <button
                type="button"
                onClick={() => setRepresentationView('electrical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  representationView === 'electrical'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>{locale === 'fr' ? 'Schéma Électrique (SLD)' : 'Electrical (SLD)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setRepresentationView('functional')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  representationView === 'functional'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>{locale === 'fr' ? 'Vue Fonctionnelle & Contrôle' : 'Functional'}</span>
              </button>
            </div>

            {/* Traversal direction toggle */}
            <button
              type="button"
              onClick={() => setDirection(d => d === 'forward' ? 'reverse' : 'forward')}
              className="px-3 py-1.5 rounded-xl border border-[#252E38] bg-[#161B22] text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-1.5 transition-colors shadow-xs"
              title={locale === 'fr' ? 'Inverser le sens de parcours' : 'Reverse journey flow'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{direction === 'forward' ? 'Source → Usagers' : 'Usagers → Source'}</span>
            </button>
          </div>
        </div>

        {/* 15-Stage Horizontal Stepper Ribbon */}
        <div className="mt-5 pt-4 border-t border-[#252E38] overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-center gap-1.5 min-w-[1020px]">
            {MASTER_JOURNEY_STAGES.map((stage) => {
              const isSelected = stage.id === activeStageId;
              const badge = getCategoryBadge(stage.category);

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStageId(stage.id)}
                  className={`group relative flex-1 p-2.5 rounded-xl border text-left transition-all duration-150 ${
                    isSelected
                      ? 'bg-sky-950/70 border-sky-400 shadow-md ring-1 ring-sky-400/50 text-white'
                      : 'bg-[#161B22] border-[#252E38] hover:border-slate-700 hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {stage.code}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono font-bold ${badge.bg}`}>
                      {stage.voltageBand}
                    </span>
                  </div>
                  <div className={`font-bold text-xs truncate mt-1 ${isSelected ? 'text-sky-300' : 'text-slate-200 group-hover:text-white'}`}>
                    {stage.title[locale]}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">
                    {stage.voltageRange.split(' ')[0]}
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-sky-400 rotate-45" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Stage Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Stage Overview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-4">
            {/* Stage Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#252E38] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border font-mono ${getCategoryBadge(activeStage.category).bg}`}>
                    {getCategoryBadge(activeStage.category).label}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Étape {activeStage.order} / 15 · {activeStage.voltageRange}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1.5">
                  {activeStage.title[locale]}
                </h3>
                <p className="text-sm text-slate-300 mt-0.5">
                  {activeStage.subtitle[locale]}
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={direction === 'forward' ? currentIndex === 0 : currentIndex === MASTER_JOURNEY_STAGES.length - 1}
                  className="p-2 rounded-xl border border-[#252E38] bg-[#161B22] hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                  title={locale === 'fr' ? 'Étape précédente' : 'Previous stage'}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={direction === 'forward' ? currentIndex === MASTER_JOURNEY_STAGES.length - 1 : currentIndex === 0}
                  className="p-2 rounded-xl border border-[#252E38] bg-[#161B22] hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                  title={locale === 'fr' ? 'Étape suivante' : 'Next stage'}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Why This Stage Exists */}
            <div className="bg-[#161B22] border border-[#252E38] rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-400 uppercase tracking-wide">
                <Info className="w-4 h-4 text-sky-400" />
                <span>{locale === 'fr' ? 'Raison d\'être & Rôle dans le Réseau' : 'Why This Stage Exists in the Grid'}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeStage.whyExists[locale]}
              </p>
            </div>

            {/* Synchronized Perspective Details */}
            <div className="border border-[#252E38] rounded-xl p-4 bg-[#161B22]/70">
              {representationView === 'physical' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>{locale === 'fr' ? 'VUE PHYSIQUE & GÉOMÉTRIE D\'IMPLANTATION' : 'PHYSICAL VIEW & INFRASTRUCTURE'}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {activeStage.physicalView.typicalFootprint}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeStage.physicalView.description[locale]}
                  </p>
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-400 mb-1.5">
                      {locale === 'fr' ? 'Composants physiques clés :' : 'Key physical assets:'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeStage.physicalView.keyAssets.map((asset, i) => (
                        <span key={i} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-medium font-mono">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-mono pt-1">
                    {locale === 'fr' ? 'Environnement :' : 'Environment:'} <span className="text-slate-200">{activeStage.physicalView.environment[locale]}</span>
                  </div>
                </div>
              )}

              {representationView === 'electrical' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-300 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-sky-400" />
                      <span>{locale === 'fr' ? 'SCHÉMA UNIFILAIRE (SLD) & PARAMÈTRES' : 'ELECTRICAL SLD & PARAMETERS'}</span>
                    </span>
                    <span className="text-[11px] font-mono text-sky-300 font-bold bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/30">
                      {activeStage.voltageRange}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeStage.electricalView.description[locale]}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">{locale === 'fr' ? 'Grandeurs assignées :' : 'Nominal parameters:'}</span>
                      <span className="font-bold text-sky-300 text-xs">{activeStage.electricalView.nominalParameters[locale]}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">{locale === 'fr' ? 'Raccordement électrique :' : 'Connection mode:'}</span>
                      <span className="font-bold text-slate-200 text-xs">{activeStage.electricalView.connectionMode}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {locale === 'fr' ? 'Symbole SLD normalisé :' : 'Standard SLD symbol:'} <span className="text-sky-300">{activeStage.electricalView.sldSymbol}</span>
                  </div>
                </div>
              )}

              {representationView === 'functional' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      <span>{locale === 'fr' ? 'FONCTIONS DE PROTECTION, CONTRÔLE & SERVICES' : 'PROTECTION, CONTROL & AUXILIARIES'}</span>
                    </span>
                    <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                      ANSI / CEI
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-400 mb-1.5">
                      {locale === 'fr' ? 'Fonctions de protection associées (Codes ANSI) :' : 'Associated protection functions (ANSI codes):'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeStage.functionalView.protectionFunctions.map((fn, i) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 rounded-md font-mono text-xs font-bold">
                          {fn}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeStage.functionalView.controlAutomation[locale]}
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold block text-slate-200 mb-0.5">
                      {locale === 'fr' ? 'Dépendance aux services auxiliaires vitaux :' : 'Critical auxiliary power dependency:'}
                    </span>
                    {activeStage.functionalView.auxiliaryDependency[locale]}
                  </div>
                </div>
              )}
            </div>

            {/* Energy Transformation & Loss Mechanism */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-[#252E38] bg-[#161B22]">
                <span className="text-xs font-mono font-bold text-amber-400 block mb-1">
                  ⚡ {locale === 'fr' ? 'Transformation Énergétique' : 'Energy Transformation'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeStage.energyTransformation[locale]}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#252E38] bg-[#161B22]">
                <span className="text-xs font-mono font-bold text-sky-400 block mb-1">
                  📉 {locale === 'fr' ? 'Mécanisme de Pertes' : 'Loss Mechanism'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeStage.lossMechanism[locale]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Context, Standards, Equipment Link, Cameroon Reference (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Linked Equipment Dossier Trigger */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                {locale === 'fr' ? 'Équipement Primaire Clé' : 'Primary Grid Apparatus'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {activeStage.code}
              </span>
            </div>

            <div className="p-4 bg-[#161B22] border border-sky-500/30 rounded-xl">
              <div className="font-bold text-sm text-white">
                {activeStage.primaryEquipment}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {locale === 'fr' ? 'Rôle dans l\'ingénierie :' : 'Engineering specialty:'} <span className="text-sky-300">{activeStage.engineeringRole[locale]}</span>
              </div>
            </div>

            {activeStage.equipmentId && (
              <button
                type="button"
                onClick={() => {
                  if (onSelectEquipment) onSelectEquipment(activeStage.equipmentId!);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Consulter la Fiche 32 Champs de l\'Équipement' : 'Open 32-Field Equipment Dossier'}</span>
              </button>
            )}
          </div>

          {/* Real-World Reference: Cameroon & Grid Code */}
          {activeStage.cameroonReference && (
            <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'CAS RÉEL VÉRIFIÉ · RÉSEAU CAMEROUN' : 'VERIFIED CAMEROON REFERENCE'}</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  SONATREL / Eneo
                </span>
              </div>
              <div className="font-bold text-sm text-white">
                {activeStage.cameroonReference.location}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeStage.cameroonReference.description[locale]}
              </p>
            </div>
          )}

          {/* Applicable Engineering Standards */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                {locale === 'fr' ? 'Normes & Référentiels d\'Ingénierie' : 'Engineering Standards'}
              </span>
            </div>
            <div className="space-y-1.5">
              {activeStage.applicableStandards.map((std, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-300 p-2.5 rounded-xl bg-[#161B22] border border-[#252E38]">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>{std}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
