/**
 * EPEDE GENERATION DOMAIN — HYDROPOWER SPECIFICATION
 * Step 2: Knowledge Graph Engine, Standards Ontology & Reference Fleet
 * Domain: D01 — Generation | Technology: Hydropower
 */

import type {
  HydroStandardItem,
  HydroPlantInstance,
  HydroGraphNode,
  HydroGraphEdge,
  HydroGraphTraversalResult,
} from '../types/hydropower';

// ============================================================================
// 1. STANDARDS ONTOLOGY (SECTION 34)
// ============================================================================

export const HYDRO_STANDARDS_CATALOG: HydroStandardItem[] = [
  {
    id: 'std-iec-60041',
    code: 'IEC 60041:1991',
    title: {
      fr: 'Essais de réception sur place des turbines hydrauliques, pompes d\'accumulation et pompes-turbines pour la détermination de leurs performances',
      en: 'Field acceptance tests to determine the hydraulic performance of hydraulic turbines, storage pumps and pump-turbines',
    },
    organization: 'IEC',
    editionYear: 1991,
    scopeSummary: {
      fr: 'Définit les méthodes officielles de mesure in situ du débit Q, de la hauteur H et de la puissance P pour valider contractuellement le rendement garanti η.',
      en: 'Specifies field methods for measuring discharge Q, net head H, and shaft power P to verify contractual efficiency guarantees.',
    },
    applicableSubsystems: ['H07', 'H05', 'H19', 'H27'],
    applicableEquipment: ['Francis Runner', 'Pelton Wheel', 'Draft Tube', 'Thermodynamic Method Probes', 'Ultrasonic Flowmeters'],
    requirementType: 'acceptance_test_code',
    lifecycleStage: 'commissioning',
    mandatoryClauses: [
      { clause: 'Clause 6', title: 'Measurement of Discharge', significance: 'Thermodynamic, current-meter, and pressure-time (Gibson) methods' },
      { clause: 'Clause 10', title: 'Computation of Overall Efficiency', significance: 'Formula: η = P_shaft / (ρ * g * Q * H_net)' },
      { clause: 'Clause 13', title: 'Measurement Uncertainty Analysis', significance: 'Maximum acceptable total error band must be <= ±1.5%' },
    ],
  },
  {
    id: 'std-iec-60193',
    code: 'IEC 60193:2019',
    title: {
      fr: 'Turbines hydrauliques, pompes d\'accumulation et pompes-turbines - Essais de réception sur modèle',
      en: 'Hydraulic turbines, storage pumps and pump-turbines - Model acceptance tests',
    },
    organization: 'IEC',
    editionYear: 2019,
    scopeSummary: {
      fr: 'Régit la conception, la construction et les essais en laboratoire sur modèle réduit géométriquement similaire et la transposition des résultats au prototype.',
      en: 'Governs model laboratory testing of scaled homologous runners and scale-effect transposition to prototype turbines.',
    },
    applicableSubsystems: ['H07', 'H27'],
    applicableEquipment: ['Model Runner', 'Test Rig dynamometer', 'Cavitation Stroboscope'],
    requirementType: 'acceptance_test_code',
    lifecycleStage: 'design',
    mandatoryClauses: [
      { clause: 'Clause 5', title: 'Geometrical Homology', significance: 'Strict tolerance limits on blade profiles and surface roughness' },
      { clause: 'Clause 7', title: 'Scale Effect Step-Up', significance: 'Step-up formulas (Osterwalder/Hutton) from model to prototype' },
      { clause: 'Clause 8', title: 'Cavitation Inception & Sigma Tests', significance: 'Validation of critical Thoma plant cavitation coefficient σ_plant' },
    ],
  },
  {
    id: 'std-iec-62270',
    code: 'IEC 62270:2013 / IEEE 1249',
    title: {
      fr: 'Centrales hydroélectriques - Guide d\'automatisation par système informatique',
      en: 'Hydroelectric power plants - Computer-based control - Automation guide',
    },
    organization: 'IEC',
    editionYear: 2013,
    scopeSummary: {
      fr: 'Spécifie l\'architecture fonctionnelle, la redondance des automates (DCS/PLC), la télématique, les asservissements et la sécurité de conduite automatisée des centrales.',
      en: 'Provides guidelines for computer-based control architectures, dual-redundant PLCs, sequence automation, and safety interlocking.',
    },
    applicableSubsystems: ['H18', 'H11', 'H10', 'H20', 'H26'],
    applicableEquipment: ['Master Unit PLC', 'Governor Controller', 'Digital Synchronizer 25', 'SCADA Gateway'],
    requirementType: 'normative_standard',
    lifecycleStage: 'commissioning',
    mandatoryClauses: [
      { clause: 'Clause 4', title: 'Control Hierarchy', significance: 'Local manual, Local auto, Plant central, and Remote NLDC priority' },
      { clause: 'Clause 7', title: 'Automated Sequences', significance: 'Step-by-step logic, permissive matrix, and timeout failure aborts' },
      { clause: 'Clause 9', title: 'Testing and Acceptance', significance: 'Factory Acceptance Testing (FAT) and Site Acceptance Testing (SAT)' },
    ],
  },
  {
    id: 'std-ieee-c37-102',
    code: 'IEEE Std C37.102-2006',
    title: {
      fr: 'Guide IEEE pour la protection des générateurs électriques synchrones',
      en: 'IEEE Guide for AC Generator Protection',
    },
    organization: 'IEEE',
    editionYear: 2006,
    scopeSummary: {
      fr: 'Standard mondial absolu pour les schémas de protection différentielle stator (87G), défaut à la terre (64S/64R), perte d\'excitation (40), puissance inverse (32R) et survitesse.',
      en: 'The definitive engineering standard for generator protection schemes including 87G differential, 64S stator ground, 40 loss of field, and 32R reverse power.',
    },
    applicableSubsystems: ['H17', 'H09', 'H10', 'H21'],
    applicableEquipment: ['Digital Generator Protection Relay', 'Zero-Sequence CT', 'Neutral Grounding Resistor'],
    requirementType: 'normative_standard',
    lifecycleStage: 'commissioning',
    mandatoryClauses: [
      { clause: 'Clause 4.1', title: 'Stator Phase Fault Protection', significance: 'Dual-slope percentage-restrained differential (ANSI 87G)' },
      { clause: 'Clause 4.3', title: '100% Stator Ground Fault Protection', significance: 'Third-harmonic voltage or subharmonic injection (ANSI 64S)' },
      { clause: 'Clause 4.6', title: 'Loss of Excitation (ANSI 40)', significance: 'Offset mho impedance circles on R-X complex diagram' },
    ],
  },
  {
    id: 'std-ieee-421-5',
    code: 'IEEE Std 421.5-2016',
    title: {
      fr: 'Pratiques recommandées pour les modèles de systèmes d\'excitation pour les études de stabilité',
      en: 'IEEE Recommended Practice for Excitation System Models for Power System Stability Studies',
    },
    organization: 'IEEE',
    editionYear: 2016,
    scopeSummary: {
      fr: 'Définit les modèles mathématiques d\'AVR (ST1A, AC4A, DC1A) et de stabilisateurs de réseau de puissance (PSS) pour garantir l\'amortissement des oscillations inter-zones.',
      en: 'Defines canonical excitation and AVR transfer function block diagrams and Power System Stabilizers (PSS2B) for dynamic grid stability.',
    },
    applicableSubsystems: ['H10', 'H09', 'H18', 'H31'],
    applicableEquipment: ['Static Exciter AVR Cubicle', 'Thyristor Gate Pulse Controller', 'PSS Module'],
    requirementType: 'engineering_recommendation',
    lifecycleStage: 'design',
    mandatoryClauses: [
      { clause: 'Clause 7', title: 'Type ST Static Excitation Models', significance: 'Standard representation of potential-source controlled rectifiers' },
      { clause: 'Clause 12', title: 'Power System Stabilizers (PSS)', significance: 'Dual-input (speed + electrical power) acceleration damping' },
    ],
  },
  {
    id: 'std-nfpa-851',
    code: 'NFPA 851',
    title: {
      fr: 'Pratique recommandée pour la protection incendie des centrales hydroélectriques',
      en: 'Recommended Practice for Fire Protection for Hydroelectric Generating Plants',
    },
    organization: 'IEEE',
    editionYear: 2020,
    scopeSummary: {
      fr: 'Régit la conception des barrières coupe-feu, des bacs de rétention d\'huile transformateur, des systèmes déluge et de désenfumage en centrale souterraine.',
      en: 'Prescribes firewalls, transformer oil containment sumps, water spray deluge systems, and smoke extraction in underground powerhouses.',
    },
    applicableSubsystems: ['H22', 'H14', 'H09', 'H24'],
    applicableEquipment: ['Deluge Valves', 'Flame Detectors', 'Oil Separation Sump', 'Inert Gas Extinguishing Banks'],
    requirementType: 'statutory_code',
    lifecycleStage: 'operation_maintenance',
    mandatoryClauses: [
      { clause: 'Chapter 5', title: 'Transformer Fire Protection', significance: 'Dedicated 2-hour firewalls and fast deluge spray actuation' },
      { clause: 'Chapter 6', title: 'Generator Enclosures', significance: 'CO2 or Water-mist automatic flooding upon electrical differential trip' },
    ],
  },
  {
    id: 'std-iso-10816-5',
    code: 'ISO 10816-5:2000 / ISO 20816-5:2018',
    title: {
      fr: 'Vibrations mécaniques - Évaluation des vibrations des machines par mesurages sur les parties non tournantes - Partie 5: Groupes motogénérateurs hydrauliques',
      en: 'Mechanical vibration - Evaluation of machine vibration on non-rotating parts - Part 5: Machine sets in hydraulic power plants',
    },
    organization: 'ISO',
    editionYear: 2018,
    scopeSummary: {
      fr: 'Établit les zones de sévérité vibratoire (Zone A : excellent, Zone B : acceptable, Zone C : alarme, Zone D : arrêt obligatoire) sur les paliers de turbine et d\'alternateur.',
      en: 'Defines vibration severity zones (A: new, B: unrestricted, C: alert, D: trip) measured on bearing housings of hydro sets.',
    },
    applicableSubsystems: ['H08', 'H07', 'H09', 'H19', 'H25'],
    applicableEquipment: ['Piezoelectric Accelerometer', 'Eddy-Current Proximity Probe', 'Vibration Monitor Rack'],
    requirementType: 'normative_standard',
    lifecycleStage: 'operation_maintenance',
    mandatoryClauses: [
      { clause: 'Table 1', title: 'Vibration Velocity Limits (RMS mm/s)', significance: 'Class 1 machines (>40 MW): Warning > 2.8 mm/s, Trip > 4.5 mm/s' },
      { clause: 'Annex A', title: 'Relative Shaft Displacement Limits', significance: 'Shaft runout peak-to-peak must not exceed bearing clearance (S_p-p)' },
    ],
  },
];

// ============================================================================
// 2. CAMEROON REFERENCE FLEET — CONCRETE INSTANCES (SECTIONS 49 & 50)
// ============================================================================

export const CAMEROON_HYDRO_REFERENCE_FLEET: HydroPlantInstance[] = [
  {
    id: 'hydro-songloulou',
    name: 'Centrale Hydroélectrique de Songloulou',
    riverBasin: 'Sanaga River Basin',
    region: 'Littoral, Cameroon',
    classification: 'dam_based',
    installedCapacityMW: 384.0,
    grossHeadM: 40.0,
    totalFlowM3s: 1100.0,
    reservoirVolumeMillionM3: 10.0,
    activeStorageMillionM3: 8.5,
    annualGenerationGWh: 2800.0,
    gridInterconnectionKV: 225.0,
    operator: 'ENEO Cameroon S.A.',
    commissioningYear: 1981,
    coordinates: { lat: 4.3167, lng: 10.4500 },
    interconnectedCorridor: 'Ligne 225 kV Songloulou - Mangombé (Double Terne)',
    keyRoleInNationalGrid: {
      fr: 'Colonne vertébrale du Réseau Interconnecté Sud (RIS). Assure la fourniture électrique de base pour Douala, Edéa et les industries lourdes (Alucam).',
      en: 'Backbone of the Southern Interconnected Grid (RIS). Provides base load and primary frequency control for Douala and the Littoral industrial hub.',
    },
    civilFeatures: {
      damType: 'Concrete gravity dam with rockfill dyke and integrated spillway',
      damHeightM: 35.0,
      crestLengthM: 1020.0,
      spillwayCapacityM3s: 8500.0,
    },
    subsystemsImplemented: [
      'H01', 'H02', 'H03', 'H04', 'H05', 'H07', 'H08', 'H09', 'H10', 'H11',
      'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18', 'H19', 'H20', 'H21',
      'H22', 'H23', 'H25', 'H26', 'H27', 'H28', 'H31',
    ],
    units: [
      {
        unitId: 'SLL-G01',
        unitName: 'Groupe 1 (Francis 48 MW)',
        ratedPowerMW: 48.0,
        ratedApparentPowerMVA: 56.5,
        ratedHeadM: 38.5,
        ratedFlowM3s: 138.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 225 kV',
        commissioningYear: 1981,
        status: 'operational',
      },
      {
        unitId: 'SLL-G02',
        unitName: 'Groupe 2 (Francis 48 MW)',
        ratedPowerMW: 48.0,
        ratedApparentPowerMVA: 56.5,
        ratedHeadM: 38.5,
        ratedFlowM3s: 138.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 225 kV',
        commissioningYear: 1981,
        status: 'operational',
      },
      {
        unitId: 'SLL-G03',
        unitName: 'Groupe 3 (Francis 48 MW)',
        ratedPowerMW: 48.0,
        ratedApparentPowerMVA: 56.5,
        ratedHeadM: 38.5,
        ratedFlowM3s: 138.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 225 kV',
        commissioningYear: 1981,
        status: 'operational',
      },
      {
        unitId: 'SLL-G04',
        unitName: 'Groupe 4 (Francis 48 MW)',
        ratedPowerMW: 48.0,
        ratedApparentPowerMVA: 56.5,
        ratedHeadM: 38.5,
        ratedFlowM3s: 138.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 225 kV',
        commissioningYear: 1981,
        status: 'operational',
      },
      {
        unitId: 'SLL-G05',
        unitName: 'Groupe 5 (Francis 48 MW)',
        ratedPowerMW: 48.0,
        ratedApparentPowerMVA: 56.5,
        ratedHeadM: 38.5,
        ratedFlowM3s: 138.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 225 kV',
        commissioningYear: 1987,
        status: 'operational',
      },
      {
        unitId: 'SLL-G06',
        unitName: 'Groupe 6 (Francis 48 MW)',
        ratedPowerMW: 48.0,
        ratedApparentPowerMVA: 56.5,
        ratedHeadM: 38.5,
        ratedFlowM3s: 138.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 225 kV',
        commissioningYear: 1987,
        status: 'operational',
      },
      {
        unitId: 'SLL-G07',
        unitName: 'Groupe 7 (Francis 48 MW)',
        ratedPowerMW: 48.0,
        ratedApparentPowerMVA: 56.5,
        ratedHeadM: 38.5,
        ratedFlowM3s: 138.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 225 kV',
        commissioningYear: 1988,
        status: 'operational',
      },
      {
        unitId: 'SLL-G08',
        unitName: 'Groupe 8 (Francis 48 MW)',
        ratedPowerMW: 48.0,
        ratedApparentPowerMVA: 56.5,
        ratedHeadM: 38.5,
        ratedFlowM3s: 138.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 225 kV',
        commissioningYear: 1988,
        status: 'operational',
      },
    ],
  },
  {
    id: 'hydro-edea',
    name: 'Complexe Hydroélectrique d\'Edéa (Edéa I, II, III)',
    riverBasin: 'Sanaga River Basin',
    region: 'Littoral, Cameroon',
    classification: 'cascade',
    installedCapacityMW: 276.4,
    grossHeadM: 24.0,
    totalFlowM3s: 1250.0,
    reservoirVolumeMillionM3: 5.0,
    annualGenerationGWh: 1850.0,
    gridInterconnectionKV: 90.0, // Multi-voltage 90/225 kV via Mangombé
    operator: 'ENEO Cameroon S.A.',
    commissioningYear: 1953,
    coordinates: { lat: 3.8000, lng: 10.1333 },
    interconnectedCorridor: 'Liaisons 90 kV Edéa - Mangombé & 90 kV Edéa - Logbaba',
    keyRoleInNationalGrid: {
      fr: 'Site pionnier de l\'hydroélectricité camerounaise. Étage aval immédiat de Songloulou sur la Sanaga, bénéficiant directement de la régulation amont de Lom Pangar.',
      en: 'Historic pioneer hydro plant on the Sanaga. Operates in direct downstream cascade from Songloulou, boosted by Lom Pangar upstream reservoir releases.',
    },
    civilFeatures: {
      damType: 'Multiple diversion weirs and intake canals branching across natural Sanaga waterfalls',
      damHeightM: 20.0,
      crestLengthM: 1400.0,
      spillwayCapacityM3s: 7000.0,
    },
    subsystemsImplemented: [
      'H01', 'H03', 'H04', 'H05', 'H07', 'H08', 'H09', 'H10', 'H11',
      'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18', 'H21', 'H26', 'H31',
    ],
    units: [
      {
        unitId: 'EDE-G1-3',
        unitName: 'Edéa I (3x Francis 11.2 MW)',
        ratedPowerMW: 33.6,
        ratedApparentPowerMVA: 40.0,
        ratedHeadM: 22.0,
        ratedFlowM3s: 165.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.3,
        gsuRatioKV: '10.3 / 90 kV',
        commissioningYear: 1953,
        status: 'operational',
      },
      {
        unitId: 'EDE-G4-9',
        unitName: 'Edéa II (6x Francis 20.8 MW)',
        ratedPowerMW: 124.8,
        ratedApparentPowerMVA: 150.0,
        ratedHeadM: 23.5,
        ratedFlowM3s: 600.0,
        turbineType: 'francis',
        synchronousSpeedRpm: 150.0,
        generatorVoltageKV: 10.3,
        gsuRatioKV: '10.3 / 90 kV',
        commissioningYear: 1958,
        status: 'operational',
      },
      {
        unitId: 'EDE-G10-14',
        unitName: 'Edéa III (5x Kaplan 23.6 MW)',
        ratedPowerMW: 118.0,
        ratedApparentPowerMVA: 140.0,
        ratedHeadM: 24.0,
        ratedFlowM3s: 550.0,
        turbineType: 'kaplan',
        synchronousSpeedRpm: 166.7,
        generatorVoltageKV: 10.3,
        gsuRatioKV: '10.3 / 90 kV',
        commissioningYear: 1975,
        status: 'operational',
      },
    ],
  },
  {
    id: 'hydro-memveele',
    name: 'Centrale Hydroélectrique de Memve\'ele',
    riverBasin: 'Ntem River Basin',
    region: 'South Region, Cameroon (Nyabizan)',
    classification: 'run_of_river',
    installedCapacityMW: 211.0,
    grossHeadM: 285.0,
    totalFlowM3s: 90.0,
    reservoirVolumeMillionM3: 19.0,
    activeStorageMillionM3: 15.0,
    annualGenerationGWh: 1180.0,
    gridInterconnectionKV: 225.0,
    operator: 'EDC (Electricity Development Corporation)',
    commissioningYear: 2017,
    coordinates: { lat: 2.4014, lng: 10.4289 },
    interconnectedCorridor: 'Ligne 225 kV Memve\'ele - Ebolowa - Yaoundé (Ahala/Nomayos)',
    keyRoleInNationalGrid: {
      fr: 'Centrale de haute chute sur le Ntem. Fournit une puissance indispensable pour l\'équilibre de tension et la fourniture de la capitale politique Yaoundé et de la région Sud.',
      en: 'High-head scheme on the Ntem River. Crucial power injection for voltage stabilization and energy supply into Yaoundé and the South Region.',
    },
    civilFeatures: {
      damType: 'Earthfill and concrete diversion weir with 3 km unlined headrace canal',
      damHeightM: 20.0,
      crestLengthM: 1850.0,
      spillwayCapacityM3s: 3200.0,
    },
    subsystemsImplemented: [
      'H01', 'H02', 'H03', 'H04', 'H05', 'H06', 'H07', 'H08', 'H09', 'H10',
      'H11', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18', 'H19', 'H20',
      'H21', 'H22', 'H23', 'H25', 'H26', 'H27', 'H28', 'H30', 'H31',
    ],
    units: [
      {
        unitId: 'MMV-G01',
        unitName: 'Groupe 1 (Francis 52.75 MW)',
        ratedPowerMW: 52.75,
        ratedApparentPowerMVA: 62.0,
        ratedHeadM: 275.0,
        ratedFlowM3s: 22.5,
        turbineType: 'francis',
        synchronousSpeedRpm: 500.0,
        generatorVoltageKV: 11.0,
        gsuRatioKV: '11 / 225 kV',
        commissioningYear: 2017,
        status: 'operational',
      },
      {
        unitId: 'MMV-G02',
        unitName: 'Groupe 2 (Francis 52.75 MW)',
        ratedPowerMW: 52.75,
        ratedApparentPowerMVA: 62.0,
        ratedHeadM: 275.0,
        ratedFlowM3s: 22.5,
        turbineType: 'francis',
        synchronousSpeedRpm: 500.0,
        generatorVoltageKV: 11.0,
        gsuRatioKV: '11 / 225 kV',
        commissioningYear: 2017,
        status: 'operational',
      },
      {
        unitId: 'MMV-G03',
        unitName: 'Groupe 3 (Francis 52.75 MW)',
        ratedPowerMW: 52.75,
        ratedApparentPowerMVA: 62.0,
        ratedHeadM: 275.0,
        ratedFlowM3s: 22.5,
        turbineType: 'francis',
        synchronousSpeedRpm: 500.0,
        generatorVoltageKV: 11.0,
        gsuRatioKV: '11 / 225 kV',
        commissioningYear: 2017,
        status: 'operational',
      },
      {
        unitId: 'MMV-G04',
        unitName: 'Groupe 4 (Francis 52.75 MW)',
        ratedPowerMW: 52.75,
        ratedApparentPowerMVA: 62.0,
        ratedHeadM: 275.0,
        ratedFlowM3s: 22.5,
        turbineType: 'francis',
        synchronousSpeedRpm: 500.0,
        generatorVoltageKV: 11.0,
        gsuRatioKV: '11 / 225 kV',
        commissioningYear: 2017,
        status: 'operational',
      },
    ],
  },
  {
    id: 'hydro-lompangar',
    name: 'Barrage Réservoir & Usine de Lom Pangar',
    riverBasin: 'Sanaga River Basin (Lom & Pangar Rivers confluence)',
    region: 'East Region, Cameroon',
    classification: 'reservoir_impoundment',
    installedCapacityMW: 30.0,
    grossHeadM: 35.0,
    totalFlowM3s: 100.0,
    reservoirVolumeMillionM3: 6000.0, // 6 Billion m3!
    activeStorageMillionM3: 5400.0,
    annualGenerationGWh: 195.0,
    gridInterconnectionKV: 90.0,
    operator: 'EDC (Electricity Development Corporation)',
    commissioningYear: 2016, // Reservoir completed 2016, plant commissioned 2023
    coordinates: { lat: 5.3833, lng: 13.5000 },
    interconnectedCorridor: 'Ligne 90 kV Lom Pangar - Bertoua - Batouri (Réseau Interconnecté Est - RIE)',
    keyRoleInNationalGrid: {
      fr: 'Réservoir de régulation stratégique national de 6 milliards de m³. Rehausse le débit d\'étiage de la Sanaga de 600 m³/s à plus de 1000 m³/s, augmentant la puissance garantie de Songloulou et Edéa de +170 MW.',
      en: 'National strategic storage reservoir holding 6 billion m³. Guarantees dry-season Sanaga flow at >1000 m³/s, boosting Songloulou and Edéa firm downstream capacity by over +170 MW.',
    },
    civilFeatures: {
      damType: 'RCC (Roller Compacted Concrete) dam with rockfill saddle dam',
      damHeightM: 46.0,
      crestLengthM: 1278.0,
      spillwayCapacityM3s: 4100.0,
    },
    subsystemsImplemented: [
      'H01', 'H02', 'H03', 'H04', 'H05', 'H07', 'H08', 'H09', 'H10', 'H11',
      'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18', 'H19', 'H20', 'H21',
      'H28', 'H30', 'H31',
    ],
    units: [
      {
        unitId: 'LMP-G01',
        unitName: 'Groupe de Pied 1 (Kaplan 7.5 MW)',
        ratedPowerMW: 7.5,
        ratedApparentPowerMVA: 9.0,
        ratedHeadM: 32.0,
        ratedFlowM3s: 25.0,
        turbineType: 'kaplan',
        synchronousSpeedRpm: 375.0,
        generatorVoltageKV: 6.6,
        gsuRatioKV: '6.6 / 90 kV',
        commissioningYear: 2023,
        status: 'operational',
      },
      {
        unitId: 'LMP-G02',
        unitName: 'Groupe de Pied 2 (Kaplan 7.5 MW)',
        ratedPowerMW: 7.5,
        ratedApparentPowerMVA: 9.0,
        ratedHeadM: 32.0,
        ratedFlowM3s: 25.0,
        turbineType: 'kaplan',
        synchronousSpeedRpm: 375.0,
        generatorVoltageKV: 6.6,
        gsuRatioKV: '6.6 / 90 kV',
        commissioningYear: 2023,
        status: 'operational',
      },
      {
        unitId: 'LMP-G03',
        unitName: 'Groupe de Pied 3 (Kaplan 7.5 MW)',
        ratedPowerMW: 7.5,
        ratedApparentPowerMVA: 9.0,
        ratedHeadM: 32.0,
        ratedFlowM3s: 25.0,
        turbineType: 'kaplan',
        synchronousSpeedRpm: 375.0,
        generatorVoltageKV: 6.6,
        gsuRatioKV: '6.6 / 90 kV',
        commissioningYear: 2023,
        status: 'operational',
      },
      {
        unitId: 'LMP-G04',
        unitName: 'Groupe de Pied 4 (Kaplan 7.5 MW)',
        ratedPowerMW: 7.5,
        ratedApparentPowerMVA: 9.0,
        ratedHeadM: 32.0,
        ratedFlowM3s: 25.0,
        turbineType: 'kaplan',
        synchronousSpeedRpm: 375.0,
        generatorVoltageKV: 6.6,
        gsuRatioKV: '6.6 / 90 kV',
        commissioningYear: 2023,
        status: 'operational',
      },
    ],
  },
  {
    id: 'hydro-lagdo',
    name: 'Centrale Hydroélectrique de Lagdo',
    riverBasin: 'Benue River Basin',
    region: 'North Region, Cameroon (Garoua)',
    classification: 'multipurpose',
    installedCapacityMW: 72.0,
    grossHeadM: 26.0,
    totalFlowM3s: 320.0,
    reservoirVolumeMillionM3: 7700.0,
    activeStorageMillionM3: 4000.0,
    annualGenerationGWh: 320.0,
    gridInterconnectionKV: 110.0,
    operator: 'ENEO Cameroon S.A.',
    commissioningYear: 1982,
    coordinates: { lat: 9.0667, lng: 13.6500 },
    interconnectedCorridor: 'Lignes 110 kV Lagdo - Garoua & Lagdo - Ngaoundéré (Réseau Interconnecté Nord - RIN)',
    keyRoleInNationalGrid: {
      fr: 'Unique grand centre de production hydroélectrique du grand Nord Cameroun (RIN). Combine l\'alimentation électrique des 3 régions septentrionales avec l\'irrigation de la vallée de la Bénoué.',
      en: 'Sole utility-scale hydro generation anchor for the Northern Interconnected Grid (RIN), simultaneously providing agricultural irrigation to the Benue Valley.',
    },
    civilFeatures: {
      damType: 'Rockfill dam with central clay core and concrete gated spillway',
      damHeightM: 40.0,
      crestLengthM: 308.0,
      spillwayCapacityM3s: 6800.0,
    },
    subsystemsImplemented: [
      'H01', 'H02', 'H03', 'H04', 'H05', 'H07', 'H08', 'H09', 'H10', 'H11',
      'H14', 'H15', 'H16', 'H17', 'H18', 'H21', 'H26', 'H30', 'H31',
    ],
    units: [
      {
        unitId: 'LGD-G01',
        unitName: 'Groupe 1 (Kaplan 18 MW)',
        ratedPowerMW: 18.0,
        ratedApparentPowerMVA: 21.2,
        ratedHeadM: 22.5,
        ratedFlowM3s: 80.0,
        turbineType: 'kaplan',
        synchronousSpeedRpm: 187.5,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 110 kV',
        commissioningYear: 1982,
        status: 'operational',
      },
      {
        unitId: 'LGD-G02',
        unitName: 'Groupe 2 (Kaplan 18 MW)',
        ratedPowerMW: 18.0,
        ratedApparentPowerMVA: 21.2,
        ratedHeadM: 22.5,
        ratedFlowM3s: 80.0,
        turbineType: 'kaplan',
        synchronousSpeedRpm: 187.5,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 110 kV',
        commissioningYear: 1982,
        status: 'operational',
      },
      {
        unitId: 'LGD-G03',
        unitName: 'Groupe 3 (Kaplan 18 MW)',
        ratedPowerMW: 18.0,
        ratedApparentPowerMVA: 21.2,
        ratedHeadM: 22.5,
        ratedFlowM3s: 80.0,
        turbineType: 'kaplan',
        synchronousSpeedRpm: 187.5,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 110 kV',
        commissioningYear: 1982,
        status: 'operational',
      },
      {
        unitId: 'LGD-G04',
        unitName: 'Groupe 4 (Kaplan 18 MW)',
        ratedPowerMW: 18.0,
        ratedApparentPowerMVA: 21.2,
        ratedHeadM: 22.5,
        ratedFlowM3s: 80.0,
        turbineType: 'kaplan',
        synchronousSpeedRpm: 187.5,
        generatorVoltageKV: 10.5,
        gsuRatioKV: '10.5 / 110 kV',
        commissioningYear: 1982,
        status: 'operational',
      },
    ],
  },
];

// ============================================================================
// 3. CANONICAL HYDRO GRAPH NODES & EDGES (SECTIONS 39, 46 & 51)
// ============================================================================

export const HYDRO_CANONICAL_GRAPH_NODES: HydroGraphNode[] = [
  { id: 'node-h01', subsystemId: 'H01', label: { fr: 'Bassin Versant & Rivière', en: 'Catchment & River Resource' }, category: 'civil', domainLayer: 'hydraulic', state: 'flowing', iconName: 'Waves' },
  { id: 'node-h02', subsystemId: 'H02', label: { fr: 'Retenue d\'Eau / Réservoir', en: 'Storage Reservoir' }, category: 'civil', domainLayer: 'hydraulic', state: 'normal_pool', iconName: 'Database' },
  { id: 'node-h03', subsystemId: 'H03', label: { fr: 'Barrage & Évacuateur de Crues', en: 'Dam & Spillway' }, category: 'civil', domainLayer: 'civil', state: 'retaining', iconName: 'Shield' },
  { id: 'node-h04', subsystemId: 'H04', label: { fr: 'Prise d\'Eau & Grilles', en: 'Hydraulic Intake & Trashracks' }, category: 'hydraulic', domainLayer: 'hydraulic', state: 'open', iconName: 'Filter' },
  { id: 'node-h05a', subsystemId: 'H05', label: { fr: 'Galerie d\'Amenée en Charge', en: 'Headrace Pressure Tunnel' }, category: 'hydraulic', domainLayer: 'hydraulic', state: 'pressurized', iconName: 'CircleDot' },
  { id: 'node-h06', subsystemId: 'H06', label: { fr: 'Cheminée d\'Équilibre', en: 'Surge Shaft / Surge Tank' }, category: 'hydraulic', domainLayer: 'hydraulic', state: 'damping', iconName: 'ArrowUpDown' },
  { id: 'node-h05b', subsystemId: 'H05', label: { fr: 'Conduite Forcée & Collecteur', en: 'Penstock & Distributor' }, category: 'hydraulic', domainLayer: 'hydraulic', state: 'pressurized', iconName: 'Sliders' },
  { id: 'node-h07a', subsystemId: 'H07', label: { fr: 'Vanne de Pied & Bâche Spirale', en: 'MIV & Spiral Casing' }, category: 'hydraulic', domainLayer: 'hydraulic', state: 'open', iconName: 'Disc' },
  { id: 'node-h11', subsystemId: 'H11', label: { fr: 'Régulateur de Vitesse & Servomoteurs', en: 'Speed Governor & Servos' }, category: 'control', domainLayer: 'control', state: 'governing', iconName: 'Gauge' },
  { id: 'node-h07b', subsystemId: 'H07', label: { fr: 'Roue de Turbine Hydraulique', en: 'Hydraulic Turbine Runner' }, category: 'mechanical', domainLayer: 'mechanical', state: 'rotating_500rpm', iconName: 'RotateCw' },
  { id: 'node-h08', subsystemId: 'H08', label: { fr: 'Ligne d\'Arbre & Paliers', en: 'Shaft Line & Thrust Bearing' }, category: 'mechanical', domainLayer: 'mechanical', state: 'rotating', iconName: 'Compass' },
  { id: 'node-h13', subsystemId: 'H13', label: { fr: 'Centrale d\'Huile & Lubrification', en: 'Lubrication System' }, category: 'auxiliary', domainLayer: 'auxiliary', state: 'pressurized_film', iconName: 'Droplet' },
  { id: 'node-h12', subsystemId: 'H12', label: { fr: 'Circuit de Refroidissement Groupe', en: 'Generator Cooling System' }, category: 'auxiliary', domainLayer: 'auxiliary', state: 'circulating', iconName: 'Wind' },
  { id: 'node-h09', subsystemId: 'H09', label: { fr: 'Alternateur Synchrone 11 kV', en: 'Synchronous Generator 11 kV' }, category: 'electrical', domainLayer: 'electrical', state: 'energized_synced', iconName: 'Zap' },
  { id: 'node-h10', subsystemId: 'H10', label: { fr: 'Excitation Statique & AVR', en: 'Static Exciter & AVR' }, category: 'control', domainLayer: 'control', state: 'regulating_pf', iconName: 'Cpu' },
  { id: 'node-h17', subsystemId: 'H17', label: { fr: 'Système de Protection Numérique (87G/87T)', en: 'Multifunction Protection (87G/87T)' }, category: 'protection', domainLayer: 'protection', state: 'armed', iconName: 'ShieldAlert' },
  { id: 'node-h16', subsystemId: 'H16', label: { fr: 'Auxiliaires 400V AC & 110V DC', en: 'Station Auxiliaries AC/DC' }, category: 'electrical', domainLayer: 'electrical', state: 'normal_supply', iconName: 'BatteryCharging' },
  { id: 'node-h18', subsystemId: 'H18', label: { fr: 'Automate Groupe & SCADA Usine', en: 'Unit PLC & SCADA DCS' }, category: 'control', domainLayer: 'control', state: 'auto_dispatch', iconName: 'Activity' },
  { id: 'node-h19', subsystemId: 'H19', label: { fr: 'Instrumentation & Capteurs', en: 'Instrumentation & Transducers' }, category: 'control', domainLayer: 'control', state: 'measuring', iconName: 'Thermometer' },
  { id: 'node-h14', subsystemId: 'H14', label: { fr: 'Transformateur Élévateur GSU 11/225 kV', en: 'GSU Transformer 11/225 kV' }, category: 'electrical', domainLayer: 'electrical', state: 'energized_loaded', iconName: 'Share2' },
  { id: 'node-h15', subsystemId: 'H15', label: { fr: 'Poste d\'Évacuation HT 225 kV', en: '225 kV Generating Switchyard' }, category: 'electrical', domainLayer: 'electrical', state: 'closed_connected', iconName: 'Layers' },
  { id: 'node-h31', subsystemId: 'H31', label: { fr: 'Interface Réseau Transport (POI)', en: 'Grid Interface / POI' }, category: 'electrical', domainLayer: 'electrical', state: 'exporting_power', iconName: 'Network' },
];

export const HYDRO_CANONICAL_GRAPH_EDGES: HydroGraphEdge[] = [
  // Primary Energy Journey
  { id: 'e1', sourceId: 'node-h01', targetId: 'node-h02', relation: 'supplies', label: { fr: 'Apport hydrologique', en: 'Hydrological inflow' }, energyDomain: 'hydraulic' },
  { id: 'e2', sourceId: 'node-h02', targetId: 'node-h03', relation: 'controls_flow', label: { fr: 'Retenue par barrage', en: 'Impounded by dam' }, energyDomain: 'hydraulic' },
  { id: 'e3', sourceId: 'node-h02', targetId: 'node-h04', relation: 'conveys', label: { fr: 'Alimente prise d\'eau', en: 'Feeds intake' }, energyDomain: 'hydraulic' },
  { id: 'e4', sourceId: 'node-h04', targetId: 'node-h05a', relation: 'conveys', label: { fr: 'Débit en charge', en: 'Pressurized flow' }, energyDomain: 'hydraulic' },
  { id: 'e5', sourceId: 'node-h05a', targetId: 'node-h06', relation: 'controls_flow', label: { fr: 'Amortissement coup de bélier', en: 'Surge attenuation' }, energyDomain: 'hydraulic' },
  { id: 'e6', sourceId: 'node-h05a', targetId: 'node-h05b', relation: 'conveys', label: { fr: 'Mise en charge haute pression', en: 'High-pressure drop' }, energyDomain: 'hydraulic' },
  { id: 'e7', sourceId: 'node-h05b', targetId: 'node-h07a', relation: 'conveys', label: { fr: 'Entrée distributeur', en: 'Inlet distribution' }, energyDomain: 'hydraulic' },
  { id: 'e8', sourceId: 'node-h07a', targetId: 'node-h07b', relation: 'converts', label: { fr: 'Jet d\'eau sur aubes', en: 'Hydro-kinetic conversion' }, energyDomain: 'hydraulic' },
  { id: 'e9', sourceId: 'node-h07b', targetId: 'node-h08', relation: 'drives', label: { fr: 'Couple mécanique sur l\'arbre', en: 'Mechanical shaft torque' }, energyDomain: 'mechanical' },
  { id: 'e10', sourceId: 'node-h08', targetId: 'node-h09', relation: 'couples_to', label: { fr: 'Entraîne rotor générateur', en: 'Drives generator rotor' }, energyDomain: 'mechanical' },
  { id: 'e11', sourceId: 'node-h09', targetId: 'node-h14', relation: 'energizes', label: { fr: 'Génération 11 kV triphasé', en: '11 kV generation' }, energyDomain: 'electrical' },
  { id: 'e12', sourceId: 'node-h14', targetId: 'node-h15', relation: 'transforms', label: { fr: 'Élévation 11 kV -> 225 kV', en: 'Step-up to 225 kV' }, energyDomain: 'electrical' },
  { id: 'e13', sourceId: 'node-h15', targetId: 'node-h31', relation: 'evacuates_to', label: { fr: 'Injection réseau national', en: 'Grid power export' }, energyDomain: 'electrical' },

  // Control & Governing Loops
  { id: 'e14', sourceId: 'node-h11', targetId: 'node-h07a', relation: 'controls', label: { fr: 'Actionne les directrices', en: 'Actuates wicket gates' }, energyDomain: 'control' },
  { id: 'e15', sourceId: 'node-h08', targetId: 'node-h11', relation: 'measures', label: { fr: 'Mesure de vitesse (tr/min)', en: 'Speed feedback (rpm)' }, energyDomain: 'control' },
  { id: 'e16', sourceId: 'node-h10', targetId: 'node-h09', relation: 'controls', label: { fr: 'Courant continu d\'excitation', en: 'DC rotor excitation' }, energyDomain: 'control' },
  { id: 'e17', sourceId: 'node-h09', targetId: 'node-h10', relation: 'measures', label: { fr: 'Tension stator 11 kV (VT)', en: 'Stator terminal voltage' }, energyDomain: 'control' },
  { id: 'e18', sourceId: 'node-h18', targetId: 'node-h11', relation: 'controls', label: { fr: 'Consigne de puissance P', en: 'Active power setpoint' }, energyDomain: 'control' },
  { id: 'e19', sourceId: 'node-h18', targetId: 'node-h10', relation: 'controls', label: { fr: 'Consigne de tension U/cosφ', en: 'Voltage / reactive setpoint' }, energyDomain: 'control' },

  // Auxiliary Dependencies
  { id: 'e20', sourceId: 'node-h13', targetId: 'node-h08', relation: 'lubricates', label: { fr: 'Film d\'huile hydrodynamique', en: 'Hydrodynamic oil film' }, energyDomain: 'auxiliary' },
  { id: 'e21', sourceId: 'node-h12', targetId: 'node-h09', relation: 'cools', label: { fr: 'Eau de refroidissement stator', en: 'Stator cooling water' }, energyDomain: 'auxiliary' },
  { id: 'e22', sourceId: 'node-h16', targetId: 'node-h17', relation: 'supplies', label: { fr: 'Alimentation 110V DC sécurisée', en: 'Secure 110V DC supply' }, energyDomain: 'auxiliary' },
  { id: 'e23', sourceId: 'node-h16', targetId: 'node-h18', relation: 'supplies', label: { fr: 'Alimentation 24V/230V UPS', en: 'UPS control power' }, energyDomain: 'auxiliary' },

  // Protection & Tripping Matrices
  { id: 'e24', sourceId: 'node-h17', targetId: 'node-h09', relation: 'protects', label: { fr: 'Protection différentielle (87G)', en: 'Differential protection (87G)' }, energyDomain: 'protection' },
  { id: 'e25', sourceId: 'node-h17', targetId: 'node-h14', relation: 'protects', label: { fr: 'Protection différentielle (87T)', en: 'Differential protection (87T)' }, energyDomain: 'protection' },
  { id: 'e26', sourceId: 'node-h17', targetId: 'node-h15', relation: 'trips', label: { fr: 'Déclenchement disjoncteur HT', en: 'HV breaker trip command' }, energyDomain: 'protection' },
  { id: 'e27', sourceId: 'node-h17', targetId: 'node-h10', relation: 'trips', label: { fr: 'Ouverture disjoncteur de champ 41', en: 'Field breaker trip command' }, energyDomain: 'protection' },
  { id: 'e28', sourceId: 'node-h17', targetId: 'node-h11', relation: 'trips', label: { fr: 'Fermeture d\'urgence vanne/directrices', en: 'Emergency governor trip' }, energyDomain: 'protection' },

  // Instrumentation & Monitoring
  { id: 'e29', sourceId: 'node-h19', targetId: 'node-h08', relation: 'monitors', label: { fr: 'Vibrations & température paliers', en: 'Bearing temp & vibration' }, energyDomain: 'control' },
  { id: 'e30', sourceId: 'node-h19', targetId: 'node-h09', relation: 'monitors', label: { fr: 'Sondes RTD cuivre stator', en: 'Stator RTD temperatures' }, energyDomain: 'control' },
];

// ============================================================================
// 4. GRAPH TRAVERSAL & QUERY ENGINE (SECTION 51)
// ============================================================================

/**
 * Traverses the EPEDE Hydropower Knowledge Graph from any arbitrary node.
 * Supports Upstream (causes, energy source, upstream hydraulics),
 * Downstream (power evacuation, mechanical drives, protection trip destinations),
 * or Complete Graph Neighborhood.
 */
export function traverseHydroGraph(
  startNodeId: string,
  direction: 'upstream' | 'downstream' | 'all' = 'all'
): HydroGraphTraversalResult {
  const startNode = HYDRO_CANONICAL_GRAPH_NODES.find((n) => n.id === startNodeId);

  if (!startNode) {
    return {
      startNodeId,
      direction,
      nodes: [],
      edges: [],
      explanation: {
        fr: `Nœud introuvable dans le graphe hydroélectrique : ${startNodeId}`,
        en: `Node not found in the hydropower knowledge graph: ${startNodeId}`,
      },
    };
  }

  const visitedNodeIds = new Set<string>([startNodeId]);
  const collectedEdgeIds = new Set<string>();

  // Helper for 1-hop and 2-hop search
  const queue: { nodeId: string; depth: number }[] = [{ nodeId: startNodeId, depth: 0 }];
  const maxDepth = 3;

  while (queue.length > 0) {
    const { nodeId, depth } = queue.shift()!;
    if (depth >= maxDepth) continue;

    for (const edge of HYDRO_CANONICAL_GRAPH_EDGES) {
      if (direction === 'downstream' || direction === 'all') {
        if (edge.sourceId === nodeId) {
          collectedEdgeIds.add(edge.id);
          if (!visitedNodeIds.has(edge.targetId)) {
            visitedNodeIds.add(edge.targetId);
            queue.push({ nodeId: edge.targetId, depth: depth + 1 });
          }
        }
      }

      if (direction === 'upstream' || direction === 'all') {
        if (edge.targetId === nodeId) {
          collectedEdgeIds.add(edge.id);
          if (!visitedNodeIds.has(edge.sourceId)) {
            visitedNodeIds.add(edge.sourceId);
            queue.push({ nodeId: edge.sourceId, depth: depth + 1 });
          }
        }
      }
    }
  }

  const nodes = HYDRO_CANONICAL_GRAPH_NODES.filter((n) => visitedNodeIds.has(n.id));
  const edges = HYDRO_CANONICAL_GRAPH_EDGES.filter((e) => collectedEdgeIds.has(e.id));

  let explanationFr = '';
  let explanationEn = '';

  if (direction === 'upstream') {
    explanationFr = `Chemin amont pour « ${startNode.label.fr} » : ${nodes.length} composants identifiés jusqu'à la ressource en eau primaire.`;
    explanationEn = `Upstream chain for "${startNode.label.en}": ${nodes.length} components traced back to water resource origins.`;
  } else if (direction === 'downstream') {
    explanationFr = `Chemin aval pour « ${startNode.label.fr} » : ${nodes.length} équipements en aval jusqu'à l'évacuation réseau 225 kV.`;
    explanationEn = `Downstream chain for "${startNode.label.en}": ${nodes.length} downstream assets traced toward grid injection.`;
  } else {
    explanationFr = `Voisinage multidimensionnel pour « ${startNode.label.fr} » : ${nodes.length} nœuds et ${edges.length} relations physiques/électriques/contrôle.`;
    explanationEn = `Multi-dimensional neighborhood for "${startNode.label.en}": ${nodes.length} nodes and ${edges.length} physical/electrical/control edges.`;
  }

  return {
    startNodeId,
    direction,
    nodes,
    edges,
    explanation: { fr: explanationFr, en: explanationEn },
  };
}

/**
 * Traverses the exact protection chain for a specific electrical or mechanical asset.
 */
export function getProtectionChainForEquipment(nodeId: string): HydroGraphTraversalResult {
  const protectionEdges = HYDRO_CANONICAL_GRAPH_EDGES.filter(
    (e) => (e.sourceId === nodeId || e.targetId === nodeId) && (e.energyDomain === 'protection' || e.relation === 'trips' || e.relation === 'protects')
  );

  const nodeIds = new Set<string>([nodeId]);
  protectionEdges.forEach((e) => {
    nodeIds.add(e.sourceId);
    nodeIds.add(e.targetId);
  });

  const nodes = HYDRO_CANONICAL_GRAPH_NODES.filter((n) => nodeIds.has(n.id));

  return {
    startNodeId: nodeId,
    direction: 'all',
    nodes,
    edges: protectionEdges,
    explanation: {
      fr: `Matrice de protection et organes de déclenchement associés à l'équipement sélectionné.`,
      en: `Protection matrix and trip destinations associated with selected equipment.`,
    },
  };
}
