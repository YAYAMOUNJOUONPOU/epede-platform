// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 15 DATA ENGINE
// STEP 15: Spatial Digital Twin (BIM / IFC / ISO 19650), AR Tele-Maintenance & IoT Mesh
// ============================================================================

import type {
  SpatialBimComponent,
  ArTeleMaintenanceProcedure,
  IotSensorNode,
} from '../types/hydropowerSpatialTwin';

// ============================================================================
// 1. BIM / IFC ASSET INVENTORY (ISO 19650 / OPEN BIM IFC4x3)
// ============================================================================

export const POWERHOUSE_BIM_COMPONENTS: SpatialBimComponent[] = [
  {
    guid: 'IFC-G1-RUNNER-001',
    name: {
      fr: 'Roue Francis 60 MW (Acier Inox Martensitique 13Cr4Ni)',
      en: '60 MW Francis Runner (13Cr4Ni Martensitic Stainless Steel)',
    },
    ifcClass: 'IfcEnergyConversionDevice',
    spatialCoordinates: { x: 24.5, y: 12.0, z: -8.4 },
    massKg: 28500,
    material: 'EN 1.4313 (GX4CrNiMo16-5-1)',
    operatingHours: 14250,
    healthScorePercent: 94.2,
    vibrationRmsMmS: 1.8,
    temperatureDegC: 28.4,
    lastInspectionDate: '2026-06-15',
    maintenanceStatus: 'optimal',
  },
  {
    guid: 'IFC-G1-THRUST-002',
    name: {
      fr: 'Pivot de Butée Axiale & 12 Patins Métal Blanc (Babbitt)',
      en: 'Thrust Bearing Assembly & 12 Babbitt Tilting Shoes',
    },
    ifcClass: 'IfcMechanicalFastener',
    spatialCoordinates: { x: 24.5, y: 12.0, z: -3.2 },
    massKg: 18400,
    material: 'SnSb8Cu4 (ASTM B23 Alloy 2)',
    operatingHours: 14250,
    healthScorePercent: 88.5,
    vibrationRmsMmS: 2.1,
    temperatureDegC: 62.8,
    lastInspectionDate: '2026-07-22',
    maintenanceStatus: 'inspection_required',
  },
  {
    guid: 'IFC-G1-STATOR-003',
    name: {
      fr: 'Stator Alternateur 70.6 MVA 15.75 kV (Bobinage Roebel)',
      en: '70.6 MVA 15.75 kV Generator Stator (Roebel Bar Winding)',
    },
    ifcClass: 'IfcElectricGenerator',
    spatialCoordinates: { x: 24.5, y: 12.0, z: 2.5 },
    massKg: 145000,
    material: 'Tôles magnétiques M330-50A & Cuivre électrolytique ETP',
    operatingHours: 14250,
    healthScorePercent: 96.1,
    vibrationRmsMmS: 1.2,
    temperatureDegC: 84.6,
    lastInspectionDate: '2026-08-01',
    maintenanceStatus: 'optimal',
  },
  {
    guid: 'IFC-G1-MIV-004',
    name: {
      fr: 'Vanne Papillon de Tête de Turbine DN3800 PN10',
      en: 'DN3800 PN10 Main Inlet Butterfly Valve (MIV)',
    },
    ifcClass: 'IfcFlowController',
    spatialCoordinates: { x: 16.2, y: 12.0, z: -7.8 },
    massKg: 42000,
    material: 'Acier moulé G20Mn5',
    operatingHours: 14250,
    healthScorePercent: 92.0,
    vibrationRmsMmS: 0.9,
    temperatureDegC: 27.2,
    lastInspectionDate: '2026-05-10',
    maintenanceStatus: 'optimal',
  },
  {
    guid: 'IFC-G1-GOV-005',
    name: {
      fr: 'Servomoteur Hydraulique de Distributeur & Biellettes',
      en: 'Wicket Gate Hydraulic Servomotor & Linkage Assembly',
    },
    ifcClass: 'IfcActuator',
    spatialCoordinates: { x: 22.0, y: 10.5, z: -6.5 },
    massKg: 8200,
    material: 'Acier forgé 42CrMo4',
    operatingHours: 14250,
    healthScorePercent: 91.4,
    vibrationRmsMmS: 1.4,
    temperatureDegC: 44.0,
    lastInspectionDate: '2026-07-18',
    maintenanceStatus: 'optimal',
  },
];

// ============================================================================
// 2. AR TELE-MAINTENANCE PROCEDURES & SMART GLASSES GUIDANCE
// ============================================================================

export const AR_MAINTENANCE_PROCEDURES: ArTeleMaintenanceProcedure[] = [
  {
    procedureId: 'AR-PROC-01',
    title: {
      fr: 'Calage & Contrôle du Jeu des Patins de Butée Axiale (Babbitt)',
      en: 'Thrust Bearing Babbitt Shoe Clearance Calibration & Lift Check',
    },
    componentTargetGuid: 'IFC-G1-THRUST-002',
    estimatedDurationMinutes: 45,
    safetyLockoutsRequired: [
      'LOTO-E-01 : Disjoncteur 15.75 kV consigné ouvert et verrouillé',
      'LOTO-H-02 : Vanne de pied MIV fermée et goupillée mécaniquement',
      'LOTO-O-03 : Pression groupe oléohydraulique dépressurisée (0 bar)',
    ],
    toolingRequired: [
      'Micromètre d\'alésage haute précision (résolution 0.01 mm)',
      'Clé dynamométrique étalonnée 200 - 800 Nm',
      'Jauge d\'épaisseur d\'huile ultrasonore',
      'Lunettes connectées AR HoloLens 2 avec superposition holographique',
    ],
    arOverlaySteps: [
      {
        stepIndex: 1,
        instruction: {
          fr: 'Localiser le patin n°4 repéré par le halo vert holographique. Vérifier l\'absence de rayures ou d\'arrachement sur le métal blanc.',
          en: 'Locate tilting shoe #4 highlighted in the green AR halo. Inspect Babbitt lining for scoring or pitting.',
        },
        highlightZone: 'Zone pivot patin n°4',
        safetyCaution: {
          fr: 'Ne pas toucher la surface régulée avec des gants souillés de particules abrasives.',
          en: 'Do not touch babbitt face with grit-contaminated gloves.',
        },
      },
      {
        stepIndex: 2,
        instruction: {
          fr: 'Insérer la cale étalonnée de 0.12 mm sous la rotule de pivotement. Ajuster la vis de calage jusqu\'au glissement gras.',
          en: 'Insert 0.12 mm calibration shim under spherical pivot. Adjust leveling screw to slight frictional drag.',
        },
        highlightZone: 'Vis de calage sphérique M48',
        torqueSpecNm: 450,
      },
      {
        stepIndex: 3,
        instruction: {
          fr: 'Serrer le contre-écrou de blocage au couple prescrit de 450 Nm sous contrôle du capteur d\'angle AR.',
          en: 'Torque lock-nut to 450 Nm while cross-checking the live AR angular guide indicator.',
        },
        highlightZone: 'Contre-écrou de sécurité',
        torqueSpecNm: 450,
      },
    ],
  },
  {
    procedureId: 'AR-PROC-02',
    title: {
      fr: 'Contrôle Non-Destructif (CND) par Ressuage des Aubes de Roue',
      en: 'Dye Penetrant Inspection (PT) of Francis Runner Blade Fillets',
    },
    componentTargetGuid: 'IFC-G1-RUNNER-001',
    estimatedDurationMinutes: 60,
    safetyLockoutsRequired: [
      'LOTO-C-01 : Permis d\'entrée en espace confiné aspirateur validé',
      'LOTO-V-02 : Ventilation forcée aspirateur 5 000 m³/h active',
    ],
    toolingRequired: [
      'Kit ressuage certifié ISO 3452-1 (Pénétrant rouge + Révélateur blanc)',
      'Lampe UV-A 365 nm étalonnée (> 1 200 µW/cm²)',
      'Module de photogrammétrie 3D sur casque AR',
    ],
    arOverlaySteps: [
      {
        stepIndex: 1,
        instruction: {
          fr: 'Appliquer le pénétrant rouge sur le congé de raccordement aube/plafond repéré en surbrillance rouge holographique.',
          en: 'Spray red penetrant across the crown-to-blade transition fillet highlighted in red AR overlay.',
        },
        highlightZone: 'Congé aube n°7 bord d\'attaque',
      },
      {
        stepIndex: 2,
        instruction: {
          fr: 'Respecter le temps d\'imprégnation de 20 minutes (compte à rebours incrusté dans le champ de vision AR).',
          en: 'Observe 20-minute dwell period (monitored via live floating AR countdown HUD).',
        },
        highlightZone: 'Zone d\'attente capillaire',
      },
      {
        stepIndex: 3,
        instruction: {
          fr: 'Pulvériser le révélateur. Numériser les indications avec la caméra AR pour cartographie automatique dans le modèle BIM.',
          en: 'Apply white developer. Capture crack indications using AR sensor for instant BIM digital twin synchronization.',
        },
        highlightZone: 'Capture photogrammétrique',
      },
    ],
  },
];

// ============================================================================
// 3. WIRELESS IOT SENSOR MESH TELEMETRY (BLE / WIRELESSHART / LORA)
// ============================================================================

export const IOT_SENSOR_MESH: IotSensorNode[] = [
  {
    nodeId: 'IOT-VIB-01',
    sensorType: 'piezo_vibration',
    mountLocation: {
      fr: 'Palier Guide Supérieur Alternateur (Axe X/Y)',
      en: 'Upper Generator Guide Bearing (X/Y Axis)',
    },
    samplingRateKhz: 25.6,
    batteryHealthPercent: 94,
    meshRssiDbm: -58,
    currentReading: 1.42,
    unit: 'mm/s RMS',
    thresholdAlert: 2.8,
    status: 'nominal',
  },
  {
    nodeId: 'IOT-OPT-02',
    sensorType: 'fiber_optic_strain',
    mountLocation: {
      fr: 'Bâche Spirale Acier - Soudure Virole n°3',
      en: 'Spiral Casing Shell - Seam Weld #3',
    },
    samplingRateKhz: 2.0,
    batteryHealthPercent: 98,
    meshRssiDbm: -52,
    currentReading: 385,
    unit: 'µε (Micro-déformation)',
    thresholdAlert: 750,
    status: 'nominal',
  },
  {
    nodeId: 'IOT-PYR-03',
    sensorType: 'infrared_pyrometer',
    mountLocation: {
      fr: 'Têtes de Bobines Statoriques 15.75 kV (Point Chaud)',
      en: '15.75 kV Stator End-Winding Hot-Spot',
    },
    samplingRateKhz: 1.0,
    batteryHealthPercent: 89,
    meshRssiDbm: -64,
    currentReading: 86.4,
    unit: '°C',
    thresholdAlert: 110.0,
    status: 'nominal',
  },
  {
    nodeId: 'IOT-ULT-04',
    sensorType: 'ultrasonic_discharge',
    mountLocation: {
      fr: 'Cône d\'Aspirateur Turbine (Détection Vortex/Cavitation)',
      en: 'Draft Tube Cone (Vortex & Cavitation Acoustic Emission)',
    },
    samplingRateKhz: 100.0,
    batteryHealthPercent: 91,
    meshRssiDbm: -61,
    currentReading: 18.2,
    unit: 'dBµV',
    thresholdAlert: 35.0,
    status: 'nominal',
  },
  {
    nodeId: 'IOT-AIR-05',
    sensorType: 'infrared_pyrometer',
    mountLocation: {
      fr: 'Entrefer Rotor-Stator (Capteur d\'Épaisseur d\'Entrefer)',
      en: 'Rotor-Stator Air-Gap Magnetic Symmetrical Sensor',
    },
    samplingRateKhz: 10.0,
    batteryHealthPercent: 96,
    meshRssiDbm: -55,
    currentReading: 15.8,
    unit: 'mm (Entrefer)',
    thresholdAlert: 13.0, // Minimum air-gap limit
    status: 'nominal',
  },
];
