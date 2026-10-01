// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 19 DATA ENGINE
// STEP 19: Dam Break Hydrodynamic Wave 2D (Saint-Venant), Inundation Mapping,
// Emergency Action Plan (PPI / ORSEC) & Early Warning Sirens
// ============================================================================

import type {
  BreachMechanism,
  BreachParameters,
  DownstreamSettlement,
  EmergencySirenStation,
  PpiEvacuationCorridor,
} from '../types/hydropowerDamBreak';

// ============================================================================
// 1. DEFAULT BREACH PARAMETERS (NACHTIGAL 65 Mm³ HEADPOND / SANAGA)
// ============================================================================

export const DEFAULT_BREACH_PARAMS: BreachParameters = {
  mechanism: 'overtopping',
  reservoirVolumeMm3: 65.0, // Retenue de Nachtigal au PHE (Cote 405.5 m)
  damHeightMeters: 14.0,     // Hauteur maximale de la digue BCR
  waterLevelAboveCrestMeters: 1.2, // Surverse extrême crue PMF (Probable Maximum Flood)
  breachWidthAverageMeters: 85.0, // Largeur moyenne calculée selon Froehlich
  sideSlopeRatioZ: 0.7,      // 0.7H:1V pour béton compacté au rouleau (BCR)
  formationTimeMinutes: 45,  // Temps de dégradation de la digue tf
  peakDischargeQpM3s: 18450, // Débit de pointe d'onde de rupture (m3/s)
};

// ============================================================================
// 2. DOWNSTREAM SETTLEMENTS & HYDRODYNAMIC WAVE PROPAGATION (2D SAINT-VENANT)
// ============================================================================

export const DOWNSTREAM_SETTLEMENTS_DATA: DownstreamSettlement[] = [
  {
    id: 'batchenga_ferry',
    nameFr: 'Batchenga & Bac de Traversée Sanaga',
    nameEn: 'Batchenga & Sanaga Ferry Crossing',
    distanceKm: 8.5,
    waveArrivalTimeMinutes: 14,
    peakArrivalTimeMinutes: 38,
    maxInundationDepthMeters: 11.8,
    maxFlowVelocityMs: 5.4,
    lethalHazardProduct: 63.7, // 11.8 m * 5.4 m/s = 63.7 m2/s >> 1.5
    hazardClassification: 'EXTREME',
    populationAtRisk: 1420,
    evacuationSafeZonesCount: 3,
    sirensActiveCount: 2,
  },
  {
    id: 'obala_confluence',
    nameFr: 'Obala (Confluence Afamba - Sanaga)',
    nameEn: 'Obala (Afamba - Sanaga River Confluence)',
    distanceKm: 24.0,
    waveArrivalTimeMinutes: 35,
    peakArrivalTimeMinutes: 85,
    maxInundationDepthMeters: 8.6,
    maxFlowVelocityMs: 4.1,
    lethalHazardProduct: 35.3,
    hazardClassification: 'EXTREME',
    populationAtRisk: 3850,
    evacuationSafeZonesCount: 5,
    sirensActiveCount: 4,
  },
  {
    id: 'monatele_valley',
    nameFr: 'Monatélé & Plaines Alluviales',
    nameEn: 'Monatélé & Alluvial Plains',
    distanceKm: 46.0,
    waveArrivalTimeMinutes: 72,
    peakArrivalTimeMinutes: 165,
    maxInundationDepthMeters: 6.4,
    maxFlowVelocityMs: 3.2,
    lethalHazardProduct: 20.5,
    hazardClassification: 'EXTREME',
    populationAtRisk: 6200,
    evacuationSafeZonesCount: 7,
    sirensActiveCount: 5,
  },
  {
    id: 'ebebda_bridge',
    nameFr: 'Ebebda (Pont Stratégique RN4)',
    nameEn: 'Ebebda (Strategic Highway RN4 Bridge)',
    distanceKm: 72.0,
    waveArrivalTimeMinutes: 120,
    peakArrivalTimeMinutes: 260,
    maxInundationDepthMeters: 4.8,
    maxFlowVelocityMs: 2.6,
    lethalHazardProduct: 12.5,
    hazardClassification: 'HIGH',
    populationAtRisk: 4100,
    evacuationSafeZonesCount: 4,
    sirensActiveCount: 3,
  },
  {
    id: 'songloulou_cascade',
    nameFr: 'Song Loulou (Retenue Aval & Centrale)',
    nameEn: 'Song Loulou (Downstream Dam & Powerhouse)',
    distanceKm: 125.0,
    waveArrivalTimeMinutes: 230,
    peakArrivalTimeMinutes: 480,
    maxInundationDepthMeters: 3.2,
    maxFlowVelocityMs: 2.0,
    lethalHazardProduct: 6.4,
    hazardClassification: 'HIGH',
    populationAtRisk: 2800,
    evacuationSafeZonesCount: 4,
    sirensActiveCount: 3,
  },
  {
    id: 'edea_delta',
    nameFr: 'Edéa (Ponts Ferroviaires Camrail & Usine ALUCAM)',
    nameEn: 'Edéa (Camrail Rail Bridges & ALUCAM Smelter)',
    distanceKm: 168.0,
    waveArrivalTimeMinutes: 340,
    peakArrivalTimeMinutes: 710,
    maxInundationDepthMeters: 2.1,
    maxFlowVelocityMs: 1.4,
    lethalHazardProduct: 2.94,
    hazardClassification: 'MEDIUM',
    populationAtRisk: 14500,
    evacuationSafeZonesCount: 12,
    sirensActiveCount: 8,
  },
];

// ============================================================================
// 3. EMERGENCY SIREN STATIONS TELEMETRY (130 dB / CAP PROTOCOL)
// ============================================================================

export const SIREN_STATIONS_DATA: EmergencySirenStation[] = [
  {
    id: 'SIR-01',
    code: 'SIR-NTG-01',
    locationName: 'Nachtigal Usine & Cité d\'Exploitation',
    distanceKm: 0.8,
    coverageRadiusKm: 3.5,
    acousticPowerDb: 130,
    status: 'ONLINE',
    transmissionMedia: 'SATELLITE_IRIDIUM',
    batteryAutonomyHours: 72,
    lastTestTimestamp: '2026-09-08 09:00 UTC',
  },
  {
    id: 'SIR-02',
    code: 'SIR-BTC-01',
    locationName: 'Batchenga Centre & Embarcadère',
    distanceKm: 8.5,
    coverageRadiusKm: 4.0,
    acousticPowerDb: 132,
    status: 'ONLINE',
    transmissionMedia: 'VHF_RADIO',
    batteryAutonomyHours: 96,
    lastTestTimestamp: '2026-09-08 09:00 UTC',
  },
  {
    id: 'SIR-03',
    code: 'SIR-OBL-01',
    locationName: 'Obala Rive Droite',
    distanceKm: 23.5,
    coverageRadiusKm: 4.5,
    acousticPowerDb: 135,
    status: 'ONLINE',
    transmissionMedia: 'SATELLITE_IRIDIUM',
    batteryAutonomyHours: 84,
    lastTestTimestamp: '2026-09-08 09:00 UTC',
  },
  {
    id: 'SIR-04',
    code: 'SIR-MNT-01',
    locationName: 'Monatélé Colline Administrative',
    distanceKm: 46.0,
    coverageRadiusKm: 5.0,
    acousticPowerDb: 135,
    status: 'ONLINE',
    transmissionMedia: 'CELLULAR_4G',
    batteryAutonomyHours: 72,
    lastTestTimestamp: '2026-09-08 09:00 UTC',
  },
  {
    id: 'SIR-05',
    code: 'SIR-EBD-01',
    locationName: 'Ebebda Piles du Pont RN4',
    distanceKm: 71.5,
    coverageRadiusKm: 4.0,
    acousticPowerDb: 130,
    status: 'ONLINE',
    transmissionMedia: 'VHF_RADIO',
    batteryAutonomyHours: 80,
    lastTestTimestamp: '2026-09-08 09:00 UTC',
  },
];

// ============================================================================
// 4. EVACUATION CORRIDORS (PPI / PLAN ORSEC HYDROLOGIQUE)
// ============================================================================

export const EVACUATION_CORRIDORS_DATA: PpiEvacuationCorridor[] = [
  {
    corridorId: 'EVAC-BTC-01',
    nameFr: 'Corridor Nord Batchenga vers Coteau Colline Mbam (Cote 465 m)',
    nameEn: 'Batchenga North Corridor to Mbam Hill (Elevation 465 m)',
    fromZone: 'Batchenga Ferry',
    safeHavenAltitudeM: 465,
    capacityPersons: 2500,
    travelTimeMinutes: 12,
    status: 'CLEAR',
  },
  {
    corridorId: 'EVAC-OBL-01',
    nameFr: 'Axe Obala Est vers Plateforme Lycée Bilingue (Cote 490 m)',
    nameEn: 'Obala East Axis to Bilingual High School High Ground (490 m)',
    fromZone: 'Obala Bas-fonds',
    safeHavenAltitudeM: 490,
    capacityPersons: 4800,
    travelTimeMinutes: 18,
    status: 'CLEAR',
  },
  {
    corridorId: 'EVAC-MNT-01',
    nameFr: 'Piste Rurale Sud vers Plateau Préfecture Monatélé (Cote 510 m)',
    nameEn: 'South Rural Track to Monatélé Prefecture Plateau (510 m)',
    fromZone: 'Monatélé Plaines',
    safeHavenAltitudeM: 510,
    capacityPersons: 7500,
    travelTimeMinutes: 25,
    status: 'CLEAR',
  },
  {
    corridorId: 'EVAC-EBD-01',
    nameFr: 'Corridor Route RN4 vers Hauteurs Échangeur Bafia (Cote 440 m)',
    nameEn: 'RN4 Highway Corridor to Bafia Interchange Ridge (440 m)',
    fromZone: 'Ebebda Pont',
    safeHavenAltitudeM: 440,
    capacityPersons: 5200,
    travelTimeMinutes: 20,
    status: 'CLEAR',
  },
];

// ============================================================================
// 5. HYDRAULIC BREACH CALCULATION ENGINE (FROEHLICH / ICOLD BULLETIN 111)
// ============================================================================

export function calculateBreachHydraulics(
  mechanism: BreachMechanism,
  reservoirVolumeMm3: number,
  damHeightMeters: number,
  overtoppingHeightMeters: number
): {
  breachWidthM: number;
  formationTimeMin: number;
  peakDischargeM3s: number;
  totalOutflowHydrograph: Array<{ timeMin: number; dischargeM3s: number }>;
} {
  const g = 9.81;
  const Vw = reservoirVolumeMm3 * 1e6; // in m3
  const hw = damHeightMeters + (mechanism === 'overtopping' ? overtoppingHeightMeters : 0);

  // Froehlich (2008) formulation:
  // B_ave = 0.27 * Ko * (Vw)^0.32 * hw^0.04
  // Ko = 1.3 for overtopping, 1.0 for piping / others
  const Ko = mechanism === 'overtopping' ? 1.3 : 1.0;
  const breachWidthM = Number((0.27 * Ko * Math.pow(Vw, 0.32) * Math.pow(hw, 0.04)).toFixed(1));

  // Formation time tf (minutes) = 63.2 * sqrt(Vw / (g * hw^2)) / 60
  let tfSec = 63.2 * Math.sqrt(Vw / (g * Math.pow(hw, 2)));
  if (mechanism === 'piping') tfSec *= 1.3; // Piping often takes slightly longer until roof collapse
  const formationTimeMin = Math.max(15, Number((tfSec / 60).toFixed(0)));

  // Peak discharge Qp using Froehlich (1995b) regression:
  // Qp = 0.607 * Vw^0.295 * hw^1.24
  let peakDischargeM3s = Number((0.607 * Math.pow(Vw, 0.295) * Math.pow(hw, 1.24)).toFixed(0));

  // Sanity check: Weir flow upper bound Q <= 1.7 * B_ave * hw^1.5
  const maxWeirFlow = 1.7 * breachWidthM * Math.pow(hw, 1.5);
  if (peakDischargeM3s > maxWeirFlow) {
    peakDischargeM3s = Number(maxWeirFlow.toFixed(0));
  }

  // Hydrograph construction (triangular / dimensionless ICOLD hydrograph)
  const hydrographPoints: Array<{ timeMin: number; dischargeM3s: number }> = [];
  const totalDurationMin = formationTimeMin * 4;

  for (let t = 0; t <= totalDurationMin; t += Math.max(2, Math.floor(totalDurationMin / 24))) {
    let q = 0;
    if (t <= formationTimeMin) {
      // Rising limb (power of 2)
      q = peakDischargeM3s * Math.pow(t / formationTimeMin, 1.8);
    } else {
      // Recession limb (exponential reservoir depletion)
      const tDecay = (t - formationTimeMin) / (formationTimeMin * 1.8);
      q = peakDischargeM3s * Math.exp(-tDecay);
    }
    hydrographPoints.push({
      timeMin: t,
      dischargeM3s: Number(q.toFixed(0)),
    });
  }

  return {
    breachWidthM,
    formationTimeMin,
    peakDischargeM3s,
    totalOutflowHydrograph: hydrographPoints,
  };
}
