// src/components/automation/services/useAutomationProjectStore.ts
// EPEDE Domain D07 - Central Reactive Project Store for Industrial Automation & Control Systems
// Calibrated to IEC 61131-3, IEC 61508, IEC 61511, IEC 62443 & Cameroon Industrial Projects

import { useState, useMemo } from 'react';

export type AutomationIndustryKey =
  | 'HYDRO_PLANT_420MW'
  | 'CEMENT_PLANT_FIGUIL'
  | 'BREWERY_LINE_SABC'
  | 'PETROCHEM_TERMINAL_SCDP';

export interface AutomationIndustryProfile {
  id: AutomationIndustryKey;
  nameFr: string;
  nameEn: string;
  cameroonReference: string;
  nominalPowerKw: number;
  digitalInputsCount: number;
  digitalOutputsCount: number;
  analogInputsCount: number;
  analogOutputsCount: number;
  targetSilLevel: 'SIL_1' | 'SIL_2' | 'SIL_3';
  defaultVfdCount: number;
  defaultVfdTotalPowerKw: number;
  networkTopology: string;
}

export const AUTOMATION_PROFILES: Record<AutomationIndustryKey, AutomationIndustryProfile> = {
  HYDRO_PLANT_420MW: {
    id: 'HYDRO_PLANT_420MW',
    nameFr: 'Centrale Hydroélectrique Haute Chute (7 × 60 MW Francis)',
    nameEn: 'High-Head Hydroelectric Power Station (7 × 60 MW Francis)',
    cameroonReference: 'Aménagement Hydroélectrique de Nachtigal (420 MW) / Sanaga',
    nominalPowerKw: 420000,
    digitalInputsCount: 840,
    digitalOutputsCount: 420,
    analogInputsCount: 380,
    analogOutputsCount: 160,
    targetSilLevel: 'SIL_3',
    defaultVfdCount: 14,
    defaultVfdTotalPowerKw: 450,
    networkTopology: 'Double Anneau Fibre Optique PRP / HSR (Redondance Zéro Perte)'
  },
  CEMENT_PLANT_FIGUIL: {
    id: 'CEMENT_PLANT_FIGUIL',
    nameFr: 'Ligne de Broyage & Cuisson de Ciment (1.5 Mt/an)',
    nameEn: 'Cement Clinker Grinding & Kiln Line (1.5 Mt/year)',
    cameroonReference: 'Usine CIMENCAM de Figuil / Nomayos',
    nominalPowerKw: 18500,
    digitalInputsCount: 650,
    digitalOutputsCount: 320,
    analogInputsCount: 240,
    analogOutputsCount: 90,
    targetSilLevel: 'SIL_2',
    defaultVfdCount: 28,
    defaultVfdTotalPowerKw: 3800,
    networkTopology: 'Anneau Profinet IRT avec passerelles Profibus DP/PA'
  },
  BREWERY_LINE_SABC: {
    id: 'BREWERY_LINE_SABC',
    nameFr: 'Ligne d’Embouteillage & Brassage Agroalimentaire Haute Cadence',
    nameEn: 'High-Speed Brewing & Bottling Packaging Line',
    cameroonReference: 'Société Anonyme des Brasseries du Cameroun (SABC Douala/Yaoundé)',
    nominalPowerKw: 4200,
    digitalInputsCount: 420,
    digitalOutputsCount: 260,
    analogInputsCount: 140,
    analogOutputsCount: 60,
    targetSilLevel: 'SIL_2',
    defaultVfdCount: 46,
    defaultVfdTotalPowerKw: 950,
    networkTopology: 'Réseau Ethernet/IP & Modbus-TCP en étoile commutée'
  },
  PETROCHEM_TERMINAL_SCDP: {
    id: 'PETROCHEM_TERMINAL_SCDP',
    nameFr: 'Dépôt Pétrolier Carburants & Unité Hydrocarbures ATEX',
    nameEn: 'Hydrocarbon Tank Terminal & ATEX Hazard Unit',
    cameroonReference: 'Dépôt Central SCDP Bessengue Douala / Raffinerie SONARA Limbe',
    nominalPowerKw: 8500,
    digitalInputsCount: 520,
    digitalOutputsCount: 290,
    analogInputsCount: 280,
    analogOutputsCount: 80,
    targetSilLevel: 'SIL_3',
    defaultVfdCount: 18,
    defaultVfdTotalPowerKw: 1650,
    networkTopology: 'Architecture TMR 2oo3 avec barrières à sécurité intrinsèque Ex-i'
  }
};

export interface AutomationCalculations {
  totalIoPoints: number;
  totalIoWithReserve: number;
  estimatedScanTimeMs: number;
  power24VWatts: number;
  power24VAmps: number;
  heatDissipationWatts: number;
  heatDissipationBtuHr: number;
  recommendedPowerSupplyAmps: number;
  pfdAvgCalculated: number;
  achievedSil: string;
  isSilCompliant: boolean;
  totalEstimatedCapExFcfa: number;
  totalEstimatedCapExEur: number;
}

export interface AutomationStoreState {
  activeStage: 1 | 2 | 3 | 4 | 5;
  setActiveStage: (st: 1 | 2 | 3 | 4 | 5) => void;
  selectedIndustryId: AutomationIndustryKey;
  setSelectedIndustryId: (id: AutomationIndustryKey) => void;
  activeIndustryProfile: AutomationIndustryProfile;

  // Key system configuration states
  digitalInputs: number;
  setDigitalInputs: (n: number) => void;
  digitalOutputs: number;
  setDigitalOutputs: (n: number) => void;
  analogInputs: number;
  setAnalogInputs: (n: number) => void;
  analogOutputs: number;
  setAnalogOutputs: (n: number) => void;
  vfdCount: number;
  setVfdCount: (n: number) => void;
  vfdTotalPowerKw: number;
  setVfdTotalPowerKw: (kw: number) => void;
  safetyVotingArch: '1oo1' | '1oo2' | '2oo3';
  setSafetyVotingArch: (arch: '1oo1' | '1oo2' | '2oo3') => void;

  calculations: AutomationCalculations;
}

export function useAutomationProjectStore(initialIndustry: AutomationIndustryKey = 'HYDRO_PLANT_420MW'): AutomationStoreState {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedIndustryId, setSelectedIndustryId] = useState<AutomationIndustryKey>(initialIndustry);

  const activeIndustryProfile = useMemo(() => {
    return AUTOMATION_PROFILES[selectedIndustryId] || AUTOMATION_PROFILES.HYDRO_PLANT_420MW;
  }, [selectedIndustryId]);

  // Controllable quantities initialized from profile
  const [digitalInputs, setDigitalInputs] = useState<number>(activeIndustryProfile.digitalInputsCount);
  const [digitalOutputs, setDigitalOutputs] = useState<number>(activeIndustryProfile.digitalOutputsCount);
  const [analogInputs, setAnalogInputs] = useState<number>(activeIndustryProfile.analogInputsCount);
  const [analogOutputs, setAnalogOutputs] = useState<number>(activeIndustryProfile.analogOutputsCount);
  const [vfdCount, setVfdCount] = useState<number>(activeIndustryProfile.defaultVfdCount);
  const [vfdTotalPowerKw, setVfdTotalPowerKw] = useState<number>(activeIndustryProfile.defaultVfdTotalPowerKw);
  const [safetyVotingArch, setSafetyVotingArch] = useState<'1oo1' | '1oo2' | '2oo3'>('2oo3');

  // Sync profile when industry changes
  const handleSelectIndustry = (id: AutomationIndustryKey) => {
    setSelectedIndustryId(id);
    const prof = AUTOMATION_PROFILES[id];
    if (prof) {
      setDigitalInputs(prof.digitalInputsCount);
      setDigitalOutputs(prof.digitalOutputsCount);
      setAnalogInputs(prof.analogInputsCount);
      setAnalogOutputs(prof.analogOutputsCount);
      setVfdCount(prof.defaultVfdCount);
      setVfdTotalPowerKw(prof.defaultVfdTotalPowerKw);
      setSafetyVotingArch(prof.targetSilLevel === 'SIL_3' ? '2oo3' : '1oo2');
    }
  };

  // Comprehensive Engineering Calculations
  const calculations: AutomationCalculations = useMemo(() => {
    // 1. Total I/O Points and 20% Engineering Expansion Reserve
    const totalIoPoints = digitalInputs + digitalOutputs + analogInputs + analogOutputs;
    const totalIoWithReserve = Math.ceil(totalIoPoints * 1.20);

    // 2. Scan Cycle Time Estimation: Base 2 ms + 0.005 ms per DI/DO + 0.02 ms per AI/AO
    const estimatedScanTimeMs = Number((2.0 + (digitalInputs + digitalOutputs) * 0.004 + (analogInputs + analogOutputs) * 0.015).toFixed(2));

    // 3. 24V DC Auxiliary Power Budget:
    // DI: 8 mA each = 0.192 W
    // DO: 250 mA average load per relay/coil = 6.0 W
    // AI: 20 mA loop power = 0.48 W
    // AO: 20 mA output = 0.48 W
    // CPU + Communication Racks + Safety: 120 W baseline
    const diPowerW = digitalInputs * 0.008 * 24;
    const doPowerW = digitalOutputs * 0.250 * 24;
    const aiPowerW = analogInputs * 0.020 * 24;
    const aoPowerW = analogOutputs * 0.020 * 24;
    const baseRacksPowerW = 140;

    const power24VWatts = Math.round(diPowerW + doPowerW + aiPowerW + aoPowerW + baseRacksPowerW);
    const power24VAmps = Number((power24VWatts / 24).toFixed(1));

    // Recommended Power Supply with 25% safety margin: nearest standard commercial rating (20A, 40A, 60A, 80A, 100A)
    const rawSupplyAmps = power24VAmps * 1.25;
    let recommendedPowerSupplyAmps = 20;
    if (rawSupplyAmps > 20) recommendedPowerSupplyAmps = 40;
    if (rawSupplyAmps > 40) recommendedPowerSupplyAmps = 60;
    if (rawSupplyAmps > 60) recommendedPowerSupplyAmps = 80;
    if (rawSupplyAmps > 80) recommendedPowerSupplyAmps = 100;

    // 4. Cabinet Heat Dissipation (Watts & BTU/hr):
    // 85% of power supply load turns into cabinet internal heat + 2.5% of VFD losses if mounted in-cabinet
    const heatDissipationWatts = Math.round(power24VWatts * 0.88 + 180);
    const heatDissipationBtuHr = Math.round(heatDissipationWatts * 3.412142);

    // 5. SIL Safety Calculations per IEC 61508:
    // Dangerous failure rate lambda_D = 1.2e-6 / hr, Proof Test Interval TI = 8760 hrs (1 year)
    const lambdaD = 1.2e-6;
    const proofTestHours = 8760;
    let pfdAvg = 0;
    if (safetyVotingArch === '1oo1') {
      pfdAvg = (lambdaD * proofTestHours) / 2; // ~ 5.25e-3 (SIL 2)
    } else if (safetyVotingArch === '1oo2') {
      pfdAvg = Math.pow(lambdaD * proofTestHours, 2) / 3; // ~ 3.68e-5 (SIL 3)
    } else {
      // 2oo3 Triple Modular Redundancy (TMR)
      pfdAvg = Math.pow(lambdaD * proofTestHours, 2); // ~ 1.10e-4 (High SIL 3)
    }
    const pfdAvgCalculated = Number(pfdAvg.toExponential(2));

    let achievedSil = 'SIL 1';
    if (pfdAvg < 1e-2) achievedSil = 'SIL 2';
    if (pfdAvg < 1e-3) achievedSil = 'SIL 3';
    if (pfdAvg < 1e-4) achievedSil = 'SIL 3+ (TMR)';

    const isSilCompliant = activeIndustryProfile.targetSilLevel === 'SIL_3' 
      ? (achievedSil.includes('SIL 3'))
      : true;

    // 6. CapEx Benchmark in Cameroon (FCFA / EUR):
    // PLC Hardware racks + I/O Modules + SIS Safety + VFDs + Panels + Engineering FAT/SAT
    const cpuRacksFcfa = 22_000_000;
    const ioModulesFcfa = (digitalInputs + digitalOutputs) * 22_000 + (analogInputs + analogOutputs) * 45_000;
    const sisSafetyFcfa = safetyVotingArch === '2oo3' ? 28_000_000 : 16_000_000;
    const vfdDrivesFcfa = vfdCount * 1_250_000 + vfdTotalPowerKw * 48_000;
    const enclosureAuxFcfa = 14_000_000;
    const engineeringFatSatFcfa = 25_000_000;

    const subTotalFcfa = cpuRacksFcfa + ioModulesFcfa + sisSafetyFcfa + vfdDrivesFcfa + enclosureAuxFcfa + engineeringFatSatFcfa;
    const totalEstimatedCapExFcfa = Math.round(subTotalFcfa * 1.12); // 12% contingencies & transit/customs in Douala
    const totalEstimatedCapExEur = Math.round(totalEstimatedCapExFcfa / 655.957);

    return {
      totalIoPoints,
      totalIoWithReserve,
      estimatedScanTimeMs,
      power24VWatts,
      power24VAmps,
      heatDissipationWatts,
      heatDissipationBtuHr,
      recommendedPowerSupplyAmps,
      pfdAvgCalculated,
      achievedSil,
      isSilCompliant,
      totalEstimatedCapExFcfa,
      totalEstimatedCapExEur
    };
  }, [
    digitalInputs,
    digitalOutputs,
    analogInputs,
    analogOutputs,
    vfdCount,
    vfdTotalPowerKw,
    safetyVotingArch,
    activeIndustryProfile
  ]);

  return {
    activeStage,
    setActiveStage,
    selectedIndustryId,
    setSelectedIndustryId: handleSelectIndustry,
    activeIndustryProfile,
    digitalInputs,
    setDigitalInputs,
    digitalOutputs,
    setDigitalOutputs,
    analogInputs,
    setAnalogInputs,
    analogOutputs,
    setAnalogOutputs,
    vfdCount,
    setVfdCount,
    vfdTotalPowerKw,
    setVfdTotalPowerKw,
    safetyVotingArch,
    setSafetyVotingArch,
    calculations
  };
}
