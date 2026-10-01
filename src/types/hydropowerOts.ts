// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 22 TYPES
// STEP 22: Operator Training Simulator (OTS / Full-Scope Replica),
// Critical Malfunction Drills, ISO 11064 Control Room Ergonomics & HRA Evaluation
// ============================================================================

export type SimulationSpeed = 'PAUSED' | 'REALTIME_1X' | 'FAST_2X' | 'WARP_5X';

export type IncidentScenarioId =
  | 'SCN_LOAD_REJECTION_420MW'  // Rejet de charge total 420 MW (Déclenchement ligne 225 kV)
  | 'SCN_GOVERNOR_OIL_FAILURE'  // Rupture hydraulique groupe oléodynamique 160 bar
  | 'SCN_LOSS_OF_EXCITATION'    // Perte d'excitation alternateur G01 (ANSI 40)
  | 'SCN_TRASH_RACK_CLOGGING'   // Colmatage brutal grilles de prise d'eau (Delta H > 2.5 m)
  | 'SCN_BEARING_COOLING_TRIP'; // Perte eau de réfrigération butée Michell (T > 85°C)

export interface IncidentScenario {
  id: IncidentScenarioId;
  code: string;
  titleFr: string;
  titleEn: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  initiatingEventFr: string;
  initiatingEventEn: string;
  automaticSafetyActionsFr: string[];
  automaticSafetyActionsEn: string[];
  operatorRequiredActionsFr: string[];
  operatorRequiredActionsEn: string[];
  standardReference: string;
  benchmarkCompletionTimeSeconds: number; // e.g. 45s to execute emergency triage
}

export interface OtsSimulationState {
  simTimeSeconds: number;
  speed: SimulationSpeed;
  activeScenario: IncidentScenarioId | null;
  scenarioTimeElapsedSeconds: number;
  scenarioResolved: boolean;
  // Real-time telemetry snapshot
  gridFrequencyHz: number;          // Nominal 50.00 Hz
  gridVoltageKv: number;            // Nominal 225.0 kV
  unitActivePowerTotalMw: number;   // Nominal 420.0 MW
  unitReactivePowerTotalMvar: number;
  shaftSpeedRpm: number;            // Nominal 136.36 RPM (Runaway max ~290 RPM)
  waterHammerHeadM: number;         // Nominal 50.0 m (Transient up to 72 m)
  governorOilPressureBar: number;   // Nominal 160.0 bar
  thrustBearingTempC: number;       // Nominal 62.0 °C (Alarm at 75°C, Trip at 85°C)
  trashRackDeltaHMeters: number;    // Nominal 0.35 m (Alarm at 1.5 m, Trip at 2.5 m)
  generatorExcitationCurrentA: number; // Nominal 850 A
}

export interface AlarmAnnunciatorItem {
  id: string;
  tag: string;
  labelFr: string;
  labelEn: string;
  category: 'GENERATOR' | 'TURBINE' | 'TRANSFORMER' | 'HYDRAULIC' | 'GRID';
  active: boolean;
  acknowledged: boolean;
  color: 'RED_FLASH' | 'AMBER' | 'WHITE';
  timestamp?: string;
}

export interface OperatorTraineeEvaluation {
  traineeId: string;
  traineeName: string;
  role: 'CHIEF_DESK_OPERATOR' | 'SYSTEM_DISPATCHER' | 'HYDRO_FIELD_ENGINEER';
  totalDrillsCompleted: number;
  certificationScorePercent: number; // e.g. 94%
  averageReactionTimeSeconds: number;
  humanErrorProbabilityScore: number; // SPAR-H / THERP method (< 0.05 is proficient)
  qualificationStatus: 'CERTIFIED_SENIOR' | 'IN_TRAINING' | 'RE_EVALUATION_REQUIRED';
}
