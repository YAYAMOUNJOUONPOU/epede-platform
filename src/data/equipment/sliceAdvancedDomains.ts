// src/data/equipment/sliceAdvancedDomains.ts
// EPEDE - Advanced Domains Canonical Equipment Slice (D06, D07, D09, D10, D11, D12, D13, D14, D15, D16)
// Compliant with IEC 61850, IEC 62933, IEC 61851, IEC 60099, IEC 60599, IEC 62443, IEC 62053, IEEE 80

import type { CanonicalEquipmentObject } from '../../types/equipmentExplorer';

export const ADVANCED_DOMAINS_ITEMS: any[] = [
  // 1. GRID-SCALE BATTERY ENERGY STORAGE SYSTEM (BESS 5 MW / 10 MWh) - D09
  {
    id: 'eq-exp-bess-container-5mw',
    tagIec: '=BESS.CONT01',
    name: {
      fr: 'Conteneur de Stockage BESS 5 MW / 10 MWh (LFP & Onduleur 4-Quadrants)',
      en: 'Grid BESS Container 5 MW / 10 MWh (LFP & 4-Quadrant PCS)'
    },
    aliases: {
      fr: ['Conteneur BESS', 'Batterie réseau stationnaire', 'Système de stockage LFP'],
      en: ['BESS Container', 'Utility-Scale Battery Storage', 'LFP Storage System']
    },
    equipmentType: 'BatteryEquipment',
    category: 'MODERN_EQUIPMENT',
    parentDomain: 'D09',
    systemStage: 'MV_DISTRIBUTION',
    subsystemContext: {
      fr: 'Plateforme BESS raccordée au jeu de barres 30 kV en poste d\'évacuation ou sous-station réseau',
      en: 'BESS platform interconnected to 30 kV busbar at substation or renewable farm collector'
    },
    technologyContext: {
      fr: 'Conteneur maritime 40ft IP54 climatisé liquide avec cellules prismatiques LiFePO4 (LFP) 280 Ah, BMS 3 niveaux, PCS 4 quadrants et extinction aérosol Novec 1230',
      en: '40ft IP54 liquid-cooled container housing 280 Ah LiFePO4 (LFP) prismatic cells, 3-tier BMS, 4-quadrant PCS, and Novec 1230 clean agent fire suppression'
    },
    applicationContext: {
      fr: 'Régulation rapide de fréquence (FFR), soutien de tension, écrêtement des pointes et arbitrage énergétique sur le réseau 30 kV',
      en: 'Fast frequency response (FFR), dynamic voltage support, peak shaving, and energy arbitrage on 30 kV grid'
    },
    voltageContext: {
      nominalVoltage: '30 kV AC (Sortie Transfo) / 1250 V DC (Bus DC interne)',
      level: 'MV',
      frequencyHz: 50,
      phases: '3-phase AC + Floating DC'
    },
    typicalLocation: {
      fr: 'Plateforme extérieure grillagée à côté du poste 225/30 kV',
      en: 'Outdoor fenced pad adjacent to 225/30 kV substation'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Système électrochimique conteneurisé convertissant et stockant l\'énergie électrique bidirectionnellement pour injecter ou absorber de la puissance active et réactive en millisecondes.',
      en: 'Containerized electrochemical storage system converting and storing electrical energy bidirectionally to inject or absorb active and reactive power within milliseconds.'
    },
    whyItExists: {
      fr: 'Compenser l\'intermittence des énergies renouvelables et maintenir la fréquence réseau lors des décrochages de groupes hydroélectriques ou thermiques.',
      en: 'Offset renewable generation intermittency and arrest grid frequency deviations during unexpected generator trips.'
    },
    primaryEngineeringRole: {
      fr: 'Réserve primaire instantanée (inertie synthétique) et réserve rapide de puissance active (FFR) avec temps de réponse <20 ms.',
      en: 'Synthetic inertia emulation and Fast Frequency Response (FFR) with step-response time <20 ms.'
    },
    engineeringProblemSolved: {
      fr: 'Absorption des excédents d\'énergie solaire/éolienne et injection dynamique en moins de 20 ms pour pallier la baisse de fréquence réseau.',
      en: 'Absorption of solar/wind surpluses and sub-20ms injection to arrest grid frequency drop and mitigate renewable intermittency.'
    },
    operatingPrincipleSummary: {
      fr: 'Stockage électrochimique Lithium Fer Phosphate couplé à un onduleur 4-quadrants réversible avec algorithme de régulation FFR.',
      en: 'Lithium Iron Phosphate electrochemical storage interfaced with a reversible 4-quadrant inverter featuring FFR control algorithm.'
    },
    primaryFunction: {
      fr: 'Support dynamique de fréquence, réserve de puissance active et lissage des pointes de charge sur le réseau HTA.',
      en: 'Dynamic frequency support, active power reserve, and peak shaving on the MV distribution grid.'
    },

    workingPrinciple: [
      {
        stepNumber: 1,
        title: { fr: 'Détection d\'écart fréquence/tension', en: 'Frequency/Voltage deviation sensing' },
        description: { fr: 'Le contrôleur d\'onduleur PCS échantillonne la tension réseau à 10 kHz et détecte une chute sous 49.8 Hz', en: 'PCS inverter controller samples grid waveform at 10 kHz detecting dip below 49.8 Hz' },
        physicalPhenomenon: { fr: 'Mesure PLL temps réel', en: 'Real-time PLL frequency tracking' },
        keyVariable: 'f_grid, df/dt (RoCoF)'
      },
      {
        stepNumber: 2,
        title: { fr: 'Décharge électrochimique des cellules', en: 'Electrochemical cell discharge' },
        description: { fr: 'Les ions Lithium migrent de l\'anode en graphite vers la cathode LiFePO4 à travers l\'électrolyte liquide', en: 'Lithium ions de-intercalate from graphite anode and migrate into LiFePO4 cathode' },
        physicalPhenomenon: { fr: 'Oxydoréduction réversible', en: 'Reversible electrochemical redox reaction' },
        keyVariable: 'I_dc, V_cell (2.8V - 3.65V)'
      },
      {
        stepNumber: 3,
        title: { fr: 'Conversion DC/AC 4 quadrants', en: '4-Quadrant DC/AC Inversion' },
        description: { fr: 'Les ponts IGBT ou SiC convertissent le bus 1250 V DC en courant alternatif sinusoïdal 690 V synchronisé au réseau', en: 'IGBT/SiC bridges synthesize 690 V sinusoidal AC waveform tightly synchronized to grid' },
        physicalPhenomenon: { fr: 'Modulation MLI (PWM)', en: 'High-frequency PWM power synthesis' },
        keyVariable: 'P_out, Q_out, cos phi'
      }
    ],

    physicalPhenomena: [
      {
        phenomenon: { fr: 'Échauffement Joule et dégradation SEI', en: 'Joule heating and SEI layer degradation' },
        description: { fr: 'La résistance interne des cellules génère des calories nécessitant un groupe chiller liquide maintenant la température entre 20°C et 25°C pour limiter la perte de capacité cyclique.', en: 'Internal cell resistance generates heat requiring a closed-loop liquid chiller maintaining cell temperature at 20-25°C to retard solid electrolyte interphase (SEI) growth.' },
        governingLaw: 'Q_heat = I_dc² · R_cell + T · dS/dt · I_dc'
      }
    ],

    subcomponents: [
      { id: 'bess-mod', name: { fr: 'Racks de modules LFP 280Ah', en: '280Ah LFP Battery Racks' }, function: { fr: 'Stockage électrochimique haute densité', en: 'High density electrochemical storage' }, materialOrTechnology: 'LiFePO4 prismatique', criticality: 'CRITICAL' },
      { id: 'bess-pcs', name: { fr: 'Onduleur bidirectionnel PCS 5 MW', en: '5 MW Bidirectional PCS Inverter' }, function: { fr: 'Conversion DC/AC 4 quadrants', en: '4-Quadrant DC/AC conversion' }, materialOrTechnology: 'IGBT 1700V / PWM 3-level', criticality: 'CRITICAL' },
      { id: 'bess-bms', name: { fr: 'Système BMS 3 Niveaux', en: '3-Tier Battery Management System' }, function: { fr: 'Surveillance tensions, T°, équilibrage et SoC/SoH', en: 'Voltage, T°, balancing, and SoC/SoH monitoring' }, materialOrTechnology: 'CAN-bus redondant', criticality: 'CRITICAL' },
      { id: 'bess-fss', name: { fr: 'Système anti-incendie Novec 1230 & Détection H2/CO', en: 'Novec 1230 & H2/CO Off-gas Detection' }, function: { fr: 'Détection précoce d\'emballement thermique', en: 'Early thermal runaway detection and suppression' }, materialOrTechnology: 'Capteurs gaz optiques + Novec', criticality: 'CRITICAL' }
    ],

    energyRole: {
      inputEnergy: '30 kV AC / 690 V AC (Recharge)',
      outputEnergy: '5 MW / 10 MWh sous 30 kV (Décharge)',
      conversionEfficiency: 'Rendement Aller-Retour (RTE) ~88.5%',
      thermalDissipation: 'Refroidissement liquide eau-glycol boucle fermée 120 kWth'
    },

    upstreamConnections: [
      { apparatusId: 'node-feeder-30-ind', apparatusName: 'Cellule Départ 30 kV', connectionType: 'Câble HTA Cuivre 3×240 mm² vers transformateur élévateur 0.69/30 kV' }
    ],
    downstreamConnections: [
      { apparatusId: 'node-sub-oyomabang', apparatusName: 'Jeu de Barres Réseau 30 kV', connectionType: 'Injection active/réactive synchronisée' }
    ],

    keyEngineeringValues: [
      { key: 'P_rated', label: { fr: 'Puissance Active Nominale', en: 'Rated Active Power' }, value: 5.0, unit: 'MW', status: 'VERIFIED' },
      { key: 'E_rated', label: { fr: 'Capacité Énergétique Nominale', en: 'Rated Energy Capacity' }, value: 10.0, unit: 'MWh', status: 'VERIFIED' },
      { key: 'C_rate', label: { fr: 'Régime de Décharge Nominal', en: 'Nominal C-Rate' }, value: '0.5 C (2 heures)', unit: '', status: 'VERIFIED' },
      { key: 'Cell_chem', label: { fr: 'Chimie des Cellules', en: 'Cell Chemistry' }, value: 'LiFePO4 (LFP)', unit: '', status: 'VERIFIED' },
      { key: 'Response_time', label: { fr: 'Temps de Réponse en Puissance', en: 'Full Power Response Time' }, value: 20, unit: 'ms', status: 'VERIFIED' },
      { key: 'Cycle_life', label: { fr: 'Durée de Vie Cyclique à 80% DoD', en: 'Cycle Life at 80% DoD' }, value: 6000, unit: 'cycles', status: 'REPRESENTATIVE' }
    ],

    associatedProtections: [
      { functionAnsi: 'BMS Overvoltage / Undervoltage', deviceTag: '-BMS01', tripCondition: { fr: 'Tension cellule > 3.65 V ou < 2.50 V', en: 'Cell voltage > 3.65 V or < 2.50 V' }, targetActuator: 'Ouverture disjoncteur DC principal' },
      { functionAnsi: '50/51/67', deviceTag: '-F01', tripCondition: { fr: 'Surintensité côté AC ou court-circuit interne', en: 'AC overcurrent or internal short circuit' }, targetActuator: 'Déclenchement disjoncteur 30 kV' }
    ],

    instrumentationAndMeasurements: [
      { parameter: 'SoC (State of Charge)', sensorType: 'Coulomb Counter + Algorithme Filtre de Kalman', typicalRange: '5% - 95%' },
      { parameter: 'SoH (State of Health)', sensorType: 'Modèle impédance spectrale et cycle counting', typicalRange: '70% - 100%' },
      { parameter: 'Températures Cellules', sensorType: 'Thermocouples PT1000 intégrés aux barrettes', typicalRange: '18°C - 35°C' }
    ],

    automationAndControl: {
      fr: 'Contrôleur central BESS (EMS/PMS) exécutant les lois de dispatch P-f et Q-V avec interface CEI 61850 / Modbus TCP.',
      en: 'Central BESS controller (EMS/PMS) executing P-f droop and Q-V control over IEC 61850 / Modbus TCP.'
    },

    telecomAndProtocols: {
      protocols: ['IEC 61850 MMS/GOOSE', 'Modbus TCP', 'DNP3', 'MQTT Sparkplug B'],
      physicalInterface: 'Double port fibre optique 1000Base-FX (PRP redundancy)'
    },

    earthingAndGrounding: {
      regime: 'IT' as any,
      description: { fr: 'Bus continu 1250 V flottant avec contrôleur permanent d\'isolement (CPI) et masse métallique reliée à la grille IEEE 80', en: '1250 V DC floating bus with insulation monitoring device (IMD), container frame bonded to IEEE 80 grid' }
    },

    insulationAndDielectric: {
      insulationMedium: 'Isolation galvanique par transformateur élévateur 0.69/30 kV dédié',
      creepageDistance: '31 mm/kV (Zone polluée)',
      bilRatingKv: 170
    },

    installationRequirements: {
      fr: 'Dalle béton armé avec rétention d\'eau d\'incendie, espacement de sécurité 3 m selon NFPA 855 et voie d\'accès pompiers.',
      en: 'Reinforced concrete foundation with fire water runoff retention, 3 m safety separation per NFPA 855 and fire brigade access.'
    },

    operatingStates: ['ENERGIZED', 'DE_ENERGIZED', 'AVAILABLE', 'UNDER_MAINTENANCE', 'FAULTED'],

    failureModesFmea: [
      {
        code: 'FM-BESS-01',
        name: { fr: 'Emballement Thermique Cellule (Thermal Runaway)', en: 'Cell Thermal Runaway' },
        rootCause: { fr: 'Court-circuit interne par dendrite ou défaut de fabrication', en: 'Internal micro-short from dendritic lithium growth or defect' },
        consequenceOnSystem: { fr: 'Dégagement de gaz combustibles (H2, CO) et risque de propagation incendie', en: 'Release of combustible off-gases (H2, CO) and thermal propagation risk' },
        protectiveResponse: { fr: 'Détection précoce gaz off-gas, injection Novec 1230 et isolement électrique instantané', en: 'Early off-gas detection, Novec discharge, and instantaneous electrical isolation' },
        severity: 'CATASTROPHIC'
      }
    ],

    safetyRisksAndLoto: {
      hazards: ['Risque d\'arc électrique DC 1250V (Arc Flash)', 'Danger chimique et gaz toxiques', 'Risque d\'incendie'],
      lotoSteps: [
        'Ordre d\'arrêt puissance via IHM EMS',
        'Ouverture disjoncteur 30 kV côté AC',
        'Ouverture sectionneurs DC des racks batteries',
        'Vérification d\'absence de tension (VAT) DC avec EPI 40 cal/cm²',
        'Pose des cadenas LOTO sur interrupteurs DC'
      ]
    },

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Mensuelle', description: { fr: 'Inspection du circuit de refroidissement liquide, niveau de glycol et filtres d\'air', en: 'Inspect liquid chiller coolant level, pumps, and air filtration' }, toolsAndStandards: ['Réfractomètre glycol', 'Manomètres de pression'] },
      { type: 'CONDITION_BASED', periodicity: 'Continue', description: { fr: 'Surveillance automatique de la dérive de résistance interne et tension résiduelle de chaque cellule', en: 'Automated monitoring of cell delta-voltage and internal resistance degradation' }, toolsAndStandards: ['Algorithme AI BMS'] }
    ],

    testingAndCommissioning: {
      factoryTestsFat: ['Essai de capacité nominale à 0.5C', 'Test de réponse indicielle 0 à 100% de puissance', 'Test d\'arrêt d\'urgence et extinction incendie'],
      siteAcceptanceTestsSat: ['Test de raccordement réseau et conformité Code Réseau (Grid Code)', 'Vérification du temps de réponse FFR <20 ms', 'Test d\'îlotage anti-islanding'],
      commissioningProcedures: ['Équilibrage initial des modules de batterie avant mise en parallèle']
    },

    applicableStandards: [
      { standardCode: 'IEC 62933-2-1', title: 'Electrical energy storage (EES) systems - Unit specification and testing', relevantClauses: ['Clause 6'], jurisdiction: 'International' },
      { standardCode: 'IEC 62619', title: 'Secondary lithium cells and batteries for use in industrial applications - Safety', relevantClauses: ['Clause 7, 8'], jurisdiction: 'International' },
      { standardCode: 'NFPA 855', title: 'Standard for the Installation of Stationary Energy Storage Systems', relevantClauses: ['Chapter 4, 9'], jurisdiction: 'USA / International Reference' }
    ],

    associatedEngineeringRoles: [
      { roleSlug: 'storage-engineer', title: { fr: 'Ingénieur Systèmes de Stockage BESS', en: 'BESS Storage Systems Engineer' }, tasks: { fr: 'Dimensionnement énergétique, stratégie de dégradation et conformité aux règles d\'interconnexion réseau', en: 'Energy sizing, degradation mitigation, and grid code compliance modeling' } }
    ],

    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Étude d\'intégration réseau BESS', 'Analyse des risques d\'emballement thermique HazOp'], involvedRoles: ['Ingénieur Stockage', 'Ingénieur Sécurité'] }
    ],

    deliverablesAndDocuments: ['Spécification technique BESS 5MW/10MWh', 'Schéma unifilaire d\'évacuation', 'Plan de protection incendie NFPA 855', 'Rapport de mise en service Grid Code'],
    provenance: {
      id: 'prov-bess-5mw',
      entity_id: 'eq-exp-bess-container-5mw',
      entity_type: 'equipment',
      source_ref: 'IEC 62933 & CIGRE B5 BESS Engineering Practice',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Energy Storage Committee',
      verified_at: '2026-09-25'
    },

    assumptionsAndLimitations: {
      fr: 'Capacité garantie sur 10 ans sous réserve d\'un profil de 1.5 cycle/jour maximum et température ambiante moyenne <35°C.',
      en: '10-year capacity retention warranty assumes max 1.5 equivalent full cycles/day and mean ambient temperature <35°C.'
    },

    representations: {
      physical: {
        svgVariant: 'BESS',
        dimensionsLabel: '12.2 m × 2.44 m × 2.9 m (Conteneur ISO 40ft)',
        enclosureLabel: 'Conteneur acier Corten peint C5-M anticorrosion',
        maintenanceClearance: 'Zone de sécurité périmétrique 3.0 m'
      },
      electrical: {
        symbolType: 'BATTERY_STORAGE',
        incomerTerminal: 'Bornes 30 kV via transformateur élévateur',
        outgoingTerminal: 'Barres DC 1250 V internes',
        protectionZone: 'Zone départ 30 kV & Busbar BESS',
        measurementTap: 'TC/TP classe 0.2S au disjoncteur général'
      },
      functional: {
        inputSignal: 'Fréquence f_grid et consigne de puissance active P_ref',
        conversionProcess: 'Onduleur 4 quadrants MLI asservi en courant',
        outputSignal: 'Puissance active P et réactive Q injectées au réseau',
        feedbackLoop: 'Boucle rapide de régulation de fréquence droop 2%'
      }
    }
  },

  // 2. ULTRA-FAST HIGH POWER EV CHARGER (HPC 350-400 kW) - D10
  {
    id: 'eq-exp-ev-hpc-350kw',
    tagIec: '=EVSE.HPC01',
    name: {
      fr: 'Borne de Recharge Ultra-Rapide IRVE 350 kW (CCS2 Câble Refroidi)',
      en: 'Ultra-Fast High Power EV Charger 350 kW (Liquid-Cooled CCS2)'
    },
    aliases: {
      fr: ['Borne HPC 350kW', 'Superchargeur DC', 'Station de recharge ultra-rapide'],
      en: ['HPC 350kW Charger', 'DC Fast Charger (DCFC)', 'High Power EVSE']
    },
    equipmentType: 'EVSEEquipment',
    category: 'MODERN_EQUIPMENT',
    parentDomain: 'D10',
    systemStage: 'FINAL_CIRCUITS_LOADS',
    subsystemContext: {
      fr: 'Station de recharge autoroutière ou hub de transport lourd raccordé au réseau BT 400 V ou poste HTA dédié',
      en: 'Highway fast-charging plaza or electric bus/truck depot fed from dedicated MV/LV substation'
    },
    technologyContext: {
      fr: 'Redresseurs modulaires SiC (Carbure de Silicium) haute efficacité (96.5%), câble combiné CCS Combo 2 avec refroidissement liquide actif (500 A continu) et communication ISO 15118',
      en: 'Silicon Carbide (SiC) high-efficiency power modules (96.5%), liquid-cooled CCS Combo 2 tethered cables (500 A continuous), and ISO 15118 Plug & Charge'
    },
    applicationContext: {
      fr: 'Recharge ultra-rapide de véhicules légers et utilitaires lourds (10% à 80% en 15 minutes) avec régulation dynamique de charge (DLM)',
      en: 'Ultra-fast passenger and commercial EV charging (10% to 80% in 15 mins) with Dynamic Load Management (DLM)'
    },
    voltageContext: {
      nominalVoltage: '400 V AC Triphasé (Entrée) / 200 - 1000 V DC (Sortie)',
      level: 'LV',
      frequencyHz: 50,
      phases: '3-phase AC Input / Regulated DC Output'
    },
    typicalLocation: {
      fr: 'Aire de service routière ou parking de flotte logistique',
      en: 'Highway service area or commercial fleet charging depot'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Borne de recharge haute puissance en courant continu assurant la conversion AC/DC et le contrôle sécurisé de transfert d\'énergie vers la batterie de traction du véhicule électrique.',
      en: 'High-power direct current electric vehicle supply equipment converting AC power to dynamically controlled DC output delivered directly to EV battery.'
    },
    whyItExists: {
      fr: 'Permettre aux véhicules électriques une autonomie interurbaine sans temps d\'immobilisation prolongé grâce à des puissances de transfert jusqu\'à 350 kW.',
      en: 'Enable long-distance electric mobility with minimal dwell time through continuous charging rates up to 350 kW.'
    },
    primaryEngineeringRole: {
      fr: 'Conversion AC/DC pilotée en courant avec isolation galvanique, négociation sécurisée des profils de charge et gestion de la pointe électrique.',
      en: 'Galvanically isolated current-controlled AC/DC conversion with cryptographic charge profile negotiation and peak demand mitigation.'
    },
    engineeringProblemSolved: {
      fr: 'Recharge ultra-rapide en 15 minutes des batteries de véhicules électriques haute tension (800V) sans échauffement destructif des conducteurs.',
      en: '15-minute ultra-fast charging of high-voltage (800V) EV traction packs without destructive conductor thermal runaway.'
    },
    operatingPrincipleSummary: {
      fr: 'Conversion AC/DC par ponts SiC haute fréquence avec câble CCS2 à refroidissement liquide actif et protocole numérique ISO 15118.',
      en: 'High-frequency SiC bridge AC/DC conversion with active liquid-cooled CCS2 cable and ISO 15118 digital protocol.'
    },
    primaryFunction: {
      fr: 'Fourniture d\'énergie continue régulée jusqu\'à 500 A et 350 kW pour la recharge ultra-rapide des véhicules électriques.',
      en: 'Regulated DC power delivery up to 500 A and 350 kW for ultra-fast electric vehicle charging.'
    },

    workingPrinciple: [
      {
        stepNumber: 1,
        title: { fr: 'Connexion et négociation de sécurité', en: 'Handshake and safety verification' },
        description: { fr: 'Le câble CCS est branché, communication PWM sur Control Pilot (CP) et échange cryptographique TLS selon ISO 15118-20 (Plug & Charge)', en: 'CCS plug inserted, CP PWM handshake initiates, and cryptographic TLS exchange establishes session per ISO 15118-20' },
        physicalPhenomenon: { fr: 'Communication CPL (HomePlug GreenPHY)', en: 'PLC digital communication over CP conductor' },
        keyVariable: 'CP PWM state, TLS handshake'
      },
      {
        stepNumber: 2,
        title: { fr: 'Isolement et précharge', en: 'Insulation test & Pre-charge' },
        description: { fr: 'Le chargeur teste la résistance d\'isolement du câble et ajuste sa tension DC à ±10 V de la tension batterie avant fermeture des contacteurs', en: 'Charger tests cable insulation resistance and ramps output DC voltage to match vehicle battery pack within ±10 V before contactor closure' },
        physicalPhenomenon: { fr: 'Mesure de résistance d\'isolement', en: 'High voltage insulation testing' },
        keyVariable: 'R_iso > 500 kOhm, V_dc = V_pack'
      },
      {
        stepNumber: 3,
        title: { fr: 'Charge rapide régulée en courant', en: 'High current charging phase' },
        description: { fr: 'Les modules SiC injectent jusqu\'à 500 A en suivant les requêtes cycliques (100 ms) du BMS du véhicule', en: 'SiC modules deliver up to 500 A following cyclic (100 ms) current target requests from EV BMS' },
        physicalPhenomenon: { fr: 'Commutation haute fréquence SiC', en: 'High frequency SiC MOSFET switching' },
        keyVariable: 'I_out (0-500 A), P_out (0-350 kW)'
      }
    ],

    physicalPhenomena: [
      {
        phenomenon: { fr: 'Échauffement du câble et refroidissement liquide', en: 'Cable Joule heating and liquid cooling' },
        description: { fr: 'À 500 A continus, le conducteur dissipe plusieurs centaines de watts, nécessitant une circulation d\'hydrocarbure synthétique diélectrique ou eau-glycol pour maintenir la gaine <50°C.', en: 'At 500 A continuous, cable conductors dissipate substantial heat, requiring active dielectric oil or glycol coolant circulation to keep handle and cable below 50°C touch limits.' },
        governingLaw: 'T_cable = T_amb + I² · R_cond / G_cool'
      }
    ],

    subcomponents: [
      { id: 'hpc-sic-mod', name: { fr: 'Modules redresseurs SiC 50 kW (x7)', en: '50 kW SiC Power Rectifier Modules (x7)' }, function: { fr: 'Conversion AC/DC 400V -> 1000V', en: 'AC/DC rectification 400V to 1000V' }, materialOrTechnology: 'SiC MOSFET 1200V', criticality: 'CRITICAL' },
      { id: 'hpc-cable', name: { fr: 'Câble CCS2 à refroidissement liquide 500A', en: 'Liquid-Cooled 500A CCS2 Cable & Gun' }, function: { fr: 'Transfert haute intensité sécurisé', en: 'High ampacity safe power delivery' }, materialOrTechnology: 'Cuivre + Micro-canaux glycol', criticality: 'CRITICAL' },
      { id: 'hpc-iso-ctrl', name: { fr: 'Contrôleur de communication ISO 15118', en: 'ISO 15118 PLC Communications Controller' }, function: { fr: 'Authentification et négociation de charge', en: 'Plug & Charge negotiation' }, materialOrTechnology: 'Qualcomm GreenPHY SoC', criticality: 'HIGH' }
    ],

    energyRole: {
      inputEnergy: '400 V AC Triphasé 50 Hz, jusqu\'à 550 A',
      outputEnergy: '200 - 1000 V DC, jusqu\'à 350 kW',
      conversionEfficiency: '96.5% à pleine charge',
      thermalDissipation: 'Refroidissement forcé à air (armoire) + liquide (câble)'
    },

    upstreamConnections: [
      { apparatusId: 'node-tgbt-400', apparatusName: 'TGBT 400 V', connectionType: 'Départ disjoncteur 630 A avec protection différentielle Type B' }
    ],
    downstreamConnections: [
      { apparatusId: 'node-load-ev-pack', apparatusName: 'Pack Batterie Véhicule 800V', connectionType: 'Connecteur combo CCS2 avec verrouillage mécanique motorisé' }
    ],

    keyEngineeringValues: [
      { key: 'P_max', label: { fr: 'Puissance Maximale Continue', en: 'Max Continuous Power' }, value: 350, unit: 'kW', status: 'VERIFIED' },
      { key: 'V_out_max', label: { fr: 'Tension Maximale de Sortie', en: 'Max DC Output Voltage' }, value: 1000, unit: 'V', status: 'VERIFIED' },
      { key: 'I_out_max', label: { fr: 'Courant Maximal Continu', en: 'Max DC Output Current' }, value: 500, unit: 'A', status: 'VERIFIED' },
      { key: 'Efficiency', label: { fr: 'Rendement de Conversion', en: 'Peak Efficiency' }, value: 96.5, unit: '%', status: 'VERIFIED' },
      { key: 'IP_rating', label: { fr: 'Indice de Protection Enveloppe', en: 'Enclosure Protection Rating' }, value: 'IP54 / IK10', unit: '', status: 'VERIFIED' }
    ],

    associatedProtections: [
      { functionAnsi: 'RCMB / 6mA DC', deviceTag: '-RCM01', tripCondition: { fr: 'Courant de fuite continu > 6 mA DC ou résiduel alternatif > 30 mA', en: 'DC residual leakage > 6 mA or AC residual > 30 mA' }, targetActuator: 'Coupure contacteur amont' },
      { functionAnsi: 'Overvoltage / Overcurrent DC', deviceTag: '-DC_PROT', tripCondition: { fr: 'Tension > 1020 V ou courant > 520 A pendant 50 ms', en: 'DC voltage > 1020 V or current > 520 A for 50 ms' }, targetActuator: 'Blocage impulsions SiC et ouverture contacteur DC' }
    ],

    instrumentationAndMeasurements: [
      { parameter: 'Énergie Délivrée (kWh)', sensorType: 'Compteur certifié MID / DC Eichrecht', typicalRange: '0 - 1000 kWh' },
      { parameter: 'Température Embout CCS', sensorType: 'Sondes PT1000 sur broches DC+ et DC-', typicalRange: '20°C - 90°C' }
    ],

    automationAndControl: {
      fr: 'Gestionnaire dynamique de délestage DLM (Dynamic Load Management) asservissant la puissance totale au contrat souscrit du transformateur.',
      en: 'Dynamic Load Management (DLM) controller modulating charging power based on local transformer capacity headroom.'
    },

    telecomAndProtocols: {
      protocols: ['OCPP 2.0.1 (vers Superviseur CPO)', 'ISO 15118-20 (vers Véhicule)', 'Modbus TCP (vers TGBT)'],
      physicalInterface: 'Ethernet RJ45 / Modem 4G LTE sécurisé VPN'
    },

    earthingAndGrounding: {
      regime: 'TN-S' as any,
      description: { fr: 'Régime TN-S avec conducteur PE continu relié à la carcasse et surveillance de terre du véhicule', en: 'TN-S earthing with continuous PE conductor and vehicle chassis ground continuity check' }
    },

    insulationAndDielectric: {
      insulationMedium: 'Isolation renforcée classe II côté DC et isolation galvanique',
      creepageDistance: '16 mm (CEI 60664-1 degré de pollution 3)',
      bilRatingKv: 6
    },

    installationRequirements: {
      fr: 'Massif béton avec passage de fourreaux 160 mm, arrêt d\'urgence accessible et butée de roue anti-collision.',
      en: 'Concrete pad with 160 mm conduits, visible emergency stop button, and mechanical wheel stops.'
    },

    operatingStates: ['ENERGIZED', 'AVAILABLE', 'CLOSED', 'UNDER_MAINTENANCE', 'FAULTED'],

    failureModesFmea: [
      {
        code: 'FM-HPC-01',
        name: { fr: 'Échauffement excessif des broches de charge', en: 'Charging Contact Overheating' },
        rootCause: { fr: 'Usure des contacts femelles ou encrassement de la prise véhicule', en: 'Worn contact springs or contamination in vehicle inlet' },
        consequenceOnSystem: { fr: 'Dégradation thermique du connecteur et risque d\'incendie', en: 'Thermal damage to connector and potential melting risk' },
        protectiveResponse: { fr: 'Réduction automatique de l\'intensité à 80°C et arrêt d\'urgence à 90°C', en: 'Current derating at 80°C and emergency disconnect at 90°C' },
        severity: 'MAJOR'
      }
    ],

    safetyRisksAndLoto: {
      hazards: ['Choc électrique DC 1000V sous forte énergie', 'Écrasement câble par véhicule', 'Défaillance de refroidissement'],
      lotoSteps: [
        'Déconnexion de la session véhicule',
        'Ouverture disjoncteur 400V amont et condamnation cadenas',
        'Décharge des condensateurs DC (<50V en 60 secondes)',
        'Contrôle d\'absence de tension VAT sur bornes DC'
      ]
    },

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Trimestrielle', description: { fr: 'Contrôle visuel des câbles, broches CCS, niveau de liquide de refroidissement et dépoussiérage des filtres', en: 'Inspect CCS pins, cable sheath integrity, coolant level, and intake air filters' }, toolsAndStandards: ['Jauge d\'usure broches', 'Caméra thermique'] },
      { type: 'TESTING_COMMISSIONING', periodicity: 'Annuelle', description: { fr: 'Vérification métrologique MID et test de déclenchement du différentiel Type B 30 mA', en: 'MID energy calibration check and 30 mA Type B RCD trip timing test' }, toolsAndStandards: ['Simulateur de véhicule EVSE Tester Comemso'] }
    ],

    testingAndCommissioning: {
      factoryTestsFat: ['Essai diélectrique 2.5 kV AC', 'Test de puissance à 350 kW sur banc de charge DC', 'Validation interopérabilité OCPP 2.0.1'],
      siteAcceptanceTestsSat: ['Test de continuité de terre PE', 'Mesure du temps d\'arrêt d\'urgence (<100 ms)', 'Test de session de charge réelle sur véhicule 800V'],
      commissioningProcedures: ['Configuration des identifiants OCPP et certificats de sécurité TLS']
    },

    applicableStandards: [
      { standardCode: 'IEC 61851-1', title: 'Electric vehicle conductive charging system - General requirements', relevantClauses: ['Clause 8, 9'], jurisdiction: 'International' },
      { standardCode: 'IEC 61851-23', title: 'DC electric vehicle supply equipment', relevantClauses: ['Clause 101, 102'], jurisdiction: 'International' },
      { standardCode: 'ISO 15118-20', title: 'Road vehicles - Vehicle to grid communication interface - Network and application protocol', relevantClauses: ['Part 20'], jurisdiction: 'International' }
    ],

    associatedEngineeringRoles: [
      { roleSlug: 'charging-engineer', title: { fr: 'Ingénieur Infrastructures de Recharge IRVE', en: 'EV Infrastructure Systems Engineer' }, tasks: { fr: 'Dimensionnement des raccordements réseau, architecture DLM et interopérabilité OCPP/ISO', en: 'Grid interconnection sizing, DLM architecture, and OCPP/ISO interoperability testing' } }
    ],

    lifecyclePhases: [
      { phase: 'SITE_INSTALLATION', deliverables: ['Dossier d\'exécution IRVE', 'Rapport de conformité Consuel'], involvedRoles: ['Ingénieur Travaux', 'Contrôleur Bureau de Contrôle'] }
    ],

    deliverablesAndDocuments: ['Plan de câblage armoire HPC', 'Calcul de chute de tension câble 400V', 'Certificat d\'étalonnage Eichrecht/MID'],
    provenance: {
      id: 'prov-ev-350kw',
      entity_id: 'eq-exp-ev-hpc-350kw',
      entity_type: 'equipment',
      source_ref: 'CharIN CCS Specification & IEC 61851-23',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE E-Mobility Taskforce',
      verified_at: '2026-09-25'
    },

    assumptionsAndLimitations: {
      fr: 'Puissance maximale 350 kW disponible uniquement pour les véhicules équipés d\'une architecture 800V et acceptant 500 A.',
      en: 'Max 350 kW rate requires EV with 800V battery architecture accepting full 500 A current rating.'
    },

    representations: {
      physical: {
        svgVariant: 'PANEL',
        dimensionsLabel: '0.90 m × 0.85 m × 2.20 m (Borne satellite) + Rack puissance',
        enclosureLabel: 'Armoire aluminium brossé thermolaquée IP54 / IK10',
        maintenanceClearance: 'Zone libre 1.5 m devant la face avant'
      },
      electrical: {
        symbolType: 'EV_CHARGING',
        incomerTerminal: 'Bornes triphasées 400 V L1, L2, L3, N, PE',
        outgoingTerminal: 'Connecteur CCS2 DC+, DC-, PE, CP, PP',
        protectionZone: 'Départ TGBT et boucle interne DC',
        measurementTap: 'Compteur d\'énergie certifié MID en sortie DC'
      },
      functional: {
        inputSignal: 'Consigne véhicule I_target et tension mesurée V_dc',
        conversionProcess: 'Redressement actif PFC + abaisseur/élévateur résonant LLC',
        outputSignal: 'Courant continu lissé vers la batterie traction',
        feedbackLoop: 'Boucle PID numérique de régulation de courant (temps de réponse <10 ms)'
      }
    }
  },

  // 3. STATCOM MMC ±50 MVAR - D11
  {
    id: 'eq-exp-statcom-mmc-50mvar',
    tagIec: '=PQ.STAT01',
    name: {
      fr: 'Compensateur Statique d\'Énergie Réactive STATCOM MMC ±50 Mvar (225 kV)',
      en: 'Modular Multilevel STATCOM ±50 Mvar Static Compensator (225 kV)'
    },
    aliases: {
      fr: ['STATCOM MMC', 'Compensateur statique rapide', 'FACTS de tension'],
      en: ['MMC STATCOM', 'Static Synchronous Compensator', 'Grid FACTS Device']
    },
    equipmentType: 'InverterEquipment',
    category: 'MODERN_EQUIPMENT',
    parentDomain: 'D11',
    systemStage: 'HV_EHV_TRANSMISSION',
    subsystemContext: {
      fr: 'Poste d\'interconnexion 225 kV à proximité de charges industrielles perturbatrices ou lignes longues',
      en: '225 kV transmission substation near heavy fluctuating industrial loads or long lines'
    },
    technologyContext: {
      fr: 'Convertisseur multiniveaux modulaire (MMC) en pont en H avec cellules capacitives à IGBT 4.5 kV, réactances de bras et transformateur de couplage 225 kV',
      en: 'Modular Multilevel Converter (MMC) full-bridge submodules with 4.5 kV IGBTs, arm reactors, and dedicated 225 kV coupling transformer'
    },
    applicationContext: {
      fr: 'Maintien dynamique de la tension sous creux de tension, compensation de flicker (fours à arc) et amortissement des oscillations de puissance',
      en: 'Fast voltage support during grid faults, flicker compensation for arc furnaces, and power oscillation damping (POD)'
    },
    voltageContext: {
      nominalVoltage: '225 kV (Réseau) / 33 kV (Secondaire Transfo Couplage)',
      level: 'HV',
      frequencyHz: 50,
      phases: '3-phase AC'
    },
    typicalLocation: {
      fr: 'Bâtiment dédié (Valve Hall) et cour extérieure pour transformateur et réactances',
      en: 'Dedicated valve hall building with outdoor yard for transformers and cooling'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Générateur statique de puissance réactive basé sur convertisseur de tension (VSC) capable d\'injecter ou d\'absorber du courant réactif inductif ou capacitif indépendamment de la tension réseau.',
      en: 'Voltage-source converter based shunt FACTS device capable of generating or absorbing controllable reactive current independently of AC system voltage.'
    },
    whyItExists: {
      fr: 'Fournir un soutien de tension ultra-rapide (<15 ms) là où les gradins de condensateurs mécaniques sont trop lents et inefficaces sous forte baisse de tension.',
      en: 'Deliver sub-cycle (<15 ms) reactive power support where mechanical capacitor banks are too sluggish and lose effectiveness at reduced voltages.'
    },
    primaryEngineeringRole: {
      fr: 'Stabilisation dynamique du profil de tension 225 kV et respect des marges de stabilité transitoire selon le Code Réseau.',
      en: 'Dynamic 225 kV voltage stabilization and transient stability margin enhancement per Grid Code.'
    },
    engineeringProblemSolved: {
      fr: 'Maintien de la stabilité de tension sur réseau de transport THT sous fortes fluctuations de charge industrielle ou creux de tension transitoires.',
      en: 'Voltage stability preservation on EHV transmission grid during steep industrial load swings or transient fault voltage dips.'
    },
    operatingPrincipleSummary: {
      fr: 'Génération de tension sans filtre par convertisseur modulaire multiniveaux (MMC) injectant ou absorbant du courant réactif en quadrature.',
      en: 'Filterless voltage generation by modular multilevel converter (MMC) injecting or absorbing quadrature reactive current.'
    },
    primaryFunction: {
      fr: 'Compensation dynamique continue de puissance réactive et régulation rapide de tension sur jeu de barres 225 kV.',
      en: 'Continuous dynamic reactive power compensation and fast voltage control on 225 kV busbars.'
    },

    workingPrinciple: [
      {
        stepNumber: 1,
        title: { fr: 'Génération de tension interne par MMC', en: 'Internal AC Voltage Synthesis' },
        description: { fr: 'Les centaines de sous-modules capacitifs sont insérés ou shuntés séquentiellement pour former une onde sinusoïdale pure à très faible taux d\'harmoniques sans filtre passif', en: 'Hundreds of submodule capacitors are switched to synthesize a smooth sinusoidal staircase voltage waveform with minimal THD' },
        physicalPhenomenon: { fr: 'Synthèse multiniveau', en: 'Multilevel PWM staircase voltage synthesis' },
        keyVariable: 'V_conv, N_submodules'
      },
      {
        stepNumber: 2,
        title: { fr: 'Contrôle du flux réactif par déphasage nul', en: 'Zero Phase Reactive Current Flow' },
        description: { fr: 'En maintenant la tension du convertisseur en phase avec la tension réseau, la différence d\'amplitude (V_conv - V_grid) à travers la réactance de liaison crée un courant purement réactif', en: 'By maintaining converter voltage in-phase with grid voltage, the amplitude differential across the coupling reactance drives pure reactive current' },
        physicalPhenomenon: { fr: 'Loi d\'Ohm en courant alternatif', en: 'AC reactive power transfer equation' },
        keyVariable: 'Q = V_grid · (V_conv - V_grid) / X_L'
      }
    ],

    physicalPhenomena: [
      {
        phenomenon: { fr: 'Pertes de commutation et gestion thermique de l\'eau déionisée', en: 'IGBT switching losses and deionized water cooling' },
        description: { fr: 'Les valves IGBT dissipent plusieurs centaines de kilowatts sous haute tension, imposant un circuit d\'eau déionisée ultra-pure avec conductivité <0.1 µS/cm pour éviter tout amorçage électrique.', en: 'High-voltage IGBT valves dissipate substantial switching losses, demanding closed-loop ultra-pure deionized water cooling with conductivity <0.1 µS/cm to prevent flashover.' },
        governingLaw: 'Conductivité sigma < 0.1 µS/cm, Q_loss = 0.8% · S_nom'
      }
    ],

    subcomponents: [
      { id: 'stat-valves', name: { fr: 'Bras de valves MMC à sous-modules IGBT', en: 'MMC IGBT Submodule Valve Towers' }, function: { fr: 'Génération multiniveau de l\'onde de tension', en: 'Multilevel staircase voltage generation' }, materialOrTechnology: 'IGBT 4.5 kV Press-pack', criticality: 'CRITICAL' },
      { id: 'stat-trafo', name: { fr: 'Transformateur de couplage 225/33 kV', en: '225/33 kV Coupling Transformer' }, function: { fr: 'Raccordement réseau et adaptation de tension', en: 'Grid matching and voltage transformation' }, materialOrTechnology: 'ONAF / Huile minérale', criticality: 'CRITICAL' },
      { id: 'stat-reactor', name: { fr: 'Inductances de bras (Arm Reactors)', en: 'Air-Core Arm Reactors' }, function: { fr: 'Limitation des courants de circulation et de court-circuit', en: 'Circulating current suppression' }, materialOrTechnology: 'Bobines à air sans fer', criticality: 'CRITICAL' }
    ],

    energyRole: {
      inputEnergy: 'Alimentation pertes auxiliaires 400 V AC (~400 kW)',
      outputEnergy: '±50 Mvar de puissance réactive régulée sur 225 kV',
      conversionEfficiency: 'Pertes totales <0.8% à puissance nominale',
      thermalDissipation: 'Aéroréfrigérants eau déionisée / air extérieur'
    },

    upstreamConnections: [
      { apparatusId: 'node-sub-oyomabang', apparatusName: 'Jeu de Barres 225 kV', connectionType: 'Travée disjoncteur 225 kV dédiée avec sectionneurs' }
    ],
    downstreamConnections: [],

    keyEngineeringValues: [
      { key: 'Q_rated', label: { fr: 'Puissance Réactive Nominale', en: 'Rated Reactive Power' }, value: '±50', unit: 'Mvar', status: 'VERIFIED' },
      { key: 'V_grid_nom', label: { fr: 'Tension Nominale Réseau', en: 'Nominal Grid Voltage' }, value: 225, unit: 'kV', status: 'VERIFIED' },
      { key: 'Response_time', label: { fr: 'Temps de Réponse Dynamique', en: 'Dynamic Response Time' }, value: 15, unit: 'ms', status: 'VERIFIED' },
      { key: 'THD_u', label: { fr: 'Taux d\'Harmoniques Résiduel THD-U', en: 'Residual Voltage THD' }, value: '<1.0', unit: '%', status: 'VERIFIED' }
    ],

    associatedProtections: [
      { functionAnsi: '87T / 87V', deviceTag: '-87STAT', tripCondition: { fr: 'Courant différentiel entre bras MMC ou défaut terre interne', en: 'Differential current between arms or internal ground fault' }, targetActuator: 'Blocage impulsions IGBT en <1 ms et déclenchement 225 kV' },
      { functionAnsi: '59 / 27', deviceTag: '-V_PROT', tripCondition: { fr: 'Surtension 225 kV > 1.2 Un ou sous-tension prolongée', en: 'Overvoltage > 1.2 Un or sustained undervoltage' }, targetActuator: 'Retour en mode veille sécurisé' }
    ],

    instrumentationAndMeasurements: [
      { parameter: 'Tension Ligne et Fréquence Réseau', sensorType: 'Transformateurs de tension capacitifs CVT classe 0.2', typicalRange: '180 - 245 kV' },
      { parameter: 'Conductivité de l\'Eau de Refroidissement', sensorType: 'Cellule conductimétrique en ligne', typicalRange: '0.05 - 0.20 µS/cm' }
    ],

    automationAndControl: {
      fr: 'Contrôleur DSP/FPGA redondant exécutant la commande vectorielle dq0, l\'équilibrage des tensions condensateurs et le contrôle de tension avec statisme programmable.',
      en: 'Redundant DSP/FPGA platform executing decoupled dq0 vector control, capacitor voltage sorting algorithms, and voltage droop regulation.'
    },

    telecomAndProtocols: {
      protocols: ['IEC 61850-8-1 (MMS)', 'IEC 60870-5-104 (vers Dispatching)', 'Fibre optique propriétaire temps réel (valves)'],
      physicalInterface: 'Réseau fibre optique dédié immunisé CEM'
    },

    earthingAndGrounding: {
      regime: 'Solid' as any,
      description: { fr: 'Neutre du transformateur de couplage relié directement à la terre du poste IEEE 80', en: 'Coupling transformer neutral solidly connected to substation ground mat' }
    },

    insulationAndDielectric: {
      insulationMedium: 'Isolation air et isolateurs composite silicone dans le hall de valves',
      creepageDistance: '31 mm/kV',
      bilRatingKv: 1050
    },

    installationRequirements: {
      fr: 'Bâtiment fermé étanche à la poussière (surpression d\'air filtré) et blindage électromagnétique Faraday.',
      en: 'Dust-free enclosed valve hall with positive air pressure filtration and Faraday electromagnetic shielding.'
    },

    operatingStates: ['ENERGIZED', 'AVAILABLE', 'UNDER_MAINTENANCE', 'FAULTED'],

    failureModesFmea: [
      {
        code: 'FM-STAT-01',
        name: { fr: 'Défaillance d\'un sous-module IGBT', en: 'IGBT Submodule Failure' },
        rootCause: { fr: 'Claquant thermique de puce ou défaillance du driver de grille', en: 'Chip thermal puncture or gate driver failure' },
        consequenceOnSystem: { fr: 'Court-circuit local du condensateur de sous-module', en: 'Local short circuit of submodule capacitor' },
        protectiveResponse: { fr: 'Court-circuiteur rapide à thyristor interne qui shunte le sous-module en <2 ms sans arrêt du STATCOM', en: 'Fast bypass thyristor shorts the faulty submodule within 2 ms allowing uninterrupted operation via redundancy' },
        severity: 'MINOR'
      }
    ],

    safetyRisksAndLoto: {
      hazards: ['Très haute tension continue résiduelle dans les condensateurs MMC', 'Électrolyse de l\'eau', 'Champs magnétiques intenses'],
      lotoSteps: [
        'Déclenchement du disjoncteur 225 kV amont',
        'Fermeture des sectionneurs de terre 225 kV',
        'Ordre de décharge automatique des condensateurs de sous-modules (attente 15 min)',
        'Contrôle visuel de fermeture des sectionneurs de terre de mise en court-circuit DC',
        'Verrouillage mécanique par clés de transfert Castell'
      ]
    },

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Annuelle', description: { fr: 'Remplacement des cartouches de résine déionisante et inspection visuelle des valves', en: 'Replace deionizer resin beds and perform visual inspection of valve stacks' }, toolsAndStandards: ['Conductimètre', 'Caméra infrarouge'] }
    ],

    testingAndCommissioning: {
      factoryTestsFat: ['Test de tenue diélectrique des tours de valves', 'Essais de court-circuit de sous-modules', 'Test temps réel HIL (Hardware-In-the-Loop)'],
      siteAcceptanceTestsSat: ['Test de synchronisation réseau', 'Essai de saut de consigne ±50 Mvar', 'Mesure des niveaux de bruit et perturbations CEM'],
      commissioningProcedures: ['Montée en tension progressive sous surveillance des tensions condensateurs']
    },

    applicableStandards: [
      { standardCode: 'IEC 62501', title: 'Voltage sourced converter (VSC) valves for high-voltage direct current (HVDC) power transmission and FACTS - Electrical testing', relevantClauses: ['Clause 7, 8'], jurisdiction: 'International' },
      { standardCode: 'IEEE Std 1052', title: 'IEEE Guide for the Functional Specification of Transmission Static Var Compensators', relevantClauses: ['All'], jurisdiction: 'USA / International' }
    ],

    associatedEngineeringRoles: [
      { roleSlug: 'power-quality-engineer', title: { fr: 'Ingénieur Qualité d\'Énergie & FACTS', en: 'Power Quality & FACTS Specialist' }, tasks: { fr: 'Dimensionnement dynamique, réglage des boucles de contrôle de tension et coordination avec les filtres passifs', en: 'Dynamic sizing, voltage control loop tuning, and coordination with passive filter banks' } }
    ],

    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Étude de stabilité dynamique EMT sous PSCAD/EMTDC', 'Note de calcul des pertes'], involvedRoles: ['Ingénieur Réseau'] }
    ],

    deliverablesAndDocuments: ['Spécification technique STATCOM', 'Rapport d\'étude de stabilité transitoire', 'Manuel de conduite et maintenance'],
    provenance: {
      id: 'prov-statcom-50mvar',
      entity_id: 'eq-exp-statcom-mmc-50mvar',
      entity_type: 'equipment',
      source_ref: 'CIGRE WG B4.19 VSC & FACTS Guide',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Grid Stability Board',
      verified_at: '2026-09-25'
    },

    assumptionsAndLimitations: {
      fr: 'Courant capacitif maximal maintenu même lors de baisses de tension sévères (caractéristique source de courant).',
      en: 'Full capacitive current capability maintained even down to severely degraded voltage levels (current source behavior).'
    },

    representations: {
      physical: {
        svgVariant: 'SWITCHGEAR',
        dimensionsLabel: '24 m × 16 m × 8 m (Bâtiment des valves MMC)',
        enclosureLabel: 'Hall métallique isolé phoniquement et thermiquement',
        maintenanceClearance: 'Zone de sécurité haute tension 2.5 m'
      },
      electrical: {
        symbolType: 'STATCOM',
        incomerTerminal: 'Liaison 225 kV vers transformateur abaisseur',
        outgoingTerminal: 'Bornes neutre reliées à la terre',
        protectionZone: 'Zone différentielle convertisseur 87V',
        measurementTap: 'Réducteurs de mesure numériques optiques'
      },
      functional: {
        inputSignal: 'Tension réseau mesurée V_rms et consigne V_ref',
        conversionProcess: 'Génération de tension VSC en phase et amplitude contrôlée',
        outputSignal: 'Courant I_q réactif inductif ou capacitif',
        feedbackLoop: 'Contrôleur PI de tension de barre avec statisme 2%'
      }
    }
  },

  // 4. TRANSFORMER ONLINE DGA MULTI-GAS MONITOR & AI DUVAL DIAGNOSTICS - D12
  {
    id: 'eq-exp-dga-online-monitor',
    tagIec: '=AM.DGA01',
    name: {
      fr: 'Analyseur DGA Multigaz en Ligne & Diagnostic IA Triangle de Duval',
      en: 'Online Multi-gas DGA Monitor & AI Duval Triangle Health Index'
    },
    aliases: {
      fr: ['Moniteur DGA en ligne', 'Chromatographe d\'huile transformateur', 'Capteur 9 gaz DGA'],
      en: ['Online DGA Analyzer', 'Transformer Oil Gas Monitor', 'Duval Triangle DGA Sensor']
    },
    equipmentType: 'MeasurementEquipment',
    category: 'MEASUREMENT_AND_MONITORING',
    parentDomain: 'D12',
    systemStage: 'SUBSTATIONS_NODES',
    subsystemContext: {
      fr: 'Cuve de transformateur de puissance 225/30 kV 50 MVA en poste extérieur',
      en: 'Oil tank of 225/30 kV 50 MVA primary substation transformer'
    },
    technologyContext: {
      fr: 'Spectroscopie photoacoustique (PAS) infrarouge multigaz (9 gaz + humidité) raccordée sur vanne de vidange avec circulation continue d\'huile et processeur IA Duval 1/4/5',
      en: 'Photoacoustic spectroscopy (PAS) 9-gas + moisture online monitor with automated oil circulation and embedded AI Duval Triangle 1/4/5 fault diagnostic engine'
    },
    applicationContext: {
      fr: 'Surveillance prédictive en temps réel de l\'intégrité diélectrique de l\'huile et du papier isolant des transformateurs HTB',
      en: 'Real-time predictive monitoring of dielectric oil and cellulose paper insulation in EHV/HV power transformers'
    },
    voltageContext: {
      nominalVoltage: '110-230 V AC / 110 V DC (Auxiliaire)',
      level: 'LV',
      frequencyHz: 50,
      phases: '1-phase'
    },
    typicalLocation: {
      fr: 'Fixé directement sur le châssis de cuve du transformateur',
      en: 'Mounted directly onto transformer tank wall near drain valve'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Appareil d\'analyse physico-chimique en continu mesurant les concentrations de gaz dissous dans l\'huile pour identifier les décharges partielles, arcs et surchauffes thermiques naissantes.',
      en: 'Continuous physicochemical analyzer extracting and quantifying dissolved gases in transformer oil to detect incipient arcing, partial discharge, and thermal faults.'
    },
    whyItExists: {
      fr: 'Éviter les explosions et pannes catastrophiques des transformateurs de puissance en détectant les défauts plusieurs semaines avant le déclenchement Buchholz.',
      en: 'Prevent catastrophic transformer tank rupture and fires by diagnosing faults weeks before Buchholz relay mechanical trip.'
    },
    primaryEngineeringRole: {
      fr: 'Calcul en continu du Health Index de l\'actif et alerte précoce selon IEEE C57.104 et CEI 60599.',
      en: 'Continuous Asset Health Index (AHI) computation and early fault classification per IEEE C57.104 and IEC 60599.'
    },
    engineeringProblemSolved: {
      fr: 'Détection en ligne sans interruption de service des décharges partielles, arcs et surchauffes naissantes dans les enroulements du transformateur.',
      en: 'Online in-service detection of partial discharges, arcing, and nascent thermal degradation in transformer windings.'
    },
    operatingPrincipleSummary: {
      fr: 'Extraction membranaire sous vide des 9 gaz de décomposition de l\'huile et spectrométrie photoacoustique ou infrarouge continue.',
      en: 'Membrane vacuum extraction of 9 fault diagnostic gases with continuous photoacoustic or infrared spectrometry.'
    },
    primaryFunction: {
      fr: 'Surveillance prédictive en ligne de l\'état diélectrique et thermique de l\'huile isolante des transformateurs THT.',
      en: 'Online predictive monitoring of dielectric and thermal health of EHV power transformer insulating oil.'
    },

    workingPrinciple: [
      {
        stepNumber: 1,
        title: { fr: 'Extraction et dégazage de l\'huile', en: 'Degassing and gas extraction' },
        description: { fr: 'Une micro-pompe prélève un échantillon d\'huile chaude, traverse une membrane semi-perméable téflon qui sépare les gaz dissous sous vide partiel', en: 'Micro-pump circulates oil across semi-permeable membrane extracting dissolved gases under partial vacuum' },
        physicalPhenomenon: { fr: 'Loi de Henry et diffusion membranaire', en: 'Henry\'s law and membrane diffusion' },
        keyVariable: 'Concentrations en ppm'
      },
      {
        stepNumber: 2,
        title: { fr: 'Mesure par spectroscopie photoacoustique', en: 'Photoacoustic Spectroscopy (PAS)' },
        description: { fr: 'Des impulsions laser infrarouges accordées excitent les molécules de gaz qui génèrent des ondes acoustiques détectées par microphones ultra-sensibles', en: 'Pulsed infrared lasers excite gas molecules generating micro-pressure sound waves captured by microphones' },
        physicalPhenomenon: { fr: 'Effet photoacoustique', en: 'Photoacoustic absorption and pressure generation' },
        keyVariable: 'H2, CH4, C2H6, C2H4, C2H2, CO, CO2, H2O'
      },
      {
        stepNumber: 3,
        title: { fr: 'Diagnostic IA Triangle & Pentagone de Duval', en: 'AI Duval Triangle Fault Diagnosis' },
        description: { fr: 'L\'algorithme calcule les ratios CH4/C2H4/C2H2 et positionne le point de fonctionnement dans les zones PD, T1, T2, T3, D1 ou D2 de Duval', en: 'Embedded AI maps relative gas percentages onto Duval coordinates categorizing PD, thermal faults (T1-T3), or electrical arcs (D1-D2)' },
        physicalPhenomenon: { fr: 'Décomposition pyrolytique des hydrocarbures', en: 'Pyrolytic oil cracking temperature thresholds' },
        keyVariable: 'Zone Duval, Taux de génération (ppm/jour)'
      }
    ],

    physicalPhenomena: [
      {
        phenomenon: { fr: 'Pyrolyse de l\'huile diélectrique et de la cellulose', en: 'Thermal cracking of dielectric oil and cellulose' },
        description: { fr: 'À basse température (<300°C), l\'hydrogène et le méthane prédominent. Au-delà de 700°C (arc électrique), l\'acétylène (C2H2) se forme massivement.', en: 'Low temperatures (<300°C) generate H2 and CH4; intense arc temperatures (>700°C) crack oil bonds into acetylene (C2H2).' },
        governingLaw: 'Ratios CEI 60599 / Triangle de Duval 1'
      }
    ],

    subcomponents: [
      { id: 'dga-cell', name: { fr: 'Cellule photoacoustique multi-spectre', en: 'Multi-spectrum Photoacoustic Cell' }, function: { fr: 'Quantification ppm des 9 gaz', en: '9-gas ppm quantification' }, materialOrTechnology: 'Laser infrarouge accordable DFB', criticality: 'CRITICAL' },
      { id: 'dga-pump', name: { fr: 'Boucle d\'échantillonnage d\'huile étanche', en: 'Hermetic Oil Sampling Loop' }, function: { fr: 'Circulation d\'huile sans bulles d\'air', en: 'Bubble-free oil extraction' }, materialOrTechnology: 'Inox 316L avec clapets anti-retour', criticality: 'CRITICAL' }
    ],

    energyRole: {
      inputEnergy: 'Alimentation 110 V DC / 230 V AC (~80 W)',
      outputEnergy: 'Signaux numériques et alarmes relais',
      conversionEfficiency: 'Non applicable',
      thermalDissipation: 'Chauffage interne thermostaté pour climat équatorial'
    },

    upstreamConnections: [
      { apparatusId: 'node-trafo-main-30', apparatusName: 'Transformateur 225/30 kV 50 MVA', connectionType: 'Vanne d\'échantillonnage 1/2 pouce NPT en fond de cuve' }
    ],
    downstreamConnections: [
      { apparatusId: 'node-sw-iec61850', apparatusName: 'Commutateur Réseau Station Bus', connectionType: 'Câble Ethernet Cat6A durci RJ45 / M12' }
    ],

    keyEngineeringValues: [
      { key: 'Gas_H2_range', label: { fr: 'Plage Mesure Hydrogène (H2)', en: 'H2 Measurement Range' }, value: '5 - 5000', unit: 'ppm', status: 'VERIFIED' },
      { key: 'Gas_C2H2_range', label: { fr: 'Plage Mesure Acétylène (C2H2)', en: 'C2H2 Measurement Range' }, value: '0.5 - 2000', unit: 'ppm', status: 'VERIFIED' },
      { key: 'Sampling_rate', label: { fr: 'Cadence de Mesure Automatique', en: 'Automated Measurement Rate' }, value: 1, unit: 'heure', status: 'VERIFIED' },
      { key: 'Operating_temp', label: { fr: 'Température Ambiante de Service', en: 'Ambient Service Temperature' }, value: '-40 à +55', unit: '°C', status: 'VERIFIED' }
    ],

    associatedProtections: [
      { functionAnsi: 'Buchholz Alarm / Trip', deviceTag: '-63B', tripCondition: { fr: 'Dégagement massif de gaz dans le relais Buchholz', en: 'Sudden gas accumulation in Buchholz chamber' }, targetActuator: 'Déclenchement instantané disjoncteurs 225 kV et 30 kV' },
      { functionAnsi: 'DGA High Alarm', deviceTag: '-DGA_ALARM', tripCondition: { fr: 'Taux de génération C2H2 > 2 ppm/jour ou H2 > 1000 ppm', en: 'C2H2 generation rate > 2 ppm/day or H2 > 1000 ppm' }, targetActuator: 'Alarme prioritaire SCADA et passage en surveillance renforcée' }
    ],

    instrumentationAndMeasurements: [
      { parameter: 'Teneur en Eau dans l\'Huile', sensorType: 'Sonde capacitive à couche mince polymère', typicalRange: '5 - 60 ppm' }
    ],

    automationAndControl: {
      fr: 'Diagnostic automatique embarqué avec envoi de rapports périodiques DNP3/MMS et alertes SMS/Email.',
      en: 'Embedded automated diagnostics streaming periodic IEC 61850 MMS and Modbus telemetry to Asset Management SCADA.'
    },

    telecomAndProtocols: {
      protocols: ['IEC 61850 MMS', 'Modbus TCP', 'DNP3', 'MQTT Sparkplug B'],
      physicalInterface: 'Double port Ethernet 10/100Base-TX et modem 4G optionnel'
    },

    earthingAndGrounding: {
      regime: 'Solid' as any,
      description: { fr: 'Boîtier métallique relié par tresse cuivre 16 mm² à la masse de cuve du transformateur', en: 'Enclosure grounded via 16 mm² copper braid to transformer tank earth pad' }
    },

    insulationAndDielectric: {
      insulationMedium: 'Isolation galvanique 2 kV entre alimentation et électronique',
      creepageDistance: 'N/A',
      bilRatingKv: 4
    },

    installationRequirements: {
      fr: 'Purge soignée de l\'air lors du raccordement sur la vanne de cuve pour éviter toute bulle d\'air dans le diélectrique.',
      en: 'Meticulous air purging during tank valve connection to prevent bubble injection into transformer oil.'
    },

    operatingStates: ['ENERGIZED', 'AVAILABLE', 'UNDER_MAINTENANCE', 'FAULTED'],

    failureModesFmea: [
      {
        code: 'FM-DGA-01',
        name: { fr: 'Encrassement de la membrane d\'extraction', en: 'Extraction Membrane Fouling' },
        rootCause: { fr: 'Boues d\'huile oxydée et particules de carbone', en: 'Aged oil sludge and suspended carbon particles' },
        consequenceOnSystem: { fr: 'Dérive des mesures de gaz et faux positifs', en: 'Measurement drift and false gas rate warnings' },
        protectiveResponse: { fr: 'Cycle d\'auto-étalonnage automatique par gaz de référence interne', en: 'Automated zero-calibration routine and maintenance alert' },
        severity: 'MINOR'
      }
    ],

    safetyRisksAndLoto: {
      hazards: ['Huile chaude sous pression (jusqu\'à 90°C)', 'Risque de projection d\'huile'],
      lotoSteps: [
        'Fermeture de la vanne quart-de-tour de cuve du transformateur',
        'Pose d\'un verrou mécanique sur la vanne',
        'Consignation électrique du disjoncteur auxiliaire 110V/230V'
      ]
    },

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Tous les 2 ans', description: { fr: 'Remplacement des filtres d\'huile et contrôle d\'étalonnage par analyse laboratoire DGA chromatographie en phase gazeuse (GC)', en: 'Replace oil inlet filter and cross-calibrate with ISO 17025 accredited laboratory GC test' }, toolsAndStandards: ['Laboratoire ASTM D3612'] }
    ],

    testingAndCommissioning: {
      factoryTestsFat: ['Étalonnage multipoints avec mélange de gaz certifié', 'Test d\'étanchéité sous pression d\'huile 2 bar'],
      siteAcceptanceTestsSat: ['Test de communication IEC 61850 MMS avec le SCADA', 'Comparaison avec un prélèvement d\'huile sur site'],
      commissioningProcedures: ['Purge sous vide de la tuyauterie de raccordement']
    },

    applicableStandards: [
      { standardCode: 'IEEE C57.104-2019', title: 'IEEE Guide for the Interpretation of Gases Generated in Mineral Oil-Immersed Transformers', relevantClauses: ['Clause 4, 5'], jurisdiction: 'International / USA' },
      { standardCode: 'IEC 60599', title: 'Mineral oil-filled electrical equipment in service - Guidance on the interpretation of dissolved and free gases analysis', relevantClauses: ['Clause 5'], jurisdiction: 'International' }
    ],

    associatedEngineeringRoles: [
      { roleSlug: 'asset-engineer', title: { fr: 'Ingénieur Gestion d\'Actifs & Diagnostic', en: 'Asset Health & Transformer Specialist' }, tasks: { fr: 'Analyse des tendances DGA, calcul de la vitesse de dégradation du papier (taux de furanne/CO2) et planification de révision', en: 'DGA trend analysis, paper insulation aging estimation, and overhaul scheduling' } }
    ],

    lifecyclePhases: [
      { phase: 'OPERATION_MONITORING', deliverables: ['Rapport mensuel d\'état de santé transformateur', 'Avis technique en cas d\'alerte gaz'], involvedRoles: ['Ingénieur Diagnostic'] }
    ],

    deliverablesAndDocuments: ['Certificat d\'étalonnage DGA', 'Rapport d\'interprétation Duval', 'Plan d\'échantillonnage d\'huile'],
    provenance: {
      id: 'prov-dga-online',
      entity_id: 'eq-exp-dga-online-monitor',
      entity_type: 'equipment',
      source_ref: 'CIGRE WG A2.49 & IEEE C57.104',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Asset Diagnostic Practice',
      verified_at: '2026-09-25'
    },

    assumptionsAndLimitations: {
      fr: 'Nécessite au moins 3 mesures consécutives pour confirmer un taux d\'accroissement (ppm/jour) avant de déclencher une alerte.',
      en: 'Rate-of-change (ppm/day) alerts require at least 3 consecutive sampling cycles to filter measurement noise.'
    },

    representations: {
      physical: {
        svgVariant: 'PANEL',
        dimensionsLabel: '0.60 m × 0.45 m × 0.30 m',
        enclosureLabel: 'Boîtier aluminium IP66 étanche résistant UV',
        maintenanceClearance: 'Accès frontal 0.8 m'
      },
      electrical: {
        symbolType: 'MEASUREMENT_METER',
        incomerTerminal: 'Alimentation 110V/230V et ports RJ45',
        outgoingTerminal: 'Contacts secs d\'alarme vers BCU',
        protectionZone: 'Zone transformateur',
        measurementTap: 'Piquage hydraulique vanne cuve'
      },
      functional: {
        inputSignal: 'Huile isolante prélevée de la cuve',
        conversionProcess: 'Dégazage membranaire et détection acoustique laser',
        outputSignal: 'Concentrations ppm, Health Index et zone Duval',
        feedbackLoop: 'Ajustement de la cadence de mesure si alarme gaz'
      }
    }
  },

  // 5. RUGGEDIZED MANAGED SUBSTATION ETHERNET SWITCH IEC 62443-4-2 - D14
  {
    id: 'eq-exp-switch-iec62443',
    tagIec: '=NET.SW01',
    name: {
      fr: 'Commutateur Réseau Durci IEC 62443-4-2 SL2 (Station Bus IEC 61850)',
      en: 'Ruggedized Managed Ethernet Switch IEC 62443-4-2 SL2 (IEC 61850 Station Bus)'
    },
    aliases: {
      fr: ['Switch durci poste HTB', 'Commutateur IEC 61850-3', 'Switch réseau SL2'],
      en: ['Substation Rugged Switch', 'IEC 61850-3 Switch', 'Cybersecurity Managed Switch']
    },
    equipmentType: 'SwitchgearEquipment',
    category: 'MODERN_EQUIPMENT',
    parentDomain: 'D14',
    systemStage: 'SUBSTATIONS_NODES',
    subsystemContext: {
      fr: 'Réseau local Station Bus & Process Bus dans les armoires de télécommunication du poste 225 kV',
      en: 'Station Bus and Process Bus local network in 225 kV substation telecom cubicles'
    },
    technologyContext: {
      fr: 'Châssis durci 19 pouces sans ventilateur (convection naturelle), conforme CEI 61850-3 / IEEE 1613, avec 16 ports Gigabit RJ45 + 4 ports SFP optiques, support PRP/HSR et durcissement CEI 62443-4-2',
      en: 'Fanless 19-inch rack switch, IEC 61850-3 / IEEE 1613 compliant, 16x Gigabit RJ45 + 4x SFP optical ports, zero-packet-loss PRP/HSR, and IEC 62443-4-2 SL2 hardening'
    },
    applicationContext: {
      fr: 'Acheminement déterministe et cybersécurisé des trames GOOSE (<3 ms), Sampled Values (SV) et MMS entre les calculateurs de travée, protections et passerelle SCADA',
      en: 'Deterministic and cyber-secure routing of GOOSE (<3 ms), Sampled Values (SV), and MMS traffic between bay controllers, IEDs, and SCADA gateway'
    },
    voltageContext: {
      nominalVoltage: '110 V DC redondant (Dual Power Supply)',
      level: 'LV',
      frequencyHz: 0,
      phases: 'DC'
    },
    typicalLocation: {
      fr: 'Baie télécom 19 pouces en salle de commande du poste 225 kV',
      en: '19-inch telecom rack in 225 kV substation control building'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Équipement actif de commutation réseau de niveau 2/3 durci contre les rayonnements électromagnétiques extrêmes des manœuvres haute tension et certifié pour la cybersécurité industrielle.',
      en: 'Layer 2/3 active network switch hardened against extreme substation electromagnetic transients and certified for industrial OT cybersecurity.'
    },
    whyItExists: {
      fr: 'Garantir que les ordres de déclenchement rapide GOOSE ne soient jamais retardés ou corrompus par des surtensions transitoires ou des attaques de cyber-intrusion.',
      en: 'Ensure critical protection GOOSE trip messages never suffer packet drops or latency jitter during breaker arcs or malicious cyber attacks.'
    },
    primaryEngineeringRole: {
      fr: 'Segmentation des flux de données en zones/conduits selon CEI 62443-3-2 et commutation sans perte avec redondance PRP/HSR (CEI 62439-3).',
      en: 'Network zoning and conduit segmentation per IEC 62443-3-2 with zero-failover-time PRP/HSR redundancy per IEC 62439-3.'
    },
    engineeringProblemSolved: {
      fr: 'Immunité électromagnétique extrême aux manœuvres de disjoncteurs et zéro perte de trames GOOSE critiques sous cybermenaces.',
      en: 'Extreme electromagnetic transient immunity to breaker switching and zero-loss of critical GOOSE trip frames under cyber threats.'
    },
    operatingPrincipleSummary: {
      fr: 'Commutation Ethernet déterministe avec balisage VLAN IEEE 802.1Q, filtrage strict de niveau 2/3 et protocole de redondance parallèle PRP.',
      en: 'Deterministic Ethernet switching with IEEE 802.1Q VLAN tagging, strict layer 2/3 filtering, and PRP zero-failover redundancy.'
    },
    primaryFunction: {
      fr: 'Routage déterministe sécurisé et redondant des communications numériques de contrôle-commande de poste selon CEI 61850.',
      en: 'Deterministic, secure, and redundant routing of substation digital control and protection communications per IEC 61850.'
    },

    workingPrinciple: [
      {
        stepNumber: 1,
        title: { fr: 'Filtrage et priorisation des trames GOOSE', en: 'GOOSE frame QoS prioritization' },
        description: { fr: 'Le switch inspecte les tags VLAN IEEE 802.1Q et affecte la priorité maximale (CoS 7) aux Ethertypes 0x88B8 (GOOSE) pour garantir une traversée <50 µs', en: 'Switch inspects 802.1Q VLAN tags and applies strict priority (CoS 7) to Ethertype 0x88B8 (GOOSE) guaranteeing <50 µs cut-through latency' },
        physicalPhenomenon: { fr: 'Commutation matérielle ASIC fil de l\'eau', en: 'ASIC hardware cut-through switching' },
        keyVariable: 'Latence <50 µs, Jitter <5 µs'
      },
      {
        stepNumber: 2,
        title: { fr: 'Contrôle d\'accès et durcissement cybersécurité', en: 'Port security and 802.1X authentication' },
        description: { fr: 'Chaque port physique est restreint par filtrage d\'adresse MAC (MAC-binding), authentification 802.1X et désactivation automatique si équipement non autorisé', en: 'Each port enforces MAC-binding, IEEE 802.1X EAP-TLS authentication, and automatic port lockdown on unauthorized device connection' },
        physicalPhenomenon: { fr: 'Chiffrement et contrôle d\'accès', en: 'Cryptographic authentication and port lockdown' },
        keyVariable: 'IEC 62443-4-2 SL2'
      }
    ],

    physicalPhenomena: [
      {
        phenomenon: { fr: 'Immunité contre les transitoires rapides en salves (Burst)', en: 'Fast transient burst and oscillatory wave immunity' },
        description: { fr: 'Lors de l\'ouverture d\'un sectionneur 225 kV, des étincelles génèrent des ondes électromagnétiques de plusieurs kV sur les câbles. Le switch est blindé et découplé galvaniquement pour tolérer 4 kV sans redémarrage.', en: 'Disconnector arcs induce kilovolt-level EMI spikes. The switch uses galvanically isolated power inputs and shielded chassis to withstand 4 kV bursts per IEC 61850-3.' },
        governingLaw: 'CEI 61000-4-4 (Burst 4 kV) / IEEE 1613'
      }
    ],

    subcomponents: [
      { id: 'sw-asic', name: { fr: 'Moteur de commutation ASIC durci PRP/HSR', en: 'PRP/HSR Hardware Switching ASIC' }, function: { fr: 'Duplication et déduplication des trames sans délai', en: 'Zero-loss packet duplication and discarding' }, materialOrTechnology: 'ASIC basse consommation', criticality: 'CRITICAL' },
      { id: 'sw-psu', name: { fr: 'Alimentation redondante 110V DC', en: 'Dual Hot-Swappable 110V DC Power Supplies' }, function: { fr: 'Continuité de service sans coupure', en: 'Seamless power continuity' }, materialOrTechnology: 'Alimentation découpage 3 kV isolement', criticality: 'CRITICAL' }
    ],

    energyRole: {
      inputEnergy: '110 V DC redondant (~45 W)',
      outputEnergy: 'Signaux Ethernet optiques (1310 nm) et cuivre RJ45',
      conversionEfficiency: 'Non applicable',
      thermalDissipation: 'Refroidissement passif sans ventilateur jusqu\'à +85°C'
    },

    upstreamConnections: [
      { apparatusId: 'node-scada-ems', apparatusName: 'Passerelle Téléconduite SCADA / Passerelle Cyber', connectionType: 'Fibre optique monomode 1000Base-LX' }
    ],
    downstreamConnections: [
      { apparatusId: 'node-bcu-61850', apparatusName: 'Calculateur de Tranche BCU', connectionType: 'Paire torsadée blindée Cat6A S/FTP' },
      { apparatusId: 'node-prot-87t', apparatusName: 'Relais Différentiel Transformateur', connectionType: 'Double liaison fibre PRP Réseau A / Réseau B' }
    ],

    keyEngineeringValues: [
      { key: 'Port_count', label: { fr: 'Nombre de Ports Gigabit', en: 'Total Gigabit Ports' }, value: '16x RJ45 + 4x SFP', unit: '', status: 'VERIFIED' },
      { key: 'Redundancy', label: { fr: 'Protocole de Redondance Réseau', en: 'Zero-Failover Protocol' }, value: 'PRP (CEI 62439-3 cl. 4)', unit: '', status: 'VERIFIED' },
      { key: 'Latency_goose', label: { fr: 'Latence de Traversée GOOSE', en: 'Cut-Through Latency' }, value: 3.8, unit: 'µs', status: 'VERIFIED' },
      { key: 'EMC_rating', label: { fr: 'Certification Immunité CEM', en: 'EMC Substation Rating' }, value: 'IEC 61850-3 / IEEE 1613 Class 1', unit: '', status: 'VERIFIED' }
    ],

    associatedProtections: [],
    instrumentationAndMeasurements: [
      { parameter: 'Taux d\'erreur de trames (CRC Errors)', sensorType: 'Compteurs matériels MIB-II SNMPv3', typicalRange: '0 erreurs' },
      { parameter: 'Température Châssis Interne', sensorType: 'Sonde de température embarquée', typicalRange: '30°C - 75°C' }
    ],

    automationAndControl: {
      fr: 'Supervision continue par protocole Syslog chiffré TLS et SNMPv3 vers le Security Operations Center (SOC) OT.',
      en: 'Continuous audit logging streaming Syslog over TLS and encrypted SNMPv3 to OT Security Operations Center (SOC).'
    },

    telecomAndProtocols: {
      protocols: ['IEC 61850-8-1 (GOOSE, MMS)', 'IEEE 1588v2 PTP (Power Profile)', 'SNMPv3', 'RADIUS/TACACS+'],
      physicalInterface: '16 ports 10/100/1000Base-TX RJ45 + 4 ports 1000Base-FX SFP'
    },

    earthingAndGrounding: {
      regime: 'Solid' as any,
      description: { fr: 'Borne de terre M5 reliée par tresse cuivre 25 mm² au collecteur de terre de la baie télécom', en: 'M5 earth stud bonded via 25 mm² copper strap to telecom rack ground bar' }
    },

    insulationAndDielectric: {
      insulationMedium: 'Isolation galvanique 3 kV DC sur entrées alimentation et 1.5 kV sur ports RJ45',
      creepageDistance: 'N/A',
      bilRatingKv: 5
    },

    installationRequirements: {
      fr: 'Montage en rack 19 pouces avec espace libre 1U au-dessus et au-dessous pour convection naturelle.',
      en: '19-inch rack mounting with 1U clearance above/below for natural convection.'
    },

    operatingStates: ['ENERGIZED', 'AVAILABLE', 'UNDER_MAINTENANCE', 'FAULTED'],

    failureModesFmea: [
      {
        code: 'FM-NET-01',
        name: { fr: 'Tempête de diffusion réseau (Broadcast Storm)', en: 'Broadcast Storm Overload' },
        rootCause: { fr: 'Boucle physique accidentelle ou défaillance protocole STP', en: 'Accidental physical network loop or misconfiguration' },
        consequenceOnSystem: { fr: 'Saturation de la bande passante et perte des trames GOOSE', en: 'Bandwidth saturation and dropped GOOSE protection packets' },
        protectiveResponse: { fr: 'Blocage matériel automatique Broadcast Storm Rate Limiter et isolation du port', en: 'Hardware rate limiting and automatic loop port shutdown within 5 ms' },
        severity: 'CRITICAL'
      }
    ],

    safetyRisksAndLoto: {
      hazards: ['Risque laser classe 1 sur connecteurs fibre optique débranchés', 'Tension continue 110V DC'],
      lotoSteps: [
        'Déconnexion des deux câbles d\'alimentation 110V DC',
        'Pose des bouchons protecteurs sur les connecteurs optiques SFP',
        'Consignation au niveau du tableau de distribution auxiliaire CC'
      ]
    },

    maintenancePlan: [
      { type: 'CONDITION_BASED', periodicity: 'Continue', description: { fr: 'Surveillance des alertes de sécurité (tentatives de connexion infructueuses, modifications de configuration)', en: 'Real-time monitoring of failed logins, config modifications, and port status via Syslog' }, toolsAndStandards: ['SIEM / SOC OT'] }
    ],

    testingAndCommissioning: {
      factoryTestsFat: ['Essais d\'immunité CEM 4 kV Burst et 2.5 kV onde oscillatoire', 'Test de débit à 100% de charge sur 20 ports sans perte de trame'],
      siteAcceptanceTestsSat: ['Test de redondance PRP (coupure physique du Réseau A avec zéro perte de paquet)', 'Validation du profil PTP IEEE 1588v2 (<1 µs d\'erreur)'],
      commissioningProcedures: ['Durcissement de configuration : désactivation des services non utilisés (HTTP, Telnet) et activation SSH/TLS']
    },

    applicableStandards: [
      { standardCode: 'IEC 62443-4-2', title: 'Security for industrial automation and control systems - Technical security requirements for IACS components', relevantClauses: ['SL2 Requirements'], jurisdiction: 'International' },
      { standardCode: 'IEC 61850-3', title: 'Communication networks and systems for power utility automation - General requirements', relevantClauses: ['Clause 5 (EMC)'], jurisdiction: 'International' }
    ],

    associatedEngineeringRoles: [
      { roleSlug: 'cybersecurity-engineer', title: { fr: 'Ingénieur Cybersécurité OT & Réseaux Industriels', en: 'OT Cybersecurity & Network Specialist' }, tasks: { fr: 'Cartographie des flux réseau, durcissement des switches et gestion des certificats PKI', en: 'Flow mapping, switch hardening, and PKI security certificate lifecycle management' } }
    ],

    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Architecture réseau Station Bus et matrice de flux VLAN', 'Rapport de conformité CEI 62443'], involvedRoles: ['Ingénieur Réseau OT'] }
    ],

    deliverablesAndDocuments: ['Plan d\'adressage IP et segmentation VLAN', 'Fichier de configuration durcie', 'Rapport d\'audit de vulnérabilité Nessus'],
    provenance: {
      id: 'prov-switch-iec62443',
      entity_id: 'eq-exp-switch-iec62443',
      entity_type: 'equipment',
      source_ref: 'IEC 62443-4-2 & CIGRE D2 Substation Networks',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE OT Security Board',
      verified_at: '2026-09-25'
    },

    assumptionsAndLimitations: {
      fr: 'Le chiffrement MACsec IEEE 802.1AE doit être activé sur les liaisons inter-bâtiments exposées.',
      en: 'IEEE 802.1AE MACsec line-rate encryption must be enabled on inter-building outdoor fiber spans.'
    },

    representations: {
      physical: {
        svgVariant: 'PANEL',
        dimensionsLabel: '0.44 m × 0.35 m × 0.044 m (Rack 19 pouces 1U)',
        enclosureLabel: 'Boîtier acier électrozingué résistant aux chocs',
        maintenanceClearance: 'Accès frontal pour câbles RJ45 et SFP'
      },
      electrical: {
        symbolType: 'DISCONNECTOR',
        incomerTerminal: 'Double alimentation 110 V DC A et B',
        outgoingTerminal: '20 ports réseau Gigabit Ethernet',
        protectionZone: 'Zone réseau sécurisée DMZ poste',
        measurementTap: 'Port miroir (SPAN) pour sonde d\'intrusion IDS'
      },
      functional: {
        inputSignal: 'Trames Ethernet entrantes (GOOSE, MMS, SV)',
        conversionProcess: 'Inspection d\'en-tête, filtrage VLAN et commutation matérielle',
        outputSignal: 'Trames Ethernet commutées vers le port de destination',
        feedbackLoop: 'Surveillance SNMP des compteurs d\'erreurs et saturation'
      }
    }
  },

  // 6. 3-PHASE SMART METER AMI DLMS/COSEM - D15
  {
    id: 'eq-exp-ami-smartmeter-3p',
    tagIec: '=SM.MTR01',
    name: {
      fr: 'Compteur Communicant Intelligent Triphasé AMI (DLMS/COSEM & THD)',
      en: '3-Phase AMI Smart Meter (DLMS/COSEM & Power Quality Profiling)'
    },
    aliases: {
      fr: ['Compteur communicant BT', 'Smart Meter triphasé', 'Compteur Linky/AMI industriel'],
      en: ['3-Phase Smart Meter', 'AMI Commercial Meter', 'DLMS/COSEM Energy Meter']
    },
    equipmentType: 'MeteringEquipment',
    category: 'MEASUREMENT_AND_MONITORING',
    parentDomain: 'D15',
    systemStage: 'LV_DISTRIBUTION',
    subsystemContext: {
      fr: 'Armoire de comptage au point de livraison BT 400 V ou départ TGBT industriel',
      en: 'Metering cubicle at 400 V customer service entrance or industrial TGBT feeder'
    },
    technologyContext: {
      fr: 'Compteur électronique bidirectionnel classe 0.2S (CEI 62053-22) avec mesure 4 quadrants, module radio cellulaire 4G/NB-IoT, port optique PUE et chiffrement cryptographique AES-128 GCM selon suite DLMS Security Suite 1',
      en: 'Class 0.2S bidirectional solid-state meter (IEC 62053-22) with 4-quadrant measurement, 4G/NB-IoT cellular modem, optical port, and AES-128 GCM encryption per DLMS Security Suite 1'
    },
    applicationContext: {
      fr: 'Télérelève automatisée (AMR/AMI), facturation multi-tarifaire (TOU), suivi des profils de charge 10 minutes et détection des fraudes',
      en: 'Automated meter reading (AMI), time-of-use (TOU) billing, 10-minute interval load profiling, and anti-tampering fraud detection'
    },
    voltageContext: {
      nominalVoltage: '3×230/400 V AC Triphasé 4 fils',
      level: 'LV',
      frequencyHz: 50,
      phases: '3-phase 4-wire'
    },
    typicalLocation: {
      fr: 'Niche de comptage scellée en amont du disjoncteur général d\'abonné',
      en: 'Sealed metering cubicle upstream of main customer circuit breaker'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Appareil métrologique électronique certifié mesurant l\'énergie active et réactive transitée dans les deux sens et transmettant les données sécurisées au système de gestion central (HES/MDM).',
      en: 'Certified solid-state metrology device measuring bidirectional active/reactive energy and streaming cryptographically secured interval data to utility Head-End System (HES).'
    },
    whyItExists: {
      fr: 'Supprimer les relevés manuels, permettre l\'intégration du solaire en toiture (autoconsommation avec injection) et détecter instantanément les coupures ou anomalies de tension.',
      en: 'Eliminate manual meter reading, enable bidirectional net-metering for rooftop solar PV, and detect power outages instantly.'
    },
    primaryEngineeringRole: {
      fr: 'Mesure légale d\'énergie certifiée MID, enregistrement de la courbe de charge et surveillance continue de la qualité de la tension (THD-U, creux/surtensions).',
      en: 'MID-certified fiscal energy billing, interval load profiling, and continuous power quality surveillance (THD-U, sags/swells).'
    },
    engineeringProblemSolved: {
      fr: 'Comptage bidirectionnel précis de l\'énergie en présence de charges harmoniques et transmission chiffrée temps réel vers le réseau intelligent.',
      en: 'Accurate bidirectional energy metering under harmonic load distortions and encrypted real-time streaming to the smart grid.'
    },
    operatingPrincipleSummary: {
      fr: 'Échantillonnage sigma-delta 24 bits des tensions et courants avec calcul 4 quadrants par DSP et communication CPL/Cellulaire DLMS/COSEM.',
      en: '24-bit sigma-delta voltage/current sampling with 4-quadrant DSP computation and DLMS/COSEM PLC/cellular transmission.'
    },
    primaryFunction: {
      fr: 'Mesure métrologique légale d\'énergie active/réactive et télégestion bidirectionnelle du point de livraison d\'abonné.',
      en: 'MID-compliant fiscal active/reactive energy metrology and bidirectional telemetry at consumer delivery point.'
    },

    workingPrinciple: [
      {
        stepNumber: 1,
        title: { fr: 'Échantillonnage haute résolution courant/tension', en: 'Current and Voltage Sampling' },
        description: { fr: 'Les tensions phase-neutre sont divisées par réseau résistif et les courants mesurés par capteurs Rogowski ou shunts de précision avec CAN sigma-delta 24 bits', en: 'Phase voltages are stepped down via precision resistive dividers and currents captured via Rogowski/precision shunts into 24-bit sigma-delta ADCs' },
        physicalPhenomenon: { fr: 'Numérisation haute fréquence', en: 'High speed delta-sigma analog-to-digital conversion' },
        keyVariable: 'u(t), i(t) échantillonnés à 12.8 kHz'
      },
      {
        stepNumber: 2,
        title: { fr: 'Calcul métrologique 4 quadrants', en: '4-Quadrant Metrology Computation' },
        description: { fr: 'Le DSP calcule la puissance active P, réactive Q, apparente S et l\'énergie cumulée selon les 4 quadrants (P+, P-, Q+, Q-)', en: 'Embedded DSP computes active P, reactive Q, apparent S, and accumulates energy registers across all 4 quadrants' },
        physicalPhenomenon: { fr: 'Intégration temporelle de puissance', en: 'Instantaneous power integration' },
        keyVariable: 'E_active (kWh), E_reactive (kvarh)'
      }
    ],

    physicalPhenomena: [
      {
        phenomenon: { fr: 'Effet thermique et dérive métrologique', en: 'Thermal drift and metrology calibration' },
        description: { fr: 'Pour garantir la classe 0.2S entre -25°C et +70°C, les composants intègrent une compensation thermique numérique de tension de référence.', en: 'To maintain strict 0.2S class limits over -25°C to +70°C, the metrology engine uses digital temperature compensation on internal voltage references.' },
        governingLaw: 'CEI 62053-22 Classe 0.2S'
      }
    ],

    subcomponents: [
      { id: 'mtr-dsp', name: { fr: 'DSP métrologique certifié MID', en: 'MID Certified Metrology DSP Engine' }, function: { fr: 'Calcul précis des grandeurs électriques', en: 'Precision power/energy computation' }, materialOrTechnology: 'ASIC métrologie dédié scellé', criticality: 'CRITICAL' },
      { id: 'mtr-modem', name: { fr: 'Modem cellulaire 4G / NB-IoT enfichable', en: 'Plug-in 4G / NB-IoT Cellular Modem' }, function: { fr: 'Transmission sécurisée vers le serveur central', en: 'Encrypted communication to HES' }, materialOrTechnology: 'Module LTE Cat-M1 / NB-IoT', criticality: 'HIGH' }
    ],

    energyRole: {
      inputEnergy: 'Autoconsommation interne <2 W sur phase L1',
      outputEnergy: 'Comptage de transit jusqu\'à 100 A direct ou via TC 5A',
      conversionEfficiency: 'Non applicable',
      thermalDissipation: 'Négligeable (<5 W)'
    },

    upstreamConnections: [
      { apparatusId: 'node-tgbt-400', apparatusName: 'Arrivée TGBT 400 V', connectionType: 'Raccordement direct 4 fils ou via transformateurs de courant 5A' }
    ],
    downstreamConnections: [],

    keyEngineeringValues: [
      { key: 'Accuracy_class', label: { fr: 'Classe de Précision Active', en: 'Active Energy Accuracy Class' }, value: 'Classe 0.2S (CEI 62053-22)', unit: '', status: 'VERIFIED' },
      { key: 'Nominal_current', label: { fr: 'Courant Nominal / Maximal', en: 'Nominal / Max Current' }, value: '5(100) A ou 1(6) A sur TC', unit: 'A', status: 'VERIFIED' },
      { key: 'Protocol', label: { fr: 'Protocole de Communication', en: 'Metering Protocol' }, value: 'DLMS/COSEM (CEI 62056)', unit: '', status: 'VERIFIED' },
      { key: 'Encryption', label: { fr: 'Chiffrement des Données', en: 'Data Security Suite' }, value: 'AES-128 GCM (Security Suite 1)', unit: '', status: 'VERIFIED' }
    ],

    associatedProtections: [],
    instrumentationAndMeasurements: [
      { parameter: 'Taux de distorsion harmonique THD-U et THD-I', sensorType: 'Algorithme FFT interne jusqu\'au rang 31', typicalRange: '0 - 20%' },
      { parameter: 'Creux de tension et surtensions', sensorType: 'Détection crête 1/2 période', typicalRange: 'Événements horodatés à 1 ms' }
    ],

    automationAndControl: {
      fr: 'Relais de coupure/réarmement interne 100 A bistable télécommandé par le gestionnaire de réseau pour délestage ou impayé.',
      en: 'Internal 100 A latching contactor for remote disconnect/reconnect commanded by grid operator.'
    },

    telecomAndProtocols: {
      protocols: ['DLMS/COSEM', 'IEC 62056-21', 'MQTT'],
      physicalInterface: 'Cellulaire 4G / Port optique frontal ZVEI'
    },

    earthingAndGrounding: {
      regime: 'TT' as any,
      description: { fr: 'Boîtier double isolation classe II sans borne de terre, neutre traversant surveillé', en: 'Class II double insulated polycarbonate case, no earth connection required' }
    },

    insulationAndDielectric: {
      insulationMedium: 'Double isolation thermoplastique polycarbonate auto-extinguible',
      creepageDistance: '8 mm',
      bilRatingKv: 6
    },

    installationRequirements: {
      fr: 'Pose sur platine normalisée avec capot de bornes plombable et scellé inviolable.',
      en: 'DIN-rail or three-point backplate mounting with sealable tamper-evident terminal cover.'
    },

    operatingStates: ['ENERGIZED', 'AVAILABLE', 'UNDER_MAINTENANCE', 'FAULTED'],

    failureModesFmea: [
      {
        code: 'FM-MTR-01',
        name: { fr: 'Tentative de fraude magnétique', en: 'Magnetic Tampering Attempt' },
        rootCause: { fr: 'Application externe d\'un aimant néodyme puissant pour saturer les capteurs', en: 'External application of strong neodymium magnet' },
        consequenceOnSystem: { fr: 'Risque de sous-comptage de l\'énergie', en: 'Under-registration of consumed energy' },
        protectiveResponse: { fr: 'Capteur à effet Hall interne détectant le champ >100 mT, enregistrement de l\'événement et alerte instantanée au HES', en: 'Internal Hall sensor detects flux >100 mT, logs tamper event and raises immediate alarm' },
        severity: 'MAJOR'
      }
    ],

    safetyRisksAndLoto: {
      hazards: ['Risque d\'arc électrique lors du serrage des bornes sous tension', 'Court-circuit primaire'],
      lotoSteps: [
        'Ouverture du disjoncteur général de branchement amont',
        'Vérification d\'absence de tension VAT sur les bornes du compteur',
        'Pose du cadenas de consignation'
      ]
    },

    maintenancePlan: [
      { type: 'TESTING_COMMISSIONING', periodicity: 'Tous les 10 ans', description: { fr: 'Vérification métrologique par échantillonnage statistique selon réglementation légale', en: 'Statistical batch metrology recalibration per legal metrology regulations' }, toolsAndStandards: ['Banc d\'étalonnage MTE / ZERA'] }
    ],

    testingAndCommissioning: {
      factoryTestsFat: ['Essai de précision métrologique à différents cos phi (1.0, 0.5 inductif, 0.8 capacitif)', 'Test de tenue aux chocs de foudre 6 kV'],
      siteAcceptanceTestsSat: ['Test de connexion réseau cellulaire et synchronisation horloge NTP', 'Vérification de la concordance de phases'],
      commissioningProcedures: ['Plombage des capots de bornes par agent assermenté']
    },

    applicableStandards: [
      { standardCode: 'IEC 62053-22', title: 'Electricity metering equipment - Static meters for AC active energy (classes 0,2 S and 0,5 S)', relevantClauses: ['Clause 7, 8'], jurisdiction: 'International' },
      { standardCode: 'IEC 62056-6-2', title: 'Electricity metering data exchange - The DLMS/COSEM suite - Part 6-2: COSEM interface classes', relevantClauses: ['All'], jurisdiction: 'International' }
    ],

    associatedEngineeringRoles: [
      { roleSlug: 'metering-engineer', title: { fr: 'Ingénieur Comptage & Smart Grid', en: 'Metering & Smart Grid Engineer' }, tasks: { fr: 'Architecture du réseau de collecte AMI, gestion des clés cryptographiques et analyse des bilans de pertes réseau', en: 'AMI mesh network planning, encryption key ceremony, and non-technical loss analysis' } }
    ],

    lifecyclePhases: [
      { phase: 'OPERATION_MONITORING', deliverables: ['Courbes de charge quotidiennes', 'Rapport de détection de fraudes et d\'anomalies'], involvedRoles: ['Ingénieur Exploitation AMI'] }
    ],

    deliverablesAndDocuments: ['Certificat d\'examen de type MID', 'Protocole d\'échange DLMS/COSEM', 'Rapport d\'étalonnage d\'usine'],
    provenance: {
      id: 'prov-smartmeter-3p',
      entity_id: 'eq-exp-ami-smartmeter-3p',
      entity_type: 'equipment',
      source_ref: 'DLMS User Association & IEC 62053-22',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Smart Metering Team',
      verified_at: '2026-09-25'
    },

    assumptionsAndLimitations: {
      fr: 'Nécessite une couverture réseau 4G/NB-IoT suffisante (RSRP > -110 dBm) ou antenne déportée en sous-sol.',
      en: 'Requires adequate 4G/NB-IoT cellular signal (RSRP > -110 dBm) or remote high-gain antenna in basements.'
    },

    representations: {
      physical: {
        svgVariant: 'PANEL',
        dimensionsLabel: '0.28 m × 0.18 m × 0.08 m',
        enclosureLabel: 'Polycarbonate auto-extinguible IP54 plombable',
        maintenanceClearance: 'Accès frontal pour lecture écran LCD'
      },
      electrical: {
        symbolType: 'MEASUREMENT_METER',
        incomerTerminal: 'Bornes 1, 3, 5, 7 (L1, L2, L3, N Arrivée)',
        outgoingTerminal: 'Bornes 2, 4, 6, 8 (L1, L2, L3, N Départ)',
        protectionZone: 'Point de livraison client',
        measurementTap: 'Port optique frontal ZVEI'
      },
      functional: {
        inputSignal: 'Tensions et courants triphasés',
        conversionProcess: 'Calcul vectoriel de puissance active et réactive',
        outputSignal: 'Registres d\'énergie kWh et télétransmission DLMS',
        feedbackLoop: 'Surveillance des seuils de puissance souscrite'
      }
    }
  }
];

