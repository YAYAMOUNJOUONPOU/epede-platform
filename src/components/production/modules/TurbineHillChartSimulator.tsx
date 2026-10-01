// src/components/production/modules/TurbineHillChartSimulator.tsx
// EPEDE — Hydroelectric Turbine Efficiency Hill Chart & Governor Response Simulator
// Conforms to IEC 60193 (Hydraulic turbines acceptance tests) & IEC 61362 (Speed governing)

import React, { useState, useMemo } from 'react';
import { Sliders, Gauge, Activity, AlertTriangle, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface TurbineHillChartSimulatorProps {
  locale?: 'fr' | 'en';
  turbineId?: string;
}

export const TurbineHillChartSimulator: React.FC<TurbineHillChartSimulatorProps> = ({
  locale = 'fr',
  turbineId = 'francis'
}) => {
  const isFr = locale === 'fr';

  // State sliders
  const [headRatio, setHeadRatio] = useState<number>(1.0); // H / H_nominal (0.6 to 1.3)
  const [flowRatio, setFlowRatio] = useState<number>(0.85); // Q / Q_nominal (0.2 to 1.2)
  const [governorDroop, setGovernorDroop] = useState<number>(4.0); // Droop % (2 to 6%)
  const [closingTimeSec, setClosingTimeSec] = useState<number>(6.5); // Guide vane emergency closure time (s)

  // Efficiency computation based on turbine type and operating point
  const performance = useMemo(() => {
    // Model peak efficiency point at (H=1.0, Q=0.88)
    const dH = headRatio - 1.0;
    const dQ = flowRatio - 0.88;

    let basePeak = 0.945; // 94.5% peak for modern Francis
    let qSens = 0.28;
    let hSens = 0.22;

    if (turbineId.includes('pelton')) {
      basePeak = 0.925;
      // Pelton has very flat efficiency curve over wide flow range
      qSens = 0.12;
      hSens = 0.35;
    } else if (turbineId.includes('kaplan')) {
      basePeak = 0.940;
      // Kaplan double regulation (runner + wicket) maintains high efficiency across wide flow
      qSens = 0.14;
      hSens = 0.28;
    }

    const loss = qSens * Math.pow(dQ, 2) + hSens * Math.pow(dH, 2);
    const efficiency = Math.max(0.60, Math.min(basePeak, basePeak - loss));

    // Power output at Nachtigal reference scale (nominal 60 MW per unit, Hn=50m, Qn=135 m3/s)
    const nominalHeadM = 50;
    const nominalFlowM3s = 135;
    const rhoG = 9.81; // kN/m3
    const actualHead = nominalHeadM * headRatio;
    const actualFlow = nominalFlowM3s * flowRatio;
    const powerMw = (rhoG * actualFlow * actualHead * efficiency) / 1000;

    // Water Hammer Overpressure (Allievi simplified: penstock length L=350m, water velocity v0=3.8 m/s)
    // dH/H = (2 * L * v0 * flowRatio) / (g * H * Ts)
    const penstockLengthM = 350;
    const ratedVelocity = 3.8;
    const actualVelocity = ratedVelocity * flowRatio;
    const deltaH_m = (2 * penstockLengthM * actualVelocity) / (9.81 * closingTimeSec);
    const overpressurePercent = (deltaH_m / actualHead) * 100;

    // Thoma Cavitation Coefficient sigma = (H_baro - H_vapor - H_suction) / H
    // For runner at z = -1.5m below tailrace
    const sigmaActual = (10.1 - 0.3 + 1.5) / actualHead;
    const sigmaCritical = 0.08 + 0.05 * Math.pow(flowRatio, 2);
    const isCavitationSafe = sigmaActual > sigmaCritical * 1.15;

    return {
      efficiency: efficiency * 100,
      powerMw,
      actualHead,
      actualFlow,
      overpressurePercent,
      deltaH_m,
      sigmaActual,
      sigmaCritical,
      isCavitationSafe
    };
  }, [headRatio, flowRatio, turbineId, closingTimeSec]);

  // Point coordinates on SVG hill chart (SVG width: 440, height: 240)
  // X: Q ratio 0.2 -> 1.2 (map to 50 -> 400)
  // Y: H ratio 0.6 -> 1.3 (map to 210 -> 30)
  const opX = 50 + ((flowRatio - 0.2) / 1.0) * 350;
  const opY = 210 - ((headRatio - 0.6) / 0.7) * 180;

  return (
    <div className="rounded-2xl border border-sky-900/50 bg-[#090D14] p-5 space-y-5 shadow-2xl">
      {/* Title & IEC Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-900/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>{isFr ? 'Colline de Rendement & Régulation de Vitesse' : 'Turbine Hill Chart & Governor Simulation'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-900/60 text-sky-300 font-mono border border-sky-700/50">
                CEI 60193 / CEI 61362
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {isFr
                ? 'Simulation interactive du point de fonctionnement (H, Q) sur colline d\'iso-rendement et calcul du coup de bélier (Allievi).'
                : 'Interactive operating point (H, Q) mapping on iso-efficiency hill chart & Allievi water hammer overpressure analysis.'}
            </p>
          </div>
        </div>

        {/* Live Efficiency Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">{isFr ? 'Rendement η' : 'Efficiency η'}</div>
            <div className={`text-lg font-bold font-mono ${performance.efficiency >= 92 ? 'text-emerald-400' : performance.efficiency >= 85 ? 'text-amber-400' : 'text-red-400'}`}>
              {performance.efficiency.toFixed(1)} %
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">{isFr ? 'Puissance P' : 'Power P'}</div>
            <div className="text-lg font-bold font-mono text-cyan-400">
              {performance.powerMw.toFixed(1)} MW
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 cols: SVG Hill Chart (Colline de rendement) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-3 border border-slate-800 relative">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between mb-2">
            <span>{isFr ? 'Colline d\'Iso-Rendement (CEI 60193)' : 'Iso-Efficiency Contours (IEC 60193)'}</span>
            <span className="text-sky-400 text-[10px] font-bold">● Point Actuel: ({performance.actualFlow.toFixed(0)} m³/s, {performance.actualHead.toFixed(1)} m)</span>
          </div>

          <svg viewBox="0 0 440 240" className="w-full h-[220px] select-none">
            {/* Background Grid */}
            <defs>
              <linearGradient id="hillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0c1d38" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>
            </defs>
            <rect width="440" height="240" rx="8" fill="url(#hillGrad)" />

            {/* Grid lines */}
            {[0.4, 0.6, 0.8, 1.0, 1.2].map((q) => {
              const x = 50 + ((q - 0.2) / 1.0) * 350;
              return (
                <g key={`gx-${q}`}>
                  <line x1={x} y1={30} x2={x} y2={210} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
                  <text x={x} y={225} fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    {q.toFixed(1)} Qn
                  </text>
                </g>
              );
            })}

            {[0.7, 0.9, 1.1, 1.3].map((h) => {
              const y = 210 - ((h - 0.6) / 0.7) * 180;
              return (
                <g key={`gy-${h}`}>
                  <line x1={50} y1={y} x2={400} y2={y} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
                  <text x={42} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {h.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Iso-efficiency contour ellipses */}
            {/* 80% contour */}
            <ellipse cx="280" cy="115" rx="110" ry="78" fill="none" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4 2" />
            <text x="392" y="125" fill="#38bdf8" fontSize="8" opacity="0.6" fontFamily="monospace">80%</text>

            {/* 85% contour */}
            <ellipse cx="288" cy="112" rx="85" ry="60" fill="none" stroke="#0284c7" strokeWidth="1.2" opacity="0.7" />
            <text x="375" y="122" fill="#38bdf8" fontSize="8" fontFamily="monospace">85%</text>

            {/* 90% contour */}
            <ellipse cx="292" cy="110" rx="60" ry="42" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
            <text x="354" y="118" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">90%</text>

            {/* 92% contour */}
            <ellipse cx="295" cy="108" rx="42" ry="28" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="339" y="115" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">92%</text>

            {/* 94% Peak contour */}
            <ellipse cx="298" cy="106" rx="24" ry="16" fill="#0369a1" fillOpacity="0.25" stroke="#7dd3fc" strokeWidth="2" />
            <text x="298" y="109" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              94.5% PEAK
            </text>

            {/* Operating Point Indicator */}
            <circle cx={opX} cy={opY} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
            <line x1={opX} y1={210} x2={opX} y2={opY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={50} y1={opY} x2={opX} y2={opY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
          </svg>

          {/* Allievi & Cavitation Status Strip */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">{isFr ? 'Surpression Allievi :' : 'Water Hammer (Allievi):'}</span>
              <span className={`font-bold ${performance.overpressurePercent <= 25 ? 'text-emerald-400' : 'text-amber-400'}`}>
                +{performance.overpressurePercent.toFixed(1)}% (+{performance.deltaH_m.toFixed(1)} m)
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">{isFr ? 'Cavitation Thoma σ :' : 'Thoma Cavitation σ:'}</span>
              <span className={`font-bold flex items-center gap-1 ${performance.isCavitationSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                {performance.isCavitationSafe ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                σ = {performance.sigmaActual.toFixed(3)}
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Interactive Controls */}
        <div className="lg:col-span-5 space-y-3.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 font-mono text-xs text-sky-400 font-bold uppercase pb-1 border-b border-slate-800">
            <Sliders className="w-4 h-4" />
            <span>{isFr ? 'Paramètres Hydrauliques & Régulateur' : 'Hydraulic & Governor Settings'}</span>
          </div>

          {/* Head ratio slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">{isFr ? 'Chute Nette H / Hn :' : 'Net Head H / Hn:'}</span>
              <span className="text-sky-400 font-bold">{headRatio.toFixed(2)} ({performance.actualHead.toFixed(1)} m)</span>
            </div>
            <input
              type="range"
              min={0.65}
              max={1.25}
              step={0.01}
              value={headRatio}
              onChange={(e) => setHeadRatio(Number(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.65 (Étiage sévère)</span>
              <span>1.0 (Nominal)</span>
              <span>1.25 (Crues)</span>
            </div>
          </div>

          {/* Flow ratio slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">{isFr ? 'Débit Q / Qn (Directrices) :' : 'Discharge Q / Qn:'}</span>
              <span className="text-cyan-400 font-bold">{flowRatio.toFixed(2)} ({performance.actualFlow.toFixed(1)} m³/s)</span>
            </div>
            <input
              type="range"
              min={0.25}
              max={1.15}
              step={0.01}
              value={flowRatio}
              onChange={(e) => setFlowRatio(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.25 (Charge minimale)</span>
              <span>0.88 (Optimum)</span>
              <span>1.15 (Pleine ouverture)</span>
            </div>
          </div>

          {/* Governor closure time */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">{isFr ? 'Temps Fermeture Distributeur Ts :' : 'Wicket Gate Closure Time Ts:'}</span>
              <span className="text-purple-400 font-bold">{closingTimeSec.toFixed(1)} s</span>
            </div>
            <input
              type="range"
              min={3.5}
              max={12.0}
              step={0.5}
              value={closingTimeSec}
              onChange={(e) => setClosingTimeSec(Number(e.target.value))}
              className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>3.5 s (Rapide / Choc)</span>
              <span>6.5 s (Optimal)</span>
              <span>12.0 s (Lent)</span>
            </div>
          </div>

          {/* Droop setting */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">{isFr ? 'Statisme Fréquence Régulateur (Droop) :' : 'Governor Speed Droop (Statisme):'}</span>
              <span className="text-amber-400 font-bold">{governorDroop.toFixed(1)} %</span>
            </div>
            <input
              type="range"
              min={2.0}
              max={6.0}
              step={0.5}
              value={governorDroop}
              onChange={(e) => setGovernorDroop(Number(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2.0% (Réseau faible)</span>
              <span>4.0% (Standard CEI)</span>
              <span>6.0% (Charge de base)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
