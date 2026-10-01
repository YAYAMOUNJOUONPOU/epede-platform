// src/components/installations/MasterInstallationJourney.tsx
// EPEDE D06 - 12-Stage Master Journey from Utility Interface to Useful Energy

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  MASTER_JOURNEY_STAGES,
  type MasterJourneyStage
} from './data/installationCatalog';

interface MasterInstallationJourneyProps {
  locale: 'fr' | 'en';
  selectedStageId: string;
  onSelectStage: (stageId: string) => void;
}

export const MasterInstallationJourney: React.FC<MasterInstallationJourneyProps> = ({
  locale,
  selectedStageId,
  onSelectStage
}) => {
  const [traceDirection, setTraceDirection] = useState<'FORWARD' | 'REVERSE'>('FORWARD');

  const activeStage =
    MASTER_JOURNEY_STAGES.find((s) => s.id === selectedStageId) || MASTER_JOURNEY_STAGES[0];

  const handleNext = () => {
    const currentIndex = MASTER_JOURNEY_STAGES.findIndex((s) => s.id === activeStage.id);
    if (currentIndex < MASTER_JOURNEY_STAGES.length - 1) {
      onSelectStage(MASTER_JOURNEY_STAGES[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = MASTER_JOURNEY_STAGES.findIndex((s) => s.id === activeStage.id);
    if (currentIndex > 0) {
      onSelectStage(MASTER_JOURNEY_STAGES[currentIndex - 1].id);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0B0F19] border border-[#20293A] space-y-4 font-mono text-xs">
      {/* Header bar with bidirectional tracing switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[10px]">
              12-STEP END-TO-END JOURNEY
            </span>
            <span className="text-slate-400 text-xs">
              {locale === 'fr'
                ? 'Du Raccordement HTA/BT à l\'Énergie Utile'
                : 'From MV/LV Intake to Useful Energy Conversion'}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1">
            {locale === 'fr' ? activeStage.name_fr : activeStage.name_en}
          </h2>
        </div>

        {/* Tracing Direction Switch & Step Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[#090D15] p-1 border border-[#1E2738]">
            <button
              type="button"
              onClick={() => setTraceDirection('FORWARD')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer text-[10px] font-bold transition-all ${
                traceDirection === 'FORWARD'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRight className="h-3 w-3" />
              <span>{locale === 'fr' ? 'Flux d\'Énergie (Aval)' : 'Power Flow (Downstream)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setTraceDirection('REVERSE')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer text-[10px] font-bold transition-all ${
                traceDirection === 'REVERSE'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowLeft className="h-3 w-3" />
              <span>{locale === 'fr' ? 'Boucle de Défaut (Amont)' : 'Fault Loop (Upstream)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeStage.stepNumber === 1}
              className="p-1.5 rounded-lg bg-[#141C2B] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-[#20293A]"
              title={locale === 'fr' ? 'Étape précédente' : 'Previous step'}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-amber-400 font-bold text-[11px]">
              {activeStage.stepNumber} / 12
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={activeStage.stepNumber === 12}
              className="p-1.5 rounded-lg bg-[#141C2B] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-[#20293A]"
              title={locale === 'fr' ? 'Étape suivante' : 'Next step'}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 12-Step Horizontal Interactive Stage Rail */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500/20">
        <div className="flex items-center gap-1.5 min-w-[960px]">
          {MASTER_JOURNEY_STAGES.map((stage) => {
            const isSelected = stage.id === activeStage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(stage.id)}
                className={`flex-1 p-2.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-[#0E1522] text-slate-400 border-[#1C2538] hover:border-amber-400/50 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-slate-950 text-amber-400' : 'bg-[#182133] text-slate-300'
                    }`}
                  >
                    {stage.code}
                  </span>
                  <span className="text-[8px] opacity-75">{stage.voltage_level.split(' ')[0]}</span>
                </div>
                <div className="text-[10px] leading-tight line-clamp-2">
                  {locale === 'fr' ? stage.name_fr : stage.name_en}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Stage Exploration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
        {/* Left 2 Cols: Description, Technical Details & Operations */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-[#0E1522] border border-[#1E2738] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold text-[10px]">
              {locale === 'fr' ? 'CATÉGORIE : ' : 'CATEGORY: '}
              {activeStage.category}
            </span>
            <span className="text-[11px] text-slate-300">
              {locale === 'fr' ? 'Tension nominale : ' : 'Rated Voltage: '}
              <strong className="text-amber-400">{activeStage.voltage_level}</strong>
            </span>
          </div>

          <p className="text-sm text-slate-200 font-sans leading-relaxed">
            {locale === 'fr' ? activeStage.short_summary_fr : activeStage.short_summary_en}
          </p>

          <div className="p-3 rounded-lg bg-[#090D15] border border-[#1C2538] space-y-1.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              {locale === 'fr'
                ? 'Caractéristiques Électrotechniques & Rôle dans l\'Installation :'
                : 'Electrotechnical Specifications & Installation Role:'}
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? activeStage.technical_details_fr : activeStage.technical_details_en}
            </p>
          </div>

          {/* Upstream / Downstream Traversal Indicators */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px]">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ArrowLeft className="h-3 w-3 text-sky-400" />
              <span>{locale === 'fr' ? 'Origine Amont :' : 'Upstream Origin:'}</span>
              <span className="text-slate-200 font-bold">
                {activeStage.upstream_node_id || (locale === 'fr' ? 'Réseau HTA MT/BT' : 'MV Grid Feed')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <ArrowRight className="h-3 w-3 text-amber-400" />
              <span>{locale === 'fr' ? 'Destination Aval :' : 'Downstream Target:'}</span>
              <span className="text-slate-200 font-bold">
                {activeStage.downstream_node_id || (locale === 'fr' ? 'Travail / Énergie Utile' : 'Useful Work / End-Use')}
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Associated Norms & Protection Apparatus */}
        <div className="p-4 rounded-xl bg-[#0E1522] border border-[#1E2738] space-y-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              {locale === 'fr' ? 'Normes Applicables :' : 'Applicable Standards:'}
            </span>
            <div className="flex flex-wrap gap-1">
              {activeStage.associated_standards.map((std, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/60 text-sky-300 text-[10px] font-bold"
                >
                  {std}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1C2538]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              {locale === 'fr' ? 'Organes de Protection Associés :' : 'Associated Protection Devices:'}
            </span>
            <div className="space-y-1">
              {activeStage.protection_apparatus.map((app, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300 font-sans">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-[10px] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>
              {locale === 'fr'
                ? 'Conformité vérifiée selon les règles de sélectivité amont-aval'
                : 'Design validated against upstream-downstream grading criteria'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
