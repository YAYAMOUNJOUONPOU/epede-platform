// src/components/installations/InstallationScenariosAndSafetyExplorer.tsx
// EPEDE D06 - Fault & Disturbance Scenarios Simulator + 8-Step LOTO Safety Workflow

import React, { useState } from 'react';
import {
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Zap,
  Lock,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Info,
  ArrowRight,
  Calculator
} from 'lucide-react';
import {
  INSTALLATION_SCENARIOS,
  LOTO_SAFETY_WORKFLOW,
  type FaultScenario,
  type LotoStep
} from './data/installationCatalog';

interface InstallationScenariosAndSafetyExplorerProps {
  locale: 'fr' | 'en';
  onNavigateToWorkbenchTab?: (tabKey: string) => void;
}

export const InstallationScenariosAndSafetyExplorer: React.FC<InstallationScenariosAndSafetyExplorerProps> = ({
  locale,
  onNavigateToWorkbenchTab
}) => {
  const [activeTab, setActiveTab] = useState<'SCENARIOS' | 'LOTO_PROCEDURE'>('SCENARIOS');

  // Scenario Simulator State
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // LOTO State
  const [activeLotoStepIndex, setActiveLotoStepIndex] = useState<number>(0);

  const activeScenario: FaultScenario = INSTALLATION_SCENARIOS[selectedScenarioIndex];
  const steps =
    locale === 'fr' ? activeScenario.system_response_steps_fr : activeScenario.system_response_steps_en;

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleResetScenario = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const activeLotoStep: LotoStep = LOTO_SAFETY_WORKFLOW[activeLotoStepIndex];

  return (
    <div className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 text-[10px]">
              FAULTS, ANOMALIES & LOTO SAFETY
            </span>
            <span className="text-slate-400 text-xs">Sélectivité, Protection des Personnes & Consignation</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1">
            {locale === 'fr'
              ? 'Scénarios de Défauts Électrotechniques & Procédure de Sécurité LOTO'
              : 'Electrotechnical Fault Scenarios & LOTO Safe Maintenance Workflow'}
          </h2>
        </div>

        {/* Tab switch between Scenarios and LOTO */}
        <div className="flex rounded-xl bg-[#080B12] p-1 border border-[#1E2738]">
          <button
            type="button"
            onClick={() => setActiveTab('SCENARIOS')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-[10px] font-bold transition-all ${
              activeTab === 'SCENARIOS'
                ? 'bg-rose-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '5 Scénarios de Défaut' : '5 Fault Scenarios'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LOTO_PROCEDURE')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-[10px] font-bold transition-all ${
              activeTab === 'LOTO_PROCEDURE'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Consignation LOTO (8 Étapes)' : 'LOTO Workflow (8 Steps)'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'SCENARIOS' ? (
        /* SECTION 1: FAULT SCENARIOS SIMULATOR */
        <div className="space-y-4">
          {/* Scenario Selector Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {INSTALLATION_SCENARIOS.map((scen, idx) => {
              const isSelected = idx === selectedScenarioIndex;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenarioIndex(idx);
                    setCurrentStepIndex(0);
                    setIsPlaying(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-slate-950 border-rose-400 font-bold shadow-md shadow-rose-500/20'
                      : 'bg-[#0E1522] text-slate-300 border-[#1C2538] hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] mb-1">
                    <span className="opacity-75">#{idx + 1}</span>
                    <span
                      className={`px-1 rounded text-[8px] font-bold ${
                        scen.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300'
                          : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {scen.severity}
                    </span>
                  </div>
                  <div className="text-[10px] line-clamp-2 leading-tight">
                    {locale === 'fr' ? scen.title_fr.split('.')[1] : scen.title_en.split('.')[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Card with Timeline Progression */}
          <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#1C2538]">
              <div>
                <h3 className="text-xs font-bold text-white">
                  {locale === 'fr' ? activeScenario.title_fr : activeScenario.title_en}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {locale === 'fr' ? 'Déclencheur initial : ' : 'Trigger: '}
                  <strong className="text-amber-400">
                    {locale === 'fr' ? activeScenario.initial_trigger_fr : activeScenario.initial_trigger_en}
                  </strong>
                </span>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetScenario}
                  className="p-1.5 rounded-lg bg-[#080B12] text-slate-400 hover:text-white border border-[#1C2538] cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="p-1.5 rounded-lg bg-[#080B12] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-[#1C2538] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 text-rose-400 font-bold text-xs">
                  {currentStepIndex + 1} / {steps.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStepIndex === steps.length - 1}
                  className="p-1.5 rounded-lg bg-[#080B12] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-[#1C2538] cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? activeScenario.description_fr : activeScenario.description_en}
            </p>

            {/* Step-by-Step Microsecond Timeline Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {locale === 'fr' ? 'Chronologie Physique d\'Intervention :' : 'Physical Event Progression:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {steps.map((st, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isPast = idx < currentStepIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1 ${
                        isCurrent
                          ? 'bg-rose-950/40 border-rose-500 text-white shadow-md shadow-rose-950'
                          : isPast
                          ? 'bg-[#080B12] border-emerald-800/40 text-slate-300'
                          : 'bg-[#080B12] border-[#1C2538] text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="font-bold text-rose-400">{st.time}</span>
                        <span>Étape {st.step}</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-200">{st.title}</div>
                      <p className="text-[9px] font-sans line-clamp-2 leading-relaxed text-slate-400">
                        {st.action}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outcome & Selectivity Conclusion Strip */}
            <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] flex flex-wrap items-center justify-between gap-2 text-[10px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Résultat de la protection :</span>
                <strong className="text-emerald-400">
                  {locale === 'fr'
                    ? activeScenario.selective_isolation_outcome_fr
                    : activeScenario.selective_isolation_outcome_en}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Charges impactées :</span>
                <strong className="text-amber-300">{activeScenario.unserved_loads_affected}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Référence Normative :</span>
                <strong className="text-sky-300">{activeScenario.standards_reference}</strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SECTION 2: 8-STEP LOTO SAFETY WORKFLOW */
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>
              {locale === 'fr'
                ? 'Procédure réglementaire de consignation électrique selon CEI 60900, NF C 18-510 & OSHA 1910.147. Les 8 étapes doivent être exécutées scrupuleusement dans l\'ordre.'
                : 'Regulatory Lockout/Tagout (LOTO) maintenance procedure per IEC 60900, NF C 18-510 & OSHA 1910.147. All 8 sequential stages must be strictly adhered to.'}
            </span>
          </div>

          {/* 8-Step Interactive Progress Tracker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
            {LOTO_SAFETY_WORKFLOW.map((loto, idx) => {
              const isSelected = idx === activeLotoStepIndex;
              return (
                <button
                  key={loto.code}
                  type="button"
                  onClick={() => setActiveLotoStepIndex(idx)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-[#0E1522] text-slate-300 border-[#1C2538] hover:border-emerald-400'
                  }`}
                >
                  <div className="text-[10px] font-bold">{loto.code}</div>
                  <div className="text-[8px] truncate mt-0.5">
                    {locale === 'fr' ? loto.title_fr.split('.')[1] : loto.title_en.split('.')[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected LOTO Step Card */}
          <div className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#1C2538]">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white">
                  {locale === 'fr' ? activeLotoStep.title_fr : activeLotoStep.title_en}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">
                Étape {activeLotoStep.stepNumber} sur 8
              </span>
            </div>

            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {locale === 'fr' ? activeLotoStep.description_fr : activeLotoStep.description_en}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  {locale === 'fr' ? 'Équipements & Outillage Requis :' : 'Required Safety Equipment:'}
                </span>
                <ul className="space-y-1 text-slate-300 font-sans">
                  {(locale === 'fr' ? activeLotoStep.tools_required_fr : activeLotoStep.tools_required_en).map(
                    (tool, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-amber-400" />
                        <span>{tool}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-[#080B12] border border-[#1C2538] space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  {locale === 'fr' ? 'Danger Mortel Écarté :' : 'Fatal Danger Mitigated:'}
                </span>
                <p className="text-slate-300 font-sans leading-relaxed">
                  {locale === 'fr' ? activeLotoStep.danger_avoided_fr : activeLotoStep.danger_avoided_en}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Gateway to Arc Flash, Selectivity & Compliance Audit */}
      {onNavigateToWorkbenchTab && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-300">
              {locale === 'fr'
                ? 'Calculer l\'énergie incidente d\'arc flash & la sélectivité dans l\'Atelier Projet :'
                : 'Calculate arc flash incident energy & protection selectivity in Design Workbench:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToWorkbenchTab('ARC_FLASH_SAFETY')}
              className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>{locale === 'fr' ? '20. Risque Arc Électrique (Arc Flash)' : '20. Arc Flash Safety'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToWorkbenchTab('SELECTIVITY_COORDINATION')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>{locale === 'fr' ? '4. Sélectivité & Courbes TCC' : '4. Selectivity & TCC'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
