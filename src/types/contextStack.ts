// src/types/contextStack.ts
// EPEDE - Engineering Context Stack, Energy Chain, Evidence Trust Badges & Relationship Model

import { DomainCode } from './epede';
import { AppViewType } from '../services/routerService';

export type EnergyChainPosition =
  | 'generation'                  // Hydro/Thermal/Solar generation
  | 'step_up_substation'          // GSU 10.5/225 kV
  | 'transmission_grid'           // 225 kV / 90 kV lines & interconnectors
  | 'primary_substation'          // 225/30 kV AIS & GIS Substations
  | 'distribution_network'        // 30 kV MV Feeders & RMUs
  | 'industrial_commercial_load'  // 400 V Motors & Factory Incomers
  | 'auxiliary_system';           // 110 Vdc / 400 Vac Substation Auxiliaries

export type EngineeringAspectView =
  | 'physical'                    // 3D geometry, cutaway, dimensions
  | 'electrical'                  // Single-line diagram, voltages, currents
  | 'protection'                  // ANSI relays, tripping matrix, TCC curves
  | 'automation_control'          // BCU, SCADA, GOOSE, PLC interlocking
  | 'digital_twin'                // Asset Administration Shell (AAS), telemetry
  | 'standards_lifecycle';        // IEC/IEEE compliance, commissioning, maintenance

export type EvidenceBadgeType =
  | 'VERIFIED_STANDARD'           // Formally checked against IEC/IEEE/CIGRE
  | 'ENGINEERING_REFERENCE'        // Peer-reviewed utility reference / textbook
  | 'FIELD_PRACTICE'               // Real-world utility practice (e.g. SONATREL / RTE)
  | 'CONCEPTUAL_MODEL'             // Theoretical educational model / simplified formulation
  | 'SIMULATION'                   // Real-time computed transient or power-flow calculation
  | 'CAMEROON_CONTEXT'             // Grid-specific data for Cameroon RIS/RIN network
  | 'MANUFACTURER_SPECIFIC'        // Specific to ABB/Siemens/Schneider OEM architecture
  | 'APPLICATION_DEPENDENT'        // Varies by soil resistivity, altitude, or load profile
  | 'REQUIRES_VALIDATION'          // Needs on-site commissioning measurements or study
  | 'SOURCE_GAP';                  // Disclosed engineering data limit or unverified parameter

export interface EvidenceVerificationMeta {
  type: EvidenceBadgeType;
  label: { fr: string; en: string };
  shortLabel: { fr: string; en: string };
  description: { fr: string; en: string };
  governingStandard?: string;
  sourceReference?: string;
  confidencePercent: number;
}

export interface PersistentContextBreadcrumb {
  platform: 'EPEDE';
  domainCode?: DomainCode;
  domainTitle?: { fr: string; en: string };
  subsystemId?: string;
  subsystemTitle?: { fr: string; en: string };
  objectId?: string;
  objectName?: { fr: string; en: string };
  objectTag?: string;
  voltageLevel?: string;
  energyChainPosition: EnergyChainPosition;
  activeAspect: EngineeringAspectView;
}

export interface ExplorationHistoryEntry {
  id: string;
  timestamp: number;
  nodeId?: string;
  equipmentId?: string;
  domainCode?: DomainCode;
  title: { fr: string; en: string };
  tag?: string;
  viewType: AppViewType;
  chainPosition: EnergyChainPosition;
  voltageLevel?: string;
}

export interface SavedEngineeringPath {
  id: string;
  name: string;
  createdAt: number;
  nodes: ExplorationHistoryEntry[];
}

export interface SystemBoundaryInfo {
  systemName: { fr: string; en: string };
  batteryLimits: {
    upstream: { fr: string; en: string };
    downstream: { fr: string; en: string };
    auxiliary: { fr: string; en: string };
  };
  operationalJurisdiction: {
    operator: string;
    maintenanceEntity: string;
    dispatchAuthority: string;
  };
  governingStandard: string;
}
