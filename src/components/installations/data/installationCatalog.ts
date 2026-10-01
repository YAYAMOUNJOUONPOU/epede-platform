// src/components/installations/data/installationCatalog.ts
// EPEDE Domain D06 - Electrical Installations & Utilization Engineering Data Model

export type FacilityArchetype = 'RESIDENTIAL' | 'TERTIARY_COMMERCIAL' | 'PUBLIC_BUILDING' | 'CRITICAL_FACILITY';

export type InstallationViewMode = 'PHYSICAL' | 'ELECTRICAL_SLD' | 'FUNCTIONAL';

export type EarthingSystemType = 'TT' | 'TN_S' | 'TN_C' | 'TN_C_S' | 'IT';

export type OperatingRegime = 'NORMAL_GRID' | 'STANDBY_GENERATOR' | 'ONLINE_UPS' | 'ISLANDED_EMERGENCY';

export type OperatingState =
  | 'ENERGIZED'
  | 'DE_ENERGIZED'
  | 'OPEN'
  | 'CLOSED'
  | 'TRIPPED'
  | 'ISOLATED'
  | 'EARTHED'
  | 'LOCKED_OUT'
  | 'UNDER_MAINTENANCE'
  | 'FAULTED';

export interface MasterJourneyStage {
  id: string;
  stepNumber: number;
  code: string;
  name_fr: string;
  name_en: string;
  category: 'SUPPLY' | 'SWITCHBOARD' | 'SUB_DISTRIBUTION' | 'CIRCUIT' | 'LOAD' | 'CONVERSION' | 'CONTROL_DEVICE';
  voltage_level: string;
  short_summary_fr: string;
  short_summary_en: string;
  technical_details_fr: string;
  technical_details_en: string;
  upstream_node_id?: string;
  downstream_node_id?: string;
  associated_standards: string[];
  protection_apparatus: string[];
}

export interface InstallationComponent {
  id: string;
  code: string;
  name_fr: string;
  name_en: string;
  category:
    | 'SERVICE_ENTRY'
    | 'METERING'
    | 'MAIN_BREAKER'
    | 'BUSBAR'
    | 'TGBT_CUBICLE'
    | 'SUB_FEEDER'
    | 'DISTRIBUTION_BOARD'
    | 'FINAL_BREAKER'
    | 'RCD_DEVICE'
    | 'CABLE_CONTAINMENT'
    | 'CONTROL_DEVICE'
    | 'TERMINAL_LOAD'
    | 'CRITICAL_POWER';
  archetype_presence: FacilityArchetype[];
  rating_amps: string;
  nominal_voltage: string;
  breaking_capacity?: string;
  ip_ik_rating: string;
  internal_form?: 'Form 1' | 'Form 2b' | 'Form 3b' | 'Form 4b';
  standards: string[];
  purpose_fr: string;
  purpose_en: string;
  operating_principle_fr: string;
  operating_principle_en: string;
  physical_construction_fr: string;
  physical_construction_en: string;
  failure_modes_fr: string[];
  failure_modes_en: string[];
  safety_precautions_fr: string[];
  safety_precautions_en: string[];
  upstream_link: string;
  downstream_link: string;
}

export interface EarthingSystemSpec {
  id: EarthingSystemType;
  code: string;
  name_fr: string;
  name_en: string;
  source_neutral_connection_fr: string;
  source_neutral_connection_en: string;
  exposed_conductive_parts_connection_fr: string;
  exposed_conductive_parts_connection_en: string;
  fault_loop_nature_fr: string;
  fault_loop_nature_en: string;
  fault_current_magnitude: string;
  mandatory_protection_device: string;
  disconnection_time_limit: string;
  main_advantages_fr: string[];
  main_advantages_en: string[];
  main_limitations_fr: string[];
  main_limitations_en: string[];
  typical_applications_fr: string;
  typical_applications_en: string;
}

export interface FaultScenario {
  id: string;
  title_fr: string;
  title_en: string;
  category: 'SHORT_CIRCUIT' | 'EARTH_FAULT' | 'THERMAL_OVERLOAD' | 'LOSS_OF_NEUTRAL' | 'MAINS_FAILURE';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description_fr: string;
  description_en: string;
  initial_trigger_fr: string;
  initial_trigger_en: string;
  system_response_steps_fr: { step: number; title: string; action: string; time: string }[];
  system_response_steps_en: { step: number; title: string; action: string; time: string }[];
  selective_isolation_outcome_fr: string;
  selective_isolation_outcome_en: string;
  unserved_loads_affected: string;
  standards_reference: string;
}

export interface LotoStep {
  stepNumber: number;
  code: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  tools_required_fr: string[];
  tools_required_en: string[];
  danger_avoided_fr: string;
  danger_avoided_en: string;
}

// 1. MASTER 12-STAGE ELECTRICAL JOURNEY
export const MASTER_JOURNEY_STAGES: MasterJourneyStage[] = [
  {
    id: 'stage-01-network-interface',
    stepNumber: 1,
    code: 'STG-01',
    name_fr: 'Interface Réseau de Distribution HTA/BT',
    name_en: 'Utility Distribution Network Interface',
    category: 'SUPPLY',
    voltage_level: '400 V / 230 V (50 Hz)',
    short_summary_fr: 'Point de raccordement basse tension en aval du transformateur de distribution public ou privé.',
    short_summary_en: 'Low-voltage utility delivery point downstream of the public or private MV/LV step-down transformer.',
    technical_details_fr: 'Liaison triphasée 4 fils (L1, L2, L3, PEN ou N) provenant du poste MT/BT ou du coffret de dérivation de rue. Courant de court-circuit présumé amont typique de 10 kA à 35 kA selon l\'impédance de boucle.',
    technical_details_en: 'Three-phase 4-wire feed (L1, L2, L3, PEN or N) originating from the MV/LV substation or street pillar. Prospective upstream short-circuit current ranges from 10 kA to 35 kA.',
    downstream_node_id: 'stage-02-service-cutout',
    associated_standards: ['IEC 60038', 'NF C 14-100'],
    protection_apparatus: ['Poste MT/BT Fusibles HPC', 'Disjoncteur général HTA']
  },
  {
    id: 'stage-02-service-cutout',
    stepNumber: 2,
    code: 'STG-02',
    name_fr: 'Branchement d\'Abonné & Coupe-Circuit (CCPI)',
    name_en: 'Service Connection & Cutout Fuses (CCPI)',
    category: 'SUPPLY',
    voltage_level: '400 V / 230 V',
    short_summary_fr: 'Boîtier coupe-circuit d\'arrivée sous scellé avec fusibles HPC à haut pouvoir de coupure.',
    short_summary_en: 'Utility-sealed incoming service cutout box housing high-rupture capacity (HRC) fuses.',
    technical_details_fr: 'Sectionneur-fusible bipolaire ou tétrapolaire équipé de cartouches fusibles cylindriques ou à couteaux type gG (calibres 30 A à 400 A, pouvoir de coupure 100 kA). Constitue la limite de propriété juridique du distributeur.',
    technical_details_en: 'Fused disconnector fitted with high-rupture capacity type gG cartridge or blade fuses (ratings 30 A to 400 A, breaking capacity 100 kA). Represents the legal ownership boundary.',
    upstream_node_id: 'stage-01-network-interface',
    downstream_node_id: 'stage-03-metering',
    associated_standards: ['NF C 14-100', 'IEC 60269-1'],
    protection_apparatus: ['Fusibles HPC gG', 'Sectionneur de coupure amont']
  },
  {
    id: 'stage-03-metering',
    stepNumber: 3,
    code: 'STG-03',
    name_fr: 'Comptage d\'Énergie Fiscal & Télérelève',
    name_en: 'Fiscal Energy Metering & AMR/AMI Unit',
    category: 'SUPPLY',
    voltage_level: '400 V / 230 V',
    short_summary_fr: 'Compteur électronique bidirectionnel certifié MID mesurant active (kWh), réactive (kvarh) et puissance max.',
    short_summary_en: 'Certified bidirectional electronic smart meter registering active (kWh), reactive (kvarh) energy and peak demand.',
    technical_details_fr: 'Raccordement direct (jusqu\'à 60 A/80 A) ou indirect via 3 transformateurs de courant (TC) classe 0.5S pour les puissances industrielles et tertiaires (> 36 kVA). Télé-transmission par CPL ou passerelle GSM/4G.',
    technical_details_en: 'Direct connection (up to 60 A/80 A) or indirect via 3 current transformers (CT) class 0.5S for commercial/industrial demands (> 36 kVA). Telemetry via PLC or GSM/4G cellular gateway.',
    upstream_node_id: 'stage-02-service-cutout',
    downstream_node_id: 'stage-04-main-breaker',
    associated_standards: ['IEC 62053-22', 'EN 50470-3'],
    protection_apparatus: ['Capteurs tores TC de mesure', 'Parafoudre intégré']
  },
  {
    id: 'stage-04-main-breaker',
    stepNumber: 4,
    code: 'STG-04',
    name_fr: 'Disjoncteur Général d\'Arrivée (AGCP)',
    name_en: 'Main Incoming Circuit Breaker (AGCP / Incomer)',
    category: 'SWITCHBOARD',
    voltage_level: '400 V / 230 V',
    short_summary_fr: 'Appareil principal assurant le sectionnement d\'urgence, la coupure générale et la limitation de puissance.',
    short_summary_en: 'Master switching device providing emergency isolation, overcurrent protection, and subscribed capacity bounding.',
    technical_details_fr: 'En résidentiel : Disjoncteur différentiel d\'abonné 500 mA sélectif type S. En tertiaire/industriel : Disjoncteur ouvert débrochable (ACB) 800 A à 4000 A avec déclencheur électronique à sélectivité LSI (Icu 50 kA à 100 kA).',
    technical_details_en: 'In residential: 500 mA selective type S branch breaker. In commercial/industrial: Withdrawable Air Circuit Breaker (ACB) 800 A to 4000 A with electronic LSI trip unit (breaking capacity 50 kA to 100 kA).',
    upstream_node_id: 'stage-03-metering',
    downstream_node_id: 'stage-05-tgbt-cubicle',
    associated_standards: ['IEC 60947-2', 'NF C 62-411'],
    protection_apparatus: ['Déclencheur électronique LSI/LSIG', 'Bobine de déclenchement MX/MN']
  },
  {
    id: 'stage-05-tgbt-cubicle',
    stepNumber: 5,
    code: 'STG-05',
    name_fr: 'Tableau Général Basse Tension (TGBT)',
    name_en: 'Main Low-Voltage Switchboard (TGBT / MSB)',
    category: 'SWITCHBOARD',
    voltage_level: '400 V / 230 V',
    short_summary_fr: 'Enveloppe métallique modulaire compartimentée selon les formes de séparation interne (Forme 2b à 4b).',
    short_summary_en: 'Modular metallic switchboard enclosure engineered to internal separation forms (Form 2b to 4b).',
    technical_details_fr: 'Ensemble assemblé d\'appareillage conforme à la CEI 61439-2. Structure tôlée galvanisée peinte époxy, indice de protection IP31 à IP54, résistance aux impacts IK08/IK10, et résistance à l\'arc interne jusqu\'à 65 kA / 0.3s.',
    technical_details_en: 'Factory-built low-voltage assembly per IEC 61439-2. Zinc-coated steel construction with epoxy coating, enclosure protection IP31 to IP54, mechanical impact IK08/IK10, and internal arc fault containment to 65 kA / 0.3s.',
    upstream_node_id: 'stage-04-main-breaker',
    downstream_node_id: 'stage-06-main-busbar',
    associated_standards: ['IEC 61439-1', 'IEC 61439-2'],
    protection_apparatus: ['Formes de séparation 2b/4b', 'Parafoudre Type 1+2 (SPD)', 'Capteurs d\'arc optiques']
  },
  {
    id: 'stage-06-main-busbar',
    stepNumber: 6,
    code: 'STG-06',
    name_fr: 'Jeu de Barres Principal en Cuivre E-Cu',
    name_en: 'Main Distribution Copper Busbar Trunk',
    category: 'SWITCHBOARD',
    voltage_level: '400 V',
    short_summary_fr: 'Colonne vertébrale conductrice distribuant la puissance vers tous les départs divisionnaires.',
    short_summary_en: 'Heavy-duty copper spine delivering centralized power to all outgoing distribution sub-feeders.',
    technical_details_fr: 'Barres rectangulaires en cuivre électrolytique étamé (Cu-ETP), dimensionnées pour un courant nominal assigné In (ex. 2500 A) et une tenue thermique/électrodynamique Icw (65 kA efficace pendant 1 seconde).',
    technical_details_en: 'Electrolytic tinned copper rectangular bars (Cu-ETP), sized for continuous current rating In (e.g., 2500 A) and electrodynamic short-circuit withstand Icw (65 kA rms for 1 second).',
    upstream_node_id: 'stage-05-tgbt-cubicle',
    downstream_node_id: 'stage-07-outgoing-feeders',
    associated_standards: ['IEC 61439-1 Section 8.4', 'DIN 43671'],
    protection_apparatus: ['Isolateurs supports en résine polyester renforcée', 'Surveillance thermique par capteurs SAW']
  },
  {
    id: 'stage-07-outgoing-feeders',
    stepNumber: 7,
    code: 'STG-07',
    name_fr: 'Départs Divisionnaires & Canalisations Principales',
    name_en: 'Sub-Main Feeders & Rising Busduct Mains',
    category: 'SUB_DISTRIBUTION',
    voltage_level: '400 V / 230 V',
    short_summary_fr: 'Disjoncteurs boîtier moulé (MCCB) alimentant les colonnes montantes et tableaux d\'étage.',
    short_summary_en: 'Molded-case circuit breakers (MCCB) feeding distribution risers, floor panels, and plant rooms.',
    technical_details_fr: 'Protection assurée par des disjoncteurs MCCB 63 A à 630 A réglables, raccordés à des câbles armés multiconducteurs sans halogène (U-1000 AR2V ou H07RN-F) ou des gaines barres préfabriquées (busducts).',
    technical_details_en: 'Protected by adjustable MCCBs (63 A to 630 A) connected to halogen-free armored multicore cables or sandwiched rising busbar trunking systems traversing building service shafts.',
    upstream_node_id: 'stage-06-main-busbar',
    downstream_node_id: 'stage-08-distribution-board',
    associated_standards: ['IEC 60947-2', 'IEC 60364-5-52'],
    protection_apparatus: ['Disjoncteurs boîtier moulé (MCCB)', 'Bloc différentiel Vigi réglable', 'Déclencheur magnétique']
  },
  {
    id: 'stage-08-distribution-board',
    stepNumber: 8,
    code: 'STG-08',
    name_fr: 'Tableaux Divisionnaires d\'Étage & Coffrets Métiers',
    name_en: 'Floor Sub-Distribution & Specialized Panels',
    category: 'SUB_DISTRIBUTION',
    voltage_level: '400 V / 230 V',
    short_summary_fr: 'Tableaux secondaires assurant la sous-distribution par zone géographique ou spécialité (CVC, Éclairage, Force).',
    short_summary_en: 'Secondary distribution panels zoned by floor or function (HVAC, Lighting, General Power, IT).',
    technical_details_fr: 'Châssis modulaire rail DIN DIN 35 mm avec peignes de raccordement tétrapolaires répartiteurs. Interrupteur sectionneur de tête d\'armoire cadenassable et répartiteurs étagés isolés IP2X.',
    technical_details_en: 'Modular DIN-rail enclosures with 4-pole insulated comb busbars. Features a lockable incoming load-break disconnector and IP2X finger-safe distribution terminal blocks.',
    upstream_node_id: 'stage-07-outgoing-feeders',
    downstream_node_id: 'stage-09-final-breaker',
    associated_standards: ['IEC 61439-3', 'IEC 60364-4-41'],
    protection_apparatus: ['Interrupteur sectionneur d\'arrivée', 'Parafoudre de type 2 d\'armoire', 'Sous-compteurs Modbus']
  },
  {
    id: 'stage-09-final-breaker',
    stepNumber: 9,
    code: 'STG-09',
    name_fr: 'Protection des Circuits Terminaux (Disjoncteurs & DDR)',
    name_en: 'Final Circuit Protection (MCB, RCD & RCBO)',
    category: 'CIRCUIT',
    voltage_level: '230 V / 400 V',
    short_summary_fr: 'Disjoncteurs modulaires (MCB) combinés aux dispositifs différentiels résiduels (DDR 30 mA).',
    short_summary_en: 'Miniature circuit breakers (MCBs) paired with 30 mA high-sensitivity residual current devices (RCD/RCBO).',
    technical_details_fr: 'Disjoncteurs magnétothermiques calibres 10 A à 32 A en courbe B (longue ligne), C (usages généraux) ou D (moteurs à fort appel). Dispositifs différentiels à haute sensibilité 30 mA Type AC, A ou F/B selon la nature des charges.',
    technical_details_en: 'Magneto-thermal MCBs rated 10 A to 32 A with tripping Curves B, C, or D. High-sensitivity 30 mA RCDs (Type AC, A, F, or B) detecting sinusoidal AC, pulsating DC, or smooth DC leakage currents.',
    upstream_node_id: 'stage-08-distribution-board',
    downstream_node_id: 'stage-10-cables-containment',
    associated_standards: ['IEC 60898-1', 'IEC 61008-1', 'IEC 61009-1'],
    protection_apparatus: ['Disjoncteurs modulaires MCB 1P+N', 'Disjoncteur différentiel monobloc RCBO 30 mA']
  },
  {
    id: 'stage-10-cables-containment',
    stepNumber: 10,
    code: 'STG-10',
    name_fr: 'Câbles Terminaux, Conduits & Chemins de Câbles',
    name_en: 'Final Cables, Conduits & Containment Systems',
    category: 'CIRCUIT',
    voltage_level: '230 V / 400 V',
    short_summary_fr: 'Canalisations fixes constituées de conducteurs cuivre isolés sous conduits, goulottes ou chemins de câbles.',
    short_summary_en: 'Fixed wiring conductors routed inside metal trays, plastic trunking, or embedded conduits.',
    technical_details_fr: 'Conducteurs cuivre H07V-U/R ou câbles H07RN-F / U-1000 R2V (sections 1.5 mm² à 16 mm²). Pose sous conduits ICTA, goulottes PVC ou chemins de câbles perforés avec respect des coefficients de pose k1, k2, k3.',
    technical_details_en: 'Copper building wire H07V-U/R or cables U-1000 R2V (cross-sections 1.5 mm² to 16 mm²). Installed inside PVC conduits, skirting trunking, or cable trays, factoring derating factors for grouping and temperature.',
    upstream_node_id: 'stage-09-final-breaker',
    downstream_node_id: 'stage-11-control-devices',
    associated_standards: ['IEC 60228', 'IEC 60364-5-52', 'IEC 61537'],
    protection_apparatus: ['Gaine d\'isolation ignifugée LSOH', 'Cheminement séparé Courants Forts / Courants Faibles']
  },
  {
    id: 'stage-11-control-devices',
    stepNumber: 11,
    code: 'STG-11',
    name_fr: 'Appareillages de Commande & Sectionnement Local',
    name_en: 'Switching, Contactors & Local Isolation Controls',
    category: 'CONTROL_DEVICE',
    voltage_level: '230 V / 400 V',
    short_summary_fr: 'Interrupteurs, contacteurs de puissance, télérupteurs, variateurs et sectionneurs de proximité cadenassables.',
    short_summary_en: 'Wall switches, power contactors, impulse relays, dimmers, and lockable local safety isolators.',
    technical_details_fr: 'Permet la manœuvre fonctionnelle et la mise hors tension sécurisée pour entretien au plus près de la charge (sectionneur de proximité cadenassable pour moteurs selon directive machines).',
    technical_details_en: 'Enables operational switching and local safety isolation for servicing equipment (lockable rotary isolator at motor terminals complying with safety machinery standards).',
    upstream_node_id: 'stage-10-cables-containment',
    downstream_node_id: 'stage-12-terminal-load-energy',
    associated_standards: ['IEC 60669-1', 'IEC 60947-3', 'IEC 60947-4-1'],
    protection_apparatus: ['Poignée rotative cadenassable en position Ouvert', 'Relais thermique de surcharge']
  },
  {
    id: 'stage-12-terminal-load-energy',
    stepNumber: 12,
    code: 'STG-12',
    name_fr: 'Charges Électriques & Énergie Utile Développée',
    name_en: 'Electrical Loads & Useful Work Delivered',
    category: 'CONVERSION',
    voltage_level: '230 V / 400 V',
    short_summary_fr: 'Conversion de l\'énergie électrique en travail mécanique, flux lumineux, chaleur, froid ou puissance de calcul.',
    short_summary_en: 'Conversion of electrical energy into mechanical torque, lumens, thermal BTU, cooling, or computing FLOPs.',
    technical_details_fr: 'Point ultime de la chaîne : Luminaires LED (lumens), Moteurs asynchrones & Pompes (couple N·m et débit m³/h), Compresseurs CVC (froid thermodynamique), Résistances chauffantes (joules) et Serveurs informatiques (calculs DSP).',
    technical_details_en: 'Terminal end-point: LED luminaires (lumens), induction motors & pumps (torque N·m and flow m³/h), HVAC chillers (thermal cooling), electric heating elements (joules), and IT computing servers (DSP processing).',
    upstream_node_id: 'stage-11-control-devices',
    associated_standards: ['IEC 60034-1', 'IEC 60598-1', 'IEC 60335-1'],
    protection_apparatus: ['Mise à la terre de la carcasse par conducteur PE', 'Sonde thermique CTP intégrée']
  }
];

// 2. DETAILED EQUIPMENT CATALOG (12 DIVERSE LV APPARATUS)
export const INSTALLATION_EQUIPMENT: InstallationComponent[] = [
  {
    id: 'eq-acb-incomer-3200a',
    code: 'ACB-3200',
    name_fr: 'Disjoncteur Ouvert Débrochable d\'Arrivée 3200 A (ACB)',
    name_en: 'Main Incoming Air Circuit Breaker 3200 A Withdrawable (ACB)',
    category: 'MAIN_BREAKER',
    archetype_presence: ['TERTIARY_COMMERCIAL', 'CRITICAL_FACILITY'],
    rating_amps: '3200 A',
    nominal_voltage: '400 V / 690 V AC',
    breaking_capacity: 'Icu = 85 kA / Ics = 100% Icu',
    ip_ik_rating: 'IP40 en face avant / IK09',
    internal_form: 'Form 4b',
    standards: ['IEC 60947-2', 'IEC 60947-3'],
    purpose_fr: 'Garantit la coupure générale d\'arrivée du TGBT, protège le jeu de barres principal contre les courts-circuits violents et permet le cadenassage visible en position débrochée.',
    purpose_en: 'Provides main incoming interruption to the LV switchboard, protects main busbars against short-circuits, and ensures lockable physical separation when racked out.',
    operating_principle_fr: 'Coupure dans l\'air à soufflage magnétique avec cheminées de désionisation, motorisation à réarmement automatique et déclencheur électronique LSI programmable.',
    operating_principle_en: 'Air-break extinction with magnetic blowout de-ionizing arc chutes, motorized spring recharge, and advanced microprocessor LSI trip unit.',
    physical_construction_fr: 'Châssis métallique robuste avec berceau de débrochage à guidage mécanique, obturateurs automatiques de sécurité (volets de broches) et contacts d\'embrochage en cuivre argenté.',
    physical_construction_en: 'Heavy-duty steel chassis with mechanical drawout cradle, automatic safety shutters isolating live busbars, and silver-plated copper drawout cluster fingers.',
    failure_modes_fr: [
      'Échauffement excessif des pinces d\'embrochage dû à une oxydation ou pression insuffisante',
      'Blocage du mécanisme mécanique à ressort par accumulation de poussières',
      'Dérive du microprocesseur du déclencheur électronique'
    ],
    failure_modes_en: [
      'Excessive thermal rise at cluster finger contacts from oxidation or loose spring pressure',
      'Mechanical spring mechanism latch failure from dust or lubrication hardening',
      'Microprocessor trip unit firmware freeze or auxiliary supply failure'
    ],
    safety_precautions_fr: [
      'Interdiction absolue de manœuvrer l\'embrochage sans avoir préalablement vérifié l\'ouverture du disjoncteur',
      'Vérification de la continuité des contacts de terre du berceau avant insertion',
      'Utilisation d\'un écran de protection arc-flash lors des manœuvres sous tension'
    ],
    safety_precautions_en: [
      'Strict interlock prevents racking in or out while breaker main contacts are closed',
      'Verify cradle ground sliding contact continuity prior to chassis engagement',
      'Wear certified arc-flash PPE during rack-in operations'
    ],
    upstream_link: 'Transformateur HTA/BT 2000 kVA (ou Groupe Électrogène)',
    downstream_link: 'Jeu de Barres Principal Cuivre E-Cu 3200 A'
  },
  {
    id: 'eq-main-copper-busbar',
    code: 'BUSBAR-2500',
    name_fr: 'Jeu de Barres Cuivre Massif E-Cu 2500 A (Forme 4b)',
    name_en: 'Solid Copper Busbar Trunk 2500 A (Form 4b Segregation)',
    category: 'BUSBAR',
    archetype_presence: ['TERTIARY_COMMERCIAL', 'PUBLIC_BUILDING', 'CRITICAL_FACILITY'],
    rating_amps: '2500 A',
    nominal_voltage: '400 V / 1000 V AC (Ui)',
    breaking_capacity: 'Icw = 65 kA eff. / 1s, Ipk = 143 kA crête',
    ip_ik_rating: 'IP20 interne / IP54 externe',
    internal_form: 'Form 4b',
    standards: ['IEC 61439-1', 'IEC 61439-2', 'DIN 43671'],
    purpose_fr: 'Assure la distribution électrodynamique centrale de l\'énergie triphasée avec tenue thermique éprouvée lors de courts-circuits majeurs.',
    purpose_en: 'Delivers high-power electrodynamic distribution across the switchboard with certified withstand during bolted short-circuit faults.',
    operating_principle_fr: 'Répartition du courant par barres plates en parallèle (2 barres 80x10 mm par phase), séparées par des isolateurs diélectriques insensibles aux forces de répulsion de Laplace.',
    operating_principle_en: 'Parallel flat electrolytic copper bars (two 80x10 mm per phase) held by anti-tracking polyester supports engineered against Laplace repulsive magnetic forces.',
    physical_construction_fr: 'Barres de cuivre électrolytique étamé montées sur peignes isolants en polyester auto-extinguible renforcé de fibre de verre (DMC), logées dans un compartiment supérieur isolé.',
    physical_construction_en: 'Tinned electrolytic copper busbars supported on glass-reinforced self-extinguishing polyester insulators, located in a dedicated top or rear isolated compartment.',
    failure_modes_fr: [
      'Desserrage des éclisses de raccordement par cycles thermiques dilatation/contraction',
      'Amorçage d\'arc interne par pénétration d\'humidité ou d\'un corps étranger métallique',
      'Déformation mécanique sous l\'effet d\'un court-circuit supérieur au pic Ipk'
    ],
    failure_modes_en: [
      'Busbar joint bolt relaxation caused by thermal expansion/contraction cycles',
      'Internal arc flash initiated by conductive dust, moisture, or foreign metallic debris',
      'Permanent plastic bending of copper bars exceeding rated dynamic peak Ipk'
    ],
    safety_precautions_fr: [
      'Contrôle thermographique annuel par caméra infrarouge pour détecter les points chauds',
      'Vérification périodique du couple de serrage à la clé dynamométrique étalonnée',
      'Mise à la terre de sécurité par perche avant toute intervention à proximité'
    ],
    safety_precautions_en: [
      'Annual infrared thermographic scanning to detect micro-resistance hot spots',
      'Periodic torque audits with calibrated torque wrench on all fishplate connections',
      'Apply portable grounding clamps prior to any maintenance inspection'
    ],
    upstream_link: 'Disjoncteur Ouvert ACB Incomer',
    downstream_link: 'Départs Disjoncteurs Boîtier Moulé MCCB'
  },
  {
    id: 'eq-mccb-feeder-400a',
    code: 'MCCB-400',
    name_fr: 'Disjoncteur Boîtier Moulé 400 A Débrochable (MCCB)',
    name_en: 'Molded Case Circuit Breaker 400 A Plug-in (MCCB)',
    category: 'SUB_FEEDER',
    archetype_presence: ['TERTIARY_COMMERCIAL', 'PUBLIC_BUILDING', 'CRITICAL_FACILITY'],
    rating_amps: '400 A (Réglable 160 A - 400 A)',
    nominal_voltage: '400 V / 415 V AC',
    breaking_capacity: 'Icu = 50 kA / Ics = 100% Icu',
    ip_ik_rating: 'IP40 / IK07',
    internal_form: 'Form 3b',
    standards: ['IEC 60947-2'],
    purpose_fr: 'Alimente et protège une canalisation principale ou un tableau divisionnaire d\'étage contre les surcharges et courts-circuits.',
    purpose_en: 'Feeds and protects a sub-main riser feeder or floor distribution board against overloads and short-circuits.',
    operating_principle_fr: 'Double coupure roto-active à limitation ultra-rapide d\'énergie réduisant drastiquement les contraintes thermiques I²t lors des défauts.',
    operating_principle_en: 'Roto-active double-break contact technology providing high energy limitation, drastically suppressing thermal stress I²t downstream.',
    physical_construction_fr: 'Boîtier monobloc en résine thermodurcissable, manette de commande rotative cadenassable, contacts en alliage d\'argent et chambre de coupure à désionisation.',
    physical_construction_en: 'Molded thermoset composite housing, lockable front rotary handle, silver-alloy contacts, and de-ion arc quenching chambers.',
    failure_modes_fr: [
      'Usure des contacts d\'arc après plusieurs coupures sur court-circuit franc',
      'Rupture du mécanisme de déclenchement mécanique'
    ],
    failure_modes_en: [
      'Contact erosion following repeated high fault current interruptions',
      'Mechanical trip linkage fatigue or spring latch wear'
    ],
    safety_precautions_fr: [
      'Cadenassage obligatoire de la poignée en position OFF avant travaux sur le câble aval',
      'Vérification de l\'absence de tension sur les trois phases en aval du disjoncteur'
    ],
    safety_precautions_en: [
      'Padlock rotary operating handle in OFF position before working on downstream feeder',
      'Perform Absence of Voltage (VAT) verification on all phases downstream'
    ],
    upstream_link: 'Jeu de Barres Principal TGBT',
    downstream_link: 'Colonne Montante ou Tableau Divisionnaire d\'Étage'
  },
  {
    id: 'eq-apfc-capacitor-bank',
    code: 'APFC-300',
    name_fr: 'Batterie de Condensateurs Automatique avec Selfs Anti-Harmoniques 300 kvar',
    name_en: 'Automatic Power Factor Correction Bank with Detuned Reactors 300 kvar',
    category: 'TGBT_CUBICLE',
    archetype_presence: ['TERTIARY_COMMERCIAL', 'CRITICAL_FACILITY'],
    rating_amps: '433 A nominal (6 gradins de 50 kvar)',
    nominal_voltage: '400 V / 50 Hz',
    breaking_capacity: 'Protégé par disjoncteur amont Icu 50 kA',
    ip_ik_rating: 'IP31 / IK08',
    internal_form: 'Form 2b',
    standards: ['IEC 61921', 'IEC 60831-1'],
    purpose_fr: 'Compense l\'énergie réactive inductive des transformateurs, moteurs et ballasts pour relever le facteur de puissance au-delà de 0.95 et supprimer les pénalités tarifaires.',
    purpose_en: 'Compensates inductive reactive power from transformers and induction motors, elevating power factor above 0.95 and eliminating utility penalties.',
    operating_principle_fr: 'Régulateur var-métrique à microprocesseur enclenchant pas à pas des gradins de condensateurs associés à des selfs d\'arrêt (189 Hz) évitant la résonance avec les harmoniques 5 et 7.',
    operating_principle_en: 'Microprocessor power factor controller sequentially switching capacitor steps wired in series with detuned reactors (189 Hz) preventing harmonic resonance.',
    physical_construction_fr: 'Condensateurs secs à film polypropylène métallisé autocicatrisant, selfs d\'induction en cuivre avec tôles magnétiques feuilletées et contacteurs spéciaux à résistances d\'amortissement.',
    physical_construction_en: 'Dry self-healing metallized polypropylene capacitors, iron-core detuned copper reactors, and dedicated capacitor-switching contactors with damping resistors.',
    failure_modes_fr: [
      'Éclatement ou déformation de cellule capacitive sous l\'effet de surtensions harmoniques',
      'Collage des pôles de contacteurs soumis aux courants d\'appel capacitifs'
    ],
    failure_modes_en: [
      'Dielectric breakdown or case swelling from continuous harmonic overvoltage',
      'Contact welding on switching contactors due to severe capacitor inrush surges'
    ],
    safety_precautions_fr: [
      'Attendre impérativement 5 minutes après coupure pour la décharge complète des résistances internes avant d\'ouvrir l\'armoire',
      'Court-circuiter et mettre à la terre les bornes des condensateurs avant toute manipulation'
    ],
    safety_precautions_en: [
      'Mandatory 5-minute wait time after de-energization for internal bleed resistors to discharge capacitors below 50 V',
      'Discharge, short-circuit, and ground all capacitor terminals prior to contact'
    ],
    upstream_link: 'Jeu de Barres Principal TGBT',
    downstream_link: 'Réseau Interne (Compensation en parallèle)'
  },
  {
    id: 'eq-ats-automatic-transfer',
    code: 'ATS-1600',
    name_fr: 'Inverseur de Sources Automatique Normal-Secours 1600 A (ATS)',
    name_en: 'Automatic Transfer Switch 1600 A Dual-Source (ATS)',
    category: 'CRITICAL_POWER',
    archetype_presence: ['CRITICAL_FACILITY', 'TERTIARY_COMMERCIAL'],
    rating_amps: '1600 A',
    nominal_voltage: '400 V triphasé',
    breaking_capacity: 'Icu = 65 kA',
    ip_ik_rating: 'IP41 / IK08',
    internal_form: 'Form 4b',
    standards: ['IEC 60947-6-1', 'NFPA 110'],
    purpose_fr: 'Transfère automatiquement l\'alimentation des circuits secourus du réseau public défaillant vers le groupe électrogène de secours sans risque de retour en arrière.',
    purpose_en: 'Automatically transfers emergency busbars from failed utility mains to the backup diesel generator with zero risk of back-feeding the grid.',
    operating_principle_fr: 'Double interrupteur-sectionneur motorisé avec verrouillage mécanique par biellette imperdable et interverrouillage électrique interdisant la fermeture simultanée des deux sources.',
    operating_principle_en: 'Motorized dual load-break switches featuring positive mechanical interlocking rods and electrical interlocks preventing simultaneous connection to both sources.',
    physical_construction_fr: 'Armoire séparée en tôle d\'acier intégrant l\'automate de permutation, les voyants synoptiques de présence tension source 1/source 2 et les borniers de signalisation.',
    physical_construction_en: 'Freestanding steel enclosure housing the transfer logic controller, source presence indicator lamps, test exercise switches, and auxiliary telemetry terminals.',
    failure_modes_fr: [
      'Blocage mécanique de la tringlerie d\'interverrouillage',
      'Défaillance de l\'automatisme de démarrage du groupe électrogène par décharge de batterie de démarrage'
    ],
    failure_modes_en: [
      'Mechanical interlock linkage jamming',
      'Genset auto-start signal failure due to dead generator starter battery bank'
    ],
    safety_precautions_fr: [
      'Consignation des DEUX sources amont (Réseau ET Groupe) avant toute opération de maintenance interne',
      'Test mensuel de permutation à vide et en charge selon protocole de sécurité'
    ],
    safety_precautions_en: [
      'Lock out and tag out BOTH upstream power supplies (Mains AND Generator) before accessing internal compartments',
      'Conduct monthly load transfer exercises under qualified engineering supervision'
    ],
    upstream_link: 'Source 1 (Réseau Eneo/Distribution) & Source 2 (Groupe Diesel)',
    downstream_link: 'TGBT Voie Secourue / Tableaux d\'Urgence'
  },
  {
    id: 'eq-ups-online-double-conv',
    code: 'UPS-200KVA',
    name_fr: 'Onduleur Statique Haute Disponibilité 200 kVA (VFI-SS-111)',
    name_en: 'Online Double-Conversion Static UPS 200 kVA (VFI-SS-111)',
    category: 'CRITICAL_POWER',
    archetype_presence: ['CRITICAL_FACILITY', 'TERTIARY_COMMERCIAL'],
    rating_amps: '288 A (200 kVA / 180 kW)',
    nominal_voltage: '400 V triphasé Entrée / Sortie',
    breaking_capacity: 'By-pass statique Icw 10 kA',
    ip_ik_rating: 'IP20 / IK06',
    internal_form: 'Form 2b',
    standards: ['IEC 62040-1', 'IEC 62040-3'],
    purpose_fr: 'Délivre une tension sinusoïdale pure et ininterrompue sans micro-coupure (0 ms) aux serveurs informatiques, salles d\'opérations chirurgicales et systèmes SCADA.',
    purpose_en: 'Supplies clean, conditioned, uninterruptible power with zero transfer time (0 ms) to mission-critical IT servers, hospital operating rooms, and SCADA systems.',
    operating_principle_fr: 'Double conversion permanente : le redresseur IGBT transforme le 400 V AC en bus DC chargeant les batteries ; l\'onduleur IGBT recrée une onde sinusoïdale 400 V AC stabilisée à ±1%.',
    operating_principle_en: 'True online double conversion: IGBT rectifier converts utility AC into DC bus charging batteries; IGBT inverter reconstitutes pure 400 V AC sine wave stabilized at ±1%.',
    physical_construction_fr: 'Armoire compacte intégrant les modules redresseur, onduleur, by-pass statique à thyristors et by-pass manuel de maintenance mécanique avec bacs à batteries externes.',
    physical_construction_en: 'Compact enclosure containing rectifier, inverter, static thyristor bypass, and manual wrap-around maintenance bypass switch linked to external battery racks.',
    failure_modes_fr: [
      'Court-circuit sur module IGBT de puissance provoquant le basculement automatique sur by-pass',
      'Perte d\'autonomie due au vieillissement prématuré des accumulateurs de batterie'
    ],
    failure_modes_en: [
      'IGBT power module thermal puncture triggering emergency transfer to static bypass',
      'Battery autonomy collapse due to individual cell sulfation or thermal runaway'
    ],
    safety_precautions_fr: [
      'Présence continue de tension continue DC dangereuse (jusqu\'à 800 V) même lorsque le réseau amont est consigné',
      'Port de gants isolants classe 0 et lunettes de protection lors des manipulations de batteries'
    ],
    safety_precautions_en: [
      'Dangerous DC voltages (up to 800 V DC) remain active even when AC mains input is disconnected',
      'Wear certified Class 0 insulating gloves and safety face shields when servicing battery strings'
    ],
    upstream_link: 'TGBT Voie Secourue ou Tableau Normal',
    downstream_link: 'Tableau Ondulé Critique (Server Room / Soins Intensifs)'
  },
  {
    id: 'eq-floor-distribution-board',
    code: 'DB-FLOOR-2',
    name_fr: 'Tableau Divisionnaire d\'Étage 125 A (Rail DIN Modulaire)',
    name_en: 'Floor Sub-Distribution Board 125 A (Modular DIN-Rail)',
    category: 'DISTRIBUTION_BOARD',
    archetype_presence: ['TERTIARY_COMMERCIAL', 'PUBLIC_BUILDING', 'CRITICAL_FACILITY'],
    rating_amps: '125 A Tétrapolaire',
    nominal_voltage: '400 V / 230 V',
    breaking_capacity: 'Icn = 10 kA (IEC 60898-1)',
    ip_ik_rating: 'IP40 porte fermée / IK08',
    internal_form: 'Form 1',
    standards: ['IEC 61439-3', 'IEC 60364-4-41'],
    purpose_fr: 'Rassemble et protège individuellement tous les départs terminaux d\'un plateau de bureaux (éclairage, prises de courant ondulées et normales, ventilo-convecteurs).',
    purpose_en: 'Houses and individually protects all final sub-circuits across an office floor (lighting, standard sockets, UPS sockets, and fan coil units).',
    operating_principle_fr: 'Alimentation par le haut via un interrupteur-sectionneur 125 A, répartition par peignes tétrapolaires vers des interrupteurs différentiels 30 mA et disjoncteurs divisionnaires.',
    operating_principle_en: 'Incoming feed via top-mounted 125 A disconnector, distributed through 4-pole busbar combs to selective 30 mA RCDs and branch miniature circuit breakers.',
    physical_construction_fr: 'Coffret mural encastré ou saillie en tôle d\'acier peinte avec plastrons isolants amovibles, borniers de terre et neutre IP2X et porte vitrée réversible.',
    physical_construction_en: 'Flush or surface-mounted steel sheet enclosure with removable insulating faceplates, finger-safe IP2X earth/neutral terminal bars, and transparent reversible door.',
    failure_modes_fr: [
      'Échauffement sur bornier de peigne par mauvais couple de serrage des vis modulaires',
      'Déclenchement intempestif d\'interrupteur différentiel par accumulation de courants de fuite électroniques'
    ],
    failure_modes_en: [
      'Modular terminal thermal hotspot caused by loose screw connection onto comb prong',
      'Nuisance tripping of 30 mA RCD caused by cumulative filter capacitive leakage currents'
    ],
    safety_precautions_fr: [
      'Vérification périodique du bouton Test des disjoncteurs différentiels tous les 6 mois',
      'Plastronnage obligatoire pour interdire l\'accès direct aux bornes sous tension (protection IP2X)'
    ],
    safety_precautions_en: [
      'Periodic functional push-button test of all 30 mA RCDs every 6 months',
      'Dead-front insulating faceplates must remain locked in place to prevent accidental finger contact'
    ],
    upstream_link: 'Départ MCCB du TGBT (Colonne Montante)',
    downstream_link: 'Circuits Terminaux Éclairage, Prises & CVC'
  },
  {
    id: 'eq-rcbo-device-16a',
    code: 'RCBO-16A-30MA',
    name_fr: 'Disjoncteur Différentiel Monobloc 16 A / 30 mA Type F (RCBO)',
    name_en: 'Residual Current Breaker with Overcurrent 16 A / 30 mA Type F (RCBO)',
    category: 'FINAL_BREAKER',
    archetype_presence: ['RESIDENTIAL', 'TERTIARY_COMMERCIAL', 'PUBLIC_BUILDING', 'CRITICAL_FACILITY'],
    rating_amps: '16 A (Courbe C)',
    nominal_voltage: '230 V AC Phase + Neutre',
    breaking_capacity: 'Icn = 10 000 A (10 kA)',
    ip_ik_rating: 'IP20 bornes / IP40 plastronné',
    standards: ['IEC 61009-1', 'IEC 60364-4-41'],
    purpose_fr: 'Intègre dans un seul module 18 mm la protection contre les surcharges, courts-circuits et les courants de fuite à la terre protégeant les personnes contre l\'électrocution.',
    purpose_en: 'Combines overload, short-circuit, and high-sensitivity 30 mA earth leakage protection into a single 18 mm module protecting personnel from lethal electric shock.',
    operating_principle_fr: 'Tore de détection sommateur mesurant le déséquilibre vectoriel I_phase - I_neutre (seuil 30 mA), associé à un bilame thermique pour la surcharge et un percuteur magnétique pour le court-circuit.',
    operating_principle_en: 'Summation toroidal magnetic core sensing residual vector difference I_phase - I_neutral (30 mA threshold), paired with bi-metal thermal strip and magnetic hammer.',
    physical_construction_fr: 'Boîtier polyamide auto-extinguible DIN, manette de réarmement ergonomique avec voyant de défaut différentiel mécanique distinct et bouton de test périodique T.',
    physical_construction_en: 'Self-extinguishing polyamide DIN module with trip-free handle, mechanical earth leakage fault flag window, and periodic monthly test button T.',
    failure_modes_fr: [
      'Blocage du mécanisme interne du tore différentiel par poussière conductrice',
      'Perte de sensibilité magnétique après court-circuit sévère'
    ],
    failure_modes_en: [
      'Internal differential core latch seizing from fine atmospheric dust',
      'Magnetic calibration drift following a severe bolted short-circuit near rated Icn'
    ],
    safety_precautions_fr: [
      'Interdiction de ponter ou contourner le tore différentiel sous aucun prétexte',
      'Contrôle annuel du temps de déclenchement avec appareil de mesure certifié (doit disjoncter en moins de 40 ms à 5 IΔn)'
    ],
    safety_precautions_en: [
      'Bypassing or bridging the RCD element is strictly prohibited under safety regulations',
      'Annual instrument verification of tripping time and current threshold (must trip < 40 ms at 5 IΔn)'
    ],
    upstream_link: 'Jeu de Barres Peigne du Tableau Divisionnaire',
    downstream_link: 'Circuit Terminal Prises de Courant ou Serveurs IT'
  },
  {
    id: 'eq-cable-containment-tray',
    code: 'TRAY-PERF-200',
    name_fr: 'Chemin de Câbles en Tôle d\'Acier Perforée avec Séparateur Métallique CEM',
    name_en: 'Perforated Galvanized Steel Cable Tray with EMC Metallic Divider',
    category: 'CABLE_CONTAINMENT',
    archetype_presence: ['TERTIARY_COMMERCIAL', 'PUBLIC_BUILDING', 'CRITICAL_FACILITY'],
    rating_amps: 'Supporte faisceaux jusqu\'à 200 kg/m',
    nominal_voltage: 'Isolements câbles 1000 V',
    ip_ik_rating: 'IK10 / Résistance mécanique certifiée',
    standards: ['IEC 61537', 'EN 50085', 'IEC 60364-5-52'],
    purpose_fr: 'Assure le support mécanique continu, l\'aération thermique et la protection électromagnétique des câbles de puissance et signaux dans les plénums et gaines techniques.',
    purpose_en: 'Provides continuous mechanical routing, ventilation cooling, and electromagnetic shielding for power and control cables along technical shafts and ceilings.',
    operating_principle_fr: 'Cheminement gravitaire ventilé avec perforation assurant l\'évacuation calorifique par convection d\'air et écran conducteur continu mis à la terre pour atténuer les perturbations CEM.',
    operating_principle_en: 'Ventilated horizontal/vertical routing allowing heat dissipation through convective airflow while solid grounded steel acts as an electromagnetic Faraday shield.',
    physical_construction_fr: 'Tôle d\'acier galvanisée à chaud par immersion (ou inox marine), bords roulés anti-coupure des isolants, éclisses de raccordement équipotentielles et cloisonnette de séparation.',
    physical_construction_en: 'Hot-dip galvanized steel sheet with smooth rolled anti-sheath-damage edges, copper-bonded equipotential joint fishplates, and continuous metal separation partition.',
    failure_modes_fr: [
      'Surcharge pondérale par empilement anarchique de câbles provoquant la rupture des tiges filetées de suspension',
      'Perte de continuité de masse entre deux tronçons créant un risque de tension induite lors d\'un court-circuit'
    ],
    failure_modes_en: [
      'Mechanical sag or drop from unmanaged cable overload exceeding rated cantilever load',
      'Loss of bonding jumper continuity between tray sections creating touch voltage hazards during cable fault'
    ],
    safety_precautions_fr: [
      'Mise à la terre obligatoire à chaque extrémité et tous les 15 mètres par tresse de masse en cuivre étamé',
      'Séparation physique minimale de 20 cm entre câbles d\'énergie (230/400 V) et câbles de communication Ethernet'
    ],
    safety_precautions_en: [
      'Mandatory bonding to the installation earthing conductor at both ends and every 15 meters',
      'Maintain strict physical separation of at least 20 cm between 400 V power cables and sensitive data/IT cabling'
    ],
    upstream_link: 'Sortie TGBT / Gaine Technique',
    downstream_link: 'Arrivée Tableau Divisionnaire ou Équipements Terminaux'
  },
  {
    id: 'eq-local-motor-isolator',
    code: 'ISOL-ROTY-63A',
    name_fr: 'Sectionneur de Proximité Cadenassable 63 A en Boîtier Étanche (LOTO)',
    name_en: 'Lockable Local Rotary Safety Isolator 63 A (IP65 / LOTO)',
    category: 'CONTROL_DEVICE',
    archetype_presence: ['TERTIARY_COMMERCIAL', 'PUBLIC_BUILDING', 'CRITICAL_FACILITY'],
    rating_amps: '63 A AC-23A (Charge motrice inductive)',
    nominal_voltage: '400 V triphasé + Neutre + PE',
    breaking_capacity: 'Pouvoir de coupure direct en charge 63 A',
    ip_ik_rating: 'IP65 étanche à l\'eau et poussières / IK08',
    standards: ['IEC 60947-3', 'EN 60204-1 (Sécurité des Machines)'],
    purpose_fr: 'Implanté à vue directe d\'un moteur de pompe ou groupe froid pour permettre la coupure de sécurité et la condamnation locale par cadenas avant intervention mécanique.',
    purpose_en: 'Mounted in direct line of sight to motors or rooftop chillers to ensure visual isolation and padlock lockout prior to mechanical or electrical servicing.',
    operating_principle_fr: 'Interrupteur-sectionneur à coupure omnipolaire simultanée des 3 phases et du neutre, avec distance de sectionnement visible certifiée et contact auxiliaire anticipé de coupure de commande.',
    operating_principle_en: 'Omnipolar load-break disconnector simultaneously opening 3 phases and neutral with certified visible isolation gap and early-break auxiliary pilot contact.',
    physical_construction_fr: 'Boîtier en polycarbonate thermoplastique résistant aux UV, poignée rouge sur fond jaune (arrêt d\'urgence réglementaire) cadenassable par 3 cadenas de consignation.',
    physical_construction_en: 'UV-resistant thermoplastic polycarbonate enclosure with yellow-front emergency red rotary handle accommodating up to 3 individual lockout padlocks.',
    failure_modes_fr: [
      'Soudure des contacts en cas de tentative d\'ouverture sur court-circuit franc aval',
      'Dégradation du joint d\'étanchéité néoprène provoquant l\'oxydation interne par pluie'
    ],
    failure_modes_en: [
      'Contact welding if manually switched open during a severe downstream bolted short-circuit',
      'Gasket weathering leading to water ingress and internal terminal corrosion'
    ],
    safety_precautions_fr: [
      'Toujours condamner la poignée avec son cadenas personnel (LOTO) et conserver la clé sur soi',
      'Vérifier l\'absence effective de rotation et l\'absence de tension avant de toucher aux pièces en mouvement'
    ],
    safety_precautions_en: [
      'Always lock out handle with personal safety padlock (LOTO) and keep key in personal custody',
      'Confirm zero shaft rotation and verify absence of voltage before opening motor junction box'
    ],
    upstream_link: 'Départ Tableau Divisionnaire CVC / Force',
    downstream_link: 'Moteur Asynchrone de Pompe de Relevage'
  },
  {
    id: 'eq-hvac-water-pump-motor',
    code: 'MOTOR-PUMP-15KW',
    name_fr: 'Groupe Moto-Pompe Hydraulique de Climatisation 15 kW (IE3)',
    name_en: 'Chilled Water Circulation Motor-Pump Set 15 kW (IE3 Premium)',
    category: 'TERMINAL_LOAD',
    archetype_presence: ['TERTIARY_COMMERCIAL', 'PUBLIC_BUILDING', 'CRITICAL_FACILITY'],
    rating_amps: '28 A nominal (Cos φ = 0.86, Rendement 92.1%)',
    nominal_voltage: '400 V triphasé (Couplage Triangle Δ)',
    breaking_capacity: 'Courant de démarrage direct Id/In = 7.2',
    ip_ik_rating: 'IP55 / IK08',
    standards: ['IEC 60034-1', 'IEC 60034-30-1 (IE3 Efficiency)'],
    purpose_fr: 'Circulation forcée d\'eau glacée à 7°C dans les centrales de traitement d\'air (CTA) et ventilo-convecteurs pour assurer le confort thermique du bâtiment.',
    purpose_en: 'Forces circulation of chilled water (7°C) through central Air Handling Units (AHU) and fan coils ensuring thermal climate control.',
    operating_principle_fr: 'Moteur asynchrone triphasé à cage d\'écureuil convertissant l\'énergie électromagnétique en couple mécanique sur l\'arbre entraînant la volute centrifuge de pompage.',
    operating_principle_en: 'Three-phase squirrel-cage induction motor converting electromagnetic field energy into mechanical shaft torque driving an in-line centrifugal impeller.',
    physical_construction_fr: 'Carcasse à ailettes en fonte grise moulée, boîte à bornes étanche avec plaque à 6 bornes pour couplage Étoile ou Triangle, et garniture mécanique en carbure de silicium.',
    physical_construction_en: 'Fin-cooled cast iron stator frame, top terminal box with 6 brass studs for Star/Delta configuration, and silicon carbide mechanical shaft seal.',
    failure_modes_fr: [
      'Claquant diélectrique de l\'isolant des spires de bobinage par surchauffe thermique classe F',
      'Grippage de roulement à billes par défaut de graissage entraînant le blocage rotor'
    ],
    failure_modes_en: [
      'Winding turn-to-turn dielectric breakdown caused by thermal overheating or VFD voltage reflections',
      'Ball bearing seizure from dry lubrication leading to locked-rotor overcurrent'
    ],
    safety_precautions_fr: [
      'Raccordement obligatoire du conducteur de protection PE à la borne interne de carcasse',
      'Surveillance continue par sondes thermiques CTP raccordées au relais de déclenchement'
    ],
    safety_precautions_en: [
      'Mandatory bonding of green/yellow PE conductor to frame internal earth lug',
      'Embed PTC thermistor sensors connected to motor protection relay trip circuit'
    ],
    upstream_link: 'Sectionneur de Proximité & Contacteur / Variateur VFD',
    downstream_link: 'Énergie Utile : Débit Hydraulique (60 m³/h à 3.2 bars) & Climatisation'
  },
  {
    id: 'eq-led-luminaire-commercial',
    code: 'LUM-LED-DALI-45W',
    name_fr: 'Dalle Luminaire Tertiaire LED 45 W avec Gradation DALI-2',
    name_en: 'Commercial Recessed LED Panel 45 W with DALI-2 Digital Dimming',
    category: 'TERMINAL_LOAD',
    archetype_presence: ['RESIDENTIAL', 'TERTIARY_COMMERCIAL', 'PUBLIC_BUILDING', 'CRITICAL_FACILITY'],
    rating_amps: '0.20 A (230 V monophasé, Facteur de puissance 0.96)',
    nominal_voltage: '230 V AC (50 Hz)',
    breaking_capacity: 'N/A (Alimenté par disjoncteur 10 A Curve B/C)',
    ip_ik_rating: 'IP44 en sous-face / IK06',
    standards: ['IEC 60598-1', 'IEC 62386 (DALI)', 'EN 12464-1'],
    purpose_fr: 'Fournit un flux lumineux de 4500 lumens pour l\'éclairage ergonomique des bureaux et salles de réunion sans éblouissement (UGR < 19).',
    purpose_en: 'Delivers 4500 lumens of glare-free workspace illumination (UGR < 19) for office spaces and classrooms with digital dimming control.',
    operating_principle_fr: 'Alimentation électronique à découpage (driver DALI) régulant le courant continu à travers une matrice de diodes électroluminescentes (LED) à haut rendement (100 lm/W).',
    operating_principle_en: 'High-efficiency electronic driver regulating constant DC current through high-efficiency LED arrays (100 lm/W) with DALI digital addressable protocol.',
    physical_construction_fr: 'Cadre extra-plat en aluminium extrudé faisant office de dissipateur thermique, diffuseur micro-prismatique opale en PMMA anti-jaunissement et boîte de repiquage rapide.',
    physical_construction_en: 'Slim extruded aluminum chassis serving as passive thermal heat sink, micro-prismatic anti-yellowing PMMA diffuser, and toolless push-in connector.',
    failure_modes_fr: [
      'Défaillance des condensateurs électrolytiques du driver sous contrainte thermique en faux-plafond',
      'Coupure thermique d\'une puce LED dans la chaîne série provoquant l\'extinction complète'
    ],
    failure_modes_en: [
      'Electronic driver capacitor dry-out due to trapped ambient plenum thermal buildup',
      'Open-circuit failure of a single series-connected LED chip extinguishing the panel'
    ],
    safety_precautions_fr: [
      'Classe d\'isolation II ou Classe I avec conducteur PE raccordé au bornier métallique',
      'Couper le disjoncteur d\'éclairage avant toute manipulation ou remplacement de driver'
    ],
    safety_precautions_en: [
      'Class II double-insulated or Class I with protective bonding conductor attached',
      'De-energize dedicated lighting breaker before servicing or disconnecting driver'
    ],
    upstream_link: 'Câble 3G1.5 mm² & Bus DALI depuis Tableau Divisionnaire',
    downstream_link: 'Énergie Utile : 4500 lumens de flux lumineux visible'
  }
];

// 3. EARTHING & NEUTRAL ARRANGEMENTS SPECIFICATION
export const EARTHING_SYSTEMS_SPECS: EarthingSystemSpec[] = [
  {
    id: 'TT',
    code: 'SCHÉMA TT',
    name_fr: 'Régime TT (Neutre à la Terre, Masses à la Terre Indépendante)',
    name_en: 'TT System (Neutral Earthed, Independent Frame Earth)',
    source_neutral_connection_fr: 'Point neutre du transformateur MT/BT relié directement à une prise de terre du distributeur (Rb).',
    source_neutral_connection_en: 'Transformer neutral point directly connected to utility earth electrode (Rb).',
    exposed_conductive_parts_connection_fr: 'Toutes les masses métalliques de l\'installation sont interconnectées et reliées à une prise de terre locale d\'abonné (Ra).',
    exposed_conductive_parts_connection_en: 'All exposed conductive parts are bonded and connected to an independent consumer earth electrode (Ra).',
    fault_loop_nature_fr: 'Boucle de défaut par la terre : Phase -> Défaut masse -> Ra -> Terre (sol) -> Rb -> Neutre transformateur.',
    fault_loop_nature_en: 'Earth-return loop: Phase -> Equipment frame -> Ra -> Earth mass -> Rb -> Transformer neutral.',
    fault_current_magnitude: 'Faible : 5 A à 30 A (Limité par la résistance des prises de terre Ra + Rb).',
    mandatory_protection_device: 'Dispositif Différentiel Résiduel (DDR) obligatoire sur tous les circuits (Condition Ra · IΔn ≤ 50 V).',
    disconnection_time_limit: '0.2 seconde sous 230 V (IEC 60364-4-41)',
    main_advantages_fr: [
      'Simplicité de conception et d\'extension sans étude lourde de longueurs de câbles',
      'Déconnexion sélective au premier défaut d\'isolement par DDR sans risque d\'incendie',
      'Parfaitement adapté aux réseaux de distribution basse tension publics étendus'
    ],
    main_advantages_en: [
      'Design simplicity without complex calculation of maximum circuit loop lengths',
      'Clear selective disconnection on first insulation fault via sensitive RCDs',
      'Universal standard for public low-voltage consumer distribution'
    ],
    main_limitations_fr: [
      'Coupure immédiate dès le premier défaut d\'isolement (non tolérant pour hôpitaux ou usines)',
      'Dépendance critique de la sécurité envers le bon état des DDR et la stabilité de Ra'
    ],
    main_limitations_en: [
      'Immediate supply disconnection on the first insulation fault',
      'Complete safety reliance on the mechanical and electrical integrity of RCD mechanisms'
    ],
    typical_applications_fr: 'Logements résidentiels, petits commerces, bureaux raccordés au réseau public basse tension.',
    typical_applications_en: 'Residential dwellings, small commercial retail, general buildings fed from public LV mains.'
  },
  {
    id: 'TN_S',
    code: 'SCHÉMA TN-S',
    name_fr: 'Régime TN-S (Neutre et Terre Séparés sur toute l\'installation)',
    name_en: 'TN-S System (Separate Neutral and PE Conductors Throughout)',
    source_neutral_connection_fr: 'Point neutre du transformateur relié directement à la terre du poste.',
    source_neutral_connection_en: 'Transformer neutral directly grounded to primary substation earth grid.',
    exposed_conductive_parts_connection_fr: 'Masses reliées au conducteur de protection PE séparé du neutre N sur toute la longueur.',
    exposed_conductive_parts_connection_en: 'Exposed frames connected to a dedicated Protective Earth (PE) conductor separated from Neutral (N).',
    fault_loop_nature_fr: 'Boucle métallique fermée en cuivre : Phase -> Défaut -> Conducteur PE -> Neutre source (Court-circuit franc phase-neutre).',
    fault_loop_nature_en: 'Pure metallic copper loop: Phase -> Fault -> PE conductor -> Source neutral (Phase-to-neutral short-circuit).',
    fault_current_magnitude: 'Très élevé : 1 kA à 15 kA (Limité uniquement par l\'impédance métallique du câble Zs).',
    mandatory_protection_device: 'Disjoncteurs magnétothermiques (MCB/MCCB) ou fusibles (Condition Zs · Ia ≤ U0).',
    disconnection_time_limit: '0.4 seconde sous 230 V (IEC 60364-4-41)',
    main_advantages_fr: [
      'Coupure instantanée par disjoncteurs ordinaires sans besoin systématique de différentiels',
      'Excellente compatibilité électromagnétique (CEM) : aucun courant de retour dans le PE en service normal',
      'Idéal pour les data centers, hôpitaux et installations avec serveurs informatiques sensibles'
    ],
    main_advantages_en: [
      'Instantaneous tripping via standard overcurrent breakers without requiring RCDs everywhere',
      'Superior Electromagnetic Compatibility (EMC): zero stray return current on PE during normal operation',
      'Preferred standard for data centers, tertiary complexes, and sensitive IT installations'
    ],
    main_limitations_fr: [
      'Calcul rigoureux obligatoire de la longueur maximale des câbles pour garantir le déclenchement magnétique',
      'Risque d\'incendie plus élevé si le court-circuit à la terre est impédant'
    ],
    main_limitations_en: [
      'Strict engineering calculation of maximum circuit lengths to ensure magnetic trip during fault',
      'Higher fire risk during arcing high-impedance earth faults prior to breaker trip'
    ],
    typical_applications_fr: 'Bâtiments tertiaires modernes, data centers, sièges d\'entreprises possédant leur propre transformateur MT/BT.',
    typical_applications_en: 'Modern commercial towers, data centers, corporate facilities owning their own MV/LV substation.'
  },
  {
    id: 'TN_C',
    code: 'SCHÉMA TN-C',
    name_fr: 'Régime TN-C (Conducteur Neutre et Terre Confondus PEN)',
    name_en: 'TN-C System (Combined PEN Conductor)',
    source_neutral_connection_fr: 'Neutre du transformateur directement relié à la terre.',
    source_neutral_connection_en: 'Transformer neutral directly grounded.',
    exposed_conductive_parts_connection_fr: 'Masses reliées au conducteur unique PEN assurant à la fois le retour du courant neutre et la protection.',
    exposed_conductive_parts_connection_en: 'Equipment frames bonded to a single combined PEN conductor serving both neutral and PE duties.',
    fault_loop_nature_fr: 'Boucle métallique identique au TN-S mais empruntant le conducteur commun PEN.',
    fault_loop_nature_en: 'Metallic fault loop returning directly via the shared PEN conductor.',
    fault_current_magnitude: 'Très élevé : 1 kA à 20 kA (Court-circuit franc direct).',
    mandatory_protection_device: 'Disjoncteurs et fusibles magnétothermiques. INTERDICTION ABSOLUE D\'UTILISER DES DDR.',
    disconnection_time_limit: '0.4 seconde (IEC 60364)',
    main_advantages_fr: [
      'Économie d\'un conducteur sur les grosses sections principales (4 conducteurs au lieu de 5)',
      'Simplicité des colonnes de forte puissance'
    ],
    main_advantages_en: [
      'Saves one heavy conductor across large feeders (4 conductors instead of 5)',
      'Economical for high-power distribution mains'
    ],
    main_limitations_fr: [
      'Interdiction absolue pour sections < 10 mm² Cuivre ou 16 mm² Aluminium',
      'Circulation permanente des courants de déséquilibre et harmoniques sur les masses métalliques',
      'Interdit dans les locaux à risque d\'explosion ou d\'incendie et très perturbant pour l\'informatique'
    ],
    main_limitations_en: [
      'Strictly prohibited for conductor sizes below 10 mm² Cu or 16 mm² Al',
      'Unbalanced neutral currents and third harmonics continuously flow through equipment frames',
      'Prohibited in fire/explosion hazard zones and hostile to sensitive IT/data systems'
    ],
    typical_applications_fr: 'Canalisations industrielles de forte puissance en amont du TGBT (avant séparation en TN-S).',
    typical_applications_en: 'Heavy industrial feeder trunks upstream of main distribution boards before branching into TN-S.'
  },
  {
    id: 'TN_C_S',
    code: 'SCHÉMA TN-C-S',
    name_fr: 'Régime TN-C-S (PEN en Amont, Séparation Irréversible N et PE en Aval)',
    name_en: 'TN-C-S System (PME / PEN Upstream, Partitioned N and PE Downstream)',
    source_neutral_connection_fr: 'Neutre du transformateur earthed avec prises de terre multiples (PME).',
    source_neutral_connection_en: 'Transformer neutral earthed with Protective Multiple Earthing (PME).',
    exposed_conductive_parts_connection_fr: 'TN-C depuis le réseau d\'amenée puis séparation stricte du PEN en barre de Neutre (N) et barre de Terre (PE) dans le TGBT.',
    exposed_conductive_parts_connection_en: 'TN-C along service intake followed by irreversible splitting into discrete N and PE busbars inside consumer switchboard.',
    fault_loop_nature_fr: 'Boucle métallique directe à basse impédance.',
    fault_loop_nature_en: 'Direct low-impedance metallic short-circuit loop.',
    fault_current_magnitude: 'Très élevé : 2 kA à 20 kA.',
    mandatory_protection_device: 'Disjoncteurs en amont, DDR autorisés et conseillés en aval du point de séparation N/PE.',
    disconnection_time_limit: '0.4 seconde',
    main_advantages_fr: [
      'Combinaison économique pour l\'amenée d\'énergie avec la sécurité propre du TN-S pour les usagers',
      'Permet l\'usage de DDR sur les circuits terminaux une fois N et PE séparés'
    ],
    main_advantages_en: [
      'Combines upstream infrastructure cost savings with clean TN-S safety inside consumer premises',
      'Enables normal RCD utilization downstream of the N/PE separation bridge'
    ],
    main_limitations_fr: [
      'Règle d\'or absolue : Le conducteur N et le conducteur PE ne doivent JAMAIS être reconnectés en aval du point de séparation',
      'Risque de rupture du PEN amont mettant toutes les masses sous tension'
    ],
    main_limitations_en: [
      'Golden rule: Once separated, Neutral and PE must NEVER be reconnected or bridged downstream',
      'Upstream PEN rupture hazard can elevate all connected metal enclosures to phase potential'
    ],
    typical_applications_fr: 'Alimentations d\'immeubles tertiaires et résidentiels collectifs selon standards britanniques/américains.',
    typical_applications_en: 'UK / North American commercial and multi-dwelling consumer service entrances (PME).'
  },
  {
    id: 'IT',
    code: 'SCHÉMA IT',
    name_fr: 'Régime IT (Neutre Isolé ou Impédant, Masses Métalliques à la Terre)',
    name_en: 'IT System (Isolated Neutral, Earthed Enclosures)',
    source_neutral_connection_fr: 'Neutre du transformateur isolé de la terre ou relié à la terre par une impédance élevée (1000 à 2000 ohms).',
    source_neutral_connection_en: 'Transformer neutral isolated from earth or connected through a high impedance (1000 to 2000 ohms).',
    exposed_conductive_parts_connection_fr: 'Toutes les masses métalliques sont reliées à la terre (ensemble ou par groupes séparés).',
    exposed_conductive_parts_connection_en: 'All exposed conductive enclosures are securely bonded to earth electrodes.',
    fault_loop_nature_fr: 'Au 1er défaut : Courant de fuite capacitif minuscule (quelques dizaines de milliampères). Au 2ème défaut : Court-circuit biphasé franc.',
    fault_loop_nature_en: 'At 1st fault: Minute capacitive leakage current (milliamps). At 2nd fault: True phase-to-phase short-circuit.',
    fault_current_magnitude: '1er défaut : < 1 A (Négligeable). 2ème défaut : Plusieurs kiloampères (Court-circuit violent).',
    mandatory_protection_device: 'Contrôleur Permanent d\'Isolement (CPI / IMD) obligatoire avec alarme sonore et visuelle. Disjoncteurs bipolaires.',
    disconnection_time_limit: 'Pas de coupure au 1er défaut ! Coupure rapide impérative au 2ème défaut.',
    main_advantages_fr: [
      'CONTINUITÉ DE SERVICE ABSOLUE : Aucune coupure de courant lors du premier défaut d\'isolement',
      'Sécurité maximale contre les arcs électriques et explosions en milieu inflammable',
      'Système obligatoire pour les salles d\'opération hospitalières (IT médical) et process continus'
    ],
    main_advantages_en: [
      'ABSOLUTE CONTINUITY OF SERVICE: Zero power outage upon occurrence of the first insulation fault',
      'Maximized safety against ignition and arcing in explosive/chemical atmospheres',
      'Mandatory standard for hospital surgical operating suites (Medical IT) and critical chemical lines'
    ],
    main_limitations_fr: [
      'Nécessite la présence d\'un service de maintenance qualifié pour localiser et éliminer le 1er défaut sans délai',
      'Surélévation de potentiel des phases saines à la tension composée (400 V) par rapport à la terre lors du défaut'
    ],
    main_limitations_en: [
      'Requires dedicated technical maintenance staff to immediately trace and clear the 1st fault',
      'Healthy phases experience voltage escalation to full line-to-line potential (400 V) relative to earth'
    ],
    typical_applications_fr: 'Blocs opératoires hospitaliers, usines chimiques en continu, mines, navires de haute mer, data centers.',
    typical_applications_en: 'Hospital intensive care/operating rooms, continuous chemical processes, mines, marine vessels, data centers.'
  }
];

// 4. FAULT & SCENARIO SIMULATIONS (5 CASES)
export const INSTALLATION_SCENARIOS: FaultScenario[] = [
  {
    id: 'scen-01-short-circuit-selectivity',
    title_fr: '1. Court-Circuit Franc Terminal & Sélectivité Magnétothermique',
    title_en: '1. Final Circuit Bolted Short-Circuit & Selective Breaker Grading',
    category: 'SHORT_CIRCUIT',
    severity: 'HIGH',
    description_fr: 'Un court-circuit franc entre Phase et Neutre survient sur une prise de courant terminale (perçage accidentel de câble). Démonstration de la sélectivité totale : seul le disjoncteur terminal 16 A disjoncte en moins de 10 ms, le disjoncteur divisionnaire 63 A et le disjoncteur général TGBT restent fermés.',
    description_en: 'A bolted short-circuit between Phase and Neutral occurs at a socket outlet. Demonstrates total selectivity: only the local 16 A MCB trips in less than 10 ms; the upstream 63 A MCCB and main switchboard incomer remain unaffected.',
    initial_trigger_fr: 'Court-circuit accidentel phase-neutre au niveau de la prise de courant (Icc = 3200 A).',
    initial_trigger_en: 'Accidental phase-to-neutral metallic fault at socket terminal (Icc = 3200 A).',
    system_response_steps_fr: [
      { step: 1, title: 'Apparition du défaut', action: 'Pic de courant transitoire 3.2 kA sur le câble terminal 2.5 mm².', time: 't = 0 ms' },
      { step: 2, title: 'Déclenchement magnétique local', action: 'Le percuteur magnétique du disjoncteur modulaire 16 A projette le contact mobile.', time: 't = 4 ms' },
      { step: 3, title: 'Extinction de l\'arc', action: 'L\'arc électrique est fractionné et refroidi dans la chambre de désionisation du disjoncteur 16 A.', time: 't = 8 ms' },
      { step: 4, title: 'Isolement sélectif garanti', action: 'Le circuit terminal défaillant est isolé. Tous les autres circuits de l\'étage restent sous tension sans aucune interruption.', time: 't = 12 ms' }
    ],
    system_response_steps_en: [
      { step: 1, title: 'Fault Initiation', action: 'Transient current peak of 3.2 kA surges through 2.5 mm² branch wire.', time: 't = 0 ms' },
      { step: 2, title: 'Magnetic Hammer Actuation', action: 'Electromagnetic plunger of 16 A MCB repels moving contact open.', time: 't = 4 ms' },
      { step: 3, title: 'Arc Quenching', action: 'Electric arc is driven into de-ion plates and quenched.', time: 't = 8 ms' },
      { step: 4, title: 'Selective Isolation Preserved', action: 'Only the faulted circuit is isolated. All other floor circuits remain energized.', time: 't = 12 ms' }
    ],
    selective_isolation_outcome_fr: 'SÉLECTIVITÉ TOTALE : 1 seul bureau privé de courant, le reste du bâtiment fonctionne normalement.',
    selective_isolation_outcome_en: 'TOTAL SELECTIVITY: Single workstation de-energized; entire building operations remain uninterrupted.',
    unserved_loads_affected: '1 prise de courant déconnectée (99.8% des charges conservées)',
    standards_reference: 'IEC 60947-2 Annexe A & IEC 60364-5-53'
  },
  {
    id: 'scen-02-earth-leakage-rcd',
    title_fr: '2. Défaut d\'Isolement Phase-Masse & Déclenchement Différentiel 30 mA',
    title_en: '2. Phase-to-Frame Insulation Fault & 30 mA RCD Shock Protection',
    category: 'EARTH_FAULT',
    severity: 'CRITICAL',
    description_fr: 'Une dégradation de l\'isolant interne d\'un chauffe-eau ou d\'une machine à laver porte la carcasse métallique sous potentiel 230 V. Le courant de fuite de 80 mA s\'écoule vers le PE. L\'interrupteur différentiel 30 mA détecte le déséquilibre et déclenche en 22 ms, maintenant la tension de contact en dessous du seuil létal de 50 V.',
    description_en: 'Internal insulation breakdown inside a water heater energizes its metal frame to 230 V. A leakage current of 80 mA flows through the PE conductor. The 30 mA RCD detects vector imbalance and disconnects supply in 22 ms, preventing lethal touch voltage escalation.',
    initial_trigger_fr: 'Résistance blindée perforée touchant la cuve métallique du chauffe-eau.',
    initial_trigger_en: 'Punctured heating element insulation contacting internal water tank casing.',
    system_response_steps_fr: [
      { step: 1, title: 'Fuite de courant à la masse', action: 'Un courant de défaut de 80 mA quitte la phase et s\'écoule dans le conducteur de terre PE.', time: 't = 0 ms' },
      { step: 2, title: 'Induction dans le tore différentiel', action: 'La somme vectorielle I_phase + I_neutre = 80 mA génère un flux magnétique dans le tore toroïdal.', time: 't = 6 ms' },
      { step: 3, title: 'Excitation du relais polarisé', action: 'La bobine secondaire du tore active le déclencheur ultra-sensible à seuil 30 mA.', time: 't = 14 ms' },
      { step: 4, title: 'Déconnexion salvatrice', action: 'Ouverture mécanique bipolaire complète. La tension sur la carcasse retombe à 0 V.', time: 't = 22 ms' }
    ],
    system_response_steps_en: [
      { step: 1, title: 'Leakage Current Inception', action: '80 mA fault current leaks from phase into PE protective conductor.', time: 't = 0 ms' },
      { step: 2, title: 'Toroidal Core Induction', action: 'Vector imbalance induces electromagnetic flux in differential ferrite core.', time: 't = 6 ms' },
      { step: 3, title: 'Polarized Relay Actuation', action: 'Secondary coil energizes sensitive trip latch exceeding 30 mA threshold.', time: 't = 14 ms' },
      { step: 4, title: 'Protective Disconnection', action: 'Bipolar contacts snap open; frame potential immediately collapses to 0 V.', time: 't = 22 ms' }
    ],
    selective_isolation_outcome_fr: 'PROTECTION DES PERSONNES RÉUSSIE : Électrocution évitée, danger mortel écarté.',
    selective_isolation_outcome_en: 'LIFE SAFETY PRESERVED: Electric shock averted; touch voltage suppressed within 22 ms.',
    unserved_loads_affected: 'Circuit du chauffe-eau isolé',
    standards_reference: 'IEC 60364-4-41 Section 411.3.2 & IEC 61008-1'
  },
  {
    id: 'scen-03-thermal-overload',
    title_fr: '3. Surcharge Thermique Progressive & Déclenchement Temporisé (I²t)',
    title_en: '3. Sustained Thermal Overload & Inverse-Time Bimetal Tripping (I²t)',
    category: 'THERMAL_OVERLOAD',
    severity: 'MEDIUM',
    description_fr: 'Branchement excessif de plusieurs radiateurs d\'appoint sur un circuit de prises 16 A câblé en 2.5 mm² (courant total absorbé de 32 A, soit 200% de la charge nominale). Échauffement progressif du bilame thermique du disjoncteur évitant l\'incendie de câble.',
    description_en: 'Excessive space heaters connected onto a single 16 A socket circuit (total drawn current reaches 32 A, representing 200% overload). Progressive heating of the internal bimetallic strip disconnects circuit after 40 seconds, preventing cable thermal ignition.',
    initial_trigger_fr: 'Multiplication des charges résistives sur une multiprise (I = 32 A pour In = 16 A).',
    initial_trigger_en: 'Cascaded resistive heaters on extension leads (I = 32 A on 16 A rated circuit).',
    system_response_steps_fr: [
      { step: 1, title: 'Surintensité persistante', action: 'Le courant circulant dans la ligne est le double du calibre assigné du câble.', time: 't = 0 s' },
      { step: 2, title: 'Échauffement Joule et flexion du bilame', action: 'La chaleur dégagée déforme lentement le bilame bimétallique à coefficient de dilatation différentiel.', time: 't = 15 s' },
      { step: 3, title: 'Libération du verrou mécanique', action: 'La flèche du bilame atteint la gâchette mécanique de déclenchement.', time: 't = 38 s' },
      { step: 4, title: 'Ouverture du circuit', action: 'Les pôles s\'ouvrent ; le câble n\'a pas dépassé sa température maximale admissible de 70°C.', time: 't = 40 s' }
    ],
    system_response_steps_en: [
      { step: 1, title: 'Sustained Overcurrent', action: 'Current doubles cable continuous rating, initiating thermal Joule buildup.', time: 't = 0 s' },
      { step: 2, title: 'Bimetal Thermal Deflection', action: 'Differential thermal expansion slowly deflects calibrated bimetallic strip.', time: 't = 15 s' },
      { step: 3, title: 'Mechanical Latch Release', action: 'Bimetal tip trips the spring-loaded release catch.', time: 't = 38 s' },
      { step: 4, title: 'Circuit Interrupted', action: 'Contacts part; cable temperature remains safely below 70°C insulation limit.', time: 't = 40 s' }
    ],
    selective_isolation_outcome_fr: 'RISQUE D\'INCENDIE ÉCARTÉ : Préservation de l\'intégrité des isolants PVC du bâtiment.',
    selective_isolation_outcome_en: 'FIRE RISK MITIGATED: Cable PVC insulation preserved from permanent thermal degradation.',
    unserved_loads_affected: 'Circuit prises concerné déconnecté',
    standards_reference: 'IEC 60898-1 Courbe C (Zone thermique 1.13 - 1.45 In)'
  },
  {
    id: 'scen-04-loss-of-neutral',
    title_fr: '4. Rupture Accidentelle du Neutre en Triphasé & Surtension Destructrice',
    title_en: '4. Accidental Loss of Neutral in 3-Phase Installation & Phase Overvoltage',
    category: 'LOSS_OF_NEUTRAL',
    severity: 'CRITICAL',
    description_fr: 'Sectionnement accidentel ou mauvais serrage du conducteur Neutre en amont d\'un tableau triphasé alimentant des charges monophasées réparties de façon dissymétrique. Le point neutre flotte, provoquant une chute de tension à 130 V sur la phase la plus chargée et une surtension létale à 330 V sur la phase la moins chargée.',
    description_en: 'Accidental disconnection or loose terminal of the upstream Neutral conductor in a three-phase system feeding unbalanced single-phase loads. The neutral point shifts wildly, causing undervoltage (130 V) on the heavily loaded phase and destructive overvoltage (330 V) on the lightly loaded phase.',
    initial_trigger_fr: 'Desserrage thermique de la borne principale de neutre dans le tableau d\'étage.',
    initial_trigger_en: 'Thermal loosening of the incoming Neutral terminal lug in the floor distribution panel.',
    system_response_steps_fr: [
      { step: 1, title: 'Rupture de la continuité du Neutre', action: 'Le conducteur neutre est physiquement interrompu ; le potentiel neutre n\'est plus fixé à 0 V.', time: 't = 0 ms' },
      { step: 2, title: 'Déplacement du point neutre vectoriel', action: 'Les récepteurs se retrouvent branchés en série entre phases sous 400 V selon leurs impédances respectives.', time: 't = 2 ms' },
      { step: 3, title: 'Surtension sur phase peu chargée', action: 'La tension Phase 1 monte à 345 V AC ; les alimentations électroniques risquent l\'explosion des condensateurs.', time: 't = 5 ms' },
      { step: 4, title: 'Protection par relais à seuil de surtension (POP)', action: 'Le déclencheur POP (Protection Overvoltage Power) associé au disjoncteur général coupe la ligne.', time: 't = 45 ms' }
    ],
    system_response_steps_en: [
      { step: 1, title: 'Neutral Line Disruption', action: 'Physical severance of neutral line; neutral potential is unanchored from ground.', time: 't = 0 ms' },
      { step: 2, title: 'Neutral Point Vector Shift', action: 'Loads become series-connected across 400 V line-to-line according to impedance ratio.', time: 't = 2 ms' },
      { step: 3, title: 'Overvoltage on Light Phase', action: 'Phase 1 surges to 345 V AC; electronic power supplies face capacitor thermal rupture.', time: 't = 5 ms' },
      { step: 4, title: 'Overvoltage Trip Unit Action', action: 'Protective Overvoltage Protector (POP relay) trips main incoming breaker.', time: 't = 45 ms' }
    ],
    selective_isolation_outcome_fr: 'COUPURE D\'URGENCE : Sauvegarde des équipements électroniques sensibles du bâtiment.',
    selective_isolation_outcome_en: 'EMERGENCY CUTOFF: Sensitive IT and electronic equipment saved from catastrophic destruction.',
    unserved_loads_affected: 'Tableau d\'étage complet déclenché',
    standards_reference: 'EN 50550 (Dispositifs de protection contre les surtensions à fréquence industrielle)'
  },
  {
    id: 'scen-05-mains-failure-generator-transfer',
    title_fr: '5. Perte Totale Réseau Public & Basculement Automatique sur Groupe (ATS)',
    title_en: '5. Utility Grid Outage & Automated Emergency Transfer Switch Transfer (ATS)',
    category: 'MAINS_FAILURE',
    severity: 'HIGH',
    description_fr: 'Perte brutale de la tension réseau 30 kV / 400 V alimentant le TGBT. L\'automate ATS détecte l\'absence de tension, lance le démarrage du groupe électrogène diesel, vérifie la montée en tension et fréquence stabilisées, et commute les contacteurs de puissance pour ré-alimenter les voies prioritaires en 12 secondes.',
    description_en: 'Sudden loss of primary grid voltage feeding the building TGBT. The Automatic Transfer Switch (ATS) senses zero voltage, sends a crank signal to the backup diesel generator, validates voltage and frequency stabilization, and transfers critical busbars in 12 seconds.',
    initial_trigger_fr: 'Déclenchement du disjoncteur départ 30 kV du poste source public suite à un violent orage.',
    initial_trigger_en: 'Lightning strike trips upstream 30 kV utility feeder breaker at primary substation.',
    system_response_steps_fr: [
      { step: 1, title: 'Perte de tension Source 1 Réseau', action: 'L\'automate de permutation ATS constate U < 70% Un sur les 3 phases pendant 1.5 s.', time: 't = 1.5 s' },
      { step: 2, title: 'Ordre de démarrage Groupe Diesel', action: 'Fermeture du contact sec de démarrage de la génératrice de secours.', time: 't = 2.0 s' },
      { step: 3, title: 'Montée en vitesse et excitation', action: 'Le moteur diesel atteint 1500 tr/min ; l\'alternateur délivre 400 V stabilisé à 50 Hz.', time: 't = 8.5 s' },
      { step: 4, title: 'Ouverture Source 1 et Verrouillage', action: 'L\'interrupteur Normal s\'ouvre avec confirmation de coupure visible.', time: 't = 9.0 s' },
      { step: 5, title: 'Fermeture Source 2 Secours (ATS)', action: 'L\'interrupteur Secours se ferme. Les pompes d\'incendie, ascenseurs et secours sont réalimentés.', time: 't = 11.5 s' }
    ],
    system_response_steps_en: [
      { step: 1, title: 'Mains Voltage Loss Confirmed', action: 'ATS controller verifies U < 70% Un on all phases for 1.5 seconds.', time: 't = 1.5 s' },
      { step: 2, title: 'Genset Auto-Start Command', action: 'Dry contact closes, signaling diesel generator electric starter.', time: 't = 2.0 s' },
      { step: 3, title: 'Speed & Voltage Stabilization', action: 'Engine reaches 1500 rpm; alternator stabilizes at 400 V / 50 Hz.', time: 't = 8.5 s' },
      { step: 4, title: 'Mains Switch Parting', action: 'Normal source switch snaps open; mechanical interlock releases emergency path.', time: 't = 9.0 s' },
      { step: 5, title: 'Emergency Transfer Completed', action: 'Emergency switch closes; fire pumps, emergency lighting, and elevators re-energized.', time: 't = 11.5 s' }
    ],
    selective_isolation_outcome_fr: 'CONTINUITÉ SÉCURISÉE : Rétablissement des services vitaux en 12 secondes chrono.',
    selective_isolation_outcome_en: 'VITAL CONTINUITY RESTORED: Critical building life-safety systems re-energized within 12 seconds.',
    unserved_loads_affected: 'Charges non prioritaires délestées (climatisation générale)',
    standards_reference: 'IEC 60947-6-1 & NFPA 110 (Emergency and Standby Power Systems)'
  }
];

// 5. EDUCATIONAL LOTO (LOCKOUT / TAGOUT) 8-STEP SAFETY WORKFLOW
export const LOTO_SAFETY_WORKFLOW: LotoStep[] = [
  {
    stepNumber: 1,
    code: 'LOTO-01',
    title_fr: '1. Analyse des Risques & Notification des Usagers',
    title_en: '1. Risk Assessment & Personnel Notification',
    description_fr: 'Identifier formellement les circuits et sources d\'énergie alimentant la zone. Informer tous les exploitants et occupants de la coupure imminente.',
    description_en: 'Formally identify all electrical energy feeds, backfeeds, and UPS paths. Notify all facility supervisors of impending service interruption.',
    tools_required_fr: ['Schéma unifilaire à jour', 'Fiche de consignation', 'Registre de sécurité'],
    tools_required_en: ['Single-line diagram', 'Permit-to-work form', 'Facility safety log'],
    danger_avoided_fr: 'Arrêt intempestif de machines critiques ou mise en danger d\'opérateurs distants.',
    danger_avoided_en: 'Unannounced disruption to critical life-support loads or remote personnel.'
  },
  {
    stepNumber: 2,
    code: 'LOTO-02',
    title_fr: '2. Séparation / Déconnexion des Circuits de Puissance',
    title_en: '2. Switching Open Power Contacts',
    description_fr: 'Manœuvrer le disjoncteur ou l\'interrupteur-sectionneur de tête en position Ouverte (OFF) pour interrompre la circulation du courant de charge.',
    description_en: 'Operate the circuit breaker or load-break switch to the OPEN (OFF) state, extinguishing active load current.',
    tools_required_fr: ['Manette de commande manuelle ou bouton poussoir d\'arrêt'],
    tools_required_en: ['Manual rotary handle or certified trip push-button'],
    danger_avoided_fr: 'Tentative de sectionnement sous charge susceptible de générer un arc électrique violent.',
    danger_avoided_en: 'Attempting to open non-load-break disconnectors under heavy electrical current.'
  },
  {
    stepNumber: 3,
    code: 'LOTO-03',
    title_fr: '3. Condamnation & Cadenassage Visible (LOTO)',
    title_en: '3. Lockout & Visual Tagout (LOTO)',
    description_fr: 'Appliquer un cadenas de consignation individuel avec moraillon multiple sur la poignée de commande pour interdire tout réarmement intempestif.',
    description_en: 'Attach personal safety padlock and lockout hasp onto the operating mechanism, locking it mechanically in the OFF position.',
    tools_required_fr: ['Cadenas rouge à clé unique', 'Moraillon multipoints', 'Étiquette d\'avertissement danger'],
    tools_required_en: ['Red keyed-different safety padlock', 'Lockout hasp', 'Standardized danger tag'],
    danger_avoided_fr: 'Ré-enclenchement accidentel par un tiers pendant que des agents travaillent sur les conducteurs.',
    danger_avoided_en: 'Accidental or unauthorized re-energization by a third party during active maintenance.'
  },
  {
    stepNumber: 4,
    code: 'LOTO-04',
    title_fr: '4. Vérification d\'Absence de Tension (VAT / VAV)',
    title_en: '4. Verification of Absence of Voltage (VAT / VAV)',
    description_fr: 'À l\'aide d\'un vérificateur d\'absence de tension homologué (norme CEI 61243-3), tester chaque phase par rapport au neutre, à la terre et entre phases. Tester l\'appareil immédiatement avant et après sur une source connue.',
    description_en: 'Using a dedicated portable voltage tester (IEC 61243-3), test Phase-to-Phase, Phase-to-Neutral, and Phase-to-Earth. Prove tester against a known live source immediately before and after the test.',
    tools_required_fr: ['Détecteur VAT bipolaire avec pointes IP2X', 'Boîtier de test de fonctionnement autonome'],
    tools_required_en: ['Bipolar VAT voltage tester with IP2X probes', 'Proving unit generator'],
    danger_avoided_fr: 'Électrocution mortelle due à une tension résiduelle, un retour par neutre ou une alimentation secourue méconnue.',
    danger_avoided_en: 'Fatal electric shock from unrecognized backfeeds, UPS inverters, or stored capacitor energy.'
  },
  {
    stepNumber: 5,
    code: 'LOTO-05',
    title_fr: '5. Mise à la Terre & en Court-Circuit (MALT/CC)',
    title_en: '5. Earthing & Short-Circuiting Conductors',
    description_fr: 'Raccorder d\'abord les pinces de mise à la terre au collecteur PE, puis les fixer sur les conducteurs de phase actifs pour décharger l\'énergie résiduelle.',
    description_en: 'Connect grounding clamps first to the installation main earth terminal, then clamp securely onto de-energized phase busbars.',
    tools_required_fr: ['Perche isolante 1000 V', 'Câbles de court-circuitage cuivre extra-souple'],
    tools_required_en: ['1000 V rated insulating stick', 'Extra-flexible copper grounding lead cluster'],
    danger_avoided_fr: 'Tension induite par couplage capacitif ou fermeture accidentelle d\'une source distante.',
    danger_avoided_en: 'Electrostatic charge shock or unexpected re-energization tripping instantly upstream.'
  },
  {
    stepNumber: 6,
    code: 'LOTO-06',
    title_fr: '6. Délimitation Matérielle de la Zone de Travail',
    title_en: '6. Work Area Physical Demarcation',
    description_fr: 'Balisage de la zone d\'intervention à l\'aide de rubans d\'avertissement et pose d\'écrans isolants pour recouvrir toute pièce nue sous tension voisine.',
    description_en: 'Erect warning tapes and fit insulating blankets over any adjacent energized busbars or live terminals within arm reach.',
    tools_required_fr: ['Nappes isolantes en caoutchouc 1000 V', 'Pinces plastiques', 'Banderole rouge/blanche'],
    tools_required_en: ['Class 0 rubber insulating blankets', 'Plastic holding clamps', 'Warning barrier tape'],
    danger_avoided_fr: 'Contact direct par inadvertance avec des jeux de barres adjacents restés sous tension.',
    danger_avoided_en: 'Inadvertent direct contact with adjacent energized switchgear cubicles.'
  },
  {
    stepNumber: 7,
    code: 'LOTO-07',
    title_fr: '7. Réalisation des Travaux Électriques',
    title_en: '7. Execution of Electrical Work',
    description_fr: 'Effectuer le remplacement d\'appareillage, le tirage de câbles ou le resserrage dynamométrique dans des conditions de sécurité absolue.',
    description_en: 'Perform switchgear replacement, busbar torque auditing, or circuit additions in verified zero-energy state.',
    tools_required_fr: ['Outillage à main isolé 1000 V (CEI 60900)', 'Gants de protection', 'Lunettes anti-arc'],
    tools_required_en: ['Insulated hand tools 1000 V (IEC 60900)', 'Safety goggles', 'Arc-rated work apparel'],
    danger_avoided_fr: 'Tout risque d\'accident corporel d\'origine électrique.',
    danger_avoided_en: 'All forms of electrical hazards and flash burns.'
  },
  {
    stepNumber: 8,
    code: 'LOTO-08',
    title_fr: '8. Déconsignation & Remise en Service Échelonnée',
    title_en: '8. De-Isolation & Phased Re-Energization',
    description_fr: 'Retirer tous les outils et mises à la terre. Remettre en place les plastrons de protection. Déverrouiller les cadenas LOTO et ré-enclencher le disjoncteur avec contrôle des tensions.',
    description_en: 'Evacuate all tools and remove grounding clusters. Reinstall dead-front insulating faceplates. Remove personal padlocks, close breaker, and verify balanced 400 V phase voltages.',
    tools_required_fr: ['Clés de déconsignation', 'Multimètre de contrôle de tension triphasée'],
    tools_required_en: ['Padlock master keys', 'Digital multimeter to check 400 V balance'],
    danger_avoided_fr: 'Court-circuit franc par oubli d\'une perche de court-circuitage lors de la réalimentation.',
    danger_avoided_en: 'Catastrophic bolted fault caused by leaving temporary grounding jumpers attached.'
  }
];
