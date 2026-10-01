// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 19 TYPES
// STEP 19: Dam Break Hydrodynamic Wave 2D (Saint-Venant), Inundation Mapping,
// Emergency Action Plan (PPI / ORSEC) & Early Warning Sirens
// ============================================================================

export type BreachMechanism =
  | 'overtopping' // Rupture par surverse (crue millénale extrême / blocage vannes)
  | 'piping'      // Rupture par renard hydraulique / érosion interne régressive
  | 'seismic_toe';// Glissement de fondation / rupture sismique majeure

export interface BreachParameters {
  mechanism: BreachMechanism;
  reservoirVolumeMm3: number; // Volume retenu au moment de la rupture (e.g. 65 Mm3)
  damHeightMeters: number;    // Hauteur de barrage (e.g. 14 m)
  waterLevelAboveCrestMeters: number; // Surverse éventuelle au-dessus de la crête (m)
  breachWidthAverageMeters: number;   // Largeur moyenne de brèche (m)
  sideSlopeRatioZ: number;           // Pente des berges de brèche (H:V)
  formationTimeMinutes: number;      // Temps de formation de la brèche tf (min)
  peakDischargeQpM3s: number;        // Débit de pointe maximal (m3/s)
}

export interface DownstreamSettlement {
  id: string;
  nameFr: string;
  nameEn: string;
  distanceKm: number;              // Distance depuis le barrage (km)
  waveArrivalTimeMinutes: number;  // Temps d'arrivée du front d'onde (min)
  peakArrivalTimeMinutes: number;  // Temps du pic d'inondation (min)
  maxInundationDepthMeters: number;// Hauteur d'eau maximale h_max (m)
  maxFlowVelocityMs: number;       // Vitesse maximale de courant v_max (m/s)
  lethalHazardProduct: number;     // h * v (m2/s) - Seuil de danger létal (> 1.5 m2/s)
  hazardClassification: 'EXTREME' | 'HIGH' | 'MEDIUM' | 'LOW';
  populationAtRisk: number;        // Population exposée (PAR)
  evacuationSafeZonesCount: number;// Nombre de refuges identifiés
  sirensActiveCount: number;       // Sirènes d'alerte télécommandées
}

export interface EmergencySirenStation {
  id: string;
  code: string;
  locationName: string;
  distanceKm: number;
  coverageRadiusKm: number;
  acousticPowerDb: number; // e.g. 130 dB at 30m
  status: 'ONLINE' | 'ACTIVE_ALERT' | 'TEST_MODE' | 'OFFLINE';
  transmissionMedia: 'SATELLITE_IRIDIUM' | 'VHF_RADIO' | 'CELLULAR_4G';
  batteryAutonomyHours: number;
  lastTestTimestamp: string;
}

export interface PpiEvacuationCorridor {
  corridorId: string;
  nameFr: string;
  nameEn: string;
  fromZone: string;
  safeHavenAltitudeM: number;
  capacityPersons: number;
  travelTimeMinutes: number;
  status: 'CLEAR' | 'CONGESTED' | 'RESTRICTED';
}
