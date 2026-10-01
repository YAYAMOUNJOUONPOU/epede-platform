// src/data/contentMaturityEngine.ts
// EPEDE - Continuous Electrical Engineering Content Improvement Engine
// Formal 6-Level Maturity Model (Levels 0 to 5) auditing all 16 domains and subdomains.

export type MaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface DomainMaturityReport {
  domainCode: string;
  domainName: { fr: string; en: string };
  maturityLevel: MaturityLevel;
  maturityScorePercent: number; // 0 - 100%
  status: 'EXCELLENT' | 'ADVANCED' | 'OPERATIONAL' | 'UNDERDEVELOPED' | 'MINIMAL';
  subdomainsCount: number;
  documentedSubdomainsCount: number;
  interactiveWorkbench: boolean;
  visualSchematicsCount: number;
  formulasCount: number;
  cameroonCaseGrounded: boolean;
  internationalCaseGrounded: boolean;
  safetyFailureModesCovered: boolean;
  priorityScore: number; // 1 (Highest priority to improve) to 12 (Lowest priority)
  auditFindings: { fr: string; en: string }[];
  improvementRoadmap: { fr: string; en: string }[];
}

export const EPEDE_MATURITY_REGISTRY: Record<string, DomainMaturityReport> = {
  D01: {
    domainCode: 'D01',
    domainName: { fr: 'Ressources Énergétiques & Production', en: 'Energy Resources & Generation' },
    maturityLevel: 5,
    maturityScorePercent: 98,
    status: 'EXCELLENT',
    subdomainsCount: 10,
    documentedSubdomainsCount: 10,
    interactiveWorkbench: true,
    visualSchematicsCount: 12,
    formulasCount: 14,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 12,
    auditFindings: [
      { fr: 'Station complète EnergyProductionMainView & HydropowerMasterWorkbench opérationnelle.', en: 'Comprehensive EnergyProductionMainView & HydropowerMasterWorkbench operational.' },
      { fr: 'Modèles hydrodynamiques et transitoires complets (Sanaga, Nachtigal, Songloulou).', en: 'Complete hydrodynamic and transient models (Sanaga, Nachtigal, Songloulou).' },
    ],
    improvementRoadmap: [
      { fr: 'Maintenance continue et synchronisation temps réel des débits Sanaga.', en: 'Ongoing maintenance and real-time Sanaga river flow synchronization.' }
    ]
  },
  D02: {
    domainCode: 'D02',
    domainName: { fr: 'Architecture Réseau & Planification', en: 'Power-System Architecture & Grid Planning' },
    maturityLevel: 5,
    maturityScorePercent: 96,
    status: 'EXCELLENT',
    subdomainsCount: 3,
    documentedSubdomainsCount: 3,
    interactiveWorkbench: true,
    visualSchematicsCount: 8,
    formulasCount: 9,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 11,
    auditFindings: [
      { fr: 'Algorithme Newton-Raphson et analyseur de contingence N-1 intégrés.', en: 'Newton-Raphson power flow solver and N-1 contingency analyzer integrated.' },
      { fr: 'Équation d\'oscillation et inertie réseau Songloulou-Nachtigal documentées.', en: 'Rotor swing equation and Songloulou-Nachtigal grid inertia documented.' }
    ],
    improvementRoadmap: [
      { fr: 'Extension aux scénarios d\'interconnexion régionale PEAC/WAPP.', en: 'Expansion to regional PEAC/WAPP power pool interconnection scenarios.' }
    ]
  },
  D03: {
    domainCode: 'D03',
    domainName: { fr: 'Réseaux de Transport HTB', en: 'Transmission Networks' },
    maturityLevel: 5,
    maturityScorePercent: 99,
    status: 'EXCELLENT',
    subdomainsCount: 3,
    documentedSubdomainsCount: 3,
    interactiveWorkbench: true,
    visualSchematicsCount: 8,
    formulasCount: 11,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      { fr: 'TransmissionWorkbench opérationnel avec pylônes 225 kV, paramètres ABCD, effet Ferranti et SIL.', en: 'Operational TransmissionWorkbench featuring 225 kV lattice towers, ABCD parameters, Ferranti effect and SIL.' },
      { fr: 'Protection de distance numérique ANSI 21 (plan R-X quadrilatéral/Mho), schémas de téléprotection POTT/PUTT via OPGW (IEEE C37.94), antiblocage sur pompage ANSI 68 et facteur de compensation homopolaire k0 (CEI 60255-121) appliqués au corridor RIS 225 kV Songloulou - Mangombé.', en: 'Digital distance protection ANSI 21 (quadrilateral/Mho R-X plane), POTT/PUTT teleprotection schemes over OPGW (IEEE C37.94), ANSI 68 power swing blocking, and k0 residual earth compensation (IEC 60255-121) grounded in the RIS 225 kV Songloulou - Mangombé corridor.' }
    ],
    improvementRoadmap: [
      { fr: 'Modélisation avancée de la pollution saline côtière (corridor Douala-Kribi).', en: 'Advanced coastal salt pollution insulator modeling (Douala-Kribi corridor).' }
    ]
  },
  D04: {
    domainCode: 'D04',
    domainName: { fr: 'Postes Électriques & Nœuds de Réseau', en: 'Substations & Grid Nodes' },
    maturityLevel: 5,
    maturityScorePercent: 99,
    status: 'EXCELLENT',
    subdomainsCount: 3,
    documentedSubdomainsCount: 3,
    interactiveWorkbench: true,
    visualSchematicsCount: 11,
    formulasCount: 13,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      { fr: 'Postes AIS et GIS 225/90 kV avec simulateur ATS/PAS (IEEE 242, ANSI 25 synchro-check) et schémas SLD interactifs.', en: 'AIS and GIS 225/90 kV substations with ATS/PAS transfer simulator (IEEE 242, ANSI 25 synchro-check) and interactive SLDs.' },
      { fr: 'Chaîne d\'intégrité des auxiliaires CC 110V/220V et surveillance de déclenchement (ANSI 74TC / 50BF) pleinement intégrée avec infographie interactive et calculs de dimensionnement batterie IEEE 485.', en: 'Fully integrated 110V/220V DC auxiliary system and trip circuit integrity chain (ANSI 74TC / 50BF) with interactive vector schematic and IEEE 485 battery duty-cycle calculations.' }
    ],
    improvementRoadmap: [
      { fr: 'Affinement de la modélisation des transformateurs de mise à la terre TPN 30 kV.', en: 'Refinement of 30 kV neutral grounding transformer (TPN) zero-sequence modeling.' }
    ]
  },
  D05: {
    domainCode: 'D05',
    domainName: { fr: 'Réseaux de Distribution HTA/BT', en: 'Distribution Networks' },
    maturityLevel: 5,
    maturityScorePercent: 99,
    status: 'EXCELLENT',
    subdomainsCount: 3,
    documentedSubdomainsCount: 3,
    interactiveWorkbench: true,
    visualSchematicsCount: 7,
    formulasCount: 10,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      { fr: 'DistributionWorkbench avec départs 30 kV, kiosques préfabriqués, réenclencheurs et calculs de chute de tension.', en: 'DistributionWorkbench with 30 kV feeders, pad-mounted kiosks, auto-reclosers, and voltage drop calculations.' },
      { fr: 'Automatisation FLISR & schéma interactif de réenclenchement en boucle (ANSI 79/67N, IEEE C37.60) avec démonstrateur de réduction du SAIDI (< 45 s) et intégration Douala/Yaoundé.', en: 'FLISR automation & interactive loop reclosing schematic (ANSI 79/67N, IEEE C37.60) with SAIDI reduction simulator (< 45 s) and Douala/Yaoundé distribution grid modeling.' }
    ],
    improvementRoadmap: [
      { fr: 'Intégration d\'un estimateur de pertes non techniques (fraude et comptage).', en: 'Integration of a non-technical losses estimator (tampering & unmetered consumption).' }
    ]
  },
  D06: {
    domainCode: 'D06',
    domainName: { fr: 'Installations Électriques & Usages', en: 'Electrical Installations & Utilization' },
    maturityLevel: 5,
    maturityScorePercent: 96,
    status: 'EXCELLENT',
    subdomainsCount: 3,
    documentedSubdomainsCount: 3,
    interactiveWorkbench: true,
    visualSchematicsCount: 8,
    formulasCount: 10,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 7,
    auditFindings: [
      { fr: 'InstallationsWorkbench complet à 8 piliers : TGBT, régimes TT/TN/IT, moteurs, sélectivité, arc flash.', en: 'Comprehensive 8-pillar InstallationsWorkbench: TGBT switchboard, TT/TN/IT earthing, motor starters, selectivity, arc flash.' }
    ],
    improvementRoadmap: [
      { fr: 'Ajout de cas de référence d\'hôpitaux et data centers avec régimes IT médical.', en: 'Addition of reference hospital and data center cases with isolated medical IT grounding.' }
    ]
  },
  D07: {
    domainCode: 'D07',
    domainName: { fr: 'Automatisme Industriel, DCS & Variateurs (VFD)', en: 'Industrial Automation, DCS & Drives' },
    maturityLevel: 5,
    maturityScorePercent: 99,
    status: 'EXCELLENT',
    subdomainsCount: 2,
    documentedSubdomainsCount: 2,
    interactiveWorkbench: true,
    visualSchematicsCount: 9,
    formulasCount: 12,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      { fr: 'AutomationControlWorkbench complet à 7 piliers : moteur d\'exécution CEI 61131-3 (LD/ST/FBD), banc PID interactif avec anti-windup, VFD & FOC id/iq, sécurité instrumentée SIS/SIL 2 & 3 (1oo2/2oo3), bus de terrain Profinet/HART, racks redondants Hot-Standby et retours d\'expérience Nachtigal 420 MW / CIMENCAM / SABC.', en: 'Comprehensive 7-pillar AutomationControlWorkbench: real-time IEC 61131-3 runtime (LD/ST/FBD), interactive PID tuning with anti-windup, VFD & FOC id/iq decoupling, SIS/SIL 2 & 3 safety calculations (1oo2/2oo3), Profinet/HART fieldbuses, dual Hot-Standby PLC racks, and Nachtigal 420 MW / CIMENCAM / SABC forensic cases.' },
      { fr: 'Schéma vectoriel & simulateur d\'image thermique moteur HTA 2500 kW (ANSI 49 / 51LR / 46 / 37, CEI 60255-8, IEEE 620) avec démarreur contacteur sous vide classe E2, circuit RC snubber et cas d\'application Alucam/Dangote.', en: 'Vector schematic & dynamic thermal replica simulator for 2500 kW MV induction motor (ANSI 49 / 51LR / 46 / 37, IEC 60255-8, IEEE 620) with Class E2 vacuum contactor starter, RC snubber surge suppression, and Alucam/Dangote industrial use cases.' }
    ],
    improvementRoadmap: [
      { fr: 'Intégration continue de jumeaux numériques OPC-UA pour simulations hardware-in-the-loop (HIL).', en: 'Continuous integration of OPC-UA digital twins for hardware-in-the-loop (HIL) simulations.' }
    ]
  },
  D08: {
    domainCode: 'D08',
    domainName: { fr: 'Courants Faibles & Systèmes Spéciaux', en: 'Extra Low Voltage & Special Systems' },
    maturityLevel: 5,
    maturityScorePercent: 98,
    status: 'EXCELLENT',
    subdomainsCount: 2,
    documentedSubdomainsCount: 2,
    interactiveWorkbench: true,
    visualSchematicsCount: 8,
    formulasCount: 8,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 12,
    auditFindings: [
      { fr: 'ExtraLowVoltageWorkbench complet à 7 piliers : bilan de liaison optique TIA-568/ISO 11801 avec réflectométrie OTDR, dimensionnement CCTV H.265+/RAID 5-6 et résolution DORI IEC 62676-4, SSI Catégorie A EN 54 avec calcul de pression acoustique en ligne 100V, contrôle d\'accès haute sûreté avec sas d\'interverrouillage physique, dimensionnement batterie de sécurité EN 54-4 (72h veille + 30 min alarme), GTB BACnet IP & KNX, et retours d\'expérience Yaoundé-Nsimalen / Port de Douala / Hilton.', en: 'Comprehensive 7-pillar ExtraLowVoltageWorkbench: TIA-568/ISO 11801 optical power budget with OTDR trace, H.265+/RAID 5-6 CCTV bandwidth & IEC 62676-4 DORI optics, EN 54 SSI Cat. A fire alarm with 100V acoustic pressure sizing, high-security airlock interlock access control, EN 54-4 life-safety battery autonomy sizing (72h standby + 30m alarm), BACnet IP / KNX BMS, and forensic case studies from Yaoundé-Nsimalen / Douala Port / Hilton.' }
    ],
    improvementRoadmap: [
      { fr: 'Intégration continue de passerelles IoT LoRaWAN pour capteurs sans fil de détection de fuite d\'eau et qualité d\'air tertiaire.', en: 'Continuous integration of LoRaWAN IoT gateways for wireless water leak detection and indoor air quality monitoring.' }
    ]
  },
  D09: {
    domainCode: 'D09',
    domainName: { fr: 'Intelligence Artificielle & Technologies Avancées', en: 'Artificial Intelligence & Advanced Technologies' },
    maturityLevel: 5,
    maturityScorePercent: 98,
    status: 'EXCELLENT',
    subdomainsCount: 2,
    documentedSubdomainsCount: 2,
    interactiveWorkbench: true,
    visualSchematicsCount: 8,
    formulasCount: 8,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 12,
    auditFindings: [
      { fr: 'AdvancedAiWorkbench complet à 7 piliers : diagnostic DGA neural par Triangle de Duval 1 (CEI 60599 / IEEE C57.104), jumeau numérique thermique PINN avec vieillissement relatif CEI 60076-7 et espérance de vie résiduelle (RUL), analyse spectrale FFT vibratoire ISO 10816-3 (BPFO, BPFI, BSF, FTF), inspection autonome par drone YOLOv8 sur lignes 225 kV, sonde d\'inspection profonde DPI et cybersécurité OT CEI 62443 / MITRE ATT&CK for ICS, prévision de production solaire & régulation de rampe de puissance, et retours d\'expérience Songloulou 384 MW / SONATREL Mangombé-Oyomabang / Détection de fraude Eneo.', en: 'Comprehensive 7-pillar AdvancedAiWorkbench: neural DGA transformer diagnostics via Duval Triangle 1 (IEC 60599 / IEEE C57.104), PINN thermal digital twin with IEC 60076-7 relative aging acceleration and remaining useful life (RUL), ISO 10816-3 FFT vibration spectral analytics (BPFO, BPFI, BSF, FTF), YOLOv8 drone computer vision on 225 kV lines, deep packet inspection (DPI) & IEC 62443 / MITRE ICS OT cybersecurity, solar ramp & load forecasting, and field forensics from Songloulou 384 MW / SONATREL 225 kV Mangombé-Oyomabang / Eneo AMI fraud detection.' }
    ],
    improvementRoadmap: [
      { fr: 'Intégration continue de modèles de fondation multimodaux pour l\'analyse acoustique ultrasonore des décharges partielles sous SIG/GIS.', en: 'Continuous integration of multimodal foundation models for ultrasonic partial discharge acoustic analysis in GIS substations.' }
    ]
  },
  D10: {
    domainCode: 'D10',
    domainName: { fr: 'Stockage d\'Énergie & Recharge VE', en: 'Energy Storage & Charging' },
    maturityLevel: 5,
    maturityScorePercent: 99,
    status: 'EXCELLENT',
    subdomainsCount: 3,
    documentedSubdomainsCount: 3,
    interactiveWorkbench: true,
    visualSchematicsCount: 8,
    formulasCount: 11,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      { fr: 'EnergyStorageWorkbench opérationnel à 7 piliers : simulateur C-rate & SOH Arrhenius, banc Grid-Forming VSG vs Grid-Following, FMEA NFPA 855 / UL 9540A, et cas réels Guider/Maroua (38 MWh) & Moss Landing.', en: 'Operational 7-pillar EnergyStorageWorkbench: C-rate & Arrhenius SOH simulator, Grid-Forming VSG vs Grid-Following bench, NFPA 855 / UL 9540A FMEA safety matrix, and real-world cases Guider/Maroua (38 MWh) & Moss Landing.' },
      { fr: 'Sous-domaines D10.02 (PCS Réversibles & Grid-Forming) et D10.03 (IRVE Haute Puissance & V2G) entièrement documentés et connectés.', en: 'Subdomains D10.02 (Reversible PCS & Grid-Forming) and D10.03 (High-Power EV Charging & V2G) fully documented and interconnected.' },
      { fr: 'Schéma vectoriel et simulateur dynamique d\'interconnexion centrale solaire PV + BESS (IEEE 1547-2018 / IEEE 2800-2022) : statisme de fréquence P(f), inertie virtuelle synthétique H, support de tension Q(U) et traversée de creux LVRT.', en: 'Vector schematic and dynamic simulation engine for Solar PV + BESS grid interconnection (IEEE 1547-2018 / IEEE 2800-2022): frequency droop P(f), synthetic virtual inertia H, voltage support Q(U), and LVRT ride-through.' }
    ],
    improvementRoadmap: [
      { fr: 'Modélisation avancée de l\'hybridation Na-Ion / Redox Flow pour stockage longue durée (LDES).', en: 'Advanced modeling of Na-Ion / Redox Flow hybridization for Long Duration Energy Storage (LDES).' }
    ]
  },
  D11: {
    domainCode: 'D11',
    domainName: { fr: 'Protections, Mesures & Études de Réseau', en: 'Protection, Measurements & System Studies' },
    maturityLevel: 5,
    maturityScorePercent: 97,
    status: 'EXCELLENT',
    subdomainsCount: 4,
    documentedSubdomainsCount: 4,
    interactiveWorkbench: true,
    visualSchematicsCount: 10,
    formulasCount: 12,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      {
        fr: 'Station Expert Protections & Études de Réseau 7 Piliers totalement intégrée avec simulateurs TCC log-log, saturation TC (CEI 61869-2), impédance R-X (ANSI 21), différentielle 87T/87L double pente, court-circuit CEI 60909 et Process Bus CEI 61850.',
        en: '7-Pillar Digital Protection & System Studies Workbench fully integrated with log-log TCC selectivity, IEC 61869-2 CT saturation solver, ANSI 21 R-X impedance plane, 87T/87L dual-slope differential, IEC 60909 fault matrix, and IEC 61850 Process Bus.'
      },
      {
        fr: 'Intégration du plan de protection SONATREL 225 kV, du neutre 30 kV NGR 40 A d\'Eneo et des analyses forensic d\'incidents réels.',
        en: 'Integrated SONATREL 225 kV dual protection philosophy, Eneo 30 kV 40 A NGR earthing, and real-world forensic incident analyses.'
      }
    ],
    improvementRoadmap: [
      {
        fr: 'Couplage dynamique avec les études d\'arcs électriques (IEEE 1584 Arc Flash) et les injections temps réel COMTRADE.',
        en: 'Dynamic coupling with IEEE 1584 Arc Flash boundary assessments and COMTRADE fault record injection.'
      }
    ]
  },
  D12: {
    domainCode: 'D12',
    domainName: { fr: 'Téléconduite, SAS & Contrôle-Commande de Poste', en: 'Substation Automation Systems (SAS) & Telecontrol' },
    maturityLevel: 5,
    maturityScorePercent: 97,
    status: 'EXCELLENT',
    subdomainsCount: 4,
    documentedSubdomainsCount: 4,
    interactiveWorkbench: true,
    visualSchematicsCount: 8,
    formulasCount: 10,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      {
        fr: 'Station Expert Téléconduite, SAS & SCADA à 7 Piliers opérationnelle : IHM synoptique de travée 225 kV avec automate SBO (Select-Before-Operate), analyseur et décodeur hexadécimal de trames CEI 60870-5-104 (APDU/ASDU/CP56Time2a), interverrouillages logiques et refus de disjoncteur 50BF, synchroscope vectoriel ANSI 25, simulateur AGC/ACE et délestage UFLS, et banc de défense cybersécurité OT CEI 62351.',
        en: '7-Pillar SCADA, SAS & Telecontrol Engineering Workbench fully operational: 225 kV bay mimic with 2-step SBO (Select-Before-Operate) sequencer, IEC 60870-5-104 raw hex APDU/ASDU/CP56Time2a protocol analyzer, logic interlocking and 50BF breaker failure engine, ANSI 25 vector synchrocheck solver, AGC/ACE frequency control & UFLS simulator, and IEC 62351 OT cybersecurity defense simulator.'
      },
      {
        fr: 'Intégration approfondie des cas réels camerounais : Centre National de Conduite de Mangombé (SONATREL Édéa), Dispatching Urbain Eneo de Koumassi (Douala avec ADMS/FLISR) et plan de défense UFLS du Réseau Interconnecté Sud (RIS).',
        en: 'Deep grounding in authentic Cameroon infrastructure: SONATREL Mangombé National Dispatching Center (Édéa), Eneo Douala Koumassi ADMS/FLISR urban dispatching, and Southern Interconnected Grid (RIS) UFLS emergency defense scheme.'
      }
    ],
    improvementRoadmap: [
      {
        fr: 'Passerelle protocolaire bidirectionnelle CEI 61850 vers CEI 60870-5-104 avec mapping de données SCL/CIM.',
        en: 'Bidirectional IEC 61850 to IEC 60870-5-104 protocol gateway with SCL/CIM data model mapping.'
      }
    ]
  },
  D13: {
    domainCode: 'D13',
    domainName: { fr: 'Télécommunications de Réseau & CEI 61850', en: 'Communications & Operational Technology' },
    maturityLevel: 5,
    maturityScorePercent: 98,
    status: 'EXCELLENT',
    subdomainsCount: 4,
    documentedSubdomainsCount: 4,
    interactiveWorkbench: true,
    visualSchematicsCount: 8,
    formulasCount: 10,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      {
        fr: 'Station Expert Télécommunications & CEI 61850 à 7 Piliers opérationnelle : Bus de processus Sampled Values (CEI 61850-9-2LE / 61869-9) avec streaming instantané 4000/12800 Hz et capteurs NCIT Rogowski/Faraday, banc de tempête GOOSE avec retransmission exponentielle t0..t5 et priorisation VLAN 802.1Q (PCP=6), simulateur de redondance zéro-perte PRP et anneau HSR (CEI 62439-3), synchronisation PTP IEEE 1588v2 avec modélisation de dérive GNSS holdover OCXO/Rubidium et calcul d\'erreur de phase pour la protection 87, calculateur de bilan de liaison optique OPGW (ITU-T G.652D) avec dispersion chromatique, et banc de couplage courants porteurs (CPL/PLC) avec impédance de self d\'arrêt (Line Trap) et CCVT.',
        en: '7-Pillar Utility Telecommunications & IEC 61850 Engineering Workbench fully operational: IEC 61850-9-2LE/61869-9 Sampled Values streaming at 4000/12800 Hz with Rogowski/Faraday NCIT sensors, station bus GOOSE teleprotection storm simulator with exponential retransmission t0..t5 and IEEE 802.1Q PCP=6 QoS, zero-recovery PRP and HSR redundancy simulator per IEC 62439-3, IEEE 1588v2 PTP time synchronization engine with OCXO/Rubidium GNSS holdover drift modeling and 87 protection phase error assessment, ITU-T G.652D OPGW optical link power budget solver with chromatic dispersion, and high-frequency Power Line Carrier (PLC) coupling bench with Line Trap and CCVT impedance matching.'
      },
      {
        fr: 'Intégration approfondie des cas réels et forensics camerounais : Dorsale nationale OPGW SONATREL (plus de 2500 km, 48 fibres G.652D), analyse forensic du déclenchement intempestif de ligne 225 kV par asymétrie de propagation optique 87L (Δt > 1.5 ms), et architecture de téléconduite Eneo en réseau de distribution 30 kV (radio VHF/UHF et APN 4G LTE privé pour IACM/FLISR).',
        en: 'Deep grounding in authentic Cameroon infrastructure: SONATREL National OPGW Backbone (2500+ km, 48 G.652D fibers), forensic root-cause analysis of 225 kV line tripping via 87L optical teleprotection propagation delay asymmetry (Δt > 1.5 ms), and Eneo 30 kV distribution telecontrol architecture (VHF/UHF radio and private 4G LTE APN for IACM reclosers and FLISR automation).'
      }
    ],
    improvementRoadmap: [
      {
        fr: 'Couplage dynamique avec un validateur syntaxique de fichiers SCL (SCD/ICD) et simulateur de gigue PTP Transparent Clock en réseau TSN (Time-Sensitive Networking).',
        en: 'Dynamic coupling with SCL (SCD/ICD) XML syntax validator and Time-Sensitive Networking (TSN) PTP Transparent Clock jitter modeling.'
      }
    ]
  },
  D14: {
    domainCode: 'D14',
    domainName: { fr: 'Qualité de l\'Énergie & CEM', en: 'Power Quality & EMC' },
    maturityLevel: 5,
    maturityScorePercent: 98,
    status: 'EXCELLENT',
    subdomainsCount: 2,
    documentedSubdomainsCount: 2,
    interactiveWorkbench: true,
    visualSchematicsCount: 7,
    formulasCount: 9,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      {
        fr: 'Station Expert Qualité de l\'Énergie, Harmoniques & CEM à 7 Piliers pleinement opérationnelle : Analyseur de spectre de Fourier discret (harmoniques rangs 2 à 50) avec profilage THDv et THDi selon IEEE 519-2022 et CEI 61000-2-4, solveur de creux de tension (voltage sags CEI 61000-4-30 Classe A) avec gabarit d\'immunité industrielle SEMI F47 et courbe ITIC/CBEMA, banc de filtre actif de puissance (APF) à injection dynamique en opposition de phase par onduleur IGBT (réponse 25 µs), dimensionnement de batterie de condensateurs avec self anti-résonance (désaccord 7% à 189 Hz pour protection anti-explosion sous 5ème harmonique), monitoring de flicker Pst/Plt (CEI 61000-4-15) et déséquilibre en composante inverse V2/V1 (CEI 61000-4-27), et calculateur de détarage de transformateurs (Facteur K selon IEEE C57.110).',
        en: '7-Pillar Power Quality, Harmonic Mitigation & EMC Engineering Workbench fully operational: Discrete Fourier harmonic spectrum analyzer (orders 2 to 50) profiling THDv and THDi per IEEE 519-2022 and IEC 61000-2-4, voltage sag telemetry engine (IEC 61000-4-30 Class A) with SEMI F47 industrial ride-through envelope and ITIC/CBEMA curves, Active Power Filter (APF) parallel injection bench with 25 µs IGBT PWM counter-phase harmonic cancellation, 7% detuned capacitor bank sizing (189 Hz anti-resonance frequency shielding against 5th harmonic capacitor explosions), short/long-term flicker Pst/Plt (IEC 61000-4-15) and negative-sequence unbalance V2/V1 (IEC 61000-4-27) telemetry, and transformer eddy-current K-Factor derating solver per IEEE C57.110.'
      },
      {
        fr: 'Intégration approfondie des cas réels industriels camerounais : Dépollution harmonique et bancs de filtrage résonants 90 kV des redresseurs de puissance de l\'Aluminerie d\'ALUCAM (Édéa - 180 MW), compensation dynamique des à-coups réactifs et flicker des fours à arc de Prometal Aciérie à Douala Bassa, et immunisation SEMI F47 des contacteurs et automates contre les creux de tension d\'origine orageuse dans les cimenteries et brasseries de Douala (Bonabéri/Bassa).',
        en: 'Deep grounding in authentic Cameroon industrial infrastructure: 90 kV harmonic resonant filter banks on heavy smelting rectifiers at ALUCAM (Édéa - 180 MW continuous), dynamic reactive surge and flicker mitigation on Prometal electric arc furnaces in Douala Bassa, and SEMI F47 ride-through shielding on PLC motor starters against storm-induced transmission sags across Douala breweries and cement mills (Bonabéri/Bassa).'
      }
    ],
    improvementRoadmap: [
      {
        fr: 'Intégration d\'un simulateur de propagation d\'interférences électromagnétiques conduites et rayonnées (CEM HF) et modélisation de filtres sinus pour longs câbles VFD.',
        en: 'Integration of high-frequency conducted/radiated EMI propagation model and sine-wave filter simulator for long motor VFD cable leads.'
      }
    ]
  },
  D15: {
    domainCode: 'D15',
    domainName: { fr: 'Comptage Intelligent, Smart Grids & Gestion d\'Actifs', en: 'Metering, Smart Grids & Grid Digitalization' },
    maturityLevel: 5,
    maturityScorePercent: 98,
    status: 'EXCELLENT',
    subdomainsCount: 2,
    documentedSubdomainsCount: 2,
    interactiveWorkbench: true,
    visualSchematicsCount: 7,
    formulasCount: 8,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      {
        fr: 'Station Expert Gestion d\'Actifs, Diagnostic Transformateurs & Smart Grid à 7 Piliers pleinement opérationnelle : Solveur interactif du Triangle de Duval 1 (CEI 60599) avec tracé vectoriel SVG des zones de défaut (PD, T1, T2, T3, D1, D2, DT) et ratios de Rogers (R1, R2, R5) + CO2/CO, calculateur d\'Indice de Santé composite (Health Index ISO 55000 / CIGRE) intégrant tension de claquage Vbd (CEI 60156), humidité, acidité TAN, IFT et furanes 2-FAL (estimation du DP de cellulose), banc de télémétrie de décharges partielles (DP CEI 60270) avec cartographie PRPD 0°-360° et capteurs UHF/HFCT/Acoustique, analyseur fréquentiel SFRA (CEI 60076-18) pour déformation mécanique des bobinages après court-circuit, simulateur d\'architecture AMI et comptage prépaiement STS/DLMS avec calcul de retour sur investissement anti-fraude, et matrice de risque de criticité de parc de transformateurs.',
        en: '7-Pillar Asset Management, Transformer Diagnostics & Smart Grid Engineering Workbench fully operational: Interactive Duval Triangle 1 (IEC 60599) solver with vector SVG fault zoning (PD, T1, T2, T3, D1, D2, DT) and Rogers ratios (R1, R2, R5) + paper CO2/CO degradation tracker, ISO 55000 / CIGRE Composite Health Index calculator incorporating breakdown voltage Vbd (IEC 60156), Karl Fischer moisture, TAN acidity, IFT, and 2-FAL furans (estimating cellulose DP), IEC 60270 Partial Discharge telemetry bench with 0°-360° PRPD clustering and UHF/HFCT/Acoustic sensors, IEC 60076-18 SFRA mechanical winding integrity analyzer post short-circuit, STS/DLMS AMI prepayment smart metering simulator with commercial loss recovery modeling, and multi-unit transformer fleet risk matrix.'
      },
      {
        fr: 'Intégration approfondie des cas réels et du parc d\'actifs camerounais : Traitement d\'huile sous vide poussé et surveillance DGA des transformateurs élévateurs 60 MVA de la centrale hydroélectrique de Songloulou (384 MW), autotransformateurs 225/90 kV du carrefour énergétique de Mangombé (Édéa), audits thermographiques et décharges partielles UHF sur les postes blindés 225 kV de Bekoko et Oyomabang, et déploiement de plus de 500 000 compteurs communicants prépaiement STS par Eneo à Douala et Yaoundé.',
        en: 'Deep grounding in authentic Cameroon power infrastructure: High-vacuum oil dehydration and online DGA monitoring of 60 MVA generator step-up transformers at Songloulou hydroelectric plant (384 MW), 225/90 kV autotransformers at Mangombé transmission hub (Édéa), acoustic and UHF partial discharge surveys on Bekoko and Oyomabang 225 kV GIS substations, and large-scale deployment of 500,000+ STS prepaid smart meters by Eneo across Douala and Yaoundé.'
      }
    ],
    improvementRoadmap: [
      {
        fr: 'Intégration du Triangle de Duval 4 et 5 pour les huiles non-minérales (esters naturels et synthétiques) et algorithmes prédictifs d\'humidité dynamique par capteurs capacitifs.',
        en: 'Integration of Duval Triangles 4 & 5 for alternative ester fluids and dynamic moisture-in-paper equilibrium models.'
      }
    ]
  },
  D16: {
    domainCode: 'D16',
    domainName: { fr: 'Sécurité Électrique, Prises de Terre & Foudre', en: 'Electrical Safety, Earthing & Lightning' },
    maturityLevel: 5,
    maturityScorePercent: 98,
    status: 'EXCELLENT',
    subdomainsCount: 2,
    documentedSubdomainsCount: 2,
    interactiveWorkbench: true,
    visualSchematicsCount: 7,
    formulasCount: 8,
    cameroonCaseGrounded: true,
    internationalCaseGrounded: true,
    safetyFailureModesCovered: true,
    priorityScore: 0,
    auditFindings: [
      {
        fr: 'Station Expert Sécurité Électrique, Prises de Terre & Foudre à 7 Piliers pleinement opérationnelle : Solveur analytique IEEE Std 80-2013 de grille de poste (formule de Sverak, tensions de maille et de pas tolérables 50/70 kg, facteur Cs, résistance Rg et GPR), cartographie 2D du champ équipotentiel et des gradients de bordure, calculateur de risque d\'arc électrique IEEE 1584-2018 / NFPA 70E avec énergie incidente (cal/cm²), frontière d\'arc AFB et sélection d\'EPI, dimensionnement d\'interception foudre par sphère roulante électrogéométrique CEI 62305 (classes I à IV), coordination d\'isolement et sélection de parafoudres ZnO CEI 60099-4 (Uc, Ur, Upl @ 10 kA et marge de protection BIL ≥ 20%), comparateur des 4 régimes de neutre BT (TT, TN-S, TN-C, IT).',
        en: '7-Pillar Electrical Safety, Substation Grounding & Lightning Engineering Workbench fully operational: IEEE Std 80-2013 analytical solver (Sverak formula, 50/70 kg tolerable touch and step potentials, Cs derating, Rg and GPR), 2D surface equipotential voltage field mapping, IEEE 1584-2018 / NFPA 70E arc flash hazard solver with incident energy (cal/cm²), arc flash boundary (AFB) and PPE selection, IEC 62305 rolling sphere lightning interception sizing (LPS Class I-IV), IEC 60099-4 ZnO surge arrester coordination (Uc, Ur, Upl @ 10 kA, BIL margin ≥ 20%), and comprehensive low-voltage grounding schemes comparison (TT, TN-S, TN-C, IT).'
      },
      {
        fr: 'Intégration approfondie des cas réels camerounais : Défi de la très haute résistivité du sol granitique latéritique au poste 225/90 kV d\'Oyomabang (forages profonds 30 m et matelas de gravier 20 cm), nœud 225 kV de Mangombé (protection foudre renforcée sous niveau kéraunique extrême de 145 j/an par parafoudres ZnO classe station SM), et poste côtier 225/90 kV de Bekoko (dimensionnement thermique des grilles de terre sous courant de défaut de 31.5 kA).',
        en: 'Deep grounding in authentic Cameroon infrastructure: High-resistivity granite soil challenges at Oyomabang 225/90 kV substation (30 m deep boreholes and 20 cm crushed rock), Mangombé 225 kV hub lightning protection under extreme 145 thunderstorm days/yr keraunic level with Station-Medium ZnO arresters, and Bekoko 225/90 kV coastal substation ground mesh thermal sizing under 31.5 kA short-circuits.'
      }
    ],
    improvementRoadmap: [
      {
        fr: 'Intégration de la modélisation fréquentielle transitoire à haute fréquence (chocs de foudre raides 1.2/50 µs) dans le maillage de terre.',
        en: 'High-frequency lightning transient surge impedance modeling in earthing meshes.'
      }
    ]
  }
};

export function getOverallPlatformMaturity(): {
  averageScorePercent: number;
  domainsAtLevel5: number;
  domainsAtLevel4: number;
  domainsAtLevel3: number;
  domainsAtLevel2OrLess: number;
  highestPriorityDomain: DomainMaturityReport;
} {
  const reports = Object.values(EPEDE_MATURITY_REGISTRY);
  const totalScore = reports.reduce((acc, r) => acc + r.maturityScorePercent, 0);
  const averageScorePercent = Math.round(totalScore / reports.length);

  const domainsAtLevel5 = reports.filter(r => r.maturityLevel === 5).length;
  const domainsAtLevel4 = reports.filter(r => r.maturityLevel === 4).length;
  const domainsAtLevel3 = reports.filter(r => r.maturityLevel === 3).length;
  const domainsAtLevel2OrLess = reports.filter(r => r.maturityLevel <= 2).length;

  // Domain with priorityScore === 1
  const highestPriorityDomain = reports.sort((a, b) => a.priorityScore - b.priorityScore)[0];

  return {
    averageScorePercent,
    domainsAtLevel5,
    domainsAtLevel4,
    domainsAtLevel3,
    domainsAtLevel2OrLess,
    highestPriorityDomain,
  };
}
