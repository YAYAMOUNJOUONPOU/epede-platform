// src/data/equipment/canonicalEquipmentSlice.ts
// EPEDE - Physical Energy Backbone Slice (Generation -> Loads)

import type { CanonicalEquipmentObject } from '../../types/equipmentExplorer';

export const BACKBONE_EQUIPMENT_ITEMS: CanonicalEquipmentObject[] = [
  // 1. GENERATION - Hydro Generator
  {
    id: 'eq-exp-hydro-gen-01',
    tagIec: '--G01',
    name: {
      fr: 'Groupe Turbo-Alternateur Hydroélectrique (Songloulou 48 MVA)',
      en: 'Hydroelectric Turbo-Generator Unit (Songloulou 48 MVA)'
    },
    aliases: {
      fr: ['Alternateur synchrone Songloulou', 'Groupe 1 Francis', 'Générateur hydroélectrique'],
      en: ['Salient-pole Hydro Generator', 'Francis Turbo-Alternator G1', '48 MVA Generator']
    },
    equipmentType: 'HydroGeneratorUnit',
    category: 'GENERATION',
    parentDomain: 'D01',
    systemStage: 'GENERATION',
    subsystemContext: {
      fr: 'Centrale hydroélectrique au fil de l\'eau / réservoir de régulation',
      en: 'Run-of-river / pondage hydroelectric powerhouse'
    },
    technologyContext: {
      fr: 'Machine synchrone triphasée à pôles saillants couplée à une turbine Francis verticale',
      en: 'Salient-pole three-phase synchronous machine directly coupled to vertical Francis turbine'
    },
    applicationContext: {
      fr: 'Production de base et réglage primaire/secondaire fréquence-puissance sur le RIS Cameroun',
      en: 'Baseload generation and primary/secondary frequency-power response on the Cameroon RIS grid'
    },
    voltageContext: {
      nominalVoltage: '10.5 kV',
      level: 'MV',
      frequencyHz: 50,
      phases: '3-phase AC'
    },
    typicalLocation: {
      fr: 'Centrale hydroélectrique de Songloulou (Fleuve Sanaga, Cameroun)',
      en: 'Songloulou Hydroelectric Power Station (Sanaga River, Cameroon)'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Machine électrique tournante convertissant l\'énergie mécanique transmise par l\'arbre de la turbine hydraulique en énergie électrique alternative triphasée sous 10.5 kV.',
      en: 'Rotating electrical machine converting mechanical shaft torque delivered by hydraulic turbine into balanced three-phase 10.5 kV alternating electrical power.'
    },
    purpose: {
      fr: 'Injecter une puissance active de 40.8 MW et fournir un soutien réactif dynamique pour réguler la tension de transport.',
      en: 'Inject 40.8 MW of active power while supplying dynamic reactive power to regulate transmission voltage.'
    },
    engineeringProblemSolved: {
      fr: 'Assure la conversion électromécanique avec un rendement supérieur à 97% et une inertie H=3.85s indispensable à la stabilité fréquentielle.',
      en: 'Ensures electromechanical conversion at >97% efficiency with rotating inertia H=3.85s essential to grid frequency stability.'
    },

    primaryFunction: {
      fr: 'Génération continue d\'énergie électrique synchrone régulée en tension et en fréquence.',
      en: 'Continuous synchronous electrical energy generation with regulated voltage and frequency.'
    },
    secondaryFunctions: {
      fr: ['Soutien en puissance réactive (mode compensateur)', 'Démarrage autonome (black-start local)', 'Participation au plan de reconstitution du réseau'],
      en: ['Reactive power support (condenser mode)', 'Local black-start capability', 'Grid restoration plan participation']
    },
    operatingPrincipleSummary: {
      fr: 'L\'eau sous pression entraîne la roue Francis. Le rotor aimanté par courant continu d\'excitation (AVR) induit une force électromotrice triphasée dans les enroulements statoriques selon la loi de Faraday.',
      en: 'Pressurized water drives the Francis runner. DC excitation current from the AVR magnetizes salient rotor poles, inducing a balanced 3-phase EMF in stator windings via Faraday\'s law.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Admission Hydraulique', en: 'Hydraulic Admission' },
        description: {
          fr: 'Le distributeur dirige 145 m³/s d\'eau sous 37.5 m de chute nette vers les aubes de la roue.',
          en: 'Wicket gates direct 145 m³/s of water under 37.5 m net head onto Francis runner vanes.'
        },
        physicalPhenomenon: { fr: 'Transfert de quantité de mouvement hydraulique', en: 'Hydraulic momentum transfer' },
        keyVariable: 'Head H = 37.5 m, Flow Q = 145 m³/s'
      },
      {
        stepNumber: 2,
        title: { fr: 'Entraînement Mécanique', en: 'Mechanical Drive' },
        description: {
          fr: 'La roue tourne à 125 tr/min et transmet le couple mécanique par l\'arbre vertical en acier forgé.',
          en: 'Runner spins at 125 rpm transmitting mechanical torque through forged vertical steel shaft.'
        },
        physicalPhenomenon: { fr: 'Couple mécanique sur l\'arbre', en: 'Mechanical shaft torque' },
        keyVariable: 'Torque T = P / ω = 3.12 MN·m'
      },
      {
        stepNumber: 3,
        title: { fr: 'Excitation Rotorique', en: 'Rotor Excitation' },
        description: {
          fr: 'Le système d\'excitation statique injecte le courant continu dans les 48 pôles rotoriques.',
          en: 'Static excitation system injects controlled DC current into 48 salient rotor poles.'
        },
        physicalPhenomenon: { fr: 'Création du champ magnétique tournant B', en: 'Rotating magnetic field generation' },
        keyVariable: 'Excitation current Iexc = 850 A DC'
      },
      {
        stepNumber: 4,
        title: { fr: 'Induction Électromagnétique Statorique', en: 'Stator Electromagnetic Induction' },
        description: {
          fr: 'La rotation des pôles induit 10.5 kV entre phases à 50 Hz dans l\'enroulement statorique barres Roebel.',
          en: 'Pole rotation induces 10.5 kV line-to-line 50 Hz sinusoidal EMF across stator Roebel bars.'
        },
        physicalPhenomenon: { fr: 'Loi d\'induction de Faraday e = -dΦ/dt', en: 'Faraday induction e = -dΦ/dt' },
        keyVariable: 'Terminal Voltage V = 10.5 kV'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Fosse béton d\'alternateur ouverte avec circuit de ventilation fermé eau/air (TEWAC)',
      dimensionsApproxMeters: 'Diamètre stator 7.8 m, Hauteur 4.2 m',
      weightApproxKg: 185000,
      mounting: { fr: 'Montage vertical sur dalle béton armé avec pivot supérieur et palier guide', en: 'Vertical shaft assembly on reinforced concrete civil structure with thrust and guide bearings' },
      environmentalClearances: { fr: 'Salle des machines climatisée avec pont roulant 150 tonnes pour levage', en: 'Air-conditioned powerhouse with 150-ton overhead crane clearance for maintenance lift' }
    },
    mainComponents: [
      { id: 'c-stat', name: { fr: 'Stator feuilleté avec bobinage Roebel', en: 'Laminated stator core with Roebel bars' }, function: { fr: 'Supporte le champ tournant et recueille l\'énergie sous 10.5 kV', en: 'Carries alternating flux and generates 10.5 kV power' }, materialOrTechnology: 'Tôles fer-silicium isolées / Cuivre classe F', criticality: 'CRITICAL' },
      { id: 'c-rot', name: { fr: 'Rotor à pôles saillants', en: 'Salient-pole rotor' }, function: { fr: 'Crée le champ d\'excitation magnétique', en: 'Produces magnetic excitation field' }, materialOrTechnology: 'Pôles massifs avec amortisseurs d\'oscillations', criticality: 'CRITICAL' },
      { id: 'c-bear', name: { fr: 'Pivot de butée à patins oscillants', en: 'Tilting-pad thrust bearing' }, function: { fr: 'Reprend le poids des pièces tournantes et la poussée hydraulique (500 tonnes)', en: 'Supports rotating assembly weight and hydraulic thrust (500 tons)' }, materialOrTechnology: 'Babbitt hydrodynamique immergé dans l\'huile', criticality: 'CRITICAL' },
      { id: 'c-cool', name: { fr: 'Aéro-réfrigérants eau brute/air', en: 'Air-to-water heat exchangers' }, function: { fr: 'Évacue 950 kW de pertes thermiques joule et fer', en: 'Dissipates 950 kW of thermal losses' }, materialOrTechnology: 'Faisceaux de tubes cuivre-nickel', criticality: 'HIGH' }
    ],

    energyOrSignalFlow: {
      fr: 'Énergie hydraulique brute → Arbre turbine (mécanique) → Alternateur synchrone → Jeux de barres 10.5 kV débrochables',
      en: 'Raw hydraulic energy → Turbine shaft (mechanical) → Synchronous alternator → 10.5 kV isolated phase busduct (IPB)'
    },
    electricalRole: {
      fr: 'Source active de puissance du réseau électrique triphasé 50 Hz',
      en: 'Active voltage and power source for the three-phase 50 Hz grid'
    },
    mechanicalRole: {
      fr: 'Transmet le couple de 3.12 MN·m généré par la détente de l\'eau sur les aubes',
      en: 'Transmits 3.12 MN·m torque developed by hydraulic water expansion'
    },
    thermalRole: {
      fr: 'Évacue les pertes cuivre stator/rotor et pertes fer magnétiques par 4 réfrigérants',
      en: 'Dissipates stator/rotor copper and core iron losses through 4 coolers'
    },

    systemContextDescription: {
      fr: 'Tête de chaîne de production hydroélectrique reliée au transformateur élévateur GSU T1 par gaines à barres fermées.',
      en: 'Head of generation chain connected to generator step-up transformer GSU T1 via isolated phase busduct.'
    },
    upstreamEquipmentIds: [],
    downstreamEquipmentIds: ['eq-exp-gen-cb-01', 'eq-exp-gsu-trafo-01'],
    relationships: [
      {
        id: 'rel-g1-cb',
        targetEquipmentId: 'eq-exp-gen-cb-01',
        targetName: { fr: 'Disjoncteur de Groupe 10.5 kV', en: '10.5 kV Generator Circuit Breaker' },
        targetCategory: 'SWITCHGEAR',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Transmet le courant de 2639 A au disjoncteur de synchronisation', en: 'Supplies 2639 A to the synchronizing generator breaker' }
      },
      {
        id: 'rel-g1-trafo',
        targetEquipmentId: 'eq-exp-gsu-trafo-01',
        targetName: { fr: 'Transformateur Élévateur GSU T1 (10.5/225 kV)', en: 'Generator Step-Up Transformer GSU T1' },
        targetCategory: 'TRANSFORMER',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Alimente les enroulements basse tension 10.5 kV du transformateur principal', en: 'Energizes 10.5 kV low-voltage windings of the main GSU step-up transformer' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['87G', '40', '64G', '51V', '46', '24'],
      protectiveRelayIds: ['eq-exp-relay-87g'],
      summary: {
        fr: 'Protégé par relais numérique multifonction : différentielle alternateur (87G), perte d\'excitation (40), défaut masse stator 100% (64G) et surfluxage V/Hz (24).',
        en: 'Protected by digital multifunction IED: generator differential (87G), loss of field (40), 100% stator earth fault (64G) and volts/Hz overexcitation (24).'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Sondes thermométriques Pt100 stator (12x)', 'Capteurs de vibrations sans contact x-y', 'Détecteur de flux d\'entrefer'],
      instrumentTransformerIds: ['eq-exp-gen-ct-01', 'eq-exp-gen-vt-01'],
      measuredQuantities: ['Tension statorique (kV)', 'Courant de phase (A)', 'Puissance active (MW)', 'Puissance réactive (Mvar)', 'Vitesse (tr/min)', 'Températures (°C)']
    },
    controlAndAutomation: {
      localControls: { fr: 'Pupitre tranche alternateur avec commande excitation et régulateur de vitesse (Woodward/Andritz)', en: 'Local unit control board with excitation cubicle and turbine speed governor' },
      remoteControls: { fr: 'Téléconduite depuis le SCADA central de Songloulou et le Dispatching National SONATREL', en: 'Remote dispatch control from Songloulou control room and SONATREL National Dispatching' },
      interlocks: { fr: 'Verrouillage synchroniseur automatique (25), niveau d\'huile palier bas et débit d\'eau de refroidissement nul', en: 'Interlocked via auto-synchronizer (25), bearing low oil level trip and cooling water flow loss' }
    },
    communicationProtocols: ['IEC 61850 MMS/GOOSE', 'IEC 60870-5-104', 'Modbus TCP'],

    earthingAndBonding: {
      earthingRegime: 'NGR',
      connectionMethod: {
        fr: 'Neutre relié à la terre à travers un transformateur monophasé de distribution avec résistance de charge au secondaire',
        en: 'Neutral grounded through a single-phase distribution transformer loaded with secondary resistor'
      },
      dischargeCapability: {
        fr: 'Limite le courant de défaut à la terre statorique à moins de 10 A pour éviter toute dégradation des tôles magnétiques',
        en: 'Restricts single phase stator earth fault current below 10 A to prevent core iron burning'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Résine époxy sous vide / Mica (Classe thermique F, échauffement B)',
      bilRatingKv: 75,
      phaseClearanceMeters: 'Gaines à barres isolées IPB à isolement d\'air pressurisé'
    },
    connectionRequirements: {
      electrical: { fr: 'Raccordement par gaine à barres sous enveloppe métallique continue soudée', en: 'Isolated Phase Busduct (IPB) connection with welded aluminum enclosure' },
      mechanical: { fr: 'Accouplement rigide par tourteau d\'arbre boulonné et goupillé', en: 'Rigid forged shaft flange coupling with reamed fitted bolts' },
      cableOrBusbar: { fr: 'Gaine IPB 3000 A aluminium', en: '3000 A aluminum IPB' },
      earthing: { fr: 'Double tresse cuivre étamé 2x120 mm² vers la grille équipotentielle centrale', en: 'Dual tinned copper 2x120 mm² braid to plant earthing grid' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '15°C à 45°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'Environnement humide tropical / poussières filtrées',
      indoorOutdoor: 'INDOOR'
    },

    keyEngineeringValues: [
      { key: 'Sn', label: { fr: 'Puissance apparente assignée', en: 'Rated apparent power' }, value: 48, unit: 'MVA', status: 'VERIFIED' },
      { key: 'Pn', label: { fr: 'Puissance active nominale', en: 'Rated active power' }, value: 40.8, unit: 'MW', status: 'VERIFIED' },
      { key: 'Un', label: { fr: 'Tension nominale entre phases', en: 'Rated line voltage' }, value: 10.5, unit: 'kV', status: 'VERIFIED' },
      { key: 'In', label: { fr: 'Courant nominal statorique', en: 'Rated stator current' }, value: 2639, unit: 'A', status: 'VERIFIED' },
      { key: 'cos_phi', label: { fr: 'Facteur de puissance assigné', en: 'Rated power factor' }, value: 0.85, status: 'VERIFIED' },
      { key: 'n_syn', label: { fr: 'Vitesse de synchronisme', en: 'Synchronous speed' }, value: 125, unit: 'rpm', status: 'VERIFIED' },
      { key: 'H', label: { fr: 'Constante d\'inertie mécanique', en: 'Inertia constant' }, value: 3.85, unit: 's', status: 'VERIFIED' },
      { key: 'xd_second', label: { fr: 'Réactance subtransitoire directe', en: 'Direct-axis subtransient reactance' }, value: 22.0, unit: '%', status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'CLOSED', 'OPEN', 'TRIPPED', 'UNDER_MAINTENANCE', 'AVAILABLE'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-GEN-01',
        name: { fr: 'Claquant d\'isolation barre Roebel stator (Court-circuit inter-phases)', en: 'Stator Roebel bar insulation breakdown (Phase-to-phase fault)' },
        rootCause: { fr: 'Vieillissement thermique ou décharges partielles dans l\'isolant mica', en: 'Thermal aging or partial discharge erosion in mica insulation' },
        consequenceOnSystem: { fr: 'Déclenchement d\'urgence, arc électrique interne, indisponibilité prolongée (6 mois)', en: 'Emergency generator trip, internal arc flash, prolonged outage (6 months)' },
        protectiveResponse: { fr: 'Déclenchement instantané 87G (< 25 ms) + déclenchement turbine + désexcitation rapide', en: 'Instantaneous 87G trip (< 25 ms) + emergency turbine shutdown + field de-excitation' },
        severity: 'CATASTROPHIC'
      },
      {
        code: 'FM-GEN-02',
        name: { fr: 'Surchauffe palier de butée par perte de film d\'huile', en: 'Thrust bearing wipe due to hydrodynamic oil film collapse' },
        rootCause: { fr: 'Contamination de l\'huile ou perte de circulation du circuit de refroidissement', en: 'Oil contamination or cooling pump loss' },
        consequenceOnSystem: { fr: 'Fusion du régule Babbitt, vibration sévère, détérioration mécanique de l\'arbre', en: 'Babbitt white metal wiping, excessive shaft runout, mechanical rotor damage' },
        protectiveResponse: { fr: 'Déclenchement automatique par sondes Pt100 palier (> 85°C)', en: 'Automatic unit trip via Pt100 bearing temperature sensors (> 85°C)' },
        severity: 'CRITICAL'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'Perte instantanée de 48 MVA sur le réseau RIS, provoquant une baisse de fréquence de ~0.4 Hz et un risque de délestage d\'urgence.',
      en: 'Instantaneous loss of 48 MVA on Cameroon RIS grid, causing ~0.4 Hz frequency dip and risk of under-frequency load shedding.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Haute tension 10.5 kV', 'Couple mécanique rotatif', 'Incendie huile palier', 'Dégagement d\'ozone/arc électrique'],
      isolationProcedureLoto: {
        fr: 'Consignation hydroélectrique (fermeture vannes de tête + batardeaux d\'aspirateur), ouverture disjoncteur groupe, mise à la terre des bornes 10.5 kV.',
        en: 'Hydraulic lock-out (head gates & draft tube stoplogs down), generator breaker open/racked out, 10.5 kV terminals solidly earthed.'
      },
      ppeRequirements: ['Casque avec jugulaire', 'Bouchons d\'oreilles anti-bruit', 'Chaussures de sécurité diélectriques', 'Gants isolants 12 kV']
    },

    maintenancePlan: [
      { type: 'CONDITION_BASED', periodicity: 'Continue (En ligne)', description: { fr: 'Mesure en ligne des décharges partielles et analyse des vibrations rotoriques', en: 'Online partial discharge monitoring and rotor vibration spectra analysis' }, toolsAndStandards: ['Capteurs capacitifs 80 pF', 'ISO 20816-5'] },
      { type: 'PREVENTIVE', periodicity: 'Annuelle', description: { fr: 'Inspection visuelle de l\'entrefer, resserrage calage têtes de bobines, analyse diélectrique de l\'huile des paliers', en: 'Airgap inspection, end-winding wedging torque checks, bearing oil physicochemical analysis' }, toolsAndStandards: ['Jauges d\'entrefer', 'Rigidimètre huile IEC 60156'] },
      { type: 'TESTING_COMMISSIONING', periodicity: 'Tous les 5 ans', description: { fr: 'Essais de résistance d\'isolement (Megger 5 kV), indice de polarisation (PI) et tangente delta', en: 'Insulation resistance (5 kV Megger), polarization index (PI), and tan delta dielectric loss tests' }, toolsAndStandards: ['Megger S1-568', 'IEEE 43'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essai de tension appliquée à fréquence industrielle 22 kV / 1 min', 'Mesure des pertes à vide et en court-circuit', 'Essai de survitesse à 1.8 x Nn'],
      siteAcceptanceTestsSat: ['Contrôle de l\'alignement de ligne d\'arbre et du faux-rond', 'Mesure des résistances d\'enroulement à froid', 'Essais de couplage au réseau avec synchroniseur automatique'],
      commissioningProcedures: ['Vérification de la concordance de phases 10.5 kV', 'Essai de rejet de charge à 25%, 50%, 75% et 100% Pn']
    },

    applicableStandards: [
      { standardCode: 'IEC 60034-1', title: 'Rotating electrical machines - Rating and performance', relevantClauses: ['Clause 7 (Temperature rise)', 'Clause 8 (Dielectric tests)', 'Clause 9 (Overcurrent)'], jurisdiction: 'International' },
      { standardCode: 'IEEE C50.12', title: 'Salient-Pole 50 Hz and 60 Hz Synchronous Generators', relevantClauses: ['Section 4 (Mechanical construction)', 'Section 7 (Testing)'], jurisdiction: 'International / Reference' },
      { standardCode: 'IEC 60034-3', title: 'Specific requirements for synchronous generators', relevantClauses: ['Clause 4 (Operation under unbalanced loads)'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-engineer', title: { fr: 'Ingénieur Machines & Production', en: 'Generation & Machines Engineer' }, tasks: { fr: 'Supervision de l\'alignement d\'arbre, validation des bilans thermiques et des essais de réception', en: 'Shaft alignment oversight, thermal balance audits, and SAT testing sign-off' } },
      { roleSlug: 'protection-engineer', title: { fr: 'Ingénieur Protections', en: 'Protection Systems Engineer' }, tasks: { fr: 'Paramétrage et calcul des plans de protection 87G, 40, 64G et coordination avec le régulateur AVR', en: 'Protection settings coordination for 87G, 40, 64G and interface with AVR excitation' } }
    ],
    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Spécification technique alternateur', 'Calculs de court-circuit statorique', 'Diagramme de capabilité P-Q'], involvedRoles: ['Ingénieur Conception', 'Hydro-mécanicien'] },
      { phase: 'COMMISSIONING', deliverables: ['Procès-verbal d\'essais de synchronisation', 'Courbes de rejet de charge 100%'], involvedRoles: ['Ingénieur Mise en Service', 'Opérateur Central'] },
      { phase: 'OPERATION_MONITORING', deliverables: ['Rapports de télésurveillance vibratoire', 'Suivi thermique des bobinages'], involvedRoles: ['Chef de Quart', 'Ingénieur Fiabilité'] }
    ],

    deliverablesAndDocuments: ['Plan d\'ensemble fosse alternateur', 'Schéma unifilaire d\'évacuation 10.5 kV', 'Manuel d\'exploitation et d\'entretien', 'Certificat d\'essais FAT/SAT'],
    provenance: {
      id: 'prov-exp-hydro-01',
      entity_id: 'eq-exp-hydro-gen-01',
      entity_type: 'equipment',
      source_ref: 'Spécifications Techniques Eneo/SONATREL Songloulou & IEC 60034',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Power Engineering Review Board',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Calculs d\'inertie et réactances basés sur les groupes Francis rénovés. La puissance maximale continue est limitée par la température de l\'eau de la Sanaga (< 30°C).',
      en: 'Inertia and reactance parameters based on refurbished Francis units. Continuous peak capability is constrained by river ambient water temperature (< 30°C).'
    },

    representations: {
      physical: {
        svgVariant: 'GENERATOR',
        dimensionsLabel: 'Ø 7.8 m × H 4.2 m',
        enclosureLabel: 'Béton armé TEWAC',
        maintenanceClearance: '15.0 m hauteur sous crochet'
      },
      electrical: {
        symbolType: 'SYNCHRONOUS_GENERATOR',
        incomerTerminal: 'Arbre turbine Francis',
        outgoingTerminal: 'Bornes statoriques 10.5 kV (U, V, W)',
        protectionZone: 'Zone protégée 87G',
        measurementTap: 'Tores TC neutre + TC têtes de bobines'
      },
      functional: {
        inputSignal: 'Couple mécanique T = 3.12 MN·m @ 125 rpm + Courant d\'excitation Iexc',
        conversionProcess: 'Induction électromagnétique triphasée rotorique/statorique',
        outputSignal: 'Puissance active 40.8 MW @ 10.5 kV, 50 Hz, cos φ 0.85',
        feedbackLoop: 'Boucle de régulation tension AVR + Régulateur tachymétrique de vitesse'
      }
    }
  },

  // 2. GENERATION STEP-UP TRANSFORMER (10.5 / 225 kV)
  {
    id: 'eq-exp-gsu-trafo-01',
    tagIec: '--T01.GSU',
    name: {
      fr: 'Transformateur Élévateur Principal GSU T1 (10.5 / 225 kV - 50 MVA)',
      en: 'Main Generator Step-Up Transformer GSU T1 (10.5 / 225 kV - 50 MVA)'
    },
    aliases: {
      fr: ['Transfo de bloc élévateur', 'GSU 50 MVA', 'Transformateur 10.5/225 kV'],
      en: ['Generator Step-Up Transformer', 'Block Transformer 50 MVA', 'GSU 10.5/225 kV']
    },
    equipmentType: 'PowerTransformer',
    category: 'TRANSFORMER',
    parentDomain: 'D04',
    systemStage: 'SUBSTATIONS_NODES',
    subsystemContext: {
      fr: 'Poste élévateur extérieur attenant à la centrale hydroélectrique',
      en: 'Outdoor step-up switchyard adjacent to hydroelectric powerhouse'
    },
    technologyContext: {
      fr: 'Transformateur triphasé immergé dans l\'huile minérale, enroulements cuivre, couplage Dyn11, refroidissement ONAF',
      en: 'Three-phase mineral oil-immersed power transformer, copper windings, Dyn11 vector group, ONAF forced air cooling'
    },
    applicationContext: {
      fr: 'Élévation de la tension de production 10.5 kV vers la tension de transport national 225 kV',
      en: 'Stepping up generation voltage from 10.5 kV to bulk transmission level 225 kV'
    },
    voltageContext: {
      nominalVoltage: '10.5 kV / 225 kV',
      level: 'HV',
      frequencyHz: 50,
      phases: '3-phase AC'
    },
    typicalLocation: {
      fr: 'Plateforme transformateur extérieure Songloulou (travée départ 225 kV)',
      en: 'Outdoor transformer bay Songloulou (225 kV feeder bay)'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Appareil électromagnétique statique à deux enroulements distincts couplés par un circuit magnétique commun en acier au silicium, élevant la tension de 10.5 kV à 225 kV pour le transport.',
      en: 'Static electromagnetic apparatus with two inductively coupled windings on a grain-oriented silicon steel core, stepping up voltage from 10.5 kV to 225 kV for bulk power transport.'
    },
    purpose: {
      fr: 'Réduire le courant de ligne d\'un facteur 21.4 afin de minimiser les pertes Joule (I²R) sur le corridor de transport 225 kV.',
      en: 'Reduce line current by a factor of 21.4 to minimize resistive I²R transmission losses along the 225 kV corridor.'
    },
    engineeringProblemSolved: {
      fr: 'Permet d\'évacuer 48 MVA sur 120 km avec un courant de seulement 128 A par phase au lieu de 2639 A en basse tension.',
      en: 'Allows transmitting 48 MVA over 120 km drawing only 128 A per phase instead of 2639 A at generation voltage.'
    },

    primaryFunction: {
      fr: 'Transformation de tension et adaptation d\'impédance entre générateur et réseau 225 kV.',
      en: 'Voltage stepping and impedance matching between generator and 225 kV grid.'
    },
    secondaryFunctions: {
      fr: ['Isolement galvanique entre réseau BT de centrale et grille HT', 'Piégeage des composantes homopolaires et harmoniques 3 grâce au couplage triangle BT (d11)'],
      en: ['Galvanic isolation between generation bus and high-voltage grid', 'Trapping zero-sequence currents and 3rd harmonics in delta low-voltage winding (d11)']
    },
    operatingPrincipleSummary: {
      fr: 'Le courant alternatif 10.5 kV circule dans le primaire en triangle et crée un flux magnétique alternatif Φ(t) dans le noyau. Ce flux traverse le secondaire en étoile et induit 225 kV.',
      en: 'AC current at 10.5 kV enters delta primary winding, inducing alternating magnetic core flux Φ(t). This flux links the wye secondary winding, producing 225 kV via Faraday\'s law.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Alimentation Primaire BT', en: 'LV Primary Excitation' },
        description: {
          fr: 'L\'enroulement 10.5 kV en triangle absorbe le courant de 2639 A fourni par l\'alternateur.',
          en: '10.5 kV delta primary winding draws 2639 A from the generator busduct.'
        },
        physicalPhenomenon: { fr: 'Magnétisation du circuit magnétique', en: 'Core magnetization' },
        keyVariable: 'V1 = 10.5 kV, I1 = 2639 A'
      },
      {
        stepNumber: 2,
        title: { fr: 'Flux Magnétique Alternatif', en: 'Alternating Core Flux' },
        description: {
          fr: 'Le flux de 1.7 Tesla oscille à 50 Hz dans les tôles magnétiques à grains orientés à faibles pertes.',
          en: 'Magnetic core flux oscillating at 50 Hz reaches peak density B = 1.7 Tesla in low-loss steel laminations.'
        },
        physicalPhenomenon: { fr: 'Circulation du flux magnétique Φ = B · S', en: 'Magnetic flux circulation Φ = B · S' },
        keyVariable: 'B = 1.7 T, Frequency f = 50 Hz'
      },
      {
        stepNumber: 3,
        title: { fr: 'Induction Secondaire HT', en: 'HV Secondary Induction' },
        description: {
          fr: 'Le rapport de spires N2/N1 = 21.43 génère une tension de 225 kV entre phases sur le secondaire étoile.',
          en: 'Turn ratio N2/N1 = 21.43 generates 225 kV line-to-line on the star-connected high-voltage winding.'
        },
        physicalPhenomenon: { fr: 'Induction mutuelle V2 / V1 ≈ N2 / N1', en: 'Mutual induction V2 / V1 ≈ N2 / N1' },
        keyVariable: 'V2 = 225 kV, I2 = 128.3 A'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Cuve étanche en tôle d\'acier soudée avec conservateur d\'huile et assécheur d\'air à silicagel',
      dimensionsApproxMeters: 'L 6.8 m × l 4.5 m × H 5.8 m',
      weightApproxKg: 78000,
      mounting: { fr: 'Posé sur longrines béton avec bac de rétention d\'huile étanche et système d\'extinction déluge', en: 'Mounted on concrete foundation plinth with 100% oil containment sump and fire deluge system' },
      environmentalClearances: { fr: 'Murs coupe-feu béton REI 120 séparant la travée des transformateurs voisins', en: 'REI 120 fire-barrier walls separating adjacent transformer bays' }
    },
    mainComponents: [
      { id: 'gsu-core', name: { fr: 'Noyau magnétique à 3 colonnes', en: 'Three-limb magnetic core' }, function: { fr: 'Canalise le flux magnétique mutuel', en: 'Channels mutual magnetic flux' }, materialOrTechnology: 'Tôles à grains orientés (CGO) découpées au laser', criticality: 'CRITICAL' },
      { id: 'gsu-wind', name: { fr: 'Enroulements BT et HT cylindriques étagés', en: 'Staged concentric LV/HV windings' }, function: { fr: 'Transportent les courants et supportent les contraintes électrodynamiques', en: 'Carry current and withstand electrodynamic short-circuit forces' }, materialOrTechnology: 'Cuivre électrolytique émaillé isolé papier Kraft', criticality: 'CRITICAL' },
      { id: 'gsu-oil', name: { fr: 'Huile minérale isolante (22 000 Litres)', en: 'Insulating mineral oil (22,000 Liters)' }, function: { fr: 'Assure l\'isolation diélectrique et la convection thermique vers les radiateurs', en: 'Provides dielectric insulation and heat evacuation to radiator banks' }, materialOrTechnology: 'Huile minérale naphténique pure IEC 60296', criticality: 'CRITICAL' },
      { id: 'gsu-bush', name: { fr: 'Traversées HT 245 kV RIP (Resin Impregnated Paper)', en: '245 kV RIP high-voltage bushings' }, function: { fr: 'Sortent les conducteurs 225 kV à travers la cuve avec contrôle capacitif du gradient', en: 'Route 225 kV conductors through tank wall with capacitive graded field control' }, materialOrTechnology: 'Isolateur composite silicone anti-pollution', criticality: 'CRITICAL' }
    ],

    energyOrSignalFlow: {
      fr: 'Puissance 10.5 kV (2639 A) → Enroulement primaire triangle → Noyau magnétique → Enroulement 225 kV étoile → Traversées HT → Ligne de transport',
      en: '10.5 kV power (2639 A) → Delta primary winding → Magnetic core → 225 kV wye winding → HV bushings → Transmission corridor'
    },
    electricalRole: {
      fr: 'Élévateur de tension principal et séparation galvanique',
      en: 'Main step-up voltage converter and galvanic barrier'
    },
    thermalRole: {
      fr: 'Évacue 223 kW de pertes (38 kW à vide + 185 kW en charge) par radiateurs à ventilation forcée (ONAF)',
      en: 'Dissipates 223 kW of losses (38 kW no-load + 185 kW load) via forced-air radiator banks (ONAF)'
    },

    systemContextDescription: {
      fr: 'Raccorde directement l\'alternateur hydroélectrique G1 à la travée de départ 225 kV du poste de Songloulou.',
      en: 'Directly connects hydro-generator G1 to 225 kV transmission bay in Songloulou switchyard.'
    },
    upstreamEquipmentIds: ['eq-exp-hydro-gen-01'],
    downstreamEquipmentIds: ['eq-exp-gis-bay-225k', 'eq-exp-tower-225kv'],
    relationships: [
      {
        id: 'rel-gsu-gis',
        targetEquipmentId: 'eq-exp-gis-bay-225k',
        targetName: { fr: 'Travée Disjoncteur SF6 225 kV', en: '225 kV SF6 Breaker Bay' },
        targetCategory: 'SWITCHGEAR',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Alimente la travée de départ ligne 225 kV à travers le disjoncteur HT', en: 'Feeds 225 kV line bay through the high-voltage circuit breaker' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['87T', '50/51', '51N', '49', '63 (Buchholz)', '26 (Température huile)'],
      protectiveRelayIds: ['eq-exp-relay-87t'],
      summary: {
        fr: 'Protection principale par relais différentiel 87T et relais de Buchholz (détection de gaz/choc d\'huile). Protection de secours par surintensité à temps inverse (51) et masse cuve.',
        en: 'Primary protection via percentage differential 87T and Buchholz gas/oil surge relay. Backup protection via inverse-time overcurrent (51) and tank earth leakage.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Relais Buchholz mécanique à deux flotteurs', 'Thermomètre cadran à huile et image thermique enroulement', 'Soupape de surpression avec contact sec'],
      instrumentTransformerIds: ['eq-exp-ct-225k'],
      measuredQuantities: ['Température huile supérieure (°C)', 'Température point chaud enroulement (°C)', 'Niveau d\'huile dans le conservateur', 'Pression interne cuve']
    },
    controlAndAutomation: {
      localControls: { fr: 'Armoire de regroupement de cuve avec automate de commande des ventilateurs et régleur en charge', en: 'Marshalling box with automatic fan cooling staging and tap changer controls' },
      remoteControls: { fr: 'Télésurveillance des alarmes Buchholz/température et télécommande du régleur hors tension', en: 'SCADA monitoring of Buchholz/thermal alarms and off-load tap position telemetry' },
      interlocks: { fr: 'Déclenchement instantané des deux disjoncteurs amont (10.5 kV) et aval (225 kV) sur signal Buchholz ou 87T', en: 'Simultaneous tripping of both upstream (10.5 kV) and downstream (225 kV) circuit breakers upon Buchholz or 87T trip' }
    },
    communicationProtocols: ['IEC 61850 GOOSE/MMS', 'Modbus RTU'],

    earthingAndBonding: {
      earthingRegime: 'Solid',
      connectionMethod: {
        fr: 'Neutre de l\'enroulement secondaire 225 kV directement raccordé à la terre générale du poste par barre cuivre 80x5 mm',
        en: '225 kV secondary star neutral solidly connected to switchyard ground mesh via 80x5 mm copper busbar'
      },
      dischargeCapability: {
        fr: 'Capacité de tenue au courant de court-circuit symétrique phase-terre de 31.5 kA pendant 1 seconde',
        en: 'Short-time withstand rating of 31.5 kA symmetrical phase-to-earth fault current for 1 second'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Huile minérale inhibée + Papier Kraft sous vide',
      bilRatingKv: 1050,
      creepageDistanceMmPerKv: 31,
      phaseClearanceMeters: 'Écartement entre traversées HT : 2.50 mètres dans l\'air'
    },
    connectionRequirements: {
      electrical: { fr: 'Arrivée 10.5 kV par boîte à câbles ou IPB; sortie 225 kV par traversées condensateur air/huile', en: '10.5 kV connection via IPB busduct; 225 kV output via oil-to-air condenser bushings' },
      mechanical: { fr: 'Galets de roulement bidirectionnels avec cales anti-dérive sismique', en: 'Bi-directional flanged rollers with seismic anti-drift locking chocks' },
      cableOrBusbar: { fr: 'Tubes aluminium 225 kV Ø 120 mm vers le jeu de barres', en: 'Ø 120 mm aluminum tubular buswork to 225 kV switchyard' },
      earthing: { fr: 'Deux points de terre opposés sur la cuve reliés au réseau de terre principal', en: 'Two diagonally opposite tank ground pads connected to station ground mesh' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '10°C à 45°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'Pollution classe d (Lourde selon IEC 60815)',
      indoorOutdoor: 'OUTDOOR'
    },

    keyEngineeringValues: [
      { key: 'Sn', label: { fr: 'Puissance assignée', en: 'Rated power' }, value: 50, unit: 'MVA', status: 'VERIFIED' },
      { key: 'U1', label: { fr: 'Tension assignée primaire', en: 'Rated primary voltage' }, value: 10.5, unit: 'kV', status: 'VERIFIED' },
      { key: 'U2', label: { fr: 'Tension assignée secondaire', en: 'Rated secondary voltage' }, value: 225, unit: 'kV', status: 'VERIFIED' },
      { key: 'Uk', label: { fr: 'Tension de court-circuit', en: 'Short-circuit impedance' }, value: 12.5, unit: '%', status: 'VERIFIED' },
      { key: 'P0', label: { fr: 'Pertes à vide', en: 'No-load losses' }, value: 38, unit: 'kW', status: 'VERIFIED' },
      { key: 'Pk', label: { fr: 'Pertes en charge (à 75°C)', en: 'Load losses (at 75°C)' }, value: 185, unit: 'kW', status: 'VERIFIED' },
      { key: 'cooling', label: { fr: 'Mode de refroidissement', en: 'Cooling class' }, value: 'ONAF', status: 'VERIFIED' },
      { key: 'bil_hv', label: { fr: 'Niveau d\'isolement aux chocs foudre HT', en: 'HV Lightning impulse withstand (BIL)' }, value: 1050, unit: 'kV', status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'UNDER_MAINTENANCE', 'FAULTED'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-GSU-01',
        name: { fr: 'Court-circuit entre spires sur l\'enroulement HT 225 kV', en: 'Inter-turn winding insulation fault on 225 kV winding' },
        rootCause: { fr: 'Dégradation diélectrique du papier Kraft suite à des surtensions de foudre répétées', en: 'Kraft paper thermal/dielectric degradation caused by repeated lightning surges' },
        consequenceOnSystem: { fr: 'Formation d\'arc sous huile, dégagement rapide de gaz inflammable (H2, C2H2), risque d\'explosion de la cuve', en: 'Under-oil power arcing, rapid acetylene/hydrogen gas generation, risk of tank rupture/fire' },
        protectiveResponse: { fr: 'Déclenchement instantané 87T (< 20 ms) + Clapet Buchholz déclenchant l\'extinction incendie', en: 'Instantaneous 87T differential trip (< 20 ms) + Buchholz surge contact tripping water deluge' },
        severity: 'CATASTROPHIC'
      },
      {
        code: 'FM-GSU-02',
        name: { fr: 'Défaillance de traversée condensateur 245 kV (Claquant diélectrique)', en: '245 kV condenser bushing catastrophic puncture' },
        rootCause: { fr: 'Infiltration d\'humidité dans la tête de traversée ou décharges partielles internes', en: 'Moisture ingress into bushing head or internal partial discharge degradation' },
        consequenceOnSystem: { fr: 'Court-circuit franc phase-terre 225 kV, projection d\'éclats de céramique/silicone', en: 'Solid phase-to-ground 225 kV short-circuit, violent shrapnel projection' },
        protectiveResponse: { fr: 'Protection de surintensité homopolaire de terre (51N) et différentielle de barres', en: 'Residual earth overcurrent (51N) and substation busbar differential protection' },
        severity: 'CATASTROPHIC'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'Perte de l\'évacuation du groupe turbo-alternateur associé, nécessitant 3 à 6 mois de réparation en usine.',
      en: 'Complete loss of unit evacuation, requiring 3 to 6 months of heavy workshop overhaul.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Très Haute Tension 225 kV', 'Volume d\'huile inflammable (22 tonnes)', 'Risque d\'explosion de cuve', 'Arcs électriques majeurs'],
      isolationProcedureLoto: {
        fr: 'Déclenchement et cadenassage des disjoncteurs 10.5 kV et 225 kV, ouverture des sectionneurs de ligne, mise à la terre des deux côtés.',
        en: 'Lockout of upstream 10.5 kV and downstream 225 kV circuit breakers, visible disconnector isolation, solid grounding on both ends.'
      },
      ppeRequirements: ['Casque de sécurité avec écran facial', 'Chaussures de sécurité avec semelle anti-huile', 'Harnais antichute pour intervention sur dôme cuve']
    },

    maintenancePlan: [
      { type: 'CONDITION_BASED', periodicity: 'Semestrielle', description: { fr: 'Analyse chromatographique des gaz dissous dans l\'huile (DGA)', en: 'Dissolved Gas Analysis (DGA) for early fault detection (Duval Triangle)' }, toolsAndStandards: ['Chromatographe en phase gazeuse', 'IEC 60599', 'IEEE C57.104'] },
      { type: 'PREVENTIVE', periodicity: 'Annuelle', description: { fr: 'Mesure de tangente delta des traversées et du diélectrique huile, vérification des assécheurs', en: 'Bushing and winding dielectric dissipation factor (tan delta) and silica gel renewal' }, toolsAndStandards: ['Pont de Schering ou Doble M4100'] },
      { type: 'TESTING_COMMISSIONING', periodicity: 'Tous les 3 ans', description: { fr: 'Mesure de la réponse en fréquence de balayage (SFRA) pour détecter les déformations mécaniques', en: 'Sweep Frequency Response Analysis (SFRA) to detect winding geometric displacement' }, toolsAndStandards: ['Appareil SFRA', 'IEC 60076-18'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essai de tenue aux chocs de foudre 1050 kV crête', 'Mesure des décharges partielles sous tension induite', 'Essai d\'échauffement à pleine charge'],
      siteAcceptanceTestsSat: ['Rigidité diélectrique et teneur en eau de l\'huile minérale (> 60 kV / < 15 ppm)', 'Vérification du rapport de transformation sur toutes les prises', 'Résistance d\'isolement 5 kV enroulements/terre'],
      commissioningProcedures: ['Mise sous tension à vide pendant 24h avec surveillance acoustique', 'Contrôle du sens de rotation des phases et mesure du courant magnétisant']
    },

    applicableStandards: [
      { standardCode: 'IEC 60076-1', title: 'Power transformers - Part 1: General', relevantClauses: ['Clause 5 (Rating)', 'Clause 10 (Routine tests)'], jurisdiction: 'International' },
      { standardCode: 'IEC 60076-3', title: 'Power transformers - Part 3: Insulation levels and dielectric tests', relevantClauses: ['Clause 7 (Lightning impulse)', 'Clause 12 (Partial discharge)'], jurisdiction: 'International' },
      { standardCode: 'IEC 60599', title: 'Mineral oil-filled electrical equipment in service - Guidance on the interpretation of dissolved and free gases analysis', relevantClauses: ['Clause 5 (Duval method)'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-engineer', title: { fr: 'Ingénieur Postes & Transformateurs', en: 'Substation & Transformer Engineer' }, tasks: { fr: 'Dimensionnement du transformateur, suivi de fabrication usine (FAT) et maintenance prédictive DGA', en: 'Transformer sizing specification, FAT factory inspection, and DGA predictive health audits' } }
    ],
    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Cahier des charges transformateur élévateur', 'Étude de court-circuit et calcul de tenue mécanique'], involvedRoles: ['Ingénieur Poste'] },
      { phase: 'OPERATION_MONITORING', deliverables: ['Rapports DGA semestriels', 'Courbes de vieillissement papier (furanes)'], involvedRoles: ['Ingénieur Maintenance'] }
    ],

    deliverablesAndDocuments: ['Plan d\'encombrement et fondations cuve', 'Schéma des bornes et raccordements', 'Rapport d\'essais en plateforme d\'essais FAT', 'Notice d\'exploitation'],
    provenance: {
      id: 'prov-exp-gsu-01',
      entity_id: 'eq-exp-gsu-trafo-01',
      entity_type: 'equipment',
      source_ref: 'Spécification technique SONATREL GSU & IEC 60076',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE High Voltage Engineering Board',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Paramètres thermiques établis pour une température ambiante maximale de 40°C. La puissance assignée de 50 MVA requiert la marche continue des 4 ventilateurs de cuve.',
      en: 'Thermal ratings established for maximum 40°C ambient. The 50 MVA continuous rating requires all 4 cooling fans operating.'
    },

    representations: {
      physical: {
        svgVariant: 'TRANSFORMER',
        dimensionsLabel: '6.8 m × 4.5 m × 5.8 m',
        enclosureLabel: 'Cuve acier étanche avec bac de rétention',
        maintenanceClearance: 'Distance de sécurité 225 kV : 2.0 m minimum'
      },
      electrical: {
        symbolType: 'TRANSFORMER_2W_DY',
        incomerTerminal: 'Primaire 10.5 kV Triangle (1U, 1V, 1W)',
        outgoingTerminal: 'Secondaire 225 kV Étoile (2U, 2V, 2W, 2N)',
        protectionZone: 'Zone protégée 87T',
        measurementTap: 'Tores TC traversées HT + Prise d\'échantillonnage d\'huile'
      },
      functional: {
        inputSignal: '10.5 kV triphasé, 2639 A, 50 Hz',
        conversionProcess: 'Couplage inductif mutuel à travers circuit ferromagnétique',
        outputSignal: '225 kV triphasé, 128.3 A, 50 Hz',
        feedbackLoop: 'Surveillance température huile/enroulement commandant le démarrage des ventilateurs'
      }
    }
  }
];
