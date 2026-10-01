// src/components/calculators/modules/CableAmpacityCalculator.tsx
// Module 14: Cable Ampacity, Thermal Derating & Short-Circuit Thermal Withstand (IEC 60287 / IEC 60364-5-52 / IEC 60949 / NF C 15-100)
// High-Voltage & Low-Voltage Cable Engineering - EPEDE Supreme Engineering Council

import React, { useState, useMemo, useEffect } from 'react';
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
  Gauge,
  Thermometer,
  ArrowRight,
  Sun,
  Flame,
  Scale
} from 'lucide-react';

export interface InjectedCableParams {
  unVolts?: number;
  systemType?: '3ph' | '1ph' | 'dc';
  pKw?: number;
  cosPhi?: number;
  cableLengthM?: number;
  maxDeltaUPercent?: number;
  selectedSectionMm2?: number;
  conductorMaterial?: 'copper' | 'aluminium';
  insulationType?: 'xlpe_90' | 'pvc_70';
  numParallelRuns?: number;
  ikKa?: number;
  tkSec?: number;
  ambientTempC?: number;
  installationMethod?: 'method_c' | 'method_d' | 'method_e' | 'method_f';
  numGroupedCircuits?: number;
  soilThermalResistivityKmW?: number;
  burialDepthM?: number;
}

export interface CableAmpacityCalculatorProps {
  locale: 'fr' | 'en';
  initialParams?: InjectedCableParams;
  injectedContextInfo?: {
    equipmentId: string;
    equipmentName: string;
    equipmentTag?: string;
  };
  onOpenReport?: () => void;
}

export type CablePreset = 
  | 'depart_hta_30kv_al'
  | 'tgbt_usine_400v_cu'
  | 'station_pompage_enterre'
  | 'ferme_solaire_1500v_dc'
  | 'colonne_montante_lszh'
  | 'custom';

// Standard commercial cross-sections in mm²
export const STANDARD_CROSS_SECTIONS = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630
];

// Base ampacities I0 (Amperes) for Method C (perforated tray / wall in air at 30°C, 3 loaded conductors)
// Reference: IEC 60364-5-52 Table B.52.4 & B.52.5
export const BASE_AMPACITIES_METHOD_C_XLPE_CU: Record<number, number> = {
  1.5: 23,
  2.5: 31,
  4: 42,
  6: 54,
  10: 75,
  16: 100,
  25: 127,
  35: 158,
  50: 192,
  70: 246,
  95: 298,
  120: 346,
  150: 399,
  185: 456,
  240: 538,
  300: 621,
  400: 741,
  500: 855,
  630: 981
};

export const CableAmpacityCalculator: React.FC<CableAmpacityCalculatorProps> = ({ 
  locale, 
  initialParams, 
  injectedContextInfo, 
  onOpenReport 
}) => {
  // ---------------------------------------------------------------------------
  // 1. INPUT STATE
  // ---------------------------------------------------------------------------
  const [activePreset, setActivePreset] = useState<CablePreset>('depart_hta_30kv_al');

  // Electrical Load Parameters
  const [unVolts, setUnVolts] = useState<number>(30000); // 30 kV nominal
  const [systemType, setSystemType] = useState<'3ph' | '1ph' | 'dc'>('3ph');
  const [pKw, setPKw] = useState<number>(4500); // 4.5 MW load
  const [cosPhi, setCosPhi] = useState<number>(0.90);
  const [cableLengthM, setCableLengthM] = useState<number>(2500); // 2.5 km line
  const [maxDeltaUPercent, setMaxDeltaUPercent] = useState<number>(5.0); // max 5%

  // Cable Conductor & Insulation
  const [conductorMaterial, setConductorMaterial] = useState<'copper' | 'aluminium'>('aluminium');
  const [insulationType, setInsulationType] = useState<'xlpe_90' | 'pvc_70'>('xlpe_90');
  const [numParallelRuns, setNumParallelRuns] = useState<number>(1); // 1..4 parallel runs
  const [selectedSectionMm2, setSelectedSectionMm2] = useState<number>(240);

  // Short-Circuit Parameters (IEC 60949)
  const [ikKa, setIkKa] = useState<number>(12.5); // 12.5 kA rms short-circuit
  const [tkSec, setTkSec] = useState<number>(0.5); // 0.5 s clearing time

  // Installation Environment & Derating Factors (IEC 60364-5-52)
  const [installationMethod, setInstallationMethod] = useState<'method_c' | 'method_d' | 'method_e' | 'method_f'>('method_d'); // buried in conduit
  const [ambientTempC, setAmbientTempC] = useState<number>(35); // 35°C (Cameroon/African climate)
  const [numGroupedCircuits, setNumGroupedCircuits] = useState<number>(2); // 2 circuits touching
  const [soilThermalResistivityKmW, setSoilThermalResistivityKmW] = useState<number>(1.5); // 1.5 K.m/W
  const [burialDepthM, setBurialDepthM] = useState<number>(0.8); // 0.8 m
  const [thdHarmonics, setThdHarmonics] = useState<'none' | 'moderate_15_33' | 'high_gt_33'>('none');

  // Synchronize initialParams if injected from Equipment Detail or Drawer
  useEffect(() => {
    if (initialParams) {
      setActivePreset('custom');
      if (initialParams.unVolts !== undefined) setUnVolts(initialParams.unVolts);
      if (initialParams.systemType !== undefined) setSystemType(initialParams.systemType);
      if (initialParams.pKw !== undefined) setPKw(initialParams.pKw);
      if (initialParams.cosPhi !== undefined) setCosPhi(initialParams.cosPhi);
      if (initialParams.cableLengthM !== undefined) setCableLengthM(initialParams.cableLengthM);
      if (initialParams.maxDeltaUPercent !== undefined) setMaxDeltaUPercent(initialParams.maxDeltaUPercent);
      if (initialParams.conductorMaterial !== undefined) setConductorMaterial(initialParams.conductorMaterial);
      if (initialParams.insulationType !== undefined) setInsulationType(initialParams.insulationType);
      if (initialParams.selectedSectionMm2 !== undefined) setSelectedSectionMm2(initialParams.selectedSectionMm2);
      if (initialParams.numParallelRuns !== undefined) setNumParallelRuns(initialParams.numParallelRuns);
      if (initialParams.ikKa !== undefined) setIkKa(initialParams.ikKa);
      if (initialParams.tkSec !== undefined) setTkSec(initialParams.tkSec);
      if (initialParams.installationMethod !== undefined) setInstallationMethod(initialParams.installationMethod);
      if (initialParams.ambientTempC !== undefined) setAmbientTempC(initialParams.ambientTempC);
      if (initialParams.numGroupedCircuits !== undefined) setNumGroupedCircuits(initialParams.numGroupedCircuits);
      if (initialParams.soilThermalResistivityKmW !== undefined) setSoilThermalResistivityKmW(initialParams.soilThermalResistivityKmW);
      if (initialParams.burialDepthM !== undefined) setBurialDepthM(initialParams.burialDepthM);
    }
  }, [initialParams]);

  // ---------------------------------------------------------------------------
  // 2. PRESETS
  // ---------------------------------------------------------------------------
  const applyPreset = (preset: CablePreset) => {
    setActivePreset(preset);
    switch (preset) {
      case 'depart_hta_30kv_al':
        setUnVolts(30000);
        setSystemType('3ph');
        setPKw(5000);
        setCosPhi(0.90);
        setCableLengthM(3200);
        setMaxDeltaUPercent(5.0);
        setConductorMaterial('aluminium');
        setInsulationType('xlpe_90');
        setNumParallelRuns(1);
        setSelectedSectionMm2(240);
        setIkKa(12.5);
        setTkSec(0.5);
        setInstallationMethod('method_d'); // buried in trenches
        setAmbientTempC(35);
        setNumGroupedCircuits(2);
        setSoilThermalResistivityKmW(1.5);
        setBurialDepthM(0.8);
        setThdHarmonics('none');
        break;

      case 'tgbt_usine_400v_cu':
        setUnVolts(400);
        setSystemType('3ph');
        setPKw(450); // 450 kW ~ 650 A
        setCosPhi(0.85);
        setCableLengthM(85);
        setMaxDeltaUPercent(3.0);
        setConductorMaterial('copper');
        setInsulationType('xlpe_90');
        setNumParallelRuns(2); // 2 runs of 185 mm²
        setSelectedSectionMm2(185);
        setIkKa(35.0); // 35 kA at transformer terminals
        setTkSec(0.2); // 200 ms breaker trip
        setInstallationMethod('method_f'); // perforated cable ladder
        setAmbientTempC(40); // 40°C electrical room
        setNumGroupedCircuits(3);
        setSoilThermalResistivityKmW(1.0);
        setBurialDepthM(0.7);
        setThdHarmonics('moderate_15_33');
        break;

      case 'station_pompage_enterre':
        setUnVolts(400);
        setSystemType('3ph');
        setPKw(160); // 160 kW motor pump
        setCosPhi(0.88);
        setCableLengthM(320);
        setMaxDeltaUPercent(4.0);
        setConductorMaterial('copper');
        setInsulationType('pvc_70');
        setNumParallelRuns(1);
        setSelectedSectionMm2(150);
        setIkKa(18.0);
        setTkSec(0.4);
        setInstallationMethod('method_d');
        setAmbientTempC(30);
        setNumGroupedCircuits(1);
        setSoilThermalResistivityKmW(1.2);
        setBurialDepthM(1.0);
        setThdHarmonics('none');
        break;

      case 'ferme_solaire_1500v_dc':
        setUnVolts(1500);
        setSystemType('dc');
        setPKw(800); // 800 kW DC array
        setCosPhi(1.0);
        setCableLengthM(450);
        setMaxDeltaUPercent(1.5);
        setConductorMaterial('aluminium');
        setInsulationType('xlpe_90');
        setNumParallelRuns(1);
        setSelectedSectionMm2(300);
        setIkKa(8.0);
        setTkSec(0.1);
        setInstallationMethod('method_c');
        setAmbientTempC(45); // high ambient solar field
        setNumGroupedCircuits(4);
        setSoilThermalResistivityKmW(1.5);
        setBurialDepthM(0.7);
        setThdHarmonics('none');
        break;

      case 'colonne_montante_lszh':
        setUnVolts(400);
        setSystemType('3ph');
        setPKw(200);
        setCosPhi(0.92);
        setCableLengthM(65);
        setMaxDeltaUPercent(2.0);
        setConductorMaterial('copper');
        setInsulationType('xlpe_90');
        setNumParallelRuns(1);
        setSelectedSectionMm2(95);
        setIkKa(22.0);
        setTkSec(0.3);
        setInstallationMethod('method_c'); // vertical cable duct
        setAmbientTempC(35);
        setNumGroupedCircuits(2);
        setSoilThermalResistivityKmW(1.0);
        setBurialDepthM(0.7);
        setThdHarmonics('moderate_15_33');
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // 3. SCIENTIFIC COMPUTATION ENGINE
  // ---------------------------------------------------------------------------
  const calculation = useMemo(() => {
    // 1. Design Load Current Ib (Amperes)
    let ib = 0;
    if (systemType === '3ph') {
      ib = (pKw * 1000) / (Math.sqrt(3) * unVolts * cosPhi);
    } else if (systemType === '1ph') {
      ib = (pKw * 1000) / (unVolts * cosPhi);
    } else {
      // DC
      ib = (pKw * 1000) / unVolts;
    }

    // Design current per parallel run
    const ibPerRun = ib / numParallelRuns;

    // 2. Environmental Derating Factors (IEC 60364-5-52)
    // k1: Temperature factor
    const maxOperatingTemp = insulationType === 'xlpe_90' ? 90 : 70;
    const refTemp = installationMethod === 'method_d' ? 20 : 30;
    const k1 = Math.sqrt(Math.max(0.1, (maxOperatingTemp - ambientTempC) / (maxOperatingTemp - refTemp)));

    // k2: Grouping factor (proximity)
    let k2 = 1.0;
    if (numGroupedCircuits === 2) k2 = 0.88;
    else if (numGroupedCircuits === 3) k2 = 0.82;
    else if (numGroupedCircuits === 4) k2 = 0.77;
    else if (numGroupedCircuits >= 5 && numGroupedCircuits <= 6) k2 = 0.72;
    else if (numGroupedCircuits > 6) k2 = 0.68;

    // k3: Soil thermal resistivity factor (for Method D)
    let k3 = 1.0;
    if (installationMethod === 'method_d') {
      if (soilThermalResistivityKmW <= 1.0) k3 = 1.15;
      else if (soilThermalResistivityKmW <= 1.5) k3 = 1.00;
      else if (soilThermalResistivityKmW <= 2.0) k3 = 0.90;
      else k3 = 0.80;
    }

    // k4: Burial depth factor (for Method D)
    let k4 = 1.0;
    if (installationMethod === 'method_d') {
      if (burialDepthM < 0.8) k4 = 1.00;
      else if (burialDepthM <= 1.0) k4 = 0.98;
      else k4 = 0.95;
    }

    // kh: Harmonics neutral heating factor (Annex E)
    let kh = 1.0;
    if (thdHarmonics === 'moderate_15_33') kh = 0.86;
    else if (thdHarmonics === 'high_gt_33') kh = 0.70;

    // Total derating multiplier K_total
    const kTotal = k1 * k2 * k3 * k4 * kh;

    // 3. Material Factor for Base Ampacity
    // Reference base table is for Method C, Copper, XLPE
    let materialFactor = 1.0;
    if (conductorMaterial === 'aluminium') materialFactor *= 0.78;
    if (insulationType === 'pvc_70') materialFactor *= 0.78;
    if (installationMethod === 'method_d') materialFactor *= 0.85; // duct in ground has lower heat dissipation
    if (installationMethod === 'method_f') materialFactor *= 1.12; // free ladder rack has superior ventilation

    // 4. Short-Circuit Adiabatic Constant k (IEC 60949 / IEC 60364-4-43)
    let kAdiabatic = 143; // Cu / XLPE
    if (conductorMaterial === 'copper' && insulationType === 'pvc_70') kAdiabatic = 115;
    if (conductorMaterial === 'aluminium' && insulationType === 'xlpe_90') kAdiabatic = 94;
    if (conductorMaterial === 'aluminium' && insulationType === 'pvc_70') kAdiabatic = 76;

    // Minimum Section required for Short-Circuit: S_sc = (Isc * sqrt(t)) / k
    const sShortCircuitMin = (ikKa * 1000 * Math.sqrt(tkSec)) / (kAdiabatic * numParallelRuns);

    // 5. Conductor Resistivity and Reactance
    // rho20 in Ohm.mm2/m
    const rho20 = conductorMaterial === 'copper' ? 0.0175 : 0.0282;
    // Temperature coefficient alpha20 = 0.00393 /°C
    const operatingTemp = maxOperatingTemp;
    const rhoOperating = rho20 * (1 + 0.00393 * (operatingTemp - 20)); // at 90°C or 70°C
    const xReactancePerKm = 0.08; // Ohm/km average for cables

    // 6. Evaluation across all Standard Sections
    const sectionEvaluations = STANDARD_CROSS_SECTIONS.map((sec) => {
      const baseI0 = (BASE_AMPACITIES_METHOD_C_XLPE_CU[sec] || (sec * 2.5)) * materialFactor;
      const izPerRun = baseI0 * kTotal;
      const izTotal = izPerRun * numParallelRuns;

      // Resistance of run in Ohms: R = (rho * L) / sec
      const rCableOhm = (rhoOperating * cableLengthM) / (sec * numParallelRuns);
      const xCableOhm = (xReactancePerKm * (cableLengthM / 1000)) / numParallelRuns;

      // Voltage drop in Volts
      let deltaUVolts = 0;
      if (systemType === '3ph') {
        const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
        deltaUVolts = Math.sqrt(3) * ib * (rCableOhm * cosPhi + xCableOhm * sinPhi);
      } else if (systemType === '1ph') {
        const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
        deltaUVolts = 2 * ib * (rCableOhm * cosPhi + xCableOhm * sinPhi);
      } else {
        // DC: 2 * I * R
        deltaUVolts = 2 * ib * rCableOhm;
      }

      const deltaUPercent = (deltaUVolts / unVolts) * 100;
      const isThermalOk = izTotal >= ib;
      const isShortCircuitOk = sec >= sShortCircuitMin;
      const isVoltageDropOk = deltaUPercent <= maxDeltaUPercent;
      const isAllOk = isThermalOk && isShortCircuitOk && isVoltageDropOk;

      // Joules losses in kW (P_loss = 3 * R * I^2 for 3ph)
      let lossesKw = 0;
      if (systemType === '3ph') {
        lossesKw = (3 * rCableOhm * Math.pow(ib, 2)) / 1000;
      } else {
        lossesKw = (2 * rCableOhm * Math.pow(ib, 2)) / 1000;
      }

      return {
        sectionMm2: sec,
        baseI0: Math.round(baseI0),
        izTotal: Math.round(izTotal * 10) / 10,
        deltaUVolts: Math.round(deltaUVolts * 10) / 10,
        deltaUPercent: Math.round(deltaUPercent * 100) / 100,
        lossesKw: Math.round(lossesKw * 10) / 10,
        isThermalOk,
        isShortCircuitOk,
        isVoltageDropOk,
        isAllOk,
      };
    });

    // 7. Optimal Recommended Section
    const recommended = sectionEvaluations.find((e) => e.isAllOk) || sectionEvaluations[sectionEvaluations.length - 1];

    // Selected Section Data
    const selected = sectionEvaluations.find((e) => e.sectionMm2 === selectedSectionMm2) || recommended;

    // Governing criteria identifying which condition demanded the biggest section
    const thermalMinSection = sectionEvaluations.find((e) => e.isThermalOk)?.sectionMm2 || 0;
    const scMinSection = sectionEvaluations.find((e) => e.isShortCircuitOk)?.sectionMm2 || 0;
    const vDropMinSection = sectionEvaluations.find((e) => e.isVoltageDropOk)?.sectionMm2 || 0;

    let governingCriteria = 'thermal';
    const maxNeeded = Math.max(thermalMinSection, scMinSection, vDropMinSection);
    if (maxNeeded === vDropMinSection && vDropMinSection > thermalMinSection) {
      governingCriteria = 'voltage_drop';
    } else if (maxNeeded === scMinSection && scMinSection > thermalMinSection) {
      governingCriteria = 'short_circuit';
    }

    // Thermal let-through withstand check: (k * S * N)^2 vs Isc^2 * t
    const withstandI2t = Math.pow(kAdiabatic * selected.sectionMm2 * numParallelRuns, 2);
    const faultI2t = Math.pow(ikKa * 1000, 2) * tkSec;
    const thermalStressRatio = faultI2t / withstandI2t;

    return {
      ib: Math.round(ib * 10) / 10,
      ibPerRun: Math.round(ibPerRun * 10) / 10,
      k1: Math.round(k1 * 1000) / 1000,
      k2: Math.round(k2 * 100) / 100,
      k3: Math.round(k3 * 100) / 100,
      k4: Math.round(k4 * 100) / 100,
      kh: Math.round(kh * 100) / 100,
      kTotal: Math.round(kTotal * 1000) / 1000,
      sShortCircuitMin: Math.round(sShortCircuitMin * 10) / 10,
      kAdiabatic,
      recommendedSection: recommended.sectionMm2,
      selected,
      sectionEvaluations,
      governingCriteria,
      withstandI2t,
      faultI2t,
      thermalStressRatio: Math.round(thermalStressRatio * 100) / 100,
    };
  }, [
    unVolts,
    systemType,
    pKw,
    cosPhi,
    cableLengthM,
    maxDeltaUPercent,
    conductorMaterial,
    insulationType,
    numParallelRuns,
    selectedSectionMm2,
    ikKa,
    tkSec,
    installationMethod,
    ambientTempC,
    numGroupedCircuits,
    soilThermalResistivityKmW,
    burialDepthM,
    thdHarmonics
  ]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Standards & Preset Selector */}
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black font-mono text-white tracking-wide">
                  {locale === 'fr'
                    ? 'Dimensionnement de Câbles & Déclassement Thermique (CEI 60364 / CEI 60287)'
                    : 'Cable Sizing, Thermal Derating & Ampacity (IEC 60364 / IEC 60287)'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  CEI 60364-5-52
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CEI 60949 (Isc)
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Calcul multi-critères simultané : Courant admissible déclassé (Iz), tenue thermique au court-circuit adiabatique (I²t) et chute de tension (ΔU).'
                  : 'Simultaneous multi-criteria sizing: Corrected ampacity (Iz), adiabatic short-circuit thermal withstand (I²t), and voltage drop (ΔU).'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenReport}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Note de Calcul' : 'Calculation Note'}</span>
            </button>
          </div>
        </div>

        {/* Presets List */}
        <div className="pt-4 flex items-center flex-wrap gap-2">
          <span className="text-xs font-mono text-neutral-400 mr-2 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>{locale === 'fr' ? 'Cas Types Industriels :' : 'Industrial Presets :'}</span>
          </span>

          {[
            { id: 'depart_hta_30kv_al', labelFr: 'Départ HTA 30 kV Souterrain (Al 240 mm²)', labelEn: '30 kV MV Feeder (Al 240 mm²)' },
            { id: 'tgbt_usine_400v_cu', labelFr: 'TGBT Usine 400 V / 450 kW (Cuivre 2x185 mm²)', labelEn: 'Main Switchboard 400V 450kW (Cu 2x185 mm²)' },
            { id: 'station_pompage_enterre', labelFr: 'Station Pompage 160 kW (Cuivre Enterré)', labelEn: 'Pumping Station 160 kW (Buried Cu)' },
            { id: 'ferme_solaire_1500v_dc', labelFr: 'Parc Solaire 1500 V DC (Al 300 mm²)', labelEn: 'Solar PV 1500 V DC (Al 300 mm²)' },
            { id: 'colonne_montante_lszh', labelFr: 'Colonne Tertiaire LSZH C1 (95 mm²)', labelEn: 'Building Riser LSZH (95 mm²)' },
          ].map((pr) => (
            <button
              key={pr.id}
              type="button"
              onClick={() => applyPreset(pr.id as CablePreset)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                activePreset === pr.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm'
                  : 'bg-[#0E1524] border-[#1E293B] text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {locale === 'fr' ? pr.labelFr : pr.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Live Injected Equipment Context Synchronization Banner */}
      {injectedContextInfo && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 font-mono text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/40">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                {locale === 'fr' ? 'APPARIEMENT CÂBLE DU RÉSEAU ACTIF' : 'ACTIVE NETWORK CABLE SIZING SYNC'}
              </span>
              <span className="text-white font-bold">
                {injectedContextInfo.equipmentTag && `[${injectedContextInfo.equipmentTag}] `}
                {injectedContextInfo.equipmentName}
              </span>
              <span className="ml-2 text-cyan-300 text-[11px]">
                ({unVolts >= 1000 ? `${(unVolts / 1000).toFixed(0)} kV` : `${unVolts} V`}
                {cableLengthM ? ` · ${cableLengthM} m` : ''}
                {selectedSectionMm2 ? ` · ${selectedSectionMm2} mm²` : ''}
                {conductorMaterial === 'copper' ? ' Cu' : ' Al'})
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-cyan-900/80 text-cyan-200 text-[11px] font-mono border border-cyan-600/60 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            IEC 60287 / 60364-5-52
          </span>
        </div>
      )}

      {/* Main Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card 1: Electrical Load & Circuit Parameters */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold text-neutral-200 uppercase flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? '1. CARACTÉRISTIQUES DU CIRCUIT & CHARGE' : '1. CIRCUIT & LOAD CHARACTERISTICS'}</span>
              </span>
              <span className="text-cyan-400 font-bold">{calculation.ib} A (Ib)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">TENSION (Un)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={unVolts}
                    onChange={(e) => setUnVolts(parseFloat(e.target.value) || 400)}
                    className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                  <span className="absolute right-2.5 top-1.5 text-neutral-500 text-[10px]">V</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">RÉGIME CIRCUIT</label>
                <select
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value as any)}
                  className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-bold"
                >
                  <option value="3ph">Triphasé 3P+N (AC)</option>
                  <option value="1ph">Monophasé 1P+N (AC)</option>
                  <option value="dc">Courant Continu (DC)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">PUISSANCE (P)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={pKw}
                    onChange={(e) => setPKw(parseFloat(e.target.value) || 10)}
                    className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                  <span className="absolute right-2.5 top-1.5 text-neutral-500 text-[10px]">kW</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">FACTEUR PUISSANCE (cos φ)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="1.0"
                  value={cosPhi}
                  onChange={(e) => setCosPhi(parseFloat(e.target.value) || 0.85)}
                  className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">LONGUEUR LIAISON (L)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={cableLengthM}
                    onChange={(e) => setCableLengthM(parseFloat(e.target.value) || 10)}
                    className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                  <span className="absolute right-2.5 top-1.5 text-neutral-500 text-[10px]">m</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">CHUTE U MAX TOLÉRÉE</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={maxDeltaUPercent}
                    onChange={(e) => setMaxDeltaUPercent(parseFloat(e.target.value) || 5)}
                    className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                  <span className="absolute right-2.5 top-1.5 text-neutral-500 text-[10px]">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Cable Construction & Paralleling */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold text-neutral-200 uppercase flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-400" />
                <span>{locale === 'fr' ? '2. ÂME CONDUCTRICE & ISOLANT' : '2. CONDUCTOR & INSULATION'}</span>
              </span>
              <span className="text-amber-400 font-bold">k = {calculation.kAdiabatic}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">MÉTAL CONDUCTEUR</label>
                <select
                  value={conductorMaterial}
                  onChange={(e) => setConductorMaterial(e.target.value as any)}
                  className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-bold"
                >
                  <option value="copper">Cuivre (Cu - ρ=0.0175)</option>
                  <option value="aluminium">Aluminium (Al - ρ=0.0282)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">TYPE D'ISOLANT</label>
                <select
                  value={insulationType}
                  onChange={(e) => setInsulationType(e.target.value as any)}
                  className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-bold"
                >
                  <option value="xlpe_90">PR / XLPE (90°C)</option>
                  <option value="pvc_70">PVC (70°C)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">CÂBLES EN PARALLÈLE (N)</label>
                <select
                  value={numParallelRuns}
                  onChange={(e) => setNumParallelRuns(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-bold"
                >
                  <option value="1">1 câble par phase</option>
                  <option value="2">2 câbles en parallèle / ph</option>
                  <option value="3">3 câbles en parallèle / ph</option>
                  <option value="4">4 câbles en parallèle / ph</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">SECTION ÉVALUÉE (S)</label>
                <select
                  value={selectedSectionMm2}
                  onChange={(e) => setSelectedSectionMm2(parseFloat(e.target.value))}
                  className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-cyan-300 font-bold"
                >
                  {STANDARD_CROSS_SECTIONS.map((s) => (
                    <option key={s} value={s}>{s} mm²</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Installation Environment & Derating Factors */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold text-neutral-200 uppercase flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-rose-400" />
                <span>{locale === 'fr' ? '3. MODE DE POSE & DÉCLASSEMENTS' : '3. INSTALLATION & DERATING (IEC 60364)'}</span>
              </span>
              <span className="text-rose-400 font-bold">K_total = {calculation.kTotal}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">MODE DE POSE NORMALISÉ</label>
                <select
                  value={installationMethod}
                  onChange={(e) => setInstallationMethod(e.target.value as any)}
                  className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-bold"
                >
                  <option value="method_c">Méthode C : Fixation directe sur paroi / goulotte</option>
                  <option value="method_d">Méthode D : Câbles enterrés sous conduit / fourreau</option>
                  <option value="method_e">Méthode E : À l'air libre sur corbeaux / échelle</option>
                  <option value="method_f">Méthode F : Sur chemin de câbles perforé</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">TEMPÉRATURE AMBIANTE (T°)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={ambientTempC}
                      onChange={(e) => setAmbientTempC(parseFloat(e.target.value) || 30)}
                      className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-bold"
                    />
                    <span className="absolute right-2.5 top-1.5 text-neutral-500 text-[10px]">°C</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">CIRCUITS GROUPÉS (k2)</label>
                  <select
                    value={numGroupedCircuits}
                    onChange={(e) => setNumGroupedCircuits(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-bold"
                  >
                    <option value="1">1 circuit unique (k2=1.00)</option>
                    <option value="2">2 circuits juxtaposés (k2=0.88)</option>
                    <option value="3">3 circuits juxtaposés (k2=0.82)</option>
                    <option value="4">4 circuits juxtaposés (k2=0.77)</option>
                    <option value="6">6 circuits juxtaposés (k2=0.72)</option>
                  </select>
                </div>
              </div>

              {installationMethod === 'method_d' && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1E293B]">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">RÉSISTIVITÉ SOL (k3)</label>
                    <select
                      value={soilThermalResistivityKmW}
                      onChange={(e) => setSoilThermalResistivityKmW(parseFloat(e.target.value))}
                      className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-bold"
                    >
                      <option value="1.0">1.0 K.m/W (Sol humide standard)</option>
                      <option value="1.5">1.5 K.m/W (Sol argilo-sablonneux)</option>
                      <option value="2.0">2.0 K.m/W (Sol sec / saison sèche)</option>
                      <option value="2.5">2.5 K.m/W (Sable sec très défavorable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">PROFONDEUR DE POSE (k4)</label>
                    <select
                      value={burialDepthM}
                      onChange={(e) => setBurialDepthM(parseFloat(e.target.value))}
                      className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-bold"
                    >
                      <option value="0.7">0.7 m (Tranchée standard BT/MT)</option>
                      <option value="1.0">1.0 m (Sous voirie / passage lourd)</option>
                      <option value="1.5">1.5 m (Traversée spéciale)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">TAUX HARMONIQUES RANG 3 (kh - Annexe E)</label>
                <select
                  value={thdHarmonics}
                  onChange={(e) => setThdHarmonics(e.target.value as any)}
                  className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2 py-1.5 text-white font-bold"
                >
                  <option value="none">Faible / Linéaire : THD-I &lt; 15% (kh=1.00)</option>
                  <option value="moderate_15_33">Modéré : 15% ≤ THD-I ≤ 33% (kh=0.86)</option>
                  <option value="high_gt_33">Sévère : THD-I &gt; 33% Datacenter/LED (kh=0.70)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 4: Short-Circuit Thermal Stress (IEC 60949) */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-neutral-200 uppercase flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>{locale === 'fr' ? '4. TENUE AU COURT-CIRCUIT (CEI 60949)' : '4. SHORT-CIRCUIT WITHSTAND (IEC 60949)'}</span>
              </span>
              <span className="text-rose-400 font-bold">S_min = {calculation.sShortCircuitMin} mm²</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">COURANT COURT-CIRCUIT (Isc)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={ikKa}
                    onChange={(e) => setIkKa(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                  <span className="absolute right-2.5 top-1.5 text-neutral-500 text-[10px]">kA</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">TEMPS COUPURE DISJONCTEUR (tk)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={tkSec}
                    onChange={(e) => setTkSec(parseFloat(e.target.value) || 0.1)}
                    className="w-full bg-[#070A11] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                  <span className="absolute right-2.5 top-1.5 text-neutral-500 text-[10px]">s</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Results & Validation Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Verdict Card */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  {locale === 'fr' ? 'SECTION COMMERCIALE OPTIMALE PRÉCONISÉE' : 'RECOMMENDED STANDARD CROSS-SECTION'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-cyan-400">
                    {numParallelRuns > 1 ? `${numParallelRuns} × ` : ''}{calculation.recommendedSection} mm²
                  </span>
                  <span className="text-sm font-mono text-neutral-300">
                    {conductorMaterial === 'copper' ? 'Cuivre' : 'Aluminium'} {insulationType === 'xlpe_90' ? 'XLPE (90°C)' : 'PVC (70°C)'}
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-neutral-400 block uppercase">CRITÈRE DÉTERMINANT</span>
                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                  calculation.governingCriteria === 'voltage_drop'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : calculation.governingCriteria === 'short_circuit'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {calculation.governingCriteria === 'voltage_drop' 
                    ? (locale === 'fr' ? 'CHUTE DE TENSION (ΔU)' : 'VOLTAGE DROP (ΔU)')
                    : calculation.governingCriteria === 'short_circuit'
                    ? (locale === 'fr' ? 'COURT-CIRCUIT ADIABATIQUE' : 'SHORT-CIRCUIT THERMAL')
                    : (locale === 'fr' ? 'ÉCHAUFFEMENT PERMANENT (Iz)' : 'CONTINUOUS AMPACITY (Iz)')}
                </span>
              </div>
            </div>

            {/* Selected Cross-Section Performance Diagnostic */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              
              {/* Criterion 1: Continuous Ampacity Iz */}
              <div className={`p-3 rounded-xl border ${
                calculation.selected.isThermalOk 
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center justify-center gap-1 text-[10px] opacity-75 mb-1">
                  {calculation.selected.isThermalOk ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <AlertTriangle className="h-3 w-3 text-rose-400" />}
                  <span>COURANT ADMISSIBLE</span>
                </div>
                <span className="text-sm font-bold block">{calculation.selected.izTotal} A</span>
                <span className="text-[9px] opacity-75">Requis: ≥ {calculation.ib} A</span>
              </div>

              {/* Criterion 2: Voltage Drop */}
              <div className={`p-3 rounded-xl border ${
                calculation.selected.isVoltageDropOk 
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center justify-center gap-1 text-[10px] opacity-75 mb-1">
                  {calculation.selected.isVoltageDropOk ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <AlertTriangle className="h-3 w-3 text-rose-400" />}
                  <span>CHUTE TENSION (ΔU)</span>
                </div>
                <span className="text-sm font-bold block">{calculation.selected.deltaUPercent}%</span>
                <span className="text-[9px] opacity-75">{calculation.selected.deltaUVolts} V (Max {maxDeltaUPercent}%)</span>
              </div>

              {/* Criterion 3: Short-Circuit Thermal Stress */}
              <div className={`p-3 rounded-xl border ${
                calculation.selected.isShortCircuitOk 
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center justify-center gap-1 text-[10px] opacity-75 mb-1">
                  {calculation.selected.isShortCircuitOk ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <AlertTriangle className="h-3 w-3 text-rose-400" />}
                  <span>TENUE Isc (CEI 60949)</span>
                </div>
                <span className="text-sm font-bold block">
                  {calculation.selected.sectionMm2} mm²
                </span>
                <span className="text-[9px] opacity-75">Min requis: {calculation.sShortCircuitMin} mm²</span>
              </div>

              {/* Criterion 4: Joule Losses in line */}
              <div className="p-3 rounded-xl border bg-[#070A11] border-[#1E293B] text-neutral-200">
                <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 mb-1">
                  <Flame className="h-3 w-3 text-amber-400" />
                  <span>PERTES JOULE</span>
                </div>
                <span className="text-sm font-bold block text-amber-400">{calculation.selected.lossesKw} kW</span>
                <span className="text-[9px] text-neutral-500">{((calculation.selected.lossesKw / pKw) * 100).toFixed(2)}% de P</span>
              </div>

            </div>
          </div>

          {/* Derating Factor Cascade (Waterfall Visualization) */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3 font-mono">
            <h3 className="text-xs font-bold text-neutral-200 uppercase flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'DÉCOMPOSITION DES FACTEURS DE DÉCLASSEMENT' : 'DERATING FACTORS WATERFALL (IEC 60364-5-52)'}</span>
              </span>
              <span className="text-cyan-400 font-bold">K_total = {calculation.kTotal}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-[#070A11] p-2.5 rounded-xl border border-[#1E293B]">
                <span className="text-[9px] text-neutral-500 block">k1 (TEMPÉRATURE)</span>
                <span className="font-bold text-cyan-300">{calculation.k1}</span>
                <span className="text-[9px] text-neutral-400 block">{ambientTempC}°C</span>
              </div>

              <div className="bg-[#070A11] p-2.5 rounded-xl border border-[#1E293B]">
                <span className="text-[9px] text-neutral-500 block">k2 (GROUPEMENT)</span>
                <span className="font-bold text-cyan-300">{calculation.k2}</span>
                <span className="text-[9px] text-neutral-400 block">{numGroupedCircuits} circuits</span>
              </div>

              <div className="bg-[#070A11] p-2.5 rounded-xl border border-[#1E293B]">
                <span className="text-[9px] text-neutral-500 block">k3 (SOL/THERMIQUE)</span>
                <span className="font-bold text-cyan-300">{calculation.k3}</span>
                <span className="text-[9px] text-neutral-400 block">{soilThermalResistivityKmW} K.m/W</span>
              </div>

              <div className="bg-[#070A11] p-2.5 rounded-xl border border-[#1E293B]">
                <span className="text-[9px] text-neutral-500 block">k4 (PROFONDEUR)</span>
                <span className="font-bold text-cyan-300">{calculation.k4}</span>
                <span className="text-[9px] text-neutral-400 block">{burialDepthM} m</span>
              </div>

              <div className="bg-[#070A11] p-2.5 rounded-xl border border-[#1E293B]">
                <span className="text-[9px] text-neutral-500 block">kh (HARMONIQUES)</span>
                <span className="font-bold text-cyan-300">{calculation.kh}</span>
                <span className="text-[9px] text-neutral-400 block">Annexe E</span>
              </div>
            </div>
          </div>

          {/* Comparative Cross-Sections Table */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3 font-mono">
            <h3 className="text-xs font-bold text-neutral-200 uppercase flex items-center justify-between border-b border-[#1E293B] pb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'TABLEAU COMPARATIF DES SECTIONS STANDARDISÉES' : 'STANDARD CROSS-SECTIONS COMPARATIVE TABLE'}</span>
              </span>
              <span className="text-[10px] text-neutral-400">CEI 60228</span>
            </h3>

            <div className="overflow-x-auto max-h-72 border border-[#1E293B] rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#070A11] text-neutral-400 uppercase text-[10px] sticky top-0 border-b border-[#1E293B]">
                  <tr>
                    <th className="py-2 px-3">Section</th>
                    <th className="py-2 px-3">Iz Déclassé</th>
                    <th className="py-2 px-3">Chute U (V)</th>
                    <th className="py-2 px-3">Chute U (%)</th>
                    <th className="py-2 px-3">Tenue Isc</th>
                    <th className="py-2 px-3">Statut Global</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {calculation.sectionEvaluations.map((row) => (
                    <tr 
                      key={row.sectionMm2} 
                      onClick={() => setSelectedSectionMm2(row.sectionMm2)}
                      className={`cursor-pointer transition-colors ${
                        selectedSectionMm2 === row.sectionMm2 
                          ? 'bg-cyan-500/10 font-bold text-white' 
                          : 'hover:bg-neutral-800/40 text-neutral-300'
                      }`}
                    >
                      <td className="py-2 px-3 flex items-center gap-1.5">
                        {row.sectionMm2 === calculation.recommendedSection && (
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                        )}
                        <span>{row.sectionMm2} mm²</span>
                      </td>
                      <td className={`py-2 px-3 ${row.isThermalOk ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.izTotal} A
                      </td>
                      <td className="py-2 px-3 text-neutral-400">
                        {row.deltaUVolts} V
                      </td>
                      <td className={`py-2 px-3 ${row.isVoltageDropOk ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.deltaUPercent}%
                      </td>
                      <td className={`py-2 px-3 ${row.isShortCircuitOk ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.isShortCircuitOk ? 'OK' : 'NON'}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.isAllOk ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {row.isAllOk ? 'CONFORME' : 'NON CONFORME'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
