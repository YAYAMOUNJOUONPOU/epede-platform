// src/components/journey/FaultScenariosModal.tsx
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Layers, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { FAULT_SCENARIOS } from './data/ecosystemData';
import { FaultScenarioType } from './types';

interface FaultScenariosModalProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onSelectEquipment: (equipmentId: string) => void;
}

export const FaultScenariosModal: React.FC<FaultScenariosModalProps> = ({
  locale,
  isOpen,
  onClose,
  onSelectEquipment,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<FaultScenarioType>('line');
  const [stepIndex, setStepIndex] = useState(0);

  const scenario = FAULT_SCENARIOS.find((s) => s.id === activeScenarioId) || FAULT_SCENARIOS[0];
  const step = scenario.steps[stepIndex] || scenario.steps[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black font-mono text-slate-900 flex items-center gap-2">
                <span>{locale === 'fr' ? 'SCÉNARIOS DE DÉFAUTS & SÉLECTIVITÉ' : 'FAULT SCENARIOS & SELECTIVITY'}</span>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-bold">
                  ANSI / CEI 60255
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr' 
                  ? 'Comment le réseau isole les pannes sans couper les clients sains' 
                  : 'How protection isolates faults while preserving healthy consumers'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Scenario Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {FAULT_SCENARIOS.map((sc) => {
              const isSelected = sc.id === activeScenarioId;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setActiveScenarioId(sc.id);
                    setStepIndex(0);
                  }}
                  className={`p-3 rounded-xl border text-left font-mono transition-all ${
                    isSelected
                      ? 'bg-rose-50 border-rose-300 shadow-2xs'
                      : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className={`text-xs font-bold block ${isSelected ? 'text-rose-700' : 'text-slate-800'}`}>
                    {sc.title[locale]}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {sc.location[locale]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Overview */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4 font-mono text-xs">
            <div>
              <span className="text-rose-700 font-bold block mb-1">LOCALISATION :</span>
              <span className="text-slate-800 font-medium">{scenario.location[locale]}</span>
              <p className="text-slate-600 text-xs mt-1 font-sans">{scenario.description[locale]}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px] block">ÉTAPE ACTIVE</span>
              <span className="text-sm font-bold text-slate-900">
                {stepIndex + 1} / {scenario.steps.length}
              </span>
            </div>
          </div>

          {/* Step Progression Timeline */}
          <div className="space-y-4">
            {/* Step badges */}
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
              {scenario.steps.map((st, idx) => {
                const isCurrent = idx === stepIndex;
                const isPassed = idx < stepIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStepIndex(idx)}
                    className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all shadow-2xs ${
                      isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-100 shadow-sm'
                        : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-500 border border-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Step Detailed Card */}
            <div className={`p-5 rounded-xl border font-mono space-y-3 transition-colors ${
              step.status === 'disturbed'
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : step.status === 'tripped'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : step.status === 'restored'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50/70 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                  <span>{step.title[locale]}</span>
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  step.status === 'disturbed' 
                    ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                    : step.status === 'tripped'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : step.status === 'restored'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-200 text-slate-700'
                }`}>
                  {step.status}
                </span>
              </div>

              <p className="text-xs font-sans leading-relaxed text-slate-700">
                {step.detail[locale]}
              </p>

              {/* Sollicited components */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-500 font-medium">Équipements réagissant :</span>
                {step.activeComponents.map((cId) => (
                  <button
                    key={cId}
                    type="button"
                    onClick={() => onSelectEquipment(cId)}
                    className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-[11px] shadow-2xs"
                  >
                    {cId}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step navigation controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 text-xs font-mono border border-slate-200 shadow-2xs"
            >
              ← {locale === 'fr' ? 'Étape Précédente' : 'Previous Step'}
            </button>

            <button
              type="button"
              onClick={() => setStepIndex(0)}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 shadow-2xs"
              title="Réinitialiser"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setStepIndex((prev) => Math.min(scenario.steps.length - 1, prev + 1))}
              disabled={stepIndex >= scenario.steps.length - 1}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-40 text-xs font-mono flex items-center gap-1 shadow-xs"
            >
              <span>{locale === 'fr' ? 'Étape Suivante' : 'Next Step'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
