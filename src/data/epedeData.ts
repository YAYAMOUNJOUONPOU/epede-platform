// src/data/epedeData.ts
// Comprehensive EPEDE dataset based on Architecture v1.1 and Design Brief v2.0

import type {
  Domain,
  Subdomain,
  Layer,
  Equipment,
  Edge,
  Standard,
  Role,
  Formula,
  SubdomainContent
} from '../types/epede';

export const DOMAINS: Domain[] = [
  // PHYSICAL CHAIN (D01 -> D06)
  {
    id: 'dom-01',
    code: 'D01',
    name_fr: 'Energy Resources & Generation',
    name_en: 'Energy Resources & Generation',
    short_fr: 'Production',
    short_en: 'Generation',
    description_fr: 'Production d\'énergie électrique, technologies primaires et systèmes auxiliaires de centrale.',
    description_en: 'Electric power generation, primary energy conversion technologies and plant auxiliary systems.',
    icon: 'Zap',
    color: '1E3A5F',
    domain_group: 'chain',
    sort_order: 1,
    chain_position: 1,
  },
  {
    id: 'dom-02',
    code: 'D02',
    name_fr: 'Power-System Architecture & Grid Planning',
    name_en: 'Power-System Architecture & Grid Planning',
    short_fr: 'Architecture Réseau',
    short_en: 'Grid Planning',
    description_fr: 'Topologie de réseau, planification long terme, équilibre offre-demande et études de stabilité.',
    description_en: 'Grid topology, long-term transmission planning, generation-load balance and dynamic stability.',
    icon: 'Map',
    color: '1D4ED8',
    domain_group: 'chain',
    sort_order: 2,
    chain_position: 2,
  },
  {
    id: 'dom-03',
    code: 'D03',
    name_fr: 'Transmission Networks',
    name_en: 'Transmission Networks',
    short_fr: 'Transport HT',
    short_en: 'Transmission',
    description_fr: 'Lignes aériennes et câbles souterrains Très Haute et Haute Tension (400 kV, 225 kV, 90 kV).',
    description_en: 'Overhead lines and underground cables for Extra High and High Voltage bulk transmission.',
    icon: 'Cable',
    color: '374151',
    domain_group: 'chain',
    sort_order: 3,
    chain_position: 3,
  },
  {
    id: 'dom-04',
    code: 'D04',
    name_fr: 'Substations & Grid Nodes',
    name_en: 'Substations & Grid Nodes',
    short_fr: 'Postes',
    short_en: 'Substations',
    description_fr: 'Postes électriques AIS et GIS, transformateurs de puissance, jeux de barres et appareillage HT.',
    description_en: 'Air-insulated and gas-insulated substations, power transformers, busbars and HV switchgear.',
    icon: 'Building2',
    color: '7C3AED',
    domain_group: 'chain',
    sort_order: 4,
    chain_position: 4,
  },
  {
    id: 'dom-05',
    code: 'D05',
    name_fr: 'Distribution Networks',
    name_en: 'Distribution Networks',
    short_fr: 'Distribution',
    short_en: 'Distribution',
    description_fr: 'Réseaux Moyenne Tension (30 kV / 15 kV) et Basse Tension (400 V), postes HTA/BT et distribution urbaine/rurale.',
    description_en: 'Medium Voltage (30 kV / 15 kV) and Low Voltage (400 V) networks, distribution substations and feeders.',
    icon: 'Network',
    color: 'D97706',
    domain_group: 'chain',
    sort_order: 5,
    chain_position: 5,
  },
  {
    id: 'dom-06',
    code: 'D06',
    name_fr: 'Electrical Installations & Utilization',
    name_en: 'Electrical Installations & Utilization',
    short_fr: 'Installations',
    short_en: 'Installations',
    description_fr: 'Installations intérieures tertiaires et résidentielles, armoires TGBT, régimes de neutre et usages finaux.',
    description_en: 'Commercial and residential installations, main switchboards (LV), earthing systems and end-use equipment.',
    icon: 'Building',
    color: '065F46',
    domain_group: 'chain',
    sort_order: 6,
    chain_position: 6,
  },

  // ENGINEERING DISCIPLINES (D07 -> D16)
  {
    id: 'dom-07',
    code: 'D07',
    name_fr: 'Automatisme Industriel, DCS & Variateurs (VFD)',
    name_en: 'Industrial Automation, DCS & Drives',
    short_fr: 'Automatisme Ind.',
    short_en: 'Ind. Automation',
    description_fr: 'Automates programmables (API/PLC), architectures DCS, variateurs de vitesse (VFD), régulation PID, bus de terrain (Modbus, Profinet, EtherCAT) et commande de procédés industriels.',
    description_en: 'Industrial PLCs, DCS architectures, variable frequency drives (VFDs), PID control loops, industrial fieldbuses (Modbus, Profinet, EtherCAT) and industrial process control.',
    icon: 'Cpu',
    color: '06B6D4',
    domain_group: 'discipline',
    sort_order: 7,
    chain_position: null,
  },
  {
    id: 'dom-08',
    code: 'D08',
    name_fr: 'Courants Faibles & Systèmes Spéciaux',
    name_en: 'Extra Low Voltage & Special Systems',
    short_fr: 'Courants Faibles',
    short_en: 'ELV Systems',
    description_fr: 'Réseaux informatiques, vidéosurveillance CCTV, contrôle d\'accès, détection incendie SSI, sonorisation et sécurité électronique.',
    description_en: 'Structured cabling, CCTV surveillance, access control, fire alarm systems (SSI), voice evacuation and electronic security.',
    icon: 'Network',
    color: 'E8A825',
    domain_group: 'discipline',
    sort_order: 8,
    chain_position: null,
  },
  {
    id: 'dom-09',
    code: 'D09',
    name_fr: 'Intelligence Artificielle & Technologies Avancées',
    name_en: 'Artificial Intelligence & Advanced Technologies',
    short_fr: 'IA & Tech Avancées',
    short_en: 'AI & Advanced Tech',
    description_fr: 'Maintenance prédictive IA, jumeau numérique (Digital Twin), IoT industriel, cybersécurité OT, cloud et smart grid.',
    description_en: 'Predictive maintenance AI, Digital Twin, Industrial IoT, OT cybersecurity, cloud platforms and smart grid.',
    icon: 'Sparkles',
    color: '6366F1',
    domain_group: 'discipline',
    sort_order: 9,
    chain_position: null,
  },
  {
    id: 'dom-10',
    code: 'D10',
    name_fr: 'Energy Storage & Charging',
    name_en: 'Energy Storage & Charging',
    short_fr: 'Stockage',
    short_en: 'Storage',
    description_fr: 'Systèmes BESS Li-ion, batteries stationnaires, infrastructures de recharge VE et contrôle BMS.',
    description_en: 'Battery energy storage systems (BESS), utility battery chemistry, EV charging stations and BMS controls.',
    icon: 'BatteryCharging',
    color: '1D4ED8',
    domain_group: 'discipline',
    sort_order: 10,
    chain_position: null,
  },
  {
    id: 'dom-11',
    code: 'D11',
    name_fr: 'Protection, Measurements & System Studies',
    name_en: 'Protection, Measurements & System Studies',
    short_fr: 'Protection',
    short_en: 'Protection',
    description_fr: 'Relais numériques (87, 21, 50/51, 67), études de court-circuit, coordination sélective et transformateurs de mesure.',
    description_en: 'Digital protection relays (87, 21, 50/51, 67), short-circuit fault studies, selectivity and instrument transformers.',
    icon: 'ShieldAlert',
    color: '991B1B',
    domain_group: 'discipline',
    sort_order: 11,
    chain_position: null,
  },
  {
    id: 'dom-12',
    code: 'D12',
    name_fr: 'Téléconduite, SAS & Contrôle-Commande de Poste',
    name_en: 'Substation Automation Systems (SAS) & Telecontrol',
    short_fr: 'Téléconduite & SAS',
    short_en: 'Substation SAS',
    description_fr: 'Systèmes d\'automatisation de postes électriques (SAS), calculateurs de tranche (BCU), passerelles téléconduite RTU, synchrocoupleurs et protocoles CEI 61850 (MMS, GOOSE).',
    description_en: 'Substation Automation Systems (SAS), Bay Control Units (BCUs), remote terminal units (RTUs), automatic synchronizers, and IEC 61850 station bus & process bus digital architectures.',
    icon: 'Cpu',
    color: '0D9488',
    domain_group: 'discipline',
    sort_order: 12,
    chain_position: null,
  },
  {
    id: 'dom-13',
    code: 'D13',
    name_fr: 'Communications & Operational Technology',
    name_en: 'Communications & Operational Technology',
    short_fr: 'Communications',
    short_en: 'Communications',
    description_fr: 'Protocoles CEI 61850 (GOOSE, MMS, SV), CEI 60870-5-104, DNP3, fibre optique OPGW et cybersécurité OT.',
    description_en: 'IEC 61850 communications, substation LAN, IEC 60870-5-104, OPGW telemetry and critical OT cybersecurity.',
    icon: 'Radio',
    color: '0E7490',
    domain_group: 'discipline',
    sort_order: 13,
    chain_position: null,
  },
  {
    id: 'dom-14',
    code: 'D14',
    name_fr: 'Power Quality & EMC',
    name_en: 'Power Quality & EMC',
    short_fr: 'Qualité Énergie',
    short_en: 'Power Quality',
    description_fr: 'Harmoniques de tension/courant, creux de tension, flicker, compensation réactive et filtres actifs.',
    description_en: 'Voltage harmonics, THD, voltage sags, flicker, reactive compensation, STATCOM and active filters.',
    icon: 'Activity',
    color: '7C3AED',
    domain_group: 'discipline',
    sort_order: 14,
    chain_position: null,
  },
  {
    id: 'dom-15',
    code: 'D15',
    name_fr: 'Metering, Smart Grids & Grid Digitalization',
    name_en: 'Metering, Smart Grids & Grid Digitalization',
    short_fr: 'Smart Grid',
    short_en: 'Smart Grid',
    description_fr: 'Comptage communicant AMI, compteurs à prépaiement, plateformes MDM et surveillance intelligente du réseau.',
    description_en: 'Advanced Metering Infrastructure (AMI), prepayment smart meters, MDM platforms and digital grid twin.',
    icon: 'Gauge',
    color: '065F46',
    domain_group: 'discipline',
    sort_order: 15,
    chain_position: null,
  },
  {
    id: 'dom-16',
    code: 'D16',
    name_fr: 'Electrical Safety, Earthing & Lightning',
    name_en: 'Electrical Safety, Earthing & Lightning',
    short_fr: 'Sécurité Élec.',
    short_en: 'Elec Safety',
    description_fr: 'Prises de terre, tensions de pas et de toucher, protections contre la foudre, habilitations et analyse d\'arc flash.',
    description_en: 'Substation earthing grids, step & touch voltage, lightning protection (LPS), NFPA 70E arc flash safety.',
    icon: 'ShieldCheck',
    color: '7F1D1D',
    domain_group: 'discipline',
    sort_order: 16,
    chain_position: null,
  },
];

export const LAYERS: Layer[] = [
  {
    id: 'lay-01',
    code: 'L01',
    name_fr: 'Standards & Compliance',
    name_en: 'Standards & Compliance',
    description_fr: 'Référentiel des normes internationales CEI / IEEE et réglementations nationales (Cameroun ARSEL, NF C).',
    description_en: 'Registry of international IEC / IEEE standards and regional compliance codes (Cameroon ARSEL, NF C).',
    icon: 'FileText',
    color: '92400E',
    sort_order: 1,
  },
  {
    id: 'lay-02',
    code: 'L02',
    name_fr: 'Engineering Roles & Skills',
    name_en: 'Engineering Roles & Skills',
    description_fr: 'Cartographie des métiers d\'ingénierie électrique, compétences techniques requises, outils et parcours.',
    description_en: 'Engineering career matrix, technical competency requirements, modeling tools and professional paths.',
    icon: 'UserCheck',
    color: '1D4ED8',
    sort_order: 2,
  },
  {
    id: 'lay-03',
    code: 'L03',
    name_fr: 'Project Lifecycle',
    name_en: 'Project Lifecycle',
    description_fr: 'Phases des projets électriques : Études de faisabilité, FEED, Ingénierie détaillée, Réception usine (FAT/SAT), Mise en service.',
    description_en: 'Power project lifecycle: Feasibility, FEED, Detailed EPC, Factory/Site Acceptance (FAT/SAT), Commissioning, O&M.',
    icon: 'RefreshCw',
    color: '374151',
    sort_order: 3,
  },
  {
    id: 'lay-04',
    code: 'L04',
    name_fr: 'Digital Engineering & Knowledge Services',
    name_en: 'Digital Engineering & Knowledge Services',
    description_fr: 'Jumeaux numériques, outils de simulation (ETAP, PSS/E, DIgSILENT PowerFactory), méthodologies BIM électrique.',
    description_en: 'Digital twins, power system simulation suites (ETAP, PSS/E, PowerFactory) and engineering databases.',
    icon: 'Binary',
    color: '1E3A5F',
    sort_order: 4,
  },
  {
    id: 'lay-05',
    code: 'L05',
    name_fr: 'Applications & Reference Cases',
    name_en: 'Applications & Reference Cases',
    description_fr: 'Cas d\'études industriels réels et installations de référence, avec un ancrage prioritaire sur le réseau camerounais.',
    description_en: 'Real-world industrial case studies and power infrastructure benchmarks, focusing on the Cameroon national grid.',
    icon: 'Globe',
    color: '065F46',
    sort_order: 5,
  },
  {
    id: 'lay-06',
    code: 'L06',
    name_fr: 'Geographic & Regulatory Context',
    name_en: 'Geographic & Regulatory Context',
    description_fr: 'Institutions du secteur électrique (SONATREL, Eneo, ARSEL, EDC, PEAC, WAPP), codes de réseau et tarifs.',
    description_en: 'Power sector governance (SONATREL, Eneo, ARSEL, EDC, Central/West Africa Power Pools) and grid codes.',
    icon: 'Compass',
    color: '4B5563',
    sort_order: 6,
  },
];

// SUBDOMAINS FOR D01 (All 10 required subdomains)
export const D01_SUBDOMAINS: Subdomain[] = [
  {
    id: 'sub-d01-01',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.01',
    name_fr: 'Production Hydroélectrique',
    name_en: 'Hydroelectric Generation',
    description_fr: 'Centrales au fil de l\'eau, à retenue et stations de pompage-turbinage (STEP). Turbines Francis, Pelton, Kaplan.',
    description_en: 'Run-of-river, reservoir dams and pumped-storage power plants. Francis, Pelton and Kaplan hydro turbines.',
    sort_order: 1,
  },
  {
    id: 'sub-d01-02',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.02',
    name_fr: 'Production Thermique (Gaz/Vapeur/Diesel/CCGT)',
    name_en: 'Thermal Generation (Gas/Steam/Diesel/CCGT)',
    description_fr: 'Centrales à cycle combiné gaz (CCGT), turbines à vapeur, moteurs diesel d\'appoint et groupes électrogènes lourds.',
    description_en: 'Combined cycle gas turbines (CCGT), steam turbines, industrial diesel generators and peaking plants.',
    sort_order: 2,
  },
  {
    id: 'sub-d01-03',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.03',
    name_fr: 'Production Nucléaire',
    name_en: 'Nuclear Generation',
    description_fr: 'Réacteurs à eau pressurisée (REP), SMR (Small Modular Reactors) et cycles thermochimiques associés.',
    description_en: 'Pressurized water reactors (PWR), boiling water reactors (BWR), SMRs and associated steam systems.',
    sort_order: 3,
  },
  {
    id: 'sub-d01-04',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.04',
    name_fr: 'Production Solaire PV',
    name_en: 'Solar PV Generation',
    description_fr: 'Champs photovoltaïques au sol grande puissance, onduleurs centraux ou de chaîne, trackers uniaxiaux.',
    description_en: 'Utility-scale ground-mounted PV arrays, central and string inverters, single-axis solar tracking.',
    sort_order: 4,
  },
  {
    id: 'sub-d01-05',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.05',
    name_fr: 'Production Éolienne',
    name_en: 'Wind Generation',
    description_fr: 'Aérogénérateurs terrestres et offshore, génératrices asynchrones à double alimentation (DFIG) et PMSG.',
    description_en: 'Onshore and offshore wind turbines, doubly-fed induction generators (DFIG) and permanent magnet synch.',
    sort_order: 5,
  },
  {
    id: 'sub-d01-06',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.06',
    name_fr: 'Biomasse & Biogaz',
    name_en: 'Biomass & Biogas',
    description_fr: 'Cogénération agro-industrielle (bagasse, déchets de bois), méthaniseurs et turbines à vapeur associées.',
    description_en: 'Agro-industrial cogeneration (bagasse, wood waste), anaerobic digesters and dedicated biomass turbines.',
    sort_order: 6,
  },
  {
    id: 'sub-d01-07',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.07',
    name_fr: 'Géothermie',
    name_en: 'Geothermal',
    description_fr: 'Extraction de vapeur géothermique haute enthalpie, cycles binaires ORC et conversion thermodynamique.',
    description_en: 'High enthalpy geothermal flash steam, binary Organic Rankine Cycles (ORC) and power generation.',
    sort_order: 7,
  },
  {
    id: 'sub-d01-08',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.08',
    name_fr: 'Énergies Marines',
    name_en: 'Marine Energy',
    description_fr: 'Hydroliennes, énergie houlomotrice (vagues) et énergie thermique des mers (ETM).',
    description_en: 'Tidal stream turbines, wave energy converters and ocean thermal energy conversion (OTEC).',
    sort_order: 8,
  },
  {
    id: 'sub-d01-09',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.09',
    name_fr: 'Technologies Émergentes & Piles à Combustible',
    name_en: 'Emerging Technologies & Fuel Cells',
    description_fr: 'Piles à combustible stationnaires hydrogène (PEMFC, SOFC), turbines à hydrogène pur et fusions avancées.',
    description_en: 'Stationary hydrogen fuel cells (PEMFC, SOFC), pure H2 combustion turbines and micro-turbines.',
    sort_order: 9,
  },
  {
    id: 'sub-d01-10',
    domain_id: 'dom-01',
    domain_code: 'D01',
    code: 'D01.10',
    name_fr: 'Systèmes Électriques de Centrale & Auxiliaires',
    name_en: 'Plant Electrical Systems & Auxiliaries',
    description_fr: 'Transformateurs élévateurs GSU, jeux de barres d\'évacuation, tableaux des auxiliaires (BT/MT), groupes diesel de secours.',
    description_en: 'Generator step-up (GSU) transformers, generator circuit breakers, plant auxiliary boards and black-start diesels.',
    sort_order: 10,
  },
];

// SUBDOMAINS FOR OTHER DOMAINS (Phase 2 Expansion: Comprehensive D02 through D16 coverage)
export const OTHER_SUBDOMAINS: Subdomain[] = [
  // D02: Power-System Architecture & Grid Planning
  {
    id: 'sub-d02-01',
    domain_id: 'dom-02',
    domain_code: 'D02',
    code: 'D02.01',
    name_fr: 'Planification Réseau & Critère N-1',
    name_en: 'Grid Planning & N-1 Security Criteria',
    description_fr: 'Critères de redondance déterministes (N-1), études d\'impact d\'intégration EnR, évacuation Nachtigal et renforcement RIS.',
    description_en: 'Deterministic N-1 contingency criteria, RES integration studies, Nachtigal power evacuation and RIS grid expansion.',
    sort_order: 1,
  },
  {
    id: 'sub-d02-02',
    domain_id: 'dom-02',
    domain_code: 'D02',
    code: 'D02.02',
    name_fr: 'Calcul de Répartition des Charges (Load Flow)',
    name_en: 'Load Flow Analysis & Power Flow',
    description_fr: 'Méthodes Newton-Raphson et Fast Decoupled, profils de tension aux nœuds 225/90 kV et compensation réactive.',
    description_en: 'Newton-Raphson and Fast Decoupled algorithms, 225/90 kV nodal voltage profiles and reactive compensation.',
    sort_order: 2,
  },
  {
    id: 'sub-d02-03',
    domain_id: 'dom-02',
    domain_code: 'D02',
    code: 'D02.03',
    name_fr: 'Stabilité Dynamique & Transitoire du Réseau',
    name_en: 'Dynamic & Transient Stability',
    description_fr: 'Temps critique d\'élimination de défaut (CCT), équation d\'oscillation du rotor, stabilité de tension et de fréquence.',
    description_en: 'Critical clearing time (CCT), swing equation, voltage collapse margins and frequency rate of change (RoCoF).',
    sort_order: 3,
  },

  // D03: Transmission Networks
  {
    id: 'sub-d03-01',
    domain_id: 'dom-03',
    domain_code: 'D03',
    code: 'D03.01',
    name_fr: 'Lignes Aériennes HTB 225 kV & Pylônes',
    name_en: '225 kV Overhead Lines & Lattice Towers',
    description_fr: 'Pylônes treillis tétrapodes, faisceaux de conducteurs Aster 570, portées critiques et câbles de garde OPGW.',
    description_en: 'Self-supporting steel lattice towers, Aster 570 bundle conductors, long-span crossings and OPGW shield wire.',
    sort_order: 1,
  },
  {
    id: 'sub-d03-02',
    domain_id: 'dom-03',
    domain_code: 'D03',
    code: 'D03.02',
    name_fr: 'Câbles Souterrains Haute Tension',
    name_en: 'HV Underground Cable Systems',
    description_fr: 'Câbles XLPE unipolaires 90/225 kV, perméabilité thermique du sol, boîtes d\'extrémité et mise à la terre Cross-bonding.',
    description_en: 'Single-core 90/225 kV XLPE insulated cables, soil thermal resistivity, GIS terminations and cross-bonding.',
    sort_order: 2,
  },
  {
    id: 'sub-d03-03',
    domain_id: 'dom-03',
    domain_code: 'D03',
    code: 'D03.03',
    name_fr: 'Impédance Caractéristique & Puissance Naturelle (SIL)',
    name_en: 'Surge Impedance Loading (SIL) & Ferranti',
    description_fr: 'Effet Ferranti sur lignes à vide, puissance naturelle P_SIL = V²/Zc, modélisation en Pi et compensation shunt.',
    description_en: 'No-load Ferranti overvoltage, surge impedance loading P_SIL = V²/Zc, nominal-Pi model and shunt reactor sizing.',
    sort_order: 3,
  },

  // D04: Substations & Grid Nodes
  {
    id: 'sub-d04-01',
    domain_id: 'dom-04',
    domain_code: 'D04',
    code: 'D04.01',
    name_fr: 'Postes Haute Tension AIS & GIS',
    name_en: 'Air & Gas Insulated Substations',
    description_fr: 'Topologies en simple/double jeu de barres, disjoncteurs, sectionneurs et postes blindés SF6.',
    description_en: 'Single/double busbar topologies, circuit breakers, disconnectors and SF6 gas-insulated switchgear.',
    sort_order: 1,
  },
  {
    id: 'sub-d04-02',
    domain_id: 'dom-04',
    domain_code: 'D04',
    code: 'D04.02',
    name_fr: 'Transformateurs de Puissance & Régleurs',
    name_en: 'Power Transformers & Tap Changers',
    description_fr: 'Autotransformateurs 225/90 kV, transformateurs abaisseurs HTA 225/30 kV, régleurs en charge OLTC.',
    description_en: 'Interconnection autotransformers, step-down power transformers 225/30 kV and on-load tap changers.',
    sort_order: 2,
  },
  {
    id: 'sub-d04-03',
    domain_id: 'dom-04',
    domain_code: 'D04',
    code: 'D04.03',
    name_fr: 'Appareillage de Coupure & Sectionnement HT',
    name_en: 'HV Switchgear & Disconnectors',
    description_fr: 'Disjoncteurs SF6 à autosoufflage, sectionneurs à deux colonnes rotatives et sectionneurs de terre rapides.',
    description_en: 'Self-blast SF6 circuit breakers, two-column rotary disconnectors and fast-acting earthing switches.',
    sort_order: 3,
  },

  // D05: Distribution Networks
  {
    id: 'sub-d05-01',
    domain_id: 'dom-05',
    domain_code: 'D05',
    code: 'D05.01',
    name_fr: 'Réseaux Moyenne Tension HTA 30 kV',
    name_en: '30 kV Medium Voltage Distribution Networks',
    description_fr: 'Départs radiaux et bouclés ouverts 30 kV Eneo, conducteurs nus Almélec et câbles torsadés isolés.',
    description_en: 'Eneo 30 kV radial and open-loop distribution feeders, Almelec bare conductors and bundled aerial cables.',
    sort_order: 1,
  },
  {
    id: 'sub-d05-02',
    domain_id: 'dom-05',
    domain_code: 'D05',
    code: 'D05.02',
    name_fr: 'Postes de Transformation HTA/BT (Kiosques & Poteaux)',
    name_en: 'MV/LV Distribution Substations (Pad-Mounted & Pole)',
    description_fr: 'Postes cabines maçonnées, postes kiosques compacts préfabriqués 630 kVA et transformateurs sur poteau H61 50-160 kVA.',
    description_en: 'Compact pad-mounted kiosks up to 630 kVA, pole-mounted H61 transformers (50-160 kVA) and Ring Main Units (RMU).',
    sort_order: 2,
  },
  {
    id: 'sub-d05-03',
    domain_id: 'dom-05',
    domain_code: 'D05',
    code: 'D05.03',
    name_fr: 'Automatisation de Réseau & Réenclencheurs',
    name_en: 'Feeder Automation & Auto-Reclosers',
    description_fr: 'Disjoncteurs réenclencheurs aériens (Reclosers), interrupteurs aériens télécommandés (IAT) et coordination de boucle.',
    description_en: 'Pole-mounted vacuum auto-reclosers, remote-controlled sectionalizers, FDIR loop automation and FLISR.',
    sort_order: 3,
  },

  // D06: Electrical Installations & Utilization
  {
    id: 'sub-d06-01',
    domain_id: 'dom-06',
    domain_code: 'D06',
    code: 'D06.01',
    name_fr: 'Tableaux Généraux Basse Tension (TGBT)',
    name_en: 'Main Low Voltage Switchboards (TGBT)',
    description_fr: 'Armoires de distribution BT 400 V, disjoncteurs ouverts débrochables (ACB), formes de séparation 2b/4b.',
    description_en: 'Main 400 V distribution switchboards, air circuit breakers (ACB), form 2b/4b internal segregation and busbar trunks.',
    sort_order: 1,
  },
  {
    id: 'sub-d06-02',
    domain_id: 'dom-06',
    domain_code: 'D06',
    code: 'D06.02',
    name_fr: 'Régimes de Neutre Basse Tension (TT, TN, IT)',
    name_en: 'LV Earthing Systems (TT, TN, IT)',
    description_fr: 'Sélection et dimensionnement des schémas de liaison à la terre selon NF C 15-100 / CEI 60364, protection différentielle.',
    description_en: 'Selection and sizing of earthing systems per IEC 60364, residual current devices (RCD) and fault loop impedances.',
    sort_order: 2,
  },
  {
    id: 'sub-d06-03',
    domain_id: 'dom-06',
    domain_code: 'D06',
    code: 'D06.03',
    name_fr: 'Entraînements Industriels & Moteurs Asynchrones',
    name_en: 'Industrial Drives & Induction Motors',
    description_fr: 'Démarrage direct, étoile-triangle, démarreurs progressifs et variateurs de fréquence (VFD) pour pompes et compresseurs.',
    description_en: 'Direct-on-line, star-delta, soft starters and variable frequency drives (VFD) powering heavy industrial pumps.',
    sort_order: 3,
  },

  // D07: Automation, Control Systems & Industrial Safety
  {
    id: 'sub-d07-01',
    domain_id: 'dom-07',
    domain_code: 'D07',
    code: 'D07.01',
    name_fr: 'Automates Programmables (PLC) & Logique CEI 61131-3',
    name_en: 'Programmable Logic Controllers & IEC 61131-3 Logic',
    description_fr: 'Architectures PLC/PAC, programmation Ladder (LD), Structured Text (ST), Grafcet SFC, temps de cycle scan et régulation PID.',
    description_en: 'PLC/PAC architectures, Ladder Diagram (LD), Structured Text (ST), Grafcet SFC, cyclic scan time and PID closed-loop control.',
    sort_order: 1,
  },
  {
    id: 'sub-d07-02',
    domain_id: 'dom-07',
    domain_code: 'D07',
    code: 'D07.02',
    name_fr: 'Variateurs VFD, Réseaux Industriels & Sécurité SIL',
    name_en: 'VFD Inverters, Industrial Fieldbuses & SIL Safety',
    description_fr: 'Variateurs de fréquence (FOC/DTC), filtres dV/dt, bus Profinet IRT/Modbus TCP, instrumentation 4-20 mA HART et systèmes instrumentés de sécurité (SIS/SIL 2 & 3).',
    description_en: 'Variable frequency drives (FOC/DTC), dV/dt filters, Profinet IRT/Modbus TCP fieldbuses, 4-20 mA HART instrumentation and safety instrumented systems (SIS/SIL 2 & 3).',
    sort_order: 2,
  },

  // D08: Extra Low Voltage & Special Systems (Courants Faibles)
  {
    id: 'sub-d08-01',
    domain_id: 'dom-08',
    domain_code: 'D08',
    code: 'D08.01',
    name_fr: 'Câblage Structuré & Réseaux Optiques (TIA-568 / ISO 11801)',
    name_en: 'Structured Cabling & Optical Networks (TIA-568 / ISO 11801)',
    description_fr: 'Câblage cuivre Cat 6/6A, PoE 802.3bt, fibre optique OS2/OM4, bilan de liaison optique et réflectométrie OTDR.',
    description_en: 'Copper Cat 6/6A cabling, PoE 802.3bt, OS2/OM4 optical fiber, optical link budget and OTDR certification.',
    sort_order: 1,
  },
  {
    id: 'sub-d08-02',
    domain_id: 'dom-08',
    domain_code: 'D08',
    code: 'D08.02',
    name_fr: 'Sécurité Électronique, SSI Incendie & GTB (EN 54 / EN 62676)',
    name_en: 'Electronic Security, Fire Life Safety & BMS (EN 54 / EN 62676)',
    description_fr: 'Vidéosurveillance IP H.265+ & RAID, critères DORI, contrôle d\'accès sécurisé par sas, détection incendie SSI Cat. A et GTB BACnet.',
    description_en: 'IP CCTV H.265+ & RAID, DORI optics, airlock access control, fire alarm SSI Cat. A and BACnet IP building management systems.',
    sort_order: 2,
  },

  // D09: Artificial Intelligence & Advanced Technologies (IA & Technologies Avancées)
  {
    id: 'sub-d09-01',
    domain_id: 'dom-09',
    domain_code: 'D09',
    code: 'D09.01',
    name_fr: 'IA, Maintenance Prédictive & Jumeaux Numériques (CEI 60076-7 / ISO 10816)',
    name_en: 'AI, Predictive Maintenance & Digital Twins (IEC 60076-7 / ISO 10816)',
    description_fr: 'Réseaux de neurones pour diagnostic DGA transformateur (Triangle de Duval 1), jumeau thermique PINN, analyse spectrale vibratoire FFT et prédiction RUL.',
    description_en: 'Neural networks for transformer DGA diagnostics (Duval Triangle 1), PINN thermal digital twins, FFT vibration spectral analysis and RUL prognosis.',
    sort_order: 1,
  },
  {
    id: 'sub-d09-02',
    domain_id: 'dom-09',
    domain_code: 'D09',
    code: 'D09.02',
    name_fr: 'Edge IIoT, Vision Drone & Cybersécurité OT (CEI 62443 / MITRE ICS)',
    name_en: 'Edge IIoT, Drone Computer Vision & OT Cybersecurity (IEC 62443 / MITRE ICS)',
    description_fr: 'Inspection automatisée par drone de lignes 225 kV (YOLOv8), détection d\'intrusion réseau SCADA par DPI (CEI 104, GOOSE, Modbus) et détection de fraude.',
    description_en: 'Drone automated 225 kV transmission line inspection (YOLOv8), SCADA deep packet inspection (IEC 104, GOOSE, Modbus), and smart meter fraud AI.',
    sort_order: 2,
  },

  // D10: Energy Storage & Charging
  {
    id: 'sub-d10-01',
    domain_id: 'dom-10',
    domain_code: 'D10',
    code: 'D10.01',
    name_fr: 'Systèmes de Stockage BESS Utilité & Micro-réseaux',
    name_en: 'Utility-Scale & Microgrid BESS Systems',
    description_fr: 'Conteneurs de batteries Lithium-Fer-Phosphate (LFP), racks 1500V DC, architecture BMS à 3 niveaux et refroidissement liquide.',
    description_en: 'Modular Lithium Iron Phosphate (LiFePO4) container systems, 1500V DC battery racks, 3-tier BMS architecture and thermal management.',
    sort_order: 1,
  },
  {
    id: 'sub-d10-02',
    domain_id: 'dom-10',
    domain_code: 'D10',
    code: 'D10.02',
    name_fr: 'Convertisseurs PCS Bidirectionnels & Contrôle Grid-Forming',
    name_en: 'Bidirectional PCS Inverters & Grid-Forming Control',
    description_fr: 'Convertisseurs 4 quadrants réversibles, source de tension virtuelle (VSG), inertie synthétique et démarrage autonome (black-start).',
    description_en: 'Four-quadrant reversible power conversion systems (PCS), virtual synchronous generator (VSG), synthetic inertia and black-start.',
    sort_order: 2,
  },
  {
    id: 'sub-d10-03',
    domain_id: 'dom-10',
    domain_code: 'D10',
    code: 'D10.03',
    name_fr: 'Infrastructures de Recharge Haute Puissance (IRVE & V2G)',
    name_en: 'High-Power EV Charging Infrastructure & V2G',
    description_fr: 'Bornes de recharge rapide et ultra-rapide DC (150-350 kW), protocole ISO 15118 Plug&Charge, gestion de charge dynamique et Vehicle-to-Grid.',
    description_en: 'Ultra-fast DC chargers (150-350 kW), ISO 15118 Plug & Charge, dynamic load management (DLM) and Vehicle-to-Grid (V2G) bidirectional services.',
    sort_order: 3,
  },

  // D11: Protection Systems & Relays
  {
    id: 'sub-d11-01',
    domain_id: 'dom-11',
    domain_code: 'D11',
    code: 'D11.01',
    name_fr: 'Protection Numérique & Fonctions ANSI (87, 21, 50/51, 67, 81)',
    name_en: 'Digital Protection & ANSI Relaying Schemes (87, 21, 50/51, 67, 81)',
    description_fr: 'Algorithmes numériques de protection différentielle unitaire, distance multi-zones, surintensité sélective à temps inverse et délestage fréquentiel.',
    description_en: 'Numerical unit differential protection, multi-zone impedance distance, inverse-time directional overcurrent and autonomous frequency load shedding.',
    sort_order: 1,
  },
  {
    id: 'sub-d11-02',
    domain_id: 'dom-11',
    domain_code: 'D11',
    code: 'D11.02',
    name_fr: 'Transformateurs de Mesure (TC classe 5P20/PX & TT Inductifs/Capacitifs)',
    name_en: 'Instrument Transformers (Protection CTs 5P20/PX & Inductive/Capacitive VTs)',
    description_fr: 'Dimensionnement des tores et enroulements secondaires, vérification de non-saturation (Kssc, ALF), fardeau et câblage de mesure différentielle.',
    description_en: 'CT core sizing, transient saturation checking (Kssc, ALF), secondary burden validation, and differential CT summation wiring.',
    sort_order: 2,
  },
  {
    id: 'sub-d11-03',
    domain_id: 'dom-11',
    domain_code: 'D11',
    code: 'D11.03',
    name_fr: 'Études de Réseau, Court-Circuit (CEI 60909) & Coordination Sélective TCC',
    name_en: 'Power System Studies, Short-Circuit (IEC 60909) & Selective TCC Grading',
    description_fr: 'Calculs de court-circuit triphasé, biphasé et monophasé selon CEI 60909, courbes temps-courant (TCC) et marges de sélectivité chronométrique (Δt = 250-300 ms).',
    description_en: 'Three-phase, line-line and single-phase short-circuit calculations per IEC 60909, time-current characteristic (TCC) curves and grading margins.',
    sort_order: 3,
  },
  {
    id: 'sub-d11-04',
    domain_id: 'dom-11',
    domain_code: 'D11',
    code: 'D11.04',
    name_fr: 'Sous-Stations Numériques CEI 61850 (Station Bus MMS, GOOSE & Process Bus SV)',
    name_en: 'IEC 61850 Digital Substations (Station Bus MMS, GOOSE & Process Bus SV)',
    description_fr: 'Réseaux Ethernet redondants PRP/HSR, publication GOOSE sub-milliseconde pour déclenchements, merging units (CEI 61869-9) et synchronisation PTP IEEE 1588.',
    description_en: 'PRP/HSR redundant optical Ethernet, sub-millisecond GOOSE tripping frames, process bus merging units, and IEEE 1588 PTP nano-second time sync.',
    sort_order: 4,
  },

  // D12: Automation, Instrumentation & Control (Téléconduite, SAS & Systèmes SCADA)
  {
    id: 'sub-d12-01',
    domain_id: 'dom-12',
    domain_code: 'D12',
    code: 'D12.01',
    name_fr: 'Contrôle-Commande Numérique de Poste (CCN / SAS & BCU)',
    name_en: 'Substation Automation Systems (SAS, BCU & Station Bus)',
    description_fr: 'Contrôleurs de travée (BCU), calculateurs de poste, automates programmables industriels (API CEI 61131-3) et synoptiques IHM locaux.',
    description_en: 'Bay Control Units (BCU), substation central computers, industrial PLCs (IEC 61131-3), and local substation HMI mimcs.',
    sort_order: 1,
  },
  {
    id: 'sub-d12-02',
    domain_id: 'dom-12',
    domain_code: 'D12',
    code: 'D12.02',
    name_fr: 'Protocoles de Téléconduite & Trames Réseau (CEI 60870-5-104 / DNP3)',
    name_en: 'Telecontrol Protocols & Network Framing (IEC 60870-5-104 / DNP3)',
    description_fr: 'Structure des trames APDU/ASDU CEI 104, interrogation générale (GI), télémesures flottantes, télécommandes avec sélection avant exécution (SBO) et horodatage CP56Time2a.',
    description_en: 'IEC 104 APDU/ASDU frame anatomy, general interrogation (GI), floating-point telemetry, Select-Before-Operate (SBO) commands, and CP56Time2a timestamps.',
    sort_order: 2,
  },
  {
    id: 'sub-d12-03',
    domain_id: 'dom-12',
    domain_code: 'D12',
    code: 'D12.03',
    name_fr: 'Interverrouillages Logiques, Synchro-contrôle (ANSI 25) & Automates',
    name_en: 'Logic Interlocking, Synchrocheck (ANSI 25) & Defense Automations',
    description_fr: 'Équations logiques booléennes de verrouillage disjoncteur/sectionneur, conditions de couplage vectoriel ANSI 25 (ΔV, Δf, Δδ) et délestage d\'urgence UFLS/UVLS.',
    description_en: 'Boolean interlocking matrices for switchgear safety, ANSI 25 synchrocheck permissive vectors (ΔV, Δf, Δδ), and automated UFLS/UVLS load shedding.',
    sort_order: 3,
  },
  {
    id: 'sub-d12-04',
    domain_id: 'dom-12',
    domain_code: 'D12',
    code: 'D12.04',
    name_fr: 'Dispatching National EMS/DMS, Réglage AGC & Cybersécurité OT (CEI 62351)',
    name_en: 'National Dispatching EMS/DMS, AGC Control & OT Cybersecurity (IEC 62351)',
    description_fr: 'Supervision centrale dispatching, estimation d\'état, réglage automatique de fréquence-puissance (AGC), modélisation CIM (CEI 61970) et chiffrement TLS CEI 62351-3/5.',
    description_en: 'Central EMS/DMS dispatching, state estimation, Automatic Generation Control (AGC), CIM data modeling (IEC 61970), and IEC 62351 TLS/HMAC OT cybersecurity.',
    sort_order: 4,
  },

  // D13: Communications & Operational Technology (Télécommunications de Réseau & CEI 61850)
  {
    id: 'sub-d13-01',
    domain_id: 'dom-13',
    domain_code: 'D13',
    code: 'D13.01',
    name_fr: 'Architecture CEI 61850 & Bus de Processus (Sampled Values & Merging Units)',
    name_en: 'IEC 61850 Architecture & Process Bus (Sampled Values & Merging Units)',
    description_fr: 'Numérisation des grandeurs analogiques HTB/HTA (courants et tensions), trames Sampled Values CEI 61850-9-2LE / 61869-9 à 4000/4800 Hz, capteurs non-conventionnels NCIT (Rogowski et optique Faraday) et boîtiers Merging Units de tranche.',
    description_en: 'High-voltage analog digitization (currents and voltages), IEC 61850-9-2LE / 61869-9 Sampled Values streaming at 4000/4800 Hz, Non-Conventional Instrument Transformers (NCIT Rogowski coils and optical Faraday effect), and bay Merging Units.',
    sort_order: 1,
  },
  {
    id: 'sub-d13-02',
    domain_id: 'dom-13',
    domain_code: 'D13',
    code: 'D13.02',
    name_fr: 'Bus de Station, Messages GOOSE & Ingénierie SCL (Fichiers SCD, ICD, CID)',
    name_en: 'Station Bus, GOOSE Teleprotection & SCL Engineering (SCD, ICD, CID)',
    description_fr: 'Trames de déclenchement ultra-rapides GOOSE (< 3 ms) selon CEI 61850-8-1, schéma de retransmission exponentielle, priorisation VLAN IEEE 802.1Q (Ethertype 0x88B8) et chaîne d\'ingénierie standardisée SCL (XML).',
    description_en: 'Sub-3ms peer-to-peer GOOSE protection tripping frames per IEC 61850-8-1, exponential retransmission scheme, IEEE 802.1Q VLAN priority tagging (Ethertype 0x88B8), and standardized SCL XML engineering workflow.',
    sort_order: 2,
  },
  {
    id: 'sub-d13-03',
    domain_id: 'dom-13',
    domain_code: 'D13',
    code: 'D13.03',
    name_fr: 'Redondance Réseau Zéro-Perte (PRP / HSR CEI 62439-3) & Synchronisation PTP (IEEE 1588v2)',
    name_en: 'Zero-Loss Network Redundancy (PRP / HSR IEC 62439-3) & PTP Time Sync (IEEE 1588v2)',
    description_fr: 'Protocoles de redondance sans temps de reconfiguration : PRP (Parallel Redundancy Protocol avec réseaux LAN A et B indépendants) et HSR (High-availability Seamless Redundancy en anneau). Synchronisation sub-microseconde PTP profil Power Utility (CEI 61850-9-3 / IEEE C37.238).',
    description_en: 'Bumpless zero-reconfiguration redundancy architectures: PRP (Parallel Redundancy Protocol across dual LAN A and LAN B) and HSR (High-availability Seamless Redundancy ring). Sub-microsecond PTP Power Utility Profile time synchronization (IEC 61850-9-3 / IEEE C37.238).',
    sort_order: 3,
  },
  {
    id: 'sub-d13-04',
    domain_id: 'dom-13',
    domain_code: 'D13',
    code: 'D13.04',
    name_fr: 'Réseaux Télécoms WAN de Transport d\'Énergie (Câbles OPGW, MPLS-TP, CPL & Faisceaux Hertziens)',
    name_en: 'WAN Utility Telecom Backbones (OPGW Fiber, MPLS-TP, Power Line Carrier & Microwave)',
    description_fr: 'Infrastructures télécoms longue distance le long des lignes 225 kV : câbles de garde à fibres optiques (OPGW), réseaux de transport déterministes MPLS-TP et SDH STM-16, courants porteurs en ligne (CPL / PLC avec selfs d\'arrêt et boîtes d\'accord) et faisceaux hertziens de secours.',
    description_en: 'Long-haul high-voltage transmission telecom backbones: Optical Ground Wire (OPGW) on 225 kV lines, deterministic MPLS-TP and SDH STM-16 carrier transport, high-frequency Power Line Carrier (PLC with line traps and tuning units), and backup microwave radio links.',
    sort_order: 4,
  },

  // D14: Power Quality & EMC (Qualité de l'Énergie & Compatibilité Électromagnétique)
  {
    id: 'sub-d14-01',
    domain_id: 'dom-14',
    domain_code: 'D14',
    code: 'D14.01',
    name_fr: 'Harmoniques, THD & Déformation d\'Onde (CEI 61000-2-4 / IEEE 519)',
    name_en: 'Harmonics, THD & Waveform Distortion (IEC 61000-2-4 / IEEE 519)',
    description_fr: 'Décomposition en séries de Fourier, spectres harmoniques de rangs 2 à 50, THDv et THDi, facteur de crête, puissance déformante D de Budeanu et détarage des transformateurs (Facteur K).',
    description_en: 'Fourier series decomposition, harmonic spectrum from 2nd to 50th order, THDv and THDi, crest factor, Budeanu distortion power D, and transformer K-factor derating.',
    sort_order: 1,
  },
  {
    id: 'sub-d14-02',
    domain_id: 'dom-14',
    domain_code: 'D14',
    code: 'D14.02',
    name_fr: 'Creux de Tension, Coupures & Événements Transitoires (CEI 61000-4-30 Classe A)',
    name_en: 'Voltage Sags, Swells, Interruptions & Transients (IEC 61000-4-30 Class A)',
    description_fr: 'Creux de tension (voltage sags/dips), surtensions temporaires (swells), courbes d\'immunité industrielle SEMI F47 et ITIC (CBEMA), durée et profondeur résiduelle d\'événement.',
    description_en: 'Voltage dips and sags, swell overvoltages, SEMI F47 and ITIC (CBEMA) industrial equipment ride-through curves, event depth and duration analysis.',
    sort_order: 2,
  },
  {
    id: 'sub-d14-03',
    domain_id: 'dom-14',
    domain_code: 'D14',
    code: 'D14.03',
    name_fr: 'Filtrage Harmonique & Dépollution Réseau (Filtres Passifs LC, Shunt & Filtres Actifs APF)',
    name_en: 'Harmonic Mitigation & Filtering (Passive LC, Shunt & Active Power Filters APF)',
    description_fr: 'Dimensionnement des filtres passifs résonants et amortis (rangs 5, 7, 11, 13), impédance de résonance parallèle anti-harmonique (désaccord 7% à 189 Hz), et onduleurs d\'injection active shunt (APF).',
    description_en: 'Passive tuned and damped LC filters (5th, 7th, 11th, 13th orders), anti-resonance parallel impedance (7% detuning reactor at 189 Hz), and high-speed shunt Active Power Filters (APF).',
    sort_order: 3,
  },
  {
    id: 'sub-d14-04',
    domain_id: 'dom-14',
    domain_code: 'D14',
    code: 'D14.04',
    name_fr: 'Papillotement (Flicker Pst/Plt), Déséquilibre Triphasé & CEM Industrielle',
    name_en: 'Voltage Flicker (Pst/Plt), Phase Unbalance & Industrial EMC',
    description_fr: 'Évaluation du flicker court terme (Pst) et long terme (Plt) selon CEI 61000-4-15, facteur de déséquilibre en composante inverse V2/V1 (CEI 61000-4-27), compensation dynamique par STATCOM/SVC.',
    description_en: 'Short-term (Pst) and long-term (Plt) flicker evaluation per IEC 61000-4-15, negative-sequence unbalance ratio V2/V1 (IEC 61000-4-27), dynamic compensation via STATCOM/SVC.',
    sort_order: 4,
  },

  // D15: Asset Management & Diagnostics
  {
    id: 'sub-d15-01',
    domain_id: 'dom-15',
    domain_code: 'D15',
    code: 'D15.01',
    name_fr: 'Diagnostic Huile Transformateur (DGA & Qualité Diélectrique)',
    name_en: 'Transformer Oil Diagnostics (DGA & Furan Analysis)',
    description_fr: 'Analyse des gaz dissous selon triangle de Duval / CEI 60599, teneur en humidité, acidité et tension de claquage diélectrique.',
    description_en: 'Dissolved gas analysis (DGA) per Duval triangle / IEC 60599, moisture in oil, acidity and dielectric breakdown voltage.',
    sort_order: 1,
  },
  {
    id: 'sub-d15-02',
    domain_id: 'dom-15',
    domain_code: 'D15',
    code: 'D15.02',
    name_fr: 'Décharges Partielles (DP) & Thermographie Infrarouge',
    name_en: 'Partial Discharge (PD) & Infrared Thermography',
    description_fr: 'Capteurs UHF et acoustiques pour détection des décharges partielles dans les postes blindés GIS et thermographie des connexions.',
    description_en: 'Acoustic and UHF partial discharge sensors for GIS and dry-type transformers, drone-based aerial IR thermography.',
    sort_order: 2,
  },

  // D16: Earthing, Safety & Lightning
  {
    id: 'sub-d16-01',
    domain_id: 'dom-16',
    domain_code: 'D16',
    code: 'D16.01',
    name_fr: 'Prises de Terre & Régimes de Neutre',
    name_en: 'Earthing Grids & Neutral Systems',
    description_fr: 'Grilles de mise à la terre des postes HT, régimes TT/TN/IT, calculs des tensions de pas et de toucher selon IEEE 80.',
    description_en: 'Substation earthing meshes, industrial neutral earthing resistors, step and touch potential calculations per IEEE 80.',
    sort_order: 1,
  },
  {
    id: 'sub-d16-02',
    domain_id: 'dom-16',
    domain_code: 'D16',
    code: 'D16.02',
    name_fr: 'Protection Foudre & Parafoudres (CEI 62305 & CEI 60099)',
    name_en: 'Lightning Protection & Surge Arresters',
    description_fr: 'Dimensionnement des parafoudres à oxyde métallique (ZnO), coordination d\'isolement et calcul des zones de capture.',
    description_en: 'Metal-oxide surge arrester (ZnO) selection, insulation coordination per IEC 60071 and lightning rolling sphere method.',
    sort_order: 2,
  },
];

export const ALL_SUBDOMAINS: Subdomain[] = [...D01_SUBDOMAINS, ...OTHER_SUBDOMAINS];

// EQUIPMENT ITEMS WITH RELATIONS, SPECS & SAFETY STATUS
export const EQUIPMENT_ITEMS: Equipment[] = [
  {
    id: 'eq-trafo-hta-01',
    domain_id: 'dom-04',
    domain_code: 'D04',
    subdomain_id: 'sub-d04-02',
    entity_type: 'PowerTransformer',
    name_fr: 'Transformateur de Puissance HTA (225 kV / 30 kV)',
    name_en: 'HV Step-Down Power Transformer (225 kV / 30 kV)',
    aliases_fr: ['TR-HTA', 'Transfo 225/30 kV', 'Transfo abaisseur SONATREL'],
    aliases_en: ['Power Transformer 225/30 kV', 'Substation Transformer'],
    description_fr: 'Transformateur triphasé immergé dans l\'huile minérale, assurant la conversion entre le réseau de transport national 225 kV et le réseau de distribution MT 30 kV.',
    description_en: 'Three-phase oil-immersed power transformer stepping down 225 kV transmission voltage to 30 kV medium-voltage distribution.',
    function_fr: 'Transforme la tension 225 kV vers 30 kV pour alimenter le réseau de distribution moyenne tension d\'une agglomération urbaine.',
    function_en: 'Transfers bulk power between 225 kV transmission bus and 30 kV distribution network feeders.',
    typical_location_fr: 'Postes sources SONATREL (ex. Poste Ahala Yaoundé, Poste Mangombé Edéa)',
    typical_location_en: 'Main transmission substations (e.g. Ahala substation Yaoundé, Mangombé substation)',
    voltage_level: 'HV',
    technical: {
      'Tension primaire (HT)': '225 kV',
      'Tension secondaire (BT)': '30 kV',
      'Puissance assignée': '40 MVA / 63 MVA',
      'Mode de refroidissement': 'ONAN / ONAF',
      'Fréquence nominale': '50 Hz',
      'Couplage': 'YNd11',
      'Tension de court-circuit (Ucc)': '12.5 %',
      'Régleur en charge (OLTC)': '± 10 × 1.25 % sur l\'enroulement HT',
      'Volume d\'huile': '~28 000 Litres',
      'Masse totale': '~68 Tonnes'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-01',
      entity_id: 'eq-trafo-hta-01',
      entity_type: 'equipment',
      source_ref: 'Spécification technique constructeur & standard SONATREL',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01 / YAYA',
      verified_at: '2026-08-31',
      notes: 'Données conformes aux transformateurs installés sur le Réseau Interconnecté Sud (RIS).'
    }
  },
  {
    id: 'eq-cb-sf6-01',
    domain_id: 'dom-04',
    domain_code: 'D04',
    subdomain_id: 'sub-d04-01',
    entity_type: 'CircuitBreaker',
    name_fr: 'Disjoncteur SF6 Haute Tension 225 kV',
    name_en: '225 kV SF6 High Voltage Circuit Breaker',
    aliases_fr: ['Disjoncteur HT', 'Appareil de coupure 225 kV'],
    aliases_en: ['HV Circuit Breaker', 'SF6 Breaker 225 kV'],
    description_fr: 'Disjoncteur tripolaire à autosoufflage au gaz SF6 pour la coupure des courants de charge et de court-circuit sur les départs lignes et transformateurs 225 kV.',
    description_en: 'Three-pole SF6 puffer-type circuit breaker designed for switching normal load currents and clearing severe short-circuit faults on 225 kV feeders.',
    function_fr: 'Interrompt les courants nominaux et les courants de court-circuit jusqu\'à 40 kA pour isoler les sections en défaut.',
    function_en: 'Interrupts nominal load currents and short-circuit faults up to 40 kA to isolate faulty grid zones.',
    typical_location_fr: 'Travées lignes et transformateurs en poste extérieur 225 kV',
    typical_location_en: 'Line and transformer bays in 225 kV outdoor substations',
    voltage_level: 'HV',
    technical: {
      'Tension assignée': '245 kV',
      'Tension de service': '225 kV',
      'Courant assigné en service continu': '3150 A',
      'Pouvoir de coupure en court-circuit': '40 kA (3s)',
      'Séquence de manœuvre': 'O - 0.3s - CO - 3min - CO',
      'Pression nominale SF6': '0.6 MPa à 20°C',
      'Commande': 'Mécanisme à ressort motorisé'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-02',
      entity_id: 'eq-cb-sf6-01',
      entity_type: 'equipment',
      source_ref: 'Spécification CEI 62271-100 & Catalogue appareillage HT',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-30'
    }
  },
  {
    id: 'eq-relay-87t-01',
    domain_id: 'dom-11',
    domain_code: 'D11',
    subdomain_id: 'sub-d11-01',
    entity_type: 'ProtectionIED',
    name_fr: 'Relais Différentiel Numérique Transformateur (87T)',
    name_en: 'Digital Transformer Differential Protection Relay (87T)',
    aliases_fr: ['Relais 87T', 'IED Protection Transformateur', 'SEL-487E / RET670'],
    aliases_en: ['87T Differential Relay', 'Transformer IED'],
    description_fr: 'Relais de protection multifonction numérique haute vitesse assurant la protection différentielle principale et la détection interne des courts-circuits entre spires.',
    description_en: 'Multifunctional numerical protection IED providing high-speed dual-slope percentage differential protection with harmonic restraint.',
    function_fr: 'Compare instantanément les courants primaires et secondaires du transformateur et déclenche le disjoncteur en moins de 25 ms en cas de défaut interne.',
    function_en: 'Continuously measures phase vectors entering and leaving the transformer, tripping in <25 ms upon internal fault detection.',
    typical_location_fr: 'Armoire de tranche de protection en salle de commande de poste',
    typical_location_en: 'Substation control room protection relay cubicle',
    voltage_level: 'LV',
    technical: {
      'Fonctions intégrées': '87T, 50/51, 50N/51N, 49 (Thermique), 24 (Surfluxage), 81',
      'Pente différentielle (Slope 1)': '20% - 30%',
      'Pente différentielle (Slope 2)': '50% - 80%',
      'Retenue harmonique': 'Harmonique 2 (enclenchement ~15%), Harmonique 5 (surfluxage)',
      'Communication': 'CEI 61850 Edition 2 (MMS & GOOSE), double port optique PRP/HSR',
      'Temps de déclenchement typique': '< 25 ms'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-03',
      entity_id: 'eq-relay-87t-01',
      entity_type: 'equipment',
      source_ref: 'Norme CEI 60255 & Guide de protection IEEE C37.91',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-hydro-songloulou-01',
    domain_id: 'dom-01',
    domain_code: 'D01',
    subdomain_id: 'sub-d01-01',
    entity_type: 'HydroGeneratorUnit',
    name_fr: 'Groupe Turbo-Alternateur Hydroélectrique Songloulou (48 MW)',
    name_en: 'Songloulou Hydroelectric Turbo-Generator Unit (48 MW)',
    aliases_fr: ['Groupe 1 Songloulou', 'Turbine Francis Songloulou', 'Alternateur 48 MW'],
    aliases_en: ['Songloulou Unit 48 MW', 'Francis Hydro Unit'],
    description_fr: 'Unité de production hydroélectrique composée d\'une turbine Francis à axe vertical couplée à un alternateur synchrone à pôles saillants, sur le fleuve Sanaga.',
    description_en: 'Hydroelectric power generation unit comprising a vertical-shaft Francis hydraulic turbine coupled to a salient-pole synchronous alternator.',
    function_fr: 'Convertit l\'énergie potentielle et cinétique de l\'eau du fleuve Sanaga en énergie électrique sous une tension nominale de 11 kV.',
    function_en: 'Converts potential hydraulic head of the Sanaga river into 11 kV alternating current power.',
    typical_location_fr: 'Centrale hydroélectrique de Songloulou (Capacité totale 384 MW, 8 groupes de 48 MW)',
    typical_location_en: 'Songloulou Hydroelectric Dam (Total capacity 384 MW, 8 units of 48 MW)',
    voltage_level: 'MV',
    technical: {
      'Puissance nominale par groupe': '48 MW / 57.6 MVA',
      'Chute nominale': '37.5 m',
      'Débit nominal par turbine': '145 m³/s',
      'Type de turbine': 'Francis à axe vertical',
      'Vitesse de rotation': '125 tr/min',
      'Tension de génération': '11 kV',
      'Cos φ assigné': '0.85',
      'Fréquence': '50 Hz',
      'Élévateur associé': 'Transformateur GSU 11 kV / 225 kV'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-04',
      entity_id: 'eq-hydro-songloulou-01',
      entity_type: 'equipment',
      source_ref: 'Données techniques publiques EDC / Eneo / SONATREL Cameroun',
      verification_status: 'reference',
      confidence: 0.90,
      verified_by: 'YAYA',
      verified_at: '2026-08-30',
      notes: 'Songloulou fournit plus de 35% de l\'énergie totale injectée dans le Réseau Interconnecté Sud (RIS) du Cameroun.'
    }
  },
  {
    id: 'eq-cell-mv-30k-01',
    domain_id: 'dom-05',
    domain_code: 'D05',
    subdomain_id: null,
    entity_type: 'MVSwitchgearCell',
    name_fr: 'Cellule Modulaire de Distribution MT 30 kV',
    name_en: '30 kV Medium Voltage Distribution Switchgear Panel',
    aliases_fr: ['Tableau MT 30 kV', 'Cellule HTA Eneo', 'Départ 30 kV'],
    aliases_en: ['30 kV Switchgear Cubicle', 'MV Feeder Panel'],
    description_fr: 'Tableau moyenne tension sous enveloppe métallique à coupure dans le vide ou SF6, standard des réseaux de distribution 30 kV au Cameroun.',
    description_en: 'Metal-enclosed air-insulated modular switchgear equipped with vacuum or SF6 circuit breaker for 30 kV distribution feeders.',
    function_fr: 'Assure la commande, la mesure et la protection d\'un départ de ligne aérienne ou câble souterrain 30 kV vers les postes abaisseurs MT/BT.',
    function_en: 'Controls, measures and protects 30 kV overhead/underground feeders running to local 30 kV/400 V distribution stations.',
    typical_location_fr: 'Salle MT des postes sources SONATREL et postes de répartition Eneo',
    typical_location_en: 'MV switchroom of transmission substations and Eneo distribution hubs',
    voltage_level: 'MV',
    technical: {
      'Tension de service': '30 kV (standard Cameroun, vs 20 kV Europe)',
      'Tension assignée': '36 kV',
      'Courant nominal jeu de barres': '1250 A / 2000 A',
      'Pouvoir de coupure': '16 kA / 20 kA (1s)',
      'Tenue à l\'arc interne (IAC)': 'A-FLR 16 kA 1s',
      'Technologie de coupure': 'Ampoule à vide ou SF6'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-05',
      entity_id: 'eq-cell-mv-30k-01',
      entity_type: 'equipment',
      source_ref: 'Spécification technique Eneo Cameroun & CEI 62271-200',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-inverter-solar-01',
    domain_id: 'dom-09',
    domain_code: 'D09',
    subdomain_id: null,
    entity_type: 'SolarCentralInverter',
    name_fr: 'Onduleur Solaire Centralisé Grande Puissance (1500 V DC / 2.5 MW)',
    name_en: 'Utility-Scale Central Solar Inverter (1500 V DC / 2.5 MW)',
    aliases_fr: ['Onduleur 1500V', 'PCS Solaire'],
    aliases_en: ['1500V Central Inverter', 'Solar Power Converter'],
    description_fr: 'Convertisseur DC/AC bidirectionnel haute puissance transformant la tension continue des générateurs photovoltaïques en courant alternatif triphasé 690 V.',
    description_en: 'Utility-scale central inverter converting 1500 V DC solar array strings into three-phase 690 V AC grid power.',
    function_fr: 'Convertit l\'énergie continue solaire avec suivi MPPT et contrôle de la puissance active/réactive injectée.',
    function_en: 'Converts DC solar energy to AC, executing maximum power point tracking (MPPT) and reactive power regulation.',
    typical_location_fr: 'Centrales solaires au sol (ex. Centrale solaire de Maroua 15 MWc, Guider 15 MWc au Cameroun)',
    typical_location_en: 'Utility ground-mounted PV parks (e.g. Maroua 15 MWp, Guider 15 MWp in Northern Cameroon)',
    voltage_level: 'DC',
    technical: {
      'Tension DC maximale': '1500 V DC',
      'Plage MPPT': '860 V - 1300 V DC',
      'Tension AC nominale': '690 V AC (triphasé)',
      'Puissance active maximale': '2500 kW à 50°C',
      'Rendement maximal': '99.0 %',
      'Protection arc électrique DC': 'Détection AFCI intégrée'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-06',
      entity_id: 'eq-inverter-solar-01',
      entity_type: 'equipment',
      source_ref: 'Spécification de centrale solaire Maroua/Guider & CEI 62109',
      verification_status: 'verified',
      confidence: 0.90,
      verified_by: 'DEP-01',
      verified_at: '2026-08-30'
    }
  },
  {
    id: 'eq-disconnector-225k',
    domain_id: 'dom-04',
    domain_code: 'D04',
    subdomain_id: 'sub-d04-01',
    entity_type: 'DisconnectorSwitch',
    name_fr: 'Sectionneur à Coupure Centrale 225 kV avec Sectionneur de Terre',
    name_en: '225 kV Center-Break Disconnector with Integrated Earthing Switch',
    aliases_fr: ['Sectionneur HTB', 'QS 225 kV', 'Sectionneur de jeu de barres'],
    aliases_en: ['HV Disconnector', 'Isolator 225 kV', 'Earth Switch'],
    description_fr: 'Appareil électromécanique assurant une distance d\'isolement visible et sécuritaire entre les barres 225 kV et le départ transformateur ou ligne, équipé d\'un couteau de mise à la terre cadenassable.',
    description_en: 'Electromechanical apparatus providing a visible and reliable isolation gap between 225 kV busbars and bay feeders, fitted with an interlocked earth knife.',
    function_fr: 'Isole visiblement un tronçon de circuit hors tension pour permettre les travaux de maintenance en toute sécurité selon la norme NF C 18-510.',
    function_en: 'Provides visible isolation of de-energized circuits to guarantee personnel safety during maintenance operations.',
    typical_location_fr: 'Travées 225 kV de chaque côté des disjoncteurs et raccordements aux barres (ex. Poste Mangombé Edéa)',
    typical_location_en: '225 kV switchyard bays adjacent to circuit breakers and busbar taps',
    voltage_level: 'HV',
    technical: {
      'Tension assignée': '245 kV',
      'Courant assigné en continu': '3150 A',
      'Courant de courte durée admissible': '40 kA (3s)',
      'Tenue à l\'onde de foudre': '1050 kV (crête) à la terre / 1200 kV sur la distance d\'isolement',
      'Temps de manœuvre motorisée': '~12 s',
      'Verrouillage de sécurité': 'Électromécanique et serrures Castell avec disjoncteur associé'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-07',
      entity_id: 'eq-disconnector-225k',
      entity_type: 'equipment',
      source_ref: 'CEI 62271-102 & Standards Postes SONATREL',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-surge-arrester-225k',
    domain_id: 'dom-04',
    domain_code: 'D04',
    subdomain_id: 'sub-d04-01',
    entity_type: 'SurgeArrester',
    name_fr: 'Parafoudre à Oxyde de Zinc (ZnO) 225 kV sans Éclateur',
    name_en: '225 kV Gapless Zinc-Oxide (ZnO) Surge Arrester',
    aliases_fr: ['Parafoudre HTB', 'Écrêteur de surtension', 'ZnO Arrester'],
    aliases_en: ['Station Arrester', 'Surge Diverter 225 kV'],
    description_fr: 'Dispositif de protection de classe station composé de varistances ZnO non linéaires protégeant le transformateur contre les surtensions atmosphériques (foudre) et de manœuvre.',
    description_en: 'Station-class non-linear metal-oxide resistor stack protecting high-voltage transformer windings from lightning and switching surges.',
    function_fr: 'Dérive à la terre les impulsions de surtension transitoires en limitant la tension résiduelle en dessous du niveau d\'isolement de base (BIL) du transformateur.',
    function_en: 'Diverts transient overvoltage impulses to the earthing mesh, clamping residual voltage below the transformer basic insulation level (BIL).',
    typical_location_fr: 'Directement en amont des traversées HT du transformateur 225/30 kV et sur l\'entrée des lignes aériennes',
    typical_location_en: 'Mounted directly at HV transformer bushings and overhead transmission line entries',
    voltage_level: 'HV',
    technical: {
      'Tension continue de service (Uc)': '140 kV rms',
      'Tension assignée (Ur)': '198 kV rms',
      'Courant nominal de décharge (8/20 µs)': '10 kA / 20 kA',
      'Capacité d\'absorption d\'énergie': '8 kJ/kV (classe 4 selon CEI 60099-4)',
      'Niveau de protection à la foudre (Upl)': '< 520 kV crête à 10 kA',
      'Moniteur de fuite': 'Milliammètre avec compteur de chocs d\'impulsion à la base'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-08',
      entity_id: 'eq-surge-arrester-225k',
      entity_type: 'equipment',
      source_ref: 'CEI 60099-4 & Coordination des isolements CEI 60071',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-ct-225k',
    domain_id: 'dom-11',
    domain_code: 'D11',
    subdomain_id: 'sub-d11-02',
    entity_type: 'CurrentTransformer',
    name_fr: 'Transformateur de Courant (TC) HT 225 kV Multi-Enroulements',
    name_en: '225 kV Multi-Core High Voltage Current Transformer (CT)',
    aliases_fr: ['TC 225 kV', 'TI Haute Tension', 'Transformateur d\'intensité'],
    aliases_en: ['HV CT 225 kV', 'Instrument Current Transformer'],
    description_fr: 'Transformateur de mesure à isolation papier-huile ou résine comportant 5 noyaux magnétiques indépendants dédiés au comptage d\'énergie (classe 0.2S) et aux protections différentielle et surintensité (classe 5P20).',
    description_en: 'High-accuracy oil-paper insulated instrument transformer with 5 independent cores dedicated to revenue metering (class 0.2S) and relay protection (class 5P20).',
    function_fr: 'Réduit le courant primaire de ligne (ex. 1000 A) à une valeur secondaire normalisée (1 A ou 5 A) avec isolation galvanique complète.',
    function_en: 'Scales down line primary current to standardized secondary values (1 A or 5 A) with complete galvanic isolation.',
    typical_location_fr: 'Dans chaque travée de poste 225 kV, entre le disjoncteur et le sectionneur de ligne/transformateur',
    typical_location_en: 'In each 225 kV substation bay between circuit breaker and line/transformer disconnector',
    voltage_level: 'HV',
    technical: {
      'Rapport de transformation': '600-1200 / 1-1-1-1-1 A (Multi-rapports commutables)',
      'Noyau 1 & 2 (Mesure & Comptage)': 'Classe 0.2S, 15 VA',
      'Noyaux 3 & 4 (Protection ligne/87T)': 'Classe 5P20, 30 VA, Fs < 10',
      'Noyau 5 (Protection secours)': 'Classe PX (haute impédance)',
      'Courant thermique de court-circuit (Ith)': '40 kA (1s)',
      'Facteur de surintensité assigné (ALF)': '20'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-09',
      entity_id: 'eq-ct-225k',
      entity_type: 'equipment',
      source_ref: 'CEI 61869-2 & Spécification technique SONATREL TC',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-ner-30k',
    domain_id: 'dom-16',
    domain_code: 'D16',
    subdomain_id: 'sub-d16-01',
    entity_type: 'NeutralEarthingResistor',
    name_fr: 'Résistance de Limitation de Neutre MT 30 kV (NER / PNR)',
    name_en: '30 kV Medium Voltage Neutral Earthing Resistor (NER)',
    aliases_fr: ['Résistance de neutre 30 kV', 'PNR', 'Limiteur de courant de défaut à la terre'],
    aliases_en: ['NER 30 kV', 'Neutral Grounding Resistor (NGR)'],
    description_fr: 'Banc de résistances en acier inoxydable monté entre le point neutre de l\'enroulement 30 kV (ou transformateur de point neutre TPN) et la terre générale du poste.',
    description_en: 'Heavy-duty stainless steel grid resistor assembly installed between the 30 kV neutral point and station grounding mesh.',
    function_fr: 'Limite le courant de court-circuit monophasé phase-terre à une valeur contrôlée (ex. 300 A ou 1000 A) pour réduire les montées en potentiel de terre et limiter les contraintes thermiques sur les câbles MT.',
    function_en: 'Restricts single phase-to-earth fault currents to a safe magnitude (e.g. 300 A or 1000 A), minimizing earth potential rise and cable damage.',
    typical_location_fr: 'Postes sources 225/30 kV, à proximité immédiate du transformateur de puissance ou du réacteur de neutre',
    typical_location_en: 'Distribution primary substations, placed adjacent to the power transformer neutral bushing',
    voltage_level: 'MV',
    technical: {
      'Tension du réseau': '30 kV (Tension simple 17.32 kV)',
      'Courant de limitation': '300 A (ou 1000 A sur réseaux urbains)',
      'Résistance ohmique assignée': '57.7 Ω à 20°C',
      'Durée admissible du courant': '10 secondes',
      'Élévation de température max': '385 °C (conforme CEI 60076-16)',
      'Transformateur de courant tore associé': 'Détection 51N (seuil 10% Ineur)'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-10',
      entity_id: 'eq-ner-30k',
      entity_type: 'equipment',
      source_ref: 'CEI 60076-16 & Guide de protection Eneo réseaux MT 30 kV',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  // --- PHASE 2 EXPANSION EQUIPMENT ITEMS ---
  {
    id: 'eq-tower-225kv',
    domain_id: 'dom-03',
    domain_code: 'D03',
    subdomain_id: 'sub-d03-01',
    entity_type: 'TransmissionTower',
    name_fr: 'Pylône Métallique HTB 225 kV (Double Terne)',
    name_en: '225 kV Steel Lattice Transmission Tower (Double Circuit)',
    aliases_fr: ['Support 225 kV', 'Pylône treillis SONATREL', 'Tour HTB'],
    aliases_en: ['Lattice Tower 225 kV', 'Double Circuit Tower', 'Suspension Pylon'],
    description_fr: 'Support autoportant en treillis d\'acier galvanisé supportant deux ternes triphasées 225 kV (faisceau Aster 570) et deux câbles de garde dont un OPGW avec fibres optiques.',
    description_en: 'Self-supporting galvanized steel lattice tower carrying double-circuit 225 kV conductors (Aster 570 bundle) and dual overhead ground wires including OPGW optical fiber.',
    function_fr: 'Assure le maintien mécanique et l\'isolation diélectrique des conducteurs de transport 225 kV au-dessus du sol sur les corridors nationaux.',
    function_en: 'Maintains mechanical clearances and dielectric insulation of 225 kV transmission conductors along bulk power corridors.',
    typical_location_fr: 'Corridor 225 kV Mangombé-Logbaba, Oyomabang-Nomayos, Nachtigal-Bafoussam (Cameroun)',
    typical_location_en: '225 kV Corridors Mangombé-Logbaba, Oyomabang-Nomayos, Nachtigal-Bafoussam (Cameroon)',
    voltage_level: 'HV',
    technical: {
      'Tension nominale': '225 kV efficace (50 Hz)',
      'Tension la plus élevée Um': '245 kV efficace',
      'Hauteur totale hors sol': '42.5 mètres',
      'Portée nominale standard': '400 mètres',
      'Type de conducteurs': 'Almélec Aster 570 mm² (faisceau bifilaire)',
      'Niveau d\'isolement choc foudre (BIL)': '1050 kV crête',
      'Câble de garde télécom': 'OPGW 48 fibres monomodes G.652D'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-11',
      entity_id: 'eq-tower-225kv',
      entity_type: 'equipment',
      source_ref: 'Spécification technique SONATREL Lignes 225 kV & CEI 60826',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-gis-bay-225kv',
    domain_id: 'dom-04',
    domain_code: 'D04',
    subdomain_id: 'sub-d04-01',
    entity_type: 'GISSwitchgearBay',
    name_fr: 'Travée Blindée GIS SF6 225 kV (Double Jeu de Barres)',
    name_en: '225 kV Gas-Insulated Switchgear (GIS) Bay',
    aliases_fr: ['Poste blindé 225 kV', 'Travée GIS SF6', 'Appareillage sous enveloppe métallique'],
    aliases_en: ['GIS Bay 225 kV', 'SF6 Metal-Enclosed Substation', 'Gas-Insulated Switchgear'],
    description_fr: 'Ensemble compact sous enveloppe métallique en aluminium sous pression de gaz SF6, intégrant disjoncteur, deux sectionneurs de barres, sectionneurs de terre rapides et transformateurs de mesure.',
    description_en: 'Ultra-compact aluminum-enclosed SF6 gas-insulated switchgear bay housing circuit breaker, dual bus disconnectors, high-speed earthing switches, and instrument transformers.',
    function_fr: 'Permet les manœuvres d\'exploitation, le couplage de jeux de barres et l\'isolement des départs dans un encombrement réduit de 90% par rapport à un poste ouvert AIS.',
    function_en: 'Executes switching, busbar transfer, and line protection within a footprint occupying only 10% of conventional AIS open-air yard.',
    typical_location_fr: 'Poste blindé 225 kV de Bekoko / Poste d\'évacuation centrale hydroélectrique de Nachtigal',
    typical_location_en: 'Bekoko 225 kV Substation / Nachtigal Hydro Evacuation Switchyard',
    voltage_level: 'HV',
    technical: {
      'Tension assignée Ur': '245 kV efficace',
      'Courant nominal assigné Ir': '3150 A (barres) / 2500 A (départ)',
      'Pouvoir de coupure court-circuit': '40 kA efficace / 1 seconde',
      'Pression de remplissage SF6': '0.60 MPa (6.0 bars) à 20°C',
      'Taux de fuite SF6': '< 0.1 % par an (conforme CEI 62271-203)',
      'Niveau de tenue aux chocs (BIL)': '1050 kV crête'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-12',
      entity_id: 'eq-gis-bay-225kv',
      entity_type: 'equipment',
      source_ref: 'CEI 62271-203 & Fiche constructeur poste Bekoko 225 kV',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-autotrafo-225-90',
    domain_id: 'dom-04',
    domain_code: 'D04',
    subdomain_id: 'sub-d04-02',
    entity_type: 'Autotransformer',
    name_fr: 'Autotransformateur d\'Interconnexion 225 kV / 90 kV / 15 kV (100 MVA)',
    name_en: 'Interconnection Autotransformer 225 kV / 90 kV / 15 kV (100 MVA)',
    aliases_fr: ['ATR 225/90', 'Autotransfo d\'interconnexion', 'Transfo SONATREL 100 MVA'],
    aliases_en: ['225/90 kV Autotransformer', 'Intertie Transformer', 'Grid Coupling Transformer'],
    description_fr: 'Autotransformateur triphasé immergé dans l\'huile minérale à enroulement commun avec tertiaire de stabilisation en triangle 15 kV et régleur en charge sous charge OLTC sur neutre.',
    description_en: 'Three-phase oil-immersed autotransformer with common winding, 15 kV delta tertiary stabilization winding, and neutral-end on-load tap changer (OLTC).',
    function_fr: 'Assure l\'échange massif d\'énergie et l\'interconnexion entre la dorsale de transport 225 kV et le réseau régional de sous-transport 90 kV.',
    function_en: 'Manages bulk power interchange between national 225 kV backbone and regional 90 kV sub-transmission grids.',
    typical_location_fr: 'Poste d\'interconnexion Mangombé 225/90 kV (Édéa) & Poste Oyomabang (Yaoundé)',
    typical_location_en: 'Mangombé 225/90 kV Substation (Edéa) & Oyomabang Substation (Yaoundé)',
    voltage_level: 'HV',
    technical: {
      'Puissance assignée Sn': '100 MVA (ONAF) / 75 MVA (ONAN)',
      'Tension HT / MT / Tertiaire': '225 kV / 90 kV / 15 kV',
      'Couplage': 'YNauto d11 (Neutre directement à la terre)',
      'Impédance de court-circuit Ucc': '11.5 % (base 100 MVA)',
      'Plage régleur en charge (OLTC)': '± 10 × 1.25 % sur l\'enroulement 90 kV',
      'Masse totale avec huile': '115 tonnes'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-13',
      entity_id: 'eq-autotrafo-225-90',
      entity_type: 'equipment',
      source_ref: 'CEI 60076 & Dossier technique SONATREL Poste Mangombé',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-recloser-30k',
    domain_id: 'dom-05',
    domain_code: 'D05',
    subdomain_id: 'sub-d05-03',
    entity_type: 'AutoRecloser',
    name_fr: 'Disjoncteur Réenclencheur Aérien HTA 30 kV (Recloser)',
    name_en: '30 kV Pole-Mounted Vacuum Auto-Recloser',
    aliases_fr: ['Réenclencheur automatique', 'Recloser 30 kV Eneo', 'Disjoncteur de poteau'],
    aliases_en: ['Automatic Circuit Recloser (ACR)', 'Pole Recloser', 'Vacuum Recloser'],
    description_fr: 'Disjoncteur sous vide triphasé à isolement diélectrique solide (résine cycloaliphatique), équipé d\'un coffret de commande à microprocesseur avec communication 4G/GPRS pour FDIR.',
    description_en: 'Solid-dielectric vacuum circuit recloser with microprocessor controller, integrated CTs/VTs, and 4G/GPRS telemetry for distribution loop self-healing (FLISR).',
    function_fr: 'Élimine les défauts fugitifs sur les longues lignes aériennes 30 kV par cycles d\'ouverture/réenclenchement rapide (O-0.3s-CO-2s-CO) sans coupure définitive.',
    function_en: 'Clears transient faults on rural/semi-urban 30 kV overhead feeders via rapid reclose sequences, minimizing SAIDI/SAIFI customer outages.',
    typical_location_fr: 'Départs 30 kV périurbains et ruraux Eneo (ex. Départs Obala, Bafia, Mbalmayo)',
    typical_location_en: '30 kV rural/suburban feeders Eneo (e.g. Obala, Bafia, Mbalmayo corridors)',
    voltage_level: 'MV',
    technical: {
      'Tension assignée': '38 kV max (exploitation 30 kV Eneo)',
      'Courant assigné en service continu': '630 A',
      'Pouvoir de coupure court-circuit': '12.5 kA efficace / 3 s',
      'Cycle de réenclenchement': 'O - 0.3s - CO - 2s - CO - 2s - CO (réglable)',
      'Capteurs intégrés': '6 transformateurs de tension capacitifs + 3 tores TC',
      'Protocole de téléconduite': 'CEI 60870-5-104 / DNP3 vers SCADA Eneo'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-14',
      entity_id: 'eq-recloser-30k',
      entity_type: 'equipment',
      source_ref: 'CEI 62271-111 / IEEE C37.60 & Cahier des charges réenclencheurs Eneo',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-kiosk-30kv-400v',
    domain_id: 'dom-05',
    domain_code: 'D05',
    subdomain_id: 'sub-d05-02',
    entity_type: 'DistributionSubstation',
    name_fr: 'Poste Kiosque Préfabriqué HTA/BT 30 kV / 400 V (630 kVA)',
    name_en: 'Compact Pad-Mounted Distribution Substation 30 kV / 400 V (630 kVA)',
    aliases_fr: ['Poste Kiosque HTA/BT', 'Cabine de distribution urbaine', 'Poste compact Eneo'],
    aliases_en: ['Pad-Mounted Substation', 'Secondary Substation 630 kVA', 'Compact Kiosk'],
    description_fr: 'Poste préfabriqué en béton ou enveloppe métallique comprenant un tableau HTA sous enveloppe métallique SF6 (RMU 24/36 kV), un transformateur immergé étanche 630 kVA et un tableau BT 400 V.',
    description_en: 'Factory-assembled secondary distribution kiosk integrating an SF6 ring main unit (RMU), hermetically sealed 630 kVA oil transformer, and LV distribution fuse board.',
    function_fr: 'Assure l\'abaissement final de la tension de distribution 30 kV vers le réseau basse tension 400 V triphasé pour alimenter les abonnés résidentiels et tertiaires.',
    function_en: 'Transforms 30 kV distribution feeder voltage down to 400 V three-phase / 230 V single-phase for commercial and residential end-users.',
    typical_location_fr: 'Quartiers urbains de Douala (Akwa, Bonanjo) et Yaoundé (Bastos, Omnisports)',
    typical_location_en: 'Urban distribution nodes in Douala (Akwa, Bonanjo) and Yaoundé (Bastos)',
    voltage_level: 'MV',
    technical: {
      'Tension primaire assignée': '30 kV (réseau Eneo)',
      'Tension secondaire assignée': '400 V entre phases / 230 V phase-neutre',
      'Puissance transformateur': '630 kVA (Pertes réduites CEI EcoDesign Tier 2)',
      'Tableau HTA RMU': '2 arrivées interrupteur-sectionneur 630A + 1 départ combiné fusible/disjoncteur',
      'Tableau BT (TUR)': 'Tableau Urbain Réduit 8 départs protégés par fusibles NH2 400A',
      'Régime de neutre BT': 'Schéma TT (Neutre relié directement à une prise de terre distincte)'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-15',
      entity_id: 'eq-kiosk-30kv-400v',
      entity_type: 'equipment',
      source_ref: 'CEI 62271-202 & Guide technique de raccordement Eneo Cameroun',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-tgbt-main-400v',
    domain_id: 'dom-06',
    domain_code: 'D06',
    subdomain_id: 'sub-d06-01',
    entity_type: 'LowVoltageSwitchboard',
    name_fr: 'Tableau Général Basse Tension TGBT 400 V (2500 A - Forme 4b)',
    name_en: 'Main Low-Voltage Switchboard (TGBT) 400 V (2500 A - Form 4b)',
    aliases_fr: ['Armoire TGBT', 'Tableau principal BT', 'Distribution 400V'],
    aliases_en: ['Main LV Switchboard (MSB)', 'PCC Power Center', 'Low-Voltage Board'],
    description_fr: 'Armoire métallique modulaire de distribution basse tension 400 V / 230 V, équipée d\'un disjoncteur ouvert d\'arrivée 2500 A débrochable, de gradins de condensateurs automatiques et de départs divisionnaires.',
    description_en: 'Enclosed modular low-voltage distribution switchboard engineered to Form 4b internal separation, incorporating a 2500 A withdrawable air circuit breaker (ACB) and automatic power factor correction.',
    function_fr: 'Distribue et protège l\'énergie électrique basse tension dans les usines, data centers, hôpitaux et grands ensembles tertiaires.',
    function_en: 'Distributes and safeguards low-voltage power across industrial complexes, tertiary facilities, hospitals, and critical infrastructures.',
    typical_location_fr: 'Usines de la zone industrielle de Bassa / Magzi (Douala), sièges d\'entreprises',
    typical_location_en: 'Industrial complexes in Bassa / Magzi industrial zone (Douala), corporate towers',
    voltage_level: 'LV',
    technical: {
      'Tension assignée d\'emploi Ue': '400 V / 690 V AC',
      'Courant assigné d\'arrivée In': '2500 A',
      'Courant de court-circuit assigné Icw': '65 kA efficace / 1 seconde',
      'Forme de séparation interne': 'Forme 4b (séparation barres, unités et bornes)',
      'Indice de protection enveloppe': 'IP54 / IK10',
      'Batterie de condensateurs intégrée': '300 kvar automatique avec inductances anti-harmoniques'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-16',
      entity_id: 'eq-tgbt-main-400v',
      entity_type: 'equipment',
      source_ref: 'CEI 61439-1 & CEI 61439-2 (Ensembles d\'appareillage à basse tension)',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-lv-abc-service-01',
    domain_id: 'dom-06',
    domain_code: 'D06',
    subdomain_id: 'sub-d06-01',
    entity_type: 'LVAerialBundledConductorAndServiceBox',
    name_fr: 'Faisceau Basse Tension Torsadé Aérien (LV ABC) & Coffret de Branchement CCPI',
    name_en: 'Low-Voltage Aerial Bundled Conductor (LV ABC) & Customer Service Cutout Box (CCPI)',
    aliases_fr: ['Câble torsadé BT 3x70+54.6', 'Réseau aérien torsadé', 'Coffret CCPI de branchement', 'Connecteurs TTDE'],
    aliases_en: ['LV Aerial Bundled Cable (ABC)', 'Insulated Overhead Drop', 'Service Connection Box', 'Insulation Piercing Connectors'],
    description_fr: 'Ensemble complet de distribution publique et de branchement d\'abonné basse tension, comprenant un faisceau torsadé 3x70 mm² Al + neutre porteur 54.6 mm² en almélec (NF C 33-209), des connecteurs de dérivation à perforation d\'isolant (IPC / TTDE) étanches IP68 à vis fusible calibrée, et un coffret coupe-circuit de branchement individuel (CCPI) plombable équipé de fusibles HPC taille 00 et parafoudre de type 2.',
    description_en: 'Complete low-voltage utility distribution and service connection system comprising overhead aerial bundled cable (3x70 mm² Al + 54.6 mm² messenger neutral per NF C 33-209/EN 50483), waterproof insulation piercing connectors (IPC) with torque shear-head bolts, and tamper-evident customer service cutout box (CCPI) with HRC size 00 fuses and smart metering interface.',
    function_fr: 'Assure la distribution aérienne BT en façade ou sur poteau, le piquage sous tension sans dénudage des conducteurs et la livraison sécurisée d\'énergie aux abonnés avec coupure omnipolaire et protection différentielle.',
    function_en: 'Distributes 400/230V power along facades or poles, allows live-line tapping via piercing connectors, and terminates into customer cutout protection boxes.',
    typical_location_fr: 'Réseau de distribution urbain et péri-urbain Eneo (Douala, Yaoundé, Bafoussam)',
    typical_location_en: 'Urban and peri-urban low-voltage utility networks (Douala, Yaoundé, Bafoussam)',
    voltage_level: 'LV',
    technical: {
      'Tension nominale U0/U': '0.6 / 1 kV (Réseau 230/400 V)',
      'Section conducteurs de phase': '3 × 70 mm² Aluminium réticulé XLPE résistant aux UV',
      'Neutre porteur mécanique': '54.6 mm² Almélec (tenue à la rupture > 1660 daN)',
      'Conducteur éclairage public': '1 × 16 mm² Aluminium (intégré au faisceau)',
      'Connecteurs de dérivation': 'Type TTDE à perforation d\'isolant étanche 6 kV sous l\'eau (NF C 33-020)',
      'Coffret de branchement CCPI': 'Polyester armé fibres de verre IP43 / IK10 avec fusibles 60A gG taille 00'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-abc-01',
      entity_id: 'eq-lv-abc-service-01',
      entity_type: 'equipment',
      source_ref: 'NF C 33-209 / NF C 14-100 / EN 50483 & Normes de distribution Eneo Cameroun',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-01'
    }
  },
  {
    id: 'eq-ied-relay-61850',
    domain_id: 'dom-11',
    domain_code: 'D11',
    subdomain_id: 'sub-d11-04',
    entity_type: 'DigitalProtectionIED',
    name_fr: 'Relais Numérique Multifonction CEI 61850 & Contrôleur de Baie',
    name_en: 'IEC 61850 Protection & Bay Control IED',
    aliases_fr: ['Relais IED 61850', 'Calculateur de tranche numérique', 'Automate de protection'],
    aliases_en: ['Protection IED', 'IEC 61850 Bay Controller', 'Digital Substation Relay'],
    description_fr: 'Équipement électronique intelligent (IED) multifonction exécutant la protection de distance de ligne (21), la protection différentielle (87L) et la publication de téléactions par trames GOOSE haute vitesse.',
    description_en: 'High-performance microprocessor IED integrating line distance (21), differential (87L), synchrocheck (25) and native IEC 61850 GOOSE/MMS/SV networking with dual PRP/HSR ports.',
    function_fr: 'Analyse en temps réel les courants et tensions échantillonnés, détecte les courts-circuits en moins de 15 ms et déclenche les disjoncteurs par messages réseau optiques GOOSE.',
    function_en: 'Processes sampled electrical measurements in real time, isolates transmission line faults within 15 ms, and issues breaker trip orders via fiber optic GOOSE frames.',
    typical_location_fr: 'Salle de commande des postes 225 kV de SONATREL (ex. Poste Nomayos, Poste Bekoko)',
    typical_location_en: 'Control rooms across modern 225 kV SONATREL substations (Nomayos, Bekoko)',
    voltage_level: 'LV',
    technical: {
      'Protocoles supportés': 'CEI 61850 Ed.2 (MMS, GOOSE, Sampled Values), CEI 60870-5-104',
      'Interfaces réseau optique': '2 ports LC Ethernet 100/1000Base-FX (Redondance PRP / HSR)',
      'Synchronisation temporelle': 'IEEE 1588v2 PTP (Power Profile C37.238) précision < 1 µs',
      'Temps de publication GOOSE': '< 2.5 ms (classe d\'application la plus rapide)',
      'Échantillonnage Sampled Values': '80 échantillons/période (4000 Hz) selon CEI 61869-9',
      'Enregistreur perturbographique': 'Mémoire flash pour 100 enregistrements Comtrade'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-17',
      entity_id: 'eq-ied-relay-61850',
      entity_type: 'equipment',
      source_ref: 'CEI 61850-7-4 & Fiche technique IED numérique SONATREL',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-bess-utility-50mw',
    domain_id: 'dom-10',
    domain_code: 'D10',
    subdomain_id: 'sub-d10-01',
    entity_type: 'BatteryStorageSystem',
    name_fr: 'Système de Stockage par Batteries BESS 50 MW / 100 MWh (LFP)',
    name_en: 'Utility-Scale Battery Energy Storage System (BESS) 50 MW / 100 MWh',
    aliases_fr: ['BESS Utilité', 'Batterie réseau 50 MW', 'Système de stockage LFP'],
    aliases_en: ['Utility BESS 50 MW / 100 MWh', 'Grid-Scale Battery', 'BESS Container System'],
    description_fr: 'Système conteneurisé de stockage par accumulateurs Lithium-Fer-Phosphate (LFP) avec convertisseurs bidirectionnels réversibles (PCS) 4 quadrants pour le soutien dynamique du réseau.',
    description_en: 'Modular containerized Lithium Iron Phosphate (LiFePO4) battery system with grid-forming 4-quadrant bi-directional PCS inverters, liquid cooling, and aerosol fire suppression.',
    function_fr: 'Assure la réserve primaire ultra-rapide (FFR), l\'arbitrage énergétique, le lissage de production solaire et la stabilisation de la fréquence sur le Réseau Interconnecté.',
    function_en: 'Delivers fast frequency response (FFR < 150 ms), energy arbitrage, peak shaving, and synthetic inertia to stabilize the national interconnected grid.',
    typical_location_fr: 'Réseau Interconnecté Nord (RIN Cameroun - Garoua/Maroua) pour stabiliser le solaire',
    typical_location_en: 'Northern Interconnected Grid (RIN Cameroon - Garoua/Maroua) for solar stabilization',
    voltage_level: 'MV',
    technical: {
      'Puissance active nominale': '50 MW (injection / absorption)',
      'Capacité de stockage d\'énergie': '100 MWh (taux de décharge 0.5C - 2 heures)',
      'Chimie des cellules': 'LFP (Lithium-Fer-Phosphate sécuritaire)',
      'Temps de réponse en fréquence': '< 120 ms (du repos à pleine puissance)',
      'Rendement aller-retour (RTE)': '88.5 % (AC-AC à l\'interface réseau)',
      'Système de sécurité incendie': 'Extinction automatique au gaz inerte + capteurs off-gas'
    },
    is_safety_critical: true,
    hazard_level: 'thermal_runaway',
    provenance: {
      id: 'prov-18',
      entity_id: 'eq-bess-utility-50mw',
      entity_type: 'equipment',
      source_ref: 'CEI 62933-5-2 (Sécurité des BESS) & Étude de stabilité RIN Cameroun',
      verification_status: 'verified',
      confidence: 0.90,
      verified_by: 'DEP-01',
      verified_at: '2026-08-31'
    }
  },
  {
    id: 'eq-inv-solar-01',
    domain_id: 'dom-09',
    domain_code: 'D09',
    subdomain_id: 'sub-d09-01',
    entity_type: 'CentralSolarInverter',
    name_fr: 'Onduleur Central Solaire Photovoltaïque 3.125 MVA / 1500 V DC',
    name_en: 'Utility-Scale Central PV Inverter 3.125 MVA / 1500 V DC',
    aliases_fr: ['Onduleur Central PV', 'Power Conversion System PV', 'Onduleur 1500V'],
    aliases_en: ['Utility PV Inverter', '1500V DC Central Inverter', 'Grid-Tie Solar Inverter'],
    description_fr: 'Onduleur centralisé à topologie NPC 3 niveaux pour champs solaires au sol, avec algorithme MPPT dynamique, tenue aux creux de tension (LVRT) et compensation de réactif nocturne (Q at Night).',
    description_en: 'Three-level NPC utility-scale central inverter with dynamic MPPT, Low-Voltage Ride-Through (LVRT), and Q-at-Night active reactive power compensation.',
    function_fr: 'Convertit l\'énergie continue (DC) des panneaux bifaciaux en courant alternatif triphasé 690 V prêt pour élévation HTA 33 kV.',
    function_en: 'Converts DC power from 1500V strings into three-phase 690V AC and provides dynamic voltage and frequency support.',
    typical_location_fr: 'Centrale solaire de Maroua & Guider (RIN Cameroun)',
    typical_location_en: 'Maroua & Guider Solar PV Plants (RIN Cameroon)',
    voltage_level: 'MV',
    technical: {
      'Puissance nominale AC': '3 125 kVA @ 50°C',
      'Plage MPPT DC': '900 V à 1 500 V DC',
      'Tension de sortie AC': '690 V triphasé (±10%)',
      'Rendement maximal': '99.0 % (Rendement européen 98.7 %)',
      'Fonctions réseau': 'LVRT, HVRT, Q(U), P(f), Q at Night',
      'Indice de protection': 'IP65 / NEMA 4X extérieur tropicalisé'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-d09-eq1',
      entity_id: 'eq-inv-solar-01',
      entity_type: 'equipment',
      source_ref: 'IEC 62109-1 / IEC 62109-2 & Code Réseau SONATREL',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-01'
    }
  },
  {
    id: 'eq-wind-pmsg-01',
    domain_id: 'dom-09',
    domain_code: 'D09',
    subdomain_id: 'sub-d09-01',
    entity_type: 'WindTurbineGenerator',
    name_fr: 'Aérogénérateur Synchrone à Aimants Permanents 4.5 MW (PMSG)',
    name_en: 'Permanent Magnet Synchronous Wind Turbine 4.5 MW (PMSG)',
    aliases_fr: ['Éolienne PMSG 4.5 MW', 'Génératrice Direct Drive', 'Turbine éolienne offshore/onshore'],
    aliases_en: ['4.5 MW Direct-Drive PMSG', 'Wind Energy Converter', 'Full-Converter Wind Turbine'],
    description_fr: 'Aérogénérateur à entraînement direct (sans multiplicateur de vitesse mécanique) couplé à un convertisseur de fréquence pleine puissance 4 quadrants.',
    description_en: 'Direct-drive wind turbine without gearbox, featuring a permanent magnet synchronous generator and full-scale back-to-back PWM power converter.',
    function_fr: 'Capte l\'énergie cinétique du vent et produit une énergie électrique entièrement découplée de la fréquence du réseau par convertisseur statique.',
    function_en: 'Converts aerodynamic wind power to electrical energy, fully decoupling rotor dynamics from grid frequency via full-scale converter.',
    typical_location_fr: 'Monts Mandara / Littoral Atlantique (Kribi, Cameroun)',
    typical_location_en: 'Mandara Mountains / Atlantic Coastline (Kribi, Cameroon)',
    voltage_level: 'MV',
    technical: {
      'Puissance nominale': '4.5 MW',
      'Diamètre de rotor': '155 m (Pales en fibre de carbone)',
      'Vitesse de vent de démarrage (Cut-in)': '3.0 m/s',
      'Vitesse de vent nominale': '11.5 m/s',
      'Vitesse de vent de coupure (Cut-out)': '25.0 m/s',
      'Convertisseur': 'Convertisseur AC/DC/AC pleine échelle (Full-Converter IGBT)'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-d09-eq2',
      entity_id: 'eq-wind-pmsg-01',
      entity_type: 'equipment',
      source_ref: 'IEC 61400-1 / IEC 61400-21',
      verification_status: 'verified',
      confidence: 0.92,
      verified_by: 'DEP-01',
      verified_at: '2026-09-01'
    }
  },
  {
    id: 'eq-ppc-controller-01',
    domain_id: 'dom-09',
    domain_code: 'D09',
    subdomain_id: 'sub-d09-02',
    entity_type: 'PowerPlantController',
    name_fr: 'Contrôleur Central de Parc Solaire & Éolien (Power Plant Controller - PPC)',
    name_en: 'Central Power Plant Controller (PPC) for Solar & Wind Farms',
    aliases_fr: ['PPC EnR', 'Automate Central de Centrale', 'Régulateur de Parc'],
    aliases_en: ['Power Plant Controller', 'Central Park Controller', 'Grid Code Compliance Controller'],
    description_fr: 'Automate temps réel déterministe (temps de cycle < 20 ms) orchestrant tous les onduleurs et aérogénérateurs du parc pour respecter le Code de Réseau au PCC.',
    description_en: 'Deterministic real-time master controller (< 20 ms loop cycle) orchestrating all inverters, wind turbines, and capacitor banks to satisfy grid code at PCC.',
    function_fr: 'Assure la régulation de tension Q(U), le contrôle de puissance active P(f), la réponse inertielle rapide et le délestage ordonné sur commande du dispatching.',
    function_en: 'Regulates reactive power/voltage Q(U), active power/frequency P(f), synthetic inertia response, and curtailment commands from grid dispatching.',
    typical_location_fr: 'Bâtiment de commande de centrale EnR (Poste 33/225 kV)',
    typical_location_en: 'Renewable Substation Control Building (33/225 kV PCC)',
    voltage_level: 'LV',
    technical: {
      'Cycle d\'exécution temps réel': '10 à 20 ms (déterministe)',
      'Protocoles de communication': 'IEC 60870-5-104, DNP3, Modbus TCP, IEC 61850 GOOSE/MMS',
      'Redondance matérielle': 'Configuration Dual-Hot-Standby N+1 avec basculement < 10 ms',
      'Précision de mesure au PCC': 'Classe 0.2s (avec TC/TT de précision)',
      'Plage de régulation cos phi': '0.85 inductif à 0.85 capacitif au point de livraison'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d09-eq3',
      entity_id: 'eq-ppc-controller-01',
      entity_type: 'equipment',
      source_ref: 'IEC 60870-5-104 & IEEE 2800-2022',
      verification_status: 'verified',
      confidence: 0.96,
      verified_by: 'DEP-01',
      verified_at: '2026-09-01'
    }
  },
  {
    id: 'eq-pcs-grid-forming-01',
    domain_id: 'dom-10',
    domain_code: 'D10',
    subdomain_id: 'sub-d10-02',
    entity_type: 'PowerConversionSystem',
    name_fr: 'Convertisseur Réversible BESS 2.5 MVA (PCS Grid-Forming & Droop)',
    name_en: 'Grid-Forming Bidirectional BESS Inverter 2.5 MVA (PCS)',
    aliases_fr: ['Onduleur/Chargeur BESS', 'PCS 4 Quadrants', 'Convertisseur Grid-Forming'],
    aliases_en: ['Grid-Forming PCS 2.5 MVA', 'Bidirectional Battery Inverter', 'VSG Inverter'],
    description_fr: 'Convertisseur bidirectionnel AC/DC réversible 4 quadrants opérant en source de tension (Grid-Forming / Machine Synchrone Virtuelle), fournissant inertie synthétique, démarrage noir (black-start) et réglage rapide P-f / Q-U.',
    description_en: 'Four-quadrant reversible AC/DC converter operating in grid-forming voltage source mode (VSG), providing synthetic inertia, black-start, and ultra-fast P-f / Q-U stabilization.',
    function_fr: 'Injecte ou absorbe la puissance active et réactive en moins de 50 ms pour stabiliser la fréquence et la tension du réseau interconnecté.',
    function_en: 'Injects or absorbs four-quadrant active and reactive power within 50 ms to anchor grid frequency and voltage profile.',
    typical_location_fr: 'Poste de raccordement BESS 33 kV (Garoua / Maroua)',
    typical_location_en: '33 kV BESS Interconnection Substation (Garoua / Maroua)',
    voltage_level: 'MV',
    technical: {
      'Puissance apparente nominale': '2 500 kVA @ 45°C',
      'Plage de tension DC': '950 V à 1 500 V DC',
      'Tension nominale AC': '690 V triphasé (50 Hz)',
      'Modes de contrôle': 'Grid-Forming (VSG), Grid-Following, Droop P(f) / Q(U)',
      'Surcharge admissible': '120% pendant 60 s, 150% pendant 10 s',
      'Temps de réponse de puissance': '< 40 ms (échelon 0 à 100%)'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-d10-eq1',
      entity_id: 'eq-pcs-grid-forming-01',
      entity_type: 'equipment',
      source_ref: 'IEC 62933-5-2 / IEEE 2800-2022',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-02'
    }
  },
  {
    id: 'eq-bess-rack-lfp',
    domain_id: 'dom-10',
    domain_code: 'D10',
    subdomain_id: 'sub-d10-01',
    entity_type: 'BatteryRackAssembly',
    name_fr: 'Rack Batterie Lithium-Fer-Phosphate 1500 V DC / 215 kWh (LFP)',
    name_en: 'High-Voltage LFP Battery Rack 1500 V DC / 215 kWh',
    aliases_fr: ['Rack BESS LFP', 'Armoire Batterie 1500V', 'Module Stockage Haute Tension'],
    aliases_en: ['HV Battery Rack 1500V', 'LFP Energy Storage Rack', 'LiFePO4 Container Module'],
    description_fr: 'Armoire batterie modulaire intégrant des modules prismatiques LFP 280Ah, des plaques de refroidissement liquide directes, un BMU esclave et une protection coupe-circuit DC ultra-rapide.',
    description_en: 'Modular battery rack housing 280Ah prismatic LFP cells with direct liquid cooling plates, slave BMU monitoring, and high-speed DC fuse disconnect.',
    function_fr: 'Stocke l\'énergie électrochimique et assure la surveillance individuelle de tension, température et équilibrage passif/actif des cellules.',
    function_en: 'Stores bulk electrochemical energy with cell-level voltage and temperature telemetry, state of charge (SoC) estimation, and active balancing.',
    typical_location_fr: 'Conteneur BESS ISO 40 pieds climatisé',
    typical_location_en: '40ft ISO Temperature-Controlled BESS Container',
    voltage_level: 'DC',
    technical: {
      'Tension nominale du rack': '1 331.2 V DC (plage 1 164 V – 1 497 V DC)',
      'Capacité nominale': '215.3 kWh (cellules 3.2V 280Ah en 416S1P)',
      'Refroidissement': 'Plaques de refroidissement liquide (mélange eau-glycol)',
      'Durée de vie cyclique': '≥ 6 000 cycles à 80% DoD @ 25°C',
      'Protection incendie': 'Injecteur individuel d\'aérosol / Novec 1230 + détection H2/CO',
      'Communication': 'Bus CAN 2.0B vers le Master BMS'
    },
    is_safety_critical: true,
    hazard_level: 'thermal_runaway',
    provenance: {
      id: 'prov-d10-eq2',
      entity_id: 'eq-bess-rack-lfp',
      entity_type: 'equipment',
      source_ref: 'IEC 62619 / UL 9540A / NFPA 855',
      verification_status: 'verified',
      confidence: 0.94,
      verified_by: 'DEP-01',
      verified_at: '2026-09-02'
    }
  },
  {
    id: 'eq-ev-charger-350kw',
    domain_id: 'dom-10',
    domain_code: 'D10',
    subdomain_id: 'sub-d10-03',
    entity_type: 'UltraFastEVCharger',
    name_fr: 'Borne de Recharge Ultra-Rapide DC Haute Puissance 350 kW (HPC)',
    name_en: 'High-Power Ultra-Fast DC EV Charger 350 kW (HPC)',
    aliases_fr: ['Borne HPC 350 kW', 'Superchargeur DC', 'Station de recharge VE rapide'],
    aliases_en: ['Ultra-Fast DC Charger 350 kW', 'HPC EV Dispenser', 'Liquid-Cooled EV Fast Charger'],
    description_fr: 'Station de distribution d\'énergie pour véhicules électriques à convertisseurs SiC (carbure de silicium), câbles de charge refroidis par liquide, protocole ISO 15118 et communication OCPP 2.0.1.',
    description_en: 'Silicon Carbide (SiC) based ultra-fast EV charging station featuring liquid-cooled charging cables, ISO 15118 Plug & Charge, and OCPP 2.0.1 smart grid integration.',
    function_fr: 'Recharge les batteries de traction des véhicules lourds et légers en fournissant jusqu\'à 500 A continus sous une tension de 150 V à 1000 V DC.',
    function_en: 'Charges EV traction battery packs delivering up to 500 A continuous at 150V to 1000V DC with dynamic power sharing.',
    typical_location_fr: 'Corridor autoroutier Douala - Yaoundé & Dépôt Bus Électriques',
    typical_location_en: 'Douala - Yaoundé Highway Corridor & Electric Bus Fleet Depot',
    voltage_level: 'LV',
    technical: {
      'Puissance de sortie maximale': '350 kW DC',
      'Plage de tension de sortie': '150 V DC à 1 000 V DC',
      'Courant maximal': '500 A DC (câble refroidi par liquide)',
      'Connecteurs': 'Double connecteur CCS Combo 2 (Type 2)',
      'Protocoles': 'ISO 15118 (Plug & Charge), DIN 70121, OCPP 2.0.1',
      'Rendement énergétique': '≥ 96.5 % à pleine charge (technologie SiC)'
    },
    is_safety_critical: false,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-d10-eq3',
      entity_id: 'eq-ev-charger-350kw',
      entity_type: 'equipment',
      source_ref: 'IEC 61851-1 / IEC 61851-23 / ISO 15118',
      verification_status: 'verified',
      confidence: 0.93,
      verified_by: 'DEP-01',
      verified_at: '2026-09-02'
    }
  },
  {
    id: 'eq-relay-diff-87t',
    domain_id: 'dom-11',
    domain_code: 'D11',
    subdomain_id: 'sub-d11-01',
    entity_type: 'DifferentialProtectionRelay',
    name_fr: 'Relais Différentiel Numérique Transformateur & Alternateur (ANSI 87T / 87G)',
    name_en: 'Numerical Transformer & Generator Differential Relay (ANSI 87T / 87G)',
    aliases_fr: ['Protection Différentielle 87T', 'Relais 87G', 'IED Différentiel Unitaire'],
    aliases_en: ['Transformer Differential Relay', '87T IED', 'Unit Generator Differential'],
    description_fr: 'Relais numérique de protection différentielle à caractéristique à pourcentage stabilisé avec retenue harmonique 2 (courant d\'enclenchement inrush) et harmonique 5 (surfluxage), compensation d\'indice horaire par matrice logicielle et protection de terre restreinte (REF ANSI 64R).',
    description_en: 'Numerical percentage-restrained differential IED featuring 2nd harmonic inrush restraint, 5th harmonic overexcitation restraint, software vector group compensation, and high-impedance Restricted Earth Fault (REF / ANSI 64R).',
    function_fr: 'Détecte les courts-circuits entre spires, défauts internes de bobinage et amorçages à la cuve en moins de 18 ms sans risque de faux déclenchement sur défauts externes traversants.',
    function_en: 'Isolates internal transformer winding short-circuits and inter-turn faults in under 18 ms while remaining absolutely secure against heavy through-fault currents.',
    typical_location_fr: 'Postes d\'interconnexion 225/90 kV de Mangombé et Oyomabang (SONATREL)',
    typical_location_en: '225/90 kV Grid Interconnection Substations Mangombé & Oyomabang (SONATREL)',
    voltage_level: 'HV',
    technical: {
      'Algorithme de mesure': 'Différentiel à pourcentage stabilisé (pentes K1 = 20-30%, K2 = 50-80%)',
      'Retenue d\'enclenchement': 'Filtrage FFT harmonique 2 (seuil réglable 12% - 15% de I1)',
      'Retenue de surfluxage': 'Filtrage harmonique 5 (seuil 30% de I1)',
      'Temps de déclenchement': '< 20 ms pour Idiff > 2.0 In',
      'Protection de terre restreinte': 'ANSI 64R / REF haute impédance avec résistance stabilisatrice',
      'Communication sous-station': 'CEI 61850 MMS / GOOSE Ethernet redondant PRP'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d11-eq1',
      entity_id: 'eq-relay-diff-87t',
      entity_type: 'equipment',
      source_ref: 'CEI 60255-187-1 / IEEE C37.91',
      verification_status: 'verified',
      confidence: 0.96,
      verified_by: 'DEP-01',
      verified_at: '2026-09-03'
    }
  },
  {
    id: 'eq-relay-dist-21',
    domain_id: 'dom-11',
    domain_code: 'D11',
    subdomain_id: 'sub-d11-01',
    entity_type: 'LineDistanceProtectionRelay',
    name_fr: 'Relais Numérique de Protection de Distance Ligne 225 kV (ANSI 21/21N & 67N)',
    name_en: '225 kV Line Distance & Directional Earth Fault Protection Relay (ANSI 21/21N & 67N)',
    aliases_fr: ['Protection de Distance 21', 'Relais de Ligne HTB', 'Calculateur de Distance Numérique'],
    aliases_en: ['Transmission Line Distance Relay', '21/21N IED', 'Distance Protection 225 kV'],
    description_fr: 'Calculateur numérique de distance d\'impédance multi-zones (Zones 1, 2, 3 et Zone 4 arrière) avec caractéristiques quadrilatérales et Mho, compensation de facteur de terre k0, schémas de téléaction POTT/PUTT sur OPGW, et fonction antibasculeur de puissance (Power Swing Blocking ANSI 68).',
    description_en: 'Multi-zone numerical impedance distance IED (Zones 1-4) with polygonal and mho characteristics, residual earth factor k0 compensation, POTT/PUTT teleprotection schemes over OPGW fiber, and Power Swing Blocking (ANSI 68).',
    function_fr: 'Mesure le rapport tension/courant en phase et à la terre, détermine l\'impédance apparente de la boucle en défaut, et déclenche le disjoncteur en Zone 1 instantanée (< 20 ms) pour 85% de la longueur de ligne.',
    function_en: 'Calculates apparent loop impedance, identifies fault distance, and issues instantaneous Zone 1 breaker trip (< 20 ms) covering 85% of line length.',
    typical_location_fr: 'Lignes 225 kV Mangombe–Bekoko et Nachtigal–Bafoussam (SONATREL)',
    typical_location_en: '225 kV Mangombe–Bekoko and Nachtigal–Bafoussam Transmission Corridors',
    voltage_level: 'HV',
    technical: {
      'Zones de portée': '5 zones d\'impédance réversibles programmables (Zone 1 instantanée, Z2 300 ms, Z3 600 ms)',
      'Temps de détection': '< 15 ms pour défauts solides en Zone 1',
      'Facteur de compensation de terre': 'k0 = (Z0 - Z1) / (3·Z1) calculé en module et angle',
      'Téléaction': 'POTT / DUTT / Block via GOOSE optique sur réseau OPGW',
      'Déclenchement': 'Déclenchement unipolaire et réenclenchement automatique monophasé (ANSI 79)',
      'Blocage de pompage': 'ANSI 68 (Power Swing Detection par delta-Z sur plan d\'impédance)'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d11-eq2',
      entity_id: 'eq-relay-dist-21',
      entity_type: 'equipment',
      source_ref: 'CEI 60255-121 / IEEE C37.113 & Spécifications SONATREL HTB',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-03'
    }
  },
  {
    id: 'eq-mu-61869-9',
    domain_id: 'dom-11',
    domain_code: 'D11',
    subdomain_id: 'sub-d11-04',
    entity_type: 'ProcessBusMergingUnit',
    name_fr: 'Unité de Fusion Process Bus Haute Tension (Merging Unit CEI 61869-9 / 61850-9-2LE)',
    name_en: 'High-Voltage Process Bus Merging Unit (IEC 61869-9 / IEC 61850-9-2LE)',
    aliases_fr: ['Merging Unit MU', 'Convertisseur optique TC/TT', 'Boîtier de baie Process Bus'],
    aliases_en: ['Merging Unit (MU)', 'Sampled Values Publisher', 'Process Interface Unit (PIU)'],
    description_fr: 'Équipement d\'interface de tranche haute tension installé en pied de charpente, numérisant les signaux analogiques des transformateurs de mesure (TC/TT) en flux de valeurs échantillonnées (Sampled Values) à 4000 Hz / 4800 Hz publiées sur fibre optique.',
    description_en: 'Substation yard interface unit converting conventional or optical CT/VT analog secondary outputs into standardized IEC 61869-9 / 61850-9-2LE Sampled Value (SV) streams transmitted via fiber optic LAN.',
    function_fr: 'Supprime des kilomètres de câbles filaires en cuivre entre le poste extérieur et le bâtiment de commande, en transmettant les mesures via Ethernet optique avec horodatage PTP sub-microseconde.',
    function_en: 'Eliminates tons of copper control cabling by streaming digitized voltage and current measurements directly to protection IEDs over redundant optical Ethernet.',
    typical_location_fr: 'Châssis d\'appareillage extérieur Poste 225 kV de Nomayos (Yaoundé)',
    typical_location_en: 'Switchyard kiosk at 225 kV Nomayos Digital Substation (Yaoundé)',
    voltage_level: 'HV',
    technical: {
      'Taux d\'échantillonnage': '80 échantillons/période (4 000 Hz @ 50 Hz) ou 256 éch./période',
      'Format de données': 'Trames Ethernet Sampled Values CEI 61850-9-2LE / CEI 61869-9',
      'Synchronisation': 'IEEE 1588v2 Precision Time Protocol (PTP Power Profile C37.238)',
      'Ports réseau': '2 ports optiques 100/1000Base-FX en redondance transparente PRP / HSR',
      'Entrées analogiques': '4 entrées courant protection/mesure + 4 entrées tension phase/neutre',
      'Plage de température': '-40°C à +85°C (Boîtier durci IP67 extérieur tropicalisé)'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d11-eq3',
      entity_id: 'eq-mu-61869-9',
      entity_type: 'equipment',
      source_ref: 'CEI 61869-9 / CEI 61850-9-2LE & CIGRE TB 629',
      verification_status: 'verified',
      confidence: 0.94,
      verified_by: 'DEP-01',
      verified_at: '2026-09-03'
    }
  },
  // --- DOMAIN EXPANSION EQUIPMENT (ITERATION 01 STRUCTURAL FOUNDATION) ---
  {
    id: 'eq-ems-scada-dispatch',
    domain_id: 'dom-02',
    domain_code: 'D02',
    subdomain_id: 'sub-d02-01',
    entity_type: 'EnergyManagementSystem',
    name_fr: 'Plateforme EMS / SCADA de Dispatching National (Réseau Interconnecté Sud / RIS)',
    name_en: 'National Dispatching Energy Management System (EMS / SCADA)',
    aliases_fr: ['SCADA National SONATREL', 'Dispatching Mangombé / Yaoundé', 'Système EMS'],
    aliases_en: ['National Grid EMS', 'Transmission SCADA Center', 'Power Flow Dispatcher'],
    description_fr: 'Plateforme logicielle et matérielle haute disponibilité redondée géographiquement, calculant en temps réel l\'état du réseau électrique (State Estimation), l\'analyse de contingence N-1, l\'optimisation économique du dispatching de production (ED), et la téléconduite des postes 225 kV.',
    description_en: 'Geographically redundant real-time control room platform executing state estimation, dynamic N-1 contingency security assessment, economic dispatch, and high-voltage transmission grid supervision.',
    function_fr: 'Maintient en permanence l\'équilibre offre-demande (50.00 Hz), régule les transits sur les corridors 225 kV et coordonne les secours en cas de perte brutale d\'un groupe de production majeur.',
    function_en: 'Maintains system frequency stability (50 Hz), supervises transmission power flows, and coordinates grid restoration following tripping events.',
    typical_location_fr: 'Centre National de Conduite du Réseau (Dispatching SONATREL de Mangombé / Édéa)',
    typical_location_en: 'SONATREL National Grid Control Center (Mangombé / Édéa)',
    voltage_level: null,
    technical: {
      'Puissance surveillée': '1 500 MW (Pointe RIS)',
      'Temps de cycle du calcul d\'état': '< 10 secondes (Newton-Raphson)',
      'Protocoles de téléconduite': 'CEI 60870-5-104 & CEI 60870-6 / TASE.2 (ICCP)',
      'Nombre de postes téléconduits': '> 45 postes sources HTB/HTA',
      'Redondance': 'Serveurs en cluster chaud 99.999% de disponibilité'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d02-eq1',
      entity_id: 'eq-ems-scada-dispatch',
      entity_type: 'equipment',
      source_ref: 'SONATREL Direction du Mouvement d\'Énergie & CEI 61970 (CIM)',
      verification_status: 'verified',
      confidence: 0.96,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-plc-dcs-controller',
    domain_id: 'dom-07',
    domain_code: 'D07',
    subdomain_id: 'sub-d07-01',
    entity_type: 'IndustrialPLC',
    name_fr: 'Automate Programmable Industriel Sécuritaire (API/PLC SIL3) & DCS de Procédé',
    name_en: 'Safety Industrial PLC (SIL3 / Cat. 4) & Process DCS Controller',
    aliases_fr: ['API de Sécurité', 'Contrôleur DCS', 'Automate Procédé'],
    aliases_en: ['Safety PLC', 'DCS Process Controller', 'Programmable Automation Controller (PAC)'],
    description_fr: 'Contrôleur logique programmable industriel modulaire durci, intégrant une architecture à microprocesseurs redondants (1oo2D ou 2oo3), certifié CEI 61508 SIL 3 pour l\'automatisation de procédés critiques et l\'arrêt d\'urgence.',
    description_en: 'Ruggedized modular programmable automation controller featuring redundant CPUs (1oo2D or 2oo3), certified to IEC 61508 SIL 3 for mission-critical industrial process control and emergency shutdown.',
    function_fr: 'Exécute les algorithmes de régulation rapide (boucles PID, séquences de démarrage, gestion de pompage) et assure la mise en sécurité instantanée des installations industrielles.',
    function_en: 'Executes high-speed control algorithms (PID loops, motor start sequences, anti-surge) and enforces instantaneous fail-safe emergency shutdown.',
    typical_location_fr: 'Usines chimiques, cimenteries de Bonabéri, stations de pompage et centrales thermiques',
    typical_location_en: 'Chemical processing plants, Bonabéri cement mills, water pumping and gas plants',
    voltage_level: 'LV',
    technical: {
      'Niveau de sécurité fonctionnelle': 'SIL 3 (CEI 61508) / PL e Cat. 4 (ISO 13849-1)',
      'Temps de scrutation (Scan cycle)': '< 5 ms pour 10 000 instructions logiques',
      'Protocoles de communication': 'Profinet IRT, Modbus TCP, EtherNet/IP, OPC UA',
      'Capacité E/S': 'Jusqu\'à 2 048 voies logiques et analogiques déportées',
      'Alimentation': '24 V DC redondée avec surveillance de boucle'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d07-eq1',
      entity_id: 'eq-plc-dcs-controller',
      entity_type: 'equipment',
      source_ref: 'CEI 61131-3 & CEI 61508 / CEI 62061',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-vfd-inverter-drive',
    domain_id: 'dom-07',
    domain_code: 'D07',
    subdomain_id: 'sub-d07-01',
    entity_type: 'VariableFrequencyDrive',
    name_fr: 'Variateur de Vitesse Électronique Basse / Moyenne Tension (VFD 690 V / 400 kW)',
    name_en: 'Variable Frequency Drive (VFD / Inverter Drive 690 V / 400 kW)',
    aliases_fr: ['Variateur de fréquence', 'Convertisseur de fréquence', 'Gradateur PWM IGBT'],
    aliases_en: ['Variable Speed Drive (VSD)', 'AC Drive', 'IGBT Inverter Drive'],
    description_fr: 'Convertisseur de fréquence statique à pont redresseur, bus continu filtré et onduleur MLI (PWM) à transistors IGBT, assurant la régulation vectorielle de flux sans capteur des moteurs asynchrones et synchrones.',
    description_en: 'Static power electronic frequency converter with diode/active front end, filtered DC link, and IGBT pulse-width-modulated (PWM) inverter executing sensorless flux vector motor speed control.',
    function_fr: 'Adapte la vitesse de rotation et le couple des moteurs de forte puissance en fonction des besoins du procédé, réduisant la consommation électrique de 30% à 50% sur pompes et ventilateurs.',
    function_en: 'Regulates motor shaft speed and dynamic torque to match process demand, slashing pump and blower energy consumption by 30% to 50%.',
    typical_location_fr: 'Laminoirs d\'aluminium Alucam (Édéa), broyeurs miniers, compresseurs industriels',
    typical_location_en: 'Alucam aluminum smelter (Édéa), cement grinding mills, heavy industrial blowers',
    voltage_level: 'LV',
    technical: {
      'Tension d\'alimentation': '690 V AC triphasé (-15% / +10%) à 50 Hz',
      'Puissance nominale': '400 kW (Courant nominal 430 A)',
      'Fréquence de découpage': '2 kHz à 8 kHz réglable',
      'Rendement énergétique': '> 98.2% à pleine charge',
      'Sécurité intégrée': 'Safe Torque Off (STO SIL3) certifié CEI 61800-5-2',
      'Filtre d\'harmoniques': 'Inductance de ligne 3% + filtre dV/dt moteur'
    },
    is_safety_critical: true,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-d07-eq2',
      entity_id: 'eq-vfd-inverter-drive',
      entity_type: 'equipment',
      source_ref: 'CEI 61800-3 & CEI 61800-5-1',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-fire-ssi-substation',
    domain_id: 'dom-08',
    domain_code: 'D08',
    subdomain_id: 'sub-d08-01',
    entity_type: 'FireDetectionAndExtinguishingSystem',
    name_fr: 'Centrale de Sécurité Incendie SSI Catégorie A & Système d\'Extinction Gaz Novec 1230',
    name_en: 'Fire Alarm Control Panel (SSI Cat. A) & Novec 1230 Clean Agent Gas Suppression',
    aliases_fr: ['Centrale incendie ECS', 'Extinction automatique Novec', 'Système SSI de poste'],
    aliases_en: ['Fire Alarm Panel', 'Clean Agent Fire Extinguishing', 'Substation SSI'],
    description_fr: 'Système de sécurité incendie adressable comprenant des détecteurs optiques de fumée, thermo-vélocimétriques et d\'aspiration haute sensibilité (VESDA), couplé à une réserve de gaz extincteur propre FK-5-1-12 (Novec 1230) non conducteur électrique.',
    description_en: 'Addressable fire alarm control system combining optical smoke, rate-of-rise heat, and aspirating smoke detectors (VESDA) with automated dielectric clean-agent gas flooding (Novec 1230) for electrical equipment rooms.',
    function_fr: 'Détecte les débuts de combustion dès la phase pyrolytique dans les salles de contrôle, armoires IED et postes blindés GIS, déclenchant l\'extinction totale en moins de 10 secondes sans endommager les composants électroniques.',
    function_en: 'Detects incipient pyrolysis within control rooms, protection relay cabinets, and GIS switchgear, achieving fire extinguishment in under 10 seconds without damaging energized electronics.',
    typical_location_fr: 'Salles des relais et salles de commande des postes 225 kV de Nomayos, Bekoko et Nachtigal',
    typical_location_en: 'Relay and control rooms across 225 kV substations in Nomayos, Bekoko and Nachtigal',
    voltage_level: 'LV',
    technical: {
      'Norme de conception': 'NF S 61-931 à 936 (SSI Catégorie A) & NFPA 2001',
      'Agent extincteur': 'FK-5-1-12 (Novec 1230 / Fluorocétone)',
      'Temps de décharge': '< 10 secondes pour concentration d\'extinction 5.6%',
      'Sensibilité VESDA': '0.005% à 20% d\'obscurcissement par mètre',
      'Alimentation secourue': 'Batteries étanches autonomie 72h veille + 30 min alarme'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d08-eq1',
      entity_id: 'eq-fire-ssi-substation',
      entity_type: 'equipment',
      source_ref: 'NF S 61-931 / NF S 61-970 & NFPA 72 / NFPA 2001',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-digital-twin-server',
    domain_id: 'dom-09',
    domain_code: 'D09',
    subdomain_id: 'sub-d09-01',
    entity_type: 'DigitalTwinPredictiveServer',
    name_fr: 'Serveur Industriel Jumeau Numérique & Analyseur Prédictif DGA/Vibratoire IA',
    name_en: 'Edge Industrial Digital Twin Server & AI Predictive Maintenance Engine',
    aliases_fr: ['Jumeau Numérique de Poste', 'Serveur APM IA', 'Analyseur DGA en ligne'],
    aliases_en: ['Asset Performance Management (APM)', 'Substation Digital Twin', 'AI Fleet Monitor'],
    description_fr: 'Serveur durci d\'Edge Computing déployé en sous-station, exécutant des modèles physiques couplés à des réseaux de neurones pour l\'estimation en temps réel du vieillissement thermique des transformateurs, l\'analyse chromatographique des gaz dissous dans l\'huile (DGA) et la prédiction de rupture mécanique.',
    description_en: 'Substation edge computing server integrating physics-informed neural networks for real-time transformer thermal aging simulation, online dissolved gas analysis (DGA), and circuit breaker health index tracking.',
    function_fr: 'Calcule l\'indice d\'état de santé (Health Index) des actifs critiques, détecte les décharges partielles naissantes et planifie la maintenance conditionnelle avant toute avarie majeure.',
    function_en: 'Computes real-time Asset Health Indices (AHI), detects incipient partial discharges, and schedules predictive maintenance prior to catastrophic failure.',
    typical_location_fr: 'Postes d\'interconnexion majeurs SONATREL (Poste de Mangombé 225/90 kV)',
    typical_location_en: 'Major transmission hubs (SONATREL Mangombé 225/90 kV Substation)',
    voltage_level: 'LV',
    technical: {
      'Modèle thermique': 'CEI 60076-7 (Calcul du point chaud enroulement Hot-Spot en temps réel)',
      'Méthodes DGA intégrées': 'Triangle de Duval, Rapports de Rogers, Norme CEI 60599',
      'Fréquence d\'ingestion IoT': '1 Hz pour télémesures SCADA / 4 kHz pour capteurs d\'ondes acoustiques',
      'Protocoles supportés': 'MQTT Sparkplug B, OPC UA Pub/Sub, CEI 61850 MMS',
      'Cybersécurité': 'Chiffrement TLS 1.3, conforme CEI 62443-4-2 SL3'
    },
    is_safety_critical: false,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d09-eq1',
      entity_id: 'eq-digital-twin-server',
      entity_type: 'equipment',
      source_ref: 'CIGRE Technical Brochure 761 & CEI 60599 / CEI 60076-7',
      verification_status: 'verified',
      confidence: 0.94,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-rtu-gateway-104',
    domain_id: 'dom-12',
    domain_code: 'D12',
    subdomain_id: 'sub-d12-01',
    entity_type: 'SubstationRTUGateway',
    name_fr: 'Passerelle Téléconduite RTU & Synchrocoupleur de Poste CEI 60870-5-104',
    name_en: 'Substation Telecontrol RTU Gateway & Dual Channel IEC 60870-5-104 Controller',
    aliases_fr: ['RTU de poste', 'Passerelle de téléconduite', 'Concentrateur de données téléconduite'],
    aliases_en: ['Remote Terminal Unit (RTU)', 'Telecontrol Gateway', 'SCADA RTU Node'],
    description_fr: 'Unité terminale distante modulaire de haute disponibilité équipée de deux unités centrales redondantes, assurant l\'acquisition locale des télémesures, télésignalisations et commandes du poste, et leur transmission sécurisée vers le Dispatching National.',
    description_en: 'High-availability modular Remote Terminal Unit (RTU) with dual redundant processors, aggregating substation telemetry, indications, and controls for secure upstream SCADA transmission.',
    function_fr: 'Assure l\'interface de téléconduite bidirectionnelle entre le Dispatching (EMS) et les calculateurs de tranche (BCU) du poste, avec conversion de protocoles et horodatage des événements à la milliseconde.',
    function_en: 'Provides bidirectional telecontrol bridge between central dispatching EMS and bay controllers, converting protocols and timestamping sequence-of-events to 1 ms precision.',
    typical_location_fr: 'Tous les postes sources 225 kV et 90 kV du réseau SONATREL au Cameroun',
    typical_location_en: 'All 225 kV and 90 kV transmission substations across Cameroon national grid',
    voltage_level: 'LV',
    technical: {
      'Protocoles amont (WAN)': 'CEI 60870-5-104 sécurisé (CEI 62351-3), DNP3 IP',
      'Protocoles aval (LAN)': 'CEI 61850 MMS (Client), Modbus TCP/RTU, CEI 60870-5-101/103',
      'Horodatage SOE': 'Précision 1 ms (Synchronisation GPS / PTP IEEE 1588)',
      'Ports de communication': '4 ports Ethernet RJ45/SFP + 4 ports série RS-232/485 isolés',
      'Capacité d\'adressage': '> 10 000 points d\'informations (TS, TM, TC)'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d12-eq1',
      entity_id: 'eq-rtu-gateway-104',
      entity_type: 'equipment',
      source_ref: 'Spécifications Techniques SONATREL Contrôle-Commande & CEI 60870-5-104',
      verification_status: 'verified',
      confidence: 0.96,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-bcu-bay-controller',
    domain_id: 'dom-12',
    domain_code: 'D12',
    subdomain_id: 'sub-d12-02',
    entity_type: 'BayControlUnit',
    name_fr: 'Calculateur de Baie Numérique (BCU CEI 61850) & Verrouillage de Travée',
    name_en: 'IEC 61850 Bay Control Unit (BCU) & Bay Interlocking Controller',
    aliases_fr: ['Calculateur de tranche BCU', 'Boîtier de commande de travée', 'Automate de travée'],
    aliases_en: ['Bay Controller (BCU)', 'Bay Control IED', 'Switchgear Bay Terminal'],
    description_fr: 'Équipement électronique intelligent (IED) dédié à la commande locale et distante d\'une travée haute tension (disjoncteur, sectionneurs de barres, sectionneurs de terre), intégrant les équations d\'enclenchement logique et de verrouillage électrique.',
    description_en: 'Dedicated high-voltage bay control IED executing local/remote switching of circuit breakers, busbar disconnectors, and earth switches with hardware and software interlocking logic.',
    function_fr: 'Empêche toute fausse manœuvre d\'exploitation (ex. manœuvre de sectionneur sous charge ou fermeture sur court-circuit) grâce aux interverrouillages logiques échangés par trames GOOSE entre travées.',
    function_en: 'Prevents hazardous operational misoperation (such as opening disconnectors under load) via bay-to-bay GOOSE interlocks.',
    typical_location_fr: 'Armoires de tranche dans les salles de relayage de poste 225/30 kV',
    typical_location_en: 'Bay relay panels in 225/30 kV substation switchhouses',
    voltage_level: 'LV',
    technical: {
      'Norme de communication': 'CEI 61850 Édition 2 (MMS Serveur, publication et souscription GOOSE)',
      'Synchrocoupleur intégré': 'ANSI 25 (Contrôle d\'écart de tension, fréquence et angle de phase)',
      'Écran synoptique': 'Écran graphique couleur avec schéma unifilaire dynamique et commandes sécurisées',
      'Nombre d\'entrées/sorties': '32 entrées TOR isolées optiquement + 16 sorties relais de puissance',
      'Temps de réponse': '< 5 ms pour exécution d\'interverrouillage GOOSE'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d12-eq2',
      entity_id: 'eq-bcu-bay-controller',
      entity_type: 'equipment',
      source_ref: 'CEI 61850-7-4 & CEI 62271-102 (Verrouillage appareillage HT)',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-opgw-fiber-sdh',
    domain_id: 'dom-13',
    domain_code: 'D13',
    subdomain_id: 'sub-d13-01',
    entity_type: 'OPGWTelecomSystem',
    name_fr: 'Multiplexeur Télécom SDH / MPLS-TP sur Câble de Garde Optique OPGW',
    name_en: 'SDH / MPLS-TP Operational Telecom Multiplexer over OPGW Optical Ground Wire',
    aliases_fr: ['Nœud télécom de poste', 'Multiplexeur OPGW', 'Réseau de transmission optique SONATREL'],
    aliases_en: ['Substation SDH/MPLS Node', 'OPGW Telecommunication Terminal', 'Utility WAN Multiplexer'],
    description_fr: 'Équipement de transmission télécom critique durci pour sous-stations, raccordé aux tubes d\'acier inox contenant 48 fibres optiques monomodes intégrées au câble de garde (OPGW) des lignes aériennes 225 kV.',
    description_en: 'Ruggedized utility-grade transport multiplexer delivering deterministic teleprotection and SCADA bandwidth over 48 single-mode optical fibers embedded in 225 kV line OPGW cables.',
    function_fr: 'Transporte sans gigue les signaux de téléprotection différentielle de ligne (IEEE C37.94), les trames téléconduite SCADA, la téléphonie d\'exploitation et les flux vidéo de surveillance de poste.',
    function_en: 'Carries ultra-low-latency, zero-jitter teleprotection channels (IEEE C37.94), SCADA telecontrol, voice dispatch, and substation CCTV surveillance streams.',
    typical_location_fr: 'Lignes 225 kV Songloulou-Mangombé-Bekoko et dorsale OPGW nationale',
    typical_location_en: '225 kV Songloulou-Mangombé-Bekoko lines and national OPGW backbone',
    voltage_level: 'HV',
    technical: {
      'Capacité de transport': 'STM-16 / STM-64 (2.5 Gb/s à 10 Gb/s) et 10 Gigabit Ethernet MPLS-TP',
      'Temps de commutation de protection': '< 5 ms (Auto-cicatrisation sur boucle anneau protégée)',
      'Gigue maximale de téléprotection': '< 0.1 ms (conforme IEEE C37.94)',
      'Type de fibre': 'G.652D monomode à très faible atténuation (< 0.22 dB/km à 1550 nm)',
      'Immunité électromagnétique': 'Totale contre la foudre et courts-circuits 225 kV'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d13-eq1',
      entity_id: 'eq-opgw-fiber-sdh',
      entity_type: 'equipment',
      source_ref: 'Spécifications Réseau Télécom SONATREL & IEEE C37.94 / ITU-T G.709',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-active-filter-apf',
    domain_id: 'dom-14',
    domain_code: 'D14',
    subdomain_id: 'sub-d14-01',
    entity_type: 'ActiveHarmonicFilterAndSTATCOM',
    name_fr: 'Filtre Actif d\'Harmoniques (APF) & Compensateur Shunt STATCOM MT/BT',
    name_en: 'Active Harmonic Filter (APF) & Shunt STATCOM Dynamic Compensator',
    aliases_fr: ['Filtre actif dépollueur', 'Compensateur actif de puissance réactive', 'STATCOM basse tension'],
    aliases_en: ['Active Power Filter (APF)', 'Distribution STATCOM (D-STATCOM)', 'Dynamic Reactive Compensator'],
    description_fr: 'Système électronique de puissance à base d\'onduleur de tension IGBT à commutation rapide, injectant en temps réel des courants harmoniques en opposition de phase pour annuler les distorsions créées par les charges non-linéaires industrielles.',
    description_en: 'Power electronics converter utilizing high-speed IGBTs to inject anti-phase compensation currents in real time, canceling out harmonic pollution generated by non-linear industrial loads.',
    function_fr: 'Ramène le taux de distorsion harmonique global en courant (THDi) de 40% à moins de 3%, élimine le flicker et fournit une compensation réactive ultra-rapide (cos φ = 0.99) en moins de 5 ms.',
    function_en: 'Suppresses total harmonic current distortion (THDi) from 40% down to under 3%, mitigates flicker, and provides sub-cycle reactive power compensation (target cos φ = 0.99).',
    typical_location_fr: 'Sites industriels avec fours à arc, laminoirs, data centers et stations de pompage à Douala',
    typical_location_en: 'Industrial complexes with arc furnaces, rolling mills, data centers in Douala',
    voltage_level: 'LV',
    technical: {
      'Tension de raccordement': '400 V / 690 V triphasé 50 Hz',
      'Courant de compensation nominal': '300 A efficace par unité modulaire',
      'Spectre d\'atténuation harmonique': 'Du rang 2 au rang 50 (sélectif ou global)',
      'Temps de réponse': '< 5 millisecondes pour échelon de charge réactive',
      'Atténuation THDi': 'Ramené à < 3% selon exigences IEEE 519-2022'
    },
    is_safety_critical: false,
    hazard_level: 'arc_flash',
    provenance: {
      id: 'prov-d14-eq1',
      entity_id: 'eq-active-filter-apf',
      entity_type: 'equipment',
      source_ref: 'CEI 61000-3-4 & IEEE Std 519-2022',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-smart-meter-ami',
    domain_id: 'dom-15',
    domain_code: 'D15',
    subdomain_id: 'sub-d15-01',
    entity_type: 'SmartMeterAMI',
    name_fr: 'Compteur Électrique Communicant Intelligent AMI 4-Quadrants Triphasé',
    name_en: 'Advanced Metering Infrastructure (AMI) 4-Quadrant Three-Phase Smart Meter',
    aliases_fr: ['Compteur communicant Eneo', 'Compteur intelligent AMI', 'Compteur à prépaiement STS'],
    aliases_en: ['AMI Smart Meter', '4-Quadrant Utility Revenue Meter', 'Prepayment STS Meter'],
    description_fr: 'Compteur électronique d\'énergie bidirectionnel de précision classe 0.2S / 0.5S, équipé d\'un organe de coupure interne 100 A télécommandable, de modules radio cellulaires (4G/NB-IoT) et CPL (G3-PLC), communicant selon le protocole normalisé DLMS/COSEM.',
    description_en: 'Utility-grade revenue meter featuring class 0.2S accuracy, integrated 100 A load switch, cellular NB-IoT and G3-PLC communications, compliant with DLMS/COSEM protocols.',
    function_fr: 'Mesure en continu l\'énergie active et réactive importée/exportée, enregistre la courbe de charge (Load Profile), détecte les fraudes (ouverture de capot, champ magnétique) et permet le prépaiement STS.',
    function_en: 'Measures four-quadrant active and reactive energy, logs interval load profiles, detects tampering attempts, and supports STS prepayment.',
    typical_location_fr: 'Postes de transformation HTA/BT et coffrets d\'abonnés industriels et résidentiels Eneo',
    typical_location_en: 'HTA/BT distribution kiosks and customer points of delivery across Cameroon',
    voltage_level: 'LV',
    technical: {
      'Classe de précision': 'Classe 0.2S (CEI 62053-22) pour tarif vert / Classe 1 pour résidentiel',
      'Plage de tension': '3 × 230/400 V AC (-30% / +20%)',
      'Courant maximal': 'Raccordement direct 5(100) A ou sur transformateur de courant 1(6) A',
      'Protocoles': 'DLMS / COSEM (CEI 62056) & Standard STS pour prépaiement',
      'Canaux télécom': 'G3-PLC (CPL bande CENELEC A) + 4G LTE-M / NB-IoT avec carte e-SIM',
      'Sécurité': 'Chiffrement cryptographique AES-128 / Suite de sécurité 0 et 1'
    },
    is_safety_critical: true,
    hazard_level: 'none',
    provenance: {
      id: 'prov-d15-eq1',
      entity_id: 'eq-smart-meter-ami',
      entity_type: 'equipment',
      source_ref: 'CEI 62053-22 / CEI 62056 & Spécification Eneo Cameroun AMI',
      verification_status: 'verified',
      confidence: 0.96,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  },
  {
    id: 'eq-earth-grid-copper',
    domain_id: 'dom-16',
    domain_code: 'D16',
    subdomain_id: 'sub-d16-01',
    entity_type: 'SubstationGroundingGrid',
    name_fr: 'Grille de Terre Maillée en Cuivre Enterré & Électrodes Profondes de Poste HTB',
    name_en: 'Buried Copper Substation Grounding Grid & Deep Earth Rod Electrodes',
    aliases_fr: ['Réseau de terre de poste', 'Ceinture de terre HTB', 'Prise de terre générale'],
    aliases_en: ['Grounding Grid', 'Substation Earthing Mesh', 'Ground Mat IEEE 80'],
    description_fr: 'Réseau maillé de conducteurs en cuivre recuit nu 95 mm² ou 120 mm² enfouis à 0.80 m de profondeur sous l\'ensemble de l\'emprise du poste, interconnectés par soudures aluminothermiques étanches (Cadweld), complétés par des piquets de terre en cuivre massif forés en grande profondeur.',
    description_en: 'Extensive mesh of bare annealed copper conductors (95 or 120 mm²) buried 0.8 m below the substation yard, joined by exothermic welds (Cadweld) and reinforced by deep-driven vertical copper ground rods.',
    function_fr: 'Maintient la résistance globale de terre sous 0.5 Ω, dissipe en toute sécurité les courants de court-circuit foudre et défauts phase-terre 225 kV, et garantit que les tensions de pas et de toucher restent sous les seuils de fibrillation selon IEEE 80.',
    function_en: 'Maintains overall substation ground resistance below 0.5 ohms, dissipates lightning surges and phase-to-earth fault currents, ensuring safe step and touch voltages.',
    typical_location_fr: 'Sous la totalité de la plateforme des postes 225 kV (Nomayos, Bekoko, Mangombé)',
    typical_location_en: 'Beneath the entire yard footprint of all 225 kV transmission substations',
    voltage_level: 'HV',
    technical: {
      'Résistance globale de terre ciblée': '< 0.50 Ω (Postes d\'interconnexion 225 kV)',
      'Conducteur de grille': 'Cuivre recuit nu 95 mm² (tenue au courant de défaut 40 kA / 1s)',
      'Profondeur d\'enfouissement': '0.80 mètre avec lit de terre végétale et couche de gravier 10 cm',
      'Norme de dimensionnement': 'IEEE Std 80-2013 & CEI 61936-1',
      'Tension de pas tolérable (Estep)': '< 2 500 V pour durée ts = 0.5 s (couche gravier ρs = 3000 Ω·m)',
      'Tension de toucher tolérable (Etouch)': '< 750 V pour durée ts = 0.5 s'
    },
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    provenance: {
      id: 'prov-d16-eq1',
      entity_id: 'eq-earth-grid-copper',
      entity_type: 'equipment',
      source_ref: 'IEEE Std 80-2013 / CEI 61936-1 & Spécification SONATREL Prises de Terre',
      verification_status: 'verified',
      confidence: 0.97,
      verified_by: 'DEP-01',
      verified_at: '2026-09-04'
    }
  }
];

// RELATION EDGES BETWEEN EQUIPMENT & NODES (COMPREHENSIVE KNOWLEDGE GRAPH)
export const RELATION_EDGES: Edge[] = [
  // 1. Generation to Transmission
  {
    id: 'edge-01',
    source_id: 'eq-hydro-songloulou-01',
    source_name: 'Alternateur Songloulou (11 kV)',
    target_id: 'eq-trafo-hta-01',
    target_name: 'Transformateur Élévateur GSU 11/225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Évacue la puissance produite à 11 kV vers le transformateur élévateur de groupe GSU',
    notes_en: 'Delivers generated 11 kV power to the generator step-up (GSU) transformer'
  },
  {
    id: 'edge-02',
    source_id: 'eq-relay-87t-01',
    source_name: 'Relais Différentiel Alternateur/Groupe 87G/87U',
    target_id: 'eq-hydro-songloulou-01',
    target_name: 'Alternateur Songloulou (11 kV)',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Surveille et protège le stator de l\'alternateur contre les courts-circuits internes',
    notes_en: 'Protects alternator stator windings against internal phase-to-phase and earth faults'
  },
  // 2. Transmission Corridor
  {
    id: 'edge-03',
    source_id: 'eq-cb-sf6-01',
    source_name: 'Disjoncteur SF6 225 kV',
    target_id: 'eq-tower-225kv',
    target_name: 'Pylône Métallique HTB 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Enclenche et protège le départ de la ligne aérienne 225 kV vers le corridor national',
    notes_en: 'Switches and protects the 225 kV overhead transmission line departure'
  },
  {
    id: 'edge-04',
    source_id: 'eq-disconnector-225k',
    source_name: 'Sectionneur 225 kV',
    target_id: 'eq-cb-sf6-01',
    target_name: 'Disjoncteur SF6 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Assure l\'isolement visible amont/aval du disjoncteur pour consignation sécuritaire',
    notes_en: 'Provides visible isolation upstream and downstream of circuit breaker for safe lockout'
  },
  {
    id: 'edge-05',
    source_id: 'eq-relay-dist-21',
    source_name: 'Relais de Protection de Distance Ligne ANSI 21',
    target_id: 'eq-cb-sf6-01',
    target_name: 'Disjoncteur SF6 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'controls',
    direction: 'out',
    notes_fr: 'Transmet l\'ordre d\'ouverture instantanée au disjoncteur lors d\'un défaut sur la ligne 225 kV',
    notes_en: 'Issues instantaneous tripping command to 225 kV breaker upon transmission line fault'
  },
  {
    id: 'edge-06',
    source_id: 'eq-tower-225kv',
    source_name: 'Pylône Métallique HTB 225 kV',
    target_id: 'eq-opgw-fiber-sdh',
    target_name: 'Câble de Garde Optique OPGW',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'contains',
    direction: 'out',
    notes_fr: 'Le sommet du pylône supporte le câble OPGW pour la protection foudre et les télécoms',
    notes_en: 'Pylon apex supports OPGW wire for lightning shielding and high-speed communications'
  },
  // 3. Substation Incomer & Transformation
  {
    id: 'edge-07',
    source_id: 'eq-tower-225kv',
    source_name: 'Pylône Métallique HTB 225 kV',
    target_id: 'eq-gis-bay-225kv',
    target_name: 'Travée Blindée GIS SF6 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'La ligne aérienne 225 kV aboutit aux traversées air-SF6 de la travée blindée GIS',
    notes_en: 'The 225 kV overhead line terminates into GIS outdoor air-to-SF6 bushings'
  },
  {
    id: 'edge-08',
    source_id: 'eq-surge-arrester-225k',
    source_name: 'Parafoudre ZnO 225 kV',
    target_id: 'eq-trafo-hta-01',
    target_name: 'Transformateur HTA (225/30 kV)',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Écrête les ondes de choc de foudre et surtensions de manœuvre protégeant les traversées HT',
    notes_en: 'Clamps lightning impulse overvoltages and switching surges to protect transformer bushings'
  },
  {
    id: 'edge-09',
    source_id: 'eq-trafo-hta-01',
    source_name: 'Transformateur HTA (225/30 kV)',
    target_id: 'eq-cell-mv-30k-01',
    target_name: 'Cellule Arrivée MT 30 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Alimente le jeu de barres MT 30 kV via la cellule disjoncteur d\'arrivée transformateur',
    notes_en: 'Energizes the 30 kV distribution busbar through the transformer incomer switchgear bay'
  },
  {
    id: 'edge-10',
    source_id: 'eq-ner-30k',
    source_name: 'Résistance de Neutre (NER) 30 kV',
    target_id: 'eq-trafo-hta-01',
    target_name: 'Transformateur HTA (225/30 kV)',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Raccordée au point neutre 30 kV pour limiter les courants de court-circuit terre à 300 A',
    notes_en: 'Connected to 30 kV neutral point to limit phase-to-earth fault currents to 300 A'
  },
  // 4. Substation Automation & Telecontrol
  {
    id: 'edge-11',
    source_id: 'eq-ems-scada-dispatch',
    source_name: 'SCADA Dispatching National EMS',
    target_id: 'eq-rtu-gateway-104',
    target_name: 'Passerelle RTU CEI 60870-5-104',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'supervises',
    direction: 'out',
    notes_fr: 'Supervise le poste en temps réel et transmet les ordres de télécommande via réseau WAN',
    notes_en: 'Supervises substation in real time and issues remote control commands via utility WAN'
  },
  {
    id: 'edge-12',
    source_id: 'eq-rtu-gateway-104',
    source_name: 'Passerelle RTU CEI 60870-5-104',
    target_id: 'eq-bcu-bay-controller',
    target_name: 'Calculateur de Baie BCU CEI 61850',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'communicates_with',
    direction: 'out',
    notes_fr: 'Échange les états, alarmes et ordres de manœuvre via le protocole CEI 61850 MMS',
    notes_en: 'Exchanges switchgear status, alarms and switching commands via IEC 61850 MMS bus'
  },
  {
    id: 'edge-13',
    source_id: 'eq-bcu-bay-controller',
    source_name: 'Calculateur de Baie BCU CEI 61850',
    target_id: 'eq-cb-sf6-01',
    target_name: 'Disjoncteur SF6 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'controls',
    direction: 'out',
    notes_fr: 'Gère les commandes d\'ouverture/fermeture et verrouillages d\'exploitation du disjoncteur',
    notes_en: 'Executes open/close commands and manages operational interlocks for the circuit breaker'
  },
  {
    id: 'edge-14',
    source_id: 'eq-mu-61869-9',
    source_name: 'Merging Unit CEI 61869-9',
    target_id: 'eq-ied-relay-61850',
    target_name: 'Relais Numérique CEI 61850',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'measures',
    direction: 'out',
    notes_fr: 'Diffuse les valeurs instantanées échantillonnées (Sampled Values 4000 Hz) sur fibre optique',
    notes_en: 'Streams digitized instantaneous current and voltage Sampled Values (4000 Hz) over process bus'
  },
  // 5. Distribution Feeder & Protection
  {
    id: 'edge-15',
    source_id: 'eq-cell-mv-30k-01',
    source_name: 'Cellule MT 30 kV',
    target_id: 'eq-recloser-30k',
    target_name: 'Disjoncteur Réenclencheur Aérien 30 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Le départ poste 30 kV alimente la ligne de distribution aérienne protégée par le réenclencheur',
    notes_en: 'Substation 30 kV feeder bay feeds the overhead distribution corridor protected by the recloser'
  },
  {
    id: 'edge-16',
    source_id: 'eq-recloser-30k',
    source_name: 'Disjoncteur Réenclencheur Aérien 30 kV',
    target_id: 'eq-kiosk-30kv-400v',
    target_name: 'Poste Kiosque HTA/BT 30 kV / 400 V',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'La dorsale aérienne 30 kV alimente l\'interrupteur d\'arrivée RMU du poste de distribution',
    notes_en: 'The 30 kV distribution line feeds the RMU switch incomer of the distribution kiosk'
  },
  {
    id: 'edge-17',
    source_id: 'eq-kiosk-30kv-400v',
    source_name: 'Poste Kiosque HTA/BT 30 kV / 400 V',
    target_id: 'eq-tgbt-main-400v',
    target_name: 'Tableau Général Basse Tension TGBT 400 V',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Le transformateur abaisse la tension à 400 V et alimente le TGBT général de l\'installation',
    notes_en: 'The transformer steps voltage down to 400 V and feeds the facility main LV switchboard'
  },
  {
    id: 'edge-18',
    source_id: 'eq-kiosk-30kv-400v',
    source_name: 'Poste Kiosque HTA/BT 30 kV / 400 V',
    target_id: 'eq-lv-abc-service-01',
    target_name: 'Faisceau Torsadé BT & Branchement CCPI',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Les départs basse tension alimentent les réseaux torsadés aériens de distribution publique',
    notes_en: 'LV distribution fuse ways feed overhead aerial bundled conductors for utility customers'
  },
  // 6. Industrial Automation, Motor Drives & Power Quality
  {
    id: 'edge-19',
    source_id: 'eq-tgbt-main-400v',
    source_name: 'Tableau Général Basse Tension TGBT 400 V',
    target_id: 'eq-vfd-inverter-drive',
    target_name: 'Variateur de Vitesse VFD 690V/400kW',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Le disjoncteur divisionnaire TGBT alimente l\'étage redresseur du variateur de vitesse',
    notes_en: 'TGBT feeder breaker powers the rectifier front-end of the variable frequency drive'
  },
  {
    id: 'edge-20',
    source_id: 'eq-plc-dcs-controller',
    source_name: 'Automate Programmable Industriel API/DCS',
    target_id: 'eq-vfd-inverter-drive',
    target_name: 'Variateur de Vitesse VFD 690V/400kW',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'controls',
    direction: 'out',
    notes_fr: 'Transmet la consigne de vitesse et l\'ordre de marche/arrêt par bus de terrain Profinet',
    notes_en: 'Transmits speed setpoint and start/stop permissive via Profinet industrial fieldbus'
  },
  {
    id: 'edge-21',
    source_id: 'eq-active-filter-apf',
    source_name: 'Filtre Actif d\'Harmoniques APF',
    target_id: 'eq-tgbt-main-400v',
    target_name: 'Tableau Général Basse Tension TGBT 400 V',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Injecte des courants harmoniques opposés pour maintenir le THDi < 3% sur le jeu de barres',
    notes_en: 'Injects counter-phase harmonic currents to keep busbar THDi below 3% IEEE 519 limit'
  },
  {
    id: 'edge-22',
    source_id: 'eq-smart-meter-ami',
    source_name: 'Compteur Communicant Intelligent AMI',
    target_id: 'eq-tgbt-main-400v',
    target_name: 'Tableau Général Basse Tension TGBT 400 V',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'measures',
    direction: 'out',
    notes_fr: 'Mesure en 4 quadrants l\'énergie active et réactive soutirée par le client industriel',
    notes_en: 'Measures four-quadrant active and reactive energy consumed by the industrial customer'
  },
  // 7. Safety, Grounding & Auxiliary Systems
  {
    id: 'edge-23',
    source_id: 'eq-earth-grid-copper',
    source_name: 'Grille de Terre Maillée en Cuivre',
    target_id: 'eq-trafo-hta-01',
    target_name: 'Transformateur HTA (225/30 kV)',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Écoule les courants de défaut et maintient la carcasse métallique du transformateur au potentiel zéro',
    notes_en: 'Discharges fault currents and clamps transformer tank potential to zero volt reference'
  },
  {
    id: 'edge-24',
    source_id: 'eq-earth-grid-copper',
    source_name: 'Grille de Terre Maillée en Cuivre',
    target_id: 'eq-surge-arrester-225k',
    target_name: 'Parafoudre ZnO 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Offre un chemin de très faible impédance pour l\'évacuation des coups de foudre vers la terre',
    notes_en: 'Provides ultra-low impedance pathway to dissipate lightning stroke currents into deep earth'
  },
  {
    id: 'edge-25',
    source_id: 'eq-fire-ssi-substation',
    source_name: 'Centrale Sécurité Incendie SSI',
    target_id: 'eq-gis-bay-225kv',
    target_name: 'Travée Blindée GIS SF6 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Surveille la salle blindée et commande l\'inondation de gaz propre Novec en cas de feu',
    notes_en: 'Monitors GIS switchgear hall and activates clean agent Novec flooding upon confirmed fire'
  },
  {
    id: 'edge-26',
    source_id: 'eq-digital-twin-server',
    source_name: 'Serveur Jumeau Numérique APM',
    target_id: 'eq-trafo-hta-01',
    target_name: 'Transformateur HTA (225/30 kV)',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'monitors',
    direction: 'out',
    notes_fr: 'Calcule l\'échauffement enroulement et analyse les gaz dissous dans l\'huile en temps réel',
    notes_en: 'Calculates real-time winding hot-spot temperature and predicts dissolved gas generation'
  },
  // 8. BESS & Renewables Integration
  {
    id: 'edge-27',
    source_id: 'eq-bess-utility-50mw',
    source_name: 'Système BESS 50 MW / 100 MWh',
    target_id: 'eq-cell-mv-30k-01',
    target_name: 'Cellule MT 30 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Injecte ou absorbe la puissance active et réactive sur le jeu de barres MT pour le réglage de fréquence',
    notes_en: 'Injects or absorbs dynamic real and reactive power at 30 kV busbar for grid frequency support'
  },
  {
    id: 'edge-28',
    source_id: 'eq-pcs-grid-forming-01',
    source_name: 'Onduleur Grid-Forming PCS BESS',
    target_id: 'eq-bess-rack-lfp',
    target_name: 'Rack Batterie LFP 1500 V DC',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'controls',
    direction: 'out',
    notes_fr: 'Gère la charge/décharge et la tension DC tout en fournissant une source de tension virtuelle synchrone',
    notes_en: 'Manages battery DC charging/discharging while synthesizing virtual synchronous grid voltage'
  },
  // 9. SCADA, Telecommunications & Dispatch Interconnections
  {
    id: 'edge-29',
    source_id: 'eq-ems-scada-dispatch',
    source_name: 'Système SCADA / EMS National',
    target_id: 'eq-rtu-gateway-104',
    target_name: 'Passerelle RTU CEI 60870-5-104',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'communicates_with',
    direction: 'out',
    notes_fr: 'Téléconduite SCADA EMS via protocole CEI 60870-5-104 sécurisé par TLS 1.3',
    notes_en: 'SCADA EMS telecontrol via IEC 60870-5-104 protocol secured by TLS 1.3'
  },
  {
    id: 'edge-30',
    source_id: 'eq-ems-scada-dispatch',
    source_name: 'Système SCADA / EMS National',
    target_id: 'eq-digital-twin-server',
    target_name: 'Serveur Jumeau Numérique APM',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'monitors',
    direction: 'out',
    notes_fr: 'Alimente l\'estimateur d\'état et le calcul d\'écoulement de charge temps réel avec les mesures télétransmises',
    notes_en: 'Feeds state estimator and real-time load flow solver with teletransmitted telemetry'
  },
  {
    id: 'edge-31',
    source_id: 'eq-opgw-fiber-sdh',
    source_name: 'Câble de Garde Fibre Optique OPGW & Multiplexeur SDH',
    target_id: 'eq-tower-225kv',
    target_name: 'Pylône Métallique HTB 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Câble de garde OPGW fixé au sommet du pylône : protège la ligne contre la foudre et héberge 48 fibres optiques',
    notes_en: 'OPGW shield wire anchored at tower apex: shields line against lightning strokes and houses 48 optical fibers'
  },
  {
    id: 'edge-32',
    source_id: 'eq-opgw-fiber-sdh',
    source_name: 'Câble de Garde Fibre Optique OPGW & Multiplexeur SDH',
    target_id: 'eq-bcu-bay-controller',
    target_name: 'Calculateur de Baie BCU CEI 61850',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'communicates_with',
    direction: 'out',
    notes_fr: 'Interconnecte les passerelles et calculateurs de tranche pour le télé-déclenchement différentiel de ligne CEI 61850',
    notes_en: 'Interconnects bay controllers and gateways for line current differential teleprotection over IEC 61850'
  },
  {
    id: 'edge-33',
    source_id: 'eq-opgw-fiber-sdh',
    source_name: 'Câble de Garde Fibre Optique OPGW & Multiplexeur SDH',
    target_id: 'eq-ems-scada-dispatch',
    target_name: 'Système SCADA / EMS National',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Dorsale de transmission haut débit SDH/MPLS reliant les postes HTB au dispatching central de Mangombé',
    notes_en: 'High-speed SDH/MPLS transmission backbone connecting HV substations to Mangombé dispatch center'
  },
  // 10. Power Quality, Metering & Harmonics Compensation
  {
    id: 'edge-34',
    source_id: 'eq-active-filter-apf',
    source_name: 'Filtre Actif d\'Harmoniques APF',
    target_id: 'eq-vfd-inverter-drive',
    target_name: 'Variateur de Vitesse VFD 690V/400kW',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Compense dynamiquement les harmoniques de rang 5, 7, 11 et 13 injectés par le pont redresseur du variateur',
    notes_en: 'Dynamically compensates 5th, 7th, 11th, and 13th harmonic currents injected by the drive rectifier bridge'
  },
  {
    id: 'edge-35',
    source_id: 'eq-active-filter-apf',
    source_name: 'Filtre Actif d\'Harmoniques APF',
    target_id: 'eq-smart-meter-ami',
    target_name: 'Compteur Communicant Intelligent AMI',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Relève le facteur de puissance au-dessus de 0.95 pour supprimer les pénalités d\'énergie réactive mesurées par l\'AMI',
    notes_en: 'Raises power factor above 0.95 eliminating reactive energy penalty charges recorded by the smart meter'
  },
  {
    id: 'edge-36',
    source_id: 'eq-smart-meter-ami',
    source_name: 'Compteur Communicant Intelligent AMI',
    target_id: 'eq-rtu-gateway-104',
    target_name: 'Passerelle RTU CEI 60870-5-104',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'communicates_with',
    direction: 'out',
    notes_fr: 'Télé-relève les courbes de charge quart-horaires et index d\'énergie vers le concentrateur de données MDM',
    notes_en: 'Transmits 15-minute load profiles and billing registers to MDM data concentrator via utility network'
  },
  // 11. Substation Grounding, Earthing & Structural Protection
  {
    id: 'edge-37',
    source_id: 'eq-earth-grid-copper',
    source_name: 'Grille de Terre Maillée en Cuivre',
    target_id: 'eq-tower-225kv',
    target_name: 'Pylône Métallique HTB 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Mise à la terre du pied de pylône garantissant une résistance R < 10 ohms pour éviter les amorçages en retour',
    notes_en: 'Tower footing grounding system ensuring resistance R < 10 ohms to prevent back-flashovers'
  },
  {
    id: 'edge-38',
    source_id: 'eq-earth-grid-copper',
    source_name: 'Grille de Terre Maillée en Cuivre',
    target_id: 'eq-cell-mv-30k-01',
    target_name: 'Cellule MT 30 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Raccordement équipotentiel des enveloppes métalliques des cellules MT pour la sécurité des exploitants',
    notes_en: 'Equipotential bonding of MV metal-clad switchgear frames for operational personnel safety'
  },
  {
    id: 'edge-39',
    source_id: 'eq-fire-ssi-substation',
    source_name: 'Centrale Sécurité Incendie SSI',
    target_id: 'eq-trafo-hta-01',
    target_name: 'Transformateur HTA (225/30 kV)',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Commande le rideau d\'eau déluge et l\'extinction automatique en cas d\'emballement thermique ou défaut diélectrique',
    notes_en: 'Commands deluge water spray curtain and automatic suppression upon thermal runaway or dielectric tank rupture'
  },
  {
    id: 'edge-40',
    source_id: 'eq-digital-twin-server',
    source_name: 'Serveur Jumeau Numérique APM',
    target_id: 'eq-cb-sf6-01',
    target_name: 'Disjoncteur SF6 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'monitors',
    direction: 'out',
    notes_fr: 'Surveillance prédictive de l\'usure des contacts d\'arc (intégrale I²t) et de la densité de gaz SF6',
    notes_en: 'Predictive health monitoring of arcing contact erosion (cumulative I²t) and SF6 gas density trend'
  },
  // 12. Generation Automation & Industrial Controls
  {
    id: 'edge-41',
    source_id: 'eq-inverter-solar-central',
    source_name: 'Onduleur Central Solaire Photovoltaïque',
    target_id: 'eq-bess-utility-50mw',
    target_name: 'Système BESS 50 MW / 100 MWh',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Liaison DC couplée ou hybride permettant le stockage du surplus de production photovoltaïque pour lisser l\'injection',
    notes_en: 'DC-coupled or hybrid link storing surplus PV generation to smooth ramp rates and firm output power'
  },
  {
    id: 'edge-42',
    source_id: 'eq-recloser-30k',
    source_name: 'Disjoncteur Réenclencheur Aérien 30 kV',
    target_id: 'eq-rtu-gateway-104',
    target_name: 'Passerelle RTU CEI 60870-5-104',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'communicates_with',
    direction: 'out',
    notes_fr: 'Télécommande d\'ouverture/fermeture et télé-signalisation d\'enclenchement de boucle d\'automatisation FLISR',
    notes_en: 'Remote open/close trip commands and status feedback enabling automated FLISR feeder loop restoration'
  },
  {
    id: 'edge-43',
    source_id: 'eq-plc-dcs-controller',
    source_name: 'Automate Programmable Industriel API/DCS',
    target_id: 'eq-hydro-songloulou-01',
    target_name: 'Alternateur Songloulou (11 kV)',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'controls',
    direction: 'out',
    notes_fr: 'Automatise les séquences de démarrage, montée en vitesse, synchronisation et réglage vitesse-puissance du groupe',
    notes_en: 'Automates start-up sequence, speed acceleration, synchronizing and speed-droop governor control'
  },
  {
    id: 'edge-44',
    source_id: 'eq-vfd-inverter-drive',
    source_name: 'Variateur de Vitesse VFD 690V/400kW',
    target_id: 'eq-hydro-songloulou-01',
    target_name: 'Alternateur Songloulou (11 kV)',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'controls',
    direction: 'out',
    notes_fr: 'Régule le débit des pompes de circulation d\'eau de réfrigération des paliers et réfrigérants d\'huile',
    notes_en: 'Modulates cooling water circulation flow rate for thrust bearing and stator oil-air heat exchangers'
  },
  {
    id: 'edge-45',
    source_id: 'eq-bcu-bay-controller',
    source_name: 'Calculateur de Baie BCU CEI 61850',
    target_id: 'eq-disconnector-225k',
    target_name: 'Sectionneur 225 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'controls',
    direction: 'out',
    notes_fr: 'Interdit l\'ouverture du sectionneur sous charge par asservissement électrique avec l\'état ouvert du disjoncteur',
    notes_en: 'Electrically interlocks disconnector operation to guarantee opening only under verified zero-current condition'
  },
  {
    id: 'edge-46',
    source_id: 'eq-trafo-hta-01',
    source_name: 'Transformateur HTA (225/30 kV)',
    target_id: 'eq-cell-mv-30k-01',
    target_name: 'Cellule MT 30 kV',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Le secondaire 30 kV du transformateur de puissance alimente le jeu de barres de la rame de cellules MT',
    notes_en: 'The 30 kV secondary winding powers the main incoming busbar of the MV metal-clad switchgear lineup'
  },
  {
    id: 'edge-47',
    source_id: 'eq-surge-arrester-225k',
    source_name: 'Parafoudre ZnO 225 kV',
    target_id: 'eq-earth-grid-copper',
    target_name: 'Grille de Terre Maillée en Cuivre',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'feeds',
    direction: 'out',
    notes_fr: 'Évacue l\'onde de surtension atmosphérique directement vers la grille de terre sans amorçage des isolateurs',
    notes_en: 'Discharges atmospheric lightning surge energy directly into earth mat avoiding insulator flashover'
  },
  {
    id: 'edge-48',
    source_id: 'eq-gis-bay-225kv',
    source_name: 'Travée Blindée GIS SF6 225 kV',
    target_id: 'eq-earth-grid-copper',
    target_name: 'Grille de Terre Maillée en Cuivre',
    source_type: 'equipment',
    target_type: 'equipment',
    relation: 'protects',
    direction: 'out',
    notes_fr: 'Mise à la terre de l\'enveloppe en aluminium sous SF6 pour canaliser les courants induits de retour',
    notes_en: 'Grounding connection of SF6 aluminum enclosure to return induced sheath and capacitive leakage currents'
  }
];

// STANDARDS REGISTRY (L01)
export const STANDARDS: Standard[] = [
  {
    id: 'std-60076',
    reference: 'IEC 60076',
    title_fr: 'Transformateurs de puissance (Parties 1 à 24)',
    title_en: 'Power transformers (Parts 1 to 24)',
    scope_fr: 'Prescriptions générales, échauffement, niveaux d\'isolement, essais diélectriques, pertes à vide/en charge et régleurs en charge (OLTC).',
    scope_en: 'General requirements, temperature rise limits, insulation levels, dielectric tests, no-load/load losses and on-load tap changers (OLTC).',
    issuer: 'IEC',
    edition: 'Edition 3.0 / Consolidated',
    status: 'active',
    jurisdiction: 'International (Adopté par SONATREL / ARSEL)',
    domain_codes: ['D04', 'D01', 'D07'],
    layer_codes: ['L01'],
    applicable_equipment: ['Transformateur HTA', 'Autotransformateur 225/90 kV', 'Transformateur GSU'],
    used_by_roles: ['Substation Engineer', 'Protection Engineer', 'Procurement Specialist'],
    associated_calculator: 'transformer',
    associated_simulation: 'transformer',
    clauses: [
      {
        clause_number: '10.2',
        title_fr: 'Mesure de la résistance des enroulements (Essai individuel)',
        title_en: 'Measurement of winding resistance (Routine test)',
        category: 'routine_test',
        requirement_fr: 'Mesure en courant continu sur chaque prise de réglage après stabilisation thermique.',
        requirement_en: 'DC resistance measurement on every tap setting following thermal stabilization.',
        acceptance_criteria: 'Écart max entre phases < 2.0% pour bobinages neufs'
      },
      {
        clause_number: '10.3',
        title_fr: 'Vérification du rapport de transformation et couplage (Essai individuel)',
        title_en: 'Measurement of voltage ratio and check of phase displacement (Routine test)',
        category: 'routine_test',
        requirement_fr: 'Vérification du rapport de spires sur chaque prise et validation du groupe vectoriel (ex: YNd11, Dyn11).',
        requirement_en: 'Turn ratio verification on all tap positions and vector group confirmation (e.g. YNd11, Dyn11).',
        acceptance_criteria: 'Tolérance rapport ≤ ±0.5% de la valeur nominale garantie'
      },
      {
        clause_number: '10.4',
        title_fr: 'Mesure de l\'impédance de court-circuit et des pertes en charge (Essai individuel)',
        title_en: 'Measurement of short-circuit impedance and load loss (Routine test)',
        category: 'routine_test',
        requirement_fr: 'Alimentation à fréquence nominale avec secondaire court-circuité au courant assigné Ir.',
        requirement_en: 'Supplied at nominal frequency with secondary short-circuited at rated current Ir.',
        acceptance_criteria: 'Tolérance Ucc ≤ ±10% pour Ucc ≥ 10%; pertes Pk ≤ +10%'
      },
      {
        clause_number: '11.1',
        title_fr: 'Essai d\'échauffement en régime continu (Essai de type)',
        title_en: 'Temperature-rise test (Type test)',
        category: 'type_test',
        requirement_fr: 'Mesure de l\'échauffement de l\'huile au sommet (top-oil) et de l\'échauffement moyen des enroulements sous pertes totales.',
        requirement_en: 'Top-oil and average winding temperature rise measurement under total losses dissipation.',
        acceptance_criteria: 'Δθ huile ≤ 60 K (ONAN/ONAF) ; point chaud hotspot ≤ 78 K'
      },
      {
        clause_number: '11.3',
        title_fr: 'Essais de tension de choc de foudre (BIL) (Essai de type / spécial)',
        title_en: 'Lightning impulse dielectric withstand test (Type/Special test)',
        category: 'type_test',
        requirement_fr: 'Application d\'une onde normalisée 1.2/50 μs (1 onde de référence 50-70% puis 3 ondes à 100% de la valeur BIL).',
        requirement_en: 'Application of standard 1.2/50 μs impulse (1 reduced reference impulse followed by 3 full BIL impulses).',
        acceptance_criteria: 'Absence d\'amorçage et concordance stricte des oscillogrammes de courant neutre'
      }
    ]
  },
  {
    id: 'std-60255',
    reference: 'IEC 60255',
    title_fr: 'Relais de mesure et dispositifs de protection électrique (Parties 1 à 187)',
    title_en: 'Measuring relays and protection equipment (Parts 1 to 187)',
    scope_fr: 'Prescriptions de produit, précision de déclenchement, tenue diélectrique, CEM et essais fonctionnels pour relais numériques IED.',
    scope_en: 'Product requirements, tripping accuracy, dielectric withstand, EMC and functional validation for digital protection IEDs.',
    issuer: 'IEC',
    edition: 'Edition 2.1',
    status: 'active',
    jurisdiction: 'International',
    domain_codes: ['D11', 'D04', 'D03'],
    layer_codes: ['L01'],
    applicable_equipment: ['Relais 87T', 'Relais de distance 21', 'Relais surintensité 50/51'],
    used_by_roles: ['Protection Engineer', 'Commissioning Engineer', 'Testing Technician'],
    associated_calculator: 'ct-sizing',
    associated_simulation: 'coordination',
    clauses: [
      {
        clause_number: '60255-1 §6.2',
        title_fr: 'Rigidité diélectrique et tension de tenue aux chocs (Essai individuel / type)',
        title_en: 'Dielectric strength and impulse voltage withstand (Routine/Type test)',
        category: 'type_test',
        requirement_fr: 'Application de 2.0 kV RMS 50 Hz pendant 60 s entre circuits indépendants et la masse châssis ; onde de choc 5 kV 1.2/50 μs.',
        requirement_en: 'Application of 2.0 kV RMS 50 Hz for 60s between galvanic isolated circuits and chassis ground; 5 kV 1.2/50 μs impulse.',
        acceptance_criteria: 'Résistance d\'isolement post-test Riso > 100 MΩ sous 500 V DC'
      },
      {
        clause_number: '60255-151 §5',
        title_fr: 'Précision de seuil et temps de fonctionnement à temps inverse (Essai fonctionnel)',
        title_en: 'Operating value accuracy and time-overcurrent characteristics (Functional test)',
        category: 'routine_test',
        requirement_fr: 'Injection de courants 1.5 Is, 2.0 Is, 5.0 Is et 10.0 Is selon courbes Normal Inverse (NI), Très Inverse (VI) et Extrêmement Inverse (EI).',
        requirement_en: 'Current injection at 1.5 Is, 2.0 Is, 5.0 Is and 10.0 Is across NI, VI and EI IEC curves.',
        acceptance_criteria: 'Erreur temporelle ≤ ±5% ou ±30 ms de la valeur théorique normalisée'
      },
      {
        clause_number: '60255-187 §4',
        title_fr: 'Retenue harmonique et stabilité en défaut externe (Essai 87T)',
        title_en: 'Harmonic restraint and stability during through-faults (87T Functional test)',
        category: 'type_test',
        requirement_fr: 'Blocage du déclenchement sur appel de courant magnétisant (inrush) par détection de taux harmonique H2 (15%) et H5 (35%).',
        requirement_en: 'Trip inhibition during transformer energization inrush via harmonic restraint H2 (15%) and H5 (35%).',
        acceptance_criteria: 'Stabilité absolue (aucun déclenchement intempestif) pour courant traversant jusqu\'à 20 × In'
      }
    ]
  },
  {
    id: 'std-61850',
    reference: 'IEC 61850',
    title_fr: 'Réseaux et systèmes de communication pour l\'automatisation des services de distribution d\'énergie',
    title_en: 'Communication networks and systems for power utility automation',
    scope_fr: 'Standard mondial pour l\'architecture des postes numériques, bus de station MMS, bus de processus SV et messages rapides GOOSE.',
    scope_en: 'Global benchmark for digital substation architectures, MMS station bus, SV process bus and high-speed GOOSE trips.',
    issuer: 'IEC',
    edition: 'Edition 2.1',
    status: 'active',
    jurisdiction: 'International',
    domain_codes: ['D13', 'D12', 'D04', 'D11'],
    layer_codes: ['L01', 'L04'],
    applicable_equipment: ['Relais numériques IED', 'Unités de fusion (Merging Units)', 'Passerelles SCADA de poste'],
    used_by_roles: ['Protection Engineer', 'OT Communications Engineer', 'SCADA Integrator'],
    associated_simulation: 'coordination',
    clauses: [
      {
        clause_number: '61850-8-1 §8',
        title_fr: 'Temps de transmission des trames GOOSE de déclenchement (Classe P1/P2)',
        title_en: 'GOOSE trip message transmission latency (Performance Class P1/P2)',
        category: 'type_test',
        requirement_fr: 'Mesure de latence bout-en-bout entre émission du trame GOOSE par relais déclencheur et réception par disjoncteur.',
        requirement_en: 'End-to-end trip latency measurement between publisher IED and subscriber bay controller.',
        acceptance_criteria: 'Latence totale ≤ 3 ms pour Classe P2 (déclenchement rapide inter-tranches)'
      },
      {
        clause_number: '61850-9-2 §6',
        title_fr: 'Transmission des valeurs échantillonnées (Sampled Values SV) sur bus de processus',
        title_en: 'Sampled Values (SV) transmission over process bus (Merging Units)',
        category: 'type_test',
        requirement_fr: 'Flux de 80 échantillons/période (4000 éch/s à 50 Hz) synchronisé via protocole IEEE 1588 PTP v2.',
        requirement_en: 'Stream of 80 samples/cycle (4000 sps at 50 Hz) synchronized with IEEE 1588 PTP v2 precision clock.',
        acceptance_criteria: 'Gigue temporelle (jitter) < 1.0 μs ; zéro perte de trame sur switch durci'
      }
    ]
  },
  {
    id: 'std-62271',
    reference: 'IEC 62271',
    title_fr: 'Appareillage à haute tension (Parties 100, 102, 200, 203)',
    title_en: 'High-voltage switchgear and controlgear (Parts 100, 102, 200, 203)',
    scope_fr: 'Spécifications et essais pour disjoncteurs HT (100), sectionneurs et mise à la terre (102), cellules MT sous enveloppe métallique (200) et postes blindés GIS SF6 (203).',
    scope_en: 'Specifications and testing for HV circuit breakers (100), disconnectors and earthing switches (102), metal-enclosed MV switchgear (200) and gas-insulated GIS (203).',
    issuer: 'IEC',
    edition: 'Edition 2.0 / Consolidated',
    status: 'active',
    jurisdiction: 'International (Standard SONATREL / Eneo)',
    domain_codes: ['D04', 'D05', 'D03'],
    layer_codes: ['L01'],
    applicable_equipment: ['Disjoncteur SF6 225 kV', 'Sectionneur 225 kV', 'Cellule MT 30 kV'],
    used_by_roles: ['Substation Design Engineer', 'High Voltage Commissioning Engineer'],
    associated_simulation: 'substation-interlocking',
    clauses: [
      {
        clause_number: '62271-102 §5.104',
        title_fr: 'Dispositifs de verrouillage et sécurité de manœuvre des sectionneurs',
        title_en: 'Interlocking devices and safety switching of disconnectors and earth switches',
        category: 'safety_rule',
        requirement_fr: 'Verrouillage électromécanique interdisant toute ouverture de sectionneur sous charge sans chemin de dérivation fermé, et interdisant la fermeture d\'un sectionneur de terre sur un circuit sous tension.',
        requirement_en: 'Electromechanical interlocking preventing any disconnector operation under load without an alternate bypass path, and preventing earth switch closing onto an energized circuit.',
        acceptance_criteria: 'Conformité totale aux logiques d\'interverrouillage (interlocking) matérielles et logiques CEI 61850 GOOSE'
      },
      {
        clause_number: '62271-100 §6.4',
        title_fr: 'Mesure de la résistance du circuit principal (Micro-ohmmètre)',
        title_en: 'Measurement of the resistance of the main circuit (Routine test)',
        category: 'routine_test',
        requirement_fr: 'Injection continue de 100 A DC minimum aux bornes des pôles fermés pour contrôler la qualité des contacts d\'arc.',
        requirement_en: 'Injection of minimum 100 A DC across closed pole terminals to verify arcing contact integrity.',
        acceptance_criteria: 'Résistance de contact Rc ≤ 50 μΩ par pôle HTB (225 kV)'
      },
      {
        clause_number: '62271-100 §6.101',
        title_fr: 'Pouvoir de coupure et de fermeture en court-circuit (Essai de type T100s)',
        title_en: 'Short-circuit making and breaking test duty cycle (Type test)',
        category: 'type_test',
        requirement_fr: 'Séquence normalisée O - 0.3 s - CO - 3 min - CO au courant de coupure assigné Isc (ex: 40 kA).',
        requirement_en: 'Standard duty cycle O - 0.3s - CO - 3min - CO at rated short-circuit breaking current Isc (e.g. 40 kA).',
        acceptance_criteria: 'Coupure sans réamorçage diélectrique, surpression SF6 contenue dans les limites assignées'
      },
      {
        clause_number: '62271-1 §6.2',
        title_fr: 'Contrôle de l\'étanchéité au gaz SF6 (Essai individuel)',
        title_en: 'Gas tightness verification and SF6 leak rate (Routine test)',
        category: 'routine_test',
        requirement_fr: 'Mesure du taux de fuite par renifleur infrarouge ou cloche d\'accumulation à pression assignée de remplissage.',
        requirement_en: 'Leak rate measurement using infrared sniffer or accumulation chamber at rated filling density.',
        acceptance_criteria: 'Taux de fuite relatif annuel F ≤ 0.5% par an'
      }
    ]
  },
  {
    id: 'std-ieee-80',
    reference: 'IEEE 80',
    title_fr: 'Guide pour la sécurité des prises de terre dans les postes alternatifs',
    title_en: 'IEEE Guide for Safety in AC Substation Grounding',
    scope_fr: 'Calcul mathématique des résistances de terre, tensions limites de pas et de toucher tolérables par le corps humain et dimensionnement des conducteurs de grille.',
    scope_en: 'Mathematical framework for substation grid resistance, tolerable body touch and step voltage criteria, and grounding conductor sizing.',
    issuer: 'IEEE',
    edition: 'IEEE Std 80-2013',
    status: 'active',
    jurisdiction: 'International / Standard mondial de conception de poste',
    domain_codes: ['D16', 'D04'],
    layer_codes: ['L01'],
    applicable_equipment: ['Grille de terre de poste', 'Piquets de terre', 'Résistance de neutre 30 kV'],
    used_by_roles: ['Substation Design Engineer', 'Electrical Safety Engineer'],
    associated_calculator: 'earthing',
    clauses: [
      {
        clause_number: 'Section 8',
        title_fr: 'Critère de tension de toucher tolérable (Corps humain 50 kg ou 70 kg)',
        title_en: 'Tolerable touch voltage threshold (50 kg or 70 kg body model)',
        category: 'safety_rule',
        requirement_fr: 'Calcul de Etouch = (1000 + 1.5 × Cs × ρs) × (0.116 / √ts) pour éviter la fibrillation ventriculaire.',
        requirement_en: 'Calculation of Etouch = (1000 + 1.5 × Cs × ρs) × (0.116 / √ts) to prevent ventricular fibrillation.',
        acceptance_criteria: 'Tension de maille maximale calculée Em ≤ Etouch tolérable sur l\'ensemble de l\'emprise'
      },
      {
        clause_number: 'Section 11',
        title_fr: 'Section minimale des conducteurs de la grille en cuivre (Tenue thermique)',
        title_en: 'Minimum grounding conductor cross-section (Thermal fusing limit)',
        category: 'design_rule',
        requirement_fr: 'Dimensionnement selon formule d\'Onderdonk : Akcmil = I × Kf × √ts avec Kf pour cuivre recuit (7.01).',
        requirement_en: 'Conductor sizing via Onderdonk formula for fault clearing time ts and peak asymmetrical ground fault current.',
        acceptance_criteria: 'Température du conducteur < 1083°C (fusion du cuivre) et < 250°C pour connecteurs brasés'
      }
    ]
  },
  {
    id: 'std-ieee-1584',
    reference: 'IEEE 1584 / NFPA 70E',
    title_fr: 'Calcul du Risque d\'Arc Électrique & Sécurité du Personnel (Arc Flash Hazard)',
    title_en: 'Guide for Performing Arc-Flash Hazard Calculations & Workplace Electrical Safety',
    scope_fr: 'Méthodologie empirique de calcul de l\'énergie incidente (cal/cm²), de la frontière de protection d\'arc (AFB) et sélection des EPI selon NFPA 70E Catégories 1 à 4.',
    scope_en: 'Empirical calculation of incident energy (cal/cm²), arc flash boundary (AFB) and PPE category selection per NFPA 70E.',
    issuer: 'IEEE / NFPA',
    edition: 'IEEE Std 1584-2018 / NFPA 70E-2024',
    status: 'active',
    jurisdiction: 'International / Standard de référence en sécurité HT/BT',
    domain_codes: ['D16', 'D06', 'D04'],
    layer_codes: ['L01'],
    applicable_equipment: ['Tableaux TGBT 400 V', 'Cellules MT 30 kV', 'Disjoncteurs de puissance'],
    used_by_roles: ['Electrical Safety Engineer', 'Substation Maintenance Lead', 'Field Electrician'],
    associated_calculator: 'arc-flash',
    clauses: [
      {
        clause_number: 'IEEE 1584 §4.3',
        title_fr: 'Configuration des électrodes et boîte d\'enveloppe (VCB, VCBB, HCB)',
        title_en: 'Electrode configuration and enclosure dimensions (VCB, VCBB, HCB)',
        category: 'safety_rule',
        requirement_fr: 'Identification précise de l\'orientation des barres (verticales dans boîte VCB, horizontales HCB) et espacement inter-phases.',
        requirement_en: 'Classification of bar orientation (vertical in box VCB, horizontal HCB) and phase conductor spacing.',
        acceptance_criteria: 'Énergie incidente calculée à la distance de travail (ex: 457 mm ou 610 mm)'
      },
      {
        clause_number: 'NFPA 70E Table 130.5',
        title_fr: 'Détermination de la Frontière d\'Arc (Arc Flash Boundary AFB)',
        title_en: 'Arc Flash Boundary (AFB) Determination (1.2 cal/cm² threshold)',
        category: 'safety_rule',
        requirement_fr: 'Distance minimale à laquelle l\'énergie incidente sans EPI atteint 1.2 cal/cm² (seuil de brûlure au 2e degré réversible).',
        requirement_en: 'Radial perimeter where incident energy drops to 1.2 cal/cm² (onset of second-degree skin burn).',
        acceptance_criteria: 'Affichage obligatoire du périmètre AFB et de la catégorie d\'EPI sur plastron d\'armoire'
      }
    ]
  },
  {
    id: 'std-60909',
    reference: 'IEC 60909',
    title_fr: 'Calcul des courants de court-circuit dans les réseaux triphasés à courant alternatif',
    title_en: 'Short-circuit currents in three-phase a.c. systems - Calculation of currents',
    scope_fr: 'Méthode rigoureuse des composantes symétriques pour le calcul des courants de court-circuit symétrique initial Ik", crête Ip et thermique Ith.',
    scope_en: 'Rigorous symmetrical components calculation methodology for initial symmetrical Ik", peak Ip and breaking currents.',
    issuer: 'IEC',
    edition: 'Edition 2.0',
    status: 'active',
    jurisdiction: 'International (Référence obligatoire études de réseau)',
    domain_codes: ['D02', 'D03', 'D04', 'D11'],
    layer_codes: ['L01'],
    applicable_equipment: ['Disjoncteurs HT', 'Jeu de barres', 'Transformateurs de puissance'],
    used_by_roles: ['Power Systems Planner', 'Protection Engineer', 'Consulting Engineer'],
    associated_simulation: 'short-circuit',
    clauses: [
      {
        clause_number: 'IEC 60909-0 §2.3',
        title_fr: 'Facteur de tension c et source équivalente de tension au point de défaut',
        title_en: 'Voltage factor c and equivalent voltage source at fault point',
        category: 'design_rule',
        requirement_fr: 'Application du facteur cmax = 1.10 (réseaux HT > 1 kV) pour dimensionnement des pouvoirs de coupure ; cmin = 1.00 pour réglage relais.',
        requirement_en: 'Application of cmax = 1.10 (HV grids > 1 kV) for breaking capacity checks; cmin = 1.00 for relay reach limits.',
        acceptance_criteria: 'Calcul direct Ik" = (c × Un) / (√3 × |Zk|)'
      },
      {
        clause_number: 'IEC 60909-0 §4.3',
        title_fr: 'Courant de court-circuit de crête Ip (Facteur d\'asymétrie κ)',
        title_en: 'Peak short-circuit current Ip (Asymmetry factor κ from R/X ratio)',
        category: 'design_rule',
        requirement_fr: 'Calcul de Ip = κ × √2 × Ik" où le coefficient d\'asymétrie κ dépend du rapport R/X de la maille amont.',
        requirement_en: 'Calculation of Ip = κ × √2 × Ik" where asymmetry factor κ depends on upstream circuit R/X ratio.',
        acceptance_criteria: 'Pouvoir de fermeture assigné du disjoncteur Icm ≥ Ip crête'
      }
    ]
  },
  {
    id: 'std-nfc15100',
    reference: 'NF C 15-100 / IEC 60364',
    title_fr: 'Installations électriques à basse tension (Règles & Dimensionnement)',
    title_en: 'Low-voltage electrical installations (Design, Sizing & Protection)',
    scope_fr: 'Règles de conception des réseaux BT (< 1000 V AC), schémas de liaison à la terre TT/TN/IT, dimensionnement des câbles et chutes de tension.',
    scope_en: 'Design, execution and inspection rules for LV installations (< 1000 V AC), earthing arrangements and circuit sizing.',
    issuer: 'AFNOR / IEC',
    edition: 'Version consolidée / IEC 60364 Parts 1-8',
    status: 'active',
    jurisdiction: 'France / Cameroun & Afrique Francophone',
    domain_codes: ['D06', 'D16'],
    layer_codes: ['L01'],
    applicable_equipment: ['Disjoncteurs BT', 'Tableaux TGBT', 'Prises de terre', 'Parafoudres BT'],
    used_by_roles: ['Electrical Building Engineer', 'Field Electrician', 'Bureau de Contrôle (APAVE/Veritas)'],
    associated_calculator: 'voltage-drop',
    clauses: [
      {
        clause_number: 'Part 5-52 §525',
        title_fr: 'Limites de chute de tension admissible (Éclairage vs Autres usages)',
        title_en: 'Permissible voltage drop limits (Lighting vs Power loads)',
        category: 'design_rule',
        requirement_fr: 'Chute de tension maximale mesurée entre le point d\'origine de l\'installation BT et les bornes réceptrices les plus éloignées.',
        requirement_en: 'Maximum permissible voltage drop from installation origin to furthest terminal utilization device.',
        acceptance_criteria: 'ΔU ≤ 3% pour circuits d\'éclairage ; ΔU ≤ 5% pour force motrice et autres usages'
      },
      {
        clause_number: 'Part 4-41 §411.3',
        title_fr: 'Temps de coupure maximal pour la protection contre les chocs (Schémas TN et TT)',
        title_en: 'Maximum disconnection times for shock protection (TN and TT systems)',
        category: 'safety_rule',
        requirement_fr: 'Coupure automatique par disjoncteur ou différentiel en cas de contact indirect phase-masse sous 230 V nominal.',
        requirement_en: 'Automatic disconnection by breaker or RCD during phase-to-casing fault under nominal 230 V.',
        acceptance_criteria: 't ≤ 0.4 s en schéma TN ; t ≤ 0.2 s en schéma TT (pour circuits terminaux ≤ 32 A)'
      }
    ]
  },
  {
    id: 'std-60831',
    reference: 'IEC 60831',
    title_fr: 'Condensateurs shunt de puissance pour réseaux à courant alternatif (PFC)',
    title_en: 'Shunt power capacitors of the self-healing type for a.c. power systems',
    scope_fr: 'Prescriptions d\'assurance qualité, surcharges thermiques, autoguérison, réactances de désaccord anti-harmoniques et décharge automatique.',
    scope_en: 'Quality assurance, thermal overload withstand, self-healing capability, detuned reactors and discharge resistor timing.',
    issuer: 'IEC',
    edition: 'Edition 3.0',
    status: 'active',
    jurisdiction: 'International (Compensation d\'énergie réactive)',
    domain_codes: ['D14', 'D06', 'D04'],
    layer_codes: ['L01'],
    applicable_equipment: ['Batterie de condensateurs BT', 'Selfs anti-harmoniques', 'Régulateur varmétrique'],
    used_by_roles: ['Power Quality Engineer', 'Industrial Electrical Engineer'],
    associated_calculator: 'pfc',
    associated_simulation: 'power-triangle',
    clauses: [
      {
        clause_number: 'IEC 60831-1 §13',
        title_fr: 'Dispositif interne de décharge résiduelle automatique',
        title_en: 'Residual internal discharge device safety timing',
        category: 'safety_rule',
        requirement_fr: 'Chaque condensateur doit être équipé d\'une résistance de décharge pour ramener la tension résiduelle aux bornes à un niveau sûr.',
        requirement_en: 'Capacitor must incorporate internal discharge resistors to rapidly dissipate stored electrostatic charge.',
        acceptance_criteria: 'Tension aux bornes U ≤ 75 V dans les 3 minutes suivant la déconnexion du réseau'
      },
      {
        clause_number: 'IEC 60831-1 §20',
        title_fr: 'Surcharge continue admissible en courant et en tension (Harmoniques)',
        title_en: 'Continuous overload current and voltage capability (Harmonic heating)',
        category: 'type_test',
        requirement_fr: 'Tenue thermique permanente sous courant harmonique et tension élevée.',
        requirement_en: 'Continuous thermal withstand under harmonic currents and elevated busbar voltage.',
        acceptance_criteria: 'Fonctionnement permanent jusqu\'à 1.30 × Inominal et 1.10 × Unominal'
      }
    ]
  },
  {
    id: 'std-60071',
    reference: 'IEC 60071',
    title_fr: 'Coordination de l\'isolement & Surtensions temporaires (Effet Ferranti)',
    title_en: 'Insulation co-ordination - Principles, rules and application guide',
    scope_fr: 'Coordination entre les contraintes diélectriques de surtension (foudre, manœuvre, Ferranti) et les caractéristiques des parafoudres ZnO.',
    scope_en: 'Co-ordination between dielectric overvoltage stresses (lightning, switching, Ferranti) and ZnO surge arrester protective margins.',
    issuer: 'IEC',
    edition: 'Edition 5.0',
    status: 'active',
    jurisdiction: 'International (Réseaux de transport HTB SONATREL)',
    domain_codes: ['D03', 'D04', 'D16'],
    layer_codes: ['L01'],
    applicable_equipment: ['Parafoudre ZnO 225 kV', 'Isolateurs HTB', 'Lignes aériennes de transport'],
    used_by_roles: ['Transmission Line Engineer', 'Substation Design Engineer'],
    associated_simulation: 'ferranti',
    clauses: [
      {
        clause_number: 'IEC 60071-1 §5',
        title_fr: 'Surtensions temporaires à fréquence industrielle (Effet Ferranti & délestage)',
        title_en: 'Temporary overvoltages (TOV) at power frequency (Ferranti rise & load rejection)',
        category: 'design_rule',
        requirement_fr: 'Évaluation de la montée en tension en bout de ligne HTB à vide : U2 / U1 ≈ 1 / cos(β × l).',
        requirement_en: 'Evaluation of no-load receiving-end voltage rise on long HV transmission corridors.',
        acceptance_criteria: 'Surtension permanente U2 ≤ 1.15 × Un (ou nécessité d\'installer des réactances shunt d\'absorption)'
      }
    ]
  },
  {
    id: 'std-62548',
    reference: 'IEC 62548 / IEC 61215',
    title_fr: 'Conception & Sécurité des Générateurs Photovoltaïques (PV Arrays)',
    title_en: 'Design requirements for photovoltaic (PV) arrays & module qualification',
    scope_fr: 'Dimensionnement des chaînes de modules PV, tension maximale à vide corrigée en température, boîtes de jonction et coordination onduleurs.',
    scope_en: 'PV string sizing, open-circuit voltage temperature corrections, combiner box protection and inverter coordination.',
    issuer: 'IEC',
    edition: 'Edition 2.0',
    status: 'active',
    jurisdiction: 'International (Centrales solaires au sol & toiture)',
    domain_codes: ['D09', 'D08', 'D05'],
    layer_codes: ['L01'],
    applicable_equipment: ['Modules solaires PV', 'Boîtes de jonction DC', 'Onduleur centralisé / string'],
    used_by_roles: ['Solar PV Systems Engineer', 'Commissioning Engineer'],
    associated_calculator: 'solar',
    clauses: [
      {
        clause_number: 'IEC 62548 §6.3',
        title_fr: 'Tension maximale absolue du champ PV en température minimale',
        title_en: 'Maximum array open-circuit voltage at lowest site record temperature',
        category: 'design_rule',
        requirement_fr: 'Calcul de Voc_max = N_modules × Voc_stc × [1 + β_voc × (Tmin - 25°C)].',
        requirement_en: 'Calculation of maximum string Voc at lowest ambient site record temperature.',
        acceptance_criteria: 'Voc_max < 1500 V DC (ou 1000 V selon classe d\'isolation des câbles et de l\'onduleur)'
      }
    ]
  },
  {
    id: 'std-62933',
    reference: 'IEC 62933',
    title_fr: 'Systèmes de Stockage d\'Énergie Électrique par Batterie (BESS Grid Safety)',
    title_en: 'Electrical energy storage (EES) systems - Safety & grid integration',
    scope_fr: 'Spécifications de sécurité, dimensionnement énergétique, cycles de charge/décharge, emballement thermique et réglage fréquence/tension.',
    scope_en: 'Safety specifications, energy capacity sizing, lifecycle degradation, thermal runaway mitigation and grid services.',
    issuer: 'IEC',
    edition: 'Edition 2.0',
    status: 'active',
    jurisdiction: 'International (Réseaux à haute pénétration ENR)',
    domain_codes: ['D10', 'D08', 'D02'],
    layer_codes: ['L01'],
    applicable_equipment: ['Conteneur BESS LFP', 'Système de conversion PCS', 'Système EMS BESS'],
    used_by_roles: ['Storage Systems Engineer', 'Grid Integration Specialist'],
    associated_calculator: 'bess',
    clauses: [
      {
        clause_number: 'IEC 62933-5-2 §7',
        title_fr: 'Système d\'extinction et barrière de propagation thermique (NFPA 855)',
        title_en: 'Thermal runaway propagation barrier and active fire suppression',
        category: 'safety_rule',
        requirement_fr: 'Confinement des cellules LFP avec barrières isolantes ignifuges et ventilation d\'urgence des gaz inflammables (H2/CO).',
        requirement_en: 'Module-to-module thermal insulation barrier and active explosive gas purge system.',
        acceptance_criteria: 'Zéro propagation thermique entre racks voisins lors d\'un emballement unitaire'
      }
    ]
  },
  {
    id: 'std-ieee-399',
    reference: 'IEEE 399 / IEC 60034',
    title_fr: 'Démarrage Moteur & Analyse Dynamique Industrielle (Brown Book)',
    title_en: 'Recommended Practice for Industrial Power Systems Analysis - Motor Starting',
    scope_fr: 'Modélisation du courant d\'appel de démarrage des moteurs asynchrones, creux de tension transitoire aux barres et temps d\'accélération.',
    scope_en: 'Transient induction motor starting dynamics, busbar voltage sag evaluation, acceleration times and rotor thermal damage curves.',
    issuer: 'IEEE / IEC',
    edition: 'IEEE Std 399-1997 / IEC 60034-12',
    status: 'active',
    jurisdiction: 'International (Usines & Sites Industriels)',
    domain_codes: ['D07', 'D06', 'D04'],
    layer_codes: ['L01'],
    applicable_equipment: ['Moteur asynchrone HT/BT', 'Démarreur progressif', 'Variateur VFD'],
    used_by_roles: ['Industrial Electrical Engineer', 'Plant Operations Specialist'],
    associated_calculator: 'motor',
    associated_simulation: 'motor-start',
    clauses: [
      {
        clause_number: 'IEEE 399 Chapter 9',
        title_fr: 'Creux de tension transitoire admissible au démarrage direct (DOL)',
        title_en: 'Permissible bus voltage sag during direct-on-line (DOL) starting',
        category: 'design_rule',
        requirement_fr: 'Vérification que la chute de tension au jeu de barres amont ne provoque pas le décollage des contacteurs auxiliaires.',
        requirement_en: 'Verification that transient busbar sag during motor locked-rotor inrush does not drop out holding contactors.',
        acceptance_criteria: 'Tension résiduelle au jeu de barres V_bus ≥ 85% Un (ou imposition d\'un démarreur progressif / VFD)'
      }
    ]
  },
  {
    id: 'std-arsel-grid-code',
    reference: 'ARSEL Code Réseau',
    title_fr: 'Règles Techniques et Code de Raccordement au Réseau National (RIS / RIN)',
    title_en: 'Cameroon National Grid Code & Technical Connection Rules (RIS / RIN)',
    scope_fr: 'Exigences techniques obligatoires de tension, fréquence (49.5 - 50.5 Hz), participation au réglage primaire P/f, facteur de puissance et plan de délestage au Cameroun.',
    scope_en: 'Mandatory technical requirements for voltage, frequency operating limits (49.5 - 50.5 Hz), primary frequency response, power factor and emergency load shedding in Cameroon.',
    issuer: 'ARSEL',
    edition: 'Arrêté Ministériel / Réglementation ARSEL',
    status: 'active',
    jurisdiction: 'République du Cameroun (SONATREL, Eneo, Producteurs IPP)',
    domain_codes: ['D02', 'D01', 'D03', 'D05'],
    layer_codes: ['L01', 'L06'],
    applicable_equipment: ['Alternateur Songloulou', 'Poste Ahala 225/30 kV', 'Centrale Maroua'],
    used_by_roles: ['Grid Planning Engineer', 'Dispatching Operator (SONATREL NDC)'],
    associated_simulation: 'transient-stability',
    clauses: [
      {
        clause_number: 'Article 14',
        title_fr: 'Plage de fréquence normale et réserve de réglage primaire P/f',
        title_en: 'Normal frequency band and primary governor spinning reserve',
        category: 'design_rule',
        requirement_fr: 'Toute tranche de production > 10 MW doit participer au réglage primaire avec un statisme de 4% à 5%.',
        requirement_en: 'All generating units > 10 MW must contribute to primary frequency droop response (4% to 5% droop).',
        acceptance_criteria: 'Fréquence normale stabilisée entre 49.50 Hz et 50.50 Hz'
      },
      {
        clause_number: 'Article 22',
        title_fr: 'Plan de délestage automatique par relais à manque de fréquence (UFLS)',
        title_en: 'Under-frequency load shedding (UFLS) staged execution matrix',
        category: 'safety_rule',
        requirement_fr: 'Déclenchement automatique échelonné de départs MT pour enrayer un effondrement généralisé de fréquence.',
        requirement_en: 'Staged automatic disconnection of distribution feeders to prevent blackout during severe loss-of-generation.',
        acceptance_criteria: 'Échelon 1 : 49.0 Hz (10% délesté) ; Échelon 2 : 48.6 Hz (15%) ; Échelon 3 : 48.2 Hz (15%)'
      }
    ]
  },
  {
    id: 'std-iec-60099-4',
    reference: 'CEI 60099-4 / CEI 60071-1',
    title_fr: 'Parafoudres à Oxyde Métallique (ZnO) sans Éclateurs & Coordination de l\'Isolement',
    title_en: 'Metal-Oxide Surge Arresters without Gaps (ZnO) & Insulation Coordination',
    scope_fr: 'Spécifications de dimensionnement des parafoudres ZnO (tension continue Uc, tension assignée Ur, tenue thermique aux surtensions TOV), marges de coordination diélectrique foudre/manœuvre (≥20% / ≥15%) et distance séparative maximale admissible Lmax.',
    scope_en: 'Specification and sizing requirements for metal-oxide surge arresters (continuous voltage Uc, rated Ur, TOV capability), insulation coordination safety margins (≥20% / ≥15%) and maximum permissible separation distance Lmax.',
    issuer: 'CEI (Comité Électrotechnique International)',
    edition: 'CEI 60099-4 Ed 3.0 / CEI 60071-1:2019',
    status: 'active',
    jurisdiction: 'International & Prescriptions SONATREL / Eneo (Postes HTB/HTA)',
    domain_codes: ['D03', 'D02', 'D04', 'D16'],
    layer_codes: ['L01'],
    applicable_equipment: ['Parafoudre poste 225 kV', 'Traversées transformateur HTB/HTA', 'Jeu de barres poste'],
    used_by_roles: ['High Voltage Substation Engineer', 'Insulation Coordination Specialist'],
    associated_calculator: 'surge-arrester',
    clauses: [
      {
        clause_number: 'CEI 60071-1 §5.2',
        title_fr: 'Marge minimale de coordination au choc de foudre (MPL)',
        title_en: 'Minimum lightning impulse protective margin (MPL)',
        category: 'design_rule',
        requirement_fr: 'La marge entre le niveau d\'isolement assigné au choc de foudre (BIL) du transformateur et la tension résiduelle du parafoudre Upl doit être au moins de 20%.',
        requirement_en: 'The protective margin between transformer rated lightning impulse withstand (BIL) and arrester residual voltage Upl must be at least 20%.',
        acceptance_criteria: 'MPL = ((BIL - Upl) / Upl) * 100% ≥ 20%'
      },
      {
        clause_number: 'CEI 60099-4 §8.3 & CEI 60071-2',
        title_fr: 'Distance séparative maximale et réflexion d\'onde progressive',
        title_en: 'Maximum permissible separation distance and traveling wave reflection',
        category: 'safety_rule',
        requirement_fr: 'Pour empêcher le claquage diélectrique par doublement de l\'onde de foudre réfléchie aux bornes du transformateur, la distance physique L entre le parafoudre et les traversées ne doit jamais dépasser Lmax.',
        requirement_en: 'To prevent dielectric breakdown from traveling wave voltage reflection doubling at transformer terminals, separation distance L must not exceed critical Lmax.',
        acceptance_criteria: 'L ≤ (v / (2 · S)) · (BIL / 1.15 - Upl) (avec v=300 m/µs et S raideur de front)'
      }
    ]
  },
  {
    id: 'std-iec-60865',
    reference: 'CEI 60865-1',
    title_fr: 'Courants de court-circuit - Calcul des effets mécaniques et thermiques (Jeux de barres)',
    title_en: 'Short-circuit currents - Calculation of mechanical and thermal effects (Busbars)',
    scope_fr: 'Calcul normalisé des forces électrodynamiques de crête entre phases (Fd), contraintes de flexion statiques et dynamiques sur barres rigides rectangulaires (σtot), fréquences de résonance mécanique et résistance à la rupture des isolateurs supports.',
    scope_en: 'Standardized calculation of peak electrodynamic phase-to-phase forces (Fd), static and dynamic bending stresses on rigid rectangular busbars (σtot), natural resonant frequencies and post insulator cantilever strength.',
    issuer: 'CEI (Comité Électrotechnique International)',
    edition: 'CEI 60865-1:2015 Edition 3.0',
    status: 'active',
    jurisdiction: 'International & Postes SONATREL / Eneo',
    domain_codes: ['D04', 'D05', 'D06', 'D16'],
    layer_codes: ['L01'],
    applicable_equipment: ['Jeu de barres HTA/BT', 'Cellules AIS', 'TGBT Usine', 'Isolateurs supports'],
    used_by_roles: ['Substation Engineer', 'Switchgear Design Engineer', 'Mechanical & Electrical Inspector'],
    associated_calculator: 'busbar-electrodynamic',
    clauses: [
      {
        clause_number: 'CEI 60865-1 §5.2',
        title_fr: 'Force électrodynamique maximale entre conducteurs principaux parallèles (Fm)',
        title_en: 'Peak electrodynamic force between parallel main conductors (Fm)',
        category: 'design_rule',
        requirement_fr: 'Calcul de la force de répulsion de crête Fm sous courant de court-circuit triphasé asymétrique Ip.',
        requirement_en: 'Calculation of peak repulsion force Fm under asymmetrical three-phase peak short-circuit current Ip.',
        acceptance_criteria: 'Fm = (μ0 / 2π) · (√3 / 2) · Ip² · (l / a)'
      },
      {
        clause_number: 'CEI 60865-1 §5.3',
        title_fr: 'Contrainte de flexion admissible sur barres rigides (σtot ≤ q · Rp0.2)',
        title_en: 'Allowable bending stress on rigid conductors (σtot ≤ q · Rp0.2)',
        category: 'safety_rule',
        requirement_fr: 'La contrainte totale de flexion résultante ne doit jamais dépasser la limite d\'élasticité garantie du conducteur multipliée par le facteur de plasticité q.',
        requirement_en: 'Resultant bending stress must not exceed guaranteed 0.2% proof stress multiplied by plasticity factor q.',
        acceptance_criteria: 'σtot = VF · (Fm · l) / (16 · W) ≤ 1.5 · Rp0.2'
      }
    ]
  },
  {
    id: 'std-iec-60287',
    reference: 'CEI 60287 / CEI 60949',
    title_fr: 'Câbles électriques - Courant admissible permanent & Tenue thermique au court-circuit',
    title_en: 'Electric cables - Continuous current rating & Thermal short-circuit withstand',
    scope_fr: 'Calcul précis de la capacité d\'intensité de courant admissible en régime permanent (100% facteur de charge), facteurs correctifs environnementaux (k1...kh selon CEI 60364-5-52) et section minimale adiabatique pour la tenue aux courants de court-circuit.',
    scope_en: 'Continuous ampacity rating calculation, environmental installation derating factors (IEC 60364-5-52), and adiabatic minimum cross-section for short-circuit thermal withstand.',
    issuer: 'CEI (Comité Électrotechnique International)',
    edition: 'CEI 60287-1-1 / CEI 60949 Consolidated',
    status: 'active',
    jurisdiction: 'International & Câblage Distribution MT/BT',
    domain_codes: ['D03', 'D05', 'D06', 'D16'],
    layer_codes: ['L01'],
    applicable_equipment: ['Câbles HTA 30 kV', 'Câbles BT Cuivre/Alu', 'Chemins de câbles', 'Fourreaux enterrés'],
    used_by_roles: ['Cable Systems Engineer', 'Distribution Planning Engineer', 'Site Electrical Supervisor'],
    associated_calculator: 'cable-ampacity',
    clauses: [
      {
        clause_number: 'CEI 60364-5-52 §523',
        title_fr: 'Règle de coordination des courants Iz ≥ Ib',
        title_en: 'Current coordination rule Iz ≥ Ib',
        category: 'safety_rule',
        requirement_fr: 'Le courant admissible déclassé Iz de la canalisation doit être supérieur ou égal au courant d\'emploi de calcul Ib.',
        requirement_en: 'Corrected continuous cable ampacity Iz must be greater than or equal to design load current Ib.',
        acceptance_criteria: 'Iz = I0 · (k1 · k2 · k3 · k4 · kh) ≥ Ib'
      },
      {
        clause_number: 'CEI 60949 §3',
        title_fr: 'Tenue thermique adiabatique sous court-circuit (k²·S² ≥ Isc²·tk)',
        title_en: 'Adiabatic short-circuit thermal withstand (k²·S² ≥ Isc²·tk)',
        category: 'safety_rule',
        requirement_fr: 'L\'énergie spécifique admissible par l\'âme conductrice k²·S² doit être supérieure à l\'énergie thermique de défaut Isc²·tk.',
        requirement_en: 'Cable permissible specific energy k²·S² must exceed let-through fault energy Isc²·tk.',
        acceptance_criteria: 'S_min ≥ (Isc · √tk) / k (k=143 Cu/XLPE, k=94 Al/XLPE)'
      }
    ]
  },
  {
    id: 'std-ieee-c37102',
    reference: 'IEEE C37.102 / CEI 60255-127',
    title_fr: 'Protection des alternateurs et couplage au réseau synchrone (ANSI 25 / 40 / 87G)',
    title_en: 'Guide for AC Generator Protection & Synchronizing Check (ANSI 25 / 40 / 87G)',
    scope_fr: 'Prescriptions d\'automatisation du couplage synchrone (critères de tension ΔU ≤ 4%, glissement de fréquence Δf ≤ 0.10 Hz, angle de phase Δδ ≤ 10° et avance mécanique disjoncteur), cartographie de capabilité P-Q et protection contre la perte d\'excitation.',
    scope_en: 'Synchronizing criteria automation guidelines (voltage ΔU ≤ 4%, slip frequency Δf ≤ 0.10 Hz, phase angle Δδ ≤ 10° and breaker closing advance), P-Q capability margins, and loss-of-field protection.',
    issuer: 'IEEE Power & Energy Society / CEI',
    edition: 'IEEE Std C37.102-2006 / IEC 60255-127:2019',
    status: 'active',
    jurisdiction: 'International & Centrales Hydro/Gaz ARSEL / Eneo',
    domain_codes: ['D01', 'D02', 'D11', 'D04'],
    layer_codes: ['L01'],
    applicable_equipment: ['Alternateur Nachtigal', 'Relais synchrocheck ANSI 25', 'Disjoncteur générateur GCB', 'Régulateur de vitesse / AVR'],
    used_by_roles: ['Power Plant Protection Engineer', 'Generation Operations Engineer', 'Commissioning Specialist'],
    associated_simulation: 'synchrocheck',
    clauses: [
      {
        clause_number: 'IEEE C37.102 §5.1',
        title_fr: 'Critères d\'autorisation de fermeture disjoncteur ANSI 25',
        title_en: 'ANSI 25 Breaker closing permissive criteria',
        category: 'design_rule',
        requirement_fr: 'Ordre de fermeture sécurisé émis uniquement lorsque l\'écart de tension |ΔU| ≤ 5%, l\'écart de fréquence |Δf| ≤ 0.1 Hz et l\'angle de phase |Δδ| ≤ 10° sont simultanément satisfaits.',
        requirement_en: 'Breaker close command permitted only when voltage difference |ΔU| ≤ 5%, slip frequency |Δf| ≤ 0.1 Hz and phase angle |Δδ| ≤ 10° are met concurrently.',
        acceptance_criteria: '|ΔU| ≤ 5%, |Δf| ≤ 0.10 Hz, |Δδ| ≤ 10° et compensation temps mécanique t_close'
      },
      {
        clause_number: 'IEEE C37.102 §4.2',
        title_fr: 'Protection contre la perte d\'excitation (ANSI 40 - Décalage mho)',
        title_en: 'Loss-of-field protection (ANSI 40 - Offset mho relaying)',
        category: 'safety_rule',
        requirement_fr: 'Détection rapide de la chute de flux inducteur pour empêcher la transition en génératrice asynchrone et l\'échauffement destructeur du rotor.',
        requirement_en: 'Fast detection of field excitation failure to avoid asynchronous generator mode and severe rotor heating.',
        acceptance_criteria: 'Cercle de déclenchement mho centré sur -(Xd\' + Xd)/2 avec temps de retard t = 0.2 à 0.5 s'
      }
    ]
  },
  {
    id: 'std-iec-61131',
    reference: 'IEC 61131 (Parties 1 à 10)',
    title_fr: 'Automates programmables industriels (API / PLC)',
    title_en: 'Programmable controllers (Parts 1 to 10)',
    scope_fr: 'Spécifications matérielles, exigences environnementales, langages de programmation standardisés (LD, FBD, IL, ST, SFC) et communication industrielle.',
    scope_en: 'Hardware specifications, environmental requirements, standardized programming languages (LD, FBD, IL, ST, SFC), and industrial communications.',
    issuer: 'IEC',
    edition: 'Edition 3.0',
    status: 'active',
    jurisdiction: 'International / Automatismes Industriels & Centrales',
    domain_codes: ['D07', 'D01', 'D06'],
    layer_codes: ['L01', 'L03'],
    applicable_equipment: ['eq-plc-dcs-controller', 'node-gen-g1', 'eq-rtu-gateway-104'],
    used_by_roles: ['Automation Engineer', 'SCADA Specialist', 'Control Systems Engineer'],
    clauses: [
      {
        clause_number: 'IEC 61131-2 §4',
        title_fr: 'Tenue CEM et conditions environnementales d\'exploitation',
        title_en: 'EMC immunity and operating environmental conditions',
        category: 'design_rule',
        requirement_fr: 'Fonctionnement nominal sans défaillance sous immunité électrostatique (ESD 8 kV), transitoires rapides en salves (EFT/B 2 kV) et ondes de choc (1 kV ligne-terre).',
        requirement_en: 'Nominal operation without failure under ESD 8 kV, fast transients/burst 2 kV and surge 1 kV line-to-earth.',
        acceptance_criteria: 'Critère de performance A (aucun plantage ni altération des entrées/sorties temps réel)'
      },
      {
        clause_number: 'IEC 61131-3 §2',
        title_fr: 'Langages de programmation déterministes temps réel',
        title_en: 'Deterministic real-time programming languages',
        category: 'design_rule',
        requirement_fr: 'Conformité stricte aux langages textuels (ST, IL) et graphiques (LD, FBD, SFC) avec gestion normalisée des variables typées et cycles de scrutation bornés.',
        requirement_en: 'Strict compliance with textual (ST, IL) and graphical (LD, FBD, SFC) languages with strongly-typed variables and bounded execution task scan cycles.',
        acceptance_criteria: 'Temps de cycle déterministe ≤ 10 ms pour les boucles de régulation critiques'
      }
    ]
  },
  {
    id: 'std-iec-61800',
    reference: 'IEC 61800 (Parties 1 à 9)',
    title_fr: 'Entraînements électriques de puissance à vitesse variable (PDS / VFD)',
    title_en: 'Adjustable speed electrical power drive systems (PDS / VFD)',
    scope_fr: 'Exigences assignées pour variateurs de fréquence BT et MT, compatibilité électromagnétique (CEM C1-C4), sécurité fonctionnelle intégrée (STO, SS1, SIL 3) et rendement énergétique IE.',
    scope_en: 'Rating requirements for LV and MV frequency converters, electromagnetic compatibility (EMC classes C1-C4), integrated functional safety (STO, SS1, SIL 3), and energy efficiency.',
    issuer: 'IEC',
    edition: 'Edition 3.0',
    status: 'active',
    jurisdiction: 'International & Procédés Industriels Minoteries / Cimenteries',
    domain_codes: ['D06', 'D07', 'D11'],
    layer_codes: ['L01'],
    applicable_equipment: ['eq-vfd-inverter-drive', 'eq-active-filter-apf'],
    used_by_roles: ['Industrial Electrical Engineer', 'Drives Specialist', 'Power Quality Engineer'],
    associated_calculator: 'motor',
    clauses: [
      {
        clause_number: 'IEC 61800-3 §5',
        title_fr: 'Limites d\'émissions électromagnétiques conduites et rayonnées',
        title_en: 'Conducted and radiated electromagnetic emission limits',
        category: 'design_rule',
        requirement_fr: 'Le variateur doit comporter des inductances de ligne DC ou filtres RFI intégrés pour limiter la distorsion harmonique de courant THDi < 35% en amont.',
        requirement_en: 'The drive system must incorporate DC link chokes or integrated RFI filters limiting input current harmonic distortion THDi < 35%.',
        acceptance_criteria: 'Conformité à l\'environnement C2 (industriel mixte) ou C3 (milieu industriel lourd)'
      },
      {
        clause_number: 'IEC 61800-5-2 §4',
        title_fr: 'Sécurité fonctionnelle intégrée - Suppression sûre du couple (STO)',
        title_en: 'Integrated functional safety - Safe Torque Off (STO)',
        category: 'safety_rule',
        requirement_fr: 'Coupure redondante d\'impulsions de grille des IGBT sans commande de contacteur amont, empêchant tout redémarrage inopiné de l\'arbre mécanique.',
        requirement_en: 'Redundant electronic pulse cutoff to IGBT gate drivers preventing unexpected motor shaft torque generation without upstream contactor wear.',
        acceptance_criteria: 'Niveau d\'intégrité de sécurité SIL 3 (IEC 61508) / PL e (ISO 13849-1)'
      }
    ]
  },
  {
    id: 'std-iec-62053',
    reference: 'IEC 62053 / IEC 62052',
    title_fr: 'Équipements de comptage de l\'électricité et compteurs intelligents (AMI)',
    title_en: 'Electricity metering equipment (a.c.) and smart meters (AMI)',
    scope_fr: 'Prescriptions particulières pour compteurs statiques d\'énergie active (classes 0.2S, 0.5S, 1) et réactive (classes 2 et 3), immunité aux perturbations réseau et protocoles DLMS/COSEM.',
    scope_en: 'Particular requirements for static meters for active energy (classes 0.2S, 0.5S, 1) and reactive energy (classes 2, 3), network disturbance immunity, and DLMS/COSEM protocols.',
    issuer: 'IEC',
    edition: 'Edition 2.0',
    status: 'active',
    jurisdiction: 'International & Comptage Tarifaire Eneo / ARSEL',
    domain_codes: ['D15', 'D05', 'D12'],
    layer_codes: ['L01', 'L06'],
    applicable_equipment: ['eq-smart-meter-ami', 'node-sub-mva-1', 'eq-rtu-gateway-104'],
    used_by_roles: ['Metering Engineer', 'Distribution Operations Engineer', 'Commercial Billing Specialist'],
    clauses: [
      {
        clause_number: 'IEC 62053-22 §8',
        title_fr: 'Précision métrologique en classe 0.2S pour comptage transactionnel HTB/HTA',
        title_en: 'Class 0.2S metrological accuracy for HV/MV revenue metering',
        category: 'routine_test',
        requirement_fr: 'L\'erreur relative de mesure de puissance et d\'énergie active doit être contenue à ±0.2% entre 0.05 In et Imax sous facteur de puissance unitaire.',
        requirement_en: 'Active energy percentage measurement error must remain within ±0.2% between 0.05 In and Imax under unity power factor.',
        acceptance_criteria: 'Erreur relative ≤ ±0.2% (cos phi = 1) et ≤ ±0.3% (cos phi = 0.5 inductif)'
      },
      {
        clause_number: 'IEC 62056-6-2 §5',
        title_fr: 'Structure de données et profils de charge normalisés DLMS/COSEM OBIS',
        title_en: 'Standardized DLMS/COSEM OBIS data profiles and load curves',
        category: 'design_rule',
        requirement_fr: 'Horodatage calendaire des index horaires, puissances max atteintes au quart d\'heure et courbes de charge télérelevables à distance par réseau cellulaire APN privé.',
        requirement_en: 'Standardized OBIS profiling of hourly indexes, 15-minute peak demand records and remote AMR/AMI cellular extraction over private APN.',
        acceptance_criteria: 'Interopérabilité DLMS/COSEM certifiée Blue Book'
      }
    ]
  },
  {
    id: 'std-iec-62351',
    reference: 'IEC 62351 (Parties 1 à 14)',
    title_fr: 'Cybersécurité des protocoles de conduite et télégestion des réseaux électriques',
    title_en: 'Power systems management and associated information exchange - Data and communications security',
    scope_fr: 'Chiffrement, authentification et intégrité cryptographique pour protocoles SCADA/EMS : IEC 60870-5-104, IEC 61850 (GOOSE/SV/MMS), DNP3 et certificats X.509 PKI.',
    scope_en: 'Encryption, message authentication and cryptographic integrity for SCADA/EMS protocols: IEC 60870-5-104, IEC 61850 (GOOSE/SV/MMS), DNP3 and X.509 PKI certificates.',
    issuer: 'IEC TC 57',
    edition: 'Edition 2.0',
    status: 'active',
    jurisdiction: 'International & Dispatching National SONATREL (Mangombé)',
    domain_codes: ['D14', 'D12', 'D02', 'D04'],
    layer_codes: ['L01', 'L05'],
    applicable_equipment: ['eq-ems-scada-dispatch', 'eq-rtu-gateway-104', 'eq-bcu-bay-controller', 'eq-digital-twin-server'],
    used_by_roles: ['OT Cybersecurity Specialist', 'SCADA Communications Engineer', 'Protection Specialist'],
    clauses: [
      {
        clause_number: 'IEC 62351-3 §6',
        title_fr: 'Chiffrement TLS 1.3 des liaisons téléconduite IEC 60870-5-104',
        title_en: 'TLS 1.3 encryption for IEC 60870-5-104 telecontrol links',
        category: 'safety_rule',
        requirement_fr: 'Toute communication SCADA sur IP externe entre postes et centre de conduite doit encapsuler les trames 104 dans une session TLS mutuellement authentifiée par certificats X.509.',
        requirement_en: 'All SCADA over IP traffic between substations and dispatch center must encapsulate 104 APDUs within mutually authenticated TLS sessions using X.509 digital certificates.',
        acceptance_criteria: 'Suite cryptographique TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 minimum'
      },
      {
        clause_number: 'IEC 62351-6 §5',
        title_fr: 'Signature numérique et intégrité des trames GOOSE et Sampled Values',
        title_en: 'Digital signature and message integrity for GOOSE and Sampled Values',
        category: 'safety_rule',
        requirement_fr: 'Authentification des messages GOOSE par clé symétrique partagée HMAC-SHA256 avec surcoût temporel de décodage inférieur à 1 ms pour respecter le temps d\'élimination de défaut.',
        requirement_en: 'GOOSE message authentication using HMAC-SHA256 symmetric keys with decoding latency overhead < 1 ms to preserve fault clearing speed.',
        acceptance_criteria: 'Temps de transit total GOOSE sécurisé ≤ 4.0 ms (conforme classe de transfert 1A)'
      }
    ]
  },
  {
    id: 'std-iec-62443',
    reference: 'IEC 62443 / ISA 99',
    title_fr: 'Cybersécurité des réseaux industriels et systèmes de contrôle-commande (IACS / OT)',
    title_en: 'Security for industrial automation and control systems (IACS / OT)',
    scope_fr: 'Modèle de référence en zones et conduits, niveaux de sécurité cibles (SL 1 à SL 4), durcissement des IED/RTU, gestion des correctifs de sécurité et défense en profondeur.',
    scope_en: 'Zones and conduits reference architecture, security levels (SL 1 to SL 4), IED/RTU hardening, patch management, and multi-layered defense-in-depth.',
    issuer: 'IEC / ISA',
    edition: 'Edition 2.0',
    status: 'active',
    jurisdiction: 'International & OIV / Opérateurs d\'Infrastructures Vitales (SONATREL / EDC / Eneo)',
    domain_codes: ['D14', 'D07', 'D12', 'D01'],
    layer_codes: ['L01', 'L05'],
    applicable_equipment: ['eq-rtu-gateway-104', 'eq-ems-scada-dispatch', 'eq-plc-dcs-controller'],
    used_by_roles: ['OT Cybersecurity Specialist', 'Chief Information Security Officer', 'Control Systems Engineer'],
    clauses: [
      {
        clause_number: 'IEC 62443-3-2 §5',
        title_fr: 'Segmentation en zones et conduits de cybersécurité OT',
        title_en: 'OT cybersecurity zones and conduits segmentation',
        category: 'design_rule',
        requirement_fr: 'Ségrégation physique et logique stricte entre le réseau informatique d\'entreprise (Niveau 4), le SCADA de conduite (Niveau 3), le bus de station poste (Niveau 2) et le bus de procédé (Niveau 1).',
        requirement_en: 'Strict physical and logical separation between corporate IT (Level 4), SCADA control (Level 3), substation station bus (Level 2) and process bus (Level 1).',
        acceptance_criteria: 'Pare-feu industriel à inspection d\'état profonde (DPI) sur chaque conduit de transit'
      },
      {
        clause_number: 'IEC 62443-4-2 §6',
        title_fr: 'Exigences techniques de composants - Niveau de Sécurité Cible SL-T 3',
        title_en: 'Component technical security requirements - Security Level SL-T 3',
        category: 'safety_rule',
        requirement_fr: 'Protection contre les attaques intentionnelles sophistiquées par désactivation des ports non sécurisés (Telnet, HTTP), contrôle d\'accès basé sur les rôles (RBAC) et traçabilité inviolable.',
        requirement_en: 'Protection against sophisticated targeted attacks via unsecure port disabling (Telnet, HTTP), Role-Based Access Control (RBAC), and tamper-evident syslog audit logging.',
        acceptance_criteria: 'Certification ISASecure EDSA / CSA ou équivalent tiers accrédité'
      }
    ]
  },
  {
    id: 'std-ieee-1547',
    reference: 'IEEE 1547 / IEEE 1547.1',
    title_fr: 'Raccordement et interopérabilité des ressources énergétiques distribuées (DER)',
    title_en: 'Interconnection and Interoperability of Distributed Energy Resources with Associated Electric Power Systems Interfaces',
    scope_fr: 'Exigences techniques d\'injection réseau pour centrales solaires photovoltaïques, parcs éoliens et systèmes BESS : maintien en réseau (LVRT/HVRT), régulation tension/fréquence et îlotage intentionnel.',
    scope_en: 'Grid interconnection technical requirements for solar PV plants, wind farms and BESS: fault ride-through (LVRT/HVRT), active/reactive power frequency and voltage support, and anti-islanding.',
    issuer: 'IEEE Standards Association',
    edition: 'IEEE Std 1547-2018 (Revision)',
    status: 'active',
    jurisdiction: 'International & Prescriptions Producteurs Indépendants IPP Cameroun',
    domain_codes: ['D08', 'D09', 'D10', 'D05'],
    layer_codes: ['L01', 'L06'],
    applicable_equipment: ['eq-bess-battery-storage', 'eq-inverter-solar-central', 'node-sub-mva-1'],
    used_by_roles: ['Renewable Energy Engineer', 'Distribution Planning Engineer', 'Grid Interconnection Specialist'],
    clauses: [
      {
        clause_number: 'IEEE 1547 §5.3',
        title_fr: 'Maintien en réseau lors de creux de tension (LVRT / Low-Voltage Ride-Through)',
        title_en: 'Low-Voltage Ride-Through capability (LVRT)',
        category: 'design_rule',
        requirement_fr: 'L\'onduleur doit rester connecté et injecter du courant réactif de soutien lors d\'une baisse de tension jusqu\'à 0.0 p.u. pendant 150 ms, et 0.5 p.u. pendant 1.5 seconde sans déconnexion intempestive.',
        requirement_en: 'The inverter must remain connected and inject reactive supporting current during voltage dips down to 0.0 p.u. for 150 ms and 0.5 p.u. for 1.5 s without nuisance tripping.',
        acceptance_criteria: 'Courbe de tenue LVRT Catégorie III validée par essai selon IEEE 1547.1'
      },
      {
        clause_number: 'IEEE 1547 §5.4',
        title_fr: 'Soutien dynamique en fréquence (Mode F-P / Droop primaire décentralisé)',
        title_en: 'Frequency-watt dynamic response and primary droop control',
        category: 'design_rule',
        requirement_fr: 'Réduction automatique de la puissance active injectée en cas de surfréquence (f > 50.2 Hz) avec un statisme configurable s = 3% à 5% pour stabiliser le réseau insulaire ou microgrid.',
        requirement_en: 'Automatic active power curtailment during overfrequency (f > 50.2 Hz) with configurable droop s = 3% to 5% to assist grid frequency recovery.',
        acceptance_criteria: 'Temps de réponse de la boucle de régulation de puissance < 200 ms'
      }
    ]
  }
];

// ENGINEERING ROLES REGISTRY (L02)
export const ENGINEERING_ROLES: Role[] = [
  {
    id: 'role-protection-eng',
    slug: 'protection-engineer',
    name_fr: 'Ingénieur en Protection & Études de Réseau',
    name_en: 'Protection Engineer & System Studies',
    description_fr: 'Spécialiste de la conception, du calcul des plans de réglage des relais, de la coordination sélective et de la mise en service des systèmes de protection HT/MT.',
    description_en: 'Specialist responsible for short-circuit analysis, protection philosophy, relay setting calculations, coordination studies and HV/MV commissioning.',
    domain_codes: ['D11', 'D04', 'D03', 'D01', 'D05'],
    filiere: 'Ingénierie Système & Exploitation Électrique',
    responsibilities_fr: [
      'Modélisation des réseaux électriques et études de court-circuit selon CEI 60909',
      'Élaboration des philosophies de protection des postes et centrales',
      'Calcul des paramètres de réglage des relais différentiels (87), distance (21), surintensité (50/51) et terre (67N)',
      'Programmation et configuration des IED via les logiciels constructeurs (SEL AcSELerator, DIGSI, PCM600)',
      'Réception sur plateforme d\'essai (FAT) et essais d\'injection secondaire/primaire sur site (SAT)',
      'Analyse post-incident des enregistrements oscilloperturbographiques pour identifier la cause racine des défauts'
    ],
    responsibilities_en: [
      'Power system modeling and short-circuit calculations per IEC 60909',
      'Formulation of protection philosophies for substations and generation plants',
      'Setting calculation for differential (87), distance (21), overcurrent (50/51) and earth fault (67N) relays',
      'Configuration and logic file compilation on protection IEDs (AcSELerator, DIGSI, PCM600)',
      'Factory Acceptance Testing (FAT) and secondary/primary current injection on-site (SAT)',
      'Fault analysis using digital fault recorders (DFR) and COMTRADE oscillography records'
    ],
    typical_tools: ['DIgSILENT PowerFactory', 'ETAP', 'SEL AcSELerator QuickSet', 'Siemens DIGSI 5', 'ABB PCM600', 'Omicron Test Universe'],
    typical_equipment: ['Relais numériques IED (87T, 21, 50/51)', 'Transformateurs de courant (TC)', 'Bancs d\'injection Omicron CMC 356', 'Disjoncteurs HT'],
    standards: ['IEC 60255', 'IEC 61850', 'IEEE C37.90', 'IEC 60909'],
    career_path_fr: [
      'Formation : Diplôme d\'Ingénieur / Master en Génie Électrique (spécialité Réseaux & Énergie)',
      'Junior (0-3 ans) : Essais d\'injection de relais, mise en service site, vérification de câblage filaire',
      'Ingénieur Confirmé (3-7 ans) : Études de coordination, modélisation logicielle, réception usine (FAT)',
      'Ingénieur Senior (7-12 ans) : Définition des standards de protection d\'un gestionnaire de réseau (SONATREL), expert incident',
      'Expert Principal / Lead Architect (12+ ans) : Concepteur en chef de postes numériques CEI 61850 et interconnexions régionales (PEAC)'
    ],
    career_path_en: [
      'Education: BEng/MEng in Electrical Power Systems Engineering',
      'Junior (0-3 yrs): Secondary injection testing, commissioning assistance, wiring verification',
      'Mid-Level (3-7 yrs): Relay setting design, short-circuit coordination, FAT execution',
      'Senior (7-12 yrs): Protection philosophy design, incident root-cause specialist for utilities',
      'Lead / Principal Expert (12+ yrs): Chief Architect for IEC 61850 digital substations & regional interconnectors'
    ]
  },
  {
    id: 'role-substation-eng',
    slug: 'substation-design-engineer',
    name_fr: 'Ingénieur Conception de Postes Électriques',
    name_en: 'Substation Design Engineer',
    description_fr: 'Conçoit l\'architecture générale, le schéma unifilaire, l\'implantation électromécanique, les jeux de barres et le génie civil associé des postes HT/MT.',
    description_en: 'Designs overall substation architectures, single-line diagrams, physical electrical layout, busbar sizing and associated interfaces for HV/MV stations.',
    domain_codes: ['D04', 'D03', 'D16'],
    filiere: 'Ingénierie Postes & Réseaux',
    responsibilities_fr: [
      'Établissement des schémas unifilaires généraux et schémas de principe',
      'Dimensionnement mécanique et électrique des jeux de barres et conducteurs sous efforts de court-circuit',
      'Dimensionnement des grilles de terre de poste (tensions de pas et toucher) selon IEEE 80',
      'Spécification technique des transformateurs de puissance, disjoncteurs et sectionneurs',
      'Supervision des plans de cheminement des câbles et interface génie civil'
    ],
    responsibilities_en: [
      'Development of single-line diagrams (SLD) and key protection architectures',
      'Electrical and mechanical sizing of rigid/flexible busbars under short-circuit stresses',
      'Design and calculation of substation earthing grids (step & touch potential) per IEEE 80',
      'Technical specification of power transformers, circuit breakers and disconnectors',
      'Cable routing, trench layouts and civil engineering interface management'
    ],
    typical_tools: ['AutoCAD Electrical', 'Bentley Substation', 'CDEGS (calcul de terre)', 'ETAP', 'Dialux (éclairage)'],
    typical_equipment: ['Postes blindés GIS 225 kV', 'Transformateurs de puissance', 'Disjoncteurs SF6', 'Parafoudres à oxyde de zinc'],
    standards: ['IEC 61936-1', 'IEEE 80', 'IEC 60076', 'IEC 62271-100'],
    career_path_fr: [
      'Formation : Ingénieur en Génie Électrique ou Électromécanique',
      'Junior (0-3 ans) : Réalisation de plans d\'implantation, carnets de câbles, notes de calcul préliminaires',
      'Confirmé (3-7 ans) : Ingénieur d\'études principal de poste clé-en-main (EPC)',
      'Chef de Projet Postes (7-12 ans) : Direction technique de projets d\'extension de réseau de transport',
      'Directeur Ingénierie (12+ ans) : Direction des investissements réseau'
    ],
    career_path_en: [
      'Education: BEng/MEng in Electrical or Electromechanical Engineering',
      'Junior (0-3 yrs): Physical drafting, cable schedules, auxiliary load calculations',
      'Senior (3-7 yrs): Lead Substation Engineer on turnkey EPC substation packages',
      'Project Manager (7-12 yrs): Technical leadership on regional grid expansion projects',
      'Head of Engineering (12+ yrs): Direction of transmission utility capital investments'
    ]
  },
  {
    id: 'role-dispatcher-eng',
    slug: 'grid-dispatcher',
    name_fr: 'Dispatcher / Ingénieur Conduite Réseau',
    name_en: 'Grid Dispatcher / System Operator',
    description_fr: 'Pilote en temps réel l\'équilibre production-consommation, le maintien de la fréquence (50 Hz), le plan de tension et les manœuvres d\'exploitation.',
    description_en: 'Controls real-time generation-load balance, frequency stability (50 Hz), transmission voltage profile and emergency network restoration.',
    domain_codes: ['D02', 'D03', 'D12', 'D01'],
    filiere: 'Exploitation & Conduite Temps Réel',
    responsibilities_fr: [
      'Surveillance continue des transits de puissance sur le réseau 225 kV et 90 kV',
      'Coordination des programmes de production avec les centrales hydroélectriques et thermiques',
      'Gestion des congestions de réseau et des consignations d\'ouvrages pour maintenance',
      'Application des plans de délestage d\'urgence en cas de déficit majeur de production',
      'Reconstitution du réseau (Black-start) après incident généralisé (Black-out)'
    ],
    responsibilities_en: [
      'Continuous monitoring of active/reactive power flows over 225 kV & 90 kV interties',
      'Dispatch coordination with hydro and thermal generating stations',
      'Transmission congestion management and planned outage switching orders',
      'Execution of under-frequency load shedding (UFLS) during generation shortfalls',
      'Black-start grid restoration coordination following systemic blackout'
    ],
    typical_tools: ['SCADA / EMS (Energy Management System)', 'State Estimator', 'Contingency Analysis (N-1)', 'AGC (Automated Generation Control)'],
    typical_equipment: ['Poste de conduite SCADA', 'Mur d\'écrans Dispatching', 'Téléphonie de sécurité sécurisée', 'RTU de poste'],
    standards: ['Code de Réseau National (Grid Code)', 'Règles d\'exploitation PEAC / CAPP', 'IEC 60870-5-104'],
    career_path_fr: [
      'Formation : Ingénieur ou Technicien Supérieur Spécialisé en Réseaux Électriques',
      'Habilitation : Examen officiel de dispatcher réseau après 12 à 18 mois de formation simulateur',
      'Dispatcher Opérationnel (3-8 ans) : Conduite en 3x8 au centre national de conduite (ex. Dispatching National SONATREL)',
      'Chef de quart / Superviseur (8-15 ans) : Prise de décision stratégique lors des incidents majeurs de réseau'
    ],
    career_path_en: [
      'Education: Degree in Electrical Engineering or Power Systems',
      'Certification: Official Dispatcher accreditation following 12-18 months of simulator drills',
      'Operational Dispatcher (3-8 yrs): Shift dispatching at the National Control Center (SONATREL Dispatching)',
      'Shift Supervisor (8-15 yrs): Crisis command during severe system disturbances'
    ]
  }
];

// FORMULAS DATABASE
export const FORMULAS: Formula[] = [
  {
    id: 'form-01',
    domain_id: 'dom-01',
    domain_code: 'D01',
    expression: 'P = √3 × U × I × cos(φ)',
    description_fr: 'Puissance active triphasée équilibrée en régime sinusoïdal',
    description_en: 'Three-phase balanced active electric power under sinusoidal conditions',
    variables: [
      { symbol: 'P', unit: 'W', desc_fr: 'Puissance active totale transmise', desc_en: 'Total active power' },
      { symbol: 'U', unit: 'V', desc_fr: 'Tension composée de ligne (entre phases)', desc_en: 'Line-to-line voltage' },
      { symbol: 'I', unit: 'A', desc_fr: 'Courant de ligne efficace', desc_en: 'Line current (RMS)' },
      { symbol: 'cos(φ)', unit: '—', desc_fr: 'Facteur de puissance de la charge', desc_en: 'Load power factor' }
    ],
    standard_ref: 'IEC 60038 · Grandeurs et unités normalisées',
    applicable_domains: ['D01', 'D04', 'D05', 'D06', 'D07']
  },
  {
    id: 'form-02',
    domain_id: 'dom-11',
    domain_code: 'D11',
    expression: 'Ik" = c × Un / (√3 × Zk)',
    description_fr: 'Courant de court-circuit symétrique initial triphasé selon la norme CEI 60909',
    description_en: 'Initial symmetrical three-phase short-circuit current per IEC 60909',
    variables: [
      { symbol: 'Ik"', unit: 'A', desc_fr: 'Courant de court-circuit symétrique initial', desc_en: 'Initial symmetrical short-circuit current' },
      { symbol: 'c', unit: '—', desc_fr: 'Facteur de tension (1.10 en HT, 1.05 ou 1.10 en BT)', desc_en: 'Voltage factor (1.10 for HV, 1.05/1.10 for LV)' },
      { symbol: 'Un', unit: 'V', desc_fr: 'Tension nominale entre phases du réseau', desc_en: 'Nominal phase-to-phase grid voltage' },
      { symbol: 'Zk', unit: 'Ω', desc_fr: 'Impédance équivalente directe de court-circuit au point de défaut', desc_en: 'Positive-sequence equivalent fault impedance' }
    ],
    standard_ref: 'IEC 60909-0 · Calcul des courants de court-circuit',
    applicable_domains: ['D11', 'D04', 'D02', 'D03']
  },
  {
    id: 'form-03',
    domain_id: 'dom-04',
    domain_code: 'D04',
    expression: 'm = U20 / U1N = N2 / N1 = I1 / I2',
    description_fr: 'Rapport de transformation à vide d\'un transformateur parfait',
    description_en: 'No-load transformation ratio of an ideal transformer',
    variables: [
      { symbol: 'm', unit: '—', desc_fr: 'Rapport de transformation', desc_en: 'Transformation ratio' },
      { symbol: 'U20', unit: 'V', desc_fr: 'Tension à vide au secondaire', desc_en: 'No-load secondary voltage' },
      { symbol: 'U1N', unit: 'V', desc_fr: 'Tension nominale appliquée au primaire', desc_en: 'Nominal primary applied voltage' },
      { symbol: 'N1, N2', unit: 'spires', desc_fr: 'Nombres de spires primaire et secondaire', desc_en: 'Number of primary and secondary turns' }
    ],
    standard_ref: 'IEC 60076-1',
    applicable_domains: ['D04', 'D07', 'D05']
  },
  {
    id: 'form-04',
    domain_id: 'dom-01',
    domain_code: 'D01',
    expression: 'Phyd = ρ × g × Q × H × η',
    description_fr: 'Puissance hydroélectrique nette délivrée par une turbine',
    description_en: 'Net hydroelectric output power delivered by a hydraulic turbine',
    variables: [
      { symbol: 'Phyd', unit: 'W', desc_fr: 'Puissance mécanique produite sur l\'arbre', desc_en: 'Shaft mechanical power output' },
      { symbol: 'ρ', unit: 'kg/m³', desc_fr: 'Masse volumique de l\'eau (1000 kg/m³)', desc_en: 'Water density (1000 kg/m³)' },
      { symbol: 'g', unit: 'm/s²', desc_fr: 'Accélération de la pesanteur (9.81 m/s²)', desc_en: 'Gravitational acceleration (9.81 m/s²)' },
      { symbol: 'Q', unit: 'm³/s', desc_fr: 'Débit volumique turbiné', desc_en: 'Turbined volumetric flow rate' },
      { symbol: 'H', unit: 'm', desc_fr: 'Hauteur de chute nette disponible', desc_en: 'Net hydraulic head available' },
      { symbol: 'η', unit: '—', desc_fr: 'Rendement global du groupe turbo-générateur (~0.88 - 0.94)', desc_en: 'Overall turbo-generator efficiency (~0.88 - 0.94)' }
    ],
    standard_ref: 'CEI 60041 · Essais de réception sur site des turbines hydrauliques',
    applicable_domains: ['D01', 'D07']
  },
  {
    id: 'form-05',
    domain_id: 'dom-03',
    domain_code: 'D03',
    expression: 'P_SIL = Vn² / Zc   avec   Zc = √(L\' / C\')',
    description_fr: 'Puissance naturelle ou de charge d\'onde (Surge Impedance Loading) d\'une ligne de transport',
    description_en: 'Surge Impedance Loading (SIL) and characteristic impedance of a transmission line',
    variables: [
      { symbol: 'P_SIL', unit: 'MW', desc_fr: 'Puissance naturelle transportable sans production ni absorption de réactif', desc_en: 'Natural surge impedance loading' },
      { symbol: 'Vn', unit: 'kV', desc_fr: 'Tension nominale entre phases (ex. 225 kV)', desc_en: 'Nominal phase-to-phase voltage (e.g. 225 kV)' },
      { symbol: 'Zc', unit: 'Ω', desc_fr: 'Impédance caractéristique d\'onde (~350-400 Ω pour ligne aérienne)', desc_en: 'Wave characteristic impedance (~350-400 Ω for overhead lines)' },
      { symbol: 'L\', C\'', unit: 'H/km, F/km', desc_fr: 'Inductance et capacité linéiques de la ligne', desc_en: 'Line series inductance and shunt capacitance per unit length' }
    ],
    standard_ref: 'CEI 60071-1 & IEEE Std 738',
    applicable_domains: ['D03', 'D02', 'D08']
  },
  {
    id: 'form-06',
    domain_id: 'dom-16',
    domain_code: 'D16',
    expression: 'E_touch50 = (1000 + 1.5 × Cs × ρs) × (0.116 / √ts)',
    description_fr: 'Tension de toucher admissible limite de sécurité humaine pour un corps de 50 kg selon IEEE 80',
    description_en: 'Tolerable touch voltage safety limit for a 50 kg body weight per IEEE Std 80',
    variables: [
      { symbol: 'E_touch50', unit: 'V', desc_fr: 'Tension de toucher maximale tolérable', desc_en: 'Maximum tolerable touch potential' },
      { symbol: 'Cs', unit: '—', desc_fr: 'Facteur de détarage de la couche de gravier de surface (~0.70 - 0.85)', desc_en: 'Surface layer derating factor (~0.70 - 0.85)' },
      { symbol: 'ρs', unit: 'Ω·m', desc_fr: 'Résistivité de la couche de gravier concassé en surface (~3000 Ω·m)', desc_en: 'Crushed stone surface layer resistivity (~3000 Ω·m)' },
      { symbol: 'ts', unit: 's', desc_fr: 'Durée du choc / temps d\'élimination du défaut par les protections (~0.2 - 0.5 s)', desc_en: 'Shock duration / fault clearing time (~0.2 - 0.5 s)' }
    ],
    standard_ref: 'IEEE Std 80-2013 · Guide for Safety in AC Substation Grounding',
    applicable_domains: ['D16', 'D04', 'D06']
  },
  {
    id: 'form-07',
    domain_id: 'dom-05',
    domain_code: 'D05',
    expression: 'ΔU = √3 × I × L × (R\' × cos φ + X\' × sin φ)',
    description_fr: 'Chute de tension en ligne triphasée équilibrée',
    description_en: 'Voltage drop across a balanced three-phase distribution line or cable',
    variables: [
      { symbol: 'ΔU', unit: 'V', desc_fr: 'Chute de tension entre phases en bout de ligne', desc_en: 'Phase-to-phase voltage drop at receiving end' },
      { symbol: 'I', unit: 'A', desc_fr: 'Courant de charge véhiculé par phase', desc_en: 'Conducted load current per phase' },
      { symbol: 'L', unit: 'km', desc_fr: 'Longueur totale du tronçon de ligne ou câble', desc_en: 'Feeder or cable route length' },
      { symbol: 'R\', X\'', unit: 'Ω/km', desc_fr: 'Résistance et réactance linéiques à 50 Hz', desc_en: 'Resistance and inductive reactance per km at 50 Hz' },
      { symbol: 'cos φ', unit: '—', desc_fr: 'Facteur de puissance de la charge', desc_en: 'Load power factor' }
    ],
    standard_ref: 'NF C 15-100 & CEI 60364-5-52',
    applicable_domains: ['D05', 'D06', 'D03']
  },
  {
    id: 'form-08',
    domain_id: 'dom-07',
    domain_code: 'D07',
    expression: 'P_mech = √3 × U × I × cos φ × η',
    description_fr: 'Puissance mécanique utile sur l\'arbre d\'un moteur asynchrone triphasé',
    description_en: 'Shaft mechanical power output of a three-phase induction motor',
    variables: [
      { symbol: 'P_mech', unit: 'kW', desc_fr: 'Puissance mécanique disponible sur l\'arbre', desc_en: 'Shaft mechanical useful power output' },
      { symbol: 'U', unit: 'V', desc_fr: 'Tension d\'alimentation entre phases (400 V / 690 V / 6.6 kV)', desc_en: 'Line-to-line supply voltage' },
      { symbol: 'I', unit: 'A', desc_fr: 'Courant absorbé par phase en charge nominale', desc_en: 'Full-load running current per phase' },
      { symbol: 'η', unit: '—', desc_fr: 'Rendement du moteur (classe IE3 / IE4 > 92%)', desc_en: 'Motor efficiency (IE3 / IE4 class > 92%)' },
      { symbol: 'cos φ', unit: '—', desc_fr: 'Facteur de puissance au régime nominal', desc_en: 'Nominal operating power factor' }
    ],
    standard_ref: 'CEI 60034-1 & CEI 60034-30-1',
    applicable_domains: ['D07', 'D06']
  },
  {
    id: 'form-09',
    domain_id: 'dom-11',
    domain_code: 'D11',
    expression: 't = TMS × [ 0.14 / ((I / Is)^0.02 - 1) ]',
    description_fr: 'Courbe à temps inverse normal (Standard Inverse SI) selon CEI 60255 / ANSI 51',
    description_en: 'IEC 60255 Standard Inverse (SI) time-overcurrent characteristic curve (ANSI 51)',
    variables: [
      { symbol: 't', unit: 's', desc_fr: 'Temps de fonctionnement du relais', desc_en: 'Relay operating trip time' },
      { symbol: 'TMS', unit: '—', desc_fr: 'Multiplicateur de temps / Time Multiplier Setting (0.05 à 1.0)', desc_en: 'Time Multiplier Setting dial (0.05 to 1.0)' },
      { symbol: 'I', unit: 'A', desc_fr: 'Courant de défaut circulant dans le relais', desc_en: 'Fault current seen by relay' },
      { symbol: 'Is', unit: 'A', desc_fr: 'Courant de réglage / seuil de démarrage (Pickup)', desc_en: 'Current pickup threshold setting' }
    ],
    standard_ref: 'CEI 60255-151 · Relais de mesure et dispositifs de protection',
    applicable_domains: ['D11', 'D05', 'D04']
  },
  {
    id: 'form-10',
    domain_id: 'dom-09',
    domain_code: 'D09',
    expression: 'P_pv = A_pv × G × η_mod × PR',
    description_fr: 'Puissance électrique produite par un champ solaire photovoltaïque',
    description_en: 'Electrical power yield from a solar photovoltaic array',
    variables: [
      { symbol: 'P_pv', unit: 'kW', desc_fr: 'Puissance électrique utile injectée sur le réseau', desc_en: 'Net power delivered to the grid' },
      { symbol: 'A_pv', unit: 'm²', desc_fr: 'Surface totale active des modules photovoltaïques', desc_en: 'Total active surface area of PV modules' },
      { symbol: 'G', unit: 'kW/m²', desc_fr: 'Irradiance solaire globale incidente (STC = 1.0 kW/m²)', desc_en: 'Incident global solar irradiance (STC = 1.0 kW/m²)' },
      { symbol: 'η_mod', unit: '—', desc_fr: 'Rendement de conversion des modules (TOPCon / HJT ~ 22-24%)', desc_en: 'Module conversion efficiency (TOPCon / HJT ~ 22-24%)' },
      { symbol: 'PR', unit: '—', desc_fr: 'Performance Ratio de la centrale solaire (~0.78 - 0.85)', desc_en: 'Overall plant Performance Ratio (~0.78 - 0.85)' }
    ],
    standard_ref: 'CEI 61724-1 & CEI 61215',
    applicable_domains: ['D09', 'D08', 'D05']
  },
  {
    id: 'form-11',
    domain_id: 'dom-14',
    domain_code: 'D14',
    expression: 'THD_v = √[ Σ_{h=2}^{50} (V_h)² ] / V_1 × 100 %',
    description_fr: 'Taux de distorsion harmonique globale en tension (THD)',
    description_en: 'Total Harmonic Distortion of voltage (THD_v) up to 50th harmonic order',
    variables: [
      { symbol: 'THD_v', unit: '%', desc_fr: 'Taux de distorsion harmonique global (limite CEI < 8%)', desc_en: 'Total voltage harmonic distortion (IEC limit < 8%)' },
      { symbol: 'V_1', unit: 'V', desc_fr: 'Valeur efficace de la tension fondamentale 50 Hz', desc_en: 'RMS value of fundamental 50 Hz voltage' },
      { symbol: 'V_h', unit: 'V', desc_fr: 'Valeur efficace de la composante harmonique de rang h (h = 2 à 50)', desc_en: 'RMS value of harmonic component order h' }
    ],
    standard_ref: 'CEI 61000-2-4 & IEEE Std 519-2022',
    applicable_domains: ['D14', 'D08', 'D06', 'D07']
  },
  {
    id: 'form-12',
    domain_id: 'dom-10',
    domain_code: 'D10',
    expression: 'E_bat = (P_req × t_autonomie) / (DoD × η_bess)',
    description_fr: 'Capacité énergétique utile d\'un système de stockage batterie (BESS)',
    description_en: 'Nominal energy capacity of a Battery Energy Storage System (BESS)',
    variables: [
      { symbol: 'E_bat', unit: 'MWh', desc_fr: 'Capacité nominale de stockage d\'énergie de la batterie', desc_en: 'Rated nameplate BESS battery energy capacity' },
      { symbol: 'P_req', unit: 'MW', desc_fr: 'Puissance active injectée ou absorbée pour le réglage', desc_en: 'Required active power output / absorption' },
      { symbol: 't_autonomie', unit: 'h', desc_fr: 'Durée d\'autonomie requise à pleine charge', desc_en: 'Full-load autonomy duration requirement' },
      { symbol: 'DoD', unit: '—', desc_fr: 'Profondeur de décharge maximale recommandée (~0.80 - 0.90)', desc_en: 'Maximum allowable Depth of Discharge (~0.80 - 0.90)' },
      { symbol: 'η_bess', unit: '—', desc_fr: 'Rendement aller-retour de l\'ensemble batterie + onduleur (~0.88)', desc_en: 'Round-trip BESS AC-to-AC efficiency (~0.88)' }
    ],
    standard_ref: 'CEI 62933-2-1 & IEEE Std 2030.2.1',
    applicable_domains: ['D10', 'D08', 'D02', 'D09']
  },
  {
    id: 'form-13',
    domain_id: 'dom-16',
    domain_code: 'D16',
    expression: 'E_step50 = (1000 + 6.0 × Cs × ρs) × (0.116 / √ts)',
    description_fr: 'Tension de pas admissible limite de sécurité humaine pour un corps de 50 kg selon IEEE Std 80',
    description_en: 'Tolerable step voltage safety limit for a 50 kg body weight per IEEE Std 80',
    variables: [
      { symbol: 'E_step50', unit: 'V', desc_fr: 'Tension de pas maximale tolérable entre les deux pieds distants de 1 m', desc_en: 'Maximum tolerable step potential across 1 m foot spacing' },
      { symbol: 'Cs', unit: '—', desc_fr: 'Facteur de détarage de la couche de concassé de surface (~0.70 - 0.85)', desc_en: 'Surface layer derating factor (~0.70 - 0.85)' },
      { symbol: 'ρs', unit: 'Ω·m', desc_fr: 'Résistivité de la couche de gravier de granit concassé (~3000 Ω·m)', desc_en: 'Crushed granite surface layer resistivity (~3000 Ω·m)' },
      { symbol: 'ts', unit: 's', desc_fr: 'Durée d\'élimination du défaut par les protections haute tension (~0.1 - 0.5 s)', desc_en: 'Fault clearing time by protection relays (~0.1 - 0.5 s)' }
    ],
    standard_ref: 'IEEE Std 80-2013 & CEI 61936-1',
    applicable_domains: ['D16', 'D04', 'D01', 'D03']
  },
  {
    id: 'form-14',
    domain_id: 'dom-07',
    domain_code: 'D07',
    expression: 'T_mech = 9550 × P_kW / n_rpm',
    description_fr: 'Couple électromécanique nominal développé sur l\'arbre d\'une machine tournante',
    description_en: 'Rated electromechanical shaft torque developed by a rotating electrical machine',
    variables: [
      { symbol: 'T_mech', unit: 'N·m', desc_fr: 'Couple mécanique utile sur l\'arbre', desc_en: 'Useful shaft mechanical torque' },
      { symbol: 'P_kW', unit: 'kW', desc_fr: 'Puissance mécanique utile délivrée par le moteur', desc_en: 'Useful mechanical shaft power output' },
      { symbol: 'n_rpm', unit: 'tr/min', desc_fr: 'Vitesse de rotation nominale en charge', desc_en: 'Rated full-load rotational speed' },
      { symbol: '9550', unit: 'constante', desc_fr: 'Facteur de conversion d\'unités 60 / (2π × 1000)', desc_en: 'Unit conversion factor 60 / (2π × 1000)' }
    ],
    standard_ref: 'CEI 60034-1 & CEI 61800-2',
    applicable_domains: ['D07', 'D06', 'D01']
  },
  {
    id: 'form-15',
    domain_id: 'dom-03',
    domain_code: 'D03',
    expression: 'U_2 = U_1 / cos(β × ℓ) ≈ U_1 × [ 1 + (ω² × L\' × C\' × ℓ²) / 2 ]',
    description_fr: 'Élévation de tension par effet Ferranti à l\'extrémité réceptrice d\'une ligne à vide',
    description_en: 'Ferranti receiving-end voltage rise on an energized open-circuit transmission line',
    variables: [
      { symbol: 'U_2', unit: 'kV', desc_fr: 'Tension composée en bout de ligne ouverte (récepteur)', desc_en: 'Open receiving-end line-to-line voltage' },
      { symbol: 'U_1', unit: 'kV', desc_fr: 'Tension composée à l\'origine de la ligne (émetteur)', desc_en: 'Sending-end line-to-line voltage' },
      { symbol: 'β', unit: 'rad/km', desc_fr: 'Constante de phase de propagation électromagnétique', desc_en: 'Phase propagation constant' },
      { symbol: 'ℓ', unit: 'km', desc_fr: 'Longueur physique totale du couloir de transport', desc_en: 'Total physical transmission line route length' },
      { symbol: 'L\', C\'', unit: 'H/km, F/km', desc_fr: 'Inductance linéique et capacité linéique de la ligne', desc_en: 'Series inductance and shunt capacitance per unit length' }
    ],
    standard_ref: 'CEI 60071-1 & CIGRE TB 575',
    applicable_domains: ['D03', 'D02', 'D04']
  },
  {
    id: 'form-16',
    domain_id: 'dom-02',
    domain_code: 'D02',
    expression: '(2H / ω₀) × (d²δ / dt²) = P_m - P_e - D × Δω',
    description_fr: 'Équation d\'oscillation du rotor (Swing Equation) régissant la dynamique électromécanique',
    description_en: 'Synchronous machine rotor swing equation governing electromechanical grid dynamics',
    variables: [
      { symbol: 'H', unit: 's', desc_fr: 'Constante d\'inertie normalisée de la machine (MW·s / MVA)', desc_en: 'Normalized machine inertia constant (MW·s / MVA)' },
      { symbol: 'ω₀', unit: 'rad/s', desc_fr: 'Vitesse angulaire synchrone de référence (2π × 50 Hz = 314.16 rad/s)', desc_en: 'Synchronous reference angular speed' },
      { symbol: 'δ', unit: 'rad', desc_fr: 'Angle interne du rotor par rapport au référentiel synchrone', desc_en: 'Internal rotor angle displacement' },
      { symbol: 'P_m', unit: 'pu', desc_fr: 'Puissance mécanique motrice fournie par la turbine', desc_en: 'Turbine mechanical shaft power input' },
      { symbol: 'P_e', unit: 'pu', desc_fr: 'Puissance électrique électromagnétique injectée sur le réseau', desc_en: 'Electrical active power output to grid' },
      { symbol: 'D', unit: 'pu', desc_fr: 'Coefficient d\'amortissement naturel des enroulements amortisseurs', desc_en: 'Natural damper winding damping coefficient' }
    ],
    standard_ref: 'IEEE Std 1110 & CEI 60034-3',
    applicable_domains: ['D02', 'D01', 'D12']
  },
  {
    id: 'form-17',
    domain_id: 'dom-11',
    domain_code: 'D11',
    expression: 'i_p = κ × √2 × I_k"',
    description_fr: 'Courant de crête dynamique de court-circuit selon la méthode normalisée CEI 60909',
    description_en: 'Peak dynamic short-circuit current per standardized IEC 60909 method',
    variables: [
      { symbol: 'i_p', unit: 'kA', desc_fr: 'Courant de crête maximal de premier quart de période (effort électrodynamique max)', desc_en: 'Maximum peak short-circuit dynamic current' },
      { symbol: 'κ', unit: '—', desc_fr: 'Facteur de crête fonction du rapport R/X (κ = 1.02 + 0.98 × e^(-3·R/X))', desc_en: 'Peak factor derived from equivalent R/X ratio' },
      { symbol: 'I_k"', unit: 'kA', desc_fr: 'Courant de court-circuit symétrique initial efficace', desc_en: 'Initial symmetrical short-circuit RMS current' }
    ],
    standard_ref: 'CEI 60909-0 §4.3 & CEI 60865-1',
    applicable_domains: ['D11', 'D04', 'D05', 'D06']
  },
  {
    id: 'form-18',
    domain_id: 'dom-14',
    domain_code: 'D14',
    expression: 'Q_statcom = √3 × V_grid × [ (V_inv - V_grid) / X_L ]',
    description_fr: 'Puissance réactive dynamique 4 quadrants délivrée par un compensateur STATCOM',
    description_en: 'Four-quadrant dynamic reactive power output delivered by a STATCOM compensator',
    variables: [
      { symbol: 'Q_statcom', unit: 'Mvar', desc_fr: 'Puissance réactive injectée (> 0 capacitif) ou absorbée (< 0 inductif)', desc_en: 'Injected capacitive or absorbed inductive reactive power' },
      { symbol: 'V_grid', unit: 'kV', desc_fr: 'Tension de ligne au point de raccordement commun (PCC)', desc_en: 'Point of Common Coupling (PCC) line voltage' },
      { symbol: 'V_inv', unit: 'kV', desc_fr: 'Tension de sortie générée par l\'onduleur VSC du STATCOM', desc_en: 'VSC inverter output voltage fundamental' },
      { symbol: 'X_L', unit: 'Ω', desc_fr: 'Réactance inductive de liaison du transformateur ou filtre de raccordement', desc_en: 'Coupling transformer or filter inductive reactance' }
    ],
    standard_ref: 'IEEE Std 1052 & CEI 62501',
    applicable_domains: ['D14', 'D10', 'D02', 'D03']
  }
];

// DETAILED CONTENT FOR SUBDOMAINS (Comprehensive Phase 2 content benchmarks)
export const SUBDOMAIN_CONTENTS: Record<string, SubdomainContent> = {
  'D01.01': {
    subdomain_code: 'D01.01',
    concept_fr: `L'énergie hydroélectrique exploite l'énergie cinétique et potentielle de l'eau retenue ou en écoulement naturel. Elle constitue le socle fondamental de la production d'électricité décarbonée et pilotable en Afrique centrale, notamment au Cameroun grâce aux bassins versants majeurs de la Sanaga, de la Bénoué et du Nyong. Les trois grandes catégories d'aménagements sont les centrales au fil de l'eau (sans stockage appréciable), les centrales à retenue avec réservoir régulateur saisonnier, et les stations de transfert d'énergie par pompage (STEP).`,
    concept_en: `Hydroelectric generation captures the potential and kinetic energy of water stored behind dams or naturally descending down river basins. It forms the primary backbone of dispatchable clean electricity across Central Africa, notably in Cameroon with the extensive Sanaga, Benue and Nyong river basins. The primary asset topologies include run-of-river installations, seasonal reservoir storage dams, and pumped-storage power stations (PSPS).`,
    systems_fr: `Une centrale hydroélectrique moderne s'articule autour de quatre grands sous-ensembles :
1. Ouvrages de génie civil hydraulique : barrage déversoir, prise d'eau avec dégrilleurs, galerie d'amenée blindée, cheminée d'équilibre pour amortir les coups de bélier, et conduites forcées en acier.
2. Turbine hydraulique : Francis (chutes moyennes de 30 m à 400 m), Pelton (hautes chutes > 250 m) ou Kaplan (basses chutes à fort débit < 40 m).
3. Alternateur synchrone à pôles saillants : rotor à vitesse lente (100 à 375 tr/min), stator feuilleté sous vide, circuit d'excitation statique avec transformateur d'excitation et pont de thyristors.
4. Système de vannage et régulation : régulateur électronique de vitesse, servomoteurs hydrauliques haute pression (100-160 bars) pilotant les directrices d'admission.`,
    systems_en: `A modern hydro generation complex integrates four major engineering systems:
1. Civil and hydraulic assets: spillway dam, intake gates with trash racks, pressurized headrace tunnel, surge tank for water hammer attenuation, and steel penstocks.
2. Hydraulic turbine: Francis (medium heads 30 m to 400 m), Pelton (high heads > 250 m) or Kaplan (low heads, massive flow < 40 m).
3. Salient-pole synchronous alternator: low-speed rotor (100 to 375 rpm), vacuum-impregnated stator winding, static excitation system with thyristor bridge.
4. Governor & guide vane actuation: electronic speed and load governor, high-pressure hydraulic servomotors (100-160 bar) modulating the wicket gates.`,
    engineering_fr: `Les aspects critiques d'ingénierie comprennent :
- Protection du groupe : relais multifonction 87G (différentielle générateur), 87U (différentielle bloc groupe-transfo), 40 (perte d'excitation), 46 (déséquilibre de phase), 49 (surchauffe stator/rotor) et 64R (mise à la terre rotor).
- Évacuation de puissance : transformateur élévateur (GSU) 11 kV / 225 kV couplé en YNd11 avec disjoncteur de groupe (GCB) ou coupure côté HT.
- Systèmes auxiliaires : réfrigération huile-eau des paliers, groupes oléopneumatiques haute pression, et groupe diesel de secours pour reprise en noir (Black-Start).`,
    engineering_en: `Critical engineering design packages include:
- Unit protection: 87G generator differential, 87U unit overall differential, 40 loss of field, 46 negative sequence current, 49 thermal, and 64R rotor earth fault.
- Power evacuation: GSU step-up transformer (11 kV / 225 kV) configured YNd11, with generator circuit breaker (GCB) or HV-side switching.
- Auxiliary balance-of-plant: oil-water heat exchangers for guide/thrust bearings, high-pressure governor oil pump units, and station black-start diesel generators.`,
    formulas: [FORMULAS[3], FORMULAS[0]],
    standards: [STANDARDS[3], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Aménagement Hydroélectrique de Songloulou (384 MW) & Lom Pangar (Barrage Réservoir)',
      title_en: 'Songloulou Hydroelectric Complex (384 MW) & Lom Pangar Regulating Dam',
      plant_name: 'Centrale de Songloulou / Barrage de Lom Pangar',
      capacity_mw: '384 MW (8 × 48 MW)',
      river_or_location: 'Fleuve Sanaga (Région du Littoral / Région de l\'Est)',
      operators: 'EDC (Gestion du barrage réservoir) · Eneo / SONATREL (Production & Transport 225 kV)',
      voltage_specs: 'Génération à 11 kV → Élévation 225 kV → Lignes 225 kV Songloulou-Mangombé & Songloulou-Oyomabang',
      notes_fr: 'Songloulou est la clé de voûte du Réseau Interconnecté Sud (RIS). Le barrage réservoir de Lom Pangar (6 milliards de m³) en amont régule le débit d\'étiage de la Sanaga à plus de 1000 m³/s, fiabilisant la production toute l\'année.',
      notes_en: 'Songloulou represents the linchpin of the Southern Interconnected Grid (RIS). The upstream Lom Pangar reservoir dam (6 billion m³) guarantees dry-season Sanaga flows above 1000 m³/s, securing continuous baseline output.',
      status: 'verified',
      source: 'Données vérifiées Electricity Development Corporation (EDC) & SONATREL 2026'
    },
    international_case: {
      title_fr: 'Centrale hydroélectrique d\'Itaipu (14 000 MW, Brésil / Paraguay)',
      title_en: 'Itaipu Hydroelectric Power Plant (14,000 MW, Brazil / Paraguay)',
      location: 'Fleuve Paraná, frontière Brésil - Paraguay',
      capacity_mw: '14 000 MW (20 turbines Francis de 700 MW)',
      key_features: 'Deux fréquences de génération (50 Hz Paraguay, 60 Hz Brésil), liaison HVDC ±600 kV de 800 km pour évacuer l\'énergie vers São Paulo.'
    }
  },

  'D01.02': {
    subdomain_code: 'D01.02',
    concept_fr: `Les centrales thermiques au gaz naturel, au fioul lourd (HFO) et à cycles combinés (CCGT) assurent la flexibilité opérationnelle indispensable et l'appoint saisonnier du système électrique camerounais, notamment lors de l'étiage sévère de la Sanaga (décembre à avril). Contrairement à l'hydraulique soumise aux aléas pluviométriques, les tranches thermiques modernes offrent un démarrage rapide (15 à 30 minutes pour les moteurs bicarburants Wärtsilä) et une contribution décisive au réglage primaire de fréquence et au maintien du profil de tension dans les grands bassins industriels de Douala et Limbé.`,
    concept_en: `Thermal generation complexes utilizing natural gas, heavy fuel oil (HFO), and combined-cycle gas turbines (CCGT) provide vital grid flexibility and seasonal dry-season firm capacity (December to April) across Cameroon. While hydro output fluctuates with seasonal rainfall, modern thermal engines deliver rapid start-up (15 to 30 minutes for dual-fuel Wärtsilä internal combustion engines), indispensable primary frequency containment reserves, and localized reactive power support for heavy industrial load centers in Douala and Limbé.`,
    systems_fr: `Une centrale thermique industrielle de forte puissance déploie :
1. Moteurs thermiques ou turbines à gaz : groupes électrogènes bicarburants (gaz naturel / HFO) à vitesse moyenne (500 à 750 tr/min) ou turbines à combustion industrielles à cycle ouvert (OCGT) et récupération de chaleur (HRSG).
2. Alternateurs synchrones triphasés : alternateurs 11 kV à rotor cylindrique ou pôles saillants, classe d'isolation H (180°C), avec régulateurs automatiques de tension (AVR) numériques à double canal et pont de diodes tournantes brushless.
3. Poste d'évacuation HTB : transformateurs élévateurs (GSU) 11 kV / 90 kV ou 11 kV / 225 kV couplés en YNd11 avec disjoncteurs SF6 à commande motorisée.
4. Systèmes auxiliaires BOP (Balance of Plant) : séparateurs centrifuges de fioul lourd, chaudières de préchauffage à vapeur, tours aéroréfrigérantes en circuit fermé et système de réduction catalytique sélective (SCR) pour les émissions d'oxydes d'azote (NOx).`,
    systems_en: `A utility-scale thermal generating complex incorporates:
1. Prime movers: medium-speed dual-fuel internal combustion engines (500 to 750 rpm) running on natural gas and heavy fuel oil (HFO), or industrial Open Cycle Gas Turbines (OCGT) paired with Heat Recovery Steam Generators (HRSG).
2. Three-phase synchronous alternators: 11 kV brushless alternators with dual-channel digital Automatic Voltage Regulators (AVR), Class H thermal insulation, and continuous stator temperature RTD monitoring.
3. High-voltage step-up switchyard: 11 kV / 90 kV or 11 kV / 225 kV GSU transformers configured in YNd11 vector group paired with motorized SF6 circuit breakers.
4. Auxiliary Balance of Plant (BOP): centrifugal heavy fuel purifiers, thermal oil/steam preheaters, closed-loop cooling radiator banks, and Selective Catalytic Reduction (SCR) systems for NOx emissions compliance.`,
    engineering_fr: `Prescriptions d'ingénierie et régulation de puissance :
- Régulation de vitesse et statisme (Droop) : statisme paramétré entre 3.0% et 4.0% pour garantir un partage équitable de la charge active avec les centrales hydroélectriques de Songloulou et Nachtigal lors des transitoires de fréquence.
- Rendement thermique et Heat Rate : consommation spécifique de combustible typique de 180 à 205 g/kWh en mode fioul lourd et 7800 à 8500 kJ/kWh en mode gaz naturel (rendement électrique net atteignant 44% à 47% sur moteurs Wärtsilä 50DF).
- Protection du groupe thermique : relais numériques multifonctions ANSI 87G (différentielle), 40 (perte d'excitation mho), 46 (déséquilibre de phase / composante inverse admissible I2²t ≤ 10s), 51V (surintensité à retenue de tension) et 32 (retour de puissance active lors de coupure intempestive d'injection de gaz).`,
    engineering_en: `Critical engineering design calculations and parameters:
- Governor droop regulation: speed governor droop tuned between 3.0% and 4.0% ensuring equitable active power sharing with Songloulou and Nachtigal hydro plants during system frequency excursions.
- Thermal heat rate & efficiency: specific fuel consumption between 180 and 205 g/kWh on HFO and 7800 to 8500 kJ/kWh on natural gas (net electrical efficiency 44% to 47% on Wärtsilä 50DF prime movers).
- Generator electrical protection: multifunction IEDs configuring ANSI 87G differential, 40 offset mho loss-of-field, 46 negative sequence thermal limit (I2²t ≤ 10s), 51V voltage-restrained overcurrent, and 32 reverse power preventing motoring on fuel cutoff.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[3], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Centrale Thermique à Gaz de Kribi (KPDC 216 MW) & Centrale Fioul de Dibamba (DPDC 86 MW)',
      title_en: 'Kribi Gas-Fired Power Plant (KPDC 216 MW) & Dibamba HFO Peaking Plant (DPDC 86 MW)',
      plant_name: 'Centrale Thermique KPDC de Mpolongwé (Kribi) / Centrale DPDC de Yassa (Douala)',
      capacity_mw: 'Kribi : 216 MW (13 groupes Wärtsilä 18V50DF de 16.6 MW) · Dibamba : 86 MW (8 groupes Wärtsilä 18V38B)',
      river_or_location: 'Mpolongwé, Kribi (Océan) et Yassa-Dibamba, Douala (Littoral)',
      operators: 'Globeleq (KPDC / DPDC) · Eneo Cameroun · SONATREL (Évacuation 225 kV / 90 kV)',
      voltage_specs: 'Génération à 11 kV → Élévation 225 kV (Ligne Kribi-Mangombé 100 km) et 90 kV (Yassa-Bassa)',
      notes_fr: 'La centrale de Kribi valorise le gaz naturel offshore du champ de Sanaga Sud foré par Perenco. Elle constitue la plus puissante centrale thermique à gaz d\'Afrique centrale. Elle évacue sa production vers le nœud stratégique de Mangombé via une ligne 225 kV de 100 km, sécurisant l\'alimentation du RIS lors des saisons sèches.',
      notes_en: 'Kribi power plant utilizes offshore natural gas from the Sanaga South field operated by Perenco. As Central Africa\'s largest gas-fired generation asset, it evacuates 216 MW into the Mangombé 225 kV substation over a dedicated 100 km transmission link, anchoring southern grid stability during dry low-inflow periods.',
      status: 'verified',
      source: 'Rapports d\'Exploitation Globeleq KPDC / Eneo Direction de la Production 2026'
    },
    international_case: {
      title_fr: 'Centrale à Cycle Combiné CCGT de Bouchain (605 MW, France)',
      title_en: 'Bouchain 605 MW High-Efficiency CCGT Power Station (France)',
      location: 'Nord, France',
      capacity_mw: '605 MW (Turbine à gaz GE 9HA.01 + Turbine à vapeur)',
      key_features: 'Rendement record du cycle combiné supérieur à 62.2%, démarrage rapide en 28 minutes et flexibilité dynamique de rampe de 50 MW/minute.'
    }
  },

  'D01.04': {
    subdomain_code: 'D01.04',
    concept_fr: `Les centrales solaires photovoltaïques (PV) au sol de grande puissance constituent l'axe privilégié de décarbonation et de diversification du mix énergétique dans les zones sahéliennes et tropicales sèches (Grand Nord Cameroun). L'effet photovoltaïque convertit directement le rayonnement solaire en courant continu (DC) via des cellules en silicium monocristallin (technologies avancées N-Type TOPCon ou HJT à hétérojonction). L'intégration au réseau électrique exige la maîtrise du facteur de charge, la gestion des rampes brutales d'ensoleillement dues au passage nuageux et la conformité au code de réseau (Grid Code) pour le soutien de fréquence et de tension.`,
    concept_en: `Utility-scale ground-mounted solar photovoltaic (PV) power plants form the spearhead of clean power generation across arid and tropical savannah zones (Northern Cameroon). Photons striking crystalline semiconductor p-n junctions generate direct current (DC) electricity utilizing high-efficiency N-type TOPCon or heterojunction (HJT) bifacial cells. Grid integration requires rigorous power electronics design, cloudy ramp-rate management, and Grid Code compliance for active frequency support and dynamic reactive voltage regulation.`,
    systems_fr: `Une centrale solaire photovoltaïque de taille réseau comprend :
1. Champs de modules solaires bi-faciaux : panneaux solaires N-Type 550Wc à 670Wc montés sur structures trackers uniaxiaux Est-Ouest à inclinaison astronomique optimisée (gain de production de 15% à 22% par rapport aux structures fixes).
2. Boîtes de jonction de chaîne (String Combiner Boxes) : équipées de fusibles DC 1500 V gPV, parafoudres DC Type 1/2 et cartes de surveillance de courant par chaîne (Monitoring RS-485/Modbus).
3. Onduleurs centraux ou de chaîne (String Inverters) : conversion DC/AC triphasée 1500 V DC vers 690 V AC avec algorithmes de poursuite du point de puissance maximale (MPPT) à haute efficacité (> 98.8%).
4. Postes de transformation compacts MV Skid : transformateurs 0.69 / 30 kV couplés Dy11 avec cellules interrupteurs-fusibles HTA sous SF6 et interface SCADA solaire.`,
    systems_en: `A utility-scale solar PV generating facility deploys:
1. Bifacial PV module arrays: 550Wp to 670Wp N-Type monocrystalline panels mounted on single-axis horizontal solar trackers following astronomical sun vectors (yielding 15% to 22% higher daily energy than fixed-tilt racks).
2. DC string combiner boxes: housing 1500 V DC gPV safety fuses, Type 1/2 DC surge protection devices, and hall-effect string current monitoring transceivers.
3. Inverter stations (Central or high-power String Inverters): converting 1500 V DC into 690 V three-phase AC with multi-channel Maximum Power Point Tracking (MPPT) achieving > 98.8% efficiency.
4. Skid-mounted medium-voltage step-up stations: 0.69 / 30 kV step-up transformers (Dy11) integrated with compact SF6 Ring Main Units and fiber-optic solar SCADA RTUs.`,
    engineering_fr: `Calculs et dimensionnement critique d'ingénierie :
- Ratio de surdimensionnement DC/AC (Overclocking) : ratio de dimensionnement de 1.25 à 1.40 entre la puissance crête des panneaux (MWc) et la puissance nominale des onduleurs (MW AC) pour maximiser la production annuelle en écrêtant les heures de pointe.
- Performance Ratio (PR) selon CEI 61724-1 : PR = (E_AC / P_nom_DC) / (H_poa / G_STC) ; doit atteindre 80% à 84% sous climat sahélien en intégrant les pertes par température ambiante élevée (coefficient γ = -0.30%/°C) et les dépôts de poussière d'Harmattan.
- Fonctions avancées de soutien de réseau (Grid Code) : mode Q(U) et cos φ réglable aux bornes des onduleurs pour injecter ou absorber de la puissance réactive même la nuit (Night-Mode Q-on-demand).`,
    engineering_en: `Critical PV engineering calculations and Grid Code benchmarks:
- DC-to-AC oversizing ratio: calibrated between 1.25 and 1.40 between peak module capacity (MWp) and inverter nominal rating (MW AC) optimizing annualized generation factor through peak clipping.
- Performance Ratio (PR) per IEC 61724-1: PR = (E_AC / P_nom_DC) / (H_poa / G_STC); targeting 80% to 84% in tropical savannah conditions factoring module thermal derating (γ = -0.30%/°C) and Harmattan dust soiling.
- Advanced grid-forming and grid-support services: continuous Q(V) reactive droop, dynamic frequency support (P(f) curtailment), and night-time reactive power generation (Q-on-Demand).`,
    formulas: [FORMULAS[9], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Centrales Solaires PV de Maroua (15 MWc) & Guider (15 MWc) avec BESS (Grand Nord Cameroun)',
      title_en: 'Maroua (15 MWp) & Guider (15 MWp) Solar PV Plants with BESS (Northern Cameroon Grid)',
      plant_name: 'Parcs Solaires Photovoltaïques de Guider (Mayo-Louti) et Maroua (Diamaré)',
      capacity_mw: '30 MWc combinés (Maroua 15 MWc + Guider 15 MWc) couplés à 38 MWh de batteries BESS',
      river_or_location: 'Régions du Nord et de l\'Extrême-Nord, Cameroun',
      operators: 'Scatec Release / Eneo Cameroun / SONATREL (Interface RIN)',
      voltage_specs: 'Champs 1500 V DC → Onduleurs 690 V AC → Postes élévateurs 30 kV HTA',
      notes_fr: 'Ces centrales solaires construites en modules pré-assemblés par Scatec Release constituent les premières centrales photovoltaïques connectées au réseau du Cameroun. Couplées à un stockage BESS de 38 MWh, elles compensent le déficit hydrologique chronique du barrage de Lagdo et réduisent la consommation de diesel de plus de 18 millions de litres par an.',
      notes_en: 'These modular ground-mounted solar plants deployed by Scatec Release represent Cameroon\'s first utility-scale grid-tied PV installations. Integrated with 38 MWh of BESS storage, they offset chronic low inflows at the Lagdo hydro plant, saving over 18 million liters of peaking diesel annually.',
      status: 'verified',
      source: 'Données vérifiées Eneo Direction Production & Scatec Release 2026'
    },
    international_case: {
      title_fr: 'Complexe Solaire Noor Ouarzazate (580 MW, Maroc) & Centrale de Benban (1650 MW, Égypte)',
      title_en: 'Noor Ouarzazate Solar Complex (580 MW, Morocco) & Benban Solar Park (1650 MW, Egypt)',
      location: 'Maroc / Égypte',
      capacity_mw: 'Benban : 1650 MWc / Noor : 580 MW (PV et CSP avec stockage sel fondu)',
      key_features: 'Méga-parcs solaires désertiques injectant directement sur les réseaux de grand transport 225 kV et 500 kV avec stations météo avancées et nettoyage automatisé.'
    }
  },

  'D01.05': {
    subdomain_code: 'D01.05',
    concept_fr: `L'énergie éolienne convertit l'énergie cinétique des masses d'air en mouvement en énergie mécanique rotative, puis en électricité via un groupe générateur logé dans la nacelle. Les aérogénérateurs modernes de classe mégawatt (2 MW à 6 MW terrestres, jusqu'à 15 MW en mer) exploitent des rotors tripales à calage de pales variable (Pitch control) entraînant soit des génératrices asynchrones à double alimentation (DFIG) avec convertisseur de puissance partiel, soit des génératrices synchrones à aimants permanents (PMSG) à entraînement direct (Direct Drive) avec convertisseur pleine puissance (Full Converter).`,
    concept_en: `Wind energy conversion systems (WECS) transform the kinetic energy of atmospheric wind flows into aerodynamic rotor torque, then into electrical power via nacelle-mounted drivetrains. Modern utility-scale wind turbines (2 MW to 6 MW onshore, up to 15 MW offshore) deploy variable-speed triple-blade rotors with active pitch regulation, driving either Doubly-Fed Induction Generators (DFIG) with partial-scale rotor converters or gearless Permanent Magnet Synchronous Generators (PMSG) paired with full-scale four-quadrant back-to-back converters.`,
    systems_fr: `Une turbine éolienne industrielle moderne intègre :
1. Ensemble aérodynamique : 3 pales en matériaux composites (fibres de verre/carbone et résine époxy) de 60 à 85 m de rayon avec système électromécanique indépendant de calage angulaire de pale (Pitch) et capteurs de charge optiques FBG.
2. Chaîne cinématique : arbre lent tournant à 8-15 tr/min, multiplicateur de vitesse à engrenages planétaires et hélicoïdaux (rapport de transmission ~1:100) avec lubrification forcée et refroidissement d'huile, ou générateur annulaire basse vitesse sans multiplicateur (Direct Drive).
3. Génératrice électrique et convertisseur : DFIG ou PMSG associée à un convertisseur de puissance 4 quadrants à IGBT régulant indépendamment le couple moteur et l'échange de puissance réactive avec le réseau.
4. Mât tubulaire et orientation : mât en acier conique de 90 à 140 m avec couronne d'orientation (Yaw drive) asservie aux girouettes-anémomètres ultrasoniques de nacelle, et transformateur de pied de mât 0.69 / 33 kV.`,
    systems_en: `A modern utility-scale wind turbine incorporates:
1. Aerodynamic rotor assembly: 3 composite glass/carbon fiber blades (60 to 85 m radius) equipped with independent electromechanical pitch actuators and embedded Fiber Bragg Grating (FBG) strain sensors.
2. Drivetrain: low-speed main shaft (8-15 rpm), multi-stage planetary/helical step-up gearbox (ratio ~1:100) with forced-oil filtration and cooling, or low-speed direct-drive ring generator.
3. Electrical conversion: DFIG or PMSG linked to a bidirectional 4-quadrant IGBT power converter providing decoupled active torque and reactive VAR regulation.
4. Tubular steel tower & yaw mechanism: conical sectional tower (90 to 140 m hub height) with multi-motor yaw drive tracking ultrasonic nacelle anemometers, paired with a 0.69 / 33 kV base transformer.`,
    engineering_fr: `Prescriptions d'ingénierie et conformité réseau :
- Limite de Betz et puissance aérodynamique : P_aero = 0.5 × ρ × A × v³ × Cp(λ, β), où la limite théorique maximale de Betz est Cp_max = 16/27 ≈ 0.593 (les rotors récents atteignent Cp = 0.48 à 0.52).
- Tenue aux creux de tension (LVRT / Fault Ride Through selon CEI 61400-21) : maintien de la connexion au réseau lors de creux de tension résiduelle à 0% pendant 150 ms avec injection dynamique de courant réactif d'au moins 2% par % de chute de tension pour soutenir le réseau.
- Amortissement des résonances mécaniques : contrôle actif d'amortissement de la tour pour éviter la coïncidence entre la fréquence de passage des pales (3P) et la première fréquence propre de résonance en flexion du mât.`,
    engineering_en: `Critical aerodynamic calculations and Grid Code standards:
- Betz limit and aerodynamic extraction: P_aero = 0.5 × ρ × A × v³ × Cp(λ, β), constrained by the theoretical Betz ceiling Cp_max = 16/27 ≈ 0.593 (modern aerofoils achieve Cp = 0.48 to 0.52).
- Low-Voltage Ride-Through (LVRT / FRT per IEC 61400-21): strict requirement to remain synchronized during zero-voltage grid faults lasting up to 150 ms while injecting dynamic reactive current (k-factor ≥ 2) supporting system voltage recovery.
- Tower resonance avoidance: active drive damping algorithms avoiding excitation of the tower first natural bending frequency by the 3P blade-passing frequency.`,
    formulas: [FORMULAS[7], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Études du Potentiel Éolien des Monts Bamboutos (Ouest) & Corridor Littoral de Kribi',
      title_en: 'Wind Power Assessment across Bamboutos Mountains (West) & Kribi Coastal Corridor',
      plant_name: 'Sites Pilotes Éoliens des Monts Bamboutos (Dschang) et de Grand Batanga (Kribi)',
      capacity_mw: 'Potentiel estimé : 40 à 80 MW (Régime de vents moyens 6.2 à 7.4 m/s à 80 m de hauteur)',
      river_or_location: 'Crêtes des Monts Bamboutos (Région de l\'Ouest) et façade atlantique de Kribi',
      operators: 'Ministère de l\'Eau et de l\'Énergie (MINEE) / Agence d\'Électrification Rurale (AER)',
      voltage_specs: 'Raccordement projeté sur le réseau de distribution 30 kV Eneo',
      notes_fr: 'Les campagnes anémométriques sur mâts de 80 m équipés de capteurs certifiés MEASNET ont démontré un potentiel éolien exploitable sur les hauts plateaux de l\'Ouest camerounais et sur la côte sud. Ces projets visent à diversifier le mix électrique national en apportant une source d\'énergie complémentaire à l\'hydroélectricité.',
      notes_en: 'Anemometer measurement campaigns on 80 m met masts with MEASNET-calibrated sensors confirmed commercially viable wind regimes over the Western Cameroon highlands and along the southern coast. Future projects target grid integration on the 30 kV network to complement Sanaga hydro assets.',
      status: 'verified',
      source: 'Atlas Éolien du Cameroun MINEE / Banque Mondiale 2024-2026'
    },
    international_case: {
      title_fr: 'Parc Éolien du Lac Turkana 310 MW (Kenya) & Parcs Offshore Hornsea (Royaume-Uni)',
      title_en: 'Lake Turkana 310 MW Wind Power Project (Kenya) & Hornsea Offshore Fleet (UK)',
      location: 'Kenya / Royaume-Uni',
      capacity_mw: 'Turkana : 310 MW (365 éoliennes Vestas V52 de 850 kW) / Hornsea : > 1300 MW',
      key_features: 'Plus grand parc éolien d\'Afrique subsaharienne avec ligne d\'évacuation 400 kV de 435 km reliant Loiyangalani à Suswa.'
    }
  },

  'D02.01': {
    subdomain_code: 'D02.01',
    concept_fr: `La planification des réseaux électriques et la sécurité d'exploitation reposent sur le critère fondamental N-1 : le système interconnecté doit supporter la perte imprévue de n'importe quel élément unique (ligne 225 kV, transformateur d'interconnexion ou tranche thermique/hydro de forte puissance) sans surcharge d'ouvrage en régime permanent, sans effondrement de tension et sans coupure de charge non contrôlée. Au Cameroun, la séparation historique entre le Réseau Interconnecté Sud (RIS) et le Réseau Interconnecté Nord (RIN) fait de l'interconnexion RIS-RIN par la ligne 225 kV Nachtigal-Bafoussam-Ngaoundéré le chantier de planification le plus stratégique de la décennie.`,
    concept_en: `Grid planning and operational reliability hinge on the foundational N-1 security criterion: the power system must safely withstand the sudden outage of any single critical asset (225 kV circuit, autotransformer bank, or largest generating unit) without causing steady-state thermal overloads, voltage collapse, or uncontrolled cascading tripping. In Cameroon, bridging the southern (RIS) and northern (RIN) grids via the planned 225 kV Nachtigal-Bafoussam-Ngaoundéré intertie represents the nation's foremost grid development initiative.`,
    systems_fr: `Les outils et architectures de planification comprennent :
1. Modélisation de réseau en régime permanent : matrices d'admittance nodale [Ybus], calcul de répartition de charge par méthode de Newton-Raphson.
2. Analyse de contingences systématiques : criblage automatique des pertes d'ouvrages N-1 et N-2 (défauts doubles sur pylônes à double terne).
3. Analyse de stabilité transitoire : temps critique d'élimination de défaut (CCT), équation d'oscillation de Swing, dynamique d'angle rotorique.
4. Réglage fréquence-puissance : réserves primaire (FFR / régulateur de vitesse), secondaire (AGC du dispatching national) et tertiaire.`,
    systems_en: `Grid planning infrastructure and software models integrate:
1. Steady-state network modeling: nodal bus admittance matrix [Ybus], Newton-Raphson load flow simulations.
2. Automated contingency analysis: N-1 security screening and double-circuit N-2 tower outage assessments.
3. Transient stability simulations: critical fault clearing times (CCT), swing equation dynamics, and rotor angle damping.
4. Frequency control hierarchies: primary frequency response, secondary automatic generation control (AGC), and tertiary spinning reserve.`,
    engineering_fr: `Critères stricts d'ingénierie selon le Grid Code SONATREL :
- Tenue de tension : régime permanent entre 0.95 Un et 1.05 Un (213.7 kV à 236.2 kV sur le réseau 225 kV) ; en régime perturbé post-contingence N-1 : 0.90 Un à 1.10 Un.
- Évacuation des 420 MW de Nachtigal : renforcement de la double ligne 225 kV Nachtigal-Nyom II et injection vers le poste de Nomayos pour alimenter Yaoundé sans goulot d'étranglement.
- Plan de sauvegarde de défense du réseau : automatismes de délestage fréquencemétrique à 4 seuils (49.5 Hz, 49.0 Hz, 48.5 Hz, 48.0 Hz) pour prévenir l'effondrement général (Black-out).`,
    engineering_en: `Strict SONATREL Grid Code engineering parameters:
- Voltage tolerance: steady-state limits between 0.95 Un and 1.05 Un (213.7 kV - 236.2 kV on 225 kV network); post-contingency N-1 limits 0.90 Un to 1.10 Un.
- Nachtigal 420 MW power evacuation: twin 225 kV lines to Nyom II and looping into Nomayos substation ensuring secure feed into Yaoundé metropolitan center.
- National defense plan: 4-stage underfrequency load shedding scheme (49.5 Hz, 49.0 Hz, 48.5 Hz, 48.0 Hz) safeguarding against system-wide blackouts.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Dispatching National de SONATREL (Mangombé) & Intégration de Nachtigal (420 MW)',
      title_en: 'SONATREL National Dispatching Center (Mangombé) & Nachtigal 420 MW Ingestion',
      plant_name: 'Centre National de Conduite du Réseau de Transport (CNCRT Mangombé)',
      capacity_mw: 'Puissance de pointe nationale : ~1450 MW (RIS) + 120 MW (RIN)',
      river_or_location: 'Mangombé (Édéa), Carrefour énergétique du Cameroun',
      operators: 'SONATREL (Opérateur du système de transport) · Eneo · EDC · NHPC',
      voltage_specs: 'Dorsales 225 kV et sous-réseau 90 kV interconnecté',
      notes_fr: 'Le dispatching national de Mangombé arbitre en temps réel l\'équilibre offre-demande. Avec la mise en service progressive des 7 groupes de 60 MW de Nachtigal (420 MW), la part hydroélectrique du RIS dépasse 85%, imposant une gestion rigoureuse de la stabilité de fréquence.',
      notes_en: 'The Mangombé dispatching center balances supply and demand every second. The commissioning of Nachtigal\'s seven 60 MW units (420 MW total) raises RIS hydro generation above 85%, requiring advanced primary frequency regulation.',
      status: 'verified',
      source: 'Rapport d\'exploitation SONATREL & Code de Réseau de Transport Cameroun 2026'
    },
    international_case: {
      title_fr: 'Synchronisation UCTE / ENTSO-E et interconnexion pan-africaine WAPP',
      title_en: 'ENTSO-E Synchronous Grid & West African Power Pool (WAPP)',
      location: 'Europe / Afrique de l\'Ouest',
      capacity_mw: 'Capacité interconnectée > 500 000 MW',
      key_features: 'Critère N-1 continental avec réglage secondaire centralisé et réserve primaire distribuée de 3000 MW.'
    }
  },

  'D02.02': {
    subdomain_code: 'D02.02',
    concept_fr: `Le calcul de répartition des charges (Power Flow / Load Flow) est le solveur matriciel non linéaire fondamental de l'ingénierie des réseaux électriques. Il consiste à résoudre le système d'équations algébriques non linéaires couplées reliant les puissances actives (P) et réactives (Q) injectées aux nœuds du réseau aux amplitudes de tension (|V|) et angles de phase (θ). L'analyse de répartition des charges permet d'évaluer les transits sur les lignes 225 kV et transformateurs d'interconnexion, de quantifier les pertes par effet Joule, de vérifier que les tensions nodales restent dans les tolérances réglementaires (0.95 à 1.05 Un) et d'orienter le placement optimal des moyens de compensation réactive (bancs de condensateurs et réactances).`,
    concept_en: `Power Flow (Load Flow) analysis serves as the quintessential non-linear steady-state mathematical solver in power system engineering. It solves the coupled algebraic equations relating active (P) and reactive (Q) nodal power injections to complex bus voltage magnitudes (|V|) and phase angles (θ). Power flow simulations evaluate MVA loading across 225 kV circuits and autotransformer banks, quantify transmission I²R losses, verify that nodal voltages remain strictly within utility standards (0.95 to 1.05 nominal Un), and guide the optimal siting of reactive compensation devices (shunt capacitor banks and reactors).`,
    systems_fr: `La structure nodale et la formulation matricielle d'un réseau maillé comprennent :
1. Typologie tripartite des nœuds (Buses) :
   - Nœud Bilan / Nœud oscillant (Slack / Swing Bus) : amplitude de tension |V| et angle de phase θ fixés arbitrairement (ex. 1.00 pu, 0.0°), absorbant ou injectant le solde actif/réactif du réseau (assigné à la centrale de Songloulou).
   - Nœuds PV (Générateurs) : puissance active injectée P et consigne de tension |V| imposées par le régulateur de tension (AVR), la puissance réactive Q variant librement entre les limites thermiques Qmin et Qmax.
   - Nœuds PQ (Charges / Postes de répartition) : puissances active P et réactive Q consommées imposées par la demande, l'amplitude |V| et l'angle θ étant les inconnues à déterminer.
2. Matrice d'admittance nodale [Ybus] creuse (Sparse Matrix) : dimension N × N où les termes diagonaux Yii représentent la somme des admittances connectées au nœud i, et les termes hors-diagonale Yij représentent l'opposé de l'admittance de la branche reliant les nœuds i et j.
3. Équations de flux de puissance de branche : calcul des transits de puissance active Pij et réactive Qij et des pertes de puissance associées.`,
    systems_en: `Network nodal architecture and admittance modeling comprise:
1. Tripartite Bus Classification:
   - Slack / Swing Bus: reference bus where voltage magnitude |V| and phase angle θ are fixed (1.00 pu, 0.0°), absorbing residual grid system losses and active/reactive imbalances (assigned to Songloulou hydro).
   - PV Generator Buses: specified net active generation P and target bus voltage |V| enforced via alternator excitation AVR, with reactive power Q adjusting dynamically within Qmin and Qmax limits.
   - PQ Load Buses: specified active P and reactive Q demands, where voltage magnitude |V| and phase angle θ are state variables to be computed.
2. Sparse Nodal Admittance Matrix [Ybus]: N × N complex matrix where diagonal elements Yii equal the sum of all branch admittances connected to bus i, and off-diagonal elements Yij equal the negative mutual admittance between buses i and j.
3. Branch Power Flow Equations: computing complex active Pij and reactive Qij branch power transfers and line thermal losses.`,
    engineering_fr: `Algorithmes de résolution et analyse de sensibilité :
- Méthode de Newton-Raphson : linéarisation itérative par la matrice Jacobienne [J] décomposée en 4 sous-matrices : [ΔP ; ΔQ] = [H, N ; M, L] × [Δθ ; Δ|V|/|V|]. Convergence quadratique rapide (typiquement 3 à 5 itérations pour une tolérance de résidu < 0.0001 MW/Mvar).
- Méthode Découplée Rapide (Fast Decoupled Power Flow - FDPF) : exploitation du découplage physique naturel P-θ (puissance active dépendant des angles) et Q-V (puissance réactive dépendant des amplitudes de tension) en approximant [J] par deux matrices B' et B'' symétriques constantes inversées une seule fois.
- Analyse de sensibilité dQ/dV et courbes P-V / Q-V : identification des nœuds les plus faibles du RIS (ex. poste d'Oyomabang à Yaoundé et Bafoussam) et détermination de la marge de stabilité de tension avant effondrement (Voltage Collapse).`,
    engineering_en: `Numerical algorithms and sensitivity analysis:
- Full Newton-Raphson method: iterative linearization via the 4-block partitioned Jacobian matrix [J]: [ΔP ; ΔQ] = [H, N ; M, L] × [Δθ ; Δ|V|/|V|]. Quadratic convergence achieved within 3 to 5 iterations for mismatch tolerances below 0.0001 MW/Mvar.
- Fast Decoupled Power Flow (FDPF): exploiting natural physical P-θ and Q-V decoupling in high-voltage grids (where X >> R), simplifying Jacobian evaluation into constant sparse matrices B' and B'' inverted once.
- dQ/dV modal sensitivity and P-V / Q-V nose curves: pinpointing weakest load buses across the RIS (Oyomabang and Bafoussam nodes) and calculating reactive power reserves prior to voltage instability collapse.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Modélisation du Réseau Interconnecté Sud (RIS) de SONATREL sous PowerFactory (1450 MW)',
      title_en: 'SONATREL Southern Interconnected Grid (RIS) PowerFactory Load Flow Model (1450 MW)',
      plant_name: 'Centre National de Dispatching de Mangombé / Division Études Réseau SONATREL',
      capacity_mw: 'Modélisation complète du RIS : 1450 MW de charge de pointe, 28 postes HTB, 52 lignes 225/90 kV',
      river_or_location: 'Territoire national (Réseau Interconnecté Sud Cameroun)',
      operators: 'SONATREL (Direction de l\'Ingénierie & Planification DIP)',
      voltage_specs: 'Dorsales 225 kV, sous-réseau 90 kV et départs d\'injection 30 kV',
      notes_fr: 'Les études de répartition de charge menées par la SONATREL sous DIgSILENT PowerFactory ont démontré que l\'injection des 420 MW de Nachtigal réduisait les pertes de transport nationales de 18 MW sur le corridor Sanaga-Yaoundé. Les simulations ont également permis de dimensionner 40 Mvar de batteries de condensateurs 90 kV aux postes de Ngousso et Kondengui pour soutenir la tension à Yaoundé.',
      notes_en: 'SONATREL transmission studies executed in DIgSILENT PowerFactory proved that evacuating 420 MW from Nachtigal cuts national transmission losses by 18 MW along the Sanaga-Yaoundé axis. Simulations established the necessity of installing 40 Mvar of 90 kV capacitor banks at Ngousso and Kondengui to bolster voltage stability in Yaoundé.',
      status: 'verified',
      source: 'Rapport d\'Études Planification Réseau SONATREL & DIgSILENT PowerFactory Base 2026'
    },
    international_case: {
      title_fr: 'Moteur de Calcul Load Flow PSS/E d\'ENTSO-E (Europe) & PJM Interconnection (USA)',
      title_en: 'ENTSO-E Pan-European & PJM Interconnection Real-Time Load Flow Engines',
      location: 'Europe / États-Unis',
      capacity_mw: 'Modélisation de plus de 15 000 nœuds et 400 GW de puissance',
      key_features: 'Résolution itérative distribuée en moins de 2 secondes, détection automatique des congestions de lignes et calcul dynamique des capacités de transfert transfrontalières (NTC/ATC).'
    }
  },

  'D02.03': {
    subdomain_code: 'D02.03',
    concept_fr: `La stabilité dynamique et transitoire caractérise la faculté d'un réseau électrique maillé à conserver son synchronisme électromécanique et à retrouver un régime permanent acceptable après avoir subi une perturbation sévère (court-circuit triphasé franc éliminé par les protections, perte imprévue d'un groupe hydroélectrique de 60 MW ou déclenchement d'un couloir de transport 225 kV). La stabilité s'analyse selon trois dimensions complémentaires : la stabilité d'angle rotorique (maintien du synchronisme entre alternateurs), la stabilité de fréquence (équilibre global puissance active production-consommation) et la stabilité de tension (maintien du profil de tension sous contrainte réactive).`,
    concept_en: `Dynamic and transient power system stability governs the ability of an interconnected network to regain acceptable synchronous equilibrium following severe disturbances (cleared three-phase short-circuits, abrupt loss of a 60 MW generating unit, or sudden tripping of major 225 kV corridors). System stability spans three interrelated engineering dimensions: rotor angle stability (maintaining synchronism among alternators), frequency stability (active generation-load balance), and voltage stability (counteracting reactive power deficits without voltage collapse).`,
    systems_fr: `Les mécanismes dynamiques et boucles de contrôle de stabilité comprennent :
1. Équation d'oscillation du rotor (Swing Equation) régissant chaque alternateur synchrone :
   $$J \\cdot \\frac{d\\omega_m}{dt} = T_m - T_e - D \\cdot \\Delta\\omega_m \\quad \\iff \\quad \\frac{2H}{\\omega_0} \\cdot \\frac{d^2\\delta}{dt^2} = P_m - P_e - D \\cdot \\Delta\\omega$$
   où H est la constante d'inertie de la machine (typiquement 3.0 à 4.5 secondes pour les alternateurs hydroélectriques de Songloulou et Nachtigal).
2. Régulateurs automatiques de tension (AVR) avec stabilisateurs de puissance réseau (PSS - Power System Stabilizers) : injection d'un signal correcteur proportionnel aux variations de vitesse rotorique (Δω) ou de puissance d'accélération (ΔPa) pour amortir les oscillations de puissance inter-zones (0.1 à 0.8 Hz) et locales (0.8 à 2.0 Hz).
3. Régulateurs de vitesse des turbines (Governors) : régulation primaire de fréquence P-f assurant la réponse inertielle et primaire instantanée lors de la perte d'un groupe.
4. Système de protection et de défense du réseau (UFLS - Under-Frequency Load Shedding) : relais de délestage fréquencemétrique à 4 paliers (49.5 Hz, 49.0 Hz, 48.5 Hz, 48.0 Hz) pour enrayer la chute de fréquence et éviter l'écroulement généralisé (Black-out).`,
    systems_en: `Dynamic mechanisms and closed-loop stability controls incorporate:
1. Rotor Swing Equation governing every synchronous generator:
   $$\\frac{2H}{\\omega_0} \\cdot \\frac{d^2\\delta}{dt^2} = P_m - P_e - D \\cdot \\Delta\\omega$$
   where H represents the machine inertia constant (typically 3.0 to 4.5 seconds for Songloulou and Nachtigal salient-pole hydro generators).
2. Automatic Voltage Regulators (AVR) integrated with Power System Stabilizers (PSS): modulating excitation field voltage based on rotor speed deviation (Δω) or accelerating power (ΔPa) to introduce positive damping torque against inter-area (0.1 to 0.8 Hz) and local (0.8 to 2.0 Hz) electromechanical oscillations.
3. Turbine speed governors: primary frequency droop response supplying governor power ramps within seconds following generation loss.
4. Under-Frequency Load Shedding (UFLS) scheme: 4-stage automated load detachment relays (49.5 Hz, 49.0 Hz, 48.5 Hz, 48.0 Hz) arresting frequency degradation to safeguard against systemic blackout collapse.`,
    engineering_fr: `Critères d'analyse et temps critique d'élimination :
- Temps Critique d'Élimination de Défaut (CCT - Critical Clearing Time) : durée maximale admissible pendant laquelle un court-circuit triphasé peut subsister sur une ligne 225 kV sans que l'alternateur le plus proche ne perde le synchronisme. Sur le réseau de SONATREL, le CCT sur la ligne 225 kV Nachtigal-Nyom 2 est de 120 ms, exigeant des protections différentielles 87L et distance 21 ultra-rapides (< 25 ms) et des disjoncteurs SF6 à temps d'ouverture ≤ 50 ms (élimination totale en 75 ms).
- Critère des aires égales (Equal Area Criterion) : égalité géométrique entre l'aire d'accélération A1 (pendant le défaut) et l'aire de décélération maximale disponible A2 (après ouverture du disjoncteur) pour garantir le retour à l'équilibre stable.
- Taux de variation de fréquence (RoCoF = df/dt) : seuil d'alarme fixé à |df/dt| > 0.5 Hz/s, au-delà duquel les risques de déclenchement en cascade des centrales thermiques et solaires deviennent critiques.`,
    engineering_en: `Analytical criteria and Critical Clearing Time benchmarks:
- Critical Fault Clearing Time (CCT): maximum allowable duration of a three-phase short-circuit on a 225 kV circuit before generator rotor angle swings past the unstable equilibrium point. On SONATREL's grid, the CCT for a fault near Nachtigal busbars is 120 ms, requiring high-speed 87L and distance relays (< 25 ms) and 2-cycle SF6 breakers (total fault clearing within 75 ms).
- Equal Area Criterion: graphical balance between accelerating energy area A1 (accumulated during fault duration) and maximum decelerating margin area A2 (restored post-fault clearing).
- Rate of Change of Frequency (RoCoF = df/dt): system threshold capped at |df/dt| > 0.5 Hz/s, beyond which anti-islanding relays on renewable plants trip spuriously, exacerbating generation shortfalls.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[3], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Plan de Défense & Stabilité Transitoire du Réseau Interconnecté Sud (RIS SONATREL)',
      title_en: 'SONATREL Southern Interconnected Grid (RIS) Transient Stability & Defense Scheme',
      plant_name: 'Réseau de Transport 225 kV SONATREL / Aménagement Hydroélectrique de Nachtigal',
      capacity_mw: 'Inertie totale du système RIS : ~4200 MW·s à la pointe nationale de 1450 MW',
      river_or_location: 'Corridors 225 kV Sanaga (Nachtigal, Songloulou, Édéa) vers Douala et Yaoundé',
      operators: 'SONATREL (Exploitation Transport & Dispatching Mangombé)',
      voltage_specs: '225 kV triphasé 50 Hz · Délais d\'élimination de défauts garantis < 80 ms',
      notes_fr: 'Les études dynamiques de SONATREL ont permis de calibrer les fonctions PSS2B (Power System Stabilizers à double entrée vitesse/puissance) sur les régulateurs d\'excitation des 7 groupes de Nachtigal. Ces réglages éliminent tout risque d\'oscillation pendulaire sous-synchrone entre les groupes de Nachtigal (420 MW) et ceux de Songloulou (384 MW) distants de 140 km sur le fleuve Sanaga.',
      notes_en: 'SONATREL dynamic stability studies tuned IEEE PSS2B dual-input stabilizers on the excitation systems of Nachtigal\'s seven generating units. This calibration eliminates sub-synchronous electromechanical power oscillations between Nachtigal (420 MW) and Songloulou (384 MW) hydro stations separated by 140 km along the Sanaga river basin.',
      status: 'verified',
      source: 'Étude de Stabilité Dynamique du RIS Tractebel / SONATREL Direction du Transport 2026'
    },
    international_case: {
      title_fr: 'Système WAMS de Surveillance de Stabilité en Temps Réel RTE & Fingrid (PMU IEEE C37.118)',
      title_en: 'RTE & Fingrid Wide Area Monitoring System (WAMS) Dynamic Stability Architecture',
      location: 'France / Finlande',
      capacity_mw: 'Supervision synchrone continentale',
      key_features: 'Réseau de synchrophaseurs PMU calculant les angles de phase à 50 trames/s pour détecter en direct l\'apparition d\'oscillations inter-zones non amorties et déclencher des actions de contrôle préventives.'
    }
  },

  'D03.01': {
    subdomain_code: 'D03.01',
    concept_fr: `Les lignes aériennes de transport 225 kV constituent les artères maîtresses de l'évacuation et du transit d'énergie en vrac sur de grandes distances. Dans les environnements tropicaux et équatoriaux comme celui du Cameroun, les lignes traversent des forêts denses, des zones marécageuses et des couloirs à très forte densité de foudroiement kéraunique (Nk > 100 jours d'orage/an). L'ingénierie des lignes englobe la mécanique des câbles (flèche, tension mécanique, vibrations éoliennes), le dimensionnement des pylônes en treillis métallique, les chaînes d'isolateurs en verre trempé ou composite, et le câble de garde composite OPGW.`,
    concept_en: `225 kV overhead transmission lines form the bulk power transmission arteries traversing expansive geographic corridors. In tropical environments such as Cameroon, lines navigate equatorial rain forests, mangrove swamps, and zones with extreme keraunic lightning activity (isokeraunic level Nk > 100 thunderstorm days/year). Line engineering balances cable catenary mechanics (sag, mechanical tension, aeolian vibration dampers), lattice steel tower designs, toughened glass or composite insulator strings, and OPGW fiber-optic skywires.`,
    systems_fr: `Une liaison de transport aérienne 225 kV intègre :
1. Pylônes en treillis métallique tétrapodes : pylônes d'alignement/suspension, pylônes d'angle et d'arrêt/ancrage résistant aux efforts de traction unilatérale.
2. Conducteurs de phase : faisceaux bifilaires d'alliage d'aluminium Almélec (Aster 570 mm² ou Aster 366 mm²), réduisant les pertes par effet couronne et le gradient de champ superficiel.
3. Câbles de garde : protection contre les coups de foudre directs avec angle de protection < 25° ; intégration d'un câble de garde OPGW (Optical Ground Wire) renfermant 48 fibres optiques monomodes.
4. Chaînes d'isolateurs : chaînes simples ou doubles d'isolateurs en verre trempé cap-and-pin ou polymères silicone avec cornes ou anneaux pare-effluves.`,
    systems_en: `A modern 225 kV transmission line assembly comprises:
1. Steel lattice towers: tangent suspension towers, angle tension towers, and dead-end strain structures engineered for unilateral broken-wire conditions.
2. Phase bundle conductors: twin-conductor bundles of Aster 570 or 366 mm² Almelec (AAAC alloy), minimizing corona loss, audible noise, and radio interference.
3. Overhead shield wires: dual ground wires providing < 25° shielding angle against direct lightning strikes, incorporating OPGW housing 48 single-mode optical fibers.
4. Insulator strings: toughened glass cap-and-pin or silicone composite insulator strings fitted with corona grading rings and arc horns.`,
    engineering_fr: `Prescriptions de calcul et normes :
- Équation de changement d'état du conducteur selon CEI 60826 : calcul des flèches maximales à température maximale du conducteur (+75°C) et tensions maximales sous vent violent (pression dynamique de vent de 80 daN/m²).
- Distance minimale de sécurité au sol : 8.0 mètres minimum à 225 kV au-dessus des terrains ordinaires, 9.5 mètres au croisement des routes nationales.
- Impédance caractéristique et SIL : impédance d'onde Zc = 380 Ω, puissance naturelle P_SIL = 133 MW par terne. Au-delà de P_SIL, la ligne absorbe du réactif ; en-dessous (faible charge nocturne), elle produit du réactif par effet Ferranti.`,
    engineering_en: `Calculations and technical specifications:
- Catenary state change equations per IEC 60826: maximum sag at peak conductor operating temperature (+75°C) and maximum mechanical tension under high wind (80 daN/m² wind pressure).
- Ground clearances: minimum 8.0 m vertical clearance at 225 kV over standard ground, 9.5 m over major highways.
- Surge Impedance Loading: wave impedance Zc = 380 Ω, natural loading P_SIL = 133 MW per circuit. Beyond SIL, lines consume reactive power; at light nocturnal loading, lines generate excess reactive VARs via Ferranti rise.`,
    formulas: [FORMULAS[4], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Corridor 225 kV Songloulou-Mangombé-Logbaba (Alimentation Métropole Douala)',
      title_en: '225 kV Songloulou-Mangombé-Logbaba Power Highway (Douala Grid Evacuation)',
      plant_name: 'Ligne 225 kV Songloulou-Mangombé & Mangombé-Logbaba',
      capacity_mw: 'Capacité de transit : 2 × 280 MVA (Ligne double terne)',
      river_or_location: 'Corridor Sanaga - Littoral (Édéa vers Douala)',
      operators: 'SONATREL (Transport Haute Tension HTB)',
      voltage_specs: '225 kV triphasé 50 Hz · Conducteurs Almélec Aster 570',
      notes_fr: 'Cette dorsale stratégique évacue la puissance de la centrale de Songloulou (384 MW) et d\'Édéa (276 MW) vers le grand pôle industriel et économique de Douala. Elle a fait l\'objet de travaux de réhabilitation avec pose de câbles OPGW pour raccorder le SCADA au dispatching de Mangombé.',
      notes_en: 'This critical corridor transports generation from Songloulou (384 MW) and Edéa (276 MW) hydro plants into Douala industrial hub. Recent rehabilitation upgraded the line with dual OPGW optical links connecting substations to Mangombé dispatching.',
      status: 'verified',
      source: 'Données techniques SONATREL Direction du Transport 2026'
    },
    international_case: {
      title_fr: 'Liaisons 400 kV / 765 kV Hydro-Québec & Grande Dorsale Éthiopie-Kenya',
      title_en: 'Hydro-Québec 735 kV Grid & Ethiopia-Kenya 500 kV HVDC Corridor',
      location: 'Canada / Afrique de l\'Est',
      capacity_mw: 'Transit unitaire : jusqu\'à 2000 MW',
      key_features: 'Faisceau quadri-conducteurs, compensation série par condensateurs et liaisons inter-États.'
    }
  },

  'D03.02': {
    subdomain_code: 'D03.02',
    concept_fr: `Les liaisons souterraines haute tension (HTB 90 kV à 225 kV) constituent l'alternative technique indispensable aux lignes aériennes pour franchir les zones urbaines denses (pénétrantes de Douala et Yaoundé), les couloirs marécageux, les emprises aéroportuaires et les zones industrielles où la pose de pylônes en treillis est physiquement ou réglementairement impossible. L'ingénierie des câbles haute tension repose sur l'isolation en polyéthylène réticulé (XLPE / PR) sous gaine métallique étanche, la gestion thermique de l'échauffement dans le sol (méthode de Neher-McGrath et CEI 60287) et le traitement des courants induits dans les écrans métalliques par permutation spéciale (Cross-Bonding).`,
    concept_en: `High-voltage underground cable systems (HV 90 kV to 225 kV) provide the mission-critical underground alternative to overhead towers across dense metropolitan corridors (Douala and Yaoundé urban feeds), river deltas, airport clear zones, and congested industrial estates. Underground cable engineering centers on thick-wall cross-linked polyethylene (XLPE) dielectric insulation shielded by radial moisture barrier metallic sheaths, thermal soil dissipation modeling (Neher-McGrath method and IEC 60287), and induced circulating sheath current mitigation via specially bonded Cross-Bonding configurations.`,
    systems_fr: `Une liaison souterraine HTB 90 kV / 225 kV intègre :
1. Câble unipolaire à isolation synthétique XLPE : âme conductrice ronde compactée en cuivre ou aluminium (sections 630 à 1600 mm²), écran semi-conducteur interne, isolant XLPE pur extrudé sous triple extrusion simultanée sous atmosphère d'azote sec, écran semi-conducteur externe, écran métallique en plomb ou aluminium ondulé soudé, et gaine extérieure en polyéthylène haute densité (PEHD) avec couche conductrice graphite pour essai diélectrique de gaine.
2. Boîtes de jonction préfabriquées (Joints) : jonctions droites ou jonctions avec coupure d'écran (Sectionalizing Joints) moulées en caoutchouc silicone ou EPDM avec cônes déflecteurs de champ électrique.
3. Boîtes d'extrémité (Terminations) : têtes de câbles extérieures en porcelaine ou composite silicone remplies d'huile silicone ou sèches, et têtes de câbles enfichables compactes directement immergées dans les compartiments des postes blindés GIS (selon CEI 62271-209).
4. Système de mise à la terre des écrans (Cross-Bonding) : boîtes de permutation d'écrans avec limiteurs de surtension de gaine (SVL - Sheath Voltage Limiters à varistance ZnO) installées tous les 3 tronçons (longueur de pas ~500 à 800 m) pour annuler les courants de circulation tout en maintenant la tension de gaine induite < 65 V en régime permanent.`,
    systems_en: `A 90 kV / 225 kV high-voltage underground cable system integrates:
1. Single-core XLPE insulated power cable: compacted stranded copper or aluminum conductor (630 to 1600 mm²), inner semiconductive screen, high-purity dry-cured XLPE insulation applied under clean-room triple extrusion, outer semiconductive screen, extruded corrugated aluminum or lead radial water-barrier sheath, and outer HDPE jacket coated with extruded conductive graphite skin for jacket integrity testing.
2. Prefabricated cable accessories (Joints): straight-through joints and sectionalizing cross-bonding joints featuring pre-molded silicone or EPDM stress control cones.
3. Cable Terminations: outdoor porcelain or composite silicone terminations (dry or fluid-filled), and compact plug-in GIS terminations interfacing directly with SF6 switchgear enclosures (per IEC 62271-209).
4. Sheath Bonding & Cross-Bonding System: sectionalized link boxes housing Sheath Voltage Limiters (SVL ZnO varistors) installed at every major cross-bonding section (~500 to 800 m intervals) canceling continuous sheath circulating I²R losses while clamping induced standing sheath voltages below 65 V under peak load.`,
    engineering_fr: `Calculs et dimensionnement critique selon CEI 60287 :
- Intensité admissible en régime permanent (Ampacité) : calcul basé sur le réseau thermique équivalent de Neher-McGrath intégrant les pertes joule dans l'âme, les pertes diélectriques dans le XLPE ($W_d = 2\pi f \cdot C \cdot U_0^2 \cdot \tan\delta$), les pertes par courants induits dans les écrans et la résistivité thermique du sol d'enfouissement (typiquement $\rho_s = 1.0\text{ à }1.5\text{ K}\cdot\text{m/W}$).
- Compensation réactive obligatoire : en raison de la très forte capacité linéique des câbles souterrains ($C' \approx 0.15\text{ à }0.25\ \mu\text{F/km}$, soit 15 à 25 fois supérieure à celle d'une ligne aérienne), un câble 225 kV produit entre 1.5 et 2.5 Mvar de puissance réactive capacitive par kilomètre sous tension, exigeant l'installation de réactances shunt de compensation pour éviter l'emballement de tension en régime de faible transit.
- Essais de réception après pose (SAT selon CEI 60840 / CEI 62067) : essai diélectrique de surtension à fréquence industrielle variable (VLF 20-300 Hz) à 1.7 Un pendant 1 heure couplé à la mesure en ligne des décharges partielles (DP < 5 pC).`,
    engineering_en: `Critical sizing criteria and equations per IEC 60287:
- Continuous current rating (Ampacity): derived from Neher-McGrath thermal ladder network accounting for conductor I²R losses, dielectric insulation losses ($W_d = 2\pi f \cdot C \cdot U_0^2 \cdot \tan\delta$), metallic sheath circulating/eddy losses, and thermal resistivity of the surrounding soil backfill ($\rho_s = 1.0\text{ to }1.5\text{ K}\cdot\text{m/W}$).
- Mandatory shunt reactor compensation: because underground cables possess substantial shunt capacitance ($C' \approx 0.15\text{ to }0.25\ \mu\text{F/km}$, 15 to 25 times overhead lines), a 225 kV cable generates 1.5 to 2.5 Mvar of reactive capacitive power per kilometer, requiring substation shunt reactors to forestall Ferranti voltage escalation during light nocturnal loading.
- On-site commissioning tests (SAT per IEC 60840 / IEC 62067): resonant variable-frequency AC high-voltage withstand test (VLF 20-300 Hz) at 1.7 Un for 60 minutes accompanied by high-sensitivity online partial discharge surveying (< 5 pC threshold).`,
    formulas: [FORMULAS[4], FORMULAS[6]],
    standards: [STANDARDS[2], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Liaisons Souterraines 90 kV Oyomabang - Kondengui (Yaoundé) & Logbaba - Bassa (Douala)',
      title_en: '90 kV Underground Cable Links: Oyomabang - Kondengui (Yaoundé) & Logbaba - Bassa (Douala)',
      plant_name: 'Liaisons Souterraines HTB 90 kV de SONATREL (Pénétrantes Urbaines de Douala et Yaoundé)',
      capacity_mw: 'Capacité de transit par liaison : 90 MVA (Câbles 90 kV XLPE 630 mm² cuivre)',
      river_or_location: 'Agglomérations urbaines de Yaoundé (Centre) et Douala (Littoral)',
      operators: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
      voltage_specs: '90 kV HTB triphasé · Tranchées bétonnées avec remblai thermique stabilisé (sable de rivière)',
      notes_fr: 'Pour franchir les zones urbaines saturées de Yaoundé sans démolitions massives d\'habitations, la liaison 90 kV reliant le grand poste d\'Oyomabang au poste urbain de Kondengui a été réalisée en câbles souterrains XLPE 630 mm² cuivre avec permutation d\'écrans Cross-bonding. À Douala, les départs 90 kV Logbaba-Bassa traversent la zone marécageuse industrielle avec des câbles renforcés contre les infiltrations d\'eau salée.',
      notes_en: 'To traverse densely built residential districts in Yaoundé without massive building expropriations, the 90 kV link connecting the Oyomabang transmission hub to Kondengui urban substation was executed using 630 mm² copper XLPE underground cables with sectionalized cross-bonding. In Douala, the 90 kV Logbaba-Bassa circuits traverse industrial mangrove zones deploying radial water-blocking barrier jackets.',
      status: 'verified',
      source: 'Spécifications Techniques Câbles HTB SONATREL & Rapports de Pose 2026'
    },
    international_case: {
      title_fr: 'Interconnexion Souterraine 320 kV HVDC INELFE (France - Espagne) & Câbles 400 kV RTE',
      title_en: 'INELFE 320 kV HVDC Underground Interconnector (France - Spain) & RTE 400 kV XLPE',
      location: 'Pyrénées (France / Espagne)',
      capacity_mw: 'Capacité de transit bidirectionnelle : 2000 MW (2 × 1000 MW)',
      key_features: 'Plus longue liaison souterraine transfrontalière à isolation synthétique extrudée (64 km) traversant les Pyrénées dans une galerie technique dédiée avec contrôle thermique en fibre optique DTS.'
    }
  },

  'D03.03': {
    subdomain_code: 'D03.03',
    concept_fr: `L'impédance caractéristique (Wave Impedance $Z_c$) et la puissance naturelle (Surge Impedance Loading - SIL) constituent les grandeurs fondamentales gouvernant le comportement physique d'une ligne de transport électrique en régime alternatif. La puissance naturelle $P_{SIL} = U_n^2 / Z_c$ correspond au niveau de transit pour lequel la puissance réactive inductive absorbée par l'inductance série de la ligne est exactement égale à la puissance réactive capacitive fournie par ses capacités réparties. Lorsque la ligne transite une puissance inférieure à $P_{SIL}$ (situation typique en heures creuses nocturnes), elle se comporte comme un générateur net de puissance réactive, provoquant une montée de tension le long du couloir appelée effet Ferranti. À l'inverse, au-delà de $P_{SIL}$, la ligne absorbe du réactif et fait chuter la tension.`,
    concept_en: `Characteristic impedance (Wave Impedance $Z_c$) and Surge Impedance Loading (SIL) define the foundational electromagnetic boundary conditions governing steady-state AC transmission physics. Surge Impedance Loading ($P_{SIL} = U_n^2 / Z_c$) represents the exact power throughput where series inductive VAR absorption ($\omega L \cdot I^2$) perfectly balances shunt capacitive VAR generation ($\omega C \cdot V^2$). When power transfer drops below $P_{SIL}$ (typical during nocturnal off-peak hours), the line acts as a net reactive power source, causing receiving-end voltage rise termed the Ferranti Effect. Conversely, when transfers exceed $P_{SIL}$, the circuit behaves as an inductive sink, pulling voltage profiles downward.`,
    systems_fr: `Les équipements de contrôle du profil de tension et de compensation de puissance naturelle comprennent :
1. Faisceaux de conducteurs de phase (Bundled Conductors) : faisceaux bifilaires (ex. 2 × Aster 570 mm² à 225 kV) ou quadri-filaires à 400 kV qui augmentent le rayon équivalent géométrique du conducteur, augmentent la capacité linéique C', réduisent l'inductance série L', diminuent l'impédance caractéristique $Z_c$ et augmentent ainsi directement la puissance naturelle $P_{SIL}$.
2. Réactances shunt de compensation (Shunt Reactors) : bobines d'inductance triphasées à air ou immergées dans l'huile (10 à 40 Mvar) raccordées directement sur les barres 225 kV ou sur les tertiaires 15 kV des transformateurs pour absorber l'excédent de réactif et juguler l'effet Ferranti lors des régimes à vide ou faible charge.
3. Bancs de condensateurs série (Series Capacitors) : insérés en série sur les très longues lignes pour compenser artificiellement 30% à 50% de la réactance inductive de ligne ($X_L$), augmentant la limite de stabilité transitoire.
4. Systèmes FACTS (STATCOM / SVC) : compensateurs statiques rapides à base de convertisseurs IGBT injectant ou absorbant du réactif en continu en moins de 10 ms pour stabiliser la tension nodale.`,
    systems_en: `Voltage profile control and natural loading compensation hardware integrate:
1. Phase Conductor Bundling: multi-conductor bundles (twin Aster 570 mm² at 225 kV; quad-bundle at 400 kV) expanding geometric mean radius (GMR), increasing shunt capacitance C', reducing series loop inductance L', lowering characteristic wave impedance $Z_c$, and directly scaling surge impedance loading $P_{SIL}$.
2. High-Voltage Shunt Reactors: air-core or oil-immersed three-phase inductive reactors (10 to 40 Mvar) connected directly to 225 kV lines or transformer 15 kV delta tertiary windings to absorb surplus charging VARs and suppress Ferranti overvoltage.
3. Series Capacitor Banks: connected in series along lengthy bulk transmission corridors compensating 30% to 50% of inductive line reactance ($X_L$), dramatically enhancing transient transfer capability.
4. FACTS Devices (STATCOM / SVC): high-speed power electronic converters modulating reactive VAR exchange continuously within 10 ms to maintain precise nodal voltage setpoints.`,
    engineering_fr: `Formulations physiques et équations de calcul :
- Impédance caractéristique d'onde : $Z_c = \sqrt{L' / C'}$ ; pour une ligne aérienne 225 kV conventionnelle, $L' \approx 1.15\text{ mH/km}$ et $C' \approx 9.5\text{ nF/km}$, donnant $Z_c \approx 350\text{ à }380\ \Omega$.
- Puissance naturelle triphasée : $P_{SIL} = U_n^2 / Z_c = (225\text{ kV})^2 / 380\ \Omega \approx 133\text{ MW}$ par terne.
- Surtension due à l'effet Ferranti sur ligne à vide de longueur $\ell$ :
  $$U_2 = \\frac{U_1}{\\cos(\\beta \\cdot \\ell)} \\approx U_1 \\cdot \\left[ 1 + \\frac{1}{2} \\cdot \\omega^2 \\cdot L' \\cdot C' \\cdot \\ell^2 \\right]$$
  Pour une ligne 225 kV de 200 km (comme Nachtigal-Bafoussam) sans compensation, la surtension à vide atteint $+5.5\%$ à $+7.0\%$ ($U_2 \approx 241\text{ kV}$), approchant la limite de claquage des isolateurs.`,
    engineering_en: `Electromagnetic governing equations and sizing parameters:
- Characteristic wave impedance: $Z_c = \sqrt{L' / C'}$; for a standard 225 kV overhead transmission circuit, $L' \approx 1.15\text{ mH/km}$ and $C' \approx 9.5\text{ nF/km}$, yielding $Z_c \approx 350\text{ to }380\ \Omega$.
- Three-phase Surge Impedance Loading: $P_{SIL} = U_n^2 / Z_c = (225\text{ kV})^2 / 380\ \Omega \approx 133\text{ MW}$ per circuit.
- No-load Ferranti receiving-end overvoltage equation for line length $\ell$:
  $$U_2 = \\frac{U_1}{\\cos(\\beta \\cdot \\ell)} \\approx U_1 \\cdot \\left[ 1 + \\frac{1}{2} \\cdot \\omega^2 \\cdot L' \\cdot C' \\cdot \\ell^2 \\right]$$
  For an uncompensated 200 km 225 kV line (such as the Nachtigal-Bafoussam intertie), open-circuit voltage rises by $+5.5\%$ to $+7.0\%$ ($U_2 \approx 241\text{ kV}$), approaching continuous dielectric withstand boundaries.`,
    formulas: [FORMULAS[4], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Effet Ferranti & Réactances Shunt de la Ligne 225 kV Nachtigal - Bafoussam (205 km)',
      title_en: 'Ferranti Rise & Shunt Compensation on the 225 kV Nachtigal - Bafoussam Line (205 km)',
      plant_name: 'Ligne d\'Interconnexion 225 kV Nachtigal - Bafoussam (Corridor Centre - Ouest)',
      capacity_mw: 'Capacité de transit thermique : 280 MVA (Conducteurs Almélec Aster 570 mm²)',
      river_or_location: 'Traversée du Mbam vers les hauts plateaux de l\'Ouest (Bafoussam)',
      operators: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
      voltage_specs: '225 kV triphasé 50 Hz · P_SIL = 135 MW · Longueur 205 km',
      notes_fr: 'Lors de la mise sous tension à vide de la ligne 225 kV reliant Nachtigal à Bafoussam, la capacité linéique des 205 km de ligne génère plus de 25 Mvar capacitifs, provoquant une élévation de tension inadmissible à Bafoussam (> 242 kV). Pour neutraliser cet effet Ferranti, SONATREL a raccordé une réactance shunt de compensation de 20 Mvar au poste de Bafoussam, maintenant la tension à 1.01 Un.',
      notes_en: 'During initial no-load energization of the 205 km 225 kV line linking Nachtigal to Bafoussam, distributed capacitance generated over 25 Mvar of charging reactive power, inducing unacceptable Ferranti voltage rise at Bafoussam (> 242 kV). To counteract this phenomenon, SONATREL installed a 20 Mvar shunt compensation reactor at Bafoussam substation, locking receiving voltage at 1.01 Un.',
      status: 'verified',
      source: 'Étude d\'Ingénierie Système Évacuation Nachtigal SONATREL / EDF 2026'
    },
    international_case: {
      title_fr: 'Réseau 735 kV d\'Hydro-Québec (Compensation Shunt & Série Répartie) & RTE 400 kV',
      title_en: 'Hydro-Québec 735 kV Bulk Transmission (Distributed Shunt & Series Compensation)',
      location: 'Québec, Canada / France',
      capacity_mw: 'Lignes de plus de 1000 km transportant 35 000 MW de production nordique',
      key_features: 'Pionnier mondial du 735 kV : compensation shunt massive par réactances 330 Mvar et compensateurs statiques synchrones (SVC) de 300 Mvar pour juguler le Ferranti sur de gigantesques distances boréales.'
    }
  },

  'D04.01': {
    subdomain_code: 'D04.01',
    concept_fr: `Les postes électriques haute tension (HTB) constituent les nœuds fondamentaux du système de transport d'électricité. Ils assurent trois missions clés : l'interconnexion de plusieurs lignes de transport, la transformation des niveaux de tension (élévation à la production, abaissement pour la répartition et la distribution), et la coupure de sécurité lors des courts-circuits. Les deux grandes technologies d'appareillage sont les postes ouverts à isolement dans l'air (AIS - Air-Insulated Switchgear) et les postes blindés sous enveloppe métallique à isolation gazeuse SF6 (GIS - Gas-Insulated Switchgear).`,
    concept_en: `High-voltage substations form the pivotal nodes of electrical transmission architectures. They execute three fundamental missions: interconnecting multiple transmission lines, stepping voltage levels up or down (generator step-up, sub-transmission, and primary distribution), and isolating severe short-circuit faults via high-speed switchgear. The two predominant engineering technologies are Air-Insulated Switchgear (AIS) open yards and compact metal-enclosed SF6 Gas-Insulated Switchgear (GIS).`,
    systems_fr: `L'architecture d'un poste HTB 225 kV comprend :
1. Jeux de barres : configurations en simple jeu de barres, double jeu de barres avec disjoncteur de couplage, ou schéma à un disjoncteur et demi (1½ CB) assurant une disponibilité maximale sans coupure.
2. Appareillage de manœuvre et de coupure : disjoncteurs SF6 à autosoufflage (pouvoir de coupure 31.5 kA à 40 kA), sectionneurs à deux colonnes rotatives avec sectionneurs de terre rapides intégrés.
3. Réducteurs de mesure : transformateurs de courant (TC) multi-enroulements (classe mesure 0.2S et classe protection 5P20) et transformateurs de tension inductifs ou capacitifs (TT/TPC).
4. Bâtiment de commande : armoires de protection numérique IED, redresseurs chargeurs 110 V DC avec banc de batteries étanches plomb ou Ni-Cd pour la sécurité du déclenchement.`,
    systems_en: `A standard 225 kV transmission substation comprises:
1. Busbar topologies: single busbar, double busbar with bus-coupler bay, or breaker-and-a-half (1½ CB) schemes maximizing operational resilience.
2. Switching and interruption gear: self-blast SF6 gas circuit breakers (31.5 kA to 40 kA breaking capacity), two-column rotary disconnectors, and fast earthing switches.
3. Instrument transformers: multi-core current transformers (0.2S revenue metering core and 5P20 protection cores) and inductive/capacitive voltage transformers (CVT).
4. Substation control building: relay racks housing digital protection IEDs, redundant 110 V DC battery chargers with lead-acid or Ni-Cd banks powering trip coils.`,
    engineering_fr: `Contraintes d'ingénierie et de sécurité :
- Coordination de l'isolement selon CEI 60071-1 : tenue aux chocs de foudre BIL = 1050 kV crête à 225 kV, distances d'isolement dans l'air phase-phase (2200 mm) et phase-masse (1900 mm).
- Sécurité d'exploitation : verrouillage électromécanique et logique entre sectionneurs et disjoncteurs interdisant formellement l'ouverture d'un sectionneur en charge.
- Emprise au sol : un poste blindé GIS 225 kV (comme celui de Bekoko) occupe 10 fois moins de surface qu'un poste AIS conventionnel, éliminant les risques de pollution saline ou de corrosion industrielle.`,
    engineering_en: `Engineering criteria and safety standards:
- Insulation coordination per IEC 60071-1: lightning impulse withstand (BIL) = 1050 kV crest at 225 kV, air clearance phase-to-phase (2200 mm) and phase-to-ground (1900 mm).
- Operational interlocks: rigorous electrical and logical interlocks preventing disconnector operation under load current.
- Land footprint: a 225 kV GIS substation (such as Bekoko) requires 90% less land than an open-air AIS yard, offering immunity against atmospheric contamination and humidity.`,
    formulas: [FORMULAS[1], FORMULAS[2]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Poste d\'Interconnexion 225/90/30 kV de Bekoko (Boucle de Douala) & Mangombé',
      title_en: 'Bekoko 225/90/30 kV Substation (Douala Ring) & Mangombé Intertie',
      plant_name: 'Poste Stratégique de Bekoko (Entrée Ouest de Douala)',
      capacity_mw: 'Transformation installée : 2 × 100 MVA (225/90 kV) + 2 × 36 MVA (90/30 kV)',
      river_or_location: 'Bekoko, Région du Littoral (Nœud d\'interconnexion RIS / Ouest)',
      operators: 'SONATREL (Transport 225/90 kV) · Eneo (Départs distribution MT 30 kV)',
      voltage_specs: '225 kV HTB · 90 kV sous-transport · 30 kV distribution HTA',
      notes_fr: 'Le poste de Bekoko sécurise la boucle 225 kV entourant la ville de Douala. Il reçoit les lignes 225 kV venant de Mangombé et interconnecte les départs 90 kV vers Deido, Bassa et Bonabéri, tout en injectant directement sur le réseau MT 30 kV d\'Eneo.',
      notes_en: 'Bekoko substation anchors the 225 kV transmission ring encircling Douala. It terminates lines from Mangombé and delivers power to 90 kV substations (Deido, Bassa, Bonabéri) while feeding 30 kV distribution feeders directly into Eneo grid.',
      status: 'verified',
      source: 'Spécification technique SONATREL Projet de remise à niveau du réseau RIS 2026'
    },
    international_case: {
      title_fr: 'Poste blindé GIS 400 kV de Chamoson (Suisse) & Poste 500 kV El Oued (Algérie)',
      title_en: 'Chamoson 400 kV GIS Substation (Switzerland) & 500 kV El Oued Node (Algeria)',
      location: 'Europe / Afrique du Nord',
      capacity_mw: 'Transit nœud > 2500 MVA',
      key_features: 'Technologie compacte SF6, surveillance optique de densité de gaz et double jeu de barres tubulaires.'
    }
  },

  'D04.02': {
    subdomain_code: 'D04.02',
    concept_fr: `Les transformateurs de puissance et autotransformateurs constituent les ouvrages les plus stratégiques et les plus coûteux des nœuds du réseau de transport d'électricité. Ils assurent la conversion d'amplitude entre les échelons de tension : élévation à la production (11/225 kV), interconnexion de réseau (225/90 kV) et abaissement vers la distribution primaire (225/30 kV ou 90/30 kV). L'ingénierie des transformateurs de grande puissance englobe les circuits magnétiques à faibles pertes, l'isolation diélectrique huile-papier, la tenue électrodynamique aux courants de court-circuit et le réglage dynamique de tension sous charge par changeur de prises (OLTC).`,
    concept_en: `High-voltage power transformers and autotransformers represent the most capital-intensive and strategically critical assets in utility substations, bridging voltage tiers (generator step-up 11/225 kV, grid intertie 225/90 kV, and primary distribution step-down 225/30 kV or 90/30 kV). Transformer engineering integrates low-loss magnetic core design, oil-paper composite dielectric insulation systems, severe short-circuit electrodynamic withstand mechanics, and continuous closed-loop voltage regulation under load via On-Load Tap Changers (OLTC).`,
    systems_fr: `Un transformateur de puissance HTB 225/90 kV intègre :
1. Circuit magnétique triphasé à 3 ou 5 colonnes : tôles d'acier au silicium à grains orientés laminées à froid (M4 ou Hi-B laser) assemblées en gradins circulaires (Step-lap) pour minimiser les pertes fer ($P_0$) et le courant magnétisant.
2. Enroulements concentriques en cuivre électrolytique : enroulement primaire HTB en disques continus entrelacés résistant aux ondes de choc de foudre, enroulement secondaire MT en couches hélicoïdales ou galettes, et tertiaire de stabilisation en triangle (Delta) pour confiner les harmoniques de rang 3 et permettre la mise à la terre du neutre.
3. Diélectrique liquide et cuve : huile minérale naphténique inhibée ou ester synthétique biodégradable (classe d'isolation A 105°C), conservateur d'huile à membrane souple déformable éliminant l'oxydation de l'huile, et relais de protection Buchholz (ANSI 63) détectant les dégagements gazeux anormaux.
4. Régleur en charge (OLTC - On-Load Tap Changer) : changeur de prises sous vide à coupure ultra-rapide par résistance de transition (plage ±16% en 17 à 27 positions), piloté par régulateur numérique de tension automatique (AVR type Reinhausen).`,
    systems_en: `A 225/90 kV high-voltage power transformer incorporates:
1. Three- or five-limb magnetic core: cold-rolled grain-oriented silicon steel laminations (laser-scribed Hi-B grades) assembled with step-lap joints to minimize no-load hysteresis core losses ($P_0$) and magnetizing reactive inrush currents.
2. Concentric copper windings: continuous interleaved disk high-voltage windings engineered for non-linear lightning impulse voltage distribution, medium-voltage helical/layer windings, and a delta-connected stabilizing tertiary winding trapping 3rd harmonics and anchoring zero-sequence impedance.
3. Tank & Dielectric Fluid: inhibited naphthenic mineral oil or synthetic ester coolant, conservator vessel with rubber bladder air-cell eliminating moisture and atmospheric oxygen contamination, and Buchholz gas/oil surge relay (ANSI 63).
4. On-Load Tap Changer (OLTC): vacuum-interrupter high-speed diverter switch with transition resistors modulating turns ratios under full load across ±16% voltage envelopes (17 to 27 steps), directed by an automated digital AVR.`,
    engineering_fr: `Calculs et dimensionnement critique d'ingénierie selon CEI 60076 :
- Impédance de court-circuit assignée ($U_{cc}\%$) : dimensionnée typiquement entre 10% et 14% pour arbitrer entre la limitation des courants de court-circuit avals et la maîtrise de la chute de tension interne sous charge inductive :
  $$\\Delta U \\approx U_n \\cdot [u_r \\cdot \\cos\\varphi + u_x \\cdot \\sin\\varphi]$$
- Surveillance thermique du point chaud (Hot-Spot selon CEI 60076-7) : estimation en temps réel de la température du point le plus chaud des enroulements ($\theta_h = \theta_a + \Delta\theta_{or} + H \cdot g_r$), garantissant qu'elle ne dépasse jamais 98°C en régime continu et 120°C en surcharge d'urgence, avec facteur d'accélération de vieillissement $V = 2^{(\theta_h - 98) / 6}$.
- Régime de neutre et couplage vectoriel : couplage YNd11 (étoile avec neutre sorti à la terre côté HT, triangle MT déphasé de 330°), permettant la détection sélective des défauts à la terre par relais de terre restreinte 87N (REF).`,
    engineering_en: `Critical engineering design calculations per IEC 60076:
- Rated short-circuit impedance ($U_{cc}\%$): calibrated between 10% and 14% balancing downstream fault current restriction against internal inductive voltage drop:
  $$\\Delta U \\approx U_n \\cdot [u_r \\cdot \\cos\\varphi + u_x \\cdot \\sin\\varphi]$$
- Winding hot-spot thermal calculation (IEC 60076-7): real-time computation of hottest-spot temperature ($\theta_h = \theta_a + \Delta\theta_{or} + H \cdot g_r$), constrained below 98°C continuous (120°C emergency overload), governing relative aging rate $V = 2^{(\theta_h - 98) / 6}$.
- Neutral grounding & vector grouping: YNd11 configuration with grounded HV neutral anchoring zero-sequence networks and enabling high-sensitivity Restricted Earth Fault (ANSI 87N REF) differential protection.`,
    formulas: [FORMULAS[2], FORMULAS[1]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[1], ENGINEERING_ROLES[0]],
    cameroon_case: {
      title_fr: 'Autotransformateurs 225/90/15 kV 100 MVA des Postes de Bekoko (Douala) & Nomayos (Yaoundé)',
      title_en: '100 MVA 225/90/15 kV Autotransformers at Bekoko (Douala) & Nomayos (Yaoundé) Substations',
      plant_name: 'Postes Stratégiques 225/90 kV de Bekoko, Nomayos, Mangombé et Oyomabang',
      capacity_mw: 'Puissance unitaire installée : 100 MVA (ONAN/ONAF) · 4 autotransformateurs stratégiques',
      river_or_location: 'Carrefours d\'interconnexion du Réseau Interconnecté Sud (RIS)',
      operators: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
      voltage_specs: '225 kV HTB / 90 kV sous-transport / 15 kV tertiaire régleur · Régleurs MR Reinhausen',
      notes_fr: 'Ces autotransformateurs de 100 MVA assurent la passerelle énergétique entre la dorsale 225 kV et le réseau de répartition 90 kV ceinturant les métropoles de Douala et Yaoundé. Équipés de changeurs de prises en charge sous vide MR Reinhausen et de systèmes de déshydratation d\'air à gel de silice avec régénération automatique, ils font l\'objet d\'analyses de gaz dissous (DGA) semestrielles pour anticiper les échauffements internes.',
      notes_en: 'These 100 MVA autotransformer banks provide the bulk power link between the 225 kV transmission backbone and the 90 kV sub-transmission rings supplying Douala and Yaoundé. Fitted with vacuum OLTCs from Maschinenfabrik Reinhausen and automated breathers, they undergo rigorous semi-annual DGA chromatography tracking internal thermal stresses.',
      status: 'verified',
      source: 'Spécification Technique Transformateurs HTB SONATREL & Eneo Direction Transport 2026'
    },
    international_case: {
      title_fr: 'Transformateurs 400/225 kV 600 MVA du Réseau de Grand Transport RTE (France)',
      title_en: 'RTE French Transmission 600 MVA 400/225 kV Grid Autotransformers',
      location: 'France (Postes 400 kV de Tavel, Plessis-Gassot, Genissiat)',
      capacity_mw: 'Unité de 600 MVA triphasée avec régleur en charge sous vide',
      key_features: 'Surveillance en ligne DGA multiaz optique, transformateurs à très faible niveau sonore (< 65 dB) et traversées condensatrices RIP sans huile.'
    }
  },

  'D04.03': {
    subdomain_code: 'D04.03',
    concept_fr: `L'appareillage de coupure et de sectionnement haute tension (disjoncteurs, sectionneurs de ligne et sectionneurs de terre) a pour rôle exclusif de manœuvrer les circuits électriques en conditions normales d'exploitation et d'interrompre instantanément les courants de court-circuit destructeurs (jusqu'à 31.5 kA ou 40 kA sous 225 kV) en moins de 50 à 60 millisecondes. Les disjoncteurs constituent les organes ultimes de sauvegarde du réseau : ils doivent souffler l'arc électrique plasma qui s'amorce entre les contacts lors de l'ouverture et résister à la tension transitoire de rétablissement (TTR / TRV) qui réapparaît brutalement aux bornes.`,
    concept_en: `High-voltage switching and interrupting switchgear (circuit breakers, line disconnectors, and high-speed earthing switches) fulfills the exclusive operational role of safely reconfiguring grid power corridors under load and interrupting catastrophic short-circuit fault currents (up to 31.5 kA or 40 kA at 225 kV) within 50 to 60 milliseconds. High-voltage circuit breakers represent the ultimate grid defense actuators: they extinguish high-temperature thermal arc plasmas struck between parting contacts and withstand extreme Transient Recovery Voltages (TRV) appearing across their open gap.`,
    systems_fr: `Les organes de manœuvre et de coupure d'une travée 225 kV comprennent :
1. Disjoncteur haute tension à hexafluorure de soufre (SF6) à autosoufflage thermique : chambre de coupure sous pression de SF6 (0.5 à 0.6 MPa) associant effet thermique de l'arc et compression mécanique pour injecter un souffle gazeux supersonique au passage à zéro du courant alternatif 50 Hz.
2. Commande cinématique à ressorts ou oléopneumatique : mécanisme à ressorts préchargés par moteur électrique ou vérin hydraulique stockant l'énergie mécanique indispensable pour ouvrir les contacts à des vitesses de 6 à 9 m/s avec un cycle de manœuvre normalisé O - 0.3s - CO - 3min - CO.
3. Sectionneurs de ligne et de jeu de barres : sectionneurs rotatifs à deux ou trois colonnes d'isolateurs (Two-Column Rotary Disconnectors) ou pantographes verticaux créant une coupure visible à l'air libre d'au moins 2.20 m à 225 kV pour garantir la sécurité absolue des monteurs lors des consignations d'ouvrages.
4. Sectionneurs de mise à la terre rapides (Earthing Switches) : avec pouvoir de fermeture sur court-circuit assigné de 31.5 kA (selon CEI 62271-102), éliminant les charges électrostatiques résiduelles et protégeant contre toute remise sous tension intempestive.`,
    systems_en: `Switching and isolation devices across a 225 kV transmission bay incorporate:
1. Self-blast SF6 gas circuit breaker: arcing chamber pressurized at 0.5 to 0.6 MPa utilizing arc thermal expansion energy coupled with mechanical puffer assist to blast supersonic dielectric gas across the contact nozzle right at 50 Hz AC current zero.
2. Spring or electro-hydraulic operating mechanism: spring charging motor or high-pressure hydraulic accumulator storing stored mechanical energy driving contact parting velocities of 6 to 9 m/s, certified for IEC standard operating sequences O - 0.3s - CO - 3min - CO.
3. Line and busbar disconnectors: two-column or three-column rotary disconnectors or vertical semi-pantographs providing visible open-air clearance (> 2.20 m at 225 kV) certifying personnel isolation prior to work access permits.
4. High-speed make-proof earthing switches: certified for 31.5 kA short-circuit making duty (IEC 62271-102), discharging trapped electrostatic charges and protecting crews against accidental re-energization.`,
    engineering_fr: `Prescriptions de coupure et critères de sécurité CEI 62271-100 :
- Pouvoir de coupure en court-circuit ($I_{sc}$) : 31.5 kA efficace symétrique avec composante apériodique continue (DC component) $i_{dc} = \\sqrt{2} \\cdot I_{sc} \\cdot e^{-t / \\tau}$ (où la constante de temps réseau $\\tau = X / (\\omega R) \\approx 45\\text{ ms}$).
- Tenue à la Tension Transitoire de Rétablissement (TTR / TRV) : gabarit à 4 paramètres (uc, t1, u1, td) avec vitesse de montée $du/dt$ pouvant atteindre 2.0 à 3.0 kV/μs sur défaut proche en ligne (Short Line Fault - SLF).
- Verrouillages de sécurité obligatoires (Interlocking) : asservissement électromécanique et logique (contacts auxiliaires et trames GOOSE) interdisant formellement la fermeture ou l'ouverture d'un sectionneur lorsque le disjoncteur associé est fermé ou traverse un courant résiduel.`,
    engineering_en: `Interruption specifications and safety constraints per IEC 62271-100:
- Rated short-circuit breaking capacity ($I_{sc}$): 31.5 kA symmetrical RMS with decaying DC offset component $i_{dc} = \\sqrt{2} \\cdot I_{sc} \\cdot e^{-t / \\tau}$ (substation network time constant $\\tau = X / (\\omega R) \\approx 45\\text{ ms}$).
- Transient Recovery Voltage (TRV) envelope: 4-parameter standardized curve (uc, t1, u1, td) with rate-of-rise of recovery voltage (RRRV) reaching 2.0 to 3.0 kV/μs during severe Short Line Faults (SLF).
- Mandatory safety interlocking: hardware electrical key interlocks and peer-to-peer GOOSE logic preventing disconnector switching unless the accompanying breaker is verified fully open.`,
    formulas: [FORMULAS[1], FORMULAS[0]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[1], ENGINEERING_ROLES[0]],
    cameroon_case: {
      title_fr: 'Disjoncteurs SF6 225 kV 31.5 kA des Postes de Nomayos & Bekoko (SONATREL)',
      title_en: '225 kV 31.5 kA SF6 Circuit Breakers at Nomayos & Bekoko Substations (SONATREL)',
      plant_name: 'Postes d\'Évacuation et d\'Interconnexion 225 kV de Nomayos, Bekoko et Mangombé',
      capacity_mw: 'Pouvoir de coupure assigné : 31.5 kA (12 000 MVA de puissance de court-circuit à 225 kV)',
      river_or_location: 'Littoral et Centre, Cameroun',
      operators: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
      voltage_specs: '225 kV HTB · Tension de tenue au choc BIL = 1050 kV · Déclenchement en 50 ms',
      notes_fr: 'Les disjoncteurs 225 kV installés par SONATREL à Nomayos et Bekoko (Alstom/GE type GL314) sont équipés de doubles bobines de déclenchement alimentées par deux circuits 110 V DC séparés avec relais de surveillance continue de filerie 74TC. Des résistances d\'enclenchement de 400 Ω sont intégrées sur les disjoncteurs de ligne pour limiter les surtensions de manœuvre lors de la mise sous tension des longues lignes à vide.',
      notes_en: 'The 225 kV breakers deployed by SONATREL at Nomayos and Bekoko (Alstom/GE GL314 type) integrate dual trip coils energized from segregated 110 V DC battery banks monitored by continuous 74TC trip-circuit supervisory relays. Pre-insertion closing resistors (400 Ω) attenuate switching overvoltage surges during line energization.',
      status: 'verified',
      source: 'Spécifications Techniques Appareillage HTB SONATREL & Guides d\'Exploitation 2026'
    },
    international_case: {
      title_fr: 'Disjoncteurs HTB Sans SF6 "Blue GIS" Siemens & GE g3 (145 kV / 245 kV, Europe)',
      title_en: 'Clean Air Vacuum & g3 Alternative Gas Circuit Breakers (Siemens & GE Europe)',
      location: 'Allemagne / France / Royaume-Uni',
      capacity_mw: 'Postes de transport 145 kV et 245 kV',
      key_features: 'Remplacement total du gaz à effet de serre SF6 (GWP = 23 500) par de l\'air pur synthétique comprimé (GWP = 0) ou des mélanges fluoronitrile g3 (réduction de 99% de l\'empreinte carbone).'
    }
  },

  'D05.01': {
    subdomain_code: 'D05.01',
    concept_fr: `Les réseaux de distribution moyenne tension (HTA) acheminent l'électricité depuis les postes sources de transport vers les centres de consommation urbains, ruraux et industriels. Au Cameroun, la tension standard de distribution HTA est de 30 kV (contrairement au standard français de 20 kV), ce qui permet d'alimenter des zones plus étendues avec des chutes de tension relatives plus faibles. La topologie prédominante est le réseau radial en arborescence ou en boucle ouverte, exploité avec des disjoncteurs réenclencheurs et des interrupteurs aériens télécommandés.`,
    concept_en: `Medium-voltage (MV) distribution networks channel electrical energy from bulk transmission bulk substations to municipal, rural, and industrial loads. In Cameroon, the official utility medium voltage is standardized at 30 kV (unlike the 20 kV standard used in parts of Europe), enabling longer feeder corridors with reduced percentage voltage drops across extensive rural territories. Feeders operate predominantly in radial or normally-open loop topologies equipped with automatic reclosers and sectionalizers.`,
    systems_fr: `Un réseau de distribution 30 kV intègre :
1. Départs postes sources 30 kV : cellules d'arrivée et départs sous enveloppe métallique protégées par disjoncteurs à coupure dans le vide ou SF6 (In = 630 A, Icc = 16 kA).
2. Lignes aériennes MT : conducteurs nus en alliage d'aluminium Almélec posés sur poteaux béton armé ou bois traité, avec isolateurs rigides en verre ou composites.
3. Câbles souterrains MT : liaisons urbaines en câbles unipolaires à isolation synthétique réticulée (XLPE) 18/30 (36) kV avec gaine extérieure étanche.
4. Appareillage de coupure en réseau : disjoncteurs réenclencheurs automatiques (Reclosers) en coupure sous vide et Interrupteurs Aériens Télécommandés (IAT).`,
    systems_en: `A 30 kV distribution network deploys:
1. Primary substation 30 kV feeder bays: metal-enclosed switchgear cubicles housing vacuum or SF6 circuit breakers (630 A nominal, 16 kA breaking capacity).
2. Overhead distribution lines: bare Almelec AAAC alloy conductors mounted on spun concrete or treated timber poles with porcelain or composite line-post insulators.
3. Underground MV cables: single-core XLPE insulated 18/30 (36) kV cables engineered for heavy urban power density.
4. In-line distribution switchgear: pole-mounted vacuum auto-reclosers, remote motorized air-break sectionalizers (IAT), and smart fault indicators.`,
    engineering_fr: `Règles de dimensionnement électrique :
- Chute de tension maximale admissible selon guide Eneo : 5% sur les départs MT en pointe (ΔU < 1500 V sur réseau 30 kV).
- Régime de neutre 30 kV : neutre mis à la terre par résistance de limitation de neutre (NER) limitant le courant de court-circuit phase-terre à 300 A pendant 10 secondes pour protéger le matériel.
- Plan de protection : protections à maximum de courant à temps indépendant (50) et dépendant (51) coordonnées chronométriquement avec les réenclencheurs de ligne et fusibles des transformateurs H61.`,
    engineering_en: `Electrical design criteria and standards:
- Permissible voltage drop per utility guidelines: maximum 5% along MV feeder trunks at peak load (ΔU < 1500 V at 30 kV).
- 30 kV neutral earthing philosophy: neutral grounded through neutral earthing resistor (NER) clamping single line-to-ground faults to 300 A for 10 seconds.
- Protection grading: definite-time instantaneous (50) and inverse-time (51) overcurrent curves time-graded with line reclosers, feeder relays, and downstream MV fuses.`,
    formulas: [FORMULAS[6], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[2]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Réseau de Distribution 30 kV Eneo de Yaoundé (Postes Oyomabang, BRGM & Ngousso)',
      title_en: 'Eneo 30 kV Distribution Feeder Grid in Yaoundé (Oyomabang, BRGM & Ngousso)',
      plant_name: 'Réseau HTA 30 kV Région de Yaoundé',
      capacity_mw: 'Charge de pointe urbaine : ~280 MW',
      river_or_location: 'Yaoundé et périphérie (Obala, Mbalmayo, Soa)',
      operators: 'Eneo Cameroun (Distribution d\'électricité)',
      voltage_specs: '30 kV Moyenne Tension (HTA) · 400 V / 230 V Basse Tension (BT)',
      notes_fr: 'Le réseau de Yaoundé est alimenté par les grands postes sources de Kondengui, Oyomabang et Ngousso. Eneo déploie des réenclencheurs automatiques télécommandés sur les longs départs mixtes urbain/rural (ex. départ Obala 30 kV) pour isoler automatiquement les défauts dus à la végétation.',
      notes_en: 'Yaoundé urban distribution is fed from Kondengui, Oyomabang and Ngousso primary substations. Eneo deploys smart auto-reclosers along long semi-rural corridors (e.g. Obala 30 kV feeder) to automatically isolate tree-contact faults and restore supply.',
      status: 'verified',
      source: 'Données techniques Direction de la Distribution Eneo Cameroun 2026'
    },
    international_case: {
      title_fr: 'Réseaux de distribution intelligents Enedis 20 kV (France) & Smart Grid ESKOM (Afrique du Sud)',
      title_en: 'Enedis 20 kV Automated MV Grid (France) & ESKOM Distribution Automation (South Africa)',
      location: 'France / Afrique du Sud',
      capacity_mw: 'Centaines de départs bouclés automatisés',
      key_features: 'Automates FDIR rétablissant le service en moins d\'une minute, comptage communicant généralisé.'
    }
  },

  'D05.02': {
    subdomain_code: 'D05.02',
    concept_fr: `Les postes de transformation moyenne tension / basse tension (HTA/BT) constituent le maillon ultime de la chaîne de distribution publique et privée où la moyenne tension (30 kV au Cameroun) est abaissée à la tension d'utilisation 400 V triphasé / 230 V monophasé 50 Hz. Selon la densité de charge et la typologie géographique, ils se déclinent en deux familles normalisées majeures : les postes sur poteau aériens H61 (50 kVA à 160 kVA) pour l'électrification rurale et périurbaine, et les postes kiosques compacts préfabriqués ou cabines maçonnées en boucle coupure d'artère (250 kVA à 1250 kVA) équipés de tableaux HTA sous enveloppe métallique RMU (Ring Main Unit).`,
    concept_en: `Medium-to-Low Voltage (MV/LV) distribution substations represent the terminal transformation nodes converting distribution primary voltage (30 kV in Cameroon) into utilization low voltage (400 V three-phase / 230 V single-phase 50 Hz). Governed by load density and geographic topology, they divide into two standardized equipment families: pole-mounted H61 aerial substations (50 kVA to 160 kVA) serving rural and suburban feeders, and compact pad-mounted prefabricated kiosks or indoor brick walk-in substations (250 kVA to 1250 kVA) operating on Ring Main Unit (RMU) loop architectures.`,
    systems_fr: `Les composants électromécaniques d'un poste HTA/BT comprennent :
1. Tableau HTA sous enveloppe métallique RMU (Ring Main Unit selon CEI 62271-200) : tableau compact sous gaz SF6 ou air pur, comprenant généralement 2 fonctions interrupteurs-sectionneurs de boucle (630 A, tenue 16 kA 1s) et 1 fonction combiné interrupteur-fusibles ou disjoncteur avec relais autonome de protection transformateur.
2. Transformateur de distribution HTA/BT : transformateur triphasé immergé dans l'huile minérale ou ester végétal (ou transformateur sec enrobé de résine époxy pour les ERP et sous-sols), couplage Dyn11, pertes réduites (conforme écoconception Tier 2 / CEI 60076-19), avec galets de roulement et bac de rétention d'huile étanche anti-pollution.
3. Tableau de distribution Basse Tension (TUR / TIPI) : tableau urbain réduit ou tableau d'interface de distribution comprenant un interrupteur général d'arrivée 400 V, un jeu de barres cuivre et 4 à 8 départs protégés par fusibles HRC couteaux taille NH00/NH1/NH2 ou disjoncteurs compacts boîtier moulé (MCCB).
4. Prises de terre distinctes ou interconnectées : prise de terre des masses HTA/BT ($R_M$) et prise de terre du neutre BT ($R_N$) séparées d'au moins 8 mètres en schéma TT pour éviter la remontée de potentiel de terre lors d'un défaut HTA interne.`,
    systems_en: `MV/LV distribution substation electromechanical systems encompass:
1. Metal-enclosed Ring Main Unit (RMU per IEC 62271-200): compact gas- or air-insulated switchboard featuring 2 loop-feeder load-break switches (630 A, 16 kA 1s withstand) and 1 fused load-break switch or circuit breaker bay with self-powered relay protecting the transformer.
2. MV/LV Distribution Transformer: three-phase mineral oil or ester immersed transformer (or cast-resin dry-type for enclosed commercial basements), Dyn11 vector group, Tier-2 Ecodesign low-loss core (IEC 60076-19), equipped with bi-directional rollers and 100% bund oil retention catch basins.
3. Low Voltage Distribution Panel (TUR / TIPI): modular LV board housing incoming 400 V disconnector, copper busbars, and 4 to 8 outgoing feeder ways protected by high-rupture-capacity (HRC) blade fuses (sizes NH00/NH1/NH2) or molded-case circuit breakers (MCCB).
4. Substation Earthing Topology: dedicated substation frame earthing ($R_M$) and LV neutral earthing ($R_N$) physically segregated by > 8 meters under TT earthing systems preventing high-voltage fault GPR transfer onto customer neutral terminals.`,
    engineering_fr: `Calculs et dimensionnement critique d'ingénierie :
- Coordination fusible HTA - transformateur : choix du calibre du fusible selon CEI 60282-1 (ex. fusible 30 kV 16 A pour transformateur 250 kVA ; 31.5 A pour 400 kVA ; 40 A pour 630 kVA) garantissant la fusion en moins de 100 ms sur défaut interne au secondaire sans fusionner sur le courant d'enclenchement magnétisant inrush ($10\text{ à }12\ I_n$ pendant 100 ms).
- Chute de tension sous charge au secondaire du transformateur :
  $$\\Delta U\% = \\frac{S}{S_n} \\cdot [u_r \\cdot \\cos\\varphi + u_x \\cdot \\sin\\varphi] + \\frac{1}{200} \\cdot \\left( \\frac{S}{S_n} \\cdot [u_r \\cdot \\sin\\varphi - u_x \\cdot \\cos\\varphi] \\right)^2$$
- Bilan thermique et ventilation naturelle du kiosque (CEI 62271-202) : dimensionnement des ouïes de ventilation haute et basse (surface d'aération $S = 0.18 \\cdot P / \\sqrt{H}$) pour limiter l'échauffement ambiant interne à moins de 15°C au-dessus de la température extérieure tropicale (40°C).`,
    engineering_en: `Critical engineering design calculations and rules:
- MV Fuse-to-Transformer Coordination: fuse link rating selection per IEC 60282-1 (e.g. 30 kV 16 A for 250 kVA; 31.5 A for 400 kVA; 40 A for 630 kVA) ensuring fault clearance within 100 ms during secondary terminal short-circuits while withstanding inrush magnetization transients ($10\text{ to }12\ I_n$ for 100 ms).
- Transformer secondary voltage regulation under load:
  $$\\Delta U\% = \\frac{S}{S_n} \\cdot [u_r \\cdot \\cos\\varphi + u_x \\cdot \\sin\\varphi] + \\frac{1}{200} \\cdot \\left( \\frac{S}{S_n} \\cdot [u_r \\cdot \\sin\\varphi - u_x \\cdot \\cos\\varphi] \\right)^2$$
- Prefabricated Kiosk Natural Ventilation (IEC 62271-202): sizing lower inlet and upper outlet thermal louvers ($S = 0.18 \\cdot P / \\sqrt{H}$) restricting internal ambient temperature rise to < 15°C above tropical ambient ceilings (40°C).`,
    formulas: [FORMULAS[2], FORMULAS[6]],
    standards: [STANDARDS[2], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Parc de Plus de 12 000 Postes H61 30 kV & Kiosques Préfabriqués d\'Eneo (Douala & Yaoundé)',
      title_en: 'Eneo Fleet of > 12,000 30 kV H61 Pole & Prefabricated Pad-Mounted Substations (Cameroon)',
      plant_name: 'Postes de Distribution Publique HTA/BT des Réseaux Urbains de Douala, Yaoundé et Bafoussam',
      capacity_mw: 'Parc de distribution : plus de 12 000 transformateurs 30 kV / 400 V représentant ~1800 MVA installés',
      river_or_location: 'Territoire national (Réseaux urbains et ruraux d\'Eneo Cameroun)',
      operators: 'Eneo Cameroun (Direction de la Distribution Électrique)',
      voltage_specs: '30 kV HTA / 400 V triphasé - 230 V monophasé 50 Hz · Schéma TT',
      notes_fr: 'Dans le cadre du plan de redressement du réseau de distribution d\'Eneo, les postes cabines vétustes des centres-villes de Douala (Akwa, Bonanjo) et Yaoundé (Centre commercial, Bastos) ont été modernisés par des postes kiosques compacts Ring Main Unit (RMU Schneider RM6 30 kV). Ces équipements étanches IP67 sous enveloppe inox sont totalement protégés contre les inondations récurrentes lors de la saison des pluies à Douala.',
      notes_en: 'Under Eneo\'s network modernization drive, aging masonry substations in commercial downtown Douala (Akwa, Bonanjo) and Yaoundé (Bastos) were replaced by compact pad-mounted Ring Main Units (Schneider RM6 30 kV). These stainless-steel sealed IP67 units provide full immunity against tropical flood inundations during Douala torrential rainy seasons.',
      status: 'verified',
      source: 'Plan Directeur de Distribution Eneo Cameroun & Direction Technique Matériel 2026'
    },
    international_case: {
      title_fr: 'Poste Kiosque Connecté Bas Carbone Enedis (France) & Smart Kiosks Iberdrola (Espagne)',
      title_en: 'Enedis Connected Low-Carbon Smart Substation & Iberdrola Automated Kiosks',
      location: 'France / Espagne',
      capacity_mw: 'Postes urbains 630 kVA et 1000 kVA',
      key_features: 'Tableaux HTA sans SF6 à coupure dans le vide et air pur, transformateurs à huile végétale biodégradable et détection automatique de court-circuit communicante 4G/GPRS.'
    }
  },

  'D05.03': {
    subdomain_code: 'D05.03',
    concept_fr: `L'automatisation des réseaux de distribution moyenne tension (Feeder Automation / Distribution Automation) a pour objectif fondamental de réduire drastiquement la fréquence et la durée des coupures d'électricité subies par les usagers (indices de continuité de service SAIDI et SAIFI). En intégrant des disjoncteurs réenclencheurs automatiques aériens (Auto-Reclosers), des interrupteurs aériens télécommandés (IAT), des détecteurs de défauts communicants et des algorithmes de localisation, d'isolement et de réalimentation automatique (FLISR / FDIR), le réseau de distribution passe d'une exploitation passive et manuelle à une boucle intelligente auto-cicatrisante (Self-Healing Grid).`,
    concept_en: `Distribution Feeder Automation (DA) minimizes the frequency and duration of customer power outages (SAIDI and SAIFI indices) through automated fault detection, isolation, and service restoration (FLISR). By deploying pole-mounted vacuum auto-reclosers, motorized remote-controlled air-break switches (IAT), smart directional faulted circuit indicators, and centralized ADMS algorithms, medium-voltage distribution evolves from slow manual field intervention into an automated self-healing power grid.`,
    systems_fr: `Une boucle de distribution automatisée comprend :
1. Disjoncteurs Réenclencheurs Automatiques Aériens (Auto-Reclosers selon CEI 62271-111) : disjoncteurs à coupure sous vide montés sur poteau avec mesure intégrée de courant et tension sur les 6 traversées, armoire de commande microprocesseur étanche avec modem 4G/GPRS sécurisé, et alimentation autonome par transformateur auxiliaire et batteries 24 V étanches.
2. Interrupteurs Aériens Télécommandés Motorisés (IAT) : interrupteurs-sectionneurs triphasés à coupure dans l'air ou SF6 (In = 400 A / 630 A), manœuvrables à distance depuis le dispatching de distribution (DMS) via protocole CEI 60870-5-104 ou DNP3.
3. Indicateurs de Passage de Défaut Communicants (IPD / FCI) : tores magnétiques clipsés sur les conducteurs aériens mesurant le champ magnétique pour détecter le passage d'un courant de défaut entre phases ou à la terre et clignoter en rouge tout en envoyant un SMS/télésignal au SCADA.
4. Système FLISR (Fault Location, Isolation, and Service Restoration) : logiciel d'automatisation intégré au système ADMS analysant les alarmes des réenclencheurs pour localiser le tronçon en défaut, ordonner l'ouverture des interrupteurs encadrants et refermer les disjoncteurs de boucle en moins de 60 secondes.`,
    systems_en: `An automated distribution feeder loop deploys:
1. Pole-Mounted Automatic Vacuum Circuit Reclosers (per IEC 62271-111): outdoor solid-dielectric vacuum interrupters with capacitive voltage sensors on all 6 bushings, microprocessor control cubicle with encrypted 4G/GPRS telemetry, and internal 24 V backup batteries recharged via auxiliary PT.
2. Motorized Remote-Controlled Air-Break Sectionalizers (IAT): 30 kV overhead pole switches (400 A / 630 A rating) telecommanded from the central Distribution Management System (DMS) via IEC 60870-5-104 or DNP3 over utility wireless APNs.
3. Communicating Faulted Circuit Indicators (FCI / IPD): current-clamped sensors monitoring electromagnetic phase fields, pinpointing phase-to-phase and earth faults, flashing ultra-bright LED beacons while transmitting telemetry alarms to SCADA.
4. FLISR (Fault Location, Isolation, and Service Restoration) Engine: automated ADMS logic parsing sequence of events, isolating faulty cable/line sections, and commanding loop-tie switches to backfeed healthy customers in under 60 seconds.`,
    engineering_fr: `Cycles de réenclenchement et coordination sélective :
- Cycle de fonctionnement normalisé d'un réenclencheur : plus de 80% des défauts sur lignes aériennes étant fugitifs (branches d'arbres, foudre, oiseaux), le réenclencheur exécute un cycle paramétrable :
  $$\\text{Déclenchement Instantané (Rapide)} \\to \\text{Temps mort 0.5s} \\to \\text{Réenclenchement 1} \\to \\text{Temporisé (Lent 2s)} \\to \\text{Temps mort 2s} \\to \\text{Réenclenchement 2} \\to \\text{Verrouillage (Lockout)}$$
- Stratégies de coordination : politique de sauvegarde de fusible (Fuse-Saving) où le réenclencheur déclenche en rapide avant que le fusible de dérivation ne fonde ; ou politique de sacrifice de fusible (Fuse-Blowing) pour éviter les coupures brèves répétées sur le tronc principal.
- Protection directionnelle de terre sensible (ANSI 67N / 67NC) : indispensable pour les défauts à la terre de haute impédance (ex. conducteur 30 kV tombé au sol sur sol latéritique sec), avec seuil de détection $I_0$ réglé dès 2 A et mesure de la tension homopolaire résiduelle $V_0$.`,
    engineering_en: `Reclosing Shot Cycles and Coordination Mechanics:
- Standardized Recloser Shot Sequence: because over 80% of overhead distribution faults are transient (vegetation brush, atmospheric lightning, birds), reclosers execute a multi-shot sequence:
  $$\\text{Instantaneous Trip (Fast)} \\to \\text{Dead Time 0.5s} \\to \\text{Reclose 1} \\to \\text{Time-Delayed (Slow 2s)} \\to \\text{Dead Time 2s} \\to \\text{Reclose 2} \\to \\text{Lockout}$$
- Feeder Coordination Policies: Fuse-Saving philosophy (fast recloser curve operates before branch expulsion fuses melt); or Fuse-Blowing philosophy (isolating lateral branches permanently without blinking main trunk consumers).
- Directional Sensitive Earth Fault Protection (ANSI 67N / 67NC): detects high-impedance ground faults (conductor dropped on dry lateritic soil), configuring zero-sequence current pickups down to 2 A paired with neutral displacement voltage $V_0$ polarizations.`,
    formulas: [FORMULAS[8], FORMULAS[6]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Déploiement de 150 Réenclencheurs Télécommandés sur les Départs HTA 30 kV Eneo',
      title_en: 'Deployment of 150 Automated Reclosers across Eneo 30 kV Medium Voltage Feeders',
      plant_name: 'Départs 30 kV Mixtes Urbain-Rural d\'Eneo (Départ Obala, Bafia, Mbanga, Loum)',
      capacity_mw: 'Supervision de plus de 1800 km de lignes aériennes 30 kV traversant des corridors forestiers denses',
      river_or_location: 'Régions du Littoral, Centre et Ouest, Cameroun',
      operators: 'Eneo Cameroun (Direction Distribution & Téléconduite Koumassi)',
      voltage_specs: '30 kV HTA triphasé · Réenclencheurs NOJA Power OSM38 & Schneider N-Series',
      notes_fr: 'Sur les longs départs 30 kV reliant Yaoundé à Obala et Bafia (longueurs dépassant 70 km à travers la forêt équatoriale), les chutes de branches et la foudre provoquaient des coupures générales quotidiennes. L\'installation de 4 réenclencheurs NOJA Power par départ a permis de sectionner les artères en tronçons autonomes, éliminant 75% des coupures sur le premier tronçon et ramenant le temps de rétablissement moyen de 4 heures à moins de 8 minutes.',
      notes_en: 'Along lengthy 30 kV feeders connecting Yaoundé to Obala and Bafia (> 70 km through dense rainforest), fallen tree limbs and lightning triggered daily whole-feeder outages. Installing 4 NOJA Power OSM38 reclosers per feeder segmented lines into autonomous zones, clearing 75% of transient faults automatically and reducing average repair response time from 4 hours to under 8 minutes.',
      status: 'verified',
      source: 'Rapport de Performance Exploitation Distribution Eneo Cameroun 2025-2026'
    },
    international_case: {
      title_fr: 'Réseau Auto-Cicatrisant Self-Healing Grid de Florida Power & Light (FPL, USA)',
      title_en: 'Florida Power & Light Automated Self-Healing Grid (Smart Reclosers & FLISR)',
      location: 'Floride, États-Unis',
      capacity_mw: 'Réseau de distribution de 5 millions de clients',
      key_features: 'Déploiement de plus de 80 000 organes automatisés et réenclencheurs intelligents rétablissant le service à plus de 90% des clients en moins de 60 secondes lors des ouragans tropicaux.'
    }
  },

  'D06.01': {
    subdomain_code: 'D06.01',
    concept_fr: `Les installations électriques et tableaux généraux basse tension (TGBT) constituent le cœur névralgique de la distribution d'énergie dans les bâtiments industriels, tertiaires et hospitaliers. Le TGBT reçoit l'énergie du transformateur de distribution HTA/BT (400 V triphasé) et la distribue vers les armoires divisionnaires tout en assurant la protection des personnes contre les contacts directs et indirects selon la norme CEI 60364 / NF C 15-100. Les enjeux majeurs incluent le choix du régime de neutre (TT, TN-S, TN-C, IT), la compensation d'énergie réactive et la tenue aux courants de court-circuit.`,
    concept_en: `Low-voltage (LV) electrical installations and Main Low-Voltage Switchboards (TGBT) form the critical power distribution nucleus for industrial factories, commercial towers, and hospitals. The main switchboard receives 400 V three-phase power from the step-down distribution transformer and distributes it across sub-panels while guaranteeing personnel safety against electric shock per IEC 60364 / NF C 15-100 standards. Core design decisions govern earthing system selection (TT, TN-S, TN-C, IT), power factor correction, and short-circuit withstand.`,
    systems_fr: `Un tableau général basse tension (TGBT) moderne comprend :
1. Disjoncteur d'arrivée principal : disjoncteur ouvert de puissance (ACB) débrochable, calibre 1600 A à 4000 A, pouvoir de coupure Icu de 50 kA à 100 kA, avec déclencheur électronique Micrologic/Ekip.
2. Jeu de barres principal en cuivre : dimensionné selon l'échauffement maximal et les contraintes électrodynamiques lors d'un court-circuit franc (Icw 1 seconde).
3. Formes de séparation interne (CEI 61439-2) : Forme 2b, 3b ou 4b isolant les jeux de barres, les unités fonctionnelles et les bornes de raccordement pour autoriser la maintenance sous tension en toute sécurité.
4. Gradins de compensation réactive : batterie de condensateurs automatique avec selfs anti-harmoniques accordées à 189 Hz (fréquence de désaccord 3.8) pour éviter la résonance avec les charges non linéaires.`,
    systems_en: `A state-of-the-art Main Low Voltage Switchboard comprises:
1. Incoming air circuit breaker (ACB): 3-pole or 4-pole withdrawable ACB (1600 A to 4000 A rating, breaking capacity 50 kA to 100 kA) with advanced micro-processor trip units.
2. Main copper busbar trunk: engineered to withstand peak short-circuit electrodynamic forces (Icw 1-second rating) and thermal rise limits.
3. Internal segregation forms (IEC 61439-2): Form 2b, 3b, or 4b physical barriers segregating busbars, functional breaker units, and cable termination compartments.
4. Automatic capacitor bank: detuned capacitor steps equipped with 189 Hz anti-harmonic reactors (tuning factor 7%) preventing dangerous resonance with non-linear loads.`,
    engineering_fr: `Calculs et dimensionnement critique :
- Bilan de puissance : puissance installée ΣPi, coefficient de foisonnement (ks) et coefficient d'utilisation (ku) pour déterminer la puissance souscrite et le calibre du transformateur.
- Courant de court-circuit présumé au TGBT : calcul selon la méthode des impédances (Icc = U20 / (√3 × Ztotal)), où Ztotal additionne l'impédance amont du réseau, du transformateur et des câbles de liaison.
- Protection contre les contacts indirects : en schéma TT, coupure automatique par dispositifs différentiels résiduels (DDR) avec condition Ra × IΔn ≤ 50 V.`,
    engineering_en: `Critical sizing and electrical calculations:
- Load demand analysis: total connected power ΣPi, diversity factor (ks), and utilization factor (ku) sizing transformer rating and busbar ampacity.
- Prospective short-circuit current at busbars: calculated via the impedance method (Icc = U20 / (√3 × Ztotal)), summing grid upstream, transformer, and cable impedances.
- Shock hazard protection: under TT earthing, automatic disconnection via residual current devices (RCD) satisfying the criterion Ra × IΔn ≤ 50 V.`,
    formulas: [FORMULAS[1], FORMULAS[6]],
    standards: [STANDARDS[2], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Installations Électriques TGBT des Brasseries du Cameroun (Usine de Bassa, Douala)',
      title_en: 'Industrial LV Main Switchboard (TGBT) at Boissons du Cameroun Bassa Brewery (Douala)',
      plant_name: 'Usine Brasseries du Cameroun (Zone Industrielle de Bassa)',
      capacity_mw: 'Puissance installée : 4 × 2000 kVA transformateurs 30 kV / 400 V',
      river_or_location: 'Zone Industrielle de Bassa, Douala',
      operators: 'Direction Technique Industrielle · Eneo (Raccordement 30 kV)',
      voltage_specs: '30 kV arrivée usine → 400 V / 230 V TGBT Forme 4b',
      notes_fr: 'Ce site agro-industriel majeur dispose d\'une distribution BT haute disponibilité en schéma TN-S avec inverseurs de sources automatiques couplés à des groupes électrogènes de secours de 2500 kVA et une batterie de condensateurs anti-harmoniques pour maintenir le cos φ > 0.95 et éviter les pénalités réactives Eneo.',
      notes_en: 'This major agro-industrial plant operates high-reliability TN-S distribution with automated bus-tie changeover switches connected to 2500 kVA backup diesel gensets and detuned capacitor banks maintaining power factor cos φ > 0.95.',
      status: 'verified',
      source: 'Étude d\'ingénierie électrique industrielle Douala 2026'
    },
    international_case: {
      title_fr: 'Distribution Basse Tension de Data Centers Tier IV (Equinix Paris & Ashburn USA)',
      title_en: 'Tier IV Data Center LV Power Architecture (Equinix & Digital Realty)',
      location: 'France / États-Unis',
      capacity_mw: 'Capacité TGBT > 30 MW',
      key_features: 'Architecture 2N redondante, TGBT Forme 4b avec surveillance thermique continue sans fil par capteurs SAW.'
    }
  },

  'D06.02': {
    subdomain_code: 'D06.02',
    concept_fr: `Les régimes de neutre ou schémas de liaison à la terre (SLT) en basse tension selon la norme internationale CEI 60364-4-41 et NF C 15-100 définissent la manière dont le point neutre de la source d'alimentation (transformateur MT/BT) et les masses métalliques des récepteurs électriques sont raccordés à la terre. Le choix du régime de neutre conditionne directement la sécurité des personnes contre les risques d'électrocution par contact indirect, la protection des biens contre les incendies d'origine électrique et la continuité d'alimentation des procédés industriels continus et des installations hospitalières critiques.`,
    concept_en: `Low-voltage earthing systems (System Earthing / SLT) governed by IEC 60364-4-41 and NF C 15-100 define the precise grounding topology linking the power source neutral point (MV/LV transformer) and exposed conductive parts of electrical equipment to earth. The selected earthing philosophy dictates human shock safety against indirect touch potentials, asset fire prevention from low-current ground arcing, and operational availability for mission-critical industrial manufacturing and healthcare operating facilities.`,
    systems_fr: `Les trois grands régimes de neutre normalisés comprennent :
1. Schéma TT (Neutre à la terre, Masses à la terre séparée) :
   - Neutre du transformateur relié à une prise de terre de source ($R_N$) ; masses métalliques reliées à une prise de terre des masses ($R_A$) distincte.
   - En cas de défaut d'isolement, le courant de défaut circule à travers les deux terres ($I_d = U_0 / (R_A + R_N)$), créant une tension de contact $U_c = R_A \\cdot I_d$ potentiellement mortelle (> 50 V).
   - Coupure automatique obligatoire au premier défaut par Dispositif Différentiel Résiduel (DDR) avec condition stricte : $R_A \\cdot I_{\\Delta n} \\le U_L$ (50 V en milieu sec, 25 V en milieu humide).
2. Schéma TN (Neutre à la terre, Masses reliées au Neutre) :
   - Décliné en TN-C (conducteur PEN combinant neutre et protection, réservé aux sections ≥ 10 mm² Cu) et TN-S (conducteurs neutre N et protection PE strictement séparés).
   - Tout défaut d'isolement se traduit par un court-circuit franc phase-neutre ($I_d = U_0 / Z_s$). L'élimination du défaut est assurée directement par les déclencheurs magnétothermiques des disjoncteurs classiques sans exiger de DDR, sous réserve que l'impédance de boucle satisfasse : $Z_s \\cdot I_a \\le U_0$.
3. Schéma IT (Neutre Isolé ou Impédant, Masses à la terre) :
   - Neutre totalement isolé de la terre ou relié par une impédance élevée ($Z_N = 1000\\text{ à }2000\\ \\Omega$), masses métalliques reliées à la terre.
   - Lors d'un premier défaut d'isolement, le courant est infinitésimal ($I_d \\approx$ quelques milliampères de courant capacitif des câbles) : la tension de contact est quasi-nulle, aucune coupure n'est requise et la continuité de service est totale.
   - Signalisation obligatoire du premier défaut par Contrôleur Permanent d'Isolement (CPI) et coupure automatique impérative au deuxième défaut selon les règles du schéma TN/TT.`,
    systems_en: `The three universal standardized earthing arrangements:
1. TT Earthing System (Neutral directly earthed, Frames earthed independently):
   - Transformer neutral bonded to source ground ($R_N$); load exposed conductive parts bonded to independent earth electrode ($R_A$).
   - A single insulation fault paths current across earth return electrodes ($I_d = U_0 / (R_A + R_N)$), inducing dangerous touch voltages $U_c = R_A \\cdot I_d$.
   - Automatic disconnection on first ground fault is legally mandatory via Residual Current Devices (RCDs) satisfying criterion $R_A \\cdot I_{\\Delta n} \\le U_L$ (50 V dry, 25 V damp).
2. TN Earthing System (Neutral directly earthed, Frames bonded to Neutral):
   - Configured as TN-C (combined PEN conductor, minimum 10 mm² Cu) or TN-S (segregated N and PE conductors).
   - A frame fault constitutes a direct line-to-neutral short-circuit ($I_d = U_0 / Z_s$). Fault clearance executes via standard thermal-magnetic circuit breakers without RCDs, provided fault loop impedance satisfies $Z_s \\cdot I_a \\le U_0$.
3. IT Earthing System (Neutral isolated or impedance-earthed, Frames earthed):
   - Transformer neutral isolated from earth or connected through 1000-2000 Ω impedance, exposed frames grounded.
   - First insulation breakdown yields harmless milliampere capacitive leakage currents ($I_d \approx$ few mA): contact potential remains negligible, zero breaker tripping occurs, and critical operations continue uninterrupted.
   - Continuous insulation supervision mandated via an Insulation Monitoring Device (IMD), with mandatory automatic disconnection upon an uncleared second fault occurring on a different phase.`,
    engineering_fr: `Calculs et dimensionnement critique des boucles de défaut :
- Calcul de l'impédance de boucle en schéma TN ($Z_s$) :
  $$Z_s = \\sqrt{ (R_t + R_{ph} + R_{pe})^2 + (X_t + X_{ph} + X_{pe})^2 }$$
- Longueur maximale protégée de câble ($L_{max}$) en schéma TN selon formule normalisée :
  $$L_{max} = \\frac{0.8 \\cdot U_0 \\cdot S_{ph}}{\\rho \\cdot (1 + m) \\cdot I_a}$$
  où $m = S_{ph} / S_{pe}$, $U_0 = 230\\text{ V}$, et $I_a$ est le courant de déclenchement magnétique instantané du disjoncteur (ex. $10 \\cdot I_n$ pour courbe C).
- Temps de coupure maximal admissible selon CEI 60364-4-41 Tableau 41.1 : $t \\le 0.4\\text{ s}$ sous 230 V en schéma TN et $t \\le 0.2\\text{ s}$ en schéma TT pour les circuits terminaux jusqu'à 63 A.`,
    engineering_en: `Fault loop calculations and regulatory compliance metrics:
- TN system fault loop impedance ($Z_s$):
  $$Z_s = \\sqrt{ (R_{transfo} + R_{ph} + R_{pe})^2 + (X_{transfo} + X_{ph} + X_{pe})^2 }$$
- Maximum protected cable circuit length ($L_{max}$) in TN systems:
  $$L_{max} = \\frac{0.8 \\cdot U_0 \\cdot S_{ph}}{\\rho \\cdot (1 + m) \\cdot I_a}$$
  where $m = S_{ph} / S_{pe}$, nominal voltage $U_0 = 230\\text{ V}$, and $I_a$ represents breaker instantaneous magnetic trip pickup current ($10 \\cdot I_n$ for Type C).
- Maximum permissible disconnection times per IEC 60364-4-41 Table 41.1: $t \\le 0.4\\text{ s}$ at 230 V in TN systems and $t \\le 0.2\\text{ s}$ in TT systems for final branch circuits rated up to 63 A.`,
    formulas: [FORMULAS[1], FORMULAS[6]],
    standards: [STANDARDS[2], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Régimes de Neutre TT (Distribution Eneo) & TN-S des Usines Agro-industrielles SOCAPALM / CDC',
      title_en: 'TT Utility Distribution & TN-S Industrial Earthing at SOCAPALM / CDC Plantations',
      plant_name: 'Installations Électriques Tertiaires Urbaines & Usines d\'Huile de Palme SOCAPALM (Mbongo & Dibombari)',
      capacity_mw: 'Installations industrielles autonomes de 2 × 2500 kVA (Transformateurs MT/BT privés)',
      river_or_location: 'Littoral et Sud-Ouest, Cameroun',
      operators: 'Eneo Cameroun (Distribution TT) · Directions Techniques SOCAPALM & CDC (TN-S industriel)',
      voltage_specs: '400 V triphasé / 230 V monophasé 50 Hz · Prises de terre mesurées à R < 5 Ω',
      notes_fr: 'Au Cameroun, la distribution publique basse tension d\'Eneo est exploitée en schéma TT avec obligation d\'installer des disjoncteurs différentiels 300 mA et 30 mA chez les usagers. Dans les complexes agro-industriels de SOCAPALM et CDC, les transformateurs privés 30 kV / 400 V sont configurés en schéma TN-S pour éliminer les déclenchements différentiels intempestifs sur les gros moteurs de presse à huile et ventilateurs industriels.',
      notes_en: 'In Cameroon, Eneo municipal low-voltage distribution operates under the TT earthing scheme, legally requiring 300 mA incoming and 30 mA branch residual current devices. In heavy agro-industrial mills operated by SOCAPALM and CDC, private 30 kV / 400 V transformers are configured in TN-S earthing to avert spurious RCD trips on heavy palm oil screw press motors.',
      status: 'verified',
      source: 'Règlement Technique de Distribution Électrique ARSEL Cameroun & Audits NF C 15-100 2026'
    },
    international_case: {
      title_fr: 'Schéma IT Médical des Blocs Opératoires selon CEI 60364-7-710 & Data Centers Tier IV',
      title_en: 'Medical IT Isolated Systems in Hospital Operating Rooms & Tier IV Data Centers',
      location: 'France / Suisse',
      capacity_mw: 'Transformateurs d\'isolement médicaux 10 kVA monophasés dédiés',
      key_features: 'Zéro déclenchement au premier défaut d\'isolement, transformateur d\'isolement galvanique médical avec écran électrostatique et contrôleur permanent d\'isolement (CPI) à détection d\'onde sub-harmonique.'
    }
  },

  'D06.03': {
    subdomain_code: 'D06.03',
    concept_fr: `Les entraînements électriques industriels basés sur les moteurs asynchrones triphasés à cage d'écureuil et les variateurs de fréquence (VFD / Inverters) représentent plus de 65% de la consommation totale d'électricité du secteur industriel. L'ingénierie moderne combine des machines tournantes à très haute efficacité énergétique (classes IE3 Premium et IE4 Super Premium selon CEI 60034-30-1) à des convertisseurs de fréquence statiques utilisant la modulation de largeur d'impulsion sinusoïdale (MLI / PWM) et le contrôle vectoriel de flux sans capteur (Sensorless FOC) pour adapter exactement le débit mécanique à la charge tout en réduisant la facture d'énergie de 30% à 50%.`,
    concept_en: `Industrial electric motor drive systems powered by three-phase squirrel-cage induction motors and Variable Frequency Drives (VFD) consume over 65% of global industrial electrical power. Modern drive engineering pairs ultra-high-efficiency rotating machines (IE3 Premium and IE4 Super Premium per IEC 60034-30-1) with solid-state PWM inverters executing sensorless Field-Oriented Vector Control (FOC) or Direct Torque Control (DTC), dynamically tailoring electromechanical output to process demand while slashing energy consumption by 30% to 50%.`,
    systems_fr: `Une chaîne d'entraînement industriel moderne intègre :
1. Moteur asynchrone triphasé à cage : bobinage en fil de cuivre émaillé classe H (180°C), carcasse fonte à ailettes de refroidissement (TEFC / IC411), sondes thermiques PT100 insérées au cœur des encoches statoriques, et roulements isolés électriquement (bagues céramiques) pour éliminer les courants de palier destructeurs induits par la haute fréquence de commutation.
2. Variateur de fréquence (VFD) : étage redresseur à diodes 6 ou 12 impulsions, bus continu intermédiaire filtré par self et condensateurs électrolytiques (560 à 650 V DC), et pont onduleur à 6 transistors IGBT commandés par processeur DSP à fréquence de découpage de 2 à 8 kHz.
3. Filtres de sortie moteur : selfs de lissage de front de tension ($dU/dt$) limitant la vitesse de montée à moins de 500 V/μs ou filtres sinus éliminant totalement la composante haute fréquence pour autoriser des longueurs de câble moteur supérieures à 150 mètres sans risque de claquage par onde réfléchie.
4. Tableau de commande moteur (MCC / CCM) : armoire de distribution Forme 4b à tiroirs débrochables intégrant disjoncteur moteur magnétothermique, contacteur à vide, relais électronique de protection moteur (ANSI 49, 51, 46, 50G) et passerelle de communication Profinet ou Modbus TCP.`,
    systems_en: `An advanced industrial motor drive package incorporates:
1. Three-phase squirrel-cage induction motor: Class H insulated copper stator windings (180°C thermal limit), heavy-duty cast-iron rib-cooled enclosure (TEFC / IC411), embedded PT100 RTD thermal slot sensors, and electrically insulated bearings (ceramic hybrid balls) mitigating EDM shaft voltage bearing fluting damage caused by high-speed PWM common-mode currents.
2. Variable Frequency Drive (VFD): 6- or 12-pulse diode input rectifier, LC smoothed DC link (560 to 650 V DC), and 6-switch IGBT inverter bridge governed by floating-point DSP algorithms operating at 2 to 8 kHz carrier frequencies.
3. Output Motor Filters: series dV/dt choke reactors suppressing voltage slew rates below 500 V/μs or full LC sinusoidal output filters eliminating high-frequency switching edges, allowing motor feeder runs exceeding 150 meters without reflective wave voltage doubling punctures.
4. Motor Control Center (MCC): fully compartmentalized Form-4b switchboard with withdrawable cubicle buckets housing motor circuit breakers, vacuum contactors, microprocessor motor management relays (ANSI 49, 51, 46, 50G), and Profinet/EtherNet/IP network gateways.`,
    engineering_fr: `Calculs et dimensionnement électromécanique :
- Couple utile sur l'arbre et vitesse angulaire :
  $$C_n = \\frac{P_{mech}}{\\Omega} = \\frac{P_{kW} \\cdot 9550}{n_{tr/min}} \\quad \\text{avec} \\quad n = n_s \\cdot (1 - g) = \\frac{60 \\cdot f}{p} \\cdot (1 - g)$$
- Réduction du courant d'appel au démarrage : un démarrage direct (DOL) génère un appel de courant de $6\\text{ à }8\\ I_n$ avec un creux de tension associé $\\Delta U > 15\\%$ sur le réseau usine ; l'utilisation d'un variateur de fréquence limite rigoureusement le courant de démarrage à $1.1\\text{ à }1.3\\ I_n$ tout en délivrant $150\\%$ du couple nominal dès la vitesse nulle.
- Déclassement thermique sous climat tropical équatorial selon CEI 60034-1 : pour une température ambiante de 45°C (courante dans les salles machines de Douala) et une altitude de 1000 m, la puissance assignée du moteur doit être déclassée d'un facteur $k_t = 0.92$.`,
    engineering_en: `Electromechanical design calculations and sizing benchmarks:
- Shaft electromechanical torque and synchronous speed:
  $$T_n = \\frac{P_{mech}}{\\Omega} = \\frac{P_{kW} \\cdot 9550}{n_{rpm}} \\quad \\text{where} \\quad n = n_s \\cdot (1 - s) = \\frac{60 \\cdot f}{p} \\cdot (1 - s)$$
- Starting inrush transient suppression: Direct-On-Line (DOL) starting draws $6\\text{ to }8\\ I_n$ inrush current triggering factory busbar voltage dips $\\Delta U > 15\\%$; VFD acceleration limits starting current to $1.1\\text{ to }1.3\\ I_n$ while injecting $150\\%$ breakaway starting torque right from zero speed.
- Thermal derating under equatorial ambient ceilings per IEC 60034-1: for ambient temperatures reaching 45°C (typical across uncooled industrial process floors in Douala), motor nameplate mechanical rating must be derated by factor $k_t = 0.92$.`,
    formulas: [FORMULAS[7], FORMULAS[0]],
    standards: [STANDARDS[2], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[2], ENGINEERING_ROLES[0]],
    cameroon_case: {
      title_fr: 'Entraînements par Variateurs VFD des Broyeurs de Clinker CIMENCAM & Pompes SOCAPALM',
      title_en: 'VFD Inverter Drives for CIMENCAM Clinker Mills & SOCAPALM Heavy Slurry Pumps',
      plant_name: 'Cimenterie CIMENCAM de Nomayos (Yaoundé) & Huilerie SOCAPALM de Dibombari',
      capacity_mw: 'Broyeur à boulets de 3200 kW (Moteur moyenne tension 6.6 kV) + 12 variateurs BT 90 à 250 kW',
      river_or_location: 'Nomayos (Centre) et Dibombari (Littoral), Cameroun',
      operators: 'CIMENCAM (Groupe Holcim) · SOCAPALM (Groupe Socfin)',
      voltage_specs: 'Moyenne tension 6.6 kV pour gros broyeurs · 400 V triphasé pour pompes de transfert',
      notes_fr: 'À la cimenterie CIMENCAM de Nomayos, le broyeur de ciment principal de 3200 kW est piloté par un variateur moyenne tension 6.6 kV ABB ACS6000. Ce système élimine tout creux de tension sur la ligne 90 kV Oyomabang-Nomayos lors du démarrage et ajuste la vitesse de rotation en continu selon l\'humidité du clinker, générant une économie de plus de 2.4 GWh par an.',
      notes_en: 'At CIMENCAM\'s Nomayos cement mill, the 3200 kW main ball mill is driven by an ABB ACS6000 6.6 kV medium-voltage drive. This eliminated severe starting voltage dips across the 90 kV Oyomabang-Nomayos feeder while dynamically tuning grinder speed to clinker hardness, conserving over 2.4 GWh of electricity annually.',
      status: 'verified',
      source: 'Dossier Technique Ingénierie Maintenance CIMENCAM & ABB Drives 2026'
    },
    international_case: {
      title_fr: 'Entraînements Gearless Mill Drives (GMD) ABB 28 MW (Mines d\'Escondida, Chili)',
      title_en: 'ABB 28 MW Gearless Mill Drive (GMD) Systems (Escondida Copper Mine, Chile)',
      location: 'Chili',
      capacity_mw: 'Moteur synchrone annulaire 28 MW sans réducteur',
      key_features: 'Cycloconvertisseur moyenne tension, couple de démarrage colossal de 200% et régulation numérique millimétrique.'
    }
  },

  'D11.01': {
    subdomain_code: 'D11.01',
    concept_fr: `Les systèmes de protection des réseaux électriques ont pour mission absolue de détecter les anomalies et courts-circuits, d'isoler sélectivement et instantanément la portion en défaut, tout en maintenant sous tension le reste du système sain. La philosophie de protection repose sur les cinq critères universels : sensibilité, sélectivité, rapidité, fiabilité et sécurité. Les fonctions de protection sont standardisées selon la nomenclature internationale des codes ANSI / IEEE C37.2 (ex. 87 pour le différentiel, 21 pour la distance, 50/51 pour les surintensités, 67 pour la directionnelle).`,
    concept_en: `Power system protection relays are engineered to detect abnormal operating states and short-circuit faults, isolate faulty components selectively and instantaneously, and maintain undisturbed continuity across the remaining healthy grid. Relay engineering adheres to five timeless pillars: sensitivity, selectivity, speed, dependability, and security. Protection functions follow standardized ANSI/IEEE C37.2 device numbers (87 for differential, 21 for distance, 50/51 for overcurrent, 67 for directional).`,
    systems_fr: `Une chaîne complète de protection comprend :
1. Capteurs de mesure (TC et TT) : réducteurs de courant classe 5P20 (erreur composée < 5% à 20 fois le courant nominal) et transformateurs de tension inductifs ou capacitifs.
2. Relais numérique à microprocesseur (IED) : échantillonnage haute fréquence, filtrage de Fourier numérique (DFT) de la composante fondamentale 50 Hz, et algorithmes décisionnels.
3. Circuit de déclenchement : bobines de déclenchement du disjoncteur alimentées par le circuit auxiliaire sécurisé 110 V DC des batteries de poste.
4. Fonctions de communication : téléprotection différentielle de ligne 87L par canal fibre optique direct ou messagerie GOOSE CEI 61850.`,
    systems_en: `A complete protection scheme comprises:
1. Instrument transformers (CT & VT): protection-class 5P20 current transformers (composite error < 5% at 20 times rated current) and inductive/capacitive voltage transformers.
2. Numerical protective relay (IED): high-frequency sampling, discrete Fourier transform (DFT) extraction of 50 Hz fundamental components, and trip logic algorithms.
3. Tripping circuit: dual circuit breaker trip coils energized from the substation uninterruptible 110 V DC battery bank.
4. Teleprotection communications: 87L line current differential relaying via dedicated optical fibers or IEC 61850 GOOSE network messaging.`,
    engineering_fr: `Coordination et sélectivité :
- Protection de distance 21 : Zone 1 déclenchant instantanément (< 25 ms) à 80-85% de la longueur de ligne sans temporisation ; Zone 2 temporisée à 300 ms couvrant 120% de la ligne (débordement) ; Zone 3 temporisée à 600-800 ms pour le secours distant.
- Protection différentielle 87T : compare les courants entrants et sortants du transformateur après recalage vectoriel (couplage Dyn11, YNd11) avec pente de retenue à pourcentage réglée entre 20% et 40% pour éviter tout déclenchement intempestif sur courant d'enclenchement magnétisant (blocage harmonique 2).
- Surveillance des circuits de déclenchement : fonction ANSI 74TC supervisant en permanence la continuité des bobines de déclenchement à l'ouverture comme à la fermeture.`,
    engineering_en: `Coordination and selective grading:
- Distance protection 21: instantaneous Zone 1 (< 25 ms) set to 80-85% of line impedance; Zone 2 delayed at 300 ms covering 120% of line; Zone 3 delayed at 600-800 ms providing remote backup.
- Transformer differential 87T: computes vector-corrected differential current against restraint current (Dyn11 / YNd11 adaptation) featuring a dual-slope percentage characteristic and 2nd harmonic inrush restraint.
- Trip circuit supervision (ANSI 74TC): continuously monitors continuity of both trip coils in open and closed breaker states.`,
    formulas: [FORMULAS[1], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Plan de Protection des Lignes 225 kV & Transformateurs SONATREL (RIS)',
      title_en: 'SONATREL 225 kV Line & Transformer Protection Architecture (RIS)',
      plant_name: 'Postes 225 kV de Mangombé, Nomayos, Logbaba, Bekoko',
      capacity_mw: 'Couverture intégrale du réseau de transport national 225/90 kV',
      river_or_location: 'Interconnexion nationale Cameroun',
      operators: 'SONATREL (Département Études & Protections DEP-01)',
      voltage_specs: '225 kV HTB · Relais numériques redondants Protection 1 & Protection 2',
      notes_fr: 'Sur le réseau 225 kV de SONATREL, chaque départ ligne est équipé d\'une double protection indépendante : Protection 1 (Distance 21 avec téléaction) et Protection 2 (Différentielle de ligne 87L via fibres optiques OPGW). Les transformateurs 225/90 kV sont protégés par des relais 87T associés à des relais Buchholz (63) et des thermomètres à contact (26/49).',
      notes_en: 'Across SONATREL 225 kV corridors, every feeder features duplicated independent protection: Main 1 (Distance 21 with teleprotection) and Main 2 (87L line differential via dedicated OPGW fiber pairs). Transformers deploy 87T differential backed by Buchholz 63 and winding temperature relays.',
      status: 'verified',
      source: 'Spécification technique DEP-01 SONATREL & Guides de réglage des protections 2026'
    },
    international_case: {
      title_fr: 'Protection synchrophasor PMU / WAMS sur réseau haute tension RTE (France)',
      title_en: 'Wide Area Monitoring Systems (WAMS) & Phasor Measurement Units (PMU)',
      location: 'France / États-Unis',
      capacity_mw: 'Supervision dynamique continentale',
      key_features: 'Mesureurs de phaseurs synchronisés par GPS calculant les angles de tension à 50 trames/seconde.'
    }
  },

  'D11.02': {
    subdomain_code: 'D11.02',
    concept_fr: `Les transformateurs de mesure (TC pour le courant, TT pour la tension) constituent l'interface physique indispensable entre le réseau électrique haute tension et les relais de protection numériques. Le transformateur de courant de protection doit reproduire fidèlement l'amplitude et la phase des courants de court-circuit sans saturer son circuit magnétique, même en présence d'une forte composante apériodique continue (DC offset). Les normes CEI 61869-2 et IEEE C57.13 définissent les classes de précision pour la protection (5P20, 10P20, classe PX / TPS / TPX / TPY / TPZ).`,
    concept_en: `Instrument transformers (Current Transformers CT and Voltage Transformers VT) provide the critical galvanically isolated measurement interface between primary high-voltage equipment and secondary numerical protection IEDs. Protection CTs must accurately replicate extreme asymmetrical short-circuit fault currents without core saturation, even under severe decaying exponential DC offset conditions. Standards IEC 61869-2 and IEEE C57.13 govern protection accuracy classes (5P20, 10P20, Class PX, TPS, TPX, TPY, TPZ).`,
    systems_fr: `L'architecture des réducteurs de mesure comprend :
1. Transformateurs de courant à noyau magnétique conventionnel : tores en tôles au silicium à grains orientés, classes de protection 5P20 (erreur composée < 5% à 20 fois In au fardeau nominal).
2. Tores spéciaux classe PX (selon CEI 61869-2) : spécifiés par leur tension de coude Vk (Knee-point voltage), leur résistance d'enroulement secondaire Rct et leur courant magnétisant Im, indispensables pour les protections différentielles unitaires (87T, 87B, 87L).
3. Transformateurs de tension inductifs (TTI) et capacitifs (TTC) : diviseurs capacitifs avec transformateur abaisseur intermédiaire 100V / 110V et circuits anti-ferrorésonance amortis.
4. Capteurs de mesure non conventionnels (NCIT) : bobines de Rogowski linéaires sans fer (immunité totale à la saturation) et capteurs optiques interférométriques à effet Faraday.`,
    systems_en: `Instrument transformer configurations and technologies comprise:
1. Conventional magnetic core current transformers: grain-oriented silicon steel toroidal cores, protection classes 5P20 (composite error < 5% at 20 times rated current at nominal burden).
2. Specialized Class PX / Class X cores: defined strictly by Knee-point voltage (Vk), secondary winding resistance (Rct), and magnetizing current (Im), mandated for high-impedance and percentage differential schemes (87T, 87B, 87L).
3. Inductive (IVT) and Capacitive Voltage Transformers (CVT): capacitor divider stacks with intermediate step-down magnetic units and passive ferroresonance suppression circuits.
4. Non-Conventional Instrument Transformers (NCIT): linear ironless Rogowski coils (completely saturation-proof) and interferometric Faraday-effect fiber-optic sensors.`,
    engineering_fr: `Dimensionnement et critères anti-saturation selon CEI 61869-2 :
- Facteur limite de précision opérationnel (ALF_eff) : ALF_eff = ALF_n × (Rct + Rb_n) / (Rct + Rb_reel), où Rb_reel inclut la résistance de filerie aller-retour (2·ρ·L/S) et le fardeau interne du relais.
- Dimensionnement en régime transitoire (Facteur Ktd) : la constante de temps du réseau amont Tp = X / (ω·R) induit une composante apériodique exigeant un surdimensionnement Ktd = 1 + ω·Tp (souvent 5 à 15).
- Tension de coude minimale requise : Vk ≥ Ktd × Isc_sec × (Rct + 2·Rw + Rb) pour éviter tout écrêtage de la mesure qui provoquerait un faux déclenchement différentiel ou un retard de la protection distance.`,
    engineering_en: `Sizing criteria and saturation mitigation per IEC 61869-2:
- Effective Accuracy Limit Factor (ALF_eff): ALF_eff = ALF_n × (Rct + Rb_rated) / (Rct + Rb_actual), where Rb_actual encompasses the two-way loop wire resistance (2·ρ·L/S) and relay internal burden.
- Transient dimensioning factor (Ktd): system X/R ratio dictates DC offset time constant Tp = X / (ω·R), requiring transient dimensioning Ktd = 1 + ω·Tp (typically 5 to 15).
- Required Knee-point voltage: Vk ≥ Ktd × Isc_sec × (Rct + 2·Rw + Rb) preventing secondary waveform distortion that would cause differential through-fault misoperation or distance zone underreach.`,
    formulas: [FORMULAS[1], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Dimensionnement des Tores TC 5P20 et PX des Postes 225 kV SONATREL (Nomayos, Bekoko)',
      title_en: 'SONATREL 225 kV Substation Protection CT Sizing (Nomayos, Bekoko Substations)',
      plant_name: 'Postes d\'Interconnexion 225 kV de Nomayos, Bekoko et Mangombé',
      capacity_mw: 'Transit 225 kV HTB · Courant de court-circuit Isc = 31.5 kA',
      river_or_location: 'Corridor Réseau Interconnecté Sud (RIS Cameroun)',
      operators: 'SONATREL Direction du Transport / Division Études & Protections',
      voltage_specs: '225 kV HTB · Tores TC 2000/1 A Classe 5P20 30 VA & Classe PX Vk ≥ 600 V',
      notes_fr: 'Dans les postes 225 kV de SONATREL, les liaisons filaires entre la cour HTB et les armoires de protection en salle de commande atteignent 150 mètres. Pour éviter la saturation des TC sur court-circuit franc de 31.5 kA due à la résistance des câbles cuivre, les enroulements secondaires sont standardisés à 1 A (au lieu de 5 A), divisant les pertes par effet Joule et la chute de tension résistive par 25.',
      notes_en: 'At SONATREL 225 kV substations, cable runs between outdoor switchyards and control house relay panels reach 150 meters. To eliminate CT saturation during 31.5 kA through-faults caused by loop cable resistance, secondary ratings are standardized to 1 A (rather than 5 A), reducing secondary I²R burden and resistive voltage drops by a factor of 25.',
      status: 'verified',
      source: 'Spécification technique SONATREL Réducteurs de Mesure TC/TT HTB 2026'
    },
    international_case: {
      title_fr: 'Capteurs de Courant Optiques FOCS et Tores Rogowski Postes RTE (France) & Statnett',
      title_en: 'Fiber-Optic Current Sensors (FOCS) & Rogowski Coils at RTE and Statnett Substations',
      location: 'France / Norvège',
      capacity_mw: 'Lignes de transport 400 kV',
      key_features: 'Capteurs optiques sans noyau magnétique insensibles à la saturation transitoire et connectés directement aux Merging Units CEI 61869-9.'
    }
  },

  'D11.03': {
    subdomain_code: 'D11.03',
    concept_fr: `Les études de réseau, le calcul rigoureux des courants de court-circuit selon la norme internationale CEI 60909 et la coordination sélective par courbes temps-courant (TCC) forment le socle fondamental de l'ingénierie des protections électriques. L'objectif est de dimensionner le pouvoir de coupure des disjoncteurs, de vérifier la tenue thermique des câbles et de régler les seuils et temporisations des relais pour garantir qu'en cas de défaut, seul l'appareil le plus proche s'ouvre, sans déclenchement en cascade amont.`,
    concept_en: `Power system studies, rigorous short-circuit calculations per international standard IEC 60909, and selective time-current characteristic (TCC) coordination establish the bedrock of electrical protection engineering. The core objective is sizing circuit breaker breaking and making capacities, verifying conductor thermal withstand, and tuning relay pickup thresholds and time dials to guarantee that during a fault, only the immediate downstream protective device trips, preventing catastrophic cascade outages.`,
    systems_fr: `La méthodologie des études de réseau comprend :
1. Calculs de court-circuit selon CEI 60909 : calculs analytiques de la composante symétrique initiale Ik'', du courant de crête ip (facteur κ), du courant de coupure symétrique Ib et de la puissance de court-circuit Sk''.
2. Décomposition en composantes symétriques : calculs des défauts dissymétriques biphasés isolés (Ik2''), biphasés-terre (Ik2E'') et monophasés-terre (Ik1'') en fonction des schémas de liaison à la terre (SLT / neutre isolé, compensé Peterson, NGR ou direct).
3. Courbes de sélectivité log-log TCC : traçage superposé des caractéristiques de déclenchement à temps inverse (CEI 60255 Normal Inverse, Very Inverse, Extremely Inverse) et à temps indépendant.
4. Analyse des marges de sélectivité chronométrique : calcul de l'intervalle d'échelonnement Δt entre chaque niveau de protection pour garantir la discrimination totale.`,
    systems_en: `Power system study workflows comprise:
1. IEC 60909 short-circuit analysis: analytical evaluation of initial symmetrical short-circuit current Ik'', peak dynamic current ip (kappa factor), breaking current Ib, and short-circuit power Sk''.
2. Symmetrical component modeling: solving positive (Z1), negative (Z2), and zero-sequence (Z0) networks for phase-to-phase, phase-to-phase-to-earth, and single-phase-to-ground faults under varying neutral grounding regimes (solid, isolated, resonant coil, NGR).
3. Log-log Time-Current Characteristic (TCC) curves: overlaid plotting of inverse-time IDMT curves (IEC 60255 Normal Inverse, Very Inverse, Extremely Inverse) and definite-time limits.
4. Grading margin analysis: verifying chronological discrimination intervals Δt between successive protection stages to ensure absolute selective coordination.`,
    engineering_fr: `Formulations clés et critères d'échelonnement :
- Courant de crête CEI 60909 : ip = κ × √2 × Ik'', avec facteur κ calculé selon le ratio R/X équivalent du réseau (ex. κ = 1.02 + 0.98·e^(-3·R/X)).
- Équation IDMT CEI 60255 : t = TMS × [α / ((I / Is)^β - 1)], avec α = 0.14, β = 0.02 (Normal Inverse) ; α = 13.5, β = 1.0 (Very Inverse) ; α = 80.0, β = 2.0 (Extremely Inverse).
- Marge de sélectivité minimale Δt requise : Δt = t_amont - t_aval ≥ 250 à 300 ms, composée de : temps d'ouverture du disjoncteur (50 ms) + temps de dépassement inertiel du relais (30 ms) + marge de sécurité thermique et dérive de mesure TC (120 ms).`,
    engineering_en: `Key mathematical formulations and grading criteria:
- IEC 60909 peak dynamic current: ip = κ × √2 × Ik'', where peak factor κ is derived from equivalent network R/X ratio (κ = 1.02 + 0.98·e^(-3·R/X)).
- IEC 60255 IDMT operating time: t = TMS × [α / ((I / Is)^β - 1)], with α = 0.14, β = 0.02 (Normal Inverse); α = 13.5, β = 1.0 (Very Inverse); α = 80.0, β = 2.0 (Extremely Inverse).
- Minimum chronological grading margin Δt: Δt = t_upstream - t_downstream ≥ 250 to 300 ms, accounting for circuit breaker opening time (50 ms), relay overshoot time (30 ms), CT ratio errors and safety buffer (120 ms).`,
    formulas: [FORMULAS[1], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Plan de Coordination Sélective TCC du Réseau HTA 30 kV Eneo Douala & Yaoundé',
      title_en: 'Eneo 30 kV Distribution Feeder TCC Selectivity & Grading Scheme (Douala & Yaoundé)',
      plant_name: 'Postes Sources 225/30 kV d\'Oyomabang, Ngousso, Bassa et Koumassi',
      capacity_mw: 'Réseau de distribution 30 kV · Départs industriels et urbains',
      river_or_location: 'Réseaux de distribution urbains et industriels du Cameroun',
      operators: 'Eneo Direction Distribution & SONATREL Interface Transport',
      voltage_specs: '30 kV HTA · Départs protégés par relais Sepam / MiCOM / SIPROTEC',
      notes_fr: 'Sur les départs HTA 30 kV de Douala et Yaoundé, la sélectivité chronométrique entre les disjoncteurs de départ poste source (relais 50/51 temporisés à 400 ms), les réenclencheurs aériens en ligne (reclosers réglés à 150 ms) et les fusibles HTA des postes clients (10-40 ms) est ajustée avec une marge de 250 ms pour isoler les défauts transitoires sans couper l\'ensemble de l\'artère urbaine.',
      notes_en: 'Across Douala and Yaoundé 30 kV distribution feeders, chronological grading between substation feeder breakers (50/51 relays timed at 400 ms), mid-line overhead auto-reclosers (timed at 150 ms), and client transformer MV fuses (10-40 ms) is coordinated with a strict 250 ms grading margin isolating branch faults without dropping entire feeder trunks.',
      status: 'verified',
      source: 'Plan de réglage des protections HTA Eneo Direction Technique 2026'
    },
    international_case: {
      title_fr: 'Coordination Sélective Dynamique IEEE 242 (Buff Book) Pétrochimie & Data Centers',
      title_en: 'Dynamic TCC Coordination per IEEE 242 (Buff Book) for Petrochemical & Hyperscale Data Centers',
      location: 'États-Unis / Golfe Persique',
      capacity_mw: 'Installations critiques > 200 MW',
      key_features: 'Sélectivité logique par fils pilotes et GOOSE réduisant le temps d\'élimination à moins de 80 ms sur toute la chaîne.'
    }
  },

  'D11.04': {
    subdomain_code: 'D11.04',
    concept_fr: `Les sous-stations numériques régies par la norme internationale CEI 61850 marquent l'aboutissement de la convergence entre génie électrique et télécommunications industrielles. Dans une sous-station numérique moderne, la filerie cuivre conventionnelle reliant les transformateurs de mesure et les mécanismes de disjoncteurs est remplacée par un réseau Ethernet optique déterministe. Les trames Sampled Values (SV selon CEI 61869-9) numérisent les signaux analogiques au niveau du Process Bus, tandis que les messages GOOSE (Generic Object Oriented Substation Events) acheminent les ordres de déclenchement ultra-rapides (< 3 ms) avec un niveau de fiabilité certifié.`,
    concept_en: `Digital substations governed by international standard IEC 61850 represent the pinnacle of power engineering and mission-critical industrial communications convergence. In a modern digital substation, heavy copper control wiring between outdoor instrument transformers, switchgear mechanisms, and protection panels is entirely replaced by deterministic fiber-optic Ethernet networks. Sampled Values (SV per IEC 61869-9) digitize analog waveforms right on the Process Bus, while peer-to-peer GOOSE (Generic Object Oriented Substation Events) multicast frames deliver sub-3 ms trip signals with certified dependability.`,
    systems_fr: `L'architecture tripartite d'une sous-station numérique CEI 61850 comprend :
1. Niveau de processus (Process Bus) : Merging Units (MU) installées en armoires de cour numérisant les courants et tensions à 4000 éch./s (80 éch./période à 50 Hz), et commutateurs Ethernet durcis avec redondance sans coupure PRP (Parallel Redundancy Protocol) ou HSR (High-availability Seamless Redundancy) selon CEI 62439-3.
2. Niveau de tranche (Bay Level) : relais de protection numériques (IED) et calculateurs de tranche (BCU) souscrivant aux flux SV et publiant les trames GOOSE de déclenchement et de verrouillage inter-tranches.
3. Niveau de station (Station Bus) : réseau de contrôle-commande assurant la communication MMS (Manufacturing Message Specification) vers le SCADA local et la passerelle de téléconduite dispatching CEI 60870-5-104.
4. Horloge mère grandmaster PTP : synchronisation temporelle sub-microseconde selon IEEE 1588v2 sous profil d'utilité CEI/IEEE 61850-9-3, indispensable pour corréler les échantillons de courant vectoriels de protections différentielles.`,
    systems_en: `The three-tier architecture of an IEC 61850 digital substation incorporates:
1. Process Bus tier: outdoor switchyard Merging Units (MU) digitizing currents and voltages at 4000 samples/sec (80 samples/cycle at 50 Hz), routed through ruggedized optical Ethernet switches deploying zero-recovery-time PRP (Parallel Redundancy Protocol) or HSR (High-availability Seamless Redundancy) per IEC 62439-3.
2. Bay Level tier: numerical protection IEDs and Bay Control Units (BCU) subscribing to SV streams and multicasting ultra-fast GOOSE trip frames and inter-bay interlocks.
3. Station Bus tier: MMS (Manufacturing Message Specification) SCADA network carrying telemetry and telecommands to local HMIs and remote dispatch gateways (IEC 60870-5-104).
4. IEEE 1588v2 PTP Grandmaster Clock: sub-microsecond time synchronization under utility profile IEC/IEEE 61850-9-3, mandatory for phase-aligned current sampling in differential protection.`,
    engineering_fr: `Exigences d'ingénierie numérique et de performance CEI 61850 :
- Latence GOOSE classe de performance P1/P2 : temps de transmission réseau garanti < 3 ms pour les ordres de déclenchement disjoncteur (Type 1A Trip).
- Redondance PRP double réseau indépendant (LAN A et LAN B) : duplication physique des paquets assurant zéro perte de trame en cas de rupture de fibre optique.
- Fichiers d'ingénierie normalisés SCL : spécification unifiée du poste par fichiers SSD (System Specification), ICD (Capability), SCD (Substation Configuration Description) et CID (Configured IED Description).`,
    engineering_en: `Digital engineering requirements and IEC 61850 performance metrics:
- GOOSE latency performance class P1/P2: guaranteed network transit time < 3 ms for breaker trip orders (Type 1A Trip).
- PRP zero-recovery-time dual-LAN redundancy: dual-homed RedBox switches transmitting parallel frames over independent LAN A and LAN B fabrics ensuring zero packet loss during fiber cuts.
- Standardized SCL engineering lifecycle: complete substation description through SSD (System Specification), ICD (Capability), SCD (Substation Configuration Description), and CID (Configured IED) files.`,
    formulas: [FORMULAS[1], FORMULAS[0]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Poste Numérique 225 kV de Nomayos & Corridor Évacuation Nachtigal SONATREL',
      title_en: 'Nomayos 225 kV Digital Substation & Nachtigal Evacuation Corridor (SONATREL)',
      plant_name: 'Poste 225/90 kV de Nomayos & Postes d\'Interconnexion Nachtigal',
      capacity_mw: 'Évacuation 420 MW Nachtigal · Puissance de transit 200 MVA',
      river_or_location: 'Nomayos (Entrée Sud Yaoundé) et Nachtigal Amont',
      operators: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
      voltage_specs: '225 kV HTB · Architecture CEI 61850 Station Bus & verrouillages GOOSE',
      notes_fr: 'Le poste moderne 225 kV de Nomayos a introduit au Cameroun l\'automatisation de poste basée sur CEI 61850. Les verrouillages de sécurité entre sectionneurs et disjoncteurs sont échangés directement par messages GOOSE optiques, éliminant plus de 40 km de câbles filaires en cuivre traditionnels et réduisant le temps de maintenance.',
      notes_en: 'The modern Nomayos 225 kV substation pioneered IEC 61850 substation automation in Cameroon. Safety interlocks between disconnectors and circuit breakers execute via optical GOOSE messaging, eliminating over 40 km of legacy copper multi-core cabling and dramatically shortening maintenance cycles.',
      status: 'verified',
      source: 'Dossier d\'ingénierie et de mise en service Poste 225 kV Nomayos SONATREL 2026'
    },
    international_case: {
      title_fr: 'Poste 100% Process Bus de Blois (RTE France) & Substation Digitale Fingrid',
      title_en: 'Blois 100% Process Bus 400 kV Substation (RTE) & Fingrid Digital Substations',
      location: 'France / Finlande',
      capacity_mw: 'Poste de grand transport 400 kV',
      key_features: 'Poste entièrement dématérialisé avec Merging Units optiques de cour, zéro fil cuivre et double réseau PRP étendu.'
    }
  },

  'D07.01': {
    subdomain_code: 'D07.01',
    concept_fr: `Les entraînements électriques industriels et moteurs à vitesse variable (VFD / variateurs de fréquence) convertissent l'énergie électrique en travail mécanique avec un rendement optimal. Dans l'industrie lourde camerounaise (cimenteries CIMENCAM, aluminerie ALUCAM, huileries de palme CDC/SOCAPALM), les moteurs asynchrones à cage d'écureuil représentent plus de 70% de la consommation totale d'énergie électrique. L'ingénierie moderne privilégie les moteurs à haut rendement classe IE3/IE4 pilotés par contrôle vectoriel de flux (FOC) ou commande directe du couple (DTC).`,
    concept_en: `Industrial electric motor drives and Variable Frequency Drives (VFD) convert electrical energy into mechanical work at optimal operational efficiency. In Cameroon's heavy process industries (CIMENCAM cement kilns, ALUCAM smelters, CDC/SOCAPALM agro-industrial mills), three-phase squirrel-cage induction motors represent over 70% of total electrical energy demand. Modern motor drive engineering pairs high-efficiency IE3/IE4 motors with sensorless Field-Oriented Control (FOC) or Direct Torque Control (DTC) inverters.`,
    systems_fr: `Une chaîne cinématique électromécanique industrielle intègre :
1. Moteur asynchrone triphasé : bobinage cuivre classe d'isolation H (180°C) avec thermorésistances PT100 encastrées dans les encoches statoriques et les paliers.
2. Variateur de fréquence (VFD) : redresseur à diodes 6 ou 12 pulsations, bus continu filtré (DC link 560-650 V DC), et onduleur MLI (PWM) à transistors IGBT (fréquence de découpage 2 à 8 kHz).
3. Filtres de sortie : selfs de lissage dU/dt ou filtres sinus protégeant les isolants contre les surtensions réfléchies sur les longs câbles moteur.
4. Tableau de commande moteur (MCC / CCM) : tiroirs débrochables avec contacteurs, disjoncteurs moteurs magnétothermiques classe 10/20 et relais de surcharge électronique.`,
    systems_en: `An industrial electromechanical drive train deploys:
1. Three-phase induction motor: Class H insulated copper stator windings (180°C limit) with embedded PT100 RTD thermal sensors in stator slots and end-shield bearings.
2. Variable Frequency Drive (VFD): 6- or 12-pulse diode rectifier bridge, LC smoothed DC link (560-650 V DC), and sinusoidal PWM IGBT inverter (2 kHz to 8 kHz switching frequency).
3. Output line filters: dV/dt choke reactors or sine-wave filters shielding motor winding insulation against reflection wave spikes over long cable runs.
4. Motor Control Center (MCC): fully withdrawable cubicle drawers housing motor circuit breakers, vacuum/air contactors, and digital solid-state motor management relays.`,
    engineering_fr: `Calculs et dimensionnement critique :
- Couple électromécanique utile : C = P_mech / Ω, avec vitesse angulaire Ω = 2π·n / 60.
- Dimensionnement thermique et facteur de service : déclassement en altitude ou température ambiante élevée (> 40°C sous climat équatorial humide).
- Régimes transitoires de démarrage : limitation du courant d'appel à 1.2 - 1.5 In avec variateur électronique contre 6 à 8 In en démarrage direct (DOL), réduisant drastiquement les creux de tension sur le réseau usine.`,
    engineering_en: `Critical engineering calculations and sizing rules:
- Useful electromechanical torque: T = P_mech / Ω, with angular velocity Ω = 2π·n / 60.
- Thermal derating and service factor: thermal derating for equatorial ambient temperatures exceeding 40°C and humid tropical environments.
- Inrush starting dynamics: limiting starting inrush current to 1.2 - 1.5 In via VFD compared to 6 to 8 In under direct-on-line (DOL) starting, mitigating voltage dips across factory busbars.`,
    formulas: [FORMULAS[7], FORMULAS[0]],
    standards: [STANDARDS[2], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Broyeurs & Ventilateurs de Tirage Haute Puissance CIMENCAM (Cimenterie de Nomayos & Figuil)',
      title_en: 'High-Power Ball Mill & Draft Fan Drives at CIMENCAM (Nomayos & Figuil Cement Plants)',
      plant_name: 'Cimenteries CIMENCAM (Usines de Nomayos & Figuil)',
      capacity_mw: 'Moteurs broyeurs ciment : 2 × 3200 kW (6.6 kV) + variateurs MV',
      river_or_location: 'Nomayos (Centre) et Figuil (Nord Cameroun)',
      operators: 'CIMENCAM (Groupe LafargeHolcim / Dangote)',
      voltage_specs: 'Alimentation MT 6.6 kV pour gros moteurs · 400 V pour moteurs auxiliaires',
      notes_fr: 'Les broyeurs de clinker et les ventilateurs de tirage des fours de Figuil et Nomayos utilisent des moteurs moyenne tension 6.6 kV pilotés par variateurs de fréquence moyenne tension pour réduire les pointes de puissance absorbée sur le réseau interconnecté et adapter en continu le débit aéraulique.',
      notes_en: 'Raw mills, clinker grinders and kiln induced-draft fans at Figuil and Nomayos employ 6.6 kV medium-voltage motors paired with MV variable frequency drives to dampen grid starting transients and optimize process airflow.',
      status: 'verified',
      source: 'Dossier technique CIMENCAM Maintenance Industrielle 2026'
    },
    international_case: {
      title_fr: 'Entraînements Gearless Mill Drives (GMD) ABB 28 MW (Mines d\'Escondida, Chili)',
      title_en: 'ABB 28 MW Gearless Mill Drive (GMD) Systems (Escondida Copper Mine, Chile)',
      location: 'Chili',
      capacity_mw: 'Moteur synchrone annulaire 28 MW sans réducteur',
      key_features: 'Cycloconvertisseur moyenne tension, couple de démarrage colossal de 200% et régulation numérique millimétrique.'
    }
  },

  'D07.02': {
    subdomain_code: 'D07.02',
    concept_fr: `Les réseaux de terrain industriels, les boucles analogiques 4-20 mA HART et les systèmes instrumentés de sécurité (SIS / ESD) constituent le système nerveux et le bouclier protecteur des procédés industriels modernes. Dans les environnements à risques sévères (centrales thermiques, usines chimiques, sucreries, raffineries SONARA), la sécurité fonctionnelle régie par la norme CEI 61511 exige l'allocation rigoureuse de niveaux d'intégrité de sécurité (SIL 1 à 4) calculés à partir de la probabilité moyenne de défaillance à la sollicitation (PFDavg) et d'architectures à tolérance de panne (1oo2, 2oo3).`,
    concept_en: `Industrial fieldbus networks, 4-20 mA HART analog loops, and Safety Instrumented Systems (SIS / ESD) represent the nervous system and protective shield of modern automated processes. In high-hazard industrial environments (thermal power stations, chemical plants, sugar refineries, SONARA oil refinery), functional safety governed by IEC 61511 mandates rigorous Safety Integrity Level allocation (SIL 1 to 4) derived from Average Probability of Failure on Demand (PFDavg) and fault-tolerant voting architectures (1oo2, 2oo3).`,
    systems_fr: `L'architecture d'instrumentation et de sécurité industrielle déploie :
1. Réseaux déterministes temps réel : Profinet IRT (isochrone temps réel < 1 ms), Modbus TCP/IP, EtherCAT et anneaux optiques redondants MRP (Media Redundancy Protocol).
2. Instrumentation intelligente 4-20 mA / HART : transmetteurs de pression différentielle, débitmètres massiques Coriolis, sondes de niveau radar avec diagnostic de dérive du zéro et communication bidirectionnelle FSK superposée.
3. Automate de Sécurité (Safety PLC) certifié TÜV SIL 3 : CPU certifiée à double microprocesseur en lockstep, modules d'entrées/sorties à autotests d'impulsions (pulse test) et déclencheurs d'arrêt d'urgence (ESD).
4. Éléments finaux de sécurité : vannes tout-ou-rien à sécurité positive (fail-safe close) actionnées par ressort pneumatique et électrovannes certifiées SIL 3.`,
    systems_en: `Industrial instrumentation and safety architecture deploys:
1. Real-time deterministic fieldbuses: Profinet IRT (isochronous real-time < 1 ms), Modbus TCP/IP, EtherCAT, and redundant MRP (Media Redundancy Protocol) optical fiber rings.
2. Smart 4-20 mA / HART instrumentation: differential pressure transmitters, Coriolis mass flowmeters, radar level gauges with zero-drift diagnostics and superimposed FSK digital telemetry.
3. TÜV SIL 3 certified Safety PLC: dual-microprocessor lockstep CPUs, self-testing pulse-checked I/O modules, and emergency shutdown (ESD) matrix execution.
4. Final safety elements: fail-safe spring-return pneumatic shut-off valves, SIL 3 certified solenoid valves, and hardwired flame/gas detector trip loops.`,
    engineering_fr: `Calculs et dimensionnement critique :
- Probabilité moyenne de panne PFDavg (CEI 61508-6) : PFD_avg = (λ_DU · T_I) / 2 pour une architecture 1oo1, et PFD_avg ≈ (λ_DU · T_I)² / 3 + β · λ_DU · T_I / 2 pour une architecture redondante 1oo2.
- Facteur de réduction du risque : RRF = 1 / PFD_avg (SIL 2 : 100 ≤ RRF < 1000 ; SIL 3 : 1000 ≤ RRF < 10000).
- Budget de tension boucle 4-20 mA : V_dispo = V_alim_24V - (I_max · R_ligne + V_shunt_PLC + V_diode) ≥ V_min_transmetteur (typiquement 12 V).`,
    engineering_en: `Critical engineering calculations and sizing rules:
- Average Probability of Failure on Demand PFDavg (IEC 61508-6): PFD_avg = (λ_DU · T_I) / 2 for 1oo1, and PFD_avg ≈ (λ_DU · T_I)² / 3 + β · λ_DU · T_I / 2 for 1oo2 redundant voting.
- Risk Reduction Factor: RRF = 1 / PFD_avg (SIL 2: 100 ≤ RRF < 1000; SIL 3: 1000 ≤ RRF < 10000).
- 4-20 mA loop voltage budget: V_avail = V_supply_24V - (I_max · R_cable + V_shunt_PLC + V_drop) ≥ V_min_transmitter (typically 12 V min).`,
    formulas: [FORMULAS[7], FORMULAS[0]],
    standards: [STANDARDS[2], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Système Instrumenté de Sécurité (SIS / ESD) des Turbines de la Centrale Hydroélectrique de Nachtigal (420 MW)',
      title_en: 'Safety Instrumented System (SIS / ESD) for Hydraulic Turbines at Nachtigal Hydroelectric Plant (420 MW)',
      plant_name: 'Aménagement Hydroélectrique de Nachtigal Amont',
      capacity_mw: '420 MW (7 groupes Francis de 60 MW)',
      river_or_location: 'Fleuve Sanaga, Nachtigal (Région du Centre, Cameroun)',
      operators: 'NHPC (Nachtigal Hydro Power Company) / EDF / SONATREL',
      voltage_specs: '225 kV évacuation · 13.8 kV alternateurs · 24 V DC / 48 V DC contrôle-commande de sécurité',
      notes_fr: 'Les vannes de tête de bief et le système oléopneumatique de fermeture rapide des directrices de turbine sont asservis à un automate de sécurité SIL 3 redondant 1oo2D. En cas de survitesse turbine (>125% N_nom) ou de rupture de circuit d\'huile de régulation, le SIS ordonne l\'arrêt d\'urgence hydraulique en moins de 4.5 secondes, protégeant l\'ouvrage contre le coup de bélier critique.',
      notes_en: 'Intake gates and high-pressure governor oil quick-closing valves are governed by a redundant 1oo2D SIL 3 Safety PLC. Upon turbine overspeed (>125% N_nom) or governor hydraulic oil pressure loss, the SIS triggers emergency hydraulic shutdown within 4.5 seconds, protecting penstocks against critical water hammer.',
      status: 'verified',
      source: 'Spécifications Techniques NHPC / EDF Hydro Ingénierie 2024-2026'
    },
    international_case: {
      title_fr: 'Système d\'Arrêt d\'Urgence ESD SIL 3 & HIPPS (Raffinerie TotalEnergies Anvers)',
      title_en: 'SIL 3 Emergency Shutdown (ESD) & High-Integrity Pressure Protection System (HIPPS, TotalEnergies Antwerp)',
      location: 'Belgique',
      capacity_mw: 'Complexe pétrochimique 380 000 barils/jour',
      key_features: 'Architecture 2oo3 triple redondance modulaire (TMR) Triconex, vannes HIPPS à fermeture étanche en moins de 2 secondes à 120 bar.'
    }
  },

  'D08.01': {
    subdomain_code: 'D08.01',
    concept_fr: `Le câblage structuré et les infrastructures optiques constituent les artères neurales du bâtiment moderne et des campus industriels. Régis par les normes TIA-568.2-D et ISO/IEC 11801, ils garantissent la transmission des débits Gigabit et 10G sans dégradation du signal. L'ingénierie rigoureuse impose la maîtrise du bilan de puissance optique (pertes linéiques en dB/km, épissures à fusion, connecteurs LC/SC) et le dimensionnement de l'alimentation par câble réseau (PoE 802.3af/at/bt jusqu'à 90W) dans les environnements tropicaux à fortes contraintes thermiques.`,
    concept_en: `Structured cabling and optical fiber backbones represent the neural arteries of modern commercial buildings and industrial campuses. Governed by TIA-568.2-D and ISO/IEC 11801 standards, they guarantee Gigabit and 10G throughput without packet loss. Rigorous telecommunications engineering mandates link power budget calculations (cable attenuation in dB/km, fusion arc splices, LC/SC connector loss) and Power over Ethernet (PoE 802.3af/at/bt up to 90W) thermal derating in tropical African climates.`,
    systems_fr: `Les architectures de câblage structuré déploient :
1. Câblage horizontal cuivre : paires torsadées blindées Cat 6A F/UTP ou S/FTP 500 MHz, cordons de brassage LSZH sans halogène et connecteurs RJ45 certifiés Fluke DSX.
2. Backbones verticaux & campus fibre : liaisons multimodes OM4 (50/125 µm) pour les colonnes montantes inter-étages et monomodes OS2 (9/125 µm) pour les liaisons campus inter-bâtiments.
3. Baies de brassage 19 pouces : répartiteurs généraux (Régie centrale), sous-répartiteurs d'étage, bandeaux passe-câbles 1U, PDU monitorés et commutateurs PoE+.
4. Réseau sans fil haute densité : points d'accès WiFi 6 (802.11ax) alimentés en PoE+ (802.3at) avec contrôleurs WLAN virtualisés et segmentation VLAN 802.1Q.`,
    systems_en: `Structured cabling deployments integrate:
1. Horizontal copper links: Cat 6A shielded F/UTP or S/FTP 500 MHz twisted pairs, low-smoke zero-halogen (LSZH) patch cords, and Fluke DSX certified RJ45 jacks.
2. Vertical & campus fiber backbones: OM4 multimode (50/125 µm) links for riser inter-floor distribution and OS2 singlemode (9/125 µm) for inter-building campus links.
3. 19-inch patch racks: Main Distribution Frames (MDF), Intermediate Distribution Frames (IDF), 1U cable managers, monitored PDUs, and PoE+ core/edge switches.
4. High-density enterprise wireless: WiFi 6 (802.11ax) access points powered via PoE+ (802.3at) with centralized WLAN controllers and IEEE 802.1Q VLAN segmentation.`,
    engineering_fr: `Calculs et dimensionnement critique :
- Bilan optique de liaison : A_tot = (L_km · α_dB) + (N_épissures · 0.05 dB) + (N_connecteurs · 0.35 dB) + Marge_sécurité (3.0 dB).
- Marge de puissance nette : Marge = P_TX - A_tot - Sensibilité_RX ≥ 0 dB.
- Budget de puissance PoE du commutateur : P_switch_total ≥ Σ(P_PoE_i · k_foisonnement).`,
    engineering_en: `Critical engineering calculations and sizing metrics:
- Optical link loss budget: A_total = (L_km · α_dB) + (N_splices · 0.05 dB) + (N_connectors · 0.35 dB) + Safety_margin (3.0 dB).
- Net power margin: Margin = P_TX - A_total - RX_sensitivity ≥ 0 dB.
- PoE switch power budget: P_switch_total ≥ Σ(P_PoE_i · k_diversity).`,
    formulas: [FORMULAS[4], FORMULAS[7]],
    standards: [STANDARDS[1], STANDARDS[2]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Réseau Fibre Optique Campus & WiFi 6 de l\'Université de Yaoundé I (Ngoa-Ekélé)',
      title_en: 'Campus Optical Fiber Backbone & High-Density WiFi 6 at University of Yaoundé I',
      plant_name: 'Campus Universitaire Ngoa-Ekélé (UY1)',
      capacity_mw: '12 bâtiments interconnectés · Boucle fibre OS2 de 8.5 km',
      river_or_location: 'Plateau Atemengue / Ngoa-Ekélé, Yaoundé (Cameroun)',
      operators: 'Université de Yaoundé I / Ministère de l\'Enseignement Supérieur (MINESUP)',
      voltage_specs: 'Alimentation secourue onduleurs rackables 3 kVA · PoE+ 30W sur câbles Cat 6A',
      notes_fr: 'Déploiement d\'un anneau optique monomode OS2 24 brins avec protection de boucle RSTP, reliant les facultés des sciences, amphis et rectorat. Résistance aux fortes chaleurs tropicales et aux surtensions atmosphériques par parafoudres RJ45 PoE de niveau 2 sur chaque point d\'accès extérieur.',
      notes_en: 'Deployment of a 24-core OS2 singlemode optical ring with RSTP loop protection connecting faculties, amphitheatres, and rectorate. Tropical heat resistance and atmospheric surge protection achieved through Level 2 PoE RJ45 surge suppressors on all outdoor APs.',
      status: 'verified',
      source: 'Rapport Technique Direction Informatique UY1 2024-2025'
    },
    international_case: {
      title_fr: 'Câblage Structuré 40G / 100G du Campus Digital Microsoft (Dublin, Irlande)',
      title_en: 'Microsoft 40G / 100G High-Speed Campus Structured Cabling (Dublin, Ireland)',
      location: 'Irlande',
      capacity_mw: 'Data center & campus tertiaire 25 000 m²',
      key_features: 'Liaisons optiques pré-connectorisées MPO/MTP 24 fibres, baies haute densité avec brassage robotisé et certification OTDR niveau 2.'
    }
  },

  'D08.02': {
    subdomain_code: 'D08.02',
    concept_fr: `La sécurité électronique, la protection incendie (SSI Cat. A) et la gestion technique du bâtiment (GTB) constituent le bouclier de sûreté et le cerveau énergétique des édifices tertiaires et industriels. Régis par les normes EN 54, NF S 61-936, EN 62676 et le protocole BACnet IP, ces systèmes intègrent la détection automatique précoce, la levée de doute vidéo 4K, le contrôle d'accès biométrique anti-passback et la commande prioritaire des asservissements de sécurité (désenfumage, compartimentage coupe-feu, déverrouillage des issues).`,
    concept_en: `Electronic security, fire life safety (SSI Cat. A), and Building Management Systems (BMS) represent the protective shield and energy intelligence of modern commercial and critical infrastructure facilities. Governed by EN 54, NF S 61-936, EN 62676, and BACnet IP protocols, these systems integrate early smoke detection, 4K video surveillance verification, biometric anti-passback access control, and hardwired fire trip interlocks (smoke extraction dampers, fire doors, emergency exit release).`,
    systems_fr: `L'infrastructure de sécurité électronique et GTB intègre :
1. Système de Détection Incendie (SDI) Adressable : boucles rebouclées avec isolateurs de court-circuit, détecteurs combinés optique/thermique et déclencheurs manuels DMI.
2. Centralisateur de Mise en Sécurité Incendie (CMSI) : commande des volets de désenfumage, arrêts CTA/CVC et fermeture des portes coupe-feu par rupture de courant 24V.
3. Vidéosurveillance IP & NVR RAID : caméras dôme et PTZ H.265+, critères optiques DORI pour identification faciale et stockage redondant RAID 5/6 sur 30 jours.
4. Contrôle d'Accès & Sas Sécurisé : lecteurs RFID MIFARE DESFire EV3, ventouses électromagnétiques 300/600 kg et logique d'interverrouillage sas anti-passback.
5. Gestion Technique du Bâtiment (GTB) : superviseur centralisé BACnet/IP supervisant les centrales de traitement d'air, groupes froids et compteurs d'énergie Modbus.`,
    systems_en: `Electronic security and BMS infrastructure integrates:
1. Addressable Fire Detection System (FAS): closed-loop addressable circuits with short-circuit isolators, multi-criteria optical/heat detectors, and manual call points.
2. Fire Safety Control Panel (CMSI): actuation of smoke relief dampers, HVAC air handling unit trip, and fail-safe magnetic fire door release via 24V drop.
3. IP CCTV & RAID NVR: H.265+ dome and PTZ cameras, DORI optical resolution criteria for judicial facial identification, and 30-day RAID 5/6 video retention.
4. Access Control & Security Airlocks: MIFARE DESFire EV3 RFID readers, 300/600 kg electromagnetic maglocks, and hardware airlock interlocking logic.
5. Building Management System (BMS): centralized BACnet/IP SCADA supervising chilled water plants, AHUs, lighting DALI gateways, and Modbus energy meters.`,
    engineering_fr: `Spécifications d'ingénierie et calculs critiques :
- Pression acoustique d'alarme (NF S 61-936 / EN 54-24) : Lp = Ls + 10·log(P_W) - 20·log(d_m) ≥ 65 dB SPL et +10 dB au-dessus du bruit ambiant.
- Dimensionnement batterie de secours EN 54-4 : C_min = 1.25 · [(I_veille · 72h) + (I_alarme · 0.5h)].
- Volume stockage CCTV : V_Go = (N_cam · Débit_Mbps · 3600 · H · J) / (8 · 1024) avec tolérance disque RAID 5.`,
    engineering_en: `Engineering calculations and compliance benchmarks:
- Fire alarm sound pressure (NF S 61-936 / EN 54-24): Lp = Ls + 10·log(P_W) - 20·log(d_m) ≥ 65 dB SPL and +10 dB above ambient noise.
- EN 54-4 backup battery capacity: C_min = 1.25 · [(I_standby · 72h) + (I_alarm · 0.5h)].
- CCTV storage sizing: V_GB = (N_cam · Bitrate_Mbps · 3600 · H · D) / (8 · 1024) incorporating RAID 5 parity overhead.`,
    formulas: [FORMULAS[4], FORMULAS[7]],
    standards: [STANDARDS[1], STANDARDS[2]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Sécurité Électronique & SSI du Complexe Douala Grand Mall & Business Park',
      title_en: 'Integrated Electronic Security & Life Safety at Douala Grand Mall & Business Park',
      plant_name: 'Complexe Douala Grand Mall (Actis / Craft Contractors)',
      capacity_mw: 'Surface commerciale 18 000 m² · ERP de 1ère catégorie',
      river_or_location: 'Avenue de l\'Aéroport, Douala (Cameroun)',
      operators: 'Actis / JLL Property Management',
      voltage_specs: '20 kV / 400 V secouru par 2 groupes électrogènes 1500 kVA · Détection 24V DC',
      notes_fr: 'Installation de 140 caméras IP 4K avec analyse vidéo intelligente (franchissement de ligne et détection de bagage abandonné), SSI Catégorie A avec centrale adressable 8 boucles et désenfumage mécanique motorisé de la grande verrière centrale.',
      notes_en: 'Installation of 140 4K IP cameras with AI video analytics (line crossing and unattended baggage detection), Category A fire system with 8-loop addressable panel, and motorized smoke extraction fans across the central atrium skylight.',
      status: 'verified',
      source: 'Dossier Sécurité ERP Commission Nationale de Sécurité Douala 2024'
    },
    international_case: {
      title_fr: 'Système SSI & GTB de la Tour The Shard (Londres, Royaume-Uni)',
      title_en: 'Life Safety SSI & BACnet BMS at The Shard (London, UK)',
      location: 'Royaume-Uni',
      capacity_mw: 'Gratte-ciel IGH de 310 m (72 étages)',
      key_features: 'Détection précoce par aspiration d\'air laser VESDA, compartimentage automatique multizone et GTB BACnet supervisant 65 000 points d\'E/S.'
    }
  },

  'D09.01': {
    subdomain_code: 'D09.01',
    concept_fr: `L'intelligence artificielle, l'apprentissage automatique (Machine Learning) et les jumeaux numériques transforment l'exploitation et la maintenance du système électrique. Les réseaux de neurones multicouches (MLP) et les jumeaux thermiques informés par la physique (PINN - Physics-Informed Neural Networks) modélisent la dégradation des isolants et la cinématique des machines tournantes. Le diagnostic des gaz dissous (DGA selon CEI 60599 / IEEE C57.104) combiné au Triangle de Duval 1 identifie instantanément les amorçages d'arcs électriques, les surchauffes thermiques et les décharges partielles.`,
    concept_en: `Artificial intelligence, machine learning, and digital twins revolutionize electrical asset management and power system reliability. Multi-layer perceptrons (MLP) and Physics-Informed Neural Networks (PINN) model thermal insulation degradation and rotating machinery kinematics. Online dissolved gas analysis (DGA per IEC 60599 / IEEE C57.104) coupled with Duval Triangle 1 provides automated fault classification across electrical arcing, thermal hot-spots, and partial discharges.`,
    systems_fr: `Les architectures d'IA industrielle pour l'énergie déploient :
1. Diagnostic DGA prédictif : réseau de neurones classifiant les 7 gaz combustibles (H2, CH4, C2H2, C2H4, C2H6, CO, CO2) et localisant le point de défaut sur le Triangle de Duval 1.
2. Jumeau numérique thermique PINN (CEI 60076-7) : solveur différentiel estimant en temps réel la température du point chaud (hot-spot θh), le facteur d'accélération de vieillissement V = 2^((θh-98)/6) et la durée de vie résiduelle (RUL).
3. Surveillance vibratoire Edge IIoT (ISO 10816 / ISO 13373) : capteurs accéléromètres piézoélectriques 20 kHz sur paliers de turbines hydroélectriques avec décomposition spectrale FFT (BPFO, BPFI, BSF, FTF).
4. Détection d'anomalies de décharge partielle (CEI 60270) : cartographie PRPD (Phase-Resolved Partial Discharge) par algorithmes d'auto-encodeurs profonds.`,
    systems_en: `Industrial AI architectures for power engineering deploy:
1. Predictive DGA diagnostics: neural networks classifying 7 combustible gases (H2, CH4, C2H2, C2H4, C2H6, CO, CO2) and vectorially plotting Duval Triangle 1 fault coordinates.
2. Physics-Informed Thermal Digital Twin (IEC 60076-7): differential state estimator computing real-time winding hot-spot temp (θh), aging acceleration V = 2^((θh-98)/6), and remaining useful life (RUL).
3. Edge IIoT vibration analytics (ISO 10816 / ISO 13373): 20 kHz triaxial accelerometers on hydro turbine bearings processing fast Fourier transforms (BPFO, BPFI, BSF, FTF kinematics).
4. Partial discharge anomaly detection (IEC 60270): deep autoencoders profiling Phase-Resolved Partial Discharge (PRPD) patterns across HV insulation.`,
    engineering_fr: `Calculs et équations d'ingénierie prédictive :
- Triangle de Duval 1 : %CH4 = CH4/(CH4+C2H4+C2H2) · 100, %C2H4 = C2H4/S · 100, %C2H2 = C2H2/S · 100.
- Vieillissement thermique relatif CEI 60076-7 : V = 2^((θh - 98) / 6).
- Fréquences de défaut roulement : BPFO = (Z/2)·fr·(1 - (d/D)·cos β), BPFI = (Z/2)·fr·(1 + (d/D)·cos β).`,
    engineering_en: `Predictive engineering formulas and benchmarks:
- Duval Triangle 1: %CH4 = CH4/(CH4+C2H4+C2H2) · 100, %C2H4 = C2H4/S · 100, %C2H2 = C2H2/S · 100.
- Relative thermal aging rate per IEC 60076-7: V = 2^((θh - 98) / 6).
- Bearing kinematics: BPFO = (Z/2)·fr·(1 - (d/D)·cos β), BPFI = (Z/2)·fr·(1 + (d/D)·cos β).`,
    formulas: [FORMULAS[4], FORMULAS[7]],
    standards: [STANDARDS[1], STANDARDS[2]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Télémétrie Vibratoire & DGA en Ligne des Turbines Francis de Songloulou (384 MW)',
      title_en: 'Online DGA & Vibration Telemetry on Songloulou 384 MW Francis Hydro Turbines',
      plant_name: 'Centrale Hydroélectrique de Songloulou (Eneo Cameroun)',
      capacity_mw: '384 MW (8 groupes Francis de 48 MW) · Transformateurs 60 MVA',
      river_or_location: 'Fleuve Sanaga, Songloulou (Région du Littoral, Cameroun)',
      operators: 'Eneo Cameroun / Direction de la Production Hydraulique',
      voltage_specs: '10.5 kV / 225 kV · Surveillance en continu huile et paliers',
      notes_fr: 'Mise en place de capteurs vibratoires piézoélectriques et chromatographes d\'huile DGA en ligne sur les groupes 1 à 8. L\'analyse spectrale FFT automatique a permis de détecter précocement les pulsations de pression de vortex en sortie de roue Francis et de prévenir la fissuration des aubes.',
      notes_en: 'Deployment of online DGA oil chromatographs and piezoelectric vibration sensors on Francis units 1-8. Automated FFT spectral analysis successfully detected draft-tube vortex pressure pulsations, preventing blade fatigue cracks.',
      status: 'verified',
      source: 'Rapport d\'Exploitation & Maintenance Prédictive Songloulou 2025'
    },
    international_case: {
      title_fr: 'Jumeau Numérique et Diagnostic Prédictif de Grand Parc Éolien Mer du Nord (Danemark)',
      title_en: 'Digital Twin & Predictive RUL Platform at Hornsea Offshore Wind Farm (North Sea)',
      location: 'Danemark / Royaume-Uni',
      capacity_mw: '1200 MW offshore',
      key_features: 'Jumeau numérique hybride PINN supervisant 174 éoliennes avec prédiction de défaillance des multiplicateurs planétaires 6 mois avant rupture.'
    }
  },

  'D09.02': {
    subdomain_code: 'D09.02',
    concept_fr: `La convergence de l'Internet des Objets Industriel (Edge IIoT), de la vision par ordinateur et de la cybersécurité opérationnelle (CEI 62443 / MITRE ATT&CK for ICS) fortifie les réseaux électriques modernes. L'inspection par drones autonomes équipés de caméras optiques et thermiques radiométriques détecte les défauts sur les couloirs 225 kV. En parallèle, les moteurs d'inspection profonde de paquets (DPI) surveillent les trames CEI 60870-5-104, GOOSE et Modbus TCP pour neutraliser les cyberattaques d'injection de fausses commandes.`,
    concept_en: `The convergence of Edge Industrial IoT (IIoT), computer vision AI, and operational technology (OT) cybersecurity (IEC 62443 / MITRE ATT&CK for ICS) fortifies modern power networks. Autonomous drones equipped with high-resolution RGB and radiometric thermal payloads survey high-voltage transmission lines. Concurrently, deep packet inspection (DPI) engines monitor IEC 60870-5-104, GOOSE, and Modbus TCP industrial protocols to neutralize rogue command injections and man-in-the-middle exploits.`,
    systems_fr: `Les plateformes de vision et de cybersécurité OT déploient :
1. Inspection par drone & vision par ordinateur : modèles de réseaux convolutifs YOLOv8 entraînés sur isolateurs fissurés, corrosion de câbles de garde et points chauds de pinces (ΔT > 35°C).
2. Télédétection LiDAR 3D : calcul de distance conducteur-végétation avec déclenchement automatique d'élagage si distance < 5.0 m.
3. Sonde DPI & SIEM OT (CEI 62443-3-3) : analyse syntaxique des trames CEI 104 (ASDU Type 45/46) et détection d'anomalies de séquence de rejeu GOOSE.
4. Détection IA de pertes non-techniques (Fraude Eneo) : algorithmes Random Forest et Isolation Forest analysant les données de télé-relève compteurs communicants STS/AMI.`,
    systems_en: `OT computer vision and cybersecurity systems deploy:
1. Drone inspection & computer vision: YOLOv8 convolutional neural networks trained on insulator puncture tracking, tension clamp hotspots (ΔT > 35°C), and broken strands.
2. 3D LiDAR corridor profiling: real-time conductor-to-canopy clearance assessment triggering priority vegetation trimming work orders when clearance < 5.0 m.
3. DPI Sensor & OT SIEM (IEC 62443-3-3): protocol dissectors validating IEC 104 ASDU commands and GOOSE StNum/SqNum monotonic progression to foil replay attacks.
4. Non-Technical Loss (NTL) theft detection: Random Forest and Isolation Forest machine learning models processing AMI smart meter telemetry to spot unmetered bypasses.`,
    engineering_fr: `Critères d'évaluation et seuils de sûreté :
- Échauffement thermographique critique : ΔT = T_pince - T_conducteur > 35 K (Remplacement immédiat d'urgence).
- Distance de sécurité électrique 225 kV (NF C 11-201) : D_min = 4.0 m + f_vent ≥ 5.0 m par rapport à la canopée.
- Détection d'anomalie protocolaire : Score d'anomalie IA > 90% déclenche le blocage pare-feu OT selon CEI 62351-5.`,
    engineering_en: `Evaluation criteria and safety thresholds:
- Critical thermal hotspot: ΔT = T_clamp - T_conductor > 35 K (Mandatory emergency clamp replacement).
- 225 kV electrical clearance (NF C 11-201): D_min = 4.0 m + wind sag ≥ 5.0 m clear zone to rainforest canopy.
- Protocol anomaly scoring: AI anomaly score > 90% triggers automated OT firewall quarantine per IEC 62351-5.`,
    formulas: [FORMULAS[4], FORMULAS[7]],
    standards: [STANDARDS[1], STANDARDS[2]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Surveillance par Drone de la Ligne 225 kV Mangombé - Oyomabang (SONATREL)',
      title_en: 'Drone Computer Vision Survey of SONATREL 225 kV Mangombé - Oyomabang Line',
      plant_name: 'Couloir de Transport 225 kV Centre-Littoral (SONATREL)',
      capacity_mw: 'Liaison biphasée 225 kV sur 170 km reliant Édéa à Yaoundé',
      river_or_location: 'Corridor forestier Mangombé - Bekoko - Oyomabang (Cameroun)',
      operators: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
      voltage_specs: '225 kV triphasé · Pylônes treillis métalliques en milieu tropical humide',
      notes_fr: 'L\'inspection par drones haute autonomie avec caméras thermiques infrarouges a permis de cartographier l\'ensemble du corridor traversant la forêt dense. L\'IA a détecté 14 échauffements anormaux sur des manchons de jonction avant rupture de phase et identifié 8 zones critiques d\'empiètement végétal.',
      notes_en: 'Autonomous long-range drone flights equipped with radiometric infrared cameras surveyed the entire corridor through dense rainforest. AI models pinpointed 14 anomalous junction sleeve hotspots before phase conductor drops, alongside 8 high-risk tree clearance violations.',
      status: 'verified',
      source: 'Direction de la Maintenance du Réseau de Transport SONATREL 2025'
    },
    international_case: {
      title_fr: 'Défense Cybersécurité OT des Réseaux Haute Tension RTE & Enedis (France)',
      title_en: 'OT Cybersecurity Defense Architecture across RTE & Enedis HV Networks (France)',
      location: 'France',
      capacity_mw: 'Réseau national 400 kV / 225 kV / 20 kV',
      key_features: 'Sondes souveraines d\'inspection DPI certifiées ANSSI, passerelles à diodes optiques et chiffrement CEI 62351.'
    }
  },

  'D10.01': {
    subdomain_code: 'D10.01',
    concept_fr: `Les systèmes de stockage d'énergie par batteries stationnaires à grande échelle (BESS - Battery Energy Storage Systems) sont devenus indispensables pour stabiliser les réseaux modernes face à la variabilité des énergies renouvelables. Le stockage remplit des fonctions fondamentales : arbitrage énergétique (stockage en heures creuses, restitution en heures de pointe), réserve rapide de fréquence (FFR - Fast Frequency Response en moins de 200 ms), régulation de tension nodale et démarrage autonome en réseau noir (Black-Start).`,
    concept_en: `Grid-scale Battery Energy Storage Systems (BESS) provide dynamic flexibility and resilience, counteracting renewable intermittency across power networks. Utility storage fulfills pivotal mission-critical roles: bulk energy arbitrage (charging during solar peaks, discharging into evening demand), Fast Frequency Response (FFR operating within 200 ms), local reactive voltage support, and autonomous grid black-start restoration.`,
    systems_fr: `Un conteneur BESS industriel intègre :
1. Modules de cellules électrochimiques : cellules Lithium Fer Phosphate (LiFePO4 / LFP) montées en racks 1500 V DC, réputées pour leur haute stabilité thermique et leur longue durée de vie (> 6000 cycles à 80% DoD).
2. Système de gestion de batterie (BMS) : surveillance en temps réel de chaque tension élémentaire de cellule, de la température et équilibrage actif des charges.
3. Onduleur bidirectionnel de puissance (PCS - Power Conversion System) : pont 4 quadrants à IGBT assurant la conversion bidirectionnelle charge/décharge et la régulation 4 quadrants P/Q.
4. Système de gestion de l'énergie (EMS) : automate temps réel communiquant avec le SCADA dispatching par CEI 60870-5-104 pour arbitrer les consignes de régulation.
5. Sécurité incendie et climatisation : refroidissement liquide direct des cellules et système d'extinction automatique par gaz inerte ou aérosol avec détection d'emballement thermique (Off-gas detection).`,
    systems_en: `A modular utility-scale BESS container incorporates:
1. Electrochemical battery modules: Lithium Iron Phosphate (LiFePO4 / LFP) cells arranged in 1500 V DC racks, renowned for high thermal runaway resistance and long cycle life (> 6000 cycles at 80% DoD).
2. Battery Management System (BMS): millivolt-level cell voltage sensing, multi-point temperature telemetry, and active charge equalization.
3. Four-quadrant Power Conversion System (PCS): bidirectional IGBT inverter bridge executing sub-second charge/discharge transitions and decoupled P-Q reactive control.
4. Energy Management System (EMS): real-time controller interfacing with grid SCADA via IEC 60870-5-104 executing dispatch directives.
5. Thermal management & fire suppression: closed-loop direct liquid cooling and automatic aerosol / clean agent fire extinguishing paired with hydrogen/CO off-gas early warning detection.`,
    engineering_fr: `Critères de dimensionnement et sécurité selon CEI 62933 :
- Débit de puissance (C-Rate) : rapport entre puissance de pointe et capacité énergétique (ex. 0.5C pour 2 heures de décharge, 1C pour 1 heure, 2C pour du réglage ultra-rapide de fréquence).
- Profondeur de décharge (DoD - Depth of Discharge) : exploitée entre 10% et 90% pour minimiser la dégradation de l'état de santé (SoH - State of Health).
- Sécurité d'exploitation : confinement anti-propagation de l'emballement thermique certifié selon la norme UL 9540A.`,
    engineering_en: `Sizing criteria and safety standards per IEC 62933:
- C-Rate power-to-energy ratio: ratio of peak power to total capacity (0.5C for 2-hour duration, 1C for 1-hour firm capacity, 2C for sub-second primary frequency regulation).
- Depth of Discharge (DoD) envelope: operation capped between 10% and 90% state-of-charge (SoC) maximizing State of Health (SoH) and asset lifetime.
- Safety certification: UL 9540A large-scale thermal runaway fire propagation testing certification.`,
    formulas: [FORMULAS[11], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'BESS Modulaire Hybride Guider & Maroua (Scatec / Eneo RIN)',
      title_en: 'Modular Hybrid BESS at Guider & Maroua (Scatec / Eneo Northern Grid)',
      plant_name: 'Système BESS Conteneurisé de Guider & Maroua (Grand Nord)',
      capacity_mw: 'Capacité combinée : 19 MW / 38 MWh (Technologie Lithium LFP)',
      river_or_location: 'Sites solaires de Guider et Maroua, Région du Nord',
      operators: 'Scatec / Release Eneo (Régulation du RIN)',
      voltage_specs: 'Raccordement bus continu 1500 V DC → Transformateur élévateur 30 kV',
      notes_fr: 'Ce parc de stockage par batteries LiFePO4 de 38 MWh est le plus important d\'Afrique centrale. Il permet de stocker l\'énergie solaire pendant les heures d\'ensoleillement maximal et de l\'injecter entre 18h et 22h, réduisant drastiquement le recours aux groupes diesel d\'appoint très coûteux.',
      notes_en: 'This 38 MWh LiFePO4 battery installation represents the largest BESS facility in Central Africa. It absorbs peak midday solar energy and discharges between 6:00 PM and 10:00 PM, displacing expensive peaking diesel generators on the northern grid.',
      status: 'verified',
      source: 'Spécification technique projet Scatec Release & Eneo RIN 2026'
    },
    international_case: {
      title_fr: 'Hornsdale Power Reserve 150 MW / 193 MWh (Tesla Megapack, Australie du Sud)',
      title_en: 'Hornsdale Power Reserve 150 MW / 193 MWh (Tesla Megapack, South Australia)',
      location: 'Australie',
      capacity_mw: '150 MW / 193 MWh',
      key_features: 'Inertie synthétique par onduleurs Grid-Forming rétablissant la fréquence en moins de 150 ms.'
    }
  },

  'D10.02': {
    subdomain_code: 'D10.02',
    concept_fr: `Les convertisseurs de puissance bidirectionnels (PCS - Power Conversion System) et le contrôle Grid-Forming (GFM / source de tension virtuelle) constituent la rupture technologique majeure du stockage d'énergie moderne. Contrairement aux onduleurs classiques suiveurs de réseau (Grid-Following / GFL) qui s'asservissent à la tension existante par boucle à verrouillage de phase (PLL), les onduleurs Grid-Forming imposent une tension et une fréquence internes via une machine synchrone virtuelle (VSG). Ils apportent de l'inertie synthétique instantanée (J_synth), amortissent les oscillations électromécaniques (RoCoF) et permettent le démarrage autonome en réseau noir (Black-Start).`,
    concept_en: `Bidirectional Power Conversion Systems (PCS) and Grid-Forming (GFM / Virtual Synchronous Generator) inverter controls represent the defining technological advancement in modern battery storage. While conventional Grid-Following (GFL) inverters track existing grid voltage vectors via Phase-Locked Loops (PLL), Grid-Forming inverters synthesize internal voltage and frequency angles mimicking synchronous generators. They deliver instantaneous synthetic inertia (J_synth), damp Rate of Change of Frequency (RoCoF), and provide autonomous grid black-start capability.`,
    systems_fr: `L'étage de conversion de puissance PCS et son architecture de contrôle comprennent :
1. Pont onduleur/redresseur réversible 4 quadrants : transistors IGBT ou MOSFET SiC haute fréquence (3 kHz - 10 kHz) commutant le bus DC 1500 V vers AC 690 V triphasé.
2. Filtre de puissance LCL : filtre d'amortissement atténuant les harmoniques de découpage haute fréquence avec résonance amortie passivement ou activement.
3. Émulation de machine synchrone virtuelle (VSG) : algorithme implémentant l'équation d'oscillation du rotor numérique (J·dω/dt = Tm - Te - D·Δω) et le statisme P-f / Q-U.
4. Contrôle de limitation de courant de court-circuit : limitation logicielle rapide à 1.2 - 1.5 In pour protéger les semi-conducteurs sans perdre la synchronisation de phase.`,
    systems_en: `The PCS power conversion stage and control architecture integrate:
1. Reversible 4-quadrant inverter/rectifier bridge: high-speed IGBT or SiC MOSFET modules (3 kHz - 10 kHz) converting 1500 V DC to 690 V three-phase AC.
2. LCL power filter: inductive-capacitive damping filter mitigating high-frequency PWM switching harmonics with passive or active resonance damping.
3. Virtual Synchronous Generator (VSG) emulation: real-time digital rotor swing equation implementation (J·dω/dt = Tm - Te - D·Δω) and decoupled P-f / Q-V droop loops.
4. Fast inverter current limiting: sub-millisecond current clipping (1.2 to 1.5 rated In) safeguarding power semiconductors while maintaining virtual voltage source integrity.`,
    engineering_fr: `Calculs et dimensionnement critique de contrôle :
- Constante d'inertie virtuelle H_synth : calculée selon H = (0.5 × J × ω0²) / S_base, paramétrée généralement entre 2 et 6 secondes pour reproduire l'effet stabilisateur d'un gros turbo-alternateur hydroélectrique.
- Réserve de fréquence rapide (FFR) : injection de puissance active à pleine échelle en moins de 150 ms lors d'un décrochage brutal de fréquence sous 49.80 Hz.
- Puissance de court-circuit apportée : contrairement aux alternateurs classiques délivrant 5 à 7 In en régime transitoire, les onduleurs BESS sont limités thermiquement et nécessitent des relais de protection adaptés (CEI 60255 fonctions différentielles et impédancemétriques insensibles au faible Icc).`,
    engineering_en: `Critical control engineering metrics and design calculations:
- Virtual inertia constant H_synth: calculated via H = (0.5 × J × ω0²) / S_base, typically calibrated between 2 and 6 seconds matching large hydro alternator inertial behavior.
- Fast Frequency Response (FFR): ramp-to-full-power active power injection within 150 ms upon severe frequency drops below 49.80 Hz.
- Inverter short-circuit fault current: unlike conventional synchronous machines delivering 5 to 7 In during subtransient periods, BESS inverters are thermally capped (1.2 - 1.5 In), requiring specialized directional and differential protection schemes.`,
    formulas: [FORMULAS[11], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'PCS Réversibles & Régulation Primaire du Réseau Interconnecté Nord (RIN Scatec Guider)',
      title_en: 'Bidirectional PCS & Fast Frequency Damping on Cameroon Northern Grid (RIN Scatec Guider)',
      plant_name: 'Sous-station d\'Évacuation Solaire & Stockage de Guider (Mayo-Louti)',
      capacity_mw: 'Convertisseurs PCS : 8 × 1.25 MW (10 MW total) raccordés au transformateur 30 kV',
      river_or_location: 'Guider, Région du Nord Cameroun',
      operators: 'Scatec / Eneo Direction Production & Dispatching Régional',
      voltage_specs: 'Bus DC 1500 V ↔ Sortie AC 690 V ↔ Transformateur élévateur 30 kV',
      notes_fr: 'Les convertisseurs PCS de Guider sont équipés de fonctions de réglage ultra-rapide P-f permettant d\'amortir les fortes oscillations de fréquence du Réseau Interconnecté Nord provoquées par les aléas de turbinage à la centrale hydroélectrique de Lagdo.',
      notes_en: 'Guider PCS inverter units deploy ultra-fast P-f droop regulation damping volatile frequency swings across Cameroon northern interconnected grid caused by hydrological fluctuations at Lagdo dam.',
      status: 'verified',
      source: 'Spécification technique convertisseurs Scatec Guider RIN 2026'
    },
    international_case: {
      title_fr: 'Système Grid-Forming Black-Start de Dalrymple ESCRI-SA 30 MW / 8 MWh (Australie)',
      title_en: 'Dalrymple ESCRI-SA 30 MW / 8 MWh Grid-Forming Black-Start BESS (South Australia)',
      location: 'Australie du Sud',
      capacity_mw: '30 MW / 8 MWh',
      key_features: 'Premier grand BESS Grid-Forming connecté au réseau de transport capable d\'alimenter un réseau insulaire de 60 km en îloté complet sans aucune machine synchrone.'
    }
  },

  'D10.03': {
    subdomain_code: 'D10.03',
    concept_fr: `L'infrastructure de recharge pour véhicules électriques (IRVE) à haute puissance et l'intégration Vehicle-to-Grid (V2G) relient le secteur des transports au réseau électrique. Les stations de recharge ultra-rapide en courant continu (HPC - High Power Charging de 150 kW à 350 kW) posent des défis d'ingénierie électrique majeurs : appel de puissance instantané colossal susceptible de surcharger les postes sources HTA/BT, dégradation du facteur de puissance, et harmoniques de commutation. Les architectures modernes intègrent un tampon BESS local et le protocole normalisé ISO 15118 (Plug & Charge et gestion bidirectionnelle du flux).`,
    concept_en: `High-Power Electric Vehicle Charging Infrastructure (IRVE / EVSE) and Vehicle-to-Grid (V2G) bidirectional integration fuse the transportation sector with utility power grids. Ultra-fast DC High Power Charging (HPC rated from 150 kW to 350 kW) introduces critical power system challenges: massive coincidental demand spikes threatening local MV/LV substation transformers, power factor degradation, and high-order harmonic pollution. Modern charging plazas deploy local stationary BESS energy buffers and standardized ISO 15118 protocols (Plug & Charge and bidirectional V2G scheduling).`,
    systems_fr: `Une station de recharge ultra-rapide DC haute puissance intègre :
1. Étage redresseur Actif Front-End (AFE) : pont IGBT/SiC triphasé 400 V AC vers bus continu intermédiaire 800 V DC assurant un facteur de puissance unitaire (cos φ = 0.99) et un THDi < 3%.
2. Convertisseurs DC-DC bidirectionnels isolés : topologie Dual Active Bridge (DAB) ou résonante LLC avec transformateur haute fréquence en ferrite assurant l'isolation galvanique de sécurité de 4 kV.
3. Câbles de charge refroidis par liquide : connecteurs CCS Combo 2 avec circuit fermé de liquide caloporteur permettant de faire passer 500 A continus sous 800 V sans échauffement dangereux.
4. Système de gestion dynamique de la charge (DLM) : contrôleur temps réel mesurant le courant résiduel du transformateur d'alimentation et modulant la puissance allouée à chaque borne pour éviter tout déclenchement amont.`,
    systems_en: `An ultra-fast High Power DC Charging Plaza deploys:
1. Active Front-End (AFE) rectifier stage: three-phase 400 V AC to 800 V DC IGBT/SiC converter maintaining unity power factor (cos φ = 0.99) and THDi < 3%.
2. Isolated bidirectional DC-DC converters: Dual Active Bridge (DAB) or LLC resonant topologies with high-frequency planar ferrite transformers providing 4 kV galvanic safety isolation.
3. Liquid-cooled charging cables: CCS Combo-2 dispensers with circulating liquid cooling loops sustaining continuous 500 A current under 800 V without excessive thermal rise.
4. Dynamic Load Management (DLM) controller: real-time edge controller monitoring feeder transformer capacity and dynamically throttling charging dispenser setpoints to prevent breaker tripping.`,
    engineering_fr: `Critères de dimensionnement et conformité réseau :
- Bilan de puissance et foisonnement (ks) : calcul de la puissance souscrite P = Σ P_borne × ks, avec facteur de simultanéité ks décroissant de 1.0 (1-2 bornes) à 0.65 pour un parc de 10 bornes HPC.
- Atténuation des creux de tension : utilisation d'un conteneur BESS local 500 kWh en tampon pour absorber les appels de courant des véhicules lors des démarrages de charge rapide.
- Sécurité des personnes : surveillance continue de l'isolement DC (contrôleur d'isolement CPI selon CEI 61851-23), déconnexion automatique en moins de 100 ms en cas de défaut de terre DC (> 100 Ω/V).`,
    engineering_en: `Engineering sizing benchmarks and grid compliance:
- Power capacity and diversity factor (ks): subscribed grid service connection P = Σ P_evse × ks, with coincidental diversity factor ks scaling from 1.0 (1-2 dispensers) down to 0.65 for a 10-bay HPC plaza.
- Voltage dip mitigation: stationary 500 kWh containerized BESS buffer shaving vehicle inrush charging spikes and buffering grid peak demand.
- Personnel & vehicle safety: continuous DC insulation monitoring (IMD per IEC 61851-23), automatically disconnecting DC supply within 100 ms during ground faults (> 100 Ω/V threshold).`,
    formulas: [FORMULAS[11], FORMULAS[6]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Hub de Recharge Électrique Flotte Urbaine & Tampon Solaire (Projet Pilote Douala / Yaoundé)',
      title_en: 'Douala-Yaoundé Urban Fleet Electric Charging Hub & Solar-Battery Microgrid',
      plant_name: 'Station Pilote IRVE avec Tampon Solaire & BESS (Douala Port)',
      capacity_mw: 'Puissance installée : 4 × 150 kW DC Fast Chargers + 200 kWh BESS Tampon',
      river_or_location: 'Zone Portuaire & Logistique de Douala (Littoral Cameroun)',
      operators: 'Opérateur Logistique Portuaire & Eneo Partenariat Flotte Propre',
      voltage_specs: 'Poste dédié 15 kV / 400 V 800 kVA + bus DC 800 V',
      notes_fr: 'Pour éviter de saturer le réseau de distribution 15 kV de Douala lors de la recharge simultanée de plusieurs camions logistiques, la station intègre une batterie tampon BESS de 200 kWh rechargée par ombrières solaires 100 kWc pendant la journée.',
      notes_en: 'To prevent overloading the municipal 15 kV distribution grid during simultaneous rapid charging of logistics fleet trucks in Douala, the charging hub integrates a 200 kWh stationary BESS recharged by 100 kWp rooftop solar canopies.',
      status: 'verified',
      source: 'Étude d\'ingénierie préliminaire Eneo & PAD Mobilité Électrique 2026'
    },
    international_case: {
      title_fr: 'Hub Mega-Watt Charging System (MCS) d\'Amsterdam Schiphol & Ionity 350 kW (Europe)',
      title_en: 'Amsterdam Schiphol Megawatt Charging System (MCS) & Ionity 350 kW Ultra-Fast Network',
      location: 'Pays-Bas / Allemagne',
      capacity_mw: 'Stations de recharge jusqu\'à 3.75 MW avec tampon batterie 2 MWh',
      key_features: 'Système MCS délivrant jusqu\'à 1250 V et 3000 A pour camions lourds électriques avec architecture V2G bidirectionnelle.'
    }
  },

  'D12.01': {
    subdomain_code: 'D12.01',
    concept_fr: `Les systèmes SCADA (Supervisory Control and Data Acquisition), EMS (Energy Management System) et DMS (Distribution Management System) constituent le système nerveux central de l'exploitation des réseaux électriques. Ils permettent aux opérateurs de dispatching de surveiller en temps réel des milliers de mesures de puissance, tension et fréquence, de télécommander les disjoncteurs haute tension, d'optimiser le plan de production des centrales hydroélectriques et de réagir instantanément face aux incidents de réseau.`,
    concept_en: `SCADA (Supervisory Control and Data Acquisition), EMS (Energy Management System), and DMS (Distribution Management System) constitute the centralized nervous system of modern electric utilities. They empower dispatch operators to monitor thousands of telemetry variables (active/reactive power flows, bus voltages, system frequency), remotely operate high-voltage switchgear, schedule generation across cascading hydro dams, and execute automated grid defense schemes.`,
    systems_fr: `L'architecture de téléconduite nationale comprend :
1. Unités terminales distantes (RTU) et calculateurs de poste : installés dans les postes 225 kV, 90 kV et 30 kV pour collecter les états logiques (Télésignalisations TS), les mesures analogiques (Télémesures TM) et exécuter les Télécommandes (TC).
2. Protocoles de télécommunication standardisés : CEI 60870-5-104 (sur liaison Ethernet TCP/IP via fibres optiques OPGW), CEI 60870-5-101 (liaisons séries de secours), et DNP3.
3. Serveurs SCADA / EMS centraux redondants : serveurs d'acquisition frontale (FEP), serveurs de calcul de réseau en temps réel (State Estimator, Optimal Power Flow, Contingency Analysis).
4. Mur d'écrans synoptique et postes de conduite opérateurs : visualisation cartographique dynamique des flux d'énergie avec codes couleur de tension et alarmes prioritaires.`,
    systems_en: `The national SCADA and telemetry hierarchy encompasses:
1. Remote Terminal Units (RTU) and Substation Gateway Controllers: deployed across 225 kV, 90 kV, and 30 kV substations capturing digital status (TS), analog telemetry (TM), and issuing control commands (TC).
2. Standardized utility communication protocols: IEC 60870-5-104 (over IP/Ethernet over OPGW optical lines), IEC 60870-5-101 (serial backup), and DNP3.
3. Dual-redundant Central SCADA / EMS Servers: Front-End Processors (FEP), real-time state estimation solvers, Optimal Power Flow (OPF), and automated N-1 contingency engines.
4. Dispatch video wall and ergonomic operator consoles: dynamic geospatial visualization of power flows with color-coded voltage profiles and acoustic priority alarm queues.`,
    engineering_fr: `Fonctions avancées d'ingénierie EMS :
- Réglage automatique de fréquence et puissance (AGC - Automatic Generation Control) : calcule en boucle fermée l'erreur de réglage de zone (ACE) toutes les 4 secondes et envoie les télé-consignes de puissance aux turbines de Songloulou et Nachtigal.
- Estimation d'état (State Estimation) : filtre les mesures bruitées ou erronées et reconstitue l'état électrique cohérent complet du réseau (angles de phase et amplitudes de tension).
- Analyse de sécurité en temps réel : simule en continu l'impact de la perte fortuite d'un ouvrage (N-1) pour alerter les répartiteurs avant tout risque de surcharge.`,
    engineering_en: `Advanced EMS engineering functionalities:
- Automatic Generation Control (AGC): computes Area Control Error (ACE) every 4 seconds in closed loop, distributing real-time active power setpoints to Songloulou and Nachtigal hydro governors.
- Real-Time State Estimation: filters noisy or corrupt telemetry data, solving positive-definite weighted least squares algorithms to reconstitute the verified electrical grid state.
- Real-Time Contingency Analysis (RTCA): continuously screens N-1 asset loss scenarios, warning dispatchers of post-contingency thermal or voltage violations before they materialize.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Centre National de Conduite du Réseau de Transport (CNCRT Mangombé / SONATREL)',
      title_en: 'SONATREL National Grid Dispatching Center (CNCRT Mangombé)',
      plant_name: 'Centre National de Dispatching de Mangombé (Édéa)',
      capacity_mw: 'Supervision de l\'ensemble du parc national de production (> 1600 MW) et 2500 km de lignes',
      river_or_location: 'Mangombé, Carrefour stratégique Édéa (Région du Littoral)',
      operators: 'SONATREL (Gestionnaire du Réseau de Transport d\'Électricité)',
      voltage_specs: 'Supervision globale 225 kV, 90 kV et interconnexions régionales',
      notes_fr: 'Le dispatching national de Mangombé centralise les données de tous les postes 225 kV et 90 kV du Cameroun via un réseau de fibres optiques OPGW sécurisé. Il gère en temps réel la balance hydro-thermique entre les centrales de la Sanaga (Songloulou, Edéa, Nachtigal) et les centrales thermiques de Douala et Yaoundé.',
      notes_en: 'Mangombé national dispatching center gathers telemetry from every 225 kV and 90 kV substation across Cameroon via resilient OPGW optical fiber backbones. It manages real-time hydro-thermal economic dispatch between Sanaga hydro plants and thermal plants in Douala and Yaoundé.',
      status: 'verified',
      source: 'Rapport d\'activité annuel SONATREL & CNCRT Mangombé 2026'
    },
    international_case: {
      title_fr: 'Centre National de Conduite Réseau RTE de Saint-Denis (France)',
      title_en: 'RTE French National Control Center (Saint-Denis) & PJM Interconnection (USA)',
      location: 'France / États-Unis',
      capacity_mw: 'Supervision continentale > 100 000 MW',
      key_features: 'Plateforme EMS intégrée avec calcul dynamique de capacité de ligne (DLR) et délestage d\'urgence automatisé.'
    }
  },

  'D12.02': {
    subdomain_code: 'D12.02',
    concept_fr: `Les protocoles de téléconduite constituent le socle d'échange d'informations entre les postes électriques décentralisés (RTU / passerelles SAS) et le centre de dispatching national (SCADA / EMS). La norme internationale CEI 60870-5-104 (ou CEI 104) régit la transmission des télémesures, télésignalisations et télécommandes sur réseau TCP/IP standard via le port TCP dédié 2404 (ou 19999 sécurisé). Contrairement aux protocoles IT classiques orientés requête-réponse (polling), la CEI 104 privilégie la transmission spontanée horodatée sur changement d'état (COS - Change of State) avec seuil d'insensibilité analogique, garantissant une réactivité immédiate sans saturation de la bande passante.`,
    concept_en: `Telecontrol protocols establish the standardized communications fabric between decentralized electrical substations (RTUs / SAS gateways) and the central National Control Center (SCADA / EMS). The international standard IEC 60870-5-104 (IEC 104) governs the bidirectional exchange of telemetries, digital statuses, and telecommands over TCP/IP architectures on dedicated TCP port 2404 (or 19999 for secure TLS). Distinct from query-response polling, IEC 104 operates on high-speed spontaneous transmission on Change of State (COS) with analog deadbands, guaranteeing sub-second event notification without bandwidth congestion.`,
    systems_fr: `Architecture et structure des trames CEI 60870-5-104 :
1. Structure APDU (Application Protocol Data Unit) : composée d'un en-tête APCI (Application Protocol Control Information) de 6 octets (Start byte 0x68, longueur APDU, et 4 octets de champ de contrôle) et d'un corps ASDU (Application Service Data Unit).
2. Formats de trames APCI :
   - Format I (Information) : transporte les données applicatives ASDU avec numérotation d'émission N(S) et de réception N(R).
   - Format S (Supervisory) : acquitte les trames d'information reçues via le compteur N(R) sans transporter de données applicatives.
   - Format U (Unnumbered) : gère le contrôle de liaison sans numérotation (STARTDT pour activer le transfert, STOPDT pour suspendre, TESTFR pour tester la connectivité périodique).
3. Structure de l'ASDU : identificateur de type (Type ID), qualificateur de structure variable (VSQ), cause de transmission (COT : 3=spontané, 6=activation, 7=confirmation, 20=interrogation générale), adresse commune de liaison (COA), adresse d'objet d'information (IOA sur 3 octets), et ensemble valeur + descripteur de qualité.
4. Types d'ASDU normalisés : Type 1 (Télésignalisation simple M_SP_NA_1), Type 3 (Télésignalisation double M_DP_NA_1 pour disjoncteur avec états intermédiaire/déterminé), Type 9/13 (Télémesure flottante normalisée/courte M_ME_NC_1), Type 45/46 (Télécommande simple/double C_SC_NA_1, C_DC_NA_1 avec sélection SBO), Type 100 (Interrogation générale C_IC_NA_1).`,
    systems_en: `IEC 60870-5-104 protocol anatomy and operational layers:
1. APDU (Application Protocol Data Unit) Frame Structure: comprised of a 6-byte APCI (Application Protocol Control Information) header (Start byte 0x68, APDU payload length, and 4 control field bytes) followed by an optional ASDU (Application Service Data Unit).
2. APCI Framing Formats:
   - I-Format (Information transfer): carries operational ASDU payloads, sequenced by send sequence number N(S) and receive sequence number N(R).
   - S-Format (Supervisory functions): acknowledges received information frames via receive sequence count N(R) without ASDU data.
   - U-Format (Unnumbered control functions): controls link operational state (STARTDT to enable data traffic, STOPDT to pause, TESTFR to verify link keep-alive).
3. ASDU Data Model: Type Identifier, Variable Structure Qualifier (VSQ), Cause of Transmission (COT: 3=spontaneous, 6=activation, 7=activation-confirmation, 20=interrogated), Common Address of ASDU (COA), Information Object Address (IOA on 3 bytes), and payload values with Quality Descriptors (IV=invalid, NT=non-topical, SB=substituted, BL=blocked, OV=overflow).
4. Standardized ASDU Types: Type 1 (Single point status M_SP_NA_1), Type 3 (Double point switchgear status M_DP_NA_1 with 00=intermediate, 01=open, 10=closed, 11=invalid), Type 9/13 (Short floating point telemetry M_ME_NC_1), Type 45/46 (Single/Double telecommands C_SC_NA_1, C_DC_NA_1 with Select-Before-Operate bit), and Type 100 (General Interrogation C_IC_NA_1).`,
    engineering_fr: `Règles d'ingénierie et sécurisation des télécommandes :
- Protocole SBO (Select Before Operate) : obligatoire pour toute télécommande haute tension (225 kV, 90 kV, 30 kV). Étape 1 : envoi d'une commande d'armement avec bit S/E = 1 (Select). Le contrôleur BCU vérifie les interverrouillages et verrouille la ressource pendant une fenêtre de temporisation (ex. 10 s) en renvoyant une confirmation COT=7. Étape 2 : envoi de la commande d'exécution avec bit S/E = 0 (Execute). Si le délai expire ou si l'ordre est invalide, la commande est avortée sans manœuvre physique.
- Horodatage CP56Time2a : structure binaire sur 7 octets intégrant millisecondes (0-59999), minutes, heures (avec drapeau heure d'été SU), jour du mois, jour de la semaine (1-7), mois, et année (0-99). Permet une précision chronologique absolue à 1 ms pour la reconstitution d'incidents (SOE - Sequence of Events).
- Temporisations réseau CEI 104 : temporisation d'acquittement t1 = 15 s, temporisation d'envoi d'acquittement sans données t2 = 10 s, temporisation de trame de test t3 = 20 s, nombre max de trames non acquittées k = 12, fenêtre d'acquittement w = 8.`,
    engineering_en: `Engineering telecontrol rules and execution mechanics:
- SBO (Select Before Operate) Sequence: mandatory for all high-voltage switchgear operations. Phase 1: arming command sent with S/E bit = 1 (Select). Substation BCU executes safety logic checks, reserves the command latch, and returns an activation-confirmation (COT=7) within an arming timer (e.g. 10 s). Phase 2: execution command sent with S/E bit = 0 (Execute). If the timeout lapses or an invalid command is received, the sequence aborts without physical breaker coil energization.
- CP56Time2a 7-Byte Timestamp: encodes milliseconds (0-59999), minutes (with Invalid flag IV), hours (with Summer Time flag SU), day of month, day of week (1-7), month, and year (0-99). Guarantees 1 ms chronological timestamping across decentralized substations for Sequence of Events (SOE) forensic reconstruction.
- IEC 104 Network Timers: acknowledgement timeout t1 = 15 s, idle acknowledgement timeout t2 = 10 s, test frame keep-alive timeout t3 = 20 s, maximum unacknowledged frame backlog k = 12, acknowledgement window size w = 8.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Réseau de Téléconduite CEI 60870-5-104 de SONATREL (Postes 225 kV de Bekoko & Oyomabang)',
      title_en: 'SONATREL National IEC 60870-5-104 Telecontrol Network (Bekoko & Oyomabang 225 kV Substations)',
      plant_name: 'Postes d\'interconnexion 225 kV de Bekoko (Douala) et Oyomabang (Yaoundé)',
      capacity_mw: 'Téléconduite de plus de 45 travées haute tension et 12 transformateurs de puissance',
      river_or_location: 'Littoral / Centre, Cameroun',
      operators: 'SONATREL (Opérateur de transport)',
      voltage_specs: '225 kV / 90 kV / 15 kV',
      notes_fr: 'Chaque poste 225 kV dispose d\'une passerelle de téléconduite redondante (châssis RTU / BCU) communiquant en protocole CEI 60870-5-104 avec le Centre National de Conduite de Mangombé via des liaisons optiques OPGW sécurisées par tunnels IPsec. Les temps de transmission télémesures sont inférieurs à 500 ms et les télécommandes SBO s\'exécutent en moins de 1.5 seconde.',
      notes_en: 'Each 225 kV substation features dual-redundant telecontrol gateways (RTU / BCU chassis) communicating via IEC 60870-5-104 to the Mangombé National Control Center over resilient OPGW fiber links encapsulated in IPsec tunnels. Telemetry transmission latency remains below 500 ms with SBO command execution under 1.5 seconds.',
      status: 'verified',
      source: 'Spécifications Techniques Téléconduite SONATREL & Eneo 2026'
    },
    international_case: {
      title_fr: 'Réseau de Téléconduite National RTE & National Grid UK (CEI 60870-5-104)',
      title_en: 'RTE & National Grid UK IEC 60870-5-104 Dispatch Telemetry Backbone',
      location: 'Europe',
      capacity_mw: 'Supervision de plus de 1500 postes de transport',
      key_features: 'Réseau IP/MPLS dédié avec redondance double attachement, encapsulation CEI 104 sur TLS sécurisé (CEI 62351-3) et passerelles protocolaires DNP3/104.'
    }
  },

  'D12.03': {
    subdomain_code: 'D12.03',
    concept_fr: `La sécurité opérationnelle et l'intégrité d'un poste électrique reposent sur des automatismes stricts de verrouillage logique (Interlocking) et de synchro-contrôle (ANSI 25). Les sectionneurs haute tension n'ayant aucun pouvoir de coupure en charge, toute manœuvre sous courant de charge engendrerait un arc électrique destructeur et mortel. Les contrôleurs de travée (BCU) et automates programmables exécutent des équations logiques booléennes en temps réel pour interdire physiquement toute fausse manœuvre. Parallèlement, le relais de synchronisme (ANSI 25) valide que deux sous-réseaux ou générateurs présentent des tensions, fréquences et angles de phase parfaitement alignés avant d'autoriser la fermeture du disjoncteur d'interconnexion.`,
    concept_en: `Operational safety and equipment integrity in electrical substations depend upon deterministic logic interlocking and automated synchrocheck (ANSI 25) schemes. Because high-voltage disconnectors possess zero on-load breaking capability, operating a disconnector under load produces an explosive electric arc that destroys switchgear and imperils personnel. Bay Control Units (BCUs) and industrial PLCs enforce rigorous real-time Boolean interlocking equations. Concurrently, synchrocheck controllers (ANSI 25) verify that voltages, frequencies, and phase angle differences across open breakers fall strictly within permissive tolerances prior to granting a close permissive pulse.`,
    systems_fr: `Systèmes de verrouillage et de contrôle de synchronisme :
1. Matrice d'interverrouillage logique de travée (Bay Interlocking) :
   - Sectionneur de ligne 89L : fermeture autorisée SI ET SEULEMENT SI le disjoncteur 52 est OUVERT ET le sectionneur de terre 89E est OUVERT.
   - Sectionneur de terre 89E : fermeture autorisée SI ET SEULEMENT SI le sectionneur de ligne 89L est OUVERT ET la tension ligne est nulle (détectée par le TT ligne < 0.1 Un).
   - Transfert de jeu de barres sous charge (Jeu A vers Jeu B) : fermeture du sectionneur 89B autorisée avec 89A fermé SI ET SEULEMENT SI le disjoncteur de couplage de barres est FERMÉ.
2. Équations vectorielles de synchronisme (ANSI 25) :
   - Écart d'amplitude de tension : |ΔU| = |Ubus - Uline| ≤ ΔUmax (seuil typique 5% à 10% Un).
   - Écart de fréquence (glissement) : |Δf| = |fbus - fline| ≤ Δfmax (seuil typique 0.05 Hz à 0.15 Hz).
   - Déphasage angulaire : |Δδ| = |δbus - δline| ≤ Δδmax (seuil typique 10° à 20°).
   - Calcul de l'angle d'anticipation de fermeture disjoncteur : δlead = 360° · Δf · tclose (où tclose est le temps mécanique d'enclenchement du disjoncteur, typiquement 60 à 80 ms).
3. Automates de délestage fréquentiel d'urgence (UFLS - Under-Frequency Load Shedding) :
   - Déclenchement automatique par paliers de fréquence (ex. Palier 1 à 49.5 Hz, Palier 2 à 49.0 Hz, Palier 3 à 48.5 Hz) avec délestage instantané de départs non prioritaires pour stopper la chute de fréquence et éviter l'écroulement généralisé du réseau.`,
    systems_en: `Interlocking mechanisms and synchrocheck automation layers:
1. Bay-Level Logic Interlocking Matrix:
   - Line Disconnector 89L: Close permissive granted IF AND ONLY IF Circuit Breaker 52 is OPEN AND Earth Switch 89E is OPEN.
   - Earth Switch 89E: Close permissive granted IF AND ONLY IF Line Disconnector 89L is OPEN AND residual line voltage (measured via line VT) is below 0.1 Un (Dead Line condition).
   - On-load Busbar Selection (Bus A to Bus B Transfer): Closing 89B while 89A is closed is permitted IF AND ONLY IF the Bus Coupler circuit breaker is CLOSED with both bus coupler disconnectors CLOSED.
2. ANSI 25 Synchrocheck Mathematical Conditions:
   - Voltage magnitude deviation: |ΔU| = |Ubus - Uline| ≤ ΔUmax (standard threshold 5% to 10% of rated voltage Un).
   - Frequency slip deviation: |Δf| = |fbus - fline| ≤ Δfmax (standard threshold 0.05 Hz to 0.15 Hz).
   - Phase angle displacement: |Δδ| = |δbus - δline| ≤ Δδmax (standard threshold 10° to 20°).
   - Predictive Closing Lead Angle: accounts for breaker mechanical closing latency tclose (typically 60 to 80 ms): δlead = 360° · Δf · tclose.
3. Under-Frequency Load Shedding (UFLS) Automation:
   - Automatic multi-stage frequency trip relays (e.g. Stage 1 at 49.5 Hz, Stage 2 at 49.0 Hz, Stage 3 at 48.5 Hz) shedding non-essential feeder blocks instantaneously to arrest rapid frequency degradation and halt blackout cascades.`,
    engineering_fr: `Prescriptions de sécurité et modélisation des boucles d'automatisme :
- Verrouillages distribués par trames GOOSE CEI 61850 : les états de position des sectionneurs et disjoncteurs sont diffusés en multicast direct sur le bus de station en moins de 3 ms, remplaçant des centaines de kilomètres de filerie cuivre fil-à-fil. En cas de perte de communication GOOSE (> 100 ms), l'automate BCU se place immédiatement en état de repli sécurisé (Interlock Fail-Safe).
- Détection de ligne morte / barre morte (Dead Line / Dead Bus - DLDB) : permet l'enclenchement d'un disjoncteur sans vérification de synchronisme lorsque l'un des côtés est hors tension et que l'autre est sous tension nominale.
- Protection contre le refus de disjoncteur (ANSI 50BF - Breaker Failure) : temporisation de confirmation (150 ms) surveillant la retombée des contacts auxiliaires ou du courant après émission d'un ordre de déclenchement; en cas de refus d'ouverture, envoi instantané d'un ordre de déclenchement généralisé à tous les disjoncteurs adjacents de la barre.`,
    engineering_en: `Safety specifications and control loop modeling:
- Distributed GOOSE Interlocking (IEC 61850): switchgear auxiliary contact positions are broadcast peer-to-peer across the station bus in under 3 ms, eliminating miles of hardwired inter-panel copper cabling. Upon GOOSE link heartbeat loss (> 100 ms), the receiving BCU reverts to an interlocking fail-safe lockout state.
- Dead Line / Dead Bus (DLDB) Logic: permits immediate breaker closing without synchronism checking whenever one side is confirmed unenergized (< 0.1 Un) while the opposing side is energized at nominal voltage.
- Breaker Failure Protection (ANSI 50BF): an integrated timer loop (150 ms) monitors current extinction and contact auxiliary state following a trip pulse. If the breaker fails to clear, an instantaneous back-trip triggers all adjacent busbar breakers via GOOSE or trip bus wiring.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Automates de Synchro-contrôle & Délestage UFLS du Poste d\'Édéa / Mangombé',
      title_en: 'Edéa / Mangombé Substation Synchrocheck & Emergency UFLS Automation Schemes',
      plant_name: 'Poste d\'évacuation 225 kV d\'Édéa & Dispatching National Mangombé',
      capacity_mw: 'Interconnexion hydroélectrique de 460 MW (Centrales d\'Edéa et Songloulou)',
      river_or_location: 'Édéa, Fleuve Sanaga, Cameroun',
      operators: 'SONATREL / Eneo Cameroun',
      voltage_specs: '225 kV / 90 kV',
      notes_fr: 'Le couplage des lignes 225 kV reliant Songloulou à Mangombé et Logbaba fait l\'objet d\'une vérification synchrocheck stricte ANSI 25 afin d\'éviter les à-coups de couple destructeurs sur les alternateurs de Songloulou. En cas d\'incident majeur sur la ligne 225 kV Songloulou-Mangombé, les automates UFLS délestent automatiquement 80 MW de charge à Douala pour préserver la stabilité du Réseau Interconnecté Sud.',
      notes_en: 'Synchronization of 225 kV lines interconnecting Songloulou to Mangombé and Logbaba is governed by strict ANSI 25 synchrocheck checks to prevent destructive shaft torsional stress on Songloulou hydro generators. Upon catastrophic tripping of the 225 kV line, high-speed UFLS automations shed 80 MW of load across Douala to salvage Southern Interconnected Grid stability.',
      status: 'verified',
      source: 'Plan de Défense du Réseau Interconnecté Sud (RIS) SONATREL 2026'
    },
    international_case: {
      title_fr: 'Système d\'Interverrouillage et Synchro-contrôle Statnett (Norvège) & Hydro-Québec',
      title_en: 'Statnett (Norway) & Hydro-Québec Centralized Synchrocheck & Defense Scheme',
      location: 'Norvège / Canada',
      capacity_mw: 'Gestion de plus de 40 000 MW de production hydroélectrique',
      key_features: 'Couplage automatique de grands réseaux asynchrones via convertisseurs HVDC et relais synchrocheck numériques à temps d\'anticipation adaptatif.'
    }
  },

  'D12.04': {
    subdomain_code: 'D12.04',
    concept_fr: `Au sommet de la pyramide d'exploitation des réseaux électriques se trouvent les centres de dispatching nationaux équipés de systèmes EMS (Energy Management System) pour le transport et DMS (Distribution Management System) pour la distribution. Ces plateformes logicielles hautement résilientes traitent des millions de points de données par minute pour exécuter l'estimation d'état du réseau (State Estimation), le calcul de contingence en temps réel (RTCA N-1) et le réglage automatique de fréquence-puissance (AGC - Automatic Generation Control). Face à l'interconnexion croissante des réseaux informatiques industriels, la cybersécurité des systèmes OT (Operational Technology) selon la norme internationale CEI 62351 est devenue une exigence absolue de sécurité nationale pour contrer les cyberattaques visant les infrastructures critiques.`,
    concept_en: `At the apex of power system operations stand National Control Centers powered by enterprise Energy Management Systems (EMS) for transmission and Distribution Management Systems (DMS) for distribution grids. These fault-tolerant software suites ingest millions of telemetry data points per minute to execute real-time state estimation, N-1 contingency screening, and closed-loop Automatic Generation Control (AGC). With modern OT architectures converging with IP networks, operational technology cybersecurity per the IEC 62351 standard is a non-negotiable imperative of national energy security protecting critical power infrastructure from cyber warfare and unauthorized intrusion.`,
    systems_fr: `Composants du Dispatching National et Cybersécurité CEI 62351 :
1. Fonctions logicielles du système EMS :
   - Estimation d'état pondérée (WLS State Estimator) : filtre les bruits de mesure et détecte les données erronées (Bad Data Detection) pour fournir un état électrique validé complet (amplitudes et angles de phase à chaque nœud du réseau).
   - Réglage Fréquence-Puissance AGC : calcule l'erreur de réglage de zone ACE = (Pinter - Pprogramme) + 10 · B · (f - f0) et envoie des télé-consignes de puissance active toutes les 4 secondes aux groupes de régulation.
   - Dispatching économique et flux de puissance optimal (OPF - Optimal Power Flow) : minimise les coûts de combustible tout en respectant les limites thermiques des lignes et les profils de tension.
2. Architecture de Cybersécurité OT (CEI 62351) :
   - CEI 62351-3 : sécurisation des communications TCP/IP (chiffrement TLS 1.3 avec certificats X.509 pour les flux CEI 60870-5-104 sur port 19999).
   - CEI 62351-5 : authentification des télécommandes CEI 104 par codes d'authentification de message (HMAC-SHA256) pour bloquer les attaques par rejeu et l'injection d'ordres frauduleux.
   - CEI 62351-6 : intégrité des trames GOOSE et Sampled Values sans dégradation de la latence sub-milliseconde.
   - Cloisonnement réseau en zones et conduits (CEI 62443) : pare-feu industriels durcis, DMZ de poste, et inspection approfondie des paquets (DPI).`,
    systems_en: `National Dispatching Engine & IEC 62351 OT Cybersecurity Stack:
1. Core EMS Algorithmic Engines:
   - Weighted Least Squares (WLS) State Estimator: filters measurement noise and executes Chi-Square bad data detection to reconstruct the complete bus voltage magnitude and phase angle profile.
   - Automatic Generation Control (AGC): computes Area Control Error ACE = (Ptie - Pscheduled) + 10 · B · (f - f0), generating continuous secondary frequency regulation pulses dispatched to regulating hydro units every 4 seconds.
   - Optimal Power Flow (OPF): continuously minimizes generation fuel expenditure while satisfying line ampacity ratings, transformer MVA limits, and bus voltage bounds.
2. IEC 62351 Industrial OT Cybersecurity Framework:
   - IEC 62351-3: TCP/IP Transport Layer Security (TLS 1.3 encapsulation with mutual X.509 certificate authentication for IEC 60870-5-104 on port 19999).
   - IEC 62351-5: Cryptographic challenge-response and HMAC-SHA256 message authentication codes on telecommands, neutralizing replay and packet spoofing exploits.
   - IEC 62351-6: Message authentication and digital signatures for IEC 61850 GOOSE and SV without violating ultra-low latency deadlines.
   - Network Segmentation & Zones (IEC 62443): ruggedized industrial firewalls, substation DMZ architecture, and Deep Packet Inspection (DPI) rule engines.`,
    engineering_fr: `Principes de défense et résilience opérationnelle :
- Modélisation CIM (Common Information Model CEI 61970/61968) : échange standardisé des modèles de réseau entre le SCADA, les outils de simulation de réseau (PSS/E, PowerFactory) et le marché de l'électricité.
- Continuité d'activité et redondance géographique : déploiement d'un site de repli d'urgence (Backup Control Center) distant géographiquement avec réplication synchrone des bases de données temps réel.
- Journalisation d'audit inviolable (Syslog sécurisé CEI 62351-8) : traçabilité cryptographique de toutes les actions d'opérateurs, connexions de maintenance et tentatives d'accès non autorisées.`,
    engineering_en: `Operational resilience and defense architecture:
- CIM (Common Information Model per IEC 61970/61968): vendor-neutral XML/RDF representation of network topology, facilitating seamless model exchange across SCADA, EMS, planning engines, and regional market operators.
- Disaster Recovery & Geographic Dual-Redundancy: fully mirrored Emergency Backup Control Center situated in an independent geographical zone with zero-loss synchronous database clustering.
- Tamper-Evident Security Logging (IEC 62351-8): cryptographically signed Syslog audit trails archiving every operator dispatch, maintenance session, and anomalous telemetry packet for forensic accountability.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Centre National de Conduite Réseau de Mangombé (SONATREL) & Système ADMS Eneo Koumassi',
      title_en: 'SONATREL National Dispatching Center (Mangombé) & Eneo Koumassi ADMS (Douala)',
      plant_name: 'Centre National de Conduite (CNCRT Mangombé) & Dispatching de Koumassi',
      capacity_mw: 'Supervision globale de 1600 MW de production et réseau de distribution de 2.5 millions d\'usagers',
      river_or_location: 'Édéa & Douala, Cameroun',
      operators: 'SONATREL / Eneo Cameroun',
      voltage_specs: '225 kV, 90 kV (Transport) / 30 kV, 15 kV (Distribution)',
      notes_fr: 'Le CNCRT de Mangombé assure l\'équilibrage offre-demande national en pilotant les débits turbinés sur la Sanaga (Nachtigal, Songloulou, Édéa) et l\'appoint thermique de Douala/Limbé. À Douala, le dispatching de Koumassi exploite un système ADMS avec automatisme FLISR permettant de localiser un défaut sur le réseau 30 kV souterrain, d\'isoler le tronçon défaillant par télécommande et de réalimenter les clients sains en moins de 3 minutes.',
      notes_en: 'Mangombé CNCRT oversees nationwide generation-load balance, regulating hydro dispatch along the Sanaga river (Nachtigal, Songloulou, Edéa) and balancing thermal reserves. In Douala, the Koumassi dispatching operates an advanced ADMS with FLISR self-healing automation, pinpointing underground 30 kV cable faults, isolating faulty cable sections via remote telecommand, and restoring power to healthy customers in under 3 minutes.',
      status: 'verified',
      source: 'Plan de Modernisation Téléconduite & SCADA Cameroun 2026'
    },
    international_case: {
      title_fr: 'Analyse Forensic de la Cyberattaque sur le Réseau Électrique Ukrainien (2015) & Contre-Mesures',
      title_en: 'Forensic Case Study: 2015 Ukraine Power Grid Cyberattack & IEC 62351 Countermeasures',
      location: 'Oblast d\'Ivano-Frankivsk, Ukraine / International',
      capacity_mw: 'Perte de 225 MW de charge et coupure de 230 000 consommateurs pendant 6 heures',
      key_features: 'Attaque coordonnée par malware BlackEnergy, prise de contrôle à distance de postes SCADA, émission de télécommandes malveillantes d\'ouverture de disjoncteurs et neutralisation des UPS de secours. A conduit à l\'adoption mondiale du chiffrement obligatoire CEI 62351 et de l\'authentification multi-facteurs sur les passerelles RTU.'
    }
  },

  'D13.01': {
    subdomain_code: 'D13.01',
    concept_fr: `Le Bus de Processus selon la norme internationale CEI 61850 constitue la transformation technologique la plus radicale des postes haute tension depuis un siècle. En remplaçant les faisceaux massifs de câbles cuivre blindés acheminant les signaux analogiques secondaires 100 V et 1 A/5 A depuis les réducteurs de mesure vers les relais par des liaisons à fibres optiques numériques, le bus de processus élimine le risque d'explosion mortelle par ouverture accidentelle de circuits de TC, supprime la chute de tension inductive dans les fileries, et immunise totalement la chaîne de mesure contre les perturbations électromagnétiques de manœuvre (foudre, commutation SF6). Les grandeurs instantanées sont numérisées directement au pied des appareils HTB par des boîtiers de regroupement appelés Merging Units (MU) ou des capteurs non-conventionnels NCIT (Rogowski et effet Faraday optique) et diffusées en continu sous forme de flux de valeurs échantillonnées (Sampled Values - SV).`,
    concept_en: `The IEC 61850 Process Bus represents the most profound paradigm shift in high-voltage substation engineering in over a century. By substituting heavy, bundled copper secondary cables carrying analog 100 V and 1 A/5 A signals from instrument transformers with optical fiber ethernet backbones, the process bus eliminates catastrophic CT open-circuit lethal explosive hazards, eradicates inductive voltage drop across lengthy cable runs, and provides total electromagnetic immunity against switching surges and lightning transient ground potential rise. Instantaneous analog quantities are digitized directly in switchyard marshalling kiosks by Merging Units (MUs) or Non-Conventional Instrument Transformers (NCITs, such as Rogowski coils and optical Faraday effect sensors) and streamed continuously as Sampled Values (SV) packets.`,
    systems_fr: `Composants matériels et protocoles du Bus de Processus :
1. Trames de Valeurs Échantillonnées (Sampled Values - SV) selon CEI 61850-9-2LE / CEI 61869-9 :
   - Échantillonnage à 4000 Hz (80 échantillons par période à 50 Hz, soit 1 trame Ethernet toutes les 250 μs) pour les fonctions de protection classique et de mesure.
   - Échantillonnage haute résolution à 12800 Hz ou 14400 Hz (256 éch./période) pour la qualité de l'onde électrique et l'enregistrement de transitoires rapides.
   - Dataset standardisé 9-2LE : 4 courants (Ia, Ib, Ic, In) codés sur 32 bits en centièmes d'ampère + 4 tensions (Va, Vb, Vc, Vn) en centièmes de volt avec attributs de qualité (Validity, Overflow, BadReference).
2. Merging Units (MU) et Capteurs Non-Conventionnels (NCIT) :
   - Bobines de Rogowski : mesure de courant par dérivation temporelle di/dt sans circuit magnétique, insaturables jusqu'à 100 kA (aucun risque de saturation en court-circuit).
   - Réducteurs optiques à effet Faraday : rotation de l'angle de polarisation de la lumière proportionnelle au champ magnétique du conducteur HTB.
   - Boîtiers Stand-Alone Merging Units (SAMU) : boîtiers d'acquisition durcis IP67 convertissant les sorties des TC/TT conventionnels existants en flux Ethernet optique 100BASE-FX.
3. Synchronisation temporelle absolue : chaque échantillon SV porte un compteur d'échantillon (smpCnt: 0 à 3999) aligné sur l'impulsion 1 PPS / PTP de début de seconde UTC.`,
    systems_en: `Process Bus Hardware Architecture & Digital Streaming Protocols:
1. Sampled Values (SV) Data Framing per IEC 61850-9-2LE / IEC 61869-9:
   - 4000 Hz sampling rate (80 samples per nominal 50 Hz power cycle, streaming 1 Ethernet frame every 250 μs) dedicated to protection and revenue metering.
   - 12800 Hz or 14400 Hz high-resolution sampling (256 samples/cycle) dedicated to digital fault recording (DFR) and power quality transient analysis.
   - Standardized 9-2LE dataset payload: 4 instantaneous currents (Ia, Ib, Ic, In) encoded as 32-bit signed integers in centi-amperes + 4 instantaneous voltages (Va, Vb, Vc, Vn) in centi-volts paired with individual quality bitmasks (Validity, Derived, Test).
2. Merging Units (MUs) & Non-Conventional Instrument Transformers (NCITs):
   - Rogowski Coils: di/dt coreless mutual inductance measurement offering absolute linearity up to 100 kA through-faults with zero magnetic saturation risks.
   - Optical Faraday Effect Sensors: magneto-optic crystal measuring polarization plane rotation angle proportional to conductor magnetic field.
   - Stand-Alone Merging Units (SAMUs): field-hardened IP67 conversion modules interfacing legacy 1A/5A CT and 100V VT copper outputs into optical 100BASE-FX Ethernet streams.
3. Nanosecond Time Synchronization: every SV frame embeds a strict 16-bit sample counter (smpCnt: 0 to 3999) phase-locked to UTC via IEEE 1588v2 PTP.`,
    engineering_fr: `Prescriptions d'ingénierie et dimensionnement du réseau de processus :
- Bande passante Ethernet requise : une Merging Unit 9-2LE génère 4000 trames/s de 150 octets, soit un débit soutenu de 4.8 Mbit/s par départ HTB. Sur un poste à 12 travées, le trafic total atteint 57.6 Mbit/s, justifiant un réseau Ethernet commuté optique Gigabit (1000BASE-SX/LX).
- Tolérance de latence de transmission : la latence maximale admissible de transfert d'un paquet SV depuis le capteur jusqu'au filtre numérique du relais est de 2.0 ms (norme CEI 61850-5 classe TT6).
- Indisponibilité et sécurité : un paquet SV manquant ou corrompu est détecté par le saut du compteur smpCnt; au-delà de 2 trames consécutives perdues, le relais bloque les fonctions différentielles pour éviter tout déclenchement intempestif.`,
    engineering_en: `Process Bus Network Engineering & Throughput Sizing:
- Dedicated Bandwidth Calculations: a single 9-2LE Merging Unit streaming at 4000 Hz outputs 150-byte frames, generating a continuous 4.8 Mbps payload stream per HV bay. Across a 12-bay transmission substation, aggregate SV traffic reaches 57.6 Mbps, dictating full Gigabit optical Ethernet architectures (1000BASE-SX/LX).
- Transmission Latency Budget: maximum permissible one-way transit delay from instrument transformer analog sensing to IED digital DSP filtering is capped at 2.0 ms (IEC 61850-5 class TT6).
- Communication Integrity & Loss Mitigation: sample counter discontinuity (smpCnt jumps) immediately flags packet drops; loss of > 2 consecutive samples triggers security inhibit on differential 87 functions to avert false tripping.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Poste Numérique 225 kV de Nachtigal-Amont : Intégration du Bus de Processus Optique',
      title_en: 'Nachtigal 225 kV Hydro Evacuation Substation: Optical Process Bus Integration',
      plant_name: 'Poste d\'Évacuation 225 kV de Nachtigal-Amont (420 MW)',
      capacity_mw: 'Évacuation de 7 groupes de 60 MW via 2 lignes 225 kV vers le poste de Nyom 2 (Yaoundé)',
      river_or_location: 'Nachtigal, Fleuve Sanaga, Région du Centre, Cameroun',
      operators: 'NHPC (Nachtigal Hydro Power Company) / SONATREL',
      voltage_specs: '225 kV / 13.8 kV',
      notes_fr: 'Le poste de Nachtigal-Amont est le premier grand complexe hydroélectrique du Cameroun à intégrer une architecture CEI 61850 moderne avec liaison par fibres optiques entre les cellules blindées GIS 225 kV et la salle de commande centrale. L\'utilisation de bus de données optiques élimine les risques d\'amorçage et de surtensions induites lors des manœuvres de sectionneurs GIS sous SF6.',
      notes_en: 'The Nachtigal 225 kV GIS substation is Cameroon\'s pioneering large-scale hydro facility deploying a modern IEC 61850 digital architecture with optical fiber trunks linking GIS switchgear kiosks to the central relay room. Optical process routing eradicates transient ground potential rise and very fast transient overvoltages (VFTO) during SF6 disconnect switching.',
      status: 'verified',
      source: 'Spécifications Techniques CCN & Télécoms NHPC / SONATREL 2026'
    },
    international_case: {
      title_fr: 'Poste 400 kV "Smart Substation" de Stourport (National Grid, Royaume-Uni)',
      title_en: 'Stourport 400 kV Full Digital Substation Process Bus (National Grid UK)',
      location: 'Stourport-on-Severn, Worcestershire, Royaume-Uni',
      capacity_mw: 'Nœud de transport 400 kV / 275 kV alimentant le bassin industriel des Midlands',
      key_features: 'Premier poste 400 kV sans filerie cuivre secondaire : 100% bus de processus CEI 61850-9-2LE, réducteurs optiques NCIT Faraday et réseau Ethernet optique redondant PRP avec gain de 80% sur les coûts de génie civil et les tranchées de câbles.'
    }
  },

  'D13.02': {
    subdomain_code: 'D13.02',
    concept_fr: `Le Bus de Station selon la norme CEI 61850 assure l'interconnexion horizontale et verticale de tous les équipements électroniques intelligents (IED - Intelligent Electronic Devices) d'un poste électrique. Sur ce réseau local de poste transitent deux types de flux critiques : les messages verticaux de supervision MMS (Manufacturing Message Specification - CEI 61850-8-1 sur TCP/IP port 102) reliant les IED aux IHM et passerelles SCADA, et les messages horizontaux ultra-rapides GOOSE (Generic Object Oriented Substation Events). Les trames GOOSE sont injectées directement dans la couche liaison de données Ethernet (Layer 2, Ethertype 0x88B8) sans passer par les couches réseau et transport IP, garantissant un temps de transfert déterministe inférieur à 3 millisecondes pour les ordres de déclenchement d'urgence, de verrouillage logique de sécurité et de délestage.`,
    concept_en: `The IEC 61850 Station Bus governs peer-to-peer horizontal and vertical data exchange across all Intelligent Electronic Devices (IEDs) inside a power substation. Two core traffic classes share this ruggedized local area network: vertical MMS supervisory streams (Manufacturing Message Specification per IEC 61850-8-1 mapped onto TCP/IP port 102) connecting IEDs to local HMIs and SCADA RTUs, and horizontal ultra-fast GOOSE (Generic Object Oriented Substation Events) multicasts. GOOSE frames bypass TCP/IP networking stacks entirely, injecting directly at Ethernet Data Link Layer 2 (Ethertype 0x88B8) to achieve deterministic sub-3ms delivery deadlines for protection tripping, interlocking assertions, and high-speed load shedding.`,
    systems_fr: `Mécanismes de transmission GOOSE et ingénierie SCL :
1. Trames GOOSE (CEI 61850-8-1) & Priorisation Ethernet :
   - Ethertype dédié 0x88B8 avec balisage de trame VLAN IEEE 802.1Q (priorité PCP = 6 ou 7 pour le trafic de protection critique).
   - Schéma de retransmission exponentielle : lors d'un événement (changement d'état d'un contact ou ordre de déclenchement), le relais émet instantanément la trame GOOSE, puis la réémet après 1 ms, 2 ms, 4 ms, 8 ms jusqu'à un intervalle de battement de cœur stable Tmax (ex: 1000 ms).
   - Numéros de séquence : le numéro d'état (stNum) s'incrémente à chaque nouvel événement physique, tandis que le numéro de séquence (sqNum) compte les répétitions cycliques, garantissant une détection absolue du rejeu et de la perte de paquets.
2. Chaîne d'ingénierie standardisée SCL (Substation Configuration Language - CEI 61850-6) :
   - Fichier ICD (IED Capability Description) : modèle XML fourni par le constructeur décrivant les capacités d'un relais (Logical Nodes, Data Objects, Datasets).
   - Fichier SSD (System Specification Description) : description unifilaire du poste et des fonctions requises.
   - Fichier SCD (Substation Configuration Description) : fichier maître du poste entier intégrant tous les IED, adresses IP, VLAN, abonnements GOOSE et mappings de communication.
   - Fichier CID (Configured IED Description) : extrait compilé injecté dans chaque IED pour paramétrer son fonctionnement réel.`,
    systems_en: `GOOSE Retransmission Mechanics & Standardized SCL Toolchains:
1. GOOSE Protocol Mechanics (IEC 61850-8-1) & Layer-2 Quality of Service:
   - Dedicated Ethertype 0x88B8 accompanied by IEEE 802.1Q VLAN priority tagging (Priority Code Point PCP = 6 or 7 reserved for mission-critical protection packets).
   - Exponential Burst Retransmission Scheme: upon a trip or contact change event, the transmitting IED bursts frames with an immediate t0 interval, followed by t1=1ms, t2=2ms, t3=4ms, exponentially backing off until reaching steady-state heartbeat period Tmax (typically 1000 ms).
   - Dual-Counter Synchronization: the State Number (stNum) increments monotonically strictly on physical status transitions, while Sequence Number (sqNum) counts cyclical heartbeats, preventing packet replay and detecting transmission loss.
2. Standardized SCL Engineering Ecosystem (IEC 61850-6 XML Schema):
   - ICD (IED Capability Description): vendor-authored template outlining supported Logical Nodes, data attributes, and report control blocks.
   - SSD (System Specification Description): single-line substation topology and functional single-line requirements.
   - SCD (Substation Configuration Description): system master configuration aggregating all IED instances, IP subnet allocations, multicast MAC addresses, and GOOSE publisher-subscriber bindings.
   - CID (Configured IED Description): target-compiled configuration artifact downloaded directly into the physical IED firmware.`,
    engineering_fr: `Critères de conception et règles de filtrage réseau :
- Segmentation multicast et filtrage IGMP Snooping : les trames GOOSE utilisant des adresses MAC multicast (01-0C-CD-01-XX-XX), les commutateurs Ethernet de poste (Ethernet Switches durcis selon CEI 61850-3) doivent implémenter le filtrage par VLAN et IGMP Snooping pour éviter la saturation des ports des relais non abonnés.
- Temps de transfert global (CEI 61850-5 Classe P1/P2) : le temps de transfert de bout en bout d'un message GOOSE Type 1A (déclenchement de disjoncteur) ne doit pas dépasser 3 millisecondes, incluant la sérialisation, la traversée des switches et le traitement logiciel récepteur.
- Supervision continue du lien : si aucun battement GOOSE n'est reçu avant expiration du délai TimeAllowedToLive (TAL), le relais récepteur déclare l'IED émetteur défaillant et active une alarme de repli de protection.`,
    engineering_en: `Network Design Criteria & Multicast Filtering Policies:
- Multicast Segregation via IGMP Snooping & VLANs: because GOOSE frames utilize dedicated multicast MAC ranges (01-0C-CD-01-XX-XX), substation-hardened industrial switches (IEC 61850-3 certified) must enforce static VLAN trunking and IGMP Snooping to prevent broadcast packet flooding on irrelevant bay relay ports.
- Total Transmission Latency Budget (IEC 61850-5 Class P1/P2): end-to-end trip time for Type 1A Trip commands must not exceed 3 milliseconds, encompassing DSP serialization, switch port egress queuing, and receiver ASIC interrupt parsing.
- Continuous Health Watchdog: failure to receive a valid GOOSE heartbeat prior to the embedded TimeAllowedToLive (TAL) expiration immediately trips a communication failure alarm and commands receiving interlocks to a fail-safe state.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Poste 225 kV de Bekoko (Douala) : Remplacement de la Filerie Cuivre par Trames GOOSE',
      title_en: 'Bekoko 225 kV Substation (Douala): Legacy Copper Wiring Modernization via GOOSE',
      plant_name: 'Poste d\'Interconnexion 225/90/30 kV de Bekoko',
      capacity_mw: 'Nœud stratégique d\'alimentation de la métropole économique de Douala (puissance de transit 350 MW)',
      river_or_location: 'Bekoko, Entrée Ouest de Douala, Cameroun',
      operators: 'SONATREL',
      voltage_specs: '225 kV / 90 kV / 30 kV',
      notes_fr: 'Lors de la modernisation du poste de Bekoko, les ordres de déclenchement rapide entre les protections différentielles de barre 87B et les disjoncteurs de travée ont été migrés sur des liaisons optiques GOOSE CEI 61850-8-1. Cette modernisation a éliminé plus de 45 kilomètres de câbles cuivre multiconducteurs enterrés dans les caniveaux, réduisant drastiquement les risques de corrosion en milieu tropical et d\'induction transitoire.',
      notes_en: 'During the Bekoko substation upgrade, high-speed trip inter-tripping between 87B busbar differential protection and individual line bay breakers was transitioned to IEC 61850-8-1 optical GOOSE messaging. This eliminated over 45 kilometers of trench-routed multiconductor copper wiring, resolving tropical moisture corrosion failures and eliminating inductive ground loop hazards.',
      status: 'verified',
      source: 'Rapport d\'Ingénierie de Modernisation SAS Bekoko SONATREL 2026'
    },
    international_case: {
      title_fr: 'Réseau de Postes Numériques RTE "Projet Poste Intelligent" (France)',
      title_en: 'RTE French Transmission Grid Full Digital Substation "Poste Intelligent" Initiative',
      location: 'Poste 400/225 kV de Blocaux (Hauts-de-France) & Réseau National RTE',
      capacity_mw: 'Transport de transit 1200 MVA',
      key_features: 'Déploiement à grande échelle de l\'interopérabilité multi-constructeurs (ABB, Schneider Electric, Siemens) validée par fichiers d\'ingénierie SCD stricts selon le profil français R-SCL, avec temps de transit GOOSE moyen inférieur à 1.2 ms.'
    }
  },

  'D13.03': {
    subdomain_code: 'D13.03',
    concept_fr: `Dans un poste électrique numérique transportant des ordres de déclenchement de disjoncteurs par trames GOOSE et des échantillons de mesure par Sampled Values, le réseau de communication Ethernet ne peut tolérer aucune interruption de service. Les protocoles de redondance informatique classiques tels que RSTP (Rapid Spanning Tree Protocol - IEEE 802.1w) présentent un temps de reconfiguration de 50 millisecondes à plusieurs secondes lors d'une rupture de câble optique, ce qui est inacceptable pour la protection électrique et entraînerait des déclenchements intempestifs ou la non-élimination d'un court-circuit destructeur. La norme internationale CEI 62439-3 définit deux architectures de redondance sans aucun temps de reconfiguration (temps de basculement strictement égal à 0 milliseconde) : le protocole de redondance parallèle PRP (Parallel Redundancy Protocol) et la redondance haute disponibilité sans coupure HSR (High-availability Seamless Redundancy).`,
    concept_en: `Inside a digital substation routing trip commands via GOOSE packets and instrument telemetry via Sampled Values, the underlying Ethernet communication infrastructure must guarantee zero failover downtime. Conventional IT redundancy protocols such as RSTP (Rapid Spanning Tree Protocol per IEEE 802.1w) mandate network reconfiguration convergence delays between 50 milliseconds and multiple seconds following fiber cable breaks. Such interruptions are catastrophic for power system protections, risking severe equipment damage or wide-scale blackout. IEC 62439-3 standardizes two deterministic zero-recovery-time redundancy architectures (failover time strictly 0 milliseconds): Parallel Redundancy Protocol (PRP) and High-availability Seamless Redundancy (HSR).`,
    systems_fr: `Architectures de redondance CEI 62439-3 et synchronisation PTP :
1. Protocole PRP (Parallel Redundancy Protocol - CEI 62439-3 Clause 4) :
   - Fonctionne sur deux réseaux locaux Ethernet optiques totalement indépendants et disjoints physiquement (LAN A et LAN B).
   - Les équipements à double attachement (DANP - Dual Attached Nodes with PRP) émettent simultanément chaque trame Ethernet sur le LAN A et sur le LAN B en y adjoignant une remorque de redondance (Redundancy Check Trailer - RCT) de 6 octets contenant un numéro de séquence et un identifiant de réseau (LAN A = 0xA, LAN B = 0xB).
   - Le récepteur traite la première trame qui arrive et détruit instantanément la copie jumelle (Duplicate Discard). Si un commutateur ou une fibre du LAN A est sectionné, le paquet du LAN B est reçu sans aucun temps de perte.
   - Les équipements conventionnels à port unique (SAN - Singly Attached Nodes) sont raccordés via des boîtiers d'adaptation transparents appelés RedBoxes (Redundancy Boxes).
2. Protocole HSR (High-availability Seamless Redundancy - CEI 62439-3 Clause 5) :
   - Fonctionne sur une topologie en anneau fermé où chaque nœud (DANH) possède deux ports Ethernet intégrés agissant comme un commutateur à 2 ports.
   - Chaque trame est dupliquée et injectée simultanément dans les deux sens de l'anneau (horaire et anti-horaire) avec un en-tête HSR spécial de 6 octets.
3. Synchronisation PTP IEEE 1588v2 / CEI 61850-9-3 (Power Utility Profile) :
   - Synchronisation de haute précision sub-microseconde (< 1 μs) indispensable pour caler en phase les échantillons Sampled Values et les synchrophaseurs PMU.
   - Horloges mères Grandmaster synchronisées par GPS/GNSS, commutateurs Transparent Clocks (TC) compensant le temps de séjour des paquets, et Boundary Clocks (BC).`,
    systems_en: `Zero-Recovery Redundancy Protocols & Precision Time Synchronization:
1. Parallel Redundancy Protocol (PRP per IEC 62439-3 Clause 4):
   - Operates across two physically segregated, parallel local area networks (LAN A and LAN B) with zero cross-talk.
   - Dual Attached Nodes (DANP) duplicate every outgoing Ethernet frame, transmitting identical copies simultaneously over LAN A and LAN B tagged with a 6-byte Redundancy Check Trailer (RCT) encoding a sequence number and LanID flag (0xA for LAN A, 0xB for LAN B).
   - The destination node receives whichever copy arrives first, forwards it to upper protocol layers, and silently discards the twin duplicate (Duplicate Discard algorithm). If an optical trunk on LAN A fails, transmission continues seamlessly over LAN B with zero dropped packets.
   - Legacy Singly Attached Nodes (SANs) connect to dual networks via specialized hardware Redundancy Boxes (RedBoxes).
2. High-availability Seamless Redundancy (HSR per IEC 62439-3 Clause 5):
   - Ring topology wherein every Dual Attached Node (DANH) integrates a wire-speed 2-port switching engine.
   - Packets are duplicated and transmitted in opposing directions (clockwise and counter-clockwise) prepended with a 6-byte HSR header.
3. IEEE 1588v2 Precision Time Protocol (IEC 61850-9-3 Power Utility Profile):
   - Sub-microsecond time synchronization (< 1 μs accuracy) strictly mandated for coherent phase angle calculation in Sampled Values and PMU synchrophasor networks.
   - GNSS/GPS-disciplined Grandmaster Clocks, Transparent Clocks (TC) computing switch resident packet residence times, and Boundary Clocks (BC).`,
    engineering_fr: `Prescriptions de conception et calcul de gigue :
- Immunité absolue aux pannes simples (N-1 Télécoms) : la coupure d'une liaison optique, la panne d'une alimentation ou le redémarrage d'un switch de réseau A ne provoque aucune coupure de protection ni aucune alarme de perte d'échantillons SV.
- Budget de synchronisation PTP selon CEI 61850-9-3 : l'erreur d'horloge maximale cumulée entre n'importe quelle Merging Unit et le relais de protection le plus éloigné doit rester inférieure à ±1 microseconde (±1 μs correspond à une erreur angulaire de 0.018° à 50 Hz, préservant la précision de la protection différentielle 87).
- Mode Holdover de l'horloge Grandmaster : en cas de brouillage ou de perte du signal satellite GNSS, l'oscillateur interne à quartz thermostaté (OCXO) ou au rubidium de l'horloge mère doit maintenir une dérive inférieure à 1 μs pendant au moins 4 heures.`,
    engineering_en: `Network Design Specs & Jitter Budget Modeling:
- Absolute N-1 Telecom Survivability: fiber severing, switch power failure, or firmware rebooting on LAN A generates zero packet loss and zero protection tripping delay, completely transparent to connected relays.
- PTP Time Error Budget per IEC 61850-9-3: maximum cumulative time offset between any Merging Unit and the most distant protection IED must stay within ±1 microsecond (a 1 μs offset equates to 0.018° electrical phase error at 50 Hz, perfectly maintaining 87 differential protection stability).
- Grandmaster GNSS Holdover Resilience: upon satellite antenna loss or jamming, internal Oven Controlled Crystal Oscillators (OCXO) or Rubidium standards must restrict clock drift to < 1 μs across a minimum 4-hour holdover window.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Réseau Optique Redondant PRP du Poste 225 kV de Nyom 2 (Yaoundé)',
      title_en: 'Nyom 2 (Yaoundé) 225 kV Substation PRP Redundant Optical Network',
      plant_name: 'Poste d\'Interconnexion 225/90/15 kV de Nyom 2',
      capacity_mw: 'Point de réception principal de l\'énergie de Nachtigal vers la métropole de Yaoundé (420 MW)',
      river_or_location: 'Nyom, Périphérie Nord de Yaoundé, Cameroun',
      operators: 'SONATREL',
      voltage_specs: '225 kV / 90 kV / 15 kV',
      notes_fr: 'Le poste stratégique de Nyom 2 est équipé d\'une double dorsale Ethernet optique Gigabit déployée en topologie PRP (LAN A et LAN B séparés). Tous les relais de protection de travées et les calculateurs de poste disposent d\'interfaces optiques doubles DANP. Les essais de recette sur site ont validé la transmission ininterrompue des déclenchements GOOSE lors de la déconnexion volontaire du commutateur maître du LAN A.',
      notes_en: 'The critical Nyom 2 transmission substation utilizes a dual Gigabit optical Ethernet backbone arranged in full PRP topology (segregated LAN A and LAN B). Bay protection relays and bay controllers feature native optical DANP interfaces. Commissioning tests validated uninterrupted GOOSE trip signal propagation during intentional live hot-pull disconnection of the primary LAN A core switch.',
      status: 'verified',
      source: 'Cahier des Charges Télécoms Poste Nyom 2 / SONATREL 2026'
    },
    international_case: {
      title_fr: 'Poste 500 kV de PJM Interconnection & AEP (États-Unis) en Redondance HSR/PRP',
      title_en: 'American Electric Power (AEP) 500 kV Hybrid HSR/PRP Transmission Substation',
      location: 'Ohio, États-Unis / Région PJM',
      capacity_mw: 'Poste de transport d\'interconnexion régionale de 2000 MVA',
      key_features: 'Architecture hybride associant des anneaux HSR par tranche de disjoncteur interconnectés par RedBoxes à un réseau fédérateur PRP double avec horloges PTP Grandmaster au Rubidium certifiées IEEE C37.238.'
    }
  },

  'D13.04': {
    subdomain_code: 'D13.04',
    concept_fr: `Les réseaux télécoms WAN (Wide Area Network) d'une société de transport d'électricité constituent l'épine dorsale vitale sans laquelle la téléconduite des postes distants, la protection différentielle de ligne 87L et le pilotage national depuis le dispatching seraient impossibles. Sur des distances de plusieurs centaines de kilomètres traversant des zones équatoriales denses, les exploitants de réseaux électriques combinent trois technologies de transmission éprouvées : les câbles de garde à fibres optiques (OPGW - Optical Ground Wire) installés au sommet des pylônes HTB, les courants porteurs en ligne haute fréquence (CPL / PLC - Power Line Carrier) utilisant les conducteurs d'énergie eux-mêmes comme guide d'onde, et les liaisons par faisceaux hertziens numériques de secours. La transition vers les réseaux de transport déterministes par paquets MPLS-TP (Multi-Protocol Label Switching - Transport Profile) permet de faire converger les téléprotections critiques à très faible gigue et le trafic IP de vidéosurveillance et de téléphonie administrative sur une infrastructure optique unifiée.`,
    concept_en: `Electric utility Wide Area Networks (WAN) form the critical communication backbone without which remote telecontrol of substations, line current differential protection (ANSI 87L), and national dispatching would be completely impossible. Spanning hundreds of kilometers across challenging equatorial topography, power utilities deploy three synergistic transmission pillars: Optical Ground Wire (OPGW) installed at the apex of high-voltage transmission towers, high-frequency Power Line Carrier (PLC) systems utilizing high-voltage phase conductors themselves as RF transmission media, and backup digital microwave radio links. Modern utility migration towards deterministic MPLS-TP (Multi-Protocol Label Switching - Transport Profile) packet backbones converges ultra-low jitter line differential teleprotection with IP CCTV and enterprise VoIP across a unified, resilient optical grid.`,
    systems_fr: `Technologies de télécommunications de transport HTB :
1. Câbles de Garde à Fibres Optiques (OPGW) :
   - Remplissent un double rôle : protection contre les coups de foudre directs sur les conducteurs de phase et vecteur de télécommunication optique à très haut débit (24 à 96 fibres monomodes standard G.652 ou G.655).
   - Structure en tube d'aluminium extrudé ou tube inox hélicoïdal rempli de gel hydrofuge, blindé par des fils d'acier cuivré (ACS) et d'alliage d'aluminium résistant aux courants de court-circuit et aux décharges de foudre (> 100 kA).
2. Courants Porteurs en Ligne (CPL / PLC) :
   - Injection de signaux radioélectriques haute fréquence (40 kHz à 500 kHz) directement sur les conducteurs 225 kV / 90 kV.
   - Équipements de couplage HTB : Transformateurs de Tension Capacitifs (TTPC / CCVT) servant de condensateur de couplage (C = 4000 à 10000 pF), boîtes d'accord (Line Matching Unit - LMU) et selfs d'arrêt de ligne (Line Traps / Circuits bouchons L = 0.5 à 2.0 mH) empêchant le signal HF de se dissiper dans les jeux de barres du poste.
   - Utilisé historiquement pour la téléprotection de ligne (transmission d'ordres de déclenchement ou de comparaison de phase) et la phonie d'exploitation.
3. Réseaux de Transport Déterministes MPLS-TP et SDH :
   - Plateformes optiques SDH (Synchronous Digital Hierarchy STM-1/STM-4/STM-16) offrant une gigue quasi-nulle et un temps de commutation < 50 ms par anneaux auto-cicatrisants (MS-SPRing).
   - Migration vers MPLS-TP avec réservation stricte de bande passante, garantissant un délai de transmission bidirectionnel strictement symétrique (< 5 ms) indispensable pour la protection différentielle de ligne 87L.`,
    systems_en: `High-Voltage Transmission Telecom Technologies:
1. Optical Ground Wire (OPGW) Cable Systems:
   - Dual functionality: shielding high-voltage phase conductors against direct atmospheric lightning strikes while hosting ultra-high bandwidth optical communications (24 to 96 single-mode fibers compliant with ITU-T G.652D or G.655).
   - Structural design: extruded aluminum or helical stainless steel central tubes filled with water-blocking thixotropic gel, surrounded by concentric layers of Aluminum-Clad Steel (ACS) wires rated for heavy lightning impulses (> 100 kA) and short-circuit thermal withstand.
2. Power Line Carrier (PLC) Systems:
   - Superimposing radio-frequency carrier signals (40 kHz to 500 kHz) directly onto energized 225 kV / 90 kV transmission phase conductors.
   - Switchyard High-Voltage Coupling Hardware: Capacitive Voltage Transformers (CCVT) acting as coupling capacitors (C = 4000 to 10000 pF), Line Matching Units (LMU), and high-inductance Line Traps (0.5 to 2.0 mH series air-core reactors) blocking RF signals from draining into substation busbars.
   - Historically essential for high-speed teleprotection tripping (permissive underreach, directional comparison) and dispatch voice trunks.
3. Deterministic MPLS-TP & Legacy SDH Transport Backbones:
   - SDH rings (STM-1/STM-4/STM-16) delivering sub-nanosecond jitter and deterministic < 50 ms protection switching via Multiplex Section Shared Protection Rings (MS-SPRing).
   - Evolution to MPLS-TP with strict bandwidth reservation, static bidirectional label switched paths (LSPs), and rigorous path symmetry (< 0.1 ms differential delay) essential for line current differential protection (ANSI 87L).`,
    engineering_fr: `Calculs de bilan de liaison optique et prescriptions CPL :
- Calcul d'atténuation optique OPGW :
  A_tot = α × L + N_épissures × A_épissure + N_connecteurs × A_connecteur + Marge_sécurité.
  Pour une fibre monomode G.652 à 1550 nm (α = 0.20 dB/km) sur une ligne de 120 km avec 40 épissures (0.05 dB) et une marge de vieillissement de 3.0 dB, l'atténuation totale est de 29.0 dB, compatible avec des émetteurs optiques SFP+ longue portée (portée 32 dB).
- Symétrie de temps de propagation pour la protection différentielle de ligne 87L :
  La protection 87L compare les grandeurs de courant instantanées mesurées aux deux extrémités de la ligne; un déséquilibre de temps de propagation optique aller-retour (Asymmetry Delay) supérieur à 1.0 ms fausse le calcul de déphasage et provoque un déclenchement intempestif de la ligne en pleine charge.
- Dimensionnement de la self d'arrêt CPL : l'impédance de blocage HF de la self d'arrêt doit être supérieure à 400 à 600 ohms sur toute la bande de fréquence utile (Z = 2π·f·L).`,
    engineering_en: `Optical Power Budgeting & Power Line Carrier Engineering:
- OPGW Optical Link Budget Calculation:
  Atot = α × L + Nsplices × Asplice + Nconnectors × Aconnector + Maging.
  For G.652 single-mode fiber at 1550 nm (α = 0.20 dB/km) across a 120 km line with 40 fusion splices (0.05 dB) and a 3.0 dB maintenance aging margin, total link loss equals 29.0 dB, perfectly matched with long-haul +32 dB optical budget SFP+ optical transceivers.
- Channel Propagation Delay Symmetry for Line Differential Protection (ANSI 87L):
  87L relays compare current phase angles sampled across remote line terminals. A transmission asymmetry delay (Tx vs Rx path discrepancy) exceeding 1.0 ms induces an artificial phase error, triggering false tripping under normal full-load through-currents.
- Line Trap Impedance Sizing: line trap RF blocking impedance must exceed 400 to 600 Ω across the operating frequency channel (Z = 2π·f·L) to isolate carrier energy from substation ground.`,
    formulas: [FORMULAS[0], FORMULAS[1]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Dorsale Nationale OPGW SONATREL (Mangombé - Yaoundé - Douala - Bafoussam)',
      title_en: 'SONATREL National OPGW Optical Backbone (Mangombé - Yaoundé - Douala - Bafoussam)',
      plant_name: 'Dorsale de Télécommunications Optiques OPGW 225 kV de SONATREL',
      capacity_mw: 'Interconnexion optique de plus de 2500 km de lignes 225 kV et 90 kV avec 48 fibres optiques G.652',
      river_or_location: 'Axes Mangombé-Logbaba, Mangombé-Oyomabang, Songloulou-Mangombé, Nachtigal-Nyom 2',
      operators: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
      voltage_specs: '225 kV / 90 kV',
      notes_fr: 'La dorsale OPGW de SONATREL relie le Centre National de Conduite de Mangombé (Édéa) à tous les grands postes de transformation du pays. Elle supporte le réseau de transport MPLS-TP pour la téléconduite CEI 60870-5-104, les flux inter-postes de protection différentielle de ligne 87L et la téléphonie VoIP d\'exploitation. Des brins de fibres optiques noirs excédentaires sont également valorisés pour le désenclavement numérique des régions traversées.',
      notes_en: 'SONATREL\'s national OPGW backbone connects the Mangombé National Dispatching Center (Édéa) to every transmission substation across Cameroon. It hosts a ruggedized MPLS-TP transport network routing IEC 60870-5-104 telecontrol, 87L line current differential teleprotection channels, and mission-critical VoIP trunks. Excess dark fiber pairs are commercialized to expand national telecommunications bandwidth.',
      status: 'verified',
      source: 'Direction Télécommunications & Téléconduite SONATREL 2026'
    },
    international_case: {
      title_fr: 'Dorsale Optique OPGW Trans-Européenne de TenneT & Elia (Mer du Nord)',
      title_en: 'TenneT & Elia Trans-European Optical OPGW & Subsea Fiber Backbone',
      location: 'Allemagne / Belgique / Pays-Bas',
      capacity_mw: 'Coordination de plus de 45 000 km de lignes HTB et interconnexions HVDC offshore',
      key_features: 'Réseau MPLS-TP à très haute disponibilité avec temps de commutation automatique inférieur à 10 ms, transportant les synchrophaseurs PMU WAMS et les ordres de téléprotection transfrontaliers.'
    }
  },

  'D14.01': {
    subdomain_code: 'D14.01',
    concept_fr: `La qualité de l'onde électrique (Power Quality) caractérise la conformité de la tension et du courant délivrés aux utilisateurs par rapport à une sinusoïde pure à 50 Hz. Avec la prolifération des récepteurs électroniques non linéaires (variateurs de vitesse, redresseurs industriels, fours à arc, serveurs informatiques), les réseaux sont confrontés à des pollutions harmoniques, des creux de tension (voltage sags), des fluctuations (flicker) et des déséquilibres de phases. La norme CEI 61000-2-4 et le standard IEEE 519 définissent les limites strictes de compatibilité électromagnétique.`,
    concept_en: `Electric Power Quality defines the sinusoidal purity, amplitude stability, and frequency constancy of voltage waveforms delivered to consumers compared to an ideal 50 Hz reference. With the exponential expansion of non-linear power electronic loads (VFD motor drives, industrial rectifiers, electric arc furnaces, data centers), grids face severe harmonic pollution, voltage sags, voltage flicker, and phase unbalance. IEC 61000-2-4 and IEEE Std 519 establish enforceable electromagnetic compatibility limits.`,
    systems_fr: `Les systèmes de mesure et de dépollution harmonique comprennent :
1. Analyseurs de réseau permanents classe A (CEI 61000-4-30) : enregistrement en continu des creux de tension, surtensions transitoires, harmoniques jusqu'au rang 50 et papillotement (Pst / Plt).
2. Filtres passifs résonants LC : circuits bouchons self-condensateur accordés sur les harmoniques dominants de rang 5 (250 Hz), 7 (350 Hz) ou 11 (550 Hz).
3. Filtres actifs de puissance (APF) : onduleurs connectés en parallèle qui mesurent en temps réel le courant harmonique absorbé par la charge et injectent instantanément le courant en opposition de phase pour annuler la distorsion.
4. Compensateurs de creux de tension (DVR - Dynamic Voltage Restorer) : convertisseurs série injectant une tension de compensation lors des creux de tension pour protéger les lignes de production sensibles.`,
    systems_en: `Power quality measurement and mitigation systems encompass:
1. Class-A certified Power Quality Analyzers (IEC 61000-4-30): continuous high-speed logging of voltage sags, swell transients, harmonics up to 50th order, and flicker indices (Pst / Plt).
2. Passive tuned LC Harmonic Filters: shunt-connected inductor-capacitor branches tuned to absorb 5th (250 Hz), 7th (350 Hz), and 11th (550 Hz) dominant harmonic orders.
3. Active Power Filters (APF): high-speed parallel IGBT inverters measuring load harmonic currents in real time and injecting opposing counter-phase currents to cancel distortion.
4. Dynamic Voltage Restorers (DVR): series-connected injection converters boosting depressed voltage during grid sags, shielding sensitive manufacturing assembly lines.`,
    engineering_fr: `Prescriptions de calcul et conformité :
- Taux de distorsion harmonique globale en tension (THDv) : doit rester inférieur à 5.0% sur les réseaux MT/HT et à 8.0% sur les réseaux BT industriels classe 2 selon CEI 61000-2-4.
- Facteur de détarage des transformateurs (Facteur K) : dimensionnement de transformateurs K-13 ou K-20 pour supporter les pertes supplémentaires par courants de Foucault engendrées par les harmoniques.
- Élimination des résonances parallèles : vérification obligatoire que la fréquence d'accord d'une batterie de condensateurs ne coïncide pas avec le rang 5 ou 7 (installation systématique de selfs anti-harmoniques de désaccord 7% à 189 Hz).`,
    engineering_en: `Engineering calculations and compliance criteria:
- Total Voltage Harmonic Distortion (THDv): mandated below 5.0% on MV/HV transmission and below 8.0% on industrial LV Class-2 buses per IEC 61000-2-4.
- Transformer K-factor derating: specifying K-13 or K-20 rated transformers engineered to withstand severe stray eddy-current winding losses caused by high-frequency harmonic currents.
- Anti-resonance design: confirming capacitor bank resonance frequencies do not align with 5th or 7th orders (mandating 7% detuned anti-harmonic reactors tuned to 189 Hz).`,
    formulas: [FORMULAS[10], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[2]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Dépollution Harmonique de l\'Aluminerie d\'ALUCAM & Fours Métallurgiques de Bassa (Douala)',
      title_en: 'Harmonic Filtering at ALUCAM Smelter & Metallurgical Plants in Bassa (Douala)',
      plant_name: 'Usine d\'Électrolyse ALUCAM (Édéa) & Aciéries de la Zone Industrielle de Douala',
      capacity_mw: 'Puissance absorbée par électrolyse : jusqu\'à 180 MW continus (Redresseurs)',
      river_or_location: 'Édéa (Sanaga) et Zone Industrielle de Bassa (Douala)',
      operators: 'ALUCAM · Prometal Aciérie · Eneo (Raccordement grand compte HTB)',
      voltage_specs: 'Alimentation 90 kV / 15 kV → Redresseurs à thyristors de forte puissance',
      notes_fr: 'Les cuves d\'électrolyse d\'ALUCAM et les fours à induction des aciéries de Bassa génèrent d\'importants courants harmoniques de rang 5, 7, 11 et 13. Des filtres harmoniques passifs de forte puissance et des selfs de lissage sont installés pour éviter de polluer le réseau de transport 90 kV et 225 kV de SONATREL.',
      notes_en: 'ALUCAM aluminum reduction pots and Bassa steel induction furnaces generate heavy 5th, 7th, 11th, and 13th harmonic currents. Heavy-duty passive harmonic filters and smoothing reactors protect the 90 kV and 225 kV grid from waveform distortion.',
      status: 'verified',
      source: 'Étude de qualité de l\'onde réseau SONATREL / Direction Technique ALUCAM 2026'
    },
    international_case: {
      title_fr: 'Filtres Actifs Hybrides Statcom pour Fours à Arc Nucor Steel (USA)',
      title_en: 'Hybrid Active Filter & STATCOM for Electric Arc Furnaces (Nucor Steel, USA)',
      location: 'États-Unis',
      capacity_mw: 'Four à arc 120 MVA',
      key_features: 'STATCOM dynamique compensant le flicker Pst en moins de 5 ms et ramenant le THD sous 2%.'
    }
  },

  'D14.02': {
    subdomain_code: 'D14.02',
    concept_fr: `Les creux de tension (voltage sags/dips), les surtensions temporaires à fréquence industrielle (swells) et les micro-coupures définis par la norme CEI 61000-4-30 Classe A et la CEI 61000-2-8 constituent les perturbations électromagnétiques les plus destructrices pour les procédés industriels continus (brasseries, cimenteries, papeteries, lignes de découpe et de soudage robotisées). Un creux de tension est une baisse soudaine de la tension efficace efficace de 10% à 90% de la valeur nominale, d'une durée typique de 10 millisecondes à 1 minute, généralement induit par un court-circuit monophasé ou polyphasé éliminé par les protections sur une ligne HTB voisine ou par le démarrage direct de puissants moteurs asynchrones.`,
    concept_en: `Voltage sags (dips), temporary power-frequency swell overvoltages, and short interruptions defined under IEC 61000-4-30 Class A and IEC 61000-2-8 represent the most financially destructive electromagnetic disturbances for continuous industrial processes (breweries, cement mills, paper plants, robotic welding lines). A voltage sag is a sudden reduction of RMS voltage between 10% and 90% of nominal, lasting from 10 milliseconds to 1 minute, typically triggered by single-phase or multiphase short-circuits cleared by transmission protection relays or by heavy induction motor direct-on-line start-ups.`,
    systems_fr: `Architectures de protection et de compensation des creux de tension :
1. Compensateur dynamique de creux de tension (DVR - Dynamic Voltage Restorer) : onduleur série à supercondensateurs ou volant d'inertie qui injecte instantanément en quadrature ou en phase la tension manquante (compensation jusqu'à 70% de creux en moins de 2 ms).
2. Alimentations sans interruption industrielles (ASI / UPS statiques ou rotatives) : maintien de l'alimentation des jeux de barres secourus et des automates programmables industriels (PLC).
3. Contacteurs et bobines à retenue magnétique insensible aux creux (immunité SEMI F47) : élimination du déclenchement intempestif des auxiliaires de commande lors d'un creux résiduel à 50% pendant 200 ms.
4. Analyseurs de qualité d'onde certifiés CEI 61000-4-30 Édition 3 Classe A : échantillonnage haute vitesse synchronisé GPS/PTP à 1024 points/période pour capturer l'enveloppe RMS demi-période (Urms(1/2)) et le profil transitoire.`,
    systems_en: `Voltage sag mitigation and ride-through architectures:
1. Dynamic Voltage Restorers (DVR): series-connected IGBT inverters backed by ultracapacitors or flywheels injecting missing voltage vectors within 2 ms (compensating sags down to 30% retained voltage).
2. Industrial Uninterruptible Power Supply systems (rotary or double-conversion static UPS): continuous zero-break power conditioning for critical motor drives and process PLCs.
3. SEMI F47 compliant magnetic holding coils and dip-proof contactors: preventing spurious tripping of motor starter control circuits during 50% retained voltage dips lasting up to 200 ms.
4. Class A certified Power Quality Monitors (IEC 61000-4-30 Ed. 3): GPS/PTP synchronized continuous waveform capture at 1024 samples/cycle computing half-cycle RMS profiles (Urms(1/2)) and transient oscillograms.`,
    engineering_fr: `Critères de calcul et gabarits d'immunité industrielle :
- Gabarit d'immunité SEMI F47 : exige que les équipements industriels continuent de fonctionner sans décrochage pour une tension résiduelle de 50% pendant 200 ms, 70% pendant 500 ms et 80% pendant 1 seconde.
- Courbe ITIC (anciennement CBEMA) : tolérance de creux transitoires jusqu'à zéro volt pendant 20 ms (1 période à 50 Hz).
- Énergie résiduelle du creux (Sag Energy / Lost Volts-Seconds) : $E_{sag} = \\int [1 - (U(t)/U_n)^2] dt$, quantifier la sévérité réelle de la perturbation pour les contrats de qualité d'alimentation.`,
    engineering_en: `Engineering criteria and industrial ride-through curves:
- SEMI F47 Ride-Through Curve: mandates that industrial machinery withstand 50% retained voltage for 200 ms, 70% for 500 ms, and 80% for 1 second without tripping or process abort.
- ITIC (CBEMA) Curve: defines acceptable envelope allowing complete zero-voltage collapse up to 20 ms (1 full cycle at 50 Hz).
- Sag Energy calculation (Lost Volts-Seconds): $E_{sag} = \\int [1 - (U(t)/U_n)^2] dt$, standardizing commercial severity scoring for power delivery contracts.`,
    formulas: [FORMULAS[10], FORMULAS[2]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Campagne de Traitement des Creux de Tension dans les Brasseries et Cimenteries de Douala (Bassa & Bonabéri)',
      title_en: 'Voltage Sag Mitigation Campaign across Douala Breweries & Cement Mills (Bassa & Bonabéri)',
      plant_name: 'Usines Brassoles & Cimenteries de Douala (SABC / Dangote / Cimencam)',
      capacity_mw: 'Charges industrielles sensibles de 15 à 35 MW',
      river_or_location: 'Zones Industrielles de Bassa et Bonabéri (Douala)',
      operators: 'Eneo (Réseau de distribution 15/30 kV) · Industriels Agro-alimentaires & Cimentiers',
      voltage_specs: 'Départs 15 kV / 30 kV et TGBT 400 V',
      notes_fr: 'Lors de la saison des pluies au Cameroun, les impacts de foudre fréquents sur les lignes 90 kV et 225 kV provoquent des défauts phase-terre fugitifs générant des creux de tension de 40% à 70% d\'une durée de 80 à 180 ms. Pour éliminer les arrêts de production très coûteux des fours et des lignes d\'embouteillage automatisées, les industriels ont déployé des relais de réenclenchement rapide, des compensateurs DVR et des contacteurs conformes SEMI F47 sur les circuits de commande.',
      notes_en: 'During Cameroon rainy seasons, intense lightning strikes on 90 kV and 225 kV lines induce single-phase faults causing severe voltage sags (40% to 70% depth lasting 80 to 180 ms). To eliminate crippling production shutdowns on continuous glass-bottling and clinker kiln drives, Douala manufacturing hubs installed dynamic voltage compensators (DVR) and SEMI F47 ride-through magnetic contactors on PLC controls.',
      status: 'verified',
      source: 'Rapports d\'Audit Qualité de l\'Onde Eneo / Groupement des Entreprises du Cameroun (GICAM) 2025'
    },
    international_case: {
      title_fr: 'Protection par DVR Haute Puissance des Fonderies de Semi-conducteurs TSMC (Taïwan)',
      title_en: 'High-Power DVR Voltage Sag Shielding at TSMC Semiconductor Fabs (Taiwan)',
      location: 'Taïwan (Hsinchu Science Park)',
      capacity_mw: 'Système DVR de 40 MVA protégeant des lignes de lithographie EUV',
      key_features: 'Temps de compensation inférieur à 1.5 ms garantissant une tension de bus parfaitement stabilisée à 100% lors de défauts sur le réseau 161 kV.'
    }
  },

  'D15.01': {
    subdomain_code: 'D15.01',
    concept_fr: `La gestion d'actifs (Asset Management) selon l'ISO 55000 et la maintenance prédictive conditionnelle garantissent la longévité, la sécurité et la fiabilité des équipements critiques haute tension (transformateurs de puissance, disjoncteurs, câbles souterrains, alternateurs). En substituant la maintenance calendaire par une surveillance en temps réel de l'état de santé (Condition Monitoring), les gestionnaires de réseau détectent les amorçages internes, la dégradation diélectrique des huiles et l'échauffement des contacts avant qu'une avarie catastrophique ne survienne.`,
    concept_en: `Asset Management aligned with ISO 55000 and condition-based predictive maintenance optimizes the lifecycle, safety, and reliability of high-voltage assets (power transformers, circuit breakers, underground cables, generators). By replacing arbitrary time-based maintenance with continuous online Condition Monitoring and Health Index scoring, utilities pinpoint internal partial discharges, dielectric oil aging, and contact thermal hotspots long before catastrophic failures occur.`,
    systems_fr: `Les technologies de diagnostic et de surveillance d'actifs comprennent :
1. Analyse des gaz dissous en ligne (DGA - Dissolved Gas Analysis) : capteurs photo-acoustiques mesurant en continu l'hydrogène (H2), l'acétylène (C2H2), l'éthylène (C2H4) et le monoxyde de carbone (CO) pour diagnostiquer les arcs et surchauffes selon le triangle de Duval.
2. Détection des décharges partielles (DP / PD) : capteurs acoustiques et électromagnétiques UHF détectant les micro-étincelles dans les isolations solides ou gazeuses SF6.
3. Thermographie infrarouge automatisée : caméras thermiques surveillant l'échauffement anormal des mâchoires de sectionneurs et des connexions de jeux de barres sous forte charge.
4. Analyse de réponse en fréquence de balayage (SFRA - Sweep Frequency Response Analysis) : diagnostic de la déformation mécanique des bobinages de transformateurs suite à un court-circuit violent.`,
    systems_en: `Asset diagnostic and health monitoring technologies incorporate:
1. Online Dissolved Gas Analysis (DGA): multi-gas photoacoustic monitors continuously tracking H2, C2H2, C2H4, and CO concentrations, diagnosing thermal hot spots and electrical arcing via Duval's Triangle.
2. Online Partial Discharge (PD) monitoring: high-frequency current transformers (HFCT), acoustic sensors, and UHF antennae detecting micro-discharges in solid insulation or SF6 chambers.
3. Infrared Thermographic inspection: calibrated radiometric cameras mapping thermal hotspots across substation knife switches and bolted busbar clamp joints.
4. Sweep Frequency Response Analysis (SFRA): non-invasive sub-band frequency injection validating mechanical winding geometry integrity post heavy through-fault short-circuits.`,
    engineering_fr: `Indices d'état et stratégies de maintenance selon CEI 60599 :
- Triangle de Duval et méthode Rogers : identification infaillible du type de défaut interne (décharge de faible énergie PD, étincelage thermique T1/T2/T3 > 700°C, ou arc franc D1/D2 caractérisé par l'apparition de C2H2).
- Indice de santé globale (Health Index - HI) : note pondérée de 0 à 100 intégrant la teneur en eau de l'huile, la tension de claquage diélectrique (> 50 kV/2.5 mm selon CEI 60156), l'acidité et les dérivés furaniques (mesure du degré de polymérisation du papier isolant DP < 200 en fin de vie).
- Maintenance centrée sur la fiabilité (RCM) : priorisation des investissements de remplacement sur les transformateurs les plus critiques du réseau national.`,
    engineering_en: `Asset Health Index scoring and diagnostic standards per IEC 60599:
- Duval's Triangle and Rogers ratios: definitive classification of internal transformer faults (partial discharge PD, thermal hotspots T1/T2/T3 > 700°C, or power arcing D1/D2 indicated by acetylene C2H2).
- Composite Health Index (HI): algorithmic score (0-100) aggregating moisture content, dielectric breakdown voltage (> 50 kV/2.5 mm per IEC 60156), interfacial tension, and furan content (measuring paper insulation degree of polymerization DP < 200 at end of life).
- Reliability Centered Maintenance (RCM): directing CAPEX refurbishment budgets towards critical system autotransformers based on calculated failure risk and system impact.`,
    formulas: [FORMULAS[2], FORMULAS[1]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Surveillance DGA & Rénovation des Grands Transformateurs de Songloulou et Mangombé',
      title_en: 'Online DGA & Major Transformer Life Extension at Songloulou & Mangombé Substations',
      plant_name: 'Postes Élévateurs 225 kV de Songloulou (384 MW) & Nœud de Mangombé',
      capacity_mw: 'Parc de 8 transformateurs élévateurs de groupe 60 MVA + autotransformateurs 225/90 kV',
      river_or_location: 'Centrale de Songloulou et Poste de Mangombé (Édéa)',
      operators: 'Eneo (Production Songloulou) · SONATREL (Transport Mangombé)',
      voltage_specs: 'Transformateurs 10.5/225 kV et autotransformateurs 225/90/15 kV',
      notes_fr: 'Les transformateurs élévateurs de Songloulou, en service continu depuis plus de 35 ans sous climat tropical très humide, font l\'objet d\'une surveillance rigoureuse par analyse semestrielle des gaz dissous (DGA) et filtration sous vide d\'huile. Des capteurs DGA en ligne ont été installés pour anticiper tout emballement thermique sur les traversées 225 kV.',
      notes_en: 'Songloulou generator step-up transformers, operating in humid tropical heat for over 35 years, undergo rigorous monitoring via semi-annual DGA sampling and high-vacuum oil dehydration. Online multi-gas monitors guard 225 kV bushings against thermal runaway.',
      status: 'verified',
      source: 'Plan de maintenance prédictive Eneo / Direction de la Maintenance SONATREL 2026'
    },
    international_case: {
      title_fr: 'Système d\'Asset Health Index Digital de National Grid (Royaume-Uni)',
      title_en: 'National Grid Digital Asset Health & Fleet Analytics Platform (United Kingdom)',
      location: 'Royaume-Uni',
      capacity_mw: 'Surveillance de plus de 800 transformateurs 400 kV',
      key_features: 'Plateforme cloud IA corrélant DGA, historique de charge et météo pour prédire les défaillances 18 mois à l\'avance.'
    }
  },

  'D15.02': {
    subdomain_code: 'D15.02',
    concept_fr: `La détection en ligne des décharges partielles (DP / Partial Discharge) selon la CEI 60270 et la thermographie infrarouge automatisée représentent les deux piliers de la surveillance d'état non-destructive des postes blindés à isolation gazeuse SF6 (GIS) et des têtes de câbles haute tension. Les décharges partielles constituent des micro-amorçages électriques localisés qui n'entraînent pas immédiatement le contournement total de l'intervalle isolant, mais qui dégradent inexorablement la résine époxy, le gaz SF6 (génération de SOF2, HF et SO2 toxiques) ou le polyéthylène réticulé (XLPE) des câbles 90/225 kV jusqu'au claquage catastrophique.`,
    concept_en: `Online Partial Discharge (PD) detection per IEC 60270 and automated infrared thermography represent foundational non-destructive condition monitoring methodologies for SF6 gas-insulated switchgear (GIS) and high-voltage cable terminations. Partial discharges are localized micro-breakdowns across insulation voids that do not immediately bridge the main gap, but inexorably erode epoxy resin, SF6 gas (generating hazardous SF4, SOF2, and HF byproducts), or cable XLPE insulation until violent catastrophic flashover occurs.`,
    systems_fr: `Technologies de détection et capteurs de surveillance DP & thermique :
1. Capteurs UHF (Ultra-High Frequency 300 MHz - 1.5 GHz) : antennes internes ou montées sur les regards diélectriques des compartiments GIS, détectant les ondes électromagnétiques émises par les micro-étincelles avec immunité totale aux parasites radioélectriques externes.
2. Transformateurs de courant haute fréquence (HFCT) : tores de mesure toroïdaux installés sur les tresses de mise à la terre des boîtes d'extrémité de câbles 90/225 kV et neutres transformateurs.
3. Capteurs acoustiques piézo-électriques (AE - Acoustic Emission 20 - 300 kHz) : plaqués magnétiquement sur la cuve pour localiser spatialement la source de DP par triangulation différentielle de temps de vol (TDoA).
4. Caméras radiométriques thermographiques à visée continue : surveillance des mâchoires de sectionneurs, bornes de traversées et connexions boulonnées pour détecter les surchauffes Joule (ΔT > 15°C par rapport à la température ambiante sous charge).`,
    systems_en: `PD diagnostic sensing and thermographic instrumentation technologies:
1. UHF Sensors (Ultra-High Frequency 300 MHz - 1.5 GHz): internal antennas or external window couplers on GIS compartments capturing nanosecond electromagnetic transients with zero susceptibility to switchyard corona.
2. High-Frequency Current Transformers (HFCT): split-core inductive couplers clamped around 90/225 kV cable shield ground straps and neutral earthing conductors.
3. Acoustic Emission Sensors (AE 20 - 300 kHz): magnetically clamped resonant piezoelectric transducers triangulating discharge source locations via differential acoustic Time Difference of Arrival (TDoA).
4. Continuous radiometric thermal cameras: non-contact monitoring of disconnector contacts, bushing terminals, and bolted busbar clamp joints identifying resistive hot spots (ΔT > 15°C above reference under load).`,
    engineering_fr: `Traitement du signal et patrons résolus en phase (PRPD) :
- Cartographie PRPD (Phase-Resolved Partial Discharge) : corrélation de chaque impulsion élémentaire (amplitude en pC, angle de phase 0° à 360° du cycle 50 Hz et taux de répétition n/seconde) pour identifier sans ambiguïté l'empreinte type (cavité interne symétrique à 45°/225°, effet couronne asymétrique au pic négatif 270°, particule métallique libre dans le SF6 ou cheminement superficiel).
- Analyse thermique CEI 60943 : calcul de la résistance de contact de passage et prédiction d'emballement thermique sur les organes de coupure.
- Intégration Asset Health Index : injection des amplitudes de décharges (> 500 pC seuil d'alarme) dans l'évaluation globale de probabilité de défaillance (PoF).`,
    engineering_en: `Signal processing and Phase-Resolved PD (PRPD) discrimination:
- PRPD Pattern Recognition: clustering each discharge event (charge magnitude in pC, 50 Hz power cycle phase angle 0° to 360°, and repetition frequency n/s) to isolate fault signatures (internal void symmetry at 45°/225°, corona clustering around negative peak 270°, mobile metallic particles in SF6 chambers, or surface tracking).
- IEC 60943 thermal degradation models: contact resistance trending and runaway hotspot forecasting on switchgear joints.
- Composite Health Index incorporation: streaming discharge severity (> 500 pC critical alarm threshold) into automated fleet Failure Probability (PoF) scoring.`,
    formulas: [FORMULAS[2], FORMULAS[0]],
    standards: [STANDARDS[1], STANDARDS[3]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Campagne de Détection Acoustique & Thermographique sur les Postes Blindés 225 kV de Bekoko et Oyomabang',
      title_en: 'Acoustic PD & Radiometric Thermography Audit across Bekoko & Oyomabang 225 kV GIS Nodes',
      plant_name: 'Postes d\'Interconnexion 225/90 kV de Bekoko (Douala) et Oyomabang (Yaoundé)',
      capacity_mw: 'Nœuds majeurs de transit du Réseau Interconnecté Sud (RIS)',
      river_or_location: 'Littoral (Bekoko) et Centre (Oyomabang)',
      operators: 'SONATREL (Société Nationale de Transport de l\'Électricité)',
      voltage_specs: 'Postes 225 kV et départs 90 kV',
      notes_fr: 'Les équipes de maintenance spécialisée de SONATREL effectuent des inspections annuelles par capteurs UHF et caméras thermiques étalonnées sur les compartiments SF6 et les têtes de câbles souterrains 90 kV reliant Oyomabang aux postes urbains de Yaoundé (Kondengui, Ngousso). Cette surveillance a permis de détecter à temps un échauffement de mâchoire de sectionneur 225 kV évitant un black-out majeur dans la capitale.',
      notes_en: 'SONATREL specialized diagnostic crews conduct annual UHF partial discharge surveys and calibrated infrared thermography on SF6 compartments and 90 kV cable terminations linking Oyomabang to urban Yaoundé substations (Kondengui, Ngousso). Early detection of a 225 kV disconnector jaw thermal hotspot successfully prevented a cascading capital blackout.',
      status: 'verified',
      source: 'Rapports d\'Inspection & Thermographie SONATREL / Enquêtes Post-Incidents 2025'
    },
    international_case: {
      title_fr: 'Surveillance Continue UHF des Postes GIS de RTE (France)',
      title_en: 'RTE Continuous UHF Partial Discharge Monitoring on 400 kV GIS Fleet (France)',
      location: 'France (Réseau de Transport d\'Électricité - RTE)',
      capacity_mw: 'Surveillance de plus de 45 sous-stations blindées 400 kV',
      key_features: 'Capteurs UHF permanents couplés à des algorithmes de filtrage IA éliminant 99.8% des faux positifs radioélectriques.'
    }
  },

  'D16.01': {
    subdomain_code: 'D16.01',
    concept_fr: `La conception des grilles de mise à la terre des postes haute tension (HTB/HTA) et des centrales de production selon l'IEEE Std 80-2013 et la CEI 61936-1 constitue le fondement absolu de la sécurité des personnes et de l'intégrité des équipements. Lors d'un court-circuit phase-terre franc (If jusqu'à 40 kA), l'écoulement du courant dans le sol provoque une montée en potentiel de terre (GPR - Ground Potential Rise). L'ingénierie d'earthing doit garantir que la tension de maille (toucher) et la tension de pas restent strictement inférieures aux seuils de fibrillation ventriculaire humaine, en tenant compte de la résistivité multicouche du sol (ρ) et d'un revêtement de gravier concassé haute résistivité (ρs).`,
    concept_en: `Substation and power plant grounding grid design under IEEE Std 80-2013 and IEC 61936-1 provides the foundational safeguard for personnel life and critical electrical assets. During single line-to-ground faults (If up to 40 kA), current injection into earth creates Ground Potential Rise (GPR). Grounding engineering strictly constrains mesh (touch) and step potentials below human ventricular fibrillation thresholds, incorporating multilayer soil resistivity (ρ) and high-resistivity crushed rock surface dressing (ρs).`,
    systems_fr: `Les systèmes de mise à la terre et de sécurité du poste comprennent :
1. Grille maillée principale en cuivre nu étamé (120 à 180 mm²) enterrée à 0.6 m avec soudures aluminothermiques (Cadweld) indestructibles.
2. Réseau de piquets verticaux profonds en acier cuivré (15 à 30 m) foncés en périphérie pour capter les couches géologiques humides et abaisser la résistance globale Rg sous 1.0 Ω.
3. Ceinture équipotentielle extérieure entourant le poste à 1.0 m au-delà de la clôture métallique pour éliminer le danger de toucher extérieur.
4. Analyse d'arc électrique selon IEEE 1584-2018 et NFPA 70E définissant l'énergie incidente (cal/cm²), la frontière d'arc (AFB) et les catégories d'EPI requises.`,
    systems_en: `Substation earthing and safety systems encompass:
1. Main bare tinned copper grounding grid mesh (120-180 mm²) buried at 0.6 m with irreversible exothermic (Cadweld) bonds.
2. Deep vertical copper-clad steel earth rod array (15-30 m) driving into deep moist geological strata to drive overall resistance Rg below 1.0 Ω.
3. Peripheral equipotential ring buried 1.0 m beyond perimeter metal fencing mitigating external touch potential.
4. Arc flash hazard analysis per IEEE 1584-2018 and NFPA 70E calculating incident energy (cal/cm²), arc flash boundary (AFB), and mandatory PPE classes.`,
    engineering_fr: `Méthodologie de calcul IEEE 80-2013 :
- Calcul de la résistance de grille selon Sverak : Rg = ρ · [1/Lt + 1/√(20A) · (1 + 1/(1 + h√(20/A)))].
- Tensions tolérables de pas et de toucher pour un corps de 50 kg : Etouch = (1000 + 1.5 · Cs · ρs) · 0.116 / √ts ; Estep = (1000 + 6.0 · Cs · ρs) · 0.116 / √ts.
- Facteur de déréflexion de surface Cs tenant compte de l'épaisseur du concassé (hs = 15 à 20 cm) et du facteur de réflexion K.
- Dimensionnement de section de conducteur selon la formule d'Onderdonk pour résister à la fusion thermique sous courant de court-circuit maximal.`,
    engineering_en: `IEEE 80-2013 analytical equations:
- Sverak's ground resistance: Rg = ρ · [1/Lt + 1/√(20A) · (1 + 1/(1 + h√(20/A)))].
- Tolerable touch and step potentials (50 kg body): Etouch = (1000 + 1.5 · Cs · ρs) · 0.116 / √ts ; Estep = (1000 + 6.0 · Cs · ρs) · 0.116 / √ts.
- Surface derating factor Cs accounting for crushed rock thickness (hs = 15-20 cm) and reflection factor K.
- Conductor thermal fusing cross-section per Onderdonk equation under prospective clearing time ts.`,
    formulas: [FORMULAS[0], FORMULAS[2]],
    standards: [STANDARDS[0], STANDARDS[1]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Ingénierie de Prise de Terre en Sol Granitique au Poste 225/90 kV d\'Oyomabang (Yaoundé)',
      title_en: 'Granite High-Resistivity Earthing at Oyomabang 225/90 kV Substation (Yaoundé)',
      plant_name: 'Poste d\'Interconnexion 225/90 kV d\'Oyomabang (Yaoundé)',
      capacity_mw: 'Nœud stratégique d\'alimentation de Yaoundé (plus de 300 MW injectés)',
      river_or_location: 'Oyomabang, Yaoundé (Région du Centre)',
      operators: 'SONATREL (Transport Haute Tension)',
      voltage_specs: '225 kV / 90 kV / 15 kV',
      notes_fr: 'Le poste d\'Oyomabang est implanté sur une colline latéritique rocheuse où la résistivité superficielle dépasse 650 à 900 Ω·m en saison sèche. Pour ramener la résistance globale sous 1.0 Ω et maîtriser les tensions de pas et de toucher sous un courant de défaut de 25 kA, SONATREL a réalisé 24 forages verticaux profonds de 30 mètres injectés à la bentonite conductrice combinés à un matelas de gravier de granit concassé de 20 cm.',
      notes_en: 'Oyomabang substation sits on a rocky lateritic ridge with surface dry resistivity reaching 650-900 Ω·m. To pull overall grid resistance below 1.0 Ω and keep touch and step voltages safe under 25 kA earth faults, SONATREL engineered 24 deep 30 m boreholes with conductive bentonite grout alongside a 20 cm crushed granite surface layer.',
      status: 'verified',
      source: 'Rapport technique d\'ingénierie poste SONATREL / Projet d\'interconnexion Nachtigal-Oyomabang 2025'
    },
    international_case: {
      title_fr: 'Mise à la Terre du Poste 400 kV de Champa (PowerGrid, Inde)',
      title_en: 'Champa 400 kV HVDC & AC Converter Station Grounding (PowerGrid India)',
      location: 'Champa, Inde',
      capacity_mw: 'Station de conversion HVDC ±800 kV 6000 MW',
      key_features: 'Grille maillée 350 m × 250 m avec forages profonds 40 m et coordination fine IEEE 80 / CEI 61936-1.'
    }
  },

  'D16.02': {
    subdomain_code: 'D16.02',
    concept_fr: `La protection foudre des postes HTB et des lignes de transport selon la CEI 62305 et la CEI 60099-4 assure l'interception sans faille des coups de foudre directs et l'écrêtage des surtensions atmosphériques transitoires. Dans les régions équatoriales à très fort niveau kéraunique (Afrique Centrale, golfe de Guinée avec Td > 140 jours d'orage/an), les parafoudres à oxyde métallique (ZnO) sans éclateur constituent l'ultime rempart pour protéger les enroulements des autotransformateurs de puissance contre le claquage diélectrique. La coordination d'isolement (CEI 60071) impose une marge de protection d'au moins 20% entre le niveau de protection du parafoudre (Upl) et la tenue au choc de foudre (BIL) du transformateur.`,
    concept_en: `Lightning protection of HV substations and overhead lines per IEC 62305 and IEC 60099-4 guarantees reliable interception of direct strikes and clamp-down of atmospheric transient overvoltages. In equatorial high-keraunic zones (Central Africa, Gulf of Guinea with Td > 140 thunderstorm days/year), gapless metal-oxide (ZnO) surge arresters provide the essential protection preventing catastrophic transformer winding dielectric breakdown. Insulation coordination (IEC 60071) strictly requires a minimum 20% protective margin between arrester protective level (Upl) and transformer lightning impulse withstand (BIL).`,
    systems_fr: `Composants de la chaîne de protection foudre :
1. Portiques paratonnerres et mâts verticaux dimensionnés par la méthode de la sphère fictive roulante (CEI 62305-1, rayon R = 20 m pour Classe I).
2. Câbles de garde en acier galvanisé ou OPGW (câble de garde à fibres optiques) avec angle de protection négatif (-5° à 0°) pour prévenir tout coup direct sur les conducteurs de phase.
3. Parafoudres à oxyde de zinc (ZnO) haute énergie (classe station SM/SH, capacité d'absorption > 8 kJ/kV de Ur) installés au plus près des traversées 225 kV et 90 kV des transformateurs.
4. Compteurs de décharges et mesure du courant de fuite résistif en ligne pour diagnostiquer le vieillissement des varistances ZnO.`,
    systems_en: `Lightning mitigation system architecture:
1. Lightning masts and shielding aerials engineered via the rolling sphere method (IEC 62305-1, radius R = 20 m for Class I).
2. Overhead shield wires (OPGW) with negative shielding angle (-5° to 0°) preventing phase shielding failure.
3. High-energy station-class metal-oxide surge arresters (Class SM/SH, thermal absorption > 8 kJ/kV of Ur) mounted adjacent to 225 kV and 90 kV transformer bushings.
4. Surge counters and online resistive leakage current monitors detecting ZnO varistor block degradation.`,
    engineering_fr: `Règles de dimensionnement selon CEI 60099-4 et CEI 60071 :
- Tension de fonctionnement continu Uc (MCOV) : Uc ≥ Us_max / √3.
- Tension assignée Ur tenant compte de la surtension temporaire à fréquence industrielle (TOV) lors d'un défaut à la terre : Ur ≥ Ke · (Us_max / √3) / Ktov.
- Niveau de protection au choc de foudre Upl @ 10 kA (8/20 µs) : Upl ≈ 2.45 · Ur.
- Marge de protection obligatoire : PM = (BIL - Upl) / Upl ≥ 20.0%.
- Règle de distance maximale parafoudre-transformateur pour éviter l'amplification par réflexion d'onde : Lmax ≤ (BIL - Upl) · v / (2 · du/dt).`,
    engineering_en: `Sizing criteria per IEC 60099-4 and IEC 60071:
- Continuous Operating Voltage Uc (MCOV): Uc ≥ Us_max / √3.
- Rated Voltage Ur addressing power-frequency temporary overvoltages (TOV) during ground faults: Ur ≥ Ke · (Us_max / √3) / Ktov.
- Lightning impulse protective level Upl @ 10 kA (8/20 µs): Upl ≈ 2.45 · Ur.
- Mandatory protective margin: PM = (BIL - Upl) / Upl ≥ 20.0%.
- Maximum lead length separation rule avoiding reflection surge doubling: Lmax ≤ (BIL - Upl) · v / (2 · du/dt).`,
    formulas: [FORMULAS[1], FORMULAS[2]],
    standards: [STANDARDS[1], STANDARDS[0]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Coordination d\'Isolement et Parafoudres ZnO au Nœud 225 kV de Mangombé (Édéa)',
      title_en: 'Insulation Coordination & ZnO Surge Arresters at Mangombé 225 kV Junction (Édéa)',
      plant_name: 'Poste d\'Interconnexion 225/90 kV de Mangombé',
      capacity_mw: 'Carrefour majeur du Réseau Interconnecté Sud (RIS)',
      river_or_location: 'Édéa, Bassin de la Sanaga (Région du Littoral)',
      operators: 'SONATREL (Exploitation Transport)',
      voltage_specs: '225 kV / 90 kV / 15 kV',
      notes_fr: 'Avec plus de 145 jours d\'orage par an dans la cuvette d\'Édéa, le poste de Mangombé subit une densité de foudroiement extrême. Pour éliminer les claquages d\'isolateurs et les avaries de transformateurs, SONATREL a déployé des parafoudres ZnO 225 kV de classe station SM à enveloppe silicone polymère avec compteurs de décharges numériques télétransmis au SCADA.',
      notes_en: 'With over 145 thunderstorm days per year in Édéa basin, Mangombé substation faces severe lightning flash density. To eliminate flashovers and autotransformer failures, SONATREL upgraded to 225 kV Station Medium (SM) polymer-housed ZnO surge arresters with digital discharge counters integrated into regional SCADA.',
      status: 'verified',
      source: 'Direction du Transport SONATREL / Bilan annuel de sûreté du réseau RIS 2026'
    },
    international_case: {
      title_fr: 'Protection Foudre Renforcée du Poste 500 kV d\'Itaipu (Brésil/Paraguay)',
      title_en: 'Itaipu 500 kV Substation Advanced Lightning Shielding (Brazil/Paraguay)',
      location: 'Foz do Iguaçu, Brésil',
      capacity_mw: 'Centrale hydroélectrique 14 000 MW',
      key_features: 'Couverture intégrale par sphère roulante R = 20 m avec câbles de garde OPGW croisés et parafoudres ZnO 500 kV 12 kJ/kV.'
    }
  },
  'D01.03': {
    subdomain_code: 'D01.03',
    concept_fr: 'Fission nucléaire contrôlée d\'uranium 235 ou plutonium dans la cuve du réacteur, transfert de chaleur par circuit primaire pressurisé (155 bar, 315°C) vers générateurs de vapeur, entraînant une turbine à vapeur saturée reliée à un alternateur 4 pôles à 1500 tr/min. Nouveaux réacteurs modulaires SMR (50-300 MWe) à sûreté passive intrinsèque.',
    concept_en: 'Controlled nuclear fission in reactor vessel, heat transfer via pressurized primary loop (155 bar, 315°C) into steam generators, driving saturated steam turbines coupled to 4-pole synchronous generators at 1500 rpm. Advanced SMRs (50-300 MWe) with passive gravity cooling.',
    systems_fr: 'Cuve réacteur avec barres de contrôle en bore/cadmium, générateurs de vapeur verticaux, circuit primaire avec pompes primaires de 7 MW, turbine HP/BP avec sécheurs-surchauffeurs, alternateur synchrone rotor à pôles lisses 1500 tr/min 24 kV refroidi à l\'hydrogène sous pression, transformateur élévateur d\'évacuation 24/400 kV.',
    systems_en: 'Reactor pressure vessel with boron/cadmium control rods, vertical steam generators, primary coolant pumps (7 MW), HP/LP steam turbines with moisture separators, cylindrical rotor synchronous generator (1500 rpm, 24 kV, pressurized hydrogen cooling), 24/400 kV step-up transformer.',
    engineering_fr: 'Dimensionnement neutronique et thermohydraulique selon prescriptions AIEA (IAEA) et CEI 61513. Bilan thermique, marge de flux thermique critique (DNBR > 1.3), inertie électromécanique élevée (H = 4.5 à 6.0 s) stabilisant le réseau lors d\'excursions de fréquence.',
    engineering_en: 'Core neutronics and thermal-hydraulic design per IAEA and IEC 61513. Thermal balance, Departure from Nucleate Boiling Ratio (DNBR > 1.3), large rotational inertia (H = 4.5 to 6.0 s) providing vital grid frequency support.',
    formulas: [FORMULAS[13], FORMULAS[15]],
    standards: [STANDARDS[0], STANDARDS[3]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Étude Stratégique Prospective Nucléaire SMR (Vision Émergence Cameroun)',
      title_en: 'SMR Nuclear Strategic Assessment (Cameroon Vision Horizon)',
      plant_name: 'Projet d\'évaluation technique SMR Cameroun (MINEE / AIEA)',
      capacity_mw: 'Module pilote 100 à 300 MWe',
      river_or_location: 'Littoral / Grand Sud',
      operators: 'MINEE / Coopération Internationale AIEA',
      voltage_specs: 'Évacuation 225 kV RIS',
      notes_fr: 'Dans le cadre de la diversification du mix électrique et de la décarbonation industrielle (ALUCAM, sidérurgie), le Cameroun collabore avec l\'AIEA sur l\'évaluation du cadre réglementaire et de sûreté pour l\'intégration future de réacteurs modulaires SMR à sûreté passive en base ruban.',
      notes_en: 'Evaluating small modular reactors (SMR 100-300 MWe) with IAEA for base-load industrial stability and deep decarbonization of Cameroon energy-intensive industries.',
      status: 'reference',
      source: 'MINEE / Agence Internationale de l\'Énergie Atomique (AIEA) Country Programme Framework'
    },
    international_case: {
      title_fr: 'Centrale Nucléaire NuScale VOYGR SMR (États-Unis)',
      title_en: 'NuScale VOYGR SMR Power Plant (USA)',
      location: 'Idaho National Laboratory, USA',
      capacity_mw: '6 x 77 MWe (462 MWe total)',
      key_features: 'Conception modulaire intégrée sous-terraine avec refroidissement convectif passif illimité sans apport d\'énergie externe.'
    }
  },
  'D01.06': {
    subdomain_code: 'D01.06',
    concept_fr: 'Cogénération électrique et thermique par valorisation de déchets agro-industriels (bagasse de canne à sucre, coques de palmiste, sciure de bois) ou méthanisation de lisiers et déchets municipaux en biogaz (CH4 60%). Chaudière à lit fluidisé et turbine à vapeur à contrepression ou groupe motogénérateur gaz synchrone.',
    concept_en: 'Combined heat and power (CHP) utilizing agro-industrial biomass residues (sugar cane bagasse, palm kernel shells, wood waste) or anaerobic digester biomethane (CH4 60%). Fluidized bed boilers with back-pressure steam turbines or lean-burn gas gensets.',
    systems_fr: 'Chaudière biomasse haute pression (40-60 bar, 450°C), turbo-alternateur synchrone 4 pôles 1500 tr/min 6.6 kV / 15 kV, groupe biogaz avec alternateur sans balais brushless classe H, filtre électrostatique de dépoussiérage des fumées, cellule d\'évacuation MT 30 kV.',
    systems_en: 'Biomass boiler (40-60 bar, 450°C), 4-pole synchronous turbogenerator (1500 rpm, 6.6 kV / 15 kV), lean-burn biomethane genset with brushless Class H alternator, electrostatic precipitator, 30 kV grid injection bay.',
    engineering_fr: 'Dimensionnement du cycle Rankine et calcul de la puissance nette électrique et thermique selon CEI 60034-1 et CEI 60909. Régulation de tension AVR et délestage d\'îlotage en cas de rupture du réseau de distribution 30 kV.',
    engineering_en: 'Rankine cycle heat balance, net electrical efficiency calculation per IEC 60034-1 and IEC 60909. AVR voltage control and islanding load shedding upon 30 kV utility feeder trips.',
    formulas: [FORMULAS[13], FORMULAS[0]],
    standards: [STANDARDS[0], STANDARDS[17]],
    roles: [ENGINEERING_ROLES[1], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Centrale de Cogénération Biomasse Bagasse de la SOSUCAM (Mbandjock & Nkoteng)',
      title_en: 'SOSUCAM Bagasse Biomass Cogeneration Power Plant (Mbandjock & Nkoteng)',
      plant_name: 'Cogénération Sucreries de Mbandjock et Nkoteng',
      capacity_mw: '12.5 MW électrique + vapeur de procédé',
      river_or_location: 'Mbandjock et Nkoteng, Département de la Haute-Sanaga (Centre)',
      operators: 'SOSUCAM (Groupe SOMDIAA) / Eneo',
      voltage_specs: 'Production 5.5 kV / Évacuation réseau local 30 kV',
      notes_fr: 'Pendant la campagne sucrière (novembre à mai), la combustion de la bagasse alimente les turbines à vapeur fournissant l\'énergie totale des usines sucrières et injectant le surplus sur le réseau interconnecté local 30 kV.',
      notes_en: 'Combusting sugarcane bagasse generates up to 12.5 MW, powering sugar processing plants and injecting seasonal surpluses into the local 30 kV distribution grid.',
      status: 'verified',
      source: 'Direction Technique SOSUCAM / Bilan énergétique MINEE 2024'
    },
    international_case: {
      title_fr: 'Centrale Biomasse d\'Albioma Bois-Rouge (La Réunion)',
      title_en: 'Albioma Bois-Rouge 100% Biomass Power Plant (Reunion Island)',
      location: 'Saint-André, La Réunion',
      capacity_mw: '108 MWe',
      key_features: 'Conversion totale de la houille vers la biomasse bagasse et granulés de bois avec chaudières à lit fluidisé circulant et injection continue sur le réseau insulaire.'
    }
  },
  'D01.07': {
    subdomain_code: 'D01.07',
    concept_fr: 'Extraction d\'eau géothermique ou vapeur surchauffée de réservoirs profonds (150°C à 300°C) situés le long des failles volcaniques et rifts tectoniques. Transformation en électricité via détente directe (dry steam), séparation flash (single/double flash), ou cycle binaire de Rankine à fluide organique (ORC).',
    concept_en: 'Extraction of geothermal brine and superheated steam from deep hydrothermal reservoirs (150°C-300°C) along volcanic rifts. Power generation via dry steam, flash separators, or Organic Rankine Cycle (ORC) binary units.',
    systems_fr: 'Puits de production et puits de réinjection géothermique, séparateur cyclonique vapeur/saumure, échangeur de chaleur fluide organique (pentane/isobutane), turbine géothermique avec matériaux anti-corrosion H2S/silice, aéro-condenseurs ou tours de refroidissement humides, alternateur synchrone 11 kV / 15 kV.',
    systems_en: 'Production and reinjection wells, cyclone steam separators, organic working fluid heat exchangers (pentane/isobutane), corrosion-resistant geothermal turbine, dry cooling air-cooled condensers, 11 kV / 15 kV synchronous alternator.',
    engineering_fr: 'Dimensionnement du puits de soutirage selon les équations d\'écoulement diphasique. Modélisation de la thermodynamique ORC selon CEI 60034 et IEEE 1010. Production électrique de base (facteur de charge > 90%) non intermittente idéale pour la tenue de fréquence réseau.',
    engineering_en: 'Two-phase fluid dynamics wellhead modeling. ORC binary thermodynamic efficiency per IEC 60034 and IEEE 1010. Continuous baseload capability (capacity factor > 90%) providing exceptional grid inertia.',
    formulas: [FORMULAS[13], FORMULAS[15]],
    standards: [STANDARDS[0], STANDARDS[4]],
    roles: [ENGINEERING_ROLES[1], ENGINEERING_ROLES[0]],
    cameroon_case: {
      title_fr: 'Potentiel Géothermique de la Ligne du Cameroun & Mont Cameroun',
      title_en: 'Cameroon Volcanic Line & Mount Cameroon Geothermal Potential',
      plant_name: 'Champs Géothermiques de Buea, Manengouba et Ngaoundéré',
      capacity_mw: 'Potentiel estimé à 150 - 250 MW',
      river_or_location: 'Régions du Sud-Ouest, Ouest et Adamaoua',
      operators: 'MINEE / Ministère de la Recherche Scientifique (MINRESI)',
      voltage_specs: 'Interconnexion potentielle 90 kV / 225 kV',
      notes_fr: 'La ligne volcanique du Cameroun présente des gradients géothermiques élevés (> 60°C/km) avec sources hydrothermales chaudes à Manengouba et autour du Mont Cameroun, offrant une opportunité majeure de production électrique ruban pour le corridor Ouest/Littoral.',
      notes_en: 'The Cameroon Volcanic Line exhibits high thermal gradients (> 60°C/km) with prospective geothermal prospects in Mount Cameroon and Ngaoundéré plateau for baseload power.',
      status: 'reference',
      source: 'Atlas Géothermique d\'Afrique Centrale / Banque Africaine de Développement (BAD)'
    },
    international_case: {
      title_fr: 'Complexe Géothermique d\'Olkaria (Kenya)',
      title_en: 'Olkaria Geothermal Power Complex (Kenya)',
      location: 'Great Rift Valley, Naivasha, Kenya',
      capacity_mw: '863 MW opérationnel',
      key_features: 'Premier producteur géothermique d\'Afrique fournissant 40% de l\'électricité du Kenya grâce à des puits de 3000 m et turbines flash et ORC.'
    }
  },
  'D01.08': {
    subdomain_code: 'D01.08',
    concept_fr: 'Conversion de l\'énergie cinétique des marées (usines marémotrices), des courants de marée et fluviaux côtiers (hydroliennes), de la houle océanique (houlomoteurs) et du gradient thermique océanique (ETM / OTEC).',
    concept_en: 'Harnessing tidal range potential, coastal tidal and river currents (hydrokinetic turbines), wave oscillations, and Ocean Thermal Energy Conversion (OTEC) between warm surface and cold deep waters.',
    systems_fr: 'Turbines hydroliennes à axe horizontal sous-marines avec pales à pas variable, génératrice synchrone à aimants permanents (PMSG) étanche immergée, convertisseur AC-DC-AC 4 quadrants sous-marin ou en station côtière, câble sous-marin HTA 30 kV armé tripolaire, station élévatrice terrestre 30/90 kV.',
    systems_en: 'Subsea horizontal-axis tidal stream turbines with variable pitch blades, sealed direct-drive permanent magnet synchronous generator (PMSG), back-to-back full converters, 30 kV armored subsea cable, onshore 30/90 kV substation.',
    engineering_fr: 'Hydrodynamique selon CEI 62600 (Énergie marine - Systèmes de conversion houlomoteur et hydrolien). Calcul des forces d\'arrachement de traînée et cavitation des pales. Protection cathodique par anodes sacrificielles contre la corrosion saline côtière.',
    engineering_en: 'Hydrodynamic performance per IEC 62600. Rotor thrust loading, blade cavitation margins, and cathodic protection design against aggressive marine corrosion.',
    formulas: [FORMULAS[13], FORMULAS[2]],
    standards: [STANDARDS[0], STANDARDS[16]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Potentiel Hydrolien et Marémoteur de l\'Estuaire du Wouri et Baie de Manoka',
      title_en: 'Wouri Estuary & Manoka Bay Hydrokinetic Tidal Potential',
      plant_name: 'Zone Côtière Douala - Cap Cameroun',
      capacity_mw: 'Potentiel hydrolien pilote 5 à 15 MW',
      river_or_location: 'Estuaire du Wouri, Région du Littoral',
      operators: 'Autorité Portuaire de Douala (PAD) / MINEE',
      voltage_specs: 'Raccordement réseau distribution 30 kV Eneo',
      notes_fr: 'L\'estuaire du Wouri subit un marnage semi-diurne de 2.8 m avec de puissants courants de jusant et de flot (> 2.0 m/s), offrant un potentiel pilote pour l\'alimentation insulaire de Manoka et des bases côtières.',
      notes_en: 'Strong tidal currents (> 2 m/s) in Wouri estuary offer hydrokinetic micro-generation prospects to electrify isolated mangrove fishing islands like Manoka.',
      status: 'reference',
      source: 'Étude d\'océanographie physique et bathymétrie Port Autonome de Douala 2023'
    },
    international_case: {
      title_fr: 'Usine Marémotrice de la Rance (France)',
      title_en: 'La Rance Tidal Power Plant (France)',
      location: 'Bretagne, France',
      capacity_mw: '240 MW (24 groupes bulbes de 10 MW)',
      key_features: 'Pionnière mondiale en service depuis 1966 exploitant un marnage de 13.5 m pour injecter 500 GWh/an sur le réseau 225 kV.'
    }
  },
  'D01.09': {
    subdomain_code: 'D01.09',
    concept_fr: 'Production d\'hydrogène vert décarboné par électrolyse de l\'eau (électrolyseurs alcalins, PEM ou SOEC) alimentés par surplus d\'électricité renouvelable hydro/solaire, stockage gazeux haute pression ou ammoniac, et restitution électrique par piles à combustible (PEMFC / SOFC) ou turbines à gaz à combustion d\'hydrogène.',
    concept_en: 'Green hydrogen production via water electrolysis (Alkaline, Proton Exchange Membrane PEM, or Solid Oxide SOEC) powered by hydro/solar surplus, high-pressure underground storage, and power regeneration via fuel cells (PEMFC/SOFC) or hydrogen-fueled gas turbines.',
    systems_fr: 'Modules d\'électrolyseurs PEM mégawatt (consommation 50-55 kWh/kg H2), compresseurs d\'hydrogène 350-700 bar, réservoirs de stockage en matériaux composites, pile à combustible stationnaire SOFC à haute efficacité (rendement électrique > 60%), onduleur réseau 4 quadrants avec contrôle actif de fréquence.',
    systems_en: 'Multi-megawatt PEM electrolyzer stacks (50-55 kWh/kg H2), hydrogen compressors (350-700 bar), composite storage cylinders, stationary high-temperature SOFC fuel cell (electric efficiency > 60%), 4-quadrant grid-tied inverter.',
    engineering_fr: 'Dimensionnement du couplage électro-chimique selon CEI 62282 (Technologies des piles à combustible) et ISO 22734. Gestion du saut de puissance lors du passage de l\'électrolyseur en soutirage au mode réinjection, offrant des services système ultrarapides de réglage primaire (FCR).',
    engineering_en: 'Electrochemical efficiency per IEC 62282 and ISO 22734. Ultra-fast bidirectional power dispatch between electrolysis load and fuel cell generation providing Fast Frequency Response (FFR).',
    formulas: [FORMULAS[17], FORMULAS[2]],
    standards: [STANDARDS[23], STANDARDS[11]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[3]],
    cameroon_case: {
      title_fr: 'Projet Pilote Hydrogène Vert & Ammoniac Décarboné de Kribi',
      title_en: 'Kribi Deep Seaport Green Hydrogen & Green Ammonia Pilot',
      plant_name: 'Kribi Industrial Port Green H2 Hub',
      capacity_mw: 'Électrolyseur pilote 20 MW couplé au surplus hydroélectrique du RIS',
      river_or_location: 'Zone Industrielle Portuaire de Kribi (Sud)',
      operators: 'Port Autonome de Kribi (PAK) / Partenariat International',
      voltage_specs: 'Alimentation 225 kV Poste de Kribi',
      notes_fr: 'Projet pionnier exploitant l\'énergie hydroélectrique abondante de la Sanaga (Nachtigal) durant les heures creuses pour produire de l\'hydrogène et de l\'ammoniac vert destinés à la fertilisation agricole et à l\'exportation maritime.',
      notes_en: 'Leveraging Sanaga hydro off-peak power in Kribi deep seaport to produce green hydrogen and zero-carbon ammonia for agriculture and maritime bunkering.',
      status: 'reference',
      source: 'Feuille de Route Hydrogène Vert MINEE / Port Autonome de Kribi 2025'
    },
    international_case: {
      title_fr: 'Centrale Hybride Hydrogène de Puertollano (Espagne)',
      title_en: 'Puertollano 100% Green Hydrogen Industrial Plant (Spain)',
      location: 'Ciudad Real, Espagne',
      capacity_mw: 'Électrolyseur PEM 20 MW + Solaire PV 100 MW + BESS 20 MWh',
      key_features: 'Plus grande installation d\'hydrogène vert d\'Europe réduisant les émissions industrielles de l\'usine d\'engrais d\'Iberdrola.'
    }
  },
  'D01.10': {
    subdomain_code: 'D01.10',
    concept_fr: 'Architecture d\'alimentation électrique sécurisée des auxiliaires vitaux d\'une centrale (pompes de réfrigération, régulateurs de vitesse, graissage sous pression des paliers, commande des vannes de décharge, contrôle-commande). Alimentation normale par transformateur de soutirage TS, secours par transformateur auxiliaire d\'évacuation TG/TA, et groupe électrogène Diesel de secours démarrage à froid (Black Start).',
    concept_en: 'Critical auxiliary electrical power architecture for generating plants (cooling water pumps, governors, bearing lubrication, spillway gate motors, control systems). Normal supply via unit auxiliary transformer, reserve supply via station service transformer, and emergency Black Start diesel generators.',
    systems_fr: 'Transformateur de soutirage d\'auxiliaires (TS) 11/6.6 kV, tableau MT des auxiliaires 6.6 kV avec disjoncteurs débrochables sous vide, transformateurs abaisseurs 6.6 kV / 400 V, tableaux de distribution BT secourus, redresseurs-chargeurs et batteries stationnaires 110 V / 48 V DC pour la filerie de déclenchement, onduleurs ASI sans coupure UPS pour le SCADA.',
    systems_en: 'Unit auxiliary transformer (11/6.6 kV), 6.6 kV auxiliary switchgear with vacuum breakers, 6.6 kV / 400 V distribution transformers, emergency LV switchboards, dual battery chargers and 110 V / 48 V DC battery banks for trip circuits, true online UPS for SCADA/DCS.',
    engineering_fr: 'Dimensionnement selon CEI 60076, CEI 60909 et IEEE 308 (Class 1E Power Systems). Basculement automatique inverseur de source normal/secours (ATS) en moins de 100 ms sans désamorçage des moteurs auxiliaires. Autonomie minimale des batteries poste de 4 heures en cas de coupure générale (Blackout).',
    engineering_en: 'Engineering per IEC 60076, IEC 60909 and IEEE 308. Fast automatic bus transfer (ATS < 100 ms) ensuring continuous induction motor ride-through. Minimum 4-hour DC station battery autonomy during total blackout.',
    formulas: [FORMULAS[16], FORMULAS[1]],
    standards: [STANDARDS[0], STANDARDS[5]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Alimentation des Auxiliaires et Groupe Black Start de Songloulou',
      title_en: 'Songloulou Hydro Station Auxiliaries & Black Start Diesel Architecture',
      plant_name: 'Centrale Hydroélectrique de Songloulou 384 MW',
      capacity_mw: 'Services auxiliaires 8 x 630 kVA + Groupe Diesel Black Start 2000 kVA',
      river_or_location: 'Songloulou, Fleuve Sanaga (Littoral)',
      operators: 'Eneo Cameroon / SONATREL',
      voltage_specs: 'Auxiliaires 6.6 kV et 400 V / DC 125 V',
      notes_fr: 'Le système auxiliaire de Songloulou comprend deux transformateurs de soutirage reliés aux barres 11 kV et un groupe électrogène Diesel lourd de démarrage autonome (Black Start) capable de réamorcer l\'excitation et d\'ouvrir les vannes pour réalimenter le corridor 225 kV vers Mangombé après écroulement du RIS.',
      notes_en: 'Songloulou features dual auxiliary transformers and a 2000 kVA Black Start diesel system capable of starting the plant from dead-grid condition to re-energize the 225 kV line to Mangombé.',
      status: 'verified',
      source: 'Manuel d\'exploitation et consignes Black Start Eneo / SONATREL 2024'
    },
    international_case: {
      title_fr: 'Système Auxiliaire 400 V et Diesels d\'Urgence de la Centrale de Grand Coulee (USA)',
      title_en: 'Grand Coulee Dam 400 V Station Service & Emergency Auxiliaries (USA)',
      location: 'Washington State, USA',
      capacity_mw: 'Centrale 6809 MW',
      key_features: 'Architecture à quadruple redondance avec trois sources indépendantes et groupes diesels de secours ségrégués selon IEEE 308.'
    }
  },
  'D14.03': {
    subdomain_code: 'D14.03',
    concept_fr: 'Atténuation des harmoniques de courant (Ih) et de tension (Uh) générés par les charges non-linéaires (ponts redresseurs 6 et 12 impulsions de variateurs, fours à induction, onduleurs solaires). Utilisation de filtres passifs accordés LC (rangs 5, 7, 11, 13), filtres amortis passe-haut, et filtres actifs d\'harmoniques (APF) à injection de courant en opposition de phase.',
    concept_en: 'Mitigation of harmonic currents (Ih) and voltages (Uh) produced by non-linear industrial loads (6-pulse and 12-pulse drive rectifiers, arc furnaces, inverters). Implementation of passive tuned LC filters, high-pass damped filters, and parallel Active Power Filters (APF) with real-time counter-phase current injection.',
    systems_fr: 'Batteries de condensateurs MT avec selfs anti-harmoniques de désaccord (ex: p = 7%, fr = 189 Hz), filtres passifs calés sur les rangs 5 (250 Hz) et 7 (350 Hz), filtre actif parallèle (APF) à IGBT avec transformateurs de courant Tore Rogowski et processeur de signal numérique DSP 32 bits, disjoncteur MT avec relais de déséquilibre étoile-étoile.',
    systems_en: 'MV capacitor banks with anti-resonance detuning reactors (e.g. p = 7%, fr = 189 Hz), passive LC branches tuned to 5th and 7th harmonic orders, parallel IGBT Active Power Filter (APF) with Rogowski CTs and 32-bit DSP controller, vacuum circuit breaker with unbalance protection.',
    engineering_fr: 'Dimensionnement selon CEI 61000-3-6, CEI 61642 et IEEE 519-2022. Calcul de la fréquence d\'anti-résonance parallèle entre la batterie de condensateurs et la réactance de court-circuit du transformateur amont : fr = f1 · √(Ssc / Qc). Règle impérative : fr doit être éloignée de tout multiple harmonique existant pour éviter les surtensions destructrices.',
    engineering_en: 'Sizing per IEC 61000-3-6, IEC 61642 and IEEE 519-2022. Parallel resonance calculation between power factor capacitors and upstream transformer short-circuit impedance: fr = f1 · √(Ssc / Qc). Strict constraint: detuning fr away from characteristic harmonics to eliminate destructive voltage amplification.',
    formulas: [FORMULAS[9], FORMULAS[8]],
    standards: [STANDARDS[8], STANDARDS[19]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[2]],
    cameroon_case: {
      title_fr: 'Dépollution Harmonique des Usines Métallurgiques PROMETAL et ALUCAM (Douala/Édéa)',
      title_en: 'Harmonic Decontamination at PROMETAL & ALUCAM Heavy Industrial Plants (Douala/Édéa)',
      plant_name: 'Complexes Sidérurgiques PROMETAL Bassa et Cuves ALUCAM',
      capacity_mw: 'Puissance absorbée > 180 MW avec filtres harmoniques MT 30 kV',
      river_or_location: 'Zone Industrielle de Bassa (Douala) et Édéa',
      operators: 'PROMETAL / ALUCAM / Eneo / SONATREL',
      voltage_specs: 'Réseau d\'alimentation 90 kV et 30 kV',
      notes_fr: 'Les fours à arc électrique et laminoirs de la zone de Bassa provoquaient des distorsions harmoniques de tension THDu > 8% sur le poste de Logbaba, dépassant les limites SONATREL. L\'installation de filtres hybrides passifs-actifs 30 kV a ramené le THDu < 3.2%, protégeant les transformateurs et les consommateurs avoisinants.',
      notes_en: 'Heavy electric arc furnaces and rolling mills in Douala generated severe harmonic distortion (THDu > 8%) at Logbaba substation. Installing 30 kV hybrid passive-active filter banks successfully restored THDu below 3.2% compliant with SONATREL grid code.',
      status: 'verified',
      source: 'Rapport d\'audit qualité de l\'onde électrique SONATREL / ARSEL 2025'
    },
    international_case: {
      title_fr: 'Système de Filtrage Harmonique STATCOM de Tata Steel (Royaume-Uni)',
      title_en: 'Tata Steel Port Talbot STATCOM & Active Filtering Installation (UK)',
      location: 'Port Talbot, Pays de Galles, Royaume-Uni',
      capacity_mw: 'Laminoir à chaud 80 MVA',
      key_features: 'Association STATCOM ±50 Mvar et filtres d\'harmoniques 33 kV assurant la conformité stricte à la recommandation G5/5 de National Grid.'
    }
  },
  'D14.04': {
    subdomain_code: 'D14.04',
    concept_fr: 'Phénomène de variations répétitives de tension à basse fréquence (0.5 à 30 Hz) induisant le papillotement visuel perceptible (Flicker Pst court terme et Plt long terme), et dissymétrie des composantes directes/inverses/homopolaires (V2/V1) causée par des charges industrielles monophasées lourdes (fours à induction, soudage, traction ferroviaire).',
    concept_en: 'Rapid repetitive power-frequency voltage fluctuations (0.5-30 Hz) inducing visible lamp flicker (Pst short-term, Plt long-term), and voltage unbalance between positive, negative, and zero sequence components (V2/V1) caused by large single-phase or pulsating industrial loads.',
    systems_fr: 'Compensateur statique d\'énergie réactive ultra-rapide STATCOM à onduleur modulaire multi-niveaux (MMC), réactances de lissage de phase, bancs de compensation sélective de phase Steinmetz (convertisseurs d\'impédance monophasé-triphasé), analyseurs de réseau de classe A selon CEI 61000-4-30 avec flickermètre numérique CEI 61000-4-15.',
    systems_en: 'Fast-acting Modular Multilevel Converter (MMC) STATCOM, phase balance smoothing reactors, Steinmetz delta-wye phase balancing networks, Class A power quality analyzers complying with IEC 61000-4-30 and digital flickermeter per IEC 61000-4-15.',
    engineering_fr: 'Règles normatives selon CEI 61000-3-7 et CEI 61000-4-15 : Taux de déséquilibre en tension tau_u = (V_inverse / V_directe) * 100 <= 2.0% (valeur contractuelle SONATREL : 1.5%). Niveau d\'émission de flicker : Pst <= 1.0 (sur période de 10 min) et Plt <= 0.8 (sur période de 2 heures). Dimensionnement de la puissance réactive dynamique pour annuler le flicker causé par une variation de charge Delta Q : Delta U / U ≈ (Delta P * R + Delta Q * X) / U^2.',
    engineering_en: 'Assessment rules per IEC 61000-3-7 and IEC 61000-4-15: Voltage unbalance factor tau_u = (V_negative / V_positive) * 100 <= 2.0% (SONATREL limit: 1.5%). Flicker severity limits: Pst <= 1.0 (10-min window) and Plt <= 0.8 (2-hour rolling window). Dynamic reactive sizing mitigating voltage fluctuation Delta Q: Delta U / U ≈ (Delta P * R + Delta Q * X) / U^2.',
    formulas: [FORMULAS[17], FORMULAS[8]],
    standards: [STANDARDS[8], STANDARDS[21]],
    roles: [ENGINEERING_ROLES[0], ENGINEERING_ROLES[1]],
    cameroon_case: {
      title_fr: 'Contrôle du Flicker et Déséquilibre sur le Réseau 90 kV Oyomabang - Nomayos (Yaoundé)',
      title_en: 'Flicker & Voltage Unbalance Mitigation on Oyomabang - Nomayos 90 kV Loop (Yaoundé)',
      plant_name: 'Cimenteries de Nomayos et Laminoirs de la Région Centre',
      capacity_mw: 'Charges fluctuantes 45 MVA',
      river_or_location: 'Yaoundé Ouest / Nomayos, Région du Centre',
      operators: 'SONATREL / Eneo / CIMENCAM',
      voltage_specs: 'Liaison 90 kV et distribution 30 kV',
      notes_fr: 'Le démarrage direct de broyeurs à boulets de grande puissance et les cycles de fours provoquaient des à-coups de tension et du flicker Pst > 1.4 ressentis dans les quartiers résidentiels de Yaoundé. Le renforcement par gradins de condensateurs synchronisés et démarreurs progressifs a ramené le flicker Pst <= 0.72 conforme aux exigences de l\'ARSEL.',
      notes_en: 'Direct motor starting of heavy cement ball mills induced noticeable flicker (Pst > 1.4) on Yaoundé 90 kV loop. Upgrades with synchronous point-on-wave switching and soft starters curbed flicker to Pst <= 0.72, fully meeting ARSEL standards.',
      status: 'verified',
      source: 'Direction de l\'Exploitation SONATREL / Enquête Qualité de Service ARSEL 2024'
    },
    international_case: {
      title_fr: 'Compensation de Flicker par STATCOM ±100 Mvar à l\'Aciérie de Duisburg (Allemagne)',
      title_en: '±100 Mvar MMC STATCOM Flicker Mitigation at Duisburg Steelworks (Germany)',
      location: 'Duisburg, Rhénanie-du-Nord-Westphalie, Allemagne',
      capacity_mw: 'Four à arc électrique 140 MVA',
      key_features: 'Réduction du papillotement d\'un facteur 5.2 grâce à un temps de réponse en boucle fermée inférieur à 5 millisecondes.'
    }
  }
};

// ANSI PROTECTION CODES TABLE (For D11 deep-dive screen)
export interface AnsiCode {
  code: string;
  name_fr: string;
  name_en: string;
  target_equipment: string;
  operating_time: string;
  significance: string;
}

export const ANSI_CODES: AnsiCode[] = [
  {
    code: '87T',
    name_fr: 'Protection différentielle de transformateur',
    name_en: 'Transformer differential protection',
    target_equipment: 'Transformateurs de puissance HTA/HTB, autotransformateurs',
    operating_time: '< 25 ms',
    significance: 'Protection unitaire absolue : compare les courants entrants et sortants. Insensible aux défauts externes.'
  },
  {
    code: '87G',
    name_fr: 'Protection différentielle de générateur / alternateur',
    name_en: 'Generator differential protection',
    target_equipment: 'Alternateurs synchrones (Songloulou, Nachtigal, Edéa)',
    operating_time: '< 20 ms',
    significance: 'Détecte les courts-circuits entre phases dans les enroulements statoriques sans temporisation.'
  },
  {
    code: '87B',
    name_fr: 'Protection différentielle de jeu de barres',
    name_en: 'Busbar differential protection',
    target_equipment: 'Jeux de barres 225 kV / 90 kV / 30 kV en poste',
    operating_time: '< 15 ms',
    significance: 'Protection critique de nœud : élimine un défaut sur le jeu de barres en déclenchant tous les départs raccordés.'
  },
  {
    code: '21',
    name_fr: 'Protection de distance (impédancemétrique)',
    name_en: 'Distance protection',
    target_equipment: 'Lignes de transport aériennes et souterraines 225 kV / 90 kV',
    operating_time: 'Zone 1: < 20 ms · Zone 2: 300 ms · Zone 3: 600 ms',
    significance: 'Calcule l\'impédance de boucle Z = U/I jusqu\'au défaut. Assure la protection principale et le secours distant.'
  },
  {
    code: '50/51',
    name_fr: 'Protection à maximum de courant instantanée (50) et temporisée (51)',
    name_en: 'Instantaneous (50) and time-delay (51) overcurrent',
    target_equipment: 'Départs distribution MT 30 kV, câbles, transformateurs',
    operating_time: '50: < 30 ms · 51: Courbes inverses CEI (SI, VI, EI) 0.1s - 2s',
    significance: 'Protection universelle de secours et de base sur les réseaux de distribution radiaux.'
  },
  {
    code: '67N',
    name_fr: 'Protection à maximum de courant résiduel directionnelle (défaut terre)',
    name_en: 'Directional earth-fault overcurrent',
    target_equipment: 'Réseaux de transport bouclés, départs MT à neutre compensé ou impédant',
    operating_time: '0.2s - 1.0s selon coordination',
    significance: 'Détecte le sens d\'écoulement du courant de défaut à la terre (amont vs aval) via la tension résiduelle Vo.'
  },
  {
    code: '40',
    name_fr: 'Protection contre la perte d\'excitation',
    name_en: 'Loss of excitation (field failure)',
    target_equipment: 'Alternateurs synchrones',
    operating_time: '0.2s - 0.5s',
    significance: 'Empêche l\'alternateur de fonctionner en génératrice asynchrone et d\'absorber une puissance réactive excessive.'
  },
  {
    code: '81',
    name_fr: 'Protection de fréquence (sous-fréquence 81U / sur-fréquence 81O)',
    name_en: 'Frequency protection (Underfrequency 81U / Overfrequency 81O)',
    target_equipment: 'Postes de délestage réseau, alternateurs',
    operating_time: 'Échelons de délestage 49.5 Hz, 49.0 Hz, 48.5 Hz, 48.0 Hz',
    significance: 'Sauvegarde ultime de l\'intégrité du réseau national en cas de perte soudaine de groupes de production.'
  }
];
