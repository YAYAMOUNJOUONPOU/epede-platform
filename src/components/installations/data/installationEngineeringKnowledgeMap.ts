// src/components/installations/data/installationEngineeringKnowledgeMap.ts
// EPEDE D06 - Comprehensive Electrical Installation Engineering Knowledge Model & Taxonomy
// Covers full professional lifecycle from utility incoming supply to terminal utilization, safety, and standards

export interface EngineeringKnowledgeDomain {
  id: string;
  code: string;
  category: 
    | 'SUPPLY_INCOMING'
    | 'SWITCHBOARDS'
    | 'DISTRIBUTION'
    | 'CIRCUITS_LOADS'
    | 'PROTECTION_DEVICES'
    | 'CABLES_ROUTING'
    | 'EARTHING_SAFETY'
    | 'SPECIAL_SYSTEMS'
    | 'LIFECYCLE_OPERATIONS';
  title_fr: string;
  title_en: string;
  subtitle_fr: string;
  subtitle_en: string;
  iconName: string;
  
  // Professional Engineering Detail
  purpose_fr: string;
  purpose_en: string;
  powerPath_fr: string;
  powerPath_en: string;
  protectionFunction_fr: string;
  protectionFunction_en: string;
  measurementFunction_fr: string;
  measurementFunction_en: string;
  earthingNeutralContext_fr: string;
  earthingNeutralContext_en: string;
  safetyImplications_fr: string;
  safetyImplications_en: string;
  maintenanceRequirements_fr: string;
  maintenanceRequirements_en: string;
  failureModes_fr: string[];
  failureModes_en: string[];
  testingRequirements_fr: string;
  testingRequirements_en: string;
  engineeringParameters: { name_fr: string; name_en: string; value: string; unit?: string }[];
  
  // Standardized Professional Metadata
  verificationStatus: 'VERIFIED_IEC' | 'FIELD_VALIDATED' | 'PROVISIONAL';
  sourceReference: string;
  assumptions: string[];
  limitations: string[];
  relatedEquipmentIds: string[];
  relatedSystem: string;
  relatedStandards: string[];
  relatedEngineeringRoles: string[];
  relatedLifecycleActivities: string[];
  targetWorkbenchTab?: string;
}

export const INSTALLATION_ENGINEERING_KNOWLEDGE_MAP: EngineeringKnowledgeDomain[] = [
  // -------------------------------------------------------------------------
  // 1. SUPPLY AND INCOMING SERVICE
  // -------------------------------------------------------------------------
  {
    id: 'domain-01-supply-incoming',
    code: 'D06-SUPPLY',
    category: 'SUPPLY_INCOMING',
    title_fr: 'Alimentation, Point de Livraison & Raccordement Réseau',
    title_en: 'Supply, Service Connection & Incoming Service Interface',
    subtitle_fr: 'Interface distributeur HTA/BT, limite de propriété, comptage fiscal, coupure d\'urgence & calcul d\'impédance amont.',
    subtitle_en: 'Utility MV/LV interface, legal ownership boundary, fiscal metering, emergency isolation & upstream source impedance.',
    iconName: 'Zap',
    
    purpose_fr: 'Assurer la transition sécurisée de l\'énergie depuis le réseau de distribution public (HTA ou BT) vers l\'installation privée, avec comptage tarifaire homologué et sectionnement général de coupure.',
    purpose_en: 'Ensure safe transition of energy from the public distribution network (MV or LV) to the private facility, featuring certified fiscal metering and master emergency disconnection.',
    
    powerPath_fr: 'Réseau Distributeur (HTA ou BT) → Poste de Transformation Client / Coffret CCPI d\'Abonné → Câble d\'Arrivée ou Colonne Montante → Groupe de Comptage (TC + Compteur) → Organe Général de Coupure/Protection (AGCP / Incomer TGBT).',
    powerPath_en: 'Public Distribution Network (MV or LV) → Customer Substation / Service Cutout CCPI → Incoming Feeder / Riser → Metering Group (CTs + Meter) → Master Isolation / Protection Incomer (AGCP / Main TGBT Breaker).',
    
    protectionFunction_fr: 'Protection contre les surintensités majeures du réseau par fusibles HPC (100 kA) ou disjoncteur général équipé de déclencheurs temporisés sélectifs coordonnés avec le distributeur.',
    protectionFunction_en: 'Major fault overcurrent protection via HRC fuses (100 kA) or master incomer breaker with selective time-graded trips coordinated with the public grid operator.',
    
    measurementFunction_fr: 'Mesure 4 quadrants active/réactive (kWh, kvarh), dépassement de puissance souscrite (kW/kVA), analyseur de réseau pour harmoniques et creux de tension.',
    measurementFunction_en: '4-quadrant active/reactive fiscal metering (kWh, kvarh), peak demand monitoring, and power quality analyzer for voltage dips and harmonics.',
    
    earthingNeutralContext_fr: 'Raccordement de la terre du neutre transformateur, création du conducteur neutre N et départ du conducteur de terre vers la Barrette Principale de Terre (BPT). En schéma TT, séparation stricte de la terre des masses et du neutre distributeur.',
    earthingNeutralContext_en: 'Transformer neutral grounding interface, neutral conductor extraction, and earth conductor link to the Main Earth Terminal (MET). Strict separation of client frame earth from distributor neutral in TT systems.',
    
    safetyImplications_fr: 'Risque de court-circuit amont très élevé (Icc jusqu\'à 50-65 kA), tension d\'amorçage et arc flash majeur. Verrouillage mécanique par clé (Ronis/Profalux) avec la cellule HTA.',
    safetyImplications_en: 'Extremely high prospective short-circuit fault levels (Icc up to 50-65 kA), major arc flash hazard. Mechanical key interlocks (Ronis/Profalux) with upstream MV switchgear.',
    
    maintenanceRequirements_fr: 'Contrôle annuel des étalonnages des TC de comptage, vérification thermographique par caméra IR des connexions de tête, dépoussiérage et test de déclenchement mécanique de l\'organe d\'isolement.',
    maintenanceRequirements_en: 'Annual calibration check of metering CTs, infrared thermography of incoming cable lugs, de-dusting, and mechanical trip test of isolation mechanisms.',
    
    failureModes_fr: [
      'Échauffement excessif par desserrage d\'une cosse d\'arrivée sur le jeu de barres',
      'Fusion asymétrique d\'un fusible d\'arrivée HPC provoquant une marche en monophasé',
      'Dérive de mesure ou saturation des transformateurs de courant (TC) sur fort appel de courant',
      'Claquer d\'isolement sur surtension de foudre atmosphérique non déchargée'
    ],
    failureModes_en: [
      'Overheating due to loose incoming cable lug on primary busbar terminal',
      'Asymmetric blowing of one incoming HRC fuse causing single-phasing on downstream loads',
      'Metering drift or saturation of current transformers (CT) under high inrush currents',
      'Dielectric breakdown under atmospheric lightning surge without adequate SPD'
    ],
    
    testingRequirements_fr: 'Mesure de continuité de la liaison équipotentielle principale (≤ 0.1 Ω), vérification de la rigidité diélectrique à 2.2 kV AC, contrôle de l\'ordre des phases (L1-L2-L3).',
    testingRequirements_en: 'Main protective bonding continuity measurement (≤ 0.1 Ω), dielectric withstand test at 2.2 kV AC, phase rotation sequence verification (L1-L2-L3).',
    
    engineeringParameters: [
      { name_fr: 'Tension Nominale d\'Alimentation', name_en: 'Nominal Supply Voltage', value: '400 / 230', unit: 'V' },
      { name_fr: 'Fréquence Assignée', name_en: 'Rated Frequency', value: '50', unit: 'Hz' },
      { name_fr: 'Courant de Court-Circuit Présumé Icc', name_en: 'Prospective Fault Level Icc', value: '25 - 65', unit: 'kA' },
      { name_fr: 'Tension de Tenue aux Chocs Uimp', name_en: 'Impulse Withstand Voltage Uimp', value: '6 - 8', unit: 'kV' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'NF C 14-100 / IEC 60038 / IEC 60364-1',
    assumptions: ['Réseau public triphasé équilibré', 'Poste de livraison implanté à moins de 30m du TGBT'],
    limitations: ['Non applicable aux réseaux continus ou autonomes non raccordés'],
    relatedEquipmentIds: ['eq-01-service-entry', 'eq-02-metering-group', 'eq-03-master-incomer'],
    relatedSystem: 'Réseau de Distribution & Poste de Transformation HTA/BT',
    relatedStandards: ['NF C 14-100', 'IEC 60364-1', 'IEC 60038', 'IEC 60947-2'],
    relatedEngineeringRoles: ['Ingénieur Bureau d\'Études Courants Forts', 'Technicien Concessionnaire Réseau', 'Contrôleur Technique Agréé'],
    relatedLifecycleActivities: ['Raccordement Réseau', 'Mise en Service Initiale', 'Vérification Périodique Réglementaire'],
    targetWorkbenchTab: 'HV_SUBSTATION_CELLS'
  },

  // -------------------------------------------------------------------------
  // 2. MAIN LV SWITCHBOARDS / TGBT
  // -------------------------------------------------------------------------
  {
    id: 'domain-02-main-switchboard-tgbt',
    code: 'D06-TGBT',
    category: 'SWITCHBOARDS',
    title_fr: 'Tableau Général Basse Tension (TGBT) & Ségrégation',
    title_en: 'Main LV Switchboard (TGBT / MSB) & Internal Segregation',
    subtitle_fr: 'Colonnes d\'appareillage, jeux de barres principaux Cu-ETP, formes de séparation (Forme 1 à 4b), Icw et gestion thermique.',
    subtitle_en: 'Switchboard cubicles, Cu-ETP main busbars, internal separation forms (Form 1 to 4b), Icw withstand and thermal management.',
    iconName: 'Box',
    
    purpose_fr: 'Constituer le centre névralgique de distribution électrique de l\'ouvrage, assurant la répartition de la puissance, la commutation des sources, la protection sélective des départs et la sécurité des opérateurs.',
    purpose_en: 'Act as the central electrical distribution node of the facility, providing bulk power dispatch, source changeover, selective feeder protection, and operator safety.',
    
    powerPath_fr: 'Arrivée Source Normale (Transfo) / Secours (GE) → Inverseur de Source (ATS) → Jeu de Barres Principal → Départs Disjoncteurs Boîtier Moulé (MCCB) / Ouverts (ACB) → Départs Tableaux Divisionnaires.',
    powerPath_en: 'Normal Grid Incomer / Standby Generator Incomer → Automatic Transfer Switch (ATS) → Main Busbar Trunk → Outgoing MCCBs / ACBs → Sub-Distribution Panels.',
    
    protectionFunction_fr: 'Protection intégrale contre les surcharges, courts-circuits temporisés (sélectivité chronométrique), défauts d\'isolement différentiels résiduels et limitation de l\'énergie d\'arc électrique (capteurs d\'arc optiques).',
    protectionFunction_en: 'Comprehensive protection against overloads, time-delayed short-circuits (time-graded selectivity), residual earth faults, and arc flash containment (optical arc sensors).',
    
    measurementFunction_fr: 'Centrale de mesure multifonction (P, Q, S, U, I, THD, cos φ, harmoniques par rangs) communicante Modbus/Ethernet raccordée à la GTB/EMS.',
    measurementFunction_en: 'Multifunction energy and power quality meter (P, Q, S, U, I, THD, cos φ, individual harmonics) with Modbus/Ethernet link to BMS/EMS.',
    
    earthingNeutralContext_fr: 'Barre de neutre dimensionnée à 100% ou 200% (si harmoniques H3 prédominants) et barre de protection PE reliée directement à la prise de terre du bâtiment par câble cuivre vert-jaune.',
    earthingNeutralContext_en: 'Neutral busbar sized at 100% or 200% (in heavy 3rd harmonic environments) and PE earth bar bonded directly to the foundation earth ring via copper conductor.',
    
    safetyImplications_fr: 'Formes de séparation 2b, 3b ou 4b permettant l\'intervention sur une unité fonctionnelle sans couper l\'ensemble du tableau, plastrons isolants, volets automatiques de brochage.',
    safetyImplications_en: 'Internal separation forms 2b, 3b, or 4b enabling maintenance on a functional unit without full board outage, insulating escutcheons, automatic withdrawable shutters.',
    
    maintenanceRequirements_fr: 'Serrage des boulons au couple prescrit (DIN 43673 avec vernis témoin rouge), nettoyage des filtres de ventilation forcée, test mécanique et électrique des déclencheurs ACB.',
    maintenanceRequirements_en: 'Torque tightening verification with torque-seal paint (DIN 43673), ventilation filter replacement, mechanical racking and secondary injection testing of ACB trip units.',
    
    failureModes_fr: [
      'Arc électrique interne spontané dû à l\'intrusion d\'un rongeur ou d\'un corps étranger',
      'Surchauffe du jeu de barres par concentration thermique dans un compartiment non ventilé',
      'Soudure des pôles d\'un contacteur de couplage sur défaut de fermeture',
      'Défaillance de l\'automatisme d\'inversion de source bloquant l\'installation sur groupe électrogène'
    ],
    failureModes_en: [
      'Internal arc flash triggered by rodent ingress or forgotten conductive tool',
      'Busbar overheating due to thermal stacking inside unventilated enclosure',
      'Contact welding of changeover contactor upon inrush closing',
      'Automatic transfer switch (ATS) controller failure locking supply onto emergency genset'
    ],
    
    testingRequirements_fr: 'Essais de série constructeur (CEI 61439-1 §11) : rigidité diélectrique (2.2 kV), continuité des masses métalliques (≤ 0.1 Ω), bon fonctionnement des verrouillages mécaniques.',
    testingRequirements_en: 'Routine factory tests (IEC 61439-1 §11): dielectric withstand (2.2 kV), enclosure bonding continuity (≤ 0.1 Ω), functional interlock validation.',
    
    engineeringParameters: [
      { name_fr: 'Courant Assigné d\'Emploi In', name_en: 'Rated Current In', value: '630 - 4000', unit: 'A' },
      { name_fr: 'Courant de Courte Durée Admissible Icw (1s)', name_en: 'Short-Time Withstand Icw (1s)', value: '25 - 65', unit: 'kA' },
      { name_fr: 'Indice de Protection Enveloppe', name_en: 'Enclosure Protection Index', value: 'IP31 - IP54', unit: '' },
      { name_fr: 'Tenue aux Chocs Mécaniques', name_en: 'Mechanical Impact Resistance', value: 'IK08 - IK10', unit: '' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'IEC 61439-1 / IEC 61439-2 / NF C 15-100 §558',
    assumptions: ['Température ambiante moyenne ≤ 35°C', 'Installation en local technique réservé aux personnes habilitées'],
    limitations: ['Requiert un calcul thermique précis (CEI 60890) au-delà de 1600 A'],
    relatedEquipmentIds: ['eq-04-main-busbar', 'eq-05-tgbt-cubicle', 'eq-06-sub-feeder-mccb'],
    relatedSystem: 'Tableaux Généraux & Ensembles d\'Appareillage BT',
    relatedStandards: ['IEC 61439-1', 'IEC 61439-2', 'IEC 60890', 'NF C 15-100'],
    relatedEngineeringRoles: ['Tableautier Constructeur', 'Ingénieur Projeteur Électrotechnique', 'Responsable d\'Exploitation'],
    relatedLifecycleActivities: ['Essais FAT en Atelier', 'Intégration sur Chantier', 'Thermographie Infrarouge Annuelle'],
    targetWorkbenchTab: 'TGBT_ARCHITECTURE'
  },

  // -------------------------------------------------------------------------
  // 3. SUB-MAIN DISTRIBUTION & PANELBOARDS
  // -------------------------------------------------------------------------
  {
    id: 'domain-03-sub-distribution-boards',
    code: 'D06-SUBDIST',
    category: 'DISTRIBUTION',
    title_fr: 'Tableaux Divisionnaires, Armoires d\'Étage & Coffrets Modulaires',
    title_en: 'Sub-Main Distribution Boards, Floor Panels & Modular Enclosures',
    subtitle_fr: 'Décentralisation de l\'énergie, répartition par zones ou usages (CVC, Éclairage, Force, Ondulé), plastrons et réserve 20%.',
    subtitle_en: 'Decentralized power delivery, zoning by service (HVAC, Lighting, Power, UPS), escutcheons and 20% spare capacity.',
    iconName: 'Layers',
    
    purpose_fr: 'Assurer le fractionnement et la distribution de proximité des circuits terminaux au plus près des récepteurs pour limiter les longueurs de câbles et les chutes de tension.',
    purpose_en: 'Provide localized power sub-division to final circuits near loads to minimize circuit lengths and reduce cumulative voltage drops.',
    
    powerPath_fr: 'Câble d\'Alimentation Principal ou Canalis → Interrupteur Sectionneur de Tête / Disjoncteur Général de Tableau → Barres de Pontage / Peignes de Raccordement → Disjoncteurs Divisionnaires (MCB / RCBO) → Circuits Terminaux.',
    powerPath_en: 'Sub-main feeder cable or busduct tap-off → Main Incomer Switch-Disconnector / Board Breaker → Distribution Comb / Busbar Chassis → Miniature Circuit Breakers (MCB / RCBO) → Final Sub-Circuits.',
    
    protectionFunction_fr: 'Protection de tête assurant la sélectivité avec le TGBT, interrupteurs différentiels 30 mA à haute sensibilité pour la sécurité des personnes contre les contacts directs et indirects.',
    protectionFunction_en: 'Incomer device providing selective coordination with upstream TGBT, high-sensitivity 30 mA RCDs for personal protection against direct and indirect touch.',
    
    measurementFunction_fr: 'Sous-comptage modulaire d\'énergie (RT 2012 / RE 2020) par poste : Éclairage, Prises, CVC, Eau Chaude Sanitaire (ECS).',
    measurementFunction_en: 'Modular branch energy sub-metering per statutory codes: Lighting, Small Power, HVAC, Domestic Hot Water (DHW).',
    
    earthingNeutralContext_fr: 'Bornier répartiteur de terre PE en cuivre massif et bornier de neutre N isolé distinct, raccordés au câble amont sans mise à la terre locale en schéma TN-S.',
    earthingNeutralContext_en: 'Solid copper PE earth distribution rail and distinct insulated N neutral block, connected upstream without local re-grounding in TN-S systems.',
    
    safetyImplications_fr: 'Repérage clair et ineffaçable des circuits, présence obligatoire d\'un plastron isolant interdisant tout contact accidentel avec les pièces nues sous tension (IP2X).',
    safetyImplications_en: 'Durable circuit labelling, mandatory insulating dead-front cover preventing accidental contact with live parts (IP2X minimum).',
    
    maintenanceRequirements_fr: 'Vérification semestrielle du bouton de test mécanique T des DDR 30 mA, resserrage des connexions à vis, dépoussiérage des borniers.',
    maintenanceRequirements_en: 'Semi-annual push-to-test button check on all 30 mA RCDs, screw terminal re-torquing, and modular chassis vacuuming.',
    
    failureModes_fr: [
      'Déclenchement intempestif d\'un différentiel 30 mA par accumulation de courants de fuite capacitifs de filtres électroniques',
      'Rupture ou fusion du peigne de raccordement suite à un mauvais enfichage sous la borne à cage',
      'Déséquilibre sévère entre phases provoquant une surcharge de la barre de neutre divisionnaire'
    ],
    failureModes_en: [
      'Nuisance tripping of 30 mA RCD due to cumulative capacitive leakage currents from electronic filter loads',
      'Overheating or melting of pin busbar comb caused by improper seating inside cage clamp terminals',
      'Severe phase load unbalance resulting in overheating of the sub-panel neutral conductor'
    ],
    
    testingRequirements_fr: 'Essai de déclenchement différentiel à 1×IΔn et 5×IΔn avec mesure du temps en millisecondes, contrôle d\'isolement (> 1 MΩ).',
    testingRequirements_en: 'RCD trip testing at 1×IΔn and 5×IΔn with trip time measurement in milliseconds, insulation resistance test (> 1 MΩ).',
    
    engineeringParameters: [
      { name_fr: 'Courant Assigné In', name_en: 'Rated Incomer Current In', value: '40 - 250', unit: 'A' },
      { name_fr: 'Pouvoir de Coupure Assigné Icn', name_en: 'Rated Breaking Capacity Icn', value: '6 - 15', unit: 'kA' },
      { name_fr: 'Réserve Modulaire Disponible', name_en: 'Mandatory Spare Modular Space', value: '20', unit: '%' },
      { name_fr: 'Indice de Protection', name_en: 'Ingress Protection', value: 'IP30 - IP40', unit: '' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'NF C 15-100 §558 & §771 / IEC 61439-3',
    assumptions: ['Installation intérieure en environnement sec et tempéré', 'Accès par du personnel averti ou ordinaire'],
    limitations: ['Limité aux tableaux de distribution destinés à être manœuvrés par des personnes ordinaires (DBO)'],
    relatedEquipmentIds: ['eq-07-distribution-board', 'eq-08-mcbs-modular', 'eq-09-rcd-switches'],
    relatedSystem: 'Tableaux Divisionnaires d\'Étage & Distribution Terminale',
    relatedStandards: ['IEC 61439-3', 'IEC 60898-1', 'IEC 61008-1', 'NF C 15-100'],
    relatedEngineeringRoles: ['Installateur Électricien', 'Responsable de Chantier', 'Vérificateur Réglementaire'],
    relatedLifecycleActivities: ['Pose & Câblage', 'Essais de Continuité & Différentiels', 'Contrôle Consuel'],
    targetWorkbenchTab: 'TGBT_ARCHITECTURE'
  },

  // -------------------------------------------------------------------------
  // 4. FINAL CIRCUITS ENGINEERING
  // -------------------------------------------------------------------------
  {
    id: 'domain-04-final-circuits',
    code: 'D06-CIRCUITS',
    category: 'CIRCUITS_LOADS',
    title_fr: 'Circuits Terminaux & Répartition des Usages',
    title_en: 'Final Circuits & Specialized Utilization Typology',
    subtitle_fr: 'Éclairage, prises de courant 16A/20A, forces motrices CVC, circuits ondulés, IRVE et machines industrielles.',
    subtitle_en: 'Lighting arrays, general 16A/20A socket outlets, HVAC motive power, clean UPS power, EV chargers and machinery.',
    iconName: 'Sliders',
    
    purpose_fr: 'Raccorder chaque appareil utilisateur final à sa protection dédiée, en dimensionnant la canalisation pour respecter le courant admissible Iz et la chute de tension limite.',
    purpose_en: 'Connect each terminal end-use appliance to its dedicated protection device, sizing conductors to satisfy ampacity Iz and allowable voltage drop limits.',
    
    powerPath_fr: 'Disjoncteur Divisionnaire / Disjoncteur Différentiel (RCBO) → Câble Cuivre ou Conduits Encastrés → Organe de Commande (Interrupteur, Télérupteur, Contacteur) → Récepteur Terminal.',
    powerPath_en: 'Branch Miniature Circuit Breaker / RCBO → Copper Cable or Conduit Run → Switching Device (Switch, Latching Relay, Contactor) → Terminal Load.',
    
    protectionFunction_fr: 'Protection contre les surcharges par bilame thermique, contre les courts-circuits par déclencheur magnétique (Courbe B, C ou D selon le courant d\'appel) et protection différentielle 30 mA.',
    protectionFunction_en: 'Overload protection via bimetallic strip, short-circuit protection via electromagnetic trip (Curve B, C, or D based on inrush), and 30 mA earth leakage protection.',
    
    measurementFunction_fr: 'Mesure périodique de l\'appel de courant et de la chute de tension réelle sous pleine charge.',
    measurementFunction_en: 'Periodic operating load current measurement and real full-load voltage drop verification.',
    
    earthingNeutralContext_fr: 'Conducteur de protection PE vert-jaune acheminé obligatoirement jusqu\'à chaque point lumineux et socle de prise, même si le luminaire est de classe II.',
    earthingNeutralContext_en: 'Mandatory green-yellow PE protective conductor routed to every light point and socket outlet, even for Class II luminaires.',
    
    safetyImplications_fr: 'Limitation du nombre de points par circuit (max 8 prises sur 1.5 mm², 12 sur 2.5 mm² en NF C 15-100), débrochabilité et sécurité des enfants par obturateurs d\'alvéoles.',
    safetyImplications_en: 'Point count limitation per circuit (max 8 sockets on 1.5 mm², 12 on 2.5 mm² per standard), child-safety shuttered socket mechanisms.',
    
    maintenanceRequirements_fr: 'Contrôle d\'échauffement des bornes automatiques (Wago), vérification de la présence de la terre au testeur de boucle de prise.',
    maintenanceRequirements_en: 'Thermal inspection of screwless spring-cage terminals (Wago), plug-in socket ground presence loop test.',
    
    failureModes_fr: [
      'Court-circuit entre conducteurs par perforation accidentelle lors de travaux de percement de cloison',
      'Échauffement et carbonisation d\'une prise par mauvais serrage ou utilisation d\'appareils surpuissants sur multiprise',
      'Déclenchement intempestif sur appel de charge capacitif (drivers LED massifs) ou inductif (démarrage compresseur)'
    ],
    failureModes_en: [
      'Phase-to-neutral short-circuit caused by accidental wall drilling during building renovation',
      'Overheating and charring of socket contacts due to loose screw or daisy-chained multi-plugs',
      'Nuisance magnetic tripping on capacitor inrush (large LED driver arrays) or motor starting (compressors)'
    ],
    
    testingRequirements_fr: 'Contrôle de continuité du PE à chaque prise (< 0.2 Ω), mesure d\'isolement entre conducteurs actifs (> 0.5 MΩ ou 1.0 MΩ).',
    testingRequirements_en: 'Protective conductor continuity to every outlet (< 0.2 Ω), insulation resistance between active conductors (> 0.5 MΩ or 1.0 MΩ).',
    
    engineeringParameters: [
      { name_fr: 'Calibre Protection Éclairage', name_en: 'Lighting Protection Rating', value: '10 - 16', unit: 'A' },
      { name_fr: 'Calibre Protection Prises 16A', name_en: 'Socket Outlet Protection', value: '16 - 20', unit: 'A' },
      { name_fr: 'Chute de Tension Max Éclairage', name_en: 'Max Voltage Drop (Lighting)', value: '3.0', unit: '%' },
      { name_fr: 'Chute de Tension Max Autres Usages', name_en: 'Max Voltage Drop (Other Loads)', value: '5.0', unit: '%' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'NF C 15-100 §525, §771 / IEC 60364-5-52',
    assumptions: ['Conducteurs en cuivre à isolation PVC ou PR (70°C / 90°C)', 'Circuits monophasés 230V ou triphasés 400V'],
    limitations: ['Les sections doivent être majorées si la canalisation traverse un isolant thermique'],
    relatedEquipmentIds: ['eq-10-circuit-lighting', 'eq-11-circuit-power-sockets', 'eq-12-circuit-hvac'],
    relatedSystem: 'Canalisations Terminales & Points d\'Utilisation',
    relatedStandards: ['NF C 15-100', 'IEC 60364-5-52', 'IEC 60898-1'],
    relatedEngineeringRoles: ['Technicien d\'Installation', 'Électricien Tertiaire', 'Contrôleur Consuel'],
    relatedLifecycleActivities: ['Tirage de Câbles', 'Raccordement Appareillage', 'Vérification Initiale'],
    targetWorkbenchTab: 'CHECKS_SCHEDULES'
  },

  // -------------------------------------------------------------------------
  // 5. PROTECTIVE DEVICES & SELECTIVITY HIERARCHY
  // -------------------------------------------------------------------------
  {
    id: 'domain-05-protective-devices',
    code: 'D06-PROT',
    category: 'PROTECTION_DEVICES',
    title_fr: 'Appareillages de Protection & Coordination Sélective',
    title_en: 'Protective Devices, Discrimination & Coordination Hierarchy',
    subtitle_fr: 'Disjoncteurs ACB, MCCB, MCB, différentiels DDR, fusibles HPC, sélectivité ampèremétrique, chronométrique & filiation.',
    subtitle_en: 'ACBs, MCCBs, MCBs, RCDs, HRC fuses, current/time discrimination, cascading & zone interlocking (ZSI).',
    iconName: 'ShieldAlert',
    
    purpose_fr: 'Détecter instantanément ou de manière temporisée tout défaut électrique anormal (surcharge, court-circuit, défaut à la masse) et n\'éliminer que le tronçon en défaut sans priver d\'énergie le reste de l\'installation.',
    purpose_en: 'Detect any abnormal condition (overload, short-circuit, earth fault) and trip only the faulted circuit section, preserving uninterrupted supply to healthy areas.',
    
    powerPath_fr: 'Amont Réseau → Déclencheur Électronique / Magnéto-Thermique → Contacts Principaux & Chambres de Coupure (De-ion) → Aval Installation.',
    powerPath_en: 'Upstream Feeder → Electronic / Magneto-Thermal Trip Unit → Main Arcing Contacts & De-ion Arc Chutes → Downstream Distribution.',
    
    protectionFunction_fr: 'Quatre fonctions fondamentales : Protection contre les surintensités (L, S, I), protection de terre (G), coupure omnipolaire simultanée, et sectionnement visible de sécurité.',
    protectionFunction_en: 'Four fundamental missions: Overcurrent protection (L, S, I), earth fault protection (G), all-pole simultaneous disconnection, and positive isolation indication.',
    
    measurementFunction_fr: 'Mesure de courant par tore Rogowski ou TC intégré dans les déclencheurs électroniques (Micrologic / Ekip), enregistrement de l\'historique des défauts et forme d\'onde.',
    measurementFunction_en: 'Current measurement via integrated Rogowski coils or CTs inside electronic trip units, event logging and waveform capture upon trip.',
    
    earthingNeutralContext_fr: 'Protection du pôle de neutre à 0%, 50%, 100% ou 200% selon la charge en harmoniques de rang 3, sensibilité différentielle adaptée au régime de neutre (TT : 300mA/30mA, TN : magnétique court).',
    earthingNeutralContext_en: 'Neutral pole protection at 0%, 50%, 100%, or 200% according to triplen harmonic loading, RCD thresholds matched to earthing type (TT: 300mA/30mA, TN: instantaneous magnetic).',
    
    safetyImplications_fr: 'Pouvoir de coupure Icu obligatoirement supérieur au court-circuit présumé au point d\'installation (sauf en cas de filiation/cascading constructeur homologué).',
    safetyImplications_en: 'Breaking capacity Icu strictly superior to the prospective short-circuit level at the installation point (unless verified manufacturer cascading is applied).',
    
    maintenanceRequirements_fr: 'Injection secondaire pour tester les courbes de déclenchement, contrôle de l\'usure des contacts d\'arc, graissage des mécanismes de commande motorisée.',
    maintenanceRequirements_en: 'Secondary current injection to calibrate trip curves, arc contact erosion inspection, mechanism lubrication on motorized trip gear.',
    
    failureModes_fr: [
      'Refus d\'ouverture d\'un disjoncteur par grippage mécanique provoquant l\'ouverture de l\'amont (perte de sélectivité)',
      'Déclenchement intempestif dû à un seuil magnétique trop bas face au courant d\'enclenchement d\'un transformateur',
      'Explosion de la chambre de coupure si l\'énergie de court-circuit dépasse le pouvoir de coupure Icu'
    ],
    failureModes_en: [
      'Failure to trip due to sticky operating mechanism causing upstream breaker cascade trip (loss of selectivity)',
      'Spurious tripping because magnetic threshold is set too low for transformer magnetizing inrush current',
      'Arc chute blowout explosion if short-circuit energy exceeds rated breaking capacity Icu'
    ],
    
    testingRequirements_fr: 'Validation par courbes I-t superposées, vérification de non-chevauchement des tolérances de déclenchement thermique et magnétique.',
    testingRequirements_en: 'Time-current curve overlay analysis verifying non-overlapping tolerance bands between upstream and downstream devices.',
    
    engineeringParameters: [
      { name_fr: 'Pouvoir de Coupure Icu / Icn', name_en: 'Breaking Capacity Icu / Icn', value: '10 - 150', unit: 'kA' },
      { name_fr: 'Pouvoir de Coupure de Service Ics', name_en: 'Service Breaking Capacity Ics', value: '75 - 100', unit: '% Icu' },
      { name_fr: 'Temps de Coupure Instantané', name_en: 'Instantaneous Break Time', value: '< 20', unit: 'ms' },
      { name_fr: 'Courbe de Déclenchement MCB', name_en: 'MCB Trip Curves', value: 'B (3-5 In), C (5-10 In), D (10-14 In)', unit: '' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'IEC 60947-2 / IEC 60898-1 / NF C 15-100 §535',
    assumptions: ['Coordination sélective totale ou partielle jusqu\'au seuil limite Is', 'Tableaux de coordination constructeurs'],
    limitations: ['La filiation n\'est autorisée que si le fabricant garantit les associations testées en laboratoire'],
    relatedEquipmentIds: ['eq-03-master-incomer', 'eq-06-sub-feeder-mccb', 'eq-08-mcbs-modular'],
    relatedSystem: 'Chaîne de Protection & Coordination Électrique',
    relatedStandards: ['IEC 60947-2', 'IEC 60898-1', 'IEC 61009-1', 'NF C 15-100'],
    relatedEngineeringRoles: ['Ingénieur Calculs Électriques', 'Expert Protection et Sélectivité', 'Technicien de Maintenance'],
    relatedLifecycleActivities: ['Étude de Sélectivité', 'Réglage des Déclencheurs', 'Injection Périodique'],
    targetWorkbenchTab: 'SELECTIVITY_COORDINATION'
  },

  // -------------------------------------------------------------------------
  // 6. CABLES, CONDUCTORS & ROUTING
  // -------------------------------------------------------------------------
  {
    id: 'domain-06-cables-containment',
    code: 'D06-CABLES',
    category: 'CABLES_ROUTING',
    title_fr: 'Câbles, Conducteurs, Chemins de Câbles & Conduits',
    title_en: 'Cables, Conductors, Containment & Cable Routing Methods',
    subtitle_fr: 'Âmes cuivre/aluminium, isolations PVC/XLPE, câbles CR1-C1 résistants au feu, pose sur chemins de câbles, caniveaux & facteurs k.',
    subtitle_en: 'Copper/aluminum conductors, PVC/XLPE insulation, fire-resistant CR1-C1 cables, cable trays, ducts & derating factors k.',
    iconName: 'Network',
    
    purpose_fr: 'Transporter l\'énergie électrique en toute sécurité avec des pertes minimales, en résistant aux agressions mécaniques, thermiques et chimiques de l\'environnement d\'installation.',
    purpose_en: 'Safely convey electric power with minimal losses while resisting mechanical, thermal, and chemical environmental stresses.',
    
    powerPath_fr: 'Bornes Amont Appareillage → Cosses Bimétalliques Serrées → Câbles en Chemins de Câbles / Conduits → Presse-Étoupes / Entrées Étanche → Bornes Aval Récepteur.',
    powerPath_en: 'Upstream Switchgear Lugs → Crimped Terminals → Cables on Cable Trays / Conduits → Cable Glands → Downstream Equipment Terminals.',
    
    protectionFunction_fr: 'Isolation diélectrique étanche évitant les fuites de courant et les contacts avec les masses, blindage électromagnétique contre les interférences (CEM), tenue au feu sans halogène (C1 / LSZH).',
    protectionFunction_en: 'Dielectric insulation preventing earth leakage and shock hazards, electromagnetic shielding against EMI, halogen-free fire retardance (LSZH / CPR Cca-s1,d1,a1).',
    
    measurementFunction_fr: 'Contrôle thermique par thermographie infrarouge ou sondes à fibre optique réparties (DTS) sur les câbles de forte puissance.',
    measurementFunction_en: 'Infrared thermographic inspections and distributed fiber optic temperature sensing (DTS) on heavy feeder cables.',
    
    earthingNeutralContext_fr: 'Section du neutre égale à la phase jusqu\'à 16 mm² cuivre (35 mm² aluminium). Au-delà, réduction autorisée à 50% sous condition d\'absence de charges déformantes.',
    earthingNeutralContext_en: 'Neutral cross-section equal to phase up to 16 mm² copper (35 mm² aluminum). Beyond, reduction to 50% permitted provided 3rd harmonic content is below 15%.',
    
    safetyImplications_fr: 'Calcul rigoureux du courant admissible corrigé Iz = I0 · k1 · k2 · k3. Risque d\'incendie par échauffement en cas de surcharge prolongée si les facteurs de groupement sont omis.',
    safetyImplications_en: 'Rigorous calculation of corrected ampacity Iz = I0 · k1 · k2 · k3. Fire hazard from conductor thermal runaway if grouping factors are neglected.',
    
    maintenanceRequirements_fr: 'Inspection visuelle de l\'intégrité des gaines, respect du rayon de courbure minimal (≥ 6 à 8 fois le diamètre extérieur), vérification des coupe-feux de traversée.',
    maintenanceRequirements_en: 'Visual sheath integrity check, minimum bending radius compliance (≥ 6 to 8 times cable OD), inspection of firestop penetrations.',
    
    failureModes_fr: [
      'Fusion de l\'isolant par échauffement cumulatif dû à un empilage excessif de câbles sur chemin de câbles perforé',
      'Dégradation prématurée sous l\'effet des rayons UV ou d\'hydrocarbures sur gaine PVC non adaptée',
      'Rupture du conducteur neutre par traction mécanique excessive lors du tirage dans les coudes'
    ],
    failureModes_en: [
      'Insulation meltdown from thermal stacking due to excessive bunching on perforated cable trays',
      'Premature sheath embrittlement and cracking under outdoor UV or chemical exposure with standard PVC',
      'Mechanical severance of neutral core due to excessive pulling tension during duct installation'
    ],
    
    testingRequirements_fr: 'Mesure de résistance d\'isolement (> 100 MΩ sous 1000V DC), essai de continuité des conducteurs de phase et de terre PE (< 0.1 Ω).',
    testingRequirements_en: 'Insulation resistance test (> 100 MΩ at 1000V DC), phase and PE protective conductor continuity verification (< 0.1 Ω).',
    
    engineeringParameters: [
      { name_fr: 'Température Max Âme PVC', name_en: 'Max Conductor Temp (PVC)', value: '70', unit: '°C' },
      { name_fr: 'Température Max Âme XLPE/PR', name_en: 'Max Conductor Temp (XLPE)', value: '90', unit: '°C' },
      { name_fr: 'Résistivité Cuivre à 20°C', name_en: 'Copper Resistivity @ 20°C', value: '0.01724', unit: 'Ω·mm²/m' },
      { name_fr: 'Résistivité Cuivre à Chaud', name_en: 'Operating Copper Resistivity', value: '0.0225', unit: 'Ω·mm²/m' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'IEC 60287 / IEC 60364-5-52 / NF C 15-100 Tableau 52',
    assumptions: ['Pose sous conduits, caniveaux ou chemins de câbles selon méthodes normalisées', 'Température ambiante de référence 30°C'],
    limitations: ['Les câbles de sécurité incendie (CR1) doivent disposer d\'attestations d\'essais au feu conformes (NF C 32-070)'],
    relatedEquipmentIds: ['eq-07-sub-feeders', 'eq-13-busduct-canalis'],
    relatedSystem: 'Canalisations & Systèmes de Pose',
    relatedStandards: ['IEC 60287', 'IEC 60364-5-52', 'NF C 15-100', 'EN 50575 (CPR)'],
    relatedEngineeringRoles: ['Ingénieur Dimensionnement Câbles', 'Chef d\'Équipe Tirage Câble', 'Coordinateur SSI'],
    relatedLifecycleActivities: ['Calepinage & Pose', 'Tirage & Raccordement', 'Mesure Diélectrique'],
    targetWorkbenchTab: 'CHECKS_SCHEDULES'
  },

  // -------------------------------------------------------------------------
  // 7. EARTHING, BONDING & NEUTRAL SYSTEMS
  // -------------------------------------------------------------------------
  {
    id: 'domain-07-earthing-bonding',
    code: 'D06-EARTH',
    category: 'EARTHING_SAFETY',
    title_fr: 'Mise à la Terre, Liaisons Équipotentielles & Régimes de Neutre',
    title_en: 'Earthing, Equipotential Bonding & Neutral Earthing Systems',
    subtitle_fr: 'Schémas TT, TN-S, TN-C, IT, boucle à fond de fouille, tension de contact Uc ≤ 50V, liaison équipotentielle principale (LEP).',
    subtitle_en: 'TT, TN-S, TN-C, IT systems, foundation earth loop, touch voltage Uc ≤ 50V, main equipotential bonding (MEB).',
    iconName: 'Scale',
    
    purpose_fr: 'Fixer le potentiel des masses métalliques à celui de la terre pour écouler les courants de défaut et de foudre sans danger pour les occupants, et permettre le déclenchement des protections.',
    purpose_en: 'Bond all metal frames to earth potential to drain fault currents and lightning surges without human hazard, ensuring fast protective device clearance.',
    
    powerPath_fr: 'Conducteur Phase en Défaut → Masse Métallique Électrique → Conducteur PE → Barrette Principale de Terre (BPT) → Prise de Terre / Boucle en Fond de Fouille → Retour Source.',
    powerPath_en: 'Faulted Phase Conductor → Equipment Metal Frame → Protective Earth Conductor (PE) → Main Earthing Terminal (MET) → Earth Electrode / Ground Ring → Source Neutral.',
    
    protectionFunction_fr: 'Maintien de la tension de contact en dessous de la limite conventionnelle de sécurité (UL = 50 V en local sec, 25 V en local mouillé), déclenchement en moins de 0.4s en TN (230V).',
    protectionFunction_en: 'Holding touch voltage below standard safety thresholds (UL = 50 V dry, 25 V wet locations), automatic disconnection within 0.4s in TN 230V systems.',
    
    measurementFunction_fr: 'Mesure de résistance de terre par méthode des 3 piquets (méthode de Wenner / 62%), mesure d\'impédance de boucle de défaut de boucle de terre (Zs).',
    measurementFunction_en: 'Earth electrode resistance measurement via 3-point fall-of-potential (Wenner / 62% method), fault loop impedance testing (Zs).',
    
    earthingNeutralContext_fr: 'Choix fondamental : TT (sécurité simple par DDR, standard résidentiel), TN-S (continuité de service tertiaire, défaut franc en court-circuit), IT (continuité absolue au premier défaut pour hôpitaux/usines).',
    earthingNeutralContext_en: 'Fundamental design selection: TT (simple RCD protection, standard residential), TN-S (high continuity in commercial, metallic short-circuit fault), IT (full continuity on first fault for hospitals/plants).',
    
    safetyImplications_fr: 'Interdiction absolue du conducteur PEN (TN-C) pour des sections inférieures à 10 mm² cuivre (16 mm² alu), et interdiction formelle en aval d\'un TN-S ou d\'un DDR.',
    safetyImplications_en: 'Strict prohibition of PEN conductor (TN-C) below 10 mm² Cu (16 mm² Al), and absolute ban downstream of a TN-S section or any RCD.',
    
    maintenanceRequirements_fr: 'Contrôle annuel de la valeur de la prise de terre à la barrette de coupure ouverte, contrôle de continuité des liaisons équipotentielles sur canalisations d\'eau et de gaz.',
    maintenanceRequirements_en: 'Annual earth electrode resistance testing with disconnected test link, continuity verification of bonding to metal water/gas pipelines.',
    
    failureModes_fr: [
      'Rupture ou corrosion sous terre de la liaison entre la barrette de terre et l\'électrode en cuivre',
      'Interversion accidentelle entre conducteur neutre N et conducteur de protection PE en schéma TN-S',
      'Non-détection d\'un premier défaut d\'isolement en schéma IT par absence de Contrôleur Permanent d\'Isolement (CPI)'
    ],
    failureModes_en: [
      'Corrosion or severance of underground copper tape bonding to the buried earth grid',
      'Accidental swap between neutral N and protective PE conductors in a TN-S installation',
      'Undetected first earth fault in IT network due to missing or defective Insulation Monitoring Device (IMD)'
    ],
    
    testingRequirements_fr: 'Résistance de terre RA ≤ 100 Ω en schéma TT (avec DDR 500mA) ou ≤ 10 Ω en tertiaire, continuité LEP ≤ 0.1 Ω.',
    testingRequirements_en: 'Earth electrode resistance RA ≤ 100 Ω in TT (with 500mA RCD) or ≤ 10 Ω in commercial facilities, bonding continuity ≤ 0.1 Ω.',
    
    engineeringParameters: [
      { name_fr: 'Tension Limite de Contact UL', name_en: 'Conventional Touch Limit UL', value: '50 (sec) / 25 (humide)', unit: 'V' },
      { name_fr: 'Résistance Prise de Terre Recommandée', name_en: 'Recommended Earth Resistance', value: '< 10', unit: 'Ω' },
      { name_fr: 'Temps de Coupure Max (TN 230V)', name_en: 'Max Disconnection Time (TN 230V)', value: '0.4', unit: 's' },
      { name_fr: 'Section Min Conducteur Terre Cuivre', name_en: 'Min Bare Copper Earth Ring', value: '25', unit: 'mm²' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'IEC 60364-4-41 / IEC 60364-5-54 / NF C 15-100 Titre 4 & 5',
    assumptions: ['Sol homogène avec résistivité moyenne estimée à 100 Ω·m', 'Présence d\'une boucle en fond de fouille ceinturant le bâtiment'],
    limitations: ['En sol rocheux très sec, des forages profonds ou des puits de terre multiples sont indispensables'],
    relatedEquipmentIds: ['eq-05-earthing-busbar', 'eq-09-rcd-switches'],
    relatedSystem: 'Systèmes de Mise à la Terre & Équipotentialité',
    relatedStandards: ['IEC 60364-4-41', 'IEC 60364-5-54', 'NF C 15-100', 'IEEE 80'],
    relatedEngineeringRoles: ['Ingénieur Sécurité Électrique', 'Contrôleur Consuel / Bureau de Contrôle', 'Technicien Mesures'],
    relatedLifecycleActivities: ['Pose Fond de Fouille', 'Audit de Terre Périodique', 'Test de Boucle de Défaut'],
    targetWorkbenchTab: 'EARTHING_TOUCH_VOLTAGE'
  },

  // -------------------------------------------------------------------------
  // 8. CRITICAL POWER, GENERATOR, ATS & UPS
  // -------------------------------------------------------------------------
  {
    id: 'domain-08-critical-power-ups-ge',
    code: 'D06-CRITICAL',
    category: 'SPECIAL_SYSTEMS',
    title_fr: 'Alimentations Sans Interruption (ASI/UPS), Groupes & Inverseurs',
    title_en: 'Critical Power Architecture, Standby Genset, ATS & Online UPS',
    subtitle_fr: 'Groupes électrogènes diesel, inverseurs automatiques Normal/Secours (ATS), onduleurs double conversion VFI, bypass statique.',
    subtitle_en: 'Diesel standby generators, automatic transfer switches (ATS), double-conversion online UPS (VFI), static maintenance bypass.',
    iconName: 'Cpu',
    
    purpose_fr: 'Garantir la continuité totale de fourniture électrique aux charges névralgiques (salles serveurs, blocs opératoires, systèmes de désenfumage) lors d\'une défaillance du réseau public.',
    purpose_en: 'Guarantee uninterrupted power supply to mission-critical loads (data centers, surgical rooms, smoke extraction fans) during public grid outages.',
    
    powerPath_fr: 'Réseau Normal / Groupe Électrogène → Inverseur de Source Motorisé (ATS) → Onduleur ASI (Redresseur → Batterie → Onduleur) → Tableau Secouru / Ondulé → Charges Critiques.',
    powerPath_en: 'Normal Grid / Diesel Genset → Motorized Transfer Switch (ATS) → Online UPS (Rectifier → Battery DC Bus → Inverter) → Clean Critical Panel → Mission Loads.',
    
    protectionFunction_fr: 'Protection galvanique par transformateurs d\'isolement, commutation synchrone sans coupure via commutateur statique (Static Switch < 2 ms), délestage automatique des charges non prioritaires.',
    protectionFunction_en: 'Galvanic isolation via dedicated transformers, no-break seamless static transfer (< 2 ms), automatic load shedding of non-essential feeders.',
    
    measurementFunction_fr: 'Surveillance en temps réel de l\'état de charge des batteries (SoC, SoH), température des cellules, tension DC du bus, taux de distorsion THDu en sortie d\'onduleur.',
    measurementFunction_en: 'Real-time battery monitoring (SoC, SoH), cell temperature, DC bus voltage, output voltage distortion THDu under non-linear loads.',
    
    earthingNeutralContext_fr: 'Gestion délicate du neutre lors du basculement : utilisation d\'un ATS à 4 pôles avec coupure du neutre pour éviter les boucles de terre ou ATS avec pôle de neutre à coupure avancée/chevauchante.',
    earthingNeutralContext_en: 'Critical neutral management during transfer: 4-pole ATS with switched neutral to avoid circulating earth loops, or overlapping neutral transition.',
    
    safetyImplications_fr: 'Présence de tensions dangereuses même tableau général coupé (retour par onduleur ou groupe). Procédure de consigne rigoureuse avec sectionneur bypass verrouillé par clé.',
    safetyImplications_en: 'Dangerous voltages present even after main incomer trip (backfeed risk from UPS or genset). Strict LOTO procedures with Castell key mechanical interlocks.',
    
    maintenanceRequirements_fr: 'Démarrage mensuel du groupe électrogène en charge sur banc de charge résistif, test semestriel de décharge des batteries d\'onduleurs, remplacement préventif des ventilateurs.',
    maintenanceRequirements_en: 'Monthly diesel genset test run under resistive load bank, semi-annual UPS battery discharge test, preventive capacitor and fan replacement.',
    
    failureModes_fr: [
      'Non-démarrage du groupe électrogène sur défaut de batterie de démarrage 24V ou colmatage filtre gazole',
      'Défaillance d\'une cellule de batterie entraînant la mise en rideau de l\'onduleur lors de la coupure secteur',
      'Surcharge de l\'onduleur au démarrage de moteurs entraînant un transfert non désiré sur bypass réseau'
    ],
    failureModes_en: [
      'Genset failure to crank caused by depleted 24V starter battery or clogged diesel fuel filter',
      'Premature battery cell failure collapsing the DC link upon sudden utility blackout',
      'UPS inverter overload on motor starting inrush causing unwanted transfer to bypass line'
    ],
    
    testingRequirements_fr: 'Test d\'inversion de source en vraie grandeur, mesure du temps de reprise groupe (< 15s), contrôle de la stabilité de fréquence (50 Hz ± 0.5 Hz).',
    testingRequirements_en: 'Full-scale simulated blackout changeover test, genset pick-up time measurement (< 15s), frequency stability verification (50 Hz ± 0.5 Hz).',
    
    engineeringParameters: [
      { name_fr: 'Temps de Transfert Onduleur (VFI)', name_en: 'UPS Transfer Time (VFI)', value: '0 (Sans coupure)', unit: 'ms' },
      { name_fr: 'Délai Démarrage & Prise de Charge GE', name_en: 'Genset Start & Step Load Pick-up', value: '10 - 15', unit: 's' },
      { name_fr: 'Autonomie Batterie Typique', name_en: 'Typical Battery Autonomy', value: '10 - 60', unit: 'min' },
      { name_fr: 'Rendement Onduleur Double Conversion', name_en: 'Double Conversion UPS Efficiency', value: '95 - 97', unit: '%' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'IEC 62040-3 (VFI-SS-111) / ISO 8528 / NF C 15-100 §551',
    assumptions: ['Carburant gazole de réserve assurant au moins 24h à 48h d\'autonomie continue', 'Local onduleur climatisé à 20-22°C pour préserver la durée de vie des batteries'],
    limitations: ['Les moteurs à fort courant d\'appel ne doivent pas être raccordés sur onduleur sans surdimensionnement majeur'],
    relatedEquipmentIds: ['eq-14-ups-converter', 'eq-15-diesel-generator', 'eq-16-ats-switch'],
    relatedSystem: 'Systèmes d\'Alimentation de Secours & Sans Coupure',
    relatedStandards: ['IEC 62040-3', 'ISO 8528', 'NF C 15-100 §551', 'NF S 61-940'],
    relatedEngineeringRoles: ['Ingénieur Datacenter / Milieu Critique', 'Technicien Groupes Électrogènes', 'Responsable Maintenance CVC/Élec'],
    relatedLifecycleActivities: ['Essai Blackout Périodique', 'Remplacement Banc Batteries', 'Maintenance Filtres & Injecteurs'],
    targetWorkbenchTab: 'UPS_BATTERY_AUTONOMY'
  },

  // -------------------------------------------------------------------------
  // 9. LIGHTING SYSTEMS & ARCHITECTURAL ILLUMINATION
  // -------------------------------------------------------------------------
  {
    id: 'domain-09-lighting-systems',
    code: 'D06-LIGHT',
    category: 'CIRCUITS_LOADS',
    title_fr: 'Systèmes d\'Éclairage, Gestion DALI & Éclairage de Sécurité',
    title_en: 'Lighting Systems, DALI Control & Emergency Lighting (BAES)',
    subtitle_fr: 'Luminaires LED, gradation DALI-2, détecteurs de présence, blocs autonomes d\'éclairage de sécurité (BAES) et source centrale.',
    subtitle_en: 'Commercial LED luminaires, DALI-2 bus dimming, presence sensors, self-contained emergency lights (BAES) and central battery units.',
    iconName: 'Sun',
    
    purpose_fr: 'Assurer le confort visuel, le respect des niveaux d\'éclairement réglementaires (EN 12464-1), l\'évacuation sécurisée en cas de panne secteur, et l\'efficacité énergétique par gradation automatique.',
    purpose_en: 'Ensure visual comfort, compliance with statutory illuminance levels (EN 12464-1), safe egress evacuation during blackouts, and maximum energy efficiency through daylight-linked dimming.',
    
    powerPath_fr: 'Tableau Éclairage (TD-ECL) → Disjoncteur 10A/16A + DDR 30mA → Actionneur / Passerelle DALI / Télérupteur → Ligne d\'Éclairage 3G1.5 / 5G1.5 → Drivers LED & BAES.',
    powerPath_en: 'Lighting Panel (LP) → 10A/16A MCB + 30mA RCD → DALI Gateway / Latching Relay → 3G1.5 / 5G1.5 Distribution Cable → LED Drivers & Emergency Exit Luminaires.',
    
    protectionFunction_fr: 'Protection contre les surcharges et courts-circuits par disjoncteurs Courbe C ou B. Prise en compte impérative du courant d\'appel capacitif des drivers LED (Iinrush jusqu\'à 50-80 fois In pendant 200 µs).',
    protectionFunction_en: 'Overcurrent protection via Curve C or B MCBs. Mandatory sizing for high capacitive inrush currents from LED driver banks (Iinrush up to 50-80 times In for 200 µs).',
    
    measurementFunction_fr: 'Comptage d\'énergie électrique dédié à l\'éclairage conformément à la RE 2020 / RT 2012, suivi horaire d\'allumage via bus DALI / GTB.',
    measurementFunction_en: 'Dedicated lighting branch kWh sub-metering per building energy efficiency codes, operational burn hours tracking via DALI / BMS.',
    
    earthingNeutralContext_fr: 'Conducteur PE obligatoire à chaque point d\'éclairage même pour luminaire Classe II (NF C 15-100 §771). Circuit de télécommande des BAES pour extinction générale.',
    earthingNeutralContext_en: 'Mandatory PE conductor at every lighting point even for double-insulated Class II fittings. Centralized remote rest-mode command circuit for emergency lights.',
    
    safetyImplications_fr: 'Autonomie minimale de 1 heure pour les blocs d\'évacuation (45 lumens) et d\'ambiance/anti-panique (5 lm/m²). Circuit d\'éclairage de sécurité repris en amont des organes de coupure manuelle.',
    safetyImplications_en: 'Mandatory 1-hour battery autonomy for escape route luminaires (45 lumens) and anti-panic area lighting (5 lm/m²). Emergency lighting supply tapped upstream of manual room switches.',
    
    maintenanceRequirements_fr: 'Test réglementaire mensuel des BAES (passage en secours des lampes) et semestriel pour le test d\'autonomie complète d\'une heure (NF C 71-830).',
    maintenanceRequirements_en: 'Statutory monthly functional test of emergency fittings and semi-annual 1-hour full discharge autonomy audit (EN 50172).',
    
    failureModes_fr: [
      'Disjonction intempestive au réenclenchement suite à la saturation du réseau par l\'appel capacitif combiné de 40 drivers LED',
      'Défaillance de la batterie Ni-Cd/LiFePO4 d\'un bloc BAES empêchant l\'éclairage lors d\'une évacuation incendie',
      'Court-circuit sur le bus de commande DALI bloquant l\'ensemble des luminaires à 100% de puissance'
    ],
    failureModes_en: [
      'Nuisance magnetic tripping upon circuit re-energization due to simultaneous inrush current of 40 parallel LED drivers',
      'Degraded Ni-Cd/LiFePO4 battery pack inside emergency unit preventing illumination during real fire evacuation',
      'Short-circuit on DALI polarity-free 2-wire bus freezing luminaires at 100% fail-safe output'
    ],
    
    testingRequirements_fr: 'Mesure de l\'éclairement en lux au sol (luxmètre étalonné), mesure de chute de tension (≤ 3%), essai du dispositif de télécommande de mise au repos.',
    testingRequirements_en: 'Floor illuminance verification in lux (calibrated luxmeter), circuit voltage drop check (≤ 3%), remote rest-mode controller test.',
    
    engineeringParameters: [
      { name_fr: 'Chute de Tension Maximale Autorisée', name_en: 'Max Allowable Voltage Drop', value: '3.0', unit: '%' },
      { name_fr: 'Section Minimale Conducteurs Cuivre', name_en: 'Min Copper Conductor Section', value: '1.5', unit: 'mm²' },
      { name_fr: 'Niveau Éclairement Moyen Bureaux', name_en: 'Standard Office Illuminance', value: '500', unit: 'lux' },
      { name_fr: 'Autonomie Réglementaire BAES', name_en: 'Mandatory Emergency Autonomy', value: '1', unit: 'h' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'EN 12464-1 / NF C 15-100 §771 / NF C 71-800 / EN 50172',
    assumptions: ['Luminaires LED avec drivers électroniques gradables DALI', 'ERP avec balisage d\'évacuation visible tous les 15 mètres'],
    limitations: ['Les drivers LED génèrent des harmoniques de rang 3 et 9 qui peuvent charger le neutre'],
    relatedEquipmentIds: ['eq-10-circuit-lighting', 'eq-08-mcbs-modular'],
    relatedSystem: 'Distribution Éclairage & Sécurité d\'Évacuation',
    relatedStandards: ['EN 12464-1', 'NF C 15-100 §771', 'IEC 62386 (DALI)', 'EN 60598-2-22'],
    relatedEngineeringRoles: ['Concepteur Éclairagiste', 'Ingénieur Courants Forts Tertiaire', 'Vérificateur Périodique ERP'],
    relatedLifecycleActivities: ['Calcul d\'Éclairement Dialux', 'Câblage DALI & Adressage', 'Contrôle Réglementaire BAES'],
    targetWorkbenchTab: 'CHECKS_SCHEDULES'
  },

  // -------------------------------------------------------------------------
  // 10. SOCKET OUTLETS & SMALL POWER
  // -------------------------------------------------------------------------
  {
    id: 'domain-10-socket-outlets-power',
    code: 'D06-SOCKETS',
    category: 'CIRCUITS_LOADS',
    title_fr: 'Prises de Courant, Petits Récepteurs & Équipements Terminaux',
    title_en: 'Socket Outlets, Small Power & Plug-In Terminal Loads',
    subtitle_fr: 'Socles de prises 16A/20A 2P+T, boîtes de sol tertiaires, prises industrielles CEE 3P+N+T, protection différentielle 30mA.',
    subtitle_en: '16A/20A 2P+E socket outlets, commercial floor boxes, industrial CEE 3P+N+E pin receptacles, 30mA RCD personal safety.',
    iconName: 'Sliders',
    
    purpose_fr: 'Fournir des points de connexion électrique sûrs et normalisés pour l\'alimentation des appareils portatifs, bureautiques, électroménagers et machines d\'atelier.',
    purpose_en: 'Provide safe, standardized electrical interface points for portable appliances, IT workstations, kitchen gear, and workshop tooling.',
    
    powerPath_fr: 'Tableau Divisionnaire → Disjoncteur 16A/20A + Interrupteur Différentiel 30mA (Type A ou F) → Câble U-1000 R2V / H07V-U (2.5 mm²) en goulotte ou chape → Socle de Prise à Obturateurs.',
    powerPath_en: 'Sub-Distribution Board → 16A/20A MCB + 30mA RCD (Type A or F) → 2.5 mm² Copper Conductors in dado trunking or floor screed → Shuttered Socket Outlet.',
    
    protectionFunction_fr: 'Protection différentielle haute sensibilité ≤ 30 mA obligatoire sur tous les socles de prise ≤ 32 A pour la protection des personnes contre les contacts directs et indirects (CEI 60364-4-41).',
    protectionFunction_en: 'Mandatory high-sensitivity ≤ 30 mA RCD on all general socket outlets up to 32 A for personal safety against electric shock (IEC 60364-4-41).',
    
    measurementFunction_fr: 'Comptage sectoriel des prises selon la réglementation thermique, contrôle de la consommation de veille (GTB/GTC).',
    measurementFunction_en: 'Sub-metering of small power loads per green building codes, standby power monitoring via intelligent power strips or smart breakers.',
    
    earthingNeutralContext_fr: 'Alvéole de terre PE raccordée en étoile ou en repiquage soigné. Séparation stricte des terres informatiques "propres" (Clean Earth) en data room.',
    earthingNeutralContext_en: 'Reliably bonded PE pin. Loop-through or star topology. Dedicated isolated clean earth bars for sensitive audio/instrumentation sockets.',
    
    safetyImplications_fr: 'Présence obligatoire d\'obturateurs d\'alvéoles (protection enfants IP2XD). Interdiction absolue du repiquage en cascade au-delà du nombre maximal de prises autorisé par circuit.',
    safetyImplications_en: 'Mandatory child-safe shuttered mechanisms (IP2XD). Strict ban on unbounded daisy-chaining beyond statutory circuit outlet counts.',
    
    maintenanceRequirements_fr: 'Contrôle semestriel de la force de serrage des alvéoles de contact (testeur d\'arrachement), vérification de la tension phase-neutre et phase-terre (230V / 0V).',
    maintenanceRequirements_en: 'Periodic contact retention force test, phase-to-neutral and phase-to-earth loop voltage verification (230V active / 0V neutral-earth).',
    
    failureModes_fr: [
      'Rupture du conducteur neutre dans une prise repiquée provoquant une tension flottante destructrice (jusqu\'à 400V) sur les appareils en aval',
      'Échauffement critique et fusion du plastique par insertion de fiches mal dimensionnées ou faux contacts répétés',
      'Déclenchement du 30mA causé par une fuite à la terre sur un appareil portatif défectueux'
    ],
    failureModes_en: [
      'Broken neutral in a loop-through socket creating a floating neutral with destructive overvoltages (up to 400V) on downstream gear',
      'Contact overheating and melting due to loose terminal clamp or damaged plug pins generating resistive hot spots',
      'RCD 30mA tripping provoked by insulation breakdown inside a portable electric hand tool'
    ],
    
    testingRequirements_fr: 'Vérification de la présence et de la continuité du PE (< 0.2 Ω), mesure du temps de déclenchement du DDR 30mA (< 300 ms à 1×IΔn, < 40 ms à 5×IΔn).',
    testingRequirements_en: 'Ground continuity verification (< 0.2 Ω), RCD trip speed and threshold test (< 300 ms at 1×IΔn, < 40 ms at 5×IΔn).',
    
    engineeringParameters: [
      { name_fr: 'Nombre Max Prises par Circuit (2.5mm²)', name_en: 'Max Sockets per 2.5mm² Circuit', value: '12 (Logement) / 8 (Tertiaire)', unit: '' },
      { name_fr: 'Sensibilité Différentielle Obligatoire', name_en: 'Mandatory RCD Sensitivity', value: '30', unit: 'mA' },
      { name_fr: 'Calibre Disjoncteur Recommandé', name_en: 'Recommended MCB Rating', value: '16 - 20', unit: 'A' },
      { name_fr: 'Hauteur d\'Axe Réglementaire', name_en: 'Standard Mounting Height', value: '50 - 250', unit: 'mm' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'NF C 15-100 §771.314 / IEC 60364-4-41 / IEC 60884-1',
    assumptions: ['Prises 16A 2P+T standard européen avec terre latérale ou broche', 'Câblage en 3G2.5 mm² cuivre'],
    limitations: ['Les appareils de plus de 3 kVA (fours, bornes) nécessitent un circuit dédié exclusif'],
    relatedEquipmentIds: ['eq-11-circuit-power-sockets', 'eq-09-rcd-switches'],
    relatedSystem: 'Distribution Terminale Petites Puissances & Socles',
    relatedStandards: ['NF C 15-100 §771', 'IEC 60364-4-41', 'IEC 60884-1'],
    relatedEngineeringRoles: ['Installateur Électricien', 'Ingénieur Maîtrise d\'Œuvre', 'Technicien Sécurité Travail'],
    relatedLifecycleActivities: ['Pose Goulottes & Boîtes de Sol', 'Raccordement Prises', 'Audit de Sécurité Électrique'],
    targetWorkbenchTab: 'CHECKS_SCHEDULES'
  },

  // -------------------------------------------------------------------------
  // 11. HVAC, MOTORS, PUMPS & MECHANICAL SERVICES
  // -------------------------------------------------------------------------
  {
    id: 'domain-11-hvac-motors-pumps',
    code: 'D06-HVAC',
    category: 'CIRCUITS_LOADS',
    title_fr: 'Génie Climatique (CVC), Moteurs, Pompes & Ventilateurs',
    title_en: 'HVAC, Motor Feeders, Pumps & Mechanical Services Interface',
    subtitle_fr: 'Groupes froids (chillers), CTA, pompes de circulation, désenfumage, démarreurs progressifs et variateurs de fréquence (VFD).',
    subtitle_en: 'Central chillers, AHUs, circulation pumps, smoke-spill fans, soft-starters and Variable Frequency Drives (VFD).',
    iconName: 'Activity',
    
    purpose_fr: 'Alimenter et asservir les charges mécaniques motrices des bâtiments avec contrôle précis des régimes de démarrage et isolation locale pour maintenance.',
    purpose_en: 'Power and control heavy building mechanical motive loads with engineered starting profile management and local padlocked maintenance isolation.',
    
    powerPath_fr: 'Tableau CVC / MCC → Disjoncteur Moteur Magnétique (Courbe D / Type MA) → Sectionneur de Proximité Cadenassable → Variateur de Vitesse (VFD) ou Contacteur → Câble Blindé CEM → Moteur Asynchrone.',
    powerPath_en: 'HVAC MCC Panel → Motor Circuit Breaker (Curve D / Type MA) → Local Padlockable Isolator → VFD or Contactor Starter → EMC Screened Cable → Induction Motor.',
    
    protectionFunction_fr: 'Coordination Démarreur Type 2 (CEI 60947-4-1) : protection contre les surcharges thermiques par relais électronique, protection contre les courts-circuits, détection de perte ou d\'inversion de phase.',
    protectionFunction_en: 'Type 2 Starter Coordination (IEC 60947-4-1): thermal overload protection via electronic relay, magnetic short-circuit trip, phase loss and reverse sequence detection.',
    
    measurementFunction_fr: 'Surveillance du courant efficace par phase, surveillance de température des enroulements (sondes PT100 / thermistances PTC) et analyse vibratoire.',
    measurementFunction_en: 'Per-phase RMS current metering, stator winding temperature surveillance (PT100 RTDs / PTC thermistors) and continuous vibration monitoring.',
    
    earthingNeutralContext_fr: 'Mise à la terre de la carcasse moteur par tresse de masse plate pour haute fréquence, raccordement du blindage du câble moteur à 360° via presse-étoupe CEM à chaque extrémité.',
    earthingNeutralContext_en: 'Motor frame high-frequency grounding via flat braided copper strap, 360° circumferential EMC cable shield bonding at both ends via metallic glands.',
    
    safetyImplications_fr: 'Sectionneur de proximité cadenassable en position ouverte (LOTO) installé à vue directe du moteur pour interdire tout démarrage intempestif pendant les travaux d\'entretien mécanique.',
    safetyImplications_en: 'Mandatory local padlockable switch-disconnector (LOTO) located in line-of-sight of the motor preventing accidental remote starts during servicing.',
    
    maintenanceRequirements_fr: 'Contrôle annuel de l\'isolement des enroulements au mégohmmètre (500V/1000V DC > 5 MΩ), vérification de l\'absence d\'harmoniques excessives sur les filtres dV/dt.',
    maintenanceRequirements_en: 'Annual stator insulation resistance megger testing (500V/1000V DC > 5 MΩ), inspection of dV/dt output filter capacitors on VFD drives.',
    
    failureModes_fr: [
      'Claquer d\'isolement des spires du stator provoqué par les pics de tension de front raide (réflexion d\'onde dV/dt) générés par le variateur de fréquence',
      'Courants de circulation dans les roulements (Bearing Currents) causés par la tension de mode commun du variateur entraînant un grippage mécanique',
      'Surcharge thermique continue par blocage du rotor d\'une pompe suite à un encrassement ou gel'
    ],
    failureModes_en: [
      'Stator inter-turn dielectric punch-through caused by steep-front reflected wave voltage spikes (dV/dt) from VFD switching',
      'Electrical fluting and premature motor bearing failure induced by high-frequency common-mode shaft currents',
      'Continuous thermal stalling from locked rotor condition on pump impeller jamming'
    ],
    
    testingRequirements_fr: 'Mesure du courant de démarrage Id/In, contrôle du sens de rotation de l\'arbre, mesure d\'harmoniques THDi générés par les ponts redresseurs.',
    testingRequirements_en: 'Starting current ratio measurement Id/In, rotational direction check, harmonic current THDi spectrum audit.',
    
    engineeringParameters: [
      { name_fr: 'Courant de Démarrage Direct (DOL)', name_en: 'Direct-on-Line Inrush Ratio', value: '6 - 8', unit: '× In' },
      { name_fr: 'Courant de Démarrage avec VFD', name_en: 'VFD Controlled Inrush Ratio', value: '1.0 - 1.2', unit: '× In' },
      { name_fr: 'Fréquence de Découpage PWM VFD', name_en: 'VFD PWM Switching Frequency', value: '2 - 8', unit: 'kHz' },
      { name_fr: 'Classe d\'Isolement Stator', name_en: 'Stator Insulation Class', value: 'Classe F (155°C) / H (180°C)', unit: '' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'IEC 60947-4-1 / IEC 61800-3 / NF C 15-100 §558',
    assumptions: ['Moteurs asynchrones triphasés 400V 50Hz à rotor à cage', 'Variateurs de vitesse conformes aux directives CEM industrielles'],
    limitations: ['Au-delà de 20m de câble entre VFD et moteur, une inductance de ligne ou un filtre sinus est indispensable'],
    relatedEquipmentIds: ['eq-12-circuit-hvac', 'eq-06-sub-feeder-mccb'],
    relatedSystem: 'Distribution Force Motrice & Génie Climatique',
    relatedStandards: ['IEC 60947-4-1', 'IEC 61800-3', 'IEC 60034-1', 'NF C 15-100'],
    relatedEngineeringRoles: ['Ingénieur CVC / Électromécanique', 'Spécialiste Variateurs de Vitesse', 'Technicien Climatisation'],
    relatedLifecycleActivities: ['Paramétrage VFD', 'Essais d\'Équilibrage Aéraulique', 'Thermographie MCC'],
    targetWorkbenchTab: 'MOTOR_STARTING_VFD'
  },

  // -------------------------------------------------------------------------
  // 12. ELEVATORS, FIRE SAFETY & ELV INTERFACES
  // -------------------------------------------------------------------------
  {
    id: 'domain-12-elevators-fire-elv',
    code: 'D06-LIFTS-FIRE',
    category: 'SPECIAL_SYSTEMS',
    title_fr: 'Ascenseurs, SSI Incendie & Systèmes Courants Faibles (ELV)',
    title_en: 'Elevators / Lifts, Fire Safety (SSI) & ELV Security Interfaces',
    subtitle_fr: 'Alimentation machinerie d\'ascenseurs, désenfumage de sécurité, centrale SSI de détection incendie, contrôle d\'accès et vidéosurveillance.',
    subtitle_en: 'Lift machinery traction power, fire smoke extraction, fire alarm control panels (FACP), access control and CCTV security.',
    iconName: 'ShieldAlert',
    
    purpose_fr: 'Fournir une alimentation électrique prioritaire, continue et ultra-sécurisée aux systèmes de transport vertical et de sécurité incendie concourant à la survie des occupants.',
    purpose_en: 'Provide ultra-reliable prioritized power distribution to vertical passenger transportation and life safety fire systems governing occupant survival.',
    
    powerPath_fr: 'TGBT Section Secourue / Coffret Coupe-Feu → Câble Pyrorésistant CR1-C1 → Coffret de Sécurité Incendie / Armoire Machinerie Ascenseur → Moteur Gearless / Ventilateurs de Désenfumage.',
    powerPath_en: 'Essential TGBT Section / Fire-Rated Transfer Box → CR1-C1 Fire-Resistant Mineral Cable → Fire Damper / Lift Motor Control Cabinet → Gearless Traction Motor / Smoke Fans.',
    
    protectionFunction_fr: 'Particularité réglementaire majeure pour les circuits de sécurité incendie (NF S 61-932) : les protections contre les surcharges doivent être inhibées ou non déclenchantes, seule la protection contre les courts-circuits francs est autorisée.',
    protectionFunction_en: 'Crucial statutory mandate for fire safety circuits (NF S 61-932): thermal overload tripping is legally prohibited or suppressed; only metallic short-circuit protection is permitted.',
    
    measurementFunction_fr: 'Contrôle permanent de la présence tension par relais à manque de tension, renvoi d\'état de marche/défaut vers le Centralisateur de Mise en Sécurité Incendie (CMSI).',
    measurementFunction_en: 'Continuous phase presence monitoring via undervoltage relays, operational status telemetry relayed to the central Fire Alarm Panel (FACP).',
    
    earthingNeutralContext_fr: 'Liaison équipotentielle intégrale des rails de guidage de cabine et des structures métalliques de la cage d\'ascenseur, isolation galvanique pour les liaisons ELV.',
    earthingNeutralContext_en: 'Continuous bonding of elevator guide rails, counterweight frames, and structural hoistway steel; galvanic isolation on ELV data loops.',
    
    safetyImplications_fr: 'Fonction de retour automatique d\'urgence au niveau d\'évacuation le plus proche en cas de panne de secteur avec ouverture des portes d\'ascenseur (manœuvre pompier).',
    safetyImplications_en: 'Automatic battery-assisted emergency rescue device (ARD) driving the elevator to the nearest floor and opening doors upon utility power outage.',
    
    maintenanceRequirements_fr: 'Audit semestriel obligatoire des freins mécaniques de parachute, test de continuité des câbles pyrorésistants CR1, vérification de l\'autonomie des batteries de secours SSI.',
    maintenanceRequirements_en: 'Mandatory statutory elevator safety gear inspection, CR1 fire-resistant cable integrity test, fire panel standby battery capacity verification.',
    
    failureModes_fr: [
      'Coupure du circuit de sécurité incendie pendant l\'évacuation provoquée par un déclencheur thermique mal dimensionné',
      'Effet de régénération électrique sur freinage d\'ascenseur provoquant une surtension sur le bus DC en l\'absence de résistance de freinage',
      'Parasitage des bus de communication de détection incendie par rayonnement électromagnétique des câbles de puissance ascenseur non blindés'
    ],
    failureModes_en: [
      'Premature tripping of smoke exhaust fan during fire evacuation due to inappropriately set thermal overload protection',
      'Regenerative braking energy surge collapsing the drive DC bus in the absence of dynamic braking resistors',
      'EMI corruption on fire detection addressable loops caused by unshielded elevator traction power feeders in common risers'
    ],
    
    testingRequirements_fr: 'Essai de non-déclenchement en surcharge sur ventilateur de désenfumage, simulation de manœuvre pompier par coupure secteur, test d\'évacuation cabine chargée à 125%.',
    testingRequirements_en: 'Fire smoke fan locked-rotor withstand trial, simulated firefighter service phase under blackout, 125% rated load traction brake test.',
    
    engineeringParameters: [
      { name_fr: 'Tenue au Feu Câbles de Sécurité', name_en: 'Fire Withstand Rating (CR1)', value: '90', unit: 'min (à 920°C)' },
      { name_fr: 'Autonomie Minimale Batteries SSI', name_en: 'Min Fire Alarm Battery Standby', value: '12', unit: 'h' },
      { name_fr: 'Temps de Réponse Manœuvre Pompier', name_en: 'Firefighter Recall Time', value: '< 60', unit: 's' },
      { name_fr: 'Tension Nominale Systèmes ELV', name_en: 'Nominal ELV Voltage', value: '12 / 24 / 48', unit: 'V DC' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'EN 81-20 / EN 81-50 / NF S 61-932 / NF C 15-100 §558',
    assumptions: ['Câbles de sécurité incendie conformes à la norme NF C 32-070 catégorie CR1', 'Alimentation reprise directement en tête d\'installation'],
    limitations: ['Les câbles de sécurité incendie ne doivent partager aucun cheminement avec des câbles courants faibles'],
    relatedEquipmentIds: ['eq-05-tgbt-cubicle', 'eq-15-diesel-generator'],
    relatedSystem: 'Systèmes de Sécurité Incendie & Transport Vertical',
    relatedStandards: ['EN 81-20', 'NF S 61-932', 'NF S 61-940', 'NF C 15-100'],
    relatedEngineeringRoles: ['Coordinateur SSI', 'Ingénieur Ascensoriste', 'Bureau de Contrôle Agréé'],
    relatedLifecycleActivities: ['Essais de Désenfumage Réel', 'Contrôle Périodique Ascenseur', 'Commissioning SSI'],
    targetWorkbenchTab: 'GENERATOR_SHEDDING'
  },

  // -------------------------------------------------------------------------
  // 13. POWER QUALITY AT UTILIZATION LEVEL & HARMONICS
  // -------------------------------------------------------------------------
  {
    id: 'domain-13-power-quality-harmonics',
    code: 'D06-PQ',
    category: 'SPECIAL_SYSTEMS',
    title_fr: 'Qualité de l\'Énergie, Harmoniques, Facteur de Puissance & CEM',
    title_en: 'Power Quality, Harmonic Pollution, Power Factor & EMC',
    subtitle_fr: 'Distorsion harmonique THDu/THDi, harmoniques de rang 3 dans le neutre, batteries de condensateurs avec selfs anti-harmoniques, filtres actifs.',
    subtitle_en: 'THDu/THDi distortion, triplen harmonics on neutral, detuned capacitor banks, active harmonic filters and EMC mitigation.',
    iconName: 'Waves',
    
    purpose_fr: 'Maintenir la qualité de l\'onde sinusoïdale de tension (EN 50160), réduire la consommation d\'énergie réactive (cos φ > 0.93) et éliminer les pollutions harmoniques destructrices.',
    purpose_en: 'Preserve sinusoidal voltage waveform purity (EN 50160), suppress reactive power penalties (cos φ > 0.93), and eliminate destructive harmonic resonances.',
    
    powerPath_fr: 'Jeu de Barres TGBT → Analyseur Qualité d\'Énergie → Filtre Harmonique Actif (AHF en parallèle) / Batterie de Condensateurs Graduelle → Élimination des Courants Rangs 3, 5, 7, 11.',
    powerPath_en: 'Main TGBT Busbar → Power Quality Metering Class A → Shunt Active Harmonic Filter (AHF) / Detuned Capacitor Bank → Cancellation of Harmonic Currents 3rd, 5th, 7th, 11th.',
    
    protectionFunction_fr: 'Protection contre la résonance parallèle entre transformateur et condensateurs par selfs de blocage d\'harmoniques (accordées à 189 Hz ou 134 Hz), coupure des gradins en cas de surtension.',
    protectionFunction_en: 'Anti-resonance protection between supply transformer and capacitors using series detuning reactors (tuned to 189 Hz or 134 Hz), overvoltage step disconnection.',
    
    measurementFunction_fr: 'Mesure de la classe A (CEI 61000-4-30) : tension efficace par demi-période, creux de tension (dips), papillotement (Flicker Pst/Plt), harmoniques jusqu\'au rang 50.',
    measurementFunction_en: 'Class A certified power quality telemetry (IEC 61000-4-30): cycle-by-cycle RMS voltage, voltage dips/sags, flicker (Pst/Plt), individual harmonics to 50th order.',
    
    earthingNeutralContext_fr: 'Échauffement critique du conducteur neutre dû aux harmoniques homopolaires de rang 3 (150 Hz) et multiples qui s\'additionnent arithmétiquement dans le neutre : nécessité d\'un neutre surdimensionné (200%).',
    earthingNeutralContext_en: 'Severe neutral overheating from triplen zero-sequence harmonics (150 Hz) which summate in the neutral: mandatory double-sized (200%) neutral busbar and conductors.',
    
    safetyImplications_fr: 'Risque d\'incendie par surcharge thermique non détectée sur le neutre non protégé, risque d\'explosion de condensateurs non protégés contre les harmoniques.',
    safetyImplications_en: 'Fire hazard from undetected thermal overload on unprotected neutral conductors, explosion hazard of standard power capacitors under harmonic resonance.',
    
    maintenanceRequirements_fr: 'Contrôle annuel de la capacitance des condensateurs de puissance (perte de capacité > 10% impose le remplacement), dépoussiérage des ventilateurs des filtres actifs.',
    maintenanceRequirements_en: 'Annual capacitance check on power capacitor cans (loss > 10% demands replacement), cleaning of active filter heatsink blowers.',
    
    failureModes_fr: [
      'Résonance harmonique parallèle amplifiant les tensions harmoniques et détruisant les condensateurs de compensation',
      'Échauffement excessif et fonte de l\'isolant du conducteur neutre par un courant de neutre supérieur au courant de phase (In > 1.5 Iphase)',
      'Déclenchements intempestifs de disjoncteurs électroniques perturbés par des bruits parasites haute fréquence (CEM)'
    ],
    failureModes_en: [
      'Parallel harmonic resonance amplifying distortion voltages and blowing compensation capacitor stages',
      'Severe thermal breakdown and melting of neutral insulation caused by neutral currents exceeding phase currents (In > 1.5 Iphase)',
      'Spurious tripping of electronic breakers induced by high-frequency common-mode conducted EMI noise'
    ],
    
    testingRequirements_fr: 'Mesure du THDu global (doit être < 5% ou 8%), mesure du THDi, vérification de l\'absence de résonance lors de l\'enclenchement des gradins.',
    testingRequirements_en: 'Total voltage harmonic distortion THDu verification (< 5% or 8% limit), THDi load profiling, resonance check across all capacitor steps.',
    
    engineeringParameters: [
      { name_fr: 'Facteur de Puissance Cible (cos φ)', name_en: 'Target Power Factor (cos φ)', value: '0.95 - 0.98', unit: '' },
      { name_fr: 'Distorsion Harmonique Max Tension THDu', name_en: 'Max Voltage THDu Limit', value: '< 5.0', unit: '%' },
      { name_fr: 'Fréquence d\'Accord Self Anti-Harmonique', name_en: 'Detuned Reactor Tuning', value: '189 (Rang 3.78) / 134 (Rang 2.68)', unit: 'Hz' },
      { name_fr: 'Facteur K Transformateur Informatique', name_en: 'IT Transformer K-Factor', value: 'K-13 / K-20', unit: '' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'IEC 61000-2-4 / IEEE 519 / EN 50160 / NF C 15-100 §523',
    assumptions: ['Réseau triphasé basse tension pollué par des ponts redresseurs à 6 impulsions (VFD, serveurs, LED)'],
    limitations: ['Les filtres passifs doivent être recalculés en cas de modification de la puissance du transformateur source'],
    relatedEquipmentIds: ['eq-04-main-busbar', 'eq-05-tgbt-cubicle', 'eq-14-ups-converter'],
    relatedSystem: 'Gestion de la Qualité de l\'Énergie & Filtrage Harmonique',
    relatedStandards: ['IEC 61000-2-4', 'IEEE 519', 'EN 50160', 'IEC 60831-1'],
    relatedEngineeringRoles: ['Ingénieur Qualité de l\'Énergie', 'Expert Réseaux & Harmoniques', 'Énergéticien Industriel'],
    relatedLifecycleActivities: ['Audit Harmonique sur Site', 'Mise en Service Filtres Actifs', 'Bilan Annuel Réactif'],
    targetWorkbenchTab: 'HARMONICS_ANALYSIS'
  },

  // -------------------------------------------------------------------------
  // 14. PHOTOVOLTAIC (PV), BESS & EV CHARGING (IRVE)
  // -------------------------------------------------------------------------
  {
    id: 'domain-14-pv-bess-ev-charging',
    code: 'D06-PV-BESS-EV',
    category: 'SPECIAL_SYSTEMS',
    title_fr: 'Photovoltaïque (PV), Stockage Batterie (BESS) & Bornes IRVE',
    title_en: 'Solar PV, Battery Energy Storage (BESS) & EV Charging (IRVE)',
    subtitle_fr: 'Onduleurs solaires raccordés réseau, stockage LiFePO4, bornes de recharge VE mode 3/4 avec DDR Type B et délestage dynamique.',
    subtitle_en: 'Grid-tied solar inverters, commercial LiFePO4 BESS, Mode 3/4 EV chargers with Type B RCDs and dynamic load balancing.',
    iconName: 'Sun',
    
    purpose_fr: 'Intégrer la production d\'énergie décentralisée et la mobilité électrique sans saturer l\'abonnement réseau grâce au pilotage énergétique intelligent.',
    purpose_en: 'Integrate onsite renewable generation and EV mobility charging without exceeding utility connection kVA capacity via smart dynamic load management.',
    
    powerPath_fr: 'Panneaux PV DC / BESS Batterie → Coffret DC (Sectionneur + Parafoudre Type 1/2) → Onduleur Hybride → Disjoncteur Réinjection TGBT / Bornes IRVE (DDR 30mA Type B + Déclencheur MNx).',
    powerPath_en: 'PV Arrays DC / BESS Battery → DC String Combiner (Isolator + Type 1/2 SPD) → Hybrid Inverter → TGBT Re-injection Breaker / EV Charging Stations (30mA Type B RCD + Shunt Trip).',
    
    protectionFunction_fr: 'Protection différentielle Type B obligatoire pour les bornes de recharge IRVE pour détecter les courants de fuite continus lisses (DC > 6mA) qui aveuglent les DDR Type A. Parafoudres DC 1000V/1500V.',
    protectionFunction_en: 'Mandatory Type B RCD on EV charging circuits to detect smooth DC residual leakage (> 6mA) that blinds Type A/AC RCDs. Dedicated 1000V/1500V DC surge protection.',
    
    measurementFunction_fr: 'Comptage bidirectionnel (import/export), mesure en temps réel du courant disponible en tête de TGBT pour pilotage de la puissance de charge des véhicules (DLM - Dynamic Load Management).',
    measurementFunction_en: 'Bidirectional utility billing metering (import/export), real-time TGBT feeder head current telemetry to modulate EV charge rates (Dynamic Load Management - DLM).',
    
    earthingNeutralContext_fr: 'Régime de terre spécifique côté continu (isolation galvanique requise par rapport au réseau AC), équipotentialité des cadres métalliques des panneaux PV à la terre générale.',
    earthingNeutralContext_en: 'Specialized DC earthing topology (galvanic isolation between DC side and AC utility grid), equipotential bonding of all PV module metallic frames to earth ring.',
    
    safetyImplications_fr: 'Tension continue dangereuse (jusqu\'à 1000V DC) active de jour même onduleur éteint (risque d\'électrocution pour les pompiers). Coupure d\'urgence pompier (Coupure Générale PV).',
    safetyImplications_en: 'Lethal DC string voltage (up to 1000V DC) present during daylight even with inverter isolated. Statutory firefighter emergency disconnection switch.',
    
    maintenanceRequirements_fr: 'Thermographie infrarouge semestrielle des boîtes de jonction DC (détection de points chauds/hotspots), contrôle du serrage au couple des connecteurs MC4.',
    maintenanceRequirements_en: 'Semi-annual infrared thermography of DC junction combiner boxes (hotspot detection), torque audit of MC4 solar connectors.',
    
    failureModes_fr: [
      'Arc électrique DC franc sur connecteur MC4 mal serti provoquant un départ de feu en toiture photovoltaïque',
      'Aveuglement magnétique d\'un disjoncteur différentiel Type A par une fuite continue de 10 mA générée par le redresseur embarqué d\'un véhicule électrique',
      'Emballement thermique d\'un module de batterie lithium-ion par défaillance du BMS (Battery Management System)'
    ],
    failureModes_en: [
      'Sustained series DC arc flash on loosely crimped MC4 solar connector sparking a rooftop blaze',
      'Magnetic core desensitization (blinding) of a Type A RCD by smooth 10 mA DC leakage from an EV onboard charger',
      'Lithium-ion thermal runaway inside battery cabinet triggered by BMS cell balancing failure'
    ],
    
    testingRequirements_fr: 'Mesure de tension à vide Voc et courant de court-circuit Isc des strings PV, test de déclenchement du DDR Type B en courant continu (seuil 6 mA DC).',
    testingRequirements_en: 'String open-circuit voltage Voc and short-circuit current Isc verification, Type B RCD DC tripping threshold and curve test (6 mA DC threshold).',
    
    engineeringParameters: [
      { name_fr: 'Seuil Détection Fuite Continue Bornes', name_en: 'EV DC Residual Detection Limit', value: '6', unit: 'mA DC' },
      { name_fr: 'Tension Maximale Chaînes PV', name_en: 'Max PV String DC Voltage', value: '1000 - 1500', unit: 'V DC' },
      { name_fr: 'Rendement Onduleur Solaire', name_en: 'Solar Inverter Euro-Efficiency', value: '98.5', unit: '%' },
      { name_fr: 'Puissance Borne AC Triphasée', name_en: 'Tri-Phase AC EV Station Power', value: '22', unit: 'kW' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'IEC 60364-7-712 (PV) / IEC 61851-1 / NF C 15-722 (IRVE) / UTE C 15-712-1',
    assumptions: ['Panneaux solaires monocristallins en toiture terrasse', 'Bornes de recharge équipées de communication ISO 15118'],
    limitations: ['Le stockage batterie en intérieur exige un local technique coupe-feu REI 120 avec détection gaz/fumée'],
    relatedEquipmentIds: ['eq-05-tgbt-cubicle', 'eq-09-rcd-switches'],
    relatedSystem: 'Production Renouvelable, Stockage & Mobilité Électrique',
    relatedStandards: ['IEC 60364-7-712', 'IEC 61851-1', 'NF C 15-722', 'UTE C 15-712-1'],
    relatedEngineeringRoles: ['Ingénieur Énergies Renouvelables', 'Installateur IRVE Qualifié', 'Expert Sécurité Incendie'],
    relatedLifecycleActivities: ['Essai de Découplage VDE 0126', 'Thermographie Photovoltaïque', 'Test Consuel Déclaration PV'],
    targetWorkbenchTab: 'BESS_PV_STORAGE'
  },

  // -------------------------------------------------------------------------
  // 15. COMMISSIONING, TESTING, VERIFICATION & STATUTORY COMPLIANCE (CONSUEL)
  // -------------------------------------------------------------------------
  {
    id: 'domain-15-commissioning-compliance',
    code: 'D06-COMMISSIONING',
    category: 'LIFECYCLE_OPERATIONS',
    title_fr: 'Essais de Réception, Vérifications Initiales & Conformité Consuel',
    title_en: 'Commissioning, Testing, Verification & Statutory Certification',
    subtitle_fr: 'Inspections visuelles, essais de continuité PE, résistance d\'isolement, mesure de terre, temps de coupure différentielle et dossier Consuel.',
    subtitle_en: 'Visual inspections, PE continuity tests, insulation resistance, earth electrode measurement, RCD trip times and Consuel / IEC 60364-6 verification.',
    iconName: 'FileCheck',
    
    purpose_fr: 'Valider formellement la conformité réglementaire de l\'installation avant mise sous tension définitive et garantir l\'absence totale de risque pour les personnes et les biens.',
    purpose_en: 'Formally certify regulatory statutory compliance prior to permanent energization, guaranteeing total electrical safety for life and property.',
    
    powerPath_fr: 'Installation Complète Hors Tension → Électrode de Terre & Liaisons Équipotentielles → Tableaux Électriques & Jeux de Barres → Lignes & Câbles Terminaux → Récepteurs Finaux.',
    powerPath_en: 'Entire De-Energized Installation → Earth Electrodes & Equipotential Bonds → Distribution Enclosures & Busbars → Final Branch Run Cables → Terminal Loads.',
    
    protectionFunction_fr: 'Vérification métrologique de l\'efficacité de toutes les mesures de protection : coupure automatique de l\'alimentation (courant de court-circuit minimal vérifié), coordination différentielle.',
    protectionFunction_en: 'Metrological verification of all safety protection measures: automatic disconnection of supply (adequate minimum fault current verified), RCD discrimination.',
    
    measurementFunction_fr: 'Séquence stricte d\'essais instrumentaux (NF C 15-100 Partie 6 / CEI 60364-6) : Continuité (200mA) → Isolement (500V DC) → Boucle de défaut Zs → Résistance de terre Ra → Temps et courant de déclenchement différentiel.',
    measurementFunction_en: 'Strict normative sequence of instrumental tests (IEC 60364-6): Continuity (200mA) → Insulation (500V DC) → Fault Loop Zs → Earth Resistance Ra → RCD trip threshold and speed.',
    
    earthingNeutralContext_fr: 'Mesure de la prise de terre du bâtiment par la méthode des 3 piquets (méthode des 62%) déconnectée de la barrette de mesure, vérification de la valeur maximale admissible (≤ 100 Ω en TT).',
    earthingNeutralContext_en: 'Measurement of building earth electrode resistance using the 3-stake 62% method with test link isolated, ensuring compliance with statutory limits (≤ 100 Ω in TT).',
    
    safetyImplications_fr: 'Interdiction de mise sous tension définitive par le distributeur (Enedis/autre) sans obtention préalable de l\'attestation de conformité visée par le Consuel (en France) ou l\'organisme agréé.',
    safetyImplications_en: 'Absolute legal ban on final utility meter energization without a certified certificate of compliance issued by Consuel or authorized accredited inspection bodies.',
    
    maintenanceRequirements_fr: 'Vérifications périodiques obligatoires annuelles pour les établissements recevant du public (ERP) et les lieux de travail (registre de sécurité et rapport Q18 pour les assureurs).',
    maintenanceRequirements_en: 'Mandatory statutory annual periodic inspections for public access buildings (ERP) and commercial workplaces (fire insurer Q18 electrical audit).',
    
    failureModes_fr: [
      'Refus de visa de l\'attestation Consuel pour absence de schéma unifilaire complet ou non-respect de la sélectivité différentielle',
      'Défaut d\'isolement latent causé par une vis de plaque de plâtre traversant un câble sous gaine non détecté avant mise sous tension',
      'Résistance de terre excessive (> 100 Ω) empêchant le déclenchement des différentiels lors d\'un défaut d\'isolement en régime TT'
    ],
    failureModes_en: [
      'Consuel compliance certificate rejection provoked by incomplete Single Line Diagrams or violation of RCD selectivity rules',
      'Hidden insulation puncture caused by drywall screw penetrating an unseen conduit, causing an immediate line-to-earth fault on first energization',
      'High earth electrode resistance (> 100 Ω) in TT system preventing touch voltage from staying below safe limits before RCD trip'
    ],
    
    testingRequirements_fr: 'Rapport complet d\'essais d\'autocontrôle, PV de vérification initiale COPREC/Consuel, fiches d\'essais d\'isolement de chaque départ terminal (> 1 MΩ).',
    testingRequirements_en: 'Full self-inspection testing report, initial third-party inspection sign-off, insulation testing logs for every individual final circuit (> 1 MΩ).',
    
    engineeringParameters: [
      { name_fr: 'Résistance d\'Isolement Minimale (500V)', name_en: 'Min Insulation Resistance (500V)', value: '≥ 1.0', unit: 'MΩ' },
      { name_fr: 'Courant d\'Essai de Continuité PE', name_en: 'PE Continuity Test Current', value: '≥ 200', unit: 'mA' },
      { name_fr: 'Résistance Max de Continuité PE', name_en: 'Max PE Continuity Resistance', value: '≤ 0.2', unit: 'Ω' },
      { name_fr: 'Prise de Terre Maximale en TT', name_en: 'Max TT Earth Resistance', value: '≤ 100', unit: 'Ω' }
    ],
    
    verificationStatus: 'VERIFIED_IEC',
    sourceReference: 'IEC 60364-6 / NF C 15-100 Partie 6 / Décret n°72-1120 (Consuel) / NF C 18-510',
    assumptions: ['Instruments de mesure étalonnés conformes à la norme CEI 61557', 'Installations neuves ou rénovations totales'],
    limitations: ['Les essais d\'isolement à 500V DC doivent être précédés du débranchement des récepteurs électroniques sensibles'],
    relatedEquipmentIds: ['eq-01-utility-connection', 'eq-05-tgbt-cubicle', 'eq-09-rcd-switches'],
    relatedSystem: 'Contrôle Réglementaire, Vérifications Initiales & Attestation Consuel',
    relatedStandards: ['IEC 60364-6', 'NF C 15-100 Partie 6', 'IEC 61557', 'Décret Consuel'],
    relatedEngineeringRoles: ['Inspecteur Consuel / Bureau de Contrôle (Apave, Bureau Veritas, Dekra)', 'Responsable Commissioning', 'Chef de Chantier Électricité'],
    relatedLifecycleActivities: ['Essais Métrologiques Finaux', 'Visite de Contrôle Consuel', 'Mise en Service Définitive'],
    targetWorkbenchTab: 'COMMISSIONING_FAT_SAT'
  }
];
