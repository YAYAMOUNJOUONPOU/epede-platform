// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 24 TYPES
// STEP 24: ESG, Ecological Flow (e-Flow / Débit Réservé), Aquatic Biodiversity,
// Fish Migration Passages, Reservoir GHG Emissions (G-res Tool) & IFC Standards
// ============================================================================

export type IfcPerformanceStandardId =
  | 'IFC_PS1_ASSESSMENT_MANAGEMENT'
  | 'IFC_PS2_LABOR_CONDITIONS'
  | 'IFC_PS3_RESOURCE_EFFICIENCY_POLLUTION'
  | 'IFC_PS4_COMMUNITY_HEALTH_SAFETY'
  | 'IFC_PS5_LAND_RESETTLEMENT'
  | 'IFC_PS6_BIODIVERSITY_CONSERVATION'
  | 'IFC_PS8_CULTURAL_HERITAGE';

export interface IfcComplianceItem {
  id: IfcPerformanceStandardId;
  standardNumber: string;
  nameFr: string;
  nameEn: string;
  scorePercent: number; // 0 - 100%
  status: 'COMPLIANT_GOLD' | 'COMPLIANT_CERTIFIED' | 'MONITORING_ACTION';
  keyActionsFr: string[];
  keyActionsEn: string[];
  auditDate: string;
}

export interface EflowSectionPoint {
  month: string;
  sanagaInflowM3s: number;
  plantTurbinedDischargeM3s: number;
  reservedEcoFlowM3s: number; // Débit réservé biologique dans le tronçon court-circuité (TCC)
  complianceMinimumM3s: number; // Seuil légal strict (e.g. 100 m3/s)
  dissolvedOxygenMgL: number; // Exigence DO > 6.0 mg/L
  riverbedWettedPerimeterM: number;
}

export interface FishPassMonitoring {
  speciesCode: string;
  commonNameFr: string;
  commonNameEn: string;
  scientificName: string;
  iucnStatus: 'CRITICAL_ENDANGERED' | 'ENDANGERED' | 'VULNERABLE' | 'LEAST_CONCERN';
  isSanagaEndemic: boolean;
  biomassIndex: number; // 0 - 100
  annualCountFishway: number; // Nombre d'individus recensés par vidéo-comptage
  migrationSeasonPeak: string;
  passageEfficiencyPercent: number;
  acousticTagTrackingActive: boolean;
}

export interface GhgEmissionsProfile {
  grossReservoirAreaKm2: number; // 14 km2 pour Nachtigal (faible retenue au fil de l'eau)
  meanWaterDepthM: number;
  waterResidenceTimeDays: number; // ~1.5 jours (extrêmement court, limite l'anoxie)
  reservoirDiffusionCo2GPerM2Day: number;
  reservoirEbullitionCh4MgPerM2Day: number;
  degassingDownstreamCo2GPerKwh: number;
  lifecycleEmissionFactorGCoe2PerKwh: number; // ~12 gCO2eq/kWh (vs ~650 gCO2eq/kWh pour gaz/fioul)
  avoidedAnnualCo2Tonnes: number; // ~730,000 tonnes/an
  carbonPaybackPeriodMonths: number; // ~4.8 mois
}

export interface WaterQualityStation {
  id: string;
  locationName: string;
  chainageKm: number; // Relatif au barrage de Nachtigal
  dissolvedOxygenMgL: number;
  temperatureC: number;
  pH: number;
  turbidityNtu: number;
  conductivityUsCm: number;
  bod5MgL: number;
  algalBloomIndex: 'LOW' | 'MODERATE' | 'NEGLIGIBLE';
}
