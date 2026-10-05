// src/types/equipmentExplorer.ts
// EPEDE - Electrical Equipment Explorer Canonical Schema
// Implements the canonical 37-dimension engineering knowledge model

import type { DomainCode, VoltageLevel, EarthingRegime, Provenance, VerificationStatus } from './epede';

export type EquipmentCategory =
  | 'GENERATION'
  | 'TRANSMISSION'
  | 'SUBSTATION'
  | 'TRANSFORMER'
  | 'PROTECTION_AND_RELAYS'
  | 'SWITCHGEAR'
  | 'MV_DISTRIBUTION'
  | 'LV_DISTRIBUTION'
  | 'MEASUREMENT_AND_MONITORING'
  | 'AUXILIARY_AND_SAFETY'
  | 'MODERN_EQUIPMENT';

export type EquipmentFamily =
  | 'GeneratorEquipment'
  | 'TurbineEquipment'
  | 'TransformerEquipment'
  | 'CircuitBreakerEquipment'
  | 'DisconnectorEquipment'
  | 'EarthingSwitchEquipment'
  | 'BusbarEquipment'
  | 'CTEquipment'
  | 'VTEquipment'
  | 'CVTEquipment'
  | 'SurgeArresterEquipment'
  | 'OverheadLineEquipment'
  | 'CableEquipment'
  | 'RelayEquipment'
  | 'SwitchgearEquipment'
  | 'RMUEquipment'
  | 'RecloserEquipment'
  | 'DistributionBoardEquipment'
  | 'TGBTEquipment'
  | 'MotorEquipment'
  | 'VFDEquipment'
  | 'UPSSystemEquipment'
  | 'ATSEquipment'
  | 'MeteringEquipment'
  | 'InverterEquipment'
  | 'BatteryEquipment'
  | 'EVSEEquipment'
  | 'LightingEquipment'
  | 'FinalLoadEquipment';

export type SystemStage =
  | 'ENERGY_SOURCE'
  | 'GENERATION'
  | 'HV_EHV_TRANSMISSION'
  | 'SUBSTATIONS_NODES'
  | 'MV_DISTRIBUTION'
  | 'LV_DISTRIBUTION'
  | 'FINAL_CIRCUITS_LOADS';

export type RepresentationViewMode = 'PHYSICAL' | 'ELECTRICAL' | 'FUNCTIONAL';

export type CanonicalOperatingState =
  | 'ENERGIZED'
  | 'DE_ENERGIZED'
  | 'OPEN'
  | 'CLOSED'
  | 'TRIPPED'
  | 'ISOLATED'
  | 'EARTHED'
  | 'UNDER_MAINTENANCE'
  | 'FAULTED'
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'LOCAL_CONTROL'
  | 'REMOTE_CONTROL'
  | 'LOCKED_OUT'
  | 'INTERLOCKED';

export type EquipmentRelationKind =
  | 'UPSTREAM_OF'
  | 'DOWNSTREAM_OF'
  | 'PROTECTS'
  | 'PROTECTED_BY'
  | 'MEASURES'
  | 'MEASURED_BY'
  | 'CONTROLS'
  | 'CONTROLLED_BY'
  | 'COMMUNICATES_WITH'
  | 'GROUNDS'
  | 'GROUNDED_BY'
  | 'SUPPLIES'
  | 'SUPPLIED_BY'
  | 'SWITCHES'
  | 'TRANSFORMS'
  | 'CONVERTS'
  | 'MONITORS'
  | 'COOLS'
  | 'DRIVES'
  | 'ISOLATES'
  | 'INTERRUPTS'
  | 'REGULATES'
  | 'COMPENSATES'
  | 'INTERLOCKED_WITH'
  | 'MAINTAINED_BY'
  | 'TESTED_BY'
  | 'GOVERNED_BY'
  | 'PART_OF'
  | 'CONTAINS';

export interface EquipmentRelationship {
  id: string;
  targetEquipmentId: string;
  targetName: { fr: string; en: string };
  targetCategory: EquipmentCategory;
  relationKind: EquipmentRelationKind;
  description: { fr: string; en: string };
}

export interface WorkingPrincipleStep {
  stepNumber: number;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  physicalPhenomenon: { fr: string; en: string };
  keyVariable?: string;
}

export interface EquipmentComponentPart {
  id: string;
  name: { fr: string; en: string };
  function: { fr: string; en: string };
  materialOrTechnology?: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STANDARD';
}

export interface EngineeringParameterItem {
  key: string;
  label: { fr: string; en: string };
  value: string | number;
  unit?: string;
  status: 'VERIFIED' | 'REPRESENTATIVE' | 'APPLICATION_DEPENDENT' | 'MANUFACTURER_SPECIFIC';
  notes?: { fr: string; en: string };
}

export interface FailureModeItem {
  code: string;
  name: { fr: string; en: string };
  rootCause: { fr: string; en: string };
  consequenceOnSystem: { fr: string; en: string };
  protectiveResponse: { fr: string; en: string };
  severity: 'CATASTROPHIC' | 'CRITICAL' | 'MAJOR' | 'MINOR';
}

export interface MaintenanceTaskItem {
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'CONDITION_BASED' | 'TESTING_COMMISSIONING';
  periodicity: string;
  description: { fr: string; en: string };
  toolsAndStandards: string[];
}

export interface LifecyclePhaseItem {
  phase:
    | 'CONCEPT_SPECIFICATION'
    | 'DESIGN_STUDIES'
    | 'FACTORY_TESTING'
    | 'SITE_INSTALLATION'
    | 'COMMISSIONING'
    | 'OPERATION_MONITORING'
    | 'MAINTENANCE_OVERHAUL'
    | 'DECOMMISSIONING';
  deliverables: string[];
  involvedRoles: string[];
}

export interface StandardReferenceLink {
  standardCode: string;
  title: string;
  relevantClauses: string[];
  jurisdiction: string;
  notes?: string;
}

export interface PhotographicAsset {
  id: string;
  caption: { fr: string; en: string };
  viewType: 'FIELD_INSTALLATION' | 'NAMEPLATE' | 'INTERNAL_CUTAWAY' | 'TERMINAL_BUSHINGS' | 'CONTROL_CUBICLE' | 'MAINTENANCE_OVERHAUL';
  imageUrl: string;
  creditOrReference: string;
  sourceOrganization?: string;
  sourceUrl?: string;
  licenseStatus?: string;
  attributionRequirement?: string;
  photographerOrCopyright?: string;
  captureDate?: string;
  identificationConfidence?: 'DEFINITIVE_MATCH' | 'REPRESENTATIVE_TYPE' | 'CONCEPTUAL_EQUIVALENT';
  technicalReviewStatus?: 'APPROVED_BY_LEAD_ENGINEER' | 'PROVISIONAL' | 'REQUIRES_FIELD_PHOTO';
  locationContext?: { fr: string; en: string };
  disclaimer?: { fr: string; en: string };
  calloutAnnotations?: {
    x: number; // percent
    y: number; // percent
    label: { fr: string; en: string };
    detail: { fr: string; en: string };
  }[];
}

// -------------------------------------------------------------
// CANONICAL 37-DIMENSION EQUIPMENT OBJECT
// -------------------------------------------------------------
export interface CanonicalEquipmentObject {
  // 01 - Identity
  id: string;
  tagIec?: string; // e.g. ==E1.QA1 / --T01
  name: { fr: string; en: string };
  commonName?: { fr: string; en: string };
  technicalName?: { fr: string; en: string };
  aliases: { fr: string[]; en: string[] };
  equipmentType: string;
  family?: EquipmentFamily;
  category: EquipmentCategory;
  parentDomain: DomainCode;
  systemStage: SystemStage;
  subsystemContext: { fr: string; en: string };
  technologyContext: { fr: string; en: string };
  applicationContext: { fr: string; en: string };
  voltageContext: {
    nominalVoltage: string;
    level: VoltageLevel;
    frequencyHz: number;
    phases: string;
  };
  typicalLocation: { fr: string; en: string };
  verificationStatus: VerificationStatus;
  summary?: { fr: string; en: string };
  technicalSpecs?: Record<string, string | number>;
  cameroonContext?: {
    installedLocation?: string;
    substationName?: string;
    feederName?: string;
    operationalUtility?: string;
    fieldNotes?: { fr: string; en: string };
    substationsDeployed?: string[];
    localChallenges?: { fr: string; en: string };
    adaptationMeasures?: { fr: string; en: string };
  };

  // Real-world photography & technical imagery
  photographicGallery?: PhotographicAsset[];

  // 02 & 03 - What Is It & Why Is It Needed
  definition: { fr: string; en: string };
  purpose: { fr: string; en: string };
  engineeringProblemSolved: { fr: string; en: string };
  whyItExists?: { fr: string; en: string };

  // 04 & 05 - Function & Operating Principle
  primaryFunction: { fr: string; en: string };
  primaryEngineeringRole?: { fr: string; en: string };
  secondaryFunctions: { fr: string[]; en: string[] };
  operatingPrincipleSummary: { fr: string; en: string };
  workingPrincipleSequence?: WorkingPrincipleStep[];
  workingPrinciple?: WorkingPrincipleStep[];

  // 06 & 07 - Physical Construction & Components
  physicalConstruction: {
    enclosureType: string; // e.g., Outdoor AIS open yard, SF6 GIS metal-clad, IP54 steel cabinet
    dimensionsApproxMeters?: string;
    weightApproxKg?: string | number;
    mounting: { fr: string; en: string };
    environmentalClearances: { fr: string; en: string };
  };
  mainComponents: EquipmentComponentPart[];

  // 08, 09, 10, 11 - Energy/Signal Flow & Roles
  energyOrSignalFlow: { fr: string; en: string };
  electricalRole: { fr: string; en: string };
  mechanicalRole?: { fr: string; en: string };
  thermalRole?: { fr: string; en: string };

  // 12, 13, 14 - System Context & Graph Connections
  systemContextDescription: { fr: string; en: string };
  upstreamEquipmentIds: string[];
  downstreamEquipmentIds: string[];
  relationships: EquipmentRelationship[];

  // 15, 16, 17, 18, 19 - Associated Disciplines
  associatedProtection: {
    ansiCodes: string[];
    protectiveRelayIds: string[];
    summary: { fr: string; en: string };
  };
  measurementAndInstrumentation: {
    sensors: string[];
    instrumentTransformerIds: string[];
    measuredQuantities: string[];
  };
  controlAndAutomation: {
    localControls: { fr: string; en: string };
    remoteControls: { fr: string; en: string };
    interlocks: { fr: string; en: string };
  };
  communicationProtocols: string[];

  // 20, 21, 22, 23 - Earthing, Insulation & Environment
  earthingAndBonding: {
    earthingRegime: EarthingRegime;
    connectionMethod: { fr: string; en: string };
    dischargeCapability: { fr: string; en: string };
  };
  insulationAndClearances: {
    insulationMedium: string; // Oil, SF6, Vacuum, Air, Epoxy resin, XLPE
    bilRatingKv?: number;
    creepageDistanceMmPerKv?: number;
    phaseClearanceMeters?: string;
  };
  connectionRequirements: {
    electrical: { fr: string; en: string };
    mechanical: { fr: string; en: string };
    cableOrBusbar: { fr: string; en: string };
    earthing: { fr: string; en: string };
  };
  installationEnvironment: {
    ambientTemperatureRange: string;
    altitudeLimitM: number;
    pollutionLevel: string; // e.g. IEC 60815 Class d (Heavy)
    indoorOutdoor: 'INDOOR' | 'OUTDOOR' | 'PAD_MOUNTED' | 'UNDERGROUND';
  };

  // 24 - Key Engineering Parameters
  keyEngineeringValues: EngineeringParameterItem[];

  // 25 - Operating States
  availableStates: CanonicalOperatingState[];
  defaultState: CanonicalOperatingState;

  // 26, 27, 28 - Failure Modes, Effects & Safety
  failureModes: FailureModeItem[];
  effectsOfFailureSummary: { fr: string; en: string };
  safetyAndHazards: {
    isSafetyCritical: boolean;
    hazards: string[];
    isolationProcedureLoto: { fr: string; en: string };
    ppeRequirements: string[];
  };

  // 29 & 30 - Maintenance, Testing & Commissioning
  maintenancePlan: MaintenanceTaskItem[];
  testingAndCommissioning: {
    factoryTestsFat: string[];
    siteAcceptanceTestsSat: string[];
    commissioningProcedures: string[];
  };

  // 31, 32, 33 - Standards, Roles & Lifecycle
  applicableStandards: StandardReferenceLink[];
  associatedEngineeringRoles: {
    roleSlug: string;
    title: { fr: string; en: string };
    tasks: { fr: string; en: string };
  }[];
  lifecyclePhases: LifecyclePhaseItem[];

  // 34, 35, 36, 37 - Governance, Provenance, Limitations
  deliverablesAndDocuments: string[];
  provenance: Provenance;
  assumptionsAndLimitations: { fr: string; en: string };

  // Triple Representation SVG/Layout Data
  representations: {
    physical: {
      svgVariant: 'GENERATOR' | 'TRANSFORMER' | 'BREAKER' | 'DISCONNECTOR' | 'TOWER' | 'CABLE' | 'SWITCHGEAR' | 'PANEL' | 'ARRESTER' | 'CT_VT' | 'LOAD_MOTOR' | 'SOLAR_INV' | 'BESS';
      dimensionsLabel: string;
      enclosureLabel: string;
      maintenanceClearance: string;
    };
    electrical: {
      symbolType: string;
      incomerTerminal: string;
      outgoingTerminal: string;
      protectionZone: string;
      measurementTap: string;
    };
    functional: {
      inputSignal: string;
      conversionProcess: string;
      outputSignal: string;
      feedbackLoop: string;
    };
  };
  [key: string]: any;
}
