// src/components/calculators/modules/BusbarElectrodynamicCalculator.tsx
// Module 13: Busbar Electrodynamic Forces & Thermal Withstand (CEI 60865-1 / CEI 61936-1 / IEEE 605)
// EPEDE Supreme Engineering Platform

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  BarChart2,
  Gauge
} from 'lucide-react';

interface BusbarElectrodynamicCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
}

export type BusbarPreset = 'nachtigal_225_tube' | 'mangombe_90_tube' | 'switchgear_30kv_cu' | 'tgbt_400v_cu' | 'custom';

export const BusbarElectrodynamicCalculator: React.FC<BusbarElectrodynamicCalculatorProps> = ({ locale, onOpenReport }) => {
  // ---------------------------------------------------------------------------
  // INPUT STATE
  // ---------------------------------------------------------------------------
  const [activePreset, setActivePreset] = useState<BusbarPreset>('nachtigal_225_tube');

  // Electrical Short-Circuit Parameters
  const [unKv, setUnKv] = useState<number>(225); // Nominal system voltage (kV)
  const [ikPrimeKa, setIkPrimeKa] = useState<number>(31.5); // Symmetrical Isc (kA rms)
  const [ipKa, setIpKa] = useState<number>(80.0); // Peak short-circuit current (kA peak)
  const [ithKa, setIthKa] = useState<number>(31.5); // Thermal short-circuit current (kA)
  const [tkSec, setTkSec] = useState<number>(1.0); // Fault duration (s)
  const [faultType, setFaultType] = useState<'3ph' | '2ph'>('3ph');

  // Geometry & Installation
  const [conductorProfile, setConductorProfile] = useState<'tube' | 'flat'>('tube');
  const [material, setMaterial] = useState<'al_alloy' | 'cu_etp'>('al_alloy');
  
  // Tube dimensions
  const [outerDiaMm, setOuterDiaMm] = useState<number>(120); // D (mm)
  const [wallThickMm, setWallThickMm] = useState<number>(10); // s (mm)
  
  // Flat bar dimensions
  const [barWidthMm, setBarWidthMm] = useState<number>(80); // h (mm)
  const [barThickMm, setBarThickMm] = useState<number>(10); // b (mm)
  const [subBarsCount, setSubBarsCount] = useState<number>(1); // n (1, 2, 3)
  const [subBarSpacingMm, setSubBarSpacingMm] = useState<number>(10); // as (mm)
  const [barArrangement, setBarArrangement] = useState<'edge_to_edge' | 'face_to_face'>('edge_to_edge');

  // Span & Support Spacing
  const [centerDistanceA_M, setCenterDistanceA_M] = useState<number>(3.5); // a (m)
  const [spanLengthL_M, setSpanLengthL_M] = useState<number>(8.0); // l (m)
  const [supportCondition, setSupportCondition] = useState<'simply_supported' | 'continuous'>('continuous');
  const [insulatorRatingFrKn, setInsulatorRatingFrKn] = useState<number>(12.0); // Fr (kN cantilever)

  // ---------------------------------------------------------------------------
  // PRESET SELECTION
  // ---------------------------------------------------------------------------
  const handleApplyPreset = (preset: BusbarPreset) => {
    setActivePreset(preset);
    if (preset === 'nachtigal_225_tube') {
      setUnKv(225);
      setIkPrimeKa(31.5);
      setIpKa(80.0);
      setIthKa(31.5);
      setTkSec(1.0);
      setFaultType('3ph');
      setConductorProfile('tube');
      setMaterial('al_alloy');
      setOuterDiaMm(120);
      setWallThickMm(10);
      setCenterDistanceA_M(3.5);
      setSpanLengthL_M(8.0);
      setSupportCondition('continuous');
      setInsulatorRatingFrKn(12.0);
    } else if (preset === 'mangombe_90_tube') {
      setUnKv(90);
      setIkPrimeKa(25.0);
      setIpKa(63.0);
      setIthKa(25.0);
      setTkSec(1.0);
      setFaultType('3ph');
      setConductorProfile('tube');
      setMaterial('al_alloy');
      setOuterDiaMm(80);
      setWallThickMm(8);
      setCenterDistanceA_M(2.0);
      setSpanLengthL_M(6.0);
      setSupportCondition('continuous');
      setInsulatorRatingFrKn(10.0);
    } else if (preset === 'switchgear_30kv_cu') {
      setUnKv(30);
      setIkPrimeKa(25.0);
      setIpKa(63.0);
      setIthKa(25.0);
      setTkSec(1.0);
      setFaultType('3ph');
      setConductorProfile('flat');
      setMaterial('cu_etp');
      setBarWidthMm(80);
      setBarThickMm(10);
      setSubBarsCount(1);
      setBarArrangement('edge_to_edge');
      setCenterDistanceA_M(0.25);
      setSpanLengthL_M(0.8);
      setSupportCondition('simply_supported');
      setInsulatorRatingFrKn(7.5);
    } else if (preset === 'tgbt_400v_cu') {
      setUnKv(0.4);
      setIkPrimeKa(50.0);
      setIpKa(105.0);
      setIthKa(50.0);
      setTkSec(1.0);
      setFaultType('3ph');
      setConductorProfile('flat');
      setMaterial('cu_etp');
      setBarWidthMm(100);
      setBarThickMm(10);
      setSubBarsCount(2);
      setSubBarSpacingMm(10);
      setBarArrangement('edge_to_edge');
      setCenterDistanceA_M(0.10);
      setSpanLengthL_M(0.5);
      setSupportCondition('continuous');
      setInsulatorRatingFrKn(5.0);
    }
  };

  // ---------------------------------------------------------------------------
  // COMPUTATION ENGINE ACCORDING TO IEC 60865-1
  // ---------------------------------------------------------------------------
  const calc = useMemo(() => {
    // 1. Material Properties
    // Al alloy EN AW-6101B T6: density=2700 kg/m³, E=70,000 MPa, Rp0.2=150 MPa, kθ=88
    // Cu-ETP R200/R250: density=8900 kg/m³, E=110,000 MPa, Rp0.2=200 MPa, kθ=135
    const isAl = material === 'al_alloy';
    const densityKgM3 = isAl ? 2700 : 8900;
    const youngModulusMpa = isAl ? 70000 : 110000;
    const yieldStrengthRp02 = isAl ? 150 : 200; // MPa or N/mm²
    const kTheta = isAl ? 88 : 135; // A·s^0.5 / mm²
    const qFactor = isAl ? 1.5 : 1.4; // Permissible stress dynamic factor under short circuit

    // 2. Cross-Sectional Geometry
    let areaMm2 = 0;
    let momentOfInertiaMm4 = 0; // Iy (principal bending axis)
    let sectionModulusMm3 = 0; // Wm (bending section modulus)
    let betaFactor = 1.0; // Plastic deformation resistance factor

    if (conductorProfile === 'tube') {
      const dExt = outerDiaMm;
      const dInt = Math.max(1, outerDiaMm - 2 * wallThickMm);
      areaMm2 = (Math.PI / 4) * (dExt ** 2 - dInt ** 2);
      momentOfInertiaMm4 = (Math.PI / 64) * (dExt ** 4 - dInt ** 4);
      sectionModulusMm3 = (2 * momentOfInertiaMm4) / dExt;
      betaFactor = 1.0; // Circular cross-section
    } else {
      // Flat Rectangular Bar
      const h = barWidthMm;
      const b = barThickMm;
      const n = subBarsCount;
      areaMm2 = n * h * b;

      // In three-phase busbars, electrodynamic repulsive force acts along the line connecting phase centers.
      // If bars are on edge ('edge_to_edge'): force bends the bar along its strong axis (h)
      // If bars are face to face ('face_to_face'): force bends along weak axis (b)
      if (barArrangement === 'edge_to_edge') {
        momentOfInertiaMm4 = (n * b * h ** 3) / 12;
        sectionModulusMm3 = (n * b * h ** 2) / 6;
      } else {
        momentOfInertiaMm4 = (n * h * b ** 3) / 12;
        sectionModulusMm3 = (n * h * b ** 2) / 6;
      }
      betaFactor = 0.73; // IEC 60865-1 §3.2.2.1 factor for rectangular bars
    }

    // Linear mass m' (kg/m)
    const linearMassKgM = (areaMm2 * 1e-6) * densityKgM3;

    // 3. Peak Electrodynamic Force Between Main Conductors (CEI 60865-1 Eq 1 & 2)
    // Three-phase fault: Fm = (µ0 / 2π) * (√3 / 2) * (Ip² / a) * l
    // Two-phase fault: Fm = (µ0 / 2π) * (Ip² / a) * l
    // µ0 / 2π = 0.2 * 10^-6 N/A² = 0.2 N / (kA² · m)
    const factorFault = faultType === '3ph' ? (Math.sqrt(3) / 2) : 1.0;
    const fmForceN = 0.2 * factorFault * ((ipKa ** 2) / centerDistanceA_M) * spanLengthL_M;
    const fmForcePerMeterN = fmForceN / spanLengthL_M;

    // 4. Natural Mechanical Eigenfrequency fc (CEI 60865-1 §3.2.1)
    // fc = (cf / l²) * sqrt(E * Iy / m')
    // cf = pi / 2 = 1.57 (simply supported), cf = 3.56 (continuous / clamped beam)
    const cf = supportCondition === 'continuous' ? 3.56 : 1.57;
    const ePa = youngModulusMpa * 1e6; // N/m²
    const iyM4 = momentOfInertiaMm4 * 1e-12; // m^4
    const fcHz = (cf / (spanLengthL_M ** 2)) * Math.sqrt((ePa * iyM4) / linearMassKgM);

    // 5. Dynamic Stress Amplification Factors V_sigma and V_F (CEI 60865-1 §3.2.2.2)
    // Accounts for mechanical resonant response near 50 Hz (fundamental) or 100 Hz (double frequency)
    let vSigma = 1.0;
    let vF = 1.0;
    const fn = 50; // Nominal frequency (Cameroon/Europe grid)

    if (fcHz < 0.5 * fn) {
      vSigma = 1.0;
      vF = 1.0;
    } else if (fcHz >= 0.5 * fn && fcHz <= 2.2 * fn) {
      // Mechanical resonance amplification zone
      const ratio = fcHz / fn;
      if (ratio >= 0.8 && ratio <= 1.2) {
        vSigma = 2.4; // High resonant response near 50 Hz
        vF = 2.2;
      } else if (ratio >= 1.8 && ratio <= 2.2) {
        vSigma = 2.0; // Double frequency resonance near 100 Hz
        vF = 1.9;
      } else {
        vSigma = 1.6;
        vF = 1.5;
      }
    } else {
      vSigma = 1.0;
      vF = 1.0;
    }

    // 6. Bending Stress sigma_m (CEI 60865-1 Eq 12)
    // Continuous multi-span beam: M = (Fm * l) / 10 to 12
    // Simply supported beam: M = (Fm * l) / 8
    const momentDivider = supportCondition === 'continuous' ? 12 : 8;
    const bendingMomentN_Mm = (fmForceN * (spanLengthL_M * 1000)) / momentDivider;
    const sigmaMm = (vSigma * betaFactor * bendingMomentN_Mm) / sectionModulusMm3; // N/mm² (MPa)
    const sigmaPermissibleMpa = qFactor * yieldStrengthRp02; // MPa
    const stressRatio = sigmaMm / sigmaPermissibleMpa;
    const isStressOk = stressRatio <= 1.0;

    // 7. Insulator Cantilever Dynamic Load Fd (CEI 60865-1 Eq 16)
    // Fd = V_F * alpha * Fm
    // alpha = 1.0 for end support, alpha = 1.25 for intermediate support of continuous beam
    const alphaInsulator = supportCondition === 'continuous' ? 1.25 : 1.0;
    const fdInsulatorN = vF * alphaInsulator * fmForceN;
    const fdInsulatorKn = fdInsulatorN / 1000;
    // Permissible insulator load = 0.8 * Fr (IEC 60865-1 recommended safety factor)
    const frPermissibleKn = 0.8 * insulatorRatingFrKn;
    const insulatorLoadRatio = fdInsulatorKn / frPermissibleKn;
    const isInsulatorOk = insulatorLoadRatio <= 1.0;

    // 8. Thermal Short-Circuit Withstand (CEI 60865-1 §4.1)
    // S_th = (Ith * sqrt(tk)) / k_theta * 1000 (mm²)
    const sThMinMm2 = ((ithKa * 1000 * Math.sqrt(tkSec)) / kTheta);
    const thermalRatio = sThMinMm2 / areaMm2;
    const isThermalOk = areaMm2 >= sThMinMm2;

    // Adiabatic temperature rise delta_theta (°C)
    // Approx Δθ = (Ith / A)² * tk * constant
    const deltaThetaC = (ithKa * 1000 / areaMm2) ** 2 * tkSec * (isAl ? 0.0078 : 0.0042);
    const initialTempC = 40; // Ambient / operating reference
    const finalTempC = initialTempC + deltaThetaC;
    const maxAllowedTempC = isAl ? 200 : 250; // CEI 60865-1 permissible short-circuit temperature

    return {
      isAl,
      areaMm2,
      momentOfInertiaMm4,
      sectionModulusMm3,
      linearMassKgM,
      fmForceN,
      fmForcePerMeterN,
      fcHz,
      vSigma,
      vF,
      bendingMomentN_Mm,
      sigmaMm,
      sigmaPermissibleMpa,
      stressRatio,
      isStressOk,
      fdInsulatorKn,
      frPermissibleKn,
      insulatorLoadRatio,
      isInsulatorOk,
      sThMinMm2,
      thermalRatio,
      isThermalOk,
      deltaThetaC,
      finalTempC,
      maxAllowedTempC,
    };
  }, [
    conductorProfile,
    material,
    outerDiaMm,
    wallThickMm,
    barWidthMm,
    barThickMm,
    subBarsCount,
    barArrangement,
    centerDistanceA_M,
    spanLengthL_M,
    supportCondition,
    insulatorRatingFrKn,
    ipKa,
    ithKa,
    tkSec,
    faultType,
  ]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
              <ShieldAlert className="h-4 w-4" />
              <span className="uppercase tracking-wider font-bold">MODULE 13 · CEI 60865-1 / CEI 61936-1 / IEEE 605</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F3F4F6]">
              {locale === 'fr'
                ? 'Dimensionnement Électrodynamique & Thermique des Jeux de Barres'
                : 'Busbar Short-Circuit Mechanical & Thermal Sizing'}
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Calcul normatif des forces électrodynamiques de crête (Fm), contraintes mécaniques de flexion (σm) sous résonance propre (fc), efforts admissibles sur isolateurs supports (Fd) et tenue thermique adiabatique de court-circuit (Sth).'
                : 'Scientific calculation of peak electrodynamic forces (Fm), bending stresses (σm) under mechanical eigenfrequency resonance (fc), insulator cantilever forces (Fd), and adiabatic thermal short-circuit withstand (Sth).'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenReport && (
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
              >
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Note de Calcul' : 'Calculation Note'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Engineering Presets Selector */}
        <div className="mt-5 pt-4 border-t border-[#252E38]/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-400 uppercase font-semibold mr-1">
            {locale === 'fr' ? 'Configurations Industrielles :' : 'Standard Presets:'}
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset('nachtigal_225_tube')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              activePreset === 'nachtigal_225_tube'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-[#161C24] border-[#252E38] text-neutral-400 hover:text-white'
            }`}
          >
            Poste 225 kV Tube Al (Nachtigal)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('mangombe_90_tube')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              activePreset === 'mangombe_90_tube'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-[#161C24] border-[#252E38] text-neutral-400 hover:text-white'
            }`}
          >
            Poste 90 kV Tube Al (Mangombé)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('switchgear_30kv_cu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              activePreset === 'switchgear_30kv_cu'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-[#161C24] border-[#252E38] text-neutral-400 hover:text-white'
            }`}
          >
            Cellule HTA 30 kV Cu (80x10)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('tgbt_400v_cu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              activePreset === 'tgbt_400v_cu'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-[#161C24] border-[#252E38] text-neutral-400 hover:text-white'
            }`}
          >
            Jeu de Barres TGBT 400 V Cu (2x 100x10)
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results & Interactive CAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col (5 cols): Parameter Controls */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Section A: Electrical Fault Inputs */}
          <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#252E38] pb-3">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Paramètres de Court-Circuit (CEI 60909)' : 'Short-Circuit Parameters'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="text-[11px] text-neutral-400">Tension Un (kV):</label>
                <input
                  type="number"
                  step="any"
                  value={unKv}
                  onChange={(e) => { setUnKv(parseFloat(e.target.value) || 0); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Type de Défaut :</label>
                <select
                  value={faultType}
                  onChange={(e) => { setFaultType(e.target.value as any); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                >
                  <option value="3ph">Triphasé Symétrique (3-ph)</option>
                  <option value="2ph">Biphasé Isolé (2-ph)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Courant Initial I"k (kA rms):</label>
                <input
                  type="number"
                  step="0.5"
                  value={ikPrimeKa}
                  onChange={(e) => { setIkPrimeKa(parseFloat(e.target.value) || 0); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Courant de Crête Ip (kA peak):</label>
                <input
                  type="number"
                  step="1"
                  value={ipKa}
                  onChange={(e) => { setIpKa(parseFloat(e.target.value) || 0); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-rose-300 font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Thermique Ith (kA):</label>
                <input
                  type="number"
                  step="0.5"
                  value={ithKa}
                  onChange={(e) => { setIthKa(parseFloat(e.target.value) || 0); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Durée tk (s):</label>
                <input
                  type="number"
                  step="0.1"
                  value={tkSec}
                  onChange={(e) => { setTkSec(parseFloat(e.target.value) || 0); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-amber-300 font-bold mt-1"
                />
              </div>
            </div>
          </div>

          {/* Section B: Conductor Geometry & Material */}
          <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#252E38] pb-3">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Profil Conducteur & Métal' : 'Conductor Profile & Material'}</span>
            </h3>

            {/* Profile Selector Toggle */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => { setConductorProfile('tube'); setActivePreset('custom'); }}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  conductorProfile === 'tube'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#161C24] border-[#252E38] text-neutral-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? 'Tube Rigide (AIS Poste)' : 'Rigid Tube (AIS Substation)'}
              </button>
              <button
                type="button"
                onClick={() => { setConductorProfile('flat'); setActivePreset('custom'); }}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  conductorProfile === 'flat'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#161C24] border-[#252E38] text-neutral-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? 'Barre Plate (Cellule HTA/BT)' : 'Flat Bar (Switchgear/TGBT)'}
              </button>
            </div>

            {/* Material Selector */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-[11px] text-neutral-400">Matériau Conducteur :</label>
              <select
                value={material}
                onChange={(e) => { setMaterial(e.target.value as any); setActivePreset('custom'); }}
                className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold"
              >
                <option value="al_alloy">Aluminium Alliage EN AW-6101B T6 (Almelec / Al-Mg-Si)</option>
                <option value="cu_etp">Cuivre Électrolytique Cu-ETP R200 / R250</option>
              </select>
            </div>

            {/* Conditional Geometry Inputs */}
            {conductorProfile === 'tube' ? (
              <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-1">
                <div>
                  <label className="text-[11px] text-neutral-400">Diamètre Extérieur D (mm):</label>
                  <input
                    type="number"
                    value={outerDiaMm}
                    onChange={(e) => { setOuterDiaMm(parseFloat(e.target.value) || 0); setActivePreset('custom'); }}
                    className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400">Épaisseur Paroi s (mm):</label>
                  <input
                    type="number"
                    value={wallThickMm}
                    onChange={(e) => { setWallThickMm(parseFloat(e.target.value) || 0); setActivePreset('custom'); }}
                    className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400">Largeur Barre h (mm):</label>
                    <input
                      type="number"
                      value={barWidthMm}
                      onChange={(e) => { setBarWidthMm(parseFloat(e.target.value) || 0); setActivePreset('custom'); }}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400">Épaisseur Barre b (mm):</label>
                    <input
                      type="number"
                      value={barThickMm}
                      onChange={(e) => { setBarThickMm(parseFloat(e.target.value) || 0); setActivePreset('custom'); }}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400">Nb Barres / Phase (n):</label>
                    <select
                      value={subBarsCount}
                      onChange={(e) => { setSubBarsCount(parseInt(e.target.value) || 1); setActivePreset('custom'); }}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                    >
                      <option value={1}>1 barre par phase</option>
                      <option value={2}>2 barres jumelées</option>
                      <option value={3}>3 barres jumelées</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400">Disposition :</label>
                    <select
                      value={barArrangement}
                      onChange={(e) => { setBarArrangement(e.target.value as any); setActivePreset('custom'); }}
                      className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                    >
                      <option value="edge_to_edge">Sur chant (Haute rigidité)</option>
                      <option value="face_to_face">À plat (Face à face)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section C: Spacing & Insulators */}
          <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#252E38] pb-3">
              <Maximize2 className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Entraxe & Portée des Supports' : 'Span & Insulator Supports'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="text-[11px] text-neutral-400">Entraxe Phases a (m):</label>
                <input
                  type="number"
                  step="0.05"
                  value={centerDistanceA_M}
                  onChange={(e) => { setCenterDistanceA_M(parseFloat(e.target.value) || 0.1); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Portée entre Supports l (m):</label>
                <input
                  type="number"
                  step="0.1"
                  value={spanLengthL_M}
                  onChange={(e) => { setSpanLengthL_M(parseFloat(e.target.value) || 0.1); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Type de Poutre :</label>
                <select
                  value={supportCondition}
                  onChange={(e) => { setSupportCondition(e.target.value as any); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-[#F3F4F6] font-bold mt-1"
                >
                  <option value="continuous">Continue multi-travées (AIS)</option>
                  <option value="simply_supported">Poutre simple 2 appuis</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400">Tenue Isolateur Fr (kN):</label>
                <input
                  type="number"
                  step="0.5"
                  value={insulatorRatingFrKn}
                  onChange={(e) => { setInsulatorRatingFrKn(parseFloat(e.target.value) || 1); setActivePreset('custom'); }}
                  className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-emerald-300 font-bold mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (7 cols): Visual CAD Representation & Scientific Verdict Cards */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Scientific Verdict Banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Mechanical Bending Stress */}
            <div className={`p-4 rounded-2xl border transition-all ${
              calc.isStressOk 
                ? 'bg-emerald-950/40 border-emerald-500/50' 
                : 'bg-rose-950/40 border-rose-500/50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Contrainte σm :</span>
                {calc.isStressOk ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> CONFORME
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> RUPTURE
                  </span>
                )}
              </div>
              <div className="text-2xl font-black font-mono text-[#F3F4F6]">
                {calc.sigmaMm.toFixed(1)} <span className="text-xs font-normal text-neutral-400">MPa</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-1">
                Admissible: {calc.sigmaPermissibleMpa.toFixed(1)} MPa ({((calc.stressRatio) * 100).toFixed(0)}%)
              </div>
            </div>

            {/* 2. Insulator Cantilever Load */}
            <div className={`p-4 rounded-2xl border transition-all ${
              calc.isInsulatorOk 
                ? 'bg-emerald-950/40 border-emerald-500/50' 
                : 'bg-rose-950/40 border-rose-500/50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Effort Isolateur Fd :</span>
                {calc.isInsulatorOk ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> CONFORME
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> SURCHARGE
                  </span>
                )}
              </div>
              <div className="text-2xl font-black font-mono text-[#F3F4F6]">
                {calc.fdInsulatorKn.toFixed(2)} <span className="text-xs font-normal text-neutral-400">kN</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-1">
                Limite (0.8 Fr): {calc.frPermissibleKn.toFixed(2)} kN ({((calc.insulatorLoadRatio) * 100).toFixed(0)}%)
              </div>
            </div>

            {/* 3. Thermal Short-Circuit Withstand */}
            <div className={`p-4 rounded-2xl border transition-all ${
              calc.isThermalOk 
                ? 'bg-emerald-950/40 border-emerald-500/50' 
                : 'bg-rose-950/40 border-rose-500/50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Tenue Thermique :</span>
                {calc.isThermalOk ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> CONFORME
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> SOUS-DIM
                  </span>
                )}
              </div>
              <div className="text-2xl font-black font-mono text-[#F3F4F6]">
                {calc.areaMm2.toFixed(0)} <span className="text-xs font-normal text-neutral-400">mm²</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-1">
                Sth min: {calc.sThMinMm2.toFixed(0)} mm² (T_fin: {calc.finalTempC.toFixed(0)}°C)
              </div>
            </div>
          </div>

          {/* Interactive 2D Engineering Vector CAD Diagram */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl relative overflow-hidden cad-grid-pattern">
            <div className="flex items-center justify-between text-xs font-mono border-b border-[#252E38] pb-3 mb-4">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Activity className="h-4 w-4" />
                {locale === 'fr' ? 'SCHÉMA DYNAMIQUE DES FORCES DE LAPLACE' : 'ELECTRODYNAMIC REPULSION VECTOR CAD'}
              </span>
              <span className="text-neutral-500">CEI 60865-1 SECTION 3</span>
            </div>

            <svg viewBox="0 0 640 280" className="w-full h-auto select-none">
              <defs>
                <marker id="arrow-force" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#F43F5E" />
                </marker>
                <marker id="dim-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 2 L 10 5 L 0 8 z" fill="#38BDF8" />
                </marker>
              </defs>

              {/* Insulator Supports Base Gantries */}
              <g stroke="#374151" strokeWidth="2" strokeDasharray="3 3">
                <line x1="80" y1="210" x2="560" y2="210" />
              </g>

              {/* Support Insulators (Left & Right) */}
              {/* Phase 1 Support (Top) */}
              <rect x="70" y="45" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
              <rect x="550" y="45" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />

              {/* Phase 2 Support (Middle) */}
              <rect x="70" y="115" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
              <rect x="550" y="115" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />

              {/* Phase 3 Support (Bottom) */}
              <rect x="70" y="185" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
              <rect x="550" y="185" width="20" height="25" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />

              {/* 3 Busbars Horizontal Spans */}
              {/* Phase L1 */}
              <rect
                x="80"
                y="52"
                width="480"
                height={conductorProfile === 'tube' ? 12 : 8}
                rx="2"
                fill={calc.isAl ? '#94A3B8' : '#F97316'}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="50" y="62" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">L1</text>

              {/* Phase L2 */}
              <rect
                x="80"
                y="122"
                width="480"
                height={conductorProfile === 'tube' ? 12 : 8}
                rx="2"
                fill={calc.isAl ? '#94A3B8' : '#F97316'}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="50" y="132" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">L2</text>

              {/* Phase L3 */}
              <rect
                x="80"
                y="192"
                width="480"
                height={conductorProfile === 'tube' ? 12 : 8}
                rx="2"
                fill={calc.isAl ? '#94A3B8' : '#F97316'}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text x="50" y="202" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">L3</text>

              {/* Force Vectors (Red Arrows demonstrating mutual electrodynamic repulsion) */}
              {/* Repulsion L1 away from L2 */}
              <line x1="320" y1="52" x2="320" y2="20" stroke="#F43F5E" strokeWidth="3" markerEnd="url(#arrow-force)" />
              <text x="330" y="32" fill="#F43F5E" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Fm = {(calc.fmForcePerMeterN).toFixed(0)} N/m
              </text>

              {/* Repulsion L3 away from L2 */}
              <line x1="320" y1="204" x2="320" y2="236" stroke="#F43F5E" strokeWidth="3" markerEnd="url(#arrow-force)" />
              <text x="330" y="235" fill="#F43F5E" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Fm = {(calc.fmForcePerMeterN).toFixed(0)} N/m
              </text>

              {/* Dimensions: Span Length L */}
              <line x1="80" y1="255" x2="560" y2="255" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="80" cy="255" r="3" fill="#38BDF8" />
              <circle cx="560" cy="255" r="3" fill="#38BDF8" />
              <text x="280" y="270" fill="#38BDF8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                Portée l = {spanLengthL_M} m
              </text>

              {/* Dimensions: Phase Center Distance a */}
              <line x1="590" y1="58" x2="590" y2="128" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="590" cy="58" r="3" fill="#38BDF8" />
              <circle cx="590" cy="128" r="3" fill="#38BDF8" />
              <text x="600" y="98" fill="#38BDF8" fontSize="10" fontFamily="monospace">
                a = {centerDistanceA_M} m
              </text>
            </svg>

            {/* Diagram Legend & Status Indicator */}
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-[#252E38] pt-2 mt-2">
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-rose-500" />
                <span>Force répulsive de Laplace (Fm total = {(calc.fmForceN / 1000).toFixed(2)} kN)</span>
              </span>
              <span>Fréquence propre mécanique fc = <strong className="text-cyan-300">{calc.fcHz.toFixed(1)} Hz</strong></span>
            </div>
          </div>

          {/* Detailed Scientific Derivations & Compliance Table */}
          <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
            <h3 className="font-bold text-sm text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2 border-b border-[#252E38] pb-3">
              <BarChart2 className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Détail des Calculs Numériques (CEI 60865-1)' : 'Scientific Derivations (IEC 60865-1)'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">SECTION & INERTIE</span>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{calc.areaMm2.toFixed(1)} mm²</div>
                <div className="text-[10px] text-neutral-400">Iy: {(calc.momentOfInertiaMm4 / 1e4).toFixed(1)} cm⁴</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">MASSE LINÉIQUE</span>
                <div className="text-sm font-bold text-[#F3F4F6] mt-0.5">{calc.linearMassKgM.toFixed(2)} kg/m</div>
                <div className="text-[10px] text-neutral-400">{calc.isAl ? 'Aluminium 2.7 t/m³' : 'Cuivre 8.9 t/m³'}</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">RÉSONANCE PROPRE</span>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{calc.fcHz.toFixed(1)} Hz</div>
                <div className="text-[10px] text-neutral-400">Amplification Vσ: {calc.vSigma.toFixed(2)}</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">MOMENT FLÉCHISSANT</span>
                <div className="text-sm font-bold text-[#F3F4F6] mt-0.5">{(calc.bendingMomentN_Mm / 1e6).toFixed(2)} kN·m</div>
                <div className="text-[10px] text-neutral-400">Section Wm: {(calc.sectionModulusMm3 / 1e3).toFixed(1)} cm³</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">ÉCHAUFFEMENT COURT-CIRCUIT</span>
                <div className="text-sm font-bold text-amber-300 mt-0.5">+{calc.deltaThetaC.toFixed(1)} °C</div>
                <div className="text-[10px] text-neutral-400">T_max: {calc.finalTempC.toFixed(1)} / {calc.maxAllowedTempC}°C</div>
              </div>

              <div className="bg-[#161C24] p-3 rounded-xl border border-[#252E38]">
                <span className="text-[10px] text-neutral-500 uppercase">FORCE SUR ISOLATEUR</span>
                <div className="text-sm font-bold text-emerald-300 mt-0.5">{calc.fdInsulatorKn.toFixed(2)} kN</div>
                <div className="text-[10px] text-neutral-400">Marge: {((1 - calc.insulatorLoadRatio) * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Standard Recommendations Text */}
            <div className="bg-[#161C24]/80 p-3 rounded-xl border border-[#252E38] text-[11px] text-neutral-300 leading-relaxed">
              <span className="font-bold text-cyan-400">Recommandation Normative CEI 61936-1 / CEI 60865-1 : </span>
              {calc.isStressOk && calc.isInsulatorOk && calc.isThermalOk ? (
                <span>
                  L’ensemble jeu de barres et supports isolateurs satisfait pleinement aux critères de tenue mécanique et thermique sous court-circuit. La fréquence propre ({calc.fcHz.toFixed(1)} Hz) est suffisamment éloignée de la zone de résonance destructive critique à 100 Hz.
                </span>
              ) : (
                <span className="text-rose-300">
                  Avertissement : {calc.isStressOk ? '' : 'La contrainte de flexion dépasse la limite élastique admissible. '}
                  {calc.isInsulatorOk ? '' : 'L’effort dynamique transmis aux isolateurs dépasse 80% de leur charge de rupture Fr. '}
                  {calc.isThermalOk ? '' : 'La section thermique minimale n’est pas respectée. '}
                  Augmenter l’entraxe des phases, réduire la portée entre supports ou choisir une section/matière supérieure.
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
