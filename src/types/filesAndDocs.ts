// src/types/filesAndDocs.ts
// EPEDE Master Content Architecture - Files, Specifications and Documentation Layer
// Strictly adhering to EPEDE Canonical Relationship Model and Master Content Directive

import type { DomainCode } from './epede';

export type EpedeDocumentType =
  | 'EQUIPMENT_DATASHEET'
  | 'TECHNICAL_SPECIFICATION'
  | 'ENGINEERING_REFERENCE'
  | 'PRODUCT_MANUAL'
  | 'INSTALLATION_MANUAL'
  | 'OPERATION_MANUAL'
  | 'MAINTENANCE_MANUAL'
  | 'TESTING_PROCEDURE'
  | 'COMMISSIONING_PROCEDURE'
  | 'PROTECTION_SPECIFICATION'
  | 'CABLE_SPECIFICATION'
  | 'TRANSFORMER_SPECIFICATION'
  | 'CONFIGURATION_DOCUMENT'
  | 'EQUIPMENT_SCHEDULE'
  | 'CABLE_SCHEDULE'
  | 'TRANSFORMER_SCHEDULE'
  | 'PROTECTION_SETTINGS_CONTEXT'
  | 'INSPECTION_REPORT'
  | 'TEST_REPORT'
  | 'ENGINEERING_CALCULATION_NOTE'
  | 'PROJECT_DOCUMENT'
  | 'SINGLE_LINE_DIAGRAM'
  | 'WIRING_DIAGRAM'
  | 'AS_BUILT_REFERENCE'
  | 'STANDARDS_REFERENCE'
  | 'UTILITY_REQUIREMENT'
  | 'MANUFACTURER_REQUIREMENT';

export type DocumentLifecycleStatus = 'CURRENT' | 'SUPERSEDED' | 'DRAFT' | 'ARCHIVED';

export type VerificationStatus =
  | 'VERIFIED'
  | 'REFERENCE'
  | 'ESTIMATED'
  | 'SOURCE_GAP'
  | 'REQUIRES_TECHNICAL_REVIEW';

export interface StructuredSpecificationGroup {
  category: 'ELECTRICAL' | 'MECHANICAL' | 'THERMAL' | 'ENVIRONMENTAL' | 'PROTECTION' | 'CONTROL' | 'COMMUNICATION' | 'SAFETY';
  title_fr: string;
  title_en: string;
  parameters: {
    key: string;
    label_fr: string;
    label_en: string;
    value: string;
    unit?: string;
    status?: 'VERIFIED' | 'APPLICATION_DEPENDENT' | 'MANUFACTURER_SPECIFIC' | 'REQUIRES_ENGINEERING_VALIDATION' | 'DATA_NOT_YET_DEFINED';
    standardClause?: string;
  }[];
}

export interface EpedeDocumentRecord {
  id: string; // e.g. DOC-D04-TRAFO-001
  documentNumber: string; // e.g. EPEDE-SPEC-TR-225-30-01
  title_fr: string;
  title_en: string;
  documentType: EpedeDocumentType;
  domainCode: DomainCode;
  subdomainCode: string; // e.g. D04.02
  systemCode: string; // e.g. SYS-GSU-TRANSFORMER
  primaryEquipmentId?: string; // Links to equipment, e.g. eq-trafo-gsu-01
  relatedEquipmentIds: string[];
  relatedComponentNames_fr: string[];
  relatedComponentNames_en: string[];
  revision: string; // e.g. Rev C
  version: string; // e.g. 2.4.0
  status: DocumentLifecycleStatus;
  date: string; // ISO date
  source: string; // e.g. "SONATREL / Eneo Engineering Standard" or "CIGRE TB 445 / IEC 60076"
  language: 'FR' | 'EN' | 'BILINGUAL';
  verificationStatus: VerificationStatus;
  documentOwner: string; // e.g. "Primary Plant Lead Engineer"
  relatedProjectContext: {
    fr: string;
    en: string;
  };
  relatedStandards: string[]; // e.g. ['IEC 60076-1', 'IEEE Std C57.12.00']
  summary_fr: string;
  summary_en: string;
  tableOfContents_fr: string[];
  tableOfContents_en: string[];
  structuredSpecifications?: StructuredSpecificationGroup[];
  isConceptual: boolean; // Directive Section 3: display "Representative documentation structure — not a real project document."
  hasAttachmentUrl?: boolean;
}
