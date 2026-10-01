// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 21 TYPES
// STEP 21: Asset Health Index (AHI), Multi-Physics Aging, Remaining Useful Life
// (RUL), DGA Duval Triangle (IEC 60599), Vibration (ISO 10816-5) & ISO 55001 CMMS
// ============================================================================

export type HealthGrade = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';

export interface ComponentHealthScore {
  componentId: string;
  nameFr: string;
  nameEn: string;
  healthIndex: number; // 0 to 100%
  grade: HealthGrade;
  weightInUnitAhi: number; // Sums to 1.0 per unit
  primaryStressorsFr: string[];
  primaryStressorsEn: string[];
  lastInspectionDate: string;
  diagnosticStandard: string;
}

export interface UnitAssetHealth {
  unitId: string; // e.g. 'G01' ... 'G07'
  name: string;
  unitOverallAhi: number; // 0 to 100%
  grade: HealthGrade;
  equivalentOperatingHours: number; // e.g. 14,800 h
  startStopCyclesCount: number;      // Mechanical fatigue cycles
  emergencyTripsCount: number;       // High-stress load rejection events
  estimatedRulYears: number;         // Remaining Useful Life (years)
  components: {
    francisRunner: ComponentHealthScore;
    generatorStator: ComponentHealthScore;
    stepUpTransformer: ComponentHealthScore;
    thrustBearings: ComponentHealthScore;
    penstockDraftTube: ComponentHealthScore;
  };
}

export type DuvalFaultType =
  | 'NORMAL'
  | 'PD' // Décharges partielles (corona)
  | 'T1' // Défaut thermique < 300°C (surchauffe locale)
  | 'T2' // Défaut thermique 300°C - 700°C
  | 'T3' // Défaut thermique > 700°C (décomposition de l'huile / carbonisation)
  | 'D1' // Décharges de faible énergie (étincelles, perforation isolante)
  | 'D2' // Décharges de forte énergie (arc électrique franc)
  | 'DT';// Défaut mixte thermique et électrique

export interface TransformerDgaAnalysis {
  transformerId: string;
  unitName: string;
  ch4Ppm: number;      // Méthane
  c2h4Ppm: number;     // Éthylène
  c2h2Ppm: number;     // Acétylène
  h2Ppm: number;       // Hydrogène
  coPpm: number;       // Monoxyde de carbone (dégradation papier)
  co2Ppm: number;      // Dioxyde de carbone
  // Duval Triangle coordinates (% of CH4 + C2H4 + C2H2)
  pctCh4: number;
  pctC2h4: number;
  pctC2h2: number;
  diagnosedFault: DuvalFaultType;
  faultDescriptionFr: string;
  faultDescriptionEn: string;
  recommendedActionFr: string;
  recommendedActionEn: string;
  paperDegradationDegreeDp: number; // Degré de polymérisation (initial ~1200, fin de vie < 200)
  furanConcentrationMgKg: number;   // Furanes (2-FAL)
  dielectricBreakdownKv: number;    // Rigidité diélectrique (> 60 kV selon IEC 60156)
}

export interface VibrationSpectrumPoint {
  frequencyHz: number;
  amplitudeMmS: number; // Vitesse vibratoire RMS mm/s
  orderRatio: number;   // f / f0 (f0 = 2.27 Hz @ 136.4 RPM)
  label?: string;       // e.g. '1x RPM (Balourd)', 'BPF (Passage aubes)', 'Vortex Rheingans'
}

export interface VibrationAnalysis {
  unitId: string;
  shaftSpeedRpm: number; // 136.36 RPM (f0 = 2.27 Hz)
  isoZone: 'ZONE_A' | 'ZONE_B' | 'ZONE_C' | 'ZONE_D'; // ISO 10816-5 (Zone A: Nouveau, B: Acceptable, C: Alerte, D: Arrêt)
  radialBearingMmS: number;
  axialThrustBearingMmS: number;
  shaftOrbitPeakToPeakUm: number;
  dominantHarmonic: string;
  spectrum: VibrationSpectrumPoint[];
}

export interface CmmsWorkOrder {
  orderId: string;
  assetTag: string;
  titleFr: string;
  titleEn: string;
  priority: 'CRITICAL_IMMEDIATE' | 'HIGH_PLANNED' | 'MEDIUM_CONDITION' | 'LOW_ROUTINE';
  triggerType: 'CBM_THRESHOLD' | 'PREDICTIVE_RUL' | 'PERIODIC_STANDARD' | 'REGULATORY_SAFETY';
  standardReference: string;
  leadTimeDays: number;
  estimatedLaborHours: number;
  estimatedCostUsd: number;
  status: 'PENDING_APPROVAL' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface PlantLifeExtensionScenario {
  baselineLifespanYears: number;  // 40 years standard
  extendedLifespanYears: number;  // 60 years extended
  capexRefurbishmentUsd: number;  // e.g. $42M
  avoidedNewBuildCostUsd: number; // e.g. $380M
  npvBenefitUsd: number;          // e.g. $165M
  keyInterventionsFr: string[];
  keyInterventionsEn: string[];
}
