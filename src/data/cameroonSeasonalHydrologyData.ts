// src/data/cameroonSeasonalHydrologyData.ts
// EPEDE Authoritative Reference Dataset: Seasonal Generation, Hydrological Variations & Power Supply Reliability in Cameroon
// Strictly distinguishes verified public hydrological/operational bounds from clearly labeled illustrative seasonal profiles.

export type DataProvenanceTier =
  | 'VERIFIED_PUBLIC_RECORD'
  | 'DOCUMENTED_OPERATIONAL_RANGE'
  | 'ILLUSTRATIVE_ENGINEERING_MODEL';

export interface HydrologicalBasinZone {
  id: string;
  nameFr: string;
  nameEn: string;
  climateTypeFr: string;
  climateTypeEn: string;
  regionsCovered: string[];
  annualRainfallMm: string;
  rainySeasonMonthsFr: string;
  rainySeasonMonthsEn: string;
  drySeasonMonthsFr: string;
  drySeasonMonthsEn: string;
  keyRivers: string[];
  associatedHydroPlants: string[];
  regulatingReservoirs: string[];
  catchmentMisconceptionNoteFr: string;
  catchmentMisconceptionNoteEn: string;
}

export interface MonthlyPlantProfilePoint {
  monthIndex: number; // 1 = Jan .. 12 = Dec
  monthShortFr: string;
  monthShortEn: string;
  naturalInflowM3s: number;
  regulatedOrTurbinedFlowM3s: number;
  netHeadMeters: number;
  availableCapacityMw: number;
  illustrativeAvgOutputMw: number;
  illustrativeEnergyGwh: number;
  seasonState: 'HIGH_WATER' | 'TRANSITION' | 'LOW_WATER';
}

export interface HydroPlantSeasonalProfile {
  plantId: string;
  code: string;
  nameFr: string;
  nameEn: string;
  gridSystem: 'RIS' | 'RIN' | 'ISOLATED';
  riverBasin: string;
  installedCapacityMw: number;
  unitsConfiguration: string;
  turbineType: string;
  nominalHeadMeters: number;
  designDischargeM3s: number;
  regulationTypeFr: string;
  regulationTypeEn: string;
  reservoirStorageCapacity: string;
  commissioningYear: string;
  wetSeasonBehaviourFr: string;
  wetSeasonBehaviourEn: string;
  drySeasonBehaviourFr: string;
  drySeasonBehaviourEn: string;
  dataAvailabilityNoticeFr: string;
  dataAvailabilityNoticeEn: string;
  provenanceTier: DataProvenanceTier;
  sourceCitation: string;
  monthlyProfile: MonthlyPlantProfilePoint[];
}

export interface NationalMonthlyGridCalendarEntry {
  monthIndex: number;
  monthNameFr: string;
  monthNameEn: string;
  seasonCategory: 'LOW_WATER' | 'TRANSITION' | 'HIGH_WATER';
  sanagaHydrologyFr: string;
  sanagaHydrologyEn: string;
  benueHydrologyFr: string;
  benueHydrologyEn: string;
  ntemHydrologyFr: string;
  ntemHydrologyEn: string;
  sanagaNaturalFlowM3s: number;
  sanagaRegulatedFlowM3s: number;
  lomPangarFillPercent: number;
  lagdoFillPercent: number;
  hydroAvailableMw: number;
  thermalAvailableMw: number;
  solarDaytimeMw: number;
  totalEveningAvailableMw: number;
  eveningPeakDemandMw: number;
  operationalRiskFr: string;
  operationalRiskEn: string;
}

export interface HourlyDemandPoint {
  hour: string;
  residentialMw: number;
  industrialMw: number;
  commercialPublicMw: number;
  totalDemandMw: number;
  solarContributionMw: number;
  periodLabelFr: string;
  periodLabelEn: string;
}

export interface SeasonalCaseStudy {
  id: string;
  number: number;
  titleFr: string;
  titleEn: string;
  category:
    | 'LOW_WATER'
    | 'HIGH_WATER_SPILL'
    | 'EVENING_PEAK'
    | 'UNIT_OUTAGE'
    | 'TRANSMISSION_CONSTRAINT'
    | 'PROLONGED_DROUGHT';
  isHypotheticalCalculation: boolean;
  cameroonContextFr: string;
  cameroonContextEn: string;
  engineeringParameters: { label: string; value: string }[];
  causalChainFr: string[];
  causalChainEn: string[];
  technicalConclusionFr: string;
  technicalConclusionEn: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CAMEROON CLIMATIC & HYDROLOGICAL BASINS (SECTION 2)
// ─────────────────────────────────────────────────────────────────────────────
export const CAMEROON_HYDROLOGICAL_BASINS: HydrologicalBasinZone[] = [
  {
    id: 'basin-sanaga-upper',
    nameFr: '1. Haut-Bassin de la Sanaga & Château d’Eau de l’Adamaoua (Djérem & Lom)',
    nameEn: '1. Upper Sanaga Basin & Adamawa Water Tower (Djérem & Lom Rivers)',
    climateTypeFr: 'Tropical d’altitude unimodal (1 saison des pluies / 1 longue saison sèche)',
    climateTypeEn: 'Unimodal Tropical Highland (1 rainy season / 1 long dry season)',
    regionsCovered: ['Adamaoua', 'Est (Nord-Ouest)', 'Centre (Haute-Sanaga)'],
    annualRainfallMm: '1 400 – 1 700 mm/an',
    rainySeasonMonthsFr: 'Mai à Octobre (Pic en Août–Octobre)',
    rainySeasonMonthsEn: 'May to October (Peak in August–October)',
    drySeasonMonthsFr: 'Novembre à Avril (Étiage marqué en Février–Mars)',
    drySeasonMonthsEn: 'November to April (Lowest natural flow in February–March)',
    keyRivers: ['Fleuve Djérem', 'Rivière Lom', 'Moyenne Sanaga'],
    associatedHydroPlants: ['Nachtigal (420 MW)', 'Lom Pangar Usine de Pied (30 MW)', 'Mbakaou (1,4 MW)'],
    regulatingReservoirs: ['Lom Pangar (6,0 milliards m³)', 'Mbakaou (2,6 milliards m³)'],
    catchmentMisconceptionNoteFr:
      'Une pluie torrentielle à Douala ou Yaoundé n’alimente PAS Nachtigal : l’eau turbinée à Nachtigal provient exclusivement des pluies tombées sur le plateau de l’Adamaoua et l’Est (bassins du Djérem et du Lom) régulées par Mbakaou et Lom Pangar.',
    catchmentMisconceptionNoteEn:
      'Heavy rainfall in Douala or Yaoundé does NOT feed Nachtigal: the water turbined at Nachtigal originates in the Adamawa plateau and East Region (Djérem and Lom catchments) regulated by Mbakaou and Lom Pangar.',
  },
  {
    id: 'basin-sanaga-mbam',
    nameFr: '2. Sous-Bassin de la Mbam, Hauts-Plateaux de l’Ouest & Basse-Sanaga',
    nameEn: '2. Mbam Sub-Basin, Western Highlands & Lower Sanaga Cascade',
    climateTypeFr: 'Tropical humide de montagne & transition équatoriale',
    climateTypeEn: 'Humid Mountain Tropical & Equatorial Transition',
    regionsCovered: ['Ouest', 'Nord-Ouest', 'Centre (Mbam)', 'Littoral (Sanaga-Maritime)'],
    annualRainfallMm: '1 800 – 2 400 mm/an',
    rainySeasonMonthsFr: 'Avril à Octobre (Fort ruissellement orographique)',
    rainySeasonMonthsEn: 'April to October (Strong orographic runoff)',
    drySeasonMonthsFr: 'Novembre à Mars',
    drySeasonMonthsEn: 'November to March',
    keyRivers: ['Rivière Mbam', 'Rivière Noun', 'Rivière Mapé', 'Basse Sanaga'],
    associatedHydroPlants: ['Songloulou (384 MW)', 'Édéa I, II, III (276 MW)'],
    regulatingReservoirs: [
      'Mapé (3,2 milliards m³)',
      'Bamendjin (1,8 milliard m³)',
      '+ Apport amont Lom Pangar (6,0 Gm³) & Mbakaou (2,6 Gm³)',
    ],
    catchmentMisconceptionNoteFr:
      'Fait hydraulique majeur : la rivière Mbam (régulée par Bamendjin et Mapé) conflue avec la Sanaga EN AVAL de Nachtigal mais EN AMONT de Songloulou et Édéa. Songloulou et Édéa bénéficient donc des 4 grands réservoirs (13,6 Gm³ cumulés), tandis que Nachtigal dépend uniquement de la branche Lom/Djérem (8,6 Gm³).',
    catchmentMisconceptionNoteEn:
      'Crucial hydraulic fact: the Mbam River (regulated by Bamendjin and Mapé) joins the Sanaga DOWNSTREAM of Nachtigal but UPSTREAM of Songloulou and Edéa. Thus Songloulou and Edéa benefit from all 4 regulating dams (13.6 Gm³ total), whereas Nachtigal relies on the Lom/Djérem branch (8.6 Gm³).',
  },
  {
    id: 'basin-equatorial-south',
    nameFr: '3. Bassin Équatorial Forestier du Sud (Fleuve Ntem & Bassin du Dja)',
    nameEn: '3. Southern Equatorial Forest Basin (Ntem & Dja River Catchments)',
    climateTypeFr: 'Équatorial guinéen bimodal (4 saisons : 2 saisons des pluies, 2 saisons sèches)',
    climateTypeEn: 'Bimodal Guinean Equatorial (4 seasons: 2 rainy seasons, 2 dry seasons)',
    regionsCovered: ['Sud (Vallée-du-Ntem, Dja-et-Lobo)', 'Sud-Est'],
    annualRainfallMm: '1 600 – 2 000 mm/an',
    rainySeasonMonthsFr: 'Petite pluie : Mars–Juin · Grande pluie : Septembre–Novembre',
    rainySeasonMonthsEn: 'Minor wet season: March–June · Major wet season: September–November',
    drySeasonMonthsFr: 'Grande saison sèche : Décembre–Février · Petite sèche : Juillet–Août',
    drySeasonMonthsEn: 'Major dry season: December–February · Minor dry season: July–August',
    keyRivers: ['Fleuve Ntem (Chutes de Memve’ele)', 'Rivière Dja (Bassin du Congo/Sangha)'],
    associatedHydroPlants: ['Memve’ele (211 MW)', 'Mékin (15 MW)'],
    regulatingReservoirs: ['Aucun grand barrage-réservoir pluriannuel en amont de Memve’ele (Retenue journalière au fil de l’eau)'],
    catchmentMisconceptionNoteFr:
      'Contrairement à la Sanaga régulée par Lom Pangar, le fleuve Ntem à Memve’ele ne possède pas de grand réservoir amont : sa puissance disponible suit directement le régime bimodal équatorial (chute marquée en janvier–février et en juillet–août).',
    catchmentMisconceptionNoteEn:
      'Unlike the regulated Sanaga, the Ntem River at Memve’ele has no large upstream storage reservoir: its available capacity directly mirrors the bimodal equatorial regime (dipping in Jan–Feb and Jul–Aug).',
  },
  {
    id: 'basin-benue-north',
    nameFr: '4. Bassin Soudano-Sahélien du Septentrion (Fleuve Bénoué & Faro)',
    nameEn: '4. Northern Sudano-Sahelian Basin (Benue & Faro Rivers)',
    climateTypeFr: 'Soudano-sahélien sec à saison des pluies courte et forte évaporation',
    climateTypeEn: 'Sudano-Sahelian with short wet season and high evaporation (>2,000 mm/yr)',
    regionsCovered: ['Nord (Bénoué)', 'Extrême-Nord (Diamaré / Mayo-Louti)'],
    annualRainfallMm: '700 – 1 000 mm/an (concentrés sur 3 à 4 mois)',
    rainySeasonMonthsFr: 'Juillet à Septembre (Crues soudaines)',
    rainySeasonMonthsEn: 'July to September (Concentrated flash inflows)',
    drySeasonMonthsFr: 'Octobre à Juin (8 à 9 mois d’étiage sévère ; débit naturel proche de zéro au printemps)',
    drySeasonMonthsEn: 'October to June (8–9 months of dry season; near-zero natural river inflow in spring)',
    keyRivers: ['Fleuve Bénoué', 'Mayo Kebbi', 'Rivière Faro'],
    associatedHydroPlants: ['Lagdo (72 MW — Réseau Interconnecté Nord RIN)'],
    regulatingReservoirs: ['Retenue de Lagdo (7,7 milliards m³ initialement en 1982, réduite par l’envasement et les déficits pluviométriques)'],
    catchmentMisconceptionNoteFr:
      'Sur le RIN, Lagdo dépend d’une fenêtre de recharge de seulement 90 jours (juillet–septembre). Si la mousson sahélienne est déficitaire une année, la retenue ne atteint pas sa cote nominale et la production reste bridée pendant les 9 mois suivants.',
    catchmentMisconceptionNoteEn:
      'On the RIN, Lagdo depends on a narrow 90-day recharge window (July–September). If the Sahelian monsoon underperforms in a given year, the reservoir fails to reach full supply level and generation remains constrained for the next 9 months.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. INDIVIDUAL SEASONAL OPERATING PROFILES FOR CAMEROON HYDRO PLANTS (SECTION 4)
// ─────────────────────────────────────────────────────────────────────────────
export const CAMEROON_HYDRO_SEASONAL_PROFILES: HydroPlantSeasonalProfile[] = [
  {
    plantId: 'plant-nachtigal',
    code: 'NHPC-420',
    nameFr: 'Aménagement Hydroélectrique de Nachtigal Amont (420 MW)',
    nameEn: 'Nachtigal Upstream Hydroelectric Power Plant (420 MW)',
    gridSystem: 'RIS',
    riverBasin: 'Fleuve Sanaga (Moyenne-Sanaga, en amont de la confluence avec le Mbam)',
    installedCapacityMw: 420,
    unitsConfiguration: '7 × 60 MW (Groupes G1 à G7)',
    turbineType: 'Turbines Francis à axe vertical',
    nominalHeadMeters: 51.5,
    designDischargeM3s: 980,
    regulationTypeFr: 'Fil de l’eau régularisé en amont par les barrages de Lom Pangar (6,0 Gm³) et Mbakaou (2,6 Gm³)',
    regulationTypeEn: 'Run-of-river regulated upstream by Lom Pangar (6.0 Gm³) and Mbakaou (2.6 Gm³) reservoirs',
    reservoirStorageCapacity: 'Retenue de prise journalière (~2,8 km² ; canal d’amenée de 3,3 km)',
    commissioningYear: '2024 – 2025 (Mise en service progressive des 7 groupes)',
    wetSeasonBehaviourFr:
      'De juillet à décembre, le débit naturel de la Moyenne-Sanaga dépasse largement le débit d’équipement de la centrale (980 m³/s, atteignant 2 000 à 3 200 m³/s en octobre). Les 7 groupes Francis de 60 MW disposent d’assez d’eau pour fournir 420 MW en continu (24h/24), tandis que le surplus d’eau est déversé par le barrage en béton compacté au rouleau (BCR).',
    wetSeasonBehaviourEn:
      'From July to December, natural Middle-Sanaga discharge far exceeds the plant’s 980 m³/s design flow (reaching 2,000–3,200 m³/s in October). All 7 × 60 MW Francis units can operate at full 420 MW baseload capacity, while excess river flow passes over the RCC labyrinth spillway.',
    drySeasonBehaviourFr:
      'De janvier à mai, le débit naturel chuterait sous 300 m³/s sans régulation. Grâce aux lâchers conjoints d’EDC depuis Lom Pangar et Mbakaou, le débit régularisé à Nachtigal est soutenu autour de 850–980 m³/s, permettant une puissance disponible élevée (~360 à 410 MW) avec modulation de pointe.',
    drySeasonBehaviourEn:
      'From January to May, natural river flow would fall below 300 m³/s without regulation. Scheduled EDC water releases from Lom Pangar and Mbakaou sustain inflow at 850–980 m³/s, maintaining high dependable capacity (~360–410 MW).',
    dataAvailabilityNoticeFr:
      'Cible énergétique annuelle officielle NHPC : ~2 935 GWh/an (facteur de charge ~80%). Les valeurs mensuelles ci-dessous constituent un profil hydro-énergétique représentatif calé sur l’hydrogramme régulé de la Sanaga à Nachtigal (études NHPC/EDF) et non des relevés de comptage mensuels historiques (mise en service complète récente en 2024–2025).',
    dataAvailabilityNoticeEn:
      'Official NHPC annual energy target: ~2,935 GWh/year (~80% capacity factor). The monthly figures below represent an engineering seasonal profile calibrated to the regulated Sanaga hydrograph at Nachtigal (NHPC/EDF studies) rather than multi-year historical billing records (plant newly commissioned in 2024–2025).',
    provenanceTier: 'DOCUMENTED_OPERATIONAL_RANGE',
    sourceCitation: 'NHPC / EDF / IFC Technical Project Documentation & Sanaga Hydrological Studies',
    monthlyProfile: [
      { monthIndex: 1, monthShortFr: 'Jan', monthShortEn: 'Jan', naturalInflowM3s: 450, regulatedOrTurbinedFlowM3s: 900, netHeadMeters: 51.2, availableCapacityMw: 385, illustrativeAvgOutputMw: 330, illustrativeEnergyGwh: 245, seasonState: 'LOW_WATER' },
      { monthIndex: 2, monthShortFr: 'Fév', monthShortEn: 'Feb', naturalInflowM3s: 310, regulatedOrTurbinedFlowM3s: 860, netHeadMeters: 51.0, availableCapacityMw: 370, illustrativeAvgOutputMw: 315, illustrativeEnergyGwh: 212, seasonState: 'LOW_WATER' },
      { monthIndex: 3, monthShortFr: 'Mar', monthShortEn: 'Mar', naturalInflowM3s: 280, regulatedOrTurbinedFlowM3s: 850, netHeadMeters: 51.0, availableCapacityMw: 365, illustrativeAvgOutputMw: 310, illustrativeEnergyGwh: 230, seasonState: 'LOW_WATER' },
      { monthIndex: 4, monthShortFr: 'Avr', monthShortEn: 'Apr', naturalInflowM3s: 420, regulatedOrTurbinedFlowM3s: 880, netHeadMeters: 51.2, availableCapacityMw: 380, illustrativeAvgOutputMw: 325, illustrativeEnergyGwh: 234, seasonState: 'TRANSITION' },
      { monthIndex: 5, monthShortFr: 'Mai', monthShortEn: 'May', naturalInflowM3s: 680, regulatedOrTurbinedFlowM3s: 940, netHeadMeters: 51.4, availableCapacityMw: 400, illustrativeAvgOutputMw: 340, illustrativeEnergyGwh: 253, seasonState: 'TRANSITION' },
      { monthIndex: 6, monthShortFr: 'Juin', monthShortEn: 'Jun', naturalInflowM3s: 1050, regulatedOrTurbinedFlowM3s: 980, netHeadMeters: 51.5, availableCapacityMw: 420, illustrativeAvgOutputMw: 350, illustrativeEnergyGwh: 252, seasonState: 'HIGH_WATER' },
      { monthIndex: 7, monthShortFr: 'Juil', monthShortEn: 'Jul', naturalInflowM3s: 1550, regulatedOrTurbinedFlowM3s: 980, netHeadMeters: 51.5, availableCapacityMw: 420, illustrativeAvgOutputMw: 355, illustrativeEnergyGwh: 264, seasonState: 'HIGH_WATER' },
      { monthIndex: 8, monthShortFr: 'Août', monthShortEn: 'Aug', naturalInflowM3s: 2100, regulatedOrTurbinedFlowM3s: 980, netHeadMeters: 51.3, availableCapacityMw: 420, illustrativeAvgOutputMw: 355, illustrativeEnergyGwh: 264, seasonState: 'HIGH_WATER' },
      { monthIndex: 9, monthShortFr: 'Sep', monthShortEn: 'Sep', naturalInflowM3s: 2850, regulatedOrTurbinedFlowM3s: 980, netHeadMeters: 50.9, availableCapacityMw: 420, illustrativeAvgOutputMw: 350, illustrativeEnergyGwh: 252, seasonState: 'HIGH_WATER' },
      { monthIndex: 10, monthShortFr: 'Oct', monthShortEn: 'Oct', naturalInflowM3s: 3150, regulatedOrTurbinedFlowM3s: 980, netHeadMeters: 50.8, availableCapacityMw: 420, illustrativeAvgOutputMw: 355, illustrativeEnergyGwh: 264, seasonState: 'HIGH_WATER' },
      { monthIndex: 11, monthShortFr: 'Nov', monthShortEn: 'Nov', naturalInflowM3s: 1750, regulatedOrTurbinedFlowM3s: 980, netHeadMeters: 51.4, availableCapacityMw: 420, illustrativeAvgOutputMw: 350, illustrativeEnergyGwh: 252, seasonState: 'HIGH_WATER' },
      { monthIndex: 12, monthShortFr: 'Déc', monthShortEn: 'Dec', naturalInflowM3s: 780, regulatedOrTurbinedFlowM3s: 930, netHeadMeters: 51.3, availableCapacityMw: 400, illustrativeAvgOutputMw: 335, illustrativeEnergyGwh: 249, seasonState: 'TRANSITION' },
    ],
  },
  {
    plantId: 'plant-songloulou',
    code: 'ENEO-SL-384',
    nameFr: 'Centrale Hydroélectrique de Songloulou (384 MW)',
    nameEn: 'Songloulou Hydroelectric Power Station (384 MW)',
    gridSystem: 'RIS',
    riverBasin: 'Basse-Sanaga (en aval de la confluence Sanaga + Mbam)',
    installedCapacityMw: 384,
    unitsConfiguration: '8 × 48 MW (Tranche 1 : G1–G4 en 1981 · Tranche 2 : G5–G8 en 1988)',
    turbineType: 'Turbines Francis à axe vertical',
    nominalHeadMeters: 39.5,
    designDischargeM3s: 1100,
    regulationTypeFr: 'Fil de l’eau régularisé par les 4 grands barrages-réservoirs du bassin (Lom Pangar, Mbakaou, Bamendjin, Mapé = 13,6 Gm³)',
    regulationTypeEn: 'Run-of-river regulated by all 4 basin storage dams (Lom Pangar, Mbakaou, Bamendjin, Mapé = 13.6 Gm³)',
    reservoirStorageCapacity: 'Bassin de compensation journalier (~10 millions m³ utiles)',
    commissioningYear: '1981 / 1988',
    wetSeasonBehaviourFr:
      'En saison des pluies (juin à novembre), l’apport combiné de la Sanaga et du Mbam porte le débit à Songloulou entre 2 500 et 5 500 m³/s. L’eau est surabondante par rapport aux 1 100 m³/s d’équipement ; la production n’est limitée que par la disponibilité mécanique des 8 groupes (arrêts pour maintenance programmée ou dégrillage) et une légère baisse de chute nette due à la remontée du niveau aval.',
    wetSeasonBehaviourEn:
      'During the wet season (June–November), combined Sanaga and Mbam flows reach 2,500–5,500 m³/s against a 1,100 m³/s plant design discharge. Output is bounded only by mechanical unit availability (scheduled maintenance or trash-rack cleaning) and minor tailwater rise.',
    drySeasonBehaviourFr:
      'Avant Lom Pangar (ex: sécheresses de 2001 et 2012), le débit d’étiage tombait parfois sous 550 m³/s, bridant sévèrement Songloulou. Depuis la mise en service de Lom Pangar (2016) combinée à la Mapé et Bamendjin, le débit régularisé dépasse 1 040 m³/s, assurant 330 à 370 MW disponibles en saison sèche.',
    drySeasonBehaviourEn:
      'Prior to Lom Pangar (e.g., 2001 and 2012 droughts), dry-season flow dropped below 550 m³/s, severely curtailing Songloulou. With Lom Pangar (2016) plus Mapé and Bamendjin regulation, dry-season flow stays above 1,040 m³/s, supporting 330–370 MW of dependable capacity.',
    dataAvailabilityNoticeFr:
      'Production annuelle documentée Eneo/ARSEL : ~2 500 à 2 800 GWh/an. Profil mensuel illustratif reflétant le régime hydrologique régulé de la Basse-Sanaga.',
    dataAvailabilityNoticeEn:
      'Documented Eneo/ARSEL annual generation: ~2,500–2,800 GWh/year. Monthly breakdown is an engineering profile reflecting regulated Lower-Sanaga hydrology.',
    provenanceTier: 'VERIFIED_PUBLIC_RECORD',
    sourceCitation: 'Eneo Cameroon Annual Operations Reports & EDC Sanaga Regulation Records',
    monthlyProfile: [
      { monthIndex: 1, monthShortFr: 'Jan', monthShortEn: 'Jan', naturalInflowM3s: 620, regulatedOrTurbinedFlowM3s: 1050, netHeadMeters: 39.2, availableCapacityMw: 355, illustrativeAvgOutputMw: 315, illustrativeEnergyGwh: 234, seasonState: 'LOW_WATER' },
      { monthIndex: 2, monthShortFr: 'Fév', monthShortEn: 'Feb', naturalInflowM3s: 430, regulatedOrTurbinedFlowM3s: 1020, netHeadMeters: 39.0, availableCapacityMw: 345, illustrativeAvgOutputMw: 305, illustrativeEnergyGwh: 205, seasonState: 'LOW_WATER' },
      { monthIndex: 3, monthShortFr: 'Mar', monthShortEn: 'Mar', naturalInflowM3s: 390, regulatedOrTurbinedFlowM3s: 1010, netHeadMeters: 39.0, availableCapacityMw: 340, illustrativeAvgOutputMw: 300, illustrativeEnergyGwh: 223, seasonState: 'LOW_WATER' },
      { monthIndex: 4, monthShortFr: 'Avr', monthShortEn: 'Apr', naturalInflowM3s: 590, regulatedOrTurbinedFlowM3s: 1040, netHeadMeters: 39.2, availableCapacityMw: 350, illustrativeAvgOutputMw: 310, illustrativeEnergyGwh: 223, seasonState: 'TRANSITION' },
      { monthIndex: 5, monthShortFr: 'Mai', monthShortEn: 'May', naturalInflowM3s: 950, regulatedOrTurbinedFlowM3s: 1080, netHeadMeters: 39.4, availableCapacityMw: 365, illustrativeAvgOutputMw: 320, illustrativeEnergyGwh: 238, seasonState: 'TRANSITION' },
      { monthIndex: 6, monthShortFr: 'Juin', monthShortEn: 'Jun', naturalInflowM3s: 1550, regulatedOrTurbinedFlowM3s: 1100, netHeadMeters: 39.5, availableCapacityMw: 375, illustrativeAvgOutputMw: 330, illustrativeEnergyGwh: 238, seasonState: 'HIGH_WATER' },
      { monthIndex: 7, monthShortFr: 'Juil', monthShortEn: 'Jul', naturalInflowM3s: 2350, regulatedOrTurbinedFlowM3s: 1100, netHeadMeters: 39.3, availableCapacityMw: 375, illustrativeAvgOutputMw: 330, illustrativeEnergyGwh: 245, seasonState: 'HIGH_WATER' },
      { monthIndex: 8, monthShortFr: 'Août', monthShortEn: 'Aug', naturalInflowM3s: 3200, regulatedOrTurbinedFlowM3s: 1100, netHeadMeters: 39.0, availableCapacityMw: 370, illustrativeAvgOutputMw: 325, illustrativeEnergyGwh: 242, seasonState: 'HIGH_WATER' },
      { monthIndex: 9, monthShortFr: 'Sep', monthShortEn: 'Sep', naturalInflowM3s: 4500, regulatedOrTurbinedFlowM3s: 1100, netHeadMeters: 38.6, availableCapacityMw: 368, illustrativeAvgOutputMw: 325, illustrativeEnergyGwh: 234, seasonState: 'HIGH_WATER' },
      { monthIndex: 10, monthShortFr: 'Oct', monthShortEn: 'Oct', naturalInflowM3s: 5100, regulatedOrTurbinedFlowM3s: 1100, netHeadMeters: 38.5, availableCapacityMw: 368, illustrativeAvgOutputMw: 330, illustrativeEnergyGwh: 245, seasonState: 'HIGH_WATER' },
      { monthIndex: 11, monthShortFr: 'Nov', monthShortEn: 'Nov', naturalInflowM3s: 2600, regulatedOrTurbinedFlowM3s: 1100, netHeadMeters: 39.2, availableCapacityMw: 375, illustrativeAvgOutputMw: 325, illustrativeEnergyGwh: 234, seasonState: 'HIGH_WATER' },
      { monthIndex: 12, monthShortFr: 'Déc', monthShortEn: 'Dec', naturalInflowM3s: 1100, regulatedOrTurbinedFlowM3s: 1070, netHeadMeters: 39.4, availableCapacityMw: 365, illustrativeAvgOutputMw: 320, illustrativeEnergyGwh: 238, seasonState: 'TRANSITION' },
    ],
  },
  {
    plantId: 'plant-edea',
    code: 'ENEO-ED-276',
    nameFr: 'Complexe Hydroélectrique d’Édéa I, II, III (276 MW)',
    nameEn: 'Edéa I, II, III Hydroelectric Complex (276 MW)',
    gridSystem: 'RIS',
    riverBasin: 'Basse-Sanaga (45 km en aval de Songloulou)',
    installedCapacityMw: 276,
    unitsConfiguration: '14 groupes (Édéa I : 3 groupes · Édéa II : 6 groupes · Édéa III : 5 groupes)',
    turbineType: 'Turbines Kaplan & Francis de basse chute',
    nominalHeadMeters: 24.0,
    designDischargeM3s: 1200,
    regulationTypeFr: 'Fil de l’eau en série hydraulique directe avec les lâchers turbinés de Songloulou',
    regulationTypeEn: 'Run-of-river operating in direct hydraulic cascade downstream of Songloulou',
    reservoirStorageCapacity: 'Bief au fil de l’eau sans capacité de stockage saisonnier',
    commissioningYear: '1953 (Édéa I) · 1958 (Édéa II) · 1975 (Édéa III)',
    wetSeasonBehaviourFr:
      'Reçoit directement l’eau turbinée et déversée à Songloulou (située ~45 km en amont). En hautes eaux, le débit excède 1 200 m³/s et la puissance disponible atteint ~240–255 MW (tenant compte de l’âge de certains groupes historiques et de la hauteur de chute nette réduite en crue).',
    wetSeasonBehaviourEn:
      'Directly receives the water turbined and spilled at Songloulou (~45 km upstream). During wet months, river discharge exceeds 1,200 m³/s and available capacity reaches ~240–255 MW.',
    drySeasonBehaviourFr:
      'Bénéficie intégralement de la régulation de Lom Pangar, Mbakaou, Bamendjin et Mapé qui garantit >1 000 m³/s dans le lit inférieur de la Sanaga, stabilisant la puissance disponible entre 210 et 235 MW en saison sèche pour alimenter le réseau 90 kV (Douala et électrolyse ALUCAM).',
    drySeasonBehaviourEn:
      'Fully benefits from upstream Sanaga cascade regulation (>1,000 m³/s in dry season), maintaining 210–235 MW of dependable capacity to supply the 90 kV network and the ALUCAM smelter.',
    dataAvailabilityNoticeFr:
      'Production annuelle documentée Eneo : ~1 750 à 1 950 GWh/an. Profil mensuel illustratif couplé au régime de la Basse-Sanaga.',
    dataAvailabilityNoticeEn:
      'Documented Eneo annual generation: ~1,750–1,950 GWh/year. Monthly breakdown is an engineering profile coupled to Lower-Sanaga flows.',
    provenanceTier: 'VERIFIED_PUBLIC_RECORD',
    sourceCitation: 'Eneo Cameroon Generation Fleet Statistics',
    monthlyProfile: [
      { monthIndex: 1, monthShortFr: 'Jan', monthShortEn: 'Jan', naturalInflowM3s: 630, regulatedOrTurbinedFlowM3s: 1060, netHeadMeters: 23.8, availableCapacityMw: 225, illustrativeAvgOutputMw: 205, illustrativeEnergyGwh: 152, seasonState: 'LOW_WATER' },
      { monthIndex: 2, monthShortFr: 'Fév', monthShortEn: 'Feb', naturalInflowM3s: 440, regulatedOrTurbinedFlowM3s: 1030, netHeadMeters: 23.6, availableCapacityMw: 218, illustrativeAvgOutputMw: 198, illustrativeEnergyGwh: 133, seasonState: 'LOW_WATER' },
      { monthIndex: 3, monthShortFr: 'Mar', monthShortEn: 'Mar', naturalInflowM3s: 400, regulatedOrTurbinedFlowM3s: 1020, netHeadMeters: 23.6, availableCapacityMw: 215, illustrativeAvgOutputMw: 195, illustrativeEnergyGwh: 145, seasonState: 'LOW_WATER' },
      { monthIndex: 4, monthShortFr: 'Avr', monthShortEn: 'Apr', naturalInflowM3s: 600, regulatedOrTurbinedFlowM3s: 1050, netHeadMeters: 23.8, availableCapacityMw: 222, illustrativeAvgOutputMw: 202, illustrativeEnergyGwh: 145, seasonState: 'TRANSITION' },
      { monthIndex: 5, monthShortFr: 'Mai', monthShortEn: 'May', naturalInflowM3s: 970, regulatedOrTurbinedFlowM3s: 1100, netHeadMeters: 24.0, availableCapacityMw: 235, illustrativeAvgOutputMw: 212, illustrativeEnergyGwh: 158, seasonState: 'TRANSITION' },
      { monthIndex: 6, monthShortFr: 'Juin', monthShortEn: 'Jun', naturalInflowM3s: 1580, regulatedOrTurbinedFlowM3s: 1180, netHeadMeters: 24.0, availableCapacityMw: 248, illustrativeAvgOutputMw: 220, illustrativeEnergyGwh: 158, seasonState: 'HIGH_WATER' },
      { monthIndex: 7, monthShortFr: 'Juil', monthShortEn: 'Jul', naturalInflowM3s: 2400, regulatedOrTurbinedFlowM3s: 1200, netHeadMeters: 23.8, availableCapacityMw: 250, illustrativeAvgOutputMw: 222, illustrativeEnergyGwh: 165, seasonState: 'HIGH_WATER' },
      { monthIndex: 8, monthShortFr: 'Août', monthShortEn: 'Aug', naturalInflowM3s: 3250, regulatedOrTurbinedFlowM3s: 1200, netHeadMeters: 23.5, availableCapacityMw: 245, illustrativeAvgOutputMw: 220, illustrativeEnergyGwh: 164, seasonState: 'HIGH_WATER' },
      { monthIndex: 9, monthShortFr: 'Sep', monthShortEn: 'Sep', naturalInflowM3s: 4550, regulatedOrTurbinedFlowM3s: 1200, netHeadMeters: 23.1, availableCapacityMw: 242, illustrativeAvgOutputMw: 218, illustrativeEnergyGwh: 157, seasonState: 'HIGH_WATER' },
      { monthIndex: 10, monthShortFr: 'Oct', monthShortEn: 'Oct', naturalInflowM3s: 5150, regulatedOrTurbinedFlowM3s: 1200, netHeadMeters: 23.0, availableCapacityMw: 240, illustrativeAvgOutputMw: 218, illustrativeEnergyGwh: 162, seasonState: 'HIGH_WATER' },
      { monthIndex: 11, monthShortFr: 'Nov', monthShortEn: 'Nov', naturalInflowM3s: 2650, regulatedOrTurbinedFlowM3s: 1200, netHeadMeters: 23.7, availableCapacityMw: 248, illustrativeAvgOutputMw: 220, illustrativeEnergyGwh: 158, seasonState: 'HIGH_WATER' },
      { monthIndex: 12, monthShortFr: 'Déc', monthShortEn: 'Dec', naturalInflowM3s: 1120, regulatedOrTurbinedFlowM3s: 1090, netHeadMeters: 23.9, availableCapacityMw: 232, illustrativeAvgOutputMw: 210, illustrativeEnergyGwh: 156, seasonState: 'TRANSITION' },
    ],
  },
  {
    plantId: 'plant-lagdo',
    code: 'ENEO-LG-72',
    nameFr: 'Barrage-Réservoir Hydroélectrique de Lagdo (72 MW — RIN)',
    nameEn: 'Lagdo Reservoir Hydroelectric Power Station (72 MW — RIN)',
    gridSystem: 'RIN',
    riverBasin: 'Fleuve Bénoué (Région du Nord)',
    installedCapacityMw: 72,
    unitsConfiguration: '4 × 18 MW (Groupes Kaplan G1 à G4)',
    turbineType: 'Turbines Kaplan à pales orientables',
    nominalHeadMeters: 22.0,
    designDischargeM3s: 350,
    regulationTypeFr: 'Barrage-réservoir à régulation interannuelle soumis au régime soudano-sahélien (1 seule courte saison des pluies : juillet–septembre)',
    regulationTypeEn: 'Multi-year storage reservoir governed by Sudano-Sahelian climate (single short recharge season: July–September)',
    reservoirStorageCapacity: '7,7 milliards m³ à la conception (1982), réduite par l’envasement et l’évaporation sahélienne',
    commissioningYear: '1982 (Programme de réhabilitation 2024–2027 en cours)',
    wetSeasonBehaviourFr:
      'Pendant la courte mousson de juillet à septembre, les crues de la Bénoué rechargent le lac de Lagdo. Toutefois, l’exploitant doit impérativement économiser l’eau stockée pendant la saison des pluies pour tenir les 9 mois de saison sèche suivants, tout en utilisant le solaire PV de Guider/Maroua (30 MWp) le jour.',
    wetSeasonBehaviourEn:
      'During the short July–September monsoon, Benue River floods recharge Lake Lagdo. However, operators must conserve water during the wet months to survive the subsequent 9-month dry season, relying on Guider/Maroua Solar PV (30 MWp) during daylight hours.',
    drySeasonBehaviourFr:
      'D’octobre à juin, les apports naturels tombent presque à zéro. Au fur et à mesure que le lac baisse (marnage), la hauteur de chute nette H diminue (passant de 22 m vers 15–17 m) et le débit turbiné est rationné. Lors des années de sécheresse hydrologique, la puissance disponible chute de 72 MW installés à seulement 20–32 MW.',
    drySeasonBehaviourEn:
      'From October to June, natural inflows drop near zero. As reservoir elevation draws down, net hydraulic head H decreases (from 22 m down to 15–17 m) and turbine discharge is rationed. During drought years, dependable capacity falls from 72 MW installed down to 20–32 MW.',
    dataAvailabilityNoticeFr:
      'Cas d’école majeur documenté par Eneo, l’ARSEL et le MINEE sur l’écart entre puissance installée (72 MW) et puissance disponible en étiage (20–35 MW). Profil mensuel illustratif de gestion prudente de la retenue.',
    dataAvailabilityNoticeEn:
      'Textbook Cameroonian example documented by Eneo, ARSEL, and MINEE of the gap between nameplate capacity (72 MW) and dry-season available output (20–35 MW).',
    provenanceTier: 'VERIFIED_PUBLIC_RECORD',
    sourceCitation: 'Eneo RIN Operational Reports, ARSEL & AfDB Lagdo Rehabilitation Studies',
    monthlyProfile: [
      { monthIndex: 1, monthShortFr: 'Jan', monthShortEn: 'Jan', naturalInflowM3s: 25, regulatedOrTurbinedFlowM3s: 190, netHeadMeters: 19.5, availableCapacityMw: 38, illustrativeAvgOutputMw: 30, illustrativeEnergyGwh: 22, seasonState: 'LOW_WATER' },
      { monthIndex: 2, monthShortFr: 'Fév', monthShortEn: 'Feb', naturalInflowM3s: 12, regulatedOrTurbinedFlowM3s: 175, netHeadMeters: 18.8, availableCapacityMw: 34, illustrativeAvgOutputMw: 27, illustrativeEnergyGwh: 18, seasonState: 'LOW_WATER' },
      { monthIndex: 3, monthShortFr: 'Mar', monthShortEn: 'Mar', naturalInflowM3s: 8, regulatedOrTurbinedFlowM3s: 160, netHeadMeters: 17.8, availableCapacityMw: 28, illustrativeAvgOutputMw: 24, illustrativeEnergyGwh: 18, seasonState: 'LOW_WATER' },
      { monthIndex: 4, monthShortFr: 'Avr', monthShortEn: 'Apr', naturalInflowM3s: 15, regulatedOrTurbinedFlowM3s: 150, netHeadMeters: 17.0, availableCapacityMw: 25, illustrativeAvgOutputMw: 22, illustrativeEnergyGwh: 16, seasonState: 'LOW_WATER' },
      { monthIndex: 5, monthShortFr: 'Mai', monthShortEn: 'May', naturalInflowM3s: 45, regulatedOrTurbinedFlowM3s: 155, netHeadMeters: 16.8, availableCapacityMw: 25, illustrativeAvgOutputMw: 22, illustrativeEnergyGwh: 16, seasonState: 'LOW_WATER' },
      { monthIndex: 6, monthShortFr: 'Juin', monthShortEn: 'Jun', naturalInflowM3s: 140, regulatedOrTurbinedFlowM3s: 170, netHeadMeters: 17.5, availableCapacityMw: 30, illustrativeAvgOutputMw: 25, illustrativeEnergyGwh: 18, seasonState: 'TRANSITION' },
      { monthIndex: 7, monthShortFr: 'Juil', monthShortEn: 'Jul', naturalInflowM3s: 480, regulatedOrTurbinedFlowM3s: 210, netHeadMeters: 19.0, availableCapacityMw: 42, illustrativeAvgOutputMw: 34, illustrativeEnergyGwh: 25, seasonState: 'HIGH_WATER' },
      { monthIndex: 8, monthShortFr: 'Août', monthShortEn: 'Aug', naturalInflowM3s: 1150, regulatedOrTurbinedFlowM3s: 260, netHeadMeters: 21.0, availableCapacityMw: 54, illustrativeAvgOutputMw: 42, illustrativeEnergyGwh: 31, seasonState: 'HIGH_WATER' },
      { monthIndex: 9, monthShortFr: 'Sep', monthShortEn: 'Sep', naturalInflowM3s: 1350, regulatedOrTurbinedFlowM3s: 280, netHeadMeters: 22.0, availableCapacityMw: 58, illustrativeAvgOutputMw: 45, illustrativeEnergyGwh: 32, seasonState: 'HIGH_WATER' },
      { monthIndex: 10, monthShortFr: 'Oct', monthShortEn: 'Oct', naturalInflowM3s: 420, regulatedOrTurbinedFlowM3s: 240, netHeadMeters: 21.8, availableCapacityMw: 52, illustrativeAvgOutputMw: 40, illustrativeEnergyGwh: 30, seasonState: 'TRANSITION' },
      { monthIndex: 11, monthShortFr: 'Nov', monthShortEn: 'Nov', naturalInflowM3s: 95, regulatedOrTurbinedFlowM3s: 215, netHeadMeters: 21.0, availableCapacityMw: 45, illustrativeAvgOutputMw: 35, illustrativeEnergyGwh: 25, seasonState: 'LOW_WATER' },
      { monthIndex: 12, monthShortFr: 'Déc', monthShortEn: 'Dec', naturalInflowM3s: 40, regulatedOrTurbinedFlowM3s: 200, netHeadMeters: 20.2, availableCapacityMw: 40, illustrativeAvgOutputMw: 32, illustrativeEnergyGwh: 24, seasonState: 'LOW_WATER' },
    ],
  },
  {
    plantId: 'plant-memveele',
    code: 'EDC-MV-211',
    nameFr: 'Centrale Hydroélectrique de Memve’ele (211 MW)',
    nameEn: 'Memve’ele Hydroelectric Power Station (211 MW)',
    gridSystem: 'RIS',
    riverBasin: 'Fleuve Ntem (Nyabizan — Région du Sud, climat équatorial bimodal)',
    installedCapacityMw: 211,
    unitsConfiguration: '4 × 52,75 MW (Groupes Francis G1 à G4)',
    turbineType: 'Turbines Francis à axe vertical',
    nominalHeadMeters: 35.0,
    designDischargeM3s: 600,
    regulationTypeFr: 'Fil de l’eau pur avec réserve journalière (SANS barrage-réservoir saisonnier amont)',
    regulationTypeEn: 'Pure run-of-river with daily pondage (NO upstream seasonal regulating reservoir)',
    reservoirStorageCapacity: 'Bassin de modulation journalière uniquement (~19 millions m³)',
    commissioningYear: '2019 – 2022 (Mise en service complète de la ligne 225 kV vers Yaoundé)',
    wetSeasonBehaviourFr:
      'Le bassin du Ntem obéit au régime équatorial à 4 saisons : lors de la petite saison des pluies (avril–juin) et surtout de la grande saison des pluies (septembre–novembre), le débit du Ntem dépasse 600 à 1 100 m³/s, permettant aux 4 turbines de produire à pleine puissance (200–211 MW) vers le poste d’Ahala (Yaoundé).',
    wetSeasonBehaviourEn:
      'The Ntem basin follows a 4-season bimodal equatorial regime: during the April–June wet season and especially the September–November major wet season, Ntem river flow exceeds 600–1,100 m³/s, allowing all 4 units to deliver full 200–211 MW output to Ahala (Yaoundé).',
    drySeasonBehaviourFr:
      'En l’absence de barrage-réservoir amont sur le Ntem, la puissance disponible chute fortement pendant la grande saison sèche équatoriale (janvier–février, où le débit du Ntem peut descendre vers 180–250 m³/s, limitant la puissance moyenne à ~70–110 MW avec éclusées de pointe le soir) et modérément en juillet–août.',
    drySeasonBehaviourEn:
      'Because the Ntem River lacks an upstream seasonal storage dam, available capacity drops sharply during the January–February dry season (when Ntem flow can fall to 180–250 m³/s, limiting average output to ~70–110 MW with evening peaking pondage) and moderately in July–August.',
    dataAvailabilityNoticeFr:
      'Profil mensuel illustratif reflétant le régime hydrologique bimodal équatorial du fleuve Ntem à Nyabizan (études hydrologiques EDC / Coyne & Bellier).',
    dataAvailabilityNoticeEn:
      'Illustrative monthly profile reflecting the bimodal equatorial hydrograph of the Ntem River at Nyabizan (EDC hydrological studies).',
    provenanceTier: 'DOCUMENTED_OPERATIONAL_RANGE',
    sourceCitation: 'EDC (Electricity Development Corporation) & AfDB Memve’ele Project Reports',
    monthlyProfile: [
      { monthIndex: 1, monthShortFr: 'Jan', monthShortEn: 'Jan', naturalInflowM3s: 240, regulatedOrTurbinedFlowM3s: 240, netHeadMeters: 34.5, availableCapacityMw: 95, illustrativeAvgOutputMw: 82, illustrativeEnergyGwh: 61, seasonState: 'LOW_WATER' },
      { monthIndex: 2, monthShortFr: 'Fév', monthShortEn: 'Feb', naturalInflowM3s: 195, regulatedOrTurbinedFlowM3s: 195, netHeadMeters: 34.2, availableCapacityMw: 80, illustrativeAvgOutputMw: 68, illustrativeEnergyGwh: 46, seasonState: 'LOW_WATER' },
      { monthIndex: 3, monthShortFr: 'Mar', monthShortEn: 'Mar', naturalInflowM3s: 340, regulatedOrTurbinedFlowM3s: 340, netHeadMeters: 34.8, availableCapacityMw: 130, illustrativeAvgOutputMw: 115, illustrativeEnergyGwh: 85, seasonState: 'TRANSITION' },
      { monthIndex: 4, monthShortFr: 'Avr', monthShortEn: 'Apr', naturalInflowM3s: 560, regulatedOrTurbinedFlowM3s: 550, netHeadMeters: 35.0, availableCapacityMw: 195, illustrativeAvgOutputMw: 175, illustrativeEnergyGwh: 126, seasonState: 'HIGH_WATER' },
      { monthIndex: 5, monthShortFr: 'Mai', monthShortEn: 'May', naturalInflowM3s: 680, regulatedOrTurbinedFlowM3s: 600, netHeadMeters: 35.0, availableCapacityMw: 211, illustrativeAvgOutputMw: 190, illustrativeEnergyGwh: 141, seasonState: 'HIGH_WATER' },
      { monthIndex: 6, monthShortFr: 'Juin', monthShortEn: 'Jun', naturalInflowM3s: 520, regulatedOrTurbinedFlowM3s: 510, netHeadMeters: 35.0, availableCapacityMw: 180, illustrativeAvgOutputMw: 160, illustrativeEnergyGwh: 115, seasonState: 'TRANSITION' },
      { monthIndex: 7, monthShortFr: 'Juil', monthShortEn: 'Jul', naturalInflowM3s: 330, regulatedOrTurbinedFlowM3s: 330, netHeadMeters: 34.6, availableCapacityMw: 125, illustrativeAvgOutputMw: 110, illustrativeEnergyGwh: 82, seasonState: 'LOW_WATER' },
      { monthIndex: 8, monthShortFr: 'Août', monthShortEn: 'Aug', naturalInflowM3s: 310, regulatedOrTurbinedFlowM3s: 310, netHeadMeters: 34.6, availableCapacityMw: 120, illustrativeAvgOutputMw: 105, illustrativeEnergyGwh: 78, seasonState: 'LOW_WATER' },
      { monthIndex: 9, monthShortFr: 'Sep', monthShortEn: 'Sep', naturalInflowM3s: 690, regulatedOrTurbinedFlowM3s: 600, netHeadMeters: 35.0, availableCapacityMw: 211, illustrativeAvgOutputMw: 192, illustrativeEnergyGwh: 138, seasonState: 'HIGH_WATER' },
      { monthIndex: 10, monthShortFr: 'Oct', monthShortEn: 'Oct', naturalInflowM3s: 1050, regulatedOrTurbinedFlowM3s: 600, netHeadMeters: 34.8, availableCapacityMw: 211, illustrativeAvgOutputMw: 198, illustrativeEnergyGwh: 147, seasonState: 'HIGH_WATER' },
      { monthIndex: 11, monthShortFr: 'Nov', monthShortEn: 'Nov', naturalInflowM3s: 890, regulatedOrTurbinedFlowM3s: 600, netHeadMeters: 35.0, availableCapacityMw: 211, illustrativeAvgOutputMw: 195, illustrativeEnergyGwh: 140, seasonState: 'HIGH_WATER' },
      { monthIndex: 12, monthShortFr: 'Déc', monthShortEn: 'Dec', naturalInflowM3s: 410, regulatedOrTurbinedFlowM3s: 400, netHeadMeters: 34.8, availableCapacityMw: 150, illustrativeAvgOutputMw: 132, illustrativeEnergyGwh: 98, seasonState: 'TRANSITION' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. 12-MONTH NATIONAL SEASONAL PERFORMANCE CALENDAR (SECTIONS 11 & 13)
// ─────────────────────────────────────────────────────────────────────────────
export const CAMEROON_MONTHLY_GRID_CALENDAR: NationalMonthlyGridCalendarEntry[] = [
  {
    monthIndex: 1,
    monthNameFr: 'Janvier',
    monthNameEn: 'January',
    seasonCategory: 'LOW_WATER',
    sanagaHydrologyFr: 'Début d’étiage : ouverture des vannes de régulation de Lom Pangar et Mbakaou',
    sanagaHydrologyEn: 'Early dry season: EDC initiates regulating water releases from Lom Pangar and Mbakaou',
    benueHydrologyFr: 'Saison sèche sahélienne : apports naturels quasi nuls, marnage progressif de Lagdo',
    benueHydrologyEn: 'Sahelian dry season: near-zero natural inflow, gradual drawdown of Lake Lagdo',
    ntemHydrologyFr: 'Grande saison sèche équatoriale au Sud : baisse marquée du débit du Ntem à Memve’ele',
    ntemHydrologyEn: 'Major equatorial dry season in South: sharp flow reduction on the Ntem at Memve’ele',
    sanagaNaturalFlowM3s: 620,
    sanagaRegulatedFlowM3s: 1050,
    lomPangarFillPercent: 84,
    lagdoFillPercent: 62,
    hydroAvailableMw: 1098,
    thermalAvailableMw: 390,
    solarDaytimeMw: 28,
    totalEveningAvailableMw: 1488,
    eveningPeakDemandMw: 1360,
    operationalRiskFr: 'Sollicitation accrue du gaz (Kribi/Logbaba) pour compenser la baisse saisonnière de Memve’ele.',
    operationalRiskEn: 'Increased gas thermal dispatch (Kribi/Logbaba) to offset seasonal dip at Memve’ele.',
  },
  {
    monthIndex: 2,
    monthNameFr: 'Février',
    monthNameEn: 'February',
    seasonCategory: 'LOW_WATER',
    sanagaHydrologyFr: 'Cœur de l’étiage de la Sanaga : soutien maximal (~550–650 m³/s lâchés par Lom Pangar/Mbakaou/Mapé)',
    sanagaHydrologyEn: 'Core Sanaga dry season: peak reservoir releases (~550–650 m³/s from Lom Pangar/Mbakaou/Mapé)',
    benueHydrologyFr: 'Étiage sévère et fortes chaleurs au Nord : baisse de la hauteur de chute nette à Lagdo',
    benueHydrologyEn: 'Severe dry season and high heat in North: declining net head at Lagdo',
    ntemHydrologyFr: 'Plus bas hydrologique annuel sur le Ntem (Memve’ele bridée autour de 75–90 MW)',
    ntemHydrologyEn: 'Annual hydrological low on the Ntem River (Memve’ele constrained to ~75–90 MW)',
    sanagaNaturalFlowM3s: 430,
    sanagaRegulatedFlowM3s: 1020,
    lomPangarFillPercent: 64,
    lagdoFillPercent: 51,
    hydroAvailableMw: 1047,
    thermalAvailableMw: 410,
    solarDaytimeMw: 30,
    totalEveningAvailableMw: 1457,
    eveningPeakDemandMw: 1395,
    operationalRiskFr: 'Forte demande de climatisation (chaleurs de février) ; marge de réserve réduite à la pointe du soir (18h–22h).',
    operationalRiskEn: 'High air-conditioning load during February heat; tighter spinning reserve margin during 18:00–22:00 evening peak.',
  },
  {
    monthIndex: 3,
    monthNameFr: 'Mars',
    monthNameEn: 'March',
    seasonCategory: 'LOW_WATER',
    sanagaHydrologyFr: 'Fin d’étiage sévère : niveau bas des retenues de régulation avant les premières pluies',
    sanagaHydrologyEn: 'Late dry-season trough: regulating reservoirs approach minimum operating drawdown before spring rains',
    benueHydrologyFr: 'Cote basse critique à Lagdo (~25–30 MW disponibles) ; dépendance maximale au solaire et thermique RIN',
    benueHydrologyEn: 'Low reservoir level at Lagdo (~25–30 MW available); maximum RIN reliance on solar PV and diesel backup',
    ntemHydrologyFr: 'Reprise progressive des pluies équatoriales de printemps sur le bassin du Ntem',
    ntemHydrologyEn: 'Gradual onset of spring equatorial rains across the Ntem basin',
    sanagaNaturalFlowM3s: 390,
    sanagaRegulatedFlowM3s: 1010,
    lomPangarFillPercent: 42,
    lagdoFillPercent: 40,
    hydroAvailableMw: 1078,
    thermalAvailableMw: 415,
    solarDaytimeMw: 29,
    totalEveningAvailableMw: 1493,
    eveningPeakDemandMw: 1420,
    operationalRiskFr: 'Mois historiquement le plus tendu sur le RIN (Garoua/Maroua/Ngaoundéré) et lors des orages de transition sur les lignes HTB/HTA.',
    operationalRiskEn: 'Historically tightest month on the RIN (Northern Grid) and first transitional line-fault storms.',
  },
  {
    monthIndex: 4,
    monthNameFr: 'Avril',
    monthNameEn: 'April',
    seasonCategory: 'TRANSITION',
    sanagaHydrologyFr: 'Amorçage de la reprise hydrologique : réduction progressive des lâchers de Lom Pangar',
    sanagaHydrologyEn: 'Hydrological recovery begins: gradual reduction of Lom Pangar supplemental releases',
    benueHydrologyFr: 'Canicule sahélienne (>40 °C à Garoua/Maroua) : pointe de climatisation sur le RIN alors que Lagdo est au plus bas',
    benueHydrologyEn: 'Sahelian heatwave (>40 °C in Garoua/Maroua): peak cooling demand on RIN while Lagdo is at minimum head',
    ntemHydrologyFr: 'Petite saison des pluies active au Sud : Memve’ele remonte vers 180–200 MW disponibles',
    ntemHydrologyEn: 'Active spring wet season in South: Memve’ele recovers toward 180–200 MW available',
    sanagaNaturalFlowM3s: 590,
    sanagaRegulatedFlowM3s: 1040,
    lomPangarFillPercent: 32,
    lagdoFillPercent: 33,
    hydroAvailableMw: 1172,
    thermalAvailableMw: 380,
    solarDaytimeMw: 28,
    totalEveningAvailableMw: 1552,
    eveningPeakDemandMw: 1400,
    operationalRiskFr: 'Tension maximale sur le Réseau Nord (RIN) en soirée ; amélioration nette sur le Réseau Sud (RIS) grâce au Ntem.',
    operationalRiskEn: 'Peak evening stress on the Northern Grid (RIN); marked improvement on the Southern Grid (RIS) via Memve’ele.',
  },
  {
    monthIndex: 5,
    monthNameFr: 'Mai',
    monthNameEn: 'May',
    seasonCategory: 'TRANSITION',
    sanagaHydrologyFr: 'Montée des eaux sur l’Adamaoua et l’Ouest : arrêt des lâchers de soutien et début du remplissage des retenues',
    sanagaHydrologyEn: 'Rising flows in Adamawa and West: supplemental releases cease and reservoir refilling begins',
    benueHydrologyFr: 'Premières pluies orageuses au Nord, mais ruissellement encore faible vers Lagdo',
    benueHydrologyEn: 'Early convective storms in North, though runoff into Lake Lagdo remains low',
    ntemHydrologyFr: 'Pic de la petite saison des pluies sur le Ntem (Memve’ele à pleine capacité 211 MW)',
    ntemHydrologyEn: 'Peak of the spring wet season on the Ntem (Memve’ele at full 211 MW capacity)',
    sanagaNaturalFlowM3s: 950,
    sanagaRegulatedFlowM3s: 1080,
    lomPangarFillPercent: 38,
    lagdoFillPercent: 30,
    hydroAvailableMw: 1236,
    thermalAvailableMw: 340,
    solarDaytimeMw: 26,
    totalEveningAvailableMw: 1576,
    eveningPeakDemandMw: 1350,
    operationalRiskFr: 'Orages violents de début de saison entraînant des déclenchements fugitifs sur lignes aériennes 225/90/30 kV.',
    operationalRiskEn: 'Severe early-season lightning storms causing transient trips on 225/90/30 kV overhead lines.',
  },
  {
    monthIndex: 6,
    monthNameFr: 'Juin',
    monthNameEn: 'June',
    seasonCategory: 'HIGH_WATER',
    sanagaHydrologyFr: 'Le débit naturel de la Sanaga dépasse le débit d’équipement des centrales (>1 500 m³/s)',
    sanagaHydrologyEn: 'Natural Sanaga River discharge exceeds powerhouse design flow (>1,500 m³/s)',
    benueHydrologyFr: 'Début de la recharge du réservoir de Lagdo sur le bassin de la Bénoué',
    benueHydrologyEn: 'Onset of reservoir recharge at Lake Lagdo in the Benue basin',
    ntemHydrologyFr: 'Transition vers la petite saison sèche équatoriale au Sud',
    ntemHydrologyEn: 'Transition toward the minor equatorial dry season in the South',
    sanagaNaturalFlowM3s: 1550,
    sanagaRegulatedFlowM3s: 1100,
    lomPangarFillPercent: 49,
    lagdoFillPercent: 36,
    hydroAvailableMw: 1253,
    thermalAvailableMw: 310,
    solarDaytimeMw: 24,
    totalEveningAvailableMw: 1563,
    eveningPeakDemandMw: 1310,
    operationalRiskFr: 'Charriage de débris végétaux et jacinthes d’eau nécessitant un dégrillage intensif des prises d’eau.',
    operationalRiskEn: 'Floating vegetation and debris transport requiring intensive trash-rack cleaning at hydro intakes.',
  },
  {
    monthIndex: 7,
    monthNameFr: 'Juillet',
    monthNameEn: 'July',
    seasonCategory: 'HIGH_WATER',
    sanagaHydrologyFr: 'Hautes eaux sur la Sanaga (2 350 m³/s) : Nachtigal, Songloulou et Édéa à pleine disponibilité hydraulique',
    sanagaHydrologyEn: 'High flows on the Sanaga (2,350 m³/s): Nachtigal, Songloulou, and Edéa at full hydraulic availability',
    benueHydrologyFr: 'Mousson active au Nord : montée rapide de la cote du lac de Lagdo',
    benueHydrologyEn: 'Active northern monsoon: rapid rise in Lake Lagdo water elevation',
    ntemHydrologyFr: 'Petite saison sèche au Sud : Memve’ele redescend autour de 120–130 MW disponibles',
    ntemHydrologyEn: 'Minor dry season in South: Memve’ele moderates to ~120–130 MW available',
    sanagaNaturalFlowM3s: 2350,
    sanagaRegulatedFlowM3s: 1100,
    lomPangarFillPercent: 63,
    lagdoFillPercent: 52,
    hydroAvailableMw: 1212,
    thermalAvailableMw: 300,
    solarDaytimeMw: 21,
    totalEveningAvailableMw: 1512,
    eveningPeakDemandMw: 1280,
    operationalRiskFr: 'Mise à l’arrêt programmée de certains groupes thermiques HFO pour grande révision annuelle.',
    operationalRiskEn: 'Scheduled annual maintenance overhauls on HFO thermal units during high hydro availability.',
  },
  {
    monthIndex: 8,
    monthNameFr: 'Août',
    monthNameEn: 'August',
    seasonCategory: 'HIGH_WATER',
    sanagaHydrologyFr: 'Fortes crues sur la Sanaga et le Mbam (>3 200 m³/s) : ouverture des évacuateurs de crue',
    sanagaHydrologyEn: 'Heavy flows on Sanaga and Mbam (>3,200 m³/s): spillway gates open for flood routing',
    benueHydrologyFr: 'Pic de crue sur la Bénoué : recharge maximale de Lagdo (risque de lâchers de crue si saturation)',
    benueHydrologyEn: 'Peak Benue flood inflow: maximum recharge of Lake Lagdo',
    ntemHydrologyFr: 'Fin de la petite saison sèche sur le Ntem',
    ntemHydrologyEn: 'End of the minor dry season on the Ntem River',
    sanagaNaturalFlowM3s: 3200,
    sanagaRegulatedFlowM3s: 1100,
    lomPangarFillPercent: 78,
    lagdoFillPercent: 74,
    hydroAvailableMw: 1209,
    thermalAvailableMw: 300,
    solarDaytimeMw: 20,
    totalEveningAvailableMw: 1509,
    eveningPeakDemandMw: 1275,
    operationalRiskFr: 'Forte humidité à Douala/Sud-Ouest : avaries sur câbles souterrains HTA 15 kV et chutes d’arbres/poteaux bois.',
    operationalRiskEn: 'Heavy coastal monsoon in Douala/South-West: localized MV cable moisture faults and wood pole failures.',
  },
  {
    monthIndex: 9,
    monthNameFr: 'Septembre',
    monthNameEn: 'September',
    seasonCategory: 'HIGH_WATER',
    sanagaHydrologyFr: 'Crue majeure de la Sanaga (~4 500 m³/s) : déversement massif aux barrages, légère perte de chute nette aval',
    sanagaHydrologyEn: 'Major Sanaga flood (~4,500 m³/s): heavy spillway discharge, slight tailwater head reduction',
    benueHydrologyFr: 'Fin de la saison des pluies au Nord : retenue de Lagdo proche de sa cote maximale d’exploitation',
    benueHydrologyEn: 'End of northern wet season: Lake Lagdo reaches peak annual operating storage',
    ntemHydrologyFr: 'Retour de la grande saison des pluies au Sud : Memve’ele à 100% (211 MW)',
    ntemHydrologyEn: 'Return of major wet season in South: Memve’ele back at 100% (211 MW)',
    sanagaNaturalFlowM3s: 4500,
    sanagaRegulatedFlowM3s: 1100,
    lomPangarFillPercent: 92,
    lagdoFillPercent: 88,
    hydroAvailableMw: 1299,
    thermalAvailableMw: 290,
    solarDaytimeMw: 22,
    totalEveningAvailableMw: 1589,
    eveningPeakDemandMw: 1300,
    operationalRiskFr: 'Surcapacité hydraulique nationale : toute coupure en septembre provient de contraintes transport/distribution et non d’un manque d’eau.',
    operationalRiskEn: 'Maximum national hydro surplus: any power interruption in September stems from transmission/distribution faults, never water shortage.',
  },
  {
    monthIndex: 10,
    monthNameFr: 'Octobre',
    monthNameEn: 'October',
    seasonCategory: 'HIGH_WATER',
    sanagaHydrologyFr: 'Pic annuel de crue de la Sanaga (>5 000 m³/s à Édéa) ; Lom Pangar plein à ~98–100%',
    sanagaHydrologyEn: 'Annual peak discharge on the Sanaga (>5,000 m³/s at Edéa); Lom Pangar 98–100% full',
    benueHydrologyFr: 'Arrêt des pluies au Nord : début de la gestion de réserve de Lagdo pour les 8 mois suivants',
    benueHydrologyEn: 'Rains cease in North: Lagdo enters conservation dispatch for the upcoming 8-month dry season',
    ntemHydrologyFr: 'Crue maximale du Ntem (>1 000 m³/s) : Memve’ele à pleine puissance',
    ntemHydrologyEn: 'Peak Ntem flood (>1,000 m³/s): Memve’ele at full capacity',
    sanagaNaturalFlowM3s: 5100,
    sanagaRegulatedFlowM3s: 1100,
    lomPangarFillPercent: 99,
    lagdoFillPercent: 86,
    hydroAvailableMw: 1291,
    thermalAvailableMw: 290,
    solarDaytimeMw: 25,
    totalEveningAvailableMw: 1581,
    eveningPeakDemandMw: 1320,
    operationalRiskFr: 'Activité kéraunique intense (orages d’octobre) sollicitant les protections de distance ANSI 21 et réenclencheurs 79.',
    operationalRiskEn: 'Intense October lightning storms triggering transient ANSI 21 distance trips and ANSI 79 auto-reclosures.',
  },
  {
    monthIndex: 11,
    monthNameFr: 'Novembre',
    monthNameEn: 'November',
    seasonCategory: 'HIGH_WATER',
    sanagaHydrologyFr: 'Amorçage de la décrue naturelle (~2 600 m³/s), toujours plus de 2 fois supérieur aux besoins des turbines',
    sanagaHydrologyEn: 'Natural recession begins (~2,600 m³/s), still more than double powerhouse turbine requirements',
    benueHydrologyFr: 'Saison sèche installée au Nord : sollicitation accrue du solaire PV + BESS de Guider et Maroua',
    benueHydrologyEn: 'Dry season established in North: high utilization of Guider and Maroua Solar PV + BESS',
    ntemHydrologyFr: 'Hautes eaux maintenues sur le Ntem et le Dja (Memve’ele et Mékin à 100%)',
    ntemHydrologyEn: 'Sustained high flows on Ntem and Dja rivers (Memve’ele and Mekin at 100%)',
    sanagaNaturalFlowM3s: 2600,
    sanagaRegulatedFlowM3s: 1100,
    lomPangarFillPercent: 98,
    lagdoFillPercent: 79,
    hydroAvailableMw: 1299,
    thermalAvailableMw: 320,
    solarDaytimeMw: 28,
    totalEveningAvailableMw: 1619,
    eveningPeakDemandMw: 1340,
    operationalRiskFr: 'Conditions optimales de production sur le RIS ; préparation des réserves de combustible thermique pour l’étiage.',
    operationalRiskEn: 'Optimal generation conditions on the RIS; pre-positioning of thermal fuel reserves for the dry season.',
  },
  {
    monthIndex: 12,
    monthNameFr: 'Décembre',
    monthNameEn: 'December',
    seasonCategory: 'TRANSITION',
    sanagaHydrologyFr: 'Décrue rapide vers ~1 100 m³/s : préparation de la campagne de lâchers de Lom Pangar',
    sanagaHydrologyEn: 'Rapid recession toward ~1,100 m³/s: preparation for Lom Pangar dry-season release campaign',
    benueHydrologyFr: 'Harmattan sec : baisse continue du lac de Lagdo',
    benueHydrologyEn: 'Dry Harmattan winds: continued drawdown of Lake Lagdo',
    ntemHydrologyFr: 'Entrée en grande saison sèche au Sud : baisse du débit du Ntem en fin d’année',
    ntemHydrologyEn: 'Onset of major dry season in South: Ntem discharge declines toward year-end',
    sanagaNaturalFlowM3s: 1100,
    sanagaRegulatedFlowM3s: 1070,
    lomPangarFillPercent: 94,
    lagdoFillPercent: 71,
    hydroAvailableMw: 1187,
    thermalAvailableMw: 370,
    solarDaytimeMw: 28,
    totalEveningAvailableMw: 1557,
    eveningPeakDemandMw: 1385,
    operationalRiskFr: 'Forte pointe résidentielle et commerciale des fêtes de fin d’année en soirée (surcharge locale de transformateurs H61 BT).',
    operationalRiskEn: 'High year-end holiday residential/commercial evening peak (localized overloading of H61 distribution transformers).',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. 24-HOUR ILLUSTRATIVE DAILY DEMAND CURVE (SECTION 7)
// ─────────────────────────────────────────────────────────────────────────────
export const CAMEROON_DAILY_DEMAND_CURVE_24H: HourlyDemandPoint[] = [
  { hour: '00:00', residentialMw: 280, industrialMw: 460, commercialPublicMw: 140, totalDemandMw: 880, solarContributionMw: 0, periodLabelFr: 'Creux de nuit', periodLabelEn: 'Night Trough' },
  { hour: '02:00', residentialMw: 240, industrialMw: 455, commercialPublicMw: 125, totalDemandMw: 820, solarContributionMw: 0, periodLabelFr: 'Minimum nocturne (Base ALUCAM + Industries)', periodLabelEn: 'Overnight Minimum (ALUCAM + Industrial Baseload)' },
  { hour: '04:00', residentialMw: 250, industrialMw: 455, commercialPublicMw: 130, totalDemandMw: 835, solarContributionMw: 0, periodLabelFr: 'Fin de nuit', periodLabelEn: 'Late Night' },
  { hour: '06:00', residentialMw: 390, industrialMw: 470, commercialPublicMw: 170, totalDemandMw: 1030, solarContributionMw: 2, periodLabelFr: 'Pointe matinale (Réveil ménages & pompage eau)', periodLabelEn: 'Morning Ramp (Households & Water Pumping)' },
  { hour: '08:00', residentialMw: 330, industrialMw: 510, commercialPublicMw: 260, totalDemandMw: 1100, solarContributionMw: 18, periodLabelFr: 'Démarrage tertiaire, écoles & ateliers', periodLabelEn: 'Commercial, Schools & Industrial Shift Start' },
  { hour: '10:00', residentialMw: 300, industrialMw: 530, commercialPublicMw: 320, totalDemandMw: 1150, solarContributionMw: 28, periodLabelFr: 'Plateau matinée (Solaire PV RIN actif)', periodLabelEn: 'Mid-Morning Plateau (RIN Solar PV Active)' },
  { hour: '12:00', residentialMw: 310, industrialMw: 525, commercialPublicMw: 355, totalDemandMw: 1190, solarContributionMw: 30, periodLabelFr: 'Pic de midi (Climatisation bureaux & commerces)', periodLabelEn: 'Midday Peak (Office & Commercial Air Conditioning)' },
  { hour: '14:00', residentialMw: 315, industrialMw: 530, commercialPublicMw: 365, totalDemandMw: 1210, solarContributionMw: 29, periodLabelFr: 'Plateau chaud d’après-midi', periodLabelEn: 'Afternoon Cooling Plateau' },
  { hour: '16:00', residentialMw: 340, industrialMw: 520, commercialPublicMw: 330, totalDemandMw: 1190, solarContributionMw: 16, periodLabelFr: 'Déclin solaire & transition fin de journée', periodLabelEn: 'Solar Ramp-Down & Late Afternoon Transition' },
  { hour: '18:00', residentialMw: 520, industrialMw: 500, commercialPublicMw: 290, totalDemandMw: 1310, solarContributionMw: 0, periodLabelFr: 'Rampe vespérale brutale (Soleil = 0 MW + Éclairage)', periodLabelEn: 'Steep Evening Ramp (Zero Solar + Lighting Onset)' },
  { hour: '19:30', residentialMw: 640, industrialMw: 495, commercialPublicMw: 265, totalDemandMw: 1400, solarContributionMw: 0, periodLabelFr: 'POINTE DU SOIR NATIONALE (Ménages + Clim + Industries)', periodLabelEn: 'NATIONAL EVENING PEAK (Residential + Cooling + Industry)' },
  { hour: '21:00', residentialMw: 610, industrialMw: 490, commercialPublicMw: 230, totalDemandMw: 1330, solarContributionMw: 0, periodLabelFr: 'Maintien pointe de soirée', periodLabelEn: 'Sustained Evening Peak' },
  { hour: '22:30', residentialMw: 430, industrialMw: 475, commercialPublicMw: 175, totalDemandMw: 1080, solarContributionMw: 0, periodLabelFr: 'Décroissance nocturne', periodLabelEn: 'Late Evening Decay' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. SIX EDUCATIONAL ENGINEERING CASE STUDIES (SECTION 15)
// ─────────────────────────────────────────────────────────────────────────────
export const CAMEROON_SEASONAL_CASE_STUDIES: SeasonalCaseStudy[] = [
  {
    id: 'cs-1-low-water',
    number: 1,
    titleFr: 'Cas d’Étude 1 : Étiage Sévère sur Centrale au Fil de l’Eau Non Régulée (Exemple Type Memve’ele / Ntem)',
    titleEn: 'Case Study 1: Dry-Season Low Water on an Unregulated Run-of-River Plant (Memve’ele / Ntem Model)',
    category: 'LOW_WATER',
    isHypotheticalCalculation: true,
    cameroonContextFr:
      'Pendant la grande saison sèche équatoriale (février) dans la région du Sud, le fleuve Ntem ne dispose d’aucun barrage-réservoir saisonnier amont. Le débit entrant chute sous le débit nominal des 4 groupes Francis de Memve’ele.',
    cameroonContextEn:
      'During the February equatorial dry season in the South Region, the Ntem River has no upstream seasonal storage reservoir. Natural river inflow drops well below the 600 m³/s design discharge of Memve’ele’s 4 Francis units.',
    engineeringParameters: [
      { label: 'Puissance installée (4 groupes)', value: '211 MW (Q_nom = 600 m³/s, H_n = 35 m)' },
      { label: 'Débit naturel d’étiage (Hypothèse calcul)', value: 'Q_dispo = 210 m³/s (seulement 35% du débit nominal)' },
      { label: 'Formule hydraulique fondamentale', value: 'P = ρ · g · Q · H · η = 1000 × 9,81 × 210 × 34,4 × 0,91' },
      { label: 'Puissance électrique réelle obtenue', value: 'P ≈ 64,5 MW (Déficit de 146,5 MW par rapport à la plaque)' },
    ],
    causalChainFr: [
      'Absence de pluies sur le bassin versant du Ntem en janvier–février',
      'Le débit naturel tombe à 210 m³/s et aucun réservoir pluriannuel amont ne peut lâcher d’eau',
      'Deux groupes sur quatre doivent être arrêtés pour maintenir les deux groupes restants dans leur plage de rendement sans cavitation',
      'La puissance injectée sur la ligne 225 kV Memve’ele–Ahala passe de 211 MW à ~65 MW en moyenne journalière',
    ],
    causalChainEn: [
      'Low rainfall across the Ntem catchment during January–February',
      'River inflow drops to 210 m³/s with no upstream multi-year storage reservoir to supplement flow',
      'Two of the four Francis units must be shut down so the remaining two operate within their cavitation-free efficiency zone',
      'Power delivered over the 225 kV Memve’ele–Ahala corridor drops from 211 MW nameplate to ~65 MW daily average',
    ],
    technicalConclusionFr:
      'Démontre mathématiquement (P = ρ·g·Q·H·η) pourquoi une centrale parfaitement opérationnelle de 211 MW ne peut fournir que ~65 MW lorsque le débit Q est divisé par trois.',
    technicalConclusionEn:
      'Demonstrates mathematically via P = ρ·g·Q·H·η why a healthy 211 MW plant can deliver only ~65 MW when available river discharge Q drops to one-third of design flow.',
  },
  {
    id: 'cs-2-high-water-spill',
    number: 2,
    titleFr: 'Cas d’Étude 2 : Crue Majeure d’Octobre & Ouverture des Évacuateurs de Crue (Sanaga à Songloulou / Nachtigal)',
    titleEn: 'Case Study 2: October Peak Flood & Spillway Gate Operation (Sanaga at Songloulou / Nachtigal)',
    category: 'HIGH_WATER_SPILL',
    isHypotheticalCalculation: true,
    cameroonContextFr:
      'En octobre, le débit de la Sanaga à Songloulou atteint 4 800 m³/s. Les usagers voient d’immenses cataractes d’eau franchir l’évacuateur de crue et se demandent pourquoi la centrale ne produit pas 4 fois plus d’électricité.',
    cameroonContextEn:
      'In October, Sanaga River discharge at Songloulou reaches 4,800 m³/s. Observers see massive whitewater roaring through the spillway gates and wonder why the plant does not generate four times more electricity.',
    engineeringParameters: [
      { label: 'Débit total du fleuve Sanaga en crue', value: 'Q_fleuve = 4 800 m³/s' },
      { label: 'Débit maximal absorbable par les 8 turbines', value: 'Q_max_turbines = 1 100 m³/s (Limite physique des conduites)' },
      { label: 'Débit déversé par l’évacuateur de crue', value: 'Q_déversé = 4 800 - 1 100 = 3 700 m³/s (0 MW produit)' },
      { label: 'Effet de remous aval (Tailwater Rise)', value: 'H_nette baisse de 39,5 m à 38,2 m ➔ P_max ≈ 372 MW (< 384 MW)' },
    ],
    causalChainFr: [
      'Les 8 turbines Francis sont saturées à leur débit maximal de 1 100 m³/s et les alternateurs à leur courant statorique nominal',
      'Les 3 700 m³/s excédentaires DOIVENT être évacués par les vannes de crue pour empêcher la submersion du barrage',
      'Le niveau d’eau dans le canal de fuite aval remonte de plus d’un mètre sous l’effet de la crue, réduisant légèrement la chute nette H',
    ],
    causalChainEn: [
      'All 8 Francis turbines are saturated at their maximum 1,100 m³/s hydraulic swallowing capacity and generator MVA rating',
      'The remaining 3,700 m³/s MUST bypass the powerhouse via the spillway gates to ensure dam structural safety',
      'High tailwater elevation in the downstream channel slightly reduces net hydraulic head H from 39.5 m to 38.2 m',
    ],
    technicalConclusionFr:
      'L’eau évacuée par les vannes de crue ne traverse aucune turbine : au-delà du débit d’équipement (1 100 m³/s), une crue supplémentaire n’augmente jamais la puissance électrique au-dessus de la puissance installée.',
    technicalConclusionEn:
      'Water discharged through spillway gates bypasses the turbines completely: once river flow exceeds powerhouse design discharge (1,100 m³/s), additional floodwater cannot increase electrical output beyond nameplate capacity.',
  },
  {
    id: 'cs-3-evening-peak',
    number: 3,
    titleFr: 'Cas d’Étude 3 : Disponibilité le Matin mais Coupure le Soir (Déficit de Pointe Vespérale 18h30–21h30)',
    titleEn: 'Case Study 3: Power Available in the Morning Followed by Evening Interruption (18:30–21:30 Peak Deficit)',
    category: 'EVENING_PEAK',
    isHypotheticalCalculation: true,
    cameroonContextFr:
      'Scénario pédagogique illustrant pourquoi un quartier dispose d’électricité toute la matinée (06h00–12h00) mais subit un délestage à 19h00 lors d’une journée sèche où la capacité disponible est contrainte.',
    cameroonContextEn:
      'Engineering scenario illustrating why a neighborhood has normal electricity all morning (06:00–12:00) but experiences load shedding at 19:00 during a constrained dry-season day.',
    engineeringParameters: [
      { label: 'Puissance totale disponible sur le réseau (Hypothèse)', value: 'P_dispo = 1 150 MW (Hydro + Gaz + HFO disponibles)' },
      { label: 'Demande nationale à 09h00 du matin', value: 'D_matin = 1 020 MW ➔ Excédent de +130 MW (0 délestage)' },
      { label: 'Demande nationale à 19h30 (Pointe du soir)', value: 'D_soir = 1 350 MW (Retour ménages + éclairage + clim + TV)' },
      { label: 'Déséquilibre Production–Demande à 19h30', value: 'Déficit = -200 MW (Chute de fréquence sous 49,5 Hz si non corrigé)' },
    ],
    causalChainFr: [
      'À 09h00, la demande (1 020 MW) est inférieure à la production disponible (1 150 MW) et le solaire PV fournit 30 MW au Nord : tous les départs sont alimentés',
      'Dès 18h00, la production solaire tombe à 0 MW tandis que 1,9 million de foyers allument éclairage, téléviseurs, climatiseurs et appareils de cuisson',
      'La demande bondit à 1 350 MW alors que la puissance disponible plafonne à 1 150 MW (déficit de 200 MW)',
      'Pour éviter l’effondrement de la fréquence 50 Hz et le blackout complet du RIS, le CNCR de Mangombé ordonne le délestage tournant de ~200 MW de départs HTA non prioritaires entre 18h30 et 22h00, tout en maintenant les départs prioritaires (hôpitaux, châteaux d’eau, centres vitaux)',
    ],
    causalChainEn: [
      'At 09:00, national demand (1,020 MW) is well below available generation (1,150 MW) and solar PV contributes 30 MW: all feeders remain energized',
      'By 18:00, solar output drops to 0 MW while 1.9 million households simultaneously switch on lighting, air conditioning, appliances, and television',
      'Total demand surges to 1,350 MW against a 1,150 MW generation ceiling, creating a 200 MW deficit',
      'To prevent 50 Hz frequency collapse and a total grid blackout, the Mangombé CNCR sheds ~200 MW of non-priority MV feeders between 18:30 and 22:00 while keeping priority feeders (hospitals, water pumping, core hubs) energized',
    ],
    technicalConclusionFr:
      'Explique pourquoi le courant revient vers 22h30 dès que la demande résidentielle retombe sous la barre des 1 150 MW disponibles.',
    technicalConclusionEn:
      'Explains why power is restored around 22:30 as soon as residential demand subsides below the 1,150 MW available generation ceiling.',
  },
  {
    id: 'cs-4-unit-outage',
    number: 4,
    titleFr: 'Cas d’Étude 4 : Indisponibilité de Groupes & Colmatage des Grilles en Pleine Saison des Pluies',
    titleEn: 'Case Study 4: Generating Unit Outage & Trash-Rack Fouling During Peak Rainy Season',
    category: 'UNIT_OUTAGE',
    isHypotheticalCalculation: true,
    cameroonContextFr:
      'En pleine saison des pluies (août), le fleuve est en crue mais une centrale hydroélectrique voit sa puissance disponible amputée de 25%.',
    cameroonContextEn:
      'During the height of the August rainy season, river flow is abundant yet a hydroelectric plant experiences a 25% drop in available output.',
    engineeringParameters: [
      { label: 'Puissance installée de la centrale (8 groupes)', value: '384 MW (8 × 48 MW)' },
      { label: 'Groupe G3 en révision décennale programmée', value: '-48 MW indisponibles' },
      { label: 'Déclenchement Groupe G6 (Refroidissement / Excitation)', value: '-48 MW indisponibles' },
      { label: 'Perte de charge ΔH sur grilles colmatées par débris de crue', value: 'ΔH = 1,8 m ➔ Perte supplémentaire de ~14 MW sur les 6 groupes actifs' },
    ],
    causalChainFr: [
      'Les crues charrient des troncs d’arbres, îlots flottants et jacinthes d’eau qui colmatent les grilles de prise d’eau, créant une perte de charge ΔH',
      'Deux groupes de 48 MW sont hors service pour maintenance électromécanique (stator/pivoterie)',
      'Malgré un fleuve débordant d’eau, seuls 6 groupes sur 8 peuvent tourner, plafonnant la centrale à ~274 MW au lieu de 384 MW',
    ],
    causalChainEn: [
      'Floodwaters carry floating logs, vegetation mats, and water hyacinths that foul intake trash racks, increasing head loss ΔH',
      'Two 48 MW units are offline for electromechanical overhaul',
      'Despite abundant water in the river, only 6 of 8 turbines can operate, capping plant output at ~274 MW instead of 384 MW',
    ],
    technicalConclusionFr:
      'L’eau est une condition nécessaire mais non suffisante : la disponibilité électromécanique des turbines, alternateurs et transformateurs élévateurs GSU borne toujours la production réelle.',
    technicalConclusionEn:
      'Water availability is necessary but not sufficient: electromechanical availability of turbines, generators, and GSU transformers always bounds actual power output.',
  },
  {
    id: 'cs-5-transmission-constraint',
    number: 5,
    titleFr: 'Cas d’Étude 5 : Énergie Disponible en Centrale mais Coupure par Contrainte Transport / Distribution',
    titleEn: 'Case Study 5: Surplus Generation at Power Plants Concurrent with a Neighborhood Outage',
    category: 'TRANSMISSION_CONSTRAINT',
    isHypotheticalCalculation: true,
    cameroonContextFr:
      'En saison des pluies, Nachtigal (420 MW), Songloulou (384 MW) et Memve’ele (211 MW) disposent d’un excédent de production, mais un quartier de Douala ou Yaoundé subit une coupure de courant.',
    cameroonContextEn:
      'During the wet season, Nachtigal (420 MW), Songloulou (384 MW), and Memve’ele (211 MW) have surplus generation capacity, yet a district in Douala or Yaoundé loses power.',
    engineeringParameters: [
      { label: 'Marge de réserve de production sur le RIS', value: '+280 MW d’excédent disponible aux bornes des centrales' },
      { label: 'Cas A (Poste source 90/15 kV)', value: 'Surcharge ou déclenchement d’un transformateur 36 MVA (ANSI 87T / 49)' },
      { label: 'Cas B (Départ HTA 30/15 kV ou Poste H61)', value: 'Coup de foudre, câble souterrain percé ou chute de poteau bois' },
      { label: 'Conséquence locale', value: 'Interruption locale de 5 à 15 MW alors que le réseau national est excédentaire' },
    ],
    causalChainFr: [
      'Les centrales de la Sanaga produisent normalement et la fréquence nationale est stable à 50,00 Hz',
      'Un orage à Douala ou Yaoundé provoque le déclenchement par protection homopolaire (ANSI 51N/67N) d’un départ HTA 15 kV ou l’avarie d’un transformateur de quartier H61 (160 kVA)',
      'Les abonnés raccordés à ce départ sont privés d’électricité jusqu’à l’isolation du tronçon en défaut et la réalimentation par bouclage HTA ou remplacement du fusible/transformateur',
    ],
    causalChainEn: [
      'Sanaga hydro plants operate normally with grid frequency stable at 50.00 Hz',
      'A local storm in Douala or Yaoundé trips a 15 kV MV feeder via earth-fault protection (ANSI 51N/67N) or damages a 160 kVA H61 distribution transformer',
      'Subscribers on that feeder lose power until field crews isolate the faulted cable section and restore supply via MV ring switching',
    ],
    technicalConclusionFr:
      'Il ne faut jamais attribuer chaque coupure de courant au Cameroun à un déficit d’eau : plus de la moitié des interruptions résultent d’incidents locaux sur les réseaux de distribution HTA/BT ou de saturatons de postes.',
    technicalConclusionEn:
      'Never attribute every power outage in Cameroon to low water: a large share of interruptions result from localized MV/LV distribution faults or substation transformer bottlenecks.',
  },
  {
    id: 'cs-6-prolonged-drought',
    number: 6,
    titleFr: 'Cas d’Étude 6 : Sécheresse Hydrologique Pluriannuelle & Déficit de Recharge Interannuel (Bassin de Lagdo)',
    titleEn: 'Case Study 6: Multi-Year Hydrological Drought & Reservoir Carry-Over Depletion (Lagdo RIN Basin)',
    category: 'PROLONGED_DROUGHT',
    isHypotheticalCalculation: true,
    cameroonContextFr:
      'Analyse de l’impact cumulatif lorsque la saison des pluies de juillet–septembre au Nord est déficitaire pendant deux années consécutives sur le réservoir de Lagdo.',
    cameroonContextEn:
      'Analysis of the cumulative impact when the July–September rainy season in Northern Cameroon underperforms across two consecutive years at Lake Lagdo.',
    engineeringParameters: [
      { label: 'Sécheresse Météorologique (Année N)', value: 'Pluviométrie de juillet–septembre inférieure de 30% à la normale' },
      { label: 'Sécheresse Hydrologique (Fin Septembre N)', value: 'Le lac de Lagdo ne se remplit qu’à 58% au lieu de 90%' },
      { label: 'Effet boule de neige (Mars–Juin N+1)', value: 'Cote proche de la tranche morte, chute nette réduite à 15,5 m (P_dispo ≤ 22 MW)' },
      { label: 'Coût économique de substitution', value: 'Brûlage intensif de gasoil (LFO) à Djamboutou et écrêtage de charge RIN' },
    ],
    causalChainFr: [
      'Un déficit de pluie de 30% produit une baisse de ruissellement de plus de 50% (les sols secs absorbent les premières pluies)',
      'Le réservoir entame la saison sèche d’octobre avec un déficit de stockage de plusieurs milliards de m³',
      'Même si des pluies précoces tombent en mai de l’année N+1, il faut plusieurs mois pour reconstituer le volume mort avant que la hauteur de chute nominale (22 m) ne soit rétablie',
    ],
    causalChainEn: [
      'A 30% rainfall deficit causes a >50% drop in catchment runoff because parched soils absorb initial precipitation',
      'The reservoir enters the October dry season with a multi-billion m³ storage deficit',
      'Even when early rains arrive the following May, months of inflow are required to replenish reservoir dead storage and restore nominal 22 m head',
    ],
    technicalConclusionFr:
      'Justifie l’urgence stratégique de l’interconnexion 225 kV RIS–RIN (pour secourir le Nord depuis la Sanaga) et des centrales solaires PV + stockage batterie (Guider/Maroua).',
    technicalConclusionEn:
      'Explains the strategic necessity of the 225 kV RIS–RIN interconnection (transferring Sanaga hydro power north) and utility-scale Solar PV + BESS.',
  },
];
