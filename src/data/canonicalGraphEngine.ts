// src/data/canonicalGraphEngine.ts
// EPEDE Canonical Engineering Knowledge Graph & Bidirectional Traversal Engine
// Implements the Hydro-to-Motor vertical slice and cross-discipline navigation.

import {
  CanonicalGraphNode,
  CanonicalGraphEdge,
  EngineeringContextStack,
  AuxiliaryPowerSystem,
  EarthingRegime,
} from '../types/epede';

// Standard Substation Auxiliary Power Systems for the Slice
export const OYOMABANG_AUXILIARY_SYSTEM: AuxiliaryPowerSystem = {
  id: 'aux-sub-oyomabang',
  name: 'Services Auxiliaires Poste 225/30 kV Oyomabang',
  substationId: 'node-sub-oyomabang',
  acSystem: {
    source: 'Transformateur des Services Auxiliaires (TSA) 30 kV / 400 V - 250 kVA',
    backupGenerator: 'Groupe Électrogène Diesel de Secours 160 kVA avec Inverseur Normal/Secours (ATS)',
    voltageVac: 400,
    frequencyHz: 50,
  },
  dcSystem: {
    nominalVoltageVdc: 110,
    batteryType: 'Ni-Cd',
    capacityAh: 220,
    autonomyHours: 10,
    redundantChargers: true,
    unearthAlarmRelay: true,
  },
};

// Complete Canonical Nodes for the Vertical Slice
export const CANONICAL_GRAPH_NODES: CanonicalGraphNode[] = [
  // -------------------------------------------------------------
  // PHYSICAL ENERGY SPINE: Generation -> Transmission -> Distribution -> Load
  // -------------------------------------------------------------
  {
    id: 'node-plant-songloulou',
    name: {
      fr: 'Centrale Hydroélectrique de Songloulou',
      en: 'Songloulou Hydroelectric Power Plant',
    },
    entityType: 'plant',
    domainCode: 'D01',
    voltageLevel: 'HV',
    tag: '==H1.PL01',
    description: {
      fr: 'Principale centrale hydroélectrique du Réseau Interconnecté Sud (RIS), sur le fleuve Sanaga. 8 groupes turbo-alternateurs Francis de 48 MVA pour une puissance totale de 384 MW.',
      en: 'Primary hydroelectric power station of the Southern Interconnected Grid (RIS) on the Sanaga River. 8 Francis hydro-generator units of 48 MVA totaling 384 MW.',
    },
    technicalSpecs: {
      capacity_mw: 384,
      head_m: 39,
      flow_rate_m3s: 1100,
      turbines: '8x Francis',
      river: 'Sanaga',
      grid: 'RIS Cameroon',
    },
    provenance: {
      id: 'prov-plant-song',
      entity_id: 'node-plant-songloulou',
      entity_type: 'plant',
      source_ref: 'SONATREL / Eneo Master Plan 2022',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Grid Architecture Board',
      verified_at: '2024-01-15',
    },
  },
  {
    id: 'node-gen-g1',
    name: {
      fr: 'Alternateur Hydroélectrique G1 (48 MVA)',
      en: 'Hydro Generator G1 (48 MVA)',
    },
    entityType: 'equipment',
    domainCode: 'D01',
    voltageLevel: 'HV',
    tag: '--G01',
    description: {
      fr: 'Alternateur synchrone à pôles saillants entraîné par turbine Francis. Vitesse nominale 150 tr/min (40 pôles, 50 Hz). Neutre mis à la terre par transformateur de distribution avec résistance.',
      en: 'Salient-pole synchronous generator driven by Francis turbine. Rated speed 150 rpm (40 poles, 50 Hz). Neutral grounded via distribution transformer with secondary resistor.',
    },
    technicalSpecs: {
      rated_apparent_power_mva: 48,
      rated_active_power_mw: 40.8,
      rated_voltage_kv: 10.5,
      power_factor: 0.85,
      rated_current_a: 2639,
      frequency_hz: 50,
      speed_rpm: 150,
      inertia_constant_h_s: 3.85,
      reactance_xd_pu: 1.15,
      reactance_xd_prime_pu: 0.32,
      reactance_xd_second_pu: 0.22,
    },
    earthingRegime: 'NGR',
    provenance: {
      id: 'prov-gen-g1',
      entity_id: 'node-gen-g1',
      entity_type: 'equipment',
      source_ref: 'Manufacturer Nameplate / IEC 60034-1',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Power Systems Engineer',
      verified_at: '2024-01-20',
    },
  },
  {
    id: 'node-trafo-gsu',
    name: {
      fr: 'Transformateur Élévateur Principal T1 (10.5/225 kV - 50 MVA)',
      en: 'Generator Step-Up Transformer T1 (10.5/225 kV - 50 MVA)',
    },
    entityType: 'equipment',
    domainCode: 'D04',
    voltageLevel: 'HV',
    tag: '--T01.GSU',
    description: {
      fr: 'Transformateur de bloc élévateur à huile immergée raccordant le générateur G1 au jeu de barres 225 kV du poste extérieur. Couplage Dyn11, neutre 225 kV directement à la terre.',
      en: 'Oil-immersed generator step-up (GSU) transformer connecting G1 to the 225 kV switchyard busbar. Vector group Dyn11, 225 kV neutral solidly grounded.',
    },
    technicalSpecs: {
      rated_power_mva: 50,
      primary_voltage_kv: 10.5,
      secondary_voltage_kv: 225,
      vector_group: 'Dyn11',
      impedance_voltage_uk_percent: 12.5,
      cooling_type: 'ONAF',
      no_load_losses_kw: 38,
      load_losses_kw: 185,
      insulation_level_bil_kv: 1050,
    },
    earthingRegime: 'Solid',
    provenance: {
      id: 'prov-trafo-gsu',
      entity_id: 'node-trafo-gsu',
      entity_type: 'equipment',
      source_ref: 'IEC 60076-1 / FAT Report',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Engineer',
      verified_at: '2024-02-01',
    },
  },
  {
    id: 'node-bay-song-225',
    name: {
      fr: 'Travée Départ Ligne 225 kV Songloulou (Songloulou – Bekoko)',
      en: 'Songloulou 225 kV Line Feeder Bay (Songloulou – Bekoko)',
    },
    entityType: 'equipment',
    domainCode: 'D04',
    voltageLevel: 'HV',
    tag: '=BAY.225.SONG',
    description: {
      fr: 'Travée de départ ligne 225 kV du poste extérieur de Songloulou. Comprend le disjoncteur SF6 tripolaire 245 kV 40 kA (Q0), deux sectionneurs d’aiguillage barres (Q1/Q2), sectionneur de terre rapide (Q8), réducteurs de mesure combinés TC/TT et contrôleur de travée (BCU) IEC 61850.',
      en: '225 kV line feeder bay at Songloulou outdoor switchyard. Comprises 245 kV 40 kA SF6 circuit breaker (Q0), two busbar selector disconnectors (Q1/Q2), high-speed earth switch (Q8), instrument transformers, and IEC 61850 Bay Control Unit (BCU).',
    },
    technicalSpecs: {
      nominal_voltage_kv: 225,
      highest_voltage_kv: 245,
      rated_current_a: 3150,
      short_circuit_withstand_ka: 40,
      breaking_medium: 'SF6 Gas (0.6 MPa)',
      operating_sequence: 'O - 0.3s - CO - 3min - CO',
      control_protocol: 'IEC 61850 Edition 2 (MMS & GOOSE)',
    },
    earthingRegime: 'Solid',
    auxiliarySystem: OYOMABANG_AUXILIARY_SYSTEM,
    provenance: {
      id: 'prov-bay-song-225',
      entity_id: 'node-bay-song-225',
      entity_type: 'equipment',
      source_ref: 'SONATREL Substation Architecture Standard & IEC 62271-100',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE High-Voltage Switchgear Engineer',
      verified_at: '2024-02-05',
    },
  },
  {
    id: 'node-line-225-bekoko',
    name: {
      fr: 'Ligne de Transport 225 kV Bekoko – Oyomabang (120 km)',
      en: '225 kV Transmission Line Bekoko – Oyomabang (120 km)',
    },
    entityType: 'equipment',
    domainCode: 'D03',
    voltageLevel: 'HV',
    tag: '==L225.BK-OY',
    description: {
      fr: 'Artère dorsale de transport 225 kV reliant la côte (Bekoko/Mangombé) au centre de consommation de Yaoundé (Oyomabang). Câbles conducteurs Almelec/Aster 570 avec câble de garde optique (OPGW).',
      en: 'High-voltage 225 kV backbone corridor connecting coastal generation to Yaoundé load center. Almelec/Aster 570 conductors with OPGW shield wire.',
    },
    technicalSpecs: {
      nominal_voltage_kv: 225,
      length_km: 120,
      conductor_type: 'Aster 570 AAAC',
      thermal_capacity_mva: 310,
      surge_impedance_loading_sil_mw: 140,
      resistance_ohm_per_km: 0.058,
      reactance_ohm_per_km: 0.405,
      capacitance_nf_per_km: 9.4,
      total_reactance_ohm: 48.6,
    },
    earthingRegime: 'Solid',
    provenance: {
      id: 'prov-line-225',
      entity_id: 'node-line-225-bekoko',
      entity_type: 'equipment',
      source_ref: 'SONATREL Line Data / CIGRE TB 601',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Transmission Engineer',
      verified_at: '2024-02-10',
    },
  },
  {
    id: 'node-sub-oyomabang',
    name: {
      fr: 'Poste d’Interconnexion 225/30 kV d’Oyomabang (Yaoundé)',
      en: 'Oyomabang 225/30 kV Transmission Substation (Yaoundé)',
    },
    entityType: 'plant',
    domainCode: 'D04',
    voltageLevel: 'HV',
    tag: '==SS.OYOMABANG',
    description: {
      fr: 'Nœud stratégique d’abaissement et de répartition alimentant la capitale Yaoundé. Comprend 2 jeux de barres 225 kV avec disjoncteur de couplage, travées départs lignes et 3 transformateurs 225/30 kV.',
      en: 'Strategic 225/30 kV step-down and switching node supplying the capital city of Yaoundé. Features double 225 kV busbars, coupler bay, line feeders, and three 225/30 kV transformers.',
    },
    technicalSpecs: {
      short_circuit_level_ka: 31.5,
      bus_scheme: 'Double Bus with Bus Coupler (Double Jeu de Barres)',
      installed_capacity_mva: 189,
      elevation_m: 760,
      lightning_density_ng: 8.5,
    },
    earthingRegime: 'Solid',
    auxiliarySystem: OYOMABANG_AUXILIARY_SYSTEM,
    provenance: {
      id: 'prov-sub-oyo',
      entity_id: 'node-sub-oyomabang',
      entity_type: 'plant',
      source_ref: 'SONATREL Single Line Diagram Rev E',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Engineer',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-trafo-main-30',
    name: {
      fr: 'Transformateur Abaisseur T2 (225/30 kV - 63 MVA)',
      en: 'Main Step-Down Transformer T2 (225/30 kV - 63 MVA)',
    },
    entityType: 'equipment',
    domainCode: 'D04',
    voltageLevel: 'HV',
    tag: '--T02.OYO',
    description: {
      fr: 'Transformateur de puissance abaisseur alimentant les départs 30 kV de Yaoundé Ouest. Régleur en charge (OLTC) sous vide ±10×1.25%. Neutre 30 kV relié à la terre via résistance 40 Ω (40 A).',
      en: 'High-voltage step-down power transformer feeding Yaoundé West 30 kV distribution network. Vacuum OLTC ±10×1.25%. 30 kV neutral grounded via 40 Ω (40 A) resistor.',
    },
    technicalSpecs: {
      rated_power_mva: 63,
      primary_voltage_kv: 225,
      secondary_voltage_kv: 30,
      vector_group: 'YNd11',
      impedance_voltage_uk_percent: 14.0,
      cooling_type: 'ONAN/ONAF',
      oltc_type: 'Vacuum Tap Changer (MR Reinhausen)',
      tap_range: '±10 steps of 1.25%',
    },
    earthingRegime: 'NGR',
    auxiliarySystem: OYOMABANG_AUXILIARY_SYSTEM,
    provenance: {
      id: 'prov-trafo-main-30',
      entity_id: 'node-trafo-main-30',
      entity_type: 'equipment',
      source_ref: 'IEC 60076 / Transformer Test Certificate',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Engineer',
      verified_at: '2024-02-20',
    },
  },
  {
    id: 'node-feeder-30-ind',
    name: {
      fr: 'Départ Distribution HTA 30 kV – Zone Industrielle (Départ 4)',
      en: '30 kV MV Distribution Feeder – Industrial Zone (Feeder 4)',
    },
    entityType: 'equipment',
    domainCode: 'D05',
    voltageLevel: 'MV',
    tag: '==F30.04',
    description: {
      fr: 'Départ souterrain 30 kV sous cellules blindées SF6/Vide alimentant la zone industrielle. Câble tripolaire aluminium XLPE 3×1×240 mm² avec protection numérique 50/51/51N.',
      en: 'Underground 30 kV feeder fed from metal-clad switchgear supplying industrial consumers. 3x1x240 mm² Al XLPE cable equipped with digital 50/51/51N protection.',
    },
    technicalSpecs: {
      voltage_kv: 30,
      rated_current_a: 420,
      cable_type: 'AL / XLPE / CTS / PVC 240 mm²',
      length_km: 8.5,
      short_circuit_capacity_ka: 16,
      earthing: 'NGR limit 40 A',
    },
    earthingRegime: 'NGR',
    provenance: {
      id: 'prov-feeder-30',
      entity_id: 'node-feeder-30-ind',
      entity_type: 'equipment',
      source_ref: 'Distribution Network Code / IEC 60502-2',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Distribution Engineer',
      verified_at: '2024-03-01',
    },
  },
  {
    id: 'node-trafo-mv-lv',
    name: {
      fr: 'Poste Transformateur HTA/BT Privé Client (30 kV / 400 V - 1600 kVA)',
      en: 'Industrial Substation MV/LV Transformer (30 kV / 400 V - 1600 kVA)',
    },
    entityType: 'equipment',
    domainCode: 'D05',
    voltageLevel: 'MV',
    tag: '--T.IND.1600',
    description: {
      fr: 'Transformateur de distribution immergé dans l’huile végétale diélectrique, abaissement 30 kV vers 400 V triphasé. Couplage Dyn11 avec neutre BT raccordé à la terre (Schéma TN-S).',
      en: 'Distribution transformer filled with biodegradable ester fluid, stepping down 30 kV to 400 V three-phase. Vector group Dyn11 with LV neutral grounded (TN-S earthing scheme).',
    },
    technicalSpecs: {
      rated_power_kva: 1600,
      primary_voltage_kv: 30,
      secondary_voltage_v: 400,
      rated_current_lv_a: 2309,
      vector_group: 'Dyn11',
      short_circuit_impedance_percent: 6.0,
      no_load_losses_w: 1650,
      load_losses_w: 14000,
    },
    earthingRegime: 'TN-S',
    provenance: {
      id: 'prov-trafo-mv-lv',
      entity_id: 'node-trafo-mv-lv',
      entity_type: 'equipment',
      source_ref: 'IEC 60076 / CENELEC EN 50588-1 EcoDesign',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Industrial Systems Engineer',
      verified_at: '2024-03-05',
    },
  },
  {
    id: 'node-trafo-client-bt',
    name: {
      fr: 'Poste de Livraison HTA/BT Client Privé (H61 / Cabine)',
      en: 'Private Customer MV/LV Step-Down Substation (H61 / Kiosk)',
    },
    entityType: 'equipment',
    domainCode: 'D05',
    voltageLevel: 'MV',
    tag: '=SS.CLI.BT',
    description: {
      fr: 'Poste de livraison et de transformation 30 kV / 400 V alimentant le site industriel ou tertiaire client. Intègre une cellule arrivée interrupteur-sectionneur, protection par fusibles combinés ou disjoncteur avec relais VIP400, et transformateur 30 kV / 400 V.',
      en: 'Customer MV/LV distribution substation stepping down 30 kV to 400 V. Features MV load-break switch ring main unit, fuse or circuit breaker protection with self-powered relay, and step-down distribution transformer.',
    },
    technicalSpecs: {
      primary_voltage_kv: 30,
      secondary_voltage_v: 400,
      rated_power_kva: 1600,
      vector_group: 'Dyn11',
      protection_type: 'Relais Numérique Auto-alimenté VIP / Fusibles HPC',
      metering_class: 'Classe 0.2S (Comptage Frontière Eneo)',
    },
    earthingRegime: 'TN-S',
    provenance: {
      id: 'prov-trafo-client-bt',
      entity_id: 'node-trafo-client-bt',
      entity_type: 'equipment',
      source_ref: 'Norme NF C 13-100 / Guide Eneo Raccordement MT 2024',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Distribution & Grid Code Specialist',
      verified_at: '2024-03-08',
    },
  },
  {
    id: 'node-tgbt-400',
    name: {
      fr: 'Tableau Général Basse Tension (TGBT 400 V - 2500 A)',
      en: 'Main Low Voltage Switchboard (TGBT 400 V - 2500 A)',
    },
    entityType: 'equipment',
    domainCode: 'D06',
    voltageLevel: 'LV',
    tag: '==TGBT.IND',
    description: {
      fr: 'Armoire de distribution principale basse tension sous forme de séparation 4b per IEC 61439-2. Disjoncteur général ouvert (ACB) 3200 A débrochable avec déclencheur électronique Micrologic.',
      en: 'Main low voltage distribution switchboard in Form 4b internal separation per IEC 61439-2. Main drawout Air Circuit Breaker (ACB) 3200 A with electronic trip unit.',
    },
    technicalSpecs: {
      nominal_voltage_v: 400,
      rated_current_a: 2500,
      short_time_withstand_icw_ka_1s: 65,
      peak_withstand_ipk_ka: 143,
      form_of_separation: 'Form 4b',
      ip_code: 'IP42',
      earthing_system: 'TN-S (Neutre et PE séparés)',
    },
    earthingRegime: 'TN-S',
    provenance: {
      id: 'prov-tgbt-400',
      entity_id: 'node-tgbt-400',
      entity_type: 'equipment',
      source_ref: 'IEC 61439-1 / IEC 61439-2 Certificate',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE LV Switchgear Specialist',
      verified_at: '2024-03-10',
    },
  },
  {
    id: 'node-motor-250',
    name: {
      fr: 'Moteur Électrique d’Exhaure Poussoir (250 kW - 400 V)',
      en: 'Heavy Industrial Induction Motor Drive (250 kW - 400 V)',
    },
    entityType: 'equipment',
    domainCode: 'D10',
    voltageLevel: 'LV',
    tag: '--M01.PUMP',
    description: {
      fr: 'Moteur asynchrone triphasé à cage d’écureuil haut rendement IE3 entraînant une pompe de relevage industrielle. Démarrage par démarreur progressif avec protection thermique moteur ANSI 49/51.',
      en: 'Three-phase squirrel-cage premium efficiency IE3 induction motor driving an industrial water pump. Soft-starter controlled with ANSI 49/51 motor thermal protection.',
    },
    technicalSpecs: {
      rated_power_kw: 250,
      rated_voltage_v: 400,
      rated_current_a: 432,
      power_factor: 0.88,
      efficiency_percent: 96.0,
      speed_rpm: 1485,
      starting_current_ratio: 6.8,
      insulation_class: 'Class H (échauffement B)',
      cooling: 'IC 411 TEFC',
    },
    earthingRegime: 'TN-S',
    provenance: {
      id: 'prov-motor-250',
      entity_id: 'node-motor-250',
      entity_type: 'equipment',
      source_ref: 'IEC 60034-1 / IEC 60034-30-1 IE3 Rating',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Industrial Drive Specialist',
      verified_at: '2024-03-15',
    },
  },

  // -------------------------------------------------------------
  // TRANSVERSAL NODES: Protection, Instrumentation, Automation, Standards, Maintenance, Roles
  // -------------------------------------------------------------
  {
    id: 'node-prot-87g',
    name: {
      fr: 'Protection Différentielle Alternateur (ANSI 87G)',
      en: 'Generator Differential Protection (ANSI 87G)',
    },
    entityType: 'protection_function',
    domainCode: 'D11',
    description: {
      fr: 'Protection différentielle statorique à fort pourcentage détectant instantanément les courts-circuits entre phases dans les enroulements du générateur G1.',
      en: 'Percentage-biased stator differential protection detecting instantaneous phase-to-phase faults inside generator G1 windings.',
    },
    technicalSpecs: {
      ansi_code: '87G',
      operating_time_ms: 25,
      pickup_current_pu: 0.15,
      bias_slope_1_percent: 20,
      bias_slope_2_percent: 60,
    },
    provenance: {
      id: 'prov-p87g',
      entity_id: 'node-prot-87g',
      entity_type: 'protection_function',
      source_ref: 'IEC 60255-151 / IEEE C37.102',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Protection Board',
      verified_at: '2024-02-01',
    },
  },
  {
    id: 'node-prot-87t',
    name: {
      fr: 'Protection Différentielle Transformateur (ANSI 87T)',
      en: 'Transformer Differential Protection (ANSI 87T)',
    },
    entityType: 'protection_function',
    domainCode: 'D11',
    description: {
      fr: 'Protection différentielle numérique avec retenue d’harmonique 2 (courant d’enclenchement inrush) et harmonique 5 (surfluxage magnétique). Couvre la zone entre les TC HT et BT.',
      en: 'Numerical differential protection with 2nd harmonic inrush restraint and 5th harmonic overexcitation restraint covering HV and LV CT boundary zones.',
    },
    technicalSpecs: {
      ansi_code: '87T',
      operating_time_ms: 30,
      harmonic_2_restraint_percent: 15,
      harmonic_5_restraint_percent: 35,
    },
    provenance: {
      id: 'prov-p87t',
      entity_id: 'node-prot-87t',
      entity_type: 'protection_function',
      source_ref: 'IEC 60255-151 / IEEE C37.91',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Protection Board',
      verified_at: '2024-02-01',
    },
  },
  {
    id: 'node-prot-21',
    name: {
      fr: 'Protection de Distance Numérique Ligne (ANSI 21/21N)',
      en: 'Line Distance Protection Relay (ANSI 21/21N)',
    },
    entityType: 'protection_function',
    domainCode: 'D11',
    description: {
      fr: 'Relais à caractéristique quadrilatérale/mho mesurant l’impédance de boucle Z = U/I. Zone 1 instantanée à 80-85% de la ligne, Zone 2 temporisée à 120%, Zone 3 de secours.',
      en: 'Distance relay measuring loop impedance Z = U/I. Zone 1 instantaneous at 80-85% of line length, Zone 2 timed at 120%, Zone 3 reverse/remote backup.',
    },
    technicalSpecs: {
      ansi_code: '21 / 21N',
      zone1_reach_percent: 85,
      zone1_time_ms: 20,
      zone2_time_ms: 300,
      zone3_time_ms: 800,
    },
    provenance: {
      id: 'prov-p21',
      entity_id: 'node-prot-21',
      entity_type: 'protection_function',
      source_ref: 'IEC 60255-121 / IEEE C37.113',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Protection Board',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-prot-50-51',
    name: {
      fr: 'Protection à Maximum de Courant et Terre (ANSI 50/51/51N)',
      en: 'Overcurrent & Earth Fault Relay (ANSI 50/51/51N)',
    },
    entityType: 'protection_function',
    domainCode: 'D11',
    description: {
      fr: 'Relais numérique à temps inverse (IEC Courbe Normale Inverse) assurant la sélectivité ampèremétrique et chronométrique sur le départ 30 kV avec échelonnement de 250 ms.',
      en: 'Numerical inverse-time relay (IEC Normal Inverse curve) ensuring current and time grading on the 30 kV feeder with 250 ms coordination margins.',
    },
    technicalSpecs: {
      ansi_code: '50 / 51 / 51N',
      iec_curve: 'Normal Inverse (NI)',
      tms_time_multiplier: 0.15,
      pickup_current_a: 420,
      earth_pickup_a: 10,
    },
    provenance: {
      id: 'prov-p51',
      entity_id: 'node-prot-50-51',
      entity_type: 'protection_function',
      source_ref: 'IEC 60255-151 Curve Equation',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Protection Board',
      verified_at: '2024-02-25',
    },
  },
  {
    id: 'node-prot-buchholz',
    name: {
      fr: 'Relais Buchholz & Soupape de Surpression (ANSI 63)',
      en: 'Buchholz Gas & Oil Surge Relay (ANSI 63)',
    },
    entityType: 'protection_function',
    domainCode: 'D11',
    description: {
      fr: 'Dispositif mécanique monté sur la tuyauterie entre la cuve et le conservateur. Flotteur 1 : Alarme dégagement gazeux lent. Flotteur 2 : Déclenchement instantané sur coup d’huile (arc interne).',
      en: 'Mechanical protection located between main tank and conservator. Float 1: Alarm on slow gas accumulation. Float 2: Instantaneous trip on oil surge (>1.5 m/s) caused by internal arcing.',
    },
    technicalSpecs: {
      ansi_code: '63',
      stage1: 'Gas Alarm (150-250 cm³)',
      stage2: 'Oil Surge Trip (1.5 m/s velocity)',
      standards: 'IEC 60076-22-1',
    },
    provenance: {
      id: 'prov-buchholz',
      entity_id: 'node-prot-buchholz',
      entity_type: 'protection_function',
      source_ref: 'IEC 60076-22-1 / Transformer Protection Guide',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Engineer',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-auto-sas',
    name: {
      fr: 'Système d’Automatisation de Poste (SAS / IEC 61850)',
      en: 'Substation Automation System (SAS / IEC 61850)',
    },
    entityType: 'telecom_system',
    domainCode: 'D13',
    description: {
      fr: 'Architecture de contrôle-commande numérique de poste. Réseau Station Bus en anneau redondant PRP avec messages GOOSE haute vitesse (<4 ms) pour les verrouillages inter-tranches.',
      en: 'Digital substation automation system. Redundant PRP Station Bus architecture utilizing high-speed GOOSE messages (<4 ms) for peer-to-peer inter-bay interlocking.',
    },
    technicalSpecs: {
      standard: 'IEC 61850 Edition 2.1',
      bus_architecture: 'PRP (Parallel Redundancy Protocol)',
      goose_latency_ms: 3.5,
      time_sync: 'IEEE 1588v2 PTP (< 1 µs accuracy)',
    },
    provenance: {
      id: 'prov-sas',
      entity_id: 'node-auto-sas',
      entity_type: 'telecom_system',
      source_ref: 'IEC 61850-90-4 Substation Network Guidelines',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE OT Telecom Specialist',
      verified_at: '2024-03-01',
    },
  },
  {
    id: 'node-auto-scada-ems',
    name: {
      fr: 'Téléconduite Dispatching National EMS (IEC 60870-5-104)',
      en: 'National Dispatching Control Center EMS (IEC 60870-5-104)',
    },
    entityType: 'control_function',
    domainCode: 'D12',
    description: {
      fr: 'Système de téléconduite à distance du centre national de conduite (CNC). Échange télémésures, états télésignalés et télécommandes validées SBO (Select-Before-Operate) via fibre optique OPGW.',
      en: 'Remote supervisory dispatching system from National Control Center. Exchanges analog telemetry, digital indications, and SBO commands via OPGW fiber optics.',
    },
    technicalSpecs: {
      protocol: 'IEC 60870-5-104 over TCP/IP',
      command_validation: 'Select-Before-Operate (SBO)',
      timestamp_resolution_ms: 1,
      security: 'IEC 62351 TLS encryption',
    },
    provenance: {
      id: 'prov-scada',
      entity_id: 'node-auto-scada-ems',
      entity_type: 'control_function',
      source_ref: 'SONATREL National Dispatching Specification',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE SCADA Architect',
      verified_at: '2024-03-05',
    },
  },
  {
    id: 'node-std-60076',
    name: {
      fr: 'Norme IEC 60076 – Transformateurs de Puissance',
      en: 'Standard IEC 60076 – Power Transformers',
    },
    entityType: 'standard',
    domainCode: 'D07',
    description: {
      fr: 'Ensemble normatif international régissant les règles de calcul thermique, tenue aux courts-circuits, niveaux d’isolement et essais de recette en usine (FAT) des transformateurs de puissance.',
      en: 'International standard governing thermal design rules, short-circuit withstand, insulation coordination, and Factory Acceptance Tests (FAT) for power transformers.',
    },
    technicalSpecs: {
      standard_code: 'IEC 60076-1 to 5',
      key_clauses: 'Part 1: General, Part 2: Temp rise, Part 3: Insulation, Part 5: Short-circuit ability',
    },
    provenance: {
      id: 'prov-std-76',
      entity_id: 'node-std-60076',
      entity_type: 'standard',
      source_ref: 'International Electrotechnical Commission',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Standards Editor',
      verified_at: '2024-01-01',
    },
  },
  {
    id: 'node-std-60909',
    name: {
      fr: 'Norme IEC 60909 – Courants de Court-Circuit Triphasés',
      en: 'Standard IEC 60909 – Short-Circuit Currents in AC Systems',
    },
    entityType: 'standard',
    domainCode: 'D07',
    description: {
      fr: 'Méthode de calcul normalisée des impédances équivalentes et courants de court-circuit symétriques et asymétriques (Ik", Ip, Ib, Ik) au point de défaut avec coefficient de tension c.',
      en: 'Standard calculation methodology for equivalent impedances and symmetrical/asymmetrical fault currents (Ik", Ip, Ib, Ik) using voltage factor c.',
    },
    technicalSpecs: {
      standard_code: 'IEC 60909-0:2016',
      voltage_factor_cmax: '1.10 (EHV/HV), 1.05 (MV/LV)',
    },
    provenance: {
      id: 'prov-std-909',
      entity_id: 'node-std-60909',
      entity_type: 'standard',
      source_ref: 'International Electrotechnical Commission',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Calculation Lead',
      verified_at: '2024-01-01',
    },
  },
  {
    id: 'node-maint-dga',
    name: {
      fr: 'Analyse des Gaz Dissous dans l’Huile (DGA - Triangle de Duval)',
      en: 'Dissolved Gas Analysis in Transformer Oil (DGA - Duval Triangle)',
    },
    entityType: 'maintenance_activity',
    domainCode: 'D04',
    description: {
      fr: 'Diagnostic de maintenance prévisionnelle selon IEC 60599 et méthode de Duval (CH4, C2H4, C2H2). Permet de détecter sans ouverture de cuve les décharges partielles, échauffements thermiques et arcs internes.',
      en: 'Predictive maintenance diagnostic per IEC 60599 using Duval Triangle ratios (CH4, C2H4, C2H2). Detects partial discharges, thermal hotspots, and internal arcing without untanking.',
    },
    technicalSpecs: {
      frequency: 'Semestrielle / Annuelle',
      gases_ppm: 'H2, CH4, C2H6, C2H4, C2H2, CO, CO2',
      diagnostic_standard: 'IEC 60599 / IEEE C57.104',
    },
    provenance: {
      id: 'prov-dga',
      entity_id: 'node-maint-dga',
      entity_type: 'maintenance_activity',
      source_ref: 'CIGRE Technical Brochure 771',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Asset Management Lead',
      verified_at: '2024-03-01',
    },
  },
  {
    id: 'node-role-prot-eng',
    name: {
      fr: 'Ingénieur d’Études Protection & Contrôle-Commande',
      en: 'Protection & Control Systems Study Engineer',
    },
    entityType: 'role',
    domainCode: 'D11',
    description: {
      fr: 'Responsable du calcul des courants de défaut, de l’établissement des plans de protection, du choix des courbes de sélectivité (ANSI 50/51/21/87) et de la rédaction de la Note de Calcul de Réglage.',
      en: 'Responsible for fault current studies, protection architecture definition, selectivity coordination curves (ANSI 50/51/21/87), and authoring the Relay Setting Calculation Memo.',
    },
    technicalSpecs: {
      deliverables: 'Note de Calcul de Réglage, Courbes TCC, Fichiers de paramétrage relais',
      tools: 'ETAP, DIgSILENT PowerFactory, CAPE, EPEDE Selectivity Lab',
    },
    provenance: {
      id: 'prov-role-prot',
      entity_id: 'node-role-prot-eng',
      entity_type: 'role',
      source_ref: 'IEEE PES / CIGRE Study Committee B5',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Engineering Practice Board',
      verified_at: '2024-01-10',
    },
  },
  {
    id: 'node-deliv-calc-memo',
    name: {
      fr: 'Livrable : Note de Calcul Électrique & Plan de Réglage',
      en: 'Engineering Deliverable: Calculation Note & Relay Settings Memo',
    },
    entityType: 'deliverable',
    domainCode: 'D11',
    description: {
      fr: 'Document contractuel d’ingénierie détaillant les hypothèses de calcul, les courants de court-circuit IEC 60909, les marges de sélectivité chronométrique (Δt ≥ 250 ms) et le visa formel de l’ingénieur.',
      en: 'Formal contractual engineering document detailing calculation assumptions, IEC 60909 fault levels, selectivity grading margins (Δt ≥ 250 ms), and engineer sign-off blocks.',
    },
    technicalSpecs: {
      format: 'Formal PDF Report',
      sections: 'Design Basis, Single Line Diagram, Short Circuit Results, TCC Curves, Settings Table, Sign-off',
    },
    provenance: {
      id: 'prov-deliv-memo',
      entity_id: 'node-deliv-calc-memo',
      entity_type: 'deliverable',
      source_ref: 'FIDIC / EPC Engineering Deliverables Guidelines',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Engineering Practice Board',
      verified_at: '2024-01-10',
    },
  },
  // -------------------------------------------------------------
  // CROSS-DOMAIN ECOSYSTEM EXTENSIONS (D02, D05, D06, D07, D09, D11, D12, D13, D14, D15, D16)
  // -------------------------------------------------------------
  {
    id: 'node-scada-ems',
    name: {
      fr: 'Centre National de Conduite Réseau (SCADA / EMS)',
      en: 'National Grid Control Center (SCADA / EMS)',
    },
    entityType: 'system',
    domainCode: 'D06',
    voltageLevel: 'HV',
    tag: '==SCADA.NCC01',
    description: {
      fr: 'Système SCADA/EMS redondant assurant la téléconduite, l\'estimation d\'état, le dispatching économique et le contrôle AGC du réseau national interconnecté via protocoles CEI 60870-5-104 et ICCP (TASE.2).',
      en: 'Redundant SCADA/EMS system executing network telecontrol, state estimation, economic dispatch, and AGC frequency control over IEC 60870-5-104 and ICCP (TASE.2).',
    },
    technicalSpecs: {
      protocol: 'IEC 60870-5-104, ICCP TASE.2',
      redundancy: 'Dual Hot-Standby Quad-Server Architecture',
      refresh_rate_ms: 1000,
      historian_capacity_years: 10,
      cybersecurity_standard: 'IEC 62443-3-3 SL3',
    },
    provenance: {
      id: 'prov-scada-ems',
      entity_id: 'node-scada-ems',
      entity_type: 'system',
      source_ref: 'SONATREL National Dispatching Center Technical Architecture 2023',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Grid Architecture Board',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-tgbt-mcc',
    name: {
      fr: 'Tableau Général Basse Tension (TGBT / MCC Forme 4b)',
      en: 'Low Voltage Main Switchboard / Motor Control Center (Form 4b)',
    },
    entityType: 'equipment',
    domainCode: 'D05',
    voltageLevel: 'LV',
    tag: '=TGBT.MCC01',
    description: {
      fr: 'Tableau de distribution basse tension 400 V / 3200 A compartimenté Forme 4b avec tiroirs débrochables motorisés, disjoncteurs ouverts débrochables avec déclencheurs électroniques et communication Modbus-TCP.',
      en: '400 V / 3200 A Low Voltage Switchboard Form 4b with withdrawable motor starter buckets, air circuit breakers with micro-processor trip units and Modbus-TCP communication.',
    },
    technicalSpecs: {
      rated_current_a: 3200,
      rated_voltage_vac: 400,
      short_circuit_withstand_ka: 65,
      form_separation: 'Form 4b (IEC 61439-2)',
      ip_rating: 'IP42 / IP54 options',
      busbar_material: 'Cu-ETP Silver-plated copper',
    },
    earthingRegime: 'TN-S',
    provenance: {
      id: 'prov-tgbt-mcc',
      entity_id: 'node-tgbt-mcc',
      entity_type: 'equipment',
      source_ref: 'IEC 61439-1 & IEC 61439-2 Standard Switchgear Specification',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Industrial Engineering Board',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-fire-ssi',
    name: {
      fr: 'Système de Sécurité Incendie Transformateur (SSI / Déluge)',
      en: 'Transformer Fire Safety System (FSS / Deluge System)',
    },
    entityType: 'system',
    domainCode: 'D07',
    voltageLevel: 'LV',
    tag: '=SSI.TR01',
    description: {
      fr: 'Système de détection incendie optique infrarouge multi-spectre et extinction automatique par déluge eau pulvérisée haute pression asservi aux protections Buchholz et différentielle de cuve.',
      en: 'Triple-spectrum IR optical flame detection and automatic high-pressure water deluge system interlocked with transformer Buchholz and tank earth-fault protection.',
    },
    technicalSpecs: {
      detection_technology: 'Triple-IR (IR3) Flame Detectors + Linear Heat Detection Wire',
      extinction_medium: 'Water Spray Deluge with AFFF Foam Additive Option',
      flow_rate_lpm: 3200,
      response_time_s: 1.5,
      safety_standard: 'NFPA 15 / NFPA 850 / APSAD R1',
    },
    provenance: {
      id: 'prov-fire-ssi',
      entity_id: 'node-fire-ssi',
      entity_type: 'system',
      source_ref: 'NFPA 850 Recommended Practice for Electric Generating Plants and Substations',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Safety Engineering Board',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-ai-duval',
    name: {
      fr: 'Surveillance DGA en Ligne et Diagnostic IA Triangle de Duval',
      en: 'Online DGA Monitoring & AI Duval Triangle Health Index',
    },
    entityType: 'system',
    domainCode: 'D12',
    voltageLevel: 'HV',
    tag: '=AM.DGA01',
    description: {
      fr: 'Moniteur d\'analyse des gaz dissous (DGA 9 gaz) en ligne avec spectroscopie photoacoustique et moteur de diagnostic IA calculant le Health Index, la probabilité de défaillance et la cartographie selon Duval 1/4/5.',
      en: 'Online 9-gas Dissolved Gas Analysis monitor using photoacoustic spectroscopy with AI diagnostic engine computing Asset Health Index, failure probability, and Duval Pentagone/Triangle mapping.',
    },
    technicalSpecs: {
      measured_gases: 'H2, CH4, C2H6, C2H4, C2H2, CO, CO2, O2, N2, H2O',
      measurement_frequency_hours: 1,
      diagnostic_framework: 'IEEE C57.104-2019 / IEC 60599 / Duval Triangles 1, 4, 5',
      communication: 'IEC 61850 MMS / Modbus TCP / MQTT Sparkplug B',
    },
    provenance: {
      id: 'prov-ai-duval',
      entity_id: 'node-ai-duval',
      entity_type: 'system',
      source_ref: 'CIGRE WG A2.49 & IEEE C57.104 DGA Interpretation Guidelines',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Asset Management Practice',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-bess-10mwh',
    name: {
      fr: 'Système de Stockage d\'Énergie BESS 5 MW / 10 MWh LFP',
      en: 'Grid BESS Energy Storage System 5 MW / 10 MWh LFP',
    },
    entityType: 'system',
    domainCode: 'D09',
    voltageLevel: 'MV',
    tag: '=BESS.CONT01',
    description: {
      fr: 'Conteneur BESS modulaire Lithium-Fer-Phosphate (LFP) 5 MW / 10 MWh avec onduleur bidirectionnel 4 quadrants, BMS à 3 niveaux et système de gestion thermique liquide pour régulation de fréquence FFR et arbitrage.',
      en: '5 MW / 10 MWh Lithium-Iron-Phosphate (LFP) containerized BESS with 4-quadrant bidirectional PCS inverter, 3-tier BMS, and liquid thermal management for Fast Frequency Response (FFR) and arbitrage.',
    },
    technicalSpecs: {
      rated_power_mw: 5.0,
      rated_capacity_mwh: 10.0,
      cell_chemistry: 'LiFePO4 (LFP) 280Ah Prismatic',
      pcs_inverter_topology: 'Grid-Forming / Grid-Following MMC 4-Quadrant',
      response_time_ms: 20,
      round_trip_efficiency_pct: 88.5,
    },
    provenance: {
      id: 'prov-bess-10mwh',
      entity_id: 'node-bess-10mwh',
      entity_type: 'system',
      source_ref: 'IEC 62933-2-1 Electrical Energy Storage Systems Unit Specification',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Clean Energy Board',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-bcu-61850',
    name: {
      fr: 'Calculateur de Tranche / Bay Control Unit (BCU IEC 61850)',
      en: 'Bay Control Unit (BCU IEC 61850 MMS/GOOSE)',
    },
    entityType: 'equipment',
    domainCode: 'D06',
    voltageLevel: 'LV',
    tag: '-KF01',
    description: {
      fr: 'Contrôleur numérique de baie poste HTB/HTA assurant les interverrouillages logiques programmables, la synchronisation synchro-check 25, la télécommande et la publication GOOSE/MMS selon CEI 61850 Edition 2.1.',
      en: 'Digital bay control unit executing programmable logic interlocking, synchro-check 25, telecontrol command execution, and IEC 61850 Ed 2.1 GOOSE/MMS publishing over dual redundant PRP/HSR networks.',
    },
    technicalSpecs: {
      standard: 'IEC 61850-7-4, IEC 61850-8-1, IEC 61850-9-2LE',
      redundancy_protocol: 'PRP (IEC 62439-3 Clause 4) & HSR (Clause 5)',
      time_sync: 'IEEE 1588v2 PTP Power Profile (<1 µs accuracy)',
      logic_engine: 'IEC 61131-3 Function Block Diagram',
    },
    provenance: {
      id: 'prov-bcu-61850',
      entity_id: 'node-bcu-61850',
      entity_type: 'equipment',
      source_ref: 'CIGRE B5 Substation Automation Technical Guidelines',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Automation Practice',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-sw-iec61850',
    name: {
      fr: 'Commutateur Ethernet Industriel Durci IEC 62443-4-2 (Station Bus)',
      en: 'Ruggedized Industrial Managed Ethernet Switch IEC 62443-4-2 (Station Bus)',
    },
    entityType: 'equipment',
    domainCode: 'D14',
    voltageLevel: 'LV',
    tag: '=NET.SW01',
    description: {
      fr: 'Switch réseau durci niveau substation conforme CEI 61850-3 et IEEE 1613, supportant PRP/HSR, VLAN IEEE 802.1Q, filtrage MAC, 802.1X et durcissement cybersécurité CEI 62443-4-2 SL2.',
      en: 'Substation-grade ruggedized Ethernet switch meeting IEC 61850-3 and IEEE 1613, supporting PRP/HSR zero-failover, IEEE 802.1Q VLANs, MAC filtering, 802.1X, and IEC 62443-4-2 SL2 security hardening.',
    },
    technicalSpecs: {
      environmental_rating: 'IEC 61850-3 Class 2, IEEE 1613 Class 1',
      operating_temperature_c: '-40 to +85',
      security_level: 'IEC 62443-4-2 SL2 Ready',
      ports: '16x 100/1000Base-TX RJ45 + 4x 1000Base-FX SFP',
      emc_immunity_kv: '4 kV Fast Transient Burst / 2.5 kV Damped Oscillatory',
    },
    provenance: {
      id: 'prov-sw-iec61850',
      entity_id: 'node-sw-iec61850',
      entity_type: 'equipment',
      source_ref: 'IEC 61850-3 Substation Communication Network Equipment Specs',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Cybersecurity Engineering Practice',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-statcom-50mvar',
    name: {
      fr: 'Compensateur Statique d\'Énergie Réactive STATCOM ±50 Mvar (MMC)',
      en: 'Modular Multilevel STATCOM ±50 Mvar Fast Reactive Power Compensator',
    },
    entityType: 'equipment',
    domainCode: 'D11',
    voltageLevel: 'HV',
    tag: '=PQ.STAT01',
    description: {
      fr: 'Compensateur statique rapide basé sur convertisseur multiniveaux à structure modulaire (MMC) pour la régulation dynamique de tension du jeu de barres 225 kV, l\'amortissement des oscillations et la compensation de scintillement (flicker).',
      en: 'Fast static compensator based on Modular Multilevel Converter (MMC) architecture for dynamic 225 kV bus voltage regulation, power oscillation damping, and flicker suppression.',
    },
    technicalSpecs: {
      rated_reactive_power_mvar: 50,
      rated_voltage_kv: 225,
      converter_topology: 'MMC (Modular Multilevel Converter) IGBT 4.5 kV',
      response_time_ms: 15,
      losses_at_nominal_pct: 0.8,
    },
    provenance: {
      id: 'prov-statcom-50mvar',
      entity_id: 'node-statcom-50mvar',
      entity_type: 'equipment',
      source_ref: 'CIGRE WG B4.19 HVDC and FACTS Application Guide',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Power Quality Practice',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-ami-meter',
    name: {
      fr: 'Compteur Intelligent Triphasé AMI DLMS/COSEM (Smart Meter)',
      en: '3-Phase AMI Smart Meter DLMS/COSEM (Smart Grid)',
    },
    entityType: 'equipment',
    domainCode: 'D15',
    voltageLevel: 'LV',
    tag: '=SM.MTR01',
    description: {
      fr: 'Compteur électronique bidirectionnel haute précision classe 0.2S avec mesure 4 quadrants, télégestion DLMS/COSEM sécurisée par chiffrement AES-128 GCM, profil de charge 15 min et détection de fraude.',
      en: 'Bidirectional Class 0.2S smart meter featuring 4-quadrant metering, secure DLMS/COSEM telemanagement over AES-128 GCM encryption, 15-minute interval load profiling, and anti-tamper detection.',
    },
    technicalSpecs: {
      accuracy_class: 'Active Class 0.2S (IEC 62053-22), Reactive Class 0.5S',
      communication_media: 'Cellular 4G/NB-IoT & G3-PLC',
      security_suite: 'DLMS Security Suite 1 (AES-128-GCM)',
      power_quality_metrics: 'THD-U, THD-I, Sags/Swells, Power Factor',
    },
    provenance: {
      id: 'prov-ami-meter',
      entity_id: 'node-ami-meter',
      entity_type: 'equipment',
      source_ref: 'DLMS User Association Blue Book / Green Book Architecture',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Smart Grid Practice',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-grid-study-psse',
    name: {
      fr: 'Étude de Stabilité Dynamique N-1 et Plan de Défense Réseau',
      en: 'N-1 Dynamic Contingency Stability Study & Defense Plan',
    },
    entityType: 'deliverable',
    domainCode: 'D16',
    voltageLevel: 'HV',
    tag: '=STD.PSSE01',
    description: {
      fr: 'Rapport d\'ingénierie formel d\'étude électrotechnique modélisant le comportement transitoire du réseau interconnecté après perte de la ligne 225 kV ou déclenchement du groupe G1, définissant les seuils de délestage par sous-fréquence (UFLS 81L).',
      en: 'Formal electrical engineering study modeling transient stability of the interconnected transmission grid following N-1 loss of 225 kV line or tripping of G1, setting underfrequency load shedding (UFLS 81L) stages.',
    },
    technicalSpecs: {
      simulation_platform: 'PSS/E / DIgSILENT PowerFactory',
      contingency_criterion: 'N-1 Line tripping & Critical Clearing Time (CCT = 120 ms)',
      governor_model: 'HYGOV Francis Hydro Governor',
      defense_scheme: '5-Stage Under-frequency Load Shedding (49.0 - 48.0 Hz)',
    },
    provenance: {
      id: 'prov-grid-study',
      entity_id: 'node-grid-study-psse',
      entity_type: 'deliverable',
      source_ref: 'IEEE PES Transmission Planning Technical Technical Report',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Power System Planning Practice',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-earthing-grid',
    name: {
      fr: 'Grille de Mise à la Terre de Poste HTB (Maille Cuivre IEEE 80)',
      en: 'Substation Earthing Grid (IEEE 80 Copper Mesh Grounding Mat)',
    },
    entityType: 'system',
    domainCode: 'D13',
    voltageLevel: 'HV',
    tag: '=EARTH.GRID01',
    description: {
      fr: 'Réseau de terre maillé en cuivre nu 95 mm² enfoui à 0.8 m avec piquets verticaux forés de 6 m, dimensionné selon IEEE 80 pour garantir que les tensions de pas (Estep) et de contact (Etouch) restent inférieures aux seuils létaux sous courant de court-circuit de 31.5 kA pendant 0.5 s.',
      en: 'Equipotential bare copper mesh 95 mm² buried at 0.8 m depth with vertical driven 6 m ground rods, engineered per IEEE 80 to ensure step and touch potentials remain safe during 31.5 kA 0.5 s fault.',
    },
    technicalSpecs: {
      standard: 'IEEE Std 80-2013 / IEEE Std 81',
      conductor_cross_section_mm2: 95,
      grid_resistance_ohms: 0.42,
      max_fault_current_ka: 31.5,
      gravel_layer_thickness_cm: 15,
    },
    earthingRegime: 'Solid',
    provenance: {
      id: 'prov-earthing-grid',
      entity_id: 'node-earthing-grid',
      entity_type: 'system',
      source_ref: 'IEEE Guide for Safety in AC Substation Grounding (IEEE 80)',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Safety Engineering Practice',
      verified_at: '2024-02-15',
    },
  },
  {
    id: 'node-surge-arrester',
    name: {
      fr: 'Parafoudre à Oxyde de Zinc ZnO 225 kV Sans Éclateur (Classe 4)',
      en: '225 kV Gapless Metal-Oxide Surge Arrester (IEC 60099-4 Class 4)',
    },
    entityType: 'equipment',
    domainCode: 'D02',
    voltageLevel: 'HV',
    tag: '=L225.SA01',
    description: {
      fr: 'Parafoudre station class à varistances d\'oxyde de zinc (ZnO) sans éclateur sous enveloppe polymère composite avec dispositif d\'évacuation de surpression et compteur de décharge, protégeant l\'entrée de poste contre les ondes de choc de foudre et de manœuvre.',
      en: 'Station-class gapless zinc-oxide (ZnO) surge arrester in silicone composite housing with pressure relief device and surge counter, protecting line entrance and autotransformer against lightning and switching surges.',
    },
    technicalSpecs: {
      continuous_operating_voltage_uc_kv: 144,
      rated_voltage_ur_kv: 180,
      nominal_discharge_current_ka: 20,
      energy_absorption_capability_kj_per_kv: 10,
      classification: 'IEC 60099-4 Class 4 / Station High',
    },
    provenance: {
      id: 'prov-surge-arrester',
      entity_id: 'node-surge-arrester',
      entity_type: 'equipment',
      source_ref: 'IEC 60099-4 Metal-Oxide Surge Arresters for AC Systems',
      verification_status: 'verified',
      confidence: 0.95,
      verified_by: 'EPEDE Substation Equipment Practice',
      verified_at: '2024-02-15',
    },
  },
];

// Complete Canonical Directed Edges for the Slice (14 Formal Verbs)
export const CANONICAL_GRAPH_EDGES: CanonicalGraphEdge[] = [
  // Physical flow upstream to downstream:
  {
    id: 'e-plant-gen',
    sourceId: 'node-plant-songloulou',
    targetId: 'node-gen-g1',
    relation: 'contains',
    direction: 'out',
    description: { fr: 'La centrale contient 8 groupes alternateurs Francis', en: 'Plant houses 8 Francis hydro generator units' },
  },
  {
    id: 'e-gen-trafo-gsu',
    sourceId: 'node-gen-g1',
    targetId: 'node-trafo-gsu',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'L’alternateur 10.5 kV alimente le transformateur de bloc élévateur T1', en: 'Generator feeds 10.5 kV power to GSU step-up transformer' },
  },
  {
    id: 'e-gsu-bay',
    sourceId: 'node-trafo-gsu',
    targetId: 'node-bay-song-225',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'T1 injecte l’énergie 225 kV dans la travée départ ligne Songloulou', en: 'T1 supplies 225 kV power to Songloulou line feeder bay' },
  },
  {
    id: 'e-bay-line',
    sourceId: 'node-bay-song-225',
    targetId: 'node-line-225-bekoko',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'La travée 225 kV alimente la ligne de transport vers Bekoko', en: '225 kV bay feeds power into Bekoko transmission corridor' },
  },
  {
    id: 'e-gsu-line',
    sourceId: 'node-trafo-gsu',
    targetId: 'node-line-225-bekoko',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'T1 injecte la puissance dans la dorsale 225 kV vers Oyomabang', en: 'T1 injects transformed 225 kV power into Bekoko line' },
  },
  {
    id: 'e-line-sub',
    sourceId: 'node-line-225-bekoko',
    targetId: 'node-sub-oyomabang',
    relation: 'connects_to',
    direction: 'out',
    description: { fr: 'La ligne 225 kV aboutit aux jeux de barres du poste d’Oyomabang', en: '225 kV line terminates at Oyomabang substation busbars' },
  },
  {
    id: 'e-sub-trafo-main',
    sourceId: 'node-sub-oyomabang',
    targetId: 'node-trafo-main-30',
    relation: 'contains',
    direction: 'out',
    description: { fr: 'Le poste abrite le transformateur abaisseur 225/30 kV T2', en: 'Substation houses the 225/30 kV step-down transformer T2' },
  },
  {
    id: 'e-trafo-main-feeder',
    sourceId: 'node-trafo-main-30',
    targetId: 'node-feeder-30-ind',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'T2 alimente le jeu de barres 30 kV et le départ industriel 4', en: 'T2 powers the 30 kV busbar and industrial feeder 4' },
  },
  {
    id: 'e-feeder-trafo-lv',
    sourceId: 'node-feeder-30-ind',
    targetId: 'node-trafo-mv-lv',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'Le départ 30 kV alimente le poste privé de distribution 1600 kVA', en: '30 kV feeder powers the 1600 kVA private industrial substation' },
  },
  {
    id: 'e-feeder-trafo-client',
    sourceId: 'node-feeder-30-ind',
    targetId: 'node-trafo-client-bt',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'Le départ 30 kV alimente le poste de livraison HTA/BT client', en: '30 kV feeder supplies private customer MV/LV substation' },
  },
  {
    id: 'e-trafo-client-tgbt',
    sourceId: 'node-trafo-client-bt',
    targetId: 'node-tgbt-400',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'Le transformateur client alimente le disjoncteur général du TGBT', en: 'Customer step-down transformer powers main LV switchboard' },
  },
  {
    id: 'e-trafo-lv-tgbt',
    sourceId: 'node-trafo-mv-lv',
    targetId: 'node-tgbt-400',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'Le transformateur 400 V alimente le disjoncteur général du TGBT', en: '400 V transformer output feeds main incomer of the TGBT' },
  },
  {
    id: 'e-tgbt-motor',
    sourceId: 'node-tgbt-400',
    targetId: 'node-motor-250',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'Un départ moteur du TGBT alimente le moteur 250 kW via démarreur', en: 'TGBT motor feeder powers 250 kW pump motor via soft-starter' },
  },

  // Cross-discipline Protection links:
  {
    id: 'e-prot-gen',
    sourceId: 'node-prot-87g',
    targetId: 'node-gen-g1',
    relation: 'protects',
    direction: 'out',
    description: { fr: 'La protection 87G protège les enroulements stator de G1', en: '87G relay protects generator G1 stator windings' },
  },
  {
    id: 'e-prot-gsu',
    sourceId: 'node-prot-87t',
    targetId: 'node-trafo-gsu',
    relation: 'protects',
    direction: 'out',
    description: { fr: 'La protection différentielle 87T protège le transformateur élévateur T1', en: '87T relay protects GSU step-up transformer T1' },
  },
  {
    id: 'e-prot-trafo-main',
    sourceId: 'node-prot-87t',
    targetId: 'node-trafo-main-30',
    relation: 'protects',
    direction: 'out',
    description: { fr: 'Le relais 87T protège le transformateur 225/30 kV T2', en: '87T relay protects 225/30 kV step-down transformer T2' },
  },
  {
    id: 'e-prot-buchholz-trafo',
    sourceId: 'node-prot-buchholz',
    targetId: 'node-trafo-main-30',
    relation: 'protects',
    direction: 'out',
    description: { fr: 'Le relais Buchholz détecte les arcs internes et gaz dans T2', en: 'Buchholz relay protects against internal faults and gas in T2' },
  },
  {
    id: 'e-prot-line',
    sourceId: 'node-prot-21',
    targetId: 'node-line-225-bekoko',
    relation: 'protects',
    direction: 'out',
    description: { fr: 'La protection de distance 21 surveille les impédances de la ligne 225 kV', en: 'Distance protection 21 monitors loop impedances along 225 kV line' },
  },
  {
    id: 'e-prot-feeder',
    sourceId: 'node-prot-50-51',
    targetId: 'node-feeder-30-ind',
    relation: 'protects',
    direction: 'out',
    description: { fr: 'Le relais 50/51/51N protège le câble départ 30 kV', en: '50/51/51N relay protects 30 kV underground cable feeder' },
  },
  {
    id: 'e-prot-bay',
    sourceId: 'node-prot-21',
    targetId: 'node-bay-song-225',
    relation: 'protects',
    direction: 'out',
    description: { fr: 'La protection de distance 21 déclenche le disjoncteur de la travée 225 kV', en: 'Distance protection 21 trips 225 kV line bay circuit breaker' },
  },
  {
    id: 'e-sas-bay',
    sourceId: 'node-auto-sas',
    targetId: 'node-bay-song-225',
    relation: 'controls',
    direction: 'out',
    description: { fr: 'Le système SAS supervise et verrouille les manœuvres de la travée 225 kV', en: 'SAS supervises and interlocks 225 kV feeder bay switching operations' },
  },
  {
    id: 'e-prot-trafo-client',
    sourceId: 'node-prot-50-51',
    targetId: 'node-trafo-client-bt',
    relation: 'protects',
    direction: 'out',
    description: { fr: 'La protection 50/51 protège le poste de livraison HTA/BT client', en: '50/51 protection trips customer MV/LV substation incomer' },
  },

  // Cross-discipline Automation & SCADA links:
  {
    id: 'e-sub-sas',
    sourceId: 'node-sub-oyomabang',
    targetId: 'node-auto-sas',
    relation: 'communicates_through',
    direction: 'out',
    description: { fr: 'Le poste est numérisé sous protocole IEC 61850 Station Bus', en: 'Substation communicates through IEC 61850 Station Bus' },
  },
  {
    id: 'e-sub-scada',
    sourceId: 'node-sub-oyomabang',
    targetId: 'node-auto-scada-ems',
    relation: 'communicates_through',
    direction: 'out',
    description: { fr: 'Le poste transmet ses télémésures au dispatching via IEC 60870-5-104', en: 'Substation transmits telemetry to National Dispatching via IEC 104' },
  },

  // Cross-discipline Standards:
  {
    id: 'e-trafo-std',
    sourceId: 'node-trafo-main-30',
    targetId: 'node-std-60076',
    relation: 'governed_by',
    direction: 'out',
    description: { fr: 'Conception et essais conformes à IEC 60076', en: 'Design and FAT tests governed by IEC 60076' },
  },
  {
    id: 'e-feeder-std',
    sourceId: 'node-feeder-30-ind',
    targetId: 'node-std-60909',
    relation: 'governed_by',
    direction: 'out',
    description: { fr: 'Pouvoir de coupure dimensionné selon IEC 60909', en: 'Breaking capacity sized per IEC 60909' },
  },

  // Maintenance & Roles:
  {
    id: 'e-trafo-maint',
    sourceId: 'node-trafo-main-30',
    targetId: 'node-maint-dga',
    relation: 'maintained_by',
    direction: 'out',
    description: { fr: 'Surveillance de santé diélectrique annuelle par analyse DGA', en: 'Annual dielectric health monitoring via DGA' },
  },
  {
    id: 'e-role-prot',
    sourceId: 'node-role-prot-eng',
    targetId: 'node-prot-50-51',
    relation: 'performed_by',
    direction: 'in',
    description: { fr: 'L’ingénieur protection calcule et programme le plan de réglage', en: 'Protection engineer calculates and programs the relay settings' },
  },
  {
    id: 'e-role-deliv',
    sourceId: 'node-role-prot-eng',
    targetId: 'node-deliv-calc-memo',
    relation: 'produces',
    direction: 'out',
    description: { fr: 'L’ingénieur protection rédige la Note de Calcul de sélectivité', en: 'Protection engineer produces the formal Calculation Note' },
  },
  // Cross-Domain Canonical Relationships:
  {
    id: 'e-scada-sub',
    sourceId: 'node-scada-ems',
    targetId: 'node-sub-oyomabang',
    relation: 'supervises',
    direction: 'out',
    description: { fr: 'Le SCADA National supervise le poste Oyomabang via CEI 60870-5-104', en: 'National SCADA supervises Oyomabang substation via IEC 60870-5-104' },
  },
  {
    id: 'e-scada-bcu',
    sourceId: 'node-scada-ems',
    targetId: 'node-bcu-61850',
    relation: 'controls',
    direction: 'out',
    description: { fr: 'Le SCADA télécommande les départs et disjoncteurs via le BCU', en: 'SCADA commands bay breakers via Bay Control Unit (BCU)' },
  },
  {
    id: 'e-sw-bcu',
    sourceId: 'node-sw-iec61850',
    targetId: 'node-bcu-61850',
    relation: 'communicates_with',
    direction: 'out',
    description: { fr: 'Le commutateur durci achemine les trames GOOSE et MMS du BCU', en: 'Substation switch routes GOOSE and MMS packets for the BCU' },
  },
  {
    id: 'e-sw-rel-diff',
    sourceId: 'node-sw-iec61850',
    targetId: 'node-prot-87t',
    relation: 'communicates_with',
    direction: 'out',
    description: { fr: 'Le commutateur achemine les GOOSE de déclenchement rapide vers les disjoncteurs', en: 'Switch routes tripping GOOSE messages to circuit breakers with <4ms latency' },
  },
  {
    id: 'e-trafo-fire',
    sourceId: 'node-trafo-main-30',
    targetId: 'node-fire-ssi',
    relation: 'requires_fire_suppression',
    direction: 'out',
    description: { fr: 'Le transformateur de puissance 225/30 kV est protégé par déluge eau pulvérisée', en: '225/30 kV power transformer is protected by high-velocity water spray deluge' },
  },
  {
    id: 'e-trafo-dga',
    sourceId: 'node-trafo-main-30',
    targetId: 'node-ai-duval',
    relation: 'monitors',
    direction: 'in',
    description: { fr: 'Analyseur DGA multigaz en ligne et diagnostic IA par Triangle de Duval', en: 'Online multi-gas DGA analyzer with AI Duval Triangle diagnostics' },
  },
  {
    id: 'e-sub-statcom',
    sourceId: 'node-sub-oyomabang',
    targetId: 'node-statcom-50mvar',
    relation: 'connects_to',
    direction: 'out',
    description: { fr: 'Le STATCOM régule la tension du jeu de barres 225 kV sous variations brusques de charge', en: 'STATCOM stabilizes 225 kV bus voltage during heavy industrial load variations' },
  },
  {
    id: 'e-bess-dist',
    sourceId: 'node-bess-10mwh',
    targetId: 'node-feeder-30-ind',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'Le BESS injecte 5 MW de réserve rapide sur le réseau 30 kV en pointe ou secours', en: 'BESS injects 5 MW fast frequency response and peak shaving onto 30 kV network' },
  },
  {
    id: 'e-tgbt-mcc',
    sourceId: 'node-tgbt-400',
    targetId: 'node-tgbt-mcc',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'Le TGBT 400 V alimente le tableau moteur compartimenté MCC Forme 4b', en: '400 V Main switchboard feeds the Form 4b Motor Control Center' },
  },
  {
    id: 'e-mcc-motor',
    sourceId: 'node-tgbt-mcc',
    targetId: 'node-motor-250',
    relation: 'supplies',
    direction: 'out',
    description: { fr: 'Le départ tiroir débrochable du MCC alimente le moteur d’extraction 250 kW', en: 'Withdrawable bucket on MCC powers 250 kW extraction motor' },
  },
  {
    id: 'e-tgbt-ami',
    sourceId: 'node-tgbt-400',
    targetId: 'node-ami-meter',
    relation: 'measures',
    direction: 'out',
    description: { fr: 'Le compteur communicant AMI mesure la puissance active, réactive et harmoniques au TGBT', en: 'AMI smart meter records active/reactive power and power quality harmonics' },
  },
  {
    id: 'e-study-sub',
    sourceId: 'node-grid-study-psse',
    targetId: 'node-sub-oyomabang',
    relation: 'governed_by',
    direction: 'in',
    description: { fr: 'L’étude de stabilité dynamique fixe les plans d’îlotage et délestage du poste', en: 'Dynamic stability study defines substation under-frequency load shedding setpoints' },
  },
  {
    id: 'e-earth-sub',
    sourceId: 'node-earthing-grid',
    targetId: 'node-sub-oyomabang',
    relation: 'protects',
    direction: 'out',
    description: { fr: 'La grille de terre IEEE 80 évacue les courants de défaut et limite les tensions de pas et contact', en: 'IEEE 80 earth mat dissipates 31.5 kA fault currents ensuring step/touch safety' },
  },
  {
    id: 'e-line-sa',
    sourceId: 'node-line-225-bekoko',
    targetId: 'node-surge-arrester',
    relation: 'protects',
    direction: 'in',
    description: { fr: 'Les parafoudres ZnO protègent la ligne et les transformateurs contre les surtensions de foudre', en: 'Station ZnO surge arresters clamp atmospheric lightning and switching impulses' },
  },
];

// -------------------------------------------------------------
// TRAVERSAL ENGINE CLASS
// -------------------------------------------------------------
export class CanonicalGraphEngine {
  private nodesMap: Map<string, CanonicalGraphNode> = new Map();
  private edgesList: CanonicalGraphEdge[] = [];
  private outgoingEdgesMap: Map<string, CanonicalGraphEdge[]> = new Map();
  private incomingEdgesMap: Map<string, CanonicalGraphEdge[]> = new Map();

  constructor(nodes: CanonicalGraphNode[] = CANONICAL_GRAPH_NODES, edges: CanonicalGraphEdge[] = CANONICAL_GRAPH_EDGES) {
    this.init(nodes, edges);
  }

  public init(nodes: CanonicalGraphNode[], edges: CanonicalGraphEdge[]): void {
    this.nodesMap.clear();
    this.outgoingEdgesMap.clear();
    this.incomingEdgesMap.clear();
    this.edgesList = edges;

    nodes.forEach(node => {
      this.nodesMap.set(node.id, node);
      this.outgoingEdgesMap.set(node.id, []);
      this.incomingEdgesMap.set(node.id, []);
    });

    edges.forEach(edge => {
      if (!this.outgoingEdgesMap.has(edge.sourceId)) {
        this.outgoingEdgesMap.set(edge.sourceId, []);
      }
      this.outgoingEdgesMap.get(edge.sourceId)!.push(edge);

      if (!this.incomingEdgesMap.has(edge.targetId)) {
        this.incomingEdgesMap.set(edge.targetId, []);
      }
      this.incomingEdgesMap.get(edge.targetId)!.push(edge);
    });
  }

  public getNodeById(id: string): CanonicalGraphNode | undefined {
    return this.nodesMap.get(id);
  }

  public getAllNodes(): CanonicalGraphNode[] {
    return Array.from(this.nodesMap.values());
  }

  public getPhysicalSpine(): CanonicalGraphNode[] {
    const spineIds = [
      'node-plant-songloulou',
      'node-gen-g1',
      'node-trafo-gsu',
      'node-line-225-bekoko',
      'node-sub-oyomabang',
      'node-trafo-main-30',
      'node-feeder-30-ind',
      'node-trafo-mv-lv',
      'node-tgbt-400',
      'node-motor-250',
    ];
    return spineIds
      .map(id => this.nodesMap.get(id))
      .filter((n): n is CanonicalGraphNode => n !== undefined);
  }

  public traceUpstream(nodeId: string, maxHops: number = 8): CanonicalGraphNode[] {
    const upstream: CanonicalGraphNode[] = [];
    const visited = new Set<string>([nodeId]);
    let currentId = nodeId;

    for (let hop = 0; hop < maxHops; hop++) {
      const inEdges = this.incomingEdgesMap.get(currentId) || [];
      // Find physical feeding/supplying or containing edge
      const parentEdge = inEdges.find(
        e => e.relation === 'supplies' || e.relation === 'contains' || e.relation === 'connects_to'
      );
      if (!parentEdge) break;

      const parentNode = this.nodesMap.get(parentEdge.sourceId);
      if (!parentNode || visited.has(parentNode.id)) break;

      upstream.unshift(parentNode); // push to front so it reads root -> child
      visited.add(parentNode.id);
      currentId = parentNode.id;
    }

    return upstream;
  }

  public traceDownstream(nodeId: string, maxHops: number = 8): CanonicalGraphNode[] {
    const downstream: CanonicalGraphNode[] = [];
    const visited = new Set<string>([nodeId]);
    let currentId = nodeId;

    for (let hop = 0; hop < maxHops; hop++) {
      const outEdges = this.outgoingEdgesMap.get(currentId) || [];
      // Find physical feeding or containing edge
      const childEdge = outEdges.find(
        e => e.relation === 'supplies' || e.relation === 'contains' || e.relation === 'connects_to'
      );
      if (!childEdge) break;

      const childNode = this.nodesMap.get(childEdge.targetId);
      if (!childNode || visited.has(childNode.id)) break;

      downstream.push(childNode);
      visited.add(childNode.id);
      currentId = childNode.id;
    }

    return downstream;
  }

  public getCrossDiscipline(nodeId: string): EngineeringContextStack['crossDiscipline'] {
    const outEdges = this.outgoingEdgesMap.get(nodeId) || [];
    const inEdges = this.incomingEdgesMap.get(nodeId) || [];

    const result: EngineeringContextStack['crossDiscipline'] = {
      protections: [],
      measurements: [],
      controls: [],
      communications: [],
      standards: [],
      roles: [],
      maintenance: [],
      deliverables: [],
    };

    // Check edges where this node is protected, measured, controlled, governed, etc.
    inEdges.forEach(e => {
      const srcNode = this.nodesMap.get(e.sourceId);
      if (!srcNode) return;

      if (e.relation === 'protects') result.protections.push(srcNode);
      if (e.relation === 'measures') result.measurements.push(srcNode);
      if (e.relation === 'controls') result.controls.push(srcNode);
      if (e.relation === 'communicates_through') result.communications.push(srcNode);
      if (e.relation === 'governed_by') result.standards.push(srcNode);
      if (e.relation === 'maintained_by') result.maintenance.push(srcNode);
      if (e.relation === 'performed_by') result.roles.push(srcNode);
    });

    outEdges.forEach(e => {
      const tgtNode = this.nodesMap.get(e.targetId);
      if (!tgtNode) return;

      if (e.relation === 'protects') result.protections.push(tgtNode);
      if (e.relation === 'measures') result.measurements.push(tgtNode);
      if (e.relation === 'controls') result.controls.push(tgtNode);
      if (e.relation === 'communicates_through') result.communications.push(tgtNode);
      if (e.relation === 'governed_by') result.standards.push(tgtNode);
      if (e.relation === 'maintained_by') result.maintenance.push(tgtNode);
      if (e.relation === 'produces') result.deliverables.push(tgtNode);
      if (e.relation === 'performed_by') result.roles.push(tgtNode);
    });

    return result;
  }

  public buildContextStack(nodeId: string): EngineeringContextStack | null {
    const selectedNode = this.nodesMap.get(nodeId);
    if (!selectedNode) return null;

    const upstreamChain = this.traceUpstream(nodeId);
    const downstreamChain = this.traceDownstream(nodeId);
    const crossDiscipline = this.getCrossDiscipline(nodeId);

    // Formulate earthing context description
    let earthingContext: EngineeringContextStack['earthingContext'] = undefined;
    if (selectedNode.earthingRegime) {
      const regime = selectedNode.earthingRegime;
      const desc: Record<EarthingRegime, { fr: string; en: string; ik0: string }> = {
        Solid: {
          fr: 'Mise à la terre directe (Neutre direct). Fort courant de défaut monophasé (Ik1 ≈ Ik3), surtensions saines minimales (facteur de mise à la terre ≤ 1.4).',
          en: 'Solidly grounded neutral. High single line-to-earth fault current (Ik1 ≈ Ik3), minimal healthy phase overvoltage (earthing factor ≤ 1.4).',
          ik0: 'High (up to 31.5 kA)',
        },
        NGR: {
          fr: 'Mise à la terre par résistance limitatrice (NGR). Limite le courant de défaut à la terre à 40 A pour protéger les circuits magnétiques et limiter les tensions de pas/toucher.',
          en: 'Neutral Grounding Resistor (NGR). Limits phase-to-earth fault current to 40 A to protect core laminations and control touch/step voltages.',
          ik0: 'Controlled (40 A to 1000 A)',
        },
        Petersen: {
          fr: 'Mise à la terre par bobine d’extinction résonnante (Bobine de Petersen). Compense le courant capacitif de réseau à la terre pour auto-extinction des défauts fugitifs.',
          en: 'Resonant grounding via Petersen coil. Neutralizes capacitive earth-fault current enabling self-extinction of transient faults.',
          ik0: 'Very Low (Residual active 5-20 A)',
        },
        Isolated: {
          fr: 'Neutre isolé. Très faible courant de défaut capacitif, continuité de service autorisée au premier défaut mais surtensions élevées sur phases saines (√3 × Un).',
          en: 'Isolated neutral. Very low fault current, allows continued operation on first fault but exposes healthy phases to line-to-line overvoltages (√3 × Un).',
          ik0: 'Capacitive only (< 10 A)',
        },
        TT: {
          fr: 'Schéma TT (Basse Tension). Neutre transformateur relié à la terre, masses usagers reliées à une terre locale distincte. Déclenchement obligatoire au premier défaut par DDR 300 mA.',
          en: 'TT Earthing (Low Voltage). Transformer neutral directly grounded, consumer frames grounded to separate local earth. RCD protection mandatory on first fault.',
          ik0: 'Limited by earth resistance (10 - 50 A)',
        },
        'TN-C': {
          fr: 'Schéma TN-C (Basse Tension). Conducteur neutre et protection combinés (PEN). Interdit en aval des sections < 10 mm² Cuivre.',
          en: 'TN-C Earthing (Low Voltage). Combined neutral and protective earth conductor (PEN). Prohibited downstream of sections < 10 mm² Cu.',
          ik0: 'Very High (Line-to-Neutral short circuit)',
        },
        'TN-S': {
          fr: 'Schéma TN-S (Basse Tension). Conducteur neutre (N) et conducteur de protection (PE) strictement séparés sur toute l’installation. Sécurité maximale pour matériels sensibles.',
          en: 'TN-S Earthing (Low Voltage). Neutral (N) and Protective Earth (PE) strictly separated throughout installation. Optimum safety for sensitive electronic loads.',
          ik0: 'Very High (Trips standard MCCB/ACB magnetic unit)',
        },
        IT: {
          fr: 'Schéma IT (Basse Tension). Neutre isolé ou impédant (1500 Ω), masses usagers interconnectées et à la terre. Contrôleur Permanent d’Isolement (CPI) obligatoire.',
          en: 'IT Earthing (Low Voltage). Neutral isolated or impedant (1500 Ω), frames interconnected to earth. Permanent Insulation Monitor (IMD) mandatory.',
          ik0: 'Negligible on first fault (< 1 A)',
        },
      };

      earthingContext = {
        regime,
        description: { fr: desc[regime].fr, en: desc[regime].en },
        faultCurrentContribution: desc[regime].ik0,
      };
    }

    return {
      selectedNode,
      upstreamChain,
      downstreamChain,
      crossDiscipline,
      earthingContext,
      auxiliaryContext: selectedNode.auxiliarySystem,
    };
  }
}

// Global Singleton Instance
export const canonicalGraph = new CanonicalGraphEngine();
