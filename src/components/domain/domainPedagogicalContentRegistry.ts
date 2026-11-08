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

