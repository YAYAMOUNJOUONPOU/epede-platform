// src/components/grid-architecture/data/networkTopologiesData.ts
// EPEDE - Grid Topologies, Reliability Indices (SAIDI/SAIFI) and Operational Models

import { NetworkTopologyModel } from '../types';

export const NETWORK_TOPOLOGIES: NetworkTopologyModel[] = [
  {
    id: 'radial',
    name: { fr: 'Réseau Radial (Arborescent)', en: 'Radial Distribution Topology' },
    typicalApplication: {
      fr: 'Réseaux de distribution ruraux et périurbains basse et moyenne tension, départs terminaux.',
      en: 'Rural and suburban medium/low voltage distribution feeders, dedicated terminal branch lines.'
    },
    schematicSummary: {
      fr: 'Une seule source amont alimentant des branches divergentes sans aucune redondance de parcours.',
      en: 'A single tree-like path from source to load without alternative feeder routes.'
    },
    investmentCost: 'Faible',
    operationalComplexity: 'Simple',
    reliabilityRating: 'Basique (N-0)',
    saidiImpact: {
      fr: 'Élevé (SAIDI typique > 80 à 250 heures/an). Tout défaut sur le tronc principal coupe la totalité des usagers situés en aval jusqu\'à réparation complète.',
      en: 'High (Typical SAIDI > 80 to 250 hours/year). Any fault on the trunk isolates all downstream customers until physical repair is finished.'
    },
    saifiImpact: {
      fr: 'Fréquence de coupure élevée : chaque orage ou chute d\'arbre sur la ligne provoque l\'ouverture du disjoncteur de tête.',
      en: 'High outage frequency: any atmospheric surge or vegetation contact trips the head circuit breaker.'
    },
    faultSequence: {
      fr: [
        '1. Apparition d\'un court-circuit phase-terre sur la branche.',
        '2. Déclenchement instantané du disjoncteur en tête de départ au poste source (50/51).',
        '3. Coupure totale de tous les postes MT/BT branchés sur le départ.',
        '4. Déplacement physique des équipes de lignards pour localisation visuelle du défaut.',
        '5. Réparation manuelle et réenclenchement.'
      ],
      en: [
        '1. Single phase-to-ground fault occurs along the radial feeder.',
        '2. Head feeder circuit breaker trips on overcurrent (50/51) at source substation.',
        '3. Immediate blackout for 100% of customers on the feeder line.',
        '4. Line inspection crews patrol along the corridor to spot the fault location.',
        '5. Manual repair and subsequent re-energization.'
      ]
    },
    advantages: {
      fr: [
        'Coût d\'investissement minimal en lignes et appareillage',
        'Protection très simple : relais de surintensité à temps inverse sans contrainte directionnelle',
        'Courants de court-circuit facilement calculables et limités'
      ],
      en: [
        'Lowest capital expenditure in lines and switchgear',
        'Simple non-directional time-overcurrent protection coordination',
        'Readily predictable and contained short-circuit levels'
      ]
    },
    disadvantages: {
      fr: [
        'Aucune redondance : un incident isole immédiatement tous les clients avals',
        'Chute de tension cumulative le long de la ligne limitant la longueur maximale',
        'Maintenance impossible sans couper l\'alimentation des usagers'
      ],
      en: [
        'Zero redundancy: single point of failure collapses the entire branch',
        'Progressive cumulative voltage drop capping feeder span length',
        'Maintenance requires planned blackouts for downstream customers'
      ]
    },
    cameroonExample: {
      fr: 'Départs ruraux 30 kV de l\'Ouest et du Centre (ex: départ Bafia - Bokito ou Obala - Batchenga).',
      en: 'Rural 30 kV radial feeders in Western and Central regions (e.g. Bafia - Bokito or Obala - Batchenga).'
    }
  },
  {
    id: 'open_ring',
    name: { fr: 'Réseau en Boucle Ouverte (Ring Main)', en: 'Open Loop / Ring Main Topology' },
    typicalApplication: {
      fr: 'Distribution urbaine moyenne tension (30 kV) dense, zones industrielles et grands ensembles hospitaliers.',
      en: 'Urban medium-voltage (30 kV) rings, modern commercial districts, and critical industrial parks.'
    },
    schematicSummary: {
      fr: 'Ligne en boucle reliant plusieurs postes MT/BT entre deux jeux de barres ou un même poste, exploitée avec un point d\'ouverture normal (NO).',
      en: 'A continuous loop interconnecting multiple RMU substations, operated split at a predetermined Normally Open (NO) point.'
    },
    investmentCost: 'Modéré',
    operationalComplexity: 'Moyenne',
    reliabilityRating: 'Bonne (N-1 reconfigurable)',
    saidiImpact: {
      fr: 'Modéré à faible (SAIDI < 10 à 35 heures/an). Le tronçon en défaut est isolé par manœuvre des interrupteurs RMU et les clients sont réalimentés en 2 à 15 minutes par la boucle opposée.',
      en: 'Moderate to low (SAIDI < 10 to 35 hours/year). Faulted section is isolated via RMU switches and supply restored to unaffected sections in < 10 mins.'
    },
    saifiImpact: {
      fr: 'Fréquence d\'interruption réduite grâce au réenclencheur et au bouclage alternatif.',
      en: 'Outage frequency curtailed through automatic reclosing and alternative ring routing.'
    },
    faultSequence: {
      fr: [
        '1. Défaut d\'isolement sur un tronçon de câble souterrain entre le poste B et le poste C.',
        '2. Déclenchement du disjoncteur de tête de la demi-boucle.',
        '3. Les détecteurs de passage de défaut (DPD) signalent au SCADA le tronçon défaillant.',
        '4. Télécommande d\'ouverture des interrupteurs encadrant le défaut (interrupteur aval de B et amont de C).',
        '5. Réenclenchement du disjoncteur de tête (réalimentation de A et B).',
        '6. Télécommande de fermeture du point normalement ouvert (NO) : réalimentation de C et D par l\'autre côté de la boucle !'
      ],
      en: [
        '1. Insulation fault strikes underground cable between substation B and substation C.',
        '2. Feeder head circuit breaker trips to clear fault current.',
        '3. Fault Passage Indicators (FPI) send directional telemetry to dispatching.',
        '4. Remote switching opens RMU switches framing the faulted cable.',
        '5. Head breaker re-closes, restoring power to upstream substations A & B.',
        '6. Normally Open tie switch closes, restoring substations C & D from the opposite loop feed!'
      ]
    },
    advantages: {
      fr: [
        'Excellente résilience N-1 sans nécessiter de disjoncteurs coûteux dans chaque poste',
        'Possibilité d\'isoler un poste pour maintenance sans interrompre les postes voisins',
        'Investissement mesuré utilisant des Ring Main Units (RMU) standardisées'
      ],
      en: [
        'Superior N-1 resilience without requiring full breakers in every kiosk',
        'Allows seamless planned maintenance on any section without customer blackouts',
        'Cost-effective infrastructure using standardized Ring Main Units (RMU)'
      ]
    },
    disadvantages: {
      fr: [
        'Chaque câble doit être calibré pour supporter la totalité de la charge de la boucle en régime de secours',
        'Nécessite des automates de téléconduite (FLISR) ou des manœuvres humaines coordonnées'
      ],
      en: [
        'Cable cross-section must be sized for full ring load during emergency rerouting',
        'Demands distribution automation (FLISR) or coordinated manual switching'
      ]
    },
    cameroonExample: {
      fr: 'Boucles 30 kV du centre-ville de Yaoundé (Plateau Atemengue, Bastos, Centre Administratif) et Douala Bonanjo.',
      en: '30 kV urban underground rings in downtown Yaoundé (Bastos, Administrative District) and Douala Bonanjo.'
    }
  },
  {
    id: 'meshed',
    name: { fr: 'Réseau Maillé Haute Tension (Mesh Grid)', en: 'Meshed Transmission Grid' },
    typicalApplication: {
      fr: 'Réseau de grand transport 225 kV et sous-réseau de répartition 90 kV.',
      en: 'Bulk 225 kV transmission network and 90 kV regional sub-transmission interties.'
    },
    schematicSummary: {
      fr: 'Chaque nœud (poste) est raccordé par au moins deux ou trois lignes indépendantes formant des mailles fermées interconnectées.',
      en: 'Each substation node is tied to at least two or three independent lines forming closed interconnected polygonal meshes.'
    },
    investmentCost: 'Élevé',
    operationalComplexity: 'Élevée',
    reliabilityRating: 'Excellente (N-1 sans coupure)',
    saidiImpact: {
      fr: 'Très faible (SAIDI de transport < 0.5 heure/an). La perte d\'une ligne 225 kV n\'entraîne aucune interruption de fourniture : l\'énergie se redistribue instantanément selon les lois de Kirchhoff.',
      en: 'Extremely low (Transmission SAIDI < 0.5 hour/year). The instantaneous tripping of a 225 kV circuit causes zero load loss.'
    },
    saifiImpact: {
      fr: 'Presque nul pour les consommateurs finaux en ce qui concerne les incidents de transport.',
      en: 'Near zero customer interruption frequency originating from the transmission tier.'
    },
    faultSequence: {
      fr: [
        '1. La foudre frappe la ligne 225 kV Songloulou-Mangombé terne 1.',
        '2. Les protections de distance 21 et différentielles 87L déclenchent les disjoncteurs des deux extrémités en moins de 50 ms.',
        '3. Le courant de charge se reporte instantanément et sans interruption sur le terne 2 et la liaison parallèle 90 kV.',
        '4. Zéro seconde de coupure pour les usagers de Yaoundé et Douala !',
        '5. Réenclencheur mono/tripolaire referme la ligne après désionisation de l\'arc (0.5 s).'
      ],
      en: [
        '1. Severe lightning strike flashes over 225 kV Songloulou-Mangombé circuit 1.',
        '2. Line differential 87L and distance 21 relays trip circuit breakers at both ends in < 50 ms.',
        '3. Active power transit redistributes automatically across parallel circuit 2 and 90 kV links.',
        '4. Absolute zero interruption of service for metropolitan consumers in Douala/Yaoundé.',
        '5. Single-phase auto-reclosing re-energizes circuit 1 after arc deionization (0.5 s).'
      ]
    },
    advantages: {
      fr: [
        'Sécurité déterministe N-1 garantie en tout point du réseau',
        'Profil de tension plus stable et meilleure répartition des puissances',
        'Flexibilité maximale pour les opérations d\'entretien et de modernisation'
      ],
      en: [
        'Deterministic N-1 compliance guaranteed at all grid nodes',
        'Robust voltage profile and minimized transmission bottlenecks',
        'Maximum operational flexibility for planned overhauls and expansions'
      ]
    },
    disadvantages: {
      fr: [
        'Investissement d\'infrastructure massif en lignes doubles, portiques et postes',
        'Calcul de réglage des protections très complexe (sélectivité de distance et différentielle requise)',
        'Courants de court-circuit très élevés (31.5 kA à 40 kA)'
      ],
      en: [
        'High capital investment in double-circuit corridors and substations',
        'Complex protection relay coordination (quadrilateral zones and optical links)',
        'Substantially higher short-circuit levels (31.5 kA to 40 kA)'
      ]
    },
    cameroonExample: {
      fr: 'Boucle 225 kV du RIS : Songloulou - Mangombé - Logbaba - Bekoko - Nyom II - Nachtigal - Oyomabang.',
      en: 'Southern Interconnected Grid (RIS) 225 kV mesh: Songloulou - Mangombé - Logbaba - Bekoko - Nyom II - Nachtigal.'
    }
  },
  {
    id: 'interconnected',
    name: { fr: 'Réseau Interconnecté Multi-Zones / Régional', en: 'Regional & Transboundary Interconnected Grid' },
    typicalApplication: {
      fr: 'Grands pools énergétiques nationaux et régionaux (ex: interconnexion RIS-RIN au Cameroun, PEAC en Afrique Centrale, WAPP en Afrique de l\'Ouest).',
      en: 'Large multi-system regional pools (Cameroon RIS-RIN intertie, Central African Power Pool PEAC, West African Power Pool WAPP).'
    },
    schematicSummary: {
      fr: 'Interconnexion de systèmes électriques entiers via des lignes d\'interconnexion à très haute tension (225 kV / 400 kV AC ou HVDC).',
      en: 'Intertie linking sovereign power grids through ultra-high voltage (225 kV / 400 kV AC or HVDC) transfer corridors.'
    },
    investmentCost: 'Très Élevé',
    operationalComplexity: 'Avancée',
    reliabilityRating: 'Maximale (N-1 / N-2)',
    saidiImpact: {
      fr: 'Amélioration systémique nationale : permet le secours mutuel entre bassins versants (Sanaga et Bénoué) et l\'effacement des délestages structurels.',
      en: 'System-wide reliability overhaul: mutual support across hydrological basins (Sanaga & Benue), abating chronic seasonal load shedding.'
    },
    saifiImpact: {
      fr: 'Réduction spectaculaire des black-outs généralisés grâce au partage des réserves tournantes.',
      en: 'Mitigates large-scale collapses through pooled primary and secondary frequency reserves.'
    },
    faultSequence: {
      fr: [
        '1. Perte soudaine du plus gros groupe de production d\'une zone (ex: groupe 60 MW Nachtigal).',
        '2. Baisse instantanée de la fréquence sur l\'ensemble du réseau interconnecté (RoCoF).',
        '3. Réponse inertielle immédiate des alternateurs et injection de la réserve primaire (FFR) en quelques secondes.',
        '4. Les lignes d\'interconnexion soutiennent automatiquement la zone déficitaire.',
        '5. Le réglage secondaire centralisé (AGC) du dispatching ramène la fréquence à 50.00 Hz en moins de 3 minutes.'
      ],
      en: [
        '1. Unplanned loss of largest generation unit (e.g. 60 MW Nachtigal hydro turbine).',
        '2. Instantaneous frequency drop across interconnected system (RoCoF).',
        '3. Immediate rotational kinetic inertia delivery followed by primary governor response in < 4 s.',
        '4. Regional interties supply active power into deficit zone automatically.',
        '5. Centralized Automatic Generation Control (AGC) restores frequency to 50.00 Hz in < 3 minutes.'
      ]
    },
    advantages: {
      fr: [
        'Mutualisation des réserves de puissance (réduction de la réserve tournante globale)',
        'Compensation des saisons sèches entre le Nord et le Sud du pays',
        'Échange d\'énergie économique et optimisation du coût marginal du kWh'
      ],
      en: [
        'Pooling of spinning reserves across multiple utilities and river basins',
        'Hydrological complementarity between tropical North and equatorial South',
        'Economic energy trading and dispatch optimization lowering system marginal cost'
      ]
    },
    disadvantages: {
      fr: [
        'Propagation possible des instabilités dynamiques inter-zones sans automatisme de découplage',
        'Nécessite une stricte discipline d\'exploitation et respect du Code de Réseau commun'
      ],
      en: [
        'Risk of propagating inter-area power oscillations without wide-area monitoring and power system stabilizers (PSS)',
        'Demands rigorous regulatory harmonization and unified Grid Code adherence'
      ]
    },
    cameroonExample: {
      fr: 'Projet d\'interconnexion RIS-RIN (Nachtigal - Bafoussam - Ngaoundéré - Garoua) et Projet d\'Interconnexion Électrique Cameroun-Tchad (PIECT).',
      en: 'Planned RIS-RIN 225 kV intertie and Cameroon-Chad regional interconnection project (PIECT).'
    }
  }
];
