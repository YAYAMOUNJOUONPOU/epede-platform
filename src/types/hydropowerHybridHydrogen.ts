// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 17 TYPES
// STEP 17: Hybrid Hydro-Floating Solar (FPV), BESS & Green Hydrogen P2X
// ============================================================================

export type LocalizedText = {
  fr: string;
  en: string;
};

export type ElectrolyzerTechnology = 'PEM' | 'Alkaline_AEL' | 'SOEC';

export interface FloatingPvSystemParams {
  installedCapacityMwp: number;
  waterSurfaceCoverageHectares: number;
  waterCoolingEfficiencyGainPercent: number; // typically +3.5% to +6%
  evaporationReductionMillionM3PerYear: number;
  panelTiltAngleDeg: number;
  albedoFactor: number;
}

export interface BessSystemParams {
  ratedPowerMw: number;
  energyCapacityMwh: number;
  cRate: number; // Power / Energy (e.g. 0.5C)
  roundTripEfficiencyPercent: number;
  stateOfChargePercent: number;
  batteryChemistry: 'LFP' | 'NMC' | 'Sodium_Ion' | 'Vanadium_Flow';
  rampRateLimitMwPerMin: number;
}

export interface HydrogenP2xSystemParams {
  technology: ElectrolyzerTechnology;
  ratedElectrolyzerInputPowerMw: number;
  specificConsumptionKwhPerKgH2: number; // e.g. 51.5 kWh/kg
  h2ProductionRateKgPerHour: number;
  dailyH2ProductionTonnes: number;
  stackOperatingPressureBar: number;
  demineralizedWaterIntakeLPerKgH2: number; // typically 9.0 L/kg
  coProductOxygenKgPerHour: number;
  efficiencyLhvPercent: number;
}

export interface HourlyDispatchProfilePoint {
  hour: number; // 0 to 23
  gridDemandMw: number;
  hydroGenerationMw: number;
  solarFpvGenerationMw: number;
  bessPowerMw: number; // Positive = discharging to grid, Negative = charging
  electrolyzerInputMw: number;
  netGridExportMw: number;
  h2OutputKg: number;
  bessSocPercent: number;
}

export interface EconomicHybridMetrics {
  hydroLcoeUsdPerMwh: number;
  hybridLcoeUsdPerMwh: number;
  greenHydrogenLcohUsdPerKg: number;
  annualCo2AbatementTonnes: number;
  waterSavedM3PerYear: number;
  firmDispatchableCapacityMw: number;
}
