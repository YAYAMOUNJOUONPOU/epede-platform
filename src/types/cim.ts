// src/types/cim.ts
// IEC 61970 & IEC 61968 Common Information Model (CIM) & Graph Semantic Types

export type CimEquipmentType =
  | 'SynchronousMachine'
  | 'PowerTransformer'
  | 'ACLineSegment'
  | 'Breaker'
  | 'Disconnector'
  | 'BusbarSection'
  | 'EnergyConsumer'
  | 'ShuntCompensator'
  | 'SolarGeneratingUnit'
  | 'HydroGeneratingUnit'
  | 'CurrentTransformer'
  | 'VoltageTransformer'
  | 'ProtectionRelay';

export type VoltageLevelCim = '400kV' | '225kV' | '90kV' | '30kV' | '15kV' | '400V';

export interface CimTerminal {
  id: string;
  name: string;
  sequenceNumber: number;
  conductingEquipmentId: string;
  connectivityNodeId: string;
  connected: boolean;
}

export interface CimConnectivityNode {
  id: string;
  name: string;
  topologicalNodeId: string;
  substationId: string;
  voltageLevel: VoltageLevelCim;
  nominalVoltageKv: number;
  description_fr: string;
  description_en: string;
}

export interface CimConductingEquipment {
  id: string;
  name: string;
  cimType: CimEquipmentType;
  substationId: string;
  voltageLevel: VoltageLevelCim;
  ratedMva?: number;
  ratedAmps?: number;
  nominalVoltageKv: number;
  resistanceOhm?: number;
  reactanceOhm?: number;
  status: 'CLOSED' | 'OPEN' | 'IN_SERVICE' | 'OUT_OF_SERVICE' | 'TRIPPED';
  isEnergized: boolean;
  terminals: CimTerminal[];
  // Graph coordinates for topological representation
  x: number;
  y: number;
  // Semantic relationships
  protectingRelayIds?: string[];
  associatedStandards: string[]; // e.g. ["IEC 60076", "IEC 62271-100"]
  failureModes_fr: string[];
  failureModes_en: string[];
  aasAssetId?: string;
  description_fr: string;
  description_en: string;
}

export interface CimSubstation {
  id: string;
  name: string;
  code: string;
  region: string;
  voltageLevels: VoltageLevelCim[];
  gridRole_fr: string;
  gridRole_en: string;
}

export interface CimGraphEdge {
  id: string;
  sourceEquipmentId: string;
  targetEquipmentId: string;
  connectivityNodeId: string;
  lengthKm?: number;
  impedanceZ?: number; // Ohms
  activePowerFlowMw: number;
  reactivePowerFlowMvar: number;
  capacityLimitMw: number;
  isEnergized: boolean;
  isOverloaded: boolean;
}

export interface SemanticGraphNode {
  id: string;
  label_fr: string;
  label_en: string;
  nodeType: 'EQUIPMENT' | 'STANDARD' | 'FAILURE_MODE' | 'PROTECTION_FUNCTION' | 'SUBSTATION' | 'AAS_SUBMODEL';
  category: string;
  referenceId?: string;
  x: number;
  y: number;
}

export interface SemanticGraphLink {
  sourceId: string;
  targetId: string;
  relationType: 'STANDARDIZED_BY' | 'PROTECTED_BY' | 'SUBJECT_TO_FAILURE' | 'LOCATED_IN' | 'HAS_AAS_SUBMODEL' | 'ELECTRICALLY_FEEDS';
  label_fr: string;
  label_en: string;
}

export interface IsolationSolution {
  targetEquipmentId: string;
  targetName: string;
  minimalIsolationBreakers: string[]; // IDs of breakers/disconnectors
  deEnergizedEquipments: string[];
  retainedHealthyLoadsMw: number;
  shedLoadsMw: number;
  switchingSequence_fr: string[];
  switchingSequence_en: string[];
}

export interface ContingencyN1Result {
  trippedElementId: string;
  trippedElementName: string;
  impactSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NEGLIGIBLE';
  overloadedBranches: { edgeId: string; branchName: string; loadingPercent: number; limitMw: number; newFlowMw: number }[];
  voltageViolations: { nodeId: string; nodeName: string; busVoltageKv: number; deviationPercent: number }[];
  islandedNodes: string[];
  lossOfGenerationMw: number;
  lossOfLoadMw: number;
  remedialActions_fr: string[];
  remedialActions_en: string[];
}
