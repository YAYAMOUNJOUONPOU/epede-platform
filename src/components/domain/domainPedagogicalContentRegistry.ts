// src/components/domain/domainPedagogicalContentRegistry.ts
// Standardized 6-Part Pedagogical Content Registry (Sections A to F) for EPEDE Core Domains
import type { DomainCode } from '../../types/epede';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

export interface DomainPedagogicalSectionA {
  roleFr: string;
  roleEn: string;
  inputsFr: { title: string; desc: string; voltage: string };
  inputsEn: { title: string; desc: string; voltage: string };
  processFr: { title: string; desc: string; note: string };
  processEn: { title: string; desc: string; note: string };
  outputsFr: { title: string; desc: string; earthing: string };
  outputsEn: { title: string; desc: string; earthing: string };
}

export interface DomainPedagogicalSectionB {
  summaryFr: string;
  summaryEn: string;
  architectures: Array<{
    nameFr: string;
    nameEn: string;
    techFr: string;
    techEn: string;
    descFr: string;
    descEn: string;
    standard: string;
    metricFr: string;
    metricEn: string;
  }>;
}

export interface DomainPedagogicalSectionCItem {
  id: string;
  nameFr: string;
  nameEn: string;
  voltage: string;
  roleFr: string;
  roleEn: string;
  symbol: string;
  standard: string;
  imgUrl: string;
  calcTab?: CalculatorTabType;
}

export interface DomainPedagogicalSectionDPhase {
  phase: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
}

export interface DomainPedagogicalSectionETopic {
  id: string;
  tabLabelFr: string;
  tabLabelEn: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  formula: string;
  formulaDescFr: string;
  formulaDescEn: string;
  assumptionsFr: string[];
  assumptionsEn: string[];
  calcTab?: CalculatorTabType;
  simTab?: SimulationTabType;
}

export interface DomainPedagogicalSectionFStandard {
  code: string;
  tag: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
}

export interface DomainPedagogicalFrameworkData {
  domainCode: DomainCode;
  sectionA: DomainPedagogicalSectionA;
  sectionB: DomainPedagogicalSectionB;
  sectionC: DomainPedagogicalSectionCItem[];
  sectionD: DomainPedagogicalSectionDPhase[];
  sectionE: DomainPedagogicalSectionETopic[];
  sectionF: DomainPedagogicalSectionFStandard[];
}

export const DOMAIN_PEDAGOGICAL_FRAMEWORK_REGISTRY: Partial<Record<DomainCode, DomainPedagogicalFrameworkData>> = {
  // D01: Production d'Énergie
  D01: {
    domainCode: 'D01',
    sectionA: {
      roleFr: "Conversion de l'énergie primaire (hydraulique, thermique, solaire, biomasse) en puissance électrique triphasée synchrone.",
      roleEn: 'Conversion of primary energy sources into synchronous 3-phase high-voltage electrical power.',
      inputsFr: {
        title: 'Sources Primaires d\'Énergie',
        desc: 'Énergie hydraulique (chute d\'eau Sanaga, Songloulou, Nachtigal), rayonnement solaire PV ou combustible fossile.',
        voltage: 'Énergie mécanique d\'arbre'
      },
      inputsEn: {
        title: 'Primary Energy Resources',
        desc: 'Hydraulic head (Sanaga river, Songloulou, Nachtigal), solar irradiance, or fuel combustion.',
        voltage: 'Mechanical shaft torque'
      },
      processFr: {
        title: 'Alternateur Synchrone & AVR',
        desc: 'Stator triphasé et rotor à pôles saillants avec régulation automatique de tension (AVR) et asservissement de vitesse.',
        note: 'Tension stator : 6.6 kV à 15 kV'
      },
      processEn: {
        title: 'Synchronous Alternator & AVR',
        desc: 'Salient-pole rotor with automatic voltage regulator (AVR) and speed-governor loop.',
        note: 'Stator Voltage: 6.6 kV to 15 kV'
      },
      outputsFr: {
        title: 'Évacuation de Puissance GSU',
        desc: 'Transformateur élévateur GSU injectant directement sur le réseau de transport 225 kV SONATREL.',
        earthing: 'Neutre générateur par résistance NGR'
      },
      outputsEn: {
        title: 'GSU Power Step-Up Evacuation',
        desc: 'Generator Step-Up (GSU) transformer feeding into SONATREL 225 kV transmission grid.',
        earthing: 'Neutral grounding via NGR resistor'
      }
    },
    sectionB: {
      summaryFr: 'Architecture bloc alternateur-transformateur et topologies d\'évacuation de puissance.',
      summaryEn: 'Unit generator-transformer scheme and bulk power evacuation architectures.',
      architectures: [
        {
          nameFr: 'Schéma Bloc Unitaire (Generator-Transformer Unit)',
          nameEn: 'Unit Generator-Transformer Scheme',
          techFr: 'Liaison directe alternateur - transformateur élévateur sans disjoncteur générateur',
          techEn: 'Direct generator-to-GSU coupling without intermediate generator circuit breaker',
          descFr: 'Architecture simplifiée et robuste, la coupure principale s\'effectue côté 225 kV par le disjoncteur de poste.',
          descEn: 'Simplified robust configuration where primary fault clearing occurs on the 225 kV substation breaker.',
          standard: 'CEI 60034-1',
          metricFr: 'Rendement global : > 98.2%',
          metricEn: 'Overall efficiency: > 98.2%'
        },
        {
          nameFr: 'Schéma avec Disjoncteur Générateur (GCB)',
          nameEn: 'Generator Circuit Breaker (GCB) Scheme',
          techFr: 'Disjoncteur de puissance dédié entre stator alternateur et primaire GSU',
          techEn: 'Dedicated generator breaker between alternator terminals and GSU transformer',
          descFr: 'Permet d\'alimenter les auxiliaires de centrale directement depuis le réseau sans faire tourner la machine.',
          descEn: 'Allows feeding plant station services directly from the grid without spinning the turbine.',
          standard: 'IEEE C37.013',
          metricFr: 'Coupure Icc dissymétrique : 120 kA',
          metricEn: 'Asymmetrical breaking: 120 kA'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-hydro-gen-01',
        nameFr: 'Alternateur Synchrone Vertical (48 MVA)',
        nameEn: 'Vertical Synchronous Hydro Generator (48 MVA)',
        voltage: '10.5 kV • 2 640 A • cos φ 0.90',
        roleFr: 'Génération de puissance active et réactive couplée à la turbine Francis.',
        roleEn: 'Active and reactive power generation coupled to Francis hydraulic turbine.',
        symbol: 'G1',
        standard: 'CEI 60034-1',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        calcTab: 'transformer'
      },
      {
        id: 'eq-exp-gsu-trafo-01',
        nameFr: 'Transformateur Élévateur GSU (50 MVA)',
        nameEn: 'Generator Step-Up (GSU) Transformer (50 MVA)',
        voltage: '10.5 kV / 225 kV • YNd11',
        roleFr: 'Élévation de tension pour limiter les pertes Joule lors du transport vers Yaoundé/Douala.',
        roleEn: 'Voltage step-up to minimize transmission losses along 225 kV grid lines.',
        symbol: 'T1',
        standard: 'CEI 60076-1',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'transformer'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Études Hydrologiques & Réseau',
        titleEn: 'Hydrology & Grid Studies',
        descFr: 'Calcul des débits classés de la Sanaga, hauteur de chute et stabilité transitoire d\'angle rotorique.',
        descEn: 'River flow duration curve, head calculation, and transient rotor angle stability assessment.'
      },
      {
        phase: '02',
        titleFr: 'Dimensionnement Alternateur & AVR',
        titleEn: 'Alternator & AVR Sizing',
        descFr: 'Définition des réactances (Xd, X\'d, X"d) et réglage des limiteurs de sous/surexcitation.',
        descEn: 'Determination of machine reactances and tuning under/over-excitation limiters.'
      },
      {
        phase: '03',
        titleFr: 'Essais de Plateforme en Usine (FAT)',
        titleEn: 'Factory Acceptance Tests (FAT)',
        descFr: 'Mesure des pertes fer/cuivre, échauffement en court-circuit et tenue diélectrique statorique.',
        descEn: 'No-load and short-circuit loss measurement, thermal run, and stator dielectric test.'
      },
      {
        phase: '04',
        titleFr: 'Mise en Eau & Essais Site (SAT)',
        titleEn: 'Wet Commissioning (SAT)',
        descFr: 'Essais de survitesse, synchronisation réseau automatique et délestage pleine charge.',
        descEn: 'Overspeed verification, automatic autosynchronization, and full-load rejection test.'
      },
      {
        phase: '05',
        titleFr: 'Maintenance Prédictive & Diagnostic',
        titleEn: 'Predictive O&M & Diagnostics',
        descFr: 'Analyse vibratoire des paliers, thermographie des têtes de bobines et suivi des décharges partielles.',
        descEn: 'Vibration monitoring, stator end-winding thermography, and partial discharge tracking.'
      }
    ],
    sectionE: [
      {
        id: 'pq_curve',
        tabLabelFr: 'Diagramme P-Q Alternateur',
        tabLabelEn: 'P-Q Capability Curve',
        titleFr: 'Limites de Fonctionnement Puissance Active / Réactive',
        titleEn: 'Active and Reactive Power Operational Limits',
        descFr: 'Détermine les plages admissibles en fourniture/absorption de réactif sans échauffement ni décrochage.',
        descEn: 'Defines allowable leading and lagging operating boundaries avoiding stator heating and instability.',
        formula: 'Q_max = √( (E_f · U / X_d)² - P² ) - (U² / X_d)',
        formulaDescFr: 'Limite thermique rotorique en surexcitation et limite de stabilité d\'angle en sous-excitation.',
        formulaDescEn: 'Rotor thermal limit under lagging conditions and small-signal stability limit leading.',
        assumptionsFr: [
          'Tension aux bornes maintenue à Un ± 5%.',
          'Refroidissement air/eau nominal respecté.',
          'Marge minimale de stabilité d\'angle de 10%.'
        ],
        assumptionsEn: [
          'Terminal voltage maintained within Un ± 5%.',
          'Nominal air/water cooling conditions.',
          'Minimum 10% steady-state stability margin.'
        ],
        simTab: 'transient-stability'
      },
      {
        id: 'generator_fault',
        tabLabelFr: 'Court-Circuit aux Bornes',
        tabLabelEn: 'Terminal Fault Current',
        titleFr: 'Courant de Court-Circuit Subtransitoire (Ik")',
        titleEn: 'Subtransient Short-Circuit Current (Ik")',
        descFr: 'Calibre les contraintes électrodynamiques subies par le stator et le jeu de barres de centrale.',
        descEn: 'Sizes the electrodynamic stresses sustained by stator windings and generator busbars.',
        formula: 'Ik" = (c · Un) / (√3 · Xd")',
        formulaDescFr: 'Avec Xd" = réactance subtransitoire directe (typiquement 15-25% sur base machine).',
        formulaDescEn: 'Where Xd" is the direct-axis subtransient reactance (15-25% on generator base).',
        assumptionsFr: [
          'Court-circuit triphasé franc aux bornes stator.',
          'Facteur de tension c = 1.05 ou 1.10 selon CEI 60909-0.',
          'Composante continue apériodique dimensionnante pour le pouvoir de fermeture.'
        ],
        assumptionsEn: [
          'Bolted 3-phase fault at stator terminals.',
          'Voltage factor c per IEC 60909-0.',
          'DC offset component sizing for peak making current.'
        ],
        calcTab: 'cable-short-circuit'
      }
    ],
    sectionF: [
      {
        code: 'CEI 60034-1',
        tag: 'MACHINES TOURNANTES',
        titleFr: 'Machines Électriques Tournantes · Caractéristiques & Essais',
        titleEn: 'Rotating Electrical Machines · Rating and Performance',
        descFr: 'Spécification des puissances assignées, classes d\'isolation thermique (F/B) et régimes de service S1.',
        descEn: 'Specification of continuous ratings, thermal insulation classes, and duty cycles.'
      },
      {
        code: 'CODE ARSEL',
        tag: 'CAMEROUN',
        titleFr: 'Règles Techniques de Raccordement des Centrales',
        titleEn: 'National Generation Interconnection Requirements',
        descFr: 'Plage d\'excursion en fréquence (47.5 Hz – 52 Hz) et tenue aux creux de tension (LVRT / FRT).',
        descEn: 'Frequency operating envelope and Low-Voltage Ride-Through (LVRT) grid code mandates.'
      }
    ]
  },

  // D03: Transport d'Énergie HTB
  D03: {
    domainCode: 'D03',
    sectionA: {
      roleFr: "Transit massif d'énergie électrique sur de longues distances entre les centrales de production et les centres de charge urbains.",
      roleEn: 'Bulk power transmission over long distances between generating plants and urban load centers.',
      inputsFr: {
        title: 'Postes Élévateurs de Centrale',
        desc: 'Énergie injectée à 225 kV depuis les centrales de Songloulou, Edéa et Nachtigal.',
        voltage: '225 kV THT • 50 Hz'
      },
      inputsEn: {
        title: 'Powerhouse Step-Up Substations',
        desc: 'Power injected at 225 kV from Songloulou, Edéa, and Nachtigal powerplants.',
        voltage: '225 kV EHV • 50 Hz'
      },
      processFr: {
        title: 'Lignes Aériennes & Pylônes SONATREL',
        desc: 'Faisceaux de conducteurs Almelec/ACSR portés par pylônes en treillis avec câbles de garde à fibre optique (OPGW).',
        note: 'Capacité thermique : jusqu\'à 350 MVA par circuit'
      },
      processEn: {
        title: 'Overhead Lines & Transmission Towers',
        desc: 'Bundle conductors on steel lattice towers equipped with OPGW optical ground wires.',
        note: 'Thermal capacity: up to 350 MVA per circuit'
      },
      outputsFr: {
        title: 'Postes d\'Interconnexion & Répartition',
        desc: 'Arrivée dans les grands postes de nœud (Oyomabang, Bekoko, Mangombé) pour abaissement 90 kV / 30 kV.',
        earthing: 'Lignes avec mise à la terre des pylônes (< 10 Ω)'
      },
      outputsEn: {
        title: 'Grid Interconnection & Distribution Substations',
        desc: 'Delivery at major regional hub nodes (Oyomabang, Bekoko) for step-down to 90 kV / 30 kV.',
        earthing: 'Tower footing resistance < 10 Ω'
      }
    },
    sectionB: {
      summaryFr: 'Topologies en simple et double terne 225 kV / 90 kV formant l\'épine dorsale du Réseau Interconnecté Sud (RIS).',
      summaryEn: 'Single and double-circuit overhead 225 kV / 90 kV lines forming the Cameroon Southern Grid backbone.',
      architectures: [
        {
          nameFr: 'Ligne 225 kV Double Terne (2 Circuits)',
          nameEn: 'Double-Circuit 225 kV Line',
          techFr: 'Pylônes en treillis avec 2 circuits triphasés indépendants et 2 câbles de garde',
          techEn: 'Lattice towers supporting two independent 3-phase circuits and dual shield wires',
          descFr: 'Garantit la redondance N-1 : en cas de déclenchement d\'un circuit par coup de foudre, l\'autre maintient l\'alimentation.',
          descEn: 'Ensures N-1 contingency: tripping of one circuit by lightning leaves the second circuit in service.',
          standard: 'CEI 60826',
          metricFr: 'Portée moyenne : 350 à 450 m',
          metricEn: 'Average span: 350 to 450 m'
        },
        {
          nameFr: 'Câbles Souterrains 90 kV / 225 kV XLPE',
          nameEn: 'Underground EHV XLPE Cable Feeders',
          techFr: 'Conducteurs cuivre ou aluminium isolés au polyéthylène réticulé haute tension',
          techEn: 'Cross-linked polyethylene insulated EHV underground cables',
          descFr: 'Utilisés pour les traversées urbaines denses (pénétration dans Yaoundé et Douala) où les lignes aériennes sont interdites.',
          descEn: 'Deployed for urban grid penetration into dense city centers where overhead rights-of-way are unavailable.',
          standard: 'CEI 60840',
          metricFr: 'Effet capacitif : 0.2 - 0.3 µF/km',
          metricEn: 'Capacitance: 0.2 - 0.3 µF/km'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-tower-225kv',
        nameFr: 'Pylône Métallique en Treillis 225 kV',
        nameEn: '225 kV Steel Lattice Transmission Tower',
        voltage: '225 kV • Double Terne',
        roleFr: 'Support mécanique et maintien des distances diélectriques au sol et entre phases.',
        roleEn: 'Structural support and dielectric clearance maintenance for transmission bundles.',
        symbol: 'LINE-225',
        standard: 'CEI 60826',
        imgUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        calcTab: 'cable-ampacity'
      },
      {
        id: 'eq-exp-line-conductor',
        nameFr: 'Faisceau de Conducteurs Almelec (Aster 570 mm²)',
        nameEn: 'All-Aluminium Alloy Conductor (AAAC 570 mm²)',
        voltage: '225 kV • 900 A permanent',
        roleFr: 'Transport du courant de puissance avec résistance ohmique linéique minimale.',
        roleEn: 'High-current bulk power transport with minimized line resistive losses.',
        symbol: 'COND',
        standard: 'CEI 61089',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'cable-ampacity'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Étude de Tracé & Météorologie',
        titleEn: 'Route Survey & Environmental Profile',
        descFr: 'Tracé topographique, niveau kéraunique (Nk > 80 j/an au Cameroun) et tenue aux vents violents.',
        descEn: 'Corridor profiling, high keraunic lightning exposure, and gale wind loading criteria.'
      },
      {
        phase: '02',
        titleFr: 'Dimensionnement Électrique & Mécanique',
        titleEn: 'Electrical & Sag-Tension Sizing',
        descFr: 'Calcul de la flèche maximale à 75°C, portée équivalente et pertes Joule / effet couronne.',
        descEn: 'Maximum sag at 75°C, ruling span, Joule losses, and corona inception threshold.'
      },
      {
        phase: '03',
        titleFr: 'Fondations & Levage des Pylônes',
        titleEn: 'Foundations & Tower Erection',
        descFr: 'Massifs béton armé, vérification de la résistance à l\'arrachement et assemblage mécano-soudé.',
        descEn: 'Reinforced concrete footings, uplift resistance verification, and tower bolting.'
      },
      {
        phase: '04',
        titleFr: 'Déroulage des Conducteurs & Réglage Flèches',
        titleEn: 'Conductor Stringing & Sagging',
        descFr: 'Tirage sous tension mécanique contrôlée, serrage des pinces d\'ancrage et pose des entretoises.',
        descEn: 'Tension stringing, dead-end clamping, and bundle spacer damper installation.'
      },
      {
        phase: '05',
        titleFr: 'Inspection Ligne & Thermographie',
        titleEn: 'Line Patrol & Thermal Inspection',
        descFr: 'Visite de ligne pédestre/drone, contrôle thermographique des manchons et élagage des couloirs.',
        descEn: 'Drone/foot patrol, infrared inspection of compression sleeves, and right-of-way clearing.'
      }
    ],
    sectionE: [
      {
        id: 'ferranti_effect',
        tabLabelFr: 'Effet Ferranti & Réactif',
        tabLabelEn: 'Ferranti Effect & Var',
        titleFr: 'Élévation de Tension à Vide en Bout de Ligne',
        titleEn: 'No-Load Voltage Rise at Line Receiving End',
        descFr: 'Sur longue ligne peu chargée, la puissance réactive capacitive générée élève la tension réceptrice au-delà de la consigne.',
        descEn: 'Under light load, line distributed shunt capacitance produces dangerous receiving-end overvoltages.',
        formula: 'ΔU = U_receptrice - U_emission ≈ (ω² · L_total · C_total / 2) · U',
        formulaDescFr: 'Nécessite la mise en service de réactances shunt inductives de compensation (CEI 60076-6).',
        formulaDescEn: 'Requires installation of shunt inductive compensation reactors (IEC 60076-6).',
        assumptionsFr: [
          'Régime permanent à vide (I_charge = 0).',
          'Fréquence nominale 50 Hz.',
          'Ligne longue modélisée en schéma en Pi distribué.'
        ],
        assumptionsEn: [
          'Open-circuit receiving end condition.',
          '50 Hz nominal frequency.',
          'Distributed Pi-network transmission line model.'
        ],
        calcTab: 'voltage-drop'
      },
      {
        id: 'thermal_ampacity',
        tabLabelFr: 'Capacité Thermique de Ligne',
        tabLabelEn: 'Line Thermal Ampacity',
        titleFr: 'Courant Admissible Permanent & Échauffement Conducteur',
        titleEn: 'Continuous Current Ampacity & Conductor Temperature',
        descFr: 'Équilibre entre échauffement par effet Joule / rayonnement solaire et refroidissement par convection du vent.',
        descEn: 'Thermal balance between Joule heating, solar gain, and wind convective cooling.',
        formula: 'I_max = √[ (q_convection + q_rayonnement - q_solaire) / R(T_max) ]',
        formulaDescFr: 'Méthode CIGRE / IEEE 738 avec température maximale d\'âme fixée à 75°C ou 90°C.',
        formulaDescEn: 'IEEE 738 / CIGRE heat balance model with maximum core limit at 75°C or 90°C.',
        assumptionsFr: [
          'Vitesse de vent minimale défavorable : 0.6 m/s.',
          'Ensoleillement tropical : 1 000 W/m².',
          'Température ambiante maximale : 40°C à 45°C.'
        ],
        assumptionsEn: [
          'Conservative minimum perpendicular wind: 0.6 m/s.',
          'Tropical solar insolation: 1,000 W/m².',
          'Ambient ceiling temperature: 40°C to 45°C.'
        ],
        calcTab: 'cable-ampacity'
      }
    ],
    sectionF: [
      {
        code: 'CEI 60826',
        tag: 'CONCEPTION LIGNES',
        titleFr: 'Critères de Conception des Lignes Aériennes de Transport',
        titleEn: 'Design Criteria of Overhead Transmission Lines',
        descFr: 'Hypothèses de vent, charges mécaniques de rupture et distances d\'isolement de sécurité.',
        descEn: 'Wind loads, mechanical conductor tensile limits, and clearance safety envelopes.'
      },
      {
        code: 'NF EN 50341',
        tag: 'EUROPE / INTERNATIONAL',
        titleFr: 'Lignes Électriques Aériennes Dépassant 1 kV CA',
        titleEn: 'Overhead Electrical Lines Exceeding 1 kV AC',
        descFr: 'Règles normatives pour le calcul des flèches, des efforts sur pylônes et coordination d\'isolement.',
        descEn: 'Engineering rules for sag-tension, tower structural integrity, and insulation coordination.'
      }
    ]
  },

  // D05: Distribution HTA/BT
  D05: {
    domainCode: 'D05',
    sectionA: {
      roleFr: "Acheminement et distribution finale de l'énergie électrique vers les usagers industriels, tertiaires et résidentiels en moyenne et basse tension.",
      roleEn: 'Final electrical power delivery to industrial, commercial, and residential consumers at MV and LV.',
      inputsFr: {
        title: 'Postes Sources HTB/HTA',
        desc: 'Énergie reçue des postes de transformation 225/30 kV ou 90/15 kV.',
        voltage: '30 kV ou 15 kV HTA'
      },
      inputsEn: {
        title: 'Primary Grid Substations',
        desc: 'Power stepped down from 225/30 kV or 90/15 kV transmission substations.',
        voltage: '30 kV or 15 kV MV'
      },
      processFr: {
        title: 'Réseaux Moyenne Tension & Postes HTA/BT',
        desc: 'Artères souterraines ou lignes mixtes aériennes alimentant des postes de transformation compacts ou sur poteau (H61).',
        note: 'Transformateurs HTA/BT : 50 kVA à 1 600 kVA'
      },
      processEn: {
        title: 'MV Feeders & Distribution Kiosks',
        desc: 'Underground cables or pole-mounted (H61) transformers stepping voltage down to 400 V.',
        note: 'Distribution Transformers: 50 kVA to 1,600 kVA'
      },
      outputsFr: {
        title: 'Réseau Basse Tension 400 V / 230 V',
        desc: 'Alimentation des Tableaux Généraux Basse Tension (TGBT) et compteurs divisionnaires des abonnés.',
        earthing: 'Régime de neutre TT (distribution publique) ou TN-S'
      },
      outputsEn: {
        title: 'Low Voltage 400 V / 230 V Grid',
        desc: 'Supply to Main Low Voltage Switchboards (MLVS) and customer smart revenue meters.',
        earthing: 'TT earthing (public utilities) or TN-S (industrial)'
      }
    },
    sectionB: {
      summaryFr: 'Architectures en boucle ouverte (coupure d\'artère) et départs radiaux sécurisés.',
      summaryEn: 'Open-ring switchgear loops and protected radial feeder architectures.',
      architectures: [
        {
          nameFr: 'Boucle Ouverte HTA (Coupure d\'Artère / Ring Main Unit)',
          nameEn: 'Open Ring Feeder (Ring Main Unit RMU)',
          techFr: 'Cellules compactes isolées au gaz SF6 ou air sec avec point de coupure normalement ouvert',
          techEn: 'Compact RMU switchgear in SF6 or dry air with normally open sectionalizing tie-point',
          descFr: 'Permet d\'isoler un tronçon de câble en défaut en moins de 15 minutes et de réalimenter les abonnés par l\'autre côté.',
          descEn: 'Enables fault isolation and power restoration via alternate feeder path within 15 minutes.',
          standard: 'CEI 62271-200',
          metricFr: 'Indisponibilité SAIDI divisée par 4',
          metricEn: 'SAIDI outage duration reduced by 4x'
        },
        {
          nameFr: 'Départ Radial HTA Aérien avec Réenclencheur (Auto-Recloser)',
          nameEn: 'Overhead Radial Feeder with Auto-Recloser',
          techFr: 'Ligne aérienne équipée d\'un disjoncteur réenclencheur automatique de poteau (ACR)',
          techEn: 'Overhead rural line protected by pole-mounted automatic vacuum recloser',
          descFr: 'Élimine automatiquement 80% des défauts fugitifs causés par la végétation ou les éclairs en zone tropicale.',
          descEn: 'Automatically clears 80% of transient faults caused by vegetation or tropical lightning strikes.',
          standard: 'CEI 62271-111',
          metricFr: 'Cycle : O-0.5s-CO-2s-CO',
          metricEn: 'Reclose cycle: O-0.5s-CO-2s-CO'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-cell-mv-30k',
        nameFr: 'Cellule Modulaire HTA 30 kV (SM6 / Ringmaster)',
        nameEn: 'Modular MV Switchgear 30 kV (Ringmaster)',
        voltage: '30 kV • 630 A • 16 kA 1s',
        roleFr: 'Interrupteur-sectionneur et protection combinée fusibles ou disjoncteur de poste HTA/BT.',
        roleEn: 'Load-break switch and circuit breaker for MV/LV distribution transformer protection.',
        symbol: 'RMU',
        standard: 'CEI 62271-200',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'cable-short-circuit'
      },
      {
        id: 'eq-exp-kiosk-30kv-400v',
        nameFr: 'Transformateur HTA/BT Kiosque (630 kVA)',
        nameEn: 'MV/LV Distribution Substation Transformer (630 kVA)',
        voltage: '30 kV / 400 V • Dyn11',
        roleFr: 'Abaissement direct au niveau d\'utilisation triphasé 400 V / monophasé 230 V.',
        roleEn: 'Direct step-down to utilization voltage 400 V three-phase / 230 V single-phase.',
        symbol: 'TR-BT',
        standard: 'CEI 60076-1',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        calcTab: 'transformer'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Bilan de Puissance & Foisonnement',
        titleEn: 'Load Schedule & Coincidence Factor',
        descFr: 'Calcul de la puissance installée (Pn), coefficients d\'utilisation (ku) et de foisonnement (ks).',
        descEn: 'Installed capacity aggregation with utilization (ku) and coincidence (ks) factors.'
      },
      {
        phase: '02',
        titleFr: 'Calcul de Section Câble & Chute de Tension',
        titleEn: 'Cable Sizing & Voltage Drop Sag',
        descFr: 'Vérification du courant admissible Iz, de la chute de tension ΔU ≤ 5% et de la contrainte thermique Icc.',
        descEn: 'Conductor current capacity Iz, voltage drop ΔU ≤ 5%, and short-circuit thermal limit.'
      },
      {
        phase: '03',
        titleFr: 'Sélection des Protections & Déclencheurs',
        titleEn: 'Protective Breaker Setting',
        descFr: 'Calibrage des déclencheurs thermiques Ir et magnétiques Im pour garantir le déclenchement sur défaut bout de ligne.',
        descEn: 'Setting thermal Ir and magnetic Im trips ensuring instantaneous clearance on remote end faults.'
      },
      {
        phase: '04',
        titleFr: 'Pose, Raccordement & Mesure de Terre',
        titleEn: 'Installation & Ground Resistance Test',
        descFr: 'Déroulage en tranchée selon NF C 15-100, confection des boîtes d\'extrémité et contrôle de la terre (R ≤ 10 Ω).',
        descEn: 'Trench laying, heat-shrink cable terminations, and ground rod testing (R ≤ 10 Ω).'
      },
      {
        phase: '05',
        titleFr: 'Mise en Service & Équilibrage des Phases',
        titleEn: 'Commissioning & Phase Balancing',
        descFr: 'Mesure des courants de phase à pleine charge, équilibrage des départs monophasés et contrôle du neutre.',
        descEn: 'Full-load phase current clamp measurements and neutral current unbalance mitigation.'
      }
    ],
    sectionE: [
      {
        id: 'voltage_drop_calc',
        tabLabelFr: 'Chute de Tension ΔU (Câbles)',
        tabLabelEn: 'Cable Voltage Drop (ΔU)',
        titleFr: 'Calcul de la Chute de Tension en Ligne selon NF C 15-105 / CEI 60364',
        titleEn: 'Voltage Sag Calculation per NF C 15-105 / IEC 60364',
        descFr: 'Garantit que la tension au point le plus éloigné de l\'installation reste dans les tolérances réglementaires.',
        descEn: 'Verifies that voltage at the furthest load terminal meets standard statutory limits.',
        formula: 'ΔU = b · ( (ρ · L / S) · cos φ + λ · L · sin φ ) · I_b',
        formulaDescFr: 'Avec b = 1 en triphasé équilibré, ρ = résistivité du conducteur au régime chaud (0.023 Ω·mm²/m Cu, 0.037 Al).',
        formulaDescEn: 'With b = 1 for 3-phase, ρ at operating temperature (0.023 for copper, 0.037 for aluminum).',
        assumptionsFr: [
          'Chute de tension maximale tolérée : 3% éclairage, 5% force motrice.',
          'Prise en compte de la réactance linéique λ ≈ 0.08 mΩ/m.',
          'Conducteurs en nappe ou trèfle selon mode de pose standard.'
        ],
        assumptionsEn: [
          'Statutory voltage drop limits: 3% lighting, 5% other power loads.',
          'Line inductive reactance λ ≈ 0.08 mΩ/m.',
          'Standard installation reference methods.'
        ],
        calcTab: 'voltage-drop'
      },
      {
        id: 'end_fault_calc',
        tabLabelFr: 'Icc Bout de Câble (Protection)',
        tabLabelEn: 'Cable-End Fault Current',
        titleFr: 'Courant de Court-Circuit Minimal en Extrémité de Câble',
        titleEn: 'Minimum Short-Circuit Current at Cable End',
        descFr: 'Indispensable pour vérifier que le disjoncteur ou le fusible déclenchera instantanément en cas de défaut éloigné.',
        descEn: 'Required to ensure that the protective breaker magnetic trip will reliably operate on remote faults.',
        formula: 'Icc_min = (c_min · Un) / (√3 · Z_boucle)',
        formulaDescFr: 'La condition de déclenchement magnétique sécurisé impose : Im ≤ Icc_min.',
        formulaDescEn: 'Instantaneous magnetic trip clearance requires: Im ≤ Icc_min.',
        assumptionsFr: [
          'Facteur de tension c_min = 0.95 en basse tension.',
          'Résistance des conducteurs calculée à la température maximale de défaut (160°C PR).',
          'Défaut phase-neutre ou phase-PE le plus défavorable.'
        ],
        assumptionsEn: [
          'Voltage factor c_min = 0.95.',
          'Conductor resistance at peak fault temperature (160°C XLPE).',
          'Worst-case phase-to-neutral or phase-to-earth fault.'
        ],
        calcTab: 'cable-short-circuit'
      }
    ],
    sectionF: [
      {
        code: 'NF C 15-100 / 105',
        tag: 'BASSE TENSION',
        titleFr: 'Installations Électriques à Basse Tension & Règles de Calcul',
        titleEn: 'Low Voltage Electrical Installations & Sizing Guide',
        descFr: 'Guide de référence pour le dimensionnement des câbles, la protection contre les chocs et le choix des SLT.',
        descEn: 'Reference rules for conductor sizing, protection against electric shock, and earthing schemes.'
      },
      {
        code: 'CEI 60364-5-52',
        tag: 'INTERNATIONAL',
        titleFr: 'Choix & Mise en Œuvre des Canalisations Électriques',
        titleEn: 'Selection and Erection of Electrical Equipment - Wiring Systems',
        descFr: 'Facteurs de correction de température, groupement de câbles et courants admissibles Iz.',
        descEn: 'Temperature derating factors, grouping corrections, and current carrying capacities.'
      }
    ]
  },

  // D02: Planification & Architecture des Réseaux
  D02: {
    domainCode: 'D02',
    sectionA: {
      roleFr: "Planification stratégique, modélisation nodale globale, calculs d'écoulement de charge (Load Flow) et vérification du critère de sécurité N-1.",
      roleEn: 'Strategic grid planning, nodal modeling, load flow dispatch analysis, and N-1 contingency security assessment.',
      inputsFr: {
        title: 'Bilan d\'Offre & Courbes de Charge',
        desc: 'Parcs de production hydraulique/thermique, prévisions d\'évolution de la demande de pointe industrielle et urbaine.',
        voltage: 'Réseaux HTB 225 kV & 90 kV'
      },
      inputsEn: {
        title: 'Generation Fleet & Demand Forecasts',
        desc: 'Hydro/thermal power plant dispatch capacities and long-term urban/industrial peak load forecasts.',
        voltage: '225 kV & 90 kV HV Networks'
      },
      processFr: {
        title: 'Résolution des Équations Nodales & Stabilité',
        desc: 'Calcul itératif de Newton-Raphson pour déterminer les modules et phases des tensions aux nœuds, transits sur lignes et marges de stabilité.',
        note: 'Critère de sécurité : Aucun dépassement de capacité thermique en régime N-1'
      },
      processEn: {
        title: 'Nodal Power Flow & Stability Solving',
        desc: 'Iterative Newton-Raphson algorithms computing bus voltage magnitudes, angles, line active/reactive flows, and dynamic stability limits.',
        note: 'Security benchmark: Zero line thermal overload during any single N-1 contingency'
      },
      outputsFr: {
        title: 'Plan de Tension & Schéma Directeur d\'Investissement',
        desc: 'Détermination des besoins de renforcement des corridors de transit, compensation réactive (bancs condensateurs, FACTS) et nouveaux postes.',
        earthing: 'Critère de stabilité dynamique transitoire respecté'
      },
      outputsEn: {
        title: 'Voltage Profile & Master Investment Plan',
        desc: 'Identification of transmission bottleneck reinforcements, reactive compensation siting, and future substation layout.',
        earthing: 'Transient stability margin compliant with grid codes'
      }
    },
    sectionB: {
      summaryFr: 'Architectures de réseaux maillés interconnectés à haute résilience vs réseaux radiaux ou bouclés ouverts.',
      summaryEn: 'High-resilience meshed interconnected transmission topologies vs radial distribution architectures.',
      architectures: [
        {
          nameFr: 'Réseau Maillé Interconnecté (225 kV / 90 kV)',
          nameEn: 'Meshed Transmission Grid (225 kV / 90 kV)',
          techFr: 'Chaque poste nœud est relié par au moins deux lignes indépendantes d\'interconnexion',
          techEn: 'Every substation node is interconnected via at least two independent transmission lines',
          descFr: 'Permet la redistribution instantanée des flux d\'énergie en cas de perte inopinée d\'un ouvrage (critère N-1 sans délestage de charge).',
          descEn: 'Instantaneous power rerouting upon sudden outage of any single asset without customer load shedding.',
          standard: 'CEI 60909 / Grid Code',
          metricFr: 'Disponibilité : > 99.9%',
          metricEn: 'Availability: > 99.9%'
        },
        {
          nameFr: 'Réseau Bouclé Exploité en Antenne Ouverte',
          nameEn: 'Open-Ring Feeder Topology',
          techFr: 'Boucle physique ouverte en un point central (Point d\'Ouverture Normal - PON)',
          techEn: 'Physical ring loop operated with a normally open tie switch (NOP)',
          descFr: 'Permet un isolement rapide du tronçon défaillant et le rebouclage manuel ou automatique par automates de réseau.',
          descEn: 'Facilitates fast fault isolation and automated feeder reconfiguration from adjacent healthy circuits.',
          standard: 'CEI 61936',
          metricFr: 'Temps de reprise : < 3 min',
          metricEn: 'Restoration time: < 3 min'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-svc-statcom',
        nameFr: 'Compensateur Statique de Puissance Réactive (SVC / STATCOM)',
        nameEn: 'Static Synchronous Compensator (STATCOM)',
        voltage: '225 kV • ±50 MVAr',
        roleFr: 'Régulation dynamique instantanée de la tension et maintien de la stabilité de réseau.',
        roleEn: 'Dynamic instantaneous bus voltage regulation and grid transient stability enhancement.',
        symbol: 'STATCOM',
        standard: 'CEI 61000-3-6',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'cable-ampacity'
      },
      {
        id: 'eq-exp-ems-dispatch',
        nameFr: 'Superviseur Énergétique EMS & Calculateurs Dispatching',
        nameEn: 'Energy Management System (EMS) Dispatch Computer',
        voltage: 'Contrôle-commande 48 Vcc / Serveurs Redondés',
        roleFr: 'Exécution en temps réel des calculs d\'estimateur d\'état et d\'optimisation économique du dispatch.',
        roleEn: 'Real-time state estimation execution and security-constrained economic dispatch computation.',
        symbol: 'EMS',
        standard: 'CEI 61970 (CIM)',
        imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Collecte des Données & Bilan Énergétique',
        titleEn: 'Data Ingestion & Energy Balance',
        descFr: 'Modélisation des nœuds de production, matrice des impédances de lignes et profils de consommation.',
        descEn: 'Production nodes modeling, line impedance matrix construction, and demand profiles.'
      },
      {
        phase: '02',
        titleFr: 'Simulations d\'Écoulement de Charge (Load Flow)',
        titleEn: 'Load Flow Simulations',
        descFr: 'Résolution numérique par Newton-Raphson pour évaluer le profil de tension et les pertes joule globales.',
        descEn: 'Numerical solving via Newton-Raphson assessing bus voltage profiles and transmission losses.'
      },
      {
        phase: '03',
        titleFr: 'Analyse de Contingence & Critère N-1',
        titleEn: 'Contingency Analysis & N-1 Rule',
        descFr: 'Déconnexion systématique de chaque ligne ou groupe pour identifier les risques d\'avalanche de surcharges.',
        descEn: 'Systematic outage testing of every branch to isolate potential cascading overload risks.'
      },
      {
        phase: '04',
        titleFr: 'Dimensionnement de la Compensation Réactive',
        titleEn: 'Reactive Compensation Sizing',
        descFr: 'Optimisation de l\'emplacement des bancs de condensateurs et réactances pour maintenir cos φ ≥ 0.93.',
        descEn: 'Optimal capacitor and reactor bank placement to uphold power factor standards.'
      },
      {
        phase: '05',
        titleFr: 'Schéma Directeur & Plan d\'Investissement',
        titleEn: 'Master Plan & CAPEX Roadmap',
        descFr: 'Arbitrage technico-économique des nouveaux corridors de lignes et extensions de postes.',
        descEn: 'Techno-economic prioritization for upcoming line corridors and substation expansions.'
      }
    ],
    sectionE: [
      {
        id: 'newton_raphson_flow',
        tabLabelFr: 'Équations Nodales de Transit (Load Flow)',
        tabLabelEn: 'Nodal Power Flow Equations',
        titleFr: 'Formulation d\'Écoulement de Charge de Newton-Raphson',
        titleEn: 'Newton-Raphson Power Flow Formulation',
        descFr: 'Permet de calculer les puissances actives et réactives transitant par chaque ligne à partir de la matrice d\'admittance nodale.',
        descEn: 'Calculates active and reactive power flows through every branch using the nodal admittance matrix.',
        formula: 'P_i = Σ |V_i| · |V_j| · (G_ij · cos θ_ij + B_ij · sin θ_ij)',
        formulaDescFr: 'Avec Vi le module de tension au nœud i, Gij et Bij la conductance et susceptance de la branche, et θij la différence angulaire.',
        formulaDescEn: 'With Vi the voltage magnitude at bus i, Gij and Bij line conductance/susceptance, and θij voltage angle difference.',
        assumptionsFr: [
          'Système triphasé équilibré en régime permanent sinusoïdal.',
          'Nœud bilan (Slack Bus) imposé avec tension module 1.00 pu et angle 0.0°.',
          'Nœuds générateurs fixés en puissance active P et module de tension V (Nœuds PV).',
          'Nœuds de consommation fixés en puissance active P et réactive Q (Nœuds PQ).'
        ],
        assumptionsEn: [
          'Balanced 3-phase steady-state condition.',
          'Slack bus defined with fixed voltage 1.00 pu and 0.0° phase angle.',
          'Generator buses specified by active power P and voltage magnitude V (PV buses).',
          'Load buses defined by active power P and reactive power Q (PQ buses).'
        ],
        simTab: 'ferranti'
      },
      {
        id: 'scc_bus_calc',
        tabLabelFr: 'Puissance de Court-Circuit au Nœud (Scc)',
        tabLabelEn: 'Short-Circuit Capacity (Scc)',
        titleFr: 'Puissance de Court-Circuit au Nœud de Raccordement selon CEI 60909',
        titleEn: 'Grid Node Short-Circuit Capacity per IEC 60909',
        descFr: 'Caractérise la "raideur" du réseau au point de livraison et détermine le pouvoir de coupure requis des disjoncteurs.',
        descEn: 'Defines grid electrical stiffness at the connection point and sets minimum switchgear breaking capacity.',
        formula: 'S_cc = √3 · U_n · I"k = (c · U_n²) / Z_th',
        formulaDescFr: 'Avec Un tension nominale entre phases, Icc" courant de court-circuit initial symétrique, et Zth impédance équivalente Thévenin.',
        formulaDescEn: 'With Un nominal line-to-line voltage, Icc" initial subtransient fault current, and Zth Thevenin equivalent grid impedance.',
        assumptionsFr: [
          'Facteur de tension c = 1.10 pour les réseaux haute tension HTB.',
          'Sources synchrones représentées par leur réactance subtransitoire xd".',
          'Court-circuit triphasé franc sans impédance d\'arc au point de raccordement.'
        ],
        assumptionsEn: [
          'Voltage factor c = 1.10 for high-voltage networks.',
          'Synchronous generators modeled by their subtransient reactance xd".',
          'Solid symmetrical 3-phase fault with zero arc resistance.'
        ],
        calcTab: 'cable-short-circuit'
      }
    ],
    sectionF: [
      {
        code: 'CEI 60909-0',
        tag: 'CALCULS DE RÉSEAUX',
        titleFr: 'Courants de Court-Circuit dans les Réseaux Triphasés à Courant Alternatif',
        titleEn: 'Short-Circuit Currents in Three-Phase A.C. Systems',
        descFr: 'Méthode normalisée internationale pour le calcul des courants de défaut symétriques et asymétriques.',
        descEn: 'International standard method for symmetrical and asymmetrical fault current determination.'
      },
      {
        code: 'CEI 61970 / CIM',
        tag: 'INTEROPÉRABILITÉ EMS',
        titleFr: 'Interface de Gestion de Réseau & Common Information Model',
        titleEn: 'Energy Management System Application Program Interface (CIM)',
        descFr: 'Modèle sémantique universel pour l\'échange de données de topologie et d\'état de réseau entre outils de simulation.',
        descEn: 'Universal semantic model for grid topology and state estimation data exchange between simulation platforms.'
      }
    ]
  },

  // D06: Installations Électriques & Tertiaire (Basse Tension & SLT)
  D06: {
    domainCode: 'D06',
    sectionA: {
      roleFr: "Distribution basse tension, protection absolue des personnes contre les chocs électriques (contacts directs/indirects) et continuité de service.",
      roleEn: 'Low-voltage terminal distribution, absolute personnel safety against electrical shocks, and uninterrupted service continuity.',
      inputsFr: {
        title: 'Arrivée HTA/BT ou Groupe Secours',
        desc: 'Secondaire du transformateur HTA/BT (ex: 30 kV / 400 V Dyn11) et basculement automatique groupe électrogène / inverseur Normal-Secours.',
        voltage: '400 V Triphasé / 230 V Monophasé • 50 Hz'
      },
      inputsEn: {
        title: 'MV/LV Transformer Secondary or Standby Genset',
        desc: 'MV/LV distribution transformer secondary (e.g., 30 kV / 400 V Dyn11) with Automatic Transfer Switch (ATS) standby diesel generator.',
        voltage: '400 V 3-Phase / 230 V 1-Phase • 50 Hz'
      },
      processFr: {
        title: 'TGBT & Maîtrise des Régimes de Neutre (SLT)',
        desc: 'Distribution sécurisée par colonnes TGBT, compensation locale du cos φ, onduleurs ASI sans coupure, et gestion des régimes TT, TN ou IT.',
        note: 'Sécurité des personnes : Tension limite conventionnelle UL ≤ 50 V'
      },
      processEn: {
        title: 'Main Switchboard & Earthing Scheme (SLT) Control',
        desc: 'Protected routing via LV switchboards, local power factor compensation, UPS systems, and implementation of TT, TN, or IT earthing schemes.',
        note: 'Personnel safety: Statutory touch voltage threshold UL ≤ 50 V'
      },
      outputsFr: {
        title: 'Circuits Terminaux Force Motrice & Tertiaire',
        desc: 'Alimentation des moteurs de procédés, éclairage LED, prises de courant et serveurs sensibles avec sélectivité totale des protections.',
        earthing: 'Prise de terre réglementaire interconnectée (R ≤ 10 Ω)'
      },
      outputsEn: {
        title: 'Terminal Power, Motor & Auxiliary Circuits',
        desc: 'Supplying industrial process drives, lighting, server rooms, and socket outlets with certified protective discrimination.',
        earthing: 'Statutory earth electrode resistance (R ≤ 10 Ω)'
      }
    },
    sectionB: {
      summaryFr: 'Comparatif direct des 3 Schémas de Liaison à la Terre (SLT) selon NF C 15-100 et CEI 60364-4-41.',
      summaryEn: 'Comprehensive comparative matrix of the 3 fundamental earthing schemes (TT, TN, IT) per IEC 60364-4-41.',
      architectures: [
        {
          nameFr: 'Schéma de Neutre TT (Résidentiel & Petit Tertiaire)',
          nameEn: 'TT Earthing Scheme (Standard Commercial & Residential)',
          techFr: 'Neutre du transformateur relié à la terre, masses des récepteurs reliées à une terre indépendante',
          techEn: 'Transformer neutral grounded, equipment chassis connected to independent earth rod',
          descFr: 'Le premier défaut d\'isolement provoque une coupure automatique obligatoire via Disjoncteur Différentiel Résiduel (DDR).',
          descEn: 'The first insulation fault creates a hazardous touch voltage, tripping the mandatory Residual Current Device (RCD).',
          standard: 'NF C 15-100 / CEI 60364',
          metricFr: 'Condition de sécurité : R_A · I_Δn ≤ 50 V',
          metricEn: 'Safety rule: R_A · I_Δn ≤ 50 V'
        },
        {
          nameFr: 'Schéma de Neutre TN-S (Grand Tertiaire & Industrie)',
          nameEn: 'TN-S Earthing Scheme (Industrial Plants & Data Centers)',
          techFr: 'Neutre à la terre, masses reliées au neutre via un conducteur de protection PE séparé',
          techEn: 'Transformer neutral grounded, equipment frames tied to neutral via dedicated PE conductor',
          descFr: 'Le défaut d\'isolement franc se transforme en court-circuit phase-PE. Coupure instantanée par déclencheur magnétique du disjoncteur.',
          descEn: 'An insulation fault becomes a phase-to-PE short circuit, cleared rapidly by the circuit breaker magnetic trip.',
          standard: 'CEI 60364-4-41',
          metricFr: 'Temps de coupure max : ≤ 0.4 s (230 V)',
          metricEn: 'Maximum disconnection time: ≤ 0.4 s'
        },
        {
          nameFr: 'Schéma de Neutre IT (Hôpitaux, Mines & Process Continus)',
          nameEn: 'IT Earthing Scheme (Hospitals, Mines & Continuous Process)',
          techFr: 'Neutre isolé ou relié à la terre par une impédance élevée (1000 à 2000 Ω), masses à la terre',
          techEn: 'Isolated neutral or high-impedance ground connection, equipment frames grounded',
          descFr: 'Le premier défaut d\'isolement n\'engendre qu\'un très faible courant : aucune coupure ! Alerte immédiate par Contrôleur Permanent d\'Isolement (CPI).',
          descEn: 'The first fault produces minimal current with zero tripping! Signaled immediately by an Insulation Monitoring Device (IMD).',
          standard: 'NF C 15-100 / CEI 60364',
          metricFr: 'Continuité de service : 100% au premier défaut',
          metricEn: 'Service continuity: 100% on 1st fault'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-masterpact-mtz',
        nameFr: 'Disjoncteur Général TGBT Ouvert Débrochable (1 600 A)',
        nameEn: 'Air Circuit Breaker (ACB) Masterpact 1600 A',
        voltage: '400 V • 1 600 A • Icu 65 kA',
        roleFr: 'Protection générale du TGBT, coupure des courants de défaut et mesure d\'énergie intégrée.',
        roleEn: 'Main switchboard protection, fault current clearance, and integrated digital power metering.',
        symbol: 'Q0-TGBT',
        standard: 'CEI 60947-2',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'cable-short-circuit'
      },
      {
        id: 'eq-exp-rcd-diff',
        nameFr: 'Interrupteur Différentiel Haute Sensibilité (30 mA)',
        nameEn: 'Residual Current Device (RCD) 30 mA',
        voltage: '230/400 V • In = 40 A • IΔn = 30 mA',
        roleFr: 'Protection complémentaire contre les chocs électriques et contacts directs/indirects.',
        roleEn: 'Mandatory personnel life-saving protection against direct and indirect touch shocks.',
        symbol: 'DDR',
        standard: 'CEI 61008-1',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        calcTab: 'earthing'
      },
      {
        id: 'eq-exp-cpi-monitor',
        nameFr: 'Contrôleur Permanent d\'Isolement (CPI / IMD)',
        nameEn: 'Insulation Monitoring Device (IMD)',
        voltage: 'Réseau IT 400 V • Injection 2.5 Hz',
        roleFr: 'Surveillance continue de la résistance d\'isolement globale et alarme au premier défaut en schéma IT.',
        roleEn: 'Continuous insulation resistance monitoring with immediate first-fault notification in IT systems.',
        symbol: 'CPI',
        standard: 'CEI 61557-8',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'eq-exp-tgbt-cubicle',
        nameFr: 'Tableau Général Basse Tension Modulaire (TGBT Forme 4b)',
        nameEn: 'Modular Low-Voltage Main Switchboard (Form 4b)',
        voltage: '400 V • IP54 • Forme 4b',
        roleFr: 'Séparation physique totale des jeux de barres, unités fonctionnelles et bornes de raccordement.',
        roleEn: 'Total physical segregation between busbars, functional units, and external cable terminations.',
        symbol: 'TGBT',
        standard: 'CEI 61439-1/2',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'busbar-electrodynamic'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Bilan de Puissance & Choix du SLT',
        titleEn: 'Power Schedule & Earthing Scheme Selection',
        descFr: 'Recensement exhaustif des récepteurs, application des coefficients ku/ks et sélection du régime de neutre adapté.',
        descEn: 'Comprehensive load audit, utilization factors assignment, and optimal earthing system selection.'
      },
      {
        phase: '02',
        titleFr: 'Dimensionnement des Câbles & Chute de Tension',
        titleEn: 'Cable Sizing & Voltage Drop Check',
        descFr: 'Détermination de la section normalisée garantissant le courant admissible Iz et ΔU ≤ 3% (éclairage) ou 5% (force motrice).',
        descEn: 'Cross-section determination meeting Iz ampacity and statutory voltage drop ΔU thresholds.'
      },
      {
        phase: '03',
        titleFr: 'Coordination & Sélectivité des Protections',
        titleEn: 'Protection Coordination & Discrimination',
        descFr: 'Vérification de la sélectivité ampèremétrique et chronométrique pour n\'isoler que le circuit défaillant.',
        descEn: 'Current and time-graded discrimination ensuring only the faulty downstream circuit trips.'
      },
      {
        phase: '04',
        titleFr: 'Pose, Serrage au Couple & Mesure de Terre',
        titleEn: 'Installation, Torque Check & Ground Rod Test',
        descFr: 'Contrôle du serrage dynamométrique des connexions, mesure de résistance de la prise de terre (R ≤ 10 Ω).',
        descEn: 'Torque-wrench terminal verification and ground resistance measurement with earth clamp.'
      },
      {
        phase: '05',
        titleFr: 'Contrôle de Conformité & Réception Finale',
        titleEn: 'Compliance Testing & Official Commissioning',
        descFr: 'Essais de déclenchement des différentiels (temps et courant), mesure d\'isolement sous 500 Vcc et PV Consuel.',
        descEn: 'RCD trip timing/current verification, 500 Vdc insulation resistance testing, and safety sign-off.'
      }
    ],
    sectionE: [
      {
        id: 'tt_safety_calc',
        tabLabelFr: 'Condition de Sécurité en Schéma TT',
        tabLabelEn: 'TT Safety Touch Voltage Rule',
        titleFr: 'Tension de Contact Présumée & Sensibilité Différentielle (NF C 15-100)',
        titleEn: 'Touch Voltage Threshold & RCD Sensitivity in TT System',
        descFr: 'Garantit que lors d\'un défaut d\'isolement, la carcasse métallique ne peut être portée à un potentiel dangereux pour l\'homme.',
        descEn: 'Guarantees that on an insulation fault, equipment frames will not exceed conventional safety voltage limits.',
        formula: 'R_A · I_Δn ≤ U_L',
        formulaDescFr: 'Avec RA résistance de la prise de terre des masses réceptrices (Ω), IΔn sensibilité différentielle du DDR (A), et UL tension limite (50 V en local sec, 25 V en local mouillé).',
        formulaDescEn: 'With RA earth electrode resistance (Ω), IΔn RCD sensitivity (A), and UL limit (50 V dry premises, 25 V wet environments).',
        assumptionsFr: [
          'Tension limite conventionnelle de sécurité UL = 50 V (locaux secs standards).',
          'Tension de contact maximale en local humide UL = 25 V.',
          'Pour une prise de terre de 100 Ω, le calibre maximal du DDR principal est : IΔn ≤ 50 / 100 = 500 mA.'
        ],
        assumptionsEn: [
          'Conventional safe touch voltage UL = 50 V for dry locations.',
          'Stricter touch limit UL = 25 V in damp/wet premises.',
          'For a 100 Ω ground rod, maximum allowable upstream RCD rating is 500 mA.'
        ],
        calcTab: 'earthing'
      },
      {
        id: 'cable_voltage_drop_lv',
        tabLabelFr: 'Chute de Tension ΔU (NF C 15-105)',
        tabLabelEn: 'Voltage Drop Sag Calculation',
        titleFr: 'Calcul de la Chute de Tension Triphasée et Monophasée',
        titleEn: 'Three-Phase & Single-Phase Voltage Drop Calculation',
        descFr: 'Vérifie que la chute de tension relative entre l\'origine de l\'installation et l\'appareil terminal respecte les seuils normatifs.',
        descEn: 'Verifies that total relative voltage sag from installation source to load does not exceed statutory limits.',
        formula: 'ΔU = b · ( (ρ · L / S) · cos φ + λ · L · sin φ ) · I_b',
        formulaDescFr: 'Avec b = 1 en triphasé équilibré (b = 2 en monophasé), ρ = 0.023 Ω·mm²/m pour le cuivre, L longueur en m, S section en mm², et λ = 0.08 mΩ/m.',
        formulaDescEn: 'With b = 1 for 3-phase (b = 2 for single-phase), ρ = 0.023 for copper, L length in meters, S section in mm², and λ = 0.08 mΩ/m.',
        assumptionsFr: [
          'Chute de tension maximale admise : 3% pour l\'éclairage, 5% pour les autres usages (force motrice).',
          'Résistivité calculée à pleine charge thermique (80°C pour PVC, 100°C pour PR/XLPE).',
          'Facteur de puissance de charge par défaut : cos φ = 0.80 si non spécifié.'
        ],
        assumptionsEn: [
          'Maximum permitted voltage drop: 3% for lighting circuits, 5% for motor drives.',
          'Conductor resistivity computed at full thermal load operating temperature.',
          'Default load power factor: cos φ = 0.80 when unspecified.'
        ],
        calcTab: 'voltage-drop'
      }
    ],
    sectionF: [
      {
        code: 'NF C 15-100',
        tag: 'BASSE TENSION',
        titleFr: 'Installations Électriques à Basse Tension - Règles de Conception & Réalisation',
        titleEn: 'Low Voltage Electrical Installations - Design & Erection Rules',
        descFr: 'Norme obligatoire pour les installations domestiques, tertiaires et industrielles en milieu francophone.',
        descEn: 'Statutory standard governing low-voltage electrical design and verification in Francophone jurisdictions.'
      },
      {
        code: 'CEI 60364-4-41',
        tag: 'SÉCURITÉ DES PERSONNES',
        titleFr: 'Protection pour Assurer la Sécurité - Protection contre les Chocs Électriques',
        titleEn: 'Protection for Safety - Protection Against Electric Shock',
        descFr: 'Règles internationales définissant la coupure automatique de l\'alimentation et les temps limites de déclenchement.',
        descEn: 'International standard defining automatic disconnection of supply and disconnection time thresholds.'
      }
    ]
  },

  // D11: Protections, Mesures & Études de Réseau
  D11: {
    domainCode: 'D11',
    sectionA: {
      roleFr: "Détection ultra-rapide des défauts (courts-circuits, surcharges, rupture d'isolement) et déclenchement sélectif pour isoler la zone défaillante en préservant le reste du réseau.",
      roleEn: 'Ultra-fast electrical fault detection and selective tripping to clear disturbances while maintaining systemwide grid stability.',
      inputsFr: {
        title: 'Réducteurs de Mesure TC & TT',
        desc: 'Signaux analogiques secondaires 1 A / 5 A (Transformateurs de Courant) et 100 V / 110 V (Transformateurs de Tension).',
        voltage: 'Secondaires normalisés 1A/5A et 100V'
      },
      inputsEn: {
        title: 'CT & VT Instrument Transformers',
        desc: 'Standardized secondary analog signals 1 A / 5 A (Current Transformers) and 100 V / 110 V (Voltage Transformers).',
        voltage: 'Standardized 1A/5A & 100V secondaries'
      },
      processFr: {
        title: 'Algorithmes Numériques ANSI (50/51/87/21)',
        desc: 'Filtrage numérique de Fourier (DFT), calcul des composantes symétriques (directe, inverse, homopolaire) et discrimination différentielle.',
        note: 'Temps d\'élimination total de défaut : ≤ 80 ms (relais + disjoncteur)'
      },
      processEn: {
        title: 'Numerical ANSI Protection Algorithms (50/51/87/21)',
        desc: 'Discrete Fourier Transform (DFT) filtering, symmetrical component decomposition, and high-speed differential zone discrimination.',
        note: 'Total fault clearance duration: ≤ 80 ms (relay calculation + breaker mechanical trip)'
      },
      outputsFr: {
        title: 'Ordre de Déclenchement & Télé-action',
        desc: 'Contact statique vers bobine à émission du disjoncteur, émission de trames GOOSE CEI 61850 et enregistrement oscilloperturbographique.',
        earthing: 'Protection homopolaire 51N/50N calée selon le régime de neutre'
      },
      outputsEn: {
        title: 'Trip Output & Teleprotection Signals',
        desc: 'High-speed solid-state trip contact to breaker shunt coil, IEC 61850 GOOSE messaging, and COMTRADE transient disturbance recording.',
        earthing: 'Residual earth fault 51N/50N coordinated with grid neutral earthing'
      }
    },
    sectionB: {
      summaryFr: 'Plans de protection en zones sélectives : protection différentielle unitaire vs protection à maximum de courant échelonnée.',
      summaryEn: 'Unit differential protection zones vs time-graded directional overcurrent protection schemes.',
      architectures: [
        {
          nameFr: 'Protection Différentielle Unitaire 87 (Transformateur / Ligne)',
          nameEn: 'Unit Differential Protection 87 (Transformer / Line)',
          techFr: 'Comparaison vectorielle directe du courant entrant et sortant de la zone protégée',
          techEn: 'Direct vectorial comparison of incoming vs outgoing zone currents',
          descFr: 'Instantanée et strictement sélective : ne déclenche que pour les défauts situés à l\'intérieur de sa zone délimitée par les TC.',
          descEn: 'Instantaneous and strictly selective: operates solely on internal faults within current transformer boundaries.',
          standard: 'CEI 60255-187',
          metricFr: 'Temps d\'action : 15 à 25 ms',
          metricEn: 'Operating time: 15 to 25 ms'
        },
        {
          nameFr: 'Protection à Maximum de Courant Échelonnée 50/51 (Réseaux HTA)',
          nameEn: 'Time-Graded Overcurrent Scheme 50/51 (Radial MV Feeders)',
          techFr: 'Échelonnement chronométrique avec intervalle de sélectivité Δt = 300 ms entre étages',
          techEn: 'Chronometric time discrimination with safety margin grading step Δt = 300 ms',
          descFr: 'Le relais le plus proche du défaut déclenche en premier. Les relais amont servent de secours temporisé.',
          descEn: 'The downstream relay closest to fault clears first; upstream relays act as time-delayed backup.',
          standard: 'CEI 60255-151',
          metricFr: 'Marge de sélectivité : Δt = 0.3 s',
          metricEn: 'Discrimination step: Δt = 0.3 s'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-siprotec-5',
        nameFr: 'Relais Numérique Multifonction (SIPROTEC 5 / MiCOM P643)',
        nameEn: 'Multifunctional Numerical Protection Relay (SIPROTEC 5)',
        voltage: 'Alimentation 110 Vcc • Entrées 1A/5A',
        roleFr: 'Acquisition des grandeurs électriques, exécution des fonctions ANSI 50/51/87 et commande directe du disjoncteur.',
        roleEn: 'Analog current/voltage acquisition, ANSI 50/51/87 execution, and high-speed breaker trip issuance.',
        symbol: 'F-87T',
        standard: 'CEI 60255-1',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        calcTab: 'relay-tcc'
      },
      {
        id: 'eq-exp-ct-5p20',
        nameFr: 'Transformateur de Courant Classe Protection 5P20',
        nameEn: 'Protection Current Transformer Class 5P20',
        voltage: 'Primaire 600 A • Secondaire 1 A • 30 VA',
        roleFr: 'Mesure fidèle des courants de court-circuit jusqu\'à 20 fois le nominal sans saturation du circuit magnétique.',
        roleEn: 'Faithful measurement of fault currents up to 20x nominal without magnetic core saturation.',
        symbol: 'TC-PROT',
        standard: 'CEI 61869-2',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'ct-sizing'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Calcul des Courants de Court-Circuit Max & Min',
        titleEn: 'Max & Min Fault Current Computation',
        descFr: 'Détermination de Ik"max (dimensionnement disjoncteur) et Ik"min (sensibilité de déclenchement en bout de ligne).',
        descEn: 'Calculating Ik"max for breaker breaking capacity and Ik"min for remote end fault trip sensitivity.'
      },
      {
        phase: '02',
        titleFr: 'Vérification de Non-Saturation des TC',
        titleEn: 'CT Saturation & Knee-Point Check',
        descFr: 'Calcul de la tension de coude Vk et de la constante de temps apériodique L/R du réseau.',
        descEn: 'Knee-point voltage Vk verification considering system primary time constant L/R.'
      },
      {
        phase: '03',
        titleFr: 'Établissement du Carnet de Réglages des Relais',
        titleEn: 'Relay Setting Schedule Preparation',
        descFr: 'Définition des seuils Is, des temporisations t et des courbes à temps inverse CEI (Normalement / Très Inverse).',
        descEn: 'Configuring pickup currents Is, delay timers, and standard IEC inverse curves.'
      },
      {
        phase: '04',
        titleFr: 'Essais par Injection Secondaire (Valise Omicron)',
        titleEn: 'Secondary Injection Testing (Omicron)',
        descFr: 'Simulation de défauts réels par injection de courants triphasés et contrôle des temps de déclenchement.',
        descEn: 'Simulating primary fault scenarios via calibrated 3-phase secondary injection kits.'
      },
      {
        phase: '05',
        titleFr: 'Analyse des Enregistrements COMTRADE Post-Défaut',
        titleEn: 'COMTRADE Disturbance Post-Mortem',
        descFr: 'Dépouillement des oscilloperturbographies pour valider la bonne séquence des automatismes.',
        descEn: 'Transient waveform analysis confirming correct breaker clearance sequence.'
      }
    ],
    sectionE: [
      {
        id: 'idmt_iec_formula',
        tabLabelFr: 'Courbe à Temps Inverse CEI (ANSI 51)',
        tabLabelEn: 'IEC Inverse Time Overcurrent (ANSI 51)',
        titleFr: 'Équation Universelle des Relais à Temps Dépendant selon CEI 60255-151',
        titleEn: 'Universal Inverse Definite Minimum Time Equation per IEC 60255-151',
        descFr: 'Plus le courant de défaut est intense, plus le relais déclenche rapidement, assurant une sélectivité naturelle avec l\'amont.',
        descEn: 'Tripping delay shortens automatically as fault magnitude rises, creating natural discrimination.',
        formula: 't = TMS · [ k / ((I / I_s)^α - 1) ]',
        formulaDescFr: 'Pour courbe Normalement Inverse CEI : k = 0.14, α = 0.02. Avec TMS le facteur de réglage temporel et Is le seuil de courant.',
        formulaDescEn: 'For IEC Standard Inverse curve: k = 0.14, α = 0.02. With TMS time multiplier setting and Is pickup current.',
        assumptionsFr: [
          'Le courant I doit être supérieur au seuil de démarrage (I > 1.10 · Is).',
          'TMS (Time Multiplier Setting) compris entre 0.05 et 1.20.',
          'Prise en compte du temps de retombée du relais (Reset time) lors de réenclenchements rapides.'
        ],
        assumptionsEn: [
          'Fault current must exceed pickup threshold (I > 1.10 · Is).',
          'TMS factor calibrated between 0.05 and 1.20.',
          'Relay reset dynamics taken into account during auto-reclose cycles.'
        ],
        calcTab: 'relay-tcc'
      },
      {
        id: 'ct_kneepoint_formula',
        tabLabelFr: 'Tension de Coude du TC (Classe 5P20)',
        tabLabelEn: 'CT Knee-Point Voltage Formula',
        titleFr: 'Dimensionnement de la Tension de Saturation du Transformateur de Courant',
        titleEn: 'Current Transformer Saturation Knee-Point Sizing',
        descFr: 'Garantit que le TC ne saturera pas lors du premier cycle de court-circuit asymétrique.',
        descEn: 'Guarantees that the CT core will not saturate during initial asymmetrical subtransient fault peaks.',
        formula: 'V_k ≥ K_td · (I_cc_max / I_1n) · (R_ct + R_w + R_b)',
        formulaDescFr: 'Avec Ktd facteur de surdimensionnement transitoire, Rct résistance interne de l\'enroulement secondaire, Rw résistance de filerie, et Rb fardeau du relais.',
        formulaDescEn: 'With Ktd transient dimensioning factor, Rct secondary winding resistance, Rw lead resistance, and Rb connected relay burden.',
        assumptionsFr: [
          'Régime asymétrique maximal avec composante continue apériodique (DC offset 100%).',
          'Constante de temps primaire L/R du réseau haute tension (typique 40 à 100 ms).',
          'Résistance de boucle de câblage Rw calculée à température maximale (75°C).'
        ],
        assumptionsEn: [
          'Worst-case 100% DC offset subtransient current peak.',
          'System primary time constant L/R (typically 40 to 100 ms).',
          'Wiring loop resistance Rw calculated at maximum operating temperature (75°C).'
        ],
        calcTab: 'ct-sizing'
      }
    ],
    sectionF: [
      {
        code: 'CEI 60255-151',
        tag: 'RELAIS NUMÉRIQUES',
        titleFr: 'Relais de Mesure & Dispositifs de Protection - Exigences Fonctionnelles pour Protections à Maximum de Courant',
        titleEn: 'Measuring Relays and Protection Equipment - Over/Under Current Protection',
        descFr: 'Définit les courbes caractéristiques temps-courant normalisées et les précisions métrologiques.',
        descEn: 'Specifies standardized time-current inverse curve characteristics and relay measurement tolerances.'
      },
      {
        code: 'CEI 61869-2',
        tag: 'TRANSFORMATEURS DE COURANT',
        titleFr: 'Transformateurs de Mesure - Exigences Spécifiques pour Transformateurs de Courant',
        titleEn: 'Instrument Transformers - Specific Requirements for Current Transformers',
        descFr: 'Règles de dimensionnement des classes de précision mesure (0.2S, 0.5) et protection (5P20, TPX).',
        descEn: 'Sizing criteria for metering accuracy classes (0.2S, 0.5) and protective transient classes (5P20, TPX).'
      }
    ]
  },

  // D12: Téléconduite, SAS & Contrôle-Commande de Poste (et D13 CEI 61850)
  D12: {
    domainCode: 'D12',
    sectionA: {
      roleFr: "Supervision en temps réel des réseaux, télémesures analogiques, télécommandes d'appareillage et communication inter-équipements par protocole CEI 61850.",
      roleEn: 'Real-time grid supervision, analog telemetering, remote equipment control, and substation interoperability via IEC 61850 protocols.',
      inputsFr: {
        title: 'Signaux d\'Organes & Télémesures',
        desc: 'Contacts de fin de course (position disjoncteur/sectionneur), grandeurs analogiques P, Q, U, I, f, et niveaux d\'huile/pression SF6.',
        voltage: 'Signaux numériques optiques & 48 Vcc'
      },
      inputsEn: {
        title: 'Switchgear Status & Analog Telemetry',
        desc: 'Breaker/disconnector auxiliary contacts, analog P, Q, U, I, f transducers, and transformer oil/SF6 gas alarms.',
        voltage: 'Optical digital links & 48/110 Vdc'
      },
      processFr: {
        title: 'Réseau Ethernet Industriel & Trame GOOSE / MMS',
        desc: 'Échange ultra-rapide pair-à-pair entre calculateurs de tranche (IEDs) par trames Ethernet GOOSE (≤ 3 ms) et remontée client/serveur MMS.',
        note: 'Disponibilité maximale : Redondance sans coupure PRP (CEI 62439-3)'
      },
      processEn: {
        title: 'Industrial Ethernet Bus & GOOSE / MMS Messaging',
        desc: 'Sub-3ms peer-to-peer multicast GOOSE communications between IEDs and client/server MMS SCADA data acquisition.',
        note: 'Zero failover downtime: PRP Parallel Redundancy Protocol (IEC 62439-3)'
      },
      outputsFr: {
        title: 'IHM de Conduite & Télétransmission Dispatching',
        desc: 'Synoptiques dynamiques sur écrans de contrôle de poste et télétransmission vers le Dispatching National via CEI 60870-5-104.',
        earthing: 'Réseaux de terre télécom équipotentiels indépendants des courants de foudre'
      },
      outputsEn: {
        title: 'Substation HMI & Remote Dispatch Links',
        desc: 'Dynamic one-line mimics on local operator screens and uplink to National Dispatch center via IEC 60870-5-104.',
        earthing: 'Equipotential communication earth mesh shielded from lightning ground surge'
      }
    },
    sectionB: {
      summaryFr: 'Architecture normalisée CEI 61850 à 3 niveaux : Niveaux Procédé (Process Bus), Tranche (Bay Level) et Poste (Station Level).',
      summaryEn: 'Standardized 3-tier IEC 61850 architecture: Process Bus, Bay Level, and Station Level.',
      architectures: [
        {
          nameFr: 'Bus de Poste & Tranche (Station Bus - MMS & GOOSE)',
          nameEn: 'Station Bus Architecture (MMS & GOOSE)',
          techFr: 'Anneau optique Ethernet 1 Gbit/s reliant l\'ensemble des relais IED au superviseur local',
          techEn: '1 Gbps fiber Ethernet ring interconnecting all protection IEDs to local SCADA servers',
          descFr: 'Permet les verrouillages logiques instantanés entre cellules (interlocking) sans câblage filaire point à point.',
          descEn: 'Enables high-speed logic interlocking between bays without hardwired inter-panel copper cables.',
          standard: 'CEI 61850-8-1',
          metricFr: 'Vitesse de verrouillage : < 4 ms',
          metricEn: 'Interlock response: < 4 ms'
        },
        {
          nameFr: 'Bus de Processus Numérique (Process Bus - Sampled Values)',
          nameEn: 'Full Digital Process Bus (Sampled Values SV)',
          techFr: 'Numérisation au pied des réducteurs de mesure par unités Merging Units (MU)',
          techEn: 'Primary current/voltage digitization right at instrument transformer foot via Merging Units (MU)',
          descFr: 'Élimine tout câble de mesure en cuivre dans le poste : transmission par fibre optique d\'échantillons normalisés 4 kHz.',
          descEn: 'Completely eliminates copper analog wiring: transmits calibrated 4 kHz digital samples over fiber optics.',
          standard: 'CEI 61850-9-2 LE',
          metricFr: 'Échantillonnage : 80 éch/période (4000 Hz)',
          metricEn: 'Sampling rate: 80 samples/cycle (4000 Hz)'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-rugged-switch',
        nameFr: 'Commutateur Ethernet Industriel Robuste (Ruggedcom / Cisco IE)',
        nameEn: 'Hardened Substation Ethernet Switch (Ruggedcom)',
        voltage: 'Alimentation redondante 110/220 Vcc • Portée optique LC',
        roleFr: 'Commutation durcie sans perte de paquets, immunité électromagnétique extrême CEI 61850-3.',
        roleEn: 'Zero-packet-loss hardened switching, IEEE 1613 and IEC 61850-3 severe electromagnetic immunity.',
        symbol: 'SW-ETH',
        standard: 'CEI 61850-3',
        imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'eq-exp-ptp-clock',
        nameFr: 'Horloge Maître GPS / PTP IEEE 1588 (Grandmaster Clock)',
        nameEn: 'Precision Time Protocol (PTP) Grandmaster Clock',
        voltage: '230 Vca / 110 Vcc • Synchronisation GNSS/GPS',
        roleFr: 'Fourniture d\'une référence temporelle ultra-précise sub-microseconde pour l\'échantillonnage synchrone.',
        roleEn: 'Sub-microsecond time reference distribution across the process bus for synchronous sampling.',
        symbol: 'CLK-PTP',
        standard: 'IEEE 1588 / CEI 61850-9-3',
        imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Table d\'Échange d\'Informations (TEI)',
        titleEn: 'Signal & Information Exchange Matrix',
        descFr: 'Inventaire de chaque état, alarme, mesure et télécommande à intégrer dans le système SCADA.',
        descEn: 'Comprehensive cataloging of all discrete inputs, analog telemetry, and control points.'
      },
      {
        phase: '02',
        titleFr: 'Ingénierie des Fichiers SCL (SCD, ICD, CID)',
        titleEn: 'Substation Configuration Language (SCL) Design',
        descFr: 'Configuration normalisée en XML des capacités de chaque équipement et des flux de données GOOSE.',
        descEn: 'Standard XML configuration of device communication capabilities and dataset linkages.'
      },
      {
        phase: '03',
        titleFr: 'Conception du Réseau Ethernet & VLANs',
        titleEn: 'Network Topology & VLAN Segregation',
        descFr: 'Paramétrage des priorités de trames IEEE 802.1Q pour garantir le passage prioritaire des ordres de déclenchement.',
        descEn: 'Setting IEEE 802.1Q priority tagging ensuring critical trip packets bypass non-urgent traffic.'
      },
      {
        phase: '04',
        titleFr: 'Essais de Communication FAT (Simulation Wireshark)',
        titleEn: 'Factory Acceptance Testing & Packet Inspection',
        descFr: 'Contrôle des trames réseau sous tempête de trafic pour vérifier l\'absence de perte de paquets GOOSE.',
        descEn: 'Network stress testing under burst storm conditions validating zero frame drops.'
      },
      {
        phase: '05',
        titleFr: 'Point-to-Point SAT & Validation Dispatching',
        titleEn: 'Site Point-to-Point End-to-End Validation',
        descFr: 'Manœuvre réelle de chaque organe et vérification de la remontée sur le synoptique du dispatching national.',
        descEn: 'Live physical operation of every switch verifying telemetry confirmation at national EMS.'
      }
    ],
    sectionE: [
      {
        id: 'goose_latency_calc',
        tabLabelFr: 'Temps de Transit de Trame GOOSE',
        tabLabelEn: 'GOOSE Message Latency Budget',
        titleFr: 'Budget de Temps de Transmission des Ordres Rapides selon CEI 61850-5',
        titleEn: 'Fast Tripping Transmission Time Budget per IEC 61850-5',
        descFr: 'Spécifie le temps maximal admissible entre l\'instant où un IED décide un déclenchement et sa réception par l\'autre appareil.',
        descEn: 'Defines statutory maximum allowable latency between internal trip command and peer reception.',
        formula: 'T_transit = t_encapsulation + t_switch + t_propagation ≤ 3 ms',
        formulaDescFr: 'La norme classe IA impose un temps total inférieur à 3 millisecondes pour égaler ou surpasser les liaisons filaires cuivre.',
        formulaDescEn: 'IEC Class IA mandates total elapsed time below 3 ms to outperform direct copper hardwiring.',
        assumptionsFr: [
          'Trames GOOSE transmises directement sur la couche 2 Ethernet (sans pile TCP/IP).',
          'Priorité maximale IEEE 802.1p (Priority tag = 6 ou 7).',
          'Commutateurs Ethernet industriels de temps de traversée inférieur à 10 microsecondes par switch.'
        ],
        assumptionsEn: [
          'GOOSE packets mapped directly onto Ethernet Layer 2 (bypassing TCP/IP overhead).',
          'Highest IEEE 802.1p priority tagging (Class 6 or 7).',
          'Substation switches featuring cut-through latency below 10 microseconds per hop.'
        ]
      }
    ],
    sectionF: [
      {
        code: 'CEI 61850-7-2',
        tag: 'AUTOMATISATION DE POSTE',
        titleFr: 'Réseaux & Systèmes de Communication pour l\'Automatisation des Postes - ACSI',
        titleEn: 'Communication Networks and Systems for Power Utility Automation - Abstract Communication Service Interface',
        descFr: 'Définit les services de communication abstraits (MMS, GOOSE, SV) et modèles de données d\'organes.',
        descEn: 'Specifies abstract communication services (MMS, GOOSE, SV) and standardized logical device models.'
      },
      {
        code: 'CEI 62439-3',
        tag: 'RÉSEAU HAUTE DISPONIBILITÉ',
        titleFr: 'Réseaux de Communication Industriels - Protocoles de Redondance Haute Disponibilité (PRP & HSR)',
        titleEn: 'Industrial Communication Networks - High Availability Redundancy Protocols (PRP & HSR)',
        descFr: 'Standard universel pour la transmission de données simultanée sur deux réseaux indépendants sans temps de basculement.',
        descEn: 'Universal standard for zero-switchover packet duplication across dual independent network infrastructures.'
      }
    ]
  },

  // D10: Stockage d'Énergie BESS & Recharge IRVE
  D10: {
    domainCode: 'D10',
    sectionA: {
      roleFr: "Stockage stationnaire d'énergie par batteries (BESS), intégration des énergies renouvelables intermittentes, soutien dynamique tension/fréquence et recharge haute puissance des véhicules électriques (IRVE).",
      roleEn: 'Utility-scale battery energy storage (BESS), high-penetration renewable integration, dynamic Volt/Var grid support, and high-power EV charging infrastructure.',
      inputsFr: {
        title: 'Production EnR Intermittente & Réseau HTA',
        desc: 'Centrales solaires photovoltaïques, parcs éoliens, excédents de production heures creuses et postes HTA.',
        voltage: 'Onduleurs réversibles 400 V / 800 Vcc / 30 kV'
      },
      inputsEn: {
        title: 'Intermittent Renewable Generation & MV Grid',
        desc: 'Solar PV plants, wind farms, off-peak grid energy surplus, and MV distribution substations.',
        voltage: 'Bidirectional PCS 400 V / 800 Vdc / 30 kV'
      },
      processFr: {
        title: 'Conteneurs Batteries LiFePO4, BMS & Onduleurs Grid-Forming',
        desc: 'Régulation de fréquence (P-f) et de tension (Q-V) par convertisseurs PCS formateurs de réseau (Grid-Forming) et surveillance thermique cellulaire BMS.',
        note: 'Stabilité insulaire : Réserve primaire instantanée (< 20 ms) fournie par BESS'
      },
      processEn: {
        title: 'LiFePO4 Battery Containers, BMS & Grid-Forming PCS',
        desc: 'Active power-frequency (P-f) and reactive power-voltage (Q-V) droop regulation via grid-forming inverters and cell-level BMS protection.',
        note: 'Islanded stability: Synthetic inertia and fast frequency response (< 20 ms) delivered by BESS'
      },
      outputsFr: {
        title: 'Écrêtement de Pointe, Îlotage & Superchargeurs IRVE',
        desc: 'Restitution lors de la pointe du soir, alimentation continue en micro-réseau îloté et bornes de recharge rapide DC (150–350 kW).',
        earthing: 'Surveillance permanente d\'isolement DC (CPI) et mise à la terre des conteneurs'
      },
      outputsEn: {
        title: 'Peak Shaving, Seamless Islanding & DC Fast Chargers',
        desc: 'Evening peak power dispatch, seamless microgrid islanding, and ultra-fast DC EV charging stations (150–350 kW).',
        earthing: 'Continuous DC insulation monitoring (IMD) and container equipotential bonding'
      }
    },
    sectionB: {
      summaryFr: 'Architectures de stockage stationnaire BESS et micro-réseaux hybrides : soutien réseau vs îlotage autonome.',
      summaryEn: 'Stationary BESS storage and hybrid microgrid layouts: grid-tied support vs autonomous islanded operation.',
      architectures: [
        {
          nameFr: 'Micro-Réseau Hybride Solaire + Stockage BESS + Diesel',
          nameEn: 'Hybrid Solar PV + BESS Storage + Diesel Microgrid',
          techFr: 'Architecture AC couplée au niveau HTA avec contrôleur centralisé EMS',
          techEn: 'AC-coupled MV architecture coordinated by central microgrid energy controller',
          descFr: 'Permet d\'éteindre complètement les groupes électrogènes diesel durant les heures ensoleillées (taux de pénétration solaire > 80%).',
          descEn: 'Enables complete shutdown of fossil generators during daylight hours (solar penetration > 80%).',
          standard: 'CEI 62898-1/2',
          metricFr: 'Économie de carburant : jusqu\'à 60%',
          metricEn: 'Fuel savings: up to 60%'
        },
        {
          nameFr: 'Système BESS avec Convertisseur Grid-Forming (PCS)',
          nameEn: 'BESS with Grid-Forming Power Conversion System (PCS)',
          techFr: 'Onduleurs de batterie agissant comme sources de tension parfaites avec inertie synthétique',
          techEn: 'Battery energy storage inverters operating as true voltage sources delivering synthetic inertia',
          descFr: 'Maintient la fréquence et la tension du réseau sans nécessiter la présence d\'alternateurs synchrones thermiques.',
          descEn: 'Stabilizes grid frequency and voltage autonomously without requiring conventional spinning generators.',
          standard: 'IEEE 1547 / CEI 62933',
          metricFr: 'Temps de réponse inertielle : < 20 ms',
          metricEn: 'Inertial response: < 20 ms'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-grid-forming-inv',
        nameFr: 'Onduleur Réversible Grid-Forming (500 kVA)',
        nameEn: 'Grid-Forming Bidirectional Inverter (500 kVA)',
        voltage: '400 Vca / 800 Vcc • 50 Hz',
        roleFr: 'Création autonome du vecteur tension-fréquence et compensation instantanée des creux de tension.',
        roleEn: 'Autonomous voltage-frequency reference creation and instantaneous reactive grid support.',
        symbol: 'INV-GF',
        standard: 'IEEE 1547-2018',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        calcTab: 'solar-sizing'
      },
      {
        id: 'eq-exp-bess-container',
        nameFr: 'Système de Stockage d\'Énergie BESS Conteneurisé (1 MWh LFP)',
        nameEn: 'Containerized Battery Energy Storage System (1 MWh LFP)',
        voltage: '1 000 Vcc • Chimie LiFePO4 • Climatisation HVAC',
        roleFr: 'Stockage de l\'excédent solaire diurne et restitution lors de la pointe du soir.',
        roleEn: 'Capturing midday solar surplus and dispatching energy during evening peak consumption.',
        symbol: 'BESS',
        standard: 'CEI 62933-2-1',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'solar-sizing'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Étude de Gisement Solaire & Profil de Consommation',
        titleEn: 'Solar Resource & Hourly Load Profiling',
        descFr: 'Mesure de l\'irradiation globale horizontale (GHI) et enregistrement de la courbe de charge quart-horaire.',
        descEn: 'Global Horizontal Irradiance (GHI) assessment and 15-minute resolution load logging.'
      },
      {
        phase: '02',
        titleFr: 'Dimensionnement Techno-Économique PV / BESS',
        titleEn: 'Techno-Economic Sizing Optimization',
        descFr: 'Calcul de la puissance PV crête et de la capacité batterie pour minimiser le coût nivelé de l\'électricité (LCOE).',
        descEn: 'Determining optimal PV peak capacity and battery kWh rating to minimize Levelized Cost of Energy.'
      },
      {
        phase: '03',
        titleFr: 'Étude de Stabilité Dynamique en Mode Îloté',
        titleEn: 'Islanded Transient Stability Analysis',
        descFr: 'Vérification du gradient de fréquence ROCOF lors du démarrage de gros moteurs en absence de réseau amont.',
        descEn: 'Evaluating Rate of Change of Frequency (ROCOF) under direct motor starting transients.'
      },
      {
        phase: '04',
        titleFr: 'Programmation des Courbes Volt-VAr et Watt-Fréquence',
        titleEn: 'Volt-Var & Frequency-Watt Configuration',
        descFr: 'Paramétrage des fonctions avancées IEEE 1547 dans les firmwares des onduleurs solaires.',
        descEn: 'Fine-tuning autonomous voltage support and overfrequency curtailment curves.'
      },
      {
        phase: '05',
        titleFr: 'Essais de Transition Îlotée / Raccordée Sans Coupure',
        titleEn: 'Seamless Islanding & Reconnection Testing',
        descFr: 'Test d\'ouverture du disjoncteur de couplage réseau et resynchronisation automatique avec la grille.',
        descEn: 'Live opening of point of common coupling breaker and automated zero-interruption resynchronization.'
      }
    ],
    sectionE: [
      {
        id: 'droop_control_eq',
        tabLabelFr: 'Loi de Statisme Fréquence-Puissance (Droop)',
        tabLabelEn: 'Active Power-Frequency Droop Control',
        titleFr: 'Équation de Statisme Proportionnel pour Onduleurs en Parallèle',
        titleEn: 'Proportional Droop Equation for Parallel Inverter Operation',
        descFr: 'Permet le partage autonome de la puissance active entre plusieurs sources sans communication filaire entre elles.',
        descEn: 'Enables autonomous active power sharing across distributed generators without inter-unit communications.',
        formula: 'f - f_0 = -k_p · (P - P_0)',
        formulaDescFr: 'Avec f la fréquence instantanée, f0 la fréquence nominale (50.0 Hz), kp le coefficient de statisme (typique 2% à 4%), et P la puissance active injectée.',
        formulaDescEn: 'With f instantaneous grid frequency, f0 nominal frequency (50 Hz), kp droop slope (typically 2-4%), and P generated active power.',
        assumptionsFr: [
          'Impédance du réseau à dominante inductive (X/R >> 1) au point de raccordement.',
          'Bande morte de fréquence paramétrée (ex: ±0.05 Hz) pour éviter les oscillations permanentes.',
          'Capacité de réserve en puissance active disponible dans la batterie ou marge d\'écrêtement solaire.'
        ],
        assumptionsEn: [
          'Predominantly inductive grid coupling (X/R >> 1) at inverter terminal.',
          'Deadband filtering applied (e.g., ±0.05 Hz) to suppress idle oscillation hunting.',
          'Available active power headroom in BESS or solar curtailment margin.'
        ]
      },
      {
        id: 'bess_sizing_calc',
        tabLabelFr: 'Dimensionnement Capacité Batterie (kWh)',
        tabLabelEn: 'Battery Sizing Equation',
        titleFr: 'Calcul de la Capacité Utile d\'un Système BESS',
        titleEn: 'Usable Battery Storage Capacity Sizing Formula',
        descFr: 'Détermine la capacité nominale en tenant compte de la profondeur de décharge (DoD) et du rendement aller-retour.',
        descEn: 'Computes required battery bank size considering Depth of Discharge (DoD) and round-trip efficiency.',
        formula: 'E_nom = (P_charge · t_autonomie) / (DoD · η_onduleur · η_batterie)',
        formulaDescFr: 'Avec Pcharge puissance moyenne à secourir (kW), t temps d\'autonomie requis (h), DoD profondeur de décharge maximale recommandée (0.80 pour LFP), et η rendements de conversion.',
        formulaDescEn: 'With Pload average backed-up load (kW), t target autonomy duration (h), DoD maximum depth of discharge (0.80 for LFP), and η conversion efficiencies.',
        assumptionsFr: [
          'Chimie Lithium-Fer-Phosphate (LFP) avec DoD maximale recommandée de 80% pour préserver 6000 cycles.',
          'Rendement global de chaîne onduleur + batterie estimé à 88-92%.',
          'Facteur de déclassement en température ambiante tropicale (au-dessus de 35°C).'
        ],
        assumptionsEn: [
          'Lithium Iron Phosphate (LFP) chemistry with 80% recommended DoD to reach 6,000 cycles.',
          'Overall round-trip efficiency rated at 88-92%.',
          'Ambient thermal derating factor applied for tropical operation exceeding 35°C.'
        ],
        calcTab: 'solar-sizing'
      }
    ],
    sectionF: [
      {
        code: 'CEI 62898-1/2',
        tag: 'MICRO-RÉSEAUX',
        titleFr: 'Lignes Directrices pour la Planification & Spécification des Micro-Réseaux',
        titleEn: 'Microgrids - Guidelines for Planning and Technical Specifications',
        descFr: 'Norme cadre définissant l\'architecture, le contrôle de stabilité et la sécurité des micro-réseaux insulaires et connectés.',
        descEn: 'Comprehensive standard defining microgrid architecture, control strategies, and safety requirements.'
      },
      {
        code: 'IEEE 1547-2018',
        tag: 'INTERCONNEXION EnR',
        titleFr: 'Norme d\'Interconnexion & d\'Interopérabilité des Ressources Énergétiques Réparties avec le Réseau Électrique',
        titleEn: 'Standard for Interconnection and Interoperability of Distributed Energy Resources',
        descFr: 'Standard de référence international imposant les fonctions de soutien dynamique de tension et traversée de creux (FRT).',
        descEn: 'Benchmark grid interconnection standard mandating Volt/Var autonomous support and fault ride-through (FRT).'
      }
    ]
  },

  // D15: Gestion d'Actifs, Diagnostic DGA & Comptage Intelligent
  D15: {
    domainCode: 'D15',
    sectionA: {
      roleFr: "Suivi continu de l'état de santé des actifs haute tension, détection précoce des dégradations thermiques/diélectriques par analyse DGA, comptage communicant AMI et maintenance prédictive.",
      roleEn: 'Continuous health monitoring of high-voltage assets, early thermal/dielectric fault diagnosis via DGA, smart metering AMI, and predictive asset management.',
      inputsFr: {
        title: 'Prélèvements d\'Huile & Mesures Physiques',
        desc: 'Échantillons d\'huile diélectrique prélevés selon CEI 60475, thermographies infrarouges, mesures de décharges partielles UHF et résistance d\'isolement.',
        voltage: 'Surveillance transformateurs 225 kV & 30 kV'
      },
      inputsEn: {
        title: 'Dielectric Oil Samples & Physical Sensors',
        desc: 'Hermetic oil sampling per IEC 60475, infrared thermography, UHF partial discharge monitoring, and insulation testing.',
        voltage: '225 kV & 30 kV Power Transformer Monitoring'
      },
      processFr: {
        title: 'Analyse des Gaz Dissous DGA & Ratios de Duval',
        desc: 'Chromatographie en phase gazeuse identifiant les gaz dissous (H2, CH4, C2H2, C2H4, C2H6, CO, CO2) et localisation du défaut par le Triangle de Duval.',
        note: 'Diagnostic normalisé : Séparation stricte des décharges d\'arc vs surchauffes thermiques'
      },
      processEn: {
        title: 'Dissolved Gas Analysis (DGA) & Duval Triangle Diagnosis',
        desc: 'Gas chromatography tracking key fault gases (H2, CH4, C2H2, C2H4, C2H6, CO, CO2) and pinpointing failure modes on the Duval Triangle.',
        note: 'Standardized diagnosis: Strict discrimination between high-energy arcing and localized thermal overheating'
      },
      outputsFr: {
        title: 'Indice de Santé (AHI) & Plan d\'Intervention',
        desc: 'Calcul de l\'Asset Health Index (AHI 0-100), recommandation immédiate (dégazage, filtration, révision en atelier) et prévention d\'explosion de cuve.',
        earthing: 'Mise à la terre de sécurité équipotentielle lors de toute intervention humaine'
      },
      outputsEn: {
        title: 'Asset Health Index (AHI) & Maintenance Plan',
        desc: 'Scoring asset condition (AHI 0-100), corrective action scheduling (degassing, workshop overhaul), and catastrophic tank failure prevention.',
        earthing: 'Mandatory equipotential temporary earthing applied prior to any maintenance entry'
      }
    },
    sectionB: {
      summaryFr: 'Méthodes de diagnostic diélectrique et thermique des transformateurs de puissance selon CEI 60599 et IEEE C57.104.',
      summaryEn: 'Power transformer dielectric and thermal diagnostic frameworks per IEC 60599 and IEEE C57.104.',
      architectures: [
        {
          nameFr: 'Méthode du Triangle de Duval N°1 (CEI 60599)',
          nameEn: 'Duval Triangle 1 Diagnostic Method (IEC 60599)',
          techFr: 'Coordination triangulaire des pourcentages relatifs de CH4, C2H4 et C2H2',
          techEn: 'Triangular coordinate plotting of relative CH4, C2H4, and C2H2 gas percentages',
          descFr: 'Méthode universelle sans zone indéterminée, classant le défaut en Décharge Partielle (PD), Décharge Disruptive (D1/D2) ou Défaut Thermique (T1/T2/T3).',
          descEn: 'Universal method with zero undetermined zones, classifying faults into Partial Discharge (PD), Arcing (D1/D2), or Overheating (T1/T2/T3).',
          standard: 'CEI 60599',
          metricFr: 'Fiabilité de diagnostic : > 95%',
          metricEn: 'Diagnostic reliability: > 95%'
        },
        {
          nameFr: 'Surveillance en Ligne Continue (Online Multigas Monitor)',
          nameEn: 'Continuous Online Multi-Gas Monitoring',
          techFr: 'Sonde à photo-acoustique ou chromatographie intégrée sur la vanne de vidange du transformateur',
          techEn: 'Photoacoustic or micro-gas chromatography sensor mounted directly on transformer drain valve',
          descFr: 'Mesure automatique toutes les 4 heures avec alerte instantanée sur le SCADA en cas de cinétique d\'évolution anormale (Δppm/jour élevé).',
          descEn: 'Automated 4-hour cycle measurement with real-time SCADA alarms on dangerous gas generation rates (Δppm/day).',
          standard: 'CEI 60599 / CIGRE 409',
          metricFr: 'Fréquence de mesure : 4 à 6 fois/jour',
          metricEn: 'Measurement cadence: 4-6 times/day'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-dga-transfix',
        nameFr: 'Moniteur DGA Multigaz en Ligne (Transfix / Calisto 9)',
        nameEn: 'Online Multi-Gas DGA Analyzer (Transfix / Calisto 9)',
        voltage: 'Alimentation 110/230 V • Sortie Ethernet CEI 61850',
        roleFr: 'Mesure en continu des 9 gaz dissous et de l\'humidité dans l\'huile sans intervention humaine.',
        roleEn: 'Continuous automated measurement of 9 fault gases and oil moisture content without manual intervention.',
        symbol: 'DGA-MON',
        standard: 'CEI 60599',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'transformer'
      },
      {
        id: 'eq-exp-buchholz-relay',
        nameFr: 'Relais Buchholz à Deux Seuils (Alarme & Déclenchement)',
        nameEn: 'Two-Stage Buchholz Gas & Oil Surge Relay',
        voltage: 'Contacts secs 110/220 Vcc • Tube de liaison conservateur',
        roleFr: 'Détection mécanique immédiate du dégazage lent (seuil 1 alarme) et des coups de bélier d\'huile lors d\'un arc interne (seuil 2 déclenchement).',
        roleEn: 'Mechanical detection of slow gas accumulation (Stage 1 alarm) and rapid oil surge upon violent internal arc (Stage 2 trip).',
        symbol: 'F-BUCH',
        standard: 'CEI 60076-22-1',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        calcTab: 'transformer'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Prélèvement d\'Huile Normalisé en Seringue Verre',
        titleEn: 'Standardized Oil Sampling via Glass Syringe',
        descFr: 'Prélèvement sous atmosphère étanche selon CEI 60475 sans formation de bulles d\'air parasites.',
        descEn: 'Hermetic syringe sampling per IEC 60475 ensuring zero air contamination.'
      },
      {
        phase: '02',
        titleFr: 'Analyse Chromatographique en Laboratoire Certifié',
        titleEn: 'Laboratory Gas Chromatography Analysis',
        descFr: 'Mesure de la concentration individuelle en ppm de chaque hydrocarbure et calcul du taux de gaz combustible total (TDCG).',
        descEn: 'Individual ppm concentration measurement of hydrocarbons and Total Dissolved Combustible Gas (TDCG).'
      },
      {
        phase: '03',
        titleFr: 'Application du Triangle de Duval & Ratios CEI 60599',
        titleEn: 'Duval Triangle Plotting & Ratio Verification',
        descFr: 'Positionnement du point de coordonnées %CH4, %C2H4, %C2H2 pour déterminer avec certitude la nature du défaut.',
        descEn: 'Plotting coordinate percentages to unmistakably categorize electrical vs thermal fault roots.'
      },
      {
        phase: '04',
        titleFr: 'Calcul de l\'Indice de Santé (AHI) & Estimation de Vie',
        titleEn: 'Asset Health Index (AHI) & Remanent Life Check',
        descFr: 'Corrélation entre DGA, teneur en eau, rigidité diélectrique et dégradation des furanes (DP papier).',
        descEn: 'Correlating DGA, moisture, breakdown voltage, and furan contents for paper degree of polymerization.'
      },
      {
        phase: '05',
        titleFr: 'Traitement d\'Huile ou Décuvage en Atelier',
        titleEn: 'Oil Degassing Treatment or Workshop Overhaul',
        descFr: 'Passage sur groupe mobile de dégazage/déshydratation sous vide ou planification du remplacement de l\'actif.',
        descEn: 'Mobile vacuum dehydration/degassing oil treatment or scheduling asset de-tanking and rewind.'
      }
    ],
    sectionE: [
      {
        id: 'duval_coords_calc',
        tabLabelFr: 'Coordonnées du Triangle de Duval',
        tabLabelEn: 'Duval Triangle Coordinates',
        titleFr: 'Calcul des Pourcentages Relatifs des Gaz selon CEI 60599',
        titleEn: 'Relative Gas Percentage Calculation per IEC 60599',
        descFr: 'Normalise les concentrations en ppm de méthane, éthylène et acétylène pour obtenir des coordonnées sur 100%.',
        descEn: 'Normalizes methane, ethylene, and acetylene ppm concentrations onto a 100% scale.',
        formula: '%C₂H₂ = [C₂H₂] / ([CH₄] + [C₂H₄] + [C₂H₂]) × 100',
        formulaDescFr: 'Calcul identique pour %CH4 et %C2H4. La présence d\'acétylène C2H2 même en faible quantité (> 2 ppm) indique un arc électrique à haute énergie.',
        formulaDescEn: 'Identical normalization for %CH4 and %C2H4. Any trace of acetylene C2H2 (> 2 ppm) alerts to high-energy arcing.',
        assumptionsFr: [
          'La somme des trois gaz hydrocarbures doit être significative (au moins 10 fois le seuil de détection du chromatographe).',
          'Applicable aux transformateurs immergés dans l\'huile minérale standard.',
          'En cas d\'huile végétale ester (naturel ou synthétique), utiliser le Triangle de Duval adapté (Triangle 3).'
        ],
        assumptionsEn: [
          'The sum of the 3 key hydrocarbon gases must exceed 10x chromatograph detection limit.',
          'Applicable to mineral oil filled power transformers.',
          'For natural or synthetic ester liquids, dedicated Duval Triangles (Triangle 3) must be used.'
        ],
        calcTab: 'transformer'
      },
      {
        id: 'transformer_aging_arrhenius',
        tabLabelFr: 'Vieillissement Papier (Arrhenius)',
        tabLabelEn: 'Paper Insulation Aging Rate',
        titleFr: 'Facteur de Vieillissement Thermique Relatif de l\'Isolant Solide (CEI 60076-7)',
        titleEn: 'Relative Thermal Aging Factor of Solid Insulation per IEC 60076-7',
        descFr: 'Quantifie l\'accélération de la dégradation des fibres de cellulose du papier en fonction de la température de point chaud.',
        descEn: 'Quantifies the accelerated degradation rate of paper cellulose fibers versus winding hot-spot temperature.',
        formula: 'V = 2^((θ_h - 98) / 6)',
        formulaDescFr: 'Avec θh température de point chaud en °C. À 98°C, le vieillissement est normal (V = 1.0). Chaque élévation de 6°C double le taux de vieillissement !',
        formulaDescEn: 'With θh winding hot-spot temperature in °C. At 98°C, aging is baseline (V = 1.0). Every 6°C rise doubles degradation rate!',
        assumptionsFr: [
          'Isolant en papier kraft non thermiquement amélioré standard.',
          'Température de point chaud calculée selon le modèle thermique dynamique CEI 60076-7.',
          'Une humidité supérieure à 2% dans le papier multiplie encore le facteur de dégradation par 2 à 4.'
        ],
        assumptionsEn: [
          'Standard non-thermally upgraded Kraft paper insulation.',
          'Winding hot-spot temperature estimated via IEC 60076-7 thermal differential equations.',
          'Moisture content above 2% in solid insulation accelerates the aging factor by another 2x to 4x.'
        ],
        calcTab: 'transformer'
      }
    ],
    sectionF: [
      {
        code: 'CEI 60599',
        tag: 'DIAGNOSTIC DGA',
        titleFr: 'Matériels Électriques Imprégnés d\'Huile en Service - Guide pour l\'Interprétation des Gaz Dissous',
        titleEn: 'Mineral Oil-Filled Electrical Equipment in Service - Guidance on the Evaluation of Dissolved and Free Gases',
        descFr: 'Référence internationale absolue pour l\'interprétation des analyses DGA et l\'usage des ratios de Duval.',
        descEn: 'Global benchmark standard for DGA diagnostic interpretation and Duval triangle application.'
      },
      {
        code: 'CEI 60076-7',
        tag: 'TRANSFORMATEURS',
        titleFr: 'Transformateurs de Puissance - Guide de Charge pour Transformateurs Immergés dans l\'Huile',
        titleEn: 'Power Transformers - Loading Guide for Mineral-Oil-Immersed Power Transformers',
        descFr: 'Règles de calcul de l\'échauffement, des points chauds et des surcharges admissibles en exploitation.',
        descEn: 'Formulas for winding hot-spot temperature modeling, loss of life, and permissible operational overloads.'
      }
    ]
  },

  // D07: Automatisme Industriel, DCS & Variateurs de Vitesse (VFD)
  D07: {
    domainCode: 'D07',
    sectionA: {
      roleFr: "Commande automatisée des procédés industriels par Automates Programmables (API/PLC), systèmes numériques de contrôle-commande (DCS) et pilotage à vitesse variable des moteurs (VFD).",
      roleEn: 'Automated industrial process control via Programmable Logic Controllers (PLC), Distributed Control Systems (DCS), and Variable Frequency Drives (VFD).',
      inputsFr: {
        title: 'Capteurs Terrain & Réseau Force 400 V / 690 V',
        desc: 'Entrées logiques TOR 24 Vcc, boucles analogiques 4–20 mA / PT100 et alimentation triphasée des variateurs.',
        voltage: '24 Vcc Contrôle • 400 V / 690 V Force'
      },
      inputsEn: {
        title: 'Field Sensors & 400 V / 690 V Power Supply',
        desc: '24 Vdc discrete inputs, 4–20 mA / RTD analog loops, and 3-phase power feeders for motor drives.',
        voltage: '24 Vdc Control • 400 V / 690 V Power'
      },
      processFr: {
        title: 'Cycle Automate IEC 61131-3 & Modulation MLI (PWM)',
        desc: 'Scrutation cyclique déterministe (Grafcet, Ladder, Blocs PID) et redressement/onduleur IGBT à rapport U/f ou contrôle vectoriel de flux.',
        note: 'Économie d\'énergie sur pompes/ventilateurs : P varie avec le cube de la vitesse (N³)'
      },
      processEn: {
        title: 'IEC 61131-3 PLC Scan & IGBT PWM Modulation',
        desc: 'Deterministic PLC scan execution (SFC, Ladder, PID loops) and VFD IGBT pulse-width modulation with flux vector control.',
        note: 'Centrifugal pump/fan energy savings: Power scales with the cube of speed (N³)'
      },
      outputsFr: {
        title: 'Actionneurs, Vannes & Moteurs Asynchrones',
        desc: 'Pilotage progressif sans à-coup de courant au démarrage, régulation de pression/débit et supervision SCADA/IHM.',
        earthing: 'Câbles moteurs blindés CEM mis à la terre à 360° par presse-étoupe métallique'
      },
      outputsEn: {
        title: 'Actuators, Control Valves & Induction Motors',
        desc: 'Soft-start torque control without inrush current spikes, closed-loop process regulation, and HMI supervision.',
        earthing: 'Shielded VFD motor cables grounded 360° via EMC metallic glands'
      }
    },
    sectionB: {
      summaryFr: 'Architectures d\'automatisme industriel : commande locale sur API modulaire vs architecture DCS redondée et variateurs régénératifs.',
      summaryEn: 'Industrial automation topologies: modular PLC islands vs redundant plant-wide DCS and regenerative VFDs.',
      architectures: [
        {
          nameFr: 'Variateur de Vitesse 6 Pulsations + Filtre d\'Harmoniques (AFE)',
          nameEn: 'Active Front End (AFE) Low-Harmonic VFD Drive',
          techFr: 'Redresseur actif à IGBT en entrée limitant la distorsion harmonique THDi < 5%',
          techEn: 'IGBT active front-end rectifier maintaining grid current harmonic distortion THDi < 5%',
          descFr: 'Permet le freinage régénératif (renvoi d\'énergie sur le réseau) et respecte les limites CEI 61000-3-12 sans polluer le TGBT.',
          descEn: 'Enables 4-quadrant regenerative braking while complying with IEC 61000-3-12 harmonic limits.',
          standard: 'CEI 61800-3',
          metricFr: 'THDi : < 4.5% à pleine charge',
          metricEn: 'THDi: < 4.5% at full load'
        },
        {
          nameFr: 'Architecture Automate Redondée Hot-Standby & E/S Déportées',
          nameEn: 'Hot-Standby Redundant PLC with Distributed Fieldbus I/O',
          techFr: 'Double unité centrale synchronisée par fibre optique sur anneau Profinet / Modbus TCP',
          techEn: 'Dual fiber-synced CPU racks polling distributed I/O islands over ring topology',
          descFr: 'Garantit le maintien du procédé continu (eau, cimenterie, agro-industrie) sans arrêt en cas de défaillance d\'un processeur.',
          descEn: 'Guarantees uninterrupted industrial process continuity upon single CPU or link failure.',
          standard: 'CEI 61131-2',
          metricFr: 'Basculement : 0 ms (sans à-coup)',
          metricEn: 'Switchover: 0 ms bumpless'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-vfd-altivar',
        nameFr: 'Variateur de Vitesse Industriel (Altivar Process / SINAMICS G120)',
        nameEn: 'Industrial Variable Frequency Drive (VFD 160 kW)',
        voltage: '400 V • 160 kW • Modulation IGBT',
        roleFr: 'Variation continue de fréquence (5 à 60 Hz), limitation du courant d\'appel et optimisation énergétique.',
        roleEn: 'Continuous frequency regulation (5–60 Hz), soft starting, and pump/fan energy optimization.',
        symbol: 'VFD-01',
        standard: 'CEI 61800-5-1',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'motor'
      },
      {
        id: 'eq-exp-plc-s7',
        nameFr: 'Automate Programmable Industriel Modulaire (S7-1500 / Modicon M580)',
        nameEn: 'Modular Industrial PLC Controller (S7-1500 / Modicon M580)',
        voltage: 'Alimentation 24 Vcc • Temps de cycle < 5 ms',
        roleFr: 'Exécution des séquences logiques, asservissements PID et sécurité fonctionnelle SIL2/SIL3.',
        roleEn: 'Execution of sequential logic, closed-loop PID control, and SIL2/SIL3 safety interlocks.',
        symbol: 'PLC-CPU',
        standard: 'CEI 61131-3',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        calcTab: 'motor'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Analyse Fonctionnelle & Liste d\'Entrées/Sorties',
        titleEn: 'Functional Design Spec (FDS) & I/O Schedule',
        descFr: 'Recensement des capteurs/actionneurs (TOR, 4–20 mA) et rédaction du Grafcet de conduite et de sécurité.',
        descEn: 'Cataloging field sensors/actuators and authoring control and safety sequential function charts.'
      },
      {
        phase: '02',
        titleFr: 'Dimensionnement des Variateurs & Filtres CEM/dv/dt',
        titleEn: 'VFD Sizing & EMC / dv/dt Filter Selection',
        descFr: 'Choix du calibre en fonction du couple (constant ou quadratique) et protection contre les surtensions de câble long.',
        descEn: 'Selecting drive rating for constant/quadratic torque and adding dv/dt filters for long motor leads.'
      },
      {
        phase: '03',
        titleFr: 'Câblage Armoire & Ségrégation Courants Forts / Faibles',
        titleEn: 'Panel Wiring & Power/Control Segregation',
        descFr: 'Séparation physique des goulottes 400 V PWM et 24 Vcc analogique, reprise des blindages à 360°.',
        descEn: 'Physical duct separation between 400 V PWM power cables and 24 Vdc analog signals with 360° shield bonding.'
      },
      {
        phase: '04',
        titleFr: 'Tests d\'Acceptation Usine (FAT) sur Simulateur',
        titleEn: 'Factory Acceptance Testing (FAT) & Loop Check',
        descFr: 'Simulation de toutes les entrées/sorties, test des sécurités d\'arrêt d\'urgence (STO) et validation des écrans IHM.',
        descEn: 'Full I/O point-to-point simulation, Safe Torque Off (STO) verification, and HMI screen validation.'
      },
      {
        phase: '05',
        titleFr: 'Mise en Service Site (SAT) & Réglage PID',
        titleEn: 'Site Commissioning (SAT) & PID Auto-Tuning',
        descFr: 'Identification automatique des paramètres moteur à l\'arrêt et réglage des gains proportionnel/intégral.',
        descEn: 'Standstill motor parameter auto-identification and closed-loop PID step-response tuning.'
      }
    ],
    sectionE: [
      {
        id: 'vfd_sync_speed',
        tabLabelFr: 'Vitesse Synchrone & Glissement (VFD)',
        tabLabelEn: 'Synchronous Speed & Slip Formula',
        titleFr: 'Pilotage de la Vitesse de Rotation par la Fréquence Statorique',
        titleEn: 'Motor Rotational Speed Control via Stator Frequency',
        descFr: 'Le variateur ajuste la fréquence f délivrée au stator tout en maintenant le flux magnétique Φ = U / f constant.',
        descEn: 'The VFD modulates stator frequency f while keeping the magnetic air-gap flux ratio V/f constant.',
        formula: 'n_s = (60 · f) / p   et   n = n_s · (1 - g)',
        formulaDescFr: 'Avec ns vitesse synchrone (tr/min), f fréquence de sortie du variateur (Hz), p nombre de paires de pôles, et g glissement nominal.',
        formulaDescEn: 'With ns synchronous speed (rpm), f VFD output frequency (Hz), p pole pairs, and g rotor slip.',
        assumptionsFr: [
          'Loi U/f constante jusqu\'à la fréquence nominale (50 Hz) garantissant le couple nominal.',
          'Au-delà de 50 Hz (survitesse), fonctionnement à puissance constante avec affaiblissement de flux.',
          'Ventilation forcée requise si le moteur tourne longtemps à très basse fréquence (< 15 Hz).'
        ],
        assumptionsEn: [
          'Constant V/f ratio up to base frequency (50 Hz) maintaining full rated torque.',
          'Above 50 Hz, field-weakening region operates at constant power with reduced torque.',
          'Forced external cooling fan required for continuous low-speed operation (< 15 Hz).'
        ],
        calcTab: 'motor'
      },
      {
        id: 'affinity_laws_vfd',
        tabLabelFr: 'Lois d\'Affinité (Pompes & Ventilateurs)',
        tabLabelEn: 'Centrifugal Pump & Fan Affinity Laws',
        titleFr: 'Gain Énergétique Cubique en Régulation par Variateur',
        titleEn: 'Cubic Power Saving Law for Centrifugal Loads',
        descFr: 'Sur une pompe ou un ventilateur centrifuge, réduire la vitesse de 20% diminue la puissance électrique appelée de près de 50% !',
        descEn: 'For centrifugal pumps and fans, reducing speed by 20% cuts electrical power consumption by nearly 50%!',
        formula: 'Q₂ / Q₁ = N₂ / N₁   ;   H₂ / H₁ = (N₂ / N₁)²   ;   P₂ / P₁ = (N₂ / N₁)³',
        formulaDescFr: 'Avec Q le débit volumique, H la hauteur manométrique (pression), P la puissance mécanique sur l\'arbre, et N la vitesse de rotation.',
        formulaDescEn: 'Where Q is flow rate, H is head pressure, P is shaft power, and N is rotational speed.',
        assumptionsFr: [
          'Réseau hydraulique ou aéraulique à dominante de pertes de charge quadratiques (peu de hauteur géométrique statique).',
          'Rendement hydraulique de la pompe supposé quasi-constant au voisinage du point nominal.',
          'Remplacement avantageux du laminage par vanne de réglage énergivore.'
        ],
        assumptionsEn: [
          'System curve dominated by friction head losses rather than high static lift.',
          'Pump efficiency assumed near-constant across moderate speed variations.',
          'Replaces wasteful mechanical throttling valves.'
        ],
        calcTab: 'motor'
      }
    ],
    sectionF: [
      {
        code: 'CEI 61800-3 / 5-1',
        tag: 'VARIATEURS DE VITESSE',
        titleFr: 'Entraînements Électriques de Puissance à Vitesse Variable - Exigences CEM & Sécurité',
        titleEn: 'Adjustable Speed Electrical Power Drive Systems - EMC & Safety Requirements',
        descFr: 'Définit les limites d\'émission électromagnétique, l\'immunité et la sécurité électrique/thermique des variateurs.',
        descEn: 'Specifies electromagnetic emission limits, immunity levels, and functional safety for VFD drives.'
      },
      {
        code: 'CEI 61131-3',
        tag: 'AUTOMATES PROGRAMMABLES',
        titleFr: 'Automates Programmables - Langages de Programmation Normalisés',
        titleEn: 'Programmable Controllers - Programming Languages Standard',
        descFr: 'Standardise les 5 langages d\'automatisme : Ladder (LD), Grafcet (SFC), Blocs Fonctionnels (FBD), Texte Structuré (ST).',
        descEn: 'Standardizes PLC languages: Ladder Diagram (LD), Sequential Function Chart (SFC), Function Block (FBD), and Structured Text (ST).'
      }
    ]
  }
};

