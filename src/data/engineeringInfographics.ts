// src/data/engineeringInfographics.ts
// Metadata, technical annotations, and references for the 8 core power systems infographics

export interface InfographicHotspot {
  id: string;
  name_fr: string;
  name_en: string;
  category: 'EQUIPMENT' | 'ZONE' | 'SAFETY' | 'STAGE';
  description_fr: string;
  description_en: string;
  standard?: string;
}

export interface EngineeringInfographic {
  id: string;
  fileName: string;
  originalFileName: string;
  title_fr: string;
  title_en: string;
  subtitle_fr: string;
  subtitle_en: string;
  category: 'OVERVIEW' | 'TRANSMISSION' | 'SUBSTATION' | 'PROTECTION' | 'SAFETY' | 'GENERATION' | 'DISTRIBUTION';
  requiredLocation_fr: string;
  requiredLocation_en: string;
  associatedViews: string[];
  keyStandards: string[];
  keyTakeaway_fr: string;
  keyTakeaway_en: string;
  hotspots: InfographicHotspot[];
}

export const ENGINEERING_INFOGRAPHICS: Record<string, EngineeringInfographic> = {
  'what-is-power-systems': {
    id: 'what-is-power-systems',
    fileName: 'What-is-Power-Systems-Engineering.jpg',
    originalFileName: 'What-is-Power-Systems-Engineering.jpg',
    title_fr: "Qu'est-ce que le Génie des Systèmes Électriques ?",
    title_en: 'What is Power Systems Engineering?',
    subtitle_fr: 'Production, Transport, Distribution et Utilisation de l\'Énergie Électrique',
    subtitle_en: 'Generation, Transmission, Distribution, & Utilization of Electrical Energy',
    category: 'OVERVIEW',
    requiredLocation_fr: 'Page d\'Accueil (Home), Vue d\'Ensemble EPEDE & Architecture Système',
    requiredLocation_en: 'Home View, EPEDE Overview & System Architecture',
    associatedViews: ['home', 'journey', 'cameroon-grid'],
    keyStandards: ['CEI 60038', 'IEEE 399', 'CEI 61970 (CIM)'],
    keyTakeaway_fr: 'Le génie des réseaux électriques synchronise la production (thermique, hydro, solaire, éolien), le transport THT grande distance, les postes d\'interconnexion et la distribution finale vers les usagers industriels, tertiaires et résidentiels sous le contrôle permanent du centre de conduite (SCADA/EMS).',
    keyTakeaway_en: 'Power systems engineering interconnects diverse generation sources, bulk high-voltage transmission lines, transmission and distribution substations, and end-use customer loads, continuously orchestrated by real-time dispatch control centers.',
    hotspots: [
      {
        id: 'GEN_THERMAL',
        name_fr: 'Production Thermique',
        name_en: 'Thermal Generation',
        category: 'STAGE',
        description_fr: 'Centrales thermiques fossiles ou biomasse produisant l\'énergie de base ou de pointe.',
        description_en: 'Thermal fossil/gas/biomass plants delivering baseload or peak power.'
      },
      {
        id: 'GEN_RENEWABLE',
        name_fr: 'Énergies Renouvelables (Éolien & Solaire)',
        name_en: 'Renewables (Wind & Solar)',
        category: 'STAGE',
        description_fr: 'Production intermittente raccordée via onduleurs électroniques de puissance.',
        description_en: 'Inverter-based variable generation from wind turbines and solar PV arrays.'
      },
      {
        id: 'SUB_TRANS',
        name_fr: 'Poste de Transport (Élévateur)',
        name_en: 'Transmission Substation',
        category: 'EQUIPMENT',
        description_fr: 'Élévation de tension (11-15 kV ➔ 225 kV) pour minimiser les pertes Joule en ligne.',
        description_en: 'Step-up voltage transformation (11-15 kV ➔ 225 kV) reducing line resistive losses.'
      },
      {
        id: 'TRANS_LINES',
        name_fr: 'Transport Haute Tension (Lignes THT)',
        name_en: 'High-Voltage Transmission',
        category: 'STAGE',
        description_fr: 'Pylônes métalliques en treillis et conducteurs aériens pour transport massif longue distance.',
        description_en: 'Lattice steel pylons carrying bulk power over long inter-regional corridors.'
      },
      {
        id: 'SUB_DISTRIB',
        name_fr: 'Poste Source de Distribution',
        name_en: 'Distribution Substation',
        category: 'EQUIPMENT',
        description_fr: 'Abaissement de tension vers la moyenne tension (MT 30 kV / 15 kV) et départs urbains.',
        description_en: 'Step-down substation feeding medium-voltage urban and rural distribution feeders.'
      },
      {
        id: 'UTILIZATION',
        name_fr: 'Utilisation Finale (Industrie, Tertiaire, Résidentiel & VE)',
        name_en: 'Utilization (Industrial, Commercial, Residential & EV)',
        category: 'STAGE',
        description_fr: 'Consommation finale aux tensions normalisées (400V triphasé / 230V monophasé).',
        description_en: 'Customer load consumption at standardized low voltages (400V 3-phase / 230V 1-phase).'
      },
      {
        id: 'SCADA_CONTROL',
        name_fr: 'Centre de Conduite & Dispatching (SCADA/EMS)',
        name_en: 'Grid Management & Control Center',
        category: 'STAGE',
        description_fr: 'Supervision temps réel, régulation fréquence-tension et équilibrage offre-demande.',
        description_en: 'Real-time telemetry, frequency/voltage regulation, and supply-demand balancing.'
      }
    ]
  },

  'transmission-vs-distribution': {
    id: 'transmission-vs-distribution',
    fileName: 'Transmission-vs-Distrbution.png',
    originalFileName: 'Transmission-vs-Distrbution.png',
    title_fr: 'Transport vs Distribution : Deux Mondes Complémentaires',
    title_en: 'Transmission vs Distribution: Two Complementary Systems',
    subtitle_fr: 'L\'électricité circule des réseaux de transport THT vers les réseaux de distribution MT/BT',
    subtitle_en: 'Electricity moves from high-voltage transmission systems into local distribution systems',
    category: 'TRANSMISSION',
    requiredLocation_fr: 'Atelier Réseaux de Transport (Transmission Workbench) & Distribution Explorer',
    requiredLocation_en: 'Transmission Workbench (Comparison Tab) & Distribution Explorer',
    associatedViews: ['transmission', 'distribution', 'domain'],
    keyStandards: ['CEI 60038', 'CEI 61936-1', 'IEEE C2 (NESC)'],
    keyTakeaway_fr: 'Le Transport THT (225/90 kV) gère le transit massif interrégional à très haute tension sur pylônes métalliques ; la Distribution MT/BT (30 kV / 400V) assure l\'acheminement capillaire local vers les consommateurs sur poteaux bois/béton.',
    keyTakeaway_en: 'Transmission handles bulk long-distance power transfer at extra-high voltages on steel towers; Distribution delivers low-voltage electricity directly to homes and businesses via local pole networks and transformers.',
    hotspots: [
      {
        id: 'HV_LEVELS',
        name_fr: 'Haute Tension (THT)',
        name_en: 'High Voltage',
        category: 'EQUIPMENT',
        description_fr: 'Niveaux de tension élevés (60 kV à 765 kV ; 225/90 kV au Cameroun).',
        description_en: 'Bulk transmission voltages ranging from 60 kV up to 765 kV.'
      },
      {
        id: 'LONG_DISTANCE',
        name_fr: 'Longue Distance',
        name_en: 'Long Distance',
        category: 'STAGE',
        description_fr: 'Corridors régionaux reliant les barrages et centrales éloignées aux grands centres urbains.',
        description_en: 'Hundreds of kilometers connecting remote generating dams to load centers.'
      },
      {
        id: 'BULK_TRANSFER',
        name_fr: 'Transit de Masse (Bulk Power)',
        name_en: 'Bulk Power Transfer',
        category: 'STAGE',
        description_fr: 'Centaines de mégawatts véhiculés avec un rendement énergétique supérieur à 97%.',
        description_en: 'Hundreds of megawatts transported with high electrical transmission efficiency.'
      },
      {
        id: 'LOWER_VOLTAGE',
        name_fr: 'Moyenne & Basse Tension (MT / BT)',
        name_en: 'Lower Voltage',
        category: 'EQUIPMENT',
        description_fr: '33 kV, 30 kV, 15 kV (MT) et 400V triphasé / 230V monophasé (BT).',
        description_en: 'Medium voltage (15-33 kV) and low voltage (400V/230V) consumer levels.'
      },
      {
        id: 'LOCAL_DELIVERY',
        name_fr: 'Acheminement Local & Capillaire',
        name_en: 'Local Delivery',
        category: 'STAGE',
        description_fr: 'Réseaux maillés ou radiaux arpentant chaque quartier, rue et zone d\'activité.',
        description_en: 'Radial and looped feeder circuits servicing streets and industrial zones.'
      }
    ]
  },

  'substation-overview': {
    id: 'substation-overview',
    fileName: 'Substation-Overview.png',
    originalFileName: 'Substation-Overview.png',
    title_fr: 'Vue d\'Ensemble du Poste Haute Tension',
    title_en: 'High-Voltage Substation Overview',
    subtitle_fr: 'L\'enchaînement canonique de puissance : Arrivée THT ➔ Disjoncteur ➔ Transformateur ➔ Jeu de Barres ➔ Départs',
    subtitle_en: 'Canonical power flow: Incoming Transmission ➔ Circuit Breaker ➔ Transformer ➔ Busbar ➔ Outgoing Feeders',
    category: 'SUBSTATION',
    requiredLocation_fr: 'Atelier Postes Électriques (Substations Workbench) & Parcours Électrique',
    requiredLocation_en: 'Substations Workbench (Electrical Journey & Bay Architecture)',
    associatedViews: ['substations', 'diagrams', 'equipment'],
    keyStandards: ['CEI 61936-1', 'CEI 62271-1', 'IEEE Std 100'],
    keyTakeaway_fr: 'Le poste de transformation abaisse la très haute tension du réseau de transport pour l\'injecter sur le jeu de barres de distribution via des organes de coupure garantissant la sécurité de manœuvre.',
    keyTakeaway_en: 'A substation steps down high-voltage transmission electricity to distribution voltage levels, utilizing robust circuit breakers and busbar schemes to reliably feed multiple outgoing circuits.',
    hotspots: [
      {
        id: 'INCOMING_LINE',
        name_fr: 'Ligne Arrivée THT',
        name_en: 'Incoming Transmission',
        category: 'EQUIPMENT',
        description_fr: 'Conducteurs aériens triphasés 225 kV entrant sur le portique du poste.',
        description_en: 'Three-phase 225 kV overhead line terminating at the substation dead-end gantry.'
      },
      {
        id: 'CIRCUIT_BREAKER_HV',
        name_fr: 'Disjoncteur Haute Tension',
        name_en: 'Circuit Breaker',
        category: 'EQUIPMENT',
        description_fr: 'Interruption des courants de charge et coupure des courts-circuits jusqu\'à 40 kA.',
        description_en: 'Fault current interruption up to 40 kA under SF6 gas or vacuum dielectric.'
      },
      {
        id: 'POWER_TRANSFORMER',
        name_fr: 'Transformateur de Puissance',
        name_en: 'Power Transformer',
        category: 'EQUIPMENT',
        description_fr: 'Abaissement de tension (ex. 225 kV ➔ 90 kV ou 30 kV) par induction électromagnétique.',
        description_en: 'Electromagnetic step-down voltage transformation from transmission to distribution.'
      },
      {
        id: 'BUSBAR_SYSTEM',
        name_fr: 'Jeu de Barres',
        name_en: 'Busbar',
        category: 'EQUIPMENT',
        description_fr: 'Nœud électrique équipotentiel collecteur distribuant l\'énergie vers les différentes travées.',
        description_en: 'Conductive aluminum node distributing power from transformers to all outgoing bays.'
      },
      {
        id: 'OUTGOING_FEEDERS',
        name_fr: 'Départs Distribution',
        name_en: 'Outgoing Feeders',
        category: 'EQUIPMENT',
        description_fr: 'Lignes MT alimentant les postes de distribution urbains et ruraux.',
        description_en: 'Medium-voltage feeder lines supplying urban and rural distribution kiosks.'
      }
    ]
  },

  'substation-components': {
    id: 'substation-components',
    fileName: 'Substation-Components-Power-System-Components.webp',
    originalFileName: 'Substation-Components-Power-System-Components.webp',
    title_fr: 'Appareillages Électromécaniques du Poste Haute Tension',
    title_en: 'Substation Bay Apparatus & Components',
    subtitle_fr: 'Vue architecturale 3D des 13 équipements majeurs d\'une travée extérieure (AIS)',
    subtitle_en: 'Detailed 3D architectural cutaway of 13 primary outdoor AIS substation bay apparatus',
    category: 'SUBSTATION',
    requiredLocation_fr: 'Atelier Postes Électriques ➔ Travées & Appareillages (Bays)',
    requiredLocation_en: 'Substations Workbench ➔ Bay Architecture & Equipment Explorer',
    associatedViews: ['substations', 'equipment', 'installations'],
    keyStandards: ['CEI 62271-100', 'CEI 62271-102', 'CEI 61869-2/3', 'CEI 60099-4', 'IEEE 80'],
    keyTakeaway_fr: 'Chaque travée d\'un poste haute tension intègre un agencement ordonné : parafoudre d\'entrée, sectionneur d\'isolement, transformateurs de mesure (TC/TT), disjoncteur principal, jeu de barres, transformateur de puissance, banc de condensateurs, bâtiment de relayage et maillage de terre.',
    keyTakeaway_en: 'A high-voltage substation bay coordinates surge protection, physical air-gap isolation, precision metering instrumentation, high-speed fault interruption, reactive power compensation, SCADA relaying, and ground grid safety.',
    hotspots: [
      {
        id: 'SURGE_ARRESTER',
        name_fr: 'Parafoudre à Oxyde de Zinc (ZnO)',
        name_en: 'Surge Arrester',
        category: 'EQUIPMENT',
        description_fr: 'Protection contre les surtensions d\'origine atmosphérique (foudre) et de manœuvre.',
        description_en: 'Overvoltage protection diverting lightning and switching surges to ground.'
      },
      {
        id: 'DISCONNECTOR',
        name_fr: 'Sectionneur de Ligne / Barre',
        name_en: 'Disconnector',
        category: 'EQUIPMENT',
        description_fr: 'Sectionnement visible garantissant la sécurité électrique hors tension.',
        description_en: 'Provides visible physical air gap isolation for safe maintenance.'
      },
      {
        id: 'CT_TT',
        name_fr: 'Transformateurs de Mesure (TC & TT)',
        name_en: 'CT & VT Instrument Transformers',
        category: 'EQUIPMENT',
        description_fr: 'Réduction proportionnelle des courants (TC 1A/5A) et tensions (TT 100V) pour les relais de protection.',
        description_en: 'Scale down high primary currents and voltages for relays and billing meters.'
      },
      {
        id: 'BREAKER',
        name_fr: 'Disjoncteur Haute Tension',
        name_en: 'Circuit Breaker',
        category: 'EQUIPMENT',
        description_fr: 'Organe de coupure principal à réarmement automatique sous gaz SF6 ou vide.',
        description_en: 'Primary fault current interruption device capable of auto-reclosing.'
      },
      {
        id: 'BUSBAR',
        name_fr: 'Jeu de Barres Tubulaire',
        name_en: 'Busbar',
        category: 'EQUIPMENT',
        description_fr: 'Tubes aluminium rigides ou conducteurs flexibles supportés sur isolateurs colonnes.',
        description_en: 'Rigid aluminum tubes or stranded conductors carrying the bay collected current.'
      },
      {
        id: 'CAPACITOR_BANK',
        name_fr: 'Banc de Condensateurs / Réactance Shunt',
        name_en: 'Capacitor Bank / Reactor',
        category: 'EQUIPMENT',
        description_fr: 'Compensation d\'énergie réactive (MVAR) et soutien du profil de tension.',
        description_en: 'Supplies or absorbs reactive power (MVAR) to stabilize grid voltage profile.'
      },
      {
        id: 'CONTROL_BUILDING',
        name_fr: 'Bâtiment de Relayage & Contrôle-Commande',
        name_en: 'Protective Relay / Control Building',
        category: 'EQUIPMENT',
        description_fr: 'Abri technique climatisé hébergeant les armoires de protection numérique (IED) et l\'automate de poste.',
        description_en: 'Houses numerical protective relay cubicles (IEDs), RTU, and SCADA gateway.'
      },
      {
        id: 'BATTERY_DC',
        name_fr: 'Source Auxiliaire DC (Batterie & Chargeur)',
        name_en: 'Station Battery / DC',
        category: 'EQUIPMENT',
        description_fr: 'Alimentation secourue 110V/220V DC garantissant le déclenchement des disjoncteurs en cas de black-out.',
        description_en: 'Uninterruptible 110V/220V DC power ensuring breaker tripping during blackouts.'
      },
      {
        id: 'GROUND_GRID',
        name_fr: 'Réseau de Terre Enterré',
        name_en: 'Ground Grid',
        category: 'SAFETY',
        description_fr: 'Grillage cuivre enterré interconnecté aux piquets verticaux sous gravier concassé.',
        description_en: 'Buried copper conductor grid mesh with ground rods under crushed rock gravel.'
      }
    ]
  },

  'substation-one-line-diagram': {
    id: 'substation-one-line-diagram',
    fileName: 'Substation-One-Line-Diagram.png',
    originalFileName: 'Substation-One-Line-Diagram.png',
    title_fr: 'Schéma Unifilaire Fondamental de Poste (SLD)',
    title_en: 'Basic Substation One-Line Diagram (SLD)',
    subtitle_fr: 'Représentation normalisée d\'un départ arrivée, disjoncteur, jeu de barres et départs découpés en zone de protection',
    subtitle_en: 'Standardized Single-Line Diagram showing incoming breaker, busbar, transformer and protection zone',
    category: 'SUBSTATION',
    requiredLocation_fr: 'Atelier Postes Électriques ➔ Topologies & SLD & Schémas Unifilaires',
    requiredLocation_en: 'Substations Workbench ➔ Busbar Topologies & SLD Architecture',
    associatedViews: ['substations', 'diagrams', 'grid-architecture'],
    keyStandards: ['CEI 60617 (Symboles)', 'CEI 61082', 'IEEE Std 315'],
    keyTakeaway_fr: 'Le schéma unifilaire (SLD) simplifie un réseau triphasé complexe en une ligne unique codifiée : les symboles normalisés (carré = disjoncteur, cercles imbriqués = transformateur, pointillés = zone de protection) permettent une analyse claire de l\'exploitation.',
    keyTakeaway_en: 'The Single-Line Diagram (SLD) abstracts complex 3-phase circuits into a clear standard layout. The dashed boundary illustrates the primary protection zone spanning from incoming breaker to transformer secondary.',
    hotspots: [
      {
        id: 'SLD_LEGEND',
        name_fr: 'Légende Normalisée (Symboles CEI/IEEE)',
        name_en: 'Standardized Legend (IEC/IEEE Symbols)',
        category: 'EQUIPMENT',
        description_fr: 'Carré = Disjoncteur ; Double cercle = Transformateur ; Barre = Jeu de barres ; Flèche = Départ.',
        description_en: 'Square = Breaker; Overlapping circles = Transformer; Line = Main bus; Arrow = Feeder.'
      },
      {
        id: 'SLD_ZONE',
        name_fr: 'Zone de Protection (Ligne Pointillée)',
        name_en: 'Protection Zone Boundary',
        category: 'ZONE',
        description_fr: 'Délimitation physique et logique surveillée par le système de protection différentielle.',
        description_en: 'Physical and logical perimeter actively monitored by protective relays.'
      },
      {
        id: 'FEEDER_ARRANGEMENT',
        name_fr: 'Départs Multiplexés en Parallèle',
        name_en: 'Parallel Feeder Circuits',
        category: 'STAGE',
        description_fr: 'Chaque départ dispose de son TC de mesure et de son disjoncteur dédié.',
        description_en: 'Each outgoing feeder has dedicated instrument transformers and circuit breaker.'
      }
    ]
  },

  'substation-protection-zones': {
    id: 'substation-protection-zones',
    fileName: 'Substation-Protection-Zones-Substations.webp',
    originalFileName: 'Substation-Protection-Zones-Substations.webp',
    title_fr: 'Zones de Protection & Recouvrement aux Disjoncteurs',
    title_en: 'Substation Protection Zones & Overlapping Boundaries',
    subtitle_fr: 'Le principe de recouvrement aux disjoncteurs et transformateurs de courant élimine toute zone aveugle',
    subtitle_en: 'Protection zones overlap at breakers and CTs to eliminate any unprotected blind spots in the power system',
    category: 'PROTECTION',
    requiredLocation_fr: 'Atelier Postes Électriques ➔ Zones de Protection & Relais Numériques',
    requiredLocation_en: 'Substations Workbench ➔ Protection Zones Overlay & Relay Coordination',
    associatedViews: ['substations', 'diagrams', 'simulation'],
    keyStandards: ['IEEE C37.90', 'CEI 60255', 'ANSI/IEEE C37.2'],
    keyTakeaway_fr: 'Pour garantir une disponibilité maximale du réseau, chaque zone de protection (Ligne, Barres, Transformateur, Départs) se chevauche intentionnellement au niveau des TC et disjoncteurs : aucun point du poste ne reste sans couverture rapide.',
    keyTakeaway_en: 'To eliminate dead-zones and blind spots, adjacent protection zones intentionally overlap around circuit breakers and instrument transformers, ensuring fast fault detection and selective isolation without tripping healthy equipment.',
    hotspots: [
      {
        id: 'ZONE_LINE',
        name_fr: 'Zone 1 : Protection Ligne de Transport',
        name_en: '1. Line Protection Zone',
        category: 'ZONE',
        description_fr: 'Protège la ligne aérienne THT via relais de distance (21) et différentielle optique (87L).',
        description_en: 'Protects the incoming transmission line section using line distance and 87L differential.'
      },
      {
        id: 'ZONE_BUS',
        name_fr: 'Zone 2 : Différentielle de Barres (87B)',
        name_en: '2. Bus Differential Zone',
        category: 'ZONE',
        description_fr: 'Surveille la sommation vectorielle des courants (∑I = 0). Déclenchement ultra-rapide < 15 ms.',
        description_en: 'Monitors Kirchhoff current law on the busbar (∑I = 0), clearing internal bus faults under 15 ms.'
      },
      {
        id: 'ZONE_TRAFO',
        name_fr: 'Zone 3 : Différentielle Transformateur (87T)',
        name_en: '3. Transformer Differential Zone',
        category: 'ZONE',
        description_fr: 'Compare les courants primaire et secondaire avec compensation d\'angle horaire et retenue d\'harmoniques.',
        description_en: 'Compares currents entering and leaving the transformer with vector group and inrush filtering.'
      },
      {
        id: 'ZONE_FEEDER',
        name_fr: 'Zone 4 : Protection Départs Distribution',
        name_en: '4. Feeder Protection Zone',
        category: 'ZONE',
        description_fr: 'Protège les circuits départs aval via relais à maximum de courant à temps inverse (50/51/51N).',
        description_en: 'Protects each outgoing feeder with inverse-time overcurrent and earth fault protection.'
      },
      {
        id: 'OVERLAPPING_PRINCIPLE',
        name_fr: 'Principe de Recouvrement des Zones',
        name_en: 'Overlapping Zones Principle',
        category: 'SAFETY',
        description_fr: 'Les zones se croisent aux TC situés de part et d\'autre du disjoncteur pour éliminer toute zone morte.',
        description_en: 'Zones overlap at CTs across breakers so no equipment remains unmonitored.'
      }
    ]
  },

  'substation-ground-grid': {
    id: 'substation-ground-grid',
    fileName: 'Substation-Ground-Grid-Safety-Substations.webp',
    originalFileName: 'Substation-Ground-Grid-Safety-Substations.webp',
    title_fr: 'Réseau de Terre du Poste : Tensions de Pas, Toucher & GPR',
    title_en: 'Substation Ground Grid: Touch, Step, and GPR',
    subtitle_fr: 'Comment le grillage de terre canalise les courants de défaut et limite les tensions dangereuses (IEEE Std 80)',
    subtitle_en: 'How grounding grids control fault current paths and limit dangerous voltages to protect people and equipment',
    category: 'SAFETY',
    requiredLocation_fr: 'Atelier Postes Électriques ➔ Réseau de Terre (IEEE 80) & Calculateur de Prise de Terre',
    requiredLocation_en: 'Substations Workbench ➔ Earthing Safety (IEEE 80) & Earthing Calculator',
    associatedViews: ['substations', 'calculators', 'standards'],
    keyStandards: ['IEEE Std 80-2013', 'CEI 61936-1 (Annexe C)', 'NF C 13-200'],
    keyTakeaway_fr: 'Un réseau de terre dimensionné selon l\'IEEE 80 crée une nappe équipotentielle qui dissipe le courant de court-circuit dans le sol profond via des piquets verticaux, tout en limitant la tension de toucher (Touch Voltage) et de pas (Step Voltage) sous les seuils de fibrillation cardiaque grâce à la couche de gravier concassé.',
    keyTakeaway_en: 'A properly engineered grounding grid per IEEE Std 80 provides a low-impedance path for fault currents, creates an equipotential surface to limit Ground Potential Rise (GPR), and keeps touch and step voltages below ventricular fibrillation thresholds.',
    hotspots: [
      {
        id: 'TOUCH_VOLTAGE',
        name_fr: 'Tension de Toucher (Touch Voltage)',
        name_en: 'Touch Voltage',
        category: 'SAFETY',
        description_fr: 'Différence de potentiel entre la charpente métallique touchée par la main et les pieds au sol.',
        description_en: 'Voltage between a grounded structure touched by hand and the earth surface under the feet.'
      },
      {
        id: 'STEP_VOLTAGE',
        name_fr: 'Tension de Pas (Step Voltage)',
        name_en: 'Step Voltage',
        category: 'SAFETY',
        description_fr: 'Différence de potentiel entre les deux pieds d\'une personne écartés de 1 mètre sur le sol.',
        description_en: 'Voltage between two points on the ground surface separated by a 1-meter step distance.'
      },
      {
        id: 'GPR_CURVE',
        name_fr: 'Élévation du Potentiel de Terre (GPR)',
        name_en: 'Ground Potential Rise (GPR)',
        category: 'SAFETY',
        description_fr: 'Montée en tension maximale du poste par rapport à la terre lointaine (GPR = Ig × Rg).',
        description_en: 'Peak voltage rise of the substation ground grid relative to remote earth (GPR = Ig × Rg).'
      },
      {
        id: 'CRUSHED_ROCK',
        name_fr: 'Couche de Gravier Concassé',
        name_en: 'Crushed Rock Surface',
        category: 'SAFETY',
        description_fr: 'Couche de 10 à 15 cm de gravier à haute résistivité (3000 Ω·m) augmentant la résistance de contact des pieds.',
        description_en: '10-15 cm high-resistivity gravel (3000 Ω·m) layer reducing current entering human feet.'
      },
      {
        id: 'GROUND_RODS',
        name_fr: 'Piquets de Terre Verticaux',
        name_en: 'Ground Rods',
        category: 'EQUIPMENT',
        description_fr: 'Électrodes en acier cuivré de 3 à 6 mètres pénétrant les couches de sol humides à basse résistivité.',
        description_en: 'Deep vertical copper-clad steel electrodes discharging fault currents to low-resistivity soil strata.'
      }
    ]
  },

  'thermal-power-plant': {
    id: 'thermal-power-plant',
    fileName: 'Thermal-Power-Plant-Energy-Conversion.png',
    originalFileName: 'Thermal-Power-Plant-Energy-Conversion.png',
    title_fr: 'Chaîne de Conversion Thermique de l\'Énergie',
    title_en: 'Thermal Power Plant Energy Conversion',
    subtitle_fr: 'Le cycle thermodynamique en 6 étapes : Combustible ➔ Chaudière ➔ Vapeur/Gaz ➔ Turbine ➔ Alternateur ➔ Réseau',
    subtitle_en: 'The 6-step energy conversion pathway: Fuel ➔ Boiler/Combustor ➔ Steam/Gas ➔ Turbine ➔ Generator ➔ Grid',
    category: 'GENERATION',
    requiredLocation_fr: 'Production d\'Énergie ➔ Centrales Thermiques & Cycles Combinés (Kribi, Dibamba)',
    requiredLocation_en: 'Energy Production ➔ Thermal & Combined Cycle Generation (Kribi, Dibamba)',
    associatedViews: ['production', 'journey', 'cameroon-grid'],
    keyStandards: ['CEI 60034 (Machines Tournantes)', 'ASME PTC', 'CEI 60076'],
    keyTakeaway_fr: 'Les centrales thermiques (gaz à Kribi 216 MW, fioul lourd à Dibamba 86 MW) transforment l\'énergie chimique du combustible en chaleur, puis en énergie mécanique sur l\'arbre de la turbine, convertie en électricité triphasée par l\'alternateur et élevée à la tension de transport par le transformateur.',
    keyTakeaway_en: 'Thermal power generation converts the chemical energy of fuel into high-enthalpy thermal energy, drives a rotating turbine shaft, generates synchronous electrical energy, and steps up voltage for regional grid injection.',
    hotspots: [
      {
        id: 'STEP_1_FUEL',
        name_fr: '1. Combustible / Source Thermique',
        name_en: '1. Fuel / Heat Source',
        category: 'STAGE',
        description_fr: 'Gaz naturel (Kribi), fioul lourd HFO (Dibamba), charbon ou biomasse.',
        description_en: 'Natural gas, heavy fuel oil, coal, biomass, or geothermal heat input.'
      },
      {
        id: 'STEP_2_BOILER',
        name_fr: '2. Chaudière ou Chambre de Combustion',
        name_en: '2. Boiler or Combustor',
        category: 'STAGE',
        description_fr: 'Combustion sous pression produisant un gaz à très haute température ou vaporisant l\'eau sous pression.',
        description_en: 'High-pressure combustion vessel generating steam or hot compressed gas.'
      },
      {
        id: 'STEP_3_GAS',
        name_fr: '3. Vapeur ou Gaz Chaud en Détente',
        name_en: '3. Steam or Hot Gas',
        category: 'STAGE',
        description_fr: 'Fluide thermodynamique à haute enthalpie détendu à travers les aubes directrices.',
        description_en: 'High-enthalpy working fluid directed at high velocity into the turbine.'
      },
      {
        id: 'STEP_4_TURBINE',
        name_fr: '4. Turbine (Gaz ou Vapeur)',
        name_en: '4. Turbine Rotor',
        category: 'EQUIPMENT',
        description_fr: 'Rotor aubagé transformant l\'énergie de détente du fluide en couple mécanique rotatif.',
        description_en: 'Bladed expansion turbine converting fluid kinetic energy into rotating shaft power.'
      },
      {
        id: 'STEP_5_GENERATOR',
        name_fr: '5. Alternateur Synchrone',
        name_en: '5. Synchronous Generator',
        category: 'EQUIPMENT',
        description_fr: 'Machine synchrone triphasée (3000 tr/min à 50 Hz) produisant une tension typique de 11 à 15 kV.',
        description_en: 'Synchronous generator rotating at 3000 rpm (50 Hz) producing 11 to 15 kV electricity.'
      },
      {
        id: 'STEP_6_TRANSFO',
        name_fr: '6. Transformateur Élévateur vers le Réseau',
        name_en: '6. Transformer to Grid',
        category: 'EQUIPMENT',
        description_fr: 'Transformateur de groupe élevant la tension à 90 kV ou 225 kV pour injection sur le réseau SONATREL.',
        description_en: 'Step-up generator transformer injecting power directly into the high-voltage transmission grid.'
      }
    ]
  },
  'common-power-distribution-system-types': {
    id: 'common-power-distribution-system-types',
    fileName: 'Common-Power-Distrbution-System-Types.png',
    originalFileName: 'Common-Power-Distrbution-System-Types.png',
    title_fr: 'Types Courants de Réseaux de Distribution',
    title_en: 'Common Power Distribution System Types',
    subtitle_fr: 'Radial, Bouclé (Ring Main) et Maillé (Network) : Choix selon la fiabilité, le coût et la densité',
    subtitle_en: 'Utilities choose layouts based on reliability, cost, and load density',
    category: 'DISTRIBUTION',
    requiredLocation_fr: 'Atelier Distribution (D05), Piliers Topologie & Départs HTA',
    requiredLocation_en: 'Distribution Workbench (D05), Topology & MV Feeders',
    associatedViews: ['distribution', 'distribution-topology'],
    keyStandards: ['CEI 60364', 'IEEE 141', 'NF C 15-100'],
    keyTakeaway_fr: 'Le réseau radial est économique mais vulnérable ; le réseau bouclé offre une reconfiguration rapide en cas d\'avarie ; le réseau maillé garantit une continuité de service absolue pour les zones urbaines denses et charges critiques.',
    keyTakeaway_en: 'Radial layouts provide simplicity and lowest capital cost; ring main systems offer loop reconfiguration during faults; network mesh grids deliver maximum service continuity for critical metropolitan loads.',
    hotspots: [
      {
        id: 'SYS_RADIAL',
        name_fr: '1. Réseau Radial (En Antenne)',
        name_en: '1. Radial System',
        category: 'STAGE',
        description_fr: 'Une source unique alimente une artère ramifiée. Simple et économique, mais coupure totale des usagers avals lors d\'un défaut.',
        description_en: 'Single power source feeding branched loads. Lowest cost, but complete blackout downstream of any line outage.'
      },
      {
        id: 'SYS_RING',
        name_fr: '2. Réseau Bouclé (Ring Main)',
        name_en: '2. Ring Main System',
        category: 'STAGE',
        description_fr: 'La boucle part du poste source et y revient. En cas d\'incident, l\'isolement du tronçon défaillant permet de réalimenter les charges par l\'autre côté.',
        description_en: 'Loop begins and ends at the source substation. Better reliability: fault isolation allows re-feeding from the alternate path.'
      },
      {
        id: 'SYS_NETWORK',
        name_fr: '3. Réseau Maillé (Grid Network)',
        name_en: '3. Network System',
        category: 'STAGE',
        description_fr: 'Sources multiples et maillage dense interconnecté. Continuité de service maximale pour les hôpitaux, aéroports et centres urbains.',
        description_en: 'Multiple independent sources feeding an interconnected grid mesh. Highest continuity of service with redundant feeding.'
      }
    ]
  },
  'how-a-transformer-works': {
    id: 'how-a-transformer-works',
    fileName: 'How-a-Transformer-Works.png',
    originalFileName: 'How-a-Transformer-Works.png',
    title_fr: 'Fonctionnement d\'un Transformateur de Puissance',
    title_en: 'How a Transformer Works',
    subtitle_fr: 'Induction électromagnétique (Lois de Faraday & Lenz) et couplage par flux magnétique mutuel',
    subtitle_en: 'Electromagnetic induction principles (Faraday & Lenz) via mutual magnetic flux coupling',
    category: 'SUBSTATION',
    requiredLocation_fr: 'Atelier Postes (D04), Pilier Transformateur de Puissance & D05',
    requiredLocation_en: 'Substations Workbench (D04), Power Transformer Pillar & D05',
    associatedViews: ['substations', 'transformer', 'distribution-trafo'],
    keyStandards: ['CEI 60076-1', 'IEEE C57.12.00'],
    keyTakeaway_fr: 'Le transformateur transfère l\'énergie électrique entre deux circuits sans contact galvanique, grâce au flux magnétique alternatif circulant dans un circuit ferromagnétique feuilleté.',
    keyTakeaway_en: 'Transformers transfer AC electrical power between voltage levels without moving parts or galvanic connection, coupling windings through a laminated silicon steel core.',
    hotspots: [
      {
        id: 'PRIMARY_WINDING',
        name_fr: 'Enroulement Primaire (N₁ spires)',
        name_en: 'Primary Winding (N₁ turns)',
        category: 'EQUIPMENT',
        description_fr: 'Reçoit la tension d\'entrée alternative V₁, générant un courant magnétisant et un flux alternatif.',
        description_en: 'Receives the AC input voltage V₁, producing alternating magnetizing current and time-varying flux.'
      },
      {
        id: 'MAGNETIC_CORE',
        name_fr: 'Circuit Magnétique Feuilleté',
        name_en: 'Laminated Magnetic Core',
        category: 'EQUIPMENT',
        description_fr: 'Tôles d\'acier au silicium à grains orientés isolées pour canaliser le flux et limiter les courants de Foucault.',
        description_en: 'High-permeability laminated silicon steel providing a low-reluctance magnetic path and minimizing eddy current losses.'
      },
      {
        id: 'MAGNETIC_FLUX',
        name_fr: 'Flux Magnétique Alternatif Φ(t)',
        name_en: 'Alternating Magnetic Flux Φ(t)',
        category: 'ZONE',
        description_fr: 'Flux sinusoïdal dΦ/dt induisant les f.é.m. selon la loi de Faraday e = -N · dΦ/dt.',
        description_en: 'Time-varying magnetic flux inducing voltages according to Faraday\'s law e = -N · dΦ/dt.'
      },
      {
        id: 'SECONDARY_WINDING',
        name_fr: 'Enroulement Secondaire (N₂ spires)',
        name_en: 'Secondary Winding (N₂ turns)',
        category: 'EQUIPMENT',
        description_fr: 'Délivre la tension induite V₂ aux récepteurs selon le rapport de transformation m = N₂ / N₁ = V₂ / V₁.',
        description_en: 'Supplies induced output voltage V₂ to loads determined by turns ratio m = N₂ / N₁ = V₂ / V₁ = I₁ / I₂.'
      }
    ]
  },
  'why-high-voltage-reduces-losses': {
    id: 'why-high-voltage-reduces-losses',
    fileName: 'How-High-Voltage-Reduces-Losses.png',
    originalFileName: 'How-High-Voltage-Reduces-Losses.png',
    title_fr: 'Pourquoi la Haute Tension Réduit les Pertes Joules',
    title_en: 'Why High Voltage Reduces Losses',
    subtitle_fr: 'P = U × I et Pertes Joules = R × I² : L\'équation fondamentale du transport d\'énergie',
    subtitle_en: 'For the same power, increasing voltage reduces current, which greatly reduces line losses',
    category: 'TRANSMISSION',
    requiredLocation_fr: 'Atelier Transport (D02), Piliers Paliers de Tension & Parcours THT',
    requiredLocation_en: 'Transmission Workbench (D02), Voltage Levels & Transmission Journey',
    associatedViews: ['transmission', 'voltage-levels', 'principles'],
    keyStandards: ['IEEE 738', 'CEI 60287', 'CEI 60038'],
    keyTakeaway_fr: 'À puissance constante, doubler la tension d\'une ligne divise le courant par 2 et divise les pertes thermiques Joules par 4, autorisant le transport massif sur de longues distances.',
    keyTakeaway_en: 'At constant power transfer (P = V·I), increasing voltage reduces current proportionally, which slashes resistive conductor heating losses quadratically (P_loss = I²·R).',
    hotspots: [
      {
        id: 'LOSS_LOWER_VOLTAGE',
        name_fr: 'Basse / Moyenne Tension (Fort Courant, Fortes Pertes)',
        name_en: 'Lower Voltage (High Current, Heavy Losses)',
        category: 'STAGE',
        description_fr: 'Pour transmettre une puissance donnée, un faible palier de tension exige un courant énorme (I = P/U), provoquant un échauffement sévère des conducteurs et des chutes de tension prohibitives.',
        description_en: 'Transmitting bulk power at low voltage requires very high current (I = P/V), causing severe I²R conductor heating and unacceptable voltage drops.'
      },
      {
        id: 'LOSS_HIGHER_VOLTAGE',
        name_fr: 'Très Haute Tension (Faible Courant, Pertes Minimes)',
        name_en: 'Higher Voltage (Low Current, Minimized Losses)',
        category: 'STAGE',
        description_fr: 'En élevant la tension (ex. 225 kV ou 400 kV), le courant devient très faible pour la même puissance active, réduisant drastiquement les pertes en ligne.',
        description_en: 'Stepping up to 225 kV or 400 kV minimizes conductor current, achieving over 98% transmission efficiency across hundreds of kilometers.'
      }
    ]
  },
  'how-power-distribution-works': {
    id: 'how-power-distribution-works',
    fileName: 'How-Power-Distribution-Works.png',
    originalFileName: 'How-Power-Distribution-Works.png',
    title_fr: 'Le Fonctionnement de la Distribution Électrique',
    title_en: 'How Power Distribution Works',
    subtitle_fr: 'Du réseau de transport THT aux prises 230/400V des abonnés en 6 étapes séquentielles',
    subtitle_en: 'Electricity flows from high voltage to low voltage in steps so it can be delivered safely and efficiently',
    category: 'DISTRIBUTION',
    requiredLocation_fr: 'Atelier Distribution (D05), Pilier Parcours Maître Distribution',
    requiredLocation_en: 'Distribution Workbench (D05), Master Distribution Journey',
    associatedViews: ['distribution', 'journey'],
    keyStandards: ['CEI 60038', 'NF C 15-100', 'IEEE 141'],
    keyTakeaway_fr: 'La distribution abaisse progressivement la tension depuis les postes sources MT vers les artères primaires, puis convertit en basse tension 230/400V au plus près des usagers finaux.',
    keyTakeaway_en: 'Distribution steps down bulk transmission voltage to medium-voltage primary feeders and pole/pad-mounted transformers, delivering safe low-voltage power to consumer premises.',
    hotspots: [
      {
        id: 'DIST_STEP_1',
        name_fr: '1. Réseau de Transport (69 - 765 kV)',
        name_en: '1. Transmission Grid (69 - 765 kV)',
        category: 'STAGE',
        description_fr: 'Lignes aériennes sur pylônes treillis transportant l\'électricité en vrac sur de longues distances.',
        description_en: 'High-voltage bulk transmission lines interconnecting power plants and regional substations.'
      },
      {
        id: 'DIST_STEP_2',
        name_fr: '2. Poste Source de Distribution (HT/MT)',
        name_en: '2. Distribution Substation (HV/MV)',
        category: 'EQUIPMENT',
        description_fr: 'Abaisse la tension de 69-225 kV vers la moyenne tension (4 kV - 35 kV) et distribue vers les quartiers.',
        description_en: 'Steps voltage down from transmission level to medium voltage (4 kV to 35 kV) for regional distribution.'
      },
      {
        id: 'DIST_STEP_3',
        name_fr: '3. Départs Primaires HTA (15 - 33 kV)',
        name_en: '3. Primary Feeders (15 - 33 kV)',
        category: 'STAGE',
        description_fr: 'Réseau triphasé aérien sur poteaux béton/bois ou câbles souterrains sillonnant les municipalités.',
        description_en: 'Three-phase overhead pole lines or underground cables distributing medium-voltage power through communities.'
      },
      {
        id: 'DIST_STEP_4',
        name_fr: '4. Transformateur de Distribution (HTA/BT)',
        name_en: '4. Distribution Transformer (MV/LV)',
        category: 'EQUIPMENT',
        description_fr: 'Transformateur haut de poteau ou cabine au sol abaissant la tension à 230V / 400V.',
        description_en: 'Pole-mounted can or pad-mounted transformer reducing voltage to consumer utilization level (120-240V / 400V).'
      },
      {
        id: 'DIST_STEP_5',
        name_fr: '5. Distribution Secondaire Basse Tension',
        name_en: '5. Secondary Distribution',
        category: 'STAGE',
        description_fr: 'Conducteurs torsadés BT et branchements d\'abonnés aériens ou sous gaine.',
        description_en: 'Low-voltage conductors, service drops, and residential drop wires leading to meter boxes.'
      },
      {
        id: 'DIST_STEP_6',
        name_fr: '6. Usagers : Foyers, Commerces & Industries',
        name_en: '6. Homes, Businesses & Industry',
        category: 'STAGE',
        description_fr: 'Consommation finale sécurisée alimentant éclairage, moteurs, serveurs et appareils ménagers.',
        description_en: 'Safe end-use electrical energy supplying residential homes, commercial buildings, and industrial plants.'
      }
    ]
  },
  'how-power-generation-works': {
    id: 'how-power-generation-works',
    fileName: 'How-Power-Generation-Works.png',
    originalFileName: 'How-Power-Generation-Works.png',
    title_fr: 'Comment Fonctionne la Production d\'Énergie',
    title_en: 'How Power Generation Works',
    subtitle_fr: 'Conversion de l\'énergie primaire en énergie électrique utilisable en 6 étapes',
    subtitle_en: 'Primary energy is converted into electrical power and delivered to users',
    category: 'GENERATION',
    requiredLocation_fr: 'Domaine Production (D01), Parcours Énergétique & Autres Filières',
    requiredLocation_en: 'Generation Domain (D01), Generation Journey & Technology Explorer',
    associatedViews: ['production', 'generation-journey', 'hydro'],
    keyStandards: ['CEI 60034', 'IEEE 421'],
    keyTakeaway_fr: 'De la ressource primaire (eau, combustible, vent, soleil) au rotor de l\'alternateur, l\'énergie mécanique est convertie en courant alternatif 50 Hz puis élevée par le transformateur de groupe (GSU).',
    keyTakeaway_en: 'From primary natural resources to prime movers and synchronous alternators, electrical energy is converted into AC power and stepped up for grid export.',
    hotspots: [
      {
        id: 'GEN_STAGE_1',
        name_fr: '1. Source d\'Énergie Primaire',
        name_en: '1. Primary Energy Source',
        category: 'STAGE',
        description_fr: 'Chaleur des combustibles fossiles, rayonnement solaire, cinétique du vent ou gravité de l\'eau.',
        description_en: 'Thermal fuels (gas/coal), solar irradiation, wind kinetic flow, or hydraulic reservoir head.'
      },
      {
        id: 'GEN_STAGE_2',
        name_fr: '2. Moteur Primaire / Dispositif de Conversion',
        name_en: '2. Prime Mover / Conversion Device',
        category: 'EQUIPMENT',
        description_fr: 'Turbine à vapeur/gaz/hydraulique, moteur thermique ou semi-conducteur photovoltaïque.',
        description_en: 'Hydro/steam/gas turbine, internal combustion engine, or photovoltaic semiconductor cell.'
      },
      {
        id: 'GEN_STAGE_3',
        name_fr: '3. Alternateur Synchrone ou Onduleur',
        name_en: '3. Synchronous Generator or Inverter',
        category: 'EQUIPMENT',
        description_fr: 'Génère une onde sinusoïdale triphasée 50 Hz à une tension typique de 10 à 24 kV.',
        description_en: 'Synchronous machine producing 3-phase 50/60 Hz AC voltage at 10 kV to 24 kV.'
      },
      {
        id: 'GEN_STAGE_4',
        name_fr: '4. Transformateur Élévateur de Groupe (GSU)',
        name_en: '4. Step-Up Transformer (GSU)',
        category: 'EQUIPMENT',
        description_fr: 'Élève la tension à 115 kV, 225 kV ou 400 kV pour réduire le courant et les pertes Joules.',
        description_en: 'Generator Step-Up (GSU) transformer stepping up voltage to bulk transmission levels.'
      },
      {
        id: 'GEN_STAGE_5',
        name_fr: '5. Réseau de Transport Haute Tension',
        name_en: '5. Transmission Grid',
        category: 'STAGE',
        description_fr: 'Corridors THT interconnectant les centrales aux centres de charge régionaux.',
        description_en: 'Bulk high-voltage corridors moving power across national transmission networks.'
      },
      {
        id: 'GEN_STAGE_6',
        name_fr: '6. Utilisateurs Finaux',
        name_en: '6. Homes, Businesses & Industry',
        category: 'STAGE',
        description_fr: 'Alimentation des foyers, usines et infrastructures économiques.',
        description_en: 'End-use consumer electricity consumption across all economic sectors.'
      }
    ]
  },
  'how-power-transmission-works': {
    id: 'how-power-transmission-works',
    fileName: 'How-Power-Transmission-Works.png',
    originalFileName: 'How-Power-Transmission-Works.png',
    title_fr: 'Comment Fonctionne le Transport d\'Énergie',
    title_en: 'How Power Transmission Works',
    subtitle_fr: 'Acheminement en très haute tension sur la dorsale nationale en 6 étapes',
    subtitle_en: 'Voltage is increased for efficient long-distance power transfer',
    category: 'TRANSMISSION',
    requiredLocation_fr: 'Atelier Transport (D02), Pilier Parcours Maître Transport',
    requiredLocation_en: 'Transmission Workbench (D02), Master Transmission Journey',
    associatedViews: ['transmission', 'journey'],
    keyStandards: ['CEI 61970', 'IEEE 738', 'Code Réseau SONATREL'],
    keyTakeaway_fr: 'La dorsale de transport interconnecte les bassins de production aux grands centres de consommation via des liaisons THT 225/400 kV régulées en fréquence et en tension.',
    keyTakeaway_en: 'High-voltage transmission interconnects distant power stations with metropolitan load centers via synchronous 225/400 kV corridors balancing active and reactive power.',
    hotspots: [
      {
        id: 'TX_STAGE_1',
        name_fr: '1. Production Électrique',
        name_en: '1. Power Generation',
        category: 'STAGE',
        description_fr: 'Centrales thermiques, barrages hydroélectriques ou fermes solaires générant à 10-24 kV.',
        description_en: 'Generating stations producing power at medium generator voltages (10-24 kV).'
      },
      {
        id: 'TX_STAGE_2',
        name_fr: '2. Transfo Élévateur (GSU)',
        name_en: '2. Step-Up Transformer (GSU)',
        category: 'EQUIPMENT',
        description_fr: 'Élève la tension à 225 kV / 400 kV pour minimiser les pertes Joules sur de longues distances.',
        description_en: 'Steps voltage up to transmission levels, minimizing current and line heating losses.'
      },
      {
        id: 'TX_STAGE_3',
        name_fr: '3. Lignes Très Haute Tension (THT)',
        name_en: '3. High-Voltage Transmission Lines',
        category: 'STAGE',
        description_fr: 'Pylônes treillis en acier et conducteurs en faisceaux acheminant les gigawatts.',
        description_en: 'Steel lattice towers carrying bundled conductors across national synchronous corridors.'
      },
      {
        id: 'TX_STAGE_4',
        name_fr: '4. Poste d\'Interconnexion et de Coupure',
        name_en: '4. Transmission Substation',
        category: 'EQUIPMENT',
        description_fr: 'Jeux de barres, disjoncteurs, sectionneurs et relais aiguillant les flux énergétiques.',
        description_en: 'Substation switchyard managing power routing, breaker protection, and grid stability.'
      },
      {
        id: 'TX_STAGE_5',
        name_fr: '5. Transformateur Abaisseur de Poste',
        name_en: '5. Step-Down Transformer',
        category: 'EQUIPMENT',
        description_fr: 'Abaisse la tension vers les réseaux de sous-transport (90 kV) et distribution (15-33 kV).',
        description_en: 'Reduces voltage to regional sub-transmission and primary distribution feeder levels.'
      },
      {
        id: 'TX_STAGE_6',
        name_fr: '6. Distribution et Consommateurs',
        name_en: '6. Distribution / End Users',
        category: 'STAGE',
        description_fr: 'Lignes de distribution livrant l\'électricité aux résidences, commerces et industries.',
        description_en: 'Distribution networks delivering power to residential, commercial, and industrial loads.'
      }
    ]
  },
  'how-to-read-a-transformer-nameplate': {
    id: 'how-to-read-a-transformer-nameplate',
    fileName: 'How-to-Read-a-Transformer-Nameplate.png',
    originalFileName: 'How-to-Read-a-Transformer-Nameplate.png',
    title_fr: 'Comment Lire une Plaque Signalétique de Transformateur',
    title_en: 'How to Read a Transformer Nameplate',
    subtitle_fr: 'Paramètres nominaux obligatoires : kVA, tensions HTA/BT, uk%, refroidissement ONAN et prises',
    subtitle_en: 'Key ratings and what they mean: kVA, primary/secondary voltages, impedance, cooling, taps',
    category: 'SUBSTATION',
    requiredLocation_fr: 'Atelier Postes (D04), Pilier Transformateur de Puissance & D05',
    requiredLocation_en: 'Substations Workbench (D04), Power Transformer Pillar & D05',
    associatedViews: ['substations', 'transformer', 'distribution'],
    keyStandards: ['CEI 60076-1', 'IEEE C57.12.00'],
    keyTakeaway_fr: 'La plaque signalétique certifie les caractéristiques assignées indispensables à l\'ingénierie : puissance nominale, tensions primaires/secondaires, impédance de court-circuit (uk%) pour le calcul des courants de défaut et classe thermique.',
    keyTakeaway_en: 'The nameplate defines certified operating boundaries: apparent power (kVA), winding voltages, percent impedance (uk%) determining fault current duty, cooling class, and tap positions.',
    hotspots: [
      {
        id: 'NP_KVA',
        name_fr: 'Puissance Nominale (kVA / MVA)',
        name_en: 'kVA Rating',
        category: 'EQUIPMENT',
        description_fr: 'Charge apparente maximale que le transformateur peut délivrer en continu sans dépasser l\'échauffement admissible.',
        description_en: 'Maximum continuous apparent power output without exceeding winding temperature rise limits.'
      },
      {
        id: 'NP_VOLT_PRI',
        name_fr: 'Tension Primaire (HV Rating)',
        name_en: 'Primary Voltage',
        category: 'EQUIPMENT',
        description_fr: 'Tension assignée côté réseau d\'alimentation (ex. 12 470 V ou 225 kV).',
        description_en: 'Nominal input operating voltage designed to interface with the source grid.'
      },
      {
        id: 'NP_VOLT_SEC',
        name_fr: 'Tension Secondaire (LV Rating)',
        name_en: 'Secondary Voltage',
        category: 'EQUIPMENT',
        description_fr: 'Tension assignée délivrée à vide côté utilisation (ex. 480 V ou 400 V).',
        description_en: 'Nominal no-load output voltage delivered to the downstream circuit or consumer.'
      },
      {
        id: 'NP_PHASE',
        name_fr: 'Nombre de Phases (3 Phases)',
        name_en: 'Phase (3 Phase)',
        category: 'EQUIPMENT',
        description_fr: 'Configuration triphasée (ou monophasée) avec schéma de couplage normalisé (Dyn11, YNd11).',
        description_en: 'Three-phase electrical system with standardized vector group configuration.'
      },
      {
        id: 'NP_FREQ',
        name_fr: 'Fréquence Nominale (50 Hz / 60 Hz)',
        name_en: 'Frequency (50 Hz / 60 Hz)',
        category: 'EQUIPMENT',
        description_fr: 'Fréquence assignée du réseau alternatif conditionnant le flux magnétique et les pertes fer.',
        description_en: 'Rated AC grid frequency governing core flux density and iron losses.'
      },
      {
        id: 'NP_IMPEDANCE',
        name_fr: 'Impédance de Court-Circuit (% Impedance uk%)',
        name_en: '% Impedance (uk%)',
        category: 'EQUIPMENT',
        description_fr: 'Pourcentage de chute de tension sous courant nominal. Détermine directement le courant de court-circuit Isc = In / (uk%/100).',
        description_en: 'Short-circuit impedance percentage. Dictates the prospective fault current Isc = In / (uk%/100) and voltage regulation.'
      },
      {
        id: 'NP_COOLING',
        name_fr: 'Classe de Refroidissement (ONAN)',
        name_en: 'Cooling Class (ONAN)',
        category: 'EQUIPMENT',
        description_fr: 'ONAN = Huile Naturelle / Air Naturel (circulation naturelle sans pompes ni ventilateurs forcés).',
        description_en: 'ONAN = Oil Natural Air Natural (passive circulation of dielectric fluid and air convection).'
      },
      {
        id: 'NP_TAPS',
        name_fr: 'Prises de Réglage (Tap Settings)',
        name_en: 'Tap Settings',
        category: 'EQUIPMENT',
        description_fr: 'Positions du régleur de tension (ex. ±2.5% FCAN / FCBN) permettant d\'adapter le rapport de spires aux variations de tension réseau.',
        description_en: 'Tap positions (e.g. ±2.5% Full Capacity Above/Below Normal) adjusting turns ratio to match grid conditions.'
      }
    ]
  },
  'main-types-of-power-generation': {
    id: 'main-types-of-power-generation',
    fileName: 'Main-Types-of-Power-Generation.png',
    originalFileName: 'Main-Types-of-Power-Generation.png',
    title_fr: 'Principales Technologies de Production d\'Électricité',
    title_en: 'Main Types of Power Generation',
    subtitle_fr: 'Comparatif synthétique : Gaz Naturel, Charbon, Nucléaire, Hydroélectricité, Éolien et Solaire PV',
    subtitle_en: 'Comparative overview: Natural Gas, Coal, Nuclear, Hydropower, Wind, and Solar PV',
    category: 'GENERATION',
    requiredLocation_fr: 'Domaine Production (D01), Explorateur Technologique & Mix Énergétique',
    requiredLocation_en: 'Generation Domain (D01), Generation Fleet & Technology Explorer',
    associatedViews: ['production', 'generation-types', 'mix'],
    keyStandards: ['CEI 60034', 'AIEA', 'IRENA'],
    keyTakeaway_fr: 'La résilience d\'un réseau repose sur la complémentarité entre la souplesse de l\'hydroélectricité et des turbines gaz (pilotables en pointe), et la compétitivité décarbonée du solaire et de l\'éolien.',
    keyTakeaway_en: 'Grid resilience relies on combining flexible dispatchable generation (hydro and gas turbines) with cost-effective zero-emission renewable variable generation.',
    hotspots: [
      {
        id: 'GEN_GAS',
        name_fr: 'Gaz Naturel (TAC & CCGT)',
        name_en: 'Natural Gas (Turbines & CCGT)',
        category: 'EQUIPMENT',
        description_fr: 'Démarrage rapide (<15 min), idéal pour équilibrer l\'intermittence renouvelable. Émet du CO2 mais deux fois moins que le charbon.',
        description_en: 'Fast start-up (<15 min) and high thermal efficiency; ideal for peaking and renewable balancing.'
      },
      {
        id: 'GEN_COAL',
        name_fr: 'Charbon Thermique',
        name_en: 'Coal-Fired Baseload',
        category: 'EQUIPMENT',
        description_fr: 'Fournit une puissance de base continue et fiable, mais génère une forte intensité de gaz à effet de serre et de polluants atmosphériques.',
        description_en: 'Reliable baseload with high capacity factors, but carries high carbon emissions and environmental footprint.'
      },
      {
        id: 'GEN_NUCLEAR',
        name_fr: 'Nucléaire de Fission',
        name_en: 'Nuclear Fission',
        category: 'EQUIPMENT',
        description_fr: 'Fission de l\'uranium produisant une puissance massive en continu sans émission directe de carbone en fonctionnement.',
        description_en: 'Fission reactions produce massive baseload power with virtually zero operational greenhouse gas emissions.'
      },
      {
        id: 'GEN_HYDRO',
        name_fr: 'Hydroélectricité (Fil de l\'eau & Réservoirs)',
        name_en: 'Hydropower (Run-of-river & Storage)',
        category: 'EQUIPMENT',
        description_fr: 'Ressource renouvelable flexible et stockable, offrant régulation de fréquence et démarrage autonome (black-start).',
        description_en: 'Renewable, highly dispatchable, with large energy storage capability and black-start grid restoration power.'
      },
      {
        id: 'GEN_WIND',
        name_fr: 'Éolien Terrestre et Offshore',
        name_en: 'Onshore and Offshore Wind',
        category: 'EQUIPMENT',
        description_fr: 'Conversion de la force aérodynamique du vent. Coût marginal d\'exploitation quasi nul mais dépendant des régimes de vent.',
        description_en: 'Zero-fuel renewable generation utilizing kinetic wind flow; requires grid flexibility for intermittency.'
      },
      {
        id: 'GEN_SOLAR',
        name_fr: 'Solaire Photovoltaïque (PV)',
        name_en: 'Solar Photovoltaic (PV)',
        category: 'EQUIPMENT',
        description_fr: 'Conversion photonique directe en électricité continue, convertie en CA par onduleurs. Modulaire et rapide à déployer.',
        description_en: 'Direct photon-to-electron conversion via semiconductor cells; modular, scalable, daylight-dependent.'
      }
    ]
  },
  'renewable-collector-substation': {
    id: 'renewable-collector-substation',
    fileName: 'Renewable-Collector-Substation-Substations.webp',
    originalFileName: 'Renewable-Collector-Substation-Substations.webp',
    title_fr: 'Poste d\'Évacuation et de Collecte Renouvelable',
    title_en: 'Renewable Collector Substation',
    subtitle_fr: 'Collecte 34.5 kV des parcs éoliens/solaires, élévation à 115/230 kV et Point d\'Interconnexion (POI)',
    subtitle_en: 'Collects power from multiple renewable sources, steps up voltage, and delivers it to the grid',
    category: 'SUBSTATION',
    requiredLocation_fr: 'Atelier Postes (D04), Piliers Topologie & Architecture de Travées',
    requiredLocation_en: 'Substations Workbench (D04), Topology & Bay Architecture Pillars',
    associatedViews: ['substations', 'topology', 'production'],
    keyStandards: ['IEEE 2800', 'CEI 61850', 'CEI 61936-1'],
    keyTakeaway_fr: 'Le poste d\'évacuation renouvelable centralise les départs collecteurs 34.5 kV des parcs solaires et éoliens, assure le soutien de puissance réactive (STATCOM/condensateurs), élève la tension au transformateur principal et injecte l\'énergie au Point d\'Interconnexion (POI).',
    keyTakeaway_en: 'The renewable collector substation aggregates 34.5 kV feeder circuits from wind and solar arrays, integrates reactive compensation (STATCOM/capacitors), steps up voltage to bulk transmission levels, and interfaces at the Point of Interconnection (POI).',
    hotspots: [
      {
        id: 'REN_SOLAR',
        name_fr: 'Champs Solaires PV et Onduleurs',
        name_en: 'Solar PV Arrays & Inverters',
        category: 'STAGE',
        description_fr: 'Onduleurs de chaîne ou centraux raccordés à des transformateurs de bloc élevant la tension à 34.5 kV.',
        description_en: 'Central or string inverters coupled to pad-mounted transformers producing 34.5 kV feeder output.'
      },
      {
        id: 'REN_WIND',
        name_fr: 'Aérogénérateurs et Transfos de Mât',
        name_en: 'Wind Turbines & Padmounts',
        category: 'STAGE',
        description_fr: 'Turbines éoliennes avec génératrices DFIG ou à aimants permanents raccordées au réseau collecteur 34.5 kV.',
        description_en: 'Wind turbine generators linked through base step-up transformers into 34.5 kV collector feeder circuits.'
      },
      {
        id: 'COLLECTOR_BUS',
        name_fr: 'Jeu de Barres Collecteur 34.5 kV',
        name_en: '34.5 kV Collector Busbar',
        category: 'EQUIPMENT',
        description_fr: 'Tableau moyenne tension sous enveloppe métallique avec disjoncteurs à vide pour chaque boucle collectrice.',
        description_en: 'Medium-voltage metal-clad switchgear with vacuum circuit breakers protecting individual feeder loops.'
      },
      {
        id: 'MAIN_TRAFO',
        name_fr: 'Transformateur Élévateur Principal (34.5 kV ➔ 115/230 kV)',
        name_en: 'Main Step-Up Power Transformer',
        category: 'EQUIPMENT',
        description_fr: 'Transformateur de puissance (100 à 300 MVA) élevant la tension moyenne vers le palier de transport haute tension.',
        description_en: 'Bulk power transformer stepping up aggregated generation from 34.5 kV to transmission voltage (115/230 kV).'
      },
      {
        id: 'REVENUE_METER',
        name_fr: 'Comptage Transactionnel et TC/TT de Mesure',
        name_en: 'Revenue Metering (CT/PT)',
        category: 'EQUIPMENT',
        description_fr: 'Transformateurs de courant et de tension classe 0.2S reliés au compteur de transaction pour facturation réseau.',
        description_en: 'High-precision Class 0.2S current and potential transformers recording tariff energy export to the grid.'
      },
      {
        id: 'REACTIVE_SUPPORT',
        name_fr: 'Support de Puissance Réactive (STATCOM / BAP)',
        name_en: 'Reactive Support (STATCOM / Cap Banks)',
        category: 'EQUIPMENT',
        description_fr: 'Bancs de condensateurs shunt et compensateur synchrone statique (STATCOM) maintenant la tension et le cos phi au POI.',
        description_en: 'Shunt capacitor banks and dynamic STATCOM providing fast reactive power voltage support at the POI.'
      },
      {
        id: 'SCADA_PPC',
        name_fr: 'Contrôleur de Centrale (PPC) & SCADA',
        name_en: 'Plant Controller (PPC) & SCADA',
        category: 'ZONE',
        description_fr: 'Automate centralisé régulant la puissance active/réactive (P-Q), la fréquence et les ordres du dispatching.',
        description_en: 'Master power plant controller executing closed-loop active and reactive power control per grid code.'
      },
      {
        id: 'POI_TERMINAL',
        name_fr: 'Point d\'Interconnexion (POI)',
        name_en: 'Point of Interconnection (POI)',
        category: 'ZONE',
        description_fr: 'Frontière contractuelle et physique où l\'énergie est injectée sur la ligne haute tension du gestionnaire de réseau.',
        description_en: 'Contractual and physical boundary where generated power is injected into the utility transmission line.'
      }
    ]
  },
  'substation-dc-auxiliary-and-trip-circuit': {
    id: 'substation-dc-auxiliary-and-trip-circuit',
    fileName: 'Substation-DC-Auxiliary-and-Trip-Circuit.jpg',
    originalFileName: 'Substation-DC-Auxiliary-and-Trip-Circuit.jpg',
    title_fr: "Systèmes Auxiliaires CC & Surveillance de Circuit de Déclenchement (ANSI 74TC / 50BF)",
    title_en: "Substation DC Auxiliaries & Trip Circuit Supervision (ANSI 74TC / 50BF)",
    subtitle_fr: "Batteries Stationnaires 110V/220V, Redresseurs N+1, Boucle 74TC et Refus de Disjoncteur 50BF",
    subtitle_en: "110V/220V Stationary Batteries, N+1 Float Rectifiers, 74TC Loop, & 50BF Breaker Failure Chain",
    category: 'SUBSTATION',
    requiredLocation_fr: "Postes Électriques (D04), Protections Numériques (D11), Sécurité Électrique (D16)",
    requiredLocation_en: "Substations (D04), Digital Protection (D11), Electrical Safety (D16)",
    associatedViews: ['substations', 'protection', 'digital-twin', 'simulation-lab'],
    keyStandards: ['IEEE Std 485', 'IEEE Std 450', 'IEC 60896-11/21', 'IEC 60255-1', 'IEEE C37.90', 'CIGRE TB 557'],
    keyTakeaway_fr: "La source de courant continu (110V/220V CC) et la boucle de surveillance permanente de bobine (ANSI 74TC) constituent le garant ultime de l'élimination des défauts électriques : une défaillance de la batterie ou du circuit de déclenchement rend inopérantes toutes les protections amont.",
    keyTakeaway_en: "The substation DC auxiliary system (110V/220V DC) and continuous trip circuit supervision loop (ANSI 74TC) are the fundamental cornerstone of fault clearing: failure of the DC battery or open trip circuit blinds all upstream protective relays.",
    hotspots: [
      {
        id: 'DC_BATTERY_BANK',
        name_fr: 'Batterie Stationnaire d\'Accumulateurs (110V / 220V CC)',
        name_en: 'Stationary Battery Bank (110V / 220V DC)',
        category: 'EQUIPMENT',
        description_fr: '55 à 110 éléments Plomb étanche (VRLA) ou Ni-Cd dimensionnés selon IEEE 485 pour assurer 8 à 24h d\'autonomie en cas de black-out complet.',
        description_en: '55 to 110 VRLA or Ni-Cd cells sized per IEEE Std 485 to provide 8 to 24 hours of autonomous station power during complete blackout.'
      },
      {
        id: 'DUAL_CHARGERS',
        name_fr: 'Chargeurs-Redresseurs Redondants (N+1)',
        name_en: 'Dual Redundant Float Rectifiers (N+1)',
        category: 'EQUIPMENT',
        description_fr: 'Redresseurs à thyristors ou découpage HF alimentant les auxiliaires permanents tout en maintenant la batterie en floating (2,23-2,27 V/élément).',
        description_en: 'Thyristor or high-frequency switch-mode rectifiers powering continuous base loads while float-charging the battery string.'
      },
      {
        id: 'DC_DISTRIBUTION',
        name_fr: 'Tableau de Distribution CC & Contrôleur d\'Isolement (64D)',
        name_en: 'DC Distribution Switchboard & Insulation Monitor (64D)',
        category: 'EQUIPMENT',
        description_fr: 'Pont de mesure symétrique surveillant la résistance d\'isolement phase/terre (seuil d\'alarme typique < 100 kΩ) sans provoquer de déclenchement intempestif.',
        description_en: 'Balanced bridge earth fault insulation monitor detecting positive/negative pole-to-ground leaks (alarm threshold < 100 kΩ) without nuisance tripping.'
      },
      {
        id: 'ANSI_74TC_LOOP',
        name_fr: 'Boucle de Surveillance de Déclenchement (ANSI 74TC)',
        name_en: 'Trip Circuit Supervision Loop (ANSI 74TC)',
        category: 'ZONE',
        description_fr: 'Surveillance continue du circuit de déclenchement avant enclenchement (via 52b) et après enclenchement (via 52a) sous un courant d\'injection calibré < 3-5 mA.',
        description_en: 'Continuous supervision of the trip path before closing (through 52b) and after closing (through 52a) with calibrated current < 3-5 mA to prevent false trip.'
      },
      {
        id: 'TRIP_COIL_52TC',
        name_fr: 'Bobines de Déclenchement Dédoublées (52TC1 & 52TC2)',
        name_en: 'Dual Redundant Trip Coils (52TC1 & 52TC2)',
        category: 'EQUIPMENT',
        description_fr: 'Deux bobines indépendantes montées sur le disjoncteur HTB, alimentées par deux systèmes CC distincts (Batterie 1 & 2) et déclenchées par les relais Main 1 et Main 2.',
        description_en: 'Two electrically independent trip coils on the circuit breaker mechanism, fed by separate DC systems (Battery 1 & 2) and triggered by Main 1 and Main 2 relays.'
      },
      {
        id: 'ANSI_50BF_CHAIN',
        name_fr: 'Automate de Refus de Disjoncteur (ANSI 50BF)',
        name_en: 'Breaker Failure Logic (ANSI 50BF)',
        category: 'STAGE',
        description_fr: 'Surveillance du courant de défaut après ordre de déclenchement : si le courant persiste après temporisation t_BF (180-220 ms), ordre de déclenchement envoyé aux disjoncteurs adjacents.',
        description_en: 'Overcurrent monitoring following trip order initiation: if current persists after t_BF (180-220 ms), triggers master tripping of all adjacent busbar circuit breakers.'
      },
      {
        id: 'ANSI_86_LOCKOUT',
        name_fr: 'Relais de Verrouillage Définitive (ANSI 86 Lockout)',
        name_en: 'Master Lockout Bistable Relay (ANSI 86)',
        category: 'EQUIPMENT',
        description_fr: 'Relais bistable à réarmement manuel ou électrique empêchant tout réenclenchement automatique ou manuel sur un défaut grave non éliminé.',
        description_en: 'Electrically tripped, hand-reset or supervisor electric-reset bistable lockout relay that latches open to block reclosing onto uncleared major faults.'
      }
    ]
  },
  'mv-feeder-flisr-and-loop-automation': {
    id: 'mv-feeder-flisr-and-loop-automation',
    fileName: 'MV-Feeder-FLISR-and-Loop-Automation.jpg',
    originalFileName: 'MV-Feeder-FLISR-and-Loop-Automation.jpg',
    title_fr: "Automatisation FLISR & Réenclenchement de Boucle HTA (ANSI 79 / 67N)",
    title_en: "MV Feeder FLISR & Automated Loop Restoration (ANSI 79 / 67N)",
    subtitle_fr: "Localisation de Défaut, Isolement et Réalimentation en Réseau de Distribution 15 kV / 30 kV",
    subtitle_en: "Fault Location, Isolation, and Service Restoration on 15kV/30kV Distribution Networks",
    category: 'DISTRIBUTION',
    requiredLocation_fr: "Réseaux de Distribution HTA/BT (D05), Postes Électriques (D04), Protections Numériques (D11)",
    requiredLocation_en: "Distribution Networks (D05), Substations (D04), Digital Protection (D11)",
    associatedViews: ['distribution', 'protection', 'digital-twin', 'simulation-lab'],
    keyStandards: ['IEEE Std C37.60', 'IEC 62271-111', 'IEEE Std 242', 'IEEE Std 1366', 'IEC 60870-5-104'],
    keyTakeaway_fr: "L'automatisation FLISR transforme les réseaux HTA en boucles auto-cicatrisantes (self-healing grids) : en isolant le tronçon défaillant et en fermant le point de bouclage N.O. en moins de 45 secondes, l'indice SAIDI est réduit de plus de 90 % par rapport aux manœuvres manuelles d'exploitation.",
    keyTakeaway_en: "Automated FLISR transforms MV distribution feeders into self-healing loops: by isolating faulted cable sections and closing normally-open tie switches in under 45 seconds, customer outage duration (SAIDI) is reduced by over 90% compared to manual field crew patrols.",
    hotspots: [
      {
        id: 'SUBSTATION_FEEDER_CB',
        name_fr: 'Disjoncteur de Départ Poste Source (DJT 30 kV)',
        name_en: 'Substation 30 kV Vacuum Feeder Breaker',
        category: 'EQUIPMENT',
        description_fr: 'Disjoncteur sous vide 630 A / 16 kA équipé d\'un relais numérique exécutant les cycles de réenclenchement automatique ANSI 79 (O - 0,3s - FO - 15s - FO - Verrouillage).',
        description_en: '630 A / 16 kA vacuum circuit breaker controlled by numerical IED executing ANSI 79 multishot autoreclose sequence (O - 0.3s - CO - 15s - CO - Lockout).'
      },
      {
        id: 'MIDLINE_RECLOSER',
        name_fr: 'Réenclencheur Automatique de Ligne Aérien (R1)',
        name_en: 'Mid-Line Automated Pole-Mounted Recloser (R1)',
        category: 'EQUIPMENT',
        description_fr: 'Appareil autonome sous vide avec capteurs de tension capacitifs intégrés et coffret de commande communicant par 4G/DNP3 avec le dispatching central (SCADA).',
        description_en: 'Pole-mounted vacuum recloser with integrated capacitive voltage dividers and RTU communicating over cellular 4G/DNP3 to distribution SCADA.'
      },
      {
        id: 'MOTORIZED_SECTIONALIZER',
        name_fr: 'Interrupteur-Sectionneur Motorisé Aérien / Cabine (S2)',
        name_en: 'Motorized Load Break Switch / Sectionalizer (S2)',
        category: 'EQUIPMENT',
        description_fr: 'Interrupteur à coupure dans le SF6 ou le vide avec détecteurs de passage de défaut (DPD/FPI) communicants permettant d\'isoler le tronçon sans pouvoir de coupure sur court-circuit.',
        description_en: 'SF6 or vacuum load-break switch with directional fault passage indicators (FPI) isolating damaged segments without requiring short-circuit interruption capability.'
      },
      {
        id: 'TIE_SWITCH_NO',
        name_fr: 'Interrupteur de Bouclage Normalement Ouvert (TIE N.O.)',
        name_en: 'Normally Open Tie Switch (TIE N.O.)',
        category: 'EQUIPMENT',
        description_fr: 'Frontière électrique séparant en temps normal deux postes sources distincts (Alpha et Beta). Sa fermeture télécommandée permet la réalimentation en secours N-1.',
        description_en: 'Normally open boundary separating two adjacent primary substations (Alpha and Beta). Remote motor closing restores healthy downstream customers under N-1 contingency.'
      },
      {
        id: 'FLISR_CENTRAL_LOGIC',
        name_fr: 'Moteur d\'Automatisation FLISR & Algorithme de Restauration',
        name_en: 'FLISR Automation Engine & Restoration Algorithm',
        category: 'STAGE',
        description_fr: 'Algorithme centralisé ou distribué traitant les alarmes DPD, calculant la capacité de réserve amont/aval et exécutant la séquence d\'isolement et refermeture en < 45 s.',
        description_en: 'Centralized or distributed automation logic processing FPI telemetry, calculating transformer capacity margins, and executing isolation/tie closure in < 45 seconds.'
      },
      {
        id: 'TEMPORARY_FAULT_ARC',
        name_fr: 'Arc Électrique Fugitif & Déionisation',
        name_en: 'Transient Fault Arc & Air De-ionization',
        category: 'ZONE',
        description_fr: 'Défaut transitoire (70-80% des défauts HTA : foudre, frondaison d\'arbre) auto-extinguible après le temps mort de 0,3 s sans provoquer de déclenchement permanent.',
        description_en: 'Transient fault (70-80% of MV faults: lightning surge, tree branch contact) self-clearing during 0.3s dead time with zero permanent customer interruption.'
      }
    ]
  },
  'industrial-mv-motor-protection': {
    id: 'industrial-mv-motor-protection',
    fileName: 'Industrial-MV-Motor-Protection.jpg',
    originalFileName: 'Industrial-MV-Motor-Protection.jpg',
    title_fr: "Protection Moteur HTA & Image Thermique (ANSI 49 / 51LR / 46 / 37)",
    title_en: "MV Industrial Motor Protection & Thermal Model (ANSI 49 / 51LR / 46 / 37)",
    subtitle_fr: "Modélisation Thermique dθ/dt, Rotor Bloqué, Déséquilibre Inverse I₂ et Surveillance Paliers Pt100",
    subtitle_en: "dθ/dt Thermal Replica, Locked Rotor Stall, Negative-Sequence I₂, and Pt100 RTD Monitoring",
    category: 'PROTECTION',
    requiredLocation_fr: "Réseaux Industriels (D07), Protections Numériques (D11), Machines Tournantes (D01)",
    requiredLocation_en: "Industrial Systems (D07), Digital Protection (D11), Rotating Machines (D01)",
    associatedViews: ['industrial', 'protection', 'digital-twin', 'simulation-lab'],
    keyStandards: ['IEC 60034-1', 'IEC 60255-8', 'IEEE Std 620', 'IEEE Std 3004.8', 'IEEE Std 242'],
    keyTakeaway_fr: "L'image thermique numérique (ANSI 49) simule en continu l'échauffement des barres rotoriques et du stator sous les effets cumulés de la composante directe I₁ et du déséquilibre inverse I₂ (pondéré par k = 3 à 6), empêchant la ruine thermique des isolants classe F/H tout en autorisant les démarrages lourds sous haute inertie.",
    keyTakeaway_en: "The digital thermal replica (ANSI 49) continuously computes stator and rotor bar heating under combined positive sequence I₁ and negative sequence I₂ currents (weighted by k = 3 to 6), preventing thermal breakdown of Class F/H insulation while safely accommodating high-inertia starts.",
    hotspots: [
      {
        id: 'MV_VACUUM_CONTACTOR',
        name_fr: 'Cellule Départeur Contacteur sous Vide & Fusibles HPC (Classe E2)',
        name_en: 'MV Vacuum Contactor & HRC Fuse Switchgear (Class E2)',
        category: 'EQUIPMENT',
        description_fr: 'Appareillage combiné contacteur sous vide 400 A / 7.2 kV avec fusibles limiteurs HPC et circuit RC snubber amortissant les surtensions d\'arrachement.',
        description_en: 'Class E2 combination starter with 400 A / 7.2 kV vacuum contactor, back-up current-limiting fuses, and RC surge suppression snubber.'
      },
      {
        id: 'PROTECTION_IED',
        name_fr: 'Relais Numérique Dédié Moteur (IED)',
        name_en: 'Dedicated Numerical Motor Protection Relay (IED)',
        category: 'EQUIPMENT',
        description_fr: 'Relais multifonction exécutant l\'image thermique biconstante (τ_marche / τ_arrêt), la détection de démarrage long et le contrôle des sondes Pt100.',
        description_en: 'Multifunction protection relay running dual-time constant thermal replica, speed switch input, stall timers, and stator/bearing RTD monitoring.'
      },
      {
        id: 'MOTOR_ROTOR_STATOR',
        name_fr: 'Moteur Asynchrone 2 500 kW / 6.6 kV',
        name_en: 'Induction Motor Stator & Squirrel Cage Rotor (2,500 kW / 6.6 kV)',
        category: 'EQUIPMENT',
        description_fr: 'Machine d\'entraînement industriel (pompe d\'alimentation chaudière ou broyeur cimenterie) avec bobinage statorique sous vide pression (VPI) classe F.',
        description_en: 'Heavy-duty industrial drive (boiler feed water pump or raw mill) featuring vacuum pressure impregnated (VPI) Class F stator insulation.'
      },
      {
        id: 'THERMAL_REPLICA_49',
        name_fr: 'Modèle d\'Image Thermique dθ/dt (ANSI 49)',
        name_en: 'Thermal Replica Differential Model (ANSI 49)',
        category: 'STAGE',
        description_fr: 'Intégration dθ/dt = (I_eq² - θ)/τ avec I_eq² = I₁² + k·I₂² reproduisant fidèlement l\'état thermique sans dérive temporelle.',
        description_en: 'Real-time differential solver dθ/dt = (I_eq² - θ)/τ where I_eq² = I₁² + k·I₂², tracking motor heating memory during running and cooling at standstill.'
      },
      {
        id: 'LOCKED_ROTOR_51LR',
        name_fr: 'Protection Calage Rotor & Démarrage Trop Long (ANSI 51LR)',
        name_en: 'Locked Rotor Stall Protection (ANSI 51LR)',
        category: 'STAGE',
        description_fr: 'Temporisation calée sous la courbe de tenue thermique à rotor bloqué (t_stall_hot = 8 s), prévenant la fusion des anneaux de court-circuit.',
        description_en: 'Definite-time overcurrent element coordinated below the motor permissible stall time (t_stall_hot = 8 s) to protect rotor copper bars.'
      }
    ]
  },
  'solar-bess-grid-interconnection': {
    id: 'solar-bess-grid-interconnection',
    fileName: 'Solar-BESS-Grid-Interconnection.jpg',
    originalFileName: 'Solar-BESS-Grid-Interconnection.jpg',
    title_fr: "Centrale Solaire PV + Stockage BESS & Support Réseau (IEEE 1547 / 2800)",
    title_en: "Solar PV + BESS Grid Interconnection & Dynamic Support (IEEE 1547 / 2800)",
    subtitle_fr: "Inertie Virtuelle, Réponse Rapide en Fréquence P(f), Support de Tension Q(U) et Traversée de Creux LVRT",
    subtitle_en: "Virtual Inertia H, Fast Frequency Response P(f), Voltage Support Q(U), and LVRT Ride-Through",
    category: 'GENERATION',
    requiredLocation_fr: "Énergies Renouvelables (D10), Postes Électriques (D04), Stabilité Réseau (D08)",
    requiredLocation_en: "Renewable Energy (D10), Substations (D04), Grid Stability (D08)",
    associatedViews: ['solar', 'storage', 'microgrid', 'simulation-lab'],
    keyStandards: ['IEEE Std 2800-2022', 'IEEE Std 1547-2018', 'IEC 62933', 'IEC 62477-2', 'IEC 61727'],
    keyTakeaway_fr: "L'hybridation d'un parc solaire 30 MWc avec un système de stockage BESS 20 MWh / 10 MW (batteries LFP et onduleurs 4-quadrants Grid-Forming) confère une réponse en fréquence ultra-rapide (FFR < 150 ms) et une inertie synthétique (H = 4 s) stabilisant les réseaux faibles insulaires ou interconnectés (cas des centrales de Maroua et Guider sur le RIN 110 kV).",
    keyTakeaway_en: "Hybridizing a 30 MWp solar park with a 20 MWh / 10 MW BESS (LFP chemistry and 4-quadrant Grid-Forming inverters) provides ultra-fast frequency response (FFR < 150 ms) and synthetic inertia (H = 4 s), stabilizing weak or weakly-interconnected grids (such as the Maroua and Guider plants on Cameroon's 110 kV Northern Interconnected Grid).",
    hotspots: [
      {
        id: 'SOLAR_PV_ARRAY',
        name_fr: 'Champ Solaire PV 30 MWc (1500 V CC)',
        name_en: '30 MWp Solar PV Array (1500 V DC)',
        category: 'EQUIPMENT',
        description_fr: 'Générateur photovoltaïque bifacial sur trackers 1-axe avec chaînes 1500 V CC et optimiseurs MPPT de grande puissance.',
        description_en: 'Utility-scale bifacial PV modules on single-axis trackers operating at 1500 V DC bus voltage with distributed MPPT tracking.'
      },
      {
        id: 'BESS_BATTERY_RACKS',
        name_fr: 'Conteneur BESS 20 MWh / 10 MW (LiFePO4)',
        name_en: '20 MWh / 10 MW BESS Container (LFP)',
        category: 'EQUIPMENT',
        description_fr: 'Racks de batteries Lithium-Fer-Phosphate (LFP) avec système BMS modulaire et refroidissement liquide prévenant l\'emballement thermique.',
        description_en: 'Liquid-cooled Lithium Iron Phosphate (LFP) battery racks with multi-tier BMS and certified NFPA 855 fire suppression system.'
      },
      {
        id: 'BIDIRECTIONAL_PCS',
        name_fr: 'Onduleurs PCS 4-Quadrants Réseau-Formant (GFM)',
        name_en: '4-Quadrant Grid-Forming (GFM) Inverter PCS',
        category: 'EQUIPMENT',
        description_fr: 'Convertisseurs DC/AC réversibles à base d\'IGBT/SiC régulant indépendamment les puissances active P et réactive Q dans les 4 quadrants.',
        description_en: 'Bi-directional PCS inverters providing true voltage source behavior (Grid-Forming), synthetic inertia, and independent 4-quadrant P-Q control.'
      },
      {
        id: 'MV_COLLECTOR_XFMR',
        name_fr: 'Transformateur Élévateur 0.69 kV / 33 kV',
        name_en: 'Step-Up Collector Transformer (0.69 kV / 33 kV)',
        category: 'EQUIPMENT',
        description_fr: 'Transformateur immergé dans l\'ester diélectrique 35 MVA avec écran électrostatique entre enroulements pour filtrage harmonique.',
        description_en: '35 MVA ester-immersed step-up transformer with electrostatic shield between windings to attenuate high-frequency inverter switching spikes.'
      },
      {
        id: 'POI_GRID_INTERFACE',
        name_fr: 'Poste d\'Interconnexion Réseau (POI 33 kV / 90 kV)',
        name_en: 'Point of Interconnection Substation (POI 33 kV / 90 kV)',
        category: 'EQUIPMENT',
        description_fr: 'Point de livraison conforme aux exigences de raccordement du gestionnaire de réseau (SONATREL) avec comptage transactionnel 0.2S et protections ANSI 27/59, 81O/U.',
        description_en: 'High-voltage grid connection bay complying with utility interconnection code (SONATREL) including 0.2S revenue metering and IEEE 2800 ride-through relays.'
      },
      {
        id: 'PPC_PLANT_CONTROLLER',
        name_fr: 'Contrôleur Central de Centrale (PPC) & Lois P(f) / Q(U)',
        name_en: 'Power Plant Controller (PPC) & P(f) / Q(U) Algorithms',
        category: 'STAGE',
        description_fr: 'Algorithmes temps réel coordonnant le statisme fréquence P(f) (s = 3%), l\'inertie virtuelle (H = 4 s) et l\'injection réactive en creux LVRT.',
        description_en: 'Real-time master controller implementing droop response (s = 3%), virtual inertia emulation, and fast reactive current injection during LVRT events.'
      }
    ]
  },
  'transmission-distance-protection': {
    id: 'transmission-distance-protection',
    fileName: 'Transmission-Distance-Protection.jpg',
    originalFileName: 'Transmission-Distance-Protection.jpg',
    title_fr: "Protection de Distance Ligne HTB & Téléprotection (ANSI 21 / 85 / 68)",
    title_en: "HV Transmission Distance Protection & Teleprotection (ANSI 21 / 85 / 68)",
    subtitle_fr: "Plan d'Impédance R-X, Schéma POTT/PUTT par OPGW, Blocage sur Pompage ANSI 68 et Facteur k0",
    subtitle_en: "R-X Impedance Plane, POTT/PUTT OPGW Teleprotection, ANSI 68 Power Swing Blocking, and k0 Factor",
    category: 'TRANSMISSION',
    requiredLocation_fr: "Lignes HTB & Transport (D08), Protections Numériques (D11), Postes Électriques (D04)",
    requiredLocation_en: "HV Transmission Lines (D08), Digital Protection (D11), Substations (D04)",
    associatedViews: ['grid-map', 'protection', 'substation', 'simulation-lab'],
    keyStandards: ['IEC 60255-121', 'IEEE Std C37.113', 'IEEE Std C37.94', 'IEC 60870-5-104'],
    keyTakeaway_fr: "La protection de distance numérique ANSI 21 calcule en temps réel l'impédance de boucle phase-terre Z = U / (I + k0·3I0). L'association avec un canal de téléprotection OPGW (POTT) permet d'éliminer les défauts en bout de ligne (85-100%) en moins de 40 ms tout en évitant les déclenchements intempestifs sur pompage de puissance grâce à la fonction ANSI 68.",
    keyTakeaway_en: "Digital distance protection ANSI 21 calculates loop impedance Z = U / (I + k0·3I0) in real time. Coupling with an OPGW teleprotection channel (POTT) enables high-speed clearance of end-zone faults (85-100%) in under 40 ms while preventing unwanted trips during stable power swings via ANSI 68 logic.",
    hotspots: [
      {
        id: 'TRANSMISSION_LINE_SYSTEM',
        name_fr: 'Corridor Ligne 225 kV & Pylônes',
        name_en: '225 kV Line Corridor & Overhead Towers',
        category: 'EQUIPMENT',
        description_fr: 'Ligne de transport 225 kV Songloulou - Mangombé (85 km, Z_L = 3.2 + j28.4 Ω) équipée de conducteurs faisceau et câble de garde optique OPGW.',
        description_en: '225 kV transmission corridor (85 km, Z_L = 3.2 + j28.4 ohms) equipped with bundled conductors and OPGW composite shield wire.'
      },
      {
        id: 'RX_PLANE_ZONES',
        name_fr: 'Plan d\'Impédance R-X (Zones 1-2-3 & Blinder)',
        name_en: 'R-X Impedance Plane (Zones 1-2-3 & Blinder)',
        category: 'ZONE',
        description_fr: 'Caractéristique polygonale quadrilatérale ou mho circulaire : Zone 1 (85%, instantanée t1=0s), Zone 2 (120%, 300 ms), Zone 3 (150%) et encadrement de charge.',
        description_en: 'Quadrilateral polygonal or circular Mho tripping zones: Zone 1 (85%, t1=0s), Zone 2 (120%, 300 ms), Zone 3 (150%), and load encumbrance blinder.'
      },
      {
        id: 'TELEPROTECTION_MATH',
        name_fr: 'Logique Téléprotection POTT & Facteur k0',
        name_en: 'POTT Teleprotection Logic & Residual k0 Factor',
        category: 'STAGE',
        description_fr: 'Schéma POTT accélérant l\'ouverture du disjoncteur en bout de ligne à 35 ms via signal permissif OPGW et compensation homopolaire k0 = (Z0-Z1)/(3·Z1).',
        description_en: 'Permissive Overreach Transfer Trip (POTT) accelerating end-zone breaker trip to 35 ms via OPGW permissive keying and k0 zero-sequence compensation.'
      }
    ]
  }
};

// Populate aliases for flexible lookups across all components
const ALIAS_MAP: Record<string, string> = {
  'transmission-distance-protection': 'transmission-distance-protection',
  'transmission_distance_protection': 'transmission-distance-protection',
  'distance-protection': 'transmission-distance-protection',
  'distance_protection': 'transmission-distance-protection',
  'ansi-21-85-68': 'transmission-distance-protection',
  'ansi_21_85_68': 'transmission-distance-protection',
  'rx-plane': 'transmission-distance-protection',
  'rx_plane': 'transmission-distance-protection',
  'teleprotection': 'transmission-distance-protection',
  'pott-putt': 'transmission-distance-protection',
  'pott_putt': 'transmission-distance-protection',
  'solar-bess-grid-interconnection': 'solar-bess-grid-interconnection',
  'solar_bess_grid_interconnection': 'solar-bess-grid-interconnection',
  'solar-bess': 'solar-bess-grid-interconnection',
  'solar_bess': 'solar-bess-grid-interconnection',
  'bess-frequency-regulation': 'solar-bess-grid-interconnection',
  'bess_frequency_regulation': 'solar-bess-grid-interconnection',
  'virtual-inertia': 'solar-bess-grid-interconnection',
  'virtual_inertia': 'solar-bess-grid-interconnection',
  'ieee-2800': 'solar-bess-grid-interconnection',
  'ieee_2800': 'solar-bess-grid-interconnection',
  'industrial-mv-motor-protection': 'industrial-mv-motor-protection',
  'industrial_mv_motor_protection': 'industrial-mv-motor-protection',
  'motor-protection': 'industrial-mv-motor-protection',
  'motor_protection': 'industrial-mv-motor-protection',
  'ansi_49_51lr': 'industrial-mv-motor-protection',
  'thermal-replica': 'industrial-mv-motor-protection',
  'thermal_replica': 'industrial-mv-motor-protection',
  'mv-feeder-flisr-and-loop-automation': 'mv-feeder-flisr-and-loop-automation',
  'mv_feeder_flisr_and_loop_automation': 'mv-feeder-flisr-and-loop-automation',
  'flisr_automation': 'mv-feeder-flisr-and-loop-automation',
  'flisr-automation': 'mv-feeder-flisr-and-loop-automation',
  'feeder-automation': 'mv-feeder-flisr-and-loop-automation',
  'feeder_automation': 'mv-feeder-flisr-and-loop-automation',
  'recloser-coordination': 'mv-feeder-flisr-and-loop-automation',
  'recloser_coordination': 'mv-feeder-flisr-and-loop-automation',
  'substation-dc-auxiliary-and-trip-circuit': 'substation-dc-auxiliary-and-trip-circuit',
  'substation_dc_auxiliary_and_trip_circuit': 'substation-dc-auxiliary-and-trip-circuit',
  'trip_circuit_supervision': 'substation-dc-auxiliary-and-trip-circuit',
  'trip-circuit-supervision': 'substation-dc-auxiliary-and-trip-circuit',
  'ansi_74tc_50bf': 'substation-dc-auxiliary-and-trip-circuit',
  'ansi-74tc-50bf': 'substation-dc-auxiliary-and-trip-circuit',
  'dc_auxiliaries': 'substation-dc-auxiliary-and-trip-circuit',
  'dc-auxiliaries': 'substation-dc-auxiliary-and-trip-circuit',
  'power_systems_engineering': 'what-is-power-systems',
  'what_is_power_systems': 'what-is-power-systems',
  'transmission_vs_distribution': 'transmission-vs-distribution',
  'substation_overview': 'substation-overview',
  'substation_components': 'substation-components',
  'substation_sld': 'substation-one-line-diagram',
  'substation-sld': 'substation-one-line-diagram',
  'substation_protection_zones': 'substation-protection-zones',
  'substation_ground_grid': 'substation-ground-grid',
  'thermal_power_conversion': 'thermal-power-plant',
  'thermal-power-conversion': 'thermal-power-plant',
  // New aliases
  'common-power-distribution-system-types': 'common-power-distribution-system-types',
  'common_power_distribution_system_types': 'common-power-distribution-system-types',
  'distribution_system_types': 'common-power-distribution-system-types',
  'distribution-system-types': 'common-power-distribution-system-types',
  'how-a-transformer-works': 'how-a-transformer-works',
  'how_a_transformer_works': 'how-a-transformer-works',
  'how-transformer-works': 'how-a-transformer-works',
  'why-high-voltage-reduces-losses': 'why-high-voltage-reduces-losses',
  'why_high_voltage_reduces_losses': 'why-high-voltage-reduces-losses',
  'how-high-voltage-reduces-losses': 'why-high-voltage-reduces-losses',
  'how_high_voltage_reduces_losses': 'why-high-voltage-reduces-losses',
  'high_voltage_reduces_losses': 'why-high-voltage-reduces-losses',
  'how-power-distribution-works': 'how-power-distribution-works',
  'how_power_distribution_works': 'how-power-distribution-works',
  'how-power-generation-works': 'how-power-generation-works',
  'how_power_generation_works': 'how-power-generation-works',
  'how-power-transmission-works': 'how-power-transmission-works',
  'how_power_transmission_works': 'how-power-transmission-works',
  'how-to-read-a-transformer-nameplate': 'how-to-read-a-transformer-nameplate',
  'how_to_read_a_transformer_nameplate': 'how-to-read-a-transformer-nameplate',
  'transformer_nameplate': 'how-to-read-a-transformer-nameplate',
  'transformer-nameplate': 'how-to-read-a-transformer-nameplate',
  'main-types-of-power-generation': 'main-types-of-power-generation',
  'main_types_of_power_generation': 'main-types-of-power-generation',
  'generation_types': 'main-types-of-power-generation',
  'renewable-collector-substation': 'renewable-collector-substation',
  'renewable_collector_substation': 'renewable-collector-substation',
  'renewable-collector-substation-substations': 'renewable-collector-substation',
  'renewable_collector_substation_substations': 'renewable-collector-substation'
};

Object.entries(ALIAS_MAP).forEach(([alias, targetId]) => {
  if (ENGINEERING_INFOGRAPHICS[targetId]) {
    ENGINEERING_INFOGRAPHICS[alias] = ENGINEERING_INFOGRAPHICS[targetId];
  }
});

export function getEngineeringInfographic(id: string): EngineeringInfographic | undefined {
  return ENGINEERING_INFOGRAPHICS[id] || ENGINEERING_INFOGRAPHICS[ALIAS_MAP[id]];
}

export const INFOGRAPHICS_LIST: EngineeringInfographic[] = [
  ENGINEERING_INFOGRAPHICS['what-is-power-systems'],
  ENGINEERING_INFOGRAPHICS['transmission-vs-distribution'],
  ENGINEERING_INFOGRAPHICS['substation-overview'],
  ENGINEERING_INFOGRAPHICS['substation-components'],
  ENGINEERING_INFOGRAPHICS['substation-one-line-diagram'],
  ENGINEERING_INFOGRAPHICS['substation-protection-zones'],
  ENGINEERING_INFOGRAPHICS['substation-ground-grid'],
  ENGINEERING_INFOGRAPHICS['thermal-power-plant'],
  // 9 New Engineering Infographics
  ENGINEERING_INFOGRAPHICS['common-power-distribution-system-types'],
  ENGINEERING_INFOGRAPHICS['how-a-transformer-works'],
  ENGINEERING_INFOGRAPHICS['why-high-voltage-reduces-losses'],
  ENGINEERING_INFOGRAPHICS['how-power-distribution-works'],
  ENGINEERING_INFOGRAPHICS['how-power-generation-works'],
  ENGINEERING_INFOGRAPHICS['how-power-transmission-works'],
  ENGINEERING_INFOGRAPHICS['how-to-read-a-transformer-nameplate'],
  ENGINEERING_INFOGRAPHICS['main-types-of-power-generation'],
  ENGINEERING_INFOGRAPHICS['renewable-collector-substation'],
  ENGINEERING_INFOGRAPHICS['substation-dc-auxiliary-and-trip-circuit'],
  ENGINEERING_INFOGRAPHICS['mv-feeder-flisr-and-loop-automation'],
  ENGINEERING_INFOGRAPHICS['industrial-mv-motor-protection'],
  ENGINEERING_INFOGRAPHICS['solar-bess-grid-interconnection'],
  ENGINEERING_INFOGRAPHICS['transmission-distance-protection']
].filter(Boolean);

