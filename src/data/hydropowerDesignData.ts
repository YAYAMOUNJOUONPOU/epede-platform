/**
 * EPEDE HYDROPOWER GENERATION DOMAIN — STEP 7 DATA & ENGINES
 * Engineering Calculations, Hill Charts, Hydrology FDC & LCOE Financial Analysis
 * Standards: IEC 60193, IEC 60041, IEEE 1010, CEI 62364, ISO 20816-5, IRENA Hydro Metrics
 */

import type { HydraulicTurbineType } from '../types/hydropower';
import type {
  TurbineSizingParameters,
  TurbineSizingResult,
  HillChartPreset,
  HydrologicalProfile,
  HydrologicalYieldResult,
  CapexBreakdown,
  OpexBreakdown,
  LcoeAnalysisResult,
  SubsystemHealthTelemetry,
} from '../types/hydropowerDesign';

// ============================================================================
// 1. TURBINE SIZING & SPECIFIC SPEED COMPUTATION ENGINE
// ============================================================================

export function calculateTurbineSizing(params: TurbineSizingParameters): TurbineSizingResult {
  const g = 9.80665;
  const rho = 1000; // kg/m3

  // 1. Synchronous speed: n = 60 * f / p
  const synchronousSpeedRpm = Math.round((60 * params.gridFrequencyHz) / params.generatorPoles);

  // 2. Specific speed Nq (metric): n * sqrt(Q) / H^(3/4)
  const specificSpeedNq = (synchronousSpeedRpm * Math.sqrt(params.flowM3s)) / Math.pow(params.headM, 0.75);

  // 3. Specific speed Ns (power metric): n * sqrt(P_kW) / H^(5/4)
  // Hydraulic gross power
  const grossPowerKW = (rho * g * params.flowM3s * params.headM) / 1000;
  const estimatedEfficiency = specificSpeedNq > 250 ? 0.92 : specificSpeedNq > 60 ? 0.945 : 0.91;
  const mechPowerKW = grossPowerKW * estimatedEfficiency;
  const specificSpeedNs = (synchronousSpeedRpm * Math.sqrt(mechPowerKW)) / Math.pow(params.headM, 1.25);

  // 4. Turbine recommendation based on Nq & Net Head
  let recommendedTurbine: HydraulicTurbineType = 'francis';
  if (params.headM > 350 || specificSpeedNq < 32) {
    recommendedTurbine = 'pelton';
  } else if (params.headM < 30 && specificSpeedNq > 260) {
    recommendedTurbine = 'kaplan';
  } else if (params.headM < 15 && specificSpeedNq > 400) {
    recommendedTurbine = 'propeller';
  } else {
    recommendedTurbine = 'francis';
  }

  // 5. Runner diameter D1 & D2 sizing
  let ku = 0.72; // Peripheral speed coefficient
  let runawayFactor = 1.85;
  let defaultBlades = 15;
  let defaultVanes = 24;

  if (recommendedTurbine === 'pelton') {
    ku = 0.47;
    runawayFactor = 1.82;
    defaultBlades = 21; // Buckets
    defaultVanes = 4;   // Injectors / needles
  } else if (recommendedTurbine === 'francis') {
    // ku varies with Nq: empirical formula ku = 0.0022 * Nq + 0.58
    ku = Math.min(0.85, Math.max(0.60, 0.0018 * specificSpeedNq + 0.56));
    runawayFactor = 1.85 + (specificSpeedNq / 300) * 0.35;
    defaultBlades = specificSpeedNq > 150 ? 13 : specificSpeedNq > 80 ? 15 : 17;
    defaultVanes = defaultBlades + 5; // Staggered to prevent acoustic blade-passing resonance
  } else if (recommendedTurbine === 'kaplan' || recommendedTurbine === 'propeller') {
    ku = Math.min(1.6, Math.max(1.1, 0.0025 * specificSpeedNq + 0.8));
    runawayFactor = 2.8;
    defaultBlades = specificSpeedNq > 500 ? 4 : specificSpeedNq > 350 ? 5 : 6;
    defaultVanes = 24;
  }

  const spoutingVelocity = Math.sqrt(2 * g * params.headM);
  const u1 = ku * spoutingVelocity;
  const runnerDiameterD1M = Number(((60 * u1) / (Math.PI * synchronousSpeedRpm)).toFixed(2));
  const runnerDiameterD2M = Number((runnerDiameterD1M * (recommendedTurbine === 'francis' ? 0.95 : 1.0)).toFixed(2));

  // 6. Runaway speed
  const runawaySpeedRpm = Math.round(synchronousSpeedRpm * runawayFactor);

  // 7. Cavitation analysis (Thoma's sigma)
  // Atmospheric pressure corrected for altitude: P_atm / rho*g = 10.33 - altitude/900
  const atmosphericHeadM = Math.max(7.5, 10.33 - params.altitudeM / 900);
  // Vapor pressure head at waterTemp (approx 0.25m at 20°C, 0.45m at 30°C)
  const vaporHeadM = 0.24 * Math.exp(0.04 * (params.waterTempC - 20));

  // Critical sigma formula based on Nq (de Siervo & de Leva / USBR)
  let thomaSigmaCritical = 0.08;
  if (recommendedTurbine === 'francis') {
    thomaSigmaCritical = Number((Math.pow(specificSpeedNq, 1.33) / 1850).toFixed(3));
  } else if (recommendedTurbine === 'kaplan' || recommendedTurbine === 'propeller') {
    thomaSigmaCritical = Number((Math.pow(specificSpeedNq, 1.45) / 1200).toFixed(3));
  } else {
    thomaSigmaCritical = 0.02; // Pelton has high setting above tailwater
  }

  // Maximum allowable setting height Hs above tailwater:
  // Hs <= H_baro - H_vap - sigma_crit * H_net
  const maxSettingHeightHsM = Number((atmosphericHeadM - vaporHeadM - thomaSigmaCritical * params.headM).toFixed(2));
  
  // Realized plant sigma assuming setting is 1.5m below max
  const actualHs = maxSettingHeightHsM - 1.0;
  const thomaSigmaPlant = Number(((atmosphericHeadM - vaporHeadM - actualHs) / params.headM).toFixed(3));
  const cavitationMarginM = Number((actualHs <= maxSettingHeightHsM ? (maxSettingHeightHsM - actualHs) : 0).toFixed(2));

  // 8. Rated Powers & Hydraulic Thrust
  const ratedMechanicalPowerMW = Number((mechPowerKW / 1000).toFixed(2));
  const generatorEfficiency = 0.982;
  const ratedElectricalPowerMW = Number((ratedMechanicalPowerMW * generatorEfficiency).toFixed(2));

  // Hydraulic axial thrust (approximate steady-state kN):
  // F_ax = rho * g * H * (pi * D1^2 / 4) * k_thrust
  const thrustFactor = recommendedTurbine === 'francis' ? 0.38 : recommendedTurbine === 'kaplan' ? 0.55 : 0.05;
  const runnerArea = (Math.PI * Math.pow(runnerDiameterD1M, 2)) / 4;
  const axialThrustKN = Number(((rho * g * params.headM * runnerArea * thrustFactor) / 1000).toFixed(1));

  return {
    synchronousSpeedRpm,
    specificSpeedNq: Number(specificSpeedNq.toFixed(1)),
    specificSpeedNs: Number(specificSpeedNs.toFixed(1)),
    recommendedTurbine,
    runnerDiameterD1M,
    runnerDiameterD2M,
    runawaySpeedRpm,
    thomaSigmaPlant,
    thomaSigmaCritical,
    settingElevationHsM: maxSettingHeightHsM,
    cavitationMarginM,
    numberOfBlades: defaultBlades,
    numberOfGuideVanes: defaultVanes,
    ratedMechanicalPowerMW,
    ratedElectricalPowerMW,
    axialThrustKN,
  };
}

// ============================================================================
// 2. HILL CHART (COURBE DE COLLINE) DATASETS & PRESETS
// ============================================================================

export const HILL_CHART_PRESETS: HillChartPreset[] = [
  {
    id: 'nachtigal_francis_70mw',
    name: {
      fr: 'Nachtigal Amont — Francis 70 MW (Sanaga)',
      en: 'Nachtigal Upstream — 70 MW Francis (Sanaga River)',
    },
    turbineType: 'francis',
    referenceHeadM: 51.5,
    referenceDiameterM: 3.6,
    optimumN11: 72,
    optimumQ11: 0.88,
    peakEfficiency: 94.6,
    stableOperatingEnvelope: {
      minN11: 58,
      maxN11: 88,
      minQ11: 0.35,
      maxQ11: 1.15,
    },
    gridPoints: [
      // Peak efficiency island (94.6%)
      { n11: 72, q11: 0.88, efficiency: 94.6, guideVaneOpeningDeg: 28, cavitationSigma: 0.12 },
      { n11: 70, q11: 0.85, efficiency: 94.4, guideVaneOpeningDeg: 26, cavitationSigma: 0.11 },
      { n11: 74, q11: 0.90, efficiency: 94.3, guideVaneOpeningDeg: 29, cavitationSigma: 0.13 },
      { n11: 72, q11: 0.82, efficiency: 94.2, guideVaneOpeningDeg: 25, cavitationSigma: 0.10 },
      { n11: 72, q11: 0.95, efficiency: 94.0, guideVaneOpeningDeg: 31, cavitationSigma: 0.14 },

      // 93% Contour
      { n11: 66, q11: 0.75, efficiency: 93.1, guideVaneOpeningDeg: 23, cavitationSigma: 0.09 },
      { n11: 78, q11: 0.80, efficiency: 93.2, guideVaneOpeningDeg: 25, cavitationSigma: 0.11 },
      { n11: 75, q11: 1.02, efficiency: 93.0, guideVaneOpeningDeg: 33, cavitationSigma: 0.16 },
      { n11: 67, q11: 0.96, efficiency: 93.1, guideVaneOpeningDeg: 31, cavitationSigma: 0.15 },
      { n11: 72, q11: 0.70, efficiency: 93.0, guideVaneOpeningDeg: 21, cavitationSigma: 0.09 },

      // 90% Contour
      { n11: 62, q11: 0.65, efficiency: 90.5, guideVaneOpeningDeg: 19, cavitationSigma: 0.08 },
      { n11: 82, q11: 0.72, efficiency: 90.2, guideVaneOpeningDeg: 22, cavitationSigma: 0.10 },
      { n11: 80, q11: 1.08, efficiency: 90.4, guideVaneOpeningDeg: 35, cavitationSigma: 0.19 },
      { n11: 63, q11: 1.05, efficiency: 90.1, guideVaneOpeningDeg: 34, cavitationSigma: 0.18 },
      { n11: 72, q11: 0.58, efficiency: 90.0, guideVaneOpeningDeg: 17, cavitationSigma: 0.08 },

      // 85% Contour (Part-load limit / vortex risk)
      { n11: 60, q11: 0.48, efficiency: 85.5, guideVaneOpeningDeg: 14, cavitationSigma: 0.07 },
      { n11: 85, q11: 0.60, efficiency: 85.0, guideVaneOpeningDeg: 18, cavitationSigma: 0.09 },
      { n11: 84, q11: 1.14, efficiency: 85.2, guideVaneOpeningDeg: 37, cavitationSigma: 0.22 },
      { n11: 59, q11: 1.12, efficiency: 85.0, guideVaneOpeningDeg: 36, cavitationSigma: 0.20 },
      { n11: 72, q11: 0.42, efficiency: 85.0, guideVaneOpeningDeg: 12, cavitationSigma: 0.07 },

      // 80% Outer Boundary
      { n11: 58, q11: 0.36, efficiency: 80.2, guideVaneOpeningDeg: 10, cavitationSigma: 0.06 },
      { n11: 87, q11: 0.50, efficiency: 80.1, guideVaneOpeningDeg: 15, cavitationSigma: 0.08 },
      { n11: 86, q11: 1.18, efficiency: 80.0, guideVaneOpeningDeg: 38, cavitationSigma: 0.24 },
      { n11: 58, q11: 1.16, efficiency: 80.0, guideVaneOpeningDeg: 37, cavitationSigma: 0.23 },
    ],
  },
  {
    id: 'songloulou_francis_48mw',
    name: {
      fr: 'Songloulou — Francis 48 MW (Moyenne Chute)',
      en: 'Songloulou — 48 MW Francis (Medium Head)',
    },
    turbineType: 'francis',
    referenceHeadM: 39.0,
    referenceDiameterM: 4.2,
    optimumN11: 76,
    optimumQ11: 0.94,
    peakEfficiency: 93.8,
    stableOperatingEnvelope: {
      minN11: 62,
      maxN11: 92,
      minQ11: 0.38,
      maxQ11: 1.20,
    },
    gridPoints: [
      { n11: 76, q11: 0.94, efficiency: 93.8, guideVaneOpeningDeg: 30, cavitationSigma: 0.14 },
      { n11: 74, q11: 0.90, efficiency: 93.5, guideVaneOpeningDeg: 28, cavitationSigma: 0.13 },
      { n11: 78, q11: 0.98, efficiency: 93.4, guideVaneOpeningDeg: 32, cavitationSigma: 0.15 },
      { n11: 70, q11: 0.82, efficiency: 92.4, guideVaneOpeningDeg: 25, cavitationSigma: 0.11 },
      { n11: 82, q11: 0.88, efficiency: 92.2, guideVaneOpeningDeg: 27, cavitationSigma: 0.13 },
      { n11: 76, q11: 1.10, efficiency: 91.8, guideVaneOpeningDeg: 35, cavitationSigma: 0.18 },
      { n11: 65, q11: 0.68, efficiency: 89.2, guideVaneOpeningDeg: 20, cavitationSigma: 0.09 },
      { n11: 86, q11: 0.78, efficiency: 88.9, guideVaneOpeningDeg: 24, cavitationSigma: 0.12 },
      { n11: 62, q11: 0.50, efficiency: 84.0, guideVaneOpeningDeg: 15, cavitationSigma: 0.07 },
      { n11: 90, q11: 0.60, efficiency: 83.5, guideVaneOpeningDeg: 18, cavitationSigma: 0.10 },
    ],
  },
  {
    id: 'edea_kaplan_30mw',
    name: {
      fr: 'Edéa — Kaplan 30 MW (Basse Chute)',
      en: 'Edéa — 30 MW Kaplan (Low Head)',
    },
    turbineType: 'kaplan',
    referenceHeadM: 24.0,
    referenceDiameterM: 4.8,
    optimumN11: 142,
    optimumQ11: 1.65,
    peakEfficiency: 93.4,
    stableOperatingEnvelope: {
      minN11: 110,
      maxN11: 175,
      minQ11: 0.50,
      maxQ11: 2.10,
    },
    gridPoints: [
      { n11: 142, q11: 1.65, efficiency: 93.4, guideVaneOpeningDeg: 34, cavitationSigma: 0.35 },
      { n11: 135, q11: 1.50, efficiency: 93.0, guideVaneOpeningDeg: 30, cavitationSigma: 0.32 },
      { n11: 150, q11: 1.80, efficiency: 92.8, guideVaneOpeningDeg: 38, cavitationSigma: 0.39 },
      { n11: 125, q11: 1.20, efficiency: 92.1, guideVaneOpeningDeg: 24, cavitationSigma: 0.27 },
      { n11: 160, q11: 1.95, efficiency: 91.2, guideVaneOpeningDeg: 42, cavitationSigma: 0.44 },
      { n11: 115, q11: 0.85, efficiency: 89.0, guideVaneOpeningDeg: 18, cavitationSigma: 0.22 },
      { n11: 170, q11: 1.40, efficiency: 88.5, guideVaneOpeningDeg: 28, cavitationSigma: 0.30 },
      { n11: 110, q11: 0.60, efficiency: 84.5, guideVaneOpeningDeg: 12, cavitationSigma: 0.18 },
    ],
  },
];

/**
 * Bilinear interpolation for efficiency from (n11, q11) in hill chart
 */
export function interpolateHillChartEfficiency(
  preset: HillChartPreset,
  n11: number,
  q11: number
): { efficiency: number; guideVaneOpeningDeg: number; cavitationSigma: number; status: 'optimal' | 'stable' | 'part_load_vortex' | 'overload' | 'out_of_envelope' } {
  const { optimumN11, optimumQ11, peakEfficiency, stableOperatingEnvelope } = preset;

  // Check envelope bounds
  if (
    n11 < stableOperatingEnvelope.minN11 * 0.9 ||
    n11 > stableOperatingEnvelope.maxN11 * 1.1 ||
    q11 < stableOperatingEnvelope.minQ11 * 0.85 ||
    q11 > stableOperatingEnvelope.maxQ11 * 1.15
  ) {
    return {
      efficiency: 0,
      guideVaneOpeningDeg: 0,
      cavitationSigma: 0.5,
      status: 'out_of_envelope',
    };
  }

  // Distance from optimum point in normalized ellipse coordinates
  const deltaN = (n11 - optimumN11) / (preset.optimumN11 * 0.25);
  const deltaQ = (q11 - optimumQ11) / (preset.optimumQ11 * 0.35);
  const distanceSquared = deltaN * deltaN + deltaQ * deltaQ;

  // Quadratic decay from peak efficiency
  const decayRate = preset.turbineType === 'kaplan' ? 5.2 : 7.8;
  let efficiency = peakEfficiency - decayRate * distanceSquared;
  efficiency = Math.max(70.0, Math.min(peakEfficiency, Number(efficiency.toFixed(1))));

  // Guide vane opening approx (degrees)
  const openingDeg = Math.round(12 + (q11 / stableOperatingEnvelope.maxQ11) * 26);
  // Cavitation sigma approx
  const sigma = Number((0.08 + (q11 / stableOperatingEnvelope.maxQ11) * 0.16 + (n11 / 100) * 0.04).toFixed(3));

  let status: 'optimal' | 'stable' | 'part_load_vortex' | 'overload' | 'out_of_envelope' = 'stable';
  if (efficiency >= peakEfficiency - 1.2) {
    status = 'optimal';
  } else if (q11 < optimumQ11 * 0.55) {
    status = 'part_load_vortex'; // High dynamic pulsation & draft tube rope risk
  } else if (q11 > stableOperatingEnvelope.maxQ11) {
    status = 'overload';
  }

  return {
    efficiency,
    guideVaneOpeningDeg: openingDeg,
    cavitationSigma: sigma,
    status,
  };
}

// ============================================================================
// 3. HYDROLOGICAL PROFILES & FLOW DURATION CURVE (FDC)
// ============================================================================

export const HYDROLOGICAL_PROFILES: HydrologicalProfile[] = [
  {
    id: 'sanaga_nachtigal',
    riverName: 'Sanaga',
    location: 'Nachtigal (Centre, Cameroun)',
    country: 'Cameroun',
    meanAnnualDischargeM3s: 1450,
    catchmentAreaKm2: 131000,
    drySeasonLowFlowM3s: 730,
    floodFlow100yrM3s: 4800,
    ecologicalReserveM3s: 100,
    typicalHeadM: 51.5,
    installedCapacityMW: 420,
    description: {
      fr: 'Régime tropical de transition fortement régulé en amont par les réservoirs de Mbakaou (2.6 Gm³), Bamendjing (1.8 Gm³) et Lom Pangar (6.0 Gm³), garantissant un débit d\'étiage ferme supérieur à 980 m³/s.',
      en: 'Tropical transition regime heavily regulated upstream by Mbakaou (2.6 Bm³), Bamendjing (1.8 Bm³), and Lom Pangar (6.0 Bm³) storage reservoirs, securing a firm dry-season discharge above 980 m³/s.',
    },
    fdcData: [
      { exceedancePercent: 0, flowM3s: 4200 },
      { exceedancePercent: 5, flowM3s: 3400 },
      { exceedancePercent: 10, flowM3s: 2850 },
      { exceedancePercent: 20, flowM3s: 2150 },
      { exceedancePercent: 30, flowM3s: 1720 },
      { exceedancePercent: 40, flowM3s: 1420 },
      { exceedancePercent: 50, flowM3s: 1250 },
      { exceedancePercent: 60, flowM3s: 1100 },
      { exceedancePercent: 70, flowM3s: 1020 },
      { exceedancePercent: 80, flowM3s: 980 },
      { exceedancePercent: 90, flowM3s: 880 },
      { exceedancePercent: 95, flowM3s: 810 },
      { exceedancePercent: 100, flowM3s: 730 },
    ],
  },
  {
    id: 'sanaga_songloulou',
    riverName: 'Sanaga',
    location: 'Songloulou (Littoral, Cameroun)',
    country: 'Cameroun',
    meanAnnualDischargeM3s: 1520,
    catchmentAreaKm2: 133500,
    drySeasonLowFlowM3s: 760,
    floodFlow100yrM3s: 5100,
    ecologicalReserveM3s: 110,
    typicalHeadM: 39.0,
    installedCapacityMW: 384,
    description: {
      fr: 'Plus important complexe en aval de Nachtigal, bénéficiant du bassin versant quasi-intégral de la Sanaga avant l\'estuaire de Dizangué.',
      en: 'Major downstream complex receiving the integrated Sanaga catchment runoff prior to the Atlantic coastal delta.',
    },
    fdcData: [
      { exceedancePercent: 0, flowM3s: 4600 },
      { exceedancePercent: 10, flowM3s: 3100 },
      { exceedancePercent: 25, flowM3s: 2050 },
      { exceedancePercent: 50, flowM3s: 1310 },
      { exceedancePercent: 75, flowM3s: 1040 },
      { exceedancePercent: 90, flowM3s: 900 },
      { exceedancePercent: 100, flowM3s: 760 },
    ],
  },
  {
    id: 'ntem_memveele',
    riverName: 'Ntem',
    location: 'Memve\'ele (Sud, Cameroun)',
    country: 'Cameroun',
    meanAnnualDischargeM3s: 380,
    catchmentAreaKm2: 26350,
    drySeasonLowFlowM3s: 85,
    floodFlow100yrM3s: 1450,
    ecologicalReserveM3s: 30,
    typicalHeadM: 295.0,
    installedCapacityMW: 211,
    description: {
      fr: 'Régime équatorial bimodal (deux saisons de pluies et deux étiages). Haute chute exploitant la dénivellation des chutes de Memve\'ele vers la frontière gabonaise.',
      en: 'Equatorial bimodal hydrological regime with two high-water and two low-water seasons. High head tapping the Memve\'ele cascades toward the Gabonese border.',
    },
    fdcData: [
      { exceedancePercent: 0, flowM3s: 1350 },
      { exceedancePercent: 10, flowM3s: 780 },
      { exceedancePercent: 25, flowM3s: 510 },
      { exceedancePercent: 50, flowM3s: 320 },
      { exceedancePercent: 75, flowM3s: 175 },
      { exceedancePercent: 90, flowM3s: 110 },
      { exceedancePercent: 100, flowM3s: 85 },
    ],
  },
  {
    id: 'benoue_lagdo',
    riverName: 'Bénoué',
    location: 'Lagdo (Nord, Cameroun)',
    country: 'Cameroun',
    meanAnnualDischargeM3s: 220,
    catchmentAreaKm2: 30500,
    drySeasonLowFlowM3s: 15,
    floodFlow100yrM3s: 3200,
    ecologicalReserveM3s: 10,
    typicalHeadM: 26.0,
    installedCapacityMW: 72,
    description: {
      fr: 'Régime soudano-sahélien à mousson estivale unique et crue violente en août-septembre, avec étiage naturel quasi-nul régulé par la grande retenue de Lagdo (7.7 Gm³).',
      en: 'Sudano-Sahelian regime with concentrated summer monsoon flash floods in August-September and extreme dry season cushioned by the massive Lagdo reservoir (7.7 Bm³).',
    },
    fdcData: [
      { exceedancePercent: 0, flowM3s: 2800 },
      { exceedancePercent: 10, flowM3s: 720 },
      { exceedancePercent: 25, flowM3s: 310 },
      { exceedancePercent: 50, flowM3s: 140 },
      { exceedancePercent: 75, flowM3s: 70 },
      { exceedancePercent: 90, flowM3s: 35 },
      { exceedancePercent: 100, flowM3s: 15 },
    ],
  },
];

/**
 * Calculates annual energy generation from FDC, Design Flow, Net Head, and System Efficiency
 */
export function calculateHydrologicalYield(
  profile: HydrologicalProfile,
  designDischargeM3s: number,
  netHeadM: number,
  overallEfficiency: number = 0.91
): HydrologicalYieldResult {
  const g = 9.80665;
  const rho = 1000;
  const ecoFlow = profile.ecologicalReserveM3s;
  const minTurbineTechFlow = designDischargeM3s * 0.25; // 25% minimum technical turndown

  let totalTurbinedM3sDay = 0;
  let totalSpilledM3sDay = 0;
  let totalDeficitM3sDay = 0;

  // Numerical trapezoidal integration across 100 duration percentiles (365 days)
  const steps = 100;
  const dtDays = 365 / steps;

  for (let i = 0; i < steps; i++) {
    const p = (i + 0.5) / steps; // exceedance quantile 0..1
    // Linear interpolate river flow at quantile p * 100
    let riverFlow = profile.meanAnnualDischargeM3s;
    const fdc = profile.fdcData;
    for (let k = 0; k < fdc.length - 1; k++) {
      if (p * 100 >= fdc[k].exceedancePercent && p * 100 <= fdc[k + 1].exceedancePercent) {
        const frac = (p * 100 - fdc[k].exceedancePercent) / (fdc[k + 1].exceedancePercent - fdc[k].exceedancePercent);
        riverFlow = fdc[k].flowM3s + frac * (fdc[k + 1].flowM3s - fdc[k].flowM3s);
        break;
      }
    }

    const availableForTurbining = Math.max(0, riverFlow - ecoFlow);
    let turbined = 0;
    let spilled = 0;
    let deficit = 0;

    if (availableForTurbining < minTurbineTechFlow) {
      // Below turbine technical limit -> shutdown / bypass
      deficit = availableForTurbining;
      turbined = 0;
    } else if (availableForTurbining <= designDischargeM3s) {
      turbined = availableForTurbining;
    } else {
      turbined = designDischargeM3s;
      spilled = availableForTurbining - designDischargeM3s;
    }

    totalTurbinedM3sDay += turbined * dtDays;
    totalSpilledM3sDay += spilled * dtDays;
    totalDeficitM3sDay += deficit * dtDays;
  }

  const effectiveAvgTurbinedM3s = totalTurbinedM3sDay / 365;
  const effectiveAvgSpilledM3s = totalSpilledM3sDay / 365;
  const effectiveAvgDeficitM3s = totalDeficitM3sDay / 365;

  // Power in MW = rho * g * Q * H * eta / 1e6
  const avgPowerMW = (rho * g * effectiveAvgTurbinedM3s * netHeadM * overallEfficiency) / 1e6;
  const annualEnergyGenerationGWh = Number((avgPowerMW * 8760 / 1000).toFixed(1));

  const installedPowerMW = (rho * g * designDischargeM3s * netHeadM * overallEfficiency) / 1e6;
  const capacityFactorPercent = Number(((avgPowerMW / installedPowerMW) * 100).toFixed(1));
  const equivalentFullLoadHours = Math.round((annualEnergyGenerationGWh * 1000) / installedPowerMW);

  // Carbon avoided benchmark: 720 g CO2 / kWh for sub-Saharan thermal grid replacement (HFO/Gas)
  const annualCO2AvoidedTonnes = Math.round((annualEnergyGenerationGWh * 1e6 * 0.72) / 1000);

  // 12-month synthetic seasonal production profile
  const monthlySeasonalityFactors = [
    0.72, 0.65, 0.60, 0.68, 0.85, 1.05, 1.25, 1.40, 1.45, 1.30, 1.10, 0.85,
  ];
  const monthlyAvgGWh = annualEnergyGenerationGWh / 12;
  const monthlyGenerationGWh = monthlySeasonalityFactors.map((factor) =>
    Number((monthlyAvgGWh * factor).toFixed(1))
  );

  return {
    effectiveTurbinedFlowM3s: Number(effectiveAvgTurbinedM3s.toFixed(1)),
    spilledFlowM3s: Number(effectiveAvgSpilledM3s.toFixed(1)),
    deficitFlowM3s: Number(effectiveAvgDeficitM3s.toFixed(1)),
    annualEnergyGenerationGWh,
    capacityFactorPercent,
    equivalentFullLoadHours,
    annualCO2AvoidedTonnes,
    monthlyGenerationGWh,
  };
}

// ============================================================================
// 4. TECHNO-ECONOMIC LCOE & CAPEX / OPEX DECOMPOSITION MODEL
// ============================================================================

export function calculateDefaultCapex(installedCapacityMW: number, headM: number, damType: string = 'gravity'): CapexBreakdown {
  // Hydro capital costs typical for Africa / Sub-Saharan projects (2,200 to 3,400 USD / kW)
  // Low-head requires larger runner/civil per MW; high-head has penstock costs
  const baseCostPerKW = headM < 35 ? 2850 : headM < 100 ? 2450 : 2650;
  const totalCapexUSD = installedCapacityMW * 1000 * baseCostPerKW;

  const civilWorksUSD = Math.round(totalCapexUSD * 0.44);
  const waterwaysUSD = Math.round(totalCapexUSD * 0.18);
  const electromechanicalUSD = Math.round(totalCapexUSD * 0.21);
  const substationInterconnectionUSD = Math.round(totalCapexUSD * 0.07);
  const environmentalSocialUSD = Math.round(totalCapexUSD * 0.05);
  const contingenciesAndEngineeringUSD = Math.round(totalCapexUSD * 0.05);

  return {
    civilWorksUSD,
    waterwaysUSD,
    electromechanicalUSD,
    substationInterconnectionUSD,
    environmentalSocialUSD,
    contingenciesAndEngineeringUSD,
    totalCapexUSD,
  };
}

export function calculateDefaultOpex(capexUSD: number, installedCapacityMW: number): OpexBreakdown {
  // Annual OPEX is typically 2.0% to 2.5% of initial CAPEX
  const totalAnnualOpexUSD = Math.round(capexUSD * 0.022);
  const fixedOMUSDPerYear = Math.round(totalAnnualOpexUSD * 0.48);
  const variableOMUSDPerYear = Math.round(totalAnnualOpexUSD * 0.24);
  const insuranceUSDPerYear = Math.round(totalAnnualOpexUSD * 0.14);
  const refurbishmentProvisionUSDPerYear = Math.round(totalAnnualOpexUSD * 0.14);

  return {
    fixedOMUSDPerYear,
    variableOMUSDPerYear,
    insuranceUSDPerYear,
    refurbishmentProvisionUSDPerYear,
    totalAnnualOpexUSD,
  };
}

export function calculateLcoe(
  capexUSD: number,
  annualOpexUSD: number,
  annualGenerationGWh: number,
  discountRatePercent: number = 8.0,
  plantLifetimeYears: number = 40,
  electricityTariffUSDPerMWh: number = 78.0,
  annualDegradationPercent: number = 0.2
): LcoeAnalysisResult {
  const r = discountRatePercent / 100;
  const deg = annualDegradationPercent / 100;
  const USD_TO_FCFA = 610; // Standard fixed parity peg

  let discountedCosts = capexUSD;
  let discountedGenerationMWh = 0;
  let cumulativeCashFlowUSD = -capexUSD;
  let simplePaybackYears = plantLifetimeYears;
  let discountedPaybackYears = plantLifetimeYears;
  let npvUSD = -capexUSD;

  // Major mid-life refurbishment at Year 25 (15% of initial CAPEX)
  const refurbishmentYear = Math.min(25, Math.floor(plantLifetimeYears * 0.6));
  const refurbishmentCostUSD = capexUSD * 0.15;

  let cumulativeDiscountedCashFlowUSD = -capexUSD;

  for (let t = 1; t <= plantLifetimeYears; t++) {
    const discountFactor = Math.pow(1 + r, t);
    const generationMWh = annualGenerationGWh * 1000 * Math.pow(1 - deg, t - 1);
    const annualRevenueUSD = (generationMWh * electricityTariffUSDPerMWh);

    let yearCostUSD = annualOpexUSD;
    if (t === refurbishmentYear) {
      yearCostUSD += refurbishmentCostUSD;
    }

    discountedCosts += yearCostUSD / discountFactor;
    discountedGenerationMWh += generationMWh / discountFactor;

    const netCashFlowUSD = annualRevenueUSD - yearCostUSD;
    cumulativeCashFlowUSD += netCashFlowUSD;
    if (cumulativeCashFlowUSD >= 0 && simplePaybackYears === plantLifetimeYears) {
      simplePaybackYears = t;
    }

    const discountedNetCashFlow = netCashFlowUSD / discountFactor;
    cumulativeDiscountedCashFlowUSD += discountedNetCashFlow;
    npvUSD += discountedNetCashFlow;

    if (cumulativeDiscountedCashFlowUSD >= 0 && discountedPaybackYears === plantLifetimeYears) {
      discountedPaybackYears = t;
    }
  }

  const lcoeUSDPerMWh = Number((discountedCosts / discountedGenerationMWh).toFixed(2));
  const lcoeCFAFPerKWh = Number(((lcoeUSDPerMWh / 1000) * USD_TO_FCFA).toFixed(2));

  // Approx IRR calculation
  const annualAverageNetCashFlow = (annualGenerationGWh * 1000 * electricityTariffUSDPerMWh) - annualOpexUSD;
  const irrApprox = Math.min(25, Math.max(3, ((annualAverageNetCashFlow / capexUSD) * 100) - (r * 100 * 0.2)));

  const installedKW = (annualGenerationGWh * 1000) / (0.65 * 8760);
  const capexUSDPerKW = Math.round(capexUSD / installedKW);

  return {
    lcoeUSDPerMWh,
    lcoeCFAFPerKWh,
    capexUSDPerKW,
    netPresentValueUSD: Math.round(npvUSD),
    internalRateOfReturnPercent: Number(irrApprox.toFixed(1)),
    simplePaybackYears,
    discountedPaybackYears,
    levelizedCarbonIntensityGCO2PerKWh: 12.5, // Hydro lifecycle baseline
    assumptions: {
      discountRatePercent,
      plantLifetimeYears,
      electricityTariffUSDPerMWh,
      annualDegradationPercent,
    },
  };
}

// ============================================================================
// 5. PREDICTIVE HEALTH MONITORING (PHM) TELEMETRY DATASET
// ============================================================================

export const SUBSYSTEM_HEALTH_MONITORING_DATA: SubsystemHealthTelemetry[] = [
  {
    subsystemId: 'H07',
    name: {
      fr: 'Roue de Turbine Francis — Érosion & Cavitation',
      en: 'Francis Runner — Silt Erosion & Cavitation',
    },
    healthIndex: 88,
    status: 'nominal',
    primarySensor: 'Capteur acoustique HF + Jauge ultrasons',
    measuredValue: 'Perte d\'épaisseur: 1.4 mm / 12 000 h',
    nominalRange: '< 3.0 mm per IEC 62364',
    degradationMechanism: {
      fr: 'Abrasion par micro-grains de quartz transportés en crue et micro-implosions de bulles de cavitation au bord de fuite.',
      en: 'Quartz sediment silt abrasion during flood peaks and cavitation bubble collapse micro-jets along blade trailing edges.',
    },
    isoStandardRef: 'CEI 62364:2019 / IEC 60193',
    recommendedAction: {
      fr: 'Rechargement dur au carbure de tungstène HVOF programmé lors du grand arrêt décennal.',
      en: 'HVOF tungsten-carbide hard-facing overhaul scheduled during 10-year major outage.',
    },
    remainingUsefulLifeDays: 1480,
  },
  {
    subsystemId: 'H08',
    name: {
      fr: 'Palier Pivot & Ligne d\'Arbres — Vibrations & Température',
      en: 'Thrust Bearing & Shaft Alignment — Vibrations',
    },
    healthIndex: 94,
    status: 'nominal',
    primarySensor: 'Proximètres orbitaux X/Y + Sondes RTD Pt100',
    measuredValue: 'Déplacement Smax: 42 µm / T_patin: 64°C',
    nominalRange: 'Smax < 85 µm (Zone A per ISO 20816-5)',
    degradationMechanism: {
      fr: 'Rupture hydrodynamique du film d\'huile lors des transitions thermiques ou dérive d\'alignement.',
      en: 'Hydrodynamic wedge oil film thinning during thermal gradients or slight shaft runout eccentricities.',
    },
    isoStandardRef: 'ISO 20816-5:2018 (Zone A/B)',
    recommendedAction: {
      fr: 'Filtration continue de l\'huile ISO 4406 (cible 16/14/11) et contrôle annuel du faux-rond.',
      en: 'Continuous oil filtration to ISO 4406 (target 16/14/11) and annual shaft runout verification.',
    },
    remainingUsefulLifeDays: 3200,
  },
  {
    subsystemId: 'H09',
    name: {
      fr: 'Alternateur Stator — Décharges Partielles & Isolation',
      en: 'Generator Stator — Partial Discharges & Insulation',
    },
    healthIndex: 82,
    status: 'advisory',
    primarySensor: 'Coupleurs capacitifs PD 80 pF 15 kV',
    measuredValue: 'Niveau Qmax: 380 pC à 10.5 kV (100 Hz)',
    nominalRange: '< 500 pC (Advisory 500-1500 pC per IEC 60034-27)',
    degradationMechanism: {
      fr: 'Vieillissement thermo-électrique de la résine époxy-mica et micro-décharges dans les encoches.',
      en: 'Thermo-electric stress aging of epoxy-mica tape and slot discharge activity under thermal cycling.',
    },
    isoStandardRef: 'IEC 60034-27-2 / IEEE 1434',
    recommendedAction: {
      fr: 'Mesure de tangente delta (tan δ) au prochain arrêt d\'entretien et resserrage des cales d\'encoches.',
      en: 'Dissipation factor (tan δ) and tip-up test during upcoming maintenance outage; slot wedge re-tightening.',
    },
    remainingUsefulLifeDays: 890,
  },
  {
    subsystemId: 'H14',
    name: {
      fr: 'Transformateur Élévateur GSU — Gaz Dissous DGA',
      en: 'Generator Step-Up (GSU) Transformer — DGA Oil Health',
    },
    healthIndex: 91,
    status: 'nominal',
    primarySensor: 'Spectromètre de gaz en ligne DGA 7 gaz',
    measuredValue: 'Hydrogène H2: 24 ppm / Éthylène C2H4: 8 ppm',
    nominalRange: 'H2 < 100 ppm / C2H4 < 50 ppm (IEC 60599 Status 90%)',
    degradationMechanism: {
      fr: 'Pyrolyse modérée de l\'huile minérale et dégradation thermique des isolants en papier kraft sous forts courants.',
      en: 'Moderate mineral oil pyrolysis and kraft paper cellulose thermal breakdown under full load harmonic currents.',
    },
    isoStandardRef: 'IEC 60599 / IEEE C57.104',
    recommendedAction: {
      fr: 'Analyse chromatographique annuelle en laboratoire agréé et contrôle d\'acidité diélectrique.',
      en: 'Annual laboratory gas chromatography cross-check and oil dielectric acidity verification.',
    },
    remainingUsefulLifeDays: 2450,
  },
  {
    subsystemId: 'H11',
    name: {
      fr: 'Régulateur de Vitesse & Huile HP — Propreté & Temps de Réponse',
      en: 'Speed Governor & High-Pressure Oil — Servo Response',
    },
    healthIndex: 96,
    status: 'nominal',
    primarySensor: 'Transmetteur LVDT servomoteur + Capteur d\'eau huile',
    measuredValue: 'Temps de réponse: 48 ms / Humidité huile: 22 ppm',
    nominalRange: 'Temps < 80 ms / Humidité < 40 ppm',
    degradationMechanism: {
      fr: 'Oxydation de l\'huile hydraulique et encrassement des tiroirs de servovalves électrohydrauliques.',
      en: 'Hydraulic oil oxidation, varnish buildup, and contamination on electro-hydraulic servo spool valves.',
    },
    isoStandardRef: 'IEC 61362 / IEEE 125',
    recommendedAction: {
      fr: 'Remplacement semestriel des cartouches de filtration 3 microns et déshydratation sous vide.',
      en: 'Bi-annual replacement of 3-micron filtration cartridges and vacuum dehydration polishing.',
    },
    remainingUsefulLifeDays: 1850,
  },
  {
    subsystemId: 'H03',
    name: {
      fr: 'Ouvrage de Retenue & Barrage — Auscultation & Piézométrie',
      en: 'Dam Structure & Spillway — Geotechnical Health',
    },
    healthIndex: 98,
    status: 'nominal',
    primarySensor: 'Pendules inverses + Piézomètres à corde vibrante',
    measuredValue: 'Déplacement crête: 3.2 mm / Débit de fuite: 1.8 L/min',
    nominalRange: 'Déplacement < 12 mm / Fuites < 10 L/min',
    degradationMechanism: {
      fr: 'Efforts hydrostatiques saisonniers, sous-pressions dans le rocher de fondation et cycles de retrait thermique.',
      en: 'Seasonal hydrostatic head thrust, bedrock foundation uplift pressures, and concrete thermal shrinkage.',
    },
    isoStandardRef: 'ICOLD Bulletin 158 / ICOLD 180',
    recommendedAction: {
      fr: 'Campagne d\'auscultation topographique trimestrielle de haute précision et rinçage des drains de fondation.',
      en: 'Quarterly high-precision geodetic leveling survey and foundation drain relief flushing.',
    },
    remainingUsefulLifeDays: 7300,
  },
];
