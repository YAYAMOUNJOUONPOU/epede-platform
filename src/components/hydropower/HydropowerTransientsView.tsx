import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  ShieldAlert,
  Waves,
  Gauge,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
  XCircle,
  Sliders,
  Flame,
  Volume2,
  Compass,
  ArrowRight,
  TrendingUp,
  Radio,
  FileText,
  Clock,
  Terminal,
  Server,
  RefreshCw,
  Power,
  ShieldCheck,
  ZapOff,
} from 'lucide-react';
import type { HydroSubsystemId, HydroUnitOperatingState } from '../../types/hydropower';
import { HYDRO_STARTUP_STEPS } from '../../data/hydropowerData';
import {
  EXTENDED_HYDRO_FAILURE_SCENARIOS,
  WATER_HAMMER_PRESETS,
  computeWaterHammer,
  CAMEROON_CONTINGENCY_SCENARIOS,
  WaterHammerParameters,
} from '../../data/hydropowerTransientsData';

interface HydropowerTransientsViewProps {
  locale: 'fr' | 'en';
  onSelectSubsystem?: (subsystemId: HydroSubsystemId) => void;
  onNavigateStandard?: (reference: string) => void;
}

export const HydropowerTransientsView: React.FC<HydropowerTransientsViewProps> = ({
  locale,
  onSelectSubsystem,
  onNavigateStandard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'propagation' | 'waterhammer' | 'scada' | 'cascade'>('propagation');

  // ==========================================================================
  // TAB 1: CAUSAL FAILURE PROPAGATION SIMULATOR STATE
  // ==========================================================================
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('load_rejection_waterhammer');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingPropagation, setIsPlayingPropagation] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const activeScenario = useMemo(() => {
    return EXTENDED_HYDRO_FAILURE_SCENARIOS.find((s) => s.id === selectedScenarioId) || EXTENDED_HYDRO_FAILURE_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Autoplay propagation steps
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlayingPropagation) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < activeScenario.propagationChain.length - 1) {
            return prev + 1;
          } else {
            setIsPlayingPropagation(false);
            return prev;
          }
        });
      }, 3200 / playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingPropagation, activeScenario.propagationChain.length, playbackSpeed]);

  const activeStep = activeScenario.propagationChain[currentStepIndex] || activeScenario.propagationChain[0];

  // ==========================================================================
  // TAB 2: WATER HAMMER & ALLIEVI TRANSIENT LAB STATE
  // ==========================================================================
  const [activePresetKey, setActivePresetKey] = useState<string>('nachtigal');
  const [whParams, setWhParams] = useState<WaterHammerParameters>(WATER_HAMMER_PRESETS.nachtigal);
  const [timeScrubberS, setTimeScrubberS] = useState<number>(2.5);
  const [isOscillogramPlaying, setIsOscillogramPlaying] = useState<boolean>(false);

  const handleSelectPreset = (key: string) => {
    setActivePresetKey(key);
    if (WATER_HAMMER_PRESETS[key]) {
      setWhParams(WATER_HAMMER_PRESETS[key]);
      setTimeScrubberS(2.0);
    }
  };

  const whResults = useMemo(() => {
    return computeWaterHammer(whParams);
  }, [whParams]);

  // Oscillogram time play loop
  useEffect(() => {
    let animTimer: NodeJS.Timeout | null = null;
    if (isOscillogramPlaying) {
      animTimer = setInterval(() => {
        setTimeScrubberS((prev) => {
          const next = prev + 0.2;
          return next > 25 ? 0 : Math.round(next * 10) / 10;
        });
      }, 100);
    }
    return () => {
      if (animTimer) clearInterval(animTimer);
    };
  }, [isOscillogramPlaying]);

  // Dynamic waveform points calculation
  const waveformCurves = useMemo(() => {
    const pointsCount = 60;
    const maxTime = 25; // seconds
    const P0 = (whParams.grossHeadM * 9810) / 100000; // bar
    const maxSurgeBar = whResults.maxPressureBar - P0;
    const Tc = whParams.closureTimeS;
    const Tr = whResults.reflectionTimeS;
    const damping = whParams.hasSurgeTank ? 0.22 : 0.12;
    const omegaSurge = whResults.surgeTankPeriodS > 0 ? (2 * Math.PI) / whResults.surgeTankPeriodS : 0.5;

    const pressurePoints: Array<{ t: number; p: number; z: number; rpm: number; mw: number }> = [];

    for (let i = 0; i <= pointsCount; i++) {
      const t = (i / pointsCount) * maxTime;

      // Pressure wave P(t)
      let pDynamic = P0;
      if (t <= Tc) {
        pDynamic = P0 + maxSurgeBar * (t / Tc);
      } else {
        const tPost = t - Tc;
        pDynamic = P0 + maxSurgeBar * Math.exp(-damping * tPost) * Math.cos(omegaSurge * tPost);
      }

      // Surge tank water level z(t) in meters
      let zDynamic = 0;
      if (whParams.hasSurgeTank) {
        if (t <= Tc) {
          zDynamic = whResults.surgeTankMaxUpSurgeM * Math.pow(t / Tc, 2);
        } else {
          const tPost = t - Tc;
          zDynamic = whResults.surgeTankMaxUpSurgeM * Math.exp(-0.15 * tPost) * Math.sin(omegaSurge * tPost + Math.PI / 2);
        }
      }

      // Rotor speed RPM(t)
      let rpmDynamic = whParams.nominalSpeedRpm;
      if (t <= Tc) {
        const rpmRise = (whResults.runawaySpeedRpm - whParams.nominalSpeedRpm) * (t / Tc);
        rpmDynamic = whParams.nominalSpeedRpm + rpmRise;
      } else {
        const tPost = t - Tc;
        const rpmRise = (whResults.runawaySpeedRpm - whParams.nominalSpeedRpm) * Math.exp(-0.25 * tPost);
        rpmDynamic = whParams.nominalSpeedRpm + rpmRise;
      }

      // Electrical Power MW(t) - collapses immediately at t=0
      const mwDynamic = t <= 0.1 ? (whParams.flowM3s * whParams.grossHeadM * 9.81 * 0.92) / 1000 : 0;

      pressurePoints.push({
        t: Math.round(t * 10) / 10,
        p: Math.round(pDynamic * 10) / 10,
        z: Math.round(zDynamic * 10) / 10,
        rpm: Math.round(rpmDynamic),
        mw: Math.round(mwDynamic * 10) / 10,
      });
    }

    return pressurePoints;
  }, [whParams, whResults]);

  // Current interpolated values at timeScrubberS
  const currentInstantWave = useMemo(() => {
    const pt = waveformCurves.find((p) => Math.abs(p.t - timeScrubberS) < 0.25) || waveformCurves[0];
    return pt;
  }, [waveformCurves, timeScrubberS]);

  // ==========================================================================
  // TAB 3: SCADA OPERATOR DESK & 12-STEP STATE MACHINE
  // ==========================================================================
  const [scadaUnitState, setScadaUnitState] = useState<HydroUnitOperatingState>('available');
  const [activeSequenceStepNum, setActiveSequenceStepNum] = useState<number>(1);
  const [isSequenceAutoRunning, setIsSequenceAutoRunning] = useState<boolean>(false);
  const [dispatchPowerMW, setDispatchPowerMW] = useState<number>(0);
  const [dispatchReactiveMVAr, setDispatchReactiveMVAr] = useState<number>(0);
  const [statorVoltageKV, setStatorVoltageKV] = useState<number>(0);
  const [frequencyHz, setFrequencyHz] = useState<number>(50.0);
  const [turbineSpeedRpm, setTurbineSpeedRpm] = useState<number>(0);
  const [guideVanePercent, setGuideVanePercent] = useState<number>(0);
  const [penstockBar, setPenstockBar] = useState<number>(17.5);
  const [isBlackStartMode, setIsBlackStartMode] = useState<boolean>(false);

  // Permissives check status
  const [permissives, setPermissives] = useState({
    lockoutReset86: true,
    auxPowerNormal: true,
    coolingFlowNormal: true,
    lubricationPressureNormal: true,
    mivPenstockOpen: true,
    governorOilNormal: true,
    mechanicalBrakesReleased: true,
    synchroPermissive: false,
  });

  // Reset SCADA state
  const handleResetScada = () => {
    setIsSequenceAutoRunning(false);
    setScadaUnitState('available');
    setActiveSequenceStepNum(1);
    setDispatchPowerMW(0);
    setDispatchReactiveMVAr(0);
    setStatorVoltageKV(0);
    setFrequencyHz(50.0);
    setTurbineSpeedRpm(0);
    setGuideVanePercent(0);
    setPenstockBar(17.5);
    setIsBlackStartMode(false);
  };

  // Emergency Trip 86G
  const handleEmergencyTrip = () => {
    setIsSequenceAutoRunning(false);
    setScadaUnitState('emergency_trip');
    setDispatchPowerMW(0);
    setDispatchReactiveMVAr(0);
    setStatorVoltageKV(0);
    setGuideVanePercent(0);
    setPermissives((prev) => ({ ...prev, lockoutReset86: false }));
    // Temporary water hammer surge
    setPenstockBar(23.8);
    setTimeout(() => setPenstockBar(17.5), 3000);
  };

  // Auto-runner for 12 startup steps
  useEffect(() => {
    let stepTimer: NodeJS.Timeout | null = null;
    if (isSequenceAutoRunning) {
      stepTimer = setInterval(() => {
        setActiveSequenceStepNum((curr) => {
          if (curr < 12) {
            const nextStep = curr + 1;
            // Update telemetry according to step milestone
            if (nextStep === 4) {
              setPermissives((p) => ({ ...p, lubricationPressureNormal: true, mechanicalBrakesReleased: true }));
            } else if (nextStep === 5) {
              setPenstockBar(17.5);
              setPermissives((p) => ({ ...p, mivPenstockOpen: true }));
            } else if (nextStep === 7) {
              setScadaUnitState('starting');
              setGuideVanePercent(14);
              setTurbineSpeedRpm(180);
            } else if (nextStep === 8) {
              setTurbineSpeedRpm(500);
              setGuideVanePercent(12);
            } else if (nextStep === 9) {
              setStatorVoltageKV(11.0);
              setScadaUnitState('synchronizing');
            } else if (nextStep === 10) {
              setPermissives((p) => ({ ...p, synchroPermissive: true }));
            } else if (nextStep === 11) {
              setScadaUnitState('connected');
              setDispatchPowerMW(6);
            } else if (nextStep === 12) {
              setScadaUnitState('loaded');
              setDispatchPowerMW(70);
              setDispatchReactiveMVAr(14);
              setGuideVanePercent(82);
              setIsSequenceAutoRunning(false);
            }
            return nextStep;
          } else {
            setIsSequenceAutoRunning(false);
            return curr;
          }
        });
      }, 2000);
    }
    return () => {
      if (stepTimer) clearInterval(stepTimer);
    };
  }, [isSequenceAutoRunning]);

  // Adjust active MW load in 'loaded' state
  const handleRampMW = (delta: number) => {
    if (scadaUnitState !== 'loaded' && scadaUnitState !== 'connected') return;
    setDispatchPowerMW((prev) => {
      const next = Math.max(0, Math.min(75, prev + delta));
      const nextGV = Math.round(12 + (next / 75) * 76);
      setGuideVanePercent(nextGV);
      return next;
    });
  };

  // Normal controlled shutdown
  const handleControlledStop = () => {
    setIsSequenceAutoRunning(false);
    setScadaUnitState('unloading');
    setDispatchPowerMW(0);
    setDispatchReactiveMVAr(0);
    setTimeout(() => {
      setScadaUnitState('shutdown');
      setStatorVoltageKV(0);
      setGuideVanePercent(0);
      setTimeout(() => {
        setTurbineSpeedRpm(0);
        setScadaUnitState('stopped');
      }, 2500);
    }, 2000);
  };

  // ==========================================================================
  // TAB 4: CAMEROON CASCADE & GRID CONTINGENCY
  // ==========================================================================
  const [selectedContingencyId, setSelectedContingencyId] = useState<string>('ris_line_trip_120mw');
  const [completedSopSteps, setCompletedSopSteps] = useState<Record<number, boolean>>({});

  const activeContingency = useMemo(() => {
    return CAMEROON_CONTINGENCY_SCENARIOS.find((c) => c.id === selectedContingencyId) || CAMEROON_CONTINGENCY_SCENARIOS[0];
  }, [selectedContingencyId]);

  const toggleSopStep = (index: number) => {
    setCompletedSopSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-[#252E38] bg-linear-to-r from-[#0D1117] via-[#091522] to-[#0A1017] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 6 / SUITE COMPLÈTE' : 'STEP 6 / COMPLETE MASTER SUITE'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 uppercase">
                SCADA & TRANSIENTS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {locale === 'fr'
                ? 'Laboratoire de Transitoires, Propagation d\'Incidents & Conduite SCADA'
                : 'Hydraulic Transients, Causal Failure Propagation & SCADA Dispatch Lab'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-4xl">
              {locale === 'fr'
                ? 'Simulation numérique des coups de bélier (Allievi / Joukowsky), chaîne de causalité d\'avaries matérielles, pupitre de conduite 12 étapes et dispatching de crise sur le réseau camerounais.'
                : 'Numerical simulation of penstock water hammer surges, multi-layer failure propagation chain, 12-step unit startup/shutdown SCADA sequencer, and Cameroon grid contingency dispatch.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#080B10] border border-[#252E38] text-right font-mono">
              <div className="text-[10px] text-neutral-500 uppercase">{locale === 'fr' ? 'Onde d\'Allievi' : 'Wave Speed'}</div>
              <div className="text-xs font-bold text-cyan-400">{whResults.waveSpeedMs} m/s</div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#080B10] border border-[#252E38] text-right font-mono">
              <div className="text-[10px] text-neutral-500 uppercase">{locale === 'fr' ? 'État Machine' : 'Unit State'}</div>
              <div className="text-xs font-bold text-emerald-400 uppercase">{scadaUnitState}</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#252E38]">
          <button
            type="button"
            onClick={() => setActiveSubTab('propagation')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'propagation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>{locale === 'fr' ? '1. Chaîne de Causalité des Pannes' : '1. Causal Failure Propagation'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1117] text-amber-400">6 SCÉNARIOS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('waterhammer')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'waterhammer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
            }`}
          >
            <Waves className="h-4 w-4 text-cyan-400" />
            <span>{locale === 'fr' ? '2. Coup de Bélier & Ondes d\'Allievi' : '2. Water Hammer & Transients Lab'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1117] text-cyan-400">OSCILLOGRAM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('scada')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'scada'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
            }`}
          >
            <Gauge className="h-4 w-4 text-emerald-400" />
            <span>{locale === 'fr' ? '3. Pupitre SCADA & Séquenceur 12 Étapes' : '3. SCADA Sequencer & Desk'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1117] text-emerald-400">LIVE UNIT</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('cascade')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'cascade'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-md'
                : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
            }`}
          >
            <Radio className="h-4 w-4 text-purple-400" />
            <span>{locale === 'fr' ? '4. Crise Réseau RIS & Crue Cascade' : '4. Grid Contingency & Cascade Flood'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1117] text-purple-400">DISPATCHING</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUB-TAB 1: CAUSAL PROPAGATION & INCIDENT SIMULATION                   */}
      {/* ===================================================================== */}
      {activeSubTab === 'propagation' && (
        <div className="space-y-6">
          {/* Scenario Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXTENDED_HYDRO_FAILURE_SCENARIOS.map((scen) => {
              const isSelected = scen.id === selectedScenarioId;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenarioId(scen.id);
                    setCurrentStepIndex(0);
                    setIsPlayingPropagation(false);
                  }}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/70 shadow-lg ring-1 ring-amber-500/50'
                      : 'bg-[#0D1117] border-[#252E38] hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-amber-400 uppercase px-2 py-0.5 rounded bg-[#080B10] border border-amber-900/60">
                      {scen.propagationChain.length} {locale === 'fr' ? 'ÉTAPES' : 'STEPS'}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {scen.standardsReference[0] || 'IEC 60041'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">
                    {scen.title[locale]}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-2 line-clamp-2">
                    {scen.rootCause}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Player Controls & Annunciator Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Propagation Domino Chain */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
                {/* Header & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#252E38]">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400 uppercase">
                      {locale === 'fr' ? 'DÉROULÉ CHRONOLOGIQUE DU DÉFAUT' : 'CHRONOLOGICAL FAULT EXECUTION'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {activeScenario.title[locale]}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlayingPropagation((p) => !p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-mono font-bold uppercase hover:bg-amber-400 transition-colors"
                    >
                      {isPlayingPropagation ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                      <span>{isPlayingPropagation ? (locale === 'fr' ? 'PAUSE' : 'PAUSE') : (locale === 'fr' ? 'LANCER' : 'PLAY')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStepIndex((prev) => Math.min(activeScenario.propagationChain.length - 1, prev + 1));
                        setIsPlayingPropagation(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#080B10] border border-[#252E38] text-neutral-300 hover:text-white text-xs font-mono"
                      title={locale === 'fr' ? 'Étape suivante' : 'Step forward'}
                    >
                      <FastForward className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStepIndex(0);
                        setIsPlayingPropagation(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#080B10] border border-[#252E38] text-neutral-300 hover:text-white text-xs font-mono"
                      title={locale === 'fr' ? 'Réinitialiser' : 'Reset'}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 pl-2">
                      <span className="text-neutral-500">VITESSE:</span>
                      {[1, 2, 5].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`px-1.5 py-0.5 rounded ${playbackSpeed === spd ? 'bg-amber-400 text-slate-950 font-bold' : 'text-neutral-400'}`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress bar across sequence */}
                <div className="mt-4 flex items-center gap-1.5">
                  {activeScenario.propagationChain.map((step, idx) => {
                    const isPassed = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <button
                        key={step.sequenceIndex}
                        type="button"
                        onClick={() => {
                          setCurrentStepIndex(idx);
                          setIsPlayingPropagation(false);
                        }}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          isCurrent
                            ? 'bg-amber-400 ring-2 ring-amber-400/50'
                            : isPassed
                            ? 'bg-amber-600/60'
                            : 'bg-[#252E38]'
                        }`}
                        title={`Étape ${idx + 1}`}
                      />
                    );
                  })}
                </div>

                {/* Active Step Details */}
                <div className="mt-6 p-5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#252E38]/80">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center">
                        {activeStep.sequenceIndex}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-300 uppercase">
                        {locale === 'fr' ? 'DOMAINE PHYSIQUE :' : 'PHYSICAL DOMAIN:'} {activeStep.domainLayer.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-neutral-500">{locale === 'fr' ? 'État Machine :' : 'Plant State:'}</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold uppercase">
                        {activeStep.resultingPlantState}
                      </span>
                    </div>
                  </div>

                  {/* Trigger Event */}
                  <div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                      {locale === 'fr' ? '1. Événement Déclencheur' : '1. Trigger Event'}
                    </div>
                    <div className="text-xs font-bold text-white bg-[#0D1117] p-3 rounded-lg border border-[#252E38]">
                      {activeStep.triggerEvent}
                    </div>
                  </div>

                  {/* Physical Manifestation */}
                  <div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                      {locale === 'fr' ? '2. Manifestation Physique & Hydraulique' : '2. Physical & Hydraulic Impact'}
                    </div>
                    <div className="text-xs text-neutral-200 bg-[#0D1117] p-3 rounded-lg border border-[#252E38] leading-relaxed">
                      {activeStep.physicalManifestation}
                    </div>
                  </div>

                  {/* Instrumentation Detection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Cpu className="h-3 w-3" />
                        <span>{locale === 'fr' ? '3. Détection Capteurs' : '3. Instrumentation'}</span>
                      </div>
                      <div className="text-xs text-neutral-300 bg-[#0D1117] p-3 rounded-lg border border-cyan-900/40">
                        {activeStep.instrumentationDetection}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <ShieldAlert className="h-3 w-3" />
                        <span>{locale === 'fr' ? '4. Réaction Protection (Relais)' : '4. Protection Reaction'}</span>
                      </div>
                      <div className="text-xs text-neutral-300 bg-[#0D1117] p-3 rounded-lg border border-red-900/40 font-mono">
                        {activeStep.protectionReaction}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subsystems affected pills */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-neutral-500">{locale === 'fr' ? 'Sous-systèmes Impactés :' : 'Impacted Subsystems:'}</span>
                  {activeScenario.affectedSubsystems.map((subId) => (
                    <button
                      key={subId}
                      type="button"
                      onClick={() => onSelectSubsystem?.(subId)}
                      className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/80 text-sky-400 font-bold hover:bg-sky-900 transition-colors"
                    >
                      {subId}
                    </button>
                  ))}
                </div>

                {/* Mitigation Guidelines */}
                <div className="mt-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/60">
                  <div className="font-mono text-xs font-bold text-emerald-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{locale === 'fr' ? 'CONSIGNES D\'EXPLOITATION & REMÉDIATION POST-AVARIE' : 'POST-TRIP MITIGATION & OPERATING GUIDELINES'}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {activeScenario.mitigationGuidelines[locale].map((guide, gIdx) => (
                      <li key={gIdx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-mono font-bold mt-0.5">•</span>
                        <span>{guide}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Industrial Annunciator Alarm Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="h-4 w-4" />
                    <span>{locale === 'fr' ? 'TABLEAU D\'ALARMES SCADA' : 'SCADA ANNUNCIATOR'}</span>
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500">ANSI MATRIX</span>
                </div>

                {/* Annunciator Grid of Lamps */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-center font-mono text-[10px]">
                  {[
                    { code: '87G', label: 'DIFF. STATOR', active: activeScenario.id === 'cooling_failure' && currentStepIndex >= 2 },
                    { code: '87T', label: 'DIFF. GSU', active: activeScenario.id === 'transformer_differential' && currentStepIndex >= 0 },
                    { code: '49G', label: 'THERMIQUE STATOR', active: activeScenario.id === 'cooling_failure' && currentStepIndex >= 1 },
                    { code: '40', label: 'PERTE EXCITATION', active: activeScenario.id === 'loss_of_excitation_field' && currentStepIndex >= 1 },
                    { code: '21', label: 'DISTANCE LIGNE', active: activeScenario.id === 'load_rejection_waterhammer' && currentStepIndex >= 0 },
                    { code: '63', label: 'BUCHHOLZ GAZ', active: activeScenario.id === 'transformer_differential' && currentStepIndex >= 2 },
                    { code: '78', label: 'OUT-OF-STEP', active: activeScenario.id === 'loss_of_excitation_field' && currentStepIndex >= 2 },
                    { code: '32R', label: 'RETOUR PUISSANCE', active: activeScenario.id === 'governor_oil_loss' && currentStepIndex >= 2 },
                    { code: '12', label: 'SURVITESSE ROTOR', active: activeScenario.id === 'load_rejection_waterhammer' && currentStepIndex >= 1 },
                    { code: 'H11', label: 'PRESSION HUILE', active: activeScenario.id === 'governor_oil_loss' && currentStepIndex >= 0 },
                    { code: 'H12', label: 'DÉBIT EAU BRUTE', active: activeScenario.id === 'cooling_failure' && currentStepIndex >= 0 },
                    { code: 'H25', label: 'VIBRATION RMS', active: activeScenario.id === 'cavitation_vortex_surge' && currentStepIndex >= 1 },
                    { code: '86G1', label: 'LOCKOUT GROUPE', active: currentStepIndex >= 3 },
                    { code: '86T', label: 'LOCKOUT TRANSFO', active: activeScenario.id === 'transformer_differential' && currentStepIndex >= 1 },
                    { code: 'FIRE', label: 'DÉLUGE NFPA 851', active: activeScenario.id === 'transformer_differential' && currentStepIndex >= 3 },
                    { code: 'VORTEX', label: 'ASPIRATEUR PULS', active: activeScenario.id === 'cavitation_vortex_surge' && currentStepIndex >= 0 },
                  ].map((lamp) => (
                    <div
                      key={lamp.code}
                      className={`p-2.5 rounded-lg border transition-all flex flex-col items-center justify-center ${
                        lamp.active
                          ? 'bg-red-600/30 border-red-500 text-red-200 shadow-md ring-1 ring-red-400 animate-pulse'
                          : 'bg-[#080B10] border-[#252E38] text-neutral-600'
                      }`}
                    >
                      <span className={`font-black text-xs ${lamp.active ? 'text-white' : 'text-neutral-500'}`}>
                        {lamp.code}
                      </span>
                      <span className="text-[9px] mt-0.5 truncate max-w-full font-sans uppercase">
                        {lamp.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Normative References */}
                <div className="mt-5 pt-4 border-t border-[#252E38] space-y-2">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">
                    {locale === 'fr' ? 'NORMES DE PROTECTION APPLICABLES' : 'GOVERNING STANDARDS'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeScenario.standardsReference.map((ref) => (
                      <button
                        key={ref}
                        type="button"
                        onClick={() => onNavigateStandard?.(ref)}
                        className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-purple-300 font-mono text-[10px] hover:bg-purple-900"
                      >
                        {ref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 2: WATER HAMMER & ALLIEVI TRANSIENT LAB                      */}
      {/* ===================================================================== */}
      {activeSubTab === 'waterhammer' && (
        <div className="space-y-6">
          {/* Preset Selector */}
          <div className="p-4 rounded-2xl border border-[#252E38] bg-[#0D1117] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white uppercase">
                {locale === 'fr' ? 'INSTALLATION HYDROÉLECTRIQUE DE RÉFÉRENCE :' : 'REFERENCE HYDRO PLANT MODEL:'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {Object.keys(WATER_HAMMER_PRESETS).map((key) => {
                const preset = WATER_HAMMER_PRESETS[key];
                const isSelected = activePresetKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow'
                        : 'bg-[#080B10] text-neutral-400 border border-[#252E38] hover:text-white'
                    }`}
                  >
                    {preset.plantName.split(' ')[0]} ({preset.grossHeadM}m)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual Column: Controls & Mathematical Solvers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Sliders */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-4 w-4" />
                    <span>{locale === 'fr' ? 'PARAMÈTRES HYDRAULIQUES CONDUITE' : 'PENSTOCK & TURBINE PARAMETERS'}</span>
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500">INPUTS</span>
                </div>

                {/* Penstock Length L */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-neutral-400">Longueur Conduite (L)</span>
                    <span className="text-cyan-400 font-bold">{whParams.penstockLengthM} m</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="1500"
                    step="10"
                    value={whParams.penstockLengthM}
                    onChange={(e) => {
                      setWhParams((p) => ({ ...p, penstockLengthM: Number(e.target.value) }));
                      setActivePresetKey('custom');
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Penstock Diameter D */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-neutral-400">Diamètre Intérieur (D)</span>
                    <span className="text-cyan-400 font-bold">{whParams.penstockDiameterM} m</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.1"
                    value={whParams.penstockDiameterM}
                    onChange={(e) => {
                      setWhParams((p) => ({ ...p, penstockDiameterM: Number(e.target.value) }));
                      setActivePresetKey('custom');
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Wall thickness e */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-neutral-400">Épaisseur Acier (e)</span>
                    <span className="text-cyan-400 font-bold">{whParams.wallThicknessMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="50"
                    step="1"
                    value={whParams.wallThicknessMm}
                    onChange={(e) => {
                      setWhParams((p) => ({ ...p, wallThicknessMm: Number(e.target.value) }));
                      setActivePresetKey('custom');
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Gross Head H0 */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-neutral-400">Chute Brute Nominale (H0)</span>
                    <span className="text-white font-bold">{whParams.grossHeadM} m</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="600"
                    step="5"
                    value={whParams.grossHeadM}
                    onChange={(e) => {
                      setWhParams((p) => ({ ...p, grossHeadM: Number(e.target.value) }));
                      setActivePresetKey('custom');
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Flow Q0 */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-neutral-400">Débit Turbiné (Q0)</span>
                    <span className="text-white font-bold">{whParams.flowM3s} m³/s</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="220"
                    step="5"
                    value={whParams.flowM3s}
                    onChange={(e) => {
                      setWhParams((p) => ({ ...p, flowM3s: Number(e.target.value) }));
                      setActivePresetKey('custom');
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Closure Time Tc */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-amber-400 font-bold">Temps de Fermeture Directrices (Tc)</span>
                    <span className="text-amber-400 font-bold">{whParams.closureTimeS} s</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="12.0"
                    step="0.2"
                    value={whParams.closureTimeS}
                    onChange={(e) => {
                      setWhParams((p) => ({ ...p, closureTimeS: Number(e.target.value) }));
                      setActivePresetKey('custom');
                    }}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">
                    Temps de va-et-vient onde Tr = 2L/a = {whResults.reflectionTimeS} s
                  </div>
                </div>

                {/* Surge Tank Toggle & Size */}
                <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400">
                      {locale === 'fr' ? 'Cheminée d\'Équilibre (H06)' : 'Surge Tank (H06)'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whParams.hasSurgeTank}
                        onChange={(e) => {
                          setWhParams((p) => ({ ...p, hasSurgeTank: e.target.checked }));
                          setActivePresetKey('custom');
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#252E38] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
                    </label>
                  </div>

                  {whParams.hasSurgeTank && (
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                        <span>Diamètre Puits (D_st)</span>
                        <span className="text-cyan-300 font-bold">{whParams.surgeTankDiameterM} m</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        step="1"
                        value={whParams.surgeTankDiameterM}
                        onChange={(e) => {
                          setWhParams((p) => ({ ...p, surgeTankDiameterM: Number(e.target.value) }));
                          setActivePresetKey('custom');
                        }}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Physics Readouts & Oscillogram SVG Graph */}
            <div className="lg:col-span-7 space-y-6">
              {/* Computed KPIs */}
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Célérité Onde (a)</div>
                  <div className="text-xl font-black text-cyan-400 mt-1">{whResults.waveSpeedMs} m/s</div>
                  <div className="text-[9px] text-neutral-500 mt-0.5">Élasticité acier-eau</div>
                </div>

                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Régime Coupure</div>
                  <div className={`text-base font-black mt-1 uppercase ${whResults.closureType === 'rapid' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {whResults.closureType === 'rapid' ? 'RAPIDE (Tc < Tr)' : 'LENTE (Tc > Tr)'}
                  </div>
                  <div className="text-[9px] text-neutral-500 mt-0.5">Tr = {whResults.reflectionTimeS} s</div>
                </div>

                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Pression Maximale</div>
                  <div className="text-xl font-black text-amber-400 mt-1">{whResults.maxPressureBar} bar</div>
                  <div className="text-[9px] text-neutral-400 mt-0.5">+{whResults.headRisePercent}% surpression</div>
                </div>

                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Survitesse Rotor</div>
                  <div className="text-xl font-black text-sky-400 mt-1">{whResults.runawaySpeedRpm} rpm</div>
                  <div className="text-[9px] text-neutral-400 mt-0.5">+{whResults.speedRisePercent}% survitesse</div>
                </div>
              </div>

              {/* Dynamic Oscillogram Graph */}
              <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="h-4 w-4" />
                      <span>{locale === 'fr' ? 'OSCILLOGRAMME TRANSITOIRE COUP DE BÉLIER' : 'WATER HAMMER OSCILLOGRAM'}</span>
                    </span>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      P(t) Pression Conduite · z(t) Niveau Cheminée · N(t) Vitesse
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOscillogramPlaying((p) => !p)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold uppercase hover:bg-cyan-400"
                    >
                      {isOscillogramPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                      <span>{isOscillogramPlaying ? 'PAUSE' : 'ANIMER'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeScrubberS(0)}
                      className="px-2 py-1 rounded-lg bg-[#080B10] border border-[#252E38] text-neutral-400 hover:text-white font-mono text-xs"
                    >
                      t=0
                    </button>
                  </div>
                </div>

                {/* SVG Oscillogram Graph */}
                <div className="mt-4 relative bg-[#080B10] p-3 rounded-xl border border-[#252E38] overflow-hidden">
                  <svg viewBox="0 0 600 240" className="w-full h-52">
                    {/* Grid lines */}
                    {[0, 60, 120, 180, 240].map((y) => (
                      <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#1A222D" strokeDasharray="3,3" />
                    ))}
                    {[0, 100, 200, 300, 400, 500, 600].map((x) => (
                      <line key={x} x1={x} y1="0" x2={x} y2="240" stroke="#1A222D" strokeDasharray="3,3" />
                    ))}

                    {/* Pressure Curve P(t) (Blue) */}
                    <path
                      d={waveformCurves.reduce((acc, pt, idx) => {
                        const x = (pt.t / 25) * 600;
                        // Map P between 0 and 35 bar to y 220 to 20
                        const y = 220 - (pt.p / 35) * 200;
                        return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(230, y))}`;
                      }, '')}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />

                    {/* Surge Tank Level z(t) (Cyan Dotted) */}
                    {whParams.hasSurgeTank && (
                      <path
                        d={waveformCurves.reduce((acc, pt, idx) => {
                          const x = (pt.t / 25) * 600;
                          // Map z between -10m and +25m
                          const y = 140 - (pt.z / 25) * 70;
                          return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(230, y))}`;
                        }, '')}
                        fill="none"
                        stroke="#2DD4BF"
                        strokeWidth="2"
                        strokeDasharray="4,3"
                      />
                    )}

                    {/* Speed Curve N(t) (Amber) */}
                    <path
                      d={waveformCurves.reduce((acc, pt, idx) => {
                        const x = (pt.t / 25) * 600;
                        // Map speed between 0 and runaway*1.2
                        const maxRpm = whResults.runawaySpeedRpm * 1.15;
                        const y = 220 - (pt.rpm / maxRpm) * 180;
                        return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(230, y))}`;
                      }, '')}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                    />

                    {/* Time Scrubber Vertical Line */}
                    <line
                      x1={(timeScrubberS / 25) * 600}
                      y1="0"
                      x2={(timeScrubberS / 25) * 600}
                      y2="240"
                      stroke="#EF4444"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] font-mono mt-3 px-2 pt-2 border-t border-[#1A222D]">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                        <span className="w-2.5 h-0.5 bg-sky-400 inline-block" /> Pression P(t) (bar)
                      </span>
                      {whParams.hasSurgeTank && (
                        <span className="flex items-center gap-1.5 text-teal-400 font-bold">
                          <span className="w-2.5 h-0.5 bg-teal-400 inline-block border-b border-dashed" /> Niveau Cheminée z(t) (m)
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> Vitesse N(t) (rpm)
                      </span>
                    </div>

                    <div className="text-red-400 font-bold">
                      t = {timeScrubberS} s
                    </div>
                  </div>
                </div>

                {/* Scrubber slider */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                    <span>Curseur Temporel d'Inspection (0 à 25 s)</span>
                    <span className="text-red-400 font-bold">{timeScrubberS} secondes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="0.1"
                    value={timeScrubberS}
                    onChange={(e) => {
                      setTimeScrubberS(Number(e.target.value));
                      setIsOscillogramPlaying(false);
                    }}
                    className="w-full accent-red-400"
                  />
                </div>

                {/* Readouts at scrubber time */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#080B10] border border-[#252E38] grid grid-cols-3 gap-3 font-mono text-center">
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase">Pression à t={timeScrubberS}s</div>
                    <div className="text-base font-black text-sky-400 mt-0.5">{currentInstantWave.p} bar</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase">Oscillation Cheminée</div>
                    <div className="text-base font-black text-teal-400 mt-0.5">
                      {whParams.hasSurgeTank ? `+${currentInstantWave.z} m` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase">Vitesse Rotorique</div>
                    <div className="text-base font-black text-amber-400 mt-0.5">{currentInstantWave.rpm} rpm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 3: SCADA OPERATOR DESK & 12-STEP STATE MACHINE               */}
      {/* ===================================================================== */}
      {activeSubTab === 'scada' && (
        <div className="space-y-6">
          {/* Top Operational Status Ribbon */}
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  scadaUnitState === 'loaded'
                    ? 'bg-emerald-400 ring-4 ring-emerald-500/30 animate-pulse'
                    : scadaUnitState === 'emergency_trip'
                    ? 'bg-red-500 ring-4 ring-red-500/40 animate-ping'
                    : 'bg-amber-400 ring-4 ring-amber-500/30'
                }`}
              />
              <div>
                <span className="font-mono text-xs font-bold text-neutral-400 uppercase">
                  {locale === 'fr' ? 'ÉTAT DU GROUPE NACHTIGAL G1 (70 MW) :' : 'UNIT STATE (NACHTIGAL G1 70 MW):'}
                </span>
                <div className="text-lg font-black text-white uppercase font-mono">
                  {scadaUnitState}
                </div>
              </div>
            </div>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-neutral-400">
                {locale === 'fr' ? 'Séquence Automate :' : 'PLC Sequence:'}
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#080B10] border border-[#252E38] text-amber-400 font-mono font-black text-sm">
                ÉTAPE {activeSequenceStepNum} / 12
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSequenceAutoRunning((p) => !p)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                  isSequenceAutoRunning
                    ? 'bg-amber-500 text-slate-950 shadow-lg'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                }`}
              >
                {isSequenceAutoRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{isSequenceAutoRunning ? 'PAUSE AUTO' : (locale === 'fr' ? 'LANCER SÉQUENCE' : 'AUTO START')}</span>
              </button>

              <button
                type="button"
                onClick={handleControlledStop}
                className="px-3 py-1.5 rounded-xl bg-[#080B10] border border-amber-600 text-amber-300 font-mono text-xs font-bold uppercase hover:bg-amber-950/40 transition-colors flex items-center gap-1.5"
              >
                <Power className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'ARRÊT NORMAL' : 'STOP'}</span>
              </button>

              <button
                type="button"
                onClick={handleEmergencyTrip}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-mono text-xs font-black uppercase hover:bg-red-500 transition-colors shadow-lg flex items-center gap-1.5 ring-2 ring-red-400/50"
              >
                <ZapOff className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'ARRÊT D\'URGENCE 86G' : 'TRIP 86G'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetScada}
                className="p-1.5 rounded-xl bg-[#080B10] border border-[#252E38] text-neutral-400 hover:text-white"
                title="Reset SCADA"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Telemetry Instruments & Active Step Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Live SCADA Gauges */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-4 font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Gauge className="h-4 w-4" />
                    <span>{locale === 'fr' ? 'TÉLÉMESURES DE TRANCHE' : 'UNIT TELEMETRY'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">ONLINE</span>
                </div>

                {/* Frequency & Voltage */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-500 uppercase">Fréquence</div>
                    <div className="text-lg font-black text-cyan-300 mt-0.5">{frequencyHz.toFixed(2)} Hz</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-500 uppercase">Tension Stator</div>
                    <div className="text-lg font-black text-yellow-300 mt-0.5">{statorVoltageKV.toFixed(1)} kV</div>
                  </div>
                </div>

                {/* Power MW & MVAr */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-500 uppercase">Puissance Active</div>
                    <div className="text-2xl font-black text-emerald-400 mt-0.5">{dispatchPowerMW} MW</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-500 uppercase">Réactif MVAr</div>
                    <div className="text-lg font-black text-purple-300 mt-0.5">+{dispatchReactiveMVAr} MVAr</div>
                  </div>
                </div>

                {/* Mechanical RPM & Gate Opening */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-500 uppercase">Vitesse Rotation</div>
                    <div className="text-lg font-black text-amber-300 mt-0.5">{turbineSpeedRpm} rpm</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-500 uppercase">Vannage Directrices</div>
                    <div className="text-lg font-black text-white mt-0.5">{guideVanePercent} %</div>
                  </div>
                </div>

                {/* Penstock Pressure */}
                <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase">Pression Bâche Spirale</div>
                    <div className="text-lg font-black text-cyan-400 mt-0.5">{penstockBar.toFixed(1)} bar</div>
                  </div>
                  <div className="text-right text-[10px] text-neutral-500">
                    <div>P_nom = 17.5 bar</div>
                    <div>H0 = 50.0 m</div>
                  </div>
                </div>

                {/* MW Load Control Buttons */}
                <div className="pt-2 border-t border-[#252E38]">
                  <div className="text-[10px] text-neutral-400 mb-2 uppercase">
                    {locale === 'fr' ? 'Consigne de Puissance Active (MW) :' : 'Power Dispatch (MW):'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRampMW(-10)}
                      disabled={scadaUnitState !== 'loaded' && scadaUnitState !== 'connected'}
                      className="flex-1 py-1.5 rounded-lg bg-[#080B10] border border-[#252E38] text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-40"
                    >
                      -10 MW
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRampMW(+10)}
                      disabled={scadaUnitState !== 'loaded' && scadaUnitState !== 'connected'}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-40"
                    >
                      +10 MW
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissive Lamps */}
              <div className="p-4 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-2 font-mono text-[11px]">
                <div className="text-xs font-bold text-neutral-400 uppercase mb-2">
                  {locale === 'fr' ? 'CONDITIONS D\'AUTORISATION (PERMISSIVES)' : 'START PERMISSIVES'}
                </div>
                {Object.entries(permissives).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-1 border-b border-[#1A222D]">
                    <span className="text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    {val ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> PRÊT
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> ATTENTE
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right 8 Cols: Step Sequencer Card */}
            <div className="lg:col-span-8 space-y-6">
              {/* Step Navigation Ribbon */}
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
                  <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span>{locale === 'fr' ? 'AUTOMATE DE SÉQUENCE (H18 & H26)' : 'PLC STEP SEQUENCER (H18 & H26)'}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveSequenceStepNum((p) => Math.max(1, p - 1))}
                      disabled={activeSequenceStepNum <= 1}
                      className="px-2.5 py-1 rounded bg-[#080B10] border border-[#252E38] text-xs font-mono text-neutral-300 hover:text-white disabled:opacity-40"
                    >
                      {locale === 'fr' ? 'Précédent' : 'Previous'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSequenceStepNum((p) => Math.min(12, p + 1))}
                      disabled={activeSequenceStepNum >= 12}
                      className="px-2.5 py-1 rounded bg-[#080B10] border border-[#252E38] text-xs font-mono text-neutral-300 hover:text-white disabled:opacity-40"
                    >
                      {locale === 'fr' ? 'Suivant' : 'Next'}
                    </button>
                  </div>
                </div>

                {/* 12 Steps Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {HYDRO_STARTUP_STEPS.map((step) => {
                    const isCurrent = step.stepNumber === activeSequenceStepNum;
                    const isPassed = step.stepNumber < activeSequenceStepNum;
                    return (
                      <button
                        key={step.stepNumber}
                        type="button"
                        onClick={() => setActiveSequenceStepNum(step.stepNumber)}
                        className={`p-2 rounded-xl text-center font-mono transition-all border ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-400'
                            : isPassed
                            ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400'
                            : 'bg-[#080B10] border-[#252E38] text-neutral-500'
                        }`}
                      >
                        <div className="text-[10px] font-bold">STEP {step.stepNumber}</div>
                        <div className="text-[9px] mt-0.5 truncate">{step.subsystem}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Detailed Card */}
                {(() => {
                  const step = HYDRO_STARTUP_STEPS[activeSequenceStepNum - 1] || HYDRO_STARTUP_STEPS[0];
                  return (
                    <div className="p-5 rounded-xl bg-[#080B10] border border-[#252E38] space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center">
                              {step.stepNumber}
                            </span>
                            <h4 className="text-sm font-bold text-white">{step.name[locale]}</h4>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-sky-400 px-2.5 py-0.5 rounded bg-sky-950 border border-sky-800">
                          {step.subsystem}
                        </span>
                      </div>

                      {/* Automated Control Action */}
                      <div>
                        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                          {locale === 'fr' ? 'Action Automatisée PLC :' : 'PLC Automated Control Action:'}
                        </div>
                        <div className="text-xs text-neutral-200 bg-[#0D1117] p-3 rounded-lg border border-[#252E38] font-mono leading-relaxed">
                          {step.controlAction}
                        </div>
                      </div>

                      {/* Equipment Involved & Prerequisites */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                          <div className="text-[10px] text-neutral-500 uppercase mb-1">
                            {locale === 'fr' ? 'Matériels Sollicités :' : 'Equipment Involved:'}
                          </div>
                          <ul className="space-y-1 text-sky-300">
                            {step.equipmentInvolved.map((eq, eIdx) => (
                              <li key={eIdx}>• {eq}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                          <div className="text-[10px] text-neutral-500 uppercase mb-1">
                            {locale === 'fr' ? 'Conditions Préalables :' : 'Prerequisites:'}
                          </div>
                          <ul className="space-y-1 text-emerald-300">
                            {step.prerequisites.map((req, rIdx) => (
                              <li key={rIdx}>✓ {req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Safety Interlocks & Abort Triggers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/60">
                          <div className="text-[10px] text-emerald-400 uppercase mb-1 font-bold">
                            {locale === 'fr' ? 'Interverrouillages de Sécurité :' : 'Safety Interlocks:'}
                          </div>
                          <ul className="space-y-1 text-neutral-300">
                            {step.safetyInterlocks.map((si, sIdx) => (
                              <li key={sIdx}>• {si}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg bg-red-950/20 border border-red-800/60">
                          <div className="text-[10px] text-red-400 uppercase mb-1 font-bold">
                            {locale === 'fr' ? 'Critères d\'Avortement Séquence :' : 'Abort Trigger Conditions:'}
                          </div>
                          <ul className="space-y-1 text-neutral-300">
                            {step.failureConditions.map((fc, fIdx) => (
                              <li key={fIdx}>⚠ {fc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 4: CAMEROON CASCADE & GRID CONTINGENCY                       */}
      {/* ===================================================================== */}
      {activeSubTab === 'cascade' && (
        <div className="space-y-6">
          {/* Contingency Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CAMEROON_CONTINGENCY_SCENARIOS.map((scen) => {
              const isSelected = scen.id === selectedContingencyId;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => {
                    setSelectedContingencyId(scen.id);
                    setCompletedSopSteps({});
                  }}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500/70 shadow-lg ring-1 ring-purple-500/50'
                      : 'bg-[#0D1117] border-[#252E38] hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-purple-400 uppercase px-2 py-0.5 rounded bg-[#080B10] border border-purple-900/60">
                      {scen.badge}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">{scen.gridFrequencyHz} Hz</span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">
                    {scen.title[locale]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Contingency Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Crisis Dispatching Matrix */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
                  <div>
                    <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
                      {locale === 'fr' ? 'INCIDENT SUR LE RÉSEAU NATIONAL CAMEROUNAIS' : 'CAMEROON NATIONAL GRID CONTINGENCY'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {activeContingency.title[locale]}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <div className="px-2.5 py-1 rounded bg-[#080B10] border border-[#252E38] text-red-400 font-bold">
                      f = {activeContingency.gridFrequencyHz} Hz
                    </div>
                    <div className="px-2.5 py-1 rounded bg-[#080B10] border border-[#252E38] text-yellow-400 font-bold">
                      U = {activeContingency.voltageKV} kV
                    </div>
                  </div>
                </div>

                {/* Scenario Context */}
                <div className="text-xs text-neutral-300 leading-relaxed p-4 rounded-xl bg-[#080B10] border border-[#252E38]">
                  {activeContingency.description[locale]}
                </div>

                {/* Cascade Impacts Table */}
                <div>
                  <div className="font-mono text-xs font-bold text-neutral-300 uppercase mb-2">
                    {locale === 'fr' ? 'IMPACTS EN CASCADE SUR LES AMÉNAGEMENTS SANAGA' : 'CASCADE HYDRAULIC & DISPATCH ACTIONS'}
                  </div>
                  <div className="space-y-2">
                    {activeContingency.cascadeImpacts.map((imp) => (
                      <div
                        key={imp.plantId}
                        className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-white font-mono">{imp.plantName}</div>
                          <div className="text-neutral-400 text-[11px] mt-0.5 font-sans">
                            {imp.operationalAction[locale]}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {imp.flowChange}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            {imp.powerChange}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scada Alarms Log */}
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/60 font-mono text-xs">
                  <div className="font-bold text-red-400 mb-2 flex items-center gap-1.5">
                    <Radio className="h-4 w-4" />
                    <span>{locale === 'fr' ? 'JOURNAL DES ALARMES SCADA NATIONAL :' : 'SCADA EVENT LOG:'}</span>
                  </div>
                  <div className="space-y-1 text-neutral-300 text-[11px]">
                    {activeContingency.scadaAlarms.map((alm, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-2">
                        <span className="text-red-400 font-bold">[!]</span>
                        <span>{alm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Standard Operating Procedure (SOP) Checklist */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{locale === 'fr' ? 'CONSIGNES DISPATCHER (SOP)' : 'DISPATCHER SOP CHECKLIST'}</span>
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500">
                    {Object.values(completedSopSteps).filter(Boolean).length} / {activeContingency.mitigationSteps[locale].length} FAIT
                  </span>
                </div>

                <p className="text-xs text-neutral-400">
                  {locale === 'fr'
                    ? 'Actions chronologiques impératives à valider par le chef de quart dispatching SONATREL / Eneo :'
                    : 'Mandatory operational steps to execute and validate by the central dispatch officer:'}
                </p>

                {/* Interactive Checklist */}
                <div className="space-y-2 font-mono text-xs">
                  {activeContingency.mitigationSteps[locale].map((step, sIdx) => {
                    const isDone = !!completedSopSteps[sIdx];
                    return (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => toggleSopStep(sIdx)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          isDone
                            ? 'bg-emerald-950/30 border-emerald-600/80 text-neutral-200 line-through'
                            : 'bg-[#080B10] border-[#252E38] text-white hover:border-neutral-600'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                            isDone ? 'bg-emerald-500 text-slate-950' : 'bg-[#252E38] text-neutral-400'
                          }`}
                        >
                          {isDone ? '✓' : sIdx + 1}
                        </span>
                        <span className="font-sans text-xs leading-relaxed">{step}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Action summary badge */}
                <div className="mt-4 p-3 rounded-xl bg-[#080B10] border border-[#252E38] text-center font-mono text-xs">
                  <div className="text-neutral-500 uppercase text-[10px]">Statut d'Exécution de la Procédure</div>
                  <div
                    className={`font-bold mt-0.5 ${
                      Object.values(completedSopSteps).filter(Boolean).length === activeContingency.mitigationSteps[locale].length
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {Object.values(completedSopSteps).filter(Boolean).length === activeContingency.mitigationSteps[locale].length
                      ? (locale === 'fr' ? 'PROCÉDURE VALIDÉE & SÉCURISÉE' : 'PROCEDURE VALIDATED')
                      : (locale === 'fr' ? 'EN COURS D\'EXÉCUTION' : 'IN PROGRESS')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
