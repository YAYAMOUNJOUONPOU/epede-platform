// src/components/distribution/DistributionFaultScenariosSimulator.tsx
// EPEDE D05 - Distribution Fault, Isolation & Restoration Step-by-Step Simulator

import React, { useState } from 'react';
import {
  AlertTriangle,
  Play,
  RotateCcw,
  FastForward,
  CheckCircle2,
  Clock,
  Users,
  ShieldAlert,
  Zap,
  Layers,
  Building2,
  TreePine,
  ArrowRight
} from 'lucide-react';
import {
  DISTRIBUTION_SCENARIOS,
  type DistributionFaultScenario,
  type ScenarioStep
} from './data/distributionScenariosData';

interface DistributionFaultScenariosSimulatorProps {
  locale: 'fr' | 'en';
}

export const DistributionFaultScenariosSimulator: React.FC<DistributionFaultScenariosSimulatorProps> = ({
  locale
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('SCENARIO_UNDERGROUND_RING');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const scenario: DistributionFaultScenario =
    DISTRIBUTION_SCENARIOS.find((s) => s.id === activeScenarioId) ||
    DISTRIBUTION_SCENARIOS[1];

  const currentStep: ScenarioStep = scenario.steps[currentStepIndex] || scenario.steps[0];

  const handleNextStep = () => {
    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header & Scenario Switcher */}
      <div className="p-4 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? 'SIMULATEUR DE DÉFAUTS, ISOLEMENT & RESTAURATION (FLISR)'
                  : 'FAULT, ISOLATION & RESTORATION SIMULATOR (FLISR)'}
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Déroulement séquentiel pas-à-pas des automatismes de détection, coupure et réalimentation'
                  : 'Step-by-step chronological simulation of automated fault detection, isolation and restoration'}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Scenario Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-[#1C2534]">
          {DISTRIBUTION_SCENARIOS.map((scen) => {
            const isSelected = scen.id === activeScenarioId;
            return (
              <button
                key={scen.id}
                type="button"
                onClick={() => {
                  setActiveScenarioId(scen.id);
                  setCurrentStepIndex(0);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                    : 'bg-[#0E1420] text-slate-300 border-[#222E42] hover:border-amber-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] opacity-80 uppercase tracking-wider mb-1">
                  {scen.category}
                </div>
                <div className="text-xs font-bold truncate">
                  {locale === 'fr' ? scen.title_fr : scen.title_en}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Scenario Simulation Stage */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-2xl space-y-6">
        {/* Scenario Overview Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1C2533]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold">
                {scenario.code}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-bold">
                {scenario.standards_reference}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {locale === 'fr' ? scenario.title_fr : scenario.title_en}
            </h2>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
              title={locale === 'fr' ? 'Réinitialiser la simulation' : 'Reset simulation'}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all cursor-pointer"
            >
              {locale === 'fr' ? 'Précédent' : 'Previous'}
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={currentStepIndex === scenario.steps.length - 1}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <span>{locale === 'fr' ? 'Étape Suivante' : 'Next Step'}</span>
              <FastForward className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Chronological Steps Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {scenario.steps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;
            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : isPassed
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                    : 'bg-[#0E1522] text-slate-400 border-[#1E2738]'
                }`}
              >
                <div className="text-[10px] font-mono opacity-80 mb-0.5">
                  {step.timeLabel}
                </div>
                <div className="text-xs font-bold truncate">
                  {locale === 'fr' ? step.title_fr : step.title_en}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Details & Customer Impact Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Action Description */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-xs font-bold">
                ÉTAPE {currentStep.stepNumber} / {scenario.steps.length} · {currentStep.timeLabel}
              </span>
              <span className="text-xs text-slate-400">
                {locale === 'fr' ? 'Séquence Chronologique' : 'Sequence Event'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">
              {locale === 'fr' ? currentStep.title_fr : currentStep.title_en}
            </h3>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? currentStep.description_fr : currentStep.description_en}
            </p>

            <div className="p-3 rounded-lg bg-[#060910] border border-slate-800 text-xs text-amber-300 font-mono">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">
                {locale === 'fr' ? 'Télémétrie & État Réseau :' : 'Telemetry & Network State:'}
              </span>
              {locale === 'fr' ? currentStep.system_state_fr : currentStep.system_state_en}
            </div>
          </div>

          {/* Customer Impact Gauge & Outage Metrics */}
          <div className="p-5 rounded-xl bg-[#0B0F19] border border-[#1E2738] space-y-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-amber-400" />
                <span>{locale === 'fr' ? 'Impact Clients :' : 'Customer Impact:'}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white">
                    {currentStep.affected_customers}
                  </span>
                  <span className="text-xs text-slate-400">
                    {locale === 'fr' ? 'clients coupés' : 'customers unserved'}
                  </span>
                </div>

                {/* Progress bar of outage */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      currentStep.outage_percent > 50
                        ? 'bg-rose-500'
                        : currentStep.outage_percent > 0
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${currentStep.outage_percent}%` }}
                  />
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  {currentStep.outage_percent}% {locale === 'fr' ? 'du départ' : 'of feeder'}
                </div>
              </div>
            </div>

            {/* Protections in loop */}
            <div className="pt-3 border-t border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {locale === 'fr' ? 'Protections Impliquées :' : 'Protections Active:'}
              </span>
              <div className="flex flex-wrap gap-1">
                {scenario.protection_involved.map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
