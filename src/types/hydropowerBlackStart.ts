// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 13 TYPES
// STEP 13: Black-Start Sequence, Ferranti Mitigation, Islanded Grid Restoration & HIL Sync
// ============================================================================

export type LocalizedText = {
  fr: string;
  en: string;
};

export type BlackStartStepId =
  | 'dg_start'
  | 'aux_energize'
  | 'hydro_crank'
  | 'excitation_ramp'
  | 'line_charging'
  | 'load_pickup'
  | 'grid_resync';

export interface BlackStartSequencePhase {
  id: BlackStartStepId;
  stepNumber: number;
  title: LocalizedText;
  durationMinutes: number;
  criticalPrerequisites: LocalizedText;
  voltageKv: number;
  frequencyHz: number;
  activePowerMW: number;
  reactivePowerMVAR: number;
  keySafetyActions: LocalizedText;
  status: 'pending' | 'active' | 'completed';
}

export interface FerrantiCalculationParams {
  lineLengthKm: number; // e.g. 51 km Nachtigal - Nyom II
  lineVoltageNominalKv: number; // 225 kV
  lineCapacitanceUfPerKm: number; // ~ 0.0095 uF/km
  shuntReactorCompensationMVAR: number; // 0 to 40 MVAR
  generatorUnderExcitationMVAR: number; // 0 to 35 MVAR absorption
}

export interface FerrantiCalculationResult {
  unloadedReceivingVoltageKv: number;
  voltageRisePercent: number;
  chargingReactivePowerGeneratedMVAR: number;
  netReactiveImbalanceMVAR: number;
  generatorOperatingMode: LocalizedText;
  isVoltageSafe: boolean;
  ferrantiMitigationAdvice: LocalizedText;
}

export interface IslandBlockLoadStep {
  stepId: string;
  targetName: LocalizedText;
  blockPowerMW: number; // e.g. 15 MW hospital + pumping
  cumulativePowerMW: number;
  expectedFrequencyDipHz: number; // Nadir e.g. 49.3 Hz
  governorRecoveryTimeSec: number; // ~ 3.8 s
  priorityClass: 'Tier-1-LifeSafety' | 'Tier-2-WaterInfrastructure' | 'Tier-3-UrbanBaseload';
}

export interface SynchroCheckParameters {
  voltageDifferencePercent: number; // ANSI 25 limit <= 2.0%
  frequencyDifferenceHz: number; // ANSI 25 limit <= 0.10 Hz
  phaseAngleDifferenceDeg: number; // ANSI 25 limit <= 5.0 deg
  slipRateHzPerSec: number; // limit <= 0.05 Hz/s
  breakerClosingTimeMs: number; // ~ 80 ms
}

export interface SynchroCheckResult {
  isPermissiveClosed: boolean;
  voltageOk: boolean;
  frequencyOk: boolean;
  phaseAngleOk: boolean;
  slipRateOk: boolean;
  anticipationLeadTimeMs: number;
  statusMessage: LocalizedText;
}
