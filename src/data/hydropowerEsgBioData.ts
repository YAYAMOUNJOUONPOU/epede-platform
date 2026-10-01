// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 24 DATA ENGINE
// Environmental & Social Impact Assessment (ESIA), Ecological Flow (e-Flow),
// Endemic Fish Species Passages, Water Quality Network & GHG Footprint (G-res)
// ============================================================================

import type {
  IfcComplianceItem,
  EflowSectionPoint,
  FishPassMonitoring,
  GhgEmissionsProfile,
  WaterQualityStation,
} from '../types/hydropowerEsgBio';

export const IFC_PERFORMANCE_STANDARDS: IfcComplianceItem[] = [
  {
    id: 'IFC_PS1_ASSESSMENT_MANAGEMENT',
    standardNumber: 'PS 1',
    nameFr: 'Évaluation et Gestion des Risques Environnementaux et Sociaux',
    nameEn: 'Assessment and Management of Environmental and Social Risks',
    scorePercent: 98.4,
    status: 'COMPLIANT_GOLD',
    keyActionsFr: [
      'Système de Gestion Environnementale et Sociale (PGES-Chantier & Exploitation) audité ISO 14001',
      'Comité de liaison communautaire permanent avec 38 villages riverains du Mbam et de la Sanaga',
      'Mécanisme de gestion des griefs (MGG) avec traçabilité numérique et délai de résolution sous 14 jours'
    ],
    keyActionsEn: [
      'Environmental and Social Management System (ESMS) audited under ISO 14001',
      'Permanent Community Liaison Committee covering 38 riverine villages along Mbam and Sanaga',
      'Digital Grievance Redress Mechanism (GRM) with average 14-day resolution workflow'
    ],
    auditDate: '2026-Q1',
  },
  {
    id: 'IFC_PS2_LABOR_CONDITIONS',
    standardNumber: 'PS 2',
    nameFr: 'Main-d’œuvre et Conditions de Travail',
    nameEn: 'Labor and Working Conditions',
    scorePercent: 96.8,
    status: 'COMPLIANT_GOLD',
    keyActionsFr: [
      'Plus de 3 500 emplois directs générés avec priorité au recrutement local (zone Haute-Sanaga > 65%)',
      'Charte stricte de santé-sécurité (Zéro Accident Mortel) et politique de tolérance zéro VBG/EAS',
      'Accords collectifs d’entreprise et hébergement en cité-vie aux normes internationales OIT/SFI'
    ],
    keyActionsEn: [
      'Over 3,500 direct jobs with priority local hiring in Haute-Sanaga (> 65% regional quota)',
      'Strict HSE Zero Fatality Charter and zero-tolerance Gender-Based Violence / SEA policy',
      'Collective bargaining agreements and accommodation living camps meeting ILO/IFC standards'
    ],
    auditDate: '2025-Q4',
  },
  {
    id: 'IFC_PS3_RESOURCE_EFFICIENCY_POLLUTION',
    standardNumber: 'PS 3',
    nameFr: 'Utilisation Rationnelle des Ressources et Prévention de la Pollution',
    nameEn: 'Resource Efficiency and Pollution Prevention',
    scorePercent: 97.2,
    status: 'COMPLIANT_GOLD',
    keyActionsFr: [
      'Gestion des hydrocarbures et huiles de transformateurs avec bacs de rétention 110% et séparateurs déshuileurs',
      'Huiles biodégradables non toxiques (esters synthétiques) utilisées pour les servomoteurs de vannage vanne de pied',
      'Suivi en continu de la turbidité pour éviter les déversements de laitance de béton et de fines sédimentaires'
    ],
    keyActionsEn: [
      'Oil containment bunds at 110% capacity with coalescence separators for all 225 kV transformers',
      'Non-toxic readily biodegradable synthetic ester lubricants used for wicket gate servomotors',
      'Continuous turbidity sensors preventing cement slurry and fine sediment discharges into river'
    ],
    auditDate: '2026-Q1',
  },
  {
    id: 'IFC_PS4_COMMUNITY_HEALTH_SAFETY',
    standardNumber: 'PS 4',
    nameFr: 'Santé, Sécurité et Sûreté des Communautés',
    nameEn: 'Community Health, Safety, and Security',
    scorePercent: 95.5,
    status: 'COMPLIANT_CERTIFIED',
    keyActionsFr: [
      'Plan Particulier d’Intervention (PPI) et réseau de 14 sirènes d’alerte crues audibles à 3 km en aval',
      'Programmes d’assainissement, forages d’eau potable et campagnes de prévention paludisme / VIH',
      'Balisage fluvial des zones dangereuses (amont prise d’eau, canal d’amenée, bief aval de fuite)'
    ],
    keyActionsEn: [
      'Emergency Preparedness Plan (PPI) featuring 14 flood warning sirens audible over 3 km downstream',
      'Community sanitation infrastructure, drinking water boreholes, and malaria/HIV health programs',
      'River navigation buoys marking exclusion safety perimeters at intake, headrace, and tailrace'
    ],
    auditDate: '2025-Q3',
  },
  {
    id: 'IFC_PS5_LAND_RESETTLEMENT',
    standardNumber: 'PS 5',
    nameFr: 'Acquisition de Terres et Réinstallation Involontaire (PAR)',
    nameEn: 'Land Acquisition and Involuntary Resettlement (RAP)',
    scorePercent: 94.0,
    status: 'COMPLIANT_CERTIFIED',
    keyActionsFr: [
      'Plan d’Action de Réinstallation (PAR) : 100% des ménages relogés dans des habitations viabilisées en dur',
      'Plan de Restauration des Moyens de Subsistance (PRMS) : appui agricole (manioc, cacao, pisciculture)',
      'Indemnisations conformes aux standards de coût de remplacement intégral certifiés par la Banque Mondiale'
    ],
    keyActionsEn: [
      'Resettlement Action Plan (RAP): 100% of physically displaced households resettled in masonry housing',
      'Livelihood Restoration Plan (LRP): agronomy support for cocoa, cassava cultivation, and aquaculture',
      'Full replacement cost compensation verified and audited by the World Bank / IFC panels'
    ],
    auditDate: '2025-Q2',
  },
  {
    id: 'IFC_PS6_BIODIVERSITY_CONSERVATION',
    standardNumber: 'PS 6',
    nameFr: 'Conservation de la Biodiversité et Gestion des Ressources Naturelles',
    nameEn: 'Biodiversity Conservation and Sustainable Management',
    scorePercent: 96.0,
    status: 'COMPLIANT_GOLD',
    keyActionsFr: [
      'Garantie d’un débit réservé biologique strict Qmin = 100 m³/s dans le tronçon court-circuité de la Sanaga',
      'Création et cogestion du Parc National du Mpem et Djim pour compenser la perte d’habitats riverains (Net Positive Gain)',
      'Protection de l’espèce végétale endémique rhéophile Ledermanniella sanagaensis sur les chutes rocheuses'
    ],
    keyActionsEn: [
      'Enforced minimum environmental flow (e-Flow) Qmin = 100 m³/s released into bypassed riverbed section',
      'Creation and funding of Mpem & Djim National Park biodiversity offset to achieve Net Positive Gain',
      'Targeted conservation of rheophilic endemic cascade plant Ledermanniella sanagaensis on rapids'
    ],
    auditDate: '2026-Q1',
  },
  {
    id: 'IFC_PS8_CULTURAL_HERITAGE',
    standardNumber: 'PS 8',
    nameFr: 'Patrimoine Culturel et Lieux Sacrés',
    nameEn: 'Cultural Heritage and Sacred Sites',
    scorePercent: 99.0,
    status: 'COMPLIANT_GOLD',
    keyActionsFr: [
      'Procédure de découverte fortuite (Chance Finds Procedure) appliquée rigoureusement avec les archéologues',
      'Préservation et délocalisation consensuelle des sites sacrés aquatiques (génie du fleuve Sanaga / rites Mvele)',
      'Création d’un musée local de transmission mémorielle et d’archéologie pré-coloniale de la Haute-Sanaga'
    ],
    keyActionsEn: [
      'Chance Finds Procedure enforced with national archeological heritage specialists during excavation',
      'Preservation and consensual customary relocation of river water shrines and sacred rapids rituals',
      'Establishment of Haute-Sanaga local cultural center documenting regional oral history and archeology'
    ],
    auditDate: '2025-Q1',
  },
];

export const EFLOW_ANNUAL_HYDROGRAPH: EflowSectionPoint[] = [
  {
    month: 'Jan',
    sanagaInflowM3s: 480,
    plantTurbinedDischargeM3s: 380,
    reservedEcoFlowM3s: 100,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.4,
    riverbedWettedPerimeterM: 265,
  },
  {
    month: 'Fév',
    sanagaInflowM3s: 390,
    plantTurbinedDischargeM3s: 290,
    reservedEcoFlowM3s: 100,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.2,
    riverbedWettedPerimeterM: 258,
  },
  {
    month: 'Mar',
    sanagaInflowM3s: 450,
    plantTurbinedDischargeM3s: 350,
    reservedEcoFlowM3s: 100,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.3,
    riverbedWettedPerimeterM: 262,
  },
  {
    month: 'Avr',
    sanagaInflowM3s: 620,
    plantTurbinedDischargeM3s: 510,
    reservedEcoFlowM3s: 110,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.5,
    riverbedWettedPerimeterM: 285,
  },
  {
    month: 'Mai',
    sanagaInflowM3s: 890,
    plantTurbinedDischargeM3s: 750,
    reservedEcoFlowM3s: 140,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.6,
    riverbedWettedPerimeterM: 310,
  },
  {
    month: 'Juin',
    sanagaInflowM3s: 980,
    plantTurbinedDischargeM3s: 840,
    reservedEcoFlowM3s: 140,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.8,
    riverbedWettedPerimeterM: 325,
  },
  {
    month: 'Juil',
    sanagaInflowM3s: 1150,
    plantTurbinedDischargeM3s: 980,
    reservedEcoFlowM3s: 170,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.9,
    riverbedWettedPerimeterM: 345,
  },
  {
    month: 'Août',
    sanagaInflowM3s: 1420,
    plantTurbinedDischargeM3s: 980,
    reservedEcoFlowM3s: 440,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 8.1,
    riverbedWettedPerimeterM: 395,
  },
  {
    month: 'Sept',
    sanagaInflowM3s: 2150,
    plantTurbinedDischargeM3s: 980,
    reservedEcoFlowM3s: 1170,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 8.0,
    riverbedWettedPerimeterM: 460,
  },
  {
    month: 'Oct',
    sanagaInflowM3s: 2850,
    plantTurbinedDischargeM3s: 980,
    reservedEcoFlowM3s: 1870,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.9,
    riverbedWettedPerimeterM: 520,
  },
  {
    month: 'Nov',
    sanagaInflowM3s: 1680,
    plantTurbinedDischargeM3s: 980,
    reservedEcoFlowM3s: 700,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.7,
    riverbedWettedPerimeterM: 410,
  },
  {
    month: 'Déc',
    sanagaInflowM3s: 720,
    plantTurbinedDischargeM3s: 620,
    reservedEcoFlowM3s: 100,
    complianceMinimumM3s: 100,
    dissolvedOxygenMgL: 7.5,
    riverbedWettedPerimeterM: 275,
  },
];

export const SANAGA_FISH_BIODIVERSITY: FishPassMonitoring[] = [
  {
    speciesCode: 'LAB_SAN',
    commonNameFr: 'Carpe du Sanaga (Labeo)',
    commonNameEn: 'Sanaga Labeo Carp',
    scientificName: 'Labeo sanagaensis',
    iucnStatus: 'ENDANGERED',
    isSanagaEndemic: true,
    biomassIndex: 88,
    annualCountFishway: 18450,
    migrationSeasonPeak: 'Sept - Nov (Montaison de crue)',
    passageEfficiencyPercent: 91.5,
    acousticTagTrackingActive: true,
  },
  {
    speciesCode: 'CHI_SAN',
    commonNameFr: 'Poisson-chat rhéophile du Sanaga',
    commonNameEn: 'Sanaga Suckermouth Catfish',
    scientificName: 'Chiloglanis sanagaensis',
    iucnStatus: 'VULNERABLE',
    isSanagaEndemic: true,
    biomassIndex: 76,
    annualCountFishway: 42300,
    migrationSeasonPeak: 'Oct - Déc (Post-crue)',
    passageEfficiencyPercent: 86.4,
    acousticTagTrackingActive: true,
  },
  {
    speciesCode: 'DOU_TYP',
    commonNameFr: 'Poisson-ventouse de roche',
    commonNameEn: 'Torrent Loach-Catfish',
    scientificName: 'Doumea typica',
    iucnStatus: 'LEAST_CONCERN',
    isSanagaEndemic: false,
    biomassIndex: 92,
    annualCountFishway: 65100,
    migrationSeasonPeak: 'Août - Oct (Eaux vives rapides)',
    passageEfficiencyPercent: 94.2,
    acousticTagTrackingActive: false,
  },
  {
    speciesCode: 'CHR_NIL',
    commonNameFr: 'Capitaine / Tilapia du Nil',
    commonNameEn: 'Nile Tilapia',
    scientificName: 'Oreochromis niloticus',
    iucnStatus: 'LEAST_CONCERN',
    isSanagaEndemic: false,
    biomassIndex: 95,
    annualCountFishway: 112000,
    migrationSeasonPeak: 'Toute l’année (Bief de retenue)',
    passageEfficiencyPercent: 97.0,
    acousticTagTrackingActive: false,
  },
  {
    speciesCode: 'MOR_SAN',
    commonNameFr: 'Mormyre rhéophile / Poisson-éléphant',
    commonNameEn: 'Sanaga Elephantfish',
    scientificName: 'Mormyrus sanagaensis',
    iucnStatus: 'VULNERABLE',
    isSanagaEndemic: true,
    biomassIndex: 68,
    annualCountFishway: 9800,
    migrationSeasonPeak: 'Nov - Jan (Nocturne)',
    passageEfficiencyPercent: 82.0,
    acousticTagTrackingActive: true,
  },
];

export const NACHTIGAL_GHG_PROFILE: GhgEmissionsProfile = {
  grossReservoirAreaKm2: 14.2, // Retenue très compacte au fil de l'eau (Run-of-River)
  meanWaterDepthM: 7.8,
  waterResidenceTimeDays: 1.45, // Temps de séjour de seulement 35 heures !
  reservoirDiffusionCo2GPerM2Day: 1.85,
  reservoirEbullitionCh4MgPerM2Day: 8.4,
  degassingDownstreamCo2GPerKwh: 1.2,
  lifecycleEmissionFactorGCoe2PerKwh: 11.8, // 11.8 gCO2eq/kWh (Extrêmement bas ! Éolien ~11, Solaire ~40, Charbon ~1000)
  avoidedAnnualCo2Tonnes: 730000, // Remplace le thermique fossile (fuel lourd/gaz) au Cameroun
  carbonPaybackPeriodMonths: 4.6, // Amortissement carbone de la construction en moins de 5 mois
};

export const WATER_QUALITY_STATIONS: WaterQualityStation[] = [
  {
    id: 'WQ_STATION_AMONT',
    locationName: 'Station 1 : Amont Retenue (Pk 0.0 - Entrée réservoir)',
    chainageKm: 0.0,
    dissolvedOxygenMgL: 7.8,
    temperatureC: 26.2,
    pH: 7.25,
    turbidityNtu: 18.4,
    conductivityUsCm: 42.0,
    bod5MgL: 1.6,
    algalBloomIndex: 'NEGLIGIBLE',
  },
  {
    id: 'WQ_STATION_TCC_DEBIT',
    locationName: 'Station 2 : Tronçon Court-Circuité (TCC - Restitution Qmin 100 m³/s)',
    chainageKm: 2.8,
    dissolvedOxygenMgL: 8.3, // Réaération naturelle sur les cascades rocheuses
    temperatureC: 26.4,
    pH: 7.35,
    turbidityNtu: 16.2,
    conductivityUsCm: 43.1,
    bod5MgL: 1.4,
    algalBloomIndex: 'NEGLIGIBLE',
  },
  {
    id: 'WQ_STATION_CANAL',
    locationName: 'Station 3 : Canal d’amenée revêtu (Pk 4.5)',
    chainageKm: 4.5,
    dissolvedOxygenMgL: 7.6,
    temperatureC: 26.3,
    pH: 7.28,
    turbidityNtu: 14.8,
    conductivityUsCm: 42.5,
    bod5MgL: 1.5,
    algalBloomIndex: 'NEGLIGIBLE',
  },
  {
    id: 'WQ_STATION_FUITE_USINE',
    locationName: 'Station 4 : Canal de Fuite Usine (Post-turbinage 7 Francis)',
    chainageKm: 7.2,
    dissolvedOxygenMgL: 7.9, // Aération renforcée par clapet renifleur d'aspirateur
    temperatureC: 26.1,
    pH: 7.30,
    turbidityNtu: 15.0,
    conductivityUsCm: 42.8,
    bod5MgL: 1.5,
    algalBloomIndex: 'NEGLIGIBLE',
  },
  {
    id: 'WQ_STATION_CONFLUENCE',
    locationName: 'Station 5 : Confluence Aval Sanaga (Mélange TCC + Débit Turbiné)',
    chainageKm: 9.8,
    dissolvedOxygenMgL: 8.1,
    temperatureC: 26.2,
    pH: 7.32,
    turbidityNtu: 16.5,
    conductivityUsCm: 43.0,
    bod5MgL: 1.4,
    algalBloomIndex: 'NEGLIGIBLE',
  },
];
