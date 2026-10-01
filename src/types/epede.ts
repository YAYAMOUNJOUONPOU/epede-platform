// src/types/epede.ts
// Generated from EPEDE Architecture v1.1

export type DomainCode =
  | 'D01' | 'D02' | 'D03' | 'D04' | 'D05' | 'D06'
  | 'D07' | 'D08' | 'D09' | 'D10' | 'D11' | 'D12'
  | 'D13' | 'D14' | 'D15' | 'D16';

export type LayerCode = 'L01' | 'L02' | 'L03' | 'L04' | 'L05' | 'L06';

export type DomainGroup = 'chain' | 'discipline';

export type VoltageLevel = 'EHV' | 'HV' | 'MV' | 'LV' | 'DC';

export type HazardLevel =
  | 'none'
  | 'arc_flash'
  | 'thermal_runaway'
  | 'high_voltage'
  | 'low_voltage'
  | 'fire_risk';

export type RelationType =
  | 'feeds'
  | 'protects'
  | 'measures'
  | 'controls'
  | 'supervises'
  | 'communicates_with'
  | 'monitors'
  | 'part_of'
  | 'documented_by'
  | 'located_at'
  | 'requires_fire_suppression'
  | 'enables'
  | 'implemented_by'
  | 'governed_by'
  | 'performed_by'
  // Canonical 14 Formal Relationships
  | 'contains'
  | 'supplies'
  | 'connects_to'
  | 'transforms'
  | 'communicates_through'
  | 'used_during'
  | 'produces'
  | 'maintained_by'
  | 'applies_in';

// Canonical 22 Object Types
export type CanonicalEntityType =
  | 'domain'
  | 'technology'
  | 'plant'
  | 'system'
  | 'subsystem'
  | 'equipment'
  | 'component'
  | 'function'
  | 'protection_function'
  | 'control_function'
  | 'substation_bay'
  | 'measurement_point'
  | 'telecom_system'
  | 'standard'
  | 'role'
  | 'task'
  | 'deliverable'
  | 'project_phase'
  | 'application'
  | 'country'
  | 'failure_mode'
  | 'maintenance_activity'
  | 'document';

// Neutral Grounding Regimes (SLT / Régimes de Neutre)
export type EarthingRegime =
  | 'Solid'      // Solidly grounded (Direct à la terre) - Typical 225 kV
  | 'NGR'        // Neutral Grounding Resistor (Résistance de neutre, e.g. 40A) - Typical 30 kV
  | 'Petersen'   // Resonant coil (Bobine d'extinction / Petersen)
  | 'Isolated'   // Isolated neutral (Neutre isolé)
  | 'TT'         // LV: Distribution neutral to earth, frames to local earth
  | 'TN-C'       // LV: Neutral and Protective conductor combined (PEN)
  | 'TN-S'       // LV: Neutral and Protective conductor separated (PE + N)
  | 'IT';        // LV: Isolated/impedant neutral, frames grounded (Hospitals/Industry)

// Substation AC/DC Auxiliary Power Systems (Services Auxiliaires)
export interface AuxiliaryPowerSystem {
  id: string;
  name: string;
  substationId: string;
  acSystem: {
    source: string; // e.g. "30 kV / 400 V TSA 250 kVA"
    backupGenerator: string; // e.g. "Diesel Genset 150 kVA ATS"
    voltageVac: number; // 400
    frequencyHz: number; // 50
  };
  dcSystem: {
    nominalVoltageVdc: 110 | 48 | 24; // 110V for switchgear tripping, 48V for telecom
    batteryType: 'VRLA' | 'Ni-Cd' | 'Lithium-LFP';
    capacityAh: number; // e.g. 200 Ah
    autonomyHours: number; // e.g. 8 hours blackstart autonomy
    redundantChargers: boolean; // N+1 dual rectifier chargers
    unearthAlarmRelay: boolean; // Earth fault monitoring on DC floating bus
  };
}

// Canonical Graph Node for Bidirectional Exploration
export interface CanonicalGraphNode {
  id: string;
  name: { fr: string; en: string };
  entityType: CanonicalEntityType;
  domainCode: DomainCode;
  voltageLevel?: VoltageLevel;
  tag?: string; // IEC 81346 / KKS Tag (e.g. "==E1.Q01", "--QA1")
  description: { fr: string; en: string };
  technicalSpecs: Record<string, string | number | boolean>;
  earthingRegime?: EarthingRegime;
  auxiliarySystem?: AuxiliaryPowerSystem;
  provenance: Provenance;
}

// Canonical Graph Edge
export interface CanonicalGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: RelationType;
  direction: 'out' | 'in' | 'bidirectional';
  description?: { fr: string; en: string };
  standardRef?: string;
}

// Engineering Context Stack Model
export interface EngineeringContextStack {
  selectedNode: CanonicalGraphNode;
  upstreamChain: CanonicalGraphNode[];
  downstreamChain: CanonicalGraphNode[];
  crossDiscipline: {
    protections: CanonicalGraphNode[];
    measurements: CanonicalGraphNode[];
    controls: CanonicalGraphNode[];
    communications: CanonicalGraphNode[];
    standards: CanonicalGraphNode[];
    roles: CanonicalGraphNode[];
    maintenance: CanonicalGraphNode[];
    deliverables: CanonicalGraphNode[];
  };
  earthingContext?: {
    regime: EarthingRegime;
    description: { fr: string; en: string };
    faultCurrentContribution: string;
  };
  auxiliaryContext?: AuxiliaryPowerSystem;
}

export type VerificationStatus =
  | 'generic'
  | 'estimated'
  | 'reference'
  | 'verified';

export type UserRole =
  | 'reader'
  | 'contributor'
  | 'expert'
  | 'editor'
  | 'admin';

export type ContentStatus =
  | 'draft'
  | 'under_review'
  | 'approved'
  | 'published'
  | 'withdrawn';

// Content levels (1-20 from the EPEDE content model)
export type ContentLevel =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export const CONTENT_LEVEL_NAMES: Record<ContentLevel, { fr: string; en: string }> = {
  1:  { fr: "Source d'énergie primaire", en: 'Primary energy source' },
  2:  { fr: 'Principe de conversion', en: 'Conversion principle' },
  3:  { fr: 'Types et variantes', en: 'Types and variants' },
  4:  { fr: 'Systèmes principaux', en: 'Main systems' },
  5:  { fr: 'Équipements principaux', en: 'Main equipment' },
  6:  { fr: 'Architecture électrique', en: 'Electrical architecture' },
  7:  { fr: 'Interconnexions', en: 'Interconnections' },
  8:  { fr: 'Contrôle et automatisation', en: 'Control and automation' },
  9:  { fr: 'Systèmes de protection', en: 'Protection systems' },
  10: { fr: 'Systèmes auxiliaires', en: 'Auxiliary systems' },
  11: { fr: 'Grandeurs physiques', en: 'Physical quantities' },
  12: { fr: 'Formules fondamentales', en: 'Fundamental formulas' },
  13: { fr: 'Normes et standards', en: 'Standards' },
  14: { fr: 'Contraintes et exploitation', en: 'Constraints and operation' },
  15: { fr: "Rôles d'ingénierie", en: 'Engineering roles' },
  16: { fr: 'Compétences et responsabilités', en: 'Skills and responsibilities' },
  17: { fr: 'Parcours académique et carrière', en: 'Academic path and career' },
  18: { fr: 'Exemple international de référence', en: 'International reference example' },
  19: { fr: 'Exemple camerounais', en: 'Cameroon example' },
  20: { fr: 'Relations avec les autres domaines', en: 'Relations to other domains' },
};

// Voltage color mapping (exact values from design system)
export const VOLTAGE_COLORS: Record<VoltageLevel, string> = {
  EHV: '#A78BFA',   // 400 kV — violet
  HV:  '#818CF8',   // 225 kV — indigo
  MV:  '#60A5FA',   // 30 kV  — blue
  LV:  '#FB923C',   // 400 V  — orange
  DC:  '#FBBF24',   // DC     — yellow
};

// Domain color mapping (exact values)
export const DOMAIN_COLORS: Record<DomainCode, string> = {
  D01: '#1E3A5F',
  D02: '#1D4ED8',
  D03: '#374151',
  D04: '#7C3AED',
  D05: '#D97706',
  D06: '#065F46',
  D07: '#4B5563',
  D08: '#374151',
  D09: '#15803D',
  D10: '#1D4ED8',
  D11: '#991B1B',
  D12: '#0D9488',
  D13: '#0E7490',
  D14: '#7C3AED',
  D15: '#065F46',
  D16: '#7F1D1D',
};

export const LAYER_COLORS: Record<LayerCode, string> = {
  L01: '#92400E',
  L02: '#1D4ED8',
  L03: '#374151',
  L04: '#1E3A5F',
  L05: '#065F46',
  L06: '#4B5563',
};

export interface Domain {
  id: string;
  code: DomainCode;
  name_fr: string;
  name_en: string;
  short_fr: string;
  short_en: string;
  description_fr: string | null;
  description_en: string | null;
  icon: string;
  color: string;
  domain_group: DomainGroup;
  sort_order: number;
  chain_position: number | null;
}

export interface Subdomain {
  id: string;
  domain_id: string;
  domain_code: DomainCode;
  code: string;           // 'D01.01'
  name_fr: string;
  name_en: string;
  description_fr: string | null;
  description_en: string | null;
  sort_order: number;
}

export interface Technology {
  id: string;
  subdomain_id: string;
  code: string;           // 'D01.01.HydroRun'
  name_fr: string;
  name_en: string;
  description_fr: string | null;
  description_en: string | null;
  sort_order: number;
}

export interface Layer {
  id: string;
  code: LayerCode;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  icon: string;
  color: string;
  sort_order: number;
}

export interface Equipment {
  id: string;
  domain_id: string;
  domain_code: DomainCode;
  subdomain_id?: string | null;
  technology_id?: string | null;
  entity_type: string;
  name_fr: string;
  name_en: string;
  aliases_fr: string[];
  aliases_en: string[];
  description_fr: string | null;
  description_en: string | null;
  function_fr: string | null;
  function_en: string | null;
  typical_location_fr: string | null;
  typical_location_en: string | null;
  voltage_level: VoltageLevel | null;
  technical: Record<string, string | number | boolean>;
  is_safety_critical: boolean;
  hazard_level: HazardLevel;
  provenance?: Provenance | null;
}

export interface Edge {
  id: string;
  source_id: string;
  source_name: string;
  target_id: string;
  target_name: string;
  source_type: string;
  target_type: string;
  relation: RelationType;
  direction: 'out' | 'in' | 'bidirectional';
  notes_fr: string | null;
  notes_en: string | null;
}

export interface StandardClause {
  clause_number: string;
  title_fr: string;
  title_en: string;
  category: 'routine_test' | 'type_test' | 'special_test' | 'design_rule' | 'safety_rule';
  requirement_fr: string;
  requirement_en: string;
  acceptance_criteria: string;
}

export interface Standard {
  id: string;
  reference: string;       // 'IEC 60034'
  title_fr: string;
  title_en: string;
  scope_fr: string | null;
  scope_en: string | null;
  issuer: string | null;
  edition: string | null;
  status: string;
  jurisdiction: string;
  domain_codes: DomainCode[];
  layer_codes: LayerCode[];
  applicable_equipment: string[];
  used_by_roles: string[];
  clauses?: StandardClause[];
  associated_calculator?: string;
  associated_simulation?: string;
}

export interface Formula {
  id: string;
  domain_id: string;
  domain_code: DomainCode;
  subdomain_id?: string | null;
  expression: string;      // 'P = √3 × U × I × cos(φ)'
  description_fr: string | null;
  description_en: string | null;
  variables: FormulaVariable[];
  standard_ref: string | null;
  applicable_domains: DomainCode[];
}

export interface FormulaVariable {
  symbol: string;
  unit: string;
  desc_fr: string;
  desc_en: string;
}

export interface Role {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  domain_codes: DomainCode[];
  filiere: string;
  responsibilities_fr: string[];
  responsibilities_en: string[];
  typical_tools: string[];
  typical_equipment: string[];
  standards: string[];
  career_path_fr: string[];
  career_path_en: string[];
}

export interface Provenance {
  id: string;
  entity_id: string;
  entity_type: string;
  source_ref: string | null;
  verification_status: VerificationStatus;
  confidence: number;      // 0.5 | 0.7 | 0.85 | 0.95
  verified_by: string | null;
  verified_at: string | null;
  notes?: string | null;
}

export interface SubdomainContent {
  subdomain_code: string;
  concept_fr: string;
  concept_en: string;
  systems_fr: string;
  systems_en: string;
  engineering_fr: string;
  engineering_en: string;
  formulas: Formula[];
  standards: Standard[];
  roles: Role[];
  cameroon_case: {
    title_fr: string;
    title_en: string;
    plant_name: string;
    capacity_mw: string;
    river_or_location: string;
    operators: string;
    voltage_specs: string;
    notes_fr: string;
    notes_en: string;
    status: VerificationStatus;
    source: string;
  };
  international_case: {
    title_fr: string;
    title_en: string;
    location: string;
    capacity_mw: string;
    key_features: string;
  };
}
