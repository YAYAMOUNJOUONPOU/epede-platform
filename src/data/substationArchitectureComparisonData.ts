// src/data/substationArchitectureComparisonData.ts
// EPEDE - Master Dataset for Substation Architectures, Busbar Topologies & System Earthing Comparison
// Grounded in IEC 62271-203 (GIS), IEC 61936-1 (Power Installations), IEC 60071 (Insulation Coordination),
// NF C 13-200 / NF C 15-100 / IEEE 142 (Earthing Systems), and authentic Cameroon grid applications.

export interface SwitchgearTechnology {
  id: 'AIS' | 'GIS' | 'HYBRID_MTS';
  code: string;
  name_fr: string;
  name_en: string;
  insulationMedium_fr: string;
  insulationMedium_en: string;
  governingStandards: string[];
  footprintPerBay225kV_m2: number;
  relativeEquipmentCapex: number; // Normalized (AIS = 1.0)
  relativeCivilWorksCapex: number; // Normalized (AIS = 1.0)
  erectionTimeMonthsPerSubstation: number;
  maintenanceIntervalYears: number;
  mttrHours: number; // Mean Time To Repair
  annualFailureRatePerBay: number; // Major failures / bay-year per CIGRE
  environmentalImpactGwp: number; // Global Warming Potential of gas (SF6 = 24300, Air = 0)
  recommendedContext_fr: string;
  recommendedContext_en: string;
  limitations_fr: string;
  limitations_en: string;
  cameroonReferenceSubstations: string[];
  radarScores: {
    footprintCompactness: number; // 1-10
    initialCapexEconomy: number; // 1-10
    siteErectionSpeed: number; // 1-10
    environmentalHarshnessResistance: number; // 1-10
    personnelSafetyArcFlash: number; // 1-10
    repairEaseLocalAutonomy: number; // 1-10
    ecoFriendlinessGhg: number; // 1-10
  };
}

export interface BusbarTopology {
  id: 'SINGLE_BUS' | 'SECTIONALIZED_SINGLE_BUS' | 'DOUBLE_BUS_SINGLE_BREAKER' | 'BREAKER_AND_A_HALF' | 'RING_BUS';
  code: string;
  name_fr: string;
  name_en: string;
  relativeCostPerBay: number; // Normalized (Single Bus = 1.0)
  breakersPerCircuit: number; // e.g., 1, 1.5, 2
  disconnectorsPerCircuit: number;
  maintenanceFlexibility_fr: string;
  maintenanceFlexibility_en: string;
  faultBusbarConsequence_fr: string;
  faultBusbarConsequence_en: string;
  protectionComplexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  expansionEase_fr: string;
  expansionEase_en: string;
  recommendedVoltageLevels: string;
  typicalApplications_fr: string;
  typicalApplications_en: string;
  pros_fr: string[];
  pros_en: string[];
  cons_fr: string[];
  cons_en: string[];
  cameroonExamples: string[];
}

export interface SystemEarthingScheme {
  id: 'SOLID_GROUNDED' | 'RESISTANCE_GROUNDED' | 'ISOLATED_NEUTRAL' | 'RESONANT_PETERSEN' | 'TT_SCHEME';
  code: string;
  name_fr: string;
  name_en: string;
  voltageDomains: string;
  governingStandards: string[];
  singlePhaseFaultCurrentRange: string;
  temporaryOvervoltageFactorTov: string; // Fault factor k: <= 1.4 or >= 1.732
  serviceContinuityAtFirstFault_fr: string;
  serviceContinuityAtFirstFault_en: string;
  fireArcFlashRisk_fr: string;
  fireArcFlashRisk_en: string;
  protectiveRelays: string[]; // ANSI codes: 50N/51N, 59N, 67N, etc.
  cableInsulationRatingRequired: string;
  keyAdvantages_fr: string[];
  keyAdvantages_en: string[];
  keyDrawbacks_fr: string[];
  keyDrawbacks_en: string[];
  typicalUtilityIndustrialUse_fr: string;
  typicalUtilityIndustrialUse_en: string;
}

export const SWITCHGEAR_TECHNOLOGIES: SwitchgearTechnology[] = [
  {
    id: 'AIS',
    code: 'AIS_AIR',
    name_fr: 'Poste Ouvert Isolé dans l\'Air (AIS)',
    name_en: 'Air-Insulated Switchgear (AIS)',
    insulationMedium_fr: 'Air ambiant sous pression atmosphérique (distances d\'isolement dans l\'air)',
    insulationMedium_en: 'Ambient air at atmospheric pressure (phase-to-phase and phase-to-ground clearances)',
    governingStandards: ['IEC 61936-1', 'IEC 62271-1', 'IEC 60071-1', 'IEEE C37.30'],
    footprintPerBay225kV_m2: 1200,
    relativeEquipmentCapex: 1.0,
    relativeCivilWorksCapex: 1.0,
    erectionTimeMonthsPerSubstation: 14,
    maintenanceIntervalYears: 3,
    mttrHours: 12,
    annualFailureRatePerBay: 0.025,
    environmentalImpactGwp: 0,
    recommendedContext_fr: 'Régions rurales et périurbaines avec grande disponibilité foncière à coût modéré, atmosphère non agressive.',
    recommendedContext_en: 'Rural and suburban sites with ample affordable land, non-corrosive environmental atmosphere.',
    limitations_fr: 'Emprise foncière immense, vulnérable aux embruns marins salins, à la pollution industrielle, à la foudre et aux animaux.',
    limitations_en: 'Enormous land footprint, vulnerable to marine salt fog, industrial pollution, lightning strikes, and wildlife intrusion.',
    cameroonReferenceSubstations: ['Poste 225/90 kV de Mangombé (Édéa)', 'Poste 225/90 kV d\'Oyomabang (Yaoundé)', 'Poste 90/30 kV de Logbaba (Douala)'],
    radarScores: {
      footprintCompactness: 2,
      initialCapexEconomy: 9,
      siteErectionSpeed: 5,
      environmentalHarshnessResistance: 3,
      personnelSafetyArcFlash: 6,
      repairEaseLocalAutonomy: 9,
      ecoFriendlinessGhg: 10
    }
  },
  {
    id: 'GIS',
    code: 'GIS_SF6',
    name_fr: 'Poste Sous Enveloppe Métallique Blindé (GIS SF₆)',
    name_en: 'Gas-Insulated Switchgear (GIS SF₆)',
    insulationMedium_fr: 'Hexafluorure de soufre (SF₆) sous pression (~4.5 à 6.5 bar rel.) dans cuves d\'aluminium scellées',
    insulationMedium_en: 'Sulfur hexafluoride (SF₆) gas pressurized (~4.5 to 6.5 bar rel.) inside sealed aluminum enclosures',
    governingStandards: ['IEC 62271-203', 'IEC 62271-200', 'IEC 60376', 'CIGRE TB 552'],
    footprintPerBay225kV_m2: 130, // ~10x reduction
    relativeEquipmentCapex: 2.2,
    relativeCivilWorksCapex: 0.45,
    erectionTimeMonthsPerSubstation: 6,
    maintenanceIntervalYears: 10,
    mttrHours: 96, // Long repair time in case of internal compartment breach
    annualFailureRatePerBay: 0.008, // Very low failure rate
    environmentalImpactGwp: 24300, // Highly potent greenhouse gas
    recommendedContext_fr: 'Zones urbaines denses à foncier cher, postes littoraux à salinité extrême, environnements industriels pollués (chimie, cimenteries) ou espaces restreints de centrales hydroélectriques.',
    recommendedContext_en: 'Dense urban centers with expensive land, coastal substations with extreme saline corrosion, harsh industrial pollution or indoor caverns in hydro powerhouses.',
    limitations_fr: 'CAPEX appareillage élevé, temps de réparation long nécessitant des spécialistes constructeur, gestion environnementale stricte du gaz SF₆ (GWP 24 300).',
    limitations_en: 'High initial equipment purchase cost, prolonged MTTR requiring OEM specialists and certified SF₆ recovery, severe GHG regulations.',
    cameroonReferenceSubstations: ['Poste d\'Évacuation Usine Nachtigal 420 MW', 'Poste Portuaire en Eau Profonde de Kribi', 'Centrale Hydroélectrique de Songloulou (travées internes)'],
    radarScores: {
      footprintCompactness: 10,
      initialCapexEconomy: 4,
      siteErectionSpeed: 9,
      environmentalHarshnessResistance: 10,
      personnelSafetyArcFlash: 10,
      repairEaseLocalAutonomy: 3,
      ecoFriendlinessGhg: 3
    }
  },
  {
    id: 'HYBRID_MTS',
    code: 'HIS_MTS',
    name_fr: 'Poste Hybride Compact (HIS / MTS - Mixed Technology Switchgear)',
    name_en: 'Hybrid / Mixed Technology Switchgear (MTS / HIS)',
    insulationMedium_fr: 'Hybride : Barres en plein air (AIS) et modules de coupure/sectionnement intégrés en cuve SF₆ compacte',
    insulationMedium_en: 'Hybrid: Air-insulated outdoor busbars with compact SF₆ gas-insulated breaker/disconnect module',
    governingStandards: ['IEC 62271-205', 'IEC 61936-1', 'IEC 62271-1'],
    footprintPerBay225kV_m2: 500, // Intermediate footprint
    relativeEquipmentCapex: 1.5,
    relativeCivilWorksCapex: 0.7,
    erectionTimeMonthsPerSubstation: 9,
    maintenanceIntervalYears: 6,
    mttrHours: 36,
    annualFailureRatePerBay: 0.015,
    environmentalImpactGwp: 8500, // Reduced SF6 volume compared to full GIS
    recommendedContext_fr: 'Rénovation, extension et renforcement de postes AIS existants sans acquisition foncière supplémentaire, compromis coût/surface optimal.',
    recommendedContext_en: 'Brownfield retrofits, substation bay extensions without new land purchase, optimum balance between Capex and compactness.',
    limitations_fr: 'Les barres restent exposées à l\'environnement extérieur; maintenance à double compétence (aérien + SF₆).',
    limitations_en: 'Busbars remain exposed to atmosphere; dual-skill maintenance required (outdoor AIS + gas handling).',
    cameroonReferenceSubstations: ['Extension Travées Bekoko 225 kV', 'Rénovation Poste 90 kV Koumassi (Douala)'],
    radarScores: {
      footprintCompactness: 6,
      initialCapexEconomy: 7,
      siteErectionSpeed: 7,
      environmentalHarshnessResistance: 6,
      personnelSafetyArcFlash: 8,
      repairEaseLocalAutonomy: 6,
      ecoFriendlinessGhg: 6
    }
  }
];

export const BUSBAR_TOPOLOGIES: BusbarTopology[] = [
  {
    id: 'SINGLE_BUS',
    code: 'TOP_SB',
    name_fr: 'Simple Jeu de Barres (Single Busbar)',
    name_en: 'Single Busbar (SB)',
    relativeCostPerBay: 1.0,
    breakersPerCircuit: 1,
    disconnectorsPerCircuit: 2,
    maintenanceFlexibility_fr: 'Nulle : la maintenance du jeu de barres ou d\'un sectionneur exige l\'arrêt complet de l\'ensemble du poste.',
    maintenanceFlexibility_en: 'Zero: busbar or bus disconnector maintenance requires complete shutdown of the entire substation.',
    faultBusbarConsequence_fr: 'Blackout total du poste : déclenchement de tous les départs par la protection différentielle de barre 87B ou de secours.',
    faultBusbarConsequence_en: 'Total substation blackout: all incoming and outgoing circuits trip on busbar differential 87B or backup.',
    protectionComplexity: 'LOW',
    expansionEase_fr: 'Moyenne : extension facile en extrémité de barre mais arrêt partiel ou total souvent nécessaire.',
    expansionEase_en: 'Fair: end-of-bus extension possible, but partial or complete outage frequently required.',
    recommendedVoltageLevels: '15 kV à 90 kV (Postes de distribution et petits postes sources)',
    typicalApplications_fr: 'Postes sources de distribution rurale, sous-stations industrielles secondaires sans exigence critique de continuité N-1.',
    typicalApplications_en: 'Rural distribution substations, secondary industrial feeder stations without critical N-1 redundancy requirements.',
    pros_fr: [
      'CAPEX initial le plus faible et schéma le plus simple',
      'Emprise au sol minimale et charpente légère',
      'Automatisme et relayage de protection simplifiés (1 seul disjoncteur par travée)',
      'Exploitation intuitive avec risques de fausse manœuvre réduits'
    ],
    pros_en: [
      'Lowest capital investment (Capex) and simplest layout',
      'Smallest footprint and lightest structural steelwork',
      'Simplified protection relays and interlocking logic',
      'Intuitive operation with reduced operator switching errors'
    ],
    cons_fr: [
      'Aucune redondance : un défaut barre entraîne la perte de 100% de la desserte',
      'Impossibilité d\'effectuer la révision d\'un disjoncteur sans couper le départ associé',
      'Disponibilité globale faible pour les réseaux de transport'
    ],
    cons_en: [
      'Zero redundancy: single busbar fault results in 100% loss of supply',
      'Breaker overhaul impossible without taking circuit out of service',
      'Unacceptable availability for transmission bulk grid nodes'
    ],
    cameroonExamples: ['Postes HTA 30/15 kV secondaires en milieu rural', 'Postes MT industriels d\'usines de transformation bois']
  },
  {
    id: 'SECTIONALIZED_SINGLE_BUS',
    code: 'TOP_SSB',
    name_fr: 'Simple Jeu de Barres Tronçonné (Sectionalized Single Busbar)',
    name_en: 'Sectionalized Single Busbar (SSB)',
    relativeCostPerBay: 1.18,
    breakersPerCircuit: 1, // + disjoncteur de tronçonnement
    disconnectorsPerCircuit: 3,
    maintenanceFlexibility_fr: 'Modérée : un demi-jeu de barres peut être consigné pendant que l\'autre demi-poste reste en service.',
    maintenanceFlexibility_en: 'Moderate: one bus section can be de-energized for maintenance while the other half remains in service.',
    faultBusbarConsequence_fr: 'Perte de 50% des départs : seul le tronçon en défaut est isolé par la protection 87B et le disjoncteur de tronçonnement.',
    faultBusbarConsequence_en: 'Loss of 50% circuits: only the faulted bus section is isolated by 87B and the bus-section breaker.',
    protectionComplexity: 'MEDIUM',
    expansionEase_fr: 'Bonne : un nouveau tronçon peut être ajouté avec arrêt programmé d\'une seule section.',
    expansionEase_en: 'Good: new section can be connected with scheduled outage of one half only.',
    recommendedVoltageLevels: '20 kV à 110 kV',
    typicalApplications_fr: 'Postes sources HTA urbains 2 transformateurs (schéma 2 demi-rames avec couplage automatique BMR).',
    typicalApplications_en: 'Urban distribution primary substations with 2 transformers and automatic bus transfer (ABT).',
    pros_fr: [
      'Division par 2 de l\'impact d\'un défaut barre (perte de 50% max)',
      'Possibilité de maintenance d\'un tronçon sans couper la totalité des charges critiques',
      'Adapté au fonctionnement avec 2 arrivées indépendantes et permutateur automatique',
      'Coût très contenu (+15-20% vs simple barre)'
    ],
    pros_en: [
      'Halves the consequence of a bus fault (maximum 50% load lost)',
      'Maintenance of one section possible while retaining critical loads',
      'Ideal for dual-incomer setups with automatic bus transfer scheme',
      'Modest cost premium (+15-20% vs single busbar)'
    ],
    cons_fr: [
      'La maintenance d\'un disjoncteur de départ coupe toujours le départ associé',
      'Les charges doivent être réparties et doublées entre les deux tronçons'
    ],
    cons_en: [
      'Feeder breaker overhaul still requires circuit outage',
      'Loads must be strategically segregated across the two sections'
    ],
    cameroonExamples: ['Poste 90/15 kV Koumassi (Douala - rames MT)', 'Poste 90/15 kV Ngousso (Yaoundé)']
  },
  {
    id: 'DOUBLE_BUS_SINGLE_BREAKER',
    code: 'TOP_DB',
    name_fr: 'Double Jeu de Barres avec Disjoncteur de Couplage (Double Bus Single Breaker)',
    name_en: 'Double Busbar Single Breaker (DB)',
    relativeCostPerBay: 1.45,
    breakersPerCircuit: 1, // + 1 disjoncteur de couplage pour le poste
    disconnectorsPerCircuit: 4, // 2 sectionneurs d'aiguillage vers barres A et B
    maintenanceFlexibility_fr: 'Excellente pour les barres : basculement à chaud de tous les départs de la Barre 1 vers la Barre 2 sans coupure via le couplage.',
    maintenanceFlexibility_en: 'Superb for busbars: on-load bus transfer of all circuits from Bus 1 to Bus 2 without interruption via bus coupler.',
    faultBusbarConsequence_fr: 'Perte temporaire de la demi-charge connectée à la barre en défaut; basculement aisé des départs sains sur la seconde barre.',
    faultBusbarConsequence_en: 'Temporary trip of circuits tied to faulted bus; swift reconfiguration onto surviving healthy busbar.',
    protectionComplexity: 'HIGH',
    expansionEase_fr: 'Très bonne : extension possible sur l\'une des barres sans interrompre l\'exploitation.',
    expansionEase_en: 'Very good: extension on one busbar possible without operational disturbance.',
    recommendedVoltageLevels: '90 kV à 225 kV (Standard des réseaux de transport interconnectés)',
    typicalApplications_fr: 'Postes d\'interconnexion et de transport régionaux, nœuds d\'évacuation de centrales de moyenne puissance.',
    typicalApplications_en: 'Regional transmission grid substations, interconnected nodes, medium power plant evacuation.',
    pros_fr: [
      'Standard mondial des réseaux de transport 90 kV / 225 kV',
      'Permet la maintenance complète d\'un jeu de barres sans aucune coupure de charge',
      'Ségrégation opérationnelle des réseaux (ex: rames indépendantes pour limiter le courant de court-circuit)',
      'Possibilité de pontage de disjoncteur via le disjoncteur de couplage (selon variantes)'
    ],
    pros_en: [
      'Global reference standard for 90 kV / 225 kV transmission grids',
      'Full busbar de-energization and cleaning without load shedding',
      'Flexible operational network split to control short-circuit levels',
      'By-pass capability using bus-coupler breaker (with transfer bus option)'
    ],
    cons_fr: [
      'Nécessite deux jeux de sectionneurs d\'aiguillage par travée (verrouillages mécaniques et électriques critiques)',
      'La protection différentielle de barre 87B nécessite la surveillance de position des sectionneurs (discrimant de zone)'
    ],
    cons_en: [
      'Requires double bus selector disconnectors per bay (strict interlocks essential)',
      'Busbar differential relay 87B requires disconnector replica zone switching'
    ],
    cameroonExamples: ['Poste 225/90 kV de Mangombé (Édéa)', 'Poste 225/90 kV de Bekoko (Douala Ouest)', 'Poste 90/15 kV de Logbaba']
  },
  {
    id: 'BREAKER_AND_A_HALF',
    code: 'TOP_1_5_CB',
    name_fr: 'Schéma à 1½ Disjoncteur (Breaker-and-a-Half)',
    name_en: 'Breaker-and-a-Half Scheme (1½ CB)',
    relativeCostPerBay: 1.95,
    breakersPerCircuit: 1.5, // 3 disjoncteurs pour 2 circuits formant un diamètre
    disconnectorsPerCircuit: 6,
    maintenanceFlexibility_fr: 'Maximale : N\'IMPORTE QUEL disjoncteur peut être consigné et retiré sans JAMAIS interrompre aucun circuit.',
    maintenanceFlexibility_en: 'Ultimate: ANY circuit breaker can be isolated and racked out without interrupting ANY incoming/outgoing circuit.',
    faultBusbarConsequence_fr: 'ZÉRO interruption de circuit : si un jeu de barres tombe en défaut, tous les circuits continuent d\'être alimentés par l\'autre barre via le disjoncteur central.',
    faultBusbarConsequence_en: 'ZERO circuit interruption: if one busbar experiences a fault, both circuits remain fully energized from surviving bus via center breaker.',
    protectionComplexity: 'VERY_HIGH',
    expansionEase_fr: 'Excellente par ajout de diamètres entiers.',
    expansionEase_en: 'Excellent by adding complete breaker diameters.',
    recommendedVoltageLevels: '225 kV à 500 kV+ (Grandes centrales critiques et artères de transport névralgiques)',
    typicalApplications_fr: 'Postes d\'évacuation de grandes centrales nucléaires ou hydroélectriques (> 300 MW), nœuds majeurs du backbone national.',
    typicalApplications_en: 'Evacuation of major hydro/nuclear powerhouses (> 300 MW), backbone national grid interties.',
    pros_fr: [
      'Plus haut niveau de fiabilité et de disponibilité de l\'ingénierie électrique',
      'Un défaut sur un jeu de barres n\'interrompt AUCUN départ',
      'Maintenance préventive des disjoncteurs à tout moment sans coordination de consignation de ligne',
      'Pas besoin de sectionneurs d\'aiguillage en charge : manœuvres sûres'
    ],
    pros_en: [
      'Highest reliability and availability in power systems engineering',
      'Busbar fault does not trip ANY connected circuit',
      'Breaker overhaul scheduled anytime without line outage coordination',
      'No complex bus-selector switching operations required'
    ],
    cons_fr: [
      'Investissement CAPEX le plus lourd (3 disjoncteurs pour 2 circuits)',
      'Emprise au sol considérable en AIS (adapté en GIS)',
      'Schéma de relayage très sophistiqué (chaque disjoncteur commande 2 zones de protection, automatisme de réenclenchement et défaillance disjoncteur 50BF croisés)'
    ],
    cons_en: [
      'Heaviest capital investment (3 circuit breakers per 2 circuits)',
      'Substantial ground footprint in outdoor AIS (highly recommended in GIS)',
      'Complex relaying (each breaker serves dual zones, interlocking auto-reclose, cross-tripping 50BF)'
    ],
    cameroonExamples: ['Poste d\'Évacuation 225 kV Usine Nachtigal (420 MW - 7 groupes)', 'Futur Poste d\'Interconnexion 400 kV Cameroun - Tchad (PIEPAC)']
  },
  {
    id: 'RING_BUS',
    code: 'TOP_RING',
    name_fr: 'Jeu de Barres en Anneau (Ring Busbar)',
    name_en: 'Ring Busbar (RB)',
    relativeCostPerBay: 1.35,
    breakersPerCircuit: 1, // 1 disjoncteur par circuit agencé en boucle
    disconnectorsPerCircuit: 3,
    maintenanceFlexibility_fr: 'Très bonne : un disjoncteur peut être consigné en ouvrant l\'anneau sans couper de départ (l\'anneau devient linéaire).',
    maintenanceFlexibility_en: 'Very good: any breaker can be isolated for service opening the ring without interrupting circuit supply.',
    faultBusbarConsequence_fr: 'Aucun jeu de barres centralisé : un défaut section isole seulement les deux disjoncteurs encadrants, maintenant tous les autres circuits.',
    faultBusbarConsequence_en: 'No dedicated bus: section fault only trips adjacent bounding breakers, retaining all other circuits.',
    protectionComplexity: 'HIGH',
    expansionEase_fr: 'Difficile : l\'extension au-delà de 6 à 8 départs rend la topologie complexe et vulnérable au double défaut.',
    expansionEase_en: 'Difficult: extending beyond 6 to 8 circuits creates operational vulnerability to simultaneous faults.',
    recommendedVoltageLevels: '110 kV à 225 kV (Postes de 4 à 6 départs)',
    typicalApplications_fr: 'Postes de coupure d\'artères de transport à 4 ou 6 départs où la continuité N-1 est requise avec un coût modéré.',
    typicalApplications_en: 'Transmission line sectionalizing nodes with 4 to 6 lines requiring N-1 security at moderate Capex.',
    pros_fr: [
      'Haute fiabilité sans nécessiter de jeu de barres dédié',
      'Un disjoncteur par circuit seulement tout en offrant la flexibilité de maintenance du 1½ disjoncteur',
      'Pas de sectionneur d\'aiguillage complexe'
    ],
    pros_en: [
      'High reliability without dedicated busbar structures',
      'Only 1 breaker per circuit yet permits breaker maintenance without circuit outage',
      'Eliminates complex bus-selector switching'
    ],
    cons_fr: [
      'Si l\'anneau est ouvert pour maintenance, un défaut ultérieur coupe le réseau en deux sous-systèmes',
      'Limité en pratique à 6 départs maximum avant de devoir convertir en 1½ disjoncteur',
      'Courants de transit variables dans les branches de l\'anneau'
    ],
    cons_en: [
      'When ring is open for maintenance, subsequent fault splits the substation into islands',
      'Practically limited to 6 circuits max before converting into breaker-and-a-half',
      'Unequal branch current flows under heavy transmission transfers'
    ],
    cameroonExamples: ['Postes d\'antennes de transit hydroélectrique du RIS']
  }
];

export const SYSTEM_EARTHING_SCHEMES: SystemEarthingScheme[] = [
  {
    id: 'SOLID_GROUNDED',
    code: 'TN_SOLID',
    name_fr: 'Neutre Directement à la Terre (Schéma TN / Solid Grounding)',
    name_en: 'Solidly Grounded Neutral (TN System)',
    voltageDomains: 'HTB (63 kV à 400 kV) et BT (Schéma TN-C / TN-S 400V)',
    governingStandards: ['IEC 61936-1', 'IEC 60364-4-41', 'NF C 13-200', 'IEEE 142'],
    singlePhaseFaultCurrentRange: 'TRÈS ÉLEVÉ : 5 000 A à 40 000 A (comparable au court-circuit triphasé Ik3)',
    temporaryOvervoltageFactorTov: 'Faible : k ≤ 1.3 à 1.4 Um/√3 (phases saines protégées contre les surtensions)',
    serviceContinuityAtFirstFault_fr: 'Nulle : Déclenchement instantané obligatoire dès le premier défaut pour éviter la destruction thermique et l\'électrocution.',
    serviceContinuityAtFirstFault_en: 'Zero: Instantaneous tripping mandatory on 1st fault to prevent thermal destruction and electric shock.',
    fireArcFlashRisk_fr: 'Très élevé lors du défaut (puissance de court-circuit libérée immense, danger d\'arc flash violent).',
    fireArcFlashRisk_en: 'Extremely high during fault (immense short-circuit energy released, severe arc flash hazard).',
    protectiveRelays: ['ANSI 50N / 51N (Maximum de courant phase-terre)', 'ANSI 87T / 87G (Différentielle)', 'ANSI 21 (Distance zone de terre)'],
    cableInsulationRatingRequired: 'U0 / U standard (Ex: 12/20 kV ou 130/225 kV) car aucune surtension de phase saine prolongée.',
    keyAdvantages_fr: [
      'Élimination quasi-totale des surtensions temporaires à fréquence industrielle (k ≤ 1.4)',
      'Détection du défaut de terre extrêmement facile et sélective (courants très élevés)',
      'Permet l\'utilisation d\'isolateurs et de parafoudres à tension de service plus basse (gain économique HTB majeur)',
      'Standard mondial absolu en Transport HTB (225 kV / 400 kV)'
    ],
    keyAdvantages_en: [
      'Near-complete mitigation of temporary overvoltages (k <= 1.4)',
      'Straightforward and highly dependable earth fault detection and relay selectivity',
      'Permits lower rated insulation levels and surge arresters (major HV transmission cost savings)',
      'Universal global standard for HV/EHV Transmission grids (225 kV / 400 kV)'
    ],
    keyDrawbacks_fr: [
      'Courants de court-circuit destructeurs pour les câbles, transformateurs et cuves',
      'Contraintes maximales sur le réseau de terre (montée en potentiel du sol GPR / tensions de pas et de toucher)',
      'Coupure immédiate des clients sans délai de secours'
    ],
    keyDrawbacks_en: [
      'Destructive fault currents causing mechanical shock to windings and cables',
      'Maximum ground potential rise (GPR), severe touch and step voltages',
      'Immediate power cut to customers with zero grace period'
    ],
    typicalUtilityIndustrialUse_fr: 'Réseau de transport interconnecté 225 kV SONATREL, réseaux basse tension industriels et tertiaires TN-S.',
    typicalUtilityIndustrialUse_en: 'National 225 kV transmission grid (SONATREL), industrial/commercial LV systems (TN-S).'
  },
  {
    id: 'RESISTANCE_GROUNDED',
    code: 'NER_LIMIT',
    name_fr: 'Neutre Limité par Résistance (NER - Neutral Earthing Resistor)',
    name_en: 'Resistance Grounded Neutral (NER)',
    voltageDomains: 'HTA / Moyenne Tension (5.5 kV à 33 kV)',
    governingStandards: ['IEC 60076-16', 'NF C 13-200', 'IEEE 142 Green Book', 'HN 64-S-43'],
    singlePhaseFaultCurrentRange: 'LIMITÉ & CALIBRÉ : 100 A à 1000 A (Typique Cameroun/France : 300 A en souterrain, 100 A ou 1000 A en aérien)',
    temporaryOvervoltageFactorTov: 'Modéré : k ≈ 1.4 à 1.7 Um/√3',
    serviceContinuityAtFirstFault_fr: 'Déclenchement temporisé : coupure sélective en 100 à 500 ms par relais 51N ou 67N directionnel.',
    serviceContinuityAtFirstFault_en: 'Delayed tripping: selective clearance in 100 to 500 ms by 51N or 67N directional relay.',
    fireArcFlashRisk_fr: 'Faible à modéré : énergie de défaut limitée à la valeur assignée de la résistance de neutre (R = U0 / Ineutre).',
    fireArcFlashRisk_en: 'Low to moderate: fault energy tightly bound by the resistor rating (R = U0 / Ifault).',
    protectiveRelays: ['ANSI 51N (Surintensité temporisée neutre)', 'ANSI 67N (Directionnelle terre)', 'ANSI 59N (Déplacement de neutre)'],
    cableInsulationRatingRequired: 'Câbles HTA isolés pour niveau standard ou renforcé (selon temps d\'élimination < 1 min).',
    keyAdvantages_fr: [
      'Équilibre idéal entre réduction des dégâts matériels et facilité de détection par relais de surintensité',
      'Protection efficace des noyaux et tôles magnétiques des alternateurs et moteurs HTA',
      'Tensions de pas et de toucher très réduites dans les postes de transformation HTA/BT',
      'Standard des réseaux HTA de distribution urbaine (Eneo Douala / Yaoundé)'
    ],
    keyAdvantages_en: [
      'Ideal compromise between limiting damage and retaining simple current-based relay detection',
      'Protects generator stator core laminations and high-voltage motors from burning',
      'Drastically reduced ground step and touch potentials at MV/LV substations',
      'Universal benchmark for urban MV distribution grids (Eneo Douala / Yaoundé)'
    ],
    keyDrawbacks_fr: [
      'Nécessite une résistance de mise à la terre volumineuse (acier inoxydable ou fonte) à tenue thermique 10s',
      'Coupure de l\'alimentation au premier défaut (pas de fonctionnement prolongé toléré)'
    ],
    keyDrawbacks_en: [
      'Requires physical grounding resistor cubicle with 10-second thermal thermal rating',
      'Still trips circuit on first fault (no prolonged operation permitted)'
    ],
    typicalUtilityIndustrialUse_fr: 'Réseaux de distribution HTA 15 kV et 30 kV Eneo, groupes turbo-alternateurs de Songloulou et Nachtigal.',
    typicalUtilityIndustrialUse_en: 'Eneo 15 kV & 30 kV MV distribution, Songloulou & Nachtigal turbine-generator neutral grounding.'
  },
  {
    id: 'ISOLATED_NEUTRAL',
    code: 'IT_ISOLATED',
    name_fr: 'Neutre Isolé (Schéma IT / Isolated Neutral)',
    name_en: 'Isolated Neutral (IT System)',
    voltageDomains: 'HTA Industrielle fermée (3.3 kV à 15 kV) et BT Process Critique (400V IT)',
    governingStandards: ['IEC 60364-4-41', 'NF C 15-100 Cl. 411.6', 'NF C 13-200', 'IEC 61557-8'],
    singlePhaseFaultCurrentRange: 'TRÈS FAIBLE : 1 A à 20 A (uniquement le courant capacitif des câbles Ic = 3·ω·C0·V)',
    temporaryOvervoltageFactorTov: 'TRÈS ÉLEVÉ : k = √3 ≈ 1.732 Um/√3 (les deux phases saines montent à la tension composée U)',
    serviceContinuityAtFirstFault_fr: 'MAXIMALE : AUCUNE COUPURE au 1er défaut ! Signalisation par Contrôleur Permanent d\'Isolement (CPI). L\'exploitation continue sans perturbation.',
    serviceContinuityAtFirstFault_en: 'MAXIMUM: NO TRIPPING on 1st fault! Monitored by Insulation Monitoring Device (IMD/CPI). Process runs continuously.',
    fireArcFlashRisk_fr: 'Nul au 1er défaut. ATTENTION : Très élevé au 2ème défaut (court-circuit biphasé franc Ik2).',
    fireArcFlashRisk_en: 'Negligible on 1st fault. CAUTION: Extremely severe on 2nd double-phase fault (cleared as Ik2).',
    protectiveRelays: ['ANSI 59N (Surtension résiduelle homopolaire)', 'ANSI 67NC (Directionnel capacitif)', 'CPI / IMD (Injection BF)'],
    cableInsulationRatingRequired: 'ISOLEMENT RENFORCÉ EXIGÉ : U0 / U = 18/30 kV pour du 20 kV (tenue en régime de neutre dégradé prolongé).',
    keyAdvantages_fr: [
      'Continuité de service absolue : le procédé industriel critique ne s\'arrête JAMAIS au 1er défaut',
      'Pas d\'arc de défaut dangereux ni d\'explosion au point de contact initial',
      'Permet à l\'équipe de maintenance de localiser le défaut en ligne sans couper la production'
    ],
    keyAdvantages_en: [
      'Ultimate process continuity: critical continuous plants never trip on single-phase ground fault',
      'Negligible arc energy or risk of fire at the initial fault contact',
      'Allows maintenance technicians to trace and locate ground fault online while energized'
    ],
    keyDrawbacks_fr: [
      'Les phases saines subissent une surtension continue de 173% (vieillissement accéléré de l\'isolant)',
      'Risque majeur de ferrorésonance et de surtensions d\'arc intermittent (arcing grounds)',
      'Exige une équipe de maintenance hautement qualifiée d\'astreinte pour éliminer le 1er défaut avant l\'apparition d\'un 2ème défaut catastrophique'
    ],
    keyDrawbacks_en: [
      'Healthy phases endure continuous 173% overvoltage (accelerated insulation dielectric stress)',
      'Severe susceptibility to ferroresonance and repetitive arcing ground overvoltages',
      'Requires highly trained electrical maintenance team on-call to clear 1st fault before lethal 2nd fault'
    ],
    typicalUtilityIndustrialUse_fr: 'Alumineries (ALUCAM Edéa), salles de commande, hôpitaux, auxiliaires de centrales et plateformes offshore.',
    typicalUtilityIndustrialUse_en: 'Aluminium smelters (ALUCAM Edea), hospital operating theatres, power plant auxiliaries, offshore rigs.'
  },
  {
    id: 'RESONANT_PETERSEN',
    code: 'PETERSEN_COIL',
    name_fr: 'Neutre Compensé par Bobine de Petersen (Resonant Grounding)',
    name_en: 'Resonant Grounding (Petersen Coil / Arc Suppression Coil)',
    voltageDomains: 'HTA Moyenne Tension Aérienne Étendue (15 kV à 36 kV)',
    governingStandards: ['IEC 60076-14', 'CIGRE WG B5.18', 'EN 50522', 'UTE C 13-205'],
    singlePhaseFaultCurrentRange: 'RÉSIDUEL QUASI-NUL : 2 A à 10 A (la réactance inductive L compense à 100% la capacité de réseau 3·C0·ω)',
    temporaryOvervoltageFactorTov: 'Élevé : k = √3 ≈ 1.732 Um/√3 sur les phases saines',
    serviceContinuityAtFirstFault_fr: 'Très haute : auto-extinction immédiate de 80% des défauts fugitifs de terre (branches, foudre) sans aucun déclenchement de disjoncteur.',
    serviceContinuityAtFirstFault_en: 'Very high: spontaneous self-extinction of 80% transient earth faults (lightning, tree contact) without breaker opening.',
    fireArcFlashRisk_fr: 'Extrêmement faible : courant résiduel actif insuffisant pour entretenir un arc électrique dans l\'air ou enflammer la végétation.',
    fireArcFlashRisk_en: 'Extremely low: residual active current insufficient to sustain arc in air or ignite dry bushfire.',
    protectiveRelays: ['ANSI 67N-W (Relais wattmétrique homopolaire mesurant la composante active résiduelle)', 'ANSI 59N'],
    cableInsulationRatingRequired: 'Isolement renforcé obligatoire pour supporter la tenue prolongée aux surtensions.',
    keyAdvantages_fr: [
      'Auto-extinction spontanée des défauts fugitifs sans coupure pour les usagers (SAIDI et SAIFI spectaculairement améliorés)',
      'Prévention des feux de brousse et d\'incendie par contact de lignes avec la végétation',
      'Idéal pour les très grands réseaux ruraux aériens HTA très étendus et exposés aux orages'
    ],
    keyAdvantages_en: [
      'Spontaneous self-extinction of transient faults with zero user outage (massive SAIDI / SAIFI gains)',
      'Bushfire and wildfire prevention under conductor sag into dry vegetation',
      'Optimum solution for massive overhead rural networks vulnerable to severe tropical lightning'
    ],
    keyDrawbacks_fr: [
      'Investissement élevé : bobine d\'inductance réglable motorisée (plongeur mobile) pilotée par automate d\'accord',
      'Localisation et relayage de terre très délicats (exige des relais wattmétriques 67N très sensibles mesurant quelques ampères)',
      'Inadapté aux réseaux purement souterrains où les défauts sont presque toujours permanents'
    ],
    keyDrawbacks_en: [
      'Significant investment: motorized variable plunger coil with automatic digital tuning controller',
      'Delicate fault directional detection (requires sensitive wattmetric directional relays 67N)',
      'Unsuitable for pure underground cable networks where faults are virtually always permanent'
    ],
    typicalUtilityIndustrialUse_fr: 'Réseaux de distribution ruraux HTA aériens en Allemagne, Europe centrale et lignes HTA isolées en forêt équatoriale.',
    typicalUtilityIndustrialUse_en: 'Rural overhead MV distribution in Central Europe and extended overhead tropical rainforest feeders.'
  },
  {
    id: 'TT_SCHEME',
    code: 'TT_SCHEME',
    name_fr: 'Schéma TT (Neutre Distributeur à la Terre, Masses Usager à la Terre Séparée)',
    name_en: 'TT Earthing System (Separated Neutral & Earth)',
    voltageDomains: 'Basse Tension Publique (230 / 400 V)',
    governingStandards: ['IEC 60364-4-41', 'NF C 15-100 Cl. 411.5', 'IEEE C62.41'],
    singlePhaseFaultCurrentRange: 'FAIBLE À MODÉRÉ : 5 A à 50 A (limité par la résistance de terre de l\'usager RA et du poste RB : If = U0 / (RA + RB))',
    temporaryOvervoltageFactorTov: 'Modéré : k ≤ 1.4 Um/√3',
    serviceContinuityAtFirstFault_fr: 'Déclenchement instantané du disjoncteur différentiel (DDR) à la première fuite de courant (30 mA pour la protection des personnes, 300/500 mA en tête).',
    serviceContinuityAtFirstFault_en: 'Instantaneous trip of Residual Current Device (RCD) upon 1st earth leakage (30 mA personal safety, 300/500 mA incoming).',
    fireArcFlashRisk_fr: 'Faible grâce au déclenchement différentiel rapide (sensibilité 300 mA limite le risque d\'incendie par échauffement NF C 15-100).',
    fireArcFlashRisk_en: 'Low owing to fast RCD tripping (300 mA sensitivity prevents ignition from resistive fault heating).',
    protectiveRelays: ['Disjoncteur Différentiel Résiduel (DDR / RCD 30 mA à 500 mA)', 'Disjoncteur magnétothermique'],
    cableInsulationRatingRequired: 'Câbles BT standard 0.6/1 kV.',
    keyAdvantages_fr: [
      'Sécurité maximale des personnes dans l\'habitat : les masses usager sont indépendantes de la terre du réseau',
      'Le distributeur public ne transporte aucun conducteur PE de protection',
      'Simplicité totale de mise en œuvre et contrôle réglementaire facile (mesure de la prise de terre usager RA < 100 Ω)'
    ],
    keyAdvantages_en: [
      'Maximum public consumer safety: installation metalwork is completely decoupled from grid earthing',
      'Utility does not distribute hazardous protective earth conductors across long public networks',
      'Straightforward installation with standardized earth electrode testing (RA < 100 ohms)'
    ],
    keyDrawbacks_fr: [
      'DÉPENDANCE TOTALE aux dispositifs différentiels (DDR) : si le DDR est bloqué ou défaillant, la masse métallique reste sous tension mortelle',
      'Coupure de courant dès le premier défaut d\'isolement d\'un appareil électroménager',
      'Sensibilité aux déclenchements intempestifs lors d\'impacts de foudre à proximité'
    ],
    keyDrawbacks_en: [
      'TOTAL DEPENDENCY on RCD integrity: if mechanical RCD mechanism seizes, exposed metalwork stays at lethal potential',
      'Supply interruption on 1st appliance insulation breakdown',
      'Prone to nuisance tripping under nearby lightning surges'
    ],
    typicalUtilityIndustrialUse_fr: 'Distribution Basse Tension publique universelle Eneo au Cameroun et en France pour tous les usagers résidentiels et petits commerces.',
    typicalUtilityIndustrialUse_en: 'Universal public Low Voltage residential and small commercial distribution (Eneo Cameroon, France).'
  }
];

export interface TcoCalculationInput {
  voltageLevelKv: 90 | 225;
  numberOfBays: number;
  landCostPerM2Eur: number;
  sitePollutionLevel: 'LOW' | 'MEDIUM' | 'SEVERE_COASTAL';
  energyNotServedCostEurPerMwh: number;
  expectedSubstationLifespanYears: number;
}

export interface TcoCalculationResult {
  technologyId: 'AIS' | 'GIS' | 'HYBRID_MTS';
  equipmentCapexEur: number;
  civilWorksCapexEur: number;
  landAcquisitionCostEur: number;
  totalInitialCapexEur: number;
  cumulativeOpex30YearsEur: number;
  expectedOutageRiskCostEur: number;
  totalLifecycleCostEur: number;
  footprintM2: number;
  recommendationScore: number;
}

export function calculateSubstationTco(input: TcoCalculationInput): TcoCalculationResult[] {
  const { voltageLevelKv, numberOfBays, landCostPerM2Eur, sitePollutionLevel, energyNotServedCostEurPerMwh, expectedSubstationLifespanYears } = input;

  const baseBayCapex = voltageLevelKv === 225 ? 650000 : 380000; // Euros per bay in AIS
  const baseCivilWorksBay = voltageLevelKv === 225 ? 180000 : 110000;

  // Pollution multipliers on maintenance & failure risk
  const pollutionRiskFactor = sitePollutionLevel === 'SEVERE_COASTAL' ? 2.5 : sitePollutionLevel === 'MEDIUM' ? 1.4 : 1.0;

  return SWITCHGEAR_TECHNOLOGIES.map((tech) => {
    const footprintM2 = tech.footprintPerBay225kV_m2 * (voltageLevelKv === 90 ? 0.75 : 1.0) * numberOfBays;
    const landAcquisitionCostEur = footprintM2 * landCostPerM2Eur;

    const equipmentCapexEur = baseBayCapex * tech.relativeEquipmentCapex * numberOfBays;
    const civilWorksCapexEur = baseCivilWorksBay * tech.relativeCivilWorksCapex * numberOfBays;
    const totalInitialCapexEur = equipmentCapexEur + civilWorksCapexEur + landAcquisitionCostEur;

    // Annual OPEX (inspections, cleaning, testing, gas top-ups)
    let annualOpexBase = (equipmentCapexEur + civilWorksCapexEur) * (tech.id === 'AIS' ? 0.025 : tech.id === 'GIS' ? 0.012 : 0.018);
    if (tech.id === 'AIS') {
      annualOpexBase *= pollutionRiskFactor; // Extra washing and greasing in saline/dusty air
    }
    const cumulativeOpex30YearsEur = annualOpexBase * expectedSubstationLifespanYears;

    // Outage Risk Cost = failures/bay/year * bays * MTTR * estimated lost MWh * ENS cost
    const averageBayLoadMw = voltageLevelKv === 225 ? 50 : 25;
    const effectiveFailureRate = tech.annualFailureRatePerBay * (tech.id === 'AIS' ? pollutionRiskFactor : 1.0);
    const annualOutageMwh = effectiveFailureRate * numberOfBays * tech.mttrHours * averageBayLoadMw * 0.4;
    const expectedOutageRiskCostEur = annualOutageMwh * energyNotServedCostEurPerMwh * expectedSubstationLifespanYears;

    const totalLifecycleCostEur = totalInitialCapexEur + cumulativeOpex30YearsEur + expectedOutageRiskCostEur;

    // Recommendation score (1-100, higher is better)
    let recommendationScore = 80;
    if (sitePollutionLevel === 'SEVERE_COASTAL') {
      recommendationScore += tech.id === 'GIS' ? 18 : tech.id === 'HYBRID_MTS' ? 5 : -25;
    }
    if (landCostPerM2Eur > 150) {
      recommendationScore += tech.id === 'GIS' ? 15 : -15;
    }
    if (landCostPerM2Eur < 30 && sitePollutionLevel === 'LOW') {
      recommendationScore += tech.id === 'AIS' ? 20 : -10;
    }

    return {
      technologyId: tech.id,
      equipmentCapexEur: Math.round(equipmentCapexEur),
      civilWorksCapexEur: Math.round(civilWorksCapexEur),
      landAcquisitionCostEur: Math.round(landAcquisitionCostEur),
      totalInitialCapexEur: Math.round(totalInitialCapexEur),
      cumulativeOpex30YearsEur: Math.round(cumulativeOpex30YearsEur),
      expectedOutageRiskCostEur: Math.round(expectedOutageRiskCostEur),
      totalLifecycleCostEur: Math.round(totalLifecycleCostEur),
      footprintM2: Math.round(footprintM2),
      recommendationScore: Math.min(99, Math.max(15, recommendationScore))
    };
  });
}
