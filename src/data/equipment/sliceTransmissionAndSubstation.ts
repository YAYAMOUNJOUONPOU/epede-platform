// src/data/equipment/sliceTransmissionAndSubstation.ts
// EPEDE - Transmission and Substation Equipment Nodes

import type { CanonicalEquipmentObject } from '../../types/equipmentExplorer';

export const TRANSMISSION_SUBSTATION_ITEMS: CanonicalEquipmentObject[] = [
  // 3. TRANSMISSION TOWER
  {
    id: 'eq-exp-tower-225kv',
    tagIec: '==L225.T01',
    name: {
      fr: 'Pylône Métallique Treillis HTB 225 kV (Double Terne)',
      en: '225 kV Steel Lattice Transmission Tower (Double Circuit)'
    },
    aliases: {
      fr: ['Pylône treillis 225 kV', 'Support de ligne HTB SONATREL', 'Pylône d\'ancrage'],
      en: ['225 kV Lattice Tower', 'Suspension/Tension Pylon', 'Transmission Mast']
    },
    equipmentType: 'TransmissionTower',
    category: 'TRANSMISSION',
    parentDomain: 'D03',
    systemStage: 'HV_EHV_TRANSMISSION',
    subsystemContext: {
      fr: 'Corridor aérien de transport d\'énergie haute tension',
      en: 'Overhead bulk high-voltage transmission right-of-way'
    },
    technologyContext: {
      fr: 'Treillis d\'acier galvanisé à chaud avec isolateurs composites silicone et faisceau de conducteurs Aster 570',
      en: 'Hot-dip galvanized steel lattice structure with silicone composite insulator strings and Aster 570 conductors'
    },
    applicationContext: {
      fr: 'Interconnexion Songloulou - Bekoko - Oyomabang (RIS Cameroun)',
      en: 'Bulk transport corridor Songloulou - Bekoko - Oyomabang (Cameroon RIS)'
    },
    voltageContext: {
      nominalVoltage: '225 kV',
      level: 'HV',
      frequencyHz: 50,
      phases: '3-phase AC (Double Circuit)'
    },
    typicalLocation: {
      fr: 'Corridor 225 kV Mangombé-Oyomabang (PK 45 en forêt tropicale)',
      en: '225 kV corridor Mangombé-Oyomabang (tropical terrain)'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Structure porteuse autoportante en treillis d\'acier maintenant les conducteurs nus sous 225 kV à des distances d\'isolement sécuritaires au-dessus du sol et de la végétation.',
      en: 'Self-supporting galvanized steel lattice mast maintaining bare 225 kV transmission conductors at safe electrical clearances above terrain and vegetation.'
    },
    purpose: {
      fr: 'Permettre le transit à ciel ouvert de fortes puissances (jusqu\'à 310 MVA par terne) sur de longues distances interurbaines.',
      en: 'Enable open-air transmission of bulk power (up to 310 MVA per circuit) across long inter-city distances.'
    },
    engineeringProblemSolved: {
      fr: 'Résiste aux charges de vent tropical (140 km/h), aux tractions de conducteurs et à la foudre tout en garantissant un dégagement au sol supérieur à 7.5 m.',
      en: 'Withstands tropical wind loads (140 km/h), conductor mechanical tensions, and lightning strikes while maintaining >7.5 m ground clearance.'
    },

    primaryFunction: {
      fr: 'Maintien mécanique et guidage spatial des conducteurs de phase 225 kV et câbles de garde OPGW.',
      en: 'Mechanical suspension and spatial routing of 225 kV phase conductors and OPGW shield wires.'
    },
    secondaryFunctions: {
      fr: ['Protection contre la foudre par câble de garde au sommet (cône de protection 30°)', 'Support de télécommunications optiques par câble OPGW', 'Dissipation des courants de foudre dans le sol via les fondations'],
      en: ['Lightning shielding via top ground wire (30° shield angle)', 'High-bandwidth telecom support via OPGW fiber optics', 'Lightning surge dissipation via footing grounding electrodes']
    },
    operatingPrincipleSummary: {
      fr: 'Structure de génie civil et mécanique transmettant les efforts de tension des câbles et du vent aux fondations béton, tout en isolant diélectriquement les conducteurs sous tension grâce à des chaînes d\'isolateurs.',
      en: 'Mechanical structural frame transmitting cable tension and wind forces into concrete footings while maintaining dielectric isolation via composite insulator strings.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Suspension Diélectrique', en: 'Dielectric Suspension' },
        description: { fr: 'Les chaînes d\'isolateurs composites silicone (longueur 2.4 m) isolent les 225 kV de la structure métallique mise à la terre.', en: 'Silicone composite insulator strings (2.4 m length) isolate 225 kV conductors from the grounded steel tower.' },
        physicalPhenomenon: { fr: 'Tenue diélectrique dans l\'air et ligne de fuite', en: 'Dielectric withstand and creepage leakage distance' },
        keyVariable: 'BIL = 1050 kV, Creepage = 31 mm/kV'
      },
      {
        stepNumber: 2,
        title: { fr: 'Équilibre Mécanique des Tensions', en: 'Mechanical Tension Balance' },
        description: { fr: 'Les conducteurs Almélec Aster 570 sont tendus à 22% de leur charge de rupture (UTS), induisant une flèche contrôlée.', en: 'Aster 570 AAAC conductors strung at 22% UTS tension, maintaining calculated catenary sag.' },
        physicalPhenomenon: { fr: 'Équation de la chaînette y = a · cosh(x/a)', en: 'Catenary equation y = a · cosh(x/a)' },
        keyVariable: 'Span = 400 m, Sag = 9.8 m at 75°C'
      },
      {
        stepNumber: 3,
        title: { fr: 'Protection Foudre Sommitale', en: 'Top Lightning Shielding' },
        description: { fr: 'Le câble de garde OPGW intercepte les coups de foudre directs et écoule l\'onde vers les 4 massifs béton.', en: 'OPGW shield wire intercepts direct lightning strikes, shunting transient impulse to the 4 footings.' },
        physicalPhenomenon: { fr: 'Effet électrogéométrique de protection foudre', en: 'Electrogeometric lightning interception model' },
        keyVariable: 'Footing resistance R < 10 Ω'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Structure métallique en treillis ouverte à cornières d\'acier galvanisé',
      dimensionsApproxMeters: 'Hauteur 42.5 m, Largeur bras 14.0 m, Emprise au sol 7.5 × 7.5 m',
      weightApproxKg: 18500,
      mounting: { fr: '4 massifs de fondation individuels en béton armé ancrés avec cornières de scellement', en: '4 reinforced concrete pad-and-chimney foundations with galvanized stub angles' },
      environmentalClearances: { fr: 'Bande de servitude défrichée de 40 m de large exempte de végétation haute', en: '40 m wide right-of-way clearance strip cleared of high trees' }
    },
    mainComponents: [
      { id: 't-mast', name: { fr: 'Fût et tête de pylône en treillis', en: 'Lattice tower body and bridge head' }, function: { fr: 'Reprend les efforts verticaux, transversaux et longitudinaux', en: 'Withstands vertical, transverse wind, and longitudinal tension forces' }, materialOrTechnology: 'Cornières en acier S355 galvanisé', criticality: 'CRITICAL' },
      { id: 't-insul', name: { fr: 'Chaînes d\'isolateurs composites silicone (245 kV)', en: '245 kV composite silicone suspension strings' }, function: { fr: 'Assure l\'isolement électrique phase-masse', en: 'Provides phase-to-ground electrical insulation' }, materialOrTechnology: 'Fibre de verre imprégnée d\'époxy avec jupes silicone', criticality: 'CRITICAL' },
      { id: 't-opgw', name: { fr: 'Câble de garde à fibres optiques (OPGW)', en: 'Optical Ground Wire (OPGW)' }, function: { fr: 'Blindage contre la foudre et transmission télécom/SCADA', en: 'Lightning shielding and SCADA/telecom transmission' }, materialOrTechnology: 'Tube inox avec 48 fibres monomodes et brins aluminium-acier', criticality: 'HIGH' }
    ],

    energyOrSignalFlow: {
      fr: 'Conducteurs Aster 570 (puissance électrique 225 kV) + Câble OPGW (faisceau télécom optique)',
      en: 'Aster 570 conductors (225 kV power flow) + OPGW cable (optical telecom and SCADA flow)'
    },
    electricalRole: {
      fr: 'Support d\'acheminement de la puissance électrique sans pertes capacitives au sol',
      en: 'Physical carrier for electric power minimizing ground capacitive dissipation'
    },
    thermalRole: {
      fr: 'Refroidissement naturel des conducteurs par convection de l\'air ambiant (capacité 820 A par temps calme)',
      en: 'Convective ambient air cooling of conductors (820 A ampacity in calm air)'
    },

    systemContextDescription: {
      fr: 'Composant principal de la ligne de transport 225 kV reliant la sortie du poste Songloulou à l\'entrée du poste Oyomabang.',
      en: 'Primary element of 225 kV transmission line connecting Songloulou substation to Oyomabang substation.'
    },
    upstreamEquipmentIds: ['eq-exp-gsu-trafo-01'],
    downstreamEquipmentIds: ['eq-exp-gis-bay-225k'],
    relationships: [
      {
        id: 'rel-tow-gis',
        targetEquipmentId: 'eq-exp-gis-bay-225k',
        targetName: { fr: 'Travée Blindée GIS SF6 225 kV', en: '225 kV GIS Switchgear Bay' },
        targetCategory: 'SWITCHGEAR',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Aboutit aux traversées d\'entrée du poste de transformation', en: 'Terminates into substation entry bushings' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['21 (Distance)', '87L (Différentielle de ligne)', '50N/51N', '50BF'],
      protectiveRelayIds: ['eq-exp-relay-ied-61850'],
      summary: {
        fr: 'Protégé par relais de distance multifonction (21) avec téléaction par fibre optique OPGW et différentielle de ligne (87L).',
        en: 'Protected by line distance relay (21) via OPGW teleprotection and optical line differential (87L).'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Moniteurs de flèche par caméra/inclinomètre', 'Capteurs de température de conducteur', 'Détecteurs d\'impacts de foudre'],
      instrumentTransformerIds: [],
      measuredQuantities: ['Tension mécanique des conducteurs (kN)', 'Température de surface (°C)', 'Courant de fuite isolateur (mA)']
    },
    controlAndAutomation: {
      localControls: { fr: 'Dispositifs anti-escalade cadenassés et plaques de signalisation danger mortel', en: 'Padlocked anti-climbing barriers and high voltage hazard danger plates' },
      remoteControls: { fr: 'Télésurveillance de l\'état de la ligne par OPGW et réflectométrie optique (OTDR)', en: 'Real-time line health monitoring via OPGW fiber and OTDR reflectometry' },
      interlocks: { fr: 'Verrouillage de réenclenchement rapide sur défaut permanent détecté par le relais 21', en: 'Auto-reclose lockout on permanent fault detected by distance relay 21' }
    },
    communicationProtocols: ['Fibre optique ITU-T G.652D (OPGW)'],

    earthingAndBonding: {
      earthingRegime: 'Solid',
      connectionMethod: {
        fr: 'Chaque pied est relié à une boucle de terre fermée en câble acier cuivré avec piquets profonds',
        en: 'Each leg grounded to copper-clad steel earth loop with deep driven grounding rods'
      },
      dischargeCapability: {
        fr: 'Écoule 100 kA d\'onde de foudre 10/350 µs sans amorçage en retour (backflashover)',
        en: 'Discharges 100 kA 10/350 µs lightning stroke without backflashover'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Air libre (distance d\'isolement dans l\'air > 2.0 m) + Isolateurs silicone',
      bilRatingKv: 1050,
      phaseClearanceMeters: 'Écartement entre conducteurs de phase : 6.0 m'
    },
    connectionRequirements: {
      electrical: { fr: 'Manchons de jonction aluminium compressés à la presse hydraulique 100 tonnes', en: '100-ton hydraulic compression aluminum splice joints' },
      mechanical: { fr: 'Pince de suspension à tourillon oscillant avec bretelles préformées anti-vibratoires', en: 'Trunnion suspension clamps with preformed helical armor rods' },
      cableOrBusbar: { fr: 'Faisceau bifilaire Aster 570 mm²', en: 'Twin bundle Aster 570 mm² AAAC' },
      earthing: { fr: 'Câble acier cuivré 95 mm² relié à la cornière de base', en: '95 mm² copper-weld wire bonded to base angle' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '15°C à 45°C',
      altitudeLimitM: 1200,
      pollutionLevel: 'Zone tropicale humide / feux de brousse occasionnels',
      indoorOutdoor: 'OUTDOOR'
    },

    keyEngineeringValues: [
      { key: 'Un', label: { fr: 'Tension assignée', en: 'Rated voltage' }, value: 225, unit: 'kV', status: 'VERIFIED' },
      { key: 'In', label: { fr: 'Intensité maximale admissible par terne', en: 'Thermal rating per circuit' }, value: 820, unit: 'A', status: 'VERIFIED' },
      { key: 'Sn', label: { fr: 'Puissance maximale transmissible', en: 'Transmission capacity' }, value: 310, unit: 'MVA', status: 'VERIFIED' },
      { key: 'height', label: { fr: 'Hauteur totale', en: 'Total height' }, value: 42.5, unit: 'm', status: 'VERIFIED' },
      { key: 'span', label: { fr: 'Portée nominale', en: 'Ruling span' }, value: 400, unit: 'm', status: 'VERIFIED' },
      { key: 'r_km', label: { fr: 'Résistance linéique (20°C)', en: 'Resistance per km' }, value: 0.058, unit: 'Ω/km', status: 'VERIFIED' },
      { key: 'x_km', label: { fr: 'Réactance linéique', en: 'Reactance per km' }, value: 0.405, unit: 'Ω/km', status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'UNDER_MAINTENANCE', 'FAULTED'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-TOW-01',
        name: { fr: 'Amorçage de contournement par coup de foudre (Backflashover)', en: 'Lightning backflashover across insulator string' },
        rootCause: { fr: 'Coup de foudre direct sur le câble de garde avec résistance de terre de pied de pylône trop élevée (> 15 Ω)', en: 'Direct stroke to shield wire combined with high tower footing resistance (> 15 Ω)' },
        consequenceOnSystem: { fr: 'Court-circuit monophasé terre 225 kV, creux de tension sur le réseau RIS', en: 'Single-phase to earth 225 kV fault, system voltage dip across Southern Grid' },
        protectiveResponse: { fr: 'Déclenchement monophasé par relais 21 + cycle de réenclenchement rapide réussi en 300 ms', en: 'Single-pole trip by relay 21 + rapid single-pole auto-reclose in 300 ms' },
        severity: 'MAJOR'
      },
      {
        code: 'FM-TOW-02',
        name: { fr: 'Rupture de conducteur sous contrainte de fatigue vibratoire éolienne', en: 'Conductor fatigue break due to aeolian vibration' },
        rootCause: { fr: 'Absence ou desserrage des amortisseurs Stockbridge sous vent transversal modéré', en: 'Missing or loose Stockbridge dampers under steady laminar wind' },
        consequenceOnSystem: { fr: 'Chute de conducteur au sol, rupture de phase, danger d\'électrocution immédiat', en: 'Phase conductor dropped to ground, immediate electrocution hazard' },
        protectiveResponse: { fr: 'Déclenchement instantané sur zone 1 de distance (21) et détection homopolaire (51N)', en: 'Zone 1 high-speed distance trip (21) and zero-sequence overcurrent (51N)' },
        severity: 'CATASTROPHIC'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'Déclenchement du terne de transport 225 kV, surchargeant le second terne et risquant une cascade d\'ouvertures.',
      en: '225 kV line trip transferring load to parallel circuit with potential cascading trip risk.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Très Haute Tension 225 kV', 'Risque de chute de hauteur (> 40 m)', 'Tension de pas et de toucher lors d\'un défaut'],
      isolationProcedureLoto: {
        fr: 'Consignation bilatérale de la ligne (postes de départ et d\'arrivée ouverts et mis à la terre), vérification d\'absence de tension (VAT) au perche télescopique.',
        en: 'Bilateral line lockout-tagout (both substation ends grounded), live-line testing (VAT) with calibrated high-voltage hot stick.'
      },
      ppeRequirements: ['Harnais d\'escalade avec double longe absorbeuse', 'Casque avec jugulaire', 'Combinaison ignifugée', 'Bottes à semelle isolante']
    },

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Annuelle', description: { fr: 'Contrôle thermographique infrarouge par hélicoptère ou drone des manchons et pinces', en: 'Helicopter/drone infrared thermography of conductor splices and suspension clamps' }, toolsAndStandards: ['Caméra thermique FLIR T1K', 'CIGRE TB 601'] },
      { type: 'PREVENTIVE', periodicity: 'Biennale', description: { fr: 'Mesure de la résistance de terre des pieds de pylône à haute fréquence (pour éliminer l\'effet du câble de garde)', en: 'High-frequency tower footing resistance measurement (isolating ground wire effect)' }, toolsAndStandards: ['Telluromètre haute fréquence C.A 6474'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essai de rupture mécanique sur cornières et boulons', 'Contrôle d\'épaisseur de galvanisation à chaud (> 86 µm)'],
      siteAcceptanceTestsSat: ['Contrôle du couple de serrage de tous les boulons de structure', 'Contrôle topographique de la verticalité du fût'],
      commissioningProcedures: ['Mesure de la concordance de phases sous tension réduite', 'Essai de mise sous tension à vide 225 kV pendant 12h']
    },

    applicableStandards: [
      { standardCode: 'IEC 60826', title: 'Design criteria of overhead transmission lines', relevantClauses: ['Clause 6 (Climatic loads)', 'Clause 7 (Security requirements)'], jurisdiction: 'International' },
      { standardCode: 'IEC 61284', title: 'Overhead lines - Requirements and tests for fittings', relevantClauses: ['Clause 11 (Vibration tests)'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'transmission-engineer', title: { fr: 'Ingénieur Lignes Aériennes', en: 'Overhead Lines Engineer' }, tasks: { fr: 'Calcul mécanique des portées, sélection des conducteurs et gestion des bandes de servitude', en: 'Tower structural analysis, catenary sag-tension calculation, and ROW management' } }
    ],
    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Profil en long de ligne', 'Carnet de piquetage des pylônes', 'Note de calcul des fondations'], involvedRoles: ['Ingénieur Lignes', 'Géotechnicien'] }
    ],

    deliverablesAndDocuments: ['Plan de montage treillis pylône', 'Tableau de pose et de réglage des conducteurs', 'Cahier de réception des fondations'],
    provenance: {
      id: 'prov-exp-tow-01',
      entity_id: 'eq-exp-tower-225kv',
      entity_type: 'equipment',
      source_ref: 'Spécification technique Lignes 225 kV SONATREL & IEC 60826',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Transmission Systems Team',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Calculé pour un vent de base de 140 km/h et une température maximale de conducteur de 75°C en régime permanent.',
      en: 'Engineered for 140 km/h design wind speed and maximum continuous 75°C conductor operating temperature.'
    },

    representations: {
      physical: {
        svgVariant: 'TOWER',
        dimensionsLabel: 'H 42.5 m × L 14.0 m',
        enclosureLabel: 'Treillis d\'acier galvanisé',
        maintenanceClearance: 'Bande de sécurité 40 m'
      },
      electrical: {
        symbolType: 'TRANSMISSION_LINE',
        incomerTerminal: 'Arrivée ligne amont (Songloulou)',
        outgoingTerminal: 'Départ ligne aval (Oyomabang)',
        protectionZone: 'Zone protégée 21 / 87L',
        measurementTap: 'Pied de pylône (courant foudre)'
      },
      functional: {
        inputSignal: 'Puissance 225 kV triphasée',
        conversionProcess: 'Acheminement spatial sans conversion avec pertes Joule et réactives R+jX',
        outputSignal: 'Puissance 225 kV transmise avec chute de tension ΔV',
        feedbackLoop: 'Surveillance télécom optique OPGW'
      }
    }
  },

  // 4. HIGH VOLTAGE GIS BREAKER BAY (225 kV)
  {
    id: 'eq-exp-gis-bay-225k',
    tagIec: '==E1.QA1',
    name: {
      fr: 'Travée Blindée Disjoncteur SF6 225 kV (Double Jeu de Barres)',
      en: '225 kV SF6 Gas-Insulated Switchgear (GIS) Bay'
    },
    aliases: {
      fr: ['Poste blindé 225 kV', 'Disjoncteur SF6 blindé', 'Travée GIS Bekoko/Oyomabang'],
      en: ['225 kV GIS Bay', 'Metal-Clad SF6 Breaker', 'Substation GIS Bay']
    },
    equipmentType: 'GISSwitchgearBay',
    category: 'SWITCHGEAR',
    parentDomain: 'D04',
    systemStage: 'SUBSTATIONS_NODES',
    subsystemContext: {
      fr: 'Bâtiment blindé de poste de transformation et de répartition 225 kV',
      en: 'Indoor metal-enclosed substation hall for 225 kV switching'
    },
    technologyContext: {
      fr: 'Appareillage sous enveloppe métallique en aluminium pressurisée au gaz SF6 (6.0 bars)',
      en: 'Aluminum-enclosed SF6 gas-insulated switchgear pressurized at 6.0 bars'
    },
    applicationContext: {
      fr: 'Coupure des courants nominaux et d\'avarie 40 kA sur les départs et transformateurs 225 kV',
      en: 'Switching load currents and interrupting 40 kA fault currents on 225 kV feeders/transformers'
    },
    voltageContext: {
      nominalVoltage: '225 kV (Um = 245 kV)',
      level: 'HV',
      frequencyHz: 50,
      phases: '3-phase AC'
    },
    typicalLocation: {
      fr: 'Salle GIS du poste 225 kV d\'Oyomabang (Yaoundé)',
      en: 'GIS hall at Oyomabang 225 kV substation (Yaoundé)'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Ensemble compact d\'appareillage haute tension intégré sous enveloppe étanche au gaz SF6, comprenant le disjoncteur à autosoufflage, deux sectionneurs de jeux de barres, des sectionneurs de terre et les tores de mesure.',
      en: 'Compact high-voltage metal-enclosed switchgear assembly insulated with SF6 gas, housing puffer circuit breaker, dual busbar disconnectors, high-speed earth knives, and instrument CTs.'
    },
    purpose: {
      fr: 'Assurer la manœuvre sécuritaire, le découplage et l\'interruption ultra-rapide des courts-circuits dans un espace réduit de 90% par rapport à un poste ouvert.',
      en: 'Ensure safe switching, bus isolation, and ultra-fast short-circuit clearance within 10% footprint of conventional outdoor air-insulated yards.'
    },
    engineeringProblemSolved: {
      fr: 'Élimine tout risque d\'amorçage atmosphérique, de pollution saline/poussière et de contact accidentel, garantissant une sécurité totale du personnel.',
      en: 'Eliminates atmospheric pollution, flashovers, and external wildlife contacts while guaranteeing complete touch-safe enclosure for operators.'
    },

    primaryFunction: {
      fr: 'Établissement et coupure des courants de charge et de court-circuit jusqu\'à 40 kA.',
      en: 'Making and breaking load currents and severe short-circuit currents up to 40 kA.'
    },
    secondaryFunctions: {
      fr: ['Sélection de jeu de barres (Barre 1 / Barre 2)', 'Mise à la terre rapide de sécurité (sectionneur de terre classe E1)', 'Mesure des grandeurs électriques par tores intégrés'],
      en: ['Busbar selection (Bus 1 / Bus 2)', 'High-speed safety earthing (E1 class make-proof earth switch)', 'Current measurement via integrated toroidal CTs']
    },
    operatingPrincipleSummary: {
      fr: 'La chambre de coupure utilise le gaz SF6 sous pression pour souffler et éteindre l\'arc électrique lors de la séparation des contacts à l\'ouverture commandée par ressort motorisé.',
      en: 'Puffer arc chamber uses compressed SF6 gas to blast and extinguish high-power electric arc upon spring-operated contact separation in < 40 ms.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Ordre de Déclenchement', en: 'Trip Command Signal' },
        description: { fr: 'Le relais de protection émet un ordre de déclenchement (bobine d\'ouverture sous 110 V DC).', en: 'Protection relay energizes 110 V DC shunt trip coil.' },
        physicalPhenomenon: { fr: 'Libération du verrouillage mécanique à ressort', en: 'Mechanical spring latch release' },
        keyVariable: 'Trip time < 40 ms'
      },
      {
        stepNumber: 2,
        title: { fr: 'Autosoufflage SF6', en: 'SF6 Puffer Blast' },
        description: { fr: 'Le piston comprime le gaz SF6 et le projette à travers une buse isolante en PTFE directement dans l\'arc.', en: 'Compression cylinder blasts high-density SF6 gas through PTFE nozzle into arc channel.' },
        physicalPhenomenon: { fr: 'Refroidissement et déionisation ultra-rapide du plasma d\'arc', en: 'Thermal quenching and rapid plasma deionization' },
        keyVariable: 'SF6 pressure = 0.6 MPa (6 bars)'
      },
      {
        stepNumber: 3,
        title: { fr: 'Régénération Diélectrique', en: 'Dielectric Recovery' },
        description: { fr: 'Au passage par zéro du courant alternatif, le SF6 recombine les électrons et empêche le réamorçage.', en: 'At current zero-crossing, SF6 molecule electronegativity captures free electrons, preventing restrike.' },
        physicalPhenomenon: { fr: 'Recombinaison électron-molécule SF6⁻', en: 'Electron attachment recombination' },
        keyVariable: 'Transient Recovery Voltage (TRV) peak 412 kV'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Enveloppe tubulaire en alliage d\'aluminium monophasée étanche avec disques de rupture',
      dimensionsApproxMeters: 'L 4.5 m × l 1.8 m × H 3.6 m',
      weightApproxKg: 12000,
      mounting: { fr: 'Scellé sur plancher béton en salle de poste intérieur avec rails de guidage pour chariot', en: 'Anchored to reinforced indoor switchroom floor with maintenance trolley guide rails' },
      environmentalClearances: { fr: 'Couloir de manœuvre de 2.5 m devant les armoires de commande locale (LCC)', en: '2.5 m wide front operating aisle facing local control cubicles (LCC)' }
    },
    mainComponents: [
      { id: 'gis-cb', name: { fr: 'Chambre de coupure SF6 à autosoufflage', en: 'SF6 puffer interrupter chamber' }, function: { fr: 'Coupe les courants d\'arc jusqu\'à 40 kA', en: 'Clears power arcs up to 40 kA' }, materialOrTechnology: 'Contacts en cuivre-tungstène avec buse PTFE', criticality: 'CRITICAL' },
      { id: 'gis-mech', name: { fr: 'Mécanisme à commande à ressorts motorisé', en: 'Motor-wound spring drive mechanism' }, function: { fr: 'Stocke l\'énergie mécanique pour cycles O-0.3s-CO', en: 'Stores mechanical energy for O-0.3s-CO reclose cycle' }, materialOrTechnology: 'Ressorts hélicoïdaux en acier allié', criticality: 'CRITICAL' },
      { id: 'gis-ds', name: { fr: 'Sectionneurs de jeu de barres rotatifs', en: 'Rotary busbar disconnectors' }, function: { fr: 'Assure la distance d\'isolement visible/blindée', en: 'Provides safety isolation gap' }, materialOrTechnology: 'Contacts argentés sous gaz SF6', criticality: 'CRITICAL' },
      { id: 'gis-den', name: { fr: 'Densimètre à gaz SF6 compensé en température', en: 'Temperature-compensated SF6 gas densimeter' }, function: { fr: 'Surveille la densité de gaz et donne l\'alarme de fuite', en: 'Monitors SF6 density and alarms on pressure drop' }, materialOrTechnology: 'Soufflet métallique avec contacts électriques', criticality: 'HIGH' }
    ],

    energyOrSignalFlow: {
      fr: 'Ligne 225 kV → Traversée GIS → Sectionneur départ → Disjoncteur SF6 → Sectionneur de barre → Barres 225 kV',
      en: '225 kV Line → GIS bushing → Line disconnector → SF6 Breaker → Bus disconnector → 225 kV Busbar'
    },
    electricalRole: {
      fr: 'Appareil de coupure et d\'isolement du réseau haute tension',
      en: 'Primary switching and fault clearing apparatus on high voltage grid'
    },
    thermalRole: {
      fr: 'Évacue les pertes par conduction à travers l\'enveloppe en aluminium vers l\'air ambiant',
      en: 'Dissipates resistive conductor losses through aluminum shell to ambient air'
    },

    systemContextDescription: {
      fr: 'Nœud d\'entrée du poste 225/30 kV d\'Oyomabang protégeant le transformateur abaisseur principal.',
      en: 'Entry node at Oyomabang 225/30 kV substation protecting main step-down transformer.'
    },
    upstreamEquipmentIds: ['eq-exp-tower-225kv'],
    downstreamEquipmentIds: ['eq-exp-sub-trafo-225-30'],
    relationships: [
      {
        id: 'rel-gis-subtrafo',
        targetEquipmentId: 'eq-exp-sub-trafo-225-30',
        targetName: { fr: 'Transformateur Réseau 225/30 kV (63 MVA)', en: '225/30 kV Substation Transformer (63 MVA)' },
        targetCategory: 'TRANSFORMER',
        relationKind: 'FEEDS' as any,
        description: { fr: 'Alimente l\'enroulement haute tension du transformateur abaisseur de poste', en: 'Energizes high-voltage primary winding of the step-down substation transformer' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['50BF (Défaillance disjoncteur)', '87B (Différentielle barres)', '50/51', '87T'],
      protectiveRelayIds: ['eq-exp-relay-ied-61850'],
      summary: {
        fr: 'Intègre une protection de défaillance disjoncteur (50BF) déclenchant les travées adjacentes en cas de refus d\'ouverture sous 150 ms.',
        en: 'Equipped with breaker failure protection (50BF) tripping adjacent busbar bays if breaker fails to clear in 150 ms.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Densimètres SF6 à double seuil (alarme 5.2 bar, blocage 5.0 bar)', 'Compteur de manœuvres électromécanique', 'Capteurs UHF de décharges partielles'],
      instrumentTransformerIds: ['eq-exp-ct-225k'],
      measuredQuantities: ['Densité de gaz SF6 (kg/m³)', 'Pression normalisée à 20°C (bar)', 'Courant primaire (A)']
    },
    controlAndAutomation: {
      localControls: { fr: 'Armoire LCC (Local Control Cubicle) avec synoptique actif, commutateur local/distance et serrure Castell', en: 'Local Control Cubicle (LCC) with mimic display, local/remote key switch and Castell mechanical interlocks' },
      remoteControls: { fr: 'Télécommande complète depuis le SCADA SONATREL via messages optiques GOOSE IEC 61850', en: 'Full remote supervision and control from SONATREL dispatch via IEC 61850 GOOSE/MMS' },
      interlocks: { fr: 'Verrouillage électrique interdisant l\'ouverture d\'un sectionneur en charge ou la fermeture du sectionneur de terre sous tension', en: 'Hardwired electrical interlock preventing off-load disconnector operation or grounding energized bus' }
    },
    communicationProtocols: ['IEC 61850-8-1 (GOOSE & MMS)', 'IEC 61850-9-2 (Sampled Values)'],

    earthingAndBonding: {
      earthingRegime: 'Solid',
      connectionMethod: {
        fr: 'Toutes les enveloppes aluminium sont interconnectées et raccordées à la boucle de terre du bâtiment en 4 points distincts',
        en: 'All aluminum compartments bonded and grounded to substation ground grid at 4 discrete points'
      },
      dischargeCapability: {
        fr: 'Tenue au courant de court-circuit de 40 kA pendant 1 seconde',
        en: '40 kA short-time current withstand for 1 second'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Gaz Hexafluorure de Soufre (SF6) à 0.60 MPa',
      bilRatingKv: 1050,
      phaseClearanceMeters: 'Isolation monophasée blindée (distance phase-masse interne ~150 mm sous SF6)'
    },
    connectionRequirements: {
      electrical: { fr: 'Liaison directe barres blindées ou raccordement par traversées air/SF6 en terrasse', en: 'Direct GIS busduct or outdoor rooftop air-to-SF6 bushings' },
      mechanical: { fr: 'Joints de dilatation métalliques (soufflets inox) pour absorber la dilatation thermique des barres', en: 'Stainless steel expansion bellows absorbing conductor thermal movement' },
      cableOrBusbar: { fr: 'Barres conductrices tubulaires en cuivre/aluminium dans compartiment SF6', en: 'Tubular aluminum bus in SF6 enclosure' },
      earthing: { fr: 'Barre de terre cuivre 100x10 mm tout le long de la travée', en: '100x10 mm copper ground busbar running full length of GIS bay' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '5°C à 40°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'Environnement intérieur propre contrôlé',
      indoorOutdoor: 'INDOOR'
    },

    keyEngineeringValues: [
      { key: 'Ur', label: { fr: 'Tension assignée', en: 'Rated voltage' }, value: 245, unit: 'kV', status: 'VERIFIED' },
      { key: 'Ir', label: { fr: 'Courant nominal assigné', en: 'Rated normal current' }, value: 3150, unit: 'A', status: 'VERIFIED' },
      { key: 'Isc', label: { fr: 'Pouvoir de coupure en court-circuit', en: 'Rated short-circuit breaking current' }, value: 40, unit: 'kA', status: 'VERIFIED' },
      { key: 'tk', label: { fr: 'Durée admissible de court-circuit', en: 'Rated short-circuit duration' }, value: 1.0, unit: 's', status: 'VERIFIED' },
      { key: 'p_sf6', label: { fr: 'Pression nominale SF6 (20°C)', en: 'Rated SF6 pressure (20°C)' }, value: 6.0, unit: 'bar', status: 'VERIFIED' },
      { key: 'break_time', label: { fr: 'Temps de coupure total', en: 'Total break time' }, value: 40, unit: 'ms', status: 'VERIFIED' }
    ],

    availableStates: ['CLOSED', 'OPEN', 'TRIPPED', 'ISOLATED', 'EARTHED', 'UNDER_MAINTENANCE', 'LOCAL_CONTROL', 'REMOTE_CONTROL'],
    defaultState: 'CLOSED',

    failureModes: [
      {
        code: 'FM-GIS-01',
        name: { fr: 'Fuite lente de gaz SF6 avec baisse sous le seuil de blocage (5.0 bars)', en: 'Slow SF6 gas leak dropping below lockout threshold (5.0 bars)' },
        rootCause: { fr: 'Dégradation d\'un joint torique EPDM ou fissure microscopique sur un disque de rupture', en: 'EPDM O-ring seal deterioration or micro-crack on rupture disk' },
        consequenceOnSystem: { fr: 'Perte du pouvoir de coupure diélectrique, verrouillage automatique interdisant la manœuvre du disjoncteur', en: 'Loss of dielectric breaking capacity, automatic electrical lockout preventing trip command' },
        protectiveResponse: { fr: 'Alarme prioritaire SCADA + réacheminement de la charge et déclenchement par les disjoncteurs encadrants', en: 'Priority SCADA alarm + load transfer and clearing by adjacent breakers' },
        severity: 'CRITICAL'
      },
      {
        code: 'FM-GIS-02',
        name: { fr: 'Défaillance de réarmement du moteur de ressort de fermeture', en: 'Closing spring charging motor failure' },
        rootCause: { fr: 'Grillage du moteur auxiliaire 110 V DC ou rupture de fin de course mécanique', en: '110 V DC motor burnout or mechanical limit switch breakdown' },
        consequenceOnSystem: { fr: 'Impossibilité d\'exécuter le cycle de réenclenchement automatique (CO)', en: 'Breaker unable to complete automatic reclose cycle (CO)' },
        protectiveResponse: { fr: 'Émission de l\'alarme "Ressort non bandé" vers le système SCADA', en: 'Spring uncharged alarm sent to substation automation system' },
        severity: 'MAJOR'
      }
    ],
    effectsOfFailureSummary: {
      fr: 'En cas de blocage pour baisse de pression SF6, le disjoncteur ne peut plus être manœuvré sous peine d\'explosion interne.',
      en: 'Under low SF6 lockout, breaker cannot be tripped without severe risk of internal catastrophic explosion.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Haute tension 225 kV confinée', 'Gaz SF6 et sous-produits de décomposition toxiques (SOF2, HF)', 'Haute énergie mécanique des ressorts armés'],
      isolationProcedureLoto: {
        fr: 'Ouverture disjoncteur, ouverture et cadenassage des sectionneurs de barres, fermeture des sectionneurs de terre rapides des deux côtés, mise en sécurité du gaz.',
        en: 'Open breaker, open and lock out bus disconnectors, close maintenance earth switches on both sides, de-energize trip circuits.'
      },
      ppeRequirements: ['Casque de sécurité', 'Masque respiratoire avec cartouche anti-acide en cas d\'intervention sur compartiment ouvert', 'Gants nitrile']
    },

    maintenancePlan: [
      { type: 'CONDITION_BASED', periodicity: 'Continue', description: { fr: 'Télésurveillance de la pression SF6 et détection acoustique/UHF des décharges partielles', en: 'Continuous SF6 density telemetry and UHF online partial discharge acoustic monitoring' }, toolsAndStandards: ['Capteurs UHF intégrés', 'CIGRE TB 674'] },
      { type: 'PREVENTIVE', periodicity: 'Tous les 6 ans', description: { fr: 'Mesure de la pureté du gaz SF6 (% SF6, humidité ppm, acidité SO2) et temps de manœuvre des pôles', en: 'SF6 purity, moisture ppm, SO2 decomposition check, and breaker timing contact analysis' }, toolsAndStandards: ['Analyseur de gaz DILO', 'Chronomètre de disjoncteur TM1800'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essai de tenue à fréquence industrielle 460 kV sous gaz', 'Mesure des décharges partielles (< 5 pC à 1.2 Um)', 'Mesure de résistance de contact circuit principal (< 40 µΩ)'],
      siteAcceptanceTestsSat: ['Essai de tension appliquée sur site avec transformateur résonant', 'Contrôle d\'étanchéité au détecteur d\'hélium / laser infrarouge SF6'],
      commissioningProcedures: ['Essai de synchronisme des 3 pôles (< 2 ms)', 'Vérification complète des verrouillages logiques LCC et télécommandes GOOSE']
    },

    applicableStandards: [
      { standardCode: 'IEC 62271-203', title: 'Gas-insulated metal-enclosed switchgear for rated voltages above 52 kV', relevantClauses: ['Clause 6 (Type tests)', 'Clause 7 (Routine tests)'], jurisdiction: 'International' },
      { standardCode: 'IEC 62271-100', title: 'High-voltage switchgear - Alternating-current circuit-breakers', relevantClauses: ['Clause 6.102 (Making and breaking tests)'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-engineer', title: { fr: 'Ingénieur Postes Blindés', en: 'GIS Substation Engineer' }, tasks: { fr: 'Spécification de l\'appareillage GIS, réception usine (FAT) et coordination des essais de tension sur site', en: 'GIS layout engineering, FAT witnessing, and site resonant dielectric testing oversight' } }
    ],
    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Schéma d\'implantation GIS', 'Calcul de coordination d\'isolement', 'Bilan de gaz SF6'], involvedRoles: ['Ingénieur Poste'] }
    ],

    deliverablesAndDocuments: ['Plan d\'implantation travée GIS', 'Schéma des verrouillages électriques', 'Rapport de contrôle diélectrique sur site'],
    provenance: {
      id: 'prov-exp-gis-01',
      entity_id: 'eq-exp-gis-bay-225k',
      entity_type: 'equipment',
      source_ref: 'Spécifications techniques SONATREL GIS & IEC 62271-203',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Design Team',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Enveloppe étanche conçue pour un taux de fuite annuel garanti inférieur à 0.1%. Toute intervention sur compartiment de gaz nécessite une récupération préalable par groupe DILO.',
      en: 'Gas compartments guaranteed < 0.1% annual leakage rate. SF6 gas recovery requires dedicated gas cart before internal chamber opening.'
    },

    representations: {
      physical: {
        svgVariant: 'BREAKER',
        dimensionsLabel: '4.5 m × 1.8 m × 3.6 m',
        enclosureLabel: 'Enveloppe aluminium étanche SF6',
        maintenanceClearance: 'Couloir de manœuvre 2.5 m'
      },
      electrical: {
        symbolType: 'CIRCUIT_BREAKER_HV',
        incomerTerminal: 'Arrivée ligne 225 kV',
        outgoingTerminal: 'Jeu de barres 225 kV ou transformateur',
        protectionZone: 'Zone protégée jeu de barres / travée',
        measurementTap: 'Tores TC intégrés dans l\'enveloppe GIS'
      },
      functional: {
        inputSignal: 'Courant de ligne 225 kV + Signal de commande ouverture 110 V DC',
        conversionProcess: 'Extinction de l\'arc électrique par autosoufflage SF6 en moins de 40 ms',
        outputSignal: 'Circuit ouvert / isolé diélectriquement',
        feedbackLoop: 'Contacts auxiliaires de position et pressostat de densité SF6'
      }
    }
  },

  // 3. 225 kV CENTER-BREAK DISCONNECTOR WITH INTEGRATED EARTHING SWITCH (IEC 62271-102)
  {
    id: 'eq-exp-disconnector-225k',
    tagIec: '==E1.QB1',
    name: {
      fr: 'Sectionneur à Coupure Centrale 225 kV avec Sectionneur de Terre Rapide',
      en: '225 kV Center-Break Disconnector with Integrated High-Speed Earth Switch'
    },
    aliases: {
      fr: ['Sectionneur HTB 225 kV', 'Sectionneur de jeu de barres Q1/Q2', 'Sectionneur de ligne Q9', 'Sectionneur de terre Q8'],
      en: ['225 kV Center-Break Isolator', 'Busbar Disconnector', 'Line Disconnector Q9', 'Earth Knife Q8']
    },
    equipmentType: 'DisconnectorSwitch',
    category: 'SWITCHGEAR',
    parentDomain: 'D04',
    systemStage: 'SUBSTATIONS_NODES',
    subsystemContext: {
      fr: 'Plateforme haute tension extérieure de poste 225 kV à coupure dans l\'air (AIS) ou intérieur',
      en: 'Outdoor 225 kV air-insulated switchyard (AIS) or indoor switching bay'
    },
    technologyContext: {
      fr: 'Appareil électromécanique tripolaire à coupure centrale rotative horizontale sur colonnes isolantes en porcelaine/composite, motorisé en 230 V AC / 110 V DC avec verrouillage mécanique Castell',
      en: 'Three-phase electromechanical horizontal center-break disconnector on composite/porcelain post insulators, motorized 230V AC / 110V DC with Castell mechanical and electrical interlocks'
    },
    applicationContext: {
      fr: 'Création d\'une distance d\'isolement visible et vérifiable entre le disjoncteur 225 kV et le jeu de barres ou la ligne aérienne pour consignation et maintenance sécurisée (NF C 18-510)',
      en: 'Providing visible dielectric isolation gap between 225 kV circuit breaker and busbars or transmission line for safe Lock-Out/Tag-Out (LOTO) maintenance'
    },
    voltageContext: {
      nominalVoltage: '225 kV (Um = 245 kV)',
      level: 'HV',
      frequencyHz: 50,
      phases: '3-phase AC'
    },
    typicalLocation: {
      fr: 'Travées 225 kV d\'Oyomabang, Mangombé et Bekoko (adjacents au disjoncteur)',
      en: '225 kV bays at Oyomabang, Mangombé, and Bekoko substations (adjacent to circuit breaker)'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Appareil de connexion mécanique qui assure, en position d\'ouverture, une distance de sectionnement répondant à des exigences de sécurité spécifiées, capable d\'ouvrir ou de fermer un circuit lorsqu\'un courant d\'intensité négligeable est interrompu ou établi.',
      en: 'Mechanical switching device which provides, in the open position, an isolating distance satisfying specified safety requirements, capable of opening or closing a circuit only when negligible current is broken or made.'
    },
    purpose: {
      fr: 'Garantir la sécurité absolue des monteurs et exploitants en isolant visuellement les tronçons sous tension et en déchargeant les charges capacitives résiduelles via le couteau de terre.',
      en: 'Guarantee absolute safety of maintenance crews by visually isolating energized apparatus and discharging trapped electrostatic line charges via high-speed earth knives.'
    },
    engineeringProblemSolved: {
      fr: 'Empêche l\'amorçage diélectrique sur la distance d\'isolement même en cas de surtension de foudre (tenue de 1200 kV crête sur l\'intervalle contre 1050 kV à la terre, garantissant que tout amorçage se produit vers la terre et non à travers le sectionneur ouvert).',
      en: 'Prevents flashover across the open gap even under lightning impulses (gap BIL of 1200 kV peak vs 1050 kV to earth, ensuring flashover is directed to earth rather than across open contacts).'
    },

    primaryFunction: {
      fr: 'Isolement visible et consignation sécuritaire de travée haute tension 225 kV.',
      en: 'Visible isolation and safe de-energization lockout of 225 kV high-voltage bay.'
    },
    secondaryFunctions: {
      fr: ['Mise à la terre et en court-circuit de la ligne déconsignée via couteau Q8', 'Aiguillage sans coupure entre double jeu de barres (Barre 1 / Barre 2)', 'Signalisation de position ouverte/fermée redondante vers le SCADA'],
      en: ['Safety grounding and short-circuiting of de-energized circuits via Q8 knife', 'Busbar selection transfer between double busbar systems (Bus 1 / Bus 2)', 'Dual-channel position signaling to substation SCADA']
    },
    operatingPrincipleSummary: {
      fr: 'Les colonnes isolantes pivotent de 90° sous l\'action du servomoteur pour faire entrer en contact des mâchoires en cuivre argenté. L\'appareil ne possède aucun pouvoir de coupure d\'arc et ne doit jamais être manœuvré en charge.',
      en: 'Rotating post insulators swing 90° driven by an electric motor actuator to engage silver-plated copper contact fingers. The device has no arc-breaking capability and must never be operated under load.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Vérification du Courant Nul (I = 0)', en: 'Zero Current Interlock Check' },
        description: { fr: 'L\'interverrouillage électrique vérifie que le disjoncteur associé Q0 est préalablement ouvert avant d\'autoriser la commande motrice.', en: 'Electrical interlock confirms associated circuit breaker Q0 is fully open prior to releasing motor drive circuit.' },
        physicalPhenomenon: { fr: 'Absence d\'arc de puissance lors de la séparation mécanique', en: 'Absence of power arc during mechanical contact parting' },
        keyVariable: 'Bus current I < 0.5 A (capacitive only)'
      },
      {
        stepNumber: 2,
        title: { fr: 'Rotation des Bras de Contact', en: 'Contact Arm Rotation' },
        description: { fr: 'Le servomoteur entraîne les tringleries qui font pivoter simultanément les colonnes rotatives des trois pôles en environ 10 à 12 secondes.', en: 'Motor drive turns crank mechanism rotating post insulators of all 3 phases synchronously over 10 to 12 seconds.' },
        physicalPhenomenon: { fr: 'Ouverture symétrique à coupure centrale réduisant l\'encombrement longitudinal', en: 'Symmetrical center-break motion minimizing horizontal bay clearance' },
        keyVariable: 'Stroke time = 12 s, motor supply 230 V AC'
      },
      {
        stepNumber: 3,
        title: { fr: 'Verrouillage de Fin de Course & Verrou Terre', en: 'End-Position Latch & Earthing Interlock' },
        description: { fr: 'En position ouverte complète, les contacts auxiliaires confirment l\'état et déverrouillent la serrure Castell autorisant la fermeture du sectionneur de terre Q8.', en: 'Auxiliary limit switches confirm open status and mechanically release Castell key allowing earth switch Q8 operation.' },
        physicalPhenomenon: { fr: 'Distance d\'isolement géométrique visible dans l\'air libre (d > 2.5 m)', en: 'Visible air clearance distance (d > 2.5 m) rated for 1200 kV BIL' },
        keyVariable: 'Gap clearance > 2500 mm'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Appareillage extérieur ouvert sur châssis en acier galvanisé à chaud avec colonnes isolantes en silicone hydrophobe',
      dimensionsApproxMeters: 'L 3.8 m × l 1.2 m × H 4.2 m par phase',
      weightApproxKg: 1850,
      mounting: { fr: 'Fixé sur charpente métallique tubulaire supportée par massifs béton', en: 'Mounted on hot-dip galvanized lattice steel frame on concrete foundations' },
      environmentalClearances: { fr: 'Distance phase-phase 3.5 m, hauteur minimale sous pièces nues 5.2 m au-dessus du sol', en: 'Phase-to-phase distance 3.5 m, live part clearance 5.2 m above ground' }
    },
    mainComponents: [
      { id: 'ds-contacts', name: { fr: 'Mâchoires et doigts de contact argentés', en: 'Silver-plated copper contact fingers' }, function: { fr: 'Assure le passage du courant permanent de 3150 A sans échauffement', en: 'Carries continuous 3150 A current without overheating' }, materialOrTechnology: 'Cuivre électrolytique argenté 20 µm sous ressorts acier inox', criticality: 'CRITICAL' },
      { id: 'ds-insulator', name: { fr: 'Colonnes isolantes rotatives HT', en: 'Rotating post insulators' }, function: { fr: 'Assure l\'isolation diélectrique 245 kV et transmet le couple mécanique', en: 'Provides 245 kV dielectric insulation and transmits mechanical torque' }, materialOrTechnology: 'Isolateurs en résine composite silicone hydrophobe', criticality: 'CRITICAL' },
      { id: 'ds-earth', name: { fr: 'Couteau de mise à la terre intégré Q8', en: 'Integrated earthing blade Q8' }, function: { fr: 'Mise à la terre directe de la ligne déconnectée', en: 'Direct earthing of disconnected line circuit' }, materialOrTechnology: 'Tube d\'aluminium haute conductivité', criticality: 'HIGH' },
      { id: 'ds-motor', name: { fr: 'Coffret de commande motorisé avec manivelle de secours', en: 'Motor mechanism cubicle with manual emergency crank' }, function: { fr: 'Actionne l\'ouverture et fermeture électriquement ou manuellement', en: 'Drives open and close sequence electrically or manually' }, materialOrTechnology: 'IP55 acier inoxydable avec chauffage anti-condensation', criticality: 'HIGH' }
    ],

    energyOrSignalFlow: {
      fr: 'Jeu de barres 225 kV → Contacts sectionneur Q1/Q2 → Disjoncteur Q0 → Sectionneur ligne Q9 → Départ ligne 225 kV',
      en: '225 kV Busbar → Disconnector contacts Q1/Q2 → Circuit breaker Q0 → Line disconnector Q9 → 225 kV Line'
    },
    electricalRole: {
      fr: 'Assure la continuité galvanique en service nominal et la coupure visible en consignation',
      en: 'Guarantees low-resistance galvanic continuity in service and visible isolation during outages'
    },
    thermalRole: {
      fr: 'Évacue par convection naturelle les pertes joules des contacts (résistance de contact < 30 µΩ)',
      en: 'Dissipates contact joule losses by natural convection (contact resistance < 30 µΩ)'
    },

    systemContextDescription: {
      fr: 'Organe de manœuvre et d\'isolement situé de part et d\'autre de chaque disjoncteur 225 kV sur les départs lignes et transformateurs.',
      en: 'Switching and isolating apparatus flanking each 225 kV circuit breaker on feeder and transformer bays.'
    },
    upstreamEquipmentIds: ['eq-exp-tower-225kv'],
    downstreamEquipmentIds: ['eq-exp-gis-bay-225k'],
    relationships: [
      {
        id: 'rel-ds-cb',
        targetEquipmentId: 'eq-exp-gis-bay-225k',
        targetName: { fr: 'Disjoncteur SF6 225 kV Q0', en: '225 kV SF6 Circuit Breaker Q0' },
        targetCategory: 'SWITCHGEAR',
        relationKind: 'CONTROLLED_BY' as any,
        description: { fr: 'Interverrouillé électriquement et mécaniquement avec le disjoncteur', en: 'Electrically and mechanically interlocked with circuit breaker' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['89 (Interrupteur/Sectionneur)', '50BF (Inhibition manœuvre sous courant)'],
      protectiveRelayIds: ['eq-exp-relay-ied-61850'],
      summary: {
        fr: 'Aucune fonction d\'automatisme de déclenchement; asservi aux sécurités de discordance de pôles et blocage par relais 50/51/87.',
        en: 'No tripping protection capability; interlocked with pole discrepancy logic and lockout contacts.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Contacts auxiliaires de position à double rupture (NO/NF)', 'Pressostat de fin de course mécanique', 'Capteur thermique infrarouge sans fil sur mâchoires'],
      instrumentTransformerIds: ['eq-exp-ct-225k'],
      measuredQuantities: ['Position ouverte/fermée', 'Courant absorbé par moteur (A)', 'Température des contacts (°C)']
    },
    controlAndAutomation: {
      localControls: { fr: 'Boutons Poussoirs Ouvrir/Fermer dans coffret d\'armoire + Commutateur Local/Distance + Prise pour manivelle manuelle cadenassable', en: 'Local Open/Close pushbuttons, Local/Remote key switch, and padlocked manual crank socket' },
      remoteControls: { fr: 'Télécommande d\'ouverture et fermeture depuis le Dispatching SONATREL via SCADA', en: 'Remote open/close commands issued from SONATREL Central Dispatch via SCADA' },
      interlocks: { fr: 'Verrouillage électrique strict CEI 62271-102 interdisant la manœuvre si le disjoncteur Q0 est fermé ou si le sectionneur de terre Q8 est fermé', en: 'Strict CEI 62271-102 electrical interlocking preventing operation if breaker Q0 or earth switch Q8 is closed' }
    },
    communicationProtocols: ['IEC 61850-8-1 (GOOSE status)', 'IEC 60870-5-104 (Téléconduite dispatching)'],

    earthingAndBonding: {
      earthingRegime: 'Solid',
      connectionMethod: {
        fr: 'Châssis acier galvanisé et tresse cuivre étamé 95 mm² reliés en deux points au réseau de terre en cuivre nu enfoui 50 cm',
        en: 'Galvanized steel frame and 95 mm² tinned copper braid grounded at two points to buried substation earth mesh'
      },
      dischargeCapability: {
        fr: 'Couteau de terre Q8 avec tresse souple capable d\'écouler 40 kA / 1 s vers le réseau de terre principal',
        en: 'Integrated Q8 earthing switch capable of carrying 40 kA / 1 s short-circuit to main grounding grid'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Air',
      bilRatingKv: 1050,
      creepageDistanceMmPerKv: 31,
      phaseClearanceMeters: '3.0 m (phase-phase) / 2.2 m (phase-terre)'
    },
    connectionRequirements: {
      electrical: { fr: 'Plages de raccordement plates en aluminium 200x200 mm 4 trous', en: '200x200 mm 4-hole flat aluminum terminal pads' },
      mechanical: { fr: 'Fixation sur charpente métallique tubulaire galvanisée', en: 'Bolted to galvanized steel support structure' },
      cableOrBusbar: { fr: 'Conducteur tubulaire aluminium ou câble Almelec 570 mm²', en: 'Tubular aluminum bus or 570 mm² Almelec conductor' },
      earthing: { fr: 'Tresse cuivre étamé 95 mm² reliée au ceinturage de terre', en: '95 mm² tinned copper braid connected to ground mesh' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '-5°C à 50°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'IEC 60815 Class d (Heavy/Saline)',
      indoorOutdoor: 'OUTDOOR'
    },
    effectsOfFailureSummary: {
      fr: 'En cas de blocage en cours de manœuvre, asymétrie de tension et risque d\'amorçage d\'arc à l\'air libre.',
      en: 'In case of stuck contacts during operation, severe voltage unbalance and risk of phase flashover in open yard.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Haute tension 225 kV aérienne', 'Risque de pincement mécanique par les bielles de commande', 'Risque de chute de hauteur lors de la révision des contacts'],
      isolationProcedureLoto: {
        fr: 'Consignation selon NF C 18-510 : ouverture préalable du disjoncteur Q0, ouverture du sectionneur, verrouillage par cadenas sur coffret mécanique, vérification d\'absence de tension (VAT) et fermeture du couteau de terre Q8.',
        en: 'LOTO procedure: verify breaker Q0 is open, open disconnector, padlock motor mechanism, perform voltage absence testing (VAT) and close Q8 earthing blades.'
      },
      ppeRequirements: ['Casque isolant avec visière anti-arc', 'Chaussures de sécurité diélectriques', 'Gants isolants Classe 4 (36 kV)']
    },

    keyEngineeringValues: [
      { key: 'Ur', label: { fr: 'Tension assignée', en: 'Rated voltage' }, value: 245, unit: 'kV', status: 'VERIFIED' },
      { key: 'Ir', label: { fr: 'Courant continu assigné', en: 'Rated normal current' }, value: 3150, unit: 'A', status: 'VERIFIED' },
      { key: 'Ik', label: { fr: 'Courant de courte durée admissible (3s)', en: 'Rated short-time withstand current (3s)' }, value: 40, unit: 'kA', status: 'VERIFIED' },
      { key: 'Ip', label: { fr: 'Courant de crête admissible', en: 'Rated peak withstand current' }, value: 100, unit: 'kA', status: 'VERIFIED' },
      { key: 'BIL_earth', label: { fr: 'Niveau d\'isolement à la foudre (Terre)', en: 'Lightning impulse withstand to earth' }, value: 1050, unit: 'kV crête', status: 'VERIFIED' },
      { key: 'BIL_gap', label: { fr: 'Niveau d\'isolement sur la coupure', en: 'Lightning impulse across isolating distance' }, value: 1200, unit: 'kV crête', status: 'VERIFIED' },
      { key: 'R_contact', label: { fr: 'Résistance de contact', en: 'Contact path resistance' }, value: 28, unit: 'µΩ', status: 'VERIFIED' }
    ],

    availableStates: ['CLOSED', 'OPEN', 'EARTHED', 'ISOLATED', 'UNDER_MAINTENANCE', 'LOCAL_CONTROL', 'REMOTE_CONTROL'],
    defaultState: 'CLOSED',

    failureModes: [
      {
        code: 'FM-DS-01',
        name: { fr: 'Discordance de pôles (un pôle bloqué à mi-course)', en: 'Pole discrepancy (one pole stuck mid-travel)' },
        rootCause: { fr: 'Grippage de tringlerie mécanique par corrosion atmosphérique ou défaillance biellette', en: 'Linkage binding due to atmospheric corrosion or drive crank shearing' },
        consequenceOnSystem: { fr: 'Asymétrie de tension sur le réseau 225 kV et déclenchement par protection de discordance (ANSI 62PD)', en: 'Voltage unbalance on 225 kV grid and trip commanded by pole discrepancy timer (62PD)' },
        protectiveResponse: { fr: 'Relais temporisé de discordance 62PD (2.5 s) déclenchant le disjoncteur et graissage semestriel', en: '62PD pole discrepancy timer (2.5 s) triggering breaker trip; bi-annual lubrication' },
        severity: 'CRITICAL'
      },
      {
        code: 'FM-DS-02',
        name: { fr: 'Échauffement anormal des mâchoires de contact (> 90°C)', en: 'Thermal runaway on contact fingers (> 90°C)' },
        rootCause: { fr: 'Affaiblissement des ressorts de pression ou oxydation de la couche d\'argenture', en: 'Fatigue of stainless spring clips or oxidation of silver coating' },
        consequenceOnSystem: { fr: 'Fusion locale du cuivre, dégradation des isolateurs et risque d\'amorçage phase-terre', en: 'Localized copper melting, insulator degradation, risk of phase-to-ground arc' },
        protectiveResponse: { fr: 'Contrôle thermographique infrarouge périodique et mesure micro-ohmmétrique (DLRO)', en: 'Periodic infrared thermography and micro-ohmmeter contact resistance measurement (DLRO)' },
        severity: 'MAJOR'
      }
    ],

    maintenancePlan: [
      { type: 'PREVENTIVE', periodicity: 'Semestrielle', description: { fr: 'Thermographie infrarouge en charge et contrôle visuel des contacts', en: 'On-load infrared thermography and visual inspection of contact alignment' }, toolsAndStandards: ['Caméra IR Fluke', 'IEC 62271-102'] },
      { type: 'PREVENTIVE', periodicity: '24 mois', description: { fr: 'Nettoyage des colonnes isolantes, graissage des paliers et mesure DLRO de la résistance de contact', en: 'Insulator cleaning, pivot greasing and micro-ohmmeter contact resistance measurement' }, toolsAndStandards: ['DLRO 100A', 'Graisse conductrice'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Essai d\'échauffement à 3150 A', 'Essai de tenue aux chocs de foudre (1050 kV / 1200 kV)', 'Contrôle d\'endurance mécanique 2000 cycles'],
      siteAcceptanceTestsSat: ['Mesure de résistance de contact (Micro-ohmmètre)', 'Essais de fonctionnement des verrouillages mécaniques et électriques', 'Vérification du synchronisme des 3 pôles (< 50 ms)'],
      commissioningProcedures: ['Contrôle d\'alignement et pénétration des couteaux', 'Validation des retours d\'information vers le SCADA SONATREL']
    },

    applicableStandards: [
      { standardCode: 'IEC 62271-102', title: 'High-voltage switchgear - Alternating current disconnectors and earthing switches', relevantClauses: ['Clause 6.101', 'Clause 6.105', 'Clause 7.101'], jurisdiction: 'International' },
      { standardCode: 'IEC 62271-1', title: 'Common specifications for high-voltage switchgear and controlgear', relevantClauses: ['Clause 6.2'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-commissioning-lead', title: { fr: 'Ingénieur d\'Essais et Mise en Service Poste', en: 'Substation Commissioning Lead' }, tasks: { fr: 'Vérification des verrouillages électriques et cinématique des couteaux 225 kV', en: 'Interlock verification and 225 kV disconnect blade stroke timing validation' } }
    ],
    lifecyclePhases: [
      { phase: 'COMMISSIONING', deliverables: ['PV d\'alignement mécanique', 'Rapport d\'essais DLRO', 'Fiche de consignation LOTO'], involvedRoles: ['Ingénieur Essais'] }
    ],

    deliverablesAndDocuments: ['Plan de génie civil et réaction aux massifs', 'Schéma unifilaire et logique des verrouillages', 'PV de contrôle micro-ohmmétrique SAT'],
    provenance: {
      id: 'prov-exp-ds-01',
      entity_id: 'eq-exp-disconnector-225k',
      entity_type: 'equipment',
      source_ref: 'Spécifications techniques SONATREL Sectionneurs HTB & IEC 62271-102',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Engineering Group',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'Appareil strictement dépourvu de chambre de coupure; toute ouverture sous courant supérieur à 0.5 A entraîne un arc libre destructeur et un amorçage phase-terre immédiat.',
      en: 'Device is strictly off-load; any contact separation carrying load current > 0.5 A results in destructive open-air flashover.'
    },

    representations: {
      physical: {
        svgVariant: 'DISCONNECTOR',
        dimensionsLabel: '3.8 m × 1.2 m × 4.2 m',
        enclosureLabel: 'Ouvert extérieur AIS',
        maintenanceClearance: 'Périmètre de sécurité 3.5 m'
      },
      electrical: {
        symbolType: 'DISCONNECTOR_HV',
        incomerTerminal: 'Arrivée ligne 225 kV ou barres',
        outgoingTerminal: 'Disjoncteur 225 kV Q0',
        protectionZone: 'Zone d\'isolement travée',
        measurementTap: 'Contacts auxiliaires de position'
      },
      functional: {
        inputSignal: 'Ordre de manœuvre motorisée 230 V AC',
        conversionProcess: 'Rotation mécanique des colonnes et engagement des couteaux',
        outputSignal: 'Continuité galvanique établie ou coupure diélectrique visible',
        feedbackLoop: 'Contacts auxiliaires NO/NF et serrure Castell de consignation'
      }
    }
  },

  // 4. 225 kV GAPLESS ZINC-OXIDE (ZnO) SURGE ARRESTER (IEC 60099-4)
  {
    id: 'eq-exp-surge-arrester-225k',
    tagIec: '==E1.F1',
    name: {
      fr: 'Parafoudre à Oxyde de Zinc (ZnO) 225 kV de Classe Station sans Éclateur',
      en: '225 kV Gapless Zinc-Oxide (ZnO) Station-Class Surge Arrester'
    },
    aliases: {
      fr: ['Parafoudre HTB 225 kV', 'Écrêteur de surtension ZnO', 'Parafoudre de ligne / transformateur', 'Parafoudre F1'],
      en: ['225 kV Metal-Oxide Surge Arrester', 'Station Arrester 225 kV', 'ZnO Surge Diverter', 'Lightning Arrester F1']
    },
    equipmentType: 'SurgeArrester',
    category: 'AUXILIARY_AND_SAFETY',
    parentDomain: 'D04',
    systemStage: 'SUBSTATIONS_NODES',
    subsystemContext: {
      fr: 'Tête de ligne d\'arrivée 225 kV et bornes haute tension des transformateurs de puissance',
      en: '225 kV overhead line entrance and power transformer HV terminal bushings'
    },
    technologyContext: {
      fr: 'Colonne d\'empilement de pastilles varistances en oxyde de zinc (ZnO) fritté à caractéristique tension-courant hautement non linéaire, sous enveloppe composite silicone avec compteur de décharges et ampèremètre de fuite de fuite continue',
      en: 'Stack of highly non-linear sintered Zinc Oxide (ZnO) ceramic varistor blocks housed in hydrophobic silicone composite insulator with surge counter and continuous leakage current milliammeter'
    },
    applicationContext: {
      fr: 'Protection de l\'isolation diélectrique des transformateurs et appareillages du poste contre les ondes de surtension d\'origine atmosphérique (foudre) et de manœuvre (découplage ligne à vide)',
      en: 'Protecting transformer winding insulation and substation apparatus against atmospheric lightning surges and high-frequency switching transients'
    },
    voltageContext: {
      nominalVoltage: '225 kV (Ur = 198 kV rms, Uc = 158 kV rms)',
      level: 'HV',
      frequencyHz: 50,
      phases: 'Single-phase column (3 units per bank)'
    },
    typicalLocation: {
      fr: 'Directement devant les traversées 225 kV du transformateur et à l\'arrivée des lignes Songloulou/Mangombé',
      en: 'Directly at 225 kV transformer bushings and overhead line entry gantries at Songloulou/Mangombé'
    },
    verificationStatus: 'verified',

    definition: {
      fr: 'Appareil conçu pour protéger le matériel électrique contre les surtensions transitoires élevées et pour limiter la durée et l\'amplitude du courant de suite, composé de varistances ZnO sans aucun éclateur en série.',
      en: 'Device designed to protect electrical apparatus from high transient overvoltages and limit duration and amplitude of follow current, utilizing gapless metal-oxide varistor blocks.'
    },
    purpose: {
      fr: 'Écrêter instantanément la tension aux bornes des appareils sous le niveau d\'isolement de base (BIL = 1050 kV) en dérivant l\'énergie de l\'onde de choc vers le réseau de terre.',
      en: 'Instantly clamp surge voltage across critical equipment below Basic Lightning Impulse Insulation Level (BIL = 1050 kV) by safely discharging surge energy to the grounding mesh.'
    },
    engineeringProblemSolved: {
      fr: 'Supprime le risque de claquage perforant des enroulements de transformateur sous l\'impact des coups de foudre directs ou induits très fréquents au Cameroun (niveau kéraunique Nk > 120 jours d\'orage/an).',
      en: 'Eliminates fatal transformer winding punctures from direct lightning strikes in Cameroon\'s severe thunderstorm corridors (keraunic level Nk > 120 storm days/year).'
    },

    primaryFunction: {
      fr: 'Limitation des surtensions transitoires et dérivation du courant de foudre à la terre.',
      en: 'Transient overvoltage clamping and diversion of lightning surge currents to earth.'
    },
    secondaryFunctions: {
      fr: ['Comptage des événements de décharge de foudre', 'Surveillance en temps réel du courant de fuite résistif pour détection du vieillissement', 'Dissipation de l\'énergie des manœuvres de lignes longues 225 kV'],
      en: ['Surge discharge event counting', 'Real-time resistive leakage current monitoring for aging assessment', 'Dissipating switching surge energy from long 225 kV line de-energization']
    },
    operatingPrincipleSummary: {
      fr: 'À la tension nominale, les joints de grains ZnO ont une résistance de plusieurs mégohms (courant de fuite < 1 mA). Dès qu\'une surtension dépasse le seuil, la résistance s\'effondre à quelques milliohms par effet tunnel quantique, écoulant des milliers d\'ampères vers la terre.',
      en: 'At operating voltage, ZnO grain boundaries exhibit mega-ohm resistance (< 1 mA leakage). When a surge exceeds threshold voltage, quantum tunneling causes resistance to drop to milliohms within nanoseconds, shunting thousands of surge amperes to ground.'
    },
    workingPrincipleSequence: [
      {
        stepNumber: 1,
        title: { fr: 'Veille Permanente (Tension Nominale)', en: 'Quiescent Standby (Continuous Voltage)' },
        description: { fr: 'Sous 225 kV réseau, le parafoudre se comporte comme un isolateur parfait avec seulement quelques microampères de courant de fuite résistif.', en: 'Under normal 225 kV voltage, the arrester behaves as an open circuit with only microamperes of resistive leakage.' },
        physicalPhenomenon: { fr: 'Barrière de potentiel Schottky aux joints de grains ZnO', en: 'Schottky potential barrier at ZnO microcrystalline grain boundaries' },
        keyVariable: 'Continuous operating voltage Uc = 158 kV rms, I_leak < 1.2 mA'
      },
      {
        stepNumber: 2,
        title: { fr: 'Écrêtage Ultra-Rapide (< 50 ns)', en: 'Ultra-Fast Surge Clamping (< 50 ns)' },
        description: { fr: 'L\'onde de foudre frappe la ligne; la tension monte à plus de 1500 kV/µs. Les pastilles ZnO commutent instantanément en régime conducteur.', en: 'Lightning stroke hits transmission line; steep wave front (> 1500 kV/µs) triggers instantaneous conduction in ZnO blocks.' },
        physicalPhenomenon: { fr: 'Effet tunnel quantique à travers les barrières de potentiel minces (10 nm)', en: 'Quantum tunneling collapse across 10 nm grain boundary depletion layers' },
        keyVariable: 'Residual voltage Upl < 520 kV at 10 kA (8/20 µs wave)'
      },
      {
        stepNumber: 3,
        title: { fr: 'Extinction Automatique & Rétablissement', en: 'Self-Extinction & Dielectric Reset' },
        description: { fr: 'Dès que l\'onde s\'éteint, la tension redescend sous le seuil et le parafoudre redevient isolant sans créer de courant de suite du réseau.', en: 'As transient surge decays, voltage drops below threshold and ZnO varistors immediately restore insulator state without mains follow-current.' },
        physicalPhenomenon: { fr: 'Rétablissement thermique et diélectrique sans arc électrique', en: 'Arc-free thermal and dielectric recovery' },
        keyVariable: 'Energy absorption capacity = 8.5 kJ/kV (Discharge Class 4)'
      }
    ],

    physicalConstruction: {
      enclosureType: 'Colonne étanche monobloc en élastomère de silicone hydrophobe moulé directement sur les varistors avec disque de surpression de sécurité',
      dimensionsApproxMeters: 'Diamètre 0.35 m × Hauteur 2.65 m',
      weightApproxKg: 145,
      mounting: { fr: 'Monté sur isolateurs de base isolés du sol pour insertion du compteur de décharge et shunt de mesure', en: 'Mounted on base insulating feet to isolate baseplate for surge counter and leakage ammeter' },
      environmentalClearances: { fr: 'Ligne de fuite spécifique de 31 mm/kV (très forte pollution marine et industrielle)', en: 'Specific creepage distance 31 mm/kV (Class E very heavy marine and industrial pollution)' }
    },
    mainComponents: [
      { id: 'sa-blocks', name: { fr: 'Empilement de pastilles ZnO dopées au Bi₂O₃/Sb₂O₃', en: 'Sintered Zinc Oxide varistor block stack' }, function: { fr: 'Absorbe l\'énergie de surtension et limite la tension résiduelle', en: 'Absorbs surge energy and clamps residual voltage' }, materialOrTechnology: 'Céramique frittée non linéaire 90% ZnO + oxydes de bismuth et cobalt', criticality: 'CRITICAL' },
      { id: 'sa-sheds', name: { fr: 'Enveloppe à ailettes en caoutchouc silicone (SIR)', en: 'Silicone rubber (SIR) outer shed housing' }, function: { fr: 'Assure l\'étanchéité et prévient le contournement par pollution humide', en: 'Provides hermetic seal and prevents flashover under tropical wet conditions' }, materialOrTechnology: 'Silicone hydrophobe vulcanisé haute température', criticality: 'CRITICAL' },
      { id: 'sa-counter', name: { fr: 'Compteur de décharges et milliammètre de fuite', en: 'Surge event counter and analog leakage milliammeter' }, function: { fr: 'Enregistre chaque impulsion et mesure l\'état de vieillissement diélectrique', en: 'Logs each lightning hit and monitors health condition' }, materialOrTechnology: 'Boîtier métallique hermétique IP67 avec affichage mécanique', criticality: 'MEDIUM' },
      { id: 'sa-vent', name: { fr: 'Dispositif de limitation de pression avec évent directionnel', en: 'Directional pressure-relief venting diaphragm' }, function: { fr: 'Évacue les gaz en cas de défaut interne sans projection dangereuse d\'éclats', en: 'Vents internal overpressure safely preventing explosive shatter' }, materialOrTechnology: 'Membrane en acier inox tarée à 1.5 bar', criticality: 'CRITICAL' }
    ],

    energyOrSignalFlow: {
      fr: 'Onde de surtension foudre 225 kV → Borne supérieure parafoudre → Pastilles ZnO → Câble de terre isolé → Compteur de décharges → Réseau de terre général',
      en: '225 kV Lightning surge → Top terminal → ZnO varistor column → Insulated earthing lead → Surge counter → Substation ground mesh'
    },
    electricalRole: {
      fr: 'Protection parafoudre de classe station 225 kV assurant la coordination d\'isolement du poste',
      en: 'Station-class 225 kV surge protective device coordinating insulation levels'
    },
    thermalRole: {
      fr: 'Doit dissiper l\'échauffement adiabatic provoqué par les chocs successifs de foudre sans emballement thermique',
      en: 'Dissipates adiabatic heating generated by repetitive lightning impulses without thermal runaway'
    },

    systemContextDescription: {
      fr: 'Premier équipement rencontré par les lignes aériennes à l\'entrée du poste 225 kV et dernier rempart protégeant le transformateur de puissance.',
      en: 'Frontline protection at transmission line entries and ultimate protective barrier at power transformer bushings.'
    },
    upstreamEquipmentIds: ['eq-exp-tower-225kv'],
    downstreamEquipmentIds: ['eq-exp-disconnector-225k', 'eq-exp-sub-trafo-225-30'],
    relationships: [
      {
        id: 'rel-sa-trafo',
        targetEquipmentId: 'eq-exp-sub-trafo-225-30',
        targetName: { fr: 'Transformateur Réseau 225/30 kV', en: '225/30 kV Substation Transformer' },
        targetCategory: 'TRANSFORMER',
        relationKind: 'PROTECTED_BY' as any,
        description: { fr: 'Protège les enroulements haute tension contre le claquage par foudre', en: 'Shields high-voltage windings from catastrophic lightning impulse puncture' }
      }
    ],

    associatedProtection: {
      ansiCodes: ['Surge Arrester Protection (Zone d\'immunité diélectrique)'],
      protectiveRelayIds: ['eq-exp-relay-ied-61850'],
      summary: {
        fr: 'Appareil autonome passif réagissant en nanosecondes sans aucun relais ni source auxiliaire.',
        en: 'Self-operating passive apparatus acting in nanoseconds without protective relays or external auxiliary supplies.'
      }
    },
    measurementAndInstrumentation: {
      sensors: ['Milliammètre analogique de courant de fuite total (0-5 mA)', 'Compteur électromécanique d\'impulsions de décharge', 'Sonde de détection de composante harmonique 3'],
      instrumentTransformerIds: ['eq-exp-ct-225k'],
      measuredQuantities: ['Courant de fuite résistif (µA)', 'Nombre de coups de foudre écoulés']
    },
    controlAndAutomation: {
      localControls: { fr: 'Cadran de lecture visuelle du compteur et du courant de fuite au pied de l\'appareil', en: 'Visual readout dial of surge counter and leakage current indicator at base' },
      remoteControls: { fr: 'Capteur numérique sans fil optionnel transmettant le courant de fuite au SCADA', en: 'Optional wireless IoT sensor broadcasting resistive leakage data to SCADA' },
      interlocks: { fr: 'Aucun interverrouillage (appareil passif connecté en permanence en parallèle)', en: 'None (passive device continuously connected in parallel to line)' }
    },
    communicationProtocols: ['Analog 4-20 mA / LoRaWAN (surveillance d\'état moderne)'],

    earthingAndBonding: {
      earthingRegime: 'Solid',
      connectionMethod: {
        fr: 'Raccordement direct et ultra-court au réseau de terre en cuivre nu pour minimiser l\'inductance parasite L·di/dt',
        en: 'Ultra-short and direct grounding lead connection to substation grid minimizing inductive L·di/dt voltage spike'
      },
      dischargeCapability: {
        fr: 'Capacité d\'écoulement nominale de 20 kA (onde 8/20 µs) et 100 kA (onde de foudre maximale)',
        en: 'Nominal discharge capability of 20 kA (8/20 µs wave) and 100 kA maximum lightning impulse'
      }
    },
    insulationAndClearances: {
      insulationMedium: 'Silicone Composite / Metal-Oxide Varistors',
      bilRatingKv: 1050,
      creepageDistanceMmPerKv: 31,
      phaseClearanceMeters: '2.5 m (phase-terre)'
    },
    connectionRequirements: {
      electrical: { fr: 'Borne supérieure NEMA 4 trous pour raccordement direct conducteur 225 kV', en: 'Top NEMA 4-hole pad for direct 225 kV line/bushing conductor' },
      mechanical: { fr: 'Embase isolante sur massif béton avec support parafoudre', en: 'Insulating sub-base on concrete foundation support' },
      cableOrBusbar: { fr: 'Câble Almelec ou tresse souple sans contrainte mécanique', en: 'Flexible Almelec jumper without cantilever stress' },
      earthing: { fr: 'Câble cuivre isolé 50 mm² traversant le compteur de décharges', en: '50 mm² insulated copper lead routed through surge counter' }
    },
    installationEnvironment: {
      ambientTemperatureRange: '-5°C à 50°C',
      altitudeLimitM: 1000,
      pollutionLevel: 'IEC 60815 Class d (Heavy / Tropical Marine)',
      indoorOutdoor: 'OUTDOOR'
    },
    effectsOfFailureSummary: {
      fr: 'En cas d\'emballement thermique des varistances ZnO, court-circuit franc phase-terre nécessitant l\'ouverture immédiate du disjoncteur de travée.',
      en: 'Under ZnO varistor thermal runaway, bolted phase-to-ground fault requiring immediate tripping of upstream bay circuit breaker.'
    },
    safetyAndHazards: {
      isSafetyCritical: true,
      hazards: ['Haute tension 225 kV permanente', 'Risque d\'éclatement sous surpression interne en cas de court-circuit prolongé', 'Charges capacitives résiduelles'],
      isolationProcedureLoto: {
        fr: 'Consignation selon NF C 18-510 : ouverture disjoncteur et sectionneur amont, vérification d\'absence de tension (VAT) et pose de perches de mise à la terre et en court-circuit (MALT/CC) avant tout contact.',
        en: 'LOTO procedure: open upstream circuit breaker and disconnector, verify voltage absence, and apply portable grounding clusters prior to physical touch.'
      },
      ppeRequirements: ['Casque de sécurité avec visière de protection', 'Gants de manœuvre HT', 'Chaussures de sécurité diélectriques']
    },

    keyEngineeringValues: [
      { key: 'Ur', label: { fr: 'Tension assignée', en: 'Rated voltage' }, value: 198, unit: 'kV rms', status: 'VERIFIED' },
      { key: 'Uc', label: { fr: 'Tension continue de service', en: 'Continuous operating voltage' }, value: 158, unit: 'kV rms', status: 'VERIFIED' },
      { key: 'In_discharge', label: { fr: 'Courant nominal de décharge (8/20 µs)', en: 'Nominal discharge current (8/20 µs)' }, value: 20, unit: 'kA', status: 'VERIFIED' },
      { key: 'Upl', label: { fr: 'Tension résiduelle à 10 kA (foudre)', en: 'Residual voltage at 10 kA lightning' }, value: 495, unit: 'kV crête', status: 'VERIFIED' },
      { key: 'Ups', label: { fr: 'Tension résiduelle à 1 kA (manœuvre)', en: 'Residual voltage at 1 kA switching' }, value: 410, unit: 'kV crête', status: 'VERIFIED' },
      { key: 'Energy_cap', label: { fr: 'Capacité thermique d\'absorption', en: 'Thermal energy absorption capacity' }, value: 8.5, unit: 'kJ/kV', status: 'VERIFIED' },
      { key: 'Creepage', label: { fr: 'Ligne de fuite spécifique', en: 'Specific creepage distance' }, value: 31, unit: 'mm/kV', status: 'VERIFIED' }
    ],

    availableStates: ['ENERGIZED', 'DE_ENERGIZED', 'ISOLATED', 'UNDER_MAINTENANCE'],
    defaultState: 'ENERGIZED',

    failureModes: [
      {
        code: 'FM-SA-01',
        name: { fr: 'Emballement thermique par vieillissement des varistances', en: 'Thermal runaway due to varistor block aging' },
        rootCause: { fr: 'Pénétration d\'humidité dans l\'enveloppe dégradant les joints de grains ZnO et augmentant le courant de fuite résistif', en: 'Moisture ingress degrading ZnO grain boundaries and elevating resistive leakage current' },
        consequenceOnSystem: { fr: 'Échauffement incontrôlable, claquage diélectrique complet et court-circuit phase-terre franc', en: 'Uncontrolled heating, catastrophic block breakdown and bolted phase-to-ground fault' },
        protectiveResponse: { fr: 'Surveillance trimestrielle du courant de fuite résistif et analyse des harmoniques 3 de courant', en: 'Quarterly monitoring of 3rd harmonic resistive leakage current with portable tester' },
        severity: 'CRITICAL'
      },
      {
        code: 'FM-SA-02',
        name: { fr: 'Contournement externe sous pollution saline ou poussière', en: 'External surface flashover under saline/dust pollution' },
        rootCause: { fr: 'Perte d\'hydrophobicité de la surface en silicone due aux UV tropicaux intenses et dépôts marins', en: 'Hydrophobicity loss from intense tropical UV and marine salt contamination' },
        consequenceOnSystem: { fr: 'Arc électrique externe contournant le parafoudre et déclenchant la protection de ligne', en: 'External flashover arc bypassing varistor column and tripping line breaker' },
        protectiveResponse: { fr: 'Ailettes en silicone hydrophobe à grande distance de fuite (> 7500 mm) et inspection visuelle annuelle', en: 'High-creepage silicone rubber sheds (> 7500 mm) and annual hydrophobicity spray testing' },
        severity: 'MAJOR'
      }
    ],

    maintenancePlan: [
      { type: 'CONDITION_BASED', periodicity: 'Trimestrielle', description: { fr: 'Relevé des compteurs de foudre et du courant de fuite total et résistif', en: 'Logging of surge counter hits and resistive leakage current via diagnostic probe' }, toolsAndStandards: ['Testeur de fuite ZnO', 'IEC 60099-4'] },
      { type: 'PREVENTIVE', periodicity: 'Semestrielle', description: { fr: 'Thermographie infrarouge de la colonne varistance sous tension', en: 'Infrared thermography of arrester column under operating voltage' }, toolsAndStandards: ['Caméra IR', 'CIGRE TB 441'] }
    ],
    testingAndCommissioning: {
      factoryTestsFat: ['Mesure de tension résiduelle à 10 kA et 20 kA', 'Essai de tenue à la décharge de ligne Classe 4', 'Essai d\'étanchéité sous hélium'],
      siteAcceptanceTestsSat: ['Mesure du courant de fuite résistif sous tension nominale', 'Mesure de résistance d\'isolement sous 5000 V DC', 'Contrôle de fonctionnement du compteur de décharges'],
      commissioningProcedures: ['Vérification de la connexion de terre ultra-courte sans boucle inductive', 'Relevé de l\'index initial du compteur de foudre']
    },

    applicableStandards: [
      { standardCode: 'IEC 60099-4', title: 'Metal-oxide surge arresters without gaps for AC systems', relevantClauses: ['Clause 8.3', 'Clause 8.4', 'Clause 8.6'], jurisdiction: 'International' },
      { standardCode: 'IEC 60071-1', title: 'Insulation co-ordination - Definitions, principles and rules', relevantClauses: ['Clause 5.3'], jurisdiction: 'International' }
    ],
    associatedEngineeringRoles: [
      { roleSlug: 'substation-insulation-expert', title: { fr: 'Expert Coordination d\'Isolement', en: 'Insulation Coordination Specialist' }, tasks: { fr: 'Dimensionnement des niveaux de protection Upl/Ups et vérification de la marge de sécurité transformateur', en: 'Surge arrester protective level sizing and transformer BIL safety margin verification' } }
    ],
    lifecyclePhases: [
      { phase: 'DESIGN_STUDIES', deliverables: ['Étude EMTP de surtension de foudre', 'Fiche technique parafoudre 225 kV'], involvedRoles: ['Ingénieur Études Réseau'] }
    ],

    deliverablesAndDocuments: ['Courbe caractéristique V-I des varistances', 'Calcul de coordination d\'isolement du poste', 'Rapport de mesure initiale du courant de fuite SAT'],
    provenance: {
      id: 'prov-exp-sa-01',
      entity_id: 'eq-exp-surge-arrester-225k',
      entity_type: 'equipment',
      source_ref: 'Norme SONATREL Parafoudres HTB & IEC 60099-4',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE High-Voltage Insulation Team',
      verified_at: '2026-09-01'
    },
    assumptionsAndLimitations: {
      fr: 'La distance entre le parafoudre et les traversées du transformateur doit être inférieure à 15 mètres pour éviter la réflexion d\'onde qui augmenterait la surtension au niveau des enroulements.',
      en: 'Lead distance between surge arrester and transformer bushings must be < 15 m to avoid wave reflections amplifying peak voltage at windings.'
    },

    representations: {
      physical: {
        svgVariant: 'ARRESTER',
        dimensionsLabel: '0.35 m × 2.65 m',
        enclosureLabel: 'Colonne silicone monobloc',
        maintenanceClearance: 'Distance de sécurité 2.5 m'
      },
      electrical: {
        symbolType: 'SURGE_ARRESTER',
        incomerTerminal: 'Connexion phase 225 kV',
        outgoingTerminal: 'Connexion terre de poste',
        protectionZone: 'Enceinte et bornes du transformateur',
        measurementTap: 'Compteur de choc et shunt de fuite'
      },
      functional: {
        inputSignal: 'Onde de surtension transitoire (kV)',
        conversionProcess: 'Conduction non linéaire ZnO et dissipation enthalpique',
        outputSignal: 'Courant de décharge à la terre (kA)',
        feedbackLoop: 'Compteur d\'impulsions et mesure courant de fuite'
      }
    }
  }
];

