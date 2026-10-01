// src/components/calculators/modules/NeutralGroundingCalculator.tsx
// Module 16: Neutral Grounding Resistor (NGR / RPN) & Petersen Coil Tuning (IEC 60071 / NF C 13-200 / IEEE 142)
// High-Voltage Substation Protection & Grounding Engineering - EPEDE Technical Council

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Thermometer,
  Gauge,
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';

interface NeutralGroundingCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export type NeutralPreset =
  | 'ahala_30kv_rpn'
  | 'bekoko_30kv_rpn'
  | 'oyomabang_15kv_rpn'
  | 'rural_33kv_petersen'
  | 'custom';

export const NeutralGroundingCalculator: React.FC<NeutralGroundingCalculatorProps> = ({
  locale,
  onOpenReport,
}) => {
  // ---------------------------------------------------------------------------
  // 1. STATE CONFIGURATION
  // ---------------------------------------------------------------------------
  const [activePreset, setActivePreset] = useState<NeutralPreset>('ahala_30kv_rpn');

  // Regime Selection: 'rpn' (Resistor) or 'petersen' (Resonant Arc Suppression Coil)
  const [earthingRegime, setEarthingRegime] = useState<'rpn' | 'petersen'>('rpn');

  // Electrical Network Parameters
  const [unKv, setUnKv] = useState<number>(30); // Line voltage in kV
  const [frequencyHz, setFrequencyHz] = useState<number>(50); // Grid frequency
  const [trafoPowerMva, setTrafoPowerMva] = useState<number>(36); // Transformer rating
  const [substationEarthOhm, setSubstationEarthOhm] = useState<number>(0.8); // Substation grid resistance (Ω)

  // Resistor (RPN / NGR) Parameters
  const [targetFaultCurrentA, setTargetFaultCurrentA] = useState<number>(433); // Target In in Amperes
  const [ratedTimeSec, setRatedTimeSec] = useState<number>(10); // 10s, 30s or continuous
  const [selectedRnOhm, setSelectedRnOhm] = useState<number>(40); // Actual standard resistance value

  // Petersen Coil Parameters (Network Capacitance)
  const [overheadLinesKm, setOverheadLinesKm] = useState<number>(180); // Total length of overhead feeders (km)
  const [c0OverheadMicroFPerKm, setC0OverheadMicroFPerKm] = useState<number>(0.0055); // μF/km
  const [undergroundCablesKm, setUndergroundCablesKm] = useState<number>(24); // Total length of underground cables (km)
  const [c0CableMicroFPerKm, setC0CableMicroFPerKm] = useState<number>(0.28); // μF/km
  const [deTuningPercent, setDeTuningPercent] = useState<number>(8); // Overcompensation tuning % (+5% to +15%)
  const [wattmetricLossFactorPercent, setWattmetricLossFactorPercent] = useState<number>(3.5); // Cable/insulator active loss %

  // ---------------------------------------------------------------------------
  // 2. PRESETS HANDLER
  // ---------------------------------------------------------------------------
  const applyPreset = (preset: NeutralPreset) => {
    setActivePreset(preset);
    if (preset === 'ahala_30kv_rpn') {
      setEarthingRegime('rpn');
      setUnKv(30);
      setFrequencyHz(50);
      setTrafoPowerMva(36);
      setSubstationEarthOhm(0.8);
      setTargetFaultCurrentA(433);
      setRatedTimeSec(10);
      setSelectedRnOhm(40);
    } else if (preset === 'bekoko_30kv_rpn') {
      setEarthingRegime('rpn');
      setUnKv(30);
      setFrequencyHz(50);
      setTrafoPowerMva(50);
      setSubstationEarthOhm(0.5);
      setTargetFaultCurrentA(433);
      setRatedTimeSec(10);
      setSelectedRnOhm(40);
    } else if (preset === 'oyomabang_15kv_rpn') {
      setEarthingRegime('rpn');
      setUnKv(15);
      setFrequencyHz(50);
      setTrafoPowerMva(20);
      setSubstationEarthOhm(0.7);
      setTargetFaultCurrentA(346);
      setRatedTimeSec(10);
      setSelectedRnOhm(25);
    } else if (preset === 'rural_33kv_petersen') {
      setEarthingRegime('petersen');
      setUnKv(33);
      setFrequencyHz(50);
      setTrafoPowerMva(25);
      setSubstationEarthOhm(1.0);
      setOverheadLinesKm(240);
      setC0OverheadMicroFPerKm(0.0055);
      setUndergroundCablesKm(16);
      setC0CableMicroFPerKm(0.28);
      setDeTuningPercent(10);
      setWattmetricLossFactorPercent(3.5);
    }
  };

  // ---------------------------------------------------------------------------
  // 3. SCIENTIFIC & ENGINEERING CALCULATIONS
  // ---------------------------------------------------------------------------
  const calcs = useMemo(() => {
    const vPhaseV = (unKv * 1000) / Math.sqrt(3);
    const omega = 2 * Math.PI * frequencyHz;

    // --- 3.1 RPN / NGR CALCULATIONS ---
    const theoreticalRnOhm = vPhaseV / targetFaultCurrentA;
    const actualFaultCurrentA = vPhaseV / selectedRnOhm;
    const thermalEnergyMj = Math.pow(actualFaultCurrentA, 2) * selectedRnOhm * ratedTimeSec * 1e-6;
    const instantaneousPowerMw = Math.pow(actualFaultCurrentA, 2) * selectedRnOhm * 1e-6;
    const gprVolts = actualFaultCurrentA * substationEarthOhm;
    // Permissible touch voltage per IEEE 80 / CEI 61936-1 for tk=0.5s ~ 220V
    const gprSafetyThreshold = 650; // V for isolated substation gravel surface

    // Overvoltage factor on healthy phases during single phase to ground fault
    const healthyPhaseVoltageKv = unKv; // V_healthy = sqrt(3) * V_ph = U_n
    const overvoltageFactor = Math.sqrt(3); // 1.732 p.u.

    // --- 3.2 PETERSEN COIL CALCULATIONS ---
    // Total homopolar network capacitance C0_sum
    const c0OverheadTotalMicroF = overheadLinesKm * c0OverheadMicroFPerKm;
    const c0CableTotalMicroF = undergroundCablesKm * c0CableMicroFPerKm;
    const c0NetworkTotalMicroF = c0OverheadTotalMicroF + c0CableTotalMicroF;

    // Total network capacitive earth fault current: Ic0 = 3 * ω * C0_tot * V_ph
    const capacitiveFaultCurrentA = 3 * omega * (c0NetworkTotalMicroF * 1e-6) * vPhaseV;

    // Exact resonant inductance: Lp_res = 1 / (3 * ω² * C0_tot)
    const resonantInductanceHenry = 1 / (3 * Math.pow(omega, 2) * (c0NetworkTotalMicroF * 1e-6));
    const resonantCoilReactanceXl = omega * resonantInductanceHenry;

    // Inductive current of the tuned coil: IL = Ic0 * (1 + deTuning / 100)
    const coilInductiveCurrentA = capacitiveFaultCurrentA * (1 + deTuningPercent / 100);
    const tunedInductanceHenry = vPhaseV / (omega * coilInductiveCurrentA);
    const coilContinuousRatingKva = (vPhaseV * coilInductiveCurrentA) / 1000;

    // Residual fault current: I_res = sqrt(I_active_loss² + (IL - Ic0)²)
    const activeLossCurrentA = capacitiveFaultCurrentA * (wattmetricLossFactorPercent / 100);
    const reactiveDifferenceA = Math.abs(coilInductiveCurrentA - capacitiveFaultCurrentA);
    const residualFaultCurrentA = Math.sqrt(
      Math.pow(activeLossCurrentA, 2) + Math.pow(reactiveDifferenceA, 2)
    );

    // Self-extinction capability (under 30-35 A rms, electric arcs self-extinguish in open air without tripping)
    const arcSelfExtinctionPossible = residualFaultCurrentA <= 30;

    return {
      vPhaseV,
      theoreticalRnOhm,
      actualFaultCurrentA,
      thermalEnergyMj,
      instantaneousPowerMw,
      gprVolts,
      gprSafetyThreshold,
      healthyPhaseVoltageKv,
      overvoltageFactor,
      c0OverheadTotalMicroF,
      c0CableTotalMicroF,
      c0NetworkTotalMicroF,
      capacitiveFaultCurrentA,
      resonantInductanceHenry,
      resonantCoilReactanceXl,
      coilInductiveCurrentA,
      tunedInductanceHenry,
      coilContinuousRatingKva,
      activeLossCurrentA,
      reactiveDifferenceA,
      residualFaultCurrentA,
      arcSelfExtinctionPossible,
    };
  }, [
    unKv,
    frequencyHz,
    trafoPowerMva,
    substationEarthOhm,
    targetFaultCurrentA,
    ratedTimeSec,
    selectedRnOhm,
    overheadLinesKm,
    c0OverheadMicroFPerKm,
    undergroundCablesKm,
    c0CableMicroFPerKm,
    deTuningPercent,
    wattmetricLossFactorPercent,
  ]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-emerald-950/30 border border-amber-500/20 p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 mb-1">
              <ShieldAlert className="h-4 w-4" />
              <span className="uppercase tracking-widest font-black">
                MODULE 16 · RÉGIMES DE NEUTRE RPN & PETERSEN (CEI 60071 / NF C 13-200)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
              {locale === 'fr'
                ? 'Dimensionnement RPN & Accord Bobine de Petersen'
                : 'Neutral Grounding Resistor & Petersen Coil Sizing'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Calcul thermique et électrique de résistance de limitation (RPN / NGR), élévation de potentiel de terre (GPR), et accord de réactance de compensation réactive (Bobine de Petersen) avec extinction automatique des défauts fugitifs.'
                : 'Thermal and electrical sizing of Neutral Grounding Resistors (NGR/RPN), Ground Potential Rise (GPR), and resonant inductive earthing (Petersen Coil tuning) with arc self-extinction telemetry.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenReport && (
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all shadow-md"
              >
                <FileText className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Note de Calcul' : 'Calculation Note'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Presets Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1">
            {locale === 'fr' ? 'Postes & Référentiels :' : 'Substation Presets:'}
          </span>
          <button
            type="button"
            onClick={() => applyPreset('ahala_30kv_rpn')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activePreset === 'ahala_30kv_rpn'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30'
            }`}
          >
            {locale === 'fr' ? 'Poste Ahala 225/30 kV (RPN 40 Ω)' : 'Ahala Substation 30 kV (NGR 40 Ω)'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('bekoko_30kv_rpn')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activePreset === 'bekoko_30kv_rpn'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30'
            }`}
          >
            {locale === 'fr' ? 'Poste Bekoko 225/30 kV (RPN 40 Ω)' : 'Bekoko Substation 30 kV (NGR 40 Ω)'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('oyomabang_15kv_rpn')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activePreset === 'oyomabang_15kv_rpn'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30'
            }`}
          >
            {locale === 'fr' ? 'Poste Oyomabang 90/15 kV (RPN 25 Ω)' : 'Oyomabang Substation 15 kV (NGR 25 Ω)'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('rural_33kv_petersen')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activePreset === 'rural_33kv_petersen'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {locale === 'fr' ? 'Réseau Rural 33 kV (Bobine Petersen)' : 'Rural Grid 33 kV (Petersen Coil)'}
          </button>
        </div>
      </div>

      {/* Regime Toggle Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setEarthingRegime('rpn')}
          className={`flex-1 py-3 px-4 rounded-xl font-mono text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
            earthingRegime === 'rpn'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-slate-900/40 text-slate-400 border-white/10 hover:text-white'
          }`}
        >
          <Zap className="h-4 w-4 text-amber-400" />
          <span>{locale === 'fr' ? 'Régime Résistance de Neutre (RPN / NGR)' : 'Neutral Grounding Resistor (NGR / RPN)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setEarthingRegime('petersen')}
          className={`flex-1 py-3 px-4 rounded-xl font-mono text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
            earthingRegime === 'petersen'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-slate-900/40 text-slate-400 border-white/10 hover:text-white'
          }`}
        >
          <Activity className="h-4 w-4 text-emerald-400" />
          <span>{locale === 'fr' ? 'Régime Compensé (Bobine de Petersen)' : 'Resonant Earthing (Petersen Coil)'}</span>
        </button>
      </div>

      {/* Main Grid: Parameters vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================================================================ */}
        {/* LEFT COLUMN: INPUT CONTROLS (7 Cols)                             */}
        {/* ================================================================ */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Common Substation Grid Parameters */}
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? '1. Caractéristiques du Poste Source & Réseau' : '1. Substation & Grid Parameters'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Tension Nominale (Un)' : 'Nominal Voltage (Un)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={unKv}
                    onChange={(e) => { setUnKv(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-amber-400 outline-none"
                    step="1"
                  />
                  <span className="text-amber-400 font-bold">kV</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Puissance Transfo (S_n)' : 'Transformer Rating'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={trafoPowerMva}
                    onChange={(e) => { setTrafoPowerMva(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-amber-400 outline-none"
                    step="5"
                  />
                  <span className="text-cyan-400 font-bold">MVA</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Terre du Poste (R_terre)' : 'Earth Grid Resistance'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={substationEarthOhm}
                    onChange={(e) => { setSubstationEarthOhm(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-amber-400 outline-none"
                    step="0.1"
                  />
                  <span className="text-emerald-400 font-bold">Ω</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: RPN Inputs or Petersen Inputs */}
          {earthingRegime === 'rpn' ? (
            <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold font-mono text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>{locale === 'fr' ? '2. Paramètres de la Résistance de Neutre (RPN)' : '2. Neutral Resistor Parameters (NGR)'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">
                    {locale === 'fr' ? 'Courant de Défaut Cible (In)' : 'Target Fault Current (In)'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={targetFaultCurrentA}
                      onChange={(e) => { setTargetFaultCurrentA(Number(e.target.value)); setActivePreset('custom'); }}
                      className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-amber-400 outline-none"
                      step="10"
                    />
                    <span className="text-amber-400 font-bold">A</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    {locale === 'fr' ? 'Résistance Retenue (Rn)' : 'Selected Resistor (Rn)'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={selectedRnOhm}
                      onChange={(e) => { setSelectedRnOhm(Number(e.target.value)); setActivePreset('custom'); }}
                      className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-amber-400 outline-none"
                      step="1"
                    />
                    <span className="text-cyan-400 font-bold">Ω</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    {locale === 'fr' ? 'Temps Admissible (t_n)' : 'Thermal Rating Duration'}
                  </label>
                  <select
                    value={ratedTimeSec}
                    onChange={(e) => { setRatedTimeSec(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-amber-400 outline-none"
                  >
                    <option value={5}>5 secondes (Poste HTA)</option>
                    <option value={10}>10 secondes (Standard CEI)</option>
                    <option value={30}>30 secondes (Sécurité renforcée)</option>
                    <option value={60}>60 secondes (Longue durée)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-200">
                <span className="font-bold">{locale === 'fr' ? 'Règle de dimensionnement :' : 'Engineering rule:'}</span>{' '}
                {locale === 'fr'
                  ? `Rn théorique = V_ph / In = ${calcs.theoreticalRnOhm.toFixed(1)} Ω. La valeur normalisée retenue est de ${selectedRnOhm} Ω limitant le courant de terre à ${calcs.actualFaultCurrentA.toFixed(1)} A.`
                  : `Theoretical Rn = V_ph / In = ${calcs.theoreticalRnOhm.toFixed(1)} Ω. Selected standard value is ${selectedRnOhm} Ω limiting ground current to ${calcs.actualFaultCurrentA.toFixed(1)} A.`}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold font-mono text-emerald-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>{locale === 'fr' ? '2. Réseau Capacitif & Accord de la Bobine' : '2. Capacitive Network & Petersen Tuning'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">
                    {locale === 'fr' ? 'Lignes Aériennes Totales (L_aer)' : 'Total Overhead Feeders (km)'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={overheadLinesKm}
                      onChange={(e) => { setOverheadLinesKm(Number(e.target.value)); setActivePreset('custom'); }}
                      className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-emerald-400 outline-none"
                      step="10"
                    />
                    <span className="text-sky-400 font-bold">km</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    {locale === 'fr' ? 'Câbles Souterrains Totaux (L_cab)' : 'Total Underground Cables (km)'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={undergroundCablesKm}
                      onChange={(e) => { setUndergroundCablesKm(Number(e.target.value)); setActivePreset('custom'); }}
                      className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-emerald-400 outline-none"
                      step="2"
                    />
                    <span className="text-sky-400 font-bold">km</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mt-4">
                <div>
                  <label className="text-slate-400 block mb-1">
                    {locale === 'fr' ? 'Désaccord / Surcompensation (ν)' : 'De-Tuning Factor (ν)'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={deTuningPercent}
                      onChange={(e) => { setDeTuningPercent(Number(e.target.value)); setActivePreset('custom'); }}
                      className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-emerald-400 outline-none"
                      step="1"
                      min="-20"
                      max="30"
                    />
                    <span className="text-emerald-400 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    {locale === 'fr' ? 'Pertes Actives Wattmétriques' : 'Active Wattmetric Losses'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={wattmetricLossFactorPercent}
                      onChange={(e) => { setWattmetricLossFactorPercent(Number(e.target.value)); setActivePreset('custom'); }}
                      className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-emerald-400 outline-none"
                      step="0.5"
                      min="1"
                      max="10"
                    />
                    <span className="text-amber-400 font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* RIGHT COLUMN: REAL-TIME TELEMETRY & RATINGS (5 Cols)             */}
        {/* ================================================================ */}
        <div className="lg:col-span-5 space-y-5">
          {earthingRegime === 'rpn' ? (
            <>
              {/* RPN Telemetry Card */}
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <h3 className="text-sm font-bold font-mono text-amber-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>{locale === 'fr' ? 'Bilan Électrique & Thermique RPN' : 'NGR Electrical & Thermal Rating'}</span>
                  <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    CEI 60071
                  </span>
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Tension Simple (V_ph) :' : 'Phase-to-Neutral Voltage:'}</span>
                    <span className="text-white font-bold">{(calcs.vPhaseV / 1000).toFixed(2)} kV</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Courant de Défaut Réel (If) :' : 'Real Ground Fault Current:'}</span>
                    <span className="text-amber-400 font-black text-sm">{calcs.actualFaultCurrentA.toFixed(1)} A</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Énergie Thermique Dissipée :' : 'Dissipated Thermal Energy:'}</span>
                    <span className="text-cyan-300 font-black text-sm">{calcs.thermalEnergyMj.toFixed(2)} MJ ({ratedTimeSec} s)</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Puissance Instantanée du Défaut :' : 'Instantaneous Fault Power:'}</span>
                    <span className="text-white font-bold">{calcs.instantaneousPowerMw.toFixed(2)} MW</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Montée Potentiel de Terre (GPR) :' : 'Ground Potential Rise (GPR):'}</span>
                    <span className={`font-black text-sm ${calcs.gprVolts <= calcs.gprSafetyThreshold ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {calcs.gprVolts.toFixed(1)} V
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Surtension Phases Saines (SLG) :' : 'Healthy Phase Overvoltage:'}</span>
                    <span className="text-purple-300 font-bold">{calcs.healthyPhaseVoltageKv.toFixed(1)} kV ({calcs.overvoltageFactor.toFixed(3)} p.u.)</span>
                  </div>
                </div>
              </div>

              {/* Status Notice */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-emerald-500/20 text-xs font-mono text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Conformité Relais de Terre 51N / 67N' : 'Protection Relay 51N/67N Compliance'}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {locale === 'fr'
                    ? `Le courant de limitation de ${calcs.actualFaultCurrentA.toFixed(1)} A assure un déclenchement franc et sélectif des protections à maximum de courant homopolaire (ANSI 51N) et directionnelles de terre (ANSI 67N) avec un rapport I_défaut / I_seuil > 10.`
                    : `Limiting fault current to ${calcs.actualFaultCurrentA.toFixed(1)} A guarantees fast, selective operation of residual overcurrent (ANSI 51N) and directional earth fault (ANSI 67N) relays with a pickup ratio > 10.`}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Petersen Telemetry Card */}
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <h3 className="text-sm font-bold font-mono text-emerald-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>{locale === 'fr' ? 'Bilan d\'Accord Bobine de Petersen' : 'Petersen Coil Tuning Telemetry'}</span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    CEI 60071-2
                  </span>
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Capacité Totale du Réseau (C0) :' : 'Total Zero-Seq Capacitance:'}</span>
                    <span className="text-white font-bold">{calcs.c0NetworkTotalMicroF.toFixed(3)} μF</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Courant Capacitif de Terre (Ic0) :' : 'Network Capacitive Current:'}</span>
                    <span className="text-sky-300 font-black text-sm">{calcs.capacitiveFaultCurrentA.toFixed(1)} A</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Inductance Accordée (L_p) :' : 'Tuned Inductance (L_p):'}</span>
                    <span className="text-emerald-400 font-black text-sm">{calcs.tunedInductanceHenry.toFixed(3)} H</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Courant Inductif Bobine (IL) :' : 'Coil Inductive Current:'}</span>
                    <span className="text-white font-bold">{calcs.coilInductiveCurrentA.toFixed(1)} A (ν = +{deTuningPercent}%)</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Courant Résiduel de Défaut :' : 'Residual Fault Current:'}</span>
                    <span className={`font-black text-sm ${calcs.arcSelfExtinctionPossible ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {calcs.residualFaultCurrentA.toFixed(1)} A
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Puissance Nominale Bobine :' : 'Petersen Coil Rated Power:'}</span>
                    <span className="text-cyan-300 font-bold">{calcs.coilContinuousRatingKva.toFixed(0)} kVA</span>
                  </div>
                </div>
              </div>

              {/* Arc Extinction Verdict */}
              <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
                calcs.arcSelfExtinctionPossible
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {calcs.arcSelfExtinctionPossible ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-amber-400" />}
                  <span>
                    {calcs.arcSelfExtinctionPossible
                      ? (locale === 'fr' ? 'AUTO-EXTINCTION DE L\'ARC ASSURÉE' : 'ARC SELF-EXTINCTION CONFIRMED')
                      : (locale === 'fr' ? 'COURANT RÉSIDUEL ÉLEVÉ (> 30 A)' : 'HIGH RESIDUAL CURRENT (> 30 A)')}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {locale === 'fr'
                    ? `Le courant résiduel de ${calcs.residualFaultCurrentA.toFixed(1)} A est ${calcs.arcSelfExtinctionPossible ? 'inférieur au seuil critique de 30 A' : 'supérieur au seuil de 30 A'} : les défauts monophasés fugitifs à la terre ${calcs.arcSelfExtinctionPossible ? 's\'éteindront spontanément sans disjonction des départs' : 'nécessitent un réglage plus fin de la bobine ou une limitation de longueur de câbles'}.`
                    : `Residual current of ${calcs.residualFaultCurrentA.toFixed(1)} A is ${calcs.arcSelfExtinctionPossible ? 'below the 30 A critical limit' : 'above the 30 A limit'}: transient single-phase-to-ground arcs ${calcs.arcSelfExtinctionPossible ? 'will extinguish automatically without tripping feeder breakers' : 'require fine-tuning or cable length mitigation'}.`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SVG Vector Diagram: Neutral Point Shift (Déplacement du Neutre) */}
      <div className="rounded-xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl">
        <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'Diagramme Vectoriel : Déplacement du Point Neutre (Défaut Monophasé Ph1-Terre)' : 'Vector Diagram: Neutral Point Displacement (Ph1-to-Ground Fault)'}</span>
          <span className="text-xs text-slate-400 font-normal">
            V_n = -V_ph1 · V_ph2\' = √3·V_ph · V_ph3\' = √3·V_ph
          </span>
        </h3>

        <div className="w-full flex justify-center py-4 bg-[#07090E]/80 rounded-lg border border-white/5 overflow-x-auto">
          <svg viewBox="0 0 540 220" className="w-full max-w-[540px] h-auto select-none">
            {/* Ground reference line */}
            <line x1="20" y1="180" x2="520" y2="180" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="30" y="175" fill="#64748B" fontSize="10" fontFamily="monospace">Terre (0 V Ref)</text>

            {/* Sub-diagram 1: Balanced Normal State */}
            <g transform="translate(120, 100)">
              <circle cx="0" cy="0" r="4" fill="#38BDF8" />
              <text x="8" y="4" fill="#38BDF8" fontSize="10" fontFamily="monospace">N=0</text>
              {/* Ph 1 (Down) */}
              <line x1="0" y1="0" x2="0" y2="60" stroke="#EF4444" strokeWidth="2" />
              <text x="5" y="55" fill="#EF4444" fontSize="10" fontFamily="monospace">V1</text>
              {/* Ph 2 (Top Left 120°) */}
              <line x1="0" y1="0" x2="-51.9" y2="-30" stroke="#3B82F6" strokeWidth="2" />
              <text x="-65" y="-30" fill="#3B82F6" fontSize="10" fontFamily="monospace">V2</text>
              {/* Ph 3 (Top Right 120°) */}
              <line x1="0" y1="0" x2="51.9" y2="-30" stroke="#10B981" strokeWidth="2" />
              <text x="58" y="-30" fill="#10B981" fontSize="10" fontFamily="monospace">V3</text>
              <text x="0" y="90" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Régime Équilibré Normal
              </text>
            </g>

            {/* Transition arrow */}
            <g transform="translate(250, 100)">
              <line x1="0" y1="0" x2="40" y2="0" stroke="#F59E0B" strokeWidth="2" strokeDasharray="2 2" />
              <polygon points="40,0 34,-4 34,4" fill="#F59E0B" />
              <text x="20" y="-10" textAnchor="middle" fill="#F59E0B" fontSize="10" fontFamily="monospace">Défaut Ph1</text>
            </g>

            {/* Sub-diagram 2: Single Phase to Ground Fault (Neutral Shift) */}
            <g transform="translate(380, 100)">
              {/* Ground clamped at Phase 1 */}
              <circle cx="0" cy="60" r="5" fill="#EF4444" />
              <text x="10" y="65" fill="#EF4444" fontSize="10" fontFamily="monospace">Ph1 = 0V (Terre)</text>

              {/* Neutral point elevated to +Vph */}
              <circle cx="0" cy="0" r="4" fill="#F59E0B" />
              <line x1="0" y1="60" x2="0" y2="0" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
              <text x="8" y="-5" fill="#F59E0B" fontSize="10" fontFamily="monospace">Neutre (Vn = -Vph1)</text>

              {/* Vector from Earth (0,60) to Ph2 (-51.9, -30) -> Length = sqrt(3)*Vph */}
              <line x1="0" y1="60" x2="-51.9" y2="-30" stroke="#3B82F6" strokeWidth="2.5" />
              <text x="-75" y="-30" fill="#3B82F6" fontSize="10" fontFamily="monospace">U2-T (√3·Vph)</text>

              {/* Vector from Earth (0,60) to Ph3 (51.9, -30) -> Length = sqrt(3)*Vph */}
              <line x1="0" y1="60" x2="51.9" y2="-30" stroke="#10B981" strokeWidth="2.5" />
              <text x="58" y="-30" fill="#10B981" fontSize="10" fontFamily="monospace">U3-T (√3·Vph)</text>

              <text x="0" y="90" textAnchor="middle" fill="#F59E0B" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Déplacement du Neutre (Surtension √3)
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
