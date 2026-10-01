// src/components/production/types.ts
// Data structures for the Energy Production engineering environment

export type ProductionMainSection = 
  | 'overview'
  | 'sources'
  | 'energy_balance'
  | 'electrical_conversion'
  | 'technologies'
  | 'parameters'
  | 'auxiliaries';

export type GenerationTechnologyId = 
  | 'hydro' 
  | 'thermal' 
  | 'solar' 
  | 'wind' 
  | 'biomass';

export interface EnergyFlowDefinition {
  inflow: string;
  outflow: string;
  lossMechanism: string;
  efficiencyTypical: string;
}

export interface OperatingStatesDefinition {
  normal: string;
  starting: string;
  running: string;
  stopping: string;
  fault: string;
  maintenance: string;
  isolated: string;
}

export interface EngineeringParameterItem {
  label: string;
  symbol?: string;
  typicalValue: string;
  unit: string;
  significance: string;
  formula?: string;
}

export interface ProductionEquipment {
  id: string;
  name: string;
  nameEn: string;
  tag: string;
  category: 'hydraulic' | 'mechanical' | 'electromagnetic' | 'power_electronics' | 'switchgear' | 'transformer' | 'control_protection' | 'auxiliary';
  subsystem: string;
  iconName: string;
  
  // 1. Definition
  definition: string;
  
  // 2. Purpose & Function
  purpose: string;
  
  // 3. Operating Principle
  operatingPrinciple: string;
  
  // 4. Physical Construction
  physicalConstruction: string;
  
  // 5. Main Components
  mainComponents: string[];
  
  // 6. Energy Flow
  energyFlow: EnergyFlowDefinition;
  
  // 7. Electrical Role
  electricalRole: string;
  
  // 8. Mechanical Role
  mechanicalRole: string;
  
  // 9. Control
  control: string;
  
  // 10. Instrumentation
  instrumentation: string[];
  
  // 11. Protection
  protection: {
    ansiCodes?: string[];
    description: string;
    tripActions: string;
  };
  
  // 12. Auxiliary Systems
  auxiliarySystems: string[];
  
  // 13. Operating States
  operatingStates: OperatingStatesDefinition;
  
  // 14. Typical Failure Modes
  failureModes: string[];
  
  // 15. Safety Considerations
  safetyConsiderations: string[];
  
  // 16. Maintenance
  maintenance: string[];
  
  // 17. Engineering Parameters
  parameters: EngineeringParameterItem[];
  
  // 18. Applicable Standards / Norms
  standards: string[];
  
  // 19. Relationships With Other Equipment
  upstreamEquipment: string[];
  downstreamEquipment: string[];
  
  // 20-22. Representations
  physicalRepresentation: string;
  electricalRepresentation: string;
  functionalRepresentation: string;
  
  // 23. Subsystems / Components drill-down IDs
  drillDownIds?: string[];
  parentEquipmentId?: string;
}

export interface ProcessStageNode {
  id: string;
  stepNumber: number;
  labelFr: string;
  labelEn: string;
  subtitleFr: string;
  subtitleEn: string;
  energyStateFr: string;
  energyStateEn: string;
  voltageLevel?: string;
  equipmentId: string;
  iconName: string;
  color: string;
}

export interface ProtectionFunctionDetail {
  ansiCode: string;
  nameFr: string;
  nameEn: string;
  whatItProtects: string;
  abnormalCondition: string;
  detectionMethod: string;
  actionOccurs: string;
  equipmentAffected: string;
  standard: string;
}

export interface HydropowerPlantType {
  id: string;
  nameFr: string;
  nameEn: string;
  taglineFr: string;
  taglineEn: string;
  howItWorks: string;
  mainInfrastructure: string[];
  waterPath: string;
  mainEquipment: string[];
  energyConversion: string;
  typicalConfig: string;
  advantages: string[];
  limitations: string[];
  operatingCharacteristics: string;
  typicalApplications: string;
  cameroonBenchmark?: string;
  schematicType: 'river' | 'reservoir' | 'diversion' | 'pumped' | 'underground' | 'cascade' | 'multipurpose';
}

export interface TurbineTechnology {
  id: string;
  name: string;
  category: 'impulse' | 'reaction';
  headRange: string;
  flowRange: string;
  specificSpeed: string;
  efficiencyPeak: string;
  waterEntry: string;
  waterPath: string;
  mainComponents: string[];
  runnerDescription: string;
  guideVanesDescription: string;
  shaftAndCasing: string;
  draftTubeDescription: string;
  mechanicalPowerProduction: string;
  controlMechanism: string;
  typicalCharacteristics: string;
  appropriateContext: string;
  keyEquation: string;
  benchmarkPlant: string;
}
