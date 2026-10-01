// src/types/geotwin.ts
// ============================================================================
// GEOSPATIAL 3D & SUBSTATION DIGITAL TWIN (GEOTWIN 3D & DLR)
// Compliant with IEC 61936-1 (Power installations > 1 kV),
// IEC 60826 (Design criteria of overhead transmission lines),
// and CIGRE TB 207 / IEEE Std 738 (Thermal rating of overhead conductors)
// ============================================================================

export type SubstationBusScheme = 
  | 'single_bus' 
  | 'double_bus' 
  | 'breaker_and_a_half' 
  | 'ring_bus' 
  | 'gis_compact';

export interface GisCoordinates {
  lat: number;
  lng: number;
  elevationM: number;
}

export interface GisSubstation {
  id: string;
  name: string;
  code: string;
  voltageKv: number; // e.g. 400, 225, 90, 30
  coordinates: GisCoordinates;
  technology: 'AIS' | 'GIS' | 'Hybrid';
  busbarScheme: SubstationBusScheme;
  transformerCapacityMva: number;
  scadaNodeId: string;
  healthIndexPercent: number;
  lastThermographyScanDate: string;
  baysCount: number;
  description: {
    fr: string;
    en: string;
  };
}

export type TowerType = 
  | 'suspension'       // Pylône d'alignement (suspension droite)
  | 'angle_tension'    // Pylône d'angle / d'ancrage
  | 'dead_end_gantry'  // Portique d'extrémité poste
  | 'river_crossing';  // Pylône grande traversée de fleuve

export interface TransmissionTower {
  towerId: string;
  towerNumber: string;
  corridorId: string;
  type: TowerType;
  heightM: number;
  baseWidthM: number;
  coordinates: GisCoordinates;
  foundationType: 'pad_and_chimney' | 'micropiles' | 'drilled_shaft' | 'rock_anchor';
  footingEarthingResistanceOhm: number; // Target < 10 Ohm for lightning surge dispersion
  spanToNextM: number;
  insulatorType: 'glass_cap_and_pin' | 'composite_silicone' | 'porcelain_long_rod';
  insulatorDiscsCount: number; // e.g. 14 discs for 225 kV, 22 for 400 kV
  status: 'nominal' | 'inspection_due' | 'corrosion_alert';
}

export interface CorridorSpan {
  spanId: string;
  corridorId: string;
  fromTowerId: string;
  toTowerId: string;
  lengthM: number;
  rulingSpanM: number;
  conductorType: string; // e.g. Aster 570 AAAC, Curlew ACSR
  phaseConfiguration: 'horizontal' | 'vertical' | 'delta';
  bundleConductorsPerPhase: number; // 1 (simplex), 2 (duplex), 3 (triplex)
  bundleSpacingMm: number; // e.g. 400 mm
  ratedStaticTensionKn: number;
  terrainElevationFromM: number;
  terrainElevationToM: number;
  midSpanGroundElevationM: number;
  statutoryGroundClearanceM: number; // e.g. 7.5 m for 225 kV (IEC 60826)
  rightOfWayWidthM: number; // e.g. 40 m (20 m each side of centerline)
  vegetationHeightM: number; // Current tree height under corridor
  vegetationGrowthRateMmYear: number;
  riverCrossing: boolean;
}

export type EquipmentCategory3D = 
  | 'gantry'
  | 'surge_arrester'
  | 'cvt'
  | 'ct'
  | 'disconnector'
  | 'earth_switch'
  | 'circuit_breaker'
  | 'busbar'
  | 'transformer'
  | 'firewall'
  | 'bcu_kiosk';

export interface BayEquipment3D {
  id: string;
  tag: string;
  name: {
    fr: string;
    en: string;
  };
  category: EquipmentCategory3D;
  position3D: { x: number; y: number; z: number }; // In meters (X: longitudinal bay axis, Y: lateral, Z: elevation)
  dimensions: { width: number; depth: number; height: number }; // Meters
  phase: 'Phase A' | 'Phase B' | 'Phase C' | 'Three-Phase' | 'Common';
  ratedVoltageKv: number;
  ratedCurrentA: number;
  ratedBreakingKa?: number;
  bilImpulseKv: number; // Basic Impulse Insulation Level (1.2/50 µs)
  creepageDistanceMmPerKv: number; // e.g. 31 mm/kV for heavy marine/industrial pollution
  operationalState: 'closed' | 'open' | 'earthed' | 'alarm';
  thermalHotspotTempC?: number; // Infrared thermography temperature
  sf6GasPressureBar?: number; // SF6 circuit breaker pressure
  oilTemperatureC?: number; // Transformer top-oil
  iecStandard: string;
  aasAssetId: string;
}

export interface ClearanceRuleAudit {
  ruleCode: string;
  title: {
    fr: string;
    en: string;
  };
  standardRef: string; // e.g. IEC 61936-1 Table 1
  voltageKv: number;
  requiredClearanceMm: number;
  actualMeasuredMm: number;
  safetyMarginPercent: number;
  status: 'compliant' | 'warning' | 'violation';
  description: {
    fr: string;
    en: string;
  };
}

export interface ConductorThermalProperties {
  codeName: string;
  crossSectionMm2: number;
  outerDiameterMm: number;
  totalMassKgPerKm: number;
  ratedBreakingStrengthKn: number;
  dcResistance20COhmPerKm: number;
  tempCoeffResistancePerC: number;
  solarAbsorptionCoeff: number; // alpha (typically 0.8 to 0.9 for weathered conductor)
  thermalEmissivityCoeff: number; // epsilon (typically 0.8 to 0.9)
  maxContinuousOperatingTempC: number; // 75°C to 90°C
  emergencyOperatingTempC: number; // 100°C
}

export interface DlrSimulationState {
  ambientTempC: number; // -5 to 45 °C
  windSpeedMs: number; // 0.1 to 20 m/s
  windAttackAngleDeg: number; // 0 (parallel to line) to 90 (perpendicular)
  solarIrradianceWm2: number; // 0 to 1100 W/m²
  lineCurrentA: number; // Actual current flow (A)
  conductorCode: string;
  spanLengthM: number;
  initialTensionKn: number;
  
  // Computed outputs
  conductorTempC: number;
  jouleHeatingWm: number;
  solarHeatingWm: number;
  convectiveCoolingWm: number;
  radiativeCoolingWm: number;
  staticAmpacityA: number; // SLR (Seasonal Line Rating @ conservative baseline)
  dynamicAmpacityA: number; // DLR under current weather
  capacityGainPercent: number;
  catenarySagM: number;
  groundClearanceM: number;
  clearanceStatus: 'safe' | 'marginal' | 'breach';
}
