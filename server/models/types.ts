// server/models/types.ts
// Canonical API Model & Entity Specifications for EPEDE v2.0 Backend

export type VerificationStatus =
  | 'VERIFIED_STANDARD'
  | 'ENGINEERING_REFERENCE'
  | 'FIELD_PRACTICE'
  | 'CONCEPTUAL_MODEL'
  | 'SIMULATION'
  | 'CAMEROON_CONTEXT';

export interface ProvenanceMetadata {
  sourceType: 'INTERNATIONAL_STANDARD' | 'UTILITY_GRID_CODE' | 'FIELD_MANUAL' | 'ENGINEERING_TEXTBOOK' | 'CALCULATION_MODEL';
  sourceReference: string;
  organization?: 'IEC' | 'IEEE' | 'CIGRE' | 'NFPA' | 'SONATREL' | 'ARSEL';
  edition?: string;
  country?: string;
  region?: string;
  lastReviewed: string;
  verificationStatus: VerificationStatus;
}

export interface ApiDomain {
  id: string; // 'D01' - 'D16'
  code: string;
  name: { fr: string; en: string };
  category: 'POWER_CHAIN' | 'ENGINEERING_SYSTEM' | 'CROSS_CUTTING';
  description: { fr: string; en: string };
  sortOrder: number;
  subdomainCount: number;
  equipmentCount: number;
  standardIds: string[];
  keyTechnologies: string[];
  engineeringRoles: string[];
  cameroonContext?: { fr: string; en: string };
}

export interface ApiSubdomain {
  id: string;
  domainId: string;
  code: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  voltageLevel?: 'EHV' | 'HV' | 'MV' | 'LV' | 'DC';
  equipmentIds: string[];
}

export interface ApiEquipment {
  id: string;
  domainId: string;
  subdomainId?: string;
  type: string;
  tag?: string; // IEC 81346 / KKS Tag
  name: { fr: string; en: string };
  voltageNominal?: string;
  powerRating?: string;
  primaryFunction: { fr: string; en: string };
  specifications: Record<string, any>;
  protectionFunctions: string[]; // ANSI codes: '87T', '50/51', '63'
  standards: string[];
  provenance: ProvenanceMetadata;
  representations?: {
    hasPhysicalDiagram: boolean;
    hasElectricalSld: boolean;
    hasFunctionalModel: boolean;
    hasScadaDigitalTwin: boolean;
  };
}

export interface ApiStandard {
  id: string;
  organization: 'IEC' | 'IEEE' | 'CIGRE' | 'NFPA' | 'SONATREL' | 'EN';
  code: string;
  title: { fr: string; en: string };
  scope: { fr: string; en: string };
  keyArticles: string[];
  applicableEquipmentTypes: string[];
}

export interface ApiRelationship {
  id: string;
  sourceId: string;
  sourceType: 'EQUIPMENT' | 'SYSTEM' | 'DOMAIN' | 'SUBSTATION_BAY';
  targetId: string;
  targetType: 'EQUIPMENT' | 'SYSTEM' | 'DOMAIN' | 'PROTECTION' | 'STANDARD' | 'ROLE';
  relation:
    | 'SUPPLIES'
    | 'TRANSFORMS'
    | 'PROTECTED_BY'
    | 'MEASURED_BY'
    | 'CONTROLLED_BY'
    | 'GOVERNED_BY'
    | 'GROUNDED_BY'
    | 'COMMUNICATES_THROUGH'
    | 'MAINTAINED_BY';
  description?: { fr: string; en: string };
}

export interface CalculationWorkbenchContract {
  id: string;
  name: { fr: string; en: string };
  category: string;
  description: { fr: string; en: string };
  standards: string[];
  formulaLatex: string;
  assumptions: { fr: string[]; en: string[] };
  inputParameters: Array<{
    key: string;
    label: { fr: string; en: string };
    unit: string;
    defaultValue: number;
    min?: number;
    max?: number;
    step?: number;
    description: { fr: string; en: string };
  }>;
  status: 'CONCEPTUAL_ENGINEERING_CALCULATION';
  limitations: { fr: string[]; en: string[] };
}

export interface CalculationRunResult {
  workbenchId: string;
  timestamp: string;
  status: 'CONCEPTUAL_ENGINEERING_CALCULATION';
  inputs: Record<string, number>;
  results: Record<string, number | string>;
  engineeringInterpretation: { fr: string; en: string };
  limitations: { fr: string[]; en: string[] };
  applicableStandards: string[];
  verificationNotice: { fr: string; en: string };
}

export interface SearchFacetItem {
  id: string;
  type: 'DOMAIN' | 'EQUIPMENT' | 'STANDARD' | 'PROTECTION' | 'CALCULATOR' | 'GRID_NODE';
  title: string;
  subtitle: string;
  domainCode?: string;
  voltage?: string;
  route: string;
  relevanceScore: number;
}
