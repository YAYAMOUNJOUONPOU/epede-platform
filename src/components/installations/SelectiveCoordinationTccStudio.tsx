// src/components/installations/SelectiveCoordinationTccStudio.tsx
// EPEDE D06 - Time-Current Curves (TCC) & Selective Coordination Studio (IEC 60947-2 / NF C 15-100 §535)
// Provides an interactive logarithmic I-t coordination canvas with ACB, MCCB, and MCB trip curves.

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Sliders,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  ArrowRight,
  Maximize2,
  Cpu
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

interface SelectiveCoordinationTccStudioProps {
  locale: 'fr' | 'en';
}

export const SelectiveCoordinationTccStudio: React.FC<SelectiveCoordinationTccStudioProps> = ({
  locale
}) => {
  // 1. ACB Incomer (Upstream - Master TGBT)
  const [acbIn, setAcbIn] = useState<number>(2000); // In (A)
  const [acbIr, setAcbIr] = useState<number>(0.9); // Long time pick-up Ir = 0.9 * In = 1800A
  const [acbTr, setAcbTr] = useState<number>(12); // Long time delay tr (s) at 6*Ir
  const [acbIsd, setAcbIsd] = useState<number>(6); // Short time pick-up Isd = 6 * Ir = 10800A
  const [acbTsd, setAcbTsd] = useState<number>(0.3); // Short time delay tsd (s)
  const [acbIi, setAcbIi] = useState<number>(12); // Instantaneous Ii = 12 * In = 24000A
  const [isZsiEnabled, setIsZsiEnabled] = useState<boolean>(false);

  // 2. MCCB Feeder (Intermediate - Sub-distribution)
  const [mccbIn, setMccbIn] = useState<number>(400); // In (A)
  const [mccbIr, setMccbIr] = useState<number>(0.85); // Ir = 340A
  const [mccbIm, setMccbIm] = useState<number>(7); // Magnetic trip Im = 7 * Ir = 2380A

  // 3. MCB Branch (Downstream - Final Modular Circuit)
  const [mcbIn, setMcbIn] = useState<number>(32); // In (A)
  const [mcbCurve, setMcbCurve] = useState<'B' | 'C' | 'D'>('C');

  // 4. Fault Current Simulation Slider
  const [simulatedFaultCurrent, setSimulatedFaultCurrent] = useState<number>(1800); // A

  // Calculated values
  const acbIrVal = acbIn * acbIr;
  const acbIsdVal = acbIrVal * acbIsd;
  const acbIiVal = acbIn * acbIi;

  const mccbIrVal = mccbIn * mccbIr;
  const mccbImVal = mccbIrVal * mccbIm;

  const mcbMagRange = useMemo(() => {
    switch (mcbCurve) {
      case 'B': return { min: 3 * mcbIn, max: 5 * mcbIn };
      case 'C': return { min: 5 * mcbIn, max: 10 * mcbIn };
      case 'D': return { min: 10 * mcbIn, max: 14 * mcbIn };
    }
  }, [mcbCurve, mcbIn]);

  // Trip time calculation for a given current I (A)
  const getAcbTripTime = (I: number): number => {
    if (I < acbIrVal * 1.05) return 1000; // No trip
    if (I >= acbIiVal) return isZsiEnabled ? 0.03 : 0.05; // Instantaneous
    if (I >= acbIsdVal) return isZsiEnabled ? 0.05 : acbTsd; // Short-time
    // Long-time inverse time equation: t = tr * (6 * Ir / I)^2
    const ratio = (6 * acbIrVal) / I;
    const t = acbTr * Math.pow(ratio, 2);
    return Math.max(acbTsd, Math.min(1000, t));
  };

  const getMccbTripTime = (I: number): number => {
    if (I < mccbIrVal * 1.05) return 1000; // No trip
    if (I >= mccbImVal) return 0.02; // Instantaneous magnetic trip
    // Thermal curve approximation
    const ratio = (6 * mccbIrVal) / I;
    const t = 8 * Math.pow(ratio, 2);
    return Math.max(0.02, Math.min(1000, t));
  };

  const getMcbTripTime = (I: number): number => {
    if (I < mcbIn * 1.13) return 1000;
    if (I >= mcbMagRange.max) return 0.01; // Ultra-fast magnetic trip (< 10ms)
    if (I >= mcbMagRange.min) return 0.02;
    // Thermal bimetal equation
    const ratio = (2.55 * mcbIn) / I;
    const t = 10 * Math.pow(ratio, 2);
    return Math.max(0.01, Math.min(1000, t));
  };

  // Fault evaluation
  const mcbTime = getMcbTripTime(simulatedFaultCurrent);
  const mccbTime = getMccbTripTime(simulatedFaultCurrent);
  const acbTime = getAcbTripTime(simulatedFaultCurrent);

  // Coordination check: MCB must clear before MCCB, and MCCB must clear before ACB
  const isCoordinationTotal = useMemo(() => {
    if (mcbTime < mccbTime && (mccbTime < acbTime || mccbTime === 1000)) {
      return true;
    }
    return false;
  }, [mcbTime, mccbTime, acbTime]);

  // SVG Logarithmic Coordinate Mapping
  // Log range X: 10 A to 100,000 A (10^1 to 10^5 -> 4 decades)
  // Log range Y: 0.01 s to 1000 s (10^-2 to 10^3 -> 5 decades)
  const svgWidth = 600;
  const svgHeight = 360;
  const padLeft = 55;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 40;

  const innerW = svgWidth - padLeft - padRight;
  const innerH = svgHeight - padTop - padBottom;

  const logMinI = 1; // 10^1 = 10 A
  const logMaxI = 5; // 10^5 = 100,000 A
  const logMinT = -2; // 10^-2 = 0.01 s
  const logMaxT = 3; // 10^3 = 1000 s

  const mapItoX = (I: number) => {
    const clampedI = Math.max(10, Math.min(100000, I));
    const logI = Math.log10(clampedI);
    return padLeft + ((logI - logMinI) / (logMaxI - logMinI)) * innerW;
  };

  const mapTtoY = (t: number) => {
    const clampedT = Math.max(0.01, Math.min(1000, t));
    const logT = Math.log10(clampedT);
    // Invert Y so that 1000s is at top, 0.01s is at bottom
    return padTop + ((logMaxT - logT) / (logMaxT - logMinT)) * innerH;
  };

  // Generate curve path points
  const generatePath = (calcTimeFn: (i: number) => number) => {
    const points: string[] = [];
    const steps = 60;
    for (let s = 0; s <= steps; s++) {
      const logI = logMinI + (s / steps) * (logMaxI - logMinI);
      const current = Math.pow(10, logI);
      const time = calcTimeFn(current);
      if (time < 990) {
        const x = mapItoX(current);
        const y = mapTtoY(time);
        points.push(`${s === 0 || points.length === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
    }
    return points.join(' ');
  };

  const acbPath = useMemo(() => generatePath(getAcbTripTime), [acbIn, acbIr, acbTr, acbIsd, acbTsd, acbIi, isZsiEnabled]);
  const mccbPath = useMemo(() => generatePath(getMccbTripTime), [mccbIn, mccbIr, mccbIm]);
  const mcbPath = useMemo(() => generatePath(getMcbTripTime), [mcbIn, mcbCurve]);

  return (
    <div className="p-5 rounded-2xl bg-[#080C14] border border-[#1E2738] space-y-5 font-mono text-xs">
      {/* 1. Header & Trust Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold text-[10px] border border-sky-500/30">
              IEC 60947-2 · NF C 15-100 §535 · IEEE 242
            </span>
            <EvidenceTrustBadge
              type="VERIFIED_STANDARD"
              governingStandard="IEC 60947-2 Appx A / NF C 15-100 §535"
              locale={locale}
            />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1">
            {locale === 'fr'
              ? 'Studio de Sélectivité & Courbes Temps-Courant (TCC Logarithmique)'
              : 'Selective Coordination & Time-Current Curves (TCC Studio)'}
          </h2>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            {locale === 'fr'
              ? 'Superposition des courbes de déclenchement ACB (Amont), MCCB (Intermédiaire) et MCB (Aval) pour garantir la continuité de service.'
              : 'Superposition of ACB (Upstream), MCCB (Intermediate), and MCB (Downstream) trip curves to ensure total selectivity.'}
          </p>
        </div>

        {/* ZSI Toggle Button */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playSwitchClick();
            setIsZsiEnabled(!isZsiEnabled);
          }}
          className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isZsiEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              : 'bg-[#0E1522] text-slate-400 border-[#1E2638] hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isZsiEnabled ? (locale === 'fr' ? 'ZSI Activé (Verrouillage Logique)' : 'ZSI Active (Zone Interlocking)') : (locale === 'fr' ? 'Activer ZSI' : 'Enable ZSI')}</span>
        </button>
      </div>

      {/* 2. Main Studio Grid: Curves Canvas & Breakers Control Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Logarithmic TCC Canvas (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-[#05080E] border border-[#182030] space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              {locale === 'fr' ? 'Plan Logarithmique I - t' : 'Logarithmic I - t Graph'}
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-purple-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                ACB ({acbIn}A)
              </span>
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                MCCB ({mccbIn}A)
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                MCB ({mcbIn}A {mcbCurve})
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full overflow-hidden bg-[#03060A] rounded-lg border border-[#141C28]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none"
            >
              {/* Grid Decades & Axes */}
              {/* X-axis decades: 10, 100, 1k, 10k, 100k */}
              {[10, 100, 1000, 10000, 100000].map((current) => {
                const x = mapItoX(current);
                return (
                  <g key={current}>
                    <line
                      x1={x}
                      y1={padTop}
                      x2={x}
                      y2={svgHeight - padBottom}
                      stroke="#1B2636"
                      strokeWidth={current === 1000 ? '1.5' : '0.8'}
                      strokeDasharray={current === 1000 ? undefined : '2,2'}
                    />
                    <text
                      x={x}
                      y={svgHeight - padBottom + 14}
                      fill="#64748B"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {current >= 1000 ? `${current / 1000}kA` : `${current}A`}
                    </text>
                  </g>
                );
              })}

              {/* Y-axis decades: 0.01, 0.1, 1, 10, 100, 1000 s */}
              {[0.01, 0.1, 1, 10, 100, 1000].map((time) => {
                const y = mapTtoY(time);
                return (
                  <g key={time}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={svgWidth - padRight}
                      y2={y}
                      stroke="#1B2636"
                      strokeWidth={time === 1 ? '1.5' : '0.8'}
                      strokeDasharray={time === 1 ? undefined : '2,2'}
                    />
                    <text
                      x={padLeft - 6}
                      y={y + 3}
                      fill="#64748B"
                      fontSize="9"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {time < 1 ? `${time * 1000}ms` : `${time}s`}
                    </text>
                  </g>
                );
              })}

              {/* TCC Curves */}
              {/* ACB Curve */}
              {acbPath && (
                <path
                  d={acbPath}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-all duration-150"
                />
              )}

              {/* MCCB Curve */}
              {mccbPath && (
                <path
                  d={mccbPath}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-all duration-150"
                />
              )}

              {/* MCB Curve */}
              {mcbPath && (
                <path
                  d={mcbPath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-all duration-150"
                />
              )}

              {/* Simulated Fault Current Cursor Line */}
              <g>
                <line
                  x1={mapItoX(simulatedFaultCurrent)}
                  y1={padTop}
                  x2={mapItoX(simulatedFaultCurrent)}
                  y2={svgHeight - padBottom}
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="4,3"
                />
                <circle
                  cx={mapItoX(simulatedFaultCurrent)}
                  cy={mapTtoY(mcbTime < 990 ? mcbTime : (mccbTime < 990 ? mccbTime : acbTime))}
                  r="5"
                  fill="#EF4444"
                />
                <text
                  x={mapItoX(simulatedFaultCurrent)}
                  y={padTop - 6}
                  fill="#F87171"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  If = {simulatedFaultCurrent}A
                </text>
              </g>

              {/* Axis Labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 8}
                fill="#94A3B8"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {locale === 'fr' ? 'Courant Présumé I (Ampères - Échelle Log)' : 'Fault Current I (Amperes - Log Scale)'}
              </text>
              <text
                x={12}
                y={svgHeight / 2}
                fill="#94A3B8"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(-90 12 ${svgHeight / 2})`}
              >
                {locale === 'fr' ? 'Temps t (Secondes)' : 'Time t (Seconds)'}
              </text>
            </svg>
          </div>

          {/* Fault Simulation Bar */}
          <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E2738] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                {locale === 'fr' ? 'Injecter un Courant de Court-Circuit (If) :' : 'Simulate Fault Current (If):'}
              </span>
              <span className="font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                {simulatedFaultCurrent} A ({ (simulatedFaultCurrent / 1000).toFixed(2) } kA)
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="50000"
              step="50"
              value={simulatedFaultCurrent}
              onChange={(e) => setSimulatedFaultCurrent(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />

            {/* Tripping Chronology Result */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
              <div className={`p-2 rounded border ${mcbTime < mccbTime && mcbTime < acbTime ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-[#0A0E17] border-[#1C2538] text-slate-400'}`}>
                <span className="block font-bold">1. MCB Aval :</span>
                <strong>{mcbTime >= 1000 ? 'Pas de déclenchement' : `${(mcbTime * 1000).toFixed(0)} ms`}</strong>
              </div>
              <div className={`p-2 rounded border ${mccbTime < acbTime && mccbTime <= mcbTime ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-[#0A0E17] border-[#1C2538] text-slate-400'}`}>
                <span className="block font-bold">2. MCCB Intermédiaire :</span>
                <strong>{mccbTime >= 1000 ? 'Pas de déclenchement' : `${(mccbTime * 1000).toFixed(0)} ms`}</strong>
              </div>
              <div className={`p-2 rounded border ${acbTime <= mccbTime && acbTime <= mcbTime ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-[#0A0E17] border-[#1C2538] text-slate-400'}`}>
                <span className="block font-bold">3. ACB TGBT Amont :</span>
                <strong>{acbTime >= 1000 ? 'Pas de déclenchement' : `${(acbTime * 1000).toFixed(0)} ms`}</strong>
              </div>
            </div>

            {/* Selectivity Verdict Badge */}
            <div className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
              isCoordinationTotal 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {isCoordinationTotal ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span>
                  {isCoordinationTotal
                    ? (locale === 'fr' ? 'Sélectivité Totale Validée (Seul le disjoncteur terminal MCB s\'ouvre)' : 'Total Selectivity Validated (Only downstream MCB trips)')
                    : (locale === 'fr' ? 'Risque de Déclenchement Simultané / Perte de Sélectivité' : 'Risk of Cascading Trip / Selective Coordination Hazard')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Breaker Setting Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* 1. ACB Settings Card */}
          <div className="p-3.5 rounded-xl bg-[#0E1522] border border-purple-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                AMONT · DISJONCTEUR ACB TGBT
              </span>
              <span className="text-purple-400 font-bold">{acbIn} A</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="text-slate-400 block">Seuil Thermique Ir ({acbIr} × In) :</label>
                <input
                  type="range"
                  min="0.4"
                  max="1.0"
                  step="0.05"
                  value={acbIr}
                  onChange={(e) => setAcbIr(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <span className="text-white font-bold">{acbIrVal.toFixed(0)} A</span>
              </div>
              <div>
                <label className="text-slate-400 block">Retard Long Time tr :</label>
                <select
                  value={acbTr}
                  onChange={(e) => setAcbTr(Number(e.target.value))}
                  className="w-full p-1 rounded bg-[#090D15] border border-[#1E2738] text-white text-[10px]"
                >
                  <option value={4}>4 s</option>
                  <option value={8}>8 s</option>
                  <option value={12}>12 s</option>
                  <option value={16}>16 s</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block">Court-Retard Isd ({acbIsd} × Ir) :</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={acbIsd}
                  onChange={(e) => setAcbIsd(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <span className="text-white font-bold">{acbIsdVal.toFixed(0)} A</span>
              </div>
              <div>
                <label className="text-slate-400 block">Retard tsd :</label>
                <select
                  value={acbTsd}
                  onChange={(e) => setAcbTsd(Number(e.target.value))}
                  className="w-full p-1 rounded bg-[#090D15] border border-[#1E2738] text-white text-[10px]"
                >
                  <option value={0.1}>100 ms</option>
                  <option value={0.2}>200 ms</option>
                  <option value={0.3}>300 ms</option>
                  <option value={0.4}>400 ms</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. MCCB Settings Card */}
          <div className="p-3.5 rounded-xl bg-[#0E1522] border border-cyan-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                INTERMÉDIAIRE · DÉPART MCCB
              </span>
              <span className="text-cyan-400 font-bold">{mccbIn} A</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="text-slate-400 block">Réglage Ir ({mccbIr} × In) :</label>
                <input
                  type="range"
                  min="0.7"
                  max="1.0"
                  step="0.05"
                  value={mccbIr}
                  onChange={(e) => setMccbIr(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <span className="text-white font-bold">{mccbIrVal.toFixed(0)} A</span>
              </div>
              <div>
                <label className="text-slate-400 block">Seuil Magnétique Im ({mccbIm} × Ir) :</label>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="1"
                  value={mccbIm}
                  onChange={(e) => setMccbIm(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <span className="text-white font-bold">{mccbImVal.toFixed(0)} A</span>
              </div>
            </div>
          </div>

          {/* 3. MCB Settings Card */}
          <div className="p-3.5 rounded-xl bg-[#0E1522] border border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                AVAL · DISJONCTEUR MODULAIRE MCB
              </span>
              <div className="flex items-center gap-1">
                {(['B', 'C', 'D'] as const).map((crv) => (
                  <button
                    key={crv}
                    type="button"
                    onClick={() => {
                      soundEffects.playSwitchClick();
                      setMcbCurve(crv);
                    }}
                    className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                      mcbCurve === crv ? 'bg-amber-500 text-slate-950' : 'bg-[#090D15] text-slate-400 border border-[#1E2738]'
                    }`}
                  >
                    Courbe {crv}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="text-slate-400 block">Calibre In :</label>
                <select
                  value={mcbIn}
                  onChange={(e) => setMcbIn(Number(e.target.value))}
                  className="w-full p-1 rounded bg-[#090D15] border border-[#1E2738] text-white text-[10px]"
                >
                  <option value={10}>10 A</option>
                  <option value={16}>16 A</option>
                  <option value={20}>20 A</option>
                  <option value={32}>32 A</option>
                  <option value={63}>63 A</option>
                </select>
              </div>
              <div>
                <span className="text-slate-400 block">Plage Magnétique :</span>
                <span className="text-amber-300 font-bold">
                  {mcbMagRange.min} A – {mcbMagRange.max} A
                </span>
              </div>
            </div>
          </div>

          {/* Electrotechnical Principle Box */}
          <div className="p-3 rounded-lg bg-[#0B0F19] border border-[#1E2638] text-[10px] space-y-1 text-slate-300 font-sans">
            <span className="font-bold text-sky-400 block">Règle de Sélectivité Ampèremétrique :</span>
            <p>
              Pour assurer une sélectivité totale entre deux disjoncteurs en série, le seuil magnétique de l'amont (Isd) doit être strictement supérieur au courant de court-circuit maximal présumé vu par l'aval, avec un rapport de calibre recommandé d'au moins 1.6× à 2×.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
