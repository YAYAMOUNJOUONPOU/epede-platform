// src/components/common/Iec60909FaultCalculatorCard.tsx
// EPEDE Wave 2: Interactive IEC 60909 Short-Circuit & Earthing Regime (SLT) Analyzer
// Calculates symmetrical 3-phase, 2-phase, and single line-to-ground faults with earthing impedance variation.

import React, { useState } from 'react';
import { Iec60909Engine, Iec60909FaultResult } from '../../data/iec60909Engine';
import { EarthingRegime } from '../../types/epede';
import {
  Zap,
  Sliders,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
} from 'lucide-react';

interface Iec60909FaultCalculatorCardProps {
  locale: 'fr' | 'en';
  nodeId?: string;
  nominalVoltageKv?: number;
  initialRegime?: EarthingRegime;
}

export const Iec60909FaultCalculatorCard: React.FC<Iec60909FaultCalculatorCardProps> = ({
  locale,
  nodeId = 'node-bus-30-oyomabang',
  nominalVoltageKv = 30.0,
  initialRegime = 'NGR',
}) => {
  const [selectedRegime, setSelectedRegime] = useState<EarthingRegime>(initialRegime);
  const [ngrResistance, setNgrResistance] = useState<number>(433); // 433 Ohm limits to 40 A at 30 kV

  const faultResult: Iec60909FaultResult = Iec60909Engine.calculateFault(
    nodeId,
    nominalVoltageKv,
    selectedRegime,
    selectedRegime === 'NGR' ? ngrResistance : undefined
  );

  const earthingRegimesList: EarthingRegime[] = [
    'Solid',
    'NGR',
    'Petersen',
    'Isolated',
    'TT',
    'TN-S',
    'IT',
  ];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {locale === 'fr'
                ? 'Calculateur de Court-Circuit CEI 60909 & Régime de Neutre (SLT)'
                : 'IEC 60909 Short-Circuit & Earthing Regime Calculator'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {locale === 'fr'
                ? 'Courants de court-circuit symétriques et asymétriques selon la norme internationale CEI 60909'
                : 'Symmetrical and asymmetrical fault currents according to international standard IEC 60909'}
            </p>
          </div>
        </div>

        {/* Regime Selector */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-300 font-medium">
            {locale === 'fr' ? 'Régime SLT :' : 'Earthing Regime:'}
          </span>
          <select
            value={selectedRegime}
            onChange={(e) => setSelectedRegime(e.target.value as EarthingRegime)}
            className="bg-slate-950 text-emerald-400 font-bold border border-emerald-800/80 rounded px-2 py-1 focus:outline-none cursor-pointer"
          >
            {earthingRegimesList.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* NGR Resistance Slider (if NGR active) */}
      {selectedRegime === 'NGR' && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-xl text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>
              {locale === 'fr'
                ? 'Résistance de limitation de neutre (R_N) :'
                : 'Neutral Grounding Resistor (R_N):'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={50}
              max={1000}
              step={25}
              value={ngrResistance}
              onChange={(e) => setNgrResistance(Number(e.target.value))}
              className="w-36 accent-emerald-500 cursor-pointer"
            />
            <span className="font-mono font-bold text-emerald-300 min-w-[70px]">
              {ngrResistance} Ω
            </span>
            <span className="text-[11px] text-slate-400">
              (I_limite ≈ {((nominalVoltageKv * 1000) / (Math.sqrt(3) * ngrResistance)).toFixed(1)} A)
            </span>
          </div>
        </div>
      )}

      {/* Key Fault Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Ik'' Symmetrical 3-phase */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-mono">
            {locale === 'fr' ? 'Court-Circuit Tri (Ik")' : '3-Phase Fault (Ik")'}
          </span>
          <span className="text-base font-bold text-red-400 font-mono">
            {faultResult.ik3PhaseKa} kA
          </span>
          <span className="text-[10px] text-slate-500 block">S = {faultResult.skMva} MVA</span>
        </div>

        {/* 2. ip Peak Dynamic Current */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-mono">
            {locale === 'fr' ? 'Courant Crête (ip)' : 'Peak Current (ip)'}
          </span>
          <span className="text-base font-bold text-amber-400 font-mono">
            {faultResult.ipPeakKa} kA
          </span>
          <span className="text-[10px] text-slate-500 block">κ = {faultResult.kappaFactor}</span>
        </div>

        {/* 3. Ib Breaking Current */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-mono">
            {locale === 'fr' ? 'Courant Coupure (Ib)' : 'Breaking (Ib)'}
          </span>
          <span className="text-base font-bold text-purple-400 font-mono">
            {faultResult.ibBreakingKa} kA
          </span>
          <span className="text-[10px] text-slate-500 block">t_break = 50 ms</span>
        </div>

        {/* 4. Ik2 Biphase Fault */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-mono">
            {locale === 'fr' ? 'Court-Circuit Biphasé (Ik2)' : 'Phase-to-Phase (Ik2)'}
          </span>
          <span className="text-base font-bold text-blue-400 font-mono">
            {faultResult.ik2PhaseKa} kA
          </span>
          <span className="text-[10px] text-slate-500 block">√3/2 × Ik"</span>
        </div>

        {/* 5. Ik1 Single Phase-to-Earth */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-mono">
            {locale === 'fr' ? 'Défaut Terre (Ik1)' : 'Earth Fault (Ik1)'}
          </span>
          <span className="text-base font-bold text-emerald-400 font-mono">
            {faultResult.ik1EarthKa < 1
              ? `${(faultResult.ik1EarthKa * 1000).toFixed(1)} A`
              : `${faultResult.ik1EarthKa.toFixed(2)} kA`}
          </span>
          <span className="text-[10px] text-slate-500 block">SLT: {faultResult.earthingRegime}</span>
        </div>

        {/* 6. Healthy Phase Overvoltage Ke */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-mono">
            {locale === 'fr' ? 'Surtension Phases Saines' : 'Healthy Overvoltage'}
          </span>
          <span className="text-base font-bold text-cyan-400 font-mono">
            {faultResult.healthyPhaseOvervoltageFactor} × Un
          </span>
          <span className="text-[10px] text-slate-500 block">
            {faultResult.healthyPhaseOvervoltageFactor > 1.4 ? 'Déclassement isolement' : 'Facteur terre maîtrisé'}
          </span>
        </div>
      </div>

      {/* Safety Analysis & Electrical Protection Recommendations */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>{locale === 'fr' ? 'Diagnostic de Sécurité & Tenue Thermique / Électrodynamique' : 'Safety & Electrodynamic Audit'}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {faultResult.safetyImplication[locale]}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
          <span className="text-slate-400">{locale === 'fr' ? 'Protections associées :' : 'Protections:'}</span>
          {faultResult.governingProtections.map((p) => (
            <span key={p} className="px-2 py-0.5 rounded bg-slate-950 text-red-300 border border-red-900/50">
              {p}
            </span>
          ))}
          <span className="text-slate-400 ml-auto">
            R/X = {faultResult.rxRatio} • c_factor = {faultResult.cFactor}
          </span>
        </div>
      </div>
    </div>
  );
};
