// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 16 DATA ENGINE
// STEP 16: Autonomous AI Operations, PINN Cavitation Physics & DRL Dispatch
// ============================================================================

import type {
  PinnCavitationPoint,
  DrlDispatchAction,
  AutonomousAgentDecision,
} from '../types/hydropowerAiAutonomous';

// ============================================================================
// 1. PINN PHYSICS-INFORMED NEURAL NETWORK (CAVITATION PREDICTION)
// ============================================================================

export function generatePinnCavitationProfile(
  netHeadM: number,
  tailwaterElevationM: number
): PinnCavitationPoint[] {
  // Thoma number calculation: sigma = (H_atm - H_vap - H_s) / H_net
  // H_atm = 10.1 m, H_vap = 0.3 m (water @ 25°C)
  // Runner center elevation = 398.5 m
  const points: PinnCavitationPoint[] = [];

  for (let i = 0; i < 10; i++) {
    const discharge = 70 + i * 8; // 70 m3/s to 142 m3/s
    const runnerElevationM = 398.5;
    const suctionHeadHs = runnerElevationM - tailwaterElevationM;
    const sigmaPlant = Number(((10.1 - 0.3 - suctionHeadHs) / netHeadM).toFixed(3));

    // Critical sigma increases sharply at very high discharges
    const sigmaCritical = Number((0.085 + Math.pow(discharge / 140, 3) * 0.05).toFixed(3));

    // Vapor fraction from PINN Rayleigh-Plesset residual
    const vaporFraction = Math.max(
      0,
      Number(((sigmaCritical - sigmaPlant) * 18.5).toFixed(2))
    );

    // Erosion rate in mm/year (wear penalty)
    const erosionRate = Number((vaporFraction * 0.28).toFixed(2));

    // Recommended vane trim in percent to avoid vortex breakdown
    const recommendedTrim = vaporFraction > 0.5 ? Number((vaporFraction * 1.8).toFixed(1)) : 0;

    points.push({
      timeIndex: i,
      dischargeM3s: discharge,
      sigmaPlant,
      sigmaCritical,
      predictedVaporFractionPercent: vaporFraction,
      neuralPinnConfidence: Number((0.985 - vaporFraction * 0.015).toFixed(3)),
      erosionRateMmPerYear: erosionRate,
      recommendedVaneTrimPercent: recommendedTrim,
    });
  }

  return points;
}

// ============================================================================
// 2. DRL (DEEP REINFORCEMENT LEARNING) AUTONOMOUS DISPATCH POLICIES
// ============================================================================

export const DRL_DISPATCH_SCENARIOS: Record<string, DrlDispatchAction> = {
  peak_revenue: {
    targetDischargeM3s: 980,
    activeUnitsCount: 7,
    efficiencyPercent: 93.8,
    gridFrequencyHz: 50.02,
    dynamicRewardScore: 98.4,
    actionRationale: {
      fr: 'Maximisation de la rente spot J-1 : engagement des 7 groupes à charge optimale de 88% (meilleur point de rendement de la colline).',
      en: 'Spot peak revenue maximization: all 7 units dispatched at 88% optimal hill chart sweet-spot.',
    },
  },
  wear_minimization: {
    targetDischargeM3s: 720,
    activeUnitsCount: 5,
    efficiencyPercent: 94.6,
    gridFrequencyHz: 50.0,
    dynamicRewardScore: 95.1,
    actionRationale: {
      fr: 'Préservation maximale de la durée de vie : arrêt de 2 groupes pour éviter le fonctionnement en charge partielle cavitante (< 55%).',
      en: 'Asset lifetime preservation: 2 units idled to prevent destructive part-load cavitation regime (< 55%).',
    },
  },
  frequency_stabilization: {
    targetDischargeM3s: 840,
    activeUnitsCount: 6,
    efficiencyPercent: 93.2,
    gridFrequencyHz: 49.98,
    dynamicRewardScore: 96.8,
    actionRationale: {
      fr: 'Réserve primaire FCR étendue : chaque groupe conserve une marge dynamique de +7 MW mobilisable en 2 secondes.',
      en: 'Extended FCR primary spinning reserve: each unit maintains a dynamic +7 MW headroom injectible in 2s.',
    },
  },
};

// ============================================================================
// 3. AUTONOMOUS AGENT INCIDENT RESOLUTION LOGS
// ============================================================================

export const AUTONOMOUS_INCIDENTS_LOG: AutonomousAgentDecision[] = [
  {
    timestamp: '14:28:12',
    eventType: 'frequency_dip',
    severity: 'high',
    sensorInputs: [
      { name: 'Réseau RIS Fréquence', value: '49.62 Hz (-380 mHz)' },
      { name: 'Dérivée df/dt (RoCoF)', value: '-0.32 Hz/s' },
      { name: 'Puissance Active Totale', value: '345 MW' },
    ],
    pinnAnalysis: {
      fr: 'Déclenchement intempestif de la ligne Mangombé 225 kV détecté. Risque d\'écroulement de fréquence sous 49.20 Hz en 4.5 secondes.',
      en: 'Unscheduled trip of Mangombé 225 kV tie-line detected. Grid frequency collapse risk (< 49.20 Hz) within 4.5 seconds.',
    },
    autonomousActionTaken: {
      fr: 'Injection inertielle synthétique immédiate (+28 MW en 1.4s) via régulateur neural FCR. Stabilisation de la fréquence à 49.95 Hz sans coup de bélier critique.',
      en: 'Instant synthetic inertial response (+28 MW in 1.4s) deployed via neural governor. Frequency restored to 49.95 Hz without penstock overpressure.',
    },
    humanOverrideWindowSeconds: 15,
    status: 'executed',
  },
  {
    timestamp: '11:15:40',
    eventType: 'bearing_hotspot',
    severity: 'medium',
    sensorInputs: [
      { name: 'Palier Guide Sup G2', value: '78.5 °C (+1.2 °C/min)' },
      { name: 'Débit Huile Lubrification', value: '112 L/min (-18%)' },
      { name: 'Spectre Vibration 1X', value: '2.1 mm/s RMS' },
    ],
    pinnAnalysis: {
      fr: 'Prédiction PINN thermo-visqueuse : colmatage partiel du filtre à huile duplex F-02. Risque de fusion du métal blanc sous 22 minutes.',
      en: 'PINN thermal-viscosity prediction: partial clogging of duplex lube oil filter F-02. Babbitt wipe hazard predicted within 22 minutes.',
    },
    autonomousActionTaken: {
      fr: 'Basculement automatique de la vanne motorisée sur le filtre secondaire propre. Démarrage de la pompe de secours P-02B. Température stabilisée à 56.2 °C.',
      en: 'Automated changeover valve actuation to standby filter. Backup pump P-02B started. Temperature stabilized at 56.2 °C.',
    },
    humanOverrideWindowSeconds: 30,
    status: 'executed',
  },
  {
    timestamp: '08:45:00',
    eventType: 'flood_wave_inflow',
    severity: 'high',
    sensorInputs: [
      { name: 'Débit Amont Sanaga', value: '2 150 m³/s (+320 m³/s)' },
      { name: 'Capteurs Radar Barrage', value: 'Cote 405.40 m' },
      { name: 'Pluviométrie Bassin', value: '62 mm/6h' },
    ],
    pinnAnalysis: {
      fr: 'Onde de crue soudaine amont. Modèle hydrodynamique PINN prévoyant une cote de 405.90 m (proche du PHE 406.00 m) dans 3h15.',
      en: 'Sudden upstream flood wave. Hydrodynamic PINN forecasts 405.90 m water level (near design flood level 406.00 m) in 3h15.',
    },
    autonomousActionTaken: {
      fr: 'Ouverture progressive des vannes de déversoir n°2 et n°3 de 1.80 m. Débit évacué 750 m³/s en respectant la vitesse limite de variation du plan d\'eau.',
      en: 'Controlled sequential opening of spillway gates #2 and #3 by 1.80 m. Discharging 750 m³/s within safe reservoir drawdown rate.',
    },
    humanOverrideWindowSeconds: 60,
    status: 'supervisory_confirmed',
  },
];
