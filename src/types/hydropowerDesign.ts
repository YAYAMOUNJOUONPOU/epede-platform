/**
 * EPEDE HYDROPOWER GENERATION DOMAIN — STEP 7
 * Design Engineering, Hill Chart Efficiency, Hydrology FDC & Techno-Economic LCOE Sizing
 * Domain: D01 — Generation | Technology: Hydropower
 * Standards: IEC 60193, IEC 60041, IEEE 1010, CEI 62364, ISO 20816-5, IRENA LCOE
 */

import type { HydraulicTurbineType, HydroSubsystemId } from './hydropower';

// ============================================================================
// 1. ELECTROMECHANICAL TURBINE SIZING & SPECIFIC SPEED
// ============================================================================

export interface TurbineSizingParameters {
  headM: number;              // Net head H_n (m)
  flowM3s: number;            // Design discharge Q_d (m3/s)
  generatorPoles: number;     // Number of rotor poles 2p
  gridFrequencyHz: number;    // 50 Hz (Cameroon/IEC) or 60 Hz
  altitudeM: number;          // Site elevation above sea level
  waterTempC: number;         // Water temperature in Celsius
  tailwaterElevationM: number;// Tailrace water level
}

export interface TurbineSizingResult {
  synchronousSpeedRpm: number;
  specificSpeedNq: number;     // Nq = n * sqrt(Q) / H^(3/4) [metric]
  specificSpeedNs: number;     // Ns = n * sqrt(P_kW) / H^(5/4)
  recommendedTurbine: HydraulicTurbineType;
  runnerDiameterD1M: number;   // Inlet/nominal runner diameter
  runnerDiameterD2M: number;   // Discharge runner diameter
  runawaySpeedRpm: number;     // Maximum overspeed
  thomaSigmaPlant: number;     // Plant cavitation coefficient
  thomaSigmaCritical: number;  // Critical cavitation limit
  settingElevationHsM: number; // Maximum allowable setting height above tailwater
  cavitationMarginM: number;   // Safety margin against cavitation
  numberOfBlades: number;      // Optimal runner blades
  numberOfGuideVanes: number;  // Distributor guide vanes (acoustically staggered)
  ratedMechanicalPowerMW: number;
  ratedElectricalPowerMW: number;
  axialThrustKN: number;       // Steady-state hydraulic thrust
}

// ============================================================================
// 2. HILL CHART (COURBE DE COLLINE) & EFFICIENCY SURFACE
// ============================================================================

export interface HillChartPoint {
  n11: number;      // Unit speed n * D / sqrt(H) [rpm]
  q11: number;      // Unit discharge Q / (D^2 * sqrt(H)) [m3/s/m2/m^0.5]
  efficiency: number; // Efficiency percentage 0..100
  guideVaneOpeningDeg?: number; // a0 opening
  cavitationSigma?: number;     // Sigma at this point
}

export interface HillChartPreset {
  id: string;
  name: { fr: string; en: string };
  turbineType: HydraulicTurbineType;
  referenceHeadM: number;
  referenceDiameterM: number;
  optimumN11: number;
  optimumQ11: number;
  peakEfficiency: number;
  stableOperatingEnvelope: {
    minN11: number;
    maxN11: number;
    minQ11: number;
    maxQ11: number;
  };
  gridPoints: HillChartPoint[];
}

// ============================================================================
// 3. HYDROLOGY & FLOW DURATION CURVE (FDC)
// ============================================================================

export interface FlowDurationPoint {
  exceedancePercent: number; // 0 to 100%
  flowM3s: number;
}

export interface HydrologicalProfile {
  id: string;
  riverName: string;
  location: string;
  country: string;
  meanAnnualDischargeM3s: number;
  catchmentAreaKm2: number;
  drySeasonLowFlowM3s: number;
  floodFlow100yrM3s: number;
  ecologicalReserveM3s: number;
  fdcData: FlowDurationPoint[];
  typicalHeadM: number;
  installedCapacityMW: number;
  description: { fr: string; en: string };
}

export interface HydrologicalYieldResult {
  effectiveTurbinedFlowM3s: number;
  spilledFlowM3s: number;
  deficitFlowM3s: number;
  annualEnergyGenerationGWh: number;
  capacityFactorPercent: number;
  equivalentFullLoadHours: number;
  annualCO2AvoidedTonnes: number;
  monthlyGenerationGWh: number[];
}

// ============================================================================
// 4. TECHNO-ECONOMIC LCOE & CAPEX / OPEX DECOMPOSITION
// ============================================================================

export interface CapexBreakdown {
  civilWorksUSD: number;           // Dam, spillway, intake, tailrace
  waterwaysUSD: number;            // Headrace tunnel, surge tank, penstock
  electromechanicalUSD: number;    // Turbines, generators, governors, GSU, auxiliaries
  substationInterconnectionUSD: number; // Switchyard, HV transmission bay
  environmentalSocialUSD: number;  // ESMP, resettlement, biodiversity offsets
  contingenciesAndEngineeringUSD: number; // EPC, owner engineer, contingency
  totalCapexUSD: number;
}

export interface OpexBreakdown {
  fixedOMUSDPerYear: number;       // Staff, preventive maintenance, routine consumables
  variableOMUSDPerYear: number;    // Wear and tear, lubricants, water royalties
  insuranceUSDPerYear: number;     // Property & business interruption
  refurbishmentProvisionUSDPerYear: number; // Mid-life overhaul reserve fund (25-yr)
  totalAnnualOpexUSD: number;
}

export interface LcoeAnalysisResult {
  lcoeUSDPerMWh: number;
  lcoeCFAFPerKWh: number;
  capexUSDPerKW: number;
  netPresentValueUSD: number;
  internalRateOfReturnPercent: number;
  simplePaybackYears: number;
  discountedPaybackYears: number;
  levelizedCarbonIntensityGCO2PerKWh: number;
  assumptions: {
    discountRatePercent: number;
    plantLifetimeYears: number;
    electricityTariffUSDPerMWh: number;
    annualDegradationPercent: number;
  };
}

// ============================================================================
// 5. PREDICTIVE HEALTH MONITORING & DIAGNOSTICS (PHM / DIGITAL TWIN)
// ============================================================================

export interface SubsystemHealthTelemetry {
  subsystemId: HydroSubsystemId;
  name: { fr: string; en: string };
  healthIndex: number; // 0 to 100%
  status: 'nominal' | 'advisory' | 'warning' | 'critical';
  primarySensor: string;
  measuredValue: string;
  nominalRange: string;
  degradationMechanism: { fr: string; en: string };
  isoStandardRef: string;
  recommendedAction: { fr: string; en: string };
  remainingUsefulLifeDays: number;
}
