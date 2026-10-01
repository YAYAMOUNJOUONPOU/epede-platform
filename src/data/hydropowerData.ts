/**
 * EPEDE GENERATION DOMAIN — HYDROPOWER SPECIFICATION
 * Authoritative Master Data & Subsystems Registry (H01 - H31)
 * Domain: D01 — Generation | Technology: Hydropower
 */

import type {
  HydroPlantClassification,
  PlantClassificationMeta,
  HydroSubsystemId,
  HydroSubsystemMeta,
  HydraulicTurbineType,
  TurbineTechnicalData,
  StartupSequenceStep,
  HydroFailureScenario,
  HydroEquipmentItem,
} from '../types/hydropower';

// ============================================================================
// 1. PLANT ARCHITECTURAL CLASSIFICATIONS (SECTION 3)
// ============================================================================

export const HYDRO_PLANT_CLASSIFICATIONS: PlantClassificationMeta[] = [
  {
    id: 'run_of_river',
    name: {
      fr: 'Fil de l\'Eau / Dérivation',
      en: 'Run-of-River / Diversion Hydropower',
    },
    description: {
      fr: 'Exploitation du débit naturel du cours d\'eau sans retenue saisonnière significative. La production suit directement l\'hydrologie fluviale journalière avec dérivation via prise d\'eau, canal de fuite ou conduite forcée courte.',
      en: 'Utilizes natural streamflow with minimal or no impoundment storage. Generation directly follows river hydrology with diversion via intake weir, headrace canal, or short penstock.',
    },
    typicalHeadRangeM: { min: 2, max: 80 },
    typicalCapacityRangeMW: { min: 0.5, max: 250 },
    keyAdvantages: {
      fr: [
        'Impact environnemental et submersion de terres minimaux',
        'Investissement de génie civil de barrage restreint',
        'Temps de retour sur investissement plus rapide',
      ],
      en: [
        'Minimal land inundation and environmental footprint',
        'Lower civil dam capital expenditure',
        'Rapid deployment and lower social displacement',
      ],
    },
    keyEngineeringChallenges: {
      fr: [
        'Dépendance totale aux étiages saisonniers sans régulation de pointe',
        'Vulnérabilité aux charriages d\'alluvions et sédiments fins',
        'Nécessité de grilles d\'intake à nettoyage automatique continu',
      ],
      en: [
        'Zero peaking capacity during dry-season low flows',
        'Severe vulnerability to heavy sediment abrasion and floating debris',
        'Requires continuous automatic trash-rack cleaning systems',
      ],
    },
    civilStructures: ['Diversion Weir', 'Forebay Basin', 'Desander / Silt Trap', 'Headrace Canal', 'Spillway'],
    hydraulicConveyance: ['Low-pressure canal', 'Drop shaft', 'Steel penstock manifold', 'Draft tube'],
    operationalCharacteristics: {
      fr: 'Mode régulation de niveau amont (Water Level Control) pour maximiser le turbinage sans déborder.',
      en: 'Upstream water level regulation mode to maximize energy yield without overtopping intake weirs.',
    },
  },
  {
    id: 'reservoir_impoundment',
    name: {
      fr: 'Haute/Moyenne Chute avec Retenue',
      en: 'Reservoir / Impoundment Hydropower',
    },
    description: {
      fr: 'Ouvrage majeur créant un réservoir de régulation pluri-mensuelle ou interannuelle. Permet le stockage d\'énergie stratégique, la modulation de pointe (peaking) et la fourniture de services système indispensables.',
      en: 'Major infrastructure creating seasonal or multi-year storage reservoirs. Enables strategic energy storage, peak load shaving, and essential primary/secondary ancillary grid services.',
    },
    typicalHeadRangeM: { min: 50, max: 1200 },
    typicalCapacityRangeMW: { min: 50, max: 3000 },
    keyAdvantages: {
      fr: [
        'Régulation de pointe et flexibilité dynamique instantanée',
        'Sécurité d\'approvisionnement garantie en saison sèche',
        'Capacité de démarrage autonome (Black-Start) du réseau',
      ],
      en: [
        'Full peaking flexibility and spinning reserve support',
        'Guaranteed firm capacity throughout severe dry seasons',
        'Rapid black-start capability for grid restoration',
      ],
    },
    keyEngineeringChallenges: {
      fr: [
        'Dimensionnement des évacuateurs de crues millénaires (PMF)',
        'Gestion des phénomènes de coup de bélier dans les longues conduites',
        'Surveillance de la stabilité et de l\'auscultation du barrage',
      ],
      en: [
        'Spillway hydraulic sizing for probable maximum flood (PMF)',
        'Severe waterhammer transients in long pressure shafts/penstocks',
        'Extensive dam geotechnical stability and seepage monitoring',
      ],
    },
    civilStructures: ['Concrete Gravity / Arch Dam', 'Deep Water Intake', 'Bottom Outlet', 'Gated Spillway'],
    hydraulicConveyance: ['High-pressure tunnel', 'Surge shaft / Surge tank', 'Steel-lined penstock', 'Tailrace tunnel'],
    operationalCharacteristics: {
      fr: 'Pilotage économique en fonction du coût d\'opportunité de l\'eau stockée et des pics tarifaires.',
      en: 'Economic dispatch based on water value curves, reservoir rule curves, and peak grid demand.',
    },
  },
  {
    id: 'dam_based',
    name: {
      fr: 'Centrale Intégrée au Barrage (Pied de Barrage)',
      en: 'Dam-Toe / Integrated Dam Hydropower',
    },
    description: {
      fr: 'Centrale hydroélectrique où l\'usine est directement incorporée dans ou au pied du corps de digue ou du barrage en béton, avec conduites d\'amenée très courtes traversant le barrage.',
      en: 'Powerhouse structure integrated directly into or abutting the downstream toe of the dam body, with short intake conduits passing through the concrete structure.',
    },
    typicalHeadRangeM: { min: 15, max: 120 },
    typicalCapacityRangeMW: { min: 20, max: 1000 },
    keyAdvantages: {
      fr: [
        'Conduites d\'amenée très courtes réduisant les pertes de charge et surpressions',
        'Génie civil groupé diminuant l\'emprise foncière globale',
        'Cheminée d\'équilibre souvent inutile en raison de la faible inertie hydraulique',
      ],
      en: [
        'Short penstocks minimizing hydraulic friction losses and waterhammer peaks',
        'Concentrated civil works footprint reducing construction footprint',
        'Surge tank frequently omitted due to minimal water column inertia',
      ],
    },
    keyEngineeringChallenges: {
      fr: [
        'Vibrations de l\'usine transmises aux fondations du barrage',
        'Interfaces thermiques et dilatation différentielle béton barrage/usine',
        'Proximité immédiate du déversoir de crue exigeant un guidage hydraulique strict',
      ],
      en: [
        'Hydraulic and machine vibration transmission into dam foundations',
        'Thermal expansion joints between mass dam concrete and powerhouse structure',
        'Close proximity to spillway plunge pool requiring careful dissipation design',
      ],
    },
    civilStructures: ['Mass concrete gravity sections', 'Intake trashracks', 'Spillway chute', 'Stilling basin'],
    hydraulicConveyance: ['Penstocks embedded in concrete', 'Spiral casing', 'Draft tube'],
    operationalCharacteristics: {
      fr: 'Exploitation en base ou semi-base, haut rendement sur large plage de débit.',
      en: 'Base-load and intermediate load cycling with high efficiency across wide discharge windows.',
    },
  },
  {
    id: 'pumped_storage',
    name: {
      fr: 'Station de Transfert d\'Énergie par Pompage (STEP)',
      en: 'Pumped-Storage Hydropower (PSH)',
    },
    description: {
      fr: 'Système bidirectionnel de stockage massif d\'énergie composé d\'un bassin supérieur et d\'un bassin inférieur reliés par des groupes réversibles pompe-turbine / moteur-générateur.',
      en: 'Bidirectional utility-scale energy storage consisting of upper and lower reservoirs connected by reversible pump-turbine and motor-generator sets.',
    },
    typicalHeadRangeM: { min: 100, max: 900 },
    typicalCapacityRangeMW: { min: 100, max: 2000 },
    keyAdvantages: {
      fr: [
        'Stockage d\'énergie électrique à très grande échelle (GWh)',
        'Absorption des excédents renouvelables intermittents (solaire/éolien)',
        'Inversion de cycle pompage/turbinage en quelques minutes pour réguler la fréquence',
      ],
      en: [
        'Massive electrical energy storage capacity measured in GWh',
        'Firming and absorption of intermittent solar PV and wind curtailment',
        'Rapid pumping-to-generating mode transitions for primary frequency containment',
      ],
    },
    keyEngineeringChallenges: {
      fr: [
        'Transitoires hydrauliques complexes lors de l\'inversion de marche',
        'Démarrage des moteurs-générateurs en pompe (SFC / thyristors ou poney motor)',
        'Cavitation sévère en mode pompe nécessitant une forte submersion de l\'usine',
      ],
      en: [
        'Severe hydraulic transients and waterhammer during rapid mode reversals',
        'Heavy motor starting methods in pumping mode (Static Frequency Converter or pony motor)',
        'Stringent net positive suction head (NPSH) requiring deep powerhouse submergence',
      ],
    },
    civilStructures: ['Upper Reservoir Liner', 'Lower Reservoir Impoundment', 'Reversible Intakes'],
    hydraulicConveyance: ['High-pressure bidirectional shaft', 'Underground manifolds', 'Deep draft tube tunnels'],
    operationalCharacteristics: {
      fr: 'Cycle journalier arbitrage tarifaire : pompage en heures creuses, turbinage en heures de pointe.',
      en: 'Daily arbitrage cycles: off-peak grid pumping and on-peak high-value generation dispatch.',
    },
  },
  {
    id: 'underground_cavern',
    name: {
      fr: 'Centrale Souterraine en Caverne',
      en: 'Underground Cavern Powerhouse',
    },
    description: {
      fr: 'Installation où l\'usine, les transformateurs et les vannes de pied sont excavés dans la roche profonde, protégés des intempéries et des instabilités de versant.',
      en: 'Deep rock excavation housing the main powerhouse machine hall, transformer cavern, and high-pressure valve chambers protected from mountainous surface topography.',
    },
    typicalHeadRangeM: { min: 150, max: 1400 },
    typicalCapacityRangeMW: { min: 100, max: 3500 },
    keyAdvantages: {
      fr: [
        'Sécurité géotechnique face aux glissements de terrain et avalanches de surface',
        'Pression hydrostatique absorbée par le massif rocheux encaissant',
        'Impact paysager et environnemental en surface quasi nul',
      ],
      en: [
        'Immunity to surface landslides, avalanches, and extreme weather events',
        'Rock mass containment supporting high internal hydraulic pressures',
        'Preservation of pristine surface mountain ecology and aesthetics',
      ],
    },
    keyEngineeringChallenges: {
      fr: [
        'Ventilation, désenfumage et sécurité incendie en milieu confiné critique',
        'Évacuation de l\'énergie HT via câbles isolés XLPE ou galeries blindées GIL',
        'Drainage continu des infiltrations d\'eau de la masse rocheuse',
      ],
      en: [
        'Complex HVAC ventilation, smoke extraction, and underground egress safety',
        'HV power evacuation through vertical shafts using XLPE cables or SF6 GIL busducts',
        'Massive sump drainage and dewatering against permanent rock fissure seepages',
      ],
    },
    civilStructures: ['Machine Hall Cavern', 'Transformer Gallery', 'Access Tunnels', 'Tailrace Surge Chamber'],
    hydraulicConveyance: ['Vertical pressure shaft', 'Steel-lined distributor', 'Pressurized tailrace tunnel'],
    operationalCharacteristics: {
      fr: 'Télépilotage complet depuis le dispatching national avec redondance des liaisons de sécurité.',
      en: 'Fully automated remote SCADA control with multi-redundant fiber-optic safety channels.',
    },
  },
  {
    id: 'cascade',
    name: {
      fr: 'Aménagement Hydroélectrique en Cascade',
      en: 'River Basin Cascade Scheme',
    },
    description: {
      fr: 'Chaîne d\'usines échelonnées le long d\'un même bassin versant où l\'eau turbinée par la centrale amont alimente immédiatement ou avec retenue intermédiaire la centrale aval.',
      en: 'Sequential series of hydroelectric power plants arranged along the same river basin, where discharge from the upstream facility directly feeds downstream power plants.',
    },
    typicalHeadRangeM: { min: 10, max: 500 },
    typicalCapacityRangeMW: { min: 50, max: 4000 },
    keyAdvantages: {
      fr: [
        'Valorisation maximale de l\'énergie potentielle de tout le cours d\'eau',
        'Lissage des crues et optimisation globale des réserves d\'eau',
        'Effet multiplicateur de chaque mètre cube régulé en amont',
      ],
      en: [
        'Maximum utilization of the entire river basin potential head',
        'Integrated flood attenuation and coordinated regional water release',
        'Every cubic meter stored upstream generates power through multiple downstream plants',
      ],
    },
    keyEngineeringChallenges: {
      fr: [
        'Interdépendance hydraulique stricte : un arrêt amont impacte les débits aval',
        'Temps de propagation de l\'onde hydraulique (onde de translation) entre usines',
        'Coordination temps-réel complexe des débits de consigne et des lâchers',
      ],
      en: [
        'Hydraulic coupling: tripping of upstream plant disrupts downstream inflows',
        'Dynamic translation wave travel times between consecutive facilities',
        'Requires centralized river-basin hydraulic optimization and dispatch',
      ],
    },
    civilStructures: ['Head Storage Dam', 'Run-of-River Weirs', 'Re-regulating Basins'],
    hydraulicConveyance: ['Inter-plant river corridor', 'Side diversion canals', 'Return channels'],
    operationalCharacteristics: {
      fr: 'Régulation coordonnée par automate de bassin pour éviter tout déversement inutile.',
      en: 'Integrated river basin automation coordinating generation to eliminate spillway wastage.',
    },
  },
  {
    id: 'multipurpose',
    name: {
      fr: 'Aménagement Hydraulique à Buts Multiples',
      en: 'Multi-Purpose Hydropower Scheme',
    },
    description: {
      fr: 'Ouvrage conçu pour concilier la production d\'électricité avec l\'irrigation agricole, l\'alimentation en eau potable, la navigation fluviale, le contrôle des crues et le débit réservé écologique.',
      en: 'Complex reservoir development designed to reconcile electrical generation with agricultural irrigation, municipal potable water, navigation, flood protection, and environmental flows.',
    },
    typicalHeadRangeM: { min: 15, max: 250 },
    typicalCapacityRangeMW: { min: 10, max: 1500 },
    keyAdvantages: {
      fr: [
        'Rentabilité socio-économique globale partagée entre plusieurs secteurs',
        'Protection active des populations aval contre les inondations dévastatrices',
        'Sécurisation alimentaire par irrigation pérenne des périmètres agricoles',
      ],
      en: [
        'High multi-sector socio-economic return on public infrastructure capital',
        'Active downstream flood mitigation protecting major populated areas',
        'Regional food and potable water security through guaranteed dry-season delivery',
      ],
    },
    keyEngineeringChallenges: {
      fr: [
        'Conflits d\'arbitrage permanents entre besoins d\'irrigation et turbinage de pointe',
        'Obligation de respecter le débit réservé même en cas de pénurie hydrologique',
        'Organes de vidange de fond et prises d\'eau étagées pour respecter la température de l\'eau',
      ],
      en: [
        'Operational trade-offs between agricultural water demands and peak power dispatch',
        'Strict statutory environmental flow obligations taking priority over power revenues',
        'Multi-level selective intakes to regulate downstream water temperature and oxygen',
      ],
    },
    civilStructures: ['Multi-Purpose Dam', 'Irrigation Outlets', 'Bottom Sluiceways', 'Fish Passage Systems'],
    hydraulicConveyance: ['Power penstocks', 'Irrigation canals', 'Environmental bypass conduits'],
    operationalCharacteristics: {
      fr: 'Courbes de gestion de retenue (Rule Curves) multicritères supervisées par un comité de bassin.',
      en: 'Multi-objective seasonal rule curves governed by statutory river-basin authorities.',
    },
  },
];

// ============================================================================
// 2. MASTER SUBSYSTEM REGISTRY (H01 - H31) (SECTION 4)
// ============================================================================

export const HYDRO_SUBSYSTEMS_REGISTRY: HydroSubsystemMeta[] = [
  {
    id: 'H01',
    cluster: 'civil_hydraulic',
    name: { fr: 'Ressource en Eau & Hydrologie', en: 'Water Resource & Hydrology' },
    shortSummary: {
      fr: 'Bassin versant, apports pluviométriques, débits fluviaux saisonniers et contraintes de débit écologique.',
      en: 'Catchment hydrology, seasonal rainfall inflows, river flow curves, and environmental flow constraints.',
    },
    primaryFunction: {
      fr: 'Fournir l\'énergie hydraulique brute sous forme de débit volumique et de hauteur géodésique.',
      en: 'Provide raw hydraulic potential energy via volumetric discharge and geodetic head.',
    },
    primaryInterfaces: {
      upstream: 'Hydrological Basin / Precipitation',
      downstream: 'H02 Reservoir & Water Storage',
      control: 'Hydro-meteorological gauging stations',
      protection: 'Flood forecasting & alert telemetry',
    },
    keyEquipmentCount: 6,
    applicableStandards: ['ISO 772', 'WMO-No. 168', 'IEC 60041'],
    physicalLocation: 'Catchment Area & River Basin',
    failureRiskLevel: 'high',
  },
  {
    id: 'H02',
    cluster: 'civil_hydraulic',
    name: { fr: 'Retenue & Stockage d\'Eau', en: 'Reservoir & Water Storage' },
    shortSummary: {
      fr: 'Bassin de retenue, volume utile, tranche morte, franc-bord et bathymétrie d\'envasement.',
      en: 'Impounded water body, active live storage, dead storage, flood buffer, and sediment profiling.',
    },
    primaryFunction: {
      fr: 'Réguler temporellement les apports hydrauliques et maintenir le niveau piézométrique amont.',
      en: 'Buffer hydraulic inflows over time and sustain upstream piezometric operating head.',
    },
    primaryInterfaces: {
      upstream: 'H01 Water Resource & Hydrology',
      downstream: 'H03 Dam Infrastructure & H04 Intake',
      control: 'Reservoir level radar sensors',
      protection: 'High/low water level trip interlocks',
    },
    keyEquipmentCount: 7,
    applicableStandards: ['ICOLD Bulletin 154', 'IEC 60041', 'USBR Design of Small Dams'],
    physicalLocation: 'Reservoir Basin & Banks',
    failureRiskLevel: 'medium',
  },
  {
    id: 'H03',
    cluster: 'civil_hydraulic',
    name: { fr: 'Barrage & Ouvrages de Génie Civil', en: 'Dam & Civil Infrastructure' },
    shortSummary: {
      fr: 'Corps de digue, fondations, évacuateur de crues, pertuis de fond, galeries d\'auscultation et piézomètres.',
      en: 'Dam structure, foundation rock, spillway gates, bottom outlets, inspection galleries, and piezometers.',
    },
    primaryFunction: {
      fr: 'Retenir en toute sécurité la poussée hydrostatique et évacuer les crues majeures.',
      en: 'Safely withstand hydrostatic thrust, seismic loads, and evacuate design flood discharges.',
    },
    primaryInterfaces: {
      upstream: 'H02 Reservoir & Water Storage',
      downstream: 'River Bed / Stilling Basin & H04 Intake',
      control: 'Spillway gate position actuators',
      protection: 'Dam structural integrity monitoring (pendulums, piezometers)',
    },
    keyEquipmentCount: 12,
    applicableStandards: ['ICOLD Guidelines', 'Eurocode 7', 'USACE EM 1110-2-2200'],
    physicalLocation: 'Dam Body, Spillway & Abutments',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H04',
    cluster: 'civil_hydraulic',
    name: { fr: 'Prise d\'Eau Hydraulique', en: 'Hydraulic Intake' },
    shortSummary: {
      fr: 'Entrée d\'eau profilée, grilles anti-débris, dégrilleur oléohydraulique, vanne de tête et batardeaux.',
      en: 'Bellmouth intake, coarse/fine trash racks, automatic trash rake, head gate, and maintenance stoplogs.',
    },
    primaryFunction: {
      fr: 'Canaliser l\'eau dans la conduite en éliminant les corps flottants et assurer l\'isolement hydraulique d\'urgence.',
      en: 'Convey water into headworks, screen debris, and execute quick emergency gravity closure.',
    },
    primaryInterfaces: {
      upstream: 'H02 Reservoir & Water Storage',
      downstream: 'H05 Hydraulic Conveyance',
      control: 'Hydraulic cylinder intake gate hoist',
      protection: 'Quick drop emergency trip & differential level alarms',
    },
    keyEquipmentCount: 8,
    applicableStandards: ['DIN 19704', 'ASME PTC 18', 'IEC 60041'],
    physicalLocation: 'Dam Upstream Face or Intake Tower',
    failureRiskLevel: 'high',
  },
  {
    id: 'H05',
    cluster: 'civil_hydraulic',
    name: { fr: 'Système d\'Adduction & Conduite Forcée', en: 'Hydraulic Conveyance System' },
    shortSummary: {
      fr: 'Galerie d\'amenée en charge, puits blindé, conduite forcée en acier, massifs d\'ancrage et collecteur.',
      en: 'Pressure tunnel, inclined pressure shaft, surface steel penstock, anchor blocks, and distributor manifold.',
    },
    primaryFunction: {
      fr: 'Transporter le débit nominal sous haute pression hydrostatique avec le minimum de pertes de charge.',
      en: 'Transport design discharge under high hydrostatic pressure with minimized friction losses.',
    },
    primaryInterfaces: {
      upstream: 'H04 Hydraulic Intake',
      downstream: 'H06 Surge Control & H07 Turbine System',
      control: 'Penstock protection butterfly/spherical valve',
      protection: 'Overvelocity pipe rupture trip (ANSI 98) & pressure transmitters',
    },
    keyEquipmentCount: 9,
    applicableStandards: ['ASCE Manual 79', 'EN 13445', 'IEC 60041'],
    physicalLocation: 'Mountain Slope, Tunnel & Powerhouse Forebay',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H06',
    cluster: 'civil_hydraulic',
    name: { fr: 'Cheminée d\'Équilibre & Transitoires Hydrauliques', en: 'Surge & Hydraulic Transients' },
    shortSummary: {
      fr: 'Cheminée d\'équilibre à étranglement, réservoirs d\'air sous pression, soupapes de décharge et calcul de coup de bélier.',
      en: 'Restricted-orifice surge tank, air vessels, pressure relief valves, and waterhammer attenuation.',
    },
    primaryFunction: {
      fr: 'Amortir les ondes de surpression et dépressions lors des manœuvres rapides de vannage turbine.',
      en: 'Attenuate mass waterhammer pressure surges during fast turbine guide-vane closing and opening.',
    },
    primaryInterfaces: {
      upstream: 'H05 Hydraulic Conveyance (Headrace)',
      downstream: 'H05 Penstock & H07 Turbine',
      control: 'Water level differential pressure transmitters',
      protection: 'High surge level overflow prevention',
    },
    keyEquipmentCount: 5,
    applicableStandards: ['IEC 60041', 'IEC 60193', 'CIGRE WG A2.33'],
    physicalLocation: 'Junction of Headrace Tunnel and Penstock',
    failureRiskLevel: 'high',
  },
  {
    id: 'H07',
    cluster: 'electromechanical',
    name: { fr: 'Système de Turbine Hydraulique', en: 'Hydraulic Turbine System' },
    shortSummary: {
      fr: 'Bâche spirale, distributeur à directrices mobiles, roue Francis/Pelton/Kaplan, aspirateur et diffuseur.',
      en: 'Spiral casing, wicket-gate distributor, Francis/Pelton/Kaplan runner, draft tube, and aeration valve.',
    },
    primaryFunction: {
      fr: 'Convertir l\'énergie potentielle et cinétique de l\'eau en couple mécanique de rotation sur l\'arbre.',
      en: 'Convert fluid potential and kinetic energy into mechanical shaft rotation torque.',
    },
    primaryInterfaces: {
      upstream: 'H05 Hydraulic Conveyance (Main Inlet Valve)',
      downstream: 'H08 Mechanical Power Train & Tailrace',
      control: 'H11 Speed Governor (wicket gate servomotors)',
      protection: 'Overspeed trip (ANSI 12), vibration sensors, shear pin break detector',
    },
    keyEquipmentCount: 14,
    applicableStandards: ['IEC 60041', 'IEC 60193', 'IEC 60545', 'IEEE 1147'],
    physicalLocation: 'Powerhouse Machine Hall Pit (Level -1)',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H08',
    cluster: 'electromechanical',
    name: { fr: 'Ligne d\'Arbre & Mécanique de Puissance', en: 'Mechanical Power Train' },
    shortSummary: {
      fr: 'Arbre forgé turbine-générateur, manchon d\'accouplement, palier de butée, paliers guides et vérins de freinage.',
      en: 'Forged shaft line, rigid flanged coupling, thrust bearing assembly, guide bearings, and mechanical brake jacks.',
    },
    primaryFunction: {
      fr: 'Transmettre le couple à 100% au rotor du générateur et reprendre la charge hydraulique axiale.',
      en: 'Transmit 100% of rotational torque to the rotor and support total axial hydraulic and deadweight loads.',
    },
    primaryInterfaces: {
      upstream: 'H07 Hydraulic Turbine System',
      downstream: 'H09 Hydro Generator',
      control: 'Mechanical brake pneumatic control valve',
      protection: 'Thrust bearing high temperature (ANSI 38) & shaft runout proximity probes',
    },
    keyEquipmentCount: 8,
    applicableStandards: ['ISO 10816-5', 'ISO 7919-5', 'IEEE 1010'],
    physicalLocation: 'Turbine Pit & Generator Lower Bracket',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H09',
    cluster: 'electromechanical',
    name: { fr: 'Générateur Hydroélectrique', en: 'Hydro Generator' },
    shortSummary: {
      fr: 'Stator à tôles feuilletées, bobinage Roebel, rotor à pôles saillants, isolation classe F et bagues collectrices.',
      en: 'Laminated stator core, Roebel transposed bars, salient-pole rotor, Class F insulation, and sliprings.',
    },
    primaryFunction: {
      fr: 'Convertir la puissance mécanique de l\'arbre en énergie électrique triphasée 50 Hz sous haute tension.',
      en: 'Convert mechanical shaft power into three-phase 50 Hz medium-voltage electrical power.',
    },
    primaryInterfaces: {
      upstream: 'H08 Mechanical Power Train & H10 Excitation',
      downstream: 'H14 Generator Transformer & H17 Protection',
      control: 'H10 Excitation System (AVR) & H18 Automation',
      protection: 'Generator differential (87G), stator ground fault (64S), thermal (49)',
    },
    keyEquipmentCount: 16,
    applicableStandards: ['IEC 60034-1', 'IEEE C50.12', 'IEC 60034-14'],
    physicalLocation: 'Powerhouse Main Generator Bay',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H10',
    cluster: 'electromechanical',
    name: { fr: 'Système d\'Excitation & Régulation de Tension', en: 'Excitation System & AVR' },
    shortSummary: {
      fr: 'Transformateur d\'excitation, ponts redresseurs à thyristors, régulateur automatique de tension (AVR), disjoncteur de champ.',
      en: 'Excitation transformer, static thyristor bridge, digital AVR, field breaker, and discharge resistor.',
    },
    primaryFunction: {
      fr: 'Fournir le courant continu d\'aimantation au rotor pour réguler la tension statorique et la puissance réactive.',
      en: 'Supply regulated DC field current to rotor poles to control terminal voltage and reactive power.',
    },
    primaryInterfaces: {
      upstream: 'Generator Terminal Voltage & Auxiliary AC',
      downstream: 'H09 Generator Rotor Field Windings',
      control: 'AVR / PSS (Power System Stabilizer)',
      protection: 'Loss of field (ANSI 40), overexcitation (24), field ground fault (64R)',
    },
    keyEquipmentCount: 9,
    applicableStandards: ['IEEE 421.1', 'IEEE 421.2', 'IEC 60034-16'],
    physicalLocation: 'Excitation Cubicle Room adjacent to Generator',
    failureRiskLevel: 'high',
  },
  {
    id: 'H11',
    cluster: 'electromechanical',
    name: { fr: 'Régulateur de Vitesse & Vannage', en: 'Speed Governor & Gate Control' },
    shortSummary: {
      fr: 'Centrale oléohydraulique haute pression, régulateur numérique PID, servomoteurs de directrices et boucle de retour.',
      en: 'High-pressure oil accumulator, digital PID governor, wicket-gate hydraulic servos, and feedback LVDTs.',
    },
    primaryFunction: {
      fr: 'Réguler la vitesse de rotation, la fréquence du réseau et la puissance active en modulant le débit.',
      en: 'Regulate rotational speed, grid frequency response, and active power by modulating turbine water flow.',
    },
    primaryInterfaces: {
      upstream: 'H07 Turbine Guide Vanes',
      downstream: 'H18 Plant Automation & Grid Frequency',
      control: 'Digital Governor Controller (IEC 61131)',
      protection: 'Governor trip, oil low pressure trip, overspeed backup mechanical governor',
    },
    keyEquipmentCount: 8,
    applicableStandards: ['IEC 60308', 'IEEE 125', 'IEC 61362'],
    physicalLocation: 'Governor Gallery / Machine Hall Floor',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H12',
    cluster: 'electromechanical',
    name: { fr: 'Système de Refroidissement du Groupe', en: 'Generator Cooling System' },
    shortSummary: {
      fr: 'Aéro-réfrigérants eau/air fermés, pompes de circulation d\'eau brute, filtres autonettoyants et débitmètres.',
      en: 'Air-to-water heat exchangers, raw water circulation pumps, automatic duplex filters, and flow meters.',
    },
    primaryFunction: {
      fr: 'Évacuer les pertes thermiques joule et fer du stator, du rotor et des paliers sous les seuils admissibles.',
      en: 'Dissipate stator/rotor thermal Joule and iron core losses to keep winding temperature below insulation limits.',
    },
    primaryInterfaces: {
      upstream: 'H09 Hydro Generator & Tailrace Water',
      downstream: 'Discharge Canal',
      control: 'Cooling water pump automatic staging PLC',
      protection: 'Flow loss alarm, high temperature trip (ANSI 49)',
    },
    keyEquipmentCount: 7,
    applicableStandards: ['IEC 60034-6', 'IEEE 1010'],
    physicalLocation: 'Generator Enclosure & Raw Water Pumproom',
    failureRiskLevel: 'high',
  },
  {
    id: 'H13',
    cluster: 'electromechanical',
    name: { fr: 'Système de Lubrification des Paliers', en: 'Bearing Lubrication System' },
    shortSummary: {
      fr: 'Bacs d\'huile de butée et de guide, pompes de sustentation hydrostatique haute pression, réfrigérants et centrifugeuse.',
      en: 'Thrust and guide bearing oil sumps, high-pressure jacking oil pumps, oil coolers, and purifier unit.',
    },
    primaryFunction: {
      fr: 'Maintenir un film d\'huile continu sous les patins pour empêcher tout contact métal-métal à toutes vitesses.',
      en: 'Maintain continuous hydrodynamic/hydrostatic oil film between bearing pads and shaft runner collar.',
    },
    primaryInterfaces: {
      upstream: 'H08 Mechanical Power Train Bearings',
      downstream: 'Oil Recovery Sump',
      control: 'High-pressure jacking pump interlock on start/stop',
      protection: 'Low oil level, high oil temperature, low oil pressure trip',
    },
    keyEquipmentCount: 7,
    applicableStandards: ['ISO 4406', 'IEEE 1010', 'DIN 51524'],
    physicalLocation: 'Turbine Pit & Bearing Oil Sump Chambers',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H14',
    cluster: 'electrical_power',
    name: { fr: 'Transformateur Élévateur Principal (GSU)', en: 'Generator Step-Up Transformer (GSU)' },
    shortSummary: {
      fr: 'Transformateur de puissance à huile minérale, traversées HT/BT, régleur en charge, relais Buchholz et aéroréfrigérants ONAF.',
      en: 'Oil-immersed power transformer, HV/LV bushings, on-load tap changer (OLTC), Buchholz relay, and ONAF cooling.',
    },
    primaryFunction: {
      fr: 'Élever la tension générée (ex: 11-15 kV) à la tension de transport réseau (ex: 90-225 kV).',
      en: 'Step up generated medium voltage (e.g. 11-15 kV) to transmission network voltage (e.g. 90-225 kV).',
    },
    primaryInterfaces: {
      upstream: 'H09 Hydro Generator via IPB (Isolated Phase Bus)',
      downstream: 'H15 Generating Switchyard',
      control: 'Automatic voltage regulator OLTC control',
      protection: 'Transformer differential (ANSI 87T), Buchholz (63), overpressure, oil temp (49T)',
    },
    keyEquipmentCount: 11,
    applicableStandards: ['IEC 60076-1', 'IEEE C57.12.00', 'NF C 52-100'],
    physicalLocation: 'Outdoor Transformer Platform / Cavern Gallery',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H15',
    cluster: 'electrical_power',
    name: { fr: 'Poste d\'Évacuation de la Centrale', en: 'Generating Switchyard' },
    shortSummary: {
      fr: 'Jeu de barres HT, disjoncteurs SF6 ou sous enveloppe métallique GIS, sectionneurs, TC/TT et parafoudres.',
      en: 'HV busbars, SF6 live-tank breakers or GIS metal-clad bays, disconnectors, CT/VTs, and zinc-oxide surge arresters.',
    },
    primaryFunction: {
      fr: 'Aiguiller, sectionner et protéger l\'énergie produite vers les départs lignes de transport.',
      en: 'Switch, route, isolate, and protect generated power flow into high-voltage transmission lines.',
    },
    primaryInterfaces: {
      upstream: 'H14 GSU Transformer',
      downstream: 'H31 Grid Interface',
      control: 'Substation bay controllers (BCU) IEC 61850',
      protection: 'Busbar differential (ANSI 87B), breaker failure (50BF), distance (21)',
    },
    keyEquipmentCount: 15,
    applicableStandards: ['IEC 62271-100', 'IEC 62271-203', 'IEEE C37.100'],
    physicalLocation: 'Outdoor High-Voltage Switchyard or Indoor GIS Hall',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H16',
    cluster: 'electrical_power',
    name: { fr: 'Services Auxiliaires de Centrale (AC/DC)', en: 'Station Auxiliary Systems (AC/DC)' },
    shortSummary: {
      fr: 'Tableaux 400V secourus, groupe électrogène diesel d\'urgence, bancs de batteries 110V/48V CC, onduleurs UPS.',
      en: 'Essential 400V AC switchboards, black-start diesel generator, dual 110V/48V DC battery banks, and static UPS.',
    },
    primaryFunction: {
      fr: 'Fournir l\'alimentation électrique garantie à tous les moteurs, pompes, automates et protections.',
      en: 'Deliver uninterrupted AC and DC control power to all critical plant pumps, valves, PLCs, and trip circuits.',
    },
    primaryInterfaces: {
      upstream: 'Station Service Transformer / Diesel Generator',
      downstream: 'All Plant Auxiliary Consumers & IEDs',
      control: 'Automatic Transfer Switch (ATS) PLC',
      protection: 'DC earth fault detection (ANSI 64D), undervoltage (27)',
    },
    keyEquipmentCount: 10,
    applicableStandards: ['IEEE 308', 'IEC 60364', 'IEEE 946'],
    physicalLocation: 'Auxiliary Electrical Rooms',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H17',
    cluster: 'automation_defense',
    name: { fr: 'Système de Protection Électrique & Mécanique', en: 'Protection System' },
    shortSummary: {
      fr: 'Relais numériques multifonctions (87G, 87T, 40, 64S, 32R), matrices de déclenchement et relais de réarmement 86.',
      en: 'Numerical multifunction relays (87G, 87T, 40, 64S, 32R), trip matrices, and lockout relays (86).',
    },
    primaryFunction: {
      fr: 'Détecter instantanément les anomalies électriques ou mécaniques et commander l\'isolement sélectif.',
      en: 'Detect electrical faults and catastrophic mechanical conditions, isolating the unit within milliseconds.',
    },
    primaryInterfaces: {
      upstream: 'Current & Voltage Transformers, RTDs, Proximity Probes',
      downstream: 'GCB, HV Breaker, Field Breaker, Turbine Shutoff',
      control: 'Hardwired trip coils & IEC 61850-8-1 GOOSE',
      protection: 'Self-monitoring watchdog, dual redundant channels (A/B)',
    },
    keyEquipmentCount: 12,
    applicableStandards: ['IEEE C37.102', 'IEC 60255-1', 'IEEE C37.91'],
    physicalLocation: 'Central Relay & Protection Panels Room',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H18',
    cluster: 'automation_defense',
    name: { fr: 'Contrôle-Commande & Automatisme (SCADA/DCS)', en: 'Control & Automation' },
    shortSummary: {
      fr: 'Automates programmables industriels (API/DCS), synchroniseur automatique, pupitres IHM et séquences marche/arrêt.',
      en: 'Dual-redundant unit controllers (PLC/DCS), automatic synchrocheck (ANSI 25), local HMI, and master sequences.',
    },
    primaryFunction: {
      fr: 'Piloter les séquences de démarrage, couplage, réglage de charge et arrêt normal du groupe.',
      en: 'Execute unit startup sequences, auto-synchronization, load scheduling, and safe controlled stops.',
    },
    primaryInterfaces: {
      upstream: 'Sensors, Actuators, Governors, AVRs',
      downstream: 'Plant SCADA & National Load Dispatch Center',
      control: 'Master Unit Controller running IEC 61131-3 logic',
      protection: 'Safety interlock permissives matrix',
    },
    keyEquipmentCount: 11,
    applicableStandards: ['IEC 62270', 'IEEE 1010', 'IEC 61850'],
    physicalLocation: 'Central Control Room & Local Control Cubicles',
    failureRiskLevel: 'high',
  },
  {
    id: 'H19',
    cluster: 'automation_defense',
    name: { fr: 'Instrumentation & Mesures Physiques', en: 'Instrumentation & Measurements' },
    shortSummary: {
      fr: 'Capteurs de pression piézorésistifs, sondes de température PT100, débitmètres ultrasoniques et accéléromètres.',
      en: 'Piezoresistive pressure transmitters, PT100 duplex RTDs, ultrasonic transit-time flowmeters, and accelerometers.',
    },
    primaryFunction: {
      fr: 'Convertir les grandeurs physiques réelles en signaux analogiques ou numériques étalonnés.',
      en: 'Transduce physical parameters into calibrated industrial electrical signals for control and safety systems.',
    },
    primaryInterfaces: {
      upstream: 'Hydraulic, Mechanical, Thermal Phenomena',
      downstream: 'H18 Control & H17 Protection',
      control: 'HART / 4-20 mA / Modbus transmitters',
      protection: 'Out-of-range sensor fail alarms',
    },
    keyEquipmentCount: 18,
    applicableStandards: ['IEC 60041', 'ISA-5.1', 'ISO 21782'],
    physicalLocation: 'Distributed across all Machines and Waterways',
    failureRiskLevel: 'medium',
  },
  {
    id: 'H20',
    cluster: 'automation_defense',
    name: { fr: 'Système de Télécommunication & Réseaux', en: 'Communication Systems' },
    shortSummary: {
      fr: 'Réseau Ethernet industriel en anneau optique redondant (HSR/PRP), serveurs NTP/PTP et passerelles SCADA téléconduite.',
      en: 'Industrial optical ring LAN (HSR/PRP), IEEE 1588 PTP master clock, and IEC 60870-5-104 dispatch gateways.',
    },
    primaryFunction: {
      fr: 'Assurer le transport sécurisé et horodaté des données de contrôle, télémesures et ordres de téléconduite.',
      en: 'Ensure cyber-secure, microsecond-timestamped transport of telemetry, GOOSE trips, and dispatch commands.',
    },
    primaryInterfaces: {
      upstream: 'Plant Bay Controllers & IEDs',
      downstream: 'National Dispatching Center (NLDC) & Offsite Operators',
      control: 'Network Management System (NMS)',
      protection: 'Cybersecurity firewalls IEC 62443',
    },
    keyEquipmentCount: 8,
    applicableStandards: ['IEC 61850-90-4', 'IEC 60870-5-104', 'IEC 62443'],
    physicalLocation: 'Telecom & Server Cubicles Room',
    failureRiskLevel: 'medium',
  },
  {
    id: 'H21',
    cluster: 'electrical_power',
    name: { fr: 'Mise à la Terre & Protection Foudre', en: 'Earthing & Lightning Protection' },
    shortSummary: {
      fr: 'Ceinture générale de terre en cuivre, point neutre générateur, paratonnerres à tige, câbles de garde et éclateurs.',
      en: 'Meshed copper plant ground grid, generator neutral grounding cubicle, Franklin air terminals, and earth leads.',
    },
    primaryFunction: {
      fr: 'Écouler les courants de court-circuit et coups de foudre à la terre en maintenant les tensions de pas et de toucher sûres.',
      en: 'Safely dissipate fault currents and lightning surges while keeping step and touch voltages within safe limits.',
    },
    primaryInterfaces: {
      upstream: 'All Metallic Structures, Tanks, Windings & Switchyard',
      downstream: 'Earth Mass (Soil / Rock Mass)',
      control: 'Continuous earth resistance monitoring',
      protection: 'Surge arresters (ANSI 81S)',
    },
    keyEquipmentCount: 6,
    applicableStandards: ['IEEE 80', 'IEEE 142', 'IEC 62305'],
    physicalLocation: 'Foundations, Powerhouse Slab, Switchyard Mat',
    failureRiskLevel: 'high',
  },
  {
    id: 'H22',
    cluster: 'balance_of_plant',
    name: { fr: 'Protection Incendie & Sécurité des Personnes', en: 'Fire & Safety Systems' },
    shortSummary: {
      fr: 'Système d\'extinction déluge eau/émulseur pour transformateurs, extinction gaz CO2/inergen pour alternateur, bacs de rétention.',
      en: 'Water deluge/foam spray for transformers, inert gas/CO2 for generator casing, and oil containment bunds.',
    },
    primaryFunction: {
      fr: 'Détecter, contenir et éteindre instantanément tout départ d\'incendie d\'hydrocarbures ou électrique.',
      en: 'Detect, contain, and extinguish electrical and lubricating oil fires to protect life and asset value.',
    },
    primaryInterfaces: {
      upstream: 'Thermal / Optical Smoke Detectors',
      downstream: 'Deluge Valves & HVAC Fire Dampers',
      control: 'Fire Alarm Control Panel (FACP)',
      protection: 'Emergency ESD trip integration',
    },
    keyEquipmentCount: 9,
    applicableStandards: ['NFPA 851', 'NFPA 15', 'EN 54'],
    physicalLocation: 'Transformer Pits, Machine Hall, Cable Vaults',
    failureRiskLevel: 'critical',
  },
  {
    id: 'H23',
    cluster: 'balance_of_plant',
    name: { fr: 'Système d\'Épuisement & Drainage de l\'Usine', en: 'Drainage & Dewatering Systems' },
    shortSummary: {
      fr: 'Puisards d\'infiltration, pompes d\'épuisement submersibles de grande capacité, déshuileur et pompes de vidange bâche.',
      en: 'Seepage collection sumps, high-capacity dewatering pumps, oil/water separator, and scrollcase drain valves.',
    },
    primaryFunction: {
      fr: 'Évacuer en continu les infiltrations rocheuses et vider rapidement les bâches et aspirateurs pour maintenance.',
      en: 'Continuously evacuate structural seepage and rapidly dewater turbines/draft tubes for dry inspection.',
    },
    primaryInterfaces: {
      upstream: 'Turbine Pit, Seepage Gutters, Cooling Water Return',
      downstream: 'Tailrace Canal',
      control: 'Float level switches & automatic pump sequencing',
      protection: 'High-high flood level emergency alarm and flood door interlock',
    },
    keyEquipmentCount: 6,
    applicableStandards: ['IEEE 1010', 'ISO 5199'],
    physicalLocation: 'Lowest Floor Level / Sump Pit',
    failureRiskLevel: 'high',
  },
  {
    id: 'H24',
    cluster: 'balance_of_plant',
    name: { fr: 'Ventilation & Climatisation Industrielle (HVAC)', en: 'Ventilation & HVAC' },
    shortSummary: {
      fr: 'Centrales de traitement d\'air, ventilateurs de pressurisation des locaux électriques, extraction d\'hydrogène batteries.',
      en: 'Air handling units, electrical room positive pressurization fans, and battery room hydrogen exhaust fans.',
    },
    primaryFunction: {
      fr: 'Maintenir la température et l\'hygrométrie sous les tolérances des équipements électroniques et évacuer les gaz.',
      en: 'Maintain ambient air temperature/humidity within limits for electronic gear and exhaust hazardous gases.',
    },
    primaryInterfaces: {
      upstream: 'Atmospheric Air & Chillers',
      downstream: 'Electrical Rooms & Generator Pit',
      control: 'Building Management System (BMS)',
      protection: 'Smoke detector duct damper closure',
    },
    keyEquipmentCount: 7,
    applicableStandards: ['ASHRAE 62.1', 'NFPA 90A'],
    physicalLocation: 'HVAC Plantrooms & Duct Galleries',
    failureRiskLevel: 'low',
  },
  {
    id: 'H25',
    cluster: 'automation_defense',
    name: { fr: 'Surveillance d\'État & Maintenance Prédictive (CMS)', en: 'Condition Monitoring (CMS)' },
    shortSummary: {
      fr: 'Analyse spectrale des vibrations d\'arbre, surveillance des décharges partielles (DP), chromatographie DGA d\'huile.',
      en: 'Online shaft orbit and vibration FFT analysis, partial discharge stator sensors, and online DGA oil gas monitor.',
    },
    primaryFunction: {
      fr: 'Diagnostiquer l\'usure naissante avant toute défaillance pour optimiser les révisions majeures.',
      en: 'Track incipient dielectric, mechanical, and hydraulic degradation to enable predictive maintenance overhaul.',
    },
    primaryInterfaces: {
      upstream: 'Vibration Probes, PD Couplers, Oil Gas Transmitters',
      downstream: 'Asset Performance Management Server',
      control: 'Continuous acquisition DSP module',
      protection: 'Trend slope alert notifications',
    },
    keyEquipmentCount: 10,
    applicableStandards: ['ISO 13373-1', 'IEC 60270', 'IEEE C57.104'],
    physicalLocation: 'Server Room & Local Sensor Junction Enclosures',
    failureRiskLevel: 'low',
  },
  {
    id: 'H26',
    cluster: 'governance_ops',
    name: { fr: 'Exploitation & Conduite Opérationnelle', en: 'Plant Operation' },
    shortSummary: {
      fr: 'Consignes de conduite, 10 états machine normalisés, tenue du journal de quart et procédures d\'urgence.',
      en: 'Operational dispatch orders, 10 standardized unit operational states, digital logbook, and emergency protocols.',
    },
    primaryFunction: {
      fr: 'Ordonnancer la production d\'énergie en conformité avec les programmes du dispatching et la sécurité.',
      en: 'Manage physical generation schedules in strict compliance with grid dispatch instructions and safety rules.',
    },
    primaryInterfaces: {
      upstream: 'National Grid Dispatcher / Energy Trader',
      downstream: 'H18 Plant Automation Master Sequencer',
      control: 'Shift Supervisor Console',
      protection: 'Operating envelope limit supervision',
    },
    keyEquipmentCount: 4,
    applicableStandards: ['IEEE 1010', 'IEC 62270'],
    physicalLocation: 'Main Control Room (MCR)',
    failureRiskLevel: 'high',
  },
  {
    id: 'H27',
    cluster: 'governance_ops',
    name: { fr: 'Essais & Mise en Service Industrielle', en: 'Testing & Commissioning' },
    shortSummary: {
      fr: 'Essais de réception hydraulique sur modèle et in situ, essais de délestage de charge (load rejection) et rigidité diélectrique.',
      en: 'Field hydraulic performance acceptance tests, model testing, full load rejection tests, and dielectric proof tests.',
    },
    primaryFunction: {
      fr: 'Valider contractuellement les garanties de rendement, les surpressions maximales et la sécurité électrique.',
      en: 'Contractually verify efficiency guarantees, maximum overspeed/overpressure limits, and electrical compliance.',
    },
    primaryInterfaces: {
      upstream: 'EPC Contractor Engineering',
      downstream: 'Commercial Operation Date (COD) Certification',
      control: 'High-speed transient data acquisition recorder',
      protection: 'Trip threshold validation',
    },
    keyEquipmentCount: 6,
    applicableStandards: ['IEC 60041', 'IEC 60193', 'IEEE 1147'],
    physicalLocation: 'Site Commissioning Center',
    failureRiskLevel: 'medium',
  },
  {
    id: 'H28',
    cluster: 'governance_ops',
    name: { fr: 'Normes & Conformité Réglementaire', en: 'Standards & Compliance' },
    shortSummary: {
      fr: 'Corpus normatif international IEC, IEEE, ISO, Code de Réseau national et arrêtés ministériels.',
      en: 'Comprehensive normative repository of IEC, IEEE, and ISO standards cross-referenced to national grid codes.',
    },
    primaryFunction: {
      fr: 'Garantir la conformité de chaque sous-système aux exigences contractuelles et réglementaires applicables.',
      en: 'Ensure every physical and logical subsystem complies with statutory grid interconnection and design codes.',
    },
    primaryInterfaces: {
      upstream: 'Standardization Bodies (IEC, IEEE, ISO, CIGRE)',
      downstream: 'All Plant Equipment Technical Specifications',
      control: 'Compliance verification audit matrix',
      protection: 'Regulatory breach alerts',
    },
    keyEquipmentCount: 3,
    applicableStandards: ['IEC / IEEE / ISO Master Catalog'],
    physicalLocation: 'Technical Documentation Archive',
    failureRiskLevel: 'low',
  },
  {
    id: 'H29',
    cluster: 'governance_ops',
    name: { fr: 'Cycle de Vie & Déconstruction', en: 'Plant Lifecycle' },
    shortSummary: {
      fr: 'Du concept initial aux études de faisabilité, construction, exploitation (50+ ans), réhabilitation et fin de vie.',
      en: 'From initial hydrology survey to feasibility, EPC construction, 50-year operations, re-runnering, and decommissioning.',
    },
    primaryFunction: {
      fr: 'Structurer la gestion patrimoniale de l\'infrastructure sur l\'ensemble de sa durée de vie séculaire.',
      en: 'Structure long-term asset management, capital refurbishment, and environmental restoration over 50-100 years.',
    },
    primaryInterfaces: {
      upstream: 'Investment Committee / Concession Authority',
      downstream: 'Plant Maintenance History & Refurbishment Projects',
      control: 'Enterprise Asset Management (EAM)',
      protection: 'End-of-life fatigue failure mitigation',
    },
    keyEquipmentCount: 4,
    applicableStandards: ['ISO 55000', 'ICOLD Bulletin 145'],
    physicalLocation: 'Asset Management Archives',
    failureRiskLevel: 'medium',
  },
  {
    id: 'H30',
    cluster: 'civil_hydraulic',
    name: { fr: 'Gestion Environnementale & Débit Réservé', en: 'Environmental & Water Management' },
    shortSummary: {
      fr: 'Passe à poissons, contrôle de la température d\'eau, désoxygénation, rejet des sédiments et débit réservé légal.',
      en: 'Fish passage bypass, downstream water quality/temperature sensors, sediment flushing, and statutory minimum flow.',
    },
    primaryFunction: {
      fr: 'Préserver l\'écosystème aquatique aval et honorer les engagements légaux environnementaux.',
      en: 'Preserve aquatic biology downstream and fulfill environmental license statutory discharge obligations.',
    },
    primaryInterfaces: {
      upstream: 'H02 Reservoir Basin',
      downstream: 'Downstream River Ecosystem & Local Communities',
      control: 'Environmental flow bypass valve actuator',
      protection: 'Minimum flow violation telemetry alarm',
    },
    keyEquipmentCount: 6,
    applicableStandards: ['ISO 14001', 'World Bank ESS', 'ICOLD Bulletin 169'],
    physicalLocation: 'Dam Toe & Downstream Riparian Corridor',
    failureRiskLevel: 'high',
  },
  {
    id: 'H31',
    cluster: 'electrical_power',
    name: { fr: 'Interface Réseau & Point d\'Injection (POI)', en: 'Grid Interface' },
    shortSummary: {
      fr: 'Travée ligne de départ, sectionneur de tête, transformateurs de mesure de facturation tarifaire et câble de garde OPGW.',
      en: 'Transmission outgoing line bay, line disconnectors, tariff fiscal metering CT/VTs, and OPGW fiber teleprotection.',
    },
    primaryFunction: {
      fr: 'Assurer la démarcation technique, contractuelle et de sécurité avec l\'opérateur du réseau de transport (GRT).',
      en: 'Provide technical, contractual, and electrical safety demarcation with the Transmission System Operator (TSO).',
    },
    primaryInterfaces: {
      upstream: 'H15 Generating Switchyard',
      downstream: 'D02 Transmission Domain (High Voltage Lines)',
      control: 'TSO Remote Terminal Unit (RTU) Telecontrol',
      protection: 'Line differential (ANSI 87L), distance protection (21)',
    },
    keyEquipmentCount: 8,
    applicableStandards: ['IEC 60870-5-104', 'IEEE C37.113', 'National Grid Code'],
    physicalLocation: 'Switchyard Gantry Line Terminus',
    failureRiskLevel: 'critical',
  },
];

// ============================================================================
// 3. CANONICAL HYDRO TURBINE CATALOG (SECTION 11)
// ============================================================================

export const HYDRO_TURBINES_DATA: Record<HydraulicTurbineType, TurbineTechnicalData> = {
  francis: {
    type: 'francis',
    headRangeM: { min: 40, max: 600 },
    flowRangeM3s: { min: 2, max: 500 },
    specificSpeedNq: 120,
    efficiencyPeakPercent: 95.5,
    components: {
      casing: 'Spiral Casing (Volute) in welded structural steel',
      flowRegulation: 'Wicket-gate distributor with 20-28 movable guide vanes and servomotors',
      runner: 'Single-piece cast or welded stainless steel (13Cr-4Ni) Francis runner',
      discharge: 'Elbow-type draft tube with pressure recovery diffuser',
    },
    governorActuationTimeSeconds: { opening: 6.0, closing: 4.5, emergencyClosing: 3.2 },
  },
  pelton: {
    type: 'pelton',
    headRangeM: { min: 200, max: 1800 },
    flowRangeM3s: { min: 0.5, max: 50 },
    specificSpeedNq: 25,
    efficiencyPeakPercent: 93.8,
    components: {
      casing: 'Cast iron or steel housing with atmospheric tailrace discharge pit',
      flowRegulation: '1 to 6 hydraulic spear nozzles with fast deflectors',
      runner: 'Forged disc with bolted or monobloc double-hemispherical buckets',
      discharge: 'Free atmospheric fall to tailwater pit with water cushion',
    },
    governorActuationTimeSeconds: { opening: 15.0, closing: 25.0, emergencyClosing: 0.4 }, // Deflector drops in 0.4s!
  },
  kaplan: {
    type: 'kaplan',
    headRangeM: { min: 3, max: 70 },
    flowRangeM3s: { min: 10, max: 800 },
    specificSpeedNq: 450,
    efficiencyPeakPercent: 94.8,
    components: {
      casing: 'Concrete semi-spiral casing or steel flume',
      flowRegulation: 'Double regulation: synchronized wicket gates AND adjustable runner blade pitch',
      runner: 'Oil-filled or water-filled hub with 4 to 6 adjustable stainless steel blades',
      discharge: 'Straight or elbow draft tube with high velocity energy recovery',
    },
    governorActuationTimeSeconds: { opening: 8.0, closing: 6.0, emergencyClosing: 4.0 },
  },
  propeller: {
    type: 'propeller',
    headRangeM: { min: 2, max: 40 },
    flowRangeM3s: { min: 5, max: 400 },
    specificSpeedNq: 400,
    efficiencyPeakPercent: 92.5,
    components: {
      casing: 'Tubular bulb casing or concrete intake chamber',
      flowRegulation: 'Single regulation: movable wicket gates only with fixed-pitch runner blades',
      runner: 'Monobloc hub with rigidly cast fixed-angle propeller blades',
      discharge: 'Straight conical draft tube',
    },
    governorActuationTimeSeconds: { opening: 6.0, closing: 5.0, emergencyClosing: 3.5 },
  },
  turgo: {
    type: 'turgo',
    headRangeM: { min: 50, max: 300 },
    flowRangeM3s: { min: 0.5, max: 15 },
    specificSpeedNq: 60,
    efficiencyPeakPercent: 90.5,
    components: {
      casing: 'Compact welded steel casing with splash deflectors',
      flowRegulation: 'Angled jet needle nozzle (striking runner at 20° angle)',
      runner: 'Special shallow-bucket runner allowing water to exit unobstructed on the opposite side',
      discharge: 'Free gravity drainage to tailrace channel',
    },
    governorActuationTimeSeconds: { opening: 10.0, closing: 15.0, emergencyClosing: 0.5 },
  },
  cross_flow: {
    type: 'cross_flow',
    headRangeM: { min: 2, max: 200 },
    flowRangeM3s: { min: 0.1, max: 10 },
    specificSpeedNq: 80,
    efficiencyPeakPercent: 86.0,
    components: {
      casing: 'Rectangular steel casing with divide-flow compartment guide vane',
      flowRegulation: 'Split rectangular entry gate (1/3 and 2/3 partitions)',
      runner: 'Cylindrical drum-like wheel with curved longitudinal blades (Banki-Michell)',
      discharge: 'Atmospheric bottom discharge with draft tube air admission valve',
    },
    governorActuationTimeSeconds: { opening: 8.0, closing: 6.0, emergencyClosing: 4.0 },
  },
  pump_turbine: {
    type: 'pump_turbine',
    headRangeM: { min: 80, max: 800 },
    flowRangeM3s: { min: 15, max: 300 },
    specificSpeedNq: 140,
    efficiencyPeakPercent: 93.0,
    components: {
      casing: 'Reinforced spiral casing designed for bidirectional high-head operation',
      flowRegulation: 'Heavy-duty wicket gates with mechanical individual safety shear pins',
      runner: 'Bidirectional high-pressure radial runner (rotates CW in generation, CCW in pumping)',
      discharge: 'Deeply submerged draft tube to meet stringent Net Positive Suction Head (NPSH)',
    },
    governorActuationTimeSeconds: { opening: 10.0, closing: 6.0, emergencyClosing: 3.0 },
  },
};

// ============================================================================
// 4. UNIT STARTUP SEQUENCE (SECTION 31)
// ============================================================================

export const HYDRO_STARTUP_STEPS: StartupSequenceStep[] = [
  {
    stepNumber: 1,
    name: { fr: 'Vérification Préliminaire Disponibilité Centrale', en: 'Plant Availability & Standby Permissive' },
    subsystem: 'H26',
    prerequisites: ['No active emergency lockout relays (86G/86T)', 'Fire detection normal', 'Intake water level normal'],
    equipmentInvolved: ['Master Plant PLC', 'Lockout Relays', 'Reservoir Level Radar'],
    controlAction: 'System scans all safety interlocks and health flags across H01-H31',
    expectedDurationSeconds: 2,
    safetyInterlocks: ['Trip 86 reset', 'Flood barriers sealed', 'Drainage sump level below high alarm'],
    failureConditions: ['Lockout 86 trip active', 'Fire alarm latched in machine hall'],
  },
  {
    stepNumber: 2,
    name: { fr: 'Vérification Alimentation Auxiliaire AC & DC', en: 'Station Auxiliary AC & DC System Health' },
    subsystem: 'H16',
    prerequisites: ['Station 400V bus energized', '110V DC battery voltage > 115V', 'UPS normal'],
    equipmentInvolved: ['Station Service Board', '110V Battery Bank', 'Static UPS Inverter'],
    controlAction: 'Verify trip circuit supervision relays (74TC) healthy on all breakers',
    expectedDurationSeconds: 3,
    safetyInterlocks: ['DC ground fault monitor clear', 'Trip coils healthy'],
    failureConditions: ['Loss of DC control bus', 'Battery charger fault'],
  },
  {
    stepNumber: 3,
    name: { fr: 'Démarrage du Système de Refroidissement', en: 'Generator Cooling System Startup' },
    subsystem: 'H12',
    prerequisites: ['Raw water intake suction strainer clean', 'Power available on pump MCC'],
    equipmentInvolved: ['Cooling Water Pumps', 'Stator Air Coolers', 'Bearing Oil Heat Exchangers'],
    controlAction: 'Start primary cooling water pump, confirm flow switch closure > 45 m³/h',
    expectedDurationSeconds: 15,
    safetyInterlocks: ['Differential pressure across strainers < 0.3 bar', 'Minimum water flow confirmed'],
    failureConditions: ['Pump trip on overload', 'Zero cooling flow detected within 20s'],
  },
  {
    stepNumber: 4,
    name: { fr: 'Démarrage de la Lubrification & Sustentation Hydrostatique', en: 'Bearing Lubrication & Jacking Oil Pressure' },
    subsystem: 'H13',
    prerequisites: ['Bearing oil sumps level normal', 'Oil temperature > 15°C'],
    equipmentInvolved: ['High-Pressure Jacking Oil Pump', 'Thrust Bearing Pads', 'Pressure Switch'],
    controlAction: 'Start HP jacking pump to lift rotor collar by 0.08 mm on hydrostatic oil film',
    expectedDurationSeconds: 20,
    safetyInterlocks: ['Jacking pressure > 120 bar confirmed', 'Mechanical rotor brakes fully disengaged'],
    failureConditions: ['Jacking pressure failure', 'Brake retracted limit switch open'],
  },
  {
    stepNumber: 5,
    name: { fr: 'Ouverture Vanne de Tête & Remplissage Bâche Spirale', en: 'Main Inlet Valve (MIV) Opening & Casing Pressurization' },
    subsystem: 'H05',
    prerequisites: ['Penstock pressurized', 'MIV bypass valve operational'],
    equipmentInvolved: ['Bypass Valve', 'Main Spherical/Butterfly Valve', 'Spiral Casing Aeration Valve'],
    controlAction: 'Open MIV bypass to equalize pressure across spherical valve, then open main spherical seal',
    expectedDurationSeconds: 90,
    safetyInterlocks: ['Differential pressure across valve disc < 0.5 bar before main open', 'Scrollcase vented'],
    failureConditions: ['Bypass valve jamming', 'Severe penstock pressure drop detection'],
  },
  {
    stepNumber: 6,
    name: { fr: 'Armement Régulateur de Vitesse & Vérification Interverrouillages', en: 'Speed Governor Ready & Interlocks Cleared' },
    subsystem: 'H11',
    prerequisites: ['Governor hydraulic oil accumulator pressure > 140 bar', 'Wicket gate mechanical lock withdrawn'],
    equipmentInvolved: ['HP Governor Oil Sump', 'Distributor Servomotors', 'Digital Governor PLC'],
    controlAction: 'Energize governor solenoid valve, release wicket-gate mechanical lock cylinder',
    expectedDurationSeconds: 10,
    safetyInterlocks: ['Mechanical shear pins intact', 'Zero speed command verified'],
    failureConditions: ['Low oil accumulator pressure', 'Guide vane feedback LVDT mismatch'],
  },
  {
    stepNumber: 7,
    name: { fr: 'Démarrage du Groupe & Accélération Vitesse de Rotation', en: 'Turbine Breakaway & Controlled Speed Ramp' },
    subsystem: 'H07',
    prerequisites: ['Steps 1 through 6 completed with permissive flag set'],
    equipmentInvolved: ['Wicket Gates', 'Hydraulic Runner', 'Shaft Speed Sensors'],
    controlAction: 'Governor opens wicket gates to breakaway position (~12%), speed begins ramp towards 500 rpm',
    expectedDurationSeconds: 45,
    safetyInterlocks: ['Speed increase detected within 10s', 'Bearing temperatures steady'],
    failureConditions: ['Failure to rotate within 15s', 'Excessive shaft radial runout vibration'],
  },
  {
    stepNumber: 8,
    name: { fr: 'Atteinte Vitesse Nominale & Arrêt Pompe de Sustentation', en: 'Rated Synchronous Speed & Jacking Pump Cutoff' },
    subsystem: 'H08',
    prerequisites: ['Rotor speed reaches 95% rated (475 rpm)'],
    expectedDurationSeconds: 15,
    equipmentInvolved: ['Shaft Magnetic Pickups', 'Jacking Oil Pump Contactor'],
    controlAction: 'Governor closes loop on speed feedback to stabilize at exactly 50.00 Hz; stop HP jacking pump',
    safetyInterlocks: ['Overspeed relay (12) unactuated', 'Hydrodynamic wedge established in bearings'],
    failureConditions: ['Speed hunting or runaway condition', 'High bearing pad temperature'],
  },
  {
    stepNumber: 9,
    name: { fr: 'Amorçage de l\'Excitation & Montée en Tension Statorique', en: 'Field Breaker Closure & Stator Voltage Buildup' },
    subsystem: 'H10',
    prerequisites: ['Speed stabilized at 50 Hz ± 0.2 Hz', 'AVR in automatic mode'],
    equipmentInvolved: ['Field Circuit Breaker', 'Static Exciter Thyristor Bridge', 'AVR Module'],
    controlAction: 'Close field circuit breaker, fire thyristor gate pulses to ramp terminal voltage to 11.0 kV',
    expectedDurationSeconds: 12,
    safetyInterlocks: ['Volts/Hertz protection (ANSI 24) normal', 'Overexcitation limiter active'],
    failureConditions: ['Failure of field breaker to close', 'AVR failure to produce nominal stator voltage'],
  },
  {
    stepNumber: 10,
    name: { fr: 'Vérification des Critères de Synchronisation (ANSI 25)', en: 'Automatic Synchrocheck & Frequency Matching' },
    subsystem: 'H18',
    prerequisites: ['Generator voltage = Grid voltage ± 1.5%', 'Frequency slip < 0.1 Hz', 'Phase angle window < 5°'],
    equipmentInvolved: ['Auto-Synchronizer Relay (25)', 'VT Signal Comparators', 'Speed/Voltage Trimmers'],
    controlAction: 'Fine-tune governor speed pulses and AVR voltage setpoint until synchroscope pointer crosses top dead center',
    expectedDurationSeconds: 25,
    safetyInterlocks: ['Synchronism check permissive contact closed', 'Bus voltage present and stable'],
    failureConditions: ['Phase sequence reversed', 'Grid frequency outside permissible synchronizing band'],
  },
  {
    stepNumber: 11,
    name: { fr: 'Fermeture Disjoncteur Groupe & Couplage au Réseau', en: 'Generator Circuit Breaker (GCB) Close Command' },
    subsystem: 'H15',
    prerequisites: ['Synchrocheck permissive contact strictly closed'],
    equipmentInvolved: ['Generator Circuit Breaker (GCB 52G)', 'Trip/Close Coils', 'Station Busbar'],
    controlAction: 'Send close pulse to GCB 52G; breaker closes within 60 ms; machine locks synchronously to grid',
    expectedDurationSeconds: 1,
    safetyInterlocks: ['Breaker auxiliary contact 52a confirmation', 'Zero current surge monitored'],
    failureConditions: ['Breaker fail to latch (50BF)', 'Out-of-step trip (78)'],
  },
  {
    stepNumber: 12,
    name: { fr: 'Prise de Charge Initiale & Régulation en Puissance Active', en: 'Initial Block Load & Active Power Dispatch Ramp' },
    subsystem: 'H26',
    prerequisites: ['GCB successfully closed and confirmed'],
    equipmentInvolved: ['Governor Speed Droop Controller', 'AVR Reactive Power Controller', 'GSU Transformer'],
    controlAction: 'Immediately ramp up active power to minimum stable load (e.g. 10% / 6 MW) to prevent reverse power trip',
    expectedDurationSeconds: 30,
    safetyInterlocks: ['Reverse power relay (ANSI 32R) supervisory hold-off', 'Wicket gates smoothly tracking'],
    failureConditions: ['Reverse power trip if water flow drops', 'Stator overcurrent during initial loading'],
  },
];

// ============================================================================
// 5. CAUSAL FAILURE & EVENT PROPAGATION SCENARIOS (SECTION 43)
// ============================================================================

export const HYDRO_FAILURE_SCENARIOS: HydroFailureScenario[] = [
  {
    id: 'cooling_failure',
    title: {
      fr: 'Perte Totale du Circuit d\'Eau de Refroidissement Groupe',
      en: 'Complete Generator Cooling Water Failure',
    },
    rootCause: 'Rupture d\'accouplement mécanique de la pompe primaire de refroidissement avec défaillance de basculement de la pompe de secours.',
    affectedSubsystems: ['H12', 'H09', 'H13', 'H17', 'H26'],
    propagationChain: [
      {
        sequenceIndex: 1,
        domainLayer: 'auxiliary',
        triggerEvent: 'Cooling pump trip & zero flow output',
        physicalManifestation: 'Arrêt immédiat de la circulation d\'eau brute dans les aéro-réfrigérants de stator.',
        instrumentationDetection: 'Débitmètre électromagnétique H12 détecte débit < 10% et déclenche alerte niveau 1.',
        protectionReaction: 'Alarme sonore en salle de commande SCADA + voyant défaut refroidissement.',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 2,
        domainLayer: 'mechanical',
        triggerEvent: 'Thermal buildup in stator slots and thrust pads',
        physicalManifestation: 'La température du cuivre statorique augmente à un gradient de 2.5°C par minute.',
        instrumentationDetection: 'Sondes duplex PT100 statoriques (H19) dépassent le seuil haut de 125°C.',
        protectionReaction: 'Alerte niveau 2 : ordre automatique de délestage partiel de puissance active à 50%.',
        resultingPlantState: 'loaded',
      },
      {
        sequenceIndex: 3,
        domainLayer: 'protection',
        triggerEvent: 'Thermal overload threshold exceeded (140°C)',
        physicalManifestation: 'Température bobinage atteint 142°C risquant la dégradation permanente de l\'isolation classe F.',
        instrumentationDetection: 'Relais numérique de protection thermique groupe (ANSI 49G) entre en temporisation finale.',
        protectionReaction: 'Relais 49G émet l\'ordre de DÉCLENCHEMENT D\'URGENCE au relais de verrouillage 86G1.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 4,
        domainLayer: 'electrical',
        triggerEvent: 'GCB Trip & Generator De-excitation',
        physicalManifestation: 'Ouverture du disjoncteur GCB 52G (60 ms), ouverture du disjoncteur de champ 41 et décharge du rotor.',
        instrumentationDetection: 'TC de sortie mesurent chute instantanée du courant statorique à 0 A.',
        protectionReaction: 'Séparation électrique complète du réseau national 225 kV.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 5,
        domainLayer: 'hydraulic',
        triggerEvent: 'Governor rapid emergency closure of wicket gates',
        physicalManifestation: 'Servomoteurs ferment les directrices de 75% à 0% en 4.0 s. Transitoire de pression dans la conduite.',
        instrumentationDetection: 'Capteur de pression bâche spirale enregistre surpression modérée amortie par la cheminée d\'équilibre H06.',
        protectionReaction: 'Régulateur de vitesse H11 met la turbine au ralenti puis applique les freins mécaniques à 25% de vitesse.',
        resultingPlantState: 'stopped',
      },
    ],
    mitigationGuidelines: {
      fr: [
        'Vérifier le basculement automatique sur alimentation de secours et tester la motopompe 2',
        'Nettoyer le filtre duplex d\'eau brute colmaté',
        'Laisser refroidir les enroulements statoriques sous ventilation forcée avant toute tentative de démarrage',
      ],
      en: [
        'Verify automatic transfer switchover to standby pump and test auxiliary motor contacts',
        'Clear clogged duplex raw water basket strainers',
        'Allow stator windings to cool down under forced ventilation before clearing 86 lockout',
      ],
    },
    standardsReference: ['IEC 60034-1', 'IEEE C37.102', 'IEC 62270'],
  },
  {
    id: 'load_rejection_waterhammer',
    title: {
      fr: 'Délestage Brutal de Charge à 100% & Coup de Bélier',
      en: 'Full 100% Load Rejection & Waterhammer Transient',
    },
    rootCause: 'Déclenchement intempestif de la ligne d\'évacuation 225 kV lors d\'un court-circuit orageux externe alors que la centrale débitait sa puissance nominale.',
    affectedSubsystems: ['H31', 'H15', 'H09', 'H11', 'H07', 'H05', 'H06'],
    propagationChain: [
      {
        sequenceIndex: 1,
        domainLayer: 'electrical',
        triggerEvent: 'HV Line Protection Trip (Distance 21) & GCB Separation',
        physicalManifestation: 'La puissance électrique résistive s\'effondre instantanément de 100 MW à 0 MW en 50 millisecondes.',
        instrumentationDetection: 'Wattmètres de tableau mesurent P = 0 MW; courant I = 0 A.',
        protectionReaction: 'Relais d\'ilotage et protection survitesse turbine armés instantanément.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 2,
        domainLayer: 'mechanical',
        triggerEvent: 'Mechanical torque unbalance & rotor acceleration',
        physicalManifestation: 'Le couple hydraulique moteur sans couple antagoniste électrique entraîne une brutale survitesse du rotor (jusqu\'à 145% de vitesse nominale).',
        instrumentationDetection: 'Capteurs magnétiques de vitesse H08 enregistrent accélération dn/dt = 120 rpm/s.',
        protectionReaction: 'Régulateur de vitesse H11 ordonne la fermeture rapide d\'urgence des directrices.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 3,
        domainLayer: 'hydraulic',
        triggerEvent: 'Guide-vane fast closure & water column momentum stoppage',
        physicalManifestation: 'La décélération brutale de plusieurs centaines de tonnes d\'eau dans la conduite crée une onde de surpression de coup de bélier (+35% de pression hydrostatique).',
        instrumentationDetection: 'Capteurs de pression piézorésistifs en entrée bâche spirale H05 enregistrent pic de pression à 28 bar.',
        protectionReaction: 'Soupape de décharge (ou déflecteur sur Pelton) entre en action pour dériver le jet.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 4,
        domainLayer: 'hydraulic',
        triggerEvent: 'Surge tank mass oscillation uptake',
        physicalManifestation: 'Le volume d\'eau refoulé monte dans la cheminée d\'équilibre H06, transformant l\'énergie cinétique en énergie potentielle et amortissant l\'onde.',
        instrumentationDetection: 'Capteur radar de niveau dans la cheminée d\'équilibre enregistre oscillation périodique amortie (T = 45s).',
        protectionReaction: 'Pression de conduite maintenue strictement en-deçà de la pression d\'épreuve de la conduite.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 5,
        domainLayer: 'control',
        triggerEvent: 'Governor stabilizes speed at idle nominal (50 Hz) or proceeds to safe stop',
        physicalManifestation: 'Roue stabilisée à sa vitesse nominale à vide sans débit de puissance ou fermeture complète.',
        instrumentationDetection: 'Fréquencemètre confirme retour de la vitesse à 500 rpm.',
        protectionReaction: 'L\'unité reste synchronisable prête pour le renvoi de tension réseau (Black-Start).',
        resultingPlantState: 'available',
      },
    ],
    mitigationGuidelines: {
      fr: [
        'Vérifier l\'intégrité structurelle des ancrages de la conduite forcée et de la bâche spirale',
        'Inspecter les goupilles de cisaillement et biellettes du distributeur de directrices',
        'Attendre l\'amortissement complet des oscillations de la cheminée d\'équilibre avant redémarrage',
      ],
      en: [
        'Inspect penstock structural anchor blocks and expansion joints for displacement',
        'Examine wicket-gate linkage shear pins and servomotor mechanical stops',
        'Verify surge tank water level has settled to equilibrium before re-initiating unit startup',
      ],
    },
    standardsReference: ['IEC 60041', 'IEC 60193', 'IEEE 125'],
  },
  {
    id: 'transformer_differential',
    title: {
      fr: 'Défaut Interne Transformateur Élévateur (87T) & Déclenchement d\'Urgence',
      en: 'GSU Transformer Internal Fault (87T) & Total Plant Isolation',
    },
    rootCause: 'Amorçage diélectrique entre spires de l\'enroulement HT 225 kV suite à une surtension de manœuvre, dégradant l\'huile diélectrique.',
    affectedSubsystems: ['H14', 'H15', 'H09', 'H17', 'H22'],
    propagationChain: [
      {
        sequenceIndex: 1,
        domainLayer: 'electrical',
        triggerEvent: 'Turn-to-turn insulation breakdown in GSU phase B',
        physicalManifestation: 'Arc électrique sous huile créant une dissociation brutale des molécules d\'huile en hydrogène et acétylène.',
        instrumentationDetection: 'TC côté 11 kV et TC côté 225 kV mesurent déséquilibre de courant différentiel > 0.3 In.',
        protectionReaction: 'Relais différentiel transformateur numérique (ANSI 87T) déclenche en 18 millisecondes.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 2,
        domainLayer: 'protection',
        triggerEvent: 'Lockout Relay 86T Tripping',
        physicalManifestation: 'Relais bistable 86T enclenche ses 16 contacts secs de déclenchement ultra-rapides.',
        instrumentationDetection: 'Surveillance de position 86T confirme l\'état verrouillé en salle de commande.',
        protectionReaction: 'Déclenchement simultané du disjoncteur GCB 52G, du disjoncteur HT 225 kV et du désexcitateur 41.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 3,
        domainLayer: 'auxiliary',
        triggerEvent: 'Buchholz relay gas accumulation & pressure wave',
        physicalManifestation: 'La vague d\'huile pousse le clapet du relais Buchholz H14 et actionne le contact mécanique de déclenchement.',
        instrumentationDetection: 'Relais Buchholz (ANSI 63) confirme le défaut interne lourd avec dégagement gazeux.',
        protectionReaction: 'Ordre de confirmation redondant vers les déclencheurs à émission de tension.',
        resultingPlantState: 'emergency_trip',
      },
      {
        sequenceIndex: 4,
        domainLayer: 'balance_of_plant',
        triggerEvent: 'Fire deluge system arming & turbine shutdown',
        physicalManifestation: 'Mise en alerte des buses de pulvérisation d\'eau déluge H22 autour de la cuve du transformateur.',
        instrumentationDetection: 'Détecteurs linéaires de chaleur au-dessus du couvercle surveillent le seuil de température.',
        protectionReaction: 'Fermeture d\'urgence des vannes de turbine et arrêt complet de l\'alternateur.',
        resultingPlantState: 'stopped',
      },
    ],
    mitigationGuidelines: {
      fr: [
        'Interdiction formelle de réarmer le relais 86T ou de renvoyer la tension sans analyse physico-chimique et chromatographie DGA de l\'huile',
        'Mesurer la résistance d\'isolement, le facteur de dissipation diélectrique (tan delta) et le rapport de transformation',
        'Inspecter le bac de rétention d\'huile et le système coupe-feu',
      ],
      en: [
        'Strict prohibition against resetting 86T lockout without full DGA dissolved gas chromatography of oil sample',
        'Conduct winding DC resistance, insulation resistance, sweep frequency response (SFRA), and tan-delta tests',
        'Verify transformer bund oil containment and fire suppression readiness',
      ],
    },
    standardsReference: ['IEEE C57.12.00', 'IEEE C37.91', 'NFPA 851'],
  },
];

// ============================================================================
// 6. CANONICAL HYDROPOWER EQUIPMENT CATALOG SAMPLES (SECTION 38 & 45)
// ============================================================================

export const SAMPLE_HYDRO_EQUIPMENT: HydroEquipmentItem[] = [
  {
    id: 'eq-hyd-runner-francis-01',
    subsystemId: 'H07',
    code: 'TUR-RUN-FR-01',
    name: {
      fr: 'Roue Francis Haute Efficacité (13Cr-4Ni)',
      en: 'High-Efficiency Francis Runner (13Cr-4Ni Stainless Steel)',
    },
    category: 'Turbine Runner',
    definition: {
      fr: 'Organe tournant central d\'une turbine à réaction Francis composé d\'une couronne, d\'un plafond et d\'aubes profilées où s\'effectue la conversion de l\'énergie hydraulique en énergie mécanique de rotation.',
      en: 'Central rotating component of a Francis reaction turbine consisting of crown, band, and contoured blades where fluid pressure and velocity are converted into mechanical rotational torque.',
    },
    engineeringPurpose: {
      fr: 'Transformer le débit sous pression issu du distributeur en couple moteur sur l\'arbre avec un rendement de pointe supérieur à 95%.',
      en: 'Extract energy from pressurized water inflow delivered by wicket gates, imparting rotational shaft torque with peak efficiency >95%.',
    },
    operatingPrinciple: {
      fr: 'La déflexion du fluide entre les aubes crée une variation de quantité de mouvement et une différence de pression statique conformément au théorème d\'Euler pour les turbomachines.',
      en: 'Fluid deflection across curved three-dimensional blades induces a change in angular momentum and static pressure drop governed by Euler\'s turbomachinery equation.',
    },
    physical: {
      dimensionsMeters: { length: 3.8, width: 3.8, height: 1.9, diameter: 3.8 },
      weightTons: 28.5,
      material: 'Stainless steel martensitic alloy EN 10088-3 (X3CrNiMo13-4 / 13Cr-4Ni)',
      installationLocation: 'Turbine Pit center, coupled to vertical shaft flange at El. 328.40 m',
    },
    hydraulic: {
      flowM3s: 145.0,
      grossHeadM: 110.0,
      netHeadM: 104.5,
      cavitationThomaSigma: 0.085,
    },
    mechanical: {
      ratedSpeedRpm: 500,
      runawaySpeedRpm: 875,
      ratedTorqueKNm: 1910,
      thrustBearingLoadTons: 220,
      shaftArrangement: 'vertical',
      vibrationRmsMmS: 1.2,
    },
    auxiliaryDependencies: {
      coolingRequired: false,
      lubricationRequired: false,
      pneumaticPressureBar: 7.0, // aeration valve
    },
    relationships: {
      upstreamEquipmentId: 'eq-hyd-wicket-gates-01',
      downstreamEquipmentId: 'eq-hyd-draft-tube-01',
      mechanicalCoupledTo: 'eq-hyd-shaft-01',
      controlledBySubsystem: 'H11',
      protectedByRelays: ['rel-overspeed-12', 'rel-vibration-39'],
    },
    applicableStandards: [
      { code: 'IEC 60041', title: 'Field acceptance tests to determine the hydraulic performance of hydraulic turbines', organization: 'IEC' },
      { code: 'IEC 60193', title: 'Hydraulic turbines, storage pumps and pump-turbines - Model acceptance tests', organization: 'IEC' },
    ],
    lifecycleStage: 'operating',
    provenance: {
      source: 'IEC 60041 / Alstom Hydro Specification benchmark',
      confidence: 'normative_standard',
    },
  },
  {
    id: 'eq-hyd-generator-hydro-01',
    subsystemId: 'H09',
    code: 'GEN-HYD-500-100MVA',
    name: {
      fr: 'Alternateur Synchrone à Pôles Saillants 100 MVA - 11 kV',
      en: 'Salient-Pole Synchronous Hydro Generator 100 MVA - 11 kV',
    },
    category: 'Synchronous Generator',
    definition: {
      fr: 'Générateur électrique synchrone triphasé à arbre vertical, rotor à 12 pôles saillants et bobinage statorique à barres Roebel isolées sous résine époxy classe F.',
      en: 'Vertical-shaft three-phase salient-pole synchronous generator with 12 laminated poles and Roebel bar transposed stator windings with Class F epoxy resin insulation.',
    },
    engineeringPurpose: {
      fr: 'Générer une tension triphasée régulée de 11 kV sous 50 Hz à partir de la puissance mécanique fournie par la turbine Francis.',
      en: 'Generate clean, frequency-stable 11 kV three-phase 50 Hz power from mechanical torque delivered by the Francis turbine.',
    },
    operatingPrinciple: {
      fr: 'Induction électromagnétique selon la loi de Faraday-Lenz provoquée par la rotation d\'un champ magnétique rotorique à courant continu devant les conducteurs fixes du stator.',
      en: 'Electromagnetic induction per Faraday-Lenz law produced by rotating DC-excited salient rotor poles across stationary three-phase stator armature windings.',
    },
    physical: {
      dimensionsMeters: { length: 7.2, width: 7.2, height: 4.5, diameter: 7.2 },
      weightTons: 260.0,
      material: 'Silicon steel laminations M400-50A, electrolytic copper, Class F VPI resin',
      installationLocation: 'Generator Floor at Elevation 336.00 m',
    },
    electrical: {
      ratedVoltageKV: 11.0,
      ratedCurrentA: 5248.0,
      ratedActivePowerMW: 90.0,
      ratedApparentPowerMVA: 100.0,
      powerFactor: 0.90,
      frequencyHz: 50.0,
      connectionType: 'star',
      neutralEarthingMethod: 'distribution_transformer',
      reactancesPerUnit: { xd: 1.15, xd_prime: 0.32, xd_dbl_prime: 0.22, xq: 0.75 },
      insulationClass: 'F',
      bilKV: 75.0,
    },
    mechanical: {
      ratedSpeedRpm: 500,
      runawaySpeedRpm: 875,
      ratedTorqueKNm: 1910,
      thrustBearingLoadTons: 410,
      shaftArrangement: 'vertical',
      vibrationRmsMmS: 1.5,
      oilFilmThicknessMicrons: 35,
      shaftDeflectionMicrons: 40,
      criticalSpeedsRpm: [720, 1150],
    },
    auxiliaryDependencies: {
      coolingRequired: true,
      lubricationRequired: true,
      acAuxiliaryVoltageV: 400,
      dcControlVoltageV: 110,
    },
    relationships: {
      upstreamEquipmentId: 'eq-hyd-shaft-01',
      downstreamEquipmentId: 'eq-hyd-gsu-100mva-01',
      electricallyConnectsTo: 'eq-hyd-gcb-11kv-01',
      controlledBySubsystem: 'H10',
      protectedByRelays: ['87G', '51V', '40', '64S', '32R', '49G'],
    },
    applicableStandards: [
      { code: 'IEC 60034-1', title: 'Rotating electrical machines - Rating and performance', organization: 'IEC' },
      { code: 'IEEE C50.12', title: 'Salient-Pole 50 Hz and 60 Hz Synchronous Generators and Generator/Motors for Hydraulic Turbine Applications', organization: 'IEEE' },
    ],
    lifecycleStage: 'operating',
    provenance: {
      source: 'IEC 60034-1 / IEEE C50.12 Certified Type Test Benchmark',
      confidence: 'normative_standard',
    },
  },
  {
    id: 'eq-hyd-gsu-100mva-01',
    subsystemId: 'H14',
    code: 'TR-GSU-11-225-100MVA',
    name: {
      fr: 'Transformateur Élévateur Principal 100 MVA 11/225 kV',
      en: 'Main Generator Step-Up Transformer (GSU) 100 MVA 11/225 kV',
    },
    category: 'Step-Up Transformer',
    definition: {
      fr: 'Transformateur de puissance triphasé à huile minérale ONAF, couplage YNd11, élévateur de la tension groupe 11 kV à la tension du réseau de transport 225 kV.',
      en: 'Three-phase oil-immersed ONAF power transformer, vector group YNd11, stepping up generator 11 kV bus to 225 kV transmission network voltage.',
    },
    engineeringPurpose: {
      fr: 'Adapter la tension d\'évacuation pour minimiser les pertes par effet Joule lors du transport longue distance vers les grands centres de charge.',
      en: 'Step up generated power to high voltage to drastically minimize transmission line Joule $I^2 R$ losses toward load centers.',
    },
    operatingPrinciple: {
      fr: 'Induction mutuelle par flux magnétique commun guidé dans un circuit magnétique en tôle d\'acier au silicium à grains orientés (Hi-B).',
      en: 'Mutual electromagnetic induction via shared alternating magnetic flux through low-loss grain-oriented silicon steel laminations.',
    },
    physical: {
      dimensionsMeters: { length: 8.5, width: 4.8, height: 6.2 },
      weightTons: 118.0,
      material: 'Grain-oriented silicon steel core, copper windings, mineral insulating oil IEC 60296',
      installationLocation: 'Transformer Outdoor Bay adjacent to Machine Hall',
    },
    electrical: {
      ratedVoltageKV: 225.0,
      ratedCurrentA: 256.6,
      ratedActivePowerMW: 90.0,
      ratedApparentPowerMVA: 100.0,
      powerFactor: 0.90,
      frequencyHz: 50.0,
      connectionType: 'star',
      neutralEarthingMethod: 'solid',
      reactancesPerUnit: { xd: 0.12, xd_prime: 0.12, xd_dbl_prime: 0.12, xq: 0.12 }, // Uk% = 12%
      insulationClass: 'F',
      bilKV: 1050.0, // 225 kV BIL
    },
    auxiliaryDependencies: {
      coolingRequired: true, // Fans ONAF
      lubricationRequired: false,
      acAuxiliaryVoltageV: 400,
      dcControlVoltageV: 110,
    },
    relationships: {
      upstreamEquipmentId: 'eq-hyd-generator-hydro-01',
      downstreamEquipmentId: 'eq-hyd-switchyard-bay-225kv-01',
      controlledBySubsystem: 'H18',
      protectedByRelays: ['87T', '63_Buchholz', '51N', '49T', '64REF'],
    },
    applicableStandards: [
      { code: 'IEC 60076-1', title: 'Power transformers - General', organization: 'IEC' },
      { code: 'IEEE C57.12.00', title: 'Standard General Requirements for Liquid-Immersed Distribution, Power, and Regulating Transformers', organization: 'IEEE' },
    ],
    lifecycleStage: 'operating',
    provenance: {
      source: 'IEC 60076 Standard Specification',
      confidence: 'normative_standard',
    },
  },
];

// ============================================================================
// 7. COMPREHENSIVE EXTENSIONS EXPORT (FLEET, STANDARDS, SUBSYSTEMS)
// ============================================================================

export { CAMEROON_HYDRO_FLEET } from './hydropowerFleetData';
export { HYDRO_STANDARDS_CATALOGUE } from './hydropowerStandardsData';
export type { HydroStandardItem } from './hydropowerStandardsData';
export { HYDRO_SUBSYSTEMS, HYDRO_DOMAINS_COVERAGE } from './hydropowerSubsystemsData';

