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
  ArrowRight,
  Sliders,
  ShieldCheck,
  Scale,
  Anchor,
  HelpCircle,
  X,
  ExternalLink,
  Table,
  TrendingDown,
} from 'lucide-react';
import {
  Iec60826TensionSagEngine,
  CAMEROON_TRANSMISSION_LINE_PRESETS,
  CANONICAL_CONDUCTORS,
  type TensionSagInput,
  type CameroonTransmissionLinePreset,
} from '../../../data/iec60826TensionSagEngine';

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
  // Active View Tab: 'mechanical' (IEC 60826 Tension-Sag) | 'electrical' (Peek / SIL / Bundles)
  const [activeTab, setActiveTab] = useState<'mechanical' | 'electrical'>('mechanical');

  // Mechanical State (IEC 60826 / Cigré TB 273)
  const [selectedMechPresetId, setSelectedMechPresetId] = useState<string>('songloulou-mangombe-225kv-aster570');
  const [mechConductorKey, setMechConductorKey] = useState<string>('aster_570');
  const [rulingSpanMeters, setRulingSpanMeters] = useState<number>(380);
  const [state1TempC, setState1TempC] = useState<number>(15);
  const [state1TensionPercentRts, setState1TensionPercentRts] = useState<number>(18.0);
  const [state2TempC, setState2TempC] = useState<number>(75);
  const [state2WindSpeedMps, setState2WindSpeedMps] = useState<number>(0);
  const [minGroundClearanceM, setMinGroundClearanceM] = useState<number>(7.5);
  const [attachmentHeightM, setAttachmentHeightM] = useState<number>(22.0);
  const [isNormativeModalOpen, setIsNormativeModalOpen] = useState<boolean>(false);

  const handleApplyMechPreset = (presetId: string) => {
    setSelectedMechPresetId(presetId);
    const p = CAMEROON_TRANSMISSION_LINE_PRESETS.find(item => item.id === presetId);
    if (!p) return;
    setMechConductorKey(p.input.conductorKey);
    setRulingSpanMeters(p.input.rulingSpanMeters);
    setState1TempC(p.input.state1TemperatureC);
    setState1TensionPercentRts(p.input.state1TensionPercentRts);
    setState2TempC(p.input.state2TemperatureC);
    setState2WindSpeedMps(p.input.state2WindSpeedMPerS);
    setMinGroundClearanceM(p.input.minRequiredGroundClearanceM);
    setAttachmentHeightM(p.input.crossarmAttachmentHeightM);

    if (p.voltageLevel.includes('225')) {
      setUnKv(225);
      setBundleCount(2);
      setBundleSpacingMm(400);
      setTransferredPowerMw(420);
    } else if (p.voltageLevel.includes('90')) {
      setUnKv(90);
      setBundleCount(1);
      setBundleSpacingMm(0);
      setTransferredPowerMw(45);
    } else if (p.voltageLevel.includes('30')) {
      setUnKv(30);
      setBundleCount(1);
      setBundleSpacingMm(0);
      setTransferredPowerMw(12);
    }
  };

  const mechInputSpec: TensionSagInput = useMemo(() => ({
    conductorKey: mechConductorKey,
    rulingSpanMeters,
    state1TemperatureC: state1TempC,
    state1TensionPercentRts: state1TensionPercentRts,
    state2TemperatureC: state2TempC,
    state2WindSpeedMPerS: state2WindSpeedMps,
    minRequiredGroundClearanceM: minGroundClearanceM,
    crossarmAttachmentHeightM: attachmentHeightM,
  }), [
    mechConductorKey,
    rulingSpanMeters,
    state1TempC,
    state1TensionPercentRts,
    state2TempC,
    state2WindSpeedMps,
    minGroundClearanceM,
    attachmentHeightM,
  ]);

  const mechSim = useMemo(() => Iec60826TensionSagEngine.solve(mechInputSpec), [mechInputSpec]);
  const activeMechPreset = CAMEROON_TRANSMISSION_LINE_PRESETS.find(p => p.id === selectedMechPresetId);

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
            <button
              type="button"
              onClick={() => setIsNormativeModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-all shadow-md"
            >
              <HelpCircle className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Formules & Normes' : 'Formulas & Norms'}</span>
            </button>
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

        {/* Tab Switcher: Mechanical vs Electrical */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-[#0B0F17] p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('mechanical')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'mechanical'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Anchor className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Tension-Flèche & Équation d\'État (CEI 60826)' : 'Tension-Sag & State Equation (IEC 60826)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('electrical')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'electrical'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Paramètres R-L-C & Effet Corona (Peek)' : 'R-L-C Parameters & Corona (Peek)'}</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Cigré TB 273 · EN 50341 · IEEE 738</span>
          </div>
        </div>

        {/* Mechanical Cameroon Presets Bar */}
        {activeTab === 'mechanical' && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1">
              {locale === 'fr' ? 'Profils Lignes Cameroun (SONATREL) :' : 'Cameroon Presets (SONATREL):'}
            </span>
            {CAMEROON_TRANSMISSION_LINE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyMechPreset(p.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedMechPresetId === p.id
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {p.voltageLevel} · {p.name[locale]}
              </button>
            ))}
          </div>
        )}

        {/* Electrical Presets Bar */}
        {activeTab === 'electrical' && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 font-mono text-xs">
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
        )}
      </div>

      {/* =================================================================== */}
      {/* 2. MECHANICAL VIEW: TENSION-SAG & CONSTRUCTOR STATE (IEC 60826)    */}
      {/* =================================================================== */}
      {activeTab === 'mechanical' && (
        <div className="space-y-6">
          {/* Active Preset Corridor Card */}
          {activeMechPreset && (
            <div className="rounded-xl bg-cyan-950/20 border border-cyan-500/30 p-4 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Activity className="h-4 w-4" />
                  <span>{activeMechPreset.corridor[locale]}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px]">
                    {activeMechPreset.voltageLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {activeMechPreset.description[locale]}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-[#07090E]/80 border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">{locale === 'fr' ? 'Portée' : 'Span'}</span>
                  <span className="font-bold text-cyan-300 text-sm">{rulingSpanMeters} m</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#07090E]/80 border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">{locale === 'fr' ? 'Accrochage' : 'Height'}</span>
                  <span className="font-bold text-white text-sm">{attachmentHeightM} m</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#07090E]/80 border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">{locale === 'fr' ? 'Garde Min' : 'Min Clear'}</span>
                  <span className="font-bold text-emerald-400 text-sm">≥ {minGroundClearanceM} m</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Mechanical Grid: Inputs (7 Cols) vs Telemetry (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Parameter Inputs */}
            <div className="lg:col-span-7 space-y-5">
              {/* Card M1: Conductor Mechanical Properties */}
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Scale className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? '1. Caractéristiques Mécaniques du Câble' : '1. Conductor Mechanical Properties'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5">
                    {mechSim.conductor.codeName}
                  </span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-bold">
                      {locale === 'fr' ? 'Sélection du type de conducteur normalisé :' : 'Select Standard Conductor Type:'}
                    </label>
                    <select
                      value={mechConductorKey}
                      onChange={(e) => setMechConductorKey(e.target.value)}
                      className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-cyan-300 font-bold text-xs focus:border-cyan-400 outline-none"
                    >
                      <option value="aster_570">Aster 570 mm² (AAAC Almelec - RTS 166.0 kN - Ø 31.05 mm)</option>
                      <option value="aster_228">Aster 228 mm² (AAAC Almelec - RTS 67.4 kN - Ø 19.50 mm)</option>
                      <option value="aster_148">Aster 148 mm² (AAAC Almelec - RTS 43.9 kN - Ø 15.75 mm)</option>
                      <option value="curlew_acsr_590">Curlew 590 mm² (ACSR Aluminium-Acier - RTS 194.0 kN - Ø 31.65 mm)</option>
                    </select>
                  </div>

                  {/* Mechanical Property Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Charge Rupture (RTS)</span>
                      <span className="font-bold text-cyan-300 text-sm">{mechSim.conductor.ratedTensileStrengthKn} kN</span>
                      <span className="text-[9px] text-slate-500 block">{(mechSim.conductor.ratedTensileStrengthKn * 1000 / 9.80665).toFixed(0)} daN</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Section Totale (A)</span>
                      <span className="font-bold text-white text-sm">{mechSim.conductor.totalSectionMm2} mm²</span>
                      <span className="text-[9px] text-slate-500 block">Nominale: {mechSim.conductor.nominalSectionMm2} mm²</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Diamètre Extérieur (d)</span>
                      <span className="font-bold text-sky-300 text-sm">{mechSim.conductor.outerDiameterMm} mm</span>
                      <span className="text-[9px] text-slate-500 block">Rayon: {(mechSim.conductor.outerDiameterMm / 2).toFixed(2)} mm</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Poids Propre Linéique (wc)</span>
                      <span className="font-bold text-amber-300 text-sm">{mechSim.conductor.linearWeightNPerM.toFixed(2)} N/m</span>
                      <span className="text-[9px] text-slate-500 block">{mechSim.conductor.linearMassKgPerM.toFixed(3)} kg/m</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Module de Young (E)</span>
                      <span className="font-bold text-white text-sm">{mechSim.conductor.modulusOfElasticityMpa} MPa</span>
                      <span className="text-[9px] text-slate-500 block">{(mechSim.conductor.modulusOfElasticityMpa / 1000).toFixed(1)} GPa</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Dilatation Linéique (α)</span>
                      <span className="font-bold text-rose-300 text-sm">{(mechSim.conductor.thermalExpansionCoeffPerC * 1e6).toFixed(1)} × 10⁻⁶</span>
                      <span className="text-[9px] text-slate-500 block">par °C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card M2: Span & Tower Geometry */}
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Compass className="h-4 w-4 text-cyan-400" />
                  <span>{locale === 'fr' ? '2. Géométrie de Portée & Pylônes' : '2. Span & Tower Geometry'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">
                      {locale === 'fr' ? 'Portée Équivalente (a_r)' : 'Ruling Span (a_r)'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={rulingSpanMeters}
                        onChange={(e) => setRulingSpanMeters(Math.max(20, Number(e.target.value)))}
                        className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                        step="10"
                      />
                      <span className="text-cyan-400 font-bold">m</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="10"
                      value={rulingSpanMeters}
                      onChange={(e) => setRulingSpanMeters(Number(e.target.value))}
                      className="w-full mt-2 accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">
                      {locale === 'fr' ? 'Hauteur d\'Accrochage (H)' : 'Attachment Height (H)'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={attachmentHeightM}
                        onChange={(e) => setAttachmentHeightM(Math.max(5, Number(e.target.value)))}
                        className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                        step="1"
                      />
                      <span className="text-cyan-400 font-bold">m</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      step="1"
                      value={attachmentHeightM}
                      onChange={(e) => setAttachmentHeightM(Number(e.target.value))}
                      className="w-full mt-2 accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">
                      {locale === 'fr' ? 'Garde au Sol Requise' : 'Min Clearance Req'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={minGroundClearanceM}
                        onChange={(e) => setMinGroundClearanceM(Math.max(3, Number(e.target.value)))}
                        className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                        step="0.5"
                      />
                      <span className="text-cyan-400 font-bold">m</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-2">
                      225 kV: 7.5 m · 90 kV: 6.5 m · 30 kV: 6.0 m
                    </span>
                  </div>
                </div>
              </div>

              {/* Card M3: State 1 (EDS Conditions) */}
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? '3. État 1 : Conditions de Pose Initiales (EDS)' : '3. State 1: Stringing & EDS Conditions'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    EDS (Everyday Stress)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">
                      {locale === 'fr' ? 'Température de Pose (θ1)' : 'Stringing Temperature (θ1)'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={state1TempC}
                        onChange={(e) => setState1TempC(Number(e.target.value))}
                        className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                        step="1"
                      />
                      <span className="text-cyan-400 font-bold">°C</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">
                      {locale === 'fr' ? 'Traction Initiale (% RTS)' : 'Initial Tension (% RTS)'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={state1TensionPercentRts}
                        onChange={(e) => setState1TensionPercentRts(Math.min(40, Math.max(5, Number(e.target.value))))}
                        className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                        step="0.5"
                      />
                      <span className="text-cyan-400 font-bold">%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Guide Cigré : 18% à 22% RTS pour limiter le fluage et les vibrations éoliennes
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[#07090E]/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Traction H1</span>
                    <span className="font-bold text-cyan-300 text-xs">{mechSim.state1.horizontalTensionKn.toFixed(2)} kN</span>
                  </div>
                  <div className="p-2 rounded bg-[#07090E]/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Contrainte σ1</span>
                    <span className="font-bold text-white text-xs">{mechSim.state1.mechanicalStressMpa.toFixed(1)} MPa</span>
                  </div>
                  <div className="p-2 rounded bg-[#07090E]/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Flèche Initiale f1</span>
                    <span className="font-bold text-sky-300 text-xs">{mechSim.state1.midSpanSagMeters.toFixed(2)} m</span>
                  </div>
                </div>
              </div>

              {/* Card M4: State 2 (Climatic & Operating Evaluation) */}
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? '4. État 2 : Conditions Climatiques & Température Maximale' : '4. State 2: Climatic & Thermal Evaluation'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {state2WindSpeedMps > 0 ? (locale === 'fr' ? 'Vent Actif' : 'Wind Active') : (locale === 'fr' ? 'Flèche Maximale Sans Vent' : 'Max Sag No Wind')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">
                      {locale === 'fr' ? 'Température Conducteur (θ2)' : 'Conductor Temperature (θ2)'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={state2TempC}
                        onChange={(e) => setState2TempC(Number(e.target.value))}
                        className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                        step="5"
                      />
                      <span className="text-cyan-400 font-bold">°C</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="5"
                      value={state2TempC}
                      onChange={(e) => setState2TempC(Number(e.target.value))}
                      className="w-full mt-2 accent-amber-400 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Seuil de transit thermique permanent SONATREL : 75°C
                    </span>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">
                      {locale === 'fr' ? 'Vitesse du Vent Transversal (vw)' : 'Crosswind Velocity (vw)'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={state2WindSpeedMps}
                        onChange={(e) => setState2WindSpeedMps(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 outline-none"
                        step="1"
                      />
                      <span className="text-cyan-400 font-bold">m/s</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="45"
                      step="1"
                      value={state2WindSpeedMps}
                      onChange={(e) => setState2WindSpeedMps(Number(e.target.value))}
                      className="w-full mt-2 accent-cyan-400 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {(state2WindSpeedMps * 3.6).toFixed(0)} km/h · Rafales Ouest : ~32 m/s (115 km/h)
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[#07090E]/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Pression Vent qw</span>
                    <span className="font-bold text-white text-xs">{mechSim.state2.windPressurePa.toFixed(1)} Pa</span>
                  </div>
                  <div className="p-2 rounded bg-[#07090E]/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Force Linéique Fw</span>
                    <span className="font-bold text-cyan-300 text-xs">{mechSim.state2.windForcePerMeterN.toFixed(2)} N/m</span>
                  </div>
                  <div className="p-2 rounded bg-[#07090E]/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Charge Totale W_res</span>
                    <span className="font-bold text-amber-300 text-xs">{mechSim.state2.resultantWeightPerMeterN.toFixed(2)} N/m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Telemetry & Mechanical Verdict */}
            <div className="lg:col-span-5 space-y-5">
              {/* Verdict Card */}
              <div
                className={`rounded-xl border p-5 backdrop-blur-xl transition-all shadow-xl ${
                  mechSim.overallVerdict === 'COMPLIANT'
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {mechSim.overallVerdict === 'COMPLIANT' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-rose-400" />
                    )}
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      {locale === 'fr' ? 'Conformité CEI 60826' : 'IEC 60826 Compliance'}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono border ${
                      mechSim.overallVerdict === 'COMPLIANT'
                        ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/40'
                        : 'text-rose-300 bg-rose-500/10 border-rose-500/40'
                    }`}
                  >
                    {mechSim.overallVerdict === 'COMPLIANT'
                      ? (locale === 'fr' ? 'CONFORME' : 'COMPLIANT')
                      : (locale === 'fr' ? 'NON CONFORME' : 'NON-COMPLIANT')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                  {mechSim.advisoryInterpretation[locale]}
                </p>

                {/* Sub-verdict Indicators */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-white/10">
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Garde au Sol' : 'Clearance'}</span>
                    <span
                      className={`font-bold ${
                        mechSim.state2.isGroundClearanceCompliant ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {mechSim.state2.actualGroundClearanceMeters.toFixed(2)} m (≥ {minGroundClearanceM} m)
                    </span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Facteur Sécurité' : 'Safety Factor'}</span>
                    <span
                      className={`font-bold ${
                        mechSim.state2.isTensionSafetyCompliant ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {mechSim.state2.safetyFactorAgainstRts.toFixed(2)} (≥ 2.50)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sag & Ground Clearance Telemetry */}
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>{locale === 'fr' ? 'Flèches & Garde au Sol' : 'Sag & Ground Clearance'}</span>
                  <TrendingDown className="h-4 w-4 text-cyan-400" />
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Flèche Totale Mi-Portée (f2) :' : 'Mid-Span Sag (f2):'}</span>
                    <span className="text-amber-400 font-bold text-sm">{mechSim.state2.totalMidSpanSagMeters.toFixed(2)} m</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Flèche Verticale Résiduelle :' : 'Vertical Sag Component:'}</span>
                    <span className="text-white font-bold">{mechSim.state2.verticalSagMeters.toFixed(2)} m</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Garde au Sol Réelle (H - fv) :' : 'Actual Ground Clearance:'}</span>
                    <span
                      className={`font-black text-sm ${
                        mechSim.state2.isGroundClearanceCompliant ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {mechSim.state2.actualGroundClearanceMeters.toFixed(2)} m
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Angle de Balancement Vent (φw) :' : 'Wind Deflection Angle:'}</span>
                    <span className="text-cyan-300 font-bold">
                      {mechSim.state2.windDeflectionAngleDeg.toFixed(1)}°
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Débattement Latéral (Blowout) :' : 'Horizontal Swing Blowout:'}</span>
                    <span className="text-slate-300 font-bold">{mechSim.state2.horizontalSwingMeters.toFixed(2)} m</span>
                  </div>
                </div>
              </div>

              {/* Tensile Stresses & Pylon Support Loads */}
              <div className="rounded-xl bg-slate-900/40 border border-white/10 p-5 backdrop-blur-xl">
                <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>{locale === 'fr' ? 'Traction & Efforts aux Supports' : 'Tension & Support Loads'}</span>
                  <Anchor className="h-4 w-4 text-cyan-400" />
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Traction Horizontale (H2) :' : 'Horizontal Tension (H2):'}</span>
                    <span className="text-cyan-300 font-bold text-sm">
                      {mechSim.state2.horizontalTensionKn.toFixed(2)} kN ({mechSim.state2.percentRts.toFixed(1)}% RTS)
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Contrainte Mécanique (σ2) :' : 'Conductor Stress (σ2):'}</span>
                    <span className="text-white font-bold">{mechSim.state2.mechanicalStressMpa.toFixed(1)} MPa</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Tension Max à l\'Accrochage (Tmax) :' : 'Max Tension at Tower Support:'}</span>
                    <span className="text-amber-400 font-bold">{mechSim.state2.maxTensionAtSupportKn.toFixed(2)} kN</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Facteur de Sécurité (RTS / Tmax) :' : 'Safety Factor (RTS / Tmax):'}</span>
                    <span
                      className={`font-black text-sm ${
                        mechSim.state2.isTensionSafetyCompliant ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {mechSim.state2.safetyFactorAgainstRts.toFixed(2)} (Seuil ≥ 2.50)
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#07090E]/60 border border-white/5">
                    <span className="text-slate-400">{locale === 'fr' ? 'Puissance Naturelle Ligne (SIL) :' : 'Surge Impedance Loading (SIL):'}</span>
                    <span className="text-cyan-400 font-bold">{calcs.silMw.toFixed(1)} MW (Zc = {calcs.zcOhm.toFixed(1)} Ω)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width SVG Catenary & Clearance Profile Diagram */}
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Profil Vectoriel Catenary & Garde au Sol (Poutre Caténaire)' : 'Catenary Conductor Profile & Ground Clearance (Vector)'}</span>
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-0.5 bg-sky-400 inline-block border-b border-dashed" />
                  <span>{locale === 'fr' ? 'État 1 (EDS)' : 'State 1 (EDS)'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-3 h-0.5 bg-amber-400 inline-block" />
                  <span>{locale === 'fr' ? 'État 2 (Calculé)' : 'State 2 (Evaluated)'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-400 inline-block border-b border-dotted" />
                  <span>{locale === 'fr' ? 'Garde Min Requise' : 'Min Clearance'}</span>
                </span>
              </div>
            </div>

            <div className="w-full flex justify-center py-4 bg-[#07090E]/90 rounded-lg border border-white/5 overflow-x-auto">
              <svg viewBox="0 0 800 320" className="w-full max-w-[800px] h-auto select-none">
                <defs>
                  <linearGradient id="pylonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0B132B" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#07090E" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Sky backdrop */}
                <rect x="0" y="0" width="800" height="280" fill="url(#skyGrad)" />

                {/* Ground terrain line (y = 280) */}
                <line x1="20" y1="280" x2="780" y2="280" stroke="#334155" strokeWidth="2.5" />
                <rect x="20" y="280" width="760" height="35" fill="#0F172A" opacity="0.6" />
                <text x="400" y="302" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">
                  {locale === 'fr' ? 'NIVEAU DU SOL (TERRAIN NATUREL / ROUTE / SURVOL VÉGÉTAL)' : 'GROUND LEVEL / STATUTORY CLEARANCE DATUM'}
                </text>

                {/* Statutory clearance line */}
                {(() => {
                  const clearY = 280 - (minGroundClearanceM * 6.5);
                  return (
                    <g>
                      <line x1="80" y1={clearY} x2="720" y2={clearY} stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
                      <text x="85" y={clearY - 4} fill="#10B981" fontSize="9" fontFamily="monospace">
                        Garde Min = {minGroundClearanceM} m
                      </text>
                    </g>
                  );
                })()}

                {/* Tower 1 (Left Pylon at x = 120, height attachment at y = 60) */}
                <g>
                  {/* Pylon Lattice */}
                  <polygon points="120,60 100,280 140,280" fill="none" stroke="url(#pylonGrad)" strokeWidth="2" />
                  <line x1="106" y1="220" x2="134" y2="220" stroke="#475569" strokeWidth="1.5" />
                  <line x1="112" y1="160" x2="128" y2="160" stroke="#475569" strokeWidth="1.5" />
                  <line x1="116" y1="110" x2="124" y2="110" stroke="#475569" strokeWidth="1.5" />
                  {/* Crossarm */}
                  <line x1="90" y1="65" x2="150" y2="65" stroke="#94A3B8" strokeWidth="3" />
                  {/* Insulator String */}
                  <line x1="120" y1="65" x2="120" y2="85" stroke="#38BDF8" strokeWidth="2" />
                  <circle cx="120" cy="85" r="3" fill="#38BDF8" />
                  <text x="120" y="48" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    Pylône A (H = {attachmentHeightM} m)
                  </text>
                </g>

                {/* Tower 2 (Right Pylon at x = 680, height attachment at y = 60) */}
                <g>
                  {/* Pylon Lattice */}
                  <polygon points="680,60 660,280 700,280" fill="none" stroke="url(#pylonGrad)" strokeWidth="2" />
                  <line x1="666" y1="220" x2="694" y2="220" stroke="#475569" strokeWidth="1.5" />
                  <line x1="672" y1="160" x2="688" y2="160" stroke="#475569" strokeWidth="1.5" />
                  <line x1="676" y1="110" x2="684" y2="110" stroke="#475569" strokeWidth="1.5" />
                  {/* Crossarm */}
                  <line x1="650" y1="65" x2="710" y2="65" stroke="#94A3B8" strokeWidth="3" />
                  {/* Insulator String */}
                  <line x1="680" y1="65" x2="680" y2="85" stroke="#38BDF8" strokeWidth="2" />
                  <circle cx="680" cy="85" r="3" fill="#38BDF8" />
                  <text x="680" y="48" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    Pylône B (Portée a = {rulingSpanMeters} m)
                  </text>
                </g>

                {/* State 1 Conductor Catenary Curve (Dashed Sky Blue) */}
                {(() => {
                  const sag1Px = Math.min(160, mechSim.state1.midSpanSagMeters * 6.5);
                  return (
                    <path
                      d={`M 120 85 Q 400 ${85 + sag1Px * 2} 680 85`}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />
                  );
                })()}

                {/* State 2 Conductor Catenary Curve (Solid Amber/Cyan) */}
                {(() => {
                  const sag2Px = Math.min(185, mechSim.state2.verticalSagMeters * 6.5);
                  const midY2 = 85 + sag2Px;
                  const isClear = mechSim.state2.isGroundClearanceCompliant;

                  return (
                    <g>
                      <path
                        d={`M 120 85 Q 400 ${85 + sag2Px * 2} 680 85`}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                      />

                      {/* Mid-span conductor point */}
                      <circle cx="400" cy={midY2} r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />

                      {/* Sag dimension arrow (y: 85 to midY2) */}
                      <line x1="375" y1="85" x2="375" y2={midY2} stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="2 2" />
                      <line x1="370" y1="85" x2="380" y2="85" stroke="#F59E0B" strokeWidth="1.2" />
                      <line x1="370" y1={midY2} x2="380" y2={midY2} stroke="#F59E0B" strokeWidth="1.2" />
                      <text x="365" y={(85 + midY2) / 2 + 3} textAnchor="end" fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        f2 = {mechSim.state2.totalMidSpanSagMeters.toFixed(2)} m
                      </text>

                      {/* Ground clearance dimension arrow (y: midY2 to 280) */}
                      <line x1="425" y1={midY2} x2="425" y2="280" stroke={isClear ? '#10B981' : '#F43F5E'} strokeWidth="1.5" />
                      <line x1="420" y1={midY2} x2="430" y2={midY2} stroke={isClear ? '#10B981' : '#F43F5E'} strokeWidth="1.5" />
                      <line x1="420" y1={280} x2="430" y2="280" stroke={isClear ? '#10B981' : '#F43F5E'} strokeWidth="1.5" />
                      <text
                        x="435"
                        y={(midY2 + 280) / 2 + 4}
                        textAnchor="start"
                        fill={isClear ? '#10B981' : '#F43F5E'}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        Garde = {mechSim.state2.actualGroundClearanceMeters.toFixed(2)} m
                      </text>

                      {/* Wind swing angle annotation if wind is active */}
                      {mechSim.state2.windDeflectionAngleDeg > 0 && (
                        <g>
                          <rect x="520" y="110" width="140" height="42" rx="6" fill="#07090E" stroke="#38BDF8" strokeWidth="1" opacity="0.9" />
                          <text x="590" y="126" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            Balancement φw = {mechSim.state2.windDeflectionAngleDeg.toFixed(1)}°
                          </text>
                          <text x="590" y="142" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                            Débattement = {mechSim.state2.horizontalSwingMeters.toFixed(2)} m
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })()}

                {/* Ruling Span Double Arrow Dimension */}
                <line x1="120" y1="25" x2="680" y2="25" stroke="#64748B" strokeWidth="1" />
                <polygon points="120,25 128,22 128,28" fill="#64748B" />
                <polygon points="680,25 672,22 672,28" fill="#64748B" />
                <text x="400" y="20" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="monospace">
                  Portée de réglage équivalente ar = {rulingSpanMeters} m
                </text>
              </svg>
            </div>
          </div>

          {/* Full-Width Temperature-Sag Profile Table */}
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Table className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Tableau de Réglage : Profil Température-Tension-Flèche (10°C à 90°C)' : 'Stringing Table: Temperature-Tension-Sag Profile (10°C to 90°C)'}</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {mechSim.conductor.codeName} · Portée {rulingSpanMeters} m
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-[#07090E] text-slate-400 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">Température (°C)</th>
                    <th className="py-2.5 px-3">Traction H (kN)</th>
                    <th className="py-2.5 px-3">Contrainte σ (MPa)</th>
                    <th className="py-2.5 px-3">Flèche f (m)</th>
                    <th className="py-2.5 px-3">Garde au Sol (m)</th>
                    <th className="py-2.5 px-3">Facteur Séc. (RTS/H)</th>
                    <th className="py-2.5 px-3 text-right">Statut Garde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mechSim.temperatureProfile.map((pt) => {
                    const isSelectedTemp = Math.abs(pt.temperatureC - state2TempC) < 2.5;
                    const isCompliant = pt.groundClearanceMeters >= minGroundClearanceM;

                    return (
                      <tr
                        key={pt.temperatureC}
                        className={`transition-colors ${
                          isSelectedTemp
                            ? 'bg-cyan-500/15 border-l-2 border-cyan-400 font-bold'
                            : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-2.5 px-3 flex items-center gap-2">
                          <span className={isSelectedTemp ? 'text-cyan-300 font-black' : 'text-slate-300'}>
                            {pt.temperatureC}°C
                          </span>
                          {isSelectedTemp && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px]">
                              {locale === 'fr' ? 'ÉTAT 2' : 'STATE 2'}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-cyan-300">{pt.horizontalTensionKn.toFixed(2)} kN</td>
                        <td className="py-2.5 px-3 text-white">{pt.mechanicalStressMpa.toFixed(1)} MPa</td>
                        <td className="py-2.5 px-3 text-amber-300 font-bold">{pt.midSpanSagMeters.toFixed(2)} m</td>
                        <td className="py-2.5 px-3">
                          <span className={isCompliant ? 'text-emerald-400' : 'text-rose-400'}>
                            {pt.groundClearanceMeters.toFixed(2)} m
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{pt.safetyFactorRts.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isCompliant
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {isCompliant ? 'OK' : 'DANGER'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. ELECTRICAL VIEW: LINE R-L-C & CORONA LOSSES (PEEK / SIL)         */}
      {/* =================================================================== */}
      {activeTab === 'electrical' && (
        <div className="space-y-6">
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
  )}

  {/* =================================================================== */}
  {/* 4. NORMATIVE FORMULAS & PRINCIPLES MODAL                           */}
  {/* =================================================================== */}
  {isNormativeModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#11161D] border border-cyan-500/30 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              {locale === 'fr'
                ? 'Normes & Équations Mécaniques de Lignes (CEI 60826 / Cigré TB 273)'
                : 'Overhead Conductor Mechanical Norms & Equations (IEC 60826 / Cigré TB 273)'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsNormativeModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#07090E] border border-white/10">
            <h4 className="text-cyan-300 font-bold uppercase text-[11px] mb-1">
              1. Équation d'État Cubique de Blondel / Truxa (Cigré TB 273 / EN 50341)
            </h4>
            <p className="text-slate-400 mb-2">
              Relie la contrainte mécanique finale σ2 sous de nouvelles conditions de température θ2 et de charge de vent γ2 à l'état de pose initial (σ1, θ1, γ1) :
            </p>
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold overflow-x-auto text-center">
              σ2² · [ σ2 + (E · (γ1 · a)²)/(24 · σ1²) + E · α · (θ2 - θ1) - σ1 ] = (E · (γ2 · a)²) / 24
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Résolue avec exactitude par le solveur itératif de Newton-Raphson de l'EPEDE (tolérance &lt; 10⁻⁶ MPa sur la racine physique positive unique).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07090E] border border-white/10">
            <h4 className="text-cyan-300 font-bold uppercase text-[11px] mb-1">
              2. Pression Dynamique de Vent & Angle de Balancement (CEI 60826 Clause 5.3)
            </h4>
            <p className="text-slate-400 mb-2">
              La pression dynamique du vent transversal qw et la force linéique exercée sur le conducteur de diamètre d sont calculées par :
            </p>
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold text-center">
              qw = 0.5 · ρ_air · vw² [Pa] &nbsp;|&nbsp; Fw = qw · Cd · (d / 1000) [N/m]
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/30 text-amber-300 font-bold text-center mt-2">
              W_res = √(wc² + Fw²) [N/m] &nbsp;|&nbsp; tan(φw) = Fw / wc
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07090E] border border-white/10">
            <h4 className="text-cyan-300 font-bold uppercase text-[11px] mb-1">
              3. Flèche Mi-Portée & Garde au Sol Réglementaire (Arrêté Technique Cameroun / SONATREL)
            </h4>
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold text-center">
              f2 = (W_res · a²) / (8 · H2) [m] &nbsp;|&nbsp; f_verticale = f2 · cos(φw) [m]
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/30 text-emerald-300 font-bold text-center mt-2">
              Garde Réelle = H_accrochage - f_verticale ≥ h_reglementaire (7.5 m en 225 kV, 6.5 m en 90 kV, 6.0 m en 30 kV)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07090E] border border-white/10">
            <h4 className="text-cyan-300 font-bold uppercase text-[11px] mb-1">
              4. Facteur de Sécurité Mécanique & Tension d'Accrochage
            </h4>
            <p className="text-slate-400 mb-2">
              La tension maximale exercée à la console du pylône intègre la composante de poids propre sur la flèche :
            </p>
            <div className="p-2.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold text-center">
              T_max = H2 + W_res · f2 [N] &nbsp;|&nbsp; Facteur de Sécurité = RTS / T_max ≥ 2.50
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => setIsNormativeModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs transition-all shadow-lg"
          >
            {locale === 'fr' ? 'Fermer la Documentation' : 'Close Documentation'}
          </button>
        </div>
      </div>
    </div>
  )}
</div>
);
};
