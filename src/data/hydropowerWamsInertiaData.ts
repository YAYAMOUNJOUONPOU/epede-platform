// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 23 DATA & SIMULATION ENGINE
// WAMS Synchrophasor Network (IEEE C37.118), System Rotational Inertia (Hsys),
// RoCoF (df/dt) Dynamic Solver, Electromechanical Oscillations & PSS2B Damping
// ============================================================================

import type {
  PmuPhasorNode,
  GridInertiaPlant,
  RocofContingency,
  OscillationMode,
  PssSetting,
  GridFormingConfig,
} from '../types/hydropowerWamsInertia';

// ----------------------------------------------------------------------------
// 1. WAMS SYNCHROPHASOR PMU NETWORK (IEEE C37.118.1 / IEC 61850-90-5)
// ----------------------------------------------------------------------------
export const DEFAULT_PMU_NODES: PmuPhasorNode[] = [
  {
    id: 'PMU_NACHTIGAL_225',
    tag: 'PMU-01',
    substationName: 'Nachtigal Poste Évacuation 225 kV',
    region: 'Haute-Sanaga (Centre)',
    voltageLevelKv: 225,
    voltageMagnitudePu: 1.025,
    voltageAngleDeg: 0.0, // SLACK BUS REFERENCE
    frequencyHz: 50.005,
    rocofHzPerSec: 0.008,
    activePowerFlowMw: 418.5,
    reactivePowerFlowMvar: 42.1,
    latitude: 4.346,
    longitude: 11.636,
    streamRateFps: 50,
    syncStatus: 'LOCKED_GPS',
    totalVectorErrorPercent: 0.042,
    latencyMs: 7.5,
    distanceFromNachtigalKm: 0,
  },
  {
    id: 'PMU_YAOUNDE_OYOMABANG',
    tag: 'PMU-02',
    substationName: 'Yaoundé Oyomabang 225/90 kV',
    region: 'Centre Urbain',
    voltageLevelKv: 225,
    voltageMagnitudePu: 0.998,
    voltageAngleDeg: -7.45,
    frequencyHz: 50.004,
    rocofHzPerSec: 0.009,
    activePowerFlowMw: 195.0,
    reactivePowerFlowMvar: 28.4,
    latitude: 3.866,
    longitude: 11.488,
    streamRateFps: 50,
    syncStatus: 'LOCKED_GPS',
    totalVectorErrorPercent: 0.065,
    latencyMs: 11.8,
    distanceFromNachtigalKm: 65,
  },
  {
    id: 'PMU_EDEA_MANGOMBE',
    tag: 'PMU-03',
    substationName: 'Mangombé / Edéa Nœud Interconnexion',
    region: 'Littoral Est',
    voltageLevelKv: 225,
    voltageMagnitudePu: 1.012,
    voltageAngleDeg: -11.8,
    frequencyHz: 50.002,
    rocofHzPerSec: 0.012,
    activePowerFlowMw: 165.2,
    reactivePowerFlowMvar: 18.9,
    latitude: 3.798,
    longitude: 10.134,
    streamRateFps: 50,
    syncStatus: 'LOCKED_GPS',
    totalVectorErrorPercent: 0.078,
    latencyMs: 16.4,
    distanceFromNachtigalKm: 185,
  },
  {
    id: 'PMU_BEKOKO_DOUALA',
    tag: 'PMU-04',
    substationName: 'Bekoko / Douala Ouest 225/90 kV',
    region: 'Littoral Industriel',
    voltageLevelKv: 225,
    voltageMagnitudePu: 0.984,
    voltageAngleDeg: -15.35,
    frequencyHz: 49.998,
    rocofHzPerSec: -0.015,
    activePowerFlowMw: 142.0,
    reactivePowerFlowMvar: 34.5,
    latitude: 4.15,
    longitude: 9.68,
    streamRateFps: 50,
    syncStatus: 'LOCKED_GPS',
    totalVectorErrorPercent: 0.089,
    latencyMs: 21.2,
    distanceFromNachtigalKm: 240,
  },
  {
    id: 'PMU_BAFOUSSAM',
    tag: 'PMU-05',
    substationName: 'Bafoussam Boucle Ouest 225/90 kV',
    region: 'Hauts-Plateaux de l\'Ouest',
    voltageLevelKv: 225,
    voltageMagnitudePu: 0.976,
    voltageAngleDeg: -18.6,
    frequencyHz: 49.995,
    rocofHzPerSec: -0.018,
    activePowerFlowMw: 68.4,
    reactivePowerFlowMvar: 15.2,
    latitude: 5.477,
    longitude: 10.417,
    streamRateFps: 50,
    syncStatus: 'LOCKED_GPS',
    totalVectorErrorPercent: 0.108,
    latencyMs: 25.8,
    distanceFromNachtigalKm: 280,
  },
  {
    id: 'PMU_NDJAMENA_TRANS_SAHEL',
    tag: 'PMU-06',
    substationName: 'N\'Djamena Poste Interconnexion Tchad 225 kV',
    region: 'Corridor Trans-Sahel (Inter-Réseau)',
    voltageLevelKv: 225,
    voltageMagnitudePu: 0.962,
    voltageAngleDeg: -24.5,
    frequencyHz: 49.988,
    rocofHzPerSec: -0.024,
    activePowerFlowMw: 95.0,
    reactivePowerFlowMvar: 22.0,
    latitude: 12.113,
    longitude: 15.048,
    streamRateFps: 50,
    syncStatus: 'LOCKED_GPS',
    totalVectorErrorPercent: 0.135,
    latencyMs: 44.5,
    distanceFromNachtigalKm: 1050,
  },
];

// ----------------------------------------------------------------------------
// 2. GRID INERTIA FLEET OF THE CAMEROON INTERCONNECTED NETWORK (RIS/RIN)
// ----------------------------------------------------------------------------
export const DEFAULT_INERTIA_FLEET: GridInertiaPlant[] = [
  {
    id: 'PLANT_NACHTIGAL',
    plantName: 'Nachtigal Hydro (420 MW)',
    type: 'HYDRO_RUN_OF_RIVER',
    ratedCapacityMva: 466.7,
    activePowerMw: 420.0,
    inertiaConstantH: 4.2, // H = 4.2 s (Haute inertie groupes Francis verticaux)
    storedKineticEnergyMws: 1960.0, // 466.7 * 4.2 = 1960 MJ
    onlineUnits: 7,
    totalUnits: 7,
    governorDroopPercent: 4.0,
    isGridForming: false,
  },
  {
    id: 'PLANT_SONGLOULOU',
    plantName: 'Songloulou Hydro (384 MW)',
    type: 'HYDRO_RUN_OF_RIVER',
    ratedCapacityMva: 426.7,
    activePowerMw: 350.0,
    inertiaConstantH: 3.8,
    storedKineticEnergyMws: 1621.4,
    onlineUnits: 8,
    totalUnits: 8,
    governorDroopPercent: 4.0,
    isGridForming: false,
  },
  {
    id: 'PLANT_EDEA',
    plantName: 'Edéa Hydro (276 MW)',
    type: 'HYDRO_RUN_OF_RIVER',
    ratedCapacityMva: 306.7,
    activePowerMw: 210.0,
    inertiaConstantH: 3.2,
    storedKineticEnergyMws: 981.4,
    onlineUnits: 12,
    totalUnits: 14,
    governorDroopPercent: 4.5,
    isGridForming: false,
  },
  {
    id: 'PLANT_LOM_PANGAR',
    plantName: 'Lom Pangar Pied de Barrage (30 MW)',
    type: 'HYDRO_STORAGE',
    ratedCapacityMva: 35.0,
    activePowerMw: 30.0,
    inertiaConstantH: 3.0,
    storedKineticEnergyMws: 105.0,
    onlineUnits: 4,
    totalUnits: 4,
    governorDroopPercent: 4.0,
    isGridForming: false,
  },
  {
    id: 'PLANT_FLOATING_SOLAR_FPV',
    plantName: 'Solaire Flottant Nachtigal Lac (50 MWp)',
    type: 'FLOATING_SOLAR_IBR',
    ratedCapacityMva: 55.0,
    activePowerMw: 45.0,
    inertiaConstantH: 0.0, // Zero kinetic inertia (Inverter-Based Resource)
    storedKineticEnergyMws: 0.0,
    onlineUnits: 25,
    totalUnits: 25,
    governorDroopPercent: 0.0,
    isGridForming: false,
  },
  {
    id: 'PLANT_BESS_GRID_FORMING',
    plantName: 'Système BESS Formeur de Réseau (40 MW / 80 MWh)',
    type: 'BESS_GRID_FORMING',
    ratedCapacityMva: 45.0,
    activePowerMw: 10.0,
    inertiaConstantH: 5.5, // Synthetic/Emulated Inertia H = 5.5 s via Virtual Synchronous Machine
    storedKineticEnergyMws: 247.5,
    onlineUnits: 10,
    totalUnits: 10,
    governorDroopPercent: 1.5,
    isGridForming: true,
  },
];

// ----------------------------------------------------------------------------
// 3. ROCOF CONTINGENCY SCENARIOS (df/dt DYNAMICS)
// ----------------------------------------------------------------------------
export const ROCOF_CONTINGENCIES: RocofContingency[] = [
  {
    id: 'LOSS_OF_GENERATION_60MW',
    nameFr: 'Déclenchement Soudain 1 Groupe Nachtigal (-60 MW)',
    nameEn: 'Sudden Trip of 1 Nachtigal Francis Unit (-60 MW)',
    deltaPowerMw: -60.0,
    severity: 'MODERATE',
    descriptionFr: 'Déclenchement d\'un groupe de 60 MW par protection de cuve transformateur différentielle ANSI 87T.',
    descriptionEn: 'Single 60 MW unit trip triggered by generator step-up transformer differential relay ANSI 87T.',
    expectedRocofHzPerSec: -0.32,
    expectedNadirHz: 49.65,
    timeToNadirSec: 3.2,
    settlingFreqHz: 49.88,
    mitigationEfficacyPercent: 94,
  },
  {
    id: 'LOSS_OF_GENERATION_120MW',
    nameFr: 'Perte Bipolaire 2 Groupes Nachtigal (-120 MW)',
    nameEn: 'Double Unit Trip (-120 MW Generation Loss)',
    deltaPowerMw: -120.0,
    severity: 'CRITICAL',
    descriptionFr: 'Perte simultanée de 2 groupes lors d\'un déclenchement de travée barre 225 kV. Test critique de RoCoF.',
    descriptionEn: 'Simultaneous loss of 2 units due to 225 kV busbar protection trip. Critical system inertia test.',
    expectedRocofHzPerSec: -0.68,
    expectedNadirHz: 49.18,
    timeToNadirSec: 2.6,
    settlingFreqHz: 49.72,
    mitigationEfficacyPercent: 88,
  },
  {
    id: 'LOSS_OF_LOAD_ALUCAM_145MW',
    nameFr: 'Délestage Brutal Cuve Électrolyse ALUCAM (+145 MW)',
    nameEn: 'Sudden ALUCAM Smelter Potline Rejection (+145 MW)',
    deltaPowerMw: 145.0, // Excess generation -> Frequency surge (Zenith)
    severity: 'CRITICAL',
    descriptionFr: 'Déconnexion brutale de la cuve industrielle ALUCAM à Edéa. Excédent massif de puissance active et surfréquence.',
    descriptionEn: 'Instantaneous disconnection of industrial potlines at Edéa. Severe active power surplus and overfrequency.',
    expectedRocofHzPerSec: +0.78,
    expectedNadirHz: 50.84, // Peak overfrequency
    timeToNadirSec: 2.8,
    settlingFreqHz: 50.25,
    mitigationEfficacyPercent: 91,
  },
  {
    id: 'TRIP_LINE_225KV_OYOMABANG',
    nameFr: 'Déclenchement Ligne 225 kV Nachtigal-Yaoundé (-195 MW)',
    nameEn: 'Trip of 225 kV Nachtigal-Yaoundé Line Circuit (-195 MW)',
    deltaPowerMw: -195.0,
    severity: 'CRITICAL',
    descriptionFr: 'Court-circuit biphasé franc sur le couloir 225 kV Nachtigal-Oyomabang. Sévère choc angulaire et inertiel.',
    descriptionEn: 'Two-phase bolted fault on 225 kV transmission line. Extreme angular shear and RoCoF challenge.',
    expectedRocofHzPerSec: -1.05, // Violates 1.0 Hz/s standard limit if unmitigated!
    expectedNadirHz: 48.75,
    timeToNadirSec: 2.1,
    settlingFreqHz: 49.52,
    mitigationEfficacyPercent: 79,
  },
  {
    id: 'HIGH_SOLAR_IBR_PENETRATION',
    nameFr: 'Scénario Forte Pénétration Solaire 60% sans Inertie',
    nameEn: 'High Inverter-Based Resource (60% Solar) Low-Inertia Scenario',
    deltaPowerMw: -80.0,
    severity: 'HIGH',
    descriptionFr: 'Réseau dominé par l\'électronique de puissance (inverters). L\'inertie système chute de 55%, quadruplant le RoCoF.',
    descriptionEn: 'Inverter-dominated low-inertia grid. System inertia falls by 55%, causing extreme RoCoF steepness.',
    expectedRocofHzPerSec: -1.35,
    expectedNadirHz: 48.45,
    timeToNadirSec: 1.6,
    settlingFreqHz: 49.40,
    mitigationEfficacyPercent: 72,
  },
];

// ----------------------------------------------------------------------------
// 4. ELECTROMECHANICAL OSCILLATIONS MODES & PSS DAMPING (IEEE 421.5)
// ----------------------------------------------------------------------------
export const OSCILLATION_MODES: OscillationMode[] = [
  {
    id: 'MODE_INTER_AREA_CENTRE_LITTORAL',
    modeNameFr: 'Mode Inter-Zones Centre (Nachtigal) vs Littoral (Douala/Edéa)',
    modeNameEn: 'Inter-Area Mode: Centre (Nachtigal) vs Littoral (Edéa/Douala)',
    frequencyHz: 0.65,
    dampingRatioWithoutPssPercent: 1.8, // Dangerous! Below 5% criterion
    dampingRatioWithPssPercent: 14.8,    // Robust damping > 10%
    type: 'INTER_AREA_CENTRE_LITTORAL',
    participatingSubstations: ['Nachtigal 225 kV', 'Oyomabang 225 kV', 'Mangombé 225 kV', 'Bekoko 225 kV'],
    riskDescriptionFr: 'Oscillation de puissance de 40 à 80 MW entre les pôles de production du Centre et les charges du Littoral. Risque d\'écroulement angulaire sans PSS.',
    riskDescriptionEn: 'Power swinging of 40-80 MW between Centre generation and Littoral loads. Risk of angular pole slip without PSS.',
  },
  {
    id: 'MODE_LOCAL_NACHTIGAL_PLANT',
    modeNameFr: 'Mode Local Groupes Nachtigal vs Nœud Évacuation 225 kV',
    modeNameEn: 'Local Plant Mode: Nachtigal Units vs 225 kV Evacuation Substation',
    frequencyHz: 1.28,
    dampingRatioWithoutPssPercent: 4.2,
    dampingRatioWithPssPercent: 18.5,
    type: 'LOCAL_PLANT',
    participatingSubstations: ['Nachtigal Alternateurs G01-G07', 'Poste Nachtigal 225 kV'],
    riskDescriptionFr: 'Oscillation rotorique locale à haute fréquence contre la réactance de court-circuit du réseau SONATREL.',
    riskDescriptionEn: 'High frequency local rotor swinging against the short-circuit reactance of the SONATREL transmission network.',
  },
  {
    id: 'MODE_TRANS_SAHEL_CAMEROON_CHAD',
    modeNameFr: 'Mode Inter-Réseau Trans-Sahel Cameroun vs Tchad (N\'Djamena)',
    modeNameEn: 'Inter-Regional Mode: Cameroon Grid vs Chad (N\'Djamena)',
    frequencyHz: 0.34, // Very slow inter-regional mode across 1050 km
    dampingRatioWithoutPssPercent: 0.7, // Severe instability hazard!
    dampingRatioWithPssPercent: 11.2,
    type: 'INTER_AREA_CAMEROON_CHAD',
    participatingSubstations: ['Nachtigal 225 kV', 'Ngaoundéré 225 kV', 'N\'Djamena 225 kV'],
    riskDescriptionFr: 'Liaison longue distance à forte impédance. En cas de transit d\'export de 100 MW, l\'amortissement naturel s\'annule et peut provoquer un déclenchement en cascade.',
    riskDescriptionEn: 'High-impedance long interconnection line. Under 100 MW export transit, natural damping vanishes causing risk of cascade blackout.',
  },
  {
    id: 'MODE_HYDRAULIC_GOVERNOR_INTERACTION',
    modeNameFr: 'Mode Interaction Colonne d\'Eau (Allievi) & Régulateur de Vitesse',
    modeNameEn: 'Water Column Inertia & Turbine Governor Interaction Mode',
    frequencyHz: 0.12,
    dampingRatioWithoutPssPercent: 9.5,
    dampingRatioWithPssPercent: 21.0,
    type: 'CONTROL_LOOP',
    participatingSubstations: ['Régulateurs Alstom/Neyrpic Nachtigal', 'Cheminée d\'Équilibre'],
    riskDescriptionFr: 'Effet non-minimum de phase du coup de bélier (Tw = 1.45 s). Un gain trop élevé du régulateur génère des oscillations basse fréquence de la colonne d\'eau.',
    riskDescriptionEn: 'Non-minimum phase water hammer effect (Tw = 1.45 s). Excessive governor proportional gain drives low frequency penstock oscillations.',
  },
];

// ----------------------------------------------------------------------------
// 5. DEFAULT PSS2B DAMPING STABILIZER SETTINGS (IEEE 421.5)
// ----------------------------------------------------------------------------
export const DEFAULT_PSS_SETTING: PssSetting = {
  stabilizerModel: 'IEEE_PSS2B',
  status: 'ACTIVE_DAMPING',
  gainKs1: 20.0,
  washoutTw1Sec: 10.0,
  washoutTw2Sec: 10.0,
  leadLagT1Sec: 0.16,
  leadLagT2Sec: 0.03,
  leadLagT3Sec: 0.16,
  leadLagT4Sec: 0.03,
  outputLimitVstMaxPu: 0.10,
  outputLimitVstMinPu: -0.10,
  inputSignalsFr: 'Signal combiné : Écart de vitesse rotorique (Δω) + Puissance accélératrice intégrée (ΔPa = Pm - Pe)',
  inputSignalsEn: 'Dual-input: Rotor speed deviation (Δω) + Integral of accelerating power (ΔPa = Pm - Pe)',
};

// ----------------------------------------------------------------------------
// 6. DEFAULT GRID-FORMING (GFM) / FAST FREQUENCY RESPONSE (FFR) PARAMETERS
// ----------------------------------------------------------------------------
export const DEFAULT_GFM_CONFIG: GridFormingConfig = {
  mode: 'VIRTUAL_SYNCHRONOUS_MACHINE',
  emulatedInertiaH: 5.5,
  droopCoefficientPercent: 1.5,
  fastFrequencyResponseDelayMs: 22.0, // 22 ms injection vs 1400 ms mechanical water delay!
  activeDampingCoeff: 25.0,
  blackStartCapable: true,
  maxOverloadPu: 1.5,
};

// ----------------------------------------------------------------------------
// 7. MATHEMATICAL SIMULATION HELPERS
// ----------------------------------------------------------------------------

/**
 * Calculates aggregate system inertia and kinetic energy
 */
export function computeSystemInertia(fleet: GridInertiaPlant[]) {
  let totalStoredKineticMws = 0;
  let totalActivePowerMw = 0;
  let totalOnlineMva = 0;

  for (const plant of fleet) {
    const fraction = plant.onlineUnits / Math.max(1, plant.totalUnits);
    const onlineMva = plant.ratedCapacityMva * fraction;
    const plantEk = onlineMva * plant.inertiaConstantH;

    totalOnlineMva += onlineMva;
    totalStoredKineticMws += plantEk;
    totalActivePowerMw += plant.activePowerMw * fraction;
  }

  const hSys = totalOnlineMva > 0 ? totalStoredKineticMws / totalOnlineMva : 3.0;

  return {
    hSysSeconds: parseFloat(hSys.toFixed(2)),
    totalStoredKineticGws: parseFloat((totalStoredKineticMws / 1000).toFixed(2)),
    totalActivePowerMw: Math.round(totalActivePowerMw),
    totalOnlineMva: Math.round(totalOnlineMva),
  };
}

/**
 * Dynamic RoCoF and Frequency Time Series Solver (Swing Equation + Primary Governor + BESS FFR)
 * t = 0 to 12 seconds
 */
export function simulateFrequencyTrajectory(
  contingency: RocofContingency,
  hSys: number,
  totalSystemMva: number,
  pssActive: boolean,
  gfmActive: boolean
): { time: number; frequency: number; rocof: number; pssDamping: number }[] {
  const f0 = 50.0;
  const points: { time: number; frequency: number; rocof: number; pssDamping: number }[] = [];

  const deltaP = contingency.deltaPowerMw; // MW
  const effectiveH = gfmActive ? hSys + 1.2 : hSys; // GFM adds synthetic inertia
  const governorDroop = 0.04; // 4%
  const governorTimeConstant = 2.4; // 2.4s hydro governor mechanical lag

  // Initial RoCoF at t = 0+
  // df/dt = (f0 * deltaP) / (2 * H * Ssys)
  const initialRocof = (f0 * deltaP) / (2 * effectiveH * totalSystemMva);

  // Time step 0.2s from 0 to 12s
  for (let t = 0; t <= 12.0; t += 0.2) {
    const time = parseFloat(t.toFixed(1));

    if (time <= 0) {
      points.push({ time, frequency: f0, rocof: 0, pssDamping: 0 });
      continue;
    }

    // Instantaneous governor response with water hammer setback (non-minimum phase delay)
    const governorRamp = 1 - Math.exp(-Math.max(0, time - 0.5) / governorTimeConstant);
    const gfmInjection = gfmActive && time > 0.05 ? Math.exp(-time / 1.8) * (-deltaP * 0.45) : 0;

    // Electromechanical oscillation damping component
    const oscFreq = 0.65; // Inter-area 0.65 Hz
    const dampingRatio = pssActive ? 0.15 : 0.02;
    const oscAmplitude = (deltaP / totalSystemMva) * 0.45 * Math.exp(-dampingRatio * 2 * Math.PI * oscFreq * time);
    const oscillation = oscAmplitude * Math.sin(2 * Math.PI * oscFreq * time);

    // Dynamic frequency trajectory
    const primaryRecovery = (-deltaP * governorRamp * (1 / governorDroop) * 0.00015);
    const rawRocof = initialRocof * Math.exp(-time / (effectiveH * 0.9));
    const deltaF = (initialRocof * (1 - Math.exp(-time / 1.4))) * 1.5 + primaryRecovery + (gfmInjection / totalSystemMva) * 0.5 + oscillation;

    const currentFreq = f0 + deltaF;
    const currentRocof = rawRocof + (gfmActive ? rawRocof * -0.4 : 0);
    const pssEffort = pssActive ? Math.abs(oscillation) * 12.5 : 0;

    points.push({
      time,
      frequency: parseFloat(currentFreq.toFixed(3)),
      rocof: parseFloat(currentRocof.toFixed(3)),
      pssDamping: parseFloat(pssEffort.toFixed(2)),
    });
  }

  return points;
}

/**
 * Calculates phase angle power transfer and margin against steady-state stability limit:
 * P = (V1 * V2 / X) * sin(delta)
 */
export function computeLinePowerMargin(v1Pu: number, v2Pu: number, xReactancePu: number, deltaDeg: number) {
  const deltaRad = (deltaDeg * Math.PI) / 180;
  const pMax = (v1Pu * v2Pu) / xReactancePu; // Theoretical static stability limit at 90 deg
  const pTransferred = pMax * Math.sin(Math.abs(deltaRad));
  const marginPercent = Math.max(0, ((pMax - pTransferred) / pMax) * 100);

  return {
    pMaxPu: parseFloat(pMax.toFixed(2)),
    pTransferredPu: parseFloat(pTransferred.toFixed(2)),
    marginPercent: Math.round(marginPercent),
    isWarning: Math.abs(deltaDeg) > 25,
    isCritical: Math.abs(deltaDeg) > 40,
  };
}
