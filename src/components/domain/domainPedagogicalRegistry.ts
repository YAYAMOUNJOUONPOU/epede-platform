// src/components/domain/domainPedagogicalRegistry.ts
// Structured pedagogical orientation for EPEDE Technical Domains (D01 to D16)
// Adheres strictly to Section 2.2 and Section 4 of the EPEDE Audit Report:
// 1. "Où suis-je ?"
// 2. "Que vais-je comprendre ?"
// 3. "Que puis-je faire ensuite ?"

export interface DomainPedagogicalGuide {
  domainCode: string;
  roleInGrid: {
    fr: string;
    en: string;
  };
  voltageLevel: string;
  learningObjectives: {
    fr: string[];
    en: string[];
  };
  keyCalculators: {
    id: string;
    labelFr: string;
    labelEn: string;
    tab?: string;
  }[];
  primaryStandard: string;
}

export const DOMAIN_PEDAGOGICAL_DATA: Record<string, DomainPedagogicalGuide> = {
  D01: {
    domainCode: 'D01',
    roleInGrid: {
      fr: "Production d'énergie : conversion de sources primaires (hydro, thermique, solaire, éolien) en puissance électrique triphasée HTB.",
      en: 'Power Generation: primary energy conversion into high-voltage 3-phase electric power.',
    },
    voltageLevel: '11 kV → 225 kV (GSU)',
    learningObjectives: {
      fr: [
        "Comprendre le fonctionnement des alternateurs synchrones et systèmes d'excitation (AVR).",
        "Maîtriser le contrôle fréquence-puissance (governor / f-P) et tension-réactif (diagramme de capabilité P-Q).",
        "Identifier les contraintes de raccordement réseau HTB selon le Code de Réseau camerounais et international.",
      ],
      en: [
        'Understand synchronous generators and excitation systems (AVR).',
        'Master frequency-power regulation (governor / f-P) and voltage-reactive control (P-Q capability curve).',
        'Identify HV grid code connection requirements according to national and international standards.',
      ],
    },
    keyCalculators: [
      { id: 'short_circuit', labelFr: 'Calcul Icc Alternateur (IEC 60909)', labelEn: 'Generator Short-Circuit (IEC 60909)', tab: 'short_circuit' },
      { id: 'transformer', labelFr: 'Dimensionnement Transformateur GSU', labelEn: 'GSU Transformer Sizing', tab: 'transformer' },
    ],
    primaryStandard: 'IEC 60034-1',
  },
  D02: {
    domainCode: 'D02',
    roleInGrid: {
      fr: "Architecture et planification globale : modélisation du maillage de transport, équilibre production-consommation et résilience N-1.",
      en: 'Grid Architecture & Planning: transmission mesh modeling, generation-load balance and N-1 resilience.',
    },
    voltageLevel: '225 kV · 90 kV · 30 kV',
    learningObjectives: {
      fr: [
        "Analyser la topologie des réseaux maillés et les flux de puissance (Load Flow / Newton-Raphson).",
        "Évaluer le comportement dynamique du réseau face à la perte d'un ouvrage majeur (critère N-1).",
        "Comprendre le rôle du Dispatching National et la hiérarchie des réglages primaire, secondaire et tertiaire.",
      ],
      en: [
        'Analyze meshed grid topology and power flow transit (Newton-Raphson / DC load flow).',
        'Assess dynamic grid stability under major contingency (N-1 reliability criterion).',
        'Understand National Dispatching hierarchy for primary, secondary and tertiary regulation.',
      ],
    },
    keyCalculators: [
      { id: 'short_circuit', labelFr: 'Transit de puissance & Icc de boucle', labelEn: 'Power Flow & Loop Icc', tab: 'short_circuit' },
      { id: 'voltage_drop', labelFr: 'Plan de tension & Dérives réactives', labelEn: 'Voltage Profile & Reactive Drops', tab: 'voltage_drop' },
    ],
    primaryStandard: 'IEC 60038',
  },
  D03: {
    domainCode: 'D03',
    roleInGrid: {
      fr: "Transport Haute Tension (HTB) : transit massif d'énergie sur longues distances via lignes aériennes et câbles isolés.",
      en: 'High-Voltage Transmission: bulk energy transit over long distances via overhead lines and XLPE cables.',
    },
    voltageLevel: '225 kV · 90 kV',
    learningObjectives: {
      fr: [
        "Calculer les paramètres linéiques (R, L, C) des conducteurs Almelec/ACSR et faisceaux 225 kV.",
        "Comprendre l'effet Ferranti à vide et la nécessité de compensation shunt (réactances inductives).",
        "Maîtriser les limites de transit thermique (MVA), les flèches mécaniques et les surtensions de foudre.",
      ],
      en: [
        'Calculate line parameters (R, L, C) for overhead bundle conductors and insulated cables.',
        'Understand Ferranti effect under light load and shunt inductive compensation requirements.',
        'Master thermal MVA ampacity, mechanical sag clearances and lightning surge protection.',
      ],
    },
    keyCalculators: [
      { id: 'cable', labelFr: 'Dimensionnement Conducteur Ligne HTB', labelEn: 'HV Line Conductor Sizing', tab: 'cable' },
      { id: 'voltage_drop', labelFr: 'Chute de tension sur longue distance', labelEn: 'Long-Distance Voltage Drop', tab: 'voltage_drop' },
    ],
    primaryStandard: 'IEC 60826',
  },
  D04: {
    domainCode: 'D04',
    roleInGrid: {
      fr: "Postes électriques et transformation : nœuds stratégiques d'interconnexion, de coupure et d'adaptation de tension (HTB/HTA).",
      en: 'Substations & Transformation: strategic grid nodes for power transformation, switching and interconnection (HV/MV).',
    },
    voltageLevel: '225 kV / 90 kV / 30 kV / 15 kV',
    learningObjectives: {
      fr: [
        "Différencier les topologies de poste (simple jeu de barres, double barre, disjoncteur et demi) et technologies AIS / GIS.",
        "Comprendre le fonctionnement et la coupure de l'arc dans les disjoncteurs SF6 et sous vide (IEC 62271-100).",
        "Maîtriser le rôle des transformateurs de puissance, du régleur en charge (OLTC) et des réducteurs de mesure (TC/TT).",
      ],
      en: [
        'Distinguish substation topologies (single bus, double bus, breaker-and-a-half) and AIS vs GIS switchgear.',
        'Understand arc quenching physics in SF6 and vacuum circuit breakers (IEC 62271-100).',
        'Master power transformer operation, on-load tap changers (OLTC) and instrument transformers (CT/VT).',
      ],
    },
    keyCalculators: [
      { id: 'transformer', labelFr: 'Bilan Transformateur & Rendement', labelEn: 'Transformer Sizing & Losses', tab: 'transformer' },
      { id: 'short_circuit', labelFr: 'Pouvoir de coupure Icu / Icw', labelEn: 'Breaking Capacity Icu / Icw', tab: 'short_circuit' },
    ],
    primaryStandard: 'IEC 61936-1',
  },
  D05: {
    domainCode: 'D05',
    roleInGrid: {
      fr: "Distribution Moyenne Tension (HTA) : acheminement de l'énergie des postes sources vers les cabines de distribution et clients industriels.",
      en: 'Medium-Voltage Distribution (MV): energy routing from primary substations to distribution kiosks and industrial customers.',
    },
    voltageLevel: '30 kV · 15 kV · 5.5 kV',
    learningObjectives: {
      fr: [
        "Analyser les architectures de réseau HTA (boucle ouverte, antenne radiale, double dérivation).",
        "Dimensionner les postes de transformation HTA/BT maçonnés et sur poteau (H61) selon les contraintes locales.",
        "Comprendre la gestion des défauts à la terre selon le régime de neutre MT (résistance, bobine Petersen, neutre isolé).",
      ],
      en: [
        'Analyze MV network architectures (open ring, radial feeder, dual feed redundancy).',
        'Size MV/LV distribution transformer substations (kiosks and pole-mounted H61).',
        'Understand earth fault handling according to MV neutral grounding (impedance, Petersen coil, isolated).',
      ],
    },
    keyCalculators: [
      { id: 'cable', labelFr: 'Section Câble HTA (NF C 13-200 / IEC 60502)', labelEn: 'MV Cable Sizing (IEC 60502)', tab: 'cable' },
      { id: 'short_circuit', labelFr: 'Courant de court-circuit HTA Ik', labelEn: 'MV Short-Circuit Current Ik', tab: 'short_circuit' },
    ],
    primaryStandard: 'NF C 13-200',
  },
  D06: {
    domainCode: 'D06',
    roleInGrid: {
      fr: "Installations Basse Tension & Utilisation : distribution terminale 400 V / 230 V, tableaux TGBT et sécurité des personnes et biens.",
      en: 'Low-Voltage Installations & End-Use: 400 V / 230 V terminal distribution, main switchboards (TGBT) and electrical safety.',
    },
    voltageLevel: '400 V / 230 V (BT)',
    learningObjectives: {
      fr: [
        "Choisir et mettre en œuvre les schémas de liaison à la terre (régimes TT, TN-C, TN-S, IT) selon la norme NF C 15-100 / IEC 60364.",
        "Calculer les chutes de tension admissibles (≤ 3% éclairage, ≤ 5% force motrice) et sections de conducteurs.",
        "Assurer la sélectivité ampèremétrique, chronométrique et la filiation des disjoncteurs BT.",
      ],
      en: [
        'Select and implement grounding earthing schemes (TT, TN-C, TN-S, IT) per NF C 15-100 / IEC 60364.',
        'Calculate allowable voltage drops (≤ 3% lighting, ≤ 5% motive power) and conductor cross-sections.',
        'Ensure current selectivity, time grading and cascading in low-voltage circuit breakers.',
      ],
    },
    keyCalculators: [
      { id: 'cable', labelFr: 'Dimensionnement Câble BT (NF C 15-100)', labelEn: 'LV Cable Sizing (NF C 15-100)', tab: 'cable' },
      { id: 'short_circuit', labelFr: 'Icc Max & Min en bout de ligne', labelEn: 'End-of-line Icc Max & Min', tab: 'short_circuit' },
      { id: 'voltage_drop', labelFr: 'Chute de tension triphasée & mono', labelEn: '3-Phase & 1-Phase Voltage Drop', tab: 'voltage_drop' },
    ],
    primaryStandard: 'NF C 15-100 / IEC 60364',
  },
  D07: {
    domainCode: 'D07',
    roleInGrid: {
      fr: "Protection et automatismes de réseau : détection instantanée des défauts, sélectivité et élimination sélective par relais numériques IED.",
      en: 'Power System Protection: ultrafast fault detection, selectivity and isolation via digital IED relays.',
    },
    voltageLevel: 'Tous niveaux (HTB / HTA / BT)',
    learningObjectives: {
      fr: [
        "Comprendre les codes ANSI essentiels : 50/51 (surintensité), 50N/51N (terre), 87T/87L (différentielle), 21 (distance).",
        "Éviter la saturation des transformateurs de courant (TC 5P20, classe PX) lors des courts-circuits violents.",
        "Construire les courbes temps-courant (TCC) et régler les seuils de sélectivité chronométrique.",
      ],
      en: [
        'Understand essential ANSI protective codes: 50/51 (overcurrent), 50N/51N (earth), 87T/87L (differential), 21 (distance).',
        'Prevent current transformer saturation (CT 5P20, class PX) under severe short-circuit duties.',
        'Plot time-current curves (TCC) and coordinate tripping thresholds for time-graded selectivity.',
      ],
    },
    keyCalculators: [
      { id: 'short_circuit', labelFr: 'Réglage des seuils de déclenchement Icc', labelEn: 'Trip Threshold Coordination', tab: 'short_circuit' },
      { id: 'transformer', labelFr: 'Vérification charge secondaire TC', labelEn: 'CT Secondary Burden Check', tab: 'transformer' },
    ],
    primaryStandard: 'IEC 60255-1',
  },
  D08: {
    domainCode: 'D08',
    roleInGrid: {
      fr: "Contrôle-Commande et Automatismes : supervision temps réel (SCADA, IHM, RTU), téléconduite et protocoles de poste IEC 61850.",
      en: 'Control, Automation & SCADA: real-time supervisory control, substation automation and IEC 61850 protocol stacks.',
    },
    voltageLevel: '24 V DC · 48 V DC · 110 V / 220 V DC · Ethernet OT',
    learningObjectives: {
      fr: [
        "Comprendre l'architecture 3 niveaux des postes numériques (Niveau procédé, Niveau baie, Niveau station).",
        "Maîtriser les protocoles de communication industrielle : IEC 61850 (GOOSE, MMS, SV), Modbus-TCP, IEC 60870-5-104.",
        "Mettre en œuvre les architectures de redondance réseau sans coupure (PRP, HSR) et la cybersécurité OT (IEC 62443).",
      ],
      en: [
        'Understand 3-tier digital substation architecture (Process Level, Bay Level, Station Level).',
        'Master industrial protocols: IEC 61850 (GOOSE, MMS, SV), Modbus-TCP, IEC 60870-5-104.',
        'Implement zero-loss network redundancy (PRP, HSR) and OT operational cybersecurity (IEC 62443).',
      ],
    },
    keyCalculators: [
      { id: 'short_circuit', labelFr: 'Temps de réponse & Latence GOOSE', labelEn: 'GOOSE Latency & Trip Budget', tab: 'short_circuit' },
    ],
    primaryStandard: 'IEC 61850',
  },
  D09: {
    domainCode: 'D09',
    roleInGrid: {
      fr: "Réseaux Intelligents (Smart Grids) & Digitalisation : comptage avancé (AMI), flexibilité de la demande, IoT industriel et intégration EnR.",
      en: 'Smart Grids & Digitalization: Advanced Metering Infrastructure (AMI), demand response, industrial IoT and RES integration.',
    },
    voltageLevel: 'Smart Grid Multi-Niveaux',
    learningObjectives: {
      fr: [
        "Comprendre le fonctionnement des compteurs communicants (AMI/AMR) et concentrateurs de données.",
        "Analyser l'impact de l'intermittence des énergies renouvelables sur la fréquence et la stabilité de tension.",
        "Découvrir les algorithmes de prévision de charge et l'optimisation par jumeau numérique de réseau.",
      ],
      en: [
        'Understand smart metering infrastructure (AMI/AMR) and data concentrator architectures.',
        'Analyze renewable generation intermittency impacts on grid frequency and voltage regulation.',
        'Discover load forecasting algorithms and power network digital twin optimization.',
      ],
    },
    keyCalculators: [
      { id: 'transformer', labelFr: 'Calcul taux d\'autoconsommation & foisonnement', labelEn: 'Self-Consumption & Diversity Factor', tab: 'transformer' },
    ],
    primaryStandard: 'IEC 62056',
  },
  D10: {
    domainCode: 'D10',
    roleInGrid: {
      fr: "Exploitation, Maintenance et Diagnostics (Asset Management) : suivi de santé des actifs, maintenance prédictive, analyse DGA et sécurité électrique.",
      en: 'Asset Management, Operations & Diagnostics: equipment health monitoring, predictive maintenance, DGA analysis and electrical safety.',
    },
    voltageLevel: 'Tous parcs (HTB / HTA / BT)',
    learningObjectives: {
      fr: [
        "Interpréter les analyses des gaz dissous dans l'huile de transformateur (DGA selon IEC 60599 / triangle de Duval).",
        "Mesurer et analyser les décharges partielles (DP), la résistance d'isolement et la tangente delta ($\tan \delta$).",
        "Appliquer les procédures de consignation électrique en 5 étapes (NF C 18-510) pour garantir la sécurité des intervenants.",
      ],
      en: [
        'Interpret dissolved gas analysis in transformer oil (DGA per IEC 60599 / Duval triangle).',
        'Measure and analyze partial discharges (PD), insulation resistance and dielectric dissipation factor ($\tan \delta$).',
        'Apply standard 5-step electrical isolation and lockout/tagout procedures (NF C 18-510).',
      ],
    },
    keyCalculators: [
      { id: 'transformer', labelFr: 'Diagnostic Gaz Dissous (IEC 60599)', labelEn: 'Dissolved Gas Diagnostics (IEC 60599)', tab: 'transformer' },
    ],
    primaryStandard: 'IEC 60599 / NF C 18-510',
  },
};

export function getDomainPedagogicalGuide(code: string): DomainPedagogicalGuide {
  return DOMAIN_PEDAGOGICAL_DATA[code] || {
    domainCode: code,
    roleInGrid: {
      fr: `Domaine technique spécialisé ${code} au sein du système électrique EPEDE.`,
      en: `Specialized engineering domain ${code} within the EPEDE power system.`,
    },
    voltageLevel: 'HTB / HTA / BT',
    learningObjectives: {
      fr: [
        `Comprendre les principes fondamentaux et les grandeurs physiques régissant le domaine ${code}.`,
        "Identifier les équipements critiques et leurs spécifications de plaque signalétique.",
        "Consulter les normes internationales et les cas pratiques d'ingénierie associés.",
      ],
      en: [
        `Understand key physical principles and equations governing domain ${code}.`,
        'Identify critical apparatus and nameplate ratings.',
        'Review relevant international standards and practical field case studies.',
      ],
    },
    keyCalculators: [
      { id: 'cable', labelFr: 'Dimensionnement Câble', labelEn: 'Cable Sizing', tab: 'cable' },
      { id: 'short_circuit', labelFr: 'Court-Circuit IEC 60909', labelEn: 'Short-Circuit IEC 60909', tab: 'short_circuit' },
    ],
    primaryStandard: 'IEC 60364',
  };
}
