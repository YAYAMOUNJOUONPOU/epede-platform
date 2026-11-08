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
      roleFr: "Transit massif d'énergie électrique en très haute tension (225 kV & 90 kV) sur de longues distances interurbaines, reliant les bassins de production hydraulique (Nachtigal, Song Loulou, Memve'ele) et thermique aux grands centres de consommation (Yaoundé, Douala, Bafoussam) avec maîtrise rigoureuse des pertes Joule, de l'effet Ferranti et de la coordination de l'isolement aux chocs de foudre.",
      roleEn: 'Bulk extra-high-voltage (225 kV & 90 kV) electrical power transmission across long interurban distances, interconnecting distant hydro complexes (Nachtigal, Song Loulou, Memve\'ele) with metropolitan load centers (Yaoundé, Douala, Bafoussam) while mastering Joule losses, Ferranti overvoltages, and lightning insulation coordination.',
      inputsFr: {
        title: 'Postes Élévateurs de Centrale & Couloir d\'Emprise',
        desc: 'Énergie injectée à 225 kV depuis les transformateurs GSU de Nachtigal (420 MW), Song Loulou (384 MW) et Memve\'ele (211 MW). Couloir d\'emprise déboisé de 35 à 50 m et exposition kéraunique tropicale sévère (Nk > 80 jours d\'orage/an).',
        voltage: '225 kV THT & 90 kV HTB • 50 Hz'
      },
      inputsEn: {
        title: 'Powerhouse Step-Up Substations & Right-of-Way',
        desc: 'Power injected at 225 kV from GSU step-up transformers at Nachtigal (420 MW), Song Loulou (384 MW), and Memve\'ele (211 MW). Cleared 35 to 50 m right-of-way corridor with severe tropical lightning exposure (Nk > 80 thunderstorm days/yr).',
        voltage: '225 kV EHV & 90 kV HV • 50 Hz'
      },
      processFr: {
        title: 'Lignes Aériennes à Faisceaux, Équilibre Thermique & Tenue Mécanique',
        desc: 'Faisceaux de conducteurs Almelec Aster 570 mm² portés par pylônes métalliques en treillis sous calcul de flèche de chaînette à 75°C (Cigré TB 273). Maîtrise de l\'effet couronne (E < 17 kV/cm), double câble de garde OPGW avec résistance de pied de pylône Rp ≤ 10 Ω pour immunité aux coups de foudre.',
        note: 'Capacité de transit : jusqu\'à 350 MVA par circuit 225 kV • Vitesse d\'onde v ≈ 300 000 km/s'
      },
      processEn: {
        title: 'Bundle Overhead Lines, Thermal Equilibrium & Mechanical State Equations',
        desc: 'Aster 570 mm² AAAC bundle conductors on steel lattice towers calculated per catenary sag-tension at 75°C core rating (Cigré TB 273). Corona surface gradient suppression (E < 17 kV/cm), dual OPGW optical shield wires with tower footing resistance Rp ≤ 10 Ω for lightning back-flashover immunity.',
        note: 'Thermal transfer capacity: up to 350 MVA per 225 kV circuit • Wave propagation speed v ≈ 300,000 km/s'
      },
      outputsFr: {
        title: 'Postes d\'Interconnexion Régionaux & Téléprotection OPGW',
        desc: 'Livraison de la puissance aux grands nœuds de répartition (Oyomabang, Nyom II, Mangombé, Bekoko) pour abaissement 90 kV et 30 kV. Disponibilité N-1 > 99.98% et échange instantané des signaux de protection différentielle de ligne 87L par fibre optique OPGW.',
        earthing: 'Mise à la terre des massifs de pylônes (Rp ≤ 10 Ω) & éclateurs de décharge'
      },
      outputsEn: {
        title: 'Regional Transmission Nodes & High-Speed OPGW Teleprotection',
        desc: 'Power delivery to major bulk substations (Oyomabang, Nyom II, Mangombé, Bekoko) for step-down to 90 kV and 30 kV. N-1 availability > 99.98% and millisecond-level line differential 87L teleprotection signaling over dark fiber OPGW.',
        earthing: 'Tower footing earth grid (Rp ≤ 10 Ω) & surge protection coordination'
      }
    },
    sectionB: {
      summaryFr: 'Architectures de transport d\'électricité en très haute tension : lignes aériennes double terne, câbles souterrains XLPE, faisceaux 400 kV et liaisons à courant continu HVDC.',
      summaryEn: 'High-voltage power transmission architectures: double-circuit overhead lines, XLPE underground cables, 400 kV multi-bundles, and HVDC direct-current interties.',
      architectures: [
        {
          nameFr: 'Ligne Aérienne 225 kV Double Terne en Treillis (2 Circuits Indépendants)',
          nameEn: 'Double-Circuit 225 kV Lattice Tower Overhead Line',
          techFr: 'Pylônes métalliques en treillis supportant 2 circuits triphasés indépendants (6 phases) et 2 câbles de garde OPGW en sommet.',
          techEn: 'Steel lattice towers carrying two independent 3-phase circuits (6 phases) and twin optical ground wires (OPGW) at the apex.',
          descFr: 'Épine dorsale de transport du RIS camerounais (ex: Nachtigal - Nyom II et Songloulou - Mangombé). En cas de foudroiement ou avarie sur un terne, la protection déclenche uniquement le circuit défaillant en moins de 60 ms pendant que le second terne évacue la totalité de la puissance (critère N-1 sans coupure).',
          descEn: 'Backbone of the Cameroon Southern Grid (e.g. Nachtigal - Nyom II and Songloulou - Mangombé). In the event of a lightning flashover, line protection trips only the faulted circuit in < 60 ms while the parallel circuit carries full load.',
          standard: 'CEI 60826 / NF EN 50341',
          metricFr: 'Portée moyenne : 380 à 450 m • Transit nominal : 2 x 350 MVA',
          metricEn: 'Average span: 380 to 450 m • Nominal capacity: 2 x 350 MVA'
        },
        {
          nameFr: 'Ligne Aérienne 90 kV Simple Terne de Répartition Régionale',
          nameEn: 'Single-Circuit 90 kV Regional Sub-Transmission Line',
          techFr: 'Pylônes métalliques compacts ou poteaux béton armé/bois en nappe horizontale ou disposition en drapeau.',
          techEn: 'Compact steel lattice or spun concrete poles arranged in horizontal flat or vertical flag configuration.',
          descFr: 'Assure la distribution régionale depuis les grands postes 225 kV vers les villes secondaires (ex: Oyomabang - Mbalmayo ou Mangombé - Bafoussam). Coût d\'emprise réduit, adaptée aux reliefs accidentés.',
          descEn: 'Feeds regional towns from major 225 kV hub substations (e.g. Oyomabang - Mbalmayo). Reduced right-of-way footprint tailored for rugged terrain.',
          standard: 'CEI 60826 / IEEE Std 1313',
          metricFr: 'Portée : 250 à 350 m • Transit : 60 à 120 MVA',
          metricEn: 'Span: 250 to 350 m • Transfer: 60 to 120 MVA'
        },
        {
          nameFr: 'Liaison Souterraine THT 225 kV XLPE avec Permutation d\'Écran (Cross-Bonding)',
          nameEn: 'Underground EHV 225 kV XLPE Cable with Cross-Bonding',
          techFr: 'Câbles unisolaires haute tension à âme cuivre (1200 à 2000 mm²), isolant polyéthylène réticulé (XLPE) et gaine de plomb étanche.',
          techEn: 'Single-core EHV cables with copper conductor (1200 to 2000 mm²), cross-linked polyethylene (XLPE) insulation, and lead sheath.',
          descFr: 'Indispensable pour la pénétration de forte puissance au cœur des métropoles denses (Yaoundé, Douala) où les couloirs aériens sont impossibles. Le système de cross-bonding élimine les courants de circulation dans les écrans métalliques pour maximiser l\'ampacité.',
          descEn: 'Essential for bulk power penetration into dense city centers (Yaoundé, Douala) where overhead corridors are prohibited. Cross-bonding cancels sheath circulating currents to maximize ampacity.',
          standard: 'CEI 60840 / CEI 62067 / CEI 60287',
          metricFr: 'Ampacité : 1000 à 1600 A • Effet capacitif : 0.20 µF/km',
          metricEn: 'Ampacity: 1000 to 1600 A • Capacitance: 0.20 µF/km'
        },
        {
          nameFr: 'Ligne THT à Faisceaux Multiples 400 kV (Corridor d\'Interconnexion Régionale)',
          nameEn: '400 kV Multi-Bundle Extra-High-Voltage Line (Regional Intertie)',
          techFr: 'Faisceau de 3 ou 4 conducteurs par phase espacés de 400 à 450 mm par entretoises amortissantes pour limiter le gradient couronne.',
          techEn: 'Bundle of 3 or 4 subconductors per phase spaced 400 to 450 mm via spacer dampers to keep surface electric field below corona limit.',
          descFr: 'Architecture retenue pour les grands corridors transfrontaliers d\'interconnexion régionale (ex: corridor 400 kV PEAC et PIECT Cameroun-Tchad). Réduit considérablement les pertes réactives et augmente la puissance naturelle SIL à plus de 550 MW.',
          descEn: 'Selected for major transboundary regional interties (e.g. 400 kV PEAC & PIECT Cameroon-Chad). Minimizes line reactance and boosts Surge Impedance Loading (SIL) beyond 550 MW.',
          standard: 'CEI 60826 / CIGRE TB 498',
          metricFr: 'SIL : > 550 MW • Portée : 400 à 500 m',
          metricEn: 'SIL: > 550 MW • Span: 400 to 500 m'
        },
        {
          nameFr: 'Liaison à Courant Continu Haute Tension (HVDC VSC / MMC)',
          nameEn: 'High-Voltage Direct Current (HVDC VSC / MMC Link)',
          techFr: 'Convertisseurs modulaires multiniveaux (MMC) à IGBT raccordés par une ligne bipolaire ±320 kV à ±500 kV sans effet de charge capacitive.',
          techEn: 'Modular Multilevel Converters (MMC) with IGBTs interconnected via a bipolar DC link without capacitive distance limits.',
          descFr: 'Solution optimale pour le transport massif d\'énergie sur distances supérieures à 600-800 km ou liaisons sous-marines/souterraines longues, permettant un contrôle instantané bidirectionnel de la puissance active et un soutien dynamique de tension AC aux deux extrémités.',
          descEn: 'Optimal solution for bulk power transfer over distances exceeding 600-800 km, enabling instantaneous bidirectional active power dispatch and independent AC voltage support at both terminals.',
          standard: 'CEI 62501 / IEEE Std 1775',
          metricFr: 'Pertes : < 3% sur 1000 km • Zéro limite capacitive de distance',
          metricEn: 'Losses: < 3% over 1000 km • Zero reactive distance limit'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-tower-225kv',
        nameFr: 'Pylône Métallique en Treillis 225 kV Double Terne',
        nameEn: '225 kV Double-Circuit Steel Lattice Transmission Tower',
        voltage: '225 kV • 2 Circuits Triphasés Indépendants',
        roleFr: 'Support mécanique des conducteurs et maintien des distances d\'isolement dans l\'air au sol et entre phases selon CEI 60826.',
        roleEn: 'Structural support and dielectric clearance maintenance for twin 3-phase bundles per IEC 60826.',
        symbol: 'TOWER-225',
        standard: 'CEI 60826 / NF EN 50341',
        imgUrl: '/images/homepage_uploads/batch_02_image_007.jpg',
        calcTab: 'cable-ampacity'
      },
      {
        id: 'eq-exp-line-conductor',
        nameFr: 'Faisceau de Conducteurs Almelec (Aster 570 mm² / ACSR Curlew)',
        nameEn: 'All-Aluminium Alloy Bundle Conductor (Aster 570 mm² / ACSR)',
        voltage: '225 kV • In = 980 A par conducteur à 75°C',
        roleFr: 'Transport du courant de puissance avec résistance ohmique linéique minimale (R = 0.058 Ω/km) et tenue à la traction élevée.',
        roleEn: 'Bulk power transport with minimized line resistance (R = 0.058 Ω/km) and high ultimate tensile strength.',
        symbol: 'AAAC-570',
        standard: 'CEI 61089 / ASTM B232',
        imgUrl: '/images/homepage_uploads/batch_02_image_006.jpg',
        calcTab: 'cable-ampacity'
      },
      {
        id: 'eq-exp-insulator-composite',
        nameFr: 'Chaîne d\'Isolateurs Composites Silicone & Verre Trempé',
        nameEn: 'Silicone Composite & Toughened Glass Insulator String',
        voltage: '225 kV • Ligne de fuite 31 mm/kV (Environnement très pollué)',
        roleFr: 'Isolement diélectrique entre les conducteurs sous haute tension et la charpente métallique du pylône mis à la terre.',
        roleEn: 'Dielectric isolation between energized high-voltage conductors and the grounded steel lattice tower structure.',
        symbol: 'INSUL-225',
        standard: 'CEI 61109 / CEI 60383-1',
        imgUrl: '/images/homepage_uploads/batch_03_image_011.jpg'
      },
      {
        id: 'eq-exp-opgw-shield',
        nameFr: 'Câble de Garde à Fibre Optique Intégrée (OPGW - 48 Fibres G.652D)',
        nameEn: 'Optical Ground Wire with Integrated Fiber Optics (OPGW 48 Fibers)',
        voltage: 'Terre Pylône • Tenue au court-circuit 15 kA / 0.5 s',
        roleFr: 'Protection contre les coups de foudre directs en sommet de pylône et support physique des télécommunications de téléprotection 87L et SCADA.',
        roleEn: 'Direct lightning flashover shielding at tower apex and high-capacity optical transmission medium for 87L protection and SCADA.',
        symbol: 'OPGW-48',
        standard: 'CEI 60794-4-10 / IEEE Std 1138',
        imgUrl: '/images/homepage_uploads/batch_05_image_022.jpg'
      },
      {
        id: 'eq-exp-ugc-xlpe-225',
        nameFr: 'Câble Souterrain THT 225 kV XLPE (Âme Cuivre 1600 mm² & Gaine Plomb)',
        nameEn: '225 kV EHV Underground XLPE Cable (1600 mm² Copper & Lead Sheath)',
        voltage: '225 kV Assigné (Um = 245 kV) • In = 1450 A en Tranchée',
        roleFr: 'Évacuation de puissance en milieu urbain dense avec écran métallique étanche radial et longitudinal contre l\'humidité.',
        roleEn: 'Bulk power transfer through congested urban subsoils with radial and longitudinal water-tight metallic lead barrier.',
        symbol: 'XLPE-225',
        standard: 'CEI 62067 / CEI 60840 / CEI 60287',
        imgUrl: '/assets/ecosystem/power-transmission-ecosystem.jpg',
        calcTab: 'cable-ampacity'
      },
      {
        id: 'eq-exp-spacer-damper',
        nameFr: 'Entretoise Amortissante de Faisceau & Amortisseur Stockbridge',
        nameEn: 'Conductor Bundle Spacer Damper & Stockbridge Vibration Damper',
        voltage: '225 kV - 400 kV • Écartement normalisé 400 mm',
        roleFr: 'Maintien de l\'écartement géométrique entre sous-conducteurs et dissipation des vibrations éoliennes (Aeolian vibrations) et du galop.',
        roleEn: 'Preservation of geometric subconductor spacing and dissipation of wind-induced Aeolian vibrations and subspan oscillation.',
        symbol: 'SPACER',
        standard: 'CEI 61854 / CEI 61897',
        imgUrl: '/images/homepage_uploads/batch_07_image_031_hydro_turbine_hall.jpg'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Études Topographiques, LiDAR & Délimitation de l\'Emprise (ROW)',
        titleEn: 'Topographic LiDAR Survey & Right-of-Way Delineation',
        descFr: 'Relevé aéroporté haute densité pour modélisation numérique du terrain (MNT), identification des croisements (fleuves, routes, lignes existantes) et délimitation du couloir de déboisement de 35 à 50 m.',
        descEn: 'Airborne LiDAR high-density corridor scanning, digital elevation modeling (DEM), clearance obstacle profiling, and 35 to 50 m right-of-way clearance zoning.'
      },
      {
        phase: '02',
        titleFr: 'Dimensionnement Électrique & Maîtrise de l\'Effet Couronne',
        titleEn: 'Electrical Conductor Sizing & Corona Gradient Control',
        descFr: 'Choix de la section d\'aluminium et de la géométrie de faisceau (diamètre équivalent) pour limiter le champ électrique surfacique sous 17 kV/cm, réduisant les pertes couronne et les bruits radioélectriques.',
        descEn: 'Conductor cross-section and bundle geometry selection ensuring surface electric field remains below 17 kV/cm, mitigating corona losses and audible radio interference.'
      },
      {
        phase: '03',
        titleFr: 'Calcul Mécanique des Portées & Flèches (Équation de Changement d\'État)',
        titleEn: 'Mechanical Sag-Tension Sizing & State Change Equation',
        descFr: 'Résolution de l\'équation cubique de changement d\'état selon Cigré TB 273. Détermination de la portée équivalente (Ruling Span), de la flèche maximale à température d\'âme de 75°C et des efforts sur pylônes sous vent cyclonique.',
        descEn: 'Solving the cubic conductor state-change equation per Cigré TB 273. Evaluating ruling span, maximum sag at 75°C conductor core rating, and mechanical wind blowout clearances.'
      },
      {
        phase: '04',
        titleFr: 'Coordination de l\'Isolement & Immunité aux Coups de Foudre (CEI 60071)',
        titleEn: 'Insulation Coordination & Lightning Withstand Design (IEC 60071)',
        descFr: 'Dimensionnement du niveau d\'isolement aux chocs de foudre (BIL 1050 kV en 225 kV), angle de protection des câbles de garde OPGW (≤ 25°), et traitement de la prise de terre des massifs pour Rp ≤ 10 Ω.',
        descEn: 'Basic lightning impulse insulation level specification (BIL 1050 kV at 225 kV), OPGW shielding angle verification (≤ 25°), and tower footing grounding grid treatment for Rp ≤ 10 Ω.'
      },
      {
        phase: '05',
        titleFr: 'Génie Civil des Fondations & Montage des Pylônes en Treillis',
        titleEn: 'Substructure Civil Foundations & Lattice Tower Erection',
        descFr: 'Coulage des massifs béton armé à semelles ancrées dans la roche ou sur pieux forés en terrain meuble. Assemblage mécano-boulonné des tronçons de fûts de pylônes et pose des consoles de phases.',
        descEn: 'Reinforced concrete foundation casting designed for uplift overturning moments. Tower section crane/derrick bolting and phase crossarm mounting.'
      },
      {
        phase: '06',
        titleFr: 'Déroulage sous Tension Mécanique Contrôlée & Clavetage des Faisceaux',
        titleEn: 'Tension Stringing, Sag Adjustment & Clamping',
        descFr: 'Tirage au treuil freineur sans contact avec le sol pour protéger la surface des brins d\'aluminium. Visée topographique des flèches, ancrage sur chaînes d\'isolateurs et installation des entretoises amortissantes.',
        descEn: 'Tension stringing using puller-tensioner rigs preventing ground abrasion of conductor strands. Optical sag sighting, dead-end clamping, and spacer-damper fitting.'
      },
      {
        phase: '07',
        titleFr: 'Mise en Service, Inspection Thermographique & Dynamic Line Rating (DLR)',
        titleEn: 'Commissioning, Aerial Thermography & Dynamic Line Rating (DLR)',
        descFr: 'Essais diélectriques de continuité et d\'isolement, inspection pédestre et drone avec caméra infrarouge pour détecter les échauffements anormaux des manchons, et déploiement de capteurs DLR météo.',
        descEn: 'Dielectric continuity and insulation testing, drone infrared thermal scanning of compression splices, and real-time weather-based Dynamic Line Rating sensor deployment.'
      }
    ],
    sectionE: [
      {
        id: 'ferranti_effect',
        tabLabelFr: 'Effet Ferranti & Réactif',
        tabLabelEn: 'Ferranti Effect & Var',
        titleFr: 'Élévation de Tension à Vide en Bout de Ligne (Effet Ferranti)',
        titleEn: 'No-Load Voltage Rise at Line Receiving End (Ferranti Effect)',
        descFr: 'Sur une longue ligne aérienne ou un câble souterrain fonctionnant à vide ou sous très faible charge, la puissance réactive capacitive générée par sa capacité shunt élève la tension réceptrice V2 au-dessus de la tension émettrice V1.',
        descEn: 'Along long overhead lines or underground cables operating at no-load or light load, distributed shunt capacitance produces net capacitive vars, raising receiving-end voltage V2 above sending-end V1.',
        formula: '\\Delta U = V_2 - V_1 \\approx \\frac{\\omega^2 \\cdot L_{tot} \\cdot C_{tot}}{2} \\cdot V_1 = \\frac{1}{2} \\left(\\frac{\\omega \\cdot l}{v}\\right)^2 \\cdot V_1',
        formulaDescFr: 'Avec ω = 2πf pulsation réseau (314 rad/s à 50 Hz), Ltot inductance linéique totale, Ctot capacité linéique totale, l longueur de ligne (km) et v vitesse de l\'onde (300 000 km/s).',
        formulaDescEn: 'With ω = 2πf angular frequency (314 rad/s at 50 Hz), Ltot total series inductance, Ctot total shunt capacitance, l line length (km), and v light speed (300,000 km/s).',
        assumptionsFr: [
          'Ligne à vide sans soutirage de charge à l\'extrémité réceptrice (I2 = 0).',
          'Fréquence industrielle 50 Hz sinusoïdale équilibrée.',
          'Nécessite la connexion de bobines d\'inductance shunt haute tension (CEI 60076-6) pour absorber le réactif excédentaire.'
        ],
        assumptionsEn: [
          'Open-circuit receiving end condition (I2 = 0).',
          'Industrial 50 Hz steady-state balanced sinusoidal supply.',
          'Requires connection of high-voltage shunt compensation reactors (IEC 60076-6) to clamp overvoltages.'
        ],
        calcTab: 'voltage-drop'
      },
      {
        id: 'thermal_ampacity',
        tabLabelFr: 'Capacité Thermique & Bilan IEEE 738',
        tabLabelEn: 'Thermal Ampacity & Heat Balance',
        titleFr: 'Courant Admissible Permanent & Échauffement Conducteur (IEEE Std 738)',
        titleEn: 'Steady-State Thermal Ampacity Heat Balance per IEEE Std 738',
        descFr: 'Détermine le courant permanent maximal admissible sans dépassement de la température limite d\'âme (75°C pour Almelec, 90°C pour ACSR), par bilan thermique entre échauffement Joule/solaire et refroidissement éolien.',
        descEn: 'Establishes continuous maximum current rating without exceeding maximum core temperature (75°C for AAAC, 90°C for ACSR), balancing Joule/solar gains against wind cooling.',
        formula: 'I_{max} = \\sqrt{ \\frac{q_c(T_{max}) + q_r(T_{max}) - q_s}{R_{ac}(T_{max})} }',
        formulaDescFr: 'Avec qc pertes par convection du vent (W/m), qr pertes par rayonnement radiatif (W/m), qs apport thermique solaire incident (W/m), et Rac(Tmax) résistance ohmique AC à chaud.',
        formulaDescEn: 'With qc convective cooling (W/m), qr radiative cooling (W/m), qs solar heat gain (W/m), and Rac(Tmax) AC resistance at maximum allowable temperature.',
        assumptionsFr: [
          'Vitesse de vent minimale défavorable perpendiculaire : 0.6 m/s.',
          'Flux solaire tropical : 1 000 W/m² avec coefficient d\'absorption solaire α = 0.5 à 0.8.',
          'Température ambiante de calcul : 40°C à 45°C en plaine équatoriale.'
        ],
        assumptionsEn: [
          'Conservative perpendicular crosswind: 0.6 m/s.',
          'Tropical solar insolation: 1,000 W/m² with emissivity/absorptivity α = 0.5 to 0.8.',
          'Design ambient temperature: 40°C to 45°C in equatorial lowlands.'
        ],
        calcTab: 'cable-ampacity'
      },
      {
        id: 'catenary_sag_equation',
        tabLabelFr: 'Flèche Mécanique de Chaînette',
        tabLabelEn: 'Catenary Sag & Mechanical State',
        titleFr: 'Calcul de la Flèche Maximale d\'une Ligne Aérienne (Cigré TB 273)',
        titleEn: 'Overhead Line Catenary Maximum Sag Calculation (Cigré TB 273)',
        descFr: 'Permet de vérifier que la flèche au milieu de la portée ne viole à aucun moment les gabarits de sécurité verticaux par rapport au sol (ex: 8.0 m en 225 kV selon CEI 61936-1).',
        descEn: 'Verifies that mid-span conductor sag preserves required ground clearance safety envelopes (e.g., 8.0 m at 225 kV per IEC 61936-1) under maximum thermal elongation.',
        formula: 'f = \\frac{w \\cdot S^2}{8 \\cdot T_0} \\quad ; \\quad L_c \\approx S + \\frac{8 \\cdot f^2}{3 \\cdot S}',
        formulaDescFr: 'Avec w poids linéique total résultant (conducteur + vent) en N/m, S portée horizontale entre pylônes (m), T0 tension mécanique horizontale à la suspension (N), et Lc longueur développée.',
        formulaDescEn: 'With w resultant linear weight (conductor weight + wind force) in N/m, S horizontal span between towers (m), T0 horizontal tension at support (N), and Lc developed conductor length.',
        assumptionsFr: [
          'Portée horizontale modélisée par approximation parabolique de la chaînette (valide pour f/S < 0.10).',
          'Température d\'âme maximale calculée à 75°C sous vent nul.',
          'Tension de pose initiale limitée à 20-25% de la charge de rupture mécanique (UTS) pour éviter la fatigue par vibration éolienne.'
        ],
        assumptionsEn: [
          'Parabolic approximation of catenary curve valid for sag-to-span ratios f/S < 0.10.',
          'Conductor temperature evaluated at 75°C still-air condition.',
          'Everyday tension (EDT) capped at 20-25% of Ultimate Tensile Strength (UTS) to prevent Aeolian fatigue.'
        ],
        calcTab: 'cable-ampacity'
      },
      {
        id: 'corona_inception_voltage',
        tabLabelFr: 'Effet Couronne & Gradient Peek',
        tabLabelEn: 'Corona Inception Gradient (Peek)',
        titleFr: 'Tension Critique Disruptive d\'Effet Couronne selon Peek',
        titleEn: 'Corona Inception Electric Field Gradient per Peek Formula',
        descFr: 'Détermine le gradient électrique superficiel au-delà duquel l\'air ambiant s\'ionise, créant des décharges d\'effluve lumineuses, des pertes diélectriques et des perturbations radioélectriques.',
        descEn: 'Calculates the surface electric field threshold above which ambient air ionizes, causing luminous discharges, active power losses, and audible/radio interference.',
        formula: 'E_0 = 30 \\cdot m \\cdot \\delta \\left(1 + \\frac{0.301}{\\sqrt{r \\cdot \\delta}}\\right) \\quad [\\text{kV/cm}]',
        formulaDescFr: 'Avec r rayon extérieur du conducteur (cm), m facteur d\'état de surface (0.80 à 0.85 pour brins torsadés neufs), et δ densité relative de l\'air en fonction de l\'altitude et température.',
        formulaDescEn: 'With r outer conductor radius (cm), m conductor surface irregularity factor (0.80 to 0.85 for stranded wire), and δ relative air density correcting for altitude and temperature.',
        assumptionsFr: [
          'Le gradient d\'exploitation maximal en 225 kV doit rester strictement inférieur à E0 (typiquement E_op < 17 kV/cm).',
          'L\'utilisation de faisceaux à plusieurs sous-conducteurs augmente le diamètre équivalent et abaisse le gradient de surface.',
          'Conditions atmosphériques humides (pluie tropicale) abaissent le seuil critique de 20% à 30%.'
        ],
        assumptionsEn: [
          'Operational surface gradient must stay strictly below inception field (typically E_op < 17 kV/cm).',
          'Multi-conductor bundles expand effective geometric radius, drastically suppressing surface stress.',
          'Tropical heavy rain lowers the corona inception threshold by 20% to 30%.'
        ],
        calcTab: 'voltage-drop'
      },
      {
        id: 'cable_ampacity_iec60287',
        tabLabelFr: 'Ampacité Câble Souterrain CEI 60287',
        tabLabelEn: 'Underground Cable Rating (IEC 60287)',
        titleFr: 'Intensité Admissible des Câbles Souterrains en Régime Permanent (CEI 60287)',
        titleEn: 'Steady-State Current Rating for Underground Cables per IEC 60287',
        descFr: 'Modélisation du réseau thermique équivalent de Kennelly calculant l\'échauffement de l\'âme cuivre en tranchée en fonction des résistances thermiques de l\'isolant, de la gaine et du sol.',
        descEn: 'Kennelly lumped-parameter thermal network evaluating conductor temperature rise in a buried trench based on thermal resistances of insulation, bedding, and backfill soil.',
        formula: 'I = \\sqrt{ \\frac{\\Delta \\theta - W_d [0.5 T_1 + n(T_2 + T_3 + T_4)]}{R_{ac} [T_1 + n(1+\\lambda_1) T_2 + n(1+\\lambda_1+\\lambda_2)(T_3 + T_4)]} }',
        formulaDescFr: 'Avec Δθ élévation de température admissible (90°C - Tsol), Wd pertes diélectriques, T1 à T4 résistances thermiques (isolant, écran, gaine, sol), et λ1, λ2 coefficients de pertes dans les écrans métalliques.',
        formulaDescEn: 'With Δθ permissible temperature rise (90°C - Tsoil), Wd dielectric losses, T1 to T4 thermal resistances (insulation, bedding, sheath, soil), and λ1, λ2 sheath loss factors.',
        assumptionsFr: [
          'Profondeur d\'enfouissement en tranchée standard : 1.20 à 1.50 m.',
          'Résistivité thermique du sol sec sans humidité : 1.2 à 2.0 K·m/W.',
          'Système de permutation des écrans (Cross-Bonding) réduisant les pertes d\'écran λ1 sous 0.05.'
        ],
        assumptionsEn: [
          'Standard trench burial depth: 1.20 to 1.50 m.',
          'Backfill dry soil thermal resistivity: 1.2 to 2.0 K·m/W.',
          'Special cross-bonding sheath bonding keeping sheath loss factor λ1 below 0.05.'
        ],
        calcTab: 'cable-ampacity'
      },
      {
        id: 'surge_impedance_propagation',
        tabLabelFr: 'Impédance d\'Onde & Vitesse de Propagation',
        tabLabelEn: 'Surge Impedance & Wave Speed',
        titleFr: 'Impédance Caractéristique d\'Onde Zc & Vitesse de Propagation Télécom',
        titleEn: 'Surge Impedance Zc & Wave Velocity for Teleprotection & Travelling Waves',
        descFr: 'Régit la propagation des ondes de foudre, les surtensions de manœuvre et la localisation ultra-rapide des défauts par ondes progressives (Travelling Wave Relays).',
        descEn: 'Governs lightning surge propagation, switching overvoltages, and ultra-high-speed travelling wave fault location.',
        formula: 'Z_c = \\sqrt{\\frac{l_{line}}{c_{line}}} \\approx 360 - 400 \\ \\Omega \\quad ; \\quad v = \\frac{1}{\\sqrt{l_{line} \\cdot c_{line}}} \\approx \\frac{c_0}{\\sqrt{\\epsilon_r}} \\approx 300\\,000 \\text{ km/s}',
        formulaDescFr: 'Avec l_line inductance linéique (~ 1.0 mH/km), c_line capacité linéique (~ 0.011 µF/km en aérien, ~ 0.20 µF/km en câble XLPE avec Zc ≈ 30-50 Ω).',
        formulaDescEn: 'With l_line linear inductance (~ 1.0 mH/km), c_line linear capacitance (~ 0.011 µF/km for lines, ~ 0.20 µF/km for XLPE cables with Zc ≈ 30-50 Ω).',
        assumptionsFr: [
          'Ligne modélisée sans pertes en hautes fréquences (R << ωL et G << ωC).',
          'Vitesse de propagation dans le vide/air c0 = 300 000 km/s (εr ≈ 1.0) ; réduite à ~ 160 000 km/s dans l\'isolant XLPE (εr ≈ 2.3).',
          'Permet la détection milliseconde des défauts par relais de distance 21 et ondes progressives.'
        ],
        assumptionsEn: [
          'High-frequency lossless line approximation (R << ωL and G << ωC).',
          'Propagation velocity in air c0 = 300,000 km/s (εr ≈ 1.0); slowed to ~ 160,000 km/s in XLPE solid dielectric (εr ≈ 2.3).',
          'Enables sub-millisecond fault location via Travelling Wave distance relays.'
        ],
        calcTab: 'voltage-drop'
      }
    ],
    sectionF: [
      {
        code: 'CEI 60826',
        tag: 'CONCEPTION MÉCANIQUE LIGNES',
        titleFr: 'Critères de Conception des Lignes Aériennes de Transport Électrique',
        titleEn: 'Design Criteria of Overhead Transmission Lines',
        descFr: 'Méthodologie probabiliste pour la détermination des charges de vent, du poids des conducteurs, des efforts sur pylônes et des distances de garde au sol.',
        descEn: 'Probabilistic design framework for wind loading, conductor tension, tower structure integrity, and safety clearance envelopes.'
      },
      {
        code: 'NF EN 50341 / CENELEC',
        tag: 'LIGNES AÉRIENNES HTB',
        titleFr: 'Lignes Électriques Aériennes Dépassant 1 kV CA - Exigences Communes',
        titleEn: 'Overhead Electrical Lines Exceeding 1 kV AC - General Requirements',
        descFr: 'Norme européenne et internationale de référence régissant les équations d\'état mécanique des conducteurs, la coordination de l\'isolement et les portées de sécurité.',
        descEn: 'Primary standard governing mechanical conductor state equations, dielectric air clearances, and foundation design.'
      },
      {
        code: 'IEEE Std 738-2012',
        tag: 'AMPACITÉ THERMIQUE DLR',
        titleFr: 'Calcul de la Relation Courant-Température des Conducteurs Aériens Nus',
        titleEn: 'Standard for Calculating the Current-Temperature of Bare Overhead Conductors',
        descFr: 'Formulation aérothermique normalisée pour le calcul de l\'ampacité permanente et le déploiement du Dynamic Line Rating (DLR) en temps réel.',
        descEn: 'Standardized heat balance equations for steady-state ampacity and dynamic line rating (DLR) thermal tracking.'
      },
      {
        code: 'CEI 60287 / CEI 60853',
        tag: 'CÂBLES SOUTERRAINS THT',
        titleFr: 'Calcul du Courant Admissible dans les Câbles Électriques en Régime Permanent & Cyclique',
        titleEn: 'Electric Cables - Calculation of the Current Rating (100% Load Factor & Cyclic)',
        descFr: 'Modèle thermique par réseau de résistances équivalentes (Kennelly) pour le dimensionnement des câbles souterrains haute tension en tranchée.',
        descEn: 'Equivalent thermal resistance network method (Kennelly) for sizing underground high-voltage cables in trench backfill.'
      },
      {
        code: 'CEI 60071-1 / CEI 60071-2',
        tag: 'COORDINATION ISOLEMENT',
        titleFr: 'Coordination de l\'Isolement - Définitions, Principes et Règles d\'Application',
        titleEn: 'Insulation Co-ordination - Principles, Rules and Application Guide',
        descFr: 'Fixe les niveaux assignés de tenue aux chocs de foudre (BIL), aux surtensions de manœuvre et les distances d\'isolement dans l\'air en fonction de la pollution.',
        descEn: 'Establishes Basic Impulse Insulation Levels (BIL), switching surge withstand, and creepage clearances under severe pollution.'
      },
      {
        code: 'CIGRÉ TB 273 / TB 498',
        tag: 'DYNAMIQUE DES CONDUCTEURS',
        titleFr: 'Guide de Sélection des Faisceaux & Comportement Vibratoire des Conducteurs Aériens',
        titleEn: 'Guide for the Selection of Bundle Conductors & Overhead Line Vibrations',
        descFr: 'Recommandations pour la maîtrise des vibrations éoliennes, du galop, du sous-balancement des faisceaux et l\'utilisation des amortisseurs Stockbridge.',
        descEn: 'Guidelines for suppressing Aeolian vibrations, conductor galloping, subspan oscillations, and Stockbridge damper positioning.'
      }
    ]
  },

  // D04: Postes Électriques & Nœuds Réseau
  D04: {
    domainCode: 'D04',
    sectionA: {
      roleFr: "Nœuds de convergence stratégique, d'interconnexion maillée, de transformation de tension (225 kV / 90 kV / 30 kV) et d'aiguillage sécurisé de la puissance électrique, abritant l'appareillage de coupure (disjoncteurs SF6, sectionneurs motorisés), les transformateurs de puissance avec régleurs en charge (OLTC) et le contrôle-commande numérique IEC 61850.",
      roleEn: 'Strategic grid convergence, meshed interconnection, voltage transformation (225 kV / 90 kV / 30 kV), and secure switching substations housing switchgear (SF6 circuit breakers, motorized disconnectors), OLTC power transformers, and IEC 61850 digital automation.',
      inputsFr: {
        title: 'Lignes de Transport 225 kV / 90 kV & Évacuation Centrales',
        desc: 'Énergie injectée depuis les lignes 225 kV de transport (Nachtigal, Song Loulou) et départs 90 kV. Alimentation continue sécurisée par double banc de batteries 110 Vcc pour le contrôle-commande.',
        voltage: '225 kV & 90 kV HTB • 50 Hz'
      },
      inputsEn: {
        title: '225 kV / 90 kV Transmission Lines & Generator Injections',
        desc: 'Power imported from 225 kV transmission circuits (Nachtigal, Song Loulou) and 90 kV lines. Station auxiliary dual 110 V DC battery banks powering digital relaying.',
        voltage: '225 kV & 90 kV EHV/HV • 50 Hz'
      },
      processFr: {
        title: 'Abaissement de Tension, Coupure des Défauts & Sécurité des Personnes',
        desc: 'Abaissement par transformateurs de puissance avec régleurs OLTC (±16%), élimination des courts-circuits en moins de 45 ms par disjoncteurs SF6 (40 kA), coordination d\'isolement aux chocs de foudre (BIL 1050 kV), et écoulement des défauts à la terre par maillage équipotentiel cuivre (IEEE Std 80).',
        note: 'Courant de court-circuit assigné de tenue : 40 kA / 3 s • Temps de coupure disjoncteur : ≤ 45 ms'
      },
      processEn: {
        title: 'Voltage Step-Down, Fault Clearing & Human Life Safety',
        desc: 'Voltage transformation via OLTC transformers (±16%), high-speed <45 ms SF6 fault clearing (40 kA rating), lightning insulation coordination (BIL 1050 kV), and ground fault energy dissipation through a buried copper equipotential mesh (IEEE Std 80).',
        note: 'Rated short-circuit withstand: 40 kA / 3 s • Breaker total interrupting time: ≤ 45 ms'
      },
      outputsFr: {
        title: 'Rames HTA 30 kV / 15 kV & Liaisons d\'Interconnexion Régionales',
        desc: 'Alimentation des départs de distribution MT urbains et industriels sous tension régulée à ±1.5% Un. Téléconduite vers le dispatching national par protocole IEC 60870-5-104 / ICCP.',
        earthing: 'Prise de terre générale de poste (R < 0.5 Ω) avec surveillance des tensions de pas et de toucher'
      },
      outputsEn: {
        title: '30 kV / 15 kV Distribution Busbars & Regional Grid Interties',
        desc: 'Supply to urban and heavy industrial distribution feeders with OLTC-regulated bus voltage within ±1.5% Un. Remote dispatch control via IEC 60870-5-104 / ICCP links.',
        earthing: 'Station earth mat (R < 0.5 Ω) guaranteeing safe step and touch potentials'
      }
    },
    sectionB: {
      summaryFr: 'Architectures de postes haute tension : technologie ouverte isolée dans l\'air (AIS), postes blindés encapsulés sous SF6 (GIS), postes de centrale et postes numériques CEI 61850.',
      summaryEn: 'High-voltage substation architectures: outdoor air-insulated substations (AIS), metal-enclosed gas-insulated substations (GIS), step-up switchyards, and digital IEC 61850 substations.',
      architectures: [
        {
          nameFr: 'Poste Ouvert Isolé dans l\'Air (AIS 225 kV / 90 kV)',
          nameEn: 'Outdoor Air-Insulated Substation (AIS 225 kV / 90 kV)',
          techFr: 'Appareillage installé à l\'air libre sur charpentes métalliques avec distances d\'isolement atmosphériques.',
          techEn: 'Outdoor apparatus mounted on steel lattice gantries relying on atmospheric air dielectric clearances.',
          descFr: 'Technologie la plus répandue au Cameroun (ex: postes de Mangombé, Bekoko, Nomayos). Coût initial d\'investissement modéré, maintenance visuelle aisée, mais emprise foncière importante (15 000 à 25 000 m²) et exposition à la pollution et à l\'humidité tropicale.',
          descEn: 'Most widespread substation topology in Cameroon (e.g. Mangombé, Bekoko, Nomayos). Low CAPEX and straightforward visual maintenance, but large surface footprint and exposure to tropical humidity.',
          standard: 'CEI 61936-1 / CEI 60071',
          metricFr: 'Emprise : ~20 000 m² • Distance phase-terre : ≥ 2.10 m',
          metricEn: 'Footprint: ~20,000 m² • Phase-to-earth clearance: ≥ 2.10 m'
        },
        {
          nameFr: 'Poste Blindé sous Enveloppe Métallique SF6 (GIS 225 kV)',
          nameEn: 'Gas-Insulated Metal-Enclosed Substation (GIS 225 kV)',
          techFr: 'Barres, disjoncteurs et sectionneurs encapsulés sous pression de gaz SF6 (0.4 à 0.6 MPa).',
          techEn: 'Busbars, circuit breakers, and disconnectors encapsulated inside pressurized SF6 gas enclosures.',
          descFr: 'Réduit l\'emprise foncière de 85% par rapport à l\'AIS (idéal pour l\'insertion urbaine dense à Yaoundé et Douala). Totalement insensible aux intempéries, à la salinité marine et aux orages tropicaux avec disponibilité maximale.',
          descEn: '85% footprint reduction compared to AIS (ideal for dense urban siting in Yaoundé and Douala). Absolute immunity to tropical weather, saline moisture, and lightning flashovers.',
          standard: 'CEI 62271-203',
          metricFr: 'Emprise : ~2 500 m² (-85%) • Pression SF6 : 0.45 MPa',
          metricEn: 'Footprint: ~2,500 m² (-85%) • SF6 Pressure: 0.45 MPa'
        },
        {
          nameFr: 'Poste Source d\'Abaissement HTB/HTA (225/30 kV - 63 MVA)',
          nameEn: 'EHV/MV Step-Down Distribution Substation (225/30 kV - 63 MVA)',
          techFr: 'Transformateurs 225/30 kV raccordés à des rames de cellules blindées HTA 30 kV intérieures.',
          techEn: '225/30 kV power transformers feeding indoor metal-clad 30 kV medium-voltage switchgear boards.',
          descFr: 'Nœud d\'interface clé entre le transporteur SONATREL et le distributeur ENEO (ex: poste d\'Oyomabang à Yaoundé). Comporte des résistances de neutre NGR limitant les défauts terre à 40 A et des condensateurs de compensation réactive.',
          descEn: 'Interface junction between transmission operator SONATREL and utility ENEO (e.g. Oyomabang substation in Yaoundé). Equipped with Neutral Grounding Resistors (NGR) limiting earth faults to 40 A.',
          standard: 'CEI 62271-200 / CEI 60076',
          metricFr: 'Puissance : 2 x 63 MVA • Départs MT : 8 à 16 départs 30 kV',
          metricEn: 'Rating: 2 x 63 MVA • MV Feeders: 8 to 16 circuits (30 kV)'
        },
        {
          nameFr: 'Poste Élévateur de Centrale Hydroélectrique (GSU Switchyard 10.5/225 kV)',
          nameEn: 'Powerhouse Step-Up Switchyard (GSU 10.5/225 kV)',
          techFr: 'Transformateurs élévateurs unitaires raccordés en bloc avec les groupes turbo-alternateurs.',
          techEn: 'Unit-connected step-up transformers tied directly to individual hydro-generator sets.',
          descFr: 'Évacue l\'énergie brute produite aux alternateurs (10.5 kV ou 15 kV) vers le réseau de transport 225 kV. Implantation en falaise ou plate-forme compacte avec protection différentielle unitaire 87T et 87G.',
          descEn: 'Evacuates bulk power generated at alternator voltage (10.5 kV or 15 kV) into the 225 kV transmission grid. Built on powerhouse terraces with unit differential 87T and 87G relaying.',
          standard: 'CEI 60076 / IEEE C57.12',
          metricFr: 'Rendement GSU : > 99.4% • Refroidissement ODAF / OFWF',
          metricEn: 'GSU Efficiency: > 99.4% • Cooling: ODAF / OFWF'
        },
        {
          nameFr: 'Poste Numérique CEI 61850 à Bus de Process (Digital Substation)',
          nameEn: 'Digital Substation with IEC 61850 Process Bus',
          techFr: 'Remplacement des câbles cuivre filaires par des fibres optiques avec Merging Units (MU) et protocoles SV/GOOSE.',
          techEn: 'Replacement of physical copper multicore cables with optical fibers utilizing Merging Units (MU) and SV/GOOSE streams.',
          descFr: 'Numérisation intégrale dès le pied des appareils primaires. Les valeurs échantillonnées (Sampled Values CEI 61850-9-2LE) et les ordres de déclenchement ultra-rapides GOOSE circulent sur un réseau Ethernet redondé PRP/HSR, éliminant les risques d\'ouverture accidentelle de circuits TC.',
          descEn: 'Full digitization at the primary equipment level. Sampled Values (IEC 61850-9-2LE) and ultra-fast GOOSE trip signals route over redundant PRP/HSR Ethernet, eliminating open CT hazards.',
          standard: 'CEI 61850-9-2 / CEI 61850-8-1',
          metricFr: 'Câblage cuivre : -80% • Temps de déclenchement GOOSE : < 4 ms',
          metricEn: 'Copper cabling: -80% • GOOSE trip latency: < 4 ms'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-gsu-trafo-01',
        nameFr: 'Transformateur de Puissance HTB/HTA (63 MVA - 225/30 kV)',
        nameEn: 'EHV/MV Power Transformer (63 MVA - 225/30 kV Dyn11)',
        voltage: '225 kV / 30 kV • Dyn11 • 63 MVA ONAN/ONAF',
        roleFr: 'Abaissement de tension pour l\'injection dans les réseaux de distribution urbains avec régleur en charge sous tension (OLTC ±16%).',
        roleEn: 'Step-down voltage conversion for urban distribution feeders with motorized on-load tap changer (OLTC ±16%).',
        symbol: 'T1',
        standard: 'CEI 60076-1 / CEI 60076-5',
        imgUrl: '/images/homepage_uploads/batch_03_image_011.jpg',
        calcTab: 'transformer'
      },
      {
        id: 'eq-exp-gis-bay-225k',
        nameFr: 'Disjoncteur Haute Tension SF6 (225 kV - 3150 A - 40 kA)',
        nameEn: '225 kV SF6 High-Voltage Circuit Breaker',
        voltage: '245 kV Assigné • In = 3150 A • Icc = 40 kA / 3 s',
        roleFr: 'Interruption des courants de charge et élimination ultra-rapide des courts-circuits en moins de 45 ms sous gaz SF6.',
        roleEn: 'Fault and load current interruption in less than 45 ms utilizing SF6 thermal blast arc quenching.',
        symbol: 'Q0',
        standard: 'CEI 62271-100',
        imgUrl: '/images/homepage_uploads/batch_02_image_006.jpg',
        calcTab: 'cable-short-circuit'
      },
      {
        id: 'eq-exp-ct-225k',
        nameFr: 'Transformateur de Courant (TC) de Mesure & Protection 225 kV',
        nameEn: '225 kV Current Transformer (CT) for Metering & Protection',
        voltage: '225 kV / 5 A - 1 A • Classe 5P20 / 0.2S • 4 Enroulements',
        roleFr: 'Réduction galvanique et mesure du courant primaire pour alimenter les relais de protection 50/51/87 sans saturation.',
        roleEn: 'Galvanic isolation and current scaling for protection relays 50/51/87 with high saturation knee-point voltage.',
        symbol: 'TC1',
        standard: 'CEI 61869-2',
        imgUrl: '/assets/ecosystem/power-substation-ecosystem.jpg',
        calcTab: 'ct-sizing'
      },
      {
        id: 'eq-exp-vt-225k',
        nameFr: 'Transformateur de Tension Inductif / Capacitif (TT / CCVT 225 kV)',
        nameEn: '225 kV Inductive / Capacitive Voltage Transformer (CCVT)',
        voltage: '225 kV / √3 : 100 V / √3 • Classe 0.2 / 3P',
        roleFr: 'Mesure de tension pour le synchronisme de couplage, la mesure de puissance et les relais de distance 21.',
        roleEn: 'Bus voltage sensing for synchrocheck, energy revenue metering, and distance 21 relay impedance zones.',
        symbol: 'TT1',
        standard: 'CEI 61869-3 / CEI 61869-5',
        imgUrl: '/images/homepage_uploads/batch_02_image_007.jpg',
        calcTab: 'voltage-drop'
      },
      {
        id: 'eq-exp-surge-arrester-225kv',
        nameFr: 'Parafoudre à Oxyde de Zinc ZnO (Ur = 198 kV)',
        nameEn: 'Zinc Oxide (ZnO) Metal-Oxide Surge Arrester',
        voltage: 'Ur = 198 kV • Classe 4 • In = 10 kA crête',
        roleFr: 'Protection du matériel contre les surtensions d\'origine atmosphérique (foudre) et de manœuvre pour préserver l\'isolement des transformateurs.',
        roleEn: 'High-energy clipping of lightning and switching surges to protect transformer winding insulation (BIL 1050 kV).',
        symbol: 'F1',
        standard: 'CEI 60099-4',
        imgUrl: '/images/homepage_uploads/batch_05_image_022.jpg',
        calcTab: 'surge-arrester'
      },
      {
        id: 'eq-exp-discon-earth-225k',
        nameFr: 'Sectionneur d\'Aiguillage & Sectionneur de Terre Motorisé 225 kV',
        nameEn: 'Motorized Bus Selector Disconnector & Earth Switch',
        voltage: '245 kV Assigné • 2500 A • Icc = 40 kA / 1 s',
        roleFr: 'Aiguillage des départs entre jeux de barres sans coupure de charge et mise à la terre franche pour sécurité des interventions.',
        roleEn: 'On-load bus transfer switching and locked safety earth closure for de-energized bay maintenance clearance.',
        symbol: 'Q1/Q8',
        standard: 'CEI 62271-102',
        imgUrl: '/images/homepage_uploads/batch_07_image_031_hydro_turbine_hall.jpg',
        calcTab: 'cable-short-circuit'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Études de Réseau, Bilan de Puissance & Court-Circuit (CEI 60909)',
        titleEn: 'Grid Studies, Power Balance & Short-Circuit Calculations',
        descFr: 'Détermination du courant de court-circuit maximal présumé (Icc" = 40 kA), calcul du pouvoir de coupure requis des disjoncteurs et choix du schéma unifilaire de poste.',
        descEn: 'Determination of maximum prospective fault current (Icc" = 40 kA), circuit breaker breaking capacity sizing, and busbar configuration selection.'
      },
      {
        phase: '02',
        titleFr: 'Arbitrage Technologique AIS vs GIS & Implantation Générale',
        titleEn: 'AIS vs GIS Techno-Economic Trade-Off & General Layout',
        descFr: 'Arbitrage foncier et environnemental (poste ouvert AIS à emprise standard vs poste blindé GIS compact urbain), distances d\'isolement dans l\'air et voiries lourdes pour transformateurs.',
        descEn: 'Land and environmental trade-off (outdoor AIS vs compact urban GIS), air clearances, and heavy-haul access roads for transformer delivery.'
      },
      {
        phase: '03',
        titleFr: 'Dimensionnement de la Grille de Terre & Sécurité des Personnes (IEEE 80)',
        titleEn: 'Earthing Mesh Sizing & Personnel Safety Design (IEEE Std 80)',
        descFr: 'Mesure de la résistivité du sol par méthode de Wenner, calcul de la section des conducteurs de terre en cuivre nu (120 mm²), et vérification des tensions limites de pas et de toucher.',
        descEn: 'Wenner 4-pin soil resistivity profiling, bare copper ground mesh sizing (120 mm²), and step/touch voltage safety calculations with gravel surface layer.'
      },
      {
        phase: '04',
        titleFr: 'Essais de Réception en Usine (FAT - Factory Acceptance Tests)',
        titleEn: 'Factory Acceptance Testing (FAT)',
        descFr: 'Mesure des pertes à vide P0 et en charge Pk des transformateurs, essais diélectriques aux chocs de foudre (BIL), étanchéité gaz SF6 et vérification fonctionnelle des armoires BCU.',
        descEn: 'Transformer no-load P0 and load Pk loss testing, lightning impulse dielectric tests (BIL), SF6 leakage rate measurement, and BCU cubicle factory checks.'
      },
      {
        phase: '05',
        titleFr: 'Génie Civil, Bacs de Rétention d\'Huile & Montage Appareillage',
        titleEn: 'Civil Works, Oil Retention Bunds & Switchgear Erection',
        descFr: 'Coulage des massifs fondations, bacs de rétention avec extincteur à caillebotis pour huile transformateur (norme NF C 17-300), érection des charpentes et pose des disjoncteurs.',
        descEn: 'Reinforced concrete foundation casting, oil containment bunds with fire-quenching gravel grating, steel gantry erection, and breaker rigging.'
      },
      {
        phase: '06',
        titleFr: 'Commissioning sur Site (SAT - Site Acceptance Tests) & Injections',
        titleEn: 'Site Acceptance Testing (SAT) & Relay Current Injection',
        descFr: 'Injections primaires et secondaires de courant sur les relais de protection (50/51, 87T, 21), vérification des verrouillages mécaniques/électriques et mise sous tension progressive.',
        descEn: 'Primary and secondary current injection across protection relays (50/51, 87T, 21), interlock logic verification, and progressive initial energization.'
      },
      {
        phase: '07',
        titleFr: 'Exploitation Continue, Surveillance des Gaz Dissous (DGA) & Thermographie',
        titleEn: 'Operations & Maintenance, Dissolved Gas Analysis (DGA) & IR Thermography',
        descFr: 'Prélèvements périodiques d\'huile pour chromatographie DGA (Triangle de Duval), inspection thermographique infrarouge des connexions sous charge et procédures de consignation LOTO.',
        descEn: 'Periodic oil sampling for Dissolved Gas Analysis (Duval triangle), live infrared thermography of busbar joints, and strict lockout-tagout (LOTO) clearances.'
      }
    ],
    sectionE: [
      {
        id: 'short_circuit_iec60909',
        tabLabelFr: 'Court-Circuit Triphasé Ik3',
        tabLabelEn: '3-Phase Short Circuit Ik3',
        titleFr: 'Courant de Court-Circuit Triphasé Symétrique Initial selon CEI 60909-0',
        titleEn: 'Initial Symmetrical 3-Phase Short-Circuit Current per IEC 60909-0',
        descFr: 'Détermine le pouvoir de coupure assigné minimal des disjoncteurs HTB (Icu/Ics) et la contrainte électrodynamique crête ip sur les charpentes de poste.',
        descEn: 'Determines the minimum required breaking capacity for substation circuit breakers and peak electrodynamic stress ip on support structures.',
        formula: 'I_k^{\\prime\\prime} = \\frac{c \\cdot U_n}{\\sqrt{3} \\cdot Z_k} \\quad ; \\quad i_p = \\kappa \\cdot \\sqrt{2} \\cdot I_k^{\\prime\\prime}',
        formulaDescFr: 'Avec c = 1.10 en haute tension HTB, Un tension nominale entre phases (225 kV), Zk = √(Rk² + Xk²) impédance équivalente de court-circuit, et κ facteur de crête (1.80 à 2.0).',
        formulaDescEn: 'With c = 1.10 for HV networks, Un nominal line-to-line voltage (225 kV), Zk equivalent Thevenin impedance, and κ peak making factor (1.80 to 2.0).',
        assumptionsFr: [
          'Court-circuit franc triphasé sans impédance d\'arc au point de raccordement.',
          'Facteur de tension c = 1.10 selon CEI 60909-0.',
          'Alimentation par réseau de grande puissance avec rapport X/R > 10.'
        ],
        assumptionsEn: [
          'Bolted symmetrical three-phase fault with zero arc resistance.',
          'Voltage factor c = 1.10 per IEC 60909-0 for HV systems.',
          'Bulk generation feeding with high X/R ratio > 10.'
        ],
        calcTab: 'cable-short-circuit'
      },
      {
        id: 'transformer_sizing_losses',
        tabLabelFr: 'Transformateur Uk% & Pertes',
        tabLabelEn: 'Transformer Uk% & Losses',
        titleFr: 'Impédance de Court-Circuit (Uk%) & Courant Secondaire Isc2 (CEI 60076)',
        titleEn: 'Transformer Impedance (Uk%) & Secondary Fault Current per IEC 60076',
        descFr: 'Arbitrage entre la limitation du courant de court-circuit aval et la chute de tension interne en charge du transformateur de puissance.',
        descEn: 'Design trade-off between downstream short-circuit current containment and internal on-load voltage sag.',
        formula: 'I_{sc2} = \\frac{I_{n2}}{U_k \\% / 100} = \\frac{S_n}{\\sqrt{3} \\cdot U_{2n} \\cdot (U_k / 100)}',
        formulaDescFr: 'Pour un transformateur 63 MVA 225/30 kV avec Uk = 12.5% : In2 = 1 212 A → Isc2 = 9.7 kA rms au secondaire 30 kV.',
        formulaDescEn: 'For a 63 MVA 225/30 kV unit with Uk = 12.5%: In2 = 1,212 A → Isc2 = 9.7 kA rms at 30 kV secondary.',
        assumptionsFr: [
          'Tension primaire maintenue constante pendant le défaut.',
          'Température d\'enroulement de référence : 75°C.',
          'Régleur en charge sur prise nominale (prise 9 sur 17).'
        ],
        assumptionsEn: [
          'Infinite primary bus voltage during secondary fault duration.',
          'Reference winding temperature: 75°C.',
          'On-load tap changer on nominal center tap.'
        ],
        calcTab: 'transformer'
      },
      {
        id: 'differential_87t_slope',
        tabLabelFr: 'Différentielle 87T Double Pente',
        tabLabelEn: 'Differential 87T Dual-Slope',
        titleFr: 'Protection Différentielle Transformateur (ANSI 87T) à Double Pente',
        titleEn: 'Transformer Differential Protection (ANSI 87T) Dual-Slope Curve',
        descFr: 'Zone de déclenchement ultra-rapide (< 30 ms) comparant les courants entrants et sortants avec blocage harmonique d\'enclenchement (H2) et surfluxage (H5).',
        descEn: 'Unit protection operating in <30 ms comparing input/output currents with 2nd harmonic inrush restraint (H2) and 5th harmonic overfluxing block (H5).',
        formula: 'I_d = |\\vec{I}_1 + \\vec{I}_2| \\quad ; \\quad I_r = \\frac{|\\vec{I}_1| + |\\vec{I}_2|}{2} \\quad ; \\quad I_d > I_{s1} + K_1 \\cdot I_r',
        formulaDescFr: 'Pente 1 (K1 ≈ 30%) couvre les erreurs de prises OLTC ; Pente 2 (K2 ≈ 70%) prévient les déclenchements intempestifs sur défaut externe avec saturation de TC.',
        formulaDescEn: 'Slope 1 (K1 ≈ 30%) compensates for OLTC tap variations; Slope 2 (K2 ≈ 70%) prevents false trips on heavy through-fault CT saturation.',
        assumptionsFr: [
          'Compensation automatique d\'angle vectoriel (ex: déphasage de 30° pour couplage Dyn11).',
          'Filtrage du courant homopolaire résiduel côté étoile.',
          'Retenue harmonique 2 fixée à 15% pour immunité à l\'enclenchement.'
        ],
        assumptionsEn: [
          'Automatic vector group phase shift compensation (e.g., 30° for Dyn11).',
          'Zero-sequence current filtering on grounded wye winding.',
          '2nd harmonic inrush restraint set to 15% threshold.'
        ],
        simTab: 'differential-protection'
      },
      {
        id: 'earthing_mesh_ieee80',
        tabLabelFr: 'Grille de Terre IEEE 80',
        tabLabelEn: 'Substation Earthing Mesh (IEEE 80)',
        titleFr: 'Mise à la Terre du Poste & Tensions de Pas / Toucher selon IEEE Std 80',
        titleEn: 'Substation Grounding Grid & Step/Touch Potentials per IEEE Std 80',
        descFr: 'Garantit la sécurité des personnes en maintenant les tensions de toucher et de pas sous les seuils physiologiques de fibrillation ventriculaire en cas de défaut terre.',
        descEn: 'Ensures human safety by restricting step and touch voltages below ventricular fibrillation thresholds during ground fault clearance.',
        formula: 'E_{touch} = \\left(1000 + 1.5 \\cdot C_s \\cdot \\rho_s\\right) \\cdot \\frac{0.116}{\\sqrt{t_s}} \\quad ; \\quad R_g \\approx \\frac{\\rho}{4r} + \\frac{\\rho}{L}',
        formulaDescFr: 'Avec ρs = résistivité du gravillon de surface (3000 Ω·m), Cs facteur d\'atténuation, ts temps d\'élimination (0.5 s), et Rg résistance de terre de Sverak.',
        formulaDescEn: 'With ρs crushed rock surface layer resistivity (3000 Ω·m), Cs derating factor, ts fault clearing time (0.5 s), and Rg Sverak grid resistance.',
        assumptionsFr: [
          'Corps humain modélisé par une résistance de 1 000 Ω entre pieds et main.',
          'Couche de gravillon de surface d\'épaisseur minimale 10 à 15 cm.',
          'Durée maximale d\'élimination du défaut terre : ts = 0.5 s.'
        ],
        assumptionsEn: [
          'Human body modeled as 1,000 Ω resistance between hand and feet.',
          'Crushed rock surface layer thickness: 10 to 15 cm.',
          'Maximum earth fault clearing time: ts = 0.5 s.'
        ],
        calcTab: 'earthing'
      },
      {
        id: 'air_clearances_iec61936',
        tabLabelFr: 'Distances d\'Isolement CEI 61936',
        tabLabelEn: 'Air Clearances (IEC 61936)',
        titleFr: 'Distances Minimales d\'Isolement dans l\'Air selon CEI 61936-1 & CEI 60071',
        titleEn: 'Minimum Air Clearances & Safety Envelopes per IEC 61936-1 & IEC 60071',
        descFr: 'Fixe les distances géométriques de sécurité phase-terre N, phase-phase et garde au sol en fonction de la tension assignée et de l\'altitude du site.',
        descEn: 'Mandates minimum phase-to-earth N, phase-to-phase, and ground vehicular safety clearances corrected for site altitude.',
        formula: 'N_{alt} = N_{mer} \\cdot k_a \\quad ; \\quad k_a = e^{\\frac{m \\cdot (H - 1000)}{8150}}',
        formulaDescFr: 'En 225 kV (BIL 1050 kV) : distance phase-terre N = 2 100 mm ; phase-phase = 2 400 mm ; garde au sol pour circulation véhicules = 5 500 mm.',
        formulaDescEn: 'At 225 kV (BIL 1050 kV): phase-to-earth N = 2,100 mm; phase-to-phase = 2,400 mm; vehicular ground safety height = 5,500 mm.',
        assumptionsFr: [
          'Niveau de tenue assigné aux chocs de foudre BIL = 1050 kV crête.',
          'Correction d\'altitude obligatoire au-delà de 1 000 m (facteur ka > 1.0).',
          'Conditions atmosphériques standards : température 20°C, pression 101.3 kPa.'
        ],
        assumptionsEn: [
          'Rated lightning impulse withstand voltage BIL = 1050 kV peak.',
          'Mandatory altitude derating above 1,000 m (factor ka > 1.0).',
          'Standard reference atmosphere: 20°C temperature, 101.3 kPa barometric pressure.'
        ],
        calcTab: 'cable-ampacity'
      },
      {
        id: 'busbar_electrodynamic_iec60865',
        tabLabelFr: 'Forces de Laplace CEI 60865',
        tabLabelEn: 'Busbar Laplace Forces (IEC 60865)',
        titleFr: 'Tenue Électrodynamique des Jeux de Barres selon CEI 60865-1',
        titleEn: 'Busbar Electrodynamic Peak Force & Bending Stress per IEC 60865-1',
        descFr: 'Vérifie que les efforts répulsifs de Laplace entre conducteurs tubulaires sous courant de crête ip n\'entraînent pas de déformation plastique permanente.',
        descEn: 'Verifies that electromagnetic peak repulsive Laplace forces between tubular conductors during short-circuit do not cause mechanical failure.',
        formula: 'F_m = \\frac{\\mu_0}{2\\pi} \\cdot \\frac{i_p^2}{a} \\cdot L \\quad ; \\quad \\sigma = \\frac{F_m \\cdot L}{8 \\cdot W} \\le 0.8 \\cdot R_{p0.2}',
        formulaDescFr: 'Avec ip courant de crête (102 kA pour Icc = 40 kA), a entraxe entre barres (2.5 m), L portée entre isolateurs, et Rp0.2 limite d\'élasticité de l\'aluminium.',
        formulaDescEn: 'With ip peak current (102 kA for 40 kA rms), a phase centerline spacing (2.5 m), L support span, and Rp0.2 aluminum yield strength.',
        assumptionsFr: [
          'Courant de court-circuit triphasé symétrique avec asymétrie maximale (facteur κ = 1.80).',
          'Barres tubulaires rigides en alliage d\'aluminium 6101-T6.',
          'Contrainte maximale admissible limitée à 80% de la limite élastique Rp0.2.'
        ],
        assumptionsEn: [
          'Three-phase short-circuit with maximum DC offset (peak factor κ = 1.80).',
          'Rigid tubular busbars made of high-strength 6101-T6 aluminum alloy.',
          'Maximum permissible bending stress capped at 80% of yield strength Rp0.2.'
        ],
        calcTab: 'cable-short-circuit'
      }
    ],
    sectionF: [
      {
        code: 'CEI 61936-1',
        tag: 'CONCEPTION POSTES HTB',
        titleFr: 'Installations Électriques en Courant Alternatif Dépassant 1 kV - Prescriptions Communes',
        titleEn: 'Power Installations Exceeding 1 kV AC - Part 1: Common Rules',
        descFr: 'Norme mère pour la conception des postes HTB/HTA : distances d\'isolement dans l\'air, bacs de rétention d\'huile transfo, murs coupe-feu et clôtures de sécurité.',
        descEn: 'Master international standard for substation design: air clearances, transformer oil retention sumps, fire barriers, and safety fencing.'
      },
      {
        code: 'CEI 62271-100 / 200 / 203',
        tag: 'APPAREILLAGE HAUTE TENSION',
        titleFr: 'Appareillage Haute Tension : Disjoncteurs, Ensembles Préfabriqués & Postes Blindés SF6 (GIS)',
        titleEn: 'High-Voltage Switchgear and Controlgear: Circuit Breakers, Metal-Enclosed & GIS',
        descFr: 'Régit le pouvoir de coupure assigné, les séquences de réenclenchement O-0.3s-CO-3min-CO, la tenue à l\'arc interne IAC et l\'étanchéité sous gaz SF6.',
        descEn: 'Governs rated breaking capacity, standard duty cycles, internal arc classification (IAC), and SF6 gas tightness.'
      },
      {
        code: 'CEI 60076 (Séries 1 à 5)',
        tag: 'TRANSFORMATEURS DE PUISSANCE',
        titleFr: 'Transformateurs de Puissance : Échauffements, Niveaux d\'Isolement & Tenue au Court-Circuit',
        titleEn: 'Power Transformers: Temperature Rise, Insulation Levels & Ability to Withstand Short Circuit',
        descFr: 'Définit les limites thermiques d\'enroulement (65 K), les essais de tenue diélectrique, l\'impédance de court-circuit Uk% et les régleurs en charge (OLTC).',
        descEn: 'Defines winding temperature rises (65 K), dielectric impulse withstand, short-circuit impedance, and on-load tap changers.'
      },
      {
        code: 'IEEE Std 80-2013',
        tag: 'SÉCURITÉ MISE À LA TERRE',
        titleFr: 'Guide IEEE pour la Sécurité de la Mise à la Terre dans les Postes Électriques en Courant Alternatif',
        titleEn: 'IEEE Guide for Safety in AC Substation Grounding',
        descFr: 'Référence mondiale régissant le dimensionnement des mailles de terre en cuivre, l\'élévation de potentiel de terre (GPR) et les tensions de pas et toucher tolérables.',
        descEn: 'Global benchmark for copper grid mesh sizing, ground potential rise (GPR), and tolerable step/touch voltage safety limits.'
      },
      {
        code: 'CEI 61850 (Séries 1 à 10)',
        tag: 'POSTE NUMÉRIQUE & SAS',
        titleFr: 'Réseaux & Systèmes de Communication pour l\'Automatisation des Postes Électriques',
        titleEn: 'Communication Networks and Systems for Power Utility Automation',
        descFr: 'Architecture du poste numérique : bus de station (MMS), bus de process (Sampled Values 9-2LE), téléprotection ultra-rapide par messages GOOSE (< 4 ms).',
        descEn: 'Digital substation architecture: station bus (MMS), process bus (Sampled Values), and ultra-fast peer-to-peer GOOSE protection signaling.'
      },
      {
        code: 'CODE DE RÉSEAU SONATREL §5',
        tag: 'RÉGULATION NATIONALE CAMEROUN',
        titleFr: 'Prescriptions Techniques de Conception & d\'Exploitation des Postes de Raccordement 225 kV / 90 kV',
        titleEn: 'Technical Design & Operation Rules for Cameroon 225 kV / 90 kV Connection Substations',
        descFr: 'Fixe les schémas unifilaires minimaux admissibles (double jeu de barres obligatoire en 225 kV), le temps d\'élimination des défauts (≤ 80 ms) et la télésurveillance SCADA.',
        descEn: 'Mandates minimum substation topologies (double busbar mandatory at 225 kV), maximum fault clearing times (≤ 80 ms), and SCADA telemetry.'
      }
    ]
  },

  // D05: Réseaux de Distribution HTA (15 kV / 30 kV) & Postes HTA/BT
  D05: {
    domainCode: 'D05',
    sectionA: {
      roleFr: "Acheminement, régulation et distribution finale de l'énergie électrique en moyenne tension (HTA 15 kV / 30 kV) depuis les postes sources HTB/HTA vers les postes de transformation HTA/BT, les colonnes montantes et les usagers industriels, tertiaires et résidentiels.",
      roleEn: 'Transmission, regulation, and final delivery of medium-voltage electric power (15 kV / 30 kV MV) from primary grid substations to secondary MV/LV distribution transformers and end consumers.',
      inputsFr: {
        title: 'Postes Sources HTB/HTA (225/30 kV, 90/30 kV, 90/15 kV)',
        desc: 'Jeux de barres HTA des postes de répartition SONATREL/ENEO avec disjoncteurs sous vide ou SF6 et régleurs en charge (OLTC).',
        voltage: '30 kV (standard national RIS/RIN Cameroun) ou 15 kV HTA'
      },
      inputsEn: {
        title: 'Primary Grid Substations (225/30 kV, 90/30 kV, 90/15 kV)',
        desc: 'MV switchgear busbars at transmission step-down substations equipped with vacuum/SF6 circuit breakers and On-Load Tap Changers (OLTC).',
        voltage: '30 kV (Cameroon national standard) or 15 kV MV'
      },
      processFr: {
        title: 'Artères HTA, Conduite Télécommandée (FLISR) & Postes HTA/BT',
        desc: 'Réseaux maillés exploités en boucle ouverte, artères souterraines en câble PRC 3x240 mm² Al et lignes aériennes almélec 148 mm², sectionnement télécommandé par interrupteurs aériens (IACM/IAT) et disjoncteurs réenclencheurs de poteau (ACR), abaissement vers 400 V / 230 V via transformateurs Dyn11.',
        note: 'Régulation de tension à ±5% sous pointe; transformateurs 50 kVA à 1 600 kVA'
      },
      processEn: {
        title: 'MV Feeders, Automated FLISR & Distribution Transformers',
        desc: 'Meshed grids operated as open rings, underground XLPE 3x240 mm² cables, overhead Aster 148 mm² lines, automated sectionalizing via pole-mounted Auto-Reclosers (ACR), Fault Passage Indicators (FPI), and Dyn11 step-down transformers.',
        note: 'Voltage regulation within ±5% statutory limits; transformers 50 kVA to 1,600 kVA'
      },
      outputsFr: {
        title: 'Postes de Livraison HTA & Réseau BT 400 V / 230 V',
        desc: 'Alimentation des postes de livraison abonnés HTA (NF C 13-100), départs Basse Tension vers les armoires de distribution TUR/TIPI, colonnes montantes et comptages intelligents d\'abonnés.',
        earthing: 'Régime de neutre HTA : Neutre à la terre par résistance (RPN / NGR 40 A ou 150 A, 10 s); Régime BT : Schéma TT ou TN-S'
      },
      outputsEn: {
        title: 'Secondary Substation Terminals & 400 V / 230 V LV Networks',
        desc: 'Supply to dedicated MV industrial consumers (NF C 13-100), low-voltage distribution kiosks (TUR/TIPI boards), consumer service mains, and smart revenue meters.',
        earthing: 'MV Neutral: Resistor-grounded neutral (NGR 40 A or 150 A, 10 s); LV Earthing: TT scheme (utility distribution) or TN-S (industrial plants)'
      }
    },
    sectionB: {
      summaryFr: 'Architectures en boucle ouverte (coupure d\'artère RMU), départs radiaux ruraux protégés par réenclencheurs, et double dérivation avec ATS.',
      summaryEn: 'Open-ring switchgear loops (RMU), rural overhead radial feeders with auto-reclosers, and dual radial ATS schemes.',
      architectures: [
        {
          nameFr: 'Boucle Ouverte HTA Urbaine (Coupure d\'Artère RMU)',
          nameEn: 'Urban MV Open Ring Feeder (Ring Main Unit RMU)',
          techFr: 'Cellules compactes RMU étanches sous enveloppe métallique à coupure dans le vide ou SF6, avec point de coupure normal (PCO / N.O.)',
          techEn: 'Gas-tight compact RMU switchgear in SF6 or dry air with normally open sectionalizing tie-switch (N.O.)',
          descFr: 'Architecture reine des réseaux urbains (Douala, Yaoundé). Les postes HTA/BT sont branchés en coupure d\'artère sur deux demi-boucles issues du même poste source ou de deux postes sources distincts. En cas de défaut de câble, le tronçon défaillant est isolé et les clients sains réalimentés en moins de 15 minutes.',
          descEn: 'Predominant urban architecture (Douala, Yaoundé). Secondary kiosks are daisy-chained across two half-loops. In the event of a cable fault, the faulty section is isolated and healthy sections re-energized within 15 minutes.',
          standard: 'CEI 62271-200 / CEI 62271-1',
          metricFr: 'Indisponibilité SAIDI divisée par 4 vs radial simple',
          metricEn: 'SAIDI outage duration reduced by 75% vs simple radial'
        },
        {
          nameFr: 'Départ Radial Aérien Protégé par Réenclencheur (ACR 30 kV)',
          nameEn: 'Rural Long Radial Feeder with Automatic Circuit Recloser (ACR)',
          techFr: 'Ligne aérienne almélec (Aster 54.6 / 148 mm²) protégée par disjoncteurs réenclencheurs automatiques sous vide montés sur poteau avec coffret ANSI 50/51/50N/51N/79',
          techEn: 'Overhead AAAC line protected by pole-mounted vacuum auto-reclosers with digital protection controller (ANSI 50/51/50N/51N/79)',
          descFr: 'Indispensable pour les longues artères rurales et périurbaines (ex. Obala, Bafia, Mbalmayo) soumises à la végétation dense et aux foudroiements tropicaux. Le réenclencheur exécute un cycle de déclenchements ultra-rapides pour éliminer les défauts transitoires sans couper l\'ensemble du réseau amont.',
          descEn: 'Vital for extended rural corridors exposed to dense vegetation and tropical lightning strikes. The ACR executes fast-trip and time-delayed reclose cycles to eliminate transient faults without tripping the primary feeder breaker.',
          standard: 'CEI 62271-111 / IEEE C37.60',
          metricFr: 'Élimine 80% à 85% des pannes fugitives; cycle O-0.3s-CO-2s-CO',
          metricEn: 'Clears 80-85% of transient faults; cycle O-0.3s-CO-2s-CO'
        },
        {
          nameFr: 'Double Dérivation HTA avec Inverseur Automatique de Source (ATS)',
          nameEn: 'Dual Radial MV Feeders with Automatic Transfer Switch (ATS)',
          techFr: 'Deux arrivées HTA indépendantes ("Voie Normale" et "Voie Secours") avec verrouillage mécanique et électrique et automate de basculement ultra-rapide',
          techEn: 'Two independent MV feeder arrivals ("Normal" and "Emergency") with mechanical/electrical interlocks and automatic microgrid transfer controller',
          descFr: 'Conçu pour les usagers à continuité de service critique (centres hospitaliers, installations industrielles stratégiques, aéroports, data centers). Lors d\'une disparition de tension sur la voie normale, l\'automate vérifie l\'absence de court-circuit aval et bascule sur la voie secours en moins de 1,5 seconde.',
          descEn: 'Engineered for mission-critical facilities (hospitals, major industrial plants, airports, tier-3/4 data centers). Upon voltage loss on the primary arrival, the ATS verifies downstream bus health and executes automatic transfer to the reserve feeder in < 1.5 seconds.',
          standard: 'NF C 13-100 / CEI 62271-200',
          metricFr: 'Temps de transfert automatique < 1.5 s; redondance N-1 totale',
          metricEn: 'Automatic transfer time < 1.5 s; full local N-1 redundancy'
        },
        {
          nameFr: 'Poste Aérien sur Poteau H61 (50 kVA à 160 kVA)',
          nameEn: 'Pole-Mounted Distribution Transformer Substation H61',
          techFr: 'Transformateur immergé dans l\'huile minérale étanche (ONAN), coupe-circuit à fusibles HTA d\'éjection (cut-outs), parafoudres à oxyde de zinc (ZnO 30 kV) et disjoncteur BT haut de poteau (DHP)',
          techEn: 'Hermetically sealed oil-immersed transformer (ONAN), expulsion fuse cut-outs, 30 kV ZnO surge arresters, and pole-top low-voltage circuit breaker (DHP)',
          descFr: 'Standard d\'électrification rurale et semi-urbaine pour les villages et zones dispersées. Fixé directement sur support en béton armé ou bois, il transforme le 30 kV directement en 400 V triphasé / 230 V monophasé avec un investissement d\'infrastructure minimal et une grande résilience aux surtensions atmosphériques.',
          descEn: 'The workhorse of rural electrification across villages and suburban perimeters. Mounted directly onto concrete or treated wooden poles, it steps down 30 kV to 400/230 V with low capital expenditure and high lightning surge withstand.',
          standard: 'CEI 60076 / NF C 13-103',
          metricFr: 'Puissances normalisées : 50, 100, 160 kVA; Uk = 4%',
          metricEn: 'Standard ratings: 50, 100, 160 kVA; Uk = 4%'
        },
        {
          nameFr: 'Poste Préfabriqué Compact en Kiosque Béton (250 kVA à 1 000 kVA)',
          nameEn: 'Pad-Mounted Precast Concrete Kiosk Substation (250 to 1,000 kVA)',
          techFr: 'Enveloppe monobloc en béton armé vibré intégrant un tableau compact RMU 24/36 kV, un transformateur étanche ou sec enrobé (Dyn11) et un tableau de distribution BT type TUR (4 à 8 départs)',
          techEn: 'Monolithic precast reinforced concrete enclosure housing a 24/36 kV RMU, hermetically sealed or cast-resin transformer (Dyn11), and a low-voltage TUR distribution board (4 to 8 feeders)',
          descFr: 'Solution moderne pour les centres urbains denses, lotissements résidentiels et centres commerciaux. Conforme à la qualification arc interne IAC-AB 20 kA 1s, il garantit la sécurité totale des passants et des techniciens d\'exploitation avec un niveau acoustique inférieur à 48 dB.',
          descEn: 'Modern standard for dense city centers, residential subdivisions, and shopping malls. Fully qualified for internal arc classification IAC-AB 20 kA 1s, providing comprehensive public and operator safety with acoustic noise below 48 dB.',
          standard: 'CEI 62271-202 / CEI 61439-2',
          metricFr: 'Emprise au sol < 6 m²; tenue à l\'arc interne IAC-AB 20 kA 1s',
          metricEn: 'Footprint < 6 m²; internal arc classification IAC-AB 20 kA 1s'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-cell-mv-30k',
        nameFr: 'Cellule Modulaire HTA 30 kV (SM6 / Ringmaster)',
        nameEn: 'Modular MV Switchgear 30 kV (Ringmaster)',
        voltage: '30 kV (Um 36 kV) • 630 A • 16 kA 1s',
        roleFr: 'Interrupteur-sectionneur et protection départ de boucle urbaine HTA avec compartimentage LSC2A / LSC2B et coupure dans le vide ou SF6.',
        roleEn: 'Load-break switch and circuit breaker cubicle for MV urban loops with LSC2A/LSC2B compartmentalization and vacuum/SF6 interruption.',
        symbol: 'RMU-30',
        standard: 'CEI 62271-200',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'cable-short-circuit'
      },
      {
        id: 'eq-exp-kiosk-30kv-400v',
        nameFr: 'Transformateur HTA/BT Kiosque Béton (630 kVA Dyn11)',
        nameEn: 'MV/LV Distribution Substation Transformer (630 kVA Dyn11)',
        voltage: '30 kV / 400 V • 630 kVA • Dyn11',
        roleFr: 'Abaissement final 30 kV vers 400 V / 230 V, diélectrique huile minérale étanche ou résine sèche, pertes réduites EcoDesign Tier 2.',
        roleEn: 'Secondary distribution transformer stepping 30 kV down to 400 V / 230 V, hermetically sealed mineral oil or cast resin, EcoDesign Tier 2 losses.',
        symbol: 'TR-630kVA',
        standard: 'CEI 60076 / CEI 62271-202',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        calcTab: 'transformer'
      },
      {
        id: 'eq-recloser-30k',
        nameFr: 'Disjoncteur Réenclencheur Aérien de Poteau (ACR 30 kV)',
        nameEn: 'Pole-Mounted Automatic Vacuum Circuit Recloser (ACR 30 kV)',
        voltage: '30 kV (Um 38 kV) • 630 A • 12.5 kA',
        roleFr: 'Appareillage de coupure sous vide monté sur poteau pour éliminer les défauts fugitifs sur les longues lignes aériennes rurales et automatiser la réalimentation.',
        roleEn: 'Pole-mounted vacuum circuit breaker engineered to clear transient faults on rural overhead lines and execute autonomous restoration cycles.',
        symbol: 'ACR-79',
        standard: 'CEI 62271-111 / IEEE C37.60',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        calcTab: 'relay-tcc'
      },
      {
        id: 'eq-pole-trafo-h61',
        nameFr: 'Poste de Transformation Aérien sur Poteau H61 (100 kVA)',
        nameEn: 'Pole-Mounted Rural Distribution Transformer H61 (100 kVA)',
        voltage: '30 kV / 400 V • 100 kVA • Dyn11',
        roleFr: 'Transformateur abaisseur rural compact suspendu sur poteau béton, protégé par coupe-circuit fusibles à expulsion et parafoudres ZnO 30 kV.',
        roleEn: 'Pole-mounted rural distribution transformer, protected by expulsion fuse cutouts and 30 kV ZnO lightning surge arresters.',
        symbol: 'H61-100',
        standard: 'CEI 60076 / NF C 13-103',
        imgUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        calcTab: 'transformer'
      },
      {
        id: 'eq-fpi-indicator',
        nameFr: 'Détecteur de Passage de Défaut Communicant (DPD / FPI)',
        nameEn: 'Communicating Fault Passage Indicator (FPI / DPD)',
        voltage: 'HTA 15–36 kV • Tores ouvrants • 4G/DNP3',
        roleFr: 'Capteur autonome de détection des courants de court-circuit de phase et de défaut à la terre homopolaire avec signalisation lumineuse et télétransmission SCADA.',
        roleEn: 'Autonomous phase and earth-fault sensor with directional fault flagging, high-visibility LED beacons, and cellular SCADA telemetry.',
        symbol: 'FPI-DPD',
        standard: 'CEI 61850-7-420',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        calcTab: 'relay-tcc'
      },
      {
        id: 'eq-ngr-neutral',
        nameFr: 'Résistance de Neutre HTA au Poste Source (RPN / NGR 30 kV)',
        nameEn: '30 kV Neutral Grounding Resistor (NGR / RPN)',
        voltage: '30 kV / √3 • 40 A à 150 A • 10 s',
        roleFr: 'Résistance en acier inox insérée entre le neutre du transformateur HTB/HTA et la terre pour limiter le courant de court-circuit monophasé et les surtensions transitoires.',
        roleEn: 'Stainless steel neutral grounding resistor inserted between primary transformer neutral and earth to limit single-phase ground fault currents.',
        symbol: 'NGR-RPN',
        standard: 'IEEE Std 32 / CEI 60076-16',
        imgUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
        calcTab: 'neutral-grounding'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Bilan de Puissance, Foisonnement & Prévision de Demande HTA',
        titleEn: 'Load Schedule, Coincidence Factor & MV Demand Forecasting',
        descFr: 'Agrégation des puissances installées, calcul des coefficients d\'utilisation (ku) et de foisonnement spatial (ks), et modélisation de la croissance de la charge à horizon 10 ans.',
        descEn: 'Aggregation of installed loads, application of utilization (ku) and spatial coincidence (ks) factors, and 10-year demand growth projections.'
      },
      {
        phase: '02',
        titleFr: 'Choix Topologique & Dimensionnement Électrique des Artères',
        titleEn: 'Feeder Topology Selection & Conductor Thermal Sizing',
        descFr: 'Arbitrage entre boucle ouverte urbaine et départs radiaux ruraux, vérification de la chute de tension ΔU ≤ 5% et du courant admissible en régime permanent Iz selon CEI 60287.',
        descEn: 'Selection between urban open-ring loops and rural radial feeders, verification of permissible voltage drop ΔU ≤ 5%, and steady-state thermal ampacity Iz per IEC 60287.'
      },
      {
        phase: '03',
        titleFr: 'Plan de Protection & Coordination Sélective HTA',
        titleEn: 'Protection Scheme & MV Overcurrent/Earth Selective Coordination',
        descFr: 'Réglage des seuils de surintensité de phase (ANSI 50/51) et terre homopolaire (ANSI 50N/51N), coordination sélective entre disjoncteurs de départ poste source, ACR de poteau et fusibles transformateurs.',
        descEn: 'Threshold settings for phase overcurrent (ANSI 50/51) and residual earth-fault (ANSI 50N/51N), coordinating primary substation breakers, pole-mounted ACRs, and transformer fuses.'
      },
      {
        phase: '04',
        titleFr: 'Automatisation de Réseau, Détection DPD & Intégration FLISR',
        titleEn: 'Distribution Automation, FPI Sensing & FLISR Integration',
        descFr: 'Déploiement des Détecteurs de Passage de Défaut (DPD) communicants et téléconduite des interrupteurs sectionneurs motorisés pour l\'auto-cicatrisation du réseau en moins de 30 secondes.',
        descEn: 'Deployment of communicating Fault Passage Indicators (FPI) and motorized load-break switches enabling self-healing loop automation (FLISR) within 30 seconds.'
      },
      {
        phase: '05',
        titleFr: 'Génie Civil, Pose des Câbles Souterrains & Lignes Aériennes',
        titleEn: 'Civil Works, Trench Cable Laying & Overhead Line Erection',
        descFr: 'Tranchées selon NF C 13-200 avec lit de sable et grillage avertisseur rouge, déroulage des câbles PRC 3x240 mm² Al ou armement des supports en béton avec conducteurs almélec.',
        descEn: 'Trenching per NF C 13-200 with sand bedding and red warning mesh, pulling of 3x240 mm² Al XLPE cables, or erecting concrete poles with AAAC conductors.'
      },
      {
        phase: '06',
        titleFr: 'Équipement des Postes HTA/BT, Raccordements & Essais Diélectriques VLF',
        titleEn: 'Substation Outfitting, Terminations & VLF Tan-Delta Commissioning',
        descFr: 'Confection des boîtes d\'extrémité rétractables à froid, raccordement sur cellules RMU, contrôle de la rigidité diélectrique par essai VLF 0.1 Hz et mesure des prises de terre (R ≤ 10 Ω).',
        descEn: 'Assembly of cold-shrink cable terminations, RMU connections, dielectric insulation testing via 0.1 Hz VLF / Tan-Delta, and ground grid resistance testing (R ≤ 10 Ω).'
      },
      {
        phase: '07',
        titleFr: 'Mise sous Tension, Équilibrage des Phases & Suivi de Fiabilité IEEE 1366',
        titleEn: 'Energization, Phase Balancing & Reliability Performance Tracking',
        descFr: 'Vérification de la concordance de phases, équilibrage des charges monophasées pour minimiser le courant de neutre, et télémesure continue des indicateurs de coupure SAIDI et SAIFI.',
        descEn: 'Phase rotation checks, single-phase load rebalancing to minimize neutral unbalance currents, and continuous SCADA telemetry tracking SAIDI and SAIFI metrics.'
      }
    ],
    sectionE: [
      {
        id: 'mv_voltage_drop',
        tabLabelFr: 'Chute de Tension ΔU (HTA)',
        tabLabelEn: 'MV Feeder Voltage Drop (ΔU)',
        titleFr: 'Calcul de la Chute de Tension en Ligne HTA Triphasée',
        titleEn: 'Three-Phase Medium-Voltage Feeder Voltage Drop',
        descFr: 'Garantit que la tension en extrémité de ligne moyenne tension (15 kV ou 30 kV) reste strictement dans les plages contractuelles (±5% en régime normal, ±8% en secours).',
        descEn: 'Ensures medium-voltage (15 kV or 30 kV) line-end voltage stays within regulatory limits (±5% normal, ±8% contingency).',
        formula: '\\Delta U = \\frac{\\sqrt{3} \\cdot I_b \\cdot L \\cdot (R\' \\cos\\varphi + X\' \\sin\\varphi)}{1000} \\quad [\\text{V}] \\quad \\iff \\quad \\Delta u\\% = \\frac{P \\cdot R\' + Q \\cdot X\'}{U_n^2} \\cdot L \\cdot 100',
        formulaDescFr: 'Avec Ib courant de charge (A), L longueur (km), R\' résistance linéique (Ω/km à température de service), X\' réactance linéique (Ω/km), P puissance active (MW), Q puissance réactive (Mvar), Un tension nominale entre phases (kV).',
        formulaDescEn: 'Where Ib is load current (A), L is feeder length (km), R\' is linear resistance (Ω/km at operating temp), X\' is linear reactance (Ω/km), P is active power (MW), Q is reactive power (Mvar), and Un is phase-to-phase nominal voltage (kV).',
        assumptionsFr: [
          'Chute de tension maximale tolérée : 5% en bout d\'artère en régime normal, 8% en configuration secours.',
          'Résistance linéique calculée à la température maximale admissible en service continu (75°C Almélec, 90°C PRC).',
          'Réactance linéique standard : X\' ≈ 0.35 Ω/km en ligne aérienne, X\' ≈ 0.10 Ω/km en câble souterrain.'
        ],
        assumptionsEn: [
          'Maximum permissible voltage drop: 5% at feeder remote end under peak load, 8% under emergency tie-switching.',
          'Linear resistance calculated at maximum continuous operating temperature (75°C AAAC, 90°C XLPE).',
          'Standard linear reactance: X\' ≈ 0.35 Ω/km for overhead lines, X\' ≈ 0.10 Ω/km for underground XLPE cables.'
        ],
        calcTab: 'voltage-drop'
      },
      {
        id: 'ngr_ground_fault',
        tabLabelFr: 'Courant Défaut Neutre HTA (RPN)',
        tabLabelEn: 'NGR Earth Fault Current',
        titleFr: 'Limitation du Courant de Défaut à la Terre par Résistance de Point Neutre (RPN)',
        titleEn: 'Earth Fault Current Limitation via Neutral Grounding Resistor (NGR)',
        descFr: 'Dimensionnement de la résistance de neutre insérée au poste source pour limiter les courants de court-circuit homopolaires monophasés, réduire les surtensions transitoires et protéger les écrans de câbles.',
        descEn: 'Sizing of the primary substation neutral grounding resistor (NGR) to limit single-phase ground fault currents, suppress transient overvoltages, and protect cable screens.',
        formula: 'I_F = \\frac{U_n / \\sqrt{3}}{\\sqrt{R_N^2 + \\left(X_{tr} + \\frac{1}{3 \\omega C_0}\\right)^2}} \\approx \\frac{U_n}{\\sqrt{3} \\cdot R_N} \\quad [\\text{A}]',
        formulaDescFr: 'La valeur de RN est calibrée pour fixer IF à une valeur standardisé : 40 A ou 150 A (réseau ENEO/SONATREL 30 kV) pendant une durée assignée de 10 secondes.',
        formulaDescEn: 'RN is calibrated to fix IF to standardized utility ratings: 40 A or 150 A (ENEO/SONATREL 30 kV network) for a rated duration of 10 seconds.',
        assumptionsFr: [
          'Tension simple de phase U0 = 30 / √3 ≈ 17.32 kV.',
          'Résistance de neutre RN dimensionnée pour 40 A (RN = 433 Ω) ou 150 A (RN = 115 Ω).',
          'Prise en compte des capacités homopolaires de câbles C0 pour vérifier l\'absence de résonance ferromagnétique.'
        ],
        assumptionsEn: [
          'Nominal phase-to-ground voltage U0 = 30 / √3 ≈ 17.32 kV.',
          'Neutral resistor calibrated for 40 A (RN = 433 Ω) or 150 A (RN = 115 Ω).',
          'Zero-sequence cable capacitance C0 accounted for to prevent ferroresonance and transient restrikes.'
        ],
        calcTab: 'neutral-grounding'
      },
      {
        id: 'cable_adiabatic_thermal',
        tabLabelFr: 'Tenue Thermique Câble (Icc)',
        tabLabelEn: 'Cable Short-Circuit Thermal Limit',
        titleFr: 'Contrainte Thermique Adiabatique des Câbles HTA (CEI 60364-5-54 / CEI 60287)',
        titleEn: 'Adiabatic Short-Circuit Thermal Stress in MV Cables',
        descFr: 'Vérifie que la section de l\'âme conductrice et de l\'écran métallique en cuivre supporte l\'échauffement intense provoqué par le court-circuit sans dégradation irréversible de l\'isolant PRC.',
        descEn: 'Verifies that conductor core and metallic copper screen cross-sections withstand short-circuit heating without permanent degradation of XLPE insulation.',
        formula: 'S \\ge \\frac{I_{cc} \\cdot \\sqrt{t_c}}{k} \\quad [\\text{mm}^2] \\iff I_{cc,max} = \\frac{k \\cdot S}{\\sqrt{t_c}} \\quad [\\text{A}]',
        formulaDescFr: 'Où Icc est le courant de court-circuit triphasé ou monophasé maximal (A), tc est le temps de coupure de la protection (s), et k est le facteur caractéristique dépendant du métal et de l\'isolant.',
        formulaDescEn: 'Where Icc is maximum short-circuit current (A), tc is protection clearing time (s), and k is material constant depending on conductor metal and insulation temperature limits.',
        assumptionsFr: [
          'Facteur k = 143 pour âme cuivre isolée PRC (température initiale 90°C, température finale 250°C).',
          'Facteur k = 94 pour âme aluminium isolée PRC (XLPE).',
          'Pour écran métallique de cuivre : k = 212 (élastomère/PRC).'
        ],
        assumptionsEn: [
          'Constant k = 143 for copper conductor with XLPE insulation (initial 90°C, peak 250°C).',
          'Constant k = 94 for aluminum conductor with XLPE insulation.',
          'For copper tape/wire metallic screen: k = 212.'
        ],
        calcTab: 'cable-short-circuit'
      },
      {
        id: 'reliability_indices_ieee1366',
        tabLabelFr: 'Indices Fiabilité (SAIDI/SAIFI)',
        tabLabelEn: 'Reliability Indices (IEEE 1366)',
        titleFr: 'Indices Internationaux de Continuité de Fourniture selon IEEE Std 1366',
        titleEn: 'Utility Reliability Indices per IEEE Std 1366 (SAIDI & SAIFI)',
        descFr: 'Indicateurs réglementaires audités par l\'ARSEL pour évaluer la qualité de service et la continuité de fourniture de l\'énergie électrique sur le réseau de distribution.',
        descEn: 'Statutory performance indices monitored by utility regulators (ARSEL) evaluating grid continuity and customer outage duration.',
        formula: '\\text{SAIDI} = \\frac{\\sum (r_i \\cdot N_i)}{N_T} \\quad [\\text{h/client/an}], \\quad \\text{SAIFI} = \\frac{\\sum N_i}{N_T} \\quad [\\text{coupures/client/an}]',
        formulaDescFr: 'Où Ni est le nombre de clients interrompus par l\'incident i, ri la durée de rétablissement de l\'incident i (h ou min), et NT le nombre total d\'abonnés alimentés par le gestionnaire de réseau.',
        formulaDescEn: 'Where Ni is the number of interrupted customers for event i, ri is restoration duration (hours or minutes), and NT is the total number of connected customers.',
        assumptionsFr: [
          'Ne prend en compte que les coupures soutenues d\'une durée supérieure à 5 minutes (les coupures transitoires relèvent du MAIFI).',
          'Traitement des journées de catastrophes majeures (MED) selon la méthode statistique IEEE 2.5 Beta.',
          'Objectifs contractuels ENEO : réduction annuelle ciblée du SAIDI urbain et péri-urbain.'
        ],
        assumptionsEn: [
          'Considers sustained interruptions lasting longer than 5 minutes (momentary outages evaluated under MAIFI).',
          'Major Event Days (MED) classified using IEEE Std 1366 2.5 Beta statistical threshold.',
          'Utility performance targets: progressive reduction of urban and suburban SAIDI.'
        ],
        calcTab: 'power'
      },
      {
        id: 'trafo_inrush_grading',
        tabLabelFr: 'Courant d\'Enclenchement (Inrush)',
        tabLabelEn: 'Transformer Inrush Grading',
        titleFr: 'Courant d\'Enclenchement Magnétique et Sélectivité des Fusibles HTA',
        titleEn: 'Magnetizing Inrush Current & MV Transformer Fuse Grading',
        descFr: 'Modélisation du pic transitoire de magnétisation à la mise sous tension à vide des transformateurs HTA/BT, indispensable pour éviter tout déclenchement intempestif des fusibles ou relais.',
        descEn: 'Modeling transient magnetizing current spikes during no-load energization of MV/LV transformers, preventing false tripping of primary fuses or protection relays.',
        formula: 'I_{\\text{inrush}}(t) \\approx k_{\\text{inr}} \\cdot I_n \\cdot e^{-t / \\tau} \\quad \\text{avec} \\quad I_{\\text{inrush}}(100\\,\\text{ms}) \\approx (10 \\text{ à } 14) \\cdot I_n',
        formulaDescFr: 'Le point caractéristique d\'enclenchement retenu pour la coordination de protection est I = 10 à 12 In pendant une durée de 100 ms.',
        formulaDescEn: 'The canonical inrush coordination point for protective device grading is I = 10 to 12 In for 100 ms.',
        assumptionsFr: [
          'Enclenchement au passage à zéro de l\'onde de tension avec rémanence magnétique maximale dans le circuit magnétique.',
          'Constante de temps d\'amortissement τ ≈ 30 ms à 100 ms pour transformateurs de distribution 50 kVA à 1 000 kVA.',
          'Règle de sélectivité : la courbe temps-courant de pré-arc du fusible HTA doit passer impérativement au-dessus du point (100 ms, 12 In).'
        ],
        assumptionsEn: [
          'Energization at voltage zero crossing with peak remnant magnetic flux in core.',
          'Aperiodic damping time constant τ ≈ 30 ms to 100 ms for distribution transformers 50 kVA to 1,000 kVA.',
          'Grading criterion: the fuse pre-arcing time-current curve must lie strictly above the (100 ms, 12 In) operating point.'
        ],
        calcTab: 'transformer'
      },
      {
        id: 'flisr_reclosing_cycle',
        tabLabelFr: 'Cycle ACR & Automatisation FLISR',
        tabLabelEn: 'ACR Cycle & FLISR Automation',
        titleFr: 'Coordination Chronométrique ACR & Auto-Cicatrisation FLISR',
        titleEn: 'ACR Reclosing Coordination & FLISR Loop Reconfiguration',
        descFr: 'Automatisation de boucle HTA permettant la localisation immédiate du tronçon défaillant, son isolement par télécommande et la réalimentation automatique des clients sains.',
        descEn: 'Distribution self-healing loop automation providing rapid fault location, motorized sectionalizing, and automated restoration of un-faulted segments.',
        formula: 't_{\\text{reprise}} = t_{\\text{détection DPD}} + t_{\\text{ouverture PCO}} + t_{\\text{fermeture tie}} \\le 30\\,\\text{s} \\quad \\text{vs} \\quad t_{\\text{manuel}} \\ge 90\\,\\text{min}',
        formulaDescFr: 'L\'automate de boucle centralisé ou distribué reconfigure le réseau en moins de 30 secondes, transformant une coupure longue en micro-coupure transitoire.',
        formulaDescEn: 'Centralized or distributed FLISR automation reconfigures the network within 30 seconds, turning potentially multi-hour outages into brief momentary transfers.',
        assumptionsFr: [
          'Cycle réenclencheur ACR standard : O - 0.3s - CO - 2s - CO - 30s - CO puis verrouillage définitif (lockout).',
          'Localisation automatique du tronçon défaillant par discrimination de passage de courant de court-circuit via DPD communicants.',
          'Verrouillage automatique de fermeture si présence confirmée de court-circuit sur le jeu de barres aval.'
        ],
        assumptionsEn: [
          'Standard ACR multishot reclosing sequence: O - 0.3s - CO - 2s - CO - 30s - CO followed by final lockout on permanent faults.',
          'Automated faulted section localization via directional short-circuit flags from cellular FPI units.',
          'Close interlocking verified to prevent re-energizing confirmed permanent bus faults.'
        ],
        calcTab: 'relay-tcc'
      }
    ],
    sectionF: [
      {
        code: 'CEI 62271-200',
        tag: 'APPAREILLAGE HTA',
        titleFr: 'Appareillage sous enveloppe métallique pour courant alternatif (1 kV à 52 kV)',
        titleEn: 'AC Metal-Enclosed Switchgear and Controlgear for Rated Voltages Above 1 kV and Up to 52 kV',
        descFr: 'Spécifications de sécurité des cellules compactes RMU, règles de compartimentage LSC2A/LSC2B et qualification de tenue à l\'arc interne IAC A-FLR.',
        descEn: 'Safety and functional requirements for compact RMU switchgear, LSC2A/LSC2B service continuity classifications, and internal arc qualification IAC A-FLR.'
      },
      {
        code: 'CEI 62271-111 / IEEE C37.60',
        tag: 'RÉENCLENCHEURS',
        titleFr: 'Disjoncteurs et réenclencheurs automatiques sur circuit aérien pour réseaux de distribution',
        titleEn: 'Automatic Circuit Reclosers and Fault Interrupters for AC Systems Up to 38 kV',
        descFr: 'Norme de conception des disjoncteurs réenclencheurs de poteau (ACR), séquences d\'essais sous vide et coordination avec les fusibles de dérivation.',
        descEn: 'Design, ratings, and testing standard for pole-mounted automatic circuit reclosers (ACR), vacuum interrupter endurance, and coordination with branch fuses.'
      },
      {
        code: 'NF C 13-100 / NF C 13-200',
        tag: 'POSTES DE LIVRAISON',
        titleFr: 'Postes de livraison HTA raccordés au réseau de distribution / Installations électriques HTA',
        titleEn: 'Medium-Voltage Delivery Substations & High-Voltage Electrical Installations',
        descFr: 'Prescriptions techniques d\'installation des postes HTA à comptage basse ou haute tension, verrouillages de sécurité et règles de mise à la terre.',
        descEn: 'Technical specifications for utility customer MV delivery substations with LV or HV metering, mechanical interlocks, and grounding earthing grids.'
      },
      {
        code: 'IEEE Std 1366',
        tag: 'FIABILITÉ RÉSEAUX',
        titleFr: 'Guide IEEE pour les indices de fiabilité des réseaux de distribution électrique',
        titleEn: 'IEEE Guide for Electric Power Distribution Reliability Indices',
        descFr: 'Standard international de référence définissant les méthodes de calcul des indices SAIDI, SAIFI, CAIDI, CEMI et le filtrage statistique des événements météorologiques extrêmes (MED).',
        descEn: 'International benchmark defining formulas and tracking methodologies for SAIDI, SAIFI, CAIDI, CEMI, and statistical 2.5-Beta Major Event Day filtering.'
      },
      {
        code: 'CEI 60076-1 / CEI 62271-202',
        tag: 'POSTES COMPACTS HTA/BT',
        titleFr: 'Transformateurs de puissance / Postes préfabriqués compacts sous enveloppe (Kiosques)',
        titleEn: 'Power Transformers / High-Voltage/Low-Voltage Prefabricated Substation Kiosks',
        descFr: 'Règles de construction des transformateurs étanches à diélectrique liquide ou sec, et des postes préfabriqués en béton armé monobloc avec ventilation naturelle.',
        descEn: 'Standards for hermetically sealed liquid-immersed and dry-type distribution transformers, and factory-assembled concrete pad-mounted secondary substations.'
      },
      {
        code: 'Code de Réseau ENEO / ARSEL',
        tag: 'RÉGULATION NATIONALE',
        titleFr: 'Règles Techniques de Raccordement et d\'Exploitation du Réseau de Distribution MT Cameroun',
        titleEn: 'Technical Connection and Operating Code for the Cameroon MV Distribution Grid',
        descFr: 'Prescriptions d\'exploitation du réseau 30 kV et 15 kV au Cameroun : seuils de chute de tension admissibles (±5%), régime de neutre à la terre par résistance (40 A / 150 A), et sélectivité amont-aval.',
        descEn: 'Operating regulations for the 30 kV and 15 kV networks in Cameroon: statutory voltage limits (±5%), resistor-grounded neutral schemes (40 A / 150 A), and upstream protection selectivity.'
      }
    ]
  },

  // D02: Planification & Architecture des Réseaux
  D02: {
    domainCode: 'D02',
    sectionA: {
      roleFr: "Planification stratégique, modélisation nodale globale [Ybus], calculs d'écoulement de charge (AC Load Flow Newton-Raphson), optimisation économique du dispatch (Security-Constrained Economic Dispatch) et vérification déterministe du critère de sécurité N-1 selon les normes CEI et le Code de Réseau SONATREL.",
      roleEn: 'Strategic grid planning, global nodal admittance modeling [Ybus], AC Newton-Raphson power flow calculations, Security-Constrained Economic Dispatch (SCED), and deterministic N-1 contingency security assessment per IEC standards and the SONATREL Grid Code.',
      inputsFr: {
        title: 'Bilan d\'Offre & Courbes de Charge Prévisionnelles',
        desc: 'Parcs de production hydraulique (Song Loulou, Nachtigal, Memve\'ele) et thermique, courbes de charge horaires, prévisions de pointe industrielle/urbaine et matrice des admittances de branches [Ybus].',
        voltage: 'Réseaux THT/HTB 400 kV, 225 kV & 90 kV'
      },
      inputsEn: {
        title: 'Generation Fleet & Load Profiles',
        desc: 'Hydro generation fleet (Song Loulou, Nachtigal, Memve\'ele) and thermal plants, hourly load curves, urban/industrial peak forecasts, and branch admittance matrix [Ybus].',
        voltage: '400 kV, 225 kV & 90 kV EHV/HV Networks'
      },
      processFr: {
        title: 'Résolution des Équations Nodales & Stabilité Multi-Critères',
        desc: 'Résolution itérative du système non linéaire de Newton-Raphson par matrice jacobienne [J]. Calcul simultané des modules et phases des tensions (|V|, θ), transits de puissance (P, Q), pertes joule, et vérification des marges de stabilité dynamique rotorique et de tension.',
        note: 'Critères de sécurité : Zéro surcharge thermique en régime permanent N et N-1 ; tension maintenue dans la plage 0.90 – 1.05 Un'
      },
      processEn: {
        title: 'Nodal Power Flow & Multi-Criteria Stability Solving',
        desc: 'Iterative solving of the non-linear Newton-Raphson system via Jacobian matrix [J]. Simultaneous computation of voltage magnitudes and angles (|V|, θ), branch flows (P, Q), transmission losses, and dynamic rotor/voltage stability margins.',
        note: 'Security criteria: Zero thermal overloading under base N and N-1 contingencies; bus voltages maintained strictly within 0.90 – 1.05 Un'
      },
      outputsFr: {
        title: 'Plan de Tension, Schéma Directeur d\'Investissement & Consignes de Dispatch',
        desc: 'Cartographie complète des tensions nodales, identification des goulots d\'étranglement de transit, plan d\'implantation de la compensation réactive (bancs condensateurs, FACTS/STATCOM), seuils de délestage d\'urgence (UFLS/UVLS) et Schéma Directeur d\'Investissement (SDI) décennal.',
        earthing: 'Critère de stabilité dynamique transitoire (CCT > 150 ms) & conformité Code de Réseau'
      },
      outputsEn: {
        title: 'Voltage Profile, Master Investment Plan & Dispatch Directives',
        desc: 'Comprehensive bus voltage map, transmission bottleneck identification, reactive compensation siting roadmap (capacitor banks, FACTS/STATCOM), under-frequency/under-voltage load shedding triggers (UFLS/UVLS), and 10-year capital expansion plan.',
        earthing: 'Transient stability margin compliance (CCT > 150 ms) & Grid Code adherence'
      }
    },
    sectionB: {
      summaryFr: 'Architectures fondamentales de réseaux électriques : du maillage haute tension interconnecté à haute résilience jusqu\'aux boucles urbaines et antennes de distribution rurale.',
      summaryEn: 'Core power grid architectures: from high-resilience interconnected high-voltage transmission meshes down to urban loops and radial rural distribution feeders.',
      architectures: [
        {
          nameFr: 'Réseau Maillé Interconnecté Haute Tension (225 kV / 90 kV)',
          nameEn: 'Meshed Transmission Grid (225 kV / 90 kV)',
          techFr: 'Chaque poste nœud est relié par au moins deux à trois lignes indépendantes formant des boucles polygonales fermées.',
          techEn: 'Every substation node is tied to at least two or three independent lines forming closed polygonal meshes.',
          descFr: 'Permet la redistribution instantanée et automatique des flux de puissance selon les lois de Kirchhoff en cas de perte inopinée d\'un ouvrage (critère N-1 sans coupure client).',
          descEn: 'Enables instantaneous, automatic power flow redistribution per Kirchhoff laws upon unplanned outage of any single line or transformer (N-1 criterion with zero customer blackout).',
          standard: 'CEI 60909 / IEEE Std 399 / SONATREL Code',
          metricFr: 'Disponibilité : > 99.98% • SAIDI Transport < 0.5 h/an',
          metricEn: 'Availability: > 99.98% • Transmission SAIDI < 0.5 h/yr'
        },
        {
          nameFr: 'Réseau Bouclé Exploité en Antenne Ouverte (Ring Main - 30 kV)',
          nameEn: 'Open-Ring Feeder Topology (30 kV RMU)',
          techFr: 'Boucle physique interconnectant plusieurs postes de transformation MT/BT, exploitée avec un Point d\'Ouverture Normal (PON / Normally Open Tie).',
          techEn: 'Physical cable ring looping several MV/LV transformer substations, operated open at a designated Normally Open (NO) tie switch.',
          descFr: 'Allie la simplicité des protections radiales non directionnelles à la flexibilité de reprise rapide : en cas de défaut sur un tronçon, les interrupteurs RMU encadrent et isolent le câble défaillant, et le point ouvert est refermé pour réalimenter les clients en moins de 3 minutes.',
          descEn: 'Combines the simplicity of non-directional radial protections with fast restoration flexibility: RMU switches isolate the faulty cable segment, and the tie switch closes to restore power in under 3 minutes.',
          standard: 'CEI 61936-1 / CEI 62271-200',
          metricFr: 'Temps de reprise : < 3 min (Télécommandé FLISR)',
          metricEn: 'Restoration time: < 3 min (FLISR Automated)'
        },
        {
          nameFr: 'Réseau Radial Arborescent (15 kV / 30 kV & Basse Tension)',
          nameEn: 'Radial Tree Feeder Topology (15 kV / 30 kV & LV)',
          techFr: 'Départ unique depuis le poste source se ramifiant en arbre vers les transformateurs de distribution sans chemin de secours.',
          techEn: 'Single trunk line branching outward from source substation to distribution transformers with zero alternate paths.',
          descFr: 'Structure la plus économique en investissement initial. Cependant, tout défaut sur le tronc principal provoque le déclenchement du disjoncteur de tête et coupe 100% des usagers situés en aval jusqu\'à réparation complète sur site.',
          descEn: 'Most economical architecture in upfront capital investment. However, any fault on the feeder trunk trips the head breaker, cutting 100% of downstream consumers until physical on-site repair is complete.',
          standard: 'CEI 60364 / NF C 13-100',
          metricFr: 'SAIDI : 40 à 180 h/an • Coût : Minimal',
          metricEn: 'SAIDI: 40 to 180 h/yr • Capital Cost: Minimal'
        },
        {
          nameFr: 'Super-Réseau Régional & Interconnexion Transfrontalière (225 kV / 400 kV)',
          nameEn: 'Regional & Transboundary Interconnected Supergrid (225 kV / 400 kV)',
          techFr: 'Liaisons THT synchrones AC ou HVDC reliant plusieurs réseaux nationaux souverains ou bassins hydrographiques distants (ex: RIS-RIN et PIECT Cameroun-Tchad).',
          techEn: 'Synchronous AC or HVDC extra-high-voltage tie-lines linking sovereign national grids or distant hydrological basins (e.g., Cameroon RIS-RIN and PIECT Cameroon-Chad).',
          descFr: 'Permet la mutualisation des réserves tournantes de puissance, la compensation des variations saisonnières d\'hydraulicité (Sanaga au Sud vs Bénoué au Nord), et le secours mutuel face aux grands aléas de production.',
          descEn: 'Enables mutual sharing of spinning reserves, hydrological balance across seasonal rainfall variations, and bilateral emergency power support during major generation trips.',
          standard: 'CIGRE TB 577 / IEEE Std 1547',
          metricFr: 'Capacité de transit : 100 à 600 MW • Réserve mutualisée',
          metricEn: 'Transfer capacity: 100 to 600 MW • Pooled reserves'
        },
        {
          nameFr: 'Architecture Postes HTB : Double Jeu de Barres & Disjoncteur et Demi (1½ CB)',
          nameEn: 'Substation Bus Topologies: Double Bus & Breaker-and-a-Half (1½ CB)',
          techFr: 'Topologies de jeux de barres en poste de transformation permettant l\'aiguillage, la maintenance d\'un disjoncteur ou d\'une barre sans interruption de service.',
          techEn: 'Substation switchgear bus schemes providing bay selector flexibility, allowing circuit breaker or busbar maintenance without outage.',
          descFr: 'Le schéma double barre à un disjoncteur offre une souplesse d\'exploitation quotidienne via le disjoncteur de couplage. Le schéma à disjoncteur et demi (3 disjoncteurs pour 2 départs) garantit qu\'aucun déclenchement de barre n\'interrompt de départ de ligne ou de groupe.',
          descEn: 'Double-bus single-breaker topology provides daily dispatch flexibility via bus coupler. Breaker-and-a-half (3 breakers for 2 bays) guarantees that no busbar fault causes line or generator outage.',
          standard: 'CEI 61936-1 / IEEE Std 605',
          metricFr: 'Sécurité d\'exploitation : Maximale • Zéro coupure maintenance',
          metricEn: 'Operating security: Maximum • Zero maintenance outage'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-svc-statcom',
        nameFr: 'Compensateur Statique de Puissance Réactive (SVC / STATCOM)',
        nameEn: 'Static Synchronous Compensator (STATCOM)',
        voltage: '225 kV • ±50 MVAr (Convertisseur MMC à IGBT)',
        roleFr: 'Régulation dynamique continue et ultra-rapide (< 20 ms) de la tension nodale et amortissement des oscillations de puissance inter-zones.',
        roleEn: 'Continuous ultra-fast (< 20 ms) nodal bus voltage regulation and inter-area power oscillation damping.',
        symbol: 'STATCOM',
        standard: 'CEI 61000-3-6 / IEEE Std 1052',
        imgUrl: '/images/homepage_uploads/batch_02_image_007.jpg',
        calcTab: 'cable-ampacity'
      },
      {
        id: 'eq-exp-ems-dispatch',
        nameFr: 'Superviseur Énergétique EMS & Calculateurs de Dispatching National',
        nameEn: 'Energy Management System (EMS) & National Dispatch Computer',
        voltage: 'Contrôle-commande 48 Vcc / Serveurs Redondés Haute Disponibilité',
        roleFr: 'Exécution en temps réel (cycle de 4 secondes) des calculs d\'estimation d\'état, d\'analyse de contingence N-1 et de réglage secondaire fréquence-puissance (AGC).',
        roleEn: 'Real-time 4-second cycle execution of state estimation, online N-1 contingency screening, and Automatic Generation Control (AGC).',
        symbol: 'EMS',
        standard: 'CEI 61970 (CIM) / CEI 60870-6 (TASE.2/ICCP)',
        imgUrl: '/images/homepage_uploads/batch_05_image_022.jpg'
      },
      {
        id: 'eq-exp-sync-condenser',
        nameFr: 'Compensateur Synchrone à Forte Inertie Mécanique (Inertie Virtuelle & Puissance de Court-Circuit)',
        nameEn: 'Synchronous Condenser with Flywheel (Inertia & Short-Circuit Strength)',
        voltage: '15 kV raccordé par Transformateur Évacuation 225 kV • 50 MVA',
        roleFr: 'Fourniture d\'inertie rotationnelle pure (constante H = 5.0 s), augmentation du courant de court-circuit au nœud et soutien de tension Q instantané lors des creux de tension.',
        roleEn: 'Delivery of physical rotational kinetic inertia (inertia constant H = 5.0 s), grid short-circuit level reinforcement, and instantaneous MVAR injection during fault ride-through.',
        symbol: 'SYNC-COND',
        standard: 'CEI 60034-1 / IEEE Std 1812',
        imgUrl: '/images/homepage_uploads/batch_07_image_031_hydro_turbine_hall.jpg'
      },
      {
        id: 'eq-exp-shunt-reactor',
        nameFr: 'Bobine d\'Inductance Shunt Haute Tension (Compensation de l\'Effet Ferranti)',
        nameEn: 'High-Voltage Shunt Reactor (Ferranti Effect Mitigation)',
        voltage: '225 kV • 30 MVAr Triphasé à Isolement Huile Minérale',
        roleFr: 'Absorption de la puissance réactive capacitive excédentaire générée par les longues lignes aériennes ou câbles souterrains à vide ou faible charge, évitant les surtensions destructrices.',
        roleEn: 'Absorption of surplus capacitive reactive power produced by long overhead lines or underground cables during light-load conditions, preventing hazardous voltage rise.',
        symbol: 'SHUNT-REACT',
        standard: 'CEI 60076-6 / IEEE C57.21',
        imgUrl: '/assets/ecosystem/power-substation-ecosystem.jpg'
      },
      {
        id: 'eq-exp-double-bus-bay',
        nameFr: 'Travée de Ligne Double Jeu de Barres 245 kV avec Sectionneurs Motorisés',
        nameEn: '245 kV Double-Busbar Line Bay with Motorized Disconnectors & Earthing',
        voltage: '245 kV Assigné • In = 2500 A • Icc = 40 kA / 3 s',
        roleFr: 'Raccordement modulaire d\'un départ de transport permettant le basculement à chaud d\'un jeu de barres à l\'autre sans interruption de charge et l\'isolement sécurisé pour consignation.',
        roleEn: 'Modular connection of high-voltage transmission circuit allowing on-load busbar transfer without power interruption and locked safety earthing during maintenance.',
        symbol: 'BAY-225',
        standard: 'CEI 62271-100 / CEI 62271-102 / CEI 61936-1',
        imgUrl: '/images/homepage_uploads/batch_02_image_006.jpg'
      },
      {
        id: 'eq-exp-pst-transformer',
        nameFr: 'Transformateur Déphaseur (Phase-Shifting Transformer / PST)',
        nameEn: 'Phase-Shifting Transformer (PST / Quadrature Booster)',
        voltage: '225 kV • 250 MVA • Déphasage réglable ±25°',
        roleFr: 'Contrôle actif et forcé de la répartition des transits de puissance active sur des lignes parallèles d\'impédances dissemblables, empêchant la surcharge des liaisons fragiles.',
        roleEn: 'Active control of active power flows across parallel transmission corridors with mismatched impedances, preventing thermal bottlenecking on weaker paths.',
        symbol: 'PST',
        standard: 'CEI 60076-1 / IEEE C57.135',
        imgUrl: '/images/homepage_uploads/batch_03_image_011.jpg'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Modélisation Nodale & Ingestion des Données Topologiques',
        titleEn: 'Nodal Network Modeling & Topology Ingestion',
        descFr: 'Construction de la matrice d\'admittance nodale [Ybus], spécification des caractéristiques physiques des conducteurs (r, x, b), modélisation des transformateurs avec prises en charge (OLTC) et import des profils de charge.',
        descEn: 'Construction of the nodal bus admittance matrix [Ybus], branch impedance parameters (r, x, b), on-load tap changer (OLTC) modeling, and historical load curve ingestion.'
      },
      {
        phase: '02',
        titleFr: 'Bilan d\'Offre-Demande & Dispatch Économique Sécurisé (SCED)',
        titleEn: 'Supply-Demand Balance & Security-Constrained Dispatch',
        descFr: 'Arbitrage technico-économique de l\'ordre de préséance de production (Merit Order) entre grands barrages hydroélectriques et centrales thermiques, sous contraintes de réserves primaires et secondaires tournantes.',
        descEn: 'Techno-economic merit-order dispatch between base-load hydro complexes and thermal peak units under strict spinning primary and secondary reserve constraints.'
      },
      {
        phase: '03',
        titleFr: 'Simulations d\'Écoulement de Charge AC (Newton-Raphson)',
        titleEn: 'AC Load Flow Simulations (Newton-Raphson)',
        descFr: 'Résolution numérique itérative des équations nodales pour déterminer le module des tensions |V|, les angles de phase θ, les transits actifs P et réactifs Q, ainsi que les pertes joule totales du système.',
        descEn: 'Iterative numerical solving of non-linear nodal balance equations to evaluate voltage magnitudes |V|, angles θ, line power flows (P, Q), and system transmission losses.'
      },
      {
        phase: '04',
        titleFr: 'Analyse Déterministe de Contingence & Critère N-1',
        titleEn: 'Deterministic Contingency Analysis & N-1 Rule',
        descFr: 'Déconnexion systématique automatisée de chaque ligne de transport, transformateur et groupe de production. Vérification stricte qu\'aucun élément restant ne dépasse sa limite thermique admissible temporaire.',
        descEn: 'Automated systematic tripping simulation of every transmission line, GSU transformer, and generator unit. Verification that remaining assets stay strictly below emergency thermal limits.'
      },
      {
        phase: '05',
        titleFr: 'Stabilité Dynamique de Tension & Marges aux Courbes en Nez (P-V / Q-V)',
        titleEn: 'Dynamic Voltage Stability & P-V / Q-V Nose Curve Margins',
        descFr: 'Calcul des courbes de transférabilité limite P-V pour identifier la proximité du point de bifurcation de selle (point de nez dV/dQ → ∞) et dimensionner les marges de sécurité en MVAR.',
        descEn: 'Computation of P-V transfer capability curves to measure distance from the saddle-node bifurcation point (nose collapse dV/dQ → ∞) and size required MVAR safety margins.'
      },
      {
        phase: '06',
        titleFr: 'Calculs des Courants de Court-Circuit (CEI 60909) & Tenue Électrodynamique',
        titleEn: 'Short-Circuit Calculations (IEC 60909) & Switchgear Ratings',
        descFr: 'Évaluation des courants de défaut triphasés Icc", crêtes ip et thermiques Ith à chaque nœud pour vérifier que le pouvoir de coupure des disjoncteurs (ex: 31.5 kA ou 40 kA) et la tenue des barres restent conformes.',
        descEn: 'Evaluation of symmetrical initial short-circuit currents Icc", peak currents ip, and thermal ratings Ith to ensure substation switchgear breaking capacity and busbar withstand conform.'
      },
      {
        phase: '07',
        titleFr: 'Plan de Défense, Délesseurs Fréquencemétriques & Schéma Directeur (SDI)',
        titleEn: 'System Defense Plan, Load Shedding & 10-Year Master Plan',
        descFr: 'Paramétrage des échelons de délestage automatique par baisse de fréquence (UFLS 49.0 Hz à 48.0 Hz), îlotage d\'urgence, et élaboration de la feuille de route CAPEX de renforcement des corridors de transit.',
        descEn: 'Configuration of Under-Frequency Load Shedding stages (UFLS from 49.0 Hz to 48.0 Hz), emergency islanding logic, and synthesis into the multi-year CAPEX transmission investment plan.'
      }
    ],
    sectionE: [
      {
        id: 'newton_raphson_flow',
        tabLabelFr: 'Équations Nodales de Transit (Load Flow)',
        tabLabelEn: 'Nodal Power Flow Equations',
        titleFr: 'Formulation d\'Écoulement de Charge AC de Newton-Raphson',
        titleEn: 'Newton-Raphson AC Power Flow Formulation',
        descFr: 'Permet de calculer les puissances actives et réactives transitant par chaque ligne à partir de la matrice d\'admittance nodale complexe [Ybus] = [G] + j[B].',
        descEn: 'Calculates active and reactive power flows through every branch using the complex nodal admittance matrix [Ybus] = [G] + j[B].',
        formula: 'P_i = \\sum_{j=1}^{N} |V_i| |V_j| (G_{ij} \\cos \\theta_{ij} + B_{ij} \\sin \\theta_{ij}) \\quad;\\quad Q_i = \\sum_{j=1}^{N} |V_i| |V_j| (G_{ij} \\sin \\theta_{ij} - B_{ij} \\cos \\theta_{ij})',
        formulaDescFr: 'Avec Vi le module de tension au nœud i, Gij et Bij la conductance et susceptance de la branche mutuelle, et θij = θi - θj le déphasage angulaire entre les deux nœuds.',
        formulaDescEn: 'With Vi voltage magnitude at bus i, Gij and Bij mutual conductance and susceptance, and θij = θi - θj voltage angle difference across the branch.',
        assumptionsFr: [
          'Système triphasé équilibré en régime permanent sinusoïdal 50 Hz.',
          'Nœud bilan (Slack Bus) imposé avec tension module 1.00 pu et angle de référence 0.0°.',
          'Nœuds générateurs fixés en puissance active P et module de tension |V| (Nœuds PV).',
          'Nœuds de consommation fixés en puissance active P et réactive Q (Nœuds PQ).'
        ],
        assumptionsEn: [
          'Balanced 3-phase steady-state sinusoidal 50 Hz operation.',
          'Slack bus defined with fixed reference voltage 1.00 pu and 0.0° phase angle.',
          'Generator buses specified by active power P and voltage magnitude |V| (PV buses).',
          'Load buses defined by active power P and reactive power Q (PQ buses).'
        ],
        simTab: 'ferranti'
      },
      {
        id: 'surge_impedance_loading',
        tabLabelFr: 'Puissance Naturelle de Transit (SIL)',
        tabLabelEn: 'Surge Impedance Loading (SIL)',
        titleFr: 'Puissance Naturelle d\'une Ligne de Transport (Surge Impedance Loading)',
        titleEn: 'Transmission Line Surge Impedance Loading (SIL)',
        descFr: 'Représente le niveau de puissance active transmis pour lequel la puissance réactive inductive consommée par la ligne compense exactement la puissance réactive capacitive produite par sa capacité propre.',
        descEn: 'Represents the active power loading at which reactive power absorbed by series line inductance exactly equals reactive power generated by line shunt capacitance.',
        formula: 'P_{nat} = \\frac{U_n^2}{Z_c} = \\frac{U_n^2}{\\sqrt{L / C}}',
        formulaDescFr: 'Avec Un tension nominale entre phases (V) et Zc impédance caractéristique d\'onde (typiquement 350-400 Ω pour ligne aérienne 225 kV, 30-50 Ω pour câble souterrain).',
        formulaDescEn: 'With Un nominal line-to-line voltage (V) and Zc surge impedance (typically 350-400 Ω for 225 kV overhead lines, 30-50 Ω for underground cables).',
        assumptionsFr: [
          'Ligne sans pertes diélectriques et résistance série négligée devant la réactance (R << X).',
          'À P = Pnat, le profil de tension le long de la ligne est rigoureusement plat (|V(x)| = Un).',
          'À P < Pnat, la ligne est génératrice nette de réactif (effet Ferranti à vide).',
          'À P > Pnat, la ligne est consommatrice nette de réactif (chute de tension accentuée).'
        ],
        assumptionsEn: [
          'Lossless line assumption with series resistance much smaller than reactance (R << X).',
          'At P = SIL, voltage profile along the line is flat (|V(x)| = Un).',
          'At P < SIL, line acts as net capacitive reactive generator (Ferranti rise at no-load).',
          'At P > SIL, line acts as net inductive consumer, accelerating voltage drop.'
        ],
        calcTab: 'cable-ampacity'
      },
      {
        id: 'max_power_transfer',
        tabLabelFr: 'Limite de Transfert de Puissance & Marge',
        tabLabelEn: 'Maximum Power Transfer Limit',
        titleFr: 'Limite de Stabilité Statique en Ligne Réactive Pure',
        titleEn: 'Steady-State Power Transfer Limit across Line Reactance',
        descFr: 'Définit la puissance active maximale transmissible entre deux sous-stations avant perte de synchronisme électromécanique (bifurcation angulaire à δ = 90°).',
        descEn: 'Establishes the maximum active power transferable between two substations across series reactance X before loss of electromechanical synchronism (angle limit δ = 90°).',
        formula: 'P_{transit} = \\frac{V_1 \\cdot V_2}{X_{ligne}} \\sin \\delta \\quad \\implies \\quad P_{max} = \\frac{V_1 \\cdot V_2}{X_{ligne}}',
        formulaDescFr: 'Avec V1 et V2 les tensions aux deux extrémités, Xligne la réactance série inductive totale de la liaison, et δ l\'angle de déphasage interne.',
        formulaDescEn: 'With V1 and V2 sending/receiving bus voltages, Xline total series inductive reactance, and δ internal angular power displacement.',
        assumptionsFr: [
          'Résistance ohmique de ligne négligeable devant la réactance série (X/R > 5).',
          'Tensions terminales V1 et V2 maintenues constantes par les régulateurs de tension AVR.',
          'Marge de sécurité d\'exploitation : le transit permanent normal ne doit pas dépasser 70% de Pmax (angle δ ≤ 35°-45°).'
        ],
        assumptionsEn: [
          'Ohmic line resistance negligible relative to reactance (X/R > 5).',
          'Terminal bus voltages V1 and V2 maintained constant by generator AVRs.',
          'Operational safety margin: steady-state flow must not exceed 70% of Pmax (power angle δ ≤ 35°-45°).'
        ],
        simTab: 'ferranti'
      },
      {
        id: 'scc_bus_calc',
        tabLabelFr: 'Puissance de Court-Circuit au Nœud (Scc)',
        tabLabelEn: 'Short-Circuit Capacity (Scc)',
        titleFr: 'Puissance de Court-Circuit au Nœud de Raccordement selon CEI 60909',
        titleEn: 'Grid Node Short-Circuit Capacity per IEC 60909',
        descFr: 'Caractérise la "raideur" du réseau au point de livraison et détermine le pouvoir de coupure requis des disjoncteurs ainsi que la tenue électrodynamique des jeux de barres.',
        descEn: 'Defines grid electrical stiffness at the connection point and sets minimum switchgear breaking capacity and electrodynamic withstand.',
        formula: 'S_{sc} = \\sqrt{3} \\cdot U_n \\cdot I_{k}^{\\prime\\prime} = \\frac{c \\cdot U_n^2}{Z_{th}}',
        formulaDescFr: 'Avec Un tension nominale entre phases, Ik" courant de court-circuit initial symétrique, c facteur de tension (1.10 en HTB), et Zth impédance équivalente Thévenin.',
        formulaDescEn: 'With Un nominal line-to-line voltage, Ik" initial subtransient fault current, c voltage factor (1.10 for HV), and Zth Thevenin equivalent grid impedance.',
        assumptionsFr: [
          'Facteur de tension c = 1.10 pour les réseaux haute tension HTB (CEI 60909-0).',
          'Sources synchrones représentées par leur réactance subtransitoire xd".',
          'Court-circuit triphasé franc sans impédance d\'arc au point de raccordement.'
        ],
        assumptionsEn: [
          'Voltage factor c = 1.10 for high-voltage networks (IEC 60909-0).',
          'Synchronous generators modeled by their subtransient reactance xd".',
          'Solid symmetrical 3-phase fault with zero arc resistance.'
        ],
        calcTab: 'cable-short-circuit'
      },
      {
        id: 'swing_equation_stability',
        tabLabelFr: 'Équation du Balancement & Stabilité Rotorique',
        tabLabelEn: 'Swing Equation & Rotor Stability',
        titleFr: 'Équation du Balancement du Rotor (Swing Equation) & Temps Critique d\'Élimination',
        titleEn: 'Generator Rotor Swing Equation & Critical Clearing Time (CCT)',
        descFr: 'Décrit la dynamique électromécanique de l\'alternateur lors d\'une perturbation brutale sur le réseau de transport, régissant la stabilité transitoire.',
        descEn: 'Governs electromechanical rotor acceleration following severe grid faults, determining transient stability and critical clearing time.',
        formula: '\\frac{2H}{\\omega_s} \\frac{d^2 \\delta}{dt^2} = P_m - P_e = P_a',
        formulaDescFr: 'Avec H constante d\'inertie mécanique (secondes), ωs vitesse synchrone (rad/s), δ angle rotorique, Pm puissance mécanique motrice, et Pe puissance électrique électromagnétique.',
        formulaDescEn: 'With H inertia constant (seconds), ωs synchronous speed (rad/s), δ rotor angle, Pm mechanical turbine power, and Pe electromagnetic grid power.',
        assumptionsFr: [
          'Pertes mécaniques et amortissement asynchrone négligés au premier instant.',
          'Si un court-circuit élimine la capacité d\'évacuation (Pe → 0), le rotor accélère au taux d²δ/dt² = (ωs / 2H) · Pm.',
          'Temps critique d\'élimination CCT typique requis : > 150 ms en 225 kV.'
        ],
        assumptionsEn: [
          'Mechanical losses and damping winding torques neglected during initial cycles.',
          'If a severe fault zeroes power transfer (Pe → 0), the rotor accelerates at rate d²δ/dt² = (ωs / 2H) · Pm.',
          'Target Critical Clearing Time (CCT) benchmark: > 150 ms on 225 kV corridors.'
        ],
        simTab: 'ferranti'
      }
    ],
    sectionF: [
      {
        code: 'CEI 60909-0',
        tag: 'CALCULS DE RÉSEAUX',
        titleFr: 'Courants de Court-Circuit dans les Réseaux Triphasés à Courant Alternatif',
        titleEn: 'Short-Circuit Currents in Three-Phase A.C. Systems',
        descFr: 'Méthode normalisée internationale pour le calcul des courants de défaut symétriques et asymétriques pour le dimensionnement des appareils de coupure.',
        descEn: 'International standard method for symmetrical and asymmetrical fault current calculation for switchgear breaking capacity sizing.'
      },
      {
        code: 'IEEE Std 399-1997',
        tag: 'GRID PLANNING (BROWN BOOK)',
        titleFr: 'Pratiques Recommandées pour l\'Analyse Industrielle et Commerciale des Systèmes de Puissance',
        titleEn: 'Recommended Practice for Industrial and Commercial Power Systems Analysis',
        descFr: 'Référence internationale régissant les études d\'écoulement de charge, d\'analyse de contingence, de stabilité transitoire et de démarrage des moteurs.',
        descEn: 'Authoritative international guide covering load flow dispatch, contingency screening, transient stability, and motor starting analysis.'
      },
      {
        code: 'CEI 61970 / CIM',
        tag: 'INTEROPÉRABILITÉ EMS / SCADA',
        titleFr: 'Interface de Gestion de Réseau & Common Information Model (CIM)',
        titleEn: 'Energy Management System Application Program Interface (CIM)',
        descFr: 'Modèle sémantique universel pour l\'échange de données de topologie, d\'estimateur d\'état et de dispatching entre outils de simulation et dispatching national.',
        descEn: 'Universal semantic standard for grid topology, state estimation, and SCADA data exchange between network simulation tools and dispatch centers.'
      },
      {
        code: 'CODE DE RÉSEAU SONATREL',
        tag: 'RÉGULATION NATIONALE CAMEROUN',
        titleFr: 'Règles Techniques de Raccordement & d\'Exploitation du Réseau Public de Transport 225 kV / 90 kV',
        titleEn: 'Technical Rules for Connection & Operation of the Cameroon 225 kV / 90 kV Transmission Grid',
        descFr: 'Fixe les critères déterministes de sécurité N-1, les plages de maintien de la tension (±10%), la réserve primaire de fréquence et les plans de délestage UFLS.',
        descEn: 'Establishes deterministic N-1 security criteria, allowable bus voltage envelopes (±10%), primary frequency containment reserves, and UFLS emergency load shedding.'
      },
      {
        code: 'CEI 60038 / CEI 60071',
        tag: 'TENSIONS NORMALISÉES & COORDINATION',
        titleFr: 'Tensions Normalisées de la CEI & Coordination de l\'Isolement Électrique',
        titleEn: 'IEC Standard Voltages & Insulation Coordination Principles',
        descFr: 'Définit les paliers de tension assignés (BT 400V, HTA 15-30 kV, HTB 90-225-400 kV) et les niveaux d\'isolement aux chocs de foudre (BIL) et manœuvre.',
        descEn: 'Defines standardized voltage ratings (LV 400V, MV 15-30 kV, HV 90-225-400 kV) and Basic Impulse Insulation Levels (BIL) for lightning and switching surges.'
      }
    ]
  },

  // D06: Installations Électriques & Tertiaire (Basse Tension, TGBT & SLT)
  D06: {
    domainCode: 'D06',
    sectionA: {
      roleFr: "Distribution terminale basse tension (400 V / 230 V), gestion rigoureuse des Schémas de Liaison à la Terre (SLT : TT, TN, IT), protection absolue des personnes contre les chocs électriques (contacts directs et indirects), continuité d'alimentation des procédés industriels et efficacité énergétique active.",
      roleEn: 'Low-voltage terminal power distribution (400 V / 230 V), rigorous earthing system management (SLT: TT, TN, IT), absolute personnel protection against electric shocks (direct and indirect contact), industrial process continuity, and active energy efficiency.',
      inputsFr: {
        title: 'Secondaire Transformateur HTA/BT ou Groupe Électrogène',
        desc: 'Alimentation issue du transformateur de distribution 30 kV / 400 V Dyn11 ou d\'une centrale autonome de secours (groupe diesel avec automate Normal-Secours ATS), jeu de barres TGBT principal.',
        voltage: '400 V Triphasé / 230 V Monophasé • 50 Hz • Régime stabilisé ±10%'
      },
      inputsEn: {
        title: 'MV/LV Transformer Secondary or Standby Genset',
        desc: 'Power fed from 30 kV / 400 V Dyn11 secondary substation or emergency diesel generator via Automatic Transfer Switch (ATS), feeding the main LV busbar.',
        voltage: '400 V 3-Phase / 230 V Single-Phase • 50 Hz • Voltage regulation ±10%'
      },
      processFr: {
        title: 'Tableau Général Basse Tension (TGBT Forme 4b) & Maîtrise des Régimes de Neutre',
        desc: 'Ségrégation compartimentée Forme 4b selon CEI 61439-2, compensation automatique de l\'énergie réactive par gradins avec selfs anti-harmoniques (cos φ ≥ 0.95), alimentation sans coupure par onduleurs statiques (ASI/UPS), et déclenchement sélectif amont-aval (sélectivité logique, chronométrique et ampèremétrique).',
        note: 'Sécurité des personnes : Tension limite conventionnelle UL ≤ 50 V (local sec) ou UL ≤ 25 V (local humide)'
      },
      processEn: {
        title: 'Main Switchboard (TGBT Form 4b) & Earthing Scheme (SLT) Control',
        desc: 'Compartmentalized Form 4b switchgear per IEC 61439-2, detuned automatic capacitor banks for power factor correction (cos φ ≥ 0.95), static uninterruptible power supplies (UPS), and full 3-tier selective discrimination.',
        note: 'Personnel safety: Statutory touch voltage threshold UL ≤ 50 V (dry) or UL ≤ 25 V (damp/wet locations)'
      },
      outputsFr: {
        title: 'Circuits Terminaux Force Motrice, Colonnes Tertiaires & Tableaux Divisionnaires',
        desc: 'Centres de Contrôle Moteurs (MCC) pour pompes, broyeurs et compresseurs industriels, canalisations préfabriquées canalis (barres blindées), armoires divisionnaires tertiaires et prises sécurisées par DDR 30 mA.',
        earthing: 'Prise de terre réglementaire ceinturant le bâtiment (R ≤ 10 Ω), liaison équipotentielle principale (LEP) et supplémentaire (LES)'
      },
      outputsEn: {
        title: 'Terminal Motor Feeders, Commercial Risers & Sub-Distribution Boards',
        desc: 'Motor Control Centers (MCC) for pumps, crushers, and process drives, busbar trunking systems (busways), commercial sub-panels, and 30 mA RCD-protected branch circuits.',
        earthing: 'Foundation earth loop electrode (R ≤ 10 Ω), Main Equipotential Bonding (MEB), and Supplementary Equipotential Bonding (SEB)'
      }
    },
    sectionB: {
      summaryFr: 'Comparatif direct des Schémas de Liaison à la Terre (TT, TN-S, TN-C, IT) et architecture de distribution critique double voie 2N.',
      summaryEn: 'Comprehensive comparative matrix of the earthing schemes (TT, TN-S, TN-C, IT) and mission-critical 2N dual-bus architectures.',
      architectures: [
        {
          nameFr: 'Schéma de Neutre TT (Distribution Publique Basse Tension & Tertiaire)',
          nameEn: 'TT Earthing Scheme (Public Utility Distribution & Commercial)',
          techFr: 'Neutre du transformateur relié directement à une prise de terre distincte; masses métalliques des récepteurs reliées à une prise de terre locale indépendante',
          techEn: 'Transformer neutral connected directly to earth electrode; installation metal enclosures connected to independent earth rod',
          descFr: 'Schéma universel imposé pour la distribution publique basse tension (ENEO Cameroun) et les usagers raccordés au tarif BT. Tout premier défaut d\'isolement crée une tension de contact dangereuse : la coupure automatique par Dispositif Différentiel Résiduel (DDR) est obligatoire dès le premier défaut.',
          descEn: 'Universal mandatory scheme for public utility low-voltage distribution and tariff-BT consumers. Any insulation fault generates a dangerous touch voltage, requiring immediate automatic disconnection of supply via Residual Current Devices (RCD).',
          standard: 'NF C 15-100 / CEI 60364-4-41',
          metricFr: 'Condition de sécurité : R_A · I_Δn ≤ 50 V; coupure t ≤ 0.2 s (230 V)',
          metricEn: 'Safety rule: R_A · I_Δn ≤ 50 V; disconnection time t ≤ 0.2 s'
        },
        {
          nameFr: 'Schéma de Neutre TN-S (Grand Tertiaire, Data Centers & Industrie)',
          nameEn: 'TN-S Earthing Scheme (Industrial Plants, Data Centers & Commercial)',
          techFr: 'Neutre relié directement à la terre au poste de livraison; masses métalliques interconnectées au neutre via un conducteur de protection PE séparé sur toute l\'installation',
          techEn: 'Transformer neutral solidly grounded; equipment frames tied to neutral via a separate dedicated PE conductor throughout',
          descFr: 'Solution optimale pour les grandes usines et les bâtiments à forte composante informatique. Le défaut d\'isolement se transforme en un court-circuit franc phase-PE d\'intensité élevée, éliminé instantanément par le déclencheur magnétique du disjoncteur. Absence de courants vagabonds dans le PE, compatible CEM.',
          descEn: 'Optimal scheme for major industrial complexes and facilities with sensitive IT/electronics. An insulation fault becomes an instantaneous phase-to-PE short circuit cleared by magnetic breaker trips. Zero stray return currents on PE, optimal EMC.',
          standard: 'CEI 60364-4-41 / NF C 15-105',
          metricFr: 'Temps de coupure maximal : t ≤ 0.4 s sous 230 V; Id = U0 / Zs',
          metricEn: 'Max disconnection time: t ≤ 0.4 s at 230 V; Id = U0 / Zs'
        },
        {
          nameFr: 'Schéma de Neutre TN-C / TN-C-S (Distribution Industrielle Économique & Colonnes)',
          nameEn: 'TN-C / TN-C-S Earthing Scheme (Cost-Effective Heavy Risers)',
          techFr: 'Conducteur neutre et de protection combinés en un conducteur unique PEN (TN-C pour câbles ≥ 10 mm² Cu), puis scindés en N et PE distincts (TN-S) au tableau divisionnaire',
          techEn: 'Combined neutral and protective conductor (PEN in TN-C for cables ≥ 10 mm² Cu), transitioning into separate N and PE (TN-S) at sub-distribution',
          descFr: 'Permet une économie d\'un pôle de câble sur les grandes longueurs de liaison entre le poste HTA/BT et les armoires divisionnaires. Interdiction formelle du TN-C en aval du TN-S, et interdiction d\'utiliser des conducteurs souples ou des sections inférieures à 10 mm² cuivre ou 16 mm² alu.',
          descEn: 'Delivers substantial copper/aluminum savings on long cable runs from the primary substation to sub-switchboards. TN-C is strictly prohibited downstream of TN-S, and prohibited on flexible conductors or cross-sections below 10 mm² Cu / 16 mm² Al.',
          standard: 'CEI 60364-5-54 / NF C 15-100 §543',
          metricFr: 'Économie de cuivre : 20% à 25% sur les colonnes de puissance; section PEN ≥ 10 mm² Cu',
          metricEn: 'Conductor copper saving: 20-25% on heavy feeder risers; PEN ≥ 10 mm² Cu'
        },
        {
          nameFr: 'Schéma de Neutre IT (Hôpitaux, Salles d\'Opération, Mines & Process Continus)',
          nameEn: 'IT Earthing Scheme (Hospitals, Operating Theaters, Mining & Continuous Process)',
          techFr: 'Point neutre du transformateur isolé de la terre ou relié par une impédance élevée (1 000 à 2 000 Ω); masses métalliques interconnectées à la terre',
          techEn: 'Transformer neutral isolated from earth or connected through high impedance (1,000 to 2,000 Ω); equipment frames solidly grounded',
          descFr: 'Exigé dans les blocs opératoires hospitaliers, les raffineries, les mines et les lignes de production verrières/cimentières. Au premier défaut d\'isolement franc, le courant de fuite est infime (quelques dizaines de milliampères) : aucune coupure de l\'alimentation ! Un Contrôleur Permanent d\'Isolement (CPI) signale l\'incident aux équipes de maintenance sans arrêt de production.',
          descEn: 'Mandatory in hospital operating rooms, refineries, mining, and continuous chemical/glass manufacturing. Upon a first insulation fault, leakage current is negligible (< 2 A): zero tripping occurs! An Insulation Monitoring Device (IMD) alerts technicians to locate and clear the fault without plant shutdown.',
          standard: 'NF C 15-100 §411.6 / CEI 61557-8',
          metricFr: 'Disponibilité au 1er défaut : 100% sans déclenchement; alarme CPI sous seuil ≤ 50 kΩ',
          metricEn: 'Continuity on 1st fault: 100% uninterrupted; IMD alarm threshold ≤ 50 kΩ'
        },
        {
          nameFr: 'Distribution Critique Double Voie TGBT 2N avec Commutateur Statique (STS)',
          nameEn: 'Mission-Critical 2N Dual-Bus Switchboard with Static Transfer Switch (STS)',
          techFr: 'Architecture 2N intégrant deux TGBT entièrement indépendants (Voie A et Voie B), alimentés par deux transformateurs MT/BT séparés et deux groupes électrogènes de secours, couplés par commutateurs STS',
          techEn: 'Fully redundant 2N architecture with two independent switchboards (Bus A and Bus B) fed by distinct MV/LV transformers and diesel gensets, bridged by Static Transfer Switches (STS)',
          descFr: 'Architecture maximale de fiabilité (Tier IV) pour centres de données bancaires, télécoms et infrastructures critiques. En cas de défaillance complète d\'une voie, le STS commute les charges sensibles sur la voie saine en moins de 4 millisecondes, garantissant zéro interruption pour les serveurs.',
          descEn: 'Maximum mission-critical reliability architecture (Tier IV) for data centers, telecom exchanges, and financial processing centers. In case of bus failure, the STS transfers sensitive loads within 4 milliseconds, ensuring zero dropout for servers.',
          standard: 'CEI 61439-2 / TIA-942 Tier IV',
          metricFr: 'Temps de transfert STS < 4 ms; disponibilité théorique : 99.999%',
          metricEn: 'STS transfer time < 4 ms; theoretical availability: 99.999%'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-masterpact-mtz',
        nameFr: 'Disjoncteur Général TGBT Ouvert Débrochable (1 600 A)',
        nameEn: 'Air Circuit Breaker (ACB) Masterpact 1600 A',
        voltage: '400 V • 1 600 A • Icu 65 kA',
        roleFr: 'Protection générale du TGBT, coupure des courants de défaut et mesure d\'énergie intégrée classe 1.',
        roleEn: 'Main switchboard protection, fault current clearance, and integrated digital power metering.',
        symbol: 'Q0-TGBT',
        standard: 'CEI 60947-2',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'cable-short-circuit'
      },
      {
        id: 'eq-exp-tgbt-cubicle',
        nameFr: 'Tableau Général Basse Tension Modulaire (TGBT Forme 4b - 2 500 A)',
        nameEn: 'Modular Low-Voltage Main Switchboard (Form 4b - 2500 A)',
        voltage: '400 V / 690 V • 2 500 A • Icw 65 kA 1s',
        roleFr: 'Séparation physique totale des jeux de barres, unités fonctionnelles et bornes de raccordement selon CEI 61439-2.',
        roleEn: 'Total physical segregation between busbars, functional units, and external cable terminations per IEC 61439-2.',
        symbol: 'TGBT-F4b',
        standard: 'CEI 61439-1/2',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'busbar-electrodynamic'
      },
      {
        id: 'eq-exp-rcd-diff',
        nameFr: 'Dispositif Différentiel Résiduel Haute Sensibilité (DDR 30 mA)',
        nameEn: 'Residual Current Device (RCD) 30 mA',
        voltage: '230/400 V • In = 40 A • IΔn = 30 mA',
        roleFr: 'Protection complémentaire vitale des personnes contre les chocs électriques et contacts directs/indirects.',
        roleEn: 'Mandatory personnel life-saving protection against direct and indirect touch shocks.',
        symbol: 'DDR-30mA',
        standard: 'CEI 61008-1 / CEI 61009-1',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        calcTab: 'earthing'
      },
      {
        id: 'eq-exp-cpi-monitor',
        nameFr: 'Contrôleur Permanent d\'Isolement Numérique (CPI / IMD)',
        nameEn: 'Digital Insulation Monitoring Device (IMD / CPI)',
        voltage: 'Réseau IT 400 V • Injection 2.5 Hz codée',
        roleFr: 'Surveillance continue de la résistance d\'isolement globale et localisation automatique du départ défaillant en schéma IT.',
        roleEn: 'Continuous insulation resistance monitoring with automatic faulty branch location in IT networks.',
        symbol: 'CPI-IMD',
        standard: 'CEI 61557-8 / CEI 61557-9',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        calcTab: 'earthing'
      },
      {
        id: 'eq-exp-mcc-starter',
        nameFr: 'Tiroir Débrochable Centre Contrôle Moteur (MCC Forme 4b - 160 kW)',
        nameEn: 'Withdrawable Motor Control Center Bucket (MCC Form 4b - 160 kW)',
        voltage: '400 V • In = 315 A • Démarreur progressif & VFD',
        roleFr: 'Alimentation, commande et protection thermique/magnétique débrochable des moteurs asynchrones de procédé industriel.',
        roleEn: 'Withdrawable motor circuit protector, contactor, and soft-starter/VFD for industrial process motors.',
        symbol: 'MCC-160kW',
        standard: 'CEI 60947-4-1 / CEI 61439-2',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'motor'
      },
      {
        id: 'eq-exp-pfc-capacitor',
        nameFr: 'Batterie Automatique de Condensateurs Anti-Harmoniques (300 kvar - 7%)',
        nameEn: 'Detuned Automatic Capacitor Bank (300 kvar - 7% Reactor)',
        voltage: '400 V • 300 kvar • 6 gradins • Accord 189 Hz',
        roleFr: 'Rehaussement automatique du facteur de puissance (cos φ ≥ 0.95) avec selfs de détuning évitant la résonance parallèle.',
        roleEn: 'Automatic power factor correction (cos φ ≥ 0.95) with series detuning reactors blocking harmonic anti-resonance.',
        symbol: 'PFC-300k',
        standard: 'CEI 61921 / CEI 60831-1',
        imgUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
        calcTab: 'pfc'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Bilan de Puissance, Coefficients ku/ks & Dimensionnement Source',
        titleEn: 'Power Schedule, Diversity Factors & Source Transformer Sizing',
        descFr: 'Recensement exhaustif des récepteurs par usage, application des coefficients d\'utilisation (ku) et de foisonnement (ks), et dimensionnement du transformateur MT/BT et groupe secours.',
        descEn: 'Comprehensive load audit, application of utilization (ku) and diversity (ks) factors, and sizing of the supply transformer and standby generator.'
      },
      {
        phase: '02',
        titleFr: 'Choix du Schéma de Liaison à la Terre (SLT) & Architecture TGBT',
        titleEn: 'Earthing Scheme (SLT) Selection & Switchboard Segregation',
        descFr: 'Arbitrage technico-économique entre schémas TT, TN-S, TN-C et IT selon l\'activité du site, et sélection de la forme de séparation interne du TGBT (Forme 1 à 4b per CEI 61439-2).',
        descEn: 'Engineering selection between TT, TN-S, TN-C, and IT earthing systems based on facility operations, and choosing the internal segregation Form (Form 1 to 4b per IEC 61439-2).'
      },
      {
        phase: '03',
        titleFr: 'Calcul de Section des Câbles & Facteurs de Correction (NF C 15-105)',
        titleEn: 'Cable Sizing & Grouping/Temperature Derating Factors',
        descFr: 'Détermination de la section normalisée garantissant le courant admissible Iz = Iz0 · k1 · k2 · k3 ≥ In ≥ Ib, avec vérification de la chute de tension ΔU ≤ 3% (éclairage) ou 5% (force motrice).',
        descEn: 'Conductor cross-section determination satisfying Iz = Iz0 · k1 · k2 · k3 ≥ In ≥ Ib, and verifying permissible voltage sag ΔU ≤ 3% (lighting) or 5% (motors).'
      },
      {
        phase: '04',
        titleFr: 'Vérification des Délais de Coupure & Protection Chocs Électriques',
        titleEn: 'Disconnection Times Verification & Shock Hazard Clearance',
        descFr: 'Vérification du temps de coupure maximal prescrit par CEI 60364-4-41 (t ≤ 0.4 s en TN, t ≤ 0.2 s en TT sous 230 V), et calibrage des sensibilités différentielles DDR (30 mA pour prises).',
        descEn: 'Verification of maximum disconnection times per IEC 60364-4-41 (t ≤ 0.4 s in TN, t ≤ 0.2 s in TT at 230 V), and coordinating RCD sensitivity (30 mA for terminal socket outlets).'
      },
      {
        phase: '05',
        titleFr: 'Calcul des Courts-Circuits Icc & Sélectivité des Protections',
        titleEn: 'Short-Circuit Currents & Three-Tier Protection Discrimination',
        descFr: 'Calcul de l\'Icc maximal au jeu de barres (tenue Icu des disjoncteurs) et de l\'Icc minimal en bout de câble pour garantir le déclenchement instantané, avec coordination sélective 3 niveaux.',
        descEn: 'Calculation of maximum Icc at main busbar (Icu breaker rating) and minimum Icc at remote cable ends ensuring instant tripping, validated by 3-tier selective discrimination.'
      },
      {
        phase: '06',
        titleFr: 'Pose des Équipements, Serrage Dynamométrique & Équipotentialité',
        titleEn: 'Equipment Installation, Torque Verification & Equipotential Bonding',
        descFr: 'Cheminement en chemins de câbles selon NF C 15-100, contrôle du serrage au couple par clé dynamométrique marquée, et raccordement de la liaison équipotentielle principale (LEP) à la terre.',
        descEn: 'Cable tray routing per NF C 15-100, torque-wrench bolt inspection with tamper-evident marking, and bonding of the Main Equipotential Bonding (MEB) to the ground electrode.'
      },
      {
        phase: '07',
        titleFr: 'Essais Réglementaires, Contrôle Consuel & Audit Thermographique IR',
        titleEn: 'Regulatory Commissioning, Safety Certification & Infrared Thermal Audit',
        descFr: 'Mesure de résistance de terre (R ≤ 10 Ω), essais de temps/courant de déclenchement des différentiels DDR, mesure d\'isolement sous 500 Vcc, et inspection thermographique infrarouge sous pleine charge.',
        descEn: 'Ground resistance testing (R ≤ 10 Ω), RCD trip timing and ramp tests, 500 Vdc insulation resistance verification, and full-load infrared thermographic survey per IEC 60364-6.'
      }
    ],
    sectionE: [
      {
        id: 'tt_safety_calc',
        tabLabelFr: 'Sécurité Choc TT (RA · IΔn)',
        tabLabelEn: 'TT Touch Voltage Rule',
        titleFr: 'Condition de Sécurité contre les Chocs Électriques en Schéma TT',
        titleEn: 'Personnel Shock Protection Condition in TT Earthing Systems',
        descFr: 'Garantit que lors d\'un défaut d\'isolement franc sur un récepteur, la tension de contact présumée de la carcasse métallique ne peut excéder la tension limite conventionnelle de sécurité UL.',
        descEn: 'Ensures that on a phase-to-frame insulation fault, the presumptive touch voltage on metallic enclosures cannot exceed the statutory touch limit UL.',
        formula: 'R_A \\cdot I_{\\Delta n} \\le U_L \\quad \\iff \\quad I_{\\Delta n} \\le \\frac{U_L}{R_A}',
        formulaDescFr: 'Où RA est la résistance de la prise de terre des masses réceptrices (Ω), IΔn la sensibilité différentielle assignée du disjoncteur différentiel (A), et UL la tension limite de sécurité (50 V en local sec, 25 V en local humide).',
        formulaDescEn: 'Where RA is the earth electrode resistance (Ω), IΔn is the nominal residual operating current of the RCD (A), and UL is the conventional safety touch limit (50 V dry, 25 V wet environments).',
        assumptionsFr: [
          'Tension limite conventionnelle de sécurité UL = 50 V (locaux secs standards).',
          'Tension de contact maximale en local humide ou extérieur UL = 25 V.',
          'Pour une prise de terre de 100 Ω, le calibre maximal du DDR de tête est : IΔn ≤ 50 / 100 = 500 mA (en pratique 300 mA sélectif).'
        ],
        assumptionsEn: [
          'Conventional safe touch voltage UL = 50 V for normal dry locations.',
          'Stricter touch limit UL = 25 V in damp/wet premises and outdoor installations.',
          'For a 100 Ω ground electrode, maximum permissible upstream RCD rating is 500 mA (typically 300 mA time-delayed).'
        ],
        calcTab: 'earthing'
      },
      {
        id: 'tn_loop_impedance_disconnect',
        tabLabelFr: 'Boucle Défaut TN (Id ≥ Ia)',
        tabLabelEn: 'TN Loop Impedance (Id ≥ Ia)',
        titleFr: 'Impédance de Boucle de Défaut & Temps de Coupure en Schéma TN',
        titleEn: 'Fault Loop Impedance & Automatic Disconnection in TN Systems',
        descFr: 'Vérifie que le courant de court-circuit phase-PE Id généré lors d\'un défaut d\'isolement est suffisant pour déclencher instantanément le disjoncteur dans le temps prescrit t ≤ 0.4 s.',
        descEn: 'Verifies that phase-to-PE short-circuit current Id generated during an insulation fault is large enough to instantaneously trip the circuit breaker within t ≤ 0.4 s.',
        formula: 'I_d = \\frac{U_0}{Z_s} = \\frac{U_0}{\\sqrt{(R_{ph} + R_{PE})^2 + (X_{ph} + X_{PE})^2}} \\ge I_a',
        formulaDescFr: 'Avec U0 tension simple nominale (230 V), Zs impédance totale de la boucle de défaut (amont + câble phase + conducteur PE), et Ia courant assurant le déclenchement magnétique instantané.',
        formulaDescEn: 'With U0 nominal phase voltage (230 V), Zs total fault loop impedance (source + phase conductor + PE conductor), and Ia current operating the instantaneous magnetic trip.',
        assumptionsFr: [
          'Tension simple nominale de référence U0 = 230 V AC (50 Hz).',
          'Courant de déclenchement magnétique : Ia = 5 · In (Courbe B), Ia = 10 · In (Courbe C), Ia = 14 · In (Courbe D).',
          'Temps de coupure maximal normalisé selon CEI 60364-4-41 : t ≤ 0.4 s pour circuits terminaux ≤ 63 A.'
        ],
        assumptionsEn: [
          'Nominal phase-to-neutral voltage U0 = 230 V AC (50 Hz).',
          'Instantaneous magnetic trip thresholds: Ia = 5 · In (Curve B), Ia = 10 · In (Curve C), Ia = 14 · In (Curve D).',
          'Maximum disconnection time per IEC 60364-4-41: t ≤ 0.4 s for branch circuits ≤ 63 A.'
        ],
        calcTab: 'cable-short-circuit'
      },
      {
        id: 'cable_voltage_drop_lv',
        tabLabelFr: 'Chute de Tension ΔU (BT)',
        tabLabelEn: 'LV Voltage Drop (ΔU)',
        titleFr: 'Calcul de la Chute de Tension Triphasée et Monophasée (NF C 15-105)',
        titleEn: 'Three-Phase & Single-Phase Low-Voltage Drop Calculation',
        descFr: 'Garantit que la chute de tension relative entre l\'origine de l\'installation TGBT et le récepteur terminal le plus éloigné respecte les seuils normatifs (≤ 3% éclairage, ≤ 5% force motrice).',
        descEn: 'Ensures total relative voltage drop between main switchboard and furthest consumer terminal satisfies statutory limits (≤ 3% lighting, ≤ 5% motors).',
        formula: '\\Delta U = b \\cdot \\left( \\frac{\\rho \\cdot L}{S} \\cos\\varphi + \\lambda \\cdot L \\cdot \\sin\\varphi \\right) \\cdot I_b \\quad [\\text{V}] \\quad \\iff \\quad \\Delta u\\% = \\frac{\\Delta U}{U_n} \\cdot 100',
        formulaDescFr: 'Avec b = 1 en triphasé équilibré (b = 2 en monophasé), ρ = 0.023 Ω·mm²/m pour le cuivre au régime chaud (0.037 Al), L longueur (m), S section (mm²), et λ = 0.08 mΩ/m.',
        formulaDescEn: 'With b = 1 for three-phase (b = 2 for single-phase), ρ = 0.023 Ω·mm²/m for copper at operating temperature (0.037 for aluminum), L length (m), S section (mm²), and λ = 0.08 mΩ/m.',
        assumptionsFr: [
          'Chute de tension maximale admise : 3% pour l\'éclairage, 5% pour les autres usages (force motrice).',
          'Résistivité calculée à pleine charge thermique : 80°C pour PVC, 90°C pour PR/XLPE.',
          'Facteur de puissance par défaut : cos φ = 0.80 pour moteurs, cos φ = 0.95 pour éclairage LED.'
        ],
        assumptionsEn: [
          'Maximum permitted voltage sag: 3% for lighting circuits, 5% for other loads (process motors).',
          'Resistivity evaluated at peak operating temperature: 80°C for PVC, 90°C for XLPE.',
          'Default load power factors: cos φ = 0.80 for motor drives, cos φ = 0.95 for LED luminaires.'
        ],
        calcTab: 'voltage-drop'
      },
      {
        id: 'lv_cable_sizing_iz',
        tabLabelFr: 'Courant Admissible Câble (Iz)',
        tabLabelEn: 'Cable Thermal Capacity (Iz)',
        titleFr: 'Courant Admissible et Facteurs de Déclassement selon CEI 60364-5-52',
        titleEn: 'Conductor Current Carrying Capacity & Derating Factors',
        descFr: 'Détermination du courant admissible assigné Iz garantissant que l\'échauffement en régime continu ne dépasse pas la température maximale admissible de l\'isolant (70°C PVC, 90°C PRC).',
        descEn: 'Determination of corrected ampacity Iz ensuring steady-state conductor heating remains below insulation temperature limits (70°C PVC, 90°C XLPE).',
        formula: 'I_z = I_{z0} \\cdot k_1 \\cdot k_2 \\cdot k_3 \\ge I_n \\ge I_b',
        formulaDescFr: 'Où Iz0 est le courant admissible de référence du mode de pose, k1 le facteur de pose, k2 le facteur de groupement de circuits contigus, et k3 le facteur de température ambiante.',
        formulaDescEn: 'Where Iz0 is the baseline current capacity for the installation method, k1 installation factor, k2 grouping derating factor, and k3 ambient temperature factor.',
        assumptionsFr: [
          'Règle de coordination triple : Ib ≤ In ≤ Iz (Ib courant d\'emploi, In calibre du disjoncteur, Iz courant admissible).',
          'Facteur de température ambiante en milieu tropical (Cameroun, 40°C air) : k3 = 0.91 pour PR (vs 1.0 à 30°C).',
          'Facteur de groupement de 6 câbles jointifs sur chemin de câbles perforé : k2 = 0.72.'
        ],
        assumptionsEn: [
          'Triple coordination rule: Ib ≤ In ≤ Iz (Ib design current, In breaker rating, Iz permissible ampacity).',
          'Tropical ambient temperature derating (Cameroon baseline, 40°C air): k3 = 0.91 for XLPE (vs 1.0 at 30°C).',
          'Grouping derating factor for 6 bunched circuits on perforated cable tray: k2 = 0.72.'
        ],
        calcTab: 'voltage-drop'
      },
      {
        id: 'motor_starting_voltage_dip',
        tabLabelFr: 'Creux Démarrage Moteur (ΔUstart)',
        tabLabelEn: 'Motor Starting Voltage Dip',
        titleFr: 'Creux de Tension Transitoire au Démarrage des Moteurs Asynchrones',
        titleEn: 'Transient Busbar Voltage Dip During Induction Motor Starting',
        descFr: 'Modélisation du creux de tension provoqué sur le jeu de barres TGBT par l\'appel de courant de démarrage du moteur, afin d\'éviter le décollement intempestif des contacteurs (limite ≤ 10%).',
        descEn: 'Models switchboard busbar voltage dip caused by induction motor inrush current, preventing contactor drop-out and system instability (threshold ≤ 10%).',
        formula: '\\Delta U_{\\text{start}}\\% = \\frac{S_{\\text{start}}}{S_{cc} + S_{\\text{start}}} \\cdot 100 \\approx \\frac{k_{\\text{start}} \\cdot \\frac{P_n}{\\eta \\cos\\varphi}}{S_{cc}} \\cdot 100',
        formulaDescFr: 'Où Sstart est la puissance apparente de démarrage du moteur (kVA), Scc la puissance de court-circuit du jeu de barres TGBT (kVA), et k_start le ratio courant de démarrage / courant nominal.',
        formulaDescEn: 'Where Sstart is apparent starting power (kVA), Scc is switchboard short-circuit capacity (kVA), and k_start is the starting-to-nominal current ratio.',
        assumptionsFr: [
          'Creux de tension admissible maximal sur le jeu de barres : ≤ 10% (NF C 15-100).',
          'Puissance de court-circuit du transformateur source Scc = Strafo / Uk% (ex: 1000 kVA à Uk=5% -> Scc = 20 MVA).',
          'Ratio k_start selon mode de démarrage : DOL (6 à 8), Étoile-Triangle (2.5 à 3), Démarreur progressif (1.5 à 2.5).'
        ],
        assumptionsEn: [
          'Maximum permitted switchboard voltage dip: ≤ 10% per NF C 15-100.',
          'Source transformer short-circuit capacity Scc = Strafo / Uk% (e.g., 1000 kVA at Uk=5% -> Scc = 20 MVA).',
          'Starting ratio k_start: Direct-on-Line DOL (6 to 8), Star-Delta (2.5 to 3), Soft-Starter (1.5 to 2.5).'
        ],
        calcTab: 'motor'
      },
      {
        id: 'pfc_capacitor_sizing',
        tabLabelFr: 'Compensation Réactif & PFC (Qc)',
        tabLabelEn: 'Power Factor Correction (Qc)',
        titleFr: 'Dimensionnement de la Batterie de Condensateurs et Filtrage de Détuning',
        titleEn: 'Capacitor Bank Sizing & Detuned Harmonic Filter Tuning',
        descFr: 'Calcul de la puissance réactive capacitive Qc indispensable pour annuler les pénalités d\'énergie réactive ENEO (cos φ ≥ 0.95), avec inductance anti-harmonique accordée à 189 Hz (7%).',
        descEn: 'Calculates required capacitive reactive power Qc to eliminate utility power factor penalties (target cos φ ≥ 0.95), with 7% series detuning reactor blocking harmonic anti-resonance.',
        formula: 'Q_c = P \\cdot (\\tan\\varphi_1 - \\tan\\varphi_2) \\quad [\\text{kvar}] \\quad \\text{avec} \\quad f_r = \\frac{1}{2\\pi \\sqrt{L \\cdot C}} = f_1 \\cdot \\sqrt{\\frac{1}{p}}',
        formulaDescFr: 'Où P est la puissance active appelée (kW), tan φ1 le facteur initial, tan φ2 le facteur cible (tan φ2 = 0.33 pour cos φ = 0.95), et p le taux de détuning de la self (p = 7% -> fr = 189 Hz).',
        formulaDescEn: 'Where P is active demand (kW), tan φ1 is initial ratio, tan φ2 is target ratio (tan φ2 = 0.33 for cos φ = 0.95), and p is reactor detuning factor (p = 7% -> fr = 189 Hz).',
        assumptionsFr: [
          'Seuil de facturation ENEO Cameroun : pénalités appliquées dès que tan φ dépasse 0.40 (cos φ < 0.93).',
          'Accord anti-harmonique standard p = 7% (189 Hz à 50 Hz) protégeant contre les rangs harmoniques 5 (250 Hz) et 7 (350 Hz).',
          'Gradins automatiques commandés par relais varmétrique à microprocesseur pour éviter toute surcompensation à vide.'
        ],
        assumptionsEn: [
          'Cameroon utility billing threshold: penalty billed when tan φ exceeds 0.40 (cos φ < 0.93).',
          'Standard 7% detuning factor (tuning frequency 189 Hz at 50 Hz fundamental) protecting against 5th and 7th harmonics.',
          'Microprocessor-controlled multistage switching preventing dangerous overcompensation under light load.'
        ],
        calcTab: 'pfc'
      }
    ],
    sectionF: [
      {
        code: 'NF C 15-100',
        tag: 'BASSE TENSION',
        titleFr: 'Installations Électriques à Basse Tension — Règles Fondamentales de Conception & Réalisation',
        titleEn: 'Low Voltage Electrical Installations — Design, Erection and Verification Rules',
        descFr: 'Norme obligatoire pour toutes les installations domestiques, tertiaires et industrielles : régimes de neutre TT/TN/IT, calibres, protections différentielles 30 mA et volumes de sécurité.',
        descEn: 'Mandatory standard governing all low-voltage electrical design: earthing schemes (TT, TN, IT), conductor ratings, 30 mA life-safety RCDs, and wet-room safety zones.'
      },
      {
        code: 'CEI 60364-4-41',
        tag: 'SÉCURITÉ DES PERSONNES',
        titleFr: 'Protection pour Assurer la Sécurité — Protection contre les Chocs Électriques',
        titleEn: 'Protection for Safety — Protection Against Electric Shock',
        descFr: 'Standard international définissant les conditions de coupure automatique de l\'alimentation, les tensions limites de contact UL (50 V / 25 V) et les temps de déconnexion maximaux.',
        descEn: 'International standard establishing automatic disconnection rules, touch voltage safety thresholds UL (50 V / 25 V), and maximum permissible disconnection times.'
      },
      {
        code: 'CEI 61439-1 / CEI 61439-2',
        tag: 'ENSEMBLES TGBT & MCC',
        titleFr: 'Ensembles d\'Appareillage à Basse Tension — Tableaux de Puissance TGBT et Centres de Contrôle MCC',
        titleEn: 'Low-Voltage Switchgear and Controlgear Assemblies — Power Switchboards & Motor Control Centers',
        descFr: 'Spécifications de construction et d\'essais des armoires TGBT industrielles : formes de séparation interne 1 à 4b, échauffement thermique, tenue électrodynamique Icw et indice IP/IK.',
        descEn: 'Construction and type-test requirements for industrial low-voltage switchboards: internal segregation forms 1 to 4b, temperature rise limits, and short-circuit withstand Icw.'
      },
      {
        code: 'NF C 15-105',
        tag: 'GUIDE DE CALCUL',
        titleFr: 'Détermination des Sections de Conducteurs et Choix des Dispositifs de Protection',
        titleEn: 'Practical Sizing Guide for Conductor Cross-Sections and Protection Devices',
        descFr: 'Méthode normative de calcul de la chute de tension ΔU, des courants admissibles Iz selon les modes de pose, des contraintes thermiques de court-circuit et des longueurs maximales.',
        descEn: 'Normative engineering guide for calculating voltage drop, derated conductor ampacities Iz, short-circuit thermal stresses, and maximum protected run lengths.'
      },
      {
        code: 'CEI 60947-2 / CEI 60947-4-1',
        tag: 'APPAREILLAGE BASSE TENSION',
        titleFr: 'Appareillage à Basse Tension — Disjoncteurs Industriels & Contacteurs-Démarreurs',
        titleEn: 'Low-Voltage Switchgear — Industrial Circuit Breakers & Motor Contactors/Starters',
        descFr: 'Règles de performance des disjoncteurs ouverts (ACB) et boîtiers moulés (MCCB) : pouvoirs de coupure ultime Icu et de service Ics, tenue Icw, et coordination moteur type 1 et 2.',
        descEn: 'Performance benchmarks for air circuit breakers (ACB) and molded-case breakers (MCCB): breaking capacity Icu/Ics, short-time withstand Icw, and motor starter coordination Type 1/2.'
      },
      {
        code: 'CEI 60364-6',
        tag: 'VÉRIFICATION & ESSAIS',
        titleFr: 'Installations Électriques à Basse Tension — Vérification Initiale et Périodique',
        titleEn: 'Low-Voltage Electrical Installations — Initial and Periodic Verification',
        descFr: 'Protocoles de contrôle et de mise en service : mesure de continuité des conducteurs PE, résistance d\'isolement sous 500 Vcc (≥ 1 MΩ), temps/courant de déclenchement des DDR et thermographie IR.',
        descEn: 'Mandatory commissioning testing protocols: PE conductor continuity, 500 Vdc insulation resistance (≥ 1 MΩ), RCD trip timing and ramp testing, and infrared thermal surveys.'
      }
    ]
  },

  // D11: Protections, Mesures & Études de Réseau
  D11: {
    domainCode: 'D11',
    sectionA: {
      roleFr: "Détection ultra-rapide des défauts électriques (courts-circuits triphasés, biphasés, défauts phase-terre, ruptures d'isolement), discrimination sélective instantanée et émission d'ordres de déclenchement pour isoler les sections défaillantes en garantissant la stabilité dynamique globale du réseau interconnecté.",
      roleEn: 'Ultra-fast electrical fault detection (three-phase, phase-to-phase, phase-to-earth faults, insulation breakdowns), absolute selective discrimination, and high-speed tripping to isolate faulty sections while preserving global interconnected grid dynamic stability.',
      inputsFr: {
        title: 'Réducteurs de Mesure TC/TT & Capteurs LPIT Numériques',
        desc: 'Signaux analogiques secondaires normalisés 1 A / 5 A (Transformateurs de Courant 5P20/TPX/TPY) et 100 V / 110 V (Transformateurs de Tension capacitifs ou inductifs), ou trames numériques de valeurs échantillonnées (Sampled Values CEI 61850-9-2 LE / CEI 61869-9 issues d\'Unités de Fusion Merging Units).',
        voltage: 'Secondaires normalisés 1 A / 5 A, 100 V / 110 V • Échantillonnage SV 4 000 / 4 800 Hz'
      },
      inputsEn: {
        title: 'Instrument Transformers CT/VT & Digital LPIT Sensors',
        desc: 'Standardized secondary analog signals 1 A / 5 A (Current Transformers 5P20/TPX/TPY) and 100 V / 110 V (Capacitive or Inductive Voltage Transformers), or digital Sampled Values streams (IEC 61850-9-2 LE / IEC 61869-9 from Stand-Alone Merging Units).',
        voltage: 'Standardized secondaries 1 A / 5 A, 100 V / 110 V • Sampled Values 4,000 / 4,800 Hz'
      },
      processFr: {
        title: 'Algorithmes Numériques d\'Extraction Phasorielle & Logique ANSI',
        desc: 'Filtrage numérique de Fourier (DFT) réjecteur d\'harmoniques, décomposition instantanée en composantes symétriques de Fortescue (directe, inverse, homopolaire), comparaison vectorielle différentielle stabilisée à pourcentage, caractéristiques de distance polygonales/mho, retenue d\'harmonique 2 (inrush) et 5 (surfluxage), et téléprotection ultra-rapide (POTT/PUTT via OPGW).',
        note: 'Temps total d\'élimination de défaut : ≤ 60 à 80 ms (relais numérique 15-25 ms + disjoncteur SF6 40-50 ms)'
      },
      processEn: {
        title: 'Numerical Phasor Extraction Algorithms & ANSI Protection Logic',
        desc: 'Discrete Fourier Transform (DFT) harmonic-rejection filtering, instantaneous Fortescue symmetrical component decomposition (positive, negative, zero sequence), percentage-biased differential comparison, polygonal/mho distance zones, 2nd harmonic inrush and 5th harmonic overexcitation restraint, and ultra-fast teleprotection schemes (POTT/PUTT via OPGW).',
        note: 'Total fault clearance duration: ≤ 60 to 80 ms (numerical IED 15-25 ms + SF6 breaker 40-50 ms)'
      },
      outputsFr: {
        title: 'Ordres de Déclenchement Sélectif, Automatismes & COMTRADE',
        desc: 'Contacts statiques ultra-rapides (< 1 ms) vers bobines à émission des disjoncteurs, émission de trames GOOSE CEI 61850-8-1 (latence réseau < 3 ms), réenclenchement automatique 79 mono/tripolaire, téléaction de délestage d\'urgence par sous-fréquence 81U/df/dt, et archivage oscilloperturbographique normalisé IEEE COMTRADE.',
        earthing: 'Coordination homopolaire 51N/67N calée sur le régime de neutre (mis à la terre direct 225 kV, impédant 30 kV ou Petersen)'
      },
      outputsEn: {
        title: 'Selective Trip Commands, Automation Cycles & COMTRADE Records',
        desc: 'Ultra-fast solid-state trip outputs (< 1 ms) to circuit breaker shunt coils, IEC 61850-8-1 GOOSE messaging (< 3 ms network latency), 79 single/three-pole auto-reclosing sequences, under-frequency 81U/df/dt load shedding tele-tripping, and IEEE COMTRADE transient disturbance recording.',
        earthing: 'Residual 51N/67N ground protection coordinated with system earthing (solidly grounded 225 kV, impedance/Petersen 30 kV)'
      }
    },
    sectionB: {
      summaryFr: 'Plans de protection des réseaux interconnectés : principes différentiels unitaires haute vitesse, sélectivité ampèremétrique et chronométrique échelonnée, protection de distance numérique et schémas directifs de terre.',
      summaryEn: 'High-voltage grid protection schemes: high-speed unit differential principles, time-graded directional overcurrent discrimination, numerical distance protection, and sensitive earth fault schemes.',
      architectures: [
        {
          nameFr: 'Protection Différentielle de Ligne 225 kV & Distance Numérique (ANSI 87L / 21/21N)',
          nameEn: '225 kV Line Current Differential & Distance Protection (ANSI 87L / 21/21N)',
          techFr: 'Double chaîne différentielle optique 87L sur OPGW et impédance de distance quadrilatérale 21/21N multi-zones',
          techEn: 'Dual-channel optical current differential 87L over OPGW and multi-zone quadrilateral distance protection 21/21N',
          descFr: 'Protection unitaire absolue par comparaison vectorielle cycle-à-cycle des courants d\'extrémités via canal télécom numérique dédié (OPGW), secondée par un algorithme de distance à 4 zones (Zone 1 instantanée à 85%, Zone 2 à 120% temporisée à 350 ms, Zone 3 amont et zone inverse) avec schéma de téléprotection POTT/PUTT. Déployée sur les dorsales 225 kV Nachtigal-Yaoundé et Mangombé-Oyomabang.',
          descEn: 'Absolute unit protection by cycle-by-cycle vector comparison of terminal currents via dedicated digital OPGW telecom links, backed by a 4-zone quadrilateral distance scheme (Zone 1 instantaneous 85%, Zone 2 120% at 350 ms, Zone 3 and reverse) with POTT/PUTT teleprotection logic. Standardized on the Nachtigal-Yaoundé and Mangombé-Oyomabang 225 kV backbones.',
          standard: 'CEI 60255-187-1 / IEEE C37.113',
          metricFr: 'Temps d\'action 87L : 15 à 22 ms • Zone 1 : < 20 ms',
          metricEn: '87L operating time: 15 to 22 ms • Zone 1: < 20 ms'
        },
        {
          nameFr: 'Protection Différentielle de Bloc Générateur-Transformateur (ANSI 87G / 87T / 87U)',
          nameEn: 'Generator-Transformer Unit Differential Scheme (ANSI 87G / 87T / 87U)',
          techFr: 'Caractéristique différentielle stabilisée à double pente avec filtrage harmonique 2 (inrush) et 5 (surfluxage)',
          techEn: 'Dual-slope percentage-biased differential with 2nd harmonic inrush and 5th harmonic overexcitation restraint',
          descFr: 'Protection unitaire instantanée du groupe de production et de son transformateur élévateur (ex. 7 x 60 MW Nachtigal). Élimine les erreurs dues aux courants magnétisants d\'enclenchement par blocage harmonique 2 (seuil 15%) et prévient les déclenchements intempestifs sur défauts externes grâce à une pente de retenue adaptative (pente 1 : 20%, pente 2 : 60% au-delà du courant nominal). Intègre la compensation logicielle d\'indice horaire (YNd11).',
          descEn: 'Instantaneous unit protection for turbine-generator sets and step-up power transformers (e.g., 7 x 60 MW Nachtigal). Eliminates nuisance tripping during transformer energization via 2nd harmonic cross-blocking (15% threshold) and provides high security during external faults via adaptive dual-slope restraint (Slope 1: 20%, Slope 2: 60%). Incorporates automatic software vector group compensation (YNd11).',
          standard: 'CEI 60255-187-1 / IEEE C37.102',
          metricFr: 'Temps de déclenchement interne : < 25 ms • Taux de retenue H2 : 15%',
          metricEn: 'Internal fault trip time: < 25 ms • H2 restraint threshold: 15%'
        },
        {
          nameFr: 'Protection Différentielle Haute Vitesse de Jeu de Barres Numérique (ANSI 87B)',
          nameEn: 'Numerical Busbar High-Speed Differential Protection (ANSI 87B)',
          techFr: 'Architecture décentralisée bay-unit / central-unit avec critère de saturation TC cycle-à-cycle',
          techEn: 'Distributed bay-unit / central-unit architecture with cycle-by-cycle CT saturation detection algorithm',
          descFr: 'Protection différentielle ultra-rapide des jeux de barres 225 kV et 90 kV double-barres avec couplage. Chaque travée mesure ses courants via une unité de travée (Bay Unit) et transmet les phaseurs à l\'unité centrale (Central Unit). Un algorithme de détection de saturation prévient tout déclenchement intempestif sur court-circuit externe avec TC saturé, tout en garantissant un déclenchement franc en moins de 15 ms en cas de défaut sur barre.',
          descEn: 'Ultra-high-speed differential protection for 225 kV and 90 kV double-busbar configurations with bus coupler. Each bay samples currents through a Bay Unit and transmits phase data to the Central Unit. A sophisticated CT saturation detection algorithm prevents false tripping during close-in external faults with saturated CTs, while ensuring clear tripping in under 15 ms on true internal bus faults.',
          standard: 'CEI 60255-187-2 / IEEE C37.234',
          metricFr: 'Temps total de déclenchement : ≤ 12 à 15 ms • Jusqu\'à 32 travées',
          metricEn: 'Total trip duration: ≤ 12 to 15 ms • Up to 32 bays supported'
        },
        {
          nameFr: 'Coordination Sélective Ampèremétrique & Chronométrique HTA (ANSI 50/51 - 50N/51N)',
          nameEn: 'MV Feeder Time-Graded Overcurrent Coordination (ANSI 50/51 - 50N/51N)',
          techFr: 'Courbes normalisées à temps inverse CEI (Normalement / Très / Extrêmement Inverse) et réenclencheurs 79',
          techEn: 'Standard IEC inverse definite minimum time (IDMT) curves with auto-recloser 79 cycles',
          descFr: 'Plan de protection échelonné pour départs HTA radiaux 30 kV et 15 kV (ex. réseaux urbains et périurbains ENEO). Coordination chronométrique rigoureuse avec un intervalle de sélectivité Δt = 300 ms entre disjoncteur d\'arrivée transformateur HTB/HTA, disjoncteurs de départs et réenclencheurs en ligne (reclosers), assurant l\'élimination du défaut par l\'organe le plus proche sans coupure générale.',
          descEn: 'Graded protection scheme for 30 kV and 15 kV radial MV feeders (e.g., ENEO urban and peri-urban networks). Strict chronometric time grading with a discrimination margin Δt = 300 ms between substation incomers, outgoing feeder breakers, and downstream line reclosers, ensuring the protective device closest to the fault opens without causing wide-area blackouts.',
          standard: 'CEI 60255-151 / IEEE C37.112',
          metricFr: 'Intervalle de sélectivité : Δt = 250 à 300 ms • Précision temps : ±5%',
          metricEn: 'Discrimination step: Δt = 250 to 300 ms • Timing accuracy: ±5%'
        },
        {
          nameFr: 'Protection Terre Directive Réseau à Neutre Compensé / Impédant (ANSI 67N / Wattmétrique)',
          nameEn: 'Directional Ground Fault Protection for Resonant/Impedance Grids (ANSI 67N / Wattmetric)',
          techFr: 'Mesure de puissance homopolaire active P0 = 3·V0·I0·cos(φ0) et transitoire quator/cosinus',
          techEn: 'Zero-sequence active power computation P0 = 3·V0·I0·cos(φ0) and quator transient directional detection',
          descFr: 'Détection sélective ultra-sensible des défauts monophasés à la terre sur les réseaux HTA 30 kV dont le neutre est mis à la terre par résistance de limitation (ex. 20 à 40 A) ou bobine de compensation de Petersen. Le relais analyse le déphasage entre la tension résiduelle V0 et le courant résiduel I0 pour isoler avec certitude le départ en défaut même lorsque le courant de défaut est très inférieur au courant de charge nominal.',
          descEn: 'Ultra-sensitive directional detection of single-phase-to-ground faults on 30 kV MV distribution networks grounded via neutral grounding resistors (e.g., 20 to 40 A) or Petersen compensating coils. The relay calculates the phase relationship between residual displacement voltage V0 and residual zero-sequence current I0 to pinpoint the faulted feeder even when fault current is far below nominal load.',
          standard: 'CEI 60255-151 / CIGRE TB 784',
          metricFr: 'Sensibilité résiduelle : I0 ≥ 0.2 A • Seuil tension résiduelle V0 : 1% Un',
          metricEn: 'Residual sensitivity: I0 ≥ 0.2 A • Residual voltage threshold V0: 1% Un'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-relay-ied-61850',
        nameFr: 'Relais Numérique Multifonction de Protection IED (SIPROTEC 5 / MiCOM P643)',
        nameEn: 'Multifunctional Protection Numerical IED (SIPROTEC 5 / MiCOM P643)',
        voltage: 'Alimentation 110/220 Vcc • Entrées analogiques 1 A / 5 A & 100 V',
        roleFr: 'Acquisition des grandeurs électriques par filtrage DFT, exécution des fonctions ANSI 50/51/87/21/67N, logique d\'automatisme de poste CFC, émission d\'ordres de déclenchement statiques (< 1 ms), synchronisation temporelle IEEE 1588 PTP et consignation COMTRADE.',
        roleEn: 'High-speed analog acquisition via DFT filtering, ANSI 50/51/87/21/67N execution, CFC substation automation logic, high-speed solid-state tripping (< 1 ms), IEEE 1588 PTP time synchronization, and IEEE COMTRADE fault recording.',
        symbol: 'IED-PROT',
        standard: 'CEI 60255-1 / CEI 61850-8-1',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        calcTab: 'relay-tcc'
      },
      {
        id: 'eq-exp-ct-225k',
        nameFr: 'Transformateur de Courant HTB 225 kV Classe Protection (5P20 / TPX)',
        nameEn: 'HV 225 kV Protection Instrument Current Transformer (5P20 / TPX)',
        voltage: 'Tension assignée 245 kV • Primaire 600-1200-2400 A • Secondaire 1 A / 5 A',
        roleFr: 'Mesure fidèle et reproduction linéaire des courants de court-circuit symétriques et asymétriques jusqu\'à 20 fois le courant nominal sans saturation magnétique prématurée du noyau de protection, garantissant l\'exactitude des calculs différentiels et de distance.',
        roleEn: 'Accurate and linear reproduction of symmetrical and asymmetrical subtransient short-circuit currents up to 20 times rated current without premature core saturation, ensuring computational fidelity for unit differential and distance relays.',
        symbol: 'TC-225KV',
        standard: 'CEI 61869-2',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'ct-sizing'
      },
      {
        id: 'eq-exp-vt-225k',
        nameFr: 'Transformateur de Tension Capacitif 225 kV avec Raccordement CPL (CVT)',
        nameEn: '225 kV Capacitor Voltage Transformer with PLC Coupling (CVT)',
        voltage: '225/√3 kV primaire • 100/√3 V & 100/3 V secondaires • Classe 0.2 / 3P',
        roleFr: 'Diviseur de tension capacitif pour l\'alimentation des organes de mesure de tension (ANSI 21/27/59) et filtre passe-bas pour l\'injection de signaux de télécommunication par courant porteur en ligne (CPL) sur le réseau de transport 225 kV.',
        roleEn: 'Capacitive voltage divider supplying accurate potential signals to protection relays (ANSI 21/27/59) and power quality instruments, while doubling as carrier-frequency coupling capacitor for power line carrier (PLC) teleprotection signals.',
        symbol: 'TT-225KV',
        standard: 'CEI 61869-5',
        imgUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        calcTab: 'transmission-line'
      },
      {
        id: 'eq-test-set-omicron',
        nameFr: 'Valise d\'Essai Triphasée d\'Injection Secondaire Numérique (Omicron CMC 356)',
        nameEn: 'Universal Secondary Injection Protection Test Set (Omicron CMC 356)',
        voltage: 'Générateurs 6 x 32 A (ou 1 x 128 A) • 4 x 300 V • Sync GPS/PTP',
        roleFr: 'Génération de courants et tensions triphasés haute précision pour l\'étalonnage des seuils de relais, le tracé des courbes temps-courant TCC, la validation de la caractéristique de distance Z(R,X), et la relecture transitoire de fichiers COMTRADE.',
        roleEn: 'High-precision secondary current and voltage injection kit for testing and verifying numerical protection relays, plotting TCC curves, confirming impedance boundary characteristics, and replaying real-world COMTRADE transient disturbance files.',
        symbol: 'TEST-SET',
        standard: 'CEI 60255-21 / IEEE C37.90',
        imgUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
        calcTab: 'relay-tcc'
      },
      {
        id: 'eq-exp-trip-circuit-relay',
        nameFr: 'Relais de Surveillance Permanente de Circuit de Déclenchement (ANSI 74TC)',
        nameEn: 'Trip Circuit Continuous Supervision & Lockout Relay (ANSI 74TC / 86)',
        voltage: 'Tension auxiliaire 110 Vcc / 220 Vcc • Injection de courant de veille < 2 mA',
        roleFr: 'Surveillance continue de l\'intégrité galvanique de la bobine de déclenchement à émission du disjoncteur et de sa filerie en position ouverte comme fermée, avec émission d\'une alarme instantanée en cas de coupure de circuit ou perte de tension continue.',
        roleEn: 'Continuous galvanic loop monitoring of circuit breaker trip coils and secondary cabling in both breaker open and closed positions, immediately generating alarms upon wire breakage, supply failure, or auxiliary switch open-circuit.',
        symbol: 'RL-74TC',
        standard: 'CEI 60255-27 / ANSI C37.90',
        imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-merging-unit-61850',
        nameFr: 'Unité de Fusion Numérique de Tranche Merging Unit (CEI 61850-9-2 LE / 61869-9)',
        nameEn: 'Stand-Alone Merging Unit SAMU for Process Bus (IEC 61850-9-2 LE / 61869-9)',
        voltage: 'Entrées 1 A / 5 A & 100 V • Sortie Ethernet optique 100Base-FX SV 4.8 kHz',
        roleFr: 'Numérisation haute fréquence synchrone des signaux de courant et de tension au plus près des réducteurs de mesure en baie extérieure, et diffusion en temps réel de trames Sampled Values (SV) horodatées par IEEE 1588 PTP vers le bus de processus.',
        roleEn: 'Synchronous high-speed digitization of current and voltage signals directly in the substation switchyard, publishing standardized Sampled Values (SV) Ethernet multicast streams time-stamped via IEEE 1588 PTP over the station process bus.',
        symbol: 'SAMU-61850',
        standard: 'CEI 61850-9-2 / CEI 61869-9',
        imgUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        calcTab: 'relay-tcc'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Philosophie de Protection & Cahier des Charges Fonctionnel',
        titleEn: 'Protection Philosophy & Functional Specification',
        descFr: 'Définition des principes de protection du réseau : duplication Main 1 / Main 2 à technologies hétérogènes, allocation des fonctions unitaires et de secours, sélection du régime de neutre et matrice de déclenchement préliminaire.',
        descEn: 'Establishing grid protection principles: Main 1 / Main 2 dual-redundancy using heterogeneous vendor platforms, defining unit vs backup functions, selecting grounding criteria, and developing the preliminary trip matrix.'
      },
      {
        phase: '02',
        titleFr: 'Calcul des Courants de Court-Circuit Max & Min (CEI 60909)',
        titleEn: 'Max & Min Short-Circuit Fault Calculations (IEC 60909)',
        descFr: 'Modélisation du réseau sous logiciel de calcul électrotechnique (DIgSILENT PowerFactory / ETAP). Détermination des courants de court-circuit subtransitoires triphasés Ik"max (pouvoir de coupure) et biphasés/monophasés Ik"min en bout de ligne (sensibilité).',
        descEn: 'Power system modeling using analytical software (DIgSILENT / ETAP). Computing three-phase subtransient fault current Ik"max for breaker rating and minimum line-end phase-to-ground Ik"min for relay pickup sensitivity verification.'
      },
      {
        phase: '03',
        titleFr: 'Dimensionnement & Vérification de Non-Saturation des TC',
        titleEn: 'Current Transformer Sizing & Knee-Point Saturation Check',
        descFr: 'Calcul de la tension de coude requise Vk selon la norme CEI 61869-2, vérification du facteur de surdimensionnement transitoire Ktd avec la constante de temps L/R du réseau, et contrôle du fardeau secondaire total (filerie + relais).',
        descEn: 'Calculating minimum required knee-point voltage Vk per IEC 61869-2, verifying transient dimensioning factor Ktd against primary system L/R time constants, and checking secondary loop resistance (cabling + relay burden).'
      },
      {
        phase: '04',
        titleFr: 'Établissement du Carnet de Réglages & Courbes TCC',
        titleEn: 'Relay Setting Schedule & TCC Coordination Curves',
        descFr: 'Détermination analytique des seuils de courant Is, des facteurs temporaux TMS, des portées de distance Z1/Z2/Z3/Zrev, des pentes différentielles K1/K2, et tracé des courbes temps-courant pour garantir la sélectivité amont/aval.',
        descEn: 'Analytical determination of current pickup thresholds Is, time multiplier settings TMS, distance zone reaches Z1/Z2/Z3/Zrev, percentage differential slopes K1/K2, and plotting TCC curves to ensure strict upstream/downstream selectivity.'
      },
      {
        phase: '05',
        titleFr: 'Paramétrage des Fichiers IED (CID/IID) & Logique Automate CFC',
        titleEn: 'IED Configuration (CID/IID) & CFC Automation Logic Programming',
        descFr: 'Injection des réglages dans les logiciels constructeurs (DIGSI, Easergy Studio), programmation des équations d\'automatisme et verrouillages logiques en langage CFC, et configuration des téléactions GOOSE CEI 61850-8-1.',
        descEn: 'Importing parameter schedules into engineering suites (DIGSI, Easergy Studio), programming interlocking and auto-reclosing logic via Continuous Function Chart (CFC), and mapping peer-to-peer IEC 61850 GOOSE teleprotection datasets.'
      },
      {
        phase: '06',
        titleFr: 'Essais par Injection Secondaire & Tests Bout-en-Bout Synchronisés GPS',
        titleEn: 'Secondary Injection Testing & GPS-Synchronized End-to-End Trials',
        descFr: 'Vérification métrologique au banc d\'essai Omicron CMC 356 : injection des caractéristiques différentielles, contrôle des temps de déclenchement IDMT, et validation des téléprotections 87L par injection synchronisée GPS aux deux extrémités de ligne.',
        descEn: 'Metrological validation using Omicron CMC 356 test sets: verifying differential bias curves, confirming IDMT trip operating times, and validating line differential 87L schemes via GPS-synchronized injection at both substations.'
      },
      {
        phase: '07',
        titleFr: 'Mise en Service, Essais Primaires & Analyse Post-Défaut COMTRADE',
        titleEn: 'Commissioning, Primary Injection Tests & COMTRADE Post-Mortem Analysis',
        descFr: 'Essais de mise sous tension, vérification du sens des puissances actives et réactives sous charge primaire réelle pour validation des polarités TC/TT, simulation de déclenchement réel sur disjoncteur, et dépouillement oscillographique après perturbation.',
        descEn: 'Substation energization, verification of active and reactive power flow directions under real load to confirm CT/VT polarities, trip verification on circuit breaker coils, and automated COMTRADE oscillographic analysis following grid disturbances.'
      }
    ],
    sectionE: [
      {
        id: 'idmt_iec_formula',
        tabLabelFr: 'Courbe à Temps Inverse CEI (ANSI 51)',
        tabLabelEn: 'IEC Inverse Time Overcurrent (ANSI 51)',
        titleFr: 'Équation Universelle des Relais à Temps Dépendant selon CEI 60255-151',
        titleEn: 'Universal Inverse Definite Minimum Time Equation per IEC 60255-151',
        descFr: 'L\'algorithme calcule le temps d\'élimination en fonction de l\'intensité relative du court-circuit. Plus le défaut est violent, plus la coupure est rapide, procurant une coordination sélective chronométrique naturelle avec les appareils amont et aval.',
        descEn: 'The numerical algorithm computes operating trip time as a function of relative fault severity. As fault magnitude increases, tripping time automatically decreases, providing natural time-graded selectivity with adjacent grid protective devices.',
        formula: 't = TMS \\cdot \\left[ \\frac{k}{\\left( \\frac{I}{I_s} \\right)^\\alpha - 1} \\right]',
        formulaDescFr: 'Avec TMS le facteur de réglage temporel (Time Multiplier Setting), I le courant de défaut mesuré, Is le seuil de courant de démarrage du relais. Paramètres normalisés : Courbe Normalement Inverse (k = 0.14, α = 0.02) ; Très Inverse (k = 13.5, α = 1.0) ; Extrêmement Inverse (k = 80.0, α = 2.0).',
        formulaDescEn: 'Where TMS is the Time Multiplier Setting, I is the measured RMS fault current, and Is is the relay current pickup setting. Standard curve constants: Standard Inverse (k = 0.14, α = 0.02); Very Inverse (k = 13.5, α = 1.0); Extremely Inverse (k = 80.0, α = 2.0).',
        assumptionsFr: [
          'Le courant de défaut doit dépasser le seuil de démarrage : I > 1.10 · Is pour engager le chronomètre d\'intégration.',
          'TMS réglable par pas de 0.01 entre 0.05 et 1.20 selon le carnet de coordination.',
          'Prise en compte du temps d\'amortissement et de retombée du relais (Reset time) lors des cycles de réenclenchement 79.'
        ],
        assumptionsEn: [
          'Fault current must exceed pickup threshold: I > 1.10 · Is to initiate timer integration.',
          'TMS adjustable in increments of 0.01 between 0.05 and 1.20 per coordination study.',
          'Relay cooling and reset dynamics must be accounted for during fast auto-reclose 79 dead times.'
        ],
        calcTab: 'relay-tcc'
      },
      {
        id: 'ct_kneepoint_formula',
        tabLabelFr: 'Tension de Coude TC (CEI 61869-2)',
        tabLabelEn: 'CT Knee-Point Voltage Sizing',
        titleFr: 'Dimensionnement de la Tension de Saturation du Transformateur de Courant',
        titleEn: 'Protection Current Transformer Saturation Knee-Point Sizing',
        descFr: 'Formulation normative garantissant que le circuit magnétique du TC ne saturera pas lors du premier cycle de court-circuit asymétrique subtransitoire, évitant tout déclenchement intempestif des protections différentielles ou refus de fonctionnement des protections de distance.',
        descEn: 'Standardized formulation ensuring the magnetic core of the CT will not enter saturation during the subtransient asymmetrical DC offset phase of a severe fault, preventing differential relay misoperation or distance zone underreach.',
        formula: 'V_k \\ge K_{td} \\cdot \\left( \\frac{I_{k,\\max}}{I_{1n}} \\right) \\cdot (R_{ct} + 2 R_L + R_b)',
        formulaDescFr: 'Avec Vk la tension de point de coude assignée (V), Ktd le facteur de surdimensionnement transitoire lié à la constante apériodique L/R du réseau (Ktd = 1 + 2π·fn·Tp), Ik,max le courant de court-circuit maximal présumé, I1n le courant primaire nominal, Rct la résistance de l\'enroulement secondaire du TC, RL la résistance unifilaire du câble de liaison (aller-retour), et Rb le fardeau interne du relais.',
        formulaDescEn: 'Where Vk is the rated knee-point voltage (V), Ktd is the transient dimensioning factor accounting for grid DC offset time constant L/R (Ktd = 1 + 2π·fn·Tp), Ik,max is the maximum prospective subtransient fault current, I1n is rated primary current, Rct is secondary winding resistance, RL is one-way wiring lead resistance, and Rb is connected relay resistive burden.',
        assumptionsFr: [
          'Régime asymétrique subtransitoire maximal avec composante apériodique continue de 100% (fermeture au zéro de tension).',
          'Constante de temps apériodique primaire L/R du réseau haute tension (typiquement 60 à 120 ms sur le réseau 225 kV SONATREL).',
          'Résistance de filerie RL calculée à la température maximale de service des conducteurs cuivre (75 °C).'
        ],
        assumptionsEn: [
          'Maximum asymmetrical subtransient DC offset of 100% (breaker closing at voltage zero-crossing).',
          'Primary grid time constant L/R (typically 60 to 120 ms on the SONATREL 225 kV transmission backbone).',
          'Cabling lead resistance RL evaluated at conductor maximum operating temperature (75 °C).'
        ],
        calcTab: 'ct-sizing'
      },
      {
        id: 'diff_dual_slope_formula',
        tabLabelFr: 'Différentielle à Double Pente (ANSI 87T/87L)',
        tabLabelEn: 'Dual-Slope Biased Differential (ANSI 87T/87L)',
        titleFr: 'Caractéristique Différentielle Stabilisée à Pourcentage et Double Pente',
        titleEn: 'Percentage-Biased Dual-Slope Differential Operating Characteristic',
        descFr: 'Algorithme comparant le courant différentiel vectoriel (grandeur d\'action) au courant de traversée de retenue (grandeur de stabilisation). La double pente assure une excellente sensibilité sur défauts internes faibles tout en immunisant la protection contre la saturation des TC lors de courts-circuits externes majeurs.',
        descEn: 'Numerical algorithm comparing vectorial differential current (operating quantity) to through-current (restraining quantity). The dual-slope profile provides maximum sensitivity for low internal faults while guaranteeing absolute stability against CT saturation during massive through-faults.',
        formula: 'I_{diff} = |\\vec{I}_1 + \\vec{I}_2| \\quad ; \\quad I_{rest} = \\frac{|\\vec{I}_1| + |\\vec{I}_2|}{2} \\quad \\implies \\quad I_{diff} \\ge I_{s0} + K_1 \\cdot I_{rest} \\; (I_{rest} \\le I_{r1}) \\quad ; \\quad I_{diff} \\ge I_{s0} + K_1 \\cdot I_{r1} + K_2 \\cdot (I_{rest} - I_{r1}) \\; (I_{rest} > I_{r1})',
        formulaDescFr: 'Avec Idiff le courant différentiel vectoriel, Irest le courant de retenue scalaire, Is0 le seuil de sensibilité minimale au repos (typiquement 0.20 In), K1 la première pente pour erreurs de TC et régleurs en charge (15 à 25%), Ir1 le coude de transition (1.5 In), et K2 la seconde pente renforcée contre la saturation sévère (50 à 80%).',
        formulaDescEn: 'Where Idiff is the vectorial differential current, Irest is the scalar restraint current, Is0 is the minimum pickup threshold at no-load (typically 0.20 In), K1 is Slope 1 covering CT errors and OLTC tap variation (15 to 25%), Ir1 is the knee breakpoint (1.5 In), and K2 is Slope 2 offering high restraint against heavy CT saturation (50 to 80%).',
        assumptionsFr: [
          'Compensation numérique automatique du rapport de transformation et de l\'indice horaire (ex. YNd11) intégrée dans l\'IED.',
          'Blocage harmonique 2 activé si le taux I(2·f0)/I(f0) dépasse 15% (distinction enclenchement transformateur).',
          'Déclenchement différentiel instantané non-stabilisé à très haut niveau (ANSI 87U) si Idiff > 8 à 10 In.'
        ],
        assumptionsEn: [
          'Automatic digital ratio matching and vector group phase-angle shift compensation (e.g., YNd11) inside the IED.',
          '2nd harmonic cross-blocking active if I(2·f0)/I(f0) exceeds 15% (transformer magnetizing inrush discriminator).',
          'High-set instantaneous unrestrained differential trip (ANSI 87U) configured for extreme internal faults when Idiff > 8 to 10 In.'
        ],
        calcTab: 'relay-tcc'
      },
      {
        id: 'distance_impedance_reach',
        tabLabelFr: 'Portée de Distance Quadrilatérale (ANSI 21)',
        tabLabelEn: 'Distance Protection Zone Reach (ANSI 21)',
        titleFr: 'Calcul des Réglages d\'Impédance de Zone pour Lignes Haute Tension',
        titleEn: 'Impedance Reach Settings for High-Voltage Transmission Lines',
        descFr: 'Délimitation géométrique des zones de protection de distance dans le plan d\'impédance complexe R-X. La zone 1 couvre la quasi-totalité de la ligne protégée sans risque de dépassement de portée sur court-circuit au jeu de barres aval.',
        descEn: 'Geometric boundary setting of distance protection zones in the complex R-X impedance plane. Zone 1 provides instantaneous clearance for the bulk of the line without risking overreach beyond the remote substation busbar.',
        formula: 'Z_{1} = 0.85 \\cdot Z_L \\quad ; \\quad Z_{2} = Z_L + 0.50 \\cdot Z_{L,\\text{next}} \\quad ; \\quad Z_{3} = 1.20 \\cdot (Z_L + Z_{L,\\text{next}})',
        formulaDescFr: 'Avec ZL l\'impédance directe de la ligne protégée, ZL,next l\'impédance de la ligne adjacente la plus courte connectée au poste distant. Z1 déclenche en temps instantané t1 ≤ 20 ms (marge de sécurité de 15% contre les erreurs de TC/TT), Z2 temporisé à t2 = 350 ms, et Z3 temporisé à t3 = 800 ms servant de secours distant.',
        formulaDescEn: 'Where ZL is positive-sequence impedance of the protected line, and ZL,next is impedance of the shortest adjacent line departing the remote bus. Zone 1 trips instantaneously at t1 ≤ 20 ms (15% security margin against CT/VT and line parameter errors), Zone 2 delayed to t2 = 350 ms, and Zone 3 delayed to t3 = 800 ms providing remote backup.',
        assumptionsFr: [
          'Prise en compte de la résistance de défaut d\'arc (formule de Warrington) et compensation de résistance de terre RF.',
          'Facteur de compensation homopolaire k0 = (Z0 - Z1) / (3 · Z1) appliqué pour les défauts monophasés à la terre (ANSI 21N).',
          'Schéma de téléprotection POTT (Permissive Overreach Transfer Trip) accélérant l\'ouverture Zone 2 à 25 ms par signal fibre optique OPGW.'
        ],
        assumptionsEn: [
          'Warrington arc resistance and tower-footing ground fault resistance RF factored into reach boundaries.',
          'Zero-sequence residual compensation factor k0 = (Z0 - Z1) / (3 · Z1) enabled for single-line-to-ground faults (ANSI 21N).',
          'Permissive Overreach Transfer Trip (POTT) teleprotection accelerating remote end clearing to 25 ms via OPGW optical channel.'
        ],
        calcTab: 'transmission-line'
      },
      {
        id: 'grading_margin_delta_t',
        tabLabelFr: 'Intervalle de Sélectivité Δt',
        tabLabelEn: 'Discrimination Margin Δt',
        titleFr: 'Décomposition Physique de l\'Intervalle Chronométrique de Sélectivité',
        titleEn: 'Physical Breakdown of Chronometric Discrimination Time Margin',
        descFr: 'Pour garantir que le disjoncteur amont ne déclenche pas lorsque le disjoncteur aval élimine un défaut, un décalage temporel minimal Δt doit être respecté entre les courbes de déclenchement consécutives.',
        descEn: 'To prevent upstream circuit breakers from opening when a downstream breaker is clearing a fault, a minimum chronometric grading margin Δt must be maintained between adjacent protection stages.',
        formula: '\\Delta t = t_{cb} + t_{overshoot} + t_{safety} + \\epsilon_{meas} \\approx 60\\text{ ms} + 40\\text{ ms} + 150\\text{ ms} + 50\\text{ ms} = 300\\text{ ms}',
        formulaDescFr: 'Avec tcb le temps total d\'ouverture mécanique du disjoncteur aval (40 à 60 ms), tovershoot le temps de dépassement et d\'inertie du relais amont (30 à 40 ms pour relais numériques), tsafety la marge de sécurité pour variations d\'alimentation auxiliaire (100 à 150 ms), et εmeas l\'erreur globale de mesure de courant et de temps des TC et relais (50 ms).',
        formulaDescEn: 'Where tcb is downstream circuit breaker mechanical interrupting time (40 to 60 ms), tovershoot is upstream relay overshoot and reset time (30 to 40 ms for modern numerical relays), tsafety is security tolerance against auxiliary supply fluctuations (100 to 150 ms), and εmeas is composite current and timing measurement tolerance (50 ms).',
        assumptionsFr: [
          'Utilisation de disjoncteurs modernes sous SF6 ou vide dont le temps de coupure est certifié ≤ 3 périodes (60 ms à 50 Hz).',
          'Pour relais électromécaniques anciens, Δt doit être majoré à 400 - 500 ms en raison de l\'inertie du disque d\'induction.',
          'Pour les réseaux purement numériques avec disjoncteurs rapides, Δt peut être optimisé à 250 ms.'
        ],
        assumptionsEn: [
          'Modern SF6 or vacuum breakers with verified interrupting time ≤ 3 cycles (60 ms at 50 Hz).',
          'For legacy induction-disc electromechanical relays, Δt must be expanded to 400 - 500 ms due to disc mechanical inertia.',
          'For fully numerical digital substations with high-speed breakers, Δt can be optimized down to 250 ms.'
        ],
        calcTab: 'relay-tcc'
      },
      {
        id: 'wattmetric_directional_zero_seq',
        tabLabelFr: 'Puissance Résiduelle Wattmétrique (ANSI 67N)',
        tabLabelEn: 'Wattmetric Residual Power Directional (ANSI 67N)',
        titleFr: 'Détection Directive des Défauts à la Terre en Réseau à Neutre Compensé',
        titleEn: 'Directional Earth Fault Detection in Compensated & Resonant Grids',
        descFr: 'Sur les réseaux HTA où le courant capacitif de fuite masque le courant de défaut à la terre, la protection utilise la composante active de la puissance homopolaire (puissance résiduelle) pour déterminer sans ambiguïté si le défaut se situe en amont ou en aval du relais.',
        descEn: 'On MV distribution networks where natural feeder capacitive charging currents obscure ground fault currents, the directional protection computes the real active component of zero-sequence power to reliably determine fault directionality.',
        formula: 'P_0 = 3 \\cdot V_0 \\cdot I_0 \\cdot \\cos(\\varphi_0 - \\varphi_{\\max}) \\quad \\ge \\quad P_{0,\\text{pickup}}',
        formulaDescFr: 'Avec V0 la tension homopolaire résiduelle mesurée sur l\'enroulement en triangle ouvert des TT, I0 le courant homopolaire résiduel mesuré par tore homopolaire de haute perméabilité, φ0 le déphasage entre V0 et I0, et φmax l\'angle de sensibilité maximale du relais (0° en réseau compensé bobine de Petersen, ou calé sur la résistance de neutre).',
        formulaDescEn: 'Where V0 is residual zero-sequence voltage from open-delta voltage transformer windings, I0 is residual zero-sequence current from high-permeability core-balance current transformers (CBCT), φ0 is the phase angle between V0 and I0, and φmax is the relay characteristic angle (0° for Petersen-coil compensated networks, or tuned to the neutral grounding resistor).',
        assumptionsFr: [
          'Tension résiduelle minimale de validation de présence de défaut : V0 ≥ 1% à 5% de la tension nominale de phase Un/√3.',
          'Utilisation d\'un transformateur de courant de type tore tore homopolaire entourant les 3 phases avec reprise de tresse de terre.',
          'Sensibilité active minimale P0,pickup calibrée entre 200 W et 2 kW primaire selon la longueur du réseau de câbles HTA.'
        ],
        assumptionsEn: [
          'Minimum residual displacement voltage required to arm logic: V0 ≥ 1% to 5% of nominal phase voltage Un/√3.',
          'Use of a core-balance current transformer (toroid) encompassing all three phases with insulated ground shield return loop.',
          'Minimum active residual power sensitivity P0,pickup calibrated between 200 W and 2 kW primary according to feeder cable length.'
        ],
        calcTab: 'neutral-grounding'
      }
    ],
    sectionF: [
      {
        code: 'CEI 60255-151',
        tag: 'RELAIS DE PROTECTION',
        titleFr: 'Relais de Mesure & Dispositifs de Protection - Exigences Fonctionnelles pour Protections à Maximum et Minimum de Courant',
        titleEn: 'Measuring Relays and Protection Equipment - Functional Requirements for Over/Under Current Protection',
        descFr: 'Définit les courbes caractéristiques temps-courant normalisées (IDMT), les seuils de précision métrologique, les tolérances dynamiques et les algorithmes de réenclenchement.',
        descEn: 'Defines standardized inverse time-current characteristics (IDMT), metrological accuracy classes, dynamic tolerances, and auto-reclose sequencing.'
      },
      {
        code: 'CEI 60255-187-1',
        tag: 'PROTECTION DIFFÉRENTIELLE',
        titleFr: 'Relais de Mesure - Exigences Fonctionnelles pour Protections Différentielles de Moteurs, Générateurs et Transformateurs',
        titleEn: 'Measuring Relays - Functional Requirements for Motor, Generator and Transformer Differential Protection',
        descFr: 'Spécifie les exigences de sécurité et de sensibilité des caractéristiques différentielles à pourcentage, les critères de retenue harmonique et l\'immunité aux transitoires d\'enclenchement.',
        descEn: 'Specifies stability and sensitivity requirements for percentage-biased differential schemes, harmonic restraint criteria, and transient inrush immunity.'
      },
      {
        code: 'CEI 61869-2 & CEI 61869-3',
        tag: 'TRANSFORMATEURS DE MESURE',
        titleFr: 'Transformateurs de Mesure - Exigences Spécifiques pour Transformateurs de Courant et de Tension Inductifs',
        titleEn: 'Instrument Transformers - Specific Requirements for Current Transformers and Inductive Voltage Transformers',
        descFr: 'Règles de dimensionnement des classes de précision pour la protection (5P20, TPX, TPY) et la mesure (0.2S, 0.5), calcul de la tension de saturation Vk et tenue diélectrique.',
        descEn: 'Sizing criteria for protective accuracy classes (5P20, TPX, TPY) and revenue metering (0.2S, 0.5), knee-point saturation Vk sizing, and dielectric ratings.'
      },
      {
        code: 'IEEE C37.113',
        tag: 'LIGNES DE TRANSPORT',
        titleFr: 'Guide IEEE pour la Protection des Lignes de Transport Haute Tension',
        titleEn: 'IEEE Guide for Protective Relay Applications to Transmission Lines',
        descFr: 'Norme de référence internationale régissant l\'application des protections différentielles de ligne 87L, protections de distance 21, téléactions PUTT/POTT et réenclenchement monopolaire.',
        descEn: 'International reference standard covering transmission line current differential 87L, distance protection 21, PUTT/POTT teleprotection, and single-pole trip/reclose schemes.'
      },
      {
        code: 'CEI 60909-0',
        tag: 'COURTS-CIRCUITS',
        titleFr: 'Calcul des Courants de Court-Circuit dans les Réseaux Triphasés à Courant Alternatif',
        titleEn: 'Short-Circuit Currents in Three-Phase A.C. Systems - Calculation of Currents',
        descFr: 'Méthodologie normalisée de calcul des courants subtransitoires, transitoires et permanents, des composantes apériodiques continues et des pouvoirs de coupure disjoncteurs.',
        descEn: 'Standardized methodology for calculating subtransient, transient, and steady-state fault currents, DC asymmetrical components, and circuit breaker breaking duties.'
      },
      {
        code: 'SONATREL Protection Grid Code',
        tag: 'CODE DE RÉSEAU CAMEROUNAIS',
        titleFr: 'Spécifications Techniques Générales de Protection et de Mesure du Réseau de Transport Interconnecté',
        titleEn: 'General Technical Specifications for Protection and Metering of the Interconnected Transmission Grid',
        descFr: 'Cahier des charges imposant la double chaîne de protection indépendante (Main 1 / Main 2), les temps d\'élimination maximaux de défaut (< 80 ms sur le 225 kV), et la consignation COMTRADE obligatoire.',
        descEn: 'Cameroon transmission system operator code mandating redundant independent protection channels (Main 1 / Main 2), maximum fault clearance times (< 80 ms at 225 kV), and mandatory COMTRADE recording.'
      }
    ]
  },

  // D12: Téléconduite, SAS & Contrôle-Commande de Poste
  D12: {
    domainCode: 'D12',
    sectionA: {
      roleFr: "Automatisation intégrale, conduite locale et téléconduite en temps réel des postes électriques haute tension (HTB/HTA), acquisition décentralisée des mesures et signalisations par calculateurs de tranche (BCU), inter-verrouillages logiques par trames Ethernet GOOSE sans filerie cuivre, conduite par IHM durcie et télétransmission sécurisée vers le Dispatching National de Mangombé (SONATREL) via CEI 60870-5-104 / ICCP TASE.2.",
      roleEn: 'Comprehensive substation automation, local HMI supervision, and real-time remote control of high-voltage transmission substations, decentralized telemetry and status acquisition via Bay Control Units (BCUs), hardwire-free peer-to-peer logical interlocking via IEC 61850 GOOSE multicast, local hardened touch HMI control, and secure teletransmission to the Mangombé National Control Center (SONATREL) via IEC 60870-5-104 / ICCP TASE.2.',
      inputsFr: {
        title: 'Signaux d\'Organes, Télémesures Numériques & SV',
        desc: 'Contacts auxiliaires de fin de course (disjoncteurs, sectionneurs de ligne/barre/terre), pressostats de densité gaz SF6, relais de protection transformateur (Buchholz, surpression), grandeurs électriques (P, Q, U, I, f, cos φ), et flux Sampled Values (SV CEI 61869-9 issus d\'unités Merging Units).',
        voltage: 'Signaux TOR 48/110 Vcc • Liens optiques Ethernet 100Base-FX • Échantillonnage SV 4 800 Hz'
      },
      inputsEn: {
        title: 'Switchgear Status Contacts, Digital Telemetry & SV Streams',
        desc: 'Auxiliary limit switches (circuit breaker and disconnector open/closed status), SF6 gas density monitors, transformer protective devices (Buchholz, pressure relief), electrical power variables (P, Q, U, I, f, power factor), and digital Sampled Values streams (SV IEC 61869-9 from Merging Units).',
        voltage: 'Binary inputs 48/110 Vdc • Optical Ethernet 100Base-FX • SV sampling 4,800 Hz'
      },
      processFr: {
        title: 'Traitement Décentralisé BCU, Bus de Station CEI 61850 & PRP',
        desc: 'Traitement en temps réel par calculateurs de tranche (BCU), exécution de matrices d\'inter-verrouillage topologique par messagerie GOOSE prioritaire (latence ≤ 3 ms), synchronisation sub-microseconde IEEE 1588 PTP, double réseau à redondance sans coupure PRP (CEI 62439-3), et conversion de protocoles MMS / CEI 60870-5-104 par passerelle RTU redondante.',
        note: 'Disponibilité téléconduite 99.999% : Zéro temps de basculement réseau (Zero-failover PRP CEI 62439-3)'
      },
      processEn: {
        title: 'Distributed BCU Processing, IEC 61850 Station Bus & PRP Redundancy',
        desc: 'Distributed real-time processing via Bay Control Units (BCUs), execution of topological interlocking matrices via priority multicast GOOSE messaging (latency ≤ 3 ms), sub-microsecond IEEE 1588 PTP time synchronization, seamless dual-network redundancy via Parallel Redundancy Protocol PRP (IEC 62439-3), and protocol conversion to MMS / IEC 60870-5-104 via redundant RTU gateways.',
        note: 'Substation SCADA availability 99.999%: Zero network failover time (Zero-failover PRP IEC 62439-3)'
      },
      outputsFr: {
        title: 'Télécommandes Sécurisées SBO, Synoptique IHM & Télégestion',
        desc: 'Télécommandes sécurisées d\'organes par procédure à deux étapes "Select-Before-Operate" (SBO), synoptique dynamique haute résolution sur IHM locale avec enregistrement chronologique des événements (SOE à résolution 1 ms), trames de téléconduite sécurisées vers le dispatching central SONATREL, et verrouillage d\'urgence électromécanique.',
        earthing: 'Mise à la terre équipotentielle blindée des baies informatiques et réseaux télécom découplée des surtensions de foudre'
      },
      outputsEn: {
        title: 'Secure SBO Supervisory Controls, Station HMI & National Dispatch',
        desc: 'Secure switchgear remote control commands via two-step "Select-Before-Operate" (SBO) sequences, dynamic high-resolution one-line mimics on local station HMI with 1 ms Sequence of Events (SOE) timestamping, encrypted telecontrol frames to SONATREL central EMS, and failsafe hardware lockout.',
        earthing: 'Equipotential shielded grounding for telecom racks and SAS control cubicles isolated from high-voltage lightning surges'
      }
    },
    sectionB: {
      summaryFr: 'Architectures de contrôle-commande numérique de poste : bus de station CEI 61850-8-1 (MMS & GOOSE), bus de processus optique avec unités de fusion (Sampled Values), passerelles RTU redondantes vers dispatching national, et matrices d\'inter-verrouillage topologique sécuritaire.',
      summaryEn: 'Substation automation architectures: IEC 61850-8-1 station bus (MMS & GOOSE), optical digital process bus with merging units (Sampled Values), dual-redundant RTU gateways to national control centers, and failsafe topological interlocking matrices.',
      architectures: [
        {
          nameFr: 'Bus de Station Numérique CEI 61850-8-1 (MMS Client/Serveur & GOOSE Tranche)',
          nameEn: 'IEC 61850-8-1 Digital Station Bus (Client/Server MMS & Bay GOOSE)',
          techFr: 'Double anneau ou étoile optique 1 Gbit/s reliant l\'ensemble des calculateurs BCU et IEDs au superviseur SAS',
          techEn: 'Dual optical 1 Gbps ring/star topology interconnecting all bay control units (BCU) and IEDs to SAS servers',
          descFr: 'Architecture normalisée articulée autour du bus de station. Les trames MMS assurent la remontée cyclique et sur événement des mesures et états vers le superviseur local et la passerelle RTU. Les trames Ethernet GOOSE (Generic Object Oriented Substation Events) permettent les échanges transversaux directs entre tranches (inter-verrouillages, déclenchements de secours) en moins de 3 ms sans passer par le superviseur ni utiliser de fils cuivre.',
          descEn: 'Standardized architecture built upon the station bus. MMS services handle cyclic and event-driven transmission of measurements and breaker states to the local SCADA server and RTU gateway. Layer-2 peer-to-peer GOOSE multicasts enable direct high-speed inter-bay communication (interlocking, breaker failure tripping) in under 3 ms without traversing the central SCADA server or using point-to-point inter-panel copper wires.',
          standard: 'CEI 61850-8-1 / CEI 61850-7-2',
          metricFr: 'Vitesse de transfert GOOSE : < 3 ms • Débit lien : 1 Gbit/s',
          metricEn: 'GOOSE transfer latency: < 3 ms • Link bandwidth: 1 Gbps'
        },
        {
          nameFr: 'Poste Numérique Intégral avec Bus de Processus Optique (Process Bus - Sampled Values)',
          nameEn: 'Full Digital Substation with Optical Process Bus (Sampled Values SV)',
          techFr: 'Numérisation au pied des réducteurs de mesure par unités Stand-Alone Merging Units (SAMU)',
          techEn: 'Primary current/voltage digitization right at instrument transformer foot via Stand-Alone Merging Units (SAMU)',
          descFr: 'Élimination totale des câbles de mesure analogiques et de contrôle en cuivre dans la cour haute tension. Les courants et tensions sont convertis en flux de valeurs échantillonnées numériques (Sampled Values à 4 800 Hz) transmises par fibres optiques aux IEDs de protection et calculateurs de tranche selon la norme CEI 61869-9 / CEI 61850-9-2 LE. Améliore drastiquement la sécurité du personnel en supprimant tout risque d\'ouverture intempestive de circuit TC.',
          descEn: 'Complete elimination of copper analog measurement and control cabling in the outdoor switchyard. Primary currents and voltages are digitized into standardized digital Sampled Values streams (4,800 Hz) transmitted via optical fibers to protection IEDs and bay controllers per IEC 61869-9 / IEC 61850-9-2 LE. Dramatically enhances human safety by permanently eliminating hazardous open-circuit secondary CT hazards.',
          standard: 'CEI 61850-9-2 LE / CEI 61869-9',
          metricFr: 'Fréquence d\'échantillonnage : 4 800 Hz (96 éch/pér à 50 Hz) • Gigue temporelle < 1 µs',
          metricEn: 'Sampling rate: 4,800 Hz (96 samples/cycle at 50 Hz) • Timing jitter < 1 µs'
        },
        {
          nameFr: 'Passerelle de Téléconduite RTU Redondante & Interfaçage Dispatching National (CEI 60870-5-104)',
          nameEn: 'Dual-Redundant RTU Telecontrol Gateway & National Dispatch Interface (IEC 60870-5-104)',
          techFr: 'Double calculateur durci en basculement chaud automatique (Hot-Standby) avec tunnel VPN IPsec sécurisé',
          techEn: 'Dual-redundant hardened controllers with automatic hitless hot-standby failover and IPsec VPN tunneling',
          descFr: 'Concentration de l\'ensemble des données télésignalées (TS), télémesurées (TM) et points de télécommande (TC) de l\'ensemble des départs du poste haute tension. Conversion transparente des protocoles internes CEI 61850 en messages normalisés CEI 60870-5-104 pour transmission vers le SCADA central SONATREL de Mangombé et les centres régionaux (Yaoundé / Douala) via les liaisons optiques OPGW et faisceaux hertziens.',
          descEn: 'Aggregation of all digital status signals, analog telemetry, and supervisory control points from all substation bays. Seamless protocol mapping from internal IEC 61850 data objects to standardized IEC 60870-5-104 telecontrol packets sent to the SONATREL Mangombé National Control Center and regional dispatching nodes (Yaoundé / Douala) over high-capacity OPGW fiber links and microwave backbones.',
          standard: 'CEI 60870-5-104 / CEI 62351-3/5',
          metricFr: 'Disponibilité passerelle : 99.999% • Basculement secours : < 500 ms',
          metricEn: 'Gateway availability: 99.999% • Hot failover time: < 500 ms'
        },
        {
          nameFr: 'Système d\'Inter-verrouillage Topologique de Sécurité de Manœuvre (Bay & Station Interlocking)',
          nameEn: 'Topological Substation Interlocking Safety Logic System',
          techFr: 'Matrice d\'équations logiques booléennes décentralisées évaluant la position physique de chaque organe',
          techEn: 'Decentralized Boolean logic matrix continuously evaluating real-time physical switchgear topology',
          descFr: 'Automatismes de sécurité interdisant formellement toute manœuvre erronée pouvant provoquer un court-circuit destructeur : interdiction formelle d\'ouverture ou fermeture d\'un sectionneur sous charge (détection de courant nul I < 1% In sur disjoncteur), interdiction de fermeture de sectionneur de terre sur barre sous tension, et séquençage obligatoire lors du transfert de jeu de barres sous charge (fermeture couplage -> fermeture sectionneurs départ -> ouverture anciens sectionneurs).',
          descEn: 'Failsafe automated logic preventing catastrophic operator errors: absolute prohibition of disconnector operation under current (zero-current verification I < 1% In on associated circuit breaker), absolute interlock against closing grounding switches onto energized conductors, and mandatory automatic sequencing during on-load busbar transfers (bus-coupler closure -> target bus disconnector closure -> source bus disconnector opening).',
          standard: 'CEI 61936-1 / CEI 61850-7-4 (LN CSWI & XSWI)',
          metricFr: 'Temps d\'évaluation logique : < 5 ms • Sécurité anti-arc : 100%',
          metricEn: 'Logic evaluation time: < 5 ms • Arc-flash safety guarantee: 100%'
        },
        {
          nameFr: 'Infrastructure Réseau Haute Disponibilité PRP / HSR & Synchronisation PTP IEEE 1588',
          nameEn: 'High-Availability PRP / HSR Network Infrastructure & IEEE 1588 PTP Synchronization',
          techFr: 'Protocole de redondance parallèle PRP (CEI 62439-3) avec duplication de paquets et horloge Grandmaster GNSS',
          techEn: 'Parallel Redundancy Protocol PRP (IEC 62439-3) with packet duplication and GNSS Grandmaster Clock',
          descFr: 'Réseau informatique de poste à tolérance de panne totale : chaque trame Ethernet est dupliquée et injectée simultanément sur deux réseaux locaux physiquement indépendants (LAN A et LAN B). Le récepteur traite la première trame arrivée et détruit la réplique sans le moindre milliseconde d\'interruption en cas de coupure de fibre. Synchronisation temporelle absolue par protocole PTP IEEE 1588 Profil Énergie (CEI 61850-9-3) avec précision sub-microseconde.',
          descEn: 'Fault-tolerant substation communication backbone: each Ethernet frame is duplicated and transmitted simultaneously across two physically isolated local area networks (LAN A and LAN B). The receiving node consumes the first arrival and discards the duplicate with zero millisecond packet loss upon fiber severance. Sub-microsecond absolute network time synchronization via IEEE 1588 PTP Power Profile (IEC 61850-9-3).',
          standard: 'CEI 62439-3 (PRP/HSR) / IEEE 1588-2008 / CEI 61850-9-3',
          metricFr: 'Temps de basculement : 0 ms (hitless) • Précision horloge PTP : < 1 µs',
          metricEn: 'Failover recovery time: 0 ms (hitless) • PTP time accuracy: < 1 µs'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-bcu-bay-controller',
        nameFr: 'Calculateur Numérique de Tranche Bay Control Unit (SIPROTEC 6MD85 / MiCOM C264)',
        nameEn: 'Numerical Bay Control Unit BCU (SIPROTEC 6MD85 / MiCOM C264)',
        voltage: 'Alimentation 110/220 Vcc • Entrées TOR 64 voies • 32 sorties relais',
        roleFr: 'Conduite locale de cellule, commande Select-Before-Operate des sectionneurs et disjoncteurs, gestion des automatismes de tranche (interlocking, réenclenchement), mesures P/Q/U/I, double port optique PRP et publication GOOSE.',
        roleEn: 'Local bay control and monitoring, two-step Select-Before-Operate switchgear actuation, local interlocking and automation routines, precision P/Q/U/I telemetry, dual optical PRP ports, and fast GOOSE publishing.',
        symbol: 'BCU-BAY',
        standard: 'CEI 61850-7-4 / CEI 60255-1',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-rugged-switch-61850',
        nameFr: 'Commutateur Ethernet Industriel Durci CEI 61850-3 (Ruggedcom RS900 / Cisco IE 4000)',
        nameEn: 'Hardened Substation Managed Ethernet Switch (Ruggedcom RS900 / Cisco IE 4000)',
        voltage: 'Double alimentation redondante 110/220 Vcc • Ports SFP Gigabit optiques',
        roleFr: 'Commutation déterministe ultra-rapide des flux GOOSE et Sampled Values sans perte de paquets, immunité électromagnétique sévère CEI 61850-3 / IEEE 1613, support matériel du protocole PRP/HSR et horloge transparente PTP IEEE 1588.',
        roleEn: 'Deterministic ultra-fast switching of GOOSE and Sampled Values without packet loss, severe electromagnetic immunity per IEC 61850-3 / IEEE 1613, hardware PRP/HSR offload, and IEEE 1588 PTP transparent clock support.',
        symbol: 'SW-ETH-61850',
        standard: 'CEI 61850-3 / IEEE 1613',
        imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-rtu-gateway-scada',
        nameFr: 'Passerelle de Téléconduite RTU Modulaire Redondante (ABB RTU560 / MicroSCADA Pro)',
        nameEn: 'Modular Dual-Redundant Substation RTU & SCADA Gateway (ABB RTU560 / MicroSCADA)',
        voltage: 'Double châssis redondant 110 Vcc • Interfaces CEI 60870-5-104 & DNP3 IP',
        roleFr: 'Concentration et prétraitement de l\'ensemble des points de télémesure (TM), télésignalisation (TS) et télécommande (TC) du poste, conversion client MMS CEI 61850, et télétransmission sécurisée IPsec vers le SCADA SONATREL.',
        roleEn: 'Aggregation and preprocessing of all substation telemetry, binary indications, and supervisory controls, client MMS IEC 61850 mapping, and encrypted IPsec telecontrol transmission to the national EMS dispatch center.',
        symbol: 'RTU-GW',
        standard: 'CEI 60870-5-104 / CEI 62351',
        imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-ptp-grandmaster',
        nameFr: 'Horloge Maître Grandmaster GPS/Galileo PTP IEEE 1588 (Meinberg LANTIME M1000)',
        nameEn: 'Dual-GNSS PTP Grandmaster Substation Clock (Meinberg LANTIME M1000)',
        voltage: 'Double alimentation 110 Vcc / 230 Vca • Oscillateur interne Rubidium / OCXO',
        roleFr: 'Génération et distribution de références temporelles ultra-précises synchronisées sur constellations GPS/Galileo, horodatage à la microseconde des événements SOE, et synchronisation synchrone des unités Merging Units du bus de processus.',
        roleEn: 'Generation and network distribution of ultra-precise time references synchronized to GPS/Galileo satellites, microsecond Sequence of Events (SOE) timestamping, and phase synchronization of process bus Merging Units.',
        symbol: 'CLK-PTP',
        standard: 'IEEE 1588-2008 / CEI 61850-9-3',
        imgUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-station-hmi-server',
        nameFr: 'Serveur SCADA & Console IHM Tactile Durcie de Poste (Zenon Energy / MicroSCADA)',
        nameEn: 'Substation SCADA Server & Hardened Touch Operator HMI (Zenon / MicroSCADA)',
        voltage: 'Châssis industriel sans ventilateur 19" IP54 • Alimentation secourue 110 Vcc',
        roleFr: 'Visualisation interactive du schéma unifilaire dynamique du poste, surveillance temps réel des grandeurs électriques, gestion des consignes et alarmes par niveau d\'urgence, et interface ergonomique pour manœuvres sécurisées SBO.',
        roleEn: 'Interactive real-time visualization of substation dynamic single-line mimics, continuous electrical parameter supervision, multi-level alarm and event journaling, and ergonomic operator interface for two-step SBO control.',
        symbol: 'HMI-SAS',
        standard: 'CEI 62264 / Ergonomie ISO 9241',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-substation-ups-battery',
        nameFr: 'Atelier d\'Énergie Continu 110 Vcc & Onduleur de Sécurité SAS (Chargeur Thyristor + Batterie 400 Ah)',
        nameEn: 'Substation Auxiliary 110 Vdc Charger & Battery Bank (100 A Rectifier + 400 Ah Bank)',
        voltage: 'Tension continue 110 Vcc nominale • Courant assigné 100 A • Capacité 400 Ah',
        roleFr: 'Alimentation secourue ininterrompue de l\'ensemble des systèmes de contrôle-commande SAS, des calculateurs de tranche BCU, des télécommunications et des bobines de déclenchement des disjoncteurs avec une autonomie de 10 heures sans secteur.',
        roleEn: 'Continuous uninterruptible auxiliary DC power supply for all SAS automation racks, bay control units, telecommunication switches, and circuit breaker trip/close coils providing guaranteed 10-hour autonomy upon total AC blackout.',
        symbol: 'UPS-110VCC',
        standard: 'IEEE Std 485 / CEI 60896',
        imgUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        calcTab: 'power'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Table d\'Échange d\'Informations (TEI) & Liste des Points SCADA',
        titleEn: 'Signal & Information Exchange Matrix (IO List & Addressing)',
        descFr: 'Recensement exhaustif de chaque point de données du poste : télésignalisations simples/doubles (TS), télémesures analogiques (TM), télécommandes (TC), consignes de régleurs en charge (TC-OLTC) et seuils d\'alarme par départ.',
        descEn: 'Comprehensive cataloging of all discrete inputs (single/double indications), analog telemetry (currents, voltages, active/reactive power), supervisory control commands, OLTC tap commands, and bay-level threshold alarms.'
      },
      {
        phase: '02',
        titleFr: 'Ingénierie SCL Normalisée (SSD, ICD, SCD, CID) selon CEI 61850-6',
        titleEn: 'Standardized SCL System Engineering (SSD, ICD, SCD, CID) per IEC 61850-6',
        descFr: 'Création de la description fonctionnelle du poste (SSD), importation des fichiers d\'aptitude constructeurs (ICD), configuration unifiée des flux de données et liaisons GOOSE/MMS dans le fichier SCD (Substation Configuration Description).',
        descEn: 'Authoring substation functional single-line descriptions (SSD), importing vendor capability files (ICD), and systematically configuring dataset bindings, report control blocks, and peer-to-peer GOOSE routing within the master SCD file.'
      },
      {
        phase: '03',
        titleFr: 'Conception Réseau Ethernet, VLANs & Redondance PRP/HSR',
        titleEn: 'Network Topology Design, VLAN Segregation & PRP/HSR Architecture',
        descFr: 'Architecture en double étoile optique PRP (LAN A et LAN B), découpage en VLANs IEEE 802.1Q dédiés (VLAN GOOSE, VLAN MMS, VLAN SV, VLAN Télécom), priorisation 802.1p et calcul prévisionnel de bande passante sous tempête.',
        descEn: 'Dual-star optical PRP network architecture (LAN A & LAN B), VLAN segregation per IEEE 802.1Q (GOOSE VLAN, MMS VLAN, Process Bus SV VLAN), IEEE 802.1p traffic prioritization, and bandwidth load modeling under worst-case fault bursts.'
      },
      {
        phase: '04',
        titleFr: 'Programmation des Logiques d\'Inter-verrouillage & Automates de Tranche',
        titleEn: 'Interlocking Logic Implementation & Bay Automation Programming',
        descFr: 'Développement des équations booléennes d\'autorisation de manœuvre (sectionneurs de barres, mise à la terre, transfert sous charge) et des automatismes de délestage/permutations de sources en langage CEI 61131-3 CFC.',
        descEn: 'Developing Boolean authorization matrices for switchgear operations (bus disconnectors, earth switches, on-load busbar changeover) and automatic load shedding / bus transfer schemes using standardized IEC 61131-3 CFC logic.'
      },
      {
        phase: '05',
        titleFr: 'Essais d\'Intégration Plateforme FAT & Analyse Réseau Wireshark',
        titleEn: 'Factory Acceptance Testing (FAT) & Network Packet Stress Analysis',
        descFr: 'Interconnexion de l\'ensemble des armoires de tranche et calculateurs SAS en plateforme d\'essais, simulation d\'avalanches de 1 000 événements par seconde, contrôle de l\'absence de perte de paquets et validation de latence GOOSE < 3 ms.',
        descEn: 'Interconnecting all bay cubicles and SAS servers in the test laboratory, simulating message bursts of 1,000 events/second, verifying zero frame drops across redundant PRP rings, and confirming sub-3ms GOOSE delivery latency.'
      },
      {
        phase: '06',
        titleFr: 'Essais sur Site SAT & Vérification Point-à-Point Extrémité',
        titleEn: 'Site Acceptance Testing (SAT) & End-to-End Switchgear Verification',
        descFr: 'Vérification de l\'ensemble des retours de position d\'organes haute tension sur l\'IHM locale, manœuvres réelles des disjoncteurs et sectionneurs sous double verrouillage, et contrôle de conformité des horodatages SOE à 1 ms.',
        descEn: 'Verifying all high-voltage switchgear position feedback signals on the local HMI, performing live physical operations of circuit breakers and disconnectors with interlocking active, and auditing 1 ms SOE chronological accuracy.'
      },
      {
        phase: '07',
        titleFr: 'Raccordement au Dispatching National & Mise en Service Industrielle',
        titleEn: 'National EMS/SCADA Uplink Commissioning & Industrial Handover',
        descFr: 'Établissement du canal téléconduite CEI 60870-5-104 vers le Dispatching National SONATREL de Mangombé, tests d\'exécution des télécommandes avec procédure sécurisée SBO, et basculement en exploitation industrielle continue.',
        descEn: 'Commissioning the dual IEC 60870-5-104 communication channels to the SONATREL Mangombé National Control Center, validating remote telecommands via two-step SBO handshakes, and completing commercial commissioning.'
      }
    ],
    sectionE: [
      {
        id: 'goose_latency_calc',
        tabLabelFr: 'Temps de Transit de Trame GOOSE (CEI 61850-5)',
        tabLabelEn: 'GOOSE Transmission Latency Budget (IEC 61850-5)',
        titleFr: 'Budget de Temps de Transmission des Ordres Rapides de Classe IA',
        titleEn: 'Fast Tripping Transmission Time Budget for Class IA Messages',
        descFr: 'Spécifie le temps maximal admissible entre l\'instant où un IED décide l\'émission d\'un ordre de déclenchement ou de verrouillage et sa réception effective par les appareils récepteurs sur le réseau Ethernet.',
        descEn: 'Defines statutory maximum allowable latency between the instant an IED decides an internal trip or interlock command and its physical reception by destination devices over the substation Ethernet bus.',
        formula: 'T_{\\text{transit}} = t_{\\text{encaps}} + \\sum_{i=1}^{N_{\\text{sw}}} t_{\\text{sw},i} + \\frac{L}{v_{\\text{prop}}} + t_{\\text{decaps}} \\quad \\le \\quad 3\\text{ ms}',
        formulaDescFr: 'Avec tencaps le temps d\'encapsulation de la trame Ethernet couche 2 par le processeur de l\'IED (typiquement 0.8 à 1.2 ms), Nsw le nombre de commutateurs traversés avec tsw,i temps de transit par switch (< 10 µs en commutation cut-through), L la longueur de la fibre optique, vprop la vitesse de propagation dans la silice (≈ 200 000 km/s soit 5 µs/km), et tdecaps le temps de désencapsulation et traitement du récepteur (< 1.0 ms).',
        formulaDescEn: 'Where tencaps is Layer 2 Ethernet frame assembly time in the transmitting IED (typically 0.8 to 1.2 ms), Nsw is number of switches traversed with tsw,i forwarding latency per switch (< 10 µs in cut-through mode), L is fiber optic length, vprop is speed of light in silica (≈ 200,000 km/s or 5 µs/km), and tdecaps is receiver processing and parsing duration (< 1.0 ms).',
        assumptionsFr: [
          'Trames GOOSE transmises directement sur la couche 2 Ethernet (sans pile de protocoles TCP/IP ni routage IP).',
          'Priorité maximale IEEE 802.1p assignée aux trames GOOSE critiques (Priority Tag = 6 ou 7).',
          'Commutateurs Ethernet industriels de temps de traversée inférieur à 10 microsecondes par commutateur.'
        ],
        assumptionsEn: [
          'GOOSE messages mapped directly onto Ethernet Data Link Layer 2 (bypassing TCP/IP overhead).',
          'Highest IEEE 802.1p priority tagging assigned to critical trip GOOSE frames (Priority Tag = 6 or 7).',
          'Hardened industrial switches featuring cut-through latency below 10 microseconds per switch hop.'
        ],
        calcTab: 'power'
      },
      {
        id: 'goose_retransmission_backoff',
        tabLabelFr: 'Retransmission GOOSE (Backoff Exponentiel)',
        tabLabelEn: 'GOOSE Retransmission Exponential Backoff',
        titleFr: 'Séquence Temporelle de Répétition et Sécurisation de Trame GOOSE',
        titleEn: 'GOOSE Retransmission Timing Sequence with Exponential Backoff',
        descFr: 'Comme le protocole GOOSE utilise une diffusion multicast Ethernet sans accusé de réception (ACK), la fiabilité absolue de transmission est garantie par une rafale de retransmissions ultra-rapides au moment d\'un changement d\'état, s\'espaçant progressivement jusqu\'à un état de veille stable.',
        descEn: 'Because GOOSE utilizes connectionless Layer 2 multicast without acknowledgement (ACK) packets, absolute delivery reliability is achieved through an instantaneous burst of retransmissions upon any state change, progressively decaying to a steady-state heartbeat.',
        formula: 'T_i = \\min(T_0 \\cdot 2^i, T_{\\max}) \\quad \\text{pour } i = 0, 1, 2, \\dots \\quad ; \\quad T_0 \\approx 2\\text{ ms}, \\; T_{\\max} \\approx 1\\,000\\text{ ms}',
        formulaDescFr: 'Avec T0 le temps de retransmission initial après événement (typiquement 2 ms), i l\'indice de la retransmission, et Tmax la période de répétition cyclique de veille (typiquement 1 000 ms). En régime stable, la trame est répétée toutes les 1 000 ms pour signaler que l\'émetteur est vivant (heartbeat) et surveiller la liaison.',
        formulaDescEn: 'Where T0 is initial retransmission interval following state transition (typically 2 ms), i is retransmission counter, and Tmax is steady-state repetition heartbeat period (typically 1,000 ms). During quiescent operation, the frame is broadcast every 1,000 ms to confirm link health and device heartbeat.',
        assumptionsFr: [
          'En cas de nouveau changement d\'état avant la fin du cycle, le compteur i est réinitialisé immédiatement à 0 et stNum est incrémenté.',
          'Le numéro de séquence sqNum est incrémenté à chaque répétition tandis que le numéro d\'état stNum reste constant.',
          'Le temps de vie TimeAllowedToLive est positionné à 2 · Ti pour permettre au récepteur de détecter une perte de liaison.'
        ],
        assumptionsEn: [
          'Upon any subsequent state change, counter i resets immediately to 0 and state number stNum increments.',
          'Sequence number sqNum increments with each retransmission while state number stNum remains constant.',
          'TimeAllowedToLive parameter is set to 2 · Ti enabling receiving nodes to declare communication loss upon missed frames.'
        ],
        calcTab: 'power'
      },
      {
        id: 'station_lan_bandwidth_calc',
        tabLabelFr: 'Bande Passante LAN sous Avalanche',
        tabLabelEn: 'Station LAN Bandwidth under Storm Burst',
        titleFr: 'Dimensionnement de la Bande Passante Réseau Station Bus sous Condition d\'Avalanche',
        titleEn: 'Substation Ethernet LAN Bandwidth Sizing under Worst-Case Event Burst',
        descFr: 'Méthodologie de calcul garantissant que lors d\'un incident réseau majeur (court-circuit déclenchant l\'ensemble des protections et générant des centaines de trames GOOSE et rapports MMS simultanés), la charge du bus de station ne saturera pas les commutateurs.',
        descEn: 'Analytical sizing methodology ensuring that during severe multi-bay grid disturbances (where simultaneous relay trips generate hundreds of burst GOOSE messages and MMS reports), total network utilization remains well within switch buffer capacities.',
        formula: 'BW_{\\text{total}} = \\sum_{k=1}^{M} \\left( \\frac{S_{\\text{GOOSE},k} \\cdot 8}{T_{\\min,k}} \\right) + N_{\\text{SV}} \\cdot (f_s \\cdot S_{\\text{SV}} \\cdot 8) + BW_{\\text{MMS}} \\quad \\le \\quad 0.40 \\cdot BW_{\\text{link}}',
        formulaDescFr: 'Avec SGOOSE la taille moyenne d\'une trame GOOSE (≈ 200 à 400 octets), Tmin l\'intervalle minimal de rafale (2 ms), NSV le nombre de flux SV sur le lien (0 sur le bus de station pur, ou flux partagé), fs la fréquence d\'échantillonnage, SSV la taille de trame SV (≈ 150 octets), BWMMS le débit résiduel de supervision SCADA, et BWlink la capacité nominale du lien (100 Mbps ou 1 Gbps). Le taux de charge maximal ne doit pas dépasser 40% pour prévenir toute gigue.',
        formulaDescEn: 'Where SGOOSE is average GOOSE frame payload (≈ 200 to 400 bytes), Tmin is minimum burst interval (2 ms), NSV is number of concurrent SV streams, fs is sampling frequency, SSV is SV frame size (≈ 150 bytes), BWMMS is background SCADA supervisory traffic, and BWlink is nominal link throughput (100 Mbps or 1 Gbps). Composite network utilization must not exceed 40% to guarantee near-zero queuing jitter.',
        assumptionsFr: [
          'Ségrégation stricte des flux multicast par VLANs IEEE 802.1Q et filtrage IGMP Snooping / GMRP.',
          'Bande passante des cœurs de commutation optique dimensionnée en Gigabit Ethernet (1 000 Mbit/s).',
          'Marge de sécurité de 60% réservée pour absorber les tempêtes de broadcast et transitoires imprévus.'
        ],
        assumptionsEn: [
          'Strict multicast segregation via IEEE 802.1Q VLANs and IGMP Snooping / GMRP filtering.',
          'Core optical substation switch backplanes rated for Gigabit Ethernet (1,000 Mbps non-blocking).',
          '60% safety bandwidth headroom reserved to absorb unexpected broadcast storms and transient surges.'
        ],
        calcTab: 'power'
      },
      {
        id: 'substation_battery_ah_sizing',
        tabLabelFr: 'Capacité Batterie 110 Vcc (IEEE Std 485)',
        tabLabelEn: 'Substation 110 Vdc Battery Sizing (IEEE 485)',
        titleFr: 'Dimensionnement de la Capacité Nominale de la Batterie SAS selon IEEE Std 485',
        titleEn: 'Substation Auxiliary Battery Bank Capacity Sizing per IEEE Std 485',
        descFr: 'Formule régissant le calcul de la capacité minimale en Ampères-heures (Ah) requise pour alimenter l\'ensemble des automatismes de poste (IEDs, BCU, commutateurs, RTU) pendant une coupure secteur prolongée (10 h) tout en conservant l\'énergie nécessaire pour manœuvrer les disjoncteurs en fin d\'autonomie.',
        descEn: 'Normative formulation determining minimum battery storage capacity in Ampere-hours (Ah) required to power all substation automation electronics (IEDs, BCUs, switches, RTUs) during extended blackout conditions (10 h) while retaining sufficient discharge reserve to trip/close circuit breakers.',
        formula: 'C_{\\text{req}} = \\frac{1}{K_t \\cdot K_c} \\cdot \\left[ \\sum_{p=1}^{N} \\frac{I_p - I_{p-1}}{R_p} \\right] \\cdot K_{\\text{age}} \\cdot K_{\\text{temp}}',
        formulaDescFr: 'Avec Ip l\'échelon de courant du profil de décharge (courant permanent de veille SAS + courant de pointe d\'enclenchement des bobines disjoncteurs), Rp le facteur de décharge à la durée p (A/Ah), Kt le facteur de marge de conception (1.10 à 1.15), Kc le coefficient d\'utilisation utile de tension minimale (1.75 V/élément), Kage le facteur de vieillissement normatif (1.25), et Ktemp le facteur de correction thermique pour température ambiante tropicale (ex. 35 °C à Douala/Yaoundé).',
        formulaDescEn: 'Where Ip is load duty cycle discharge step current (continuous SAS quiescent load + peak breaker operating coils), Rp is discharge capacity rating factor, Kt is design margin factor (1.10 to 1.15), Kc is cell end-voltage factor (1.75 V/cell), Kage is normative aging compensation factor (1.25), and Ktemp is temperature derating factor adjusted for tropical ambient conditions (e.g., 35 °C in Douala/Yaoundé).',
        assumptionsFr: [
          'Autonomie minimale de veille permanente sans recharge secteur fixée à 10 heures.',
          'Cycle final de déclenchement simultané de 4 disjoncteurs haute tension (bobines de 20 A chacune pendant 100 ms).',
          'Facteur de vieillissement de 1.25 prévoyant le remplacement lorsque la batterie atteint 80% de sa capacité nominale.'
        ],
        assumptionsEn: [
          'Guaranteed quiescent backup duration without AC mains recharge established at 10 hours.',
          'Worst-case end-of-duty cycle: simultaneous tripping of 4 HV circuit breakers (20 A trip coils for 100 ms each).',
          'Aging margin of 1.25 anticipating end-of-life battery replacement when capacity degrades to 80% of nameplate rating.'
        ],
        calcTab: 'power'
      },
      {
        id: 'mms_report_buffer_sizing',
        tabLabelFr: 'Mémoire Tampon de Rapportage MMS',
        tabLabelEn: 'MMS Report Buffer Memory Sizing',
        titleFr: 'Dimensionnement de la Mémoire Tampon de Rapportage Non-Volatile MMS',
        titleEn: 'Non-Volatile Buffered Report Control Block (BRCB) Memory Sizing',
        descFr: 'Détermine la capacité de stockage interne en mémoire non-volatile de chaque IED pour garantir qu\'aucun événement de poste, alarme ou mesure chronodatée ne soit perdu en cas de défaillance temporaire du serveur SCADA ou du réseau Ethernet.',
        descEn: 'Calculates minimum non-volatile buffer memory required in each bay IED to guarantee that no substation Sequence of Events, timestamped alarm, or telemetry record is lost during temporary SCADA server offline periods or network disruptions.',
        formula: 'N_{\\text{buffer}} = \\lambda_{\\text{events}} \\cdot t_{\\text{outage}} \\cdot S_{\\text{entry}} \\quad \\implies \\quad \\text{RAM}_{\\text{req}} \\ge N_{\\text{buffer}} \\cdot K_{\\text{safety}}',
        formulaDescFr: 'Avec λevents le taux d\'arrivée maximal d\'événements lors d\'une perturbation (ex. 50 événements/seconde par tranche), toutage la durée maximale prévue de perte de communication SCADA (typiquement 2 heures soit 7 200 s), Sentry la taille mémoire d\'une entrée d\'événement horodatée SOE selon le standard CEI 61850 (≈ 64 octets), et Ksafety un coefficient de sécurité de 2.0.',
        formulaDescEn: 'Where λevents is peak event generation rate during complex grid disturbance (e.g., 50 events/second per bay), toutage is statutory communication outage duration (typically 2 hours or 7,200 s), Sentry is memory footprint of an IEC 61850 SOE timestamped report entry (≈ 64 bytes), and Ksafety is design headroom factor of 2.0.',
        assumptionsFr: [
          'Utilisation obligatoire de blocs de contrôle de rapportage tamponnés (BRCB - Buffered Report Control Block).',
          'Mémoire Flash / NVRAM non volatile conservant les données même en cas de coupure d\'alimentation continue.',
          'Horodatage SOE conservé avec une résolution temporelle absolue de 1 milliseconde.'
        ],
        assumptionsEn: [
          'Mandatory implementation of Buffered Report Control Blocks (BRCB).',
          'Non-volatile Flash / NVRAM retaining data integrity even upon complete auxiliary DC power collapse.',
          'SOE timestamps preserved with absolute 1 millisecond chronological precision.'
        ],
        calcTab: 'power'
      },
      {
        id: 'boolean_interlocking_matrix',
        tabLabelFr: 'Inter-verrouillage Topologique Booléen',
        tabLabelEn: 'Topological Boolean Interlocking Matrix',
        titleFr: 'Formulation Algorithmique de l\'Inter-verrouillage Topologique de Sécurité',
        titleEn: 'Algorithmic Formulation of Topological Safety Interlocking Rules',
        descFr: 'Modélisation mathématique rigoureuse sous forme d\'équation logique booléenne des conditions formelles de sécurité préalables à toute manœuvre d\'un appareil de coupure ou d\'isolement dans le poste haute tension.',
        descEn: 'Rigorous mathematical formulation as a Boolean logic equation defining mandatory physical preconditions before permitting any switching operation on high-voltage substation apparatus.',
        formula: 'E_{\\text{permis}}(\\text{DS}_k) = \\overline{I_{\\text{flow}}(\\text{CB})} \\land \\overline{U_{\\text{bus}}(\\text{ES})} \\land \\prod_{j \\ne k} C_{j,k} \\quad ; \\quad E_{\\text{permis}}(\\text{ES}) = \\overline{U_{\\text{line}}} \\land \\overline{U_{\\text{bus}}} \\land \\text{DS}_{\\text{open}}',
        formulaDescFr: 'Avec Epermis(DSk) l\'autorisation booléenne de manœuvre du sectionneur k, Iflow(CB) l\'état de passage de courant dans le disjoncteur associé (I > 0.02 In), Ubus(ES) la condition de mise à la terre, Cj,k la cohérence des positions des sectionneurs voisins, et Epermis(ES) l\'autorisation stricte de fermeture du sectionneur de terre nécessitant l\'absence totale de tension mesurée par les TT de ligne.',
        formulaDescEn: 'Where Epermis(DSk) is Boolean authorization signal enabling disconnector k actuation, Iflow(CB) is current flow detection across associated circuit breaker (I > 0.02 In), Ubus(ES) is ground switch position condition, Cj,k represents neighbor disconnector configuration rules, and Epermis(ES) is strict earth switch closing permission requiring absolute absence of voltage verified by line VTs.',
        assumptionsFr: [
          'Validation systématique de la double discordance de position (contacts auxiliaires NO et NC vérifiés complémentaires).',
          'Transmission des états d\'organes distants par trames Ethernet GOOSE avec contrôle du bit de validité et horodatage.',
          'Verrouillage matériel d\'urgence en série interdisant toute alimentation des moteurs de manœuvre en cas de perte de calculateur.'
        ],
        assumptionsEn: [
          'Systematic dual-position discrepancy validation (auxiliary NO and NC contacts verified complementary).',
          'Remote switchgear position exchange via Ethernet GOOSE messages with validity bit and timestamp auditing.',
          'Hardware backup lockout wired in series preventing any motor mechanism operation upon BCU failure.'
        ],
        calcTab: 'power'
      }
    ],
    sectionF: [
      {
        code: 'CEI 61850-8-1',
        tag: 'BUS DE STATION CEI 61850',
        titleFr: 'Réseaux & Systèmes de Communication pour l\'Automatisation des Postes - Spécification des Services de Communication Spécifiques (SCSM) pour MMS et GOOSE',
        titleEn: 'Communication Networks and Systems for Power Utility Automation - Specific Communication Service Mapping (SCSM) - Mappings on MMS and ISO/IEC 8802-3',
        descFr: 'Norme fondamentale régissant le protocole MMS pour la téléconduite SCADA et le protocole Ethernet GOOSE pour les automatismes ultra-rapides de tranche et d\'inter-verrouillage.',
        descEn: 'Foundational standard defining client/server MMS for SCADA telecontrol and Layer 2 GOOSE multicast for high-speed bay protection and interlocking.'
      },
      {
        code: 'CEI 61850-9-2 & CEI 61869-9',
        tag: 'BUS DE PROCESSUS NUMÉRIQUE',
        titleFr: 'Réseaux de Communication pour Postes - Transmission Numérique de Valeurs Échantillonnées (Sampled Values)',
        titleEn: 'Communication Networks for Substations - Digital Interface for Instrument Transformers - Sampled Values (SV)',
        descFr: 'Définit les flux de valeurs échantillonnées (4 800 Hz à 50 Hz) transmis par fibres optiques depuis les Merging Units vers les IEDs, remplaçant la filerie analogique cuivre.',
        descEn: 'Defines optical Sampled Values streams (4,800 Hz at 50 Hz) transmitted from Merging Units to protective IEDs, replacing analog copper instrument wiring.'
      },
      {
        code: 'CEI 62439-3',
        tag: 'REDONDANCE SANS COUPURE',
        titleFr: 'Réseaux de Communication Industriels - Protocoles de Redondance Haute Disponibilité (PRP & HSR)',
        titleEn: 'Industrial Communication Networks - High Availability Redundancy Protocols (PRP & HSR)',
        descFr: 'Standard universel imposant la duplication des paquets Ethernet sur deux réseaux physiquement indépendants garantissant un temps de basculement nul (0 ms) en cas de panne.',
        descEn: 'Universal standard mandating simultaneous packet duplication across dual isolated networks ensuring zero-millisecond (hitless) recovery upon link failure.'
      },
      {
        code: 'CEI 60870-5-104',
        tag: 'TÉLÉCONDUITE SCADA',
        titleFr: 'Matériels & Systèmes de Téléconduite - Protocoles de Transmission - Accès Réseau pour CEI 60870-5-101 Utilisant des Profils de Transport Normalisés (TCP/IP)',
        titleEn: 'Telecontrol Equipment and Systems - Transmission Protocols - Network Access for IEC 60870-5-101 Using Standard Transport Profiles (TCP/IP)',
        descFr: 'Protocole de référence reliant les postes électriques au centre de dispatching national de Mangombé (SONATREL) pour l\'acquisition des mesures et l\'envoi des télécommandes.',
        descEn: 'Primary standard governing telecontrol data transmission between high-voltage substations and the SONATREL national grid control center over IP backbones.'
      },
      {
        code: 'IEEE Std 485',
        tag: 'ALIMENTATION SECOURUE',
        titleFr: 'Pratique Recommandée IEEE pour le Dimensionnement des Batteries d\'Accumulateurs au Plomb pour Postes Électriques',
        titleEn: 'IEEE Recommended Practice for Sizing Lead-Acid Batteries for Stationary Applications',
        descFr: 'Méthodologie normalisée de calcul des profils de décharge et de dimensionnement des ateliers d\'énergie 110 Vcc secourant les calculateurs SAS et bobines de disjoncteurs.',
        descEn: 'Standardized methodology for duty cycle profiling and Ampere-hour sizing of 110 Vdc stationary battery banks powering substation automation and trip coils.'
      },
      {
        code: 'CEI 62351 Parts 3/5/6/7',
        tag: 'CYBERSÉCURITÉ DES RÉSEAUX ÉNERGÉTIQUES',
        titleFr: 'Gestion des Systèmes de Puissance & Échanges d\'Informations Associés - Sécurité des Données et des Communications',
        titleEn: 'Power Systems Management and Associated Information Exchange - Data and Communications Security',
        descFr: 'Exigences de chiffrement TLS, authentification des trames GOOSE et protection contre les cyberattaques sur les architectures de contrôle-commande de poste et SCADA.',
        descEn: 'Encryption standards, TLS tunneling, cryptographic GOOSE authentication, and cyber defense guidelines for substation automation and SCADA systems.'
      }
    ]
  },

  // D10: Stockage d'Énergie BESS & Recharge IRVE
  // D10: Systèmes de Stockage d'Énergie, STEP & Recharge IRVE
  D10: {
    domainCode: 'D10',
    sectionA: {
      roleFr: "Conception, intégration et exploitation des systèmes de stockage stationnaire d'énergie (BESS LiFePO4 conteneurisé), des stations de transfert d'énergie par pompage (STEP/PSH), des micro-réseaux hybrides avec onduleurs formateurs de réseau (Grid-Forming / VSM), et des infrastructures de recharge ultra-rapide pour véhicules électriques (IRVE 150–350 kW HPC).",
      roleEn: 'Engineering, deployment, and operation of utility-scale Battery Energy Storage Systems (BESS LiFePO4 containerized), Pumped-Storage Hydropower (PSH), hybrid microgrids with Grid-Forming Virtual Synchronous Machines (VSM), and ultra-fast High-Power EV Charging (HPC 150–350 kW).',
      inputsFr: {
        title: 'Production Renouvelable Intermittente & Réseau MT/HT',
        desc: 'Raccordement au jeu de barres 15/30 kV de poste source ou centrale solaire, arrivées 400 V triphasé pour IRVE, et retenues hydrauliques amont/aval pour STEP.',
        voltage: '30 kV MT / 400 V BT • 800–1 500 V DC Bus Continu'
      },
      inputsEn: {
        title: 'Intermittent Renewable Generation & MV/HV Grid',
        desc: 'Interconnection to 15/30 kV substation or solar plant busbar, 400 V 3-phase mains for EV charging hubs, and upper/lower water reservoirs for pumped hydro storage.',
        voltage: '30 kV MV / 400 V LV • 800–1,500 V DC DC-Bus'
      },
      processFr: {
        title: 'Stockage Électrochimique/Hydraulique & Conversion 4-Quadrants',
        desc: 'Conversion d\'énergie bidirectionnelle AC/DC par onduleurs réversibles PCS à technologie SiC/IGBT, gestion thermique liquide des racks LFP, équilibrage actif des cellules par BMS esclave/maître, et pompage-turbinage réversible Francis.',
        note: 'Inertie synthétique instantanée (FFR < 50 ms) et contrôle de statisme P-f / Q-V stabilisant les réseaux faibles insulaires et interconnectés.'
      },
      processEn: {
        title: 'Electrochemical/Hydraulic Storage & 4-Quadrant Power Conversion',
        desc: 'Bidirectional AC/DC conversion via SiC/IGBT PCS inverters, liquid thermal conditioning of LFP battery racks, cell-level active balancing by master/slave BMS, and reversible Francis pump-turbines.',
        note: 'Instantaneous Fast Frequency Response (FFR < 50 ms) and synthetic inertia with P-f / Q-V droop stabilizing weak and isolated grids.'
      },
      outputsFr: {
        title: 'Services Système, Écrêtement de Pointe & Superchargeurs HPC',
        desc: 'Réserve primaire de fréquence, régulation de tension Volt-VAr, lissage de rampe solaire/éolienne, alimentation d\'urgence en mode îloté (Black Start), et recharge rapide CCS Combo 2 jusqu\'à 500 A.',
        earthing: 'Régime IT côté DC batterie avec contrôleur permanent d\'isolement (CPI) et TN-S / TT côté distribution AC avec liaisons équipotentielles terre R < 1 Ω'
      },
      outputsEn: {
        title: 'Grid Ancillary Services, Peak Shaving & HPC Fast Charging',
        desc: 'Fast frequency response reserve, Volt-VAr dynamic voltage support, renewable ramp smoothing, black start islanded capability, and CCS Combo 2 EV charging up to 500 A.',
        earthing: 'Isolated IT earthing scheme on DC battery bus with continuous IMD monitoring and TN-S / TT on AC side with telecom-grade grounding (R < 1 Ω)'
      }
    },
    sectionB: {
      summaryFr: "Panorama architectural des 5 technologies majeures de stockage et de recharge électrique, illustrant le BESS conteneurisé haute tension 1 500 V DC, la station de transfert d'énergie par pompage (STEP), le micro-réseau hybride autonome, les hubs autoroutiers de superchargeurs IRVE 350 kW et le stockage industriel C&I en autoconsommation.",
      summaryEn: 'Architectural overview of the 5 major energy storage and charging technologies, spanning 1,500 V DC utility-scale BESS, reversible pumped-storage hydro (PSH), autonomous hybrid microgrids, highway HPC 350 kW charging hubs, and commercial & industrial behind-the-meter peak shaving.',
      architectures: [
        {
          nameFr: "Système de Stockage BESS Conteneurisé Haute Tension 1 500 V DC avec Convertisseur Grid-Forming (Centrale de Maroua/Guider 15 MWc / 20 MWh)",
          nameEn: '1,500 V DC Containerized BESS with Grid-Forming Inverter (Maroua/Guider 15 MWp / 20 MWh Solar-Storage Plant)',
          techFr: "Racks batteries prismatiques LiFePO4 1 500 V DC, refroidissement liquide haute efficacité, convertisseurs PCS réversibles 4-quadrants avec loi de contrôle en machine synchrone virtuelle (VSM) et système d'extinction précoce Novec 1230.",
          techEn: '1,500 V DC prismatic LiFePO4 battery racks, closed-loop liquid thermal conditioning, 4-quadrant bidirectional PCS inverters with Virtual Synchronous Machine (VSM) droop control, and automated Novec 1230 fire suppression.',
          descFr: "Stabilisation dynamique du réseau interconnecté Nord (RIN) du Cameroun : injection instantanée de puissance active pour contrer les chutes brutales de fréquence lors des passages nuageux sur le champ solaire de Maroua.",
          descEn: 'Dynamic stabilization of Cameroon\'s isolated Northern Interconnected Grid (RIN): injects instantaneous active power to arrest steep frequency drops when heavy clouds shade the Maroua solar fields.',
          standard: 'IEC 62933-2-1, IEEE Std 2800-2022, NFPA 855 / UL 9540A',
          metricFr: 'Capacité 20 MWh / 10 MW • Réponse FFR < 50 ms • Rendement de cycle RTE > 87%',
          metricEn: 'Capacity 20 MWh / 10 MW • FFR response < 50 ms • Round-trip efficiency RTE > 87%'
        },
        {
          nameFr: "Station de Transfert d'Énergie par Pompage STEP Hydraulique Réversible (Complexe de Retenue Sanaga / Nachtigal)",
          nameEn: 'Reversible Pumped-Storage Hydropower (PSH / STEP) Facility (Sanaga / Nachtigal Basin Complex)',
          techFr: "Deux réservoirs hydrauliques étagés avec dénivelé altimétrique, conduite forcée blindée, groupes turbo-pompes réversibles Francis ou DFIG à vitesse variable, alternateur/moteur synchrone raccordé au réseau HTB 225 kV.",
          techEn: 'Upper and lower hydraulic reservoirs separated by topographic head, steel-lined penstock, reversible Francis pump-turbines or variable-speed DFIG motor-generators, connected to 225 kV transmission grid.',
          descFr: "Stockage massif d'énergie inter-saisonnier et régulation de pointe nationale : pompage d'eau pendant les heures creuses nocturnes et restitution immédiate de 100 à 300 MW lors de la pointe de consommation du soir.",
          descEn: 'Gigawatt-hour scale inter-seasonal storage and peak grid balancing: pumps water during overnight low-demand hours and discharges 100 to 300 MW on demand during the critical evening system peak.',
          standard: 'IEC 60034-1, IEC 61362, Cigré TB 779',
          metricFr: 'Puissance 100–300 MW • Démarrage turbine < 90 s • Rendement aller-retour hydraulique 75–82%',
          metricEn: 'Rating 100–300 MW • Turbine start time < 90 s • Hydraulic round-trip efficiency 75–82%'
        },
        {
          nameFr: "Micro-Réseau Hybride Solaire PV + Stockage BESS + Groupes Diesel (Site Isolé du Grand Nord Cameroun)",
          nameEn: 'Hybrid Solar PV + BESS Storage + Diesel Genset Microgrid (Far North Off-Grid Community)',
          techFr: "Bus AC couplé en moyenne tension 30 kV, régulation coordonnée par Microgrid Energy Management System (EMS), onduleurs Grid-Forming maîtres imposant la référence 50.0 Hz et délestant 100% de la consommation de gasoil en journée.",
          techEn: 'AC-coupled 30 kV medium-voltage bus, centralized Microgrid Energy Management System (EMS), and master Grid-Forming inverters synthesizing 50.0 Hz reference while shutting off diesel fuel generators completely.',
          descFr: "Électrification rurale décentralisée fiable et décarbonée : alimentation continue 24h/24 des localités isolées avec basculement automatique sans coupure (< 4 ms) entre modes îloté et secouru.",
          descEn: 'Reliable, low-carbon decentralized rural electrification: continuous 24/7 supply for isolated populations with seamless uninterrupted transfer (< 4 ms) between battery-only and genset-assisted modes.',
          standard: 'IEC 62898-1 / IEC 62898-2, IEEE Std 1547.4, IEEE Std 2030.7',
          metricFr: 'Pénétration solaire jusqu\'à 95% • Économie gasoil > 65% • Coupure de transfert < 4 ms',
          metricEn: 'Solar penetration up to 95% • Diesel fuel savings > 65% • Seamless transfer interruption < 4 ms'
        },
        {
          nameFr: "Hub de Recharge Ultra-Rapide Haute Puissance IRVE 350 kW HPC avec Stockage Tampon BESS (Corridor Autoroutier Douala–Yaoundé)",
          nameEn: 'High-Power EV Charging (HPC 350 kW) Hub with BESS Buffer Storage (Douala–Yaoundé Highway Corridor)',
          techFr: "Bornes de recharge DC CCS Combo 2 / CHAdeMO 350 kW à câbles refroidis par liquide (500 A sous 200–1 000 V), adossées à un stockage BESS 500 kWh évitant les surcharges du réseau de distribution 15/30 kV aux heures de pointe.",
          techEn: '350 kW liquid-cooled CCS Combo 2 / CHAdeMO DC fast dispensers (500 A up to 1,000 V), backed by a 500 kWh stationary BESS buffer to shave distribution transformer peak loads.',
          descFr: "Recharge ultra-rapide des véhicules électriques interurbains : délivre jusqu'à 300 km d'autonomie en 15 minutes sans perturber le réseau local grâce à la décharge tampon de la batterie stationnaire.",
          descEn: 'Ultra-fast intercity electric fleet charging: adds 300 km of range in 15 minutes without grid substation overload by drawing instant peak demand from the local stationary battery buffer.',
          standard: 'IEC 61851-1 / IEC 61851-23, ISO 15118 (Plug & Charge / V2G), NF C 15-100 Part 7-722',
          metricFr: 'Puissance 350 kW/point de charge • Recharge 10%–80% en 15 min • Appel réseau lissé à 150 kVA',
          metricEn: 'Power 350 kW/charge point • 10%–80% recharge in 15 min • Grid demand capped at 150 kVA'
        },
        {
          nameFr: "Système de Stockage Distribué Commercial & Industriel (C&I) en Autoconsommation Optimisée (Usine Brassico / Agroalimentaire Douala)",
          nameEn: 'Commercial & Industrial (C&I) Behind-the-Meter Storage & Peak Shaving (Douala Industrial Complex)',
          techFr: "Conteneurs BESS 250 kW / 500 kWh couplés au TGBT 400 V de l'usine, gestion automatique de l'effacement de la pointe tarifaire (Peak Shaving) et secours instantané des charges critiques en cas de délestage réseau ENEO.",
          techEn: 'Behind-the-meter 250 kW / 500 kWh BESS containers coupled to 400 V main switchboard (TGBT), automated peak-tariff shaving, and sub-16 ms seamless UPS transfer for sensitive processing lines during outages.',
          descFr: "Sécurisation de la continuité de fabrication et réduction des factures de puissance souscrite : effacement automatique des pointes de demande lors des démarrages de compresseurs et fours industriels.",
          descEn: 'Guarantees industrial batch continuity and slashes utility peak demand penalties: automatically injects stored energy when heavy industrial compressors and crushers start up.',
          standard: 'CEI 62619, CEI 61439-2, NF C 15-100',
          metricFr: 'Écrêtement de pointe 200 kW • Basculement secours UPS < 16 ms • Amortissement investissement 4.5 ans',
          metricEn: 'Peak demand shaving 200 kW • UPS transfer time < 16 ms • Payback period 4.5 years'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-bess-container-5mw',
        nameFr: "Conteneur Batterie Stationnaire BESS 5 MW / 10 MWh (LiFePO4 1 500 V DC)",
        nameEn: 'Utility-Scale Containerized BESS 5 MW / 10 MWh (1,500 V DC LiFePO4)',
        voltage: '1 500 V DC Racks • 30 kV Raccordement MT',
        roleFr: "Stockage massif de l'énergie photovoltaïque excédentaire, régulation primaire instantanée de fréquence et soutien dynamique de tension.",
        roleEn: 'Large-scale storage of surplus solar generation, instantaneous primary frequency regulation, and dynamic grid voltage support.',
        symbol: 'BESS-5MW',
        standard: 'IEC 62933-2-1, NFPA 855 / UL 9540A, IEC 62619',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'bess-sizing'
      },
      {
        id: 'eq-exp-grid-forming-inv',
        nameFr: "Convertisseur de Puissance Réversible Bidirectionnel PCS Grid-Forming (2 500 kVA)",
        nameEn: 'Bidirectional Grid-Forming Power Conversion System (PCS 2,500 kVA)',
        voltage: '690 V AC / 1 500 V DC (Transfo élévateur 30 kV dédié)',
        roleFr: "Fonctionnement en source de tension autonome créant le vecteur d'onde 50 Hz avec inertie virtuelle (VSM) et capacité de Black Start.",
        roleEn: 'Operates as autonomous voltage source synthesizing 50 Hz waveform with virtual inertia (VSM) and full black start capability.',
        symbol: 'PCS-GF',
        standard: 'IEEE Std 2800-2022, IEEE 1547-2018, IEC 62477-1',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-ev-hpc-350kw',
        nameFr: "Borne de Recharge Ultra-Rapide IRVE Haute Puissance 350 kW (Liquid-Cooled 500 A)",
        nameEn: 'High-Power EV Charging Dispenser 350 kW (Liquid-Cooled 500 A CCS Combo 2)',
        voltage: '400 V AC Entrée • 200–1 000 V DC Sortie Véhicule',
        roleFr: "Recharge ultra-rapide des véhicules électriques légers et poids lourds avec connecteur CCS Combo 2 refroidi par circulation de fluide caloporteur.",
        roleEn: 'Ultra-fast electric vehicle and heavy-duty bus charging with liquid-cooled CCS Combo 2 cable delivering continuous 500 A.',
        symbol: 'EV-HPC',
        standard: 'IEC 61851-23, ISO 15118-20, NF C 15-100 Part 7-722',
        imgUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-psh-pump-turbine',
        nameFr: "Groupe Réversible Francis de Pompage-Turbinage STEP (150 MW / 225 kV)",
        nameEn: 'Reversible Francis Pump-Turbine & Motor-Generator (150 MW / 225 kV)',
        voltage: '15.5 kV Générateur • 225 kV Évacuation HTB',
        roleFr: "Pompage de l'eau du bassin inférieur vers le bassin supérieur en heures creuses, et turbinage à pleine charge en heures de pointe nationale.",
        roleEn: 'Pumping water from lower to upper reservoir during off-peak hours, and generating 150 MW peaking power on national grid command.',
        symbol: 'PSH-TURB',
        standard: 'IEC 60034-1, IEC 61362, Cigré TB 779',
        imgUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-bms-master-controller',
        nameFr: "Système de Gestion de Batterie Centralisé (BMS Maître / EMS de Cluster)",
        nameEn: 'Master Battery Management System & Cluster Energy Management System',
        voltage: '24 V DC Sécurisé (Alimentation ASI Redondée)',
        roleFr: "Surveillance télémétrique de la tension de chaque cellule (résolution 1 mV), température multipoint, estimation SOC/SOH et commande des contacteurs DC.",
        roleEn: 'Cell-level telemetry monitoring (1 mV resolution), multi-point temperature sensing, SOC/SOH estimation, and DC contactor protection trip.',
        symbol: 'BMS-MTR',
        standard: 'IEC 62619, IEC 61508 SIL 2, ISO 26262',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-bess-liquid-chiller',
        nameFr: "Centrale de Climatisation & Refroidissement Liquide des Racks Batteries (HVAC / Chiller)",
        nameEn: 'Containerized Liquid Cooling Chiller & Battery Thermal Management Unit',
        voltage: '400 V Triphasé 50 Hz (Puissance frigorifique 80 kW)',
        roleFr: "Maintien de la température cellulaire entre 22°C et 28°C avec gradient thermique < 3°C sur l'ensemble du conteneur, prévenant l'emballement thermique.",
        roleEn: 'Maintains battery cell temperatures strictly between 22°C and 28°C with thermal gradient < 3°C across the container, preventing thermal runaway.',
        symbol: 'BESS-CHILL',
        standard: 'IEC 62933-5-2, NFPA 855, ASHRAE Handbook',
        imgUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      }
    ],
    sectionD: [
      {
        phase: 'Phase 1',
        titleFr: 'Étude de Faisabilité, Modélisation de la Courbe de Charge & Choix Technologique',
        titleEn: 'Feasibility Study, Hourly Load Profiling & Storage Technology Selection',
        descFr: "Analyse des profils de consommation, quantification du gisement d'énergie renouvelable excédentaire, arbitrage technologique entre BESS LiFePO4 et STEP hydraulique, et rentabilité LCOS.",
        descEn: 'Analyzing daily load profiles, quantifying surplus renewable energy generation, evaluating LFP electrochemical vs hydraulic pumped storage, and Levelized Cost of Storage (LCOS) optimization.'
      },
      {
        phase: 'Phase 2',
        titleFr: 'Dimensionnement Capacité / Puissance (MWh/MW), Ratios C-Rate & Simulation',
        titleEn: 'Energy/Power Sizing (MWh/MW), C-Rate Optimization & Dynamic Simulation',
        descFr: "Calcul de la capacité utile en fonction de la profondeur de décharge (DoD 80%), du facteur de vieillissement EOL, du taux de charge/décharge (C-rate 0.5C à 2C) et modélisation MATLAB/Simulink.",
        descEn: 'Sizing usable capacity accounting for Depth of Discharge (80% DoD), end-of-life fade factor, continuous C-rate rating (0.5C to 2C), and dynamic power simulation in MATLAB/Simulink.'
      },
      {
        phase: 'Phase 3',
        titleFr: 'Ingénierie Électrotechnique, Schémas Unifilaires MT/BT & Sécurité Emballement (NFPA 855)',
        titleEn: 'Detailed Electrical Engineering, Single-Line Diagrams & Thermal Runaway Mitigation',
        descFr: "Conception des tableaux DC 1 500 V, dimensionnement des câbles solaires/batterie, sélection des transformateurs élévateurs MT et conception du confinement incendie per NFPA 855 / UL 9540A.",
        descEn: 'Engineering 1,500 V DC switchgear, sizing battery power cables, step-up MV transformers, and designing multi-tiered deflagration venting and fire suppression per NFPA 855 / UL 9540A.'
      },
      {
        phase: 'Phase 4',
        titleFr: 'Intégration en Usine, Câblage des Racks 1 500 V DC & Essais FAT du Système BMS/PCS',
        titleEn: 'Factory Container Assembly, 1,500 V DC Rack Wiring & BMS/PCS Factory Acceptance Testing',
        descFr: "Montage des modules LiFePO4 dans les racks étanches, raccordement du busbar cuivre, calibration du BMS et tests FAT complets de communication Modbus TCP / CEI 61850 avec le convertisseur PCS.",
        descEn: 'Mounting LiFePO4 prismatic modules into sealed racks, copper busbar torqueing, BMS voltage/temperature sensor calibration, and full FAT communication testing with PCS inverters.'
      },
      {
        phase: 'Phase 5',
        titleFr: 'Génie Civil, Pose des Dalles Conteneurs, Raccordement Réseau MT & Terre Maillée',
        titleEn: 'Civil Works, Container Foundation Slabs, MV Substation Connection & Earthing Grid',
        descFr: "Coulage des radiers béton armé étanches avec bacs de rétention, raccordement sur le réseau 30 kV via cellule départ RMU et réalisation d'une boucle de terre maillée cuivre à très basse impédance (R < 1 Ω).",
        descEn: 'Pouring reinforced concrete foundation slabs with retention basins, cabling 30 kV medium-voltage interconnection via RMU bay, and installing dedicated low-impedance copper earthing mesh (R < 1 Ω).'
      },
      {
        phase: 'Phase 6',
        titleFr: 'Commissioning sur Site, Tests de Statisme Grid-Forming, Traversée de Creux & Black Start',
        titleEn: 'Site Commissioning, Grid-Forming Droop Validation, Fault Ride-Through & Black Start',
        descFr: "Essais en charge réelle : réponse en fréquence FFR < 50 ms, vérification de la traversée des creux de tension (LVRT/FRT per IEEE 2800) et essai de reconstitution de réseau îloté (Black Start).",
        descEn: 'Live commissioning: verifying sub-50 ms Fast Frequency Response, Low-Voltage Ride-Through (LVRT per IEEE 2800), and islanded grid restoration from dead bus (Black Start capability).'
      },
      {
        phase: 'Phase 7',
        titleFr: 'Exploitation Connectée, Dispatching Prédictif EMS, Suivi du Vieillissement SOH & Recyclage',
        titleEn: 'Commercial Operation, Predictive EMS Dispatch, SOH Degradation Tracking & Second-Life',
        descFr: "Supervision SCADA continue, optimisation journalière des cycles charge/décharge selon les tarifs d'électricité, suivi de l'état de santé SOH et valorisation en seconde vie / recyclage.",
        descEn: 'Continuous cloud/SCADA monitoring, day-ahead economic dispatch optimization, battery State of Health (SOH) tracking, and second-life repurposing or circular recycling.'
      }
    ],
    sectionE: [
      {
        id: 'bess_capacity_sizing_formula',
        tabLabelFr: '1. Capacité Énergétique BESS',
        tabLabelEn: '1. BESS Capacity Sizing',
        titleFr: "Dimensionnement de la Capacité Énergétique Nominale d'un Système BESS (CEI 62933-2-1)",
        titleEn: 'Utility BESS Nominal Energy Capacity Sizing Formulation (IEC 62933-2-1)',
        descFr: "Formulation rigoureuse déterminant la capacité nominale brute de la batterie en mégawattheures (MWh) en intégrant la profondeur de décharge maximale recommandée (DoD), les rendements du convertisseur PCS et des cellules, ainsi que le facteur de dégradation en fin de vie (EOL).",
        descEn: 'Rigorous formulation determining gross nominal battery capacity in Megawatt-hours (MWh) accounting for maximum allowable Depth of Discharge (DoD), PCS inverter and cell efficiencies, and End-of-Life (EOL) degradation margin.',
        formula: 'E_{\\text{nom}} = \\frac{P_{\\text{charge}} \\cdot t_{\\text{autonomie}}}{\\text{DoD} \\cdot \\eta_{\\text{PCS}} \\cdot \\eta_{\\text{bat}} \\cdot (1 - \\text{Deg}_{\\text{EOL}})}',
        formulaDescFr: "Où E_nom est la capacité brute requise (MWh), P_charge la puissance continue à fournir pendant la décharge (MW), t_autonomie la durée de décharge requise à pleine charge (h), DoD la profondeur de décharge maximale admissible (typiquement 80% à 90% pour LFP), η_PCS le rendement du convertisseur (97%), η_bat le rendement faradique de la cellule (95%), et Deg_EOL la réserve de dégradation admissible (typiquement 20% en fin de garantie).",
        formulaDescEn: 'Where E_nom is gross required capacity (MWh), P_charge is continuous discharge power (MW), t_autonomie is discharge duration at full load (h), DoD is maximum depth of discharge (typically 80% to 90% for LFP), η_PCS is power conversion efficiency (97%), η_bat is battery electrochemical efficiency (95%), and Deg_EOL is allowable capacity loss at end-of-life (typically 20%).',
        assumptionsFr: [
          'Chimie Lithium-Fer-Phosphate (LiFePO4) offrant 6 000 cycles à 80% DoD sous climat tropical climatisé.',
          'Facteur de réserve de fin de vie contractuel garanti : Deg_EOL = 0.20 (soit 80% de SOH après 10 ans).',
          'Rendement global combiné de la chaîne de décharge : η_PCS · η_bat ≈ 92.1%.'
        ],
        assumptionsEn: [
          'Lithium Iron Phosphate (LiFePO4) chemistry providing 6,000 cycles at 80% DoD under climate-controlled container.',
          'Contractual end-of-life degradation reserve: Deg_EOL = 0.20 (80% SOH guaranteed after 10 years).',
          'Overall combined discharge chain efficiency: η_PCS · η_bat ≈ 92.1%.'
        ],
        calcTab: 'bess-sizing'
      },
      {
        id: 'psh_hydro_storage_power',
        tabLabelFr: '2. Puissance Hydraulique STEP',
        tabLabelEn: '2. PSH Hydraulic Power',
        titleFr: "Puissance et Énergie d'une Station de Transfert d'Énergie par Pompage STEP (Hydraulique PSH)",
        titleEn: 'Pumped-Storage Hydropower (PSH) Generating Power & Stored Energy Capacity',
        descFr: "Calcul de la puissance électrique générée en turbinage et de l'énergie totale stockée dans la retenue supérieure d'une STEP en fonction du débit volumique, de la hauteur de chute nette et du rendement global de l'installation.",
        descEn: 'Formulates generating electrical power and total stored potential energy within upper reservoir of a pumped-storage hydro facility based on volumetric flow rate, net hydraulic head, and combined turbine-generator efficiency.',
        formula: 'P_{\\text{turb}} = \\rho \\cdot g \\cdot Q \\cdot H_{\\text{net}} \\cdot \\eta_{\\text{turb}}, \\quad E_{\\text{hyd}} = \\frac{\\rho \\cdot g \\cdot V_{\\text{retenue}} \\cdot H_{\\text{net}} \\cdot \\eta_{\\text{cycle}}}{3.6 \\cdot 10^9}',
        formulaDescFr: "Où P_turb est la puissance électrique produite (Watts), ρ la masse volumique de l'eau (1 000 kg/m³), g l'accélération de la pesanteur (9.81 m/s²), Q le débit turbiné (m³/s), H_net la hauteur de chute nette déduction faite des pertes de charge (m), η_turb le rendement global turbine-alternateur (88%–92%), V_retenue le volume utile du bassin supérieur (m³), et E_hyd l'énergie électrique récupérable (MWh).",
        formulaDescEn: 'Where P_turb is generated electrical power (Watts), ρ is water density (1,000 kg/m³), g is gravitational acceleration (9.81 m/s²), Q is discharge flow (m³/s), H_net is net head after friction losses (m), η_turb is combined turbine-generator efficiency (88%–92%), V_retenue is usable upper reservoir volume (m³), and E_hyd is recoverable energy in MWh.',
        assumptionsFr: [
          'Rendement de cycle complet pompage-turbinage eau-à-eau : η_cycle ≈ 75% à 80%.',
          'Pertes de charge singulières et linéaires dans la conduite forcée : déduction de 3% à 5% de la hauteur brute.',
          'Temps de basculement du mode pompage au mode turbinage : moins de 120 secondes avec groupe Francis.'
        ],
        assumptionsEn: [
          'Full water-to-water round-trip efficiency of the PSH facility: η_cycle ≈ 75% to 80%.',
          'Linear and singular friction head losses in penstock: 3% to 5% reduction from gross head.',
          'Full mode transition time from pumping to generating: under 120 seconds with reversible Francis unit.'
        ],
        calcTab: 'power'
      },
      {
        id: 'grid_forming_virtual_inertia',
        tabLabelFr: '3. Inertie Virtuelle Grid-Forming',
        tabLabelEn: '3. Grid-Forming Virtual Inertia',
        titleFr: "Loi de Statisme Fréquence-Puissance & Inertie Virtuelle Grid-Forming (IEEE Std 2800 / VSM)",
        titleEn: 'Active Power-Frequency Droop & Virtual Synchronous Machine Inertia (IEEE 2800 / VSM)',
        descFr: "Équation régissant le comportement d'un onduleur formateur de réseau (Grid-Forming PCS) émulant l'équation d'oscillation du rotor d'un alternateur synchrone réel (Virtual Synchronous Machine) pour injecter une réponse inertielle ultrarapide.",
        descEn: 'Governing equation of a Grid-Forming power conversion inverter emulating synchronous generator rotor swing dynamics (Virtual Synchronous Machine), delivering instantaneous synthetic inertia and frequency droop.',
        formula: 'f - f_0 = -k_p \\cdot (P - P_0) - \\frac{2 H_{\\text{synth}}}{f_0} \\cdot \\frac{df}{dt}',
        formulaDescFr: "Où f est la fréquence instantanée mesurée (Hz), f_0 la fréquence de consigne (50.0 Hz), k_p le coefficient de statisme de puissance (Hz/MW, typiquement 2% à 4%), P la puissance active instantanée injectée (MW), P_0 la puissance de base de consigne, H_synth la constante d'inertie synthétique programmée (secondes, typiquement 3.0 à 6.0 s), et df/dt le taux de variation de fréquence (RoCoF).",
        formulaDescEn: 'Where f is instantaneous frequency (Hz), f_0 is nominal reference (50.0 Hz), k_p is droop slope (Hz/MW, typically 2% to 4%), P is injected active power (MW), P_0 is baseline dispatch setpoint, H_synth is programmed synthetic inertia constant (seconds, typically 3.0 to 6.0 s), and df/dt is grid RoCoF.',
        assumptionsFr: [
          'Temps de réponse de la boucle d\'inertie synthétique : inférieur à 20 millisecondes.',
          'Capacité de surcharge transitoire de l\'onduleur PCS : 150% de la puissance nominale pendant 10 secondes.',
          'Conformité stricte aux exigences de stabilité de réseau de l\'IEEE Std 2800-2022 et du Code SONATREL.'
        ],
        assumptionsEn: [
          'Synthetic inertia loop response latency: under 20 milliseconds.',
          'PCS inverter transient overload capability: 150% of rated capacity for 10 seconds.',
          'Strict compliance with IEEE Std 2800-2022 inverter-based resource interconnection standards.'
        ],
        calcTab: 'power'
      },
      {
        id: 'bess_round_trip_efficiency',
        tabLabelFr: '4. Rendement Aller-Retour RTE',
        tabLabelEn: '4. Round-Trip Efficiency RTE',
        titleFr: "Calcul du Rendement Global Aller-Retour BESS (Round-Trip Efficiency RTE per CEI 62933)",
        titleEn: 'Comprehensive BESS Round-Trip Efficiency (RTE) Model (IEC 62933-2-1)',
        descFr: "Quantification du rendement énergétique global sur un cycle complet de charge et décharge en tenant compte des pertes électrochimiques internes des cellules, des pertes de commutation des convertisseurs PCS, des pertes fer/cuivre des transformateurs élévateurs et de la consommation des auxiliaires de climatisation.",
        descEn: 'Formulates overall AC-to-AC round-trip energy efficiency across a full charge-discharge cycle, incorporating cell internal electrochemical losses, PCS semiconductor switching losses, MV transformer losses, and HVAC chiller consumption.',
        formula: '\\text{RTE} = \\frac{E_{\\text{décharge}}}{E_{\\text{charge}}} = \\eta_{\\text{coulomb}} \\cdot \\eta_{\\text{tension}} \\cdot \\eta_{\\text{PCS\\_charge}} \\cdot \\eta_{\\text{PCS\\_décharge}} \\cdot \\eta_{\\text{transfo}}^2 \\cdot \\left( 1 - \\frac{E_{\\text{auxiliaires}}}{E_{\\text{charge}}} \\right)',
        formulaDescFr: "Où RTE est le rendement de cycle global AC-à-AC, η_coulomb le rendement faradique (environ 99% pour LiFePO4), η_tension le ratio de tension moyenne décharge/charge (environ 94%), η_PCS le rendement des onduleurs réversibles (97.5%), η_transfo le rendement du transformateur 0.69/30 kV (99%), et E_auxiliaires l'énergie consommée par le groupe froid de climatisation et le contrôle-commande (typiquement 2% à 4% de l'énergie stockée).",
        formulaDescEn: 'Where RTE is AC-to-AC round-trip efficiency, η_coulomb is coulombic efficiency (~99% for LFP), η_tension is voltage ratio discharge/charge (~94%), η_PCS is PCS conversion efficiency (97.5%), η_transfo is transformer efficiency (99%), and E_auxiliaires is parasitic energy consumed by chillers and BMS (typically 2% to 4% of stored energy).',
        assumptionsFr: [
          'Régime de charge/décharge symétrique à 0.5C sous température régulée de 25°C.',
          'Consommation des auxiliaires de climatisation plus élevée en climat tropical sahélien (ex. Maroua).',
          'RTE moyen mesuré aux bornes MT 30 kV du conteneur BESS : 85% à 88% en exploitation nominale.'
        ],
        assumptionsEn: [
          'Symmetrical 0.5C charge/discharge cycle under controlled 25°C ambient temperature.',
          'Thermal HVAC parasitic load increases under hot Sahelian climates (e.g. Maroua, Cameroon).',
          'Average AC-to-AC measured RTE at 30 kV terminals: 85% to 88% during normal commercial operations.'
        ],
        calcTab: 'bess-sizing'
      },
      {
        id: 'battery_arrhenius_degradation_model',
        tabLabelFr: '5. Vieillissement Cellule Arrhenius',
        tabLabelEn: '5. Battery Aging Arrhenius Model',
        titleFr: "Modèle Semi-Empirique de Dégradation Cyclique & Thermique d'une Batterie LFP (Arrhenius Aging)",
        titleEn: 'Semi-Empirical Capacity Fade & Cyclic Aging Model for LFP Cells (Arrhenius Kinetics)',
        descFr: "Prédiction de la perte de capacité irréversible (Capacity Fade) d'une cellule lithium-ion LiFePO4 en fonction de la température de fonctionnement de la cellule, du courant de cyclage (C-rate), de la profondeur de décharge (DoD) et du nombre de cycles cumulés.",
        descEn: 'Predicts irreversible capacity loss of a LiFePO4 lithium-ion cell as a function of operating temperature, charge/discharge C-rate, Depth of Discharge (DoD), and cumulative equivalent cycle count.',
        formula: 'Q_{\\text{perte}}\\% = A \\cdot \\exp\\left( -\\frac{E_a}{R \\cdot T_{\\text{cell}}} \\right) \\cdot (\\text{C-rate})^\\alpha \\cdot (\\text{DoD})^\\beta \\cdot N_{\\text{cycles}}^\\gamma',
        formulaDescFr: "Où Q_perte% est le pourcentage de perte de capacité par rapport à la valeur nominale, A un facteur pré-exponentiel d'ajustement, E_a l'énergie d'activation de la dégradation de l'interface SEI (environ 22 à 30 kJ/mol), R la constante universelle des gaz parfaits (8.314 J/(mol·K)), T_cell la température absolue de la cellule (K), et α, β, γ les exposants empiriques (avec γ ≈ 0.5 indiquant une croissance de la couche SEI proportionnelle à la racine du temps).",
        formulaDescEn: 'Where Q_perte% is percentage capacity fade from nominal, A is pre-exponential factor, E_a is activation energy of Solid Electrolyte Interphase (SEI) growth (~22 to 30 kJ/mol), R is ideal gas constant (8.314 J/(mol·K)), T_cell is absolute cell temperature (K), and α, β, γ are empirical exponents (with γ ≈ 0.5 reflecting parabolic diffusion-limited SEI thickening).',
        assumptionsFr: [
          'Doublement de la vitesse de dégradation calendaire pour chaque élévation de température de 10°C au-dessus de 25°C.',
          'Critère de fin de vie industrielle (End-of-Life) : atteinte de 80% de capacité résiduelle (Q_perte = 20%).',
          'Cellules LiFePO4 avec électrolyte stabilisé et additifs limitant la formation de dendrites de lithium.'
        ],
        assumptionsEn: [
          'Calendar aging rate doubles for every 10°C temperature elevation above 25°C baseline.',
          'Industrial End-of-Life (EOL) criterion: retention drops to 80% of rated capacity (20% capacity fade).',
          'LiFePO4 prismatic cells with advanced electrolytes suppressing lithium plating at 1C rates.'
        ],
        calcTab: 'bess-sizing'
      },
      {
        id: 'ev_hpc_charging_hub_power_budget',
        tabLabelFr: '6. Foisonnement Hub IRVE 350 kW',
        tabLabelEn: '6. EV HPC Hub Power Budget',
        titleFr: "Bilan de Puissance et Foisonnement d'un Hub de Recharge Rapide IRVE (NF C 15-100 / CEI 61851-23)",
        titleEn: 'Power Demand Sizing & Simultaneity Factor for Multi-Bay HPC EV Hub (IEC 61851-23)',
        descFr: "Dimensionnement du raccordement au réseau électrique moyenne tension d'une station de superchargeurs 350 kW pour véhicules électriques en appliquant les coefficients de foisonnement d'utilisation simultanée et l'effacement par batterie tampon BESS.",
        descEn: 'Sizes the medium-voltage grid connection capacity of a multi-bay 350 kW electric vehicle charging plaza, applying diversity factors and incorporating a dedicated BESS buffer to shave instantaneous peak demand.',
        formula: 'P_{\\text{réseau}} = \\left( \\sum_{k=1}^{N_{\\text{bornes}}} P_{\\text{nom\\_k}} \\right) \\cdot k_s \\cdot \\frac{1}{\\eta_{\\text{chargeur}}} - P_{\\text{BESS\\_tampon}}',
        formulaDescFr: "Où P_réseau est la puissance souscrite auprès du gestionnaire de réseau (kVA), N_bornes le nombre de points de charge haute puissance (ex. 8 bornes de 350 kW), P_nom_k la puissance nominale maximale de chaque borne, k_s le coefficient de foisonnement de simultanéité (typiquement 0.60 à 0.75 pour 8 bornes HPC), η_chargeur le rendement de conversion AC/DC des redresseurs (96%), et P_BESS_tampon la puissance d'écrêtement injectée par la batterie de stockage locale.",
        formulaDescEn: 'Where P_réseau is subscribed grid interconnection capacity (kVA), N_bornes is charging bay count (e.g. 8 dispensers at 350 kW), P_nom_k is dispenser peak rating, k_s is diversity/simultaneity factor (typically 0.60 to 0.75 for 8 HPC dispensers), η_chargeur is AC/DC converter efficiency (96%), and P_BESS_tampon is peak shaving power discharged by the local stationary BESS buffer.',
        assumptionsFr: [
          'Profil de charge typique d\'un véhicule moderne : puissance de crête 350 kW maintenue seulement de 10% à 50% de SOC.',
          'Facteur de foisonnement pour 8 points de charge HPC : k_s = 0.65 selon les retours d\'expérience autoroutiers.',
          'Batterie tampon BESS de 500 kWh réduisant la puissance de pointe appelée sur le réseau MT de plus de 40%.'
        ],
        assumptionsEn: [
          'Typical modern EV charging curve: 350 kW peak power accepted only from 10% to 50% SOC before tapering.',
          'Diversity factor across 8 HPC charging bays: k_s = 0.65 based on highway corridor operational data.',
          'Co-located 500 kWh stationary BESS buffer slashes required MV utility connection capacity by over 40%.'
        ],
        calcTab: 'power'
      }
    ],
    sectionF: [
      {
        code: 'CEI 62933-2-1 / CEI 62933-5-2',
        tag: 'STOCKAGE STATIONNAIRE BESS',
        titleFr: 'Systèmes de Stockage d\'Énergie Électrique — Paramètres Unitaires & Exigences de Sécurité',
        titleEn: 'Electrical Energy Storage (EES) Systems — Part 2-1 (Unit Parameters) & Part 5-2 (Safety of Grid-Integrated BESS)',
        descFr: 'Norme cadre internationale fixant les méthodes de mesure de la capacité, du rendement de cycle (RTE), du temps de réponse et les règles de confinement des emballements thermiques.',
        descEn: 'Comprehensive international standard defining capacity measurement, round-trip efficiency (RTE), response time metrics, and thermal runaway containment for grid-scale BESS.'
      },
      {
        code: 'IEEE Std 2800-2022 / IEEE 1547',
        tag: 'INTERCONNEXION & GRID-FORMING',
        titleFr: 'Norme pour l\'Interconnexion et l\'Interopérabilité des Ressources Énergétiques à Onduleurs au Réseau de Transport',
        titleEn: 'Standard for Interconnection and Interoperability of Inverter-Based Resources (IBRs) Interconnecting with Associated Transmission Systems',
        descFr: 'Impose les exigences de traversée de creux de tension (LVRT/HVRT), de réponse en fréquence rapide (FFR < 100 ms) et de contrôle formateur de réseau (Grid-Forming / VSM).',
        descEn: 'Mandates fault ride-through (LVRT/HVRT), fast frequency response (FFR < 100 ms), and grid-forming virtual synchronous machine control for inverter-based storage resources.'
      },
      {
        code: 'CEI 61851-1 / CEI 61851-23',
        tag: 'INFRASTRUCTURE RECHARGE IRVE',
        titleFr: 'Système de Charge Conductive pour Véhicules Électriques — Bornes de Recharge DC Haute Puissance',
        titleEn: 'Electric Vehicle Conductive Charging System — Part 23: DC Electric Vehicle Supply Equipment (HPC up to 1000 V)',
        descFr: 'Régit la sécurité électrique, l\'isolement galvanique, les connecteurs refroidis par liquide (CCS Combo 2) et le contrôle de terre des stations de recharge ultra-rapide jusqu\'à 500 A.',
        descEn: 'Specifies electrical safety, galvanic insulation, liquid-cooled dispensers (CCS Combo 2), and continuous protective earth monitoring for DC fast charging stations delivering up to 500 A.'
      },
      {
        code: 'NFPA 855 / UL 9540A',
        tag: 'SÉCURITÉ INCENDIE BESS',
        titleFr: 'Norme pour l\'Installation de Systèmes Stationnaires de Stockage d\'Énergie & Essais d\'Emballement Thermique',
        titleEn: 'Standard for the Installation of Stationary Energy Storage Systems & Test Method for Evaluating Thermal Runaway Fire Propagation',
        descFr: 'Exigences strictes de séparation physique entre conteneurs (3 mètres), de ventilation anti-déflagration d\'hydrocarbures gazeux et d\'extinction automatique par gaz propre Novec 1230.',
        descEn: 'Mandates strict physical separation distances (3 meters between enclosures), deflagration venting for off-gas buildup, and automated Novec 1230 total flooding suppression systems.'
      },
      {
        code: 'CEI 62898-1 / CEI 62898-2',
        tag: 'MICRO-RÉSEAUX HYBRIDES',
        titleFr: 'Micro-réseaux Électriques — Lignes Directrices pour la Planification, la Spécification et le Contrôle de Stabilité',
        titleEn: 'Microgrids — Part 1 (Guidelines for Planning and Specification) & Part 2 (Guidelines for Operation)',
        descFr: 'Définit les stratégies de contrôle de stabilité dynamique, le basculement sans coupure îloté/raccordé et la coordination énergétique solaire-batterie-diesel via EMS.',
        descEn: 'Defines dynamic stability control strategies, seamless islanded-to-grid transfers, and hierarchical solar-battery-diesel optimization via microgrid energy management systems.'
      },
      {
        code: 'NF C 15-100 Partie 7-722 / ISO 15118',
        tag: 'INSTALLATIONS IRVE & V2G',
        titleFr: 'Installations Électriques à Basse Tension — Alimentation des Véhicules Électriques & Communication V2G',
        titleEn: 'Low-Voltage Electrical Installations — Electric Vehicle Charging & ISO 15118 Vehicle-to-Grid (V2G) Interface',
        descFr: 'Prescriptions d\'installation en France et zone francophone : dispositifs différentiels dédiés type B / type F EV, protection contre les surtensions et communication bidirectionnelle V2G.',
        descEn: 'Mandates dedicated Type B / Type F EV residual current protection, surge arresters, and ISO 15118 bidirectional digital communications for smart charging and Vehicle-to-Grid (V2G).'
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
      roleFr: "Commande temps réel et supervision des procédés industriels continus et manufacturiers par Automates Programmables Industriels (API/PLC), Systèmes Numériques de Contrôle-Commande (DCS), Entraînements à Vitesse Variable (VFD) et Systèmes Instrumentés de Sécurité (SIS SIL2/SIL3).",
      roleEn: 'Real-time process control and plantwide SCADA supervision of continuous and manufacturing industries via Programmable Logic Controllers (PLC), Distributed Control Systems (DCS), Variable Frequency Drives (VFD), and Safety Instrumented Systems (SIS SIL2/SIL3).',
      inputsFr: {
        title: 'Capteurs de Terrain, Transmetteurs 4–20 mA & Alimentations Redondées',
        desc: 'Capteurs TOR 24 Vcc, transmetteurs analogiques 4–20 mA HART / NAMUR NE 43, sondes PT100/Thermocouples, et alimentations secourues 24 Vcc redondées avec diode de découplage.',
        voltage: '24 Vcc Instrumentation • 400 V / 690 V Triphasé Force'
      },
      inputsEn: {
        title: 'Field Sensors, 4–20 mA Transmitters & Redundant DC Supplies',
        desc: '24 Vdc discrete switches, 4–20 mA HART / NAMUR NE 43 transmitters, RTD PT100 temperature sensors, and redundant 24 Vdc diode-isolated power supplies.',
        voltage: '24 Vdc Instrumentation • 400 V / 690 V 3-Phase Power'
      },
      processFr: {
        title: 'Scrutation Déterministe IEC 61131-3, Contrôle Vectoriel FOC & Sécurité SIL',
        desc: 'Cycles de scrutation déterministes (< 5 ms), exécution multitâche en Grafcet/SFC et Texte Structuré (ST), algorithmes PID avec anti-windup, contrôle vectoriel de flux direct/quadrature (d-q), et vote majoritaire 2oo3.',
        note: 'Lois d\'affinité centrifuge : P varie avec le cube de la vitesse (N³); économie d\'énergie jusqu\'à 50%'
      },
      processEn: {
        title: 'Deterministic IEC 61131-3 Scan, FOC Vector Control & SIL Voting',
        desc: 'Deterministic scan cycles (< 5 ms), multitasking execution via SFC and Structured Text (ST), anti-windup PID loops, d-q Field-Oriented Control, and 2oo3 safety voting logic.',
        note: 'Centrifugal affinity laws: Power scales with the cube of speed (N³); up to 50% energy savings'
      },
      outputsFr: {
        title: 'Actionneurs Numériques, Vannes de Régulation & Moteurs Industriels',
        desc: 'Sorties TOR statiques, positionneurs électropneumatiques 4–20 mA, signaux PWM vers ponts onduleurs IGBT, liaisons réseaux industriels Profinet IRT / EtherNet/IP et télémesure SCADA.',
        earthing: 'Mise à la terre CEM équipotentielle 360° des tresses de blindage des câbles moteurs et régulation des boucles de masse'
      },
      outputsEn: {
        title: 'Solid-State Outputs, Control Valves & Industrial Drives',
        desc: 'Solid-state digital outputs, 4–20 mA electro-pneumatic positioners, PWM IGBT inverter firing pulses, Profinet IRT / EtherNet/IP links, and SCADA telemetry.',
        earthing: '360° EMC peripheral shield grounding on motor cables and equipotential instrument signal reference grounding'
      }
    },
    sectionB: {
      summaryFr: 'Architectures d\'automatisme industriel : DCS redondé d\'infrastructure, commande fort couple AFE réversible, SIS TMR 2oo3, et réseaux déterministes temps réel.',
      summaryEn: 'Industrial automation topologies: plantwide redundant DCS, 4-quadrant AFE heavy drives, TMR 2oo3 safety systems, and deterministic real-time networks.',
      architectures: [
        {
          nameFr: 'Architecture DCS Redondée Multi-Serveurs & Anneau Optique PRP/HSR (Centrale Nachtigal 420 MW)',
          nameEn: 'Plantwide Redundant DCS with Dual Optical PRP/HSR Ring (Nachtigal 420 MW Hydro Station)',
          techFr: 'Double unité centrale en basculement chaud automatique (Hot-Standby), réseau temps réel double anneau fibre optique PRP/HSR (CEI 62439-3) à zéro perte de trame',
          techEn: 'Dual redundant Hot-Standby controllers, dual optical fiber PRP/HSR real-time ring (IEC 62439-3) with zero packet loss switchover',
          descFr: 'Architecture maîtresse de la plus grande centrale hydroélectrique du Cameroun (Nachtigal 7 × 60 MW). Contrôle synchronisé des groupes turbo-alternateurs, régulation de vitesse tachymétrique et téléconduite vers le Dispatching National SONATREL de Mangombé.',
          descEn: 'Flagship control architecture of Cameroon\'s largest hydropower complex (Nachtigal 7 × 60 MW). Synchronized governor control, turbine wicket gate positioning, and real-time dispatch to the National Grid Control Center.',
          standard: 'CEI 61511 / CEI 62439-3 / CEI 61850',
          metricFr: 'Disponibilité : 99.999%; temps de basculement processeur = 0 ms',
          metricEn: 'Availability: 99.999%; CPU bump-less switchover = 0 ms'
        },
        {
          nameFr: 'Entraînement Réversible AFE 4 Quadrants & Broyeurs de Ciment (CIMENCAM Figuil / Nomayos)',
          nameEn: 'Four-Quadrant Active Front End (AFE) Heavy Drive (CIMENCAM Cement Mill)',
          techFr: 'Variateur moyenne tension 690 V / 3.8 MW à pont redresseur actif (AFE) à IGBT et filtre LCL, permettant la réinjection d\'énergie sur le réseau et un THDi < 4%',
          techEn: 'Medium-voltage 690 V / 3.8 MW drive with IGBT Active Front End (AFE) and LCL filter, enabling four-quadrant regeneration and THDi < 4%',
          descFr: 'Pilotage des broyeurs à boulets et fours rotatifs de clinker à forte inertie et couple de démarrage sévère (160% Tn). Élimine les harmoniques de rang 5 et 7 et supprime l\'échauffement sur le transformateur de distribution du site.',
          descEn: 'Drives high-inertia ball mills and rotary kilns with severe breakaway torque (160% Tn). Neutralizes 5th and 7th harmonic pollution, maintaining unit power factor.',
          standard: 'CEI 61800-3 / CEI 61000-3-12',
          metricFr: 'Facteur de puissance cos φ ≈ 1.00; THDi < 4.0% à pleine charge',
          metricEn: 'Displacement power factor cos φ ≈ 1.00; THDi < 4.0% at full load'
        },
        {
          nameFr: 'Système Instrumenté de Sécurité (SIS) TMR 2oo3 & Barrières Ex-i (Dépôt Pétrolier SCDP Bessengue)',
          nameEn: 'Triple Modular Redundant (TMR 2oo3) Safety Instrumented System (SCDP Hydrocarbon Terminal)',
          techFr: 'Architecture à triple redondance modulaire (TMR 2oo3) avec voteur matériel certifié SIL 3 selon CEI 61508 / CEI 61511, couplé à des barrières de sécurité intrinsèque Ex-ia',
          techEn: 'Triple Modular Redundancy (TMR 2oo3) hardware-voted architecture certified to IEC 61508 / IEC 61511 SIL 3, interfaced via Ex-ia intrinsically safe galvanic isolators',
          descFr: 'Assure l\'arrêt d\'urgence instantané (ESD), la détection gaz/feu et la protection anti-débordement des bacs de stockage d\'hydrocarbures en zone ATEX. Tolérance totale aux pannes matérielles simples sans déclenchement intempestif.',
          descEn: 'Guarantees Emergency Shutdown (ESD), combustible gas/fire detection, and overfill prevention in hazardous ATEX fuel storage zones. Immune to single component faults without false trip.',
          standard: 'CEI 61508 / CEI 61511 / NF EN 60079-11',
          metricFr: 'Intégrité de sécurité : SIL 3 (PFDavg < 10⁻³); voteur 2oo3 anti-défaillance commune',
          metricEn: 'Safety integrity: SIL 3 (PFDavg < 10⁻³); 2oo3 voting prevents spurious trips'
        },
        {
          nameFr: 'Îlots d\'Automates Haute Cadence & Synchronisation Motion (Lignes d\'Embouteillage SABC Douala)',
          nameEn: 'High-Speed Deterministic PLC Islands & Motion Synchronization (SABC Packaging Line)',
          techFr: 'Automates modulaires haute performance interconnectés sur bus de terrain déterministe Profinet IRT / CIP Sync avec synchronisation d\'axes camés électroniques',
          techEn: 'High-speed modular PLCs networked over deterministic Profinet IRT / CIP Sync bus with electronic camming motion synchronization',
          descFr: 'Lignes d\'embouteillage haute cadence (jusqu\'à 60 000 bouteilles/heure) de la SABC. Synchronisation sub-milliseconde entre remplisseuses, boucheuses, étiqueteuses et fardeleuses avec régulation de tension de bande.',
          descEn: 'High-throughput packaging lines (up to 60,000 bottles/hour) at SABC. Sub-millisecond axis synchronization across rinsers, fillers, labelers, and robotic palletizers.',
          standard: 'CEI 61131-3 / CEI 61784 / ISO 13849-1',
          metricFr: 'Cadence : 60 000 cols/h; gigue temporelle du bus < 1 µs',
          metricEn: 'Throughput: 60,000 bph; bus transmission jitter < 1 µs'
        },
        {
          nameFr: 'Architecture Hiérarchisée Modèle Purdue & Cybersécurité OT (CEI 62443)',
          nameEn: 'Purdue Model Layered Automation & OT Cybersecurity Architecture (IEC 62443)',
          techFr: 'Ségrégation stricte en 5 niveaux (Niveau 0 Instrumentation à Niveau 4 ERP) avec Zone Démilitarisée (DMZ OT/IT), pare-feu industriels à inspection d\'état et passerelles OPC UA sécurisées',
          techEn: 'Strict 5-tier segregation (Level 0 Field to Level 4 Enterprise ERP) with industrial DMZ, deep-packet stateful firewalls, and encrypted OPC UA channels',
          descFr: 'Protection des réseaux opérationnels (OT) contre les cyberattaques, les rançongiciels et les intrusions malveillantes. Conforme au cadre réglementaire CEI 62443 pour les infrastructures énergétiques critiques.',
          descEn: 'Safeguards operational technology (OT) assets against cyberattacks, ransomware, and unauthorized intrusions. Enforces IEC 62443 compliance across national critical energy infrastructure.',
          standard: 'CEI 62443-3-3 / ISA-95 / NIST SP 800-82',
          metricFr: 'Niveau de sécurité : SL 3; chiffrement TLS 1.3 / certificats X.509',
          metricEn: 'Security level: SL 3; TLS 1.3 encryption and X.509 certificate authentication'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-plc-dcs-controller',
        nameFr: 'Automate Programmable Industriel Sécuritaire (API/PLC SIL3) & DCS de Procédé',
        nameEn: 'Safety Industrial PLC (SIL3 / Cat. 4) & Process DCS Controller',
        voltage: '24 Vcc • Cycle < 5 ms • SIL3 / Cat. 4',
        roleFr: 'Contrôleur logique programmable industriel modulaire durci, intégrant une architecture à microprocesseurs redondants (1oo2D ou 2oo3), certifié CEI 61508 SIL 3 pour l\'automatisation de procédés critiques et l\'arrêt d\'urgence.',
        roleEn: 'Ruggedized modular programmable automation controller featuring redundant CPUs (1oo2D or 2oo3), certified to IEC 61508 SIL 3 for mission-critical industrial process control and emergency shutdown.',
        symbol: 'PLC-SIL3',
        standard: 'CEI 61131-3 / CEI 61508',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        calcTab: 'sil'
      },
      {
        id: 'eq-vfd-inverter-drive',
        nameFr: 'Variateur de Vitesse Électronique Basse / Moyenne Tension (VFD 690 V / 400 kW)',
        nameEn: 'Variable Frequency Drive (VFD / Inverter Drive 690 V / 400 kW)',
        voltage: '690 V AC • 400 kW • Courant 430 A',
        roleFr: 'Convertisseur statique de fréquence à pont redresseur, bus continu filtré et onduleur MLI (PWM) à transistors IGBT, assurant la régulation vectorielle de flux sans capteur (FOC) et la limitation du courant d\'appel.',
        roleEn: 'Static power electronic frequency converter with IGBT PWM inverter executing sensorless flux vector motor speed control (FOC) and starting current limiting.',
        symbol: 'VFD-400kW',
        standard: 'CEI 61800-3 / CEI 61800-5-1',
        imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        calcTab: 'motor'
      },
      {
        id: 'eq-exp-hmi-scada',
        nameFr: 'Pupitre IHM Industriel & Serveur SCADA Tactile Multitouch (15.6" IP65, OPC UA)',
        nameEn: 'Industrial HMI Touchscreen & Multitouch SCADA Server (15.6" IP65, OPC UA)',
        voltage: '24 Vcc • Écran 15.6\'\' Full HD • IP65 Façade',
        roleFr: 'Interface Homme-Machine tactile industrielle pour la conduite d\'atelier, l\'affichage des synoptiques dynamiques, l\'archivage des alarmes horodatées à la milliseconde et l\'enregistrement des tendances.',
        roleEn: 'Industrial touchscreen Human-Machine Interface (HMI) for workshop supervision, dynamic graphical synoptics, 1 ms timestamped alarm logging, and historical trend logging.',
        symbol: 'HMI-15',
        standard: 'CEI 60068 / CEI 62443',
        imgUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        calcTab: 'load-schedule'
      },
      {
        id: 'eq-exp-safety-relay',
        nameFr: 'Système Instrumenté de Sécurité SIS Triplement Redondant (TMR 2oo3 SIL3)',
        nameEn: 'Triple Modular Redundant Safety System (SIS TMR 2oo3 SIL3)',
        voltage: '24 Vcc redondé • Vote 2oo3 matériel • Temps réponse < 20 ms',
        roleFr: 'Système de sécurité certifié SIL 3 pour l\'arrêt d\'urgence instantané (ESD), la surveillance des brûleurs (BMS) et la détection d\'ambiance explosive en milieu ATEX.',
        roleEn: 'Certified SIL 3 safety instrumented system executing emergency plant shutdown (ESD), burner management, and combustible gas monitoring in ATEX zones.',
        symbol: 'SIS-TMR',
        standard: 'CEI 61508 / CEI 61511',
        imgUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
        calcTab: 'sil'
      },
      {
        id: 'eq-exp-fieldbus-io',
        nameFr: 'Îlot d\'Entrées/Sorties Déportées IP67 sur Anneau Profinet IRT / EtherNet/IP',
        nameEn: 'Machine-Mount IP67 Distributed I/O Island (Profinet IRT / EtherNet/IP)',
        voltage: '24 Vcc • 16 E/S configurables • Connecteurs M12 IP67',
        roleFr: 'Module d\'acquisition de données terrain montable directement sur machine sans armoire électrique, raccordé sur bus Ethernet temps réel avec synchronisation d\'horloge IEEE 1588.',
        roleEn: 'Machine-mountable IP67 distributed field I/O block communicating over real-time Ethernet with IEEE 1588 clock synchronization, eliminating local junction boxes.',
        symbol: 'RIO-IP67',
        standard: 'CEI 61158 / CEI 61784',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        calcTab: 'load-schedule'
      },
      {
        id: 'eq-exp-dvdt-sine-filter',
        nameFr: 'Filtre Sinus & dV/dt de Sortie Variateur pour Protection Moteur',
        nameEn: 'Inverter Output Sine-Wave & dV/dt Filter for Motor Insulation',
        voltage: '690 V AC • In = 400 A • dV/dt < 500 V/µs',
        roleFr: 'Filtre LC passe-bas installé entre le variateur et le moteur pour lisser la tension PWM, éliminer les surtensions d\'ondes réfléchies en bout de câble et préserver l\'isolement des bobinages.',
        roleEn: 'Low-pass LC sine-wave filter installed on drive output to smooth PWM pulses, eliminate reflected wave peak voltages, and safeguard motor stator winding insulation.',
        symbol: 'FLT-SINE',
        standard: 'CEI 60034-25 / CEI 61800-5-1',
        imgUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        calcTab: 'motor'
      }
    ],
    sectionD: [
      {
        phase: '01',
        titleFr: 'Analyse Fonctionnelle, Matrice Cause à Effet & Spécification URS/FDS',
        titleEn: 'Functional Design Specification (FDS) & Cause-and-Effect Matrix',
        descFr: 'Recensement exhaustif des capteurs et actionneurs, élaboration des organigrammes Grafcet de conduite normale/dégradée et matrice cause-effet de sécurité.',
        descEn: 'Comprehensive sensor/actuator cataloging, authoring normal/degraded mode Sequential Function Charts (SFC), and safety cause-and-effect matrix.'
      },
      {
        phase: '02',
        titleFr: 'Analyse des Risques et Attribution des Niveaux d\'Intégrité SIL (CEI 61508)',
        titleEn: 'Process Hazard Analysis & Safety Integrity Level Allocation (HAZOP / SIL)',
        descFr: 'Études HAZOP et LOPA identifiant les boucles de sécurité instrumentées (SIF), calcul des taux de défaillance λDU et assignation des cibles SIL 1 à SIL 3.',
        descEn: 'HAZOP and LOPA hazard reviews defining Safety Instrumented Functions (SIF), failure rate calculations (λDU), and SIL 1 to SIL 3 allocation.'
      },
      {
        phase: '03',
        titleFr: 'Architecture Matérielle, Dimensionnement Électrique & Cartographie E/S',
        titleEn: 'Hardware Architecture, Electrical Sizing & I/O Channel Mapping',
        descFr: 'Dimensionnement des alimentations 24 Vcc secourues, choix des processeurs, calcul du bilan thermique de l\'armoire et affectation des modules d\'entrées/sorties.',
        descEn: 'Sizing redundant 24 Vdc power supplies, CPU selection, panel thermal dissipation heat calculation, and field I/O channel address assignment.'
      },
      {
        phase: '04',
        titleFr: 'Programmation des Automates selon CEI 61131-3 & Conception Graphique IHM',
        titleEn: 'PLC Programming per IEC 61131-3 & High-Performance HMI/SCADA Design',
        descFr: 'Développement modulaire en Ladder (LD), Blocs Fonctionnels (FBD) et Texte Structuré (ST) avec blocs normalisés, et conception des vues IHM conformes ISA-101.',
        descEn: 'Modular programming in Ladder (LD), Function Blocks (FBD), and Structured Text (ST), paired with high-performance ISA-101 situational awareness HMI graphics.'
      },
      {
        phase: '05',
        titleFr: 'Essais d\'Acceptation en Plateforme Usine (FAT) avec Émulation HIL',
        titleEn: 'Factory Acceptance Testing (FAT) with Hardware-in-the-Loop Simulation',
        descFr: 'Contrôle point-à-point à 100% sur simulateur virtuel, validation des sécurités d\'arrêt d\'urgence (STO) et tests d\'injection de pannes processeur et réseau.',
        descEn: '100% point-to-point I/O simulation using HIL process models, verification of Safe Torque Off (STO) trips, and CPU/network fault injection testing.'
      },
      {
        phase: '06',
        titleFr: 'Câblage sur Site, Vérification des Boucles 4-20 mA & Raccordement CEM 360°',
        titleEn: 'Site Wiring, 4–20 mA Loop Calibration & 360° Peripheral EMC Bonding',
        descFr: 'Reprise des blindages de câbles moteurs par presse-étoupe CEM à 360°, étalonnage des boucles 4–20 mA avec calibrateur de process et contrôle d\'isolement.',
        descEn: '360° peripheral EMC cable gland shield termination, 4–20 mA loop calibration using handheld calibrators, and field wiring insulation verification.'
      },
      {
        phase: '07',
        titleFr: 'Essais d\'Acceptation sur Site (SAT), Auto-réglage PID & Validation SIS',
        titleEn: 'Site Acceptance Testing (SAT), Closed-Loop PID Tuning & SIS Sign-off',
        descFr: 'Identification automatique des paramètres moteurs à l\'arrêt par le variateur, réglage des gains PID (Ziegler-Nichols / Cohen-Coon) et validation de conformité CEI 61511.',
        descEn: 'Drive standstill motor auto-tuning, closed-loop PID parameter optimization (Ziegler-Nichols / Cohen-Coon), and official IEC 61511 safety sign-off.'
      }
    ],
    sectionE: [
      {
        id: 'euler_ode_pid',
        tabLabelFr: 'Régulation PID Discret (Euler)',
        tabLabelEn: 'Discrete Euler PID Controller',
        titleFr: 'Algorithme Numérique de Régulation PID Discret avec Anti-Windup',
        titleEn: 'Discrete Numerical PID Algorithm with Integral Anti-Windup Clamping',
        descFr: 'Équation aux différences de l\'algorithme PID implémenté dans les automates programmables industriels (CEI 61131-3), garantissant une régulation déterministe avec blocage anti-saturation.',
        descEn: 'Discrete difference equation for the digital PID controller implemented in industrial PLCs (IEC 61131-3), ensuring deterministic closed-loop tracking with anti-windup clamping.',
        formula: 'u(k) = K_p \\cdot e(k) + \\frac{K_p \\cdot T_s}{T_i} \\sum_{j=0}^{k} e(j) + K_p \\cdot T_d \\cdot \\frac{e(k) - e(k-1)}{T_s}',
        formulaDescFr: 'Avec e(k) = Consigne - Mesure à l\'instant k, Ts période d\'échantillonnage (s), Kp gain proportionnel, Ti constante d\'intégration (s), et Td constante de dérivation (s).',
        formulaDescEn: 'Where e(k) = Setpoint - Process Variable at sample k, Ts is loop sampling period (s), Kp proportional gain, Ti integral time constant (s), and Td derivative time constant (s).',
        assumptionsFr: [
          'Période d\'échantillonnage Ts constante et rigoureusement cadencée par interruption cyclique (ex: Ts = 50 ms).',
          'Clamping anti-windup de l\'intégrateur borné entre 0% et 100% de la course de l\'actionneur.',
          'Filtrage passe-bas du terme dérivé pour éliminer le bruit de mesure sur les capteurs 4-20 mA.'
        ],
        assumptionsEn: [
          'Sampling period Ts rigidly scheduled via deterministic timer interrupt (e.g., Ts = 50 ms).',
          'Anti-windup integral clamp bound to 0-100% actuator travel limits.',
          'First-order low-pass filter on derivative term to suppress analog measurement noise.'
        ],
        calcTab: 'motor'
      },
      {
        id: 'foc_vector_control',
        tabLabelFr: 'Contrôle Vectoriel de Flux (FOC)',
        tabLabelEn: 'Field-Oriented Control (FOC)',
        titleFr: 'Découplage de Couple et de Flux par Transformation de Park (d-q)',
        titleEn: 'Decoupled Flux and Torque Regulation via Park Transformation (d-q)',
        descFr: 'Algorithme de pilotage haute performance des variateurs de fréquence permettant de contrôler indépendamment le flux magnétique rotorique (axe d) et le couple mécanique dynamique (axe q).',
        descEn: 'High-performance AC drive algorithm decoupling rotor magnetic flux control (direct d-axis) from dynamic electromagnetic torque regulation (quadrature q-axis).',
        formula: 'T_e = \\frac{3}{2} p \\frac{L_m^2}{L_r} i_{sd} \\cdot i_{sq} \\quad \\text{avec} \\quad i_{sd} = \\text{Cte} \\quad (\\omega \\le \\omega_n), \\quad i_{sd} \\propto \\frac{1}{\\omega} \\quad (\\omega > \\omega_n)',
        formulaDescFr: 'Où p est le nombre de paires de pôles, Lm l\'inductance mutuelle, Lr l\'inductance rotorique, isd le courant magnétisant d\'axe direct, et isq le courant de couple en quadrature.',
        formulaDescEn: 'Where p is pole pairs, Lm mutual inductance, Lr rotor inductance, isd magnetizing direct-axis current, and isq quadrature torque-producing current.',
        assumptionsFr: [
          'Orientation parfaite sur le vecteur de flux rotorique via observateur d\'état ou capteur résolveur/encodeur.',
          'Région de flux constant maintenue jusqu\'à la vitesse nominale ωn (couple maximal disponible).',
          'Région de défluxage (affaiblissement de flux) au-delà de ωn pour fonctionner à puissance constante.'
        ],
        assumptionsEn: [
          'Accurate rotor flux vector orientation via sliding-mode observer or optical encoder.',
          'Constant flux maintained up to base speed ωn (maximum available torque envelope).',
          'Field weakening region deployed above base speed ωn for constant-power operation.'
        ],
        calcTab: 'motor'
      },
      {
        id: 'sil_tmr_pfd_avg',
        tabLabelFr: 'Sécurité Fonctionnelle (PFDavg)',
        tabLabelEn: 'Safety Integrity PFDavg (SIL)',
        titleFr: 'Probabilité Moyenne de Défaillance sur Sollicitation en Vote 2oo3 (CEI 61508)',
        titleEn: 'Average Probability of Failure on Demand for 2-out-of-3 Architecture',
        descFr: 'Calcul de la fiabilité prévisionnelle d\'un Système Instrumenté de Sécurité (SIS) triplement redondant (TMR 2oo3) pour la certification SIL 3 des installations industrielles à risque.',
        descEn: 'Predictive reliability modeling of a Triple Modular Redundant (TMR 2oo3) Safety Instrumented System for SIL 3 certification in hazardous industrial plants.',
        formula: '\\text{PFD}_{\\text{avg, 2oo3}} = (1 - \\beta)^2 \\cdot (\\lambda_{\\text{DU}} \\cdot T_I)^2 + \\beta \\cdot \\lambda_{\\text{DU}} \\cdot \\frac{T_I}{2}',
        formulaDescFr: 'Où λDU est le taux de défaillance dangereuse non détectée (h⁻¹), TI l\'intervalle de test périodique complet (h), et β le facteur de défaillance de cause commune entre canaux redondants.',
        formulaDescEn: 'Where λDU is dangerous undetected failure rate (h⁻¹), TI proof test interval (h), and β common-cause failure fraction between redundant channels.',
        assumptionsFr: [
          'Taux de défaillance dangereuse non détectée λDU = 10⁻⁶ h⁻¹ (1 000 FIT).',
          'Intervalle de test périodique complet (Proof Test) TI = 8 760 heures (1 an).',
          'Facteur de défaillance de cause commune β = 0.05 (5%), prépondérant dans le terme global de PFD.'
        ],
        assumptionsEn: [
          'Dangerous undetected failure rate λDU = 10⁻⁶ h⁻¹ (1,000 FIT).',
          'Proof test interval TI = 8,760 hours (annual proof test cycle).',
          'Common-cause failure fraction β = 0.05 (5%), dominating the overall PFD target.'
        ],
        calcTab: 'sil'
      },
      {
        id: 'vfd_affinity_energy',
        tabLabelFr: 'Lois d\'Affinité Centrifuge',
        tabLabelEn: 'Affinity Laws Energy Savings',
        titleFr: 'Économie d\'Énergie Cubique sur Pompes et Ventilateurs (Lois d\'Affinité)',
        titleEn: 'Cubic Affinity Laws & VFD Energy Conservation on Centrifugal Loads',
        descFr: 'Démontre le gain énergétique colossal apporté par la régulation de vitesse par variateur : réduire la vitesse de 20% divise la consommation électrique par deux par rapport à une vanne de réglage.',
        descEn: 'Demonstrates substantial energy conservation through speed modulation: reducing speed by 20% cuts electrical consumption by half compared to mechanical throttling.',
        formula: '\\frac{Q_2}{Q_1} = \\frac{N_2}{N_1}, \\quad \\frac{H_2}{H_1} = \\left(\\frac{N_2}{N_1}\\right)^2, \\quad \\frac{P_2}{P_1} = \\left(\\frac{N_2}{N_1}\\right)^3',
        formulaDescFr: 'Avec Q le débit volumique (m³/h), H la hauteur manométrique (mCE ou bar), P la puissance mécanique appelée (kW), et N la vitesse de rotation (tr/min).',
        formulaDescEn: 'With Q volumetric flow rate (m³/h), H head pressure (m or bar), P mechanical power demand (kW), and N shaft rotational speed (rpm).',
        assumptionsFr: [
          'Circuit aéraulique ou hydraulique sans contre-pression statique dominante (pertes de charge de frottement pures).',
          'Rendement de la machine tournante maintenu élevé dans la plage de régulation 60% à 100% de la vitesse nominale.',
          'Remplacement avantageux des vannes de laminage mécanique énergivores par régulation de vitesse.'
        ],
        assumptionsEn: [
          'Frictional flow system without significant static head pressure.',
          'Impeller efficiency maintained high across 60% to 100% speed control range.',
          'Replaces inefficient mechanical control valves and damper vanes.'
        ],
        calcTab: 'motor'
      },
      {
        id: 'motor_thermal_i2t',
        tabLabelFr: 'Modèle Thermique Moteur (I²t)',
        tabLabelEn: 'Motor I²t Thermal Model',
        titleFr: 'Modèle Thermique Numérique d\'Échauffement Statorique du Moteur I²t',
        titleEn: 'Digital Stator Thermal Rise ODE Model with Non-Volatile Memory',
        descFr: 'Algorithme prédictif de suivi de l\'état thermique des enroulements moteurs, simulant l\'accumulation de chaleur et ordonnant le déclenchement avant dégradation de la classe d\'isolation.',
        descEn: 'Predictive thermal rise algorithm simulating heat accumulation in motor stator windings, triggering trip before insulation class breakdown occurs.',
        formula: '\\theta(t) = \\theta_0 + (\\theta_{\\infty} - \\theta_0) \\cdot \\left(1 - e^{-t / \\tau_{\\text{th}}}\\right) \\quad \\text{avec} \\quad \\theta_{\\infty} \\propto \\left(\\frac{I}{I_n}\\right)^2',
        formulaDescFr: 'Où θ0 est la température initiale (°C), θ∞ la température d\'équilibre asymptotique proportionnelle au carré du courant, et τth la constante de temps thermique du moteur.',
        formulaDescEn: 'Where θ0 is initial temperature (°C), θ∞ is asymptotic equilibrium temperature proportional to squared current, and τth is motor thermal time constant.',
        assumptionsFr: [
          'Constante de temps d\'échauffement thermique τth ≈ 15 à 45 minutes pour moteurs industriels fermés TEFC.',
          'Image thermique conservée en mémoire non volatile en cas de coupure de l\'alimentation électrique de l\'automate.',
          'Prise en compte de la réduction du refroidissement à basse vitesse pour les moteurs autoventilés.'
        ],
        assumptionsEn: [
          'Thermal heating time constant τth ≈ 15 to 45 minutes for totally enclosed fan-cooled (TEFC) motors.',
          'Thermal memory retained across control power outages in non-volatile flash memory.',
          'Accounts for reduced cooling airflow when motor operates at lower speeds.'
        ],
        calcTab: 'motor'
      },
      {
        id: 'iec61850_sampled_values',
        tabLabelFr: 'Bus de Procédé (Sampled Values)',
        tabLabelEn: 'Process Bus Sampled Values',
        titleFr: 'Fréquence d\'Échantillonnage et Débit du Bus de Procédé Optique (CEI 61850-9-2LE)',
        titleEn: 'Digital Sampling Rate & Bandwidth on Fiber Optic Process Bus',
        descFr: 'Régit la numérisation des signaux de courant et de tension par les Merging Units (MU) au plus près des réducteurs de mesure et leur diffusion multicast sur fibre optique.',
        descEn: 'Governs analog current and voltage digitization by field Merging Units (MU) and their deterministic multicast broadcast across the station optical bus.',
        formula: 'f_s = 80 \\times f_0 \\implies f_s = 4\\,000\\,\\text{éch/s} \\quad (T_s = 250\\,\\mu\\text{s à } 50\\,\\text{Hz}) \\quad \\text{Bande passante} \\approx 4.5\\,\\text{Mbit/s par flux}',
        formulaDescFr: 'À 50 Hz, 80 échantillons par période réseau correspondent à une trame Ethernet SV transmise toutes les 250 microsecondes avec synchronisation d\'horloge absolue PTP IEEE 1588.',
        formulaDescEn: 'At 50 Hz, 80 samples per fundamental period equate to one SV Ethernet frame every 250 microseconds synchronized via IEEE 1588 PTP precision time protocol.',
        assumptionsFr: [
          '80 échantillons par période réseau (4 000 éch/s à 50 Hz, 4 800 éch/s à 60 Hz).',
          'Synchronisation temporelle absolue par protocole PTP IEEE 1588v2 avec précision < 1 µs.',
          'Priorisation stricte des trames multicast Ethernet avec balise VLAN 802.1Q (priorité 4 pour SV, priorité 7 pour GOOSE).'
        ],
        assumptionsEn: [
          '80 samples per fundamental electrical period (4,000 samples/s at 50 Hz, 4,800 samples/s at 60 Hz).',
          'Absolute time synchronization via IEEE 1588v2 PTP precision time protocol (< 1 µs accuracy).',
          'Ethernet multicast prioritization using 802.1Q VLAN tagging (Priority 4 for SV, Priority 7 for GOOSE).'
        ],
        calcTab: 'load-schedule'
      }
    ],
    sectionF: [
      {
        code: 'CEI 61131-3',
        tag: 'LANGAGES AUTOMATE',
        titleFr: 'Automates Programmables — Langages de Programmation Normalisés',
        titleEn: 'Programmable Controllers — Standardized Programming Languages',
        descFr: 'Standardise les 5 langages d\'automatisme : Schéma à Relais (Ladder LD), Diagramme Fonctionnel en Blocs (FBD), Grafcet (SFC), Texte Structuré (ST) et Liste d\'Instructions (IL).',
        descEn: 'Standardizes the 5 canonical PLC languages: Ladder Diagram (LD), Function Block Diagram (FBD), Sequential Function Chart (SFC), Structured Text (ST), and Instruction List (IL).'
      },
      {
        code: 'CEI 61508 / CEI 61511',
        tag: 'SÉCURITÉ FONCTIONNELLE',
        titleFr: 'Sécurité Fonctionnelle des Systèmes Électriques/Électroniques & Systèmes Instrumentés SIS',
        titleEn: 'Functional Safety of Electrical/Electronic/Programmable Safety-Related Systems & SIS',
        descFr: 'Norme mère régissant les systèmes d\'arrêt d\'urgence et de protection des procédés : cycle de vie de sécurité, niveaux d\'intégrité SIL 1 à SIL 4, taux PFDavg et tolérance matérielle aux pannes.',
        descEn: 'Foundational standard for safety-critical control and emergency shutdown: safety lifecycle, SIL 1 to SIL 4 integrity metrics, PFDavg calculations, and hardware fault tolerance.'
      },
      {
        code: 'CEI 61800-3 / CEI 61800-5-1',
        tag: 'VARIATEURS DE VITESSE',
        titleFr: 'Entraînements Électriques de Puissance à Vitesse Variable — Exigences CEM & Sécurité',
        titleEn: 'Adjustable Speed Electrical Power Drive Systems — EMC & Safety Requirements',
        descFr: 'Prescriptions relatives aux émissions et à l\'immunité électromagnétique (catégories C1 à C4), aux filtres dV/dt et à la sécurité fonctionnelle intégrée (STO, SS1, SLS).',
        descEn: 'Mandates electromagnetic compatibility emission and immunity limits (Categories C1 to C4), dV/dt motor filters, and integrated functional safety functions (STO, SS1, SLS).'
      },
      {
        code: 'CEI 62443',
        tag: 'CYBERSÉCURITÉ OT',
        titleFr: 'Sécurité des Réseaux et des Systèmes Industriels d\'Automatisation et de Téléconduite',
        titleEn: 'Security for Industrial Automation and Control Systems (OT Cybersecurity)',
        descFr: 'Cadre international de cybersécurité pour les systèmes industriels : segmentation en zones et conduits (modèle Purdue), niveaux de sécurité SL 1 à SL 4 et authentification robuste.',
        descEn: 'International standard for industrial cybersecurity: Purdue model zone and conduit partitioning, Security Levels SL 1 to SL 4, deep packet inspection, and encrypted OT channels.'
      },
      {
        code: 'CEI 61850-9-2LE / CEI 61869-9',
        tag: 'BUS DE PROCÉDÉ NUMÉRIQUE',
        titleFr: 'Réseaux de Communication pour Postes Électriques — Bus de Procédé & Valeurs Échantillonnées',
        titleEn: 'Communication Networks for Power Substations — Optical Process Bus & Sampled Values',
        descFr: 'Règles de diffusion des valeurs instantanées numérisées par les Merging Units (4 000 éch/s à 50 Hz) sur anneaux fibre optique redondés PRP/HSR sans latence ni perte.',
        descEn: 'Defines optical broadcasting of digital sampled values from Merging Units (4,000 samples/s at 50 Hz) across zero-loss PRP/HSR redundant Ethernet networks.'
      },
      {
        code: 'NAMUR NE 43',
        tag: 'SIGNALISATION ANALOGIQUE',
        titleFr: 'Normalisation des Niveaux de Signal des Transmetteurs de Procédé 4–20 mA',
        titleEn: 'Standardization of the Signal Level for the Failure Information of Digital Transmitters',
        descFr: 'Standard international de surveillance des boucles analogiques : signal utile 3.8 à 20.5 mA, diagnostic de défaut bas (< 3.6 mA) et défaut haut (> 21.0 mA) pour détecter coupure ou court-circuit.',
        descEn: 'International benchmark for analog 4–20 mA loop health monitoring: nominal range 3.8 to 20.5 mA, low failure flag (< 3.6 mA), and high failure flag (> 21.0 mA) detecting broken wire or short.'
      }
    ]
  },

  // D08: Courants Faibles (CFA) & Systèmes Spéciaux (ELV)
  D08: {
    domainCode: 'D08',
    sectionA: {
      roleFr: "Conception, intégration et exploitation des infrastructures à très basse tension (TBTS ≤ 50 V AC / ≤ 120 V DC), de sécurité incendie (SSI Catégorie A), de contrôle d'accès sécurisé, de vidéoprotection IP HD, de sonorisation d'évacuation (EN 54-16) et de gestion technique du bâtiment (GTB/GTC BACnet/IP).",
      roleEn: 'Engineering, deployment, and supervision of Extra-Low Voltage (SELV ≤ 50 V AC / ≤ 120 V DC) building subsystems: Category A Fire Alarm Systems (EN 54 / NF S 61-931), IP video surveillance, biometric access control, voice alarm evacuation (EN 54-16), and smart Building Management Systems (BMS BACnet/IP).',
      inputsFr: {
        title: 'Alimentation Électrique Secourue & Sources Normales',
        desc: 'Arrivée TGBT 230/400 V AC ondulée (ASI/UPS double conversion online, autonomie 10–30 min) et coffrets chargeurs-redresseurs 24/48 V DC avec parcs batteries stationnaires Pb-étanche VRLA / Ni-Cd.',
        voltage: '230 V AC / 24–48 V DC Ondulé & Secouru'
      },
      inputsEn: {
        title: 'Emergency Backed Supply & Primary Mains',
        desc: 'Dual-feed 230/400 V AC backed by online double-conversion UPS and industrial 24/48 V DC rectifiers with stationary sealed VRLA/Ni-Cd battery banks ensuring autonomous standby operation.',
        voltage: '230 V AC / 24–48 V DC Backed & Isolated'
      },
      processFr: {
        title: 'Distribution Dédiée, Boucles Adressables & Câblage VDI',
        desc: 'Réseaux de boucles adressables rebouclées isolées (isolateurs de court-circuit NF S 61-970), câbles résistants au feu CR1/C1 pour fonctions de sécurité, câblage cuivre Cat 6A/7A blindé F/FTP et rocade fibre optique monomode OS2.',
        note: 'Ségrégation galvanique stricte des courants forts (CFO) et courants faibles (CFA) : distance minimale 300 mm sur chemins de câbles métalliques continûment reliés à la terre.'
      },
      processEn: {
        title: 'Dedicated Distribution, Addressable Loops & VDI Cabling',
        desc: 'Class A addressable fault-tolerant return loops with integral short-circuit isolators, fire-resistant CR1/C1 cabling for life safety, Cat 6A/7A shielded copper cabling, and OS2 single-mode optical fiber backbones.',
        note: 'Strict galvanic physical separation between power (HV/LV) and ELV circuits: minimum 300 mm clearance on metallic cable trays with continuous equipotential bonding.'
      },
      outputsFr: {
        title: 'Actionneurs de Sécurité, Supervision & Terminaux Métier',
        desc: 'Déclencheurs d\'évacuation sonore (NF S 32-001 / EN 54-3), clapets coupe-feu motorisés, volets de désenfumage, ventouses électromagnétiques de verrouillage (DAS), caméras IP 4K PoE+, et automates DDC de régulation CVC.',
        earthing: 'Régime TBTS (Très Basse Tension de Sécurité) avec isolation galvanique totale et boucle de terre équipotentielle maillée télécom (R < 1 Ω)'
      },
      outputsEn: {
        title: 'Safety Actuators, Supervisory Servers & Field Endpoints',
        desc: 'EN 54-3 evacuation sounders, motorized fire dampers, smoke extraction vents, fail-secure magnetic locks, 4K PoE+ PTZ cameras, and BACnet/IP Direct Digital Controllers (DDC) for HVAC optimization.',
        earthing: 'SELV (Safety Extra-Low Voltage) scheme with full galvanic barrier and dedicated telecom equipotential mesh earthing grid (R < 1 Ω)'
      }
    },
    sectionB: {
      summaryFr: "Panorama architectural des 5 sous-systèmes critiques de courants faibles et de sécurité technique des bâtiments, illustrant les topologies de boucle incendie rebouclée, le câblage VDI haute densité PoE++, le contrôle d'accès Grade 4, la vidéosurveillance IP 4K avec VMS unifié et la GTB/GTC multi-protocoles.",
      summaryEn: 'Architectural overview of the 5 critical extra-low voltage and building management subsystems, spanning Class A fire alarm loops, high-density PoE++ VDI networks, Grade 4 physical access control, 4K IP video with unified VMS, and multi-protocol smart BMS.',
      architectures: [
        {
          nameFr: "Système de Sécurité Incendie SSI Catégorie A avec Évacuation Sonore EN 54-16 (Centrale Hydroélectrique de Nachtigal & Tour Tertiaire)",
          nameEn: 'Category A Fire Safety System with Voice Alarm EN 54-16 (Nachtigal Hydro Powerhouse & High-Rise Tower)',
          techFr: "Boucles rebouclées adressables classe A, détecteurs optiques et thermo-vélocimétriques de fumée, déclencheurs manuels, centralisateur de mise en sécurité incendie (CMSI) et extinction automatique par gaz propre Novec 1230.",
          techEn: 'Class A addressable fault-tolerant return loops, optical and rate-of-rise smoke detectors, manual call points, integrated Fire Alarm & Safety Control Panel (FACP/CMSI), and Novec 1230 total flooding clean agent fire suppression.',
          descFr: "Architecture de sécurité absolue conçue pour les infrastructures critiques : l'apparition d'une coupure ou d'un court-circuit sur une boucle est immédiatement isolée par les isolateurs intégrés sans interruption de surveillance.",
          descEn: 'Fail-safe safety architecture designed for mission-critical infrastructure: a cable cut or short-circuit is instantaneously isolated by adjacent bidirectional isolators without losing single sensor communication.',
          standard: 'NF S 61-931, NF S 61-970, EN 54-2, EN 54-4, EN 54-16',
          metricFr: 'Temps de détection < 15 s • Jusqu\'à 128 points adressables/boucle • Autonomie batterie 72 h veille + 1 h alarme',
          metricEn: 'Detection latency < 15 s • Up to 128 addressable points/loop • Battery backup 72 h standby + 1 h full alarm'
        },
        {
          nameFr: "Infrastructure de Câblage Structuré VDI & Réseau Haute Densité PoE++ 802.3bt (Data Center & Siège Social)",
          nameEn: 'High-Density VDI Structured Cabling & PoE++ 802.3bt Infrastructure (Data Center & Corporate HQ)',
          techFr: "Rocades optiques redondées 40/100 GbE en fibre monomode OS2 / multimode OM4, distribution horizontale cuivre Cat 6A blindée S/FTP, répartiteurs 42U et commutateurs PoE++ Type 4 (jusqu'à 90 W par port).",
          techEn: 'Redundant 40/100 GbE optical backbones with OS2 single-mode and OM4 multi-mode fiber, Cat 6A S/FTP shielded horizontal copper cabling, 42U distribution racks, and IEEE 802.3bt Type 4 PoE++ switches (up to 90 W/port).',
          descFr: "Topologie hiérarchique en étoile normalisée ISO/IEC 11801 garantissant le transport simultané des données informatiques, de la téléphonie VoIP, de la vidéosurveillance et de l'alimentation électrique à distance des points d'accès Wi-Fi 6E.",
          descEn: 'Standardized hierarchical star topology per ISO/IEC 11801 delivering high-speed IT data, VoIP telephony, IP surveillance, and remote power delivery for high-draw Wi-Fi 6E access points and LED fixtures.',
          standard: 'ISO/IEC 11801-1/2, ANSI/TIA-568.2-D, IEEE 802.3bt, EN 50173',
          metricFr: 'Bande passante 500 MHz • NEXT > 42 dB à 250 MHz • Budget PoE commutateur 1 440 W (90 W/port)',
          metricEn: 'Bandwidth 500 MHz • NEXT > 42 dB at 250 MHz • Switch PoE budget 1,440 W (90 W/port)'
        },
        {
          nameFr: "Système de Contrôle d'Accès Sécurisé & Détection d'Intrusion Périphérique (Poste HTB 225 kV de Mangombé & SCDP)",
          nameEn: 'Secure Physical Access Control & Perimeter Intrusion Detection (Mangombé 225 kV Substation & SCDP Terminal)',
          techFr: "Lecteurs de badges RFID sécurisés Mifare DESFire EV3 avec chiffrement AES-128, biométrie morphologique faciale/veineuse, contrôleurs IP autonomes avec mémoire locale, barrières hyperfréquences et câble microphonique sur clôture.",
          techEn: 'Mifare DESFire EV3 smart card readers with end-to-end AES-128 encryption, facial/vein biometric terminals, autonomous IP door controllers with local cache, microwave barriers, and fence-mounted sensor cables.',
          descFr: "Sécurisation physique multi-niveaux protégeant les postes sources et dépôts pétroliers : gestion des sas anti-passback, sas d'accès camions citernes, et télé-surveillance des tentatives de franchissement avec levée de doute automatique.",
          descEn: 'Multi-tiered physical security guarding high-voltage grid substations and fuel depots: anti-passback airlocks, tanker truck access control, and real-time fence breach detection with automated PTZ video tracking.',
          standard: 'CEI 60839-11-1 Grade 4, EN 50131 Grade 3/4, SIA OSDP v2.2',
          metricFr: 'Temps d\'authentification < 300 ms • Résistance Grade 4 • Journal de 500 000 événements hors ligne',
          metricEn: 'Authentication time < 300 ms • Grade 4 high security • 500,000 events stored in offline local memory'
        },
        {
          nameFr: "Vidéoprotection IP Intelligente HD & Supervision VMS Centralisée (Complexe Portuaire de Kribi & Réseau Urbain)",
          nameEn: 'Intelligent 4K IP Video Surveillance & Centralized VMS Platform (Kribi Port Complex & Urban Perimeter)',
          techFr: "Caméras dômes et thermiques 4K Ultra-HD, encodage haute efficacité H.265/AV1, analytique vidéo embarquée (franchissement virtuel, reconnaissance plaques LPR), stockage SAN/NAS RAID 6 et plateforme VMS unifiée.",
          techEn: '4K Ultra-HD fixed and thermal PTZ cameras, high-efficiency H.265/AV1 encoding, edge AI video analytics (line crossing, unattended baggage, LPR license plate recognition), enterprise RAID 6 SAN storage, and unified VMS.',
          descFr: "Surveillance périmétrique continue et traçabilité logistique : détection thermique longue portée (> 1 500 m) des intrusions maritimes et terrestres, avec transmission temps réel vers le centre d'opérations de sécurité (SOC).",
          descEn: 'Continuous maritime and terrestrial perimeter monitoring: long-range thermal camera detection (> 1,500 m) with low-latency streaming to the Security Operations Center (SOC) and 30-day continuous evidentiary recording.',
          standard: 'EN 62676-1-1 / EN 62676-4, ISO/IEC 23008-2 (HEVC), ONVIF Profile S/G/T',
          metricFr: 'Flux VBR 4–8 Mb/s à 30 fps • Rétention légale 30 jours continus • Disponibilité SAN 99.999%',
          metricEn: 'VBR stream 4–8 Mb/s at 30 fps • 30-day statutory video retention • SAN storage 99.999% availability'
        },
        {
          nameFr: "Gestion Technique du Bâtiment (GTB/GTC) Multi-Protocoles & Efficacité Énergétique (Hôpital Général & Siège ENEO)",
          nameEn: 'Multi-Protocol Building Management System (BMS/BAS) & Energy Efficiency (General Hospital & Corporate HQ)',
          techFr: "Architecture 3 niveaux (Capteurs/Actionneurs, Automates DDC BACnet/IP, Supervision SCADA GTB), passerelles multi-protocoles Modbus TCP, KNX et DALI-2 pour la régulation CVC multizone, le comptage d'énergie et l'éclairage.",
          techEn: '3-tier architecture (Field Sensors/Actuators, BACnet/IP Direct Digital Controllers, BMS SCADA Web Supervision), multi-protocol gateways for Modbus TCP, KNX, and DALI-2 controlling multizone HVAC, sub-metering, and dynamic lighting.',
          descFr: "Plateforme d'efficacité énergétique et d'optimisation thermique : asservissement en fonction de l'occupation, délestage de pointe électrique, relève automatisée des index de compteurs et alertes de dérive énergétique.",
          descEn: 'Energy optimization and climate management platform: occupancy-based cooling setbacks, peak load shedding, automated sub-metering data collection, and ISO 52120 Class A automated energy efficiency certification.',
          standard: 'ISO 16484-5 (BACnet), NF EN ISO 52120-1 Classe A, CEI 62386 (DALI-2)',
          metricFr: 'Économie d\'énergie 25–35% • Rafraîchissement télémesures < 1 s • 10 000+ points de données gérés',
          metricEn: 'Energy reduction 25–35% • Telemetry refresh < 1 s • 10,000+ supervised building data points'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-ssi-cat-a',
        nameFr: "Centrale Électronique de Détection Incendie & CMSI Adressable (ECS/CMSI)",
        nameEn: 'Addressable Fire Alarm Control Panel & Safety System (FACP/CMSI EN 54)',
        voltage: '24 V DC (Alimentation Secourue EAE EN 54-4)',
        roleFr: "Détection précoce des foyers d'incendie par boucles adressables rebouclées, gestion automatisée des asservissements de mise en sécurité (désenfumage, clapets coupe-feu, compartimentage) et diffusion de l'évacuation générale sonore.",
        roleEn: 'Early fire hazard detection via addressable Class A loops, automated management of life safety actuators (smoke venting, motorized dampers, door holders), and synchronized acoustic evacuation alarm broadcasting.',
        symbol: 'FACP / CMSI',
        standard: 'EN 54-2, EN 54-4, NF S 61-931, NF S 61-936',
        imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'relay-tcc'
      },
      {
        id: 'eq-exp-vdi-rack-42u',
        nameFr: "Baie de Brassage Réseau VDI & Répartiteur Général 42U Haute Densité",
        nameEn: '42U High-Density VDI Structured Cabling & Optical Distribution Rack',
        voltage: '230 V AC / 48 V DC (PDU Intelligent Monobloc 32 A)',
        roleFr: "Concentration et brassage des liaisons optiques monomodes OS2 et multimodes OM4, des panneaux de distribution cuivre Cat 6A blindés S/FTP, des commutateurs d'accès PoE++ 90 W et des serveurs d'enregistrement NVR.",
        roleEn: 'Central cross-connect aggregation housing OS2/OM4 optical fiber patch panels, Cat 6A S/FTP copper distribution fields, high-capacity IEEE 802.3bt 90 W PoE++ core switches, and enterprise NVR servers.',
        symbol: 'RACK 42U',
        standard: 'ISO/IEC 11801, ANSI/TIA-568.2-D, EIA/TIA-310-E, IEEE 802.3bt',
        imgUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-camera-ip-ptz',
        nameFr: "Caméra Dôme IP 4K PTZ Intelligente avec IA & Vision Nocturne Infrarouge",
        nameEn: '4K Ultra-HD Intelligent PTZ IP Surveillance Camera with Edge AI & IR',
        voltage: 'PoE+ (IEEE 802.3at / 30 W, 48 V DC)',
        roleFr: "Surveillance périmétrique haute résolution avec zoom optique 30x, éclairage infrarouge adaptatif 150 m, et algorithmes d'analyse vidéo temps réel (classification de cibles humains/véhicules, détection d'intrusion).",
        roleEn: 'High-resolution perimeter visual tracking with 30x optical zoom, 150 m adaptive infrared illumination, and edge AI video analytics classifying human/vehicle intruders with automated pan-tilt-zoom pursuit.',
        symbol: 'CAM-PTZ',
        standard: 'EN 62676-1/4, ONVIF Profile S/T/M, IP66 / IK10',
        imgUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-access-controller',
        nameFr: "Centrale Contrôleur d'Accès IP Sécurisée Multi-Lecteurs OSDP v2",
        nameEn: 'Secure Multi-Door IP Access Controller with OSDP v2 / DESFire EV3',
        voltage: '12–24 V DC (Batterie Tampon Pb 12 V / 7 Ah)',
        roleFr: "Gestion temps réel des droits de franchissement physique, décodage cryptographique AES-128 des badges RFID Mifare DESFire EV3, asservissement des ventouses électromagnétiques DAS et gestion des sas anti-retour.",
        roleEn: 'Real-time physical access rights authorization, hardware-level AES-128 cryptographic decoding for DESFire EV3 credentials, lock actuator driving, and anti-passback security airlock sequencing.',
        symbol: 'ACU-IP',
        standard: 'CEI 60839-11-1 Grade 4, SIA OSDP v2.2',
        imgUrl: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-bms-ddc-controller',
        nameFr: "Automate de Régulation Numérique Directe GTB (DDC BACnet/IP & Modbus)",
        nameEn: 'BACnet/IP & Modbus Direct Digital Controller (DDC) for Smart BMS',
        voltage: '24 V AC / 24 V DC (TBTS)',
        roleFr: "Régulation dynamique multizone du génie climatique CVC (CTA, groupes frigorifiques, ventilo-convecteurs), optimisation prédictive du confort thermique et centralisation des comptages divisionnaires d'eau et d'électricité.",
        roleEn: 'Direct digital closed-loop control of HVAC air handling units, chillers, and fan coil units, predictive comfort regulation, and automated sub-metering data aggregation over BACnet/IP and Modbus.',
        symbol: 'DDC-BMS',
        standard: 'ISO 16484-5 (BACnet), NF EN ISO 52120-1 Classe A',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-novec-extinguishing',
        nameFr: "Système d'Extinction Automatique à Gaz Propre Novec 1230 / FK-5-1-12",
        nameEn: 'Novec 1230 / FK-5-1-12 Clean Agent Total Flooding Fire Suppression System',
        voltage: '24 V DC (Ligne de Déclenchement Pyrotechnique Surveillée)',
        roleFr: "Extinction instantanée par noyage total des salles serveurs informatiques, centres de données et locaux électriques HTB/BT sans projection d'eau ni dépôt résiduel corrosif, préservant l'intégrité du matériel sous tension.",
        roleEn: 'Rapid total flooding fire suppression for mission-critical data halls, control rooms, and electrical switchgear vaults without water discharge or corrosive residue, safely extinguishing energized fires.',
        symbol: 'EXT-NOVEC',
        standard: 'NF EN 15004-1/2, NFPA 2001, APSAD R13',
        imgUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'relay-tcc'
      }
    ],
    sectionD: [
      {
        phase: 'Phase 1',
        titleFr: 'Analyse des Risques, Typologie du Bâtiment & Notice de Sécurité SSI',
        titleEn: 'Risk Analysis, Building Typology & Fire Safety Design Basis',
        descFr: "Classification réglementaire du site (ERP de 1ère à 5ème catégorie, IGH, Code du Travail ou ICPE), définition du niveau de SSI requis (Catégorie A à E per NF S 61-931) et rédaction de la notice technique de mise en sécurité.",
        descEn: 'Regulatory classification of the facility (Public Assembly Building, High-Rise Tower, Industrial Site per labor codes), determination of mandatory Fire Safety System category (Category A to E), and safety concept basis formulation.'
      },
      {
        phase: 'Phase 2',
        titleFr: 'Zonage Détection/Mise en Sécurité (ZD/ZS) & Bilans de Puissance PoE / Secouru',
        titleEn: 'Detection & Safety Zoning (ZD/ZS) & PoE / Standby Power Budgets',
        descFr: "Découpage architectural en Zones de Détection (ZD) et Zones de Sécurité (ZS), calcul des bilans de puissance PoE++ par commutateur et dimensionnement des sources d'alimentation secourues (EAE 24 Vcc per EN 54-4 et ASI).",
        descEn: 'Architectural partitioning into Fire Detection Zones (ZD) and Compartment Safety Zones (ZS), calculations of PoE++ switch power budgets, and engineering sizing of 24 Vdc standby battery power supplies per EN 54-4.'
      },
      {
        phase: 'Phase 3',
        titleFr: 'Études d\'Exécution, Synoptiques de Câblage & Plans d\'Implantation CFA',
        titleEn: 'Detailed Execution Engineering, Wiring Synoptics & ELV Layouts',
        descFr: "Modélisation BIM des réseaux courants faibles, schémas synoptiques des boucles adressables, plans de repérage des détecteurs, caméras, lecteurs de badges et automates GTB avec cheminements dédiés.",
        descEn: 'BIM modeling of all extra-low-voltage pathways, single-line wiring synoptics of Class A loops, device location floor plans for detectors, IP cameras, card readers, and BMS controllers with dedicated cable routes.'
      },
      {
        phase: 'Phase 4',
        titleFr: 'Câblage Physique, Ségrégation CFO/CFA & Équipotentialité Télécom',
        titleEn: 'Physical Installation, Power/ELV Separation & Telecom Equipotential Bonding',
        descFr: "Tirage des câbles résistants au feu CR1/C1 (incendie) et paires torsadées Cat 6A blindées F/FTP avec respect scrupuleux de l'écartement minimal de 300 mm vis-à-vis des câbles de puissance 400 V / 20 kV et mise à la terre maillée.",
        descEn: 'Installation of fire-resistant CR1/C1 cables (life safety) and Cat 6A F/FTP shielded twisted-pair runs strictly maintaining the 300 mm clearance from 400 V / 20 kV power trays, connected to the telecom mesh earthing bar.'
      },
      {
        phase: 'Phase 5',
        titleFr: 'Recettage Réseau Cuivre/Fibre (OTDR) & Essais d\'Autonomie Batteries',
        titleEn: 'Copper/Fiber Network Certification (OTDR) & Battery Autonomy Testing',
        descFr: "Certification au réflectomètre optique (OTDR) des rocades fibre OS2, tests de diaphonie (NEXT) et perte d'insertion sur les liens cuivre Cat 6A, et décharge réelle des parcs batteries 24/48 Vcc sous courant nominal.",
        descEn: 'OTDR optical time-domain reflectometry certification of OS2 fiber links, NEXT crosstalk and return loss certification of Cat 6A copper channels, and full-load battery bank discharge autonomy verification.'
      },
      {
        phase: 'Phase 6',
        titleFr: 'Essais Fonctionnels Globaux, Scénarios de Mise en Sécurité & Commissioning',
        titleEn: 'Integrated Functional Testing, Fire Scenarios & SSI Commissioning',
        descFr: "Vérification in situ de l'arbre des causes et effets : déclenchement d'un détecteur entraînant l'alarme sonore d'évacuation temporisée, le désenfumage, la fermeture des clapets coupe-feu et le déverrouillage des issues de secours.",
        descEn: 'Full on-site commissioning of the Cause & Effect matrix: triggering a fire detector activates zoned voice evacuation sounders, starts smoke extraction fans, closes fire dampers, and releases exit access doors.'
      },
      {
        phase: 'Phase 7',
        titleFr: 'Maintenance Réglementaire Périodique, Audits Cybersécurité & Registre de Sécurité',
        titleEn: 'Periodic Regulatory Maintenance, Cybersecurity Audits & Safety Logbook',
        descFr: "Contrôles réglementaires semestriels et annuels (remplacement des batteries tous les 3–4 ans, nettoyage des chambres optiques, tests de concentration gaz Novec 1230 per NF EN 15004) et tenue à jour du registre de sécurité.",
        descEn: 'Statutory bi-annual and annual inspections (battery renewals every 3–4 years, optical detector cleaning, door-fan enclosure integrity tests for Novec 1230 gas per NF EN 15004), and audit trail maintenance.'
      }
    ],
    sectionE: [
      {
        id: 'elv_battery_sizing',
        tabLabelFr: '1. Autonomie Batteries EN 54-4',
        tabLabelEn: '1. Battery Sizing EN 54-4',
        titleFr: "Dimensionnement de la Capacité des Batteries Secourues EAE / SSI (EN 54-4 / NF S 61-936)",
        titleEn: 'Battery Bank Sizing for Fire Alarm Power Supplies (EN 54-4 / NF S 61-936)',
        descFr: "Calcul normatif de la capacité nominale minimale en ampères-heures (Ah) requise pour alimenter une centrale de détection incendie pendant la durée de veille réglementaire (ex. 72 heures sans secteur) suivie de la phase d'alarme générale maximale (ex. 1 heure per NF S 61-936).",
        descEn: 'Normative calculation of the minimum battery capacity in Ampere-hours (Ah) required to sustain a fire alarm control panel through statutory standby autonomy (e.g. 72 hours without mains) followed by maximum full alarm evacuation (e.g. 1 hour per NF S 61-936).',
        formula: 'C_{min} = 1.25 \\cdot \\left( I_{veille} \\cdot t_{veille} + I_{alarme} \\cdot t_{alarme} \\right)',
        formulaDescFr: "Où C_min est la capacité minimale requise (Ah), I_veille le courant total consommé par les boucles et la centrale au repos (A), t_veille la durée de veille obligatoire (h), I_alarme le courant maximal en diffusion d'alarme et asservissements (A), t_alarme la durée d'alarme (h), et 1.25 le coefficient de sécurité compensant le vieillissement batterie et la température.",
        formulaDescEn: 'Where C_min is minimum required battery capacity (Ah), I_veille is quiescent standby current (A), t_veille is standby duration (h), I_alarme is maximum alarm current with sounders and actuators active (A), t_alarme is alarm duration (h), and 1.25 is safety aging factor compensating for temperature derating.',
        assumptionsFr: [
          'Facteur de vieillissement et perte de capacité terminale : 1.25 (marge de 25% imposée par l\'EN 54-4).',
          'Autonomie réglementaire courante en ERP sans groupe électrogène secouru : t_veille = 72 h, t_alarme = 1 h.',
          'Tension de fin de décharge minimale admissible : 1.75 V par élément (soit 21.0 V pour un parc nominal 24 Vcc).'
        ],
        assumptionsEn: [
          'Aging and end-of-life derating coefficient: 1.25 (25% mandatory margin per EN 54-4).',
          'Standard regulatory autonomy in commercial buildings without standby genset: t_standby = 72 h, t_alarm = 1 h.',
          'Permissible end-of-discharge cut-off voltage: 1.75 V/cell (yielding 21.0 V for a 24 Vdc battery bank).'
        ],
        calcTab: 'power'
      },
      {
        id: 'elv_loop_voltage_drop',
        tabLabelFr: '2. Chute Tension Boucle TBTS',
        tabLabelEn: '2. Loop Voltage Drop SELV',
        titleFr: "Calcul de la Chute de Tension en Ligne sur Boucle Adressable TBTS 24 V DC (NF S 61-970)",
        titleEn: 'Conductor Voltage Drop on Class A SELV 24 V DC Addressable Loop (NF S 61-970)',
        descFr: "Vérification que la tension résiduelle au point le plus défavorable de la boucle rebouclée reste strictement supérieure au seuil minimal de fonctionnement des détecteurs et isolateurs (typiquement 18.0 V DC pour une alimentation 24 V DC).",
        descEn: 'Ensures that voltage at the most electrically distant addressable detector on the Class A return loop remains strictly above the manufacturer cut-off threshold (typically 18.0 V DC on a 24 V DC system).',
        formula: '\\Delta U = 2 \\cdot \\rho \\cdot \\frac{L}{S} \\cdot I_{boucle} \\le \\Delta U_{max} = 0.10 \\cdot U_n',
        formulaDescFr: "Où ΔU est la chute de tension en ligne (V), ρ la résistivité du cuivre à température maximale de service (0.0225 Ω·mm²/m à 50°C), L la longueur développée de la boucle aller (m), S la section des conducteurs (mm²), et I_boucle le courant maximal absorbé par l'ensemble des modules et détecteurs en alarme (A).",
        formulaDescEn: 'Where ΔU is loop conductor voltage drop (V), ρ is copper resistivity at maximum operating temperature (0.0225 Ω·mm²/m at 50°C), L is physical one-way conductor route length (m), S is conductor cross-section (mm²), and I_boucle is peak loop current under full alarm state (A).',
        assumptionsFr: [
          'Résistivité du cuivre ajustée à 50°C en ambiance technique : ρ = 0.0225 Ω·mm²/m.',
          'Section standard des câbles de boucle incendie : 1.5 mm² ou 2.5 mm² en câble blindé résistant au feu.',
          'Chute de tension maximale tolérée : 10% de la tension nominale (soit ΔU ≤ 2.40 V sous 24 V DC).'
        ],
        assumptionsEn: [
          'Copper conductor resistivity adjusted to 50°C: ρ = 0.0225 Ω·mm²/m.',
          'Standard fire loop cable gauge: 1.5 mm² or 2.5 mm² shielded fire-rated twisted pair.',
          'Maximum permissible loop voltage drop: 10% of nominal voltage (ΔU ≤ 2.40 V on a 24 V DC system).'
        ],
        calcTab: 'voltage-drop'
      },
      {
        id: 'elv_sounder_spl_attenuation',
        tabLabelFr: '3. Acoustique Évacuation EN 54-3',
        tabLabelEn: '3. Voice Evacuation SPL EN 54-3',
        titleFr: "Pression Acoustique d'Évacuation et Atténuation avec la Distance (NF S 32-001 / EN 54-3)",
        titleEn: 'Evacuation Acoustic Sound Pressure Level & Spatial Attenuation (EN 54-3 / NF S 32-001)',
        descFr: "Calcul de la pression acoustique délivrée par les diffuseurs sonores d'alarme dans les locaux à protéger pour garantir l'intelligibilité et l'éveil : le niveau sonore doit dépasser de 15 dB(A) le bruit de fond ambiant ou atteindre au moins 65 dB(A).",
        descEn: 'Determination of acoustic sound pressure delivered by evacuation sirens and voice alarm speakers, guaranteeing speech intelligibility and awakeness: SPL must exceed ambient background noise by 15 dB(A) or reach at least 65 dB(A).',
        formula: 'L_p(d) = L_{w0} - 20 \\log_{10}(d) - A_{env} \\ge \\max\\left(65\\text{ dB(A)}, \\; L_{bruit\\_fond} + 15\\text{ dB(A)}\\right)',
        formulaDescFr: "Où L_p(d) est la pression acoustique perçue à la distance d (dB(A)), L_w0 la puissance acoustique de référence mesurée à 1 mètre (typiquement 90 à 105 dB(A) à 1 m), d la distance directe en mètres, et A_env l'atténuation due aux parois, cloisons et absorption d'air (typiquement 15 à 20 dB pour une porte fermée).",
        formulaDescEn: 'Where L_p(d) is perceived sound pressure level at distance d (dB(A)), L_w0 is rated acoustic output at 1 meter (typically 90 to 105 dB(A) at 1 m), d is distance in meters, and A_env is structural partition attenuation (typically 15 to 20 dB for a closed standard door).',
        assumptionsFr: [
          'Atténuation géométrique en champ libre sphérique : 6 dB(A) par doublement de distance (20 log10 d).',
          'Intelligibilité vocale minimale selon CEI 60268-16 : Indice de Transmission de la Parole STI ≥ 0.50.',
          'Pression acoustique maximale pour éviter les lésions auditives : L_p ≤ 115 dB(A) à tout point d\'écoute.'
        ],
        assumptionsEn: [
          'Free-field spherical geometric dispersion: 6 dB(A) attenuation per distance doubling (20 log10 d).',
          'Minimum mandatory speech intelligibility per IEC 60268-16: Speech Transmission Index STI ≥ 0.50.',
          'Maximum permissible sound pressure avoiding hearing trauma: L_p ≤ 115 dB(A) at any occupied point.'
        ],
        calcTab: 'power'
      },
      {
        id: 'elv_novec_gas_flooding',
        tabLabelFr: '4. Extinction Gaz Novec 1230',
        tabLabelEn: '4. Novec 1230 Gas Volume',
        titleFr: "Dimensionnement de la Masse d'Agent Extincteur Gaz Propre Novec 1230 (NF EN 15004 / NFPA 2001)",
        titleEn: 'Clean Agent Extinguishing Mass Calculation for Novec 1230 (NF EN 15004 / NFPA 2001)',
        descFr: "Détermination de la quantité d'agent extincteur chimique FK-5-1-12 (Novec 1230) requise pour éteindre un feu de classe A/B/électrique par noyage total d'un volume fermé (salle serveurs, local disjoncteurs) à température minimale de conception.",
        descEn: 'Formulation of total FK-5-1-12 (Novec 1230) chemical agent mass required to extinguish Class A/B/electrical fires via total flooding of an enclosed room (data center, switchgear room) at lowest expected temperature.',
        formula: 'W = \\frac{V}{S_v} \\cdot \\left( \\frac{C}{100 - C} \\right) \\quad \\text{avec} \\quad S_v = k_1 + k_2 \\cdot T',
        formulaDescFr: "Où W est la masse totale d'agent extincteur requise (kg), V le volume net du local à protéger (m³), C la concentration volumique de conception (typiquement 5.3% à 5.8% vol. pour feux électriques classe A), S_v le volume massique spécifique de la vapeur à la température T en °C (pour le Novec 1230, k_1 = 0.0664 et k_2 = 0.000274).",
        formulaDescEn: 'Where W is required clean agent mass (kg), V is net protected volume (m³), C is volumetric design concentration (typically 5.3% to 5.8% for Class A electrical risks), S_v is specific vapor volume at temperature T in °C (for Novec 1230, k_1 = 0.0664 and k_2 = 0.000274).',
        assumptionsFr: [
          'Concentration de sécurité pour risques électriques et informatiques : C = 5.6% vol.',
          'Température minimale de service de la salle informatique : T = 20°C (S_v = 0.0719 m³/kg).',
          'Temps maximal d\'évacuation de la charge totale dans le local : t_decharge ≤ 10 secondes.'
        ],
        assumptionsEn: [
          'Design concentration for electrical equipment spaces: C = 5.6% by volume.',
          'Minimum room temperature design baseline: T = 20°C (S_v = 0.0719 m³/kg).',
          'Maximum discharge time through calibrated nozzles into the space: t_discharge ≤ 10 seconds.'
        ],
        calcTab: 'relay-tcc'
      },
      {
        id: 'elv_cctv_storage_bandwidth',
        tabLabelFr: '5. Stockage VMS & Débit Vidéo',
        tabLabelEn: '5. CCTV Storage & Bitrate',
        titleFr: "Calcul de Bande Passante Réseau Vidéo et Capacité de Stockage NVR (EN 62676-4)",
        titleEn: 'Video Stream Network Bandwidth & NVR Storage Array Sizing (EN 62676-4)',
        descFr: "Dimensionnement du débit réseau total agrégé et de la capacité brute de stockage des disques durs en téraoctets (To) pour un parc de caméras IP HD/4K sous encodage H.265 avec rétention légale continue de 30 jours et redondance RAID 6.",
        descEn: 'Calculates total network throughput and raw hard drive capacity in Terabytes (TB) for an IP camera fleet under H.265 compression, ensuring 30-day statutory continuous recording with enterprise RAID 6 parity overhead.',
        formula: 'Storage_{TB} = \\frac{N_{cam} \\cdot \\text{Bitrate}_{\\text{Mbps}} \\cdot 3600 \\cdot 24 \\cdot D_{\\text{jours}}}{8 \\cdot 10^6 \\cdot (1 - \\text{RAID}_{overhead})}',
        formulaDescFr: "Où Storage_TB est la capacité brute de stockage requise (To), N_cam le nombre de caméras IP connectées, Bitrate_Mbps le débit moyen par flux (ex. 4.0 Mb/s en 4K H.265 à 25 fps), D_jours la durée de rétention légale (ex. 30 jours), et RAID_overhead la réserve de disques de parité RAID 6 (typiquement 20% à 25%).",
        formulaDescEn: 'Where Storage_TB is raw disk storage (TB), N_cam is camera count, Bitrate_Mbps is average video bitrate per camera (e.g. 4.0 Mbps for 4K H.265 at 25 fps), D_jours is statutory retention period (e.g. 30 days), and RAID_overhead accounts for parity disks (typically 20% to 25%).',
        assumptionsFr: [
          'Facteur de compression vidéo H.265 / HEVC à débit binaire variable VBR : 4 Mb/s par caméra 4K.',
          'Durée légale de conservation des enregistrements de sécurité : 30 jours continus (24h/24).',
          'Pénalité de parité double disque RAID 6 et réserve d\'usure : 25% de capacité brute additionnelle.'
        ],
        assumptionsEn: [
          'H.265 / HEVC compression factor under variable bitrate VBR: 4 Mbps per 4K camera stream.',
          'Statutory surveillance video retention duration: 30 continuous days (24/7 recording).',
          'RAID 6 dual-disk parity overhead and formatting margin: 25% additional raw storage.'
        ],
        calcTab: 'power'
      },
      {
        id: 'elv_poe_power_budget',
        tabLabelFr: '6. Bilan Puissance PoE++ 802.3bt',
        tabLabelEn: '6. PoE++ Power Budget 802.3bt',
        titleFr: "Bilan de Puissance Alimentation par Câble Ethernet PoE++ (IEEE 802.3bt Type 3/4)",
        titleEn: 'Power over Ethernet PoE++ Switch Power Supply Sizing (IEEE 802.3bt Type 3/4)',
        descFr: "Calcul de la puissance totale requise pour l'alimentation électrique d'un commutateur réseau PoE injectant la puissance continue nécessaire aux terminaux déportés (caméras PTZ, bornes Wi-Fi 6E, écrans tactiles, serrures biométriques) en intégrant les pertes joule en ligne.",
        descEn: 'Sizes the total DC/AC power capacity of a PoE network switch feeding powered devices (PTZ cameras, Wi-Fi 6E access points, biometric access terminals) while accounting for I²R thermal dissipation in Cat 6A copper channels.',
        formula: 'P_{PSE\\_total} = \\sum_{i=1}^{N_{ports}} \\left( \\frac{P_{PD\\_i}}{\\eta_{câble}} \\right) \\cdot k_{foisonnement}',
        formulaDescFr: "Où P_PSE_total est la puissance totale fournie par l'équipement source (PSE en Watts), P_PD_i la puissance consommée par le terminal récepteur i (PD), η_câble le rendement de transmission du câble à 90 m (typiquement 82% à 88% en Cat 6A sous 90 W), et k_foisonnement le coefficient de foisonnement d'utilisation simultanée (typiquement 0.80 à 0.90).",
        formulaDescEn: 'Where P_PSE_total is total switch PoE budget (W), P_PD_i is powered device demand, η_câble is copper transmission efficiency over 90 m channel (typically 82% to 88% on Cat 6A delivering 90 W), and k_foisonnement is simultaneity factor (typically 0.80 to 0.90).',
        assumptionsFr: [
          'Pertes thermiques maximales sur lien Cat 6A de 90 mètres per IEEE 802.3bt : jusqu\'à 19 W dissipés sous 90 W.',
          'Coefficient de foisonnement moyen sur commutateur 48 ports PoE+ : k_foisonnement = 0.85.',
          'Facteur de réserve d\'extension future sur alimentation de baie : 20% de marge minimale.'
        ],
        assumptionsEn: [
          'Maximum thermal I²R dissipation on 90 m Cat 6A link per IEEE 802.3bt: up to 19 W lost at 90 W delivered.',
          'Simultaneity factor across a 48-port PoE+ switch: k_foisonnement = 0.85.',
          'Future expansion design margin on switch power supply: minimum 20% reserve.'
        ],
        calcTab: 'power'
      }
    ],
    sectionF: [
      {
        code: 'EN 54 / NF S 61-931',
        tag: 'SÉCURITÉ INCENDIE SSI',
        titleFr: 'Systèmes de Détection et d\'Alarme Incendie & Centralisateurs de Mise en Sécurité (SSI Catégorie A)',
        titleEn: 'Fire Detection & Alarm Systems — Part 2 (FACP), Part 4 (Power Supplies), Part 16 (Voice Alarm)',
        descFr: 'Norme européenne et française régissant la conception, les performances de détection, les alimentations secourues EAE et l\'évacuation sonore des personnes en cas de sinistre.',
        descEn: 'European and French standard governing the design, detection performance, emergency power supplies (PSE), and voice alarm evacuation systems in occupied buildings.'
      },
      {
        code: 'ISO/IEC 11801 / TIA-568.2-D',
        tag: 'CÂBLAGE STRUCTURÉ VDI',
        titleFr: 'Technologies de l\'Information — Câblage Générique des Locaux d\'Utilisateurs (Cat 6A / 7A / Fibre OS2)',
        titleEn: 'Information Technology — Generic Cabling for Customer Premises (Cat 6A / 7A / OS2 Optical Fiber)',
        descFr: 'Prescriptions d\'architecture en étoile, bandes passantes jusqu\'à 500 MHz, atténuation diaphonique NEXT et règles de pose pour les rocades et la distribution horizontale.',
        descEn: 'Defines hierarchical star topology, bandwidth ratings up to 500 MHz, NEXT crosstalk thresholds, and installation guidelines for backbone and horizontal data channels.'
      },
      {
        code: 'EN 62676 / CEI 62676',
        tag: 'VIDÉOPROTECTION IP',
        titleFr: 'Systèmes de Vidéosurveillance Électronique pour Applications de Sécurité',
        titleEn: 'Video Surveillance Systems for Use in Security Applications (IP Video & VMS)',
        descFr: 'Exigences relatives aux performances optiques (critères DORI : Détecter, Observer, Reconnaître, Identifier), aux flux de compression H.265 et à la transmission réseau sans latence.',
        descEn: 'Specifies optical system performance (DORI criteria: Detect, Observe, Recognize, Identify), H.265 compression streaming, and latency-bounded network transmission.'
      },
      {
        code: 'CEI 60839-11-1',
        tag: 'CONTRÔLE D\'ACCÈS',
        titleFr: 'Systèmes d\'Alarme et de Sécurité Électronique — Contrôle d\'Accès Électronique (Grades 1 à 4)',
        titleEn: 'Alarm and Electronic Security Systems — Electronic Access Control Systems (Grades 1 to 4)',
        descFr: 'Définit les niveaux de sécurité physique et logique (Grade 4 pour les sites haute sécurité), les protocoles de communication sécurisés OSDP v2 et le cryptage des identifiants.',
        descEn: 'Defines physical and cryptographic security levels (Grade 4 for critical high-security sites), OSDP v2 secure channel protocols, and credential tampering resistance.'
      },
      {
        code: 'ISO 16484-5 / BACnet',
        tag: 'GESTION TECHNIQUE DU BÂTIMENT',
        titleFr: 'Systèmes d\'Automatisation et de Gestion Technique du Bâtiment (GTB/GTC) — Protocole BACnet',
        titleEn: 'Building Automation and Control Systems (BACS) — BACnet Communication Protocol',
        descFr: 'Standard international d\'interopérabilité pour les réseaux d\'automates DDC, la régulation thermique CVC, la gestion de l\'éclairage et l\'optimisation énergétique ISO 52120-1 Classe A.',
        descEn: 'International open protocol standard enabling seamless interoperability between DDC controllers, HVAC equipment, lighting systems, and ISO 52120-1 Class A building efficiency engines.'
      },
      {
        code: 'NF EN 15004-1 / NFPA 2001',
        tag: 'EXTINCTION GAZ PROPRES',
        titleFr: 'Systèmes d\'Extinction Fixes par Gaz — Conception, Installation et Maintenance (Novec 1230)',
        titleEn: 'Fixed Firefighting Systems — Gas Extinguishing Systems (Physical Properties & System Design)',
        descFr: 'Règles de dimensionnement volumique, calcul des buses d\'éjection, tenue à la surpression par évents de décharge et étanchéité de la salle par essai d\'infiltrométrie (Door-Fan Test).',
        descEn: 'Specifies clean agent volumetric sizing, discharge nozzle hydrodynamics, overpressure relief venting, and room enclosure integrity verification via calibrated Door-Fan Testing.'
      }
    ]
  },

  // D09: Intelligence Artificielle & Technologies Avancées de Réseau
  D09: {
    domainCode: 'D09',
    sectionA: {
      roleFr: "Déploiement des algorithmes d'apprentissage automatique (Machine Learning, Deep Learning, PINN), des systèmes de mesure de phaseurs synchronisés (WAMS / PMU IEEE C37.118) et des jumeaux numériques pour l'optimisation prédictive du dispatching électrique, la surveillance d'état des actifs HTB et la détection d'anomalies cyber-physiques.",
      roleEn: 'Deployment of machine learning, physics-informed neural networks (PINN), synchrophasor PMU systems (IEEE C37.118), and digital twins for real-time dispatch optimization, predictive asset health indexing, and cyber-physical anomaly detection across electrical power systems.',
      inputsFr: {
        title: 'Flux Télémétriques Haute Résolution & Données Physiques',
        desc: 'Synchrophaseurs PMU 50 trames/s horodatés GPS/PTP (IEEE C37.118), télémétrie SCADA CEI 60870-5-104 / ICCP, chromatographie DGA en ligne des transformateurs et images thermiques infrarouges radiométriques.',
        voltage: 'Flux Réseau IP/Ethernet • 50 Hz Échantillonné'
      },
      inputsEn: {
        title: 'High-Resolution Telemetry Streams & Physical Data',
        desc: 'GPS/PTP-synchronized PMU synchrophasors at 50 frames/s (IEEE C37.118), SCADA IEC 60870-5-104 / ICCP telemetry, online transformer DGA gas chromatography, and radiometric infrared imagery.',
        voltage: 'IP/Ethernet Network Stream • 50 Hz Sampled Data'
      },
      processFr: {
        title: 'Modèles Hybrides Physique-IA & Jumeaux Numériques',
        desc: 'Réseaux de neurones informés par la physique (PINN) intégrant les équations d\'écoulement de puissance de Kirchhoff, auto-encodeurs profonds pour la détection d\'anomalies dynamiques, et forêts d\'isolement pour les fraudes réseau.',
        note: 'Conformité stricte aux lois physiques de l\'électrotechnique : pénalisation des violations de tension, de courant et de puissance dans la fonction de perte neuronale.'
      },
      processEn: {
        title: 'Physics-AI Hybrid Models & Real-Time Digital Twins',
        desc: 'Physics-Informed Neural Networks (PINN) embedding Kirchhoff power flow constraints, deep autoencoders for dynamic frequency event detection, and isolation forests isolating non-technical losses.',
        note: 'Strict electrotechnical constraint enforcement: physical law boundary penalties embedded directly into the neural training loss function.'
      },
      outputsFr: {
        title: 'Consignes de Réglage Prédictif & Indices de Santé d\'Actif',
        desc: 'Consignes d\'effacement et d\'injection active/réactive vers les BESS et centrales solaires, alertes précoces de défauts de transformateurs (Duval 1/4/5), et recommandations d\'arbitrage automatique N-1 pour les dispatchers.',
        earthing: 'Infrastructures serveurs de calcul hébergées en salles serveurs sécurisées (terre informatique maillée R < 1 Ω)'
      },
      outputsEn: {
        title: 'Predictive Control Setpoints & Asset Health Indices',
        desc: 'Active/reactive dispatch setpoints transmitted to BESS and solar inverters, early transformer failure alerts (Duval 1/4/5), and automated N-1 contingency redispatch recommendations.',
        earthing: 'Edge and cloud computing server racks housed in secure data rooms with dedicated telecom mesh earthing (R < 1 Ω)'
      }
    },
    sectionB: {
      summaryFr: "Panorama architectural des 5 technologies d'intelligence artificielle et de supervision avancée des réseaux électriques, illustrant le jumeau numérique thermique des transformateurs, la surveillance grand réseau WAMS par synchrophaseurs, la prévision solaire hybride couplée au BESS, les sondes de cybersécurité OT et la détection d'anomalies de comptage AMI.",
      summaryEn: 'Architectural overview of the 5 key artificial intelligence and advanced power system supervision technologies, spanning transformer thermal digital twins, wide-area monitoring systems (WAMS), hybrid solar-BESS forecasting, OT cybersecurity probes, and AMI non-technical loss analytics.',
      architectures: [
        {
          nameFr: "Jumeau Numérique Thermique & Diagnostic DGA par Réseaux Neuronaux (Centrale de Songloulou 384 MW & Postes HTB)",
          nameEn: 'Transformer Thermal Digital Twin & Neural DGA Diagnostics (Songloulou 384 MW Hydro Plant & HV Substations)',
          techFr: "Chromatographie multigaz en ligne PAS, capteurs de température à fibre optique GaAs dans les enroulements, réseau de neurones Duval et modèle thermique différentiel CEI 60076-7 pour l'estimation en temps réel de la température du point chaud et de la durée de vie résiduelle (RUL).",
          techEn: 'Online photoacoustic multi-gas chromatography, GaAs optical fiber temperature sensors embedded in winding ducts, neural Duval triangle classifier, and IEC 60076-7 differential thermal ODE estimating hot-spot temperature and Remaining Useful Life (RUL).',
          descFr: "Surveillance d'état continue des transformateurs d'évacuation 10.5/225 kV de Songloulou : corrélation entre les montées en température, les surcharges harmoniques et les dégagements d'hydrocarbures dissous dans l'huile.",
          descEn: 'Continuous condition monitoring of Songloulou 10.5/225 kV step-up transformers: correlates localized hot-spot thermal transients, harmonic currents, and dissolved hydrocarbon gas generation to prevent insulation failure.',
          standard: 'IEC 60076-7, IEC 60599, IEEE C57.104, Cigré TB 738',
          metricFr: 'Erreur point chaud < 1.8°C • Détection défaut naissant > 96% • Extension durée de vie 15–20%',
          metricEn: 'Hot-spot prediction error < 1.8°C • Incipient fault confidence > 96% • Asset life extension 15–20%'
        },
        {
          nameFr: "Système de Surveillance Grand Réseau WAMS par Synchrophaseurs PMU (Interconnexion RIS-RIN Cameroun 225 kV)",
          nameEn: 'Wide-Area Monitoring System (WAMS) via Synchrophasors PMU (Cameroon RIS-RIN 225 kV Interconnection)',
          techFr: "Phasor Measurement Units (PMU) haute précision synchronisées GPS (IEEE C37.118), concentrateurs de phaseurs PDC (IEEE C37.244), calcul en temps réel de la marge de stabilité angulaire et du taux de variation de fréquence (RoCoF).",
          techEn: 'High-precision GPS-synchronized Phasor Measurement Units (PMU) conforming to IEEE C37.118, Phasor Data Concentrators (PDC per IEEE C37.244), and real-time angular stability margin and Rate of Change of Frequency (RoCoF) computing.',
          descFr: "Observabilité dynamique à l'échelle nationale : détection des modes d'oscillation inter-zones non amortis entre le réseau Sud (RIS) et le réseau Nord (RIN), avec déclenchement automatisé de délestages d'urgence ciblés.",
          descEn: 'Nationwide dynamic grid observability: pinpoints undamped inter-area power oscillations between the Southern (RIS) and Northern (RIN) interconnected grids, executing fast emergency remedial action schemes.',
          standard: 'IEEE Std C37.118.1/2, IEEE Std C37.244, IEC 61850-90-5, SONATREL Code de Réseau',
          metricFr: 'Cadence 50 phaseurs/s • Erreur vectorielle TVE < 0.5% • Détection d\'oscillation < 200 ms',
          metricEn: '50 synchrophasor frames/s • Total Vector Error TVE < 0.5% • Oscillation detection < 200 ms'
        },
        {
          nameFr: "Prévision Neuronale Hybride Solaire & Pilotage Prédictif de Rampe BESS (Centrale Solaire de Maroua/Guider 15 MWc)",
          nameEn: 'Hybrid Neural Solar Forecasting & Predictive BESS Ramp Control (Maroua/Guider 15 MWp Solar Park)',
          techFr: "Réseau de neurones récurrents LSTM combiné avec caméras de ciel (all-sky imager) et prévisions météo numériques pour anticiper les chutes d'irradiation, pilotant en boucle fermée les onduleurs 4-quadrants de la batterie BESS.",
          techEn: 'Deep LSTM recurrent neural network paired with sky cameras (all-sky imager) and numerical weather predictions forecasting cloud shadow irradiance drops, driving 4-quadrant BESS inverters under predictive closed-loop ramp control.',
          descFr: "Lissage actif de l'intermittence photovoltaïque sur le réseau isolé du Grand Nord : injection de puissance batterie en moins de 100 ms dès qu'un passage nuageux dense occulte le champ solaire de Maroua.",
          descEn: 'Active PV intermittency smoothing on the isolated northern grid: discharges battery energy within 100 ms whenever heavy cloud cover shades the Maroua solar array, maintaining grid frequency within ±0.1 Hz.',
          standard: 'IEC 61724-1, IEEE Std 2800-2022, IEC 62933-2-1',
          metricFr: 'Horizon 15 min à 24 h • Erreur RMSE < 4.2% • Absorption 100% des rampes > 1 MW/s',
          metricEn: 'Forecast horizon 15 min to 24 h • RMSE < 4.2% • 100% absorption of solar ramps > 1 MW/s'
        },
        {
          nameFr: "Sonde de Détection d'Intrusions Cyber-Physiques & IA Comportementale OT (Poste Numérique d'Oyomabang 225 kV)",
          nameEn: 'Cyber-Physical Intrusion Detection System & Behavioral OT AI (Oyomabang 225 kV Digital Substation)',
          techFr: "Inspection approfondie des paquets (DPI) sur bus de poste CEI 61850 (GOOSE, SV, MMS), modèle d'apprentissage non supervisé détectant les injections illégitimes de commandes disjoncteurs ou falsifications de télémesures.",
          techEn: 'Deep Packet Inspection (DPI) analyzing IEC 61850 station bus protocols (GOOSE, SV, MMS), running unsupervised anomaly models detecting unauthorized breaker trip commands or spoofed telemetry packets.',
          descFr: "Protection périmétrique des infrastructures réseau critiques contre les cyberattaques avancées (MITRE ATT&CK for ICS) : détection en temps réel des dérives de signature protocolaire et des flux non autorisés.",
          descEn: 'Cyber defense for high-voltage digital substations guarding against advanced industrial threats (MITRE ATT&CK for ICS): detects unauthorized payload signatures and rogue device connections with zero false breaker trips.',
          standard: 'IEC 62443-3-3 / IEC 62443-4-2, MITRE ATT&CK for ICS, IEEE 1686',
          metricFr: 'Latence DPI < 1 ms sur trames GOOSE • Faux positifs < 0.05% • Cartographie Purdue Niveaux 1–2',
          metricEn: 'DPI latency < 1 ms on GOOSE frames • False positive rate < 0.05% • Purdue Level 1–2 automated asset mapping'
        },
        {
          nameFr: "Détection d'Anomalies de Comptage & Pertes Non-Techniques par Forêts d'Isolement (Réseau AMI ENEO Douala & Yaoundé)",
          nameEn: 'Metering Anomaly Detection & Non-Technical Loss AI (ENEO Douala & Yaoundé AMI Grid)',
          techFr: "Algorithmes d'arbres de décision et forêts d'isolement (Isolation Forest) traitant les profils de charge quart-horaires de 500 000 compteurs communicants STS/AMI, corrélés avec les bilans de puissance des départs MT/BT.",
          techEn: 'Ensemble decision trees and multivariate Isolation Forest algorithms processing 15-minute load profiles from 500,000 smart STS/AMI meters, cross-correlated with substation MV/LV energy balance calculations.',
          descFr: "Ciblage prédictif des dérives de comptage, contournements de phases et fraudes sur le réseau basse tension de Douala : génération automatisée d'ordres d'intervention terrain pour les équipes de contrôle.",
          descEn: 'Predictive targeting of illegal bypasses, phase-neutral swapping, and meter tampering across Douala distribution grids: automatically issues prioritized dispatch orders for field verification crews.',
          standard: 'IEC 62056 (DLMS/COSEM), ISO/IEC 27001, IEEE Std 1366',
          metricFr: 'Précision détection fraude > 92% • Réduction pertes non-techniques 35% • ROI < 9 mois',
          metricEn: 'Fraud classification precision > 92% • Non-technical loss reduction 35% • Project payback < 9 months'
        }
      ]
    },
    sectionC: [
      {
        id: 'eq-exp-dga-online-monitor',
        nameFr: "Analyseur DGA Multigaz en Ligne & Diagnostic IA Triangle de Duval",
        nameEn: 'Online Multi-gas DGA Monitor & AI Duval Triangle Health Index',
        voltage: '230 V AC / 110 V DC (Auxiliaire)',
        roleFr: "Chromatographie en phase gazeuse et spectroscopie photoacoustique en ligne mesurant 9 gaz dissous (H2, CH4, C2H2, C2H4, C2H6, CO, CO2, O2, N2), couplée à un moteur d'inférence Duval 1/4/5.",
        roleEn: 'Online photoacoustic multi-gas analyzer quantifying 9 dissolved gases (H2, CH4, C2H2, C2H4, C2H6, CO, CO2, O2, N2) coupled with automated Duval Triangle 1/4/5 diagnostic inference.',
        symbol: 'DGA-PAS',
        standard: 'IEC 60599, IEEE C57.104, Cigré TB 738',
        imgUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'transformer'
      },
      {
        id: 'eq-exp-pmu-synchrophasor',
        nameFr: "Unité de Mesure de Phaseurs Synchronisés (PMU) & Stabilité WAMS",
        nameEn: 'Synchrophasor Measurement Unit (PMU) & Wide-Area Stability Terminal',
        voltage: '110–220 V DC / 100 V AC Mesure (TP/TC)',
        roleFr: "Échantillonnage ultrarapide (50 trames/s) synchronisé par horloge atomique GPS/PTP (précision < 1 µs) des phaseurs de tension et de courant pour la surveillance de la stabilité angulaire dynamique du grand réseau.",
        roleEn: 'Ultra-fast 50 frames/s sampling locked to atomic GPS/PTP timing (< 1 µs accuracy), measuring voltage and current phasors for wide-area dynamic grid angular stability tracking.',
        symbol: 'PMU / WAMS',
        standard: 'IEEE Std C37.118.1/2, IEC 61850-90-5, IEEE C37.244',
        imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'transmission-line'
      },
      {
        id: 'eq-exp-switch-iec62443',
        nameFr: "Commutateur Réseau Durci OT & Sonde IDS de Cybersécurité Industrielle",
        nameEn: 'Hardened Industrial OT Network Switch & Cyber-Physical IDS Probe',
        voltage: '24–48 V DC / 110–220 V DC Redondé',
        roleFr: "Segmentation réseau en zones et conduits per IEC 62443, inspection temps réel des trames GOOSE/MMS, blocage des attaques MITM et télésurveillance sécurisée des IED de protection.",
        roleEn: 'Substation network segmentation per IEC 62443, real-time DPI inspection of GOOSE/MMS frames, MITM attack suppression, and secure encrypted telemetry aggregation.',
        symbol: 'SW-OT-IDS',
        standard: 'IEC 62443-4-2, IEEE 1613, IEC 61850-3',
        imgUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-drone-radiometric',
        nameFr: "Drone d'Inspection Aérienne Autonome avec Caméra Radiométrique Infrarouge",
        nameEn: 'Autonomous Grid Inspection Drone with Radiometric Thermal Camera',
        voltage: 'Batterie LiPo Haute Capacité 24 V (Autonomie 45 min)',
        roleFr: "Thermographie infrarouge automatisée des lignes HTB 225 kV et des parcs photovoltaïques, géolocalisation RTK centimétrique et détection par vision IA des points chauds sur pinces et isolateurs.",
        roleEn: 'Autonomous thermal infrared corridor surveys along 225 kV lines and utility-scale PV farms, centimetric RTK positioning, and edge AI detection of conductor splice hot-spots.',
        symbol: 'UAV-IR',
        standard: 'IEC 62446-3, ISO 18434-1, NF C 13-100',
        imgUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'transmission-line'
      },
      {
        id: 'eq-exp-edge-ai-gateway',
        nameFr: "Passerelle Calculatrice Edge AI Durcie pour Poste Électrique Intelligente",
        nameEn: 'Ruggedized Industrial Edge AI Compute Gateway for Smart Substations',
        voltage: '110–220 V DC / 24 V DC (Fanless Industriel)',
        roleFr: "Exécution locale de modèles neuronaux légers (ONNX/TensorRT) pour le filtrage prédictif des alarmes SCADA, l'analyse vibratoire FFT des turbines et le calcul temps réel des taux de vieillissement thermique.",
        roleEn: 'Local execution of optimized neural models (ONNX/TensorRT) performing SCADA alarm flood filtering, turbine FFT vibration diagnostics, and real-time asset degradation calculations.',
        symbol: 'EDGE-AI',
        standard: 'IEC 61850-3, IEEE 1613, NIST AI RMF',
        imgUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      },
      {
        id: 'eq-exp-ami-concentrator',
        nameFr: "Concentrateur de Données de Comptage Intelligent & Détection de Fraude (DCU AMI)",
        nameEn: 'Smart Metering Data Concentrator Unit (DCU) & Anti-Tamper Analyzer',
        voltage: '230 V AC / 400 V Triphasé (Boîtier MT/BT)',
        roleFr: "Agrégation des télé-relèves de compteurs basse tension par courant porteur CPL G3 / cellulaire 4G, calcul en continu du bilan énergétique du transformateur de distribution et détection immédiate des dérivations pirates.",
        roleEn: 'Low-voltage smart meter data aggregation over G3-PLC and cellular 4G, executing continuous MV/LV substation energy balance reconciliation and automated illegal tap detection.',
        symbol: 'DCU-AMI',
        standard: 'IEC 62056 (DLMS/COSEM), ITU-T G.9903 (G3-PLC), STS Standard',
        imgUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
        calcTab: 'power'
      }
    ],
    sectionD: [
      {
        phase: 'Phase 1',
        titleFr: 'Identification des Enjeux Métier, Cartographie des Données & Maturité IA',
        titleEn: 'Business Use-Case Framing, Data Discovery & AI Readiness Assessment',
        descFr: "Définition des cas d'usage prioritaires (maintenance prédictive transformateurs, amortissement d'oscillations WAMS, réduction pertes non-techniques), inventaire des sources de données et évaluation per NIST AI RMF.",
        descEn: 'Prioritizing high-impact utility use cases (transformer predictive health, WAMS inter-area oscillation damping, non-technical loss reduction), data asset mapping, and readiness assessment per NIST AI RMF.'
      },
      {
        phase: 'Phase 2',
        titleFr: 'Instrumentation Capteurs Haute Fréquence, Synchronisation PTP & Réseau OT',
        titleEn: 'High-Frequency Sensor Deployment, Precision PTP Timing & OT Field Network',
        descFr: "Installation des capteurs DGA photoacoustiques, des PMU en poste HTB, des sondes vibratoires accélérométriques et des récepteurs GNSS IEEE 1588 PTP garantissant l'horodatage sub-microseconde.",
        descEn: 'Deploying photoacoustic DGA monitors, substation PMUs, piezoelectric accelerometers, and GPS IEEE 1588 PTP timing receivers ensuring sub-microsecond synchronization.'
      },
      {
        phase: 'Phase 3',
        titleFr: 'Nettoyage des Données, Étiquetage Expert & Ingestion dans le Data Lake',
        titleEn: 'Data Cleaning, Expert Failure Tagging & Data Lake Ingestion',
        descFr: "Filtrage des artéfacts de mesure, traitement des valeurs manquantes, étiquetage normatif des historiques d'avaries (rapports d'expertise Eneo/SONATREL) et ingestion temps réel via Apache Kafka.",
        descEn: 'Telemetry outlier filtering, missing value imputation, expert annotation of historical power grid failure archives (Eneo/SONATREL trip reports), and real-time stream ingestion via Apache Kafka.'
      },
      {
        phase: 'Phase 4',
        titleFr: 'Conception & Entraînement des Modèles Hybrides Physique-IA (PINN / Time Series)',
        titleEn: 'Physics-Informed Model Architecture, Training & Loss Function Formulation',
        descFr: "Développement des architectures neuronales PINN intégrant les équations différentielles thermiques CEI 60076-7 et les lois de Kirchhoff, entraînement supervisé et régularisation physique.",
        descEn: 'Developing Physics-Informed Neural Networks (PINN) embedding IEC 60076-7 thermal differential equations and Kirchhoff nodal laws directly into gradient loss functions, preventing unphysical predictions.'
      },
      {
        phase: 'Phase 5',
        titleFr: 'Validation Croisée sur Événements Historiques Réels (Trips Song Loulou, Îlotage RIN)',
        titleEn: 'Backtesting & Validation on Historical Grid Incidents (Song Loulou Trips, RIN Islanding)',
        descFr: "Évaluation rigoureuse des modèles sur des incidents majeurs archivés (déclenchement ligne Song Loulou 225 kV, îlotage du réseau Nord) pour quantifier la précision, le temps de réponse et la robustesse.",
        descEn: 'Rigorous offline backtesting against documented major grid disturbance records (Song Loulou 225 kV circuit trips, RIN northern grid blackout) verifying sub-second alert speed and zero ungrounded trips.'
      },
      {
        phase: 'Phase 6',
        titleFr: 'Déploiement Conteneurisé Edge / Cloud & Interfaçage SCADA / EMS Temps Réel',
        titleEn: 'Containerized Edge/Cloud Deployment & SCADA/EMS Real-Time Integration',
        descFr: "Déploiement des microservices conteneurisés Docker/Kubernetes sur passerelles durcies de poste et serveurs centraux EMS, avec échange sécurisé des télémesures via CEI 60870-5-104 et MQTT/TLS.",
        descEn: 'Deploying containerized Docker microservices onto substation edge hardware and national dispatch EMS centers, streaming telemetry over encrypted IEC 60870-5-104 and MQTT/TLS protocols.'
      },
      {
        phase: 'Phase 7',
        titleFr: 'Surveillance de la Dérive des Modèles (Model Drift), Réapprentissage & MLOps',
        titleEn: 'Continuous Model Drift Monitoring, Retraining Pipelines & MLOps Governance',
        descFr: "Suivi continu des métriques de précision (RMSE, F1-Score), détection de dérive conceptuelle liée aux changements saisonniers de charge ou d'hydrologie, et pipelines automatisés de réentraînement sécurisé.",
        descEn: 'Tracking real-time model accuracy metrics (RMSE, F1-Score), detecting concept drift driven by seasonal hydrological or load pattern shifts, and managing automated retraining CI/CD pipelines.'
      }
    ],
    sectionE: [
      {
        id: 'pinn_load_flow_loss',
        tabLabelFr: '1. Écoulement de Puissance PINN',
        tabLabelEn: '1. PINN Power Flow Loss',
        titleFr: "Écoulement de Puissance Nodal Régularisé par Réseau de Neurones Informé par la Physique (PINN)",
        titleEn: 'Physics-Informed Neural Network (PINN) AC Power Flow Loss Function',
        descFr: "Modélisation de l'écoulement de puissance alternatif (AC Load Flow) par un réseau de neurones profond dont la fonction d'apprentissage pénalise directement la violation des équations de bilan de puissance de Kirchhoff à chaque nœud.",
        descEn: 'Deep neural network AC load flow solver whose loss function penalizes violations of Kirchhoff nodal active and reactive power balance equations, ensuring physically consistent solutions without matrix inversions.',
        formula: '\\mathcal{L}_{\\text{PINN}} = \\mathcal{L}_{\\text{data}} + \\lambda_P \\sum_{i=1}^N \\left| P_i - V_i \\sum_{j=1}^N V_j (G_{ij} \\cos\\theta_{ij} + B_{ij} \\sin\\theta_{ij}) \\right|^2 + \\lambda_Q \\sum_{i=1}^N \\left| Q_i - V_i \\sum_{j=1}^N V_j (G_{ij} \\sin\\theta_{ij} - B_{ij} \\cos\\theta_{ij}) \\right|^2',
        formulaDescFr: "Où L_data est l'erreur quadratique sur les données d'entraînement observées, V_i et θ_i les modules et angles de tension aux nœuds, G_ij et B_ij les éléments de conductance et susceptance de la matrice d'admittance nodale [Y_bus], et λ_P, λ_Q les hyperparamètres de pondération physique.",
        formulaDescEn: 'Where L_data is MSE error against supervisory measurements, V_i and θ_i are nodal voltage magnitudes and phase angles, G_ij and B_ij are conductance and susceptance elements from nodal admittance matrix [Y_bus], and λ_P, λ_Q are physical regularization weights.',
        assumptionsFr: [
          'Régime sinusoïdal établi équilibré triphasé à 50 Hz.',
          'Matrice d\'admittance nodale [Y_bus] connue et issue du modèle topologique de réseau.',
          'Pénalisation physique garantissant des tensions nodales strictes entre 0.90 et 1.05 Un.'
        ],
        assumptionsEn: [
          'Balanced three-phase steady-state sinusoidal operation at 50 Hz.',
          'Nodal admittance matrix [Y_bus] accurately derived from topological substation line models.',
          'Physical penalty enforcing voltage magnitude boundaries strictly within 0.90 to 1.05 Un.'
        ],
        calcTab: 'power'
      },
      {
        id: 'wams_rocof_swing_equation',
        tabLabelFr: '2. Stabilité WAMS & RoCoF',
        tabLabelEn: '2. WAMS Dynamic RoCoF',
        titleFr: "Calcul de Stabilité Angulaire WAMS et Taux Initial de Variation de Fréquence (RoCoF)",
        titleEn: 'WAMS Wide-Area Angular Stability & Initial Rate of Change of Frequency (RoCoF)',
        descFr: "Calcul instantané du RoCoF par les synchrophaseurs PMU dès la perte d'un groupe de production ou le déclenchement d'une ligne d'interconnexion, permettant d'évaluer la puissance active déficitaire et d'ordonner un délestage d'urgence.",
        descEn: 'Instantaneous synchrophasor RoCoF computation upon loss of a generation unit or intertie tripping, directly quantifying missing active power deficit and coordinating fast under-frequency load shedding.',
        formula: '\\text{RoCoF} = \\left. \\frac{df}{dt} \\right|_{t=0^+} = \\frac{f_0}{2 H} \\cdot \\frac{\\Delta P}{S_n} \\quad \\implies \\quad \\Delta P = \\frac{2 H S_n}{f_0} \\cdot \\left| \\frac{df}{dt} \\right|_{t=0^+}',
        formulaDescFr: "Où RoCoF est la dérivée temporelle de la fréquence à l'instant initial (Hz/s), f_0 la fréquence nominale (50 Hz), H la constante d'inertie équivalente du système (secondes, typiquement 3.5 à 5.0 s), S_n la puissance apparente nominale des générateurs en ligne (MVA), et ΔP le déficit de puissance active provoqué par la perte (MW).",
        formulaDescEn: 'Where RoCoF is initial frequency slope (Hz/s), f_0 is nominal frequency (50 Hz), H is equivalent system inertia constant (seconds, typically 3.5 to 5.0 s), S_n is total rating of connected synchronous generators (MVA), and ΔP is active power deficit (MW).',
        assumptionsFr: [
          'Pente initiale mesurée sur une fenêtre glissante normalisée IEEE C37.118 de 100 à 500 ms.',
          'Inertie équivalente du réseau interconnecté RIS : H = 4.2 s (valeur calibrée centrale Song Loulou + Nachtigal).',
          'Seuil de déclenchement des automatismes de délestage d\'urgence d\'îlotage : |RoCoF| ≥ 1.0 Hz/s.'
        ],
        assumptionsEn: [
          'Initial slope evaluated across standardized IEEE C37.118 sliding window of 100 to 500 ms.',
          'Equivalent Southern Interconnected Grid (RIS) inertia: H = 4.2 s (Song Loulou + Nachtigal fleet).',
          'Fast remedial load shedding trigger threshold: |RoCoF| ≥ 1.0 Hz/s.'
        ],
        calcTab: 'transmission-line'
      },
      {
        id: 'dga_duval_triangle_coordinates',
        tabLabelFr: '3. Coordonnées Duval DGA',
        tabLabelEn: '3. Duval Triangle DGA',
        titleFr: "Calcul des Coordonnées Triangulaires de Duval pour Diagnostic DGA (CEI 60599 / IEEE C57.104)",
        titleEn: 'Duval Triangle 1 Relative Gas Concentration Coordinates for DGA Diagnostics (IEC 60599)',
        descFr: "Conversion des concentrations absolues de gaz dissous dans l'huile mesurées en parties par million (ppm) en coordonnées barycentriques relatives de méthane (%CH4), éthylène (%C2H4) et acétylène (%C2H2) pour classifier le type de défaut diélectrique.",
        descEn: 'Converts absolute dissolved gas concentrations from ppm into relative barycentric percentages of methane (%CH4), ethylene (%C2H4), and acetylene (%C2H2), classifying transformer fault type (PD, D1, D2, T1, T2, T3).',
        formula: '\\%CH_4 = \\frac{[CH_4]}{S_{\\text{DGA}}} \\cdot 100, \\quad \\%C_2H_4 = \\frac{[C_2H_4]}{S_{\\text{DGA}}} \\cdot 100, \\quad \\%C_2H_2 = \\frac{[C_2H_2]}{S_{\\text{DGA}}} \\cdot 100 \\quad \\text{avec} \\quad S_{\\text{DGA}} = [CH_4] + [C_2H_4] + [C_2H_2]',
        formulaDescFr: "Où [CH_4], [C_2H_4], [C_2H_2] sont les teneurs en ppm mesurées par l'analyseur DGA, et S_DGA la somme des trois hydrocarbures clés de Duval 1. Les coordonnées obtenues définissent les zones : Décharges partielles (PD), Décharges de faible énergie (D1), Décharges de haute énergie / Arc (D2), et Défauts thermiques (T1, T2, T3).",
        formulaDescEn: 'Where [CH_4], [C_2H_4], [C_2H_2] are ppm concentrations measured by the DGA monitor, and S_DGA is sum of key gases. The resulting coordinates map into standard Duval zones: Partial Discharge (PD), Low-Energy Discharge (D1), High-Energy Arcing (D2), and Thermal Faults (T1, T2, T3).',
        assumptionsFr: [
          'Seuil de significativité minimale de la somme des gaz : S_DGA ≥ 10 ppm pour éviter les faux positifs.',
          'Classification des défauts conforme au guide CEI 60599 et IEEE C57.104.',
          'Zones Duval 1 : Arc franc D2 si %C2H2 ≥ 13% et %C2H4 ≥ 23% ; Défaut thermique T3 si %C2H4 ≥ 50%.'
        ],
        assumptionsEn: [
          'Minimum gas sum significance threshold: S_DGA ≥ 10 ppm to prevent false ambient gas triggers.',
          'Fault zone definitions compliant with IEC 60599 and IEEE C57.104 benchmarks.',
          'Duval 1 criteria: High-energy arc D2 if %C2H2 ≥ 13% and %C2H4 ≥ 23%; Thermal fault T3 if %C2H4 ≥ 50%.'
        ],
        calcTab: 'transformer'
      },
      {
        id: 'transformer_thermal_aging_ode',
        tabLabelFr: '4. Vieillissement Thermique CEI',
        tabLabelEn: '4. Thermal Aging IEC 60076-7',
        titleFr: "Modèle Thermique Différentiel du Point Chaud & Taux de Vieillissement Relatif (CEI 60076-7)",
        titleEn: 'Differential Hot-Spot Temperature Model & Relative Aging Rate (IEC 60076-7)',
        descFr: "Calcul continu du vieillissement thermique accéléré du papier isolant en cellulose par rapport au taux de référence unitaire à 110°C selon l'équation d'Arrhenius normalisée par la CEI 60076-7.",
        descEn: 'Continuous calculation of accelerated cellulose insulation thermal aging relative to reference unit rate at 110°C per the Arrhenius relationship formulated in IEC 60076-7 loading guide.',
        formula: 'V_{\\text{rel}} = 2^{(\\theta_h - 110) / 6}, \\quad L_{\\text{perte}} = \\int_0^T V_{\\text{rel}}(t) \\, dt, \\quad \\text{RUL}_{\\text{années}} = \\frac{L_{\\text{nominal}} - L_{\\text{consommé}}}{V_{\\text{rel\\_moyen}} \\cdot 8760}',
        formulaDescFr: "Où V_rel est le taux de vieillissement relatif (sans dimension, V_rel = 1 à 110°C, V_rel = 2 à 116°C), θ_h la température instantanée du point chaud des enroulements (°C), L_perte la durée de vie thermique consommée en heures équivalentes, et RUL la durée de vie restante estimée de l'actif (années).",
        formulaDescEn: 'Where V_rel is relative thermal aging rate (dimensionless, V_rel = 1 at 110°C, doubling every 6°C), θ_h is hot-spot temperature (°C), L_perte is consumed life in equivalent hours, and RUL is estimated Remaining Useful Life in years.',
        assumptionsFr: [
          'Papier cellulosique standard non thermiquement amélioré : doublement du vieillissement tous les 6°C (règle des 6°C).',
          'Durée de vie théorique nominale de référence d\'un transformateur HTB : L_nominal = 180 000 heures (environ 20.5 ans continus à 110°C).',
          'Facteur de sécurité d\'exploitation : alerte de dégradation accélérée déclenchée dès que V_rel > 4.0 (soit θ_h > 122°C).'
        ],
        assumptionsEn: [
          'Standard non-thermally upgraded kraft paper: aging rate doubles for every 6°C temperature rise above 110°C.',
          'Nominal design life of primary EHV transformer: L_nominal = 180,000 hours (~20.5 continuous years at 110°C).',
          'Accelerated operational alert threshold: flagged whenever V_rel > 4.0 (corresponding to θ_h > 122°C).'
        ],
        calcTab: 'transformer'
      },
      {
        id: 'solar_forecasting_rmse_eval',
        tabLabelFr: '5. Prévision Solaire & RMSE',
        tabLabelEn: '5. Solar Forecast & RMSE',
        titleFr: "Évaluation de la Précision des Prévisions de Production Solaire / Éolienne (IEC 61724-1)",
        titleEn: 'Solar & Wind Generation Forecast Error Metric & RMSE Normalization (IEC 61724-1)',
        descFr: "Formulation statistique de l'Erreur Quadratique Moyenne Normalisée (nRMSE) quantifiant la précision des algorithmes de prévision d'irradiation et de production photovoltaïque par rapport à la puissance crête installée.",
        descEn: 'Statistical formulation of Normalized Root Mean Square Error (nRMSE) measuring accuracy of solar irradiance and PV power forecasts against installed peak capacity.',
        formula: '\\text{RMSE} = \\sqrt{\\frac{1}{N} \\sum_{k=1}^N \\left( \\hat{P}_k - P_k \\right)^2}, \\quad \\text{nRMSE}\\% = \\frac{\\text{RMSE}}{P_{\\text{crête}}} \\cdot 100, \\quad \\text{MAE} = \\frac{1}{N} \\sum_{k=1}^N \\left| \\hat{P}_k - P_k \\right|',
        formulaDescFr: "Où P_k est la puissance réelle injectée au point d'échantillonnage k (MW), P̂_k la prévision issue du modèle neuronale (MW), N le nombre total de pas de temps sur l'horizon évalué, et P_crête la puissance crête installée du parc (ex. 15 MWc pour Maroua).",
        formulaDescEn: 'Where P_k is actual grid-injected power at timestep k (MW), P̂_k is neural model prediction (MW), N is total evaluation steps, and P_crête is total plant installed capacity (e.g. 15 MWp for Maroua solar park).',
        assumptionsFr: [
          'Pas de temps d\'évaluation normalisé : 15 minutes pour le dispatching infrajournalier et 1 heure pour le J-1.',
          'Critère d\'acceptabilité de l\'opérateur de réseau SONATREL : nRMSE ≤ 6.0% sur horizon infrajournalier (H+1 à H+4).',
          'Pénalité financière de déséquilibre évitée grâce au pilotage tampon de la batterie BESS.'
        ],
        assumptionsEn: [
          'Standardized evaluation timestep: 15 minutes for intraday redispatch and 1 hour for day-ahead scheduling.',
          'Grid code compliance benchmark per SONATREL rules: nRMSE ≤ 6.0% over intraday horizon (H+1 to H+4).',
          'Financial imbalance penalties eliminated via automated buffering from co-located BESS battery.'
        ],
        calcTab: 'power'
      },
      {
        id: 'isolation_forest_anomaly_score',
        tabLabelFr: '6. Fraude AMI & Score Isolement',
        tabLabelEn: '6. AMI Tamper Isolation Score',
        titleFr: "Score d'Anomalie Multivarié par Forêts d'Isolement pour Pertes Non-Techniques AMI",
        titleEn: 'Multivariate Isolation Forest Anomaly Score for AMI Non-Technical Losses',
        descFr: "Algorithme d'apprentissage automatique non supervisé évaluant la profondeur moyenne d'isolement d'un point de mesure dans un ensemble d'arbres de décision pour détecter les anomalies de comptage et fraudes électriques.",
        descEn: 'Unsupervised machine learning anomaly algorithm evaluating average path length across ensemble isolation trees to flag non-technical losses and electrical metering bypasses.',
        formula: 's(x, n) = 2^{-\\frac{\\mathbb{E}(h(x))}{c(n)}} \\quad \\text{avec} \\quad c(n) = 2 \\left( \\ln(n - 1) + 0.5772156649 \\right) - \\frac{2(n - 1)}{n}',
        formulaDescFr: "Où s(x, n) est le score d'anomalie compris entre 0 et 1, h(x) le nombre de fractionnements requis pour isoler l'échantillon x dans un arbre, E(h(x)) la profondeur moyenne d'isolement sur la forêt d'arbres, n la taille du jeu d'échantillonnage, et c(n) la longueur moyenne de parcours d'un arbre binaire de recherche non réussi.",
        formulaDescEn: 'Where s(x, n) is anomaly score between 0 and 1, h(x) is path length isolating sample x, E(h(x)) is expected path length over isolation trees, n is sample size, and c(n) is average path length of unsuccessful search in Binary Search Tree.',
        assumptionsFr: [
          'Score d\'anomalie s(x, n) > 0.65 : très forte probabilité d\'intervention frauduleuse ou de défaillance de mesure.',
          'Score d\'anomalie s(x, n) < 0.50 : profil de consommation considéré comme normal et conforme.',
          'Vecteur d\'entrée multidimensionnel combinant puissance active, facteur de puissance et ratio jour/nuit.'
        ],
        assumptionsEn: [
          'Anomaly score s(x, n) > 0.65: high probability of meter bypass, fraud, or instrument transformer failure.',
          'Anomaly score s(x, n) < 0.50: consumption pattern considered normal and non-fraudulent.',
          'Multivariate input vector combining active power, power factor, and daytime/nighttime consumption ratio.'
        ],
        calcTab: 'power'
      }
    ],
    sectionF: [
      {
        code: 'IEEE Std C37.118.1 / C37.118.2',
        tag: 'SYNCHROPHASEURS & WAMS',
        titleFr: 'Norme pour les Mesures de Synchrophaseurs dans les Réseaux Électriques de Puissance',
        titleEn: 'Standard for Synchrophasor Measurements and Data Transfer for Power Systems',
        descFr: 'Définit les classes de mesure M (mesure) et P (protection), les critères d\'erreur vectorielle totale (TVE < 1%) et les protocoles de transmission temps réel vers les concentrateurs PDC.',
        descEn: 'Specifies M and P class compliance, Total Vector Error limits (TVE < 1%), and real-time streaming protocols transmitting synchronized voltage/current phasors to wide-area PDC servers.'
      },
      {
        code: 'CEI 60076-7 / IEEE C57.91',
        tag: 'MODÉLISATION THERMIQUE',
        titleFr: 'Transformateurs de Puissance — Guide de Charge pour Transformateurs Immergés dans l\'Huile',
        titleEn: 'Power Transformers — Loading Guide for Mineral-Oil-Immersed Power Transformers',
        descFr: 'Équations différentielles de calcul de la température de l\'huile supérieure, de l\'échauffement du point chaud des enroulements et calcul du vieillissement thermique relatif de l\'isolant.',
        descEn: 'Differential equations for top-oil and winding hot-spot temperature rise calculation, and cumulative thermal loss-of-life estimation for mineral oil transformers.'
      },
      {
        code: 'CEI 60599 / IEEE C57.104',
        tag: 'DIAGNOSTIC DGA',
        titleFr: 'Matériels Électriques Imprégnés d\'Huile — Guide pour l\'Interprétation des Gaz Dissous',
        titleEn: 'Mineral Oil-Filled Electrical Equipment — Guide for the Interpretation of Dissolved Gases Analysis (DGA)',
        descFr: 'Méthodes de diagnostic des gaz dissous : Triangle de Duval 1/4/5, méthode des rapports de Rogers et seuils de concentration TDCG pour la détection précoce des décharges et arcs.',
        descEn: 'Standard interpretation guidelines for dissolved gases: Duval Triangles 1/4/5, Rogers ratios, and TDCG concentration levels identifying partial discharges, sparking, and thermal faults.'
      },
      {
        code: 'CEI 62443 / MITRE ATT&CK ICS',
        tag: 'CYBERSÉCURITÉ OT',
        titleFr: 'Sécurité des Réseaux et des Systèmes Industriels d\'Automatisation et de Commande',
        titleEn: 'Security for Industrial Automation and Control Systems (IACS) & MITRE ICS Threat Matrix',
        descFr: 'Règles de cybersécurité pour les postes électriques et dispatchings : zones et conduits, authentification, détection d\'intrusions réseau DPI et résistance aux attaques ciblées.',
        descEn: 'Cybersecurity standards for digital substations and SCADA networks: zone-conduit partitioning, cryptographic authentication, DPI intrusion monitoring, and attack resistance.'
      },
      {
        code: 'ISO 10816-3 / ISO 20816-2',
        tag: 'SURVEILLANCE VIBRATOIRE',
        titleFr: 'Vibrations Mécaniques — Évaluation des Vibrations des Machines Industrielles par Mesures sur Parties Non-Tournantes',
        titleEn: 'Mechanical Vibration — Evaluation of Machine Vibration on Non-Rotating Parts',
        descFr: 'Définit les zones d\'admissibilité vibratoire A (neuf), B (bon), C (alerte) et D (danger/arrêt d\'urgence) pour les groupes turbo-alternateurs hydroélectriques et moteurs industriels.',
        descEn: 'Defines vibration severity zones A (new), B (good), C (alarm), and D (trip danger) for hydraulic turbines, generators, and heavy industrial drives based on RMS velocity.'
      },
      {
        code: 'IEC 61724-1 / IEEE Std 2800-2022',
        tag: 'PRÉVISION & INTÉGRATION RENOUVELABLE',
        titleFr: 'Performance des Installations Photovoltaïques & Interconnexion Réseau des Onduleurs',
        titleEn: 'Photovoltaic System Performance Monitoring & Grid Interconnection of Inverter-Based Resources',
        descFr: 'Prescriptions pour la mesure de l\'irradiation, calcul du Performance Ratio (PR), métriques d\'évaluation des prévisions de puissance et maintien du profil de tension/fréquence.',
        descEn: 'Standards for irradiance monitoring, Performance Ratio (PR) calculation, forecast error evaluation, and active/reactive ride-through support from inverter-based resources.'
      }
    ]
  }
};

