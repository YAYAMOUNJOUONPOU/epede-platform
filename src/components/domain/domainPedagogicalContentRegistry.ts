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
  }
};

