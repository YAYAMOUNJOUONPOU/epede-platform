// src/components/digitaltwin/data/geotwinData.ts
import {
  GisSubstation,
  TransmissionTower,
  CorridorSpan,
  BayEquipment3D,
  ClearanceRuleAudit,
  ConductorThermalProperties
} from '../../../types/geotwin';

export const GEOTWIN_SUBSTATIONS: GisSubstation[] = [
  {
    id: 'sub_nachtigal',
    name: 'Nachtigal HPP EHV Switchyard',
    code: 'NCH-400',
    voltageKv: 400,
    coordinates: { lat: 4.3486, lng: 11.6472, elevationM: 412 },
    technology: 'AIS',
    busbarScheme: 'breaker_and_a_half',
    transformerCapacityMva: 700,
    scadaNodeId: 'SCADA-NCH-400-SW',
    healthIndexPercent: 98.2,
    lastThermographyScanDate: '2026-08-14',
    baysCount: 8,
    description: {
      fr: 'Poste évacuateur 400 kV de la centrale hydroélectrique de Nachtigal (7x60 MW). Schéma 1-1/2 disjoncteur avec deux jeux de barres tubulaires.',
      en: '400 kV evacuation switchyard of Nachtigal hydroelectric power plant (7x60 MW). 1-1/2 circuit breaker scheme with twin tubular busbars.'
    }
  },
  {
    id: 'sub_batschenga',
    name: 'Batschenga Step-down Substation',
    code: 'BAT-400-225',
    voltageKv: 400,
    coordinates: { lat: 4.2215, lng: 11.7102, elevationM: 485 },
    technology: 'AIS',
    busbarScheme: 'double_bus',
    transformerCapacityMva: 450,
    scadaNodeId: 'SCADA-BAT-400-AUTO',
    healthIndexPercent: 96.5,
    lastThermographyScanDate: '2026-07-22',
    baysCount: 10,
    description: {
      fr: 'Poste d\'interconnexion et d\'abaissement 400/225 kV équipé de deux autotransformateurs 225 MVA avec enroulements tertiaires de compensation 30 kV.',
      en: '400/225 kV interconnection & step-down substation equipped with two 225 MVA autotransformers with 30 kV tertiary compensation windings.'
    }
  },
  {
    id: 'sub_yaounde_nord',
    name: 'Yaoundé Nord Bulk Supply Point',
    code: 'YND-225',
    voltageKv: 225,
    coordinates: { lat: 3.9184, lng: 11.5342, elevationM: 742 },
    technology: 'Hybrid',
    busbarScheme: 'double_bus',
    transformerCapacityMva: 300,
    scadaNodeId: 'SCADA-YND-225-NODE',
    healthIndexPercent: 94.8,
    lastThermographyScanDate: '2026-09-02',
    baysCount: 14,
    description: {
      fr: 'Noeud névralgique 225/90/30 kV alimentant la capitale Yaoundé. Double jeu de barres avec disjoncteur de couplage et travée de transfert.',
      en: 'Strategic 225/90/30 kV hub supplying the capital Yaoundé. Double busbars with bus-coupler breaker and bypass transfer bay.'
    }
  },
  {
    id: 'sub_ahala',
    name: 'Ahala Regional Substation',
    code: 'AHL-225',
    voltageKv: 225,
    coordinates: { lat: 3.8051, lng: 11.4789, elevationM: 710 },
    technology: 'AIS',
    busbarScheme: 'double_bus',
    transformerCapacityMva: 120,
    scadaNodeId: 'SCADA-AHL-225-NODE',
    healthIndexPercent: 91.4,
    lastThermographyScanDate: '2026-06-18',
    baysCount: 8,
    description: {
      fr: 'Poste d\'injection 225/30 kV vers les départs industriels et résidentiels sud de la métropole. Raccordé au pôle thermique de secours.',
      en: '225/30 kV injection substation feeding south industrial and urban distribution feeders. Interfaced with thermal reserve.'
    }
  },
  {
    id: 'sub_mangombe',
    name: 'Mangombe Grid Interconnector',
    code: 'MNG-225',
    voltageKv: 225,
    coordinates: { lat: 3.8211, lng: 10.1345, elevationM: 85 },
    technology: 'AIS',
    busbarScheme: 'double_bus',
    transformerCapacityMva: 360,
    scadaNodeId: 'SCADA-MNG-225-NODE',
    healthIndexPercent: 93.1,
    lastThermographyScanDate: '2026-08-29',
    baysCount: 12,
    description: {
      fr: 'Poste stratégique de liaison vers la zone côtière et portuaire de Douala et les alumineries d\'Edéa.',
      en: 'Strategic grid interconnection hub feeding the Douala coastal port area and Edéa industrial smelting centers.'
    }
  }
];

export const CORRIDOR_TOWERS: TransmissionTower[] = [
  {
    towerId: 'TWR-400-01',
    towerNumber: 'P01 (Portique Gantry)',
    corridorId: 'corridor-nch-bat',
    type: 'dead_end_gantry',
    heightM: 28,
    baseWidthM: 12,
    coordinates: { lat: 4.3480, lng: 11.6480, elevationM: 412 },
    foundationType: 'pad_and_chimney',
    footingEarthingResistanceOhm: 3.2,
    spanToNextM: 320,
    insulatorType: 'glass_cap_and_pin',
    insulatorDiscsCount: 22,
    status: 'nominal'
  },
  {
    towerId: 'TWR-400-02',
    towerNumber: 'P02 (Suspension)',
    corridorId: 'corridor-nch-bat',
    type: 'suspension',
    heightM: 44,
    baseWidthM: 7.2,
    coordinates: { lat: 4.3220, lng: 11.6610, elevationM: 430 },
    foundationType: 'pad_and_chimney',
    footingEarthingResistanceOhm: 4.8,
    spanToNextM: 410,
    insulatorType: 'composite_silicone',
    insulatorDiscsCount: 22,
    status: 'nominal'
  },
  {
    towerId: 'TWR-400-03',
    towerNumber: 'P03 (Traversée Fleuve Sanaga)',
    corridorId: 'corridor-nch-bat',
    type: 'river_crossing',
    heightM: 68,
    baseWidthM: 14.5,
    coordinates: { lat: 4.2950, lng: 11.6780, elevationM: 395 },
    foundationType: 'micropiles',
    footingEarthingResistanceOhm: 2.1,
    spanToNextM: 540,
    insulatorType: 'glass_cap_and_pin',
    insulatorDiscsCount: 24,
    status: 'nominal'
  },
  {
    towerId: 'TWR-400-04',
    towerNumber: 'P04 (Ancrage Rive Sud)',
    corridorId: 'corridor-nch-bat',
    type: 'angle_tension',
    heightM: 42,
    baseWidthM: 10.0,
    coordinates: { lat: 4.2610, lng: 11.6920, elevationM: 440 },
    foundationType: 'pad_and_chimney',
    footingEarthingResistanceOhm: 5.6,
    spanToNextM: 380,
    insulatorType: 'glass_cap_and_pin',
    insulatorDiscsCount: 22,
    status: 'inspection_due'
  },
  {
    towerId: 'TWR-400-05',
    towerNumber: 'P05 (Arrivée Batschenga)',
    corridorId: 'corridor-nch-bat',
    type: 'dead_end_gantry',
    heightM: 30,
    baseWidthM: 12,
    coordinates: { lat: 4.2220, lng: 11.7100, elevationM: 485 },
    foundationType: 'pad_and_chimney',
    footingEarthingResistanceOhm: 3.8,
    spanToNextM: 0,
    insulatorType: 'glass_cap_and_pin',
    insulatorDiscsCount: 22,
    status: 'nominal'
  }
];

export const CORRIDOR_SPANS: CorridorSpan[] = [
  {
    spanId: 'SPAN-01-02',
    corridorId: 'corridor-nch-bat',
    fromTowerId: 'TWR-400-01',
    toTowerId: 'TWR-400-02',
    lengthM: 320,
    rulingSpanM: 380,
    conductorType: 'Aster 570 AAAC (Duplex)',
    phaseConfiguration: 'horizontal',
    bundleConductorsPerPhase: 2,
    bundleSpacingMm: 400,
    ratedStaticTensionKn: 38.5,
    terrainElevationFromM: 412,
    terrainElevationToM: 430,
    midSpanGroundElevationM: 405,
    statutoryGroundClearanceM: 9.0, // 400 kV statutory minimum
    rightOfWayWidthM: 50,
    vegetationHeightM: 4.2,
    vegetationGrowthRateMmYear: 450,
    riverCrossing: false
  },
  {
    spanId: 'SPAN-02-03',
    corridorId: 'corridor-nch-bat',
    fromTowerId: 'TWR-400-02',
    toTowerId: 'TWR-400-03',
    lengthM: 410,
    rulingSpanM: 380,
    conductorType: 'Aster 570 AAAC (Duplex)',
    phaseConfiguration: 'horizontal',
    bundleConductorsPerPhase: 2,
    bundleSpacingMm: 400,
    ratedStaticTensionKn: 41.2,
    terrainElevationFromM: 430,
    terrainElevationToM: 395,
    midSpanGroundElevationM: 390,
    statutoryGroundClearanceM: 9.0,
    rightOfWayWidthM: 50,
    vegetationHeightM: 5.8,
    vegetationGrowthRateMmYear: 520,
    riverCrossing: false
  },
  {
    spanId: 'SPAN-03-04',
    corridorId: 'corridor-nch-bat',
    fromTowerId: 'TWR-400-03',
    toTowerId: 'TWR-400-04',
    lengthM: 540,
    rulingSpanM: 420,
    conductorType: 'Aster 570 AAAC (Duplex)',
    phaseConfiguration: 'horizontal',
    bundleConductorsPerPhase: 2,
    bundleSpacingMm: 400,
    ratedStaticTensionKn: 54.0,
    terrainElevationFromM: 395,
    terrainElevationToM: 440,
    midSpanGroundElevationM: 370, // River water level
    statutoryGroundClearanceM: 14.5, // River navigation clearance constraint
    rightOfWayWidthM: 60,
    vegetationHeightM: 0.0, // Open water surface
    vegetationGrowthRateMmYear: 0,
    riverCrossing: true
  },
  {
    spanId: 'SPAN-04-05',
    corridorId: 'corridor-nch-bat',
    fromTowerId: 'TWR-400-04',
    toTowerId: 'TWR-400-05',
    lengthM: 380,
    rulingSpanM: 380,
    conductorType: 'Aster 570 AAAC (Duplex)',
    phaseConfiguration: 'horizontal',
    bundleConductorsPerPhase: 2,
    bundleSpacingMm: 400,
    ratedStaticTensionKn: 39.0,
    terrainElevationFromM: 440,
    terrainElevationToM: 485,
    midSpanGroundElevationM: 450,
    statutoryGroundClearanceM: 9.0,
    rightOfWayWidthM: 50,
    vegetationHeightM: 3.5,
    vegetationGrowthRateMmYear: 400,
    riverCrossing: false
  }
];

export const SUBSTATION_BAY_EQUIPMENT_3D: BayEquipment3D[] = [
  {
    id: 'eq-bay-gantry',
    tag: 'GAN-01',
    name: {
      fr: 'Portique d\'Ancrage Ligne 225 kV',
      en: '225 kV Line Overhead Gantry'
    },
    category: 'gantry',
    position3D: { x: 2, y: 0, z: 0 },
    dimensions: { width: 14, depth: 3, height: 22 },
    phase: 'Three-Phase',
    ratedVoltageKv: 245,
    ratedCurrentA: 2500,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'closed',
    iecStandard: 'IEC 60826 / IEC 61936-1',
    aasAssetId: 'aas:bay:gantry:225'
  },
  {
    id: 'eq-bay-sa',
    tag: 'SA-01',
    name: {
      fr: 'Parafoudres Oxyde de Zinc (ZnO)',
      en: 'Metal-Oxide Surge Arresters (ZnO)'
    },
    category: 'surge_arrester',
    position3D: { x: 6, y: 0, z: 0 },
    dimensions: { width: 1.2, depth: 1.2, height: 4.8 },
    phase: 'Three-Phase',
    ratedVoltageKv: 198, // Ur continuous operating
    ratedCurrentA: 0,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'closed',
    thermalHotspotTempC: 38.4,
    iecStandard: 'IEC 60099-4',
    aasAssetId: 'aas:bay:sa:225'
  },
  {
    id: 'eq-bay-cvt',
    tag: 'CVT-01',
    name: {
      fr: 'Transformateurs de Tension Capacitifs (TT/CVT)',
      en: 'Capacitive Voltage Transformers (CVT)'
    },
    category: 'cvt',
    position3D: { x: 10, y: 0, z: 0 },
    dimensions: { width: 1.0, depth: 1.0, height: 5.2 },
    phase: 'Three-Phase',
    ratedVoltageKv: 225 / Math.sqrt(3),
    ratedCurrentA: 1,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'closed',
    thermalHotspotTempC: 34.1,
    iecStandard: 'IEC 61869-5',
    aasAssetId: 'aas:bay:cvt:225'
  },
  {
    id: 'eq-bay-ds-line',
    tag: 'QS-LINE',
    name: {
      fr: 'Sectionneur de Ligne avec Couteau de Terre',
      en: 'Line Disconnector with Earthing Switch'
    },
    category: 'disconnector',
    position3D: { x: 15, y: 0, z: 0 },
    dimensions: { width: 3.5, depth: 2.0, height: 6.2 },
    phase: 'Three-Phase',
    ratedVoltageKv: 245,
    ratedCurrentA: 2500,
    ratedBreakingKa: 40,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'closed',
    thermalHotspotTempC: 42.6,
    iecStandard: 'IEC 62271-102',
    aasAssetId: 'aas:bay:ds_line:225'
  },
  {
    id: 'eq-bay-ct',
    tag: 'CT-01',
    name: {
      fr: 'Transformateurs de Courant Tête Inversée',
      en: 'Inverted Head Current Transformers (CT)'
    },
    category: 'ct',
    position3D: { x: 20, y: 0, z: 0 },
    dimensions: { width: 1.2, depth: 1.2, height: 5.6 },
    phase: 'Three-Phase',
    ratedVoltageKv: 245,
    ratedCurrentA: 2000,
    ratedBreakingKa: 40,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'closed',
    thermalHotspotTempC: 39.8,
    iecStandard: 'IEC 61869-2',
    aasAssetId: 'aas:bay:ct:225'
  },
  {
    id: 'eq-bay-cb',
    tag: 'Q0-CB',
    name: {
      fr: 'Disjoncteur SF6 Tripolaire Auto-Pneumatique',
      en: 'Three-Pole SF6 Auto-Puffer Circuit Breaker'
    },
    category: 'circuit_breaker',
    position3D: { x: 26, y: 0, z: 0 },
    dimensions: { width: 4.8, depth: 2.8, height: 6.8 },
    phase: 'Three-Phase',
    ratedVoltageKv: 245,
    ratedCurrentA: 3150,
    ratedBreakingKa: 50,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'closed',
    thermalHotspotTempC: 45.2,
    sf6GasPressureBar: 6.2,
    iecStandard: 'IEC 62271-100',
    aasAssetId: 'aas:bay:cb:225'
  },
  {
    id: 'eq-bay-ds-bb1',
    tag: 'QS-BB1',
    name: {
      fr: 'Sectionneur d\'Aiguillage Jeu de Barres 1 (BB1)',
      en: 'Busbar 1 Selector Disconnector (Pantograph / Horizontal)'
    },
    category: 'disconnector',
    position3D: { x: 33, y: -4, z: 0 },
    dimensions: { width: 3.5, depth: 2.2, height: 7.2 },
    phase: 'Three-Phase',
    ratedVoltageKv: 245,
    ratedCurrentA: 3150,
    ratedBreakingKa: 50,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'closed',
    thermalHotspotTempC: 41.5,
    iecStandard: 'IEC 62271-102',
    aasAssetId: 'aas:bay:ds_bb1:225'
  },
  {
    id: 'eq-bay-ds-bb2',
    tag: 'QS-BB2',
    name: {
      fr: 'Sectionneur d\'Aiguillage Jeu de Barres 2 (BB2)',
      en: 'Busbar 2 Selector Disconnector'
    },
    category: 'disconnector',
    position3D: { x: 33, y: 4, z: 0 },
    dimensions: { width: 3.5, depth: 2.2, height: 7.2 },
    phase: 'Three-Phase',
    ratedVoltageKv: 245,
    ratedCurrentA: 3150,
    ratedBreakingKa: 50,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'open',
    thermalHotspotTempC: 28.0,
    iecStandard: 'IEC 62271-102',
    aasAssetId: 'aas:bay:ds_bb2:225'
  },
  {
    id: 'eq-bay-bb1-bus',
    tag: 'BUS-BB1',
    name: {
      fr: 'Jeu de Barres 1 Aluminium Tubulaire (Ø 120 mm)',
      en: 'Busbar 1 Tubular Aluminum Bus (120 mm OD)'
    },
    category: 'busbar',
    position3D: { x: 37, y: -4, z: 11.5 },
    dimensions: { width: 1.5, depth: 18, height: 1.5 },
    phase: 'Three-Phase',
    ratedVoltageKv: 245,
    ratedCurrentA: 4000,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'closed',
    thermalHotspotTempC: 46.8,
    iecStandard: 'IEC 61936-1',
    aasAssetId: 'aas:bay:bb1:225'
  },
  {
    id: 'eq-bay-bb2-bus',
    tag: 'BUS-BB2',
    name: {
      fr: 'Jeu de Barres 2 Aluminium Tubulaire (Ø 120 mm)',
      en: 'Busbar 2 Tubular Aluminum Bus (120 mm OD)'
    },
    category: 'busbar',
    position3D: { x: 42, y: 4, z: 14.5 },
    dimensions: { width: 1.5, depth: 18, height: 1.5 },
    phase: 'Three-Phase',
    ratedVoltageKv: 245,
    ratedCurrentA: 4000,
    bilImpulseKv: 1050,
    creepageDistanceMmPerKv: 31,
    operationalState: 'closed',
    thermalHotspotTempC: 43.1,
    iecStandard: 'IEC 61936-1',
    aasAssetId: 'aas:bay:bb2:225'
  },
  {
    id: 'eq-bay-bcu',
    tag: 'BCU-KIOSK',
    name: {
      fr: 'Kiosque de Tranche & Unité de Baie (BCU IEC 61850)',
      en: 'Bay Control Unit (BCU) Local Relay Kiosk (IEC 61850)'
    },
    category: 'bcu_kiosk',
    position3D: { x: 26, y: -8, z: 0 },
    dimensions: { width: 2.5, depth: 2.0, height: 2.4 },
    phase: 'Common',
    ratedVoltageKv: 0.23,
    ratedCurrentA: 32,
    bilImpulseKv: 4,
    creepageDistanceMmPerKv: 16,
    operationalState: 'closed',
    iecStandard: 'IEC 61850-9-2 / IEC 61850-8-1',
    aasAssetId: 'aas:bay:bcu:225'
  }
];

export const CLEARANCE_AUDIT_RULES_225KV: ClearanceRuleAudit[] = [
  {
    ruleCode: 'CLR-N-PHASE-EARTH',
    title: {
      fr: 'Distance minimale d\'isolement Phase-Terre (N)',
      en: 'Minimum Phase-to-Earth Clearance (N)'
    },
    standardRef: 'IEC 61936-1 Table 1 (BIL 1050 kV)',
    voltageKv: 225,
    requiredClearanceMm: 2100,
    actualMeasuredMm: 2350,
    safetyMarginPercent: 11.9,
    status: 'compliant',
    description: {
      fr: 'Distance dans l\'air entre toute partie sous tension non isolée et les structures métalliques mises à la terre.',
      en: 'Clearance in air between uninsulated live conductors and earthed metallic structures.'
    }
  },
  {
    ruleCode: 'CLR-PH-PHASE-PHASE',
    title: {
      fr: 'Distance minimale entre Phases (Phase-Phase)',
      en: 'Minimum Phase-to-Phase Clearance'
    },
    standardRef: 'IEC 61936-1 Section 5.2.3',
    voltageKv: 225,
    requiredClearanceMm: 2500,
    actualMeasuredMm: 3200,
    safetyMarginPercent: 28.0,
    status: 'compliant',
    description: {
      fr: 'Distance axiale entre phases adjacentes pour prévenir tout amorçage diélectrique sous surtension de foudre ou de manoeuvre.',
      en: 'Center-to-center spacing between adjacent phases to withstand lightning and switching surges.'
    }
  },
  {
    ruleCode: 'CLR-H-PEDESTRIAN-WALKWAY',
    title: {
      fr: 'Hauteur minimale au-dessus des allées de circulation (H = 2250 mm + N)',
      en: 'Pedestrian Walkway Safety Height (H = 2250 mm + N)'
    },
    standardRef: 'IEC 61936-1 Figure 1 (Safety distance)',
    voltageKv: 225,
    requiredClearanceMm: 4350, // 2250 + 2100 mm
    actualMeasuredMm: 4800,
    safetyMarginPercent: 10.3,
    status: 'compliant',
    description: {
      fr: 'Garantit la sécurité d\'un agent de maintenance à pied sans risque d\'atteinte de la zone de garde diélectrique.',
      en: 'Ensures absolute safety for ground personnel walking inside the switchyard without risk of flashover.'
    }
  },
  {
    ruleCode: 'CLR-V-VEHICLE-DRIVEWAY',
    title: {
      fr: 'Hauteur minimale de franchissement engins & nacelles',
      en: 'Vehicular Driveway Access Clearance'
    },
    standardRef: 'IEC 61936-1 Section 5.3',
    voltageKv: 225,
    requiredClearanceMm: 5200,
    actualMeasuredMm: 6100,
    safetyMarginPercent: 17.3,
    status: 'compliant',
    description: {
      fr: 'Gabarit de circulation pour grues et camions nacelles d\'entretien au droit des jeux de barres et travées.',
      en: 'Passage clearance envelope for cherry-pickers and maintenance cranes under high-voltage busbars.'
    }
  },
  {
    ruleCode: 'CLR-TRANSFO-FIREWALL',
    title: {
      fr: 'Éloignement pare-feu transformateur / Fosse déportée',
      en: 'Transformer Blast Firewall & Oil Separation Distance'
    },
    standardRef: 'NFPA 850 / IEC 61936-1 Section 8.7',
    voltageKv: 225,
    requiredClearanceMm: 5000,
    actualMeasuredMm: 7200,
    safetyMarginPercent: 44.0,
    status: 'compliant',
    description: {
      fr: 'Mur pare-feu REI 120 et bac de rétention d\'huile avec lit de galets extincteurs pour isoler les déflagrations.',
      en: 'REI 120 fire barrier wall and gravel-covered oil retention bund preventing pool fires and tank rupture.'
    }
  }
];

export const CONDUCTOR_CATALOG: Record<string, ConductorThermalProperties> = {
  'ASTER_570': {
    codeName: 'Aster 570 AAAC',
    crossSectionMm2: 570.2,
    outerDiameterMm: 31.05,
    totalMassKgPerKm: 1572,
    ratedBreakingStrengthKn: 172.5,
    dcResistance20COhmPerKm: 0.0583,
    tempCoeffResistancePerC: 0.0039,
    solarAbsorptionCoeff: 0.85,
    thermalEmissivityCoeff: 0.85,
    maxContinuousOperatingTempC: 75,
    emergencyOperatingTempC: 95
  },
  'CURLEW_ACSR': {
    codeName: 'Curlew ACSR (54/7)',
    crossSectionMm2: 593.4,
    outerDiameterMm: 31.63,
    totalMassKgPerKm: 1982,
    ratedBreakingStrengthKn: 192.0,
    dcResistance20COhmPerKm: 0.0544,
    tempCoeffResistancePerC: 0.0040,
    solarAbsorptionCoeff: 0.88,
    thermalEmissivityCoeff: 0.85,
    maxContinuousOperatingTempC: 80,
    emergencyOperatingTempC: 100
  },
  'DRAKE_ACSR': {
    codeName: 'Drake ACSR (26/7)',
    crossSectionMm2: 468.4,
    outerDiameterMm: 28.14,
    totalMassKgPerKm: 1628,
    ratedBreakingStrengthKn: 140.0,
    dcResistance20COhmPerKm: 0.0718,
    tempCoeffResistancePerC: 0.0040,
    solarAbsorptionCoeff: 0.85,
    thermalEmissivityCoeff: 0.85,
    maxContinuousOperatingTempC: 75,
    emergencyOperatingTempC: 95
  }
};
