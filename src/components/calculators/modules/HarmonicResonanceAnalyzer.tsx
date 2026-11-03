// src/components/calculators/modules/HarmonicResonanceAnalyzer.tsx
// EPEDE 2.0: Interactive Harmonic Spectrum & Resonant Impedance Analyzer (IEEE 519-2022 / IEC 61000-3-6 / IEC 61642)
// Features: Frequency-Domain Impedance Scan Z(f) [50..1500 Hz], Parallel Anti-Resonance vs Series Detuning Notch,
// Harmonic Voltage Distortion Spectrum (Uh% Bare vs Detuned), True Power Factor, and K-Factor Inspector.

import React, { useState, useMemo, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Crosshair,
  BarChart3,
  Waves,
  Zap,
  RefreshCw,
  FileText,
} from 'lucide-react';
import {
  HarmonicResonanceEngine,
  CAMEROON_HARMONIC_PRESETS,
  type HarmonicResonanceInput,
  type HarmonicResonanceOutput,
  type DetuningFactorOption,
  type NonLinearLoadProfile,
} from '../../../data/harmonicResonanceEngine';

interface HarmonicResonanceAnalyzerProps {
  locale: 'fr' | 'en';
  initialPresetId?: string;
  onOpenReport?: () => void;
}

export const HarmonicResonanceAnalyzer: React.FC<HarmonicResonanceAnalyzerProps> = ({
  locale,
  initialPresetId = 'sabc-douala-tgbt',
  onOpenReport,
}) => {
  const isFr = locale === 'fr';

  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId);
  const initialPreset =
    CAMEROON_HARMONIC_PRESETS.find((p) => p.id === initialPresetId) ||
    CAMEROON_HARMONIC_PRESETS[0];

  const [input, setInput] = useState<HarmonicResonanceInput>(initialPreset.input);
  const [activeTab, setActiveTab] = useState<'IMPEDANCE_SCAN' | 'HARMONIC_SPECTRUM' | 'NORMATIVE_MATH'>('IMPEDANCE_SCAN');
  const [hoveredScanIndex, setHoveredScanIndex] = useState<number | null>(null);
  const svgScanRef = useRef<SVGSVGElement | null>(null);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') return;
    const found = CAMEROON_HARMONIC_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setInput(found.input);
    }
  };

  const results: HarmonicResonanceOutput = useMemo(() => {
    return HarmonicResonanceEngine.solve(input);
  }, [input]);

  // Handle mouse move over Z(f) frequency scan SVG
  const handleScanMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgScanRef.current) return;
    const rect = svgScanRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const svgX = (relX / rect.width) * 640;
    // Plot area X: [55 .. 615] -> width = 560
    const plotNormX = Math.max(0, Math.min(1, (svgX - 55) / 560));
    const idx = Math.round(plotNormX * (results.frequencyScan.length - 1));
    setHoveredScanIndex(idx);
  };

  // Active probe point on frequency scan
  const probePoint = useMemo(() => {
    if (hoveredScanIndex !== null && results.frequencyScan[hoveredScanIndex]) {
      return results.frequencyScan[hoveredScanIndex];
    }
    // Default to bare resonance peak or h=5 (250 Hz)
    const h5Idx = results.frequencyScan.findIndex((pt) => Math.abs(pt.harmonicOrder - 5.0) < 0.15);
    return results.frequencyScan[h5Idx >= 0 ? h5Idx : 16];
  }, [hoveredScanIndex, results.frequencyScan]);

  return (
    <div className="bg-[#0B131E] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 text-white font-sans">
      {/* 1. Header & Cameroon Industrial Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
              IEEE STD 519-2022 / CEI 61000-3-6 / CEI 61642
            </span>
            <span className="font-mono text-xs text-white/50">
              {isFr ? 'Analyse Spectrale & Impédance Résonante Z(f)' : 'Spectral & Resonant Impedance Z(f) Lab'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Waves className="w-6 h-6 text-cyan-400" />
            <span>
              {isFr
                ? 'Analyseur de Spectre Harmonique & Anti-Résonance LC Parallèle'
                : 'Harmonic Spectrum & Parallel LC Anti-Resonance Analyzer'}
            </span>
          </h2>
          <p className="text-xs text-white/70">
            {isFr
              ? 'Balayage fréquentiel Z(f) [50–1500 Hz], désaccordage par selfs anti-harmoniques (5.67%, 7%, 14%), facteur K transformateur et conformité IEEE 519.'
              : 'Frequency impedance scan Z(f) [50–1500 Hz], detuned reactor filtering (5.67%, 7%, 14%), transformer K-Factor, and IEEE 519 verification.'}
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-mono text-white/60">
            {isFr ? 'Site Industriel Cameroun :' : 'Cameroon Industrial Bus :'}
          </label>
          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-[#121E2C] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
          >
            {CAMEROON_HARMONIC_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {isFr ? preset.name.fr : preset.name.en}
              </option>
            ))}
            <option value="custom">⚙️ {isFr ? 'Configuration Personnalisée' : 'Custom Configuration'}</option>
          </select>
        </div>
      </div>

      {/* 2. Executive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        {/* Parallel Resonance Frequency */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] text-white/50 uppercase">
            {isFr ? 'Résonance LC Nue (fr)' : 'Bare LC Resonance (fr)'}
          </div>
          <div
            className={`text-xl font-black ${
              results.isSevereResonanceRiskBare ? 'text-rose-400' : 'text-amber-300'
            }`}
          >
            {results.naturalParallelResonanceFreqBareHz}{' '}
            <span className="text-xs font-normal text-white/50">Hz</span>
          </div>
          <div className="text-[9px] text-white/40">
            {isFr ? 'Rang' : 'Order'} h = {results.naturalParallelResonanceOrderBare} (×{results.maxAmplificationBare} amp)
          </div>
        </div>

        {/* Active Detuned Notch Frequency */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] text-white/50 uppercase">
            {isFr ? 'Accord Self Série (fs)' : 'Detuned Series Notch (fs)'}
          </div>
          <div className="text-xl font-black text-cyan-300">
            {results.seriesTuningFreqHz ? `${results.seriesTuningFreqHz}` : '—'}{' '}
            <span className="text-xs font-normal text-white/50">
              {results.seriesTuningFreqHz ? 'Hz' : (isFr ? 'Aucune' : 'None')}
            </span>
          </div>
          <div className="text-[9px] text-white/40">
            {input.detuningFactorP > 0
              ? `p = ${(input.detuningFactorP * 100).toFixed(2)}% (hs = ${results.seriesTuningOrder})`
              : (isFr ? 'Batterie nue (p = 0%)' : 'Bare capacitor (p = 0%)')}
          </div>
        </div>

        {/* Voltage THDu Active vs Bare */}
        <div
          className={`p-3.5 rounded-xl border space-y-1 ${
            results.isIeee519CompliantActive
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-rose-950/30 border-rose-500/40'
          }`}
        >
          <div className="text-[10px] uppercase text-white/60">
            {isFr ? 'Distorsion Tension (THDu)' : 'Voltage Distortion (THDu)'}
          </div>
          <div
            className={`text-xl font-black ${
              results.isIeee519CompliantActive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {results.thdVoltageActivePercent.toFixed(2)}%{' '}
            <span className="text-[10px] font-normal text-white/50">
              / {results.ieee519ThdVoltageLimitPercent.toFixed(1)}%
            </span>
          </div>
          <div className="text-[9px] text-white/50">
            {isFr ? 'Sans self :' : 'Bare bank :'} {results.thdVoltageBarePercent.toFixed(2)}%
          </div>
        </div>

        {/* Current THDi */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] text-white/50 uppercase">
            {isFr ? 'Distorsion Courant (THDi)' : 'Current Distortion (THDi)'}
          </div>
          <div className="text-xl font-black text-violet-300">
            {results.thdCurrentPercent.toFixed(1)}%
          </div>
          <div className="text-[9px] text-white/40">
            Isc/IL = {results.iscToIlRatio} · {input.nonLinearLoadSharePercent}% NL
          </div>
        </div>

        {/* True Power Factor */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] text-white/50 uppercase">
            {isFr ? 'Facteur Puissance Vrai' : 'True Power Factor'}
          </div>
          <div className="text-xl font-black text-emerald-300">
            {results.truePowerFactorAfter.toFixed(3)}
          </div>
          <div className="text-[9px] text-white/40">
            cos φ₁ = {results.displacementCosPhiAfter.toFixed(2)} ({results.qInstalledKvar} kvar)
          </div>
        </div>

        {/* Transformer K-Factor & IEEE 519 Verdict */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            results.isIeee519CompliantActive
              ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-900/30 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider">
            IEEE STD 519-2022
          </div>
          <div className="text-base font-black flex items-center gap-1.5">
            {results.isIeee519CompliantActive ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFr ? 'CONFORME' : 'COMPLIANT'}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{isFr ? 'HORS GABARIT' : 'NON-COMPLIANT'}</span>
              </>
            )}
          </div>
          <div className="text-[9px] opacity-80">
            K-Factor = {results.transformerKFactor} · Irms/I₁ = {results.capacitorRmsCurrentRatio}
          </div>
        </div>
      </div>

      {/* 3. Main Interactive Grid: Left 8 Cols (Plots) & Right 4 Cols (Probe + Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-4">
          {/* Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('IMPEDANCE_SCAN')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'IMPEDANCE_SCAN'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>{isFr ? 'Balayage Impédance Z(f) [50–1500 Hz]' : 'Impedance Scan Z(f) [50–1500 Hz]'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('HARMONIC_SPECTRUM')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'HARMONIC_SPECTRUM'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>{isFr ? 'Spectre Harmonique Uh(%) vs IEEE 519' : 'Harmonic Spectrum Uh(%) vs IEEE 519'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('NORMATIVE_MATH')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'NORMATIVE_MATH'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{isFr ? 'Équations & Facteur K' : 'Equations & K-Factor'}</span>
            </button>
          </div>

          {/* TAB 1: FREQUENCY-DOMAIN IMPEDANCE SCAN Z(f) */}
          {activeTab === 'IMPEDANCE_SCAN' && (
            <div className="rounded-2xl bg-[#070B12] border border-white/15 p-4 space-y-3 font-mono select-none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  <span>
                    {isFr
                      ? 'Survolez la courbe Z(f) pour inspecter le pic d’anti-résonance parallèle et le creux d’accord série'
                      : 'Hover over Z(f) to inspect the parallel anti-resonance peak and series detuning notch'}
                  </span>
                </div>
                <span className="text-[10px] text-cyan-400">
                  Qc = {results.qInstalledKvar} kvar · Ssc = {results.sscTotalMva} MVA
                </span>
              </div>

              {/* SVG Bode Magnitude Plot */}
              <div className="relative w-full aspect-[16/9] max-h-[380px] bg-[#0A0F18] rounded-xl border border-white/10 p-2">
                <svg
                  ref={svgScanRef}
                  viewBox="0 0 640 320"
                  className="w-full h-full cursor-crosshair text-[10px]"
                  onMouseMove={handleScanMouseMove}
                  onMouseLeave={() => setHoveredScanIndex(null)}
                >
                  {/* Axes & Grid Lines */}
                  <line x1="55" y1="20" x2="55" y2="270" stroke="#334155" strokeWidth="1.5" />
                  <line x1="55" y1="270" x2="615" y2="270" stroke="#334155" strokeWidth="1.5" />
                  <line x1="55" y1="195" x2="615" y2="195" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="55" y1="120" x2="615" y2="120" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="55" y1="45" x2="615" y2="45" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Unity Amplification Reference Line (1.0x) */}
                  <text x="48" y="273" fill="#94A3B8" textAnchor="end">0x</text>

                  {(() => {
                    const pts = results.frequencyScan;
                    const maxZ = Math.max(
                      ...pts.map((p) => Math.max(p.zBareCapBusOhm, p.zActiveBusOhm, p.zSysOhm)),
                      results.zSysFundamentalOhm * 12
                    );

                    const toX = (idx: number) => 55 + (idx / (pts.length - 1)) * 560;
                    const toY = (zVal: number) => 270 - Math.min(1, zVal / maxZ) * 240;

                    const sysLine = pts.map((p, i) => `${toX(i)},${toY(p.zSysOhm)}`).join(' ');
                    const bareLine = pts.map((p, i) => `${toX(i)},${toY(p.zBareCapBusOhm)}`).join(' ');
                    const activeLine = pts.map((p, i) => `${toX(i)},${toY(p.zActiveBusOhm)}`).join(' ');

                    // Characteristic harmonic vertical lines: h = 3, 5, 7, 11, 13, 17, 19, 23, 25
                    const charHarmonics = [3, 5, 7, 11, 13, 17, 19, 23, 25];

                    // Probe X coordinate
                    const activeIdx = pts.findIndex((p) => p.freqHz === probePoint.freqHz);
                    const probeX = toX(activeIdx >= 0 ? activeIdx : 0);

                    return (
                      <g>
                        {/* Y-axis impedance labels (mOhm or Ohm) */}
                        <text x="48" y="48" fill="#94A3B8" textAnchor="end">
                          {maxZ < 1 ? `${(maxZ * 1000).toFixed(0)}mΩ` : `${maxZ.toFixed(2)}Ω`}
                        </text>
                        <text x="48" y="123" fill="#94A3B8" textAnchor="end">
                          {maxZ < 1 ? `${(maxZ * 660).toFixed(0)}mΩ` : `${(maxZ * 0.66).toFixed(2)}Ω`}
                        </text>
                        <text x="48" y="198" fill="#94A3B8" textAnchor="end">
                          {maxZ < 1 ? `${(maxZ * 330).toFixed(0)}mΩ` : `${(maxZ * 0.33).toFixed(2)}Ω`}
                        </text>

                        {/* Characteristic Harmonic Order Markers */}
                        {charHarmonics.map((hOrder) => {
                          const hIdx = pts.findIndex((p) => Math.abs(p.harmonicOrder - hOrder) < 0.13);
                          if (hIdx < 0) return null;
                          const hx = toX(hIdx);
                          return (
                            <g key={`h-mark-${hOrder}`}>
                              <line
                                x1={hx}
                                y1="20"
                                x2={hx}
                                y2="270"
                                stroke={hOrder === 5 || hOrder === 7 ? '#F59E0B' : '#1E293B'}
                                strokeWidth={hOrder === 5 || hOrder === 7 ? '1.2' : '1'}
                                strokeDasharray="3 3"
                                opacity={hOrder === 5 || hOrder === 7 ? '0.6' : '0.4'}
                              />
                              <text
                                x={hx}
                                y="286"
                                fill={hOrder === 5 || hOrder === 7 ? '#FBBF24' : '#64748B'}
                                fontSize="9"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                H{hOrder}
                              </text>
                              <text
                                x={hx}
                                y="298"
                                fill="#475569"
                                fontSize="8"
                                textAnchor="middle"
                              >
                                {hOrder * input.fundamentalFreqHz}Hz
                              </text>
                            </g>
                          );
                        })}

                        {/* Series Detuning Notch Marker fs */}
                        {results.seriesTuningOrder && (
                          (() => {
                            const sIdx = pts.findIndex(
                              (p) => Math.abs(p.harmonicOrder - results.seriesTuningOrder!) < 0.2
                            );
                            if (sIdx < 0) return null;
                            const sx = toX(sIdx);
                            return (
                              <g>
                                <line
                                  x1={sx}
                                  y1="25"
                                  x2={sx}
                                  y2="270"
                                  stroke="#06B6D4"
                                  strokeWidth="1.5"
                                  strokeDasharray="4 2"
                                />
                                <text
                                  x={sx + 4}
                                  y="34"
                                  fill="#22D3EE"
                                  fontSize="9"
                                  fontWeight="bold"
                                >
                                  fs = {results.seriesTuningFreqHz} Hz
                                </text>
                              </g>
                            );
                          })()
                        )}

                        {/* 1. Uncompensated Inductive Grid Z_sys(f) */}
                        <polyline
                          fill="none"
                          stroke="#94A3B8"
                          strokeWidth="1.8"
                          strokeDasharray="5 3"
                          points={sysLine}
                        />

                        {/* 2. Bare Capacitor Bank Parallel Resonance Curve Z_bare(f) */}
                        <polyline
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth="2.2"
                          opacity="0.85"
                          points={bareLine}
                        />

                        {/* 3. Active Detuned Capacitor Bank Curve Z_active(f) */}
                        <polyline
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.8"
                          points={activeLine}
                        />

                        {/* Interactive Cursor Line & Dots */}
                        <line
                          x1={probeX}
                          y1="20"
                          x2={probeX}
                          y2="270"
                          stroke="#38BDF8"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx={probeX}
                          cy={toY(probePoint.zBareCapBusOhm)}
                          r="4"
                          fill="#F43F5E"
                          stroke="#FFFFFF"
                          strokeWidth="1"
                        />
                        <circle
                          cx={probeX}
                          cy={toY(probePoint.zActiveBusOhm)}
                          r="4.5"
                          fill="#10B981"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />

                        {/* Legend Box */}
                        <g transform="translate(360, 22)">
                          <rect width="248" height="58" rx="8" fill="#0B131E" stroke="#1E293B" opacity="0.92" />
                          <line x1="10" y1="15" x2="32" y2="15" stroke="#F43F5E" strokeWidth="2.2" />
                          <text x="38" y="18" fill="#FDA4AF" fontSize="9">
                            {isFr ? 'Batterie Nue (p=0% — Pic Résonance)' : 'Bare Bank (p=0% — Resonance Spike)'}
                          </text>

                          <line x1="10" y1="32" x2="32" y2="32" stroke="#10B981" strokeWidth="2.8" />
                          <text x="38" y="35" fill="#6EE7B7" fontSize="9">
                            {isFr
                              ? `Avec Self Active (p=${(input.detuningFactorP * 100).toFixed(2)}%)`
                              : `Active Detuned Bank (p=${(input.detuningFactorP * 100).toFixed(2)}%)`}
                          </text>

                          <line x1="10" y1="48" x2="32" y2="48" stroke="#94A3B8" strokeWidth="1.8" strokeDasharray="4 2" />
                          <text x="38" y="51" fill="#CBD5E1" fontSize="9">
                            {isFr ? 'Impédance Réseau Amont Z_sys(f)' : 'Uncompensated Grid Z_sys(f)'}
                          </text>
                        </g>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Advisory Banner */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white/80 space-y-1 font-sans">
                {results.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isFr ? rec.fr : rec.en}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HARMONIC SPECTRUM BAR CHART & TABLE */}
          {activeTab === 'HARMONIC_SPECTRUM' && (
            <div className="rounded-2xl bg-[#070B12] border border-white/15 p-5 space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  {isFr
                    ? 'Spectre de Tension Harmonique Individuel Uh(%) : Batterie Nue vs Désaccordée'
                    : 'Individual Harmonic Voltage Spectrum Uh(%): Bare vs Detuned Bank'}
                </span>
                <span className="text-[10px] text-emerald-400">
                  {isFr ? 'Limite individuelle IEEE 519 :' : 'IEEE 519 Individual Limit:'}{' '}
                  {results.harmonicSpectrum[0]?.ieee519VoltageLimitPercent.toFixed(1)}%
                </span>
              </div>

              {/* Bar Chart SVG */}
              <div className="relative w-full aspect-[2.2/1] max-h-[260px] bg-[#0A0F18] rounded-xl border border-white/10 p-3">
                <svg viewBox="0 0 600 220" className="w-full h-full text-[10px]">
                  <line x1="45" y1="15" x2="45" y2="185" stroke="#334155" strokeWidth="1.5" />
                  <line x1="45" y1="185" x2="580" y2="185" stroke="#334155" strokeWidth="1.5" />

                  {(() => {
                    const spec = results.harmonicSpectrum;
                    const limitPct = spec[0]?.ieee519VoltageLimitPercent || 5.0;
                    const yMaxPct = Math.max(
                      limitPct * 1.6,
                      ...spec.map((s) => Math.max(s.voltagePercentBare, s.voltagePercentActive))
                    );

                    const toY = (pct: number) => 185 - Math.min(1, pct / yMaxPct) * 160;
                    const limitY = toY(limitPct);
                    const colWidth = 520 / spec.length;

                    return (
                      <g>
                        {/* Y-axis labels */}
                        <text x="38" y="25" fill="#94A3B8" textAnchor="end">{yMaxPct.toFixed(1)}%</text>
                        <text x="38" y={limitY + 3} fill="#F43F5E" textAnchor="end">{limitPct.toFixed(1)}%</text>
                        <text x="38" y="188" fill="#94A3B8" textAnchor="end">0%</text>

                        {/* IEEE 519 Individual Limit Line */}
                        <line
                          x1="45"
                          y1={limitY}
                          x2="580"
                          y2={limitY}
                          stroke="#F43F5E"
                          strokeWidth="1.5"
                          strokeDasharray="5 3"
                        />
                        <text x="575" y={limitY - 5} fill="#F43F5E" fontSize="9" textAnchor="end" fontWeight="bold">
                          IEEE 519 Max ({limitPct.toFixed(1)}%)
                        </text>

                        {/* Bars for each harmonic order */}
                        {spec.map((item, idx) => {
                          const cx = 55 + idx * colWidth + colWidth / 2;
                          const yBare = toY(item.voltagePercentBare);
                          const yActive = toY(item.voltagePercentActive);
                          return (
                            <g key={item.order}>
                              {/* Bare Bar (Rose) */}
                              <rect
                                x={cx - 13}
                                y={yBare}
                                width="11"
                                height={Math.max(2, 185 - yBare)}
                                rx="2"
                                fill="#F43F5E"
                                opacity="0.75"
                              />
                              {/* Active Detuned Bar (Emerald) */}
                              <rect
                                x={cx + 1}
                                y={yActive}
                                width="11"
                                height={Math.max(2, 185 - yActive)}
                                rx="2"
                                fill={item.isCompliantActive ? '#10B981' : '#F59E0B'}
                              />
                              <text x={cx} y="200" fill="#E2E8F0" fontWeight="bold" textAnchor="middle">
                                H{item.order}
                              </text>
                              <text x={cx} y="212" fill="#64748B" fontSize="8" textAnchor="middle">
                                {item.freqHz}Hz
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Harmonic Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase text-[10px]">
                      <th className="py-2 px-2">{isFr ? 'Rang (f)' : 'Order (f)'}</th>
                      <th className="py-2 px-2">Ih (% I₁)</th>
                      <th className="py-2 px-2">Ih (A)</th>
                      <th className="py-2 px-2">{isFr ? 'Uh Nue (%)' : 'Uh Bare (%)'}</th>
                      <th className="py-2 px-2">{isFr ? 'Uh Active (%)' : 'Uh Active (%)'}</th>
                      <th className="py-2 px-2">{isFr ? 'Amplification' : 'Amp Factor'}</th>
                      <th className="py-2 px-2">{isFr ? 'Statut IEEE 519' : 'IEEE 519 Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {results.harmonicSpectrum.map((row) => (
                      <tr key={row.order} className="hover:bg-white/[0.02]">
                        <td className="py-1.5 px-2 font-bold text-cyan-300">
                          H{row.order} ({row.freqHz} Hz)
                        </td>
                        <td className="py-1.5 px-2">{row.currentPercentOfI1}%</td>
                        <td className="py-1.5 px-2 text-white/70">{row.currentAmps} A</td>
                        <td className="py-1.5 px-2 text-rose-300">{row.voltagePercentBare}%</td>
                        <td className="py-1.5 px-2 font-bold text-emerald-300">{row.voltagePercentActive}%</td>
                        <td className="py-1.5 px-2 text-amber-300">×{row.amplificationActive}</td>
                        <td className="py-1.5 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              row.isCompliantActive
                                ? 'bg-emerald-500/15 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {row.isCompliantActive ? 'OK' : 'EXCEEDS'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: NORMATIVE EQUATIONS */}
          {activeTab === 'NORMATIVE_MATH' && (
            <div className="rounded-2xl bg-[#070B12] border border-white/15 p-5 space-y-4 font-mono text-xs">
              <div className="text-cyan-400 font-bold border-b border-white/10 pb-2 flex items-center justify-between">
                <span>
                  {isFr
                    ? 'Formulations Physiques Normalisées (IEEE 519 / CEI 61642 / IEEE C57.110)'
                    : 'Normative Physics Formulations (IEEE 519 / IEC 61642 / IEEE C57.110)'}
                </span>
                <span className="text-[10px] text-white/50">50 Hz / 60 Hz</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-cyan-300 font-bold">1. Rang d’Anti-Résonance Parallèle Nue (hr) :</div>
                  <div className="text-emerald-300">hr = √(Ssc / Qc) · fr = f₁ · hr</div>
                  <div className="text-white/60">
                    = √({(results.sscTotalMva * 1000).toFixed(0)} kVA / {results.qInstalledKvar} kvar) = {results.naturalParallelResonanceOrderBare}
                  </div>
                  <div className="text-amber-300 font-bold">
                    fr,nue = {results.naturalParallelResonanceFreqBareHz} Hz
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-cyan-300 font-bold">2. Fréquence d’Accord Série de la Self (fs) :</div>
                  <div className="text-emerald-300">hs = 1 / √p · fs = f₁ / √p</div>
                  <div className="text-white/60">
                    p = {(input.detuningFactorP * 100).toFixed(2)}% · U_cap_nom ≥ U / (1 - p)
                  </div>
                  <div className="text-cyan-300 font-bold">
                    fs = {results.seriesTuningFreqHz ? `${results.seriesTuningFreqHz} Hz` : 'N/A'} · U_cap = {results.capacitorRatedVoltageRecommendedV} V
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-cyan-300 font-bold">3. Facteur de Puissance Vrai (PF_true) :</div>
                  <div className="text-emerald-300">PF_true = cos(φ₁) / √(1 + (THDi / 100)²)</div>
                  <div className="text-white/60">
                    = {results.displacementCosPhiAfter} / √(1 + ({results.thdCurrentPercent / 100})²)
                  </div>
                  <div className="text-emerald-400 font-bold">
                    PF_true = {results.truePowerFactorAfter}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-cyan-300 font-bold">4. Facteur K Transformateur (IEEE C57.110) :</div>
                  <div className="text-emerald-300">K = ∑ (Ih / Irms)² · h²</div>
                  <div className="text-white/60">
                    Surcharge courant condensateur Irms/I₁ = {results.capacitorRmsCurrentRatio} (Max CEI 60831 = 1.30)
                  </div>
                  <div className="text-violet-300 font-bold">
                    K-Factor = {results.transformerKFactor}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Frequency Probe & Interactive Parameter Controls */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          {/* A. Live Frequency Probe Inspector */}
          <div className="p-4 rounded-2xl bg-[#0E1724] border border-cyan-500/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                {isFr ? 'Sondeur Fréquentiel Z(f)' : 'Frequency Impedance Probe'}
              </span>
              <span className="text-[10px] text-amber-300 font-bold">
                f = {probePoint.freqHz} Hz (h = {probePoint.harmonicOrder})
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-white/60">{isFr ? 'Impédance réseau seul |Z_sys| :' : 'Grid impedance |Z_sys|:'}</span>
                <span className="font-bold text-white">
                  {(probePoint.zSysOhm * 1000).toFixed(2)} mΩ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">{isFr ? 'Impédance batterie nue |Z_nue| :' : 'Bare bank |Z_bare|:'}</span>
                <span className="font-bold text-rose-400">
                  {(probePoint.zBareCapBusOhm * 1000).toFixed(2)} mΩ (×{probePoint.amplificationFactorBare})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">{isFr ? 'Impédance désaccordée |Z_act| :' : 'Detuned bank |Z_act|:'}</span>
                <span className="font-bold text-emerald-400">
                  {(probePoint.zActiveBusOhm * 1000).toFixed(2)} mΩ (×{probePoint.amplificationFactorActive})
                </span>
              </div>
            </div>

            <div
              className={`p-2 rounded-xl text-center font-bold text-[10px] ${
                probePoint.amplificationFactorActive <= 1.25
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
              }`}
            >
              {probePoint.amplificationFactorActive <= 1.0
                ? (isFr ? '✅ ATTÉNUATION HARMONIQUE ACTIVE (< 1.0x)' : '✅ ACTIVE HARMONIC ATTENUATION (< 1.0x)')
                : probePoint.amplificationFactorActive <= 1.5
                ? (isFr ? '✅ RÉGIME INDUCTIF STABLE (SANS RÉSONANCE)' : '✅ STABLE INDUCTIVE REGIME')
                : (isFr ? '⚠️ ZONE D’AMPLIFICATION RÉSONANTE' : '⚠️ RESONANT AMPLIFICATION ZONE')}
            </div>
          </div>

          {/* B. Interactive Controls */}
          <div className="p-4 rounded-2xl bg-[#09101A] border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                {isFr ? 'Paramètres Réseau & Filtre' : 'Grid & Filter Controls'}
              </span>
              <button
                type="button"
                onClick={() => handleSelectPreset(selectedPresetId)}
                className="text-[10px] text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isFr ? 'Défaut' : 'Reset'}</span>
              </button>
            </div>

            <div className="space-y-3 text-[11px]">
              {/* Detuning Factor Selector */}
              <div>
                <label className="text-white/60 text-[10px] block mb-1">
                  {isFr ? 'Taux de désaccordage self (p) :' : 'Detuning Reactor Factor (p):'}
                </label>
                <select
                  value={input.detuningFactorP}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      detuningFactorP: parseFloat(e.target.value) as DetuningFactorOption,
                    })
                  }
                  className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold focus:outline-none"
                >
                  <option value={0}>0% — {isFr ? 'Batterie Nue (Risque Résonance)' : 'Bare Bank (Resonance Risk)'}</option>
                  <option value={0.0567}>5.67% — {isFr ? 'Accord 210 Hz (hs = 4.20)' : '210 Hz Tuning (hs = 4.20)'}</option>
                  <option value={0.07}>7.0% — {isFr ? 'Accord 189 Hz (Standard H5/H7)' : '189 Hz Standard (H5/H7)'}</option>
                  <option value={0.14}>14.0% — {isFr ? 'Accord 134 Hz (Anti-Rang 3)' : '134 Hz Tuning (Blocks H3)'}</option>
                </select>
              </div>

              {/* Non-Linear Load Profile */}
              <div>
                <label className="text-white/60 text-[10px] block mb-1">
                  {isFr ? 'Typologie de charge polluante :' : 'Non-Linear Load Profile:'}
                </label>
                <select
                  value={input.loadProfile}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      loadProfile: e.target.value as NonLinearLoadProfile,
                    })
                  }
                  className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1.5 text-cyan-300 font-bold focus:outline-none"
                >
                  <option value="6-pulse-vfd">
                    {isFr ? 'Variateurs PWM 6-Pulses (H5, H7 dominants)' : '6-Pulse PWM VFDs (Dominant H5, H7)'}
                  </option>
                  <option value="12-pulse-rectifier">
                    {isFr ? 'Redresseur 12-Pulses Électrolyse (H11, H13)' : '12-Pulse Smelter Rectifier (H11, H13)'}
                  </option>
                  <option value="arc-furnace">
                    {isFr ? 'Four à Arc & Sidérurgie (H3, H5, H7)' : 'Electric Arc Furnace (H3, H5, H7)'}
                  </option>
                  <option value="ups-datacenter">
                    {isFr ? 'Data Center / Onduleurs (Fort H3 Neutre)' : 'Data Center / UPS (High H3)'}
                  </option>
                </select>
              </div>

              {/* Active Power & Transformer Rating */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-white/60 text-[10px]">{isFr ? 'Puissance P (kW) :' : 'Active Load P (kW):'}</label>
                  <input
                    type="number"
                    min={50}
                    max={50000}
                    step={50}
                    value={input.activePowerKw}
                    onChange={(e) =>
                      setInput({ ...input, activePowerKw: parseFloat(e.target.value) || 500 })
                    }
                    className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1 text-emerald-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-[10px]">{isFr ? 'Transfo Sn (kVA) :' : 'Trafo Sn (kVA):'}</label>
                  <input
                    type="number"
                    min={100}
                    max={63000}
                    step={100}
                    value={input.supplyTrafoKva}
                    onChange={(e) =>
                      setInput({ ...input, supplyTrafoKva: parseFloat(e.target.value) || 1000 })
                    }
                    className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1 text-emerald-300 font-bold"
                  />
                </div>
              </div>

              {/* Non-Linear Load Share Slider */}
              <div>
                <div className="flex justify-between text-[10px] text-white/60 mb-1">
                  <span>{isFr ? 'Part de charge non-linéaire :' : 'Non-Linear Load Share:'}</span>
                  <span className="text-violet-300 font-bold">{input.nonLinearLoadSharePercent}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  step={5}
                  value={input.nonLinearLoadSharePercent}
                  onChange={(e) =>
                    setInput({ ...input, nonLinearLoadSharePercent: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-violet-400"
                />
              </div>
            </div>

            {onOpenReport && (
              <button
                type="button"
                onClick={onOpenReport}
                className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>{isFr ? 'Éditer Dossier PFC & Harmoniques PDF' : 'Generate PFC & Harmonics PDF'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

