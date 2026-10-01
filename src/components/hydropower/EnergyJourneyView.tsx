import React, { useState } from 'react';
import {
  Waves,
  Database,
  Shield,
  Filter,
  CircleDot,
  ArrowUpDown,
  Sliders,
  Disc,
  Compass,
  Zap,
  Share2,
  Network,
  Activity,
  ChevronRight,
  Play,
  RotateCcw,
  Gauge,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import type { HydroSubsystemId } from '../../types/hydropower';

interface EnergyJourneyViewProps {
  locale: 'fr' | 'en';
  onSelectSubsystem?: (subsystemId: HydroSubsystemId) => void;
}

interface JourneyStage {
  id: string;
  subsystemId: HydroSubsystemId;
  stepNumber: number;
  title: { fr: string; en: string };
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  physicalLocation: string;
  conversionType: { fr: string; en: string };
  governingEquation: string;
  equationDescription: { fr: string; en: string };
  operatingParameters: { name: string; value: string; unit: string }[];
  associatedStandards: string[];
  keyFailureModes: { fr: string; en: string }[];
  keyComponents: string[];
  description: { fr: string; en: string };
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'stage-catchment',
    subsystemId: 'H01',
    stepNumber: 1,
    title: { fr: 'Bassin Versant & Hydrologie', en: 'Catchment & Hydrological Basin' },
    category: 'civil',
    icon: Waves,
    physicalLocation: 'Bassin hydrographique régional en amont',
    conversionType: { fr: 'Énergie solaire / Précipitations → Énergie potentielle naturelle', en: 'Solar / Precipitation → Natural Potential Energy' },
    governingEquation: 'Q_{inflow} = P_{precip} \\cdot A_{basin} \\cdot C_{runoff}',
    equationDescription: {
      fr: 'Débit d\'apport fluvial résultant du bilan pluviométrique et du coefficient de ruissellement du bassin versant.',
      en: 'Inflow river discharge computed from catchment rainfall depth, catchment surface area, and runoff coefficient.',
    },
    operatingParameters: [
      { name: 'Débit moyen interannuel', value: '1 050', unit: 'm³/s' },
      { name: 'Crue décennale (Q10)', value: '4 800', unit: 'm³/s' },
      { name: 'Crue maximale probable (CMP)', value: '8 500', unit: 'm³/s' },
    ],
    associatedStandards: ['WMO-168', 'ICOLD Bulletin 142'],
    keyFailureModes: [
      { fr: 'Étiage sévère entraînant déficit de production', en: 'Severe hydrological drought inducing power shortages' },
      { fr: 'Crue millénale extrême menaçant la sécurité des ouvrages', en: 'Extreme millennial flood threatening structure safety' },
    ],
    keyComponents: ['Pluviomètres amont', 'Stations limnimétriques radar', 'Modèles hydrologiques prédictifs'],
    description: {
      fr: 'Collecte naturelle des eaux pluviales et fonte des neiges sur le bassin versant, générant le débit d\'apport brut nécessaire à l\'exploitation hydroélectrique.',
      en: 'Natural collection of rainfall and snowmelt over the river basin, generating the primary inflow discharge required for hydro generation.',
    },
  },
  {
    id: 'stage-reservoir',
    subsystemId: 'H02',
    stepNumber: 2,
    title: { fr: 'Retenue d\'Eau & Réservoir', en: 'Storage Reservoir & Head' },
    category: 'civil',
    icon: Database,
    physicalLocation: 'Cuvette de retenue amont du barrage',
    conversionType: { fr: 'Stockage gravitaire d\'énergie potentielle (m·g·h)', en: 'Gravitational Potential Energy Storage (m·g·h)' },
    governingEquation: 'E_p = \\int \\rho \\cdot g \\cdot z \\cdot A(z) \\, dz = m \\cdot g \\cdot H_{gross}',
    equationDescription: {
      fr: 'Énergie potentielle emmagasinée par la masse d\'eau retenue sous la hauteur de chute brute H_gross.',
      en: 'Potential energy accumulated by the impounded water mass under gross elevation head H_gross.',
    },
    operatingParameters: [
      { name: 'Niveau Normal d\'Exploitation (RN)', value: '628.5', unit: 'm NGF' },
      { name: 'Niveau des Plus Hautes Eaux (PHE)', value: '631.0', unit: 'm NGF' },
      { name: 'Volume utile régulateur', value: '5 400', unit: 'Millions m³' },
    ],
    associatedStandards: ['ICOLD Bulletin 158', 'ISO 4360'],
    keyFailureModes: [
      { fr: 'Envasement progressif par sédimentation alluvionnaire', en: 'Progressive reservoir sedimentation reducing active capacity' },
      { fr: 'Stratification thermique et eutrophisation anoxique', en: 'Thermal stratification and deep anoxic water quality degradation' },
    ],
    keyComponents: ['Cuvette amont', 'Bathymétrie sonar', 'Limnimètres de retenue', 'Bouées de sécurité batillage'],
    description: {
      fr: 'Retenue artificielle permettant de stocker l\'énergie saisonnière ou journalière et d\'établir la hauteur de chute statique motrice.',
      en: 'Artificial reservoir buffering seasonal or diurnal water flows and establishing the static driving head.',
    },
  },
  {
    id: 'stage-dam',
    subsystemId: 'H03',
    stepNumber: 3,
    title: { fr: 'Barrage & Évacuateur de Crues', en: 'Dam Structure & Spillway' },
    category: 'civil',
    icon: Shield,
    physicalLocation: 'Ouvrage de retenue principal en travers de la vallée',
    conversionType: { fr: 'Rétention structurelle & dissipation hydraulique sécuritaire', en: 'Structural Impoundment & Safe Hydraulic Dissipation' },
    governingEquation: 'Q_{spill} = C_d \\cdot L_{crest} \\cdot \\sqrt{2g} \\cdot H_{crest}^{1.5}',
    equationDescription: {
      fr: 'Loi de déversement de crue par seuil déversant dénoyé (Poleni/Weir formula).',
      en: 'Spillway discharge rating curve governed by the standard weir overflow equation.',
    },
    operatingParameters: [
      { name: 'Hauteur maximale du barrage', value: '46.0', unit: 'm' },
      { name: 'Longueur en crête', value: '1 278', unit: 'm' },
      { name: 'Capacité évacuateur de crues', value: '6 800', unit: 'm³/s' },
    ],
    associatedStandards: ['ICOLD Bulletin 82', 'USBR Design of Small Dams', 'Eurocode 7'],
    keyFailureModes: [
      { fr: 'Sous-pression déstabilisante sous la fondation rocheuse', en: 'Excessive uplift water pressure destabilizing foundation' },
      { fr: 'Blocage mécanique d\'une vanne de crue en pleine submersion', en: 'Mechanical jam of radial spillway gate during extreme flood event' },
    ],
    keyComponents: ['Corps de barrage BCR/béton/enrochement', 'Vannes segment de crue', 'Bassin de dissipation à ressaut', 'Drains piézométriques'],
    description: {
      fr: 'Ouvrage de génie civil retenant la charge d\'eau et garantissant la sécurité hydraulique via l\'évacuateur de crues dimensionné pour la crue millénale.',
      en: 'Major civil barrier impounding the reservoir and safeguarding integrity via spillways rated for maximum design floods.',
    },
  },
  {
    id: 'stage-intake',
    subsystemId: 'H04',
    stepNumber: 4,
    title: { fr: 'Prise d\'Eau & Grilles', en: 'Water Intake & Trash Racks' },
    category: 'hydraulic',
    icon: Filter,
    physicalLocation: 'Amont immédiat de la galerie d\'amenée',
    conversionType: { fr: 'Captage laminaire & filtration hydrodynamique', en: 'Laminar Inflow Capture & Hydrodynamic Screening' },
    governingEquation: 'v_{trashrack} = \\frac{Q}{A_{net}} \\le 0.8 \\text{ à } 1.0 \\text{ m/s}, \\quad \\Delta h = k \\cdot \\left(\\frac{t}{b}\\right)^{4/3} \\cdot \\frac{v^2}{2g} \\cdot \\sin\\alpha',
    equationDescription: {
      fr: 'Vitesse de passage limitée pour éviter l\'entraînement des poissons, formule de perte de charge de Kirschmer.',
      en: 'Face velocity constraint to avoid fish entrainment, Kirschmer head-loss equation across trash-rack bars.',
    },
    operatingParameters: [
      { name: 'Vitesse de passage aux grilles', value: '0.85', unit: 'm/s' },
      { name: 'Perte de charge normale', value: '0.08', unit: 'm CE' },
      { name: 'Alarme colmatage différentiel', value: '0.35', unit: 'm CE' },
    ],
    associatedStandards: ['IEC 60041', 'DIN 19704'],
    keyFailureModes: [
      { fr: 'Colmatage sévère par débris flottants entraînant écrasement des grilles', en: 'Severe trash rack blockage inducing hydrostatic collapse' },
      { fr: 'Vortex d\'air aspirant des poches gazeuses dans la galerie', en: 'Surface air-entraining vortex drawn into pressurized conduit' },
    ],
    keyComponents: ['Vanne batardeau', 'Vanne de tête à fermeture rapide', 'Grilles fines inox', 'Dégrilleur automatique oléohydraulique'],
    description: {
      fr: 'Organe de transition captant l\'eau de la retenue, filtrant les corps flottants et permettant l\'isolement d\'urgence de l\'adduction.',
      en: 'Hydraulic intake transitioning reservoir water into the adduction system, filtering debris, and featuring fast-closure safety gates.',
    },
  },
  {
    id: 'stage-headrace',
    subsystemId: 'H05',
    stepNumber: 5,
    title: { fr: 'Galerie d\'Amenée en Charge', en: 'Pressurized Headrace Tunnel' },
    category: 'hydraulic',
    icon: CircleDot,
    physicalLocation: 'Massif rocheux entre prise d\'eau et cheminée',
    conversionType: { fr: 'Convection sous pression & pertes de charge linéaires', en: 'Pressurized Hydraulic Conveyance & Friction Losses' },
    governingEquation: '\\Delta h_f = \\lambda \\cdot \\frac{L}{D_h} \\cdot \\frac{v^2}{2g} = \\frac{10.29 \\cdot n^2 \\cdot L \\cdot Q^2}{D^{16/3}}',
    equationDescription: {
      fr: 'Perte de charge régulière par frottement turbulent (Darcy-Weisbach / Manning-Strickler).',
      en: 'Frictional head loss in pressurized conduits governed by Darcy-Weisbach / Manning-Strickler formulations.',
    },
    operatingParameters: [
      { name: 'Longueur de galerie', value: '3 200', unit: 'm' },
      { name: 'Diamètre intérieur excavé', value: '5.20', unit: 'm' },
      { name: 'Vitesse moyenne d\'écoulement', value: '2.85', unit: 'm/s' },
    ],
    associatedStandards: ['ISRM Suggested Methods', 'IEC 60041'],
    keyFailureModes: [
      { fr: 'Cavitation ou affouillement du blindage béton par grande vitesse', en: 'Scour or concrete cavitation lining erosion at excessive velocity' },
      { fr: 'Infiltration d\'eau ou fissuration sous pression externe de nappe', en: 'External groundwater pressure inducing buckling upon dewatering' },
    ],
    keyComponents: ['Tunnel blindé béton', 'Boulons d\'ancrage rocher', 'Injections de consolidation', 'Purges de fond'],
    description: {
      fr: 'Tunnel souterrain foré en charge acheminant le débit volumique sur plusieurs kilomètres à travers le massif rocheux.',
      en: 'Pressurized deep rock tunnel conveying bulk discharge over kilometers toward the penstock and powerhouse.',
    },
  },
  {
    id: 'stage-surge',
    subsystemId: 'H06',
    stepNumber: 6,
    title: { fr: 'Cheminée d\'Équilibre', en: 'Surge Shaft / Surge Tank' },
    category: 'hydraulic',
    icon: ArrowUpDown,
    physicalLocation: 'Jonction entre galerie d\'amenée et conduite forcée',
    conversionType: { fr: 'Amortissement de masse & découplage de coup de bélier', en: 'Mass Oscillation Damping & Water Hammer Decoupling' },
    governingEquation: 'T_{osc} = 2\\pi \\sqrt{\\frac{L \\cdot F_{surge}}{g \\cdot f_{tunnel}}}, \\quad F_{crit} \\ge \\frac{L \\cdot f}{g \\cdot H_0} \\cdot \\frac{v_0^2}{2g \\cdot h_f} \\text{ (Thoma)}',
    equationDescription: {
      fr: 'Période d\'oscillation de masse eau et critère de stabilité dynamique de Thoma évitant l\'emballement résonant.',
      en: 'Natural mass oscillation period and Thoma dynamic hydraulic stability criterion preventing governor-induced resonance.',
    },
    operatingParameters: [
      { name: 'Hauteur totale de puits', value: '85.0', unit: 'm' },
      { name: 'Diamètre de chambre supérieure', value: '12.0', unit: 'm' },
      { name: 'Surpression transitoire max', value: '+18.5', unit: '% H_net' },
    ],
    associatedStandards: ['IEC 61362', 'ASCE Hydroelectric Design Manual'],
    keyFailureModes: [
      { fr: 'Instabilité dynamique oscillatoire si section inférieure au critère de Thoma', en: 'Hydraulic hunting resonance if surge area violates Thoma limit' },
      { fr: 'Débordement supérieur lors d\'un délestage brutal en pleine charge', en: 'Upper spill crest overflow following instant full-load rejection' },
    ],
    keyComponents: ['Puits vertical foré', 'Étranglement d\'orifice (orifice restreint)', 'Chambre d\'expansion supérieure', 'Chambre d\'expansion inférieure'],
    description: {
      fr: 'Réservoir d\'expansion à surface libre protégeant la longue galerie d\'amenée contre les ondes destructrices du coup de bélier.',
      en: 'Open-surface surge chamber decoupling the long headrace tunnel from high-frequency water hammer shockwaves.',
    },
  },
  {
    id: 'stage-penstock',
    subsystemId: 'H05',
    stepNumber: 7,
    title: { fr: 'Conduite Forcée & Collecteur', en: 'Penstock & High-Pressure Distributor' },
    category: 'hydraulic',
    icon: Sliders,
    physicalLocation: 'Pente extérieure ou puits blindé incliné',
    conversionType: { fr: 'Accélération cinétique & résistance aux très hautes pressions', en: 'Kinetic Acceleration & High-Pressure Containment' },
    governingEquation: '\\Delta p_{Allievi} = \\rho \\cdot a \\cdot \\Delta v, \\quad e_{steel} = \\frac{P_{max} \\cdot D}{2 \\cdot \\sigma_{adm} \\cdot z}',
    equationDescription: {
      fr: 'Surpression d\'Allievi en fermeture rapide et épaisseur de tôle d\'acier selon le code chaudronnerie ASME/CODAP.',
      en: 'Allievi water hammer pressure surge formula and ASME Section VIII shell hoop-stress wall thickness equation.',
    },
    operatingParameters: [
      { name: 'Pression nominale de service', value: '28.5', unit: 'bar' },
      { name: 'Vitesse de propagation onde (c)', value: '1 180', unit: 'm/s' },
      { name: 'Épaisseur tôle acier S690', value: '42', unit: 'mm' },
    ],
    associatedStandards: ['ASCE Manual 79', 'EN 13480', 'IEC 60041'],
    keyFailureModes: [
      { fr: 'Rupture catastrophique par fatigue cyclique ou défaut de soudure', en: 'Catastrophic rupture along circumferential weld defect' },
      { fr: 'Écrasement sous vide partiel en cas de vidange sans casse-vide', en: 'Penstock collapse under partial vacuum during unvented dewatering' },
    ],
    keyComponents: ['Tuyauterie acier thermo-mécanique soudée', 'Massifs d\'ancrage béton', 'Joints de dilatation à soufflet', 'Soupapes casse-vide d\'aération'],
    description: {
      fr: 'Conduite métallique ou puits blindé haute pression guidant l\'eau sous charge maximale vers la vanne de tête de turbine.',
      en: 'High-tensile steel penstock conveying water down steep relief, concentrating maximum static and dynamic hydrostatic head.',
    },
  },
  {
    id: 'stage-runner',
    subsystemId: 'H07',
    stepNumber: 8,
    title: { fr: 'Roue de Turbine Hydraulique', en: 'Hydraulic Turbine Runner' },
    category: 'mechanical',
    icon: Disc,
    physicalLocation: 'Bâche spirale & fosse de turbine (Niveau Usine -2)',
    conversionType: { fr: 'Énergie hydraulique (Q·H) → Énergie mécanique de rotation (P_shaft)', en: 'Hydraulic Flow (Q·H) → Mechanical Rotational Shaft Power (P_shaft)' },
    governingEquation: 'P_{shaft} = \\rho \\cdot g \\cdot Q \\cdot H_{net} \\cdot \\eta_{turb} = \\omega \\cdot T_{shaft}',
    equationDescription: {
      fr: 'Puissance mécanique sur l\'arbre déduite du théorème de la quantité de mouvement (équation d\'Euler pour les turbomachines).',
      en: 'Shaft mechanical power derived from Euler turbine momentum equation and net hydraulic head.',
    },
    operatingParameters: [
      { name: 'Vitesse de rotation nominale', value: '500.0', unit: 'tr/min' },
      { name: 'Rendement de pointe garanti', value: '94.8', unit: '%' },
      { name: 'Vitesse d\'emballement maximale', value: '890.0', unit: 'tr/min' },
    ],
    associatedStandards: ['IEC 60041', 'IEC 60193', 'ISO 10816-5'],
    keyFailureModes: [
      { fr: 'Érosion de cavitation sévère au bord de fuite des aubes', en: 'Severe cavitation pitting along blade trailing suction edge' },
      { fr: 'Vortex de torche sous roue à charge partielle provoquant pulsations de pression', en: 'Draft tube corkscrew vortex pulsations at partial load operation' },
    ],
    keyComponents: ['Roue Francis / Kaplan en acier inoxydable 13Cr-4Ni', 'Bâche spirale mécano-soudée', 'Aubes directrices de vannage', 'Aspirateur diffuseur (draft tube)'],
    description: {
      fr: 'Le cœur hydraulique de la centrale : transforme la poussée dynamique du fluide en couple de rotation mécanique à vitesse synchrone.',
      en: 'The hydraulic prime mover converting pressurized water momentum into rotational mechanical torque at synchronous speed.',
    },
  },
  {
    id: 'stage-shaft',
    subsystemId: 'H08',
    stepNumber: 9,
    title: { fr: 'Ligne d\'Arbre & Paliers', en: 'Shaft Line, Thrust & Guide Bearings' },
    category: 'mechanical',
    icon: Compass,
    physicalLocation: 'Fût de liaison verticale turbine-alternateur',
    conversionType: { fr: 'Transmission de couple & reprise de poussée hydraulique axiale', en: 'Torque Transmission & Axial Hydraulic Thrust Support' },
    governingEquation: 'T_{shaft} = \\frac{P_{shaft}}{\\omega} = \\frac{P_{shaft}}{2\\pi \\cdot n / 60}, \\quad F_{axial} = M_{rotor} + M_{runner} + F_{hydraulic}',
    equationDescription: {
      fr: 'Couple mécanique pur transmis à l\'alternateur et charge axiale totale reprise par le pivot à patins oscillants.',
      en: 'Mechanical torque delivered to generator rotor and total vertical thrust absorbed by tilting-pad thrust bearing.',
    },
    operatingParameters: [
      { name: 'Couple nominal transmis', value: '1 007', unit: 'kN·m' },
      { name: 'Charge axiale sur pivot', value: '380', unit: 'tonnes' },
      { name: 'Épaisseur de film d\'huile', value: '45', unit: 'µm' },
    ],
    associatedStandards: ['ISO 7919-5', 'ISO 10816-5'],
    keyFailureModes: [
      { fr: 'Rupture de film d\'huile sur le pivot causant coulée du métal blanc (Babbitt)', en: 'Hydrodynamic oil film breakdown wiping Babbitt bearing pads' },
      { fr: 'Vibrations excessives par désalignement ou balourd rotorique', en: 'Excessive radial runout caused by dynamic rotor unbalance' },
    ],
    keyComponents: ['Arbre en acier forgé allié', 'Tourillon et manchons d\'accouplement', 'Pivot de butée à patins oscillants', 'Paliers guides hydrodynamiques'],
    description: {
      fr: 'Liaison cinématique assurant la transmission mécanique du couple et supportant le poids combiné du rotor et la poussée axiale hydraulique de l\'eau.',
      en: 'High-strength forged shaft line transferring torque while bearing the enormous combined rotor mass and downward hydraulic water thrust.',
    },
  },
  {
    id: 'stage-generator',
    subsystemId: 'H09',
    stepNumber: 10,
    title: { fr: 'Alternateur Synchrone & Excitation', en: 'Synchronous Generator & Excitation' },
    category: 'electrical',
    icon: Zap,
    physicalLocation: 'Salle des machines (Plancher Alternateur Niveau 0)',
    conversionType: { fr: 'Énergie mécanique (T·ω) → Énergie électrique triphasée 11 kV', en: 'Mechanical Rotation (T·ω) → 3-Phase 11 kV Electrical Power' },
    governingEquation: 'P_e = \\frac{E_f \\cdot V}{X_d} \\cdot \\sin\\delta + \\frac{V^2}{2} \\cdot \\left(\\frac{1}{X_q} - \\frac{1}{X_d}\\right) \\cdot \\sin(2\\delta), \\quad f = \\frac{p \\cdot n}{60}',
    equationDescription: {
      fr: 'Puissance électromagnétique d\'alternateur à pôles saillants et fréquence synchrone (50 Hz avec p paires de pôles).',
      en: 'Salient-pole synchronous generator active power equation and synchronous frequency law.',
    },
    operatingParameters: [
      { name: 'Puissance apparente nominale', value: '62.0', unit: 'MVA' },
      { name: 'Tension nominale stator', value: '11.0', unit: 'kV' },
      { name: 'Facteur de puissance (cos φ)', value: '0.85', unit: 'inductif' },
      { name: 'Courant nominal stator', value: '3 254', unit: 'A' },
    ],
    associatedStandards: ['IEC 60034-1', 'IEEE Std C37.102', 'IEEE Std 421.5'],
    keyFailureModes: [
      { fr: 'Court-circuit interne entre spires statoriques ou défaut à la masse (64S)', en: 'Internal stator inter-turn short-circuit or stator ground fault (64S)' },
      { fr: 'Échauffement excessif du rotor lors de régimes asymétriques (46)', en: 'Rotor pole surface overheating under negative-sequence current (46)' },
    ],
    keyComponents: ['Stator à enroulement Roebel classe F', 'Rotor à pôles saillants bobinés', 'Système d\'excitation statique à thyristors (AVR)', 'Aéro-réfrigérants eau déminéralisée'],
    description: {
      fr: 'Machine électrique synchrone de forte puissance convertissant le travail mécanique de l\'arbre en puissance électrique triphasée stabilisée à 50 Hz.',
      en: 'Heavy-duty synchronous machine converting shaft mechanical torque into 50 Hz three-phase electrical power with excitation regulation.',
    },
  },
  {
    id: 'stage-transformer',
    subsystemId: 'H14',
    stepNumber: 11,
    title: { fr: 'Transformateur Élévateur GSU', en: 'Generator Step-Up (GSU) Transformer' },
    category: 'electrical',
    icon: Share2,
    physicalLocation: 'Plateforme transformateurs extérieure ou caverne HT',
    conversionType: { fr: 'Tension moyenne 11 kV → Très Haute Tension 225 kV', en: '11 kV Generator Voltage → 225 kV Grid Transmission Voltage' },
    governingEquation: 'I_{HV} = \\frac{S_{rated}}{\\sqrt{3} \\cdot U_{HV}}, \\quad P_{loss} = P_0 + \\left(\\frac{I}{I_n}\\right)^2 \\cdot P_k, \\quad \\eta_{trafo} > 99.2\\%',
    equationDescription: {
      fr: 'Loi de transformation de tension et de réduction drastique du courant de ligne pour minimiser les pertes par effet Joule.',
      en: 'Voltage step-up transformation drastically cutting transmission line current and thermal Joule losses.',
    },
    operatingParameters: [
      { name: 'Rapport de transformation', value: '11 / 225', unit: 'kV' },
      { name: 'Couplage vectoriel', value: 'YNd11', unit: '-' },
      { name: 'Tension de court-circuit (Ucc)', value: '12.5', unit: '%' },
      { name: 'Mode de refroidissement', value: 'ONAF / OFAF', unit: '-' },
    ],
    associatedStandards: ['IEC 60076-1', 'IEEE C57.12.00', 'NFPA 851'],
    keyFailureModes: [
      { fr: 'Décharge partielle interne et dégradation diélectrique de l\'huile isolante', en: 'Internal partial discharge and dielectric breakdown of transformer oil' },
      { fr: 'Défaut de court-circuit franc entre spires haute tension (Buchholz 63)', en: 'High-voltage winding turn-to-turn fault triggering Buchholz trip (63)' },
    ],
    keyComponents: ['Cuve huile minérale inhibée', 'Enroulements cuivre transposition continue', 'Traversées capacitives 225 kV OIP/RIP', 'Relais Buchholz & conservateur à membrane'],
    description: {
      fr: 'Élève la tension de génération de 11 kV à 225 kV pour permettre le transport massif d\'électricité sur de longues distances sans pertes excessives.',
      en: 'Elevates generation voltage from 11 kV to 225 kV, slashing line current to evacuate bulk power across national transmission corridors.',
    },
  },
  {
    id: 'stage-switchyard',
    subsystemId: 'H15',
    stepNumber: 12,
    title: { fr: 'Poste HT 225 kV & Injection Réseau', en: '225 kV Switchyard & Grid Point of Interconnection' },
    category: 'electrical',
    icon: Network,
    physicalLocation: 'Poste extérieur 225 kV ou blindé SF6 (GIS)',
    conversionType: { fr: 'Sectionnement, synchronisation & injection au réseau de transport', en: 'Switching, Synchronization & Bulk Grid Injection' },
    governingEquation: 'P_{grid} = \\sqrt{3} \\cdot U_{grid} \\cdot I_{grid} \\cdot \\cos\\varphi, \\quad \\Delta f \\to \\Delta P = -\\frac{P_n}{R} \\cdot \\frac{\\Delta f}{f_0}',
    equationDescription: {
      fr: 'Injection de puissance active et régulation primaire de fréquence par statisme R = 4% injectée sur les barres du réseau.',
      en: 'Power evacuation equation and grid primary frequency regulation governed by 4% droop droop governor control.',
    },
    operatingParameters: [
      { name: 'Tension réseau interconnecté', value: '225', unit: 'kV' },
      { name: 'Pouvoir de coupure disjoncteur (Icc)', value: '40', unit: 'kA' },
      { name: 'Fréquence de consigne', value: '50.00', unit: 'Hz' },
    ],
    associatedStandards: ['IEC 62271-100', 'IEC 61850', 'IEEE Std C37.04'],
    keyFailureModes: [
      { fr: 'Court-circuit sur ligne d\'évacuation nécessitant déclenchement sélectif en < 80 ms', en: 'Transmission line short-circuit requiring selective clearance within 80 ms' },
      { fr: 'Perte brutale du réseau entraînant délestage d\'urgence du groupe', en: 'Sudden grid blackout triggering full machine load-rejection trip' },
    ],
    keyComponents: ['Disjoncteur 225 kV SF6', 'Sectionneurs de ligne et de terre', 'Transformateurs de mesure TC/TT', 'Parafoudres ZnO à oxyde métallique'],
    description: {
      fr: 'Nœud d\'interconnexion haute tension intégrant disjoncteurs, sectionneurs et automates de protection pour évacuer l\'énergie vers le réseau national.',
      en: 'High-voltage substation bay interfacing generating units to national transmission corridors with ultra-fast fault protection and isolation.',
    },
  },
];

export const EnergyJourneyView: React.FC<EnergyJourneyViewProps> = ({
  locale,
  onSelectSubsystem,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(7); // Default to runner
  const [isSimulatingFlow, setIsSimulatingFlow] = useState<boolean>(true);

  // Interactive Live Hydraulic Calculation Simulator
  const [simHead, setSimHead] = useState<number>(40.0); // meters (Songloulou rated head)
  const [simFlow, setSimFlow] = useState<number>(138.0); // m3/s (Single unit discharge)
  const [simEfficiency, setSimEfficiency] = useState<number>(0.94); // turbine efficiency
  const [simGenEfficiency] = useState<number>(0.985); // generator efficiency

  // Calculations
  const waterDensity = 1000; // kg/m3
  const gravity = 9.81; // m/s2
  const hydraulicPowerMW = (waterDensity * gravity * simFlow * simHead) / 1e6;
  const shaftPowerMW = hydraulicPowerMW * simEfficiency;
  const electricPowerMW = shaftPowerMW * simGenEfficiency;
  const annualGWh = (electricPowerMW * 8760 * 0.75) / 1000; // 75% load factor

  const selectedStage = JOURNEY_STAGES[selectedStageIndex];

  return (
    <div className="space-y-6">
      {/* Top Banner & Flow Animator Controller */}
      <div className="rounded-2xl border border-[#252E38] bg-linear-to-r from-[#0D1117] via-[#111827] to-[#0A1628] p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                {locale === 'fr' ? 'CHAÎNE DE CONVERSION WATER-TO-WIRE' : 'WATER-TO-WIRE ENERGY CONVERSION PIPELINE'}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                12 {locale === 'fr' ? 'Étapes Séquentielles' : 'Sequential Stages'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {locale === 'fr' ? 'Parcours Énergétique Intégral : De la Pluie au Réseau 225 kV' : 'Full Energy Journey: From Rainfall to 225 kV Transmission'}
            </h2>
            <p className="text-sm text-neutral-300 mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'Explorez chaque étape de la transformation physique, mécanique et électromagnétique avec ses équations gouvernantes, paramètres opérationnels et risques de défaillance.'
                : 'Explore each step of the physical, mechanical, and electromagnetic transformation with governing equations, live operational limits, and failure modes.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSimulatingFlow(!isSimulatingFlow)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all shadow-md ${
                isSimulatingFlow
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-950'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isSimulatingFlow ? 'animate-pulse text-cyan-400' : ''}`} />
              <span>{isSimulatingFlow ? (locale === 'fr' ? 'Flux Actif' : 'Flow Active') : (locale === 'fr' ? 'Flux Figé' : 'Flow Paused')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSimHead(40.0);
                setSimFlow(138.0);
                setSimEfficiency(0.94);
                setSelectedStageIndex(7);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-[#252E38] text-xs font-mono font-bold text-neutral-400 hover:text-white hover:border-neutral-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* 12-STEP PIPELINE HORIZONTAL SCROLLER */}
        <div className="mt-6 pt-5 border-t border-[#252E38] overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            {JOURNEY_STAGES.map((stage, idx) => {
              const isSelected = selectedStageIndex === idx;
              const IconComponent = stage.icon;

              return (
                <React.Fragment key={stage.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedStageIndex(idx)}
                    className={`relative p-3 rounded-xl border text-left transition-all group shrink-0 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 ring-2 ring-cyan-400/40 shadow-lg'
                        : 'border-[#252E38] bg-[#090D14] text-neutral-400 hover:border-neutral-600 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-[#161D27] text-cyan-400 border border-cyan-900/50">
                        {stage.subsystemId}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500 font-bold">
                        #{stage.stepNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#161D27] text-neutral-400 group-hover:text-white'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono text-xs font-bold whitespace-nowrap text-white max-w-[130px] truncate">
                          {locale === 'fr' ? stage.title.fr : stage.title.en}
                        </div>
                        <div className="font-mono text-[10px] text-neutral-500 capitalize">
                          {stage.category}
                        </div>
                      </div>
                    </div>

                    {/* Water flow indicator animation */}
                    {isSimulatingFlow && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                    )}
                  </button>

                  {idx < JOURNEY_STAGES.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: STAGE DEEP DIVE & REAL-TIME HYDROPOWER CALCULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: SELECTED STAGE DEEP DIVE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[#252E38] bg-[#0D1117] p-6 shadow-xl relative overflow-hidden">
            {/* Top Bar of Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#252E38]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  <selectedStage.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                      {selectedStage.subsystemId}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      {locale === 'fr' ? `Étape ${selectedStage.stepNumber} sur 12` : `Stage ${selectedStage.stepNumber} of 12`}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
                    {locale === 'fr' ? selectedStage.title.fr : selectedStage.title.en}
                  </h3>
                </div>
              </div>

              {onSelectSubsystem && (
                <button
                  type="button"
                  onClick={() => onSelectSubsystem(selectedStage.subsystemId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? `Fiche ${selectedStage.subsystemId}` : `Inspect ${selectedStage.subsystemId}`}</span>
                </button>
              )}
            </div>

            {/* Description & Energy Conversion Role */}
            <div className="mt-5 space-y-4">
              <div>
                <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  {locale === 'fr' ? 'Rôle & Description Fonctionnelle' : 'Role & Functional Description'}
                </h4>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {locale === 'fr' ? selectedStage.description.fr : selectedStage.description.en}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38] flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                    {locale === 'fr' ? 'Nature de la Conversion' : 'Conversion Nature'}
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                    {locale === 'fr' ? selectedStage.conversionType.fr : selectedStage.conversionType.en}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                    {locale === 'fr' ? 'Localisation Physique' : 'Physical Location'}
                  </div>
                  <div className="text-xs font-mono text-neutral-300 mt-0.5">
                    {selectedStage.physicalLocation}
                  </div>
                </div>
              </div>

              {/* Governing Mathematical Formulation */}
              <div className="p-4 rounded-xl bg-[#090E17] border border-cyan-950/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? 'Formulation Physique / Équation Maîtresse' : 'Governing Physical Equation'}</span>
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500">ISO / IEC</span>
                </div>
                <div className="py-2 px-3 rounded-lg bg-[#05080E] border border-[#1A2333] font-mono text-cyan-200 text-sm overflow-x-auto">
                  {selectedStage.governingEquation}
                </div>
                <p className="text-xs text-neutral-400 font-sans">
                  {locale === 'fr' ? selectedStage.equationDescription.fr : selectedStage.equationDescription.en}
                </p>
              </div>

              {/* Operational Limits & Parameters */}
              <div>
                <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  {locale === 'fr' ? 'Grandeurs Physiques & Paramètres de Fonctionnement' : 'Operating Parameters & Physics'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedStage.operatingParameters.map((param, pIdx) => (
                    <div key={pIdx} className="p-3 rounded-xl bg-[#090D14] border border-[#252E38]">
                      <div className="text-[10px] font-mono text-neutral-400 truncate">{param.name}</div>
                      <div className="text-lg font-black font-mono text-white mt-1">
                        {param.value} <span className="text-xs font-normal text-cyan-400">{param.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Components & Standards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    {locale === 'fr' ? 'Organes & Équipements Clés' : 'Key Mechanical / Electrical Hardware'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-300 font-mono">
                    {selectedStage.keyComponents.map((c, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-2">
                        <span className="text-cyan-400">▹</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    {locale === 'fr' ? 'Normes & Codes Applicables' : 'Applicable International Standards'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStage.associatedStandards.map((std, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-1 rounded bg-[#161D27] border border-[#2A3644] text-[11px] font-mono font-bold text-neutral-300"
                      >
                        {std}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider mt-4 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? 'Risques & Modes de Rupture' : 'Failure Risks & Critical Modes'}</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-neutral-300 font-sans">
                    {selectedStage.keyFailureModes.map((fm, fmIdx) => (
                      <li key={fmIdx} className="flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{locale === 'fr' ? fm.fr : fm.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 1 COL: INTERACTIVE WATER-TO-WIRE LIVE CALCULATOR */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-cyan-800/60 bg-linear-to-b from-[#0D1524] to-[#0A0E17] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                  {locale === 'fr' ? 'Simulateur Water-to-Wire' : 'Water-to-Wire Calculator'}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                P = ρ·g·Q·H·η
              </span>
            </div>

            <p className="text-xs text-neutral-300 mt-3 leading-relaxed">
              {locale === 'fr'
                ? 'Ajustez la hauteur de chute nette et le débit turbiné pour observer en direct la conversion de puissance hydraulique en puissance électrique injectée.'
                : 'Adjust net head and turbine discharge to observe real-time hydraulic power conversion into evacuated grid electrical power.'}
            </p>

            {/* Controls */}
            <div className="mt-5 space-y-4">
              {/* Head Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">{locale === 'fr' ? 'Hauteur Nette (H) :' : 'Net Head (H):'}</span>
                  <span className="text-white font-bold">{simHead.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="0.5"
                  value={simHead}
                  onChange={(e) => setSimHead(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#1F2937] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>5 m (Basse chute)</span>
                  <span>500 m (Haute chute)</span>
                </div>
              </div>

              {/* Flow Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">{locale === 'fr' ? 'Débit Turbiné (Q) :' : 'Turbine Discharge (Q):'}</span>
                  <span className="text-white font-bold">{simFlow.toFixed(1)} m³/s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="350"
                  step="1"
                  value={simFlow}
                  onChange={(e) => setSimFlow(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#1F2937] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>1 m³/s</span>
                  <span>350 m³/s</span>
                </div>
              </div>

              {/* Turbine Efficiency Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">{locale === 'fr' ? 'Rendement Turbine (η_t) :' : 'Turbine Eff. (η_t):'}</span>
                  <span className="text-white font-bold">{(simEfficiency * 100).toFixed(1)} %</span>
                </div>
                <input
                  type="range"
                  min="0.80"
                  max="0.96"
                  step="0.005"
                  value={simEfficiency}
                  onChange={(e) => setSimEfficiency(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#1F2937] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Computed Results Screen */}
            <div className="mt-6 pt-4 border-t border-[#252E38] space-y-3">
              <div className="p-3 rounded-xl bg-[#06090F] border border-[#1A2333]">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">
                  {locale === 'fr' ? 'Puissance Hydraulique Brute' : 'Gross Hydraulic Potential'}
                </div>
                <div className="text-lg font-black font-mono text-neutral-300 mt-0.5">
                  {hydraulicPowerMW.toFixed(2)} <span className="text-xs font-normal">MW_hyd</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#06090F] border border-[#1A2333]">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">
                  {locale === 'fr' ? 'Puissance Mécanique sur l\'Arbre' : 'Shaft Mechanical Power'}
                </div>
                <div className="text-lg font-black font-mono text-sky-400 mt-0.5">
                  {shaftPowerMW.toFixed(2)} <span className="text-xs font-normal">MW_mech</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-700/60">
                <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase">
                  {locale === 'fr' ? 'Puissance Électrique Active Nette' : 'Net Electric Power Export'}
                </div>
                <div className="text-2xl font-black font-mono text-cyan-300 mt-0.5">
                  {electricPowerMW.toFixed(2)} <span className="text-xs font-normal">MW_e</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-400 mt-1">
                  {locale === 'fr' ? `Production annuelle estimée : ~${annualGWh.toFixed(0)} GWh/an` : `Est. annual generation: ~${annualGWh.toFixed(0)} GWh/yr`}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Real-world Benchmarks */}
          <div className="rounded-2xl border border-[#252E38] bg-[#0D1117] p-4 text-xs font-mono space-y-2">
            <span className="font-bold text-neutral-400 uppercase tracking-wider block">
              {locale === 'fr' ? 'Repères Réels (Cameroun)' : 'Real Cameroon References'}
            </span>
            <div className="flex justify-between py-1 border-b border-[#1A2333]">
              <span className="text-neutral-400">Songloulou (Francis)</span>
              <span className="text-cyan-300 font-bold">40 m · 138 m³/s → 48 MW/gr</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1A2333]">
              <span className="text-neutral-400">Memve\'ele (Francis)</span>
              <span className="text-cyan-300 font-bold">285 m · 22.5 m³/s → 52.8 MW/gr</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Lom Pangar (Kaplan)</span>
              <span className="text-cyan-300 font-bold">32 m · 25 m³/s → 7.5 MW/gr</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
