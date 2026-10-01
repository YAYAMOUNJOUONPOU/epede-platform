// src/data/regulatoryData.ts
// EPEDE Layer L06: Geographic & Regulatory Context, Power Sector Governance,
// Cameroon National Grid Code, Electricity Law 2011/022, Tariffs and Regional Interconnections (PEAC/WAPP).

export interface RegulatoryInstitution {
  id: string;
  code: string;
  name_fr: string;
  name_en: string;
  full_title_fr: string;
  full_title_en: string;
  creation_legal_basis: string;
  category: 'REGULATOR' | 'TSO' | 'DSO' | 'ASSET_HOLDER' | 'MINISTRY' | 'RURAL_AGENCY' | 'REGIONAL_POOL';
  headquarters: string;
  website_or_contact: string;
  mandate_summary_fr: string;
  mandate_summary_en: string;
  core_missions_fr: string[];
  core_missions_en: string[];
  key_regulations_administered: string[];
  interfaces_with: string[];
  badge_color: string;
}

export interface GridCodeRule {
  id: string;
  code: string;
  domain_code: string; // e.g., 'VOLTAGE', 'FREQUENCY', 'POWER_FACTOR', 'HARMONICS', 'PROTECTION', 'DEFENSE_PLAN'
  title_fr: string;
  title_en: string;
  voltage_level: '225 kV (HTB)' | '90 kV (HTB)' | '30 kV (HTA)' | '400V/230V (BT)' | 'ALL';
  standard_reference: string;
  normal_range: string;
  exceptional_range: string;
  time_tolerance: string;
  compliance_condition_fr: string;
  compliance_condition_en: string;
  penalty_or_action_fr: string;
  penalty_or_action_en: string;
  criticality: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

export interface UflsStage {
  stage: number;
  frequency_threshold_hz: number;
  time_delay_ms: number;
  load_shedding_percentage: number;
  cumulative_percentage: number;
  description_fr: string;
  description_en: string;
  targeted_substations: string[];
}

export interface TariffCategory {
  id: string;
  code: string;
  voltage_class: 'BT' | 'MT' | 'HT';
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  fixed_charge_fcfa: string;
  rates: {
    bracket_name_fr: string;
    bracket_name_en: string;
    rate_fcfa_per_kwh: number;
    vat_applicable: boolean;
    notes_fr: string;
    notes_en: string;
  }[];
  power_factor_penalty_condition: string;
  billing_mechanism: string;
}

export interface RegionalInterconnectionProject {
  id: string;
  name_fr: string;
  name_en: string;
  short_code: string;
  regional_pool: 'PEAC' | 'WAPP';
  participating_countries: string[];
  voltage_kv: number;
  route_and_length: string;
  transmission_capacity_mw: number;
  commissioning_target: string;
  strategic_objective_fr: string;
  strategic_objective_en: string;
  financing_partners: string[];
  current_status: 'OPERATIONAL' | 'UNDER_CONSTRUCTION' | 'STUDIES_COMPLETED' | 'PLANNING';
}

export interface EnvironmentalRightOfWay {
  voltage_level: string;
  right_of_way_width_m: number;
  half_corridor_m: number;
  clearance_ground_m: number;
  tree_restriction_height_m: number;
  legal_reference: string;
  rules_fr: string[];
  rules_en: string[];
}

// -------------------------------------------------------------
// INSTITUTIONAL ECOSYSTEM
// -------------------------------------------------------------
export const REGULATORY_INSTITUTIONS: RegulatoryInstitution[] = [
  {
    id: 'inst-arsel',
    code: 'ARSEL',
    name_fr: "Agence de Régulation du Secteur de l'Électricité",
    name_en: 'Electricity Sector Regulatory Agency',
    full_title_fr: "ARSEL - Établissement public administratif de régulation",
    full_title_en: 'ARSEL - Public Administrative Body for Electricity Regulation',
    creation_legal_basis: "Loi N° 98/022 du 24 décembre 1998, modifiée par la Loi N° 2011/022 du 14 décembre 2011",
    category: 'REGULATOR',
    headquarters: 'Yaoundé, Bastos',
    website_or_contact: 'www.arsel-cm.org',
    mandate_summary_fr: "Régulation économique et technique du service public de l'électricité, instruction des licences, fixation et approbation des tarifs, protection des consommateurs et arbitrage des différends.",
    mandate_summary_en: 'Economic and technical regulation of the public electricity sector, processing licenses, approving tariffs, consumer rights protection and dispute arbitration.',
    core_missions_fr: [
      "Veiller au respect des textes législatifs, réglementaires et des conventions de concession/licences.",
      "Fixer et approuver la structure tarifaire (BT, MT, HT) et le tarif de transport (wheeling tariff de la SONATREL).",
      "Protéger les intérêts des usagers en matière de qualité de service, de continuité de fourniture et de sécurité.",
      "Contrôler la conformité des investissements des opérateurs aux plans directeurs nationaux.",
      "Instruire et délivrer les autorisations et agréments aux exploitants et autoproducteurs."
    ],
    core_missions_en: [
      'Enforce compliance with legal texts, grid codes and concession/license agreements.',
      'Approve and determine the retail and bulk tariff structures (LV, MV, HV) and SONATREL wheeling charges.',
      'Safeguard consumers rights regarding service quality, continuity of supply and safety.',
      'Audit operator capital investments against approved master development plans.',
      'Grant authorizations and licenses to independent power producers (IPPs) and auto-generators.'
    ],
    key_regulations_administered: [
      'Loi N° 2011/022 régissant le secteur de l\'électricité',
      'Décisions tarifaires ARSEL fixant les grilles de vente au détail',
      'Règlement du service de distribution d\'électricité',
      'Code d\'accès des tiers au réseau de transport (TPA)'
    ],
    interfaces_with: ['MINEE', 'SONATREL', 'Eneo', 'EDC', 'AER', 'Industriels'],
    badge_color: 'amber'
  },
  {
    id: 'inst-sonatrel',
    code: 'SONATREL',
    name_fr: "Société Nationale de Transport de l'Électricité",
    name_en: 'National Electricity Transmission Corporation',
    full_title_fr: "SONATREL - Gestionnaire Unique du Réseau de Transport d'Électricité (GRT)",
    full_title_en: 'SONATREL - Sole Transmission System Operator (TSO)',
    creation_legal_basis: "Décret présidentiel N° 2015/442 du 8 octobre 2015",
    category: 'TSO',
    headquarters: 'Yaoundé (Direction Générale) & Mangombé (CNO Dispatching)',
    website_or_contact: 'www.sonatrel.cm',
    mandate_summary_fr: "Exploitation, maintenance, planification et développement exclusifs du réseau public de transport (225 kV, 110 kV, 90 kV) et gestion du Dispatching National (Centre National d'Exploitation).",
    mandate_summary_en: 'Exclusive operation, maintenance, planning and expansion of the high-voltage transmission grid (225 kV, 110 kV, 90 kV) and operation of the National Dispatch Center (CNO).',
    core_missions_fr: [
      "Garantir l'équilibre physique instantané production-consommation à l'échelle nationale (50.00 Hz).",
      "Gérer le Centre National d'Exploitation (CNO) basé à Mangombé (Edéa) pour la conduite en temps réel du RIS et du RIN.",
      "Assurer le libre accès non-discriminatoire des tiers au réseau de transport d'électricité (droit d'accès ouvert).",
      "Maintenir et moderniser les postes de transformation HTB/HTA et les couloirs de lignes 225/90 kV.",
      "Planifier le renforcement du réseau interconnecté (projet RIS-RIN 225 kV, interconnexion PIMERT Cameroun-Tchad)."
    ],
    core_missions_en: [
      'Ensure real-time instantaneous generation-load balance at national scale (50.00 Hz nominal).',
      'Operate the National Load Dispatch Center (CNO) at Mangombé (Edéa) for Southern and Northern grids.',
      'Guarantee open, non-discriminatory third-party access to the high-voltage transmission network.',
      'Maintain and upgrade HV substations and 225/90 kV overhead transmission line corridors.',
      'Plan national transmission expansion (RIS-RIN 225 kV link, Cameroon-Chad PIMERT interconnector).'
    ],
    key_regulations_administered: [
      'Code de Réseau de Transport (Grid Code)',
      'Procédure de raccordement des centrales et postes HTB',
      'Plan de défense du réseau et délestage fréquentiel (UFLS)',
      'Tarif de transit et péage de transport (Wheeling rules)'
    ],
    interfaces_with: ['ARSEL', 'Eneo', 'EDC', 'Nachtigal Hydro Power (NHPC)', 'KPDC/DPDC', 'PEAC'],
    badge_color: 'cyan'
  },
  {
    id: 'inst-edc',
    code: 'EDC',
    name_fr: 'Electricity Development Corporation',
    name_en: 'Electricity Development Corporation',
    full_title_fr: "EDC - Entreprise publique de gestion du patrimoine hydroélectrique de l'État",
    full_title_en: 'EDC - State Public Asset Holding Corporation for Hydroelectric Infrastructure',
    creation_legal_basis: "Décret N° 2006/406 du 29 novembre 2006",
    category: 'ASSET_HOLDER',
    headquarters: 'Yaoundé, Hippodrome',
    website_or_contact: 'www.edc-cameroon.org',
    mandate_summary_fr: "Conservation, gestion et valorisation des ouvrages de retenue d'eau et de régulation du bassin de la Sanaga (Lom Pangar), exploitation d'usines hydroélectriques et maîtrise d'ouvrage d'infrastructures d'État.",
    mandate_summary_en: 'Management, conservation and valorization of water storage and flow regulation dams in the Sanaga basin (Lom Pangar), operating hydro plants and executing public energy infrastructure works.',
    core_missions_fr: [
      "Gestion et exploitation du barrage de retenue de Lom Pangar (capacité 6 milliards de m³) assurant la régulation d'étiage de la Sanaga à > 1000 m³/s.",
      "Exploitation de la centrale hydroélectrique de pied de barrage de Lom Pangar (30 MW) et de sa ligne d'évacuation 90 kV vers Bertoua.",
      "Gestion patrimoniale des barrages réservoirs de retenue (Mbam Mingué, Bamendjin, Mapé).",
      "Suivi technique des investissements publics structurants et préparation des futurs aménagements hydroélectriques (Grand Eweng, Kikot, Chollet)."
    ],
    core_missions_en: [
      'Operation and management of the Lom Pangar storage dam (6 billion m³ reservoir) regulating Sanaga river dry season flow above 1,000 m³/s.',
      'Operation of the 30 MW Lom Pangar toe-of-dam power plant and the 90 kV transmission link to Bertoua (East Region).',
      'Asset management of upstream regulatory reservoirs (Mbam Mingué, Bamendjin, Mapé).',
      'Supervision of strategic state energy masterplan projects (Grand Eweng 1000 MW, Kikot 500 MW, Chollet 600 MW).'
    ],
    key_regulations_administered: [
      'Règlement d\'eau du bassin de la Sanaga',
      'Concession de régulation hydrologique',
      'Protocoles de gestion des crues et étiages avec Eneo et NHPC'
    ],
    interfaces_with: ['MINEE', 'NHPC', 'Eneo', 'SONATREL', 'ARSEL'],
    badge_color: 'blue'
  },
  {
    id: 'inst-eneo',
    code: 'Eneo Cameroon',
    name_fr: 'Eneo Cameroon S.A.',
    name_en: 'Eneo Cameroon S.A.',
    full_title_fr: "Eneo - Concessionnaire de la Distribution et Producteur Historique",
    full_title_en: 'Eneo - Historic Power Producer and Distribution Concessionaire',
    creation_legal_basis: "Contrat de Concession du 18 juillet 2001 (ex-SONEL/AES-SONEL), avenants 2018",
    category: 'DSO',
    headquarters: 'Douala, Koumassi',
    website_or_contact: 'www.eneocameroon.cm',
    mandate_summary_fr: "Exploitation exclusive de la distribution publique d'électricité (MT 30 kV et BT 400V/230V), commercialisation de l'énergie, gestion des relations usagers, et exploitation du parc historique de production hydro et thermique.",
    mandate_summary_en: 'Exclusive operation of public electricity distribution (MV 30 kV and LV 400V/230V), retail commercialization, customer relationship management, and operating legacy hydro and thermal generation assets.',
    core_missions_fr: [
      "Exploiter et entretenir le réseau moyenne tension (MT 30 kV, 15 kV, 10 kV) et basse tension (BT 400 V / 230 V) à l'échelle du territoire.",
      "Assurer la commercialisation, la relève et le déploiement des compteurs prépayés STS et télérelevés AMI.",
      "Exploiter les centrales hydroélectriques majeures de Songloulou (384 MW) et d'Edéa (276 MW).",
      "Fournir une assistance technique d'équilibre local et de compensation réactive en bout de réseau.",
      "Gérer le service client, le dépannage réseau HTA/BT et les raccordements de nouveaux abonnés."
    ],
    core_missions_en: [
      'Operate and maintain the nationwide MV (30 kV, 15 kV, 10 kV) and LV (400 V / 230 V) distribution grids.',
      'Handle metering, customer billing and the mass rollout of STS prepaid and smart AMI meters.',
      'Operate key legacy hydro power plants at Songloulou (384 MW) and Edéa (276 MW).',
      'Provide local reactive compensation and voltage stabilization at distribution nodes.',
      'Manage user emergency repairs, service connections and grid customer care.'
    ],
    key_regulations_administered: [
      'Règlement de distribution de l\'électricité au Cameroun',
      'Cahier des charges de concession Eneo-État du Cameroun',
      'Normes de raccordement MT/BT (NF C 15-100, NF C 13-100, CEI)'
    ],
    interfaces_with: ['ARSEL', 'SONATREL', 'MINEE', 'Consommateurs industriels et particuliers'],
    badge_color: 'orange'
  },
  {
    id: 'inst-minee',
    code: 'MINEE',
    name_fr: "Ministère de l'Eau et de l'Énergie",
    name_en: 'Ministry of Water Resources and Energy',
    full_title_fr: "MINEE - Tutelle institutionnelle et autorité gouvernementale de politique énergétique",
    full_title_en: 'MINEE - Government Ministry and Custodian of National Energy Policy',
    creation_legal_basis: "Décret N° 2011/408 du 9 décembre 2011 portant organisation du Gouvernement",
    category: 'MINISTRY',
    headquarters: 'Yaoundé, Immeuble Ministériel',
    website_or_contact: 'www.minee.cm',
    mandate_summary_fr: "Élaboration et mise en œuvre de la politique énergétique de la nation, tutelle des entreprises du secteur, approbation des plans d'investissement et pilotage du PDSE 2035.",
    mandate_summary_en: 'Formulation and implementation of national energy policy, governmental oversight of power sector entities, approval of major masterplans and execution of PDSE 2035.',
    core_missions_fr: [
      "Définir la stratégie nationale de mix énergétique (renforcement hydro, solaire PV dans le Grand Nord, gaz naturel).",
      "Piloter le Plan de Développement du Secteur de l'Électricité (PDSE 2035).",
      "Négocier et signer les accords de concession et les contrats de partenariat public-privé (PPP) pour les grands barrages (Nachtigal, Kikot).",
      "Superviser les relations de coopération bilatérale et multilatérale (Banque Mondiale, BAD, AFD, BEI, Chine)."
    ],
    core_missions_en: [
      'Define national energy mix policies (hydro optimization, Grand North solar PV, gas valorization).',
      'Lead the Electricity Sector Development Plan (PDSE 2035).',
      'Negotiate and execute concession agreements and PPPs for mega-infrastructure (Nachtigal, Kikot).',
      'Coordinate bilateral and multilateral energy financing partners (World Bank, AfDB, AFD, EIB).'
    ],
    key_regulations_administered: [
      'Loi N° 2011/022',
      'Stratégie Nationale de Développement (SND30 - Énergie)',
      'Décrets d\'application relatifs aux concessions et aux régimes de déclaration'
    ],
    interfaces_with: ['Présidence de la République', 'ARSEL', 'SONATREL', 'EDC', 'AER', 'Eneo'],
    badge_color: 'purple'
  },
  {
    id: 'inst-aer',
    code: 'AER',
    name_fr: "Agence d'Électrification Rurale",
    name_en: 'Rural Electrification Agency',
    full_title_fr: "AER - Établissement public chargé de l'accès à l'électricité en zone rurale",
    full_title_en: 'AER - Public Agency for Off-Grid and Rural Electricity Access',
    creation_legal_basis: "Loi N° 98/022, réorganisée par Décret N° 2013/339 du 8 octobre 2013",
    category: 'RURAL_AGENCY',
    headquarters: 'Yaoundé, Nlongkak',
    website_or_contact: 'www.aer.cm',
    mandate_summary_fr: "Promotion et mise en œuvre de l'électrification rurale, gestion du Fonds d'Électrification Rurale (FER), développement de mini-réseaux solaires et micro-centrales hydroélectriques.",
    mandate_summary_en: 'Promotion and implementation of rural electrification, managing the Rural Electrification Fund (REF), developing solar mini-grids and micro-hydro projects.',
    core_missions_fr: [
      "Augmenter le taux d'électrification rurale (objectif national > 50% à l'horizon 2030).",
      "Financer et déployer des mini-réseaux hybrides solaires photovoltaïques + stockage batterie (BESS) dans les localités isolées.",
      "Réaliser des extensions de lignes MT 30 kV pour raccorder les villages aux réseaux interconnectés RIS et RIN.",
      "Gérer le Fonds d'Électrification Rurale alimenté par les redevances sectorielles."
    ],
    core_missions_en: [
      'Accelerate rural electrification rate toward the national target of > 50% by 2030.',
      'Fund and commission hybrid solar PV mini-grids with battery storage (BESS) in remote off-grid communities.',
      'Execute 30 kV MV spur line extensions connecting peri-urban and rural localities to the RIS/RIN grids.',
      'Administer the Rural Electrification Fund generated from sector utility levies.'
    ],
    key_regulations_administered: [
      'Plan d\'Électrification Rurale (PANER)',
      'Règlement technique des installations autonomes et mini-réseaux'
    ],
    interfaces_with: ['MINEE', 'ARSEL', 'Bailleurs de fonds (Banque Mondiale PERACE)', 'Communes'],
    badge_color: 'emerald'
  },
  {
    id: 'inst-peac',
    code: 'PEAC / CAPP',
    name_fr: "Pool Énergétique d'Afrique Centrale",
    name_en: 'Central Africa Power Pool',
    full_title_fr: "PEAC - Organisme spécialisé de la CEEAC pour l'intégration des réseaux électriques régionaux",
    full_title_en: 'CAPP - ECCAS Specialized Institution for Regional Power System Integration',
    creation_legal_basis: "Protocole d'accord des Chefs d'État de la CEEAC, Brazzaville, avril 2003",
    category: 'REGIONAL_POOL',
    headquarters: 'Brazzaville, République du Congo',
    website_or_contact: 'www.peac-energy.org',
    mandate_summary_fr: "Coordination de la planification énergétique régionale, harmonisation des codes de réseau transfrontaliers et réalisation des corridors d'interconnexion en Afrique Centrale (ex. PIMERT Cameroun-Tchad).",
    mandate_summary_en: 'Coordination of regional power planning, cross-border grid code harmonization and interconnection corridors across Central Africa (e.g. Cameroon-Chad PIMERT).',
    core_missions_fr: [
      "Piloter le Marché Régional de l'Électricité d'Afrique Centrale.",
      "Harmoniser les règles techniques de synchronisation des réseaux HTB entre les pays membres (Cameroun, Tchad, Congo, Gabon, RDC, RCA, Guinée Équatoriale).",
      "Superviser le projet d'interconnexion 225 kV Cameroun - Tchad (PIMERT, 1024 km).",
      "Élaborer le Plan Directeur Régional de Production et de Transport d'Énergie."
    ],
    core_missions_en: [
      'Establish and oversee the Central African Regional Power Trade Market.',
      'Harmonize technical grid synchronization codes among member nations (Cameroon, Chad, Congo, Gabon, DRC, CAR, Equatorial Guinea).',
      'Coordinate the Cameroon-Chad 225 kV power interconnection project (PIMERT, 1,024 km).',
      'Develop the Regional Generation and Transmission Master Plan.'
    ],
    key_regulations_administered: [
      'Code de Réseau Régional PEAC',
      'Protocoles d\'accord de transit d\'énergie transfrontaliers (PPA & Transmission Wheeling)',
      'Directives environnementales régionales'
    ],
    interfaces_with: ['CEEAC', 'SONATREL', 'SNE Tchad', 'SNE Congo', 'Banque Mondiale', 'BAD'],
    badge_color: 'teal'
  }
];

// -------------------------------------------------------------
// CAMEROON NATIONAL GRID CODE: TECHNICAL OPERATING RULES
// -------------------------------------------------------------
export const CAMEROON_GRID_CODE_RULES: GridCodeRule[] = [
  {
    id: 'gc-u-225',
    code: 'GC-VOLT-225',
    domain_code: 'VOLTAGE',
    title_fr: 'Plage de Tension Permanente - Réseau 225 kV (HTB)',
    title_en: 'Steady-State Voltage Limits - 225 kV Grid (HV-B)',
    voltage_level: '225 kV (HTB)',
    standard_reference: 'Code Réseau SONATREL / CEI 60038',
    normal_range: '202.5 kV à 247.5 kV (±10% Un)',
    exceptional_range: '190.0 kV à 253.0 kV (-15.5% / +12.4% Un)',
    time_tolerance: 'Permanent en normal / Max 15 minutes en exceptionnel',
    compliance_condition_fr: "Toutes les installations raccordées au 225 kV doivent rester synchronisées et fournir leur puissance nominale sans déclenchement dans la plage ±10% Un.",
    compliance_condition_en: 'All facilities connected to 225 kV must remain synchronized and supply rated output continuously without tripping within the ±10% Un range.',
    penalty_or_action_fr: "Régulation d'excitation requise des groupes de production (fourniture/absorption de réactif Q). Ajustement des prises régleurs en charge (OLTC) des transformateurs.",
    penalty_or_action_en: 'Generator excitation AVR control mandated (Q injection/absorption). Transformer on-load tap changer (OLTC) stepping required.',
    criticality: 'CRITICAL'
  },
  {
    id: 'gc-u-90',
    code: 'GC-VOLT-090',
    domain_code: 'VOLTAGE',
    title_fr: 'Plage de Tension Permanente - Réseau 90 kV (HTB)',
    title_en: 'Steady-State Voltage Limits - 90 kV Grid (HV-B)',
    voltage_level: '90 kV (HTB)',
    standard_reference: 'Code Réseau SONATREL / CEI 60038',
    normal_range: '81.0 kV à 99.0 kV (±10% Un)',
    exceptional_range: '76.5 kV à 100.0 kV (-15% / +11.1% Un)',
    time_tolerance: 'Permanent en normal / Max 20 minutes en incident',
    compliance_condition_fr: "Tenue requise des postes de répartition HTB 90 kV (Bekoko, Logbaba, Ahala, Oyomabang).",
    compliance_condition_en: 'Withstand capability required for all 90 kV switching stations (Bekoko, Logbaba, Ahala, Oyomabang).',
    penalty_or_action_fr: "Enclenchement de bancs de condensateurs HTB ou réactances shunt. Déconnexion automatique si U < 72 kV.",
    penalty_or_action_en: 'Switching of HV capacitor banks or shunt reactors. Automatic under-voltage trip if U < 72 kV.',
    criticality: 'HIGH'
  },
  {
    id: 'gc-u-30',
    code: 'GC-VOLT-030',
    domain_code: 'VOLTAGE',
    title_fr: 'Plage de Tension Moyenne Tension - Réseau 30 kV (HTA)',
    title_en: 'Medium Voltage Operating Range - 30 kV Grid (MV)',
    voltage_level: '30 kV (HTA)',
    standard_reference: 'Règlement de Distribution Eneo / ARSEL / CEI 60038',
    normal_range: '28.5 kV à 31.5 kV (±5% Un)',
    exceptional_range: '27.0 kV à 33.0 kV (±10% Un en antenne rurale)',
    time_tolerance: 'Continu / Périodes de pointe',
    compliance_condition_fr: "Maintien de la tension de départ poste source pour garantir la qualité de fourniture aux usagers MT et postes MT/BT.",
    compliance_condition_en: 'Primary distribution feeder voltage control at primary substations to safeguard downstream MV/LV quality.',
    penalty_or_action_fr: "Pénalités contractuelles ARSEL si dépassement des plages contractuelles hors force majeure.",
    penalty_or_action_en: 'Regulatory fines applied by ARSEL if non-compliant voltage duration exceeds SLA allowances.',
    criticality: 'HIGH'
  },
  {
    id: 'gc-freq-norm',
    code: 'GC-FREQ-50',
    domain_code: 'FREQUENCY',
    title_fr: 'Fréquence Nominale & Plage de Régulation Continue (RIS / RIN)',
    title_en: 'Nominal Frequency & Continuous Operating Band (RIS / RIN)',
    voltage_level: 'ALL',
    standard_reference: 'Code Réseau Technique SONATREL / CNO',
    normal_range: '49.50 Hz à 50.50 Hz (±1.0% Fn)',
    exceptional_range: '47.50 Hz à 52.00 Hz',
    time_tolerance: 'Continu en bande normale / Au moins 30 min en régime perturbé',
    compliance_condition_fr: "Les groupes générateurs connectés doivent participer au réglage primaire de fréquence avec un statisme de 4% à 5%.",
    compliance_condition_en: 'Connected synchronous generators must contribute to primary frequency control with droop between 4% and 5%.',
    penalty_or_action_fr: "Activation immédiate de la réserve primaire R1 sous 5 à 30 secondes. Réglage secondaire R2 piloté par le CNO.",
    penalty_or_action_en: 'Immediate deployment of primary reserve R1 within 5 to 30s. Secondary AGC control driven by National Dispatch.',
    criticality: 'CRITICAL'
  },
  {
    id: 'gc-cosphi',
    code: 'GC-PQ-COSPHI',
    domain_code: 'POWER_FACTOR',
    title_fr: 'Facteur de Puissance & Fourniture de Puissance Réactive aux Nœuds HTB',
    title_en: 'Power Factor & Reactive Power Capability at HV Connection Nodes',
    voltage_level: '225 kV (HTB)',
    standard_reference: 'Prescriptions Techniques Raccordement SONATREL / CEI 60034-3',
    normal_range: 'cos φ = 0.85 inductif à 0.95 capacitif à Pn',
    exceptional_range: 'cos φ = 0.80 inductif lors des creux de tension',
    time_tolerance: 'Permanent à puissance nominale',
    compliance_condition_fr: "Chaque centrale hydroélectrique ou thermique doit être capable d'opérer sur toute la courbe de capabilité alternateur (P-Q diagram) sans échauffement rotorique.",
    compliance_condition_en: 'Each hydro or thermal plant must operate across its full generator capability chart (P-Q chart) without rotor overheating.',
    penalty_or_action_fr: "Pénalité de non-fourniture de réactif ou facturation de dépassement de l'énergie réactive (tan φ > 0.40 pour les industriels).",
    penalty_or_action_en: 'Non-compliance penalties for failing reactive support or reactive energy surcharge if tan phi > 0.40.',
    criticality: 'HIGH'
  },
  {
    id: 'gc-lvrt',
    code: 'GC-GEN-LVRT',
    domain_code: 'PROTECTION',
    title_fr: 'Traversée des Creux de Tension (LVRT / FRT) pour Producteurs & EnR',
    title_en: 'Low Voltage Ride-Through (LVRT / FRT) Capability for Generation & Renewables',
    voltage_level: 'ALL',
    standard_reference: 'CEI 61400-21 / IEEE 1547 / Code Réseau National',
    normal_range: 'U_résiduelle = 0% pendant 150 ms sans déclenchement',
    exceptional_range: 'Rétablissement linéaire vers 85% Un à t = 1 500 ms',
    time_tolerance: '150 ms à zéro tension / Rétablissement en 1.5 s',
    compliance_condition_fr: "Les parcs solaires PV (Maroua, Guider) et centrales hydro/gaz doivent rester connectés durant un court-circuit triphasé éliminé en temps normal par les protections réseau.",
    compliance_condition_en: 'Solar PV plants (Maroua, Guider) and hydro/gas generators must ride through symmetrical faults cleared in primary protection time.',
    penalty_or_action_fr: "Interdiction d'injection et refus d'agrément de mise en service si les onduleurs ou groupes ne disposent pas du profil certifié LVRT.",
    penalty_or_action_en: 'Rejection of grid connection approval if inverters or generators lack certified LVRT profiles.',
    criticality: 'CRITICAL'
  },
  {
    id: 'gc-thd',
    code: 'GC-PQ-THD',
    domain_code: 'HARMONICS',
    title_fr: 'Taux de Distorsion Harmonique Global en Tension (THDu)',
    title_en: 'Total Harmonic Distortion Limits for Voltage (THDu)',
    voltage_level: 'ALL',
    standard_reference: 'CEI 61000-3-6 / IEEE 519 / Code ARSEL',
    normal_range: 'HTB 225 kV: THDu ≤ 2.0% | HTB 90 kV: THDu ≤ 3.0% | HTA 30 kV: THDu ≤ 5.0%',
    exceptional_range: 'Harmonique individuel impair non-multiple de 3: ≤ 1.5% en HTB',
    time_tolerance: 'Moyenne hebdomadaire 95% des mesures 10 minutes',
    compliance_condition_fr: "Les raccordements d'usagers industriels non-linéaires (fours à arc, variateurs de vitesse industriels, électrolyse ALUCAM) doivent installer des filtres anti-harmoniques passifs ou actifs.",
    compliance_condition_en: 'Non-linear industrial loads (arc furnaces, high-power VFDs, smelter pots) must integrate passive or active harmonic filters.',
    penalty_or_action_fr: "Mise en demeure par la SONATREL ou Eneo avec obligation d'installer des dispositifs de filtrage sous 90 jours sous peine de déconnexion.",
    penalty_or_action_en: 'Formal notice served by TSO/DSO requiring filter installation within 90 days or disconnection.',
    criticality: 'MEDIUM'
  }
];

// -------------------------------------------------------------
// DEFENSE PLAN: UNDER-FREQUENCY LOAD SHEDDING (UFLS) - RIS / RIN
// -------------------------------------------------------------
export const CAMEROON_UFLS_STAGES: UflsStage[] = [
  {
    stage: 1,
    frequency_threshold_hz: 49.00,
    time_delay_ms: 150,
    load_shedding_percentage: 15,
    cumulative_percentage: 15,
    description_fr: "Premier seuil de sécurité : délestage automatique rapide de départs MT 30 kV non-prioritaires dans les agglomérations de Douala et Yaoundé.",
    description_en: 'First security threshold: fast automated tripping of non-critical 30 kV MV feeders in Douala and Yaoundé metro areas.',
    targeted_substations: ['Postes Logbaba 30 kV', 'Postes Ngodi', 'Postes Kondengui', 'Postes Bafoussam']
  },
  {
    stage: 2,
    frequency_threshold_hz: 48.60,
    time_delay_ms: 150,
    load_shedding_percentage: 15,
    cumulative_percentage: 30,
    description_fr: "Deuxième seuil : délestage de départs industriels et tertiaires pour enrayer l'effondrement cinétique de la fréquence.",
    description_en: 'Second stage: disconnection of medium industrial and commercial feeders to arrest kinetic frequency decline.',
    targeted_substations: ['Postes Bonabéri MT', 'Postes Ahala MT', 'Postes Oyomabang MT', 'Postes Édéa Ville']
  },
  {
    stage: 3,
    frequency_threshold_hz: 48.20,
    time_delay_ms: 150,
    load_shedding_percentage: 15,
    cumulative_percentage: 45,
    description_fr: "Troisième seuil de défense : délestage de charge semi-prioritaire pour éviter l'ouverture en cascade des lignes 225 kV.",
    description_en: 'Third stage: semi-critical load shedding to prevent cascaded tripping of 225 kV transmission interconnectors.',
    targeted_substations: ['Postes Bassa 90/30 kV', 'Postes Nyom II', 'Postes Kribi Ville', 'Postes Limbé']
  },
  {
    stage: 4,
    frequency_threshold_hz: 47.80,
    time_delay_ms: 100,
    load_shedding_percentage: 15,
    cumulative_percentage: 60,
    description_fr: "Quatrième seuil extrême : dernier rempart avant l'îlotage total. Préservation absolue des groupes hydrauliques de Songloulou et Nachtigal.",
    description_en: 'Fourth extreme stage: final defense before total system separation. Preserves Nachtigal and Songloulou hydro turbines.',
    targeted_substations: ['Tous départs HTA non-hospitaliers et non-sécuritaires']
  }
];

// -------------------------------------------------------------
// ELECTRICITY TARIFF STRUCTURE (ARSEL REGULATORY FRAMEWORK)
// -------------------------------------------------------------
export const ARSEL_TARIFF_FRAMEWORK: TariffCategory[] = [
  {
    id: 'tar-bt',
    code: 'BT-DOM',
    voltage_class: 'BT',
    name_fr: 'Basse Tension - Usages Domestiques & Professionnels (230V / 400V)',
    name_en: 'Low Voltage - Domestic & Commercial Retails (230V / 400V)',
    description_fr: "Tarification progressive par tranches de consommation mensuelle. La tranche sociale bénéficie d'une subvention étatique directe et de l'exonération de TVA.",
    description_en: 'Progressive block tariff based on monthly consumption. Social block benefits from direct state subsidy and VAT exemption.',
    fixed_charge_fcfa: '0 FCFA (Compteur prépayé) / 1 200 FCFA/mois (Post-payé)',
    rates: [
      {
        bracket_name_fr: 'Tranche Sociale (0 - 110 kWh/mois)',
        bracket_name_en: 'Social Block (0 - 110 kWh/month)',
        rate_fcfa_per_kwh: 50,
        vat_applicable: false,
        notes_fr: 'Tarif subventionné, exonéré de TVA (19.25%) pour ménages à faible revenu.',
        notes_en: 'Subsidized rate, exempt from VAT (19.25%) targeted at low-income households.'
      },
      {
        bracket_name_fr: 'Tranche 1 (111 - 400 kWh/mois)',
        bracket_name_en: 'Block 1 (111 - 400 kWh/month)',
        rate_fcfa_per_kwh: 79,
        vat_applicable: true,
        notes_fr: 'Consommation domestique courante (TVA 19.25% applicable).',
        notes_en: 'Standard domestic consumption (Subject to 19.25% VAT).'
      },
      {
        bracket_name_fr: 'Tranche 2 (401 - 800 kWh/mois)',
        bracket_name_en: 'Block 2 (401 - 800 kWh/month)',
        rate_fcfa_per_kwh: 94,
        vat_applicable: true,
        notes_fr: 'Consommation élevée avec climatisation ou équipement résidentiel intensif.',
        notes_en: 'High residential consumption with air conditioning or intensive appliances.'
      },
      {
        bracket_name_fr: 'Tranche 3 (> 800 kWh/mois)',
        bracket_name_en: 'Block 3 (> 800 kWh/month)',
        rate_fcfa_per_kwh: 99,
        vat_applicable: true,
        notes_fr: 'Gros consommateurs résidentiels et petits commerces basse tension.',
        notes_en: 'Large residential consumers and commercial LV shops.'
      }
    ],
    power_factor_penalty_condition: 'Non applicable aux usagers basse tension.',
    billing_mechanism: 'Compteurs prépayés STS (recharge en code 20 chiffres) et compteurs télérelevés AMI post-payés.'
  },
  {
    id: 'tar-mt',
    code: 'MT-IND',
    voltage_class: 'MT',
    name_fr: 'Moyenne Tension (HTA 30 kV / 15 kV) - PME & Industries de Transformation',
    name_en: 'Medium Voltage (MV 30 kV / 15 kV) - SMEs & Manufacturing Industries',
    description_fr: "Tarif binôme horosaisonnier avec prime fixe mensuelle sur la puissance souscrite (kVA) et facturation de l'énergie active consommée selon 3 plages horaires.",
    description_en: 'Two-part time-of-use (TOU) tariff with monthly fixed demand charge on subscribed kVA and active energy charges across 3 daily time slots.',
    fixed_charge_fcfa: '3 750 FCFA / kW de puissance souscrite par mois',
    rates: [
      {
        bracket_name_fr: 'Heures Pleines (06h00 - 18h00)',
        bracket_name_en: 'Peak Daytime Hours (06:00 - 18:00)',
        rate_fcfa_per_kwh: 70,
        vat_applicable: true,
        notes_fr: 'Tarif moyen correspondant à l\'activité économique de journée.',
        notes_en: 'Base standard business day tariff.'
      },
      {
        bracket_name_fr: 'Heures de Pointe (18h00 - 23h00)',
        bracket_name_en: 'Evening Peak Hours (18:00 - 23:00)',
        rate_fcfa_per_kwh: 85,
        vat_applicable: true,
        notes_fr: 'Tarif le plus élevé pour inciter à l\'effacement industriel durant la pointe nationale.',
        notes_en: 'Highest rate designed to encourage industrial peak load-shifting during national peak.'
      },
      {
        bracket_name_fr: 'Heures Creuses (23h00 - 06h00)',
        bracket_name_en: 'Off-Peak Night Hours (23:00 - 06:00)',
        rate_fcfa_per_kwh: 55,
        vat_applicable: true,
        notes_fr: 'Tarif réduit pour inciter les industries de process continu à travailler la nuit.',
        notes_en: 'Discounted rate incentivizing continuous manufacturing processes at night.'
      }
    ],
    power_factor_penalty_condition: "Pénalité réactive : si tan φ > 0.40 (cos φ < 0.93), chaque kvarh excédentaire est facturé à 14.5 FCFA/kvarh.",
    billing_mechanism: "Compteurs électroniques 4 quadrants classe 0.5S avec enregistrement des courbes de charge à pas 10 ou 15 minutes."
  },
  {
    id: 'tar-ht-wheeling',
    code: 'HT-WHEELING',
    voltage_class: 'HT',
    name_fr: 'Haute Tension (HTB 225/90 kV) & Péage de Transport SONATREL',
    name_en: 'High Voltage (HV-B 225/90 kV) & SONATREL Transmission Wheeling Tariff',
    description_fr: "Tarif d'utilisation du réseau public de transport (TURPE / Wheeling Charge) approuvé par l'ARSEL pour les transactions de transit et grands comptes raccordés en HTB.",
    description_en: 'Transmission network use of system (TNUoS / Wheeling tariff) approved by ARSEL for bulk power transits and direct HV-B connected customers.',
    fixed_charge_fcfa: 'Redevance d\'accès au réseau HTB : 1 850 FCFA / kW / mois',
    rates: [
      {
        bracket_name_fr: 'Péage de transport d\'énergie injectée (Wheeling rate)',
        bracket_name_en: 'Transmission energy wheeling charge',
        rate_fcfa_per_kwh: 11.5,
        vat_applicable: true,
        notes_fr: 'Tarif rémunérant le service de transport opéré par la SONATREL par kWh transité.',
        notes_en: 'Wheeling tariff remunerating transmission infrastructure and dispatch services provided by SONATREL.'
      },
      {
        bracket_name_fr: 'Contrats PPA spécifiques Grands Industriels (ex: ALUCAM)',
        bracket_name_en: 'Specific PPA Industrial Contracts (e.g. ALUCAM Smelter)',
        rate_fcfa_per_kwh: 28.5,
        vat_applicable: false,
        notes_fr: 'Tarif conventionnel direct haute tension lié à la production dédiée Edéa/Songloulou.',
        notes_en: 'Negotiated direct bulk contract linked to dedicated Edéa/Songloulou hydro supply.'
      }
    ],
    power_factor_penalty_condition: "Exigence stricte de neutralité réactive ou fourniture programmée selon instructions du CNO.",
    billing_mechanism: 'Système centralisé de comptage transactionnel (SCMS) aux points frontières de livraison HTB.'
  }
];

// -------------------------------------------------------------
// REGIONAL INTERCONNECTIONS (PEAC & WAPP)
// -------------------------------------------------------------
export const REGIONAL_INTERCONNECTION_PROJECTS: RegionalInterconnectionProject[] = [
  {
    id: 'proj-pimert',
    name_fr: "Projet d'Interconnexion Électrique Cameroun - Tchad (PIMERT)",
    name_en: 'Cameroon - Chad Power Interconnection Project (PIMERT)',
    short_code: 'PIMERT-225',
    regional_pool: 'PEAC',
    participating_countries: ['Cameroun', 'Tchad'],
    voltage_kv: 225,
    route_and_length: "Ngaoundéré (Cameroun) -> Garoua -> Maroua -> Kousseri -> N'Djamena (Tchad) - Longueur totale : 1 024 km",
    transmission_capacity_mw: 400,
    commissioning_target: '2026 - 2027',
    strategic_objective_fr: "Évacuer l'excédent de production hydroélectrique propre du RIS (notamment Nachtigal 420 MW via la dorsale 225 kV RIS-RIN) vers le Grand Nord et exporter de l'énergie compétitive vers N'Djamena pour remplacer les groupes thermiques diesel coûteux du Tchad.",
    strategic_objective_en: 'Evacuate clean surplus hydro from the Southern Interconnected Grid (Nachtigal 420 MW via RIS-RIN 225 kV line) into the Grand North and export cheap power to N\'Djamena, replacing expensive thermal diesel generators.',
    financing_partners: ['Banque Mondiale (IDA)', 'Banque Africaine de Développement (BAD)', 'Union Européenne', 'Gouvernements Cameroun & Tchad'],
    current_status: 'UNDER_CONSTRUCTION'
  },
  {
    id: 'proj-ris-rin',
    name_fr: "Dorsale Nationale d'Interconnexion RIS - RIN (225 kV)",
    name_en: 'National RIS - RIN 225 kV Transmission Backbone',
    short_code: 'RIS-RIN-225',
    regional_pool: 'PEAC',
    participating_countries: ['Cameroun'],
    voltage_kv: 225,
    route_and_length: 'Nachtigal / Nyom II (Centre) -> Bafia -> Bafoussam -> Tibati -> Ngaoundéré - ~550 km',
    transmission_capacity_mw: 450,
    commissioning_target: '2027',
    strategic_objective_fr: "Unifier physiquement les deux grands réseaux électriques du pays (RIS au Sud et RIN au Nord) pour éliminer le déficit énergétique structurel du Grand Nord et préparer le corridor régional vers le Tchad.",
    strategic_objective_en: 'Physically interconnect the two major national power systems (RIS in the South and RIN in the North) to solve the structural northern generation deficit and feed the regional Chad export corridor.',
    financing_partners: ['Banque Mondiale (PIMERT)', 'BAD', 'Trésor Public'],
    current_status: 'UNDER_CONSTRUCTION'
  },
  {
    id: 'proj-cam-congo',
    name_fr: "Interconnexion Électrique Cameroun - Congo (Projet Barrage de Chollet)",
    name_en: 'Cameroon - Congo Power Interconnection (Chollet Hydro Dam)',
    short_code: 'CHOLLET-225',
    regional_pool: 'PEAC',
    participating_countries: ['Cameroun', 'Congo-Brazzaville'],
    voltage_kv: 225,
    route_and_length: 'Centrale transfrontalière de Chollet (600 MW sur la rivière Dja) -> Djoum -> Oyem -> Ouesso',
    transmission_capacity_mw: 600,
    commissioning_target: '2030+',
    strategic_objective_fr: "Créer un pôle de production hydroélectrique bi-national de 600 MW sur la frontière Sud du Cameroun avec lignes d'évacuation 225 kV vers le Cameroun et le Congo.",
    strategic_objective_en: 'Develop a 600 MW bi-national hydro generation hub on the Cameroon-Congo border with 225 kV evacuation lines to both power grids.',
    financing_partners: ['CEEAC / PEAC', 'Partenariat Public-Privé (PPP)', 'BAD'],
    current_status: 'STUDIES_COMPLETED'
  },
  {
    id: 'proj-cam-nigeria',
    name_fr: "Liaison Transfrontalière Cameroun - Nigéria (Interconnexion WAPP - PEAC)",
    name_en: 'Cameroon - Nigeria Cross-Border Interconnection (WAPP - PEAC Bridge)',
    short_code: 'CAM-NIG-330',
    regional_pool: 'WAPP',
    participating_countries: ['Cameroun', 'Nigéria'],
    voltage_kv: 330,
    route_and_length: 'Poste de Nkongsamba / Bafoussam -> Mamfé -> frontière Nigéria -> Calabar / Ikom',
    transmission_capacity_mw: 500,
    commissioning_target: 'Horizon 2030',
    strategic_objective_fr: "Pont stratégique d'interconnexion entre le West African Power Pool (WAPP) et le Pool Énergétique d'Afrique Centrale (PEAC) pour échanger des réserves tournantes et du secours mutuel.",
    strategic_objective_en: 'Strategic bridge linking the West African Power Pool (WAPP) and Central Africa Power Pool (CAPP) for operating reserve exchanges and mutual emergency assistance.',
    financing_partners: ['Banque Africaine de Développement (BAD)', 'NEPAD'],
    current_status: 'PLANNING'
  }
];

// -------------------------------------------------------------
// ENVIRONMENTAL & LAND CLEARANCE REGULATIONS (SERVITUDES)
// -------------------------------------------------------------
export const ENVIRONMENTAL_RIGHT_OF_WAYS: EnvironmentalRightOfWay[] = [
  {
    voltage_level: '225 kV (HTB)',
    right_of_way_width_m: 50,
    half_corridor_m: 25,
    clearance_ground_m: 8.5,
    tree_restriction_height_m: 3.5,
    legal_reference: 'Loi N° 2011/022 & Décret N° 2013/0171/PM fixant les servitudes des lignes électriques',
    rules_fr: [
      "Interdiction absolue de construction de tout bâtiment d'habitation, commercial ou industriel dans le couloir de 50 m.",
      "Abattage systématique de tout arbre dont la hauteur à maturité pourrait menacer la ligne en cas de chute.",
      "Garde au sol minimale sous flèche maximale (conducteur à 75°C) : 8.50 m en rase campagne, 10.0 m aux croisements routiers.",
      "Distance minimale de sécurité aux pylônes : 15 m de non-fouille pour préserver les massifs de fondation."
    ],
    rules_en: [
      'Strict prohibition of any residential, commercial or industrial buildings within the 50 m corridor.',
      'Mandatory clearing of all trees whose mature height exceeds safe distance upon felling.',
      'Minimum ground clearance under maximum sag (conductor at 75°C): 8.50 m in rural areas, 10.0 m across paved roads.',
      'Minimum security buffer from tower footings: 15 m no-dig zone to safeguard foundation pads.'
    ]
  },
  {
    voltage_level: '90 kV (HTB)',
    right_of_way_width_m: 30,
    half_corridor_m: 15,
    clearance_ground_m: 7.0,
    tree_restriction_height_m: 3.0,
    legal_reference: 'Décret sur les servitudes de transport d\'énergie électrique',
    rules_fr: [
      "Couloir de servitude non-constructible de 30 m (15 m de part et d'autre de l'axe des pylônes).",
      "Élagage régulier des végétaux pour maintenir une distance minimale de 4.0 m sous les conducteurs.",
      "Garde au sol minimale : 7.0 m en zone rurale, 8.5 m en traversée d'agglomération ou voirie."
    ],
    rules_en: [
      'Non-building right of way corridor of 30 m (15 m on either side of line centerline).',
      'Scheduled vegetation trimming maintaining a minimum clearance of 4.0 m below conductors.',
      'Minimum ground clearance: 7.0 m in rural terrain, 8.5 m across settlements or roads.'
    ]
  },
  {
    voltage_level: '30 kV (HTA)',
    right_of_way_width_m: 15,
    half_corridor_m: 7.5,
    clearance_ground_m: 6.0,
    tree_restriction_height_m: 2.5,
    legal_reference: 'Norme NF C 11-201 / Règlement de Distribution Eneo',
    rules_fr: [
      "Couloir de protection de 15 m le long des lignes aériennes MT sur supports béton ou bois.",
      "Garde au sol minimale : 6.0 m au-dessus du sol, 7.0 m au-dessus des voies ferrées et autoroutes.",
      "Distances d'approche minimale de sécurité pour les personnes et engins : 3.0 m en 30 kV."
    ],
    rules_en: [
      '15 m protective strip along overhead MV lines on concrete or wooden poles.',
      'Minimum ground clearance: 6.0 m above terrain, 7.0 m above rail tracks and main roads.',
      'Minimum electrical approach safety distance for personnel and machinery: 3.0 m at 30 kV.'
    ]
  }
];
