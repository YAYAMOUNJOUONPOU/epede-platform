// server/db/canonicalDataStore.ts
// Normalized In-Memory Authoritative Data Store for EPEDE Backend Services
// Pre-seeded with complete canonical definitions across all 16 Domains and Power Chain entities.

import {
  ApiDomain,
  ApiSubdomain,
  ApiEquipment,
  ApiStandard,
  ApiRelationship,
  CalculationWorkbenchContract,
} from '../models/types';
import { CANONICAL_GRAPH_NODES, CANONICAL_GRAPH_EDGES } from '../../src/data/canonicalGraphEngine';
import { CAMEROON_SUBSTATIONS, CAMEROON_POWER_PLANTS } from '../../src/data/cameroonGridData';
import { EQUIPMENT_ITEMS, RELATION_EDGES } from '../../src/data/epedeData';

export class CanonicalDataStore {
  public domains: Map<string, ApiDomain> = new Map();
  public subdomains: Map<string, ApiSubdomain> = new Map();
  public equipment: Map<string, ApiEquipment> = new Map();
  public standards: Map<string, ApiStandard> = new Map();
  public relationships: ApiRelationship[] = [];
  public workbenches: Map<string, CalculationWorkbenchContract> = new Map();

  constructor() {
    this.seedDomains();
    this.seedStandards();
    this.seedEquipment();
    this.seedRelationships();
    this.seedWorkbenches();
  }

  private seedDomains() {
    const domainList: ApiDomain[] = [
      {
        id: 'D01',
        code: 'D01',
        name: { fr: 'Ressources Énergétiques & Production', en: 'Energy Resources & Generation' },
        category: 'POWER_CHAIN',
        description: {
          fr: 'Centrales hydroélectriques, thermiques à gaz, solaires photovoltaïques et parcs éoliens. Conversion électromécanique et élévation de tension.',
          en: 'Hydroelectric, thermal gas, solar PV, and wind generation plants. Electromechanical conversion and step-up GSU transformation.',
        },
        sortOrder: 1,
        subdomainCount: 6,
        equipmentCount: 24,
        standardIds: ['IEC_60034', 'IEC_61400', 'IEEE_421'],
        keyTechnologies: ['Francis Turbines', 'Synchronous Generators', 'GSU Transformers', 'AVR Excitation', 'Solar Inverters'],
        engineeringRoles: ['Turbine Engineer', 'Hydro Generation Specialist', 'Excitation & Governor Engineer'],
        cameroonContext: {
          fr: 'Aménagements structurants : Songloulou (384 MW), Nachtigal (420 MW), Edéa (276 MW), Memve\'ele (211 MW), réservoir régulateur de Lom Pangar (1000 m³/s).',
          en: 'Anchor power plants: Songloulou (384 MW), Nachtigal (420 MW), Edea (276 MW), Memve\'ele (211 MW), Lom Pangar regulating reservoir (1000 m³/s).',
        },
      },
      {
        id: 'D02',
        code: 'D02',
        name: { fr: 'Réseaux de Transport Haute Tension', en: 'High Voltage Transmission Networks' },
        category: 'POWER_CHAIN',
        description: {
          fr: 'Lignes aériennes HTB (225 kV, 90 kV), câbles souterrains, pylônes, conducteurs faisceaux, isolateurs et stabilité dynamique des grands réseaux maillés.',
          en: 'Overhead EHV/HV transmission lines (225 kV, 90 kV), underground cables, lattice towers, bundled conductors, insulators, and dynamic grid stability.',
        },
        sortOrder: 2,
        subdomainCount: 5,
        equipmentCount: 18,
        standardIds: ['IEC_60826', 'IEC_60909', 'IEEE_738'],
        keyTechnologies: ['225 kV Overhead Lines', 'ACSR Conductor Bundles', 'Composite Insulators', 'OPGW Optical Ground Wire'],
        engineeringRoles: ['Power Systems Planning Engineer', 'Transmission Line Design Engineer', 'Grid Dispatcher'],
        cameroonContext: {
          fr: 'Réseau Interconnecté Sud (RIS) et Réseau Interconnecté Nord (RIN) gérés par la SONATREL. Projet d\'interconnexion RIS-RIN et exportation vers le Tchad (PIMERT).',
          en: 'Southern (RIS) and Northern (RIN) Interconnected Grids operated by SONATREL. Major RIS-RIN interconnector project with export to Chad (PIMERT).',
        },
      },
      {
        id: 'D03',
        code: 'D03',
        name: { fr: 'Postes Électriques & Jonctions de Réseau', en: 'Electrical Substations & Grid Nodes' },
        category: 'POWER_CHAIN',
        description: {
          fr: 'Postes à isolement dans l\'air (AIS) et sous enveloppe métallique (GIS). Schémas double jeu de barres, disjoncteurs SF6, sectionneurs, transformateurs de puissance et services auxiliaires CA/CC.',
          en: 'Air-Insulated (AIS) and Gas-Insulated (GIS) substations. Double busbar schemes, SF6 circuit breakers, disconnectors, power transformers, and AC/DC auxiliary systems.',
        },
        sortOrder: 3,
        subdomainCount: 7,
        equipmentCount: 32,
        standardIds: ['IEC_62271', 'IEC_60076', 'IEEE_80'],
        keyTechnologies: ['Power Transformers 225/30 kV', 'SF6 Circuit Breakers', 'Pantograph Disconnectors', 'Surge Arresters', '110V DC Battery Banks'],
        engineeringRoles: ['Substation Lead Engineer', 'Primary Equipment Specialist', 'Commissioning Manager'],
        cameroonContext: {
          fr: 'Nœuds névralgiques : Postes d\'évacuation de Nachtigal, Nomayos 225/90 kV, Mangombé 225/90/30 kV, Ahala 225/30 kV, Bekoko 225/90 kV, Logbaba.',
          en: 'Strategic nodes: Nachtigal evacuation substation, Nomayos 225/90 kV, Mangombé 225/90/30 kV, Ahala 225/30 kV, Bekoko 225/90 kV, Logbaba.',
        },
      },
      {
        id: 'D04',
        code: 'D04',
        name: { fr: 'Réseaux de Distribution Moyenne Tension', en: 'Medium Voltage Distribution Networks' },
        category: 'POWER_CHAIN',
        description: {
          fr: 'Réseaux HTA 30 kV et 15 kV, postes sources HTA/BT, cellules modulaires sous enveloppe métallique, transformateurs de distribution et régimes de neutre limités par résistance.',
          en: '30 kV and 15 kV MV distribution grids, primary substations, modular MV switchgear, distribution transformers, and neutral grounding resistor schemes.',
        },
        sortOrder: 4,
        subdomainCount: 6,
        equipmentCount: 22,
        standardIds: ['IEC_62271_200', 'IEC_60076', 'IEC_60255'],
        keyTechnologies: ['30 kV Air/Vacuum Switchgear', 'Cast Resin MV/LV Transformers', 'NGR Neutral Resistor 40A', 'Reclosers & Ring Main Units'],
        engineeringRoles: ['Distribution Operations Engineer', 'MV Feeder Planning Engineer', 'Field Maintenance Supervisor'],
        cameroonContext: {
          fr: 'Réseau opéré par Eneo. Tension standardisée HTA à 30 kV (avec 15 kV historique), imposant un isolement assigné certifié 36 kV selon CEI 62271-200.',
          en: 'Operated by Eneo. Standard MV voltage of 30 kV (with legacy 15 kV), mandating 36 kV rated insulation class under IEC 62271-200.',
        },
      },
      {
        id: 'D05',
        code: 'D05',
        name: { fr: 'Installations Électriques Basse Tension & Bâtiments', en: 'Low Voltage Installations & Buildings' },
        category: 'POWER_CHAIN',
        description: {
          fr: 'Tableaux Généraux Basse Tension (TGBT), régimes de neutre TT/TN/IT, disjoncteurs boîtier moulé (MCCB/ACB), protection différentielle et compensation de puissance réactive.',
          en: 'Main Low Voltage Switchboards (MLVS), TT/TN/IT earthing arrangements, MCCB/ACB circuit breakers, RCD protection, and power factor correction.',
        },
        sortOrder: 5,
        subdomainCount: 5,
        equipmentCount: 28,
        standardIds: ['IEC_60364', 'IEC_61439', 'IEC_60947'],
        keyTechnologies: ['Form 4b Switchboards', 'Air Circuit Breakers', 'Surge Protective Devices (SPD)', 'Capacitor Banks'],
        engineeringRoles: ['Electrical Building Services Engineer', 'LV Commissioning Specialist', 'Safety Auditor'],
      },
      {
        id: 'D06',
        code: 'D06',
        name: { fr: 'Systèmes de Protection Électrique & Relayage', en: 'Protection Systems & Numerical Relaying' },
        category: 'ENGINEERING_SYSTEM',
        description: {
          fr: 'Relais numériques multifonctions, réducteurs de mesure (TC/TT), fonctions différentielles ANSI 87T, impédancemétriques ANSI 21, à maximum de courant ANSI 50/51 et coordination sélective.',
          en: 'Numerical relays, CT/VT instrument transformers, differential 87T, distance 21, overcurrent 50/51, and time-graded selectivity coordination.',
        },
        sortOrder: 6,
        subdomainCount: 6,
        equipmentCount: 26,
        standardIds: ['IEC_60255', 'IEC_61869', 'IEEE_C37_90'],
        keyTechnologies: ['Numerical Relays (SIPROTEC/MiCOM/SEL)', 'Protection Class CTs (5P20)', 'Capacitive VTs', 'ANSI 87T / 21 / 50/51 Algorithms'],
        engineeringRoles: ['Protection & Coordination Engineer', 'Relay Testing Technician', 'Fault Analysis Specialist'],
      },
      {
        id: 'D07',
        code: 'D07',
        name: { fr: 'Automatismes Industriels & Entraînements VFD', en: 'Industrial Automation & VFD Drives' },
        category: 'ENGINEERING_SYSTEM',
        description: {
          fr: 'Variateurs de vitesse à fréquence variable (VFD), démarreurs progressifs, automates programmables industriels (API/PLC), architectures de commande moteur (MCC).',
          en: 'Variable Frequency Drives (VFD), soft starters, Programmable Logic Controllers (PLC), and Motor Control Center (MCC) architectures.',
        },
        sortOrder: 7,
        subdomainCount: 5,
        equipmentCount: 20,
        standardIds: ['IEC_61131', 'IEC_61800', 'IEEE_519'],
        keyTechnologies: ['Active Front End VFDs', 'Motor Protection Relays', 'Safety PLCs', 'Bypass Contactors'],
        engineeringRoles: ['Automation Engineer', 'Drives & Power Electronics Engineer', 'PLC Programmer'],
      },
      {
        id: 'D08',
        code: 'D08',
        name: { fr: 'Qualité de l’Énergie & Harmoniques', en: 'Power Quality & Harmonics Mitigation' },
        category: 'ENGINEERING_SYSTEM',
        description: {
          fr: 'Analyse des creux de tension, harmoniques de courant/tension (THD), filtres actifs/passifs, compensation de puissance réactive dynamique et conformité IEEE 519.',
          en: 'Voltage sags, current and voltage harmonics (THD), active/passive filters, dynamic reactive power compensation, and IEEE 519 compliance.',
        },
        sortOrder: 8,
        subdomainCount: 4,
        equipmentCount: 16,
        standardIds: ['IEEE_519', 'IEC_61000_4_30', 'IEC_60831'],
        keyTechnologies: ['Active Harmonic Filters (AHF)', 'Detuned Reactor Capacitor Banks', 'Class A Power Quality Analyzers', 'STATCOM'],
        engineeringRoles: ['Power Quality Engineer', 'Harmonic Mitigation Specialist', 'Network Studies Analyst'],
      },
      {
        id: 'D09',
        code: 'D09',
        name: { fr: 'Énergies Renouvelables & Micro-Réseaux', en: 'Renewable Energies & Microgrids' },
        category: 'ENGINEERING_SYSTEM',
        description: {
          fr: 'Centrales solaires au sol et en toiture, parcs éoliens, contrôleurs de micro-réseaux, synchronisation d\'onduleurs grid-following / grid-forming.',
          en: 'Utility-scale and rooftop solar PV, wind farms, microgrid controllers, grid-following and grid-forming inverter synchronization.',
        },
        sortOrder: 9,
        subdomainCount: 5,
        equipmentCount: 18,
        standardIds: ['IEC_62109', 'IEEE_1547', 'IEC_62446'],
        keyTechnologies: ['Central Inverters', 'String Inverters', 'Microgrid Energy Management System (MEMS)', 'Solar Pyranometers'],
        engineeringRoles: ['Solar PV Design Engineer', 'Microgrid Systems Engineer', 'Grid Integration Specialist'],
      },
      {
        id: 'D10',
        code: 'D10',
        name: { fr: 'Stockage d’Énergie par Batteries (BESS)', en: 'Battery Energy Storage Systems (BESS)' },
        category: 'ENGINEERING_SYSTEM',
        description: {
          fr: 'Systèmes conteneurisés de batteries Li-ion (LFP), onduleurs bidirectionnels (PCS), Battery Management System (BMS), arbitrage d\'énergie et support de fréquence.',
          en: 'Containerized Li-ion (LFP) battery systems, bidirectional Power Conversion Systems (PCS), BMS, energy arbitrage, and primary frequency containment.',
        },
        sortOrder: 10,
        subdomainCount: 4,
        equipmentCount: 14,
        standardIds: ['IEC_62619', 'NFPA_855', 'IEEE_2800'],
        keyTechnologies: ['LFP Battery Racks', 'Bidirectional 4-Quadrant PCS', 'HVAC Thermal Management', 'Aerosol/Clean-Agent Fire Suppression'],
        engineeringRoles: ['BESS Application Engineer', 'Battery Safety & Thermal Specialist', 'Grid Services Manager'],
      },
      {
        id: 'D11',
        code: 'D11',
        name: { fr: 'Numérique, Téléconduite & SCADA Réseau', en: 'Digital Substations, Automation & SCADA' },
        category: 'ENGINEERING_SYSTEM',
        description: {
          fr: 'Norme CEI 61850 (bus de station MMS, messages rapides GOOSE, bus de processus Sampled Values), passerelles RTU, serveurs SCADA et synchronisation horaire PTP IEEE 1588.',
          en: 'IEC 61850 architecture (station bus MMS, high-speed GOOSE, process bus Sampled Values), RTU gateways, SCADA HMIs, and IEEE 1588 PTP precision timing.',
        },
        sortOrder: 11,
        subdomainCount: 6,
        equipmentCount: 24,
        standardIds: ['IEC_61850', 'IEEE_1588', 'IEC_60870_5_104'],
        keyTechnologies: ['Substation Gateways (RTU)', 'IEC 61850 Merging Units', 'Redundant Ethernet Switches (PRP/HSR)', 'PTP Grandmaster Clocks'],
        engineeringRoles: ['SCADA & Substation Automation Engineer', 'Cyber-Physical Systems Engineer', 'IEC 61850 Integration Specialist'],
      },
      {
        id: 'D12',
        code: 'D12',
        name: { fr: 'Télécommunications Industrielles & Réseau OT', en: 'Industrial Telecoms & Operational Technology' },
        category: 'CROSS_CUTTING',
        description: {
          fr: 'Réseaux de télécommunication d\'entreprise et de transport d\'énergie : liaisons fibres optiques OPGW, courants porteurs en ligne (CPL), multiplexeurs SDH/MPLS-TP et liaisons radio UHF.',
          en: 'Utility telecommunications: OPGW fiber optic links, Power Line Carrier (PLC), SDH/MPLS-TP transport networks, and critical UHF radio channels.',
        },
        sortOrder: 12,
        subdomainCount: 4,
        equipmentCount: 15,
        standardIds: ['ITU_T_G709', 'IEEE_1613', 'IEC_62443'],
        keyTechnologies: ['OPGW Splice Boxes', 'SDH/MPLS-TP Multiplexers', 'Teleprotection Interfaces', 'Secure Industrial Firewalls'],
        engineeringRoles: ['Utility Telecom Engineer', 'Fiber Optics Specialist', 'OT Network Architect'],
      },
      {
        id: 'D13',
        code: 'D13',
        name: { fr: 'Mise à la Terre, Paratonnerres & Sécurité Électrique', en: 'Earthing, Lightning Protection & Safety' },
        category: 'CROSS_CUTTING',
        description: {
          fr: 'Calculs de grilles de terre selon IEEE 80, tensions de pas et de toucher, parafoudres céramiques ZnO (CEI 60099-4), cage de Faraday et analyse du risque Arc Flash (IEEE 1584).',
          en: 'Substation ground grid calculations under IEEE 80, step and touch voltages, ZnO surge arresters (IEC 60099-4), lightning shielding, and Arc Flash hazard analysis (IEEE 1584).',
        },
        sortOrder: 13,
        subdomainCount: 5,
        equipmentCount: 16,
        standardIds: ['IEEE_80', 'IEEE_1584', 'IEC_62305', 'IEC_60099_4'],
        keyTechnologies: ['Copper Clad Steel Ground Grid', 'Zinc Oxide Surge Arresters', 'Arc Flash Optical Detection Relays', 'Earth Resistance Testers'],
        engineeringRoles: ['Grounding & Lightning Specialist', 'HSE Electrical Safety Manager', 'Arc Flash Assessment Engineer'],
      },
      {
        id: 'D14',
        code: 'D14',
        name: { fr: 'Maintenance, Essais de Réception & Diagnostic', en: 'Asset Management, Testing & Diagnostics' },
        category: 'CROSS_CUTTING',
        description: {
          fr: 'Essais en usine (FAT) et sur site (SAT), analyse des gaz dissous dans l\'huile (DGA), résistance dynamique des contacts, facteur de dissipation diélectrique (tan delta) et thermographie infrarouge.',
          en: 'Factory (FAT) and Site Acceptance Testing (SAT), Dissolved Gas Analysis (DGA), dynamic contact resistance, Tan Delta dielectric testing, and infrared thermography.',
        },
        sortOrder: 14,
        subdomainCount: 5,
        equipmentCount: 18,
        standardIds: ['IEC_60599', 'IEEE_C57_104', 'IEC_60060'],
        keyTechnologies: ['Online DGA Gas Analyzers', 'Primary Injection Test Sets (OMICRON/Megger)', 'VLF Tan Delta Cable Testers', 'Infrared Thermographic Cameras'],
        engineeringRoles: ['High Voltage Test Engineer', 'Transformer Diagnostics Specialist', 'Asset Health Manager'],
      },
      {
        id: 'D15',
        code: 'D15',
        name: { fr: 'Études Réseau, Stabilité & Planification', en: 'Power System Studies & Grid Planning' },
        category: 'CROSS_CUTTING',
        description: {
          fr: 'Calculs d\'écoulement de puissance (Load Flow), calcul des courants de court-circuit symétriques et dissymétriques (CEI 60909), stabilité transitoire, amortissement d\'oscillations et études d\'impact raccordement.',
          en: 'Load flow studies, symmetrical and unsymmetrical short-circuit calculations (IEC 60909), transient stability, power oscillation damping, and grid connection impact assessments.',
        },
        sortOrder: 15,
        subdomainCount: 4,
        equipmentCount: 12,
        standardIds: ['IEC_60909', 'IEEE_399', 'CIGRE_TB_569'],
        keyTechnologies: ['Power Systems Simulation Solvers', 'Electromagnetic Transient Simulators (EMTP)', 'Modal Stability Analyzers', 'WAMS Phasor Data Concentrators'],
        engineeringRoles: ['Power Systems Studies Lead', 'Transient Stability Modeler', 'Transmission Planning Analyst'],
      },
      {
        id: 'D16',
        code: 'D16',
        name: { fr: 'Ingénierie Numérique, BIM Électrique & IA', en: 'Digital Engineering, Electrical BIM & AI' },
        category: 'CROSS_CUTTING',
        description: {
          fr: 'Jumeaux numériques de postes et centrales, schémas unifilaires intelligents (Smart SLD), modèles d\'information de réseau (CIM CEI 61970/61968), détection prédictive de pannes par IA.',
          en: 'Substation and plant digital twins, intelligent Smart SLD, Common Information Models (CIM IEC 61970/61968), and AI-driven predictive asset anomaly detection.',
        },
        sortOrder: 16,
        subdomainCount: 4,
        equipmentCount: 14,
        standardIds: ['IEC_61970', 'IEC_61968', 'ISO_19650'],
        keyTechnologies: ['CIM RDF/XML Grid Model Exchanges', 'Substation 3D BIM Models', 'Real-Time Edge AI Anomaly Detectors', 'Interactive Engineering Knowledge Graph'],
        engineeringRoles: ['Digital Twin Architect', 'Power Systems Data Scientist', 'BIM Electrical Coordinator'],
      },
    ];

    for (const d of domainList) {
      this.domains.set(d.id, d);
    }
  }

  private seedStandards() {
    const stdList: ApiStandard[] = [
      {
        id: 'IEC_60076',
        organization: 'IEC',
        code: 'IEC 60076',
        title: { fr: 'Transformateurs de puissance', en: 'Power transformers' },
        scope: { fr: 'Exigences générales, échauffement, niveaux d\'isolement, tolérances d\'impédance et essais.', en: 'General requirements, temperature rise, insulation levels, impedance tolerances and dielectric testing.' },
        keyArticles: ['Part 1: General', 'Part 2: Temperature rise', 'Part 3: Insulation levels', 'Part 5: Short-circuit withstand'],
        applicableEquipmentTypes: ['POWER_TRANSFORMER', 'DISTRIBUTION_TRANSFORMER', 'GSU_TRANSFORMER'],
      },
      {
        id: 'IEC_62271',
        organization: 'IEC',
        code: 'IEC 62271-100',
        title: { fr: 'Appareillage à haute tension - Disjoncteurs à courant alternatif', en: 'High-voltage switchgear and controlgear - AC circuit-breakers' },
        scope: { fr: 'Pouvoir de coupure assigné en court-circuit, séquences de manœuvre (O-0.3s-CO-3min-CO), tension transitoire de rétablissement (TTR).', en: 'Rated short-circuit breaking capacity, operating sequence (O-0.3s-CO-3min-CO), transient recovery voltage (TRV).' },
        keyArticles: ['Rated breaking current', 'Transient Recovery Voltage (TRV)', 'Capacitive switching', 'Mechanical endurance class M2'],
        applicableEquipmentTypes: ['CIRCUIT_BREAKER_HV', 'CIRCUIT_BREAKER_MV', 'GIS_BAY'],
      },
      {
        id: 'IEC_60255',
        organization: 'IEC',
        code: 'IEC 60255',
        title: { fr: 'Relais de mesure et dispositifs de protection', en: 'Measuring relays and protection equipment' },
        scope: { fr: 'Caractéristiques de fonctionnement, courbes à temps inverse CEI (Normalement inverse, Très inverse, Extrêmement inverse), précision et compatibilité CEM.', en: 'Operating characteristics, IEC inverse-time curves (SI, VI, EI), accuracy limits and EMC immunity.' },
        keyArticles: ['Part 151: Functional requirements for over/under current protection', 'Part 187-1: Functional requirements for differential protection'],
        applicableEquipmentTypes: ['NUMERICAL_RELAY', 'FEEDER_PROTECTION', 'TRANSFORMER_DIFFERENTIAL_RELAY'],
      },
      {
        id: 'IEC_61850',
        organization: 'IEC',
        code: 'IEC 61850',
        title: { fr: 'Réseaux et systèmes de communication dans les postes', en: 'Communication networks and systems for power utility automation' },
        scope: { fr: 'Modélisation sémantique des données (Logical Nodes), télémesures MMS, messages multicast temps-réel GOOSE (<4ms), valeurs échantillonnées (Sampled Values).', en: 'Data modeling (Logical Nodes), MMS telemetry, peer-to-peer GOOSE messages (<4ms), Sampled Values (SV) for process bus.' },
        keyArticles: ['Part 7-2: Basic communication structure', 'Part 8-1: Specific communication service mapping - MMS and GOOSE', 'Part 9-2: Sampled Values over Ethernet'],
        applicableEquipmentTypes: ['MERGING_UNIT', 'PROTECTION_IED', 'SUBSTATION_GATEWAY', 'ETHERNET_SWITCH_PRP'],
      },
      {
        id: 'IEEE_80',
        organization: 'IEEE',
        code: 'IEEE Std 80-2013',
        title: { fr: 'Guide pour la sécurité des prises de terre dans les postes alternatifs', en: 'IEEE Guide for Safety in AC Substation Grounding' },
        scope: { fr: 'Calcul des tensions de pas et de toucher admissibles par le corps humain (modèles 50kg et 70kg), résistance de la grille, couche superficielle de gravier.', en: 'Calculation of tolerable touch and step voltages for human body, ground grid mesh resistance, crushed rock surfacing layer derating.' },
        keyArticles: ['Section 8: Criteria of tolerable voltage', 'Section 12: Soil resistivity testing', 'Section 14: Design of ground grid', 'Section 16: Concrete-encased electrodes'],
        applicableEquipmentTypes: ['GROUND_GRID', 'SURGE_ARRESTER', 'EARTHING_SWITCH', 'SUBSTATION_STRUCTURE'],
      },
      {
        id: 'IEC_60909',
        organization: 'IEC',
        code: 'IEC 60909-0',
        title: { fr: 'Courants de court-circuit dans les réseaux triphasés à courant alternatif', en: 'Short-circuit currents in three-phase a.c. systems - Calculation of currents' },
        scope: { fr: 'Méthode des composantes symétriques, facteur de tension c, courant initial de court-circuit symétrique Ik", courant de crête Ip, courant de rupture Ib.', en: 'Symmetrical components calculation, voltage factor c, initial symmetrical short-circuit current Ik", peak current Ip, breaking current Ib.' },
        keyArticles: ['Part 0: Calculation of currents', 'Part 1: Factors for calculation', 'Part 2: Data of electrical equipment for calculations'],
        applicableEquipmentTypes: ['POWER_TRANSFORMER', 'TRANSMISSION_LINE', 'GENERATOR', 'BUSBAR'],
      },
    ];

    for (const s of stdList) {
      this.standards.set(s.id, s);
    }
  }

  private seedEquipment() {
    const eqList: ApiEquipment[] = [
      {
        id: 'eq-trafo-225-30-63mva',
        domainId: 'D03',
        subdomainId: 'sub-d03-transformers',
        type: 'POWER_TRANSFORMER',
        tag: '==T1.QA01',
        name: { fr: 'Transformateur de Puissance 225/30 kV - 63 MVA', en: 'Power Transformer 225/30 kV - 63 MVA' },
        voltageNominal: '225 kV / 30 kV',
        powerRating: '63 MVA (ONAF) / 50 MVA (ONAN)',
        primaryFunction: {
          fr: 'Transformation abaisseuse de grand transport 225 kV vers le réseau de répartition HTA 30 kV avec couplage Dyn11 et régleur en charge (OLTC ±10%).',
          en: 'Step-down bulk transmission transformation from 225 kV to 30 kV MV distribution grid with Dyn11 vector group and ±10% On-Load Tap Changer (OLTC).',
        },
        specifications: {
          ratedPowerMva: 63,
          primaryVoltageKv: 225,
          secondaryVoltageKv: 30,
          shortCircuitImpedancePct: 12.5,
          vectorGroup: 'Dyn11',
          coolingType: 'ONAN/ONAF',
          oilWeightTonnes: 24.5,
          totalWeightTonnes: 85.0,
          noLoadLossesKw: 38,
          loadLossesKw: 240,
        },
        protectionFunctions: ['87T', '50/51', '50N/51N', '49', '63', '64R'],
        standards: ['IEC_60076', 'IEC_60255', 'IEEE_80'],
        provenance: {
          sourceType: 'INTERNATIONAL_STANDARD',
          sourceReference: 'IEC 60076-1 / SONATREL Technical Specification Spec-T-225',
          organization: 'IEC',
          edition: '2011',
          country: 'Cameroon',
          region: 'RIS Postes 225/30 kV (Ahala, Nomayos, Mangombé)',
          lastReviewed: '2026-09-17',
          verificationStatus: 'VERIFIED_STANDARD',
        },
        representations: {
          hasPhysicalDiagram: true,
          hasElectricalSld: true,
          hasFunctionalModel: true,
          hasScadaDigitalTwin: true,
        },
      },
      {
        id: 'eq-breaker-225kv-sf6',
        domainId: 'D03',
        subdomainId: 'sub-d03-switchgear',
        type: 'CIRCUIT_BREAKER_HV',
        tag: '==Q1.QA01',
        name: { fr: 'Disjoncteur Haute Tension 225 kV SF6 - 3150 A / 40 kA', en: '225 kV SF6 Live Tank Circuit Breaker - 3150 A / 40 kA' },
        voltageNominal: '225 kV (Ur = 245 kV)',
        powerRating: '3150 A Continu / 40 kA (1s)',
        primaryFunction: {
          fr: 'Interruption des courants de charge et élimination ultra-rapide des courts-circuits polyphasés (< 40 ms) avec extinction par auto-soufflage dans le gaz SF6.',
          en: 'Interruption of load currents and ultra-rapid clearing of polyphase short-circuits (< 40 ms) using self-blast SF6 arc extinction.',
        },
        specifications: {
          ratedVoltageKv: 245,
          ratedCurrentA: 3150,
          breakingCapacityKa: 40,
          makingCapacityKaPeak: 100,
          breakTimeMs: 40,
          operatingSequence: 'O-0.3s-CO-3min-CO',
          mechanismType: 'Spring-operated (Ressort pré-armé)',
          sf6PressureBar: 6.0,
        },
        protectionFunctions: ['50BF', '79', '25'],
        standards: ['IEC_62271', 'IEC_60255'],
        provenance: {
          sourceType: 'INTERNATIONAL_STANDARD',
          sourceReference: 'IEC 62271-100 / SONATREL HV Grid Code',
          organization: 'IEC',
          edition: '2021',
          country: 'Cameroon',
          region: 'Poste 225 kV Nomayos & Nachtigal',
          lastReviewed: '2026-09-17',
          verificationStatus: 'VERIFIED_STANDARD',
        },
        representations: {
          hasPhysicalDiagram: true,
          hasElectricalSld: true,
          hasFunctionalModel: true,
          hasScadaDigitalTwin: true,
        },
      },
      {
        id: 'eq-generator-songloulou-48mva',
        domainId: 'D01',
        subdomainId: 'sub-d01-hydro-turbines',
        type: 'HYDRO_GENERATOR',
        tag: '==H1.G01',
        name: { fr: 'Turbo-Alternateur Francis Songloulou - 48 MVA / 11 kV', en: 'Francis Hydro-Generator Songloulou - 48 MVA / 11 kV' },
        voltageNominal: '11 kV',
        powerRating: '48 MVA (40.8 MW @ cos phi 0.85)',
        primaryFunction: {
          fr: 'Conversion de l\'énergie hydraulique du fleuve Sanaga en énergie électrique triphasée 50 Hz avec régulation primaire de fréquence.',
          en: 'Conversion of hydraulic potential from the Sanaga River into three-phase 50 Hz electric power with primary frequency regulation.',
        },
        specifications: {
          ratedMva: 48,
          ratedMw: 40.8,
          voltageKv: 11,
          speedRpm: 150,
          frequencyHz: 50,
          turbineType: 'Francis à axe vertical',
          headMeters: 39,
          waterFlowM3s: 137.5,
          efficiencyPct: 94.8,
        },
        protectionFunctions: ['87G', '40', '64G', '51V', '81U/81O'],
        standards: ['IEC_60034', 'IEC_60255'],
        provenance: {
          sourceType: 'FIELD_MANUAL',
          sourceReference: 'Eneo / SONATREL Centrale Hydroélectrique de Songloulou Technical Dossier',
          country: 'Cameroon',
          region: 'Fleuve Sanaga (Edéa / Songloulou)',
          lastReviewed: '2026-09-17',
          verificationStatus: 'CAMEROON_CONTEXT',
        },
        representations: {
          hasPhysicalDiagram: true,
          hasElectricalSld: true,
          hasFunctionalModel: true,
          hasScadaDigitalTwin: true,
        },
      },
      {
        id: 'eq-relay-87t-micom',
        domainId: 'D06',
        subdomainId: 'sub-d06-differential',
        type: 'PROTECTION_IED',
        tag: '==P1.KF01',
        name: { fr: 'Relais Numérique Différentiel de Transformateur ANSI 87T', en: 'Numerical Transformer Differential Protection Relay ANSI 87T' },
        voltageNominal: '110 V CC (Alimentation)',
        powerRating: 'Courants secondaires 1 A / 5 A',
        primaryFunction: {
          fr: 'Protection unitaire instantanée contre les défauts internes entre spires et à la terre du transformateur, avec retenue harmonique 2 (enclenchement) et 5 (surfluxage).',
          en: 'Unit instant protection against internal phase-to-phase and earth faults, equipped with 2nd harmonic inrush and 5th harmonic overexcitation restraint.',
        },
        specifications: {
          trippingTimeMs: 18,
          biasCurrentAlgorithm: 'Dual-Slope Percentage Restraint (Is1 = 0.2 In, Is2 = 0.8 In)',
          harmonicRestraintH2Pct: 15,
          harmonicRestraintH5Pct: 35,
          communicationBus: 'IEC 61850 Edition 2 (MMS & GOOSE)',
        },
        protectionFunctions: ['87T', '87N/REF', '50/51', '50N/51N', '49'],
        standards: ['IEC_60255', 'IEC_61850'],
        provenance: {
          sourceType: 'INTERNATIONAL_STANDARD',
          sourceReference: 'IEC 60255-187-1 / IEEE C37.91',
          organization: 'IEC',
          edition: '2021',
          lastReviewed: '2026-09-17',
          verificationStatus: 'VERIFIED_STANDARD',
        },
        representations: {
          hasPhysicalDiagram: true,
          hasElectricalSld: true,
          hasFunctionalModel: true,
          hasScadaDigitalTwin: true,
        },
      },
    ];

    for (const eq of eqList) {
      this.equipment.set(eq.id, eq);
    }

    // Ingest 44 Canonical Graph Engine Nodes (Physical Energy Spine & Substation apparatus)
    for (const node of CANONICAL_GRAPH_NODES) {
      if (!this.equipment.has(node.id)) {
        const specs = (node.technicalSpecs || {}) as Record<string, any>;
        const powerStr = specs.rated_apparent_power_mva
          ? `${specs.rated_apparent_power_mva} MVA`
          : specs.capacity_mw
          ? `${specs.capacity_mw} MW`
          : specs.rated_active_power_mw
          ? `${specs.rated_active_power_mw} MW`
          : undefined;

        this.equipment.set(node.id, {
          id: node.id,
          domainId: node.domainCode,
          subdomainId: `sub-${node.domainCode.toLowerCase()}`,
          type: node.entityType.toUpperCase(),
          tag: node.tag,
          name: node.name,
          voltageNominal: node.voltageLevel,
          powerRating: powerStr,
          primaryFunction: node.description,
          specifications: specs,
          protectionFunctions: (node as any).protectionFunctions || [],
          standards: (node as any).standards || [],
          provenance: {
            sourceType: 'INTERNATIONAL_STANDARD',
            sourceReference: node.provenance?.source_ref || 'EPEDE Engineering Base',
            organization: 'IEC',
            verificationStatus: node.provenance?.verification_status === 'verified' ? 'VERIFIED_STANDARD' : 'ENGINEERING_REFERENCE',
            lastReviewed: node.provenance?.verified_at || '2026-09-17',
          },
          representations: {
            hasPhysicalDiagram: true,
            hasElectricalSld: true,
            hasFunctionalModel: true,
            hasScadaDigitalTwin: true,
          },
        });
      }
    }

    // Ingest Cameroon Strategic Substations
    for (const sub of CAMEROON_SUBSTATIONS) {
      const id = `substation-${sub.id}`;
      if (!this.equipment.has(id)) {
        this.equipment.set(id, {
          id,
          domainId: 'D03',
          subdomainId: 'sub-d03-substations',
          type: 'SUBSTATION_NODE',
          tag: sub.code,
          name: {
            fr: `Poste ${sub.name} (${sub.voltage_levels})`,
            en: `${sub.name} Substation (${sub.voltage_levels})`,
          },
          voltageNominal: sub.voltage_levels,
          powerRating: sub.transformer_capacity_mva,
          primaryFunction: {
            fr: sub.function_description_fr,
            en: sub.function_description_en,
          },
          specifications: {
            grid_system: sub.grid_system,
            region: sub.region,
            city: sub.city,
            bus_topology: sub.bus_topology,
            short_circuit_level_ka: sub.short_circuit_level_ka,
            operator: sub.operator,
            connected_lines: sub.connected_lines,
          },
          protectionFunctions: sub.protection_features,
          standards: ['IEC_62271', 'IEC_60076', 'IEEE_80'],
          provenance: {
            sourceType: 'UTILITY_GRID_CODE',
            sourceReference: `SONATREL / ARSEL Grid Observatory - ${sub.name}`,
            organization: 'SONATREL',
            country: 'Cameroon',
            region: sub.region,
            lastReviewed: '2026-09-17',
            verificationStatus: 'CAMEROON_CONTEXT',
          },
          representations: {
            hasPhysicalDiagram: true,
            hasElectricalSld: true,
            hasFunctionalModel: true,
            hasScadaDigitalTwin: true,
          },
        });
      }
    }

    // Ingest Cameroon Power Generation Plants
    for (const plant of CAMEROON_POWER_PLANTS) {
      const id = `plant-${plant.id}`;
      if (!this.equipment.has(id)) {
        this.equipment.set(id, {
          id,
          domainId: 'D01',
          subdomainId: 'sub-d01-generation',
          type: 'POWER_PLANT',
          tag: plant.code,
          name: {
            fr: `Centrale ${plant.name} (${plant.installed_capacity_mw} MW)`,
            en: `${plant.name} Power Station (${plant.installed_capacity_mw} MW)`,
          },
          voltageNominal: `${plant.voltage_kv} kV`,
          powerRating: `${plant.installed_capacity_mw} MW`,
          primaryFunction: {
            fr: plant.key_highlights_fr,
            en: plant.key_highlights_en,
          },
          specifications: {
            type: plant.type,
            installed_capacity_mw: plant.installed_capacity_mw,
            guaranteed_capacity_mw: plant.guaranteed_capacity_mw,
            grid_system: plant.grid_system,
            river_or_fuel: plant.river_or_fuel || '',
            operator: plant.operator,
            commissioning_year: plant.commissioning_year,
            ...(plant.technical_specs || {}),
          },
          protectionFunctions: ['87G', '40', '64G', '51V', '81U/O'],
          standards: ['IEC_60034', 'IEEE_421'],
          provenance: {
            sourceType: 'FIELD_MANUAL',
            sourceReference: `SONATREL / Eneo Generation Master Plan - ${plant.name}`,
            country: 'Cameroon',
            region: plant.region,
            lastReviewed: '2026-09-17',
            verificationStatus: 'CAMEROON_CONTEXT',
          },
          representations: {
            hasPhysicalDiagram: true,
            hasElectricalSld: true,
            hasFunctionalModel: true,
            hasScadaDigitalTwin: true,
          },
        });
      }
    }

    // Ingest All Equipment Items from EPEDE Catalog
    for (const eq of EQUIPMENT_ITEMS) {
      if (!this.equipment.has(eq.id)) {
        this.equipment.set(eq.id, {
          id: eq.id,
          domainId: eq.domain_code,
          subdomainId: eq.subdomain_id,
          type: eq.entity_type,
          tag: eq.aliases_fr?.[0] || eq.id,
          name: {
            fr: eq.name_fr,
            en: eq.name_en,
          },
          voltageNominal: (eq.technical?.['Tension primaire (HT)'] || eq.technical?.['Tension assignée (Ur)'] || eq.voltage_level || 'HV') as string,
          powerRating: (eq.technical?.['Puissance assignée'] || eq.technical?.['Puissance nominale (Sn)'] || '') as string,
          primaryFunction: {
            fr: eq.function_fr || eq.description_fr,
            en: eq.function_en || eq.description_en,
          },
          specifications: eq.technical || {},
          protectionFunctions: [],
          standards: [],
          provenance: {
            sourceType: 'INTERNATIONAL_STANDARD',
            sourceReference: eq.provenance?.source_ref || 'EPEDE Engineering Dossier',
            organization: 'IEC',
            country: 'Cameroon',
            region: eq.typical_location_fr,
            lastReviewed: '2026-09-17',
            verificationStatus: 'VERIFIED_STANDARD',
          },
          representations: {
            hasPhysicalDiagram: true,
            hasElectricalSld: true,
            hasFunctionalModel: true,
            hasScadaDigitalTwin: true,
          },
        });
      }
    }
  }

  private seedRelationships() {
    this.relationships = [
      {
        id: 'rel-001',
        sourceId: 'eq-generator-songloulou-48mva',
        sourceType: 'EQUIPMENT',
        targetId: 'eq-trafo-225-30-63mva',
        targetType: 'EQUIPMENT',
        relation: 'SUPPLIES',
        description: { fr: 'Alimente via le réseau 225 kV vers le poste abaisseur 225/30 kV', en: 'Feeds through the 225 kV transmission network to the step-down substation' },
      },
      {
        id: 'rel-002',
        sourceId: 'eq-breaker-225kv-sf6',
        sourceType: 'EQUIPMENT',
        targetId: 'eq-trafo-225-30-63mva',
        targetType: 'EQUIPMENT',
        relation: 'PROTECTED_BY',
        description: { fr: 'Disjoncteur côté 225 kV déclenché par les relais pour isoler le transformateur', en: '225 kV circuit breaker tripped by protection relays to isolate transformer' },
      },
      {
        id: 'rel-003',
        sourceId: 'eq-relay-87t-micom',
        sourceType: 'EQUIPMENT',
        targetId: 'eq-trafo-225-30-63mva',
        targetType: 'EQUIPMENT',
        relation: 'PROTECTED_BY',
        description: { fr: 'Surveille et protège la zone différentielle du transformateur de puissance', en: 'Monitors and protects the internal unit zone of the power transformer' },
      },
      {
        id: 'rel-004',
        sourceId: 'eq-relay-87t-micom',
        sourceType: 'EQUIPMENT',
        targetId: 'eq-breaker-225kv-sf6',
        targetType: 'EQUIPMENT',
        relation: 'CONTROLLED_BY',
        description: { fr: 'Envoie l\'ordre de déclenchement rapide (<20 ms) à la bobine d\'ouverture', en: 'Issues fast trip order (<20 ms) directly to the breaker opening coil' },
      },
      {
        id: 'rel-005',
        sourceId: 'eq-trafo-225-30-63mva',
        sourceType: 'EQUIPMENT',
        targetId: 'IEC_60076',
        targetType: 'STANDARD',
        relation: 'GOVERNED_BY',
        description: { fr: 'Conçu et testé selon la norme CEI 60076 (Parties 1, 2, 3, 5)', en: 'Engineered and tested pursuant to IEC 60076 (Parts 1, 2, 3, 5)' },
      },
    ];

    // Ingest Canonical Graph Engine Edges
    for (const edge of CANONICAL_GRAPH_EDGES) {
      let relType: ApiRelationship['relation'] = 'SUPPLIES';
      const relStr = edge.relation.toLowerCase();
      if (relStr.includes('protect')) relType = 'PROTECTED_BY';
      else if (relStr.includes('transform')) relType = 'TRANSFORMS';
      else if (relStr.includes('govern')) relType = 'GOVERNED_BY';
      else if (relStr.includes('control')) relType = 'CONTROLLED_BY';
      else if (relStr.includes('measure') || relStr.includes('monitor')) relType = 'MEASURED_BY';
      else if (relStr.includes('ground')) relType = 'GROUNDED_BY';
      else if (relStr.includes('communicat')) relType = 'COMMUNICATES_THROUGH';
      else if (relStr.includes('maintain')) relType = 'MAINTAINED_BY';
      else relType = 'SUPPLIES';

      this.relationships.push({
        id: edge.id,
        sourceId: edge.sourceId,
        sourceType: 'EQUIPMENT',
        targetId: edge.targetId,
        targetType: 'EQUIPMENT',
        relation: relType,
        description: edge.description,
      });
    }

    // Ingest RELATION_EDGES from EPEDE catalog
    for (const edge of RELATION_EDGES) {
      let relType: ApiRelationship['relation'] = 'SUPPLIES';
      const r = edge.relation.toLowerCase();
      if (r === 'feeds' || r === 'supplies' || r === 'connects_to') relType = 'SUPPLIES';
      else if (r === 'protects') relType = 'PROTECTED_BY';
      else if (r === 'measures' || r === 'monitors') relType = 'MEASURED_BY';
      else if (r === 'controls' || r === 'supervises') relType = 'CONTROLLED_BY';
      else if (r === 'communicates_with' || r === 'communicates_through') relType = 'COMMUNICATES_THROUGH';
      else if (r === 'governed_by') relType = 'GOVERNED_BY';
      else if (r === 'transforms') relType = 'TRANSFORMS';
      else if (r === 'maintained_by') relType = 'MAINTAINED_BY';

      this.relationships.push({
        id: edge.id,
        sourceId: edge.source_id,
        sourceType: 'EQUIPMENT',
        targetId: edge.target_id,
        targetType: 'EQUIPMENT',
        relation: relType,
        description: {
          fr: edge.notes_fr || '',
          en: edge.notes_en || '',
        },
      });
    }
  }

  private seedWorkbenches() {
    const wbList: CalculationWorkbenchContract[] = [
      {
        id: 'voltage-drop-workbench',
        name: { fr: 'Calculateur Chute de Tension & Dimensionnement de Câble', en: 'Voltage Drop & Cable Sizing Workbench' },
        category: 'RÉSEAUX & CÂBLES',
        description: {
          fr: 'Calcul rigoureux de la chute de tension admissible selon CEI 60364-5-52 et le code de réseau SONATREL avec prise en compte de la réactance de ligne et de la température.',
          en: 'Accurate voltage drop determination under IEC 60364-5-52 and SONATREL grid code taking into account conductor reactance and operating temperature.',
        },
        standards: ['IEC 60364-5-52', 'SONATREL Grid Code'],
        formulaLatex: '\\Delta U = b \\cdot (R \\cdot \\cos\\varphi + X \\cdot \\sin\\varphi) \\cdot I_b \\cdot L',
        assumptions: {
          fr: [
            'Réseau triphasé équilibré (facteur b = 1.0)',
            'Conducteur cuivre ou aluminium à 70°C / 90°C (XLPE)',
            'Réactance linéique estimée à 0.08 Ω/km en basse tension et 0.12 Ω/km en HTA',
          ],
          en: [
            'Three-phase balanced system (coefficient b = 1.0)',
            'Copper or Aluminum conductors operating at 70°C / 90°C (XLPE)',
            'Lineic reactance assumed at 0.08 Ω/km in LV and 0.12 Ω/km in MV',
          ],
        },
        inputParameters: [
          {
            key: 'voltage_v',
            label: { fr: 'Tension Nominale (V)', en: 'Nominal Voltage (V)' },
            unit: 'V',
            defaultValue: 30000,
            min: 230,
            max: 225000,
            description: { fr: 'Tension composée entre phases', en: 'Line-to-line phase voltage' },
          },
          {
            key: 'power_kw',
            label: { fr: 'Puissance Active Transmise (kW)', en: 'Transmitted Active Power (kW)' },
            unit: 'kW',
            defaultValue: 5000,
            min: 1,
            max: 200000,
            description: { fr: 'Charge appelée par l\'installation', en: 'Active load demand' },
          },
          {
            key: 'length_m',
            label: { fr: 'Longueur de Liaison (m)', en: 'Circuit Length (m)' },
            unit: 'm',
            defaultValue: 15000,
            min: 10,
            max: 150000,
            description: { fr: 'Distance entre le poste source et le récepteur', en: 'Distance between source and load' },
          },
          {
            key: 'cos_phi',
            label: { fr: 'Facteur de Puissance (cos φ)', en: 'Power Factor (cos φ)' },
            unit: '',
            defaultValue: 0.92,
            min: 0.5,
            max: 1.0,
            step: 0.01,
            description: { fr: 'Facteur de puissance inductif', en: 'Inductive operating power factor' },
          },
          {
            key: 'cable_section_mm2',
            label: { fr: 'Section des Conducteurs (mm²)', en: 'Conductor Cross-Section (mm²)' },
            unit: 'mm²',
            defaultValue: 150,
            min: 1.5,
            max: 630,
            description: { fr: 'Section nominale de chaque phase', en: 'Nominal cross-section per phase' },
          },
        ],
        status: 'CONCEPTUAL_ENGINEERING_CALCULATION',
        limitations: {
          fr: [
            'Ce module fournit un calcul conceptuel d\'ingénierie et ne remplace pas une note d\'exécution certifiée logicielle (e.g. Caneco, ETAP).',
            'Ne prend pas en compte les régimes transitoires de démarrage moteur.',
          ],
          en: [
            'Provides conceptual engineering calculations; not a substitute for certified software execution studies (e.g. Caneco, ETAP).',
            'Does not account for transient motor starting dynamics.',
          ],
        },
      },
      {
        id: 'short-circuit-iec60909',
        name: { fr: 'Calculateur Courant de Court-Circuit CEI 60909', en: 'IEC 60909 Short-Circuit Workbench' },
        category: 'POSTES & RÉSEAUX',
        description: {
          fr: 'Calcul du courant de court-circuit triphasé initial Ik", du courant de crête Ip et de la puissance de court-circuit Sk" aux bornes d\'un jeu de barres.',
          en: 'Calculation of initial symmetrical three-phase short-circuit current Ik", peak make current Ip, and short-circuit MVA Sk" at a busbar node.',
        },
        standards: ['IEC 60909-0'],
        formulaLatex: 'I_k^{\\prime\\prime} = \\frac{c \\cdot U_n}{\\sqrt{3} \\cdot \\sqrt{R_k^2 + X_k^2}}',
        assumptions: {
          fr: ['Facteur de tension c = 1.10 en haute tension (Un > 35 kV) et 1.05 en basse tension'],
          en: ['Voltage factor c = 1.10 in high voltage (Un > 35 kV) and 1.05 in low voltage'],
        },
        inputParameters: [
          {
            key: 'un_kv',
            label: { fr: 'Tension Nominale (kV)', en: 'Nominal Voltage (kV)' },
            unit: 'kV',
            defaultValue: 30,
            min: 0.4,
            max: 225,
            description: { fr: 'Tension assignée du jeu de barres', en: 'Rated busbar voltage' },
          },
          {
            key: 'sk_upstream_mva',
            label: { fr: 'Puissance de Court-Circuit Amont (MVA)', en: 'Upstream Short-Circuit Level (MVA)' },
            unit: 'MVA',
            defaultValue: 2500,
            min: 10,
            max: 20000,
            description: { fr: 'Niveau de court-circuit du réseau amont', en: 'Upstream transmission short-circuit grid MVA' },
          },
          {
            key: 'trafo_s_mva',
            label: { fr: 'Puissance Assignée Transformateur (MVA)', en: 'Transformer Rated MVA' },
            unit: 'MVA',
            defaultValue: 63,
            min: 0.1,
            max: 500,
            description: { fr: 'Puissance du transformateur intercalé', en: 'Interposed transformer rating' },
          },
          {
            key: 'trafo_uk_pct',
            label: { fr: 'Tension de Court-Circuit Transformateur Uk (%)', en: 'Transformer Impedance Uk (%)' },
            unit: '%',
            defaultValue: 12.5,
            min: 4.0,
            max: 20.0,
            step: 0.1,
            description: { fr: 'Impédance assignée en court-circuit %', en: 'Rated short-circuit impedance percentage' },
          },
        ],
        status: 'CONCEPTUAL_ENGINEERING_CALCULATION',
        limitations: {
          fr: ['Modèle simplifié symétrique; les impédances homopolaires Z0 pour les défauts monophasés doivent être vérifiées avec le schéma de mise à la terre.'],
          en: ['Symmetrical simplified model; zero-sequence Z0 impedances for single line-to-ground faults require earthing scheme validation.'],
        },
      },
    ];

    for (const wb of wbList) {
      this.workbenches.set(wb.id, wb);
    }
  }
}

// Global Singleton Database Instance
export const canonicalDb = new CanonicalDataStore();
