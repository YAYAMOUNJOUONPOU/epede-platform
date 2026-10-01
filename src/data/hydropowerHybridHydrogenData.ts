// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 17 DATA ENGINE
// STEP 17: Hybrid Hydro-Floating Solar (FPV), BESS & Green Hydrogen P2X
// ============================================================================

import type {
  FloatingPvSystemParams,
  BessSystemParams,
  HydrogenP2xSystemParams,
  HourlyDispatchProfilePoint,
  EconomicHybridMetrics,
} from '../types/hydropowerHybridHydrogen';

// ============================================================================
// 1. FLOATING PHOTOVOLTAICS (FPV) ON HEADPOND RESERVOIR
// ============================================================================

export const DEFAULT_FPV_PARAMS: FloatingPvSystemParams = {
  installedCapacityMwp: 120, // 120 MWp floating solar
  waterSurfaceCoverageHectares: 85, // 85 hectares of reservoir surface
  waterCoolingEfficiencyGainPercent: 4.8, // Natural evaporative cooling boost
  evaporationReductionMillionM3PerYear: 1.62, // Million m3 of water preserved
  panelTiltAngleDeg: 12, // Tropical self-cleaning angle
  albedoFactor: 0.08, // Water surface reflection
};

export function calculateFpvOutput(
  capacityMwp: number,
  irradianceWPerM2: number,
  coolingGainPercent: number
): {
  currentPowerMw: number;
  cellTemperatureDegC: number;
  coolingBonusMw: number;
  waterSavedM3PerDay: number;
} {
  // Base conversion at standard test conditions (1000 W/m2 @ 25°C)
  const irradianceRatio = irradianceWPerM2 / 1000;
  
  // Ambient water cooling keeps cell temp ~34°C instead of ~46°C on land
  const cellTemp = 25 + (irradianceWPerM2 / 800) * 11.5;
  const coolingMultiplier = 1 + coolingGainPercent / 100;
  
  const rawPower = capacityMwp * irradianceRatio;
  const currentPower = Number((rawPower * coolingMultiplier * 0.88).toFixed(2));
  const coolingBonus = Number((currentPower - rawPower * 0.88).toFixed(2));
  
  // Daily water saved based on 85 ha and ~5.2 mm/day tropical evaporation
  const waterSaved = Number(((capacityMwp / 120) * 4438).toFixed(0)); // ~4400 m3/day

  return {
    currentPowerMw: Math.max(0, currentPower),
    cellTemperatureDegC: Number(cellTemp.toFixed(1)),
    coolingBonusMw: Math.max(0, coolingBonus),
    waterSavedM3PerDay: waterSaved,
  };
}

// ============================================================================
// 2. BESS (BATTERY ENERGY STORAGE SYSTEM - LFP)
// ============================================================================

export const DEFAULT_BESS_PARAMS: BessSystemParams = {
  ratedPowerMw: 40,
  energyCapacityMwh: 80,
  cRate: 0.5,
  roundTripEfficiencyPercent: 88.5,
  stateOfChargePercent: 68.0,
  batteryChemistry: 'LFP',
  rampRateLimitMwPerMin: 20.0, // Ultra-fast primary reserve response
};

// ============================================================================
// 3. HYDROGEN POWER-TO-X (P2X) ELECTROLYSIS
// ============================================================================

export const DEFAULT_H2_PARAMS: HydrogenP2xSystemParams = {
  technology: 'PEM',
  ratedElectrolyzerInputPowerMw: 30, // 30 MW electrical input
  specificConsumptionKwhPerKgH2: 51.5, // 51.5 kWh per kg H2 (stack + BoP)
  h2ProductionRateKgPerHour: 582.5, // ~582.5 kg/h at full load
  dailyH2ProductionTonnes: 13.98,
  stackOperatingPressureBar: 30, // Direct high-pressure PEM output
  demineralizedWaterIntakeLPerKgH2: 9.0, // ASTM D1193 Type I water
  coProductOxygenKgPerHour: 4660, // 8:1 mass ratio
  efficiencyLhvPercent: 64.7, // 33.33 kWh/kg LHV / 51.5
};

export function calculateH2Production(
  inputPowerMw: number,
  specificConsumptionKwhKg: number = 51.5
): {
  h2FlowKgH: number;
  dailyTonnes: number;
  oxygenFlowKgH: number;
  deminWaterM3H: number;
  stackEfficiencyLhv: number;
} {
  const powerKw = inputPowerMw * 1000;
  const flowKgH = Number((powerKw / specificConsumptionKwhKg).toFixed(1));
  const daily = Number(((flowKgH * 24) / 1000).toFixed(2));
  const o2Flow = Number((flowKgH * 8).toFixed(1));
  const waterM3H = Number(((flowKgH * 9.0) / 1000).toFixed(2));
  const effLhv = Number(((33.33 / specificConsumptionKwhKg) * 100).toFixed(1));

  return {
    h2FlowKgH: flowKgH,
    dailyTonnes: daily,
    oxygenFlowKgH: o2Flow,
    deminWaterM3H: waterM3H,
    stackEfficiencyLhv: effLhv,
  };
}

// ============================================================================
// 4. 24-HOUR MULTI-CARRIER DISPATCH PROFILE GENERATOR
// ============================================================================

export function generate24HourDispatchProfile(
  fpvCapacityMwp: number,
  bessPowerMw: number,
  h2InputMaxMw: number
): HourlyDispatchProfilePoint[] {
  const profile: HourlyDispatchProfilePoint[] = [];

  // Typical Cameroon RIS grid load pattern (MW)
  const demandCurve = [
    260, 245, 238, 235, 240, 270, 320, 360, 390, 415, 430, 440,
    445, 435, 420, 410, 425, 460, 495, 510, 490, 430, 360, 300,
  ];

  // Normalized solar curve (0 to 1)
  const solarNormalized = [
    0, 0, 0, 0, 0, 0.05, 0.22, 0.48, 0.72, 0.88, 0.98, 1.0,
    0.96, 0.85, 0.65, 0.40, 0.15, 0.02, 0, 0, 0, 0, 0, 0,
  ];

  let currentSoc = 65; // Initial SoC %

  for (let h = 0; h < 24; h++) {
    const demand = demandCurve[h];
    const solarGeneration = Number(
      (fpvCapacityMwp * solarNormalized[h] * 0.88 * 1.048).toFixed(1)
    );

    // Baseline hydro running at Nachtigal (steady baseload + regulation)
    const baseHydro = 380; // 380 MW

    // BESS dispatch strategy:
    // Charge during high solar midday (11h - 14h)
    // Discharge during evening peak (18h - 21h)
    let bessMw = 0;
    if (h >= 10 && h <= 14 && currentSoc < 90) {
      bessMw = -Math.min(bessPowerMw * 0.75, (95 - currentSoc) * 0.8); // charging
    } else if (h >= 18 && h <= 21 && currentSoc > 25) {
      bessMw = Math.min(bessPowerMw, (currentSoc - 20) * 0.9); // discharging
    }
    bessMw = Number(bessMw.toFixed(1));

    // Update SoC
    currentSoc = Math.max(15, Math.min(95, currentSoc - (bessMw / 80) * 100 * 0.9));
    currentSoc = Number(currentSoc.toFixed(1));

    // Hydrogen Electrolyzer strategy:
    // Run at full power during off-peak night (01h - 05h) and midday solar peak (11h - 13h)
    let h2Mw = 0;
    if (h >= 0 && h <= 5) {
      h2Mw = h2InputMaxMw; // absorb cheap off-peak hydro surplus
    } else if (h >= 11 && h <= 13) {
      h2Mw = h2InputMaxMw * 0.85; // absorb excess FPV
    } else if (h >= 18 && h <= 21) {
      h2Mw = 0; // ramp down to 0 to free all power for evening grid peak
    } else {
      h2Mw = h2InputMaxMw * 0.4; // minimum turndown baseline
    }
    h2Mw = Number(h2Mw.toFixed(1));

    const h2Prod = calculateH2Production(h2Mw);
    const netGrid = Number((baseHydro + solarGeneration + bessMw - h2Mw).toFixed(1));

    profile.push({
      hour: h,
      gridDemandMw: demand,
      hydroGenerationMw: baseHydro,
      solarFpvGenerationMw: solarGeneration,
      bessPowerMw: bessMw,
      electrolyzerInputMw: h2Mw,
      netGridExportMw: netGrid,
      h2OutputKg: h2Prod.h2FlowKgH,
      bessSocPercent: currentSoc,
    });
  }

  return profile;
}

// ============================================================================
// 5. HYBRID LCOE & GREEN HYDROGEN LCOH COMPARATIVE METRICS
// ============================================================================

export const DEFAULT_ECONOMIC_METRICS: EconomicHybridMetrics = {
  hydroLcoeUsdPerMwh: 42.5, // Base run-of-river LCOE
  hybridLcoeUsdPerMwh: 47.8, // Hybrid firm dispatchable 24/7 LCOE
  greenHydrogenLcohUsdPerKg: 3.82, // Levelized cost of green H2
  annualCo2AbatementTonnes: 44200, // Tonnes of CO2 avoided vs heavy fuel oil
  waterSavedM3PerYear: 1620000, // 1.62 million m3 preserved via FPV shade
  firmDispatchableCapacityMw: 420, // Guaranteed firm peak capacity
};
