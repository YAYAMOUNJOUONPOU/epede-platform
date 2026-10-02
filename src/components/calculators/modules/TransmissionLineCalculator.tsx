// src/components/calculators/modules/TransmissionLineCalculator.tsx
// Module 15: Overhead Transmission Line Parameters, Bundle Geometry & Corona Loss (IEC 60826 / IEEE 738 / Peek's Law)
// High-Voltage Line Engineering & Telemetry - EPEDE Technical Council

import React, { useState, useMemo } from 'react';
import {
  Zap,
  Globe,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Thermometer,
  CloudRain,
  Sun,
  Wind,
  Compass,
  ArrowRight
} from 'lucide-react';

interface TransmissionLineCalculatorProps {
  locale: 'fr' | 'en';
  onOpenReport?: () => void;
  initialParams?: {
    unKv?: number;
    voltageNominal?: number;
    lineLengthKm?: number;
    lengthKm?: number;
    transferredPowerMw?: number;
    powerMw?: number;
    conductorCode?: string;
  };
  injectedContextInfo?: {
    equipmentName: string;
    equipmentTag?: string;
  };
}

export type LinePreset =
  | 'nachtigal_nyom_225kv'
  | 'edea_mangombe_225kv'
  | 'bekoko_nkongsamba_90kv'
  | 'interconnexion_400kv'
  | 'custom';

export const TransmissionLineCalculator: React.FC<TransmissionLineCalculatorProps> = ({
  locale,
  onOpenReport,
  initialParams,
  injectedContextInfo,
}) => {
  // ---------------------------------------------------------------------------
  // 1. STATE CONFIGURATION
  // ---------------------------------------------------------------------------
  const [activePreset, setActivePreset] = useState<LinePreset>(
    initialParams ? 'custom' : 'nachtigal_nyom_225kv'
  );

  // Electrical & Grid Parameters
  const [unKv, setUnKv] = useState<number>(
    initialParams?.unKv || initialParams?.voltageNominal || 225
  ); // Line voltage (kV)
  const [frequencyHz, setFrequencyHz] = useState<number>(50); // Grid frequency (Hz)
  const [lineLengthKm, setLineLengthKm] = useState<number>(
    initialParams?.lineLengthKm || initialParams?.lengthKm || 50.8
  ); // Total route length (km)
  const [transferredPowerMw, setTransferredPowerMw] = useState<number>(
    initialParams?.transferredPowerMw || initialParams?.powerMw || 420
  ); // Operating power (MW)
  const [operatingCosPhi, setOperatingCosPhi] = useState<number>(0.96); // Power factor

  // Conductor & Bundle Configuration
  const [bundleCount, setBundleCount] = useState<number>(2); // 1, 2, 3, 4 conductors per phase
  const [bundleSpacingMm, setBundleSpacingMm] = useState<number>(400); // Distance between subconductors (mm)
  const [conductorCode, setConductorCode] = useState<string>(
    initialParams?.conductorCode || 'Almelec (ASTER 570 mm²)'
  );

  // Sync if initialParams changes
  React.useEffect(() => {
    if (initialParams) {
      if (initialParams.unKv !== undefined) setUnKv(initialParams.unKv);
      else if (initialParams.voltageNominal !== undefined) setUnKv(initialParams.voltageNominal);

      if (initialParams.lineLengthKm !== undefined) setLineLengthKm(initialParams.lineLengthKm);
      else if (initialParams.lengthKm !== undefined) setLineLengthKm(initialParams.lengthKm);

      if (initialParams.transferredPowerMw !== undefined) setTransferredPowerMw(initialParams.transferredPowerMw);
      else if (initialParams.powerMw !== undefined) setTransferredPowerMw(initialParams.powerMw);

      if (initialParams.conductorCode !== undefined) setConductorCode(initialParams.conductorCode);
      setActivePreset('custom');
    }
  }, [initialParams]);
  const [conductorDiameterMm, setConductorDiameterMm] = useState<number>(31.05); // Conductor outer diameter (mm)
  const [subconductorR20, setSubconductorR20] = useState<number>(0.0583); // DC resistance at 20°C (Ω/km)

  // Phase Geometry (Tower Configuration)
  const [towerGeometry, setTowerGeometry] = useState<'horizontal' | 'triangular' | 'vertical_double'>('horizontal');
  const [phaseSpacingD12M, setPhaseSpacingD12M] = useState<number>(6.5); // Spacing Phase 1-2 (m)
  const [phaseSpacingD23M, setPhaseSpacingD23M] = useState<number>(6.5); // Spacing Phase 2-3 (m)
  const [phaseSpacingD31M, setPhaseSpacingD31M] = useState<number>(13.0); // Spacing Phase 3-1 (m)

  // Environmental & Corona Parameters (Peek / Peterson)
  const [conductorTempC, setConductorTempC] = useState<number>(45); // Conductor operating temperature (°C)
  const [ambientTempC, setAmbientTempC] = useState<number>(30); // Ambient temperature (°C)
  const [altitudeM, setAltitudeM] = useState<number>(650); // Altitude above sea level (m)
  const [weatherCondition, setWeatherCondition] = useState<'fair' | 'foul_rain' | 'fog_humid'>('fair');
  const [surfaceFactorM, setSurfaceFactorM] = useState<number>(0.87); // Stranded conductor roughness m (0.80 - 0.95)

  // ---------------------------------------------------------------------------
  // 2. PRESET HANDLER
  // ---------------------------------------------------------------------------
  const applyPreset = (preset: LinePreset) => {
    setActivePreset(preset);
    if (preset === 'nachtigal_nyom_225kv') {
      setUnKv(225);
      setFrequencyHz(50);
      setLineLengthKm(50.8);
      setTransferredPowerMw(420);
      setOperatingCosPhi(0.96);
      setBundleCount(2);
      setBundleSpacingMm(400);
      setConductorCode('Almelec (ASTER 570 mm²)');
      setConductorDiameterMm(31.05);
      setSubconductorR20(0.0583);
      setTowerGeometry('horizontal');
      setPhaseSpacingD12M(6.5);
      setPhaseSpacingD23M(6.5);
      setPhaseSpacingD31M(13.0);
      setConductorTempC(45);
      setAmbientTempC(30);
      setAltitudeM(650);
      setWeatherCondition('fair');
      setSurfaceFactorM(0.87);
    } else if (preset === 'edea_mangombe_225kv') {
      setUnKv(225);
      setFrequencyHz(50);
      setLineLengthKm(72.4);
      setTransferredPowerMw(280);
      setOperatingCosPhi(0.95);
      setBundleCount(2);
      setBundleSpacingMm(400);
      setConductorCode('ASTER 570 mm²');
      setConductorDiameterMm(31.05);
      setSubconductorR20(0.0583);
      setTowerGeometry('triangular');
      setPhaseSpacingD12M(5.8);
      setPhaseSpacingD23M(5.8);
      setPhaseSpacingD31M(5.8);
      setConductorTempC(50);
      setAmbientTempC(32);
      setAltitudeM(120);
      setWeatherCondition('fair');
      setSurfaceFactorM(0.85);
    } else if (preset === 'bekoko_nkongsamba_90kv') {
      setUnKv(90);
      setFrequencyHz(50);
      setLineLengthKm(114.0);
      setTransferredPowerMw(45);
      setOperatingCosPhi(0.94);
      setBundleCount(1);
      setBundleSpacingMm(0);
      setConductorCode('Almelec 228 mm²');
      setConductorDiameterMm(19.5);
      setSubconductorR20(0.144);
      setTowerGeometry('triangular');
      setPhaseSpacingD12M(4.2);
      setPhaseSpacingD23M(4.2);
      setPhaseSpacingD31M(4.2);
      setConductorTempC(40);
      setAmbientTempC(28);
      setAltitudeM(450);
      setWeatherCondition('fair');
      setSurfaceFactorM(0.88);
    } else if (preset === 'interconnexion_400kv') {
      setUnKv(400);
      setFrequencyHz(50);
      setLineLengthKm(280.0);
      setTransferredPowerMw(1200);
      setOperatingCosPhi(0.98);
      setBundleCount(4);
      setBundleSpacingMm(457);
      setConductorCode('Curlew ACSR 590 mm²');
      setConductorDiameterMm(31.65);
      setSubconductorR20(0.0551);
      setTowerGeometry('horizontal');
      setPhaseSpacingD12M(9.5);
      setPhaseSpacingD23M(9.5);
      setPhaseSpacingD31M(19.0);
      setConductorTempC(60);
      setAmbientTempC(35);
      setAltitudeM(800);
      setWeatherCondition('fair');
      setSurfaceFactorM(0.85);
    }
  };

  // ---------------------------------------------------------------------------
  // 3. SCIENTIFIC & ENGINEERING CALCULATIONS
  // ---------------------------------------------------------------------------
  const calcs = useMemo(() => {
    // 3.1 Radii in cm and meters
    const rConductorM = (conductorDiameterMm / 2) / 1000;
    const rConductorCm = (conductorDiameterMm / 2) / 10;
    const dBundleM = bundleSpacingMm / 1000;

    // 3.2 GMD (Geometric Mean Distance between phases)
    let gmdM = 0;
    if (towerGeometry === 'horizontal') {
      gmdM = Math.cbrt(phaseSpacingD12M * phaseSpacingD23M * phaseSpacingD31M);
    } else if (towerGeometry === 'triangular') {
      gmdM = Math.cbrt(phaseSpacingD12M * phaseSpacingD23M * phaseSpacingD31M);
    } else {
      // vertical double circuit simplified equivalent GMD
      gmdM = Math.cbrt(phaseSpacingD12M * phaseSpacingD23M * (phaseSpacingD12M + phaseSpacingD23M));
    }

    // 3.3 Conductor GMR for Inductance (r' = r * e^(-1/4) = 0.7788 * r)
    const gmrSingleL_M = rConductorM * 0.7788;

    // Equivalent GMR_L for Bundle of n subconductors
    let gmrBundleL_M = 0;
    let rEqCapacitanceM = 0;
    let bundleRadiusM = 0;

    if (bundleCount === 1) {
      gmrBundleL_M = gmrSingleL_M;
      rEqCapacitanceM = rConductorM;
      bundleRadiusM = rConductorM;
    } else if (bundleCount === 2) {
      // n=2: sqrt(GMR * d)
      gmrBundleL_M = Math.sqrt(gmrSingleL_M * dBundleM);
      rEqCapacitanceM = Math.sqrt(rConductorM * dBundleM);
      bundleRadiusM = dBundleM / 2;
    } else if (bundleCount === 3) {
      // n=3: cbrt(GMR * d^2)
      gmrBundleL_M = Math.cbrt(gmrSingleL_M * dBundleM * dBundleM);
      rEqCapacitanceM = Math.cbrt(rConductorM * dBundleM * dBundleM);
      bundleRadiusM = dBundleM / Math.sqrt(3);
    } else if (bundleCount === 4) {
      // n=4: quad_root(GMR * d^3 * sqrt(2))
      gmrBundleL_M = Math.pow(gmrSingleL_M * Math.pow(dBundleM, 3) * Math.SQRT2, 0.25);
      rEqCapacitanceM = Math.pow(rConductorM * Math.pow(dBundleM, 3) * Math.SQRT2, 0.25);
      bundleRadiusM = dBundleM / Math.SQRT2;
    }

    // 3.4 Resistance per km (corrected for temperature: R_T = R_20 * (1 + α*(T - 20)))
    const alphaAl = 0.00403; // temperature coefficient for Aluminium
    const rPerSubconductorT = subconductorR20 * (1 + alphaAl * (conductorTempC - 20));
    // Line AC skin effect multiplier ~ 1.02
    const rPrimeOhmPerKm = (rPerSubconductorT / bundleCount) * 1.02;
    const rTotalOhm = rPrimeOhmPerKm * lineLengthKm;

    // 3.5 Inductance L' and Reactance X_L' per km
    // L' = (μ0 / 2π) * ln(GMD / GMR_L) = 0.2 * ln(GMD / GMR_L) [mH/km]
    const lPrimeMhPerKm = 0.2 * Math.log(gmdM / gmrBundleL_M);
    const omega = 2 * Math.PI * frequencyHz;
    const xLPrimeOhmPerKm = (omega * lPrimeMhPerKm * 1e-3);
    const xLTotalOhm = xLPrimeOhmPerKm * lineLengthKm;

    // 3.6 Capacitance C' and Susceptance B_C' per km
    // C' = (2π * ε0) / ln(GMD / rEq) = 0.0556 / ln(GMD / rEq) [μF/km]
    const cPrimeMicroFPerKm = 0.05563 / Math.log(gmdM / rEqCapacitanceM);
    const bCPrimeMicroSPerKm = omega * cPrimeMicroFPerKm; // μS/km
    const cTotalMicroF = cPrimeMicroFPerKm * lineLengthKm;
    const chargingMvar = (unKv * unKv) * (bCPrimeMicroSPerKm * 1e-6) * lineLengthKm; // Qc = U² * B

    // 3.7 Surge Impedance Z_c and Surge Impedance Loading (SIL)
    // Z_c = sqrt(L' / C') [Ω]
    const zcOhm = Math.sqrt((lPrimeMhPerKm * 1e-3) / (cPrimeMicroFPerKm * 1e-6));
    // SIL = U_n² / Z_c [MW]
    const silMw = (unKv * unKv) / zcOhm;

    // 3.8 Phase velocity and wavelength
    const vPhaseKmPerS = 1 / Math.sqrt((lPrimeMhPerKm * 1e-6) * (cPrimeMicroFPerKm * 1e-6));
    const wavelengthKm = vPhaseKmPerS / frequencyHz;
    const electricalLengthDeg = (lineLengthKm / wavelengthKm) * 360;

    // 3.9 Ferranti Effect Voltage Rise at No-Load: ΔU_no_load ≈ 0.5 * (ω*L/v)² * U ≈ (ω² * L_tot * C_tot / 2) * U
    const ferrantiRiseRatio = 1 + 0.5 * Math.pow((omega * lineLengthKm / vPhaseKmPerS), 2);
    const ferrantiEndVoltageKv = unKv * ferrantiRiseRatio;
    const ferrantiDeltaKv = ferrantiEndVoltageKv - unKv;

    // 3.10 Joule Losses under Transferred Power (P_mw)
    const nominalCurrentA = (transferredPowerMw * 1000) / (Math.sqrt(3) * unKv * operatingCosPhi);
    const jouleLossMw = 3 * Math.pow(nominalCurrentA, 2) * rTotalOhm * 1e-6;
    const efficiencyPercent = (transferredPowerMw / (transferredPowerMw + jouleLossMw)) * 100;

    // -------------------------------------------------------------------------
    // 3.11 CORONA INCEPTION & POWER LOSS (PEEK'S FORMULATION)
    // -------------------------------------------------------------------------
    // Barometric pressure b in cm Hg: b = 76 * exp(-altitude / 8400)
    const bCmHg = 76 * Math.exp(-altitudeM / 8400);
    // Relative air density factor δ = (3.92 * b) / (273 + ambientTempC)
    const deltaAir = (3.92 * bCmHg) / (273 + ambientTempC);

    // Weather multiplier:
    // Fair: m_weather = 1.0; Rain/Storm: m_weather = 0.70; Fog/Humid: m_weather = 0.85
    let weatherMultiplier = 1.0;
    if (weatherCondition === 'foul_rain') weatherMultiplier = 0.72;
    if (weatherCondition === 'fog_humid') weatherMultiplier = 0.85;

    const mTotal = surfaceFactorM * weatherMultiplier;

    // Critical disruptive electric field E0 (kV_rms / cm) per Peek:
    // E0_rms = 21.2 * m * δ * (1 + 0.301 / sqrt(δ * r_cm))
    const e0CriticalKVRmsPerCm = 21.2 * mTotal * deltaAir * (1 + 0.301 / Math.sqrt(deltaAir * rConductorCm));

    // Operating Phase Voltage (kV_rms)
    const vPhaseKvRms = unKv / Math.sqrt(3);

    // Maximum Surface Electric Field E_max on the subconductor in bundle:
    // E_max = (V_ph / (n * r * ln(GMD / rEq))) * (1 + (n - 1) * (r / R_bundle)) [kV_rms / cm]
    const rEqCm = rEqCapacitanceM * 100;
    const gmdCm = gmdM * 100;
    const rBundleCm = Math.max(bundleRadiusM * 100, rConductorCm);

    let bundleFieldMultiplier = 1.0;
    if (bundleCount > 1) {
      bundleFieldMultiplier = 1 + (bundleCount - 1) * (rConductorCm / rBundleCm);
    }

    const eOperatingSurfaceKVRmsPerCm =
      (vPhaseKvRms / (bundleCount * rConductorCm * Math.log(gmdCm / rEqCm))) * bundleFieldMultiplier;

    // Corona safety margin ratio (E0 / E_operating)
    const coronaSafetyMargin = e0CriticalKVRmsPerCm / eOperatingSurfaceKVRmsPerCm;

    // Peek's Disruptive Critical Voltage Vd (kV_rms phase-to-ground):
    const vdCriticalKvRms = (e0CriticalKVRmsPerCm * bundleCount * rConductorCm * Math.log(gmdCm / rEqCm)) / bundleFieldMultiplier;

    // Corona Power Loss P_corona per phase (Peek/Peterson empirical formula):
    // P = (242.2 / δ) * (f + 25) * sqrt(r / GMD) * (V_ph - Vd)² * 10^-5 [kW/km/phase]
    let coronaLossKwPerKmPerPhase = 0;
    if (vPhaseKvRms > vdCriticalKvRms) {
      coronaLossKwPerKmPerPhase =
        (242.2 / deltaAir) *
        (frequencyHz + 25) *
        Math.sqrt(rConductorCm / gmdCm) *
        Math.pow(vPhaseKvRms - vdCriticalKvRms, 2) *
        1e-5;
    } else {
      // In fair weather below critical inception, residual dielectric loss is minimal (< 0.1 kW/km)
      coronaLossKwPerKmPerPhase = weatherCondition === 'foul_rain' ? 0.35 : 0.05;
    }

    const totalCoronaLossKwPerKm = coronaLossKwPerKmPerPhase * 3;
    const totalLineCoronaLossKw = totalCoronaLossKwPerKm * lineLengthKm;

    return {
      rConductorMm: rConductorM * 1000,
      gmdM,
      gmrBundleL_M,
      rEqCapacitanceM,
      rPrimeOhmPerKm,
      rTotalOhm,
      lPrimeMhPerKm,
      xLPrimeOhmPerKm,
      xLTotalOhm,
      cPrimeMicroFPerKm,
      bCPrimeMicroSPerKm,
      cTotalMicroF,
      chargingMvar,
      zcOhm,
      silMw,
      vPhaseKmPerS,
      wavelengthKm,
      electricalLengthDeg,
      ferrantiEndVoltageKv,
      ferrantiDeltaKv,
      nominalCurrentA,
      jouleLossMw,
      efficiencyPercent,
      deltaAir,
      mTotal,
      e0CriticalKVRmsPerCm,
      eOperatingSurfaceKVRmsPerCm,
      coronaSafetyMargin,
      vdCriticalKvRms,
      totalCoronaLossKwPerKm,
      totalLineCoronaLossKw,
    };
  }, [
    unKv,
    frequencyHz,
    lineLengthKm,
    transferredPowerMw,
    operatingCosPhi,
    bundleCount,
    bundleSpacingMm,
    conductorDiameterMm,
    subconductorR20,
    towerGeometry,
    phaseSpacingD12M,
    phaseSpacingD23M,
    phaseSpacingD31M,
    conductorTempC,
    ambientTempC,
    altitudeM,
    weatherCondition,
    surfaceFactorM,
  ]);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900/60 to-cyan-900/30 border border-cyan-500/20 p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
              <Globe className="h-4 w-4" />
              <span className="uppercase tracking-widest font-black">
                MODULE 15 · LIGNES THT & EFFET CORONA (CEI 60826 / IEEE 738 / PEEK)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
              {locale === 'fr'
                ? 'Paramètres R-L-C de Ligne, Faisceaux & Pertes Corona'
                : 'Overhead Line R-L-C Parameters, Bundles & Corona Losses'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Modélisation rigoureuse des conducteurs en faisceau, GMD/GMR, impédance caractéristique Zc, puissance naturelle SIL, surtension à vide Ferranti et champ critique disruptif d\'ionisation Corona de Peek.'
                : 'Rigorous calculation of bundled conductors, GMD/GMR, characteristic impedance Zc, Surge Impedance Loading (SIL), Ferranti no-load voltage rise and Peek\'s disruptive surface ionization threshold.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenReport && (
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all shadow-md"
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
            {locale === 'fr' ? 'Profils Réseau :' : 'Grid Presets:'}
          </span>
          <button
            type="button"
            onClick={() => applyPreset('nachtigal_nyom_225kv')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activePreset === 'nachtigal_nyom_225kv'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {locale === 'fr' ? 'Nachtigal - Nyom II (225 kV 2×Aster)' : 'Nachtigal - Nyom II (225 kV 2×Aster)'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('edea_mangombe_225kv')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activePreset === 'edea_mangombe_225kv'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {locale === 'fr' ? 'Edéa - Douala (225 kV Triangle)' : 'Edéa - Douala (225 kV Delta)'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('bekoko_nkongsamba_90kv')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activePreset === 'bekoko_nkongsamba_90kv'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {locale === 'fr' ? 'Bekoko - Nkongsamba (90 kV 1×Almelec)' : 'Bekoko - Nkongsamba (90 kV 1×Almelec)'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('interconnexion_400kv')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activePreset === 'interconnexion_400kv'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {locale === 'fr' ? 'Interconnexion THT 400 kV (4×Curlew)' : 'Interconnection 400 kV (4×Curlew)'}
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Telemetry Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================================================================ */}
        {/* LEFT COLUMN: PARAMETER INPUT CONTROLS (7 Cols)                  */}
        {/* ================================================================ */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Electrical & Operating Conditions */}
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? '1. Caractéristiques Électriques du Réseau' : '1. Grid Electrical Parameters'}</span>
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
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="5"
                  />
                  <span className="text-cyan-400 font-bold">kV</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Longueur de Ligne (L)' : 'Line Length (L)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={lineLengthKm}
                    onChange={(e) => { setLineLengthKm(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="1"
                  />
                  <span className="text-cyan-400 font-bold">km</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Fréquence Réseau (f)' : 'System Frequency (f)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={frequencyHz}
                    onChange={(e) => { setFrequencyHz(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="1"
                  />
                  <span className="text-cyan-400 font-bold">Hz</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mt-4">
              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Puissance Active Transitée (P)' : 'Transferred Active Power (P)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={transferredPowerMw}
                    onChange={(e) => { setTransferredPowerMw(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="10"
                  />
                  <span className="text-amber-400 font-bold">MW</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Facteur de Puissance (cos φ)' : 'Operating Power Factor'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={operatingCosPhi}
                    onChange={(e) => { setOperatingCosPhi(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="0.01"
                    min="0.5"
                    max="1.0"
                  />
                  <span className="text-emerald-400 font-bold">cos φ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Conductor & Bundle Architecture */}
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? '2. Faisceau & Conducteurs par Phase' : '2. Conductor Bundle Geometry'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Conducteurs / Faisceau (n)' : 'Subconductors / Phase (n)'}
                </label>
                <select
                  value={bundleCount}
                  onChange={(e) => { setBundleCount(Number(e.target.value)); setActivePreset('custom'); }}
                  className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                >
                  <option value={1}>n = 1 (Conducteur Simple)</option>
                  <option value={2}>n = 2 (Faisceau Biconducteur)</option>
                  <option value={3}>n = 3 (Faisceau Triangulaire)</option>
                  <option value={4}>n = 4 (Faisceau Quadruple)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Écartement Faisceau (d)' : 'Bundle Spacing (d)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={bundleSpacingMm}
                    disabled={bundleCount === 1}
                    onChange={(e) => { setBundleSpacingMm(Number(e.target.value)); setActivePreset('custom'); }}
                    className={`w-full bg-[#07090E] border rounded-lg px-3 py-2 text-white font-bold text-sm outline-none ${
                      bundleCount === 1 ? 'border-white/5 text-slate-600' : 'border-white/10 focus:border-cyan-400'
                    }`}
                    step="10"
                  />
                  <span className="text-cyan-400 font-bold">mm</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Diamètre Sous-conducteur (2r)' : 'Conductor Diameter (2r)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={conductorDiameterMm}
                    onChange={(e) => { setConductorDiameterMm(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="0.1"
                  />
                  <span className="text-sky-400 font-bold">mm</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mt-4">
              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Résistance CC à 20°C (R20)' : 'DC Resistance at 20°C (R20)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={subconductorR20}
                    onChange={(e) => { setSubconductorR20(Number(e.target.value)); setActivePreset('custom'); }}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="0.001"
                  />
                  <span className="text-amber-400 font-bold">Ω/km</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Disposition Pylône' : 'Tower Geometry Layout'}
                </label>
                <select
                  value={towerGeometry}
                  onChange={(e) => { setTowerGeometry(e.target.value as any); setActivePreset('custom'); }}
                  className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                >
                  <option value="horizontal">Nappe Horizontale (D12 = D23 = D, D31 = 2D)</option>
                  <option value="triangular">Triangle Équilatéral (D12 = D23 = D31 = D)</option>
                  <option value="vertical_double">Double Terne Vertical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Atmospheric & Corona Parameters (Peek) */}
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? '3. Conditions Ambiantes & Inception Corona (Peek)' : '3. Environmental & Corona Thresholds'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Météo Réseau' : 'Weather Condition'}
                </label>
                <select
                  value={weatherCondition}
                  onChange={(e) => setWeatherCondition(e.target.value as any)}
                  className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                >
                  <option value="fair">☀️ Temps Sec (Beau Temps)</option>
                  <option value="fog_humid">🌫️ Brume / Forte Humidité</option>
                  <option value="foul_rain">🌧️ Pluie / Orage Tropical</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Altitude Réseau (h)' : 'Altitude (h)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={altitudeM}
                    onChange={(e) => setAltitudeM(Number(e.target.value))}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="50"
                  />
                  <span className="text-cyan-400 font-bold">m</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Facteur d\'État de Surface (m)' : 'Roughness Factor (m)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={surfaceFactorM}
                    onChange={(e) => setSurfaceFactorM(Number(e.target.value))}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="0.01"
                    min="0.5"
                    max="1.0"
                  />
                  <span className="text-purple-400 font-bold">m</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mt-4">
              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Température Âme Conducteur' : 'Conductor Operating Temp'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={conductorTempC}
                    onChange={(e) => setConductorTempC(Number(e.target.value))}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="5"
                  />
                  <span className="text-amber-400 font-bold">°C</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {locale === 'fr' ? 'Température Ambiante' : 'Ambient Air Temp'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={ambientTempC}
                    onChange={(e) => setAmbientTempC(Number(e.target.value))}
                    className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                    step="1"
                  />
                  <span className="text-sky-400 font-bold">°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT COLUMN: REAL-TIME TELEMETRY & RESULTS (5 Cols)             */}
        {/* ================================================================ */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card A: Key Line Impedances & SIL */}
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>{locale === 'fr' ? 'Impédance & Puissance Naturelle SIL' : 'Line Impedances & SIL'}</span>
              <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                CEI 60826
              </span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Puissance Naturelle (SIL) :' : 'Surge Impedance Loading (SIL):'}</span>
                <span className="text-amber-300 font-black text-sm">{calcs.silMw.toFixed(1)} MW</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Impédance Caractéristique (Zc) :' : 'Surge Impedance (Zc):'}</span>
                <span className="text-cyan-300 font-black text-sm">{calcs.zcOhm.toFixed(1)} Ω</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Distance Moyenne Géométrique (GMD) :' : 'Geometric Mean Distance (GMD):'}</span>
                <span className="text-white font-bold">{calcs.gmdM.toFixed(2)} m</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Rayon Équivalent Faisceau (r_eq) :' : 'Equivalent Bundle Radius (r_eq):'}</span>
                <span className="text-white font-bold">{(calcs.rEqCapacitanceM * 1000).toFixed(1)} mm</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Puissance Réactive Générée (Qc) :' : 'Line Charging Reactive Power (Qc):'}</span>
                <span className="text-emerald-400 font-bold">{calcs.chargingMvar.toFixed(2)} Mvar</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Effet Ferranti à vide (ΔU) :' : 'Ferranti No-Load Voltage Rise:'}</span>
                <span className="text-sky-300 font-bold">+{calcs.ferrantiDeltaKv.toFixed(2)} kV ({calcs.ferrantiEndVoltageKv.toFixed(2)} kV)</span>
              </div>
            </div>
          </div>

          {/* Card B: Distributed Parameters Matrix */}
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>{locale === 'fr' ? 'Paramètres Linéiques R\'-L\'-C\'' : 'Distributed Parameters R\'-L\'-C\''}</span>
              <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {frequencyHz} Hz
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400 block text-[11px]">R\' (Résistance)</span>
                <span className="text-white font-bold text-sm">{calcs.rPrimeOhmPerKm.toFixed(4)} Ω/km</span>
                <span className="text-[10px] text-slate-500 block">Total: {calcs.rTotalOhm.toFixed(2)} Ω</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400 block text-[11px]">X\'L (Réactance)</span>
                <span className="text-cyan-300 font-bold text-sm">{calcs.xLPrimeOhmPerKm.toFixed(4)} Ω/km</span>
                <span className="text-[10px] text-slate-500 block">Total: {calcs.xLTotalOhm.toFixed(2)} Ω</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400 block text-[11px]">L\' (Inductance)</span>
                <span className="text-white font-bold text-sm">{calcs.lPrimeMhPerKm.toFixed(3)} mH/km</span>
                <span className="text-[10px] text-slate-500 block">GMR: {(calcs.gmrBundleL_M * 1000).toFixed(1)} mm</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400 block text-[11px]">C\' (Capacité)</span>
                <span className="text-sky-300 font-bold text-sm">{calcs.cPrimeMicroFPerKm.toFixed(4)} μF/km</span>
                <span className="text-[10px] text-slate-500 block">Total: {calcs.cTotalMicroF.toFixed(3)} μF</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{locale === 'fr' ? 'Pertes Joule à charge :' : 'Joule Losses at load:'}</span>
              <span className="text-amber-400 font-bold">{calcs.jouleLossMw.toFixed(2)} MW ({calcs.efficiencyPercent.toFixed(2)}% eff.)</span>
            </div>
          </div>

          {/* Card C: Corona Inception & Losses Evaluation (Peek) */}
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>{locale === 'fr' ? 'Évaluation Corona & Gradient Critique' : 'Corona & Critical Field (Peek)'}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold border ${
                  calcs.coronaSafetyMargin >= 1.05
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                }`}
              >
                {calcs.coronaSafetyMargin >= 1.05 ? 'PAS DE CORONA' : 'EFFET CORONA ACTIF'}
              </span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Champ Électrique de Surface (E_surf) :' : 'Operating Surface Field:'}</span>
                <span className="text-white font-bold">{calcs.eOperatingSurfaceKVRmsPerCm.toFixed(2)} kV/cm</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Gradient Disruptif Critique (E0) :' : 'Critical Disruptive Field (E0):'}</span>
                <span className="text-cyan-300 font-bold">{calcs.e0CriticalKVRmsPerCm.toFixed(2)} kV/cm</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Marge de Sécurité Corona (E0 / E_surf) :' : 'Corona Safety Margin:'}</span>
                <span
                  className={`font-black text-sm ${
                    calcs.coronaSafetyMargin >= 1.05 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {calcs.coronaSafetyMargin.toFixed(2)} (Seuil &gt; 1.05)
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Densité Relative de l\'Air (δ) :' : 'Relative Air Density (δ):'}</span>
                <span className="text-slate-300 font-bold">{calcs.deltaAir.toFixed(3)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                <span className="text-slate-400">{locale === 'fr' ? 'Pertes Corona Totales de la Ligne :' : 'Total Line Corona Losses:'}</span>
                <span className="text-amber-400 font-black">{calcs.totalLineCoronaLossKw.toFixed(1)} kW ({calcs.totalCoronaLossKwPerKm.toFixed(3)} kW/km)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Conductor Bundle Cross-Section Diagram */}
      <div className="rounded-xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl">
        <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'Schéma Vectoriel du Faisceau & Lignes de Champ Électrostatique' : 'Bundle Cross-Section & Electrostatic Field Vector Diagram'}</span>
          <span className="text-xs text-slate-400 font-normal">
            n = {bundleCount} {bundleCount > 1 ? `· d = ${bundleSpacingMm} mm` : ''} · Ø = {conductorDiameterMm} mm
          </span>
        </h3>

        <div className="w-full flex justify-center py-4 bg-[#07090E]/80 rounded-lg border border-white/5 overflow-x-auto">
          <svg viewBox="0 0 500 200" className="w-full max-w-[500px] h-auto select-none">
            {/* Ambient electrostatic field glow */}
            <circle cx="250" cy="100" r="75" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="250" cy="100" r="90" fill="none" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.2" />

            {/* Bundle Centers and subconductors */}
            {bundleCount === 1 && (
              <g>
                <circle cx="250" cy="100" r="16" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="250" cy="100" r="4" fill="#FFFFFF" />
                <text x="250" y="135" textAnchor="middle" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Conducteur Simple (2r = {conductorDiameterMm} mm)
                </text>
              </g>
            )}

            {bundleCount === 2 && (
              <g>
                {/* Horizontal spacing line */}
                <line x1="190" y1="100" x2="310" y2="100" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="250" y="90" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  d = {bundleSpacingMm} mm
                </text>
                {/* Subconductor 1 */}
                <circle cx="190" cy="100" r="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="190" cy="100" r="3" fill="#FFFFFF" />
                {/* Subconductor 2 */}
                <circle cx="310" cy="100" r="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="310" cy="100" r="3" fill="#FFFFFF" />
                <text x="250" y="145" textAnchor="middle" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Faisceau Biconducteur (2×{conductorDiameterMm} mm)
                </text>
              </g>
            )}

            {bundleCount === 3 && (
              <g>
                {/* Triangle lines */}
                <polygon points="250,55 195,145 305,145" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* 3 Subconductors */}
                <circle cx="250" cy="55" r="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="195" cy="145" r="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="305" cy="145" r="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <text x="250" y="180" textAnchor="middle" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Faisceau Triangulaire (3×{conductorDiameterMm} mm)
                </text>
              </g>
            )}

            {bundleCount === 4 && (
              <g>
                {/* Square bundle lines */}
                <rect x="200" y="55" width="100" height="90" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="250" y="105" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  d = {bundleSpacingMm} mm
                </text>
                {/* 4 Subconductors */}
                <circle cx="200" cy="55" r="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="300" cy="55" r="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="200" cy="145" r="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="300" cy="145" r="12" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
                <text x="250" y="180" textAnchor="middle" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Faisceau Quadruple (4×{conductorDiameterMm} mm)
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
