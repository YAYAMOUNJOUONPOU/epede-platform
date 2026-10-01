// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 12 TYPES
// STEP 12: Climate Resilience, Sediment Management (IEC 62364), Eco-Hydraulics & Re-powering
// ============================================================================

export type LocalizedText = {
  fr: string;
  en: string;
};

export type ClimateScenario = 'baseline' | 'rcp_45' | 'rcp_85';

export interface ClimateProjectionPoint {
  decade: string; // e.g. "2020-2030", "2030-2040", "2040-2050", "2050-2060"
  baselineInflowM3s: number;
  rcp45InflowM3s: number;
  rcp85InflowM3s: number;
  temperatureAnomalyC: number;
  annualGenerationImpactPercent: number;
  droughtRiskIndex: 'low' | 'moderate' | 'high' | 'extreme';
}

export interface SedimentFlushingParams {
  suspendedSedimentConcentrationGPerL: number; // e.g. 0.8 g/L during flood season
  quartzHardnessPercent: number; // % Quartz content (Mohs 7)
  sedimentGrainSizeD50Mm: number; // e.g. 0.08 mm
  flushingDischargeM3s: number; // bottom outlet flow e.g. 350 m3/s
  flushingDurationHours: number; // e.g. 48 hours
}

export interface SedimentFlushingResult {
  annualSedimentDepositedTons: number;
  reservoirVolumeLossPercent50Years: number;
  flushingScourVelocityMs: number;
  flushedSedimentTonsPerEvent: number;
  trapEfficiencyPercent: number;
  runnerAbrasiveWearRateMmPerYear: number;
  runnerRecoatingIntervalYears: number;
  iec62364WearCategory: 'mild' | 'moderate' | 'severe' | 'extreme';
  actionRecommendation: LocalizedText;
}

export interface EcoHydraulicsTelemetry {
  id: string;
  parameterName: LocalizedText;
  currentValue: number;
  regulatoryMinimum: number;
  unit: string;
  status: 'compliant' | 'warning' | 'alert';
  ecologicalFunction: LocalizedText;
}

export interface RepoweringUpgradeOption {
  id: string;
  title: LocalizedText;
  componentTargeted: string; // e.g. "Francis Runner", "Stator Winding", "Governor"
  capacityGainMW: number; // e.g. +9.0 MW per unit (+63 MW plant wide)
  efficiencyGainPercent: number; // e.g. +3.8%
  capexMillionUsd: number;
  paybackPeriodYears: number;
  circularRecyclabilityPercent: number; // e.g. 98.5%
  co2AvoidedAdditionalTonsYear: number;
  description: LocalizedText;
}
