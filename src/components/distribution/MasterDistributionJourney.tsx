// src/components/distribution/MasterDistributionJourney.tsx
// EPEDE D05 - Master 10-Stage MV-to-Consumer Electrical Distribution Journey

import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Layers,
  ChevronRight,
  AlertTriangle,
  Building2,
  Lock,
  RotateCcw,
  CheckCircle2,
  FolderTree,
  Sliders,
  Radio,
  Cpu,
  RefreshCw,
  Home,
  Info
} from 'lucide-react';
import {
  DISTRIBUTION_JOURNEY_STAGES,
  type JourneyStageDetail
} from './data/distributionJourneyData';
import type { DistributionRepresentationView } from './DistributionCommandHeader';

interface MasterDistributionJourneyProps {
  locale: 'fr' | 'en';
  activeView?: DistributionRepresentationView;
  onSelectEquipment?: (equipmentId: string) => void;
}

export const MasterDistributionJourney: React.FC<MasterDistributionJourneyProps> = ({
  locale,
  activeView = 'PHYSICAL',
  onSelectEquipment
}) => {
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [journeyDirection, setJourneyDirection] = useState<'DOWNSTREAM' | 'UPSTREAM'>('DOWNSTREAM');

  const currentStage: JourneyStageDetail =
    DISTRIBUTION_JOURNEY_STAGES.find((s) => s.id === currentStageId) ||
    DISTRIBUTION_JOURNEY_STAGES[0];

  const handleNext = () => {
    if (journeyDirection === 'DOWNSTREAM') {
      if (currentStageId < 10) setCurrentStageId((prev) => prev + 1);
    } else {
      if (currentStageId > 1) setCurrentStageId((prev) => prev - 1);
    }
  };

  const handlePrev = () => {
    if (journeyDirection === 'DOWNSTREAM') {
      if (currentStageId > 1) setCurrentStageId((prev) => prev - 1);
    } else {
      if (currentStageId < 10) setCurrentStageId((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Journey Direction & Mode Switcher Bar */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {locale === 'fr'
                ? 'PARCOURS ÉLECTRIQUE DISTRIBUTION HTA → BT'
                : 'MV → LV ELECTRICAL DISTRIBUTION JOURNEY'}
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {locale === 'fr'
                ? 'Exploration continue en 10 étapes du poste source jusqu\'aux récepteurs finaux'
                : '10-stage continuous exploration from primary substation down to consumer loads'}
            </p>
          </div>
        </div>

        {/* Direction Toggle (Source -> Consumer vs. Consumer -> Source) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">
            {locale === 'fr' ? 'Sens d\'exploration :' : 'Direction:'}
          </span>
          <div className="flex items-center p-1 rounded-xl bg-[#05070B] border border-[#1E2634]">
            <button
              type="button"
              onClick={() => setJourneyDirection('DOWNSTREAM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                journeyDirection === 'DOWNSTREAM'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Poste → Usager' : 'Substation → Consumer'}</span>
            </button>
            <button
              type="button"
              onClick={() => setJourneyDirection('UPSTREAM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                journeyDirection === 'UPSTREAM'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Usager → Poste' : 'Consumer → Substation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 10 Stages Stepper Navigation Ribbon */}
      <div className="p-3 rounded-2xl bg-[#070B12] border border-[#1C2533] shadow-lg overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {DISTRIBUTION_JOURNEY_STAGES.map((stage) => {
            const isSelected = stage.id === currentStageId;
            const isPassed = stage.id < currentStageId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setCurrentStageId(stage.id)}
                className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                    : isPassed
                    ? 'bg-[#0E1522] text-amber-300/80 border-amber-900/40 hover:border-amber-600'
                    : 'bg-[#0A0E17] text-slate-400 border-[#1E2634] hover:text-white hover:border-slate-600'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-slate-950 text-amber-400'
                      : isPassed
                      ? 'bg-amber-950 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {stage.id}
                </span>
                <div className="text-left">
                  <div className="text-[10px] opacity-80 uppercase tracking-wider">
                    {stage.voltage_level.split(' ')[0]}
                  </div>
                  <div className="text-xs font-bold truncate max-w-[130px]">
                    {locale === 'fr'
                      ? stage.title_fr.split('. ')[1] || stage.title_fr
                      : stage.title_en.split('. ')[1] || stage.title_en}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Active Stage Deep Engineering Card */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-[#222C3D] shadow-2xl space-y-6">
        {/* Header of Active Stage */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1E2838]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
                STAGE {currentStage.id} / 10
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-xs font-bold">
                {currentStage.voltage_level}
              </span>
              <span className="text-slate-500 font-bold">|</span>
              <span className="text-xs text-slate-400">{currentStage.code}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {locale === 'fr' ? currentStage.title_fr : currentStage.title_en}
            </h2>
          </div>

          {/* Previous / Next Stage Quick Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={journeyDirection === 'DOWNSTREAM' ? currentStageId === 1 : currentStageId === 10}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
              title={locale === 'fr' ? 'Étape précédente' : 'Previous stage'}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={journeyDirection === 'DOWNSTREAM' ? currentStageId === 10 : currentStageId === 1}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>{locale === 'fr' ? 'Étape Suivante' : 'Next Stage'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Synchronized Representation Content based on activeView */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1: Physical Reality & Construction */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeView === 'PHYSICAL'
                ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/30'
                : 'bg-[#0E1420] border-[#1E2636]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Building2 className="h-4 w-4 text-amber-400" />
              <span>{locale === 'fr' ? '1. Réalité Physique & Génie Civil' : '1. Physical & Civil Reality'}</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? currentStage.physical_description_fr
                : currentStage.physical_description_en}
            </p>
          </div>

          {/* Card 2: Electrical Schema & SLD Topology */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeView === 'ELECTRICAL_SLD'
                ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/30'
                : 'bg-[#0E1420] border-[#1E2636]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <Activity className="h-4 w-4 text-sky-400" />
              <span>{locale === 'fr' ? '2. Rôle Électrique & Schéma SLD' : '2. Electrical SLD Schema'}</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? currentStage.electrical_sld_fr
                : currentStage.electrical_sld_en}
            </p>
          </div>

          {/* Card 3: Functional Role & Automation */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeView === 'FUNCTIONAL'
                ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/30'
                : 'bg-[#0E1420] border-[#1E2636]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sliders className="h-4 w-4 text-emerald-400" />
              <span>{locale === 'fr' ? '3. Rôle Fonctionnel & Téléconduite' : '3. Functional & Automation'}</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr'
                ? currentStage.functional_role_fr
                : currentStage.functional_role_en}
            </p>
          </div>
        </div>

        {/* Primary Apparatus in this Stage */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-amber-400" />
            <span>{locale === 'fr' ? 'Appareillages Clés de cette Étape :' : 'Key Apparatus at this Stage:'}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {currentStage.main_apparatus_fr.map((app_fr, idx) => {
              const app_en = currentStage.main_apparatus_en[idx] || app_fr;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#090D16] border border-[#20293A] flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-200">
                    {locale === 'fr' ? app_fr : app_en}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 text-[10px] font-bold">
                    IEC
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Protection, Earthing, Failure Mode & Restoration Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Protection & Earthing */}
          <div className="p-4 rounded-xl bg-[#080C14] border border-[#1D2533] space-y-3">
            <div>
              <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Plan de Protection :' : 'Protection Scheme:'}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {locale === 'fr' ? currentStage.protection_fr : currentStage.protection_en}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Régime de Terre & Sécurité :' : 'Earthing & Neutral System:'}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {locale === 'fr' ? currentStage.earthing_fr : currentStage.earthing_en}
              </p>
            </div>
          </div>

          {/* Failure Mode & Restoration Process */}
          <div className="p-4 rounded-xl bg-[#080C14] border border-[#1D2533] space-y-3">
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Mode de Défaillance Typique :' : 'Typical Failure Mode:'}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {locale === 'fr' ? currentStage.failure_mode_fr : currentStage.failure_mode_en}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Procédure de Rétablissement :' : 'Restoration Workflow:'}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {locale === 'fr' ? currentStage.restoration_fr : currentStage.restoration_en}
              </p>
            </div>
          </div>
        </div>

        {/* Upstream / Downstream Traceability Anchor */}
        <div className="p-3.5 rounded-xl bg-[#070A10] border border-[#1C2432] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">{locale === 'fr' ? 'Amont :' : 'Upstream:'}</span>
            <span className="text-amber-300">
              {locale === 'fr' ? currentStage.upstream_link_fr : currentStage.upstream_link_en}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-600 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">{locale === 'fr' ? 'Aval :' : 'Downstream:'}</span>
            <span className="text-sky-300">
              {locale === 'fr' ? currentStage.downstream_link_fr : currentStage.downstream_link_en}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
