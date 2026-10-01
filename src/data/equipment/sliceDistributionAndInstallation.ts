// src/data/equipment/sliceDistributionAndInstallation.ts
// EPEDE - MV Distribution, LV Distribution, Installation & Loads

import type { CanonicalEquipmentObject } from '../../types/equipmentExplorer';

export const DISTRIBUTION_INSTALLATION_ITEMS: CanonicalEquipmentObject[] = [
  // 5. 225/30 kV SUBSTATION STEP-DOWN TRANSFORMER
  {
    id: 'eq-exp-sub-trafo-225-30',
    tagIec: '--T02.MAIN',
    name: {
      fr: 'Transformateur Réseau Abaisseur 225 kV / 30 kV (63 MVA - OLTC)',
      en: '225 kV / 30 kV Primary Substation Transformer (63 MVA - OLTC)'
    },
    aliases: {
      fr: ['Transformateur de poste source', 'Transfo 225/30 Oyomabang', 'Abaisseur 63 MVA'],
      en: ['Grid Step-Down Transformer', '225/30 kV Substation Transformer', '63 MVA Primary Trafo']
    },
    equipmentType: 'PowerTransformer',
    category: 'TRANSFORMER',
    parentDomain: 'D04',
    systemStage: 'SUBSTATIONS_NODES',
    subsystemContext: {
      fr: 'Poste source de transformation et de répartition urbaine HTB/HTA',
      en: 'Urban bulk transmission-to-distribution step-down substation'
    },
    technologyContext: {
      fr: 'Transformateur triphasé immergé dans l\'huile minérale avec régleur en charge sous charge (OLTC) sur l\'enroulement 225 kV, couplage YNd11',
      en: 'Oil-immersed power transformer with on-load tap changer (OLTC) on 225 kV winding, vector group YNd11'
    },
    applicationContext: {
      fr: 'Abaissement de la tension de transport national 225 kV vers le réseau de distribution 30 kV de la ville de Yaoundé',
      en: 'Stepping down 225 kV bulk grid voltage to 30 kV urban distribution network for Yaoundé'
    },
    voltageContext: {
      nominalVoltage: '225 kV / 30 kV',
      level: 'HV',
      frequencyHz: 50,
      phases: '3-phase AC'
    },
    typicalLocation: {
      fr: 'Poste source SONATREL d\'Oyomabang (travée transformateur T2)',
      en: 'SONATREL Oyomabang transmission substation (T2 transformer bay)'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Transformateur de puissance abaisseur équipé d\'un régleur en charge permettant d\'ajuster le rapport de transformation sous tension pour stabiliser la tension du réseau 30 kV.',
      en: 'Primary step-down power transformer fitted with an on-load tap changer (OLTC) regulating secondary distribution voltage under varying load conditions.'
    },
    purpose: {
      fr: 'Assurer l\'interface entre la haute tension de transport et la moyenne tension de distribution urbaine tout en maintenant la tension à 30 kV ± 1.5%.',
      en: 'Interface transmission grid with urban distribution grid while dynamically clamping MV bus voltage to 30 kV ± 1.5%.'
    },
    engineeringProblemSolved: {
      fr: 'Compense les variations journalières de tension du réseau 225 kV (de 210 à 240 kV) grâce à sa plage de réglage ±10 × 1.25%.',
      en: 'Compensates for diurnal 225 kV transmission fluctuations (210 to 240 kV) via a ±10 × 1.25% on-load regulation range.'
    },

    primaryFunction: {
      fr: 'Abaissement de tension de 225 kV à 30 kV et régulation automatique de tension en charge.',
      en: 'Voltage step-down from 225 kV to 30 kV and automatic on-load voltage regulation.'
    },
    secondaryFunctions: {
      fr: ['Création du neutre 30 kV pour raccordement de la résistance de limitation de terre (NER 300A)', 'Filtrage des harmoniques de rang 3'],
      en: ['Providing artificial 30 kV neutral grounding point for 300A NER', 'Blocking 3rd harmonic propagation']
    },
    operatingPrincipleSummary: {
      fr: 'Le régleur en charge commute les prises de bobinage à l\'aide de résistances de passage sans coupure du courant d\'alimentation.',
      en: 'The high-speed vacuum OLTC transitions between winding taps using transition resistors without interrupting load current.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Détection d\'Écart de Tension', en: 'Voltage Deviation Detection' },
        description: { fr: 'Le régulateur automatique de tension (AVR Microbille) mesure 29.1 kV sur les barres 30 kV (écart > consigne).', en: 'The AVR relay detects 29.1 kV on 30 kV busbar, triggering tap change.' },
        physicalPhenomenon: { fr: 'Mesure voltmétrique et temporisation inverse', en: 'Voltmeter measurement and inverse time delay' },
        keyVariable: 'Voltage error ΔV = -3.0%'
      },
      {
        stepNumber: 2,
        title: { fr: 'Commutation Sous Charge OLTC', en: 'On-Load Tap Transition' },
        description: { fr: 'Le commutateur à vide bascule en 50 ms sur la prise supérieure à travers des résistances d\'équilibrage.', en: 'High-speed vacuum divertor switch steps to next tap in 50 ms across transition resistors.' },
        physicalPhenomenon: { fr: 'Commutation d\'impédance sans coupure de charge', en: 'Uninterrupted impedance switching' },
        keyVariable: 'Step size = 1.25% (2.81 kV on 225 kV)'
      },
      {
        stepNumber: 3,
        title: { fr: 'Rétablissement de Tension', en: 'Voltage Stabilization' },
        description: { fr: 'La tension secondaire 30 kV remonte dans sa plage nominale (30.0 kV ± 0.3 kV).', en: '30 kV secondary voltage returns to nominal setpoint deadband.' },
        physicalPhenomenon: { fr: 'Régulation en boucle fermée', en: 'Closed-loop voltage stabilization' },
        keyVariable: 'V2 = 30.0 kV, Load P = 42 MW'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Cuve étanche renforcée avec compartiment séparé pour le régleur en charge (OLTC)',
      dimensionsApproxMeters: 'L 7.2 m × l 4.8 m × H 6.2 m',
      weightApproxKg: 86000,
      mounting: { fr: 'Longrines béton armé avec bac de rétention d\'huile étanche de 32 000 litres et séparateur hydrocarbures', en: 'Reinforced concrete foundation plinth with 32,000-liter oil containment pit and hydrocarbon separator' },
      environmentalClearances: { fr: 'Séparations pare-feu béton armé REI 120 vis-à-vis des autres tranches', en: 'REI 120 firewalls separating adjacent transformer bays' }
    },
    mainComponents: [
      { id: 'st-core', name: { fr: 'Noyau magnétique à 3 colonnes à faibles pertes', en: 'Low-loss three-limb magnetic core' }, function: { fr: 'Canalise le flux alternatif', en: 'Carries alternating magnetic flux' }, materialOrTechnology: 'Tôles à grains orientés CGO laser', criticality: 'CRITICAL' },
      { id: 'st-oltc', name: { fr: 'Régleur en charge sous vide (OLTC)', en: 'Vacuum-type on-load tap changer' }, function: { fr: 'Modifie le rapport de spires en charge', en: 'Adjusts turn ratio under load' }, materialOrTechnology: 'Ampoules à vide de coupure', criticality: 'CRITICAL' },
      { id: 'st-bush-lv', name: { fr: 'Traversées débrochables MT 36 kV', en: '36 kV plug-in MV bushings' }, function: { fr: 'Raccordement des câbles souterrains 30 kV', en: 'Terminates 30 kV underground power cables' }, materialOrTechnology: 'Cône intérieur blindé pré-moulé', criticality: 'HIGH' }
    ],

    energyOrSignalFlow: {
      fr: '225 kV (Jeu de barres transport) → Primaire transformateur → Enroulement secondaire 30 kV → Jeu de barres HTA',
      en: '225 kV (Transmission bus) → Transformer primary → 30 kV secondary winding → MV switchgear busbar'
    },
    electricalRole: {
      fr: 'Nœud abaisseur HT/MT central du réseau de distribution urbain',
      en: 'Primary HV/MV step-down node supplying urban distribution grid'
    },
    thermalRole: {
      fr: 'Refroidissement mixte ONAN/ONAF assurant 45 MVA en convection naturelle et 63 MVA avec ventilateurs',
      en: 'ONAN/ONAF cooling: 45 MVA natural convection, 63 MVA forced air'
    },

    systemContextDescription: {
      fr: 'Alimente l\'ensemble du jeu de barres 30 kV du poste d\'Oyomabang via une rame de câbles souterrains XLPE 30 kV.',
      en: 'Energizes Oyomabang 30 kV distribution switchboard via parallel 30 kV XLPE underground cables.'
    },
    upstreamEquipmentIds: ['eq-exp-gis-bay-225k'],
    downstreamEquipmentIds: ['eq-exp-cell-mv-30k'],
    relationships: [
      {
        id: 'rel-subtrafo-cell',
        targetEquipmentId: 'eq-exp-cell-mv-30k',
        targetName: { fr: 'Cellule Modulaire de Distribution MT 30 kV', en: '30 kV MV Switchgear Panel' },
        targetCategory: 'MV_DISTRIBUTION',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Alimente l\'arrivée disjoncteur du tableau 30 kV', en: 'Feeds incomer breaker of 30 kV distribution board' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['87T', '50/51', '50N/51N', '49', '63 (Buchholz cuve et régleur)'],
      protectiveRelayIds: ['eq-exp-relay-87t'],
      summary: {
        fr: 'Protégé par relais différentiel transformateur 87T et deux relais Buchholz indépendants (cuve principale et compartiment OLTC).',
        en: 'Protected by 87T percentage differential and two independent Buchholz relays (main tank and OLTC head).'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Indicateur de position de prise potentiométrique', 'Thermomètres optiques enroulements (fibre optique GaAs)', 'Compteur de manœuvres OLTC'],
      instrumentTransformerIds: ['eq-exp-ct-225k'],
      measuredQuantities: ['Tension secondaire 30 kV', 'Courant de charge', 'Position de la prise OLTC (-10 à +10)', 'Température d\'huile']
    },
    controlAndAutomation: {
      localControls: { fr: 'Régulateur automatique de tension AVR (REG-D / TAPCON) en armoire de commande', en: 'Automatic Voltage Regulator AVR (REG-D / TAPCON) in control cubicle' },
      remoteControls: { fr: 'Télécommande montée/baisse des prises et télémesure depuis le SCADA Eneo/SONATREL', en: 'Raise/lower tap supervisory control from SCADA via IEC 60870-5-104' },
      interlocks: { fr: 'Blocage du régleur en cas de surintensité (> 150% In) pour éviter d\'interrompre un court-circuit', en: 'Overcurrent tap block (> 150% In) preventing tap changes during through-faults' }
    },
    communicationProtocols: ['IEC 61850 MMS', 'IEC 60870-5-104', 'Modbus TCP'],

    earthingAndBonding: {
      earthingRegime: 'NGR',
      connectionMethod: {
        fr: 'Neutre secondaire 30 kV relié à la terre à travers une résistance de neutre (NER) de 57.7 Ω (limitation à 300 A)',
        en: '30 kV secondary neutral grounded via 57.7 Ω Neutral Earthing Resistor (NER) clamping fault current to 300 A'
      },
      dischargeCapability: {
        fr: 'Courant de défaut monophasé limité à 300 A pendant 10 secondes maximum',
        en: 'Phase-to-ground fault current clamped to 300 A for maximum 10 seconds'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Huile minérale naphténique IEC 60296',
      bilRatingKv: 1050,
      phaseClearanceMeters: 'Côté 30 kV : raccordement étanche par câbles XLPE'
    },
    connectionRequirements: {
      electrical: { fr: 'Arrivée 225 kV par traversées condensateur; départ 30 kV par têtes de câbles unipolaires 1x630 mm²', en: '225 kV input via condenser bushings; 30 kV output via 1x630 mm² single-core cables' },
      mechanical: { fr: 'Galets orientables avec calage rigide sur rails scellés', en: 'Steerable rollers locked on steel rail tracks' },
      cableOrBusbar: { fr: 'Faisceau de 3 câbles XLPE 630 mm² Al par phase pour le 30 kV', en: '3x 630 mm² Al XLPE cables per phase on 30 kV side' },
      earthing: { fr: 'Raccordement de la cuve et du neutre NER au réseau de terre général', en: 'Direct tank and NER grounding to station earth mesh' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '15°C à 45°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'Zone urbaine tropicale',
      indoorOutdoor: 'OUTDOOR'
    },

    keyEngineeringValues: [
      { key: 'Sn_onaf', label: { fr: 'Puissance assignée (ONAF)', en: 'Rated power (ONAF)' }, value: 63, unit: 'MVA', status: 'VERIFIED' },
      { key: 'Sn_onan', label: { fr: 'Puissance assignée (ONAN)', en: 'Rated power (ONAN)' }, value: 45, unit: 'MVA', status: 'VERIFIED' },
      { key: 'U1', label: { fr: 'Tension primaire', en: 'Primary voltage' }, value: 225, unit: 'kV', status: 'VERIFIED' },
      { key: 'U2', label: { fr: 'Tension secondaire', en: 'Secondary voltage' }, value: 30, unit: 'kV', status: 'VERIFIED' },
      { key: 'Uk', label: { fr: 'Tension de court-circuit', en: 'Short-circuit impedance' }, value: 12.0, unit: '%', status: 'VERIFIED' },
      { key: 'oltc_range', label: { fr: 'Plage du régleur en charge', en: 'OLTC tap range' }, value: '±10 × 1.25%', status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'UNDER_MAINTENANCE', 'FAULTED'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-SUBTRAFO-01',
        name: { fr: 'Blocage mécanique du mécanisme du régleur en charge (OLTC)', en: 'OLTC drive mechanism mechanical jam' },
        rootCause: { fr: 'Usure des engrenages ou défaillance du frein moteur en cours de transition', en: 'Gearbox wear or motor brake failure mid-tap transition' },
        consequenceOnSystem: { fr: 'Résistances de passage sous tension prolongée, échauffement extrême et risque d\'incendie du régleur', en: 'Transition resistors continuously energized, extreme oil overheating and OLTC tank fire' },
        protectiveResponse: { fr: 'Protection de fin de course temporisée (6 s) déclenchant le transformateur d\'urgence', en: 'Transition watchdog timer (6 s) issuing emergency trip of all transformer breakers' },
        severity: 'CATASTROPHIC'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'Coupure d\'alimentation de 63 MVA pour la zone urbaine de Yaoundé (perte de ~150 000 clients).',
      en: 'Loss of 63 MVA supply to Yaoundé urban grid (outage affecting ~150,000 customers).'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Très Haute Tension 225 kV', 'Moyenne Tension 30 kV', 'Huile inflammable (28 000 Litres)'],
      isolationProcedureLoto: {
        fr: 'Déclenchement et consignation des disjoncteurs 225 kV et 30 kV, mise à la terre des enroulements primaire et secondaire.',
        en: 'Lockout of 225 kV and 30 kV breakers, solid earthing applied to both winding terminals.'
      },
      ppeRequirements: ['Casque, lunettes, chaussures de sécurité diélectriques, gants isolants']
    },

    maintenancePlan: [
      { type: 'CONDITION_BASED', periodicity: 'Annuelle', description: { fr: 'Analyse chromatographique de l\'huile (DGA) cuve et compartiment OLTC', en: 'DGA analysis of main tank and OLTC selector compartment' }, toolsAndStandards: ['Chromatographe', 'IEC 60599'] },
      { type: 'PREVENTIVE', periodicity: 'Tous les 5 ans ou 50 000 manœuvres', description: { fr: 'Révision complète de la tête de régleur en charge et mesure de résistance de contact', en: 'Complete OLTC diverter switch overhaul and contact resistance check' }, toolsAndStandards: ['Manuel constructeur Reinhausen / MR'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essais diélectriques de choc de foudre', 'Mesure des pertes à vide et en charge', 'Essai d\'échauffement'],
      siteAcceptanceTestsSat: ['Rigidité diélectrique de l\'huile', 'Vérification du rapport sur les 21 prises OLTC', 'Résistance d\'isolement 5 kV'],
      commissioningProcedures: ['Essai de régulation de tension en charge avec le relais AVR en mode automatique']
    },

    applicableStandards: [
      { standardCode: 'IEC 60076-1', title: 'Power transformers - General', relevantClauses: ['Clause 5 (Rating)'], jurisdiction: 'International' },
      { standardCode: 'IEC 60214-1', title: 'Tap-changers - Part 1: Performance requirements and test methods', relevantClauses: ['Clause 5'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-engineer', title: { fr: 'Ingénieur Postes & Réseaux', en: 'Substation & Network Engineer' }, tasks: { fr: 'Surveillance de la charge transformateur et optimisation des lois de régulation de tension AVR', en: 'Transformer load monitoring and AVR voltage regulation settings tuning' } }
    ],
    lifecyclePhases: [
      { phase: 'OPERATION_MONITORING', deliverables: ['Rapports annuels d\'exploitation', 'Historique des manœuvres OLTC'], involvedRoles: ['Chef de Poste'] }
    ],

    deliverablesAndDocuments: ['Plan d\'implantation poste source', 'Fiche d\'essais usine FAT', 'Manuel d\'utilisation régleur OLTC'],
    provenance: {
      id: 'prov-exp-subtrafo-01',
      entity_id: 'eq-exp-sub-trafo-225-30',
      entity_type: 'equipment',
      source_ref: 'Dossier Technique Poste Source SONATREL Oyomabang & IEC 60076',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Team',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Puissance maximale 63 MVA sous réserve de ventilation forcée active et température ambiante < 40°C.',
      en: '63 MVA peak rating requires forced air cooling operational and ambient temperature < 40°C.'
    },

    representations: {
      physical: {
        svgVariant: 'TRANSFORMER',
        dimensionsLabel: '7.2 m × 4.8 m × 6.2 m',
        enclosureLabel: 'Cuve acier étanche avec régleur OLTC',
        maintenanceClearance: 'Distance de sécurité 225 kV : 2.0 m'
      },
      electrical: {
        symbolType: 'TRANSFORMER_OLTC',
        incomerTerminal: '225 kV Étoile neutre sorti',
        outgoingTerminal: '30 kV Triangle avec mise à la terre NER',
        protectionZone: 'Zone protégée 87T',
        measurementTap: 'Tores TC traversées + Sonde AVR'
      },
      functional: {
        inputSignal: '225 kV triphasé (±10%)',
        conversionProcess: 'Transformation électromagnétique avec ajustement dynamique du rapport par l\'OLTC',
        outputSignal: '30.0 kV triphasé régulé',
        feedbackLoop: 'Boucle de régulation de tension AVR fermée sur la consigne 30.0 kV'
      }
    }
  },

  // 6. 30 kV MEDIUM VOLTAGE SWITCHGEAR PANEL
  {
    id: 'eq-exp-cell-mv-30k',
    tagIec: '==J1.QA1',
    name: {
      fr: 'Cellule Modulaire de Distribution MT 30 kV (Départ Ligne / Câble)',
      en: '30 kV Medium Voltage Distribution Switchgear Panel (Feeder)'
    },
    aliases: {
      fr: ['Cellule départ 30 kV', 'Tableau HTA Eneo', 'Cellule blindée MT'],
      en: ['30 kV Switchgear Cubicle', 'MV Feeder Panel', 'Metal-Clad MV Switchgear']
    },
    equipmentType: 'MVSwitchgearCell',
    category: 'MV_DISTRIBUTION',
    parentDomain: 'D05',
    systemStage: 'MV_DISTRIBUTION',
    subsystemContext: {
      fr: 'Salle moyenne tension (HTA) de poste de répartition urbain',
      en: 'Medium voltage indoor switchroom in primary urban distribution hub'
    },
    technologyContext: {
      fr: 'Cellule sous enveloppe métallique compartimentée (LSC2B-PM) avec disjoncteur débrochable à coupure dans le vide et isolation d\'air',
      en: 'Metal-clad compartmentalized switchgear (LSC2B-PM) with withdrawable vacuum circuit breaker and air insulation'
    },
    applicationContext: {
      fr: 'Départ feeder 30 kV alimentant les boucles urbaines et postes abaisseurs MT/BT de Yaoundé (Feeder Obala / Nsam)',
      en: '30 kV distribution feeder feeding urban underground rings and pole/kiosk distribution stations'
    },
    voltageContext: {
      nominalVoltage: '30 kV (Um = 36 kV)',
      level: 'MV',
      frequencyHz: 50,
      phases: '3-phase AC'
    },
    typicalLocation: {
      fr: 'Salle MT 30 kV du poste d\'Oyomabang / Poste Eneo Nsam',
      en: '30 kV switchroom Oyomabang substation / Eneo Nsam distribution center'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Ensemble appareillé modulaire sous enveloppe métallique renfermant le disjoncteur 30 kV débrochable, les transformateurs de courant/tension, le sectionneur de terre et le relais numérique de protection.',
      en: 'Modular metal-clad switchgear cubicle housing withdrawable 30 kV vacuum circuit breaker, instrument CTs/VTs, high-speed earth switch, and numerical protection relay.'
    },
    purpose: {
      fr: 'Assurer la protection contre les courts-circuits, le comptage d\'énergie et la télécommande d\'un feeder de distribution 30 kV.',
      en: 'Provide short-circuit fault clearing, revenue energy metering, and remote SCADA control for a 30 kV feeder.'
    },
    engineeringProblemSolved: {
      fr: 'Protège le personnel contre les effets thermiques et de pression d\'un arc interne grâce à sa classification IAC A-FLR 16 kA 1 seconde.',
      en: 'Shields operating personnel from thermal and explosive shock of internal arcing via IAC A-FLR 16 kA 1s internal arc classification.'
    },

    primaryFunction: {
      fr: 'Manœuvre en charge et interruption des défauts de court-circuit sur le réseau 30 kV.',
      en: 'Load switching and fault interruption on 30 kV distribution network.'
    },
    secondaryFunctions: {
      fr: ['Mise à la terre de sécurité du câble 30 kV en aval', 'Mesure des courants et tensions pour le comptage et la protection', 'Verrouillage mécanique interdisant les fausses manœuvres'],
      en: ['Downstream cable safe earthing', 'Measurement of electrical currents and voltages for billing/protection', 'Mechanical interlocking preventing improper operating sequence']
    },
    operatingPrincipleSummary: {
      fr: 'Le disjoncteur utilise des ampoules à vide céramiques où les contacts en cuivre-chrome se séparent sans gaz à effet de serre.',
      en: 'The circuit breaker uses ceramic vacuum interrupters where copper-chromium contacts separate without greenhouse gases.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Détection du Défaut MT', en: 'MV Fault Detection' },
        description: { fr: 'Le relais numérique (50/51) détecte un court-circuit de 4200 A sur le feeder 30 kV.', en: 'Numerical overcurrent relay (50/51) detects 4200 A feeder short-circuit.' },
        physicalPhenomenon: { fr: 'Mesure par tores TC tore de phase', en: 'CT toroidal current measurement' },
        keyVariable: 'I_fault = 4.2 kA'
      },
      {
        stepNumber: 2,
        title: { fr: 'Coupure dans le Vide', en: 'Vacuum Interruption' },
        description: { fr: 'Les contacts s\'écartent de 12 mm dans l\'ampoule à vide étanche. L\'arc de vapeur métallique s\'éteint au premier passage à zéro.', en: 'Contacts separate by 12 mm inside vacuum bottle. Metal vapor arc clears at first natural current zero.' },
        physicalPhenomenon: { fr: 'Condensation de vapeur métallique et régénération diélectrique ultra-rapide', en: 'Vapor condensation and rapid dielectric recovery' },
        keyVariable: 'Clearance time < 35 ms'
      },
      {
        stepNumber: 3,
        title: { fr: 'Isolement Sécurisé', en: 'Secured Isolation' },
        description: { fr: 'Le circuit en aval est isolé et peut être mis à la terre par le sectionneur de terre cadenassable.', en: 'Downstream cable is safely disconnected and can be grounded via interlocked earth knife.' },
        physicalPhenomenon: { fr: 'Isolement mécanique et consignation', en: 'Mechanical disconnection and lockout' },
        keyVariable: 'Safe state: OPEN & EARTHED'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Armoire métallique modulaire en tôle d\'acier zinguée alu-zinc (LSC2B-PM) avec clapet d\'évacuation de surpression',
      dimensionsApproxMeters: 'L 0.8 m × l 1.6 m × H 2.3 m',
      weightApproxKg: 1200,
      mounting: { fr: 'Pose au sol sur caniveau à câbles avec fixation par goujons d\'ancrage', en: 'Floor mounted over cable trench with high-tensile anchor bolts' },
      environmentalClearances: { fr: 'Dégagement avant 1.5 m pour débrochage du chariot de disjoncteur', en: '1.5 m front clearance for breaker truck withdrawal' }
    },
    mainComponents: [
      { id: 'cell-vcb', name: { fr: 'Disjoncteur débrochable à ampoules à vide 30 kV', en: '30 kV withdrawable vacuum circuit breaker' }, function: { fr: 'Assure la coupure des courants', en: 'Executes current breaking' }, materialOrTechnology: 'Ampoules à vide cuivre-chrome', criticality: 'CRITICAL' },
      { id: 'cell-ct', name: { fr: 'Transformateurs de courant moulés en résine', en: 'Resin cast instrument current transformers' }, function: { fr: 'Alimentent le relais de protection et la centrale de mesure', en: 'Feed protection IED and revenue meter' }, materialOrTechnology: 'Résine époxy classe 0.2S / 5P20', criticality: 'HIGH' },
      { id: 'cell-es', name: { fr: 'Sectionneur de mise à la terre rapide', en: 'High-speed cable earthing switch' }, function: { fr: 'Met à la terre le câble avec pouvoir de fermeture sur court-circuit', en: 'Grounds outgoing cable with fault-make capacity' }, materialOrTechnology: 'Couteaux cuivre avec enclenchement brusque à ressort', criticality: 'CRITICAL' }
    ],

    energyOrSignalFlow: {
      fr: 'Jeu de barres 30 kV supérieur → Traversées d\'embrochage → Disjoncteur sous vide → Tores TC → Câbles souterrains 30 kV',
      en: 'Top 30 kV busbar → Withdrawable spouts → Vacuum breaker → CT sensors → 30 kV outgoing cables'
    },
    electricalRole: {
      fr: 'Nœud de protection, sectionnement et distribution de l\'artère moyenne tension',
      en: 'Protection, isolation, and distribution node for medium voltage feeder'
    },
    thermalRole: {
      fr: 'Ventilation naturelle par fentes en chicane IP4X',
      en: 'Natural ventilation louvers maintaining internal temperature rise < 65 K'
    },

    systemContextDescription: {
      fr: 'Connecté au jeu de barres 30 kV du poste source pour alimenter le réseau de distribution aérien et souterrain.',
      en: 'Connected to primary substation 30 kV busbar feeding urban and rural distribution feeders.'
    },
    upstreamEquipmentIds: ['eq-exp-sub-trafo-225-30'],
    downstreamEquipmentIds: ['eq-exp-kiosk-30kv-400v'],
    relationships: [
      {
        id: 'rel-cell-kiosk',
        targetEquipmentId: 'eq-exp-kiosk-30kv-400v',
        targetName: { fr: 'Poste Kiosque HTA/BT 30 kV / 400 V (630 kVA)', en: 'Pad-Mounted Substation 30 kV / 400 V (630 kVA)' },
        targetCategory: 'MV_DISTRIBUTION',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Alimente le câble 30 kV aboutissant au poste kiosque de quartier', en: 'Feeds 30 kV cable running to neighborhood distribution kiosk' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['50/51 (Surintensité)', '50N/51N (Masse terre)', '49 (Thermique)', '67N (Directionnelle terre si boucle)'],
      protectiveRelayIds: ['eq-exp-relay-ied-61850'],
      summary: {
        fr: 'Relais numérique de départ (Sepam / Siprotec / Micom) avec courbes temps inverse CEI (Normalement Inverse) coordonnées avec le réenclencheur aval.',
        en: 'Feeder protection IED with IEC Normally Inverse curves graded with downstream auto-reclosers.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Indicateur de présence de tension capacitif (VPIS)', 'Capteurs d\'arc optique dans les compartiments'],
      instrumentTransformerIds: ['eq-exp-ct-225k'],
      measuredQuantities: ['Courants de phase IL1, IL2, IL3', 'Courant homopolaire I0', 'Tension simple et composée', 'Énergie kWh']
    },
    controlAndAutomation: {
      localControls: { fr: 'Face avant du relais avec boutons d\'ouverture/fermeture et manivelle de débrochage', en: 'Relay front fascia with trip/close pushbuttons and racking handle access' },
      remoteControls: { fr: 'Télécommande d\'ouverture/fermeture via automate de poste RTU et protocole IEC 60870-5-104', en: 'SCADA open/close commands via substation RTU and IEC 60870-5-104' },
      interlocks: { fr: 'Verrouillage mécanique interdisant le débrochage si le disjoncteur est fermé, ou la fermeture du sectionneur de terre si le disjoncteur est embroché', en: 'Mechanical interlocks preventing truck racking with breaker closed, or closing earth switch with truck in service' }
    },
    communicationProtocols: ['IEC 61850 GOOSE/MMS', 'Modbus RTU/TCP', 'IEC 60870-5-104'],

    earthingAndBonding: {
      earthingRegime: 'NGR',
      connectionMethod: {
        fr: 'Barre de terre principale en cuivre 50x6 mm traversant toutes les cellules et reliée au collecteur du poste',
        en: '50x6 mm copper main earthing bus running across all cubicles connected to substation collector'
      },
      dischargeCapability: {
        fr: 'Tenue au courant de court-circuit 16 kA pendant 1 seconde',
        en: '16 kA short-time current for 1 second'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Air sec + Ampoules à vide pour la coupure',
      bilRatingKv: 170,
      phaseClearanceMeters: 'Distance d\'isolement dans l\'air > 280 mm sous 36 kV'
    },
    connectionRequirements: {
      electrical: { fr: 'Raccordement jusqu\'à 3 câbles unipolaires 30 kV par phase avec connecteurs séparables en équerre', en: 'Up to 3 single-core 30 kV cables per phase using screened elbow separable connectors' },
      mechanical: { fr: 'Colliers de serrage en aluminium amagnétique pour fixer les câbles contre les efforts de court-circuit', en: 'Non-magnetic aluminum cable cleats withstanding short-circuit electrodynamic forces' },
      cableOrBusbar: { fr: 'Barres cuivre plates étamées 1250 A', en: '1250 A tinned flat copper busbars' },
      earthing: { fr: 'Raccordement direct de l\'écran de chaque câble à la barre de terre', en: 'Direct bonding of each cable metallic screen to earth bus' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '10°C à 40°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'Environnement intérieur propre IP4X',
      indoorOutdoor: 'INDOOR'
    },

    keyEngineeringValues: [
      { key: 'Ur', label: { fr: 'Tension assignée', en: 'Rated voltage' }, value: 36, unit: 'kV', status: 'VERIFIED' },
      { key: 'Ir', label: { fr: 'Courant nominal assigné jeu de barres', en: 'Rated busbar current' }, value: 1250, unit: 'A', status: 'VERIFIED' },
      { key: 'Isc', label: { fr: 'Pouvoir de coupure en court-circuit', en: 'Short-circuit breaking current' }, value: 16, unit: 'kA', status: 'VERIFIED' },
      { key: 'tk', label: { fr: 'Durée admissible du court-circuit', en: 'Rated short-circuit duration' }, value: 1.0, unit: 's', status: 'VERIFIED' },
      { key: 'iac', label: { fr: 'Tenue à l\'arc interne', en: 'Internal arc classification (IAC)' }, value: 'A-FLR 16 kA 1s', status: 'VERIFIED' },
      { key: 'bil', label: { fr: 'Tension de tenue au choc foudre', en: 'Lightning impulse withstand' }, value: 170, unit: 'kV', status: 'VERIFIED' }
    ],

    availableStates: ['CLOSED', 'OPEN', 'TRIPPED', 'ISOLATED', 'EARTHED', 'UNDER_MAINTENANCE', 'LOCAL_CONTROL', 'REMOTE_CONTROL'],
    defaultState: 'CLOSED',

    failureModes: [
      {
        code: 'FM-CELL-01',
        name: { fr: 'Arc électrique interne dans le compartiment câbles', en: 'Internal power arc flash inside cable compartment' },
        rootCause: { fr: 'Défaut de montage d\'une extrémité de câble 30 kV ou infiltration d\'humidité', en: 'Incorrect 30 kV cable termination installation or moisture ingress' },
        consequenceOnSystem: { fr: 'Montée brutale en pression, ouverture du clapet de toit, coupure du jeu de barres', en: 'Sudden pressure wave, roof flap opening, busbar protection trip' },
        protectiveResponse: { fr: 'Détection optique ultra-rapide par capteur d\'arc (< 5 ms) déclenchant le disjoncteur d\'arrivée', en: 'Ultra-fast optical arc detection (< 5 ms) tripping upstream incomer breaker' },
        severity: 'CATASTROPHIC'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'Perte du départ 30 kV et mise hors tension de tous les postes MT/BT raccordés en aval (~10 à 20 MW coupés).',
      en: 'Loss of 30 kV feeder de-energizing all downstream distribution substations (~10-20 MW interrupted).'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Moyenne Tension 30 kV', 'Arc flash électrique violent', 'Énergie mécanique du mécanisme du disjoncteur'],
      isolationProcedureLoto: {
        fr: 'Ouverture disjoncteur, débrochage en position "Essai/Sectionné", fermeture du sectionneur de mise à la terre, cadenassage des volets métalliques.',
        en: 'Trip breaker, rack out to "Test/Disconnected", close cable earthing switch, padlock automatic safety shutters.'
      },
      ppeRequirements: ['Combinaison anti-arc 40 cal/cm²', 'Écran facial avec cagoule', 'Gants d\'électricien classe 4 (36 kV)']
    },

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Annuelle', description: { fr: 'Dépoussiérage, contrôle thermographique des connexions et graissage des tringleries', en: 'Dust removal, infrared thermography of busbar joints, and drive linkage lubrication' }, toolsAndStandards: ['Caméra IR', 'Graisse diélectrique'] },
      { type: 'TESTING_COMMISSIONING', periodicity: 'Tous les 3 ans', description: { fr: 'Essais d\'injection de courant secondaire sur le relais et mesure de la résistance de contact', en: 'Secondary current injection testing of protection relay and micro-ohm contact resistance test' }, toolsAndStandards: ['Valise d\'injection Omicron CMC 356', 'Micro-ohmmètre'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essai de tenue à fréquence industrielle 70 kV / 1 min', 'Mesure des décharges partielles', 'Vérification des verrouillages mécaniques'],
      siteAcceptanceTestsSat: ['Essai d\'isolement diélectrique 5 kV', 'Essai de fonctionnement de l\'ensemble de protection avec déclenchement réel'],
      commissioningProcedures: ['Vérification de la concordance de phase 30 kV avant rebouclage']
    },

    applicableStandards: [
      { standardCode: 'IEC 62271-200', title: 'AC metal-enclosed switchgear and controlgear for rated voltages above 1 kV and up to and including 52 kV', relevantClauses: ['Clause 6 (Type tests)', 'Clause 8.104 (Internal arc test)'], jurisdiction: 'International' },
      { standardCode: 'IEC 62271-102', title: 'Alternating current disconnectors and earthing switches', relevantClauses: ['Clause 6'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-engineer', title: { fr: 'Ingénieur Exploitation Distribution MT', en: 'MV Distribution Operations Engineer' }, tasks: { fr: 'Planification des manœuvres de délestage et de bouclage des départs 30 kV', en: 'Feeder switching schedule management and load transfer coordination' } }
    ],
    lifecyclePhases: [
      { phase: 'COMMISSIONING', deliverables: ['Fiches de réglage des protections', 'Procès-verbal d\'essais sous tension'], involvedRoles: ['Ingénieur Essais'] }
    ],

    deliverablesAndDocuments: ['Schéma de câblage armoire MT', 'Fiche technique cellule 30 kV', 'Notice d\'instructions de manœuvre'],
    provenance: {
      id: 'prov-exp-cell-01',
      entity_id: 'eq-exp-cell-mv-30k',
      entity_type: 'equipment',
      source_ref: 'Spécification Technique Distribution Eneo Cameroun & IEC 62271-200',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE MV Systems Engineering',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Exploitation en standard 30 kV (spécificité Cameroun/Afrique Centrale, distinct du 20 kV européen).',
      en: 'Operates at 30 kV standard (Cameroon/Central Africa grid specification, distinct from 20 kV in Europe).'
    },

    representations: {
      physical: {
        svgVariant: 'SWITCHGEAR',
        dimensionsLabel: '0.8 m × 1.6 m × 2.3 m',
        enclosureLabel: 'Armoire métallique étanche à l\'arc interne (IAC)',
        maintenanceClearance: 'Dégagement frontal 1.5 m'
      },
      electrical: {
        symbolType: 'CIRCUIT_BREAKER_MV',
        incomerTerminal: 'Jeu de barres 30 kV',
        outgoingTerminal: 'Câbles de départ 30 kV',
        protectionZone: 'Zone protégée Feeder 50/51',
        measurementTap: 'Tores TC toroïdaux + Prise capacitive VPIS'
      },
      functional: {
        inputSignal: 'Puissance 30 kV du poste source',
        conversionProcess: 'Sectionnement et interruption sans modification de tension',
        outputSignal: 'Puissance 30 kV distribuée vers les boucles urbaines',
        feedbackLoop: 'Signalisation d\'état ouvert/fermé/défaut vers SCADA'
      }
    }
  },

  // 7. COMPACT KIOSK DISTRIBUTION SUBSTATION (30 kV / 400 V)
  {
    id: 'eq-exp-kiosk-30kv-400v',
    tagIec: '==SS.KIOSK01',
    name: {
      fr: 'Poste Kiosque Préfabriqué HTA/BT 30 kV / 400 V (630 kVA)',
      en: 'Pad-Mounted Secondary Distribution Substation 30 kV / 400 V (630 kVA)'
    },
    aliases: {
      fr: ['Poste compact HTA/BT', 'Cabine de distribution publique', 'Poste Eneo 630 kVA'],
      en: ['Pad-Mounted Substation', 'Secondary Substation 630 kVA', 'Compact Distribution Kiosk']
    },
    equipmentType: 'DistributionSubstation',
    category: 'MV_DISTRIBUTION',
    parentDomain: 'D05',
    systemStage: 'MV_DISTRIBUTION',
    subsystemContext: {
      fr: 'Poste de distribution publique urbaine ou raccordement client tertiaire/industriel',
      en: 'Urban public distribution node or commercial facility point of delivery'
    },
    technologyContext: {
      fr: 'Enveloppe préfabriquée en béton armé intégrant un tableau HTA compact RMU (Ring Main Unit) SF6, un transformateur 630 kVA étanche à huile et un tableau BT (TUR)',
      en: 'Factory-assembled reinforced concrete kiosk housing compact SF6 RMU, hermetically sealed 630 kVA transformer, and LV fuse board'
    },
    applicationContext: {
      fr: 'Alimentation basse tension des quartiers résidentiels et commerces (ex. Quartier Bastos Yaoundé / Akwa Douala)',
      en: 'Low-voltage 400 V / 230 V power supply for residential neighborhoods and commercial buildings'
    },
    voltageContext: {
      nominalVoltage: '30 kV / 400 V',
      level: 'MV',
      frequencyHz: 50,
      phases: '3-phase 4-wire (3P + N)'
    },
    typicalLocation: {
      fr: 'Voierie urbaine ou cour technique d\'immeuble tertiaire (Douala / Yaoundé)',
      en: 'Urban street corner or commercial facility equipment yard'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Poste de transformation abaisseur préfabriqué et testé en usine réalisant la conversion finale de l\'énergie moyenne tension 30 kV en basse tension triphasée 400 V / 230 V utilisable par les usagers.',
      en: 'Type-tested factory-assembled secondary distribution kiosk performing final voltage step-down from 30 kV distribution to consumer-usable 400 V three-phase / 230 V single-phase.'
    },
    purpose: {
      fr: 'Fournir une énergie électrique basse tension sécurisée, protégée et mesurable aux réseaux de distribution de quartier ou aux TGBT.',
      en: 'Deliver safe, protected, and metered low-voltage electrical power to local distribution networks and building switchboards.'
    },
    engineeringProblemSolved: {
      fr: 'Permet le passage de la boucle moyenne tension sans coupure générale grâce à son unité RMU (2 interrupteurs d\'arrivée boucle + 1 départ protégé).',
      en: 'Enables medium voltage ring-main loop sectionalizing without customer interruption via its 3-way RMU.'
    },

    primaryFunction: {
      fr: 'Abaissement de tension 30 kV vers 400 V et distribution basse tension protégée par fusibles HPC.',
      en: 'Step-down from 30 kV to 400 V and fused low-voltage feeder distribution.'
    },
    secondaryFunctions: {
      fr: ['Sectionnement de boucle MT', 'Protection du transformateur par combiné interrupteur-fusibles ou disjoncteur autonome', 'Mise à la terre du neutre basse tension selon le schéma TT'],
      en: ['MV ring loop sectionalizing', 'Transformer protection via fuse-switch or self-powered breaker', 'Low-voltage neutral earthing under TT scheme']
    },
    operatingPrincipleSummary: {
      fr: 'La boucle 30 kV traverse le tableau RMU. Le transformateur immergé étanche abaisse la tension à 400 V, alimentant le tableau urbain BT qui dessert 8 départs protégés.',
      en: '30 kV ring loop flows through the RMU. Sealed transformer steps voltage down to 400 V feeding LV fuse board with 8 sub-feeders.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Arrivée Boucle MT 30 kV', en: '30 kV Ring Incomer' },
        description: { fr: 'Le câble souterrain 30 kV pénètre dans l\'interrupteur sous SF6 de l\'unité RMU.', en: '30 kV underground cable terminates into RMU SF6 load-break switch.' },
        physicalPhenomenon: { fr: 'Transit d\'énergie en boucle fermée', en: 'Closed ring power flow' },
        keyVariable: 'Vin = 30 kV'
      },
      {
        stepNumber: 2,
        title: { fr: 'Transformation Basse Tension', en: 'Low Voltage Transformation' },
        description: { fr: 'Le transformateur 630 kVA abaisse la tension à 400 V entre phases et 230 V phase-neutre.', en: '630 kVA transformer steps voltage down to 400 V phase-to-phase and 230 V phase-to-neutral.' },
        physicalPhenomenon: { fr: 'Conversion électromagnétique Dyn11', en: 'Dyn11 electromagnetic conversion' },
        keyVariable: 'Vout = 400 V, In = 909 A'
      },
      {
        stepNumber: 3,
        title: { fr: 'Distribution Départs BT', en: 'LV Feeder Distribution' },
        description: { fr: 'Le tableau BT (TUR) répartit le courant vers 8 départs de câbles protégés par fusibles NH2 400 A.', en: 'LV board distributes power across 8 cable feeders protected by NH2 400 A fuses.' },
        physicalPhenomenon: { fr: 'Protection de surintensité par fusibles HPC', en: 'HRC fuse overcurrent protection' },
        keyVariable: '8x Feeders to building TGBTs'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Enveloppe préfabriquée en béton armé monobloc avec ventilation naturelle et bac de rétention intégré',
      dimensionsApproxMeters: 'L 3.2 m × l 1.8 m × H 2.2 m',
      weightApproxKg: 9500,
      mounting: { fr: 'Pose sur radier ou lit de sable nivelé avec fosse technique étanche pour câbles', en: 'Installed on gravel bed or concrete foundation slab with waterproof cable basement' },
      environmentalClearances: { fr: 'Zone de sécurité de 1.0 m autour des portes d\'accès pour intervention des équipes', en: '1.0 m clear perimeter around access doors for maintenance crews' }
    },
    mainComponents: [
      { id: 'k-rmu', name: { fr: 'Tableau compact HTA 36 kV sous enveloppe SF6 (RMU)', en: 'Compact 36 kV SF6 Ring Main Unit (RMU)' }, function: { fr: 'Assure les manœuvres de boucle et la protection du transfo', en: 'Executes ring sectionalizing and transformer protection' }, materialOrTechnology: 'Cuve inox soudée étanche à vie IP67', criticality: 'CRITICAL' },
      { id: 'k-trafo', name: { fr: 'Transformateur 30 kV / 400 V - 630 kVA étanche à remplissage total', en: 'Hermetically sealed 30 kV / 400 V 630 kVA transformer' }, function: { fr: 'Abaisse la tension avec pertes réduites (EcoDesign Tier 2)', en: 'Steps down voltage with low losses' }, materialOrTechnology: 'Huile minérale sans conservateur à ondes de dilatation', criticality: 'CRITICAL' },
      { id: 'k-tur', name: { fr: 'Tableau Urbain Réduit BT (TUR) à 8 départs', en: '8-way Low-Voltage Distribution Board (TUR)' }, function: { fr: 'Protège et distribue l\'énergie vers les colonnes d\'immeuble', en: 'Protects and distributes power to building risers' }, materialOrTechnology: 'Fusibles à haut pouvoir de coupure NH2', criticality: 'HIGH' }
    ],

    energyOrSignalFlow: {
      fr: 'Câble 30 kV réseau → RMU MT → Transformateur 630 kVA → Jeu de barres BT 400 V → Départs câbles BT → TGBT client',
      en: '30 kV network cable → MV RMU → 630 kVA transformer → 400 V LV busbar → LV outgoing cables → Customer TGBT'
    },
    electricalRole: {
      fr: 'Passerelle finale de conversion moyenne tension vers basse tension utilisable',
      en: 'Final medium-to-low voltage conversion gateway for end utilization'
    },
    thermalRole: {
      fr: 'Refroidissement naturel de l\'enveloppe béton par circulation d\'air à travers les persiennes basse et haute',
      en: 'Natural ventilation through bottom and top louvers maintaining internal ambient < 40°C'
    },

    systemContextDescription: {
      fr: 'Interface locale entre le réseau de distribution moyenne tension 30 kV et l\'armoire TGBT du bâtiment tertiaire ou industriel.',
      en: 'Local interface between 30 kV MV distribution and building main switchboard (TGBT).'
    },
    upstreamEquipmentIds: ['eq-exp-cell-mv-30k'],
    downstreamEquipmentIds: ['eq-exp-tgbt-main-400v'],
    relationships: [
      {
        id: 'rel-kiosk-tgbt',
        targetEquipmentId: 'eq-exp-tgbt-main-400v',
        targetName: { fr: 'Tableau Général Basse Tension TGBT 400 V', en: 'Main Low-Voltage Switchboard (TGBT)' },
        targetCategory: 'LV_DISTRIBUTION',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Alimente l\'arrivée du disjoncteur général BT du bâtiment', en: 'Energizes incoming circuit breaker of main building switchboard' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['50/51', 'DGPT2 (Détection Gaz, Pression, Température 2 seuils)', 'Fusibles HPC'],
      protectiveRelayIds: [],
      summary: {
        fr: 'Protection du transformateur assurée par relais multifonction DGPT2 (gaz/pression/thermique) et fusibles MT HTA 30 kV calibrés à 25 A.',
        en: 'Transformer protected by DGPT2 multi-sensor (gas, pressure, 2 thermal thresholds) and 30 kV 25 A HRC fuses.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Relais DGPT2 intégré sur couvercle de cuve', 'Tore homopolaire de détection défaut terre'],
      instrumentTransformerIds: [],
      measuredQuantities: ['Pression interne de cuve transfo (bar)', 'Température d\'huile supérieure (°C)', 'Tension et courant BT']
    },
    controlAndAutomation: {
      localControls: { fr: 'Levier de manœuvre pour interrupteurs RMU et poignées de déconnexion fusibles BT', en: 'Operating handle for RMU switches and fuse puller for LV disconnects' },
      remoteControls: { fr: 'Possibilité de motorisation de l\'unité RMU avec coffret téléconduite 24 V DC (FDIR)', en: 'Optional RMU motorization with 24 V DC telemetry box for feeder self-healing' },
      interlocks: { fr: 'Accès au compartiment fusibles ou câbles impossible sans mise à la terre préalable', en: 'Cable and fuse access mechanically blocked until earth switch is closed' }
    },
    communicationProtocols: ['IEC 60870-5-104 (optionnel via coffret téléconduite)'],

    earthingAndBonding: {
      earthingRegime: 'TT',
      connectionMethod: {
        fr: 'Régime TT : Neutre basse tension relié à sa propre prise de terre (R < 5 Ω); masses métalliques reliées à une terre séparée',
        en: 'TT earthing: LV neutral solidly grounded to dedicated earth rod (R < 5 Ω); metal frames bonded to separate safety earth'
      },
      dischargeCapability: {
        fr: 'Parafoudres basse tension à varistance ZnO protégeant l\'armoire contre les surtensions transmises',
        en: 'LV ZnO surge arresters protecting against incoming atmospheric surges'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'SF6 dans le RMU + Huile minérale dans le transfo + Air dans le tableau BT',
      bilRatingKv: 170,
      phaseClearanceMeters: 'Poste totalement fermé, accessible uniquement au personnel habilité'
    },
    connectionRequirements: {
      electrical: { fr: 'Arrivée MT par câbles souterrains 30 kV alu 3x150 mm²; départ BT par 4 câbles unipolaires 1x240 mm² Cuivre par phase', en: '30 kV incomer via 3x150 mm² Al underground cable; LV incomer via 4x 1x240 mm² Cu per phase' },
      mechanical: { fr: 'Caisson étanche IP54 / IK10 résistant aux chocs et intempéries tropicales', en: 'IP54 / IK10 enclosure withstanding tropical rain and UV exposure' },
      cableOrBusbar: { fr: 'Jeu de barres BT en cuivre 1000 A', en: '1000 A copper LV busbars' },
      earthing: { fr: 'Ceinture équipotentielle en cuivre nu 50 mm² enterrée autour du poste', en: '50 mm² bare copper ring conductor buried around kiosk foundation' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '10°C à 45°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'Environnement urbain extérieur',
      indoorOutdoor: 'PAD_MOUNTED'
    },

    keyEngineeringValues: [
      { key: 'Sn', label: { fr: 'Puissance assignée', en: 'Rated power' }, value: 630, unit: 'kVA', status: 'VERIFIED' },
      { key: 'U1', label: { fr: 'Tension primaire assignée', en: 'Rated primary voltage' }, value: 30, unit: 'kV', status: 'VERIFIED' },
      { key: 'U2', label: { fr: 'Tension secondaire à vide', en: 'Rated secondary voltage' }, value: 410, unit: 'V', status: 'VERIFIED' },
      { key: 'In_bt', label: { fr: 'Courant nominal secondaire', en: 'Rated secondary current' }, value: 887, unit: 'A', status: 'VERIFIED' },
      { key: 'Uk', label: { fr: 'Tension de court-circuit', en: 'Short-circuit voltage' }, value: 4.0, unit: '%', status: 'VERIFIED' },
      { key: 'p0', label: { fr: 'Pertes à vide', en: 'No-load losses' }, value: 650, unit: 'W', status: 'VERIFIED' },
      { key: 'pk', label: { fr: 'Pertes en charge', en: 'Load losses' }, value: 5600, unit: 'W', status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'UNDER_MAINTENANCE', 'FAULTED'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-KIOSK-01',
        name: { fr: 'Déclenchement thermique ou surpression transformateur (DGPT2)', en: 'Transformer thermal or overpressure trip (DGPT2)' },
        rootCause: { fr: 'Surcharge prolongée (> 120% Sn) par canicule ou défaut interne spires', en: 'Prolonged summer overload (> 120% Sn) or internal winding interturn short' },
        consequenceOnSystem: { fr: 'Ouverture automatique de l\'interrupteur combiné RMU, coupure complète du quartier', en: 'Automatic trip of RMU fuse-switch, blacking out local neighborhood' },
        protectiveResponse: { fr: 'Déclenchement instantané par percuteur ou bobine à émission de tension', en: 'Instantaneous trip via striker pin or shunt trip coil' },
        severity: 'MAJOR'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'Perte de l\'alimentation BT pour ~200 foyers ou pour l\'ensemble du bâtiment tertiaire raccordé.',
      en: 'Loss of low-voltage supply for ~200 households or entire commercial facility.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Moyenne Tension 30 kV', 'Basse Tension 400 V', 'Arc électrique', 'Huile chaude sous pression'],
      isolationProcedureLoto: {
        fr: 'Ouverture interrupteur MT, fermeture sectionneur de terre MT, ouverture disjoncteur général BT, cadenassage des portes.',
        en: 'Open MV switch, close MV earth switch, open main LV breaker, padlock all enclosure doors.'
      },
      ppeRequirements: ['Casque avec visière anti-arc', 'Gants isolants BT et perche isolante MT 36 kV', 'Chaussures de sécurité']
    },

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Annuelle', description: { fr: 'Nettoyage des grilles de ventilation, contrôle des niveaux d\'huile et thermographie des connexions BT', en: 'Cleaning ventilation louvers, checking oil level gauge, and infrared thermography on LV terminals' }, toolsAndStandards: ['Caméra IR', 'Chiffons diélectriques'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essai de type en court-circuit', 'Contrôle de rigidité diélectrique en usine'],
      siteAcceptanceTestsSat: ['Mesure de la prise de terre du neutre (< 5 Ω) et des masses (< 10 Ω)', 'Vérification du seuil du relais DGPT2'],
      commissioningProcedures: ['Mise sous tension progressive et contrôle de l\'ordre de phases (L1, L2, L3)']
    },

    applicableStandards: [
      { standardCode: 'IEC 62271-202', title: 'High-voltage/low-voltage prefabricated substation', relevantClauses: ['Clause 6 (Type tests)'], jurisdiction: 'International' },
      { standardCode: 'IEC 60076-1', title: 'Power transformers - General', relevantClauses: ['Clause 5'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-engineer', title: { fr: 'Ingénieur Travaux Distribution BT/MT', en: 'MV/LV Distribution Field Engineer' }, tasks: { fr: 'Raccordement des câbles, vérification des prises de terre et mise en service réseau', en: 'Cable termination supervision, earthing grid validation, and commissioning' } }
    ],
    lifecyclePhases: [
      { phase: 'COMMISSIONING', deliverables: ['Procès-verbal de réception de poste', 'Attestation de conformité des terres'], involvedRoles: ['Ingénieur Réception'] }
    ],

    deliverablesAndDocuments: ['Plan de génie civil radier', 'Schéma unifilaire HTA/BT', 'Notice de montage kiosque'],
    provenance: {
      id: 'prov-exp-kiosk-01',
      entity_id: 'eq-exp-kiosk-30kv-400v',
      entity_type: 'equipment',
      source_ref: 'Spécification technique Postes Kiosques Eneo & IEC 62271-202',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Secondary Distribution Board',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Puissance 630 kVA adaptée aux charges tertiaires avec facteur de puissance moyen 0.85.',
      en: '630 kVA capacity tailored for tertiary loads operating at 0.85 average power factor.'
    },

    representations: {
      physical: {
        svgVariant: 'PANEL',
        dimensionsLabel: '3.2 m × 1.8 m × 2.2 m',
        enclosureLabel: 'Enveloppe béton armé monobloc',
        maintenanceClearance: 'Zone libre 1.0 m autour des portes'
      },
      electrical: {
        symbolType: 'SUBSTATION_KIOSK',
        incomerTerminal: 'Arrivée MT 30 kV',
        outgoingTerminal: 'Jeu de barres BT 400 V / 230 V',
        protectionZone: 'Zone protégée DGPT2 / Fusibles HPC',
        measurementTap: 'Centrale de mesure multifonction BT'
      },
      functional: {
        inputSignal: '30 kV triphasé',
        conversionProcess: 'Abaissement de tension statique 30 kV → 400 V/230 V',
        outputSignal: '400 V triphasé 4 fils',
        feedbackLoop: 'Contacts d\'alarme température/gaz DGPT2 vers déclencheur'
      }
    }
  }
];
