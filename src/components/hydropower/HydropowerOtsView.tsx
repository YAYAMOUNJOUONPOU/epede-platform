// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 22 : OPERATOR TRAINING SIMULATOR (OTS),
// SCÉNARIOS D'INCIDENTS CRITIQUES, PUPITRE CNO (ISO 11064) & HRA
// ============================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MonitorPlay,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Bell,
  BellOff,
  AlertOctagon,
  ShieldAlert,
  Zap,
  Gauge,
  Activity,
  CheckCircle2,
  Clock,
  UserCheck,
  Flame,
  Layers,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import {
  INCIDENT_SCENARIOS,
  INITIAL_OTS_STATE,
  computeOtsPhysicsStep,
  DEFAULT_ALARM_ANNUNCIATORS,
  OPERATOR_TRAINEES,
} from '../../data/hydropowerOtsData';
import type {
  IncidentScenarioId,
  SimulationSpeed,
  OtsSimulationState,
  AlarmAnnunciatorItem,
} from '../../types/hydropowerOts';

interface HydropowerOtsViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerOtsView: React.FC<HydropowerOtsViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'scenarios' | 'hra_certification'>('console');

  // Simulation state
  const [simState, setSimState] = useState<OtsSimulationState>(INITIAL_OTS_STATE);
  const [annunciators, setAnnunciators] = useState<AlarmAnnunciatorItem[]>(DEFAULT_ALARM_ANNUNCIATORS);
  const [hornActive, setHornActive] = useState<boolean>(false);

  // Active drill execution state
  const [selectedScenarioId, setSelectedScenarioId] = useState<IncidentScenarioId>('SCN_LOAD_REJECTION_420MW');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Timer ref for real-time physics tick
  const timerRef = useRef<number | null>(null);

  // Selected Scenario Details
  const selectedScenario = useMemo(() => {
    return INCIDENT_SCENARIOS.find((s) => s.id === selectedScenarioId) || INCIDENT_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Check if scenario is remediated by operator checklist
  const isScenarioRemediated = useMemo(() => {
    return completedSteps.length >= selectedScenario.operatorRequiredActionsFr.length;
  }, [completedSteps, selectedScenario]);

  // Real-time Physics Clock Tick (every 500ms)
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSimState((prev) => computeOtsPhysicsStep(prev, 0.5, isScenarioRemediated));
    }, 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isScenarioRemediated]);

  // Synchronize alarms when a scenario is active or remediated
  useEffect(() => {
    setAnnunciators((prev) =>
      prev.map((alm) => {
        if (!simState.activeScenario) {
          return { ...alm, active: false, acknowledged: false };
        }

        let shouldTrip = false;
        if (simState.activeScenario === 'SCN_LOAD_REJECTION_420MW') {
          if (alm.tag === 'ANSI 52G TRIP' || alm.tag === 'LIGNE 225KV TRIP' || alm.tag === 'SURVITESSE 112%') {
            shouldTrip = !isScenarioRemediated;
          }
        } else if (simState.activeScenario === 'SCN_GOVERNOR_OIL_FAILURE') {
          if (alm.tag === 'PRESSION HUILE') shouldTrip = !isScenarioRemediated;
        } else if (simState.activeScenario === 'SCN_LOSS_OF_EXCITATION') {
          if (alm.tag === 'ANSI 40 LOE') shouldTrip = !isScenarioRemediated;
        } else if (simState.activeScenario === 'SCN_TRASH_RACK_CLOGGING') {
          if (alm.tag === 'ΔH GRILLE > 1.5M') shouldTrip = !isScenarioRemediated;
        } else if (simState.activeScenario === 'SCN_BEARING_COOLING_TRIP') {
          if (alm.tag === 'BUTÉE T > 75°C' || (simState.thrustBearingTempC > 82 && alm.tag === 'BUTÉE T > 85°C')) {
            shouldTrip = !isScenarioRemediated;
          }
        }

        return { ...alm, active: shouldTrip };
      })
    );

    if (simState.activeScenario && !isScenarioRemediated) {
      setHornActive(true);
    } else {
      setHornActive(false);
    }
  }, [simState.activeScenario, simState.thrustBearingTempC, isScenarioRemediated]);

  // Simulation controls
  const handleSetSpeed = (newSpeed: SimulationSpeed) => {
    setSimState((prev) => ({ ...prev, speed: newSpeed }));
  };

  const handleResetSimulation = () => {
    setSimState(INITIAL_OTS_STATE);
    setCompletedSteps([]);
    setHornActive(false);
  };

  const handleInjectDrill = (scenarioId: IncidentScenarioId) => {
    setSelectedScenarioId(scenarioId);
    setCompletedSteps([]);
    setSimState((prev) => ({
      ...prev,
      activeScenario: scenarioId,
      scenarioTimeElapsedSeconds: 0,
      scenarioResolved: false,
      speed: 'REALTIME_1X',
    }));
    setActiveSubTab('console');
  };

  const handleToggleChecklistStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAcknowledgeAlarms = () => {
    setAnnunciators((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
    setHornActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0E1714] via-[#12241A] to-[#0A120E] border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                {locale === 'fr'
                  ? 'ÉTAPE 22 • SIMULATEUR HAUTE FIDÉLITÉ (OTS) & GESTION DE CRISE'
                  : 'STEP 22 • OPERATOR TRAINING SIMULATOR (OTS) & CRISIS DRILLS'}
              </span>
              <span className="text-xs font-mono text-neutral-400">ISO 11064 / IEC 61850 / IEEE 1207 / SPAR-H</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <MonitorPlay className="h-6 w-6 text-emerald-400" />
              <span>
                {locale === 'fr'
                  ? 'Simulateur d\'Entraînement des Opérateurs (OTS), Injection d\'Incidents & Ergonomie CNO'
                  : 'Operator Training Simulator (OTS), Critical Drills & CCR Ergonomics (ISO 11064)'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Réplique numérique temps réel du pupitre de commande de la centrale de Nachtigal (420 MW) : simulateur dynamique de transitoires, matrice d\'alarmes SCADA, exercices d\'urgences (rejet 420 MW, perte d\'huile régulateur, perte d\'excitation ANSI 40) et certification HRA des pupitreurs.'
                : 'Real-time full-scope replica of the Nachtigal 420 MW central control room desk: transient dynamic engine, SCADA annunciator alarm matrix, emergency incident drills (420 MW load rejection, governor oil loss, ANSI 40 loss of field) and operator HRA qualification.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEEE-1207')}
                className="px-3 py-2 rounded-xl bg-[#142A1E] hover:bg-[#1D3B2B] border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>IEEE 1207 & ISO 11064</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C3827]">
          <button
            type="button"
            onClick={() => setActiveSubTab('console')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'console'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Gauge className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Pupitre SCADA Temps Réel & Télémétrie' : '1. Real-Time SCADA Desk & Telemetry'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('scenarios')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'scenarios'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Injecteur d\'Incidents & Procédures EOP' : '2. Incident Injector & EOP Procedures'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('hra_certification')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'hra_certification'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Fiabilité Humaine (HRA) & Certification' : '3. Human Reliability & Certification'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: REAL-TIME SCADA CONSOLE & TELEMETRY GAUGES                */}
      {/* ==================================================================== */}
      {activeSubTab === 'console' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Master Simulation Toolbar */}
          <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-xs font-bold uppercase">Moteur OTS :</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSetSpeed('REALTIME_1X')}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all ${
                    simState.speed === 'REALTIME_1X'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-[#0F1C15] text-neutral-300 hover:text-white border border-[#1D3525]'
                  }`}
                >
                  <Play className="h-3 w-3" />
                  <span>1x (Réel)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetSpeed('FAST_2X')}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all ${
                    simState.speed === 'FAST_2X'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-[#0F1C15] text-neutral-300 hover:text-white border border-[#1D3525]'
                  }`}
                >
                  <FastForward className="h-3 w-3" />
                  <span>2x</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetSpeed('PAUSED')}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all ${
                    simState.speed === 'PAUSED'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-[#0F1C15] text-neutral-300 hover:text-white border border-[#1D3525]'
                  }`}
                >
                  <Pause className="h-3 w-3" />
                  <span>Pause</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetSimulation}
                  className="px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold bg-[#0F1C15] text-neutral-300 hover:text-white border border-[#1D3525] transition-all"
                  title="Réinitialiser état nominal"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Horloge Simulation :</span>
                <span className="text-white font-black text-sm">
                  {Math.floor(simState.simTimeSeconds / 60)}m {(simState.simTimeSeconds % 60).toFixed(0)}s
                </span>
              </div>

              {simState.activeScenario && (
                <div className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/60 text-red-300 flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4 animate-bounce" />
                  <div>
                    <div className="text-[9px] font-bold uppercase">Exercice en Cours :</div>
                    <div className="text-xs font-black">{selectedScenario.code} ({simState.scenarioTimeElapsedSeconds.toFixed(1)}s)</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 8 Telemetry Gauges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Frequency */}
            <div className="p-3.5 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">Fréquence Réseau (Hz)</div>
              <div className="text-2xl font-black text-emerald-400">
                {simState.gridFrequencyHz.toFixed(2)}{' '}
                <span className="text-xs font-normal text-neutral-400">Hz</span>
              </div>
              <div className="text-[9px] text-neutral-500">Nominal: 50.00 Hz (±0.2 Hz)</div>
            </div>

            {/* Voltage */}
            <div className="p-3.5 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">Tension Bus 225 kV</div>
              <div className="text-2xl font-black text-cyan-300">
                {simState.gridVoltageKv.toFixed(1)}{' '}
                <span className="text-xs font-normal text-neutral-400">kV</span>
              </div>
              <div className="text-[9px] text-neutral-500">Nominal: 225.0 kV (13.8/225)</div>
            </div>

            {/* Active Power */}
            <div className="p-3.5 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">Puissance Active Totale</div>
              <div className="text-2xl font-black text-amber-400">
                {simState.unitActivePowerTotalMw.toFixed(0)}{' '}
                <span className="text-xs font-normal text-neutral-400">MW</span>
              </div>
              <div className="text-[9px] text-neutral-500">7 Groupes x 60 MW</div>
            </div>

            {/* Reactive Power */}
            <div className="p-3.5 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">Puissance Réactive (MVAR)</div>
              <div className={`text-2xl font-black ${simState.unitReactivePowerTotalMvar < 0 ? 'text-red-400' : 'text-purple-300'}`}>
                {simState.unitReactivePowerTotalMvar.toFixed(1)}{' '}
                <span className="text-xs font-normal text-neutral-400">MVAR</span>
              </div>
              <div className="text-[9px] text-neutral-500">Contrôle de tension CNO</div>
            </div>

            {/* Rotor Speed RPM */}
            <div className="p-3.5 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">Vitesse Rotation Rotor (RPM)</div>
              <div className={`text-2xl font-black ${simState.shaftSpeedRpm > 155 ? 'text-red-400' : 'text-emerald-400'}`}>
                {simState.shaftSpeedRpm.toFixed(1)}{' '}
                <span className="text-xs font-normal text-neutral-400">RPM</span>
              </div>
              <div className="text-[9px] text-neutral-500">Nominal: 136.36 RPM (22 paires)</div>
            </div>

            {/* Penstock Head / Water Hammer */}
            <div className="p-3.5 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">Charge Hydraulique (Bélier)</div>
              <div className={`text-2xl font-black ${simState.waterHammerHeadM > 65 ? 'text-red-400' : 'text-cyan-300'}`}>
                {simState.waterHammerHeadM.toFixed(1)}{' '}
                <span className="text-xs font-normal text-neutral-400">mCE</span>
              </div>
              <div className="text-[9px] text-neutral-500">Chute brute nominale: 50.0 m</div>
            </div>

            {/* Governor Hydraulic Pressure */}
            <div className="p-3.5 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">Pression Huile Régulateur</div>
              <div className={`text-2xl font-black ${simState.governorOilPressureBar < 120 ? 'text-red-400' : 'text-emerald-400'}`}>
                {simState.governorOilPressureBar.toFixed(1)}{' '}
                <span className="text-xs font-normal text-neutral-400">bar</span>
              </div>
              <div className="text-[9px] text-neutral-500">Circuit oléodynamique 160 bar</div>
            </div>

            {/* Thrust Bearing Temp */}
            <div className="p-3.5 rounded-xl bg-[#0A100E] border border-[#1D3525] space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase">T° Patins Butée Michell</div>
              <div className={`text-2xl font-black ${simState.thrustBearingTempC > 75 ? 'text-red-400' : 'text-amber-300'}`}>
                {simState.thrustBearingTempC.toFixed(1)}{' '}
                <span className="text-xs font-normal text-neutral-400">°C</span>
              </div>
              <div className="text-[9px] text-neutral-500">Seuil Alarme 75°C / Déclench. 85°C</div>
            </div>
          </div>

          {/* 12-Window SCADA Annunciator Alarm Board (Matrix 6x2 or 4x3) */}
          <div className="p-5 rounded-2xl border border-[#1D3525] bg-[#060D09] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
              <div className="flex items-center gap-2">
                <Bell className={`h-4 w-4 ${hornActive ? 'text-red-400 animate-bounce' : 'text-neutral-400'}`} />
                <h3 className="text-xs font-bold text-white uppercase">
                  {locale === 'fr'
                    ? 'Tableau d\'Annonciateurs d\'Alarmes de Salle de Commande (ISO 11064)'
                    : 'Central Control Room Annunciator Alarm Matrix (ISO 11064)'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcknowledgeAlarms}
                  className="px-3 py-1.5 rounded-lg bg-[#142A1E] hover:bg-[#1D3B2B] border border-emerald-500/50 text-[10px] font-bold text-emerald-300 transition-all flex items-center gap-1.5"
                >
                  <BellOff className="h-3.5 w-3.5" />
                  <span>Acquitter Alarmes / Silence Klaxon</span>
                </button>
              </div>
            </div>

            {/* Annunciator Windows Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {annunciators.map((alm) => {
                const isTripped = alm.active;
                const isFlashing = isTripped && !alm.acknowledged;

                return (
                  <div
                    key={alm.id}
                    className={`p-2.5 rounded-lg border text-center font-mono select-none transition-all flex flex-col justify-between h-20 ${
                      isTripped
                        ? alm.color === 'RED_FLASH'
                          ? isFlashing
                            ? 'bg-red-700 text-white border-red-400 animate-pulse shadow-lg shadow-red-600/50'
                            : 'bg-red-950 text-red-200 border-red-600'
                          : 'bg-amber-900 text-amber-200 border-amber-500'
                        : 'bg-[#0A120E] text-neutral-600 border-[#15281E]'
                    }`}
                  >
                    <div className="text-[9px] font-bold tracking-wider">{alm.tag}</div>
                    <div className="text-[8px] leading-tight font-sans line-clamp-2">
                      {alm.labelFr}
                    </div>
                    <div className="text-[7px] text-neutral-400 uppercase">{alm.category}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: INCIDENT INJECTOR & EOP CHECKLIST PROCEDURES               */}
      {/* ==================================================================== */}
      {activeSubTab === 'scenarios' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Scenarios Catalog Selector (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-3">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 pb-2 border-b border-[#1D3525]">
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                <span>Catalogue d'Incidents Majeurs (EOP)</span>
              </h3>

              <div className="space-y-2">
                {INCIDENT_SCENARIOS.map((scn) => (
                  <button
                    key={scn.id}
                    type="button"
                    onClick={() => {
                      setSelectedScenarioId(scn.id);
                      setCompletedSteps([]);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedScenarioId === scn.id
                        ? 'bg-[#12261B] border-emerald-500/60 shadow-md'
                        : 'bg-[#08120D] border-[#1D3525] hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">{scn.code}</span>
                      <span
                        className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                          scn.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-300 border border-red-700'
                            : 'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}
                      >
                        {scn.severity}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs mt-1">{scn.titleFr}</div>
                    <div className="text-[9px] text-neutral-400 mt-1 line-clamp-1">{scn.initiatingEventFr}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleInjectDrill(selectedScenario.id)}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30"
                >
                  <AlertOctagon className="h-4 w-4" />
                  <span>INJECTER CE SCÉNARIO D'INCIDENT DANS L'OTS</span>
                </button>
              </div>
            </div>

            {/* Drill Resolution & Step-by-Step Operator Checklist (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase block font-bold">
                    Exercice Actif : {selectedScenario.code}
                  </span>
                  <h4 className="text-sm font-bold text-white">{selectedScenario.titleFr}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Temps de Référence :</span>
                  <span className="text-cyan-300 font-bold">{selectedScenario.benchmarkCompletionTimeSeconds} s</span>
                </div>
              </div>

              {/* Event Description */}
              <div className="p-3 rounded-xl bg-[#0F1C15] border border-[#1E3A28] text-[11px] text-neutral-300 space-y-1">
                <strong className="text-white block">Événement Déclencheur :</strong>
                <p>{selectedScenario.initiatingEventFr}</p>
              </div>

              {/* Automatic Actions Done by Safety Automation */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Actions Automatiques Immédiates (Automates / Relais numériques) :
                </span>
                <div className="space-y-1">
                  {selectedScenario.automaticSafetyActionsFr.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#060D09] border border-[#15281E] text-[10px] text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operator Emergency Checklist (Interactive) */}
              <div className="space-y-1.5 pt-2 border-t border-[#1C3827]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">
                    Actions Opérateur Requises (Consignes EOP) :
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {completedSteps.length} / {selectedScenario.operatorRequiredActionsFr.length} validées
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedScenario.operatorRequiredActionsFr.map((action, idx) => {
                    const isDone = completedSteps.includes(idx);

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleChecklistStep(idx)}
                        className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all ${
                          isDone
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                            : 'bg-[#08120D] border-[#1D3525] hover:border-neutral-600 text-neutral-300'
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded flex items-center justify-center border shrink-0 mt-0.5 ${
                            isDone ? 'bg-emerald-500 border-emerald-400 text-black font-bold' : 'border-neutral-600'
                          }`}
                        >
                          {isDone && '✓'}
                        </div>
                        <span className="text-xs">{action}</span>
                      </button>
                    );
                  })}
                </div>

                {isScenarioRemediated && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-center space-y-1 mt-3 animate-fade-in">
                    <div className="text-xs font-bold uppercase flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>INCIDENT RÉSOLU AVEC SUCCÈS !</span>
                    </div>
                    <p className="text-[10px] text-neutral-300">
                      Toutes les procédures opérationnelles d'urgence ont été appliquées conformément à {selectedScenario.standardReference}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: HUMAN RELIABILITY ANALYSIS (HRA) & CERTIFICATION          */}
      {/* ==================================================================== */}
      {activeSubTab === 'hra_certification' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Taux de Réussite aux Exercices</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                98.2% <span className="text-xs font-normal text-neutral-400">réussis</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Sur 55 exercices d'urgence simulés</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Temps Moyen de Réaction</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                21.8 <span className="text-xs font-normal text-neutral-400">sec</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Cible ISO 11064 : &lt; 35 secondes</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Probabilité d'Erreur Humaine (HEP)</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                0.022 <span className="text-xs font-normal text-neutral-400">SPAR-H</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Niveau de fiabilité exceptionnel</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Conformité Ergonomie Pupitre</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                100% <span className="text-xs font-normal text-neutral-400">ISO 11064</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Disposition des synoptiques et alarmes</div>
            </div>
          </div>

          {/* Trainees Roster */}
          <div className="p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
              <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                <span>Registre de Qualification des Pupitreurs & Dispatchers (CNO)</span>
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                AUDITÉ ANNUELLEMENT
              </span>
            </div>

            <div className="space-y-3">
              {OPERATOR_TRAINEES.map((trainee) => (
                <div
                  key={trainee.traineeId}
                  className="p-4 rounded-xl bg-[#0F1C15] border border-[#1E3A28] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{trainee.traineeName}</span>
                      <span className="text-[9px] text-neutral-400 font-mono">[{trainee.traineeId}]</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                          trainee.qualificationStatus === 'CERTIFIED_SENIOR'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                            : 'bg-amber-950 text-amber-300 border-amber-500'
                        }`}
                      >
                        {trainee.qualificationStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Rôle : {trainee.role.replace(/_/g, ' ')}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-[10px] text-neutral-300">
                    <div>
                      Drills Réalisés : <strong className="text-white block text-xs">{trainee.totalDrillsCompleted}</strong>
                    </div>
                    <div>
                      Score de Réussite : <strong className="text-emerald-400 block text-xs">{trainee.certificationScorePercent}%</strong>
                    </div>
                    <div>
                      Temps Réaction Moyen : <strong className="text-cyan-300 block text-xs">{trainee.averageReactionTimeSeconds} s</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
