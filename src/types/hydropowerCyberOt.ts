// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 11 TYPES
// STEP 11: Industrial OT Cybersecurity (IEC 62443), IEC 61850 & Cyber-Resilience
// ============================================================================

export type LocalizedText = {
  fr: string;
  en: string;
};

export type SecurityLevel = 'SL-1' | 'SL-2' | 'SL-3' | 'SL-4';

export interface Iec62443Zone {
  id: string;
  purdueLevel: number;
  name: LocalizedText;
  securityLevelTarget: SecurityLevel;
  securityLevelAchieved: SecurityLevel;
  primaryAssets: LocalizedText;
  perimeterProtection: LocalizedText;
  inboundProtocols: string[];
  vulnerabilitiesMitigated: LocalizedText;
  complianceStatus: 'compliant' | 'warning' | 'audit_required';
}

export interface Iec61850TrafficStream {
  id: string;
  protocol: 'GOOSE' | 'SampledValues_SV' | 'MMS' | 'PTP_IEEE1588' | 'IEC_104';
  networkBus: 'ProcessBus' | 'StationBus' | 'DMZ_Gateway';
  bandwidthUsageMbps: number;
  latencyBudgetMs: number;
  measuredLatencyMs: number;
  encryptionStandard: string; // e.g. "IEC 62351-6 HMAC-SHA256"
  isDeterministic: boolean;
  healthStatus: 'optimal' | 'degraded' | 'alert';
}

export type SimulatedCyberAttackType =
  | 'goose_replay_spoofing'
  | 'scada_setpoint_override'
  | 'ptp_time_poisoning'
  | 'dmz_ransomware_lateral';

export interface CyberPhysicalAttackScenario {
  id: SimulatedCyberAttackType;
  title: LocalizedText;
  mitreAttckId: string; // e.g. "T0814 - Denial of Service"
  attackVector: LocalizedText;
  physicalImpactWithoutDefense: LocalizedText;
  iec62443DefenseMechanism: LocalizedText;
  detectionTimeMs: number;
  mitigationAction: LocalizedText;
  postIncidentIntegrity: LocalizedText;
}

export interface HybridBessParameters {
  batteryCapacityMWh: number; // e.g. 100 MWh
  batteryPowerMW: number; // e.g. 50 MW
  floatingSolarCapacityMWp: number; // e.g. 40 MWp
  fastFrequencyResponseTimeMs: number; // < 200 ms
  reservoirSurfaceCoveredPercent: number;
  waterEvaporationSavedM3PerYear: number;
  gridFrequencyNadirStabilizationHz: number;
}
