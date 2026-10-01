// src/components/installations/data/installationProjectModel.ts
// EPEDE Electrical Installations & Utilization — Canonical Project Data Model
// Conceptual Design Workbench for TGBT, Distribution Boards, Final Circuits & Power Balance

export type ProjectEnvironmentType = 
  | 'RESIDENTIAL' 
  | 'TERTIARY_COMMERCIAL' 
  | 'LARGE_BUILDING' 
  | 'INDUSTRIAL'
  | 'INDUSTRIAL_PROCESS'
  | 'INDUSTRIAL_MANUFACTURING'
  | 'HEALTHCARE_CLINIC';

export type EarthingSystem = 'TT' | 'TN_S' | 'TN_C' | 'TN_C_S' | 'IT';

export type LoadCriticality = 
  | 'NORMAL' 
  | 'ESSENTIAL' 
  | 'EMERGENCY' 
  | 'CRITICAL_UPS';

export type VerificationBadge = 
  | 'VERIFIED' 
  | 'PARTIALLY_VERIFIED' 
  | 'INPUT_REQUIRED' 
  | 'ENGINEERING_REVIEW_REQUIRED' 
  | 'CONCEPTUAL_MODEL' 
  | 'SOURCE_GAP';

export interface ProjectAssumption {
  id: string;
  category: 'VOLTAGE' | 'TEMPERATURE' | 'SIMULTANEITY' | 'CABLE' | 'PROTECTION' | 'EARTHING' | 'EXPANSION';
  label_fr: string;
  label_en: string;
  value: string;
  standardReference: string;
  notes_fr?: string;
  notes_en?: string;
}

export interface ProjectLoad {
  id: string;
  name: string;
  category: 
    | 'LIGHTING' 
    | 'SOCKETS' 
    | 'HVAC' 
    | 'MOTIVE_PUMP' 
    | 'IT_COMPUTING' 
    | 'KITCHEN' 
    | 'ELEVATOR' 
    | 'EMERGENCY_LIFE_SAFETY' 
    | 'INDUSTRIAL_MACHINE';
  areaName: string;                     // e.g., 'Ground Floor', 'Server Room', 'Mechanical Yard'
  circuitId?: string;                   // Linked final circuit ID
  quantity: number;
  unitRatingKw: number;                 // Nameplate active power (kW)
  voltageV: 230 | 400;                  // 230 V (1P) or 400 V (3P)
  phase: '1P_L1' | '1P_L2' | '1P_L3' | '3P';
  powerFactor: number;                  // Typically 0.80 - 0.98
  efficiency: number;                   // 0.80 - 0.96
  loadFactorKu: number;                 // Utilization factor ku (0.50 - 1.00)
  simultaneityKs: number;               // Diversity/coincidence factor ks (0.50 - 1.00)
  dutyCycle: 'CONTINUOUS' | 'INTERMITTENT' | 'STANDBY';
  criticality: LoadCriticality;
  startingMethod?: 'DOL' | 'STAR_DELTA' | 'SOFT_STARTER' | 'VFD';
  thdiPercent?: number;                 // Harmonic distortion
  notes?: string;
}

export interface FinalCircuit {
  id: string;
  circuitCode: string;                  // e.g. 'C01-ECL-RDC'
  boardId: string;                      // Parent Distribution Board
  name: string;
  circuitType: 
    | 'LIGHTING' 
    | 'SOCKETS_16A' 
    | 'DEDICATED_HVAC' 
    | 'MOTOR_PUMP' 
    | 'WATER_HEATER' 
    | 'COOKER_OVEN' 
    | 'UPS_IT' 
    | 'EMERGENCY_EXIT';
  phase: 'L1' | 'L2' | 'L3' | 'THREE_PHASE';
  designCurrentIbA: number;             // Calculated design current
  protectiveDevice: {
    type: 'MCB' | 'RCBO';
    curve: 'B' | 'C' | 'D';
    ratedCurrentInA: number;
    breakingCapacityKa: number;
    rcdSensitivityMa?: number;
  };
  conductor: {
    material: 'COPPER' | 'ALUMINUM';
    crossSectionMm2: number;
    lengthMeters: number;
    installationMethod: 'CONDUIT_IN_WALL' | 'PERFORATED_TRAY' | 'DIRECT_BURIAL' | 'LADDER';
    calculatedDeltaUPercent: number;
    withstandChecked: boolean;
  };
  connectedLoadIds: string[];
  // Aliases for calculation engines
  code?: string;
  phasesCount?: number;
  cableLengthMeters?: number;
  conductorCrossSectionMm2?: number;
  conductorMaterial?: 'COPPER' | 'ALUMINUM';
  powerFactor?: number;
  intendedLoadUse?: string;
  installedPowerWatts?: number;
  ratedPowerKw?: number;
}

export interface DistributionBoard {
  id: string;
  boardCode: string;                    // e.g. 'TD-R+1'
  name: string;
  location: string;
  upstreamFeederId: string;             // Parent TGBT Feeder ID
  enclosureType: 'MODULAR_FLUSH' | 'SURFACE_METAL_IP55' | 'FLOOR_STANDING_IP65';
  incomerDevice: {
    type: 'ISOLATOR' | 'MCCB' | 'RCD_BREAKER';
    ratedCurrentA: number;
    rcdSensitivityMa?: number;          // e.g. 300 mA selective
  };
  busbarRatingA: number;
  circuitIds: string[];
  // Aliases for calculation engines
  incomerSwitchRatingA?: number;
  ipIkRating?: string;
  outgoingCircuits?: FinalCircuit[];
}

export interface TgbtFeeder {
  id: string;
  feederCode: string;                   // e.g. 'F03-CHILLER'
  name: string;
  destinationBoardId?: string;          // If feeding a sub-board
  designCurrentIbA: number;
  demandKw: number;
  apparentKva: number;
  powerFactor: number;
  protectiveDevice: {
    type: 'MCCB' | 'ACB' | 'FUSE_DISCONNECTOR';
    ratingInA: number;
    breakingCapacityKa: number;
    tripUnitType: 'THERMAL_MAGNETIC' | 'ELECTRONIC_LSI' | 'ELECTRONIC_LSIG';
  };
  cableLink: {
    conductorMaterial: 'COPPER' | 'ALUMINUM';
    crossSectionMm2: number;
    parallelCoresPerPhase: number;
    lengthMeters: number;
    calculatedVoltageDropPercent: number;
  };
  criticality: LoadCriticality;
  // Aliases for calculation engines
  breakerType?: string;
  ratingA?: number;
}

export interface TgbtSwitchboard {
  id: string;
  name: string;
  internalForm: 'Form 1' | 'Form 2b' | 'Form 3b' | 'Form 4b';
  ratedCurrentBusbarA: number;          // Main horizontal busbar rating (e.g. 1600 A)
  shortCircuitIcwKa: number;            // 1-second withstand (e.g. 50 kA)
  peakWithstandIpkKa: number;           // Peak withstand (e.g. 105 kA)
  incomers: {
    id: string;
    sourceType: 'TRANSFORMER_GRID' | 'STANDBY_GENSET' | 'COUPLER_TIE';
    deviceType: 'ACB' | 'MCCB';
    ratedCurrentA: number;
    breakingCapacityIcuKa: number;
    status: 'CLOSED' | 'OPEN';
  }[];
  compensationBankKvar: number;         // Automatic power factor capacitor steps
  surgeArresterType: 'TYPE_1_PLUS_2' | 'TYPE_2';
  feeders: TgbtFeeder[];
  // Aliases for calculation engines
  enclosureIpRating?: string;
  enclosureIkRating?: string;
  mainIncomerRatingA?: number;
}

export interface InstallationProject {
  id: string;
  name: string;
  environmentType: ProjectEnvironmentType;
  description_fr: string;
  description_en: string;
  supplyContext: {
    nominalVoltageV: number;            // 400 V
    nominalVoltageVac?: number;         // Compatibility alias
    frequencyHz: number;                // 50 Hz
    earthingSystem: EarthingSystem;
    transformerRatingKva: number;       // e.g. 800 kVA
    transformerUkPercent: number;       // e.g. 4% or 6%
    serviceConnectionRatingA: number;   // e.g. 1250 A
    availableFaultMva: number;          // e.g. 250 MVA
  };
  backupSupplyContext: {
    hasStandbyGenerator: boolean;
    generatorRatingKva: number;
    hasUps: boolean;
    upsRatingKva: number;
    atsTransition: 'OPEN_TRANSITION' | 'CLOSED_TRANSITION';
  };
  expansionMarginFactor: number;        // e.g. 1.20 (+20% future capacity)
  ambientTemperatureC: number;          // e.g. 35°C
  loads: ProjectLoad[];
  finalCircuits: FinalCircuit[];
  distributionBoards: DistributionBoard[];
  tgbt: TgbtSwitchboard;
  assumptions: ProjectAssumption[];
}

// ---------------------------------------------------------------------------
// Core Analytical Helper Functions
// ---------------------------------------------------------------------------

export interface PowerBalanceSummary {
  installedPowerKw: number;
  installedApparentKva: number;
  demandActivePowerKw: number;
  demandReactivePowerKvar: number;
  demandApparentPowerKva: number;
  averagePowerFactor: number;
  totalDesignCurrentIbA: number;
  tgbtIncomerAmperes?: number;
  phaseLoads: {
    L1_Kw: number;
    L1_CurrentA: number;
    L2_Kw: number;
    L2_CurrentA: number;
    L3_Kw: number;
    L3_CurrentA: number;
    unbalancePercent: number;
  };
  criticalityBreakdown: {
    normalKw: number;
    essentialKw: number;
    emergencyKw: number;
    criticalUpsKw: number;
  };
  transformerUtilizationPercent: number;
  generatorUtilizationPercent: number;
  upsUtilizationPercent: number;
  recommendedCompensationKvar: number;
}

export function computeProjectPowerBalance(project: InstallationProject): PowerBalanceSummary {
  let installedKw = 0;
  let demandKw = 0;
  let demandKvar = 0;

  let l1Kw = 0;
  let l2Kw = 0;
  let l3Kw = 0;

  let normalKw = 0;
  let essentialKw = 0;
  let emergencyKw = 0;
  let criticalUpsKw = 0;

  project.loads.forEach(load => {
    const pInst = load.quantity * load.unitRatingKw;
    const pDem = pInst * load.loadFactorKu * load.simultaneityKs;
    const pf = Math.max(0.6, Math.min(1.0, load.powerFactor || 0.85));
    const tanPhi = Math.tan(Math.acos(pf));
    const qDem = pDem * tanPhi;

    installedKw += pInst;
    demandKw += pDem;
    demandKvar += qDem;

    // Criticality classification
    if (load.criticality === 'NORMAL') normalKw += pDem;
    else if (load.criticality === 'ESSENTIAL') essentialKw += pDem;
    else if (load.criticality === 'EMERGENCY') emergencyKw += pDem;
    else if (load.criticality === 'CRITICAL_UPS') criticalUpsKw += pDem;

    // Phase distribution
    if (load.phase === '1P_L1') {
      l1Kw += pDem;
    } else if (load.phase === '1P_L2') {
      l2Kw += pDem;
    } else if (load.phase === '1P_L3') {
      l3Kw += pDem;
    } else {
      // 3-Phase balanced split
      l1Kw += pDem / 3;
      l2Kw += pDem / 3;
      l3Kw += pDem / 3;
    }
  });

  // Apply expansion margin
  const designDemandKw = demandKw * project.expansionMarginFactor;
  const designDemandKvar = demandKvar * project.expansionMarginFactor;
  const designApparentKva = Math.sqrt(designDemandKw * designDemandKw + designDemandKvar * designDemandKvar);
  const avgPf = designDemandKw / (designApparentKva || 1);

  const uNominal = project.supplyContext.nominalVoltageV || 400;
  const vSinglePhase = uNominal / Math.sqrt(3); // 230.9 V

  const totalCurrentA = (designApparentKva * 1000) / (Math.sqrt(3) * uNominal);

  const l1CurrentA = (l1Kw * 1000) / (vSinglePhase * avgPf);
  const l2CurrentA = (l2Kw * 1000) / (vSinglePhase * avgPf);
  const l3CurrentA = (l3Kw * 1000) / (vSinglePhase * avgPf);

  const avgPhaseCurrent = (l1CurrentA + l2CurrentA + l3CurrentA) / 3;
  const maxDeviation = Math.max(
    Math.abs(l1CurrentA - avgPhaseCurrent),
    Math.abs(l2CurrentA - avgPhaseCurrent),
    Math.abs(l3CurrentA - avgPhaseCurrent)
  );
  const unbalancePercent = avgPhaseCurrent > 0 ? (maxDeviation / avgPhaseCurrent) * 100 : 0;

  // Transformer and source loadings
  const xfmrKva = project.supplyContext.transformerRatingKva || 1;
  const xfmrUtilization = (designApparentKva / xfmrKva) * 100;

  const genKva = project.backupSupplyContext.generatorRatingKva || 1;
  const genEssentialApparent = (essentialKw + emergencyKw + criticalUpsUps(essentialKw, emergencyKw, criticalUpsKw)) * 1.25;
  const genUtilization = project.backupSupplyContext.hasStandbyGenerator
    ? ((essentialKw + emergencyKw + criticalUpsKw) * 1.2 / genKva) * 100
    : 0;

  const upsKva = project.backupSupplyContext.upsRatingKva || 1;
  const upsUtilization = project.backupSupplyContext.hasUps
    ? ((criticalUpsKw * 1.2) / upsKva) * 100
    : 0;

  // Compensation required to reach target cos phi 0.95
  const targetTanPhi = Math.tan(Math.acos(0.95)); // ~ 0.328
  const recommendedCompensation = Math.max(0, designDemandKvar - designDemandKw * targetTanPhi);

  return {
    installedPowerKw: Math.round(installedKw * 10) / 10,
    installedApparentKva: Math.round((installedKw / avgPf) * 10) / 10,
    demandActivePowerKw: Math.round(designDemandKw * 10) / 10,
    demandReactivePowerKvar: Math.round(designDemandKvar * 10) / 10,
    demandApparentPowerKva: Math.round(designApparentKva * 10) / 10,
    averagePowerFactor: Math.round(avgPf * 100) / 100,
    totalDesignCurrentIbA: Math.round(totalCurrentA * 10) / 10,
    tgbtIncomerAmperes: Math.round(totalCurrentA * 10) / 10,
    phaseLoads: {
      L1_Kw: Math.round(l1Kw * 10) / 10,
      L1_CurrentA: Math.round(l1CurrentA * 10) / 10,
      L2_Kw: Math.round(l2Kw * 10) / 10,
      L2_CurrentA: Math.round(l2CurrentA * 10) / 10,
      L3_Kw: Math.round(l3Kw * 10) / 10,
      L3_CurrentA: Math.round(l3CurrentA * 10) / 10,
      unbalancePercent: Math.round(unbalancePercent * 10) / 10
    },
    criticalityBreakdown: {
      normalKw: Math.round(normalKw * 10) / 10,
      essentialKw: Math.round(essentialKw * 10) / 10,
      emergencyKw: Math.round(emergencyKw * 10) / 10,
      criticalUpsKw: Math.round(criticalUpsKw * 10) / 10
    },
    transformerUtilizationPercent: Math.round(xfmrUtilization * 10) / 10,
    generatorUtilizationPercent: Math.round(genUtilization * 10) / 10,
    upsUtilizationPercent: Math.round(upsUtilization * 10) / 10,
    recommendedCompensationKvar: Math.round(recommendedCompensation * 10) / 10
  };
}

function criticalUpsUps(ess: number, em: number, ups: number): number {
  return (ess + em + ups) * 0.1;
}

// ---------------------------------------------------------------------------
// Standard Voltage Drop Calculator per circuit
// ---------------------------------------------------------------------------
export function calculateCircuitVoltageDrop(
  lengthMeters: number,
  crossSectionMm2: number,
  currentA: number,
  isThreePhase: boolean,
  powerFactor = 0.85,
  conductorMaterial: 'COPPER' | 'ALUMINUM' = 'COPPER'
): { deltaVolts: number; deltaPercent: number; isWithinLimits: boolean } {
  // Resistivity at 70°C operating temperature: Cu = 0.0225, Al = 0.036
  const rho = conductorMaterial === 'COPPER' ? 0.0225 : 0.036;
  const reactancePerMeter = 0.00008; // 0.08 mΩ/m
  const resistancePerMeter = rho / crossSectionMm2;

  const sinPhi = Math.sin(Math.acos(powerFactor));
  const cosPhi = powerFactor;

  // Single-phase b = 2, Three-phase b = sqrt(3)
  const b = isThreePhase ? Math.sqrt(3) : 2;
  const deltaV = b * lengthMeters * currentA * (resistancePerMeter * cosPhi + reactancePerMeter * sinPhi);

  const baseVoltage = isThreePhase ? 400 : 230;
  const deltaPercent = (deltaV / baseVoltage) * 100;

  // General limit: 5.0% for power, 3.0% for lighting
  return {
    deltaVolts: Math.round(deltaV * 100) / 100,
    deltaPercent: Math.round(deltaPercent * 100) / 100,
    isWithinLimits: deltaPercent <= 5.0
  };
}
