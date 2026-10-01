// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 13 : DÉMARRAGE RÉSEAU NOIR & STABILITÉ HIL
// IEEE 1547.4 Black-Start, Ferranti Effect, Island Restoration & ANSI 25 Synchro
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Zap,
  Radio,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Gauge,
  RotateCw,
  Power,
  TrendingUp,
  Cpu,
  Clock,
  Compass,
} from 'lucide-react';
import {
  BLACK_START_PHASES,
  calculateFerrantiEffect,
  ISLAND_BLOCK_LOAD_STEPS,
  evaluateSynchroCheck,
} from '../../data/hydropowerBlackStartData';
import type {
  BlackStartStepId,
  FerrantiCalculationParams,
  SynchroCheckParameters,
} from '../../types/hydropowerBlackStart';

interface HydropowerBlackStartViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerBlackStartView: React.FC<HydropowerBlackStartViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sequence' | 'ferranti' | 'island' | 'synchro'>('sequence');

  // Sub-Tab 1: Sequence State
  const [selectedPhaseId, setSelectedPhaseId] = useState<BlackStartStepId>('hydro_crank');

  // Sub-Tab 2: Ferranti Calculator State
  const [lineLengthKm, setLineLengthKm] = useState<number>(51.0); // 51 km Nachtigal - Nyom II
  const [lineVoltageNominalKv, setLineVoltageNominalKv] = useState<number>(225.0);
  const [shuntReactorMVAR, setShuntReactorMVAR] = useState<number>(15.0); // 15 MVAR
  const [generatorAbsorptionMVAR, setGeneratorAbsorptionMVAR] = useState<number>(18.0); // 18 MVAR

  // Sub-Tab 4: ANSI 25 Synchro-Check State
  const [voltageDiffPercent, setVoltageDiffPercent] = useState<number>(1.2); // 1.2%
  const [freqDiffHz, setFreqDiffHz] = useState<number>(0.04); // 0.04 Hz
  const [phaseAngleDiffDeg, setPhaseAngleDiffDeg] = useState<number>(2.5); // 2.5 deg
  const [slipRateHzPerSec, setSlipRateHzPerSec] = useState<number>(0.02); // 0.02 Hz/s

  const currentPhase = BLACK_START_PHASES.find((p) => p.id === selectedPhaseId) || BLACK_START_PHASES[0];

  const ferrantiResult = useMemo(() => {
    return calculateFerrantiEffect({
      lineLengthKm,
      lineVoltageNominalKv,
      lineCapacitanceUfPerKm: 0.0095,
      shuntReactorCompensationMVAR: shuntReactorMVAR,
      generatorUnderExcitationMVAR: generatorAbsorptionMVAR,
    });
  }, [lineLengthKm, lineVoltageNominalKv, shuntReactorMVAR, generatorAbsorptionMVAR]);

  const synchroResult = useMemo(() => {
    return evaluateSynchroCheck({
      voltageDifferencePercent: voltageDiffPercent,
      frequencyDifferenceHz: freqDiffHz,
      phaseAngleDifferenceDeg: phaseAngleDiffDeg,
      slipRateHzPerSec: slipRateHzPerSec,
      breakerClosingTimeMs: 80,
    });
  }, [voltageDiffPercent, freqDiffHz, phaseAngleDiffDeg, slipRateHzPerSec]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#141208] via-[#1C180B] to-[#120E06] border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 13 • DÉMARRAGE RÉSEAU NOIR & RESTAURATION HIL' : 'STEP 13 • BLACK-START RESTORATION & HIL DYNAMICS'}
              </span>
              <span className="text-xs font-mono text-neutral-400">IEEE 1547.4 / IEEE 399 / CIGRE WG C4.24</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <Power className="h-6 w-6 text-amber-400" />
              <span>
                {locale === 'fr'
                  ? 'Démarrage Réseau Noir (Black-Start), Effet Ferranti & Synchronisation ANSI 25'
                  : 'Black-Start Sequence, Ferranti Overvoltage & ANSI 25 Synchro-Check'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Procédure complète de reconstitution du Réseau Interconnecté Sud (RIS) après blackout général : groupe diesel 2.5 MVA, lancement turbine hydro G1, compensation Ferranti de la ligne 225 kV et reprise de charge séquentielle de Yaoundé.'
                : 'Full-scale national grid black-start defense plan: 2.5 MVA emergency diesel cranking, Francis unit hydraulic run-up, 225 kV Ferranti capacitive absorption, priority block-load pickup, and ANSI 25 synchro-check.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEEE-1547')}
                className="px-3 py-2 rounded-xl bg-[#26200F] hover:bg-[#382E16] border border-amber-500/40 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>IEEE 1547.4 (Black-Start)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#2A2312]">
          <button
            type="button"
            onClick={() => setActiveSubTab('sequence')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'sequence'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#221C0D] text-neutral-300 hover:text-white border border-[#3D3217]'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Séquence Black-Start (7 Étapes)' : '1. 7-Step Black-Start Sequence'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ferranti')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'ferranti'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#221C0D] text-neutral-300 hover:text-white border border-[#3D3217]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Surtension Ferranti Ligne 225 kV' : '2. 225 kV Line Ferranti Effect'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('island')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'island'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#221C0D] text-neutral-300 hover:text-white border border-[#3D3217]'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Prise de Charge Îlot Yaoundé' : '3. Yaoundé Island Load Pickup'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('synchro')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'synchro'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#221C0D] text-neutral-300 hover:text-white border border-[#3D3217]'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>{locale === 'fr' ? '4. Synchroniseur ANSI 25 (HIL)' : '4. ANSI 25 Synchro-Check Lab'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: 7-PHASE BLACK-START SEQUENCE                              */}
      {/* ==================================================================== */}
      {activeSubTab === 'sequence' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Phase Progress Bar Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {BLACK_START_PHASES.map((phase) => {
              const isSelected = selectedPhaseId === phase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-950/40 shadow-md ring-1 ring-amber-500/50'
                      : 'border-[#252E38] bg-[#0A0E14] hover:bg-[#141A23]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-400">PHASE {phase.stepNumber}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        phase.status === 'completed'
                          ? 'bg-emerald-400'
                          : phase.status === 'active'
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-neutral-600'
                      }`}
                    />
                  </div>
                  <div className="font-bold text-white text-[11px] truncate">{phase.id}</div>
                  <div className="text-[9px] text-neutral-400 mt-1">{phase.durationMinutes} min</div>
                </button>
              );
            })}
          </div>

          {/* Phase Detail Card */}
          <div className="p-6 rounded-2xl border border-amber-500/30 bg-[#0A0E14] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                    Phase {currentPhase.stepNumber} / 7
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {currentPhase.title[locale]}
                  </h3>
                </div>
                <div className="text-neutral-400 text-xs mt-1">
                  Durée Estimée : <strong className="text-cyan-300">{currentPhase.durationMinutes} minutes</strong> | Statut d'Exécution : <strong className="text-emerald-400">{currentPhase.status.toUpperCase()}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#141A23] border border-[#252E38] text-right">
                  <div className="text-[9px] text-neutral-400 uppercase">Tension Jeu de Barres</div>
                  <div className="text-sm font-black text-amber-400">{currentPhase.voltageKv} kV</div>
                </div>
                <div className="p-2 rounded-lg bg-[#141A23] border border-[#252E38] text-right">
                  <div className="text-[9px] text-neutral-400 uppercase">Fréquence Tranche</div>
                  <div className="text-sm font-black text-emerald-400">{currentPhase.frequencyHz.toFixed(1)} Hz</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <span className="text-neutral-400 block text-[9px] uppercase font-bold">Prérequis & Verrouillages Critiques :</span>
                <p className="text-neutral-200 leading-relaxed">{currentPhase.criticalPrerequisites[locale]}</p>

                <div className="pt-2 border-t border-[#252E38] grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    Puissance Active : <span className="text-white font-bold">{currentPhase.activePowerMW} MW</span>
                  </div>
                  <div>
                    Puissance Réactive : <span className="text-cyan-300 font-bold">{currentPhase.reactivePowerMVAR} MVAR</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <span className="text-amber-400 block text-[9px] uppercase font-bold">Actions & Procédures de Sécurité :</span>
                <p className="text-neutral-300 leading-relaxed">{currentPhase.keySafetyActions[locale]}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: 225 KV FERRANTI OVERVOLTAGE CALCULATOR                    */}
      {/* ==================================================================== */}
      {activeSubTab === 'ferranti' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Paramètres Corridor Ligne 225 kV' : '225 kV Corridor Inputs'}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300">
                  LIGNE À VIDE
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Longueur Ligne Nachtigal - Nyom II :' : 'Line Distance:'}</span>
                  <span className="text-white font-bold">{lineLengthKm} km</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="1"
                  value={lineLengthKm}
                  onChange={(e) => setLineLengthKm(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Tension Nominale de Départ :' : 'Sending End Voltage:'}</span>
                  <span className="text-cyan-400 font-bold">{lineVoltageNominalKv} kV</span>
                </div>
                <input
                  type="range"
                  min="210"
                  max="240"
                  step="1"
                  value={lineVoltageNominalKv}
                  onChange={(e) => setLineVoltageNominalKv(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="pt-2 border-t border-[#252E38]">
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Réactance Shunt de Compensation :' : 'Shunt Reactor Compensation:'}</span>
                  <span className="text-emerald-400 font-bold">{shuntReactorMVAR} MVAR</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={shuntReactorMVAR}
                  onChange={(e) => setShuntReactorMVAR(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Absorption Sous-Excitée Alternateur G1 :' : 'G1 Under-Excitation Absorption:'}</span>
                  <span className="text-purple-400 font-bold">-{generatorAbsorptionMVAR} MVAR</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={generatorAbsorptionMVAR}
                  onChange={(e) => setGeneratorAbsorptionMVAR(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>

            {/* Results (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Tension d\'Arrivée au Poste de Nyom II' : 'Receiving End Terminal Voltage (Nyom II)'}</span>
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ferrantiResult.isVoltageSafe
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {ferrantiResult.isVoltageSafe ? 'CONFORME GRILLE' : 'SURTENSION DANGEREUSE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">Tension Arrivée Nyom II</div>
                    <div
                      className={`text-2xl font-black mt-1 ${
                        ferrantiResult.isVoltageSafe ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {ferrantiResult.unloadedReceivingVoltageKv} <span className="text-xs font-normal text-neutral-400">kV</span>
                    </div>
                    <div className="text-[9px] text-neutral-500 mt-0.5">Seuil max admissible : 242 kV</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">Élévation Ferranti</div>
                    <div className="text-2xl font-black text-amber-400 mt-1">
                      +{ferrantiResult.voltageRisePercent} <span className="text-xs font-normal text-neutral-400">%</span>
                    </div>
                    <div className="text-[9px] text-neutral-500 mt-0.5">Effet capacitif à vide</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">MVAR Capacitif Ligne</div>
                    <div className="text-2xl font-black text-cyan-300 mt-1">
                      {ferrantiResult.chargingReactivePowerGeneratedMVAR} <span className="text-xs font-normal text-neutral-400">MVAR</span>
                    </div>
                    <div className="text-[9px] text-neutral-500 mt-0.5">Qc = ω·C·V²</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2 text-[11px]">
                  <div className="text-neutral-400 uppercase font-bold text-[10px]">
                    Régime d'Excitation Alternateur G1 :
                  </div>
                  <div className="text-purple-300 font-bold">
                    {ferrantiResult.generatorOperatingMode[locale]}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141A23] border border-amber-500/30 text-[11px] text-neutral-300 space-y-1 leading-relaxed">
                  <div className="text-amber-400 font-bold uppercase text-[10px]">
                    {locale === 'fr' ? 'Avis Technique d\'Ingénierie Réseau :' : 'Grid Engineering Directive:'}
                  </div>
                  <p>{ferrantiResult.ferrantiMitigationAdvice[locale]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: YAOUNDÉ ISLAND LOAD PICKUP                                */}
      {/* ==================================================================== */}
      {activeSubTab === 'island' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  {locale === 'fr' ? 'Séquence de Prise de Charge par Blocs Prioritaires (Yaoundé)' : 'Yaoundé Priority Block Load Energization'}
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                INERTIE H = 4.2 s
              </span>
            </div>

            <div className="space-y-3">
              {ISLAND_BLOCK_LOAD_STEPS.map((block, idx) => (
                <div key={block.stepId} className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold text-[10px]">
                        BLOC {idx + 1}
                      </span>
                      <span className="font-bold text-white text-xs">{block.targetName[locale]}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        block.priorityClass === 'Tier-1-LifeSafety'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : block.priorityClass === 'Tier-2-WaterInfrastructure'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {block.priorityClass}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div>
                      Puissance Bloc : <strong className="text-white">+{block.blockPowerMW} MW</strong>
                    </div>
                    <div>
                      Puissance Cumulée : <strong className="text-amber-400">{block.cumulativePowerMW} MW</strong>
                    </div>
                    <div>
                      Nadir Fréquence : <strong className="text-emerald-400">{block.expectedFrequencyDipHz} Hz</strong>
                    </div>
                    <div>
                      Récupération Régulateur : <strong className="text-cyan-300">{block.governorRecoveryTimeSec} s</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: ANSI 25 AUTOMATIC SYNCHRONIZER (HIL SIMULATOR)            */}
      {/* ==================================================================== */}
      {activeSubTab === 'synchro' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sync Knobs (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Écarts de Couplage Réseau' : 'Synchro Coupling Offsets'}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                  RELAIS ANSI 25
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Écart de Tension ΔU :' : 'Voltage Delta ΔV:'}</span>
                  <span className={`${synchroResult.voltageOk ? 'text-emerald-400' : 'text-red-400'} font-bold`}>
                    {voltageDiffPercent}% (Limite ±2.0%)
                  </span>
                </div>
                <input
                  type="range"
                  min="-4.0"
                  max="4.0"
                  step="0.1"
                  value={voltageDiffPercent}
                  onChange={(e) => setVoltageDiffPercent(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Écart de Fréquence Δf :' : 'Frequency Delta Δf:'}</span>
                  <span className={`${synchroResult.frequencyOk ? 'text-emerald-400' : 'text-red-400'} font-bold`}>
                    {freqDiffHz} Hz (Limite ±0.10 Hz)
                  </span>
                </div>
                <input
                  type="range"
                  min="-0.25"
                  max="0.25"
                  step="0.01"
                  value={freqDiffHz}
                  onChange={(e) => setFreqDiffHz(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Déphasage Angulaire Δθ :' : 'Phase Angle Delta Δθ:'}</span>
                  <span className={`${synchroResult.phaseAngleOk ? 'text-emerald-400' : 'text-red-400'} font-bold`}>
                    {phaseAngleDiffDeg}° (Limite ±5.0°)
                  </span>
                </div>
                <input
                  type="range"
                  min="-15.0"
                  max="15.0"
                  step="0.5"
                  value={phaseAngleDiffDeg}
                  onChange={(e) => setPhaseAngleDiffDeg(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Vitesse de Glissement :' : 'Slip Rate:'}</span>
                  <span className={`${synchroResult.slipRateOk ? 'text-emerald-400' : 'text-red-400'} font-bold`}>
                    {slipRateHzPerSec} Hz/s (Limite 0.05 Hz/s)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="0.12"
                  step="0.01"
                  value={slipRateHzPerSec}
                  onChange={(e) => setSlipRateHzPerSec(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>

            {/* Visual Synchroscope Dial (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <RotateCw className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Synchroscope Numérique Vectoriel' : 'Vectorial Synchroscope Display'}</span>
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      synchroResult.isPermissiveClosed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-red-950 text-red-300 border border-red-700'
                    }`}
                  >
                    {synchroResult.isPermissiveClosed ? 'PERMISSIF ENCLENCHEMENT' : 'COUPLAGE VERROUILLÉ'}
                  </span>
                </div>

                {/* SVG Synchroscope Dial */}
                <div className="flex items-center justify-center p-4 bg-[#070B0F] rounded-xl border border-[#252E38]">
                  <svg viewBox="0 0 200 200" className="w-48 h-48 select-none">
                    {/* Dial Ring */}
                    <circle cx="100" cy="100" r="85" fill="#0C121A" stroke="#252E38" strokeWidth="3" />
                    {/* Top Zero Target Zone (12 o'clock ± 5 deg) */}
                    <path
                      d="M 92 18 A 85 85 0 0 1 108 18 L 100 100 Z"
                      fill="#10B981"
                      opacity="0.3"
                    />
                    {/* Ticks */}
                    <line x1="100" y1="15" x2="100" y2="30" stroke="#10B981" strokeWidth="2.5" />
                    <line x1="185" y1="100" x2="170" y2="100" stroke="#6B7280" strokeWidth="1.5" />
                    <line x1="15" y1="100" x2="30" y2="100" stroke="#6B7280" strokeWidth="1.5" />
                    <line x1="100" y1="185" x2="100" y2="170" stroke="#6B7280" strokeWidth="1.5" />

                    <text x="100" y="42" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      0° (SYNC)
                    </text>
                    <text x="155" y="104" fill="#9CA3AF" fontSize="8" fontFamily="monospace">
                      SLOW
                    </text>
                    <text x="25" y="104" fill="#9CA3AF" fontSize="8" fontFamily="monospace">
                      FAST
                    </text>

                    {/* Rotating Pointer with calculated angle */}
                    {/* 0 deg is at top (12 o'clock) -> transform rotate from center (100, 100) */}
                    <g transform={`rotate(${phaseAngleDiffDeg}, 100, 100)`}>
                      <line x1="100" y1="100" x2="100" y2="25" stroke={synchroResult.isPermissiveClosed ? '#10B981' : '#EF4444'} strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="100" cy="25" r="4" fill={synchroResult.isPermissiveClosed ? '#10B981' : '#EF4444'} />
                    </g>
                    <circle cx="100" cy="100" r="7" fill="#374151" stroke="#9CA3AF" strokeWidth="2" />
                  </svg>
                </div>

                <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-1.5 text-[11px] leading-relaxed">
                  <div className="text-amber-400 font-bold uppercase text-[10px]">
                    {locale === 'fr' ? 'Statut Relais de Synchronisation ANSI 25 :' : 'ANSI 25 Synchro Relay Status:'}
                  </div>
                  <p className="text-neutral-200">{synchroResult.statusMessage[locale]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
