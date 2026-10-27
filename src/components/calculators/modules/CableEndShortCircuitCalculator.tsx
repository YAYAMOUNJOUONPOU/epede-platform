// src/components/calculators/modules/CableEndShortCircuitCalculator.tsx
// EPEDE Layer 02 (Engineering Calculations) - Cable End Short-Circuit Current
// Governing Standards: IEC 60909-0 / NF C 15-105 Cl. 533 / UTE C 15-105

import React, { useState, useEffect } from 'react';
import { Cpu, Zap, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface CableEndShortCircuitCalculatorProps {
  locale: 'fr' | 'en';
  initialParams?: {
    voltageV?: number;
    iccAmontKa?: number;
    lengthM?: number;
    sectionMm2?: number;
    material?: 'cu' | 'al';
    breakerTripA?: number;
  };
  injectedContextInfo?: {
    equipmentName?: string;
    equipmentTag?: string;
  };
  onParamsChange?: (params: Record<string, any>) => void;
}

export const CableEndShortCircuitCalculator: React.FC<CableEndShortCircuitCalculatorProps> = ({
  locale,
  initialParams,
  injectedContextInfo,
  onParamsChange,
}) => {
  const [voltageV, setVoltageV] = useState<number>(initialParams?.voltageV || 400);
  const [iccAmontKa, setIccAmontKa] = useState<number>(initialParams?.iccAmontKa || 25);
  const [lengthM, setLengthM] = useState<number>(initialParams?.lengthM || 60);
  const [sectionMm2, setSectionMm2] = useState<number>(initialParams?.sectionMm2 || 35);
  const [peSectionMm2, setPeSectionMm2] = useState<number>(initialParams?.sectionMm2 ? initialParams.sectionMm2 / 2 : 16);
  const [material, setMaterial] = useState<'cu' | 'al'>(initialParams?.material || 'cu');
  const [insulationType, setInsulationType] = useState<'xlpe' | 'pvc'>('xlpe');
  const [cableArrangement, setCableArrangement] = useState<'multicore' | 'singlecore'>('multicore');
  const [breakerMagTripA, setBreakerMagTripA] = useState<number>(initialParams?.breakerTripA || 1600);

  // Notify parent of state changes for shareable link and reports
  useEffect(() => {
    if (onParamsChange) {
      onParamsChange({
        voltageV,
        iccAmontKa,
        lengthM,
        sectionMm2,
        material,
        breakerTripA: breakerMagTripA,
      });
    }
  }, [voltageV, iccAmontKa, lengthM, sectionMm2, material, breakerMagTripA, onParamsChange]);

  // Resistivity at max operating fault temperature (IEC 60909 / NF C 15-105):
  // Cu at 20°C = 0.0175, Cu at max operating/fault hot = 0.0225 Ω·mm²/m
  // Al at 20°C = 0.028,  Al at max operating/fault hot = 0.0360 Ω·mm²/m
  const rhoCold = material === 'cu' ? 0.0185 : 0.0295;
  const rhoHot = material === 'cu' ? 0.0225 : 0.0360;

  // Linear reactance x' (mΩ/m): multicore ≈ 0.08 mΩ/m, singlecore trefoil ≈ 0.09, spaced ≈ 0.12
  const xPrime = cableArrangement === 'multicore' ? 0.08e-3 : 0.12e-3;

  // Upstream network impedance Z_source from Icc_amont (CEI 60909)
  // c_max = 1.05 for LV (Un = 400V)
  const cMax = 1.05;
  const cMin = 0.95;
  const zAmont = (cMax * voltageV) / (Math.sqrt(3) * iccAmontKa * 1000);
  const rAmont = 0.1 * zAmont; // Typically Ra ≈ 0.1 Xa for substation transformer / upstream grid
  const xAmont = Math.sqrt(Math.max(0, zAmont * zAmont - rAmont * rAmont));

  // Cable phase resistance and reactance
  const rCableCold = (rhoCold * lengthM) / sectionMm2;
  const rCableHot = (rhoHot * lengthM) / sectionMm2;
  const xCable = xPrime * lengthM;

  // PE / Neutral resistance
  const rPeHot = (rhoHot * lengthM) / peSectionMm2;

  // Total loop impedance
  // 1. Max 3-Phase fault (cold state, c_max): Z_t3 = √((Ra + Rc_cold)² + (Xa + Xc)²)
  const rTot3Cold = rAmont + rCableCold;
  const xTot3 = xAmont + xCable;
  const zTot3Cold = Math.sqrt(rTot3Cold * rTot3Cold + xTot3 * xTot3);
  const icc3MaxKa = (cMax * voltageV) / (Math.sqrt(3) * zTot3Cold * 1000);

  // 2. Min Phase-to-Phase fault at end (hot state, c_min):
  const rTot3Hot = rAmont + rCableHot;
  const zTot3Hot = Math.sqrt(rTot3Hot * rTot3Hot + xTot3 * xTot3);
  const icc2MinKa = (cMin * voltageV) / (2 * zTot3Hot * 1000);

  // 3. Min Phase-to-Neutral / PE fault (TN system, single phase fault):
  const rTot1Hot = rAmont + rCableHot + rPeHot;
  const xTot1 = xAmont + 2 * xCable;
  const zTot1Hot = Math.sqrt(rTot1Hot * rTot1Hot + xTot1 * xTot1);
  const vPhase = voltageV / Math.sqrt(3);
  const icc1MinKa = (cMin * vPhase) / (zTot1Hot * 1000);

  // Minimum fault current to be cleared by magnetic trip:
  const criticalIccMinA = Math.min(icc2MinKa, icc1MinKa) * 1000;
  const isMagneticTripCompliant = breakerMagTripA <= criticalIccMinA * 0.8; // 20% safety margin per NF C 15-105

  // Admissible thermal stress: k²·S²
  // k factor per IEC 60364-5-54: Cu/XLPE = 143, Cu/PVC = 115, Al/XLPE = 94, Al/PVC = 76
  const kFactor = material === 'cu' ? (insulationType === 'xlpe' ? 143 : 115) : (insulationType === 'xlpe' ? 94 : 76);
  const thermalWithstandA2s = Math.pow(kFactor * sectionMm2, 2);

  return (
    <div className="space-y-6">
      {injectedContextInfo && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">
              {locale === 'fr' ? 'Contexte Appareillage Injecté :' : 'Injected Equipment Context:'} <strong>{injectedContextInfo.equipmentName}</strong> ({injectedContextInfo.equipmentTag})
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">IEC 60909</span>
        </div>
      )}

      {/* Top Banner Standard Citation */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-black text-white">
              {locale === 'fr' ? 'Calcul Court-Circuit en Bout de Câble (Méthode des Impédances)' : 'Cable End Short-Circuit Calculator (Impedance Method)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {locale === 'fr'
                ? 'Conforme CEI 60909-0, NF C 15-105 Cl. 533 & guide UTE C 15-105. Vérification du pouvoir de coupure et du déclenchement magnétique.'
                : 'Compliant with IEC 60909-0, NF C 15-105 Cl. 533. Breaking capacity and instantaneous magnetic trip verification.'}
            </p>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-sky-400 px-3 py-1.5 rounded-lg bg-sky-950/80 border border-sky-800/60 self-start sm:self-auto">
          NF C 15-105 / IEC 60909
        </span>
      </div>

      {/* 2-Column Grid: Inputs & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>{locale === 'fr' ? 'Paramètres Réseau & Liaison Câble' : 'Network & Cable Parameters'}</span>
            </h4>

            {/* Row 1: Voltage & Upstream Icc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  {locale === 'fr' ? 'Tension assignée (Un)' : 'Nominal Voltage (Un)'}
                </label>
                <select
                  value={voltageV}
                  onChange={(e) => setVoltageV(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:border-sky-500 focus:outline-hidden"
                >
                  <option value={400}>400 V (Triphasé BT)</option>
                  <option value={230}>230 V (Monophasé BT)</option>
                  <option value={690}>690 V (Industriel / Éolien)</option>
                  <option value={15000}>15 kV (HTA Moyenne Tension)</option>
                  <option value={20000}>20 kV (HTA Distribution)</option>
                  <option value={30000}>30 kV (HTA Réseau Cameroun)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  {locale === 'fr' ? 'Icc amont disponible (kA)' : 'Upstream Fault Level (kA)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  step={0.5}
                  value={iccAmontKa}
                  onChange={(e) => setIccAmontKa(Math.max(0.1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:border-sky-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Row 2: Length & Phase Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  {locale === 'fr' ? 'Longueur de liaison (L en mètres)' : 'Cable Length (L in meters)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={2500}
                  step={1}
                  value={lengthM}
                  onChange={(e) => setLengthM(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  {locale === 'fr' ? 'Section de phase (mm²)' : 'Phase Cross-Section (mm²)'}
                </label>
                <select
                  value={sectionMm2}
                  onChange={(e) => {
                    const s = Number(e.target.value);
                    setSectionMm2(s);
                    setPeSectionMm2(s >= 25 ? s / 2 : s);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:border-sky-500 focus:outline-hidden"
                >
                  {[1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400].map((s) => (
                    <option key={s} value={s}>
                      {s} mm²
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Conductor Material & Insulation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  {locale === 'fr' ? 'Âme conductrice' : 'Conductor'}
                </label>
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setMaterial('cu')}
                    className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                      material === 'cu' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cuivre (Cu)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterial('al')}
                    className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                      material === 'al' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Alu (Al)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  {locale === 'fr' ? 'Isolant câble' : 'Insulation'}
                </label>
                <select
                  value={insulationType}
                  onChange={(e) => setInsulationType(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:border-sky-500"
                >
                  <option value="xlpe">PR / XLPE (90°C)</option>
                  <option value="pvc">PVC (70°C)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  {locale === 'fr' ? 'Pose câble' : 'Cable Lay'}
                </label>
                <select
                  value={cableArrangement}
                  onChange={(e) => setCableArrangement(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:border-sky-500"
                >
                  <option value="multicore">Multiconducteur (0.08 mΩ/m)</option>
                  <option value="singlecore">Monoconducteur (0.12 mΩ/m)</option>
                </select>
              </div>
            </div>

            {/* Row 4: Protection Breaker Magnetic Setting */}
            <div className="pt-3 border-t border-slate-800">
              <label className="block text-xs font-mono text-slate-300 mb-1">
                {locale === 'fr'
                  ? 'Seuil de déclenchement magnétique disjoncteur amont Im (A)'
                  : 'Upstream Breaker Magnetic Trip Threshold Im (A)'}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={10}
                  max={50000}
                  step={50}
                  value={breakerMagTripA}
                  onChange={(e) => setBreakerMagTripA(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:border-sky-500 focus:outline-hidden"
                />
                <span className="font-mono text-xs text-slate-400 shrink-0">ANSI 50</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {locale === 'fr'
                  ? 'Pour assurer la protection des personnes et des conducteurs, Im doit être < Icc min en bout de câble.'
                  : 'To safeguard personnel and conductors, Im must be strictly below Icc min at cable end.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Results Dashboard (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
              <span>{locale === 'fr' ? 'Résultats Déterministes' : 'Deterministic Results'}</span>
              <span className="text-emerald-400 font-bold">IEC 60909</span>
            </h4>

            {/* Primary KPI Card: Icc3 Max */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                {locale === 'fr' ? 'Icc Triphasé Maximal en Bout (Icc3 max)' : 'Max 3-Phase Short-Circuit (Icc3 max)'}
              </span>
              <div className="text-3xl font-mono font-black text-amber-400">
                {icc3MaxKa.toFixed(2)} <span className="text-lg font-bold text-slate-400">kA</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                {locale === 'fr'
                  ? 'Dimensionne le pouvoir de coupure (Icu / Icn) de l\'appareillage aval.'
                  : 'Sizes downstream apparatus breaking capacity (Icu / Icn).'}
              </p>
            </div>

            {/* Secondary KPI Card: Icc Min (Phase-Phase & Phase-Earth) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  {locale === 'fr' ? 'Icc Biphasé Min' : 'Min 2-Phase Icc'}
                </span>
                <div className="text-xl font-mono font-black text-sky-400 mt-1">
                  {icc2MinKa.toFixed(2)} <span className="text-xs font-bold text-slate-400">kA</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                  ({(icc2MinKa * 1000).toFixed(0)} A)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  {locale === 'fr' ? 'Icc Phase-Terre Min' : 'Min Phase-PE Icc'}
                </span>
                <div className="text-xl font-mono font-black text-sky-400 mt-1">
                  {icc1MinKa.toFixed(2)} <span className="text-xs font-bold text-slate-400">kA</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                  ({(icc1MinKa * 1000).toFixed(0)} A)
                </span>
              </div>
            </div>

            {/* Impedance Breakdown Table */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>R câble (chaud) :</span>
                <span className="text-slate-200">{rCableHot.toFixed(4)} Ω</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>X câble :</span>
                <span className="text-slate-200">{xCable.toFixed(4)} Ω</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Z amont :</span>
                <span className="text-slate-200">{zAmont.toFixed(4)} Ω</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800 font-bold">
                <span className="text-white">Z boucle totale :</span>
                <span className="text-emerald-400">{zTot3Hot.toFixed(4)} Ω</span>
              </div>
            </div>

            {/* Compliance Verdict Card */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isMagneticTripCompliant
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}
            >
              {isMagneticTripCompliant ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <div className="font-bold font-mono uppercase tracking-wide">
                  {isMagneticTripCompliant
                    ? locale === 'fr'
                      ? 'Déclenchement Magnétique Conforme'
                      : 'Compliant Magnetic Trip'
                    : locale === 'fr'
                    ? 'Non-Conforme : Risque Non-Déclenchement'
                    : 'Non-Compliant: Trip Failure Risk'}
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {isMagneticTripCompliant
                    ? locale === 'fr'
                      ? `Le seuil magnétique ${breakerMagTripA} A est inférieur à 80% de l'Icc minimal (${criticalIccMinA.toFixed(0)} A). Coupure garantie sous 0.4s.`
                      : `Magnetic trip ${breakerMagTripA} A is safely below 80% of min fault level (${criticalIccMinA.toFixed(0)} A). Trip within 0.4s guaranteed.`
                    : locale === 'fr'
                    ? `Le seuil magnétique ${breakerMagTripA} A est trop élevé vis-à-vis du courant minimal de court-circuit (${criticalIccMinA.toFixed(0)} A). Augmentez la section ou baissez le seuil Im.`
                      : `Magnetic trip ${breakerMagTripA} A exceeds min fault current threshold (${criticalIccMinA.toFixed(0)} A). Increase cable section or decrease trip setting.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
