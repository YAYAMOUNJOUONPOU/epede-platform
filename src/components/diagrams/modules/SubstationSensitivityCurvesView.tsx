// src/components/diagrams/modules/SubstationSensitivityCurvesView.tsx
// High-precision electrotechnical parametric sensitivity and margin curves for substation assets.

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Thermometer, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  Info, 
  Activity, 
  Flame,
  Radio,
  Gauge,
  Clock,
  BarChart3,
  Waves
} from 'lucide-react';
import type { SubstationComplianceDossier } from '../../../services/substationBatchComplianceService';

interface SubstationSensitivityCurvesViewProps {
  locale: 'fr' | 'en';
  dossier: SubstationComplianceDossier;
  liveLoadMw: number;
  liveTap: number;
  ambientSoilTempC: number;
  gridScMva: number;
  breakerTimeMs: number;
  onSetLoadMw?: (mw: number) => void;
  onSetSoilTemp?: (temp: number) => void;
  onSetGridScMva?: (mva: number) => void;
}

export const SubstationSensitivityCurvesView: React.FC<SubstationSensitivityCurvesViewProps> = ({
  locale,
  dossier,
  liveLoadMw,
  liveTap,
  ambientSoilTempC,
  gridScMva,
  breakerTimeMs,
  onSetLoadMw,
  onSetSoilTemp,
  onSetGridScMva,
}) => {
  const [selectedCurve, setSelectedCurve] = useState<
    'CABLE_THERMAL' | 'TRAFO_CAPACITY' | 'BREAKER_DUTY' | 'TCC_SELECTIVITY' | 'POWER_QUALITY_HARMONICS'
  >('CABLE_THERMAL');

  // Dynamic state for TCC Selectivity Interactive Analysis
  const [tccFaultKa, setTccFaultKa] = useState<number>(12.5);
  const [tccFeederIs, setTccFeederIs] = useState<number>(250);
  const [tccFeederTms, setTccFeederTms] = useState<number>(0.12);
  const [tccIncomerIs, setTccIncomerIs] = useState<number>(600);
  const [tccIncomerTms, setTccIncomerTms] = useState<number>(0.25);

  // Dynamic state for Harmonics & Power Quality Analysis
  const [nonlinearLoadPercent, setNonlinearLoadPercent] = useState<number>(18);
  const [pfcCapacitorMvar, setPfcCapacitorMvar] = useState<number>(4.5);

  // =========================================================================
  // Curve 1 Calculations: Cable Ampacity & Temp vs. Soil Temperature
  // =========================================================================
  const cosPhi = 0.90;
  const unFeederV = (dossier.apparatuses.find(a => a.id === 'trafo-main-tr1')?.nominalRating ? 30.0 : 30.0) * (1 + liveTap * 0.0125) * 1000;
  const pFeederKw = Math.max(1500, liveLoadMw * 0.25 * 1000);
  const ibCurrent = (pFeederKw * 1000) / (Math.sqrt(3) * unFeederV * cosPhi);

  const soilTempPoints = [15, 20, 25, 30, 35, 40, 45, 50];
  const cableData = soilTempPoints.map(t => {
    const kTemp = Math.sqrt(Math.max(0.05, (90 - t) / (90 - 20)));
    const iz = 538 * 0.913 * kTemp * 0.85;
    const thetaCore = Math.min(130, Math.round(t + ((90 - 20) * Math.pow(ibCurrent / (538 * 0.913 * 0.85), 2))));
    const marginA = iz - ibCurrent;
    return { temp: t, kTemp, iz, thetaCore, marginA };
  });

  // Current operating point for cable
  const currentKTemp = Math.sqrt(Math.max(0.05, (90 - ambientSoilTempC) / 70));
  const currentIz = 538 * 0.913 * currentKTemp * 0.85;
  const currentThetaCore = Math.min(130, Math.round(ambientSoilTempC + ((90 - 20) * Math.pow(ibCurrent / (538 * 0.913 * 0.85), 2))));
  const currentCableMarginA = currentIz - ibCurrent;

  // =========================================================================
  // Curve 2 Calculations: Transformer Loading vs. Active Power Demand
  // =========================================================================
  const trafoLoadPoints = [10, 20, 30, 40, 48.5, 55, 60, 63, 68, 75];
  const trafoKv = 225.0;
  const trafoData = trafoLoadPoints.map(mw => {
    const mva = mw / 0.98;
    const ihv = (mw * 1e6) / (Math.sqrt(3) * trafoKv * 1e3 * 0.98);
    const loadPercent = (mva / 63.0) * 100;
    return { mw, mva, ihv, loadPercent };
  });

  const currentTrafoMva = liveLoadMw / 0.98;
  const currentTrafoIhv = (liveLoadMw * 1e6) / (Math.sqrt(3) * trafoKv * 1e3 * 0.98);
  const currentTrafoLoadPct = (currentTrafoMva / 63.0) * 100;

  // =========================================================================
  // Curve 3 Calculations: Breaker Breaking Stress vs. Upstream Ssc
  // =========================================================================
  const sscPoints = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000];
  const icuRatedKa = 40.0;
  const breakerData = sscPoints.map(mva => {
    const ikKa = (mva * 1000) / (Math.sqrt(3) * 225);
    const marginKa = icuRatedKa - ikKa;
    const marginPct = (marginKa / icuRatedKa) * 100;
    return { mva, ikKa, marginKa, marginPct };
  });

  const currentIkKa = (gridScMva * 1000) / (Math.sqrt(3) * 225);
  const currentBreakerMarginKa = icuRatedKa - currentIkKa;
  const currentBreakerMarginPct = (currentBreakerMarginKa / icuRatedKa) * 100;

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs between curves */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1E2E44]">
        <button
          type="button"
          onClick={() => setSelectedCurve('CABLE_THERMAL')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCurve === 'CABLE_THERMAL'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
              : 'bg-[#0E1724] text-slate-400 border-[#1E2E44] hover:bg-[#142133] hover:text-slate-200'
          }`}
        >
          <Thermometer className="h-4 w-4 text-amber-400" />
          <span>{locale === 'fr' ? '1. THERMIQUE CÂBLE VS TEMP. SOL' : '1. CABLE THERMAL VS SOIL TEMP'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCurve('TRAFO_CAPACITY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCurve === 'TRAFO_CAPACITY'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
              : 'bg-[#0E1724] text-slate-400 border-[#1E2E44] hover:bg-[#142133] hover:text-slate-200'
          }`}
        >
          <Activity className="h-4 w-4 text-cyan-400" />
          <span>{locale === 'fr' ? '2. CAPACITÉ TRANSFO VS CHARGE ACTIVE' : '2. TRAFO CAPACITY VS ACTIVE LOAD'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCurve('BREAKER_DUTY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCurve === 'BREAKER_DUTY'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
              : 'bg-[#0E1724] text-slate-400 border-[#1E2E44] hover:bg-[#142133] hover:text-slate-200'
          }`}
        >
          <Flame className="h-4 w-4 text-rose-400" />
          <span>{locale === 'fr' ? '3. TENUE DISJONCTEUR VS Ssc' : '3. BREAKER DUTY VS GRID Ssc'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCurve('TCC_SELECTIVITY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCurve === 'TCC_SELECTIVITY'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
              : 'bg-[#0E1724] text-slate-400 border-[#1E2E44] hover:bg-[#142133] hover:text-slate-200'
          }`}
        >
          <Clock className="h-4 w-4 text-emerald-400" />
          <span>{locale === 'fr' ? '4. SÉLECTIVITÉ TCC & MARGE Δt' : '4. TCC SELECTIVITY & Δt MARGIN'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCurve('POWER_QUALITY_HARMONICS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCurve === 'POWER_QUALITY_HARMONICS'
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm'
              : 'bg-[#0E1724] text-slate-400 border-[#1E2E44] hover:bg-[#142133] hover:text-slate-200'
          }`}
        >
          <Waves className="h-4 w-4 text-purple-400" />
          <span>{locale === 'fr' ? '5. HARMONIQUES & THD (CEI 61000)' : '5. HARMONICS & THD (IEC 61000)'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CURVE 1: CABLE THERMAL SENSITIVITY */}
      {/* ========================================================================= */}
      {selectedCurve === 'CABLE_THERMAL' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Interactive SVG Chart */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                    <span>{locale === 'fr' ? 'Courbe d’admissibilité thermique du câble 30 kV F1' : '30 kV Feeder F1 Cable Thermal Derating Curve'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    {locale === 'fr'
                      ? 'Évolution du courant admissible Iz et de la température d’âme selon CEI 60364-5-52 Tab. B.52.14'
                      : 'Variation of derated ampacity Iz and conductor core temperature per IEC 60364-5-52 Tab. B.52.14'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="h-2 w-4 bg-amber-400 rounded-sm inline-block" />
                    Iz (A)
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="h-2 w-4 bg-cyan-400 rounded-sm inline-block" />
                    Ib = {ibCurrent.toFixed(0)} A
                  </span>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="w-full h-64 relative bg-[#070C14] rounded-xl border border-slate-800/80 p-2 overflow-hidden">
                <svg viewBox="0 0 600 240" className="w-full h-full">
                  {/* Grid Lines */}
                  {[0, 50, 100, 150, 200].map(y => (
                    <line key={y} x1="50" y1={y + 20} x2="570" y2={y + 20} stroke="#172436" strokeDasharray="3 3" />
                  ))}
                  {[50, 125, 200, 275, 350, 425, 500, 570].map((x, idx) => (
                    <line key={x} x1={x} y1="20" x2={x} y2="210" stroke="#172436" strokeDasharray="3 3" />
                  ))}

                  {/* Y-Axis Labels (Amperes: 0 to 500 A) */}
                  <text x="40" y="215" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">0 A</text>
                  <text x="40" y="165" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">125 A</text>
                  <text x="40" y="115" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">250 A</text>
                  <text x="40" y="65" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">375 A</text>
                  <text x="40" y="25" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">500 A</text>

                  {/* X-Axis Labels (Temperature 15°C to 50°C) */}
                  {soilTempPoints.map((t, i) => {
                    const cx = 50 + (i / (soilTempPoints.length - 1)) * 520;
                    return (
                      <text key={t} x={cx} y="230" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                        {t}°C
                      </text>
                    );
                  })}

                  {/* Ib Constant Operating Current Line */}
                  {(() => {
                    const yIb = 210 - (ibCurrent / 500) * 190;
                    return (
                      <g>
                        <line x1="50" y1={yIb} x2="570" y2={yIb} stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                        <text x="565" y={yIb - 6} fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="end">
                          Ib = {ibCurrent.toFixed(0)} A
                        </text>
                      </g>
                    );
                  })()}

                  {/* Iz Derating Curve Line */}
                  {(() => {
                    const points = cableData.map((d, i) => {
                      const cx = 50 + (i / (cableData.length - 1)) * 520;
                      const cy = 210 - (d.iz / 500) * 190;
                      return `${cx},${cy}`;
                    }).join(' ');

                    return (
                      <g>
                        <polyline fill="none" stroke="#f59e0b" strokeWidth="3" points={points} />
                        {cableData.map((d, i) => {
                          const cx = 50 + (i / (cableData.length - 1)) * 520;
                          const cy = 210 - (d.iz / 500) * 190;
                          return (
                            <circle key={i} cx={cx} cy={cy} r="4" fill="#f59e0b" stroke="#0D1522" strokeWidth="2" />
                          );
                        })}
                      </g>
                    );
                  })()}

                  {/* Active Operating Point Dot */}
                  {(() => {
                    const normTemp = Math.max(0, Math.min(1, (ambientSoilTempC - 15) / 35));
                    const cx = 50 + normTemp * 520;
                    const cy = 210 - (currentIz / 500) * 190;
                    return (
                      <g>
                        <line x1={cx} y1="20" x2={cx} y2="210" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx={cx} cy={cy} r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                        <text x={cx} y={cy - 12} fill="#f43f5e" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                          {currentIz.toFixed(0)} A (@{ambientSoilTempC}°C)
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Slider Controller below chart */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#090F1A] border border-slate-800">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                  <Sliders className="h-3.5 w-3.5 text-amber-400" />
                  <span>{locale === 'fr' ? 'Tester une température de sol :' : 'Test ground soil temperature:'}</span>
                </span>
                <div className="flex items-center gap-3 flex-1 max-w-sm">
                  <input
                    type="range"
                    min="15"
                    max="50"
                    step="1"
                    value={ambientSoilTempC}
                    onChange={(e) => onSetSoilTemp?.(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-amber-300 w-12 text-right">
                    {ambientSoilTempC}°C
                  </span>
                </div>
              </div>
            </div>

            {/* Side Metric Panel */}
            <div className="p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  {locale === 'fr' ? 'ANALYSE DE MARGE DU CÂBLE' : 'CABLE MARGIN ANALYSIS'}
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">{locale === 'fr' ? 'Courant de charge (Ib)' : 'Load current (Ib)'}</span>
                    <span className="font-bold text-cyan-400">{ibCurrent.toFixed(1)} A</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">{locale === 'fr' ? 'Courant admissible (Iz)' : 'Derated ampacity (Iz)'}</span>
                    <span className="font-bold text-amber-400">{currentIz.toFixed(1)} A</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">{locale === 'fr' ? 'Marge d’échauffement' : 'Thermal safety margin'}</span>
                    <span className={`font-bold ${currentCableMarginA > 50 ? 'text-emerald-400' : currentCableMarginA > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                      +{currentCableMarginA.toFixed(1)} A ({((currentCableMarginA / currentIz) * 100).toFixed(0)}%)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">{locale === 'fr' ? 'Température âme estimée' : 'Est. Core Temp'}</span>
                    <span className={`font-bold ${currentThetaCore > 90 ? 'text-rose-400' : currentThetaCore > 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {currentThetaCore}°C / 90°C max
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Verdict */}
              <div className={`p-4 rounded-xl border ${
                currentCableMarginA < 0
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : currentCableMarginA < 40
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2 font-mono font-bold text-xs">
                  {currentCableMarginA < 0 ? (
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                  ) : currentCableMarginA < 40 ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  )}
                  <span>
                    {currentCableMarginA < 0
                      ? (locale === 'fr' ? 'SURCHARGE THERMIQUE CRITIQUE' : 'CRITICAL THERMAL OVERLOAD')
                      : currentCableMarginA < 40
                      ? (locale === 'fr' ? 'MARGE THERMIQUE ÉTROITE' : 'NARROW THERMAL MARGIN')
                      : (locale === 'fr' ? 'MARGE THERMIQUE CONFORTABLE' : 'HEALTHY THERMAL MARGIN')}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-300 mt-1">
                  {currentCableMarginA < 0
                    ? (locale === 'fr' ? 'Le courant Ib dépasse la capacité Iz déclassée. Déclenchement thermique CEI 60947 requis.' : 'Load current exceeds derated capacity. Thermal trip required.')
                    : (locale === 'fr' ? 'Câble 240 mm² Al conforme au dimensionnement thermique continu sous 1.0 m.' : '240 mm² Al cable satisfies continuous underground heating limits.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CURVE 2: TRANSFORMER CAPACITY SENSITIVITY */}
      {/* ========================================================================= */}
      {selectedCurve === 'TRAFO_CAPACITY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Courbe de charge du Transformateur 63 MVA 225/30 kV' : '63 MVA 225/30 kV Transformer Loading Curve'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    {locale === 'fr'
                      ? 'Courant primaire I_hv et puissance apparente selon la demande active (CEI 60076-1)'
                      : 'Primary current I_hv and apparent power vs. active load demand (IEC 60076-1)'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="h-2 w-4 bg-cyan-400 rounded-sm inline-block" />
                    I_hv (A)
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="h-2 w-4 bg-rose-400 rounded-sm inline-block" />
                    I_nom = 161.9 A
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="w-full h-64 relative bg-[#070C14] rounded-xl border border-slate-800/80 p-2 overflow-hidden">
                <svg viewBox="0 0 600 240" className="w-full h-full">
                  {/* Grid */}
                  {[0, 50, 100, 150, 200].map(y => (
                    <line key={y} x1="50" y1={y + 20} x2="570" y2={y + 20} stroke="#172436" strokeDasharray="3 3" />
                  ))}

                  {/* Y-Axis: 0 to 200 A */}
                  <text x="40" y="215" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">0 A</text>
                  <text x="40" y="165" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">50 A</text>
                  <text x="40" y="115" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">100 A</text>
                  <text x="40" y="65" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">150 A</text>
                  <text x="40" y="25" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">200 A</text>

                  {/* X-Axis: 10 MW to 75 MW */}
                  {trafoLoadPoints.map((mw, i) => {
                    const cx = 50 + (i / (trafoLoadPoints.length - 1)) * 520;
                    return (
                      <text key={mw} x={cx} y="230" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                        {mw}
                      </text>
                    );
                  })}

                  {/* Inom 161.9 A Line */}
                  {(() => {
                    const yNom = 210 - (161.9 / 200) * 190;
                    return (
                      <g>
                        <line x1="50" y1={yNom} x2="570" y2={yNom} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                        <text x="565" y={yNom - 6} fill="#f43f5e" fontSize="10" fontFamily="monospace" textAnchor="end">
                          I_nom 100% = 161.9 A
                        </text>
                      </g>
                    );
                  })()}

                  {/* Primary Current Curve Line */}
                  {(() => {
                    const points = trafoData.map((d, i) => {
                      const cx = 50 + (i / (trafoData.length - 1)) * 520;
                      const cy = 210 - (d.ihv / 200) * 190;
                      return `${cx},${cy}`;
                    }).join(' ');

                    return (
                      <g>
                        <polyline fill="none" stroke="#38bdf8" strokeWidth="3" points={points} />
                        {trafoData.map((d, i) => {
                          const cx = 50 + (i / (trafoData.length - 1)) * 520;
                          const cy = 210 - (d.ihv / 200) * 190;
                          return (
                            <circle key={i} cx={cx} cy={cy} r="4" fill="#38bdf8" stroke="#0D1522" strokeWidth="2" />
                          );
                        })}
                      </g>
                    );
                  })()}

                  {/* Active Operating Marker */}
                  {(() => {
                    const normMw = Math.max(0, Math.min(1, (liveLoadMw - 10) / (75 - 10)));
                    const cx = 50 + normMw * 520;
                    const cy = 210 - (currentTrafoIhv / 200) * 190;
                    return (
                      <g>
                        <line x1={cx} y1="20" x2={cx} y2="210" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx={cx} cy={cy} r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                        <text x={cx} y={cy - 12} fill="#f43f5e" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                          {currentTrafoIhv.toFixed(1)} A ({currentTrafoLoadPct.toFixed(0)}%)
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Slider for Load */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#090F1A] border border-slate-800">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                  <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Tester une puissance appelée :' : 'Test active power demand:'}</span>
                </span>
                <div className="flex items-center gap-3 flex-1 max-w-sm">
                  <input
                    type="range"
                    min="10"
                    max="75"
                    step="0.5"
                    value={liveLoadMw}
                    onChange={(e) => onSetLoadMw?.(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-cyan-300 w-16 text-right">
                    {liveLoadMw.toFixed(1)} MW
                  </span>
                </div>
              </div>
            </div>

            {/* Trafo Margin Details */}
            <div className="p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  {locale === 'fr' ? 'RÉSERVE DE PUISSANCE TR1' : 'TR1 CAPACITY MARGIN'}
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">Puissance Apparente (S)</span>
                    <span className="font-bold text-cyan-400">{currentTrafoMva.toFixed(1)} MVA</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">Capacité Nominale (Sn)</span>
                    <span className="font-bold text-slate-200">63.0 MVA</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">Taux de charge continu</span>
                    <span className={`font-bold ${currentTrafoLoadPct > 100 ? 'text-rose-400' : currentTrafoLoadPct > 90 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {currentTrafoLoadPct.toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">Réserve disponible</span>
                    <span className={`font-bold ${63.0 - currentTrafoMva < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {(63.0 - currentTrafoMva).toFixed(1)} MVA
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                currentTrafoLoadPct > 100
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : currentTrafoLoadPct > 90
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2 font-mono font-bold text-xs">
                  {currentTrafoLoadPct > 100 ? (
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                  ) : currentTrafoLoadPct > 90 ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                  <span>
                    {currentTrafoLoadPct > 100
                      ? (locale === 'fr' ? 'SURCHARGE TRANSFORMATEUR' : 'TRANSFORMER OVERLOAD')
                      : currentTrafoLoadPct > 90
                      ? (locale === 'fr' ? 'CHARGE PROCHE DE Sn' : 'NEAR FULL CAPACITY')
                      : (locale === 'fr' ? 'RÉGIME NOMINAL CONFORME' : 'NOMINAL SAFE RATING')}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-300 mt-1">
                  {currentTrafoLoadPct > 100
                    ? (locale === 'fr' ? 'La charge active dépasse les 63 MVA du transformateur. Délestage requis selon CEI 60076-7.' : 'Active load exceeds 63 MVA nominal rating. Load shedding required per IEC 60076-7.')
                    : (locale === 'fr' ? 'Le transformateur opère dans les limites de ventilation naturelle ONAF/ONAN.' : 'Operating safely within standard ONAF/ONAN cooling limits.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CURVE 3: BREAKER DUTY SENSITIVITY */}
      {/* ========================================================================= */}
      {selectedCurve === 'BREAKER_DUTY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-rose-400" />
                    <span>{locale === 'fr' ? 'Pouvoir de coupure disjoncteur 225 kV vs. Puissance de court-circuit' : '225 kV Breaker Breaking Duty vs. Grid Short-Circuit Capacity'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    {locale === 'fr'
                      ? 'Courant de court-circuit symétrique initial Ik" vs. Icu assigné 40.0 kA (CEI 62271-100)'
                      : 'Initial symmetrical short-circuit current Ik" vs. rated Icu 40.0 kA (IEC 62271-100)'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="h-2 w-4 bg-rose-400 rounded-sm inline-block" />
                    Ik" (kA)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="h-2 w-4 bg-emerald-400 rounded-sm inline-block" />
                    Icu = 40.0 kA
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="w-full h-64 relative bg-[#070C14] rounded-xl border border-slate-800/80 p-2 overflow-hidden">
                <svg viewBox="0 0 600 240" className="w-full h-full">
                  {/* Grid */}
                  {[0, 50, 100, 150, 200].map(y => (
                    <line key={y} x1="50" y1={y + 20} x2="570" y2={y + 20} stroke="#172436" strokeDasharray="3 3" />
                  ))}

                  {/* Y-Axis: 0 to 50 kA */}
                  <text x="40" y="215" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">0 kA</text>
                  <text x="40" y="165" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">12.5 kA</text>
                  <text x="40" y="115" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">25.0 kA</text>
                  <text x="40" y="65" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">37.5 kA</text>
                  <text x="40" y="25" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">50.0 kA</text>

                  {/* X-Axis: 1000 to 6000 MVA */}
                  {sscPoints.map((mva, i) => {
                    const cx = 50 + (i / (sscPoints.length - 1)) * 520;
                    return (
                      <text key={mva} x={cx} y="230" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                        {mva}
                      </text>
                    );
                  })}

                  {/* Rated Icu = 40.0 kA Solid Line */}
                  {(() => {
                    const yIcu = 210 - (40.0 / 50.0) * 190;
                    return (
                      <g>
                        <line x1="50" y1={yIcu} x2="570" y2={yIcu} stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" />
                        <text x="565" y={yIcu - 6} fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="end">
                          Icu assigné = 40.0 kA
                        </text>
                      </g>
                    );
                  })()}

                  {/* Ik" Curve */}
                  {(() => {
                    const points = breakerData.map((d, i) => {
                      const cx = 50 + (i / (breakerData.length - 1)) * 520;
                      const cy = 210 - (d.ikKa / 50.0) * 190;
                      return `${cx},${cy}`;
                    }).join(' ');

                    return (
                      <g>
                        <polyline fill="none" stroke="#f43f5e" strokeWidth="3" points={points} />
                        {breakerData.map((d, i) => {
                          const cx = 50 + (i / (breakerData.length - 1)) * 520;
                          const cy = 210 - (d.ikKa / 50.0) * 190;
                          return (
                            <circle key={i} cx={cx} cy={cy} r="4" fill="#f43f5e" stroke="#0D1522" strokeWidth="2" />
                          );
                        })}
                      </g>
                    );
                  })()}

                  {/* Active Operating Marker */}
                  {(() => {
                    const normSsc = Math.max(0, Math.min(1, (gridScMva - 1000) / 5000));
                    const cx = 50 + normSsc * 520;
                    const cy = 210 - (currentIkKa / 50.0) * 190;
                    return (
                      <g>
                        <line x1={cx} y1="20" x2={cx} y2="210" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx={cx} cy={cy} r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                        <text x={cx} y={cy - 12} fill="#f43f5e" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                          Ik" = {currentIkKa.toFixed(1)} kA (@{gridScMva} MVA)
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Slider for Ssc */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#090F1A] border border-slate-800">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                  <Sliders className="h-3.5 w-3.5 text-rose-400" />
                  <span>{locale === 'fr' ? 'Tester une puissance Ssc amont :' : 'Test upstream grid Ssc:'}</span>
                </span>
                <div className="flex items-center gap-3 flex-1 max-w-sm">
                  <input
                    type="range"
                    min="1000"
                    max="6000"
                    step="250"
                    value={gridScMva}
                    onChange={(e) => onSetGridScMva?.(parseInt(e.target.value, 10))}
                    className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-rose-300 w-20 text-right">
                    {gridScMva} MVA
                  </span>
                </div>
              </div>
            </div>

            {/* Breaker Margin Details */}
            <div className="p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  {locale === 'fr' ? 'MARGE DE COUPURE DISJONCTEUR' : 'BREAKER BREAKING MARGIN'}
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">Courant de coupure (Ik")</span>
                    <span className="font-bold text-rose-400">{currentIkKa.toFixed(1)} kA</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">Pouvoir assigné (Icu)</span>
                    <span className="font-bold text-emerald-400">40.0 kA</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">Marge résiduelle absolue</span>
                    <span className={`font-bold ${currentBreakerMarginKa < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      +{currentBreakerMarginKa.toFixed(1)} kA
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                    <span className="text-slate-400">Taux de sollicitation</span>
                    <span className={`font-bold ${currentIkKa > 40.0 ? 'text-rose-400' : currentIkKa > 36.0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {((currentIkKa / 40.0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                currentIkKa > 40.0
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : currentIkKa > 36.0
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2 font-mono font-bold text-xs">
                  {currentIkKa > 40.0 ? (
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                  ) : currentIkKa > 36.0 ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                  <span>
                    {currentIkKa > 40.0
                      ? (locale === 'fr' ? 'POUVOIR DE COUPURE DÉPASSÉ' : 'BREAKING CAPACITY EXCEEDED')
                      : currentIkKa > 36.0
                      ? (locale === 'fr' ? 'MARGE ÉTROITE (<10%)' : 'NARROW MARGIN (<10%)')
                      : (locale === 'fr' ? 'POUVOIR DE COUPURE CONFORME' : 'BREAKING CAPACITY COMPLIANT')}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-300 mt-1">
                  {currentIkKa > 40.0
                    ? (locale === 'fr' ? 'Le court-circuit amont excède les 40 kA du disjoncteur. Remplacement par modèle 50 kA requis.' : 'Grid fault current exceeds 40 kA rating. Upgrade to 50 kA breaker required.')
                    : (locale === 'fr' ? 'Le disjoncteur garantit une coupure sûre selon le cycle CEI O-0.3s-CO-3min-CO.' : 'Breaker safely clears maximum expected bus fault per IEC cycle.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CURVE 4: TCC PROTECTION SELECTIVITY & GRADING MARGIN (IEC 60255 / ANSI 51) */}
      {/* ========================================================================= */}
      {selectedCurve === 'TCC_SELECTIVITY' && (() => {
        // IEC 60255 Standard Inverse formula: t = (0.14 / ((I / Is)^0.02 - 1)) * TMS
        const calcTripTime = (currentA: number, isA: number, tms: number, instThresholdA: number) => {
          if (currentA >= instThresholdA) return 0.040; // 40ms instantaneous mechanical breaker clear
          if (currentA <= isA) return 999;
          const ratio = currentA / isA;
          const time = (0.14 / (Math.pow(ratio, 0.02) - 1)) * tms;
          return Math.max(0.040, time);
        };

        const testFaultA = tccFaultKa * 1000;
        const feederTripSec = calcTripTime(testFaultA, tccFeederIs, tccFeederTms, 8000);
        const incomerTripSec = calcTripTime(testFaultA, tccIncomerIs, tccIncomerTms, 18000);
        const deltaTMs = Math.round((incomerTripSec - feederTripSec) * 1000);
        const isGraded = deltaTMs >= 250;

        // Logarithmic coordinates for chart (Current: 100 A to 30,000 A, Time: 0.03 s to 10 s)
        const minILog = Math.log10(100);
        const maxILog = Math.log10(30000);
        const minTLog = Math.log10(0.03);
        const maxTLog = Math.log10(10);

        const getPlotX = (iA: number) => {
          const l = Math.log10(Math.max(100, Math.min(30000, iA)));
          return 50 + ((l - minILog) / (maxILog - minILog)) * 520;
        };

        const getPlotY = (tSec: number) => {
          const l = Math.log10(Math.max(0.03, Math.min(10, tSec)));
          return 20 + ((maxTLog - l) / (maxTLog - minTLog)) * 190;
        };

        // Generate SVG Path for Feeder Relay
        const feederPoints: string[] = [];
        for (let step = 0; step <= 60; step++) {
          const l = minILog + (step / 60) * (maxILog - minILog);
          const iVal = Math.pow(10, l);
          if (iVal >= tccFeederIs * 1.05) {
            const t = calcTripTime(iVal, tccFeederIs, tccFeederTms, 8000);
            if (t >= 0.03 && t <= 10) {
              const px = getPlotX(iVal).toFixed(1);
              const py = getPlotY(t).toFixed(1);
              feederPoints.push(`${feederPoints.length === 0 ? 'M' : 'L'} ${px} ${py}`);
            }
          }
        }

        // Generate SVG Path for Incomer Relay
        const incomerPoints: string[] = [];
        for (let step = 0; step <= 60; step++) {
          const l = minILog + (step / 60) * (maxILog - minILog);
          const iVal = Math.pow(10, l);
          if (iVal >= tccIncomerIs * 1.05) {
            const t = calcTripTime(iVal, tccIncomerIs, tccIncomerTms, 18000);
            if (t >= 0.03 && t <= 10) {
              const px = getPlotX(iVal).toFixed(1);
              const py = getPlotY(t).toFixed(1);
              incomerPoints.push(`${incomerPoints.length === 0 ? 'M' : 'L'} ${px} ${py}`);
            }
          }
        }

        const testFaultX = getPlotX(testFaultA);
        const testFeederY = getPlotY(feederTripSec);
        const testIncomerY = getPlotY(incomerTripSec);

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Interactive TCC SVG Chart */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-400" />
                      <span>{locale === 'fr' ? 'Courbes Sélectives Temps-Courant (TCC) CEI 60255' : 'Time-Current Characteristic (TCC) Curves'}</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      {locale === 'fr'
                        ? 'Coordination chronométrique entre le relais départ F1 (30 kV) et l\'amont transformateur (225 kV)'
                        : 'Grading coordination between 30 kV feeder relay and 225 kV HV incomer backup'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <span className="h-2 w-4 bg-cyan-400 rounded-sm inline-block" />
                      {locale === 'fr' ? 'Départ F1 (51)' : 'Feeder F1 (51)'}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <span className="h-2 w-4 bg-amber-400 rounded-sm inline-block" />
                      {locale === 'fr' ? 'Arrivée HTB (51)' : 'Incomer HV (51)'}
                    </span>
                  </div>
                </div>

                {/* Logarithmic SVG Plot */}
                <div className="w-full h-64 relative bg-[#070C14] rounded-xl border border-slate-800/80 p-2 overflow-hidden">
                  <svg viewBox="0 0 600 240" className="w-full h-full">
                    {/* Logarithmic Current Grid Lines (X) */}
                    {[100, 200, 500, 1000, 2000, 5000, 10000, 20000, 30000].map(val => {
                      const gx = getPlotX(val);
                      const isMajor = val === 100 || val === 1000 || val === 10000;
                      return (
                        <g key={val}>
                          <line x1={gx} y1="20" x2={gx} y2="210" stroke={isMajor ? '#334155' : '#1e293b'} strokeDasharray={isMajor ? 'none' : '2 2'} strokeWidth={isMajor ? 1 : 0.5} />
                          {isMajor && (
                            <text x={gx} y="226" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                              {val >= 1000 ? `${val / 1000}k` : val}A
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Logarithmic Time Grid Lines (Y) */}
                    {[0.04, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0].map(val => {
                      const gy = getPlotY(val);
                      const isMajor = val === 0.1 || val === 1.0 || val === 10.0;
                      return (
                        <g key={val}>
                          <line x1="50" y1={gy} x2="570" y2={gy} stroke={isMajor ? '#334155' : '#1e293b'} strokeDasharray={isMajor ? 'none' : '2 2'} strokeWidth={isMajor ? 1 : 0.5} />
                          {isMajor && (
                            <text x="44" y={gy + 3} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
                              {val}s
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Feeder TCC Curve */}
                    <path d={feederPoints.join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" />

                    {/* Incomer TCC Curve */}
                    <path d={incomerPoints.join(' ')} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />

                    {/* Test Fault Vertical Line */}
                    <line x1={testFaultX} y1="20" x2={testFaultX} y2="210" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Operating Dots */}
                    <circle cx={testFaultX} cy={testFeederY} r="5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={testFaultX} cy={testIncomerY} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Trip Time Text Badges */}
                    <text x={testFaultX + 8} y={testFeederY + 4} fill="#22d3ee" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      t_F1: {(feederTripSec * 1000).toFixed(0)} ms
                    </text>
                    <text x={testFaultX + 8} y={testIncomerY - 4} fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      t_HTB: {(incomerTripSec * 1000).toFixed(0)} ms
                    </text>
                  </svg>
                </div>

                {/* Interactive Fault Slider */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#090F1A] border border-slate-800">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">{locale === 'fr' ? 'Courant de défaut testé (Ik) :' : 'Test fault current (Ik):'}</span>
                      <span className="font-bold text-rose-400">{tccFaultKa.toFixed(1)} kA</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="25.0"
                      step="0.5"
                      value={tccFaultKa}
                      onChange={(e) => setTccFaultKa(parseFloat(e.target.value))}
                      className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">{locale === 'fr' ? 'TMS Relais F1 :' : 'Feeder F1 TMS:'}</span>
                      <span className="font-bold text-cyan-400">{tccFeederTms.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.40"
                      step="0.01"
                      value={tccFeederTms}
                      onChange={(e) => setTccFeederTms(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Side Grading Margin Card */}
              <div className="p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    {locale === 'fr' ? 'MARGE CHRONOMÉTRIQUE Δt' : 'TIME GRADING MARGIN Δt'}
                  </h4>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                      <span className="text-slate-400">{locale === 'fr' ? 'Temps départ (t_F1)' : 'Feeder trip time (t_F1)'}</span>
                      <span className="font-bold text-cyan-400">{(feederTripSec * 1000).toFixed(0)} ms</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                      <span className="text-slate-400">{locale === 'fr' ? 'Temps amont (t_HTB)' : 'Incomer trip time (t_HTB)'}</span>
                      <span className="font-bold text-amber-400">{(incomerTripSec * 1000).toFixed(0)} ms</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                      <span className="text-slate-400">{locale === 'fr' ? 'Intervalle sélectif (Δt)' : 'Grading gap (Δt)'}</span>
                      <span className={`font-bold ${isGraded ? 'text-emerald-400' : 'text-rose-400'}`}>
                        +{deltaTMs} ms
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                      <span className="text-slate-400">{locale === 'fr' ? 'Seuil CEI 60255' : 'IEC 60255 Required'}</span>
                      <span className="font-bold text-slate-200">≥ 250 ms</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isGraded
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2 font-mono font-bold text-xs">
                    {isGraded ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-rose-400" />
                    )}
                    <span>
                      {isGraded
                        ? (locale === 'fr' ? 'SÉLECTIVITÉ TOTALE GARANTIE' : 'FULL SELECTIVITY ASSURED')
                        : (locale === 'fr' ? 'RISQUE DE DÉCLENCHEMENT SIMULTANÉ' : 'SIMULTANEOUS TRIP RISK')}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-300 mt-1">
                    {isGraded
                      ? (locale === 'fr' ? 'Le départ éliminera le défaut sans coupure générale de la sous-station.' : 'Downstream breaker safely clears without upstream blacking out the bus.')
                      : (locale === 'fr' ? 'Δt < 250 ms : augmenter le TMS amont ou réduire le retard départ.' : 'Grading gap insufficient: increase incomer TMS or tune feeder curve.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* CURVE 5: HARMONICS SPECTRUM & POWER QUALITY (IEC 61000-2-4 / IEEE 519) */}
      {/* ========================================================================= */}
      {selectedCurve === 'POWER_QUALITY_HARMONICS' && (() => {
        const kHarm = nonlinearLoadPercent / 100;
        const harmonicSpectrum = [
          { order: 1, freq: 50, name: 'h1 (50 Hz)', pctU: 100, pctI: 100, limitU: 100 },
          { order: 3, freq: 150, name: 'h3 (150 Hz)', pctU: +(kHarm * 1.5).toFixed(2), pctI: +(kHarm * 4.2).toFixed(2), limitU: 3.0 },
          { order: 5, freq: 250, name: 'h5 (250 Hz)', pctU: +(kHarm * 4.8).toFixed(2), pctI: +(kHarm * 17.5).toFixed(2), limitU: 5.0 },
          { order: 7, freq: 350, name: 'h7 (350 Hz)', pctU: +(kHarm * 3.2).toFixed(2), pctI: +(kHarm * 11.0).toFixed(2), limitU: 5.0 },
          { order: 11, freq: 550, name: 'h11 (550 Hz)', pctU: +(kHarm * 2.1).toFixed(2), pctI: +(kHarm * 7.5).toFixed(2), limitU: 3.0 },
          { order: 13, freq: 650, name: 'h13 (650 Hz)', pctU: +(kHarm * 1.6).toFixed(2), pctI: +(kHarm * 5.2).toFixed(2), limitU: 3.0 },
          { order: 17, freq: 850, name: 'h17 (850 Hz)', pctU: +(kHarm * 0.9).toFixed(2), pctI: +(kHarm * 3.1).toFixed(2), limitU: 2.0 },
          { order: 19, freq: 950, name: 'h19 (950 Hz)', pctU: +(kHarm * 0.7).toFixed(2), pctI: +(kHarm * 2.4).toFixed(2), limitU: 1.5 },
        ];

        const thdVoltage = Math.sqrt(harmonicSpectrum.slice(1).reduce((sum, h) => sum + Math.pow(h.pctU, 2), 0));
        const thdCurrent = Math.sqrt(harmonicSpectrum.slice(1).reduce((sum, h) => sum + Math.pow(h.pctI, 2), 0));

        // Resonance estimation with capacitor bank: hr = sqrt(Ssc / Qc)
        const hrResonance = Math.sqrt(Math.max(1, gridScMva / Math.max(0.1, pfcCapacitorMvar)));
        const frResonanceHz = Math.round(50 * hrResonance);
        const isResonanceRisk = Math.abs(hrResonance - 5) < 0.6 || Math.abs(hrResonance - 7) < 0.6;
        const isThdCompliant = thdVoltage <= 5.0; // IEEE 519 5% standard threshold

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Harmonic Spectrum SVG Bar Chart */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Waves className="h-4 w-4 text-purple-400" />
                      <span>{locale === 'fr' ? 'Spectre Harmonique & Distorsion THD (CEI 61000-2-4 / IEEE 519)' : 'Harmonic Spectrum & Distortion THD (IEC 61000 / IEEE 519)'}</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      {locale === 'fr'
                        ? 'Taux d\'harmoniques en tension Uh (%) par rang avec limites normatives Classe 2'
                        : 'Voltage individual harmonic levels Uh (%) per order with normative Class 2 limits'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1 text-purple-400 font-bold">
                      <span className="h-2 w-4 bg-purple-400 rounded-sm inline-block" />
                      Uh (%)
                    </span>
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <span className="h-0.5 w-4 bg-rose-400 inline-block" />
                      {locale === 'fr' ? 'Limite CEI' : 'IEC Limit'}
                    </span>
                  </div>
                </div>

                {/* SVG Bar Chart for Harmonics h3 to h19 */}
                <div className="w-full h-64 relative bg-[#070C14] rounded-xl border border-slate-800/80 p-2 overflow-hidden">
                  <svg viewBox="0 0 600 240" className="w-full h-full">
                    {/* Y Axis Grid Lines for % */}
                    {[1, 2, 3, 4, 5, 6].map(pct => {
                      const gy = 200 - (pct / 6) * 170;
                      return (
                        <g key={pct}>
                          <line x1="45" y1={gy} x2="570" y2={gy} stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.5" />
                          <text x="40" y={gy + 3} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
                            {pct}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars for harmonic orders h3 through h19 */}
                    {harmonicSpectrum.slice(1).map((h, idx) => {
                      const barWidth = 36;
                      const spacing = (520 - 7 * barWidth) / 8;
                      const bx = 55 + idx * (barWidth + spacing);
                      const barHeight = Math.min(180, (h.pctU / 6) * 170);
                      const by = 200 - barHeight;
                      const limitY = 200 - (h.limitU / 6) * 170;
                      const isOver = h.pctU > h.limitU;

                      return (
                        <g key={h.order}>
                          {/* Limit indicator line */}
                          <line x1={bx - 4} y1={limitY} x2={bx + barWidth + 4} y2={limitY} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                          
                          {/* Harmonic Bar */}
                          <rect
                            x={bx}
                            y={by}
                            width={barWidth}
                            height={barHeight}
                            rx="4"
                            fill={isOver ? '#f43f5e' : h.pctU > h.limitU * 0.8 ? '#fbbf24' : '#a855f7'}
                            opacity="0.9"
                          />

                          {/* Value on top of bar */}
                          <text
                            x={bx + barWidth / 2}
                            y={by - 5}
                            fill={isOver ? '#f43f5e' : '#cbd5e1'}
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {h.pctU}%
                          </text>

                          {/* Order label below */}
                          <text
                            x={bx + barWidth / 2}
                            y="218"
                            fill="#94a3b8"
                            fontSize="10"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            h{h.order}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Sliders for Harmonic Control */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#090F1A] border border-slate-800">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">{locale === 'fr' ? 'Taux de charges non-linéaires (VFD/Onduleurs) :' : 'Nonlinear load penetration (VFD):'}</span>
                      <span className="font-bold text-purple-400">{nonlinearLoadPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={nonlinearLoadPercent}
                      onChange={(e) => setNonlinearLoadPercent(parseInt(e.target.value, 10))}
                      className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">{locale === 'fr' ? 'Batterie de condensateurs HTA (Qc) :' : 'MV Capacitor Bank (Qc):'}</span>
                      <span className="font-bold text-cyan-400">{pfcCapacitorMvar.toFixed(1)} Mvar</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="15.0"
                      step="0.5"
                      value={pfcCapacitorMvar}
                      onChange={(e) => setPfcCapacitorMvar(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Side Metrics Card for Harmonics */}
              <div className="p-5 rounded-2xl bg-[#0D1522] border border-[#1E2E44] space-y-4 shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    {locale === 'fr' ? 'BILAN DE QUALITÉ D\'ONDE' : 'POWER QUALITY ASSESSMENT'}
                  </h4>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                      <span className="text-slate-400">{locale === 'fr' ? 'Distorsion Tension (THD_u)' : 'Voltage THD (THD_u)'}</span>
                      <span className={`font-bold ${thdVoltage > 5.0 ? 'text-rose-400' : thdVoltage > 4.0 ? 'text-amber-400' : 'text-purple-400'}`}>
                        {thdVoltage.toFixed(2)}% (max 5.0%)
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                      <span className="text-slate-400">{locale === 'fr' ? 'Distorsion Courant (THD_i)' : 'Current THD (THD_i)'}</span>
                      <span className="font-bold text-cyan-400">{thdCurrent.toFixed(1)}%</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                      <span className="text-slate-400">{locale === 'fr' ? 'Fréquence de résonance (fr)' : 'Resonance frequency (fr)'}</span>
                      <span className={`font-bold ${isResonanceRisk ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
                        {frResonanceHz} Hz (rang {hrResonance.toFixed(1)})
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#080E18] border border-slate-800/90 flex items-center justify-between">
                      <span className="text-slate-400">{locale === 'fr' ? 'Norme de référence' : 'Governing Standard'}</span>
                      <span className="font-bold text-emerald-400">IEEE 519 / CEI 61000</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${
                  !isThdCompliant || isResonanceRisk
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  <div className="flex items-center gap-2 font-mono font-bold text-xs">
                    {!isThdCompliant || isResonanceRisk ? (
                      <ShieldAlert className="h-4 w-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                    <span>
                      {isResonanceRisk
                        ? (locale === 'fr' ? 'RISQUE DE RÉSONANCE PARALLÈLE' : 'PARALLEL RESONANCE RISK')
                        : !isThdCompliant
                        ? (locale === 'fr' ? 'THD_U HORS GABARIT (>5%)' : 'THD_U EXCEEDS 5% LIMIT')
                        : (locale === 'fr' ? 'ONDE CONFORME AUX CRITÈRES CEI' : 'WAVEFORM FULLY COMPLIANT')}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-300 mt-1">
                    {isResonanceRisk
                      ? (locale === 'fr' ? `La fréquence de résonance (${frResonanceHz} Hz) coïncide avec le rang 5 ou 7 : installer une self anti-harmonique.` : `Resonance at ${frResonanceHz} Hz matches harmonic order: detuning reactor required.`)
                      : !isThdCompliant
                      ? (locale === 'fr' ? 'La pollution harmonique dépasse les 5% admissibles : filtrage actif requis.' : 'Harmonic pollution exceeds 5% limit: active power filter required.')
                      : (locale === 'fr' ? 'Le niveau de pollution harmonique reste dans les tolérances CEI 61000-2-4 Classe 2.' : 'Harmonic pollution within IEC 61000-2-4 Class 2 allowable limits.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
