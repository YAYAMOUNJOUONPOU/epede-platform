// src/data/engineeringDisciplinesInterfaceData.ts
// EPEDE Master Dataset — Multidisciplinary Engineering Interface Matrix & Contractual Demarcation
// Defines explicit handovers across the 8 electrical power engineering disciplines,
// and contractual boundary lines between SONATREL, ENEO, IPPs, and Heavy Industrial Consumers.

export type DisciplineId =
  | 'ELECTRICAL_HV'
  | 'PROTECTION_AUTOMATION'
  | 'SCADA_TELEMETRY'
  | 'CIVIL_STRUCTURAL'
  | 'FLUIDS_ENVIRONMENT'
  | 'AUXILIARY_DC_AC'
  | 'TELECOM_CYBER'
  | 'EARTHING_LIGHTNING';

export interface EngineeringDiscipline {
  id: DisciplineId;
  name_fr: string;
  name_en: string;
  iconName: string;
  leadRole_fr: string;
  leadRole_en: string;
  governingStandards: string[];
  keyDeliverables_fr: string[];
  keyDeliverables_en: string[];
}

export interface DisciplineInterfaceItem {
  id: string;
  primaryDiscipline: DisciplineId;
  interfacingDiscipline: DisciplineId;
  interfaceTitle_fr: string;
  interfaceTitle_en: string;
  demarcationBoundary_fr: string;
  demarcationBoundary_en: string;
  physicalTerminalPoint_fr: string;
  physicalTerminalPoint_en: string;
  handoverCriterion_fr: string;
  handoverCriterion_en: string;
  conflictRisk_fr: string;
  conflictRisk_en: string;
  applicableStandards: string[];
}

export interface UtilityDemarcationActor {
  actorCode: 'SONATREL' | 'ENEO' | 'IPP_HYDRO' | 'INDUSTRIAL_CONSUMER';
  name_fr: string;
  name_en: string;
  voltagePerimeter: string;
  roleDescription_fr: string;
  roleDescription_en: string;
  badgeColor: string;
}

export interface UtilityContractualInterface {
  id: string;
  boundaryName_fr: string;
  boundaryName_en: string;
  upstreamParty: 'SONATREL' | 'IPP_HYDRO';
  downstreamParty: 'ENEO' | 'SONATREL' | 'INDUSTRIAL_CONSUMER';
  physicalDeliveryPoint_fr: string;
  physicalDeliveryPoint_en: string;
  ownershipDemarcation_fr: string;
  ownershipDemarcation_en: string;
  operationalResponsibility_fr: string;
  operationalResponsibility_en: string;
  meteringDemarcation_fr: string;
  meteringDemarcation_en: string;
  disputeEscalationAuthority_fr: string;
  disputeEscalationAuthority_en: string;
}

export const ENGINEERING_DISCIPLINES: EngineeringDiscipline[] = [
  {
    id: 'ELECTRICAL_HV',
    name_fr: 'Génie Électrique Haute Tension (HTB)',
    name_en: 'High-Voltage Electrical Engineering',
    iconName: 'Zap',
    leadRole_fr: 'Ingénieur d\'Études Postes & Lignes HTB',
    leadRole_en: 'Senior HV Substation & Line Design Engineer',
    governingStandards: ['IEC 60076', 'IEC 62271-100', 'IEC 60826', 'IEC 61936-1'],
    keyDeliverables_fr: ['Schéma unifilaire général (SLD)', 'Notes de calcul de court-circuit', 'Plans d\'implantation générale et coupes'],
    keyDeliverables_en: ['Single-Line Diagram (SLD)', 'Short-circuit calculation reports', 'Substation layout and cross-sections']
  },
  {
    id: 'PROTECTION_AUTOMATION',
    name_fr: 'Protection des Réseaux & Relayage',
    name_en: 'Network Protection & Automation',
    iconName: 'Shield',
    leadRole_fr: 'Ingénieur Protection & Automatismes',
    leadRole_en: 'Protection & Substation Automation Engineer',
    governingStandards: ['IEC 60255', 'IEC 61850', 'IEEE C37.90'],
    keyDeliverables_fr: ['Plan de coordination sélective des relais', 'Matrice d\'interverrouillage logique', 'Fichier de configuration SCD/ICD CEI 61850'],
    keyDeliverables_en: ['Relay selectivity study', 'Logic interlocking trip matrix', 'IEC 61850 SCD/ICD station configuration files']
  },
  {
    id: 'SCADA_TELEMETRY',
    name_fr: 'Téléconduite SCADA & Dispatching',
    name_en: 'SCADA Telemetry & Dispatch Systems',
    iconName: 'Activity',
    leadRole_fr: 'Ingénieur SCADA & EMS',
    leadRole_en: 'SCADA/EMS Telecontrol Engineer',
    governingStandards: ['IEC 60870-5-104', 'IEC 60870-5-101', 'IEC 61968 (CIM)'],
    keyDeliverables_fr: ['Liste de points de télésignalisation et télémesure', 'Schémas synoptiques mimic', 'Paramétrage passerelle RTU/Gateway'],
    keyDeliverables_en: ['Telemetry point address list', 'Dispatching mimic displays', 'RTU gateway communications configuration']
  },
  {
    id: 'CIVIL_STRUCTURAL',
    name_fr: 'Génie Civil, Fondations & Charpentes',
    name_en: 'Civil & Structural Engineering',
    iconName: 'Building',
    leadRole_fr: 'Ingénieur Calcul de Structures & Géotechnicien',
    leadRole_en: 'Civil Structural & Geotechnical Engineer',
    governingStandards: ['Eurocode 2 / 3', 'NF P 06-001', 'IEC 60826'],
    keyDeliverables_fr: ['Plans de ferraillage massifs de transformateur', 'Notes de calcul charpentes portiques', 'Caniveaux et voiries lourdes'],
    keyDeliverables_en: ['Reinforced concrete transformer pad drawings', 'Gantry steel structure stress reports', 'Cable trench routing & heavy haul roads']
  },
  {
    id: 'FLUIDS_ENVIRONMENT',
    name_fr: 'Fluides, Sécurité Incendie & Environnement',
    name_en: 'Fluids, Fire Protection & Environment',
    iconName: 'Flame',
    leadRole_fr: 'Ingénieur Environnement & Sécurité Industrielle',
    leadRole_en: 'Industrial Safety & Environmental Engineer',
    governingStandards: ['NF C 17-300', 'IEC 61936-1 Cl. 8', 'IEC 62271-4'],
    keyDeliverables_fr: ['Dimensionnement bac rétention totale d\'huile', 'Système d\'extinction déluge eau/mousse', 'Procédure traçabilité et recyclage SF6'],
    keyDeliverables_en: ['110% oil containment pit sizing report', 'Water deluge / foam fire suppression layout', 'SF6 gas recovery and lifecycle audit plan']
  },
  {
    id: 'AUXILIARY_DC_AC',
    name_fr: 'Services Auxiliaires AC / DC (110 Vcc)',
    name_en: 'AC/DC Auxiliary Power Systems (110 Vdc)',
    iconName: 'Cpu',
    leadRole_fr: 'Ingénieur Alimentations Sécurisées & Basse Tension',
    leadRole_en: 'Auxiliary Power Systems Engineer',
    governingStandards: ['IEEE 485', 'IEC 60896', 'IEC 61439-2'],
    keyDeliverables_fr: ['Bilan de puissance auxiliaire DC/AC', 'Dimensionnement banc de batteries 110 Vcc (autonomie 8h)', 'Schémas armoire TGBT services auxiliaires'],
    keyDeliverables_en: ['Auxiliary DC/AC load balance', '110 Vdc battery bank sizing (8-hour backup)', 'Station service AC distribution switchboard diagrams']
  },
  {
    id: 'TELECOM_CYBER',
    name_fr: 'Télécoms OPGW & Cybersécurité Industrielle',
    name_en: 'Telecom OPGW & Industrial Cybersecurity',
    iconName: 'Network',
    leadRole_fr: 'Ingénieur Télécoms & Réseaux Industriels',
    leadRole_en: 'Substation Telecom & OT Cyber Engineer',
    governingStandards: ['IEC 62351', 'IEEE 1613', 'IEC 61850-90-5'],
    keyDeliverables_fr: ['Plan d\'épissurage et bilan optique OPGW', 'Architecture réseau LAN durci (switches PRP/HSR)', 'Politique de filtrage firewall périmétrique OT'],
    keyDeliverables_en: ['OPGW fiber splice diagrams & optical power budget', 'Fault-tolerant LAN design (PRP/HSR switches)', 'Substation perimeter OT firewall filtering rulebase']
  },
  {
    id: 'EARTHING_LIGHTNING',
    name_fr: 'Mise à la Terre & Protection Foudre',
    name_en: 'Substation Earthing & Lightning Protection',
    iconName: 'AlertTriangle',
    leadRole_fr: 'Spécialiste CEM, Foudre & Prises de Terre',
    leadRole_en: 'Lightning Protection & Grounding Grid Specialist',
    governingStandards: ['IEEE 80', 'IEC 62305', 'IEC 61936-1'],
    keyDeliverables_fr: ['Calcul des tensions de pas et de toucher (U_step, U_touch)', 'Maillage de cuivre enfoui 95 mm²', 'Couverture parafoudres et paratonnerres Franklin'],
    keyDeliverables_en: ['Step and touch voltage compliance report', '95 mm² buried copper mesh earthing grid plan', 'Surge arrester & Franklin lightning rod protection cones']
  }
];

export const DISCIPLINE_INTERFACES: DisciplineInterfaceItem[] = [
  {
    id: 'int-elec-civil',
    primaryDiscipline: 'ELECTRICAL_HV',
    interfacingDiscipline: 'CIVIL_STRUCTURAL',
    interfaceTitle_fr: 'Efforts Électrodynamiques & Massif du Transformateur',
    interfaceTitle_en: 'Electrodynamic Forces & Transformer Foundation Pad',
    demarcationBoundary_fr: 'Boulons d\'ancrage scellés dans le béton armé et cales antisismiques sous les galets de roulement.',
    demarcationBoundary_en: 'Anchor j-bolts cast into reinforced concrete pad and seismic stoppers under transformer rail wheels.',
    physicalTerminalPoint_fr: 'Platine d\'assise métallique du transformateur en contact avec la fondation.',
    physicalTerminalPoint_en: 'Base steel plate of transformer tank in contact with concrete foundation.',
    handoverCriterion_fr: 'Résistance à la compression du béton à 28 jours > 30 MPa ; flèche sous charge de 120 tonnes < 2 mm.',
    handoverCriterion_en: 'Concrete compressive strength at 28 days > 30 MPa; deflection under 120-tonne weight < 2 mm.',
    conflictRisk_fr: 'Positionnement erroné des réservations d\'ancrage par rapport au plan guide d\'équipementier.',
    conflictRisk_en: 'Misalignment between civil foundation bolt sleeves and OEM transformer wheel gauge.',
    applicableStandards: ['Eurocode 2', 'IEC 61936-1 Cl. 7']
  },
  {
    id: 'int-prot-scada',
    primaryDiscipline: 'PROTECTION_AUTOMATION',
    interfacingDiscipline: 'SCADA_TELEMETRY',
    interfaceTitle_fr: 'Protocole IEC 61850 vers Téléconduite Dispatching 104',
    interfaceTitle_en: 'IEC 61850 Substation Bus to IEC 60870-5-104 Dispatching',
    demarcationBoundary_fr: 'Passerelle de téléconduite (Gateway RTU) convertissant les attributs MMS/GOOSE en télémesures cycliques et télécommandes sécurisées 104.',
    demarcationBoundary_en: 'Substation gateway RTU converting MMS data models and GOOSE events into cyclic 104 telemetry and execute-before-operate commands.',
    physicalTerminalPoint_fr: 'Port Ethernet fibre optique RJ45/LC en tête de passerelle RTU baie téléconduite.',
    physicalTerminalPoint_en: 'Ethernet fiber-optic LC port on top of RTU communication gateway panel.',
    handoverCriterion_fr: 'Temps d\'actualisation d\'état < 1 seconde ; temps de cycle commande-accusé de réception < 500 ms.',
    handoverCriterion_en: 'Status update time < 1 second; command execute-acknowledge turnaround time < 500 ms.',
    conflictRisk_fr: 'Discordance de table d\'adressage IOA (Information Object Address) entre le SCADA national et le poste.',
    conflictRisk_en: 'IOA (Information Object Address) mapping mismatch between national EMS and local bay RTU.',
    applicableStandards: ['IEC 61850-80-1', 'IEC 60870-5-104']
  },
  {
    id: 'int-aux-prot',
    primaryDiscipline: 'AUXILIARY_DC_AC',
    interfacingDiscipline: 'PROTECTION_AUTOMATION',
    interfaceTitle_fr: 'Alimentation Secourue 110 Vcc des Relais de Protection',
    interfaceTitle_en: '110 Vdc Secure Auxiliary Supply to Protection Relays',
    demarcationBoundary_fr: 'Borniers d\'arrivée DC et disjoncteurs magnéto-thermiques modulaires dédiés par tranche de protection.',
    demarcationBoundary_en: 'DC incoming terminal blocks and dedicated miniature circuit breakers per protection bay tranche.',
    physicalTerminalPoint_fr: 'Bornes X1:1 et X1:2 de l\'alimentation interne de chaque IED dans la baie de relayage.',
    physicalTerminalPoint_en: 'Terminals X1:1 and X1:2 on internal DC power supply of each protection IED in cubicle.',
    handoverCriterion_fr: 'Ondulation résiduelle DC < 2% ; maintien de tension > 100 Vcc lors du déclenchement simultané de 3 bobines à émission.',
    handoverCriterion_en: 'DC voltage ripple < 2%; supply voltage maintained > 100 Vdc during simultaneous trip coil inrush.',
    conflictRisk_fr: 'Sous-dimensionnement de la section de câble créant une chute de tension inhibant le déclenchement en cas d\'appel de courant.',
    conflictRisk_en: 'Undersized DC feed cable causing transient voltage drop below relay minimum operating threshold.',
    applicableStandards: ['IEEE 485', 'IEC 60255-1']
  },
  {
    id: 'int-fluids-civil',
    primaryDiscipline: 'FLUIDS_ENVIRONMENT',
    interfacingDiscipline: 'CIVIL_STRUCTURAL',
    interfaceTitle_fr: 'Fosse de Rétention Totale & Bac Étouffoir à Galets',
    interfaceTitle_en: 'Oil Containment Pit & Gravel Flame Extinguisher Bed',
    demarcationBoundary_fr: 'Béton hydrofuge étanche de la cuvette de rétention et caillebotis métallique galvanisé supportant les galets.',
    demarcationBoundary_en: 'Impervious waterproof concrete tank basin and galvanized steel grating holding calibrated gravel bed.',
    physicalTerminalPoint_fr: 'Rebord supérieur de la fosse de rétention et caniveau d\'évacuation vers déshuileur.',
    physicalTerminalPoint_en: 'Top coping edge of retention bund and drainage duct to oil-water separator siphon.',
    handoverCriterion_fr: 'Volume utile égal à 100% de l\'huile du transformateur (ex. 32 m³) + 10% de pluie décennale ; étanchéité testée par mise en eau 24h.',
    handoverCriterion_en: 'Effective volume = 100% of transformer oil (e.g. 32 m³) + 10% rainfall allowance; leak tightness tested via 24h water holding test.',
    conflictRisk_fr: 'Épaisseur insuffisante du lit de galets (NF C 17-300 exige min. 30 cm de galets 40/60 mm) empêchant l\'étouffement instantané d\'un feu d\'huile.',
    conflictRisk_en: 'Gravel bed thickness below required minimum (NF C 17-300 requires 30 cm of 40/60 mm pebbles) failing to extinguish burning oil.',
    applicableStandards: ['NF C 17-300', 'IEC 61936-1']
  }
];

export const CAMEROON_UTILITY_ACTORS: UtilityDemarcationActor[] = [
  {
    actorCode: 'SONATREL',
    name_fr: 'SONATREL — Société Nationale de Transport de l\'Électricité',
    name_en: 'SONATREL — National Electricity Transmission Company of Cameroon',
    voltagePerimeter: '225 kV & 90 kV',
    roleDescription_fr: 'Gestionnaire exclusif du réseau de transport, responsable de la stabilité dynamique, du dispatching national et des interconnexions.',
    roleDescription_en: 'Sole transmission system operator (TSO) in Cameroon, managing 225 kV/90 kV corridors, grid stability and dispatching.',
    badgeColor: '#EAB308'
  },
  {
    actorCode: 'ENEO',
    name_fr: 'ENEO Cameroun — Distributeur Concessionnaire',
    name_en: 'ENEO Cameroon — Distribution Concessionaire',
    voltagePerimeter: '30 kV, 15 kV & 400 V / 230 V',
    roleDescription_fr: 'Exploitation et maintenance des réseaux de distribution HTA/BT, postes de livraison clientèle, relève et facturation.',
    roleDescription_en: 'Operation and maintenance of medium-voltage (30/15 kV) and low-voltage distribution grids, retail billing and metering.',
    badgeColor: '#38BDF8'
  },
  {
    actorCode: 'IPP_HYDRO',
    name_fr: 'Producteurs Indépendants & Barrages (Nachtigal, Songloulou, Edéa)',
    name_en: 'Independent Power Producers (NHPC Nachtigal, Songloulou Hydro)',
    voltagePerimeter: '10.5 kV / 15 kV (Génération) & 225 kV (Évacuation)',
    roleDescription_fr: 'Exploitation des centrales hydroélectriques de base et de pointe, mise à disposition de puissance active et soutien de tension réactive.',
    roleDescription_en: 'Operation of base-load and peak hydro plants, supply of active power and reactive voltage support under PPA.',
    badgeColor: '#10B981'
  },
  {
    actorCode: 'INDUSTRIAL_CONSUMER',
    name_fr: 'Grands Comptes Industriels Haute Tension (ALUCAM, Dangote, etc.)',
    name_en: 'Heavy High-Voltage Industrial Offtakers (ALUCAM, Dangote, etc.)',
    voltagePerimeter: '225 kV & 90 kV direct',
    roleDescription_fr: 'Clients électro-intensifs raccordés directement au réseau de transport, soumis à des contraintes strictes de cos phi et de creux de tension.',
    roleDescription_en: 'Heavy electro-intensive industrial consumers directly fed from 225 kV grid, subject to strict power factor and harmonic distortion caps.',
    badgeColor: '#F97316'
  }
];

export const CAMEROON_CONTRACTUAL_INTERFACES: UtilityContractualInterface[] = [
  {
    id: 'contract-sonatrel-eneo-poste',
    boundaryName_fr: 'Poste Source 225/30 kV : Démarcation SONATREL (Transport) ↔ ENEO (Distribution)',
    boundaryName_en: '225/30 kV Substation: SONATREL (TSO) ↔ ENEO (DSO) Demarcation',
    upstreamParty: 'SONATREL',
    downstreamParty: 'ENEO',
    physicalDeliveryPoint_fr: 'Plages de raccordement aval des disjoncteurs départs 30 kV ou pinces de tête de câble souterrain 30 kV.',
    physicalDeliveryPoint_en: 'Downstream terminal palms of 30 kV bay breakers or cable pothead termination clamps.',
    ownershipDemarcation_fr: 'SONATREL est propriétaire du transformateur 225/30 kV et des barres 30 kV. ENEO est propriétaire des cellules et câbles départs 30 kV.',
    ownershipDemarcation_en: 'SONATREL owns the 225/30 kV power transformers and 30 kV busbar. ENEO owns outgoing 30 kV bay cubicles and feeder cables.',
    operationalResponsibility_fr: 'Consignation conjointe requise : SONATREL manœuvre le sectionneur de barre ; ENEO manœuvre le sectionneur d\'aiguillage départ.',
    operationalResponsibility_en: 'Joint LOTO procedure: SONATREL operates bus disconnector; ENEO operates feeder cable disconnector.',
    meteringDemarcation_fr: 'Comptage transactionnel aux bornes 30 kV du transformateur avec TC et TT dédiés de précision classe 0.2S plombés par l\'ARSEL.',
    meteringDemarcation_en: 'Settlement tariff metering at 30 kV transformer secondary with dedicated Class 0.2S CT/VTs sealed by ARSEL regulator.',
    disputeEscalationAuthority_fr: 'ARSEL (Agence de Régulation du Secteur de l\'Électricité du Cameroun).',
    disputeEscalationAuthority_en: 'ARSEL (Electricity Sector Regulatory Agency of Cameroon).'
  },
  {
    id: 'contract-nachtigal-sonatrel',
    boundaryName_fr: 'Centrale Nachtigal 420 MW ↔ Poste d\'Évacuation SONATREL 225 kV',
    boundaryName_en: 'Nachtigal 420 MW Hydropower Plant ↔ SONATREL 225 kV Grid Injection',
    upstreamParty: 'IPP_HYDRO',
    downstreamParty: 'SONATREL',
    physicalDeliveryPoint_fr: 'Portique de départ 225 kV de la sous-station élévatrice de Nachtigal vers les lignes doubles ternes Nachtigal – Yaoundé (Nyom 2).',
    physicalDeliveryPoint_en: '225 kV takeoff gantry tower at Nachtigal switchyard to double-circuit lines to Yaoundé (Nyom 2).',
    ownershipDemarcation_fr: 'NHPC est propriétaire des 7 groupes de 60 MW et des transformateurs 15/225 kV. SONATREL est propriétaire des lignes 225 kV.',
    ownershipDemarcation_en: 'NHPC owns the 7x60 MW generating units and 15/225 kV step-up transformers. SONATREL owns 225 kV transmission line corridors.',
    operationalResponsibility_fr: 'La centrale exécute les ordres de téléréglage de puissance active (P) et de consigne de tension (U) émis par le Dispatching National de Mangombé.',
    operationalResponsibility_en: 'Plant complies with active power dispatch and reactive voltage setpoint dispatched from National Control Center at Mangombé.',
    meteringDemarcation_fr: 'Comptage principal et comptage miroir redondant sur chaque travée départ 225 kV (Norme CEI 62053-22 classe 0.2S).',
    meteringDemarcation_en: 'Primary and check redundant meters on each 225 kV outgoing bay (IEC 62053-22 class 0.2S).',
    disputeEscalationAuthority_fr: 'Ministère de l\'Eau et de l\'Énergie (MINEE) et tribunal arbitral international sous égide CCI.',
    disputeEscalationAuthority_en: 'Ministry of Water and Energy (MINEE) and ICC International Chamber of Commerce arbitration.'
  },
  {
    id: 'contract-sonatrel-alucam',
    boundaryName_fr: 'Poste 225/90 kV Mangombé ↔ Électrolyse Aluminium ALUCAM (Client Électro-Intensif)',
    boundaryName_en: 'Mangombé Substation ↔ ALUCAM Aluminum Smelter (Direct Heavy Offtaker)',
    upstreamParty: 'SONATREL',
    downstreamParty: 'INDUSTRIAL_CONSUMER',
    physicalDeliveryPoint_fr: 'Sectionneurs d\'aiguillage 90 kV en tête des transformateurs-redresseurs de l\'usine d\'électrolyse.',
    physicalDeliveryPoint_en: '90 kV bus selection disconnectors at incoming line bay to rectifier-transformers of smelter pots.',
    ownershipDemarcation_fr: 'SONATREL détient la ligne 90 kV. ALUCAM détient l\'appareillage du poste récepteur et les groupes convertisseurs 90 kV / 800 Vcc.',
    ownershipDemarcation_en: 'SONATREL owns incoming 90 kV feed. ALUCAM owns receiving switchgear and 90 kV / 800 Vdc rectifier groups.',
    operationalResponsibility_fr: 'Délestage d\'urgence contractuel en cas de black-out imminent : ALUCAM accepte un délestage programmé de 50 MW sous 3 minutes pour sauver le réseau.',
    operationalResponsibility_en: 'Contractual emergency load shedding: ALUCAM accepts up to 50 MW shed within 3 minutes upon under-frequency distress.',
    meteringDemarcation_fr: 'Comptage 4 quadrants P+/P- et Q+/Q- avec calcul de pénalité de dépassement de puissance réactive (tan phi > 0.40).',
    meteringDemarcation_en: 'Four-quadrant active/reactive meter with automatic reactive power penalty calculation (tan phi > 0.40).',
    disputeEscalationAuthority_fr: 'Commission mixte MINEE / SONATREL / Direction Générale ALUCAM.',
    disputeEscalationAuthority_en: 'Joint ministerial committee MINEE / SONATREL / ALUCAM Board.'
  }
];
