// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 16 TYPES
// STEP 16: Autonomous AI Operations, PINN Cavitation Physics & DRL Dispatch
// ============================================================================

export type LocalizedText = {
  fr: string;
  en: string;
};

export type AiAutonomyLevel = 'L1_ASSISTED' | 'L2_CONDITIONAL' | 'L3_HIGH_AUTONOMY' | 'L4_FULL_AUTONOMOUS';

export interface PinnCavitationPoint {
  timeIndex: number;
  dischargeM3s: number;
  sigmaPlant: number; // Plant Thoma cavitation number
  sigmaCritical: number; // Critical runner inception number
  predictedVaporFractionPercent: number; // Physics loss
  neuralPinnConfidence: number; // 0 to 1
  erosionRateMmPerYear: number;
  recommendedVaneTrimPercent: number;
}

export interface DrlDispatchAction {
  targetDischargeM3s: number;
  activeUnitsCount: number;
  efficiencyPercent: number;
  gridFrequencyHz: number;
  dynamicRewardScore: number;
  actionRationale: LocalizedText;
}

export interface AutonomousAgentDecision {
  timestamp: string;
  eventType: 'frequency_dip' | 'flood_wave_inflow' | 'bearing_hotspot' | 'grid_curtailment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  sensorInputs: { name: string; value: string }[];
  pinnAnalysis: LocalizedText;
  autonomousActionTaken: LocalizedText;
  humanOverrideWindowSeconds: number;
  status: 'executed' | 'supervisory_confirmed' | 'pending_override';
}
