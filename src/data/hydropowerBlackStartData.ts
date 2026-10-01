// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 13 DATA ENGINE
// STEP 13: Black-Start Sequence, Ferranti Mitigation, Islanded Grid Restoration & HIL Sync
// ============================================================================

import type {
  BlackStartSequencePhase,
  FerrantiCalculationParams,
  FerrantiCalculationResult,
  IslandBlockLoadStep,
  SynchroCheckParameters,
  SynchroCheckResult,
} from '../types/hydropowerBlackStart';

// ============================================================================
// 1. BLACK-START RESTORATION SEQUENCE PHASES (IEEE 1547.4 / CIGRE WG C4)
// ============================================================================

export const BLACK_START_PHASES: BlackStartSequencePhase[] = [
  {
    id: 'dg_start',
    stepNumber: 1,
    title: {
      fr: 'Démarrage du Groupe Diesel de Secours de Centrale (GE 2.5 MVA)',
      en: 'Black-Start Emergency Diesel Generator Cranking (2.5 MVA DG)',
    },
    durationMinutes: 4.5,
    criticalPrerequisites: {
      fr: 'Batteries de démarrage 24 Vcc chargées, disjoncteur général 400 V auxiliaires ouvert, réserves fioul journalières vérifiées (> 12 h).',
      en: '24 Vdc cranking battery bank charged, 400V auxiliary master breaker open, day-tank fuel verified (> 12 hours).',
    },
    voltageKv: 0.4,
    frequencyHz: 50.0,
    activePowerMW: 0.8,
    reactivePowerMVAR: 0.2,
    keySafetyActions: {
      fr: 'Alimentation du tableau 400 V "Secours Vital" : chargeurs batteries DC, automates de tranche et éclairage de crise.',
      en: 'Energizes 400V Essential Auxiliary Switchboard: DC battery chargers, station PLCs, and emergency powerhouse lighting.',
    },
    status: 'completed',
  },
  {
    id: 'aux_energize',
    stepNumber: 2,
    title: {
      fr: 'Alimentation des Auxiliaires Mécaniques Critiques du Groupe 1',
      en: 'Energization of Unit 1 Critical Hydraulic Auxiliaries',
    },
    durationMinutes: 6.0,
    criticalPrerequisites: {
      fr: 'Pompes haute pression d\'huile régulation Woodward démarrées, pompe de circulation eau de palier active, compresseur d\'air 40 bar sous pression.',
      en: 'Woodward governor hydraulic power unit pumps started, bearing lubricating oil active, 40-bar governor air receiver pressurized.',
    },
    voltageKv: 0.4,
    frequencyHz: 50.0,
    activePowerMW: 1.4,
    reactivePowerMVAR: 0.5,
    keySafetyActions: {
      fr: 'Vérification de la pression d\'huile de palier (> 3.2 bar) et levée mécanique des patins de butée axiale (oil lift jack).',
      en: 'Bearing hydrostatic oil film verified (> 3.2 bar) with high-pressure oil injection lifting thrust runner shoes.',
    },
    status: 'completed',
  },
  {
    id: 'hydro_crank',
    stepNumber: 3,
    title: {
      fr: 'Lancement Turbine Francis G1 & Montée à la Vitesse Nominale',
      en: 'Francis Turbine Unit 1 Cranking & Speed Run-Up to 214.3 RPM',
    },
    durationMinutes: 5.0,
    criticalPrerequisites: {
      fr: 'Vanne de tête de conduite forcée 100% ouverte, servomoteurs de directrices déverrouillés, détection survitesse 140% armée.',
      en: 'Penstock headgate fully open, guide vane mechanical locking pins retracted, 140% mechanical overspeed trip armed.',
    },
    voltageKv: 0.0,
    frequencyHz: 50.0,
    activePowerMW: 0.0, // Spinning in mechanical unexcited state
    reactivePowerMVAR: 0.0,
    keySafetyActions: {
      fr: 'Ouverture progressive des directrices à 18% par le régulateur. Vitesse stabilisée à 214.3 tr/min (fréquence mécanique 50.0 Hz).',
      en: 'Controlled guide vane opening to 18%. Speed settles precisely at 214.3 RPM (50.0 Hz mechanical frequency).',
    },
    status: 'active',
  },
  {
    id: 'excitation_ramp',
    stepNumber: 4,
    title: {
      fr: 'Excitation Statique & Montée en Tension Statorique (15.75 kV)',
      en: 'Static Excitation De-blocking & Terminal Voltage Build-Up (15.75 kV)',
    },
    durationMinutes: 3.0,
    criticalPrerequisites: {
      fr: 'Vitesse rotorique à 100% stable, pont thyristors d\'excitation débloqué, relais de protection 59 (surtension) et 24 (V/Hz) actifs.',
      en: 'Rotor speed rock-solid at 100%, excitation bridge unblocked, overvoltage (59) and volts-per-hertz (24) relays operational.',
    },
    voltageKv: 15.75,
    frequencyHz: 50.0,
    activePowerMW: 0.0,
    reactivePowerMVAR: 1.2,
    keySafetyActions: {
      fr: 'Montée progressive de la tension aux bornes à 15.75 kV. Fermeture du disjoncteur de groupe 15.75 kV sur le transformateur élévateur 225 kV.',
      en: 'Smooth terminal voltage ramp to 15.75 kV. Generator breaker closes onto 15.75/225 kV step-up transformer.',
    },
    status: 'pending',
  },
  {
    id: 'line_charging',
    stepNumber: 5,
    title: {
      fr: 'Mise sous Tension de la Ligne 225 kV Nachtigal - Nyom II (Yaoundé)',
      en: 'Energizing Unloaded 225 kV Nachtigal - Nyom II Transmission Line',
    },
    durationMinutes: 7.0,
    criticalPrerequisites: {
      fr: 'Disjoncteur ligne ouvert à Nyom II (ligne à vide), régulateur de tension AVR basculé en mode sous-excitation pour absorber la puissance capacitive.',
      en: 'Remote line breaker open at Nyom II, AVR switched to under-excitation mode to absorb line capacitive charging Ferranti power.',
    },
    voltageKv: 225.0,
    frequencyHz: 50.0,
    activePowerMW: 0.2, // Corona & dielectric losses
    reactivePowerMVAR: -24.5, // Line capacitance injection absorbed by generator
    keySafetyActions: {
      fr: 'Surveillance de l\'effet Ferranti au poste de Nyom II : maintien de la tension d\'arrivée sous 236 kV (< 1.05 p.u.).',
      en: 'Ferranti overvoltage monitoring at Nyom II terminal: keeping receiving-end voltage below 236 kV (< 1.05 p.u.).',
    },
    status: 'pending',
  },
  {
    id: 'load_pickup',
    stepNumber: 6,
    title: {
      fr: 'Prise de Charge Séquentielle de l\'Îlot Prioritaire de Yaoundé',
      en: 'Sequential Block-Load Pickup for Yaoundé Emergency Island',
    },
    durationMinutes: 15.0,
    criticalPrerequisites: {
      fr: 'Poste 225/90/15 kV de Nyom II sous tension, coordination avec SONATREL pour l\'enclenchement par blocs de 15 MW maximum.',
      en: 'Nyom II 225/90/15 kV substation live, SONATREL grid operator coordinated for sequential max 15 MW block pickups.',
    },
    voltageKv: 225.0,
    frequencyHz: 49.8,
    activePowerMW: 45.0,
    reactivePowerMVAR: 12.0,
    keySafetyActions: {
      fr: 'Rétablissement de l\'usine des eaux d\'Akomnyada (Camwater) et des hôpitaux généraux de Yaoundé. Choc de fréquence maintenu au-dessus de 49.2 Hz.',
      en: 'Power restored to Akomnyada water treatment facility and central hospitals. Frequency nadir arrested above 49.2 Hz.',
    },
    status: 'pending',
  },
  {
    id: 'grid_resync',
    stepNumber: 7,
    title: {
      fr: 'Resynchronisation de l\'Îlot avec Songloulou & Restauration du RIS',
      en: 'Island Grid Re-synchronization with Songloulou & Full RIS Restoration',
    },
    durationMinutes: 10.0,
    criticalPrerequisites: {
      fr: 'Centrale de Songloulou (384 MW) démarrée sur son îlot local, synchroniseur automatique ANSI 25 activé au poste 225 kV de Mangombé.',
      en: 'Songloulou hydro plant (384 MW) islanded and ready, automatic ANSI 25 synchro-check active at Mangombé 225 kV substation.',
    },
    voltageKv: 225.0,
    frequencyHz: 50.0,
    activePowerMW: 120.0,
    reactivePowerMVAR: 25.0,
    keySafetyActions: {
      fr: 'Vérification des critères de couplage (ΔU < 2%, Δf < 0.08 Hz, Δθ < 4°). Fermeture automatique du disjoncteur d\'interconnexion RIS.',
      en: 'Synchro-check verified (ΔU < 2%, Δf < 0.08 Hz, Δθ < 4°). Interconnector breaker closes, reunifying national southern grid.',
    },
    status: 'pending',
  },
];

// ============================================================================
// 2. FERRANTI OVERVOLTAGE & TRANSMISSION LINE CHARGING CALCULATOR
// ============================================================================

export function calculateFerrantiEffect(
  params: FerrantiCalculationParams
): FerrantiCalculationResult {
  const {
    lineLengthKm,
    lineVoltageNominalKv,
    lineCapacitanceUfPerKm,
    shuntReactorCompensationMVAR,
    generatorUnderExcitationMVAR,
  } = params;

  // Angular frequency w = 2 * pi * 50 = 314.16 rad/s
  const omega = 2 * Math.PI * 50;

  // Total line capacitance C_total = lineLengthKm * lineCapacitanceUfPerKm * 1e-6
  const totalCapacitanceFarads = lineLengthKm * (lineCapacitanceUfPerKm * 1e-6);

  // Line capacitive charging MVAR Q_c = w * C * V^2
  // Line voltage in Volts = lineVoltageNominalKv * 1000
  const vLine = lineVoltageNominalKv * 1000;
  const chargingReactivePowerGeneratedMVAR = Number(
    ((omega * totalCapacitanceFarads * Math.pow(vLine, 2)) / 1e6).toFixed(2)
  );

  // Ferranti voltage rise formula on unloaded line:
  // Delta_V / V_s approx (w^2 * L * C * l^2) / 2
  // Typical velocity of propagation in overhead line ~ 290,000 km/s -> phase constant beta ~ 0.00108 rad/km
  const beta = 0.00108;
  const theoreticalVoltageRisePercent = Number(
    ((1 / Math.cos(beta * lineLengthKm) - 1) * 100).toFixed(2)
  );

  // Net reactive imbalance on 225 kV bus:
  // Imbalance = Charging MVAR - Shunt Reactors - Generator Absorption Capacity
  const netReactiveImbalanceMVAR = Number(
    (
      chargingReactivePowerGeneratedMVAR -
      shuntReactorCompensationMVAR -
      generatorUnderExcitationMVAR
    ).toFixed(2)
  );

  // If netReactiveImbalance > 0, terminal voltage rises beyond nominal
  // Approx 0.35 kV per uncompensated MVAR on 225 kV grid
  const unloadedReceivingVoltageKv = Number(
    (
      lineVoltageNominalKv * (1 + theoreticalVoltageRisePercent / 100) +
      Math.max(0, netReactiveImbalanceMVAR) * 0.32
    ).toFixed(1)
  );

  const voltageRisePercent = Number(
    (
      ((unloadedReceivingVoltageKv - lineVoltageNominalKv) /
        lineVoltageNominalKv) *
      100
    ).toFixed(1)
  );

  // Safe operating limit: V_receiving <= 245 kV (1.088 p.u. per IEC 60038 / SONATREL Grid Code)
  const isVoltageSafe = unloadedReceivingVoltageKv <= 242.0;

  const generatorOperatingMode = {
    fr:
      generatorUnderExcitationMVAR > 0
        ? `Absorption sous-excitée active : -${generatorUnderExcitationMVAR} MVAR (Marge de stabilité P-Q préservée)`
        : 'Fonctionnement à excitation nominale (cos φ = 1.00)',
    en:
      generatorUnderExcitationMVAR > 0
        ? `Under-excited leading mode: -${generatorUnderExcitationMVAR} MVAR absorbed (Within steady-state P-Q capability)`
        : 'Unity power factor operation (cos phi = 1.00)',
  };

  const ferrantiMitigationAdvice = {
    fr: isVoltageSafe
      ? `Tension de réception à Nyom II conforme (${unloadedReceivingVoltageKv} kV ≤ 242 kV). L'absorption combinée de l'alternateur G1 et de la réactance de compensation neutralise efficacement la composante capacitive.`
      : `ALERTE SURTENSION FERRANTI (${unloadedReceivingVoltageKv} kV > 242 kV) ! Risque de claquage diélectrique sur les parafoudres de Nyom II. Augmenter l'absorption sous-excitée de G1 ou enclencher la réactance shunt de 30 MVAR.`,
    en: isVoltageSafe
      ? `Receiving terminal voltage at Nyom II is secure (${unloadedReceivingVoltageKv} kV ≤ 242 kV). Generator leading MVAR absorption and shunt reactor compensation maintain safe voltage stability.`
      : `FERRANTI OVERVOLTAGE WARNING (${unloadedReceivingVoltageKv} kV > 242 kV)! Risk of surge arrester thermal puncture at Nyom II. Increase G1 leading absorption or engage 30 MVAR shunt reactor immediately.`,
  };

  return {
    unloadedReceivingVoltageKv,
    voltageRisePercent,
    chargingReactivePowerGeneratedMVAR,
    netReactiveImbalanceMVAR,
    generatorOperatingMode,
    isVoltageSafe,
    ferrantiMitigationAdvice,
  };
}

// ============================================================================
// 3. ISLAND BLOCK-LOAD ENERGIZATION SEQUENCE
// ============================================================================

export const ISLAND_BLOCK_LOAD_STEPS: IslandBlockLoadStep[] = [
  {
    stepId: 'BLOCK-01',
    targetName: {
      fr: 'Station de Traitement & Pompage d\'Eau Camwater Akomnyada',
      en: 'Akomnyada Camwater Water Treatment & Pumping Station',
    },
    blockPowerMW: 12.0,
    cumulativePowerMW: 12.0,
    expectedFrequencyDipHz: 49.52,
    governorRecoveryTimeSec: 2.8,
    priorityClass: 'Tier-1-LifeSafety',
  },
  {
    stepId: 'BLOCK-02',
    targetName: {
      fr: 'Hôpital Général & Centre des Urgences de Yaoundé (CURY)',
      en: 'Yaoundé General Hospital & Emergency Trauma Center (CURY)',
    },
    blockPowerMW: 8.5,
    cumulativePowerMW: 20.5,
    expectedFrequencyDipHz: 49.65,
    governorRecoveryTimeSec: 2.2,
    priorityClass: 'Tier-1-LifeSafety',
  },
  {
    stepId: 'BLOCK-03',
    targetName: {
      fr: 'Télécommunications Nationales (CAMTEL) & Centre de Données',
      en: 'National Telecommunications (CAMTEL) & Datacenter Hub',
    },
    blockPowerMW: 14.0,
    cumulativePowerMW: 34.5,
    expectedFrequencyDipHz: 49.44,
    governorRecoveryTimeSec: 3.4,
    priorityClass: 'Tier-2-WaterInfrastructure',
  },
  {
    stepId: 'BLOCK-04',
    targetName: {
      fr: 'Poste 90 kV Oyomabang & Quartiers Administratifs de Yaoundé',
      en: 'Oyomabang 90 kV Substation & Government Administrative District',
    },
    blockPowerMW: 25.0,
    cumulativePowerMW: 59.5,
    expectedFrequencyDipHz: 49.31,
    governorRecoveryTimeSec: 4.1,
    priorityClass: 'Tier-3-UrbanBaseload',
  },
];

// ============================================================================
// 4. ANSI 25 AUTOMATIC SYNCHRONIZER EVALUATOR
// ============================================================================

export function evaluateSynchroCheck(
  params: SynchroCheckParameters
): SynchroCheckResult {
  const {
    voltageDifferencePercent,
    frequencyDifferenceHz,
    phaseAngleDifferenceDeg,
    slipRateHzPerSec,
    breakerClosingTimeMs,
  } = params;

  const voltageOk = Math.abs(voltageDifferencePercent) <= 2.0;
  const frequencyOk = Math.abs(frequencyDifferenceHz) <= 0.1;
  const phaseAngleOk = Math.abs(phaseAngleDifferenceDeg) <= 5.0;
  const slipRateOk = Math.abs(slipRateHzPerSec) <= 0.05;

  const isPermissiveClosed =
    voltageOk && frequencyOk && phaseAngleOk && slipRateOk;

  // Lead time for breaker mechanism actuation: advance angle ~ 360 * slipRate * (closingTime / 1000)
  const anticipationLeadTimeMs = breakerClosingTimeMs;

  const statusMessage = {
    fr: isPermissiveClosed
      ? `CONDITIONS DE SYNCHRONISATION ANSI 25 CONFORMES : Ordre de fermeture disjoncteur validé avec anticipation de ${anticipationLeadTimeMs} ms.`
      : `INTERDICTION DE COUPLAGE ANSI 25 : Écart hors tolérance (${!voltageOk ? 'ΔU ' : ''}${!frequencyOk ? 'Δf ' : ''}${!phaseAngleOk ? 'Δθ ' : ''}${!slipRateOk ? 'Glissement' : ''}). Risque de choc d'arbre machine.`,
    en: isPermissiveClosed
      ? `ANSI 25 SYNCHRO-CHECK PERMISSIVE GRANTED: Breaker closing pulse initiated with ${anticipationLeadTimeMs} ms mechanical anticipation.`
      : `ANSI 25 SYNCHRO-CHECK BLOCKED: Out of permissive tolerance window (${!voltageOk ? 'ΔV ' : ''}${!frequencyOk ? 'Δf ' : ''}${!phaseAngleOk ? 'Δθ ' : ''}${!slipRateOk ? 'Slip rate' : ''}). Severe torque shock risk.`,
  };

  return {
    isPermissiveClosed,
    voltageOk,
    frequencyOk,
    phaseAngleOk,
    slipRateOk,
    anticipationLeadTimeMs,
    statusMessage,
  };
}
