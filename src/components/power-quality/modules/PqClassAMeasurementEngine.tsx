// src/components/power-quality/modules/PqClassAMeasurementEngine.tsx
// EPEDE Domain D17 / D14 - Stage 1: Class A Measurement Campaign & IEEE 519-2022 FFT Spectrum Analyzer

import React from 'react';
import {
  Activity,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Zap,
  BarChart3,
  TrendingUp,
  Flame
} from 'lucide-react';
import { type PqProjectStoreType } from '../services/usePqProjectStore';

interface PqClassAMeasurementEngineProps {
  locale: 'fr' | 'en';
  store: PqProjectStoreType;
}

export const PqClassAMeasurementEngine: React.FC<PqClassAMeasurementEngineProps> = ({
  locale,
  store
}) => {
  const {
    nominalVoltageV,
    setNominalVoltageV,
    fundamentalCurrentA,
    setFundamentalCurrentA,
    shortCircuitPowerMva,
    setShortCircuitPowerMva,
    h3Pct,
    setH3Pct,
    h5Pct,
    setH5Pct,
    h7Pct,
    setH7Pct,
    h9Pct,
    setH9Pct,
    h11Pct,
    setH11Pct,
    h13Pct,
    setH13Pct,
    h17Pct,
    setH17Pct,
    h19Pct,
    setH19Pct,
    h23Pct,
    setH23Pct,
    h25Pct,
    setH25Pct,
    harmonicAnalytics,
    isApfActive,
    setIsApfActive
  } = store;

  const harmonicBands = [
    { order: 3, freq: 150, val: h3Pct, setVal: setH3Pct, color: '#eab308', note: 'Homopolaire Neutre' },
    { order: 5, freq: 250, val: h5Pct, setVal: setH5Pct, color: '#06b6d4', note: '6-Pulse Dominant' },
    { order: 7, freq: 350, val: h7Pct, setVal: setH7Pct, color: '#3b82f6', note: '6-Pulse Dominant' },
    { order: 9, freq: 450, val: h9Pct, setVal: setH9Pct, color: '#eab308', note: 'Homopolaire Neutre' },
    { order: 11, freq: 550, val: h11Pct, setVal: setH11Pct, color: '#a855f7', note: '12-Pulse (ALUCAM)' },
    { order: 13, freq: 650, val: h13Pct, setVal: setH13Pct, color: '#a855f7', note: '12-Pulse (ALUCAM)' },
    { order: 17, freq: 850, val: h17Pct, setVal: setH17Pct, color: '#ec4899', note: 'Haut Rang Commutation' },
    { order: 19, freq: 950, val: h19Pct, setVal: setH19Pct, color: '#ec4899', note: 'Haut Rang Commutation' },
    { order: 23, freq: 1150, val: h23Pct, setVal: setH23Pct, color: '#f43f5e', note: 'Multi-Pulsations' },
    { order: 25, freq: 1250, val: h25Pct, setVal: setH25Pct, color: '#f43f5e', note: 'Multi-Pulsations' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-violet-500/30 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800">
              CEI 61000-4-30 CLASSE A / CEI 61000-4-7
            </span>
            <span className="text-xs text-slate-400 font-mono">
              [Fenêtre d’observation 10/12 cycles &agr; 200 ms - Synchronisation PLL]
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            {locale === 'fr'
              ? 'Campagne de Mesure de l’Onde & Analyse Spectrale FFT (Harmoniques h2 à h25)'
              : 'Power Quality Waveform Audit & FFT Harmonic Analyzer (Orders h2 to h25)'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            {locale === 'fr'
              ? "Évaluez la distorsion harmonique globale en courant (THDi) et en tension (THDu) au Point de Raccordement Commun (PCC) selon les gabarits stricts de l'IEEE Std 519-2022 et de la norme CEI 61000-2-4 Classe 2."
              : 'Evaluate Total Harmonic Distortion for current (THDi) and voltage (THDv) at the Point of Common Coupling (PCC) per IEEE Std 519-2022 and IEC 61000-2-4 Class 2 requirements.'}
          </p>
        </div>

        {/* Global APF Toggle in Stage 1 for Instant Live Comparison */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-white">
              {locale === 'fr' ? 'Filtre Actif (APF) :' : 'Active Filter (APF):'}
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              {isApfActive ? 'Compensation 88%' : 'Bypass / Inactif'}
            </div>
          </div>
          <button
            onClick={() => setIsApfActive(!isApfActive)}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
              isApfActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isApfActive ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Grid: Harmonic Sliders and Live SVG Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Harmonic Orders Sliders */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-violet-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              {locale === 'fr' ? 'SPECTRE D’INJECTION HARMONIQUE (% I1)' : 'HARMONIC SPECTRUM INJECTION (% I1)'}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">I1 = {fundamentalCurrentA} A</span>
          </div>

          {/* Grid Base Sliders */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono">
            <div>
              <span className="text-slate-400">Tension Un (V) :</span>
              <input
                type="number"
                value={nominalVoltageV}
                onChange={(e) => setNominalVoltageV(Number(e.target.value))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-bold"
              />
            </div>
            <div>
              <span className="text-slate-400">Puissance Ssc (MVA) :</span>
              <input
                type="number"
                value={shortCircuitPowerMva}
                onChange={(e) => setShortCircuitPowerMva(Number(e.target.value))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-bold"
              />
            </div>
          </div>

          {/* Harmonic sliders list */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {harmonicBands.map((band) => (
              <div key={band.order} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: band.color }}
                    />
                    Rang {band.order} ({band.freq} Hz) :
                  </span>
                  <span className="font-bold text-white">
                    {band.val.toFixed(1)}% ({((fundamentalCurrentA * band.val) / 100).toFixed(1)} A)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="0.1"
                  value={band.val}
                  onChange={(e) => band.setVal(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>{band.note}</span>
                  <span>Max admissible IEEE: 5.0%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic SVG Bar Chart & Telemetry Summary */}
        <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-violet-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {locale === 'fr'
                ? 'HISTOGRAMME SPECTRAL FFT & GABARIT IEEE 519'
                : 'FFT SPECTRAL HISTOGRAM & IEEE 519 LIMITS'}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {isApfActive ? 'Spectre Atténué (APF Actif)' : 'Spectre Brut Non Filtré'}
            </span>
          </div>

          {/* Dynamic SVG Histogram */}
          <div className="relative w-full aspect-[16/9] max-h-[320px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-3">
            <svg viewBox="0 0 540 230" className="w-full h-full">
              {/* Axes & Grids */}
              <line x1="45" y1="20" x2="45" y2="190" stroke="#334155" strokeWidth="1" />
              <line x1="45" y1="190" x2="520" y2="190" stroke="#334155" strokeWidth="1" />
              <line x1="45" y1="105" x2="520" y2="105" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

              {/* Y labels */}
              <text x="40" y="25" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">100%</text>
              <text x="40" y="105" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">50%</text>
              <text x="40" y="190" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">0%</text>

              {/* IEEE 519 standard threshold line at 5% */}
              <line
                x1="45"
                y1={190 - (5 / 100) * 165}
                x2="520"
                y2={190 - (5 / 100) * 165}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <text x="515" y={190 - (5 / 100) * 165 - 4} fill="#f43f5e" fontSize="9" textAnchor="end" fontFamily="monospace">
                Limite IEEE 519 (5%)
              </text>

              {/* Fundamental h1 Bar */}
              <g>
                <rect x="55" y="25" width="30" height="165" fill="#10b981" rx="3" fillOpacity="0.85" />
                <text x="70" y="205" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">h1</text>
                <text x="70" y="20" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">100%</text>
              </g>

              {/* Harmonic Bars (either raw or APF-compensated) */}
              {harmonicBands.map((bar, i) => {
                const effectiveVal = isApfActive
                  ? (harmonicAnalytics.effSpectra as any)[`h${bar.order}`] || 0
                  : bar.val;
                const barWidth = 28;
                const x = 95 + i * 42;
                const barHeight = Math.min(165, (effectiveVal / 100) * 165);
                const y = 190 - barHeight;

                return (
                  <g key={bar.order}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={bar.color}
                      rx="3"
                      fillOpacity={isApfActive ? 0.9 : 0.75}
                    />
                    <text x={x + barWidth / 2} y="205" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      h{bar.order}
                    </text>
                    <text x={x + barWidth / 2} y={Math.max(15, y - 4)} fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">
                      {effectiveVal.toFixed(1)}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-400">Courant RMS Total :</span>
              <div className="text-base font-bold text-white mt-0.5">
                {harmonicAnalytics.effectiveIrmsA} A
              </div>
              <div className="text-[10px] text-slate-500">I1 Fondamental: {fundamentalCurrentA} A</div>
            </div>

            <div>
              <span className="text-slate-400">THD Courant (THDi) :</span>
              <div
                className={`text-base font-bold mt-0.5 ${
                  harmonicAnalytics.isCurrentCompliant ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {harmonicAnalytics.effectiveThdCurrentPct}%
              </div>
              <div className="text-[10px] text-slate-500">
                {isApfActive ? `Atténué de ${harmonicAnalytics.rawThdCurrentPct}%` : 'Sans compensation'}
              </div>
            </div>

            <div>
              <span className="text-slate-400">THD Tension (THDv) :</span>
              <div
                className={`text-base font-bold mt-0.5 ${
                  harmonicAnalytics.isVoltageCompliant ? 'text-cyan-400' : 'text-rose-400'
                }`}
              >
                {harmonicAnalytics.effectiveThdVoltagePct}%
              </div>
              <div className="text-[10px] text-slate-500">Limite PCC Enéo: &le; 5.0%</div>
            </div>

            <div>
              <span className="text-slate-400">Facteur K Calculé :</span>
              <div className="text-base font-bold text-violet-400 mt-0.5">
                K-{harmonicAnalytics.kFactorEffective}
              </div>
              <div className="text-[10px] text-slate-500">
                Classe: {harmonicAnalytics.recommendedKClass}
              </div>
            </div>
          </div>

          {/* Normative Compliance Assessment Box */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              harmonicAnalytics.isVoltageCompliant && harmonicAnalytics.isCurrentCompliant
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                : 'bg-amber-950/40 border-amber-800 text-amber-200'
            }`}
          >
            {harmonicAnalytics.isVoltageCompliant && harmonicAnalytics.isCurrentCompliant ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-bold font-mono">
                {harmonicAnalytics.isVoltageCompliant && harmonicAnalytics.isCurrentCompliant
                  ? locale === 'fr'
                    ? 'CONFORMITÉ CONTRACTUELLE IEEE 519-2022 VALIDÉE'
                    : 'IEEE 519-2022 COMPLIANCE VALIDATED'
                  : locale === 'fr'
                  ? 'NON-CONFORMITÉ : DÉPASSEMENT DES SEUILS HARMONIQUES AU PCC'
                  : 'NON-COMPLIANCE: HARMONIC THRESHOLD EXCEEDED AT PCC'}
              </div>
              <p className="text-slate-300">
                {harmonicAnalytics.isVoltageCompliant && harmonicAnalytics.isCurrentCompliant
                  ? locale === 'fr'
                    ? "L'injection harmonique globale reste sous le gabarit d'interconnexion SONATREL / Enéo (THDu < 5.0%). Le réseau BT est préservé des échauffements parasites."
                    : 'Total harmonic injection remains well within the SONATREL utility grid boundary (THDv < 5.0%). Distribution assets are safeguarded from harmonic heating.'
                  : locale === 'fr'
                  ? `La distorsion en tension calculée (${harmonicAnalytics.effectiveThdVoltagePct}%) dépasse le seuil légal de 5%. L'activation d'un filtre actif APF en Étape 3 est obligatoire.`
                  : `Calculated voltage distortion (${harmonicAnalytics.effectiveThdVoltagePct}%) breaches the 5% regulatory ceiling. Activation of an APF in Stage 3 is strongly required.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
