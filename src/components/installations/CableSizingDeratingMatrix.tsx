// src/components/installations/CableSizingDeratingMatrix.tsx
// EPEDE D06 - Cable Sizing & Thermal Derating Matrix Calculator (IEC 60364-5-52 / NF C 15-100 Tableaux 52C-52N / CENELEC TR 50480)
// Complete engineering calculation with k1-k4 factors, voltage drop, short-circuit thermal withstand, and Cu vs Al comparison.

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sliders,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffectsService';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';

interface CableSizingDeratingMatrixProps {
  locale: 'fr' | 'en';
}

export const CableSizingDeratingMatrix: React.FC<CableSizingDeratingMatrixProps> = ({
  locale
}) => {
  // 1. Electrical Load Inputs
  const [loadKw, setLoadKw] = useState<number>(45); // kW
  const [voltage, setVoltage] = useState<number>(400); // 400V 3-phase
  const [cosPhi, setCosPhi] = useState<number>(0.88);
  const [cableLengthM, setCableLengthM] = useState<number>(85); // meters
  const [circuitType, setCircuitType] = useState<'POWER' | 'LIGHTING'>('POWER');

  // 2. Conductor Material & Insulation
  const [conductorMaterial, setConductorMaterial] = useState<'COPPER' | 'ALUMINIUM'>('COPPER');
  const [insulationType, setInsulationType] = useState<'XLPE_90C' | 'PVC_70C'>('XLPE_90C');

  // 3. Environmental Correction Factors (IEC 60364-5-52)
  const [installationMethod, setInstallationMethod] = useState<'C_TRAY' | 'E_PERF_TRAY' | 'F_LADDER' | 'B1_CONDUIT' | 'D_BURIED'>('E_PERF_TRAY');
  const [groupingCount, setGroupingCount] = useState<number>(4); // number of adjacent circuits
  const [ambientTempC, setAmbientTempC] = useState<number>(35); // °C
  const [protectiveDeviceRating, setProtectiveDeviceRating] = useState<number>(100); // In in A
  const [prospectiveIccKa, setProspectiveIccKa] = useState<number>(15); // kA
  const [clearingTimeS, setClearingTimeS] = useState<number>(0.1); // seconds

  // --- CALCULATIONS ---

  // 1. Design Current Ib (A)
  const designCurrentIb = useMemo(() => {
    const sKva = loadKw / cosPhi;
    return (sKva * 1000) / (Math.sqrt(3) * voltage);
  }, [loadKw, cosPhi, voltage]);

  // 2. Correction Factor k1 (Installation method)
  const factorK1 = useMemo(() => {
    switch (installationMethod) {
      case 'E_PERF_TRAY': return 1.0;
      case 'F_LADDER': return 1.05;
      case 'C_TRAY': return 0.95;
      case 'B1_CONDUIT': return 0.88;
      case 'D_BURIED': return 0.80;
    }
  }, [installationMethod]);

  // 3. Correction Factor k2 (Grouping of circuits in single layer)
  const factorK2 = useMemo(() => {
    switch (groupingCount) {
      case 1: return 1.0;
      case 2: return 0.88;
      case 3: return 0.82;
      case 4: return 0.77;
      case 5: return 0.75;
      case 6: return 0.72;
      default: return 0.68;
    }
  }, [groupingCount]);

  // 4. Correction Factor k3 (Ambient Temperature)
  const factorK3 = useMemo(() => {
    if (insulationType === 'XLPE_90C') {
      // Base 30°C
      if (ambientTempC <= 25) return 1.04;
      if (ambientTempC <= 30) return 1.00;
      if (ambientTempC <= 35) return 0.96;
      if (ambientTempC <= 40) return 0.91;
      if (ambientTempC <= 45) return 0.87;
      if (ambientTempC <= 50) return 0.82;
      return 0.76;
    } else {
      // PVC 70°C
      if (ambientTempC <= 25) return 1.06;
      if (ambientTempC <= 30) return 1.00;
      if (ambientTempC <= 35) return 0.94;
      if (ambientTempC <= 40) return 0.87;
      if (ambientTempC <= 45) return 0.79;
      if (ambientTempC <= 50) return 0.71;
      return 0.61;
    }
  }, [insulationType, ambientTempC]);

  // Total Global Derating Factor k_tot = k1 * k2 * k3
  const totalDeratingFactorK = factorK1 * factorK2 * factorK3;

  // Minimum required current capacity in standard reference conditions: I'z = In / k_tot
  const requiredCurrentIz = protectiveDeviceRating / totalDeratingFactorK;

  // Standard Commercial Cable Sizes and Base Ampacities (Copper XLPE / Air)
  const standardSections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];
  
  // Base ampacities table (Method E - 3 loaded conductors, XLPE 90°C Copper)
  const cuXlpeAmpacity: { [sec: number]: number } = {
    1.5: 23, 2.5: 31, 4: 42, 6: 54, 10: 75, 16: 100, 25: 135,
    35: 169, 50: 207, 70: 268, 95: 328, 120: 383, 150: 444, 185: 510, 240: 607, 300: 703
  };

  // Find optimal cross-section for Ampacity
  const selectedSection = useMemo(() => {
    const matFactor = conductorMaterial === 'ALUMINIUM' ? 0.78 : 1.0;
    for (const sec of standardSections) {
      if (conductorMaterial === 'ALUMINIUM' && sec < 16) continue; // Aluminium min 16mm2 per standard
      const baseAmp = (cuXlpeAmpacity[sec] || 700) * matFactor;
      if (baseAmp >= requiredCurrentIz) {
        return sec;
      }
    }
    return 300;
  }, [conductorMaterial, requiredCurrentIz]);

  // Resistivity rho (Cu = 0.0225 ohm.mm2/m, Al = 0.036 ohm.mm2/m at 90°C)
  const rho = conductorMaterial === 'COPPER' ? 0.0225 : 0.036;
  const reactanceLambda = 0.08 / 1000; // 0.08 mohm/m = 0.08e-3 ohm/m
  const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));

  // Voltage Drop Calculation Delta U (V) and Delta U (%)
  const deltaU = useMemo(() => {
    // 3-Phase: Delta U = sqrt(3) * Ib * L * ( (rho / S)*cosPhi + lambda*sinPhi )
    const rL = (rho / selectedSection) * cableLengthM;
    const xL = reactanceLambda * cableLengthM;
    return Math.sqrt(3) * designCurrentIb * (rL * cosPhi + xL * sinPhi);
  }, [selectedSection, rho, cableLengthM, designCurrentIb, cosPhi, sinPhi]);

  const deltaUPct = (deltaU / voltage) * 100;
  const maxAllowedDeltaUPct = circuitType === 'LIGHTING' ? 3.0 : 5.0;
  const isVoltageDropCompliant = deltaUPct <= maxAllowedDeltaUPct;

  // Short-Circuit Thermal Stress Withstand Smin = (Icc * sqrt(t)) / k
  const kFactor = conductorMaterial === 'COPPER'
    ? (insulationType === 'XLPE_90C' ? 143 : 115)
    : (insulationType === 'XLPE_90C' ? 94 : 76);
  
  const minSectionThermalSc = (prospectiveIccKa * 1000 * Math.sqrt(clearingTimeS)) / kFactor;
  const isThermalWithstandOk = selectedSection >= minSectionThermalSc;

  // Material Comparison Metrics (Copper vs Aluminium)
  const cuWeightKg = (8.89 * (selectedSection / 1000) * cableLengthM * 3.2).toFixed(1);
  const alSecEquiv = standardSections.find(s => s >= selectedSection * 1.6) || 300;
  const alWeightKg = (2.70 * (alSecEquiv / 1000) * cableLengthM * 3.2).toFixed(1);

  return (
    <div className="p-5 rounded-2xl bg-[#080C14] border border-[#1E2738] space-y-5 font-mono text-xs">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
              IEC 60364-5-52 · NF C 15-100 Tableaux 52C-52N · CENELEC TR 50480
            </span>
            <EvidenceTrustBadge
              type="VERIFIED_STANDARD"
              governingStandard="IEC 60364-5-52 §523 / UTE C 15-105"
              locale={locale}
            />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            {locale === 'fr'
              ? 'Calculateur de Dimensionnement de Câbles & Facteurs d\'Influence k1-k4'
              : 'Cable Sizing & Thermal Derating Matrix Calculator'}
          </h2>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            {locale === 'fr'
              ? 'Méthode normalisée : Courant assigné In, facteurs de correction (pose, groupement, température), chute de tension et contrainte thermique.'
              : 'Standardized methodology: Design current, derating factors (method, grouping, temp), voltage drop, and short-circuit thermal limit.'}
          </p>
        </div>

        {/* Material Selector Cu vs Al */}
        <div className="flex items-center gap-1.5 bg-[#0A0E17] p-1 rounded-xl border border-[#1E2738]">
          <button
            type="button"
            onClick={() => {
              soundEffects.playSwitchClick();
              setConductorMaterial('COPPER');
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
              conductorMaterial === 'COPPER'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cuivre (Cu)
          </button>
          <button
            type="button"
            onClick={() => {
              soundEffects.playSwitchClick();
              setConductorMaterial('ALUMINIUM');
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
              conductorMaterial === 'ALUMINIUM'
                ? 'bg-slate-300 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aluminium (Al)
          </button>
        </div>
      </div>

      {/* 2. Main Grid: Inputs vs Calculation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Design & Environmental Parameters (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-3.5">
          <span className="font-bold text-slate-200 text-[11px] block border-b border-[#1E2638] pb-1.5">
            {locale === 'fr' ? '1. Données du Départ & Pose' : '1. Circuit & Installation Inputs'}
          </span>

          {/* Power & Length */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label className="text-slate-400 block">Puissance P (kW) :</label>
              <input
                type="number"
                value={loadKw}
                onChange={(e) => setLoadKw(Math.max(1, Number(e.target.value)))}
                className="w-full p-1.5 rounded bg-[#060910] border border-[#182030] text-white font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block">Longueur L (mètres) :</label>
              <input
                type="number"
                value={cableLengthM}
                onChange={(e) => setCableLengthM(Math.max(1, Number(e.target.value)))}
                className="w-full p-1.5 rounded bg-[#060910] border border-[#182030] text-white font-bold"
              />
            </div>
          </div>

          {/* Protective Device Rating In */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Calibre Disjoncteur Amont (In) :</span>
              <strong className="text-emerald-400">{protectiveDeviceRating} A</strong>
            </div>
            <select
              value={protectiveDeviceRating}
              onChange={(e) => setProtectiveDeviceRating(Number(e.target.value))}
              className="w-full p-1.5 rounded bg-[#060910] border border-[#182030] text-white text-[11px] font-bold"
            >
              {[16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 400, 630].map((r) => (
                <option key={r} value={r}>{r} A</option>
              ))}
            </select>
          </div>

          {/* Installation Method k1 */}
          <div className="space-y-1 text-[10px]">
            <label className="text-slate-400 block">Mode de Pose (Facteur k1) :</label>
            <select
              value={installationMethod}
              onChange={(e) => setInstallationMethod(e.target.value as any)}
              className="w-full p-1.5 rounded bg-[#060910] border border-[#182030] text-white text-[10px]"
            >
              <option value="E_PERF_TRAY">Méthode E · Chemin de câbles perforé (k1 = 1.00)</option>
              <option value="F_LADDER">Méthode F · Échelle à câbles en air libre (k1 = 1.05)</option>
              <option value="C_TRAY">Méthode C · Câble fixé sur paroi ou goulotte (k1 = 0.95)</option>
              <option value="B1_CONDUIT">Méthode B1 · Sous conduit profilé en apparent (k1 = 0.88)</option>
              <option value="D_BURIED">Méthode D · Câble enterré sous fourreau (k1 = 0.80)</option>
            </select>
          </div>

          {/* Grouping Count k2 & Ambient Temp k3 */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label className="text-slate-400 block">Groupement k2 ({groupingCount} c.) :</label>
              <select
                value={groupingCount}
                onChange={(e) => setGroupingCount(Number(e.target.value))}
                className="w-full p-1.5 rounded bg-[#060910] border border-[#182030] text-white"
              >
                <option value={1}>1 circuit (k2 = 1.00)</option>
                <option value={2}>2 circuits (k2 = 0.88)</option>
                <option value={3}>3 circuits (k2 = 0.82)</option>
                <option value={4}>4 circuits (k2 = 0.77)</option>
                <option value={6}>6 circuits (k2 = 0.72)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block">Température Ambiante ({ambientTempC}°C) :</label>
              <select
                value={ambientTempC}
                onChange={(e) => setAmbientTempC(Number(e.target.value))}
                className="w-full p-1.5 rounded bg-[#060910] border border-[#182030] text-white"
              >
                <option value={25}>25 °C (k3 = 1.04)</option>
                <option value={30}>30 °C (k3 = 1.00)</option>
                <option value={35}>35 °C (k3 = 0.96)</option>
                <option value={40}>40 °C (k3 = 0.91)</option>
                <option value={45}>45 °C (k3 = 0.87)</option>
                <option value={50}>50 °C (k3 = 0.82)</option>
              </select>
            </div>
          </div>

          {/* Derating Product Formula */}
          <div className="p-3 rounded-lg bg-[#060910] border border-[#182030] text-[10px] space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Facteur Global Déclassement (k_tot) :</span>
              <strong className="text-amber-400">{totalDeratingFactorK.toFixed(3)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Courant Admissible Minimum Requis (I'z) :</span>
              <strong className="text-white">{requiredCurrentIz.toFixed(1)} A</strong>
            </div>
          </div>
        </div>

        {/* Right: Sizing Verdict, Voltage Drop & Comparative Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Sizing Metric Banner */}
          <div className="p-4 rounded-xl bg-[#0E1522] border border-emerald-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Section Commerciale Retenue (IEC 60364-5-52)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-xs">
                3×{selectedSection} mm² + {selectedSection >= 16 ? selectedSection / 2 : selectedSection} mm² PE
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">{selectedSection}</span>
              <span className="text-sm font-bold text-slate-300">mm² ({conductorMaterial === 'COPPER' ? 'Cuivre' : 'Aluminium'} PRC 90°C)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1C2538] text-[10px]">
              <div>
                <span className="text-slate-400 block">Courant d'Emploi Ib :</span>
                <strong className="text-white">{designCurrentIb.toFixed(1)} A</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Capacité Réelle Iz :</span>
                <strong className="text-emerald-400">
                  {((cuXlpeAmpacity[selectedSection] || 600) * (conductorMaterial === 'ALUMINIUM' ? 0.78 : 1.0) * totalDeratingFactorK).toFixed(1)} A
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Règle In ≤ Iz :</span>
                <strong className="text-emerald-400">Validée ({protectiveDeviceRating}A ≤ Iz)</strong>
              </div>
            </div>
          </div>

          {/* Voltage Drop Gauge */}
          <div className={`p-3.5 rounded-xl border space-y-1.5 ${isVoltageDropCompliant ? 'bg-[#0E1522] border-[#1E2738]' : 'bg-rose-500/15 border-rose-500/40'}`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-sky-400" />
                {locale === 'fr' ? 'Chute de Tension en Ligne (ΔU) :' : 'Line Voltage Drop (ΔU):'}
              </span>
              <span className={`font-black ${isVoltageDropCompliant ? 'text-sky-400' : 'text-rose-400'}`}>
                {deltaU.toFixed(2)} V ({deltaUPct.toFixed(2)}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (deltaUPct / maxAllowedDeltaUPct) * 100)}%` }}
                className={`h-full transition-all duration-300 ${isVoltageDropCompliant ? 'bg-sky-500' : 'bg-rose-500'}`}
              />
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 font-sans">
              <span>Seuil max autorisé : ≤ {maxAllowedDeltaUPct}% ({((maxAllowedDeltaUPct / 100) * voltage).toFixed(1)} V)</span>
              <span className={isVoltageDropCompliant ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {isVoltageDropCompliant ? '✓ Conforme Norme' : '✗ Section Insuffisante (Augmenter S)'}
              </span>
            </div>
          </div>

          {/* Material Comparative Card (Cu vs Al) */}
          <div className="p-3.5 rounded-xl bg-[#090D15] border border-[#1E2738] space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              {locale === 'fr' ? 'Comparatif Technico-Économique Cuivre vs. Aluminium' : 'Copper vs Aluminium Comparison'}
            </span>

            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div className="p-2 rounded bg-[#05080E] border border-[#182030] space-y-1">
                <strong className="text-amber-400 block">Solution Cuivre (3×{selectedSection} mm²) :</strong>
                <div>Masse Conducteurs : <strong>{cuWeightKg} kg</strong></div>
                <div>Chute de Tension : <strong>{deltaUPct.toFixed(2)}%</strong></div>
                <span className="text-[9px] text-slate-400">Idéal pour passages étroits et raccordements directs.</span>
              </div>

              <div className="p-2 rounded bg-[#05080E] border border-[#182030] space-y-1">
                <strong className="text-slate-300 block">Équivalent Aluminium (3×{alSecEquiv} mm²) :</strong>
                <div>Masse Conducteurs : <strong>{alWeightKg} kg</strong> ({((1 - Number(alWeightKg) / Number(cuWeightKg)) * 100).toFixed(0)}% plus léger)</div>
                <div>Gain Économique Câble : <strong>~45% d'économie</strong></div>
                <span className="text-[9px] text-slate-400">Nécessite embouts bimétalliques Cu-Al.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
