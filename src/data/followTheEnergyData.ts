// src/data/followTheEnergyData.ts
// EPEDE - Follow the Energy Data Pipeline Model
// Implements Priority #2: 8 Sequential Stages & 4 Superimposable Flows (Power, Protection, Control, Telecom)

export type EnergyFlowType = 'POWER' | 'PROTECTION' | 'CONTROL' | 'COMMUNICATION';

export interface StageFlowDetail {
  flowType: EnergyFlowType;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  telemetryTag?: string;
  statusBadge?: string;
  activeColor: string;
}

export interface PipelineStage {
  id: string;
  stepNumber: number;
  code: string;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  voltageTier: string;
  primaryEquipment: string;
  cameroonAnchor: string;
  domainCode: string;
  iconName: string;
  accentColor: string;
  
  // Pedagogical Summary
  overviewFr: string;
  overviewEn: string;

  // The 4 Multi-Layer Superimposed Flows
  flows: Record<EnergyFlowType, StageFlowDetail>;

  // Key Technical Characteristics
  ratings: Array<{ label: string; value: string; unit?: string }>;

  // Quick Action Route
  targetView: string;
  targetParams?: Record<string, string>;
}

export const FOLLOW_THE_ENERGY_STAGES: PipelineStage[] = [
  // ── Stage 1: Production ──
  {
    id: 'stage-1-generation',
    stepNumber: 1,
    code: 'D01',
    titleFr: '1. Production Primaire',
    titleEn: '1. Primary Generation',
    subtitleFr: 'Conversion de la force de l’eau en électricité',
    subtitleEn: 'Hydraulic kinetic energy to 3-phase AC',
    voltageTier: '10.5 kV AC',
    primaryEquipment: 'Alternateurs Synchrones Verticaux (Songloulou 8x48 MVA, Nachtigal 7x60 MW)',
    cameroonAnchor: 'Centrale Hydroélectrique de Songloulou (384 MW) & Nachtigal (420 MW)',
    domainCode: 'D01',
    iconName: 'Activity',
    accentColor: 'from-cyan-500 to-blue-600',
    overviewFr: 'La turbine hydraulique Francis capte le débit du fleuve Sanaga et entraîne l’alternateur à 150 tr/min. Le stator génère une onde triphasée pure à 50 Hz sous 10 500 volts.',
    overviewEn: 'Francis hydro turbines harness the Sanaga river flow, spinning salient-pole alternators at 150 rpm. The stator induces clean 50 Hz three-phase power at 10.5 kV.',
    ratings: [
      { label: 'Puissance Installée', value: '384', unit: 'MW' },
      { label: 'Tension Stator', value: '10.5', unit: 'kV' },
      { label: 'Vitesse de Rotation', value: '150', unit: 'tr/min' },
      { label: 'Facteur de Puissance', value: '0.85', unit: 'cos φ' }
    ],
    flows: {
      POWER: {
        flowType: 'POWER',
        titleFr: 'Génération Électromécanique',
        titleEn: 'Electromechanical Generation',
        summaryFr: 'Production continue de 40.8 MW par groupe via induction magnétique dans l’entrefer.',
        summaryEn: 'Continuous 40.8 MW generation per unit via air-gap magnetic flux induction.',
        telemetryTag: 'SONG_G1_P = 40.2 MW',
        statusBadge: 'Transit Actif',
        activeColor: 'text-amber-400'
      },
      PROTECTION: {
        flowType: 'PROTECTION',
        titleFr: 'Protection Machine 87G / 40 / 46',
        titleEn: 'Generator Differential & Field Protection',
        summaryFr: 'Relais différentiel 87G surveillant l’équilibre des courants statoriques et sous-excitation 40.',
        summaryEn: '87G differential relay securing stator windings coupled with 40 loss-of-excitation.',
        telemetryTag: 'ANSI 87G / 40 / 46',
        statusBadge: 'Veille Active (0 ms)',
        activeColor: 'text-emerald-400'
      },
      CONTROL: {
        flowType: 'CONTROL',
        titleFr: 'Régulateur de Vitesse & AVR',
        titleEn: 'Governor & Automatic Voltage Regulator',
        summaryFr: 'Asservissement de l’ouverture des directrices de turbine et contrôle d’excitation statique.',
        summaryEn: 'Wicket gate electro-hydraulic governor tracking grid frequency + static excitation AVR.',
        telemetryTag: 'AVR_V_REF = 10.5 kV',
        statusBadge: 'Asservi 50.00 Hz',
        activeColor: 'text-cyan-400'
      },
      COMMUNICATION: {
        flowType: 'COMMUNICATION',
        titleFr: 'Bus de Centrale IEC 61850 & SCADA',
        titleEn: 'Plant IEC 61850 Station Bus & SCADA',
        summaryFr: 'Transmission des télémesures MW/Mvar et alarmes horodatées vers le pupitre de conduite.',
        summaryEn: 'Broadcasting MW/Mvar telemetries and SOE timestamped events to local plant control room.',
        telemetryTag: 'IEC 61850 MMS / GOOSE',
        statusBadge: '1 ms PTP Sync',
        activeColor: 'text-purple-400'
      }
    },
    targetView: 'hydropower'
  },

  // ── Stage 2: Transport THT ──
  {
    id: 'stage-2-transmission',
    stepNumber: 2,
    code: 'D03',
    titleFr: '2. Transport Très Haute Tension',
    titleEn: '2. Extra-High Voltage Transmission',
    subtitleFr: 'Transit de forte puissance sur de grandes distances',
    subtitleEn: 'Bulk power transmission with minimal ohmic losses',
    voltageTier: '225 kV THT',
    primaryEquipment: 'Lignes Aériennes sur Pylônes Treillis Faisceaux Almelec 570 mm² + OPGW',
    cameroonAnchor: 'Dorsale THT 225 kV Songloulou - Bekoko (120 km) & Nachtigal - Yaoundé',
    domainCode: 'D03',
    iconName: 'Zap',
    accentColor: 'from-amber-500 to-orange-600',
    overviewFr: 'Pour minimiser les pertes par effet Joule sur des centaines de kilomètres, la tension est élevée à 225 000 volts. Le courant est divisé par 21, réduisant les pertes en ligne d’un facteur 460.',
    overviewEn: 'To minimize ohmic losses over hundreds of kilometers, voltage is stepped up to 225 kV. Current is reduced by 21x, slashing line transmission losses by a factor of 460.',
    ratings: [
      { label: 'Tension Nominale', value: '225', unit: 'kV' },
      { label: 'Capacité de Transit', value: '450', unit: 'MVA' },
      { label: 'Section Conducteur', value: '2x570', unit: 'mm²' },
      { label: 'Câble de Garde', value: 'OPGW 48 FO', unit: '' }
    ],
    flows: {
      POWER: {
        flowType: 'POWER',
        titleFr: 'Transit THT 225 kV Longue Distance',
        titleEn: 'Bulk 225 kV Long-Distance Power Flow',
        summaryFr: 'Flux massif de 320 MW transféré entre le fleuve Sanaga et la métropole de Douala.',
        summaryEn: 'Massive 320 MW transit flowing from Sanaga generation hub to Douala demand center.',
        telemetryTag: 'LINE_SONG_BKKO = 312 MW',
        statusBadge: 'Flux Bidirectionnel',
        activeColor: 'text-amber-400'
      },
      PROTECTION: {
        flowType: 'PROTECTION',
        titleFr: 'Protection Distance 21 & Différentielle 87L',
        titleEn: 'Distance 21 & Line Differential 87L',
        summaryFr: 'Double protection redondante avec téléaction par fibre optique OPGW (déclenchement < 25 ms).',
        summaryEn: 'Dual redundant high-speed distance protection with OPGW optical teleprotection (< 25 ms).',
        telemetryTag: 'ANSI 21 / 21N / 87L',
        statusBadge: 'Zone 1 Sécurisée',
        activeColor: 'text-emerald-400'
      },
      CONTROL: {
        flowType: 'CONTROL',
        titleFr: 'Réenclencheur Monophasé 79',
        titleEn: 'Single-Pole Auto-Reclosing (79)',
        summaryFr: 'Élimination des défauts fugitifs de foudre par ouverture/fermeture monophasée en 300 ms.',
        summaryEn: 'Single-phase trip-and-reclose sequence clearing transient lightning faults without blackout.',
        telemetryTag: 'CYCLE_79 = O-0.3s-CO',
        statusBadge: 'Auto-Reclose Prêt',
        activeColor: 'text-cyan-400'
      },
      COMMUNICATION: {
        flowType: 'COMMUNICATION',
        titleFr: 'Câble Optique OPGW & Réseau SDH / MPLS',
        titleEn: 'OPGW Optical Ground Wire & IP/MPLS Core',
        summaryFr: 'Réseau télécom à très haut débit véhiculant les données SCADA, la téléprotection et la VoIP.',
        summaryEn: 'Carrier-grade fiber backbone transmitting teleprotection, SCADA, and operational data.',
        telemetryTag: 'SONATREL_OPGW_CH1',
        statusBadge: '400 Gbps DWDM',
        activeColor: 'text-purple-400'
      }
    },
    targetView: 'cameroon-grid'
  },

  // ── Stage 3: Postes d'Interconnexion ──
  {
    id: 'stage-3-substation',
    stepNumber: 3,
    code: 'D04',
    titleFr: '3. Postes d’Interconnexion HTB',
    titleEn: '3. EHV/HV Interconnection Substations',
    subtitleFr: 'Nœuds d’aiguillage, manœuvre et transformation 225/90/30 kV',
    subtitleEn: 'Grid switching nodes & step-down transformation',
    voltageTier: '225 kV / 90 kV / 30 kV',
    primaryEquipment: 'Postes AIS Ouverts & Postes Blindés GIS (Disjoncteurs SF6, Sectionneurs, TC/TP)',
    cameroonAnchor: 'Postes Nœuds Stratégiques de Bekoko, Mangombé (Edéa) et Oyomabang (Yaoundé)',
    domainCode: 'D04',
    iconName: 'Building2',
    accentColor: 'from-blue-600 to-indigo-600',
    overviewFr: 'Les postes d’interconnexion sont les gares de triage de l’électricité. Ils permettent d’orienter les flux, d’isoler les tronçons en défaut et d’abaisser la tension vers les réseaux régionaux.',
    overviewEn: 'Interconnection substations act as electrical railway switchyards. They route bulk power, isolate faulted lines, and step down voltage toward regional distribution networks.',
    ratings: [
      { label: 'Transformateurs de Puissance', value: '2x100', unit: 'MVA' },
      { label: 'Tenue Court-Circuit Icc', value: '40', unit: 'kA 1s' },
      { label: 'Schéma Jeux de Barres', value: 'Double Barre + Tronçonn.', unit: '' },
      { label: 'Gaz d’Isolation', value: 'SF6 0.6 MPa', unit: '' }
    ],
    flows: {
      POWER: {
        flowType: 'POWER',
        titleFr: 'Aiguillage & Transformation 225/90/30 kV',
        titleEn: 'Switching & 225/90/30 kV Step-Down',
        summaryFr: 'Alimentation des transformateurs abaisseurs T1/T2 pour injecter l’énergie dans les boucles 90 kV.',
        summaryEn: 'Feeding large power step-down transformers to supply 90 kV urban sub-transmission loops.',
        telemetryTag: 'BKKO_TR1_S = 85.4 MVA',
        statusBadge: 'N-1 Conforme',
        activeColor: 'text-amber-400'
      },
      PROTECTION: {
        flowType: 'PROTECTION',
        titleFr: 'Différentielle Barres 87B & Défaillance 50BF',
        titleEn: 'Busbar Differential 87B & Breaker Failure 50BF',
        summaryFr: 'Protection ultra-rapide des jeux de barres (élimination < 15 ms) et secours défaillance disjoncteur.',
        summaryEn: 'High-speed busbar zone protection (< 15 ms trip) backed up by breaker failure automation.',
        telemetryTag: 'ANSI 87B / 50BF / 51N',
        statusBadge: 'Sélectivité Totale',
        activeColor: 'text-emerald-400'
      },
      CONTROL: {
        flowType: 'CONTROL',
        titleFr: 'Automatisme de Travée & Interverrouillages LOTO',
        titleEn: 'Bay Controller & Safety Interlocking Logic',
        summaryFr: 'Sécurisation absolue des manœuvres : impossibilité d’ouvrir un sectionneur en charge.',
        summaryEn: 'Fail-safe interlocking: mechanical and electrical prevention of off-load switch operation.',
        telemetryTag: 'BCU_INTERLOCK_OK',
        statusBadge: 'Interverrouillé 100%',
        activeColor: 'text-cyan-400'
      },
      COMMUNICATION: {
        flowType: 'COMMUNICATION',
        titleFr: 'Bus de Process IEC 61850-9-2 & GOOSE',
        titleEn: 'IEC 61850 Process Bus & GOOSE Fast Messaging',
        summaryFr: 'Échange numérique instantané des états et valeurs échantillonnées (SV) sur fibre optique.',
        summaryEn: 'Peer-to-peer GOOSE trip telegrams and Sampled Values (SV) across station fiber ring.',
        telemetryTag: 'IEC 61850-8-1 GOOSE',
        statusBadge: 'Latence < 2 ms',
        activeColor: 'text-purple-400'
      }
    },
    targetView: 'architectures'
  },

  // ── Stage 4: Réseau de Distribution HTA ──
  {
    id: 'stage-4-distribution',
    stepNumber: 4,
    code: 'D05',
    titleFr: '4. Réseau Moyenne Tension HTA',
    titleEn: '4. Medium-Voltage MV Distribution',
    subtitleFr: 'Distribution régionale urbaine et rurale 30 kV / 15 kV',
    subtitleEn: 'Urban and rural regional power distribution grid',
    voltageTier: '30 kV / 15 kV HTA',
    primaryEquipment: 'Lignes Aériennes sur Poteaux Béton/Bois, Câbles Souterrains Al, Reclosers et Organes de Coupure IACM',
    cameroonAnchor: 'Réseaux Moyenne Tension Douala (Akwa, Bonanjo, Bassa) et Yaoundé (Mvan, Biyem-Assi)',
    domainCode: 'D05',
    iconName: 'Network',
    accentColor: 'from-emerald-500 to-teal-600',
    overviewFr: 'Le réseau HTA ramifie l’électricité vers les quartiers, zones d’activités et villages. Il comprend des artères bouclables en milieu urbain et de longues lignes radiales en milieu rural.',
    overviewEn: 'The MV distribution network branches electricity toward neighborhoods, commercial districts, and rural villages, using open-ring urban topologies and radial rural lines.',
    ratings: [
      { label: 'Tensions Nominales', value: '30 & 15', unit: 'kV' },
      { label: 'Longueur Totale Réseau', value: '18 400', unit: 'km' },
      { label: 'Régime de Neutre', value: 'Résistance R_n', unit: '40 A' },
      { label: 'Disjoncteurs Rames', value: 'Coupure Vide', unit: '12.5 kA' }
    ],
    flows: {
      POWER: {
        flowType: 'POWER',
        titleFr: 'Distribution d’Énergie en Boucle Ouverte',
        titleEn: 'Open-Loop Radial Power Distribution',
        summaryFr: 'Transit de 5 à 15 MW par artère HTA avec point d’ouverture normal pour secourir en cas d’avarie.',
        summaryEn: '5 to 15 MW feeder loading with normally-open tie point for rapid back-feeding on faults.',
        telemetryTag: 'FEEDER_BASSA_I = 240 A',
        statusBadge: 'Transit Normal',
        activeColor: 'text-amber-400'
      },
      PROTECTION: {
        flowType: 'PROTECTION',
        titleFr: 'Protection Max I 50/51 & Terre Résiduelle 51N',
        titleEn: 'Overcurrent 50/51 & Earth Fault 51N',
        summaryFr: 'Courbes de déclenchement à temps inverse (CEI Normal Inverse) coordonnées avec les disjoncteurs avals.',
        summaryEn: 'Inverse-time trip curves (IEC Normal Inverse) graded with downstream fuses and reclosers.',
        telemetryTag: 'ANSI 50/51/51N',
        statusBadge: 'Sélectivité Chrono',
        activeColor: 'text-emerald-400'
      },
      CONTROL: {
        flowType: 'CONTROL',
        titleFr: 'Téléconduite IACM & Reclosers Automatiques',
        titleEn: 'Automated Reclosers & Sectionalizers',
        summaryFr: 'Isolement télécommandé des tronçons avariés et réenclenchement automatique multiphasé.',
        summaryEn: 'Motorized pole-mounted sectionalizer switching to isolate faulty line sections in under 2 min.',
        telemetryTag: 'IACM_POLE_42_AUTO',
        statusBadge: 'Télécommandé',
        activeColor: 'text-cyan-400'
      },
      COMMUNICATION: {
        flowType: 'COMMUNICATION',
        titleFr: 'Télétransmission Radio 4G / APN Privé & IEC 104',
        titleEn: 'Private APN Cellular 4G & IEC 60870-5-104',
        summaryFr: 'Liaison télégérée entre les coffrets de détection de défauts (DAX) et le dispatching régional.',
        summaryEn: 'Fault passage indicator telemetry streaming alerts to regional SCADA operations desk.',
        telemetryTag: 'IEC 60870-5-104',
        statusBadge: 'Liaison Active',
        activeColor: 'text-purple-400'
      }
    },
    targetView: 'diagrams'
  },

  // ── Stage 5: Transformation MT/BT ──
  {
    id: 'stage-5-transformation',
    stepNumber: 5,
    code: 'D05',
    titleFr: '5. Postes de Transformation HTA/BT',
    titleEn: '5. MV/LV Distribution Substations',
    subtitleFr: 'Abaissement ultime à la tension d’utilisation 400 V / 230 V',
    subtitleEn: 'Stepping down to end-user utilization voltage',
    voltageTier: '30 kV → 400 V BT',
    primaryEquipment: 'Postes Cabines Maçonnées & Postes H61 sur Poteau (Transformateurs 160 kVA à 1250 kVA)',
    cameroonAnchor: 'Milliers de postes de distribution H61 et cabines urbaines (Douala, Yaoundé, Bafoussam)',
    domainCode: 'D05',
    iconName: 'Cpu',
    accentColor: 'from-teal-500 to-green-600',
    overviewFr: 'Le transformateur de distribution abaisse les 30 000 V à 400 V triphasé (230 V monophasé entre phase et neutre). C’est ici qu’est créé le régime de neutre (mise à la terre locale du neutre BT).',
    overviewEn: 'The distribution transformer drops 30,000 V down to 400 V three-phase (230 V phase-to-neutral). This is where the neutral earthing regime is physically grounded.',
    ratings: [
      { label: 'Puissances Types', value: '160, 400, 630', unit: 'kVA' },
      { label: 'Couplage Bobinage', value: 'Dyn11', unit: 'Neutre Sorti' },
      { label: 'Tension Court-Circuit Ucc', value: '4.0', unit: '%' },
      { label: 'Refroidissement', value: 'ONAN (Huile)', unit: '' }
    ],
    flows: {
      POWER: {
        flowType: 'POWER',
        titleFr: 'Conversion Électromagnétique 30 kV → 400 V',
        titleEn: 'Electromagnetic Conversion 30 kV → 400 V',
        summaryFr: 'Abaissement de tension avec rapport m = 0.0133 et sortie du point neutre pour régime TT / TN.',
        summaryEn: 'Voltage conversion ratio m = 0.0133 with accessible neutral point for TT/TN architectures.',
        telemetryTag: 'TR_H61_SEC_I = 540 A',
        statusBadge: 'Taux Charge 78%',
        activeColor: 'text-amber-400'
      },
      PROTECTION: {
        flowType: 'PROTECTION',
        titleFr: 'Fusibles HPC & Protection DGPT2 Cuve',
        titleEn: 'High-Breaking Fuses & DGPT2 Oil Protection',
        summaryFr: 'Fusibles moyenne tension à percuteur coupant en moins de 10 ms sur défaut interne franc.',
        summaryEn: 'Striker-pin medium voltage fuses blowing in < 10 ms on severe internal winding faults.',
        telemetryTag: 'FUSIBLE_HPC_25A',
        statusBadge: 'Fusible OK',
        activeColor: 'text-emerald-400'
      },
      CONTROL: {
        flowType: 'CONTROL',
        titleFr: 'Régleur de Prises à Vide (Off-Load Tap Changer)',
        titleEn: 'De-Energized Tap Changer (DETC ±5%)',
        summaryFr: 'Ajustement de la tension secondaire (prises ±2.5%, ±5%) pour compenser la chute de tension de ligne.',
        summaryEn: 'Off-circuit tap selection (±2.5%, ±5%) compensating for seasonal feeder voltage drop.',
        telemetryTag: 'TAP_POSITION = +2.5%',
        statusBadge: 'Prise Verrouillée',
        activeColor: 'text-cyan-400'
      },
      COMMUNICATION: {
        flowType: 'COMMUNICATION',
        titleFr: 'Comptage Intelligent AMI & Détection Gaz',
        titleEn: 'AMI Smart Metering & Transformer Telemetry',
        summaryFr: 'Transmission de l’indice de charge, du facteur de puissance et des alarmes de température.',
        summaryEn: 'Low-power cellular uplink streaming oil temperature, current balance, and tampering alarms.',
        telemetryTag: 'SMART_MET_D05_MODBUS',
        statusBadge: 'Uplink 15 min',
        activeColor: 'text-purple-400'
      }
    },
    targetView: 'knowledge-graph',
    targetParams: { entityId: 'kg-trafo-hta-bt' }
  },

  // ── Stage 6: Réseau Basse Tension ──
  {
    id: 'stage-6-low-voltage',
    stepNumber: 6,
    code: 'D06',
    titleFr: '6. Réseau de Desserte Basse Tension',
    titleEn: '6. Low-Voltage LV Network',
    subtitleFr: 'Alimentation des branchements d’abonnés et colonnes montantes',
    subtitleEn: 'Customer service connections and rising mains',
    voltageTier: '400 V / 230 V BT',
    primaryEquipment: 'Câbles Torsadés Aériens Autoportés Almelec (3x70+54.6 mm²), Coffrets Coupe-Circuit',
    cameroonAnchor: 'Desserte des abonnés résidentiels, tertiaires et petits artisans des villes du Cameroun',
    domainCode: 'D06',
    iconName: 'Layers',
    accentColor: 'from-green-600 to-emerald-700',
    overviewFr: 'Le réseau basse tension achemine l’énergie jusqu’au compteur de l’usager. Il est conçu pour maintenir la chute de tension inférieure à 5% et assurer la sécurité des personnes contre les contacts indirects.',
    overviewEn: 'The low-voltage network delivers energy to user meters. Sized to limit voltage drop below 5% while ensuring personal safety against indirect touch potentials.',
    ratings: [
      { label: 'Tension Ph-Ph / Ph-N', value: '400 / 230', unit: 'V' },
      { label: 'Schéma de Liaison Terre', value: 'Régime TT', unit: 'Standard' },
      { label: 'Chute de Tension Max', value: '≤ 5.0', unit: '%' },
      { label: 'Câble Torsadé Type', value: 'NF C 33-209', unit: '' }
    ],
    flows: {
      POWER: {
        flowType: 'POWER',
        titleFr: 'Desserte Triphasée 400V + Neutre',
        titleEn: '400V Three-Phase + Neutral Service',
        summaryFr: 'Distribution équilibrée entre les trois phases avec courant de neutre minimisé.',
        summaryEn: 'Balanced phase distribution minimizing zero-sequence unbalance neutral return current.',
        telemetryTag: 'VOLTAGE_L1_N = 231.4 V',
        statusBadge: 'Tension Conforme',
        activeColor: 'text-amber-400'
      },
      PROTECTION: {
        flowType: 'PROTECTION',
        titleFr: 'Protection Différentielle DDR & Terre TT',
        titleEn: 'Residual Current Devices (RCD) in TT Earthing',
        summaryFr: 'Coupure automatique au premier défaut d’isolement par disjoncteurs différentiels 30 mA / 300 mA.',
        summaryEn: 'Instantaneous disconnection on first insulation ground fault via 30 mA / 300 mA RCDs.',
        telemetryTag: 'RCD_TRIP_I_DELTA = 30 mA',
        statusBadge: 'Sécurité Personnes',
        activeColor: 'text-emerald-400'
      },
      CONTROL: {
        flowType: 'CONTROL',
        titleFr: 'Disjoncteur d’Abonné & Téléreport',
        titleEn: 'Customer Service Disconnect Switch',
        summaryFr: 'Calibrage de la puissance souscrite (10 A à 60 A) avec organe de coupure manuel et télécommandable.',
        summaryEn: 'Main service breaker limiting customer demand quota with remote disconnect relay.',
        telemetryTag: 'BREAKER_ABONNE_30A',
        statusBadge: 'Souscrit Conforme',
        activeColor: 'text-cyan-400'
      },
      COMMUNICATION: {
        flowType: 'COMMUNICATION',
        titleFr: 'Compteurs Communicants Prépayés STS / CPL',
        titleEn: 'STS Prepayment & PLC Smart Meters',
        summaryFr: 'Système prépayé à code STS (tokens) ou télé-relève radio RF Mesh / CPL G3.',
        summaryEn: 'STS standard keypad tokens or automated G3-PLC / RF mesh remote billing upload.',
        telemetryTag: 'STS_TOKEN_CREDIT_OK',
        statusBadge: 'Télé-relève Active',
        activeColor: 'text-purple-400'
      }
    },
    targetView: 'calculators'
  },

  // ── Stage 7: TGBT & Tableaux Électriques ──
  {
    id: 'stage-7-switchboard',
    stepNumber: 7,
    code: 'D06',
    titleFr: '7. TGBT & Tableaux de Distribution',
    titleEn: '7. Main Low-Voltage Switchboard (TGBT)',
    subtitleFr: 'Cœur névralgique de la distribution électrique du bâtiment',
    subtitleEn: 'Nerve center of facility electrical power management',
    voltageTier: '400 V Triphasé',
    primaryEquipment: 'TGBT Forme 4b (Disjoncteurs Ouverts ACB, Boîtiers Moulés MCCB, Inverseurs ATS, Batterie Condensateurs)',
    cameroonAnchor: 'TGBT Usines Brassières, Cimenteries CIMENCAM, Sièges Sociaux et Hôpitaux',
    domainCode: 'D06',
    iconName: 'Box',
    accentColor: 'from-orange-500 to-amber-600',
    overviewFr: 'Le TGBT centralise l’arrivée d’énergie, mesure la qualité du courant, compense l’énergie réactive (cos φ) et bascule automatiquement sur groupe électrogène en cas de perte du réseau public.',
    overviewEn: 'The main LV switchboard centralizes incoming power, monitors quality, corrects power factor, and automatically transfers to emergency gensets upon public utility outages.',
    ratings: [
      { label: 'Courant Assigné In', value: '3200', unit: 'A' },
      { label: 'Tenue Court-Circuit Icw', value: '65', unit: 'kA 1s' },
      { label: 'Forme de Ségrégation', value: 'Forme 4b', unit: 'CEI 61439' },
      { label: 'Indice Protection', value: 'IP43 / IK10', unit: '' }
    ],
    flows: {
      POWER: {
        flowType: 'POWER',
        titleFr: 'Distribution & Jeux de Barres Cuivre',
        titleEn: 'Main Busbar Power Distribution',
        summaryFr: 'Alimentation des départs moteurs, CVC, éclairage et ASI via disjoncteurs sélectifs.',
        summaryEn: 'Power routing to motor feeders, HVAC, lighting, and UPS via fully selective circuit breakers.',
        telemetryTag: 'TGBT_TOTAL_P = 1.42 MW',
        statusBadge: 'Jeu Barres 3200A',
        activeColor: 'text-amber-400'
      },
      PROTECTION: {
        flowType: 'PROTECTION',
        titleFr: 'Déclencheurs Électroniques LSI + Détection Arc Flash',
        titleEn: 'Electronic LSI Trip Units & Arc Flash Protection',
        summaryFr: 'Sélectivité logique et capteurs optiques à fibre étendant l’arc électrique en 35 ms.',
        summaryEn: 'Zone selective interlocking (ZSI) and optical arc sensors quenching internal flash in 35 ms.',
        telemetryTag: 'MICROLOGIC_6.0X',
        statusBadge: 'Sélectivité ZSI',
        activeColor: 'text-emerald-400'
      },
      CONTROL: {
        flowType: 'CONTROL',
        titleFr: 'Inverseur Automatique de Source Normal/Secours (ATS)',
        titleEn: 'Automatic Transfer Switch (ATS) to Genset',
        summaryFr: 'Démarrage automatique du groupe diesel de secours et permutation des sources en moins de 10 s.',
        summaryEn: 'Automated blackout detection, diesel genset cranking, and synchronized load bus transfer in 10s.',
        telemetryTag: 'ATS_STATE = SOURCE_NORMAL',
        statusBadge: 'Automate Prêt',
        activeColor: 'text-cyan-400'
      },
      COMMUNICATION: {
        flowType: 'COMMUNICATION',
        titleFr: 'Supervision GTB / GTC Modbus TCP & Passerelle Cloud',
        titleEn: 'BMS Modbus TCP Telemetry & Energy Cloud',
        summaryFr: 'Mesure en continu des harmoniques THD, des consommations kWh et des alarmes thermiques.',
        summaryEn: 'Real-time harmonic logging, load profile breakdown, and breaker status streaming to BMS.',
        telemetryTag: 'MODBUS_TCP_PORT_502',
        statusBadge: 'GTB Connectée',
        activeColor: 'text-purple-400'
      }
    },
    targetView: 'commissioning'
  },

  // ── Stage 8: Charges & Utilisations Finales ──
  {
    id: 'stage-8-loads',
    stepNumber: 8,
    code: 'D05',
    titleFr: '8. Utilisations Finales & Travail Utile',
    titleEn: '8. End-Use & Useful Mechanical Work',
    subtitleFr: 'Moteurs asynchrones, pompage, éclairage, froid et serveurs',
    subtitleEn: 'Industrial motors, pumping, lighting, HVAC, and servers',
    voltageTier: '400 V / 230 V Utilisation',
    primaryEquipment: 'Moteurs Asynchrones IE4 (250 kW), Pompes Hydrauliques, Variateurs de Vitesse VFD, ASI / UPS, Climatisation',
    cameroonAnchor: 'Stations de pompage Camwater (Akomnyada, Yato), data centers, scieries et hôpitaux',
    domainCode: 'D05',
    iconName: 'Wrench',
    accentColor: 'from-purple-600 to-pink-600',
    overviewFr: 'Aboutissement ultime de la chaîne : l’énergie électrique est convertie en travail mécanique (pompage d’eau, concassage), en flux d’air frais (CVC), en lumière et en traitement de données numériques.',
    overviewEn: 'The ultimate destination of the power chain: electricity is converted into mechanical work (water pumping, crushing mills), HVAC cooling, lighting, and data center compute.',
    ratings: [
      { label: 'Rendement Moteur IE4', value: '96.2', unit: '%' },
      { label: 'Courant de Démarrage', value: '7.2 x In', unit: 'Direct' },
      { label: 'Temps Démarrage Direct', value: '3.8', unit: 's' },
      { label: 'Creux de Tension Max', value: 'ΔU = 8.5%', unit: 'Transitoire' }
    ],
    flows: {
      POWER: {
        flowType: 'POWER',
        titleFr: 'Conversion en Travail Mécanique Utile',
        titleEn: 'Useful Mechanical Work Output',
        summaryFr: 'Arbre moteur délivrant 1590 N.m de couple pour entraîner les pompes de refoulement d’eau potable.',
        summaryEn: 'Motor shaft producing 1590 N.m torque driving city drinking water supply booster pumps.',
        telemetryTag: 'MOTOR_TORQUE = 1540 N.m',
        statusBadge: 'Régime Nominal',
        activeColor: 'text-amber-400'
      },
      PROTECTION: {
        flowType: 'PROTECTION',
        titleFr: 'Relais Thermique Moteur 49 & Blocage Rotor 51LR',
        titleEn: 'Motor Thermal Overload 49 & Locked Rotor 51LR',
        summaryFr: 'Modèle thermique à image d’échauffement protégeant le bobinage contre les surcharges et calages.',
        summaryEn: 'Thermal memory model shielding motor windings from stalls and heavy duty overload cycles.',
        telemetryTag: 'ANSI 49 / 51LR / 37',
        statusBadge: 'Image Thermique 64%',
        activeColor: 'text-emerald-400'
      },
      CONTROL: {
        flowType: 'CONTROL',
        titleFr: 'Variateur de Vitesse VFD (Contrôle Vectoriel)',
        titleEn: 'Variable Frequency Drive VFD Vector Control',
        summaryFr: 'Démarrage en douceur sans appel de courant (rampe U/f) et régulation de débit par boucle PID.',
        summaryEn: 'Soft-starting with zero inrush spike via flux vector control and closed-loop PID pump pressure.',
        telemetryTag: 'VFD_FREQ_OUT = 48.2 Hz',
        statusBadge: 'Régulation PID',
        activeColor: 'text-cyan-400'
      },
      COMMUNICATION: {
        flowType: 'COMMUNICATION',
        titleFr: 'Automate Programmable API / PLC & Bus de Terrain',
        titleEn: 'PLC Industrial Controller & Fieldbus I/O',
        summaryFr: 'Supervision de la pression, du débit m³/h et de la température des paliers en temps réel.',
        summaryEn: 'Streaming real-time bearing vibration, water pressure, and flow rates via Profinet/Modbus.',
        telemetryTag: 'PROFINET_IO_CYCLE',
        statusBadge: 'Bus 100 Mbps',
        activeColor: 'text-purple-400'
      }
    },
    targetView: 'simulation',
    targetParams: { simulationTab: 'motor' }
  }
];

export const FLOW_CONFIG: Record<
  EnergyFlowType,
  { labelFr: string; labelEn: string; iconName: string; color: string; bg: string; border: string; descFr: string; descEn: string }
> = {
  POWER: {
    labelFr: 'Flux de Puissance (MW, Mvar, kV, A)',
    labelEn: 'Power Flow (MW, Mvar, kV, A)',
    iconName: 'Zap',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    descFr: 'Transit de l’énergie électrique active et réactive, tensions et courants à travers les appareils.',
    descEn: 'Active and reactive energy transit, voltage tiers, and load currents through apparatus.'
  },
  PROTECTION: {
    labelFr: 'Flux de Protection (TC/TP, Relais, Ordres Trip)',
    labelEn: 'Protection Flow (CT/VT, Relays, Trip Pulses)',
    iconName: 'Shield',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    descFr: 'Chaîne de sécurité : capteurs de mesure, seuils ANSI, calcul différentiel et ordres de déclenchement.',
    descEn: 'Safety chain: sensing instrument transformers, ANSI thresholds, differential logic, and trip coils.'
  },
  CONTROL: {
    labelFr: 'Flux de Commande (Automatismes, ATS, Télécommandes)',
    labelEn: 'Control Flow (Automation, ATS, Remote Switching)',
    iconName: 'Cpu',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    descFr: 'Pilotage : automates de transfert ATS, réenclencheurs, régulateurs AVR et télécommandes de quart.',
    descEn: 'Dispatch: automated transfer switches, auto-reclosers, generator AVRs, and operator commands.'
  },
  COMMUNICATION: {
    labelFr: 'Flux de Communication (SCADA, IEC 61850, OPGW)',
    labelEn: 'Communication Flow (SCADA, IEC 61850, OPGW)',
    iconName: 'Radio',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    descFr: 'Réseaux de téléconduite : bus de process/station IEC 61850, fibre optique OPGW et protocole IEC 104.',
    descEn: 'Operational telecommunications: IEC 61850 station bus, OPGW fiber, and SCADA IEC 104 protocol.'
  }
};
