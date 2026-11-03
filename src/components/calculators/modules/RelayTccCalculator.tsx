// src/components/calculators/modules/RelayTccCalculator.tsx
// EPEDE 2.0: IEC 60255-151 / IEEE C37.112 Relay Protection Coordination & Interactive Log-Log TCC Curve Grapher
// Normative standards: IEC 60255-151, IEEE Std C37.112, IEEE 242 (Buff Book), ANSI/IEEE C57.109, IEC 60949

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  Info, 
  FileText, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2,
  X,
  Eye,
  Activity,
  Layers
} from 'lucide-react';
import {
  Iec60255RelayEngine,
  CAMEROON_RELAY_PRESETS,
  IecCurveCode,
  RelayStageDefinition,
  TransformerWithstandSpec,
  CableThermalDamageSpec,
  TccCurvePoint
} from '../../../data/iec60255RelayEngine';

export interface InjectedRelayParams {
  stages?: RelayStageDefinition[];
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

export const RelayTccCalculator: React.FC<RelayTccCalculatorProps> = ({ 
  locale, 
  initialParams, 
  injectedContextInfo, 
  onOpenReport 
}) => {
  // Preset selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sonatrel-bekoko-225-30kv');

  // Stages state initialized from first preset
  const defaultPreset = CAMEROON_RELAY_PRESETS[0];
  const [stages, setStages] = useState<RelayStageDefinition[]>(
    JSON.parse(JSON.stringify(defaultPreset.stages))
  );

  // Equipment withstand specs
  const [transformerSpec, setTransformerSpec] = useState<TransformerWithstandSpec | undefined>(
    defaultPreset.transformer ? { ...defaultPreset.transformer } : undefined
  );
  const [cableSpec, setCableSpec] = useState<CableThermalDamageSpec | undefined>(
    defaultPreset.cable ? { ...defaultPreset.cable } : undefined
  );

  // Injected test fault current (A @ reference voltage)
  const [injectedFaultA, setInjectedFaultA] = useState<number>(defaultPreset.injectedFaultA || 2800);
  const [gradingMarginTargetMs, setGradingMarginTargetMs] = useState<number>(250);

  // Overlay toggles
  const [showTransformerCurves, setShowTransformerCurves] = useState<boolean>(true);
  const [showCableCurve, setShowCableCurve] = useState<boolean>(true);
  const [showFormulasModal, setShowFormulasModal] = useState<boolean>(false);

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
          if (s.id.includes('upstream') || s.id.includes('incomer') || s.id.includes('trafo')) {
            return {
              ...s,
              name: {
                fr: injectedContextInfo?.equipmentName || s.name.fr,
                en: injectedContextInfo?.equipmentName || s.name.en,
              },
              pickupCurrentA: inA,
              instantaneousPickupA: Math.round(iinstA),
            };
          }
          return s;
        }));
      }
    }
  }, [initialParams, injectedContextInfo]);

  // Load Preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = CAMEROON_RELAY_PRESETS.find(p => p.id === presetId);
    if (found) {
      setStages(JSON.parse(JSON.stringify(found.stages)));
      setTransformerSpec(found.transformer ? { ...found.transformer } : undefined);
      setCableSpec(found.cable ? { ...found.cable } : undefined);
      setInjectedFaultA(found.injectedFaultA);
    }
  };

  // Helper to update stage property
  const updateStage = (id: string, updates: Partial<RelayStageDefinition>) => {
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // Run IEC 60255-151 / IEEE C37.112 Physics Engine
  const solution = useMemo(() => {
    return Iec60255RelayEngine.solve(
      stages,
      injectedFaultA,
      gradingMarginTargetMs,
      showTransformerCurves ? transformerSpec : undefined,
      showCableCurve ? cableSpec : undefined,
      30000
    );
  }, [stages, injectedFaultA, gradingMarginTargetMs, transformerSpec, cableSpec, showTransformerCurves, showCableCurve]);

  // Log-Log SVG Coordinate System (Current: 50 A to 25,000 A; Time: 0.01 s to 100 s)
  const minCurrent = 50;
  const maxCurrent = 25000;
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
    return 330 - fraction * 300;
  };

  // Convert array of TCC points to SVG polyline string
  const pointsToPolyline = (pts: TccCurvePoint[]): string => {
    return pts
      .filter(p => p.tripTimeSec >= minTime && p.tripTimeSec <= maxTime && p.currentA >= minCurrent && p.currentA <= maxCurrent)
      .map(p => `${getSvgX(p.currentA).toFixed(1)},${getSvgY(p.tripTimeSec).toFixed(1)}`)
      .join(' ');
  };

  // Upstream transformer inrush safety check (8x In @ 0.1s)
  const inrushVerification = useMemo(() => {
    if (!transformerSpec) return null;
    const inA = (transformerSpec.ratedKva * 1000) / (Math.sqrt(3) * 30000);
    const inrushA = inA * transformerSpec.inrushMultiplier;
    // Upstream stage is usually the highest pickup stage
    const upstreamStage = stages.find(s => s.id.includes('upstream') || s.id.includes('incomer')) || stages[stages.length - 1];
    if (!upstreamStage) return null;

    const tripTimeAtInrush = Iec60255RelayEngine.calculateOperatingTime(
      upstreamStage.curveType,
      upstreamStage.pickupCurrentA,
      upstreamStage.timeMultiplier,
      upstreamStage.instantaneousPickupA,
      upstreamStage.instantaneousTimeSec,
      inrushA,
      upstreamStage.definiteTimeDelaySec
    );

    const isSafe = tripTimeAtInrush > transformerSpec.inrushDurationSec;
    return {
      inA: Math.round(inA),
      inrushA: Math.round(inrushA),
      tripTimeSec: tripTimeAtInrush,
      inrushDurationSec: transformerSpec.inrushDurationSec,
      isSafe
    };
  }, [transformerSpec, stages]);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1322] via-[#0E1A2D] to-[#0A101D] border border-cyan-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                {locale === 'fr' ? 'SÉLECTIVITÉ & COORDINATION DES PROTECTIONS CEI 60255 / IEEE C37.112' : 'PROTECTION COORDINATION & TIME-CURRENT CURVES (TCC)'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                IEC 60255-151 / IEEE C37.112 / IEEE 242
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight">
              {locale === 'fr' ? 'Grapheur Log-Log TCC & Marges de Discrimination Δt' : 'Log-Log TCC Curve Grapher & Discrimination Margins'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Coordination chronométrique et ampèremétrique étagée selon CEI 60255-151 (SI, VI, EI, LTI) et IEEE C37.112 (MI, VI, EI). Superposition des courbes d\'endommagement thermique transformateur (IEEE C57.109), points d\'enclenchement (Inrush 8×In @ 0.1s) et tenue des câbles (CEI 60949).'
                : '3-tier selective time-current grading across HV Incomer, MV Feeder, and LV Breaker. Overlays IEEE C57.109 transformer thermal damage limits, magnetizing inrush points, and IEC 60949 cable thermal withstand.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => setShowFormulasModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 shadow transition-all"
            >
              <Info className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Formules & Normes' : 'Formulas & Standards'}</span>
            </button>

            {onOpenReport && (
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <FileText className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Note de Coordination' : 'Coordination Study Note'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="p-3.5 rounded-xl bg-[#0B1019] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-400" />
          <span className="text-white font-bold uppercase tracking-wider">
            {locale === 'fr' ? 'Cas Industriels Types (Cameroun) :' : 'Cameroon Benchmark Presets:'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CAMEROON_RELAY_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold shadow-md shadow-amber-500/10'
                    : 'bg-[#121926] text-slate-400 hover:text-white border-[#243248]'
                }`}
              >
                {locale === 'fr' ? preset.name.fr : preset.name.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Injected Context Banner */}
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
            CEI 60255-151 / IEEE C37.112
          </span>
        </div>
      )}

      {/* Real-Time Grading Health Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {solution.stages.map((stg) => {
          const tSec = stg.operatingTimeAtFaultSec;
          const isInstant = stg.isInstantaneousTripping;
          return (
            <div
              key={stg.definition.id}
              className="p-3.5 rounded-xl bg-[#0F172A] border transition-all"
              style={{ borderColor: stg.definition.color + '66' }}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1" style={{ color: stg.definition.color }}>
                <span className="truncate">{locale === 'fr' ? stg.definition.name.fr.split(':')[0] : stg.definition.name.en.split(':')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {stg.definition.curveType.replace('IEC_', '').replace('IEEE_', '')}
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {tSec > 900 ? '> 100 s' : `${(tSec * 1000).toFixed(0)} ms`}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                {isInstant ? '⚡ ANSI 50 Instantané (35ms)' : `⏱️ ANSI 51 (${tSec.toFixed(3)}s)`}
              </div>
            </div>
          );
        })}

        {/* Inrush Safety Status Tile */}
        {inrushVerification && (
          <div className={`p-3.5 rounded-xl bg-[#0F172A] border ${
            inrushVerification.isSafe ? 'border-emerald-500/50' : 'border-red-500/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className={inrushVerification.isSafe ? 'text-emerald-400' : 'text-red-400'}>
                {locale === 'fr' ? 'ENCLENCHEMENT TRANSFO' : 'TRANSFORMER INRUSH'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                8×In @ 0.1s
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {inrushVerification.tripTimeSec > 100 ? '> 100 s' : `${(inrushVerification.tripTimeSec * 1000).toFixed(0)} ms`}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {inrushVerification.isSafe ? (
                <span className="text-emerald-400 font-bold">✓ Pas de déclenchement intempestif</span>
              ) : (
                <span className="text-red-400 font-bold">⚠️ Risque de déclenchement à vide</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Layout: 7 Cols SVG Log-Log Plot / 5 Cols Relay Engineering Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Log-Log SVG Chart */}
        <div className="lg:col-span-7 bg-[#070B12] rounded-2xl border border-[#222E3E] p-4 sm:p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between border-b border-[#202B3C] pb-3 mb-3 text-xs font-mono gap-2">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                {locale === 'fr' ? 'COURBES LOGARITHMIQUES TEMPS-COURANT (TCC)' : 'LOG-LOG TIME-CURRENT CHARACTERISTICS'}
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTransformerCurves}
                    onChange={(e) => setShowTransformerCurves(e.target.checked)}
                    className="accent-amber-500 rounded cursor-pointer"
                  />
                  <span>{locale === 'fr' ? 'Dégâts Transfo / Inrush' : 'Trafo Damage / Inrush'}</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCableCurve}
                    onChange={(e) => setShowCableCurve(e.target.checked)}
                    className="accent-purple-400 rounded cursor-pointer"
                  />
                  <span>{locale === 'fr' ? 'Tenue Câble' : 'Cable Withstand'}</span>
                </label>
              </div>
            </div>

            {/* Injected Fault Current Slider */}
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
                max="15000"
                step="50"
                value={injectedFaultA}
                onChange={(e) => setInjectedFaultA(parseInt(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex gap-1 pt-1 text-[10px]">
                {[500, 1200, 2800, 4500, 7000, 10000].map((val) => (
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
                    {val >= 1000 ? `${(val / 1000).toFixed(1)}kA` : `${val}A`}
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
                  { c: 25000, label: '25kA' },
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

                {/* Transformer Damage Curve (IEEE C57.109) */}
                {showTransformerCurves && solution.transformerDamageCurve.length > 0 && (
                  <g>
                    <polyline
                      points={pointsToPolyline(solution.transformerDamageCurve)}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeDasharray="6 3"
                    />
                    <text
                      x={getSvgX(solution.transformerDamageCurve[0]?.currentA || 1000) + 5}
                      y={getSvgY(solution.transformerDamageCurve[0]?.tripTimeSec || 30) - 5}
                      fill="#F59E0B"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      Dégâts Transfo C57.109
                    </text>
                  </g>
                )}

                {/* Cable Thermal Damage Curve (IEC 60949) */}
                {showCableCurve && solution.cableDamageCurve.length > 0 && (
                  <g>
                    <polyline
                      points={pointsToPolyline(solution.cableDamageCurve)}
                      fill="none"
                      stroke="#C084FC"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={getSvgX(solution.cableDamageCurve[0]?.currentA || 2000) + 5}
                      y={getSvgY(solution.cableDamageCurve[0]?.tripTimeSec || 4) - 5}
                      fill="#C084FC"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      Limite Câble I²t
                    </text>
                  </g>
                )}

                {/* Transformer Inrush Magnetizing Points */}
                {showTransformerCurves && solution.inrushPoints.map((pt, idx) => {
                  const x = getSvgX(pt.currentA);
                  const y = getSvgY(pt.timeSec);
                  return (
                    <g key={idx}>
                      <polygon
                        points={`${x},${y - 6} ${x + 5},${y + 4} ${x - 5},${y + 4}`}
                        fill="#EF4444"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <text x={x + 7} y={y + 3} fill="#EF4444" fontSize="8" fontWeight="bold">
                        {pt.label}
                      </text>
                    </g>
                  );
                })}

                {/* Relay Stage Curves */}
                {solution.stages.map((stg) => {
                  if (!stg.definition.enabled) return null;
                  const pts = pointsToPolyline(stg.curvePoints);
                  if (!pts) return null;
                  return (
                    <g key={stg.definition.id}>
                      <polyline
                        points={pts}
                        fill="none"
                        stroke={stg.definition.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* ANSI 50 Instantaneous vertical step down */}
                      {stg.definition.instantaneousPickupA <= maxCurrent && (
                        <line
                          x1={getSvgX(stg.definition.instantaneousPickupA)}
                          y1={getSvgY(minTime)}
                          x2={getSvgX(stg.definition.instantaneousPickupA)}
                          y2={getSvgY(
                            Iec60255RelayEngine.calculateOperatingTime(
                              stg.definition.curveType,
                              stg.definition.pickupCurrentA,
                              stg.definition.timeMultiplier,
                              999999,
                              0.035,
                              stg.definition.instantaneousPickupA,
                              stg.definition.definiteTimeDelaySec
                            )
                          )}
                          stroke={stg.definition.color}
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Injected Fault Indicator Line & Operating Points */}
                {(() => {
                  const xFault = getSvgX(injectedFaultA);
                  const operatingPoints = solution.stages
                    .filter(s => s.definition.enabled)
                    .map(s => ({
                      stage: s,
                      time: s.operatingTimeAtFaultSec,
                      y: s.operatingTimeAtFaultSec <= maxTime && s.operatingTimeAtFaultSec >= minTime
                        ? getSvgY(s.operatingTimeAtFaultSec)
                        : null
                    }))
                    .filter(p => p.y !== null);

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
                      {/* Fault Current Badge */}
                      <rect x={xFault - 30} y={32} width={60} height={18} rx={4} fill="#991B1B" />
                      <text x={xFault} y={44} fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                        If={injectedFaultA}A
                      </text>

                      {/* Tripping Points */}
                      {operatingPoints.map(({ stage, y }, i) => (
                        <circle
                          key={i}
                          cx={xFault}
                          cy={y!}
                          r="5"
                          fill={stage.definition.color}
                          stroke="#05080E"
                          strokeWidth="2"
                        />
                      ))}

                      {/* Margin Brackets between adjacent stages */}
                      {solution.gradingResults.map((gr, idx) => {
                        const downStage = solution.stages.find(s => s.definition.id === gr.downstreamId);
                        const upStage = solution.stages.find(s => s.definition.id === gr.upstreamId);
                        if (!downStage || !upStage) return null;
                        const yDown = downStage.operatingTimeAtFaultSec <= maxTime && downStage.operatingTimeAtFaultSec >= minTime
                          ? getSvgY(downStage.operatingTimeAtFaultSec)
                          : null;
                        const yUp = upStage.operatingTimeAtFaultSec <= maxTime && upStage.operatingTimeAtFaultSec >= minTime
                          ? getSvgY(upStage.operatingTimeAtFaultSec)
                          : null;

                        if (yDown === null || yUp === null || Math.abs(yDown - yUp) < 6) return null;

                        const bracketX = xFault + 12 + idx * 8;
                        const isOk = gr.isSelective;

                        return (
                          <g key={idx}>
                            <line
                              x1={bracketX}
                              y1={yDown}
                              x2={bracketX}
                              y2={yUp}
                              stroke={isOk ? '#34D399' : '#F87171'}
                              strokeWidth="2"
                            />
                            <text
                              x={bracketX + 4}
                              y={(yDown + yUp) / 2 + 3}
                              fill={isOk ? '#34D399' : '#F87171'}
                              fontSize="8"
                              fontWeight="bold"
                            >
                              Δt={gr.gradingMarginMs}ms
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })()}

                {/* Floating Legend */}
                <g transform="translate(415, 36)">
                  <rect x="0" y="0" width="160" height="90" rx="6" fill="#0B131F" stroke="#253549" opacity="0.95" />
                  {solution.stages.slice(0, 3).map((stg, i) => (
                    <g key={stg.definition.id} transform={`translate(10, ${18 + i * 22})`}>
                      <circle cx="4" cy="0" r="4" fill={stg.definition.color} />
                      <text x="14" y="3" fill={stg.definition.color} fontSize="8.5" fontWeight="bold">
                        {locale === 'fr' ? stg.definition.name.fr.split(':')[0] : stg.definition.name.en.split(':')[0]} ({stg.definition.curveType.replace('IEC_', '').replace('IEEE_', '')})
                      </text>
                    </g>
                  ))}
                  {showTransformerCurves && (
                    <g transform="translate(10, 80)">
                      <line x1="0" y1="0" x2="10" y2="0" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
                      <text x="14" y="3" fill="#F59E0B" fontSize="8">
                        Dégâts C57.109
                      </text>
                    </g>
                  )}
                </g>
              </svg>
            </div>
          </div>

          {/* Quick Discrimination Verdict Banner */}
          <div className={`mt-4 p-3.5 rounded-xl border flex items-center gap-3 font-mono text-xs ${
            solution.isGlobalSelectivityAchieved
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/40 border-red-500/50 text-red-200'
          }`}>
            {solution.isGlobalSelectivityAchieved ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
            )}
            <div className="flex-1">
              <span className="font-bold uppercase tracking-wider block">
                {solution.isGlobalSelectivityAchieved
                  ? (locale === 'fr' ? 'SÉLECTIVITÉ TOTALE CHRONOMÉTRIQUE VALIDÉE' : 'FULL SELECTIVE GRADING VALIDATED')
                  : (locale === 'fr' ? 'ATTENTION : RISQUE DE DÉCLENCHEMENT SIMULTANÉ' : 'WARNING: SIMULTANEOUS TRIP HAZARD')}
              </span>
              <span className="text-[11px] opacity-90 block mt-0.5">
                {solution.gradingResults.map(gr => `${gr.downstreamId}→${gr.upstreamId}: ${gr.gradingMarginMs}ms`).join(' · ')}
                {locale === 'fr' ? ` (Cible ≥ ${gradingMarginTargetMs} ms).` : ` (Target ≥ ${gradingMarginTargetMs} ms).`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Relay Stage Engineering Setpoints */}
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
              onClick={() => handleSelectPreset(selectedPresetId)}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              title="Reset to selected preset defaults"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Individual Relay Stage Cards */}
          {stages.map((stage) => (
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
                    {locale === 'fr' ? stage.name.fr : stage.name.en}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {locale === 'fr' ? stage.voltageTier.fr : stage.voltageTier.en}
                  </span>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stage.enabled}
                      onChange={(e) => updateStage(stage.id, { enabled: e.target.checked })}
                      className="accent-cyan-500 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Grid of Inputs */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Curve Standard & Type */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    {locale === 'fr' ? 'Courbe (51) :' : 'Curve (51):'}
                  </label>
                  <select
                    value={stage.curveType}
                    onChange={(e) => updateStage(stage.id, { curveType: e.target.value as IecCurveCode })}
                    className="w-full bg-[#121926] border border-[#28354A] rounded px-2 py-1 text-white text-xs"
                  >
                    <optgroup label="CEI 60255-151">
                      <option value="IEC_SI">Standard Inverse (SI)</option>
                      <option value="IEC_VI">Very Inverse (VI)</option>
                      <option value="IEC_EI">Extremely Inverse (EI)</option>
                      <option value="IEC_LTI">Long Time Inverse (LTI)</option>
                    </optgroup>
                    <optgroup label="IEEE C37.112">
                      <option value="IEEE_MI">IEEE Moderately Inverse (MI)</option>
                      <option value="IEEE_VI">IEEE Very Inverse (VI)</option>
                      <option value="IEEE_EI">IEEE Extremely Inverse (EI)</option>
                    </optgroup>
                    <optgroup label="Temporisé Constant">
                      <option value="DEFINITE_TIME">Temps Constant (DT)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Pickup Current Is */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    {locale === 'fr' ? 'Seuil Is (A @ Réf.) :' : 'Pickup Is (A @ Ref):'}
                  </label>
                  <input
                    type="number"
                    value={stage.pickupCurrentA}
                    onChange={(e) => updateStage(stage.id, { pickupCurrentA: parseFloat(e.target.value) || 10 })}
                    className="w-full bg-[#121926] border border-[#28354A] rounded px-2 py-1 text-xs font-bold text-white"
                  />
                </div>

                {/* Time Multiplier TMS / TD */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    {locale === 'fr' ? 'Facteur TMS / TD :' : 'Time Dial TMS / TD:'}
                  </label>
                  <input
                    type="number"
                    step="0.02"
                    min="0.02"
                    max="3.0"
                    value={stage.timeMultiplier}
                    onChange={(e) => updateStage(stage.id, { timeMultiplier: parseFloat(e.target.value) || 0.05 })}
                    className="w-full bg-[#121926] border border-[#28354A] rounded px-2 py-1 text-xs font-bold text-white"
                  />
                </div>

                {/* Instantaneous ANSI 50 */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    {locale === 'fr' ? 'Instantané 50 (A) :' : 'Instantaneous 50 (A):'}
                  </label>
                  <input
                    type="number"
                    value={stage.instantaneousPickupA}
                    onChange={(e) => updateStage(stage.id, { instantaneousPickupA: parseFloat(e.target.value) || 100 })}
                    className="w-full bg-[#121926] border border-[#28354A] rounded px-2 py-1 text-xs font-bold text-white"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Educational Engineering Rules */}
          <div className="p-3.5 rounded-xl bg-[#090E16] border border-[#202C3D] text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
            <div className="text-cyan-400 font-bold uppercase flex items-center gap-1 text-[10px]">
              <Info className="h-3.5 w-3.5 text-cyan-400" />
              <span>{locale === 'fr' ? 'RÈGLES D’INGÉNIERIE DE LA COORDINATION' : 'ENGINEERING COORDINATION RULES'}</span>
            </div>
            <p>
              {locale === 'fr'
                ? '1. L’intervalle de sélectivité Δt = t_amont - t_aval doit couvrir : temps de coupure du disjoncteur (60-80 ms) + dépassement d’inertie du relais amont (30-40 ms) + incertitude des TC et tolérance CEI (100 ms) + marge de sécurité (50 ms) = total 250 ms pour relais numériques.'
                : '1. The grading interval Δt = t_upstream - t_downstream must encompass: breaker interrupting time (60-80 ms) + relay overshoot (30-40 ms) + CT error & IEC tolerance (100 ms) + safety margin (50 ms) = standard 250 ms for numerical relays.'}
            </p>
            <p>
              {locale === 'fr'
                ? '2. La courbe du relais amont doit impérativement passer au-dessus du point d’enclenchement transfo (Inrush : 8×In @ 0.1s) pour prévenir tout déclenchement intempestif à la mise sous tension.'
                : '2. The upstream incomer relay curve must lie strictly above the transformer inrush point (8×In @ 0.1s) to avoid nuisance tripping upon energization.'}
            </p>
          </div>

        </div>
      </div>

      {/* Normative Formulas & Standards Modal */}
      {showFormulasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0B121E] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  {locale === 'fr' ? 'Formules Normatives CEI 60255 & IEEE C37.112' : 'IEC 60255 & IEEE C37.112 Normative Formulas'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFormulasModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              {/* IEC Formula */}
              <div className="p-3.5 rounded-xl bg-[#070D17] border border-cyan-500/30 space-y-2">
                <span className="text-cyan-400 font-bold block text-sm">
                  1. CEI 60255-151 (Courbes à Temps Dépendamment Inverse)
                </span>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-center text-cyan-200 text-sm font-bold">
                  t(I) = TMS · [ β / ((I / Is)^α - 1) ]
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  <li><b>Standard Inverse (SI) :</b> α = 0.02, β = 0.14</li>
                  <li><b>Very Inverse (VI) :</b> α = 1.00, β = 13.5</li>
                  <li><b>Extremely Inverse (EI) :</b> α = 2.00, β = 80.0</li>
                  <li><b>Long-Time Inverse (LTI) :</b> α = 1.00, β = 120.0</li>
                </ul>
              </div>

              {/* IEEE Formula */}
              <div className="p-3.5 rounded-xl bg-[#070D17] border border-amber-500/30 space-y-2">
                <span className="text-amber-400 font-bold block text-sm">
                  2. IEEE Std C37.112 / IEEE 242 (Buff Book)
                </span>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-center text-amber-200 text-sm font-bold">
                  t(I) = TD · [ (A / ((I / Is)^p - 1)) + B ]
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  <li><b>Moderately Inverse (MI) :</b> A = 0.0515, B = 0.1140, p = 0.02</li>
                  <li><b>Very Inverse (VI) :</b> A = 19.61, B = 0.4910, p = 2.00</li>
                  <li><b>Extremely Inverse (EI) :</b> A = 28.2, B = 0.1217, p = 2.00</li>
                </ul>
              </div>

              {/* Discrimination Grading Margin */}
              <div className="p-3.5 rounded-xl bg-[#070D17] border border-emerald-500/30 space-y-2">
                <span className="text-emerald-400 font-bold block text-sm">
                  3. Décomposition de l'Intervalle de Sélectivité (Δt)
                </span>
                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-center text-emerald-200 text-sm font-bold">
                  Δt = t_cb + t_o + 2·t_e + t_m ≥ 250 ms
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  <li><b>t_cb (Temps de coupure disjoncteur) :</b> 60 à 80 ms</li>
                  <li><b>t_o (Dépassement d'inertie relais amont) :</b> 30 à 40 ms</li>
                  <li><b>2·t_e (Incertitude TC et relais CEI classe 5P20) :</b> ~100 ms</li>
                  <li><b>t_m (Marge de sécurité supplémentaire) :</b> ~50 ms</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowFormulasModal(false)}
                className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all"
              >
                {locale === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
