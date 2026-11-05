// src/data/cameroonGridReferenceData.ts
// Authoritative Expansion Dataset for Cameroon National Electrical Network Reference Centre
// Covers additional verified Power Plants, Substations, Corridors, MV/LV Distribution Standards,
// Institutional Governance (Law 2011/022), Historical Timeline (1953-2035), Apparatus Reference Cards, and Sourced Documents.

import type {
  PowerPlantNode,
  SubstationNode,
  TransmissionCorridor,
} from './cameroonGridData';

export interface CameroonDistributionSpecs {
  medium_voltage_levels: {
    standard_kv: number;
    legacy_urban_kv: number;
    new_expansion_kv: number;
    frequency_hz: number;
    system_earthing: string;
  };
  low_voltage_levels: {
    three_phase_v: number;
    single_phase_v: number;
    system_earthing: string;
  };
  transformers: {
    pole_mounted: string;
    cabin_ground_mounted: string;
    standard_kva_ratings: number[];
    coupling_group: string;
    cooling: string;
  };
  switchgear_and_protection: {
    rmu_type: string;
    fuse_switch_ratings: string;
    reclosers: string;
    circuit_breakers: string;
  };
  conductors: {
    overhead_mv: string;
    overhead_lv: string;
    underground_mv: string;
  };
  metering_and_losses: {
    prepayment_standard: string;
    smart_meter_ami: string;
    total_loss_percent: number;
    technical_loss_percent: number;
    commercial_loss_percent: number;
    loss_reduction_strategy: string;
  };
  rural_electrification: {
    program_name: string;
    target_access_rate_2030: number;
    financing_partners: string[];
    isolated_grids: string;
  };
}

export interface CameroonSectorInstitution {
  id: string;
  code: string;
  nameFr: string;
  nameEn: string;
  acronym: string;
  roleCategory:
    | 'MINISTRY'
    | 'REGULATOR'
    | 'TSO_OPERATOR'
    | 'DISTRIBUTION_CONCESSION'
    | 'DAM_ASSET_HOLDER'
    | 'RURAL_AGENCY'
    | 'IPP_GENERATION';
  foundingYear: number;
  legalBasis: string;
  headquarters: string;
  primaryResponsibilitiesFr: string[];
  primaryResponsibilitiesEn: string[];
  keyAssetsOrScopeFr: string;
  keyAssetsOrScopeEn: string;
  interfaceBoundariesFr: string;
  interfaceBoundariesEn: string;
}

export interface CameroonGridTimelineMilestone {
  year: number;
  monthOrQuarter?: string;
  titleFr: string;
  titleEn: string;
  category: 'INFRASTRUCTURE' | 'INSTITUTIONAL' | 'REFORM' | 'EXPANSION';
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  descriptionFr: string;
  descriptionEn: string;
  primaryActors: string[];
  sourceReference: string;
}

export interface CameroonEngineeringComponent {
  id: string;
  code: string;
  nameFr: string;
  nameEn: string;
  category:
    | 'GENERATION_TURBINE'
    | 'THERMAL_ENGINE'
    | 'TRANSFORMER'
    | 'HV_SWITCHGEAR'
    | 'PROTECTION_CONTROL'
    | 'TRANSMISSION_LINE'
    | 'DISTRIBUTION_ASSET';
  relevantStandard: string;
  specifications: {
    parameter: string;
    typicalValue: string;
    cameroonDeploymentContext: string;
  }[];
  workingPrincipleFr: string;
  workingPrincipleEn: string;
  operationalMaintenanceKeyPointsFr: string[];
  operationalMaintenanceKeyPointsEn: string[];
}

export interface CameroonTechnicalDocument {
  id: string;
  titleFr: string;
  titleEn: string;
  issuingBody: string;
  documentType:
    | 'LAW'
    | 'PRESIDENTIAL_DECREE'
    | 'GRID_CODE'
    | 'MASTER_PLAN'
    | 'ANNUAL_REPORT'
    | 'PROJECT_APPRAISAL'
    | 'TECHNICAL_STANDARD';
  publicationYear: number;
  dateOrNumber: string;
  summaryFr: string;
  summaryEn: string;
  keyArticlesOrSections: string[];
}

export const ADDITIONAL_POWER_PLANTS: PowerPlantNode[] = [
  {
    id: 'plant-logbaba-gas',
    code: 'PLT-LG-105',
    name: 'Centrale Thermique au Gaz Naturel de Logbaba (Douala)',
    name_en: 'Logbaba Natural Gas Thermal Power Plant (Douala)',
    type: 'gas_thermal',
    installed_capacity_mw: 105,
    guaranteed_capacity_mw: 95,
    voltage_kv: 90,
    location: 'Logbaba / Ndogpassi (Douala)',
    region: 'Littoral',
    grid_system: 'RIS',
    river_or_fuel: 'Gaz naturel du champ onshore de Logbaba (Victoria Oil & Gas / Gaz du Cameroun)',
    river_or_fuel_en: 'Onshore Logbaba natural gas field (Gaz du Cameroun)',
    units_description: 'Groupes moteurs gaz et turbines modulaires injectant en 90 kV et 30 kV',
    units_description_en: 'Reciprocating gas engines and modular gas units injecting at 90 kV and 30 kV',
    commissioning_year: '2012 - 2017',
    operator: 'Eneo Cameroon / Altaaqa / GDC',
    technical_specs: {
      turbine_type: 'Natural Gas Reciprocating & Modular Units',
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Production thermique au gaz naturel directement au cœur du centre de consommation industriel de Douala Est, soutenant le plan de tension de la boucle 90 kV métropolitaine.',
    key_highlights_en:
      'Urban natural gas thermal generation embedded directly within the East Douala industrial load center, supporting voltage stability on the 90 kV metropolitan ring.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Eneo Cameroon & ARSEL Generation Fleet Reports',
    source_date: '2023',
    related_domains: ['D01', 'D03', 'D04'],
    relevant_calculator: 'transformer',
    relevant_simulation: 'generator-capability',
  },
  {
    id: 'plant-limbe',
    code: 'PLT-TH-LMB',
    name: 'Centrale Thermique au Fioul Lourd de Limbe (Mile 4)',
    name_en: 'Limbe Heavy Fuel Oil Thermal Power Plant (Mile 4)',
    type: 'diesel_thermal',
    installed_capacity_mw: 85,
    guaranteed_capacity_mw: 65,
    voltage_kv: 90,
    location: 'Limbe Mile 4 (Fako)',
    region: 'Sud-Ouest',
    grid_system: 'RIS',
    river_or_fuel: 'Fioul lourd (HFO 380 cSt) / Gazole',
    river_or_fuel_en: 'Heavy Fuel Oil (HFO 380 cSt) / Light Diesel',
    units_description: '5 groupes motogénérateurs Wärtsilä 18V46 de 17 MW chacun',
    units_description_en: '5 × 17 MW Wärtsilä 18V46 medium-speed HFO reciprocating engines',
    commissioning_year: '2004',
    operator: 'Eneo Cameroon',
    technical_specs: {
      alternator_speed_rpm: 500,
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Première grande centrale thermique HFO du RIS construite après la crise hydrologique de 2001. Sécurise la région du Sud-Ouest (SONARA, CDC) et injecte sur le corridor 90 kV Limbe – Bekoko.',
    key_highlights_en:
      'First major HFO thermal plant built on the RIS following the 2001 drought crisis. Secures the South-West Region (SONARA refinery, agro-industries) and feeds the 90 kV Limbe – Bekoko corridor.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Eneo Cameroon S.A. Generation Asset Registry',
    source_date: '2023',
    related_domains: ['D01', 'D04'],
    relevant_calculator: 'transformer',
    relevant_simulation: 'generator-capability',
  },
  {
    id: 'plant-oyomabang',
    code: 'PLT-TH-OYO',
    name: 'Centrale Thermique de Pointe d’Oyomabang (Yaoundé)',
    name_en: 'Oyomabang Peaking Thermal Power Plant (Yaoundé)',
    type: 'diesel_thermal',
    installed_capacity_mw: 38,
    guaranteed_capacity_mw: 25,
    voltage_kv: 90,
    location: 'Oyomabang (Mfoundi, Yaoundé)',
    region: 'Centre',
    grid_system: 'RIS',
    river_or_fuel: 'Fioul lourd (HFO) & Gasoil (LFO)',
    river_or_fuel_en: 'Heavy Fuel Oil (HFO) & Light Fuel Oil (LFO)',
    units_description: 'Groupes diesel semi-rapides de secours et soutien de pointe',
    units_description_en: 'Medium-speed diesel peaking and emergency grid-support units',
    commissioning_year: '2000 (Renforcée en 2011)',
    operator: 'Eneo Cameroon',
    technical_specs: {
      alternator_speed_rpm: 500,
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Implantée sur le site du poste source d’Oyomabang à Yaoundé, cette centrale assure le secours de la capitale et le maintien de la tension lors des pointes vespérales (18h00–22h00).',
    key_highlights_en:
      'Co-located with the Oyomabang substation in Yaoundé, providing emergency backup and evening peak voltage support (18:00–22:00) for the national capital.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Eneo Cameroon & ARSEL Operational Reports',
    source_date: '2023',
    related_domains: ['D01', 'D04', 'D05'],
  },
  {
    id: 'plant-mekin',
    code: 'PLT-MK-15',
    name: 'Centrale Hydroélectrique de Mékin',
    name_en: 'Mekin Hydroelectric Power Station',
    type: 'hydro',
    installed_capacity_mw: 15,
    guaranteed_capacity_mw: 11,
    voltage_kv: 110,
    location: 'Mékin / Meyomessala (Dja-et-Lobo)',
    region: 'Sud',
    grid_system: 'RIS',
    river_or_fuel: 'Rivière Dja (Bassin de la Sangha)',
    river_or_fuel_en: 'Dja River',
    units_description: '3 groupes Kaplan de 5 MW chacun',
    units_description_en: '3 × 5 MW axial Kaplan generating units',
    commissioning_year: '2019',
    operator: 'Hydro-Mékin (Asset Holder) / SONATREL & Eneo',
    technical_specs: {
      turbine_type: 'Kaplan',
      head_meters: 12.5,
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Aménagement hydroélectrique de basse chute dans le bassin du Dja, conçu pour alimenter les départements du Dja-et-Lobo (Sangmélima, Meyomessala) et renforcer l’extrémité sud-est du RIS.',
    key_highlights_en:
      'Low-head hydroelectric plant on the Dja River serving the Dja-et-Lobo division (Sangmélima, Meyomessala) and reinforcing the south-eastern margin of the RIS.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Hydro-Mékin & MINEE Commissioning Reports',
    source_date: '2022–2023',
    related_domains: ['D01', 'D03', 'D05'],
  },
  {
    id: 'plant-djamboutou',
    code: 'PLT-TH-DJB',
    name: 'Centrale Thermique de Djamboutou (Garoua)',
    name_en: 'Djamboutou Thermal Power Station (Garoua)',
    type: 'diesel_thermal',
    installed_capacity_mw: 20,
    guaranteed_capacity_mw: 16,
    voltage_kv: 30,
    location: 'Djamboutou / Garoua (Bénoué)',
    region: 'Nord',
    grid_system: 'RIN',
    river_or_fuel: 'Gasoil (LFO)',
    river_or_fuel_en: 'Light Fuel Oil (Diesel)',
    units_description: 'Groupes diesel modulaires de secours du Réseau Interconnecté Nord',
    units_description_en: 'Modular diesel generators providing firm backup to the Northern Grid (RIN)',
    commissioning_year: '2014 (Extensions 2021)',
    operator: 'Eneo Cameroon',
    technical_specs: {
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Soutien thermique critique du Réseau Interconnecté Nord (RIN) à Garoua, compensant la baisse de productible du barrage de Lagdo lors des étiages sévères de la Bénoué.',
    key_highlights_en:
      'Critical thermal backup plant for the Northern Interconnected Grid (RIN) in Garoua, compensating for reduced hydro generation at Lagdo during severe dry-season droughts on the Benue River.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Eneo Cameroon RIN Operations Report',
    source_date: '2023',
    related_domains: ['D01', 'D05'],
  },
  {
    id: 'plant-mbakaou',
    code: 'PLT-MBK-1.4',
    name: 'Petite Centrale Hydroélectrique de Mbakaou Carrière',
    name_en: 'Mbakaou Small Hydroelectric Power Plant',
    type: 'hydro',
    installed_capacity_mw: 1.4,
    guaranteed_capacity_mw: 1.2,
    voltage_kv: 30,
    location: 'Mbakaou / Tibati (Djérem)',
    region: 'Adamaoua',
    grid_system: 'ISOLATED',
    river_or_fuel: 'Fleuve Djérem (Barrage régulateur de Mbakaou)',
    river_or_fuel_en: 'Djérem River (Mbakaou regulating dam)',
    units_description: '2 groupes Kaplan/Francis de 700 kW raccordés en 30 kV',
    units_description_en: '2 × 700 kW small hydro units feeding a 30 kV regional mini-grid',
    commissioning_year: '2022',
    operator: 'IED Invest / Mbakaou Hydro',
    technical_specs: {
      turbine_type: 'Small Kaplan',
      power_factor: 0.85,
    },
    key_highlights_fr:
      'Première petite centrale hydroélectrique sous partenariat public-privé (PPP) valorisant le barrage réservoir existant de Mbakaou pour électrifier Tibati et Mbakaou en 30 kV.',
    key_highlights_en:
      'First small-hydro public-private partnership (PPP) utilizing the existing Mbakaou regulating dam to supply Tibati and surrounding communities via a 30 kV distribution network.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'MINEE / IED Invest Commissioning Documentation',
    source_date: '2022–2023',
    related_domains: ['D01', 'D05'],
  },
  {
    id: 'plant-kikot',
    code: 'PLT-KK-500',
    name: 'Projet Hydroélectrique de Kikot-Mbébé (En développement)',
    name_en: 'Kikot-Mbébé Hydroelectric Project (In Development)',
    type: 'hydro',
    installed_capacity_mw: 500,
    guaranteed_capacity_mw: 450,
    voltage_kv: 225,
    location: 'Kikot (frontière Centre / Littoral sur la Sanaga)',
    region: 'Centre / Littoral',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Sanaga (en aval de Nachtigal, en amont de Songloulou)',
    river_or_fuel_en: 'Sanaga River (between Nachtigal and Songloulou)',
    units_description: '6 groupes Francis de ~83,3 MW chacun (Projet KHPC : État du Cameroun & EDF)',
    units_description_en: '6 × ~83.3 MW Francis units (KHPC joint venture: Republic of Cameroon & EDF)',
    commissioning_year: 'Horizon 2030 (Travaux préparatoires 2025-2026)',
    operator: 'KHPC (Kikot Hydro Power Company)',
    technical_specs: {
      turbine_type: 'Vertical Francis',
      head_meters: 35,
      power_factor: 0.9,
    },
    key_highlights_fr:
      'Prochain grand aménagement structurant sur la Sanaga après Nachtigal. Développé par KHPC (50% État du Cameroun, 50% EDF), il injectera 500 MW sur le corridor 225/400 kV.',
    key_highlights_en:
      'Next flagship hydroelectric project on the Sanaga cascade following Nachtigal. Developed by KHPC (50% Cameroon State, 50% EDF) to inject 500 MW into the national backbone.',
    verification_status: 'UNDER_CONSTRUCTION_VERIFIED',
    source_citation: 'KHPC (EDF / Republic of Cameroon) & IFC Project Development Disclosures',
    source_date: '2024–2025',
    related_domains: ['D01', 'D03', 'D04'],
  },
  {
    id: 'plant-grand-eweng',
    code: 'PLT-GE-1000',
    name: 'Projet Hydroélectrique de Grand Eweng (Plan Directeur 2035)',
    name_en: 'Grand Eweng Hydroelectric Project (2035 Master Plan)',
    type: 'hydro',
    installed_capacity_mw: 1000,
    guaranteed_capacity_mw: 850,
    voltage_kv: 400,
    location: 'Eweng / Dibang (Sanaga-Maritime)',
    region: 'Littoral',
    grid_system: 'RIS',
    river_or_fuel: 'Fleuve Sanaga',
    river_or_fuel_en: 'Sanaga River',
    units_description: 'Aménagement hydroélectrique de grande puissance (800 à 1 000+ MW prévus au PDSE)',
    units_description_en: 'Large-scale hydropower complex (800 to 1,000+ MW planned in the PDSE Master Plan)',
    commissioning_year: 'Horizon 2033 - 2035',
    operator: 'MINEE / PDSE 2035 Pipeline',
    technical_specs: {
      turbine_type: 'Vertical Francis',
      power_factor: 0.9,
    },
    key_highlights_fr:
      'Projet majeur inscrit au Plan de Développement du Secteur de l’Électricité (PDSE 2035) sur le cours inférieur de la Sanaga pour soutenir l’industrialisation lourde.',
    key_highlights_en:
      'Major hydropower project in the Electricity Sector Development Plan (PDSE 2035) on the lower Sanaga River aimed at heavy industrial expansion and regional power export.',
    verification_status: 'UNDER_CONSTRUCTION_VERIFIED',
    source_citation: 'MINEE PDSE 2035 Master Plan',
    source_date: '2023–2024',
    related_domains: ['D01', 'D03'],
  },
];

export const ADDITIONAL_SUBSTATIONS: SubstationNode[] = [
  {
    id: 'sub-nomayos',
    code: 'SUB-NMY-225',
    name: 'Poste d’Interconnexion de Nomayos (Yaoundé Sud-Ouest)',
    name_en: 'Nomayos 225/90/30 kV Interconnection Substation (Yaoundé SW)',
    voltage_levels: '225 / 90 / 30 kV',
    grid_system: 'RIS',
    region: 'Centre',
    city: 'Yaoundé (Nomayos)',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 × 100 MVA (225/90 kV) + 1 × 50 MVA (90/30 kV)',
    short_circuit_level_ka: '31.5 kA rated withstand',
    operator: 'SONATREL',
    function_description_fr:
      'Nouveau nœud stratégique 225/90 kV à l’entrée sud-ouest de Yaoundé, bouclant le transit depuis Mangombé, Nyom II et Ahala pour sécuriser l’alimentation de la capitale.',
    function_description_en:
      'Strategic 225/90 kV grid node at the southwestern gateway of Yaoundé, looping power flows from Mangombé, Nyom II, and Ahala to secure the capital city.',
    connected_lines: [
      'Ligne 225 kV Mangombé – Nomayos – Oyomabang',
      'Liaison 225 kV Nyom II – Nomayos – Ahala',
      'Boucle 90 kV Yaoundé Ouest',
    ],
    connected_lines_en: [
      '225 kV Mangombé – Nomayos – Oyomabang Line',
      '225 kV Nyom II – Nomayos – Ahala Ring Link',
      '90 kV West Yaoundé Sub-transmission Ring',
    ],
    protection_features: [
      'Protection différentielle de ligne ANSI 87L sur fibre optique OPGW',
      'Protection de distance numérique ANSI 21 et jeu de barres 87B',
    ],
    protection_features_en: [
      'Line current differential protection (ANSI 87L) over OPGW fiber',
      'Numerical distance (ANSI 21) and busbar differential (ANSI 87B)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & World Bank PTERS Yaoundé Ring Reinforcement Reports',
    source_date: '2023–2024',
    engineering_note_en: 'Confirmed SONATREL 225/90 kV substation reinforcing the Yaoundé metropolitan transmission loop.',
    engineering_note_fr: 'Poste 225/90 kV SONATREL confirmé renforçant la boucle haute tension de Yaoundé.',
    related_domains: ['D03', 'D04', 'D11'],
    associated_diagram_topology: 'double-bus',
  },
  {
    id: 'sub-oyomabang',
    code: 'SUB-OYO-90',
    name: 'Poste Source d’Oyomabang (Yaoundé Centre-Ouest)',
    name_en: 'Oyomabang 225/90/30/15 kV Substation (Yaoundé)',
    voltage_levels: '225 / 90 / 30 / 15 kV',
    grid_system: 'RIS',
    region: 'Centre',
    city: 'Yaoundé',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 × 90 MVA (225/90 kV) + 3 × 36 MVA (90/15-30 kV)',
    short_circuit_level_ka: '31.5 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Poste historique de réception HTB de Yaoundé : interface entre l’artère 225 kV venant de Mangombé, la centrale thermique d’Oyomabang et la boucle 90 kV de la capitale (Kondengui, Ngousso, BRGM).',
    function_description_en:
      'Historical bulk receiving substation for Yaoundé: interfaces the 225 kV corridor from Mangombé, the co-located Oyomabang thermal plant, and the 90 kV urban sub-transmission loop.',
    connected_lines: [
      'Ligne 225 kV Mangombé – Oyomabang',
      'Lignes 90 kV vers BRGM, Ngousso, Kondengui et Ahala',
      'Départs HTA 15 kV et 30 kV urbains (Eneo)',
    ],
    connected_lines_en: [
      '225 kV Mangombé – Oyomabang Line',
      '90 kV Urban Lines to BRGM, Ngousso, Kondengui, and Ahala',
      '15 kV and 30 kV Urban MV Feeders (Eneo)',
    ],
    protection_features: [
      'Protections numériques ANSI 21 / 87T / 50-51',
      'Automates de délestage fréquentiel UFLS (ANSI 81U)',
    ],
    protection_features_en: [
      'Numerical protection relays (ANSI 21 / 87T / 50-51)',
      'Automatic Under-Frequency Load Shedding (ANSI 81U)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL / Eneo Yaoundé Network Documentation',
    source_date: '2023',
    engineering_note_en: 'Confirmed primary substation in Yaoundé hosting both 225/90 kV transmission and 90/15-30 kV distribution bays.',
    engineering_note_fr: 'Poste historique confirmé de Yaoundé abritant les travées 225/90 kV et les départs HTA 15/30 kV.',
    related_domains: ['D03', 'D04', 'D05'],
    associated_diagram_topology: 'double-bus',
  },
  {
    id: 'sub-bassa',
    code: 'SUB-BSA-90',
    name: 'Poste Source de Bassa (Douala Zone Industrielle)',
    name_en: 'Bassa 90/15 kV Industrial Substation (Douala)',
    voltage_levels: '90 / 15 kV',
    grid_system: 'RIS',
    region: 'Littoral',
    city: 'Douala (Bassa)',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '3 × 36 MVA (90/15 kV ONAN/ONAF)',
    short_circuit_level_ka: '25 kA (90 kV) / 31.5 kA (15 kV)',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Poste source stratégique au cœur de la zone industrielle de Bassa à Douala, alimentant les industries lourdes, brasseries, cimenteries et quartiers résidentiels denses en HTA 15 kV.',
    function_description_en:
      'Strategic primary distribution substation at the heart of the Bassa industrial zone in Douala, supplying heavy manufacturing, breweries, and dense urban feeders at 15 kV.',
    connected_lines: [
      'Boucle 90 kV Logbaba – Bassa – Deïdo – Koumassi',
      'Raccordement thermique de secours Bassa',
      'Plus de 18 départs HTA 15 kV industriels et urbains',
    ],
    connected_lines_en: [
      '90 kV Logbaba – Bassa – Deïdo – Koumassi Ring',
      'Bassa Peaking Thermal Generation Tie',
      '18+ Industrial and Urban 15 kV MV Underground Feeders',
    ],
    protection_features: [
      'Protection différentielle transformateur ANSI 87T',
      'Cellules HTA 15 kV débrochables à coupure dans le vide avec relais ANSI 50/51/51N',
    ],
    protection_features_en: [
      'Transformer differential protection (ANSI 87T)',
      '15 kV withdrawable vacuum switchgear with ANSI 50/51/51N relays',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'Eneo Cameroon & SONATREL Douala 90 kV Ring Upgrade Studies',
    source_date: '2023',
    engineering_note_en: 'Confirmed 90/15 kV primary substation in Douala Bassa.',
    engineering_note_fr: 'Poste source 90/15 kV confirmé de la zone industrielle de Bassa à Douala.',
    related_domains: ['D04', 'D05', 'D06'],
    associated_diagram_topology: 'double-bus',
  },
  {
    id: 'sub-koumassi',
    code: 'SUB-KMS-90',
    name: 'Poste Source de Koumassi / Deïdo (Douala Centre & Port)',
    name_en: 'Koumassi & Deïdo 90/15 kV Substations (Central Douala & Port)',
    voltage_levels: '90 / 15 kV',
    grid_system: 'RIS',
    region: 'Littoral',
    city: 'Douala (Akwa / Koumassi)',
    bus_topology: 'ais-gis-hybrid',
    transformer_capacity_mva: '3 × 40 MVA (90/15 kV)',
    short_circuit_level_ka: '31.5 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Alimente le centre d’affaires d’Akwa, Bonanjo, Deïdo et le Port Autonome de Douala via la boucle 90 kV et un réseau dense de câbles souterrains 15 kV.',
    function_description_en:
      'Supplies the central business districts of Akwa, Bonanjo, Deïdo, and the Autonomous Port of Douala via the 90 kV metropolitan ring and underground 15 kV XLPE feeders.',
    connected_lines: [
      'Boucle 90 kV Logbaba – Bassa – Koumassi – Deïdo',
      'Liaison 90 kV traversée du Wouri vers Bonabéri',
      'Réseau souterrain HTA 15 kV Akwa / Port de Douala',
    ],
    connected_lines_en: [
      '90 kV Logbaba – Bassa – Koumassi – Deïdo Ring',
      '90 kV Wouri River Crossing toward Bonabéri',
      '15 kV Underground MV Feeders (Akwa CBD & Port of Douala)',
    ],
    protection_features: [
      'Protection différentielle de câbles et lignes 90 kV (ANSI 87L)',
      'Téléconduite SCADA DMS Douala',
    ],
    protection_features_en: [
      '90 kV line and cable differential protection (ANSI 87L)',
      'SCADA/DMS remote telecontrol',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL / Eneo Douala Grid Modernization Program',
    source_date: '2023',
    engineering_note_en: 'Confirmed critical 90/15 kV load-center substations in central Douala.',
    engineering_note_fr: 'Postes sources 90/15 kV critiques confirmés du centre de Douala.',
    related_domains: ['D04', 'D05'],
    associated_diagram_topology: 'ais-gis-hybrid',
  },
  {
    id: 'sub-bafoussam',
    code: 'SUB-BFS-225',
    name: 'Poste d’Interconnexion de Bafoussam (Tchitchap)',
    name_en: 'Bafoussam 225/90/30 kV Interconnection Substation (West Region)',
    voltage_levels: '225 / 90 / 30 kV',
    grid_system: 'RIS',
    region: 'Ouest',
    city: 'Bafoussam',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 × 80 MVA (225/90 kV) + 2 × 36 MVA (90/30 kV)',
    short_circuit_level_ka: '31.5 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Nœud répartiteur majeur des Hauts-Plateaux de l’Ouest : reçoit l’artère 225/90 kV depuis Bekoko (Douala), alimente Dschang, Foumban, Mbouda en 30 kV et prolonge le réseau 90 kV vers Bamenda. Futur point d’ancrage de l’interconnexion RIS-RIN.',
    function_description_en:
      'Primary transmission hub for the Western Highlands: terminates the 225/90 kV corridor from Bekoko, feeds regional 30 kV networks, extends 90 kV supply to Bamenda, and serves as a future anchor for the RIS-RIN interconnection.',
    connected_lines: [
      'Corridor 225 kV / 90 kV Bekoko – Nkongsamba – Bafoussam',
      'Ligne 90 kV Bafoussam – Bamenda',
      'Départs HTA 30 kV vers Dschang, Foumban, Bangangté, Mbouda',
    ],
    connected_lines_en: [
      '225 kV / 90 kV Bekoko – Nkongsamba – Bafoussam Corridor',
      '90 kV Bafoussam – Bamenda Line',
      '30 kV Regional MV Feeders to Dschang, Foumban, Bangangté, Mbouda',
    ],
    protection_features: [
      'Protection de distance ANSI 21 et réenclencheur automatique ANSI 79',
      'Régulation de tension par gradins en charge (OLTC) et batteries de condensateurs',
    ],
    protection_features_en: [
      'Distance protection (ANSI 21) with auto-reclosing (ANSI 79)',
      'On-Load Tap Changer (OLTC) voltage regulation and shunt capacitor banks',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL Western Corridor Reinforcement & World Bank Reports',
    source_date: '2023–2024',
    engineering_note_en: 'Confirmed SONATREL regional hub in the West Region.',
    engineering_note_fr: 'Carrefour régional SONATREL confirmé dans la région de l’Ouest.',
    related_domains: ['D03', 'D04', 'D05'],
    associated_diagram_topology: 'double-bus',
  },
  {
    id: 'sub-bamenda',
    code: 'SUB-BMD-90',
    name: 'Poste Source de Bamenda (Mankon)',
    name_en: 'Bamenda 90/30 kV Primary Substation (North-West Region)',
    voltage_levels: '90 / 30 kV',
    grid_system: 'RIS',
    region: 'Nord-Ouest',
    city: 'Bamenda',
    bus_topology: 'single-bus-segmented',
    transformer_capacity_mva: '2 × 25 MVA (90/30 kV)',
    short_circuit_level_ka: '25 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Terminus nord-ouest du Réseau Interconnecté Sud (RIS), alimentant la ville de Bamenda et les départements de la région du Nord-Ouest en HTA 30 kV.',
    function_description_en:
      'North-western terminal of the Southern Interconnected Grid (RIS), stepping down 90 kV to 30 kV to supply Bamenda and surrounding divisions of the North-West Region.',
    connected_lines: [
      'Ligne 90 kV Bafoussam – Bamenda',
      'Départs HTA 30 kV urbains et ruraux (Nord-Ouest)',
    ],
    connected_lines_en: [
      '90 kV Bafoussam – Bamenda Transmission Line',
      '30 kV Urban and Rural MV Feeders (North-West Region)',
    ],
    protection_features: [
      'Protection de distance ANSI 21 et maximum de courant directionnel ANSI 67',
      'Compensation réactive 30 kV pour maintien du plan de tension en bout de ligne',
    ],
    protection_features_en: [
      'Distance protection (ANSI 21) and directional overcurrent (ANSI 67)',
      '30 kV reactive power compensation for end-of-line voltage support',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & Eneo North-West Grid Documentation',
    source_date: '2023',
    engineering_note_en: 'Confirmed 90/30 kV terminal substation of the RIS in Bamenda.',
    engineering_note_fr: 'Poste terminal 90/30 kV confirmé du RIS à Bamenda.',
    related_domains: ['D03', 'D04', 'D05'],
  },
  {
    id: 'sub-limbe',
    code: 'SUB-LMB-90',
    name: 'Poste Source de Limbe Mile 4 (Sud-Ouest)',
    name_en: 'Limbe Mile 4 90/30 kV Substation (South-West Region)',
    voltage_levels: '90 / 30 kV',
    grid_system: 'RIS',
    region: 'Sud-Ouest',
    city: 'Limbe',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 × 50 MVA (90/30 kV) + Travées GSU Centrale Limbe (85 MW)',
    short_circuit_level_ka: '25 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Poste d’interconnexion de la centrale thermique HFO de Limbe (85 MW) et nœud d’alimentation 30 kV pour Limbe, Buea, Tiko, Mutengene et la raffinerie SONARA.',
    function_description_en:
      'Switchyard for the 85 MW Limbe HFO thermal plant and primary 90/30 kV supply hub for Limbe, Buea, Tiko, Mutengene, and the SONARA coastal complex.',
    connected_lines: [
      'Ligne 90 kV Bekoko – Tiko – Limbe Mile 4',
      'Travées groupes centrale thermique HFO de Limbe (85 MW)',
      'Départs HTA 30 kV vers Buea, Limbe, Tiko et SONARA',
    ],
    connected_lines_en: [
      '90 kV Bekoko – Tiko – Limbe Mile 4 Line',
      'Generator step-up bays for Limbe 85 MW HFO Power Plant',
      '30 kV MV Feeders to Buea, Limbe, Tiko, and SONARA',
    ],
    protection_features: [
      'Protection de distance ANSI 21 et découplage d’îlotage ANSI 81/25',
      'Protection différentielle transformateur ANSI 87T',
    ],
    protection_features_en: [
      'Distance protection (ANSI 21) and islanding/synchrocheck (ANSI 81/25)',
      'Transformer differential protection (ANSI 87T)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & Eneo South-West Grid Reports',
    source_date: '2023',
    engineering_note_en: 'Confirmed 90/30 kV generation and load substation in Limbe.',
    engineering_note_fr: 'Poste 90/30 kV confirmé de production et distribution à Limbe.',
    related_domains: ['D01', 'D04', 'D05'],
    associated_diagram_topology: 'double-bus',
  },
  {
    id: 'sub-bertoua',
    code: 'SUB-BRT-90',
    name: 'Poste Source de Bertoua (Région de l’Est)',
    name_en: 'Bertoua 90/30 kV Substation (East Region)',
    voltage_levels: '90 / 30 kV (Prévu 225/90/30 kV)',
    grid_system: 'RIS',
    region: 'Est',
    city: 'Bertoua',
    bus_topology: 'single-bus-segmented',
    transformer_capacity_mva: '2 × 25 MVA (90/30 kV)',
    short_circuit_level_ka: '25 kA rated withstand',
    operator: 'EDC / SONATREL / Eneo',
    function_description_fr:
      'Reçoit l’énergie produite par l’usine de pied du barrage de Lom Pangar (30 MW) via une ligne 90 kV de 105 km pour alimenter Bertoua, Abong-Mbang et Batouri en 30 kV.',
    function_description_en:
      'Receives power from the 30 MW Lom Pangar toe powerhouse via a 105 km 90 kV transmission line to supply Bertoua, Abong-Mbang, and Batouri at 30 kV.',
    connected_lines: [
      'Ligne 90 kV Lom Pangar – Bertoua (105 km)',
      'Projet d’interconnexion 225 kV Ahala (Yaoundé) – Abong-Mbang – Bertoua',
      'Départs HTA 30 kV Bertoua, Batouri et Abong-Mbang',
    ],
    connected_lines_en: [
      '90 kV Lom Pangar – Bertoua Transmission Line (105 km)',
      'Planned 225 kV Ahala (Yaoundé) – Abong-Mbang – Bertoua Interconnection',
      '30 kV MV Feeders to Bertoua, Batouri, and Abong-Mbang',
    ],
    protection_features: [
      'Protection de distance ANSI 21 et différentielle transformateur 87T',
      'Téléconduite par fibre optique OPGW Lom Pangar – Bertoua',
    ],
    protection_features_en: [
      'Distance protection (ANSI 21) and transformer differential (ANSI 87T)',
      'OPGW fiber optic telecontrol between Lom Pangar and Bertoua',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'EDC Lom Pangar 90 kV Evacuation & Rural Electrification Reports',
    source_date: '2023–2024',
    engineering_note_en: 'Confirmed 90/30 kV substation fed by the Lom Pangar hydroelectric plant.',
    engineering_note_fr: 'Poste 90/30 kV confirmé alimenté par l’usine de pied de Lom Pangar.',
    related_domains: ['D01', 'D03', 'D04', 'D05'],
  },
  {
    id: 'sub-garoua',
    code: 'SUB-GRA-110',
    name: 'Poste d’Interconnexion de Garoua / Djamboutou (RIN)',
    name_en: 'Garoua / Djamboutou 110/90/30 kV Substation (Northern Grid Hub)',
    voltage_levels: '110 / 90 / 30 / 15 kV',
    grid_system: 'RIN',
    region: 'Nord',
    city: 'Garoua',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 × 40 MVA (110/30 kV) + Travées 90 kV',
    short_circuit_level_ka: '25 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Nœud central du Réseau Interconnecté Nord (RIN) : reçoit la production hydroélectrique de Lagdo en 110 kV et le solaire de Guider, alimente Garoua et assure le transit vers Maroua au nord et Ngaoundéré au sud.',
    function_description_en:
      'Central transmission hub of the Northern Interconnected Grid (RIN): receives 110 kV hydro power from Lagdo and solar injection from Guider, supplies Greater Garoua, and dispatches power north to Maroua and south to Ngaoundéré.',
    connected_lines: [
      'Ligne 110 kV Lagdo – Garoua',
      'Ligne 110/90 kV Garoua – Guider – Maroua',
      'Ligne 110/90 kV Lagdo / Garoua – Ngaoundéré',
      'Raccordement centrale thermique de Djamboutou (20 MW)',
    ],
    connected_lines_en: [
      '110 kV Lagdo – Garoua Line',
      '110/90 kV Garoua – Guider – Maroua Line',
      '110/90 kV Lagdo / Garoua – Ngaoundéré Corridor',
      'Djamboutou Thermal Plant (20 MW) Tie',
    ],
    protection_features: [
      'Protection de distance numérique ANSI 21',
      'Délestage fréquentiel automatique du RIN (ANSI 81U)',
    ],
    protection_features_en: [
      'Numerical distance protection (ANSI 21)',
      'RIN automatic under-frequency load shedding (ANSI 81U)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & Eneo Northern Interconnected Grid (RIN) Reports',
    source_date: '2023–2024',
    engineering_note_en: 'Confirmed central 110/30 kV substation of the Northern Grid (RIN) in Garoua.',
    engineering_note_fr: 'Poste central 110/30 kV confirmé du Réseau Interconnecté Nord (RIN) à Garoua.',
    related_domains: ['D03', 'D04', 'D05'],
    associated_diagram_topology: 'double-bus',
  },
  {
    id: 'sub-ngaoundere',
    code: 'SUB-NGD-110',
    name: 'Poste Source de Ngaoundéré (Adamaoua / RIN)',
    name_en: 'Ngaoundéré 110/90/30 kV Substation (Adamawa / RIN)',
    voltage_levels: '110 / 90 / 30 kV (Futur 225 kV RIS-RIN)',
    grid_system: 'RIN',
    region: 'Adamaoua',
    city: 'Ngaoundéré',
    bus_topology: 'single-bus-segmented',
    transformer_capacity_mva: '2 × 25 MVA (110-90/30 kV)',
    short_circuit_level_ka: '25 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Terminus sud du Réseau Interconnecté Nord (RIN) alimentant le château d’eau de l’Adamaoua. Point de jonction stratégique du futur corridor 225 kV RIS-RIN (Nachtigal – Tibati – Ngaoundéré) et de l’interconnexion PIRECT vers le Tchad.',
    function_description_en:
      'Southern terminal of the Northern Interconnected Grid (RIN) supplying the Adamawa plateau. Strategic junction node for the upcoming 225 kV RIS-RIN national backbone and the PIRECT Cameroon-Chad interconnection.',
    connected_lines: [
      'Ligne 110/90 kV Lagdo – Ngaoundéré (~220 km)',
      'Projet 225 kV RIS-RIN (Nachtigal – Tibati – Ngaoundéré)',
      'Départs HTA 30 kV Ngaoundéré, Meiganga et zone industrielle',
    ],
    connected_lines_en: [
      '110/90 kV Lagdo – Ngaoundéré Corridor (~220 km)',
      '225 kV RIS-RIN Interconnection Project (Nachtigal – Tibati – Ngaoundéré)',
      '30 kV MV Feeders serving Ngaoundéré, Meiganga, and agro-industrial loads',
    ],
    protection_features: [
      'Protection de distance ANSI 21 et régulation de tension par condensateurs 30 kV',
      'Protection différentielle transformateur ANSI 87T',
    ],
    protection_features_en: [
      'Distance protection (ANSI 21) and 30 kV shunt capacitor voltage support',
      'Transformer differential protection (ANSI 87T)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & World Bank RIS-RIN / PIRECT Project Appraisals',
    source_date: '2023–2024',
    engineering_note_en: 'Confirmed RIN southern substation and future 225 kV RIS-RIN interconnection hub.',
    engineering_note_fr: 'Poste sud confirmé du RIN et futur carrefour 225 kV de l’interconnexion RIS-RIN.',
    related_domains: ['D03', 'D04', 'D05'],
  },
  {
    id: 'sub-maroua',
    code: 'SUB-MRA-110',
    name: 'Poste Source de Maroua (Extrême-Nord / RIN)',
    name_en: 'Maroua 110/90/30 kV Substation (Far-North / RIN)',
    voltage_levels: '110 / 90 / 30 kV (Futur 225 kV PIRECT)',
    grid_system: 'RIN',
    region: 'Extrême-Nord',
    city: 'Maroua',
    bus_topology: 'single-bus-segmented',
    transformer_capacity_mva: '2 × 25 MVA (90-110/30 kV)',
    short_circuit_level_ka: '25 kA rated withstand',
    operator: 'SONATREL / Eneo',
    function_description_fr:
      'Terminus nord actuel du RIN desservant l’Extrême-Nord (Maroua, Mokolo, Bogo, Kousseri). Raccordé à la centrale solaire PV + BESS de Maroua (15 MWp) et jalon clé du corridor 225 kV PIRECT vers N’Djamena.',
    function_description_en:
      'Northern terminal of the RIN serving the Far-North Region (Maroua, Mokolo, Bogo). Connected to the Maroua 15 MWp Solar PV + BESS hybrid plant and key node on the 225 kV PIRECT corridor to N’Djamena (Chad).',
    connected_lines: [
      'Ligne 110/90 kV Garoua – Guider – Maroua',
      'Injection 30 kV Centrale Solaire PV + BESS de Maroua',
      'Corridor 225 kV PIRECT Maroua – Kousseri – N’Djamena (En construction)',
    ],
    connected_lines_en: [
      '110/90 kV Garoua – Guider – Maroua Line',
      '30 kV Infeed from Maroua Solar PV + BESS Plant',
      '225 kV PIRECT Maroua – Kousseri – N’Djamena Line (Under Construction)',
    ],
    protection_features: [
      'Protections numériques ANSI 21 / 50-51 / 81U',
      'Contrôle de tension et d’îlotage hybride solaire/stockage',
    ],
    protection_features_en: [
      'Numerical protection relays (ANSI 21 / 50-51 / 81U)',
      'Voltage regulation and hybrid solar/BESS anti-islanding control',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL / Eneo / World Bank PIRECT Project Reports',
    source_date: '2023–2024',
    engineering_note_en: 'Confirmed Far-North substation on the RIN.',
    engineering_note_fr: 'Poste source confirmé de l’Extrême-Nord sur le RIN.',
    related_domains: ['D03', 'D04', 'D05', 'D10'],
  },
  {
    id: 'sub-kribi-port',
    code: 'SUB-KBP-225',
    name: 'Poste de Mpolongwe / Port Autonome de Kribi (225/30 kV)',
    name_en: 'Mpolongwe & Kribi Deep Seaport 225/30 kV Substation',
    voltage_levels: '225 / 30 kV',
    grid_system: 'RIS',
    region: 'Sud',
    city: 'Kribi',
    bus_topology: 'double-bus',
    transformer_capacity_mva: '2 × 50 MVA (225/30 kV) + Travées GSU Centrale Gaz KPDC (216 MW)',
    short_circuit_level_ka: '31.5 kA rated withstand',
    operator: 'SONATREL / KPDC',
    function_description_fr:
      'Évacue les 216 MW de la centrale thermique au gaz naturel de Kribi (KPDC) vers Mangombé en 225 kV et alimente la zone industrielle et portuaire du Port Autonome de Kribi (PAK) en 30 kV.',
    function_description_en:
      'Evacuates 216 MW from the Kribi natural gas power plant (KPDC) at 225 kV toward Mangombé and supplies the Kribi Deep Seaport (PAK) industrial zone at 30 kV.',
    connected_lines: [
      'Ligne 225 kV Kribi (Mpolongwe) – Mangombé (100 km)',
      'Travées élévatrices 11/225 kV Centrale Gaz KPDC (216 MW)',
      'Artères HTA 30 kV vers Kribi Ville et Port en Eau Profonde de Kribi',
    ],
    connected_lines_en: [
      '225 kV Kribi (Mpolongwe) – Mangombé Transmission Line (100 km)',
      '11/225 kV Step-Up Bays for KPDC 216 MW Gas Power Plant',
      '30 kV Industrial Feeders to Kribi City and Kribi Deep Seaport (PAK)',
    ],
    protection_features: [
      'Protection différentielle de ligne ANSI 87L et distance ANSI 21',
      'Protection de jeux de barres 225 kV ANSI 87B',
    ],
    protection_features_en: [
      'Line current differential (ANSI 87L) and distance protection (ANSI 21)',
      '225 kV busbar differential protection (ANSI 87B)',
    ],
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'KPDC / Globeleq & SONATREL Coastal Grid Documentation',
    source_date: '2023',
    engineering_note_en: 'Confirmed 225/30 kV coastal hub serving KPDC and the Port of Kribi.',
    engineering_note_fr: 'Poste côtier 225/30 kV confirmé desservant KPDC et le Port Autonome de Kribi.',
    related_domains: ['D01', 'D03', 'D04', 'D06'],
    associated_diagram_topology: 'generator-stepup',
  },
];

export const ADDITIONAL_TRANSMISSION_CORRIDORS: TransmissionCorridor[] = [
  {
    id: 'line-sl-mgb-225',
    code: 'TL-225-05',
    name: 'Corridor d’Évacuation 225 kV Songloulou – Mangombé (Édéa)',
    name_en: '225 kV Songloulou – Mangombé (Edéa) Evacuation Corridor',
    voltage_kv: 225,
    length_km: 55,
    conductor_type: 'Almelec (AAAC) 570 mm² (Lignes multiples)',
    conductor_type_en: 'AAAC (Almelec) 570 mm² phase conductors (Multiple circuits)',
    thermal_rating_mva: 600,
    from_substation: 'Songloulou 225 kV Switchyard',
    to_substation: 'Mangombé (Edéa)',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Artère vitale évacuant les 384 MW de la centrale hydroélectrique de Songloulou vers le poste de dispatching national de Mangombé.',
    notes_en:
      'Critical evacuation corridor transferring 384 MW from Songloulou Hydro Station to the Mangombé national dispatching hub in Edéa.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL Grid Topology & Eneo Historical Records',
    source_date: '2023',
    related_domains: ['D01', 'D03', 'D04'],
  },
  {
    id: 'line-mv-ahl-225',
    code: 'TL-225-06',
    name: 'Ligne d’Évacuation 225 kV Memve’ele – Ebolowa – Ahala (Yaoundé)',
    name_en: '225 kV Memve’ele – Ebolowa – Ahala (Yaoundé) Evacuation Line',
    voltage_kv: 225,
    length_km: 290,
    conductor_type: 'Almelec (AAAC) 570 mm² avec câble de garde optique OPGW',
    conductor_type_en: 'AAAC 570 mm² phase conductors with OPGW optical ground wire',
    thermal_rating_mva: 310,
    from_substation: 'Memve’ele (Nyabizan)',
    to_substation: 'Ahala (Yaoundé)',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Ligne haute tension 225 kV reliant le bassin du Ntem (Sud) à la capitale Yaoundé en passant par Ebolowa, permettant l’injection des 211 MW de Memve’ele sur le RIS.',
    notes_en:
      '290 km 225 kV transmission line linking the Ntem River basin in the South Region to Ahala (Yaoundé) via Ebolowa, delivering 211 MW from Memve’ele to the RIS.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'EDC & SONATREL Memve’ele Transmission Line Commissioning Reports',
    source_date: '2022–2023',
    related_domains: ['D01', 'D03', 'D04'],
  },
  {
    id: 'line-kb-mgb-225',
    code: 'TL-225-07',
    name: 'Ligne 225 kV Kribi (Mpolongwe) – Mangombé (Édéa)',
    name_en: '225 kV Kribi (Mpolongwe) – Mangombé (Edéa) Transmission Line',
    voltage_kv: 225,
    length_km: 100,
    conductor_type: 'Almelec (AAAC) 570 mm² sur pylônes treillis double terne',
    conductor_type_en: 'AAAC 570 mm² conductors on lattice steel towers with OPGW',
    thermal_rating_mva: 320,
    from_substation: 'Mpolongwe / Kribi (KPDC)',
    to_substation: 'Mangombé (Edéa)',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Évacue les 216 MW de la centrale thermique au gaz naturel de Kribi vers le nœud de Mangombé pour alimenter Douala et Yaoundé.',
    notes_en:
      'Evacuates 216 MW from the Kribi natural gas power plant to Mangombé for bulk distribution toward Douala and Yaoundé.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'KPDC / Globeleq & SONATREL Operational Records',
    source_date: '2023',
    related_domains: ['D01', 'D03'],
  },
  {
    id: 'line-mgb-bkk-225',
    code: 'TL-225-08',
    name: 'Artère 225 kV Mangombé – Logbaba – Bekoko (Grand Douala)',
    name_en: '225 kV Mangombé – Logbaba – Bekoko Metropolitan Corridor (Douala)',
    voltage_kv: 225,
    length_km: 85,
    conductor_type: 'Almelec (AAAC) 570 mm² + OPGW',
    conductor_type_en: 'AAAC 570 mm² phase conductors with OPGW',
    thermal_rating_mva: 450,
    from_substation: 'Mangombé (Edéa)',
    to_substation: 'Logbaba & Bekoko (Douala)',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Corridor haute capacité alimentant la métropole économique de Douala (près de 45% de la charge du RIS) depuis le carrefour hydroélectrique d’Édéa/Mangombé.',
    notes_en:
      'High-capacity bulk supply corridor feeding Cameroon’s economic capital Douala (~45% of total RIS demand) from the Mangombé hub.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & World Bank PTERS Douala Ring Reports',
    source_date: '2023–2024',
    related_domains: ['D03', 'D04'],
  },
  {
    id: 'line-bkk-bfs-225',
    code: 'TL-225-09',
    name: 'Corridor Ouest 225 / 90 kV Bekoko (Douala) – Nkongsamba – Bafoussam – Bamenda',
    name_en: '225 / 90 kV Western Corridor: Bekoko – Nkongsamba – Bafoussam – Bamenda',
    voltage_kv: 225,
    length_km: 275,
    conductor_type: 'AAAC 366 / 570 mm² (Ligne 225 kV Bekoko–Bafoussam et 90 kV Bafoussam–Bamenda)',
    conductor_type_en: 'AAAC 366 / 570 mm² (225 kV Bekoko–Bafoussam section and 90 kV extension to Bamenda)',
    thermal_rating_mva: 250,
    from_substation: 'Bekoko (Douala West)',
    to_substation: 'Bafoussam & Bamenda',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Alimente le bassin du Moungo, la région de l’Ouest (Bafoussam) et la région du Nord-Ouest (Bamenda), avec mise à niveau 225 kV entre Bekoko et Bafoussam.',
    notes_en:
      'Supplies the Moungo basin, West Region (Bafoussam), and North-West Region (Bamenda), reinforced with a 225 kV backbone between Bekoko and Bafoussam.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL Western Grid Reinforcement Project Reports',
    source_date: '2023–2024',
    related_domains: ['D03', 'D04'],
  },
  {
    id: 'line-dla-ring-90',
    code: 'TL-090-01',
    name: 'Boucle Métropolitaine 90 kV de Douala (Logbaba – Bassa – Deïdo – Koumassi – Bonabéri – Bekoko)',
    name_en: '90 kV Douala Metropolitan Sub-Transmission Ring',
    voltage_kv: 90,
    length_km: 68,
    conductor_type: 'Lignes aériennes Almelec 228/366 mm² & Liaisons souterraines HTB XLPE 90 kV',
    conductor_type_en: 'Overhead AAAC 228/366 mm² lines & 90 kV underground XLPE cable sections',
    thermal_rating_mva: 140,
    from_substation: 'Logbaba / Dibamba (East Douala)',
    to_substation: 'Bassa / Koumassi / Bonabéri / Bekoko',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Réseau de répartition 90 kV maillé ceinturant la ville de Douala et reliant l’ensemble des postes sources HTA (15 kV et 30 kV) ainsi que les centrales de Logbaba et Dibamba.',
    notes_en:
      'Meshed 90 kV sub-transmission ring encircling Greater Douala, interconnecting all primary MV distribution substations (15/30 kV) and the Logbaba/Dibamba thermal plants.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & Eneo Douala 90 kV Ring Modernization Reports',
    source_date: '2023',
    related_domains: ['D03', 'D04', 'D05'],
  },
  {
    id: 'line-yde-ring-90',
    code: 'TL-090-02',
    name: 'Boucle Urbaine 90 kV de Yaoundé (Oyomabang – Ahala – Kondengui – Ngousso – BRGM)',
    name_en: '90 kV Yaoundé Urban Sub-Transmission Ring',
    voltage_kv: 90,
    length_km: 54,
    conductor_type: 'Almelec (AAAC) 228 / 366 mm² & Câbles 90 kV',
    conductor_type_en: 'AAAC 228 / 366 mm² overhead conductors & 90 kV underground links',
    thermal_rating_mva: 130,
    from_substation: 'Oyomabang / Nomayos / Nyom II',
    to_substation: 'Ahala / Kondengui / Ngousso / BRGM',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Assure la répartition haute tension 90 kV autour de la capitale politique Yaoundé entre les grands postes 225/90 kV (Ahala, Nomayos, Oyomabang, Nyom II) et les postes sources urbains.',
    notes_en:
      'Distributes 90 kV bulk power across the capital city Yaoundé between the outer 225/90 kV hubs (Ahala, Nomayos, Oyomabang, Nyom II) and inner-city primary substations.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL Yaoundé Ring Technical Studies',
    source_date: '2023–2024',
    related_domains: ['D03', 'D04', 'D05'],
  },
  {
    id: 'line-bkk-lmb-90',
    code: 'TL-090-03',
    name: 'Ligne 90 kV Bekoko (Douala) – Tiko – Limbe Mile 4',
    name_en: '90 kV Bekoko (Douala) – Tiko – Limbe Mile 4 Corridor',
    voltage_kv: 90,
    length_km: 62,
    conductor_type: 'Almelec (AAAC) 228 mm²',
    conductor_type_en: 'AAAC 228 mm² phase conductors on steel lattice towers',
    thermal_rating_mva: 95,
    from_substation: 'Bekoko (Douala West)',
    to_substation: 'Limbe Mile 4 (South-West)',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Relie la centrale thermique HFO de Limbe (85 MW) et la région du Sud-Ouest au nœud 225/90 kV de Bekoko.',
    notes_en:
      'Interconnects the 85 MW Limbe HFO thermal plant and the South-West Region with the Bekoko 225/90 kV hub.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL Grid Map',
    source_date: '2023',
    related_domains: ['D03', 'D04'],
  },
  {
    id: 'line-lp-brt-90',
    code: 'TL-090-04',
    name: 'Ligne 90 kV Barrage de Lom Pangar – Bertoua (Région de l’Est)',
    name_en: '90 kV Lom Pangar Dam – Bertoua Transmission Line (East Region)',
    voltage_kv: 90,
    length_km: 105,
    conductor_type: 'AAAC 228 mm² avec OPGW',
    conductor_type_en: 'AAAC 228 mm² phase conductors with OPGW',
    thermal_rating_mva: 80,
    from_substation: 'Lom Pangar Powerhouse (30 MW)',
    to_substation: 'Bertoua 90/30 kV Substation',
    grid_system: 'RIS',
    status: 'operational',
    notes_fr:
      'Évacue la production de l’usine de pied de Lom Pangar (30 MW) vers Bertoua, remplaçant les groupes thermiques diesel coûteux de la région de l’Est.',
    notes_en:
      'Evacuates 30 MW from the Lom Pangar toe powerhouse to Bertoua, displacing costly isolated diesel generation across the East Region.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'EDC (Electricity Development Corporation) Commissioning Report',
    source_date: '2023–2024',
    related_domains: ['D01', 'D03', 'D04'],
  },
  {
    id: 'line-rin-backbone-110',
    code: 'TL-110-01',
    name: 'Dorsale 110 / 90 kV du Réseau Interconnecté Nord (Ngaoundéré – Lagdo – Garoua – Guider – Maroua)',
    name_en: '110 / 90 kV Northern Interconnected Grid (RIN) Backbone (Ngaoundéré – Lagdo – Garoua – Maroua)',
    voltage_kv: 110,
    length_km: 470,
    conductor_type: 'Almelec / ACSR 148 à 228 mm²',
    conductor_type_en: 'AAAC / ACSR 148 to 228 mm² overhead conductors',
    thermal_rating_mva: 90,
    from_substation: 'Lagdo & Garoua (North)',
    to_substation: 'Ngaoundéré (South) & Maroua (Far-North)',
    grid_system: 'RIN',
    status: 'operational',
    notes_fr:
      'Épine dorsale historique 110 kV et 90 kV du Septentrion camerounais reliant le barrage de Lagdo aux capitales régionales Garoua, Ngaoundéré et Maroua.',
    notes_en:
      'Historical 110 kV and 90 kV transmission spine of Northern Cameroon linking Lagdo Hydro Station to the regional capitals of Garoua, Ngaoundéré, and Maroua.',
    verification_status: 'CONFIRMED_PUBLIC_SOURCE',
    source_citation: 'SONATREL & Eneo RIN Technical Documentation',
    source_date: '2023',
    related_domains: ['D02', 'D03', 'D04'],
  },
];

export const CAMEROON_DISTRIBUTION_SPECS: CameroonDistributionSpecs = {
  medium_voltage_levels: {
    standard_kv: 30,
    legacy_urban_kv: 15,
    new_expansion_kv: 20,
    frequency_hz: 50,
    system_earthing: 'Neutre mis à la terre par résistance ou bobine de point neutre (15 kV urbain : Icc homopolaire limité à 300 A ; 30 kV rural/périurbain : limitation 300–1000 A)',
  },
  low_voltage_levels: {
    three_phase_v: 400,
    single_phase_v: 230,
    system_earthing: 'Schéma TT en distribution publique (neutre du transformateur HTA/BT directement mis à la terre, masses des abonnés reliées à une prise de terre locale avec DDR) ; Schéma TN-S ou IT dans les sites industriels privés HTB/HTA',
  },
  transformers: {
    pole_mounted: 'Transformateurs H61 sur poteau béton ou métallique/bois (50, 100 et 160 kVA — 30/0,4 kV ou 15/0,4 kV)',
    cabin_ground_mounted: 'Postes maçonnés bas de poteau ou cabines préfabriquées H59 (250, 400, 630 et 1000 kVA)',
    standard_kva_ratings: [50, 100, 160, 250, 400, 630, 1000],
    coupling_group: 'Dyn11 (Triangle côté HTA 15/30 kV, Étoile avec neutre sorti côté BT 400/230 V)',
    cooling: 'ONAN (Oil Natural Air Natural) hermétique à remplissage intégral sous vide',
  },
  switchgear_and_protection: {
    rmu_type: 'Tableaux HTA compacts insensibles à l’environnement (RMU 24 kV pour réseau 15 kV et 36 kV pour réseau 30 kV) à isolement gaz SF6 ou coupure dans le vide (type SM6 / RM6 / SafeRing)',
    fuse_switch_ratings: 'Cellules interrupteurs-fusibles combinés pour protection transformateurs HTA/BT ≤ 630 kVA ; disjoncteur HTA avec relais numérique (ANSI 50/51/51N/49) au-delà de 630 kVA',
    reclosers: 'Disjoncteurs réenclencheurs automatiques en tête de départs aériens 30 kV (cycle O - 0,3s - FO - 15s - FO) et IACM / IAT télécommandés',
    circuit_breakers: 'Disjoncteurs BT boîtier moulé (MCCB) ou disjoncteurs de branchement différentiels 500 mA en tête d’installation abonné',
  },
  conductors: {
    overhead_mv: 'Conducteurs nus en alliage d’aluminium Almelec (AAAC) 34,4 mm², 54,6 mm², 75,5 mm² et 148 mm² sur supports béton, bois traité (eucalyptus) ou métalliques',
    overhead_lv: 'Câbles aériens préassemblés en faisceau torsadé aluminium isolé XLPE (NFC 33-209) : 3×70 + 1×54,6 + 2×16 mm² (éclairage public) ou 3×50 + 54,6 mm²',
    underground_mv: 'Câbles unipolaires aluminium à isolation synthétique PR / XLPE (NFC 33-226) 12/20 (24) kV et 18/30 (36) kV de sections 150 mm² et 240 mm² en boucle ouverte',
  },
  metering_and_losses: {
    prepayment_standard: 'Compteurs intelligents à prépaiement STS (Standard Transfer Specification — CEI 62055-41) bi-blocs (split meter avec clavier CIU à domicile et unité de mesure en haut de poteau anti-fraude)',
    smart_meter_ami: 'Télérelève AMR/AMI par modem GSM/GPRS systématique sur tous les clients industriels et tertiaires HTA (Moyenne Tension) et grands comptes BT',
    total_loss_percent: 28.2,
    technical_loss_percent: 13.5,
    commercial_loss_percent: 14.7,
    loss_reduction_strategy: 'Remplacement des poteaux bois par supports béton/métalliques, déploiement massif des compteurs prépayés STS anti-fraude, création de nouveaux postes sources 225/30 kV pour raccourcir les départs HTA 30 kV surchargés.',
  },
  rural_electrification: {
    program_name: 'Plan Directeur d’Électrification Rurale (PDER) & Projet PERACE (Projet d’Électrification Rurale et d’Accès à l’Électricité dans les Zones Sous-desservies)',
    target_access_rate_2030: 85.0,
    financing_partners: ['État du Cameroun (MINEE / AER)', 'Banque Mondiale (IDA - PERACE)', 'Banque Africaine de Développement (BAD)', 'Banque Islamique de Développement (BID)'],
    isolated_grids: 'Extension des réseaux HTA 30 kV triphasés et monophasés (MALT/SWER) depuis le RIS/RIN + plus de 100 mini-réseaux solaires photovoltaïques hybrides avec stockage batterie (BESS) dans les localités enclavées de l’Est, de l’Adamaoua et de l’Extrême-Nord.',
  },
};

export const CAMEROON_SECTOR_INSTITUTIONS: CameroonSectorInstitution[] = [
  {
    id: 'inst-minee',
    code: 'MINEE',
    nameFr: 'Ministère de l’Eau et de l’Énergie',
    nameEn: 'Ministry of Water Resources and Energy',
    acronym: 'MINEE',
    roleCategory: 'MINISTRY',
    foundingYear: 1972,
    legalBasis: 'Loi n° 2011/022 du 14 décembre 2011 régissant le secteur de l’électricité au Cameroun',
    headquarters: 'Yaoundé',
    primaryResponsibilitiesFr: [
      'Élaboration et mise en œuvre de la politique énergétique nationale et du Plan de Développement du Secteur de l’Électricité (PDSE 2035)',
      'Octroi des contrats de concession de transport, de distribution et des licences de production indépendante (IPP)',
      'Tutelle technique sur la SONATREL, EDC, l’ARSEL et l’AER',
    ],
    primaryResponsibilitiesEn: [
      'Formulation and execution of national energy policy and the Electricity Sector Development Master Plan (PDSE 2035)',
      'Granting of transmission/distribution concessions and Independent Power Producer (IPP) licenses',
      'Technical oversight of SONATREL, EDC, ARSEL, and AER',
    ],
    keyAssetsOrScopeFr: 'Autorité concédante de l’État sur l’ensemble du domaine public hydroélectrique et électrique national.',
    keyAssetsOrScopeEn: 'State concessioning authority over the entire national hydroelectric and electrical public domain.',
    interfaceBoundariesFr: 'Signe les conventions de concession et les accords d’achat d’énergie (PPA) avec garantie souveraine conjointement avec le MINFI.',
    interfaceBoundariesEn: 'Signs concession agreements and sovereign-backed Power Purchase Agreements (PPAs) jointly with the Ministry of Finance (MINFI).',
  },
  {
    id: 'inst-arsel',
    code: 'ARSEL',
    nameFr: 'Agence de Régulation du Secteur de l’Électricité',
    nameEn: 'Electricity Sector Regulatory Agency',
    acronym: 'ARSEL',
    roleCategory: 'REGULATOR',
    foundingYear: 1999,
    legalBasis: 'Loi n° 98/022 du 24 décembre 1998 révisée par la Loi n° 2011/022 du 14 décembre 2011',
    headquarters: 'Yaoundé (Bastos)',
    primaryResponsibilitiesFr: [
      'Régulation économique et technique du secteur, approbation des tarifs d’électricité aux consommateurs finaux et du tarif de transport (TURPE)',
      'Contrôle du respect des cahiers des charges des concessionnaires (SONATREL, Eneo) et de la qualité de service (SAIDI/SAIFI)',
      'Arbitrage des différends entre opérateurs (transporteur, producteurs IPP, distributeur, grands comptes industriels)',
    ],
    primaryResponsibilitiesEn: [
      'Economic and technical regulation, setting retail electricity tariffs and the Transmission Network Use of System tariff (TURPE)',
      'Monitoring compliance with concession performance targets (SAIDI/SAIFI, voltage quality, loss reduction)',
      'Arbitrating disputes between grid operators, IPPs, distributors, and eligible industrial consumers',
    ],
    keyAssetsOrScopeFr: 'Autorité administrative indépendante régulant les flux financiers, tarifaires et contractuels du secteur.',
    keyAssetsOrScopeEn: 'Independent regulatory authority overseeing tariff structure, financial equilibrium, and grid code compliance.',
    interfaceBoundariesFr: 'Audite les coûts d’exploitation d’Eneo et de la SONATREL et valide les formules d’indexation des PPA.',
    interfaceBoundariesEn: 'Audits Eneo and SONATREL revenue requirements and approves PPA tariff indexation mechanisms.',
  },
  {
    id: 'inst-sonatrel',
    code: 'SONATREL',
    nameFr: 'Société Nationale de Transport de l’Électricité',
    nameEn: 'National Electricity Transmission Company',
    acronym: 'SONATREL',
    roleCategory: 'TSO_OPERATOR',
    foundingYear: 2015,
    legalBasis: 'Décret présidentiel n° 2015/442 du 8 octobre 2015 portant création de la SONATREL',
    headquarters: 'Yaoundé (avec Centre National de Conduite des Réseaux à Mangombé - Édéa)',
    primaryResponsibilitiesFr: [
      'Gestionnaire exclusif du réseau public de transport haute tension HTB (225 kV, 110 kV, 90 kV et futurs 400 kV)',
      'Exploitation du Dispatching National (CNCR de Mangombé) : équilibrage production-consommation en temps réel, réglage fréquence 50 Hz et plan de tension',
      'Planification, construction et maintenance des lignes de transport, postes d’interconnexion et interconnexions régionales (RIS-RIN, PIRECT Tchad)',
    ],
    primaryResponsibilitiesEn: [
      'Exclusive Transmission System Operator (TSO) for the high-voltage grid (225 kV, 110 kV, 90 kV, and planned 400 kV)',
      'Operation of the National Dispatching Centre (CNCR at Mangombé): real-time generation-load balancing, 50 Hz frequency control, and voltage scheduling',
      'Planning, construction, and maintenance of HV transmission lines, interconnection substations, and regional links (RIS-RIN, PIRECT Chad)',
    ],
    keyAssetsOrScopeFr: 'Plus de 2 600 km de lignes HTB (225/110/90 kV), 28+ postes sources et d’interconnexion, réseau fibre optique OPGW.',
    keyAssetsOrScopeEn: 'Over 2,600 km of HV transmission lines (225/110/90 kV), 28+ HV substations, and national OPGW fiber network.',
    interfaceBoundariesFr: 'Limite physique côté production : bornes aval des sectionneurs de ligne HTB des postes GSU. Limite côté distribution Eneo : bornes aval des transformateurs HTB/HTA (30/15 kV).',
    interfaceBoundariesEn: 'Generation boundary: downstream terminals of GSU HV line disconnectors. Distribution boundary: secondary MV (30/15 kV) terminals of HV/MV power transformers.',
  },
  {
    id: 'inst-eneo',
    code: 'ENEO',
    nameFr: 'Eneo Cameroon S.A. (Energy of Cameroon)',
    nameEn: 'Eneo Cameroon S.A.',
    acronym: 'ENEO',
    roleCategory: 'DISTRIBUTION_CONCESSION',
    foundingYear: 2014,
    legalBasis: 'Concession de service public (succédant à la SONEL 1974 et AES-SONEL 2001 ; partenariat État du Cameroun / Actis)',
    headquarters: 'Douala (Avenue de Gaulle, Bonanjo)',
    primaryResponsibilitiesFr: [
      'Exploitation des grandes centrales historiques concédées (Songloulou 384 MW, Édéa 276 MW, Lagdo 72 MW, centrales thermiques)',
      'Gestion, extension et maintenance des réseaux de distribution Moyenne Tension (HTA 30 kV / 15 kV) et Basse Tension (BT 400/230 V)',
      'Commercialisation de l’électricité, comptage (prépayé STS et post-payé) et acheteur principal (Offtaker) de l’énergie produite par les IPP (NHPC, KPDC, DPDC)',
    ],
    primaryResponsibilitiesEn: [
      'Operation of historical concession generation plants (Songloulou 384 MW, Edéa 276 MW, Lagdo 72 MW, thermal fleet)',
      'Operation, expansion, and maintenance of Medium Voltage (30 kV / 15 kV) and Low Voltage (400/230 V) distribution networks',
      'Retail electricity supply, metering (STS prepayment & AMI), and primary bulk off-taker for IPP power plants (NHPC, KPDC, DPDC)',
    ],
    keyAssetsOrScopeFr: '~1 000 MW de parc de production propre + >37 000 km de lignes HTA/BT + >1,9 million d’abonnés.',
    keyAssetsOrScopeEn: '~1,000 MW of legacy generation + >37,000 km of MV/LV distribution lines + >1.9 million customers.',
    interfaceBoundariesFr: 'Reçoit l’énergie aux barres HTA 30 kV / 15 kV des postes sources SONATREL et livre jusqu’au disjoncteur de branchement abonné.',
    interfaceBoundariesEn: 'Receives bulk power at the 30 kV / 15 kV MV busbars of SONATREL primary substations and delivers to customer service entrance breakers.',
  },
  {
    id: 'inst-edc',
    code: 'EDC',
    nameFr: 'Electricity Development Corporation',
    nameEn: 'Electricity Development Corporation',
    acronym: 'EDC',
    roleCategory: 'DAM_ASSET_HOLDER',
    foundingYear: 2006,
    legalBasis: 'Décret présidentiel n° 2006/406 du 29 novembre 2006 portant création de la société de patrimoine EDC',
    headquarters: 'Yaoundé',
    primaryResponsibilitiesFr: [
      'Gestionnaire public du patrimoine hydroélectrique de l’État et régulateur hydrologique du bassin de la Sanaga',
      'Exploitation du barrage-réservoir régulateur de Lom Pangar (6 milliards de m³) et de son usine de pied (30 MW)',
      'Développement et maîtrise d’ouvrage publique des grands aménagements hydroélectriques (Memve’ele 211 MW, études de bassin)',
    ],
    primaryResponsibilitiesEn: [
      'State hydroelectric asset management corporation and hydrological regulator of the Sanaga River basin',
      'Operation of the Lom Pangar regulating dam (6 billion m³ reservoir) and its 30 MW toe powerhouse',
      'Public project development and asset ownership of strategic hydropower schemes (Memve’ele 211 MW, basin cascade studies)',
    ],
    keyAssetsOrScopeFr: 'Barrage-réservoir de Lom Pangar (6 Gm³ + 30 MW), actif patrimonial de Memve’ele (211 MW), gestion des eaux de la Sanaga.',
    keyAssetsOrScopeEn: 'Lom Pangar regulating reservoir (6 Gm³ + 30 MW), Memve’ele (211 MW) asset ownership, Sanaga basin water dispatch.',
    interfaceBoundariesFr: 'Facture la redevance de régulation d’eau aux producteurs aval de la Sanaga (Nachtigal, Songloulou, Édéa).',
    interfaceBoundariesEn: 'Coordinates seasonal water releases and water-regulation tariffs with downstream Sanaga generators (Nachtigal, Songloulou, Edéa).',
  },
  {
    id: 'inst-aer',
    code: 'AER',
    nameFr: 'Agence d’Électrification Rurale',
    nameEn: 'Rural Electrification Agency',
    acronym: 'AER',
    roleCategory: 'RURAL_AGENCY',
    foundingYear: 1999,
    legalBasis: 'Décret n° 99/193 du 8 septembre 1999 (Loi sur l’électricité)',
    headquarters: 'Yaoundé',
    primaryResponsibilitiesFr: [
      'Promotion et développement de l’accès à l’électricité en milieu rural sur l’ensemble des 10 régions',
      'Mise en œuvre du Plan Directeur d’Électrification Rurale (PDER), du projet PERACE et des mini-réseaux solaires hybrides hors-réseau',
      'Assistance technique aux communes et coopératives d’électrification rurale',
    ],
    primaryResponsibilitiesEn: [
      'Promotion and deployment of rural electricity access across all 10 regions of Cameroon',
      'Implementation of the Rural Electrification Master Plan (PDER), World Bank PERACE project, and off-grid solar hybrid mini-grids',
      'Technical assistance to municipalities and rural electrification cooperatives',
    ],
    keyAssetsOrScopeFr: 'Centaines de localités rurales électrifiées par extension 30 kV ou centrales solaires autonomes.',
    keyAssetsOrScopeEn: 'Hundreds of rural communities electrified via 30 kV grid extensions or standalone solar PV mini-grids.',
    interfaceBoundariesFr: 'Rétrocède les extensions HTA/BT raccordées au réseau interconnecté à l’opérateur de distribution ou gère des concessions rurales dédiées.',
    interfaceBoundariesEn: 'Transfers grid-connected MV/LV rural extensions to the concessionaire or oversees decentralized rural mini-grid operators.',
  },
  {
    id: 'inst-nhpc',
    code: 'NHPC',
    nameFr: 'Nachtigal Hydro Power Company',
    nameEn: 'Nachtigal Hydro Power Company',
    acronym: 'NHPC',
    roleCategory: 'IPP_GENERATION',
    foundingYear: 2016,
    legalBasis: 'Contrat de Concession et PPA de 35 ans (Actionnaires : EDF 40%, IFC 20%, État du Cameroun 15%, Africa50 15%, STOA 10%)',
    headquarters: 'Yaoundé / Site de Nachtigal',
    primaryResponsibilitiesFr: [
      'Conception, financement, construction et exploitation pendant 35 ans de l’aménagement hydroélectrique de Nachtigal (420 MW)',
      'Injection de près de 3 000 GWh/an sur le Réseau Interconnecté Sud (RIS) via la double ligne 225 kV Nachtigal – Nyom II',
    ],
    primaryResponsibilitiesEn: [
      'Design, financing, construction, and 35-year operation of the 420 MW Nachtigal hydroelectric power station',
      'Delivery of ~2,935 GWh/year into the Southern Interconnected Grid (RIS) via the 225 kV double-circuit line to Nyom II',
    ],
    keyAssetsOrScopeFr: 'Barrage et usine de Nachtigal (7 × 60 MW = 420 MW), poste élévateur 225 kV et ligne 225 kV de 50,8 km.',
    keyAssetsOrScopeEn: 'Nachtigal dam and powerhouse (7 × 60 MW = 420 MW), 225 kV GIS/AIS switchyard, and 50.8 km evacuation line.',
    interfaceBoundariesFr: 'Livre l’énergie en 225 kV au réseau SONATREL (Nyom II) dans le cadre d’un contrat Take-or-Pay avec Eneo et garantie de l’État.',
    interfaceBoundariesEn: 'Delivers bulk power at 225 kV to SONATREL (Nyom II) under a 35-year Take-or-Pay Power Purchase Agreement with Eneo and State guarantee.',
  },
  {
    id: 'inst-kpdc-dpdc',
    code: 'KPDC / DPDC',
    nameFr: 'Kribi Power Development Company & Dibamba Power Development Company (Globeleq)',
    nameEn: 'KPDC (Kribi Gas 216 MW) & DPDC (Dibamba HFO 86 MW) — Globeleq & State of Cameroon',
    acronym: 'KPDC / DPDC',
    roleCategory: 'IPP_GENERATION',
    foundingYear: 2008,
    legalBasis: 'Producteurs Indépendants d’Électricité (IPP : 56% Globeleq, 44% État du Cameroun) sous contrats PPA de 20 ans',
    headquarters: 'Douala / Kribi / Dibamba',
    primaryResponsibilitiesFr: [
      'Exploitation de la centrale thermique au gaz naturel de Kribi (216 MW en 225 kV) avec le gaz offshore fourni par la SNH / Perenco',
      'Exploitation de la centrale thermique de pointe et de réserve de Dibamba (86 MW en 90 kV à l’entrée Est de Douala)',
    ],
    primaryResponsibilitiesEn: [
      'Operation of the 216 MW Kribi natural gas power plant (225 kV) fueled by offshore gas from SNH / Perenco',
      'Operation of the 86 MW Dibamba heavy fuel oil peaking/reserve plant (90 kV at East Douala)',
    ],
    keyAssetsOrScopeFr: '302 MW de capacité thermique combinée (Kribi 216 MW + Dibamba 86 MW) essentielle à la stabilité du RIS.',
    keyAssetsOrScopeEn: '302 MW combined dispatchable thermal capacity (Kribi 216 MW + Dibamba 86 MW) stabilizing the RIS.',
    interfaceBoundariesFr: 'Points de livraison : poste 225 kV de Mpolongwe (Kribi) et poste 90 kV de Dibamba/Yassa (Douala).',
    interfaceBoundariesEn: 'Delivery points: Mpolongwe 225 kV switchyard (Kribi) and Dibamba/Yassa 90 kV switchyard (Douala).',
  },
];

export const CAMEROON_GRID_TIMELINE: CameroonGridTimelineMilestone[] = [
  {
    year: 1953,
    titleFr: 'Mise en service d’Édéa I (22 MW) sur la Sanaga',
    titleEn: 'Commissioning of Edéa I (22 MW) on the Sanaga River',
    category: 'INFRASTRUCTURE',
    impactLevel: 'CRITICAL',
    descriptionFr:
      'Inauguration des premiers groupes hydroélectriques d’Édéa par la société ENELCAM pour alimenter la ville de Douala et préparer l’implantation de l’usine d’électrolyse d’aluminium ALUCAM (mise en service en 1957), suivie d’Édéa II (1958) et Édéa III (1975) portant le complexe à 276 MW.',
    descriptionEn:
      'Inauguration of the first hydroelectric units at Edéa by ENELCAM to supply Douala and power the ALUCAM aluminium smelter (opened in 1957), followed by Edéa II (1958) and Edéa III (1975), expanding the complex to 276 MW.',
    primaryActors: ['ENELCAM', 'ALUCAM (Pechiney)'],
    sourceReference: 'Archives Historiques SONEL / Eneo Cameroon',
  },
  {
    year: 1974,
    titleFr: 'Création de la SONEL (Société Nationale d’Électricité du Cameroun)',
    titleEn: 'Creation of SONEL (National Electricity Company of Cameroon)',
    category: 'INSTITUTIONAL',
    impactLevel: 'CRITICAL',
    descriptionFr:
      'Fusion d’ENELCAM, d’EDC (Electricité du Cameroun) et de la POWERCAM (Cameroun Occidental) au sein d’un opérateur national verticalement intégré chargé de la production, du transport et de la distribution sur tout le territoire.',
    descriptionEn:
      'Merger of ENELCAM, EDC, and West Cameroon’s POWERCAM into a single vertically integrated national utility responsible for generation, transmission, and distribution nationwide.',
    primaryActors: ['SONEL', 'État du Cameroun'],
    sourceReference: 'Actes constitutifs SONEL 1974',
  },
  {
    year: 1981,
    titleFr: 'Mise en service de la Centrale de Songloulou (384 MW) et du Réseau 225 kV',
    titleEn: 'Commissioning of Songloulou Hydro Station (384 MW) and the 225 kV Grid',
    category: 'INFRASTRUCTURE',
    impactLevel: 'CRITICAL',
    descriptionFr:
      'Mise en service de la Phase I de Songloulou (4 × 48 MW en 1981) puis de la Phase II (4 × 48 MW en 1988), accompagnée de la création des premières artères 225 kV vers Mangombé, Douala et Yaoundé, formant l’ossature du Réseau Interconnecté Sud (RIS).',
    descriptionEn:
      'Commissioning of Songloulou Phase I (1981) and Phase II (1988) totaling 384 MW, along with the first 225 kV transmission corridors to Mangombé, Douala, and Yaoundé, establishing the Southern Interconnected Grid (RIS).',
    primaryActors: ['SONEL'],
    sourceReference: 'Documentation Technique Songloulou / SONEL',
  },
  {
    year: 1982,
    titleFr: 'Mise en service du Barrage Hydroélectrique de Lagdo (72 MW) et du RIN',
    titleEn: 'Commissioning of Lagdo Hydroelectric Dam (72 MW) and the Northern Grid (RIN)',
    category: 'INFRASTRUCTURE',
    impactLevel: 'HIGH',
    descriptionFr:
      'Construction du barrage de Lagdo sur la Bénoué (4 × 18 MW Kaplan) et déploiement du réseau 110 kV et 90 kV vers Garoua, Ngaoundéré et Maroua, donnant naissance au Réseau Interconnecté Nord (RIN).',
    descriptionEn:
      'Completion of the 72 MW Lagdo dam on the Benue River and the 110/90 kV transmission spine serving Garoua, Ngaoundéré, and Maroua, creating the Northern Interconnected Grid (RIN).',
    primaryActors: ['SONEL', 'Coopération Sino-Camerounaise'],
    sourceReference: 'Rapports Techniques RIN / MINEE',
  },
  {
    year: 1998,
    titleFr: 'Première Réforme Libérale (Loi n° 98/022) et Création de l’ARSEL et de l’AER',
    titleEn: 'First Sector Liberalization Law (Law No. 98/022) and Creation of ARSEL & AER',
    category: 'REFORM',
    impactLevel: 'HIGH',
    descriptionFr:
      'Ouverture du secteur à la concurrence dans la production, création du régulateur indépendant ARSEL et de l’Agence d’Électrification Rurale (AER) en 1999, suivie de la privatisation de la SONEL au profit du groupe américain AES (AES-SONEL) en 2001.',
    descriptionEn:
      'Opening of power generation to private investment, establishment of the regulator ARSEL and Rural Electrification Agency (AER) in 1999, followed by the 2001 privatization of SONEL to AES Corporation (AES-SONEL).',
    primaryActors: ['MINEE', 'ARSEL', 'AER', 'AES-SONEL'],
    sourceReference: 'Loi n° 98/022 du 24 décembre 1998',
  },
  {
    year: 2009,
    titleFr: 'Diversification Thermique : Centrales de Limbe (85 MW), Dibamba (86 MW) et Kribi Gaz (216 MW)',
    titleEn: 'Thermal Diversification: Limbe (85 MW), Dibamba (86 MW), and Kribi Gas (216 MW)',
    category: 'EXPANSION',
    impactLevel: 'HIGH',
    descriptionFr:
      'Après la mise en service de Limbe HFO (85 MW en 2004), déploiement des premiers grands producteurs indépendants (IPP) avec Globeleq : Dibamba HFO (86 MW en 2009) puis la centrale au gaz naturel de Kribi (216 MW en 2013) pour sécuriser le RIS en saison sèche.',
    descriptionEn:
      'Following Limbe HFO (85 MW in 2004), commissioning of Cameroon’s first major thermal IPPs with Globeleq: Dibamba HFO (86 MW in 2009) and the 216 MW Kribi natural gas plant (2013) to eliminate dry-season deficits.',
    primaryActors: ['AES-SONEL', 'Globeleq', 'KPDC', 'DPDC', 'SNH'],
    sourceReference: 'Rapports Annuels ARSEL & Globeleq',
  },
  {
    year: 2011,
    titleFr: 'Loi Fondamentale n° 2011/022 et Dégroupage du Transport Public',
    titleEn: 'Electricity Sector Law No. 2011/022 and Transmission Unbundling',
    category: 'REFORM',
    impactLevel: 'CRITICAL',
    descriptionFr:
      'Promulgation de la Loi n° 2011/022 du 14 décembre 2011 imposant la séparation juridique et comptable du transport d’électricité (confié à un gestionnaire public unique) et modernisant le cadre des concessions, suivie en 2014 de la reprise d’AES-SONEL par Actis sous le nom d’Eneo Cameroon.',
    descriptionEn:
      'Enactment of Law No. 2011/022 of December 14, 2011 mandating the unbundling of high-voltage transmission into a state-owned TSO, followed in 2014 by Actis acquiring AES’s stake and rebranding the utility as Eneo Cameroon.',
    primaryActors: ['Présidence de la République', 'MINEE', 'ARSEL', 'Eneo'],
    sourceReference: 'Loi n° 2011/022 du 14 décembre 2011',
  },
  {
    year: 2015,
    titleFr: 'Création de la SONATREL et Mise en Eau du Barrage de Lom Pangar (6 milliards m³)',
    titleEn: 'Creation of SONATREL and Impoundment of Lom Pangar Reservoir (6 Billion m³)',
    category: 'INSTITUTIONAL',
    impactLevel: 'CRITICAL',
    descriptionFr:
      'Création par décret présidentiel n° 2015/442 de la SONATREL (effective sur le terrain en 2018-2019 avec le transfert des actifs HTB) et mise en service par EDC du barrage-réservoir de Lom Pangar (2016) qui régularise le débit d’étiage de la Sanaga à plus de 1 000 m³/s.',
    descriptionEn:
      'Establishment of SONATREL by Presidential Decree No. 2015/442 as the national TSO, alongside EDC’s commissioning of the 6-billion m³ Lom Pangar regulating reservoir (2016), stabilizing dry-season Sanaga flows above 1,000 m³/s.',
    primaryActors: ['SONATREL', 'EDC', 'MINEE', 'Banque Mondiale'],
    sourceReference: 'Décret n° 2015/442 & Rapports EDC Lom Pangar',
  },
  {
    year: 2022,
    titleFr: 'Mise en service complète de Memve’ele (211 MW) et Solaire PV + BESS au Nord (30 MWp)',
    titleEn: 'Full Commissioning of Memve’ele (211 MW) and Northern Solar PV + BESS (30 MWp)',
    category: 'EXPANSION',
    impactLevel: 'HIGH',
    descriptionFr:
      'Achèvement de la ligne 225 kV Memve’ele – Ahala (Yaoundé) permettant l’injection des 211 MW du fleuve Ntem, suivi en 2022-2023 de la mise en service des centrales solaires hybrides avec stockage batterie de Guider et Maroua (30 MWp / 19 MWh) sur le RIN.',
    descriptionEn:
      ' energizing of the 225 kV Memve’ele – Yaoundé corridor unlocking 211 MW on the Ntem River, followed in 2022–2023 by the commissioning of the Guider and Maroua solar PV + BESS plants (30 MWp / 19 MWh) on the RIN.',
    primaryActors: ['EDC', 'SONATREL', 'Eneo', 'Scatec'],
    sourceReference: 'Communiqués Officiels MINEE / SONATREL 2022-2023',
  },
  {
    year: 2024,
    monthOrQuarter: '2024 - 2025',
    titleFr: 'Mise en Service Commerciale de l’Aménagement Hydroélectrique de Nachtigal (420 MW)',
    titleEn: 'Commercial Commissioning of Nachtigal Hydroelectric Power Station (420 MW)',
    category: 'INFRASTRUCTURE',
    impactLevel: 'CRITICAL',
    descriptionFr:
      'Couplage progressif au réseau des 7 groupes Francis de 60 MW de Nachtigal (420 MW au total) et du poste 225 kV de Nyom II (Yaoundé Nord), augmentant de 30% la capacité installée nationale et transformant l’équilibre énergétique du RIS.',
    descriptionEn:
      'Progressive grid synchronization of all 7 × 60 MW Francis units at Nachtigal (420 MW total) via the Nyom II 225 kV substation in North Yaoundé, increasing national generation capacity by nearly 30%.',
    primaryActors: ['NHPC', 'EDF', 'SONATREL', 'Eneo', 'IFC'],
    sourceReference: 'Rapports de Mise en Service NHPC 2024-2025',
  },
  {
    year: 2026,
    monthOrQuarter: '2026 - 2030',
    titleFr: 'Chantiers Structurants : Interconnexion Nationale RIS-RIN, PIRECT (Tchad) et Kikot (500 MW)',
    titleEn: 'Strategic Horizon: RIS-RIN National Interconnection, PIRECT (Chad), and Kikot (500 MW)',
    category: 'EXPANSION',
    impactLevel: 'CRITICAL',
    descriptionFr:
      'Déploiement du corridor 225 kV reliant pour la première fois le Réseau Sud (RIS) et le Réseau Nord (RIN), construction de l’interconnexion régionale 225 kV Cameroun-Tchad (PIRECT), modernisation des boucles de Douala/Yaoundé et lancement de Kikot-Mbébé (500 MW).',
    descriptionEn:
      'Construction of the 225 kV backbone uniting the Southern (RIS) and Northern (RIN) grids for the first time, implementation of the 225 kV Cameroon-Chad regional link (PIRECT), and launch of the 500 MW Kikot-Mbébé hydro project.',
    primaryActors: ['SONATREL', 'MINEE', 'KHPC (EDF/Cameroun)', 'Banque Mondiale', 'BAD'],
    sourceReference: 'Schéma Directeur SONATREL 2024-2035 & PDSE 2035',
  },
];

export const CAMEROON_ENGINEERING_COMPONENTS: CameroonEngineeringComponent[] = [
  {
    id: 'comp-francis-turbine',
    code: 'EQP-HYD-FRC',
    nameFr: 'Turbine Hydraulique Francis à Axe Vertical (Moyenne Chute)',
    nameEn: 'Vertical-Axis Francis Hydraulic Turbine (Medium Head)',
    category: 'GENERATION_TURBINE',
    relevantStandard: 'IEC 60193 / IEC 60034',
    specifications: [
      { parameter: 'Plage de hauteur de chute nette', typicalValue: '35 m – 55 m', cameroonDeploymentContext: 'Nachtigal (51,5 m), Songloulou (39,5 m), Memve’ele (35 m)' },
      { parameter: 'Puissance unitaire type', typicalValue: '48 MW – 60 MW', cameroonDeploymentContext: '7 × 60 MW à Nachtigal ; 8 × 48 MW à Songloulou ; 4 × 52,75 MW à Memve’ele' },
      { parameter: 'Vitesse de rotation synchrone', typicalValue: '150 tr/min – 187,5 tr/min (50 Hz)', cameroonDeploymentContext: 'Alternateurs saillants à 32 ou 40 pôles (f = p·n/60 = 50 Hz)' },
    ],
    workingPrincipleFr:
      'Turbine à réaction à écoulement radial-axial : l’eau sous pression pénètre par la bâche spirale, traverse les directrices orientables (distributeur Fink asservi au régulateur de vitesse) qui ajustent la puissance active, puis cède son énergie mécanique à la roue avant d’être évacuée par l’aspirateur.',
    workingPrincipleEn:
      'Reaction turbine with radial-axial flow: pressurized water enters via the spiral casing, passes through adjustable wicket gates (governor-controlled guide vanes) regulating active power output, drives the runner, and exits through the draft tube.',
    operationalMaintenanceKeyPointsFr: [
      'Surveillance de la cavitation sur l’intrados des aubes lors des fonctionnements à charge partielle',
      'Contrôle vibratoire des paliers guides et du pivot de butée hydraulique',
      'Réglage primaire de fréquence (statisme 4% à 5%) via le régulateur hydraulique de vitesse',
    ],
    operationalMaintenanceKeyPointsEn: [
      'Cavitation monitoring on runner blades during part-load operation',
      'Vibration and temperature monitoring of guide bearings and thrust bearing pads',
      'Primary frequency regulation (4%–5% droop) via electro-hydraulic speed governors',
    ],
  },
  {
    id: 'comp-kaplan-turbine',
    code: 'EQP-HYD-KPL',
    nameFr: 'Turbine Hydraulique Kaplan à Double Réglage (Basse Chute)',
    nameEn: 'Double-Regulated Kaplan Hydraulic Turbine (Low Head)',
    category: 'GENERATION_TURBINE',
    relevantStandard: 'IEC 60193 / IEC 61362',
    specifications: [
      { parameter: 'Plage de hauteur de chute nette', typicalValue: '12 m – 26 m', cameroonDeploymentContext: 'Édéa (24 m), Lagdo (22 m), Lom Pangar (usine de pied), Mékin (12,5 m)' },
      { parameter: 'Puissance unitaire', typicalValue: '5 MW – 22 MW', cameroonDeploymentContext: '4 × 18 MW à Lagdo ; 4 × 7,5 MW à Lom Pangar ; 3 × 5 MW à Mékin' },
      { parameter: 'Caractéristique mécanique', typicalValue: 'Pales orientables + Directrices (Conjuguées)', cameroonDeploymentContext: 'Haut rendement maintenu malgré les variations saisonnières de retenue' },
    ],
    workingPrincipleFr:
      'Turbine axiale à hélice dont l’angle des pales de la roue et l’ouverture des directrices du distributeur sont conjugués hydrauliquement (came de conjugaison), garantissant un rendement supérieur à 90% sur une large plage de débits et de hauteurs de chute.',
    workingPrincipleEn:
      'Axial-flow propeller turbine featuring simultaneous cam-coordinated control of both wicket gate opening and runner blade pitch angle, maintaining >90% efficiency across wide variations in river flow and reservoir head.',
    operationalMaintenanceKeyPointsFr: [
      'Étanchéité du moyeu de roue (prévention des fuites d’huile de commande des pales vers le fleuve)',
      'Inspection de la came de conjugaison distributeur / pales',
    ],
    operationalMaintenanceKeyPointsEn: [
      'Runner hub seal integrity (preventing blade-servo oil leakage into river water)',
      'Calibration of the wicket-gate / blade-pitch combinator curve',
    ],
  },
  {
    id: 'comp-gas-engine-wartsila',
    code: 'EQP-THM-W50',
    nameFr: 'Moteur Gaz / Dual-Fuel 4 Temps Semi-Rapide (Wärtsilä 18V50DF)',
    nameEn: 'Medium-Speed Four-Stroke Dual-Fuel Gas Engine (Wärtsilä 18V50DF)',
    category: 'THERMAL_ENGINE',
    relevantStandard: 'ISO 3046 / IEC 60034',
    specifications: [
      { parameter: 'Puissance électrique unitaire', typicalValue: '16,6 MW (Kribi) / 10,75 MW (Dibamba)', cameroonDeploymentContext: '13 groupes à Kribi (216 MW) ; 8 groupes à Dibamba (86 MW)' },
      { parameter: 'Vitesse synchrone', typicalValue: '500 tr/min (12 pôles — 50 Hz)', cameroonDeploymentContext: 'Couplage direct à l’alternateur 11 kV sans réducteur' },
      { parameter: 'Rendement thermique net', typicalValue: '46% – 48% en cycle simple gaz', cameroonDeploymentContext: 'Basculement instantané Gaz Naturel ↔ Diesel LFO sans coupure' },
    ],
    workingPrincipleFr:
      'Moteur alternatif 18 cylindres en V fonctionnant selon le cycle de Miller pauvre (Lean-Burn Otto) en mode gaz naturel, avec injection pilote de micro-quantité de gasoil pour l’allumage, capable de basculer automatiquement au fioul en cas de baisse de pression gaz.',
    workingPrincipleEn:
      '18-cylinder V-configuration four-stroke engine operating on the lean-burn Otto cycle on natural gas with micro-pilot diesel ignition, capable of seamless on-load transfer to liquid fuel oil if gas supply pressure drops.',
    operationalMaintenanceKeyPointsFr: [
      'Surveillance anti-cliquetis (knock control) cylindre par cylindre et température des gaz d’échappement',
      'Maintenance préventive programmée toutes les 4 000 / 12 000 / 24 000 heures de marche',
    ],
    operationalMaintenanceKeyPointsEn: [
      'Cylinder-individual knock sensing and exhaust gas temperature balancing',
      'Scheduled overhauls at 4,000 / 12,000 / 24,000 operating hours',
    ],
  },
  {
    id: 'comp-autotransformer-225-90',
    code: 'EQP-TRF-225',
    nameFr: 'Autotransformateur & Transformateur de Puissance HTB (225/90/30 kV)',
    nameEn: 'HV Power Transformer & Interbus Autotransformer (225/90/30 kV)',
    category: 'TRANSFORMER',
    relevantStandard: 'IEC 60076-1 à -5',
    specifications: [
      { parameter: 'Puissances assignées types', typicalValue: '50 MVA / 80 MVA / 100 MVA / 120 MVA', cameroonDeploymentContext: 'Mangombé, Ahala, Nomayos, Bekoko, Logbaba, Nyom II, Bafoussam' },
      { parameter: 'Mode de refroidissement', typicalValue: 'ONAN / ONAF (60%/100% ou 80%/100%)', cameroonDeploymentContext: 'Batteries de moto-ventilateurs commandées par seuils de température huile/enroulement' },
      { parameter: 'Tension de court-circuit (Uk%)', typicalValue: '10% – 12,5%', cameroonDeploymentContext: 'Régleur en charge (OLTC) ±10 × 1,25% pour maintien de la tension 90 kV / 30 kV' },
    ],
    workingPrincipleFr:
      'Assure le transfert massif de puissance entre l’étage de transport 225 kV et les réseaux de répartition 90 kV ou de distribution HTA 30 kV, tout en régulant automatiquement la tension secondaire via son changeur de prises en charge (OLTC).',
    workingPrincipleEn:
      'Transfers bulk power between the 225 kV transmission backbone and the 90 kV sub-transmission or 30 kV MV distribution networks while regulating secondary bus voltage via an On-Load Tap Changer (OLTC).',
    operationalMaintenanceKeyPointsFr: [
      'Analyse des gaz dissous dans l’huile (DGA — CEI 60599 : H2, CH4, C2H2, C2H4, CO) pour détection précoce d’arcs ou points chauds',
      'Vérification du relais Buchholz (ANSI 63), de la soupape de surpression et des dessiccateurs à gel de silice',
    ],
    operationalMaintenanceKeyPointsEn: [
      'Dissolved Gas Analysis (DGA per IEC 60599) to detect incipient arcing, partial discharge, or thermal faults',
      'Testing of Buchholz relay (ANSI 63), pressure relief device, and oil dielectric breakdown strength (>70 kV)',
    ],
  },
  {
    id: 'comp-sf6-breaker-245kv',
    code: 'EQP-SWG-SF6',
    nameFr: 'Disjoncteur Haute Tension au Gaz SF6 (245 kV / 100 kV)',
    nameEn: 'SF6 High-Voltage Circuit Breaker (245 kV / 100 kV)',
    category: 'HV_SWITCHGEAR',
    relevantStandard: 'IEC 62271-100',
    specifications: [
      { parameter: 'Tension assignée (Ur)', typicalValue: '245 kV (réseau 225 kV) / 100 kV (réseau 90 kV)', cameroonDeploymentContext: 'Tous postes SONATREL 225 kV et 90 kV (AIS et GIS)' },
      { parameter: 'Pouvoir de coupure en court-circuit', typicalValue: '31,5 kA ou 40 kA (50 Hz)', cameroonDeploymentContext: 'Temps d’élimination total de défaut ≤ 60 ms (3 cycles à 50 Hz)' },
      { parameter: 'Séquence de manœuvre assignée', typicalValue: 'O - 0,3 s - FO - 3 min - FO', cameroonDeploymentContext: 'Compatible réenclenchement rapide monophasé/triphasé (ANSI 79) sur lignes aériennes' },
    ],
    workingPrincipleFr:
      'Utilise le gaz hexafluorure de soufre (SF6) sous pression (~6 bars relatifs) à autopneumatisme ou soufflage thermique pour étouffer l’arc électrique lors du passage par zéro du courant et rétablir la tenue diélectrique en moins de 40 à 50 ms.',
    workingPrincipleEn:
      'Uses pressurized sulfur hexafluoride (SF6) gas with thermal-puffer arc quenching to extinguish fault currents at current zero and restore dielectric withstand within 40–50 ms.',
    operationalMaintenanceKeyPointsFr: [
      'Surveillance continue de la densité du gaz SF6 (seuils d’alarme et de verrouillage de manœuvre ANSI 63G)',
      'Mesure des temps d’ouverture/fermeture des pôles et de la résistance de contact statique/dynamique',
    ],
    operationalMaintenanceKeyPointsEn: [
      'Continuous SF6 gas density monitoring (two-stage alarm and lockout thresholds)',
      'Pole-discrepancy timing tests and micro-ohmmeter contact resistance verification',
    ],
  },
  {
    id: 'comp-distance-relay-21',
    code: 'EQP-PRT-A21',
    nameFr: 'Relais Numérique de Protection de Distance (ANSI 21) & Différentielle Ligne (87L)',
    nameEn: 'Numerical Distance Protection Relay (ANSI 21) & Line Differential (87L)',
    category: 'PROTECTION_CONTROL',
    relevantStandard: 'IEC 60255-121 / IEC 61850',
    specifications: [
      { parameter: 'Zones de mesure d’impédance', typicalValue: 'Zone 1 (80% ligne, 0 ms) / Zone 2 (120%, 300–400 ms) / Zone 3 secours', cameroonDeploymentContext: 'Artères 225 kV, 110 kV et 90 kV SONATREL' },
      { parameter: 'Téléprotection associée', typicalValue: 'POTT (Permissive Overreaching Transfer Trip) & ANSI 87L sur fibre OPGW', cameroonDeploymentContext: 'Lignes Nachtigal–Nyom II, Memve’ele–Ahala, Mangombé–Oyomabang' },
      { parameter: 'Fonctions intégrées', typicalValue: 'Localisateur de défaut, Oscilloperturbographie COMTRADE, Synchrocheck (25), Réenclencheur (79)', cameroonDeploymentContext: 'Postes numériques SONATREL CEI 61850' },
    ],
    workingPrincipleFr:
      'Calcule en temps réel l’impédance complexe Z = V / I vue depuis le poste grâce aux transformateurs de courant (TC) et de tension (TT). Si l’impédance entre dans le polygone caractéristique (quadrilatéral ou Mho) de Zone 1, le déclenchement est instantané.',
    workingPrincipleEn:
      'Computes the apparent complex impedance Z = V / I from bay CT and VT measurements. Faults falling within Zone 1 (80% of line length) trigger instantaneous tripping, while Zone 2 coordinates over OPGW teleprotection.',
    operationalMaintenanceKeyPointsFr: [
      'Injection secondaire par valise d’essai hexaphasée pour vérification des contours quadrilatéraux R-X',
      'Analyse des fichiers COMTRADE après chaque déclenchement sur coup de foudre en saison des pluies',
    ],
    operationalMaintenanceKeyPointsEn: [
      'Secondary injection testing of R-X quadrilateral/Mho zone reaches and timers',
      'Post-fault COMTRADE oscillography analysis and fault-locator verification along transmission corridors',
    ],
  },
  {
    id: 'comp-h61-pole-transformer',
    code: 'EQP-DST-H61',
    nameFr: 'Transformateur de Distribution HTA/BT sur Poteau Type H61 & Cabine RMU',
    nameEn: 'H61 Pole-Mounted MV/LV Distribution Transformer & Compact RMU Switchgear',
    category: 'DISTRIBUTION_ASSET',
    relevantStandard: 'IEC 60076 / NFC 52-100 / IEC 62271-200',
    specifications: [
      { parameter: 'Puissances normalisées H61', typicalValue: '50 kVA, 100 kVA, 160 kVA (sur poteau) ; 250 à 630 kVA (en cabine)', cameroonDeploymentContext: 'Réseau public de distribution Eneo et électrification rurale AER' },
      { parameter: 'Rapport de transformation', typicalValue: '30 kV / 400-230 V ou 15 kV / 400-230 V (Couplage Dyn11)', cameroonDeploymentContext: 'Prises de réglage hors tension ±2,5% / ±5%' },
      { parameter: 'Protection amont / aval', typicalValue: 'Parafoudres ZnO HTA + Éclateurs ou Fusibles HTA + Disjoncteur BT général', cameroonDeploymentContext: 'Sécurisation contre les surtensions atmosphériques tropicales (niveau kéraunique élevé)' },
    ],
    workingPrincipleFr:
      'Abaisse la Moyenne Tension (30 kV ou 15 kV triphasé 3 fils) en Basse Tension (400 V entre phases / 230 V entre phase et neutre) grâce au couplage Triangle-Étoile Dyn11 qui crée le point neutre distribué aux abonnés résidentiels et commerciaux.',
    workingPrincipleEn:
      'Steps down 3-wire MV distribution voltage (30 kV or 15 kV) to 4-wire LV service (400Y/230 V) via a Delta-Wye (Dyn11) winding configuration that establishes the grounded neutral for consumer loads.',
    operationalMaintenanceKeyPointsFr: [
      'Équilibrage des charges entre les 3 phases BT pour limiter le courant dans le neutre et les chutes de tension',
      'Vérification de la résistance de la prise de terre des masses du poste et de la terre du neutre BT',
    ],
    operationalMaintenanceKeyPointsEn: [
      'Phase load balancing across LV feeders to minimize neutral current and transformer overheating',
      'Periodic measurement of MV surge arrester ground resistance and LV neutral earthing',
    ],
  },
];

export const CAMEROON_TECHNICAL_DOCUMENTS: CameroonTechnicalDocument[] = [
  {
    id: 'doc-law-2011-022',
    titleFr: 'Loi n° 2011/022 du 14 décembre 2011 régissant le secteur de l’électricité au Cameroun',
    titleEn: 'Law No. 2011/022 of December 14, 2011 Governing the Electricity Sector in Cameroon',
    issuingBody: 'Présidence de la République / Assemblée Nationale du Cameroun',
    documentType: 'LAW',
    publicationYear: 2011,
    dateOrNumber: 'Loi n° 2011/022 (14/12/2011)',
    summaryFr:
      'Texte législatif fondamental organisant le secteur électrique camerounais : institue le gestionnaire unique du réseau public de transport (SONATREL), définit le régime des concessions, licences, autorisations, l’accès des tiers au réseau et les compétences de l’ARSEL.',
    summaryEn:
      'Foundational statutory law governing Cameroon’s power sector: mandates transmission unbundling under a single public TSO (SONATREL), defines concessions, IPP licensing, third-party network access, and ARSEL regulatory powers.',
    keyArticlesOrSections: ['Titre II : Régime juridique des activités (Transport public exclusif)', 'Titre III : Régulation (ARSEL) et Électrification Rurale (AER)', 'Titre IV : Énergies renouvelables et maîtrise d’énergie'],
  },
  {
    id: 'doc-decree-sonatrel-2015',
    titleFr: 'Décret présidentiel n° 2015/442 du 8 octobre 2015 portant création de la SONATREL',
    titleEn: 'Presidential Decree No. 2015/442 of October 8, 2015 Establishing SONATREL',
    issuingBody: 'Présidence de la République du Cameroun',
    documentType: 'PRESIDENTIAL_DECREE',
    publicationYear: 2015,
    dateOrNumber: 'Décret n° 2015/442 (08/10/2015)',
    summaryFr:
      'Crée la Société Nationale de Transport de l’Électricité (société à capital public) chargée de l’exploitation, de la maintenance et du développement du réseau public de transport HTB et de la gestion du Dispatching National.',
    summaryEn:
      'Establishes the state-owned National Electricity Transmission Company (SONATREL) responsible for operating, maintaining, and expanding the HV transmission grid and the National Dispatching Centre.',
    keyArticlesOrSections: ['Missions de gestionnaire du réseau de transport (GRT)', 'Transfert du patrimoine HTB 225/110/90 kV', 'Gestion des flux et du Centre National de Conduite (CNCR)'],
  },
  {
    id: 'doc-pdse-2035',
    titleFr: 'Plan de Développement du Secteur de l’Électricité à l’Horizon 2035 (PDSE 2035)',
    titleEn: 'Electricity Sector Development Master Plan to Horizon 2035 (PDSE 2035)',
    issuingBody: 'MINEE (Ministère de l’Eau et de l’Énergie)',
    documentType: 'MASTER_PLAN',
    publicationYear: 2019,
    dateOrNumber: 'PDSE 2035 (Actualisations 2020–2024)',
    summaryFr:
      'Document de planification stratégique nationale détaillant les prévisions de demande (scénarios bas, médian et industriel/minier), le séquencement des grands barrages (Nachtigal, Kikot, Grand Eweng, Chollet) et le schéma directeur de transport 225/400 kV.',
    summaryEn:
      'National strategic planning blueprint detailing load forecasts, optimal generation expansion sequencing (Nachtigal, Kikot, Grand Eweng, Chollet), and the 225/400 kV transmission master plan.',
    keyArticlesOrSections: ['Prévisions de charge RIS/RIN et demande industrielle', 'Valorisation du potentiel hydroélectrique de la Sanaga (>12 000 MW national)', 'Interconnexion nationale RIS-RIN et intégration sous-régionale PEAC'],
  },
  {
    id: 'doc-sonatrel-masterplan',
    titleFr: 'Schéma Directeur d’Investissement et Code de Réseau de Transport SONATREL (2024–2035)',
    titleEn: 'SONATREL Transmission Investment Master Plan & Grid Code (2024–2035)',
    issuingBody: 'SONATREL',
    documentType: 'GRID_CODE',
    publicationYear: 2024,
    dateOrNumber: 'PIRT / Code de Réseau HTB',
    summaryFr:
      'Spécifie les règles techniques de raccordement au réseau HTB (plages de fréquence 50 Hz ±0,5 Hz, plages de tension 225/110/90 kV, exigences de réglage primaire/secondaire, tenue aux creux de tension LVRT) et le programme de renforcement des postes.',
    summaryEn:
      'Defines technical grid connection requirements (50 Hz frequency band, 225/110/90 kV voltage tolerances, primary/secondary frequency response, fault clearance times) and substation reinforcement schedules.',
    keyArticlesOrSections: ['Critère de sécurité N-1 sur les artères 225 kV', 'Bouclage 225 kV de Yaoundé (Nyom II – Nomayos – Ahala) et Douala', 'Projet d’interconnexion 225 kV RIS-RIN et PIRECT (Cameroun–Tchad)'],
  },
  {
    id: 'doc-arsel-annual-report',
    titleFr: 'Rapports Annuels et Statistiques Tarifaires / TURPE de l’ARSEL (2022–2024)',
    titleEn: 'ARSEL Annual Sector Reports & TURPE Tariff Decisions (2022–2024)',
    issuingBody: 'ARSEL (Agence de Régulation du Secteur de l’Électricité)',
    documentType: 'ANNUAL_REPORT',
    publicationYear: 2024,
    dateOrNumber: 'Décisions Tarifaires & Bilans Régulatoires',
    summaryFr:
      'Publie les indicateurs officiels de performance du secteur : énergie produite par centrale, taux de pertes en transport et distribution, tarifs de vente HTB/HTA/BT et rémunération du transporteur SONATREL (TURPE).',
    summaryEn:
      'Publishes official regulatory statistics: plant-by-plant energy generation (GWh), transmission and distribution loss rates, retail tariff schedules, and SONATREL’s transmission tariff (TURPE).',
    keyArticlesOrSections: ['Structure des coûts du secteur et équilibre financier', 'Suivi de la qualité de service et des pertes techniques/commerciales', 'Grilles tarifaires Basse Tension, Moyenne Tension et Grands Comptes'],
  },
  {
    id: 'doc-eneo-annual-report',
    titleFr: 'Rapport Annuel d’Exploitation et Chiffres Clés d’Eneo Cameroon S.A.',
    titleEn: 'Eneo Cameroon S.A. Annual Operations & Key Figures Report',
    issuingBody: 'Eneo Cameroon S.A.',
    documentType: 'ANNUAL_REPORT',
    publicationYear: 2023,
    dateOrNumber: 'Exercice 2023 / 2024',
    summaryFr:
      'Détaille la disponibilité du parc de production concédé (Songloulou, Édéa, Lagdo, centrales thermiques), l’achat d’énergie aux IPP, le linéaire des réseaux HTA/BT (30/15 kV et 400 V) et le déploiement des compteurs prépayés STS.',
    summaryEn:
      'Details availability of the legacy generation fleet (Songloulou, Edéa, Lagdo, thermal plants), IPP power purchases, MV/LV network length, and STS prepayment meter deployment.',
    keyArticlesOrSections: ['Bilan énergétique RIS et RIN (GWh produits et achetés)', 'Programme de réduction des pertes non-techniques et remplacement des supports', 'Qualité de distribution (SAIDI / SAIFI) et modernisation des postes HTA'],
  },
  {
    id: 'doc-nhpc-nachtigal-tech',
    titleFr: 'Dossier Technique et Rapports de Mise en Service de Nachtigal (420 MW)',
    titleEn: 'Nachtigal 420 MW Hydroelectric Project Technical Dossier & Commissioning Records',
    issuingBody: 'NHPC (Nachtigal Hydro Power Company) / EDF / Banque Mondiale (IFC)',
    documentType: 'PROJECT_APPRAISAL',
    publicationYear: 2024,
    dateOrNumber: 'Mise en service 2024–2025',
    summaryFr:
      'Présente l’architecture génie civil et électromécanique de l’aménagement de Nachtigal : barrage en béton compacté au rouleau (BCR), canal d’amenée de 3,3 km, 7 groupes Francis de 60 MW, poste 225 kV et ligne double terne vers Nyom II.',
    summaryEn:
      'Details the civil and electromechanical design of the 420 MW Nachtigal plant: roller-compacted concrete (RCC) weir, 3.3 km headrace canal, 7 × 60 MW Francis units, 225 kV switchyard, and double-circuit line to Nyom II.',
    keyArticlesOrSections: ['Caractéristiques hydrauliques (chute 51,5 m, débit 980 m³/s)', 'Architecture électrique 10,5/225 kV et protections numériques', 'Impact sur la décarbonation et la sécurité d’approvisionnement du RIS'],
  },
  {
    id: 'doc-wb-pirect-ris-rin',
    titleFr: 'Documents d’Évaluation de Projets (PAD) : Interconnexion Cameroun–Tchad (PIRECT) & RIS-RIN',
    titleEn: 'World Bank & AfDB Project Appraisal Documents: PIRECT (Cameroon–Chad) & RIS-RIN Interconnection',
    issuingBody: 'Banque Mondiale (IDA) / Banque Africaine de Développement (BAD) / SONATREL',
    documentType: 'PROJECT_APPRAISAL',
    publicationYear: 2023,
    dateOrNumber: 'Rapports P168332 / P175269',
    summaryFr:
      'Analyse technique et économique complète de la ligne 225 kV reliant le RIS (Nachtigal/Yoko/Tibati) au RIN (Ngaoundéré/Garoua/Maroua) et de son prolongement vers N’Djamena (Tchad), incluant les études de flux de charge et de stabilité dynamique.',
    summaryEn:
      'Comprehensive technical and economic appraisal of the 225 kV transmission backbone linking the Southern Grid (RIS) to the Northern Grid (RIN) and extending to N’Djamena (Chad), including load-flow and stability studies.',
    keyArticlesOrSections: ['Dimensionnement des lignes 225 kV et compensation réactive (inductances shunt / SVC)', 'Postes 225/110/30 kV de Ngaoundéré, Garoua et Maroua', 'Gouvernance d’échange d’énergie bilatéral Cameroun–Tchad'],
  },
];