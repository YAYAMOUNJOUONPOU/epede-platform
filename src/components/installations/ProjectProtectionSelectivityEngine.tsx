// src/components/installations/ProjectProtectionSelectivityEngine.tsx
// EPEDE Low-Voltage Protection Selectivity & Coordination Engine (Domain D06)
// Interactive Log-Log TCC Discrimination Canvas, Amperometric/Chronometric Selectivity & Cable Adiabatic Withstand

import React, { useState, useMemo } from 'react';
import { InstallationProject } from './data/installationProjectModel';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Zap, 
  Layers, 
  Info,
  Maximize2,
  Minimize2,
  FileText
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectProtectionSelectivityEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // Upstream device state (MCCB/ACB Electronic Trip Unit LSI)
  const [upstreamRatingIn, setUpstreamRatingIn] = useState<number>(250);
  const [upstreamIrSetting, setUpstreamIrSetting] = useState<number>(1.0); // 0.4 - 1.0 * In
  const [upstreamTrSetting, setUpstreamTrSetting] = useState<number>(4.0); // 0.5 - 16s at 6*Ir
  const [upstreamIsdSetting, setUpstreamIsdSetting] = useState<number>(4.0); // 1.5 - 10 * Ir
  const [upstreamTsdSetting, setUpstreamTsdSetting] = useState<number>(0.2); // 0.05 - 0.4s
  const [upstreamIiSetting, setUpstreamIiSetting] = useState<number>(10.0); // Instantaneous * In

  // Downstream device state (MCB Curve B/C/D)
  const [downstreamRatingIn, setDownstreamRatingIn] = useState<number>(32);
  const [downstreamCurve, setDownstreamCurve] = useState<'B' | 'C' | 'D'>('C');
  const [cableSectionMm2, setCableSectionMm2] = useState<number>(6); // mm²
  const [cableInsulation, setCableInsulation] = useState<'PVC' | 'XLPE'>('PVC');

  // Fault Current Level at this point
  const xfmrKva = project.supplyContext.transformerRatingKva || 800;
  const xfmrUk = (project.supplyContext.transformerUkPercent || 5.0) / 100;
  const prospectiveFaultKa = Math.round(((xfmrKva / (Math.sqrt(3) * 0.4 * xfmrUk)) / 1000) * 10) / 10; // e.g. 23.1 kA

  // Compute calculated values
  const upstreamIrA = upstreamRatingIn * upstreamIrSetting;
  const upstreamIsdA = upstreamIrA * upstreamIsdSetting;
  const upstreamIiA = upstreamRatingIn * upstreamIiSetting;

  // Downstream magnetic threshold
  const downstreamMagMinA = downstreamRatingIn * (downstreamCurve === 'B' ? 3 : downstreamCurve === 'C' ? 5 : 10);
  const downstreamMagMaxA = downstreamRatingIn * (downstreamCurve === 'B' ? 5 : downstreamCurve === 'C' ? 10 : 14);

  // Selectivity Limit Analysis
  // Current selectivity limit Is is determined by the upstream short-time pickup Isd
  const selectivityLimitAmps = upstreamIsdA;
  const isSelectivityTotal = selectivityLimitAmps >= prospectiveFaultKa * 1000;
  const timeMarginMs = Math.round((upstreamTsdSetting - 0.04) * 1000); // downstream breaker trips in ~20-40ms
  const isChronometricSelectivityValid = timeMarginMs >= 100;

  // Cable adiabatic constant k
  const kFactor = cableInsulation === 'PVC' ? 115 : 143;
  const maxI2tCable = Math.pow(kFactor * cableSectionMm2, 2);

  // SVG coordinate transformation for log-log plot
  // X-axis: Current from 10 A (log10 = 1) to 100,000 A (log10 = 5)
  // Y-axis: Time from 0.01 s (log10 = -2) to 1,000 s (log10 = 3)
  const plotWidth = 720;
  const plotHeight = 360;
  const padding = { left: 65, right: 30, top: 25, bottom: 40 };

  const getX = (amps: number) => {
    const logVal = Math.log10(Math.max(10, Math.min(100000, amps)));
    const minLog = 1; // 10 A
    const maxLog = 5; // 100,000 A
    const ratio = (logVal - minLog) / (maxLog - minLog);
    return padding.left + ratio * (plotWidth - padding.left - padding.right);
  };

  const getY = (sec: number) => {
    const logVal = Math.log10(Math.max(0.01, Math.min(1000, sec)));
    const minLog = -2; // 0.01 s
    const maxLog = 3; // 1,000 s
    const ratio = (logVal - minLog) / (maxLog - minLog);
    return plotHeight - padding.bottom - ratio * (plotHeight - padding.top - padding.bottom);
  };

  // Generate SVG path points for Upstream Electronic Trip Unit (LSI)
  const upstreamPath = useMemo(() => {
    const points: string[] = [];
    // Thermal part: t = (6 * Ir / I)^2 * tr
    const currentSteps = [
      upstreamIrA * 1.05,
      upstreamIrA * 1.5,
      upstreamIrA * 2.0,
      upstreamIrA * 3.0,
      upstreamIrA * 4.0,
      upstreamIsdA
    ];

    currentSteps.forEach((iVal) => {
      const tVal = Math.max(upstreamTsdSetting, Math.pow((6 * upstreamIrA) / iVal, 2) * (upstreamTrSetting / 36));
      points.push(`${getX(iVal)},${getY(tVal)}`);
    });

    // Short-time plateau at tsd
    points.push(`${getX(upstreamIsdA)},${getY(upstreamTsdSetting)}`);
    points.push(`${getX(upstreamIiA)},${getY(upstreamTsdSetting)}`);

    // Instantaneous drop to 0.02s
    points.push(`${getX(upstreamIiA)},${getY(0.02)}`);
    points.push(`${getX(100000)},${getY(0.02)}`);

    return points.join(' ');
  }, [upstreamIrA, upstreamIsdA, upstreamIiA, upstreamTrSetting, upstreamTsdSetting]);

  // Generate SVG path points for Downstream MCB (Curve B/C/D)
  const downstreamPath = useMemo(() => {
    const points: string[] = [];
    // Thermal bimetal: t = (2.55 * In / I)^2 * 60
    const currentSteps = [
      downstreamRatingIn * 1.13,
      downstreamRatingIn * 1.45,
      downstreamRatingIn * 2.0,
      downstreamRatingIn * 3.0,
      downstreamMagMaxA
    ];

    currentSteps.forEach((iVal) => {
      const tVal = Math.max(0.02, Math.pow((1.45 * downstreamRatingIn) / iVal, 2) * 120);
      points.push(`${getX(iVal)},${getY(tVal)}`);
    });

    // Magnetic trip instant drop (0.015s)
    points.push(`${getX(downstreamMagMaxA)},${getY(0.02)}`);
    points.push(`${getX(100000)},${getY(0.02)}`);

    return points.join(' ');
  }, [downstreamRatingIn, downstreamMagMaxA]);

  // Generate Cable Thermal Withstand Curve: t = (k * S / I)^2
  const cablePath = useMemo(() => {
    const points: string[] = [];
    const currents = [500, 1000, 2000, 5000, 10000, 25000, 50000];
    currents.forEach((iVal) => {
      const tVal = Math.pow((kFactor * cableSectionMm2) / iVal, 2);
      if (tVal >= 0.01 && tVal <= 1000) {
        points.push(`${getX(iVal)},${getY(tVal)}`);
      }
    });
    return points.join(' ');
  }, [kFactor, cableSectionMm2]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header with Standards & Selectivity Status Badge                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
              IEC 60947-2 / NF C 15-100 §535
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
              {isFr ? 'COORDINATION & SÉLECTIVITÉ TCC' : 'TCC SELECTIVITY DISCRIMINATION'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            {isFr ? 'Superposition des Courbes de Déclenchement & Sélectivité' : 'Trip Curves Overlay & Selectivity Discrimination'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFr 
              ? 'Analyse graphique de la sélectivité ampérométrique, chronométrique et de la contrainte thermique admissible du câble (k²S²).'
              : 'Log-log graphical discrimination analysis: amperometric, chronometric margins, and cable adiabatic thermal withstand (k²S²).'}
          </p>
        </div>

        {/* Global Selectivity Verdict */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono uppercase">{isFr ? 'Limite de Sélectivité (Is)' : 'Selectivity Limit (Is)'}</div>
            <div className="text-xl font-black text-amber-400 font-mono">
              {selectivityLimitAmps >= 1000 ? `${(selectivityLimitAmps / 1000).toFixed(1)} kA` : `${selectivityLimitAmps} A`}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono inline-flex items-center gap-1 ${
              isSelectivityTotal 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {isSelectivityTotal ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {isSelectivityTotal 
                ? (isFr ? 'SÉLECTIVITÉ TOTALE' : 'TOTAL SELECTIVITY')
                : (isFr ? 'SÉLECTIVITÉ PARTIELLE' : 'PARTIAL SELECTIVITY')}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Interactive SVG Log-Log TCC Canvas                               */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">
            {isFr ? 'Plan Temps-Courant Log-Log (t = f(I))' : 'Log-Log Time-Current Plane (t = f(I))'}
          </span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-1 bg-cyan-400 rounded inline-block" />
              {isFr ? 'Disjoncteur Amont (TGBT LSI)' : 'Upstream ACB/MCCB'}
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-1 bg-amber-400 rounded inline-block" />
              {isFr ? 'Disjoncteur Aval (Tableau MCB)' : 'Downstream MCB'}
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-1 bg-rose-400 border-b border-dashed border-rose-400 rounded inline-block" />
              {isFr ? 'Limite Thermique Câble (k²S²)' : 'Cable Thermal Withstand (k²S²)'}
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto flex justify-center">
          <svg 
            width={plotWidth} 
            height={plotHeight} 
            className="bg-slate-900 border border-slate-800 rounded-lg shadow-md select-none"
          >
            {/* Grid Lines (Current Decades: 10, 100, 1k, 10k, 100k) */}
            {[10, 100, 1000, 10000, 100000].map((amp) => {
              const xPos = getX(amp);
              return (
                <g key={`x-grid-${amp}`}>
                  <line 
                    x1={xPos} 
                    y1={padding.top} 
                    x2={xPos} 
                    y2={plotHeight - padding.bottom} 
                    stroke="#1E293B" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={xPos} 
                    y={plotHeight - padding.bottom + 15} 
                    textAnchor="middle" 
                    className="text-[10px] fill-slate-500 font-mono"
                  >
                    {amp >= 1000 ? `${amp / 1000}k` : amp}A
                  </text>
                </g>
              );
            })}

            {/* Grid Lines (Time Decades: 0.01, 0.1, 1, 10, 100, 1000s) */}
            {[0.01, 0.1, 1, 10, 100, 1000].map((sec) => {
              const yPos = getY(sec);
              return (
                <g key={`y-grid-${sec}`}>
                  <line 
                    x1={padding.left} 
                    y1={yPos} 
                    x2={plotWidth - padding.right} 
                    y2={yPos} 
                    stroke="#1E293B" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={padding.left - 8} 
                    y={yPos + 3} 
                    textAnchor="end" 
                    className="text-[10px] fill-slate-500 font-mono"
                  >
                    {sec >= 1 ? `${sec}s` : `${sec * 1000}ms`}
                  </text>
                </g>
              );
            })}

            {/* Prospective Fault Current Marker (Icc max) */}
            <line 
              x1={getX(prospectiveFaultKa * 1000)} 
              y1={padding.top} 
              x2={getX(prospectiveFaultKa * 1000)} 
              y2={plotHeight - padding.bottom} 
              stroke="#F43F5E" 
              strokeWidth="1.5" 
              strokeDasharray="4 3" 
            />
            <text 
              x={getX(prospectiveFaultKa * 1000) - 5} 
              y={padding.top + 15} 
              textAnchor="end" 
              className="text-[10px] fill-rose-400 font-mono font-bold"
            >
              Icc max = {prospectiveFaultKa} kA
            </text>

            {/* Cable Adiabatic Curve */}
            {cablePath && (
              <polyline 
                points={cablePath} 
                fill="none" 
                stroke="#F43F5E" 
                strokeWidth="2" 
                strokeDasharray="5 3" 
                opacity="0.8" 
              />
            )}

            {/* Downstream Curve (MCB) */}
            {downstreamPath && (
              <polyline 
                points={downstreamPath} 
                fill="none" 
                stroke="#F59E0B" 
                strokeWidth="2.5" 
              />
            )}

            {/* Upstream Curve (ACB/MCCB) */}
            {upstreamPath && (
              <polyline 
                points={upstreamPath} 
                fill="none" 
                stroke="#06B6D4" 
                strokeWidth="2.5" 
              />
            )}

            {/* Selectivity Margin Zone Marker */}
            <rect 
              x={getX(downstreamMagMaxA)} 
              y={getY(upstreamTsdSetting)} 
              width={Math.max(0, getX(upstreamIsdA) - getX(downstreamMagMaxA))} 
              height={Math.abs(getY(0.04) - getY(upstreamTsdSetting))} 
              fill="#10B981" 
              fillOpacity="0.15" 
              stroke="#10B981" 
              strokeWidth="1" 
              strokeDasharray="2 2" 
            />
            <text 
              x={(getX(downstreamMagMaxA) + getX(upstreamIsdA)) / 2} 
              y={(getY(upstreamTsdSetting) + getY(0.04)) / 2} 
              textAnchor="middle" 
              className="text-[9px] fill-emerald-400 font-mono font-bold"
            >
              Δt = {timeMarginMs}ms
            </text>
          </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Parameter Sliders for Interactive Discrimination Adjustment     */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upstream Breaker Settings Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 font-mono uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              {isFr ? 'Appareil Amont : Disjoncteur TGBT (Électronique LSI)' : 'Upstream Device: TGBT Breaker (Electronic LSI)'}
            </span>
            <span className="text-xs font-mono font-bold text-white">{upstreamRatingIn} A</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* In Rating */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{isFr ? 'Calibre Assigné (In) :' : 'Nominal Rating (In):'}</span>
              <select
                value={upstreamRatingIn}
                onChange={(e) => setUpstreamRatingIn(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-cyan-300 font-mono rounded px-2 py-0.5 text-xs"
              >
                <option value={160}>160 A</option>
                <option value={250}>250 A</option>
                <option value={400}>400 A</option>
                <option value={630}>630 A</option>
                <option value={800}>800 A</option>
                <option value={1250}>1250 A</option>
              </select>
            </div>

            {/* Ir Long-Time Setting */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{isFr ? 'Seuil Thermique Long Retard (Ir = x · In) :' : 'Long-Time Threshold (Ir = x · In):'}</span>
                <span className="font-mono text-cyan-400 font-bold">{upstreamIrSetting} (Ir = {upstreamIrA} A)</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={upstreamIrSetting}
                onChange={(e) => setUpstreamIrSetting(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Isd Short-Time Setting */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{isFr ? 'Seuil Court Retard (Isd = x · Ir) :' : 'Short-Time Threshold (Isd = x · Ir):'}</span>
                <span className="font-mono text-cyan-400 font-bold">{upstreamIsdSetting} (Isd = {upstreamIsdA} A)</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="10.0"
                step="0.5"
                value={upstreamIsdSetting}
                onChange={(e) => setUpstreamIsdSetting(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* tsd Delay Setting */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{isFr ? 'Temporisation Court Retard (tsd) :' : 'Short-Time Delay (tsd):'}</span>
                <span className="font-mono text-cyan-400 font-bold">{upstreamTsdSetting} s ({upstreamTsdSetting * 1000} ms)</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.05"
                value={upstreamTsdSetting}
                onChange={(e) => setUpstreamTsdSetting(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Downstream Breaker & Cable Settings Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              {isFr ? 'Appareil Aval & Câble : Disjoncteur Modulaire (MCB)' : 'Downstream Device & Cable: Branch MCB'}
            </span>
            <span className="text-xs font-mono font-bold text-white">Courbe {downstreamCurve} {downstreamRatingIn}A</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* In Rating */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{isFr ? 'Calibre Disjoncteur Aval (In) :' : 'Downstream Rating (In):'}</span>
              <select
                value={downstreamRatingIn}
                onChange={(e) => setDownstreamRatingIn(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-amber-300 font-mono rounded px-2 py-0.5 text-xs"
              >
                <option value={10}>10 A</option>
                <option value={16}>16 A</option>
                <option value={20}>20 A</option>
                <option value={25}>25 A</option>
                <option value={32}>32 A</option>
                <option value={40}>40 A</option>
                <option value={50}>50 A</option>
                <option value={63}>63 A</option>
              </select>
            </div>

            {/* Curve */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{isFr ? 'Courbe de Déclenchement :' : 'Trip Curve:'}</span>
              <div className="flex gap-2">
                {(['B', 'C', 'D'] as const).map((crv) => (
                  <button
                    key={crv}
                    onClick={() => setDownstreamCurve(crv)}
                    className={`px-3 py-1 rounded font-mono font-bold text-xs transition ${
                      downstreamCurve === crv
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-950 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Courbe {crv}
                  </button>
                ))}
              </div>
            </div>

            {/* Cable Section */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{isFr ? 'Section Câble Aval :' : 'Downstream Cable Section:'}</span>
              <select
                value={cableSectionMm2}
                onChange={(e) => setCableSectionMm2(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-white font-mono rounded px-2 py-0.5 text-xs"
              >
                <option value={2.5}>2.5 mm² Cu</option>
                <option value={4.0}>4.0 mm² Cu</option>
                <option value={6.0}>6.0 mm² Cu</option>
                <option value={10.0}>10.0 mm² Cu</option>
                <option value={16.0}>16.0 mm² Cu</option>
                <option value={25.0}>25.0 mm² Cu</option>
              </select>
            </div>

            {/* Insulation */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{isFr ? 'Isolant Câble :' : 'Cable Insulation:'}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCableInsulation('PVC')}
                  className={`px-2.5 py-0.5 rounded font-mono text-xs ${
                    cableInsulation === 'PVC'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  PVC (70°C, k=115)
                </button>
                <button
                  onClick={() => setCableInsulation('XLPE')}
                  className={`px-2.5 py-0.5 rounded font-mono text-xs ${
                    cableInsulation === 'XLPE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  XLPE (90°C, k=143)
                </button>
              </div>
            </div>

            {/* Discrimination Margins Summary */}
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 mt-2 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">{isFr ? 'Marge Chronométrique :' : 'Time Margin:'}</span>
                <span className={isChronometricSelectivityValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {timeMarginMs} ms {isChronometricSelectivityValid ? '(Conforme ≥100ms)' : '(Insuffisant <100ms)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isFr ? 'Contrainte Max Câble (k²S²) :' : 'Max Cable Stress (k²S²):'}</span>
                <span className="text-slate-200">{(maxI2tCable / 1000000).toFixed(2)} × 10⁶ A²s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
