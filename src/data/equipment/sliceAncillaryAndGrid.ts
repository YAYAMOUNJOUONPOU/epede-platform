// src/data/equipment/sliceAncillaryAndGrid.ts
// EPEDE - Protection Relays, Instrument Transformers, Surge Arresters & Solar Inverter

import type { CanonicalEquipmentObject } from '../../types/equipmentExplorer';

export const ANCILLARY_AND_GRID_ITEMS: CanonicalEquipmentObject[] = [
  // 10. DIGITAL SUBSTATION NUMERICAL PROTECTION RELAY (IEC 61850 IED)
  {
    id: 'eq-exp-relay-ied-61850',
    tagIec: '==K1.IED01',
    name: {
      fr: 'Relais Numérique de Protection et Contrôle-Commande IED (IEC 61850)',
      en: 'Numerical Protection & Bay Controller IED (IEC 61850)'
    },
    aliases: {
      fr: ['Calculateur de travée', 'Relais de protection multifonction', 'IED poste numérique'],
      en: ['Bay Controller Unit (BCU)', 'Numerical Protection Relay', 'Substation IED']
    },
    equipmentType: 'ProtectionRelayIED',
    category: 'PROTECTION_AND_RELAYS',
    parentDomain: 'D04',
    systemStage: 'SUBSTATIONS_NODES',
    subsystemContext: {
      fr: 'Salle de relayage / commande d\'un poste haute et moyenne tension',
      en: 'Control & relay room of a transmission/distribution substation'
    },
    technologyContext: {
      fr: 'Calculateur numérique en rack 19 pouces avec microprocesseur DSP temps réel, ports fibre optique Ethernet redondants (PRP/HSR) et interface IEC 61850-8-1 / 9-2',
      en: '19-inch rack-mounted digital computer with real-time DSP, redundant fiber-optic Ethernet ports (PRP/HSR), and IEC 61850-8-1 / 9-2 client/server stack'
    },
    applicationContext: {
      fr: 'Protection de travée et contrôle-commande de disjoncteur haute tension 225 kV au poste d\'Oyomabang',
      en: 'Bay protection and circuit breaker control for 225 kV high voltage bay at Oyomabang substation'
    },
    voltageContext: {
      nominalVoltage: '110 V DC (Auxiliaire) / 100 V AC (Entrées mesure)',
      level: 'LV',
      frequencyHz: 50,
      phases: '3-phase measurement'
    },
    typicalLocation: {
      fr: 'Châssis de relayage en salle de contrôle du poste 225 kV',
      en: '19-inch relay rack in substation control building'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Équipement électronique intelligent (IED) qui échantillonne les grandeurs analogiques (courants et tensions), exécute des algorithmes de protection numérique et déclenche le disjoncteur en cas de défaut.',
      en: 'Intelligent Electronic Device (IED) sampling analog currents/voltages, executing high-speed numerical protection algorithms, and issuing trip commands to circuit breakers.'
    },
    purpose: {
      fr: 'Détecter les anomalies de réseau en moins de 15 ms, isoler la section en défaut et transmettre les alarmes horodatées à la milliseconde au SCADA.',
      en: 'Detect electrical system faults in < 15 ms, selectively clear faulted assets, and broadcast 1 ms time-tagged alarms to SCADA.'
    },
    engineeringProblemSolved: {
      fr: 'Élimine les câblages filaires complexes de commande grâce au bus de process et aux messages optiques ultra-rapides GOOSE (< 3 ms).',
      en: 'Replaces miles of hardwired copper control cabling with redundant fiber-optic process bus using GOOSE messages (< 3 ms).'
    },

    primaryFunction: {
      fr: 'Algorithmes de protection de ligne et transformateur (Distance 21, Différentielle 87, Surintensité 50/51).',
      en: 'Line and transformer protection algorithms (Distance 21, Differential 87, Overcurrent 50/51).'
    },
    secondaryFunctions: {
      fr: ['Enregistreur de perturbations (perturbographe oscillographique)', 'Localisation précise du défaut en kilomètres (précision ±1%)', 'Synchronisation temporelle de haute précision IEEE 1588 (PTP)'],
      en: ['Digital fault disturbance recording (oscillography)', 'Fault locator pinpointing fault position in km (±1% accuracy)', 'High-accuracy time synchronization via IEEE 1588 (PTP)']
    },
    operatingPrincipleSummary: {
      fr: 'Les signaux analogiques de tores TC et TT sont filtrés et convertis à 4 kHz (80 échantillons/période). Le DSP calcule les phaseurs par transformée de Fourier discrète (DFT) et compare aux seuils configurés.',
      en: 'Analog signals from CTs/VTs are sampled at 4 kHz (80 samples/cycle). The DSP computes fundamental phasors via Discrete Fourier Transform (DFT), executing protection logic in real time.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Échantillonnage et Transformée DFT', en: 'Sampling & DFT Computation' },
        description: { fr: 'Le convertisseur A/N échantillonne les 3 courants et 3 tensions. Le DSP extrait les phaseurs fondamentaux.', en: 'A/D converter samples currents and voltages at 4 kHz; DSP calculates fundamental phasors.' },
        physicalPhenomenon: { fr: 'Transformée de Fourier discrète temps réel', en: 'Real-time Discrete Fourier Transform' },
        keyVariable: 'Sampling rate = 80 samples/cycle (4000 Hz)'
      },
      {
        stepNumber: 2,
        title: { fr: 'Évaluation des Zones de Distance (21)', en: 'Distance Zone Evaluation (21)' },
        description: { fr: 'Le relais calcule l\'impédance de boucle Z = V / I. Si le point pénètre dans l\'ellipse de Zone 1, ordre d\'ouverture immédiat.', en: 'Relay computes apparent loop impedance Z = V / I; if inside Zone 1 mho/quadrilateral locus, instantaneous trip triggers.' },
        physicalPhenomenon: { fr: 'Calcul d\'impédance apparente Z = R + jX', en: 'Apparent loop impedance calculation' },
        keyVariable: 'Zone 1 reach = 85% line length, time = 0 ms'
      },
      {
        stepNumber: 3,
        title: { fr: 'Émission de Déclenchement GOOSE', en: 'GOOSE Trip Broadcast' },
        description: { fr: 'Le relais ferme son contact statique ultra-rapide (< 1 ms) et diffuse une trame GOOSE prioritaire sur le réseau Ethernet optique.', en: 'Solid-state output contact fires (< 1 ms) while broadcasting priority GOOSE frame over fiber network.' },
        physicalPhenomenon: { fr: 'Transmission Ethernet niveau 2 prioritaire (IEEE 802.1Q)', en: 'VLAN prioritized Layer 2 Ethernet transmission' },
        keyVariable: 'Total IED operating time < 15 ms'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Boîtier métallique modulaire blindé au format standard rack 19" 4U avec face avant à écran graphique couleur',
      dimensionsApproxMeters: 'L 0.48 m × l 0.32 m × H 0.18 m',
      weightApproxKg: 8.5,
      mounting: { fr: 'Montage en baie 19 pouces dans l\'armoire de tranche de protection', en: '19-inch rack mounting in substation protection cubicle' },
      environmentalClearances: { fr: 'Accès frontal pour consultation de l\'écran et connecteur USB de paramétrage', en: 'Front access for color LCD display navigation and engineering USB port' }
    },
    mainComponents: [
      { id: 'ied-dsp', name: { fr: 'Carte processeur double cœur DSP temps réel', en: 'Dual-core real-time DSP processor board' }, function: { fr: 'Exécute les algorithmes de protection', en: 'Executes protection math algorithms' }, materialOrTechnology: 'DSP 32 bits flottants 1 GHz', criticality: 'CRITICAL' },
      { id: 'ied-analog', name: { fr: 'Module d\'entrées analogiques blindé (4 TC + 4 TT)', en: 'Analog input module (4 CTs + 4 VTs)' }, function: { fr: 'Adaptation et isolation galvanique des signaux', en: 'Galvanic isolation and signal scaling' }, materialOrTechnology: 'Transformateurs d\'isolement toroïdaux classe 0.2', criticality: 'CRITICAL' },
      { id: 'ied-opt', name: { fr: 'Module de communication optique redondant (2x LC 100Base-FX)', en: 'Redundant optical communication module (2x LC 100Base-FX)' }, function: { fr: 'Raccordement au réseau Ethernet du poste sans perte de trame', en: 'Zero-loss bumpless ring network connection (PRP/HSR)' }, materialOrTechnology: 'Transceiver optique multimode 1300 nm', criticality: 'CRITICAL' }
    ],

    energyOrSignalFlow: {
      fr: 'Signaux analogiques TC/TT → Échantillonnage A/N → Calcul DSP → Contact statique de déclenchement vers bobine disjoncteur + Trame GOOSE SCADA',
      en: 'CT/VT analog inputs → A/D sampling → DSP calculation → High-speed solid-state trip contact to breaker coil + GOOSE frame to SCADA'
    },
    electricalRole: {
      fr: 'Cerveau décisionnel de sécurité du système électrique haute tension',
      en: 'Decision-making security brain of high-voltage power system'
    },
    thermalRole: {
      fr: 'Convection naturelle dans le châssis métallique (consommation < 35 W)',
      en: 'Natural convection inside sealed chassis (< 35 W internal consumption)'
    },

    systemContextDescription: {
      fr: 'Supervise en permanence le disjoncteur 225 kV GIS et le départ ligne Songloulou-Oyomabang.',
      en: 'Continuously supervises 225 kV GIS circuit breaker and Songloulou-Oyomabang line feeder.'
    },
    upstreamEquipmentIds: ['eq-exp-gis-bay-225k'],
    downstreamEquipmentIds: [],
    relationships: [
      {
        id: 'rel-relay-gis',
        targetEquipmentId: 'eq-exp-gis-bay-225k',
        targetName: { fr: 'Travée Blindée Disjoncteur SF6 225 kV', en: '225 kV GIS Switchgear Bay' },
        targetCategory: 'SWITCHGEAR',
        relationKind: 'MONITORS' as any,
        description: { fr: 'Surveille les courants de la travée et commande l\'ouverture de la bobine de déclenchement', en: 'Monitors bay currents and commands trip coil opening' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['21', '87L', '50/51', '50N/51N', '25 (Contrôle de synchronisme)', '79 (Réenclencheur automatique)', '50BF'],
      protectiveRelayIds: [],
      summary: {
        fr: 'Relais multifonctionnel complet intégrant 28 fonctions de protection et automatisme selon les normes CEI.',
        en: 'Comprehensive multifunctional IED packing 28 protective and automation functions according to IEC standards.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Entrées analogiques 1A/5A et 100V'],
      instrumentTransformerIds: ['eq-exp-ct-225k'],
      measuredQuantities: ['Phaseurs de courants fondamentaux (A)', 'Phaseurs de tension (kV)', 'Fréquence (Hz, précision 0.005 Hz)', 'Impédance de boucle R et X (Ω)']
    },
    controlAndAutomation: {
      localControls: { fr: 'Écran graphique avec synoptique dynamique de travée, boutons d\'ouverture/fermeture et touches configurables', en: 'Color graphic LCD with bay single-line mimic, trip/close buttons, and programmable function keys' },
      remoteControls: { fr: 'Télécommande complète par station SCADA centrale via MMS IEC 61850-8-1', en: 'Supervisory control from dispatch center via IEC 61850-8-1 MMS' },
      interlocks: { fr: 'Logique programmable interne (CFC / IEC 61131-3) gérant tous les verrouillages de sectionneurs et de mise à la terre', en: 'Internal PLC logic (IEC 61131-3) enforcing all bay disconnector and earth switch interlocks' }
    },
    communicationProtocols: ['IEC 61850-8-1 (GOOSE, MMS)', 'IEC 61850-9-2 (Sampled Values)', 'IEEE 1588 PTP', 'Modbus TCP'],

    earthingAndBonding: {
      earthingRegime: 'Solid',
      connectionMethod: {
        fr: 'Borne de terre châssis M6 reliée à la barre de terre cuivrée de l\'armoire par tresse cuivre plate 16 mm²',
        en: 'M6 chassis earth stud bonded to cubicle copper ground bar via 16 mm² braided copper strap'
      },
      dischargeCapability: {
        fr: 'Tenue aux décharges électrostatiques (ESD) 8 kV contact / 15 kV air selon IEC 61000-4-2',
        en: 'Electrostatic discharge (ESD) withstand: 8 kV contact / 15 kV air (IEC 61000-4-2)'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Isolation galvanique interne par optocoupleurs et transformateurs HF (2.5 kV RMS)',
      bilRatingKv: 5,
      phaseClearanceMeters: 'Borniers débrochables avec détrompage mécanique'
    },
    connectionRequirements: {
      electrical: { fr: 'Alimentation 110 V DC redondante; borniers à vis auto-serrantes pour câbles de contrôle', en: 'Dual redundant 110 V DC auxiliary supplies; vibration-proof screw terminal blocks' },
      mechanical: { fr: 'Conformité aux essais de chocs et vibrations sismiques classe 2', en: 'Seismic and mechanical vibration shock Class 2 compliant' },
      cableOrBusbar: { fr: 'Câbles de contrôle cuivre blindés paire torsadée 1.5 mm²', en: 'Shielded twisted pair control cables 1.5 mm²' },
      earthing: { fr: 'Tresse cuivre plate souple', en: 'Flexible flat copper bonding strap' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '-25°C à +55°C',
      altitudeLimitM: 2000,
      pollutionLevel: 'Environnement de salle de commande climatisée',
      indoorOutdoor: 'INDOOR'
    },

    keyEngineeringValues: [
      { key: 'trip_time', label: { fr: 'Temps de décision de déclenchement', en: 'Operating trip time' }, value: 12, unit: 'ms', status: 'VERIFIED' },
      { key: 'goose_time', label: { fr: 'Temps de transmission GOOSE', en: 'GOOSE transfer time' }, value: 2.5, unit: 'ms', status: 'VERIFIED' },
      { key: 'clock_sync', label: { fr: 'Précision d\'horodatage PTP', en: 'PTP timestamp precision' }, value: 1, unit: 'µs', status: 'VERIFIED' },
      { key: 'sampling_freq', label: { fr: 'Fréquence d\'échantillonnage', en: 'Sampling frequency' }, value: 4000, unit: 'Hz', status: 'VERIFIED' },
      { key: 'aux_voltage', label: { fr: 'Tension auxiliaire continue', en: 'DC auxiliary supply' }, value: 110, unit: 'V', status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'UNDER_MAINTENANCE', 'FAULTED'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-IED-01',
        name: { fr: 'Défaillance de l\'autocontrôle interne (Watchdog IED) avec ouverture du contact d\'alarme', en: 'Internal self-supervision watchdog failure triggering fail-safe alarm contact' },
        rootCause: { fr: 'Erreur de somme de contrôle mémoire flash ou blocage de la boucle DSP', en: 'Flash memory checksum error or DSP computation watchdog timeout' },
        consequenceOnSystem: { fr: 'Perte de la protection de premier niveau de la travée 225 kV', en: 'Loss of primary protection on 225 kV bay' },
        protectiveResponse: { fr: 'Le relais de protection redondant (Protection 2 / secours) assure la continuité immédiate', en: 'Backup secondary protection IED assumes full protection coverage' },
        severity: 'CRITICAL'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'En l\'absence de redondance, la travée doit être consignée ou basculée sur relais de secours pour éviter tout défaut non éliminé.',
      en: 'Without redundant protection, bay must be de-energized or switched to backup relay to avoid uncleared faults.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Alimentation 110 V DC', 'Risque de surtension mortelle si les circuits secondaires TC sont ouverts en charge'],
      isolationProcedureLoto: {
        fr: 'Court-circuiter impérativement les bornes secondaires des transformateurs de courant (TC) à l\'aide des barrettes d\'essai avant de débrancher le relais.',
        en: 'Mandatory shorting of all instrument CT secondary terminals using test block shunts before relay disconnection.'
      },
      ppeRequirements: ['Gants de protection BT, tournevis dynamométrique isolé']
    },

    maintenancePlan: [
      { type: 'CONDITION_BASED', periodicity: 'Continue', description: { fr: 'Autosurveillance permanente de l\'intégrité mémoire, des tensions internes et de la synchronisation PTP', en: 'Continuous self-monitoring of memory checksums, internal voltages, and PTP sync lock' }, toolsAndStandards: ['Journal d\'événements IED', 'IEC 61850-7-4'] },
      { type: 'TESTING_COMMISSIONING', periodicity: 'Tous les 3 ans', description: { fr: 'Test automatisé des caractéristiques de déclenchement par injection de courants/tensions secondaires', en: 'Automated trip curve verification via secondary current/voltage injection test set' }, toolsAndStandards: ['Valise d\'injection Omicron CMC 356', 'Fichier XRIO'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Validation de l\'interopérabilité IEC 61850', 'Test de performance GOOSE sous charge réseau Ethernet'],
      siteAcceptanceTestsSat: ['Test d\'injection secondaire et mesure du temps de déclenchement au milliseconde', 'Test de continuité des liaisons fibre optique'],
      commissioningProcedures: ['Essai de déclenchement réel sur disjoncteur avec enregistrement de l\'oscillogramme']
    },

    applicableStandards: [
      { standardCode: 'IEC 60255-1', title: 'Measuring relays and protection equipment - Common requirements', relevantClauses: ['Clause 6 (Electrical requirements)'], jurisdiction: 'International' },
      { standardCode: 'IEC 61850-3', title: 'Communication networks and systems for power utility automation - General requirements', relevantClauses: ['Clause 5 (Environmental conditions)'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-engineer', title: { fr: 'Ingénieur Contrôle-Commande & Protections', en: 'Protection & Substation Automation Engineer' }, tasks: { fr: 'Paramétrage des fonctions de protection, coordination sélective et configuration des fichiers SCD IEC 61850', en: 'Protection relay setting calculations, coordination studies, and IEC 61850 SCD file engineering' } }
    ],
    lifecyclePhases: [
      { phase: 'COMMISSIONING', deliverables: ['Fichier de configuration CID / SCD', 'Rapport d\'essais d\'injection secondaire Omicron'], involvedRoles: ['Ingénieur Essais Protection'] }
    ],

    deliverablesAndDocuments: ['Fichier de paramétrage relais', 'Schéma des borniers d\'armoire de protection', 'Rapport de synchronisation PTP'],
    provenance: {
      id: 'prov-exp-ied-01',
      entity_id: 'eq-exp-relay-ied-61850',
      entity_type: 'equipment',
      source_ref: 'Spécification Technique Automatismes de Postes SONATREL & IEC 61850',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Automation Group',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Alimentation continue auxiliaire 110 V DC maintenue par batterie de station avec autonomie 8 heures.',
      en: '110 V DC auxiliary battery bank must provide 8-hour autonomy during total AC blackout.'
    },

    representations: {
      physical: {
        svgVariant: 'PANEL',
        dimensionsLabel: 'Rack 19" 4U (480 × 177 × 320 mm)',
        enclosureLabel: 'Boîtier métallique blindé CEM IP50',
        maintenanceClearance: 'Accès frontal libre'
      },
      electrical: {
        symbolType: 'PROTECTION_RELAY',
        incomerTerminal: 'Entrées analogiques TC (1A/5A) & TT (100V)',
        outgoingTerminal: 'Contacts secs statiques de déclenchement vers bobines disjoncteurs',
        protectionZone: 'Supervise l\'ensemble de la travée',
        measurementTap: 'Port fibre optique Ethernet process bus'
      },
      functional: {
        inputSignal: 'Grandeurs analogiques échantillonnées (i(t), v(t))',
        conversionProcess: 'Calcul vectoriel DFT temps réel et logique matricielle booléenne',
        outputSignal: 'Ordre de déclenchement ultra-rapide (< 15 ms) et message GOOSE',
        feedbackLoop: 'Surveillance continue de la position des contacts de disjoncteur'
      }
    }
  },

  // 11. 225 kV INSTRUMENT CURRENT TRANSFORMER (CT)
  {
    id: 'eq-exp-ct-225k',
    tagIec: '==E1.TC1',
    name: {
      fr: 'Transformateur de Courant Haute Tension 225 kV (TC d\'Extérieur)',
      en: '225 kV Outdoor Instrument Current Transformer (CT)'
    },
    aliases: {
      fr: ['Réducteur de courant 225 kV', 'TC HTB Oyomabang', 'Transformateur de mesure'],
      en: ['225 kV Current Transformer', 'Instrument CT', 'HV Measuring Transformer']
    },
    equipmentType: 'InstrumentTransformerCT',
    category: 'MEASUREMENT_AND_MONITORING',
    parentDomain: 'D03',
    systemStage: 'HV_EHV_TRANSMISSION',
    subsystemContext: {
      fr: 'Travée de ligne ou de transformateur d\'un poste haute tension 225 kV',
      en: 'Line or transformer bay of a 225 kV high-voltage substation'
    },
    technologyContext: {
      fr: 'Transformateur de courant à tête inversée immergé dans l\'huile avec isolateur composite en résine silicone, multi-enroulements secondaires (mesure classe 0.2S et protections 5P20)',
      en: 'Top-core oil-immersed instrument current transformer with silicone composite insulator, housing multi-core secondary windings (0.2S revenue metering and 5P20 protection)'
    },
    applicationContext: {
      fr: 'Mesure de précision des courants de phase 225 kV pour le comptage commercial et l\'alimentation des relais différentiels et de distance',
      en: 'Accurate measurement of 225 kV phase currents for revenue metering, distance and differential protection relays'
    },
    voltageContext: {
      nominalVoltage: '225 kV (Um = 245 kV)',
      level: 'HV',
      frequencyHz: 50,
      phases: 'Single-phase apparatus (3 units per bay)'
    },
    typicalLocation: {
      fr: 'Plateforme haute tension extérieure du poste d\'Oyomabang',
      en: 'Outdoor high-voltage switchyard at Oyomabang substation'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Transformateur de mesure qui reproduit au secondaire, avec une précision et un déphasage spécifiés, un courant proportionnel au courant primaire haute tension tout en assurant l\'isolation galvanique complète.',
      en: 'Instrument transformer reproducing in its secondary circuits a scaled current precisely proportional to primary high-voltage current while maintaining complete galvanic isolation.'
    },
    purpose: {
      fr: 'Alimenter en toute sécurité les relais de protection et les compteurs d\'énergie avec des courants normalisés (1 A ou 5 A).',
      en: 'Safely supply protective relays and billing meters with standardized low-voltage secondary currents (1 A or 5 A).'
    },
    engineeringProblemSolved: {
      fr: 'Les circuits de protection 5P20 ne s\'insaturent pas lors de courts-circuits sévères jusqu\'à 20 fois le courant nominal (facteur limite de précision ALF = 20).',
      en: 'The 5P20 protection cores do not saturate during extreme short-circuits up to 20 times rated current (Accuracy Limit Factor ALF = 20).'
    },

    primaryFunction: {
      fr: 'Réduction de courant haute tension 2000 A / 1 A pour mesure et protection.',
      en: 'High-voltage current stepping from 2000 A to 1 A for metering and protection.'
    },
    secondaryFunctions: {
      fr: ['Isolation galvanique haute tension (tenue au choc foudre 1050 kV)', 'Alimentation de l\'enregistreur de défauts'],
      en: ['Galvanic isolation for 225 kV (BIL 1050 kV)', 'Fault recorder waveform feed']
    },
    operatingPrincipleSummary: {
      fr: 'Le conducteur primaire traverse la tête du transformateur. Le flux magnétique induit des courants dans les enroulements secondaires bobinés sur des tores en alliage nanocristallin et acier-silicium.',
      en: 'Primary conductor traverses the top tank. Alternating magnetic flux induces secondary currents in toroidal windings wound around nanocrystalline and silicon-steel magnetic cores.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Ampères-Tours Primaires', en: 'Primary Ampere-Turns' },
        description: { fr: 'Le courant de ligne Ip traverse la barre primaire rectiligne en tête de transformateur.', en: 'Line current Ip passes through straight bar primary conductor in CT top head.' },
        physicalPhenomenon: { fr: 'Loi d\'Ampère ∮ B·dl = µ·N·Ip', en: 'Ampere law magnetic excitation' },
        keyVariable: 'Ip = 0 to 2000 A nominal (40 kA fault)'
      },
      {
        stepNumber: 2,
        title: { fr: 'Induction Toroïdale et Réduction', en: 'Toroidal Secondary Induction' },
        description: { fr: 'Les 5 tores secondaires indépendants génèrent un courant secondaire Is = Ip / N (avec N = 2000 spires).', en: '5 independent secondary toroidal cores generate secondary current Is = Ip / N (N = 2000 turns).' },
        physicalPhenomenon: { fr: 'Conservation des ampères-tours Np·Ip ≈ Ns·Is', en: 'Ampere-turns balance' },
        keyVariable: 'Ratio = 2000/1 A (Core 1: 0.2S, Cores 2-5: 5P20)'
      },
      {
        stepNumber: 3,
        title: { fr: 'Alimentation des Récepteurs', en: 'Secondary Burden Loading' },
        description: { fr: 'Le courant 1 A circule dans la boucle de relayage fermée sous une charge de 30 VA.', en: '1 A secondary current circulates through closed relay loop across 30 VA rated burden.' },
        physicalPhenomenon: { fr: 'Régime en court-circuit permanent du secondaire', en: 'Continuous closed-loop secondary circulation' },
        keyVariable: 'Burden = 30 VA, Secondary voltage < 30 V'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Tête en fonderie d\'aluminium étanche au sommet d\'un isolateur composite en silicone hydrophobe',
      dimensionsApproxMeters: 'L 0.85 m × l 0.85 m × H 3.85 m',
      weightApproxKg: 950,
      mounting: { fr: 'Fixation sur charpente métallique en acier galvanisé de 2.5 m au-dessus de la plateforme', en: 'Mounted atop 2.5 m galvanized steel support structure above ground' },
      environmentalClearances: { fr: 'Distance minimale de phase à phase de 2.5 m dans l\'air', en: '2.5 m minimum phase-to-phase air clearance' }
    },
    mainComponents: [
      { id: 'ct-core-met', name: { fr: 'Tore de comptage de précision classe 0.2S', en: '0.2S high-precision metering core' }, function: { fr: 'Mesure commerciale de l\'énergie active et réactive', en: 'Revenue billing metering' }, materialOrTechnology: 'Alliage nanocristallin à très faible hystérésis', criticality: 'HIGH' },
      { id: 'ct-core-prot', name: { fr: 'Tores de protection classe 5P20 (4 enroulements)', en: 'Class 5P20 protection cores (4 windings)' }, function: { fr: 'Alimentent les protections 21, 87L et 50BF sans saturation', en: 'Supply 21, 87L and 50BF relays without saturation' }, materialOrTechnology: 'Tôles magnétiques au silicium à grains orientés', criticality: 'CRITICAL' },
      { id: 'ct-insul', name: { fr: 'Isolateur composite à jupe silicone', en: 'Silicone composite insulator' }, function: { fr: 'Assure l\'isolement haute tension externe et tenue sismique', en: 'Provides high-voltage external insulation and seismic resilience' }, materialOrTechnology: 'Tube en résine époxy renforcé fibre de verre et jupes silicone', criticality: 'CRITICAL' }
    ],

    energyOrSignalFlow: {
      fr: 'Courant de ligne 225 kV → Barre primaire CT → Tores d\'induction → Bornier secondaire 1 A → Câble blindé vers armoire de relayage',
      en: '225 kV line current → Primary conductor bar → Secondary toroidal cores → 1 A terminal box → Shielded multi-core cable to relay room'
    },
    electricalRole: {
      fr: 'Capteur de mesure et de protection indispensable au fonctionnement des automatismes',
      en: 'Critical current measurement sensor essential for all protection and automation'
    },
    thermalRole: {
      fr: 'Dissipation thermique par l\'huile isolante et les parois métalliques de la tête en aluminium',
      en: 'Thermal dissipation via insulating oil and aluminum top tank walls'
    },

    systemContextDescription: {
      fr: 'Installé en série dans la travée 225 kV entre le disjoncteur et le sectionneur de ligne.',
      en: 'Installed in series in the 225 kV bay between the circuit breaker and line disconnector.'
    },
    upstreamEquipmentIds: ['eq-exp-gis-bay-225k'],
    downstreamEquipmentIds: ['eq-exp-relay-ied-61850'],
    relationships: [
      {
        id: 'rel-ct-ied',
        targetEquipmentId: 'eq-exp-relay-ied-61850',
        targetName: { fr: 'Relais Numérique de Protection IED (IEC 61850)', en: 'Protection & Bay Controller IED' },
        targetCategory: 'PROTECTION_AND_RELAYS',
        relationKind: 'MEASURES' as any,
        description: { fr: 'Délivre les courants secondaires 1 A au relais de protection', en: 'Supplies 1 A secondary currents to protection IED' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['50/51', '87', '21'],
      protectiveRelayIds: ['eq-exp-relay-ied-61850'],
      summary: {
        fr: 'Fournit les signaux de courant nécessaires à toutes les protections de la travée.',
        en: 'Supplies required current inputs for all bay protective elements.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Indicateur de niveau d\'huile à soufflet métallique sur la tête'],
      instrumentTransformerIds: [],
      measuredQuantities: ['Courant primaire 225 kV (A)']
    },
    controlAndAutomation: {
      localControls: { fr: 'Boîte à bornes secondaire avec barrettes de court-circuitage cadenassables', en: 'Secondary terminal box with padlocked shorting slide links' },
      remoteControls: { fr: 'Aucune commande à distance (appareil passif)', en: 'Passive device (no remote control)' },
      interlocks: { fr: 'Verrouillage de sécurité interdisant l\'ouverture du circuit secondaire sous tension', en: 'Safety interlock prohibiting open-circuiting secondary while primary is energized' }
    },
    communicationProtocols: ['Analogique 1 A / 5 A (ou liaison SV IEC 61850-9-2 si mergeur associé)'],

    earthingAndBonding: {
      earthingRegime: 'Solid',
      connectionMethod: {
        fr: 'Un point de chaque enroulement secondaire est obligatoirement mis à la terre dans la boîte à bornes; embase métallique reliée à la charpente',
        en: 'Exactly one point of each secondary winding solidly grounded in terminal box; baseplate bonded to structure'
      },
      dischargeCapability: {
        fr: 'Tenue au courant thermique de court-circuit Ith = 40 kA pendant 1 seconde',
        en: 'Rated short-time thermal current Ith = 40 kA for 1 second'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Huile minérale naphténique IEC 60296 sous membrane d\'azote',
      bilRatingKv: 1050,
      phaseClearanceMeters: 'Ligne de fuite de l\'isolateur composite : 31 mm/kV (7600 mm au total)'
    },
    connectionRequirements: {
      electrical: { fr: 'Bornes primaires plates à 4 trous en aluminium pour câble double 2x Aster 570 mm²', en: '4-hole flat aluminum primary terminal pads for twin Aster 570 mm² conductors' },
      mechanical: { fr: 'Tenue aux efforts de traction sur bornes de 3000 N', en: 'Terminal mechanical pull load withstand of 3000 N' },
      cableOrBusbar: { fr: 'Câbles de contrôle multipolaires armés 4x4 mm² Cuivre', en: '4x4 mm² copper armored multi-conductor control cable' },
      earthing: { fr: 'Câble cuivre nu 95 mm² reliant l\'embase au réseau de terre', en: '95 mm² bare copper cable connecting baseplate to grounding grid' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '10°C à 45°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'Très forte pollution (Classe e selon IEC 60815)',
      indoorOutdoor: 'OUTDOOR'
    },

    keyEngineeringValues: [
      { key: 'Ur', label: { fr: 'Tension la plus élevée pour le matériel', en: 'Highest voltage for equipment' }, value: 245, unit: 'kV', status: 'VERIFIED' },
      { key: 'Ipr', label: { fr: 'Courant primaire assigné', en: 'Rated primary current' }, value: 2000, unit: 'A', status: 'VERIFIED' },
      { key: 'Isr', label: { fr: 'Courant secondaire assigné', en: 'Rated secondary current' }, value: 1, unit: 'A', status: 'VERIFIED' },
      { key: 'Ith', label: { fr: 'Courant de courte durée thermique', en: 'Rated short-time thermal current' }, value: 40, unit: 'kA', status: 'VERIFIED' },
      { key: 'Idyn', label: { fr: 'Courant dynamique admissible', en: 'Rated dynamic current' }, value: 100, unit: 'kA', status: 'VERIFIED' },
      { key: 'cores_count', label: { fr: 'Nombre de noyaux secondaires', en: 'Number of secondary cores' }, value: 5, status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'UNDER_MAINTENANCE', 'FAULTED'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-CT-01',
        name: { fr: 'Ouverture accidentelle du circuit secondaire sous charge', en: 'Accidental open-circuit of energized CT secondary winding' },
        rootCause: { fr: 'Déconnexion d\'un fil de relayage sans court-circuitage préalable de la barrette d\'essai', en: 'Disconnection of relay wire without prior shorting at test block' },
        consequenceOnSystem: { fr: 'Apparition d\'une surtension inductive destructrice (plusieurs kilovolts) aux bornes, risque mortel d\'arc et d\'explosion', en: 'Induction of destructive multi-kilovolt voltage spikes across terminals, arc flash and fatal hazard' },
        protectiveResponse: { fr: 'Éclateur à gaz de protection ou varistance de limitation montée en parallèle sur les bornes', en: 'Gas discharge tube or secondary MOV protective limiter clamping peak voltage' },
        severity: 'CATASTROPHIC'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'En cas de destruction diélectrique du TC, amorçage franc phase-terre sur le jeu de barres 225 kV.',
      en: 'Dielectric failure of CT leads to direct phase-to-ground 225 kV busbar flashover.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Très Haute Tension 225 kV', 'Surtension mortelle si le secondaire est ouvert', 'Huile minérale diélectrique sous pression'],
      isolationProcedureLoto: {
        fr: 'Règle absolue : Ne JAMAIS ouvrir le secondaire d\'un TC en charge. Court-circuiter systématiquement les bornes avant intervention.',
        en: 'Absolute safety rule: NEVER open-circuit an energized CT secondary. Always place shorting links prior to testing.'
      },
      ppeRequirements: ['Casque, gants diélectriques, chaussures de sécurité']
    },

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Annuelle', description: { fr: 'Contrôle visuel du niveau d\'huile et thermographie infrarouge des bornes primaires', en: 'Visual inspection of oil level bellows and infrared scan of primary terminal pads' }, toolsAndStandards: ['Caméra IR', 'IEC 61869-2'] },
      { type: 'TESTING_COMMISSIONING', periodicity: 'Tous les 5 ans', description: { fr: 'Mesure de la courbe de magnétisation (point de coude) et de la résistance d\'enroulement', en: 'Excitation curve (knee-point) measurement and secondary winding resistance check' }, toolsAndStandards: ['CT Analyzer Vanguard / Omicron'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essai de précision (erreur de rapport et déphasage) de 1% à 120% In', 'Mesure de tension de claquage'],
      siteAcceptanceTestsSat: ['Contrôle de polarité (P1-S1, P2-S2)', 'Tracé de la courbe de saturation et vérification du point de coude Vk'],
      commissioningProcedures: ['Vérification de la mise à la terre unique de chaque enroulement secondaire']
    },

    applicableStandards: [
      { standardCode: 'IEC 61869-1', title: 'Instrument transformers - Part 1: General requirements', relevantClauses: ['Clause 5'], jurisdiction: 'International' },
      { standardCode: 'IEC 61869-2', title: 'Instrument transformers - Part 2: Additional requirements for current transformers', relevantClauses: ['Clause 5 (Classes 0.2S and 5P)'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-engineer', title: { fr: 'Ingénieur Métrologie & Protections', en: 'Metering & Protection Systems Engineer' }, tasks: { fr: 'Calcul du fardeau secondaire, vérification du non-dépassement du point de coude sous courant de défaut', en: 'Secondary burden calculation and CT knee-point voltage verification for maximum through-faults' } }
    ],
    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Note de calcul de dimensionnement des TC selon CEI 61869-2'], involvedRoles: ['Ingénieur BE Protections'] }
    ],

    deliverablesAndDocuments: ['Procès-verbal de vérification métrologique', 'Courbes de saturation des tores de protection', 'Plan de raccordement des polarités'],
    provenance: {
      id: 'prov-exp-ct-01',
      entity_id: 'eq-exp-ct-225k',
      entity_type: 'equipment',
      source_ref: 'Spécification Technique Postes HTB SONATREL & IEC 61869-2',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Metrology Team',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Fardeau secondaire total (câblage + relais) ne devant pas dépasser 30 VA pour garantir la classe de précision 0.2S.',
      en: 'Total secondary burden (wiring loop + relay input impedance) must remain under 30 VA for certified 0.2S class accuracy.'
    },

    representations: {
      physical: {
        svgVariant: 'CT_VT',
        dimensionsLabel: '0.85 m × 0.85 m × 3.85 m',
        enclosureLabel: 'Tête aluminium sur isolateur silicone',
        maintenanceClearance: 'Distance de sécurité 225 kV : 2.0 m'
      },
      electrical: {
        symbolType: 'CURRENT_TRANSFORMER',
        incomerTerminal: 'Borne primaire P1',
        outgoingTerminal: 'Borne primaire P2',
        protectionZone: 'Point d\'injection pour zones 21, 87, 50/51',
        measurementTap: 'Bornes secondaires 1S1-1S2 à 5S1-5S2'
      },
      functional: {
        inputSignal: 'Courant primaire 225 kV (0 à 2000 A)',
        conversionProcess: 'Transformation électromagnétique linéaire avec rapport 2000:1',
        outputSignal: 'Courant secondaire 1 A pour le relayage',
        feedbackLoop: 'Surveillance de la saturation magnétique par le relais IED'
      }
    }
  }
];
