// src/components/ecosystem/ecosystemData.ts
import { SldTopologyType } from '../diagrams/modules/SldHeaderToolbar';

export type EcosystemViewMode = 'physical' | 'electrical' | 'functional';

export type EnergySourceType = 'hydro' | 'wind' | 'solar' | 'thermal' | 'biomass';

export interface EcosystemEquipmentDetail {
  id: string;
  badgeNumber: number;
  tagIec: string;
  name: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  stage: { fr: string; en: string };
  stageId: number;
  voltage: string;
  current: string;
  power: string;
  role: { fr: string; en: string };
  functionDetail: { fr: string; en: string };
  workingPrinciple: { fr: string; en: string };
  mainComponents: { fr: string[]; en: string[] };
  protectionTypes: string[];
  measurementTypes: string[];
  applicableStandards: string[];
  upstream: string;
  downstream: string;
  epedeDomainCode: 'D01' | 'D02' | 'D03' | 'D04' | 'D05' | 'D06' | 'D07' | 'D08' | 'D09' | 'D10' | 'D11' | 'D12' | 'D13' | 'D14' | 'D15' | 'D16';
  canonicalEquipmentId: string;
  imageUrl: string;
  // 3D coordinate on landscape
  coords: { x: number; y: number; z: number };
  // Screen marker percentage relative to 3D aerial canvas (for overlay matching exact prompt image)
  screenPos: { left: string; top: string };
}

export const ECOSYSTEM_EQUIPMENTS: EcosystemEquipmentDetail[] = [
  {
    id: 'eq-hydro-dam-01',
    badgeNumber: 1,
    tagIec: '=D01.G01-TURB',
    name: {
      fr: 'Centrale Hydroélectrique de Haute Chute',
      en: 'Hydroelectric Power Plant'
    },
    subtitle: {
      fr: 'Énergie hydraulique → Mécanique → Électrique',
      en: 'Water energy → Mechanical → Electrical'
    },
    stage: { fr: 'Production & Conversion Primaire', en: 'Generation & Primary Conversion' },
    stageId: 1,
    voltage: '10.5 kV - 15.75 kV',
    current: '2 640 A nominal',
    power: '48 MVA - 38.4 MW (Francis vertical)',
    role: {
      fr: 'Capture de l\'énergie potentielle du réservoir d\'eau par conduite forcée, conversion cinétique en couple mécanique sur l\'arbre de turbine Francis, puis induction électromagnétique dans l\'alternateur synchrone.',
      en: 'Harnesses reservoir gravitational potential head through penstock, converting into mechanical shaft torque in Francis turbine, driving synchronous generator electromagnetic conversion.'
    },
    functionDetail: {
      fr: 'Fourniture de puissance active de base et réglage primaire de fréquence-puissance (f/P) pour stabiliser le réseau interconnecté.',
      en: 'Provides active baseload power and primary frequency-power governor response to stabilize interconnected transmission grid.'
    },
    workingPrinciple: {
      fr: 'La chute d\'eau sous pression active les aubes motrices de la turbine couplée au rotor à pôles saillants bobiné. Le champ tournant induit une f.é.m. triphasée équilibrée dans les enroulements statoriques.',
      en: 'Pressurized water stream impinges runner blades coupled to wound salient rotor. Rotating magnetic field induces balanced 3-phase EMF across stator slots.'
    },
    mainComponents: {
      fr: ['Barrage-poids & retenue d\'eau', 'Prise d\'eau avec grille dégrilleuse', 'Vanne papillon de tête (MIV)', 'Conduite forcée acier mécano-soudé', 'Bâche spirale & aubes directrices', 'Rotor à pôles saillants & Stator', 'Système d\'excitation statique & AVR'],
      en: ['Gravity dam & reservoir impoundment', 'Intake structure with trash racks', 'Main Inlet Valve (MIV)', 'Welded steel penstock waterway', 'Spiral casing & wicket gates', 'Salient pole rotor & Stator core', 'Static brushless excitation & AVR']
    },
    protectionTypes: ['87G (Différentielle générateur)', '50/51 (Surintensité)', '59N (Mise à la terre stator)', '40 (Perte d\'excitation)', '24 (Volts/Hertz surfluxage)', '81O/81U (Fréquence)'],
    measurementTypes: ['TC & TP de mesure classe 0.2S', 'Synchrocoupleur ANSI 25', 'Capteurs de vibrations hydro', 'Sondes Pt100 paliers'],
    applicableStandards: ['CEI 60034-1 (Machines tournantes)', 'CEI 60041 (Turbines hydrauliques)', 'CEI 60255 (Relais de protection)', 'IEEE C37.102'],
    upstream: 'Bassin versant & Retenue fleuve',
    downstream: 'Disjoncteur générateur (GCB) → Transformateur élévateur',
    epedeDomainCode: 'D01',
    canonicalEquipmentId: 'eq-exp-hydro-gen-01',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    coords: { x: -35, y: 5, z: -10 },
    screenPos: { left: '17%', top: '15%' }
  },
  {
    id: 'eq-multi-sources-02',
    badgeNumber: 1,
    tagIec: '=D01.RES-MIX',
    name: {
      fr: 'Multi-Sources de Production d\'Énergie',
      en: 'Multiple Generation Sources'
    },
    subtitle: {
      fr: 'Hydro, Éolien, Solaire PV, Thermique, Biomasse',
      en: 'Hydro, Wind, Solar, Thermal, Biomass'
    },
    stage: { fr: 'Mix Énergétique & Production Décentralisée', en: 'Energy Mix & Distributed Generation' },
    stageId: 1,
    voltage: '690 V (BT) / 20 kV (HTA) / 225 kV (THT)',
    current: 'Variable selon la ressource active',
    power: 'Mix 100 MW crête injecté',
    role: {
      fr: 'Diversification du mix énergétique combinant l\'inertie des turbines hydrauliques/thermiques avec la rapidité des onduleurs solaires photovoltaïques et aérogénérateurs.',
      en: 'Grid energy mix diversification combining synchronous inertia of hydro/thermal units with fast dispatch of solar PV inverters and wind turbines.'
    },
    functionDetail: {
      fr: 'Garantir la sécurité d\'approvisionnement en lissant l\'intermittence des énergies renouvelables grâce à la régulation hydraulique et aux centrales d\'appoint.',
      en: 'Ensures security of supply smoothing renewable intermittency via hydro dispatch and peaking thermal generation assets.'
    },
    workingPrinciple: {
      fr: 'Conversion photonique (effet PV), cinétique aérodynamique (profils de pales d\'éoliennes) ou thermodynamique (cycle Rankine / Brayton) raccordés aux jeux de barres d\'évacuation.',
      en: 'Photovoltaic solid-state effect, aerodynamic lift on wind blades, or Rankine/Brayton thermodynamic cycles tied to collector busbars.'
    },
    mainComponents: {
      fr: ['Parc éolien (nacelles & multiplicateurs)', 'Centrale solaire PV avec trackers mono-axe', 'Onduleurs de chaîne string & centraux', 'Centrale thermique biomasse/gaz', 'Poste d\'évacuation et de couplage'],
      en: ['Wind farm (nacelles & gearless generators)', 'Utility-scale solar PV array with trackers', 'String & central grid-forming inverters', 'Biomass / thermal backup boiler', 'Evacuation collector substation']
    },
    protectionTypes: ['50/51', '27/59 (Tension)', '81U/81O (Fréquence)', 'Anti-îlotage (Loss of Mains 78/81R)'],
    measurementTypes: ['Anémomètres & Pyranomètres', 'Comptage bidirectionnel P/Q', 'Analyseurs de qualité d\'onde PQP'],
    applicableStandards: ['CEI 61400 (Éolien)', 'CEI 62109 (Onduleurs PV)', 'CEI 61727 (Raccordement réseau)', 'IEEE 1547'],
    upstream: 'Ressources naturelles : Vent, Soleil, Biomasse, Eau',
    downstream: 'Liaisons HTA/THT vers poste de regroupement',
    epedeDomainCode: 'D01',
    canonicalEquipmentId: 'eq-exp-hydro-gen-01',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    coords: { x: -30, y: 1, z: 12 },
    screenPos: { left: '19%', top: '51%' }
  },
  {
    id: 'eq-transmission-line-03',
    badgeNumber: 3,
    tagIec: '=D02.L225-BEK',
    name: {
      fr: 'Transport Haute Tension (Ligne THT 225 kV)',
      en: 'High Voltage Transmission'
    },
    subtitle: {
      fr: 'Transport d\'énergie à grand rayon d\'action & faibles pertes',
      en: 'Long distance power transfer'
    },
    stage: { fr: 'Transport & Interconnexion Grands Réseaux', en: 'Transmission & Regional Interconnection' },
    stageId: 2,
    voltage: '225 000 V (225 kV AC triphasé)',
    current: '1 250 A admissible en continu',
    power: '487 MVA (Capacité de transit thermique)',
    role: {
      fr: 'Transporter d\'importants blocs de puissance électrique sur des centaines de kilomètres depuis les sites de production isolés vers les centres de consommation urbains avec des pertes Joule minimales (P_joule = 3*R*I²).',
      en: 'Transfers bulk electrical power over hundreds of kilometers from remote generation assets to load centers with minimal $I^2R$ ohmic losses by stepping up to 225 kV.'
    },
    functionDetail: {
      fr: 'Interconnexion synchrone des zones régionales, maintien de la stabilité d\'angle rotorique et soutien de tension via les impédances de ligne.',
      en: 'Maintains regional synchronous tie-lines, rotor angle transient stability, and voltage support across long-distance corridors.'
    },
    workingPrinciple: {
      fr: 'Ligne aérienne sur pylônes acier treillis avec conducteurs en faisceau almélec (AAAC) espacés pour limiter l\'effet couronne et les pertes diélectriques.',
      en: 'Overhead lattice steel towers supporting bundled AAAC conductors spaced to minimize corona discharge and dielectric air losses.'
    },
    mainComponents: {
      fr: ['Pylônes métalliques d\'alignement et d\'angle', 'Faisceaux de conducteurs AAAC 570 mm²', 'Chaînes d\'isolateurs en verre trempé / composite', 'Câble de garde avec fibre optique (OPGW)', 'Cornes d\'éclatement et anneaux pare-effluves', 'Prises de terre de pied de pylône'],
      en: ['Galvanized steel lattice towers', 'Bundled AAAC conductor phases', 'Toughened glass cap-and-pin insulator strings', 'Optical Ground Wire (OPGW) shield wire', 'Arcing horns & corona grading rings', 'Deep foundation tower grounding']
    },
    protectionTypes: ['21 (Distance numérique quadripolaire)', '87L (Différentielle de ligne sur fibre OPGW)', '67/67N (Directionnelle de terre)', '50BF (Défaillance disjoncteur)', '25 (Contrôle de synchronisme)'],
    measurementTypes: ['Capteurs de courant optique', 'Téléprotection par signal GOOSE IEC 61850', 'Enregistreurs de défauts transitoires DFR'],
    applicableStandards: ['CEI 60826 (Lignes aériennes de transport)', 'CEI 60383 (Isolateurs pour lignes)', 'CEI 61089 (Conducteurs toronnés)', 'CIGRE TB 543'],
    upstream: 'Poste élévateur de la centrale hydroélectrique (Centrale de Songloulou / Nachtigal)',
    downstream: 'Poste d\'interconnexion THT/HTA (Poste de Mangombé / Bekoko)',
    epedeDomainCode: 'D02',
    canonicalEquipmentId: 'eq-exp-line-225kv-01',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    coords: { x: -8, y: 12, z: -15 },
    screenPos: { left: '42%', top: '17%' }
  },
  {
    id: 'eq-transmission-substation-04',
    badgeNumber: 4,
    tagIec: '=D03.SS225-NODE',
    name: {
      fr: 'Poste d\'Interconnexion & Transformation THT',
      en: 'Transmission Substation'
    },
    subtitle: {
      fr: 'Abaissement THT → HTA (225 kV vers 30 kV / 15 kV)',
      en: 'HV → MV (step-down)'
    },
    stage: { fr: 'Transformation & Aiguillage Haute Tension', en: 'Substation & Node Switching' },
    stageId: 3,
    voltage: '225 kV / 30 kV',
    current: '2 500 A jeu de barres THT',
    power: '126 MVA (2 x 63 MVA couplés)',
    role: {
      fr: 'Point nodal stratégique assurant l\'aiguillage des flux de puissance, la coupure des courants de court-circuit (jusqu\'à 31.5 kA), la mesure normalisée et l\'abaissement vers le réseau de répartition.',
      en: 'Strategic grid node directing power flows, interrupting short-circuit fault currents up to 31.5 kA, measuring, and stepping down voltage for distribution.'
    },
    functionDetail: {
      fr: 'Architecture double jeu de barres permettant la maintenance sous tension d\'un jeu de barres sans coupure de fourniture via le disjoncteur de couplage.',
      en: 'Double busbar scheme allowing live maintenance of one bus without load shedding via bus coupler circuit breaker.'
    },
    workingPrinciple: {
      fr: 'Les travées ligne et transformateur sont reliées à travers des sectionneurs d\'aiguillage motorisés et des disjoncteurs THT à autosoufflage SF6 pilotés par automates numériques.',
      en: 'Line bays and transformer bays connect through motorized selector disconnectors and SF6 puffer circuit breakers orchestrated by digital substation IEDs.'
    },
    mainComponents: {
      fr: ['Double jeu de barres tubulaire aluminium 225 kV', 'Disjoncteurs SF6 à coupure sous gaz', 'Sectionneurs rotatifs à deux colonnes avec MALT', 'Transformateurs de courant (TC) et de tension (TT/CVT)', 'Parafoudres à oxyde de zinc (ZnO)', 'Bâtiment de commande SCADA & relayage'],
      en: ['225 kV tubular aluminum double busbars', 'SF6 gas circuit breakers with spring mechanisms', 'Rotary pantograph/two-column disconnectors with earth blades', 'Current & Capacitor Voltage Transformers (CT/CVT)', 'Gapless Zinc Oxide (ZnO) surge arresters', 'Substation control room & SCADA IED cubicles']
    },
    protectionTypes: ['87B (Différentielle de barres)', '50/51 (Surintensité)', '50BF (Breaker Failure)', '68 (Oscillation de puissance)'],
    measurementTypes: ['Mergers Units IEC 61850-9-2LE', 'Transducteurs 4-20 mA', 'Comptage fiscal 4 quadrants'],
    applicableStandards: ['CEI 61936-1 (Installations électriques > 1 kV)', 'CEI 62271-100 (Disjoncteurs)', 'CEI 62271-102 (Sectionneurs)', 'CEI 61850'],
    upstream: 'Lignes d\'interconnexion 225 kV',
    downstream: 'Départs HTA 30 kV vers postes de distribution',
    epedeDomainCode: 'D03',
    canonicalEquipmentId: 'eq-exp-breaker-sf6-01',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    coords: { x: 3, y: 7, z: -14 },
    screenPos: { left: '57%', top: '18%' }
  },
  {
    id: 'eq-power-transformer-05',
    badgeNumber: 5,
    tagIec: '=D04.T01-63MVA',
    name: {
      fr: 'Transformateur de Puissance Réseau (63 MVA)',
      en: 'Power Transformer'
    },
    subtitle: {
      fr: 'Conversion de tension THT → HTA / BT (225 kV / 30 kV)',
      en: 'HV → MV / LV'
    },
    stage: { fr: 'Transformation Électrique de Grande Puissance', en: 'Power Transformation' },
    stageId: 3,
    voltage: '225 000 V / 30 000 V (Couplage Dyn11)',
    current: '161.7 A (Primaire) / 1 212 A (Secondaire)',
    power: '63 MVA - Refroidissement ONAN / ONAF',
    role: {
      fr: 'Transformer le niveau de tension sans modifier la fréquence (50 Hz), permettant d\'adapter le transport à très haute tension aux exigences de sécurité du réseau de distribution moyenne tension.',
      en: 'Steps down transmission voltage while conserving 50 Hz frequency, interfacing bulk transport with safe medium-voltage municipal distribution.'
    },
    functionDetail: {
      fr: 'Équipé d\'un régleur en charge sous vide (OLTC) à 19 plots (±9 x 1.25%) pour réguler précisément la tension HTA de 30 kV indépendamment des variations de charge.',
      en: 'Fitted with on-load vacuum tap changer (OLTC ±9x1.25%) to dynamically stabilize 30 kV distribution busbar against grid load swings.'
    },
    workingPrinciple: {
      fr: 'Induction électromagnétique mutuelle entre enroulements concentriques en cuivre immergés dans l\'huile minérale diélectrique sur un circuit magnétique en tôles au silicium à grains orientés.',
      en: 'Mutual electromagnetic induction across concentric copper windings immersed in mineral insulating oil over cold-rolled grain-oriented silicon steel core.'
    },
    mainComponents: {
      fr: ['Cuve mécano-soudée renforcée au vide', 'Traversées capacitives THT (RIP / OIP)', 'Conservateur d\'huile avec dessiccateur à silicagel', 'Aéro-réfrigérants avec ventilateurs d\'extraction', 'Relais de protection Buchholz & clapet de surpression', 'Régleur en charge sous vide motorisé (OLTC)', 'Trousse de capteurs DGA de gaz dissous en continu'],
      en: ['Reinforced hermetic transformer steel tank', 'Resin/oil-impregnated paper EHV bushings', 'Oil conservator with silica gel breathers', 'Radiator banks with dual-speed forced fans', 'Buchholz gas surge relay & pressure relief valve', 'Motorized on-load vacuum tap changer (OLTC)', 'Online Dissolved Gas Analysis (DGA) monitoring unit']
    },
    protectionTypes: ['87T (Différentielle de transformateur)', '63 (Relais Buchholz détection de gaz)', '49 (Image thermique enroulements)', '51N (Défaut à la terre restreint)', '26 (Température huile)'],
    measurementTypes: ['Sondes à fibre optique immergées dans l\'enroulement (point chaud)', 'Capteurs d\'humidité dans l\'huile', 'Comptage primaire et secondaire'],
    applicableStandards: ['CEI 60076-1 (Généralités transformateurs)', 'CEI 60076-2 (Échauffement)', 'CEI 60076-5 (Tenue aux courts-circuits)', 'CEI 60599 (Interprétation DGA)'],
    upstream: 'Jeu de barres THT 225 kV du poste',
    downstream: 'Tableau de distribution HTA 30 kV (Rames blindées SF6/Air)',
    epedeDomainCode: 'D04',
    canonicalEquipmentId: 'eq-exp-trafo-pwr-01',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    coords: { x: 5, y: -2, z: 8 },
    screenPos: { left: '50%', top: '44%' }
  },
  {
    id: 'eq-distribution-network-06',
    badgeNumber: 5,
    tagIec: '=D05.MV-FD30',
    name: {
      fr: 'Réseau de Distribution Moyenne Tension (HTA 30 kV)',
      en: 'Distribution Network'
    },
    subtitle: {
      fr: 'Distribution d\'énergie aux bassins urbains & industriels',
      en: 'MV distribution'
    },
    stage: { fr: 'Distribution Urbaine & Rurale HTA', en: 'Medium Voltage Distribution' },
    stageId: 4,
    voltage: '30 000 V / 15 000 V (HTA)',
    current: '400 A à 630 A par départ',
    power: '15 à 30 MVA par artère de distribution',
    role: {
      fr: 'Irriguer les quartiers urbains, zones d\'activités économiques et pôles périurbains depuis le poste source via des lignes aériennes ou câbles souterrains en boucle ouverte.',
      en: 'Delivers power to city districts, commercial zones and industrial parks from bulk substation through open-loop underground cables or overhead lines.'
    },
    functionDetail: {
      fr: 'Exploitation en schéma coupure d\'artère avec réenclencheurs automatiques (Recloser) et interrupteurs télécommandés (IACR / RMU) pour isoler les tronçons en défaut.',
      en: 'Operated in open-ring topologies with automatic reclosers and remote-controlled Ring Main Units (RMU) to isolate faults and self-heal.'
    },
    workingPrinciple: {
      fr: 'Câbles triphasés unipolaires à isolant synthétique PR (XLPE) ou conducteurs nus Almélec sur poteaux béton/bois équipés d\'éclateurs et parasurtenseurs.',
      en: 'Cross-linked polyethylene (XLPE) screened underground cables or overhead bare conductors on concrete/wood poles with auto-reclosers.'
    },
    mainComponents: {
      fr: ['Câbles HTA souterrains 3x1x240 mm² Al XLPE', 'Poteaux béton armé et consoles HTA', 'Cellules modulaires Ring Main Unit (RMU)', 'Disjoncteurs réenclencheurs sur poteau (Auto-recloser)', 'Organes de coupure de réseau à télécommande (IAT)', 'Détecteurs de défauts de passage HTA directionnels'],
      en: ['3x1x240 mm² Al XLPE underground MV power cables', 'Spun concrete poles with crossarms', 'Gas-insulated Ring Main Units (RMU)', 'Pole-mounted automatic vacuum reclosers', 'Sectionalizers & pole-top disconnectors', 'Directional earth-fault indicators with GSM/SCADA']
    },
    protectionTypes: ['50/51 (Surintensité de phase)', '51N (Défaut à la terre homopolaire)', '67N (Directionnelle terre)', '79 (Cycle de réenclenchement rapide/lent)'],
    measurementTypes: ['Capteurs Rogowski intégrés dans les traversées', 'Indicateurs de passage de défaut (FPI)', 'Télémesures de courant I/U par RTU'],
    applicableStandards: ['CEI 60502-2 (Câbles d\'énergie HTA)', 'CEI 62271-200 (Appareillage sous enveloppe métallique HTA)', 'CEI 60282-1 (Fusibles HTA)'],
    upstream: 'Disjoncteur de départ 30 kV du poste source',
    downstream: 'Postes de transformation HTA/BT de distribution',
    epedeDomainCode: 'D05',
    canonicalEquipmentId: 'eq-exp-recloser-30kv-01',
    imageUrl: 'https://images.unsplash.com/photo-1509390144018-eeaf65049365?auto=format&fit=crop&w=800&q=80',
    coords: { x: 18, y: 6, z: -10 },
    screenPos: { left: '71%', top: '26%' }
  },
  {
    id: 'eq-distribution-transformer-07',
    badgeNumber: 6,
    tagIec: '=D06.TR-HTA/BT-630',
    name: {
      fr: 'Poste & Transformateur de Distribution (HTA / BT)',
      en: 'Distribution Transformer'
    },
    subtitle: {
      fr: 'Conversion HTA → BT (30 kV vers 400 V / 230 V)',
      en: 'MV → LV'
    },
    stage: { fr: 'Abaissement Basse Tension Sécurisée', en: 'LV Distribution Step-down' },
    stageId: 5,
    voltage: '30 000 V / 400 V - 230 V (Triphasé 4 fils)',
    current: '12 A (HTA) / 909 A (BT)',
    power: '630 kVA (ou 250 kVA / 1000 kVA)',
    role: {
      fr: 'Dernière étape de transformation du réseau public, réduisant la moyenne tension à la basse tension normalisée utilisable directement par les appareils sans risque d\'arc diélectrique létal.',
      en: 'Final transformation stage converting hazardous medium voltage into standardized 400V/230V low voltage safe for building distribution.'
    },
    functionDetail: {
      fr: 'Raccordé en coupure d\'artère ou en antenne dans un poste compact préfabriqué, il alimente un tableau de distribution basse tension (TURP) à 4 à 8 départs protégés.',
      en: 'Housed in compact prefabricated kiosks or pole-mounted, supplying low-voltage distribution boards with fused or breaker-protected feeder ways.'
    },
    workingPrinciple: {
      fr: 'Transformateur triphasé immergé dans l\'huile minérale ou sec enrobé de résine époxy, couplage Dyn11 avec neutre sorti mis directement à la terre pour constituer le régime TN ou TT.',
      en: 'Hermetically sealed mineral oil or cast-resin dry-type transformer, Dyn11 vector group with grounded neutral terminal establishing TT/TN earthing.'
    },
    mainComponents: {
      fr: ['Cuve à ondes de dissipation thermique', 'Traversées embrochables HTA type coude élastomère', 'Jeu de barres cuivre BT', 'Tableau Urbain Réduit Polyvalent (TURP) avec fusibles HPC', 'Déconnecteur sous charge et fusibles HTA combinés', 'Prise de terre des masses et terre du neutre distinctes'],
      en: ['Corrugated fin steel oil tank', 'Screened separable dead-break MV elbow connectors', 'Low-voltage copper busbar stabs', 'Polyvalent urban LV feeder panel with NH-blade fuses', 'Load-break switch with fuse trip mechanism', 'Segregated frame grounding and neutral grounding stakes']
    },
    protectionTypes: ['Fusibles HTA à percuteur HPC (type Din)', 'Relais DGPT2 (Gaz, Pression, Température)', 'Disjoncteur BT de tête avec déclencheur magnéto-thermique'],
    measurementTypes: ['Compteurs communicants HTA/BT type Linky/AMR', 'Thermomètres à aiguille à contact max'],
    applicableStandards: ['CEI 60076-11 (Transformateurs secs)', 'CEI 62271-202 (Postes préfabriqués HTA/BT)', 'NF C 13-100 / NF C 17-200'],
    upstream: 'Départ HTA 30 kV',
    downstream: 'Tableau général basse tension (TGBT) et réseau public BT',
    epedeDomainCode: 'D06',
    canonicalEquipmentId: 'eq-exp-trafo-dist-01',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    coords: { x: 28, y: 4, z: -5 },
    screenPos: { left: '83%', top: '33%' }
  },
  {
    id: 'eq-building-installation-08',
    badgeNumber: 7,
    tagIec: '=D07.TGBT-INDUS',
    name: {
      fr: 'Bâtiments, Industrie & Tableau Général (TGBT)',
      en: 'Buildings & Industry'
    },
    subtitle: {
      fr: 'Distribution Basse Tension & Gestion d\'Énergie',
      en: 'LV distribution'
    },
    stage: { fr: 'Installation Électrique Basse Tension', en: 'Building & Industrial Installation' },
    stageId: 5,
    voltage: '400 V Triphasé + Neutre / 230 V Monophasé',
    current: '1 600 A jeu de barres général',
    power: '1 MVA admissible en tête de TGBT',
    role: {
      fr: 'Répartir l\'énergie électrique en toute sécurité au sein du bâtiment, compartimenter les circuits de puissance, d\'éclairage et d\'automatismes, et assurer la protection différentielle des personnes contre les contacts directs et indirects.',
      en: 'Safely distributes electrical power across residential, commercial or factory floors, segmenting critical power feeders, lighting, and HVAC with RCD shock protection.'
    },
    functionDetail: {
      fr: 'Tableau débrochable Forme 4b assurant la continuité de service avec inverseur de source automatique (ATS) groupe électrogène / ASI onduleur et batterie de condensateurs PFC.',
      en: 'Form 4b compartmentalized switchboard with Automatic Transfer Switch (ATS) to diesel genset / UPS and power factor correction capacitors.'
    },
    workingPrinciple: {
      fr: 'Distribution par barres de cuivre étamé peignées alimentant des disjoncteurs boîtier moulé (MCCB) et modulaires (MCB) avec déclencheurs électroniques sélectifs.',
      en: 'Plated copper busbar trunking feeding molded-case (MCCB) and miniature circuit breakers (MCB) with adjustable electronic trip curves.'
    },
    mainComponents: {
      fr: ['Armoire métallique compartimentée Forme 4b', 'Disjoncteur général ouvert (ACB) 1600A débrochable', 'Disjoncteurs boîtier moulé (MCCB) avec différentiel réglable', 'Inverseur automatique de sources (ATS normal / secours)', 'Batterie de condensateurs automatique anti-harmonique', 'Parafoudre de tête Type 1+2 avec fusible déconnecteur'],
      en: ['Form 4b modular metal-enclosed cubicles', '1600A withdrawable Air Circuit Breaker (ACB)', 'Molded Case Circuit Breakers (MCCB) with electronic trips', 'Automatic Transfer Switch (Normal / Emergency Genset)', 'Automatic detuned power factor correction capacitor bank', 'Type 1+2 Surge Protective Device (SPD) with backup fuses']
    },
    protectionTypes: ['Protection contre les chocs électriques (RCD 30 mA / 300 mA)', 'Sélectivité chronométrique et ampèremétrique', 'Protection parafoudre SPD Type 1+2 (CEI 61643-11)', 'Relais de contrôle d\'isolement CPI (régime IT)'],
    measurementTypes: ['Centrales de mesure communicantes Modbus / Ethernet (PM5000)', 'Transformateurs de courant BT tore fermé classe 0.5'],
    applicableStandards: ['CEI 61439-1 & 2 (Ensembles d\'appareillage BT)', 'CEI 60364 / NF C 15-100 (Installations électriques BT)'],
    upstream: 'Secondaire du transformateur HTA/BT',
    downstream: 'Tableaux divisionnaires, variateurs de vitesse et charges finales',
    epedeDomainCode: 'D07',
    canonicalEquipmentId: 'eq-exp-tgbt-main-01',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    coords: { x: 38, y: -2, z: 2 },
    screenPos: { left: '91%', top: '41%' }
  },
  {
    id: 'eq-final-load-09',
    badgeNumber: 8,
    tagIec: '=D08.MOT-INDUS-250',
    name: {
      fr: 'Charge Finale Utile (Moteur Industriel & Usages)',
      en: 'Final Load'
    },
    subtitle: {
      fr: 'Habitations, Entreprises & Industrie : L\'énergie devient travail utile',
      en: 'Homes, businesses, industry'
    },
    stage: { fr: 'Usage Final & Travail Mécanique / Thermique', en: 'Final Load & Useful Work' },
    stageId: 6,
    voltage: '400 V Triphasé / 230 V Monophasé',
    current: '445 A nominal (Moteur 250 kW)',
    power: '250 kW mécanique utile (cos φ = 0.88, η = 96.2%)',
    role: {
      fr: 'Point d\'aboutissement ultime de toute la chaîne énergétique : convertir l\'énergie électrique en travail mécanique utile (pompage, ventilation, broyage), en flux lumineux (LED), en puissance frigorifique (CVC) ou en calcul informatique.',
      en: 'The ultimate destination of the entire electric ecosystem: transforming electrical energy into useful mechanical torque (pumps, compressors, mills), illumination, HVAC, and computational work.'
    },
    functionDetail: {
      fr: 'Moteur asynchrone à cage d\'écureuil haute efficacité IE4 piloté par variateur de fréquence (VFD) pour adapter exactement la vitesse au process sans gaspillage énergétique.',
      en: 'IE4 super-premium efficiency squirrel-cage induction motor modulated by variable frequency drive (VFD) optimizing flow and eliminating throttled energy waste.'
    },
    workingPrinciple: {
      fr: 'Loi de Laplace : les courants rotoriques induits par le champ magnétique statorique tournant subissent une force électromagnétique tangentielle créant un couple moteur continu sur l\'arbre entraînant la machine industrielle.',
      en: 'Lorentz electromagnetic force: rotor currents induced by stator rotating magnetic flux generate tangential torque spinning the industrial drive shaft.'
    },
    mainComponents: {
      fr: ['Moteur asynchrone triphasé fermé carcasse fonte IP55', 'Variateur électronique de fréquence (VFD / Inverter PWM)', 'Sectionneur de sécurité cadenassable de proximité', 'Sondes thermiques CTP / PT100 intégrées au bobinage', 'Accouplement élastique à la pompe centrifuge / compresseur', 'Éclairages LED industriels & data center attenants'],
      en: ['Cast iron enclosed induction motor frame IP55', 'PWM Variable Frequency Drive (VFD) with harmonic filter', 'Lockable local isolator disconnect switch', 'Embedded PTC/PT100 stator thermal sensors', 'Flexible shaft coupling to centrifugal pump/compressor', 'Adjacent industrial LED lighting & server equipment']
    },
    protectionTypes: ['Protection thermique de surcharge moteur (Relais bilame ou électronique classe 10/20)', 'Court-circuit par disjoncteur moteur magnétique', 'Surintensité et défaut terre par VFD', 'Surveillance des déséquilibres de phases'],
    measurementTypes: ['Capteur de vitesse tachymétrique / résolveur', 'Accéléromètres d\'analyse vibratoire', 'Comptage d\'énergie d\'atelier kWh'],
    applicableStandards: ['CEI 60034-30-1 (Classes de rendement moteurs IE1-IE4)', 'CEI 61800-3 (Entraînements électriques à vitesse variable)', 'CEI 60947-4-1 (Contacteurs et démarreurs)'],
    upstream: 'Départ TGBT ou Centre de Contrôle Moteur (MCC)',
    downstream: 'Travail mécanique utile : débit d\'eau, air comprimé, climatisation, chaîne de fabrication',
    epedeDomainCode: 'D08',
    canonicalEquipmentId: 'eq-exp-motor-indus-01',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    coords: { x: 42, y: -7, z: 12 },
    screenPos: { left: '94%', top: '63%' }
  }
];

export const JOURNEY_STAGES = [
  {
    id: 1,
    name: { fr: 'Production', en: 'Generation' },
    shortDescription: {
      fr: 'Conversion de l\'énergie primaire en énergie électrique',
      en: 'Conversion of primary energy into electrical energy'
    },
    iconName: 'Zap',
    badge: '10.5 kV',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    equipmentTarget: 'eq-hydro-dam-01',
    cameraPos: { x: -35, y: 15, z: 25 },
    cameraLookAt: { x: -35, y: 4, z: -5 }
  },
  {
    id: 2,
    name: { fr: 'Transport', en: 'Transmission' },
    shortDescription: {
      fr: 'Transfert haute tension sur grandes distances sans pertes',
      en: 'Long-distance high-voltage bulk power transfer'
    },
    iconName: 'Radio',
    badge: '225 kV',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    equipmentTarget: 'eq-transmission-line-03',
    cameraPos: { x: -8, y: 18, z: 20 },
    cameraLookAt: { x: -8, y: 10, z: -15 }
  },
  {
    id: 3,
    name: { fr: 'Poste Source', en: 'Substation' },
    shortDescription: {
      fr: 'Aiguillage, protection, mesure et abaissement de tension',
      en: 'Switching, protection, measurement and voltage transformation'
    },
    iconName: 'Server',
    badge: '225 / 30 kV',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
    equipmentTarget: 'eq-transmission-substation-04',
    cameraPos: { x: 4, y: 15, z: 15 },
    cameraLookAt: { x: 3, y: 5, z: -10 }
  },
  {
    id: 4,
    name: { fr: 'Distribution', en: 'Distribution' },
    shortDescription: {
      fr: 'Acheminement via les réseaux moyenne tension urbains et ruraux',
      en: 'Delivery of electrical energy through MV and LV networks'
    },
    iconName: 'GitBranch',
    badge: '30 kV HTA',
    image: 'https://images.unsplash.com/photo-1509390144018-eeaf65049365?auto=format&fit=crop&w=600&q=80',
    equipmentTarget: 'eq-distribution-network-06',
    cameraPos: { x: 18, y: 16, z: 18 },
    cameraLookAt: { x: 18, y: 5, z: -8 }
  },
  {
    id: 5,
    name: { fr: 'Transformateur', en: 'Transformer' },
    shortDescription: {
      fr: 'Abaissement ultime en basse tension sécurisée',
      en: 'Final transformation step from MV to LV'
    },
    iconName: 'Layers',
    badge: '400 V / 230 V',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    equipmentTarget: 'eq-distribution-transformer-07',
    cameraPos: { x: 28, y: 12, z: 14 },
    cameraLookAt: { x: 28, y: 3, z: -5 }
  },
  {
    id: 6,
    name: { fr: 'Installation', en: 'Installation' },
    shortDescription: {
      fr: 'Tableaux généraux, colonnes montantes et circuits terminaux',
      en: 'Electrical infrastructure inside buildings & industrial facilities'
    },
    iconName: 'Building2',
    badge: 'TGBT / MDB',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    equipmentTarget: 'eq-building-installation-08',
    cameraPos: { x: 38, y: 10, z: 16 },
    cameraLookAt: { x: 38, y: 0, z: 0 }
  },
  {
    id: 7,
    name: { fr: 'Charge Finale', en: 'Final Load' },
    shortDescription: {
      fr: 'Conversion de l\'énergie électrique en travail mécanique utile',
      en: 'Conversion of electrical energy into useful work'
    },
    iconName: 'Home',
    badge: 'Travail Utile',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    equipmentTarget: 'eq-final-load-09',
    cameraPos: { x: 42, y: 8, z: 22 },
    cameraLookAt: { x: 42, y: -4, z: 10 }
  }
];

export const ENERGY_SOURCES = [
  { id: 'hydro', label: 'Hydro', icon: 'Droplets', descriptionFr: 'Centrales hydrauliques de lac ou au fil de l\'eau', descriptionEn: 'Run-of-river or storage reservoir hydro' },
  { id: 'wind', label: 'Wind', icon: 'Wind', descriptionFr: 'Parcs éoliens terrestres et marins', descriptionEn: 'Onshore and offshore wind farms' },
  { id: 'solar', label: 'Solar', icon: 'Sun', descriptionFr: 'Centrales solaires photovoltaïques au sol', descriptionEn: 'Utility-scale solar PV power plants' },
  { id: 'thermal', label: 'Thermal', icon: 'Flame', descriptionFr: 'Centrales à cycle combiné gaz / cogénération', descriptionEn: 'Combined-cycle gas and thermal peaking' },
  { id: 'biomass', label: 'Biomass', icon: 'Leaf', descriptionFr: 'Valorisation thermique biomasse et biogaz', descriptionEn: 'Biomass combustion and bio-methane power' },
];
