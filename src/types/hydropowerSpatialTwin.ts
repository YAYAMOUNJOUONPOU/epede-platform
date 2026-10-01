// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 15 TYPES
// STEP 15: Spatial Digital Twin (BIM / IFC / ISO 19650), AR Tele-Maintenance & IoT Mesh
// ============================================================================

export type LocalizedText = {
  fr: string;
  en: string;
};

export type BimLOD = 'LOD_200' | 'LOD_300' | 'LOD_400' | 'LOD_500';

export interface SpatialBimComponent {
  guid: string;
  name: LocalizedText;
  ifcClass: string; // e.g. IfcEnergyConversionDevice, IfcFlowController
  spatialCoordinates: { x: number; y: number; z: number }; // In powerhouse frame (meters)
  massKg: number;
  material: string;
  operatingHours: number;
  healthScorePercent: number; // 0 - 100%
  vibrationRmsMmS: number;
  temperatureDegC: number;
  lastInspectionDate: string;
  maintenanceStatus: 'optimal' | 'inspection_required' | 'critical_overhaul';
}

export interface ArTeleMaintenanceProcedure {
  procedureId: string;
  title: LocalizedText;
  componentTargetGuid: string;
  estimatedDurationMinutes: number;
  safetyLockoutsRequired: string[]; // LOTO (Lockout / Tagout)
  toolingRequired: string[];
  arOverlaySteps: {
    stepIndex: number;
    instruction: LocalizedText;
    highlightZone: string;
    torqueSpecNm?: number;
    safetyCaution?: LocalizedText;
  }[];
}

export interface IotSensorNode {
  nodeId: string;
  sensorType: 'piezo_vibration' | 'infrared_pyrometer' | 'fiber_optic_strain' | 'ultrasonic_discharge';
  mountLocation: LocalizedText;
  samplingRateKhz: number;
  batteryHealthPercent: number;
  meshRssiDbm: number;
  currentReading: number;
  unit: string;
  thresholdAlert: number;
  status: 'nominal' | 'warning' | 'alarm';
}
