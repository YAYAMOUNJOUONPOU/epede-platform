// src/components/installations/HarmonicsAndPowerQualityAnalyzer.tsx
// EPEDE D06 - Harmonics, Power Quality & Neutral Conductor Surcharge Analyzer (IEEE 519 / EN 50160 / IEC 61000-3-2)
// Real-time Fourier synthesis, live waveform distortion oscilloscope, FFT spectrum, and neutral current sizing.

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity,
  Sliders,
  Zap,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

interface HarmonicsAndPowerQualityAnalyzerProps {
  locale: 'fr' | 'en';
}

export const HarmonicsAndPowerQualityAnalyzer: React.FC<HarmonicsAndPowerQualityAnalyzerProps> = ({
  locale
}) => {
  // Harmonic Amplitudes (as % of Fundamental)
  const [fundamentalAmps, setFundamentalAmps] = useState<number>(100); // In A
  const [h3, setH3] = useState<number>(35); // 3rd harmonic (triplen - single phase IT/LED)
  const [h5, setH5] = useState<number>(22); // 5th harmonic (6-pulse VFD rectifiers)
  const [h7, setH7] = useState<number>(12); // 7th harmonic
  const [h9, setH9] = useState<number>(8);  // 9th harmonic (triplen)
  const [h11, setH11] = useState<number>(6); // 11th harmonic
  const [h13, setH13] = useState<number>(4); // 13th harmonic

  // Filter Solutions
  const [isAhfActive, setIsAhfActive] = useState<boolean>(false);
  const [ahfTargetThd, setAhfTargetThd] = useState<number>(4); // Target 4% THD

  // Canvas ref for live oscilloscope
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Effective harmonics taking AHF into account
  const effectiveH = useMemo(() => {
    if (!isAhfActive) {
      return { h3, h5, h7, h9, h11, h13 };
    }
    // AHF actively mitigates non-linear harmonics down to target
    const damping = ahfTargetThd / 35;
    return {
      h3: h3 * damping,
      h5: h5 * damping,
      h7: h7 * damping,
      h9: h9 * damping,
      h11: h11 * damping,
      h13: h13 * damping
    };
  }, [isAhfActive, ahfTargetThd, h3, h5, h7, h9, h11, h13]);

  // Total Harmonic Distortion (THD_i) in %
  const totalThdI = useMemo(() => {
    const sumSquares =
      Math.pow(effectiveH.h3, 2) +
      Math.pow(effectiveH.h5, 2) +
      Math.pow(effectiveH.h7, 2) +
      Math.pow(effectiveH.h9, 2) +
      Math.pow(effectiveH.h11, 2) +
      Math.pow(effectiveH.h13, 2);
    return Math.sqrt(sumSquares);
  }, [effectiveH]);

  // RMS Current IRMS = I1 * sqrt(1 + THD^2)
  const rmsCurrent = useMemo(() => {
    return fundamentalAmps * Math.sqrt(1 + Math.pow(totalThdI / 100, 2));
  }, [fundamentalAmps, totalThdI]);

  // 3-Phase Neutral Current under triplen harmonics: In = 3 * sqrt(Ih3^2 + Ih9^2 + ...)
  const neutralCurrent = useMemo(() => {
    const triplenRmsAmps =
      fundamentalAmps * (Math.sqrt(Math.pow(effectiveH.h3 / 100, 2) + Math.pow(effectiveH.h9 / 100, 2)));
    // In a balanced 3-phase circuit, fundamental cancels out, triplen sum algebraically
    return 3 * triplenRmsAmps;
  }, [fundamentalAmps, effectiveH]);

  // Ratio IN / Iphase
  const neutralToPhaseRatio = useMemo(() => {
    return (neutralCurrent / fundamentalAmps) * 100;
  }, [neutralCurrent, fundamentalAmps]);

  // IEEE 519 Compliance Status
  const isIeee519Compliant = totalThdI <= 5.0;

  // Real-Time Animated Oscilloscope Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let timeOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw Grid
      ctx.strokeStyle = '#141E2E';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Reference Line
      ctx.strokeStyle = '#223249';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw Pure Fundamental (Dashed Sky Blue Reference)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const angle = ((x + timeOffset) / width) * 4 * Math.PI;
        const y = centerY - Math.sin(angle) * 70;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Draw Distorted Current Waveform (Bright Amber/Rose Solid)
      ctx.strokeStyle = isAhfActive ? '#10B981' : (totalThdI > 15 ? '#F43F5E' : '#F59E0B');
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const baseAngle = ((x + timeOffset) / width) * 4 * Math.PI;
        // Fourier synthesis: f(t) = sin(t) + h3*sin(3t) + h5*sin(5t) + ...
        let composite = Math.sin(baseAngle);
        composite += (effectiveH.h3 / 100) * Math.sin(3 * baseAngle);
        composite += (effectiveH.h5 / 100) * Math.sin(5 * baseAngle + Math.PI);
        composite += (effectiveH.h7 / 100) * Math.sin(7 * baseAngle);
        composite += (effectiveH.h9 / 100) * Math.sin(9 * baseAngle);
        composite += (effectiveH.h11 / 100) * Math.sin(11 * baseAngle + Math.PI);
        composite += (effectiveH.h13 / 100) * Math.sin(13 * baseAngle);

        const y = centerY - composite * 60;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      timeOffset = (timeOffset + 1.2) % width;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [effectiveH, totalThdI, isAhfActive]);

  return (
    <div className="p-5 rounded-2xl bg-[#080C14] border border-[#1E2738] space-y-5 font-mono text-xs">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
              IEEE 519 · EN 50160 · IEC 61000-3-2 · NF C 15-100 §523
            </span>
            <EvidenceTrustBadge
              type="VERIFIED_STANDARD"
              governingStandard="IEEE 519-2022 / IEC 61000-4-30 Class A"
              locale={locale}
            />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            {locale === 'fr'
              ? 'Analyseur d\'Harmoniques, Qualité d\'Énergie & Surcharge du Neutre'
              : 'Harmonics, Power Quality & Neutral Conductor Surcharge Analyzer'}
          </h2>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            {locale === 'fr'
              ? 'Synthétiseur de Fourier en temps réel, oscilloscope d\'onde déformée et dimensionnement du câble de neutre sous charges non-linéaires.'
              : 'Real-time Fourier synthesis, live distorted oscilloscope, and neutral sizing under non-linear loads.'}
          </p>
        </div>

        {/* Active Harmonic Filter (AHF) Toggle */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playSwitchClick();
            setIsAhfActive(!isAhfActive);
          }}
          className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isAhfActive
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              : 'bg-[#0E1522] text-slate-400 border-[#1E2638] hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAhfActive ? 'Filtre Actif AHF Actif (< 5% THD)' : 'Activer Filtre Actif (AHF)'}</span>
        </button>
      </div>

      {/* 2. Main Grid: Oscilloscope + FFT + Neutral Sizing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Oscilloscope Canvas & Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Live Canvas Box */}
          <div className="p-4 rounded-xl bg-[#05080E] border border-[#182030] space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                {locale === 'fr' ? 'Oscilloscope de Courant i(t) - Synthèse de Fourier' : 'Live Current Oscilloscope i(t)'}
              </span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-sky-400">
                  <span className="w-2.5 h-0.5 bg-sky-400 border border-dashed inline-block" />
                  Fondamental 50Hz
                </span>
                <span className={`flex items-center gap-1 font-bold ${isAhfActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className={`w-2.5 h-1 ${isAhfActive ? 'bg-emerald-500' : 'bg-amber-500'} inline-block rounded`} />
                  Courant Réel Déformé
                </span>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={540}
              height={200}
              className="w-full h-auto bg-[#030509] rounded-lg border border-[#131B27]"
            />
          </div>

          {/* Key Distortion Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl border ${isIeee519Compliant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
              <span className="text-[10px] text-slate-400 block">Taux Distorsion (THDi) :</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <strong className={`text-xl font-black ${isIeee519Compliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalThdI.toFixed(1)}%
                </strong>
                <span className="text-[9px] text-slate-400">{isIeee519Compliant ? 'Conforme IEEE 519' : 'Dépassement > 5%'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0E1522] border border-[#1E2738]">
              <span className="text-[10px] text-slate-400 block">Courant Efficace Vrai (RMS) :</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <strong className="text-xl font-black text-white">{rmsCurrent.toFixed(1)}</strong>
                <span className="text-[10px] text-slate-400">A</span>
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${neutralToPhaseRatio > 100 ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-[#0E1522] border-[#1E2738] text-slate-300'}`}>
              <span className="text-[10px] text-slate-400 block">Courant de Neutre (IN) :</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <strong className={`text-xl font-black ${neutralToPhaseRatio > 100 ? 'text-amber-400' : 'text-white'}`}>
                  {neutralCurrent.toFixed(1)} A
                </strong>
                <span className="text-[9px]">({neutralToPhaseRatio.toFixed(0)}% de Iph)</span>
              </div>
            </div>
          </div>

          {/* Neutral Sizing Prescription Alert */}
          <div className={`p-3 rounded-xl border space-y-1 ${
            neutralToPhaseRatio > 100
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-[11px]">
              {neutralToPhaseRatio > 100 ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              <span>
                {neutralToPhaseRatio > 100
                  ? (locale === 'fr' ? 'Prescription NF C 15-100 §523 : Surcharge Critique du Neutre (THD3 > 33%)' : 'Sizing Requirement: Neutral Surcharge Warning')
                  : (locale === 'fr' ? 'Dimensionnement Standard du Conducteur Neutre (Sn = Sph)' : 'Standard Neutral Sizing Validated')}
              </span>
            </div>
            <p className="text-[10px] font-sans text-slate-300 leading-relaxed">
              {neutralToPhaseRatio > 100
                ? (locale === 'fr'
                    ? 'Les harmoniques de rang 3 (et multiples) s\'additionnent en phase sur le conducteur neutre. Le câble de neutre doit être surdimensionné à 200% de la phase (Sn = 2 × Sph) ou protégé par un déclencheur 4P 4D avec protection du neutre renforcée.'
                    : 'Triplen harmonics sum in-phase in the neutral conductor. Double-sized neutral (Sn = 2 × Sph) or 4P 4D full electronic neutral protection is mandatory.')
                : (locale === 'fr'
                    ? 'Le courant de neutre reste inférieur au courant de phase nominal. Un conducteur neutre de section égale à la phase (Sn = Sph) est conforme.'
                    : 'Neutral current remains below phase current. Standard equal cross-section neutral (Sn = Sph) is compliant.')}
            </p>
          </div>

        </div>

        {/* Right: FFT Spectrum & Sliders (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-3.5">
          <span className="font-bold text-slate-200 text-[11px] block border-b border-[#1E2638] pb-1.5">
            {locale === 'fr' ? 'Spectre Harmonique FFT & Charges Génératrices' : 'Harmonic FFT Spectrum & Generators'}
          </span>

          {/* FFT Spectrum Visualizer */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 block">Spectre en Amplitude (% du Fondamental) :</span>
            <div className="grid grid-cols-6 gap-1.5 items-end h-28 p-2 rounded bg-[#060910] border border-[#182030]">
              {[
                { rank: 'H3', val: effectiveH.h3, color: 'bg-amber-500' },
                { rank: 'H5', val: effectiveH.h5, color: 'bg-cyan-500' },
                { rank: 'H7', val: effectiveH.h7, color: 'bg-purple-500' },
                { rank: 'H9', val: effectiveH.h9, color: 'bg-amber-600' },
                { rank: 'H11', val: effectiveH.h11, color: 'bg-sky-500' },
                { rank: 'H13', val: effectiveH.h13, color: 'bg-indigo-500' }
              ].map((bar) => {
                const heightPct = Math.min(100, Math.max(5, (bar.val / 60) * 100));
                return (
                  <div key={bar.rank} className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[8px] font-bold text-slate-300">{bar.val.toFixed(0)}%</span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-150 ${bar.color}`}
                    />
                    <span className="text-[9px] font-mono text-slate-400">{bar.rank}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Harmonic Sliders */}
          <div className="space-y-2 text-[10px]">
            {/* H3 */}
            <div>
              <div className="flex justify-between text-slate-300">
                <span>Rang 3 - 150 Hz (Serveurs, LED, Monophasé) :</span>
                <strong className="text-amber-400">{h3}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={h3}
                onChange={(e) => setH3(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* H5 */}
            <div>
              <div className="flex justify-between text-slate-300">
                <span>Rang 5 - 250 Hz (Variateurs VFD, Redresseurs) :</span>
                <strong className="text-cyan-400">{h5}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={h5}
                onChange={(e) => setH5(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* H7 */}
            <div>
              <div className="flex justify-between text-slate-300">
                <span>Rang 7 - 350 Hz (Onduleurs UPS) :</span>
                <strong className="text-purple-400">{h7}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                value={h7}
                onChange={(e) => setH7(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* H9 */}
            <div>
              <div className="flex justify-between text-slate-300">
                <span>Rang 9 - 450 Hz (Triplen résiduel) :</span>
                <strong className="text-amber-500">{h9}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={h9}
                onChange={(e) => setH9(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Mitigation Solutions Selector */}
          <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E2738] space-y-1.5 text-[10px]">
            <span className="font-bold text-slate-300 block">Solutions de Dépollution Harmonique :</span>
            <ul className="space-y-1 text-slate-400 font-sans">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>**Filtre Actif d'Harmoniques (AHF)** : Injection de courant en opposition de phase.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>**Selfs Anti-Harmoniques (Gradins APFC)** : Évite la résonance parallèle (fr = 189 Hz).</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>**Transformateurs K-Factor (K-13, K-20)** : Évacuation des pertes Foucault supplémentaires.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
