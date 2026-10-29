// src/data/cameroonGridData.ts
// EPEDE Layer 05 (Applications & Reference Cases) - Cameroon Power System Observatory
// Comprehensive technical registry of RIS, RIN, Interconnections, Hydro/Thermal generation plants,
// 225/90/30 kV substations, dispatching governance (SONATREL, Eneo, EDC, ARSEL) with Research Integrity & Source Attribution.

import type { CalculatorTabType } from '../components/calculators/services/calculationReportService';
import type { SimulationTabType } from '../components/simulation/SimulationLabView';
import type { DomainCode } from '../types/epede';

export type VerificationStatus =
  | 'CONFIRMED_PUBLIC_SOURCE'
  | 'UNDER_CONSTRUCTION_VERIFIED'
  | 'ENGINEERING_REFERENCE_MODEL';

export interface PowerPlantNode {
  id: string;
  code: string;
  name: string;
  name_en: string;
  type: 'hydro' | 'gas_thermal' | 'diesel_thermal' | 'solar_pv_bess' | 'reservoir';
  installed_capacity_mw: number;
  guaranteed_capacity_mw: number;
  voltage_kv: number;
  location: string;
  region: string;
  grid_system: 'RIS' | 'RIN' | 'ISOLATED';
  river_or_fuel?: string;
  river_or_fuel_en?: string;
  units_description: string;
  units_description_en: string;
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
  verification_status: VerificationStatus;
  source_citation: string;
  source_date: string;
  related_domains: DomainCode[];
  relevant_calculator?: CalculatorTabType;
  relevant_simulation?: SimulationTabType;
}

export interface SubstationNode {
  id: string;
  code: string;
  name: string;
  name_en: string;
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
  connected_lines_en: string[];
  protection_features: string[];
  protection_features_en: string[];
  verification_status: VerificationStatus;
  source_citation: string;
  source_date: string;
  engineering_note_en: string;
  engineering_note_fr: string;
  related_domains: DomainCode[];
  associated_diagram_topology?: 'double-bus' | 'ais-gis-hybrid' | 'generator-stepup';
}

export interface TransmissionCorridor {
  id: string;
  code: string;
  name: string;
  name_en: string;
  voltage_kv: number;
  length_km: number;
  conductor_type: string;
  conductor_type_en: string;
  thermal_rating_mva: number;
  from_substation: string;
  to_substation: string;
  grid_system: 'RIS' | 'RIN' | 'INTERCONNECTION';
  status: 'operational' | 'under_construction' | 'planned';
  notes_fr: string;
  notes_en: string;
  verification_status: VerificationStatus;
  source_citation: string;
  source_date: string;
  related_domains: DomainCode[];
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
  source_attribution: string;
  last_updated: string;
}

export const CAMEROON_GRID_SUMMARY: CameroonGridSummary = {
  national_installed_capacity_mw: 2050, // Including Nachtigal 420 MW commissioning (2024-2025)
  hydro_share_percent: 68.5,
  thermal_gas_share_percent: 28.5,
  solar_re_share_percent: 3.0,
  peak_demand_mw: 1420,
  transmission_line_km_225kv: 2480,
  transmission_line_km_110kv: 450,
  transmission_line_km_90kv: 1650,
  tso_operator: 'SONATREL (Société Nationale de Transport de l’Électricité)',
  distribution_concessionaire: 'Eneo Cameroon S.A.',
  asset_management_authority: 'EDC (Electricity Development Corporation)',
  sector_regulator: 'ARSEL (Agence de Régulation du Secteur de l’Électricité)',
  source_attribution: 'MINEE / ARSEL / SONATREL / Eneo Cameroon / NHPC Official Sector Reports',
  last_updated: '2025-Q1',
};

export const CAMEROON_POWER_PLANTS: PowerPlantNode[] = [
  {
    id: 'plant-nachtigal',
    code: 'PLT-NH-420',
    name: 'Aménagement Hydroélectrique de Nachtigal Amont',
    name_en: 'Nachtigal Upstream Hydroelectric Power Station',
    type: 'hydro',
    installed_capacity_mw: 420,
    guaranteed_capacity_mw: 400,
    voltage_kv: 225,
    location: 'Nachtigal / Batchenga (Haute-Sanaga)',
    region: 'Centre',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Sanaga (régularisé par Lom Pangar)',
    river_or_fuel_en: 'Sanaga River (regulated by Lom Pangar reservoir)',
    units_description: '7 groupes hydro-alternateurs Francis de 60 MW chacun (chute 51,5 m)',
    units_description_en: '7 × 60 MW vertical-axis Francis hydro-alternator units (51.5 m net head)',
    commissioning_year: '2024 - 2025',
    operator: 'NHPC (Nachtigal Hydro Power Company) · Grid Evacuation: SONATREL',
    technical_specs: {
      turbine_type: 'Vertical Francis',
      nominal_flow_m3s: 980,
      head_meters: 51.5,
      alternator_speed_rpm: 187.5,
      power_factor: 0.9,
    },
    key_highlights_fr:
      'Plus grand aménagement hydroélectrique du Cameroun. Couvre à lui seul près de 30% des besoins énergétiques du Réseau Interconnecté Sud (RIS). Évacuation d’énergie via une double ligne 225 kV (50 km) vers le poste d’interconnexion de Nyom II (Yaoundé).',
    key_highlights_en:
      'Largest hydroelectric power station in Cameroon (run-of-river scheme on the Sanaga River), injecting 420 MW into the Southern Interconnected Grid (RIS) via a 50 km double-circuit 225 kV transmission line to the Nyom II substation (Yaoundé).',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'NHPC (Nachtigal Hydro Power Company), EDF & World Bank Project Documentation',
    source_date: '2024–2025',
    related_domains: ['D01', 'D03', 'D04', 'D11'],
    relevant_calculator: 'transformer',
    relevant_simulation: 'transient-stability',
  },
  {
    id: 'plant-songloulou',
    code: 'PLT-SL-384',
    name: 'Centrale Hydroélectrique de Songloulou',
    name_en: 'Songloulou Hydroelectric Power Station',
    type: 'hydro',
    installed_capacity_mw: 384,
    guaranteed_capacity_mw: 360,
    voltage_kv: 225,
    location: 'Massock-Songloulou (Sanaga-Maritime)',
    region: 'Littoral',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Sanaga',
    river_or_fuel_en: 'Sanaga River',
    units_description: '8 groupes hydro-alternateurs Francis de 48 MW chacun',
    units_description_en: '8 × 48 MW vertical Francis hydro-alternator units',
    commissioning_year: '1981 (Phase 1) · 1988 (Phase 2)',
    operator: 'Eneo Cameroon · Transmission: SONATREL',
    technical_specs: {
      turbine_type: 'Vertical Francis',
      nominal_flow_m3s: 1100,
      head_meters: 39.5,
      alternator_speed_rpm: 150,
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Pilier historique du réseau camerounais assurant le réglage primaire et secondaire de fréquence sur le RIS. Évacue son énergie vers le nœud stratégique de Mangombé (Édéa) en 225 kV.',
    key_highlights_en:
      'Historical backbone of Cameroon’s Southern Interconnected Grid (RIS), providing primary and secondary frequency regulation and evacuating bulk power at 225 kV to the Mangombé hub in Edéa.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Eneo Cameroon S.A. Generation Fleet Registry & ARSEL Reports',
    source_date: '2023',
    related_domains: ['D01', 'D02', 'D04', 'D11'],
    relevant_calculator: 'ct-sizing',
    relevant_simulation: 'generator-capability',
  },
  {
    id: 'plant-edea',
    code: 'PLT-ED-276',
    name: 'Complexe Hydroélectrique d’Édéa (Édéa I, II, III)',
    name_en: 'Edéa Hydroelectric Complex (Edéa I, II, III)',
    type: 'hydro',
    installed_capacity_mw: 276,
    guaranteed_capacity_mw: 240,
    voltage_kv: 90,
    location: 'Édéa (Sanaga-Maritime)',
    region: 'Littoral',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Sanaga',
    river_or_fuel_en: 'Sanaga River',
    units_description: '14 groupes hydroélectriques (turbines Francis et Kaplan)',
    units_description_en: '14 hydroelectric generating units (Francis & Kaplan turbines)',
    commissioning_year: '1953 (Edéa I) · 1958 (Edéa II) · 1975 (Edéa III)',
    operator: 'Eneo Cameroon',
    technical_specs: {
      turbine_type: 'Francis & Kaplan',
      nominal_flow_m3s: 1200,
      head_meters: 24.0,
      alternator_speed_rpm: 166.7,
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Doyen des aménagements hydroélectriques camerounais, historiquement dédié à l’alimentation des cuves d’électrolyse d’aluminium ALUCAM et à la desserte de la zone industrielle de Douala via le réseau 90 kV.',
    key_highlights_en:
      'Cameroon’s pioneer hydroelectric complex on the lower Sanaga River, historically supplying the ALUCAM aluminium smelter and feeding the Douala industrial load center at 90 kV.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Eneo Cameroon S.A. Historical & Technical Asset Documentation',
    source_date: '2023',
    related_domains: ['D01', 'D03', 'D06'],
    relevant_calculator: 'voltage-drop',
    relevant_simulation: 'transformer',
  },
  {
    id: 'plant-memveele',
    code: 'PLT-MV-211',
    name: 'Centrale Hydroélectrique de Memve’ele',
    name_en: 'Memve’ele Hydroelectric Power Station',
    type: 'hydro',
    installed_capacity_mw: 211,
    guaranteed_capacity_mw: 180,
    voltage_kv: 225,
    location: 'Nyabizan (Ntem Valley)',
    region: 'Sud',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Ntem',
    river_or_fuel_en: 'Ntem River',
    units_description: '4 groupes Francis de 52,75 MW chacun',
    units_description_en: '4 × 52.75 MW vertical Francis generating units',
    commissioning_year: '2019 - 2022',
    operator: 'EDC · Operations: Eneo · Transmission: SONATREL',
    technical_specs: {
      turbine_type: 'Francis',
      nominal_flow_m3s: 600,
      head_meters: 35.0,
      alternator_speed_rpm: 187.5,
      power_factor: 0.9,
    },
    key_highlights_fr:
      'Aménagement hydroélectrique majeur du sud Cameroun. Évacue son énergie via une ligne haute tension 225 kV d’environ 290 km traversant Ebolowa jusqu’au poste d’Ahala à Yaoundé.',
    key_highlights_en:
      'Major hydroelectric facility in Southern Cameroon on the Ntem River, evacuating power via a ~290 km 225 kV transmission corridor through Ebolowa to the Ahala substation in Yaoundé.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'EDC (Electricity Development Corporation) & AfDB Project Reports',
    source_date: '2022–2023',
    related_domains: ['D01', 'D03', 'D04'],
    relevant_calculator: 'earthing',
    relevant_simulation: 'coordination',
  },
  {
    id: 'plant-kribi-gas',
    code: 'PLT-KB-216',
    name: 'Centrale Thermique au Gaz Naturel de Kribi (KPDC)',
    name_en: 'Kribi Natural Gas Thermal Power Plant (KPDC)',
    type: 'gas_thermal',
    installed_capacity_mw: 216,
    guaranteed_capacity_mw: 216,
    voltage_kv: 225,
    location: 'Mpolongwe / Kribi (Océan)',
    region: 'Sud',
    grid_system: 'RIS',
    river_or_fuel: 'Gaz naturel offshore Sanaga Sud (SNH / Perenco)',
    river_or_fuel_en: 'Offshore Sanaga South Natural Gas (SNH / Perenco)',
    units_description: '13 moteurs à combustion interne gaz Wärtsilä 18V50DF (16,6 MW unitaire)',
    units_description_en: '13 × 16.6 MW Wärtsilä 18V50DF dual-fuel reciprocating gas engines',
    commissioning_year: '2013',
    operator: 'Globeleq / KPDC (Kribi Power Development Company)',
    technical_specs: {
      turbine_type: 'Four-stroke reciprocating gas engines',
      nominal_flow_m3s: 0,
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Plus grande centrale thermique gaz d’Afrique centrale, assurant la stabilité de base et le secours thermique du RIS pendant les étiages de la Sanaga. Évacuation 225 kV vers le poste de Mangombé (Édéa).',
    key_highlights_en:
      'Central Africa’s largest natural gas thermal power plant, providing dispatchable baseload and dry-season firming to the RIS via a 100 km 225 kV transmission line to Mangombé (Edéa).',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Globeleq / KPDC & IFC Project Disclosure Documents',
    source_date: '2023',
    related_domains: ['D01', 'D03', 'D11'],
    relevant_calculator: 'transformer',
    relevant_simulation: 'transient-stability',
  },
  {
    id: 'plant-lom-pangar',
    code: 'PLT-LP-30',
    name: 'Barrage-Réservoir & Usine Hydroélectrique de Lom Pangar',
    name_en: 'Lom Pangar Regulating Dam & Foot Power Station',
    type: 'reservoir',
    installed_capacity_mw: 30,
    guaranteed_capacity_mw: 30,
    voltage_kv: 90,
    location: 'Lom Pangar (Lom-et-Djérem)',
    region: 'Est',
    grid_system: 'ISOLATED',
    river_or_fuel: 'Confluence fleuve Sanaga et rivière Lom',
    river_or_fuel_en: 'Lom River / Sanaga River Basin Confluence',
    units_description: '4 groupes Kaplan de 7,5 MW + Réservoir de retenue de 6 milliards de m³',
    units_description_en: '4 × 7.5 MW Kaplan units + 6 billion m³ regulating reservoir',
    commissioning_year: '2016 (Reservoir Dam) · 2023 (Toe Powerhouse)',
    operator: 'EDC (Electricity Development Corporation)',
    technical_specs: {
      turbine_type: 'Kaplan toe powerhouse',
      storage_capacity: '6 billion m³ multi-year regulating reservoir',
      nominal_flow_m3s: 1040,
    },
    key_highlights_fr:
      'Clé de voûte du système hydroélectrique camerounais : ce réservoir de 6 milliards de m³ régularise le débit de la Sanaga, sécurisant la production de Nachtigal, Songloulou et Édéa en saison sèche, tandis que son usine de pied (30 MW) alimente Bertoua et la région de l’Est en 90 kV.',
    key_highlights_en:
      'Hydrological cornerstone of the Sanaga cascade: its 6-billion m³ reservoir regulates dry-season flow for downstream stations (Nachtigal, Songloulou, Edéa), while its 30 MW toe powerhouse supplies Bertoua and the East Region via a 90 kV line.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'EDC (Electricity Development Corporation) & World Bank / AFD Reports',
    source_date: '2023–2024',
    related_domains: ['D01', 'D02', 'D05'],
    relevant_calculator: 'earthing',
    relevant_simulation: 'transformer',
  },
  {
    id: 'plant-lagdo',
    code: 'PLT-LG-72',
    name: 'Centrale Hydroélectrique de Lagdo',
    name_en: 'Lagdo Hydroelectric Power Station',
    type: 'hydro',
    installed_capacity_mw: 72,
    guaranteed_capacity_mw: 40,
    voltage_kv: 110,
    location: 'Lagdo / Garoua (Bénoué)',
    region: 'Nord',
    grid_system: 'RIN',
    river_or_fuel: 'Fleuve Bénoué',
    river_or_fuel_en: 'Benue River',
    units_description: '4 groupes Kaplan de 18 MW chacun',
    units_description_en: '4 × 18 MW vertical Kaplan generating units',
    commissioning_year: '1982',
    operator: 'Eneo Cameroon · Transmission: SONATREL',
    technical_specs: {
      turbine_type: 'Vertical Kaplan',
      nominal_flow_m3s: 350,
      head_meters: 22.0,
      alternator_speed_rpm: 150,
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Principal aménagement hydroélectrique du Réseau Interconnecté Nord (RIN). Alimente les régions de l’Adamaoua, du Nord et de l’Extrême-Nord via les artères 110 kV et 90 kV vers Garoua, Maroua et Ngaoundéré.',
    key_highlights_en:
      'Primary hydroelectric anchor of the Northern Interconnected Grid (RIN), supplying Adamaoua, North, and Far-North regions via 110 kV and 90 kV transmission lines to Garoua, Maroua, and Ngaoundéré.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Eneo Cameroon S.A. & MINEE Sector Reports (Rehabilitation program ongoing)',
    source_date: '2023',
    related_domains: ['D01', 'D02', 'D03'],
    relevant_calculator: 'ct-sizing',
    relevant_simulation: 'transient-stability',
  },
  {
    id: 'plant-guider-maroua-solar',
    code: 'PLT-GM-30',
    name: 'Centrales Hybrides Solaires PV + Stockage BESS de Guider & Maroua',
    name_en: 'Guider & Maroua Solar PV + BESS Hybrid Plants',
    type: 'solar_pv_bess',
    installed_capacity_mw: 30,
    guaranteed_capacity_mw: 30,
    voltage_kv: 30,
    location: 'Guider (Mayo-Louti) & Maroua (Diamaré)',
    region: 'Nord & Extrême-Nord',
    grid_system: 'RIN',
    river_or_fuel: 'Gisement solaire sahélien (~2 200 kWh/m²/an)',
    river_or_fuel_en: 'Sahelian solar irradiation (~2,200 kWh/m²/year)',
    units_description: 'Modular solar PV arrays (~30 MWp combined) with containerized Li-ion BESS (~19 MWh)',
    units_description_en: 'Modular utility-scale solar PV (~30 MWp combined) with containerized LFP BESS (~19 MWh)',
    commissioning_year: '2022 - 2023',
    operator: 'Release by Scatec / Eneo Cameroon',
    technical_specs: {
      storage_capacity: '~19–20 MWh containerized Lithium-Iron-Phosphate (LFP) BESS',
      power_factor: 0.95,
    },
    key_highlights_fr:
      'Premières centrales photovoltaïques modulaires avec stockage par batteries à grande échelle sur le réseau Nord (RIN), atténuant le déficit hydrologique de Lagdo et soutenant le plan de tension 30 kV.',
    key_highlights_en:
      'Cameroon’s first utility-scale modular solar PV and battery energy storage systems (BESS) on the Northern Interconnected Grid (RIN), mitigating hydrological variability at Lagdo and stabilizing 30 kV feeder voltage.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Eneo Cameroon & Scatec ASA Commissioning Releases',
    source_date: '2023',
    related_domains: ['D01', 'D10', 'D05'],
    relevant_calculator: 'arc-flash',
    relevant_simulation: 'coordination',
  },
  {
    id: 'plant-sosucam',
    code: 'PLT-BIO-SOS',
    name: 'Centrale de Cogénération Biomasse Bagasse de la SOSUCAM',
    name_en: 'SOSUCAM Bagasse Biomass Cogeneration Plant',
    type: 'diesel_thermal',
    installed_capacity_mw: 12.5,
    guaranteed_capacity_mw: 10,
    voltage_kv: 30,
    location: 'Mbandjock & Nkoteng (Haute-Sanaga)',
    region: 'Centre',
    grid_system: 'RIS',
    river_or_fuel: 'Bagasse de canne à sucre (résidu agro-industriel)',
    river_or_fuel_en: 'Sugarcane bagasse (agro-industrial biomass)',
    units_description: 'Chaudières haute pression et turbo-alternateurs à contrepression 5,5 kV / 30 kV',
    units_description_en: 'High-pressure biomass boilers and back-pressure steam turbo-alternators (5.5 kV / 30 kV)',
    commissioning_year: '1968 (Modernized 2018)',
    operator: 'SOSUCAM (SOMDIAA Group) · Grid Point: Eneo 30 kV',
    technical_specs: {
      turbine_type: 'Back-pressure steam turbine',
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Unité agro-industrielle de cogénération biomasse valorisant la bagasse de canne à sucre pour l’alimentation électrique et vapeur des sucreries de Mbandjock/Nkoteng.',
    key_highlights_en:
      'Agro-industrial biomass cogeneration facility utilizing sugarcane bagasse to supply process steam and electrical power to the Mbandjock and Nkoteng sugar complexes.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SOMDIAA / SOSUCAM Industrial Sustainability & ARSEL Autoproducer Reports',
    source_date: '2022',
    related_domains: ['D01', 'D05', 'D06'],
    relevant_calculator: 'power',
    relevant_simulation: 'motor-start',
  },
  {
    id: 'plant-dibamba',
    code: 'PLT-TH-DIB',
    name: 'Centrale Thermique Fioul Lourd de Dibamba (Yassa)',
    name_en: 'Dibamba Heavy Fuel Oil Thermal Power Plant (DPDC)',
    type: 'diesel_thermal',
    installed_capacity_mw: 86,
    guaranteed_capacity_mw: 86,
    voltage_kv: 90,
    location: 'Dibamba / Yassa (Douala East)',
    region: 'Littoral',
    grid_system: 'RIS',
    river_or_fuel: 'Fioul lourd (HFO) / Dual-Fuel Gas Ready',
    river_or_fuel_en: 'Heavy Fuel Oil (HFO) / Gas-ready reciprocating units',
    units_description: '8 groupes motogénérateurs Wärtsilä 18V50DF de 10,75 MW chacun',
    units_description_en: '8 × 10.75 MW Wärtsilä 18V50DF medium-speed generating sets',
    commissioning_year: '2009',
    operator: 'Dibamba Power Development Company (DPDC) / Globeleq',
    technical_specs: {
      alternator_speed_rpm: 500,
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Centrale thermique de pointe et de secours stratégique à l’entrée Est de Douala, connectée au réseau 90 kV (poste de Ngodi Bakoko / Logbaba).',
    key_highlights_en:
      'Strategic 86 MW thermal peaking and reserve plant located at eastern Douala (Yassa), connected at 90 kV to support voltage and peak load in the Douala industrial hub.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Globeleq / DPDC Technical Fact Sheet',
    source_date: '2023',
    related_domains: ['D01', 'D03', 'D04'],
    relevant_calculator: 'transformer',
    relevant_simulation: 'generator-capability',
  },
];

export const CAMEROON_SUBSTATIONS: SubstationNode[] = [
  {
    id: 'sub-mangombe',
    code: 'SUB-MGB-225',
    name: 'Poste d’Interconnexion de Mangombé (Édéa)',
    name_en: 'Mangombé 225/90 kV Interconnection Substation (Edéa)',
    voltage_levels: '225 / 90 / 15 kV',
    grid_system: 'RIS',
    region: 'Littoral',
    city: 'Edéa',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 × 100 MVA (225/90 kV Autotransformers) + 1 × 60 MVA (Representative Rating)',
    short_circuit_level_ka: '31.5 kA rated switchgear withstand (IEC 62271)',
    operator: 'SONATREL',
    function_description_fr:
      'Carrefour historique de transport du RIS : concentre les injections de Songloulou (225 kV), Édéa (90 kV) et Kribi (225 kV), et les répartit vers Douala (Bekoko, Logbaba) et Yaoundé (Ahala/Oyomabang).',
    function_description_en:
      'Central transmission hub of the Southern Interconnected Grid (RIS): aggregates bulk generation from Songloulou (225 kV), Edéa (90 kV), and Kribi (225 kV), dispatching power toward Douala and Yaoundé.',
    connected_lines: [
      'Ligne 225 kV Mangombé – Songloulou',
      'Ligne 225 kV Mangombé – Oyomabang / Ahala (Yaoundé)',
      'Ligne 225 kV Mangombé – Bekoko (Douala Ouest)',
      'Ligne 225 kV Mangombé – Kribi (KPDC)',
      'Artères 90 kV vers Logbaba, ALUCAM et Édéa',
    ],
    connected_lines_en: [
      '225 kV Mangombé – Songloulou Corridor',
      '225 kV Mangombé – Oyomabang / Ahala Corridor (Yaoundé)',
      '225 kV Mangombé – Bekoko Corridor (West Douala)',
      '225 kV Mangombé – Kribi Thermal Corridor',
      '90 kV Sub-transmission lines to Logbaba, ALUCAM, and Edéa',
    ],
    protection_features: [
      'Protection de distance numérique ANSI 21 avec téléprotection OPGW',
      'Protection différentielle de jeu de barres ANSI 87B',
      'Protection différentielle autotransformateur ANSI 87T',
    ],
    protection_features_en: [
      'Numerical distance protection (ANSI 21) with OPGW teleprotection',
      'Busbar differential protection (ANSI 87B)',
      'Autotransformer percentage differential protection (ANSI 87T)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL Grid Topology & MINEE / World Bank RIS Reinforcement Studies',
    source_date: '2023–2024',
    engineering_note_en:
      'Node location, voltage levels (225/90 kV), and connected corridors are confirmed from public SONATREL records. Exact MVA bay ratings and 31.5 kA short-circuit values represent standard engineering reference ratings.',
    engineering_note_fr:
      'Nœud, niveaux de tension (225/90 kV) et lignes raccordées confirmés (SONATREL). Les calibres MVA et Icc (31,5 kA) correspondent aux gabarits normatifs de référence.',
    related_domains: ['D03', 'D04', 'D11', 'D12'],
    associated_diagram_topology: 'double-bus',
  },
  {
    id: 'sub-ahala',
    code: 'SUB-AHL-225',
    name: 'Poste Source d’Ahala / Oyomabang (Yaoundé)',
    name_en: 'Ahala & Oyomabang 225/90/30 kV Substations (Yaoundé)',
    voltage_levels: '225 / 90 / 30 / 15 kV',
    grid_system: 'RIS',
    region: 'Centre',
    city: 'Yaoundé',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 × 100 MVA (225/90 kV) + 90/30/15 kV Distribution Transformers',
    short_circuit_level_ka: '25 – 31.5 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Nœuds principaux d’alimentation de la capitale Yaoundé : reçoivent le transit 225 kV depuis la Sanaga (Mangombé) et le Sud (Memve’ele) pour alimenter la boucle 90 kV urbaine (Oyomabang, Ahala, Kondengui, Ngousso, BRGM).',
    function_description_en:
      'Primary bulk supply substations for the capital city Yaoundé: receive 225 kV transmission corridors from Mangombé and Memve’ele and step down voltage to feed Yaoundé’s 90 kV urban ring and 30/15 kV distribution feeders.',
    connected_lines: [
      'Ligne 225 kV Mangombé – Oyomabang / Nomayos',
      'Ligne 225 kV Memve’ele – Ahala (via Ebolowa)',
      'Boucle 90 kV Yaoundé (Oyomabang – Ahala – Kondengui – Ngousso)',
    ],
    connected_lines_en: [
      '225 kV Mangombé – Oyomabang / Nomayos Corridor',
      '225 kV Memve’ele – Ahala Corridor (via Ebolowa)',
      '90 kV Yaoundé Urban Ring (Oyomabang – Ahala – Kondengui – Ngousso)',
    ],
    protection_features: [
      'Relais de distance ANSI 21 quadri-zones',
      'Délestage fréquentiel automatique UFLS (ANSI 81U)',
    ],
    protection_features_en: [
      'Quad-zone numerical distance relays (ANSI 21)',
      'Under-frequency load shedding scheme (ANSI 81U)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL / EDC Memve’ele Evacuation & Yaoundé Ring Documentation',
    source_date: '2023–2024',
    engineering_note_en:
      'Substation roles and 225/90/30/15 kV interconnections are confirmed public infrastructure data; relay settings and fault levels are pedagogical engineering models.',
    engineering_note_fr:
      'Rôle des postes et liaisons 225/90/30/15 kV confirmés ; les réglages de protection détaillés sont des modèles pédagogiques.',
    related_domains: ['D04', 'D05', 'D11', 'D12'],
    associated_diagram_topology: 'double-bus',
  },
  {
    id: 'sub-bekoko',
    code: 'SUB-BKK-225',
    name: 'Poste d’Interconnexion de Bekoko (Douala Ouest)',
    name_en: 'Bekoko 225/90/30 kV Interconnection Substation (West Douala)',
    voltage_levels: '225 / 90 / 30 kV',
    grid_system: 'RIS',
    region: 'Littoral',
    city: 'Douala (Bekoko)',
    bus_topology: 'ais-gis-hybrid',
    transformer_capacity_mva: '2 × 100 MVA (225/90 kV) + 90/30 kV bays',
    short_circuit_level_ka: '31.5 kA rated withstand',
    operator: 'SONATREL',
    function_description_fr:
      'Hub stratégique de l’ouest de Douala : alimente la zone industrielle de Bonabéri, le Sud-Ouest (Limbe/Tiko) et l’axe ouest (Nkongsamba / Bafoussam).',
    function_description_en:
      'Strategic western gateway for Greater Douala: supplies the Bonabéri industrial zone, the South-West corridor (Limbe), and the Western 90/225 kV corridor toward Bafoussam.',
    connected_lines: [
      'Ligne 225 kV Mangombé – Bekoko',
      'Lignes 90 kV vers Bonabéri, Njombé et Bafoussam',
      'Lignes 90 kV vers Tiko / Limbe',
    ],
    connected_lines_en: [
      '225 kV Mangombé – Bekoko Line',
      '90 kV Lines toward Bonabéri, Njombé, and Bafoussam',
      '90 kV Corridor toward Tiko / Limbe',
    ],
    protection_features: [
      'Disjoncteurs SF6 haute tension (CEI 62271-100)',
      'Protection différentielle transformateurs ANSI 87T',
      'Tranches numériques de contrôle-commande BCU',
    ],
    protection_features_en: [
      'SF6 high-voltage circuit breakers (IEC 62271-100)',
      'Transformer differential protection (ANSI 87T)',
      'Digital Bay Control Units (BCU)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & World Bank Electricity Transmission and Reform Project',
    source_date: '2023',
    engineering_note_en:
      'Confirmed SONATREL 225/90 kV node serving West Douala, South-West, and West Regions.',
    engineering_note_fr:
      'Nœud 225/90 kV SONATREL confirmé desservant Douala Ouest, le Sud-Ouest et l’Ouest.',
    related_domains: ['D03', 'D04', 'D11'],
    associated_diagram_topology: 'ais-gis-hybrid',
  },
  {
    id: 'sub-nyom2',
    code: 'SUB-NY2-225',
    name: 'Poste d’Évacuation de Nyom II (Yaoundé Nord)',
    name_en: 'Nyom II 225/30 kV Substation (North Yaoundé)',
    voltage_levels: '225 / 30 kV',
    grid_system: 'RIS',
    region: 'Centre',
    city: 'Yaoundé (Nyom II)',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 × 120 MVA (225/30 kV Reference Rating)',
    short_circuit_level_ka: '31.5 kA rated withstand',
    operator: 'SONATREL',
    function_description_fr:
      'Poste récepteur principal de la double ligne 225 kV issue de l’aménagement hydroélectrique de Nachtigal (420 MW) au nord de Yaoundé.',
    function_description_en:
      'Primary receiving substation at northern Yaoundé terminating the 50 km double-circuit 225 kV evacuation line from the 420 MW Nachtigal hydroelectric plant.',
    connected_lines: [
      'Double ligne 225 kV Nachtigal – Nyom II (~50 km)',
      'Liaison 225 kV vers la boucle de Yaoundé (Oyomabang / Nomayos)',
      'Départs distribution HTA 30 kV Eneo',
    ],
    connected_lines_en: [
      '225 kV Double-Circuit Nachtigal – Nyom II Line (~50 km)',
      '225 kV Link to Yaoundé Ring (Oyomabang / Nomayos)',
      '30 kV MV Distribution Feeders (Eneo)',
    ],
    protection_features: [
      'Contrôle-commande numérique CEI 61850',
      'Téléprotection différentielle de ligne ANSI 87L sur fibre OPGW',
    ],
    protection_features_en: [
      'IEC 61850 digital substation automation system (SAS)',
      'Line current differential protection (ANSI 87L) over OPGW fiber',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'NHPC & SONATREL Nachtigal Evacuation Project Documentation',
    source_date: '2024–2025',
    engineering_note_en:
      'Confirmed 225 kV receiving terminal for Nachtigal hydro power in northern Yaoundé.',
    engineering_note_fr:
      'Poste terminal 225 kV confirmé pour l’évacuation de Nachtigal au nord de Yaoundé.',
    related_domains: ['D01', 'D03', 'D04', 'D13'],
    associated_diagram_topology: 'double-bus',
  },
  {
    id: 'sub-logbaba',
    code: 'SUB-LGB-225',
    name: 'Poste Source de Logbaba (Douala Est)',
    name_en: 'Logbaba 225/90/30/15 kV Industrial Substation (East Douala)',
    voltage_levels: '225 / 90 / 30 / 15 kV',
    grid_system: 'RIS',
    region: 'Littoral',
    city: 'Douala (Logbaba)',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '225/90 kV & 90/30/15 kV High-Density Urban/Industrial Transformers',
    short_circuit_level_ka: '31.5 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Pôle majeur d’alimentation de la métropole économique Douala et des zones industrielles de Bassa, Ndokoti et Logbaba.',
    function_description_en:
      'Major bulk power supply node serving Cameroon’s economic capital Douala and the heavy manufacturing zones of Bassa, Ndokoti, and Logbaba.',
    connected_lines: [
      'Liaisons 225 kV & 90 kV depuis Mangombé / Dibamba',
      'Boucle 90 kV métropolitaine de Douala (Logbaba – Koumassi – Deïdo – Bassa)',
      'Départs HTA 30 kV et 15 kV industriels et urbains',
    ],
    connected_lines_en: [
      '225 kV & 90 kV Infeeds from Mangombé and Dibamba',
      '90 kV Douala Metropolitan Ring (Logbaba – Koumassi – Deïdo – Bassa)',
      '30 kV & 15 kV Industrial and Urban MV Feeders',
    ],
    protection_features: [
      'Protections numériques directionnelles et surintensité ANSI 50/51/67',
      'Protection différentielle de barres et transformateurs (ANSI 87B / 87T)',
    ],
    protection_features_en: [
      'Numerical overcurrent and directional relays (ANSI 50/51/67)',
      'Busbar and transformer differential protection (ANSI 87B / 87T)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & Eneo Douala Grid Modernization Reports',
    source_date: '2023–2024',
    engineering_note_en:
      'Confirmed major substation node in East Douala interfacing SONATREL HV transmission and Eneo MV distribution.',
    engineering_note_fr:
      'Poste majeur confirmé de Douala Est à l’interface transport SONATREL / distribution Eneo.',
    related_domains: ['D04', 'D05', 'D06', 'D11'],
    associated_diagram_topology: 'double-bus',
  },
];

export const CAMEROON_TRANSMISSION_CORRIDORS: TransmissionCorridor[] = [
  {
    id: 'line-mgb-ahl-225',
    code: 'TL-225-01',
    name: 'Artère 225 kV Mangombé (Édéa) – Oyomabang / Ahala (Yaoundé)',
    name_en: '225 kV Mangombé (Edéa) – Oyomabang / Ahala (Yaoundé) Corridor',
    voltage_kv: 225,
    length_km: 175,
    conductor_type: 'Almelec / AAAC 570 mm² avec câble de garde optique OPGW',
    conductor_type_en: 'AAAC (Almelec) 570 mm² phase conductors with OPGW optical ground wire',
    thermal_rating_mva: 320,
    from_substation: 'Mangombé (Edéa)',
    to_substation: 'Oyomabang / Ahala (Yaoundé)',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Artère historique de transport 225 kV reliant le bassin hydroélectrique de la Sanaga à la capitale Yaoundé.',
    notes_en:
      'Backbone 225 kV transmission corridor linking the Sanaga hydroelectric generation basin (Songloulou/Edéa) to the capital Yaoundé.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL Transmission Network Map & World Bank RIS Studies',
    source_date: '2023',
    related_domains: ['D02', 'D03', 'D11'],
  },
  {
    id: 'line-nh-ny2-225',
    code: 'TL-225-02',
    name: 'Double Ligne 225 kV Nachtigal – Nyom II (Yaoundé Nord)',
    name_en: '225 kV Double-Circuit Nachtigal – Nyom II Evacuation Line',
    voltage_kv: 225,
    length_km: 50.8,
    conductor_type: 'Faisceau double Almelec 2 × 366 mm² avec OPGW',
    conductor_type_en: 'Twin-bundle AAAC 2 × 366 mm² conductors on double-circuit lattice towers with OPGW',
    thermal_rating_mva: 650,
    from_substation: 'Nachtigal 225 kV Switchyard',
    to_substation: 'Nyom II (North Yaoundé)',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Ligne d’évacuation dédiée aux 420 MW de l’aménagement hydroélectrique de Nachtigal vers Yaoundé.',
    notes_en:
      'Dedicated 50.8 km double-circuit 225 kV evacuation corridor delivering 420 MW from Nachtigal Hydro Power Station into Yaoundé.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'NHPC (Nachtigal Hydro Power Company) Technical Specifications',
    source_date: '2024',
    related_domains: ['D01', 'D03', 'D04'],
  },
  {
    id: 'line-ris-rin-225',
    code: 'TL-225-03',
    name: 'Projet d’Interconnexion RIS – RIN 225 kV (Nachtigal – Bafoussam – Tibati – Ngaoundéré)',
    name_en: '225 kV RIS – RIN National Grid Interconnection Project (Nachtigal – Bafoussam – Ngaoundéré)',
    voltage_kv: 225,
    length_km: 514,
    conductor_type: 'AAAC / Almelec avec OPGW (Projet en développement)',
    conductor_type_en: 'AAAC phase conductors with OPGW (Project under development)',
    thermal_rating_mva: 300,
    from_substation: 'Nachtigal / Bafoussam (RIS)',
    to_substation: 'Ngaoundéré (RIN)',
    grid_system: 'INTERCONNECTION',
    status: 'under_construction',
    notes_fr:
      'Projet structurant d’interconnexion entre le Réseau Interconnecté Sud (RIS) et le Réseau Interconnecté Nord (RIN) pour transférer les excédents hydroélectriques du bassin de la Sanaga vers le Septentrion.',
    notes_en:
      'Strategic national backbone project designed to interconnect the Southern Grid (RIS) and Northern Grid (RIN) for the first time, enabling bulk hydro power transfer from the Sanaga basin to northern Cameroon.',
    verification_status: 'UNDER_CONSTRUCTION_VERIFIED',
    source_citation: 'SONATREL / MINEE / World Bank RIS-RIN Interconnection Project Appraisal',
    source_date: '2023–2024',
    related_domains: ['D02', 'D03'],
  },
  {
    id: 'line-pimert-225',
    code: 'TL-225-04',
    name: 'Interconnexion Électrique Cameroun – Tchad 225 kV (Projet PIRECT)',
    name_en: '225 kV Cameroon – Chad Regional Interconnection Project (PIRECT)',
    voltage_kv: 225,
    length_km: 1024,
    conductor_type: 'AAAC / Almelec avec OPGW (Projet régional en construction)',
    conductor_type_en: 'AAAC phase conductors with OPGW (Regional project under implementation)',
    thermal_rating_mva: 250,
    from_substation: 'Ngaoundéré – Garoua – Maroua (Cameroon)',
    to_substation: 'N’Djamena (Chad)',
    grid_system: 'INTERCONNECTION',
    status: 'under_construction',
    notes_fr:
      'Projet d’intégration électrique régionale (PIRECT) financé avec le concours de la Banque Mondiale et de la BAD pour relier le réseau camerounais à N’Djamena (Tchad).',
    notes_en:
      'Central African regional power pool interconnection project (PIRECT) backed by the World Bank and AfDB to link Cameroon’s grid from Ngaoundéré/Garoua/Maroua to N’Djamena (Chad).',
    verification_status: 'UNDER_CONSTRUCTION_VERIFIED',
    source_citation: 'World Bank & AfDB PIRECT (Cameroon–Chad Power Interconnection) Project Reports',
    source_date: '2023–2024',
    related_domains: ['D02', 'D03', 'D13'],
  },
];
