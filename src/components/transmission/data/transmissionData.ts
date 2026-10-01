// src/components/transmission/data/transmissionData.ts
// Comprehensive EPEDE D03 Dataset: Transmission Networks / Transport HT

import type {
  TransmissionJourneyStage,
  OhlComponentNode,
  UgcComponentNode,
  CanonicalTransmissionEquipment,
  TransmissionScenario,
  ProtectionZoneConfig,
  TeleprotectionScheme,
  EpedeModuleReuse,
  TopologicalNode
} from '../types';

// ============================================================================
// 1. MASTER TRANSMISSION JOURNEY (8 STAGES)
// ============================================================================
export const TRANSMISSION_JOURNEY_STAGES: TransmissionJourneyStage[] = [
  {
    id: 'stage-1-gsu-bay',
    order: 1,
    code: 'STG-01',
    title_fr: 'Poste Élévateur & Travée GSU (11 kV → 225/400 kV)',
    title_en: 'Step-Up Substation & GSU Bay (11 kV → 225/400 kV)',
    category: 'generation_interface',
    voltage_level: '11 kV / 225 kV',
    typical_distance_km: 0.2,
    sil_mw: 140,
    characteristic_impedance_ohms: 360,
    reactive_charging_mvar_per_100km: 18,
    key_components_fr: [
      'Transformateur élévateur GSU (ex. 7 × 70 MVA Nachtigal)',
      'Disjoncteur de groupe SF6 / vide',
      'Traversées RIP (Resin Impregnated Paper)',
      'Parafoudres d\'oxyde de zinc ZnO classe station'
    ],
    key_components_en: [
      'Generator step-up transformer (GSU)',
      'Generator circuit breaker (GCB)',
      'RIP high-voltage bushings',
      'Station-class zinc-oxide surge arresters'
    ],
    physical_phenomena_fr: 'Élévation de tension pour diviser le courant par 20, réduisant les pertes Joules (P = 3·R·I²) par un facteur 400 pour le transit en masse.',
    physical_phenomena_en: 'Stepping up voltage reduces current by a factor of 20, shrinking Joule losses (P = 3·R·I²) by 400 for bulk transport.',
    governing_formulas: [
      {
        name: 'Loi de Joule',
        latex: 'P_{perte} = 3 \\cdot R_{ligne} \\cdot I^2 = 3 \\cdot R_{ligne} \\cdot \\left(\\frac{S}{\\sqrt{3} \\cdot U}\\right)^2',
        description: 'Les pertes sont inversement proportionnelles au carré de la tension de transport.'
      },
      {
        name: 'Rapport de Transformation',
        latex: 'm = \\frac{U_2}{U_1} = \\frac{N_2}{N_1} = \\frac{I_1}{I_2}',
        description: 'Conservation de la puissance apparente aux pertes magnétiques et Joule près.'
      }
    ],
    sonatrel_cameroon_benchmark: {
      line_name: 'Centrale Nachtigal Amont → Poste d\'Évacuation Nachtigal',
      substations: 'Usine Nachtigal → Poste d\'interconnexion 225 kV',
      voltage: '11 kV / 225 kV',
      length_km: 0.4,
      specifics_fr: '7 transformateurs 70 MVA YNd11 raccordés en barres blindées vers le poste élévateur GIS 225 kV.',
      specifics_en: '7 × 70 MVA YNd11 GSU transformers linked via isolated phase busbars to the 225 kV GIS switchyard.'
    },
    operational_rules: [
      'Surveillance continue DGA (gaz dissous) de l\'huile diélectrique',
      'Verrouillage mécanique interdisant la fermeture du sectionneur de terre sous tension',
      'Coordination de l\'isolement : BIL parafoudre 520 kV crête pour BIL transfo 1050 kV'
    ],
    icon: 'Zap'
  },
  {
    id: 'stage-2-gantry-takeoff',
    order: 2,
    code: 'STG-02',
    title_fr: 'Portique d\'Ancrage & Tête de Ligne Postes',
    title_en: 'Terminal Gantry & Line Departure Bay',
    category: 'substation_gantry',
    voltage_level: '225 kV',
    typical_distance_km: 0.5,
    sil_mw: 140,
    characteristic_impedance_ohms: 360,
    reactive_charging_mvar_per_100km: 18,
    key_components_fr: [
      'Portique d\'ancrage en charpente treillis métallique',
      'Chaînes d\'ancrage doubles en verre trempé ou composite',
      'Circuit bouchon CPL (Line Trap) pour téléconduite',
      'Transformateurs combinés de mesure TC/TT capacitifs (CVT)'
    ],
    key_components_en: [
      'Terminal steel take-off gantry structure',
      'Tension insulator strings with arcing horns',
      'PLC line traps for teleprotection signaling',
      'Capacitive Voltage Transformers (CVT)'
    ],
    physical_phenomena_fr: 'Transition entre l\'appareillage rigide du poste et la ligne flexible soumise aux tensions mécaniques et à l\'effet de fouet en cas de court-circuit.',
    physical_phenomena_en: 'Interface between rigid substation buswork and flexible transmission conductors subject to high mechanical pull and short-circuit whip.',
    governing_formulas: [
      {
        name: 'Effort de Traction d\'Ancrage',
        latex: 'T_0 = \\frac{p \\cdot a^2}{8 \\cdot f}',
        description: 'Tension horizontale du conducteur en fonction de la portée a, de la masse linéaire p et de la flèche f.'
      }
    ],
    sonatrel_cameroon_benchmark: {
      line_name: 'Poste de Bekoko 225 kV (Départ Mangombé)',
      substations: 'Bekoko 225 kV (Douala Ouest)',
      voltage: '225 kV',
      length_km: 0.6,
      specifics_fr: 'Portiques équipés de parafoudres ZnO déportés et boîtes d\'épissure pour fibres optiques OPGW.',
      specifics_en: 'Gantries equipped with surge arresters and OPGW optical fiber joint splice enclosures.'
    },
    operational_rules: [
      'Contrôle annuel par caméra acoustique ultrasonore des décharges partielles',
      'Vérification du couple de serrage des pinces d\'ancrage à cône de serrage'
    ],
    icon: 'Radio'
  },
  {
    id: 'stage-3-bulk-overhead-corridor',
    order: 3,
    code: 'STG-03',
    title_fr: 'Corridor Aérien Principal & Faisceau de Phase (Aster 570)',
    title_en: 'Main Bulk Overhead Corridor & Phase Bundles (Aster 570)',
    category: 'bulk_corridor',
    voltage_level: '225 kV / 400 kV',
    typical_distance_km: 120,
    sil_mw: 145,
    characteristic_impedance_ohms: 350,
    reactive_charging_mvar_per_100km: 20,
    key_components_fr: [
      'Pylônes treillis en acier galvanisé tétrapodes (hauteur 35 à 50 m)',
      'Faisceaux bifilaires Almélec Aster 570 mm² avec entretoises amortissantes',
      'Chaînes d\'isolateurs en V ou I en verre trempé (14 à 16 éléments)',
      'Câble de garde OPGW 48 fibres monomodes'
    ],
    key_components_en: [
      'Galvanized steel lattice towers (height 35 to 50 m)',
      'Duplex bundle AAAC Aster 570 mm² conductors with spacer-dampers',
      'V or I toughened glass insulator strings (14-16 discs)',
      '48-fiber single-mode OPGW shield wire'
    ],
    physical_phenomena_fr: 'Effet couronne atténué par le faisceau (gradient de surface < 16 kV/cm). Induction mutuelle électromagnétique et capacitive entre phases.',
    physical_phenomena_en: 'Corona discharge minimized by bundling (surface field gradient < 16 kV/cm). Interphase electrostatic and electromagnetic coupling.',
    governing_formulas: [
      {
        name: 'Puissance Naturelle (SIL)',
        latex: 'P_{SIL} = \\frac{U_n^2}{Z_c} = \\frac{U_n^2}{\\sqrt{\\frac{L}{C}}}',
        description: 'Au point SIL, la puissance réactive produite par la capacité de ligne compense exactement celle absorbée par son inductance.'
      },
      {
        name: 'Gradient de Potentiel de Surface (Peek)',
        latex: 'E_{max} = \\frac{U}{\\sqrt{3} \\cdot r_{eq} \\cdot \\ln\\left(\\frac{D}{r_{eq}}\\right)}',
        description: 'Le faisceau de conducteurs augmente le rayon équivalent req, abaissant le gradient sous le seuil d\'ionisation de l\'air.'
      }
    ],
    sonatrel_cameroon_benchmark: {
      line_name: 'Dorsale Nachtigal → Yaoundé (Poste Nomayos)',
      substations: 'Nachtigal 225 kV → Nomayos 225 kV',
      voltage: '225 kV Double Terne',
      length_km: 105,
      specifics_fr: 'Corridor stratégique évacuant 420 MW avec faisceau bifilaire Aster 570 et OPGW.',
      specifics_en: 'Strategic 420 MW evacuation corridor with twin Aster 570 bundles and optical ground wire.'
    },
    operational_rules: [
      'Élagage régulier de la bande de servitude (largeur 50 m) pour éviter les arcs de contournement',
      'Inspection héliportée ou par drone avec capteur LIDAR pour le suivi de la flèche thermique'
    ],
    icon: 'Cable'
  },
  {
    id: 'stage-4-special-crossings',
    order: 4,
    code: 'STG-04',
    title_fr: 'Franchissement Spécial de Fleuve / Relief & Longues Portées',
    title_en: 'Major River / Mountain Long-Span Crossing',
    category: 'special_crossing',
    voltage_level: '225 kV',
    typical_distance_km: 1.8,
    sil_mw: 145,
    characteristic_impedance_ohms: 350,
    reactive_charging_mvar_per_100km: 20,
    key_components_fr: [
      'Pylônes de grande hauteur (> 80 m) sur fondations spéciales en béton armé',
      'Conducteurs à âme composite haute résistance (ACCC ou ACSR spécial)',
      'Amortisseurs de vibrations Stockbridge multiples',
      'Balises sphériques d\'aviation diurnes et balises lumineuses inductives'
    ],
    key_components_en: [
      'Extra-tall crossing towers (> 80 m) on reinforced concrete caissons',
      'High-tensile composite-core conductors (ACCC or high-strength ACSR)',
      'Multiple Stockbridge resonant vibration dampers',
      'OACI red/white aviation warning spheres and induction night beacons'
    ],
    physical_phenomena_fr: 'Vibrations éoliennes de Kármán (10-50 Hz) et galop de ligne (0.1-1 Hz) sous vent traversier. Dilatation thermique extrême sur portée de 800 à 1200 m.',
    physical_phenomena_en: 'Aeolian vortex shedding (Kármán 10-50 Hz) and conductor galloping. Heavy thermal elongation across 800-1200 m spans.',
    governing_formulas: [
      {
        name: 'Équation de la Chaînette (Sag-Tension)',
        latex: 'y(x) = c \\cdot \\left[\\cosh\\left(\\frac{x}{c}\\right) - 1\\right] \\approx \\frac{x^2}{2c} = \\frac{p \\cdot x^2}{2 \\cdot T_0}',
        description: 'La flèche maximale au milieu de la portée dépend directement de la tension mécanique et du paramètre c = T0 / p.'
      }
    ],
    sonatrel_cameroon_benchmark: {
      line_name: 'Traversée du Fleuve Sanaga (Ligne Mangombé - Logbaba)',
      substations: 'Édéa → Douala',
      voltage: '225 kV',
      length_km: 1.2,
      specifics_fr: 'Portée de 840 m au-dessus de la Sanaga avec pylônes sur massifs en îlot rocheux et balisage OACI.',
      specifics_en: '840 m long span over Sanaga River on riverbed rock foundations with aviation warning spheres.'
    },
    operational_rules: [
      'Interdiction d\'exploiter au-delà de 75°C de température de conducteur pour préserver le gabarit fluvial',
      'Contrôle triennal de la corrosion galvanique de l\'âme acier des conducteurs'
    ],
    icon: 'Compass'
  },
  {
    id: 'stage-5-transition-station',
    order: 5,
    code: 'STG-05',
    title_fr: 'Poste de Transition Aéro-Souterrain & Têtes de Câbles',
    title_en: 'Overhead-to-Underground Transition Yard & Sealing Ends',
    category: 'transition',
    voltage_level: '225 kV / 90 kV',
    typical_distance_km: 0.3,
    sil_mw: 200,
    characteristic_impedance_ohms: 40,
    reactive_charging_mvar_per_100km: 160,
    key_components_fr: [
      'Portique de descente d\'ancrage aéro-souterrain',
      'Extrémités de câbles extérieures (Potheads) à cône déflecteur en silicone',
      'Parafoudres de transition ZnO pour la protection de l\'onde réfractée',
      'Limiteurs de tension de gaine (SVL) et boîtes de permutation (Link Boxes)'
    ],
    key_components_en: [
      'Transition gantry structure with down-lead support',
      'Outdoor cable sealing ends with silicone stress cones',
      'ZnO transition surge arresters for refracted surge protection',
      'Sheath Voltage Limiters (SVL) and Cross-Bonding Link Boxes'
    ],
    physical_phenomena_fr: 'Discontinuité d\'impédance brutale (Z_aérien = 350 Ω → Z_câble = 35 Ω). Réflexion et réfraction des ondes de foudre : l\'onde incidente est partiellement réfléchie en opposition de phase.',
    physical_phenomena_en: 'Abrupt surge impedance discontinuity (Z_overhead = 350 Ω to Z_cable = 35 Ω). Wave reflection and refraction at the transition junction.',
    governing_formulas: [
      {
        name: 'Coefficient de Réfraction de Tension',
        latex: 'k_r = \\frac{2 \\cdot Z_{cable}}{Z_{aerien} + Z_{cable}} = \\frac{2 \\cdot 35}{350 + 35} \\approx 0.18',
        description: 'La surtension pénétrant dans le câble est fortement atténuée par la faible impédance d\'onde du câble.'
      }
    ],
    sonatrel_cameroon_benchmark: {
      line_name: 'Poste de Transition Urbain de Douala (Bassa 90 kV)',
      substations: 'Bassa 225/90 kV → Pénétration urbaine Deïdo',
      voltage: '90 kV',
      length_km: 0.15,
      specifics_fr: 'Transition étanche entre la ligne 90 kV aérienne de Logbaba et les câbles XLPE 90 kV sous voirie urbaine.',
      specifics_en: 'Transition sealing end yard linking Logbaba overhead 90 kV feeder to city XLPE underground cables.'
    },
    operational_rules: [
      'Les parafoudres doivent être montés au plus près (< 2 m) des têtes de câbles pour éliminer la surtension d\'écartement',
      'Mesure annuelle de la résistance de terre de l\'écran de câble (R < 0.5 Ω)'
    ],
    icon: 'Layers'
  },
  {
    id: 'stage-6-underground-cable-corridor',
    order: 6,
    code: 'STG-06',
    title_fr: 'Liaison Souterraine XLPE & Système Cross-Bonding',
    title_en: 'Underground XLPE Cable Corridor & Cross-Bonding System',
    category: 'underground',
    voltage_level: '90 kV / 225 kV',
    typical_distance_km: 12,
    sil_mw: 800,
    characteristic_impedance_ohms: 38,
    reactive_charging_mvar_per_100km: 180,
    key_components_fr: [
      'Câble unipolaire 225 kV à âme cuivre Milliken 1600 mm² et isolant PR (XLPE)',
      'Gaine métallique en plomb extrudé ou aluminium ondulé étanche',
      'Jonctions préfabriquées à arrêt d\'écran avec boîtes de permutation Cross-Bonding',
      'Fibre optique DTS (Distributed Temperature Sensing) intégrée dans la gaine'
    ],
    key_components_en: [
      'Single-core 225 kV copper Milliken 1600 mm² with super-clean XLPE insulation',
      'Corrugated aluminum or extruded lead radial water barrier sheath',
      'Sectionalizing cross-bonding joints with outdoor link boxes',
      'Distributed Temperature Sensing (DTS) optical fiber in outer sheath'
    ],
    physical_phenomena_fr: 'Capacité linéique 20 à 30 fois plus élevée que l\'aérien. Fort courant capacitif de charge (I_c = ω·C·V). Courants induits dans les écrans métalliques compensés par le cross-bonding.',
    physical_phenomena_en: 'Capacitance 20-30x higher than overhead. Strong capacitive charging currents. Induced screen currents eliminated via cross-bonding.',
    governing_formulas: [
      {
        name: 'Puissance Réactive Capacitive du Câble',
        latex: 'Q_c = \\omega \\cdot C \\cdot U_n^2 = 2\\pi f \\cdot C \\cdot U_n^2',
        description: 'Pour 225 kV à C = 0.2 µF/km, la production réactive atteint 1.9 Mvar/km, limitant la longueur critique sans selfs.'
      },
      {
        name: 'Tension Induite en Gaine Non Reliée',
        latex: 'V_{gaine} = I_{conducteur} \\cdot \\omega \\cdot M \\cdot L_{mineure}',
        description: 'La tension induite sur une section mineure doit rester < 65 V en régime permanent et < 5 kV lors d\'un court-circuit.'
      }
    ],
    sonatrel_cameroon_benchmark: {
      line_name: 'Liaison Souterraine Bassa → Deïdo (Douala)',
      substations: 'Poste Bassa 90 kV → Poste Deïdo 90 kV',
      voltage: '90 kV',
      length_km: 6.8,
      specifics_fr: 'Pose en caniveau béton avec remblai thermique stabilisé (sable cimenté), 2 sections majeures en cross-bonding.',
      specifics_en: 'Concrete trough with fluidized thermal backfill, two major cross-bonding sections to eliminate circulating losses.'
    },
    operational_rules: [
      'Surveillance DTS en temps réel avec alarme seuil à 85°C sur l\'écran extérieur',
      'Essai de gaine selon CEI 60229 à 10 kV DC pendant 1 minute tous les 3 ans'
    ],
    icon: 'Activity'
  },
  {
    id: 'stage-7-intertie-substation',
    order: 7,
    code: 'STG-07',
    title_fr: 'Poste d\'Interconnexion & Réactance de Compensation Shunt',
    title_en: 'Bulk Receiving Substation & Shunt Reactor Compensation',
    category: 'intertie_substation',
    voltage_level: '225 kV / 90 kV',
    typical_distance_km: 0.4,
    sil_mw: 145,
    characteristic_impedance_ohms: 350,
    reactive_charging_mvar_per_100km: 20,
    key_components_fr: [
      'Autotransformateurs d\'interconnexion 225/90/15 kV (ex. 100 MVA Mangombé)',
      'Réactance shunt de compensation 225 kV (Self anti-Ferranti 20-40 Mvar)',
      'Jeu de barres principal double et disjoncteurs SF6 40 kA',
      'Batteries de condensateurs MT et système de compensation VAR dynamique'
    ],
    key_components_en: [
      'Interconnection autotransformers 225/90/15 kV (100 MVA class)',
      '225 kV shunt reactor (20-40 Mvar anti-Ferranti compensation)',
      'Double busbar system with 40 kA SF6 circuit breakers',
      'MV capacitor banks and dynamic reactive power compensation (SVC/STATCOM)'
    ],
    physical_phenomena_fr: 'Effet Ferranti en heures creuses : à faible charge, la tension en bout de ligne s\'élève dangereusement (U2 > U1 / cos(βl)). La self shunt absorbe l\'excédent capacitif.',
    physical_phenomena_en: 'Ferranti overvoltage at light load: receiving-end voltage rises (U2 > U1 / cos(βl)). Shunt reactors absorb surplus line Mvars.',
    governing_formulas: [
      {
        name: 'Effort de Surtension Ferranti',
        latex: 'U_2 = \\frac{U_1}{\\cos(\\beta \\cdot l)} \\approx U_1 \\cdot \\left(1 + \\frac{\\omega^2 \\cdot L \\cdot C \\cdot l^2}{2}\\right)',
        description: 'La surtension sans charge croît avec le carré de la longueur l de la ligne de transport.'
      }
    ],
    sonatrel_cameroon_benchmark: {
      line_name: 'Poste d\'Interconnexion de Mangombé (Édéa)',
      substations: 'Mangombé 225/90 kV',
      voltage: '225 kV / 90 kV',
      length_km: 0.5,
      specifics_fr: 'Carrefour névralgique du Réseau Interconnecté Sud (RIS) interconnectant Songloulou, Nachtigal, Douala et Yaoundé.',
      specifics_en: 'Central hub of Cameroon Southern Interconnected Grid linking Songloulou, Nachtigal, Douala and Yaoundé.'
    },
    operational_rules: [
      'Enclenchement automatique de la réactance shunt dès que la tension 225 kV dépasse 236 kV (1.05 p.u.)',
      'Régulation de tension par régleur en charge (OLTC) sur l\'autotransformateur'
    ],
    icon: 'ShieldCheck'
  },
  {
    id: 'stage-8-regional-bulk-infeed',
    order: 8,
    code: 'STG-08',
    title_fr: 'Injection Réseau Régional & Grands Consommateurs Industriels',
    title_en: 'Regional Sub-Transmission Infeed & Heavy Industrial Offtakers',
    category: 'bulk_infeed',
    voltage_level: '90 kV / 30 kV',
    typical_distance_km: 25,
    sil_mw: 28,
    characteristic_impedance_ohms: 380,
    reactive_charging_mvar_per_100km: 3.5,
    key_components_fr: [
      'Transformateurs d\'injection 90/30 kV (36 MVA à 50 MVA)',
      'Lignes de sous-transport 90 kV vers les villes secondaires (Bafoussam, Kribi, Limbe)',
      'Départs d\'électrolyse industrielle haute intensité (ex. Alucam 150 MW)',
      'Automates de délestage d\'urgence fréquence/tension (UFLS/UVLS)'
    ],
    key_components_en: [
      'Sub-transmission step-down transformers 90/30 kV (36-50 MVA)',
      '90 kV regional radial/loop feeders to secondary cities',
      'Heavy industrial smelting offtakers (e.g. Alucam 150 MW)',
      'Under-Frequency and Under-Voltage Load Shedding (UFLS/UVLS) relays'
    ],
    physical_phenomena_fr: 'Étalement de la charge, maintien du synchronisme face aux chocs de charge industriels. Maîtrise des creux de tension et des harmoniques.',
    physical_phenomena_en: 'Sub-transmission power distribution, system synchronism under heavy industrial load switching, harmonic mitigation.',
    governing_formulas: [
      {
        name: 'Délestage Fréquencemétrique (UFLS)',
        latex: '\\frac{df}{dt} = \\frac{f_0}{2H} \\cdot \\frac{P_{gen} - P_{charge}}{S_{base}}',
        description: 'Le gradient de chute de fréquence (RoCoF) déclenche les délestages automatiques par échelons pour sauver le réseau du black-out.'
      }
    ],
    sonatrel_cameroon_benchmark: {
      line_name: 'Alimentation du Bassin Industriel d\'Édéa (Alucam) & Douala Logbaba',
      substations: 'Postes Logbaba, Ngousso, Kondengui',
      voltage: '90 kV / 30 kV',
      length_km: 35,
      specifics_fr: 'Alimentation des cuves d\'électrolyse de l\'aluminium et des 20 départs 30 kV alimentant la métropole économique.',
      specifics_en: 'Powering aluminum smelting pots and 20 distribution feeders feeding the Douala economic metropolis.'
    },
    operational_rules: [
      'Coordination de la sélectivité chronométrique entre les protections 90 kV (distance) et 30 kV (surintensité)',
      'Facteur de puissance des industriels maintenu au-dessus de 0.93 pour éviter les pénalités réactives'
    ],
    icon: 'Network'
  }
];

// ============================================================================
// 2. OVERHEAD-LINE (OHL) EXPLORER TREE
// ============================================================================
export const OHL_EXPLORER_TREE: OhlComponentNode = {
  id: 'ohl-root',
  code: 'OHL-SYS',
  label_fr: 'Système Complet de Ligne Aérienne HTB (225 kV / 400 kV)',
  label_en: 'Complete 225 kV / 400 kV Overhead Transmission Line System',
  category: 'structure',
  level: 1,
  subsystem_fr: 'Infrastructure Globale de Transport Aérien',
  subsystem_en: 'Global Overhead Bulk Transmission Infrastructure',
  description_fr: 'Ouvrage de transport d\'électricité en courant alternatif triphasé composé de supports pylônes, de faisceaux de conducteurs de phase nus, de chaînes d\'isolateurs et de câbles de garde avec télécommunication optique intégrée.',
  description_en: 'Bulk three-phase AC overhead transmission system comprising steel lattice towers, bare phase conductor bundles, insulator strings and optical ground wires (OPGW).',
  technical_specs: [
    { key: 'Tension Nominale', value: '225 kV (Option 400 kV)', unit: 'kV' },
    { key: 'Fréquence Assignée', value: '50', unit: 'Hz' },
    { key: 'Capacité Thermique Transit', value: '350 à 750', unit: 'MVA/circuit' },
    { key: 'Largeur Emprise de Sécurité (RoW)', value: '50 à 70', unit: 'mètres' }
  ],
  governing_standards: ['CEI 60826', 'CEI 61284', 'CEI 61773', 'NF C 11-201', 'IEEE 738'],
  failure_modes: [
    { mode: 'Rupture mécanique de conducteur', cause: 'Surcharge éolienne, fatigue vibratoire ou foudroiement direct', criticality: 'CRITICAL', mitigation: 'Surdimensionnement mécanique classe 3, amortisseurs de vibrations et protection différentielle 87L ultra-rapide' },
    { mode: 'Contournement diélectrique phase-terre', cause: 'Coup de foudre ou pollution marine/industrielle sur isolateurs', criticality: 'HIGH', mitigation: 'Réenclenchement monophasé automatique (ANSI 79) et lavage ou utilisation de silicone hydrophobe' }
  ],
  maintenance_tasks: [
    'Inspection thermographique par drone ou hélicoptère tous les 6 mois',
    'Mesure de résistance de prise de terre des pylônes tous les 2 ans (cible < 10 Ω)',
    'Élagage forestier préventif sur l\'emprise de sécurité'
  ],
  children: [
    {
      id: 'ohl-towers',
      code: 'OHL-01',
      label_fr: '1. Pylônes & Fondations Métalliques',
      label_en: '1. Towers & Civil Foundations',
      category: 'structure',
      level: 2,
      subsystem_fr: 'Structure Porteuse & Génie Civil',
      subsystem_en: 'Supporting Structural Steel & Civil Works',
      description_fr: 'Ossature autoportante en treillis d\'acier galvanisé à chaud assurant le respect des distances d\'isolement électrique dans l\'air par rapport au sol et aux obstacles.',
      description_en: 'Self-supporting hot-dip galvanized steel lattice structure maintaining air clearances over ground and structures.',
      technical_specs: [
        { key: 'Hauteur Pylône', value: '32 à 58', unit: 'm' },
        { key: 'Poids Acier par Support', value: '8.5 à 22', unit: 'tonnes' },
        { key: 'Nuance Acier', value: 'S355 JR / S275 JR (Galvanisation > 86 µm)' },
        { key: 'Vitesse Vent Nominale', value: '140 (surpression 120 daN/m²)', unit: 'km/h' }
      ],
      governing_standards: ['CEI 60826', 'Eurocode 3 (EN 1993-4-1)', 'ASTM A123'],
      failure_modes: [
        { mode: 'Flambement cornière treillis', cause: 'Tornade violente ou rupture asymétrique de conducteur', criticality: 'CRITICAL', mitigation: 'Conception anti-cascade sur pylônes d\'ancrage tous les 5 km' },
        { mode: 'Arrachement massif de fondation', cause: 'Glissement de terrain ou sol meuble non consolidé', criticality: 'HIGH', mitigation: 'Fondations profondes sur micropieux ou puits forés' }
      ],
      maintenance_tasks: [
        'Vérification du couple de serrage des boulons HR et présence des goupilles',
        'Mesure de l\'épaisseur de couche de zinc résiduelle (anticorrosion)',
        'Contrôle visuel de l\'intégrité des plots béton de fondation (fissurations)'
      ],
      children: [
        {
          id: 'ohl-tower-types',
          code: 'OHL-01.01',
          label_fr: 'Pylônes d\'Alignement (Suspension) vs Pylônes d\'Angle / Ancrage',
          label_en: 'Suspension Towers vs Angle / Dead-End Strain Towers',
          category: 'structure',
          level: 3,
          subsystem_fr: 'Typologie des Supports',
          subsystem_en: 'Tower Typology',
          description_fr: 'Pylônes de suspension légers supportant le poids vertical des conducteurs en ligne droite. Pylônes d\'ancrage lourds capables de reprendre la tension longitudinale totale en cas de rupture de conducteur (arrêt de cascade).',
          description_en: 'Lightweight suspension towers taking vertical & transverse loads in straight runs. Heavy strain towers absorbing full longitudinal tension.',
          technical_specs: [
            { key: 'Angle de Déviation Suspension', value: '0 à 3', unit: 'degrés' },
            { key: 'Angle de Déviation Ancrage', value: '0 à 60 (selon type)', unit: 'degrés' },
            { key: 'Effort Longitudinal Admissible', value: '180', unit: 'kN' }
          ],
          governing_standards: ['CEI 60826'],
          failure_modes: [],
          maintenance_tasks: []
        },
        {
          id: 'ohl-foundations',
          code: 'OHL-01.02',
          label_fr: 'Systèmes de Fondations (Semelles, Micropieux & Ancrages Roche)',
          label_en: 'Foundation Systems (Pad & Chimney, Micropiles, Rock Anchors)',
          category: 'structure',
          level: 3,
          subsystem_fr: 'Génie Civil de Fondation',
          subsystem_en: 'Subsurface Civil Engineering',
          description_fr: 'Massifs en béton armé à semelle et cheminée (Pad and Chimney) ou puits forés reprenant les efforts de compression et d\'arrachement (Uplift) sous vent transversal maximum.',
          description_en: 'Reinforced concrete pad and chimney or drilled shafts resisting compressive and overturning uplift forces.',
          technical_specs: [
            { key: 'Dosage Béton', value: '350', unit: 'kg/m³ CEM II' },
            { key: 'Résistance Compression C25/30', value: '30', unit: 'MPa à 28 jours' },
            { key: 'Coefficient de Sécurité Arrachement', value: '1.5 à 2.0' }
          ],
          governing_standards: ['Eurocode 7 (EN 1997)', 'CEI 61773'],
          failure_modes: [],
          maintenance_tasks: []
        }
      ]
    },
    {
      id: 'ohl-conductors',
      code: 'OHL-02',
      label_fr: '2. Faisceau de Conducteurs de Phase & Accessoires',
      label_en: '2. Phase Conductor Bundle & Line Accessories',
      category: 'conductors',
      level: 2,
      subsystem_fr: 'Conducteurs Actifs & Liaison Électrique',
      subsystem_en: 'Active Conductors & Hardware',
      description_fr: 'Ensemble de câbles nus toronnés en alliage d\'aluminium (Almélec AAAC ou ACSR) formant les 3 phases. L\'utilisation d\'un faisceau bifilaire ou quadrifilaire augmente la capacité de transit et supprime l\'effet couronne.',
      description_en: 'Bare stranded aluminum alloy conductors (AAAC Aster or ACSR) configured in multi-conductor bundles per phase.',
      technical_specs: [
        { key: 'Alliage Conducteur', value: 'Almélec Al-Mg-Si (AAAC) Aster 570 mm²' },
        { key: 'Diamètre Extérieur', value: '31.05', unit: 'mm' },
        { key: 'Masse Linéique', value: '1570', unit: 'kg/km' },
        { key: 'Résistance DC à 20°C', value: '0.0583', unit: 'Ω/km' },
        { key: 'Charge de Rupture (RTS)', value: '168', unit: 'kN' },
        { key: 'Écartement Faisceau Bifilaire', value: '400', unit: 'mm' }
      ],
      governing_standards: ['CEI 61089', 'EN 50182', 'CEI 61854'],
      failure_modes: [
        { mode: 'Échauffement excessif & recuit thermique', cause: 'Transit prolongé au-dessus de l\'ampacité nominale', criticality: 'CRITICAL', mitigation: 'Système DLR (Dynamic Line Rating) et protection thermique 49' },
        { mode: 'Rapprochement et collision des sous-conducteurs', cause: 'Effort d\'attraction magnétique lors de court-circuit', criticality: 'HIGH', mitigation: 'Entretoises amortissantes espacées tous les 40 à 60 m' }
      ],
      maintenance_tasks: [
        'Vérification par thermographie infrarouge des manchons de jonction',
        'Contrôle visuel de l\'usure aux points de suspension (fretting-corrosion)'
      ],
      children: [
        {
          id: 'ohl-bundle-spacers',
          code: 'OHL-02.01',
          label_fr: 'Entretoises & Amortisseurs de Faisceau (Spacer Dampers)',
          label_en: 'Bundle Spacers & Resonant Spacer Dampers',
          category: 'conductors',
          level: 3,
          subsystem_fr: 'Maintien Géométrique du Faisceau',
          subsystem_en: 'Geometric Bundle Stability',
          description_fr: 'Dispositifs articulés avec articulations élastomères dissipatives maintenant l\'écartement standard de 400 mm et amortissant les vibrations de sous-portée (Subspan oscillations).',
          description_en: 'Articulated elastomer dampers maintaining 400 mm sub-conductor spacing and damping subspan wake galloping.',
          technical_specs: [
            { key: 'Espacement Nominal', value: '400', unit: 'mm' },
            { key: 'Amortissement Énergie', value: '> 15 % par cycle' }
          ],
          governing_standards: ['CEI 61854'],
          failure_modes: [],
          maintenance_tasks: []
        }
      ]
    },
    {
      id: 'ohl-insulators',
      code: 'OHL-03',
      label_fr: '3. Chaînes d\'Isolateurs & Matériel d\'Armement',
      label_en: '3. Insulator Strings & Hardware Assemblies',
      category: 'insulators',
      level: 2,
      subsystem_fr: 'Isolation Diélectrique & Suspension Mécanique',
      subsystem_en: 'Dielectric Insulation & Hardware',
      description_fr: 'Chaînes d\'éléments capot-tige en verre trempé ou isolateurs composites silicone assurant l\'isolation galvanique complète à 225 kV contre les chocs de foudre (1050 kV) et la tension de service.',
      description_en: 'Cap-and-pin toughened glass discs or silicone rubber composite long-rods providing high mechanical support and dielectric withstand.',
      technical_specs: [
        { key: 'Nombre d\'Éléments en Verre 225 kV', value: '14 à 16 (selon zone de pollution)' },
        { key: 'Ligne de Fuite Spécifique', value: '25 à 31 (Classe III/IV selon CEI 60815)', unit: 'mm/kV' },
        { key: 'Charge Mécanique Électromécanique', value: '160 à 210', unit: 'kN' },
        { key: 'Tenue Choc Foudre (BIL)', value: '1050', unit: 'kV crête' }
      ],
      governing_standards: ['CEI 60383-1', 'CEI 60815', 'CEI 61109'],
      failure_modes: [
        { mode: 'Contournement par pollution saline/poussière', cause: 'Humidité et dépôt conducteur réduisant la tenue diélectrique', criticality: 'HIGH', mitigation: 'Profil anti-pollution ou revêtement RTV (Room Temperature Vulcanizing)' },
        { mode: 'Éclatement spontané d\'élément verre', cause: 'Inclusion de sulfure de nickel (NiS)', criticality: 'MEDIUM', mitigation: 'Le verre trempé résiduel conserve 80% de sa résistance mécanique' }
      ],
      maintenance_tasks: [
        'Comptage des éléments brisés par inspection au sol ou drone haute résolution',
        'Contrôle de l\'état de corrosion des cornes d\'arc et anneaux pare-effluves'
      ],
      children: [
        {
          id: 'ohl-arcing-horns',
          code: 'OHL-03.01',
          label_fr: 'Éclateurs à Cornes & Anneaux Pare-Effluves (Corona Rings)',
          label_en: 'Arcing Horns & Corona Grading Rings',
          category: 'insulators',
          level: 3,
          subsystem_fr: 'Protection Contre les Arcs & Répartition du Champ',
          subsystem_en: 'Arc Guidance & Electric Field Grading',
          description_fr: 'Cornes métalliques calibrées pour guider l\'arc électrique de contournement loin des jupes d\'isolateurs et anneaux toroïdaux adoucissant la contrainte diélectrique aux extrémités de chaîne.',
          description_en: 'Metallic discharge horns diverting power flashover arcs away from glass surfaces and grading rings flattening electric field gradient.',
          technical_specs: [
            { key: 'Distance d\'Éclatement Calibrée', value: '1850 à 2050', unit: 'mm' },
            { key: 'Réduction Contrainte d\'Extrémité', value: 'Divisée par 3' }
          ],
          governing_standards: ['CEI 61284'],
          failure_modes: [],
          maintenance_tasks: []
        }
      ]
    },
    {
      id: 'ohl-shield-wires',
      code: 'OHL-04',
      label_fr: '4. Câble de Garde OPGW & Protection Foudre / Télécom',
      label_en: '4. OPGW Shield Wire & Lightning Protection / Telecom',
      category: 'shield_wire',
      level: 2,
      subsystem_fr: 'Protection Atmosphérique & Télécommunications',
      subsystem_en: 'Atmospheric Shielding & High-Speed Optical Comms',
      description_fr: 'Câble mixte placé au sommet du pylône combinant un blindage électrogéométrique contre les coups de foudre directs et un tube métallique étanche contenant 24 à 48 fibres optiques monomodes pour la téléconduite.',
      description_en: 'Top skywire shielding phase conductors from direct lightning strikes and housing 24 to 48 single-mode optical fibers in a stainless steel tube.',
      technical_specs: [
        { key: 'Nombre de Fibres Optiques', value: '48 (Monomodes G.652D)' },
        { key: 'Angle de Protection Foudre', value: '< 25', unit: 'degrés' },
        { key: 'Courant de Court-Circuit Tenue', value: '12', unit: 'kA (0.5 s)' },
        { key: 'Affaiblissement Optique', value: '< 0.22 dB/km à 1550 nm' }
      ],
      governing_standards: ['CEI 60794-4-10', 'IEEE 1138', 'CEI 60099'],
      failure_modes: [
        { mode: 'Fusion de brins d\'armure par coup de foudre sévère', cause: 'Impact de foudre supérieur à 150 C de charge transférée', criticality: 'HIGH', mitigation: 'Brins extérieurs en alliage aluminium-acier haute capacité thermique' },
        { mode: 'Rupture de fibre optique par traction ou courbure', cause: 'Tension de pose excessive ou vibration', criticality: 'HIGH', mitigation: 'Amortisseurs de vibrations Stockbridge et surveillance réflectométrique OTDR' }
      ],
      maintenance_tasks: [
        'Mesure réflectométrique OTDR annuelle de l\'atténuation des fibres',
        'Contrôle visuel de la fixation de la descente optique le long du montant de pylône'
      ]
    },
    {
      id: 'ohl-grounding',
      code: 'OHL-05',
      label_fr: '5. Prise de Terre de Pylône & Amortisseurs Vibratoires',
      label_en: '5. Tower Footing Grounding & Stockbridge Dampers',
      category: 'grounding',
      level: 2,
      subsystem_fr: 'Évacuation des Courants de Foudre & Dynamique Mécanique',
      subsystem_en: 'Surge Ground Discharge & Aeolian Vibration Damping',
      description_fr: 'Circuit de mise à la terre en patte d\'oie (électrodes rayonnantes en cuivre ou acier cuivré) garantissant une impédance de pied de pylône basse pour éviter l\'amorçage en retour (Back-Flashover).',
      description_en: 'Crow-foot counterpoise earth grid ensuring tower footing resistance <= 10 Ohms to prevent back-flashover under lightning impulses.',
      technical_specs: [
        { key: 'Résistance Pied de Pylône Cible', value: '< 10', unit: 'Ω' },
        { key: 'Amortisseurs de Vibrations', value: 'Stockbridge à 4 fréquences de résonance' },
        { key: 'Plage d\'Amortissement', value: '5 à 60', unit: 'Hz' }
      ],
      governing_standards: ['CEI 61936-1', 'IEEE 80', 'CEI 61897'],
      failure_modes: [
        { mode: 'Amorçage en retour (Back-Flashover)', cause: 'Résistance de pied de pylône trop élevée (> 30 Ω) sous choc de foudre', criticality: 'CRITICAL', mitigation: 'Pose de contrepoids enterrés reliant les pylônes successifs' }
      ],
      maintenance_tasks: [
        'Mesure de résistance de terre à haute fréquence / méthode voltampèremétrique',
        'Vérification du serrage des mâchoires des amortisseurs Stockbridge'
      ]
    }
  ]
};

// ============================================================================
// 3. UNDERGROUND-CABLE (UGC) EXPLORER TREE
// ============================================================================
export const UGC_EXPLORER_TREE: UgcComponentNode = {
  id: 'ugc-root',
  code: 'UGC-SYS',
  label_fr: 'Système Complet de Câble Souterrain Haute Tension (90 kV à 225 kV)',
  label_en: 'Complete HV Underground XLPE Cable System (90 kV to 225 kV)',
  category: 'conductor_core',
  level: 1,
  subsystem_fr: 'Liaison Souterraine Insensible aux Aléas Climatiques',
  subsystem_en: 'Weather-Resilient Underground Bulk Transmission Link',
  description_fr: 'Liaison haute tension triphasée unipolaire en câble à isolation synthétique extrudée polyéthylène réticulé (XLPE/PR) posée en caniveau ou tranchée, intégrant un système de mise à la terre des écrans en Cross-Bonding et une surveillance thermique continue par fibre optique (DTS).',
  description_en: 'Single-core extruded cross-linked polyethylene (XLPE) insulated HV cable link installed in troughs or trenches, featuring cross-bonding sheath earthing and optical Distributed Temperature Sensing (DTS).',
  technical_specs: [
    { key: 'Tension Assignée U0 / U (Um)', value: '130 / 225 (245) kV ou 52 / 90 (100) kV' },
    { key: 'Capacité de Transit', value: '250 à 450', unit: 'MVA/liaison' },
    { key: 'Durée de Vie de Conception', value: '> 40', unit: 'ans' },
    { key: 'Capacité Linéique', value: '0.18 à 0.25', unit: 'µF/km' }
  ],
  governing_standards: ['CEI 60840 (30-150 kV)', 'CEI 62067 (150-500 kV)', 'CEI 60287 (Ampacité)', 'CIGRE TB 761'],
  failure_modes: [
    { mode: 'Claquage diélectrique de l\'isolant XLPE', cause: 'Arborescences d\'eau (Water Trees) ou décharges partielles dans inclusions', criticality: 'CRITICAL', mitigation: 'Isolation super-clean extrudée triple couche sous azote sec et étanchéité radiale' },
    { mode: 'Surchauffe thermique par point chaud localisé (Dry-out)', cause: 'Assèchement du sol environnant augmentant la résistivité thermique', criticality: 'HIGH', mitigation: 'Remblai fluide stabilisé (sable-ciment) et système RTTR asservi au DTS' }
  ],
  maintenance_tasks: [
    'Surveillance continue des décharges partielles par capteurs HFCT',
    'Contrôle annuel des limiteurs de tension de gaine (SVL) dans les link boxes',
    'Essai de gaine PE extérieure à 10 kV DC selon CEI 60229'
  ],
  children: [
    {
      id: 'ugc-core',
      code: 'UGC-01',
      label_fr: '1. Âme Conductrice Milliken & Écrans Semi-Conducteurs',
      label_en: '1. Segmental Milliken Conductor & Semi-Conductive Screens',
      category: 'conductor_core',
      level: 2,
      subsystem_fr: 'Cœur Actif du Câble',
      subsystem_en: 'Cable Active Conductor Core',
      description_fr: 'Âme en cuivre ou aluminium segmentée en 4 à 6 secteurs isolés (technologie Milliken) pour réduire l\'effet de peau et de proximité au-delà de 1000 mm², enserrée entre deux couches de semi-conducteur extrudé.',
      description_en: 'Compacted stranded copper or aluminum conductor divided into 4-6 insulated segments (Milliken design) to minimize skin and proximity effects above 1000 mm².',
      technical_specs: [
        { key: 'Section Nominale', value: '1200 à 2500', unit: 'mm²' },
        { key: 'Facteur d\'Effet de Peau ks', value: '0.35 (contre 1.0 pour toron standard)' },
        { key: 'Température Maximale en Régime Continu', value: '90', unit: '°C' },
        { key: 'Température Court-Circuit (1s)', value: '250', unit: '°C' }
      ],
      governing_standards: ['CEI 60228', 'CEI 60840'],
      failure_modes: [],
      maintenance_tasks: [],
      children: [
        {
          id: 'ugc-semicon',
          code: 'UGC-01.01',
          label_fr: 'Écrans Semi-Conducteurs Extrudés Interne & Externe',
          label_en: 'Extruded Inner & Outer Semi-Conductive Screens',
          category: 'conductor_core',
          level: 3,
          subsystem_fr: 'Uniformisation du Champ Électrique',
          subsystem_en: 'Electric Field Radial Smoothing',
          description_fr: 'Couches de polymère chargé au noir de carbone assurant une interface parfaitement lisse et équipotentielle, éliminant les pointes de champ électrique à la surface des brins de cuivre.',
          description_en: 'Carbon-black loaded cross-linked compound providing smooth equipotential interfaces and eliminating surface field concentrations.',
          technical_specs: [
            { key: 'Épaisseur Écran Interne', value: '1.5 à 2.0', unit: 'mm' },
            { key: 'Résistivité Volumique Semi-Conductrice', value: '< 500', unit: 'Ω·cm à 90°C' }
          ],
          governing_standards: ['CEI 60840'],
          failure_modes: [],
          maintenance_tasks: []
        }
      ]
    },
    {
      id: 'ugc-dielectric',
      code: 'UGC-02',
      label_fr: '2. Enveloppe Isolante XLPE (Polyéthylène Réticulé)',
      label_en: '2. Super-Clean XLPE Dielectric Insulation',
      category: 'dielectric_screen',
      level: 2,
      subsystem_fr: 'Barrière Diélectrique Haute Tension',
      subsystem_en: 'High Voltage Dielectric Barrier',
      description_fr: 'Polymère réticulé chimiquement par peroxydes sous atmosphère d\'azote inerte à haute pression (ligne CDCC), exempt de micro-vacuoles et d\'impuretés (classe super-clean).',
      description_en: 'Super-clean high-purity cross-linked polyethylene extruded in a dry curing triple-head line under inert nitrogen atmosphere.',
      technical_specs: [
        { key: 'Épaisseur d\'Isolant 225 kV', value: '21 à 25', unit: 'mm' },
        { key: 'Gradient Électrique Maximal au Conducteur', value: '6.5 à 8.0', unit: 'kV/mm' },
        { key: 'Permittivité Relative εr', value: '2.3' },
        { key: 'Facteur de Pertes Diélectriques tan δ', value: '< 4 × 10⁻⁴ à 90°C' }
      ],
      governing_standards: ['CEI 62067', 'CIGRE TB 728'],
      failure_modes: [
        { mode: 'Arborescences électriques (Electrical Trees)', cause: 'Contrainte électrique excessive sur contaminant solide > 50 µm', criticality: 'CRITICAL', mitigation: 'Filtration 100 mesh lors de l\'extrusion et essais de décharges partielles en usine (< 5 pC)' }
      ],
      maintenance_tasks: [
        'Mesure en ligne des décharges partielles par capteurs UHF / HFCT'
      ]
    },
    {
      id: 'ugc-sheath',
      code: 'UGC-03',
      label_fr: '3. Écran Métallique, Étanchéité & Gaine Extérieure PE',
      label_en: '3. Metallic Sheath, Water-Barrier & Outer HDPE Sheath',
      category: 'metallic_sheath',
      level: 2,
      subsystem_fr: 'Étanchéité Radiale / Longitudinale & Blindage',
      subsystem_en: 'Water Sealing & Zero-Sequence Current Return',
      description_fr: 'Écran en aluminium ondulé soudé ou plomb extrudé complété par des poudres gonflantes hydro-bloquantes et protégé par une gaine en polyéthylène haute densité (HDPE) avec couche semi-conductrice extérieure pour test de gaine.',
      description_en: 'Welded corrugated aluminum or extruded lead sheath with longitudinal water-swellable tapes, sheathed in HDPE with extruded graphite test layer.',
      technical_specs: [
        { key: 'Matériau Écran', value: 'Aluminium ondulé soudé longitudinalement (ou Plomb extrudé)' },
        { key: 'Courant de Court-Circuit Écran (1s)', value: '31.5 à 40', unit: 'kA' },
        { key: 'Gaine Extérieure', value: 'HDPE noir résistant à l\'abrasion et aux termites' },
        { key: 'Essai Diélectrique de Gaine', value: '10 kV DC pendant 1 min selon CEI 60229' }
      ],
      governing_standards: ['CEI 60502-2', 'CEI 60840', 'CEI 60229'],
      failure_modes: [
        { mode: 'Pénétration d\'eau dans l\'isolant', cause: 'Blessure de la gaine par engin de chantier ou corrosion', criticality: 'CRITICAL', mitigation: 'Rubans gonflants bloquant l\'eau sur < 3 m et tests de gaine périodiques' }
      ],
      maintenance_tasks: [
        'Test d\'isolement de la gaine extérieure tous les 3 ans à 10 kV DC'
      ]
    },
    {
      id: 'ugc-crossbonding',
      code: 'UGC-04',
      label_fr: '4. Système de Mise à la Terre Cross-Bonding & Link Boxes',
      label_en: '4. Cross-Bonding Sheath Earthing System & Link Boxes',
      category: 'bonding_link_box',
      level: 2,
      subsystem_fr: 'Gestion des Courants Induits & Pertes en Gaine',
      subsystem_en: 'Induced Circulating Current Mitigation',
      description_fr: 'Régime de mise à la terre où les écrans des 3 phases sont permutés cycliquement tous les 400 à 800 m (sections mineures). Sur une section majeure complète de 3 sections, la somme des tensions induites est nulle, éliminant les courants de circulation et augmentant la capacité de transit de 25%.',
      description_en: 'Special bonding technique swapping cable sheaths cyclically between phases across 3 minor sections to cancel induced sheath voltages and circulating currents.',
      technical_specs: [
        { key: 'Gain de Capacité de Transit', value: '+ 20 à + 30 % par rapport au Solid Bonding' },
        { key: 'Tension Induite Maximale en Régime Normal', value: '< 65', unit: 'V' },
        { key: 'Parafoudres d\'Écran (SVL)', value: 'Varistances ZnO non-linéaires Uc 3 à 6 kV' },
        { key: 'Longueur Section Majeure Typique', value: '1.5 à 2.5', unit: 'km' }
      ],
      governing_standards: ['CIGRE TB 283', 'IEEE 575', 'CEI 60287-1-1'],
      failure_modes: [
        { mode: 'Destruction de varistance SVL en boîte de déconnexion', cause: 'Court-circuit réseau sévère ou foudroiement avec choc transitoire', criticality: 'HIGH', mitigation: 'Surveillance thermographique des link boxes et test annuel de courant de fuite SVL' }
      ],
      maintenance_tasks: [
        'Contrôle de l\'isolement des coupures d\'écran à 5 kV DC',
        'Mesure des courants résiduels de circulation d\'écran avec pince ampèremétrique'
      ]
    },
    {
      id: 'ugc-terminations',
      code: 'UGC-05',
      label_fr: '5. Extrémités (Potheads), Jonctions & Surveillance DTS',
      label_en: '5. Outdoor Sealing Ends, Joints & DTS Sensing',
      category: 'terminations_joints',
      level: 2,
      subsystem_fr: 'Accessoires de Raccordement & Surveillance Temps Réel',
      subsystem_en: 'High Voltage Accessories & Real-Time Monitoring',
      description_fr: 'Boîtes d\'extrémités extérieures en composite silicone à cône déflecteur prémoulé et remplissage d\'huile synthétique ou gel diélectrique. Jonctions préfabriquées à arrêt d\'écran avec fibre optique DTS mesurant la température par effet Raman.',
      description_en: 'Silicone composite outdoor sealing ends with premolded stress cones, sectionalizing joints and Distributed Temperature Sensing fiber.',
      technical_specs: [
        { key: 'Résolution Spatiale DTS', value: '1.0', unit: 'mètre' },
        { key: 'Précision Température DTS', value: '± 1.0', unit: '°C' },
        { key: 'Tenue Diélectrique Accessoires', value: 'Conforme CEI 60840 / 62067 (1050 kV BIL)' },
        { key: 'Raccordement Postes Blindés', value: 'Extrémités enfichables selon CEI 62271-209' }
      ],
      governing_standards: ['CEI 60840', 'CEI 62271-209', 'CIGRE TB 496'],
      failure_modes: [
        { mode: 'Contournement interne de cône déflecteur', cause: 'Défaut de positionnement lors du montage ou pollution de l\'interface', criticality: 'CRITICAL', mitigation: 'Monteurs qualifiés avec certification constructeur et test de réception VLF / résonant AC' }
      ],
      maintenance_tasks: [
        'Inspection thermographique des raccords haute tension aux bornes de traversée',
        'Contrôle de la pression d\'huile ou de gaz dans les têtes de câbles pressurisées'
      ]
    }
  ]
};

// ============================================================================
// 4. CANONICAL TRANSMISSION EQUIPMENT SCHEMA EXAMPLES
// ============================================================================
export const CANONICAL_TRANSMISSION_EQUIPMENTS: CanonicalTransmissionEquipment[] = [
  {
    id: 'eq-ohl-225kv-nachtigal-nomayos',
    canonical_code: 'EPEDE-D03-OHL-225KV-NAC-NOM',
    name_fr: 'Ligne Aérienne HTB 225 kV Nachtigal - Nomayos (Dorsale RIS)',
    name_en: '225 kV Overhead Transmission Line Nachtigal - Nomayos',
    domain_code: 'D03',
    subdomain_code: 'D03.01',
    classification: {
      system_type: 'Overhead_Line',
      voltage_class: 'HTB_225kV',
      iec_functional_id: 'TL-225-01'
    },
    electrical_parameters: {
      rated_voltage_un_kv: 225,
      highest_voltage_um_kv: 245,
      nominal_frequency_hz: 50,
      rated_continuous_current_a: 1440, // 2 x 720 A (faisceau bifilaire)
      short_circuit_withstand_ka_1s: 40,
      bil_lightning_impulse_kv_peak: 1050,
      sil_switching_impulse_kv_peak: 850,
      positive_sequence_r1_ohm_per_km: 0.0292,
      positive_sequence_x1_ohm_per_km: 0.312,
      positive_sequence_b1_microsiemens_per_km: 3.65,
      zero_sequence_r0_ohm_per_km: 0.168,
      zero_sequence_x0_ohm_per_km: 1.05,
      zero_sequence_b0_microsiemens_per_km: 2.15,
      surge_impedance_zc_ohms: 292,
      surge_impedance_loading_sil_mw: 173
    },
    physical_geometry: {
      conductor_type: 'Almélec Aster 570 mm² (AAAC)',
      cross_section_mm2: 570,
      bundle_configuration: 'Duplex_400mm',
      overall_diameter_mm: 31.05,
      linear_weight_kg_per_km: 1570,
      ruling_span_m: 400,
      max_sag_at_75c_m: 11.2,
      right_of_way_width_m: 50,
      min_ground_clearance_m: 8.5
    },
    thermal_ampacity: {
      winter_continuous_mva: 580,
      summer_continuous_mva: 520,
      emergency_15min_mva: 640,
      conductor_max_temp_c: 75,
      dlr_enabled: true
    },
    cigre_asset_health: {
      health_index_score: 96,
      estimated_lifespan_years: 50,
      current_age_years: 2,
      critical_inspection_criteria: [
        'Résistance de mise à la terre des pylônes (< 10 Ω)',
        'Absence de corrosion sur les goupilles de suspension en acier inoxydable',
        'Intégrité optique des 48 fibres OPGW (atténuation < 0.22 dB/km)'
      ],
      partial_discharge_status: 'NORMAL',
      thermography_status: 'NORMAL'
    },
    cameroon_corridor_application: {
      corridor_name: 'Évacuation Centrale Hydroélectrique Nachtigal vers Yaoundé',
      owner_operator: 'SONATREL',
      commissioning_year: 2024,
      length_km: 105
    }
  },
  {
    id: 'eq-ugc-90kv-bassa-deido',
    canonical_code: 'EPEDE-D03-UGC-90KV-BAS-DEI',
    name_fr: 'Liaison Câble Souterrain 90 kV Bassa - Deïdo (Douala Métropole)',
    name_en: '90 kV Underground XLPE Cable Link Bassa - Deïdo (Douala)',
    domain_code: 'D03',
    subdomain_code: 'D03.02',
    classification: {
      system_type: 'Underground_Cable',
      voltage_class: 'HTB_90kV',
      iec_functional_id: 'CBL-090-01'
    },
    electrical_parameters: {
      rated_voltage_un_kv: 90,
      highest_voltage_um_kv: 100,
      nominal_frequency_hz: 50,
      rated_continuous_current_a: 980,
      short_circuit_withstand_ka_1s: 31.5,
      bil_lightning_impulse_kv_peak: 450,
      sil_switching_impulse_kv_peak: 380,
      positive_sequence_r1_ohm_per_km: 0.021,
      positive_sequence_x1_ohm_per_km: 0.115,
      positive_sequence_b1_microsiemens_per_km: 68.5,
      zero_sequence_r0_ohm_per_km: 0.082,
      zero_sequence_x0_ohm_per_km: 0.142,
      zero_sequence_b0_microsiemens_per_km: 68.5,
      surge_impedance_zc_ohms: 41,
      surge_impedance_loading_sil_mw: 198
    },
    physical_geometry: {
      conductor_type: 'Cuivre Milliken Compacté 1200 mm²',
      cross_section_mm2: 1200,
      bundle_configuration: 'Simplex',
      overall_diameter_mm: 88,
      linear_weight_kg_per_km: 14200,
      ruling_span_m: 0,
      max_sag_at_75c_m: 0,
      right_of_way_width_m: 2.5,
      min_ground_clearance_m: 1.5 // Profondeur d'enfouissement
    },
    thermal_ampacity: {
      winter_continuous_mva: 160,
      summer_continuous_mva: 145,
      emergency_15min_mva: 175,
      conductor_max_temp_c: 90,
      dlr_enabled: true
    },
    cigre_asset_health: {
      health_index_score: 88,
      estimated_lifespan_years: 40,
      current_age_years: 8,
      critical_inspection_criteria: [
        'Tenue d\'isolement de gaine PE extérieure à 10 kV DC',
        'Courant de fuite aux bornes des limiteurs de tension SVL (< 100 µA)',
        'Niveau maximal de température au DTS sous voirie urbaine (< 70°C)'
      ],
      partial_discharge_status: 'NORMAL',
      thermography_status: 'NORMAL'
    },
    cameroon_corridor_application: {
      corridor_name: 'Pénétration Énergétique Urbaine Douala Centre',
      owner_operator: 'Eneo / SONATREL',
      commissioning_year: 2018,
      length_km: 6.8
    }
  }
];

// ============================================================================
// 5. INTERACTIVE SCENARIOS (4 HIGH-VOLTAGE OPERATIONAL SCENARIOS)
// ============================================================================
export const TRANSMISSION_SCENARIOS: TransmissionScenario[] = [
  {
    id: 'scen-ferranti-compensation',
    title_fr: 'Scénario 1 : Effet Ferranti à Vide & Enclenchement Réactance Shunt 225 kV',
    title_en: 'Scenario 1: No-Load Ferranti Overvoltage & Shunt Reactor Insertion',
    summary_fr: 'Simulation en heures creuses de l\'effet de surtension capacitive en bout de ligne de 225 kV non chargée et restauration de la tension par une self de compensation.',
    summary_en: 'Simulating receiving-end capacitive overvoltage on an unloaded 225 kV line and voltage stabilization using a shunt reactor.',
    physics_basis_fr: 'Le courant capacitif traversant l\'inductance série de la ligne crée une élévation de potentiel en quadrature : U2 = U1 / cos(βl).',
    physics_basis_en: 'Capacitive charging current crossing series line inductance generates a quadrature voltage rise: U2 = U1 / cos(βl).',
    initial_conditions: {
      voltage_kv: 225,
      length_km: 250,
      load_mw: 0,
      power_factor: 1.0,
      ambient_temp_c: 28,
      wind_speed_ms: 1.0,
      reactor_mvar: 0
    },
    governing_law: 'U_2 = \\frac{U_1}{\\cos(\\beta \\cdot l)} \\approx U_1 \\cdot \\left(1 + \\frac{\\omega^2 L C \\cdot l^2}{2}\\right)',
    key_learning_fr: 'Une ligne 225 kV de 250 km à vide voit sa tension grimper de +8.5% (244 kV), frôlant la limite Um = 245 kV. Une self de 40 Mvar ramène la tension à 228 kV (1.01 p.u.).',
    key_learning_en: 'A 250 km unloaded 225 kV line exhibits an 8.5% voltage swell (244 kV), near maximum Um = 245 kV. Inserting a 40 Mvar reactor restores normal 228 kV.',
    sonatrel_reference: 'Ligne Nachtigal - Bafoussam (225 kV, 180 km) & Poste de Bafoussam'
  },
  {
    id: 'scen-thermal-sag-dlr',
    title_fr: 'Scénario 2 : Transit de Pointe, Bilan Thermique IEEE 738 & Flèche Maximale',
    title_en: 'Scenario 2: Peak Power Transit, IEEE 738 Heat Balance & Critical Sag',
    summary_fr: 'Calcul en temps réel de la température d\'équilibre du conducteur sous fort ensoleillement et vent nul, et détection du risque de violation du gabarit de sécurité au sol.',
    summary_en: 'Real-time calculation of conductor equilibrium temperature under heavy solar radiation and low wind, monitoring ground clearance margins.',
    physics_basis_fr: 'Équilibre thermique en régime permanent : Qc (convection) + Qr (rayonnement) = Qj (Joule) + Qs (apport solaire). La dilatation thermique allonge le conducteur et augmente la flèche.',
    physics_basis_en: 'Steady-state heat balance: Qc (convective) + Qr (radiation) = Qj (Joule) + Qs (solar). Thermal elongation increases mid-span sag.',
    initial_conditions: {
      voltage_kv: 225,
      length_km: 105,
      load_mw: 420, // Pleine charge Nachtigal
      power_factor: 0.95,
      ambient_temp_c: 38,
      wind_speed_ms: 0.5,
      reactor_mvar: 0
    },
    governing_law: 'q_c + q_r = q_s + I^2 \\cdot R(T) \\quad \\Longrightarrow \\quad f = f_0 \\cdot \\left[1 + \\alpha_t \\cdot (T - T_0)\\right]',
    key_learning_fr: 'À 38°C sous vent de 0.5 m/s, le courant de 1150 A fait monter le conducteur à 72°C. La flèche atteint 10.9 m, réduisant la garde au sol à 8.6 m (conforme au minimum légal de 8.5 m).',
    key_learning_en: 'At 38°C and 0.5 m/s wind, 1150 A heats conductor to 72°C, producing 10.9 m sag and leaving 8.6 m ground clearance (legal minimum 8.5 m).',
    sonatrel_reference: 'Corridor 225 kV Mangombé - Logbaba (Traversée périurbaine)'
  },
  {
    id: 'scen-single-pole-autoreclose',
    title_fr: 'Scénario 3 : Défaut Monophasé Fugitif & Réenclenchement Unipolaire (ANSI 21/79)',
    title_en: 'Scenario 3: Single-Phase Fault & Single-Pole Autoreclose Sequence (ANSI 21/79)',
    summary_fr: 'Cycle de déclenchement ultra-rapide de la phase en défaut par la protection de distance (Zone 1) et réenclenchement après extinction de l\'arc secondaire sans coupure du transit.',
    summary_en: 'Ultra-fast Zone 1 distance trip of the faulted phase only, followed by secondary arc extinction and single-pole reclosure while maintaining transit on two healthy phases.',
    physics_basis_fr: 'Sur les réseaux THT, 80% des défauts sont monophasés et fugitifs (coup de foudre). L\'ouverture de la seule phase en défaut maintient le synchronisme et évite le décrochage des alternateurs.',
    physics_basis_en: 'On EHV grids, 80% of faults are single-phase-to-earth flashovers. Tripping only the faulted phase preserves generator transient stability.',
    initial_conditions: {
      voltage_kv: 225,
      length_km: 120,
      load_mw: 350,
      power_factor: 0.92,
      ambient_temp_c: 25,
      wind_speed_ms: 2.0
    },
    governing_law: 'T_{decl} = 20\\text{ ms (Zone 1)} + 40\\text{ ms (Disjoncteur)} \\to T_{pause} = 1.0\\text{ s (Arc extinction)} \\to T_{reenc} = 60\\text{ ms}',
    key_learning_fr: 'Pendant le temps mort de 1.0 s, les deux phases saines transmettent 58% de la puissance, préservant la stabilité angulaire du barrage de Nachtigal.',
    key_learning_en: 'During the 1.0 s single-pole dead time, the two healthy phases transmit 58% power, preserving angular stability of Nachtigal hydro plant.',
    sonatrel_reference: 'Protection numérique ABB REL670 / Siemens SIPROTEC 7SA'
  },
  {
    id: 'scen-cross-bonding-breakdown',
    title_fr: 'Scénario 4 : Rupture de Continuité Cross-Bonding & Surtension d\'Écran de Câble',
    title_en: 'Scenario 4: Cross-Bonding Disconnection & Cable Sheath Overvoltage',
    summary_fr: 'Simulation d\'une défaillance dans une link box souterraine (déconnexion de la permutation) provoquant de forts courants de circulation et un risque de choc électrique.',
    summary_en: 'Simulating link box disconnection causing circulating sheath currents and exceeding touch voltage limits.',
    physics_basis_fr: 'La rupture de l\'équilibrage en trois tiers rompt la neutralisation des forces électromotrices induites, provoquant une circulation de courant de plusieurs centaines d\'ampères.',
    physics_basis_en: 'Loss of three-phase balance prevents induced voltage cancellation, causing hundreds of amperes of sheath circulating currents.',
    initial_conditions: {
      voltage_kv: 90,
      length_km: 6.8,
      load_mw: 120,
      power_factor: 0.95,
      ambient_temp_c: 30,
      wind_speed_ms: 0
    },
    governing_law: 'I_{gaine} = \\frac{E_{induit}}{R_{gaine} + R_{terre}} = \\frac{\\omega \\cdot M \\cdot I_{charge} \\cdot L}{R_{gaine}}',
    key_learning_fr: 'En Solid Bonding dégradé, les pertes en gaine augmentent de 35 kW/km, échauffant le câble de +14°C et réduisant l\'ampacité admissible de 22%.',
    key_learning_en: 'Under degraded solid bonding, sheath losses rise by 35 kW/km, elevating cable temperature by 14°C and derating capacity by 22%.',
    sonatrel_reference: 'Liaison Souterraine 90 kV Bassa - Deïdo'
  }
];

// ============================================================================
// 6. PROTECTION & TELECOMMUNICATION OVERLAY
// ============================================================================
export const TRANSMISSION_PROTECTION_ZONES: ProtectionZoneConfig[] = [
  {
    zone: 'Zone 1',
    reach_percent: 85,
    reach_ohms_primary: 7.8,
    time_delay_s: 0.0,
    directional: 'FORWARD',
    scheme: 'INSTANTANEOUS'
  },
  {
    zone: 'Zone 2',
    reach_percent: 120,
    reach_ohms_primary: 11.2,
    time_delay_s: 0.35,
    directional: 'FORWARD',
    scheme: 'TELEPROTECTION_TRIP'
  },
  {
    zone: 'Zone 3',
    reach_percent: 160,
    reach_ohms_primary: 15.5,
    time_delay_s: 0.8,
    directional: 'FORWARD',
    scheme: 'TIME_DELAYED'
  },
  {
    zone: 'Reverse Zone 4',
    reach_percent: 25,
    reach_ohms_primary: 2.5,
    time_delay_s: 1.2,
    directional: 'REVERSE',
    scheme: 'TIME_DELAYED'
  }
];

export const TELEPROTECTION_SCHEMES: TeleprotectionScheme[] = [
  {
    name: 'POTT',
    full_name: 'Permissive Overreach Transfer Trip',
    description_fr: 'La détection en Zone 2 (au-delà du bout de ligne) émet un ordre permissif vers l\'autre extrémité. Si les deux relais voient le défaut en zone 2, déclenchement instantané à 100% de la ligne en 45 ms.',
    description_en: 'Zone 2 pickup transmits a permissive carrier signal. If both line ends detect Zone 2 forward, both ends trip instantaneously in under 45 ms.',
    communication_medium: 'OPGW_FIBER',
    latency_ms: 3.5,
    trip_time_total_ms: 48
  },
  {
    name: 'PUTT',
    full_name: 'Permissive Underreach Transfer Trip',
    description_fr: 'Le relais déclenchant en Zone 1 émet un signal de téléaction vers le poste distant pour forcer son déclenchement instantané sans attendre sa temporisation Zone 2.',
    description_en: 'Zone 1 pickup initiates immediate local trip and transmits carrier signal to trigger instantaneous remote trip.',
    communication_medium: 'OPGW_FIBER',
    latency_ms: 3.5,
    trip_time_total_ms: 45
  },
  {
    name: 'BCC',
    full_name: 'Blocking Carrier Comparison',
    description_fr: 'Un défaut externe inverse déclenche un signal de blocage pour empêcher le relais distant de déclencher par erreur en Zone 2.',
    description_en: 'Reverse-looking elements send a blocking signal to prevent false trips on external faults.',
    communication_medium: 'PLC_CARRIER',
    latency_ms: 12.0,
    trip_time_total_ms: 70
  },
  {
    name: 'DTT',
    full_name: 'Direct Transfer Trip (Télé-déclenchement Direct)',
    description_fr: 'Ordre de déclenchement direct inconditionnel utilisé lors du déclenchement disjoncteur défaillant (50BF) ou de la protection différentielle de barre.',
    description_en: 'Direct unconditioned trip signal used for breaker failure (50BF) or transformer/busbar trips.',
    communication_medium: 'OPGW_FIBER',
    latency_ms: 3.0,
    trip_time_total_ms: 35
  }
];

export const OPGW_48_FIBER_MAP = [
  { fiber_pair: '01-04', purpose: 'Protection Différentielle de Ligne (ANSI 87L) Canal A & B', protocol: 'C37.94 / 2 Mbps direct', latency_us: 450 },
  { fiber_pair: '05-08', purpose: 'Téléprotection Distance (POTT / DTT) & Inter-tripping', protocol: 'IEC 61850-9-2 / GOOSE over WAN', latency_us: 520 },
  { fiber_pair: '09-16', purpose: 'Téléconduite SCADA Nationale SONATREL', protocol: 'IEC 60870-5-104 / IP-MPLS', latency_us: 1200 },
  { fiber_pair: '17-24', purpose: 'Synchrophaseurs PMU (WAMS & Dynamique Réseau)', protocol: 'IEEE C37.118 streaming 50 fps', latency_us: 800 },
  { fiber_pair: '25-36', purpose: 'Réseau Entreprise & Téléphonie Sécurisée VoIP Postes', protocol: 'Gigabit Ethernet LAN', latency_us: 1500 },
  { fiber_pair: '37-48', purpose: 'Fibres Noires en Réserve & Location Opérateurs Télécom', protocol: 'Dark Fiber reserve (G.652D)', latency_us: 0 }
];

// ============================================================================
// 7. EPEDE DATA REUSE MAP (INTEGRATION WITH EXISTING MODULES)
// ============================================================================
export const EPEDE_MODULE_REUSE_MAP: EpedeModuleReuse[] = [
  {
    source_module: 'D01',
    source_name_fr: 'Production d\'Énergie & Centrales (Hydropower)',
    source_name_en: 'Energy Generation & Hydropower Twin',
    data_flowing_in: [
      'Puissance active injectée P_gen (MW)',
      'Plage de fourniture réactive Q_min / Q_max (Mvar)',
      'Tension de sortie alternateur (11/15 kV)',
      'Inertie des groupes tournants H (secondes)'
    ],
    data_flowing_out: [
      'Tension au nœud de raccordement 225 kV',
      'Impédance de court-circuit amont Sk_grid',
      'Ordre de consigne P/Q dispatching SONATREL'
    ],
    shared_interfaces: ['Transformateur GSU 11/225 kV', 'Disjoncteur de groupe', 'Automatismes P/f'],
    engineering_rationale_fr: 'D03 évacue la puissance massive produite par D01 (ex. 420 MW Nachtigal) vers les centres de consommation tout en maintenant la stabilité angulaire.',
    engineering_rationale_en: 'D03 evacuates bulk generation from D01 to load centers while guaranteeing dynamic rotor angle stability.',
    link_route: 'hydropower'
  },
  {
    source_module: 'D02',
    source_name_fr: 'Architecture Réseau & Planification N-1',
    source_name_en: 'Grid Architecture & N-1 Contingency Planning',
    data_flowing_in: [
      'Matrice d\'admittance nodale Y_bus',
      'Résultats de Load Flow Newton-Raphson',
      'Critères de contingence N-1 (perte de ligne)',
      'Marges de stabilité de tension Q-V'
    ],
    data_flowing_out: [
      'Paramètres R1, X1, B1 réels des lignes 225 kV',
      'Ampacité dynamique DLR en temps réel',
      'État disjoncteurs et signalisation topologique'
    ],
    shared_interfaces: ['Nœuds de calcul 225/90 kV', 'Lignes de transit inter-régionales', 'Critère N-1'],
    engineering_rationale_fr: 'D02 dimensionne et planifie les corridors de transport exploités en D03, vérifiant qu\'aucune ligne ne dépasse sa limite thermique en cas de déclenchement d\'une autre.',
    engineering_rationale_en: 'D02 calculates power flow and designs N-1 criteria for the physical transmission assets operated in D03.',
    link_route: 'cameroon-grid'
  },
  {
    source_module: 'D04',
    source_name_fr: 'Postes Électriques & Appareillage HTB',
    source_name_en: 'Substations & High-Voltage Switchgear',
    data_flowing_in: [
      'État des disjoncteurs et sectionneurs de travée',
      'Mesures analogiques TC/TT (courants, tensions)',
      'Pressions de gaz SF6 des pôles de disjoncteurs',
      'Enclenchement des réactances shunt et régleurs OLTC'
    ],
    data_flowing_out: [
      'Ordres d\'ouverture / fermeture triphasée et unipolaire',
      'Points d\'ancrage mécaniques sur portique',
      'Raccordements aéro-souterrains aux têtes de câbles'
    ],
    shared_interfaces: ['Travée départ ligne 225 kV', 'Jeux de barres double', 'Parafoudres station'],
    engineering_rationale_fr: 'D04 abrite les nœuds de commutation qui ouvrent, ferment et protègent les liaisons de transport D03.',
    engineering_rationale_en: 'D04 switchyards provide the physical nodes that switch, isolate and protect D03 transmission corridors.',
    link_route: 'diagrams'
  },
  {
    source_module: 'D11',
    source_name_fr: 'Systèmes de Protection & Fonctions ANSI',
    source_name_en: 'Protection Relays & ANSI Protection Coordination',
    data_flowing_in: [
      'Plans de réglage ANSI 21 (zones R-X en ohms primaires)',
      'Pente de la caractéristique différentielle 87L',
      'Temporisations sélectives t1, t2, t3',
      'Seuils de réenclenchement 79 et contrôle de synchro 25'
    ],
    data_flowing_out: [
      'Courants de défaut Icc calculés selon CEI 60909',
      'Rapports de transformation TC/TT réels (ex. 1200/1 A)',
      'Signaux d\'émission téléprotection via OPGW'
    ],
    shared_interfaces: ['Relais de protection numérique', 'Voies de communication C37.94', 'Bobines de déclenchement'],
    engineering_rationale_fr: 'D11 fournit l\'intelligence protectrice (relais de distance et différentiels) qui surveille en continu les lignes D03.',
    engineering_rationale_en: 'D11 supplies the digital relay algorithms (ANSI 21/87L) continuously protecting D03 transmission links.',
    link_route: 'simulation'
  },
  {
    source_module: 'D14',
    source_name_fr: 'Génie Civil, Pylônes & Structures',
    source_name_en: 'Civil Engineering, Towers & Foundations',
    data_flowing_in: [
      'Capacité portante du sol et essais au pénétromètre',
      'Cartes de vitesse de vent extrême (pression dynamique)',
      'Profil topographique LIDAR du tracé de ligne'
    ],
    data_flowing_out: [
      'Efforts mécaniques à la tête de pylône (traction, vent, poids)',
      'Dimensions géométriques de la silhouette du support',
      'Calculs de flèche et tension aux températures extrêmes'
    ],
    shared_interfaces: ['Massifs de fondation', 'Cornières treillis acier', 'Pinces de suspension'],
    engineering_rationale_fr: 'D14 calcule la résistance mécanique des pylônes et fondations soutenant les conducteurs électriques D03.',
    engineering_rationale_en: 'D14 verifies structural stability of lattice steel towers and foundations carrying D03 conductors.',
    link_route: 'calculators'
  },
  {
    source_module: 'D15',
    source_name_fr: 'Mise à la Terre & Protection Foudre',
    source_name_en: 'Earthing Systems & Lightning Protection',
    data_flowing_in: [
      'Densité de foudroiement kéraunique Ng (impacts/km²/an)',
      'Résistivité apparente du sol en couches ρ (Ω·m)',
      'Tension de pas et de toucher admissibles (CEI 61936)'
    ],
    data_flowing_out: [
      'Résistance de pied de pylône Rt cible (< 10 Ω)',
      'Taux d\'amorçage en retour (Back-flashover rate BFR)',
      'Schémas de mise à la terre des écrans de câbles Cross-bonding'
    ],
    shared_interfaces: ['Câble de garde OPGW', 'Patte d\'oie de mise à la terre', 'Parafoudres ZnO'],
    engineering_rationale_fr: 'D15 protège la ligne D03 contre les coups de foudre et garantit la sécurité humaine au pied des pylônes.',
    engineering_rationale_en: 'D15 optimizes tower footing impedance to minimize lightning trip-outs and ensure touch voltage safety.',
    link_route: 'standards'
  },
  {
    source_module: 'Calculateurs EPEDE',
    source_name_fr: 'Moteurs de Calcul Analytique (Joule, Chute de Tension, Ferranti)',
    source_name_en: 'EPEDE Analytical Solvers (Joule Losses, Voltage Drop, Ferranti)',
    data_flowing_in: [
      'Résultats de calcul de pertes P = 3·R·I²',
      'Calcul de chute de tension ΔU = (R·P + X·Q) / U',
      'Calcul de puissance naturelle P_SIL = V² / Zc'
    ],
    data_flowing_out: [
      'Données de ligne réelles pour étalonnage des algorithmes',
      'Paramètres constructeurs Aster 570 et Câbles 225 kV'
    ],
    shared_interfaces: ['Formules normalisées CEI', 'Matrices de calcul', 'Rapports PDF'],
    engineering_rationale_fr: 'Les calculateurs EPEDE fournissent les outils de dimensionnement rapide utilisés par les ingénieurs de transport.',
    engineering_rationale_en: 'EPEDE calculators provide rapid sizing and verification engines for transmission engineers.',
    link_route: 'calculators'
  }
];

// ============================================================================
// 8. TOPOLOGICAL CORRIDOR NETWORK NODES
// ============================================================================
export const TOPOLOGICAL_CORRIDOR_NODES: TopologicalNode[] = [
  {
    id: 'node-gsu-nachtigal',
    name: 'Poste Usine Nachtigal (11/225 kV)',
    type: 'SUBSTATION_BAY',
    voltage_kv: 225,
    connected_to: ['node-ohl-nac-nom-sec1'],
    scada_status: 'CLOSED'
  },
  {
    id: 'node-ohl-nac-nom-sec1',
    name: 'Tronçon Aérien Nachtigal - Obala (55 km)',
    type: 'OVERHEAD_SECTION',
    voltage_kv: 225,
    connected_to: ['node-gsu-nachtigal', 'node-ohl-nac-nom-sec2'],
    scada_status: 'CLOSED'
  },
  {
    id: 'node-ohl-nac-nom-sec2',
    name: 'Tronçon Aérien Obala - Nomayos (50 km)',
    type: 'OVERHEAD_SECTION',
    voltage_kv: 225,
    connected_to: ['node-ohl-nac-nom-sec1', 'node-sub-nomayos'],
    scada_status: 'CLOSED'
  },
  {
    id: 'node-sub-nomayos',
    name: 'Poste d\'Interconnexion Nomayos 225/90 kV',
    type: 'INTERTIE_BUS',
    voltage_kv: 225,
    connected_to: ['node-ohl-nac-nom-sec2', 'node-ohl-nom-oya'],
    scada_status: 'CLOSED'
  },
  {
    id: 'node-ohl-nom-oya',
    name: 'Boucle 225 kV Nomayos - Oyomabang (22 km)',
    type: 'OVERHEAD_SECTION',
    voltage_kv: 225,
    connected_to: ['node-sub-nomayos', 'node-sub-oyomabang'],
    scada_status: 'CLOSED'
  },
  {
    id: 'node-sub-oyomabang',
    name: 'Poste Source Oyomabang (Yaoundé)',
    type: 'SUBSTATION_BAY',
    voltage_kv: 90,
    connected_to: ['node-ohl-nom-oya'],
    scada_status: 'CLOSED'
  },
  {
    id: 'node-trans-bassa',
    name: 'Poste Transition Aéro-Souterrain Bassa (Douala)',
    type: 'TRANSITION_YARD',
    voltage_kv: 90,
    connected_to: ['node-ugc-bassa-deido'],
    scada_status: 'CLOSED'
  },
  {
    id: 'node-ugc-bassa-deido',
    name: 'Liaison Câble Souterrain XLPE Bassa - Deïdo (6.8 km)',
    type: 'CABLE_SECTION',
    voltage_kv: 90,
    connected_to: ['node-trans-bassa', 'node-sub-deido'],
    scada_status: 'CLOSED'
  },
  {
    id: 'node-sub-deido',
    name: 'Poste Urbain Deïdo 90/15 kV',
    type: 'SUBSTATION_BAY',
    voltage_kv: 90,
    connected_to: ['node-ugc-bassa-deido'],
    scada_status: 'CLOSED'
  }
];
