// src/components/diagrams/modules/SldTccCoordinationModal.tsx
import React, { useState, useMemo } from 'react';
import { X, Sliders, ShieldCheck, Info, CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import {
  CURVE_DEFINITIONS,
  IecCurveType,
  RelayCoordinationSettings,
  calculateRelayTripTime,
  evaluateGradingMargin,
  DEFAULT_SUBSTATION_RELAY_PLAN,
} from '../../../services/protectionCoordinationService';

interface SldTccCoordinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  activeFault?: string | null;
}

export const SldTccCoordinationModal: React.FC<SldTccCoordinationModalProps> = ({
  isOpen,
  onClose,
  locale,
  activeFault,
}) => {
  // Relay States: 4 full substation levels (Feeder F1, Incomer MV 52-3, Trafo HV 52-2, Line HV 52-1)
  const [feederF1, setFeederF1] = useState<RelayCoordinationSettings>(DEFAULT_SUBSTATION_RELAY_PLAN.feederF1);
  const [incomerMv, setIncomerMv] = useState<RelayCoordinationSettings>(DEFAULT_SUBSTATION_RELAY_PLAN.incomerMv);
  const [trafoHv, setTrafoHv] = useState<RelayCoordinationSettings>(DEFAULT_SUBSTATION_RELAY_PLAN.trafoHv);
  const [lineHv, setLineHv] = useState<RelayCoordinationSettings>(DEFAULT_SUBSTATION_RELAY_PLAN.lineHv);

  // Active view mode: 2-stage (Feeder vs Incomer) or 4-stage Comprehensive Tree
  const [coordinationMode, setCoordinationMode] = useState<'FEEDER_VS_INCOMER' | 'FULL_CHAIN'>('FULL_CHAIN');
  const [enableInstantaneous50, setEnableInstantaneous50] = useState<boolean>(true);

  // Short-circuit fault current Ik (kA)
  const [faultCurrentKa, setFaultCurrentKa] = useState<number>(
    activeFault === '50_51' || activeFault === '21' ? 14.8 : 8.5
  );

  // Reset to calibrated standard settings
  const handleResetDefaults = () => {
    setFeederF1(DEFAULT_SUBSTATION_RELAY_PLAN.feederF1);
    setIncomerMv(DEFAULT_SUBSTATION_RELAY_PLAN.incomerMv);
    setTrafoHv(DEFAULT_SUBSTATION_RELAY_PLAN.trafoHv);
    setLineHv(DEFAULT_SUBSTATION_RELAY_PLAN.lineHv);
  };

  // Auto-tune grading margins: automatically compute TMS so that each level has exactly 300 ms margin
  const handleAutoTuneGrading = () => {
    const faultA = faultCurrentKa * 1000;
    // Step 1: Feeder F1 is base (tms = 0.10)
    const tunedF1 = { ...feederF1, tms: 0.10 };
    const tF1 = calculateRelayTripTime(faultA, tunedF1);

    // Step 2: Incomer 52-3 needs tF1 + 0.30s
    const targetT52_3 = (tF1 === Infinity ? 0.2 : tF1) + 0.30;
    const { k: kMv, alpha: alphaMv } = CURVE_DEFINITIONS[incomerMv.curveType];
    const ratioMv = Math.max(1.1, faultA / incomerMv.pickupCurrentA);
    const requiredTmsMv = Math.max(0.05, Math.min(1.5, targetT52_3 / (kMv / (Math.pow(ratioMv, alphaMv) - 1))));
    const tuned52_3 = { ...incomerMv, tms: parseFloat(requiredTmsMv.toFixed(2)) };

    // Step 3: Trafo 52-2 needs targetT52_3 + 0.30s
    const targetT52_2 = targetT52_3 + 0.30;
    // Note: Line currents on 225 kV are stepped down by ratio 225/30 = 7.5
    const faultAHv = faultA / 7.5;
    const { k: kHv, alpha: alphaHv } = CURVE_DEFINITIONS[trafoHv.curveType];
    const ratioHv = Math.max(1.1, faultAHv / trafoHv.pickupCurrentA);
    const requiredTmsHv = Math.max(0.05, Math.min(1.5, targetT52_2 / (kHv / (Math.pow(ratioHv, alphaHv) - 1))));
    const tuned52_2 = { ...trafoHv, tms: parseFloat(requiredTmsHv.toFixed(2)) };

    // Step 4: Line 52-1 needs targetT52_2 + 0.30s
    const targetT52_1 = targetT52_2 + 0.30;
    const { k: kLine, alpha: alphaLine } = CURVE_DEFINITIONS[lineHv.curveType];
    const ratioLine = Math.max(1.1, faultAHv / lineHv.pickupCurrentA);
    const requiredTmsLine = Math.max(0.05, Math.min(1.5, targetT52_1 / (kLine / (Math.pow(ratioLine, alphaLine) - 1))));
    const tuned52_1 = { ...lineHv, tms: parseFloat(requiredTmsLine.toFixed(2)) };

    setFeederF1(tunedF1);
    setIncomerMv(tuned52_3);
    setTrafoHv(tuned52_2);
    setLineHv(tuned52_1);
  };

  // Grading evaluation calculations
  const actualFaultA = faultCurrentKa * 1000;
  // MV reference
  const tF1 = calculateRelayTripTime(actualFaultA, feederF1);
  const t52_3 = calculateRelayTripTime(actualFaultA, incomerMv);
  // HV reference stepped by transformer turns ratio (225 / 30 = 7.5)
  const actualFaultAHv = actualFaultA / 7.5;
  const t52_2 = calculateRelayTripTime(actualFaultAHv, trafoHv);
  const t52_1 = calculateRelayTripTime(actualFaultAHv, lineHv);

  // Margins
  const gradingStage1 = useMemo(() => evaluateGradingMargin(feederF1, incomerMv, actualFaultA), [feederF1, incomerMv, actualFaultA]);
  const gradingStage2 = useMemo(() => evaluateGradingMargin(incomerMv, trafoHv, actualFaultAHv), [incomerMv, trafoHv, actualFaultAHv]);
  const gradingStage3 = useMemo(() => evaluateGradingMargin(trafoHv, lineHv, actualFaultAHv), [trafoHv, lineHv, actualFaultAHv]);

  const allSelective = gradingStage1.isSelective && gradingStage2.isSelective && gradingStage3.isSelective;

  if (!isOpen) return null;

  // Logarithmic Coordinate Canvas Setup
  const width = 580;
  const height = 370;
  const padding = { left: 60, right: 30, top: 30, bottom: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const minI = 100;
  const maxI = 40000;
  const minT = 0.02;
  const maxT = 10;

  const logMinI = Math.log10(minI);
  const logMaxI = Math.log10(maxI);
  const logMinT = Math.log10(minT);
  const logMaxT = Math.log10(maxT);

  const getX = (current: number) => {
    const val = Math.max(minI, Math.min(maxI, current));
    const logVal = Math.log10(val);
    return padding.left + ((logVal - logMinI) / (logMaxI - logMinI)) * plotWidth;
  };

  const getY = (time: number) => {
    const val = Math.max(minT, Math.min(maxT, time));
    const logVal = Math.log10(val);
    return padding.top + ((logMaxT - logVal) / (logMaxT - logMinT)) * plotHeight;
  };

  // Generate SVG path for a given relay curve
  const generatePath = (relay: RelayCoordinationSettings, currentScaleFactor: number = 1.0) => {
    const points: string[] = [];
    const steps = 70;
    for (let i = 0; i <= steps; i++) {
      const logI = logMinI + (i / steps) * (logMaxI - logMinI);
      const currentAtMv = Math.pow(10, logI);
      const relayCurrent = currentAtMv * currentScaleFactor;

      if (relayCurrent >= relay.pickupCurrentA * 1.02) {
        let t = calculateRelayTripTime(relayCurrent, relay);
        if (!enableInstantaneous50 && relay.instantaneousPickupA && relayCurrent >= relay.instantaneousPickupA) {
          // calculate without 50 floor
          const curve = CURVE_DEFINITIONS[relay.curveType];
          const ratio = relayCurrent / relay.pickupCurrentA;
          t = relay.tms * (curve.k / (Math.pow(ratio, curve.alpha) - 1));
        }

        if (t <= maxT && t >= minT) {
          const px = getX(currentAtMv).toFixed(1);
          const py = getY(t).toFixed(1);
          points.push(`${points.length === 0 ? 'M' : 'L'} ${px} ${py}`);
        }
      }
    }
    return points.join(' ');
  };

  // Curve paths on 30 kV base
  const pathF1 = generatePath(feederF1, 1.0);
  const path52_3 = generatePath(incomerMv, 1.0);
  const path52_2 = generatePath(trafoHv, 1 / 7.5);
  const path52_1 = generatePath(lineHv, 1 / 7.5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[94vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight">
                  {locale === 'fr'
                    ? 'PLAN DE PROTECTION & COORDINATION SÉLECTIVE (CEI 60255 / CEI 60909)'
                    : 'TIME-CURRENT CHARACTERISTICS (TCC) & SELECTIVITY MATRIX'}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  allSelective
                    ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-800 border-rose-500/30'
                }`}>
                  {allSelective ? 'SÉLECTIVITÉ TOTALE' : 'ATTENTION CHEVAUCHEMENT'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {locale === 'fr'
                  ? 'Échelonnement sélectif Δt ≥ 250–300 ms : Départ HTA F1 ➔ Disjoncteur Arrivée 52-3 ➔ Transfo 52-2 ➔ Ligne 52-1'
                  : 'Discrimination grading margin Δt ≥ 250–300 ms: Feeder F1 ➔ MV Incomer 52-3 ➔ Trafo 52-2 ➔ Line 52-1'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoTuneGrading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-500/30 transition-colors shadow-xs cursor-pointer"
              title={locale === 'fr' ? 'Calculer automatiquement les TMS pour garantir Δt = 300 ms à chaque étage' : 'Automatically tune TMS for Δt = 300 ms on all stages'}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>{locale === 'fr' ? 'Calage Auto Δt 300ms' : 'Auto-Tune Δt 300ms'}</span>
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={locale === 'fr' ? 'Réinitialiser aux calages standard' : 'Reset to standard settings'}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action / Configuration Sub-bar */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">{locale === 'fr' ? 'Mode d\'Analyse :' : 'Analysis Mode:'}</span>
            <div className="inline-flex rounded-lg bg-white border border-slate-200 p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => setCoordinationMode('FULL_CHAIN')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  coordinationMode === 'FULL_CHAIN'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {locale === 'fr' ? 'Cascade Complète (4 Étages)' : 'Full Cascade (4 Stages)'}
              </button>
              <button
                type="button"
                onClick={() => setCoordinationMode('FEEDER_VS_INCOMER')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  coordinationMode === 'FEEDER_VS_INCOMER'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {locale === 'fr' ? 'Départ vs Arrivée (2 Étages)' : 'Feeder vs Incomer (2 Stages)'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={enableInstantaneous50}
                onChange={(e) => setEnableInstantaneous50(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>{locale === 'fr' ? 'Plafond Instantané (ANSI 50)' : 'Instantaneous Cutoff (ANSI 50)'}</span>
            </label>
            <div className="text-slate-500">
              <span>{locale === 'fr' ? 'Rapport Transfo 63 MVA : ' : 'Trafo Ratio: '}</span>
              <strong className="text-slate-800">225 kV / 30 kV (m = 7.5)</strong>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Logarithmic Coordinate Plot & Cascaded Margins (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner flex flex-col items-center">
              {/* Curve Badges Legend */}
              <div className="w-full flex flex-wrap items-center justify-between text-[11px] font-mono mb-2 text-slate-300 gap-2 px-1">
                <span className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-amber-500/40">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-amber-300 font-bold">F1 (30 kV)</span>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/40">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-300 font-bold">52-3 (30 kV)</span>
                </span>
                {coordinationMode === 'FULL_CHAIN' && (
                  <>
                    <span className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-purple-500/40">
                      <span className="h-2 w-2 rounded-full bg-purple-400" />
                      <span className="text-purple-300 font-bold">52-2 (225 kV)</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-sky-500/40">
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      <span className="text-sky-300 font-bold">52-1 (225 kV)</span>
                    </span>
                  </>
                )}
                <span className="flex items-center gap-1 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40 text-rose-300 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                  Ik = {faultCurrentKa.toFixed(1)} kA
                </span>
              </div>

              {/* SVG Coordinate Grid */}
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none font-mono">
                {/* Logarithmic Current Grid (X-axis) */}
                {[100, 200, 500, 1000, 2000, 5000, 10000, 20000, 40000].map((curr) => {
                  const x = getX(curr);
                  const isMajor = curr === 1000 || curr === 10000;
                  return (
                    <g key={`grid-x-${curr}`}>
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={height - padding.bottom}
                        stroke="#334155"
                        strokeWidth={isMajor ? 1.2 : 0.5}
                        strokeDasharray={isMajor ? 'none' : '2 3'}
                      />
                      {(curr === 100 || curr === 1000 || curr === 10000 || curr === 40000) && (
                        <text
                          x={x}
                          y={height - padding.bottom + 14}
                          fill="#94A3B8"
                          fontSize="8.5"
                          textAnchor="middle"
                        >
                          {curr >= 1000 ? `${curr / 1000}k` : curr}A
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Logarithmic Time Grid (Y-axis) */}
                {[0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10].map((time) => {
                  const y = getY(time);
                  const isMajor = time === 0.1 || time === 1 || time === 10;
                  return (
                    <g key={`grid-y-${time}`}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={width - padding.right}
                        y2={y}
                        stroke="#334155"
                        strokeWidth={isMajor ? 1.2 : 0.5}
                        strokeDasharray={isMajor ? 'none' : '2 3'}
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3}
                        fill="#94A3B8"
                        fontSize="8.5"
                        textAnchor="end"
                      >
                        {time >= 1 ? `${time}s` : `${time * 1000}ms`}
                      </text>
                    </g>
                  );
                })}

                {/* Axis Titles */}
                <text
                  x={width / 2}
                  y={height - 8}
                  fill="#94A3B8"
                  fontSize="8.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  COURANT DE DÉFAUT ÉQUIVALENT RAMENÉ À 30 kV (A)
                </text>
                <text
                  x={-height / 2}
                  y={15}
                  fill="#94A3B8"
                  fontSize="8.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  transform="rotate(-90)"
                >
                  TEMPS DE DÉCLENCHEMENT t (s)
                </text>

                {/* Feeder F1 Curve */}
                <path d={pathF1} fill="none" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />

                {/* Incomer 52-3 Curve */}
                <path d={path52_3} fill="none" stroke="#10B981" strokeWidth="2.8" strokeLinecap="round" />

                {/* Trafo 52-2 Curve */}
                {coordinationMode === 'FULL_CHAIN' && (
                  <path d={path52_2} fill="none" stroke="#A855F7" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="5 2" />
                )}

                {/* Line 52-1 Curve */}
                {coordinationMode === 'FULL_CHAIN' && (
                  <path d={path52_1} fill="none" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />
                )}

                {/* Fault Current Vertical Marker */}
                {actualFaultA <= maxI && actualFaultA >= minI && (
                  <g>
                    <line
                      x1={getX(actualFaultA)}
                      y1={padding.top}
                      x2={getX(actualFaultA)}
                      y2={height - padding.bottom}
                      stroke="#EF4444"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />

                    {/* F1 Operating Point */}
                    {tF1 <= maxT && tF1 >= minT && (
                      <g transform={`translate(${getX(actualFaultA)}, ${getY(tF1)})`}>
                        <circle cx="0" cy="0" r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x="7" y="3" fill="#FDE68A" fontSize="8" fontWeight="bold">
                          {(tF1 * 1000).toFixed(0)} ms (F1)
                        </text>
                      </g>
                    )}

                    {/* 52-3 Operating Point */}
                    {t52_3 <= maxT && t52_3 >= minT && (
                      <g transform={`translate(${getX(actualFaultA)}, ${getY(t52_3)})`}>
                        <circle cx="0" cy="0" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x="7" y="3" fill="#A7F3D0" fontSize="8" fontWeight="bold">
                          {(t52_3 * 1000).toFixed(0)} ms (52-3)
                        </text>
                      </g>
                    )}

                    {/* 52-2 Operating Point */}
                    {coordinationMode === 'FULL_CHAIN' && t52_2 <= maxT && t52_2 >= minT && (
                      <g transform={`translate(${getX(actualFaultA)}, ${getY(t52_2)})`}>
                        <circle cx="0" cy="0" r="4.5" fill="#A855F7" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x="7" y="3" fill="#E9D5FF" fontSize="8" fontWeight="bold">
                          {(t52_2 * 1000).toFixed(0)} ms (52-2)
                        </text>
                      </g>
                    )}

                    {/* 52-1 Operating Point */}
                    {coordinationMode === 'FULL_CHAIN' && t52_1 <= maxT && t52_1 >= minT && (
                      <g transform={`translate(${getX(actualFaultA)}, ${getY(t52_1)})`}>
                        <circle cx="0" cy="0" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x="7" y="3" fill="#BAE6FD" fontSize="8" fontWeight="bold">
                          {(t52_1 * 1000).toFixed(0)} ms (52-1)
                        </text>
                      </g>
                    )}
                  </g>
                )}
              </svg>
            </div>

            {/* Cascade Grading Evaluation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {/* Stage 1: F1 -> 52-3 */}
              <div className={`p-3 rounded-xl border font-mono text-xs ${
                gradingStage1.isSelective
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/60 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Étage 1 : F1 ➔ 52-3</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${gradingStage1.isSelective ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {gradingStage1.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Δt = <strong>{gradingStage1.deltaTMs.toFixed(0)} ms</strong> (Min: 250 ms)
                </div>
              </div>

              {/* Stage 2: 52-3 -> 52-2 */}
              <div className={`p-3 rounded-xl border font-mono text-xs ${
                gradingStage2.isSelective
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/60 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Étage 2 : 52-3 ➔ 52-2</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${gradingStage2.isSelective ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {gradingStage2.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Δt = <strong>{gradingStage2.deltaTMs.toFixed(0)} ms</strong> (Min: 250 ms)
                </div>
              </div>

              {/* Stage 3: 52-2 -> 52-1 */}
              <div className={`p-3 rounded-xl border font-mono text-xs ${
                gradingStage3.isSelective
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/60 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Étage 3 : 52-2 ➔ 52-1</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${gradingStage3.isSelective ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {gradingStage3.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Δt = <strong>{gradingStage3.deltaTMs.toFixed(0)} ms</strong> (Min: 250 ms)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Relay Protection Parameter Sliders & Thresholds (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* Fault Current Ik Slider */}
            <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-900">Courant de Court-Circuit Ik&apos;&apos; (30 kV)</span>
                <span className="font-black text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-xs">
                  {faultCurrentKa.toFixed(1)} kA
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={31.5}
                step={0.5}
                value={faultCurrentKa}
                onChange={(e) => setFaultCurrentKa(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-rose-700">
                <span>1.0 kA</span>
                <span>15.0 kA (Nominal Bus)</span>
                <span>31.5 kA (Icc Max)</span>
              </div>
            </div>

            {/* Level 1: Feeder F1 */}
            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  DÉPART HTA F1 (30 kV) · ANSI 51/50
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                  t = {(tF1 * 1000).toFixed(0)} ms
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-amber-800 block">Pickup Is (A)</label>
                  <input
                    type="number"
                    value={feederF1.pickupCurrentA}
                    onChange={(e) => setFeederF1({ ...feederF1, pickupCurrentA: Math.max(50, parseInt(e.target.value) || 50) })}
                    className="w-full px-2 py-1 bg-white border border-amber-300 rounded font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-amber-800 block">Multiplicateur TMS</label>
                  <input
                    type="number"
                    step={0.01}
                    min={0.02}
                    max={1.5}
                    value={feederF1.tms}
                    onChange={(e) => setFeederF1({ ...feederF1, tms: parseFloat(e.target.value) || 0.05 })}
                    className="w-full px-2 py-1 bg-white border border-amber-300 rounded font-bold text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-amber-800 block">Courbe de Déclenchement</label>
                <select
                  value={feederF1.curveType}
                  onChange={(e) => setFeederF1({ ...feederF1, curveType: e.target.value as IecCurveType })}
                  className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-xs"
                >
                  {Object.entries(CURVE_DEFINITIONS).map(([key, def]) => (
                    <option key={key} value={key}>{def.nameFr} ({def.norm})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Level 2: Incomer 52-3 */}
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  ARRIVÉE HTA 52-3 (30 kV) · ANSI 51
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                  t = {(t52_3 * 1000).toFixed(0)} ms
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-emerald-800 block">Pickup Is (A)</label>
                  <input
                    type="number"
                    value={incomerMv.pickupCurrentA}
                    onChange={(e) => setIncomerMv({ ...incomerMv, pickupCurrentA: Math.max(100, parseInt(e.target.value) || 100) })}
                    className="w-full px-2 py-1 bg-white border border-emerald-300 rounded font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-emerald-800 block">Multiplicateur TMS</label>
                  <input
                    type="number"
                    step={0.01}
                    min={0.05}
                    max={1.5}
                    value={incomerMv.tms}
                    onChange={(e) => setIncomerMv({ ...incomerMv, tms: parseFloat(e.target.value) || 0.1 })}
                    className="w-full px-2 py-1 bg-white border border-emerald-300 rounded font-bold text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-emerald-800 block">Courbe de Déclenchement</label>
                <select
                  value={incomerMv.curveType}
                  onChange={(e) => setIncomerMv({ ...incomerMv, curveType: e.target.value as IecCurveType })}
                  className="w-full px-2 py-1 bg-white border border-emerald-300 rounded text-xs"
                >
                  {Object.entries(CURVE_DEFINITIONS).map(([key, def]) => (
                    <option key={key} value={key}>{def.nameFr} ({def.norm})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Level 3: Trafo 52-2 (HTB 225 kV) */}
            {coordinationMode === 'FULL_CHAIN' && (
              <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-purple-100 pb-1">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    DISJONCTEUR HTB 52-2 TRANSFO (225 kV)
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded font-bold">
                    t = {(t52_2 * 1000).toFixed(0)} ms
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-purple-800 block">Pickup Is (A HTB)</label>
                    <input
                      type="number"
                      value={trafoHv.pickupCurrentA}
                      onChange={(e) => setTrafoHv({ ...trafoHv, pickupCurrentA: Math.max(50, parseInt(e.target.value) || 50) })}
                      className="w-full px-2 py-1 bg-white border border-purple-300 rounded font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-800 block">Multiplicateur TMS</label>
                    <input
                      type="number"
                      step={0.01}
                      min={0.05}
                      max={1.5}
                      value={trafoHv.tms}
                      onChange={(e) => setTrafoHv({ ...trafoHv, tms: parseFloat(e.target.value) || 0.1 })}
                      className="w-full px-2 py-1 bg-white border border-purple-300 rounded font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Level 4: Line 52-1 (HTB 225 kV) */}
            {coordinationMode === 'FULL_CHAIN' && (
              <div className="p-3 bg-sky-50/50 border border-sky-200 rounded-2xl space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-sky-100 pb-1">
                  <span className="font-bold text-sky-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    LIGNE 225 kV 52-1 (MANGOUMBÉ)
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded font-bold">
                    t = {(t52_1 * 1000).toFixed(0)} ms
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-sky-800 block">Pickup Is (A HTB)</label>
                    <input
                      type="number"
                      value={lineHv.pickupCurrentA}
                      onChange={(e) => setLineHv({ ...lineHv, pickupCurrentA: Math.max(100, parseInt(e.target.value) || 100) })}
                      className="w-full px-2 py-1 bg-white border border-sky-300 rounded font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-sky-800 block">Multiplicateur TMS</label>
                    <input
                      type="number"
                      step={0.01}
                      min={0.05}
                      max={1.5}
                      value={lineHv.tms}
                      onChange={(e) => setLineHv({ ...lineHv, tms: parseFloat(e.target.value) || 0.1 })}
                      className="w-full px-2 py-1 bg-white border border-sky-300 rounded font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>CEI 60255-151 / IEEE 242 · Temps d’ouverture disjoncteur SF6: 50 ms · Marge requise: Δt ≥ 250 ms</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold transition-colors shadow-xs cursor-pointer"
          >
            {locale === 'fr' ? 'Fermer l\'Analyse TCC' : 'Close TCC Coordination'}
          </button>
        </div>
      </div>
    </div>
  );
};
