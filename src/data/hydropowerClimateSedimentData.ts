// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 12 DATA ENGINE
// STEP 12: Climate Resilience, Sediment Management (IEC 62364), Eco-Hydraulics & Re-powering
// ============================================================================

import type {
  ClimateProjectionPoint,
  SedimentFlushingParams,
  SedimentFlushingResult,
  EcoHydraulicsTelemetry,
  RepoweringUpgradeOption,
} from '../types/hydropowerClimateSediment';

// ============================================================================
// 1. CLIMATE CHANGE SCENARIOS (GIEC / IPCC RCP 4.5 & RCP 8.5 - SANAGA BASIN)
// ============================================================================

export const CLIMATE_PROJECTIONS: ClimateProjectionPoint[] = [
  {
    decade: '2020-2030',
    baselineInflowM3s: 735,
    rcp45InflowM3s: 728,
    rcp85InflowM3s: 712,
    temperatureAnomalyC: +0.6,
    annualGenerationImpactPercent: -1.2,
    droughtRiskIndex: 'low',
  },
  {
    decade: '2030-2040',
    baselineInflowM3s: 735,
    rcp45InflowM3s: 710,
    rcp85InflowM3s: 675,
    temperatureAnomalyC: +1.2,
    annualGenerationImpactPercent: -4.8,
    droughtRiskIndex: 'moderate',
  },
  {
    decade: '2040-2050',
    baselineInflowM3s: 735,
    rcp45InflowM3s: 695,
    rcp85InflowM3s: 630,
    temperatureAnomalyC: +1.9,
    annualGenerationImpactPercent: -9.5,
    droughtRiskIndex: 'high',
  },
  {
    decade: '2050-2060',
    baselineInflowM3s: 735,
    rcp45InflowM3s: 680,
    rcp85InflowM3s: 585,
    temperatureAnomalyC: +2.8,
    annualGenerationImpactPercent: -15.6,
    droughtRiskIndex: 'extreme',
  },
];

// ============================================================================
// 2. SEDIMENT MANAGEMENT & IEC 62364 RUNNER HYDRO-ABRASION ENGINE
// ============================================================================

export function calculateSedimentFlushing(
  params: SedimentFlushingParams
): SedimentFlushingResult {
  const {
    suspendedSedimentConcentrationGPerL,
    quartzHardnessPercent,
    sedimentGrainSizeD50Mm,
    flushingDischargeM3s,
    flushingDurationHours,
  } = params;

  // Mean annual Sanaga river volume at Nachtigal: ~23 billion m3
  const annualWaterVolumeM3 = 23.2e9;
  // Annual sediment load in tons (concentration in g/L = kg/m3)
  const annualSedimentDepositedTons = Math.round(
    (annualWaterVolumeM3 * (suspendedSedimentConcentrationGPerL / 1000) * 0.72) / 1000
  );

  // Trap efficiency (Brune curve for run-of-river pondage: ~28%)
  const trapEfficiencyPercent = 28.5;

  // 50-year cumulative active volume reduction (%)
  const reservoirVolumeLossPercent50Years = Number(
    Math.min(
      45.0,
      ((annualSedimentDepositedTons * 50 * 0.0006) / 27.8) * 100
    ).toFixed(1)
  );

  // Bottom outlet flushing scour velocity (v = Q / A; 2 conduit gates 4m x 4m = 32 m2)
  const bottomOutletAreaM2 = 32.0;
  const flushingScourVelocityMs = Number(
    (flushingDischargeM3s / bottomOutletAreaM2).toFixed(2)
  );

  // Flushed sediment tonnage during flushing campaign (hours * 3600 * Q * concentrationFactor)
  const flushedSedimentTonsPerEvent = Math.round(
    flushingDurationHours *
      flushingDischargeM3s *
      3.6 *
      (suspendedSedimentConcentrationGPerL * 1.85)
  );

  // IEC 62364 Hydro-abrasive wear rate on Francis runner:
  // W = K_m * (C)^1.2 * (d50)^0.3 * (w)^3 * (Quartz%/100)
  // Relative runner blade velocity w ~ 28 m/s
  const wVelocity = 28.0;
  const runnerAbrasiveWearRateMmPerYear = Number(
    (
      0.000008 *
      Math.pow(suspendedSedimentConcentrationGPerL, 1.15) *
      Math.pow(sedimentGrainSizeD50Mm * 1000, 0.45) *
      Math.pow(wVelocity, 2.8) *
      (quartzHardnessPercent / 100)
    ).toFixed(2)
  );

  // Recommended recoating interval in years (allowable erosion depth = 2.0 mm with HVOF WC-Co-Cr coating)
  const runnerRecoatingIntervalYears = Math.max(
    1.5,
    Number((2.0 / Math.max(0.1, runnerAbrasiveWearRateMmPerYear)).toFixed(1))
  );

  let iec62364WearCategory: 'mild' | 'moderate' | 'severe' | 'extreme' = 'mild';
  if (runnerAbrasiveWearRateMmPerYear > 1.8) {
    iec62364WearCategory = 'extreme';
  } else if (runnerAbrasiveWearRateMmPerYear > 0.9) {
    iec62364WearCategory = 'severe';
  } else if (runnerAbrasiveWearRateMmPerYear > 0.4) {
    iec62364WearCategory = 'moderate';
  }

  const actionRecommendation = {
    fr:
      iec62364WearCategory === 'extreme' || iec62364WearCategory === 'severe'
        ? `Usure abrasive sévère (${runnerAbrasiveWearRateMmPerYear} mm/an) due à la forte teneur en quartz (${quartzHardnessPercent}%). Chasse hydrodynamique annuelle obligatoire et application de revêtement céramique HVOF carbure de tungstène tous les ${runnerRecoatingIntervalYears} ans.`
        : `Taux d'abrasion modéré (${runnerAbrasiveWearRateMmPerYear} mm/an). Vitesse de curage efficace à ${flushingScourVelocityMs} m/s garantissant l'évacuation des limons fins sans érosion prématurée du blindage de fond.`,
    en:
      iec62364WearCategory === 'extreme' || iec62364WearCategory === 'severe'
        ? `Severe abrasive erosion (${runnerAbrasiveWearRateMmPerYear} mm/yr) driven by high quartz content (${quartzHardnessPercent}%). Annual drawdown sediment flushing mandatory with HVOF Tungsten Carbide (WC-Co-Cr) coating renewal every ${runnerRecoatingIntervalYears} years.`
        : `Moderate hydro-abrasive rate (${runnerAbrasiveWearRateMmPerYear} mm/yr). Bottom outlet velocity of ${flushingScourVelocityMs} m/s maintains hydraulic silt transport without scouring steel liner plates.`,
  };

  return {
    annualSedimentDepositedTons,
    reservoirVolumeLossPercent50Years,
    flushingScourVelocityMs,
    flushedSedimentTonsPerEvent,
    trapEfficiencyPercent,
    runnerAbrasiveWearRateMmPerYear,
    runnerRecoatingIntervalYears,
    iec62364WearCategory,
    actionRecommendation,
  };
}

// ============================================================================
// 3. ECO-HYDRAULICS, FISH PASS & DISSOLVED OXYGEN TELEMETRY
// ============================================================================

export const ECO_HYDRAULICS_TELEMETRY: EcoHydraulicsTelemetry[] = [
  {
    id: 'ECO-01',
    parameterName: {
      fr: 'Débit Réservé Sanaga (Tronçon Court-Circuité)',
      en: 'Environmental Reserved Flow (Bypassed River Reach)',
    },
    currentValue: 104.5,
    regulatoryMinimum: 100.0,
    unit: 'm³/s',
    status: 'compliant',
    ecologicalFunction: {
      fr: 'Préservation des zones de frai et maintien de la vie aquatique dans les rapides de Nachtigal en aval du barrage dérivateur.',
      en: 'Preserves spawning habitats and benthic ecosystems across the Nachtigal cascades downstream of the diversion weir.',
    },
  },
  {
    id: 'ECO-02',
    parameterName: {
      fr: 'Vitesse de Passage Passe à Poissons à Bassins Successifs',
      en: 'Vertical Slot Fishway Baffle Velocity',
    },
    currentValue: 1.15,
    regulatoryMinimum: 1.30, // must not exceed 1.30 m/s for local rheophilic species
    unit: 'm/s',
    status: 'compliant',
    ecologicalFunction: {
      fr: 'Assure la libre montaison des poissons migrateurs du fleuve Sanaga (Labeo coubie, Chrysichthys aluuensis) sans épuisement hydrodynamique.',
      en: 'Guarantees upstream upstream passage for migratory Sanaga rheophilic fish species without hydraulic fatigue.',
    },
  },
  {
    id: 'ECO-03',
    parameterName: {
      fr: 'Oxygène Dissous Restitution Canal de Fuite',
      en: 'Tailrace Dissolved Oxygen Saturation',
    },
    currentValue: 7.2,
    regulatoryMinimum: 6.0,
    unit: 'mg/L',
    status: 'compliant',
    ecologicalFunction: {
      fr: 'Empêche l\'asphyxie aquatique en aval de l\'usine en assurant une réaération continue par vortex naturel dans les aspirateurs.',
      en: 'Eliminates downstream anoxic fish kills through natural aeration across draft tube boundary layers.',
    },
  },
  {
    id: 'ECO-04',
    parameterName: {
      fr: 'Température Thermique du Rejet Turbiné',
      en: 'Turbine Water Discharge Temperature',
    },
    currentValue: 26.4,
    regulatoryMinimum: 28.5, // maximum threshold
    unit: '°C',
    status: 'compliant',
    ecologicalFunction: {
      fr: 'Garantit l\'absence de stratification thermique préjudiciable dans le lit principal de la Sanaga (écart amont/aval < 0.4°C).',
      en: 'Prevents harmful thermal stratification in the main river channel (thermal plume drift < 0.4°C).',
    },
  },
];

// ============================================================================
// 4. CIRCULAR RE-POWERING & LIFE-EXTENSION LAB (ISO 14040 / IEC 60034-1)
// ============================================================================

export const REPOWERING_UPGRADE_OPTIONS: RepoweringUpgradeOption[] = [
  {
    id: 'REP-01',
    title: {
      fr: 'Rénovation Roue Francis Haute Efficacité CFD "X-Blade"',
      en: 'High-Efficiency CFD "X-Blade" Francis Runner Retrofit',
    },
    componentTargeted: 'Francis Runner / Aubes de Roue',
    capacityGainMW: 5.2, // per unit -> +36.4 MW across 7 units
    efficiencyGainPercent: 3.4,
    capexMillionUsd: 14.5,
    paybackPeriodYears: 3.2,
    circularRecyclabilityPercent: 99.2,
    co2AvoidedAdditionalTonsYear: 184000,
    description: {
      fr: 'Remplacement de la roue d\'origine par un profil profilé CFD 5-axes en inox martensitique 13Cr4Ni avec aubes en X éliminant le vortex de torche.',
      en: 'Replaces conventional runner with 5-axis milled 13Cr4Ni stainless steel X-blade profile, eradicating part-load draft tube vortex core.',
    },
  },
  {
    id: 'REP-02',
    title: {
      fr: 'Rebobinage Statorique Isolant Classe H (+15% Puissance MVA)',
      en: 'Class H Stator Rewinding & Magnetic Uprating (+15% MVA)',
    },
    componentTargeted: 'Stator Alternateur / Barres Roebel',
    capacityGainMW: 9.0, // per unit -> from 60 MW to 69 MW
    efficiencyGainPercent: 0.8,
    capexMillionUsd: 21.0,
    paybackPeriodYears: 3.8,
    circularRecyclabilityPercent: 98.4,
    co2AvoidedAdditionalTonsYear: 310000,
    description: {
      fr: 'Rebobinage complet des 7 stators avec isolation mica-époxy sous vide (VPI) Classe H (180°C), permettant de porter la puissance unitaire de 60 MW à 69 MW sans modification du génie civil.',
      en: 'Full 7-stator rewinding utilizing Class H (180°C) VPI mica-epoxy insulation, uprating unit capacity from 60 MW to 69 MW without any powerhouse civil restructuring.',
    },
  },
  {
    id: 'REP-03',
    title: {
      fr: 'Régulateur de Vitesse Numérique Prédictif & Injection d\'Air Automatisée',
      en: 'AI Predictive Digital Governor & Automated Draft Tube Aeration',
    },
    componentTargeted: 'Régulation Oléohydraulique & Aspirateur',
    capacityGainMW: 1.8,
    efficiencyGainPercent: 1.2,
    capexMillionUsd: 4.2,
    paybackPeriodYears: 1.9,
    circularRecyclabilityPercent: 96.5,
    co2AvoidedAdditionalTonsYear: 62000,
    description: {
      fr: 'Système de contrôle prédictif en boucle fermée modulant les micro-injections d\'air dans l\'ogive de roue pour amortir les pulsations de pression sous régime transitoire.',
      en: 'Closed-loop predictive governor modulating high-pressure air injection into the runner crown, mitigating sub-synchronous pressure surges under grid cycling.',
    },
  },
  {
    id: 'REP-04',
    title: {
      fr: 'Revêtement Nanocomposite HVOF Carbure de Tungstène Anti-Abrasion',
      en: 'Nanocomposite HVOF Tungsten Carbide Thermal Spray Anti-Abrasion',
    },
    componentTargeted: 'Flasques Supérieurs & Directrices Distributeur',
    capacityGainMW: 0.5,
    efficiencyGainPercent: 0.6,
    capexMillionUsd: 2.8,
    paybackPeriodYears: 1.4,
    circularRecyclabilityPercent: 97.0,
    co2AvoidedAdditionalTonsYear: 28000,
    description: {
      fr: 'Projection thermique haute vitesse (HVOF) de carbure de tungstène-chrome (WC-Co-Cr 86-10-4) multipliant par 4 la durée de vie des surfaces exposées aux limons quartziques.',
      en: 'Supersonic HVOF thermal spraying of tungsten carbide-chromium (WC-Co-Cr 86-10-4), quadrupling component life in high-quartz suspended sediment waters.',
    },
  },
];
