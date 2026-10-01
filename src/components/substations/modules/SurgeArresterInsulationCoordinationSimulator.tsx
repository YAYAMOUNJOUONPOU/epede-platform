// src/components/substations/modules/SurgeArresterInsulationCoordinationSimulator.tsx
// EPEDE Substation High-Voltage Surge Arresters (ANSI 28 / CEI 60099-4 Metal Oxide Surge Arresters - MOSA)
// Non-Linear Zinc Oxide (ZnO) V-I Characteristic, Traveling Wave Reflection, Energy Absorption (kJ/kV) & Basic Lightning Impulse Insulation (BIL / CEI 60071-1)

import React, { useState, useMemo } from 'react';
import {
  Zap,
  ShieldAlert,
  Activity,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Gauge,
  Layers,
  RotateCcw,
  Sparkles,
  Info,
  Flame,
  Waves,
  Maximize2
} from 'lucide-react';

interface SurgeArresterInsulationCoordinationSimulatorProps {
  locale: 'fr' | 'en';
}

type ArresterCondition = 'HEALTHY_NORMAL' | 'MOISTURE_INGRESS' | 'THERMAL_RUNAWAY_RISK';
type SurgeImpulseType = 'LIGHTNING_1_2_50' | 'SWITCHING_250_2500';
type ArresterEnergyClass = 'CLASS_1_LIGHT' | 'CLASS_2_MEDIUM' | 'CLASS_3_HEAVY' | 'CLASS_4_STATION_HIGH';

export const SurgeArresterInsulationCoordinationSimulator: React.FC<SurgeArresterInsulationCoordinationSimulatorProps> = ({
  locale
}) => {
  // Grid Voltage & Impulse Parameters
  const [continuousVoltageKv, setContinuousVoltageKv] = useState<number>(225.0); // Nominal 225 kV RMS phase-to-phase
  const [impulseType, setImpulseType] = useState<SurgeImpulseType>('LIGHTNING_1_2_50');
  const [lightningSurgeCurrentKa, setLightningSurgeCurrentKa] = useState<number>(10.0); // Standard 10 kA (8/20 µs waveform)
  const [distanceToTransformerMeters, setDistanceToTransformerMeters] = useState<number>(8.0); // Separation distance (meters)
  const [surgeWavefrontSteepnessKvPerUs, setSurgeWavefrontSteepnessKvPerUs] = useState<number>(1200); // 1200 kV/µs steep lightning wavefront
  const [arresterEnergyClass, setArresterEnergyClass] = useState<ArresterEnergyClass>('CLASS_4_STATION_HIGH');

  // Arrester Health & Degradation State
  const [arresterCondition, setArresterCondition] = useState<ArresterCondition>('HEALTHY_NORMAL');

  // Transformer Insulation Rating (IEC 60071-1 Standard Ratings for 245 kV Highest Equipment Voltage)
  const transformerBilKvPeak = 1050; // Basic Lightning Impulse Insulation Level (BIL) = 1050 kV peak
  const transformerSilKvPeak = 850; // Switching Impulse Level (SIL) = 850 kV peak
  const targetWithstandPeak = impulseType === 'LIGHTNING_1_2_50' ? transformerBilKvPeak : transformerSilKvPeak;

  // Metal-Oxide Surge Arrester (MOSA) Ratings (IEC 60099-4 series for 245 kV systems)
  const ratedVoltageUrKv = 198.0; // Ur = 198 kV (10s TOV withstand)
  const continuousOperatingVoltageUckv = 158.0; // Uc / MCOV = 158 kV (phase-to-ground RMS = 245 / sqrt(3) ~ 141.5 kV)

  // Energy absorption capability in kJ/kV_Ur by IEC class
  const classEnergyRatingKjPerKv = useMemo(() => {
    switch (arresterEnergyClass) {
      case 'CLASS_1_LIGHT': return 2.5;
      case 'CLASS_2_MEDIUM': return 4.5;
      case 'CLASS_3_HEAVY': return 7.0;
      case 'CLASS_4_STATION_HIGH': return 10.0;
    }
  }, [arresterEnergyClass]);

  const maxTotalEnergyKj = ratedVoltageUrKv * classEnergyRatingKjPerKv;

  // Residual Voltage (Discharge Voltage U_res) at selected surge current:
  // Non-linear varistor equation: U_res = U_ref * (I / I_ref)^(1 / alpha), where alpha ~ 30 in discharge zone
  const residualVoltageKvPeak = useMemo(() => {
    if (impulseType === 'LIGHTNING_1_2_50') {
      const baseUres10ka = 560.0; // 560 kV peak at 10 kA (8/20 µs)
      const factor = Math.pow(lightningSurgeCurrentKa / 10.0, 1 / 28);
      return Math.round(baseUres10ka * factor);
    } else {
      // Switching impulse residual voltage at 1 kA (30/60 µs)
      const baseSwitchingUres = 460.0;
      return Math.round(baseSwitchingUres * Math.pow(lightningSurgeCurrentKa / 10.0, 1 / 35));
    }
  }, [lightningSurgeCurrentKa, impulseType]);

  // Traveling Wave Separation Effect (IEC 60071-2 Formula):
  // U_transformer = U_res + 2 * (S / v) * d
  // Where S = steepness (kV/µs), v = speed of light in substation conductors (~300 m/µs), d = distance (m)
  const effectiveSteepness = impulseType === 'LIGHTNING_1_2_50' ? surgeWavefrontSteepnessKvPerUs : 25; // Switching is much slower (~25 kV/µs)
  const waveReflectionVoltageKvPeak = useMemo(() => {
    const vCelerity = 300.0; // m / µs
    const addedDeltaU = 2 * (effectiveSteepness / vCelerity) * distanceToTransformerMeters;
    return Math.round(residualVoltageKvPeak + addedDeltaU);
  }, [residualVoltageKvPeak, effectiveSteepness, distanceToTransformerMeters]);

  // Maximum permissible distance d_max to guarantee minimum 20% protective margin:
  // d_max = ((BIL / 1.20) - U_res) * v / (2 * S)
  const maxSafeDistanceMeters = useMemo(() => {
    const vCelerity = 300.0;
    const maxAllowableUt = targetWithstandPeak / 1.20;
    const deltaUmax = Math.max(0, maxAllowableUt - residualVoltageKvPeak);
    const dMax = (deltaUmax * vCelerity) / (2 * effectiveSteepness);
    return Math.min(45, Math.max(1, Math.round(dMax * 10) / 10));
  }, [targetWithstandPeak, residualVoltageKvPeak, effectiveSteepness]);

  // Protective Safety Margin (IEC 60071-1): Margin = (BIL - U_transformer) / U_transformer * 100%
  // Standard requires at least >= 20% margin for reliable transformer insulation coordination
  const protectiveMarginPercent = useMemo(() => {
    return Math.round(((targetWithstandPeak - waveReflectionVoltageKvPeak) / waveReflectionVoltageKvPeak) * 100);
  }, [targetWithstandPeak, waveReflectionVoltageKvPeak]);

  const isInsulationCompromised = waveReflectionVoltageKvPeak > targetWithstandPeak;
  const isMarginMarginal = protectiveMarginPercent < 20;

  // Energy Dissipation Calculation during Surge: E = U_res * I_surge * t_effective
  const absorbedEnergyKj = useMemo(() => {
    const durationUs = impulseType === 'LIGHTNING_1_2_50' ? 20e-6 : 2000e-6;
    // Approximating integral E = integral u(t) * i(t) dt ~ 0.8 * U_res * I_peak * t_half
    const energyJoules = 0.8 * (residualVoltageKvPeak * 1e3) * (lightningSurgeCurrentKa * 1e3) * durationUs;
    return Math.round(energyJoules / 1000);
  }, [residualVoltageKvPeak, lightningSurgeCurrentKa, impulseType]);

  const absorbedEnergyPerKvUr = absorbedEnergyKj / ratedVoltageUrKv;
  const isThermalOverload = absorbedEnergyKj > maxTotalEnergyKj;

  // On-line Leakage Current Monitoring (ANSI 28M / IEC 60099-5):
  const leakageCurrentMicroAmps = useMemo(() => {
    if (arresterCondition === 'HEALTHY_NORMAL') {
      return { totalMa: 1.15, resistiveMicroA: 45, harmonic3rdMicroA: 8, status: 'NORMAL' };
    } else if (arresterCondition === 'MOISTURE_INGRESS') {
      return { totalMa: 2.85, resistiveMicroA: 280, harmonic3rdMicroA: 65, status: 'WARNING' };
    } else {
      return { totalMa: 6.40, resistiveMicroA: 890, harmonic3rdMicroA: 240, status: 'CRITICAL_RUNAWAY' };
    }
  }, [arresterCondition]);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-sm">
              {locale === 'fr'
                ? "Parafoudres Haute Tension à Oxyde de Zinc (ZnO - CEI 60099-4) & Coordination d'Isolement (BIL/SIL)"
                : "Metal-Oxide Surge Arresters (ZnO - IEC 60099-4) & Insulation Coordination (BIL/SIL)"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {locale === 'fr'
              ? "Modélisation de la caractéristique non-linéaire U-I des varistances ZnO, réflexions d'ondes de choc vers le transformateur, marge BIL et diagnostic des courants de fuite résistifs."
              : "Non-linear ZnO varistor U-I modeling, traveling wave separation reflection toward transformer bushings, BIL safety margin, and resistive leakage monitoring."}
          </p>
        </div>

        {/* Diagnostic Condition Toggle */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['HEALTHY_NORMAL', 'MOISTURE_INGRESS', 'THERMAL_RUNAWAY_RISK'] as const).map(cond => (
            <button
              key={cond}
              type="button"
              onClick={() => setArresterCondition(cond)}
              className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                arresterCondition === cond
                  ? cond === 'HEALTHY_NORMAL'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : cond === 'MOISTURE_INGRESS'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30 animate-pulse'
                  : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200'
              }`}
            >
              {cond === 'HEALTHY_NORMAL' ? '1. Varistances Saines' : cond === 'MOISTURE_INGRESS' ? '2. Humidité Interne' : '3. Emballement Thermique'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left = Wave Reflection & Insulation Coordination, Right = Non-Linear Curve & Leakage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: TRAVELING WAVE PROPAGATION & BIL SAFETY MARGIN (COL 7) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Coordination d'Isolement 225 kV & Effet de Séparation Parafoudre-Transformateur"
                    : "225 kV Insulation Coordination & Separation Distance Impact"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                isInsulationCompromised
                  ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                  : isMarginMarginal
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {isInsulationCompromised ? 'CLAQUAGE DIÉLECTRIQUE !' : isMarginMarginal ? 'MARGE FAIBLE (< 20%)' : 'COORDINATION OPTIMALE'}
              </span>
            </div>

            {/* Impulse Wave Type Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setImpulseType('LIGHTNING_1_2_50')}
                className={`p-2 rounded-xl border text-[11px] font-bold text-left cursor-pointer flex items-center justify-between ${
                  impulseType === 'LIGHTNING_1_2_50'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>1. Choc de Foudre 1.2/50 µs</span>
                <span className="text-[9px] font-mono">BIL: 1050 kV</span>
              </button>

              <button
                type="button"
                onClick={() => setImpulseType('SWITCHING_250_2500')}
                className={`p-2 rounded-xl border text-[11px] font-bold text-left cursor-pointer flex items-center justify-between ${
                  impulseType === 'SWITCHING_250_2500'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>2. Choc de Manœuvre 250/2500 µs</span>
                <span className="text-[9px] font-mono">SIL: 850 kV</span>
              </button>
            </div>

            {/* Visual Wavefront Propagation Diagram */}
            <div className="p-4 rounded-xl bg-[#05080E] border border-[#1E2634] space-y-3">
              <div className="flex justify-between items-center text-[11px] pb-2 border-b border-slate-800">
                <span className="text-slate-400">Équipement Protégé :</span>
                <span className="text-white font-bold">
                  Transformateur 100 MVA ({impulseType === 'LIGHTNING_1_2_50' ? `BIL = ${transformerBilKvPeak} kVcrête` : `SIL = ${transformerSilKvPeak} kVcrête`})
                </span>
              </div>

              {/* Progress Gauges Comparing Residual vs Transformer Surge Voltage vs Target Withstand */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-sky-300">1. Tension Résiduelle aux bornes du Parafoudre (Ures) :</span>
                  <span className="font-bold text-sky-400 font-mono">{residualVoltageKvPeak} kVcrête</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${(residualVoltageKvPeak / targetWithstandPeak) * 100}%` }} />
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className={isInsulationCompromised ? 'text-rose-400 font-bold' : 'text-amber-300'}>
                    2. Tension de Choc Réfléchie aux Traversées Transfo (Utransfo) :
                  </span>
                  <span className={`font-bold font-mono ${isInsulationCompromised ? 'text-rose-400 text-sm' : 'text-amber-400'}`}>
                    {waveReflectionVoltageKvPeak} kVcrête (+{waveReflectionVoltageKvPeak - residualVoltageKvPeak} kV réflexion)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isInsulationCompromised ? 'bg-rose-500' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(100, (waveReflectionVoltageKvPeak / targetWithstandPeak) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>Limite Diélectrique (CEI 60071-1) : <strong className="text-emerald-400 font-mono">{targetWithstandPeak} kVcrête</strong></span>
                  <span>Marge de Sécurité : <strong className={`font-mono ${isMarginMarginal ? 'text-rose-400' : 'text-teal-300'}`}>+{protectiveMarginPercent}%</strong> (Requis &ge; 20%)</span>
                </div>
              </div>
            </div>

            {/* Interactive Physical Distance Slider (Règle de Proximité) */}
            <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-bold">Distance Parafoudre - Traversée Transformateur (L) :</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className={`font-bold ${distanceToTransformerMeters > maxSafeDistanceMeters ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {distanceToTransformerMeters.toFixed(1)} m
                  </span>
                  <span className="text-[10px] text-slate-500">(Limite d_max = {maxSafeDistanceMeters} m)</span>
                </div>
              </div>
              <input
                type="range"
                min="1.0"
                max="35.0"
                step="0.5"
                value={distanceToTransformerMeters}
                onChange={e => setDistanceToTransformerMeters(parseFloat(e.target.value))}
                className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded cursor-pointer"
              />
              <span className="text-[9px] text-slate-500 block">
                {locale === 'fr'
                  ? `Formule CEI 60071-2 : ΔU = 2 · (S / v) · d. Pour une raideur de ${effectiveSteepness} kV/µs et une vitesse de 300 m/µs, chaque mètre d'éloignement ajoute ${(2 * effectiveSteepness / 300).toFixed(1)} kV de surtension supplémentaire.`
                  : `IEC 60071-2 formula: ΔU = 2 · (S / v) · d. At ${effectiveSteepness} kV/µs wavefront steepness, every meter of separation adds ${(2 * effectiveSteepness / 300).toFixed(1)} kV onto transformer insulation.`}
              </span>
            </div>

            {/* Lightning Surge Current & Steepness Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#0D121B] border border-[#1E2634]">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Courant de Décharge Crête :</span>
                  <span className="text-sky-300 font-bold font-mono">{lightningSurgeCurrentKa} kA</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="30.0"
                  step="1.0"
                  value={lightningSurgeCurrentKa}
                  onChange={e => setLightningSurgeCurrentKa(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Raideur de l'Onde de Choc :</span>
                  <span className="text-amber-300 font-bold font-mono">{surgeWavefrontSteepnessKvPerUs} kV/µs</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="2000"
                  step="100"
                  value={surgeWavefrontSteepnessKvPerUs}
                  onChange={e => setSurgeWavefrontSteepnessKvPerUs(parseInt(e.target.value, 10))}
                  disabled={impulseType === 'SWITCHING_250_2500'}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded cursor-pointer disabled:opacity-40"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: ENERGY DISSIPATION & ON-LINE LEAKAGE MONITORING (COL 5) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Energy Capability & Thermal Stress (kJ/kV) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr' ? "Absorption d'Énergie & Classe de Décharge" : "Energy Absorption & Discharge Class"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                isThermalOverload
                  ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {isThermalOverload ? 'SURCHARGE THERMIQUE !' : 'TENUE THERMIQUE CONFORME'}
              </span>
            </div>

            {/* Class Selector */}
            <div className="grid grid-cols-2 gap-1.5">
              {(['CLASS_1_LIGHT', 'CLASS_2_MEDIUM', 'CLASS_3_HEAVY', 'CLASS_4_STATION_HIGH'] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setArresterEnergyClass(c)}
                  className={`p-1.5 rounded-lg border text-[10px] font-bold text-left cursor-pointer ${
                    arresterEnergyClass === c
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>{c === 'CLASS_1_LIGHT' ? 'Classe 1 (2.5 kJ/kV)' : c === 'CLASS_2_MEDIUM' ? 'Classe 2 (4.5 kJ/kV)' : c === 'CLASS_3_HEAVY' ? 'Classe 3 (7.0 kJ/kV)' : 'Classe 4 (10 kJ/kV Poste)'}</div>
                </button>
              ))}
            </div>

            {/* Energy Bar */}
            <div className="space-y-1.5 pt-1 font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Énergie Absorbée :</span>
                <span className={`font-bold ${isThermalOverload ? 'text-rose-400' : 'text-amber-400'}`}>
                  {absorbedEnergyKj} kJ ({absorbedEnergyPerKvUr.toFixed(2)} kJ/kV_Ur)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isThermalOverload ? 'bg-rose-500' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, (absorbedEnergyKj / maxTotalEnergyKj) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 kJ</span>
                <span>Capacité Nominale Ur=198kV : {maxTotalEnergyKj} kJ</span>
              </div>
            </div>
          </div>

          {/* On-Line Leakage Current & Thermal Runaway Monitor (ANSI 28M / IEC 60099-5) */}
          <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl space-y-3.5 ${
            arresterCondition === 'THERMAL_RUNAWAY_RISK'
              ? 'bg-rose-950/40 border-rose-500 shadow-rose-950/60'
              : arresterCondition === 'MOISTURE_INGRESS'
                ? 'bg-amber-950/30 border-amber-500/70'
                : 'bg-[#080C13] border-[#222B38]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${arresterCondition !== 'HEALTHY_NORMAL' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Surveillance en Ligne du Courant de Fuite (ANSI 28M)"
                    : "Surge Arrester On-Line Leakage Monitor (ANSI 28M)"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                arresterCondition === 'HEALTHY_NORMAL'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : arresterCondition === 'MOISTURE_INGRESS'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
              }`}>
                {arresterCondition === 'HEALTHY_NORMAL' ? 'VARISTANCE SAINE' : arresterCondition === 'MOISTURE_INGRESS' ? 'HUMIDITÉ DÉTECTÉE' : 'EMBALLEMENT IMMINENT'}
              </span>
            </div>

            {/* Current Measurements Table */}
            <div className="p-3.5 rounded-xl bg-[#05080E] border border-[#1E2634] space-y-2 font-mono">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Courant de Fuite Total (Itotal) :</span>
                <span className="text-white font-bold">{leakageCurrentMicroAmps.totalMa} mA</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Composante Résistive Pure (Ir) :</span>
                <span className={`font-bold ${leakageCurrentMicroAmps.resistiveMicroA > 300 ? 'text-rose-400 text-sm' : leakageCurrentMicroAmps.resistiveMicroA > 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {leakageCurrentMicroAmps.resistiveMicroA} µA
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Harmonique 3 du Courant Résistif (I3r) :</span>
                <span className="text-cyan-300 font-bold">{leakageCurrentMicroAmps.harmonic3rdMicroA} µA</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px]">
                <span className="text-slate-500">Compteur de Chocs Électromécanique :</span>
                <span className="text-slate-300 font-bold">14 Décharges Foudre</span>
              </div>
            </div>

            {/* Diagnostic Interpretation */}
            <div className="text-[11px] font-sans leading-relaxed">
              {arresterCondition === 'HEALTHY_NORMAL' ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300">
                  {locale === 'fr'
                    ? "Composante résistive < 80 µA. Les pastilles d'oxyde de zinc sont parfaitement étanches et ne subissent aucun vieillissement thermique."
                    : "Resistive leakage current < 80 µA. Zinc oxide varistor blocks are hermetically sound with zero thermal aging."}
                </div>
              ) : arresterCondition === 'MOISTURE_INGRESS' ? (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 space-y-1">
                  <strong className="block text-white">DEGRADATION PAR HUMIDITÉ :</strong>
                  <p>
                    {locale === 'fr'
                      ? "Pénétration d'humidité dans le boîtier en porcelaine/silicone. Le courant résistif quadruple, entraînant un échauffement continu de la colonne de varistances."
                      : "Moisture ingress past silicone sealing gaskets. Resistive current quadruples, accelerating internal heat dissipation."}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 space-y-1">
                  <strong className="block text-white">RISQUE D'EXPLOSION PAR EMBALLEMENT THERMIQUE :</strong>
                  <p>
                    {locale === 'fr'
                      ? "La puissance thermique dissipée par les pastilles dépasse la capacité de refroidissement du boîtier (d'T/dt > 0). Risque d'explosion violente avec projection de débris si non consigné immédiatement !"
                      : "Internal heat generation exceeds arrester housing cooling dissipation. Catastrophic explosion risk if not isolated immediately!"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ZnO Non-Linear Varistor Physics Explainer */}
          <div className="p-4 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-2.5 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-white font-bold border-b border-[#222B38] pb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>{locale === 'fr' ? 'Équation Varistance ZnO (CEI 60099-4)' : 'ZnO Varistor Physical Equation'}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#05080E] border border-slate-800 text-sky-300 font-bold text-center">
              I = k · V<sup>α</sup> &nbsp;(avec coefficient α &ge; 30)
            </div>
            <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
              {locale === 'fr'
                ? "À tension de service normale (225 kV), le parafoudre se comporte comme un isolateur parfait (mégohms, fuite ~ microampères). Dès l'apparition d'une surtension foudre, la résistance chute en nanosecondes à quelques fractions d'ohm, écoulant jusqu'à 20 000 A à la terre."
                : "Under continuous service voltage, the arrester behaves as an open insulator (leakage ~ microamps). Upon surge arrival, impedance drops in nanoseconds to sub-ohms, safely diverting 20,000 A impulses to ground."}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
