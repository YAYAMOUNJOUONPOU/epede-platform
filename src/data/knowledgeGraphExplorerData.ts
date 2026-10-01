// src/data/knowledgeGraphExplorerData.ts
// EPEDE - Knowledge Graph Explorer Data Model & Master Topology
// Implements Priority #1: Multi-Hop Causal Chains, 6 Relation Filters, 3 Usage Levels & Data Reliability Provenance

export type GraphRelationType =
  | 'ENERGY'         // ⚡ Flux de puissance amont / aval
  | 'CONTROL'        // 🕹️ Ordre de commande, déclenchement, automate
  | 'COMMUNICATION'  // 📡 Protocole IEC 61850 GOOSE/MMS, SCADA IEC 104, Modbus
  | 'PROTECTION'     // 🛡️ Chaîne de détection, TC/TP, relais de protection
  | 'STANDARD'       // 📜 Exigences normatives CEI / IEEE / NF C
  | 'MAINTENANCE';   // 🔧 Diagnostic FMEA, DGA, thermographie, périodicité

export type UsageLevel = 'DISCOVERY' | 'TECHNICAL' | 'ENGINEERING';

export type ProvenanceKind =
  | 'EXIGENCE_NORMATIVE'
  | 'DONNEE_RESEAU_VERIFIEE'
  | 'HYPOTHESE_SIMULATION'
  | 'BONNE_PRATIQUE'
  | 'CONTENU_PEDAGOGIQUE'
  | 'DONNEE_INDICATIVE';

export interface DataTraceability {
  kind: ProvenanceKind;
  source: string;
  verifiedDate: string;
  confidenceScore: number; // 0 to 100
  editorialLead: string;
  standardReference?: string;
}

export interface CausalChainStep {
  stepIndex: number;
  entityId: string;
  entityName: string;
  role: string;
  actionFr: string;
  actionEn: string;
  relationType: GraphRelationType;
  arrowLabelFr: string;
  arrowLabelEn: string;
  timingMs?: number;
}

export interface ScadaSignalItem {
  id: string;
  tag: string;
  type: 'TELEMETERING' | 'TELESIGNAL' | 'TELECOMMAND' | 'ALARM';
  nameFr: string;
  nameEn: string;
  unit?: string;
  nominalValue?: string;
  iec61850LNode?: string; // e.g. MMXU1, XCBR1, PTRC1
}

export interface ProtectionItem {
  id: string;
  ansiCode: string;
  nameFr: string;
  nameEn: string;
  functionDescFr: string;
  functionDescEn: string;
  tripTimeMs: number;
  relayType: string;
}

export interface FaultItem {
  id: string;
  code: string;
  nameFr: string;
  nameEn: string;
  consequencesFr: string;
  consequencesEn: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  primaryClearanceTimeMs: number;
}

export interface StandardItem {
  code: string;
  title: string;
  authority: 'IEC' | 'IEEE' | 'NF C' | 'ISO';
  clause: string;
  impactFr: string;
  impactEn: string;
}

export interface SimulationScenarioRef {
  id: string;
  titleFr: string;
  titleEn: string;
  tabId: string;
  descriptionFr: string;
  descriptionEn: string;
  initialCondition: string;
}

export interface CameroonGridEquivalent {
  siteName: string;
  gridSystem: 'RIS' | 'RIN' | 'ISOLATED';
  voltageLevel: string;
  operator: 'SONATREL' | 'Eneo' | 'EDC' | 'NHPC';
  apparatusCode: string;
  technicalContextFr: string;
  technicalContextEn: string;
  coordinates?: [number, number];
}

export interface ConnectedNodeLink {
  targetId: string;
  targetNameFr: string;
  targetNameEn: string;
  category: 'UPSTREAM' | 'DOWNSTREAM' | 'PROTECTION' | 'CONTROL' | 'COMMUNICATION' | 'STANDARD' | 'MAINTENANCE' | 'CAMEROON_REF';
  relationType: GraphRelationType;
  linkDescriptionFr: string;
  linkDescriptionEn: string;
  voltageOrRating?: string;
  badge?: string;
}

export interface KnowledgeGraphEntity {
  id: string;
  tag: string;
  nameFr: string;
  nameEn: string;
  category: 'TRANSFORMER' | 'CIRCUIT_BREAKER' | 'GENERATOR' | 'LINE' | 'DISCONNECTOR' | 'CELL_MV' | 'TGBT' | 'SOLAR_BESS' | 'UPS' | 'MOTOR' | 'RELAY';
  domainCode: string;
  voltageTier: string;
  iconName: string;
  
  // Pedagogical & Usage Levels
  summaryDiscoveryFr: string;
  summaryDiscoveryEn: string;
  summaryTechnicalFr: string;
  summaryTechnicalEn: string;
  summaryEngineeringFr: string;
  summaryEngineeringEn: string;

  // The 7 Fundamental Dimensions
  upstreamConnections: ConnectedNodeLink[];
  downstreamConnections: ConnectedNodeLink[];
  associatedProtections: ProtectionItem[];
  possibleFaults: FaultItem[];
  scadaSignals: ScadaSignalItem[];
  applicableStandards: StandardItem[];
  simulationScenarios: SimulationScenarioRef[];
  cameroonEquivalents: CameroonGridEquivalent[];

  // Causal Chain Model
  causalChain: CausalChainStep[];

  // Data Reliability & Traceability Layer
  traceability: DataTraceability;
}

export const KNOWLEDGE_GRAPH_ENTITIES: KnowledgeGraphEntity[] = [
  // =========================================================================
  // 1. TRANSFORMATEUR HTA / BT (Distribution MT/BT - 630 kVA)
  // =========================================================================
  {
    id: 'kg-trafo-hta-bt',
    tag: '==H1.T01',
    nameFr: 'Transformateur de Distribution HTA / BT (630 kVA - 30 kV / 400 V)',
    nameEn: 'MV/LV Distribution Transformer (630 kVA - 30 kV / 400 V)',
    category: 'TRANSFORMER',
    domainCode: 'D05',
    voltageTier: '30 kV / 400 V',
    iconName: 'Zap',

    summaryDiscoveryFr: 'Appareil statique à induction qui abaisse la moyenne tension 30 kV du réseau de distribution urbain ou rural à la basse tension 400V triphasée utilisable en toute sécurité par les bâtiments, ateliers et usines.',
    summaryDiscoveryEn: 'Static electromagnetic induction machine that steps down 30 kV medium voltage from the public distribution network into safe 400V three-phase low voltage for commercial buildings and facilities.',

    summaryTechnicalFr: 'Transformateur triphasé immergé dans l’huile minérale (ONAN) ou sec enrobé. Couplage Dyn11 avec neutre sorti. Tension de court-circuit Ucc = 4.0%. Conforme à la directive écoconception Tier 2 (pertes réduites P0/Pk selon CEI 60076).',
    summaryTechnicalEn: 'Three-phase oil-immersed (ONAN) or cast resin transformer. Dyn11 vector group with accessible neutral. Short-circuit impedance Ucc = 4.0%. Compliant with EcoDesign Tier 2 losses (IEC 60076-1).',

    summaryEngineeringFr: 'Courant nominal primaire I1n = 12.1 A, secondaire I2n = 909 A. Courant de court-circuit symétrique présumé aval Icc3 = 22.7 kA. Surveillance thermique DGPT2 (Dégagement gazeux, Pression, Température 2 seuils 85°C/95°C). Tenue au diélectrique à fréquence industrielle 70 kV 1 min.',
    summaryEngineeringEn: 'Rated primary current I1n = 12.1 A, secondary I2n = 909 A. Prospective downstream short-circuit current Icc3 = 22.7 kA. DGPT2 multifunction monitoring (Gas discharge, Pressure, Temperature alarms 85°C/95°C). Power frequency withstand 70 kV 1 min.',

    upstreamConnections: [
      {
        targetId: 'kg-cell-mv-30k',
        targetNameFr: 'Cellule Arrivée HTA 30 kV (Interrupteur-Fusibles / Disjoncteur)',
        targetNameEn: '30 kV MV Incoming Feeder Cell (Fused-Switch / Breaker)',
        category: 'UPSTREAM',
        relationType: 'ENERGY',
        linkDescriptionFr: 'Alimentation amont 30 kV issue du réseau de distribution HTA aérien/souterrain',
        linkDescriptionEn: 'Upstream 30 kV power supply from MV public distribution feeder',
        voltageOrRating: '30 kV / 400 A',
        badge: 'Amont HTA'
      },
      {
        targetId: 'kg-surge-arrester-30k',
        targetNameFr: 'Jeu de Parafoudres ZnO HTA 30 kV',
        targetNameEn: '30 kV MV Metal Oxide Surge Arresters (ZnO)',
        category: 'UPSTREAM',
        relationType: 'PROTECTION',
        linkDescriptionFr: 'Écrêtage des surtensions atmosphériques et ondes de foudre incidentes',
        linkDescriptionEn: 'Clamps atmospheric surge and lightning transient overvoltages',
        voltageOrRating: 'Uc = 36 kV / 10 kA',
        badge: 'Protection Foudre'
      }
    ],

    downstreamConnections: [
      {
        targetId: 'kg-tgbt-400v',
        targetNameFr: 'Tableau Général Basse Tension (TGBT 400 V / 1000 A)',
        targetNameEn: 'Main Low Voltage Switchboard (TGBT 400 V / 1000 A)',
        category: 'DOWNSTREAM',
        relationType: 'ENERGY',
        linkDescriptionFr: 'Liaison directe barres cuivre peignées ou câbles 1x630 mm² Al vers le disjoncteur général TGBT',
        linkDescriptionEn: 'Direct busbar trunking or cables feeding the main LV incoming circuit breaker',
        voltageOrRating: '400 V / 909 A',
        badge: 'Aval BT'
      }
    ],

    associatedProtections: [
      {
        id: 'prot-dgpt2',
        ansiCode: 'ANSI 63 / 49',
        nameFr: 'Relais Multifonction DGPT2 (Gaz, Pression, Température)',
        nameEn: 'DGPT2 Multifunction Relay (Gas, Pressure, Temperature)',
        functionDescFr: 'Détecte le dégagement gazeux lent (défaut naissant), la surpression brutale (arc interne) et la température d’huile.',
        functionDescEn: 'Detects slow gas generation, abrupt overpressure, and transformer oil overheat.',
        tripTimeMs: 40,
        relayType: 'Détecteur mécanique étanche monté sur cuve'
      },
      {
        id: 'prot-fuse-mv',
        ansiCode: 'ANSI 50/51',
        nameFr: 'Fusibles HTA à haut pouvoir de coupure (HPC 24/36 kV - 25A)',
        nameEn: 'Medium Voltage Current-Limiting Fuses (25A - 36 kV)',
        functionDescFr: 'Coupure ultra-rapide en moins de 10 ms sur court-circuit franc amont/interne du bobinage.',
        functionDescEn: 'Ultra-fast short-circuit fault interruption under 10 ms on internal winding faults.',
        tripTimeMs: 10,
        relayType: 'Fusible à percuteur CEI 60282-1'
      },
      {
        id: 'prot-relay-51n',
        ansiCode: 'ANSI 51N / 51G',
        nameFr: 'Protection Masse Cuve & Terre Restreinte Neutre',
        nameEn: 'Tank Earth Fault & Restricted Earth Fault (REF)',
        functionDescFr: 'Détecte tout amorçage entre les spires HT/BT et la masse métallique de la cuve mise à la terre.',
        functionDescEn: 'Detects any dielectric insulation breakdown between windings and grounded transformer tank.',
        tripTimeMs: 80,
        relayType: 'Relais tore de terre résiduel'
      }
    ],

    possibleFaults: [
      {
        id: 'flt-turn-short',
        code: 'F-TR-01',
        nameFr: 'Court-circuit entre spires d’un même enroulement',
        nameEn: 'Inter-turn winding short-circuit',
        consequencesFr: 'Échauffement localisé extrême, carbonisation de l’huile, décomposition gazeuse et risque d’incendie.',
        consequencesEn: 'Severe local hotspot, oil pyrolytic breakdown, gas accumulation, fire risk.',
        severity: 'CRITICAL',
        primaryClearanceTimeMs: 30
      },
      {
        id: 'flt-dielectric-flashover',
        code: 'F-TR-02',
        nameFr: 'Claquage diélectrique de l’isolant solide/huile',
        nameEn: 'Dielectric insulation puncture breakdown',
        consequencesFr: 'Arc électrique franc interne, surpression instantanée dans la cuve (déclenchement clapet de surpression).',
        consequencesEn: 'Violent internal arc, abrupt tank overpressure (pressure relief device burst).',
        severity: 'CRITICAL',
        primaryClearanceTimeMs: 15
      },
      {
        id: 'flt-thermal-overload',
        code: 'F-TR-03',
        nameFr: 'Surcharge continue prolongée (> 120% In)',
        nameEn: 'Prolonged thermal overload (> 120% In)',
        consequencesFr: 'Vieillissement accéléré du papier diélectrique (loi d’Arrhenius), déclenchement seuil T2 DGPT2.',
        consequencesEn: 'Accelerated thermal aging of insulation cellulose paper, DGPT2 Stage 2 trip.',
        severity: 'HIGH',
        primaryClearanceTimeMs: 1800000 // 30 min
      }
    ],

    scadaSignals: [
      {
        id: 'scada-tr-t-oil',
        tag: 'D05_TR01_TMP_OIL',
        type: 'TELEMETERING',
        nameFr: 'Température huile cuve haute',
        nameEn: 'Top oil tank temperature',
        unit: '°C',
        nominalValue: '62.4',
        iec61850LNode: 'STMP1'
      },
      {
        id: 'scada-tr-alarm-dgpt',
        tag: 'D05_TR01_ALM_DGPT',
        type: 'ALARM',
        nameFr: 'Alarme détection gaz Buchholz / DGPT2',
        nameEn: 'DGPT2 / Buchholz gas accumulation alarm',
        nominalValue: 'NORMAL',
        iec61850LNode: 'PTRC1'
      },
      {
        id: 'scada-tr-current-sec',
        tag: 'D05_TR01_I_SEC',
        type: 'TELEMETERING',
        nameFr: 'Courant moyen secondaire BT',
        nameEn: 'Secondary LV line current',
        unit: 'A',
        nominalValue: '540.2',
        iec61850LNode: 'MMXU1'
      }
    ],

    applicableStandards: [
      {
        code: 'IEC 60076-1',
        title: 'Power transformers - Part 1: General',
        authority: 'IEC',
        clause: 'Clauses 4-8: Ratings, temperature rise & dielectric limits',
        impactFr: 'Définit les échauffements maximaux admissibles (60K huile, 65K enroulements) et les impédances de court-circuit.',
        impactEn: 'Specifies maximum temperature rise limits and short-circuit impedance requirements.'
      },
      {
        code: 'NF C 15-100',
        title: 'Installations électriques à basse tension - Partie 4-41',
        authority: 'NF C',
        clause: 'Section 411: Protection contre les chocs électriques et régime de neutre',
        impactFr: 'Impose le schéma des liaisons à la terre (TT ou TN-S) et la coupure automatique au premier défaut.',
        impactEn: 'Mandates earthing system architecture (TT or TN-S) and automatic fault disconnection.'
      },
      {
        code: 'IEC 61936-1',
        title: 'Power installations exceeding 1 kV a.c. - Common rules',
        authority: 'IEC',
        clause: 'Clause 8: Protection against fire and environmental hazards',
        impactFr: 'Exige un bac de rétention d’huile diélectrique étanche avec extinction naturelle pare-flamme.',
        impactEn: 'Requires oil retention bund with flame-trap quenching grating.'
      }
    ],

    simulationScenarios: [
      {
        id: 'scen-tr-inrush',
        titleFr: 'Courant d’enclenchement transitoire magnétisant (Inrush)',
        titleEn: 'Transformer Inrush Current Magnetizing Transient',
        tabId: 'harmonic',
        descriptionFr: 'Visualisation de l’onde de courant apériodique asymétrique avec harmonique 2 lors de la mise sous tension à vide.',
        descriptionEn: 'Simulation of decaying asymmetric inrush current waveform rich in 2nd harmonic during no-load energization.',
        initialCondition: 'Tension à l’instant du passage par zéro (flux rémanent 0.7 T)'
      },
      {
        id: 'scen-tr-shortcircuit',
        titleFr: 'Court-circuit triphasé franc aux bornes BT',
        titleEn: 'Bolted Three-Phase Short-Circuit on Secondary Terminals',
        tabId: 'iec60909',
        descriptionFr: 'Calcul de la pointe de courant Ik" (22.7 kA) et contraintes électrodynamiques sur les bobinages (CEI 60909).',
        descriptionEn: 'Calculation of peak short-circuit current Ik" (22.7 kA) and electrodynamic forces on winding braces (IEC 60909).',
        initialCondition: 'Ucc = 4.0%, Puissance réseau amont Sk" = 250 MVA'
      }
    ],

    cameroonEquivalents: [
      {
        siteName: 'Postes Cabines Maçonnées & Postes H61 - Réseau Urbain Douala (Eneo / Camwater)',
        gridSystem: 'RIS',
        voltageLevel: '15 kV / 30 kV → 400 V',
        operator: 'Eneo',
        apparatusCode: 'POSTE-DLA-BONANJO-H61',
        technicalContextFr: 'Poste transformateur HTA/BT 30 kV / 400 V - 630 kVA desservant le plateau administratif et tertiaire de Bonanjo à Douala, raccordé sur la boucle HTA issue du poste source de Koumassi.',
        technicalContextEn: '630 kVA 30 kV / 400 V distribution transformer kiosk feeding the Bonanjo commercial district in Douala, supplied by the Koumassi 90/30 kV substation loop.',
        coordinates: [4.0435, 9.6845]
      },
      {
        siteName: 'Poste de Distribution Yaoundé Ville - Mvolyé (RIS)',
        gridSystem: 'RIS',
        voltageLevel: '30 kV → 400 V',
        operator: 'Eneo',
        apparatusCode: 'POSTE-YDE-MVOLYE-630',
        technicalContextFr: 'Unité compacte protégée par cellules étanches SF6 RMU assurant la continuité d’alimentation des infrastructures hospitalières et sanitaires.',
        technicalContextEn: 'Compact RMU-protected MV/LV transformer substation ensuring power reliability for hospital facilities.',
        coordinates: [3.8480, 11.5021]
      }
    ],

    causalChain: [
      {
        stepIndex: 1,
        entityId: 'kg-trafo-hta-bt',
        entityName: 'Transformateur 30 kV / 400 V',
        role: 'Équipement Source',
        actionFr: 'Subit un court-circuit interne franc entre spires primaires 30 kV',
        actionEn: 'Experiences an internal bolted winding turn-to-turn short-circuit',
        relationType: 'ENERGY',
        arrowLabelFr: 'Développe un arc interne dans l’huile',
        arrowLabelEn: 'Develops internal arc in dielectric oil',
        timingMs: 0
      },
      {
        stepIndex: 2,
        entityId: 'prot-dgpt2',
        entityName: 'Relais DGPT2 / Buchholz (63)',
        role: 'Organe de Détection',
        actionFr: 'Détecte la brutale surpression et le claquement du volet de gaz en 25 ms',
        actionEn: 'Detects abrupt pressure surge and gas flap deflection in 25 ms',
        relationType: 'PROTECTION',
        arrowLabelFr: 'Ferme son contact sec de déclenchement',
        arrowLabelEn: 'Closes instantaneous trip contact',
        timingMs: 25
      },
      {
        stepIndex: 3,
        entityId: 'kg-cell-mv-30k',
        entityName: 'Disjoncteur HTA 30 kV Amont',
        role: 'Organe de Manœuvre & Coupure',
        actionFr: 'Reçoit l’ordre de déclenchement via la bobine à émission de tension (MX)',
        actionEn: 'Receives open trip impulse via shunt release coil (MX)',
        relationType: 'CONTROL',
        arrowLabelFr: 'Déclenche l’ouverture des pôles',
        arrowLabelEn: 'Initiates breaker pole separation',
        timingMs: 45
      },
      {
        stepIndex: 4,
        entityId: 'kg-cell-mv-30k',
        entityName: 'Pôles à Coupure dans le Vide',
        role: 'Organe d’Isolation',
        actionFr: 'Éteint l’arc électrique sous vide au premier passage à zéro du courant',
        actionEn: 'Extinguishes vacuum arc at next natural zero current crossing',
        relationType: 'ENERGY',
        arrowLabelFr: 'Isole complètement le défaut',
        arrowLabelEn: 'Fully isolates faulted zone',
        timingMs: 65
      },
      {
        stepIndex: 5,
        entityId: 'scada-dispatch-sonatrel',
        entityName: 'Supervision SCADA / Dispatching',
        role: 'Télésignalisation & Notification',
        actionFr: 'Envoie la télésignalisation SOE « Déclenchement Protection DGPT2 TR-01 » avec horodatage 1 ms',
        actionEn: 'Broadcasts SOE alarm "DGPT2 Trip TR-01" with 1 ms timestamp',
        relationType: 'COMMUNICATION',
        arrowLabelFr: 'Alerte l’opérateur de quart',
        arrowLabelEn: 'Alerts control room engineer',
        timingMs: 70
      }
    ],

    traceability: {
      kind: 'DONNEE_RESEAU_VERIFIEE',
      source: 'Spécifications Techniques Eneo Cameroun / Norme CEI 60076 & CEI 61936',
      verifiedDate: '2026-06-15',
      confidenceScore: 98,
      editorialLead: 'Ing. M. Touré (Lead Commissioning & Distribution Systems)',
      standardReference: 'CEI 60076-1 / NF C 15-100 §411'
    }
  },

  // =========================================================================
  // 2. DISJONCTEUR DE LIGNE THT 225 kV (Poste Mangombé / Bekoko)
  // =========================================================================
  {
    id: 'kg-cb-sf6-225k',
    tag: '==E1.Q0',
    nameFr: 'Disjoncteur THT 225 kV à Autosoufflage SF6 (40 kA - 3150 A)',
    nameEn: '225 kV SF6 Auto-Puffer High-Voltage Circuit Breaker (40 kA - 3150 A)',
    category: 'CIRCUIT_BREAKER',
    domainCode: 'D04',
    voltageTier: '225 kV',
    iconName: 'Shield',

    summaryDiscoveryFr: 'Interrupteur de très haute sécurité capable d’interrompre des courants de court-circuit colossaux (40 000 ampères sous 225 000 volts) en quelques centièmes de seconde pour sauver le réseau national de l’effondrement.',
    summaryDiscoveryEn: 'Ultra-heavy-duty safety switch capable of interrupting colossal short-circuit currents (40,000 amps at 225,000 volts) within fractions of a second to prevent nationwide grid blackouts.',

    summaryTechnicalFr: 'Disjoncteur tripolaire pour poste ouvert AIS ou blindé GIS. Pression nominale de gaz SF6 à 20°C: 0.60 MPa. Séquence de manœuvre O - 0.3s - CO - 3min - CO. Commande oléopneumatique ou à ressort hélicoïdal à haute énergie emmagasinée.',
    summaryTechnicalEn: 'Three-pole circuit breaker for open AIS or GIS substations. Rated SF6 gas pressure at 20°C: 0.60 MPa. Operating duty cycle O - 0.3s - CO - 3min - CO. High-energy helical spring or hydropneumatic mechanism.',

    summaryEngineeringFr: 'Tension assignée Ur = 245 kV. Courant assigné de court-circuit Isc = 40 kA 1s ou 3s. Facteur de premier pôle qui coupe kpp = 1.3. Vitesse de rétablissement de la tension transitoire TRV selon CEI 62271-100 (uc = 422 kV, t3 = 100 µs). Temps d’ouverture mécanique 28 ms, temps d’élimination totale 50 ms.',
    summaryEngineeringEn: 'Rated voltage Ur = 245 kV. Rated short-circuit breaking current Isc = 40 kA 1s/3s. First-pole-to-clear factor kpp = 1.3. Transient recovery voltage TRV envelope per IEC 62271-100. Total break time 50 ms.',

    upstreamConnections: [
      {
        targetId: 'kg-disconnector-bus-225k',
        targetNameFr: 'Sectionneurs d’aiguillage Barres Q1 / Q2 (225 kV)',
        targetNameEn: '225 kV Busbar Selector Disconnectors Q1 / Q2',
        category: 'UPSTREAM',
        relationType: 'ENERGY',
        linkDescriptionFr: 'Raccordement amont aux jeux de barres principaux 225 kV du poste',
        linkDescriptionEn: 'Upstream connection to 225 kV main substation busbar system',
        voltageOrRating: '225 kV / 3150 A',
        badge: 'Jeu de Barres'
      }
    ],

    downstreamConnections: [
      {
        targetId: 'kg-line-225k-bekoko',
        targetNameFr: 'Ligne de Transport THT 225 kV (Songloulou - Bekoko)',
        targetNameEn: '225 kV High Voltage Transmission Line (Songloulou - Bekoko)',
        category: 'DOWNSTREAM',
        relationType: 'ENERGY',
        linkDescriptionFr: 'Départ ligne THT aérienne sur pylônes métalliques treillis avec câble de garde optique OPGW',
        linkDescriptionEn: 'Outgoing 225 kV overhead line corridor on steel lattice towers with OPGW shield wire',
        voltageOrRating: '225 kV / 1420 MW',
        badge: 'Ligne THT'
      }
    ],

    associatedProtections: [
      {
        id: 'prot-dist-21',
        ansiCode: 'ANSI 21 / 21N',
        nameFr: 'Protection Numérique de Distance (Sous-impédance 4 zones)',
        nameEn: 'Numerical Distance Protection Relay (4 Mho / Quad Zones)',
        functionDescFr: 'Calcule l’impédance de boucle de défaut Z = U/I et ordonne l’ouverture en Zone 1 (temps 0 ms + temps disjoncteur).',
        functionDescEn: 'Calculates loop impedance Z = U/I and triggers Zone 1 trip (instantaneous + breaker time).',
        tripTimeMs: 20,
        relayType: 'Relais numérique multifonction IEC 61850'
      },
      {
        id: 'prot-diff-87l',
        ansiCode: 'ANSI 87L',
        nameFr: 'Protection Différentielle de Ligne par Fibre Optique OPGW',
        nameEn: 'Line Current Differential Protection via OPGW Fiber',
        functionDescFr: 'Compare les vecteurs de courants aux deux extrémités (Songloulou et Bekoko) via canal télécom sécurisé.',
        functionDescEn: 'Compares vector currents at both ends (Songloulou & Bekoko) via dedicated fiber channel.',
        tripTimeMs: 15,
        relayType: 'Relais différentiel numérique optique'
      },
      {
        id: 'prot-breaker-fail-50bf',
        ansiCode: 'ANSI 50BF',
        nameFr: 'Protection Défaillance Disjoncteur (Breaker Failure)',
        nameEn: 'Breaker Failure Protection (50BF)',
        functionDescFr: 'Si le courant de défaut persiste 150 ms après l’ordre de déclenchement, ordonne l’ouverture de tous les disjoncteurs adjacents de la barre.',
        functionDescEn: 'If fault current persists 150 ms after trip order, initiates backup tripping of all adjacent busbar breakers.',
        tripTimeMs: 150,
        relayType: 'Automate logique de travée'
      }
    ],

    possibleFaults: [
      {
        id: 'flt-cb-restrike',
        code: 'F-CB-01',
        nameFr: 'Réamorçage tardif d’arc à la coupure (Restrike)',
        nameEn: 'Restrike / Re-ignition across separating contacts',
        consequencesFr: 'Génération de surtensions de manœuvre à front raide, risque d’explosion de la chambre de coupure SF6.',
        consequencesEn: 'Steep-front switching surge generation, risk of SF6 interrupter catastrophic chamber burst.',
        severity: 'CRITICAL',
        primaryClearanceTimeMs: 40
      },
      {
        id: 'flt-sf6-leak',
        code: 'F-CB-02',
        nameFr: 'Fuite lente de gaz SF6 (Perte de densité)',
        nameEn: 'Slow SF6 gas leak (Density loss)',
        consequencesFr: 'Alarme au seuil 1 (0.52 MPa), puis blocage automatique des manœuvres au seuil 2 (0.50 MPa) pour éviter la destruction.',
        consequencesEn: 'Stage 1 alarm at 0.52 MPa, trip lockout at Stage 2 (0.50 MPa) to prevent destructive arc extinction failure.',
        severity: 'HIGH',
        primaryClearanceTimeMs: 0
      }
    ],

    scadaSignals: [
      {
        id: 'scada-cb-pos',
        tag: 'D04_BKKO_Q0_POS',
        type: 'TELESIGNAL',
        nameFr: 'Position double contact (Ouvert / Fermé)',
        nameEn: 'Double-point contact position status',
        nominalValue: 'FERMÉ (CLOSED)',
        iec61850LNode: 'XCBR1.Pos'
      },
      {
        id: 'scada-cb-sf6-dens',
        tag: 'D04_BKKO_Q0_SF6',
        type: 'TELEMETERING',
        nameFr: 'Densité / Pression compensée SF6',
        nameEn: 'Temperature-compensated SF6 pressure',
        unit: 'MPa',
        nominalValue: '0.61',
        iec61850LNode: 'SIMG1'
      },
      {
        id: 'scada-cb-cmd-open',
        tag: 'D04_BKKO_Q0_CMD_OPN',
        type: 'TELECOMMAND',
        nameFr: 'Télécommande d’ouverture disjoncteur',
        nameEn: 'Breaker remote open command',
        iec61850LNode: 'CSWI1.Opn'
      }
    ],

    applicableStandards: [
      {
        code: 'IEC 62271-100',
        title: 'High-voltage switchgear and controlgear - Part 100: Alternating-current circuit-breakers',
        authority: 'IEC',
        clause: 'Clauses 6.101-6.111: Short-circuit breaking and making tests',
        impactFr: 'Définit les séquences d’essais types de coupure en court-circuit, défaut en ligne proche et discordance de phases.',
        impactEn: 'Defines type-testing routines for short-circuit interruption, short-line faults, and out-of-phase switching.'
      },
      {
        code: 'IEC 62271-4',
        title: 'Handling procedures for sulphur hexafluoride (SF6) and its mixtures',
        authority: 'IEC',
        clause: 'Section 5: Gas recovery, tightness and environmental control',
        impactFr: 'Régule la manipulation du gaz SF6, le taux de fuite annuel garanti inférieur à 0.5% par an et le recyclage.',
        impactEn: 'Regulates SF6 gas handling, requiring certified annual leakage rate below 0.5% per annum.'
      }
    ],

    simulationScenarios: [
      {
        id: 'scen-cb-trv',
        titleFr: 'Tension de rétablissement transitoire (TRV) sur défaut proche',
        titleEn: 'Transient Recovery Voltage (TRV) under Short-Line Fault',
        tabId: 'harmonic',
        descriptionFr: 'Analyse des oscillations haute fréquence de tension aux bornes du pôle après l’extinction de l’arc.',
        descriptionEn: 'High-frequency oscillation analysis of pole recovery voltage immediately following arc extinction.',
        initialCondition: 'Défaut kilométrique à 2 km du poste sous 36 kA'
      }
    ],

    cameroonEquivalents: [
      {
        siteName: 'Poste d’Interconnexion THT Bekoko 225/90/30 kV (SONATREL - RIS)',
        gridSystem: 'RIS',
        voltageLevel: '225 kV',
        operator: 'SONATREL',
        apparatusCode: 'BKKO-225-Q0-L-SONG',
        technicalContextFr: 'Disjoncteur 225 kV tête de ligne assurant le transit de plus de 300 MW issus du complexe hydroélectrique de Songloulou vers la métropole économique de Douala.',
        technicalContextEn: '225 kV line terminal circuit breaker transmitting over 300 MW from Songloulou hydro complex to the industrial hub of Douala.',
        coordinates: [4.1480, 9.6105]
      },
      {
        siteName: 'Poste d’Évacuation Centrale Nachtigal 225 kV (NHPC / SONATREL)',
        gridSystem: 'RIS',
        voltageLevel: '225 kV',
        operator: 'SONATREL',
        apparatusCode: 'NCHT-225-Q0-BAY01',
        technicalContextFr: 'Appareillage blindé GIS 225 kV évacuant les 420 MW de la nouvelle centrale hydroélectrique de Nachtigal vers Yaoundé et le RIS.',
        technicalContextEn: '225 kV GIS switchgear evacuating 420 MW from the Nachtigal hydropower scheme to Yaounde and the southern grid.',
        coordinates: [4.3520, 11.6420]
      }
    ],

    causalChain: [
      {
        stepIndex: 1,
        entityId: 'kg-line-225k-bekoko',
        entityName: 'Ligne 225 kV Songloulou - Bekoko',
        role: 'Élément Réseau en Défaut',
        actionFr: 'Impact de foudre direct provoquant un contournement d’isolateur phase-terre',
        actionEn: 'Direct lightning flashover causing phase-to-ground insulator string puncture',
        relationType: 'ENERGY',
        arrowLabelFr: 'Génère une onde de choc de courant',
        arrowLabelEn: 'Generates fault current traveling wave',
        timingMs: 0
      },
      {
        stepIndex: 2,
        entityId: 'prot-dist-21',
        entityName: 'Relais de Distance Numérique 21',
        role: 'Calcul d’Impédance & Détection',
        actionFr: 'Mesure la chute d’impédance en Zone 1 (80% de ligne) et valide le défaut en 18 ms',
        actionEn: 'Measures Zone 1 impedance drop (80% line reach) and confirms fault in 18 ms',
        relationType: 'PROTECTION',
        arrowLabelFr: 'Émet le message GOOSE de déclenchement',
        arrowLabelEn: 'Publishes IEC 61850 GOOSE trip telegram',
        timingMs: 18
      },
      {
        stepIndex: 3,
        entityId: 'kg-cb-sf6-225k',
        entityName: 'Disjoncteur SF6 225 kV (Bobine TC1)',
        role: 'Réception d’Ordre & Commande',
        actionFr: 'La bobine de déclenchement libère le verrouillage mécanique à ressort',
        actionEn: 'Trip coil releases operating spring mechanical latch',
        relationType: 'CONTROL',
        arrowLabelFr: 'Propulse les contacts mobiles',
        arrowLabelEn: 'Accelerates moving contacts',
        timingMs: 26
      },
      {
        stepIndex: 4,
        entityId: 'kg-cb-sf6-225k',
        entityName: 'Chambre de Coupure SF6',
        role: 'Extinction de l’Arc Électrique',
        actionFr: 'Le soufflage thermique et mécanique comprime le SF6 et souffle l’arc à 40 ms',
        actionEn: 'Auto-puffer thermal expansion blasts SF6, quenching arc at 40 ms',
        relationType: 'ENERGY',
        arrowLabelFr: 'Rétablit l’isolement diélectrique',
        arrowLabelEn: 'Restores open dielectric barrier',
        timingMs: 48
      },
      {
        stepIndex: 5,
        entityId: 'auto-reclose-79',
        entityName: 'Automatisme de Réenclenchement (79)',
        role: 'Cycle de Réenclenchement Monophasé',
        actionFr: 'Après un temps mort de 300 ms (déionisation de l’air), réenclenche avec succès si le défaut était fugitif',
        actionEn: 'After 300 ms dead time for de-ionization, successfully auto-recloses on transient fault',
        relationType: 'CONTROL',
        arrowLabelFr: 'Rétablit le transit d’énergie',
        arrowLabelEn: 'Restores power transmission flow',
        timingMs: 350
      }
    ],

    traceability: {
      kind: 'DONNEE_RESEAU_VERIFIEE',
      source: 'Cahier des Prescriptions Techniques SONATREL 225 kV / CEI 62271-100',
      verifiedDate: '2026-07-20',
      confidenceScore: 99,
      editorialLead: 'Ing. M. Touré (Lead Substation & High-Voltage Apparatus)',
      standardReference: 'CEI 62271-100 / CEI 61850-7-4'
    }
  },

  // =========================================================================
  // 3. ALTERNATEUR SYNCHRONE HYDROÉLECTRIQUE (Songloulou G1 - 48 MVA)
  // =========================================================================
  {
    id: 'kg-gen-hydro-48mva',
    tag: '--G01',
    nameFr: 'Alternateur Synchrone Hydroélectrique G1 (48 MVA - 10.5 kV - 150 tr/min)',
    nameEn: 'Hydro Synchronous Generator Unit G1 (48 MVA - 10.5 kV - 150 rpm)',
    category: 'GENERATOR',
    domainCode: 'D01',
    voltageTier: '10.5 kV',
    iconName: 'Activity',

    summaryDiscoveryFr: 'Cœur de la production d’énergie verte : cette turbine hydraulique transforme la force du fleuve Sanaga en électricité à haute puissance (40 mégawatts par groupe), alimentant les foyers et les industries du Cameroun.',
    summaryDiscoveryEn: 'Clean power generation core: converts the kinetic hydraulic energy of the Sanaga river into massive electricity (40 MW per unit), powering Cameroonian homes and industries.',

    summaryTechnicalFr: 'Alternateur synchrone triphasé vertical à pôles saillants (40 pôles, 50 Hz). Entraîné par turbine Francis sous 39 mètres de chute. Système d’excitation statique à thyristors avec régulateur automatique de tension (AVR). Neutre mis à la terre par résistance.',
    summaryTechnicalEn: 'Vertical salient-pole 3-phase synchronous alternator (40 poles, 50 Hz). Francis hydro turbine driven under 39 m head. Static thyristor excitation system with Automatic Voltage Regulator (AVR). Resistor neutral grounding.',

    summaryEngineeringFr: 'Sn = 48 MVA, Pn = 40.8 MW, cos φ = 0.85, Un = 10.5 kV, In = 2639 A. Constante d’inertie H = 3.85 s. Réactance synchrone longitudinale Xd = 1.15 pu, transitoire X’d = 0.32 pu, subtransitoire X"d = 0.22 pu. PSS (Power System Stabilizer) intégré pour amortir les oscillations inter-zones.',
    summaryEngineeringEn: 'Sn = 48 MVA, Pn = 40.8 MW, PF = 0.85, Un = 10.5 kV, In = 2639 A. Inertia constant H = 3.85 s. Reactances: Xd = 1.15 pu, X’d = 0.32 pu, X"d = 0.22 pu. Equipped with integrated PSS for inter-area oscillation damping.',

    upstreamConnections: [
      {
        targetId: 'kg-turbine-francis',
        targetNameFr: 'Turbine Hydraulique Francis (39 m de chute - 120 m³/s)',
        targetNameEn: 'Francis Hydraulic Water Turbine (39 m head - 120 m³/s)',
        category: 'UPSTREAM',
        relationType: 'ENERGY',
        linkDescriptionFr: 'Couple mécanique transmis par l’arbre vertical d’accouplement rigide',
        linkDescriptionEn: 'Mechanical shaft torque delivered via rigid vertical coupling shaft',
        voltageOrRating: '42 MW méca / 150 RPM',
        badge: 'Énergie Primaire'
      }
    ],

    downstreamConnections: [
      {
        targetId: 'kg-trafo-gsu-songloulou',
        targetNameFr: 'Transformateur Élévateur de Bloc GSU (10.5 / 225 kV - 80 MVA)',
        targetNameEn: 'Generator Step-Up Unit GSU (10.5 / 225 kV - 80 MVA)',
        category: 'DOWNSTREAM',
        relationType: 'ENERGY',
        linkDescriptionFr: 'Gaine à barres isolées sous enveloppe métallique blindée (IPB) 10.5 kV',
        linkDescriptionEn: '10.5 kV Isolated Phase Bus (IPB) connection to GSU primary windings',
        voltageOrRating: '10.5 kV / 2639 A',
        badge: 'Élévation GSU'
      }
    ],

    associatedProtections: [
      {
        id: 'prot-gen-diff-87g',
        ansiCode: 'ANSI 87G',
        nameFr: 'Protection Différentielle Alternateur',
        nameEn: 'Generator Stator Differential Protection (87G)',
        functionDescFr: 'Supervise l’équilibre vectoriel des courants entre neutre et bornes phase de la machine.',
        functionDescEn: 'Monitors vector current balance between neutral and phase terminals.',
        tripTimeMs: 15,
        relayType: 'Relais numérique de protection machine synchrone'
      },
      {
        id: 'prot-gen-loss-40',
        ansiCode: 'ANSI 40',
        nameFr: 'Protection Perte d’Excitation (Sous-impédance)',
        nameEn: 'Loss of Field / Excitation Protection (40)',
        functionDescFr: 'Détecte le glissement de pôle et l’absorption massive de puissance réactive lors d’une défaillance AVR.',
        functionDescEn: 'Detects pole slipping and massive reactive power absorption upon AVR failure.',
        tripTimeMs: 100,
        relayType: 'Caractéristique circulaire d’impédance mho offset'
      },
      {
        id: 'prot-gen-neg-46',
        ansiCode: 'ANSI 46',
        nameFr: 'Protection Déséquilibre de Phase & Courant Inverse (I2)',
        nameEn: 'Negative Sequence Overcurrent Protection (46)',
        functionDescFr: 'Protège le rotor contre les échauffements destructeurs causés par les courants inverses (I2²t = constante).',
        functionDescEn: 'Shields rotor teeth against destructive overheating from unbalanced stator negative phase sequence.',
        tripTimeMs: 250,
        relayType: 'Filtre de courant composante inverse'
      }
    ],

    possibleFaults: [
      {
        id: 'flt-stator-earth',
        code: 'F-GEN-01',
        nameFr: 'Défaut phase-terre statorique à 100% de bobinage',
        nameEn: '100% Stator Ground / Earth Fault (3rd Harmonic / Sub-harmonic injection)',
        consequencesFr: 'Courant de fuite à la terre, dégradation locale des tôles magnétiques statoriques.',
        consequencesEn: 'Stator core local lamination melting, severe ground leakage current.',
        severity: 'CRITICAL',
        primaryClearanceTimeMs: 20
      },
      {
        id: 'flt-overspeed-12',
        code: 'F-GEN-02',
        nameFr: 'Survitesse d’emballement par délestage brutal de charge',
        nameEn: 'Turbine runaway overspeed following full load rejection',
        consequencesFr: 'Montée en vitesse jusqu’à 1.8 x Nn (270 tr/min), forces centrifuges majeures sur les pôles rotoriques.',
        consequencesEn: 'Speed climb up to 1.8 x rated (270 rpm), massive centrifugal stress on rotor poles.',
        severity: 'CRITICAL',
        primaryClearanceTimeMs: 50
      }
    ],

    scadaSignals: [
      {
        id: 'scada-gen-p',
        tag: 'D01_SONG_G1_MW',
        type: 'TELEMETERING',
        nameFr: 'Puissance active injectée P',
        nameEn: 'Active power output',
        unit: 'MW',
        nominalValue: '40.2',
        iec61850LNode: 'MMXU1.TotW'
      },
      {
        id: 'scada-gen-q',
        tag: 'D01_SONG_G1_MVAR',
        type: 'TELEMETERING',
        nameFr: 'Puissance réactive injectée Q',
        nameEn: 'Reactive power output',
        unit: 'Mvar',
        nominalValue: '12.8',
        iec61850LNode: 'MMXU1.TotVAr'
      },
      {
        id: 'scada-gen-freq',
        tag: 'D01_SONG_G1_HZ',
        type: 'TELEMETERING',
        nameFr: 'Fréquence rotorique statorique',
        nameEn: 'Electrical stator frequency',
        unit: 'Hz',
        nominalValue: '50.02',
        iec61850LNode: 'MMXU1.Hz'
      }
    ],

    applicableStandards: [
      {
        code: 'IEC 60034-1',
        title: 'Rotating electrical machines - Part 1: Rating and performance',
        authority: 'IEC',
        clause: 'Clauses 8-12: Thermal classes, temperature rise and efficiency',
        impactFr: 'Définit les classes d’isolation thermique (Classe F exploitée en Classe B) pour garantir 40 ans de durée de vie.',
        impactEn: 'Defines thermal insulation classes and temperature rise tolerances for long operating life.'
      },
      {
        code: 'IEEE Std C37.102',
        title: 'IEEE Guide for AC Generator Protection',
        authority: 'IEEE',
        clause: 'Sections 4-6: Stator, rotor and prime-mover protection schemes',
        impactFr: 'Guide de référence mondial pour la coordination des seuils différentiels, d’excitation et de sous-fréquence.',
        impactEn: 'Global engineering benchmark for stator, rotor, and loss-of-excitation protective coordination.'
      }
    ],

    simulationScenarios: [
      {
        id: 'scen-gen-trip-40mw',
        titleFr: 'Perte subite d’un groupe 40 MW & impact sur la fréquence RIS',
        titleEn: 'Loss of 40 MW Generation Unit & RIS Grid Frequency Dip',
        tabId: 'harmonic',
        descriptionFr: 'Simulation du creux dynamique de fréquence (Nadir f = 49.2 Hz) et mobilisation de la réserve primaire des autres centrales.',
        descriptionEn: 'Simulation of dynamic frequency nadir (49.2 Hz) and primary governor spinning reserve response across Cameroon grid.',
        initialCondition: 'Réseau RIS en pointe de 1250 MW, groupe G1 à pleine charge'
      }
    ],

    cameroonEquivalents: [
      {
        siteName: 'Centrale Hydroélectrique de Songloulou (Fleuve Sanaga - 384 MW)',
        gridSystem: 'RIS',
        voltageLevel: '10.5 kV / 225 kV',
        operator: 'Eneo',
        apparatusCode: 'SONG-G1-48MVA',
        technicalContextFr: 'Groupe G1 d’une des plus grandes centrales d’Afrique Centrale, clé de voûte de la stabilité fréquence/tension du Réseau Interconnecté Sud.',
        technicalContextEn: 'Unit G1 in one of Central Africa’s largest hydro schemes, baseline frequency anchor for the southern network.',
        coordinates: [4.2250, 10.3550]
      },
      {
        siteName: 'Centrale Hydroélectrique de Memve’ele (Fleuve Ntem - 211 MW)',
        gridSystem: 'RIS',
        voltageLevel: '11 kV / 225 kV',
        operator: 'EDC',
        apparatusCode: 'MMV-GEN-52MVA',
        technicalContextFr: '4 groupes de 52.7 MVA évacuant l’énergie vers Yaoundé et le Sud via la ligne 225 kV Memve’ele - Nomayos.',
        technicalContextEn: 'Four 52.7 MVA hydro-generators feeding the southern grid via the Memve’ele-Nomayos 225 kV transmission line.',
        coordinates: [2.3980, 10.3850]
      }
    ],

    causalChain: [
      {
        stepIndex: 1,
        entityId: 'kg-gen-hydro-48mva',
        entityName: 'Alternateur G1 (Stator)',
        role: 'Appareil Source',
        actionFr: 'Apparition d’un défaut d’isolement interne entre phase et neutre statorique',
        actionEn: 'Internal dielectric breakdown between stator phase winding and machine neutral',
        relationType: 'ENERGY',
        arrowLabelFr: 'Crée un déséquilibre de courant différentiel',
        arrowLabelEn: 'Creates differential residual current',
        timingMs: 0
      },
      {
        stepIndex: 2,
        entityId: 'prot-gen-diff-87g',
        entityName: 'Relais Différentiel Machine 87G',
        role: 'Détection Haute Sensibilité',
        actionFr: 'Détecte le courant différentiel Id > 0.05 In en 12 ms sans temporisation',
        actionEn: 'Detects differential current Id > 0.05 In in 12 ms without intentional delay',
        relationType: 'PROTECTION',
        arrowLabelFr: 'Active le relais de désexcitation rapide',
        arrowLabelEn: 'Triggers field discharge breaker',
        timingMs: 12
      },
      {
        stepIndex: 3,
        entityId: 'de-excitation-cb',
        entityName: 'Disjoncteur de Champ Rotor (Désexcitation)',
        role: 'Extinction de Flux Magnétique',
        actionFr: 'Ouvre le circuit d’excitation et décharge le rotor dans une résistance d’extinction',
        actionEn: 'Opens rotor circuit and dissipates magnetizing energy into crowbar resistor',
        relationType: 'CONTROL',
        arrowLabelFr: 'Annule la force électromotrice interne',
        arrowLabelEn: 'Collapses internal induced EMF',
        timingMs: 30
      },
      {
        stepIndex: 4,
        entityId: 'kg-cb-sf6-225k',
        entityName: 'Disjoncteur de Groupe T1 / G1',
        role: 'Déconnexion du Réseau',
        actionFr: 'Ouvre ses pôles pour séparer la machine en défaut du réseau 225 kV',
        actionEn: 'Opens main contacts to disconnect faulted unit from 225 kV system',
        relationType: 'ENERGY',
        arrowLabelFr: 'Isole l’alternateur du réseau interconnecté',
        arrowLabelEn: 'Isolates generator from interconnected grid',
        timingMs: 50
      },
      {
        stepIndex: 5,
        entityId: 'turbine-governor-vanne',
        entityName: 'Régulateur de Vitesse & Directrices',
        role: 'Sécurité Mécanique',
        actionFr: 'Ferme d’urgence les directrices de la turbine Francis pour éviter l’emballement hydraulique',
        actionEn: 'Initiates emergency wicket gate closure on Francis turbine to prevent runaway overspeed',
        relationType: 'CONTROL',
        arrowLabelFr: 'Arrête l’injection d’eau',
        arrowLabelEn: 'Halts water flow',
        timingMs: 180
      }
    ],

    traceability: {
      kind: 'DONNEE_RESEAU_VERIFIEE',
      source: 'Fiche Constructeur Alstom Hydro / Manuel d’Exploitation Songloulou Eneo',
      verifiedDate: '2026-05-10',
      confidenceScore: 97,
      editorialLead: 'Ing. M. Touré (Hydropower Generation & Grid Stability)',
      standardReference: 'CEI 60034-1 / IEEE C37.102'
    }
  },

  // =========================================================================
  // 4. TABLEAU GÉNÉRAL BASSE TENSION - TGBT 400 V (Distribution Industrielle)
  // =========================================================================
  {
    id: 'kg-tgbt-400v',
    tag: '==TGBT.MAIN',
    nameFr: 'Tableau Général Basse Tension (TGBT Forme 4b - 400 V - 3200 A - 65 kA)',
    nameEn: 'Main Low-Voltage Switchboard (Form 4b - 400 V - 3200 A - 65 kA)',
    category: 'TGBT',
    domainCode: 'D06',
    voltageTier: '400 V / 230 V',
    iconName: 'Layers',

    summaryDiscoveryFr: 'Tableau électrique principal d’un bâtiment ou site industriel, assurant le comptage, la protection et la distribution de l’énergie électrique basse tension vers tous les départs divisionnaires et charges.',
    summaryDiscoveryEn: 'Primary electrical switchboard of an industrial or commercial facility, providing power metering, protection, and multi-circuit distribution to sub-panels and critical loads.',

    summaryTechnicalFr: 'Ensemble d’appareillage sous enveloppe métallique certifié CEI 61439-1 & 2. Indice de protection IP43/IK10. Ségrégation interne Forme 4b (séparation totale des jeux de barres, unités fonctionnelles et bornes de raccordement client).',
    summaryTechnicalEn: 'Factory-assembled power switchgear verified to IEC 61439-1/2. IP43/IK10 protection rating. Form 4b internal segregation (complete separation of busbars, functional units, and cable terminals).',

    summaryEngineeringFr: 'Tension assignée d’isolement Ui = 1000 V AC. Courant de courte durée admissible Icw = 65 kA 1s. Échauffement jeu de barres cuivre peigné testé selon CEI 61439-1 Tableau 8. Équipé d’un disjoncteur général ACB électronique avec déclencheur MicroLogic / Ekip.',
    summaryEngineeringEn: 'Rated insulation voltage Ui = 1000 V AC. Short-time withstand current Icw = 65 kA 1s. Busbar temperature rise fully type-tested per IEC 61439-1. Master Air Circuit Breaker with advanced electronic trip unit.',

    upstreamConnections: [
      {
        targetId: 'kg-trafo-hta-bt',
        targetNameFr: 'Transformateur HTA / BT (630 kVA ou 1600 kVA)',
        targetNameEn: 'MV/LV Distribution Transformer (630 kVA or 1600 kVA)',
        category: 'UPSTREAM',
        relationType: 'ENERGY',
        linkDescriptionFr: 'Alimentation principale issue du secondaire du transformateur de distribution',
        linkDescriptionEn: 'Main incoming power from distribution transformer secondary terminals',
        voltageOrRating: '400 V / 909 A ou 2309 A',
        badge: 'Source Normale'
      },
      {
        targetId: 'kg-genset-backup-ats',
        targetNameFr: 'Groupe Électrogène Diesel de Secours avec ATS (Inverseur)',
        targetNameEn: 'Diesel Backup Genset with Automatic Transfer Switch (ATS)',
        category: 'UPSTREAM',
        relationType: 'CONTROL',
        linkDescriptionFr: 'Source de remplacement basculant automatiquement en moins de 10 s en cas de coupure réseau',
        linkDescriptionEn: 'Emergency alternate source auto-transferred within 10s upon main grid failure',
        voltageOrRating: '400 V / 500 kVA',
        badge: 'Source Secours'
      }
    ],

    downstreamConnections: [
      {
        targetId: 'kg-motor-ind-250k',
        targetNameFr: 'Départ Moteur Asynchrone Industriel (250 kW / 400 V)',
        targetNameEn: 'Industrial Induction Motor Feeder (250 kW / 400 V)',
        category: 'DOWNSTREAM',
        relationType: 'ENERGY',
        linkDescriptionFr: 'Départ moteur direct ou variateur de vitesse VFD protégé par disjoncteur magnétothermique',
        linkDescriptionEn: 'Direct-on-line or variable frequency drive feeder protected by MCCB',
        voltageOrRating: '400 V / 440 A',
        badge: 'Force Motrice'
      },
      {
        targetId: 'kg-ups-datacenter',
        targetNameFr: 'Chaîne Onduleur Sans Interruption ASI / UPS (120 kVA)',
        targetNameEn: 'Uninterruptible Power Supply UPS System (120 kVA)',
        category: 'DOWNSTREAM',
        relationType: 'ENERGY',
        linkDescriptionFr: 'Alimentation des baies serveurs, automates programmables et systèmes SCADA',
        linkDescriptionEn: 'Clean power supply for critical IT servers, PLCs, and SCADA monitoring',
        voltageOrRating: '400 V / 173 A',
        badge: 'Charges Sensibles'
      }
    ],

    associatedProtections: [
      {
        id: 'prot-acb-micrologic',
        ansiCode: 'ANSI 50/51/51N',
        nameFr: 'Déclencheur Électronique Disjoncteur Général (LSI + G)',
        nameEn: 'Electronic Trip Unit (Long, Short, Instantaneous + Ground Fault)',
        functionDescFr: 'Sélectivité ampèremétrique et chronométrique totale avec les disjoncteurs divisionnaires avals.',
        functionDescEn: 'Provides total current and time selectivity with downstream feeder circuit breakers.',
        tripTimeMs: 50,
        relayType: 'Déclencheur électronique à microprocesseur avec mesure de puissance'
      },
      {
        id: 'prot-surge-type1',
        ansiCode: 'ANSI 37 / Parafoudre',
        nameFr: 'Parafoudre Basse Tension Type 1+2 (Iimp = 25 kA / pôle)',
        nameEn: 'Type 1+2 Low Voltage Surge Protective Device (SPD)',
        functionDescFr: 'Évacue les courants de foudre résiduels conduits depuis la ligne HTA et le transformateur.',
        functionDescEn: 'Diverts residual lightning currents conducted from the upstream grid to earth.',
        tripTimeMs: 25,
        relayType: 'Parafoudre à varistance oxyde de zinc ZnO + éclateur'
      }
    ],

    possibleFaults: [
      {
        id: 'flt-busbar-arc',
        code: 'F-TGBT-01',
        nameFr: 'Défaut d’arc électrique interne entre jeux de barres (Arc Flash)',
        nameEn: 'Internal Arcing Fault between Main Copper Busbars (Arc Flash)',
        consequencesFr: 'Onde de surpression violente, énergie incidente calorifique > 40 cal/cm², risque corporel mortel sans EPI.',
        consequencesEn: 'Violent pressure blast, incident thermal energy > 40 cal/cm², severe personnel flash burn hazard.',
        severity: 'CRITICAL',
        primaryClearanceTimeMs: 40
      },
      {
        id: 'flt-terminal-loose',
        code: 'F-TGBT-02',
        nameFr: 'Desserrage de connexion boulonnée sur départ de forte puissance',
        nameEn: 'Loose bolted terminal connection on high-current feeder',
        consequencesFr: 'Résistance de contact accrue ($R_c$), surchauffe par effet Joule ($P = R I^2$), inflammation de l’isolant câble.',
        consequencesEn: 'High contact resistance, Joule heating hotspot ($P = R I^2$), cable insulation fire risk.',
        severity: 'HIGH',
        primaryClearanceTimeMs: 0
      }
    ],

    scadaSignals: [
      {
        id: 'scada-tgbt-i-tot',
        tag: 'D06_TGBT_I_TOT',
        type: 'TELEMETERING',
        nameFr: 'Courant total d’arrivée incomer',
        nameEn: 'Total incoming line current',
        unit: 'A',
        nominalValue: '1850.4',
        iec61850LNode: 'MMXU1.A'
      },
      {
        id: 'scada-tgbt-cosphi',
        tag: 'D06_TGBT_PF',
        type: 'TELEMETERING',
        nameFr: 'Facteur de puissance général cos φ',
        nameEn: 'Overall switchboard power factor',
        nominalValue: '0.94',
        iec61850LNode: 'MMXU1.PF'
      },
      {
        id: 'scada-tgbt-thdu',
        tag: 'D06_TGBT_THD_U',
        type: 'TELEMETERING',
        nameFr: 'Taux de distorsion harmonique en tension THDu',
        nameEn: 'Voltage total harmonic distortion THDu',
        unit: '%',
        nominalValue: '2.1',
        iec61850LNode: 'MHAI1.ThdVal'
      }
    ],

    applicableStandards: [
      {
        code: 'IEC 61439-1 & 2',
        title: 'Low-voltage switchgear and controlgear assemblies - Part 2: Power switchgear and controlgear assemblies',
        authority: 'IEC',
        clause: 'Clauses 10 & 11: Design verification and routine verification',
        impactFr: 'Impose les 13 vérifications de conception (échauffement, tenue aux courts-circuits, isolement, distances).',
        impactEn: 'Mandates 13 rigorous design verifications (temperature rise, short-circuit withstand, clearances).'
      },
      {
        code: 'NF C 15-100',
        title: 'Installations électriques à basse tension - Règles',
        authority: 'NF C',
        clause: 'Partie 5-52: Choix et mise en œuvre des canalisations',
        impactFr: 'Régule le dimensionnement des câbles, la chute de tension maximale admissible et les schémas de mise à la terre.',
        impactEn: 'Regulates cable sizing, maximum allowable voltage drops, and earth protection methods.'
      },
      {
        code: 'IEEE Std 1584-2018',
        title: 'IEEE Guide for Performing Arc-Flash Hazard Calculations',
        authority: 'IEEE',
        clause: 'Section 4: Incident energy and arc flash protection boundary',
        impactFr: 'Définit les formules de calcul de l’énergie incidente (cal/cm²) et le périmètre de sécurité autour du TGBT.',
        impactEn: 'Defines mathematical calculation of incident arc energy and minimum boundary clearance.'
      }
    ],

    simulationScenarios: [
      {
        id: 'scen-tgbt-arcflash',
        titleFr: 'Calcul d’Énergie Incidente Arc Flash selon IEEE 1584',
        titleEn: 'Incident Energy & Arc Flash Boundary per IEEE 1584',
        tabId: 'arcflash',
        descriptionFr: 'Détermination du niveau d’EPI requis (Cal/cm²) en fonction du temps d’élimination du disjoncteur amont.',
        descriptionEn: 'Evaluation of required PPE rating based on clearing time of upstream protective device.',
        initialCondition: 'Icc = 36 kA, distance de travail = 610 mm, temps de coupure = 80 ms'
      },
      {
        id: 'scen-tgbt-balance',
        titleFr: 'Bilan de Puissance & Foisonnement de charges industrielles',
        titleEn: 'Power Balance & Industrial Load Diversity Sizing',
        tabId: 'powerbalance',
        descriptionFr: 'Optimisation de la puissance souscrite et calcul des courants d’emploi Ib selon les facteurs ks et ku.',
        descriptionEn: 'Optimization of apparent power demand taking into account diversity and utilization factors.',
        initialCondition: 'Charges d’éclairage, CVC, moteurs et pompage (12 départs)'
      }
    ],

    cameroonEquivalents: [
      {
        siteName: 'TGBT Usine Brasséries du Cameroun (Koumassi - Douala)',
        gridSystem: 'RIS',
        voltageLevel: '400 V / 230 V',
        operator: 'Eneo',
        apparatusCode: 'TGBT-SABC-DLA-01',
        technicalContextFr: 'Tableau général 400 V - 4000 A Forme 4b alimentant les lignes d’embouteillage et de conditionnement automatisées, raccordé sur deux transformateurs 2000 kVA en couplage normal/secours.',
        technicalContextEn: '4000 A Form 4b main distribution switchboard powering automated bottling lines, supplied by dual 2000 kVA transformers with bus-tie coupler.',
        coordinates: [4.0320, 9.7120]
      },
      {
        siteName: 'TGBT Hôpital Général de Yaoundé (Source Critique Médicale)',
        gridSystem: 'RIS',
        voltageLevel: '400 V',
        operator: 'Eneo',
        apparatusCode: 'TGBT-HGY-BLOC-OPERATOIRE',
        technicalContextFr: 'TGBT à haute continuité de service avec permutateur de source automatique réseau/groupe/ASI alimentant les blocs opératoires et services de réanimation.',
        technicalContextEn: 'Critical medical distribution board with automatic transfer between grid, emergency genset, and isolated IT UPS.',
        coordinates: [3.8920, 11.5140]
      }
    ],

    causalChain: [
      {
        stepIndex: 1,
        entityId: 'kg-tgbt-400v',
        entityName: 'Jeu de Barres Principal TGBT',
        role: 'Appareil Siège du Défaut',
        actionFr: 'Chute accidentelle d’un outil métallique lors d’une maintenance sous tension, créant un court-circuit triphasé franc',
        actionEn: 'Accidental dropped tool during live maintenance inducing three-phase bolted bus fault',
        relationType: 'ENERGY',
        arrowLabelFr: 'Amorce un arc électrique instantané',
        arrowLabelEn: 'Ignites instantaneous electric arc',
        timingMs: 0
      },
      {
        stepIndex: 2,
        entityId: 'prot-arc-sensor',
        entityName: 'Système Optique Détection d’Arc (Fibre Optique)',
        role: 'Détection Ultrarapide de Flash',
        actionFr: 'Capte l’éclair lumineux de l’arc en 1.5 ms combiné au dépassement de seuil de surintensité',
        actionEn: 'Optical fiber detects light flash in 1.5 ms coupled with instantaneous overcurrent threshold',
        relationType: 'PROTECTION',
        arrowLabelFr: 'Ordonne le déclenchement immédiat',
        arrowLabelEn: 'Sends instantaneous trip pulse',
        timingMs: 2
      },
      {
        stepIndex: 3,
        entityId: 'kg-tgbt-400v',
        entityName: 'Disjoncteur Général Ouvert ACB 3200A',
        role: 'Organe de Coupure Basse Tension',
        actionFr: 'La bobine ultra-rapide déclenche le mécanisme et sépare les contacts d’arc en 35 ms',
        actionEn: 'High-speed trip solenoid unlatches breaker, parting main arcing contacts in 35 ms',
        relationType: 'CONTROL',
        arrowLabelFr: 'Éteint l’arc dans les chambres de désionisation',
        arrowLabelEn: 'Quenches arc inside arc chutes',
        timingMs: 38
      },
      {
        stepIndex: 4,
        entityId: 'kg-tgbt-400v',
        entityName: 'Enveloppe Métallique Forme 4b',
        role: 'Barrière de Ségrégation Physique',
        actionFr: 'Confine les gaz ionisés dans le compartiment jeu de barres sans propager le défaut aux départs avals',
        actionEn: 'Confines hot ionized gases within bus compartment, protecting downstream outgoing cables',
        relationType: 'ENERGY',
        arrowLabelFr: 'Sauvegarde les circuits fonctionnels',
        arrowLabelEn: 'Spares healthy feeder circuits',
        timingMs: 40
      },
      {
        stepIndex: 5,
        entityId: 'scada-building-bms',
        entityName: 'GTC / GTB Superviseur Bâtiment',
        role: 'Gestion Technique Centralisée',
        actionFr: 'Reçoit l’alerte « Déclenchement Disjoncteur Général TGBT » et commute automatiquement les circuits vitaux sur groupe de secours',
        actionEn: 'Receives "Main Breaker Trip" alert and triggers ATS generator startup for essential hospital/critical loads',
        relationType: 'COMMUNICATION',
        arrowLabelFr: 'Démarre le plan de reprise d’activité',
        arrowLabelEn: 'Initiates emergency power recovery',
        timingMs: 60
      }
    ],

    traceability: {
      kind: 'EXIGENCE_NORMATIVE',
      source: 'Norme Internationale CEI 61439-1 & 2 / Guide Technique UTE C 15-105',
      verifiedDate: '2026-08-01',
      confidenceScore: 99,
      editorialLead: 'Ing. M. Touré (Low Voltage Switchgear & Electrical Safety)',
      standardReference: 'CEI 61439-1/2 / IEEE 1584-2018'
    }
  }
];

// ─── Helper Functions & Graph Queries ──────────────────────────────────────────

export function getAllGraphEntities(): KnowledgeGraphEntity[] {
  return KNOWLEDGE_GRAPH_ENTITIES;
}

export function getGraphEntityById(id: string): KnowledgeGraphEntity | undefined {
  return KNOWLEDGE_GRAPH_ENTITIES.find(e => e.id === id);
}

export function filterLinksByType(
  links: ConnectedNodeLink[],
  relationFilter: GraphRelationType | 'ALL'
): ConnectedNodeLink[] {
  if (relationFilter === 'ALL') return links;
  return links.filter(link => link.relationType === relationFilter);
}

export const RELATION_TYPE_CONFIG: Record<
  GraphRelationType,
  { labelFr: string; labelEn: string; color: string; bg: string; border: string; icon: string }
> = {
  ENERGY: {
    labelFr: 'Énergie (Amont/Aval)',
    labelEn: 'Energy (Upstream/Downstream)',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'Zap'
  },
  PROTECTION: {
    labelFr: 'Protection & TC/TP',
    labelEn: 'Protection & CT/VT',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'Shield'
  },
  CONTROL: {
    labelFr: 'Commande & Déclenchement',
    labelEn: 'Control & Tripping',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    icon: 'Cpu'
  },
  COMMUNICATION: {
    labelFr: 'Communication & SCADA',
    labelEn: 'Communication & SCADA',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'Radio'
  },
  STANDARD: {
    labelFr: 'Normes & Règles CEI/IEEE',
    labelEn: 'Standards & IEC/IEEE Rules',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'BookOpen'
  },
  MAINTENANCE: {
    labelFr: 'Maintenance & Diagnostic',
    labelEn: 'Maintenance & Diagnostics',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: 'Wrench'
  }
};

export const PROVENANCE_BADGE_CONFIG: Record<
  ProvenanceKind,
  { labelFr: string; labelEn: string; color: string; bg: string; border: string }
> = {
  EXIGENCE_NORMATIVE: {
    labelFr: 'EXIGENCE NORMATIVE',
    labelEn: 'NORMATIVE MANDATE',
    color: 'text-emerald-300',
    bg: 'bg-emerald-950/80',
    border: 'border-emerald-500/40'
  },
  DONNEE_RESEAU_VERIFIEE: {
    labelFr: 'DONNÉE RÉSEAU VÉRIFIÉE',
    labelEn: 'VERIFIED GRID DATA',
    color: 'text-cyan-300',
    bg: 'bg-cyan-950/80',
    border: 'border-cyan-500/40'
  },
  HYPOTHESE_SIMULATION: {
    labelFr: 'HYPOTHÈSE SIMULATION',
    labelEn: 'SIMULATION HYPOTHESIS',
    color: 'text-amber-300',
    bg: 'bg-amber-950/80',
    border: 'border-amber-500/40'
  },
  BONNE_PRATIQUE: {
    labelFr: 'BONNE PRATIQUE INDUSTRIELLE',
    labelEn: 'INDUSTRY BEST PRACTICE',
    color: 'text-blue-300',
    bg: 'bg-blue-950/80',
    border: 'border-blue-500/40'
  },
  CONTENU_PEDAGOGIQUE: {
    labelFr: 'CONTENU PÉDAGOGIQUE',
    labelEn: 'PEDAGOGICAL CONTENT',
    color: 'text-purple-300',
    bg: 'bg-purple-950/80',
    border: 'border-purple-500/40'
  },
  DONNEE_INDICATIVE: {
    labelFr: 'DONNÉE INDICATIVE',
    labelEn: 'INDICATIVE DATA',
    color: 'text-slate-300',
    bg: 'bg-slate-900',
    border: 'border-slate-700'
  }
};
