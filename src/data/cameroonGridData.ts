// src/data/cameroonGridData.ts
// EPEDE Layer 05 (Applications & Reference Cases) - Cameroon Power System Observatory
// Comprehensive technical registry of RIS, RIN, Interconnections, Hydro/Thermal generation plants,
// 225/90/30 kV substations, dispatching governance (SONATREL, Eneo, EDC, ARSEL)

import type { CalculatorTabType } from '../components/calculators/services/calculationReportService';
import type { SimulationTabType } from '../components/simulation/SimulationLabView';

export interface PowerPlantNode {
  id: string;
  code: string;
  name: string;
  type: 'hydro' | 'gas_thermal' | 'diesel_thermal' | 'solar_pv_bess' | 'reservoir';
  installed_capacity_mw: number;
  guaranteed_capacity_mw: number;
  voltage_kv: number;
  location: string;
  region: string;
  grid_system: 'RIS' | 'RIN' | 'ISOLATED';
  river_or_fuel?: string;
  units_description: string;
  commissioning_year: string;
  operator: string;
  technical_specs: {
    turbine_type?: string;
    nominal_flow_m3s?: number;
    head_meters?: number;
    alternator_speed_rpm?: number;
    power_factor?: number;
    storage_capacity?: string;
  };
  key_highlights_fr: string;
  key_highlights_en: string;
  relevant_calculator?: CalculatorTabType;
  relevant_simulation?: SimulationTabType;
}

export interface SubstationNode {
  id: string;
  code: string;
  name: string;
  voltage_levels: string; // e.g. "225 / 90 / 30 kV"
  grid_system: 'RIS' | 'RIN';
  region: string;
  city: string;
  bus_topology: 'double-bus' | 'single-bus-segmented' | 'ais-gis-hybrid' | 'generator-stepup';
  transformer_capacity_mva: string;
  short_circuit_level_ka: string;
  operator: string;
  function_description_fr: string;
  function_description_en: string;
  connected_lines: string[];
  protection_features: string[];
  associated_diagram_topology?: 'double-bus' | 'ais-gis-hybrid' | 'generator-stepup';
}

export interface TransmissionCorridor {
  id: string;
  code: string;
  name: string;
  voltage_kv: number;
  length_km: number;
  conductor_type: string;
  thermal_rating_mva: number;
  from_substation: string;
  to_substation: string;
  grid_system: 'RIS' | 'RIN' | 'INTERCONNECTION';
  status: 'operational' | 'under_construction' | 'planned';
  notes_fr: string;
  notes_en: string;
}

export interface CameroonGridSummary {
  national_installed_capacity_mw: number;
  hydro_share_percent: number;
  thermal_gas_share_percent: number;
  solar_re_share_percent: number;
  peak_demand_mw: number;
  transmission_line_km_225kv: number;
  transmission_line_km_110kv: number;
  transmission_line_km_90kv: number;
  tso_operator: string;
  distribution_concessionaire: string;
  asset_management_authority: string;
  sector_regulator: string;
}

export const CAMEROON_GRID_SUMMARY: CameroonGridSummary = {
  national_installed_capacity_mw: 2050, // Including Nachtigal phased commissioning
  hydro_share_percent: 68.5,
  thermal_gas_share_percent: 28.5,
  solar_re_share_percent: 3.0,
  peak_demand_mw: 1420,
  transmission_line_km_225kv: 2480,
  transmission_line_km_110kv: 450,
  transmission_line_km_90kv: 1650,
  tso_operator: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
  distribution_concessionaire: 'Eneo Cameroon S.A.',
  asset_management_authority: 'EDC (Electricity Development Corporation)',
  sector_regulator: 'ARSEL (Agence de Régulation du Secteur de l\'Électricité)'
};

export const CAMEROON_POWER_PLANTS: PowerPlantNode[] = [
  {
    id: 'plant-nachtigal',
    code: 'PLT-NH-420',
    name: 'Aménagement Hydroélectrique de Nachtigal Amont',
    type: 'hydro',
    installed_capacity_mw: 420,
    guaranteed_capacity_mw: 400,
    voltage_kv: 225,
    location: 'Nachtigal / Batchenga (Haute-Sanaga)',
    region: 'Centre',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Sanaga (régularisé par Lom Pangar)',
    units_description: '7 groupes turbo-alternateurs Francis de 60 MW chacun (chute 51,5 m)',
    commissioning_year: '2024 - 2025',
    operator: 'NHPC (Nachtigal Hydro Power Company) · Évacuation SONATREL',
    technical_specs: {
      turbine_type: 'Francis à axe vertical',
      nominal_flow_m3s: 980,
      head_meters: 51.5,
      alternator_speed_rpm: 187.5,
      power_factor: 0.9
    },
    key_highlights_fr: 'Plus grand aménagement hydroélectrique du Cameroun. Couvre à lui seul près de 30% des besoins énergétiques du Réseau Interconnecté Sud (RIS). Évacuation d\'énergie via une double ligne 225 kV vers le poste d\'interconnexion de Nyom II (Yaoundé).',
    key_highlights_en: 'Largest hydroelectric power plant in Cameroon, injecting 420 MW into the RIS grid. Boosts national power generation by over 30% via twin 225 kV transmission lines feeding the Nyom II substation.',
    relevant_calculator: 'transformer',
    relevant_simulation: 'transient-stability'
  },
  {
    id: 'plant-songloulou',
    code: 'PLT-SL-384',
    name: 'Centrale Hydroélectrique de Songloulou',
    type: 'hydro',
    installed_capacity_mw: 384,
    guaranteed_capacity_mw: 360,
    voltage_kv: 225,
    location: 'Massock-Songloulou (Sanaga-Maritime)',
    region: 'Littoral',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Sanaga',
    units_description: '8 groupes turbo-alternateurs Francis de 48 MW chacun',
    commissioning_year: '1981 (Phase 1) · 1988 (Phase 2)',
    operator: 'Eneo Cameroon · Transport SONATREL',
    technical_specs: {
      turbine_type: 'Francis à axe vertical',
      nominal_flow_m3s: 1100,
      head_meters: 39.5,
      alternator_speed_rpm: 150,
      power_factor: 0.85
    },
    key_highlights_fr: 'Pilier historique du réseau camerounais assurant le réglage primaire et secondaire de fréquence sur le RIS. Évacue son énergie vers le nœud stratégique de Mangombé (Édéa) en 225 kV.',
    key_highlights_en: 'Historical core of Cameroon\'s national grid, providing vital primary and secondary frequency support to the RIS. Transmits at 225 kV to the pivotal Mangombé substation.',
    relevant_calculator: 'ct-sizing',
    relevant_simulation: 'generator-capability'
  },
  {
    id: 'plant-edea',
    code: 'PLT-ED-276',
    name: 'Complexe Hydroélectrique d\'Édéa (Édéa I, II, III)',
    type: 'hydro',
    installed_capacity_mw: 276,
    guaranteed_capacity_mw: 240,
    voltage_kv: 90,
    location: 'Édéa (Sanaga-Maritime)',
    region: 'Littoral',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Sanaga',
    units_description: '14 groupes hydroélectriques (turbines Francis et Kaplan)',
    commissioning_year: '1953 (Édéa I) · 1958 (Édéa II) · 1975 (Édéa III)',
    operator: 'Eneo Cameroon',
    technical_specs: {
      turbine_type: 'Francis & Kaplan',
      nominal_flow_m3s: 1200,
      head_meters: 24.0,
      alternator_speed_rpm: 166.7,
      power_factor: 0.85
    },
    key_highlights_fr: 'Doyen des aménagements hydroélectriques camerounais, historiquement dédié à l\'alimentation des cuves d\'électrolyse d\'aluminium ALUCAM et à la desserte de la zone industrielle de Douala via le réseau 90 kV.',
    key_highlights_en: 'Cameroon\'s pioneer hydroelectric complex, historically supplying the ALUCAM aluminium smelter and powering Douala\'s manufacturing hubs at 90 kV.',
    relevant_calculator: 'voltage-drop',
    relevant_simulation: 'transformer'
  },
  {
    id: 'plant-memveele',
    code: 'PLT-MV-211',
    name: 'Centrale Hydroélectrique de Memve\'ele',
    type: 'hydro',
    installed_capacity_mw: 211,
    guaranteed_capacity_mw: 180,
    voltage_kv: 225,
    location: 'Nyabizan (Vallée du Ntem)',
    region: 'Sud',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Ntem',
    units_description: '4 groupes Francis de 52,75 MW chacun',
    commissioning_year: '2019 - 2022',
    operator: 'EDC · Exploitation Eneo · Transport SONATREL',
    technical_specs: {
      turbine_type: 'Francis',
      nominal_flow_m3s: 600,
      head_meters: 35.0,
      alternator_speed_rpm: 187.5,
      power_factor: 0.9
    },
    key_highlights_fr: 'Aménagement hydroélectrique majeur du sud Cameroun. Évacue son énergie via une ligne haute tension 225 kV de 290 km traversant Ebolowa jusqu\'au poste d\'Ahala à Yaoundé.',
    key_highlights_en: 'Major hydro power scheme in southern Cameroon, delivering 211 MW via a 290 km 225 kV transmission artery to the Ahala substation in Yaoundé.',
    relevant_calculator: 'earthing',
    relevant_simulation: 'coordination'
  },
  {
    id: 'plant-kribi-gas',
    code: 'PLT-KB-216',
    name: 'Centrale Thermique au Gaz Naturel de Kribi (KPDC)',
    type: 'gas_thermal',
    installed_capacity_mw: 216,
    guaranteed_capacity_mw: 216,
    voltage_kv: 225,
    location: 'Mpolongwe / Kribi (Océan)',
    region: 'Sud',
    grid_system: 'RIS',
    river_or_fuel: 'Gaz naturel offshore Sanaga Sud (SNH / Perenco)',
    units_description: '13 moteurs à combustion interne gaz Wärtsilä 18V50DF (16,6 MW unitaire)',
    commissioning_year: '2013',
    operator: 'Globeleq / KPDC (Kribi Power Development Company)',
    technical_specs: {
      turbine_type: 'Moteurs alternatifs quadri-temps gaz',
      nominal_flow_m3s: 0,
      power_factor: 0.85
    },
    key_highlights_fr: 'Plus grande centrale thermique gaz d\'Afrique centrale, assurant la stabilité de base et le secours thermique du RIS pendant les étiages de la Sanaga. Évacuation 225 kV vers le poste de Mangombé (Édéa).',
    key_highlights_en: 'Central Africa\'s largest natural gas power plant, providing critical baseload and dry season firming to the RIS via a 225 kV interconnector to Mangombé.',
    relevant_calculator: 'transformer',
    relevant_simulation: 'transient-stability'
  },
  {
    id: 'plant-lom-pangar',
    code: 'PLT-LP-30',
    name: 'Barrage-Réservoir & Usine Hydroélectrique de Lom Pangar',
    type: 'reservoir',
    installed_capacity_mw: 30,
    guaranteed_capacity_mw: 30,
    voltage_kv: 90,
    location: 'Lom Pangar (Lom-et-Djérem)',
    region: 'Est',
    grid_system: 'ISOLATED', // Electrifies the East region at 90 kV
    river_or_fuel: 'Confluence fleuve Sanaga et rivière Lom',
    units_description: '4 groupes Kaplan de 7,5 MW + Réservoir de retenue de 6 milliards de m³',
    commissioning_year: '2016 (Barrage réservoir) · 2023 (Usine de pied)',
    operator: 'EDC (Electricity Development Corporation)',
    technical_specs: {
      turbine_type: 'Kaplan de pied de barrage',
      storage_capacity: '6 milliards de m³ de retenue d\'eau utile',
      nominal_flow_m3s: 1040 // Minimum guaranteed release flow
    },
    key_highlights_fr: 'Clé de voûte du système hydroélectrique camerounais : ce réservoir géant régularise le débit d\'étiage de la Sanaga à plus de 1 000 m³/s, permettant à Nachtigal, Songloulou et Édéa de fonctionner à pleine capacité toute l\'année. Son usine de pied électrifie toute la région de l\'Est (Bertoua).',
    key_highlights_en: 'Master hydrologic regulator of Cameroon: its 6-billion m³ reservoir guarantees a minimum dry-season flow of 1,040 m³/s, unlocking 1,000+ MW continuous generation on the Sanaga River, while its foot plant electrifies Bertoua.',
    relevant_calculator: 'earthing',
    relevant_simulation: 'transformer'
  },
  {
    id: 'plant-lagdo',
    code: 'PLT-LG-72',
    name: 'Centrale Hydroélectrique de Lagdo',
    type: 'hydro',
    installed_capacity_mw: 72,
    guaranteed_capacity_mw: 40,
    voltage_kv: 110,
    location: 'Lagdo / Garoua (Bénoué)',
    region: 'Nord',
    grid_system: 'RIN',
    river_or_fuel: 'Fleuve Bénoué',
    units_description: '4 groupes Kaplan de 18 MW chacun',
    commissioning_year: '1982',
    operator: 'Eneo Cameroon · Transport SONATREL',
    technical_specs: {
      turbine_type: 'Kaplan à axe vertical',
      nominal_flow_m3s: 350,
      head_meters: 22.0,
      alternator_speed_rpm: 150,
      power_factor: 0.85
    },
    key_highlights_fr: 'Poumon énergétique unique du Réseau Interconnecté Nord (RIN). Alimente les trois régions septentrionales (Adamaoua, Nord, Extrême-Nord) via le réseau 110 kV et 90 kV vers Garoua, Maroua et Ngaoundéré.',
    key_highlights_en: 'Sole major hydro pillar of the Northern Interconnected Grid (RIN), supplying 110 kV and 90 kV power to Garoua, Maroua, and Ngaoundéré.',
    relevant_calculator: 'ct-sizing',
    relevant_simulation: 'transient-stability'
  },
  {
    id: 'plant-guider-maroua-solar',
    code: 'PLT-GM-30',
    name: 'Centrales Hybrides Solaires PV + Stockage BESS de Guider & Maroua',
    type: 'solar_pv_bess',
    installed_capacity_mw: 30, // 15 MW Guider + 15 MW Maroua
    guaranteed_capacity_mw: 30,
    voltage_kv: 30,
    location: 'Guider (Mayo-Louti) & Maroua (Diamaré)',
    region: 'Nord & Extrême-Nord',
    grid_system: 'RIN',
    river_or_fuel: 'Gisement solaire sahélien (2 200 kWh/m²/an)',
    units_description: '2 x 15 MWc PV au sol avec 2 x 10 MWh de batteries Li-ion LFP',
    commissioning_year: '2022 - 2023',
    operator: 'Scatec / Release / Eneo Cameroon',
    technical_specs: {
      storage_capacity: '20 MWh au total en conteneurs BESS Lithium-Fer-Phosphate',
      power_factor: 0.95
    },
    key_highlights_fr: 'Premières centrales photovoltaïques avec stockage par batteries à grande échelle au Cameroun. Permettent de compenser le déficit de Lagdo pendant les périodes d\'étiage et de stabiliser la tension MT à l\'extrémité du réseau.',
    key_highlights_en: 'Cameroon\'s benchmark utility-scale solar PV plus lithium battery storage plants, injecting fast reactive support and peak shaving into the northern grid.',
    relevant_calculator: 'arc-flash',
    relevant_simulation: 'coordination'
  },
  {
    id: 'plant-sosucam',
    code: 'PLT-BIO-SOS',
    name: 'Centrale de Cogénération Biomasse Bagasse de la SOSUCAM',
    type: 'diesel_thermal',
    installed_capacity_mw: 12.5,
    guaranteed_capacity_mw: 10,
    voltage_kv: 30,
    location: 'Mbandjock & Nkoteng (Haute-Sanaga)',
    region: 'Centre',
    grid_system: 'RIS',
    river_or_fuel: 'Bagasse de canne à sucre (résidu agro-industriel)',
    units_description: 'Chaudières haute pression et turbo-alternateurs à contrepression 5,5 kV / 30 kV',
    commissioning_year: '1968 (Modernisée 2018)',
    operator: 'SOSUCAM (Groupe SOMDIAA) · Raccordement Eneo',
    technical_specs: {
      turbine_type: 'Turbine à vapeur à contrepression',
      power_factor: 0.85
    },
    key_highlights_fr: 'Plus importante unité de cogénération biomasse du Cameroun. Valorise 100% des résidus de canne à sucre pour l\'autosuffisance énergétique des sucreries et injecte jusqu\'à 5 MW d\'énergie verte excédentaire sur le réseau 30 kV Eneo.',
    key_highlights_en: 'Cameroon\'s premier agro-industrial biomass cogeneration plant. Generates 12.5 MW from sugarcane bagasse, powering sugar refineries and exporting excess clean power to the 30 kV local grid.',
    relevant_calculator: 'power',
    relevant_simulation: 'motor-start'
  },
  {
    id: 'plant-dibamba',
    code: 'PLT-TH-DIB',
    name: 'Centrale Thermique Fioul Lourd de Dibamba (Yassa)',
    type: 'diesel_thermal',
    installed_capacity_mw: 86,
    guaranteed_capacity_mw: 86,
    voltage_kv: 90,
    location: 'Dibamba / Yassa (Douala Est)',
    region: 'Littoral',
    grid_system: 'RIS',
    river_or_fuel: 'Fioul lourd (HFO) / Dual-Fuel Gas Ready',
    units_description: '8 groupes motogénérateurs Wärtsilä 18V50DF de 10,75 MW chacun',
    commissioning_year: '2009',
    operator: 'Dibamba Power Development Company (DPDC) / Globeleq',
    technical_specs: {
      alternator_speed_rpm: 500,
      power_factor: 0.85
    },
    key_highlights_fr: 'Centrale thermique de pointe et de secours stratégique pour la mégapole de Douala. Assure le soutien de tension 90 kV lors des pointes de charge et en cas d\'indisponibilité ou d\'étiage sur la Sanaga.',
    key_highlights_en: 'Strategic 86 MW heavy fuel oil peaker plant for Douala metropolis, providing critical 90 kV voltage support and rapid dispatch during dry season or hydro contingency.',
    relevant_calculator: 'transformer',
    relevant_simulation: 'generator-capability'
  }
];

export const CAMEROON_SUBSTATIONS: SubstationNode[] = [
  {
    id: 'sub-mangombe',
    code: 'SUB-MGB-225',
    name: 'Poste Interconnexion de Mangombé (Édéa)',
    voltage_levels: '225 / 90 / 15 kV',
    grid_system: 'RIS',
    region: 'Littoral',
    city: 'Édéa',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 x 100 MVA (Autotransformateurs 225/90 kV) + 1 x 60 MVA',
    short_circuit_level_ka: '31.5 kA (Ik" sous 225 kV)',
    operator: 'SONATREL',
    function_description_fr: 'Carrefour névralgique de transport du Cameroun : reçoit l\'énergie de Songloulou (225 kV), Édéa (90 kV) et Kribi (225 kV), et la redistribue vers Douala (Bekoko, Logbaba) et Yaoundé (Ahala).',
    function_description_en: 'The nerve center of Cameroon\'s transmission backbone: aggregates bulk power from Songloulou, Édéa, and Kribi, dispatching it to Douala and Yaoundé.',
    connected_lines: [
      'Ligne 225 kV Mangombé - Songloulou (Double terne)',
      'Ligne 225 kV Mangombé - Ahala (Yaoundé)',
      'Ligne 225 kV Mangombé - Bekoko (Douala Ouest)',
      'Ligne 225 kV Mangombé - Kribi Gaz',
      'Lignes 90 kV vers Logbaba, ALUCAM et Édéa'
    ],
    protection_features: [
      'Protection de distance numérique ANSI 21 avec téléaction OPGW',
      'Protection différentielle de jeu de barres ANSI 87B décentralisée',
      'Protection différentielle autotransformateur ANSI 87T avec retenue d\'harmoniques 2 et 5'
    ],
    associated_diagram_topology: 'double-bus'
  },
  {
    id: 'sub-ahala',
    code: 'SUB-AHL-225',
    name: 'Poste Stratégique d\'Ahala (Yaoundé Sud)',
    voltage_levels: '225 / 90 / 30 kV',
    grid_system: 'RIS',
    region: 'Centre',
    city: 'Yaoundé',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 x 100 MVA (225/90 kV) + 2 x 36 MVA (90/30 kV)',
    short_circuit_level_ka: '25 kA',
    operator: 'SONATREL',
    function_description_fr: 'Porte d\'entrée principale de l\'énergie à Yaoundé : reçoit la ligne 225 kV depuis Mangombé et la ligne 225 kV depuis Memve\'ele. Alimente la boucle 90 kV urbaine (Oyomabang, Kondengui, Ngousso).',
    function_description_en: 'Primary 225 kV bulk feeding point for the Yaoundé capital metropolis, receiving lines from Mangombé and Memve\'ele to supply the city\'s 90 kV ring.',
    connected_lines: [
      'Ligne 225 kV Mangombé - Ahala',
      'Ligne 225 kV Memve\'ele - Ahala (via Ebolowa)',
      'Lignes 90 kV vers Oyomabang, Kondengui et Bafoussam'
    ],
    protection_features: [
      'Relais de distance ANSI 21 quadri-zones avec réenclenchement monophasé',
      'Délestage fréquentiel UFLS (ANSI 81U) à 49.2 Hz / 48.8 Hz'
    ],
    associated_diagram_topology: 'double-bus'
  },
  {
    id: 'sub-bekoko',
    code: 'SUB-BKK-225',
    name: 'Poste d\'Interconnexion de Bekoko (Douala Ouest)',
    voltage_levels: '225 / 90 / 30 kV',
    grid_system: 'RIS',
    region: 'Littoral',
    city: 'Douala',
    bus_topology: 'ais-gis-hybrid',
    transformer_capacity_mva: '2 x 100 MVA (225/90 kV) + 2 x 50 MVA (90/30 kV)',
    short_circuit_level_ka: '31.5 kA',
    operator: 'SONATREL',
    function_description_fr: 'Hub de transit stratégique vers l\'Ouest du Cameroun et le corridor industriel de Douala Nord. Point de départ de la future interconnexion 225 kV vers Bafoussam et Bamenda.',
    function_description_en: 'Key interconnection hub feeding western Cameroon and Douala\'s booming industrial belt. Launchpad for the 225 kV line to the West Region.',
    connected_lines: [
      'Ligne 225 kV Mangombé - Bekoko',
      'Ligne 90 kV vers Bonabéri et Limbe',
      'Future ligne 225 kV Bekoko - Bafoussam'
    ],
    protection_features: [
      'Disjoncteurs SF6 à commande unitaire',
      'Protection différentielle transformateurs ANSI 87T',
      'Contrôle-commande numérique CEI 61850'
    ],
    associated_diagram_topology: 'ais-gis-hybrid'
  },
  {
    id: 'sub-nyom2',
    code: 'SUB-NY2-225',
    name: 'Poste d\'Évacuation de Nyom II (Yaoundé Nord)',
    voltage_levels: '225 / 30 kV',
    grid_system: 'RIS',
    region: 'Centre',
    city: 'Yaoundé',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 x 120 MVA (225/30 kV)',
    short_circuit_level_ka: '31.5 kA',
    operator: 'SONATREL',
    function_description_fr: 'Poste ultra-moderne conçu pour recevoir et injecter dans l\'agglomération de Yaoundé les 420 MW produits par le barrage de Nachtigal via une double ligne 225 kV.',
    function_description_en: 'State-of-the-art 225/30 kV substation constructed to receive the 420 MW hydro generation from Nachtigal Dam into northern Yaoundé.',
    connected_lines: [
      'Double ligne 225 kV Nachtigal - Nyom II (50 km)',
      'Boucle 225 kV Nyom II - Nomayos',
      'Départs distribution 30 kV Eneo'
    ],
    protection_features: [
      'Poste 100% numérique CEI 61850 avec bus de processus et bus de station',
      'Téléprotection optique différentielle de ligne ANSI 87L'
    ],
    associated_diagram_topology: 'double-bus'
  },
  {
    id: 'sub-logbaba',
    code: 'SUB-LGB-225',
    name: 'Poste Industriel de Logbaba (Douala Est)',
    voltage_levels: '225 / 90 / 30 kV',
    grid_system: 'RIS',
    region: 'Littoral',
    city: 'Douala',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 x 60 MVA (225/90 kV) + 3 x 36 MVA (90/30 kV)',
    short_circuit_level_ka: '31.5 kA',
    operator: 'SONATREL / Eneo',
    function_description_fr: 'Cœur de la distribution de la zone industrielle de Douala (Bassa, Ndokoti, Yassa). Concentre les charges industrielles les plus denses du pays.',
    function_description_en: 'Power heart of Douala\'s primary industrial sector (Bassa / Ndokoti), supplying Cameroon\'s heaviest manufacturing power demand.',
    connected_lines: [
      'Ligne 225 kV Mangombé - Logbaba',
      'Réseau 90 kV Douala Est',
      'Départs 30 kV souterrains industriels'
    ],
    protection_features: [
      'Protection sélective contre les surintensités ANSI 50/51 et directionnelle 67',
      'Surveillance thermique continue en ligne'
    ],
    associated_diagram_topology: 'double-bus'
  }
];

export const CAMEROON_TRANSMISSION_CORRIDORS: TransmissionCorridor[] = [
  {
    id: 'line-mgb-ahl-225',
    code: 'TL-225-01',
    name: 'Artère 225 kV Mangombé (Édéa) - Ahala (Yaoundé)',
    voltage_kv: 225,
    length_km: 175,
    conductor_type: 'Almelec 570 mm² (Aster 570) avec câble de garde à fibre optique OPGW',
    thermal_rating_mva: 320,
    from_substation: 'Mangombé (Édéa)',
    to_substation: 'Ahala (Yaoundé)',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr: 'Ligne de transport la plus stratégique du pays : achemine la puissance hydroélectrique de la Sanaga vers la capitale politique Yaoundé.',
    notes_en: 'Most strategic transmission line in Cameroon, conveying Sanaga hydro power to the political capital Yaoundé.'
  },
  {
    id: 'line-nh-ny2-225',
    code: 'TL-225-02',
    name: 'Double Ligne 225 kV Nachtigal - Nyom II',
    voltage_kv: 225,
    length_km: 50.8,
    conductor_type: 'Faisceau double Almelec 2 x 366 mm² avec OPGW 48 fibres',
    thermal_rating_mva: 650,
    from_substation: 'Poste Élévateur Nachtigal 225 kV',
    to_substation: 'Nyom II (Yaoundé)',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr: 'Évacuation intégrale des 420 MW de la centrale de Nachtigal. Conçue avec double circuit sur pylônes treillis métalliques lourds.',
    notes_en: 'Evacuates the full 420 MW from Nachtigal Dam with twin circuits on heavy galvanised steel lattice towers.'
  },
  {
    id: 'line-ris-rin-225',
    code: 'TL-225-03',
    name: 'Ligne d\'Interconnexion RIS - RIN 225 kV (Nachtigal - Bafoussam - Foumban - Tibati - Ngaoundéré)',
    voltage_kv: 225,
    length_km: 514,
    conductor_type: 'Almelec Aster 570 mm²',
    thermal_rating_mva: 300,
    from_substation: 'Nachtigal / Bafoussam',
    to_substation: 'Ngaoundéré (RIN)',
    grid_system: 'INTERCONNECTION',
    status: 'under_construction',
    notes_fr: 'Le méga-projet d\'unification du réseau national : relie pour la première fois dans l\'histoire le réseau Sud (RIS) et le réseau Nord (RIN), mettant fin au déficit chronique du grand Nord grâce aux excédents hydroélectriques du Sud.',
    notes_en: 'Historical national grid unification mega-project: bridges the southern RIS and northern RIN for the first time, solving the northern power crisis.'
  },
  {
    id: 'line-pimert-225',
    code: 'TL-225-04',
    name: 'Interconnexion Électrique Cameroun - Tchad 225 kV (Projet PIMERT)',
    voltage_kv: 225,
    length_km: 1024,
    conductor_type: 'Almelec Aster 366 mm² avec OPGW',
    thermal_rating_mva: 250,
    from_substation: 'Ngaoundéré - Garoua - Maroua',
    to_substation: 'N\'Djamena (Tchad)',
    grid_system: 'INTERCONNECTION',
    status: 'under_construction',
    notes_fr: 'Projet d\'intégration régionale financé par la Banque Mondiale et la BAD, permettant d\'exporter jusqu\'à 100 MW d\'hydroélectricité camerounaise vers le Tchad voisin.',
    notes_en: 'Regional power pool project exporting up to 100 MW of Cameroon green hydro to neighboring Chad via N\'Djamena.'
  }
];
