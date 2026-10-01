// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 23 TYPES
// STEP 23: Wide-Area Monitoring Systems (WAMS), Synchrophasors (IEEE C37.118),
// Dynamic Grid Inertia & RoCoF (df/dt) Emulation, Fast Frequency Response (FFR / GFM)
// & Power System Stabilizers (PSS IEEE 421.5) Small-Signal Damping
// ============================================================================

export type PmuSyncStatus = 'LOCKED_GPS' | 'HOLDOVER' | 'LOSS_OF_SYNC';

export interface PmuPhasorNode {
  id: string;
  tag: string;
  substationName: string;
  region: string;
  voltageLevelKv: number;
  voltageMagnitudePu: number;
  voltageAngleDeg: number;
  frequencyHz: number;
  rocofHzPerSec: number;
  activePowerFlowMw: number;
  reactivePowerFlowMvar: number;
  latitude: number;
  longitude: number;
  streamRateFps: number; // typically 50 frames/s in 50 Hz grid
  syncStatus: PmuSyncStatus;
  totalVectorErrorPercent: number; // IEEE C37.118.1 requirement: TVE < 1.0%
  latencyMs: number;
  distanceFromNachtigalKm: number;
}

export interface GridInertiaPlant {
  id: string;
  plantName: string;
  type: 'HYDRO_RUN_OF_RIVER' | 'HYDRO_STORAGE' | 'FLOATING_SOLAR_IBR' | 'BESS_GRID_FORMING';
  ratedCapacityMva: number;
  activePowerMw: number;
  inertiaConstantH: number; // Inertia constant H in seconds (MW*s / MVA)
  storedKineticEnergyMws: number; // Ek = S_rated * H (MJ or MW*s)
  onlineUnits: number;
  totalUnits: number;
  governorDroopPercent: number; // e.g. 4.0%
  isGridForming: boolean;
}

export type RocofContingencyType =
  | 'LOSS_OF_GENERATION_60MW'   // Déclenchement 1 groupe Nachtigal 60 MW
  | 'LOSS_OF_GENERATION_120MW'  // Déclenchement bipolaire 2 groupes 120 MW
  | 'LOSS_OF_LOAD_ALUCAM_145MW' // Perte brutale cuve électrolyse ALUCAM (+145 MW excédent)
  | 'TRIP_LINE_225KV_OYOMABANG' // Perte d'une ternaire 225 kV Nachtigal-Yaoundé
  | 'HIGH_SOLAR_IBR_PENETRATION';// Scénario 60% Solaire sans inertie mécanique

export interface RocofContingency {
  id: RocofContingencyType;
  nameFr: string;
  nameEn: string;
  deltaPowerMw: number; // Negative = loss of gen, Positive = loss of load
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  descriptionFr: string;
  descriptionEn: string;
  expectedRocofHzPerSec: number;
  expectedNadirHz: number;
  timeToNadirSec: number;
  settlingFreqHz: number;
  mitigationEfficacyPercent: number;
}

export interface OscillationMode {
  id: string;
  modeNameFr: string;
  modeNameEn: string;
  frequencyHz: number; // typically 0.1 - 2.0 Hz
  dampingRatioWithoutPssPercent: number; // e.g. 1.8% (< 5% is unacceptable)
  dampingRatioWithPssPercent: number;    // e.g. 14.5% (> 10% is robust)
  type: 'LOCAL_PLANT' | 'INTER_AREA_CENTRE_LITTORAL' | 'INTER_AREA_CAMEROON_CHAD' | 'CONTROL_LOOP';
  participatingSubstations: string[];
  riskDescriptionFr: string;
  riskDescriptionEn: string;
}

export interface PssSetting {
  stabilizerModel: 'IEEE_PSS2B' | 'IEEE_PSS4B';
  status: 'ACTIVE_DAMPING' | 'BYPASSED' | 'TEST_BENCH';
  gainKs1: number;
  washoutTw1Sec: number;
  washoutTw2Sec: number;
  leadLagT1Sec: number;
  leadLagT2Sec: number;
  leadLagT3Sec: number;
  leadLagT4Sec: number;
  outputLimitVstMaxPu: number;
  outputLimitVstMinPu: number;
  inputSignalsFr: string;
  inputSignalsEn: string;
}

export interface GridFormingConfig {
  mode: 'VIRTUAL_SYNCHRONOUS_MACHINE' | 'DROOP_CONTROLLED' | 'GRID_FOLLOWING';
  emulatedInertiaH: number; // 0 to 8 seconds
  droopCoefficientPercent: number; // 1% to 5%
  fastFrequencyResponseDelayMs: number; // typically 15-50 ms vs 1500 ms for hydro water inertia
  activeDampingCoeff: number;
  blackStartCapable: boolean;
  maxOverloadPu: number;
}
