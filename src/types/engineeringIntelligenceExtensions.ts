// src/types/engineeringIntelligenceExtensions.ts
// EPEDE - Unified Master Types for Professional Intelligence, Context Traceability & Decision Support

export type EngineeringEntityType =
  | 'domain'
  | 'system'
  | 'equipment'
  | 'protection'
  | 'substation_bay'
  | 'transformer'
  | 'feeder'
  | 'node';

export interface EngineeringContextTrailItem {
  id: string;
  name_fr: string;
  name_en: string;
  entityType: EngineeringEntityType;
  domainCode: string;
  voltage?: string;
  tag?: string;
  routeTarget?: {
    view: string;
    domainCode?: string;
    equipmentId?: string;
    nodeId?: string;
  };
  timestamp: number;
}

export interface SavedEngineeringPath {
  id: string;
  name: string;
  notes?: string;
  createdAt: number;
  items: EngineeringContextTrailItem[];
}

// -----------------------------------------------------------------------------
// 2. THE 10-TIER EVIDENCE, TRUST & VERIFICATION SYSTEM
// -----------------------------------------------------------------------------
export type EvidenceTrustLevel =
  | 'VERIFIED_STANDARD'       // Directly tied to verified standard/reference
  | 'ENGINEERING_REFERENCE'    // Accepted technical engineering reference
  | 'FIELD_PRACTICE'           // Typical practical field engineering approach
  | 'CONCEPTUAL_MODEL'         // Simplified educational representation
  | 'SIMULATION_DATA'          // Generated/modeled illustrative data
  | 'CAMEROON_CONTEXT'         // Regional/national reference context
  | 'MANUFACTURER_SPECIFIC'    // Applies to a particular product or supplier
  | 'APPLICATION_DEPENDENT'    // Requires project-specific engineering
  | 'SOURCE_GAP'               // Reliable source is missing
  | 'REQUIRES_VALIDATION';     // Content needs technical engineering review

export interface EvidenceTrustBadgeConfig {
  level: EvidenceTrustLevel;
  label_fr: string;
  label_en: string;
  short_fr: string;
  short_en: string;
  description_fr: string;
  description_en: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconName: string;
}

// -----------------------------------------------------------------------------
// 3. WHY THIS MATTERS & ENGINEERING DECISION POINTS
// -----------------------------------------------------------------------------
export interface WhyThisMattersItem {
  headline: { fr: string; en: string };
  impactAreas: Array<{
    area: 'fault_current' | 'voltage_regulation' | 'protection_coordination' | 'earthing' | 'reliability' | 'maintenance' | 'safety' | 'cost' | 'environmental';
    label: { fr: string; en: string };
    consequence: { fr: string; en: string };
  }>;
}

export interface EngineeringDecisionPointItem {
  index: number;
  decisionName: { fr: string; en: string };
  description: { fr: string; en: string };
  optionsConsidered: Array<{
    optionLabel: string;
    tradeoffs: { fr: string; en: string };
  }>;
  governingStandardOrCriteria?: string;
}

// -----------------------------------------------------------------------------
// 4. ASSUMPTIONS & LIMITATIONS
// -----------------------------------------------------------------------------
export interface TechnicalAssumptionsManifest {
  scopeAssumption: { fr: string; en: string };
  modelLimitations: Array<{ fr: string; en: string }>;
  cameroonContextNotice?: { fr: string; en: string };
  liabilityDisclaimer: { fr: string; en: string };
}

// -----------------------------------------------------------------------------
// 5. ROLE-BASED EXPLORATION MODES
// -----------------------------------------------------------------------------
export type EngineeringRoleFilter =
  | 'ALL'
  | 'PROTECTION'
  | 'MAINTENANCE'
  | 'COMMISSIONING'
  | 'BUILDING_ELECTRICAL'
  | 'OPERATOR';

export interface RoleFilterConfig {
  role: EngineeringRoleFilter;
  label_fr: string;
  label_en: string;
  icon: string;
  color: string;
  highlightedDisciplines: string[];
}
