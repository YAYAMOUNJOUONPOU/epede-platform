// src/components/distribution/data/distributionEquipmentCatalog.ts
// EPEDE D05 - Distribution Primary Apparatus Technical Inspector Catalog

export interface DistributionApparatus {
  id: string;
  code: string;
  name_fr: string;
  name_en: string;
  category: 'BREAKER' | 'RMU' | 'RECLOSER' | 'SECTIONALIZER' | 'SUBSTATION' | 'TRANSFORMER' | 'LV_BOARD' | 'METER_SERVICE' | 'TGBT';
  voltage_level: string;
  rated_current: string;
  breaking_capacity: string;
  standards: string[];
  purpose_fr: string;
  purpose_en: string;
  operating_principle_fr: string;
  operating_principle_en: string;
  physical_construction_fr: string;
  physical_construction_en: string;
  components_list_fr: string[];
  components_list_en: string[];
  protection_fr: string;
  protection_en: string;
  earthing_fr: string;
  earthing_en: string;
  failure_modes_fr: string[];
  failure_modes_en: string[];
  maintenance_fr: string;
  maintenance_en: string;
  upstream_anchor_fr: string;
  upstream_anchor_en: string;
  downstream_anchor_fr: string;
  downstream_anchor_en: string;
  representative_specs: Record<string, string>;
}

export const DISTRIBUTION_APPARATUS_CATALOG: DistributionApparatus[] = [
  {
    id: 'EQ-DISJONCTEUR-DEPART',
    code: 'CB-DEPART-30',
    name_fr: 'Disjoncteur de Départ MT 30 kV Débrochable',
    name_en: '30 kV Withdrawable MV Feeder Circuit Breaker',
    category: 'BREAKER',
    voltage_level: '30 kV / 36 kV de tenue assignée',
    rated_current: '630 A - 1250 A continu',
    breaking_capacity: '20 kA / 25 kA sous 1 s (pouvoir de coupure assigné Icu)',
    standards: ['IEC 62271-100', 'IEC 62271-200', 'UTE C 64-100'],
    purpose_fr: 'Coupure et fermeture sous tous régimes (normal, surcharge et court-circuit franc) en tête d\'artère de distribution moyenne tension.',
    purpose_en: 'Making and breaking under all conditions (normal, overload, and bolted short-circuit) at the head of the MV distribution feeder.',
    operating_principle_fr: 'Séparation ultra-rapide des contacts sous vide ou dans l\'hexafluorure de soufre (SF6) ; l\'arc électrique s\'éteint au premier passage à zéro du courant alternatif.',
    operating_principle_en: 'High-speed contact parting in vacuum or SF6; the electric arc is extinguished at the first natural AC current zero crossing.',
    physical_construction_fr: 'Chariot débrochable sur galets avec contacts tulipes arrière s\'embrochant sur les traversées de la cellule blindée Metal-Clad.',
    physical_construction_en: 'Withdrawable truck with rear silver-plated tulip clusters plugging directly into metal-clad enclosure spouts.',
    components_list_fr: [
      'Ampoules à vide en céramique alumine étanche',
      'Mécanisme d\'armement à ressort motorisé avec déclencheurs à émission',
      'Blocs de verrouillage mécanique et voyants mécaniques OUVERT / FERMÉ',
      'Connecteur multibroches basse tension pour les liaisons vers le relais IED'
    ],
    components_list_en: [
      'Alumina ceramic sealed vacuum interrupter bottles',
      'Motorized spring-charging operating mechanism with shunt trip coils',
      'Mechanical racking interlocks and optical OPEN / CLOSED position indicators',
      'Low-voltage auxiliary umbilical plug interfacing with protection relay'
    ],
    protection_fr: 'Asservi au relais numérique de protection de départ (ANSI 50/51/67N) avec cycle de réenclenchement rapide (ANSI 79).',
    protection_en: 'Controlled by the feeder numerical protection relay (ANSI 50/51/67N) with high-speed auto-reclosing cycle (ANSI 79).',
    earthing_fr: 'Cellule équipée d\'un sectionneur de terre à fermeture brusque (pouvoir de fermeture sur court-circuit 50 kA crête).',
    earthing_en: 'Cubicle fitted with a fault-making earthing switch (50 kA peak short-circuit making capacity).',
    failure_modes_fr: [
      'Perte de vide dans une ampoule entraînant un amorçage destructif',
      'Blocage mécanique des tringleries d\'armement de ressort',
      'Échauffement excessif des pinces de brochage par perte d\'élasticité'
    ],
    failure_modes_en: [
      'Loss of vacuum bottle integrity leading to destructive dielectric flashover',
      'Mechanical binding of spring-charging linkage or latch mechanism',
      'Contact overheating on rear cluster tulips due to spring relaxation'
    ],
    maintenance_fr: 'Mesure de résistance de contact (< 50 µΩ), rigidité diélectrique et temps de manœuvre (ouverture < 45 ms, fermeture < 65 ms).',
    maintenance_en: 'Contact resistance micro-ohmmeter test (< 50 µΩ), high-pot dielectric withstand, and timing analysis (trip < 45 ms, close < 65 ms).',
    upstream_anchor_fr: 'Jeu de barres MT 30 kV du poste source (D04).',
    upstream_anchor_en: '30 kV MV primary substation busbar (D04).',
    downstream_anchor_fr: 'Câble souterrain ou ligne aérienne de l\'artère de distribution (D05).',
    downstream_anchor_en: 'Underground cable or overhead conductor of the distribution feeder (D05).',
    representative_specs: {
      'Tension Nominale': '30 kV eff (Tenue aux chocs 170 kV BIL)',
      'Courant de Courte Durée': '25 kA / 1 s',
      'Séquence de Manœuvre': 'O - 0.3s - CO - 15s - CO',
      'Durée de Vie Mécanique': '10 000 manœuvres (Classe M2)'
    }
  },
  {
    id: 'EQ-TABLEAU-RMU',
    code: 'RMU-COMPACT-36',
    name_fr: 'Tableau Urbain Compact RMU 3 Voies (2L + 1T)',
    name_en: 'Compact 3-Way Ring Main Unit (RMU, 2L + 1T)',
    category: 'RMU',
    voltage_level: '30 kV / 36 kV',
    rated_current: '630 A (voies de ligne) / 200 A (voie transformateur)',
    breaking_capacity: '16 kA / 20 kA (Pouvoir de coupure de boucle et fusibles HPC)',
    standards: ['IEC 62271-200', 'IEC 62271-102', 'IEC 62271-105', 'HN 64-S-41'],
    purpose_fr: 'Appareil compact scellé au cœur des postes de transformation urbains pour sectionner les câbles de boucle et protéger le transformateur.',
    purpose_en: 'Sealed compact switchgear at the core of urban kiosks providing loop-in/loop-out sectionalizing and transformer tee-off protection.',
    operating_principle_fr: 'Interrupteurs-sectionneurs tripolaires à coupure dans le SF6 ou dans l\'air sec avec coupure par fusibles percuteur ou disjoncteur autonome.',
    operating_principle_en: 'Three-pole load-break switches operating in SF6 or technical dry air, combined with striker-pin fuses or self-powered vacuum breaker.',
    physical_construction_fr: 'Cuve monobloc en acier inoxydable austénitique soudée au laser, étanche à vie (IP67), sans maintenance de gaz sur 30 ans.',
    physical_construction_en: 'Laser-welded austenitic stainless steel tank, hermetically sealed for life (IP67), requiring zero gas maintenance over 30 years.',
    components_list_fr: [
      '2 Interrupteurs-sectionneurs de ligne 630 A avec sectionneur de terre',
      '1 Combiné interrupteur-fusibles ou disjoncteur transformateur 200 A',
      'Traversées normalisées DIN 47636 cône extérieur pour prises embrochables étanches',
      'Indicateurs capacitifs de présence de tension (VPIS) sur chaque voie'
    ],
    components_list_en: [
      '2 Line load-break switches (630 A) with integral earthing switches',
      '1 Switch-fuse combination or vacuum circuit breaker for transformer feeder (200 A)',
      'Standardized outer-cone bushings (DIN 47636) for screened separable elbow connectors',
      'Capacitive Voltage Presence Indicating System (VPIS) per phase'
    ],
    protection_fr: 'Protection transformateur par fusibles HPC à percuteur (coupure en < 10 ms sur défaut interne) ou relais auto-alimenté VIP.',
    protection_en: 'Transformer protection via striker-pin HRC fuses (< 10 ms clearance on bolted fault) or VIP self-powered relay.',
    earthing_fr: 'Sectionneurs de terre intégrés interverrouillés par serrures captives (fermeture de terre impossible si l\'interrupteur est fermé).',
    earthing_en: 'Integral earthing switches mechanically key-interlocked to prevent grounding live cables or opening energized tank covers.',
    failure_modes_fr: [
      'Fuite lente de gaz SF6 avec baisse de pression sous le seuil de sécurité',
      'Amorçage diélectrique sur connecteur séparable mal emmanché ou pollué',
      'Fusion d\'un seul fusible créant un régime monophasé anormal sur le transformateur'
    ],
    failure_modes_en: [
      'Slow SF6 gas leakage dropping pressure below the minimum operational threshold',
      'Dielectric breakdown at separable elbow connector due to contamination or improper torquing',
      'Single fuse rupture causing severe unbalanced single-phasing on the transformer'
    ],
    maintenance_fr: 'Contrôle visuel du manomètre de pression, vérification des voyants VPIS et test des verrouillages mécaniques.',
    maintenance_en: 'Visual manometer inspection, VPIS lamp check, and mechanical interlock operational verification.',
    upstream_anchor_fr: 'Câble d\'arrivée de l\'artère de boucle MT (Étape 5).',
    upstream_anchor_en: 'Incoming cable of the MV loop feeder (Stage 5).',
    downstream_anchor_fr: 'Liaison MT embrochable vers le transformateur MT/BT (Étape 7).',
    downstream_anchor_en: 'Screened plug-in cable tail to the MV/LV transformer (Stage 7).',
    representative_specs: {
      'Configuration': '2L + 1T (Deux Lignes + Un Transformateur)',
      'Pression Relative SF6': '0.14 MPa (1.4 bar absolu)',
      'Tenue Arc Interne': 'IAC AFLR 20 kA / 1 s (Échappement arrière ou bas)',
      'Indice de Protection Cuve': 'IP67 / Coffret commande IP3X'
    }
  },
  {
    id: 'EQ-RECLOSER-AERIEN',
    code: 'ACR-POLE-30',
    name_fr: 'Disjoncteur Réenclencheur Aérien (Auto-Recloser)',
    name_en: 'Pole-Mounted Vacuum Auto-Recloser (ACR)',
    category: 'RECLOSER',
    voltage_level: '30 kV (Tenue 170 kV BIL)',
    rated_current: '630 A continu',
    breaking_capacity: '12.5 kA / 16 kA (10 000 cycles de coupure sous vide)',
    standards: ['IEC 62271-111', 'IEEE C37.60'],
    purpose_fr: 'Organe de protection intelligent monté en haut de poteau sur les longues artères aériennes pour éliminer automatiquement les défauts transitoires.',
    purpose_en: 'Intelligent pole-mounted interrupting apparatus deployed along long overhead feeders to clear transient faults without sustained customer blackouts.',
    operating_principle_fr: 'En cas de défaut, l\'appareil déclenche ultra-rapidement, attend une temporisation (temps mort de déionisation d\'arc), puis tente un réenclenchement.',
    operating_principle_en: 'Upon fault inception, it trips instantaneously, pauses for de-ionizing dead time (0.3 s to 2 s), and automatically recloses to test line recovery.',
    physical_construction_fr: 'Cuve en acier inoxydable étanche avec actionneur magnétique bistable sans entretien, isolateurs en résine cycloaliphatique avec capteurs intégrés.',
    physical_construction_en: 'Weatherproof stainless steel tank housing a magnetic actuator mechanism with cycloaliphatic resin epoxy bushings containing embedded sensors.',
    components_list_fr: [
      '3 Ampoules à vide avec actionneur magnétique à aimant permanent',
      'Transformateurs de courant et diviseurs de tension capacitifs moulés dans chaque traversée',
      'Coffret électronique de contrôle-commande IED fixé au pied du support',
      'Modem cellulaire 4G avec protocole DNP3 / IEC 60870-5-104 vers le SCADA'
    ],
    components_list_en: [
      '3 Vacuum interrupters driven by magnetic actuator mechanism',
      'Integrated CTs and capacitive voltage screens molded into bushing resin',
      'Microprocessor controller enclosure mounted at pole base',
      '4G cellular gateway running DNP3 / IEC 60870-5-104 SCADA protocol'
    ],
    protection_fr: 'Algorithmes 50/51/67N, courbe rapide suivie de courbes temporisées, séquence programmable (ex: O - 0.3s - CO - 15s - CO - 30s - CO -> Verrouillage).',
    protection_en: 'ANSI 50/51/67N curves, fast-trip shot followed by delayed curves, programmable sequence up to 4 operations before permanent lockout.',
    earthing_fr: 'Connexion directe de la cuve et des parafoudres à la prise de terre du poteau (R < 5 Ω recherchée).',
    earthing_en: 'Direct bonding of tank and flanking surge arresters to pole grounding electrode (target R < 5 Ω).',
    failure_modes_fr: [
      'Épuisement de la batterie auxiliaire 24 V entraînant l\'incapacité de manœuvrer l\'actionneur',
      'Coup de foudre direct perforant le blindage de l\'isolateur cycloaliphatique',
      'Divergence de mesure des capteurs de tension suite à humidité résiduelle'
    ],
    failure_modes_en: [
      'Auxiliary battery depletion preventing magnetic actuator actuation',
      'Direct lightning strike puncturing cycloaliphatic insulator insulation',
      'Capacitive voltage divider drift caused by internal moisture ingress'
    ],
    maintenance_fr: 'Test de diagnostic à distance via SCADA, remplacement décennal de la batterie plomb étanche ou LiFePO4.',
    maintenance_en: 'Remote diagnostic polling via SCADA, decennial replacement of station control battery (VRLA or LiFePO4).',
    upstream_anchor_fr: 'Tronçon amont de la ligne aérienne 30 kV (Étape 3).',
    upstream_anchor_en: 'Upstream overhead 30 kV line section (Stage 3).',
    downstream_anchor_fr: 'Tronçon aval protégé de l\'artère de distribution (Étape 4/5).',
    downstream_anchor_en: 'Downstream protected segment of the distribution feeder (Stage 4/5).',
    representative_specs: {
      'Tension Nominale': '30 kV (BIL 170 kV)',
      'Pouvoir de Coupure': '16 kA symétrique',
      'Cycle Standard': 'O - 0.3s - CO - 15s - CO - 30s - CO (Lockout)',
      'Autonomie Batterie': '48 heures hors tension réseau'
    }
  },
  {
    id: 'EQ-TRANSFO-DISTRIB',
    code: 'TRAFO-DYN11-630',
    name_fr: 'Transformateur de Distribution MT/BT 630 kVA (30 kV / 400 V)',
    name_en: '630 kVA MV/LV Distribution Transformer (30 kV / 400 V, Dyn11)',
    category: 'TRANSFORMER',
    voltage_level: 'Primaire 30 000 V / Secondaire 400 V - 230 V',
    rated_current: 'Primaire In = 12.1 A / Secondaire In = 909 A',
    breaking_capacity: 'Sans coupure (Tension de court-circuit Ucc = 4.0%)',
    standards: ['IEC 60076', 'EN 50588-1', 'Règlement UE Écoconception 2019/1783'],
    purpose_fr: 'Abaisse la moyenne tension de distribution à la basse tension normalisée pour l\'alimentation des abonnés domestiques, tertiaires et artisanaux.',
    purpose_en: 'Steps down medium-voltage distribution to normalized low-voltage levels for residential, commercial, and light industrial end users.',
    operating_principle_fr: 'Induction électromagnétique mutuelle entre enroulements concentriques en cuivre/aluminium bobinés sur un circuit magnétique à tôles à grains orientés.',
    operating_principle_en: 'Mutual electromagnetic induction across concentric copper/aluminum windings stacked over grain-oriented silicon steel core laminations.',
    physical_construction_fr: 'Cuve étanche à ondes de refroidissement remplie d\'huile minérale diélectrique à remplissage total sous vide.',
    physical_construction_en: 'Hermetically sealed corrugated cooling fin tank fully filled with mineral insulating oil under factory vacuum.',
    components_list_fr: [
      'Circuit magnétique triphasé 3 colonnes à faibles pertes à vide (P0)',
      'Enroulements MT en fil de cuivre émaillé et BT en bande d\'aluminium (feuillard)',
      'Traversées embrochables MT embrochables type cône extérieur (cône 250 A)',
      'Passe-barres BT en porcelaine ou résine pour raccordement direct au tableau TUR'
    ],
    components_list_en: [
      'Three-limb core made of high-permeability grain-oriented silicon steel laminations',
      'Enamelled copper wire MV coils and aluminum foil LV strip windings',
      'Plug-in outer-cone MV bushings (250 A cone size)',
      'Porcelain/resin LV spade terminals for direct bolted connection to TUR board'
    ],
    protection_fr: 'Relais intégré multifonction DGPT2 / DMCR (surpression, émission de gaz, alarme température 85°C et déclenchement 95°C).',
    protection_en: 'Integrated DGPT2 / DMCR relay (tank pressure rise, gas accumulation, oil temperature alarm at 85°C, trip at 95°C).',
    earthing_fr: 'Point neutre secondaire sorti sur borne isolée relié à la prise de terre neutre du poste via barrette déconnectable.',
    earthing_en: 'Secondary neutral point brought out to an insulated bushing connected to neutral earth bar with a test link.',
    failure_modes_fr: [
      'Court-circuit entre spires par vieillissement thermique du papier kraft',
      'Contamination de l\'huile par humidité ou gaz dissous abaissant la tension de claquage',
      'Surpression interne brusque en cas d\'arc interne déformant la cuve'
    ],
    failure_modes_en: [
      'Turn-to-turn insulation breakdown from cellulose paper thermal degradation',
      'Moisture or dissolved gas contamination reducing dielectric breakdown strength below 30 kV',
      'Sudden internal pressure shock wave during bolted arc event deforming corrugated fins'
    ],
    maintenance_fr: 'Analyse chromatographique des gaz dissous (DGA), mesure d\'isolement (> 1000 MΩ), contrôle de la rigidité diélectrique de l\'huile (> 50 kV).',
    maintenance_en: 'Dissolved gas analysis (DGA), insulation resistance megohmmeter (> 1000 MΩ), and oil dielectric breakdown test (> 50 kV).',
    upstream_anchor_fr: 'Voie transformateur du tableau compact RMU (Étape 6).',
    upstream_anchor_en: 'Transformer feeder bay of the compact RMU (Stage 6).',
    downstream_anchor_fr: 'Arrivée basse tension du Tableau Urbain Réduit TUR (Étape 8).',
    downstream_anchor_en: 'Main incoming terminals of the LV distribution board (Stage 8).',
    representative_specs: {
      'Puissance Assignée': '630 kVA (Existe en 100, 160, 250, 400, 1000 kVA)',
      'Couplage': 'Dyn11 (Neutre sorti accessible)',
      'Tension de Court-Circuit': 'Ucc = 4.0% (Pertes en charge Pk = 4600 W)',
      'Régime de Refroidissement': 'ONAN (Circulation naturelle de l\'huile et de l\'air)'
    }
  },
  {
    id: 'EQ-TABLEAU-TUR',
    code: 'TUR-BT-8D',
    name_fr: 'Tableau Urbain Réduit (TUR) 8 Départs BT',
    name_en: '8-Way Low-Voltage Urban Distribution Board (TUR)',
    category: 'LV_BOARD',
    voltage_level: '400 V triphasé / 230 V monophasé',
    rated_current: 'Jeu de barres 1200 A - 1800 A',
    breaking_capacity: 'Pouvoir de coupure des fusibles HPC taille NH2 : 100 kA',
    standards: ['IEC 61439-1', 'IEC 61439-5', 'HN 63-S-61'],
    purpose_fr: 'Répartit la puissance basse tension du transformateur sur plusieurs artères de quartier tout en assurant une protection sélective par fusibles.',
    purpose_en: 'Distributes low-voltage power from the transformer into multiple street feeders while providing selective fuse protection.',
    operating_principle_fr: 'Connexion directe des phases secondaires au jeu de barres collecteur triphasé puis répartition gravitaire protégée par fusibles couteaux HPC à limitation d\'énergie.',
    operating_principle_en: 'Direct connection of secondary transformer phases to the 3-phase busbar spine followed by fuse-protected radial outgoing distribution to street circuits.',
    physical_construction_fr: 'Châssis métallique ouvert monté sur le mur du poste ou en enveloppe fermée isolante avec jeu de barres vertical en cuivre massif.',
    physical_construction_en: 'Open wall-mounted steel frame inside kiosk or modular insulated cabinet with vertical solid copper busbars.',
    components_list_fr: [
      'Arrivée générale transformateur avec barrettes ou interrupteur général 1000 A',
      'Jeu de barres triphasé vertical 4 barres (L1, L2, L3, N)',
      '4 à 8 bases de départs triphasés équipées de fusibles couteaux taille NH1 ou NH2',
      'Prise de terre amovible et tore de mesure du courant de défaut à la terre'
    ],
    components_list_en: [
      'Main incoming bolted disconnect link or 1000 A load-break switch',
      'Vertical 4-bar copper busbar assembly (L1, L2, L3, N)',
      '4 to 8 three-phase outgoing feeder disconnect bases accepting NH1/NH2 blade fuses',
      'Removable grounding link and core-balance zero-sequence earth fault CT'
    ],
    protection_fr: 'Fusibles couteaux HPC type gG (160 A à 400 A) assurant la limitation instantanée des courants de court-circuit en moins de 5 ms.',
    protection_en: 'High-rupturing-capacity (HRC) blade fuses type gG (160 A to 400 A) achieving sub-5 ms fault limitation.',
    earthing_fr: 'Barre de neutre raccordée à la terre du poste par une barrette de sectionnement de terre cadenassable.',
    earthing_en: 'Neutral busbar connected to kiosk grounding grid via a padlockable earth test disconnect link.',
    failure_modes_fr: [
      'Fusion d\'un fusible de phase créant un déséquilibre sévère sur le réseau aval',
      'Échauffement de contact sur une mâchoire de fusible mal serrée (point chaud)',
      'Court-circuit sur barre suite à intrusion de rongeur ou ruissellement d\'eau'
    ],
    failure_modes_en: [
      'Single-phase fuse blowing resulting in severe three-phase voltage unbalance downstream',
      'Contact overheating on degraded fuse jaw clips (thermal hotspot)',
      'Busbar short-circuit caused by rodent intrusion or condensation dripping'
    ],
    maintenance_fr: 'Thermographie infrarouge semestrielle pour détecter les échauffements anormaux, contrôle du serrage au couple dynamométrique.',
    maintenance_en: 'Biannual infrared thermography scanning for contact hotspots, calibrated torque wrench retightening.',
    upstream_anchor_fr: 'Secondaire du transformateur de distribution MT/BT (Étape 7).',
    upstream_anchor_en: 'Secondary terminals of the distribution transformer (Stage 7).',
    downstream_anchor_fr: 'Câbles des départs basse tension rayonnant dans les rues (Étape 9).',
    downstream_anchor_en: 'Low-voltage underground/overhead feeder cables in streets (Stage 9).',
    representative_specs: {
      'Nombre de Départs': '4, 6 ou 8 départs triphasés indépendants',
      'Calibre des Départs': '160 A, 250 A, 400 A (Fusibles gG)',
      'Tenue Diélectrique': '10 kV à fréquence industrielle (1 min)',
      'Forme de Séparation': 'Forme 2b / Indice de protection IP2X façade'
    }
  },
  {
    id: 'EQ-BRANCHEMENT-COMPTAGE',
    code: 'METER-CCPI-AMI',
    name_fr: 'Ensemble Branchement, Coupe-Circuit CCPI & Compteur Intelligent',
    name_en: 'Service Connection Cutout (CCPI) & Smart AMI Energy Meter',
    category: 'METER_SERVICE',
    voltage_level: '230 V monophasé / 400 V triphasé',
    rated_current: 'Calibre 15-45 A, 30-60 A ou 60-90 A',
    breaking_capacity: 'Fusible CCPI : 20 kA sous 400 V',
    standards: ['IEC 62052-11', 'IEC 62053-21', 'EN 50470-3', 'NF C 14-100'],
    purpose_fr: 'Point frontière physique et contractuel de livraison de l\'énergie électrique ; comptage certifié et coupure de protection amont de l\'usager.',
    purpose_en: 'Physical and legal boundary of utility electricity delivery; fiscal certified metering and upstream service protective cutout.',
    operating_principle_fr: 'Mesure numérique bidirectionnelle de la tension instantanée (diviseur résistif) et du courant (shunt ou tore Rogowski), calcul DSP de la puissance P et Q, et télé-transmission chiffrée par CPL/4G.',
    operating_principle_en: 'Bidirectional numerical sampling of instantaneous voltage (resistive divider) and current (shunt or Rogowski coil), DSP computation of active/reactive power, and encrypted remote telemetry via PLC/4G.',
    physical_construction_fr: 'Coffret en matière synthétique isolante auto-extinguible (polycarbonate chargé fibre de verre) scellé par les plombs du distributeur.',
    physical_construction_en: 'Glass-fiber reinforced polycarbonate outdoor enclosure with utility tamper-evident wire security seals.',
    components_list_fr: [
      'Coffret Coupe-Circuit Principal Individuel (CCPI) équipé de fusibles AD (Accompagnement Disjoncteur)',
      'Compteur électronique communicant avec afficheur LCD et relais de coupure interne (contacteur de puissance)',
      'Module de communication CPL (Courant Porteur en Ligne) ou cellulaire GPRS/LTE-M',
      'Bornier de télé-information client (TIC) pour la domotique et la recharge de véhicules électriques'
    ],
    components_list_en: [
      'Customer service cutout fuse box (CCPI) fitted with AD-type cartridge fuses',
      'Electronic bidirectional smart meter with LCD screen and integrated disconnection contactor',
      'Power Line Carrier (PLC G3) or cellular LTE-M communication modem',
      'Customer digital interface port (TIC) for home energy management and EV charging scheduling'
    ],
    protection_fr: 'Fusibles cylindriques AD assurant la tenue au court-circuit amont ; compteur assurant la surveillance des surtensions et du dépassement de puissance.',
    protection_en: 'AD cartridge fuses providing upstream short-circuit backup; meter monitoring overvoltages and contracted kVA thresholds.',
    earthing_fr: 'Le conducteur neutre de distribution est raccordé au bornier amont du compteur sans liaison avec la terre de l\'abonné (régime TT).',
    earthing_en: 'Incoming neutral conductor terminates in meter incoming block with zero direct bond to consumer ground rod (TT system).',
    failure_modes_fr: [
      'Échauffement sur bornes de raccordement suite à mauvais serrage de câble aluminium',
      'Défaut de télécommunication empêchant la relève d\'index à distance',
      'Fusion du fusible CCPI suite à un court-circuit violent en amont du disjoncteur'
    ],
    failure_modes_en: [
      'Terminal overheating from improper torque or creep of aluminum stranded conductor',
      'Telecommunication failure blocking automated meter reading and dynamic tariff updates',
      'CCPI fuse rupture during an intense short-circuit upstream of the consumer breaker'
    ],
    maintenance_fr: 'Vérification métrologique périodique, lecture des journaux d\'événements et contrôle d\'intégrité des scellés anti-fraude.',
    maintenance_en: 'Periodic metrological calibration check, tamper event log retrieval, and anti-fraud seal verification.',
    upstream_anchor_fr: 'Câble de dérivation du réseau BT public (Étape 9).',
    upstream_anchor_en: 'Service drop cable from low-voltage public mains (Stage 9).',
    downstream_anchor_fr: 'Disjoncteur général d\'abonné et TGBT de l\'installation (Étape 10).',
    downstream_anchor_en: 'Main service breaker and consumer distribution board (Stage 10).',
    representative_specs: {
      'Classe de Précision': 'Classe 1 (Énergie Active IEC 62053-21) / Classe 2 (Réactive)',
      'Courant de Base (Imax)': '5(60) A monophasé ou 5(80) A triphasé',
      'Consommation Propre': '< 1 W / 5 VA sur le circuit tension',
      'Protocole Télécom': 'CPL G3-PLC bande CENELEC A ou Bêta radio cellulaire'
    }
  }
];
