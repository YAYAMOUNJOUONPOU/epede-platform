// src/components/production/data/hydropowerData.ts
import type { ProcessStageNode, ProductionEquipment } from '../types';

export const HYDRO_PROCESS_STAGES: ProcessStageNode[] = [
  {
    id: 'stage-river',
    stepNumber: 1,
    labelFr: 'Cours d\'Eau / Bassin Versant',
    labelEn: 'Water Resource / River Basin',
    subtitleFr: 'Débit hydrologique naturel du fleuve (ex: Sanaga, Cameroun)',
    subtitleEn: 'Natural river discharge & catchment hydrology',
    energyStateFr: 'Énergie Potentielle Brute (Gravitaire)',
    energyStateEn: 'Raw Gravitational Potential Energy',
    equipmentId: 'eq-river',
    iconName: 'Waves',
    color: '#0284c7'
  },
  {
    id: 'stage-dam',
    stepNumber: 2,
    labelFr: 'Barrage & Retenue',
    labelEn: 'Reservoir / Dam',
    subtitleFr: 'Création de la chute brute (H_brut) et stockage volumique',
    subtitleEn: 'Gross head creation and volume regulation',
    energyStateFr: 'Charge Hydrostatique Statique (P = ρ·g·H)',
    energyStateEn: 'Static Hydrostatic Head (P = ρ·g·H)',
    equipmentId: 'eq-dam',
    iconName: 'Shield',
    color: '#0369a1'
  },
  {
    id: 'stage-intake',
    stepNumber: 3,
    labelFr: 'Prise d\'Eau Usinière',
    labelEn: 'Water Intake Structure',
    subtitleFr: 'Captage du débit turbiné et transition hydraulique',
    subtitleEn: 'Power flow abstraction and entrance transition',
    energyStateFr: 'Écoulement Convergent Basse Vitesse',
    energyStateEn: 'Low-Velocity Converging Intake Flow',
    equipmentId: 'eq-intake',
    iconName: 'LogIn',
    color: '#0891b2'
  },
  {
    id: 'stage-trashrack',
    stepNumber: 4,
    labelFr: 'Grille de Dégrillage',
    labelEn: 'Trash Rack / Screening',
    subtitleFr: 'Retenue des corps flottants et protection du runner',
    subtitleEn: 'Debris exclusion and runner blade protection',
    energyStateFr: 'Filtration Hydraulique (Perte de charge mineure ΔH)',
    energyStateEn: 'Hydraulic Screening (Minor head loss ΔH)',
    equipmentId: 'eq-trashrack',
    iconName: 'Filter',
    color: '#0e7490'
  },
  {
    id: 'stage-gate',
    stepNumber: 5,
    labelFr: 'Vannes de Prise d\'Eau',
    labelEn: 'Intake Gates',
    subtitleFr: 'Isolement d\'urgence et régulation d\'admission',
    subtitleEn: 'Emergency shut-off and intake section isolation',
    energyStateFr: 'Contrôle Section d\'Admission',
    energyStateEn: 'Intake Section Flow Control',
    equipmentId: 'eq-gate',
    iconName: 'Sliders',
    color: '#0f766e'
  },
  {
    id: 'stage-headrace',
    stepNumber: 6,
    labelFr: 'Canal d\'Amenée / Galerie',
    labelEn: 'Headrace / Waterway',
    subtitleFr: 'Transit gravitaire à ciel ouvert ou en charge',
    subtitleEn: 'Gravitational conveyance open-channel or low-pressure conduit',
    energyStateFr: 'Flux Laminaire Continu (Q = S · V)',
    energyStateEn: 'Continuous Steady Flow (Q = S · V)',
    equipmentId: 'eq-headrace',
    iconName: 'Compass',
    color: '#0d9488'
  },
  {
    id: 'stage-surgetank',
    stepNumber: 7,
    labelFr: 'Cheminée d\'Équilibre',
    labelEn: 'Surge Tank / Surge System',
    subtitleFr: 'Atténuation des coups de bélier (Allievi) en régime transitoire',
    subtitleEn: 'Water hammer surge dampening during unit trips',
    energyStateFr: 'Amortissement Oscillatoire (Énergie Cinétique ↔ Potentielle)',
    energyStateEn: 'Oscillatory Surge Damping (Kinetic ↔ Potential)',
    equipmentId: 'eq-surgetank',
    iconName: 'Maximize2',
    color: '#059669'
  },
  {
    id: 'stage-penstock',
    stepNumber: 8,
    labelFr: 'Conduite Forcée (Penstock)',
    labelEn: 'Penstock High-Pressure Conduit',
    subtitleFr: 'Mise sous haute pression de l\'écoulement vers la bâche',
    subtitleEn: 'High-pressure water acceleration into spiral casing',
    energyStateFr: 'Pression Dynamique Maximale (P = 5 - 50 bar)',
    energyStateEn: 'Maximum Dynamic Hydraulic Pressure',
    equipmentId: 'eq-penstock',
    iconName: 'ArrowDownRight',
    color: '#16a34a'
  },
  {
    id: 'stage-miv',
    stepNumber: 9,
    labelFr: 'Vanne de Pied (MIV)',
    labelEn: 'Main Inlet Valve (MIV)',
    subtitleFr: 'Vanne papillon ou sphérique d\'arrêt amont turbine',
    subtitleEn: 'Spherical/butterfly safety shutoff valve upstream turbine',
    energyStateFr: 'Sectionnement de Sécurité Haute Pression',
    energyStateEn: 'High-Pressure Safety Sectioning',
    equipmentId: 'eq-miv',
    iconName: 'Disc',
    color: '#65a30d'
  },
  {
    id: 'stage-turbine',
    stepNumber: 10,
    labelFr: 'Turbine Hydraulique (Francis/Pelton/Kaplan)',
    labelEn: 'Hydraulic Turbine & Runner',
    subtitleFr: 'Conversion de la charge hydraulique en couple mécanique',
    subtitleEn: 'Conversion of fluid momentum into mechanical shaft torque',
    energyStateFr: 'Puissance Mécanique sur Roue (P_m = ρ·g·Q·H·η_t)',
    energyStateEn: 'Mechanical Shaft Power (P_m = ρ·g·Q·H·η_t)',
    equipmentId: 'eq-turbine',
    iconName: 'RotateCw',
    color: '#d97706'
  },
  {
    id: 'stage-shaft',
    stepNumber: 11,
    labelFr: 'Arbre & Ligne d\'Arbre',
    labelEn: 'Shaft / Mechanical Power Train',
    subtitleFr: 'Transmission mécanique, butée axiale et paliers guides',
    subtitleEn: 'Torque transmission, thrust bearings and radial guide bearings',
    energyStateFr: 'Couple Mécanique Rotatif (C = P / ω)',
    energyStateEn: 'Rotational Mechanical Torque (T = P / ω)',
    equipmentId: 'eq-shaft',
    iconName: 'Activity',
    color: '#ea580c'
  },
  {
    id: 'stage-generator',
    stepNumber: 12,
    labelFr: 'Alternateur Synchrone',
    labelEn: 'Synchronous Generator',
    subtitleFr: 'Conversion électromagnétique rotorique/statorique triphasée',
    subtitleEn: 'Three-phase electromagnetic rotor/stator conversion',
    voltageLevel: '15 kV',
    energyStateFr: 'Puissance Électrique Triphasée (S = √3 · U · I)',
    energyStateEn: 'Three-Phase Electric Power (S = √3 · U · I)',
    equipmentId: 'eq-generator',
    iconName: 'Zap',
    color: '#e11d48'
  },
  {
    id: 'stage-terminals',
    stepNumber: 13,
    labelFr: 'Bornes & Gaines Étoilées (IPB)',
    labelEn: 'Generator Terminals & IPB',
    subtitleFr: 'Gaines à phases isolées (Iso-Phase Bus) pour forts courants',
    subtitleEn: 'Isolated Phase Busduct (IPB) carrying high phase currents',
    voltageLevel: '15 kV',
    energyStateFr: 'Fort Courant Moyenne Tension (ex: 2 700 A)',
    energyStateEn: 'High-Current Medium Voltage Bus (e.g. 2 700 A)',
    equipmentId: 'eq-terminals',
    iconName: 'Cpu',
    color: '#c026d3'
  },
  {
    id: 'stage-gcb',
    stepNumber: 14,
    labelFr: 'Disjoncteur de Générateur (GCB)',
    labelEn: 'Generator Circuit Breaker (GCB)',
    subtitleFr: 'Coupure ultra-rapide des défauts internes et couplage réseau',
    subtitleEn: 'High-rupture SF6/vacuum breaker for generator coupling/clearing',
    voltageLevel: '15 kV',
    energyStateFr: 'Protection & Commutation de Puissance Active',
    energyStateEn: 'Active Power Sectioning & Fault Interruption',
    equipmentId: 'eq-gcb',
    iconName: 'Power',
    color: '#9333ea'
  },
  {
    id: 'stage-gsu',
    stepNumber: 15,
    labelFr: 'Transformateur Élévateur (GSU)',
    labelEn: 'Generator Step-Up Transformer',
    subtitleFr: 'Élévation de tension 15 kV → 225 kV pour réduire les pertes I²R',
    subtitleEn: 'Voltage stepping 15 kV → 225 kV to minimize line losses',
    voltageLevel: '15 kV → 225 kV',
    energyStateFr: 'Énergie Électrique Très Haute Tension (THT)',
    energyStateEn: 'Extra High Voltage (EHV) Bulk Electric Power',
    equipmentId: 'eq-gsu',
    iconName: 'Box',
    color: '#7c3aed'
  },
  {
    id: 'stage-switchyard',
    stepNumber: 16,
    labelFr: 'Poste Évacuation HTB',
    labelEn: 'High-Voltage Switchyard',
    subtitleFr: 'Jeux de barres 225 kV, travées départs, sectionneurs et TC/TT',
    subtitleEn: '225 kV busbars, line bays, disconnectors and CT/VT sets',
    voltageLevel: '225 kV',
    energyStateFr: 'Routage & Sécurisation Réseau National',
    energyStateEn: 'High-Voltage Power Routing & Line Injection',
    equipmentId: 'eq-switchyard',
    iconName: 'GitCommit',
    color: '#4f46e5'
  },
  {
    id: 'stage-transmission',
    stepNumber: 17,
    labelFr: 'Raccordement Réseau (Lignes THT)',
    labelEn: 'Transmission Connection / Grid',
    subtitleFr: 'Injection sur le Réseau Interconnecté (ex: RIS Cameroun)',
    subtitleEn: 'Interconnection with National Grid (e.g. RIS Cameroon)',
    voltageLevel: '225 kV HTB',
    energyStateFr: 'Énergie Injectée au Dispatching Central (SONATREL)',
    energyStateEn: 'Dispatched Power to National Control Center',
    equipmentId: 'eq-grid',
    iconName: 'Radio',
    color: '#2563eb'
  }
];

export const HYDRO_EQUIPMENT_MAP: Record<string, ProductionEquipment> = {
  'eq-river': {
    id: 'eq-river',
    name: 'Bassin Versant & Fleuve Sanaga',
    nameEn: 'Catchment Basin & River Flow',
    tag: 'HYD-CAT-01',
    category: 'hydraulic',
    subsystem: 'Hydrologie & Bassin Versant',
    iconName: 'Waves',
    definition: 'Bassin récepteur hydrographique collectant les précipitations météorologiques et les écoulements de surface pour alimenter le cours d\'eau principal.',
    purpose: 'Fournir le débit d\'apport volumique (Q en m³/s) nécessaire à la production hydroélectrique continue ou régulée.',
    operatingPrinciple: 'Lois du cycle de l\'eau, précipitation, infiltration et ruissellement gravitaire vers l\'exutoire.',
    physicalConstruction: 'Formations géologiques naturelles, lit mineur et lit majeur, berges stabilisées, enrochements de protection contre l\'érosion.',
    mainComponents: ['Lit mineur du fleuve', 'Berges rocheuses et alluvionnaires', 'Stations limnimétriques et hydrométriques', 'Sondeurs de crue'],
    energyFlow: {
      inflow: 'Énergie solaire évaporant l\'eau + Précipitations pluviales gravitaires',
      outflow: 'Énergie potentielle et cinétique de l\'écoulement libre : E = m · g · z + 0.5 · m · v²',
      lossMechanism: 'Pertes de charge par frottement sur le lit rugueux et méandres',
      efficiencyTypical: '98% (hydrologique net)'
    },
    electricalRole: 'Source primaire non électrique ; détermine l\'énergie électrique totale productible par an (GWh/an).',
    mechanicalRole: 'Exerce la poussée hydraulique sur les organes de déviation et de retenue.',
    control: 'Régulation amont via barrages-réservoirs de régularisation (ex: Mbakaou, Bamendjing, Mapé sur la Sanaga).',
    instrumentation: ['Sondes de niveau ultrasoniques et radar (4-20 mA)', 'Capteurs limnimétriques OTT', 'Débitmètres ADCP acoustiques', 'Pluviomètres télétransmis'],
    protection: {
      description: 'Seuils d\'alerte de crue centennale et millénale, débits d\'étiage minimum écologique (e-Flow).',
      tripActions: 'Déclenchement des procédures d\'ouverture des évacuateurs de crues.'
    },
    auxiliarySystems: ['Stations météo SCADA autonomes solaires', 'Transmissions satellitaires / OPGW GSM'],
    operatingStates: {
      normal: 'Écoulement nominal dans la courbe de tarage',
      starting: 'Montée progressive des eaux de crue saisonnière',
      running: 'Débit régulé suffisant pour turbinage à pleine charge',
      stopping: 'Période d\'étiage sévère avec débit inférieur au débit d\'armement',
      fault: 'Crue décennale/centennale excédant la capacité usinière',
      maintenance: 'Dragage et désensablement des hauts-fonds',
      isolated: 'Assec partiel en cas de déviation totale'
    },
    failureModes: ['Sécheresse prolongée / déficit pluviométrique', 'Ensablement massif par érosion des berges', 'Crues éclairs destructrices'],
    safetyConsiderations: ['Surveillance hydrométéorologique 24/7', 'Systèmes d\'alerte précoce aux populations riveraines aval'],
    maintenance: ['Relevés bathymétriques annuels au sonar multifaisceaux', 'Étalonnage périodique des courbes de tarage limnimétriques'],
    parameters: [
      { label: 'Module interannuel moyen', symbol: 'Q_m', typicalValue: '980', unit: 'm³/s', significance: 'Débit moyen régulé du fleuve Sanaga à Nachtigal' },
      { label: 'Débit de crue centennale', symbol: 'Q_100', typicalValue: '3 850', unit: 'm³/s', significance: 'Dimensionnement de sécurité des déversoirs' },
      { label: 'Débit d\'étiage garanti', symbol: 'Q_min', typicalValue: '600', unit: 'm³/s', significance: 'Débit soutenu par les barrages de retenue amont' }
    ],
    standards: ['WMO-No. 168 (Guide to Hydrological Practices)', 'ISO 1100-1 / ISO 748 (Liquid flow in open channels)'],
    upstreamEquipment: ['Bassin versant pluvial amont', 'Barrages réservoirs régulateurs (Mbakaou/Mapé)'],
    downstreamEquipment: ['Barrage de prise', 'Retenue usinière'],
    physicalRepresentation: 'Cours d\'eau méandrique naturel avec station hydrométrique à télémesure radar.',
    electricalRepresentation: 'Non électrique (représenté par le potentiel énergétique primaire MWh dans le modèle de dispatching).',
    functionalRepresentation: 'Bloc Source de Débit: Q(t) → f(pluie, stockage amont, évaporation).'
  },

  'eq-dam': {
    id: 'eq-dam',
    name: 'Barrage & Retenue de Nachtigal',
    nameEn: 'Main Dam & Headpond Reservoir',
    tag: 'HYD-DAM-01',
    category: 'hydraulic',
    subsystem: 'Ouvrages de Génie Civil',
    iconName: 'Shield',
    definition: 'Ouvrage d\'art transversal en béton compacté au rouleau (BCR) et digues en enrochement retenant l\'eau pour créer le plan d\'eau usinier.',
    purpose: 'Créer la chute brute motrice (H_brut) et créer une retenue tampon pour réguler les variations horaires de charge.',
    operatingPrinciple: 'Équilibre des forces hydrostatiques : la masse du béton s\'oppose au glissement et au basculement générés par la poussée de l\'eau.',
    physicalConstruction: 'Béton compacté au rouleau (BCR), parements amont/aval en béton conventionnel vibré (BCV), joints waterstop PVC et galeries de drainage.',
    mainComponents: ['Corps de barrage en BCR', 'Évacuateur de crues vanné (Creager)', 'Bassin de dissipation à ressaut', 'Galeries de visite et d\'auscultation', 'Rideau d\'injection et forages de drainage'],
    energyFlow: {
      inflow: 'Écoulement fluvial amont volumique Q_in',
      outflow: 'Débit turbiné vers la prise d\'eau + Débit écologique réservé (100 m³/s) + Débit évacué aux crues',
      lossMechanism: 'Évaporation superficielle et infiltrations résiduelles dans le massif rocheux',
      efficiencyTypical: '99.5% (rétention massique)'
    },
    electricalRole: 'Conditionne la tension et la puissance active produite par la hauteur de chute H : P = ρ·g·Q·H·η.',
    mechanicalRole: 'Supporte des poussées hydrostatiques de plusieurs centaines de milliers de kilonewtons.',
    control: 'Asservissement d\'ouverture des vannes de crue par automate de sécurité triple redondant (SIL-3).',
    instrumentation: ['Pendules droits et inversés (déformations horizontales)', 'Piézomètres à corde vibrante (sous-pressions de fondation)', 'Extensomètres multipoints', 'Accéléromètres sismiques triaxiaux'],
    protection: {
      description: 'Protection contre la surverse par évacuateurs de crues surdimensionnés (dimensionnés pour la crue millénale) et vannes clapet de décharge.',
      tripActions: 'Ouverture automatique d\'urgence des vannes segments par vérins oléohydrauliques avec accumulateurs d\'azote.'
    },
    auxiliarySystems: ['Centrale hydraulique oléohydraulique 210 bar', 'Groupe diesel de secours dédié aux vannes', 'Système de décolmatage des drains'],
    operatingStates: {
      normal: 'Niveau d\'eau à la cote normale d\'exploitation (RN 511.00 m NGF)',
      starting: 'Remplissage initial avec surveillance piézométrique continue',
      running: 'Régulation automatique du niveau de bief',
      stopping: 'Vidange partielle pour inspection décennale',
      fault: 'Surpression sous fondation anormale ou séisme majeur',
      maintenance: 'Réfection des joints d\'étanchéité et carottage de béton',
      isolated: 'Isolement des pertuis par batardeaux amont'
    },
    failureModes: ['Renard hydraulique (érosion interne sous fondation)', 'Surverse non contrôlée en cas de blocage de vannes', 'Glissement de fondation sous séisme'],
    safetyConsiderations: ['Plan d\'Urgence et d\'Alerte (PPI) avec sirènes radio aval', 'Auscultation topographique trimestrielle de haute précision'],
    maintenance: ['Rinçage sous pression des forages de drainage', 'Contrôle télévisuel des galeries immergées', 'Vérification des vérins et flexibles hydrauliques'],
    parameters: [
      { label: 'Hauteur de chute brute', symbol: 'H_brut', typicalValue: '51.5', unit: 'm', significance: 'Chute motrice disponible pour les turbines Francis' },
      { label: 'Cote Normale d\'Exploitation', symbol: 'RN', typicalValue: '511.00', unit: 'm NGF', significance: 'Niveau d\'eau de consigne du plan d\'eau' },
      { label: 'Capacité évacuateur de crues', symbol: 'Q_evac', typicalValue: '4 500', unit: 'm³/s', significance: 'Débit maximal évacuable en crue exceptionnelle' }
    ],
    standards: ['ICOLD / CIGB Bulletins (Dam Safety)', 'Eurocode 2 / CEI 61936-1 (Génie civil et ouvrages hydrauliques)'],
    upstreamEquipment: ['Fleuve amont', 'Retenue naturelle'],
    downstreamEquipment: ['Prise d\'eau usinière', 'Tronçon court-circuité (TCC)', 'Canal d\'amenée'],
    physicalRepresentation: 'Mur massif en béton BCR avec seuil déversant et vannes segments de crue.',
    electricalRepresentation: 'Alimentation des armoires de commande d\'auxiliaires 400 V / 230 V et boucle d\'arrêt d\'urgence 110 Vcc.',
    functionalRepresentation: 'Stockage d\'énergie potentielle hydraulique : E_p = ∫ ρ·g·z · dV.'
  },

  'eq-intake': {
    id: 'eq-intake',
    name: 'Prise d\'Eau Usinière',
    nameEn: 'Power Water Intake Structure',
    tag: 'HYD-INT-01',
    category: 'hydraulic',
    subsystem: 'Adduction Hydraulique',
    iconName: 'LogIn',
    definition: 'Ouvrage d\'entonnement submergé assurant la transition progressive de l\'eau du réservoir vers le canal d\'amenée ou les conduites.',
    purpose: 'Canaliser le débit de turbinage sans turbulences, sans vortex d\'aspiration d\'air et avec un minimum de pertes de charge.',
    operatingPrinciple: 'Loi de continuité hydraulique (Q = S · V) et profilage hydrodynamique en trompette pour éviter le décollement de la veine fluide.',
    physicalConstruction: 'Structure en béton armé massif ancrée au rocher, musoirs profilés, rainures pour batardeaux et seuil calé au-dessus de la couche de sédiments.',
    mainComponents: ['Trompette d\'aspiration profilée', 'Seuil anti-alluvionnaire surélevé', 'Musoirs de guidage hydrodynamique', 'Poutres de guidage pour batardeaux d\'entretien'],
    energyFlow: {
      inflow: 'Écoulement de retenue à très faible vitesse (< 0.5 m/s)',
      outflow: 'Écoulement d\'adduction accéléré (1.2 à 2.0 m/s)',
      lossMechanism: 'Perte de charge singulière à l\'entrée : ΔH = ξ_in · (V² / 2g)',
      efficiencyTypical: '99.2%'
    },
    electricalRole: 'Aucun direct ; actionneurs électriques triphasés 400 V pour manœuvre des vannes de prise.',
    mechanicalRole: 'Résiste aux charges hydrostatiques et à la traînée hydrodynamique des sédiments.',
    control: 'Contrôle de vitesse d\'écoulement pour éviter la submersion critique et l\'entraînement d\'air.',
    instrumentation: ['Capteurs de niveau différentiel amont/aval grilles', 'Sondes de vitesse à effet Doppler', 'Détecteurs d\'embâcles'],
    protection: {
      description: 'Protection contre le vortex et dépressions cavitationnelles par hauteur de submersion adéquate (critère de Gordon).',
      tripActions: 'Ordre de baisse de charge turbine si formation d\'un vortex avec entrée d\'air détectée.'
    },
    auxiliarySystems: ['Pont roulant de manutention des batardeaux', 'Système d\'éclairage sous-marin pour inspection ROV'],
    operatingStates: {
      normal: 'Passage régulier du débit turbiné nominal (ex: 980 m³/s à Nachtigal)',
      starting: 'Équilibrage de pression amont/aval avant levage des vannes',
      running: 'Écoulement sans décollement',
      stopping: 'Descente des vannes sous leur propre poids en fermeture d\'urgence',
      fault: 'Colmatage critique ou obstruction massive par billes de bois',
      maintenance: 'Mise en place des batardeaux et assèchement de la chambre',
      isolated: 'Pertuis fermé étanche'
    },
    failureModes: ['Aspiration de débris lourds endommageant les pales aval', 'Vortex d\'aspiration créant des instabilités d\'air dans la conduite'],
    safetyConsiderations: ['Lignes de vie et balises de sécurité pour embarcations amont', 'Interdiction de plongée sans consigne d\'arrêt complet des groupes'],
    maintenance: ['Contrôle d\'érosion du béton par plongeurs ou drone ROV', 'Remplacement des joints d\'étanchéité des rainures de batardeau'],
    parameters: [
      { label: 'Débit maximal d\'adduction', symbol: 'Q_intake', typicalValue: '980', unit: 'm³/s', significance: 'Alimente les 7 groupes de 60 MW à pleine charge' },
      { label: 'Vitesse moyenne d\'entrée', symbol: 'V_in', typicalValue: '1.45', unit: 'm/s', significance: 'Maintient la vitesse sous le seuil d\'entraînement de sédiments' },
      { label: 'Submersion minimale', symbol: 'S_min', typicalValue: '8.5', unit: 'm', significance: 'Empêche la formation de vortex avec prise d\'air' }
    ],
    standards: ['USACE EM 1110-2-1602 (Hydraulic Design of Reservoir Outlets)', 'CEI 60041 (Field acceptance tests of hydraulic turbines)'],
    upstreamEquipment: ['Retenue de barrage'],
    downstreamEquipment: ['Grilles de dégrillage', 'Vannes de tête'],
    physicalRepresentation: 'Ouvrage en béton avec pertuis multiples équipés de rainures de guidage.',
    electricalRepresentation: 'Alimentation 400V des treuils de levage et des capteurs de niveau 24 Vcc.',
    functionalRepresentation: 'Convergent hydraulique réducteur de pertes : H_net = H_brut - ΔH_in.'
  },

  'eq-trashrack': {
    id: 'eq-trashrack',
    name: 'Grilles de Dégrillage & Dégrilleur',
    nameEn: 'Trash Rack & Raking Machine',
    tag: 'HYD-TRK-01',
    category: 'hydraulic',
    subsystem: 'Filtration Hydraulique',
    iconName: 'Filter',
    definition: 'Ensemble de barreaux verticaux en acier inoxydable ou acier galvanisé disposés à l\'entrée de l\'ouvrage d\'adduction pour intercepter les débris.',
    purpose: 'Protéger les distributeurs et les aubes de turbine contre les débris solides, troncs d\'arbres et détritus flottants.',
    operatingPrinciple: 'Filtration mécanique par espacement géométrique calibré des barreaux (entrefer de 50 à 100 mm).',
    physicalConstruction: 'Panneaux modulaires en profilés hydrodynamiques en acier à haute résistance (S355J2), entretoises soudées, poutres maîtresses.',
    mainComponents: ['Barreaux profilés anti-vibrations', 'Châssis support et glissières', 'Dégrilleur automatique oléohydraulique mobile', 'Goulotte d\'évacuation des débris'],
    energyFlow: {
      inflow: 'Écoulement chargé de matières solides en suspension',
      outflow: 'Écoulement liquide filtré',
      lossMechanism: 'Perte de charge singulière par obstruction : Δh = K_rack · (t/b)^(4/3) · (V²/2g) · sin(α)',
      efficiencyTypical: '98.5% (faible perte de charge quand propre)'
    },
    electricalRole: 'Aucun direct ; actionnement des moteurs 400 V du chariot dégrilleur et automate SCADA.',
    mechanicalRole: 'Supporte la pression différentielle hydrostatique en cas de colmatage partiel (dimensionné pour résister à 3 à 5 m de ΔH).',
    control: 'Démarrage automatique du cycle de dégrillage par mesure de niveau différentiel (ΔH > 20 cm).',
    instrumentation: ['Capteurs de niveau à ultrasons amont et aval grilles', 'Pressostats différentiels 4-20 mA', 'Capteurs de fin de course du chariot dégrilleur'],
    protection: {
      description: 'Déclenchement d\'alarme de colmatage et arrêt d\'urgence des turbines si ΔH dépasse la limite admissible de structure (ex: ΔH > 80 cm).',
      tripActions: 'Alarme préventive à ΔH = 0.3 m ; Déclenchement groupe à ΔH = 0.8 m pour éviter l\'écrasement mécanique des grilles.'
    },
    auxiliarySystems: ['Dégrilleur automatique électrique/hydraulique', 'Bande transporteuse d\'évacuation des embâcles', 'Benne à déchets'],
    operatingStates: {
      normal: 'Grilles propres, perte de charge négligeable (< 5 cm)',
      starting: 'Cycle de raclage automatique en translation sur les pertuis',
      running: 'Filtration continue du débit nominal',
      stopping: 'Position de repos du dégrilleur en bout de voie',
      fault: 'Colmatage rapide lors de crues avec apport massif de bois',
      maintenance: 'Levage complet d\'un panneau de grille pour sablage et peinture',
      isolated: 'Grille hors d\'eau derrière batardeau'
    },
    failureModes: ['Rupture de barreaux par vibration aéro-acoustique (effet von Kármán)', 'Écrasement sous pression différentielle excessive', 'Blocage mécanique du râteau dégrilleur'],
    safetyConsiderations: ['Arrêt d\'urgence sur le chariot dégrilleur', 'Garde-corps et caillebotis sécurisés au-dessus des fosses'],
    maintenance: ['Nettoyage et inspection des profilés d\'acier', 'Graissage des rails de translation et câbles de levage'],
    parameters: [
      { label: 'Entrefer entre barreaux', symbol: 'e_barre', typicalValue: '65', unit: 'mm', significance: 'Bloque tout corps pouvant se coincer dans les aubes Francis' },
      { label: 'Perte de charge propre', symbol: 'ΔH_0', typicalValue: '0.04', unit: 'm', significance: 'Perte énergétique négligeable en régime nominal propre' },
      { label: 'Seuil d\'alarme colmatage', symbol: 'ΔH_alarm', typicalValue: '0.25', unit: 'm', significance: 'Enclenche le cycle de nettoyage automatique' }
    ],
    standards: ['USACE ETL 1110-2-584 (Design of Hydraulic Steel Structures)', 'DIN 19704 (Hydraulic Steel Structures)'],
    upstreamEquipment: ['Trompette de prise d\'eau'],
    downstreamEquipment: ['Vannes de tête de prise', 'Canal d\'amenée'],
    physicalRepresentation: 'Grille métallique inclinée à 70-80° balayée par un râteau mécanique.',
    electricalRepresentation: 'Alimentation armoire dégrilleur (400 V, 30 kW) et boucle analogique de niveau amont/aval.',
    functionalRepresentation: 'Filtre mécanique de sécurité : Protection amont des organes mobiles.'
  },

  'eq-gate': {
    id: 'eq-gate',
    name: 'Vannes de Tête de Prise d\'Eau',
    nameEn: 'Intake Emergency Shut-Off Gates',
    tag: 'HYD-GAT-01',
    category: 'hydraulic',
    subsystem: 'Organes de Sécurité Hydraulique',
    iconName: 'Sliders',
    definition: 'Vannes wagon (roller gates) verticales en acier de sécurité disposées à l\'amont immédiat de la galerie ou de la conduite d\'adduction.',
    purpose: 'Permettre la coupure étanche rapide de l\'écoulement en cas de rupture de conduite ou pour la mise à sec d\'entretien.',
    operatingPrinciple: 'Descente par gravité sous le poids propre du tablier en acier (fermeture de sécurité intégrale même sans électricité).',
    physicalConstruction: 'Tablier caissonné en acier soudé à haute limite élastique, galets de roulement à roulements étanches, joints d\'étanchéité périphériques en élastomère profil "note de musique".',
    mainComponents: ['Tablier métallique mécano-soudé', 'Galets de roulement et rails de guidage inox', 'Tige de vérin oléohydraulique double effet', 'Système de by-pass d\'équilibrage de pression'],
    energyFlow: {
      inflow: 'Écoulement liquide traversant en position ouverte',
      outflow: 'Arrêt complet de l\'écoulement en position fermée',
      lossMechanism: 'Turbulences mineures autour des rainures en position ouverte',
      efficiencyTypical: '100% étanchéité en fermeture'
    },
    electricalRole: 'Moteurs électriques de la centrale oléohydraulique et bobines de déclenchement 110 Vcc de chute rapide.',
    mechanicalRole: 'Capable de couper le débit maximal en écoulement libre (coupure en survitesse) et d\'encaisser la pleine poussée hydrostatique statique.',
    control: 'Commande locale et télécommande SCADA depuis la salle de contrôle ; chute d\'urgence déclenchable par bouton-poussoir câblé direct.',
    instrumentation: ['Capteurs magnétostrictifs de position de vanne (0 à 100%)', 'Pressostats sur le vérin hydraulique', 'Détecteurs de fin de course inductifs étanches IP68'],
    protection: {
      description: 'Fermeture automatique par chute rapide commandée par rupture de conduite (survitesse d\'écoulement) ou arrêt d\'urgence général usine.',
      tripActions: 'Ouverture de l\'électrovanne de décharge : descente contrôlée en moins de 45 secondes sans à-coup.'
    },
    auxiliarySystems: ['Centrale hydraulique oléohydraulique 180 bar avec accumulateurs oléopneumatiques', 'Cric de levage d\'appoint'],
    operatingStates: {
      normal: 'Position haute verrouillée par taquets mécaniques',
      starting: 'Ouverture de la vanne by-pass pour équilibrer la pression avant levage',
      running: 'Totalement émergée hors de la veine d\'eau pour minimiser les pertes',
      stopping: 'Descente lente pilotée par vérin',
      fault: 'Chute rapide d\'urgence avec freinage hydraulique en fin de course',
      maintenance: 'Verrouillage physique par poutres de sécurité',
      isolated: 'Position basse reposant sur le seuil étanche'
    },
    failureModes: ['Blocage mécanique dans les glissières par corps étranger', 'Fuite des joints d\'étanchéité sous forte pression', 'Rupture d\'un flexible hydraulique'],
    safetyConsiderations: ['Verrouillage mécanique obligatoire avant toute pénétration humaine aval', 'Procédure LOTO (Lockout/Tagout) stricte'],
    maintenance: ['Contrôle d\'épaisseur d\'acier par ultrasons', 'Contrôle non destructif (ressuage/magnétoscopie) des soudures des galets'],
    parameters: [
      { label: 'Temps de fermeture d\'urgence', symbol: 'T_close', typicalValue: '40', unit: 's', significance: 'Isole l\'adduction avant vidange totale en cas de brèche' },
      { label: 'Pression de service hydraulique', symbol: 'P_hyd', typicalValue: '180', unit: 'bar', significance: 'Pression du fluide de manœuvre des vérins' },
      { label: 'Poids du tablier métallique', symbol: 'M_gate', typicalValue: '45', unit: 't', significance: 'Garantit la fermeture gravitaire en toute circonstance' }
    ],
    standards: ['DIN 19704 (Hydraulic Steel Structures - Calculation)', 'ASME Boiler and Pressure Vessel Code (Section VIII)'],
    upstreamEquipment: ['Grilles de dégrillage'],
    downstreamEquipment: ['Canal d\'amenée ou conduite forcée'],
    physicalRepresentation: 'Vanne guillotine à galets suspendue par un vérin vertical.',
    electricalRepresentation: 'Armoire électrique de puissance 400 V et boucle de sécurité incendie/urgence 110 Vcc SIL-3.',
    functionalRepresentation: 'Organe de sectionnement de sécurité amont : Blocage bi-directionnel de fluide.'
  },

  'eq-headrace': {
    id: 'eq-headrace',
    name: 'Canal d\'Amenée Bétonné de Nachtigal',
    nameEn: 'Lined Headrace Canal',
    tag: 'HYD-HRC-01',
    category: 'hydraulic',
    subsystem: 'Adduction Hydraulique',
    iconName: 'Compass',
    definition: 'Canal à ciel ouvert de 3.3 km de long, revêtu d\'une membrane d\'étanchéité bitumineuse et de béton de protection, reliant la prise d\'eau à la chambre de mise en charge.',
    purpose: 'Transporter le débit nominal de 980 m³/s de la retenue jusqu\'aux conduites usinières avec une pente minimale et une perte de charge réduite.',
    operatingPrinciple: 'Écoulement à surface libre uniforme régi par la formule de Manning-Strickler : V = K_s · R_h^(2/3) · I^(1/2).',
    physicalConstruction: 'Section trapézoïdale creusée en déblai/remblai, talus 2H/1V, géomembrane étanche en béton bitumineux de 8 cm, radier étanchéifié et système de drainage sous-jacent.',
    mainComponents: ['Radier et bajoyers revêtus de béton', 'Système de décharge et de trop-plein', 'Drains d\'évacuation sous radier avec clapets anti-retour', 'Ponts de franchissement routier'],
    energyFlow: {
      inflow: 'Écoulement gravitationnel continu à la cote de départ 511.00 m NGF',
      outflow: 'Écoulement arrivant à la chambre de charge à la cote 510.45 m NGF',
      lossMechanism: 'Frottement hydraulique sur les parois lisses : perte de charge linéaire ~0.55 m sur 3.3 km',
      efficiencyTypical: '98.9% (conservation de charge)'
    },
    electricalRole: 'Aucun direct ; balisage lumineux, instrumentation de niveau et caméras de vidéosurveillance alimentées en 230 V.',
    mechanicalRole: 'Résiste aux pressions hydrostatiques et aux variations de niveau rapides (ondes d\'intumescence lors des délestages).',
    control: 'Régulation passive par bief ; limitation des gradients de montée/descente d\'eau (dh/dt < 1 m/h) pour protéger les berges.',
    instrumentation: ['Sondes de niveau radar sur passerelles tous les 500 m', 'Stations d\'analyse de turbidité et sédimentométrie', 'Puits de piézométrie de berge'],
    protection: {
      description: 'Déversoir de sécurité latéral (surverse) pour évacuer le surplus d\'eau en cas de disjonction simultanée des 7 groupes sans rupture des digues.',
      tripActions: 'Évacuation gravitaire du volume d\'intumescence vers le fleuve Sanaga.'
    },
    auxiliarySystems: ['Postes de pompage de drainage de pied de talus', 'Caméras thermiques et optiques de surveillance périmétrique'],
    operatingStates: {
      normal: 'Écoulement laminaire subcritique régulier (Nombre de Froude Fr < 0.25)',
      starting: 'Mise en eau lente initiale pour tester l\'imperméabilité',
      running: 'Débit continu 980 m³/s sans turbulence de surface',
      stopping: 'Stabilisation des ondes de rejet lors d\'un arrêt brutal usine',
      fault: 'Glissement de talus ou soulèvement de radier par sous-pression',
      maintenance: 'Inspection décennale par bateaux sondeurs sonar',
      isolated: 'Assèchement par compartiments avec batardeaux intermédiaires'
    },
    failureModes: ['Fissuration du revêtement étanche et fuites dans le sous-sol', 'Soulèvement de la membrane bitumineuse par sous-pression de nappe phréatique', 'Glissement de terrain de remblai'],
    safetyConsiderations: ['Bouées de sauvetage et échelles de sortie tous les 100 m', 'Clôture de sécurité intégrale empêchant l\'accès des riverains'],
    maintenance: ['Débroussaillage régulier des abords et bermes', 'Nettoyage des sédiments décantés au fond du radier'],
    parameters: [
      { label: 'Longueur totale du canal', symbol: 'L_canal', typicalValue: '3 300', unit: 'm', significance: 'Relie le barrage de prise à l\'usine de Nachtigal' },
      { label: 'Largeur au miroir', symbol: 'B_top', typicalValue: '55', unit: 'm', significance: 'Garantit une vitesse d\'écoulement modérée (~1.6 m/s)' },
      { label: 'Coefficient de Strickler', symbol: 'K_s', typicalValue: '80', unit: 'm^(1/3)/s', significance: 'Béton lissé réduisant la perte de charge à 0.55 m' }
    ],
    standards: ['USBR (Design of Small Canals)', 'CIGB / ICOLD Bulletin on Hydroelectric Canals'],
    upstreamEquipment: ['Prise d\'eau usinière'],
    downstreamEquipment: ['Chambre de mise en charge', 'Conduites forcées'],
    physicalRepresentation: 'Canal trapézoïdal en béton de 55 m de large transportant une rivière artificielle.',
    electricalRepresentation: 'Boucle instrumentation télécom fibre optique le long des berges.',
    functionalRepresentation: 'Conduit gravitaire à faible perte de charge : H_aval = H_amont - J · L.'
  },

  'eq-surgetank': {
    id: 'eq-surgetank',
    name: 'Cheminée d\'Équilibre / Système Anti-Bélier',
    nameEn: 'Surge Tank & Surge Relief System',
    tag: 'HYD-STK-01',
    category: 'hydraulic',
    subsystem: 'Protection Hydraulique Transitoire',
    iconName: 'Maximize2',
    definition: 'Puits vertical à surface libre situé à la jonction entre la galerie d\'amenée en charge et les conduites forcées.',
    purpose: 'Amortir les surpressions et dépressions dynamiques (coups de bélier d\'Allievi) lors des fermetures et ouvertures rapides des turbines.',
    operatingPrinciple: 'Oscillation de masse d\'eau : l\'énergie cinétique du fluide en mouvement se transforme en énergie potentielle gravitationnelle par montée/descente d\'eau dans le puits.',
    physicalConstruction: 'Puits vertical circulaire foré dans le rocher sain, revêtu de béton armé, avec chambre d\'expansion supérieure et diaphragme d\'étranglement (orifice restreint) à la base.',
    mainComponents: ['Puits vertical en béton', 'Chambre d\'expansion supérieure', 'Chambre d\'expansion inférieure anti-désamorçage', 'Étranglement (diaphragme de freinage bidirectionnel)'],
    energyFlow: {
      inflow: 'Surpression d\'onde hydraulique en cas de délestage brutal de charge électrique',
      outflow: 'Fourniture immédiate d\'eau lors d\'une prise de charge rapide',
      lossMechanism: 'Dissipation de l\'onde par turbulence dans l\'étranglement bidirectionnel',
      efficiencyTypical: '96% d\'atténuation du pic de surpression'
    },
    electricalRole: 'Permet aux groupes de déclencher à pleine charge sans détruire les conduites d\'amenée.',
    mechanicalRole: 'Limite la surpression maximale à l\'amont de la turbine sous le seuil d\'élasticité de la conduite.',
    control: 'Dispositif entièrement passif et intrinsèquement sûr (gravitaire sans pièces mobiles).',
    instrumentation: ['Capteurs de niveau d\'eau radar redondants', 'Capteurs de pression dynamique à quartz piézoélectrique à réponse ultra-rapide (< 1 ms)'],
    protection: {
      description: 'Protège la galerie d\'amenée contre l\'éclatement (surpression) et contre l\'implosion par dépression (cavitation d\'air).',
      tripActions: 'Permet la fermeture rapide des directrices de turbine en moins de 6 secondes sans rupture hydraulique.'
    },
    auxiliarySystems: ['Système de ventilation naturelle haute', 'Résistances de chauffage antigel pour installations en climat froid'],
    operatingStates: {
      normal: 'Niveau d\'eau statique aligné avec la ligne piézométrique en régime permanent',
      starting: 'Oscillation descendante lors de l\'accélération des turbines',
      running: 'Oscillations mineures suivant les ajustements du régulateur de vitesse',
      stopping: 'Remontée d\'eau au niveau maximal de sécurité lors d\'un arrêt d\'urgence',
      fault: 'Oscillation maximale proche de la crête du puits lors d\'un déclenchement général',
      maintenance: 'Inspection des parois bétonnées au panier suspendu',
      isolated: 'Vidange conjointe avec la galerie d\'amenée'
    },
    failureModes: ['Débordement par le sommet si sous-dimensionné pour le double coup de bélier', 'Entraînement d\'air dans la conduite si la cote minimale descend sous le toit de la galerie'],
    safetyConsiderations: ['Clôture de protection autour de l\'orifice supérieur', 'Surveillance des mouvements de roche par extensomètres'],
    maintenance: ['Inspection visuelle de la cheminée et des diaphragmes', 'Contrôle des capteurs piézométriques et radar de niveau'],
    parameters: [
      { label: 'Diamètre intérieur du puits', symbol: 'D_st', typicalValue: '18', unit: 'm', significance: 'Section suffisante pour stabiliser les oscillations (critère de Thoma)' },
      { label: 'Hauteur totale du puits', symbol: 'H_st', typicalValue: '45', unit: 'm', significance: 'Contient l\'onde de montée maximale sans débordement' },
      { label: 'Période d\'oscillation de masse', symbol: 'T_osc', typicalValue: '115', unit: 's', significance: 'Période d\'oscillation lente eau de retenue ↔ cheminée' }
    ],
    standards: ['USBR Engineering Monograph No. 20 (Water Hammer)', 'CEI 61362 (Guide to specification of hydraulic turbine control systems)'],
    upstreamEquipment: ['Galerie d\'amenée en charge'],
    downstreamEquipment: ['Conduites forcées métalliques'],
    physicalRepresentation: 'Grande tour cylindrique en béton dominant le tracé de la conduite.',
    electricalRepresentation: 'Transmetteurs 4-20 mA HART de niveau et pression dynamique vers l\'automate usine.',
    functionalRepresentation: 'Capacité hydraulique d\'amortissement : A_st · (dz/dt) = Q_amont - Q_aval.'
  },

  'eq-penstock': {
    id: 'eq-penstock',
    name: 'Conduite Forcée Haute Pression (Penstock)',
    nameEn: 'High-Pressure Steel Penstock',
    tag: 'HYD-PEN-01',
    category: 'hydraulic',
    subsystem: 'Adduction Haute Pression',
    iconName: 'ArrowDownRight',
    definition: 'Tuyauterie métallique sous pression de fort diamètre conduisant l\'eau sous haute vitesse et haute pression depuis la chambre de charge jusqu\'à la bâche spirale.',
    purpose: 'Transmettre l\'énergie hydraulique de chute avec le minimum de frottement et contenir la pression totale statique plus le coup de bélier.',
    operatingPrinciple: 'Écoulement sous pression confiné accéléré : V = 4 à 6 m/s sous une pression relative P = ρ·g·H.',
    physicalConstruction: 'Viroles mécano-soudées en acier de construction navale à haute résistance (S690QL ou thermo-mécanique), frettage par anneaux d\'acier, massifs d\'ancrage en béton armé et joints de dilatation télescopiques.',
    mainComponents: ['Viroles d\'acier cintrées et soudées', 'Massifs d\'ancrage en béton massif aux coudes', 'Piles d\'appui intermédiaires à rouleaux ou patins en téflon', 'Joints de dilatation coulissants', 'Trou d\'homme d\'accès et clapets aérateurs de sécurité'],
    energyFlow: {
      inflow: 'Écoulement à vitesse modérée en provenance de la chambre de charge',
      outflow: 'Écoulement à haute vitesse et haute pression à l\'entrée de la bâche spirale',
      lossMechanism: 'Pertes de charge régulières par frottement de Darcy-Weisbach : ΔH_f = λ · (L/D) · (V²/2g)',
      efficiencyTypical: '98.2%'
    },
    electricalRole: 'Aucun direct ; liaison équipotentielle et mise à la terre contre les courants vagabonds et la foudre.',
    mechanicalRole: 'Supporte des contraintes circonférentielles de traction (formule de Barlow) : σ = (P · D) / (2 · e).',
    control: 'Clapets aérateurs de sécurité automatiques pour casser le vide en cas de vidange accidentelle d\'urgence.',
    instrumentation: ['Capteurs de pression acoustiques piézoélectriques', 'Détecteurs de rupture de conduite (survitesse différentielle ΔQ)', 'Jauges de contrainte extensométriques sur les viroles'],
    protection: {
      description: 'Protection mécanique contre l\'implosion par clapets aérateurs et coupure d\'urgence amont par vanne de tête si fuite détectée.',
      tripActions: 'Fermeture d\'urgence de la vanne de tête et déclenchement immédiat des groupes si ΔQ entrée/sortie > 5%.'
    },
    auxiliarySystems: ['Système de protection cathodique à courant imposé', 'Revêtement intérieur époxy haute résistance à l\'abrasion'],
    operatingStates: {
      normal: 'Sous pression nominale continue sans vibration',
      starting: 'Mise en pression progressive et purge d\'air par les évents',
      running: 'Passage du débit unitaire de 140 m³/s par groupe',
      stopping: 'Maintien sous pression en attente de démarrage rapide',
      fault: 'Coup de bélier transitoire avec surpression de 20 à 35%',
      maintenance: 'Vidange totale, ventilation forcée et inspection magnétoscopique des soudures',
      isolated: 'Vanne de tête fermée, vanne de pied fermée, purge ouverte'
    },
    failureModes: ['Implosion par mise sous vide lors d\'une fermeture trop rapide sans entrée d\'air', 'Rupture longitudinale de soudure sous fatigue oligocyclique', 'Corrosion interne et amincissement de paroi'],
    safetyConsiderations: ['Clapets casse-vide à double sécurité mécanique', 'Contrôle non destructif (ultrasons phased-array) à 100% des soudures'],
    maintenance: ['Mesure annuelle d\'épaisseur de tôle par ultrasons', 'Retouche du revêtement peinture anticorrosion'],
    parameters: [
      { label: 'Diamètre intérieur', symbol: 'D_penstock', typicalValue: '5.2', unit: 'm', significance: 'Chaque groupe de 60 MW est alimenté par sa conduite dédiée' },
      { label: 'Épaisseur de tôle d\'acier', symbol: 'e_acier', typicalValue: '28', unit: 'mm', significance: 'Acier à haute limite élastique résistant à 12 bar de pic' },
      { label: 'Vitesse nominale de l\'eau', symbol: 'V_eau', typicalValue: '5.2', unit: 'm/s', significance: 'Compromis optimal entre diamètre d\'acier et perte de charge' }
    ],
    standards: ['ASCE Manual No. 79 (Steel Penstocks)', 'EN 13445 (Unfired pressure vessels)'],
    upstreamEquipment: ['Chambre de mise en charge', 'Vanne de tête'],
    downstreamEquipment: ['Vanne d\'arrêt de pied (MIV)', 'Bâche spirale de turbine'],
    physicalRepresentation: 'Grand tube d\'acier incliné descendant la colline vers le bâtiment usine.',
    electricalRepresentation: 'Protection cathodique à potentiel imposé (-850 mV par rapport à électrode Cu/CuSO4).',
    functionalRepresentation: 'Tuyau sous haute pression : P_aval = P_amont + ρ·g·Δz - ΔH_f.'
  },

  'eq-miv': {
    id: 'eq-miv',
    name: 'Vanne de Pied de Conduite (Main Inlet Valve - MIV)',
    nameEn: 'Main Inlet Valve (MIV) Spherical / Butterfly',
    tag: 'HYD-MIV-01',
    category: 'mechanical',
    subsystem: 'Organes de Sécurité Turbine',
    iconName: 'Disc',
    definition: 'Vanne sphérique ou vanne papillon à double excentration située immédiatement à l\'entrée de la bâche spirale de chaque turbine.',
    purpose: 'Isoler hydrauliquement la turbine à l\'arrêt pour éliminer les fuites de directrices et assurer la coupure de sécurité.',
    operatingPrinciple: 'Rotation à 90° d\'un opercule sphérique percé d\'un alésage cylindrique de même diamètre que la conduite (perte de charge quasi nulle ouvert).',
    physicalConstruction: 'Corps en acier moulé en deux parties, rotor sphérique en acier forgé, tourillons montés sur paliers autolubrifiants, servomoteurs oléohydrauliques à contrepoids de fermeture gravitaire.',
    mainComponents: ['Rotor sphérique poli miroir', 'Joints de service et joints d\'entretien amont gonflables', 'Contrepoids de fermeture de sécurité', 'Vanne by-pass d\'équilibrage de pression', 'Servomoteurs hydrauliques haute pression'],
    energyFlow: {
      inflow: 'Écoulement à pleine pression en provenance de la conduite forcée',
      outflow: 'Écoulement admis sans perturbation dans la bâche spirale',
      lossMechanism: 'Perte de charge négligeable en pleine ouverture (coefficient ξ < 0.05)',
      efficiencyTypical: '99.9%'
    },
    electricalRole: 'Électrovannes 110 Vcc de commande, fin de course et verrouillages dans la séquence de démarrage automatique usine.',
    mechanicalRole: 'Supporte la pleine poussée hydraulique axiale fermée (ex: plus de 3 000 kN pour une conduite de 5 m sous 50 m de chute).',
    control: 'Piloté par l\'automate de groupe (PLC) ; séquence automatisée : ouverture by-pass → équilibrage ΔP < 5% → déverrouillage → ouverture vanne.',
    instrumentation: ['Transmetteurs de position 0-90° angulaires', 'Capteurs de pression amont et aval MIV pour détection d\'équilibrage', 'Détecteurs d\'enclenchement des joints d\'étanchéité'],
    protection: {
      description: 'Fermeture de sécurité par contrepoids même en cas de perte totale d\'électricité ou de pression d\'huile auxiliaire.',
      tripActions: 'Déclenchement instantané en cas de survitesse turbine non contrôlée par les directrices ou fuite bâche.'
    },
    auxiliarySystems: ['Centrale oléohydraulique 160 bar', 'Système d\'air comprimé pour le joint gonflable de maintenance'],
    operatingStates: {
      normal: 'Pleine ouverture à 90°, joint de service dégonflé',
      starting: 'Ouverture by-pass puis levée du contrepoids par vérin',
      running: 'Passage intégral du débit sans turbulence',
      stopping: 'Fermeture douce pilotée par vanne d\'étranglement hydraulique',
      fault: 'Chute rapide du contrepoids sous déclenchement d\'urgence',
      maintenance: 'Verrouillage mécanique et gonflage du joint de maintenance amont',
      isolated: 'Bloquée fermée, bâche spirale vidangée'
    },
    failureModes: ['Blocage du rotor par corps solide étranger', 'Fuite du joint d\'étanchéité métallique sous pression', 'Défaillance de l\'électrovanne de déclenchement'],
    safetyConsiderations: ['Le joint d\'entretien permet d\'intervenir sur la turbine sans vider la conduite forcée', 'Verrou mécanique anti-rotation obligatoire'],
    maintenance: ['Contrôle d\'étanchéité des bagues en bronze', 'Vidange et analyse de l\'huile du servomoteur'],
    parameters: [
      { label: 'Diamètre nominal', symbol: 'DN', typicalValue: '4 800', unit: 'mm', significance: 'S\'adapte exactement à la section de la conduite forcée' },
      { label: 'Pression nominale', symbol: 'PN', typicalValue: '16', unit: 'bar', significance: 'Dimensionné pour 1.6 MPa avec marge de coup de bélier' },
      { label: 'Temps de fermeture de sécurité', symbol: 'T_miv', typicalValue: '35', unit: 's', significance: 'Fermeture contrôlée évitant une surpression destructive' }
    ],
    standards: ['CEI 60545 (Guide for commissioning of hydraulic turbines)', 'ASME Code for Pressure Piping'],
    upstreamEquipment: ['Conduite forcée'],
    downstreamEquipment: ['Bâche spirale', 'Distributeur de turbine'],
    physicalRepresentation: 'Vanne sphérique massive entourée de deux vérins hydrauliques à contrepoids.',
    electricalRepresentation: 'Interface TOR 110 Vcc et boucles de verrouillage matériel câblé (hardwired interlocks).',
    functionalRepresentation: 'Interrupteur hydraulique de puissance : Tout ou Rien.'
  },

  'eq-turbine': {
    id: 'eq-turbine',
    name: 'Turbine Francis à Axe Vertical',
    nameEn: 'Vertical-Shaft Francis Hydro-Turbine',
    tag: 'HYD-TUR-01',
    category: 'mechanical',
    subsystem: 'Conversion Électromécanique Primaire',
    iconName: 'RotateCw',
    definition: 'Turbine hydraulique à réaction de 60 MW à axe vertical, combinant un écoulement radial centripète à l\'admission et axial à l\'échappement.',
    purpose: 'Transformer l\'énergie de pression et de vitesse de l\'eau en couple mécanique rotatif transmis à l\'alternateur.',
    operatingPrinciple: 'Théorème d\'Euler pour les turbomachines : Couple C = ρ · Q · (r1·V_u1 - r2·V_u2). La variation de quantité de mouvement produit le couple mécanique.',
    physicalConstruction: 'Roue monolithique en acier inoxydable martensitique à 13% Chrome - 4% Nickel (X4CrNi13-4) résistant à la cavitation, bâche spirale mécano-soudée, avant-distributeur et distributeur à 24 directrices mobiles.',
    mainComponents: ['Bâche spirale en acier', 'Avant-distributeur à aubes fixes', 'Distributeur à 24 directrices mobiles asservies', 'Roue (runner) Francis monobloc', 'Aspirateur diffuseur (draft tube) coudé', 'Presse-étoupe à garniture mécanique étanche'],
    energyFlow: {
      inflow: 'Débit d\'eau sous pression : P_hyd = ρ · g · Q · H_net (ex: 63.8 MW hydrauliques)',
      outflow: 'Couple mécanique sur l\'arbre : P_m = C · ω = 60.0 MW mécaniques',
      lossMechanism: 'Frottement de disque, tourbillons d\'échappement, fuites aux labyrinthes, perte de charge draft-tube',
      efficiencyTypical: '94.2% au point de fonctionnement optimal (rendement de pointe)'
    },
    electricalRole: 'Entraîne l\'alternateur synchrone à sa vitesse de synchronisme exacte (n = 60 · f / p = 125 tr/min pour 50 Hz).',
    mechanicalRole: 'Génère un couple moteur nominal de 4 583 kN·m sur la ligne d\'arbre.',
    control: 'Régulateur de vitesse oléohydraulique numérique asservissant l\'anneau de vannage qui oriente les 24 directrices mobiles.',
    instrumentation: ['Capteurs de vitesse à roue phonique (capteurs inductifs triples)', 'Sondes de pression dynamique amont/aval roue', 'Capteurs de vibrations x-y et de déplacement d\'arbre (proximitors Bentley Nevada)'],
    protection: {
      description: 'Protection mécanique contre l\'emballement (overspeed), la cavitation excessive et les instabilités de vortex dans l\'aspirateur.',
      tripActions: 'Fermeture rapide du distributeur en 5.5 s par vérins hydrauliques avec accumulateurs d\'azote.'
    },
    auxiliarySystems: ['Centrale d\'huile de régulation haute pression (HPGO 100 bar)', 'Système d\'injection d\'air comprimé anti-vortex dans l\'aspirateur', 'Pompes de drainage de fond de bâche'],
    operatingStates: {
      normal: 'Fonctionnement régulé entre 40% et 105% de charge',
      starting: 'Accélération automatique jusqu\'à 100% de vitesse de synchronisme (125 tr/min)',
      running: 'Régulation de fréquence (primaire/secondaire) sur le réseau national',
      stopping: 'Fermeture progressive des directrices et injection de contre-couple si nécessaire',
      fault: 'Délestage pleine charge (full load rejection) avec montée transitoire en survitesse < 145%',
      maintenance: 'Inspection des bords de fuite de la roue pour contrôle de cavitation',
      isolated: 'Arrêt complet, MIV fermée, vannage verrouillé mécaniquement'
    },
    failureModes: ['Cavitation par érosion érosive sur l\'intrados des aubes', 'Fissures de fatigue vibratoire au raccordement aube/couronne', 'Instabilité de torche hélicoïdale (rope vortex) à charge partielle'],
    safetyConsiderations: ['Clavier de verrouillage mécanique de l\'anneau de vannage avant entrée en bâche spirale', 'Atmosphère contrôlée (détection de gaz O2/CO) en espace confiné'],
    maintenance: ['Rechargement par soudage inox des zones érodées par cavitation', 'Contrôle par ressuage des bords d\'attaque et de fuite'],
    parameters: [
      { label: 'Puissance nominale mécanique', symbol: 'P_nom', typicalValue: '60.0', unit: 'MW', significance: 'Puissance unitaire de chacun des 7 groupes de Nachtigal' },
      { label: 'Vitesse de rotation', symbol: 'n', typicalValue: '125', unit: 'tr/min', significance: 'Vitesse synchrone pour 24 paires de pôles à 50 Hz' },
      { label: 'Débit nominal turbiné', symbol: 'Q_nom', typicalValue: '140', unit: 'm³/s', significance: 'Débit par groupe sous chute nette de 50 m' }
    ],
    standards: ['CEI 60041 (Field acceptance tests of hydraulic turbines)', 'CEI 60193 (Hydraulic turbines, storage pumps - Model acceptance tests)'],
    upstreamEquipment: ['Vanne de pied MIV', 'Bâche spirale'],
    downstreamEquipment: ['Arbre mécanique', 'Aspirateur diffuseur (draft-tube)', 'Canal de fuite aval'],
    physicalRepresentation: 'Roue en inox massive de 4.2 m de diamètre entourée de directrices mobiles en cercle.',
    electricalRepresentation: 'Boucles de commande servovalve 4-20 mA du régulateur de vitesse et capteurs de proximité 24 Vcc.',
    functionalRepresentation: 'Convertisseur Thermo-Hydraulique en Énergie Mécanique : P_m = η_t · ρ · g · Q · H.'
  },

  'eq-shaft': {
    id: 'eq-shaft',
    name: 'Ligne d\'Arbre, Paliers & Butée',
    nameEn: 'Shaft Line, Guide Bearings & Thrust Bearing',
    tag: 'HYD-SHT-01',
    category: 'mechanical',
    subsystem: 'Transmission Mécanique',
    iconName: 'Activity',
    definition: 'Arbre vertical forgé en acier allié reliant rigidement la roue de turbine au rotor de l\'alternateur, guidé par des paliers radiaux et supporté par une butée axiale.',
    purpose: 'Transmettre le couple mécanique moteur de 4.58 MN·m et reprendre l\'intégralité des charges axiales (poids des pièces tournantes + poussée hydraulique).',
    operatingPrinciple: 'Lévitation hydrodynamique par film d\'huile sous patins oscillants (effet coin d\'huile de Reynolds) et guidage radial à jeu micrométrique.',
    physicalConstruction: 'Arbre forgé creux en acier 34CrNiMo6 avec plateaux d\'accouplement usinés dans la masse, boulons précontraints hydrauliquement, butée axiale à patins orientables garnis de métal blanc (babbitt) ou PTFE.',
    mainComponents: ['Arbre forgé intermédiaire', 'Plateaux d\'accouplement boulonnés', 'Butée axiale principale à patins oscillants', 'Palier guide turbine inférieur', 'Palier guide alternateur combiné supérieur', 'Système d\'injection d\'huile haute pression (jacking oil)'],
    energyFlow: {
      inflow: 'Couple mécanique de torsion sur plateau inférieur : C = 4.58 MN·m',
      outflow: 'Couple mécanique restitué sans perte angulaire au rotor supérieur',
      lossMechanism: 'Frottement visqueux dans le film d\'huile des paliers : ~250 kW dissipés en chaleur',
      efficiencyTypical: '99.6%'
    },
    electricalRole: 'Bague de mise à la terre d\'arbre (shaft grounding brush) pour éliminer les tensions induites et protéger les roulements contre l\'érosion électrique.',
    mechanicalRole: 'Supporte un poids tournant de 350 tonnes plus une poussée hydraulique axiale descendante de 450 tonnes (charge totale sur la butée = 800 tonnes !).',
    control: 'Contrôle automatique du groupe d\'injection HP pour décollement d\'arbre avant rotation (levage de 0.1 mm).',
    instrumentation: ['Sondes de température PT100 doubles intégrées dans chaque patin de butée', 'Capteurs de déplacement radial x-y sans contact', 'Capteurs de niveau et débit d\'huile de lubrification'],
    protection: {
      description: 'Déclenchement d\'urgence immédiat en cas d\'échauffement de patin de butée (T > 85°C) ou vibration radiale excessive (D > 120 µm).',
      tripActions: 'Déclenchement électrique du groupe, fermeture rapide du distributeur et application des freins mécaniques.'
    },
    auxiliarySystems: ['Groupe de jacking oil 150 bar', 'Centrale de circulation et réfrigération d\'huile de palier avec échangeurs eau/huile'],
    operatingStates: {
      normal: 'Rotation stable à 125 tr/min, film d\'huile hydrodynamique de 40 µm, T_huile = 55°C',
      starting: 'Injection jacking HP pour créer un film d\'huile avant rotation (démarrage à sec interdit)',
      running: 'Températures et vibrations stabilisées sous charge',
      stopping: 'Réactivation du jacking oil à basse vitesse (< 20 tr/min) pour éviter le contact métal-métal',
      fault: 'Rupture du film d\'huile (bearing wipe) provoquant la fusion du métal blanc',
      maintenance: 'Désaccouplement et contrôle de faux-rond (runout check) par comparateurs',
      isolated: 'Groupe sur vérins de calage mécanique'
    },
    failureModes: ['Grippage ou fusion des patins par perte d\'huile de lubrification', 'Vibrations critiques par balourd mécanique ou désalignement des arbres', 'Érosion par décharges électriques d\'arbre (courants de palier)'],
    safetyConsiderations: ['Interdiction stricte de rotation manuelle sans enclenchement du jacking oil', 'Garde de protection autour de l\'arbre tournant'],
    maintenance: ['Analyse spectrale d\'huile toutes les 2 000 heures (détection de particules d\'usure)', 'Contrôle d\'alignement laser au micron'],
    parameters: [
      { label: 'Diamètre de l\'arbre', symbol: 'D_arbre', typicalValue: '950', unit: 'mm', significance: 'Acier massif forgé capable d\'encaisser le couple de court-circuit' },
      { label: 'Charge totale sur la butée', symbol: 'F_axial', typicalValue: '8 000', unit: 'kN', significance: '800 tonnes supportées sur le film d\'huile de la butée' },
      { label: 'Vibration radiale admissible', symbol: 'S_max', typicalValue: '75', unit: 'µm', significance: 'Seuil d\'alarme conforme à la norme ISO 10816-5' }
    ],
    standards: ['ISO 10816-5 (Mechanical vibration - Evaluation of hydro-electric units)', 'ISO 7919-5 (Measurement of shaft vibrations in hydraulic power plants)'],
    upstreamEquipment: ['Roue Francis'],
    downstreamEquipment: ['Rotor de l\'alternateur synchrone'],
    physicalRepresentation: 'Colonne cylindrique verticale polie reliant turbine et générateur dans le puits usine.',
    electricalRepresentation: 'Balais de mise à la terre d\'arbre avec shunt de mesure du courant de fuite.',
    functionalRepresentation: 'Ligne de transmission mécanique de puissance : P = C · ω.'
  },

  'eq-generator': {
    id: 'eq-generator',
    name: 'Alternateur Synchrone Triphasé (70 MVA)',
    nameEn: '70 MVA Three-Phase Synchronous Generator',
    tag: 'ELEC-GEN-01',
    category: 'electromagnetic',
    subsystem: 'Génération Électrique Principale',
    iconName: 'Zap',
    definition: 'Générateur synchrone triphasé à pôles saillants de 70 MVA / 60 MW, 15 kV, 50 Hz, cos φ = 0.85, couplé à la turbine Francis.',
    purpose: 'Convertir la puissance mécanique rotative de l\'arbre en énergie électrique triphasée régulée en tension et en fréquence.',
    operatingPrinciple: 'Loi de Faraday d\'induction électromagnétique : un champ magnétique continu tournant (rotor excité) induit un système de forces électromotrices triphasées sinusoïdales dans les enroulements statoriques fixes.',
    physicalConstruction: 'Rotor à 48 pôles saillants bobinés en cuivre plat émaillé, jante rotorique en tôles frettées, stator feuilleté en tôles magnétiques à faibles pertes, bobinage statorique en barres Roebel isolées Classe F (résine époxy sous vide VPI).',
    mainComponents: ['Stator avec carcasse mécano-soudée', 'Noyau magnétique feuilleté statorique', 'Enroulements statoriques à barres Roebel 15 kV', 'Rotor à pôles saillants et enroulements d\'amortissement (cage d\'écureuil)', 'Système d\'excitation sans balais (brushless) ou statique', 'Système de réfrigération air/eau à circuit fermé (échangeurs cooler)'],
    energyFlow: {
      inflow: 'Puissance mécanique sur l\'arbre : P_m = 60.8 MW + Puissance d\'excitation CC : P_exc = 250 kW',
      outflow: 'Puissance électrique triphasée active : P_e = 60.0 MW + Puissance réactive Q = 37.2 Mvar (70 MVA)',
      lossMechanism: 'Pertes fer statoriques (hystérésis/Foucault), pertes Joule cuivre stator/rotor, pertes par ventilation et frottements',
      efficiencyTypical: '98.5% à pleine charge'
    },
    electricalRole: 'Génère la tension triphasée d\'évacuation à 15 000 V entre phases ; contrôle la tension via l\'excitation et la fréquence via la vitesse.',
    mechanicalRole: 'Exerce un couple électromagnétique résistant opposé au couple moteur : C_e = P_e / ω.',
    control: 'Régulateur Automatique de Tension (AVR) pilotant le courant d\'excitation continu I_f pour maintenir U = 15 kV ± 0.5% et réguler Q.',
    instrumentation: ['Sondes de température PT100 réparties dans les encoches statoriques (RTD stator)', 'Transformateurs de courant (TC) et de tension (TT) de mesure et protection', 'Détecteurs de flux d\'entrefer (flux probes)', 'Capteurs d\'arcs et de décharges partielles (couplers capacitifs)'],
    protection: {
      ansiCodes: ['87G', '64S', '64R', '51V', '59', '27', '81O/U', '32R', '40', '46', '24', '49'],
      description: 'Panoplie complète de protection différentielle, terre stator/rotor, déséquilibre inverse, perte d\'excitation et surfluxage.',
      tripActions: 'Ouverture instantanée du disjoncteur groupe (GCB), désexcitation rapide du rotor et fermeture de sécurité turbine.'
    },
    auxiliarySystems: ['Système d\'extinction incendie automatique par CO2 / brouillard d\'eau', 'Système de chauffage de maintien à l\'arrêt (résistances anti-condensation)', 'Groupe d\'excitation et pont de thyristors'],
    operatingStates: {
      normal: 'Débit de puissance nominal 60 MW / 70 MVA sous 15 kV avec cos φ = 0.85',
      starting: 'Accélération jusqu\'à 125 tr/min, amorçage de l\'excitation, synchronisation réseau',
      running: 'Couplé au réseau national en participation au réglage f-U',
      stopping: 'Décharge de puissance active, désexcitation puis ouverture disjoncteur',
      fault: 'Court-circuit statorique ou perte d\'excitation : déclenchement en moins de 60 ms',
      maintenance: 'Essai diélectrique 15 kV (mesure d\'isolement mégohmmètre / tangente delta)',
      isolated: 'Déconnecté du réseau, barres de terre posées'
    },
    failureModes: ['Claquant d\'isolement statorique phase-terre ou phase-phase', 'Défaut de mise à la terre du circuit d\'excitation rotorique', 'Surchauffe d\'enroulement par perte de débit d\'eau de refroidissement'],
    safetyConsiderations: ['Tension résiduelle mortelle après arrêt : décharge obligatoire par perche de terre avant contact', 'Système CO2 verrouillé mécaniquement lors des interventions humaines'],
    maintenance: ['Mesure annuelle de l\'indice de polarisation (IP) et décharges partielles', 'Resserrage des cales d\'encoches statoriques'],
    parameters: [
      { label: 'Puissance apparente nominale', symbol: 'S_nom', typicalValue: '70', unit: 'MVA', significance: 'Capacité totale de génération de l\'alternateur' },
      { label: 'Tension nominale entre phases', symbol: 'U_nom', typicalValue: '15 000', unit: 'V', significance: 'Tension de génération moyenne tension usine' },
      { label: 'Courant nominal statorique', symbol: 'I_nom', typicalValue: '2 694', unit: 'A', significance: 'Courant nominal traversant les barres Roebel par phase' },
      { label: 'Facteur de puissance nominal', symbol: 'cos φ', typicalValue: '0.85', unit: '-', significance: 'Fournit de la puissance réactive pour soutenir le réseau' }
    ],
    standards: ['CEI 60034-1 (Rotating electrical machines - Rating and performance)', 'IEEE Std 115 (Test Procedure for Synchronous Machines)'],
    upstreamEquipment: ['Ligne d\'arbre mécanique de la turbine', 'Système d\'excitation AVR'],
    downstreamEquipment: ['Gaines à phases isolées (IPB)', 'Disjoncteur groupe (GCB)', 'Transformateur élévateur GSU'],
    physicalRepresentation: 'Grande machine cylindrique de 9 m de diamètre entourée de carters de refroidissement.',
    electricalRepresentation: 'Générateur synchrone triphasé connecté en étoile avec neutre relié à la terre par résistance/transformateur.',
    functionalRepresentation: 'Conversion Électromagnétique : E = 4.44 · f · N · Φ · K_w.'
  },

  'eq-terminals': {
    id: 'eq-terminals',
    name: 'Gaines à Phases Isolées (Isolated Phase Bus - IPB)',
    nameEn: 'Isolated Phase Busduct (IPB)',
    tag: 'ELEC-IPB-01',
    category: 'switchgear',
    subsystem: 'Évacuation Électrique Moyenne Tension',
    iconName: 'Cpu',
    definition: 'Système de canalisations électriques blindées où chaque conducteur de phase en aluminium est enfermé dans son propre tube métallique continu étanche mis à la terre.',
    purpose: 'Transporter le fort courant nominal de 2 700 A et résister aux courants de court-circuit sans risque de défaut biphasé ou triphasé.',
    operatingPrinciple: 'Blindage magnétique continu : les courants induits circulant dans les enveloppes en aluminium annulent le champ magnétique externe, supprimant les forces électrodynamiques entre phases.',
    physicalConstruction: 'Tubes conducteurs creux en aluminium de haute conductivité supportés par des isolateurs en résine époxy, logés dans des enveloppes extérieures cylindriques en aluminium étanche sous légère surpression d\'air sec déshydraté.',
    mainComponents: ['Conducteur central en aluminium', 'Enveloppe tubulaire continue en aluminium', 'Isolateurs supports en résine cycloaliphatique', 'Système de pressurisation d\'air sec avec compresseur et déshydrateur', 'Shunts flexibles de dilatation en cuivre étamé'],
    energyFlow: {
      inflow: 'Énergie électrique triphasée 15 kV directement issue des traversées alternateur',
      outflow: 'Énergie électrique injectée au disjoncteur groupe GCB et au transformateur élévateur GSU',
      lossMechanism: 'Pertes Joule dans le conducteur central et dans l\'enveloppe blindée : ~80 W/m',
      efficiencyTypical: '99.8%'
    },
    electricalRole: 'Assure une sécurité diélectrique absolue : transforme tout défaut électrique potentiel en simple défaut monophasé à la terre de faible courant.',
    mechanicalRole: 'Supporte les contraintes électrodynamiques massives lors d\'un court-circuit proche générateur (ex: 85 kA crête).',
    control: 'Régulation automatique de la pression d\'air sec intérieur (maintien à +50 mbar au-dessus de la pression atmosphérique ambiante).',
    instrumentation: ['Capteurs de pression et point de rosée d\'air sec', 'Capteurs de température infrarouge sur les raccords', 'Transformateurs de courant tores de mesure intégrés'],
    protection: {
      description: 'L\'enveloppe élimine la possibilité d\'un court-circuit phase-phase interne.',
      tripActions: 'En cas de défaut phase-terre, le relais de terre statorique 64S détecte le courant et déclenche le groupe.'
    },
    auxiliarySystems: ['Unité de traitement et séchage d\'air déshydraté (dry air pressurization unit)'],
    operatingStates: {
      normal: 'Transit de 2 694 A sans échauffement excessif (< 70°C sur enveloppe)',
      starting: 'Montée en charge progressive',
      running: 'Exploitation continue sous pression d\'air sec positive',
      stopping: 'Maintien de la pressurisation pour éviter toute pénétration d\'humidité',
      fault: 'Passage du courant de court-circuit sans déformation mécanique',
      maintenance: 'Ouverture des trappes de visite et test d\'isolement diélectrique',
      isolated: 'Déconnecté et mis à la terre aux extrémités'
    },
    failureModes: ['Condensation interne en cas de perte de pressurisation d\'air sec', 'Desserrage des liaisons boulonnées provoquant un point chaud thermique', 'Amorçage sur isolateur pollué'],
    safetyConsiderations: ['Enveloppes extérieures au potentiel zéro de la terre (toucher sans danger)', 'Interdiction d\'introduire des outils ferromagnétiques à proximité'],
    maintenance: ['Contrôle thermographique infrarouge semestriel des jonctions', 'Contrôle du point de rosée d\'air (-25°C requis)'],
    parameters: [
      { label: 'Courant nominal continu', symbol: 'I_nom', typicalValue: '3 150', unit: 'A', significance: 'Calibré avec marge thermique sur le courant groupe de 2 694 A' },
      { label: 'Courant de court-circuit admissible', symbol: 'I_cc', typicalValue: '63', unit: 'kA / 1s', significance: 'Résiste au défaut le plus sévère sans dommage' },
      { label: 'Tension de tenue diélectrique', symbol: 'U_test', typicalValue: '38', unit: 'kV', significance: 'Tenue à fréquence industrielle 50 Hz pendant 1 minute' }
    ],
    standards: ['CEI 62271-200 (High-voltage switchgear and controlgear)', 'IEEE Std C37.23 (Guide for Metal-Enclosed Bus)'],
    upstreamEquipment: ['Traversées de sortie de l\'alternateur'],
    downstreamEquipment: ['Disjoncteur de générateur (GCB)', 'Transformateur élévateur (GSU)'],
    physicalRepresentation: 'Trois gros tuyaux métalliques parallèles en aluminium cheminant entre la machine et les transformateurs.',
    electricalRepresentation: 'Liaison triphasée blindée représentée sur le schéma unifilaire par des barres 15 kV isolées.',
    functionalRepresentation: 'Canalisation électrique haute sécurité : P_out = P_in - 3 · R_bus · I².'
  },

  'eq-gcb': {
    id: 'eq-gcb',
    name: 'Disjoncteur de Générateur (Generator Circuit Breaker - GCB)',
    nameEn: 'Generator Circuit Breaker (GCB)',
    tag: 'ELEC-GCB-01',
    category: 'switchgear',
    subsystem: 'Appareillage de Coupure Moyenne Tension',
    iconName: 'Power',
    definition: 'Disjoncteur de puissance triphasé sous enveloppe métallique à coupure dans le gaz SF6 ou sous vide, intégré directement dans la gaine IPB.',
    purpose: 'Coupler l\'alternateur au réseau lors de la synchronisation et couper instantanément les courants de défauts internes ou externes.',
    operatingPrinciple: 'Extinction de l\'arc électrique par soufflage auto-pneumatique de gaz SF6 à haute rigidité diélectrique lors de la séparation ultra-rapide des contacts.',
    physicalConstruction: 'Trois pôles séparés étanches en aluminium intégrant chambre de coupure SF6, sectionneur série visible, sectionneurs de mise à la terre amont/aval, et mécanisme de manœuvre oléohydraulique ou à ressorts prébandés.',
    mainComponents: ['Chambre de coupure au SF6', 'Sectionneur de coupure visible intégré', 'Sectionneurs de mise à la terre rapides', 'Mécanisme de commande à ressorts ou électrohydraulique', 'Densimètres de gaz SF6 avec contacts d\'alarme'],
    energyFlow: {
      inflow: 'Énergie électrique triphasée 15 kV de l\'alternateur',
      outflow: 'Énergie électrique transmise au transformateur élévateur GSU',
      lossMechanism: 'Résistance de contact ultra-faible : pertes Joule négligeables (< 5 kW)',
      efficiencyTypical: '99.99%'
    },
    electricalRole: 'Capable d\'interrompre les courants de court-circuit avec composante apériodique asymétrique dépassant 100% (défauts sans passage par zéro).',
    mechanicalRole: 'Manœuvre mécanique extrêmement rapide : ouverture totale en moins de 45 millisecondes.',
    control: 'Piloté par l\'automate de groupe, le synchroniseur automatique (ANSI 25) et les relais de protection différentielle.',
    instrumentation: ['Densimètres compensés en température pour surveillance du gaz SF6', 'Capteurs de fin de course de position des contacts', 'Compteur de manœuvres mécanique'],
    protection: {
      description: 'Protège l\'alternateur et le transformateur contre les défauts réciproques ; fonction de défaillance disjoncteur (ANSI 50BF).',
      tripActions: 'Ouverture instantanée en cas de défaut interne machine ou transformateur pour circonscrire les dégâts en quelques dizaines de ms.'
    },
    auxiliarySystems: ['Moteur d\'armement des ressorts 110 Vcc', 'Résistances chauffantes anti-condensation'],
    operatingStates: {
      normal: 'Fermé, assurant la continuité parfaite du transit de puissance 60 MW',
      starting: 'Fermeture sur ordre du synchroniseur automatique (ANSI 25)',
      running: 'Surveillance permanente de la pression de SF6',
      stopping: 'Ouverture à puissance nulle commandée lors de l\'arrêt normal',
      fault: 'Coupure d\'urgence sur défaut en 40 ms',
      maintenance: 'Sectionneur ouvert, terre fermée amont et aval, commande condamnée',
      isolated: 'Pôles isolés et sécurisés pour essais'
    },
    failureModes: ['Baisse de pression de SF6 par micro-fuite', 'Blocage mécanique du mécanisme d\'armement', 'Érosion excessive des contacts d\'arc'],
    safetyConsiderations: ['Verrouillage mécanique interdisant la fermeture de la terre si le disjoncteur principal est fermé', 'Surveillance SF6 (gaz à effet de serre)'],
    maintenance: ['Mesure de la résistance de contact dynamique (micro-ohmmètre)', 'Analyse de la qualité du gaz SF6 (humidité, SO2, pureté)'],
    parameters: [
      { label: 'Courant nominal', symbol: 'I_nom', typicalValue: '4 000', unit: 'A', significance: 'Calibre continu assurant une exploitation sans échauffement' },
      { label: 'Pouvoir de coupure de court-circuit', symbol: 'I_sc', typicalValue: '63', unit: 'kA', significance: 'Capacité d\'extinction des défauts majeurs alternateur' },
      { label: 'Temps d\'ouverture propre', symbol: 'T_open', typicalValue: '38', unit: 'ms', significance: 'Temps d\'action ultra-court réduisant l\'énergie de défaut I²t' }
    ],
    standards: ['CEI / IEEE 62271-37-013 (High-voltage switchgear - Generator circuit-breakers)'],
    upstreamEquipment: ['Gaines IPB alternateur'],
    downstreamEquipment: ['Gaines IPB transformateur élévateur'],
    physicalRepresentation: 'Armoire métallique blindée s\'intercalant sur le parcours des trois gaines IPB.',
    electricalRepresentation: 'Disjoncteur triphasé débrochable avec sectionneurs amont/aval et mise à la terre.',
    functionalRepresentation: 'Organe de coupure et synchronisation réseau : Coupure en charge et sur défaut.'
  },

  'eq-gsu': {
    id: 'eq-gsu',
    name: 'Transformateur Élévateur de Groupe (GSU 70 MVA)',
    nameEn: '70 MVA Generator Step-Up Transformer (GSU)',
    tag: 'ELEC-GSU-01',
    category: 'transformer',
    subsystem: 'Transformation Haute Tension',
    iconName: 'Box',
    definition: 'Transformateur de puissance triphasé immergé dans l\'huile minérale de 70 MVA, rapport 15 kV / 225 kV, couplage YNd11.',
    purpose: 'Élever la tension générée de 15 kV à la tension de transport national de 225 kV afin de réduire le courant par 15 et diviser les pertes en ligne par 225.',
    operatingPrinciple: 'Loi d\'induction mutuelle de Maxwell : le flux magnétique alternatif circulant dans le circuit magnétique en tôles au silicium induit une tension proportionnelle au rapport du nombre de spires (U2 / U1 = N2 / N1 = 225 / 15 = 15).',
    physicalConstruction: 'Cuve en acier mécano-soudée renforcée sous vide, noyau magnétique à trois colonnes en tôles à grains orientés (Hi-B), enroulement BT en hélice cuivre, enroulement HT en galettes continues entrelacées, isolation en papier kraft thermiquement amélioré et huile minérale diélectrique.',
    mainComponents: ['Cuve principale et circuit magnétique', 'Enroulements BT (15 kV) et HT (225 kV)', 'Traversées capacitives HT 225 kV en résine RIP', 'Conservateur d\'huile avec membrane souple et dessiccateur d\'air à gel de silice', 'Système de refroidissement ODAF/ONAF avec aéroréfrigérants', 'Relais Buchholz, soupape de surpression et régleur de prises hors tension (NLTC)'],
    energyFlow: {
      inflow: 'Puissance électrique triphasée 15 kV / 2 694 A en provenance du GCB',
      outflow: 'Puissance électrique THT 225 kV / 180 A injectée vers le poste de départ',
      lossMechanism: 'Pertes à vide fer (magnétisation) : ~45 kW + Pertes en charge Joule cuivre (I²R) : ~240 kW',
      efficiencyTypical: '99.55% à pleine charge'
    },
    electricalRole: 'Assure l\'isolation galvanique complète entre le réseau interne de l\'usine (15 kV) et le réseau de transport interconnecté (225 kV).',
    mechanicalRole: 'Supporte des contraintes électrodynamiques radiales et axiales considérables lors d\'un court-circuit THT (forces de plusieurs mégannewtons).',
    control: 'Contrôle automatique des ventilateurs et pompes de refroidissement en fonction de la température de l\'huile (OTI) et des enroulements (WTI).',
    instrumentation: ['Relais Buchholz (ANSI 63) à double seuil (alarme gaz / déclenchement coup d\'huile)', 'Thermomètres OTI (huile) et WTI (enroulement avec image thermique)', 'Sondes d\'analyse des gaz dissous en ligne (DGA)', 'Capteurs de niveau d\'huile et de point de rosée'],
    protection: {
      ansiCodes: ['87T', '50/51', '50N/51N', '63', '49T', '24', '50BF'],
      description: 'Protection différentielle transformateur 87T, protection Buchholz cuve 63, protection contre les surintensités et surfluxage V/Hz.',
      tripActions: 'Déclenchement simultané ultra-rapide du disjoncteur 15 kV (GCB) et du disjoncteur 225 kV de départ poste.'
    },
    auxiliarySystems: ['Batterie de ventilateurs et moto-pompes de circulation d\'huile', 'Système d\'extinction incendie automatique par déluge d\'eau (sprinklers) et bac de rétention étanche avec séparateur d\'hydrocarbures'],
    operatingStates: {
      normal: 'Élévation continue de 60 MW sous 225 kV, température de point chaud < 98°C',
      starting: 'Mise sous tension avec appel de courant magnétisant (inrush current) sans déclenchement',
      running: 'Surveillance des gaz dissous dans l\'huile en continu',
      stopping: 'Déconnexion progressive',
      fault: 'Défaut interne de bobinage : déclenchement Buchholz/différentiel en < 40 ms',
      maintenance: 'Filtration, dégazage et régénération de l\'huile diélectrique',
      isolated: 'Sectionné côté 15 kV et 225 kV, mis à la terre'
    },
    failureModes: ['Dégradation thermique de l\'isolation papier par vieillissement ou humidité', 'Amorçage entre spires consécutif à une surtension de foudre', 'Dégagement d\'hydrogène et acétylène par point chaud interne'],
    safetyConsiderations: ['Mur coupe-feu en béton armé entre transformateurs adjacents', 'Fosse de rétention avec lit de galets étouffeurs de flammes'],
    maintenance: ['Analyse annuelle DGA en laboratoire accrédité (gaz dissous)', 'Mesure de tension de claquage diélectrique de l\'huile (> 60 kV/2.5 mm requis)'],
    parameters: [
      { label: 'Puissance assignée', symbol: 'S_nom', typicalValue: '70', unit: 'MVA', significance: 'Identique à la puissance nominale de l\'alternateur associé' },
      { label: 'Tension primaire / secondaire', symbol: 'U1 / U2', typicalValue: '15 / 225', unit: 'kV', significance: 'Rapport d\'élévation pour transit longue distance' },
      { label: 'Tension de court-circuit', symbol: 'Ucc', typicalValue: '12.5', unit: '%', significance: 'Limite le courant de court-circuit et assure la stabilité' },
      { label: 'Groupe de couplage', symbol: 'Couplage', typicalValue: 'YNd11', unit: '-', significance: 'Étoile à la terre côté 225 kV, triangle côté 15 kV' }
    ],
    standards: ['CEI 60076 (Power transformers - All parts)', 'IEEE Std C57.12.00 (General Requirements for Liquid-Immersed Distribution, Power Transformers)'],
    upstreamEquipment: ['Disjoncteur de groupe (GCB)', 'Gaines IPB 15 kV'],
    downstreamEquipment: ['Poste d\'évacuation 225 kV', 'Traversées THT'],
    physicalRepresentation: 'Grande cuve métallique entourée de radiateurs, surmontée de trois hautes traversées 225 kV en porcelaine ou résine.',
    electricalRepresentation: 'Symbole transformateur abaisseur/élévateur triphasé YNd11 avec neutre HT mis à la terre.',
    functionalRepresentation: 'Élévateur de potentiel électrostatique : U2 = m · U1 ; I2 = I1 / m.'
  },

  'eq-switchyard': {
    id: 'eq-switchyard',
    name: 'Poste d\'Évacuation HTB 225 kV de Nachtigal',
    nameEn: '225 kV High-Voltage Switchyard & Substation',
    tag: 'ELEC-SWY-01',
    category: 'switchgear',
    subsystem: 'Poste d\'Évacuation & Distribution THT',
    iconName: 'GitCommit',
    definition: 'Poste électrique extérieur isolé dans l\'air (AIS) à double jeu de barres 225 kV assurant la collecte des 7 groupes de production et le départ des lignes THT vers Yaoundé et Edéa.',
    purpose: 'Aiguiller, sectionner, protéger et mesurer l\'énergie électrique évacuée sous 225 000 Volts vers le réseau interconnecté national.',
    operatingPrinciple: 'Topologie double jeu de barres avec disjoncteur de couplage permettant d\'isoler n\'importe quel équipement pour entretien sans couper la production.',
    physicalConstruction: 'Charpentes métalliques en treillis galvanisé, isolateurs en composite silicone ou verre trempé, conducteurs tubulaires en aluminium pour jeux de barres, parafoudres à l\'oxyde de zinc (ZnO), clôture de sécurité avec maille de terre enfouie.',
    mainComponents: ['Double jeu de barres tubulaire 225 kV', 'Disjoncteurs de ligne et transformateur SF6 (ANSI 52)', 'Sectionneurs à coupure centrale avec couteaux de mise à la terre (ANSI 89/89E)', 'Transformateurs de courant (TC) et de tension capacitifs (CVT)', 'Parafoudres à oxyde de zinc ZnO (ANSI 18)', 'Travée de couplage de barres', 'Bâtiment de commande et de relayage'],
    energyFlow: {
      inflow: 'Énergie des 7 transformateurs de groupe sous 225 kV (jusqu\'à 420 MW cumulés)',
      outflow: 'Énergie injectée sur les lignes THT 225 kV vers le poste de Nyom 2 (Yaoundé)',
      lossMechanism: 'Effet couronne (corona) par temps de pluie et pertes Joule dans les conducteurs de poste (< 0.1%)',
      efficiencyTypical: '99.9%'
    },
    electricalRole: 'Point nodal d\'injection de forte puissance dans le Réseau Interconnecté Sud (RIS) camerounais.',
    mechanicalRole: 'Résiste aux contraintes électrodynamiques de court-circuit et aux charges climatiques de vent et de foudre.',
    control: 'Système d\'automatisation de poste (SAS) sous protocole CEI 61850 avec bus de station et bus de processus optique redondant (PRP).',
    instrumentation: ['Transformateurs de courant à trois enroulements secondaires (mesure, protection principale, protection de secours)', 'Diviseurs capacitifs de tension CVT', 'Contrôleurs de travée numériques (Bay Controllers)'],
    protection: {
      ansiCodes: ['87B', '21/21N', '50/51', '67', '50BF', '25', '27/59'],
      description: 'Protection différentielle de barres 87B ultra-rapide (15 ms), protection de distance des lignes 21, automatisme de réenclenchement 79.',
      tripActions: 'Élimination sélective de tout défaut de ligne ou de barre sans effondrement du reste du poste.'
    },
    auxiliarySystems: ['Source secourue 110 Vcc à batteries redondantes', 'Système d\'air comprimé ou accumulateurs de disjoncteurs', 'Réseau de terre maillé en cuivre 120 mm² enterré'],
    operatingStates: {
      normal: 'Exploitation en double jeu de barres réparties, disjoncteur de couplage fermé',
      starting: 'Mise sous tension graduelle travée par travée',
      running: 'Évacuation des 420 MW vers le réseau SONATREL',
      stopping: 'Bascule de tranches sur une seule barre pour travaux sur la seconde',
      fault: 'Défaut de ligne éliminé par ouverture unipolaire et réenclenchement monophasé',
      maintenance: 'Consignation d\'une travée avec terres visibles verrouillées par cadenas',
      isolated: 'Poste consigné'
    },
    failureModes: ['Amorçage de traversée sous foudre en cas de défaillance de parafoudre', 'Perte de pression de gaz SF6 sur un disjoncteur de ligne', 'Rupture d\'isolateur de barre'],
    safetyConsiderations: ['Distances d\'isolement dans l\'air strictement respectées (> 2.2 m phase-terre pour 225 kV)', 'Habilitation électrique THT obligatoire pour tout intervenant'],
    maintenance: ['Thermographie infrarouge trimestrielle de toutes les mâchoires de sectionneur', 'Mesure de résistance de terre globale du poste (< 0.5 Ohm requis)'],
    parameters: [
      { label: 'Tension nominale d\'exploitation', symbol: 'U_nom', typicalValue: '225', unit: 'kV', significance: 'Standard de transport régional et national THT' },
      { label: 'Tension maximale de service', symbol: 'U_max', typicalValue: '245', unit: 'kV', significance: 'Tension d\'isolement diélectrique continue' },
      { label: 'Courant de court-circuit assigné', symbol: 'I_cc', typicalValue: '40', unit: 'kA / 3s', significance: 'Tenue thermique et dynamique du jeu de barres' }
    ],
    standards: ['CEI 61936-1 (Power installations exceeding 1 kV a.c.)', 'CEI 62271-100 / CEI 62271-102 (High-voltage switchgear)', 'CEI 61850 (Substation Automation Systems)'],
    upstreamEquipment: ['Transformateurs élévateurs GSU'],
    downstreamEquipment: ['Lignes de transport 225 kV vers Yaoundé et Edéa', 'Réseau SONATREL'],
    physicalRepresentation: 'Grande esplanade extérieure avec portiques métalliques, isolateurs en verre et disjoncteurs THT.',
    electricalRepresentation: 'Schéma unifilaire à double jeu de barres avec travées départs, arrivées et couplage.',
    functionalRepresentation: 'Nœud électrique de transit et de protection : Σ I_entrants = Σ I_sortants.'
  },

  'eq-grid': {
    id: 'eq-grid',
    name: 'Réseau Interconnecté & Dispatching National',
    nameEn: 'National Transmission Grid & Dispatching Center',
    tag: 'ELEC-GRD-01',
    category: 'switchgear',
    subsystem: 'Interconnexion Réseau National',
    iconName: 'Radio',
    definition: 'Lignes aériennes de transport d\'électricité à 225 kV reliant la centrale de Nachtigal au Centre National de Conduite (Dispatching SONATREL de Mangombé/Edéa) et aux centres de consommation.',
    purpose: 'Acheminer l\'énergie électrique en vrac vers les métropoles urbaines (Yaoundé, Douala) et les industries lourdes (ex: ALUCAM).',
    operatingPrinciple: 'Équilibre synchrone offre-demande en temps réel : la somme de la puissance produite par les centrales doit égaler exactement la somme des consommations plus les pertes pour maintenir la fréquence f = 50.00 Hz.',
    physicalConstruction: 'Pylônes métalliques en treillis d\'acier galvanisé, conducteurs en faisceau Almélec (AAAC 570 mm²), câbles de garde avec fibres optiques intégrées (OPGW), chaînes d\'isolateurs en verre trempé.',
    mainComponents: ['Lignes aériennes 225 kV doubles ternes', 'Câbles de garde à fibre optique OPGW', 'Poste d\'interconnexion de Nyom 2', 'Système SCADA/EMS du Dispatching National'],
    energyFlow: {
      inflow: 'Énergie électrique brute 420 MW injectée au départ de Nachtigal',
      outflow: 'Énergie distribuée aux réseaux de distribution 30 kV et aux clients industriels',
      lossMechanism: 'Pertes par effet Joule dans les conducteurs (P_loss = 3 · R · I²) et pertes corona',
      efficiencyTypical: '97.5% sur les lignes de transport longue distance'
    },
    electricalRole: 'Maintient la tension et la stabilité dynamique du réseau national ; l\'inertie des 7 groupes stabilise la fréquence.',
    mechanicalRole: 'Supporte le poids des câbles, la tension mécanique (traction) et les charges de vent violent.',
    control: 'Téléconduite par le Dispatching National (AGC / Téléréglage fréquence-puissance) envoyant les consignes de production aux groupes.',
    instrumentation: ['Unités de mesure de phaseur synchrophasor PMU (norme IEEE C37.118)', 'Compteurs de facturation transactionnels classe 0.2S', 'Oscilloperturbographes numériques'],
    protection: {
      description: 'Protection contre les courts-circuits foudre par protection de distance (ANSI 21) et télé-action optique directe.',
      tripActions: 'Réenclenchement monophasé automatique en 1 seconde pour 80% des défauts foudre fugitifs.'
    },
    auxiliarySystems: ['Télécommunications numériques OPGW', 'Onduleurs de téléconduite 48 Vcc'],
    operatingStates: {
      normal: 'Fréquence stable à 50.00 Hz ± 0.05 Hz, tension à 225 kV ± 5%',
      starting: 'Raccordement d\'un groupe supplémentaire en rampe programmée',
      running: 'Participation au réglage primaire de fréquence (statisme s_p = 4%)',
      stopping: 'Baisse de charge planifiée selon le programme d\'engagement (merit order)',
      fault: 'Perte soudaine d\'une ligne THT : reprise de transit par les lignes parallèles',
      maintenance: 'Travaux sous tension (TST) ou consignation de ligne avec mise à la terre aux deux extrémités',
      isolated: 'Îlotage d\'une zone en cas d\'effondrement partiel du réseau'
    },
    failureModes: ['Écrasement de pylône sous tornade tropicale', 'Amorçage de phase sur végétation par élagage insuffisant', 'Instabilité transitoire ou oscillation inter-zones non amortie'],
    safetyConsiderations: ['Couloir de servitude de 50 m sous la ligne strictement déboisé', 'Balisage diurne et nocturne des pylônes proches des aéroports'],
    maintenance: ['Surveillance par hélicoptère ou drone avec caméra infrarouge et UV (détection corona)', 'Élagage préventif des arbres sous la ligne'],
    parameters: [
      { label: 'Tension de ligne', symbol: 'U_line', typicalValue: '225', unit: 'kV', significance: 'Tension nominale de transit interurbain' },
      { label: 'Capacité de transit thermique', symbol: 'P_transit', typicalValue: '550', unit: 'MVA', significance: 'Capacité de la ligne Nachtigal - Yaoundé' },
      { label: 'Longueur de ligne vers Yaoundé', symbol: 'L_ligne', typicalValue: '52', unit: 'km', significance: 'Distance vers le poste de transformation de Nyom 2' }
    ],
    standards: ['CEI 60826 (Design criteria of overhead transmission lines)', 'IEEE 738 (Standard for Calculating Current-Temperature of Bare Overhead Conductors)'],
    upstreamEquipment: ['Poste d\'évacuation 225 kV de Nachtigal'],
    downstreamEquipment: ['Postes abaisseurs 225/30 kV (Nyom 2, Bekoko, Mangombé)', 'Réseau de distribution Eneo'],
    physicalRepresentation: 'Pylônes métalliques élancés traversant la forêt et la savane avec 6 gros conducteurs.',
    electricalRepresentation: 'Modèle de ligne en Pi (R, L, C) reliant la barre de production à la barre de charge.',
    functionalRepresentation: 'Transport en vrac de l\'électricité : P_transmise = (V1 · V2 / X) · sin(δ).'
  }
};
