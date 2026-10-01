/**
 * EPEDE GENERATION DOMAIN — HYDROPOWER SPECIFICATION
 * Authoritative TypeScript Data Architecture & Knowledge Graph Types
 * Domain: D01 — Generation | Technology: Hydropower
 * Standard References: IEC 60041, IEC 60193, IEC 62270, IEEE 1010, IEEE 421
 */

// ============================================================================
// 1. PLANT ARCHITECTURAL CLASSIFICATIONS
// ============================================================================

export type HydroPlantClassification =
  | 'run_of_river'          // Section 3.1: Diversion / Run-of-River (limited/no storage, flow-following)
  | 'reservoir_impoundment' // Section 3.2: High/Medium storage impoundment
  | 'dam_based'             // Section 3.3: Integrated dam body & powerhouse
  | 'pumped_storage'        // Section 3.4: Reversible bidirectional energy storage
  | 'underground_cavern'    // Section 3.5: Underground powerhouse & pressure waterways
  | 'cascade'               // Section 3.6: Multi-stage river basin cascade
  | 'multipurpose';         // Section 3.7: Energy, irrigation, flood control, water supply

export interface PlantClassificationMeta {
  id: HydroPlantClassification;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  typicalHeadRangeM: { min: number; max: number };
  typicalCapacityRangeMW: { min: number; max: number };
  keyAdvantages: { fr: string[]; en: string[] };
  keyEngineeringChallenges: { fr: string[]; en: string[] };
  civilStructures: string[];
  hydraulicConveyance: string[];
  operationalCharacteristics: { fr: string; en: string };
}

// ============================================================================
// 2. MASTER SUBSYSTEM CODES (H01 - H31)
// ============================================================================

export type HydroSubsystemId =
  | 'H01' // Water Resource & Hydrology
  | 'H02' // Reservoir & Water Storage
  | 'H03' // Dam & Civil Infrastructure
  | 'H04' // Hydraulic Intake
  | 'H05' // Hydraulic Conveyance
  | 'H06' // Surge & Hydraulic Transients
  | 'H07' // Turbine System
  | 'H08' // Mechanical Power Train
  | 'H09' // Hydro Generator
  | 'H10' // Excitation System
  | 'H11' // Speed Governor
  | 'H12' // Generator Cooling
  | 'H13' // Generator Lubrication
  | 'H14' // Generator Transformer (GSU)
  | 'H15' // Generating Switchyard
  | 'H16' // Station Auxiliary System
  | 'H17' // Protection System
  | 'H18' // Control & Automation
  | 'H19' // Instrumentation
  | 'H20' // Communication
  | 'H21' // Earthing & Lightning Protection
  | 'H22' // Fire & Safety
  | 'H23' // Drainage & Dewatering
  | 'H24' // Ventilation & HVAC
  | 'H25' // Maintenance & Condition Monitoring
  | 'H26' // Operation
  | 'H27' // Testing & Commissioning
  | 'H28' // Standards & Compliance
  | 'H29' // Lifecycle
  | 'H30' // Environmental & Water Management
  | 'H31'; // Grid Interface

export type HydroSystemCluster =
  | 'civil_hydraulic'    // H01-H06, H30
  | 'electromechanical'  // H07-H13
  | 'electrical_power'   // H14-H16, H21, H31
  | 'automation_defense' // H17-H20, H25
  | 'balance_of_plant'   // H22-H24
  | 'governance_ops';    // H26-H29

export type HydroSubsystemCategory = 'civil' | 'hydraulic' | 'mechanical' | 'electrical' | 'control' | 'protection' | 'auxiliary';

export interface HydroSubsystem {
  id: HydroSubsystemId;
  code: string;
  name: { fr: string; en: string };
  category: HydroSubsystemCategory;
  domainLayer: string;
  description: { fr: string; en: string };
  keyComponents: string[];
  designCriteria: Array<{ fr: string; en: string }>;
  failureModes: Array<{ fr: string; en: string }>;
  protectionMeasures: Array<{ fr: string; en: string }>;
  standards: string[];
}

export interface HydroPlantUnitSpec {
  count: number;
  unitCapacityMW: number;
  turbineType: string;
  ratedSpeedRPM: number;
  generatorVoltageKV: number;
  flowPerUnitM3s: number;
}

export interface HydroPlantProfile {
  id: string;
  name: string;
  operator: string;
  basin: string;
  commissioningYear: number;
  installedCapacityMW: number;
  annualGenerationGWh: number;
  ratedHeadM: number;
  plantType: string;
  reservoirCapacityMillionM3: number;
  gridInterconnection: string;
  units: HydroPlantUnitSpec[];
  damType: string;
  civilFeatures: {
    damHeightM: number;
    crestLengthM: number;
    spillwayCapacityM3s: number;
    penstockCount: number;
    penstockDiameterM: number;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  technicalNotes: {
    fr: string;
    en: string;
  };
}

// ============================================================================
// 3. MULTI-DIMENSIONAL DOMAIN INTERFACES
// ============================================================================

export interface HydraulicDimension {
  flowM3s: number;
  grossHeadM: number;
  netHeadM: number;
  designPressureBar: number;
  waterVelocityMs: number;
  cavitationThomaSigma?: number;
  tailwaterElevationM: number;
  waterLevelM: number;
  intakeLossM: number;
  penstockFrictionLossM: number;
  surgeTankOscillationPeriodS?: number;
}

export interface MechanicalDimension {
  ratedSpeedRpm: number;
  runawaySpeedRpm: number;
  ratedTorqueKNm: number;
  thrustBearingLoadTons: number;
  shaftArrangement: 'vertical' | 'horizontal' | 'inclined';
  criticalSpeedsRpm: number[];
  vibrationRmsMmS: number;
  shaftDeflectionMicrons: number;
  oilFilmThicknessMicrons: number;
}

export interface ElectricalDimension {
  ratedVoltageKV: number;
  ratedCurrentA: number;
  ratedActivePowerMW: number;
  ratedApparentPowerMVA: number;
  powerFactor: number;
  frequencyHz: number;
  connectionType: 'star' | 'delta';
  neutralEarthingMethod: 'isolated' | 'resistor' | 'distribution_transformer' | 'solid';
  reactancesPerUnit: {
    xd: number;   // Direct axis synchronous reactance
    xd_prime: number; // Transient
    xd_dbl_prime: number; // Subtransient
    xq: number;   // Quadrature axis
  };
  insulationClass: 'F' | 'H';
  bilKV: number; // Basic Insulation Level
}

export interface ControlDimension {
  level: 'field' | 'local_unit' | 'plant_scada' | 'national_dispatch';
  governorMode: 'speed_droop' | 'power_frequency' | 'opening_mode' | 'water_level';
  avrMode: 'voltage_control' | 'power_factor' | 'var_control';
  droopPercent: number;
  interlocksActive: string[];
  permissivesMet: boolean;
}

export interface ProtectionDimension {
  ansiCodes: string[]; // e.g. ['87G', '50/51', '40', '64G', '32R', '24']
  tripMatrixDestinations: ('gcb' | 'field_breaker' | 'governor_emergency_stop' | 'intake_gate_drop' | 'hv_breaker')[];
  alarmSetpoints: Record<string, number>;
  tripSetpoints: Record<string, number>;
  operatingTimeMs: number;
}

export interface InstrumentationDimension {
  phenomenon: string;
  sensorType: string;
  signalStandard: '4-20mA' | 'PT100_RTD' | '0-10V' | 'Modbus' | 'IEC_61850' | 'FiberOptic';
  range: { min: number; max: number; unit: string };
  accuracyClass: string;
  samplingRateHz: number;
}

// ============================================================================
// 4. TURBINE TECHNOLOGIES & CLASSIFICATIONS
// ============================================================================

export type HydraulicTurbineType =
  | 'francis'       // Reaction, Medium/High Head (40m - 600m)
  | 'pelton'        // Impulse, High Head (>200m)
  | 'kaplan'        // Reaction, Low Head with adjustable blades (5m - 70m)
  | 'propeller'     // Reaction, Fixed blade axial flow
  | 'turgo'         // Impulse, Medium Head angled jet
  | 'cross_flow'    // Impulse/Cross-flow Banki-Michell
  | 'pump_turbine'; // Reversible Francis/Deriaz pump-turbine

export interface TurbineTechnicalData {
  type: HydraulicTurbineType;
  flowRangeM3s: { min: number; max: number };
  headRangeM: { min: number; max: number };
  specificSpeedNq: number;
  efficiencyPeakPercent: number;
  components: {
    casing: string;
    flowRegulation: string; // e.g. Wicket gates, Spear nozzle, Adjustable runner blades
    runner: string;
    discharge: string; // e.g. Draft tube elbow, Tailrace free discharge
  };
  governorActuationTimeSeconds: { opening: number; closing: number; emergencyClosing: number };
}

// ============================================================================
// 5. OPERATIONAL LIFECYCLE STATES & SEQUENCES
// ============================================================================

export type HydroUnitOperatingState =
  | 'out_of_service'    // Completely isolated physically and electrically
  | 'available'         // Auxiliaries healthy, permissives satisfied, standing by
  | 'starting'          // Wicket gates cracking, acceleration under governor control
  | 'synchronizing'     // Target 50Hz, voltage matching, ANSI 25 synchrocheck active
  | 'connected'         // GCB closed, zero megawatt float on bus
  | 'loaded'            // Active power exporting to grid per dispatch target
  | 'unloading'         // Governor ramping down load smoothly
  | 'shutdown'          // GCB opened, field breaker de-energized, gates closed, brakes applied
  | 'stopped'           // Rotor stationary, mechanical brakes latched
  | 'maintenance'       // LOTO applied, scroll case drained, penstock valve closed
  | 'emergency_trip';   // Protection lockout tripped, emergency shutdown sequence executed

export interface StartupSequenceStep {
  stepNumber: number;
  name: { fr: string; en: string };
  subsystem: HydroSubsystemId;
  prerequisites: string[];
  equipmentInvolved: string[];
  controlAction: string;
  expectedDurationSeconds: number;
  safetyInterlocks: string[];
  failureConditions: string[];
}

// ============================================================================
// 6. CAUSAL FAILURE & EVENT PROPAGATION SCENARIOS
// ============================================================================

export interface FailurePropagationStep {
  sequenceIndex: number;
  domainLayer: 'hydraulic' | 'mechanical' | 'electrical' | 'control' | 'protection' | 'auxiliary' | 'balance_of_plant' | 'safety' | 'civil';
  triggerEvent: string;
  physicalManifestation: string;
  instrumentationDetection: string;
  protectionReaction: string;
  resultingPlantState: HydroUnitOperatingState;
}

export interface HydroFailureScenario {
  id: string;
  title: { fr: string; en: string };
  rootCause: string;
  affectedSubsystems: HydroSubsystemId[];
  propagationChain: FailurePropagationStep[];
  mitigationGuidelines: { fr: string[]; en: string[] };
  standardsReference: string[];
}

// ============================================================================
// 7. STANDARDIZED HYDRO EQUIPMENT CARD SCHEMA (SECTION 38)
// ============================================================================

export interface HydroEquipmentItem {
  id: string;
  subsystemId: HydroSubsystemId;
  code: string;
  name: { fr: string; en: string };
  category: string;
  definition: { fr: string; en: string };
  engineeringPurpose: { fr: string; en: string };
  operatingPrinciple: { fr: string; en: string };

  // Physical representation
  physical: {
    dimensionsMeters?: { length: number; width: number; height: number; diameter?: number };
    weightTons?: number;
    material: string;
    installationLocation: string; // e.g. "Powerhouse Machine Hall El. 340.50m"
    spatialCoordinates?: string;
  };

  // Technical domain specifications
  hydraulic?: Partial<HydraulicDimension>;
  mechanical?: Partial<MechanicalDimension>;
  electrical?: Partial<ElectricalDimension>;
  control?: Partial<ControlDimension>;
  protection?: Partial<ProtectionDimension>;
  instrumentation?: InstrumentationDimension[];

  // Auxiliary dependencies
  auxiliaryDependencies: {
    coolingRequired: boolean;
    lubricationRequired: boolean;
    acAuxiliaryVoltageV?: number;
    dcControlVoltageV?: number;
    pneumaticPressureBar?: number;
  };

  // Upstream and downstream relationships
  relationships: {
    upstreamEquipmentId?: string;
    downstreamEquipmentId?: string;
    mechanicalCoupledTo?: string;
    hydraulicFeedsTo?: string;
    electricallyConnectsTo?: string;
    controlledBySubsystem?: HydroSubsystemId;
    protectedByRelays?: string[];
  };

  // Standards & Provenance
  applicableStandards: { code: string; title: string; organization: 'IEC' | 'IEEE' | 'ISO' | 'CIGRE' }[];
  lifecycleStage: 'design' | 'commissioned' | 'operating' | 'refurbished';
  provenance: {
    source: string;
    confidence: 'normative_standard' | 'manufacturer_spec' | 'field_benchmark';
  };
}

// ============================================================================
// 8. MASTER HYDROPOWER SUBSYSTEM SUMMARY INTERFACE
// ============================================================================

export interface HydroSubsystemMeta {
  id: HydroSubsystemId;
  cluster: HydroSystemCluster;
  name: { fr: string; en: string };
  shortSummary: { fr: string; en: string };
  primaryFunction: { fr: string; en: string };
  primaryInterfaces: {
    upstream: string;
    downstream: string;
    control: string;
    protection: string;
  };
  keyEquipmentCount: number;
  applicableStandards: string[];
  physicalLocation: string;
  failureRiskLevel: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================================
// 9. STANDARDS ONTOLOGY (SECTION 34)
// ============================================================================

export interface HydroStandardItem {
  id: string;
  code: string;
  title: { fr: string; en: string };
  organization: 'IEC' | 'IEEE' | 'ISO' | 'CIGRE' | 'ICOLD' | 'ASCE';
  editionYear: number;
  scopeSummary: { fr: string; en: string };
  applicableSubsystems: HydroSubsystemId[];
  applicableEquipment: string[];
  requirementType: 'normative_standard' | 'engineering_recommendation' | 'acceptance_test_code' | 'statutory_code';
  lifecycleStage: 'design' | 'factory_testing' | 'commissioning' | 'operation_maintenance';
  mandatoryClauses: { clause: string; title: string; significance: string }[];
}

// ============================================================================
// 10. REFERENCE FLEET & CONCRETE PLANT INSTANCES (SECTIONS 49 & 50)
// ============================================================================

export interface HydroUnitInstance {
  unitId: string;
  unitName: string;
  ratedPowerMW: number;
  ratedApparentPowerMVA: number;
  ratedHeadM: number;
  ratedFlowM3s: number;
  turbineType: HydraulicTurbineType;
  synchronousSpeedRpm: number;
  generatorVoltageKV: number;
  gsuRatioKV: string; // e.g. "11 / 225 kV"
  commissioningYear: number;
  status: 'operational' | 'refurbishment' | 'standby';
}

export interface HydroPlantInstance {
  id: string;
  name: string;
  riverBasin: string;
  region: string;
  classification: HydroPlantClassification;
  installedCapacityMW: number;
  grossHeadM: number;
  totalFlowM3s: number;
  reservoirVolumeMillionM3?: number;
  activeStorageMillionM3?: number;
  annualGenerationGWh: number;
  gridInterconnectionKV: number;
  operator: string;
  commissioningYear: number;
  units: HydroUnitInstance[];
  civilFeatures: {
    damType: string;
    damHeightM: number;
    crestLengthM: number;
    spillwayCapacityM3s: number;
  };
  subsystemsImplemented: HydroSubsystemId[];
  coordinates: { lat: number; lng: number };
  interconnectedCorridor: string;
  keyRoleInNationalGrid: { fr: string; en: string };
}

// ============================================================================
// 11. GRAPH ONTOLOGY & TRAVERSAL ENGINE (SECTIONS 39, 46, 51)
// ============================================================================

export type HydroRelationType =
  | 'converts'
  | 'transfers'
  | 'supplies'
  | 'conveys'
  | 'controls_flow'
  | 'drives'
  | 'couples_to'
  | 'supports'
  | 'lubricates'
  | 'cools'
  | 'energizes'
  | 'transforms'
  | 'switches'
  | 'measures'
  | 'grounds'
  | 'controls'
  | 'protects'
  | 'trips'
  | 'monitors'
  | 'evacuates_to';

export interface HydroGraphNode {
  id: string;
  subsystemId: HydroSubsystemId;
  label: { fr: string; en: string };
  category: 'civil' | 'hydraulic' | 'mechanical' | 'electrical' | 'control' | 'protection' | 'auxiliary';
  domainLayer: string;
  state: string;
  iconName: string;
}

export interface HydroGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: HydroRelationType;
  label: { fr: string; en: string };
  energyDomain: 'hydraulic' | 'mechanical' | 'electrical' | 'control' | 'protection' | 'auxiliary';
}

export interface HydroGraphTraversalResult {
  startNodeId: string;
  direction: 'upstream' | 'downstream' | 'all';
  nodes: HydroGraphNode[];
  edges: HydroGraphEdge[];
  explanation: { fr: string; en: string };
}

