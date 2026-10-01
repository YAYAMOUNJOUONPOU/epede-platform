// src/components/distribution/data/distributionTopologiesData.ts
// EPEDE D05 - Distribution Topologies Catalog (Radial, Open Ring, Interconnected)

export interface DistributionTopologyNode {
  id: string;
  label_fr: string;
  label_en: string;
  type: 'SUBSTATION' | 'BREAKER' | 'LINE' | 'RMU' | 'TRANSFORMER' | 'LV_BUS' | 'NOP';
  voltage: string;
  status: 'ENERGIZED' | 'DE_ENERGIZED' | 'FAULTED' | 'ISOLATED' | 'OPEN' | 'CLOSED';
  consumers_count: number;
  critical_consumers: boolean;
}

export interface DistributionTopologyModel {
  id: 'RADIAL' | 'OPEN_RING' | 'INTERCONNECTED';
  name_fr: string;
  name_en: string;
  classification: string;
  capex_index: string;
  reliability_level: 'STANDARD' | 'HIGH' | 'CRITICAL';
  typical_application_fr: string;
  typical_application_en: string;
  operating_principle_fr: string;
  operating_principle_en: string;
  fault_behavior_fr: string;
  fault_behavior_en: string;
  restoration_time_fr: string;
  restoration_time_en: string;
  advantages_fr: string[];
  advantages_en: string[];
  limitations_fr: string[];
  limitations_en: string[];
  nodes: DistributionTopologyNode[];
  saidi_indicative_min: number;
  saifi_indicative_occ: number;
}

export const DISTRIBUTION_TOPOLOGIES: DistributionTopologyModel[] = [
  {
    id: 'RADIAL',
    name_fr: 'Réseau Radial en Antenne (Arborescent)',
    name_en: 'Radial Feeder Architecture (Tree Topology)',
    classification: 'Architecture Économique Standard',
    capex_index: 'Faible (1.0x Référence)',
    reliability_level: 'STANDARD',
    typical_application_fr: 'Zones rurales, périurbaines étendues, zones agricoles et électrification rurale où la densité de charge ne justifie pas un second feeder.',
    typical_application_en: 'Rural regions, extended suburban fringes, agricultural belts, and rural electrification programs where low load density limits feeder investment.',
    operating_principle_fr: 'L\'énergie chemine dans un seul sens depuis le poste source le long d\'une artère maîtresse qui bifurque en ramifications.',
    operating_principle_en: 'Power flows in a single unidirectional vector from the primary substation down the main feeder and subsequent branch laterals.',
    fault_behavior_fr: 'Un défaut sur l\'artère principale provoque l\'ouverture du disjoncteur de tête et prive la totalité des abonnés en aval jusqu\'à réparation physique.',
    fault_behavior_en: 'A fault anywhere along the main backbone trips the feeder head breaker, blacking out all downstream customers until physical repair is complete.',
    restoration_time_fr: 'Plusieurs heures (nécessite le déplacement d\'équipes d\'intervention pour localiser et réparer la ligne coupée).',
    restoration_time_en: 'Several hours (requires dispatching field line crews to patrol, pinpoint, isolate, and repair the damaged span).',
    advantages_fr: [
      'Coût d\'investissement minimal en lignes et en appareillages',
      'Protection simplifiée sans besoin de relais directionnels',
      'Exploitation intuitive sans risque de bouclage accidentel',
      'Calculs de court-circuit élémentaires et prévisibles'
    ],
    advantages_en: [
      'Lowest capital investment in conductors, poles, and switchgear',
      'Simple overcurrent protection coordination without directional elements',
      'Straightforward operation with zero risk of inadvertent paralleling',
      'Elementary and deterministic short-circuit calculations'
    ],
    limitations_fr: [
      'Aucune redondance : indisponibilité totale en aval du point de défaut',
      'Chute de tension cumulative importante en extrémité de ligne',
      'Indicateurs SAIDI et SAIFI élevés en cas d\'aléa climatique',
      'Difficulté d\'intégrer de fortes proportions de production photovoltaïque décentralisée'
    ],
    limitations_en: [
      'Zero structural redundancy: total outage downstream of any fault',
      'Cumulative voltage drop along extended feeder end-points',
      'High SAIDI and SAIFI metrics during severe weather disturbances',
      'Constrained hosting capacity for decentralized rooftop solar PV'
    ],
    saidi_indicative_min: 240,
    saifi_indicative_occ: 4.8,
    nodes: [
      { id: 'rad-source', label_fr: 'Poste Source 30 kV', label_en: 'Primary Substation 30 kV', type: 'SUBSTATION', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false },
      { id: 'rad-cb', label_fr: 'Disjoncteur Q0', label_en: 'Feeder Breaker Q0', type: 'BREAKER', voltage: '30 kV', status: 'CLOSED', consumers_count: 0, critical_consumers: false },
      { id: 'rad-line1', label_fr: 'Tronçon Aérien T1 (12 km)', label_en: 'Overhead Span T1 (12 km)', type: 'LINE', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false },
      { id: 'rad-sub1', label_fr: 'Poste H61 Village Nord (100 kVA)', label_en: 'Village North H61 Trafo (100 kVA)', type: 'TRANSFORMER', voltage: '30 kV / 400 V', status: 'ENERGIZED', consumers_count: 140, critical_consumers: false },
      { id: 'rad-line2', label_fr: 'Tronçon Aérien T2 (18 km)', label_en: 'Overhead Span T2 (18 km)', type: 'LINE', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false },
      { id: 'rad-sub2', label_fr: 'Poste Kiosque Bourg (250 kVA)', label_en: 'Town Kiosk Trafo (250 kVA)', type: 'TRANSFORMER', voltage: '30 kV / 400 V', status: 'ENERGIZED', consumers_count: 320, critical_consumers: false },
      { id: 'rad-line3', label_fr: 'Tronçon Extrémité T3 (15 km)', label_en: 'Terminal Span T3 (15 km)', type: 'LINE', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false },
      { id: 'rad-sub3', label_fr: 'Poste Pompage Agricole (160 kVA)', label_en: 'Agri Water Pumping (160 kVA)', type: 'TRANSFORMER', voltage: '30 kV / 400 V', status: 'ENERGIZED', consumers_count: 45, critical_consumers: true }
    ]
  },
  {
    id: 'OPEN_RING',
    name_fr: 'Réseau en Boucle Ouverte (Ring Main avec NOP)',
    name_en: 'Open Ring Loop Network (Normally Open Point)',
    classification: 'Standard Urbain Haute Fiabilité',
    capex_index: 'Moyen-Élevé (1.8x Référence)',
    reliability_level: 'HIGH',
    typical_application_fr: 'Centres-villes denses, zones résidentielles urbaines, parcs d\'activités tertiaires et zones industrielles raccordées en câble souterrain.',
    typical_application_en: 'Dense urban cores, metropolitan residential quarters, commercial office campuses, and underground industrial zones.',
    operating_principle_fr: 'Deux artères issues du même poste (ou de deux postes sources distincts) se rejoignent au niveau d\'un interrupteur maintenu ouvert : le Point d\'Ouverture Normal (NOP).',
    operating_principle_en: 'Two feeders originate from the same (or distinct) primary substations and meet at a switch intentionally kept OPEN: the Normally Open Point (NOP).',
    fault_behavior_fr: 'Un défaut sur un câble est isolé par les interrupteurs RMU adjacents ; la fermeture du NOP permet de réalimenter les abonnés sains par l\'autre demi-boucle.',
    fault_behavior_en: 'A cable fault is rapidly isolated by adjacent RMU load-break switches; closing the NOP restores healthy customers from the alternate supply path.',
    restoration_time_fr: 'Inférieure à 1 minute avec automatisme FLISR / télécommande SCADA (quelques dizaines de minutes en manœuvre manuelle sur site).',
    restoration_time_en: 'Sub-minute restoration with FLISR automation / SCADA remote control (< 30 minutes for manual field crew switching).',
    advantages_fr: [
      'Redondance $N-1$ sur chaque poste de transformation de la boucle',
      'Réduction drastique du temps d\'interruption (SAIDI très faible)',
      'Possibilité de réaliser la maintenance des câbles sans coupure d\'abonnés',
      'Optimisation des profils de tension grâce à l\'ajustement de la position du NOP'
    ],
    advantages_en: [
      'N-1 structural redundancy for every distribution kiosk on the loop',
      'Drastic reduction in customer outage duration (significantly lower SAIDI)',
      'Scheduled cable maintenance executed with zero customer interruption',
      'Voltage profile optimization by adjusting the physical location of the NOP'
    ],
    limitations_fr: [
      'Coût initial supérieur en génie civil souterrain et tableaux RMU motorisés',
      'Nécessité d\'un dimensionnement thermique des câbles pour supporter le report total de charge',
      'Coordination des protections plus complexe en cas de reports de charge inhabituels',
      'Gestion rigoureuse du point d\'ouverture pour éviter un bouclage non synchronisé'
    ],
    limitations_en: [
      'Higher initial Capex in underground duct civil works and motorized RMUs',
      'Feeder cables must be thermally rated to accommodate full emergency load transfer',
      'More complex protection coordination during unusual emergency configurations',
      'Strict interlock discipline required to prevent unsynchronized closed-ring operation'
    ],
    saidi_indicative_min: 35,
    saifi_indicative_occ: 1.2,
    nodes: [
      { id: 'ring-src-a', label_fr: 'Poste Source A (Départ 1)', label_en: 'Primary Sub A (Feeder 1)', type: 'SUBSTATION', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false },
      { id: 'ring-cb-a', label_fr: 'Disjoncteur QA', label_en: 'Feeder Breaker QA', type: 'BREAKER', voltage: '30 kV', status: 'CLOSED', consumers_count: 0, critical_consumers: false },
      { id: 'ring-rmu1', label_fr: 'Poste Kiosque A1 - Mairie (630 kVA)', label_en: 'Kiosk A1 - City Hall (630 kVA)', type: 'RMU', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 480, critical_consumers: true },
      { id: 'ring-rmu2', label_fr: 'Poste Kiosque A2 - Résidentiel (400 kVA)', label_en: 'Kiosk A2 - Residential (400 kVA)', type: 'RMU', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 360, critical_consumers: false },
      { id: 'ring-nop', label_fr: 'Point d\'Ouverture Normal (NOP)', label_en: 'Normally Open Point (NOP)', type: 'NOP', voltage: '30 kV', status: 'OPEN', consumers_count: 0, critical_consumers: false },
      { id: 'ring-rmu3', label_fr: 'Poste Kiosque B1 - Hôpital Annexe (630 kVA)', label_en: 'Kiosk B1 - Clinic Annex (630 kVA)', type: 'RMU', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 510, critical_consumers: true },
      { id: 'ring-rmu4', label_fr: 'Poste Kiosque B2 - Zone Artisanale (400 kVA)', label_en: 'Kiosk B2 - Commercial Hub (400 kVA)', type: 'RMU', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 290, critical_consumers: false },
      { id: 'ring-cb-b', label_fr: 'Disjoncteur QB', label_en: 'Feeder Breaker QB', type: 'BREAKER', voltage: '30 kV', status: 'CLOSED', consumers_count: 0, critical_consumers: false },
      { id: 'ring-src-b', label_fr: 'Poste Source B (Départ 2)', label_en: 'Primary Sub B (Feeder 2)', type: 'SUBSTATION', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false }
    ]
  },
  {
    id: 'INTERCONNECTED',
    name_fr: 'Réseau Maillé / Double Dérivation (Interconnecté)',
    name_en: 'Interconnected / Primary Selective Mesh Network',
    classification: 'Ultra Haute Disponibilité (Infrastructures Critiques)',
    capex_index: 'Très Élevé (2.6x Référence)',
    reliability_level: 'CRITICAL',
    typical_application_fr: 'Hôpitaux universitaires, centres de données (Data Centers), aéroports internationaux, métros et complexes industriels stratégiques.',
    typical_application_en: 'University medical centers, hyperscale data centers, international airports, urban metro traction, and petrochemical complexes.',
    operating_principle_fr: 'Chaque poste client ou nœud stratégique est raccordé simultanément à deux feeders indépendants via un automatisme d\'inversion de source (ATS) ou un couplage en boucle fermée.',
    operating_principle_en: 'Every critical consumer node is connected simultaneously to two independent feeders with automatic transfer switching (ATS) or closed-loop mesh protection.',
    fault_behavior_fr: 'La perte d\'une artère entraîne le basculement automatique instantané (< 100 ms) ou sans interruption sur la seconde source disponible.',
    fault_behavior_en: 'Loss of any primary supply feeder triggers an instantaneous automatic transfer (< 100 ms) or seamless parallel power transition.',
    restoration_time_fr: 'Moins de 1 seconde (automatique) ou imperceptible pour les charges secourues.',
    restoration_time_en: 'Sub-second automatic transfer or seamless uninterrupted continuity.',
    advantages_fr: [
      'Continuité d\'alimentation quasi-parfaite pour les services vitaux',
      'Tolérance aux pannes multiples sur le réseau amont',
      'Capacité de transit et d\'évacuation de puissance maximale',
      'Permet l\'injection massive d\'énergies renouvelables et de stockage BESS'
    ],
    advantages_en: [
      'Near-perfect supply continuity for critical and vital life-safety loads',
      'Robust tolerance to concurrent upstream network disturbances',
      'Maximum power transfer capacity and flexible flow control',
      'Accommodates high penetration of renewable solar/wind generation and BESS'
    ],
    limitations_fr: [
      'Complexité extrême du plan de protection (relais différentiels de ligne et jeux de barres)',
      'Courants de court-circuit très élevés imposant des disjoncteurs à fort pouvoir de coupure (Icu 31.5 kA)',
      'Nécessite des réseaux de télécommunications fibre optique ultra-rapides et déterministes',
      'Coûts d\'investissement et d\'ingénierie les plus élevés du secteur'
    ],
    limitations_en: [
      'Extreme protection engineering complexity (pilot differential 87L and directional 67/67N)',
      'Significantly higher short-circuit levels requiring 31.5 kA interrupting ratings',
      'Requires deterministic high-speed fiber-optic teleprotection channels',
      'Highest initial capital expenditure and specialized engineering overhead'
    ],
    saidi_indicative_min: 5,
    saifi_indicative_occ: 0.2,
    nodes: [
      { id: 'mesh-src1', label_fr: 'Poste Source 1 (Transfo 1)', label_en: 'Primary Substation 1 (Trafo 1)', type: 'SUBSTATION', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false },
      { id: 'mesh-src2', label_fr: 'Poste Source 2 (Transfo 2)', label_en: 'Primary Substation 2 (Trafo 2)', type: 'SUBSTATION', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false },
      { id: 'mesh-f1', label_fr: 'Artère Voie Normale A', label_en: 'Primary Feeder Line A', type: 'LINE', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false },
      { id: 'mesh-f2', label_fr: 'Artère Voie Secours B', label_en: 'Redundant Feeder Line B', type: 'LINE', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 0, critical_consumers: false },
      { id: 'mesh-node-hosp', label_fr: 'Poste Hôpital Central - Permutateur ATS', label_en: 'Central Hospital Substation - ATS', type: 'RMU', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 850, critical_consumers: true },
      { id: 'mesh-node-data', label_fr: 'Poste Data Center Tier IV - Double Arrivée', label_en: 'Tier IV Data Center - Dual Incomers', type: 'RMU', voltage: '30 kV', status: 'ENERGIZED', consumers_count: 120, critical_consumers: true }
    ]
  }
];
