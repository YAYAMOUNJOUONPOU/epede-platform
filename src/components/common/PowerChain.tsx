// src/components/common/PowerChain.tsx
// EPEDE Universal Canonical Power Chain Component (Task T-104)

import React from 'react';
import { ArrowLeft, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import {
  CANONICAL_POWER_STAGES,
  CanonicalPowerStage,
} from '../../data/canonicalPowerChain';

export interface PowerChainProps {
  locale: 'fr' | 'en';
  currentStageId?: string;
  onSelectStage?: (stage: CanonicalPowerStage) => void;
  showDetails?: boolean;
  showNavigationButtons?: boolean;
  className?: string;
}

export const PowerChain: React.FC<PowerChainProps> = ({
  locale,
  currentStageId = 'stage-01',
  onSelectStage,
  showDetails = false,
  showNavigationButtons = true,
  className = '',
}) => {
  const isFr = locale === 'fr';

  const currentIdx = Math.max(
    0,
    CANONICAL_POWER_STAGES.findIndex((s) => s.id === currentStageId)
  );
  const activeStage = CANONICAL_POWER_STAGES[currentIdx];

  const upstreamStage =
    currentIdx > 0 ? CANONICAL_POWER_STAGES[currentIdx - 1] : null;
  const downstreamStage =
    currentIdx < CANONICAL_POWER_STAGES.length - 1
      ? CANONICAL_POWER_STAGES[currentIdx + 1]
      : null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Horizontal Chain Bar */}
      <div className="rounded-2xl bg-[#0B1522]/90 border border-white/10 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#B8F000]" />
            <span className="font-mono text-xs font-bold text-[#F4F1E8] tracking-wider uppercase">
              {isFr
                ? 'Chaîne Physique de Puissance (Centrale → Récepteur)'
                : 'Physical Power Chain (Generation → Final Load)'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#B8F000] font-bold px-2 py-0.5 rounded bg-[#B8F000]/10 border border-[#B8F000]/30">
            {activeStage.stageNumber} / 09 · {activeStage.voltage}
          </span>
        </div>

        {/* 9 Stage Stepper Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 overflow-x-auto pb-1">
          {CANONICAL_POWER_STAGES.map((stage, idx) => {
            const isSelected = stage.id === currentStageId;
            const isPast = idx < currentIdx;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage && onSelectStage(stage)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#B8F000] text-[#102A43] border-[#B8F000] shadow-[0_0_15px_rgba(184,240,0,0.35)] font-bold'
                    : isPast
                    ? 'bg-white/[0.06] text-white border-white/20 hover:border-white/40'
                    : 'bg-white/[0.02] text-white/70 border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                }`}
                title={isFr ? stage.title.fr : stage.title.en}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`font-mono text-[10px] font-black px-1.5 py-0.2 rounded ${
                      isSelected
                        ? 'bg-[#102A43] text-[#B8F000]'
                        : isPast
                        ? 'bg-white/15 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {stage.stageNumber}
                  </span>
                  {isPast && !isSelected && (
                    <CheckCircle2 className="w-3 h-3 text-[#B8F000]/70" />
                  )}
                </div>
                <div className="text-[11px] font-bold leading-tight line-clamp-2">
                  {isFr ? stage.shortTitle.fr : stage.shortTitle.en}
                </div>
                <div
                  className={`text-[9px] font-mono mt-1 truncate ${
                    isSelected ? 'text-[#102A43]/80 font-bold' : 'text-white/40'
                  }`}
                >
                  {stage.voltage}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upstream & Downstream Contextual Breadcrumb Buttons */}
      {showNavigationButtons && (upstreamStage || downstreamStage) && (
        <div className="flex items-center justify-between gap-3 text-xs font-mono">
          {upstreamStage ? (
            <button
              type="button"
              onClick={() => onSelectStage && onSelectStage(upstreamStage)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/10 hover:border-white/25 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B8F000]" />
              <span>
                {isFr ? 'Amont :' : 'Upstream:'}{' '}
                <strong className="text-white">
                  {upstreamStage.stageNumber}.{' '}
                  {isFr
                    ? upstreamStage.shortTitle.fr
                    : upstreamStage.shortTitle.en}
                </strong>
              </span>
            </button>
          ) : (
            <div />
          )}

          {downstreamStage && (
            <button
              type="button"
              onClick={() => onSelectStage && onSelectStage(downstreamStage)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/10 hover:border-white/25 transition-all cursor-pointer ml-auto"
            >
              <span>
                {isFr ? 'Aval :' : 'Downstream:'}{' '}
                <strong className="text-white">
                  {downstreamStage.stageNumber}.{' '}
                  {isFr
                    ? downstreamStage.shortTitle.fr
                    : downstreamStage.shortTitle.en}
                </strong>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B8F000]" />
            </button>
          )}
        </div>
      )}

      {/* Optional Expanded Stage Detail Card */}
      {showDetails && activeStage && (
        <div className="rounded-2xl bg-[#0B1522]/95 border border-white/15 p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#B8F000] uppercase tracking-wider">
                {isFr ? `ÉTAPE ${activeStage.stageNumber} SUR 09` : `STAGE ${activeStage.stageNumber} OF 09`}
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {isFr ? activeStage.title.fr : activeStage.title.en}
              </h3>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-lg bg-[#B8F000]/15 border border-[#B8F000]/40 font-mono text-xs font-bold text-[#B8F000]">
              {activeStage.voltage}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <span className="font-mono font-bold text-[#B8F000] uppercase tracking-wider text-[10px]">
                {isFr ? 'Principe Physique Fondamental' : 'Core Physical Principle'}
              </span>
              <p className="text-white/80 leading-relaxed">
                {isFr ? activeStage.physicalPrinciple.fr : activeStage.physicalPrinciple.en}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <span className="font-mono font-bold text-[#38BDF8] uppercase tracking-wider text-[10px]">
                {isFr ? 'Rôle & Finalité Système' : 'System Purpose & Objective'}
              </span>
              <p className="text-white/80 leading-relaxed">
                {isFr ? activeStage.purpose.fr : activeStage.purpose.en}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#102A43]/40 border border-white/10 space-y-2">
            <span className="font-mono font-bold text-[#D7A64A] uppercase tracking-wider text-[10px]">
              🇨🇲 {isFr ? 'Réalité Terrain au Cameroun' : 'Cameroon Grid Application'}
            </span>
            <p className="text-xs text-white/90 leading-relaxed">
              {isFr ? activeStage.cameroonContext.fr : activeStage.cameroonContext.en}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

