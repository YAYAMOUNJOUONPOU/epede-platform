// src/components/substations/modules/OltcAvrParallelTransformersSimulator.tsx
// EPEDE Substation Power Transformer Suite: On-Load Tap Changer (OLTC),
// Automatic Voltage Regulator (AVR / ANSI 90), and Parallel Transformer
// Circulating Reactive Current Minimization Engine (Negative Reactance / Master-Follower)

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sliders,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Gauge,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Server,
  RefreshCw,
  Cpu,
  Info
} from 'lucide-react';

interface OltcAvrParallelTransformersSimulatorProps {
  locale: 'fr' | 'en';
}

type ControlMode = 'AUTO_AVR_ANSI90' | 'MANUAL_SUPERVISORY';
type ParallelScheme = 'MASTER_FOLLOWER' | 'NEGATIVE_REACTANCE' | 'INDEPENDENT';

export const OltcAvrParallelTransformersSimulator: React.FC<OltcAvrParallelTransformersSimulatorProps> = ({
  locale
}) => {
  // Grid Context (225 kV Transmission feeding 90 kV Subtransmission Busbar)
  const [gridVoltageHvKv, setGridVoltageHvKv] = useState<number>(225.0); // 225 kV nominal (fluctuates 210 - 242 kV)
  const [substationLoadMw, setSubstationLoadMw] = useState<number>(120); // Substation load
  const [powerFactorCosPhi, setPowerFactorCosPhi] = useState<number>(0.92); // inductive PF

  // AVR (ANSI 90) Settings
  const [targetVoltageMvKv, setTargetVoltageMvKv] = useState<number>(90.0); // 90 kV target MV busbar
  const [deadbandPercent, setDeadbandPercent] = useState<number>(1.5); // +/- 1.5% deadband
  const [avrTimeDelaySeconds, setAvrTimeDelaySeconds] = useState<number>(30); // 30s delay to prevent hunting
  const [controlMode, setControlMode] = useState<ControlMode>('AUTO_AVR_ANSI90');
  const [parallelScheme, setParallelScheme] = useState<ParallelScheme>('MASTER_FOLLOWER');

  // Transformer TR1 & TR2 Tap States (-16 to +16, 1.25% per tap)
  const [tr1Tap, setTr1Tap] = useState<number>(0);
  const [tr2Tap, setTr2Tap] = useState<number>(0);

  // Mechanical Motor Drive in transit state
  const [isTr1MotorRunning, setIsTr1MotorRunning] = useState<boolean>(false);
  const [isTr2MotorRunning, setIsTr2MotorRunning] = useState<boolean>(false);
  const [runawayFaultActive, setRunawayFaultActive] = useState<boolean>(false);

  // Electrical Computations (Per Transformer 100 MVA, 225/90 kV, Xcc = 14%)
  const tapStepPercent = 1.25;

  // Voltage ratio per tap
  const tr1Ratio = useMemo(() => 1 + (tr1Tap * tapStepPercent) / 100, [tr1Tap]);
  const tr2Ratio = useMemo(() => 1 + (tr2Tap * tapStepPercent) / 100, [tr2Tap]);

  // Secondary unloaded voltages
  const v1NoLoadKv = useMemo(() => (gridVoltageHvKv / 2.5) * tr1Ratio, [gridVoltageHvKv, tr1Ratio]);
  const v2NoLoadKv = useMemo(() => (gridVoltageHvKv / 2.5) * tr2Ratio, [gridVoltageHvKv, tr2Ratio]);

  // Circulating reactive current due to tap discrepancy:
  // I_circ = (V1 - V2) / (Z_t1 + Z_t2)
  const tapDiscrepancy = Math.abs(tr1Tap - tr2Tap);
  const zTransformerOhm = (90 * 90 / 100) * 0.14; // Base impedance * Xcc = 11.34 ohms
  const totalParallelZ = 2 * zTransformerOhm; // 22.68 ohms
  const voltageDifferenceVolts = Math.abs(v1NoLoadKv - v2NoLoadKv) * 1000 / Math.sqrt(3);

  // Circulating reactive current in Amperes
  const circulatingCurrentAmps = useMemo(() => {
    if (tr1Tap === tr2Tap) return 0;
    return Math.round(voltageDifferenceVolts / totalParallelZ);
  }, [voltageDifferenceVolts, totalParallelZ, tr1Tap, tr2Tap]);

  // Combined MV Bus Voltage under load
  const mvBusVoltageKv = useMemo(() => {
    const avgNoLoad = (v1NoLoadKv + v2NoLoadKv) / 2;
    // Voltage drop due to active and reactive load
    const deltaVLoad = (substationLoadMw / 200) * 3.5;
    return parseFloat((avgNoLoad - deltaVLoad).toFixed(2));
  }, [v1NoLoadKv, v2NoLoadKv, substationLoadMw]);

  // Voltage deviation from target in percent
  const voltageDeviationPercent = useMemo(() => {
    return parseFloat((((mvBusVoltageKv - targetVoltageMvKv) / targetVoltageMvKv) * 100).toFixed(2));
  }, [mvBusVoltageKv, targetVoltageMvKv]);

  // Is voltage outside AVR deadband?
  const isOutsideDeadband = Math.abs(voltageDeviationPercent) > deadbandPercent;
  const isVoltageLow = voltageDeviationPercent < -deadbandPercent;
  const isVoltageHigh = voltageDeviationPercent > deadbandPercent;

  // Additional thermal losses per transformer due to I_circ (P_circ = 3 * R_t * I_circ^2)
  const copperLossCirculatingKw = useMemo(() => {
    const rTransformerOhm = zTransformerOhm * 0.08; // ~0.9 ohm copper resistance
    return Math.round((3 * rTransformerOhm * Math.pow(circulatingCurrentAmps, 2)) / 1000);
  }, [circulatingCurrentAmps, zTransformerOhm]);

  // Automatic Voltage Regulation (AVR) Step Execution
  const handleAvrStepAction = (direction: 'RAISE' | 'LOWER') => {
    if (isTr1MotorRunning || isTr2MotorRunning) return;

    if (direction === 'RAISE') {
      setIsTr1MotorRunning(true);
      setTimeout(() => {
        setTr1Tap(prev => Math.min(16, prev + 1));
        setIsTr1MotorRunning(false);
        if (parallelScheme === 'MASTER_FOLLOWER') {
          setIsTr2MotorRunning(true);
          setTimeout(() => {
            setTr2Tap(prev => Math.min(16, prev + 1));
            setIsTr2MotorRunning(false);
          }, 1200);
        }
      }, 1500);
    } else {
      setIsTr1MotorRunning(true);
      setTimeout(() => {
        setTr1Tap(prev => Math.max(-16, prev - 1));
        setIsTr1MotorRunning(false);
        if (parallelScheme === 'MASTER_FOLLOWER') {
          setIsTr2MotorRunning(true);
          setTimeout(() => {
            setTr2Tap(prev => Math.max(-16, prev - 1));
            setIsTr2MotorRunning(false);
          }, 1200);
        }
      }, 1500);
    }
  };

  // Runaway motor fault simulation
  useEffect(() => {
    let runawayTimer: NodeJS.Timeout;
    if (runawayFaultActive) {
      runawayTimer = setInterval(() => {
        setTr1Tap(prev => {
          if (prev >= 16) {
            clearInterval(runawayTimer);
            return 16;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(runawayTimer);
  }, [runawayFaultActive]);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Banner: Power Transformer OLTC & AVR Architecture */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-sm">
              {locale === 'fr'
                ? "Régulation Automatique de Tension (AVR - ANSI 90) & Parallélisme de Transformateurs"
                : "Automatic Voltage Regulation (AVR - ANSI 90) & Parallel Transformer OLTC Engine"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {locale === 'fr'
              ? "Contrôle automatique du régleur en charge (OLTC 225/90 kV, ±16 plots à 1.25%), zone morte, temporisation anti-pompage et minimisation du courant de circulation réactif."
              : "Automatic On-Load Tap Changer control (225/90 kV, ±16 taps at 1.25%), deadband regulation, anti-hunting delay, and circulating reactive current mitigation."}
          </p>
        </div>

        {/* Control Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setControlMode('AUTO_AVR_ANSI90')}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              controlMode === 'AUTO_AVR_ANSI90'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? '1. Automatique (AVR ANSI 90)' : '1. Automatic (AVR 90)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setControlMode('MANUAL_SUPERVISORY')}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              controlMode === 'MANUAL_SUPERVISORY'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? '2. Manuel Téléconduit' : '2. Manual SCADA'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Transformers Mimic & Taps, Right = AVR Voltage Dashboard & Circulating Currents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: TRANSFORMERS TR1 / TR2 PARALLEL PHYSICAL STATE (COL 7) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Synoptique des Deux Transformateurs 100 MVA en Parallèle sur le Jeu de Barres 90 kV"
                    : "Parallel Transformers (2 x 100 MVA) on Common 90 kV Subtransmission Busbar"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-bold">
                  225 / 90 kV · YNyd11
                </span>
              </div>
            </div>

            {/* Parallel Scheme Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'MASTER_FOLLOWER', labelFr: 'Maître / Esclave', labelEn: 'Master / Follower', desc: 'TR1 commande, TR2 s\'aligne' },
                { id: 'NEGATIVE_REACTANCE', labelFr: 'Réactance Négative', labelEn: 'Negative Reactance', desc: 'Minimisation I_circ automatique' },
                { id: 'INDEPENDENT', labelFr: 'Indépendant (Risque)', labelEn: 'Independent (Drift)', desc: 'Régulations séparées' }
              ].map(scheme => (
                <button
                  key={scheme.id}
                  type="button"
                  onClick={() => setParallelScheme(scheme.id as ParallelScheme)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    parallelScheme === scheme.id
                      ? 'bg-amber-950/50 border-amber-400 text-amber-200 shadow-md shadow-amber-950/40'
                      : 'bg-[#0D121B] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold text-[11px] block">{locale === 'fr' ? scheme.labelFr : scheme.labelEn}</span>
                    <span className="text-[9px] text-slate-500">{scheme.desc}</span>
                  </div>
                  <span className="text-[8px] font-mono mt-1 text-slate-400">
                    {scheme.id === 'MASTER_FOLLOWER' ? 'LOCKSTEP' : scheme.id === 'NEGATIVE_REACTANCE' ? 'AVR-NRC' : 'UNCOUPLED'}
                  </span>
                </button>
              ))}
            </div>

            {/* Visual Mimic: TR1 and TR2 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* TR1 Card */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                isTr1MotorRunning
                  ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-950/40'
                  : 'bg-[#0D121B] border-[#1E2634]'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-[12px] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>TR1 (100 MVA)</span>
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isTr1MotorRunning ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isTr1MotorRunning ? 'MOTEUR EN TRANSIT' : 'STABLE'}
                  </span>
                </div>

                <div className="py-2.5 space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400 text-[10px]">Position Plot OLTC :</span>
                    <span className="text-base font-bold text-amber-400">
                      Plot {tr1Tap >= 0 ? `+${tr1Tap}` : tr1Tap}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Tension Secondaire à vide :</span>
                    <span className="text-slate-200 font-bold">{v1NoLoadKv.toFixed(2)} kV</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Rapport Réel :</span>
                    <span className="text-slate-300">{(225 / tr1Ratio).toFixed(1)} / 90 kV</span>
                  </div>
                </div>

                {/* Manual Step Controls for TR1 */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    disabled={isTr1MotorRunning || tr1Tap <= -16}
                    onClick={() => {
                      setIsTr1MotorRunning(true);
                      setTimeout(() => {
                        setTr1Tap(prev => Math.max(-16, prev - 1));
                        setIsTr1MotorRunning(false);
                      }, 1000);
                    }}
                    className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-[10px] cursor-pointer"
                  >
                    -1 Plot (Baisser)
                  </button>
                  <button
                    type="button"
                    disabled={isTr1MotorRunning || tr1Tap >= 16}
                    onClick={() => {
                      setIsTr1MotorRunning(true);
                      setTimeout(() => {
                        setTr1Tap(prev => Math.min(16, prev + 1));
                        setIsTr1MotorRunning(false);
                      }, 1000);
                    }}
                    className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-[10px] cursor-pointer"
                  >
                    +1 Plot (Monter)
                  </button>
                </div>
              </div>

              {/* TR2 Card */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                isTr2MotorRunning
                  ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-950/40'
                  : 'bg-[#0D121B] border-[#1E2634]'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-[12px] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TR2 (100 MVA)</span>
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isTr2MotorRunning ? 'bg-cyan-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isTr2MotorRunning ? 'MOTEUR EN TRANSIT' : 'STABLE'}
                  </span>
                </div>

                <div className="py-2.5 space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400 text-[10px]">Position Plot OLTC :</span>
                    <span className="text-base font-bold text-cyan-400">
                      Plot {tr2Tap >= 0 ? `+${tr2Tap}` : tr2Tap}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Tension Secondaire à vide :</span>
                    <span className="text-slate-200 font-bold">{v2NoLoadKv.toFixed(2)} kV</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Rapport Réel :</span>
                    <span className="text-slate-300">{(225 / tr2Ratio).toFixed(1)} / 90 kV</span>
                  </div>
                </div>

                {/* Manual Step Controls for TR2 */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    disabled={isTr2MotorRunning || tr2Tap <= -16 || parallelScheme === 'MASTER_FOLLOWER'}
                    onClick={() => {
                      setIsTr2MotorRunning(true);
                      setTimeout(() => {
                        setTr2Tap(prev => Math.max(-16, prev - 1));
                        setIsTr2MotorRunning(false);
                      }, 1000);
                    }}
                    className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-[10px] cursor-pointer"
                  >
                    -1 Plot (Baisser)
                  </button>
                  <button
                    type="button"
                    disabled={isTr2MotorRunning || tr2Tap >= 16 || parallelScheme === 'MASTER_FOLLOWER'}
                    onClick={() => {
                      setIsTr2MotorRunning(true);
                      setTimeout(() => {
                        setTr2Tap(prev => Math.min(16, prev + 1));
                        setIsTr2MotorRunning(false);
                      }, 1000);
                    }}
                    className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-[10px] cursor-pointer"
                  >
                    +1 Plot (Monter)
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Grid Voltage Injection Slider */}
            <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Fluctuation Réseau Amont 225 kV :</span>
                <span className={`font-bold ${gridVoltageHvKv > 235 ? 'text-amber-400' : gridVoltageHvKv < 215 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {gridVoltageHvKv.toFixed(1)} kV ({(((gridVoltageHvKv - 225) / 225) * 100).toFixed(1)}%)
                </span>
              </div>
              <input
                type="range"
                min="205"
                max="245"
                step="1"
                value={gridVoltageHvKv}
                onChange={e => setGridVoltageHvKv(parseFloat(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>205 kV (Creux Sévère)</span>
                <span>225 kV (Nominal)</span>
                <span>245 kV (Surtension)</span>
              </div>
            </div>

            {/* Runaway Failure Simulation Button */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRunawayFaultActive(!runawayFaultActive)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  runawayFaultActive
                    ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-950/70'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{runawayFaultActive ? 'STOP EMBALLEMENT MOTEUR' : 'SIMULER EMBALLEMENT MOTEUR (RUNAWAY)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTr1Tap(0);
                  setTr2Tap(0);
                  setGridVoltageHvKv(225.0);
                  setRunawayFaultActive(false);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: AVR ANSI 90 DASHBOARD & CIRCULATING CURRENT (COL 5) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Real-time MV Busbar Voltage & Deadband Display */}
          <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl space-y-3.5 ${
            isOutsideDeadband
              ? 'bg-amber-950/30 border-amber-500/70'
              : 'bg-[#080C13] border-[#222B38]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Gauge className={`w-4 h-4 ${isOutsideDeadband ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Tension Mesurée Jeu de Barres 90 kV & Zone Morte"
                    : "Measured 90 kV Busbar Voltage & AVR Deadband"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                !isOutsideDeadband
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-700'
              }`}>
                {!isOutsideDeadband ? 'DANS LA ZONE MORTE (CONFORME)' : 'ORDRE RÉGULATION EN ATTENTE'}
              </span>
            </div>

            {/* Big Voltage Readout */}
            <div className="p-3.5 rounded-xl bg-[#05080E] border border-[#1E2634] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Tension Effective Jeu de Barres :</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-bold text-white tracking-tight font-mono">
                    {mvBusVoltageKv}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">kV</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Écart à la Consigne ({targetVoltageMvKv} kV) :</span>
                <span className={`text-base font-bold font-mono ${
                  Math.abs(voltageDeviationPercent) > deadbandPercent ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {voltageDeviationPercent > 0 ? `+${voltageDeviationPercent}` : voltageDeviationPercent}%
                </span>
              </div>
            </div>

            {/* Visual Deadband Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Limite Basse : {(targetVoltageMvKv * (1 - deadbandPercent / 100)).toFixed(1)} kV</span>
                <span>Consigne : {targetVoltageMvKv} kV</span>
                <span>Limite Haute : {(targetVoltageMvKv * (1 + deadbandPercent / 100)).toFixed(1)} kV</span>
              </div>
              <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                {/* Deadband green middle window */}
                <div
                  className="absolute top-0 bottom-0 bg-emerald-500/40 border-x border-emerald-400"
                  style={{ left: '35%', width: '30%' }}
                />
                {/* Current voltage pointer */}
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-amber-400 shadow-md shadow-amber-400"
                  style={{
                    left: `${Math.min(98, Math.max(2, 50 + voltageDeviationPercent * 7))}%`
                  }}
                />
              </div>
            </div>

            {/* AVR Action Recommendation */}
            {isOutsideDeadband && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 text-[11px] font-sans text-amber-200 flex items-center justify-between gap-3">
                <div>
                  <strong className="block text-white">
                    {isVoltageLow ? 'ORDRE AVR : COMMANDE MONTER (+1 PLOT)' : 'ORDRE AVR : COMMANDE BAISSER (-1 PLOT)'}
                  </strong>
                  <span>Temporisation anti-pompage : 30 s</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAvrStepAction(isVoltageLow ? 'RAISE' : 'LOWER')}
                  disabled={isTr1MotorRunning || isTr2MotorRunning}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer disabled:opacity-40"
                >
                  {isVoltageLow ? 'Exécuter +1 Plot' : 'Exécuter -1 Plot'}
                </button>
              </div>
            )}
          </div>

          {/* Circulating Current & Thermal Losses Danger Meter */}
          <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl space-y-3.5 ${
            tapDiscrepancy >= 3
              ? 'bg-rose-950/30 border-rose-500/70 shadow-rose-950/50'
              : 'bg-[#080C13] border-[#222B38]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${tapDiscrepancy >= 3 ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Courant Réactif de Circulation en Parallèle (Icirc)"
                    : "Parallel Circulating Reactive Current (Icirc)"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                tapDiscrepancy === 0
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : tapDiscrepancy < 3
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
              }`}>
                {tapDiscrepancy === 0 ? 'NUL (0 A)' : tapDiscrepancy < 3 ? 'ACCEPTABLE' : 'DANGER THERMIQUE'}
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Écart de Plots (TR1 vs TR2) :</span>
                  <span className={`font-bold ${tapDiscrepancy >= 3 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {tapDiscrepancy} plots ({((tapDiscrepancy * 1.25)).toFixed(2)}% ΔU)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Courant de Circulation Réactif :</span>
                  <span className={`text-sm font-bold ${circulatingCurrentAmps > 150 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {circulatingCurrentAmps} A
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pertes Joules Supplémentaires :</span>
                  <span className="text-amber-400 font-bold">{copperLossCirculatingKw} kW</span>
                </div>
              </div>

              {tapDiscrepancy >= 3 ? (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-[11px] font-sans space-y-1">
                  <strong className="font-bold block text-white">
                    {locale === 'fr' ? 'ALARME ÉCART DE PLOTS PARALLÈLE (ANSI 90P) :' : 'PARALLEL TAP DISCREPANCY TRIP ALARM (ANSI 90P):'}
                  </strong>
                  <p className="leading-relaxed">
                    {locale === 'fr'
                      ? "L'écart de 3 plots ou plus crée un courant de circulation purement inductif qui surcharge inutilement les enroulements des deux transformateurs sans alimenter la charge, accélérant le vieillissement thermique de l'huile diélectrique."
                      : "A discrepancy of 3 or more taps triggers high circulating inductive currents, unnecessarily overloading windings without feeding active customer load and accelerating dielectric insulation degradation."}
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-sans">
                  {locale === 'fr'
                    ? "Courant de circulation sous contrôle. Les deux transformateurs se partagent équitablement la charge 90 kV."
                    : "Circulating current within safe limits. Both transformers share the 90 kV load symmetrically."}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
