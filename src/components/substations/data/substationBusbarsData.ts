// src/components/substations/data/substationBusbarsData.ts
// EPEDE D04 - Substation Busbar Topologies & Switching Schemes Catalog

export interface BusbarTopologyDefinition {
  id: string;
  code: string;
  name_fr: string;
  name_en: string;
  circuit_breaker_ratio: string;
  switching_flexibility_fr: string;
  switching_flexibility_en: string;
  maintenance_flexibility_fr: string;
  maintenance_flexibility_en: string;
  fault_impact_fr: string;
  fault_impact_en: string;
  reliability_score: number; // 1 to 10
  capex_relative: string;
  representative_applications_fr: string;
  representative_applications_en: string;
  diagram_ascii: string;
  key_advantages_fr: string[];
  key_advantages_en: string[];
  key_limitations_fr: string[];
  key_limitations_en: string[];
}

export const BUSBAR_TOPOLOGIES_CATALOG: BusbarTopologyDefinition[] = [
  {
    id: 'BUS_SINGLE',
    code: 'TOPO-SIMPLE-BARRE',
    name_fr: 'Simple Jeu de Barres',
    name_en: 'Single Busbar Scheme',
    circuit_breaker_ratio: '1 disjoncteur par départ (1 CB / circuit)',
    switching_flexibility_fr: 'Minimale : tous les départs sont attachés à la même barre unique.',
    switching_flexibility_en: 'Minimal: all circuits are terminated on a single shared common bus.',
    maintenance_flexibility_fr: 'Nulle : la maintenance du jeu de barres impose la coupure totale de tout le poste.',
    maintenance_flexibility_en: 'Zero: maintenance on the busbar requires de-energizing the entire substation.',
    fault_impact_fr: 'Catastrophique : un défaut sur la barre déclenche tous les disjoncteurs et interrompt tout le nœud.',
    fault_impact_en: 'Catastrophic: a single busbar fault trips all incoming and outgoing breakers, blacking out the node.',
    reliability_score: 3,
    capex_relative: '1.0x (Coût minimal absolu)',
    representative_applications_fr: 'Petits postes de distribution 15/30 kV, postes ruraux ou industriels non critiques.',
    representative_applications_en: 'Small distribution 15/30 kV substations, non-critical industrial or rural sites.',
    diagram_ascii: `
  ══════════════════════════════ [JEU DE BARRES UNIQUE]
     │          │          │
    [CB]       [CB]       [CB]
     │          │          │
   Départ 1   Départ 2   Arrivée
    `,
    key_advantages_fr: [
      'Investissement initial le plus économique possible',
      'Encombrement au sol très réduit',
      'Schéma unifilaire d\'une simplicité élémentaire',
      'Automates et verrouillages extrêmement simples'
    ],
    key_advantages_en: [
      'Lowest capital expenditure among all substation schemes',
      'Minimal physical footprint requirements',
      'Straightforward single-line diagram with minimal apparatus',
      'Simple protection and interlocking logic'
    ],
    key_limitations_fr: [
      'Aucune redondance : un défaut barre met tout le poste hors service',
      'Impossible de consigner la barre sans coupure totale des consommateurs',
      'Toute extension future nécessite une interruption complète'
    ],
    key_limitations_en: [
      'Zero redundancy: a single bus fault forces total substation shutdown',
      'Impossible to maintain busbars without cutting off all supply',
      'Future bay additions require widespread utility outages'
    ]
  },
  {
    id: 'BUS_SECTIONALIZED',
    code: 'TOPO-BARRE-TRONCONNEE',
    name_fr: 'Simple Jeu de Barres Tronçonné',
    name_en: 'Sectionalized Single Busbar Scheme',
    circuit_breaker_ratio: '1 disjoncteur par départ + 1 disjoncteur de tronçonnement',
    switching_flexibility_fr: 'Modérée : permet de séparer le poste en deux demi-postes indépendants.',
    switching_flexibility_en: 'Moderate: allows dividing the substation into two independent operating sections.',
    maintenance_flexibility_fr: 'Partielle : un demi-jeu de barres peut être consigné pendant que l\'autre fonctionne.',
    maintenance_flexibility_en: 'Partial: one section can be maintained while the remaining section stays energized.',
    fault_impact_fr: 'Limité à 50% : un défaut barre n\'affecte que le demi-poste concerné ; le tronçonnement isole l\'autre moitié.',
    fault_impact_en: 'Limited to 50%: a bus fault only isolates the affected section; the sectionalizer protects the rest.',
    reliability_score: 5,
    capex_relative: '1.2x',
    representative_applications_fr: 'Postes sources 90/15 kV avec 2 transformateurs alimentant chacun une section.',
    representative_applications_en: '90/15 kV distribution substations with dual transformers feeding split sections.',
    diagram_ascii: `
  ═══════════════╤═══════════════ [BARRE SECTION 1]
     │           │
    [CB]        [CB-Section]
     │           │
   Départ 1      │
  ═══════════════╧═══════════════ [BARRE SECTION 2]
     │           │
    [CB]        [CB]
     │           │
   Départ 2    Arrivée
    `,
    key_advantages_fr: [
      'Isole les défauts à une seule moitié de poste',
      'Permet d\'alimenter des charges prioritaires sur la section saine',
      'Coût modéré pour une résilience grandement améliorée par rapport à la barre simple'
    ],
    key_advantages_en: [
      'Restricts busbar faults to a single half of the switchyard',
      'Preserves critical supplies on the healthy busbar section',
      'Modest additional investment for significantly elevated reliability'
    ],
    key_limitations_fr: [
      'La maintenance d\'un tronçon impose toujours la coupure des départs qui y sont raccordés',
      'Pas de possibilité de transférer dynamiquement un départ d\'une section à l\'autre'
    ],
    key_limitations_en: [
      'De-energizing a section still interrupts all feeders connected to that specific section',
      'No flexible on-load transfer of individual feeders between sections'
    ]
  },
  {
    id: 'BUS_DOUBLE',
    code: 'TOPO-DOUBLE-BARRE',
    name_fr: 'Double Jeu de Barres (Double Busbar)',
    name_en: 'Double Busbar Scheme',
    circuit_breaker_ratio: '1 disjoncteur par départ + 1 disjoncteur de couplage (1 CB + 2 isolateurs de sélection)',
    switching_flexibility_fr: 'Élevée : chaque travée peut être aiguillée vers la Barre 1 ou la Barre 2 via ses sectionneurs.',
    switching_flexibility_en: 'High: every circuit can be dynamically routed to Bus 1 or Bus 2 via selector disconnectors.',
    maintenance_flexibility_fr: 'Excellente : transfert de tous les départs sur une barre via le couplage, libérant l\'autre barre pour entretien sans coupure.',
    maintenance_flexibility_en: 'Excellent: live transfer of all feeders to one busbar via the bus coupler clears the other bus for maintenance with zero outage.',
    fault_impact_fr: 'Très faible : un défaut sur une barre est éliminé par la protection 87B ; tous les départs sains basculent sur la seconde barre.',
    fault_impact_en: 'Very low: a bus fault is cleared by 87B differential; healthy circuits continue uninterrupted or are transferred.',
    reliability_score: 8,
    capex_relative: '1.5x (Standard transport SONATREL / RTE / National Grid)',
    representative_applications_fr: 'Standard absolu des réseaux de transport 225 kV et 90 kV (ex. Bekoko, Mangombe, Oyomabang).',
    representative_applications_en: 'Dominant standard for 225 kV and 90 kV transmission nodes (e.g. Bekoko, Mangombe).',
    diagram_ascii: `
  ══════════════════════════════════════════ [JEU DE BARRES 1]
     │ (Q1)     │ (Q1)     │ (Q1)     │ (Q1-Coupler)
     │          │          │          │
     │ (Q2)     │ (Q2)     │ (Q2)    [CB-Coupler]
     │          │          │          │
  ════════════════════════════════════╪═════ [JEU DE BARRES 2]
     │          │          │          │ (Q2-Coupler)
    [CB]       [CB]       [CB]        │
     │          │          │          │
   Ligne 1    Ligne 2    Transfo 1    Couplage
    `,
    key_advantages_fr: [
      'Maintenance complète d\'un jeu de barres sans aucune interruption de fourniture',
      'Ségrégation des charges et des centrales (exploitation en deux nœuds électriques distincts)',
      'Possibilité de basculer un départ sous charge grâce à la travée de couplage'
    ],
    key_advantages_en: [
      'Complete overhaul of either busbar without interrupting power flow',
      'Operational splitting into two independent electrical nodes when required',
      'Seamless live on-load feeder transfer supported by the bus coupler bay'
    ],
    key_limitations_fr: [
      'Nécessite deux sectionneurs d\'aiguillage motorisés par travée',
      'Le disjoncteur de ligne reste un élément unique : sa maintenance exige la consignation de la ligne (sauf schéma avec barre de transfert)'
    ],
    key_limitations_en: [
      'Requires dual motorized selector disconnectors per bay and complex interlocking',
      'Individual circuit breaker maintenance still requires taking that circuit out of service'
    ]
  },
  {
    id: 'BUS_BREAKER_HALF',
    code: 'TOPO-DISJONCTEUR-DEMI',
    name_fr: 'Disjoncteur et Demi (Breaker-and-a-Half / 1½ CB)',
    name_en: 'Breaker-and-a-Half Scheme (1½ CB)',
    circuit_breaker_ratio: '1.5 disjoncteur par circuit (3 disjoncteurs pour 2 départs)',
    switching_flexibility_fr: 'Maximale absolue : chaque départ est raccordé entre deux disjoncteurs consécutifs.',
    switching_flexibility_en: 'Maximum: every circuit terminates between two series circuit breakers.',
    maintenance_flexibility_fr: 'Parfaite : n\'importe quel disjoncteur peut être consigné et révisé sans interrompre aucun départ ni aucune barre.',
    maintenance_flexibility_en: 'Perfect: any circuit breaker can be isolated and serviced without taking any line or bus out of service.',
    fault_impact_fr: 'Nul sur les circuits : un défaut sur un jeu de barres ne coupe aucun départ (ils continuent à être alimentés par l\'autre barre).',
    fault_impact_en: 'Zero circuit impact: a bus fault trips only the adjacent breaker, leaving all lines fed via the other busbar.',
    reliability_score: 10,
    capex_relative: '2.1x (Coût d\'appareillage et emprise élevés)',
    representative_applications_fr: 'Grands postes de transport d\'énergie THT 400 kV et nœuds d\'évacuation de très grandes centrales nucléaires ou hydroélectriques.',
    representative_applications_en: '400 kV bulk supergrid hubs, nuclear/mega-hydro plant evacuation yards, critical international interties.',
    diagram_ascii: `
  ═════════════════════════════════ [JEU DE BARRES 1]
                 │
               [CB 1]
                 │
                 ├────────── LIGNE / DÉPART A
                 │
               [CB 2 - Central]
                 │
                 ├────────── LIGNE / DÉPART B
                 │
               [CB 3]
                 │
  ═════════════════════════════════ [JEU DE BARRES 2]
    `,
    key_advantages_fr: [
      'Disponibilité et sécurité d\'exploitation les plus élevées au monde',
      'Aucune perte de départ en cas de défaut sur la Barre 1 ou la Barre 2',
      'Maintenance complète de n\'importe quel disjoncteur sans aucune manœuvre de transfert'
    ],
    key_advantages_en: [
      'Highest operational availability and security recognized worldwide',
      'Zero circuit loss in the event of a fault on either main busbar',
      'Any breaker can be opened for maintenance without interrupting any circuit'
    ],
    key_limitations_fr: [
      'Nombre de disjoncteurs augmenté de 50% par rapport à un schéma classique',
      'Protection de barres et relais de défaillance disjoncteur 50BF plus complexes',
      'Emprise au sol très importante'
    ],
    key_limitations_en: [
      '50% more circuit breakers required (3 breakers for every 2 circuits)',
      'More complex protection zoning and breaker-failure cross-tripping logic',
      'Substantially higher switchyard footprint and investment'
    ]
  },
  {
    id: 'BUS_RING',
    code: 'TOPO-BOUCLE-ANNEAU',
    name_fr: 'Jeu de Barres en Anneau (Ring Bus)',
    name_en: 'Ring Bus Scheme',
    circuit_breaker_ratio: '1 disjoncteur par circuit (N disjoncteurs pour N circuits)',
    switching_flexibility_fr: 'Élevée : circuits disposés en boucle fermée entre des disjoncteurs en série.',
    switching_flexibility_en: 'High: circuits arranged in a closed loop between series circuit breakers.',
    maintenance_flexibility_fr: 'Très bonne : un disjoncteur peut être ouvert sans interrompre aucun départ (l\'anneau s\'ouvre simplement).',
    maintenance_flexibility_en: 'Very good: any breaker can be racked out without interrupting any circuit (ring simply opens).',
    fault_impact_fr: 'Faible à modéré : un défaut de ligne n\'ouvre que les deux disjoncteurs encadrants ; l\'anneau reste opérationnel.',
    fault_impact_en: 'Low to moderate: a line fault trips the two bounding breakers; remaining ring nodes stay connected.',
    reliability_score: 8,
    capex_relative: '1.4x',
    representative_applications_fr: 'Postes de transport 132/225 kV de 4 à 8 départs où le coût du disjoncteur et demi est jugé excessif.',
    representative_applications_en: '132/225 kV transmission nodes with 4 to 8 circuits balancing cost and high reliability.',
    diagram_ascii: `
         ┌─────[CB 1]─────┬─────[CB 2]─────┐
         │                │                │
      Ligne 1          Ligne 2          Ligne 3
         │                │                │
       [CB 4]─────────────┴─────────────[CB 3]
         │
      Ligne 4
    `,
    key_advantages_fr: [
      'Chaque départ est alimenté par deux côtés de l\'anneau',
      'Pas de barres principales au sens conventionnel, diminuant le risque de défaut généralisé',
      'Excellente fiabilité pour un ratio de 1 disjoncteur par départ'
    ],
    key_advantages_en: [
      'Every circuit is fed via dual paths around the closed ring',
      'Eliminates vulnerable centralized busbars, reducing common-mode flashovers',
      'High reliability achieved with an economical 1 breaker per circuit ratio'
    ],
    key_limitations_fr: [
      'Si un second disjoncteur ouvre pendant qu\'un premier est en maintenance, l\'anneau se fractionne',
      'Difficile d\'étendre l\'anneau au-delà de 6 à 8 départs sans dégrader l\'exploitation'
    ],
    key_limitations_en: [
      'If a fault occurs while one breaker is out for maintenance, the ring splits into islands',
      'Complex to expand beyond 6 to 8 circuits without reorganizing the physical layout'
    ]
  }
];
