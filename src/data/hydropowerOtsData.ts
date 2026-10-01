// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 22 DATA ENGINE
// STEP 22: Operator Training Simulator (OTS / Full-Scope Replica),
// Critical Malfunction Drills, ISO 11064 Control Room Ergonomics & HRA Evaluation
// ============================================================================

import type {
  IncidentScenario,
  OtsSimulationState,
  AlarmAnnunciatorItem,
  OperatorTraineeEvaluation,
  IncidentScenarioId,
} from '../types/hydropowerOts';

// ============================================================================
// 1. INCIDENT SCENARIOS LIBRARY
// ============================================================================

export const INCIDENT_SCENARIOS: IncidentScenario[] = [
  {
    id: 'SCN_LOAD_REJECTION_420MW',
    code: 'DRILL-EOP-01',
    titleFr: 'Rejet de Charge Total 420 MW (Déclenchement Ligne 225 kV)',
    titleEn: 'Total 420 MW Load Rejection (225 kV Line Outage)',
    severity: 'CRITICAL',
    initiatingEventFr: 'Court-circuit biphasé-terre sur la ligne double terne 225 kV Nachtigal-Bafoussam/Mangombé suite à impact de foudre direct.',
    initiatingEventEn: 'Two-phase to ground short circuit on 225 kV double circuit line following direct lightning strike.',
    automaticSafetyActionsFr: [
      'Déclenchement instantané des 7 disjoncteurs de groupe 13.8 kV (ANSI 52G)',
      'Fermeture d\'urgence en 2 temps des directrices de turbine (loi de fermeture temporisée)',
      'Montée en survitesse limitée à 158% (215 RPM contre emballement théorique 290 RPM)',
      'Surpression d\'onde de bélier Allievi amortie dans la cheminée d\'équilibre (+18.5 mCE)',
    ],
    automaticSafetyActionsEn: [
      'Instant trip of all 7 generator circuit breakers (ANSI 52G)',
      'Two-stage rapid emergency closing of turbine guide vanes (cushioned closure curve)',
      'Rotor overspeed crest capped at 158% (215 RPM vs runaway maximum 290 RPM)',
      'Allievi water hammer surge absorbed by surge tank (+18.5 m water column)',
    ],
    operatorRequiredActionsFr: [
      '1. Confirmer l\'extinction des voyants d\'injection active (0 MW)',
      '2. Vérifier le passage en régulation de vitesse à vide (136.4 RPM stabilisé)',
      '3. Surveiller la pression dans la bâche spirale et le niveau cheminée d\'équilibre',
      '4. Contacter le Dispatching National (CNO Mangombé) pour préparer le renvoi de tension',
    ],
    operatorRequiredActionsEn: [
      '1. Confirm active power injection drops to zero (0 MW)',
      '2. Verify speed governor settles into no-load idling (136.4 RPM stabilized)',
      '3. Monitor spiral casing pressure and surge tank water oscillations',
      '4. Coordinate with National Dispatch (CNO Mangombé) for grid restoration',
    ],
    standardReference: 'IEEE 1207 / IEC 61362',
    benchmarkCompletionTimeSeconds: 45,
  },
  {
    id: 'SCN_GOVERNOR_OIL_FAILURE',
    code: 'DRILL-EOP-02',
    titleFr: 'Chute de Pression Huile Régulateur Turbine (160 bar → 85 bar)',
    titleEn: 'Turbine Governor Hydraulic Oil Pressure Loss (160 bar → 85 bar)',
    severity: 'CRITICAL',
    initiatingEventFr: 'Rupture d\'un flexible haute pression sur le collecteur de servomoteurs des directrices du groupe G02.',
    initiatingEventEn: 'Burst of high-pressure flexible hose on G02 turbine guide vane servomotor manifold.',
    automaticSafetyActionsFr: [
      'Démarrage automatique de la motopompe oléodynamique de secours P2',
      'Décharge des accumulateurs oléopneumatiques à piston/azote pour garantir la fermeture',
      'Verrouillage mécanique de sécurité du distributeur à 18% d\'ouverture',
    ],
    automaticSafetyActionsEn: [
      'Auto-start of backup hydraulic oil pump P2',
      'Discharge of piston nitrogen hydraulic accumulators to guarantee fail-safe stroke',
      'Mechanical safety latching of distributor at 18% opening',
    ],
    operatorRequiredActionsFr: [
      '1. Acquitter l\'alarme sonore "Pression Huile Régulateur Basse"',
      '2. Déclencher manuellement l\'arrêt d\'urgence du groupe G02 (AU-02)',
      '3. Vérifier la fermeture par gravité de la vanne papillon de pied de conduite',
      '4. Isoler le groupe oléohydraulique et consigner le circuit pour maintenance',
    ],
    operatorRequiredActionsEn: [
      '1. Acknowledge "Governor Oil Pressure Low" acoustic klaxon',
      '2. Initiate manual Emergency Stop on unit G02 (ES-02)',
      '3. Confirm gravity-assisted fail-safe closure of penstock butterfly guard valve',
      '4. Isolate hydraulic unit and tag out circuit for emergency repair',
    ],
    standardReference: 'IEC 60308 / ISO 4413',
    benchmarkCompletionTimeSeconds: 30,
  },
  {
    id: 'SCN_LOSS_OF_EXCITATION',
    code: 'DRILL-EOP-03',
    titleFr: 'Perte d\'Excitation Alternateur G01 (Protection ANSI 40)',
    titleEn: 'Generator G01 Loss of Field Excitation (ANSI 40 Protection)',
    severity: 'HIGH',
    initiatingEventFr: 'Défaillance du pont redresseur thyristorisé statique de l\'excitation brushless (coupure de fusible ultra-rapide).',
    initiatingEventEn: 'Bridge rectifier failure on static brushless excitation system (ultra-rapid fuse blown).',
    automaticSafetyActionsFr: [
      'Décrochage angulaire et passage de l\'alternateur en fonctionnement asynchrone',
      'Absorption massive de puissance réactive depuis le réseau 225 kV (-45 MVAR)',
      'Déclenchement temporisé par relais impédancemétrique ANSI 40 à t = 1.2 s',
    ],
    automaticSafetyActionsEn: [
      'Loss of synchronism; generator slips into asynchronous induction mode',
      'Massive reactive power absorption from 225 kV grid (-45 MVAR)',
      'ANSI 40 mho circle offset impedance relay trips at t = 1.2 s',
    ],
    operatorRequiredActionsFr: [
      '1. Constater la déconnexion réseau automatique de G01',
      '2. Rehausser la consigne de tension réactive sur les 6 autres groupes (G02-G07)',
      '3. Vérifier l\'absence d\'échauffement anormal sur les cales d\'encoche du rotor',
      '4. Basculer sur le canal d\'excitation de secours B',
    ],
    operatorRequiredActionsEn: [
      '1. Verify automatic grid isolation of unit G01',
      '2. Boost reactive voltage setpoints on remaining 6 units (G02-G07)',
      '3. Check rotor slot wedges and damper windings for thermal hotspots',
      '4. Switch excitation regulator to backup Channel B',
    ],
    standardReference: 'IEEE C37.102 / IEC 60034-1',
    benchmarkCompletionTimeSeconds: 40,
  },
  {
    id: 'SCN_TRASH_RACK_CLOGGING',
    code: 'DRILL-EOP-04',
    titleFr: 'Colmatage Brutal des Grilles de Prise d\'Eau (Δh > 2.5 m)',
    titleEn: 'Severe Water Intake Trash Rack Clogging (Δh > 2.5 m)',
    severity: 'HIGH',
    initiatingEventFr: 'Arrivée massive d\'arbres flottants et de jacinthes d\'eau suite à crue orageuse amont sur la Sanaga.',
    initiatingEventEn: 'Massive inflow of floating logs and water hyacinths following sudden flash flood on upstream Sanaga.',
    automaticSafetyActionsFr: [
      'Démarrage automatique du dégrilleur hydraulique télescopique à crémaillère',
      'Émission de l\'alarme différentielle niveau amont/aval grilles Δh > 1.5 m',
      'Génération d\'une consigne de délestage automatique par le SCADA',
    ],
    automaticSafetyActionsEn: [
      'Auto-start of telescopic hydraulic trash rack cleaning rake machine',
      'Intake differential level warning triggered at Δh > 1.5 m',
      'Automatic power derating setpoint issued by plant DCS',
    ],
    operatorRequiredActionsFr: [
      '1. Réduire la puissance turbinée de 420 MW à 240 MW pour limiter la dépression',
      '2. Commander la mise en cycle continu des deux chariots dégrilleurs',
      '3. Ouvrir les clapets d\'évacuation de corps flottants du déversoir de crue',
      '4. Surveiller le risque de cavitation sévère dans les coudes d\'aspiration',
    ],
    operatorRequiredActionsEn: [
      '1. Reduce plant discharge from 420 MW to 240 MW to prevent intake collapse',
      '2. Command continuous cleaning cycles on both automated trash rake gantries',
      '3. Open surface debris flap gates on spillway weir',
      '4. Monitor draft tube acoustic sensors for vortex cavitation cavitation noise',
    ],
    standardReference: 'ICOLD Bulletin 147 / USBR Intake Guidelines',
    benchmarkCompletionTimeSeconds: 60,
  },
  {
    id: 'SCN_BEARING_COOLING_TRIP',
    code: 'DRILL-EOP-05',
    titleFr: 'Perte de Réfrigération Butée Michell (Température Patins > 82°C)',
    titleEn: 'Thrust Bearing Cooling Water Failure (Pad Temp > 82°C)',
    severity: 'HIGH',
    initiatingEventFr: 'Coupure d\'alimentation auxiliaire 400V sur les motopompes de circulation d\'eau de refroidissement butée.',
    initiatingEventEn: '400V auxiliary bus power loss to thrust bearing raw water circulation pumps.',
    automaticSafetyActionsFr: [
      'Alarme thermique de niveau 1 déclenchée à T = 75°C',
      'Seuil de déclenchement d\'arrêt d\'urgence armé à T = 85°C',
    ],
    automaticSafetyActionsEn: [
      'Level 1 thermal warning annunciator at T = 75°C',
      'Emergency shutdown trip threshold armed at T = 85°C',
    ],
    operatorRequiredActionsFr: [
      '1. Ouvrir manuellement la vanne by-pass de secours gravitaire eau brute',
      '2. Démarrer la pompe de brassage d\'huile de butée auxiliaire',
      '3. Si T > 85°C, actionner immédiatement l\'arrêt d\'urgence groupe',
      '4. Analyser l\'huile pour vérifier l\'absence d\'arrachement de régule (Babbitt)',
    ],
    operatorRequiredActionsEn: [
      '1. Manually open emergency gravity-fed raw water cooling bypass valve',
      '2. Start auxiliary high-pressure oil jacking circulation pump',
      '3. If T > 85°C, trigger immediate emergency shutdown to prevent wipeout',
      '4. Inspect oil sample for Babbitt white metal wiped particulates',
    ],
    standardReference: 'ISO 10816-5 / DIN 31652',
    benchmarkCompletionTimeSeconds: 35,
  },
];

// ============================================================================
// 2. NOMINAL BASELINE SIMULATION STATE
// ============================================================================

export const INITIAL_OTS_STATE: OtsSimulationState = {
  simTimeSeconds: 0,
  speed: 'REALTIME_1X',
  activeScenario: null,
  scenarioTimeElapsedSeconds: 0,
  scenarioResolved: false,
  gridFrequencyHz: 50.02,
  gridVoltageKv: 225.4,
  unitActivePowerTotalMw: 420.0,
  unitReactivePowerTotalMvar: 42.5,
  shaftSpeedRpm: 136.36,
  waterHammerHeadM: 50.2,
  governorOilPressureBar: 160.5,
  thrustBearingTempC: 62.4,
  trashRackDeltaHMeters: 0.35,
  generatorExcitationCurrentA: 850.0,
};

// ============================================================================
// 3. DYNAMIC PHYSICS SIMULATION STEP FUNCTION
// ============================================================================

export function computeOtsPhysicsStep(
  prev: OtsSimulationState,
  deltaSec: number,
  isRemediated: boolean
): OtsSimulationState {
  if (prev.speed === 'PAUSED' || deltaSec <= 0) {
    return prev;
  }

  const multiplier = prev.speed === 'FAST_2X' ? 2 : prev.speed === 'WARP_5X' ? 5 : 1;
  const dt = deltaSec * multiplier;
  const newSimTime = prev.simTimeSeconds + dt;
  const newElapsed = prev.activeScenario ? prev.scenarioTimeElapsedSeconds + dt : 0;

  // Clone state
  const next: OtsSimulationState = {
    ...prev,
    simTimeSeconds: Number(newSimTime.toFixed(1)),
    scenarioTimeElapsedSeconds: Number(newElapsed.toFixed(1)),
    scenarioResolved: isRemediated,
  };

  if (!prev.activeScenario) {
    // Normal steady-state ambient micro-fluctuations
    next.gridFrequencyHz = Number((50.0 + Math.sin(newSimTime * 0.1) * 0.04).toFixed(3));
    next.gridVoltageKv = Number((225.0 + Math.cos(newSimTime * 0.08) * 0.6).toFixed(2));
    next.unitActivePowerTotalMw = 420.0;
    next.unitReactivePowerTotalMvar = Number((42.0 + Math.sin(newSimTime * 0.05) * 1.5).toFixed(1));
    next.shaftSpeedRpm = Number((136.36 + Math.sin(newSimTime * 0.2) * 0.08).toFixed(2));
    next.waterHammerHeadM = Number((50.0 + Math.cos(newSimTime * 0.15) * 0.3).toFixed(2));
    next.governorOilPressureBar = Number((160.0 + Math.sin(newSimTime * 0.05) * 0.8).toFixed(1));
    next.thrustBearingTempC = Number((62.0 + Math.sin(newSimTime * 0.02) * 0.5).toFixed(1));
    next.trashRackDeltaHMeters = 0.35;
    next.generatorExcitationCurrentA = 850.0;
    return next;
  }

  // Handle Active Drill Dynamics:
  switch (prev.activeScenario) {
    case 'SCN_LOAD_REJECTION_420MW': {
      if (!isRemediated) {
        // Sudden drop of electrical power to 0
        next.unitActivePowerTotalMw = 0;
        next.unitReactivePowerTotalMvar = 0;
        // Rotor accelerates up to 215 RPM in 4 seconds, then settles down
        const t = Math.min(newElapsed, 30);
        if (t < 5) {
          next.shaftSpeedRpm = Number((136.36 + (215 - 136.36) * (t / 5)).toFixed(1));
          next.waterHammerHeadM = Number((50.0 + 18.5 * Math.sin((t / 5) * Math.PI)).toFixed(1));
        } else {
          // Guide vanes closed in 2-stage law, settling to 136.4 RPM idle
          const decay = Math.exp(-(t - 5) / 8);
          next.shaftSpeedRpm = Number((136.36 + (215 - 136.36) * decay).toFixed(1));
          next.waterHammerHeadM = Number((50.0 + 6.0 * Math.sin((t - 5) * 0.5) * decay).toFixed(1));
        }
        next.gridFrequencyHz = Number((50.0 + 1.8 * Math.exp(-t / 10)).toFixed(2));
        next.gridVoltageKv = Number((225.0 + 15.0 * Math.exp(-t / 6)).toFixed(1));
      } else {
        // Stabilized no-load idle
        next.shaftSpeedRpm = 136.36;
        next.waterHammerHeadM = 50.2;
        next.unitActivePowerTotalMw = 0;
        next.gridFrequencyHz = 50.02;
        next.gridVoltageKv = 225.0;
      }
      break;
    }

    case 'SCN_GOVERNOR_OIL_FAILURE': {
      if (!isRemediated) {
        // Pressure drops from 160 to 85 bar over 15 seconds
        const t = Math.min(newElapsed, 20);
        next.governorOilPressureBar = Number((160.0 - 75.0 * (t / 20)).toFixed(1));
        if (next.governorOilPressureBar < 110) {
          // Mechanical latching, partial power drop
          next.unitActivePowerTotalMw = Number((420.0 - 75.0 * (t / 20)).toFixed(1));
        }
      } else {
        // Manual trip executed, pressure stabilized, safe shutdown
        next.governorOilPressureBar = 150.0;
        next.unitActivePowerTotalMw = 360.0; // G02 safely isolated
      }
      break;
    }

    case 'SCN_LOSS_OF_EXCITATION': {
      if (!isRemediated) {
        const t = Math.min(newElapsed, 10);
        next.generatorExcitationCurrentA = Number(Math.max(0, 850 - 850 * (t / 2)).toFixed(1));
        next.unitReactivePowerTotalMvar = Number((-45.0 * (t / 2)).toFixed(1)); // Absorbing massive reactive
        next.gridVoltageKv = Number((225.0 - 18.0 * (t / 4)).toFixed(1));
      } else {
        // Switched to excitation channel B
        next.generatorExcitationCurrentA = 850.0;
        next.unitReactivePowerTotalMvar = 42.0;
        next.gridVoltageKv = 225.0;
      }
      break;
    }

    case 'SCN_TRASH_RACK_CLOGGING': {
      if (!isRemediated) {
        const t = Math.min(newElapsed, 40);
        next.trashRackDeltaHMeters = Number((0.35 + 2.45 * (t / 40)).toFixed(2));
        next.waterHammerHeadM = Number((50.0 - next.trashRackDeltaHMeters).toFixed(2));
      } else {
        // Derating & trash raking cleared differential
        next.trashRackDeltaHMeters = 0.65;
        next.unitActivePowerTotalMw = 240.0;
        next.waterHammerHeadM = 49.8;
      }
      break;
    }

    case 'SCN_BEARING_COOLING_TRIP': {
      if (!isRemediated) {
        const t = Math.min(newElapsed, 45);
        next.thrustBearingTempC = Number((62.0 + 22.0 * (t / 45)).toFixed(1));
      } else {
        // Emergency bypass opened, temp dropping
        next.thrustBearingTempC = 66.5;
      }
      break;
    }
  }

  return next;
}

// ============================================================================
// 4. ANNUNCIATOR ALARM WINDOWS MATRIX (ISO 11064 CCR SPEC)
// ============================================================================

export const DEFAULT_ALARM_ANNUNCIATORS: AlarmAnnunciatorItem[] = [
  { id: 'ALM_01', tag: 'ANSI 52G TRIP', labelFr: 'DÉCLENCHEMENT DISJONCTEUR GROUPE 52G', labelEn: 'GENERATOR BREAKER 52G TRIP', category: 'GRID', active: false, acknowledged: false, color: 'RED_FLASH' },
  { id: 'ALM_02', tag: 'ANSI 87G DIFF', labelFr: 'DIFFÉRENTIELLE STATOR ALTERNATEUR 87G', labelEn: 'STATOR DIFFERENTIAL 87G', category: 'GENERATOR', active: false, acknowledged: false, color: 'RED_FLASH' },
  { id: 'ALM_03', tag: 'ANSI 40 LOE', labelFr: 'PERTE D\'EXCITATION ALTERNATEUR 40', labelEn: 'LOSS OF FIELD EXCITATION 40', category: 'GENERATOR', active: false, acknowledged: false, color: 'RED_FLASH' },
  { id: 'ALM_04', tag: 'SURVITESSE 112%', labelFr: 'SURVITESSE ROTOR MÉCANIQUE > 112%', labelEn: 'ROTOR MECHANICAL OVERSPEED > 112%', category: 'TURBINE', active: false, acknowledged: false, color: 'RED_FLASH' },
  { id: 'ALM_05', tag: 'PRESSION HUILE', labelFr: 'PRESSION HUILE RÉGULATEUR < 110 BAR', labelEn: 'GOVERNOR OIL PRESSURE < 110 BAR', category: 'TURBINE', active: false, acknowledged: false, color: 'AMBER' },
  { id: 'ALM_06', tag: 'BUTÉE T > 75°C', labelFr: 'TEMPÉRATURE BUTÉE MICHELL ALARME', labelEn: 'MICHELL THRUST PAD TEMP HIGH', category: 'TURBINE', active: false, acknowledged: false, color: 'AMBER' },
  { id: 'ALM_07', tag: 'BUTÉE T > 85°C', labelFr: 'TEMPÉRATURE BUTÉE MICHELL DÉCLENCHEMENT', labelEn: 'MICHELL THRUST PAD TEMP TRIP', category: 'TURBINE', active: false, acknowledged: false, color: 'RED_FLASH' },
  { id: 'ALM_08', tag: 'ΔH GRILLE > 1.5M', labelFr: 'DIFFÉRENTIEL NIVEAU GRILLES HAUT', labelEn: 'INTAKE TRASH RACK DELTA-H HIGH', category: 'HYDRAULIC', active: false, acknowledged: false, color: 'AMBER' },
  { id: 'ALM_09', tag: 'BUCHHOLZ 63', labelFr: 'RELAIS BUCHHOLZ TRANSFO GSU 225 KV', labelEn: 'GSU 225 KV TRANSFORMER BUCHHOLZ 63', category: 'TRANSFORMER', active: false, acknowledged: false, color: 'RED_FLASH' },
  { id: 'ALM_10', tag: 'VIBRATION PALIER', labelFr: 'VIBRATION PALIER RADIAL > 2.8 MM/S', labelEn: 'RADIAL BEARING VIBRATION HIGH', category: 'TURBINE', active: false, acknowledged: false, color: 'AMBER' },
  { id: 'ALM_11', tag: 'CHEMINÉE NIVEAU', labelFr: 'NIVEAU HAUT CHEMINÉE D\'ÉQUILIBRE', labelEn: 'SURGE TANK HIGH WATER SURGE', category: 'HYDRAULIC', active: false, acknowledged: false, color: 'AMBER' },
  { id: 'ALM_12', tag: 'LIGNE 225KV TRIP', labelFr: 'DÉCLENCHEMENT DISJONCTEUR DÉPART 225KV', labelEn: '225 KV FEEDER BREAKER TRIP', category: 'GRID', active: false, acknowledged: false, color: 'RED_FLASH' },
];

// ============================================================================
// 5. OPERATOR TRAINEES ROSTER (HUMAN RELIABILITY ANALYSIS)
// ============================================================================

export const OPERATOR_TRAINEES: OperatorTraineeEvaluation[] = [
  {
    traineeId: 'OP-041',
    traineeName: 'Jean-Paul Mbarga',
    role: 'CHIEF_DESK_OPERATOR',
    totalDrillsCompleted: 24,
    certificationScorePercent: 96.5,
    averageReactionTimeSeconds: 18.2,
    humanErrorProbabilityScore: 0.018,
    qualificationStatus: 'CERTIFIED_SENIOR',
  },
  {
    traineeId: 'OP-042',
    traineeName: 'Aïcha Njoya',
    role: 'SYSTEM_DISPATCHER',
    totalDrillsCompleted: 19,
    certificationScorePercent: 93.8,
    averageReactionTimeSeconds: 22.5,
    humanErrorProbabilityScore: 0.024,
    qualificationStatus: 'CERTIFIED_SENIOR',
  },
  {
    traineeId: 'OP-048',
    traineeName: 'Christian Fotso',
    role: 'HYDRO_FIELD_ENGINEER',
    totalDrillsCompleted: 12,
    certificationScorePercent: 88.0,
    averageReactionTimeSeconds: 29.4,
    humanErrorProbabilityScore: 0.048,
    qualificationStatus: 'IN_TRAINING',
  },
];
