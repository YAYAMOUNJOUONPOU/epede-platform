// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 18 TYPES
// STEP 18: Pumped Storage (STEP/PSH), Synchronous Condenser & Subsea ROV
// ============================================================================

export type PshOperatingMode =
  | 'generating'       // Turbining power to grid
  | 'pumping'          // Pumping water to upper reservoir
  | 'sync_condenser'   // Synchronous condenser (tailwater depressed by compressed air)
  | 'hydraulic_short'  // Hydraulic short-circuit (simultaneous pump + turbine for frequency regulation)
  | 'standby';

export type MachineArchitecture =
  | 'reversible_francis' // Reversible pump-turbine (RPT) with DFIG variable speed
  | 'ternary_set';       // Separate turbine + synchronous motor/generator + multi-stage pump

export interface PshSystemParams {
  architecture: MachineArchitecture;
  ratedTurbineCapacityMw: number;
  ratedPumpCapacityMw: number;
  upperReservoirCapacityMm3: number;
  lowerReservoirCapacityMm3: number;
  grossHeadMeters: number;
  roundTripEfficiencyPercent: number; // typically 78 - 82%
  variableSpeedDriveType: 'DFIG' | 'Full_Converter_VFD' | 'Fixed_Speed';
  transitionTimeTurbineToPumpSec: number;
  transitionTimeStandbyToFullGenSec: number;
}

export interface SynchronousCondenserParams {
  ratedReactivePowerMaxMvar: number; // e.g. +160 Mvar capacitive (boost voltage)
  ratedReactivePowerMinMvar: number; // e.g. -90 Mvar inductive (buck voltage)
  tailwaterDepressionAirPressureBar: number; // Compressed air pressure to push water below runner (e.g. 4.8 bar)
  airDepressionBlowdownTimeSec: number; // ~45s
  activePowerLossesMw: number; // ~1.8 MW (windage + bearing losses in air)
  inertiaConstantHSeconds: number; // Inertia constant H (e.g. 4.2 s)
  subtransientReactanceXdpdPercent: number; // X"d (e.g. 18.5%)
}

export interface SubseaRovInspectionSystem {
  rovModel: string;
  maxOperatingDepthMeters: number;
  payloadSensors: string[];
  batteryAutonomyHours: number;
  acousticPositioningType: 'USBL' | 'LBL';
  targetZones: Array<{
    id: string;
    nameFr: string;
    nameEn: string;
    depthM: number;
    inspectionType: 'Sonar_3D' | 'HD_Photogrammetry' | 'Laser_Cavitation' | 'Sediment_Profiling';
    integrityScorePercent: number;
    status: 'normal' | 'watch' | 'urgent';
    findingsFr: string;
    findingsEn: string;
  }>;
}

export interface PshSimulationPoint {
  hour: number;
  operatingMode: PshOperatingMode;
  netPowerMw: number; // Positive = generation, Negative = pumping load
  reactivePowerMvar: number; // Positive = capacitive, Negative = inductive
  upperStorageVolumeMm3: number;
  gridFrequencyHz: number;
  systemInertiaGvaS: number;
}
