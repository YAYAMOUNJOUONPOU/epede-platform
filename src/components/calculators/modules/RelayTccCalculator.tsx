// src/components/calculators/modules/RelayTccCalculator.tsx
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  Info, 
  FileText, 
  Sliders, 
  Layers, 
  AlertTriangle, 
  CheckCircle2,
  Download
} from 'lucide-react';

export interface InjectedRelayParams {
  stages?: ProtectionRelayStage[];
  nominalCurrentA?: number;
  breakingCapacityKa?: number;
  faultCurrentKa?: number;
  voltageLevel?: string;
}

export interface RelayTccCalculatorProps {
  locale: 'fr' | 'en';
  initialParams?: InjectedRelayParams;
  injectedContextInfo?: {
    equipmentId: string;
    equipmentName: string;
    equipmentTag?: string;
  };
  onOpenReport?: () => void;
}

export type IecCurveType = 'SI' | 'VI' | 'EI' | 'LTI' | 'DT';

export interface ProtectionRelayStage {
  id: string;
  name_fr: string;
  name_en: string;
  voltage_fr: string;
  voltage_en: string;
  color: string;
  curve: IecCurveType;
  is: number; // Pickup current (A)
  tms: number; // Time Multiplier Setting
  iinst: number; // ANSI 50 Instantaneous Pickup (A)
  tDef: number; // Definite time delay for DT (s)
  enabled: boolean;
}

export const RelayTccCalculator: React.FC<RelayTccCalculatorProps> = ({ 
  locale, 
  initialParams, 
  injectedContextInfo, 
  onOpenReport 
}) => {
  // 3 Selectivity Relay Stages: Upstream Substation 225/30 kV, Feeder 30 kV, and Downstream Low-Voltage ACB 400 V
  const [stages, setStages] = useState<ProtectionRelayStage[]>([
    {
      id: 'r_upstream',
      name_fr: 'R3: Arrivée Transfo 225/30 kV (Amont Poste)',
      name_en: 'R3: 225/30 kV Incomer (Upstream Substation)',
      voltage_fr: 'HTB/HTA (Réf. 30 kV)',
      voltage_en: 'HV/MV (30 kV Ref)',
      color: '#f59e0b', // Amber
      curve: 'SI',
      is: 600,
      tms: 0.35,
      iinst: 6500,
      tDef: 0.5,
      enabled: true,
    },
    {
      id: 'r_feeder',
      name_fr: 'R2: Départ Câble HTA 30 kV (Intermédiaire)',
      name_en: 'R2: 30 kV MV Feeder (Intermediate Stage)',
      voltage_fr: 'HTA 30 kV',
      voltage_en: 'MV 30 kV',
      color: '#06b6d4', // Cyan
      curve: 'VI',
      is: 220,
      tms: 0.18,
      iinst: 2600,
      tDef: 0.25,
      enabled: true,
    },
    {
      id: 'r_downstream',
      name_fr: 'R1: Disjoncteur Général TGBT 400 V (Aval)',
      name_en: 'R1: Main LV Circuit Breaker 400 V (Downstream)',
      voltage_fr: 'BT 400 V (Réf. 30 kV: × 0.0133)',
      voltage_en: 'LV 400 V (30 kV Ref: × 0.0133)',
      color: '#10b981', // Emerald
      curve: 'EI',
      is: 80, // Referred to 30 kV primary (equivalent to ~6000 A @ 400 V)
      tms: 0.10,
      iinst: 950, // Referred to 30 kV (equivalent to ~70 kA @ 400 V)
      tDef: 0.1,
      enabled: true,
    },
  ]);

  // Simulated Fault Injection Current (A referred to 30 kV busbar)
  const [injectedFaultA, setInjectedFaultA] = useState<number>(1800);
  const [gradingMarginTargetMs, setGradingMarginTargetMs] = useState<number>(250); // 250 ms standard electromechanical/numerical margin

  // Synchronize initialParams if injected from Equipment Detail or Drawer
  useEffect(() => {
    if (initialParams) {
      if (initialParams.faultCurrentKa) {
        setInjectedFaultA(initialParams.faultCurrentKa * 1000);
      }
      if (initialParams.stages && initialParams.stages.length > 0) {
        setStages(initialParams.stages);
      } else if (initialParams.nominalCurrentA) {
        const inA = initialParams.nominalCurrentA;
        const iinstA = initialParams.breakingCapacityKa 
          ? Math.min(initialParams.breakingCapacityKa * 1000 * 0.8, inA * 10)
          : inA * 8;

        setStages(prev => prev.map(s => {
          if (s.id === 'r_upstream' || s.id === 'r_feeder') {
            return {
              ...s,
              name_fr: injectedContextInfo?.equipmentName 
                ? `${injectedContextInfo.equipmentTag ? `[${injectedContextInfo.equipmentTag}] ` : ''}${injectedContextInfo.equipmentName}`
                : s.name_fr,
              name_en: injectedContextInfo?.equipmentName
                ? `${injectedContextInfo.equipmentTag ? `[${injectedContextInfo.equipmentTag}] ` : ''}${injectedContextInfo.equipmentName}`
                : s.name_en,
              is: inA,
              iinst: Math.round(iinstA),
            };
          }
          return s;
        }));
      }
    }
  }, [initialParams, injectedContextInfo]);

  // IEC 60255-151 Formula Evaluation
  const calculateTripTime = (stage: ProtectionRelayStage, currentA: number): number => {
    if (!stage.enabled || currentA < stage.is) return 999;
    if (currentA >= stage.iinst) return 0.035; // Instantaneous ANSI 50 opening in 35 ms

    if (stage.curve === 'DT') {
      return stage.tDef;
    }

    let alpha = 0.02;
    let beta = 0.14;

    if (stage.curve === 'VI') {
      alpha = 1.0;
      beta = 13.5;
    } else if (stage.curve === 'EI') {
      alpha = 2.0;
      beta = 80.0;
    } else if (stage.curve === 'LTI') {
      alpha = 1.0;
      beta = 120.0;
    }

    const multiple = currentA / stage.is;
    const denominator = Math.pow(multiple, alpha) - 1;
    if (denominator <= 0) return 999;

    const t = stage.tms * (beta / denominator);
    return Math.max(0.035, Math.min(100, t));
  };

  // Helper to update a specific stage property
  const updateStage = (id: string, updates: Partial<ProtectionRelayStage>) => {
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // Compute operational times at current injected fault
  const tR1 = calculateTripTime(stages[2], injectedFaultA);
  const tR2 = calculateTripTime(stages[1], injectedFaultA);
  const tR3 = calculateTripTime(stages[0], injectedFaultA);

  const marginR2_R1_ms = (tR2 - tR1) * 1000;
  const marginR3_R2_ms = (tR3 - tR2) * 1000;

  const isMarginR2_R1_Ok = tR1 > 900 || tR2 > 900 || marginR2_R1_ms >= gradingMarginTargetMs;
  const isMarginR3_R2_Ok = tR2 > 900 || tR3 > 900 || marginR3_R2_ms >= gradingMarginTargetMs;
  const isGlobalSelective = isMarginR2_R1_Ok && isMarginR3_R2_Ok && (tR1 < tR2 || tR1 > 900) && (tR2 < tR3 || tR2 > 900);

  // SVG coordinate transformation helpers (Log-Log: Current 50 A to 20,000 A; Time 0.01 s to 100 s)
  const minCurrent = 50;
  const maxCurrent = 20000;
  const minTime = 0.01;
  const maxTime = 100;

  const getSvgX = (currentA: number): number => {
    const clamped = Math.max(minCurrent, Math.min(maxCurrent, currentA));
    const logMin = Math.log10(minCurrent);
    const logMax = Math.log10(maxCurrent);
    const fraction = (Math.log10(clamped) - logMin) / (logMax - logMin);
    return 60 + fraction * 520;
  };

  const getSvgY = (timeSec: number): number => {
    const clamped = Math.max(minTime, Math.min(maxTime, timeSec));
    const logMin = Math.log10(minTime);
    const logMax = Math.log10(maxTime);
    const fraction = (Math.log10(clamped) - logMin) / (logMax - logMin);
    // Y is inverted in SVG
    return 330 - fraction * 300;
  };

  // Generate points for polyline per stage
  const generateCurvePoints = (stage: ProtectionRelayStage): string => {
    if (!stage.enabled) return '';
    const points: string[] = [];
    const currentSteps: number[] = [];

    for (let c = stage.is * 1.02; c <= maxCurrent; c += (c < 1000 ? 25 : c < 5000 ? 100 : 500)) {
      currentSteps.push(c);
    }
    // Also inject exact pickup and instantaneous
    currentSteps.push(stage.is * 1.01);
    currentSteps.push(stage.iinst - 1);
    currentSteps.push(stage.iinst + 1);
    currentSteps.sort((a, b) => a - b);

    for (const c of currentSteps) {
      const t = calculateTripTime(stage, c);
      if (t <= maxTime && t >= minTime) {
        const x = getSvgX(c);
        const y = getSvgY(t);
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
    }
    return points.join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-linear-to-r from-[#0C1322] via-[#0E1A2D] to-[#0A101D] border border-cyan-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                {locale === 'fr' ? 'SÉLECTIVITÉ & COORDINATION DES PROTECTIONS CEI 60255' : 'PROTECTION COORDINATION & TIME-CURRENT CURVES (TCC)'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                IEC 60255-151 / IEEE 242
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight">
              {locale === 'fr' ? 'Plan de Sélectivité Ampèremétrique & Chronométrique (TCC)' : 'Ampacity & Time-Current Grading Selectivity Plan'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Coordination sélective étagée sur 3 niveaux (Poste 225/30 kV, Départ 30 kV, et Disjoncteur BT 400 V). Ajustez les seuils de courant Is, les facteurs de temps TMS et les coupures instantanées ANSI 50 avec calcul de la marge de discrimination temporelle Δt ≥ 250 ms.'
                : '3-tier selective time-current coordination across HV Substation, 30 kV MV Feeder, and LV 400 V Main Breaker. Verify discrimination margins Δt ≥ 250 ms according to IEC 60255-151 and IEEE 242 Red Book.'}
            </p>
          </div>

          {onOpenReport && (
            <button
              type="button"
              onClick={onOpenReport}
              className="self-start lg:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
            >
              <FileText className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Note de Coordination' : 'Coordination Study Note'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Injected Equipment Context Synchronization Banner */}
      {injectedContextInfo && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 font-mono text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/40">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                {locale === 'fr' ? 'APPARIEMENT SÉLECTIVITÉ APPAREIL ACTIF' : 'ACTIVE APPARATUS SELECTIVITY SYNC'}
              </span>
              <span className="text-white font-bold">
                {injectedContextInfo.equipmentTag && `[${injectedContextInfo.equipmentTag}] `}
                {injectedContextInfo.equipmentName}
              </span>
              {initialParams?.nominalCurrentA && (
                <span className="ml-2 text-cyan-300 text-[11px]">
                  (In = {initialParams.nominalCurrentA} A
                  {initialParams.breakingCapacityKa ? ` · Icu = ${initialParams.breakingCapacityKa} kA` : ''}
                  {initialParams.voltageLevel ? ` · ${initialParams.voltageLevel}` : ''})
                </span>
              )}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-cyan-900/80 text-cyan-200 text-[11px] font-mono border border-cyan-600/60 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            CEI 60255-151
          </span>
        </div>
      )}

      {/* Real-Time Grading Health Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-emerald-500/40">
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-1">
            <span>{locale === 'fr' ? 'R1 DISJONCTEUR AVAL' : 'R1 DOWNSTREAM BREAKER'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">400 V BT</span>
          </div>
          <div className="text-2xl font-black text-white">
            {tR1 > 900 ? '> 100 s (Inactif)' : `${(tR1 * 1000).toFixed(0)} ms`}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {tR1 <= 0.04 ? '⚡ ANSI 50 Instantané (35 ms)' : `⏱️ ANSI 51 Tempo (${tR1.toFixed(3)} s)`}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-cyan-500/40">
          <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold mb-1">
            <span>{locale === 'fr' ? 'R2 DÉPART HTA 30 kV' : 'R2 30 kV FEEDER'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">HTA 30 kV</span>
          </div>
          <div className="text-2xl font-black text-white">
            {tR2 > 900 ? '> 100 s (Inactif)' : `${(tR2 * 1000).toFixed(0)} ms`}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {locale === 'fr' ? 'Marge R2-R1 :' : 'Margin R2-R1:'}{' '}
            <span className={isMarginR2_R1_Ok ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {tR1 > 900 || tR2 > 900 ? '--' : `${marginR2_R1_ms.toFixed(0)} ms (${isMarginR2_R1_Ok ? '✓ Valid' : '⚠️ < ' + gradingMarginTargetMs + 'ms'})`}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-amber-500/40">
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold mb-1">
            <span>{locale === 'fr' ? 'R3 ARRIVÉE AMONT TRANSFO' : 'R3 UPSTREAM INCOMER'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">225/30 kV</span>
          </div>
          <div className="text-2xl font-black text-white">
            {tR3 > 900 ? '> 100 s (Inactif)' : `${(tR3 * 1000).toFixed(0)} ms`}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {locale === 'fr' ? 'Marge R3-R2 :' : 'Margin R3-R2:'}{' '}
            <span className={isMarginR3_R2_Ok ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {tR2 > 900 || tR3 > 900 ? '--' : `${marginR3_R2_ms.toFixed(0)} ms (${isMarginR3_R2_Ok ? '✓ Valid' : '⚠️ < ' + gradingMarginTargetMs + 'ms'})`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Dual View: Left 7 Cols SVG Log-Log TCC / Right 5 Cols Relay Engineering Setpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: High-Precision Log-Log SVG TCC Chart */}
        <div className="lg:col-span-7 bg-[#070B12] rounded-2xl border border-[#222E3E] p-4 sm:p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#202B3C] pb-3 mb-3 text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                {locale === 'fr' ? 'COURBES LOGARITHMIQUES TEMPS-COURANT (TCC)' : 'LOG-LOG TIME-CURRENT CHARACTERISTICS'}
              </span>
              <span className="text-cyan-400 font-semibold">Tension Réf. : 30 kV</span>
            </div>

            {/* Injected Current Slider Control */}
            <div className="p-3 mb-4 rounded-xl bg-[#0D1522] border border-red-500/30 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-red-400" />
                  {locale === 'fr' ? 'Injection Courant de Défaut (If) :' : 'Fault Current Injection (If):'}
                </span>
                <span className="text-sm font-black text-white px-2 py-0.5 bg-red-950/70 border border-red-700/50 rounded">
                  {injectedFaultA} A @ 30 kV
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="12000"
                step="50"
                value={injectedFaultA}
                onChange={(e) => setInjectedFaultA(parseInt(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex gap-1 pt-1 text-[10px]">
                {[500, 1200, 1800, 3500, 5000, 8000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInjectedFaultA(val)}
                    className={`flex-1 py-1 rounded border text-center transition-all ${
                      injectedFaultA === val
                        ? 'bg-red-500 text-white font-bold border-red-400'
                        : 'bg-[#080D16] text-slate-400 hover:text-white border-[#202B3C]'
                    }`}
                  >
                    {val >= 1000 ? `${val / 1000}kA` : `${val}A`}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Log-Log Plot */}
            <div className="relative w-full aspect-[4/3] bg-[#05080E] rounded-xl border border-[#1C2636] p-2 overflow-hidden">
              <svg viewBox="0 0 600 360" className="w-full h-full font-mono text-[9px] select-none">
                {/* Horizontal Time Log Grid Lines */}
                {[
                  { t: 0.01, label: '10ms' },
                  { t: 0.05, label: '50ms' },
                  { t: 0.1, label: '0.1s' },
                  { t: 0.25, label: '0.25s' },
                  { t: 0.5, label: '0.5s' },
                  { t: 1.0, label: '1.0s' },
                  { t: 2.0, label: '2.0s' },
                  { t: 5.0, label: '5s' },
                  { t: 10.0, label: '10s' },
                  { t: 30.0, label: '30s' },
                  { t: 100.0, label: '100s' },
                ].map(({ t, label }) => {
                  const y = getSvgY(t);
                  return (
                    <g key={t}>
                      <line x1={60} y1={y} x2={580} y2={y} stroke="#1A2534" strokeWidth="1" strokeDasharray="3 3" />
                      <text x={55} y={y + 3} fill="#64748B" textAnchor="end">{label}</text>
                    </g>
                  );
                })}

                {/* Vertical Current Log Grid Lines */}
                {[
                  { c: 50, label: '50A' },
                  { c: 100, label: '100A' },
                  { c: 200, label: '200A' },
                  { c: 500, label: '500A' },
                  { c: 1000, label: '1kA' },
                  { c: 2000, label: '2kA' },
                  { c: 5000, label: '5kA' },
                  { c: 10000, label: '10kA' },
                  { c: 20000, label: '20kA' },
                ].map(({ c, label }) => {
                  const x = getSvgX(c);
                  return (
                    <g key={c}>
                      <line x1={x} y1={30} x2={x} y2={330} stroke="#1A2534" strokeWidth="1" strokeDasharray="3 3" />
                      <text x={x} y={345} fill="#64748B" textAnchor="middle">{label}</text>
                    </g>
                  );
                })}

                {/* Main Axis Lines */}
                <line x1={60} y1={330} x2={580} y2={330} stroke="#475569" strokeWidth="1.5" />
                <line x1={60} y1={30} x2={60} y2={330} stroke="#475569" strokeWidth="1.5" />

                {/* Axis Labels */}
                <text x={320} y={357} fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {locale === 'fr' ? 'Courant I (A efficaces ramenés à 30 kV)' : 'Current I (RMS Amperes referred to 30 kV)'}
                </text>
                <text x={18} y={180} fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 18 180)">
                  {locale === 'fr' ? 'Temps de Fonctionnement (s)' : 'Operating Time t (seconds)'}
                </text>

                {/* Render Curves for each Relay Stage */}
                {stages.map((stage) => {
                  const pts = generateCurvePoints(stage);
                  if (!pts) return null;
                  return (
                    <g key={stage.id}>
                      <polyline
                        points={pts}
                        fill="none"
                        stroke={stage.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Instantaneous cutoff drop step */}
                      {stage.iinst <= maxCurrent && (
                        <line
                          x1={getSvgX(stage.iinst)}
                          y1={getSvgY(minTime)}
                          x2={getSvgX(stage.iinst)}
                          y2={getSvgY(calculateTripTime({ ...stage, iinst: 99999 }, stage.iinst))}
                          stroke={stage.color}
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Injected Fault Indicator Line */}
                {(() => {
                  const xFault = getSvgX(injectedFaultA);
                  const y1 = tR1 <= maxTime && tR1 >= minTime ? getSvgY(tR1) : null;
                  const y2 = tR2 <= maxTime && tR2 >= minTime ? getSvgY(tR2) : null;
                  const y3 = tR3 <= maxTime && tR3 >= minTime ? getSvgY(tR3) : null;

                  return (
                    <g>
                      <line
                        x1={xFault}
                        y1={30}
                        x2={xFault}
                        y2={330}
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeDasharray="5 3"
                      />
                      {/* Fault Tag */}
                      <rect x={xFault - 28} y={32} width={56} height={18} rx={4} fill="#991B1B" />
                      <text x={xFault} y={44} fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                        If={injectedFaultA}A
                      </text>

                      {/* Tripping points */}
                      {y1 !== null && (
                        <circle cx={xFault} cy={y1} r="5" fill="#10B981" stroke="#05080E" strokeWidth="2" />
                      )}
                      {y2 !== null && (
                        <circle cx={xFault} cy={y2} r="5" fill="#06B6D4" stroke="#05080E" strokeWidth="2" />
                      )}
                      {y3 !== null && (
                        <circle cx={xFault} cy={y3} r="5" fill="#F59E0B" stroke="#05080E" strokeWidth="2" />
                      )}

                      {/* Discrimination Margin Brackets */}
                      {y1 !== null && y2 !== null && Math.abs(y1 - y2) > 6 && (
                        <g>
                          <line x1={xFault + 12} y1={y1} x2={xFault + 12} y2={y2} stroke={isMarginR2_R1_Ok ? '#34D399' : '#F87171'} strokeWidth="2" />
                          <text x={xFault + 16} y={(y1 + y2) / 2 + 3} fill={isMarginR2_R1_Ok ? '#34D399' : '#F87171'} fontSize="8" fontWeight="bold">
                            Δt={marginR2_R1_ms.toFixed(0)}ms
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })()}

                {/* Floating Legend */}
                <g transform="translate(420, 36)">
                  <rect x="0" y="0" width="155" height="70" rx="6" fill="#0B131F" stroke="#253549" opacity="0.95" />
                  <circle cx="12" cy="16" r="4" fill="#F59E0B" />
                  <text x="22" y="19" fill="#F59E0B" fontSize="9" fontWeight="bold">R3: Amont (225/30kV)</text>

                  <circle cx="12" cy="35" r="4" fill="#06B6D4" />
                  <text x="22" y="38" fill="#06B6D4" fontSize="9" fontWeight="bold">R2: Départ 30 kV</text>

                  <circle cx="12" cy="54" r="4" fill="#10B981" />
                  <text x="22" y="57" fill="#10B981" fontSize="9" fontWeight="bold">R1: TGBT 400 V</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Quick Discrimination Verdict Banner */}
          <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 font-mono text-xs ${
            isGlobalSelective
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/40 border-red-500/50 text-red-200'
          }`}>
            {isGlobalSelective ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
            )}
            <div className="flex-1">
              <span className="font-bold uppercase tracking-wider block">
                {isGlobalSelective
                  ? (locale === 'fr' ? 'SÉLECTIVITÉ TOTALE CHRONOMÉTRIQUE VALIDÉE' : 'FULL SELECTIVE GRADING VALIDATED')
                  : (locale === 'fr' ? 'ATTENTION : RISQUE DE DÉCLENCHEMENT SIMULTANÉ' : 'WARNING: SIMULTANEOUS TRIP HAZARD')}
              </span>
              <span className="text-[11px] opacity-90 block mt-0.5">
                {locale === 'fr'
                  ? `Marge R2/R1: ${marginR2_R1_ms.toFixed(0)} ms (Cible ≥ ${gradingMarginTargetMs} ms) · Marge R3/R2: ${marginR3_R2_ms.toFixed(0)} ms. L'élimination du défaut s'effectue par le palier le plus proche sans coupure généralisée.`
                  : `Grading R2/R1: ${marginR2_R1_ms.toFixed(0)} ms (Target ≥ ${gradingMarginTargetMs} ms) · Grading R3/R2: ${marginR3_R2_ms.toFixed(0)} ms. Fault isolation guaranteed by closest protective tier.`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Setpoints for the 3 Relay Stages */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          
          {/* Global Target & Reset Bar */}
          <div className="p-3 bg-[#0D121B] rounded-xl border border-[#232F42] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span className="text-white font-bold text-xs uppercase">
                {locale === 'fr' ? 'Cible Marge Δt :' : 'Grading Target Δt:'}
              </span>
              <select
                value={gradingMarginTargetMs}
                onChange={(e) => setGradingMarginTargetMs(parseInt(e.target.value))}
                className="bg-[#162030] text-cyan-300 font-bold px-2 py-1 rounded border border-[#2B3B52]"
              >
                <option value="200">200 ms (Numérique ultra-rapide)</option>
                <option value="250">250 ms (Standard CEI Numérique)</option>
                <option value="300">300 ms (Électromécanique / Mixte)</option>
                <option value="400">400 ms (Réseau Haute Sécurité)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setStages([
                  {
                    id: 'r_upstream',
                    name_fr: 'R3: Arrivée Transfo 225/30 kV (Amont)',
                    name_en: 'R3: 225/30 kV Incomer (Upstream)',
                    voltage_fr: 'HTB/HTA (Réf. 30 kV)',
                    voltage_en: 'HV/MV (30 kV Ref)',
                    color: '#f59e0b',
                    curve: 'SI',
                    is: 600,
                    tms: 0.35,
                    iinst: 6500,
                    tDef: 0.5,
                    enabled: true,
                  },
                  {
                    id: 'r_feeder',
                    name_fr: 'R2: Départ Câble HTA 30 kV',
                    name_en: 'R2: 30 kV MV Feeder',
                    voltage_fr: 'HTA 30 kV',
                    voltage_en: 'MV 30 kV',
                    color: '#06b6d4',
                    curve: 'VI',
                    is: 220,
                    tms: 0.18,
                    iinst: 2600,
                    tDef: 0.25,
                    enabled: true,
                  },
                  {
                    id: 'r_downstream',
                    name_fr: 'R1: Disjoncteur Général BT 400 V',
                    name_en: 'R1: Main LV Breaker 400 V',
                    voltage_fr: 'BT 400 V (Réf. 30 kV)',
                    voltage_en: 'LV 400 V (30 kV Ref)',
                    color: '#10b981',
                    curve: 'EI',
                    is: 80,
                    tms: 0.10,
                    iinst: 950,
                    tDef: 0.1,
                    enabled: true,
                  },
                ]);
                setInjectedFaultA(1800);
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              title="Reset default IEC setpoints"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Individual Stage Cards */}
          {stages.map((stage, idx) => (
            <div
              key={stage.id}
              className="p-4 rounded-xl bg-[#0B1019] border transition-all"
              style={{ borderColor: stage.color + '55' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-white font-bold text-xs">
                    {locale === 'fr' ? stage.name_fr : stage.name_en}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {locale === 'fr' ? stage.voltage_fr : stage.voltage_en}
                </span>
              </div>

              {/* Grid of Inputs */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Curve Type */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    {locale === 'fr' ? 'Courbe CEI (51) :' : 'IEC Curve (51):'}
                  </label>
                  <select
                    value={stage.curve}
                    onChange={(e) => updateStage(stage.id, { curve: e.target.value as IecCurveType })}
                    className="w-full bg-[#121926] border border-[#28354A] rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="SI">Standard Inverse (SI)</option>
                    <option value="VI">Very Inverse (VI)</option>
                    <option value="EI">Extremely Inverse (EI)</option>
                    <option value="LTI">Long Time Inverse (LTI)</option>
                    <option value="DT">Temps Constant (DT)</option>
                  </select>
                </div>

                {/* Pickup Is */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    {locale === 'fr' ? 'Seuil Is (A @ 30 kV) :' : 'Pickup Is (A @ 30 kV):'}
                  </label>
                  <input
                    type="number"
                    value={stage.is}
                    onChange={(e) => updateStage(stage.id, { is: parseFloat(e.target.value) || 10 })}
                    className="w-full bg-[#121926] border border-[#28354A] rounded px-2 py-1 text-xs font-bold text-white"
                  />
                </div>

                {/* Time Multiplier TMS */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    {locale === 'fr' ? 'Facteur TMS (0.05 - 1.5) :' : 'Time Dial TMS (0.05 - 1.5):'}
                  </label>
                  <input
                    type="number"
                    step="0.02"
                    min="0.05"
                    max="1.5"
                    value={stage.tms}
                    onChange={(e) => updateStage(stage.id, { tms: parseFloat(e.target.value) || 0.05 })}
                    className="w-full bg-[#121926] border border-[#28354A] rounded px-2 py-1 text-xs font-bold text-white"
                  />
                </div>

                {/* Instantaneous ANSI 50 */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    {locale === 'fr' ? 'Seuil Instantané 50 (A) :' : 'Instantaneous 50 (A):'}
                  </label>
                  <input
                    type="number"
                    value={stage.iinst}
                    onChange={(e) => updateStage(stage.id, { iinst: parseFloat(e.target.value) || 100 })}
                    className="w-full bg-[#121926] border border-[#28354A] rounded px-2 py-1 text-xs font-bold text-white"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Educational Notes */}
          <div className="p-3.5 rounded-xl bg-[#090E16] border border-[#202C3D] text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
            <div className="text-cyan-400 font-bold uppercase flex items-center gap-1 text-[10px]">
              <Info className="h-3.5 w-3.5 text-cyan-400" />
              <span>{locale === 'fr' ? 'RÈGLES D’INGÉNIERIE DE LA DISCRIMINATION TEMPORELLE' : 'TIME DISCRIMINATION ENGINEERING RULES'}</span>
            </div>
            <p>
              {locale === 'fr'
                ? '1. L’intervalle de sélectivité Δt = t_amont - t_aval doit couvrir : temps de coupure du disjoncteur (60-80 ms) + dépassement d’inertie du relais amont (30-40 ms) + incertitude des TC et tolérance CEI (100 ms) + marge de sécurité (50 ms) = total typique de 250 ms pour relais numériques.'
                : '1. The grading interval Δt = t_upstream - t_downstream must encompass: circuit breaker interrupting time (60-80 ms) + relay overshoot time (30-40 ms) + CT ratio & relay timing errors (100 ms) + safety margin (50 ms) = standard 250 ms for numerical relays.'}
            </p>
            <p>
              {locale === 'fr'
                ? '2. L’utilisation de courbes Extremely Inverse (EI) sur le disjoncteur aval et Very Inverse (VI) ou Standard Inverse (SI) sur le palier amont maximise l’écart temporel aux courants de court-circuit élevés.'
                : '2. Applying Extremely Inverse (EI) curves on downstream feeders and Very/Standard Inverse on incomers naturally widens time margins at heavy fault currents.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
