// src/data/epedeDocumentationRegistry.ts
// EPEDE Master Files & Technical Documentation Registry
// Adheres strictly to Section 3 (Definition of Files) and Section 4 (Structured Specifications)

import type { EpedeDocumentRecord } from '../types/filesAndDocs';

export const EPEDE_DOCUMENTATION_REGISTRY: EpedeDocumentRecord[] = [
  // -------------------------------------------------------------------------------------------------
  // D01: Energy Resources & Generation
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D01-HYDRO-SPEC-001',
    documentNumber: 'EPEDE-D01-SPEC-ALT-01',
    title_fr: 'Spécification Technique d\'Ingénierie · Alternateur Hydroélectrique Synchrone 48 MVA',
    title_en: 'Engineering Technical Specification · 48 MVA Synchronous Hydrogenerator',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D01',
    subdomainCode: 'D01.01',
    systemCode: 'SYS-GEN-SYNCHRONOUS',
    primaryEquipmentId: 'node-gen-g1',
    relatedEquipmentIds: ['node-gen-g1', 'eq-trafo-gsu-01'],
    relatedComponentNames_fr: ['Rotor à pôles saillants', 'Bobinage statorique Roebel', 'Excitation statique', 'Paliers guides'],
    relatedComponentNames_en: ['Salient pole rotor', 'Roebel bar stator winding', 'Static excitation system', 'Guide bearings'],
    revision: 'Rev C',
    version: '2.1.0',
    status: 'CURRENT',
    date: '2024-03-15',
    source: 'SONATREL / Eneo Generation Asset Reference & IEC 60034-1',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief Electrical Machines & Hydro-Plant Specialist',
    relatedProjectContext: {
      fr: 'Aménagement hydroélectrique de Songloulou (8 x 48 MVA) et Nachtigal (7 x 60 MW)',
      en: 'Songloulou Hydroelectric Plant (8 x 48 MVA) and Nachtigal Plant (7 x 60 MW)'
    },
    relatedStandards: ['IEC 60034-1', 'IEC 60034-3', 'IEEE Std 115', 'IEEE Std 421.5'],
    summary_fr: 'Spécification technique régissant la conception électromécanique, les échauffements limites de classe F/B, l\'isolation statorique VPI mica-résine, l\'impédance subtransitoire X"d et la régulation d\'excitation.',
    summary_en: 'Technical specification governing electromechanical design, Class F/B temperature rise limits, VPI mica-resin stator insulation, subtransient reactance X"d, and excitation control.',
    tableOfContents_fr: [
      '1. Domaine d\'Application & Conditions du Site',
      '2. Grandeurs Électriques Assignées (Puissance, Tension, cos phi)',
      '3. Caractéristiques Mécaniques, Rotor & Vitesse d\'Emballement',
      '4. Système d\'Isolation, Échauffement & Refroidissement Air/Eau',
      '5. Système d\'Excitation & Régulateur Numérique AVR',
      '6. Essais en Usine (FAT) & Essais de Réception sur Site (SAT)',
      '7. Instrumentation, Thermocouples Pt100 & Surveillance Vibratoire'
    ],
    tableOfContents_en: [
      '1. Scope & Ambient Site Conditions',
      '2. Rated Electrical Parameters (Apparent Power, Voltage, PF)',
      '3. Mechanical Construction, Rotor & Runaway Speed Withstand',
      '4. Insulation System, Temperature Rise & Air/Water Heat Exchangers',
      '5. Excitation System & Digital Automatic Voltage Regulator (AVR)',
      '6. Factory Acceptance Tests (FAT) & Site Commissioning Tests (SAT)',
      '7. Embedded Instrumentation, Pt100 RTDs & Vibration Monitoring'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Grandeurs Électriques Assignées',
        title_en: 'Rated Electrical Ratings',
        parameters: [
          { key: 'rated_apparent_power', label_fr: 'Puissance Apparente Assignée', label_en: 'Rated Apparent Power', value: '48.0', unit: 'MVA', status: 'VERIFIED' },
          { key: 'rated_active_power', label_fr: 'Puissance Active Nominale', label_en: 'Rated Active Power', value: '40.8', unit: 'MW', status: 'VERIFIED' },
          { key: 'rated_voltage', label_fr: 'Tension Nominale Stator', label_en: 'Stator Rated Voltage', value: '10.5', unit: 'kV', status: 'VERIFIED' },
          { key: 'power_factor', label_fr: 'Facteur de Puissance (cos phi)', label_en: 'Rated Power Factor', value: '0.85 (inductif)', status: 'VERIFIED' },
          { key: 'rated_frequency', label_fr: 'Fréquence Assignée', label_en: 'Rated Frequency', value: '50.0', unit: 'Hz', status: 'VERIFIED' },
          { key: 'subtransient_reactance', label_fr: 'Réactance Subtransitoire X"d', label_en: 'Subtransient Reactance X"d', value: '0.22', unit: 'p.u.', status: 'VERIFIED' }
        ]
      },
      {
        category: 'MECHANICAL',
        title_fr: 'Paramètres Mécaniques & Dynamiques',
        title_en: 'Mechanical & Dynamic Parameters',
        parameters: [
          { key: 'rated_speed', label_fr: 'Vitesse de Rotation Nominale', label_en: 'Rated Synchronous Speed', value: '150', unit: 'tr/min (rpm)', status: 'VERIFIED' },
          { key: 'runaway_speed', label_fr: 'Vitesse d\'Emballement Maximale', label_en: 'Maximum Runaway Speed', value: '295', unit: 'tr/min (rpm)', status: 'VERIFIED' },
          { key: 'rotor_inertia_constant', label_fr: 'Constante d\'Inertie H', label_en: 'Inertia Constant H', value: '3.85', unit: 's', status: 'VERIFIED' }
        ]
      },
      {
        category: 'PROTECTION',
        title_fr: 'Fonctions de Protection Associées',
        title_en: 'Associated Protection Functions',
        parameters: [
          { key: 'generator_diff', label_fr: 'Différentielle Alternateur (87G)', label_en: 'Generator Differential (87G)', value: 'Pente 15% · Déclenchement Instantané', status: 'VERIFIED' },
          { key: 'stator_earth_fault', label_fr: 'Masse Stator 100% (64G / 59N)', label_en: '100% Stator Earth Fault (64G / 59N)', value: 'Injection 20 Hz ou 3ème harmonique', status: 'VERIFIED' },
          { key: 'loss_of_excitation', label_fr: 'Perte d\'Excitation (40)', label_en: 'Loss of Field (40)', value: 'Caractéristique Mho à 2 zones R-X', status: 'VERIFIED' }
        ]
      },
      {
        category: 'THERMAL',
        title_fr: 'Thermique & Refroidissement',
        title_en: 'Thermal & Cooling',
        parameters: [
          { key: 'insulation_class', label_fr: 'Classe d\'Isolation Thermique', label_en: 'Thermal Insulation Class', value: 'Classe F (Échauffement limité Classe B)', status: 'VERIFIED' },
          { key: 'cooling_type', label_fr: 'Mode de Refroidissement', label_en: 'Cooling Method', value: 'Circuit fermé Air/Eau (IC81W / CACW)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D02: Power System Architecture & Grid Planning
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D02-PLANNING-001',
    documentNumber: 'EPEDE-D02-CRIT-N1-01',
    title_fr: 'Note de Conception Réseau · Critères de Sécurité N-1 & Stabilité Dynamique',
    title_en: 'Network Design Guide · N-1 Security Criteria & Dynamic Stability Assessment',
    documentType: 'ENGINEERING_REFERENCE',
    domainCode: 'D02',
    subdomainCode: 'D02.01',
    systemCode: 'SYS-GRID-DISPATCH-MODEL',
    relatedEquipmentIds: ['node-line-225-bekoko', 'node-trafo-main-30'],
    relatedComponentNames_fr: ['Corridors d\'interconnexion 225 kV', 'Groupes hydroélectriques de réglage', 'Automates de délestage UFLS'],
    relatedComponentNames_en: ['225 kV transmission corridors', 'Regulating hydro generators', 'UFLS load shedding schemes'],
    revision: 'Rev B',
    version: '1.4.0',
    status: 'CURRENT',
    date: '2023-11-20',
    source: 'SONATREL Transmission System Operator Planning Framework',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'System Planning & Dynamic Studies Director',
    relatedProjectContext: {
      fr: 'Plan Directeur de Transport Électrique (Horizon 2035) et Interconnexion RIS-RIN',
      en: 'Transmission Grid Master Plan (Horizon 2035) and RIS-RIN Interconnection'
    },
    relatedStandards: ['IEC 60909-0', 'IEEE Std 399', 'ENTSO-E Operational Security Network Code'],
    summary_fr: 'Méthodologie formelle régissant l\'évaluation de la sécurité N-1 en régime permanent et transitoire. Définit les temps critiques d\'élimination des défauts (CCT > 120 ms) et les marges de stabilité en tension.',
    summary_en: 'Formal methodology governing steady-state and transient N-1 security evaluation. Defines critical clearing times (CCT > 120 ms) and voltage stability margins.',
    tableOfContents_fr: [
      '1. Principes Fondamentaux de la Sécurité N-1',
      '2. Modélisation Statique & Écoulement de Puissance Newton-Raphson',
      '3. Critère de Perte du Plus Gros Groupe de Production (N-G1)',
      '4. Déclenchement Tripolaire de Ligne de Transport 225 kV (N-L1)',
      '5. Stabilité Transitoire & Équation d\'Oscillation du Rotor',
      '6. Plan de Défense Fréquence & Automatisme de Délestage (ANSI 81L)'
    ],
    tableOfContents_en: [
      '1. Core Principles of N-1 Security Assessment',
      '2. Steady-State Power Flow Modeling with Newton-Raphson',
      '3. Largest Generation Unit Outage Criterion (N-G1)',
      '4. 225 kV Line Three-Phase Trip Contingency (N-L1)',
      '5. Transient Stability & Rotor Swing Equation Analysis',
      '6. System Defense Plan & Under-Frequency Load Shedding (ANSI 81L)'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Critères de Performance Réseau',
        title_en: 'Grid Performance Criteria',
        parameters: [
          { key: 'voltage_tolerance_steady', label_fr: 'Plage de Tension Admissible (Régime Normal)', label_en: 'Permissible Voltage Band (Normal)', value: '0.95 à 1.05', unit: 'p.u. (214 - 236 kV)', status: 'VERIFIED' },
          { key: 'voltage_tolerance_contingency', label_fr: 'Plage de Tension en Contingence N-1', label_en: 'Contingency N-1 Voltage Band', value: '0.90 à 1.10', unit: 'p.u. (202 - 247 kV)', status: 'VERIFIED' },
          { key: 'frequency_nominal', label_fr: 'Fréquence Nominale du Système', label_en: 'Nominal System Frequency', value: '50.00', unit: 'Hz (±0.2 Hz normal)', status: 'VERIFIED' },
          { key: 'cct_critical_clearing', label_fr: 'Temps Critique d\'Élimination de Défaut (CCT)', label_en: 'Critical Clearing Time (CCT)', value: '120', unit: 'ms', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D03: Transmission Networks
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D03-LINE-SPEC-001',
    documentNumber: 'EPEDE-D03-SPEC-OHL-225-01',
    title_fr: 'Cahier des Charges Techniques · Ligne Aérienne 225 kV Simple/Double Terne (Conducteur Aster 570)',
    title_en: 'Technical Specification · 225 kV Single/Double Circuit Overhead Line (Aster 570 Conductor)',
    documentType: 'CABLE_SPECIFICATION',
    domainCode: 'D03',
    subdomainCode: 'D03.01',
    systemCode: 'SYS-TRANSMISSION-CORRIDOR-225',
    primaryEquipmentId: 'node-line-225-bekoko',
    relatedEquipmentIds: ['node-line-225-bekoko'],
    relatedComponentNames_fr: ['Conducteur Almélec Aster 570', 'Pylônes treillis acier galvanisé', 'Chaînes d\'isolateurs verre trempé', 'Câble de garde OPGW 48 fibres'],
    relatedComponentNames_en: ['Almelec Aster 570 conductor', 'Galvanized steel lattice towers', 'Toughened glass insulator strings', '48-fiber OPGW optical ground wire'],
    revision: 'Rev D',
    version: '3.0.0',
    status: 'CURRENT',
    date: '2024-01-10',
    source: 'SONATREL / CIGRE Green Book on Overhead Lines',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'High Voltage Transmission Lines Senior Engineer',
    relatedProjectContext: {
      fr: 'Corridor d\'évacuation 225 kV Nachtigal - Nyom 2 et artère Bekoko - Oyomabang',
      en: '225 kV Transmission Corridor Nachtigal - Nyom 2 and Bekoko - Oyomabang line'
    },
    relatedStandards: ['IEC 60826', 'IEC 61284', 'IEC 60720', 'IEC 60071-1'],
    summary_fr: 'Spécification technique détaillée des lignes aériennes 225 kV : conducteurs Aster 570 mm², ampacité thermique en climat tropical (40°C), flèche maximale, tenue mécanique des pylônes treillis et protection foudre OPGW.',
    summary_en: 'Detailed technical specification of 225 kV overhead lines: Aster 570 mm² conductors, thermal ampacity under tropical conditions (40°C ambient), maximum sag, lattice tower mechanical loads, and OPGW lightning protection.',
    tableOfContents_fr: [
      '1. Données Climatologiques & Hypothèses Mécaniques',
      '2. Spécification des Conducteurs Aster 570 & Câbles de Garde OPGW',
      '3. Pylônes Treillis (Alignement, Angle, Ancrage, Arrêt)',
      '4. Chaînes d\'Isolateurs & Lignes de Fuite en Milieu Forestier/Côtier',
      '5. Calculs de Flèche, Portée Équivalente & Distances au Sol',
      '6. Mise à la Terre des Pylônes & Protection Contre les Coups de Foudre'
    ],
    tableOfContents_en: [
      '1. Climatological Data & Mechanical Design Assumptions',
      '2. Aster 570 Conductors & OPGW Ground Wire Specifications',
      '3. Lattice Steel Towers (Suspension, Angle, Tension, Terminal)',
      '4. Insulator Strings & Creepage Distance in Tropical/Coastal Environments',
      '5. Sag & Tension Calculations, Ruling Span, and Ground Clearances',
      '6. Tower Footing Earthing & Lightning Flashover Mitigation'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Paramètres Électriques & Ampacité',
        title_en: 'Electrical Ratings & Ampacity',
        parameters: [
          { key: 'voltage_nominal', label_fr: 'Tension Nominale d\'Exploitation', label_en: 'Nominal Operating Voltage', value: '225', unit: 'kV', status: 'VERIFIED' },
          { key: 'voltage_highest', label_fr: 'Tension Maximale Permanente', label_en: 'Highest Continuous Voltage', value: '245', unit: 'kV', status: 'VERIFIED' },
          { key: 'thermal_ampacity', label_fr: 'Ampacité Thermique Continue (40°C ambiant)', label_en: 'Continuous Thermal Ampacity (40°C ambient)', value: '890', unit: 'A (347 MVA)', status: 'VERIFIED' },
          { key: 'sil_natural_power', label_fr: 'Puissance Naturelle (SIL)', label_en: 'Surge Impedance Loading (SIL)', value: '135', unit: 'MW', status: 'VERIFIED' },
          { key: 'surge_impedance', label_fr: 'Impédance Caractéristique Zc', label_en: 'Surge Impedance Zc', value: '375', unit: 'Ω', status: 'VERIFIED' }
        ]
      },
      {
        category: 'MECHANICAL',
        title_fr: 'Conducteur & Flèches',
        title_en: 'Conductor & Sag Characteristics',
        parameters: [
          { key: 'conductor_cross_section', label_fr: 'Section Métallique Conducteur', label_en: 'Conductor Cross-Section Area', value: '570', unit: 'mm² (Aster 570)', status: 'VERIFIED' },
          { key: 'ultimate_tensile_strength', label_fr: 'Charge de Rupture Minimale (UTS)', label_en: 'Ultimate Tensile Strength (UTS)', value: '172', unit: 'kN', status: 'VERIFIED' },
          { key: 'max_operating_temp', label_fr: 'Température Maximale du Conducteur', label_en: 'Maximum Conductor Temperature', value: '75', unit: '°C (Régime continu)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D04: Substations & Grid Nodes
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D04-TRAFO-SPEC-001',
    documentNumber: 'EPEDE-D04-SPEC-TR-225-30-01',
    title_fr: 'Spécification Technique · Transformateur de Puissance 225/30 kV - 63 MVA ONAF avec Réglage en Charge',
    title_en: 'Technical Specification · 63 MVA 225/30 kV ONAF Power Transformer with On-Load Tap Changer',
    documentType: 'TRANSFORMER_SPECIFICATION',
    domainCode: 'D04',
    subdomainCode: 'D04.02',
    systemCode: 'SYS-STEP-DOWN-225-30',
    primaryEquipmentId: 'node-trafo-main-30',
    relatedEquipmentIds: ['node-trafo-main-30', 'eq-trafo-gsu-01'],
    relatedComponentNames_fr: ['Cuve principale et conservateur à membrane', 'Traversées porcelaine/condensateur RIP', 'Régleur en charge OLTC sous vide', 'Radiateurs ONAF avec aéroréfrigérants', 'Relais Buchholz & soupape de surpression'],
    relatedComponentNames_en: ['Main tank & membrane conservator', 'RIP condenser bushings', 'Vacuum on-load tap changer (OLTC)', 'ONAF cooling radiators with forced fans', 'Buchholz relay & pressure relief valve'],
    revision: 'Rev E',
    version: '2.5.0',
    status: 'CURRENT',
    date: '2024-02-28',
    source: 'Eneo / SONATREL Grid Substation Engineering Standard & IEC 60076',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief Power Transformer Specialist & Grid Asset Manager',
    relatedProjectContext: {
      fr: 'Poste d\'interconnexion 225/30 kV d\'Oyomabang (Yaoundé) et Mangombé (Edéa)',
      en: 'Oyomabang 225/30 kV Substation (Yaoundé) and Mangombé Substation (Edéa)'
    },
    relatedStandards: ['IEC 60076-1', 'IEC 60076-2', 'IEC 60076-3', 'IEC 60076-5', 'IEEE Std C57.12.00'],
    summary_fr: 'Spécification exhaustive du transformateur abaisseur principal 225/30 kV de 63 MVA : couplage YNd11, impédance de court-circuit Ucc = 12%, régleur en charge sous vide ±9x1.25%, tenue aux courts-circuits et instrumentation de diagnostic en ligne.',
    summary_en: 'Comprehensive engineering specification for the primary 63 MVA 225/30 kV step-down transformer: YNd11 vector group, short-circuit impedance Ucc = 12%, ±9x1.25% vacuum OLTC, short-circuit withstand, and online diagnostic sensors.',
    tableOfContents_fr: [
      '1. Caractéristiques Générales & Données Assignées',
      '2. Système Magnétique (Tôles à Grains Orientés Hi-B) & Enroulements Cuivre',
      '3. Régleur en Charge (OLTC) & Système de Télécommande Automatique AVR',
      '4. Système de Refroidissement ONAN/ONAF & Échauffements Limites',
      '5. Huile Minérale Diélectrique Inhibée (CEI 60296) & Conservateur',
      '6. Traversées Haute Tension RIP (CEI 60137) & Transformateurs de Courant Intégrés',
      '7. Accessoires de Sécurité (Buchholz, Détecteur d\'Émission de Gaz, Clapet de Surpression)',
      '8. Essais en Usine de Type, Individuels & Spéciaux (CEI 60076)'
    ],
    tableOfContents_en: [
      '1. General Characteristics & Rated Parameters',
      '2. Core Lamination (Hi-B Grain-Oriented Steel) & Copper Windings',
      '3. On-Load Tap Changer (OLTC) & Automatic Voltage Regulation (AVR)',
      '4. ONAN/ONAF Cooling Bank & Temperature Rise Guarantees',
      '5. Inhibited Mineral Insulating Oil (IEC 60296) & Preservation System',
      '6. RIP High-Voltage Bushings (IEC 60137) & Bushing Current Transformers',
      '7. Safety Accessories (Buchholz, Sudden Pressure Relay, Pressure Relief Device)',
      '8. Factory Routine, Type, and Special Acceptance Testing (IEC 60076)'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Grandeurs Assignées & Impédance',
        title_en: 'Rated Electrical Ratings & Impedance',
        parameters: [
          { key: 'rated_power_onaf', label_fr: 'Puissance Nominale ONAF', label_en: 'Rated Power (ONAF)', value: '63.0', unit: 'MVA', status: 'VERIFIED' },
          { key: 'rated_power_onan', label_fr: 'Puissance Nominale ONAN', label_en: 'Rated Power (ONAN)', value: '50.0', unit: 'MVA', status: 'VERIFIED' },
          { key: 'primary_voltage', label_fr: 'Tension Nominale Primaire (HV)', label_en: 'Primary Rated Voltage (HV)', value: '225', unit: 'kV (Prise centrale)', status: 'VERIFIED' },
          { key: 'secondary_voltage', label_fr: 'Tension Nominale Secondaire (LV)', label_en: 'Secondary Rated Voltage (LV)', value: '30.0', unit: 'kV', status: 'VERIFIED' },
          { key: 'vector_group', label_fr: 'Groupe de Couplage', label_en: 'Vector Group', value: 'YNd11', status: 'VERIFIED' },
          { key: 'short_circuit_impedance', label_fr: 'Tension de Court-Circuit Ucc', label_en: 'Short-Circuit Impedance Ucc', value: '12.0', unit: '%', status: 'VERIFIED' },
          { key: 'tap_changer_range', label_fr: 'Plage de Réglage en Charge (OLTC)', label_en: 'Tap Changer Regulation Range', value: '±9 x 1.25%', unit: 'steps', status: 'VERIFIED' }
        ]
      },
      {
        category: 'THERMAL',
        title_fr: 'Garanties d\'Échauffement & Refroidissement',
        title_en: 'Temperature Rise Guarantees & Cooling',
        parameters: [
          { key: 'oil_temp_rise', label_fr: 'Échauffement Maximal de l\'Huile', label_en: 'Top Oil Temperature Rise', value: '55', unit: 'K (au-dessus de 40°C ambiant)', status: 'VERIFIED' },
          { key: 'winding_temp_rise', label_fr: 'Échauffement Moyen des Enroulements', label_en: 'Average Winding Temperature Rise', value: '60', unit: 'K', status: 'VERIFIED' },
          { key: 'hot_spot_temp', label_fr: 'Point Chaud Maximal Admissible', label_en: 'Maximum Hot-Spot Temperature', value: '73', unit: 'K', status: 'VERIFIED' }
        ]
      },
      {
        category: 'PROTECTION',
        title_fr: 'Dispositifs de Protection Associés',
        title_en: 'Associated Protection Relays & Accessories',
        parameters: [
          { key: 'differential_protection', label_fr: 'Différentielle Transformateur (87T)', label_en: 'Transformer Differential (87T)', value: 'Protection numérique stabilisée avec retenue harmonique 2 & 5', status: 'VERIFIED' },
          { key: 'overcurrent_backup', label_fr: 'Maximum de Courant HT/BT (50/51 & 51N)', label_en: 'HV/LV Time-Overcurrent Backup', value: 'Courbe temporisée IEC NI avec blocage sélectif', status: 'VERIFIED' },
          { key: 'tank_leakage_protection', label_fr: 'Protection Masse-Cuve (64R)', label_en: 'Restricted Earth Fault / Tank Earth (64R)', value: 'Détection instantanée défaut amorçage interne', status: 'VERIFIED' }
        ]
      }
    ]
  },
  {
    id: 'DOC-D04-CB-SPEC-001',
    documentNumber: 'EPEDE-D04-SPEC-CB-225-01',
    title_fr: 'Spécification Technique · Disjoncteur Haute Tension SF6 245 kV - 3150 A - 40 kA Tripolaire',
    title_en: 'Technical Specification · 245 kV 3150 A 40 kA Three-Pole SF6 Live-Tank Circuit Breaker',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D04',
    subdomainCode: 'D04.03',
    systemCode: 'SYS-HV-SWITCHGEAR-225',
    primaryEquipmentId: 'eq-cb-sf6-225-01',
    relatedEquipmentIds: ['eq-cb-sf6-225-01'],
    relatedComponentNames_fr: ['Chambre de coupure à autosoufflage SF6', 'Commande mécanique à ressort à réarmement motorisé', 'Pressostat de densité SF6 à deux seuils', 'Bobines de déclenchement doublées (110 V CC)'],
    relatedComponentNames_en: ['SF6 self-blast interrupter chamber', 'Spring-operating mechanism with motorized charging', 'Dual-threshold SF6 gas density monitor', 'Dual trip coils (110 V DC)'],
    revision: 'Rev C',
    version: '1.8.0',
    status: 'CURRENT',
    date: '2023-12-05',
    source: 'Eneo / SONATREL Substation Standards & IEC 62271-100',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'HV Primary Switchgear Lead Engineer',
    relatedProjectContext: {
      fr: 'Travées lignes et transformateurs des postes 225 kV de Nyom 2, Bekoko et Mangombé',
      en: '225 kV Line and Transformer Bays at Nyom 2, Bekoko, and Mangombé Substations'
    },
    relatedStandards: ['IEC 62271-100', 'IEC 62271-1', 'IEEE Std C37.04', 'IEC 60376'],
    summary_fr: 'Spécification technique régissant les disjoncteurs ouverts 245 kV SF6 : pouvoir de coupure assigné en court-circuit 40 kA, cycle de manœuvre O - 0.3s - CO - 3min - CO, double bobine de déclenchement et surveillance de gaz SF6.',
    summary_en: 'Technical specification governing 245 kV SF6 live-tank circuit breakers: rated short-circuit breaking capacity 40 kA, rated operating sequence O - 0.3s - CO - 3min - CO, dual trip coils, and temperature-compensated SF6 monitoring.',
    tableOfContents_fr: [
      '1. Conditions Générales d\'Exploitation & Normes de Référence',
      '2. Caractéristiques Électriques Assignées (Tension, Courant, Pouvoir de Coupure)',
      '3. Cycle de Fonctionnement Assigné & Manœuvres Rapides',
      '4. Mécanisme de Commande à Accumulation d\'Énergie par Ressort',
      '5. Circuits de Commande, Bobines d\'Ouverture/Fermeture & Alimentation 110 V CC',
      '6. Compartiment SF6, Remplissage & Surveillance de Densité Pressostatique',
      '7. Essais de Type & Essais Individuels de Série (CEI 62271-100)'
    ],
    tableOfContents_en: [
      '1. General Operating Conditions & Governing Reference Standards',
      '2. Rated Electrical Characteristics (Voltage, Continuous Current, Breaking Capacity)',
      '3. Rated Operating Duty Cycle & Rapid Auto-Reclosing',
      '4. Spring-Operated Stored-Energy Operating Mechanism',
      '5. Control Circuits, Dual Tripping/Closing Coils & 110 V DC Auxiliaries',
      '6. SF6 Gas Compartment, Filling Tolerances & Temperature-Compensated Density Monitoring',
      '7. Type Testing & Routine Manufacturing Acceptance Tests (IEC 62271-100)'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Pouvoirs de Coupure & Tensions',
        title_en: 'Breaking Capacities & Rated Voltages',
        parameters: [
          { key: 'rated_voltage', label_fr: 'Tension Nominale Assignée', label_en: 'Rated Nominal Voltage', value: '245', unit: 'kV', status: 'VERIFIED' },
          { key: 'rated_current', label_fr: 'Courant Continu Assigné', label_en: 'Rated Continuous Current', value: '3150', unit: 'A', status: 'VERIFIED' },
          { key: 'breaking_capacity', label_fr: 'Pouvoir de Coupure en Court-Circuit Icu', label_en: 'Rated Short-Circuit Breaking Current', value: '40.0', unit: 'kA (valeur efficace symétrique)', status: 'VERIFIED' },
          { key: 'making_capacity_peak', label_fr: 'Pouvoir de Fermeture en Court-Circuit Ip', label_en: 'Rated Short-Circuit Making Current Ip', value: '100.0', unit: 'kA crête (peak)', status: 'VERIFIED' },
          { key: 'duty_cycle', label_fr: 'Séquence de Manœuvre Assignée', label_en: 'Rated Operating Duty Cycle', value: 'O - 0.3s - CO - 3min - CO', status: 'VERIFIED' },
          { key: 'break_time', label_fr: 'Durée Totale de Coupure Maximale', label_en: 'Maximum Break Time', value: '40', unit: 'ms (2 cycles à 50 Hz)', status: 'VERIFIED' }
        ]
      },
      {
        category: 'CONTROL',
        title_fr: 'Contrôle-Commande & Auxiliaires',
        title_en: 'Control & Auxiliary Power',
        parameters: [
          { key: 'control_voltage', label_fr: 'Tension de Commande & Déclenchement', label_en: 'Control & Tripping Voltage', value: '110', unit: 'V CC (DC)', status: 'VERIFIED' },
          { key: 'trip_coils', label_fr: 'Nombre de Bobines de Déclenchement', label_en: 'Number of Trip Coils', value: '2 (Bobines indépendantes surveillées ANSI 74TC)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D05: Distribution Networks
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D05-RMU-SPEC-001',
    documentNumber: 'EPEDE-D05-SPEC-RMU-30-01',
    title_fr: 'Spécification Technique · Tableau Modulaire HTA Compact RMU 36 kV (Configuration 2L+1P)',
    title_en: 'Technical Specification · 36 kV Compact Gas-Insulated Ring Main Unit (2L+1P Configuration)',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D05',
    subdomainCode: 'D05.02',
    systemCode: 'SYS-DISTRIBUTION-RMU-30',
    primaryEquipmentId: 'eq-rmu-hta-01',
    relatedEquipmentIds: ['eq-rmu-hta-01', 'eq-trafo-hta-01'],
    relatedComponentNames_fr: ['Cuve inox soudée au laser remplie de SF6', 'Interrupteurs-sectionneurs de ligne 630 A', 'Combiné disjoncteur/fusible protection transformateur 200 A', 'Sectionneurs de terre de sécurité à fermeture brusque', 'Détecteurs communicants de passage de défaut FPI'],
    relatedComponentNames_en: ['Laser-welded stainless steel SF6 tank', '630 A load-break line switches', '200 A transformer protection circuit breaker/fuse', 'Snap-action safety earthing switches', 'Communicating fault passage indicators (FPI)'],
    revision: 'Rev C',
    version: '2.0.0',
    status: 'CURRENT',
    date: '2023-10-15',
    source: 'Eneo Cameroon Distribution Engineering Guideline & IEC 62271-200',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Medium Voltage Distribution Network Specialist',
    relatedProjectContext: {
      fr: 'Boucles urbaines HTA 30 kV de Douala (Bonanjo, Akwa) et Yaoundé (Centre-ville)',
      en: 'Urban 30 kV Distribution Underground Rings in Douala and Yaoundé Commercial Districts'
    },
    relatedStandards: ['IEC 62271-200', 'IEC 62271-102', 'IEC 62271-103', 'IEC 62271-105'],
    summary_fr: 'Spécification technique régissant les unités compactes RMU 36 kV pour postes de distribution cabine/kiosque : tenue à l\'arc interne IAC AFLR 20 kA 1s, indice de protection IP67 pour la cuve haute tension et motorisation 24 V CC pour télécommande FLISR.',
    summary_en: 'Technical specification governing 36 kV compact Ring Main Units for indoor/kiosk distribution substations: internal arc classification IAC AFLR 20 kA 1s, IP67 sealed high-voltage tank, and 24 V DC motorization for FLISR telecontrol.',
    tableOfContents_fr: [
      '1. Architecture Générale & Sécurité d\'Exploitation',
      '2. Données Électriques Assignées (Tension 36 kV, Courants Assignés 630 A / 200 A)',
      '3. Tenue aux Courts-Circuits & Classification d\'Arc Interne IAC AFLR',
      '4. Mécanismes de Manœuvre, Motorisation Télécommandée & Verrouillages à Clé',
      '5. Raccordement des Câbles HTA par Prises Équerres Débrochables (Type C)',
      '6. Détection de Défauts Communicante (FPI) & Interface RTU Téléconduite'
    ],
    tableOfContents_en: [
      '1. General Architecture & Operational Safety Philosophy',
      '2. Rated Electrical Ratings (36 kV Rated Voltage, 630 A / 200 A Continuous)',
      '3. Short-Circuit Withstand & Internal Arc Classification IAC AFLR',
      '4. Operating Mechanisms, Motorized Telecontrol & Key Interlocks',
      '5. MV Cable Termination via Separable Elbow Connectors (Interface C)',
      '6. Communicating Fault Passage Indicators (FPI) & Telecontrol RTU Interface'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Caractéristiques Électriques HTA',
        title_en: 'MV Electrical Characteristics',
        parameters: [
          { key: 'rated_voltage', label_fr: 'Tension Nominale Assignée', label_en: 'Rated Maximum Voltage', value: '36.0', unit: 'kV', status: 'VERIFIED' },
          { key: 'rated_current_feeders', label_fr: 'Courant Assigné Départs Ligne', label_en: 'Rated Line Feeder Current', value: '630', unit: 'A', status: 'VERIFIED' },
          { key: 'rated_current_trafo', label_fr: 'Courant Assigné Protection Transformateur', label_en: 'Rated Transformer Feeder Current', value: '200', unit: 'A', status: 'VERIFIED' },
          { key: 'short_circuit_withstand', label_fr: 'Courant Admissible de Courte Durée', label_en: 'Rated Short-Time Withstand Current', value: '20.0', unit: 'kA (1 seconde)', status: 'VERIFIED' },
          { key: 'impulse_withstand', label_fr: 'Tension de Tenue aux Chocs de Foudre (BIL)', label_en: 'Lightning Impulse Withstand (BIL)', value: '170', unit: 'kV crête', status: 'VERIFIED' }
        ]
      },
      {
        category: 'SAFETY',
        title_fr: 'Sécurité des Opérateurs & Arc Interne',
        title_en: 'Personnel Safety & Internal Arc',
        parameters: [
          { key: 'internal_arc_class', label_fr: 'Classification Arc Interne (IAC)', label_en: 'Internal Arc Classification (IAC)', value: 'IAC AFLR 20 kA 1s', status: 'VERIFIED' },
          { key: 'ip_rating_tank', label_fr: 'Indice de Protection Cuve Active', label_en: 'Sealed Tank Ingress Protection', value: 'IP67 (Submersible / Étanche poussière)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D06: Electrical Installations & Utilization
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D06-TGBT-SPEC-001',
    documentNumber: 'EPEDE-D06-SPEC-TGBT-400-01',
    title_fr: 'Spécification Technique d\'Armoire · Tableau Général Basse Tension (TGBT) Forme 4b - 3200 A - 65 kA',
    title_en: 'Engineering Switchboard Specification · Main LV Switchboard (TGBT) Form 4b 3200 A 65 kA',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D06',
    subdomainCode: 'D06.01',
    systemCode: 'SYS-MAIN-LV-DISTRIBUTION',
    primaryEquipmentId: 'node-tgbt-400',
    relatedEquipmentIds: ['node-tgbt-400'],
    relatedComponentNames_fr: ['Disjoncteur ouvert d\'arrivée ACB débrochable 3200 A', 'Jeu de barres principal cuivre électrolytique étamé', 'Forme de séparation 4b avec cloisons métalliques', 'Inverseur de source Normal/Secours (ATS)', 'Centrale de mesure d\'énergie communicante Modbus/TCP'],
    relatedComponentNames_en: ['Drawout 3200 A ACB incoming circuit breaker', 'Tinned electrolytic copper main busbar trunk', 'Form 4b internal segregation with metallic barriers', 'Automatic Transfer Switch (ATS) Normal/Emergency', 'Modbus/TCP communicating power quality meter'],
    revision: 'Rev C',
    version: '2.2.0',
    status: 'CURRENT',
    date: '2024-02-14',
    source: 'CIBSE Guide K & IEC 61439-1 / IEC 61439-2',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief Electrical Building Services & Industrial LV Engineer',
    relatedProjectContext: {
      fr: 'Alimentation principale TGBT de complexes hospitaliers, centres de données et sièges tertiaires',
      en: 'Main LV Distribution Switchboard for Critical Hospitals, Data Centers, and Commercial Towers'
    },
    relatedStandards: ['IEC 61439-1', 'IEC 61439-2', 'IEC 60364-4-41', 'IEC 60364-5-52', 'NF C 15-100'],
    summary_fr: 'Spécification complète pour ensembles d\'appareillage BT de série CEI 61439-2 : courant assigné 3200 A, tenue aux courts-circuits Icw = 65 kA 1s, forme de séparation 4b garantissant l\'intervention en sécurité sur les départs, et coordination sélective totale.',
    summary_en: 'Comprehensive engineering specification for certified LV switchgear assemblies per IEC 61439-2: 3200 A rated current, short-circuit withstand Icw = 65 kA 1s, Form 4b internal separation ensuring safe live servicing, and full selectivity coordination.',
    tableOfContents_fr: [
      '1. Objet & Conformité aux Normes CEI 61439-1/2',
      '2. Caractéristiques Électriques Assignées (In = 3200 A, Icw = 65 kA)',
      '3. Forme de Séparation Interne (Forme 4b selon Annexe D)',
      '4. Enveloppe Métallique, Degré de Protection IP42/IK08 & Ventilation',
      '5. Dimensionnement du Jeu de Barres Cuivre & Calcul d\'Échauffement',
      '6. Déclencheurs Électroniques Micrologique & Sélectivité Chronométrique/Énergétique',
      '7. Inverseur de Source Normal/Secours (ATS) & Automatisme de Démarrage Groupe'
    ],
    tableOfContents_en: [
      '1. Scope & Compliance with IEC 61439-1 and IEC 61439-2 Standards',
      '2. Rated Electrical Characteristics (In = 3200 A, Icw = 65 kA)',
      '3. Internal Segregation Form (Form 4b per Annex D Requirements)',
      '4. Metallic Enclosure, IP42/IK08 Degree of Protection & Thermal Dissipation',
      '5. Copper Busbar Sizing & Verified Temperature Rise Calculation',
      '6. Electronic Trip Units & Time/Energy Selectivity Coordination',
      '7. Automatic Transfer Switch (ATS) & Emergency Diesel Generator Sequencing'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Grandeurs Électriques Assignées BT',
        title_en: 'Low Voltage Electrical Ratings',
        parameters: [
          { key: 'rated_operational_voltage', label_fr: 'Tension Nominale d\'Emploi (Ue)', label_en: 'Rated Operational Voltage (Ue)', value: '400 / 230', unit: 'V (50 Hz)', status: 'VERIFIED' },
          { key: 'rated_current', label_fr: 'Courant Assigné de l\'Ensemble (InA)', label_en: 'Rated Assembly Current (InA)', value: '3200', unit: 'A', status: 'VERIFIED' },
          { key: 'short_circuit_withstand', label_fr: 'Courant de Courte Durée Admissible (Icw)', label_en: 'Short-Time Withstand Current (Icw)', value: '65.0', unit: 'kA (1 seconde)', status: 'VERIFIED' },
          { key: 'short_circuit_peak', label_fr: 'Courant de Crête Admissible (Ipk)', label_en: 'Rated Peak Withstand Current (Ipk)', value: '143.0', unit: 'kA crête', status: 'VERIFIED' },
          { key: 'neutral_regime', label_fr: 'Schéma de Liaison à la Terre (SLT)', label_en: 'Earthing System Regime', value: 'TN-S ou TNC-S (Neutre et PE séparés)', status: 'VERIFIED' }
        ]
      },
      {
        category: 'MECHANICAL',
        title_fr: 'Enveloppe & Séparation Interne',
        title_en: 'Enclosure & Internal Segregation',
        parameters: [
          { key: 'form_of_separation', label_fr: 'Forme de Séparation Interne', label_en: 'Form of Internal Separation', value: 'Forme 4b (Jeux de barres, unités et bornes séparés)', status: 'VERIFIED' },
          { key: 'ip_rating', label_fr: 'Indice de Protection Enveloppe', label_en: 'Ingress Protection (IP)', value: 'IP42 (Porte fermée) / IP20 (Porte ouverte)', status: 'VERIFIED' },
          { key: 'ik_impact_rating', label_fr: 'Tenue aux Impacts Mécaniques (IK)', label_en: 'Mechanical Impact Resistance (IK)', value: 'IK08', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D07: Automation & Control Systems
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D07-PLC-SPEC-001',
    documentNumber: 'EPEDE-D07-SPEC-PLC-01',
    title_fr: 'Spécification Système · Automate Programmable Industriel (API/PLC) Redondant & Bus Décentralisés',
    title_en: 'System Specification · Redundant Industrial Programmable Logic Controller (PLC) & Remote I/O',
    documentType: 'CONFIGURATION_DOCUMENT',
    domainCode: 'D07',
    subdomainCode: 'D07.01',
    systemCode: 'SYS-INDUSTRIAL-PLC-REDUNDANT',
    relatedEquipmentIds: ['eq-plc-cpu-01'],
    relatedComponentNames_fr: ['Double processeur CPU redondant synchrone', 'Réseau d\'E/S déportées Profinet/EtherNet-IP en anneau MRP', 'Alimentation secourue 24 V CC redondante', 'Modules d\'entrées analogiques 4-20 mA galvaniquement isolés'],
    relatedComponentNames_en: ['Dual synchronous redundant CPU controllers', 'Remote I/O racks on Profinet/EtherNet-IP MRP ring', 'Dual redundant 24 V DC power supplies', 'Galvanically isolated 4-20 mA analog input cards'],
    revision: 'Rev B',
    version: '1.5.0',
    status: 'CURRENT',
    date: '2023-11-30',
    source: 'ISA-88 / IEC 61131-3 Industrial Automation Engineering Framework',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Senior Control Systems & Instrumentation Lead',
    relatedProjectContext: {
      fr: 'Contrôle-commande procédé de stations de pompage d\'eau, usines de traitement et auxiliaires de centrale',
      en: 'Process Control Architecture for Water Pumping Plants, Treatment Facilities, and Thermal BOP'
    },
    relatedStandards: ['IEC 61131-3', 'IEC 61158', 'IEC 62443-4-2', 'ISA-101'],
    summary_fr: 'Spécification technique régissant les automates industriels tolérants aux pannes : basculement CPU sans à-coup (< 20 ms), programmation selon CEI 61131-3 (ST, FBD, SFC), isolation 1500 V et cybersécurité native IEC 62443.',
    summary_en: 'Technical specification governing fault-tolerant industrial PLCs: bumpless CPU hot-standby switchover (< 20 ms), IEC 61131-3 programming (ST, FBD, SFC), 1500 V galvanic isolation, and native IEC 62443 security hardening.',
    tableOfContents_fr: [
      '1. Architecture Matérielle & Redondance Sans À-Coup (Hot-Standby)',
      '2. Performances Processeur, Temps de Cycle & Mémoire',
      '3. Cartes d\'Entrées/Sorties Décentralisées & Réseau Anneau MRP',
      '4. Langages de Programmation Normalisés CEI 61131-3',
      '5. Interfaces Homme-Machine (IHM) & Ergonomie Haute Performance ISA-101',
      '6. Sécurité Fonctionnelle SIL2/SIL3 & Cybersécurité CEI 62443'
    ],
    tableOfContents_en: [
      '1. Hardware Architecture & Bumpless Hot-Standby Redundancy',
      '2. CPU Performance, Scan Cycle Determinism & Memory Allocation',
      '3. Remote Distributed I/O Modules & Fault-Tolerant MRP Ring',
      '4. Standard Programming Languages per IEC 61131-3',
      '5. Human-Machine Interface (HMI) & High-Performance ISA-101 Graphics',
      '6. Functional Safety SIL2/SIL3 Integration & IEC 62443 Hardening'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'CONTROL',
        title_fr: 'Performances Logiques & Automatismes',
        title_en: 'Logic Execution & Automation Performance',
        parameters: [
          { key: 'cycle_time', label_fr: 'Temps de Cycle Déterministe', label_en: 'Deterministic Scan Time', value: '< 10', unit: 'ms (pour 10k instructions)', status: 'VERIFIED' },
          { key: 'failover_time', label_fr: 'Temps de Basculement Redondant', label_en: 'Hot-Standby Switchover Time', value: '< 20', unit: 'ms (sans perte de commande)', status: 'VERIFIED' },
          { key: 'programming_languages', label_fr: 'Langages de Programmation Supportés', label_en: 'Supported Programming Languages', value: 'ST (Texte Structuré), FBD (Blocs), SFC (Grafcet)', status: 'VERIFIED' }
        ]
      },
      {
        category: 'COMMUNICATION',
        title_fr: 'Réseaux & Protocoles Industriels',
        title_en: 'Industrial Networks & Protocols',
        parameters: [
          { key: 'fieldbus_protocols', label_fr: 'Protocoles de Bus de Terrain', label_en: 'Supported Fieldbus Protocols', value: 'Profinet RT/IRT, EtherNet/IP, Modbus TCP, OPC UA', status: 'VERIFIED' },
          { key: 'redundancy_protocol', label_fr: 'Protocole de Redondance Réseau', label_en: 'Network Redundancy Protocol', value: 'MRP (Media Redundancy Protocol, recovery < 50 ms)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D08: Extra Low Voltage & Special Systems
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D08-ELV-SPEC-001',
    documentNumber: 'EPEDE-D08-SPEC-CCTV-01',
    title_fr: 'Spécification Technique · Système de Vidéosurveillance IP (CCTV) & Sécurité Électronique Périmétrique',
    title_en: 'Technical Specification · High-Definition IP Video Surveillance (CCTV) & Perimeter Security',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D08',
    subdomainCode: 'D08.02',
    systemCode: 'SYS-ELV-CCTV-SURVEILLANCE',
    relatedEquipmentIds: ['eq-cctv-cam-01'],
    relatedComponentNames_fr: ['Caméras dôme/bullet IP 4K étanches IP67/IK10', 'Enregistreurs NVR en grappe redondante RAID 6', 'Commutateurs PoE+ 802.3at managés', 'Capteurs de franchissement infrarouge actif'],
    relatedComponentNames_en: ['4K IP dome/bullet cameras with IP67/IK10 ratings', 'Enterprise NVR video storage in RAID 6 array', 'Managed PoE+ 802.3at network switches', 'Active infrared perimeter intrusion beams'],
    revision: 'Rev B',
    version: '1.2.0',
    status: 'CURRENT',
    date: '2023-09-18',
    source: 'ONVIF Profile S/G/T & EN 62676 Video Surveillance Standard',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Security & ELV Infrastructure Senior Specialist',
    relatedProjectContext: {
      fr: 'Protection périmétrique et surveillance des postes haute tension 225 kV et centrales hydroélectriques',
      en: 'Perimeter Security and Video Monitoring for Critical 225 kV Substations and Hydroelectric Dams'
    },
    relatedStandards: ['IEC 62676-1-1', 'IEC 62676-4', 'ONVIF Profile S/G/T', 'ISO/IEC 11801'],
    summary_fr: 'Spécification des systèmes de vidéosurveillance critique : caméras haute sensibilité nocturne DarkFighter/Starlight, compression H.265+, stockage 30 jours continu en RAID 6 et intégration avec le contrôle d\'accès.',
    summary_en: 'Specification for critical IP video surveillance: ultra-low-light DarkFighter/Starlight sensors, H.265+ encoding, 30-day continuous RAID 6 retention, and physical access control integration.',
    tableOfContents_fr: [
      '1. Objectifs de Sécurité & Zonage DORI (Détecter, Observer, Reconnaître, Identifier)',
      '2. Spécifications des Caméras IP & Optiques Varifocales Motorisées',
      '3. Réseau de Transport Dédié & Commutateurs PoE+ Durcis pour Poste',
      '4. Architecture d\'Enregistrement NVR, Stockage RAID 6 & Bande Passante',
      '5. Analyse Vidéo Intelligente (VCA) & Franchissement de Ligne Virtuelle',
      '6. Alimentation Secourue par Onduleur ASI/UPS & Protection Foudre'
    ],
    tableOfContents_en: [
      '1. Security Philosophy & DORI Operational Requirements',
      '2. IP Camera Specifications & Motorized Varifocal Optics',
      '3. Dedicated CCTV Ethernet Backbone & Substation-Hardened PoE+ Switches',
      '4. Enterprise NVR Recording Architecture, RAID 6 Storage & Throughput',
      '5. Intelligent Video Analytics (VCA) & Virtual Tripwire Detection',
      '6. UPS Backup Power Autonomy & Surge Protection Devices'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Alimentation & Puissance PoE',
        title_en: 'Power Supply & PoE Delivery',
        parameters: [
          { key: 'poe_standard', label_fr: 'Alimentation par Câble Réseau (PoE)', label_en: 'Power over Ethernet Standard', value: 'IEEE 802.3at (PoE+ jusqu\'à 30W par port)', status: 'VERIFIED' },
          { key: 'ups_autonomy', label_fr: 'Autonomie Secourue sur Onduleur', label_en: 'UPS Battery Backup Autonomy', value: '2.0', unit: 'Heures (Hours)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D09: Artificial Intelligence & Advanced Technologies
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D09-AI-SPEC-001',
    documentNumber: 'EPEDE-D09-SPEC-AAS-01',
    title_fr: 'Cadre d\'Architecture · Jumeau Numérique Industriel & Coquille d\'Administration AAS (CEI 63278)',
    title_en: 'Architecture Framework · Industrial Digital Twin & Asset Administration Shell (IEC 63278)',
    documentType: 'ENGINEERING_REFERENCE',
    domainCode: 'D09',
    subdomainCode: 'D09.02',
    systemCode: 'SYS-DIGITAL-TWIN-AAS',
    relatedEquipmentIds: ['node-trafo-main-30', 'node-gen-g1'],
    relatedComponentNames_fr: ['Modèle sémantique AAS v3', 'Sous-modèles Nameplate, TechnicalData, OperationalData', 'Connecteur MQTT/Sparkplug B', 'Modèle prédictif de vieillissement d\'isolant'],
    relatedComponentNames_en: ['AAS v3 semantic model', 'Nameplate, TechnicalData, OperationalData submodels', 'MQTT/Sparkplug B gateway', 'Insulation thermal aging machine learning model'],
    revision: 'Rev A',
    version: '1.0.0',
    status: 'CURRENT',
    date: '2024-01-25',
    source: 'Platform Industrie 4.0 / IEC PAS 63278-1 & Cigré WG D2.52',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'AI & Digital Grid Lead Architect',
    relatedProjectContext: {
      fr: 'Déploiement du jumeau numérique prédictif des transformateurs de grande puissance du corridor RIS',
      en: 'Predictive Digital Twin Deployment for Bulk EHV Transformers in the RIS Interconnected Grid'
    },
    relatedStandards: ['IEC 63278-1', 'ISO/IEC 30141', 'IEEE Std 2800', 'IEC 60076-7'],
    summary_fr: 'Cadre d\'ingénierie normalisant l\'encapsulation sémantique des équipements électriques sous format Asset Administration Shell (AAS v3) pour la surveillance prédictive par intelligence artificielle (détection d\'anomalies DGA, fureur thermique et santé d\'actif).',
    summary_en: 'Engineering framework standardizing the semantic representation of high-voltage assets using the Asset Administration Shell (AAS v3) format for AI predictive maintenance (online DGA anomaly detection, thermal aging, and health indexation).',
    tableOfContents_fr: [
      '1. Principes de la Coquille d\'Administration d\'Actif (AAS v3)',
      '2. Sous-Modèles Canoniques : Plaque Signalétique & Propriétés Techniques',
      '3. Télémétrie Temps Réel & Passerelles IoT Sécurisées (MQTT Sparkplug B)',
      '4. Algorithmes d\'Intelligence Artificielle & Détection Précoce de Défaillance (DGA)',
      '5. Calcul de l\'Indice de Santé (Health Index) & Reste à Vivre (RUL)',
      '6. Cybersécurité des Flux de Données & Interopérabilité Cloud/Edge'
    ],
    tableOfContents_en: [
      '1. Core Principles of the Asset Administration Shell (AAS v3)',
      '2. Canonical Submodels: Digital Nameplate & Technical Specifications',
      '3. Real-Time Telemetry Ingestion via Secure Edge Gateways (MQTT Sparkplug B)',
      '4. AI Machine Learning Models for Incipient Fault Detection (DGA Anomaly)',
      '5. Asset Health Index (HI) & Remaining Useful Life (RUL) Estimation',
      '6. Data Flow Cybersecurity & Cloud/Edge Hybrid Interoperability'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'COMMUNICATION',
        title_fr: 'Protocoles de Données du Jumeau Numérique',
        title_en: 'Digital Twin Telemetry Protocols',
        parameters: [
          { key: 'telemetry_protocol', label_fr: 'Protocole d\'Ingestion Temps Réel', label_en: 'Real-Time Ingestion Protocol', value: 'MQTT v5.0 sur TLS 1.3 avec Sparkplug B', status: 'VERIFIED' },
          { key: 'api_standard', label_fr: 'Interface de Requête Sémantique', label_en: 'Semantic Query API', value: 'RESTful OpenAPI v3.0 / GraphQL selon CEI 63278-2', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D10: Energy Storage & Charging
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D10-BESS-SPEC-001',
    documentNumber: 'EPEDE-D10-SPEC-BESS-01',
    title_fr: 'Cahier des Charges · Système de Stockage d\'Énergie par Batteries (BESS) 10 MW / 20 MWh Conteneurisé',
    title_en: 'Technical Specification · 10 MW / 20 MWh Containerized Battery Energy Storage System (BESS)',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D10',
    subdomainCode: 'D10.01',
    systemCode: 'SYS-BESS-UTILITY-STORAGE',
    relatedEquipmentIds: ['eq-bess-container-01', 'eq-exp-bess-container-5mw', 'node-bess-10mwh'],
    relatedComponentNames_fr: ['Modules de cellules Lithium Fer Phosphate (LFP)', 'Système de gestion de batterie (BMS) à 3 niveaux', 'Onduleur bidirectionnel 4 quadrants (PCS)', 'Système d\'extinction incendie Novec 1230 / Aérosol'],
    relatedComponentNames_en: ['Lithium Iron Phosphate (LFP) battery cells', '3-tier Battery Management System (BMS)', 'Bidirectional 4-quadrant Power Conversion System (PCS)', 'Novec 1230 / aerosol clean agent fire suppression'],
    revision: 'Rev B',
    version: '1.4.0',
    status: 'CURRENT',
    date: '2023-12-12',
    source: 'NFPA 855 / IEC 62933 Utility Battery Energy Storage Standard',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Energy Storage & Grid Integration Senior Engineer',
    relatedProjectContext: {
      fr: 'Régulation de fréquence primaire et lissage de production solaire PV pour réseau isolé ou faible',
      en: 'Primary Frequency Response and Solar PV Output Smoothing for Weak or Islanded Grids'
    },
    relatedStandards: ['IEC 62933-1', 'IEC 62933-5-2', 'UL 9540A', 'NFPA 855', 'IEEE Std 2030.2.1'],
    summary_fr: 'Spécification technique régissant les parcs de stockage par batteries raccordés au réseau : technologie LFP sécurisée, temps de réponse en puissance active < 100 ms pour service système, régulation de tension et protection contre l\'emballement thermique.',
    summary_en: 'Technical specification governing grid-tied battery storage systems: safe LFP chemistry, < 100 ms active power response time for frequency regulation, reactive voltage support, and runaway fire mitigation per UL 9540A.',
    tableOfContents_fr: [
      '1. Objectifs Fonctionnels (Arbitrage, Réglage Fréquence, Lissage EnR)',
      '2. Chimie des Cellules (LFP) & Caractéristiques Énergétiques (10 MW / 20 MWh)',
      '3. Système de Gestion de Batterie (BMS) & Équilibrage des Tensions de Cellules',
      '4. Onduleur Bidirectionnel PCS & Modes Grid-Forming / Grid-Following',
      '5. Gestion Thermique (HVAC / Refroidissement Liquide) & Conditions Ambiantes',
      '6. Sécurité Incendie, Détection de Gaz Toxiques (H2, CO) & Essais UL 9540A'
    ],
    tableOfContents_en: [
      '1. Functional Applications (Arbitrage, Frequency Response, Solar Smoothing)',
      '2. Cell Chemistry (LFP) & Energy Storage Ratings (10 MW / 20 MWh, 2h C-rate)',
      '3. Battery Management System (BMS) Architecture & Cell Balancing Logic',
      '4. Bidirectional Power Conversion System (PCS) & Grid-Forming Capabilities',
      '5. Thermal Management (HVAC / Liquid Cooling Loop) & Environmental Ratings',
      '6. Fire Safety, Off-Gas Detection (H2, CO) & UL 9540A Thermal Runaway Testing'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Grandeurs Énergétiques & Puissance',
        title_en: 'Energy Storage & Power Ratings',
        parameters: [
          { key: 'rated_power_active', label_fr: 'Puissance Active Assignée (Éjection/Recharge)', label_en: 'Rated Continuous Power', value: '10.0', unit: 'MW', status: 'VERIFIED' },
          { key: 'usable_energy', label_fr: 'Énergie Utile Assignée', label_en: 'Usable Energy Capacity', value: '20.0', unit: 'MWh (C/2 discharge rate)', status: 'VERIFIED' },
          { key: 'round_trip_efficiency', label_fr: 'Rendement Global de Cycle (RTE)', label_en: 'Round-Trip AC-to-AC Efficiency', value: '> 86.5', unit: '%', status: 'VERIFIED' },
          { key: 'response_time', label_fr: 'Temps de Réponse en Puissance Active', label_en: 'Full-Power Response Time', value: '< 80', unit: 'ms', status: 'VERIFIED' }
        ]
      },
      {
        category: 'SAFETY',
        title_fr: 'Sécurité & Extinction Incendie',
        title_en: 'Safety & Fire Suppression',
        parameters: [
          { key: 'thermal_runaway_test', label_fr: 'Conformité Essai Emballement Thermique', label_en: 'Thermal Runaway Flame Spread', value: 'UL 9540A (Non-propagation au module adjacent)', status: 'VERIFIED' },
          { key: 'fire_suppression_agent', label_fr: 'Agent Extincteur Automatique', label_en: 'Automatic Fire Suppression Agent', value: 'Gaz Inerte Novec 1230 + Rideau d\'eau déluge externe', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D11: Protection, Measurements & System Studies
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D11-RELAY-SPEC-001',
    documentNumber: 'EPEDE-D11-SPEC-PROT-225-01',
    title_fr: 'Spécification Technique & Plan de Réglage · Protection Numérique de Distance Ligne 225 kV (ANSI 21/21N)',
    title_en: 'Technical Specification & Settings Philosophy · 225 kV Line Digital Distance Protection (ANSI 21/21N)',
    documentType: 'PROTECTION_SPECIFICATION',
    domainCode: 'D11',
    subdomainCode: 'D11.01',
    systemCode: 'SYS-LINE-PROTECTION-IED',
    relatedEquipmentIds: ['node-line-225-bekoko'],
    relatedComponentNames_fr: ['Relais de protection multifonction numérique', 'Schéma de téléprotection POTT/PUTT via OPGW', 'Détection de pompage de puissance ANSI 68', 'Réenclencheur automatique monophasé/triphasé ANSI 79'],
    relatedComponentNames_en: ['Numerical multifunction line protection IED', 'POTT/PUTT teleprotection scheme via OPGW', 'Power swing blocking logic ANSI 68', 'Single/three-pole auto-reclosing relay ANSI 79'],
    revision: 'Rev D',
    version: '2.4.0',
    status: 'CURRENT',
    date: '2024-02-02',
    source: 'IEEE C37.113 & IEC 60255-121 Distance Protection Standard',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Senior Protection & Telecontrol Studies Specialist',
    relatedProjectContext: {
      fr: 'Corridors stratégiques 225 kV Songloulou - Mangombé et Nyom 2 - Nachtigal',
      en: 'Critical 225 kV Corridors Songloulou - Mangombé and Nyom 2 - Nachtigal'
    },
    relatedStandards: ['IEC 60255-121', 'IEC 60255-151', 'IEEE Std C37.113', 'IEEE Std C37.94'],
    summary_fr: 'Philosophie complète de réglage des protections de distance numériques 225 kV : zonage R-X mho/quadrilatéral (Zone 1 = 80-85% non temporisée, Zone 2 = 120% temporisée 300 ms, Zone 3 = 150%), compensation de terre k0 et téléprotection POTT par fibre optique.',
    summary_en: 'Comprehensive settings philosophy for 225 kV digital distance relays: quadrilateral/mho R-X zone allocation (Zone 1 = 80-85% instantaneous, Zone 2 = 120% at 300 ms delay, Zone 3 = 150%), zero-sequence earth compensation k0, and optical POTT pilot scheme.',
    tableOfContents_fr: [
      '1. Philosophie Générale & Schéma Unifilaire des Réducteurs TC/TT',
      '2. Caractéristique de Déclenchement dans le Plan R-X (Quadrilatérale & Mho)',
      '3. Calcul des Portées de Zones (Zone 1, Zone 2, Zone 3 et Zone Inverse)',
      '4. Facteur de Compensation Homopolaire k0 (Module & Angle)',
      '5. Schémas de Téléprotection POTT/PUTT & Interface Optique IEEE C37.94',
      '6. Fonction Antiblocage sur Pompage de Puissance (ANSI 68)',
      '7. Réenclenchement Automatique Monophasé (ANSI 79) & Contrôle de Synchronisme (ANSI 25)'
    ],
    tableOfContents_en: [
      '1. General Protection Philosophy & CT/VT Single-Line Hookup',
      '2. Tripping Characteristic Formulation in the R-X Impedance Plane',
      '3. Zone Reach Calculations (Zone 1, Zone 2, Zone 3, and Reverse Zone)',
      '4. Zero-Sequence Earth Compensation Factor k0 (Magnitude & Angle)',
      '5. POTT/PUTT Pilot Schemes & IEEE C37.94 Optical Fiber Channel Interface',
      '6. Power Swing Blocking (PSB) & Out-of-Step Tripping (OST) ANSI 68/78 Logic',
      '7. Single-Pole Autoreclose (ANSI 79) & Synchrocheck Supervision (ANSI 25)'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'PROTECTION',
        title_fr: 'Paramètres de Réglage de Distance',
        title_en: 'Distance Protection Settings Parameters',
        parameters: [
          { key: 'zone1_reach', label_fr: 'Portée Zone 1 (Instantanée t = 0 ms)', label_en: 'Zone 1 Reach (Instantaneous)', value: '85', unit: '% de l\'impédance de la ligne protégée', status: 'VERIFIED' },
          { key: 'zone2_reach', label_fr: 'Portée Zone 2 (Temporisée t = 300 ms)', label_en: 'Zone 2 Reach (Delayed 300 ms)', value: '120', unit: '% de la ligne protégée', status: 'VERIFIED' },
          { key: 'zone3_reach', label_fr: 'Portée Zone 3 (Temporisée t = 700 ms)', label_en: 'Zone 3 Remote Backup Reach', value: '150', unit: '% (ligne + ligne adjacente)', status: 'VERIFIED' },
          { key: 'zero_sequence_compensation_k0', label_fr: 'Facteur de Compensation Terre k0', label_en: 'Earth Compensation Factor k0', value: 'k0 = (Z0 - Z1) / (3 · Z1) ≈ 0.68 ∠ -2°', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D12: Automation, Instrumentation & Control
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D12-SCADA-SPEC-001',
    documentNumber: 'EPEDE-D12-SPEC-SAS-01',
    title_fr: 'Spécification Technique d\'Ingénierie · Système Numérique de Contrôle-Commande de Poste (SNCC/SAS)',
    title_en: 'Engineering Specification · Substation Automation System (SAS) & Telecontrol Gateway',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D12',
    subdomainCode: 'D12.01',
    systemCode: 'SYS-SUBSTATION-AUTOMATION',
    relatedEquipmentIds: ['eq-sas-gateway-01'],
    relatedComponentNames_fr: ['Passerelle téléconduite redondante IEC 60870-5-104', 'Serveur IHM local de conduite de poste', 'Commutateurs Ethernet durcis IEEE 1613', 'Horloge de synchronisation GNSS PTP IEEE 1588'],
    relatedComponentNames_en: ['Dual redundant IEC 60870-5-104 telecontrol gateway', 'Local substation operator HMI workstation', 'Substation-hardened IEEE 1613 Ethernet switches', 'GNSS master clock with IEEE 1588 PTP time sync'],
    revision: 'Rev C',
    version: '2.0.0',
    status: 'CURRENT',
    date: '2023-11-15',
    source: 'IEC 61850-90-2 & IEEE 1613 Substation Automation Guide',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Substation Automation & SCADA Engineering Lead',
    relatedProjectContext: {
      fr: 'Modernisation numérique des postes HTB de Nyom 2, Bekoko et dispatching SONATREL',
      en: 'Digital Substation Upgrades at Nyom 2, Bekoko, and SONATREL National Dispatch Center'
    },
    relatedStandards: ['IEC 61850-3', 'IEC 60870-5-104', 'IEEE 1613', 'IEC 62351-3'],
    summary_fr: 'Spécification technique régissant l\'architecture SNCC de poste : acquisition d\'état en temps réel, exécution des télécommandes avec sélection préalable (Select-Before-Operate), synchronisation temporelle sub-microseconde PTP et cybersécurité IEC 62351.',
    summary_en: 'Technical specification governing substation automation architectures: real-time telemetry acquisition, Select-Before-Operate telecontrol execution, sub-microsecond PTP clock synchronization, and IEC 62351 cybersecurity.',
    tableOfContents_fr: [
      '1. Architecture Générale à 3 Niveaux (Procédé, Travée, Poste)',
      '2. Passerelle de Téléconduite vers le Dispatching (CEI 60870-5-104)',
      '3. Serveurs IHM Locaux & Ergonomie Graphique des Schémas Unifilaires',
      '4. Réseau Local de Poste (Station Bus) & Redondance PRP/HSR',
      '5. Synchronisation Temporelle GPS / PTP selon IEEE 1588v2',
      '6. Cybersécurité des Communications & Chiffrement TLS (CEI 62351)'
    ],
    tableOfContents_en: [
      '1. Three-Tier Architectural Topology (Process, Bay, Substation Levels)',
      '2. Telecontrol Gateway to National Dispatching (IEC 60870-5-104)',
      '3. Local Operator Workstations & Single-Line Graphic Ergonomics',
      '4. Substation Local Area Network (Station Bus) & PRP/HSR Redundancy',
      '5. Master GPS / PTP Time Synchronization per IEEE 1588v2',
      '6. Communication Cybersecurity & TLS Encryption per IEC 62351'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'CONTROL',
        title_fr: 'Performances Téléconduite',
        title_en: 'Telecontrol Performance',
        parameters: [
          { key: 'telemetry_refresh_time', label_fr: 'Temps de Rafraîchissement des Télémesures', label_en: 'Telemetry Refresh Interval', value: '< 1.0', unit: 's', status: 'VERIFIED' },
          { key: 'command_execution_time', label_fr: 'Délai d\'Exécution Télécommande (SBO)', label_en: 'Select-Before-Operate Command Latency', value: '< 250', unit: 'ms', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D13: Communications & Operational Technology
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D13-IEC61850-SPEC-001',
    documentNumber: 'EPEDE-D13-SPEC-61850-01',
    title_fr: 'Spécification de Protocole & Réseau · Architecture CEI 61850 (GOOSE, Sampled Values & Redondance PRP)',
    title_en: 'Protocol & Network Specification · IEC 61850 Architecture (GOOSE, Sampled Values & PRP Redundancy)',
    documentType: 'ENGINEERING_REFERENCE',
    domainCode: 'D13',
    subdomainCode: 'D13.01',
    systemCode: 'SYS-IEC-61850-NETWORK',
    relatedEquipmentIds: ['eq-prp-switch-01'],
    relatedComponentNames_fr: ['Commutateurs RedBox PRP/HSR durcis IEEE 1613', 'Messages GOOSE pour verrouillage rapide inter-travées', 'Flux Sampled Values (SV) pour réduction de cuivre', 'Fibre optique OM3/OM4 et connecteurs LC étanches'],
    relatedComponentNames_en: ['IEEE 1613 hardened RedBox PRP/HSR Ethernet switches', 'High-speed peer-to-peer GOOSE messages for interlocks', 'Sampled Values (SV) streams replacing copper CT/VT wiring', 'OM3/OM4 fiber optics with ruggedized LC connectors'],
    revision: 'Rev C',
    version: '2.1.0',
    status: 'CURRENT',
    date: '2024-01-30',
    source: 'IEC 61850 Edition 2.1 & CIGRE B5 Working Group Standards',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief Substation Telecom & Operational Technology Specialist',
    relatedProjectContext: {
      fr: 'Poste entièrement numérique (Digital Substation) avec bus de procédé optique',
      en: 'Fully Digital Substation with Optical Process Bus and Non-Conventional CT/VT'
    },
    relatedStandards: ['IEC 61850-7-2', 'IEC 61850-8-1', 'IEC 61850-9-2', 'IEC 62439-3 (PRP/HSR)'],
    summary_fr: 'Spécification d\'ingénierie régissant les échanges numériques en poste : latence des messages GOOSE critique < 3 ms pour déclenchement défaillance disjoncteur (ANSI 50BF), protocole de redondance sans perte PRP (IEC 62439-3) et profils SCL.',
    summary_en: 'Engineering specification governing digital substation exchanges: critical GOOSE message latency < 3 ms for breaker failure tripping (ANSI 50BF), zero-loss PRP network redundancy (IEC 62439-3), and standardized SCL engineering profiles.',
    tableOfContents_fr: [
      '1. Cadre Général de la Norme CEI 61850 Édition 2.1',
      '2. Modélisation Sémantique des Objets & Nœuds Logiques (LN)',
      '3. Échanges GOOSE Haute Vitesse & Priorisation IEEE 802.1p/Q (VLANs)',
      '4. Bus de Procédé & Échantillonnage de Courant/Tension Sampled Values (SV)',
      '5. Redondance Réseau Sans Aucune Perte de Trame (PRP / HSR selon CEI 62439-3)',
      '6. Fichiers de Configuration Normalisés (SSD, ICD, SCD, CID, IID)'
    ],
    tableOfContents_en: [
      '1. Overall Architecture of IEC 61850 Edition 2.1',
      '2. Semantic Data Modeling & Standard Logical Nodes (LN)',
      '3. High-Speed Peer-to-Peer GOOSE Messaging & IEEE 802.1p/Q VLAN Tagging',
      '4. Optical Process Bus & Current/Voltage Sampled Values (IEC 61850-9-2)',
      '5. Zero-Loss Parallel Network Redundancy (PRP / HSR per IEC 62439-3)',
      '6. Standardized Substation Configuration Language (SCL) File Formats'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'COMMUNICATION',
        title_fr: 'Performances de Communication Numérique',
        title_en: 'Digital Substation Network Performance',
        parameters: [
          { key: 'goose_latency', label_fr: 'Délai Maximal de Transmission GOOSE (Classe P1)', label_en: 'Maximum GOOSE Latency (Class P1)', value: '< 3.0', unit: 'ms (pour déclenchements critiques)', status: 'VERIFIED' },
          { key: 'sampled_values_rate', label_fr: 'Fréquence d\'Échantillonnage SV (50 Hz)', label_en: 'Sampled Values Publishing Rate', value: '4000', unit: 'échantillons/s (80 éch./cycle)', status: 'VERIFIED' },
          { key: 'prp_switchover_time', label_fr: 'Temps de Reconfiguration Réseau PRP', label_en: 'PRP Network Failure Recovery Time', value: '0', unit: 'ms (Zéro trame perdue en cas de rupture de lien)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D14: Power Quality & EMC
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D14-PQ-SPEC-001',
    documentNumber: 'EPEDE-D14-SPEC-THD-01',
    title_fr: 'Cahier des Charges · Filtre Actif d\'Harmoniques (AHF) 400 V - 300 A avec Compensation Réactive',
    title_en: 'Technical Specification · 400 V 300 A Active Harmonic Filter (AHF) & Fast Var Compensator',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D14',
    subdomainCode: 'D14.02',
    systemCode: 'SYS-ACTIVE-HARMONIC-FILTER',
    relatedEquipmentIds: ['eq-ahf-filter-01'],
    relatedComponentNames_fr: ['Onduleur IGBT à commutation haute fréquence (20 kHz)', 'Processeur de traitement du signal DSP 64 bits', 'Filtre de sortie LCL', 'Transformateurs de courant de mesure classe 0.2S'],
    relatedComponentNames_en: ['High-frequency IGBT inverter stage (20 kHz)', '64-bit real-time digital signal processor (DSP)', 'LCL ripple-attenuating output filter', 'Class 0.2S high-precision measurement CTs'],
    revision: 'Rev B',
    version: '1.3.0',
    status: 'CURRENT',
    date: '2023-10-28',
    source: 'IEEE 519 & IEC 61000-3-6 Harmonic Compliance Guidelines',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Power Quality & Industrial EMC Lead Engineer',
    relatedProjectContext: {
      fr: 'Dépollution harmonique et compensation réactive de sites industriels alimentant des variateurs VFD et fours à arc',
      en: 'Harmonic Mitigation and Fast Reactive Compensation for Industrial Plants with Large VFD Drives'
    },
    relatedStandards: ['IEEE Std 519', 'IEC 61000-4-30 Class A', 'IEC 61000-2-4 Class 3', 'IEC 62477-1'],
    summary_fr: 'Spécification technique régissant les compensateurs actifs d\'harmoniques : compensation ciblée des rangs 2 à 50 en temps réel, correction ultra-rapide du facteur de puissance (cos phi = 0.99) et réduction du THDi < 5%.',
    summary_en: 'Technical specification governing active harmonic filters: selective real-time cancellation of harmonics from 2nd to 50th order, ultra-fast dynamic power factor correction (cos phi = 0.99), and THDi reduction below 5%.',
    tableOfContents_fr: [
      '1. Phénomènes Harmoniques & Limites Normatives IEEE 519',
      '2. Principe de Compensation en Temps Réel par Injection en Opposition de Phase',
      '3. Filtrage Sélectif des Rangs Harmoniques 2 à 50',
      '4. Étage de Puissance IGBT, Fréquence de Hachage & Rendement',
      '5. Algorithme de Régulation Vectorielle DSP & Temps de Réponse Dynamique',
      '6. Essais de Performance & Validation par Analyseur de Réseau Classe A'
    ],
    tableOfContents_en: [
      '1. Harmonic Distortion Phenomena & IEEE 519 Regulatory Limits',
      '2. Real-Time Phase-Opposite Current Injection Principle',
      '3. Selective Cancellation of Harmonic Orders from 2nd to 50th',
      '4. IGBT Inverter Power Stage, PWM Frequency & Efficiency',
      '5. DSP Vector Control Algorithms & Sub-Cycle Dynamic Response',
      '6. Performance Verification & Class A Power Quality Analyzer Validation'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Performances de Dépollution Harmonique',
        title_en: 'Harmonic Mitigation Performance',
        parameters: [
          { key: 'compensation_capacity', label_fr: 'Capacité de Compensation Nominale', label_en: 'Rated Compensating Current', value: '300', unit: 'A (par unité modulaire)', status: 'VERIFIED' },
          { key: 'harmonic_range', label_fr: 'Plage des Rangs Harmoniques Traités', label_en: 'Harmonic Orders Compensated', value: '2ème au 50ème rang (sélection individuelle)', status: 'VERIFIED' },
          { key: 'target_thdi', label_fr: 'Taux de Distorsion Harmonique Cible (THDi)', label_en: 'Target Current Total Harmonic Distortion', value: '< 5.0', unit: '% (à pleine charge)', status: 'VERIFIED' },
          { key: 'response_time_pq', label_fr: 'Temps de Réponse Dynamique Complet', label_en: 'Full Dynamic Response Time', value: '< 5.0', unit: 'ms (< 1/4 cycle)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D15: Metering, Smart Grids & Grid Digitalization
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D15-METER-SPEC-001',
    documentNumber: 'EPEDE-D15-SPEC-AMI-01',
    title_fr: 'Spécification Système · Compteur d\'Énergie Intelligent Communicant Triphasé AMI (DLMS/COSEM & Cellulaire)',
    title_en: 'System Specification · Three-Phase Smart Energy Meter (DLMS/COSEM over Cellular IoT / G3-PLC)',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D15',
    subdomainCode: 'D15.01',
    systemCode: 'SYS-SMART-METERING-AMI',
    relatedEquipmentIds: ['eq-smart-meter-01', 'eq-exp-ami-smartmeter-3p', 'node-ami-meter'],
    relatedComponentNames_fr: ['Capteurs de courant à effet Hall / Shunts haute stabilité', 'Module cellulaire 4G LTE-M / NB-IoT intégré', 'Relais de coupure/réarmement interne bistable 100 A', 'Capteur de détection d\'ouverture de capot antifraude'],
    relatedComponentNames_en: ['Hall-effect / ultra-stable current shunt sensors', 'Integrated 4G LTE-M / NB-IoT cellular module', 'Internal 100 A latching disconnect relay', 'Optical tamper-detection switches and magnetic sensor'],
    revision: 'Rev B',
    version: '1.4.0',
    status: 'CURRENT',
    date: '2023-11-08',
    source: 'DLMS User Association & IEC 62053 Electricity Metering Guide',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief Smart Metering & Revenue Protection Engineer',
    relatedProjectContext: {
      fr: 'Programme national de déploiement de compteurs communicants prépaiement et post-paiement Eneo',
      en: 'National Rollout of Communicating Prepayment and Post-Payment Smart Meters across Cameroon'
    },
    relatedStandards: ['IEC 62053-21', 'IEC 62053-22', 'IEC 62056 (DLMS/COSEM)', 'EN 13757'],
    summary_fr: 'Spécification technique régissant les compteurs intelligents communicants : métrologie classe 0.5S/1.0, communication bidirectionnelle sécurisée DLMS/COSEM sur LTE-M, coupure à distance pour gestion prépayée STS et détection avancée des fraudes (champs magnétiques, inversion de phase).',
    summary_en: 'Technical specification governing communicating smart meters: Class 0.5S/1.0 metrology, secure DLMS/COSEM two-way communications over LTE-M, remote disconnection for STS prepayment, and tamper detection (strong magnetic fields, phase reversal).',
    tableOfContents_fr: [
      '1. Exigences Métrologiques & Classes de Précision CEI 62053-21/22',
      '2. Protocole de Communication Sécurisé DLMS/COSEM & Profils OBIS',
      '3. Module Radio Cellulaire 4G LTE-M / NB-IoT & Cartes eSIM M2M',
      '4. Disjoncteur Interne de Coupure/Rétablissement (Relais Bistable)',
      '5. Fonctions Prépaiement STS & Intégration Plateforme MDM',
      '6. Dispositifs Antifraude (Champ Magnétique, Ouverture Capot, Détection Neutre Coupé)'
    ],
    tableOfContents_en: [
      '1. Metrological Requirements & Accuracy Classes (IEC 62053-21/22)',
      '2. Secure DLMS/COSEM Protocol & Standard OBIS Data Objects',
      '3. Cellular 4G LTE-M / NB-IoT Radio Module & Industrial M2M eSIM',
      '4. Internal Latching Disconnect / Reconnect Relay (100 A Rated)',
      '5. STS Standard Prepayment Tokens & Head-End MDM Integration',
      '6. Anti-Tamper Detection (Magnetic Fields, Enclosure Opening, Missing Neutral)'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Métrologie & Raccordement',
        title_en: 'Metrology & Connection Ratings',
        parameters: [
          { key: 'meter_accuracy_class', label_fr: 'Classe de Précision Active', label_en: 'Active Energy Accuracy Class', value: 'Classe 0.5S (CEI 62053-22)', status: 'VERIFIED' },
          { key: 'voltage_rated_meter', label_fr: 'Tension Nominale Assignée', label_en: 'Rated Nominal Voltage', value: '3 x 230 / 400', unit: 'V (± 20%)', status: 'VERIFIED' },
          { key: 'current_range_meter', label_fr: 'Plage de Courant (Ib - Imax)', label_en: 'Current Range (Base - Max)', value: '5(100)', unit: 'A (Raccordement direct)', status: 'VERIFIED' }
        ]
      },
      {
        category: 'COMMUNICATION',
        title_fr: 'Protocoles & Sécurité des Données',
        title_en: 'Protocols & Data Cybersecurity',
        parameters: [
          { key: 'meter_protocol', label_fr: 'Protocole de Données Compteur', label_en: 'Meter Communication Protocol', value: 'DLMS/COSEM (CEI 62056) avec suite cryptographique HLS 5 (AES-GCM-128)', status: 'VERIFIED' },
          { key: 'communication_channel', label_fr: 'Canal de Transmission Principal', label_en: 'Primary Transmission Channel', value: 'Cellulaire 4G LTE-M / NB-IoT avec secours 2G GPRS', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // D16: Electrical Safety, Earthing & Lightning
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D16-EARTHING-SPEC-001',
    documentNumber: 'EPEDE-D16-SPEC-GRID-80-01',
    title_fr: 'Note d\'Ingénierie & Procédure de Calcul · Réseau de Terre de Poste Haute Tension selon IEEE Std 80',
    title_en: 'Engineering Calculation Note & Standard · Substation Grounding Grid Design per IEEE Std 80',
    documentType: 'ENGINEERING_CALCULATION_NOTE',
    domainCode: 'D16',
    subdomainCode: 'D16.02',
    systemCode: 'SYS-SUBSTATION-EARTHING-GRID',
    relatedEquipmentIds: ['node-trafo-main-30', 'node-line-225-bekoko'],
    relatedComponentNames_fr: ['Grille maillée en cuivre nu écroui 95 mm²', 'Piquets de terre profonds en acier cuivré 3m', 'Couche de gravier de surface (granite concassé 15 cm)', 'Puits de mesure & collecteurs de terre'],
    relatedComponentNames_en: ['95 mm² hard-drawn bare copper buried mesh', '3-meter copper-bonded deep earth rods', '15 cm crushed granite surface rock layer', 'Test wells & primary earthing copper busbars'],
    revision: 'Rev E',
    version: '3.1.0',
    status: 'CURRENT',
    date: '2024-02-18',
    source: 'IEEE Std 80 / IEC 61936-1 Substation Safety & Grounding Standard',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief Electrical Safety & High Voltage Earthing Specialist',
    relatedProjectContext: {
      fr: 'Réseau de terre des postes d\'évacuation 225 kV de Nachtigal et poste carrefour de Nyom 2',
      en: '225 kV Substation Grounding Grid at Nachtigal Hydro Plant and Nyom 2 Grid Node'
    },
    relatedStandards: ['IEEE Std 80', 'IEC 61936-1', 'IEEE Std 81', 'NFPA 70E'],
    summary_fr: 'Procédure formelle de calcul des réseaux de terre de poste selon la méthode analytique IEEE 80 : modélisation de la résistivité du sol à 2 couches (Wenner), calcul des tensions de pas (E_step) et de toucher (E_touch) admissibles pour un corps de 50 kg / 70 kg, et vérification de la résistance globale Rg < 0.5 Ω.',
    summary_en: 'Formal substation grounding grid engineering calculation procedure per IEEE 80: Wenner two-layer soil resistivity inversion, allowable touch (E_touch) and step (E_step) potential limits for 50 kg / 70 kg body weight, and verification of overall grid resistance Rg < 0.5 Ω.',
    tableOfContents_fr: [
      '1. Mesure de Résistivité du Sol par Méthode Wenner (4 Piquets) & Inversion',
      '2. Courant de Défaut Terre Maximal & Facteur de Division de Courant (Sf)',
      '3. Calcul de la Section Minimale du Conducteur Cuivre (Tenue Thermique)',
      '4. Calcul des Tensions Admissibles de Pas & de Toucher (IEEE 80 Equations)',
      '5. Résistance Globale de la Grille Rg & Élévation de Potentiel du Sol (GPR)',
      '6. Dispositions Constructives, Soudures Exothermiques & Couche de Gravier'
    ],
    tableOfContents_en: [
      '1. Soil Resistivity Field Testing via Wenner 4-Pin Method & Layer Inversion',
      '2. Maximum Earth Fault Current & Current Division Factor (Sf)',
      '3. Minimum Copper Conductor Cross-Section Sizing (Thermal Withstand)',
      '4. Allowable Touch and Step Potential Tolerable Limits (IEEE 80)',
      '5. Overall Ground Grid Resistance Rg & Ground Potential Rise (GPR)',
      '6. Construction Details, Exothermic Cadweld Bonds & Crushed Rock Layer'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'SAFETY',
        title_fr: 'Tensions Limites de Sécurité Humaine (IEEE 80)',
        title_en: 'Human Safety Voltage Tolerable Limits (IEEE 80)',
        parameters: [
          { key: 'target_grid_resistance', label_fr: 'Résistance Globale Cible de la Grille (Rg)', label_en: 'Target Ground Grid Resistance (Rg)', value: '< 0.50', unit: 'Ω (ohms)', status: 'VERIFIED' },
          { key: 'touch_voltage_limit', label_fr: 'Tension de Toucher Admissible (50 kg, t = 0.5s)', label_en: 'Tolerable Touch Voltage (50 kg, t = 0.5s)', value: '840', unit: 'V (avec gravier 15 cm)', status: 'VERIFIED' },
          { key: 'step_voltage_limit', label_fr: 'Tension de Pas Admissible (50 kg, t = 0.5s)', label_en: 'Tolerable Step Voltage (50 kg, t = 0.5s)', value: '2850', unit: 'V', status: 'VERIFIED' },
          { key: 'conductor_section', label_fr: 'Section Conducteur Cuivre de Grille', label_en: 'Copper Grid Conductor Size', value: '95', unit: 'mm² (Cuivre nu recuit)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------------------------------------------
  // Advanced Canonical Equipment Engineering Documentation & Commissioning Procedures
  // -------------------------------------------------------------------------------------------------
  {
    id: 'DOC-D10-BESS-COMMISSIONING-01',
    documentNumber: 'EPEDE-D10-PRO-BESS-SAT-01',
    title_fr: 'Procédure de Réception sur Site (SAT) & Essais de Mise en Service · BESS Conteneurisé 5 MW / 10 MWh',
    title_en: 'Site Acceptance Testing (SAT) & Commissioning Procedure · 5 MW / 10 MWh Containerized BESS',
    documentType: 'COMMISSIONING_PROCEDURE',
    domainCode: 'D10',
    subdomainCode: 'D10.01',
    systemCode: 'SYS-BESS-UTILITY-STORAGE',
    primaryEquipmentId: 'eq-exp-bess-container-5mw',
    relatedEquipmentIds: ['eq-exp-bess-container-5mw', 'node-bess-10mwh', 'eq-bess-container-01'],
    relatedComponentNames_fr: ['Racks batteries LFP 1500 V', 'Onduleur 4 quadrants PCS 5 MW', 'Système de détection précoce gaz de pyrolyse (H2/CO)', 'Boucle de refroidissement liquide glycolée'],
    relatedComponentNames_en: ['1500 V LFP battery racks', '5 MW 4-quadrant PCS inverter', 'Early off-gas pyrolysis detection (H2/CO)', 'Glycol liquid cooling distribution loop'],
    revision: 'Rev C',
    version: '2.1.0',
    status: 'CURRENT',
    date: '2024-04-10',
    source: 'IEC 62933-5-2 / NFPA 855 Utility BESS Commissioning Standard',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief Grid Energy Storage & Power Quality Specialist',
    relatedProjectContext: {
      fr: 'Mise en service du système de stockage stabilisateur de fréquence et soutien dynamique de tension au poste de Bekoko',
      en: 'Commissioning of the Frequency Support and Dynamic Voltage Stabilization BESS at Bekoko Substation'
    },
    relatedStandards: ['IEC 62933-5-2', 'NFPA 855', 'UL 9540A', 'IEEE Std 2800', 'IEC 60364-7-712'],
    summary_fr: 'Procédure formelle régissant les contrôles préalables sous tension, les séquences de validation BMS/EMS, les mesures d\'isolement DC sous 1500 V, les essais d\'injection de puissance 4 quadrants, le test de réponse fréquentielle rapide (FFR < 100 ms) et l\'asservissement d\'extinction incendie Novec.',
    summary_en: 'Formal procedure governing cold pre-checks, BMS/EMS protocol handshake, DC high-voltage insulation tests at 1500 V, 4-quadrant step injection tests, Fast Frequency Response validation (FFR < 100 ms), and interlocked Novec fire extinguishing system release.',
    tableOfContents_fr: [
      '1. Conditions Préalables & Consignations de Sécurité Haute Tension DC (1500 V)',
      '2. Contrôle de Résistance d\'Isolement & Continuité d\'Équipotentialité',
      '3. Essais à Vide : Communication BMS-PCS-EMS & Étalonnage SoC / SoH',
      '4. Essais en Charge : Paliers de Puissance Active (25%, 50%, 75%, 100%) & Rendement RTE',
      '5. Essai de Régulation Dynamique de Fréquence (FFR) & Temps de Montée (< 80 ms)',
      '6. Validation du Rideau d\'Arrêt d\'Urgence (EPO), Détection Gaz & Ventilation Sécurisée'
    ],
    tableOfContents_en: [
      '1. Prerequisites & Safe Isolation Procedures for 1500 V DC High-Energy Systems',
      '2. DC Bus Insulation Resistance & Bonding Continuity Measurement',
      '3. Cold & No-Load Tests: BMS-to-PCS Telemetry Handshake & SoC/SoH Calibration',
      '4. Load Step Injection: Active Power Steps (25%, 50%, 75%, 100%) & Round-Trip Efficiency Verification',
      '5. Fast Frequency Response (FFR) Dynamic Step Injection & Rise Time (< 80 ms)',
      '6. Emergency Power Off (EPO) Loop, Off-Gas Detection & Deflagration Vent Interlocks'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Critères d\'Acceptation Électriques',
        title_en: 'Electrical Acceptance Criteria',
        parameters: [
          { key: 'insulation_resistance_dc', label_fr: 'Résistance d\'Isolement Pôle DC à Terre', label_en: 'DC Pole-to-Earth Insulation Resistance', value: '> 50.0', unit: 'MΩ (test sous 2500 V DC)', status: 'VERIFIED' },
          { key: 'ffr_response_latency', label_fr: 'Temps de Réponse Dynamique FFR', label_en: 'FFR Dynamic Response Latency', value: '< 80', unit: 'ms', status: 'VERIFIED' },
          { key: 'rte_measured', label_fr: 'Rendement Global de Cycle Mesuré (RTE)', label_en: 'Measured Round-Trip AC-AC Efficiency', value: '88.2', unit: '% (pente C/2)', status: 'VERIFIED' }
        ]
      },
      {
        category: 'SAFETY',
        title_fr: 'Sécurité & Détection Emballement',
        title_en: 'Safety & Runaway Mitigation',
        parameters: [
          { key: 'offgas_sensor_threshold', label_fr: 'Seuil Détection Gaz Pyrolyse H2', label_en: 'Pyrolysis H2 Off-Gas Alarm Threshold', value: '25', unit: 'ppm', status: 'VERIFIED' },
          { key: 'fire_suppression_interlock', label_fr: 'Asservissement Déclenchement Disjoncteur DC', label_en: 'DC Circuit Breaker Trip Interlock', value: 'Déclenchement instantané à l\'alarme Incendie Niveau 2', status: 'VERIFIED' }
        ]
      }
    ]
  },

  {
    id: 'DOC-D10-EV-HPC-SPEC-01',
    documentNumber: 'EPEDE-D10-SPEC-HPC-350-01',
    title_fr: 'Cahier des Charges Technique & Interopérabilité · Borne de Recharge Ultra-Rapide Haute Puissance (HPC) 350 kW',
    title_en: 'Technical Specification & Interoperability · 350 kW Ultra-Fast High Power Charger (HPC)',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D10',
    subdomainCode: 'D10.02',
    systemCode: 'SYS-EV-CHARGING-INFRASTRUCTURE',
    primaryEquipmentId: 'eq-exp-ev-hpc-350kw',
    relatedEquipmentIds: ['eq-exp-ev-hpc-350kw'],
    relatedComponentNames_fr: ['Convertisseur SiC PFC + DC/DC résonant', 'Câble CCS Combo 2 avec refroidissement liquide actif', 'Contrôleur SECC conforme ISO 15118 (Plug & Charge)', 'Compteur d\'énergie DC certifié Eichrecht / MID'],
    relatedComponentNames_en: ['SiC Active Front End PFC + resonant DC/DC converter', 'Liquid-cooled CCS Combo 2 charging cable', 'Supply Equipment Communication Controller (SECC) per ISO 15118', 'Certified Eichrecht / MID DC energy meter'],
    revision: 'Rev B',
    version: '1.2.0',
    status: 'CURRENT',
    date: '2024-03-20',
    source: 'CharIN / IEC 61851-23 / ISO 15118 High-Power Charging Guideline',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'E-Mobility Infrastructure & Power Electronics Specialist',
    relatedProjectContext: {
      fr: 'Corridor autoroutier de recharge rapide Yaoundé - Douala et hub logistique périurbain',
      en: 'Yaoundé - Douala Highway Fast-Charging Corridor and Logistics Fleet Hub'
    },
    relatedStandards: ['IEC 61851-23', 'IEC 61851-24', 'ISO 15118-2', 'ISO 15118-20', 'DIN 70121', 'IEC 61000-6-2'],
    summary_fr: 'Spécification technique régissant les bornes HPC 350 kW : plage de tension 200 à 920 V DC, courant continu 500 A refroidi par liquide, authentification sécurisée Plug & Charge par certificat TLS 1.3 selon ISO 15118-2/20, et facteur de puissance > 0.99 avec THDi < 4%.',
    summary_en: 'Technical specification governing 350 kW HPC chargers: output voltage 200 to 920 V DC, 500 A continuous current with active liquid cooling, ISO 15118-2/20 Plug & Charge automated TLS 1.3 PKI authentication, and PF > 0.99 with THDi < 4%.',
    tableOfContents_fr: [
      '1. Caractéristiques d\'Entrée Réseau Triphasé 400 V & Compatibilité Électromagnétique (CEM)',
      '2. Étage de Puissance Convertisseur SiC & Topologie DC/DC Multi-Voies',
      '3. Câble de Charge CCS Combo 2 à Refroidissement Liquide & Sécurité Thermique',
      '4. Protocole de Communication Véhicule-Borne (V2G) selon ISO 15118-2/20 (Plug & Charge)',
      '5. Supervision Réseau OCPP 2.0.1 & Gestion Intelligente de la Charge (Smart Charging)',
      '6. Métrologie Légale DC (Eichrecht) & Protection Contre les Défauts d\'Isolement'
    ],
    tableOfContents_en: [
      '1. 400 V Three-Phase Grid Input Requirements & Electromagnetic Compatibility (EMC)',
      '2. Silicon Carbide (SiC) Power Conversion Stage & Multi-Channel DC/DC Topology',
      '3. Liquid-Cooled CCS Combo 2 Cable Assembly & Cable Thermal Monitoring',
      '4. Vehicle-to-Grid Communication Controller (V2G) per ISO 15118-2/20 (Plug & Charge PKI)',
      '5. Cloud Management OCPP 2.0.1 Protocol & Dynamic Local Smart Charging Logic',
      '6. DC Revenue-Grade Legal Metrology (Eichrecht) & Continuous Insulation Fault Protection'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Grandeurs Électriques Assignées',
        title_en: 'Rated Electrical Specifications',
        parameters: [
          { key: 'max_dc_power', label_fr: 'Puissance Continue Maximale', label_en: 'Maximum Continuous Power', value: '350.0', unit: 'kW', status: 'VERIFIED' },
          { key: 'output_voltage_range', label_fr: 'Plage de Tension de Sortie DC', label_en: 'DC Output Voltage Window', value: '200 - 920', unit: 'V DC', status: 'VERIFIED' },
          { key: 'max_continuous_current', label_fr: 'Courant Continu Maximal', label_en: 'Maximum Continuous Current', value: '500', unit: 'A (avec refroidissement liquide)', status: 'VERIFIED' },
          { key: 'grid_thdi', label_fr: 'Distorsion Harmonique Courant Entrée (THDi)', label_en: 'Input Current Harmonic Distortion (THDi)', value: '< 4.0', unit: '% à pleine charge', status: 'VERIFIED' }
        ]
      },
      {
        category: 'COMMUNICATION',
        title_fr: 'Communication & Protocoles',
        title_en: 'Protocols & Connectivity',
        parameters: [
          { key: 'v2g_protocol', label_fr: 'Protocole Véhicule - Borne', label_en: 'Vehicle-to-Grid Protocol', value: 'ISO 15118-2 / ISO 15118-20 avec Plug & Charge', status: 'VERIFIED' },
          { key: 'ocpp_version', label_fr: 'Protocole de Conduite Centrale', label_en: 'Central Management Protocol', value: 'OCPP 2.0.1 sur WebSockets sécurisés (WSS)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  {
    id: 'DOC-D14-STATCOM-SPEC-01',
    documentNumber: 'EPEDE-D14-SPEC-STATCOM-50MVAR',
    title_fr: 'Spécification Technique & Note d\'Ingénierie · Compensateur Statique Synchrone STATCOM MMC ±50 Mvar',
    title_en: 'Technical Specification & Engineering Note · STATCOM Modular Multilevel Converter (MMC) ±50 Mvar',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D14',
    subdomainCode: 'D14.01',
    systemCode: 'SYS-STATCOM-COMPENSATION',
    primaryEquipmentId: 'eq-exp-statcom-mmc-50mvar',
    relatedEquipmentIds: ['eq-exp-statcom-mmc-50mvar', 'node-statcom-50mvar'],
    relatedComponentNames_fr: ['Sous-modules en demi-pont IGBT MMC', 'Réactance de phase de découplage', 'Transformateur d\'accouplement 225/33 kV', 'Système de commande vectorielle temps réel d-q'],
    relatedComponentNames_en: ['MMC IGBT half-bridge submodules', 'Phase coupling buffer reactors', '225/33 kV step-up coupling transformer', 'Real-time d-q synchronous frame vector controller'],
    revision: 'Rev A',
    version: '1.0.0',
    status: 'CURRENT',
    date: '2024-02-14',
    source: 'CIGRE TB 684 / IEC 62751-1 STATCOM Engineering Guide',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief Power Quality & FACTS Specialist',
    relatedProjectContext: {
      fr: 'Régulation dynamique de tension et compensation de flicker au nœud 225 kV de Mangombé / Douala',
      en: 'Dynamic Voltage Regulation and Fast Flicker Mitigation at Mangombé 225 kV Grid Node'
    },
    relatedStandards: ['IEC 62751-1', 'IEEE Std 1052', 'IEEE Std 2800', 'CIGRE TB 684', 'IEEE Std 519'],
    summary_fr: 'Spécification technique régissant les compensateurs statiques rapides STATCOM MMC ±50 Mvar : temps de réponse dynamique en courant réactif < 15 ms, régulation de tension en régime symétrique et dissymétrique, et absence d\'amplification des résonances réseau.',
    summary_en: 'Technical specification governing ±50 Mvar MMC STATCOM systems: sub-15 ms dynamic reactive current injection, positive and negative sequence independent voltage regulation, and intrinsic immunity to grid harmonic resonance.',
    tableOfContents_fr: [
      '1. Objectifs de Stabilité Dynamique Réseau & Tenue aux Creux de Tension (FRT)',
      '2. Topologie Modulaire Multiniveaux (MMC) & Dimensionnement des Sous-Modules',
      '3. Transformateur de Couplage & Réactances de Phase',
      '4. Algorithme de Commande Découplée d-q & Équilibrage des Tensions de Condensateurs',
      '5. Élimination des Harmoniques de Bas Rang & Taux de Distorsion Global (THDu < 1.5%)',
      '6. Système de Refroidissement par Eau Déionisée & Redondance des Pompes'
    ],
    tableOfContents_en: [
      '1. Power System Dynamic Stability Objectives & Fault Ride-Through (FRT) Envelope',
      '2. Modular Multilevel Converter (MMC) Topology & Submodule Capacitor Sizing',
      '3. Coupling Transformer & Phase Buffer Reactor Engineering Parameters',
      '4. Decoupled d-q Frame Current Control & Submodule Voltage Balancing Algorithms',
      '5. Low-Order Harmonic Cancellation & Ultra-Low Distortion Output (THDu < 1.5%)',
      '6. Closed-Loop Deionized Water Cooling Skid & N+1 Pump Redundancy'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'ELECTRICAL',
        title_fr: 'Performances Dynamiques & Puissance Réactive',
        title_en: 'Dynamic Performance & Reactive Ratings',
        parameters: [
          { key: 'reactive_range', label_fr: 'Plage Continue de Puissance Réactive', label_en: 'Continuous Reactive Power Range', value: '± 50.0', unit: 'Mvar (inductif à capacitif)', status: 'VERIFIED' },
          { key: 'dynamic_response_time', label_fr: 'Temps de Réponse Dynamique (0 à 100%)', label_en: 'Full Step Response Time (0 to 100%)', value: '< 15.0', unit: 'ms', status: 'VERIFIED' },
          { key: 'connection_voltage', label_fr: 'Tension Nominale de Raccordement Réseau', label_en: 'Grid Interconnection Nominal Voltage', value: '225', unit: 'kV (via transformateur dédié)', status: 'VERIFIED' },
          { key: 'thdu_output', label_fr: 'Distorsion Harmonique Tension Injectée', label_en: 'Injected Voltage THD (THDu)', value: '< 1.5', unit: '%', status: 'VERIFIED' }
        ]
      }
    ]
  },

  {
    id: 'DOC-D09-DGA-PROC-01',
    documentNumber: 'EPEDE-D09-PRO-DGA-DUVAL-01',
    title_fr: 'Procédure Diagnostique & Interprétation IA · Surveillance en Ligne DGA par Photoacoustique & Triangle de Duval',
    title_en: 'Diagnostic Procedure & AI Interpretation · Online Photoacoustic DGA & Duval Triangle Analysis',
    documentType: 'TESTING_PROCEDURE',
    domainCode: 'D09',
    subdomainCode: 'D09.01',
    systemCode: 'SYS-ONLINE-DGA-MONITOR',
    primaryEquipmentId: 'eq-exp-dga-online-monitor',
    relatedEquipmentIds: ['eq-exp-dga-online-monitor', 'node-ai-duval', 'node-trafo-main-30'],
    relatedComponentNames_fr: ['Cellule de mesure photoacoustique PAS multi-gaz', 'Sonde d\'extraction d\'huile à membrane PTFE', 'Module de calcul local Triangle de Duval & Pentagone', 'Passerelle IEC 61850 MMS / Modbus TCP'],
    relatedComponentNames_en: ['Multi-gas photoacoustic spectroscopy (PAS) cell', 'PTFE membrane oil-sampling extraction head', 'Embedded Duval Triangle & Pentagon diagnostic algorithm', 'IEC 61850 MMS / Modbus TCP communication processor'],
    revision: 'Rev B',
    version: '1.4.0',
    status: 'CURRENT',
    date: '2024-03-05',
    source: 'IEC 60599 / IEEE Std C57.104 Transformer DGA Diagnostic Guide',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief Transformer Diagnostics & Condition Monitoring Engineer',
    relatedProjectContext: {
      fr: 'Surveillance prédictive continue des autotransformateurs 225/90/15 kV des postes stratégiques du RIS',
      en: 'Continuous Predictive Monitoring of Critical 225/90/15 kV Autotransformers in the RIS Interconnected Grid'
    },
    relatedStandards: ['IEC 60599', 'IEEE Std C57.104', 'CIGRE TB 771', 'IEC 60076-7', 'ASTM D3612'],
    summary_fr: 'Procédure formelle régissant la mesure continue en ligne des 7 gaz dissous critiques (H2, CH4, C2H6, C2H4, C2H2, CO, CO2) et de l\'humidité, le calcul automatique des ratios IEC 60599, la localisation sur le Triangle de Duval No 1, et le déclenchement d\'alarmes par modèle de machine learning de détection précoce d\'arcs et de points chauds.',
    summary_en: 'Formal procedure governing continuous online measurement of 7 key fault gases (H2, CH4, C2H6, C2H4, C2H2, CO, CO2) and moisture, automated calculation of IEC 60599 gas ratios, Duval Triangle No. 1 coordinates mapping, and machine learning anomaly alarm triggering for incipient arcing and thermal hotspots.',
    tableOfContents_fr: [
      '1. Principes de la Spectroscopie Photoacoustique (PAS) sans Gaz Vecteur',
      '2. Seuils d\'Alerte & Limites Normalisées selon CEI 60599 & IEEE C57.104',
      '3. Méthode du Triangle de Duval No 1 (Coordination CH4, C2H4, C2H2)',
      '4. Diagnostic Thermique : Dégradation du Papier Isolant (Ratio CO2 / CO)',
      '5. Algorithmes Prédictifs d\'IA : Taux de Production Journalier (RoC - Rate of Change)',
      '6. Intégration Numérique SCADA via Nœuds Logiques CEI 61850 (SIML)'
    ],
    tableOfContents_en: [
      '1. Photoacoustic Spectroscopy (PAS) Operating Principles (Carrier-Gas-Free)',
      '2. Regulatory Alert Thresholds & Gas Status Limits (IEC 60599 & IEEE C57.104)',
      '3. Duval Triangle No. 1 Mapping Methodology (% CH4, % C2H4, % C2H2)',
      '4. Paper Degradation & Cellulosic Hotspots (CO2/CO Ratio Analysis)',
      '5. AI Predictive Anomaly Models & Gas Generation Rate-of-Change (RoC)',
      '6. Digital SCADA Integration via Standard IEC 61850 Logical Nodes (SIML)'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'CONTROL',
        title_fr: 'Précision Métrologique & Gaz Analysés',
        title_en: 'Metrology Precision & Gas Limits',
        parameters: [
          { key: 'acetylene_detection_limit', label_fr: 'Seuil Détection Acétylène (C2H2)', label_en: 'Acetylene (C2H2) Detection Limit', value: '0.5', unit: 'ppm (indispensable pour arcs haute énergie)', status: 'VERIFIED' },
          { key: 'hydrogen_detection_limit', label_fr: 'Seuil Détection Hydrogène (H2)', label_en: 'Hydrogen (H2) Detection Limit', value: '5.0', unit: 'ppm', status: 'VERIFIED' },
          { key: 'sampling_cycle_time', label_fr: 'Période du Cycle de Mesure DGA', label_en: 'DGA Measurement Cycle Period', value: '1.0', unit: 'heure (configurable de 1h à 24h)', status: 'VERIFIED' }
        ]
      }
    ]
  },

  {
    id: 'DOC-D13-CYBERSWITCH-SPEC-01',
    documentNumber: 'EPEDE-D13-SPEC-SW-62443-01',
    title_fr: 'Spécification Technique de Sécurité OT & Réseau · Commutateur Ethernet Durci de Poste selon CEI 62443-4-2 SL2',
    title_en: 'OT Security & Network Technical Specification · Substation Hardened Ethernet Switch per IEC 62443-4-2 SL2',
    documentType: 'TECHNICAL_SPECIFICATION',
    domainCode: 'D13',
    subdomainCode: 'D13.02',
    systemCode: 'SYS-OT-CYBERSECURITY-NETWORK',
    primaryEquipmentId: 'eq-exp-switch-iec62443',
    relatedEquipmentIds: ['eq-exp-switch-iec62443', 'node-sw-iec61850'],
    relatedComponentNames_fr: ['Puces de chiffrement matériel MACsec IEEE 802.1AE', 'Module de redondance PRP/HSR (Zero-loss switch)', 'Moteur d\'inspection de paquets en profondeur (DPI)', 'Alimentations redondantes 110/220 V DC'],
    relatedComponentNames_en: ['IEEE 802.1AE MACsec hardware cryptographic engine', 'Zero-loss PRP/HSR redundancy switching engine', 'Deep packet inspection (DPI) security coprocessor', 'Dual hot-swappable 110/220 V DC power supplies'],
    revision: 'Rev B',
    version: '1.3.0',
    status: 'CURRENT',
    date: '2024-03-12',
    source: 'IEC 62443-4-2 / IEC 61850-3 Substation Communication Security Standard',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief OT Cybersecurity & Substation Telecom Specialist',
    relatedProjectContext: {
      fr: 'Sécurisation périmétrique et durcissement des réseaux locaux de commande des postes HTB interconnectés',
      en: 'Perimeter Hardening and Station Bus Network Security across Interconnected HV Substations'
    },
    relatedStandards: ['IEC 62443-4-2', 'IEC 62443-3-3', 'IEC 61850-3', 'IEEE 1613', 'IEC 62351-7', 'IEEE 802.1AE'],
    summary_fr: 'Spécification technique régissant les commutateurs Ethernet durcis de poste : conformité CEI 62443-4-2 Niveau de Sécurité 2 (SL2), chiffrement matériel des liens inter-postes par MACsec, élimination des défaillances de lien par redondance PRP/HSR (0 ms), et traçabilité inviolable par Syslog TLS (RFC 5425).',
    summary_en: 'Technical specification governing substation hardened Ethernet switches: IEC 62443-4-2 Security Level 2 (SL2) certification, line-rate MACsec link encryption, zero-loss PRP/HSR network redundancy (0 ms recovery), and tamper-proof TLS-encrypted Syslog audit trail (RFC 5425).',
    tableOfContents_fr: [
      '1. Exigences d\'Environnement Sévère : CEI 61850-3 & IEEE 1613 (Immunité CEM, Température -40°C à +85°C)',
      '2. Exigences de Cybersécurité CEI 62443-4-2 SL2 (Contrôle d\'Accès, Authentification 802.1X, Rôles RBAC)',
      '3. Chiffrement Matériel des Trames au Niveau Liaison par IEEE 802.1AE MACsec',
      '4. Redondance Réseau Sans Perte PRP (Parallel Redundancy Protocol) & HSR selon CEI 62439-3',
      '5. Synchronisation PTP IEEE 1588v2 Profil Électrique (Power Profile IEEE C37.238)',
      '6. Journalisation Sécurisée des Événements & Intégration SIEM (Syslog RFC 5424 sur TLS)'
    ],
    tableOfContents_en: [
      '1. Substation Environmental Hardening: IEC 61850-3 & IEEE 1613 (EMC Immunity, -40°C to +85°C)',
      '2. IEC 62443-4-2 SL2 Cybersecurity Capabilities (Port Access Control, 802.1X, Role-Based Access)',
      '3. Hardware Link-Layer Encryption via IEEE 802.1AE MACsec',
      '4. Seamless Network Redundancy: PRP & HSR Protocols per IEC 62439-3 (Zero-Packet Loss)',
      '5. IEEE 1588v2 Precision Time Protocol (PTP Power Profile per IEEE C37.238)',
      '6. Tamper-Proof Audit Logging & SIEM Integration (TLS-Secured Syslog per RFC 5424)'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'COMMUNICATION',
        title_fr: 'Performances Réseau & Cybersécurité',
        title_en: 'Network Performance & Cybersecurity',
        parameters: [
          { key: 'cyber_security_level', label_fr: 'Niveau de Sécurité Certifié', label_en: 'Certified Security Level', value: 'CEI 62443-4-2 SL2', status: 'VERIFIED' },
          { key: 'macsec_encryption', label_fr: 'Chiffrement Matériel des Ports', label_en: 'Hardware Port Encryption', value: 'IEEE 802.1AE MACsec AES-256 (vitesse de ligne)', status: 'VERIFIED' },
          { key: 'prp_latency_impact', label_fr: 'Surtaxe de Latence Redondance PRP', label_en: 'PRP Redundancy Added Latency', value: '< 2.5', unit: 'µs par saut', status: 'VERIFIED' }
        ]
      }
    ]
  },

  {
    id: 'DOC-D04-GIS-MAINT-01',
    documentNumber: 'EPEDE-D04-PRO-GIS-MAINT-01',
    title_fr: 'Guide d\'Inspection & Maintenance Préventive · Poste Blindé Sous Enveloppe Métallique (GIS) 225 kV',
    title_en: 'Preventive Maintenance & Inspection Guideline · 225 kV Gas-Insulated Substation (GIS)',
    documentType: 'MAINTENANCE_MANUAL',
    domainCode: 'D04',
    subdomainCode: 'D04.01',
    systemCode: 'SYS-GIS-SUBSTATION',
    primaryEquipmentId: 'eq-cb-sf6-225-01',
    relatedEquipmentIds: ['eq-cb-sf6-225-01', 'node-trafo-main-30'],
    relatedComponentNames_fr: ['Compartiments étanches SF6 en alliage d\'aluminium', 'Densimètres à compensation de température', 'Capteurs de décharge partielle UHF internes', 'Mécanisme de commande à ressort disjoncteur'],
    relatedComponentNames_en: ['Aluminum alloy hermetic SF6 gas compartments', 'Temperature-compensated gas density monitors', 'Internal UHF partial discharge sensors', 'Spring-operated circuit breaker drive mechanism'],
    revision: 'Rev C',
    version: '2.0.0',
    status: 'CURRENT',
    date: '2024-01-18',
    source: 'CIGRE TB 740 / IEC 62271-203 GIS Maintenance Guide',
    language: 'BILINGUAL',
    verificationStatus: 'VERIFIED',
    documentOwner: 'Chief High Voltage Switchgear & GIS Maintenance Specialist',
    relatedProjectContext: {
      fr: 'Maintenance conditionnelle et surveillance du vieillissement des travées GIS 225 kV de Bekoko',
      en: 'Condition-Based Maintenance and Aging Assessment for Bekoko 225 kV GIS Switchgear'
    },
    relatedStandards: ['IEC 62271-203', 'IEC 60376', 'IEC 60480', 'CIGRE TB 740', 'IEC 62271-1'],
    summary_fr: 'Guide d\'ingénierie régissant les protocoles de maintenance périodique et conditionnelle des postes GIS 225 kV : contrôle de qualité du gaz SF6 (taux d\'humidité < 150 ppmv, produits de décomposition SO2 < 5 ppmv), détection UHF des décharges partielles (seuil < 5 pC), et contrôle de synchronisme des pôles de coupure (dispersion < 2 ms).',
    summary_en: 'Engineering guideline governing periodic and condition-based maintenance for 225 kV GIS substations: SF6 gas quality monitoring (moisture < 150 ppmv, SO2 decomposition products < 5 ppmv), UHF partial discharge measurement (< 5 pC sensitivity threshold), and pole pole-span opening synchronism verification (< 2 ms).',
    tableOfContents_fr: [
      '1. Sécurité du Personnel & Manipulation Responsable du Gaz SF6 selon CEI 60480',
      '2. Diagnostic Qualité SF6 : Pression, Humidité & Recherche de Fuites Infrarouge',
      '3. Surveillance des Décharges Partielles par Sondes UHF Internes & Cartographie PRPD',
      '4. Contrôle Dynamique des Contacts & Temps de Déclenchement / Enclenchement',
      '5. Mesure de Résistance de Contact Principale par Micro-Ohmmètre (Injection 100 A DC)',
      '6. Procédure de Remplissage, Récupération & Traçabilité Environnementale du SF6'
    ],
    tableOfContents_en: [
      '1. Personnel Safety & Responsible SF6 Handling Standards per IEC 60480',
      '2. SF6 Gas Quality Assessment: Pressure, Moisture Content & Infrared Optical Gas Imaging',
      '3. UHF Partial Discharge Condition Monitoring & PRPD Phase-Resolved Pattern Analysis',
      '4. Dynamic Contact Timing & Circuit Breaker Operating Sequence Verification',
      '5. Main Circuit Contact Resistance Measurement via 100 A DC Micro-Ohmmeter',
      '6. Gas Evacuation, Reclaiming & Environmental Greenhouse Accounting Procedure'
    ],
    isConceptual: false,
    hasAttachmentUrl: false,
    structuredSpecifications: [
      {
        category: 'SAFETY',
        title_fr: 'Critères de Qualité SF6 & Décharges Partielles',
        title_en: 'SF6 Quality & Partial Discharge Limits',
        parameters: [
          { key: 'sf6_moisture_limit', label_fr: 'Teneur Maximale en Eau du Gaz SF6', label_en: 'Maximum SF6 Moisture Content', value: '< 150', unit: 'ppmv (à 20°C)', status: 'VERIFIED' },
          { key: 'so2_decomposition_limit', label_fr: 'Teneur Maximale en Sous-Produit SO2', label_en: 'Maximum SO2 Decomposition Product', value: '< 5.0', unit: 'ppmv', status: 'VERIFIED' },
          { key: 'uhf_pd_sensitivity', label_fr: 'Sensibilité Détection Décharges Partielles', label_en: 'UHF Partial Discharge Sensitivity', value: '< 5', unit: 'pC', status: 'VERIFIED' },
          { key: 'contact_resistance_main', label_fr: 'Résistance de Contact par Pôle', label_en: 'Main Contact Resistance per Pole', value: '< 35.0', unit: 'µΩ', status: 'VERIFIED' }
        ]
      }
    ]
  }
];

/**
 * Returns all documents for a given domain code
 */
export function getDocumentsForDomain(domainCode: string): EpedeDocumentRecord[] {
  return EPEDE_DOCUMENTATION_REGISTRY.filter((d) => d.domainCode === domainCode);
}

/**
 * Returns all documents linked to a specific equipment ID
 */
export function getDocumentsForEquipment(equipmentId: string): EpedeDocumentRecord[] {
  return EPEDE_DOCUMENTATION_REGISTRY.filter(
    (d) => d.primaryEquipmentId === equipmentId || d.relatedEquipmentIds.includes(equipmentId)
  );
}

/**
 * Returns document by ID
 */
export function getDocumentById(docId: string): EpedeDocumentRecord | undefined {
  return EPEDE_DOCUMENTATION_REGISTRY.find((d) => d.id === docId);
}
