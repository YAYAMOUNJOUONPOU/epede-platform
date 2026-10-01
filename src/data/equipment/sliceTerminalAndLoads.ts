// src/data/equipment/sliceTerminalAndLoads.ts
// EPEDE - TGBT, Distribution Boards, Final Circuits & Industrial Loads

import type { CanonicalEquipmentObject } from '../../types/equipmentExplorer';

export const TERMINAL_AND_LOADS_ITEMS: CanonicalEquipmentObject[] = [
  // 8. MAIN LOW VOLTAGE SWITCHBOARD (TGBT 400 V - 2500 A)
  {
    id: 'eq-exp-tgbt-main-400v',
    tagIec: '==Q1.TGBT',
    name: {
      fr: 'Tableau Général Basse Tension TGBT 400 V (2500 A - Forme 4b)',
      en: 'Main Low-Voltage Switchboard (TGBT) 400 V (2500 A - Form 4b)'
    },
    aliases: {
      fr: ['Armoire TGBT', 'Tableau principal BT', 'Distribution 400V', 'Power Center PCC'],
      en: ['Main LV Switchboard (MSB)', 'PCC Power Center', 'Low-Voltage Switchgear']
    },
    equipmentType: 'LowVoltageSwitchboard',
    category: 'LV_DISTRIBUTION',
    parentDomain: 'D06',
    systemStage: 'LV_DISTRIBUTION',
    subsystemContext: {
      fr: 'Local technique électrique principal d\'une usine ou d\'un complexe tertiaire',
      en: 'Main electrical room of an industrial facility or large commercial complex'
    },
    technologyContext: {
      fr: 'Armoire métallique modulaire compartimentée en Forme 4b selon IEC 61439-2 avec disjoncteur ouvert d\'arrivée 2500 A débrochable (ACB), batterie de condensateurs et départs divisionnaires',
      en: 'Form 4b modular compartmentalized metal-enclosed switchboard (IEC 61439-2) with 2500 A withdrawable air circuit breaker (ACB), PFC capacitor bank, and feeder cubicles'
    },
    applicationContext: {
      fr: 'Distribution principale de puissance d\'un complexe industriel dans la zone de Bassa/Magzi (Douala)',
      en: 'Primary power distribution for an industrial plant in Bassa/Magzi industrial zone (Douala)'
    },
    voltageContext: {
      nominalVoltage: '400 V / 230 V',
      level: 'LV',
      frequencyHz: 50,
      phases: '3-phase 4-wire (3P + N + PE)'
    },
    typicalLocation: {
      fr: 'Local TGBT au rez-de-chaussée technique de l\'usine (Douala Bassa)',
      en: 'Main electrical room at plant technical floor (Douala Bassa)'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Ensemble appareillé basse tension regroupant l\'arrivée transformateur ou groupe électrogène de secours, la compensation de facteur de puissance et les départs vers les armoires divisionnaires.',
      en: 'Factory-built low-voltage assembly housing main transformer/genset incomer, power factor correction, and protected feeder circuits supplying sub-distribution boards.'
    },
    purpose: {
      fr: 'Répartir l\'énergie électrique en toute sécurité, protéger contre les surcharges et courts-circuits, et compenser l\'énergie réactive pour éviter les pénalités tarifaires.',
      en: 'Distribute low-voltage electrical power safely, protect against overcurrents and short-circuits, and compensate reactive power to maintain power factor > 0.95.'
    },
    engineeringProblemSolved: {
      fr: 'La séparation interne Forme 4b garantit qu\'une intervention sur un départ n\'expose pas l\'électricien aux jeux de barres principaux restés sous tension.',
      en: 'Form 4b internal separation ensures maintenance on individual outgoing feeders without exposing operators to live main busbars.'
    },

    primaryFunction: {
      fr: 'Distribution primaire basse tension, protection générale et gestion des sources normale/secours.',
      en: 'Primary low-voltage power distribution, main protection, and normal/standby source changeover.'
    },
    secondaryFunctions: {
      fr: ['Compensation automatique d\'énergie réactive (batterie 300 kvar)', 'Comptage d\'énergie par départ et analyse de la qualité réseau (harmoniques THD)', 'Inversion de source automatique réseau/groupe diesel (ATS)'],
      en: ['Automatic power factor correction (300 kvar bank)', 'Sub-metering and power quality analysis (THD harmonics)', 'Automatic transfer switching (ATS) between grid and diesel backup']
    },
    operatingPrincipleSummary: {
      fr: 'L\'énergie 400 V entre par le disjoncteur ouvert (ACB) motorisé, alimente un jeu de barres cuivre principal 2500 A, qui distribue le courant aux départs équipés de disjoncteurs boîtier moulé (MCCB).',
      en: '400 V power enters via motorized air circuit breaker (ACB), feeding 2500 A main copper busbar, distributing to sub-feeders protected by molded case circuit breakers (MCCB).'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Arrivée Puissance et Mesure', en: 'Power Infeed & Metering' },
        description: { fr: 'Le câble BT du transformateur alimente le disjoncteur ouvert 2500 A équipé d\'un déclencheur électronique Micrologic.', en: 'LV transformer cables feed 2500 A ACB equipped with electronic trip unit.' },
        physicalPhenomenon: { fr: 'Conduction électrique sous 400 V', en: 'Electrical conduction at 400 V' },
        keyVariable: 'In = 2500 A, Icu = 65 kA'
      },
      {
        stepNumber: 2,
        title: { fr: 'Compensation Réactive Automatique', en: 'Automatic Power Factor Correction' },
        description: { fr: 'Le relais varmétrique enclenche des gradins de condensateurs avec selfs anti-harmoniques pour maintenir cos φ = 0.96.', en: 'PFC controller switches detuned capacitor steps to hold power factor at 0.96.' },
        physicalPhenomenon: { fr: 'Fourniture de puissance réactive capacitive Qc', en: 'Capacitive reactive power injection' },
        keyVariable: 'Qc = 300 kvar, THDu < 5%'
      },
      {
        stepNumber: 3,
        title: { fr: 'Départs Divisionnaires Sélectifs', en: 'Selective Feeder Distribution' },
        description: { fr: 'Les départs MCCB alimentent les tableaux divisionnaires avec sélectivité totale chrono-ampéremétrique.', en: 'Outgoing MCCB feeders supply secondary panels with full time-current selectivity.' },
        physicalPhenomenon: { fr: 'Sélectivité de protection BT', en: 'LV protective discrimination' },
        keyVariable: 'Discrimination ratio > 1.6'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Armoire métallique modulaire en tôle d\'acier 20/10 mm avec peinture époxy RAL 7035, Forme 4b, IP54 / IK10',
      dimensionsApproxMeters: 'L 4.2 m × l 0.8 m × H 2.1 m (6 colonnes)',
      weightApproxKg: 2800,
      mounting: { fr: 'Fixation au sol sur socle surélevé de 100 mm au-dessus des caniveaux à câbles', en: 'Floor mounted on 100 mm raised plinth over cable trenches' },
      environmentalClearances: { fr: 'Passage libre de 1.0 m à l\'avant et 0.8 m à l\'arrière pour maintenance', en: '1.0 m front and 0.8 m rear maintenance clearances' }
    },
    mainComponents: [
      { id: 'tgbt-acb', name: { fr: 'Disjoncteur ouvert 2500 A débrochable (ACB)', en: '2500 A withdrawable air circuit breaker (ACB)' }, function: { fr: 'Protection principale et coupure générale 65 kA', en: 'Main protection and 65 kA breaking capacity' }, materialOrTechnology: 'Déclencheur électronique avec mesures de puissance', criticality: 'CRITICAL' },
      { id: 'tgbt-bus', name: { fr: 'Jeu de barres principal cuivre 2500 A', en: '2500 A main copper busbar system' }, function: { fr: 'Répartition de l\'énergie dans l\'armoire', en: 'Distributes energy across all cubicles' }, materialOrTechnology: 'Cuivre électrolytique étamé avec supports isolants polyester', criticality: 'CRITICAL' },
      { id: 'tgbt-pfc', name: { fr: 'Batterie de condensateurs automatique 300 kvar', en: '300 kvar automatic capacitor bank' }, function: { fr: 'Relèvement du facteur de puissance', en: 'Power factor correction' }, materialOrTechnology: 'Condensateurs secs à film polypropylène métallisé avec selfs 7%', criticality: 'HIGH' },
      { id: 'tgbt-mccb', name: { fr: 'Disjoncteurs boîtier moulé (MCCB) départs', en: 'Molded case feeder circuit breakers (MCCB)' }, function: { fr: 'Protection des départs vers les tableaux divisionnaires', en: 'Feeder protection to sub-distribution boards' }, materialOrTechnology: 'Calibres 160 A à 630 A à déclencheur thermo-magnétique ou électronique', criticality: 'CRITICAL' }
    ],

    energyOrSignalFlow: {
      fr: 'Arrivée Transformateur 400 V → Disjoncteur ACB 2500 A → Jeu de barres principal → Départs MCCB → Tableaux divisionnaires → Moteurs/Charges',
      en: 'Transformer 400 V incomer → 2500 A ACB → Main busbars → MCCB feeders → Sub-distribution boards → Motors/Loads'
    },
    electricalRole: {
      fr: 'Cœur névralgique de la distribution électrique basse tension du site',
      en: 'Central nerve center for facility low-voltage power distribution'
    },
    thermalRole: {
      fr: 'Ventilation forcée par extracteurs de toit thermostatés pour évacuer les pertes joule (~4.5 kW)',
      en: 'Thermostatically controlled roof exhaust fans dissipating ~4.5 kW thermal losses'
    },

    systemContextDescription: {
      fr: 'Alimenté par le transformateur abaisseur du poste kiosque ou par le groupe électrogène de secours via inverseur automatique.',
      en: 'Supplied by substation kiosk transformer or standby diesel genset via automatic transfer switch.'
    },
    upstreamEquipmentIds: ['eq-exp-kiosk-30kv-400v'],
    downstreamEquipmentIds: ['eq-exp-dist-board-400v', 'eq-exp-motor-ind-250kw'],
    relationships: [
      {
        id: 'rel-tgbt-distb',
        targetEquipmentId: 'eq-exp-dist-board-400v',
        targetName: { fr: 'Tableau Divisionnaire de Distribution BT 400 V', en: 'Sub-Distribution Board 400 V' },
        targetCategory: 'LV_DISTRIBUTION',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Alimente l\'armoire divisionnaire d\'atelier par câble cuivre 4x185 mm²', en: 'Feeds workshop distribution board via 4x185 mm² copper cable' }
      },
      {
        id: 'rel-tgbt-motor',
        targetEquipmentId: 'eq-exp-motor-ind-250kw',
        targetName: { fr: 'Moteur Asynchrone Industriel 250 kW', en: '250 kW Industrial Induction Motor' },
        targetCategory: 'LV_DISTRIBUTION',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Alimente le démarreur progressif / variateur du moteur 250 kW', en: 'Feeds soft-starter / variable speed drive of the 250 kW motor' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['50/51 (Surintensité sélective)', '51N (Défaut terre résiduel)', '27 (Sous-tension)', '47 (Inversion de phase)'],
      protectiveRelayIds: [],
      summary: {
        fr: 'Déclencheur électronique de l\'ACB avec réglages L (surcharge retardée), S (court-circuit temporisé), I (instantané) et G (défaut terre résiduel).',
        en: 'Electronic trip unit with adjustable LSIG protection curves for comprehensive downstream selectivity.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Centrales de mesure communicantes PM5000 sur l\'arrivée et les départs', 'Torores de détection tore différentiel'],
      instrumentTransformerIds: [],
      measuredQuantities: ['Tensions V, U (V)', 'Courants de phase et neutre (A)', 'Puissances P, Q, S (kW, kvar, kVA)', 'Facteur de puissance cos φ', 'Taux de distorsion harmonique THD (%)']
    },
    controlAndAutomation: {
      localControls: { fr: 'Face avant avec commutateurs, boutons-poussoirs de test et écran tactile IHM de supervision', en: 'Front fascia control switches, test pushbuttons, and touchscreen HMI dashboard' },
      remoteControls: { fr: 'Télécommande Modbus TCP / Ethernet IP reliée à la Gestion Technique du Bâtiment (GTB / BMS)', en: 'Modbus TCP / Ethernet IP connection to facility Building Management System (BMS)' },
      interlocks: { fr: 'Verrouillage mécanique par serrures Ronis entre l\'arrivée réseau et l\'arrivée groupe électrogène (interdiction de réalimentation)', en: 'Key mechanical interlocks (Ronis) preventing simultaneous grid and genset closing' }
    },
    communicationProtocols: ['Modbus TCP', 'Ethernet/IP', 'BACnet IP'],

    earthingAndBonding: {
      earthingRegime: 'TN-S',
      connectionMethod: {
        fr: 'Schéma TN-S : Neutre N et conducteur de protection PE séparés dès l\'arrivée du TGBT; barre de terre reliée à la boucle de fondation',
        en: 'TN-S scheme: Neutral N and protective conductor PE separated at switchboard incomer; ground busbar bonded to foundation rebar'
      },
      dischargeCapability: {
        fr: 'Parafoudre basse tension Type 1+2 (Iimp = 25 kA par pôle) en tête de TGBT',
        en: 'Type 1+2 surge protective device (Iimp = 25 kA per pole) at main incomer'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Air libre dans compartiments isolés (Forme 4b)',
      bilRatingKv: 8,
      phaseClearanceMeters: 'Ligne de fuite > 16 mm sous 400 V'
    },
    connectionRequirements: {
      electrical: { fr: 'Raccordement d\'arrivée par jeu de barres ou 4 câbles 1x240 mm² Cu par phase; départs par presse-étoupes en fond d\'armoire', en: 'Incomer connection via busway or 4x 1x240 mm² Cu per phase; bottom cable gland plates' },
      mechanical: { fr: 'Enveloppe robuste avec résistance aux séismes et vibrations machines', en: 'Heavy-duty steel cabinet with seismic and machine vibration resistance' },
      cableOrBusbar: { fr: 'Jeu de barres 2500 A Icw 65 kA 1s', en: '2500 A copper busbar rated 65 kA 1s' },
      earthing: { fr: 'Barre de cuivre PE 50x10 mm courant tout le long du bas de l\'armoire', en: 'PE copper bar 50x10 mm running full bottom length of board' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '5°C à 40°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'Degré de pollution 3 (Environnement industriel)',
      indoorOutdoor: 'INDOOR'
    },

    keyEngineeringValues: [
      { key: 'In', label: { fr: 'Courant assigné d\'emploi', en: 'Rated operational current' }, value: 2500, unit: 'A', status: 'VERIFIED' },
      { key: 'Ue', label: { fr: 'Tension assignée d\'emploi', en: 'Rated operational voltage' }, value: 400, unit: 'V', status: 'VERIFIED' },
      { key: 'Icw', label: { fr: 'Courant de courte durée admissible', en: 'Short-time withstand current' }, value: 65, unit: 'kA', status: 'VERIFIED' },
      { key: 'form', label: { fr: 'Forme de séparation interne', en: 'Internal separation form' }, value: 'Forme 4b', status: 'VERIFIED' },
      { key: 'ip_rating', label: { fr: 'Indice de protection', en: 'Ingress protection' }, value: 'IP54', status: 'VERIFIED' },
      { key: 'pfc_capacity', label: { fr: 'Puissance batterie condensateurs', en: 'PFC bank rating' }, value: 300, unit: 'kvar', status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'UNDER_MAINTENANCE', 'FAULTED'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-TGBT-01',
        name: { fr: 'Échauffement anormal sur éclissage du jeu de barres principal', en: 'Abnormal hot-spot at main busbar bolted joint' },
        rootCause: { fr: 'Mauvais serrage au couple lors du montage ou relaxation thermique des boulons', en: 'Improper bolt torquing or thermal relaxation of joint fasteners' },
        consequenceOnSystem: { fr: 'Dégradation thermique, risque d\'amorçage d\'arc flash interne 65 kA', en: 'Insulator melting, risk of destructive 65 kA internal arc flash' },
        protectiveResponse: { fr: 'Détection précoce par caméra thermique infrarouge lors des rondes de maintenance', en: 'Early infrared thermography detection during periodic maintenance walkdowns' },
        severity: 'CRITICAL'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'Arrêt complet de l\'usine de production (perte de l\'ensemble des lignes de fabrication).',
      en: 'Total plant shutdown and loss of all manufacturing production lines.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Basse Tension 400 V forte énergie', 'Courant de court-circuit très élevé (65 kA)', 'Arc flash violent'],
      isolationProcedureLoto: {
        fr: 'Ouverture disjoncteur général ACB, débrochage en position sectionné, cadenassage du volet de manivelle, vérification d\'absence de tension.',
        en: 'Open main ACB, rack out to disconnected position, padlock racking shutter, perform live-line voltage verification (VAT).'
      },
      ppeRequirements: ['Cagoule et écran anti-arc flash 40 cal/cm²', 'Gants isolants 1000 V classe 0', 'Vêtements 100% coton ininflammables']
    },

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Semestrielle', description: { fr: 'Contrôle thermographique infrarouge de tous les départs et du jeu de barres en charge', en: 'Full infrared thermographic scan of busbars and feeder connections under load' }, toolsAndStandards: ['Caméra IR Fluke Ti480', 'NF C 15-100'] },
      { type: 'PREVENTIVE', periodicity: 'Annuelle', description: { fr: 'Vérification du couple de serrage à la clé dynamométrique et dépoussiérage des filtres', en: 'Calibrated torque wrench re-torquing and ventilation filter replacement' }, toolsAndStandards: ['Clé dynamométrique isolée', 'Aspirateur industriel'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essai de tenue diélectrique à fréquence industrielle 2500 V / 1 min', 'Vérification de la continuité des masses et de la séparation Forme 4b'],
      siteAcceptanceTestsSat: ['Résistance d\'isolement 1000 V (> 1 MΩ)', 'Essai de déclenchement du disjoncteur ACB avec valise d\'injection primaire/secondaire'],
      commissioningProcedures: ['Contrôle de l\'ordre des phases, essai d\'inversion de source automatique normale/secours (ATS)']
    },

    applicableStandards: [
      { standardCode: 'IEC 61439-1', title: 'Low-voltage switchgear and controlgear assemblies - Part 1: General rules', relevantClauses: ['Clause 8 (Design verification)', 'Clause 10 (Routine verification)'], jurisdiction: 'International' },
      { standardCode: 'IEC 61439-2', title: 'Low-voltage switchgear and controlgear assemblies - Part 2: Power switchgear and controlgear assemblies', relevantClauses: ['Clause 8 (Internal separation forms 1 to 4)'], jurisdiction: 'International' },
      { standardCode: 'NF C 15-100', title: 'Installations électriques à basse tension', relevantClauses: ['Partie 4 (Protection pour assurer la sécurité)', 'Partie 5 (Choix et mise en œuvre des matériels)'], jurisdiction: 'France / Cameroon (Standard appliqué)' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'distribution-engineer', title: { fr: 'Ingénieur Installations Basse Tension', en: 'Low Voltage Installations Engineer' }, tasks: { fr: 'Calculs de câbles, bilan de puissance, coordination sélective et conformité NF C 15-100', en: 'Cable sizing calculations, load schedules, protection selectivity, and electrical safety code compliance' } }
    ],
    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Schéma unifilaire développé TGBT', 'Bilan de puissance et note de calcul Caneco BT'], involvedRoles: ['Ingénieur BE Électrique'] }
    ],

    deliverablesAndDocuments: ['Plan d\'implantation armoire TGBT', 'Schéma des circuits de commande et d\'automatisme ATS', 'Procès-verbal de contrôle de conformité'],
    provenance: {
      id: 'prov-exp-tgbt-01',
      entity_id: 'eq-exp-tgbt-main-400v',
      entity_type: 'equipment',
      source_ref: 'Norme CEI 61439-2 & Dossier Technique Installation Industrielle Bassa',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Low Voltage Engineering Review',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Courant de court-circuit Icw 65 kA garanti avec disjoncteur amont limiteur. Température intérieure maximale 40°C.',
      en: '65 kA withstand rating verified with upstream current-limiting protection. Maximum internal operating ambient 40°C.'
    },

    representations: {
      physical: {
        svgVariant: 'PANEL',
        dimensionsLabel: '4.2 m × 0.8 m × 2.1 m (6 colonnes)',
        enclosureLabel: 'Armoire métallique Forme 4b IP54',
        maintenanceClearance: 'Couloir avant 1.0 m / arrière 0.8 m'
      },
      electrical: {
        symbolType: 'SWITCHBOARD_LV',
        incomerTerminal: 'Arrivée Transformateur 400 V',
        outgoingTerminal: 'Départs divisionnaires 400 V / 230 V',
        protectionZone: 'Zone protégée TGBT 65 kA',
        measurementTap: 'Tores TC ouverts + Centrale de mesure communicante'
      },
      functional: {
        inputSignal: '400 V triphasé 2500 A',
        conversionProcess: 'Répartition modulaire et compensation réactive automatique',
        outputSignal: 'Départs sécurisés 400 V avec cos φ régulé',
        feedbackLoop: 'Boucle de régulation facteur de puissance varmétrique'
      }
    }
  },

  // 9. HEAVY INDUSTRIAL INDUCTION MOTOR (250 kW - FINAL LOAD)
  {
    id: 'eq-exp-motor-ind-250kw',
    tagIec: '--M01.PUMP',
    name: {
      fr: 'Moteur Asynchrone Triphasé à Cage d\'Écureuil (250 kW - 400 V)',
      en: 'Three-Phase Squirrel-Cage Induction Motor (250 kW - 400 V)'
    },
    aliases: {
      fr: ['Moteur de pompe principale', 'Moteur asynchrone 250 kW', 'Moteur BT industriel'],
      en: ['Induction Motor 250 kW', 'Squirrel-Cage Motor', 'Industrial Drive Motor']
    },
    equipmentType: 'InductionMotor',
    category: 'LV_DISTRIBUTION',
    parentDomain: 'D07',
    systemStage: 'FINAL_CIRCUITS_LOADS',
    subsystemContext: {
      fr: 'Station de pompage d\'eau industrielle ou entraînement de compresseur d\'usine',
      en: 'Industrial cooling water pumping station or heavy factory air compressor drive'
    },
    technologyContext: {
      fr: 'Moteur asynchrone triphasé à cage d\'écureuil en fonte d\'acier, classe de rendement IE4 (Super Premium Efficiency), refroidissement TEFC (IC411)',
      en: 'Cast iron three-phase squirrel-cage induction motor, IE4 Super Premium efficiency class, totally enclosed fan-cooled (TEFC / IC411)'
    },
    applicationContext: {
      fr: 'Entraînement de pompe centrifuge de recirculation d\'eau industrielle (zone industrielle de Bassa, Douala)',
      en: 'Centrifugal industrial cooling water pump drive (Bassa industrial zone, Douala)'
    },
    voltageContext: {
      nominalVoltage: '400 V (Triangle) / 690 V (Étoile)',
      level: 'LV',
      frequencyHz: 50,
      phases: '3-phase AC'
    },
    typicalLocation: {
      fr: 'Salle des pompes de l\'usine (Douala Bassa)',
      en: 'Plant pump hall (Douala Bassa)'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Machine électrique tournante réceptrice convertissant l\'énergie électrique basse tension triphasée en énergie mécanique rotative avec un rendement élevé (> 96.5%).',
      en: 'Rotating electrical machine receptor converting three-phase low-voltage electrical energy into rotary mechanical shaft power with high efficiency (> 96.5%).'
    },
    purpose: {
      fr: 'Entraîner la pompe centrifuge débitant 1200 m³/h d\'eau sous une pression de 5.5 bars pour le procédé industriel.',
      en: 'Drive heavy centrifugal pump delivering 1200 m³/h of water at 5.5 bar pressure for industrial process cooling.'
    },
    engineeringProblemSolved: {
      fr: 'Limitation du courant de pointe de démarrage (de 7.2 In à 2.5 In) grâce à l\'association avec un démarreur progressif électronique à thyristors.',
      en: 'Inrush current mitigation (reduced from 7.2 In to 2.5 In) via integrated solid-state soft-starter.'
    },

    primaryFunction: {
      fr: 'Conversion électromécanique de puissance : produit un couple mécanique sur l\'arbre de 1600 N·m à 1485 tr/min.',
      en: 'Electromechanical power conversion: delivers 1600 N·m mechanical shaft torque at 1485 rpm.'
    },
    secondaryFunctions: {
      fr: ['Protection thermique intégrée par sondes PTC dans les bobinages', 'Freinage régénératif contrôlé (lorsque raccordé sur variateur de fréquence)'],
      en: ['Integrated winding thermal protection via embedded PTC thermistors', 'Controlled dynamic deceleration (when driven via VFD)']
    },
    operatingPrincipleSummary: {
      fr: 'Les courants statoriques triphasés créent un champ magnétique tournant à 1500 tr/min. Ce champ induit des courants dans la cage d\'écureuil du rotor, créant des forces de Laplace qui entraînent le rotor avec un glissement de 1.0%.',
      en: 'Stator currents produce rotating magnetic field at 1500 rpm. Field induces currents in rotor squirrel-cage bars, generating Lorentz forces that spin the rotor with 1.0% slip.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Champ Tournant Statorique', en: 'Stator Rotating Field' },
        description: { fr: 'L\'alimentation 400 V 50 Hz crée dans l\'entrefer un champ magnétique tournant à la vitesse de synchronisme Ns = 1500 tr/min (p=2 paires de pôles).', en: '400 V 50 Hz power creates a rotating magnetic field in the airgap at synchronous speed Ns = 1500 rpm (p=2 pole pairs).' },
        physicalPhenomenon: { fr: 'Théorème de Ferraris', en: 'Ferraris rotating field theorem' },
        keyVariable: 'Ns = 60·f / p = 1500 rpm'
      },
      {
        stepNumber: 2,
        title: { fr: 'Induction Rotorique', en: 'Rotor Bar Induction' },
        description: { fr: 'La différence de vitesse relative entre le champ et le rotor induit des courants de forte intensité dans les barres de cuivre du rotor.', en: 'Relative speed difference between stator field and rotor induces heavy currents in rotor bars.' },
        physicalPhenomenon: { fr: 'Loi d\'induction de Faraday e = -dΦ/dt', en: 'Faraday induction in rotor cage' },
        keyVariable: 'Slip s = (Ns - N) / Ns = 1.0%'
      },
      {
        stepNumber: 3,
        title: { fr: 'Création du Couple Électromécanique', en: 'Electromechanical Torque Generation' },
        description: { fr: 'L\'interaction entre les courants induits rotoriques et le champ magnétique tournant crée le couple de Laplace moteur.', en: 'Interaction between rotor currents and rotating magnetic field generates driving Lorentz torque.' },
        physicalPhenomenon: { fr: 'Force de Laplace F = I × L × B', en: 'Lorentz force F = I × L × B' },
        keyVariable: 'Nominal Torque Tn = 1608 N·m, Speed N = 1485 rpm'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Carcasse fermée en fonte grise avec ailettes de refroidissement radiales, indice IP55 / IK08',
      dimensionsApproxMeters: 'L 1.45 m × l 0.75 m × H 0.82 m',
      weightApproxKg: 1650,
      mounting: { fr: 'Fixation par 4 pattes d\'ancrage usinées sur socle métallique rigide aligné au laser avec la pompe', en: 'Foot mounted on rigid steel baseplate laser-aligned with centrifugal pump' },
      environmentalClearances: { fr: 'Dégagement d\'au moins 0.5 m à l\'arrière du capot de ventilateur pour aspiration d\'air', en: '0.5 m minimum clearance behind fan cowl for unimpeded cooling air suction' }
    },
    mainComponents: [
      { id: 'mot-stat', name: { fr: 'Stator bobiné avec fil cuivre classe H', en: 'Stator with Class H copper magnet wire' }, function: { fr: 'Génère le champ magnétique tournant', en: 'Produces rotating magnetic field' }, materialOrTechnology: 'Tôles magnétiques isolées faibles pertes / Imprégnation sous vide VPI', criticality: 'CRITICAL' },
      { id: 'mot-rot', name: { fr: 'Rotor à cage d\'écureuil en cuivre injecté', en: 'Cast copper squirrel-cage rotor' }, function: { fr: 'Développe le couple d\'entraînement', en: 'Develops motor shaft torque' }, materialOrTechnology: 'Barres cuivre brasées sur anneaux de court-circuit', criticality: 'CRITICAL' },
      { id: 'mot-bear', name: { fr: 'Roulements à billes et à rouleaux re-graissables', en: 'Regreasable drive and non-drive end bearings' }, function: { fr: 'Guident l\'arbre et reprennent les charges radiales', en: 'Support rotating shaft and radial belt/coupling loads' }, materialOrTechnology: 'Roulements SKF C3 avec graisse haute température', criticality: 'HIGH' },
      { id: 'mot-fan', name: { fr: 'Ventilateur de refroidissement bidirectionnel', en: 'Bidirectional external cooling fan' }, function: { fr: 'Souffle l\'air frais sur les ailettes de la carcasse', en: 'Blows cooling air over outer cast iron fins' }, materialOrTechnology: 'Polypropylène armé anti-statique', criticality: 'STANDARD' }
    ],

    energyOrSignalFlow: {
      fr: 'Départ TGBT 400 V → Démarreur progressif / variateur → Boîte à bornes moteur → Stator → Rotor → Arbre mécanique → Pompe',
      en: 'TGBT 400 V feeder → Soft-starter / VFD → Motor terminal box → Stator → Rotor → Drive shaft → Pump'
    },
    electricalRole: {
      fr: 'Récepteur inductif principal transformant l\'électricité en travail mécanique utile',
      en: 'Major inductive load converting electric energy into mechanical pump work'
    },
    thermalRole: {
      fr: 'Évacue 8.8 kW de pertes thermiques par son ventilateur attelé (rendement 96.6%)',
      en: 'Dissipates 8.8 kW of thermal losses via shaft-driven external fan (96.6% efficiency)'
    },

    systemContextDescription: {
      fr: 'Terminus de la chaîne de puissance : charge motrice industrielle alimentée depuis le TGBT du site.',
      en: 'Terminal end of the power delivery chain: heavy industrial load supplied from facility main switchboard.'
    },
    upstreamEquipmentIds: ['eq-exp-tgbt-main-400v'],
    downstreamEquipmentIds: [],
    relationships: [
      {
        id: 'rel-motor-tgbt',
        targetEquipmentId: 'eq-exp-tgbt-main-400v',
        targetName: { fr: 'Tableau Général Basse Tension TGBT 400 V', en: 'Main Low-Voltage Switchboard (TGBT)' },
        targetCategory: 'LV_DISTRIBUTION',
        relationKind: 'SUPPLIED_BY' as any,
        description: { fr: 'Alimenté par un disjoncteur départ moteur 630 A depuis le TGBT', en: 'Supplied by a dedicated 630 A motor feeder breaker from TGBT' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['49 (Protection thermique surcharge)', '50 (Court-circuit instantané)', '46 (Déséquilibre de phase / perte de phase)', '51LR (Rotor bloqué)', '37 (Sous-charge / désamorçage pompe)'],
      protectiveRelayIds: [],
      summary: {
        fr: 'Protégé par relais électronique moteur (TeSys T / SIMOCODE) surveillant les sondes thermiques PTC, le déséquilibre de courant et le blocage de rotor.',
        en: 'Protected by electronic motor protection relay monitoring winding PTC thermistors, phase unbalance, and stalled rotor conditions.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['3 sondes thermométriques PTC intégrées dans les têtes de bobines stator', 'Capteurs de vibrations sur paliers (avant/arrière)'],
      instrumentTransformerIds: [],
      measuredQuantities: ['Courant de phase moteur (A)', 'Température enroulements (°C)', 'Vibrations globales RMS (mm/s)']
    },
    controlAndAutomation: {
      localControls: { fr: 'Bouton d\'arrêt d\'urgence coup-de-poing cadenassable situé à proximité immédiate du moteur', en: 'Padlockable emergency mushroom stop pushbutton installed within line of sight' },
      remoteControls: { fr: 'Démarrage/arrêt automatique asservi au niveau de la bâche d\'eau par l\'automate de procédé (PLC)', en: 'Automatic start/stop regulated by plant water reservoir level PLC' },
      interlocks: { fr: 'Interdiction de démarrage si la vanne d\'aspiration de la pompe n\'est pas ouverte à 100%', en: 'Start permissive interlock requiring pump suction valve 100% open' }
    },
    communicationProtocols: ['Profinet', 'Modbus RTU'],

    earthingAndBonding: {
      earthingRegime: 'TN-S',
      connectionMethod: {
        fr: 'Raccordement de la carcasse métallique à la terre par câble de protection PE vert/jaune 95 mm² dans la boîte à bornes et tresse externe au châssis',
        en: 'Motor frame bonded to PE earth conductor 95 mm² inside terminal box plus external flexible copper strap to base'
      },
      dischargeCapability: {
        fr: 'Écoulement des courants de défaut phase-carcasse déclenchant la protection instantanée en moins de 0.1 s',
        en: 'Phase-to-frame fault clearing via magnetic instantaneous trip in < 0.1 s'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Isolation classe F (échauffement limité à la classe B, marge thermique 25 K)',
      bilRatingKv: 4,
      phaseClearanceMeters: 'Boîte à bornes isolée avec barrettes cuivre et passe-câbles étanches'
    },
    connectionRequirements: {
      electrical: { fr: 'Câble armé 3x185 mm² + 95 mm² PE Cuivre raccordé en triangle (bornes U1-W2, V1-U2, W1-V2)', en: 'Armored 3x185 mm² + 95 mm² PE copper cable delta connected (terminals U1-W2, V1-U2, W1-V2)' },
      mechanical: { fr: 'Accouplement élastique à plots ou à lamelles d\'acier équilibré dynamiquement (classe G2.5)', en: 'Flexible pin-and-bush or disc pack coupling dynamically balanced to ISO 1940 G2.5' },
      cableOrBusbar: { fr: 'Câble souple cuivre résistant aux huiles', en: 'Oil-resistant flexible copper cable' },
      earthing: { fr: 'Borne de terre M10 en laiton dans la boîte à bornes', en: 'M10 brass earth terminal inside main junction box' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '-10°C à 40°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'Environnement industriel avec poussière et projections d\'eau (IP55)',
      indoorOutdoor: 'INDOOR'
    },

    keyEngineeringValues: [
      { key: 'Pn', label: { fr: 'Puissance mécanique utile', en: 'Rated shaft power' }, value: 250, unit: 'kW', status: 'VERIFIED' },
      { key: 'Un', label: { fr: 'Tension assignée', en: 'Rated voltage' }, value: 400, unit: 'V', status: 'VERIFIED' },
      { key: 'In', label: { fr: 'Courant nominal à pleine charge', en: 'Rated full-load current' }, value: 432, unit: 'A', status: 'VERIFIED' },
      { key: 'eta', label: { fr: 'Rendement à pleine charge (IE4)', en: 'Full-load efficiency (IE4)' }, value: 96.6, unit: '%', status: 'VERIFIED' },
      { key: 'cos_phi', label: { fr: 'Facteur de puissance à pleine charge', en: 'Rated power factor' }, value: 0.86, status: 'VERIFIED' },
      { key: 'speed', label: { fr: 'Vitesse de rotation nominale', en: 'Rated speed' }, value: 1485, unit: 'rpm', status: 'VERIFIED' },
      { key: 'tn', label: { fr: 'Couple nominal', en: 'Rated torque' }, value: 1608, unit: 'N·m', status: 'VERIFIED' },
      { key: 'ia_in', label: { fr: 'Rapport de courant de démarrage direct', en: 'Direct start inrush ratio (Ia/In)' }, value: 7.2, status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'UNDER_MAINTENANCE', 'FAULTED'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-MOT-01',
        name: { fr: 'Défaillance de roulement de guidage avec échauffement et frottement rotor/stator', en: 'Drive-end bearing mechanical failure leading to rotor/stator rub' },
        rootCause: { fr: 'Manque de graissage ou contamination de la graisse par des particules abrasives', en: 'Lubrication starvation or grease contamination by abrasive particulate' },
        consequenceOnSystem: { fr: 'Échauffement violent, destruction de l\'entrefer et court-circuit statorique massif', en: 'Severe heat rise, catastrophic airgap wipe and mass stator core destruction' },
        protectiveResponse: { fr: 'Détection précoce par analyse des vibrations ou déclenchement thermique par sondes de palier', en: 'Early detection via vibration monitoring or bearing RTD thermal trip (> 95°C)' },
        severity: 'CATASTROPHIC'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'Arrêt de la pompe principale de refroidissement, entraînant la mise en sécurité thermique de l\'usine.',
      en: 'Centrifugal cooling pump trip forcing emergency thermal shutdown of production furnaces.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Pièces tournantes à haute vitesse (1500 tr/min)', 'Basse Tension 400 V', 'Chaleur de surface carcasse (> 70°C)'],
      isolationProcedureLoto: {
        fr: 'Consignation électrique au disjoncteur TGBT (cadenas rouge sur plastron débroché), verrouillage de la vanne de refoulement mécanique.',
        en: 'Lockout-tagout at TGBT breaker with padlocked hasp, mechanical lock on pump discharge valve.'
      },
      ppeRequirements: ['Lunettes de protection, bouchons anti-bruit, chaussures de sécurité à embout acier']
    },

    maintenancePlan: [
      { type: 'CONDITION_BASED', periodicity: 'Mensuelle', description: { fr: 'Contrôle des spectres de vibration (vitesse RMS globale et facteur de crête de roulement)', en: 'Vibration spectral analysis (overall velocity RMS and high-frequency bearing demodulation)' }, toolsAndStandards: ['Collecteur de vibration portable', 'ISO 20816-3'] },
      { type: 'PREVENTIVE', periodicity: 'Toutes les 2000 heures', description: { fr: 'Graissage des roulements avant et arrière à l\'aide de la pompe à graisse étalonnée', en: 'Regreasing bearings with calibrated manual grease gun' }, toolsAndStandards: ['Graisse lithium complexe', 'Pompe à graisse'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Mesure des pertes et détermination du rendement selon IEC 60034-2-1', 'Essai diélectrique 1800 V / 1 min'],
      siteAcceptanceTestsSat: ['Mesure d\'isolement enroulements statoriques (Megger 1000 V > 50 MΩ)', 'Contrôle d\'alignement laser arbre moteur/pompe (désalignement radial < 0.05 mm)'],
      commissioningProcedures: ['Contrôle du sens de rotation à vide', 'Mesure du courant absorbé à pleine charge sur les 3 phases']
    },

    applicableStandards: [
      { standardCode: 'IEC 60034-1', title: 'Rotating electrical machines - Rating and performance', relevantClauses: ['Clause 7 (Temperature rise)'], jurisdiction: 'International' },
      { standardCode: 'IEC 60034-30-1', title: 'Efficiency classes of line operated AC motors (IE code)', relevantClauses: ['Clause 5 (IE4 super premium efficiency limits)'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'distribution-engineer', title: { fr: 'Ingénieur Maintenance Électromécanique', en: 'Electromechanical Maintenance Engineer' }, tasks: { fr: 'Suivi vibratoire, graissage préventif et révision des machines tournantes', en: 'Vibration monitoring, bearing maintenance, and rotating equipment overhaul' } }
    ],
    lifecyclePhases: [
      { phase: 'OPERATION_MONITORING', deliverables: ['Rapports de suivi vibratoire', 'Relevés de consommation électrique'], involvedRoles: ['Technicien Mécanique'] }
    ],

    deliverablesAndDocuments: ['Plaque signalétique moteur', 'Fiche d\'alignement laser', 'Rapport d\'essais diélectriques'],
    provenance: {
      id: 'prov-exp-mot-01',
      entity_id: 'eq-exp-motor-ind-250kw',
      entity_type: 'equipment',
      source_ref: 'IEC 60034-1 & Spécification Moteurs Industriels Usine Bassa',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Machines & Conversion Review',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Rendement IE4 certifié à 400 V / 50 Hz sous charge nominale continue (service S1).',
      en: 'IE4 efficiency verified at rated 400 V / 50 Hz under continuous S1 duty cycle.'
    },

    representations: {
      physical: {
        svgVariant: 'LOAD_MOTOR',
        dimensionsLabel: '1.45 m × 0.75 m × 0.82 m',
        enclosureLabel: 'Carcasse fonte fermée TEFC IP55',
        maintenanceClearance: 'Dégagement arrière 0.5 m'
      },
      electrical: {
        symbolType: 'INDUCTION_MOTOR',
        incomerTerminal: 'Bornes statoriques 400 V (U1, V1, W1)',
        outgoingTerminal: 'Arbre mécanique cannelé rotatif',
        protectionZone: 'Zone protégée démarreur TeSys T',
        measurementTap: 'Tores TC intégrés dans le démarreur'
      },
      functional: {
        inputSignal: '400 V triphasé 50 Hz (432 A)',
        conversionProcess: 'Conversion électromagnétique via champ tournant et induction rotorique',
        outputSignal: 'Couple mécanique 1608 N·m à 1485 tr/min (250 kW)',
        feedbackLoop: 'Sondes de température thermistors PTC vers automate'
      }
    }
  }
];
