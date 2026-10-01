// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 21 DATA ENGINE
// STEP 21: Asset Health Index (AHI), Multi-Physics Aging, Remaining Useful Life
// (RUL), DGA Duval Triangle (IEC 60599), Vibration (ISO 10816-5) & ISO 55001 CMMS
// ============================================================================

import type {
  UnitAssetHealth,
  TransformerDgaAnalysis,
  VibrationAnalysis,
  CmmsWorkOrder,
  PlantLifeExtensionScenario,
  DuvalFaultType,
} from '../types/hydropowerAssetHealth';

// ============================================================================
// 1. FLEET ASSET HEALTH INDEX (AHI) — 7 UNITS (420 MW NACHTIGAL)
// ============================================================================

export const UNITS_ASSET_HEALTH_DATA: UnitAssetHealth[] = [
  {
    unitId: 'G01',
    name: 'Groupe G01 (60 MW / 70 MVA)',
    unitOverallAhi: 91.8,
    grade: 'EXCELLENT',
    equivalentOperatingHours: 15420,
    startStopCyclesCount: 312,
    emergencyTripsCount: 4,
    estimatedRulYears: 36.5,
    components: {
      francisRunner: {
        componentId: 'G01-RUNNER',
        nameFr: 'Roue Francis 13Cr-4Ni (D = 4.65 m)',
        nameEn: 'Francis Runner 13Cr-4Ni (D = 4.65 m)',
        healthIndex: 92.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.30,
        primaryStressorsFr: ['Cavitation d\'interstice d\'aube', 'Érosion sableuse Sanaga (IEC 62364)', 'Fatigue cyclique Wöhler'],
        primaryStressorsEn: ['Blade tip cavitation', 'Sanaga sand silt abrasion (IEC 62364)', 'Cyclic Wöhler fatigue'],
        lastInspectionDate: '2026-06-15',
        diagnosticStandard: 'IEC 62364 / ISO 18436',
      },
      generatorStator: {
        componentId: 'G01-STATOR',
        nameFr: 'Bobinage Statorique 13.8 kV Classe F',
        nameEn: 'Stator Winding 13.8 kV Class F',
        healthIndex: 93.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.25,
        primaryStressorsFr: ['Vieillissement thermique Arrhenius (115°C max)', 'Décharges partielles PD slot', 'Contraintes électrodynamiques'],
        primaryStressorsEn: ['Thermal Arrhenius aging (115°C max)', 'Slot partial discharges PD', 'Electrodynamic cyclic stresses'],
        lastInspectionDate: '2026-05-20',
        diagnosticStandard: 'IEC 60034-27-1 / IEEE 43',
      },
      stepUpTransformer: {
        componentId: 'G01-GSU-XFR',
        nameFr: 'Transfo Élévateur GSU 77 MVA 13.8/225 kV',
        nameEn: 'Step-Up Transformer 77 MVA 13.8/225 kV',
        healthIndex: 89.5,
        grade: 'GOOD',
        weightInUnitAhi: 0.20,
        primaryStressorsFr: ['Surchauffe ponctuelle huile minérale', 'Humidité dans le papier isolant Kraft', 'Chocs de court-circuit réseau 225 kV'],
        primaryStressorsEn: ['Mineral oil localized thermal hot spots', 'Kraft paper moisture degradation', '225 kV grid short-circuit electrodynamic shocks'],
        lastInspectionDate: '2026-07-02',
        diagnosticStandard: 'IEC 60599 / IEEE C57.104',
      },
      thrustBearings: {
        componentId: 'G01-BEARINGS',
        nameFr: 'Butée Principale & Paliers Michell (Film Huile)',
        nameEn: 'Michell Thrust & Guide Bearings (Oil Wedge)',
        healthIndex: 94.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.15,
        primaryStressorsFr: ['Rupture de coin d\'huile aux démarrages lents', 'Micro-usure garniture régule (Babbitt)', 'Vibration sub-harmonique'],
        primaryStressorsEn: ['Oil wedge hydrodynamic loss on slow rolling', 'Babbitt white metal micro-wear', 'Sub-harmonic hydraulic vibration'],
        lastInspectionDate: '2026-08-10',
        diagnosticStandard: 'ISO 10816-5 / ISO 7919-5',
      },
      penstockDraftTube: {
        componentId: 'G01-PENSTOCK',
        nameFr: 'Blindage Conduite Forcée & Aspirateur',
        nameEn: 'Steel Penstock & Draft Tube Liner',
        healthIndex: 91.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.10,
        primaryStressorsFr: ['Coups de bélier & surpressions transitoires', 'Corrosion caverneuse sous dépôts', 'Pression pulsante de vortex (Rheingans)'],
        primaryStressorsEn: ['Water hammer transient pressure surges', 'Under-deposit crevice corrosion', 'Rheingans vortex core pressure pulsation'],
        lastInspectionDate: '2026-04-12',
        diagnosticStandard: 'ASME Section XI / USBR Water & Power',
      },
    },
  },
  {
    unitId: 'G02',
    name: 'Groupe G02 (60 MW / 70 MVA)',
    unitOverallAhi: 93.4,
    grade: 'EXCELLENT',
    equivalentOperatingHours: 14200,
    startStopCyclesCount: 260,
    emergencyTripsCount: 2,
    estimatedRulYears: 37.8,
    components: {
      francisRunner: {
        componentId: 'G02-RUNNER',
        nameFr: 'Roue Francis 13Cr-4Ni',
        nameEn: 'Francis Runner 13Cr-4Ni',
        healthIndex: 94.2,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.30,
        primaryStressorsFr: ['Cavitation', 'Érosion sableuse'],
        primaryStressorsEn: ['Cavitation', 'Silt abrasion'],
        lastInspectionDate: '2026-06-18',
        diagnosticStandard: 'IEC 62364',
      },
      generatorStator: {
        componentId: 'G02-STATOR',
        nameFr: 'Bobinage Statorique 13.8 kV',
        nameEn: 'Stator Winding 13.8 kV',
        healthIndex: 94.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.25,
        primaryStressorsFr: ['Température statorique', 'Décharges partielles'],
        primaryStressorsEn: ['Stator temp', 'Partial discharges'],
        lastInspectionDate: '2026-05-22',
        diagnosticStandard: 'IEC 60034-27-1',
      },
      stepUpTransformer: {
        componentId: 'G02-GSU-XFR',
        nameFr: 'Transfo Élévateur GSU 77 MVA',
        nameEn: 'Step-Up Transformer 77 MVA',
        healthIndex: 91.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.20,
        primaryStressorsFr: ['Oxydation huile', 'Gaz dissous DGA'],
        primaryStressorsEn: ['Oil oxidation', 'DGA dissolved gases'],
        lastInspectionDate: '2026-07-05',
        diagnosticStandard: 'IEC 60599',
      },
      thrustBearings: {
        componentId: 'G02-BEARINGS',
        nameFr: 'Butée & Paliers Michell',
        nameEn: 'Michell Thrust & Bearings',
        healthIndex: 95.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.15,
        primaryStressorsFr: ['Température des patins (62°C)'],
        primaryStressorsEn: ['Pad temperature (62°C)'],
        lastInspectionDate: '2026-08-12',
        diagnosticStandard: 'ISO 10816-5',
      },
      penstockDraftTube: {
        componentId: 'G02-PENSTOCK',
        nameFr: 'Blindage Conduite Forcée',
        nameEn: 'Steel Penstock Liner',
        healthIndex: 92.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.10,
        primaryStressorsFr: ['Transitoires de pression'],
        primaryStressorsEn: ['Pressure transients'],
        lastInspectionDate: '2026-04-15',
        diagnosticStandard: 'ASME Section XI',
      },
    },
  },
  {
    unitId: 'G03',
    name: 'Groupe G03 (60 MW / 70 MVA)',
    unitOverallAhi: 92.1,
    grade: 'EXCELLENT',
    equivalentOperatingHours: 13900,
    startStopCyclesCount: 285,
    emergencyTripsCount: 3,
    estimatedRulYears: 37.0,
    components: {
      francisRunner: {
        componentId: 'G03-RUNNER',
        nameFr: 'Roue Francis 13Cr-4Ni',
        nameEn: 'Francis Runner 13Cr-4Ni',
        healthIndex: 91.8,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.30,
        primaryStressorsFr: ['Cavitation zone de sortie aube'],
        primaryStressorsEn: ['Blade trailing edge cavitation'],
        lastInspectionDate: '2026-06-20',
        diagnosticStandard: 'IEC 62364',
      },
      generatorStator: {
        componentId: 'G03-STATOR',
        nameFr: 'Bobinage Statorique 13.8 kV',
        nameEn: 'Stator Winding 13.8 kV',
        healthIndex: 93.2,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.25,
        primaryStressorsFr: ['Contrainte diélectrique'],
        primaryStressorsEn: ['Dielectric stress'],
        lastInspectionDate: '2026-05-25',
        diagnosticStandard: 'IEC 60034-27-1',
      },
      stepUpTransformer: {
        componentId: 'G03-GSU-XFR',
        nameFr: 'Transfo Élévateur GSU 77 MVA',
        nameEn: 'Step-Up Transformer 77 MVA',
        healthIndex: 90.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.20,
        primaryStressorsFr: ['Gaz dissous DGA stables'],
        primaryStressorsEn: ['Stable DGA gases'],
        lastInspectionDate: '2026-07-08',
        diagnosticStandard: 'IEC 60599',
      },
      thrustBearings: {
        componentId: 'G03-BEARINGS',
        nameFr: 'Butée & Paliers Michell',
        nameEn: 'Michell Thrust & Bearings',
        healthIndex: 93.8,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.15,
        primaryStressorsFr: ['Film hydrodynamique 48 µm'],
        primaryStressorsEn: ['Hydrodynamic film 48 µm'],
        lastInspectionDate: '2026-08-14',
        diagnosticStandard: 'ISO 10816-5',
      },
      penstockDraftTube: {
        componentId: 'G03-PENSTOCK',
        nameFr: 'Blindage Conduite Forcée',
        nameEn: 'Steel Penstock Liner',
        healthIndex: 91.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.10,
        primaryStressorsFr: ['Vortex de torche d\'aspiration'],
        primaryStressorsEn: ['Draft tube vortex surge'],
        lastInspectionDate: '2026-04-18',
        diagnosticStandard: 'ASME Section XI',
      },
    },
  },
  {
    unitId: 'G04',
    name: 'Groupe G04 (60 MW / 70 MVA)',
    unitOverallAhi: 94.2,
    grade: 'EXCELLENT',
    equivalentOperatingHours: 12800,
    startStopCyclesCount: 220,
    emergencyTripsCount: 1,
    estimatedRulYears: 38.2,
    components: {
      francisRunner: {
        componentId: 'G04-RUNNER',
        nameFr: 'Roue Francis 13Cr-4Ni',
        nameEn: 'Francis Runner 13Cr-4Ni',
        healthIndex: 95.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.30,
        primaryStressorsFr: ['Usure mineure sableuse'],
        primaryStressorsEn: ['Minor quartz silt erosion'],
        lastInspectionDate: '2026-06-22',
        diagnosticStandard: 'IEC 62364',
      },
      generatorStator: {
        componentId: 'G04-STATOR',
        nameFr: 'Bobinage Statorique 13.8 kV',
        nameEn: 'Stator Winding 13.8 kV',
        healthIndex: 95.2,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.25,
        primaryStressorsFr: ['Indice de polarisation PI = 2.8'],
        primaryStressorsEn: ['Polarization index PI = 2.8'],
        lastInspectionDate: '2026-05-28',
        diagnosticStandard: 'IEEE 43',
      },
      stepUpTransformer: {
        componentId: 'G04-GSU-XFR',
        nameFr: 'Transfo Élévateur GSU 77 MVA',
        nameEn: 'Step-Up Transformer 77 MVA',
        healthIndex: 92.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.20,
        primaryStressorsFr: ['Rigidité diélectrique 72 kV'],
        primaryStressorsEn: ['Dielectric breakdown 72 kV'],
        lastInspectionDate: '2026-07-10',
        diagnosticStandard: 'IEC 60156',
      },
      thrustBearings: {
        componentId: 'G04-BEARINGS',
        nameFr: 'Butée & Paliers Michell',
        nameEn: 'Michell Thrust & Bearings',
        healthIndex: 95.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.15,
        primaryStressorsFr: ['Vibration 1.2 mm/s RMS'],
        primaryStressorsEn: ['Vibration 1.2 mm/s RMS'],
        lastInspectionDate: '2026-08-16',
        diagnosticStandard: 'ISO 10816-5',
      },
      penstockDraftTube: {
        componentId: 'G04-PENSTOCK',
        nameFr: 'Blindage Conduite Forcée',
        nameEn: 'Steel Penstock Liner',
        healthIndex: 93.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.10,
        primaryStressorsFr: ['Épaisseur d\'acier nominale'],
        primaryStressorsEn: ['Nominal steel thickness'],
        lastInspectionDate: '2026-04-20',
        diagnosticStandard: 'ASME Section XI',
      },
    },
  },
  {
    unitId: 'G05',
    name: 'Groupe G05 (60 MW / 70 MVA)',
    unitOverallAhi: 90.5,
    grade: 'EXCELLENT',
    equivalentOperatingHours: 16100,
    startStopCyclesCount: 345,
    emergencyTripsCount: 5,
    estimatedRulYears: 35.8,
    components: {
      francisRunner: {
        componentId: 'G05-RUNNER',
        nameFr: 'Roue Francis 13Cr-4Ni',
        nameEn: 'Francis Runner 13Cr-4Ni',
        healthIndex: 89.5,
        grade: 'GOOD',
        weightInUnitAhi: 0.30,
        primaryStressorsFr: ['Cavitation modérée bord de fuite'],
        primaryStressorsEn: ['Moderate trailing edge cavitation'],
        lastInspectionDate: '2026-06-25',
        diagnosticStandard: 'IEC 62364',
      },
      generatorStator: {
        componentId: 'G05-STATOR',
        nameFr: 'Bobinage Statorique 13.8 kV',
        nameEn: 'Stator Winding 13.8 kV',
        healthIndex: 91.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.25,
        primaryStressorsFr: ['Échauffement ponctuel en charge'],
        primaryStressorsEn: ['Peak load temperature hot spot'],
        lastInspectionDate: '2026-05-30',
        diagnosticStandard: 'IEC 60034-27-1',
      },
      stepUpTransformer: {
        componentId: 'G05-GSU-XFR',
        nameFr: 'Transfo Élévateur GSU 77 MVA',
        nameEn: 'Step-Up Transformer 77 MVA',
        healthIndex: 88.0,
        grade: 'GOOD',
        weightInUnitAhi: 0.20,
        primaryStressorsFr: ['Éthylène C2H4 en légère hausse'],
        primaryStressorsEn: ['Slight ethylene C2H4 trend'],
        lastInspectionDate: '2026-07-12',
        diagnosticStandard: 'IEC 60599',
      },
      thrustBearings: {
        componentId: 'G05-BEARINGS',
        nameFr: 'Butée & Paliers Michell',
        nameEn: 'Michell Thrust & Bearings',
        healthIndex: 92.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.15,
        primaryStressorsFr: ['Vibration 1.9 mm/s RMS (Zone B)'],
        primaryStressorsEn: ['Vibration 1.9 mm/s RMS (Zone B)'],
        lastInspectionDate: '2026-08-18',
        diagnosticStandard: 'ISO 10816-5',
      },
      penstockDraftTube: {
        componentId: 'G05-PENSTOCK',
        nameFr: 'Blindage Conduite Forcée',
        nameEn: 'Steel Penstock Liner',
        healthIndex: 91.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.10,
        primaryStressorsFr: ['Surpressions transitoires'],
        primaryStressorsEn: ['Surge pressures'],
        lastInspectionDate: '2026-04-22',
        diagnosticStandard: 'ASME Section XI',
      },
    },
  },
  {
    unitId: 'G06',
    name: 'Groupe G06 (60 MW / 70 MVA)',
    unitOverallAhi: 93.8,
    grade: 'EXCELLENT',
    equivalentOperatingHours: 11900,
    startStopCyclesCount: 195,
    emergencyTripsCount: 1,
    estimatedRulYears: 38.5,
    components: {
      francisRunner: {
        componentId: 'G06-RUNNER',
        nameFr: 'Roue Francis 13Cr-4Ni',
        nameEn: 'Francis Runner 13Cr-4Ni',
        healthIndex: 94.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.30,
        primaryStressorsFr: ['État de surface impeccable'],
        primaryStressorsEn: ['Impeccable surface condition'],
        lastInspectionDate: '2026-06-28',
        diagnosticStandard: 'IEC 62364',
      },
      generatorStator: {
        componentId: 'G06-STATOR',
        nameFr: 'Bobinage Statorique 13.8 kV',
        nameEn: 'Stator Winding 13.8 kV',
        healthIndex: 94.8,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.25,
        primaryStressorsFr: ['Faible niveau de DP (< 150 pC)'],
        primaryStressorsEn: ['Low PD level (< 150 pC)'],
        lastInspectionDate: '2026-06-02',
        diagnosticStandard: 'IEC 60034-27-1',
      },
      stepUpTransformer: {
        componentId: 'G06-GSU-XFR',
        nameFr: 'Transfo Élévateur GSU 77 MVA',
        nameEn: 'Step-Up Transformer 77 MVA',
        healthIndex: 92.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.20,
        primaryStressorsFr: ['Huile conforme classe A'],
        primaryStressorsEn: ['Class A compliant oil'],
        lastInspectionDate: '2026-07-15',
        diagnosticStandard: 'IEC 60599',
      },
      thrustBearings: {
        componentId: 'G06-BEARINGS',
        nameFr: 'Butée & Paliers Michell',
        nameEn: 'Michell Thrust & Bearings',
        healthIndex: 95.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.15,
        primaryStressorsFr: ['Température 59°C'],
        primaryStressorsEn: ['Temperature 59°C'],
        lastInspectionDate: '2026-08-20',
        diagnosticStandard: 'ISO 10816-5',
      },
      penstockDraftTube: {
        componentId: 'G06-PENSTOCK',
        nameFr: 'Blindage Conduite Forcée',
        nameEn: 'Steel Penstock Liner',
        healthIndex: 93.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.10,
        primaryStressorsFr: ['Absence d\'ovalisation'],
        primaryStressorsEn: ['Zero out-of-roundness'],
        lastInspectionDate: '2026-04-25',
        diagnosticStandard: 'ASME Section XI',
      },
    },
  },
  {
    unitId: 'G07',
    name: 'Groupe G07 (60 MW / 70 MVA)',
    unitOverallAhi: 94.9,
    grade: 'EXCELLENT',
    equivalentOperatingHours: 10400,
    startStopCyclesCount: 160,
    emergencyTripsCount: 0,
    estimatedRulYears: 39.0,
    components: {
      francisRunner: {
        componentId: 'G07-RUNNER',
        nameFr: 'Roue Francis 13Cr-4Ni',
        nameEn: 'Francis Runner 13Cr-4Ni',
        healthIndex: 95.8,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.30,
        primaryStressorsFr: ['Neuf / Dernier groupe commissionné'],
        primaryStressorsEn: ['New / Latest commissioned unit'],
        lastInspectionDate: '2026-07-01',
        diagnosticStandard: 'IEC 62364',
      },
      generatorStator: {
        componentId: 'G07-STATOR',
        nameFr: 'Bobinage Statorique 13.8 kV',
        nameEn: 'Stator Winding 13.8 kV',
        healthIndex: 96.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.25,
        primaryStressorsFr: ['Isolation neuve sous vide (VPI)'],
        primaryStressorsEn: ['New VPI insulation'],
        lastInspectionDate: '2026-06-05',
        diagnosticStandard: 'IEC 60034-27-1',
      },
      stepUpTransformer: {
        componentId: 'G07-GSU-XFR',
        nameFr: 'Transfo Élévateur GSU 77 MVA',
        nameEn: 'Step-Up Transformer 77 MVA',
        healthIndex: 93.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.20,
        primaryStressorsFr: ['Gaz dissous quasi nuls'],
        primaryStressorsEn: ['Near-zero dissolved gases'],
        lastInspectionDate: '2026-07-18',
        diagnosticStandard: 'IEC 60599',
      },
      thrustBearings: {
        componentId: 'G07-BEARINGS',
        nameFr: 'Butée & Paliers Michell',
        nameEn: 'Michell Thrust & Bearings',
        healthIndex: 96.0,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.15,
        primaryStressorsFr: ['Alignement laser optique parfait'],
        primaryStressorsEn: ['Perfect laser optical alignment'],
        lastInspectionDate: '2026-08-22',
        diagnosticStandard: 'ISO 10816-5',
      },
      penstockDraftTube: {
        componentId: 'G07-PENSTOCK',
        nameFr: 'Blindage Conduite Forcée',
        nameEn: 'Steel Penstock Liner',
        healthIndex: 93.5,
        grade: 'EXCELLENT',
        weightInUnitAhi: 0.10,
        primaryStressorsFr: ['Contrôle magnétoscopique conforme'],
        primaryStressorsEn: ['Magnetic particle inspection OK'],
        lastInspectionDate: '2026-04-28',
        diagnosticStandard: 'ASME Section XI',
      },
    },
  },
];

// ============================================================================
// 2. DGA & DUVAL TRIANGLE 1 (IEC 60599) DATA & ZONE CLASSIFIER
// ============================================================================

export function calculateDuvalZone(
  ch4: number,
  c2h4: number,
  c2h2: number
): {
  pctCh4: number;
  pctC2h4: number;
  pctC2h2: number;
  diagnosedFault: DuvalFaultType;
  faultDescriptionFr: string;
  faultDescriptionEn: string;
  recommendedActionFr: string;
  recommendedActionEn: string;
} {
  const sum = ch4 + c2h4 + c2h2;
  if (sum <= 0) {
    return {
      pctCh4: 100,
      pctC2h4: 0,
      pctC2h2: 0,
      diagnosedFault: 'NORMAL',
      faultDescriptionFr: 'Gaz dissous dans les seuils normaux (état sain).',
      faultDescriptionEn: 'Dissolved gases within normal baseline thresholds (healthy state).',
      recommendedActionFr: 'Poursuite de la surveillance DGA périodique semestrielle.',
      recommendedActionEn: 'Continue regular semi-annual DGA monitoring.',
    };
  }

  const pctCh4 = Number(((ch4 / sum) * 100).toFixed(1));
  const pctC2h4 = Number(((c2h4 / sum) * 100).toFixed(1));
  const pctC2h2 = Number(((c2h2 / sum) * 100).toFixed(1));

  let fault: DuvalFaultType = 'NORMAL';
  let descFr = '';
  let descEn = '';
  let actionFr = '';
  let actionEn = '';

  // Duval Triangle 1 Zones standard logic (IEC 60599):
  if (pctCh4 >= 98.0) {
    fault = 'PD';
    descFr = 'Décharges partielles (effet couronne) dans des bulles de gaz ou cavités d\'isolation solide.';
    descEn = 'Partial discharges (corona) in gas voids or solid insulation.';
    actionFr = 'Mesure acoustique/électrique des décharges partielles (IEC 60270). Resserrement des cales de bobinage.',
    actionEn = 'Electrical/acoustic PD testing (IEC 60270). Tighten winding clamping blocks.';
  } else if (pctC2h2 < 4.0 && pctC2h4 < 20.0) {
    fault = 'T1';
    descFr = 'Défaut thermique basse température (T < 300°C) : surchauffe modérée des connexions ou tôles magnétiques.';
    descEn = 'Low-temperature thermal fault (T < 300°C): moderate overheating of connections or core laminations.';
    actionFr = 'Contrôle thermographique IR des traversées 225 kV et vérification du débit des aéroréfrigérants ONAF.',
    actionEn = 'Infrared thermography of 225 kV bushings and verification of ONAF cooler fan flow rates.';
  } else if (pctC2h2 < 4.0 && pctC2h4 >= 20.0 && pctC2h4 < 50.0) {
    fault = 'T2';
    descFr = 'Défaut thermique moyenne température (300°C < T < 700°C) : brunissement et fragilisation du papier isolant Kraft.';
    descEn = 'Medium-temperature thermal fault (300°C < T < 700°C): Kraft paper browning and embrittlement.';
    actionFr = 'Analyse des furanes (2-FAL) et teneur en CO/CO2 pour évaluer la dégradation du papier. Réduction de charge transitoire.',
    actionEn = 'Furan analysis (2-FAL) and CO/CO2 ratio check to assess paper aging. Reduce peak loading temporarily.';
  } else if (pctC2h2 < 15.0 && pctC2h4 >= 50.0) {
    fault = 'T3';
    descFr = 'Défaut thermique haute température (T > 700°C) : carbonisation sévère de l\'huile, points chauds au cuivre.';
    descEn = 'High-temperature thermal fault (T > 700°C): severe oil carbonization, copper conductor hot spots.';
    actionFr = 'Planifier un décuvage d\'inspection urgent. Prélèvement d\'huile pour comptage de particules de carbone.',
    actionEn = 'Schedule urgent untanking inspection. Oil sampling for carbon particulate count.';
  } else if (pctC2h2 >= 13.0 && pctC2h4 < 23.0) {
    fault = 'D1';
    descFr = 'Décharges de faible énergie : étincelles entre éléments métalliques sous potentiel flottant ou perforation de film.',
    descEn = 'Low-energy electrical discharges: sparking between floating potential metals or puncture of insulation layer.';
    actionFr = 'Vérification de la mise à la terre du circuit magnétique (core ground) et serrage des connexions internes.',
    actionEn = 'Check core-to-ground isolation bonding and inspect internal tap changer connections.';
  } else if (pctC2h2 >= 29.0 && pctC2h4 >= 23.0) {
    fault = 'D2';
    descFr = 'Décharges de forte énergie (arc électrique franc) : contournement interne, perforation majeure, risque d\'explosion.',
    descEn = 'High-energy electrical discharges (power arcing): internal flashover, severe puncture, explosion risk.';
    actionFr = 'ARRÊT D\'URGENCE IMMÉDIAT. Isolement électrique 225 kV, déclenchement relais Buchholz ANSI 63 et test de déformation de bobinage FRA.',
    actionEn = 'IMMEDIATE EMERGENCY SHUTDOWN. Isolate 225 kV, trip Buchholz 63 and run Frequency Response Analysis (SFRA).';
  } else {
    fault = 'DT';
    descFr = 'Défaut combiné thermique et électrique : amorçages récurrents dans une zone surchauffée.';
    descEn = 'Combined thermal and electrical fault: recurring electrical tracking in an overheated localized zone.';
    actionFr = 'Test de réponse en fréquence de balayage (SFRA) et chromatographie gazeuse sous 48h.',
    actionEn = 'Sweep frequency response analysis (SFRA) and follow-up DGA chromatography within 48h.';
  }

  return {
    pctCh4,
    pctC2h4,
    pctC2h2,
    diagnosedFault: fault,
    faultDescriptionFr: descFr,
    faultDescriptionEn: descEn,
    recommendedActionFr: actionFr,
    recommendedActionEn: actionEn,
  };
}

export const TRANSFORMER_DGA_SAMPLES: TransformerDgaAnalysis[] = [
  {
    transformerId: 'G01-GSU-XFR',
    unitName: 'GSU Groupe G01 (77 MVA 13.8/225 kV)',
    ch4Ppm: 45,
    c2h4Ppm: 22,
    c2h2Ppm: 2.1,
    h2Ppm: 35,
    coPpm: 320,
    co2Ppm: 2850,
    pctCh4: 65.1,
    pctC2h4: 31.8,
    pctC2h2: 3.1,
    diagnosedFault: 'T2',
    faultDescriptionFr: 'Défaut thermique modéré (300°C-700°C) au niveau d\'une connexion interne de traversée.',
    faultDescriptionEn: 'Moderate thermal fault (300°C-700°C) at internal bushing connection.',
    recommendedActionFr: 'Surveillance DGA mensuelle et thermographie infrarouge sous charge maximale.',
    recommendedActionEn: 'Monthly DGA monitoring and infrared thermography at full load.',
    paperDegradationDegreeDp: 820,
    furanConcentrationMgKg: 0.18,
    dielectricBreakdownKv: 68.5,
  },
  {
    transformerId: 'G02-GSU-XFR',
    unitName: 'GSU Groupe G02 (77 MVA 13.8/225 kV)',
    ch4Ppm: 12,
    c2h4Ppm: 5,
    c2h2Ppm: 0.2,
    h2Ppm: 15,
    coPpm: 180,
    co2Ppm: 1650,
    pctCh4: 69.8,
    pctC2h4: 29.1,
    pctC2h2: 1.1,
    diagnosedFault: 'T1',
    faultDescriptionFr: 'Gaz dans les plages normales de fonctionnement.',
    faultDescriptionEn: 'Gas concentrations within normal baseline operating levels.',
    recommendedActionFr: 'Prélèvement standard semestriel.',
    recommendedActionEn: 'Routine semi-annual oil sampling.',
    paperDegradationDegreeDp: 980,
    furanConcentrationMgKg: 0.05,
    dielectricBreakdownKv: 74.0,
  },
  {
    transformerId: 'G05-GSU-XFR',
    unitName: 'GSU Groupe G05 (77 MVA 13.8/225 kV)',
    ch4Ppm: 95,
    c2h4Ppm: 88,
    c2h2Ppm: 8.5,
    h2Ppm: 65,
    coPpm: 540,
    co2Ppm: 4200,
    pctCh4: 49.6,
    pctC2h4: 46.0,
    pctC2h2: 4.4,
    diagnosedFault: 'T2',
    faultDescriptionFr: 'Point chaud thermique soutenu en cours d\'évolution.',
    faultDescriptionEn: 'Evolving localized thermal hot spot under continuous load.',
    recommendedActionFr: 'Vérification du groupe de motopompes et ventilateurs ONAF.',
    recommendedActionEn: 'Inspect ONAF oil circulating pump and cooling fan banks.',
    paperDegradationDegreeDp: 710,
    furanConcentrationMgKg: 0.42,
    dielectricBreakdownKv: 63.0,
  },
];

// ============================================================================
// 3. VIBRATION FFT SPECTRUM DATA (ISO 10816-5 & ISO 7919-5)
// ============================================================================

export const VIBRATION_ANALYSIS_G01: VibrationAnalysis = {
  unitId: 'G01',
  shaftSpeedRpm: 136.36, // f0 = 2.272 Hz
  isoZone: 'ZONE_A', // Zone A: < 1.6 mm/s RMS (Newly commissioned machinery)
  radialBearingMmS: 1.35,
  axialThrustBearingMmS: 0.95,
  shaftOrbitPeakToPeakUm: 38.5, // Shaft relative displacement (< 80 µm threshold)
  dominantHarmonic: '1x RPM (Déséquilibre résiduel rotor)',
  spectrum: [
    { frequencyHz: 0.70, amplitudeMmS: 0.42, orderRatio: 0.31, label: '0.31x Vortex Torche Rheingans (Charge partielle)' },
    { frequencyHz: 1.45, amplitudeMmS: 0.18, orderRatio: 0.64, label: 'Harmonique hydraulique sous-synchrone' },
    { frequencyHz: 2.27, amplitudeMmS: 1.25, orderRatio: 1.00, label: '1x RPM Fréquence de rotation (Balourd mécanique)' },
    { frequencyHz: 4.54, amplitudeMmS: 0.38, orderRatio: 2.00, label: '2x RPM Désalignement d\'accouplement arbre' },
    { frequencyHz: 6.81, amplitudeMmS: 0.15, orderRatio: 3.00, label: '3x RPM Ovalisation palier guide' },
    { frequencyHz: 29.54, amplitudeMmS: 0.65, orderRatio: 13.00, label: 'BPF (13x) Fréquence de passage aubes roue Francis' },
    { frequencyHz: 50.00, amplitudeMmS: 0.32, orderRatio: 22.00, label: '50 Hz Fréquence réseau électrique (Attraction unilatérale UMP)' },
    { frequencyHz: 59.08, amplitudeMmS: 0.28, orderRatio: 26.00, label: '2x BPF Harmonique interaction distributeur/roue' },
    { frequencyHz: 100.00, amplitudeMmS: 0.22, orderRatio: 44.00, label: '100 Hz Double fréquence électrique (Entrefer asymétrique)' },
  ],
};

// ============================================================================
// 4. CMMS / GMAO SMART WORK ORDERS (ISO 55001 / SAE JA1011 RCM)
// ============================================================================

export const CMMS_WORK_ORDERS: CmmsWorkOrder[] = [
  {
    orderId: 'WO-2026-089',
    assetTag: 'G01-RUNNER-BLADES',
    titleFr: 'Rechargement robotisé anti-cavitation par soudage 13Cr-4Ni',
    titleEn: 'Robotized anti-cavitation welding overlay 13Cr-4Ni',
    priority: 'HIGH_PLANNED',
    triggerType: 'CBM_THRESHOLD',
    standardReference: 'IEC 62364 / ASME Section IX',
    leadTimeDays: 7,
    estimatedLaborHours: 48,
    estimatedCostUsd: 18500,
    status: 'SCHEDULED',
  },
  {
    orderId: 'WO-2026-092',
    assetTag: 'G05-GSU-XFR',
    titleFr: 'Traitement sous vide et dégazage thermique de l\'huile diélectrique',
    titleEn: 'Vacuum thermal degassing & dehydration of transformer oil',
    priority: 'MEDIUM_CONDITION',
    triggerType: 'CBM_THRESHOLD',
    standardReference: 'IEC 60599 / IEEE C57.104',
    leadTimeDays: 3,
    estimatedLaborHours: 24,
    estimatedCostUsd: 8200,
    status: 'IN_PROGRESS',
  },
  {
    orderId: 'WO-2026-095',
    assetTag: 'G03-STATOR-PD',
    titleFr: 'Mesure en ligne des Décharges Partielles Stator (Capteurs UHF)',
    titleEn: 'Online Stator Partial Discharge mapping (UHF capacitive couplers)',
    priority: 'LOW_ROUTINE',
    triggerType: 'PREDICTIVE_RUL',
    standardReference: 'IEC 60034-27-1 / IEEE 1434',
    leadTimeDays: 1,
    estimatedLaborHours: 12,
    estimatedCostUsd: 3500,
    status: 'PENDING_APPROVAL',
  },
  {
    orderId: 'WO-2026-098',
    assetTag: 'ALL-PENSTOCKS-UT',
    titleFr: 'Contrôle non destructif (CND) ultrasons multi-éléments phased array',
    titleEn: 'Phased Array Ultrasonic Testing (PAUT) of penstock welds',
    priority: 'MEDIUM_CONDITION',
    triggerType: 'REGULATORY_SAFETY',
    standardReference: 'ISO 9712 / ASME Section V',
    leadTimeDays: 5,
    estimatedLaborHours: 36,
    estimatedCostUsd: 12000,
    status: 'SCHEDULED',
  },
  {
    orderId: 'WO-2026-101',
    assetTag: 'G01-BEARING-PADS',
    titleFr: 'Régulage et grattage haute précision des patins de butée Michell',
    titleEn: 'High-precision scraping and inspection of Michell thrust pads',
    priority: 'HIGH_PLANNED',
    triggerType: 'PREDICTIVE_RUL',
    standardReference: 'ISO 10816-5 / DIN 31652',
    leadTimeDays: 4,
    estimatedLaborHours: 32,
    estimatedCostUsd: 9800,
    status: 'COMPLETED',
  },
];

// ============================================================================
// 5. PLANT LIFE EXTENSION SCENARIO (40 -> 60 YEARS, ISO 55000)
// ============================================================================

export const PLANT_LIFE_EXTENSION_DATA: PlantLifeExtensionScenario = {
  baselineLifespanYears: 40,
  extendedLifespanYears: 60,
  capexRefurbishmentUsd: 42000000,   // $42M d'investissements de mi-vie
  avoidedNewBuildCostUsd: 380000000, // $380M évités pour reconstruction
  npvBenefitUsd: 165000000,          // $165M de Valeur Actuelle Nette
  keyInterventionsFr: [
    'Remplacement préventif des 7 roues Francis à mi-vie (an 30) par des profils CFD nouvelle génération (+1.8% de rendement)',
    'Rebobinage sous vide VPI Classe H (180°C) des 7 stators alternateurs au bout de 35 ans',
    'Rétro-remplissage des transformateurs 225 kV avec esters synthétiques biodégradables (protection incendie & doublement de la durée de vie du papier)',
    'Rénovation complète des vannes papillon et servomoteurs hydrauliques haute pression (160 bar)',
    'Modernisation du système SCADA et passage à l\'architecture de redondance triple CEI 61850 Station Bus',
  ],
  keyInterventionsEn: [
    'Preventive mid-life replacement of 7 Francis runners (year 30) with next-gen CFD profiles (+1.8% efficiency gain)',
    'Class H (180°C) VPI full rewinding of all 7 generator stators at year 35',
    'Retro-filling of 225 kV GSU transformers with biodegradable synthetic esters (fire safety & doubling paper insulation life)',
    'Full overhaul of butterfly inlet valves and 160-bar high-pressure hydraulic servomotors',
    'Modernization of plant SCADA to full triple-redundant IEC 61850 Station Bus architecture',
  ],
};
