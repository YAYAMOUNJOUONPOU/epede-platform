// src/components/journey/types.ts
// EPEDE - The Journey of Electricity (Le Parcours de l'Électricité)
// Data types & interfaces for the interactive electricity ecosystem

export type StageId = 
  | 'generation'
  | 'switchyard'
  | 'transmission'
  | 'substation'
  | 'distribution'
  | 'consumption';

export type VisualizationLayer = 'conceptual' | 'electrical' | 'physical';
export type ProgressiveLevel = 1 | 2 | 3; // 1: Simple (General Public), 2: Engineering, 3: Detailed Engineering
export type DisclosureLevel = 1 | 2 | 3;

export type SignalType = 'power' | 'measurement' | 'control' | 'protection' | 'communication';

export interface EcosystemEquipment {
  id: string;
  stageId: StageId;
  name: { fr: string; en: string };
  tag: string; // e.g. "G01", "T01-GSU", "CB-225", "RELAY-87G"
  voltageLevel?: string;
  shortDesc: { fr: string; en: string };
  function: { fr: string; en: string };
  whyExists: { fr: string; en: string };
  whereUsed: { fr: string; en: string };
  connectsTo: string[];
  measures?: string[];
  protectedBy?: string[];
  controls?: string[];
  communicatesVia?: string[];
  failureModes: {
    mode: { fr: string; en: string };
    consequence: { fr: string; en: string };
    mitigation: { fr: string; en: string };
  }[];
  maintenance: {
    frequency: { fr: string; en: string };
    action: { fr: string; en: string };
  }[];
  standards: {
    code: string;
    title: string;
    org: 'IEC' | 'IEEE' | 'ISO' | 'CIGRE' | 'NF C';
  }[];
  disciplines: string[];
  levels: {
    level1: { fr: string; en: string }; // Simple
    level2: { fr: string; en: string }; // Engineering
    level3: { fr: string; en: string }; // Detailed Engineering
  };
}

export interface EcosystemStage {
  id: StageId;
  number: number;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  voltageRating: string;
  keyRole: { fr: string; en: string };
  equipmentIds: string[];
  physicalSummary: { fr: string; en: string };
  transformationPrinciple?: { fr: string; en: string };
  lossExplanation?: { fr: string; en: string };
  stepNumber?: number;
  voltageLevel?: string;
  description?: { fr: string; en: string };
  physicsTransformation?: { fr: string; en: string };
  primaryDiscipline?: { fr: string; en: string };
  keyStandards?: string[];
}

export interface EngineeringDiscipline {
  id: string;
  name: { fr: string; en: string };
  icon: string;
  shortDesc: { fr: string; en: string };
  keyDeliverables: { fr: string; en: string }[];
  associatedEquipmentIds: string[];
  standards?: string[];
  tools?: string[];
}

export type FaultScenarioType = 'line' | 'transformer' | 'distribution' | 'household';

export interface FaultScenario {
  id: FaultScenarioType;
  title: { fr: string; en: string };
  location: { fr: string; en: string };
  description: { fr: string; en: string };
  steps: {
    title: { fr: string; en: string };
    detail: { fr: string; en: string };
    activeComponents: string[];
    isFaultActive: boolean;
    isTripActive: boolean;
    isRecloseActive?: boolean;
    status: 'normal' | 'disturbed' | 'tripped' | 'isolated' | 'restored';
  }[];
}

export interface LightningStep {
  stepNumber: number;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  technicalDetail: { fr: string; en: string };
  activeElements: string[];
  phenomenon: 'approach' | 'interception' | 'transient_wave' | 'ground_discharge' | 'arrester_clamping' | 'relay_detection' | 'breaker_trip' | 'auto_reclose';
}

export type GridPeriodId = 'night' | 'morning' | 'day' | 'evening';

export interface GridLoadProfile {
  period: GridPeriodId;
  label: { fr: string; en: string };
  communityLoadKw: number; // for 100 people community (~25 kW base to ~120 kW peak)
  systemFreqHz: number;
  systemVoltageKv: number; // reference 225 kV
  activeGovernorResponse: { fr: string; en: string };
  activeAvrResponse: { fr: string; en: string };
  powerBalance: 'balanced' | 'surplus' | 'deficit';
}
