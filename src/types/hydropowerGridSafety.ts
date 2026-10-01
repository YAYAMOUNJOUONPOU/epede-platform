// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 8 & STEP 9 TYPES
// STEP 8: Generator Protection Relaying, P-Q Capability, AVR/PSS & Grid Code
// STEP 9: Dam Safety Auscultation, Multi-Reservoir Cascade & Risk Management
// ============================================================================

export type LocalizedText = {
  fr: string;
  en: string;
};

// ----------------------------------------------------------------------------
// STEP 8: ELECTRICAL PROTECTIONS & GRID CODE COMPLIANCE
// ----------------------------------------------------------------------------

export type AnsiProtectionCode =
  | '87G'   // Generator Differential
  | '87T'   // Transformer Differential
  | '40'    // Loss of Excitation (Underexcitation)
  | '78'    // Out-of-Step / Pole Slip
  | '24'    // Volts / Hertz Overfluxing
  | '64R'   // Rotor Ground Fault (100% injection)
  | '59N'   // 100% Stator Ground Fault (Neutral Overvoltage + 3rd Harmonic)
  | '46'    // Negative Sequence Overcurrent (Unbalance)
  | '81O/U' // Over / Under Frequency
  | '27/59' // Under / Over Voltage
  | '51V'   // Voltage-Controlled Overcurrent (Backup)
  | '25';   // Synchronism-Check / Auto-Paralleler

export interface AnsiProtectionScheme {
  code: AnsiProtectionCode;
  name: LocalizedText;
  standardRef: string; // e.g. "IEEE C37.102 / IEC 60255"
  zone: 'stator' | 'rotor' | 'transformer' | 'grid_interface' | 'frequency_voltage';
  pickupSetting: string;
  tripTimeMs: number;
  relayAction: LocalizedText;
  riskMitigated: LocalizedText;
  ansiColor: string;
}

export type SimulatedElectricalFault =
  | 'stator_interturn_short'
  | 'loss_of_excitation_field'
  | 'pole_slip_grid_instability'
  | 'stator_ground_fault'
  | 'overfluxing_load_rejection'
  | 'negative_sequence_unbalance';

export interface SimulatedFaultResult {
  faultId: SimulatedElectricalFault;
  faultName: LocalizedText;
  primaryTrippedRelays: AnsiProtectionCode[];
  backupTrippedRelays: AnsiProtectionCode[];
  clearingTimeMs: number;
  sequenceOfEvents: {
    timeMs: number;
    description: LocalizedText;
    severity: 'info' | 'warning' | 'trip';
  }[];
  postFaultEquipmentStatus: LocalizedText;
}

export interface GeneratorCapabilityPoint {
  pMW: number;
  qMVAR: number;
  powerFactor: number;
  fieldCurrentPerUnit: number;
  rotorAngleDeg: number;
  zone: 'normal_continuous' | 'stator_heating_limited' | 'rotor_field_limited' | 'underexcited_stability_limited' | 'forbidden';
  statusDescription: LocalizedText;
}

export interface GridCodeComplianceCheck {
  id: string;
  requirement: LocalizedText;
  standardAuthority: string; // e.g., "SONATREL / ARSEL RIS Code"
  ruleValue: string;
  plantAchievedValue: string;
  isCompliant: boolean;
  notes: LocalizedText;
}

// ----------------------------------------------------------------------------
// STEP 9: DAM SAFETY, CASCADE OPTIMIZATION & EMERGENCY ACTION (PPI)
// ----------------------------------------------------------------------------

export type DamSensorType =
  | 'pendulum_deflection'      // Inverted/Direct Pendulum (mm)
  | 'piezometer_uplift'        // Vibrating wire piezometer (bar/m)
  | 'drainage_seepage_weir'    // V-notch weir discharge (L/min)
  | 'joint_3d_displacement'    // Joint meter dilatometer (mm)
  | 'seismic_accelerometer';   // Strong motion accelerograph (g)

export interface DamSafetySensor {
  id: string;
  type: DamSensorType;
  locationTag: string; // e.g., "Plot P09 - Crête Déversoir"
  sensorName: LocalizedText;
  currentValue: number;
  unit: string;
  normalRange: [number, number];
  alertThreshold: number;
  alarmThreshold: number;
  status: 'nominal' | 'vigilance' | 'alert' | 'alarm';
  interpretation: LocalizedText;
  recommendedAction: LocalizedText;
}

export interface CascadePlantNode {
  id: 'lom_pangar' | 'nachtigal' | 'songloulou' | 'edea';
  name: string;
  river: string;
  role: 'regulating_storage' | 'run_of_river_major' | 'run_of_river_cascaded';
  storageCapacityMm3: number;
  installedCapacityMW: number;
  designHeadM: number;
  designDischargeM3s: number;
  travelTimeToNextHours: number; // Hydraulic wave travel time
  distanceKm: number;
}

export interface CascadeSimulationResult {
  lomPangarReleaseM3s: number;
  sanagaInflowNachtigalM3s: number;
  nachtigalPowerMW: number;
  songloulouPowerMW: number;
  edeaPowerMW: number;
  totalCascadePowerMW: number;
  totalCascadeEnergyGWhDay: number;
  waterEfficiencyKWhPerM3: number;
  spilledFlowM3s: number;
}

export interface DamBreachSimulationParams {
  damHeightM: number;
  reservoirVolumeMm3: number;
  damType: 'gravity_rcc' | 'rockfill_cfrd' | 'earthfill';
  failureMode: 'overtopping_pmf' | 'internal_piping' | 'seismic_liquefaction';
}

export interface DamBreachOutput {
  peakBreachDischargeM3s: number; // Froehlich Qp
  averageBreachWidthM: number;
  breachFormationTimeHours: number;
  waveFrontVelocityKmH: number;
  floodTravelTimes: {
    locationName: string;
    distanceKm: number;
    arrivalTimeHours: number;
    peakArrivalHours: number;
    peakWaterElevationRiseM: number;
    evacuationPriority: 'immediate' | 'high' | 'moderate';
  }[];
  ppiSafetyDirectives: LocalizedText[];
}

export interface PumpedStorageLabParams {
  upperReservoirActiveVolumeMm3: number;
  grossHeadM: number;
  pumpingDischargeM3s: number;
  generatingDischargeM3s: number;
  pumpMotorEfficiency: number; // e.g. 0.89
  turbineGenEfficiency: number; // e.g. 0.91
  waterwayEfficiency: number;  // e.g. 0.96
  operatingHoursTurbine: number;
  operatingHoursPump: number;
}

export interface PumpedStorageLabResult {
  pumpingPowerMW: number;
  generatingPowerMW: number;
  storedEnergyMWh: number;
  energyConsumedPumpingMWh: number;
  energyProducedTurbiningMWh: number;
  roundTripEfficiencyPercent: number;
  gridFrequencySupportMW: number;
}
