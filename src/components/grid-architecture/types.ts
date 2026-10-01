// src/components/grid-architecture/types.ts
// EPEDE - Power-System Architecture & Grid Planning (D02)
// Data types and interfaces for system-level electrical grid engineering

export type GridViewMode = 
  | 'master_journey'
  | 'substation_sld'
  | 'voltage_physics'
  | 'grid_topologies'
  | 'planning_lab';

export type RepresentationView = 'physical' | 'electrical' | 'functional';

export type JourneyDirection = 'forward' | 'reverse';

export type ElectricalState = 
  | 'energized' 
  | 'de_energized' 
  | 'connected' 
  | 'disconnected' 
  | 'isolated' 
  | 'earthed' 
  | 'faulted';

export interface MasterJourneyStage {
  id: string;
  order: number;
  code: string;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  category: 'generation' | 'transmission' | 'substation' | 'distribution' | 'utilization';
  voltageRange: string;
  voltageBand: 'EHV' | 'HV' | 'MV' | 'LV';
  primaryEquipment: string;
  equipmentId?: string;
  upstreamStageId?: string;
  downstreamStageId?: string;
  whyExists: { fr: string; en: string };
  energyTransformation: { fr: string; en: string };
  lossMechanism: { fr: string; en: string };
  
  // 3 Synchronized Perspectives
  physicalView: {
    description: { fr: string; en: string };
    keyAssets: string[];
    typicalFootprint: string;
    environment: { fr: string; en: string };
  };
  electricalView: {
    sldSymbol: string;
    description: { fr: string; en: string };
    nominalParameters: { fr: string; en: string };
    connectionMode: string;
  };
  functionalView: {
    protectionFunctions: string[]; // e.g. ["87G", "50/51", "21"]
    controlAutomation: { fr: string; en: string };
    instrumentation: string[];
    auxiliaryDependency: { fr: string; en: string };
  };
  
  applicableStandards: string[];
  engineeringRole: { fr: string; en: string };
  cameroonReference?: {
    location: string;
    description: { fr: string; en: string };
  };
}

export interface VoltageBandInfo {
  id?: string;
  band: 'EHV' | 'HV' | 'MV' | 'LV';
  name: { fr: string; en: string };
  nominalRange: string;
  representativeLevels: string[];
  cameroonGridLevels: string[];
  purpose: { fr: string; en: string };
  whyUsed: { fr: string; en: string };
  insulationDistanceAir: string; // e.g. "2200 mm phase-phase"
  typicalEarthing: { fr: string; en: string };
  advantages: { fr: string[]; en: string[] };
  limitations: { fr: string[]; en: string[] };
  protectionPhilosophy: { fr: string; en: string };
  keyEquipment: string[];
  upstreamRelationship: { fr: string; en: string };
  downstreamRelationship: { fr: string; en: string };
}

export interface SubstationSwitchingElement {
  id: string;
  bayId: 'line_bay' | 'trafo_bay' | 'bus_coupler' | 'mv_feeder';
  tag: string;
  type: 'breaker' | 'disconnector' | 'earth_switch' | 'transformer' | 'instrument_transformer' | 'surge_arrester';
  name: { fr: string; en: string };
  isOpen: boolean;
  isEarthed: boolean;
  isEnergized: boolean;
  interlockDependencies: string[]; // IDs of equipment that restrict operation
  interlockRuleFr: string;
  interlockRuleEn: string;
  ratedVoltage: string;
  ratedCurrent: string;
  breakingCapacity?: string;
  secondaryLink: {
    protectionRelay: string;
    scadaPoint: string;
    dcSupply: string;
  };
}

export interface SubstationBay {
  id: string;
  name: { fr: string; en: string };
  type: 'incoming_line' | 'power_transformer' | 'bus_coupler' | 'outgoing_mv';
  elements: SubstationSwitchingElement[];
  description: { fr: string; en: string };
}

export interface NetworkTopologyModel {
  id: 'radial' | 'open_ring' | 'meshed' | 'interconnected';
  name: { fr: string; en: string };
  typicalApplication: { fr: string; en: string };
  schematicSummary: { fr: string; en: string };
  investmentCost: 'Faible' | 'Modéré' | 'Élevé' | 'Très Élevé';
  operationalComplexity: 'Simple' | 'Moyenne' | 'Élevée' | 'Avancée';
  reliabilityRating: 'Basique (N-0)' | 'Bonne (N-1 reconfigurable)' | 'Excellente (N-1 sans coupure)' | 'Maximale (N-1 / N-2)';
  saidiImpact: { fr: string; en: string };
  saifiImpact: { fr: string; en: string };
  faultSequence: { fr: string[]; en: string[] };
  advantages: { fr: string[]; en: string[] };
  disadvantages: { fr: string[]; en: string[] };
  cameroonExample: { fr: string; en: string };
}

export interface GridPlanningScenario {
  id: string;
  title: { fr: string; en: string };
  horizonYears: string;
  objective: { fr: string; en: string };
  baselineState: {
    demandMw: number;
    generationMw: number;
    criticalLineLoadingPct: number;
    voltageLowestKv: number;
  };
  intervention: {
    type: 'generation_addition' | 'transmission_line' | 'reactive_compensation' | 'contingency_n1';
    title: { fr: string; en: string };
    specs: { fr: string; en: string };
  };
  postInterventionState: {
    demandMw: number;
    generationMw: number;
    criticalLineLoadingPct: number;
    voltageLowestKv: number;
    n1Compliant: boolean;
    benefitExplanation: { fr: string; en: string };
  };
  technicalNotes: { fr: string; en: string };
}
